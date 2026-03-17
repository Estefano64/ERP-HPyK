/**
 * Controlador para Repuestos de Órdenes de Trabajo
 * Maneja las solicitudes de repuestos vinculadas a OTs
 */

import { Request, Response } from 'express';
import { Op, QueryTypes } from 'sequelize';
import OTRepuesto from '../../models/OTRepuesto';
import OTHistorial from '../../models/OTHistorial';
import OrdenTrabajo from '../../models/OrdenTrabajo';
import CodigoReparacion from '../../models/CodigoReparacion';
import Tarea from '../../models/Tarea';
import Material from '../../models/Material';
import sequelize from '../../config/database';

// Helper para asegurar que el parámetro sea string
const ensureString = (param: string | string[]): string => {
  return Array.isArray(param) ? param[0] : param;
};

// Obtener todos los repuestos de una OT
export const getRepuestosByOT = async (req: Request, res: Response) => {
  try {
    const otId = ensureString(req.params.otId);
    
    const repuestos = await sequelize.query(
      `SELECT
        otr.*,
        m.descripcion as material_nombre,
        m.codigo as material_codigo,
        p."razonSocial" as proveedor_nombre,
        po.numero_po as po_numero
      FROM ot_repuestos otr
      LEFT JOIN material m ON otr.material_id = m.material_id
      LEFT JOIN proveedores p ON otr.proveedor_id = p.id
      LEFT JOIN compras po ON otr.po_id = po.id
      WHERE otr.ot_id = :otId
      ORDER BY otr.fecha_solicitud DESC`,
      {
        replacements: { otId },
        type: QueryTypes.SELECT
      }
    );
    
    res.json(repuestos);
  } catch (error) {
    console.error('Error al obtener repuestos:', error);
    res.status(500).json({ error: 'Error al obtener repuestos de la OT', details: error });
  }
};

