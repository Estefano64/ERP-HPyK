// ============================================
// NUEVO SISTEMA DE MODELOS - ESTRUCTURA EXCEL
// ============================================

// Importar Configuración
import sequelize from '../config/database';

// ============================================
// IMPORTAR MODELOS PRINCIPALES
// ============================================
import Material from './Material';
import Equipo from './Equipo';
import Estrategia from './Estrategia';
import Tarea from './Tarea';
import CodigoReparacion from './CodigoReparacion';
import OrdenTrabajo from './OrdenTrabajo';

// ============================================
// IMPORTAR MODELOS DE LOGÍSTICA
// ============================================
import Compra from './Compra';
import CompraDetalle from './CompraDetalle';
import OrdenCompra from './OrdenCompra';
import OrdenCompraView from './OrdenCompraView';
import Almacen from './Almacen';
import MovimientoInventario from './MovimientoInventario';
import Proveedor from './Proveedor';
import OTHistorial from './OTHistorial';
import OTRepuesto from './OTRepuesto';
import Herramienta from './Herramienta';

// ============================================
// IMPORTAR CATÁLOGOS COMPARTIDOS
// ============================================
import Planta from './catalogs/Planta';
import Area from './catalogs/Area';
import SubArea from './catalogs/SubArea';
import UnidadMedida from './catalogs/UnidadMedida';
import Moneda from './catalogs/Moneda';
import Fabricante from './catalogs/Fabricante';
import Categoria from './catalogs/Categoria';
import Clasificacion from './catalogs/Clasificacion';

// ============================================
// IMPORTAR CATÁLOGOS DE EQUIPOS
// ============================================
import StatusEquipo from './catalogs/StatusEquipo';
import TipoEquipo from './catalogs/TipoEquipo';
import Criticidad from './catalogs/Criticidad';

// ============================================
// IMPORTAR CATÁLOGOS DE ESTRATEGIAS
// ============================================
import StatusEstrategia from './catalogs/StatusEstrategia';
import TipoEstrategia from './catalogs/TipoEstrategia';

// ============================================
// IMPORTAR CATÁLOGOS DE TAREAS
// ============================================
import TipoTarea from './catalogs/TipoTarea';

// ============================================
// IMPORTAR CATÁLOGOS DE CÓDIGOS DE REPARACIÓN
// ============================================
import TipoCodRep from './catalogs/TipoCodRep';
import CategoriaCodRep from './catalogs/CategoriaCodRep';
import FlotaEquipo from './catalogs/FlotaEquipo';
import Posicion from './catalogs/Posicion';

// ============================================
// IMPORTAR CATÁLOGOS DE ÓRDENES DE TRABAJO
// ============================================
import Cliente from './catalogs/Cliente';
import Garantia from './catalogs/Garantia';
import AtencionReparacion from './catalogs/AtencionReparacion';
import TipoReparacion from './catalogs/TipoReparacion';
import TipoGarantia from './catalogs/TipoGarantia';
import PrioridadAtencion from './catalogs/PrioridadAtencion';
import BaseMetalica from './catalogs/BaseMetalica';
import OtStatus from './catalogs/OtStatus';
import RecursosStatus from './catalogs/RecursosStatus';
import TallerStatus from './catalogs/TallerStatus';

