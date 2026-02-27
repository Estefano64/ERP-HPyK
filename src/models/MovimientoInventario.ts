import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MovimientoInventarioAttributes {
  id: number;
  material_id: number;
  tipo_movimiento: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
  cantidad: number;
  documento_referencia?: string;
  observacion?: string;
  usuario: string;
  fecha_movimiento?: Date;
}

interface MovimientoInventarioCreationAttributes extends Optional<MovimientoInventarioAttributes, 'id' | 'documento_referencia' | 'observacion' | 'fecha_movimiento'> {}

class MovimientoInventario extends Model<MovimientoInventarioAttributes, MovimientoInventarioCreationAttributes> implements MovimientoInventarioAttributes {
  public id!: number;
  public material_id!: number;
  public tipo_movimiento!: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
  public cantidad!: number;
  public documento_referencia?: string;
  public observacion?: string;
  public usuario!: string;
  public readonly fecha_movimiento?: Date;
}

MovimientoInventario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    material_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'material', key: 'material_id' },
      comment: 'ID del material',
    },
    tipo_movimiento: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        isIn: [['ENTRADA', 'SALIDA', 'AJUSTE']],
      },
      comment: 'Tipo de movimiento: ENTRADA, SALIDA, AJUSTE',
    },
    cantidad: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Cantidad de material movido',
    },
    documento_referencia: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Documento de referencia (OC, OT, etc.)',
    },
    observacion: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Observaciones del movimiento',
    },
    usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Usuario que realizó el movimiento',
    },
    fecha_movimiento: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha y hora del movimiento',
    },
  },
  {
    sequelize,
    tableName: 'movimientos_inventario',
    timestamps: false,
  }
);

export default MovimientoInventario;
