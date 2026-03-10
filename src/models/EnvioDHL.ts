import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Módulo de envíos internacionales / importaciones
// Equivalente al Excel DHL 2026.xlsx
// Registra cada lote de repuestos importados, con costos de envío y tipo de cambio

interface EnvioDHLAttributes {
  id: number;
  ot_id?: number;             // OT relacionada
  po_id?: number;             // Compra/PO relacionada
  nro_oc?: string;            // Número de OC
  // Información del envío
  nro_guia: string;           // Número de tracking DHL (GUIA)
  proforma?: string;          // Número de proforma del proveedor
  factura_electronica?: string; // FE - Factura electrónica
  nota_credito?: string;      // NC - Nota de crédito
  // Repuesto enviado
  cantidad?: number;
  descripcion?: string;
  np?: string;                // Número de parte
  // Precios y costos
  precio_usd?: number;        // Precio en USD sin envío
  costo_envio_usd?: number;   // Costo de envío DHL en USD
  precio_final_usd?: number;  // Precio unitario + prorrateo de envío
  monto_soles?: number;       // Monto en soles (S/.)
  saldo?: number;             // Saldo pendiente
  indicador?: number;         // Tipo de cambio aplicado al lote
  // Logística del envío
  peso_lb?: number;           // Peso en libras
  volumen_in3?: number;       // Volumen en pulgadas cúbicas
  // Fechas
  fecha_envio?: Date;         // Fecha de envío desde origen
  fecha_llegada_estimada?: Date;
  fecha_llegada_real?: Date;
  tiempo_dias?: number;       // Días en tránsito (calculado)
  // Auditoría
  usuario_registra?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EnvioDHLCreationAttributes extends Optional<EnvioDHLAttributes,
  'id' | 'ot_id' | 'po_id' | 'nro_oc' | 'proforma' | 'factura_electronica' |
  'nota_credito' | 'cantidad' | 'descripcion' | 'np' | 'precio_usd' |
  'costo_envio_usd' | 'precio_final_usd' | 'monto_soles' | 'saldo' | 'indicador' |
  'peso_lb' | 'volumen_in3' | 'fecha_envio' | 'fecha_llegada_estimada' |
  'fecha_llegada_real' | 'tiempo_dias' | 'usuario_registra'
> {}

class EnvioDHL extends Model<EnvioDHLAttributes, EnvioDHLCreationAttributes> implements EnvioDHLAttributes {
  public id!: number;
  public ot_id?: number;
  public po_id?: number;
  public nro_oc?: string;
  public nro_guia!: string;
  public proforma?: string;
  public factura_electronica?: string;
  public nota_credito?: string;
  public cantidad?: number;
  public descripcion?: string;
  public np?: string;
  public precio_usd?: number;
  public costo_envio_usd?: number;
  public precio_final_usd?: number;
  public monto_soles?: number;
  public saldo?: number;
  public indicador?: number;
  public peso_lb?: number;
  public volumen_in3?: number;
  public fecha_envio?: Date;
  public fecha_llegada_estimada?: Date;
  public fecha_llegada_real?: Date;
  public tiempo_dias?: number;
  public usuario_registra?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EnvioDHL.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ot_id: {
      type: DataTypes.INTEGER, allowNull: true,
      comment: 'OT relacionada'
    },
    po_id: {
      type: DataTypes.INTEGER, allowNull: true,
      comment: 'Compra/PO relacionada'
    },
    nro_oc: {
      type: DataTypes.STRING(50), allowNull: true,
      comment: 'Número de OC'
    },
    nro_guia: {
      type: DataTypes.STRING(100), allowNull: false,
      comment: 'Número de tracking DHL'
    },
    proforma: {
      type: DataTypes.STRING(100), allowNull: true,
      comment: 'Número de proforma del proveedor'
    },
    factura_electronica: {
      type: DataTypes.STRING(100), allowNull: true,
      comment: 'FE - Factura electrónica'
    },
    nota_credito: {
      type: DataTypes.STRING(100), allowNull: true,
      comment: 'NC - Nota de crédito'
    },
    cantidad: {
      type: DataTypes.DECIMAL(10, 2), allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT, allowNull: true
    },
    np: {
      type: DataTypes.STRING(100), allowNull: true,
      comment: 'Número de parte'
    },
    precio_usd: {
      type: DataTypes.DECIMAL(15, 4), allowNull: true,
      comment: 'Precio en USD sin costo de envío'
    },
    costo_envio_usd: {
      type: DataTypes.DECIMAL(12, 4), allowNull: true,
      comment: 'Costo de envío DHL prorrateado'
    },
    precio_final_usd: {
      type: DataTypes.DECIMAL(15, 4), allowNull: true,
      comment: 'Precio unitario + costo de envío prorrateado'
    },
    monto_soles: {
      type: DataTypes.DECIMAL(15, 4), allowNull: true,
      comment: 'Monto en soles (S/.)'
    },
    saldo: {
      type: DataTypes.DECIMAL(15, 4), allowNull: true,
      comment: 'Saldo pendiente'
    },
    indicador: {
      type: DataTypes.DECIMAL(10, 6), allowNull: true,
      comment: 'Tipo de cambio / indicador aplicado al lote'
    },
    peso_lb: {
      type: DataTypes.DECIMAL(10, 3), allowNull: true,
      comment: 'Peso en libras'
    },
    volumen_in3: {
      type: DataTypes.DECIMAL(12, 3), allowNull: true,
      comment: 'Volumen en pulgadas cúbicas'
    },
    fecha_envio: {
      type: DataTypes.DATE, allowNull: true,
      comment: 'Fecha de envío desde origen'
    },
    fecha_llegada_estimada: {
      type: DataTypes.DATE, allowNull: true
    },
    fecha_llegada_real: {
      type: DataTypes.DATE, allowNull: true
    },
    tiempo_dias: {
      type: DataTypes.INTEGER, allowNull: true,
      comment: 'Días en tránsito (calculado)'
    },
    usuario_registra: {
      type: DataTypes.STRING(100), allowNull: true
    },
  },
  {
    sequelize,
    tableName: 'envios_dhl',
    timestamps: true,
    indexes: [
      { fields: ['nro_guia'] },
      { fields: ['ot_id'] },
      { fields: ['po_id'] },
      { fields: ['np'] },
    ],
    hooks: {
      beforeSave: (instance: EnvioDHL) => {
        // Calcular días en tránsito si se tienen ambas fechas
        if (instance.fecha_envio && instance.fecha_llegada_real) {
          const diff = instance.fecha_llegada_real.getTime() - instance.fecha_envio.getTime();
          instance.tiempo_dias = Math.round(diff / (1000 * 60 * 60 * 24));
        }
      }
    }
  }
);

export default EnvioDHL;
