import { Request, Response } from 'express';
import Receta from '../../models/Receta';

export const getAllRecetas = async (req: Request, res: Response) => {
  try {
    const recetas = await Receta.findAll({
      order: [['nombre', 'ASC']],
    });
    res.json(recetas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recetas', details: error });
  }
};

export const getRecetaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const receta = await Receta.findByPk(parseInt(id as string), {
    });
    
    if (!receta) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    
    res.json(receta);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener receta', details: error });
  }
};

export const createReceta = async (req: Request, res: Response) => {
  try {
    const nuevaReceta = await Receta.create(req.body);
    res.status(201).json(nuevaReceta);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear receta', details: error });
  }
};

export const updateReceta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const receta = await Receta.findByPk(parseInt(id as string));
    
    if (!receta) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    
    await receta.update(req.body);
    res.json(receta);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar receta', details: error });
  }
};

export const deleteReceta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const receta = await Receta.findByPk(parseInt(id as string));
    
    if (!receta) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    
    await receta.destroy();
    res.json({ message: 'Receta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar receta', details: error });
  }
};
