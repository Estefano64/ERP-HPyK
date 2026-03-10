import { Request, Response } from 'express';
import RegistroProduccion from '../../models/RegistroProduccion';

export const getAllRegistrosProduccion = async (req: Request, res: Response) => {
  try {
    const registros = await RegistroProduccion.findAll({
      order: [['fecha', 'DESC']],
    });
    res.json(registros);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registros de producción', details: error });
  }
};

export const getRegistroProduccionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const registro = await RegistroProduccion.findByPk(parseInt(id as string), {
    });
    
    if (!registro) {
      return res.status(404).json({ error: 'Registro de producción no encontrado' });
    }
    
    res.json(registro);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registro de producción', details: error });
  }
};

export const createRegistroProduccion = async (req: Request, res: Response) => {
  try {
    const nuevoRegistro = await RegistroProduccion.create(req.body);
    res.status(201).json(nuevoRegistro);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear registro de producción', details: error });
  }
};

export const updateRegistroProduccion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const registro = await RegistroProduccion.findByPk(parseInt(id as string));
    
    if (!registro) {
      return res.status(404).json({ error: 'Registro de producción no encontrado' });
    }
    
    await registro.update(req.body);
    res.json(registro);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar registro de producción', details: error });
  }
};

export const deleteRegistroProduccion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const registro = await RegistroProduccion.findByPk(parseInt(id as string));
    
    if (!registro) {
      return res.status(404).json({ error: 'Registro de producción no encontrado' });
    }
    
    await registro.destroy();
    res.json({ message: 'Registro de producción eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar registro de producción', details: error });
  }
};
