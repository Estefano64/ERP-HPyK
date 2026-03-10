import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Tabla pivot: una OC (Compra) puede cubrir múltiples OTs
// Equivalente al campo "OT" del REPUESTOS 2026.xlsx que puede tener varias OTs por OC

interface CompraOTAttributes {
  id: number;
  compra_id: number;   // FK a compras.id
  ot_id: number;       // FK a orden_trabajo.id
  nro_oc?: string;     // Número de OC (desnormalizado para búsqueda rápida)
  ot?: string;         // Número de OT (desnormalizado para búsqueda rápida)
  createdAt?: Date;
  updatedAt?: Date;
}

interface CompraOTCreationAttributes extends Optional<CompraOTAttributes, 'id' | 'nro_oc' | 'ot'> {}

class CompraOT extends Model<CompraOTAttributes, CompraOTCreationAttributes> implements CompraOTAttributes {
  public id!: number;
  public compra_id!: number;
  public ot_id!: number;
  public nro_oc?: string;
  public ot?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CompraOT.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    compra_id: {
      type: DataTypes.INTEGER, allowNull: false,
      comment: 'FK a compras.id'
    },
    ot_id: {
      type: DataTypes.INTEGER, allowNull: false,
      comment: 'FK a orden_trabajo.id'
    },
    nro_oc: {
      type: DataTypes.STRING(50), allowNull: true,
      comment: 'Número de OC (desnormalizado)'
    },
    ot: {
      type: DataTypes.STRING(50), allowNull: true,
      comment: 'Número de OT (desnormalizado)'
    },
  },
  {
    sequelize,
    tableName: 'compra_ot',
    timestamps: true,
    indexes: [
      { fields: ['compra_id'] },
      { fields: ['ot_id'] },
      { unique: true, fields: ['compra_id', 'ot_id'], name: 'uq_compra_ot' },
    ]
  }
);

export default CompraOT;
