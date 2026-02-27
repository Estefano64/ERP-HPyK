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
  ot_status_codigo?: string;
  recursos_status_codigo?: string;
  taller_status_codigo?: string;
  usuario_crea?: string;
  fecha_creacion?: Date;
  usuario_actualiza?: string;
  fecha_actualizacion?: Date;
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
  public ot_status_codigo?: string;
  public recursos_status_codigo?: string;
  public taller_status_codigo?: string;
  public usuario_crea?: string;
  public fecha_creacion?: Date;
  public usuario_actualiza?: string;
  public fecha_actualizacion?: Date;
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
      type: DataTypes.STRING(50),
      allowNull: true,
      references: { model: 'equipo', key: 'codigo' },
      comment: 'Manual - Código del equipo',
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
      type: DataTypes.STRING(10),
      allowNull: true,
      references: { model: 'atencion_reparacion', key: 'codigo' },
      comment: 'Tabla catálogo - Atención reparación',
    },
    tipo_reparacion_codigo: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: { model: 'tipo_reparacion', key: 'codigo' },
      comment: 'Tabla catálogo - Tipo Reparación',
    },
    tipo_garantia_codigo: {
      type: DataTypes.STRING(10),
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
    ot_status_codigo: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: { model: 'ot_status', key: 'codigo' },
      comment: 'Tabla catálogo - OT Status',
    },
    recursos_status_codigo: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: { model: 'recursos_status', key: 'codigo' },
      comment: 'Tabla catálogo - Recursos Status',
    },
    taller_status_codigo: {
      type: DataTypes.STRING(10),
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
  },
  {
    sequelize,
    tableName: 'orden_trabajo',
    timestamps: false,
    hooks: {
      // Hook para calcular porcentaje_pcr antes de crear/actualizar
      beforeSave: (instance: OrdenTrabajo) => {
        if (instance.pcr && instance.pcr > 0 && instance.horas) {
          instance.porcentaje_pcr = (instance.horas / instance.pcr) * 100;
        } else {
          instance.porcentaje_pcr = 0;
        }
      },
    },
  }
);

export default OrdenTrabajo;
