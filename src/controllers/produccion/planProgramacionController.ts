import { Request, Response } from 'express';
import sequelize from '../../config/database';
import { QueryTypes } from 'sequelize';
import PlanificacionOT from '../../models/PlanificacionOT';

// GET /api/produccion/plan-programacion
// Devuelve todas las tareas de OTs abiertas combinando info OT + tarea
export const getAllTareasProgramadas = async (_req: Request, res: Response) => {
  try {
    const rows = await sequelize.query(`
      SELECT
        p.id AS tarea_id,
        ot.id AS ot_id,
        ot.ot,
        c.razon_social AS cliente,
        ot.cod_rep_flota AS flota,
        ot.descripcion,
        ot.fecha_recepcion,
        ot.prioridad_atencion_codigo AS prioridad,
        ot.fecha_requerimiento_cliente,
        ot.taller_status_codigo AS taller_status,
        p.orden AS nro_tarea,
        p.componente AS parte,
        p.descripcion AS tarea,
        p.operacion_codigo,
        p.tipo_reparacion,
        p.semana_plan,
        p.tecnico AS operario,
        p.maquina AS equipo,
        p.horas_extras AS he,
        p.horas_extras_qty,
        p.fecha_inicio AS inicio_estimado,
        p.fecha_fin AS fin_estimado,
        p.horas_estimadas AS duracion,
        p.qty_personal,
        p.estado
      FROM planificacion_ot p
      INNER JOIN orden_trabajo ot ON p.ot_id = ot.id
      LEFT JOIN cliente c ON ot.id_cliente = c.cliente_id
      WHERE ot.ot_status_codigo = 'Abierta'
      ORDER BY ot.ot ASC, p.componente ASC, p.orden ASC
    `, { type: QueryTypes.SELECT });

    res.json(rows);
  } catch (error: any) {
    console.error('Error plan-programacion:', error);
    res.status(500).json({ error: 'Error al obtener planificación', details: error.message });
  }
};

// PUT /api/produccion/plan-programacion/:id
// Actualiza campos editables de una tarea desde la vista de programación
export const updateTareaProgramada = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const op = await PlanificacionOT.findByPk(id);
    if (!op) return res.status(404).json({ error: 'Tarea no encontrada' });

    const {
      semana_plan,
      tecnico,
      maquina,
      horas_extras,
      horas_extras_qty,
      fecha_inicio,
      fecha_fin,
      horas_estimadas,
      qty_personal,
      estado,
    } = req.body;

    await op.update({
      ...(semana_plan !== undefined && { semana_plan }),
      ...(tecnico !== undefined && { tecnico }),
      ...(maquina !== undefined && { maquina }),
      ...(horas_extras !== undefined && { horas_extras }),
      ...(horas_extras_qty !== undefined && { horas_extras_qty }),
      ...(fecha_inicio !== undefined && { fecha_inicio }),
      ...(fecha_fin !== undefined && { fecha_fin }),
      ...(horas_estimadas !== undefined && { horas_estimadas }),
      ...(qty_personal !== undefined && { qty_personal }),
      ...(estado !== undefined && { estado }),
    });

    res.json(op);
  } catch (error: any) {
    res.status(400).json({ error: 'Error al actualizar tarea', details: error.message });
  }
};
