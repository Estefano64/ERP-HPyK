/**
 * Controlador para Compras (Purchase Orders)
 * Maneja la generación de POs desde OTs y su vinculación
 */

import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import Compra from '../../models/Compra';
import CompraDetalle from '../../models/CompraDetalle';
import OTRepuesto from '../../models/OTRepuesto';
import OTHistorial from '../../models/OTHistorial';
import sequelize from '../../config/database';

// Helper para asegurar que el parámetro sea string
const ensureString = (param: string | string[]): string => {
  return Array.isArray(param) ? param[0] : param;
};

// Obtener todas las compras
export const getAllCompras = async (req: Request, res: Response) => {
  try {
    const compras = await sequelize.query(
      `SELECT
        c.*,
        p."razonSocial" as proveedor_nombre,
        a.nombre as almacen_nombre,
        o.ot as ot_numero
      FROM compras c
      LEFT JOIN proveedores p ON c.proveedor_id = p.id
      LEFT JOIN almacenes a ON c.almacen_id = a.id
      LEFT JOIN orden_trabajo o ON c.ot_id = o.id
      ORDER BY c.fecha_solicitud DESC`,
      {
        type: QueryTypes.SELECT
      }
    );
    
    res.json(compras);
  } catch (error) {
    console.error('Error al obtener compras:', error);
    res.status(500).json({ error: 'Error al obtener compras', details: error });
  }
};

// Obtener compra por ID con detalles
export const getCompraById = async (req: Request, res: Response) => {
  try {
    const id = ensureString(req.params.id);
    
    const compra = await sequelize.query(
      `SELECT 
        c.*,
        p.razonSocial as proveedor_nombre,
        a.nombre as almacen_nombre
      FROM compras c
      LEFT JOIN proveedores p ON c.proveedor_id = p.id
      LEFT JOIN almacenes a ON c.almacen_id = a.id
      WHERE c.id = :id`,
      {
        replacements: { id },
        type: QueryTypes.SELECT
      }
    );
    
    if (!compra || compra.length === 0) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }
    
    // Obtener detalles de la compra
    const detalles = await sequelize.query(
      `SELECT
        cd.*,
        m.descripcion as material_nombre,
        m.codigo as material_codigo
      FROM compras_detalle cd
      LEFT JOIN material m ON cd.material_id = m.material_id
      WHERE cd.compra_id = :id`,
      {
        replacements: { id },
        type: QueryTypes.SELECT
      }
    );
    
    res.json({
      ...compra[0],
      detalles
    });
  } catch (error) {
    console.error('Error al obtener compra:', error);
    res.status(500).json({ error: 'Error al obtener compra', details: error });
  }
};

// Generar PO desde una OT con repuestos
export const createCompraFromOT = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { 
      ot_id, 
      proveedor_id, 
      almacen_id, 
      repuestos_ids, 
      fecha_entrega_esperada,
      moneda = 'USD',
      usuario 
    } = req.body;
    
    if (!ot_id || !proveedor_id || !almacen_id || !repuestos_ids || repuestos_ids.length === 0) {
      return res.status(400).json({ 
        error: 'Faltan datos requeridos: ot_id, proveedor_id, almacen_id, repuestos_ids' 
      });
    }
    
    // Obtener los repuestos solicitados
    const repuestos = await OTRepuesto.findAll({
      where: {
        id: repuestos_ids,
        ot_id: ot_id,
        estado: 'Pendiente'
      }
    });
    
    if (repuestos.length === 0) {
      return res.status(400).json({ 
        error: 'No se encontraron repuestos pendientes con los IDs proporcionados' 
      });
    }
    
    // Generar número de PO automático
    const lastPO = await Compra.findOne({
      order: [['id', 'DESC']]
    });
    
    const year = new Date().getFullYear();
    const lastNumber = lastPO ? parseInt(lastPO.numero_po.split('-').pop() || '0') : 0;
    const numero_po = `PO-${year}-${String(lastNumber + 1).padStart(4, '0')}`;
    
    // Obtener información de materiales con precios (simulado por ahora)
    const materialesInfo = await sequelize.query(
      `SELECT m.material_id, m.descripcion, m.precio, m.stock_actual
       FROM material m
       WHERE m.material_id IN (:ids)`,
      {
        replacements: { ids: repuestos.map(r => r.material_id) },
        type: QueryTypes.SELECT
      }
    );

    // Calcular totales
    let subtotal = 0;
    const detallesCompra = repuestos.map((rep: any) => {
      const materialInfo: any = materialesInfo.find((m: any) => m.material_id === rep.material_id);
      const precio = materialInfo?.precio || 0;
      const itemSubtotal = precio * rep.cantidad;
      subtotal += itemSubtotal;
      
      return {
        material_id: rep.material_id,
        cantidad: rep.cantidad,
        precio_unitario: precio,
        subtotal: itemSubtotal,
        descuento: 0,
        impuesto: itemSubtotal * 0.18, // IGV Perú
        total: itemSubtotal * 1.18
      };
    });
    
    const impuesto = subtotal * 0.18;
    const total = subtotal + impuesto;
    
    // Crear la compra
    const compra = await Compra.create({
      numero_po,
      ot_id,
      proveedor_id,
      almacen_id,
      fecha_solicitud: new Date(),
      fecha_entrega_esperada: fecha_entrega_esperada ? new Date(fecha_entrega_esperada) : undefined,
      estado: 'Pendiente',
      subtotal,
      impuesto,
      total,
      moneda,
      usuario_solicita: usuario || 'Admin',
      observaciones: `Generado desde OT #${ot_id}`
    }, { transaction });
    
    // Crear detalles de la compra
    await Promise.all(
      detallesCompra.map(detalle => 
        CompraDetalle.create({
          compra_id: compra.id,
          ...detalle
        }, { transaction })
      )
    );
    
    // Actualizar estado de repuestos a "En PO"
    await Promise.all(
      repuestos.map(rep => 
        rep.update({
          estado: 'En PO',
          po_id: compra.id
        }, { transaction })
      )
    );
    
    // Registrar en historial de OT
    await OTHistorial.create({
      ot_id,
      tipo_operacion: 'Generación PO',
      descripcion: `Orden de Compra ${numero_po} generada con ${repuestos.length} item(s)`,
      usuario: usuario || 'Admin',
      fecha: new Date(),
      datos_adicionales: JSON.stringify({ 
        po_id: compra.id, 
        numero_po, 
        total,
        cantidad_items: repuestos.length 
      })
    }, { transaction });
    
    await transaction.commit();
    
    res.status(201).json({
      message: 'Orden de Compra generada exitosamente',
      compra,
      detalles: detallesCompra
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('Error al generar PO desde OT:', error);
    res.status(400).json({ error: 'Error al generar Orden de Compra', details: error });
  }
};

