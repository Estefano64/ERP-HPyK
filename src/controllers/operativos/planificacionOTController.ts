import { Request, Response } from 'express';
import PlanificacionOT from '../../models/PlanificacionOT';
import OrdenTrabajo from '../../models/OrdenTrabajo';

// Mapa canónico de operaciones según Excel "Tablas de planificacion.xlsx"
const OPERACIONES: Record<string, Record<string, { codigo: string; desc: string; orden: number }[]>> = {
  CIL: {
    STD: [
      { codigo: 'RELC', desc: 'Rellenado de alojamiento de cilindro', orden: 1 },
      { codigo: 'BARC', desc: 'Barrenado de alojamiento de cilindro', orden: 2 },
      { codigo: 'BRUC', desc: 'Bruñido de cilindro',                  orden: 3 },
    ],
    NOSTD: [
      { codigo: 'COR-C',     desc: 'Corte de cilindro',                         orden: 1 },
      { codigo: 'MAQ-ENBC',  desc: 'Maq. Encastre de brida',                    orden: 2 },
      { codigo: 'MAQ-ENCC',  desc: 'Maq. Encastre de cáncamo / tapa posterior', orden: 3 },
      { codigo: 'ENC-TC',    desc: 'Encastre de tubo de cilindro',               orden: 4 },
      { codigo: 'SOL-JC',    desc: 'Soldadura de juntas de cilindro',            orden: 5 },
      { codigo: 'RELC',      desc: 'Rellenado de alojamiento de cilindro',       orden: 6 },
      { codigo: 'MAQ-DSALC', desc: 'Maq. Diam. Salida de cilindro',             orden: 7 },
      { codigo: 'FAB-SC',    desc: 'Fab dados/soportes de cilindro',             orden: 8 },
      { codigo: 'SOLD SC',   desc: 'Sold. Dados soportes de cilindro',           orden: 9 },
      { codigo: 'FAB-BC',    desc: 'Fab bocina de cilindro',                     orden: 10 },
    ],
  },
  VAS: {
    STD: [
      { codigo: 'RELV', desc: 'Rellenado de alojamiento de vástago', orden: 1 },
      { codigo: 'BARV', desc: 'Barrenado de alojamiento de vástago', orden: 2 },
      { codigo: 'CROV', desc: 'Cromado de vástago',                  orden: 3 },
    ],
    NOSTD: [
      { codigo: 'COR-V',  desc: 'Corte de vástago',                    orden: 1 },
      { codigo: 'ENC-CV', desc: 'Encastre de cáncamo de vástago',      orden: 2 },
      { codigo: 'ENC-BV', desc: 'Encastre de barra de vástago',        orden: 3 },
      { codigo: 'MAQ-EV', desc: 'Maq. Espiga de vástago',              orden: 4 },
      { codigo: 'SOL-JV', desc: 'Soldadura de Junta de vástago',       orden: 5 },
      { codigo: 'RELV',   desc: 'Rellenado de alojamiento de vástago', orden: 6 },
      { codigo: 'MAQ-SV', desc: 'Maq. Soldadura de vástago',           orden: 7 },
      { codigo: 'FAB-BV', desc: 'Fab bocina de vástago',               orden: 8 },
    ],
  },
  TAPA: {
    STD: [
      { codigo: 'PUL-T', desc: 'Pulido de tapa',      orden: 1 },
      { codigo: 'REC-T', desc: 'Rectificado de tapa', orden: 2 },
      { codigo: 'FAB-T', desc: 'Fabricación de tapa', orden: 3 },
    ],
  },
  PISTON: {
    STD: [
      { codigo: 'PUL-P', desc: 'Pulido de pistón',       orden: 1 },
      { codigo: 'REC-P', desc: 'Rectificado de pistón',  orden: 2 },
      { codigo: 'FAB-P', desc: 'Fabricación de pistón',  orden: 3 },
    ],
  },
};

// GET /api/ot/:otId/planificacion
export const getPlanificacionByOT = async (req: Request, res: Response) => {
  try {
    const otId = parseInt(req.params.otId as string);
    const rows = await PlanificacionOT.findAll({
      where: { ot_id: otId },
      order: [['componente', 'ASC'], ['orden', 'ASC']],
    });
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener planificación', details: error.message });
  }
};

// POST /api/ot/:otId/planificacion/generar
// Auto-genera operaciones según reparacion_cil/vas/tapa/piston de la evaluación
export const generatePlanificacion = async (req: Request, res: Response) => {
  try {
    const otId = parseInt(req.params.otId as string);
    const ot = await OrdenTrabajo.findByPk(otId);
    if (!ot) return res.status(404).json({ error: 'OT no encontrada' });

    const camposComp: { campo: string; nombre: string }[] = [
      { campo: 'reparacion_cil',    nombre: 'CIL' },
      { campo: 'reparacion_vas',    nombre: 'VAS' },
      { campo: 'reparacion_tapa',   nombre: 'TAPA' },
      { campo: 'reparacion_piston', nombre: 'PISTON' },
    ];

    // Verificar que al menos un componente tiene clasificación
    const tieneEvaluacion = camposComp.some(c => {
      const v = (ot as any)[c.campo];
      return v && v !== 'NA';
    });
    if (!tieneEvaluacion) {
      return res.status(400).json({
        error: 'La OT no tiene evaluación técnica completada. Complete primero la evaluación STD/NoSTD por componente.'
      });
    }

    // Borrar plan anterior
    await PlanificacionOT.destroy({ where: { ot_id: otId } });

    const creados: PlanificacionOT[] = [];
    for (const comp of camposComp) {
      const valor: string = (ot as any)[comp.campo];
      if (!valor || valor === 'NA') continue;

      const tipo = valor === 'NOSTD' ? 'NOSTD' : 'STD';
      const lista = OPERACIONES[comp.nombre]?.[tipo];
      if (!lista) continue;

      for (const op of lista) {
        const row = await PlanificacionOT.create({
          ot_id: otId,
          componente: comp.nombre,
          operacion_codigo: op.codigo,
          descripcion: op.desc,
          tipo_reparacion: tipo,
          orden: op.orden,
          estado: 'Pendiente',
        });
        creados.push(row);
      }
    }

    res.status(201).json({
      message: `${creados.length} operaciones generadas`,
      operaciones: creados,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al generar planificación', details: error.message });
  }
};

// PUT /api/planificacion/:id
export const updateOperacion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const op = await PlanificacionOT.findByPk(id);
    if (!op) return res.status(404).json({ error: 'Operación no encontrada' });
    await op.update(req.body);
    res.json(op);
  } catch (error: any) {
    res.status(400).json({ error: 'Error al actualizar operación', details: error.message });
  }
};

// DELETE /api/planificacion/:id
export const deleteOperacion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const op = await PlanificacionOT.findByPk(id);
    if (!op) return res.status(404).json({ error: 'Operación no encontrada' });
    await op.destroy();
    res.json({ message: 'Operación eliminada' });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al eliminar operación', details: error.message });
  }
};
