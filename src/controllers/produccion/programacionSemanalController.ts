import { Request, Response } from 'express';
import sequelize from '../../config/database';
import { QueryTypes } from 'sequelize';
import PlanificacionOT from '../../models/PlanificacionOT';

// GET /api/produccion/programacion-semanal?semana=2026W15
export const getTasksBySemana = async (req: Request, res: Response) => {
  try {
    const semana = req.query.semana as string;
    if (!semana) {
      return res.status(400).json({ error: 'Parámetro semana requerido (ej: 2026W15)' });
    }

    // Tareas asignadas a esta semana
    const assigned = await sequelize.query(`
      SELECT
        p.id AS tarea_id,
        ot.id AS ot_id,
        ot.ot,
        c.razon_social AS cliente,
        ot.cod_rep_flota AS flota,
        ot.descripcion AS ot_descripcion,
        p.componente AS parte,
        p.descripcion AS tarea,
        p.operacion_codigo,
        p.tipo_reparacion,
        p.semana_plan,
        p.tecnico AS operario,
        p.maquina AS equipo,
        p.horas_estimadas AS duracion,
        p.horas_extras AS he,
        p.horas_extras_qty,
        p.fecha_inicio,
        p.fecha_fin,
        p.qty_personal,
        p.estado,
        p.orden
      FROM planificacion_ot p
      INNER JOIN orden_trabajo ot ON p.ot_id = ot.id
      LEFT JOIN cliente c ON ot.id_cliente = c.cliente_id
      WHERE p.semana_plan = :semana
        AND ot.ot_status_codigo = 'Abierta'
      ORDER BY p.maquina ASC, p.fecha_inicio ASC, ot.ot ASC, p.orden ASC
    `, {
      type: QueryTypes.SELECT,
      replacements: { semana },
    });

    // Tareas de OTs abiertas sin semana asignada (candidatas para asignar)
    const unassigned = await sequelize.query(`
      SELECT
        p.id AS tarea_id,
        ot.id AS ot_id,
        ot.ot,
        c.razon_social AS cliente,
        p.componente AS parte,
        p.descripcion AS tarea,
        p.operacion_codigo,
        p.horas_estimadas AS duracion,
        p.maquina AS equipo,
        p.tecnico AS operario,
        p.estado
      FROM planificacion_ot p
      INNER JOIN orden_trabajo ot ON p.ot_id = ot.id
      LEFT JOIN cliente c ON ot.id_cliente = c.cliente_id
      WHERE (p.semana_plan IS NULL OR p.semana_plan = '')
        AND ot.ot_status_codigo = 'Abierta'
        AND (p.estado IS NULL OR p.estado NOT IN ('Completado', 'Cancelado', 'Realizado'))
      ORDER BY ot.ot ASC, p.componente ASC, p.orden ASC
    `, { type: QueryTypes.SELECT });

    res.json({ assigned, unassigned });
  } catch (error: any) {
    console.error('Error programacion-semanal:', error);
    res.status(500).json({ error: 'Error al obtener programación semanal', details: error.message });
  }
};

// PUT /api/produccion/programacion-semanal/bulk
export const bulkUpdateTasks = async (req: Request, res: Response) => {
  try {
    const tasks: any[] = req.body.tasks;
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: 'Se requiere un array de tareas' });
    }

    let updated = 0;
    for (const t of tasks) {
      const op = await PlanificacionOT.findByPk(t.id);
      if (!op) continue;

      await op.update({
        ...(t.fecha_inicio !== undefined && { fecha_inicio: t.fecha_inicio }),
        ...(t.fecha_fin !== undefined && { fecha_fin: t.fecha_fin }),
        ...(t.maquina !== undefined && { maquina: t.maquina }),
        ...(t.tecnico !== undefined && { tecnico: t.tecnico }),
        ...(t.semana_plan !== undefined && { semana_plan: t.semana_plan }),
        ...(t.horas_estimadas !== undefined && { horas_estimadas: t.horas_estimadas }),
        ...(t.estado !== undefined && { estado: t.estado }),
      });
      updated++;
    }

    res.json({ ok: true, updated });
  } catch (error: any) {
    console.error('Error bulk update:', error);
    res.status(400).json({ error: 'Error al actualizar tareas', details: error.message });
  }
};
