import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface FabricanteAttributes {
  fabricante_id: number;
  codigo: string;
  nombre: string;
  pais?: string;
  activo: boolean;
}

interface FabricanteCreationAttributes extends Optional<FabricanteAttributes, 'fabricante_id'> {}

class Fabricante extends Model<FabricanteAttributes, FabricanteCreationAttributes> implements FabricanteAttributes {
  public fabricante_id!: number;
  public codigo!: string;
  public nombre!: string;
  public pais?: string;
  public activo!: boolean;
}

Fabricante.init(
  {
    fabricante_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    pais: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'fabricante',
    timestamps: false,
  }
);

export default Fabricante;
