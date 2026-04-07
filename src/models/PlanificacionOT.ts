import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface PlanificacionOTAttributes {
  id?: number;
  ot_id: number;
  componente: string;       // CIL, VAS, TAPA, PISTON
  operacion_codigo: string; // RELC, BARC, BRUC, etc.
  descripcion: string;
  tipo_reparacion?: string; // STD, NOSTD
  orden: number;
  horas_estimadas?: number;
  fecha_inicio?: Date | string;
  fecha_fin?: Date | string;
  tecnico?: string;
  maquina?: string;
  estado?: string;          // Pendiente, Programado, Completado, Cancelado
  observaciones?: string;
  semana_plan?: string;     // Ej: 2026W12
  qty_personal?: number;
  horas_extras?: boolean;
  horas_extras_qty?: number;
}

class PlanificacionOT extends Model<PlanificacionOTAttributes> implements PlanificacionOTAttributes {
  public id!: number;
  public ot_id!: number;
  public componente!: string;
  public operacion_codigo!: string;
  public descripcion!: string;
  public tipo_reparacion?: string;
  public orden!: number;
  public horas_estimadas?: number;
  public fecha_inicio?: Date;
  public fecha_fin?: Date;
  public tecnico?: string;
  public maquina?: string;
  public estado?: string;
  public observaciones?: string;
  public semana_plan?: string;
  public qty_personal?: number;
  public horas_extras?: boolean;
  public horas_extras_qty?: number;
}

PlanificacionOT.init({
  id:               { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  ot_id:            { type: DataTypes.INTEGER, allowNull: false },
  componente:       { type: DataTypes.STRING(10), allowNull: false },
  operacion_codigo: { type: DataTypes.STRING(20), allowNull: false },
  descripcion:      { type: DataTypes.STRING(200), allowNull: false },
  tipo_reparacion:  { type: DataTypes.STRING(10), allowNull: true },
  orden:            { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  horas_estimadas:  { type: DataTypes.DECIMAL(5, 1), allowNull: true },
  fecha_inicio:     { type: DataTypes.DATE, allowNull: true },
  fecha_fin:        { type: DataTypes.DATE, allowNull: true },
  tecnico:          { type: DataTypes.STRING(100), allowNull: true },
  maquina:          { type: DataTypes.STRING(50), allowNull: true },
  estado:           { type: DataTypes.STRING(30), allowNull: true, defaultValue: 'Pendiente' },
  observaciones:    { type: DataTypes.TEXT, allowNull: true },
  semana_plan:      { type: DataTypes.STRING(10), allowNull: true, comment: 'Semana ISO: 2026W12' },
  qty_personal:     { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },
  horas_extras:     { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  horas_extras_qty: { type: DataTypes.DECIMAL(5, 1), allowNull: true, defaultValue: null, comment: 'Cantidad de horas extras manuales' },
}, {
  sequelize,
  tableName: 'planificacion_ot',
  modelName: 'PlanificacionOT',
  timestamps: true,
  underscored: true,
});

export default PlanificacionOT;
