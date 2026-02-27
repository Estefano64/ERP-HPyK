import sequelize from '../config/database';
import {
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
} from '../models/index';

async function seedDatabase() {
  try {
    console.log('Iniciando seeds de catálogos...\n');
    console.log('Sembrando Monedas...');
    await Moneda.bulkCreate([
      { codigo: 'USD', nombre: 'Dólar Estadounidense', simbolo: '$', activo: true },
      { codigo: 'PEN', nombre: 'Sol Peruano', simbolo: 'S/', activo: true },
      { codigo: 'EUR', nombre: 'Euro', simbolo: '€', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 3 monedas creadas\n');

    // UNIDADES DE MEDIDA
    console.log('Sembrando Unidades de Medida...');
    await UnidadMedida.bulkCreate([
      { codigo: 'UND', nombre: 'Unidad', abreviatura: 'und', activo: true },
      { codigo: 'KG', nombre: 'Kilogramo', abreviatura: 'kg', activo: true },
      { codigo: 'MT', nombre: 'Metro', abreviatura: 'm', activo: true },
      { codigo: 'LT', nombre: 'Litro', abreviatura: 'L', activo: true },
      { codigo: 'GLN', nombre: 'Galón', abreviatura: 'gal', activo: true },
      { codigo: 'PZA', nombre: 'Pieza', abreviatura: 'pza', activo: true },
      { codigo: 'CJA', nombre: 'Caja', abreviatura: 'cja', activo: true },
      { codigo: 'HR', nombre: 'Hora', abreviatura: 'hr', activo: true },
      { codigo: 'DIA', nombre: 'Día', abreviatura: 'día', activo: true },
      { codigo: 'SEM', nombre: 'Semana', abreviatura: 'sem', activo: true },
      { codigo: 'MES', nombre: 'Mes', abreviatura: 'mes', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 11 unidades de medida creadas\n');

    // PLANTAS
    console.log('Sembrando Plantas...');
    await Planta.bulkCreate([
      { codigo: 'LIMA', nombre: 'Planta Lima - Principal', direccion: 'Av. Industrial 123', activo: true },
      { codigo: 'CALLAO', nombre: 'Planta Callao - Almacén', direccion: 'Jr. Puerto 456', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 2 plantas creadas\n');

    // ÁREAS
    console.log('Sembrando Áreas...');
    await Area.bulkCreate([
      { codigo: 'LOG', nombre: 'Logística', activo: true },
      { codigo: 'PROD', nombre: 'Producción', activo: true },
      { codigo: 'MANT', nombre: 'Mantenimiento', activo: true },
      { codigo: 'ADMIN', nombre: 'Administración', activo: true },
      { codigo: 'ALMACEN', nombre: 'Almacén', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 5 áreas creadas\n');

    // SUB-ÁREAS
    console.log('Sembrando Sub-Áreas...');
    await SubArea.bulkCreate([
      { codigo: 'LOG-COMP', nombre: 'Compras', area_codigo: 'LOG', activo: true },
      { codigo: 'LOG-INV', nombre: 'Inventario', area_codigo: 'LOG', activo: true },
      { codigo: 'PROD-TURBO', nombre: 'Turbocompresores', area_codigo: 'PROD', activo: true },
      { codigo: 'PROD-MOTOR', nombre: 'Motores', area_codigo: 'PROD', activo: true },
      { codigo: 'MANT-PREV', nombre: 'Preventivo', area_codigo: 'MANT', activo: true },
      { codigo: 'MANT-CORR', nombre: 'Correctivo', area_codigo: 'MANT', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 6 sub-áreas creadas\n');

    // FABRICANTES
    console.log('Sembrando Fabricantes...');
    await Fabricante.bulkCreate([
      { codigo: 'CAT', nombre: 'Caterpillar Inc.', pais: 'USA', activo: true },
      { codigo: 'CUMMINS', nombre: 'Cummins Inc.', pais: 'USA', activo: true },
      { codigo: 'VOLVO', nombre: 'Volvo Group', pais: 'Sweden', activo: true },
      { codigo: 'MAN', nombre: 'MAN SE', pais: 'Germany', activo: true },
      { codigo: 'GE', nombre: 'General Electric', pais: 'USA', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 5 fabricantes creados\n');

    // CATEGORÍAS
    console.log('Sembrando Categorías...');
    await Categoria.bulkCreate([
      { codigo: 'REP', nombre: 'Repuestos', activo: true },
      { codigo: 'CONS', nombre: 'Consumibles', activo: true },
      { codigo: 'HERR', nombre: 'Herramientas', activo: true },
      { codigo: 'SERV', nombre: 'Servicios', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 4 categorías creadas\n');

    // CLASIFICACIONES
    console.log('Sembrando Clasificaciones...');
    await Clasificacion.bulkCreate([
      { codigo: 'A', nombre: 'Crítico - Alta rotación', activo: true },
      { codigo: 'B', nombre: 'Importante - Media rotación', activo: true },
      { codigo: 'C', nombre: 'Normal - Baja rotación', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 3 clasificaciones creadas\n');

    // ============================================
    // CATÁLOGOS DE EQUIPOS
    // ============================================
    
    // STATUS DE EQUIPOS
    console.log('Sembrando Status de Equipos...');
    await StatusEquipo.bulkCreate([
      { codigo: 'OPERATIVO', nombre: 'Operativo', activo: true },
      { codigo: 'MANT', nombre: 'En Mantenimiento', activo: true },
      { codigo: 'BAJA', nombre: 'Fuera de Servicio', activo: true },
      { codigo: 'REPARANDO', nombre: 'En Reparación', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 4 status de equipos creados\n');

    // TIPOS DE EQUIPOS
    console.log('Sembrando Tipos de Equipos...');
    await TipoEquipo.bulkCreate([
      { codigo: 'TURBO', nombre: 'Turbocompresor', activo: true },
      { codigo: 'MOTOR', nombre: 'Motor', activo: true },
      { codigo: 'COMPRESOR', nombre: 'Compresor', activo: true },
      { codigo: 'BOMBA', nombre: 'Bomba', activo: true },
      { codigo: 'GENERADOR', nombre: 'Generador', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 5 tipos de equipos creados\n');

    // CRITICIDAD
    console.log('Sembrando Criticidad...');
    await Criticidad.bulkCreate([
      { codigo: 'ALTA', nombre: 'Alta', nivel: 1, activo: true },
      { codigo: 'MEDIA', nombre: 'Media', nivel: 2, activo: true },
      { codigo: 'BAJA', nombre: 'Baja', nivel: 3, activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 3 niveles de criticidad creados\n');

    // ============================================
    // CATÁLOGOS DE ESTRATEGIAS
    // ============================================
    
    // STATUS DE ESTRATEGIAS
    console.log('Sembrando Status de Estrategias...');
    await StatusEstrategia.bulkCreate([
      { codigo: 'ACTIVA', nombre: 'Activa', activo: true },
      { codigo: 'INACTIVA', nombre: 'Inactiva', activo: true },
      { codigo: 'PAUSADA', nombre: 'Pausada', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 3 status de estrategias creados\n');

    // TIPOS DE ESTRATEGIAS
    console.log('Sembrando Tipos de Estrategias...');
    await TipoEstrategia.bulkCreate([
      { codigo: 'PREV', nombre: 'Mantenimiento Preventivo', activo: true },
      { codigo: 'PRED', nombre: 'Mantenimiento Predictivo', activo: true },
      { codigo: 'CORR', nombre: 'Mantenimiento Correctivo', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 3 tipos de estrategias creados\n');

    // ============================================
    // CATÁLOGOS DE TAREAS
    // ============================================
    
    // TIPOS DE TAREAS
    console.log('Sembrando Tipos de Tareas...');
    await TipoTarea.bulkCreate([
      { codigo: 'MATERIAL', nombre: 'Material', activo: true },
      { codigo: 'SERVICIO', nombre: 'Servicio', activo: true },
      { codigo: 'MANO_OBRA', nombre: 'Mano de Obra', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 3 tipos de tareas creados\n');

    // ============================================
    // CATÁLOGOS DE CÓDIGOS DE REPARACIÓN
    // ============================================
    
    // TIPOS DE CÓDIGOS DE REPARACIÓN
    console.log('Sembrando Tipos de Códigos de Reparación...');
    await TipoCodRep.bulkCreate([
      { codigo: 'CORRECTIVO', nombre: 'Correctivo', activo: true },
      { codigo: 'PREVENTIVO', nombre: 'Preventivo', activo: true },
      { codigo: 'OVERHAUL', nombre: 'Overhaul', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 3 tipos de códigos de reparación creados\n');

    // CATEGORÍAS DE CÓDIGOS DE REPARACIÓN
    console.log('Sembrando Categorías de Códigos de Reparación...');
    await CategoriaCodRep.bulkCreate([
      { codigo: 'MECANICO', nombre: 'Mecánico', activo: true },
      { codigo: 'ELECTRICO', nombre: 'Eléctrico', activo: true },
      { codigo: 'HIDRAULICO', nombre: 'Hidráulico', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 3 categorías de códigos de reparación creadas\n');

    // FLOTAS DE EQUIPOS
    console.log('Sembrando Flotas de Equipos...');
    await FlotaEquipo.bulkCreate([
      { codigo: 'MINERIA', nombre: 'Minería', activo: true },
      { codigo: 'TRANSPORTE', nombre: 'Transporte', activo: true },
      { codigo: 'INDUSTRIAL', nombre: 'Industrial', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 3 flotas de equipos creadas\n');

    // POSICIONES
    console.log('Sembrando Posiciones...');
    await Posicion.bulkCreate([
      { codigo: 'FRONTAL', nombre: 'Frontal', activo: true },
      { codigo: 'TRASERO', nombre: 'Trasero', activo: true },
      { codigo: 'LAT_IZQ', nombre: 'Lateral Izquierdo', activo: true },
      { codigo: 'LAT_DER', nombre: 'Lateral Derecho', activo: true },
      { codigo: 'SUPERIOR', nombre: 'Superior', activo: true },
      { codigo: 'INFERIOR', nombre: 'Inferior', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 6 posiciones creadas\n');

    // ============================================
    // CATÁLOGOS DE ÓRDENES DE TRABAJO
    // ============================================
    
    // CLIENTES
    console.log('Sembrando Clientes...');
    await Cliente.bulkCreate([
      { 
        codigo: 'CLI001', 
        razon_social: 'Minera del Sur S.A.C.', 
        nombre_comercial: 'MINERSUR',
        ruc: '20123456789',
        contacto_principal: 'Juan Pérez',
        activo: true 
      },
      { 
        codigo: 'CLI002', 
        razon_social: 'Transportes del Norte E.I.R.L.', 
        nombre_comercial: 'TRANSNORTE',
        ruc: '20987654321',
        contacto_principal: 'María García',
        activo: true 
      },
    ], { ignoreDuplicates: true });
    console.log('✓ 2 clientes creados\n');

    // GARANTÍAS
    console.log('Sembrando Garantías...');
    await Garantia.bulkCreate([
      { codigo: 'SI', nombre: 'Con Garantía', activo: true },
      { codigo: 'NO', nombre: 'Sin Garantía', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 2 garantías creadas\n');

    // ATENCIÓN REPARACIÓN
    console.log('Sembrando Atención Reparación...');
    await AtencionReparacion.bulkCreate([
      { codigo: 'URGENTE', nombre: 'Urgente', activo: true },
      { codigo: 'NORMAL', nombre: 'Normal', activo: true },
      { codigo: 'PROGRAMADO', nombre: 'Programado', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 3 tipos de atención reparación creados\n');

    // TIPOS DE REPARACIÓN
    console.log('Sembrando Tipos de Reparación...');
    await TipoReparacion.bulkCreate([
      { codigo: 'CORRECTIVO', nombre: 'Correctivo', activo: true },
      { codigo: 'PREVENTIVO', nombre: 'Preventivo', activo: true },
      { codigo: 'OVERHAUL', nombre: 'Overhaul', activo: true },
      { codigo: 'INSPECCION', nombre: 'Inspección', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 4 tipos de reparación creados\n');

    // TIPOS DE GARANTÍA
    console.log('Sembrando Tipos de Garantía...');
    await TipoGarantia.bulkCreate([
      { codigo: 'FABRICANTE', nombre: 'Garantía de Fabricante', activo: true },
      { codigo: 'TALLER', nombre: 'Garantía de Taller', activo: true },
      { codigo: 'EXTENDIDA', nombre: 'Garantía Extendida', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 3 tipos de garantía creados\n');

    // PRIORIDAD DE ATENCIÓN
    console.log('Sembrando Prioridad de Atención...');
    await PrioridadAtencion.bulkCreate([
      { codigo: 'URGENTE', nombre: 'Urgente', nivel: 1, activo: true },
      { codigo: 'ALTA', nombre: 'Alta', nivel: 2, activo: true },
      { codigo: 'MEDIA', nombre: 'Media', nivel: 3, activo: true },
      { codigo: 'BAJA', nombre: 'Baja', nivel: 4, activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 4 prioridades de atención creadas\n');

    // BASE METÁLICA
    console.log('Sembrando Base Metálica...');
    await BaseMetalica.bulkCreate([
      { codigo: 'SI', nombre: 'Con Base Metálica', activo: true },
      { codigo: 'NO', nombre: 'Sin Base Metálica', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 2 opciones de base metálica creadas\n');

    // STATUS DE OT
    console.log('Sembrando Status de OT...');
    await OtStatus.bulkCreate([
      { codigo: 'ABIERTA', nombre: 'Abierta', activo: true },
      { codigo: 'EN_PROCESO', nombre: 'En Proceso', activo: true },
      { codigo: 'EN_ESPERA', nombre: 'En Espera', activo: true },
      { codigo: 'CERRADA', nombre: 'Cerrada', activo: true },
      { codigo: 'CANCELADA', nombre: 'Cancelada', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 5 status de OT creados\n');

    // STATUS DE RECURSOS
    console.log('Sembrando Status de Recursos...');
    await RecursosStatus.bulkCreate([
      { codigo: 'COMPLETO', nombre: 'Completo', activo: true },
      { codigo: 'PARCIAL', nombre: 'Parcial', activo: true },
      { codigo: 'PENDIENTE', nombre: 'Pendiente', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 3 status de recursos creados\n');

    // STATUS DE TALLER
    console.log('Sembrando Status de Taller...');
    await TallerStatus.bulkCreate([
      { codigo: 'NO_INGRESO', nombre: 'No Ingresado', activo: true },
      { codigo: 'EN_TALLER', nombre: 'En Taller', activo: true },
      { codigo: 'REPARANDO', nombre: 'En Reparación', activo: true },
      { codigo: 'FINALIZADO', nombre: 'Finalizado', activo: true },
      { codigo: 'ENTREGADO', nombre: 'Entregado', activo: true },
    ], { ignoreDuplicates: true });
    console.log('✓ 5 status de taller creados\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✓ SEEDS COMPLETADOS EXITOSAMENTE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('RESUMEN:');
    console.log('  - 3 Monedas');
    console.log('  - 11 Unidades de Medida');
    console.log('  - 2 Plantas');
    console.log('  - 5 Áreas');
    console.log('  - 6 Sub-Áreas');
    console.log('  - 5 Fabricantes');
    console.log('  - 4 Categorías');
    console.log('  - 3 Clasificaciones');
    console.log('  - 4 Status de Equipos');
    console.log('  - 5 Tipos de Equipos');
    console.log('  - 3 Criticidades');
    console.log('  - 3 Status de Estrategias');
    console.log('  - 3 Tipos de Estrategias');
    console.log('  - 3 Tipos de Tareas');
    console.log('  - 3 Tipos de Códigos de Reparación');
    console.log('  - 3 Categorías de Códigos de Reparación');
    console.log('  - 3 Flotas de Equipos');
    console.log('  - 6 Posiciones');
    console.log('  - 2 Clientes');
    console.log('  - 2 Garantías');
    console.log('  - 3 Atención Reparación');
    console.log('  - 4 Tipos de Reparación');
    console.log('  - 3 Tipos de Garantía');
    console.log('  - 4 Prioridades de Atención');
    console.log('  - 2 Base Metálica');
    console.log('  - 5 Status de OT');
    console.log('  - 3 Status de Recursos');
    console.log('  - 5 Status de Taller');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('Error al ejecutar seeds:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Cerrando conexión a la base de datos...');
      return sequelize.close();
    })
    .then(() => {
      console.log('✓ Conexión cerrada\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error fatal:', error);
      process.exit(1);
    });
}

export default seedDatabase;