// ============================================
// CONFIGURAR ASOCIACIONES
// ============================================
export function setupAssociations() {
  console.log('Configurando asociaciones de modelos...');

  // ========================================
  // ASOCIACIONES DE MATERIAL (1_Log - Material)
  // ========================================
  Material.belongsTo(Planta, { foreignKey: 'planta_codigo', targetKey: 'codigo', as: 'planta' });
  Material.belongsTo(Area, { foreignKey: 'area_codigo', targetKey: 'codigo', as: 'area' });
  Material.belongsTo(Categoria, { foreignKey: 'categoria_codigo', targetKey: 'codigo', as: 'categoria' });
  Material.belongsTo(Clasificacion, { foreignKey: 'clasificacion_codigo', targetKey: 'codigo', as: 'clasificacion' });
  Material.belongsTo(UnidadMedida, { foreignKey: 'unidad_medida_codigo', targetKey: 'codigo', as: 'unidad_medida' });
  Material.belongsTo(Moneda, { foreignKey: 'moneda_codigo', targetKey: 'codigo', as: 'moneda' });
  Material.belongsTo(Fabricante, { foreignKey: 'fabricante_codigo', targetKey: 'codigo', as: 'fabricante' });

  // ========================================
  // ASOCIACIONES DE EQUIPO (2_Mant - Equipos)
  // ========================================
  Equipo.belongsTo(StatusEquipo, { foreignKey: 'status_codigo', targetKey: 'codigo', as: 'status' });
  Equipo.belongsTo(Area, { foreignKey: 'area_codigo', targetKey: 'codigo', as: 'area' });
  Equipo.belongsTo(SubArea, { foreignKey: 'sub_area_codigo', targetKey: 'codigo', as: 'sub_area' });
  Equipo.belongsTo(TipoEquipo, { foreignKey: 'tipo_codigo', targetKey: 'codigo', as: 'tipo' });
  Equipo.belongsTo(Fabricante, { foreignKey: 'fabricante_codigo', targetKey: 'codigo', as: 'fabricante' });
  Equipo.belongsTo(UnidadMedida, { foreignKey: 'unidad_medida_codigo', targetKey: 'codigo', as: 'unidad_medida' });
  Equipo.belongsTo(Planta, { foreignKey: 'planta_codigo', targetKey: 'codigo', as: 'planta' });
  Equipo.belongsTo(Criticidad, { foreignKey: 'criticidad_codigo', targetKey: 'codigo', as: 'criticidad' });

  // ========================================
  // ASOCIACIONES DE ESTRATEGIA (3_Todos - Estrategias)
  // ========================================
  Estrategia.belongsTo(Area, { foreignKey: 'area_codigo', targetKey: 'codigo', as: 'area' });
  Estrategia.belongsTo(Equipo, { foreignKey: 'equipo_codigo', targetKey: 'codigo', as: 'equipo' });
  Estrategia.belongsTo(UnidadMedida, { foreignKey: 'unidad_medida_codigo', targetKey: 'codigo', as: 'unidad_medida' });
  Estrategia.belongsTo(TipoEstrategia, { foreignKey: 'tipo_estrategia_codigo', targetKey: 'codigo', as: 'tipo' });
  Estrategia.belongsTo(StatusEstrategia, { foreignKey: 'status_codigo', targetKey: 'codigo', as: 'status' });

  // ========================================
  // ASOCIACIONES DE TAREA (4_Log_prod - Task List)
  // ========================================
  Tarea.belongsTo(CodigoReparacion, { foreignKey: 'cod_rep_codigo', targetKey: 'codigo', as: 'codigo_reparacion' });
  Tarea.belongsTo(TipoTarea, { foreignKey: 'tipo_codigo', targetKey: 'codigo', as: 'tipo' });
  Tarea.belongsTo(Material, { foreignKey: 'material_codigo', targetKey: 'codigo', as: 'material' });

  // ========================================
  // ASOCIACIONES DE CODIGO_REPARACION (5_Cod_Rep)
  // ========================================
  CodigoReparacion.belongsTo(TipoCodRep, { foreignKey: 'tipo_codigo', targetKey: 'codigo', as: 'tipo' });
  CodigoReparacion.belongsTo(CategoriaCodRep, { foreignKey: 'categoria_codigo', targetKey: 'codigo', as: 'categoria' });
  CodigoReparacion.belongsTo(FlotaEquipo, { foreignKey: 'flota_codigo', targetKey: 'codigo', as: 'flota' });
  CodigoReparacion.belongsTo(Fabricante, { foreignKey: 'fabricante_codigo', targetKey: 'codigo', as: 'fabricante' });
  CodigoReparacion.belongsTo(Posicion, { foreignKey: 'posicion_codigo', targetKey: 'codigo', as: 'posicion' });

  // ========================================
  // ASOCIACIONES DE ORDEN_TRABAJO (6_OTs)
  // ========================================
  OrdenTrabajo.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });
  // OrdenTrabajo.belongsTo(Estrategia, { foreignKey: 'estrategia_codigo', targetKey: 'codigo', as: 'estrategia' });
  OrdenTrabajo.belongsTo(CodigoReparacion, { foreignKey: 'id_cod_rep', as: 'codigo_reparacion' });
  OrdenTrabajo.belongsTo(Equipo, { foreignKey: 'equipo_codigo', targetKey: 'codigo', as: 'equipo' });
  OrdenTrabajo.belongsTo(Garantia, { foreignKey: 'garantia_codigo', targetKey: 'codigo', as: 'garantia' });
  OrdenTrabajo.belongsTo(AtencionReparacion, { foreignKey: 'atencion_reparacion_codigo', targetKey: 'codigo', as: 'atencion_reparacion' });
  OrdenTrabajo.belongsTo(TipoReparacion, { foreignKey: 'tipo_reparacion_codigo', targetKey: 'codigo', as: 'tipo_reparacion' });
  OrdenTrabajo.belongsTo(TipoGarantia, { foreignKey: 'tipo_garantia_codigo', targetKey: 'codigo', as: 'tipo_garantia' });
  OrdenTrabajo.belongsTo(PrioridadAtencion, { foreignKey: 'prioridad_atencion_codigo', targetKey: 'codigo', as: 'prioridad_atencion' });
  OrdenTrabajo.belongsTo(BaseMetalica, { foreignKey: 'base_metalica_codigo', targetKey: 'codigo', as: 'base_metalica' });
  OrdenTrabajo.belongsTo(OtStatus, { foreignKey: 'ot_status_codigo', targetKey: 'codigo', as: 'ot_status' });
  OrdenTrabajo.belongsTo(RecursosStatus, { foreignKey: 'recursos_status_codigo', targetKey: 'codigo', as: 'recursos_status' });
  OrdenTrabajo.belongsTo(TallerStatus, { foreignKey: 'taller_status_codigo', targetKey: 'codigo', as: 'taller_status' });

  // ========================================
  // ASOCIACIONES INVERSAS (hasMany)
  // ========================================
  Area.belongsTo(Planta, { foreignKey: 'planta_codigo', targetKey: 'codigo', as: 'planta' });
  SubArea.belongsTo(Area, { foreignKey: 'area_codigo', targetKey: 'codigo', as: 'area' });
  
  Planta.hasMany(Material, { foreignKey: 'planta_codigo', sourceKey: 'codigo', as: 'materiales' });
  Planta.hasMany(Equipo, { foreignKey: 'planta_codigo', sourceKey: 'codigo', as: 'equipos' });
  Planta.hasMany(Area, { foreignKey: 'planta_codigo', sourceKey: 'codigo', as: 'areas' });
  
  Area.hasMany(Material, { foreignKey: 'area_codigo', sourceKey: 'codigo', as: 'materiales' });
  Area.hasMany(Equipo, { foreignKey: 'area_codigo', sourceKey: 'codigo', as: 'equipos' });
  Area.hasMany(Estrategia, { foreignKey: 'area_codigo', sourceKey: 'codigo', as: 'estrategias' });
  Area.hasMany(SubArea, { foreignKey: 'area_codigo', sourceKey: 'codigo', as: 'sub_areas' });
  
  Equipo.hasMany(Estrategia, { foreignKey: 'equipo_codigo', sourceKey: 'codigo', as: 'estrategias' });
  Equipo.hasMany(OrdenTrabajo, { foreignKey: 'equipo_codigo', sourceKey: 'codigo', as: 'ordenes_trabajo' });
  
  Estrategia.hasMany(OrdenTrabajo, { foreignKey: 'estrategia_codigo', sourceKey: 'codigo', as: 'ordenes_trabajo' });
  
  CodigoReparacion.hasMany(Tarea, { foreignKey: 'cod_rep_codigo', sourceKey: 'codigo', as: 'tareas' });
  CodigoReparacion.hasMany(OrdenTrabajo, { foreignKey: 'cod_rep_codigo', sourceKey: 'codigo', as: 'ordenes_trabajo' });
  
  Material.hasMany(Tarea, { foreignKey: 'material_codigo', sourceKey: 'codigo', as: 'tareas' });
  
  Cliente.hasMany(OrdenTrabajo, { foreignKey: 'cliente_id', as: 'ordenes_trabajo' });

  // ========================================
  // ASOCIACIONES DE LOGÍSTICA
  // ========================================
  
  // Compra - CompraDetalle (One-to-Many)
  Compra.hasMany(CompraDetalle, { foreignKey: 'compra_id', as: 'detalles' });
  CompraDetalle.belongsTo(Compra, { foreignKey: 'compra_id', as: 'compra' });
  
  // Proveedor - Compra (One-to-Many)
  Proveedor.hasMany(Compra, { foreignKey: 'proveedor_id', as: 'compras' });
  Compra.belongsTo(Proveedor, { foreignKey: 'proveedor_id', as: 'proveedor' });
  
  // Almacen - Compra (One-to-Many)
  Almacen.hasMany(Compra, { foreignKey: 'almacen_id', as: 'compras' });
  Compra.belongsTo(Almacen, { foreignKey: 'almacen_id', as: 'almacen' });
  
  // Material - CompraDetalle (One-to-Many)
  Material.hasMany(CompraDetalle, { foreignKey: 'material_id', as: 'compra_detalles' });
  CompraDetalle.belongsTo(Material, { foreignKey: 'material_id', as: 'material' });
  
  // OrdenTrabajo - Compra (One-to-Many)
  OrdenTrabajo.hasMany(Compra, { foreignKey: 'ot_id', as: 'compras' });
  Compra.belongsTo(OrdenTrabajo, { foreignKey: 'ot_id', as: 'orden_trabajo' });

  console.log('✓ Asociaciones de modelos configuradas');
}

