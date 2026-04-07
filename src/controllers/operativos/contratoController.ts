import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import Contrato from '../../models/Contrato';
import sequelize from '../../config/database';

// Obtener todos los contratos (con nombre del cliente y código reparación)
export const getAllContratos = async (_req: Request, res: Response) => {
  try {
    const contratos = await sequelize.query(
      `SELECT c.*, cl.razon_social as cliente_nombre,
              cr.codigo as cod_rep_codigo, cr.descripcion as cod_rep_descripcion
       FROM contrato c
       LEFT JOIN cliente cl ON c.cliente_id = cl.cliente_id
       LEFT JOIN codigo_reparacion cr ON c.cod_rep_id = cr.cod_rep_id
       ORDER BY c.fecha_termino DESC`,
      { type: QueryTypes.SELECT }
    );
    res.json(contratos);
  } catch (error) {
    console.error('Error al obtener contratos:', error);
    res.status(500).json({ error: 'Error al obtener contratos', details: error });
  }
};

// Obtener contratos vigentes de un cliente
export const getContratosByCliente = async (req: Request, res: Response) => {
  try {
    const clienteId = req.params.clienteId;
    const hoy = new Date().toISOString().split('T')[0];

    const contratos = await sequelize.query(
      `SELECT c.*, cl.razon_social as cliente_nombre
       FROM contrato c
       LEFT JOIN cliente cl ON c.cliente_id = cl.cliente_id
       WHERE c.cliente_id = :clienteId
         AND c.activo = true
         AND c.fecha_inicio <= :hoy
         AND c.fecha_termino >= :hoy
       ORDER BY c.fecha_termino DESC`,
      { replacements: { clienteId, hoy }, type: QueryTypes.SELECT }
    );
    res.json(contratos);
  } catch (error) {
    console.error('Error al obtener contratos del cliente:', error);
    res.status(500).json({ error: 'Error al obtener contratos', details: error });
  }
};

// Buscar contrato vigente por cliente + código de reparación
export const getContratoMatch = async (req: Request, res: Response) => {
  try {
    const { clienteId, codRepId } = req.query;
    if (!clienteId || !codRepId) {
      return res.status(400).json({ error: 'Se requiere clienteId y codRepId' });
    }
    const hoy = new Date().toISOString().split('T')[0];

    const contratos: any[] = await sequelize.query(
      `SELECT c.*, cl.razon_social as cliente_nombre,
              cr.codigo as cod_rep_codigo, cr.descripcion as cod_rep_descripcion
       FROM contrato c
       LEFT JOIN cliente cl ON c.cliente_id = cl.cliente_id
       LEFT JOIN codigo_reparacion cr ON c.cod_rep_id = cr.cod_rep_id
       WHERE c.cliente_id = :clienteId
         AND c.cod_rep_id = :codRepId
         AND c.activo = true
         AND c.fecha_inicio <= :hoy
         AND c.fecha_termino >= :hoy
       ORDER BY c.fecha_termino DESC
       LIMIT 1`,
      { replacements: { clienteId, codRepId, hoy }, type: QueryTypes.SELECT }
    );

    if (contratos.length > 0) {
      res.json({ found: true, contrato: contratos[0] });
    } else {
      res.json({ found: false, contrato: null });
    }
  } catch (error) {
    console.error('Error al buscar contrato match:', error);
    res.status(500).json({ error: 'Error al buscar contrato', details: error });
  }
};

// Crear contrato
export const createContrato = async (req: Request, res: Response) => {
  try {
    const contrato = await Contrato.create(req.body);
    res.status(201).json(contrato);
  } catch (error) {
    console.error('Error al crear contrato:', error);
    res.status(400).json({ error: 'Error al crear contrato', details: error });
  }
};

// Actualizar contrato
export const updateContrato = async (req: Request, res: Response) => {
  try {
    const contrato = await Contrato.findByPk(parseInt(req.params.id as string));
    if (!contrato) return res.status(404).json({ error: 'Contrato no encontrado' });
    await contrato.update(req.body);
    res.json(contrato);
  } catch (error) {
    console.error('Error al actualizar contrato:', error);
    res.status(400).json({ error: 'Error al actualizar contrato', details: error });
  }
};

// Eliminar contrato
export const deleteContrato = async (req: Request, res: Response) => {
  try {
    const contrato = await Contrato.findByPk(parseInt(req.params.id as string));
    if (!contrato) return res.status(404).json({ error: 'Contrato no encontrado' });
    await contrato.destroy();
    res.json({ message: 'Contrato eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar contrato:', error);
    res.status(500).json({ error: 'Error al eliminar contrato', details: error });
  }
};
