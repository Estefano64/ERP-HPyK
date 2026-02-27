import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface OrdenCompraViewAttributes {
  id: number;
  serie: string;
  correlativo: string;
  fecha: Date;
  fecha_recepcion_guia?: Date;
  fecha_pago?: Date;
  identificador_externo?: string;
  tipo_documento: string;
  ruc_receptor: string;
  receptor: string;
  division?: string;
  importe_total: number;
  moneda: string;
  estado: 'Pendiente' | 'Recibido' | 'Pagado' | 'Cancelado';
  centro_costo?: string;
  observaciones?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrdenCompraViewCreationAttributes extends Optional<OrdenCompraViewAttributes, 
  'id' | 'fecha_recepcion_guia' | 'fecha_pago' | 'identificador_externo' | 'division' | 'centro_costo' | 'observaciones'> {}

class OrdenCompraView extends Model<OrdenCompraViewAttributes, OrdenCompraViewCreationAttributes> implements OrdenCompraViewAttributes {
  public id!: number;
  public serie!: string;
  public correlativo!: string;
  public fecha!: Date;
  public fecha_recepcion_guia?: Date;
  public fecha_pago?: Date;
  public identificador_externo?: string;
  public tipo_documento!: string;
  public ruc_receptor!: string;
  public receptor!: string;
  public division?: string;
  public importe_total!: number;
  public moneda!: string;
  public estado!: 'Pendiente' | 'Recibido' | 'Pagado' | 'Cancelado';
  public centro_costo?: string;
  public observaciones?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrdenCompraView.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    serie: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: 'Serie del documento (ej: F001, B001)'
    },
    correlativo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'Número correlativo del documento'
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Fecha de emisión de la orden'
    },
    fecha_recepcion_guia: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha de recepción de la guía/ticket'
    },
    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha de pago de la orden'
    },
    identificador_externo: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Identificador externo del sistema'
    },
    tipo_documento: {
      type: DataTypes.ENUM(
        'Factura Electrónica', 
        'Boleta Electrónica', 
        'Nota de Crédito', 
        'Nota de Débito',
        'Guía de Remisión'
      ),
      allowNull: false,
      comment: 'Tipo de documento electrónico'
    },
    ruc_receptor: {
      type: DataTypes.STRING(11),
      allowNull: false,
      comment: 'RUC del receptor/cliente'
    },
    receptor: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Razón social del receptor/cliente'
    },
    division: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'División o área específica'
    },
    importe_total: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: 'Importe total de la orden'
    },
    moneda: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
      comment: 'Código de moneda (USD, PEN, EUR, etc.)'
    },
    estado: {
      type: DataTypes.ENUM('Pendiente', 'Recibido', 'Pagado', 'Cancelado'),
      defaultValue: 'Pendiente',
      allowNull: false,
      comment: 'Estado actual de la orden'
    },
    centro_costo: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Centro de costo asociado'
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Observaciones adicionales'
    }
  },
  {
    sequelize,
    tableName: 'ordenes_compra_view',
    timestamps: true,
    indexes: [
      {
        fields: ['serie', 'correlativo'],
        unique: true
      },
      {
        fields: ['fecha']
      },
      {
        fields: ['estado']
      },
      {
        fields: ['ruc_receptor']
      },
      {
        fields: ['centro_costo']
      }
    ]
  }
);

export default OrdenCompraView;