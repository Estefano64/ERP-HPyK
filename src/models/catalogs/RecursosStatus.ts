import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface RecursosStatusAttributes {
  recursos_status_id: number;
  codigo: string;
  nombre: string;
  activo: boolean;
}

interface RecursosStatusCreationAttributes extends Optional<RecursosStatusAttributes, 'recursos_status_id'> {}

class RecursosStatus extends Model<RecursosStatusAttributes, RecursosStatusCreationAttributes> implements RecursosStatusAttributes {
  public recursos_status_id!: number;
  public codigo!: string;
  public nombre!: string;
  public activo!: boolean;
}

RecursosStatus.init(
  {
    recursos_status_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'recursos_status',
    timestamps: false,
  }
);

export default RecursosStatus;
