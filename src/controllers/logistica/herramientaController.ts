import { Request, Response } from 'express';
import Herramienta from '../../models/Herramienta';

export const getAllHerramientas = async (req: Request, res: Response) => {
  try {
    const herramientas = await Herramienta.findAll({
      order: [['nombre', 'ASC']],
    });
    res.json(herramientas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener herramientas', details: error });
  }
};

export const getHerramientaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const herramienta = await Herramienta.findByPk(parseInt(id as string));
    
    if (!herramienta) {
      return res.status(404).json({ error: 'Herramienta no encontrada' });
    }
    
    res.json(herramienta);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener herramienta', details: error });
  }
};

export const createHerramienta = async (req: Request, res: Response) => {
  try {
    const nuevaHerramienta = await Herramienta.create(req.body);
    res.status(201).json(nuevaHerramienta);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear herramienta', details: error });
  }
};

export const updateHerramienta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const herramienta = await Herramienta.findByPk(parseInt(id as string));
    
    if (!herramienta) {
      return res.status(404).json({ error: 'Herramienta no encontrada' });
    }
    
    await herramienta.update(req.body);
    res.json(herramienta);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar herramienta', details: error });
  }
};

export const deleteHerramienta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const herramienta = await Herramienta.findByPk(parseInt(id as string));
    
    if (!herramienta) {
      return res.status(404).json({ error: 'Herramienta no encontrada' });
    }
    
    await herramienta.destroy();
    res.json({ message: 'Herramienta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar herramienta', details: error });
  }
};

export const checkOutHerramienta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { cantidad, tecnico } = req.body;
    
    const herramienta = await Herramienta.findByPk(parseInt(id as string));
    
    if (!herramienta) {
      return res.status(404).json({ error: 'Herramienta no encontrada' });
    }
    
    const disponibles = herramienta.stock - herramienta.asignadas;
    
    if (cantidad > disponibles) {
      return res.status(400).json({ 
        error: 'No hay suficientes herramientas disponibles',
        disponibles,
        solicitadas: cantidad
      });
    }
    
    const nuevasAsignadas = herramienta.asignadas + cantidad;
    await herramienta.update({ asignadas: nuevasAsignadas });
    
    // Update estado based on stock
    const nuevoDisponibles = herramienta.stock - nuevasAsignadas;
    let nuevoEstado: 'Disponible' | 'Bajo Stock' | 'Agotado' = 'Disponible';
    if (nuevoDisponibles === 0) nuevoEstado = 'Agotado';
    else if (nuevoDisponibles <= 5) nuevoEstado = 'Bajo Stock';
    
    await herramienta.update({ estado: nuevoEstado });
    
    res.json({ 
      message: 'Herramienta asignada correctamente',
      herramienta,
      tecnico,
      cantidad
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al asignar herramienta', details: error });
  }
};

export const checkInHerramienta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;
    
    const herramienta = await Herramienta.findByPk(parseInt(id as string));
    
    if (!herramienta) {
      return res.status(404).json({ error: 'Herramienta no encontrada' });
    }
    
    if (cantidad > herramienta.asignadas) {
      return res.status(400).json({ 
        error: 'No se puede devolver más de lo asignado',
        asignadas: herramienta.asignadas,
        solicitadas: cantidad
      });
    }
    
    const nuevasAsignadas = herramienta.asignadas - cantidad;
    await herramienta.update({ asignadas: nuevasAsignadas });
    
    // Update estado based on stock
    const nuevoDisponibles = herramienta.stock - nuevasAsignadas;
    let nuevoEstado: 'Disponible' | 'Bajo Stock' | 'Agotado' = 'Disponible';
    if (nuevoDisponibles === 0) nuevoEstado = 'Agotado';
    else if (nuevoDisponibles <= 5) nuevoEstado = 'Bajo Stock';
    
    await herramienta.update({ estado: nuevoEstado });
    
    res.json({ 
      message: 'Herramienta devuelta correctamente',
      herramienta,
      cantidad
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al devolver herramienta', details: error });
  }
};
