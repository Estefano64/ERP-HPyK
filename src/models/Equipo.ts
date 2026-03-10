import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// 2️⃣ 2_Mant - Equipos — LOG + MANT

interface EquipoAttributes {
  equipo_id: number;
  codigo: string; // Identificador único
  descripcion: string;
  status_codigo: string;
  area_codigo: string;
  sub_area_codigo?: string;
  tipo_codigo: string;
  fecha_inicio?: Date;
  fecha_fabricacion?: Date;
  fabricante_codigo?: string;
  modelo?: string;
  numero_serie?: string; // N/S
  numero_parte?: string; // N/P
  capacidad?: number;
  unidad_medida_codigo?: string;
  observaciones?: string;
  planta_codigo: string;
  criticidad_codigo?: string;
}

interface EquipoCreationAttributes extends Optional<EquipoAttributes, 'equipo_id'> {}

class Equipo extends Model<EquipoAttributes, EquipoCreationAttributes> implements EquipoAttributes {
  public equipo_id!: number;
  public codigo!: string;
  public descripcion!: string;
  public status_codigo!: string;
  public area_codigo!: string;
  public sub_area_codigo?: string;
  public tipo_codigo!: string;
  public fecha_inicio?: Date;
  public fecha_fabricacion?: Date;
  public fabricante_codigo?: string;
  public modelo?: string;
  public numero_serie?: string;
  public numero_parte?: string;
  public capacidad?: number;
  public unidad_medida_codigo?: string;
  public observaciones?: string;
  public planta_codigo!: string;
  public criticidad_codigo?: string;
}

Equipo.init(
  {
    equipo_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Identificador único del equipo',
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status_codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: { model: 'status_equipo', key: 'codigo' },
    },
    area_codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: { model: 'area', key: 'codigo' },
    },
    sub_area_codigo: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: { model: 'sub_area', key: 'codigo' },
    },
    tipo_codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: { model: 'tipo_equipo', key: 'codigo' },
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha de inicio de operación',
    },
    fecha_fabricacion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fabricante_codigo: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: { model: 'fabricante', key: 'codigo' },
    },
    modelo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    numero_serie: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'N/S - Número de serie',
    },
    numero_parte: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'N/P - Número de parte',
    },
    capacidad: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    unidad_medida_codigo: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: { model: 'unidad_medida', key: 'codigo' },
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    planta_codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: { model: 'planta', key: 'codigo' },
    },
    criticidad_codigo: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: { model: 'criticidad', key: 'codigo' },
    },
  },
  {
    sequelize,
    tableName: 'equipo',
    timestamps: false,
  }
);

export default Equipo;
