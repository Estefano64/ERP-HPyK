import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Estrategia from '../../models/Estrategia';
import Equipo from '../../models/Equipo';
import Tarea from '../../models/Tarea';
import UnidadMedida from '../../models/catalogs/UnidadMedida';
import Area from '../../models/catalogs/Area';
import Planta from '../../models/catalogs/Planta';
import Criticidad from '../../models/catalogs/Criticidad';

// 13.3 - Tabla de frecuencia de mantenimiento (vista unificada)
export const getTablaFrecuenciaMantenimiento = async (req: Request, res: Response) => {
  try {
    const estrategias = await Estrategia.findAll({
      include: [
        { model: Area, as: 'area' },
        { model: Equipo, as: 'equipo' },
        { model: UnidadMedida, as: 'unidad_medida' },
      ],
      order: [['equipo_codigo', 'ASC'], ['frecuencia', 'ASC']],
    });

    res.json(estrategias);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener la tabla de frecuencia de mantenimiento', details: error.message });
  }
};

// 13.4 - Parque de equipos (resumen básico por criticidad y planta)
export const getParqueEquiposResumen = async (req: Request, res: Response) => {
  try {
    const equipos = await Equipo.findAll({
      include: [
        { model: Planta, as: 'planta' },
        { model: Area, as: 'area' },
        { model: Criticidad, as: 'criticidad' },
      ],
      order: [['codigo', 'ASC']],
    });

    res.json(equipos);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener el parque de equipos', details: error.message });
  }
};

// 13.5 y 13.7 - Equipos prontos a recibir mantenimiento / notificación a producción
export const getEquiposProximosMantenimiento = async (req: Request, res: Response) => {
  try {
    const diasAviso = Number(req.query.diasAviso ?? 7);
    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() + diasAviso);

    const estrategias = await Estrategia.findAll({
      where: {
        fecha_proxima_ejecucion: {
          [Op.between]: [hoy, limite],
        },
      },
      include: [
        { model: Equipo, as: 'equipo', include: [
          { model: Planta, as: 'planta' },
          { model: Area, as: 'area' },
          { model: Criticidad, as: 'criticidad' },
        ] },
        { model: UnidadMedida, as: 'unidad_medida' },
      ],
      order: [['fecha_proxima_ejecucion', 'ASC']],
    });

    res.json({
      hoy,
      hasta: limite,
      total: estrategias.length,
      estrategias,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener equipos próximos a mantenimiento', details: error.message });
  }
};

// 13.6 - Solicitud de requerimientos desde la estrategia (Task List)
export const getRequerimientosPorEstrategia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const estrategia = await Estrategia.findByPk(parseInt(id as string));

    if (!estrategia) {
      return res.status(404).json({ error: 'Estrategia no encontrada' });
    }

    const tareas = await Tarea.findAll({
      where: { actividad_codigo: estrategia.actividad_codigo },
      order: [['item_numero', 'ASC']],
    });

    res.json({ estrategia, tareas });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener requerimientos de materiales/servicios', details: error.message });
  }
};
