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
      // Crear los repuestos
      const repuestosCreados = await Promise.all(
        repuestos.map((rep: any) => 
          OTRepuesto.create({
            ot_id: parseInt(otId),
            material_id: rep.material_id,
            cantidad: rep.cantidad,
            proveedor_id: rep.proveedor_id || null,
            observaciones: rep.observaciones || null,
            estado: 'Pendiente',
            usuario_solicita: usuario || 'Admin',
            fecha_solicitud: new Date()
          }, { transaction })
        )
      );
      
      // Registrar en el historial
      await OTHistorial.create({
        ot_id: parseInt(otId),
        tipo_operacion: 'Solicitud Repuestos',
        descripcion: `Solicitud de ${repuestos.length} repuesto(s)`,
        usuario: usuario || 'Admin',
        fecha: new Date(),
        datos_adicionales: JSON.stringify({ cantidad_items: repuestos.length })
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

// Actualizar estado de un repuesto
export const updateRepuesto = async (req: Request, res: Response) => {
  try {
    const id = ensureString(req.params.id);
    const { estado, usuario_aprueba, po_id } = req.body;
    
    const repuesto = await OTRepuesto.findByPk(parseInt(id));
    
    if (!repuesto) {
      return res.status(404).json({ error: 'Repuesto no encontrado' });
    }
    
    const updates: any = { estado };
    
    if (estado === 'Aprobado' && usuario_aprueba) {
      updates.usuario_aprueba = usuario_aprueba;
      updates.fecha_aprobacion = new Date();
    }
    
    if (po_id) {
      updates.po_id = po_id;
      updates.estado = 'En PO';
    }
    
    await repuesto.update(updates);
    
    // Registrar en historial
    await OTHistorial.create({
      ot_id: repuesto.ot_id,
      tipo_operacion: 'Cambio Estado',
      descripcion: `Repuesto ${id} cambió a estado: ${estado}`,
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

    // 5. Crear repuestos
    const creados: any[] = [];
    for (const tarea of tareas) {
      let material_id: number | null = null;

      if (tarea.material_codigo) {
        const mat = await Material.findOne({ where: { codigo: tarea.material_codigo } });
        material_id = mat ? mat.material_id : null;
        if (material_id !== null && materialesExistentes.has(material_id)) {
          continue; // ya existe este material — omitir
        }
      }

      const repuesto = await OTRepuesto.create({
        ot_id: otId,
        material_id: material_id ?? undefined,  // undefined = omitido por Sequelize si es null
        descripcion: tarea.descripcion || tarea.ref_descripcion || '',
        tipo_codigo: tarea.tipo_codigo,
        cantidad: tarea.requerimiento,
        texto: tarea.texto || undefined,
        precio_unitario: tarea.precio || undefined,
        estado: 'Pendiente',
        usuario_solicita: usuario || 'Admin',
        fecha_solicitud: new Date()
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
    
    if (repuesto.estado !== 'Pendiente') {
      return res.status(400).json({ 
        error: 'Solo se pueden eliminar repuestos en estado Pendiente' 
      });
    }
    
    await repuesto.destroy();
    
    res.json({ message: 'Repuesto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar repuesto:', error);
    res.status(500).json({ error: 'Error al eliminar repuesto', details: error });
  }
};
