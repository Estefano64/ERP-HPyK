import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// 1️⃣ 1_Log - Material — TODOS

interface MaterialAttributes {
  material_id: number;
  codigo: string; // Autogenerado por software
  descripcion_compuesta?: string; // Descripción completa
  descripcion: string;
  planta_codigo: string;
  area_codigo: string;
  categoria_codigo: string;
  clasificacion_codigo: string;
  punto_reposicion?: number; // PRODUCCIÓN - Punto de reposición
  stock_maximo?: number; // PRODUCCIÓN - Stock máximo
  unidad_medida_codigo: string;
  plazo_entrega?: number; // LOGÍSTICA - Días de entrega
  precio?: number; // LOGÍSTICA - Precio unitario
  moneda_codigo?: string; // LOGÍSTICA - Moneda
  fabricante_codigo?: string; // Fabricante
  np?: string; // Número de parte
  modelo?: string; // INVENTARIO - Modelo del equipo al que aplica
  caja?: string; // INVENTARIO - Caja/bin de almacén (ej: CAJA 3)
  stock_actual?: number; // Stock actual en almacén
  ubicacion?: string; // Ubicación física (ej: A6)
  activo?: boolean; // Estado del material
  created_at?: Date;
  updated_at?: Date;
}

interface MaterialCreationAttributes extends Optional<MaterialAttributes, 'material_id' | 'descripcion_compuesta' | 'punto_reposicion' | 'stock_maximo' | 'plazo_entrega' | 'precio' | 'moneda_codigo' | 'fabricante_codigo' | 'np' | 'modelo' | 'caja' | 'stock_actual' | 'ubicacion' | 'activo' | 'created_at' | 'updated_at'> {}

class Material extends Model<MaterialAttributes, MaterialCreationAttributes> implements MaterialAttributes {
  public material_id!: number;
  public codigo!: string;
  public descripcion_compuesta?: string;
  public descripcion!: string;
  public planta_codigo!: string;
  public area_codigo!: string;
  public categoria_codigo!: string;
  public clasificacion_codigo!: string;
  public punto_reposicion?: number;
  public stock_maximo?: number;
  public unidad_medida_codigo!: string;
  public plazo_entrega?: number;
  public precio?: number;
  public moneda_codigo?: string;
  public fabricante_codigo?: string;
  public np?: string;
  public modelo?: string;
  public caja?: string;
  public stock_actual?: number;
  public ubicacion?: string;
  public activo?: boolean;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;
}

Material.init(
  {
    material_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Código del material (autogenerado)',
    },
    descripcion_compuesta: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descripción completa del material',
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    planta_codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: { model: 'planta', key: 'codigo' },
    },
    area_codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: { model: 'area', key: 'codigo' },
    },
    categoria_codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: { model: 'categoria', key: 'codigo' },
    },
    clasificacion_codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: { model: 'clasificacion', key: 'codigo' },
    },
    punto_reposicion: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'PRODUCCIÓN - Punto de reposición',
    },
    stock_maximo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'PRODUCCIÓN - Stock máximo',
    },
    unidad_medida_codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: { model: 'unidad_medida', key: 'codigo' },
    },
    plazo_entrega: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'LOGÍSTICA - Plazo de entrega en días',
    },
    precio: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: true,
      comment: 'LOGÍSTICA - Precio unitario',
    },
    moneda_codigo: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: { model: 'moneda', key: 'codigo' },
      comment: 'LOGÍSTICA - Moneda del precio',
    },
    fabricante_codigo: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: { model: 'fabricante', key: 'codigo' },
    },
    np: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Número de parte del fabricante',
    },
    modelo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'INVENTARIO - Modelo del equipo al que aplica el repuesto',
    },
    caja: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'INVENTARIO - Caja/bin físico en almacén (ej: CAJA 3)',
    },
    stock_actual: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
      comment: 'Stock actual en almacén',
    },
    ubicacion: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Ubicación física en almacén (ej: A6)',
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      comment: 'Estado del material (activo/inactivo)',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'material',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Material;
