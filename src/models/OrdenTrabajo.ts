import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Tabla: ordenes_trabajo (corresponde a 6. Ots.xlsx - Sheet1)
// Estructura completa con todos los campos requeridos de la base de datos

interface OrdenTrabajoAttributes {
  id: number;
  ot?: string;
  id_cliente?: number;
  estrategia?: boolean;
  id_cod_rep?: number;
  tipo?: string;
  np?: string;
  descripcion?: string;
  id_fabricante?: number;
  cod_rep_flota?: string;
  cod_rep_posicion?: string;
  equipo_codigo?: string;
  ns?: string;
  plaqueteo?: string;
  wo_cliente?: string;
  po_cliente?: string;
  id_viajero?: string;
  guia_remision?: string;
  empresa_entrega?: string;
  fecha_recepcion?: Date;
  pcr?: number;
  horas?: number;
  porcentaje_pcr?: number;
  garantia_codigo?: string;
  atencion_reparacion_codigo?: string;
  tipo_reparacion_codigo?: string;
  tipo_garantia_codigo?: string;
  prioridad_atencion_codigo?: string;
  contrato_dias?: number;
  base_metalica_codigo?: string;
  comentarios?: string;
  fecha_requerimiento_cliente?: Date;
  fecha_reprogramada?: Date;
  ot_status_codigo?: string;
  recursos_status_codigo?: string;
  taller_status_codigo?: string;
  usuario_crea?: string;
  fecha_creacion?: Date;
  usuario_actualiza?: string;
  fecha_actualizacion?: Date;
  // --- FASE EVALUACIÓN ---
  fecha_evaluacion?: Date;          // Fecha en que se evaluó el componente
  evaluador?: string;               // Técnico que realizó la evaluación
  nro_informe_evaluacion?: string;  // Ej: "245024-E"
  fecha_entrega_informe?: Date;     // Fecha en que se entregó el informe al cliente
  dias_evaluacion?: number;         // Calculado: fecha_entrega_informe - fecha_recepcion
  reparacion_cil?: string;          // 'STD' | 'NOSTD' | 'NA'
  reparacion_vas?: string;          // 'STD' | 'NOSTD' | 'NA'
  reparacion_tapa?: string;         // 'STD' | 'NOSTD' | 'NA'
  reparacion_piston?: string;       // 'STD' | 'NOSTD' | 'NA'
  // --- FASE COTIZACIÓN ---
  nro_cotizacion?: string;          // Ej: "245024-C"
  monto_cotizacion?: number;        // Monto cotizado en USD
  fecha_cotizacion?: Date;          // Fecha en que se envió la cotización
  dias_cotizacion?: number;         // Calculado: fecha_cotizacion - fecha_entrega_informe
  // --- FASE APROBACIÓN ---
  fecha_aprobacion?: Date;          // Fecha en que el cliente aprobó
  dias_aprobacion?: number;         // Calculado: fecha_aprobacion - fecha_cotizacion
  // --- REQUERIMIENTOS AL CLIENTE ---
  fecha_req_1?: Date;               // Fecha del primer requerimiento al cliente
  fecha_req_2?: Date;               // Fecha del segundo requerimiento (si hubo)
  // --- REPUESTOS Y PRODUCCIÓN ---
  fecha_llegada_repuestos?: Date;   // Fecha en que llegaron los repuestos al taller
  dias_proceso?: number;            // Días de proceso en taller
  // --- ENTREGA Y FACTURACIÓN ---
  fecha_entrega?: Date;             // Fecha real de entrega al cliente
  cumplimiento?: string;            // 'A TIEMPO' | 'DEMORA' | 'ADELANTO'
  nro_informe_entrega?: string;     // Número del informe de entrega
  guia_entrega_salida?: string;     // Guía de remisión de salida
  nro_factura?: string;             // Número de factura HP&K al cliente
  fecha_facturacion?: Date;         // Fecha de facturación
  dias_en_taller?: number;          // Calculado: fecha_entrega - fecha_recepcion
  // --- % AVANCE POR SUB-COMPONENTE (0-100) ---
  pct_cilindro?: number;
  pct_vastago?: number;
  pct_tapa?: number;
  pct_piston?: number;
  pct_cuerpo_int_1?: number;
  pct_cuerpo_int_2?: number;
  pct_otros?: number;
}

