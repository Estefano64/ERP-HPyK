import { Request, Response } from 'express';
import OrdenTrabajo from '../../models/OrdenTrabajo';
import { ValidationError, Op } from 'sequelize';
import sequelize from '../../config/database';

// Obtener todas las órdenes de trabajo con paginación y filtros
export const getAllOrdenesTrabajo = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      id_cliente,
      ot_status_codigo,
      fecha_inicio,
      fecha_fin
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    
    // Construir condiciones de filtro
    const whereClause: any = {};
    
    if (search) {
      whereClause[Op.or] = [
        { ot: { [Op.iLike]: `%${search}%` } },
        { descripcion: { [Op.iLike]: `%${search}%` } },
        { equipo_codigo: { [Op.iLike]: `%${search}%` } },
        { ns: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (id_cliente) whereClause.id_cliente = id_cliente;
    if (ot_status_codigo) whereClause.ot_status_codigo = ot_status_codigo;
    
    if (fecha_inicio && fecha_fin) {
      whereClause.fecha_creacion = {
        [Op.between]: [fecha_inicio, fecha_fin]
      };
    }

    const { rows: ordenes, count } = await OrdenTrabajo.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset: offset,
      order: [['id', 'DESC']],
    });

    res.json({
      ordenes,
      totalOrdenes: count,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page)
    });

  } catch (error: any) {
    console.error('Error al obtener órdenes de trabajo:', error);
    res.status(500).json({ 
      error: 'Error al obtener órdenes de trabajo', 
      details: error.message 
    });
  }
};

// Obtener una orden de trabajo por ID
export const getOrdenTrabajoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const ordenTrabajo = await OrdenTrabajo.findByPk(parseInt(id as string));
    
    if (!ordenTrabajo) {
      return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
    }
    
    res.json(ordenTrabajo);
  } catch (error: any) {
    console.error('Error al obtener orden de trabajo:', error);
    res.status(500).json({ 
      error: 'Error al obtener orden de trabajo', 
      details: error.message 
    });
  }
};

// Crear una nueva orden de trabajo
export const createOrdenTrabajo = async (req: Request, res: Response) => {
  try {
    const {
      ot,
      id_cliente,
      estrategia,
      id_cod_rep,
      tipo,
      np,
      descripcion,
      id_fabricante,
      cod_rep_flota,
      cod_rep_posicion,
      equipo_codigo,
      ns,
      plaqueteo,
      wo_cliente,
      po_cliente,
      id_viajero,
      guia_remision,
      empresa_entrega,
      fecha_recepcion,
      pcr,
      horas,
      garantia_codigo,
      atencion_reparacion_codigo,
      tipo_reparacion_codigo,
      tipo_garantia_codigo,
      prioridad_atencion_codigo,
      contrato_dias,
      base_metalica_codigo,
      comentarios,
      fecha_requerimiento_cliente,
      ot_status_codigo,
      recursos_status_codigo,
      taller_status_codigo
    } = req.body;

    // Validaciones básicas
    if (!ot_status_codigo) {
      return res.status(400).json({ error: 'El estado de la OT es requerido' });
    }

    const nuevaOrden = await OrdenTrabajo.create({
      ot,
      id_cliente,
      estrategia,
      id_cod_rep,
      tipo,
      np,
      descripcion,
      id_fabricante,
      cod_rep_flota,
      cod_rep_posicion,
      equipo_codigo,
      ns,
      plaqueteo,
      wo_cliente,
      po_cliente,
      id_viajero,
      guia_remision,
      empresa_entrega,
      fecha_recepcion: fecha_recepcion ? new Date(fecha_recepcion) : undefined,
      pcr,
      horas,
      garantia_codigo,
      atencion_reparacion_codigo,
      tipo_reparacion_codigo,
      tipo_garantia_codigo,
      prioridad_atencion_codigo,
      contrato_dias,
      base_metalica_codigo,
      comentarios,
      fecha_requerimiento_cliente: fecha_requerimiento_cliente ? new Date(fecha_requerimiento_cliente) : undefined,
      ot_status_codigo,
      recursos_status_codigo,
      taller_status_codigo,
      usuario_crea: req.body.usuario_crea || 'sistema',
      fecha_creacion: new Date()
    });

    res.status(201).json({
      message: 'Orden de trabajo creada exitosamente',
      ordenTrabajo: nuevaOrden
    });

  } catch (error: any) {
    console.error('Error al crear orden de trabajo:', error);
    
    if (error instanceof ValidationError) {
      const validationErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({ 
        error: 'Error de validación',
        details: validationErrors
      });
    }

    res.status(500).json({ 
      error: 'Error al crear orden de trabajo', 
      details: error.message 
    });
  }
};

