import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface TipoGarantiaAttributes {
  tipo_garantia_id: number;
  codigo: string;
  nombre: string;
  activo: boolean;
}

interface TipoGarantiaCreationAttributes extends Optional<TipoGarantiaAttributes, 'tipo_garantia_id'> {}

class TipoGarantia extends Model<TipoGarantiaAttributes, TipoGarantiaCreationAttributes> implements TipoGarantiaAttributes {
  public tipo_garantia_id!: number;
  public codigo!: string;
  public nombre!: string;
  public activo!: boolean;
}

TipoGarantia.init(
  {
    tipo_garantia_id: {
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
    tableName: 'tipo_garantia',
    timestamps: false,
  }
);

export default TipoGarantia;
