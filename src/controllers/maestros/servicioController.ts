import { Request, Response } from 'express';
import Servicio from '../../models/Servicio';

export const getAllServicios = async (req: Request, res: Response) => {
  try {
    const servicios = await Servicio.findAll({
      order: [['servicio_id', 'ASC']]
    });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener servicios', details: error });
  }
};

export const getServicioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const servicio = await Servicio.findByPk(parseInt(id as string));
    
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener servicio', details: error });
  }
};

export const createServicio = async (req: Request, res: Response) => {
  try {
    const servicio = await Servicio.create(req.body);
    res.status(201).json(servicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear servicio', details: error });
  }
};

export const updateServicio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await Servicio.update(req.body, { where: { servicio_id: id } });
    
    if (!updated) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    const servicio = await Servicio.findByPk(parseInt(id as string));
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar servicio', details: error });
  }
};

export const deleteServicio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Servicio.destroy({ where: { servicio_id: id } });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar servicio', details: error });
  }
};