// Actualizar compra
export const updateCompra = async (req: Request, res: Response) => {
  try {
    const id = ensureString(req.params.id);
    
    const compra = await Compra.findByPk(parseInt(id));
    
    if (!compra) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }
    
    await compra.update(req.body);
    
    res.json(compra);
  } catch (error) {
    console.error('Error al actualizar compra:', error);
    res.status(400).json({ error: 'Error al actualizar compra', details: error });
  }
};

// Obtener todos los requerimientos pendientes de compra (vista central logística)
export const getRequerimientosPendientes = async (req: Request, res: Response) => {
  try {
    const { estado, cliente_id } = req.query;

    const whereClause = estado
      ? `WHERE r.estado = '${estado}'`
      : `WHERE r.estado NOT IN ('COM', 'ANU', 'DEV')`;

    const clienteFilter = cliente_id
      ? ` AND ot.id_cliente = ${cliente_id}`
      : '';

    const query = `
      SELECT
        r.id, r.ot_id, r.material_id, r.cantidad, r.estado, r.estado_cot,
        r.precio_unitario, r.moneda, r.fecha_solicitud, r.fecha_requerida,
        r.observaciones, r.proveedor_id, r.po_id, r.nro_oc,
        r.descripcion, r.tipo_codigo,
        ot.ot as numero_ot, ot.prioridad_atencion_codigo,
        ot.taller_status_codigo, ot.ot_status_codigo,
        ot.equipo_codigo, ot.tipo_reparacion_codigo,
        c.razon_social as cliente_nombre,
        m.descripcion as material_nombre, m.codigo as material_codigo,
        p."razonSocial" as proveedor_nombre,
        comp.numero_po
      FROM ot_repuestos r
      JOIN orden_trabajo ot ON r.ot_id = ot.id
      LEFT JOIN cliente c ON ot.id_cliente = c.cliente_id
      LEFT JOIN material m ON r.material_id = m.material_id
      LEFT JOIN proveedores p ON r.proveedor_id = p.id
      LEFT JOIN compras comp ON r.po_id = comp.id
      ${whereClause}${clienteFilter}
      ORDER BY
        CASE ot.prioridad_atencion_codigo
          WHEN 'E' THEN 1 WHEN '1' THEN 2 WHEN '2' THEN 3 ELSE 4 END,
        r.fecha_solicitud ASC
    `;

    const [results] = await sequelize.query(query);
    res.json(results);
  } catch (error) {
    console.error('Error getRequerimientosPendientes:', error);
    res.status(500).json({ error: 'Error al obtener requerimientos' });
  }
};

// Eliminar compra
export const deleteCompra = async (req: Request, res: Response) => {
  try {
    const id = ensureString(req.params.id);
    
    const compra = await Compra.findByPk(parseInt(id));
    
    if (!compra) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }
    
    if (compra.estado !== 'Pendiente') {
      return res.status(400).json({ 
        error: 'Solo se pueden eliminar compras en estado Pendiente' 
      });
    }
    
    await compra.destroy();
    
    res.json({ message: 'Compra eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar compra:', error);
    res.status(500).json({ error: 'Error al eliminar compra', details: error });
  }
};
