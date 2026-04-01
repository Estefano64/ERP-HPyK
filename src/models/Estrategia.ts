import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// 3️⃣ 3_Todos - Estrategias — TODOS

interface EstrategiaAttributes {
  estrategia_id: number;
  codigo: string; // Autogenerado
  area_codigo: string;
  equipo_codigo: string;
  actividad_codigo: string; // Autogenerado
  frecuencia: number;
  unidad_medida_codigo: string;
  descripcion: string;
  tipo_estrategia_codigo: string;
  status_codigo: string;
  fecha_ultima_ejecucion?: Date;
  fecha_proxima_ejecucion?: Date;
}

interface EstrategiaCreationAttributes extends Optional<EstrategiaAttributes, 'estrategia_id'> {}

class Estrategia extends Model<EstrategiaAttributes, EstrategiaCreationAttributes> implements EstrategiaAttributes {
  public estrategia_id!: number;
  public codigo!: string;
  public area_codigo!: string;
  public equipo_codigo!: string;
  public actividad_codigo!: string;
  public frecuencia!: number;
  public unidad_medida_codigo!: string;
  public descripcion!: string;
  public tipo_estrategia_codigo!: string;
  public status_codigo!: string;
  public fecha_ultima_ejecucion?: Date;
  public fecha_proxima_ejecucion?: Date;
}

Estrategia.init(
  {
    estrategia_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Código de estrategia (autogenerado)',
    },
    area_codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: { model: 'area', key: 'codigo' },
    },
    equipo_codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: { model: 'equipo', key: 'codigo' },
    },
    actividad_codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Código de actividad (autogenerado)',
    },
    frecuencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Frecuencia de ejecución',
    },
    unidad_medida_codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: { model: 'unidad_medida', key: 'codigo' },
      comment: 'Unidad de medida para la frecuencia',
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Descripción de la estrategia',
    },
    tipo_estrategia_codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: { model: 'tipo_estrategia', key: 'codigo' },
    },
    status_codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: { model: 'status_estrategia', key: 'codigo' },
    },
    fecha_ultima_ejecucion: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Última fecha en que se ejecutó esta estrategia',
    },
    fecha_proxima_ejecucion: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Próxima fecha programada según frecuencia',
    },
  },
  {
    sequelize,
    tableName: 'estrategia',
    timestamps: false,
  }
);

export default Estrategia;