// ============================================
// EXPORTAR TODOS LOS MODELOS
// ============================================
export {
  sequelize,
  // Modelos Principales
  Material,
  Equipo,
  Estrategia,
  Tarea,
  CodigoReparacion,
  OrdenTrabajo,
  // Modelos de Logística
  Compra,
  CompraDetalle,
  OrdenCompra,
  OrdenCompraView,
  Almacen,
  MovimientoInventario,
  Proveedor,
  OTHistorial,
  OTRepuesto,
  Herramienta,
  // Catálogos Compartidos
  Planta,
  Area,
  SubArea,
  UnidadMedida,
  Moneda,
  Fabricante,
  Categoria,
  Clasificacion,
  // Catálogos de Equipos
  StatusEquipo,
  TipoEquipo,
  Criticidad,
  // Catálogos de Estrategias
  StatusEstrategia,
  TipoEstrategia,
  // Catálogos de Tareas
  TipoTarea,
  // Catálogos de Códigos de Reparación
  TipoCodRep,
  CategoriaCodRep,
  FlotaEquipo,
  Posicion,
  // Catálogos de Órdenes de Trabajo
  Cliente,
  Garantia,
  AtencionReparacion,
  TipoReparacion,
  TipoGarantia,
  PrioridadAtencion,
  BaseMetalica,
  OtStatus,
  RecursosStatus,
  TallerStatus,
};

export default {
  sequelize,
  setupAssociations,
  // Modelos Principales
  Material,
  Equipo,
  Estrategia,
  Tarea,
  CodigoReparacion,
  OrdenTrabajo,
  // Catálogos
  Planta,
  Area,
  SubArea,
  UnidadMedida,
  Moneda,
  Fabricante,
  Categoria,
  Clasificacion,
  StatusEquipo,
  TipoEquipo,
  Criticidad,
  StatusEstrategia,
  TipoEstrategia,
  TipoTarea,
  TipoCodRep,
  CategoriaCodRep,
  FlotaEquipo,
  Posicion,
  Cliente,
  Garantia,
  AtencionReparacion,
  TipoReparacion,
  TipoGarantia,
  PrioridadAtencion,
  BaseMetalica,
  OtStatus,
  RecursosStatus,
  TallerStatus,
};
