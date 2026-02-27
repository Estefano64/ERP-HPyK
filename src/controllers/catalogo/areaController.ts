import { Request, Response } from 'express';
import Area from '../../models/catalogs/Area';
import Planta from '../../models/catalogs/Planta';
import sequelize from '../../config/database';

// Función para verificar y agregar columnas faltantes
const ensureAreaTableStructure = async () => {
  try {
    console.log('[AREA MIGRATION] Verificando estructura de tabla area...');
    
    // Verificar si la columna planta_codigo existe
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'area' AND column_name = 'planta_codigo'
    `);
    
    if (results.length === 0) {
      console.log('[AREA MIGRATION] Columna planta_codigo no existe, agregándola...');
      await sequelize.query(`
        ALTER TABLE area 
        ADD COLUMN planta_codigo VARCHAR(10)
      `);
      console.log('[AREA MIGRATION] Columna planta_codigo agregada exitosamente');
    } else {
      console.log('[AREA MIGRATION] Columna planta_codigo ya existe');
    }
  } catch (error) {
    console.error('[AREA MIGRATION] Error en migración:', error);
    throw error;
  }
};

export const getAllAreas = async (req: Request, res: Response) => {
  console.log('\n🔍 [GET ALL AREAS] === INICIO DE SOLICITUD ===');
  try {
    console.log('[GET ALL AREAS] Verificando estructura de tabla...');
    await ensureAreaTableStructure();
    
    console.log('[GET ALL AREAS] Intentando obtener áreas...');
    console.log('[GET ALL AREAS] Modelos importados:', { Area: !!Area, Planta: !!Planta });
    
    // Consulta con include
    console.log('[GET ALL AREAS] Realizando consulta con include...');
    const areas = await Area.findAll({
      include: [{ 
        model: Planta, 
        as: 'planta', 
        attributes: ['codigo', 'nombre'],
        required: false  // LEFT JOIN en lugar de INNER JOIN
      }],
      order: [['codigo', 'ASC']]
    });
    
    console.log(`[GET ALL AREAS] ${areas.length} areas encontradas con include`);
    console.log('[GET ALL AREAS] Primera área (ejemplo):', areas[0] ? JSON.stringify(areas[0], null, 2) : 'No hay áreas');
    
    res.json(areas);
  } catch (error) {
    console.error('[GET ALL AREAS] ERROR DETALLADO:');
    console.error('[GET ALL AREAS] Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('[GET ALL AREAS] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('[GET ALL AREAS] Error completo:', error);
    
    res.status(500).json({ 
      error: 'Error al obtener áreas', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : '') : undefined
    });
  }
};

export const getAreaById = async (req: Request, res: Response) => {
  try {
    const { codigo } = req.params;
    const area = await Area.findByPk(codigo as string);
    
    if (!area) {
      return res.status(404).json({ error: 'Área no encontrada' });
    }
    
    res.json(area);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener área', details: error });
  }
};

export const createArea = async (req: Request, res: Response) => {
  try {
    const area = await Area.create(req.body);
    res.status(201).json(area);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear área', details: error });
  }
};

export const updateArea = async (req: Request, res: Response) => {
  try {
    const { codigo } = req.params;
    const [updated] = await Area.update(req.body, { where: { codigo } });
    
    if (!updated) {
      return res.status(404).json({ error: 'Área no encontrada' });
    }
    
    const area = await Area.findByPk(codigo as string);
    res.json(area);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar área', details: error });
  }
};

export const deleteArea = async (req: Request, res: Response) => {
  try {
    const { codigo } = req.params;
    const deleted = await Area.destroy({ where: { codigo } });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Área no encontrada' });
    }
    
    res.json({ message: 'Área eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar área', details: error });
  }
};
