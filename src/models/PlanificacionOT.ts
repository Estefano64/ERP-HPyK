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
  estado?: string;          // Pendiente, En Proceso, Completado, Cancelado
  observaciones?: string;
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
  fecha_inicio:     { type: DataTypes.DATEONLY, allowNull: true },
  fecha_fin:        { type: DataTypes.DATEONLY, allowNull: true },
  tecnico:          { type: DataTypes.STRING(100), allowNull: true },
  maquina:          { type: DataTypes.STRING(50), allowNull: true },
  estado:           { type: DataTypes.STRING(30), allowNull: true, defaultValue: 'Pendiente' },
  observaciones:    { type: DataTypes.TEXT, allowNull: true },
}, {
  sequelize,
  tableName: 'planificacion_ot',
  modelName: 'PlanificacionOT',
  timestamps: true,
  underscored: true,
});

export default PlanificacionOT;
