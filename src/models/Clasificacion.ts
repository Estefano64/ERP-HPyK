import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Clasificacion extends Model {
  public codigo!: string;
  public descripcion!: string;
  public activo!: boolean;
}

Clasificacion.init(
  {
    codigo: {
      type: DataTypes.STRING(10),
      primaryKey: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'clasificacion',
    timestamps: false,
  }
);

export default Clasificacion;
