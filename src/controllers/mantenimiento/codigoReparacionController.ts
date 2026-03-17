import { Request, Response } from 'express';
import { Op } from 'sequelize';
import CodigoReparacion from '../../models/CodigoReparacion';

// Buscar CodRep por NP (número de parte del cilindro) — para autocomplete en formulario OT
export const searchByNP = async (req: Request, res: Response) => {
  try {
    const np = (req.query.np as string || '').trim();
    if (!np) return res.json([]);
    const results = await CodigoReparacion.findAll({
      where: { np: { [Op.iLike]: `%${np}%` } },
      order: [['np', 'ASC'], ['codigo', 'ASC']],
      limit: 20,
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar por NP', details: error });
  }
};

export const getAllCodigosReparacion = async (req: Request, res: Response) => {
  try {
    const codigos = await CodigoReparacion.findAll({
      order: [['codigo', 'ASC']],
    });
    res.json(codigos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener códigos de reparación', details: error });
  }
};

export const getCodigoReparacionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const codigo = await CodigoReparacion.findByPk(parseInt(id as string));
    
    if (!codigo) {
      return res.status(404).json({ error: 'Código de reparación no encontrado' });
    }
    
    res.json(codigo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener código de reparación', details: error });
  }
};

export const createCodigoReparacion = async (req: Request, res: Response) => {
  try {
    const nuevoCodigo = await CodigoReparacion.create(req.body);
    res.status(201).json(nuevoCodigo);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear código de reparación', details: error });
  }
};

export const updateCodigoReparacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const codigo = await CodigoReparacion.findByPk(parseInt(id as string));
    
    if (!codigo) {
      return res.status(404).json({ error: 'Código de reparación no encontrado' });
    }
    
    await codigo.update(req.body);
    res.json(codigo);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar código de reparación', details: error });
  }
};

export const deleteCodigoReparacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const codigo = await CodigoReparacion.findByPk(parseInt(id as string));
    
    if (!codigo) {
      return res.status(404).json({ error: 'Código de reparación no encontrado' });
    }
    
    await codigo.destroy();
    res.json({ message: 'Código de reparación eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar código de reparación', details: error });
  }
};