interface OrdenTrabajoCreationAttributes extends Optional<OrdenTrabajoAttributes, 'id'> {}

class OrdenTrabajo extends Model<OrdenTrabajoAttributes, OrdenTrabajoCreationAttributes> implements OrdenTrabajoAttributes {
  public id!: number;
  public ot?: string;
  public id_cliente?: number;
  public estrategia?: boolean;
  public id_cod_rep?: number;
  public tipo?: string;
  public np?: string;
  public descripcion?: string;
  public id_fabricante?: number;
  public cod_rep_flota?: string;
  public cod_rep_posicion?: string;
  public equipo_codigo?: string;
  public ns?: string;
  public plaqueteo?: string;
  public wo_cliente?: string;
  public po_cliente?: string;
  public id_viajero?: string;
  public guia_remision?: string;
  public empresa_entrega?: string;
  public fecha_recepcion?: Date;
  public pcr?: number;
  public horas?: number;
  public porcentaje_pcr?: number;
  public garantia_codigo?: string;
  public atencion_reparacion_codigo?: string;
  public tipo_reparacion_codigo?: string;
  public tipo_garantia_codigo?: string;
  public prioridad_atencion_codigo?: string;
  public contrato_dias?: number;
  public base_metalica_codigo?: string;
  public comentarios?: string;
  public fecha_requerimiento_cliente?: Date;
  public fecha_reprogramada?: Date;
  public ot_status_codigo?: string;
  public recursos_status_codigo?: string;
  public taller_status_codigo?: string;
  public usuario_crea?: string;
  public fecha_creacion?: Date;
  public usuario_actualiza?: string;
  public fecha_actualizacion?: Date;
  // Evaluación
  public fecha_evaluacion?: Date;
  public evaluador?: string;
  public nro_informe_evaluacion?: string;
  public fecha_entrega_informe?: Date;
  public dias_evaluacion?: number;
  public reparacion_cil?: string;
  public reparacion_vas?: string;
  public reparacion_tapa?: string;
  public reparacion_piston?: string;
  // Cotización
  public nro_cotizacion?: string;
  public monto_cotizacion?: number;
  public fecha_cotizacion?: Date;
  public dias_cotizacion?: number;
  // Aprobación
  public fecha_aprobacion?: Date;
  public dias_aprobacion?: number;
  // Requerimientos
  public fecha_req_1?: Date;
  public fecha_req_2?: Date;
  // Repuestos y producción
  public fecha_llegada_repuestos?: Date;
  public dias_proceso?: number;
  // Entrega y facturación
  public fecha_entrega?: Date;
  public cumplimiento?: string;
  public nro_informe_entrega?: string;
  public guia_entrega_salida?: string;
  public nro_factura?: string;
  public fecha_facturacion?: Date;
  public dias_en_taller?: number;
  // % avance por sub-componente
  public pct_cilindro?: number;
  public pct_vastago?: number;
  public pct_tapa?: number;
  public pct_piston?: number;
  public pct_cuerpo_int_1?: number;
  public pct_cuerpo_int_2?: number;
  public pct_otros?: number;
}

