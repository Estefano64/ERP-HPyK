import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ContratoAttributes {
  id: number;
  codigo: string;              // Cod reparable (ej: "xx11")
  cliente_id: number;           // FK a cliente
  fecha_inicio: Date;
  fecha_termino: Date;
  dias_reparacion: number;      // Días máximos de reparación
  precio: number;               // Precio del contrato
  activo: boolean;
}

interface ContratoCreationAttributes extends Optional<ContratoAttributes, 'id' | 'activo'> {}

class Contrato extends Model<ContratoAttributes, ContratoCreationAttributes> implements ContratoAttributes {
  public id!: number;
  public codigo!: string;
  public cliente_id!: number;
  public fecha_inicio!: Date;
  public fecha_termino!: Date;
  public dias_reparacion!: number;
  public precio!: number;
  public activo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Contrato.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: {
      type: DataTypes.STRING(50), allowNull: false, unique: true,
      comment: 'Código reparable del contrato',
    },
    cliente_id: {
      type: DataTypes.INTEGER, allowNull: false,
      references: { model: 'cliente', key: 'cliente_id' },
      comment: 'Cliente del contrato',
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY, allowNull: false,
      comment: 'Fecha de inicio del contrato',
    },
    fecha_termino: {
      type: DataTypes.DATEONLY, allowNull: false,
      comment: 'Fecha de término del contrato',
    },
    dias_reparacion: {
      type: DataTypes.INTEGER, allowNull: false,
      comment: 'Días máximos de reparación según contrato',
    },
    precio: {
      type: DataTypes.DECIMAL(12, 2), allowNull: false,
      comment: 'Precio del contrato (USD)',
    },
    activo: {
      type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'contrato',
    timestamps: true,
    indexes: [
      { fields: ['cliente_id'] },
      { fields: ['codigo'] },
    ],
  }
);

export default Contrato;
