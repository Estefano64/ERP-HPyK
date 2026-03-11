import { Request, Response } from 'express';
import OrdenTrabajo from '../../models/OrdenTrabajo';
import { ValidationError, Op, QueryTypes } from 'sequelize';
import sequelize from '../../config/database';

// Genera el siguiente número de OT: OT-{AÑO}-{SEC:3}
const generarNumeroOT = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `OT-${year}-`;
  const result = await sequelize.query(
    `SELECT ot FROM orden_trabajo WHERE ot LIKE :prefix ORDER BY ot DESC LIMIT 1`,
    { replacements: { prefix: `${prefix}%` }, type: QueryTypes.SELECT }
  ) as any[];
  let siguiente = 1;
  if (result.length > 0 && result[0].ot) {
    const partes = result[0].ot.split('-');
    const ultimo = parseInt(partes[partes.length - 1]) || 0;
    siguiente = ultimo + 1;
  }
  return `${prefix}${String(siguiente).padStart(3, '0')}`;
};

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
    if (!fecha_requerimiento_cliente) {
      return res.status(400).json({ error: 'La fecha de requerimiento del cliente es requerida' });
    }

    // Generar número de OT automáticamente si no viene del cliente
    const numeroOT = (ot && ot.trim()) ? ot.trim() : await generarNumeroOT();

    const nuevaOrden = await OrdenTrabajo.create({
      ot: numeroOT,
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
    const otId = parseInt(id as string);

    // Eliminar registros dependientes antes de borrar la OT
    await sequelize.query(`DELETE FROM ot_repuestos WHERE ot_id = :otId`, { replacements: { otId }, type: QueryTypes.DELETE });
    await sequelize.query(`DELETE FROM ot_historial WHERE ot_id = :otId`, { replacements: { otId }, type: QueryTypes.DELETE });

    const deleted = await OrdenTrabajo.destroy({ where: { id: otId } });
    
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

// Vista unificada de seguimiento de producción — avance por componente de todas las OTs activas
export const getProduccionTracking = async (req: Request, res: Response) => {
  try {
    const { prioridad, taller_status, search } = req.query;

    let whereClause = `WHERE ot.ot_status_codigo = 'Abierta'`;
    if (prioridad) whereClause += ` AND ot.prioridad_atencion_codigo = '${String(prioridad).replace(/'/g, "''")}'`;
    if (taller_status) whereClause += ` AND ot.taller_status_codigo = '${String(taller_status).replace(/'/g, "''")}'`;
    if (search) {
      const s = String(search).replace(/'/g, "''");
      whereClause += ` AND (ot.ot ILIKE '%${s}%' OR ot.equipo_codigo ILIKE '%${s}%' OR c.razon_social ILIKE '%${s}%')`;
    }

    const query = `
      SELECT
        ot.id, ot.ot, ot.descripcion, ot.equipo_codigo, ot.tipo_reparacion_codigo, ot.np,
        ot.prioridad_atencion_codigo, ot.taller_status_codigo, ot.ot_status_codigo,
        ot.recursos_status_codigo,
        COALESCE(ot.pct_cilindro, 0)    AS pct_cilindro,
        COALESCE(ot.pct_vastago, 0)     AS pct_vastago,
        COALESCE(ot.pct_tapa, 0)        AS pct_tapa,
        COALESCE(ot.pct_piston, 0)      AS pct_piston,
        COALESCE(ot.pct_cuerpo_int_1, 0) AS pct_cuerpo_int_1,
        COALESCE(ot.pct_cuerpo_int_2, 0) AS pct_cuerpo_int_2,
        COALESCE(ot.pct_otros, 0)       AS pct_otros,
        ot.fecha_recepcion, ot.fecha_requerimiento_cliente,
        ROUND(
          (COALESCE(ot.pct_cilindro,0) + COALESCE(ot.pct_vastago,0) +
           COALESCE(ot.pct_tapa,0)    + COALESCE(ot.pct_piston,0)) / 4.0, 1
        ) AS pct_general,
        c.razon_social AS cliente_nombre
      FROM orden_trabajo ot
      LEFT JOIN cliente c ON ot.id_cliente = c.cliente_id
      ${whereClause}
      ORDER BY
        CASE ot.prioridad_atencion_codigo
          WHEN 'E' THEN 1 WHEN '1' THEN 2 WHEN '2' THEN 3 ELSE 4 END,
        ot.fecha_recepcion ASC NULLS LAST
    `;

    const [results] = await sequelize.query(query);
    res.json(results);
  } catch (error: any) {
    console.error('Error getProduccionTracking:', error);
    res.status(500).json({ error: 'Error al obtener seguimiento de producción', details: error.message });
  }
};

// Devuelve el siguiente número de OT disponible (para preview en el formulario)
export const getNextOtNumber = async (req: Request, res: Response) => {
  try {
    const numero = await generarNumeroOT();
    res.json({ numero_ot: numero });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al generar número OT', details: error.message });
  }
};