OrdenTrabajo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ot: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Número de orden de trabajo',
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'cliente', key: 'cliente_id' },
      comment: 'Referencia al cliente',
    },
    estrategia: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Indica si la OT tiene estrategia',
    },
    id_cod_rep: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'codigo_reparacion', key: 'cod_rep_id' },
      comment: 'Referencia a código de reparación',
    },
    tipo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Jala de Cod Rep automáticamente - Tipo',
    },
    np: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Jala de Cod Rep automáticamente - NP',
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Jala de Cod Rep automáticamente - Descripción',
    },
    id_fabricante: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'fabricante', key: 'fabricante_id' },
      comment: 'Jala de Cod Rep automáticamente - Fabricante',
    },
    cod_rep_flota: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Jala de Cod Rep automáticamente - Flota',
    },
    cod_rep_posicion: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Jala de Cod Rep automáticamente - Posición',
    },
    equipo_codigo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Texto libre — descripción del equipo (ej: CAT 793F)',
    },
    ns: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Manual - NS (Número de serie)',
    },
    plaqueteo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Manual - Plaqueteo',
    },
    wo_cliente: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Manual - WO Cliente',
    },
    po_cliente: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Manual - PO Cliente',
    },
    id_viajero: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Manual - ID Viajero',
    },
    guia_remision: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Manual - Guía de remisión (llegada)',
    },
    empresa_entrega: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Manual - Empresa que entrega',
    },
    fecha_recepcion: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Manual - Fecha de recepción',
    },
    pcr: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Manual - PCR (vida útil programada)',
    },
    horas: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Manual - Horas',
    },
    porcentaje_pcr: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Calculado - % PCR (Hrs / PCR)',
    },
    garantia_codigo: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: { model: 'garantia', key: 'codigo' },
      comment: 'Tabla catálogo - Garantía',
    },
    atencion_reparacion_codigo: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: { model: 'atencion_reparacion', key: 'codigo' },
      comment: 'Tabla catálogo - Atención reparación',
    },
    tipo_reparacion_codigo: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: { model: 'tipo_reparacion', key: 'codigo' },
      comment: 'Tabla catálogo - Tipo Reparación',
    },
    tipo_garantia_codigo: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: { model: 'tipo_garantia', key: 'codigo' },
      comment: 'Tabla catálogo - Tipo Garantía',
    },
    prioridad_atencion_codigo: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: { model: 'prioridad_atencion', key: 'codigo' },
      comment: 'Tabla catálogo - Prioridad de atención',
    },
    contrato_dias: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Manual / calculado si tiene contrato - Contrato (días)',
    },
    base_metalica_codigo: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: { model: 'base_metalica', key: 'codigo' },
      comment: 'Tabla catálogo - Base Metálica',
    },
    comentarios: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Manual - Comentarios',
    },
    fecha_requerimiento_cliente: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Manual - Fecha requerimiento cliente',
    },
    fecha_reprogramada: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha reprogramada de requerimiento cliente',
    },
    ot_status_codigo: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: { model: 'ot_status', key: 'codigo' },
      comment: 'Tabla catálogo - OT Status',
    },
    recursos_status_codigo: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: { model: 'recursos_status', key: 'codigo' },
      comment: 'Tabla catálogo - Recursos Status',
    },
    taller_status_codigo: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: { model: 'taller_status', key: 'codigo' },
      comment: 'Tabla catálogo - Taller Status',
    },
    usuario_crea: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    usuario_actualiza: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // === FASE EVALUACIÓN ===
    fecha_evaluacion: { type: DataTypes.DATE, allowNull: true, comment: 'Fecha de evaluación del componente' },
    evaluador: { type: DataTypes.STRING(100), allowNull: true, comment: 'Técnico evaluador' },
    nro_informe_evaluacion: { type: DataTypes.STRING(100), allowNull: true, comment: 'Ej: 245024-E' },
    fecha_entrega_informe: { type: DataTypes.DATE, allowNull: true, comment: 'Fecha entrega informe al cliente' },
    dias_evaluacion:   { type: DataTypes.INTEGER,    allowNull: true, comment: 'Calculado: días desde recepción hasta entrega de informe' },
    reparacion_cil:    { type: DataTypes.STRING(10), allowNull: true, comment: 'STD | NOSTD | NA' },
    reparacion_vas:    { type: DataTypes.STRING(10), allowNull: true, comment: 'STD | NOSTD | NA' },
    reparacion_tapa:   { type: DataTypes.STRING(10), allowNull: true, comment: 'STD | NOSTD | NA' },
    reparacion_piston: { type: DataTypes.STRING(10), allowNull: true, comment: 'STD | NOSTD | NA' },
    // === FASE COTIZACIÓN ===
    nro_cotizacion: { type: DataTypes.STRING(100), allowNull: true, comment: 'Ej: 245024-C' },
    monto_cotizacion: { type: DataTypes.DECIMAL(15, 2), allowNull: true, comment: 'Monto cotizado en USD' },
    fecha_cotizacion: { type: DataTypes.DATE, allowNull: true, comment: 'Fecha de envío de cotización' },
    dias_cotizacion: { type: DataTypes.INTEGER, allowNull: true, comment: 'Calculado: días entre informe y cotización' },
    // === FASE APROBACIÓN ===
    fecha_aprobacion: { type: DataTypes.DATE, allowNull: true, comment: 'Fecha de aprobación del cliente' },
    dias_aprobacion: { type: DataTypes.INTEGER, allowNull: true, comment: 'Calculado: días entre cotización y aprobación' },
    // === REQUERIMIENTOS AL CLIENTE ===
    fecha_req_1: { type: DataTypes.DATE, allowNull: true, comment: 'Primer requerimiento al cliente' },
    fecha_req_2: { type: DataTypes.DATE, allowNull: true, comment: 'Segundo requerimiento al cliente' },
    // === REPUESTOS Y PRODUCCIÓN ===
    fecha_llegada_repuestos: { type: DataTypes.DATE, allowNull: true, comment: 'Fecha llegada repuestos al taller' },
    dias_proceso: { type: DataTypes.INTEGER, allowNull: true, comment: 'Días de proceso en taller' },
    // === ENTREGA Y FACTURACIÓN ===
    fecha_entrega: { type: DataTypes.DATE, allowNull: true, comment: 'Fecha real de entrega al cliente' },
    cumplimiento: { type: DataTypes.STRING(20), allowNull: true, comment: 'A TIEMPO | DEMORA | ADELANTO' },
    nro_informe_entrega: { type: DataTypes.STRING(100), allowNull: true, comment: 'Número del informe de entrega' },
    guia_entrega_salida: { type: DataTypes.STRING(100), allowNull: true, comment: 'Guía de remisión de salida' },
    nro_factura: { type: DataTypes.STRING(100), allowNull: true, comment: 'Número de factura HP&K al cliente' },
    fecha_facturacion: { type: DataTypes.DATE, allowNull: true, comment: 'Fecha de facturación' },
    dias_en_taller: { type: DataTypes.INTEGER, allowNull: true, comment: 'Calculado: días totales desde recepción hasta entrega' },
    // === % AVANCE POR SUB-COMPONENTE ===
    pct_cilindro: { type: DataTypes.DECIMAL(5, 2), allowNull: true, defaultValue: 0 },
    pct_vastago: { type: DataTypes.DECIMAL(5, 2), allowNull: true, defaultValue: 0 },
    pct_tapa: { type: DataTypes.DECIMAL(5, 2), allowNull: true, defaultValue: 0 },
    pct_piston: { type: DataTypes.DECIMAL(5, 2), allowNull: true, defaultValue: 0 },
    pct_cuerpo_int_1: { type: DataTypes.DECIMAL(5, 2), allowNull: true, defaultValue: 0 },
    pct_cuerpo_int_2: { type: DataTypes.DECIMAL(5, 2), allowNull: true, defaultValue: 0 },
    pct_otros: { type: DataTypes.DECIMAL(5, 2), allowNull: true, defaultValue: 0 },
  },
  {
    sequelize,
    tableName: 'orden_trabajo',
    timestamps: false,
    hooks: {
      beforeSave: (instance: OrdenTrabajo) => {
        // Calcular % PCR
        if (instance.pcr && instance.pcr > 0 && instance.horas) {
          instance.porcentaje_pcr = (instance.horas / instance.pcr) * 100;
        } else {
          instance.porcentaje_pcr = 0;
        }
        // Calcular días en taller
        if (instance.fecha_recepcion && instance.fecha_entrega) {
          const diff = instance.fecha_entrega.getTime() - instance.fecha_recepcion.getTime();
          instance.dias_en_taller = Math.round(diff / (1000 * 60 * 60 * 24));
        }
        // Calcular días evaluación
        if (instance.fecha_recepcion && instance.fecha_entrega_informe) {
          const diff = instance.fecha_entrega_informe.getTime() - instance.fecha_recepcion.getTime();
          instance.dias_evaluacion = Math.round(diff / (1000 * 60 * 60 * 24));
        }
        // Calcular cumplimiento
        if (instance.fecha_entrega && instance.fecha_requerimiento_cliente) {
          const diff = instance.fecha_entrega.getTime() - instance.fecha_requerimiento_cliente.getTime();
          const dias = Math.round(diff / (1000 * 60 * 60 * 24));
          instance.cumplimiento = dias <= 0 ? 'A TIEMPO' : 'DEMORA';
        }
      },
    },
  }
);

export default OrdenTrabajo;
