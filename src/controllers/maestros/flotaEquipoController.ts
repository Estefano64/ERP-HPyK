import { Request, Response } from 'express';
import FlotaEquipo from '../../models/catalogs/FlotaEquipo';

export const getAllFlotasEquipo = async (req: Request, res: Response) => {
  try {
    const flotas = await FlotaEquipo.findAll({
      order: [['codigo', 'ASC']]
    });
    res.json(flotas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener flotas de equipo', details: error });
  }
};

export const getFlotaEquipoById = async (req: Request, res: Response) => {
  try {
    const { codigo } = req.params;
    const flota = await FlotaEquipo.findByPk(codigo as string);
    
    if (!flota) {
      return res.status(404).json({ error: 'Flota de equipo no encontrada' });
    }
    
    res.json(flota);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener flota de equipo', details: error });
  }
};

export const createFlotaEquipo = async (req: Request, res: Response) => {
  try {
    const flota = await FlotaEquipo.create(req.body);
    res.status(201).json(flota);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear flota de equipo', details: error });
  }
};

export const updateFlotaEquipo = async (req: Request, res: Response) => {
  try {
    const { codigo } = req.params;
    const [updated] = await FlotaEquipo.update(req.body, { where: { codigo } });
    
    if (!updated) {
      return res.status(404).json({ error: 'Flota de equipo no encontrada' });
    }
    
    const flota = await FlotaEquipo.findByPk(codigo as string);
    res.json(flota);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar flota de equipo', details: error });
  }
};

export const deleteFlotaEquipo = async (req: Request, res: Response) => {
  try {
    const { codigo } = req.params;
    const deleted = await FlotaEquipo.destroy({ where: { codigo } });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Flota de equipo no encontrada' });
    }
    
    res.json({ message: 'Flota de equipo eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar flota de equipo', details: error });
  }
};
