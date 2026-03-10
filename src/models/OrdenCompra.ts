import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface OrdenCompraAttributes {
  id: number;
  numero_oc: string;
  fecha_orden: string;
  fecha_entrega_requerida?: string;
  proveedor_id: number;
  contacto_proveedor?: string;
  material_id?: number;
  descripcion?: string;
  cantidad?: number;
  unidad_medida?: string;
  precio_unitario?: number;
  subtotal?: number;
  igv_porcentaje?: number;
  descuento_porcentaje?: number;
  total_final?: number;
  forma_pago?: string;
  plazo_pago?: number;
  moneda: string;
  almacen_id?: number;
  direccion_entrega?: string;
  incoterm?: string;
  estado: 'borrador' | 'enviada' | 'confirmada' | 'recibida' | 'cancelada';
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  tipo_compra?: string;
  observaciones?: string;
  user_crea?: string;
  ot_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrdenCompraCreationAttributes extends Optional<OrdenCompraAttributes, 'id'> {}

class OrdenCompra extends Model<OrdenCompraAttributes, OrdenCompraCreationAttributes> implements OrdenCompraAttributes {
  public id!: number;
  public numero_oc!: string;
  public fecha_orden!: string;
  public fecha_entrega_requerida?: string;
  public proveedor_id!: number;
  public contacto_proveedor?: string;
  public material_id?: number;
  public descripcion?: string;
  public cantidad?: number;
  public unidad_medida?: string;
  public precio_unitario?: number;
  public subtotal?: number;
  public igv_porcentaje?: number;
  public descuento_porcentaje?: number;
  public total_final?: number;
  public forma_pago?: string;
  public plazo_pago?: number;
  public moneda!: string;
  public almacen_id?: number;
  public direccion_entrega?: string;
  public incoterm?: string;
  public estado!: 'borrador' | 'enviada' | 'confirmada' | 'recibida' | 'cancelada';
  public prioridad!: 'baja' | 'media' | 'alta' | 'urgente';
  public tipo_compra?: string;
  public observaciones?: string;
  public user_crea?: string;
  public ot_id?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrdenCompra.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    numero_oc: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    fecha_orden: { type: DataTypes.DATEONLY, allowNull: false },
    fecha_entrega_requerida: { type: DataTypes.DATEONLY, allowNull: true },
    proveedor_id: { type: DataTypes.INTEGER, allowNull: false },
    contacto_proveedor: { type: DataTypes.STRING(200), allowNull: true },
    material_id: { type: DataTypes.INTEGER, allowNull: true },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    cantidad: { type: DataTypes.DECIMAL(12, 4), allowNull: true },
    unidad_medida: { type: DataTypes.STRING(20), allowNull: true },
    precio_unitario: { type: DataTypes.DECIMAL(14, 4), allowNull: true },
    subtotal: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
    igv_porcentaje: { type: DataTypes.DECIMAL(5, 2), allowNull: true, defaultValue: 18 },
    descuento_porcentaje: { type: DataTypes.DECIMAL(5, 2), allowNull: true, defaultValue: 0 },
    total_final: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
    forma_pago: { type: DataTypes.STRING(50), allowNull: true },
    plazo_pago: { type: DataTypes.INTEGER, allowNull: true },
    moneda: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'USD' },
    almacen_id: { type: DataTypes.INTEGER, allowNull: true },
    direccion_entrega: { type: DataTypes.TEXT, allowNull: true },
    incoterm: { type: DataTypes.STRING(10), allowNull: true },
    estado: {
      type: DataTypes.ENUM('borrador', 'enviada', 'confirmada', 'recibida', 'cancelada'),
      allowNull: false,
      defaultValue: 'borrador',
    },
    prioridad: {
      type: DataTypes.ENUM('baja', 'media', 'alta', 'urgente'),
      allowNull: false,
      defaultValue: 'media',
    },
    tipo_compra: { type: DataTypes.STRING(30), allowNull: true },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
    user_crea: { type: DataTypes.STRING(100), allowNull: true },
    ot_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    tableName: 'ordenes_compra',
    timestamps: true,
  }
);

export default OrdenCompra;
