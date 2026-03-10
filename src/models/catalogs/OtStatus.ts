import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface OtStatusAttributes {
  ot_status_id: number;
  codigo: string;
  nombre: string;
  activo: boolean;
}

interface OtStatusCreationAttributes extends Optional<OtStatusAttributes, 'ot_status_id'> {}

class OtStatus extends Model<OtStatusAttributes, OtStatusCreationAttributes> implements OtStatusAttributes {
  public ot_status_id!: number;
  public codigo!: string;
  public nombre!: string;
  public activo!: boolean;
}

OtStatus.init(
  {
    ot_status_id: {
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
    tableName: 'ot_status',
    timestamps: false,
  }
);

export default OtStatus;
