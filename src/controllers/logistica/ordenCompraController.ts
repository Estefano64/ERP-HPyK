import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import OrdenCompra from '../../models/OrdenCompra';
import OrdenCompraView from '../../models/OrdenCompraView';
import Proveedor from '../../models/Proveedor';
import sequelize from '../../config/database';

// Obtener todas las órdenes de compra con filtros (basado en la imagen)
export const getAllOrdenesCompra = async (req: Request, res: Response) => {
  try {
    const { centroCosto, fechaOrden, page = 1, limit = 10 } = req.query;
    
    let whereClause = '';
    let orderClause = 'ORDER BY oc.fecha DESC';
    
    // Aplicar filtros
    const conditions: string[] = [];
    
    if (centroCosto && centroCosto !== 'todos') {
      conditions.push(`oc.centro_costo = '${centroCosto}'`);
    }
    
    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }
    
    // Configurar ordenamiento
    if (fechaOrden === 'asc') {
      orderClause = 'ORDER BY oc.fecha ASC';
    }
    
    const offset = (Number(page) - 1) * Number(limit);
    
    const ordenes = await sequelize.query(
      `SELECT 
        oc.id,
        oc.serie,
        oc.correlativo,
        oc.fecha,
        oc.fecha_recepcion_guia,
        oc.fecha_pago,
        oc.identificador_externo,
        oc.tipo_documento,
        oc.ruc_receptor,
        oc.receptor,
        oc.division,
        oc.importe_total,
        oc.estado,
        oc.centro_costo,
        oc.moneda,
        oc.createdAt,
        oc.updatedAt
      FROM ordenes_compra_view oc
      ${whereClause}
      ${orderClause}
      LIMIT ${limit} OFFSET ${offset}`,
      { 
        type: QueryTypes.SELECT 
      }
    );

    // Obtener total de registros para paginación
    const totalResult = await sequelize.query(
      `SELECT COUNT(*) as total FROM ordenes_compra_view oc ${whereClause}`,
      { type: QueryTypes.SELECT }
    );
    
    const total = (totalResult[0] as any).total;
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      data: ordenes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(total),
        totalPages
      }
    });
    
  } catch (error) {
    console.error('Error al obtener órdenes de compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const getOrdenCompraById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ordenCompra = await OrdenCompra.findByPk(parseInt(id as string), {
      include: [{ model: Proveedor, as: 'proveedor' }],
    });
    
    if (!ordenCompra) {
      return res.status(404).json({ error: 'Orden de compra no encontrada' });
    }
    
    res.json(ordenCompra);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener orden de compra', details: error });
  }
};

export const createOrdenCompra = async (req: Request, res: Response) => {
  try {
    const nuevaOrdenCompra = await OrdenCompra.create(req.body);
    res.status(201).json(nuevaOrdenCompra);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear orden de compra', details: error });
  }
};

export const updateOrdenCompra = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ordenCompra = await OrdenCompra.findByPk(parseInt(id as string));
    
    if (!ordenCompra) {
      return res.status(404).json({ error: 'Orden de compra no encontrada' });
    }
    
    await ordenCompra.update(req.body);
    res.json(ordenCompra);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar orden de compra', details: error });
  }
};

export const deleteOrdenCompra = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ordenCompra = await OrdenCompra.findByPk(parseInt(id as string));
    
    if (!ordenCompra) {
      return res.status(404).json({ error: 'Orden de compra no encontrada' });
    }
    
    await ordenCompra.destroy();
    res.json({ message: 'Orden de compra eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar orden de compra', details: error });
  }
};

// Crear nueva orden de compra (vista moderna)
export const createOrdenCompraView = async (req: Request, res: Response) => {
  try {
    const {
      serie,
      correlativo,
      fecha,
      rucReceptor,
      receptor,
      tipoDocumento,
      importeTotal,
      centroCosto = 'administracion',
      moneda = 'USD',
      division = '',
      identificadorExterno = ''
    } = req.body;

    // Validar campos requeridos
    if (!serie || !correlativo || !fecha || !rucReceptor || !receptor || !tipoDocumento || !importeTotal) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos'
      });
    }

    // Crear la orden en la vista
    const nuevaOrden = await OrdenCompraView.create({
      serie,
      correlativo,
      fecha,
      ruc_receptor: rucReceptor,
      receptor,
      tipo_documento: tipoDocumento,
      importe_total: parseFloat(importeTotal),
      centro_costo: centroCosto,
      moneda,
      division,
      identificador_externo: identificadorExterno,
      estado: 'Pendiente'
    });

    res.status(201).json({
      success: true,
      message: 'Orden de compra creada exitosamente',
      data: nuevaOrden
    });
    
  } catch (error) {
    console.error('Error al crear orden de compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear orden de compra',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Exportar a Excel
export const exportarOrdenesExcel = async (req: Request, res: Response) => {
  try {
    const { centroCosto, fechaOrden } = req.query;
    
    let whereClause = '';
    const conditions: string[] = [];
    
    if (centroCosto && centroCosto !== 'todos') {
      conditions.push(`centro_costo = '${centroCosto}'`);
    }
    
    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }
    
    const ordenes = await sequelize.query(
      `SELECT 
        serie,
        correlativo,
        fecha,
        fecha_recepcion_guia,
        fecha_pago,
        tipo_documento,
        ruc_receptor,
        receptor,
        importe_total,
        moneda,
        estado
      FROM ordenes_compra_view
      ${whereClause}
      ORDER BY fecha DESC`,
      { type: QueryTypes.SELECT }
    );

    res.json({
      success: true,
      message: 'Datos preparados para exportación',
      data: ordenes,
      filename: `ordenes_compra_${new Date().toISOString().split('T')[0]}.xlsx`
    });
    
  } catch (error) {
    console.error('Error al exportar órdenes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener estadísticas del dashboard
export const getEstadisticasOrdenes = async (req: Request, res: Response) => {
  try {
    const stats = await sequelize.query(
      `SELECT 
        COUNT(*) as total_ordenes,
        COUNT(CASE WHEN estado = 'Pendiente' THEN 1 END) as ordenes_pendientes,
        COUNT(CASE WHEN fecha_pago IS NOT NULL THEN 1 END) as ordenes_pagadas,
        SUM(importe_total) as monto_total,
        AVG(importe_total) as monto_promedio
      FROM ordenes_compra_view
      WHERE fecha >= DATE_TRUNC('month', CURRENT_DATE)`,
      { type: QueryTypes.SELECT }
    );

    res.json({
      success: true,
      data: stats[0]
    });
    
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
