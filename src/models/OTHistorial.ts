import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface OTHistorialAttributes {
  id: number;
  ot_id: number;
  tipo_operacion: string;
  descripcion: string;
  usuario: string;
  fecha: Date;
  datos_adicionales?: string; // JSON con información extra
  createdAt?: Date;
  updatedAt?: Date;
}

interface OTHistorialCreationAttributes extends Optional<OTHistorialAttributes, 'id' | 'datos_adicionales'> {}

class OTHistorial extends Model<OTHistorialAttributes, OTHistorialCreationAttributes> implements OTHistorialAttributes {
  public id!: number;
  public ot_id!: number;
  public tipo_operacion!: string;
  public descripcion!: string;
  public usuario!: string;
  public fecha!: Date;
  public datos_adicionales?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OTHistorial.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: 'orden_trabajo',
      //   key: 'ot_id'
      // },
      comment: 'ID de la Orden de Trabajo'
    },
    tipo_operacion: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Descripción de la operación realizada'
    },
    usuario: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Usuario que realizó la operación'
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    datos_adicionales: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON con información adicional'
    }
  },
  {
    sequelize,
    tableName: 'ot_historial',
    timestamps: true,
    indexes: [
      {
        fields: ['ot_id']
      },
      {
        fields: ['fecha']
      }
    ]
  }
);

export default OTHistorial;
