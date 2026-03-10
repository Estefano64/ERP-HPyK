import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface AtencionReparacionAttributes {
  atencion_reparacion_id: number;
  codigo: string;
  nombre: string;
  activo: boolean;
}

interface AtencionReparacionCreationAttributes extends Optional<AtencionReparacionAttributes, 'atencion_reparacion_id'> {}

class AtencionReparacion extends Model<AtencionReparacionAttributes, AtencionReparacionCreationAttributes> implements AtencionReparacionAttributes {
  public atencion_reparacion_id!: number;
  public codigo!: string;
  public nombre!: string;
  public activo!: boolean;
}

AtencionReparacion.init(
  {
    atencion_reparacion_id: {
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
    tableName: 'atencion_reparacion',
    timestamps: false,
  }
);

export default AtencionReparacion;