// Actualizar una orden de trabajo
export const updateOrdenTrabajo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const ordenExistente = await OrdenTrabajo.findByPk(parseInt(id as string));
    if (!ordenExistente) {
      return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
    }

    // Preparar campos de fecha
    const updateData = { ...req.body };
    if (updateData.fecha_recepcion) {
      updateData.fecha_recepcion = new Date(updateData.fecha_recepcion);
    }
    if (updateData.fecha_requerimiento_cliente) {
      updateData.fecha_requerimiento_cliente = new Date(updateData.fecha_requerimiento_cliente);
    }
    
    updateData.usuario_actualiza = req.body.usuario_actualiza || 'sistema';
    updateData.fecha_actualizacion = new Date();

    const [updated] = await OrdenTrabajo.update(updateData, { 
      where: { id: parseInt(id as string) } 
    });
    
    if (updated) {
      const ordenActualizada = await OrdenTrabajo.findByPk(parseInt(id as string));
      res.json({
        message: 'Orden de trabajo actualizada exitosamente',
        ordenTrabajo: ordenActualizada
      });
    } else {
      res.status(400).json({ error: 'No se pudo actualizar la orden de trabajo' });
    }

  } catch (error: any) {
    console.error('Error al actualizar orden de trabajo:', error);
    
    if (error instanceof ValidationError) {
      const validationErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({ 
        error: 'Error de validación',
        details: validationErrors
      });
    }

    res.status(500).json({ 
      error: 'Error al actualizar orden de trabajo', 
      details: error.message 
    });
  }
};

// Eliminar una orden de trabajo
export const deleteOrdenTrabajo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deleted = await OrdenTrabajo.destroy({ where: { id: parseInt(id as string) } });
    
    if (deleted) {
      res.json({ message: 'Orden de trabajo eliminada exitosamente' });
    } else {
      res.status(404).json({ error: 'Orden de trabajo no encontrada' });
    }

  } catch (error: any) {
    console.error('Error al eliminar orden de trabajo:', error);
    res.status(500).json({ 
      error: 'Error al eliminar orden de trabajo', 
      details: error.message 
    });
  }
};

// Actualizar el estado de una orden de trabajo
export const updateEstadoOrdenTrabajo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ot_status_codigo, recursos_status_codigo, taller_status_codigo } = req.body;
    
    const ordenExistente = await OrdenTrabajo.findByPk(parseInt(id as string));
    if (!ordenExistente) {
      return res.status(404).json({ error: 'Orden de trabajo no encontrada' });
    }

    const updateData: any = {};
    if (ot_status_codigo) updateData.ot_status_codigo = ot_status_codigo;
    if (recursos_status_codigo) updateData.recursos_status_codigo = recursos_status_codigo;
    if (taller_status_codigo) updateData.taller_status_codigo = taller_status_codigo;
    
    updateData.usuario_actualiza = req.body.usuario_actualiza || 'sistema';
    updateData.fecha_actualizacion = new Date();

    const [updated] = await OrdenTrabajo.update(updateData, { 
      where: { id: parseInt(id as string) } 
    });
    
    if (updated) {
      const ordenActualizada = await OrdenTrabajo.findByPk(parseInt(id as string));
      res.json({
        message: 'Estado de orden de trabajo actualizado exitosamente',
        ordenTrabajo: ordenActualizada
      });
    } else {
      res.status(400).json({ error: 'No se pudo actualizar el estado' });
    }

  } catch (error: any) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ 
      error: 'Error al actualizar estado de orden de trabajo', 
      details: error.message 
    });
  }
};

// Obtener estadísticas de órdenes de trabajo
export const getEstadisticasOrdenesTrabajo = async (req: Request, res: Response) => {
  try {
    const totalOrdenes = await OrdenTrabajo.count();
    
    const estadisticasPorEstado = await OrdenTrabajo.findAll({
      attributes: [
        'ot_status_codigo',
        [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
      ],
      group: ['ot_status_codigo'],
      raw: true
    });

    const estadisticasPorCliente = await OrdenTrabajo.findAll({
      attributes: [
        'id_cliente',
        [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
      ],
      where: {
        id_cliente: { [Op.not]: null as any }
      },
      group: ['id_cliente'],
      limit: 10,
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      raw: true
    });

    const promedioHoras = await OrdenTrabajo.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('horas')), 'promedio']
      ],
      raw: true
    }) as any;

    const estadisticasPorMes = await OrdenTrabajo.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('fecha_creacion')), 'mes'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
      ],
      where: {
        fecha_creacion: {
          [Op.gte]: new Date(new Date().getFullYear(), 0, 1)
        }
      },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('fecha_creacion'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('fecha_creacion')), 'ASC']],
      raw: true
    });

    res.json({
      totalOrdenes,
      estadisticasPorEstado,
      estadisticasPorCliente,
      promedioHoras: promedioHoras?.promedio || 0,
      estadisticasPorMes
    });

  } catch (error: any) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      error: 'Error al obtener estadísticas', 
      details: error.message 
    });
  }
};
