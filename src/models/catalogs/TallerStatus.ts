import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface TallerStatusAttributes {
  taller_status_id: number;
  codigo: string;
  nombre: string;
  activo: boolean;
}

interface TallerStatusCreationAttributes extends Optional<TallerStatusAttributes, 'taller_status_id'> {}

class TallerStatus extends Model<TallerStatusAttributes, TallerStatusCreationAttributes> implements TallerStatusAttributes {
  public taller_status_id!: number;
  public codigo!: string;
  public nombre!: string;
  public activo!: boolean;
}

TallerStatus.init(
  {
    taller_status_id: {
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
    tableName: 'taller_status',
    timestamps: false,
  }
);

export default TallerStatus;