// Crear solicitud de repuestos para una OT
export const createRepuestos = async (req: Request, res: Response) => {
  try {
    const otId = ensureString(req.params.otId);
    const { repuestos, usuario } = req.body;
    
    if (!Array.isArray(repuestos) || repuestos.length === 0) {
      return res.status(400).json({ error: 'Debe proporcionar al menos un repuesto' });
    }
    
    // Iniciar transacción
    const transaction = await sequelize.transaction();
    
    try {
      // Generar nro_req si no viene (auto-incremental por OT)
      let nro_req = repuestos[0]?.nro_req;
      if (!nro_req) {
        const [lastRow]: any = await sequelize.query(
          `SELECT nro_req FROM ot_repuestos WHERE ot_id = :otId AND nro_req IS NOT NULL ORDER BY nro_req DESC LIMIT 1`,
          { replacements: { otId }, type: QueryTypes.SELECT }
        );
        const lastSeq = lastRow ? parseInt((lastRow.nro_req || '').split('-').pop() || '0') : 0;
        nro_req = `${otId}-REQ-${String(lastSeq + 1).padStart(3, '0')}`;
      }

      // Crear los ítems del requerimiento
      const repuestosCreados = await Promise.all(
        repuestos.map((rep: any, idx: number) =>
          OTRepuesto.create({
            ot_id:             parseInt(otId),
            nro_req,
            item_req:          idx + 1,
            material_id:       rep.material_id       || undefined,
            tipo_codigo:       rep.tipo_codigo       || 'MAC',
            descripcion:       rep.descripcion       || undefined,
            fabricante_codigo: rep.fabricante_codigo || rep.modelo_marca || undefined,
            texto:             rep.nro_parte         || rep.texto        || undefined,
            cantidad:          rep.cantidad,
            unidad_medida:     rep.unidad_medida     || 'UNIDAD',
            fecha_requerida:   rep.fecha_requerida   || undefined,
            observaciones:     rep.observaciones     || undefined,
            estado:            'PDT APROBACION',
            usuario_solicita:  usuario || 'Admin',
            fecha_solicitud:   new Date()
          }, { transaction })
        )
      );

      // Registrar en el historial
      await OTHistorial.create({
        ot_id: parseInt(otId),
        tipo_operacion: 'Solicitud Repuestos',
        descripcion: `Requerimiento ${nro_req}: ${repuestos.length} ítem(s)`,
        usuario: usuario || 'Admin',
        fecha: new Date(),
        datos_adicionales: JSON.stringify({ nro_req, cantidad_items: repuestos.length })
      }, { transaction });
      
      await transaction.commit();
      
      res.status(201).json({ 
        message: 'Repuestos solicitados correctamente',
        repuestos: repuestosCreados 
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error al crear solicitud de repuestos:', error);
    res.status(400).json({ error: 'Error al crear solicitud de repuestos', details: error });
  }
};

// Actualizar repuesto (estado, cotización, OC, almacén — cualquier campo)
export const updateRepuesto = async (req: Request, res: Response) => {
  try {
    const id = ensureString(req.params.id);
    const {
      estado, usuario_aprueba, po_id,
      // Descripción / parte
      descripcion, texto,
      // Cotización
      proveedor_id, precio_unitario, precio_venta, moneda, estado_cot,
      fecha_entrega_esperada, fecha_requerida, observaciones,
      // OC / recepción
      nro_oc, fecha_oc, nro_guia, nro_factura_proveedor, fecha_entrega_real,
      // Almacén
      ubicacion, fecha_salida_almacen, fecha_envio_mina, fecha_facturacion,
      factura_cliente, gr_mina,
    } = req.body;

    const repuesto = await OTRepuesto.findByPk(parseInt(id));

    if (!repuesto) {
      return res.status(404).json({ error: 'Repuesto no encontrado' });
    }

    const updates: any = {};

    // Estado y aprobación
    if (estado !== undefined) updates.estado = estado;
    if (estado === 'Aprobado' && usuario_aprueba) {
      updates.usuario_aprueba = usuario_aprueba;
      updates.fecha_aprobacion = new Date();
    }
    if (po_id) { updates.po_id = po_id; updates.estado = 'En PO'; }

    // Descripción / parte
    if (descripcion !== undefined) updates.descripcion = descripcion;
    if (texto !== undefined) updates.texto = texto;

    // Cotización
    if (proveedor_id !== undefined) updates.proveedor_id = proveedor_id;
    if (precio_unitario !== undefined) updates.precio_unitario = precio_unitario;
    if (precio_venta !== undefined) updates.precio_venta = precio_venta;
    if (moneda !== undefined) updates.moneda = moneda;
    if (estado_cot !== undefined) updates.estado_cot = estado_cot;
    if (fecha_entrega_esperada !== undefined) updates.fecha_entrega_esperada = fecha_entrega_esperada;
    if (fecha_requerida !== undefined) updates.fecha_requerida = fecha_requerida;
    if (observaciones !== undefined) updates.observaciones = observaciones;

    // OC y recepción
    if (nro_oc !== undefined) updates.nro_oc = nro_oc;
    if (fecha_oc !== undefined) updates.fecha_oc = fecha_oc;
    if (nro_guia !== undefined) updates.nro_guia = nro_guia;
    if (nro_factura_proveedor !== undefined) updates.nro_factura_proveedor = nro_factura_proveedor;
    if (fecha_entrega_real !== undefined) updates.fecha_entrega_real = fecha_entrega_real;

    // Almacén
    if (ubicacion !== undefined) updates.ubicacion = ubicacion;
    if (fecha_salida_almacen !== undefined) updates.fecha_salida_almacen = fecha_salida_almacen;
    if (fecha_envio_mina !== undefined) updates.fecha_envio_mina = fecha_envio_mina;
    if (fecha_facturacion !== undefined) updates.fecha_facturacion = fecha_facturacion;
    if (factura_cliente !== undefined) updates.factura_cliente = factura_cliente;
    if (gr_mina !== undefined) updates.gr_mina = gr_mina;

    await repuesto.update(updates);

    // Registrar en historial
    await OTHistorial.create({
      ot_id: repuesto.ot_id,
      tipo_operacion: 'Cambio Estado',
      descripcion: `Repuesto ${id} actualizado${estado ? ': estado=' + estado : ''}`,
      usuario: usuario_aprueba || 'Admin',
      fecha: new Date(),
      datos_adicionales: JSON.stringify({ repuesto_id: id, estado_anterior: repuesto.estado, estado_nuevo: estado })
    });
    
    res.json(repuesto);
  } catch (error) {
    console.error('Error al actualizar repuesto:', error);
    res.status(400).json({ error: 'Error al actualizar repuesto', details: error });
  }
};

// Generar repuestos automáticamente desde el Task List del CodRep de la OT
export const createRepuestosFromTaskList = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const otId = parseInt(req.params.otId as string);
    const { usuario } = req.body;

    // 1. Obtener OT
    const ot = await OrdenTrabajo.findByPk(otId);
    if (!ot) {
      await transaction.rollback();
      return res.status(404).json({ error: 'OT no encontrada' });
    }
    if (!ot.id_cod_rep) {
      await transaction.rollback();
      return res.status(400).json({ error: 'OT no tiene CodRep asignado' });
    }

    // 2. Obtener CodigoReparacion
    const codRep = await CodigoReparacion.findByPk(ot.id_cod_rep);
    if (!codRep) {
      await transaction.rollback();
      return res.status(404).json({ error: 'CodRep no encontrado' });
    }

    // 3. Obtener task list por codigo string o por np_cod1 (fallback)
    const tareas = await Tarea.findAll({
      where: {
        [Op.or]: [
          { cod_rep_codigo: codRep.codigo },
          ...(codRep.np ? [{ np_cod1: codRep.np }] : [])
        ]
      },
      order: [['item_numero', 'ASC']]
    });

    if (!tareas.length) {
      await transaction.rollback();
      return res.status(404).json({ error: 'No hay task list para este CodRep' });
    }

    // 4. Materiales ya en la OT (evitar duplicados)
    const existentes = await OTRepuesto.findAll({ where: { ot_id: otId } });
    const materialesExistentes = new Set(
      existentes.map((r: any) => r.material_id).filter((id: any) => id != null)
    );

    // 5. Generar un único nro_req para todos los ítems del task list
    const [lastReqRow]: any = await sequelize.query(
      `SELECT nro_req FROM ot_repuestos WHERE ot_id = :otId AND nro_req IS NOT NULL ORDER BY nro_req DESC LIMIT 1`,
      { replacements: { otId }, type: QueryTypes.SELECT }
    );
    const lastSeq = lastReqRow ? parseInt((lastReqRow.nro_req || '').split('-REQ-').pop() || '0') : 0;
    const nro_req = `${otId}-REQ-${String(lastSeq + 1).padStart(3, '0')}`;

    // 6. Crear todos los ítems bajo el mismo nro_req
    const creados: any[] = [];
    let item_req = 1;
    for (const tarea of tareas) {
      let material_id: number | null = null;
      let precio_unitario: number | undefined = tarea.precio || undefined;
      let fabricante_codigo: string | undefined;
      let unidad_medida: string = 'UNIDAD';

      // Buscar material: primero por codigo, luego por NP del ítem (col N del Excel)
      let mat: any = null;
      if (tarea.material_codigo) {
        mat = await Material.findOne({ where: { codigo: tarea.material_codigo } });
        material_id = mat ? mat.material_id : null;
      }
      if (material_id === null && tarea.np) {
        mat = await Material.findOne({ where: { np: tarea.np } });
        if (mat) material_id = mat.material_id;
      }

      if (mat) {
        if (!precio_unitario && mat.precio)            precio_unitario  = mat.precio;
        if (mat.fabricante_codigo)                     fabricante_codigo = mat.fabricante_codigo;
        if (mat.unidad_medida_codigo)                  unidad_medida    = mat.unidad_medida_codigo;
      }

      if (material_id !== null && materialesExistentes.has(material_id)) {
        continue; // ya existe este material — omitir
      }

      const repuesto = await OTRepuesto.create({
        ot_id: otId,
        nro_req,
        item_req: item_req++,
        material_id:       material_id ?? undefined,
        descripcion:       tarea.tipo_codigo === 'SER'
                             ? (tarea.texto || tarea.ref_descripcion || tarea.descripcion || '')
                             : (tarea.ref_descripcion || tarea.np || tarea.descripcion || ''),
        tipo_codigo:       tarea.tipo_codigo,
        fabricante_codigo,                        // marca del material
        texto:             tarea.tipo_codigo === 'SER'
                             ? undefined                                               // SER: descripción ya tiene el texto
                             : (tarea.np || mat?.np || mat?.codigo || undefined),      // MAC: NP tarea → NP material → código material
        cantidad:          tarea.requerimiento,
        unidad_medida,
        precio_unitario,
        estado:            'PDT APROBACION',
        usuario_solicita:  ot.usuario_crea || usuario || 'Admin',
        fecha_solicitud:   new Date()
      }, { transaction });

      creados.push(repuesto);
    }

    // 6. Registrar en historial
    await OTHistorial.create({
      ot_id: otId,
      tipo_operacion: 'Otro',
      descripcion: `Task List generado: ${creados.length} ítem(s) desde CodRep ${codRep.codigo}`,
      usuario: usuario || 'Admin',
      fecha: new Date(),
      datos_adicionales: JSON.stringify({ cod_rep: codRep.codigo, items: creados.length })
    }, { transaction });

    await transaction.commit();
    res.status(201).json({
      message: `${creados.length} repuesto(s) generados desde Task List`,
      repuestos: creados
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error createRepuestosFromTaskList:', error);
    res.status(500).json({ error: 'Error al generar desde task list', details: error });
  }
};

// Eliminar repuesto (solo si está en estado Pendiente)
export const deleteRepuesto = async (req: Request, res: Response) => {
  try {
    const id = ensureString(req.params.id);
    
    const repuesto = await OTRepuesto.findByPk(parseInt(id));
    
    if (!repuesto) {
      return res.status(404).json({ error: 'Repuesto no encontrado' });
    }
    
    const estadosEliminables = ['Pendiente', 'PDT APROBACION'];
    if (!estadosEliminables.includes(repuesto.estado)) {
      return res.status(400).json({
        error: 'Solo se pueden eliminar repuestos en estado Pendiente o PDT APROBACION'
      });
    }
    
    await repuesto.destroy();
    
    res.json({ message: 'Repuesto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar repuesto:', error);
    res.status(500).json({ error: 'Error al eliminar repuesto', details: error });
  }
};
