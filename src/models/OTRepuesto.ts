import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Tabla de repuestos/requerimientos por OT
// Equivalente al Excel REPUESTOS 2026.xlsx
// Estado REQ: REV=Revisión, COT=Cotización, APR=Aprobación, PRO=Proceso, COM=Completo, INC=Incompleto, ANU=Anulado, DEV=Devolución
// Estado COT: PDT_COT=Pendiente Cotización, PDT_APR=Pendiente Aprobación, APR=Aprobado, ANU=Anulado, DES=Desaprobado

interface OTRepuestoAttributes {
  id: number;
  ot_id: number;
  material_id?: number;        // Nulo para ítems SER/CAD sin material catalogado
  material_codigo?: string;   // Código del material (ej: "SELL-0001")
  nro_req?: string;           // Número de requerimiento (ej: "363525-1")
  item_req?: number;          // Ítem dentro del requerimiento
  tipo_codigo?: string;       // MAC / CAD / SER (del task list)
  cantidad: number;
  descripcion?: string;       // Descripción editable por logística
  texto?: string;             // Texto del task list
  fabricante_codigo?: string; // Modelo/marca del ítem (ej: KOMATSU, CAT)
  unidad_medida?: string;    // U.M. (UNIDAD, KG, LT, etc.)
  fecha_solicitud: Date;      // Fecha de registro automática
  fecha_requerida?: Date;     // Fecha límite requerida (criticidad)
  estado: string;             // REV | COT | APR | PRO | COM | INC | ANU | DEV
  estado_cot?: string;        // PDT_COT | PDT_APR | APR | ANU | DES
  // Vinculación con OC
  po_id?: number;
  nro_oc?: string;            // Número de OC (ej: "D260001")
  item_oc?: number;
  proveedor_id?: number;
  precio_unitario?: number;   // Precio de compra sin IGV
  precio_venta?: number;      // Precio de venta a cliente sin IGV
  moneda?: string;            // USD / SOL
  // Seguimiento de tiempos (días)
  t_req?: number;             // Días desde solicitud hasta OC
  t_oc?: number;              // Días de procesamiento OC
  t_total?: number;           // Tiempo total
  t_almacenaje?: number;      // Días en almacén
  t_armado?: number;          // Días de armado
  t_fact?: number;            // Días hasta facturación
  // Fechas clave de seguimiento
  fecha_oc?: Date;
  fecha_entrega_esperada?: Date;  // F. ESTIMADA OC
  fecha_entrega_real?: Date;      // F. RECEPCIÓN OC
  fecha_salida_almacen?: Date;
  fecha_envio_mina?: Date;
  fecha_facturacion?: Date;
  // Documentos
  nro_guia?: string;          // Número de tracking courier (DHL, etc.)
  nro_factura_proveedor?: string;
  factura_cliente?: string;   // Factura HP&K al cliente
  gr_mina?: string;           // Guía de remisión a mina
  // Otros
  evaluador?: string;
  es_adicional?: boolean;
  ubicacion?: string;         // Ubicación en almacén
  observaciones?: string;
  usuario_solicita: string;
  usuario_aprueba?: string;
  fecha_aprobacion?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OTRepuestoCreationAttributes extends Optional<OTRepuestoAttributes,
  'id' | 'material_codigo' | 'nro_req' | 'item_req' | 'tipo_codigo' | 'descripcion' | 'texto' |
  'fabricante_codigo' | 'fecha_requerida' | 'estado_cot' | 'po_id' | 'nro_oc' |
  'item_oc' | 'proveedor_id' | 'precio_unitario' | 'precio_venta' | 'moneda' |
  't_req' | 't_oc' | 't_total' | 't_almacenaje' | 't_armado' | 't_fact' |
  'fecha_oc' | 'fecha_entrega_esperada' | 'fecha_entrega_real' | 'fecha_salida_almacen' |
  'fecha_envio_mina' | 'fecha_facturacion' | 'nro_guia' | 'nro_factura_proveedor' |
  'factura_cliente' | 'gr_mina' | 'evaluador' | 'es_adicional' | 'ubicacion' |
  'observaciones' | 'usuario_aprueba' | 'fecha_aprobacion' | 'unidad_medida'
> {}

class OTRepuesto extends Model<OTRepuestoAttributes, OTRepuestoCreationAttributes> implements OTRepuestoAttributes {
  public id!: number;
  public ot_id!: number;
  public material_id?: number;
  public material_codigo?: string;
  public nro_req?: string;
  public item_req?: number;
  public tipo_codigo?: string;
  public cantidad!: number;
  public descripcion?: string;
  public texto?: string;
  public fabricante_codigo?: string;
  public unidad_medida?: string;
  public fecha_solicitud!: Date;
  public fecha_requerida?: Date;
  public estado!: string;
  public estado_cot?: string;
  public po_id?: number;
  public nro_oc?: string;
  public item_oc?: number;
  public proveedor_id?: number;
  public precio_unitario?: number;
  public precio_venta?: number;
  public moneda?: string;
  public t_req?: number;
  public t_oc?: number;
  public t_total?: number;
  public t_almacenaje?: number;
  public t_armado?: number;
  public t_fact?: number;
  public fecha_oc?: Date;
  public fecha_entrega_esperada?: Date;
  public fecha_entrega_real?: Date;
  public fecha_salida_almacen?: Date;
  public fecha_envio_mina?: Date;
  public fecha_facturacion?: Date;
  public nro_guia?: string;
  public nro_factura_proveedor?: string;
  public factura_cliente?: string;
  public gr_mina?: string;
  public evaluador?: string;
  public es_adicional?: boolean;
  public ubicacion?: string;
  public observaciones?: string;
  public usuario_solicita!: string;
  public usuario_aprueba?: string;
  public fecha_aprobacion?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OTRepuesto.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    ot_id: {
      type: DataTypes.INTEGER, allowNull: false,
      comment: 'ID de la Orden de Trabajo'
    },
    material_id: {
      type: DataTypes.INTEGER, allowNull: true,
      comment: 'ID del Material/Repuesto (nulo para ítems SER/CAD)'
    },
    material_codigo: {
      type: DataTypes.STRING(20), allowNull: true,
      comment: 'Código del material (ej: SELL-0001)'
    },
    nro_req: {
      type: DataTypes.STRING(50), allowNull: true,
      comment: 'Número de requerimiento (ej: 363525-1)'
    },
    item_req: {
      type: DataTypes.INTEGER, allowNull: true,
      comment: 'Ítem dentro del requerimiento'
    },
    tipo_codigo: {
      type: DataTypes.STRING(10), allowNull: true,
      comment: 'MAC / CAD / SER — del task list'
    },
    cantidad: {
      type: DataTypes.DECIMAL(10, 2), allowNull: false,
      validate: { min: 0 }
    },
    descripcion: {
      type: DataTypes.TEXT, allowNull: true,
      comment: 'Descripción editable por logística'
    },
    texto: {
      type: DataTypes.TEXT, allowNull: true,
      comment: 'Texto del task list'
    },
    fabricante_codigo: {
      type: DataTypes.STRING(50), allowNull: true
    },
    unidad_medida: {
      type: DataTypes.STRING(20), allowNull: true, defaultValue: 'UNIDAD'
    },
    fecha_solicitud: {
      type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW,
      comment: 'Fecha de registro automática'
    },
    fecha_requerida: {
      type: DataTypes.DATE, allowNull: true,
      comment: 'Fecha límite requerida (criticidad)'
    },
    estado: {
      type: DataTypes.STRING(30), allowNull: false, defaultValue: 'REV',
      comment: 'REV | COT | APR | PRO | COM | INC | ANU | DEV | PDT APROBACION'
    },
    estado_cot: {
      type: DataTypes.STRING(20), allowNull: true,
      comment: 'PDT_COT | PDT_APR | APR | ANU | DES'
    },
    po_id: {
      type: DataTypes.INTEGER, allowNull: true,
      comment: 'ID de la Compra/PO generada'
    },
    nro_oc: {
      type: DataTypes.STRING(50), allowNull: true,
      comment: 'Número de OC (ej: D260001)'
    },
    item_oc: {
      type: DataTypes.INTEGER, allowNull: true,
      comment: 'Ítem dentro de la OC'
    },
    proveedor_id: {
      type: DataTypes.INTEGER, allowNull: true,
      comment: 'Proveedor'
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(15, 4), allowNull: true,
      comment: 'Precio de compra sin IGV'
    },
    precio_venta: {
      type: DataTypes.DECIMAL(15, 4), allowNull: true,
      comment: 'Precio de venta a cliente sin IGV'
    },
    moneda: {
      type: DataTypes.STRING(10), allowNull: true, defaultValue: 'USD'
    },
    t_req: {
      type: DataTypes.DECIMAL(10, 2), allowNull: true,
      comment: 'Días desde solicitud hasta generación de OC'
    },
    t_oc: {
      type: DataTypes.DECIMAL(10, 2), allowNull: true,
      comment: 'Días de procesamiento de OC'
    },
    t_total: {
      type: DataTypes.DECIMAL(10, 2), allowNull: true,
      comment: 'Tiempo total del proceso'
    },
    t_almacenaje: {
      type: DataTypes.DECIMAL(10, 2), allowNull: true,
      comment: 'Días en almacén'
    },
    t_armado: {
      type: DataTypes.DECIMAL(10, 2), allowNull: true,
      comment: 'Días de armado'
    },
    t_fact: {
      type: DataTypes.DECIMAL(10, 2), allowNull: true,
      comment: 'Días hasta facturación'
    },
    fecha_oc: {
      type: DataTypes.DATE, allowNull: true,
      comment: 'Fecha de generación de la OC'
    },
    fecha_entrega_esperada: {
      type: DataTypes.DATE, allowNull: true,
      comment: 'Fecha estimada de llegada (F. ESTIMADA OC)'
    },
    fecha_entrega_real: {
      type: DataTypes.DATE, allowNull: true,
      comment: 'Fecha real de recepción (F. RECEPCIÓN OC)'
    },
    fecha_salida_almacen: {
      type: DataTypes.DATE, allowNull: true,
      comment: 'Fecha de salida del almacén'
    },
    fecha_envio_mina: {
      type: DataTypes.DATE, allowNull: true,
      comment: 'Fecha de envío al cliente / mina'
    },
    fecha_facturacion: {
      type: DataTypes.DATE, allowNull: true,
      comment: 'Fecha de facturación HP&K al cliente'
    },
    nro_guia: {
      type: DataTypes.STRING(100), allowNull: true,
      comment: 'Número de tracking courier (DHL, etc.)'
    },
    nro_factura_proveedor: {
      type: DataTypes.STRING(100), allowNull: true,
      comment: 'Número de factura del proveedor'
    },
    factura_cliente: {
      type: DataTypes.STRING(100), allowNull: true,
      comment: 'Número de factura HP&K al cliente'
    },
    gr_mina: {
      type: DataTypes.STRING(100), allowNull: true,
      comment: 'Guía de remisión hacia el cliente / mina'
    },
    evaluador: {
      type: DataTypes.STRING(100), allowNull: true,
      comment: 'Persona que evaluó / recibió el repuesto'
    },
    es_adicional: {
      type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false,
      comment: 'Indica si es un ítem adicional'
    },
    ubicacion: {
      type: DataTypes.STRING(50), allowNull: true,
      comment: 'Ubicación física en almacén (ej: B6)'
    },
    observaciones: {
      type: DataTypes.TEXT, allowNull: true
    },
    usuario_solicita: {
      type: DataTypes.STRING(100), allowNull: false,
      comment: 'Usuario que solicita el repuesto'
    },
    usuario_aprueba: {
      type: DataTypes.STRING(100), allowNull: true,
      comment: 'Usuario que aprueba la solicitud'
    },
    fecha_aprobacion: {
      type: DataTypes.DATE, allowNull: true
    },
  },
  {
    sequelize,
    tableName: 'ot_repuestos',
    timestamps: true,
    indexes: [
      { fields: ['ot_id'] },
      { fields: ['nro_req'] },
      { fields: ['estado'] },
      { fields: ['po_id'] },
      { fields: ['nro_oc'] },
    ]
  }
);

export default OTRepuesto;
