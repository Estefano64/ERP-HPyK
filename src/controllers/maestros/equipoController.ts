import { Request, Response } from 'express';
import Equipo from '../../models/Equipo';
import StatusEquipo from '../../models/catalogs/StatusEquipo';
import Area from '../../models/catalogs/Area';
import SubArea from '../../models/catalogs/SubArea';
import TipoEquipo from '../../models/catalogs/TipoEquipo';
import Planta from '../../models/catalogs/Planta';
import Criticidad from '../../models/catalogs/Criticidad';
import UnidadMedida from '../../models/catalogs/UnidadMedida';
import Fabricante from '../../models/catalogs/Fabricante';

export const getAllEquipos = async (req: Request, res: Response) => {
  console.log('\n[GET ALL EQUIPOS] === INICIO DE SOLICITUD ===');
  try {
    console.log('[GET ALL EQUIPOS] Intentando obtener equipos...');
    const equipos = await Equipo.findAll({
      include: [
        { model: StatusEquipo, as: 'status', attributes: ['codigo', 'descripcion'] },
        { model: Area, as: 'area', attributes: ['codigo', 'nombre'] },
        { model: SubArea, as: 'sub_area', attributes: ['codigo', 'nombre'] },
        { model: TipoEquipo, as: 'tipo', attributes: ['codigo', 'descripcion'] },
        { model: Planta, as: 'planta', attributes: ['codigo', 'nombre'] },
        { model: Criticidad, as: 'criticidad', attributes: ['codigo', 'descripcion'] },
        { model: UnidadMedida, as: 'unidad_medida', attributes: ['codigo', 'descripcion'] },
        { model: Fabricante, as: 'fabricante', attributes: ['codigo', 'nombre'] }
      ],
      order: [['equipo_id', 'ASC']]
    });
    console.log(`[GET ALL EQUIPOS] ${equipos.length} equipos encontrados`);
    console.log('[GET ALL EQUIPOS] Primer equipo (ejemplo):', equipos[0] ? JSON.stringify(equipos[0], null, 2).substring(0, 500) + '...' : 'No hay equipos');
    res.json(equipos);
  } catch (error) {
    console.error('[GET ALL EQUIPOS] ERROR DETALLADO:');
    console.error('[GET ALL EQUIPOS] Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('[GET ALL EQUIPOS] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ 
      error: 'Error al obtener equipos', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getEquipoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const equipo = await Equipo.findByPk(parseInt(id as string), {
      include: [
        { model: StatusEquipo, as: 'status' },
        { model: Area, as: 'area' },
        { model: SubArea, as: 'sub_area' },
        { model: TipoEquipo, as: 'tipo' },
        { model: Planta, as: 'planta' },
        { model: Criticidad, as: 'criticidad' },
        { model: UnidadMedida, as: 'unidad_medida' },
        { model: Fabricante, as: 'fabricante' }
      ]
    });
    
    if (!equipo) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
    
    res.json(equipo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener equipo', details: error });
  }
};

export const createEquipo = async (req: Request, res: Response) => {
  try {
    const equipo = await Equipo.create(req.body);
    res.status(201).json(equipo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear equipo', details: error });
  }
};

export const updateEquipo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await Equipo.update(req.body, { where: { equipo_id: id } });
    
    if (!updated) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
    
    const equipo = await Equipo.findByPk(parseInt(id as string));
    res.json(equipo);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar equipo', details: error });
  }
};

export const deleteEquipo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Equipo.destroy({ where: { equipo_id: id } });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
    
    res.json({ message: 'Equipo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar equipo', details: error });
  }
};
