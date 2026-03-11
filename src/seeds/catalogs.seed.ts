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

// ================================================================
// DATOS REALES de la empresa HPyK — extraídos de los Excel en data/
// ================================================================

async function seedDatabase() {
  try {
    console.log('Iniciando seeds de catálogos...\n');
    await sequelize.sync({ force: false });

    // ── MONEDAS ──────────────────────────────────────────────────
    console.log('Sembrando Monedas...');
    await Moneda.bulkCreate([
      { codigo: 'USD', nombre: 'Dólar',  simbolo: '$',  activo: true },
      { codigo: 'SOL', nombre: 'Soles',  simbolo: 'S/', activo: true },
    ], { updateOnDuplicate: ['nombre', 'simbolo', 'activo'] });
    console.log('✓ 2 monedas\n');

    // ── UNIDADES DE MEDIDA ───────────────────────────────────────
    console.log('Sembrando Unidades de Medida...');
    await UnidadMedida.bulkCreate([
      { codigo: 'mm',  nombre: 'Milímetro',       abreviatura: 'mm',  activo: true },
      { codigo: 'cm',  nombre: 'Centímetro',       abreviatura: 'cm',  activo: true },
      { codigo: 'm',   nombre: 'Metro',             abreviatura: 'm',   activo: true },
      { codigo: 'in',  nombre: 'Pulgada',           abreviatura: 'in',  activo: true },
      { codigo: 'kg',  nombre: 'Kilogramo',         abreviatura: 'kg',  activo: true },
      { codigo: 't',   nombre: 'Tonelada',          abreviatura: 't',   activo: true },
      { codigo: 'h',   nombre: 'Hora',              abreviatura: 'h',   activo: true },
      { codigo: 'm2',  nombre: 'Metro cuadrado',    abreviatura: 'm²',  activo: true },
      { codigo: 'm3',  nombre: 'Metro cúbico',      abreviatura: 'm³',  activo: true },
      { codigo: 'lt',  nombre: 'Litro',             abreviatura: 'lt',  activo: true },
      { codigo: 'gl',  nombre: 'Galón',             abreviatura: 'gl',  activo: true },
      { codigo: 'und', nombre: 'Unidad',            abreviatura: 'und', activo: true },
      { codigo: 'cil', nombre: 'Cilindro',          abreviatura: 'cil', activo: true },
      { codigo: 'año', nombre: 'Año',               abreviatura: 'año', activo: true },
      { codigo: 'mes', nombre: 'Mes',               abreviatura: 'mes', activo: true },
      { codigo: 'dia', nombre: 'Día',               abreviatura: 'día', activo: true },
      { codigo: 'km',  nombre: 'Kilómetro',         abreviatura: 'km',  activo: true },
      { codigo: 'amp', nombre: 'Amperaje',          abreviatura: 'A',   activo: true },
      { codigo: 'lbf', nombre: 'Libras Fuerza',     abreviatura: 'lbf', activo: true },
    ], { updateOnDuplicate: ['nombre', 'abreviatura', 'activo'] });
    console.log('✓ 19 unidades de medida\n');

    // ── PLANTAS ──────────────────────────────────────────────────
    console.log('Sembrando Plantas...');
    await Planta.bulkCreate([
      { codigo: 'AQPTA01', nombre: 'Taller de Reparación Arequipa', direccion: 'Arequipa, Perú', activo: true },
    ], { updateOnDuplicate: ['nombre', 'direccion', 'activo'] });
    console.log('✓ 1 planta\n');

    // ── ÁREAS ────────────────────────────────────────────────────
    console.log('Sembrando Áreas...');
    await Area.bulkCreate([
      { codigo: 'PR', nombre: 'Producción',     activo: true },
      { codigo: 'MT', nombre: 'Mantenimiento',  activo: true },
      { codigo: 'LG', nombre: 'Logística',      activo: true },
      { codigo: 'SG', nombre: 'Seguridad',      activo: true },
      { codigo: 'AD', nombre: 'Administración', activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 5 áreas\n');

    // ── SUB-ÁREAS ────────────────────────────────────────────────
    console.log('Sembrando Sub-Áreas...');
    await SubArea.bulkCreate([
      // Producción
      { codigo: 'EVA', nombre: 'Evaluación',             area_codigo: 'PR', activo: true },
      { codigo: 'BRU', nombre: 'Bruñido',                area_codigo: 'PR', activo: true },
      { codigo: 'SOL', nombre: 'Soldadura',              area_codigo: 'PR', activo: true },
      { codigo: 'MAQ', nombre: 'Maquinado',              area_codigo: 'PR', activo: true },
      { codigo: 'PIN', nombre: 'Pintura',                area_codigo: 'PR', activo: true },
      { codigo: 'CRO', nombre: 'Cromado',                area_codigo: 'PR', activo: true },
      // Mantenimiento
      { codigo: 'HER', nombre: 'Herramientas',           area_codigo: 'MT', activo: true },
      { codigo: 'EQP', nombre: 'Equipos',                area_codigo: 'MT', activo: true },
      { codigo: 'VEH', nombre: 'Vehículos',              area_codigo: 'MT', activo: true },
      { codigo: 'INF', nombre: 'Infraestructura',        area_codigo: 'MT', activo: true },
      // Logística
      { codigo: 'ASU', nombre: 'Almacén de Suministros', area_codigo: 'LG', activo: true },
      { codigo: 'ARE', nombre: 'Almacén de Repuestos',   area_codigo: 'LG', activo: true },
    ], { updateOnDuplicate: ['nombre', 'area_codigo', 'activo'] });
    console.log('✓ 12 sub-áreas\n');

    // ── FABRICANTES ──────────────────────────────────────────────
    console.log('Sembrando Fabricantes...');
    await Fabricante.bulkCreate([
      // Clientes / proveedores de equipos mineros
      { codigo: 'CAT',       nombre: 'Caterpillar',       pais: 'USA',       activo: true },
      { codigo: 'KOMATSU',   nombre: 'Komatsu',           pais: 'Japan',     activo: true },
      { codigo: 'ALT',       nombre: 'Alternativo',       pais: 'Peru',      activo: true },
      { codigo: 'MACHEN',    nombre: 'Machen',            pais: 'Peru',      activo: true },
      // Equipos de evaluación / pruebas
      { codigo: 'COLUMBIA',  nombre: 'Columbia',          pais: 'USA',       activo: true },
      // Equipos de maquinado
      { codigo: 'SARO',      nombre: 'Saro',              pais: 'China',     activo: true },
      { codigo: 'NILES',     nombre: 'Niles',             pais: 'Germany',   activo: true },
      { codigo: 'ZAYER',     nombre: 'Zayer',             pais: 'Spain',     activo: true },
      { codigo: 'UNION',     nombre: 'Union',             pais: 'Germany',   activo: true },
      { codigo: 'SIR_MEC',   nombre: 'Sir-Mec',           pais: 'Italy',     activo: true },
      // Equipos de soldadura
      { codigo: 'MILLER',    nombre: 'Miller Electric',   pais: 'USA',       activo: true },
      { codigo: 'LINCOLN',   nombre: 'Lincoln Electric',  pais: 'USA',       activo: true },
      // Infraestructura / utilidades
      { codigo: 'WILSON',    nombre: 'Wilson',            pais: 'USA',       activo: true },
      // Montacargas / vehículos
      { codigo: 'HANGCHA',   nombre: 'Hangcha',           pais: 'China',     activo: true },
      { codigo: 'JAC',       nombre: 'JAC Motors',        pais: 'China',     activo: true },
      { codigo: 'TOYOTA',    nombre: 'Toyota',            pais: 'Japan',     activo: true },
      { codigo: 'VW',        nombre: 'Volkswagen',        pais: 'Germany',   activo: true },
      { codigo: 'HYUNDAI',   nombre: 'Hyundai',           pais: 'Korea',     activo: true },
      // Herramientas eléctricas
      { codigo: 'BOSCH',     nombre: 'Bosch',             pais: 'Germany',   activo: true },
      { codigo: 'MAKITA',    nombre: 'Makita',            pais: 'Japan',     activo: true },
      { codigo: 'METABO',    nombre: 'Metabo',            pais: 'Germany',   activo: true },
      { codigo: 'SNAPON',    nombre: 'Snap-on',           pais: 'USA',       activo: true },
      // Minería / sellos hidráulicos
      { codigo: 'EPIROC',    nombre: 'Epiroc',            pais: 'Sweden',    activo: true },
      { codigo: 'SEAL_SRC',  nombre: 'Seal Source',       pais: 'USA',       activo: true },
      { codigo: 'PARKER',    nombre: 'Parker Hannifin',   pais: 'USA',       activo: true },
      { codigo: 'IKO',       nombre: 'IKO',               pais: 'Japan',     activo: true },
    ], { updateOnDuplicate: ['nombre', 'pais', 'activo'] });
    console.log('✓ 26 fabricantes\n');

    // ── CATEGORÍAS DE MATERIAL ───────────────────────────────────
    console.log('Sembrando Categorías de Material...');
    await Categoria.bulkCreate([
      { codigo: 'CON', nombre: 'Consumible', activo: true },
      { codigo: 'CRI', nombre: 'Crítico',    activo: true },
      { codigo: 'REP', nombre: 'Repuesto',   activo: true },
      { codigo: 'CAP', nombre: 'Capital',    activo: true },
      { codigo: 'OBS', nombre: 'Obsoleto',   activo: true },
      { codigo: 'FAB', nombre: 'Fabricado',  activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 6 categorías\n');

    // ── CLASIFICACIONES ──────────────────────────────────────────
    console.log('Sembrando Clasificaciones...');
    await Clasificacion.bulkCreate([
      { codigo: 'KITS', nombre: 'Kit de sellos',       activo: true },
      { codigo: 'ROTU', nombre: 'Rótulas',             activo: true },
      { codigo: 'LIMP', nombre: 'Limpiadores',         activo: true },
      { codigo: 'COJI', nombre: 'Cojinete',            activo: true },
      { codigo: 'SELL', nombre: 'Sellos',              activo: true },
      { codigo: 'BARR', nombre: 'Barras',              activo: true },
      { codigo: 'TUBO', nombre: 'Tubos',               activo: true },
      { codigo: 'PERN', nombre: 'Pernos',              activo: true },
      { codigo: 'ARAN', nombre: 'Arandelas',           activo: true },
      { codigo: 'TUER', nombre: 'Tuercas',             activo: true },
      { codigo: 'DISC', nombre: 'Discos',              activo: true },
      { codigo: 'SENS', nombre: 'Sensores',            activo: true },
      { codigo: 'GUIA', nombre: 'Guía',                activo: true },
      { codigo: 'TAPO', nombre: 'Tapón',               activo: true },
      { codigo: 'INSE', nombre: 'Insertos',            activo: true },
      { codigo: 'SUMI', nombre: 'Suministros',         activo: true },
      { codigo: 'TAPA', nombre: 'Tapa',                activo: true },
      { codigo: 'EPPS', nombre: 'Equipo de Seguridad', activo: true },
      { codigo: 'UNIF', nombre: 'Uniformes',           activo: true },
      { codigo: 'SEGU', nombre: 'Seguros',             activo: true },
      { codigo: 'ACER', nombre: 'Acero',               activo: true },
      { codigo: 'BLAD', nombre: 'Bladder',             activo: true },
      { codigo: 'ACEI', nombre: 'Aceite',              activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 23 clasificaciones\n');

    // ================================================================
    // CATÁLOGOS DE EQUIPOS
    // ================================================================

    console.log('Sembrando Status de Equipos...');
    await StatusEquipo.bulkCreate([
      { codigo: 'OPERATIVO', nombre: 'Operativo',          activo: true },
      { codigo: 'INOPERAT',  nombre: 'Inoperativo',        activo: true },
      { codigo: 'MANT',      nombre: 'En Mantenimiento',   activo: true },
      { codigo: 'STAND_BY',  nombre: 'Stand By',           activo: true },
      { codigo: 'BAJA',      nombre: 'Baja',               activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 5 status de equipos\n');

    console.log('Sembrando Tipos de Equipos...');
    await TipoEquipo.bulkCreate([
      // Equipos de taller / producción
      { codigo: 'BPR',     nombre: 'Banco de Pruebas',      activo: true },
      { codigo: 'BRU',     nombre: 'Bruñidora',             activo: true },
      { codigo: 'TOR',     nombre: 'Torno',                 activo: true },
      { codigo: 'FRE',     nombre: 'Fresadora',             activo: true },
      { codigo: 'MANDRIN', nombre: 'Mandrinadora',          activo: true },
      { codigo: 'BAR',     nombre: 'Barrenador',            activo: true },
      { codigo: 'TAL',     nombre: 'Taladro',               activo: true },
      { codigo: 'SIE',     nombre: 'Sierra Cinta',          activo: true },
      { codigo: 'SOL',     nombre: 'Soldadora',             activo: true },
      { codigo: 'OXI',     nombre: 'Oxicorte',              activo: true },
      // Infraestructura y utilidades
      { codigo: 'COM',     nombre: 'Compresor',             activo: true },
      { codigo: 'PRE_HID', nombre: 'Prensa Hidráulica',     activo: true },
      { codigo: 'TRQ',     nombre: 'Torqueador',            activo: true },
      // Transporte y manejo de materiales
      { codigo: 'MTC',     nombre: 'Montacargas',           activo: true },
      { codigo: 'CAM',     nombre: 'Camión',                activo: true },
      { codigo: 'CMT',     nombre: 'Camioneta',             activo: true },
      // Herramientas eléctricas / neumáticas
      { codigo: 'HPW',     nombre: 'Herramienta Eléctrica', activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 17 tipos de equipos\n');

    console.log('Sembrando Criticidad...');
    await Criticidad.bulkCreate([
      { codigo: 'ALTA',  nombre: 'Alta',  nivel: 1, activo: true },
      { codigo: 'MEDIA', nombre: 'Media', nivel: 2, activo: true },
      { codigo: 'BAJA',  nombre: 'Baja',  nivel: 3, activo: true },
    ], { updateOnDuplicate: ['nombre', 'nivel', 'activo'] });
    console.log('✓ 3 criticidades\n');

    // ================================================================
    // CATÁLOGOS DE ESTRATEGIAS
    // ================================================================

    console.log('Sembrando Status de Estrategias...');
    await StatusEstrategia.bulkCreate([
      { codigo: 'AC', nombre: 'Activo',     activo: true },
      { codigo: 'PR', nombre: 'En Proceso', activo: true },
      { codigo: 'EL', nombre: 'Eliminado',  activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 3 status de estrategias\n');

    console.log('Sembrando Tipos de Estrategias...');
    await TipoEstrategia.bulkCreate([
      { codigo: 'CC', nombre: 'Cambio de Componente',     activo: true },
      { codigo: 'MP', nombre: 'Mantenimiento Preventivo', activo: true },
      { codigo: 'RP', nombre: 'Reparación',               activo: true },
      { codigo: 'SG', nombre: 'Seguridad',                activo: true },
      { codigo: 'IN', nombre: 'Inspección',               activo: true },
      { codigo: 'AU', nombre: 'Auditoría',                activo: true },
      { codigo: 'ME', nombre: 'Mejora',                   activo: true },
      { codigo: 'CR', nombre: 'Control Crítico',          activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 8 tipos de estrategias\n');

    // ================================================================
    // CATÁLOGOS DE TAREAS
    // ================================================================

    console.log('Sembrando Tipos de Tareas...');
    await TipoTarea.bulkCreate([
      { codigo: 'MAC', nombre: 'Material Catalogado', activo: true },
      { codigo: 'CAD', nombre: 'Cargo Directo',       activo: true },
      { codigo: 'SER', nombre: 'Servicio',            activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 3 tipos de tareas\n');

    // ================================================================
    // CATÁLOGOS DE CÓDIGOS DE REPARACIÓN
    // ================================================================

    console.log('Sembrando Tipos de Códigos de Reparación...');
    await TipoCodRep.bulkCreate([
      { codigo: 'CIL', nombre: 'Cilindro',   activo: true },
      { codigo: 'RUE', nombre: 'Rueda',      activo: true },
      { codigo: 'ENR', nombre: 'Enrollador', activo: true },
      { codigo: 'FRE', nombre: 'Frenos',     activo: true },
      { codigo: 'LIN', nombre: 'Links',      activo: true },
      { codigo: 'ACU', nombre: 'Acumulador', activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 6 tipos de códigos de reparación\n');

    console.log('Sembrando Categorías de Códigos de Reparación...');
    await CategoriaCodRep.bulkCreate([
      { codigo: 'CAM', nombre: 'Camión',             activo: true },
      { codigo: 'MOT', nombre: 'Motoniveladora',     activo: true },
      { codigo: 'TRU', nombre: 'Tractor de Ruedas', activo: true },
      { codigo: 'TOR', nombre: 'Tractor de Orugas', activo: true },
      { codigo: 'EXC', nombre: 'Excavadora',         activo: true },
      { codigo: 'PAL', nombre: 'Pala',               activo: true },
      { codigo: 'PER', nombre: 'Perforadora',        activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 7 categorías de códigos de reparación\n');

    console.log('Sembrando Flotas de Equipos...');
    await FlotaEquipo.bulkCreate([
      // Motoniveladoras CAT
      { codigo: '16M',      nombre: 'Motoniveladora CAT 16M',          activo: true },
      { codigo: '24',       nombre: 'Motoniveladora CAT 24',           activo: true },
      { codigo: '24M',      nombre: 'Motoniveladora CAT 24M',          activo: true },
      // Excavadoras CAT
      { codigo: '336DL',    nombre: 'Excavadora CAT 336DL',            activo: true },
      { codigo: '374DL',    nombre: 'Excavadora CAT 374DL',            activo: true },
      { codigo: '374FL',    nombre: 'Excavadora CAT 374FL',            activo: true },
      { codigo: '390DL',    nombre: 'Excavadora CAT 390DL',            activo: true },
      { codigo: '390FL',    nombre: 'Excavadora CAT 390FL',            activo: true },
      { codigo: '420E',     nombre: 'Excavadora CAT 420E',             activo: true },
      // Pala eléctrica
      { codigo: '6060FS',   nombre: 'Pala Eléctrica CAT 6060FS',       activo: true },
      // Camiones CAT
      { codigo: '793',      nombre: 'Camión CAT 793',                  activo: true },
      { codigo: '793D',     nombre: 'Camión CAT 793D',                 activo: true },
      { codigo: '797',      nombre: 'Camión CAT 797',                  activo: true },
      { codigo: '797F',     nombre: 'Camión CAT 797F',                 activo: true },
      // Tractores CAT
      { codigo: '830DC',    nombre: 'Tractor CAT 830DC',               activo: true },
      { codigo: '830E',     nombre: 'Tractor CAT 830E',                activo: true },
      { codigo: '834H',     nombre: 'Tractor CAT 834H',                activo: true },
      { codigo: '834K',     nombre: 'Tractor CAT 834K',                activo: true },
      { codigo: '844H',     nombre: 'Tractor CAT 844H',                activo: true },
      { codigo: '844K',     nombre: 'Tractor CAT 844K',                activo: true },
      { codigo: 'D8T',      nombre: 'Bulldozer CAT D8T',               activo: true },
      { codigo: 'D9R',      nombre: 'Bulldozer CAT D9R',               activo: true },
      { codigo: 'D11',      nombre: 'Bulldozer CAT D11',               activo: true },
      { codigo: 'D11T',     nombre: 'Bulldozer CAT D11T',              activo: true },
      // Cargadores CAT
      { codigo: '924G',     nombre: 'Cargador CAT 924G',               activo: true },
      { codigo: '928H',     nombre: 'Cargador CAT 928H',               activo: true },
      { codigo: '950H',     nombre: 'Cargador CAT 950H',               activo: true },
      { codigo: '966H',     nombre: 'Cargador CAT 966H',               activo: true },
      { codigo: '966M',     nombre: 'Cargador CAT 966M',               activo: true },
      { codigo: '980H',     nombre: 'Cargador CAT 980H',               activo: true },
      { codigo: '988K',     nombre: 'Cargador CAT 988K',               activo: true },
      { codigo: '992K',     nombre: 'Cargador CAT 992K',               activo: true },
      { codigo: '994F',     nombre: 'Cargador CAT 994F',               activo: true },
      { codigo: '994K',     nombre: 'Cargador CAT 994K',               activo: true },
      // Camiones KOM
      { codigo: '930E',     nombre: 'Camión KOM 930E',                 activo: true },
      { codigo: '930E-4SE', nombre: 'Camión KOM 930E-4SE',             activo: true },
      { codigo: '980',      nombre: 'Camión KOM 980',                  activo: true },
      { codigo: '980E-4SE', nombre: 'Camión KOM 980E-4SE',             activo: true },
      { codigo: 'HD1500',   nombre: 'Camión KOM HD1500',               activo: true },
      { codigo: 'D475',     nombre: 'Bulldozer KOM D475',              activo: true },
      { codigo: 'PC1250',   nombre: 'Excavadora KOM PC1250',           activo: true },
      { codigo: 'PC2000',   nombre: 'Excavadora KOM PC2000',           activo: true },
      { codigo: 'WA900',    nombre: 'Cargador KOM WA900',              activo: true },
      // Perforadoras
      { codigo: 'MD6540',   nombre: 'Perforadora CAT MD6540',          activo: true },
      { codigo: 'MD6640',   nombre: 'Perforadora CAT MD6640',          activo: true },
      { codigo: 'PTV351',   nombre: 'Perforadora Epiroc Pit Viper 351', activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 46 flotas de equipos\n');

    console.log('Sembrando Posiciones...');
    await Posicion.bulkCreate([
      { codigo: 'LH',  nombre: 'Izquierda', activo: true },
      { codigo: 'RH',  nombre: 'Derecha',   activo: true },
      { codigo: 'NA',  nombre: 'No Aplica', activo: true },
      { codigo: 'DEL', nombre: 'Delantero', activo: true },
      { codigo: 'POS', nombre: 'Posterior', activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 5 posiciones\n');

    // ================================================================
    // CATÁLOGOS DE ÓRDENES DE TRABAJO
    // ================================================================

    console.log('Sembrando Clientes...');
    await Cliente.bulkCreate([
      { codigo: 'SPCC-CUA', razon_social: 'Minera Southern Peru Cuajone',   nombre_comercial: 'SPCC Cuajone',   activo: true },
      { codigo: 'SPCC-TOQ', razon_social: 'Minera Southern Peru Toquepala', nombre_comercial: 'SPCC Toquepala', activo: true },
      { codigo: 'SPCC-ILO', razon_social: 'Refinería Southern Peru Ilo',    nombre_comercial: 'SPCC Ilo',       activo: true },
      { codigo: 'CVERDE',   razon_social: 'Minera Cerro Verde',             nombre_comercial: 'Cerro Verde',    activo: true },
      { codigo: 'ANTAP',    razon_social: 'Minera Antapaccay',              nombre_comercial: 'Antapaccay',     activo: true },
      { codigo: 'LBAMBAS',  razon_social: 'Minera Las Bambas',              nombre_comercial: 'Las Bambas',     activo: true },
      { codigo: 'CHINALCO', razon_social: 'Minera Chinalco',               nombre_comercial: 'Chinalco',       activo: true },
      { codigo: 'QUELLAVE', razon_social: 'Minera Quellaveco',              nombre_comercial: 'Quellaveco',     activo: true },
      { codigo: 'UNIMAQ',   razon_social: 'Empresa Unimaq',                nombre_comercial: 'Unimaq',         activo: true },
      { codigo: 'TRITON',   razon_social: 'Empresa Triton',                nombre_comercial: 'Triton',         activo: true },
      { codigo: 'PERURAIL', razon_social: 'Empresa Peru Rail',             nombre_comercial: 'Peru Rail',      activo: true },
      { codigo: 'HUDBAY',   razon_social: 'Minera Hudbay',                 nombre_comercial: 'Hudbay',         activo: true },
      { codigo: 'COSAPI',   razon_social: 'Empresa Cosapi',                nombre_comercial: 'Cosapi',         activo: true },
      { codigo: 'INKABOR',  razon_social: 'Empresa Inkabor',               nombre_comercial: 'Inkabor',        activo: true },
      { codigo: 'OWMPERU',  razon_social: 'Empresa OWM Peru',              nombre_comercial: 'OWM Peru',       activo: true },
      { codigo: 'ICC',      razon_social: 'Empresa ICC',                   nombre_comercial: 'ICC',            activo: true },
    ], { updateOnDuplicate: ['razon_social', 'nombre_comercial', 'activo'] });
    console.log('✓ 16 clientes\n');

    // Limpiar catálogos OT antes de reinsertar para eliminar entradas obsoletas
    // Paso 1: nullificar en orden_trabajo cualquier codigo que ya no existirá
    console.log('Limpiando referencias obsoletas en orden_trabajo...');
    await sequelize.query(`UPDATE orden_trabajo SET garantia_codigo = NULL WHERE garantia_codigo IS NOT NULL AND garantia_codigo NOT IN ('Si','No')`);
    await sequelize.query(`UPDATE orden_trabajo SET atencion_reparacion_codigo = NULL WHERE atencion_reparacion_codigo IS NOT NULL AND atencion_reparacion_codigo NOT IN ('Contrato','Presupuesto','Emergencia')`);
    await sequelize.query(`UPDATE orden_trabajo SET tipo_reparacion_codigo = NULL WHERE tipo_reparacion_codigo IS NOT NULL AND tipo_reparacion_codigo NOT IN ('General','Parcial','Eval & Lim','Vestido')`);
    await sequelize.query(`UPDATE orden_trabajo SET tipo_garantia_codigo = NULL WHERE tipo_garantia_codigo IS NOT NULL AND tipo_garantia_codigo NOT IN ('Cliente','Por definir','HPK','Comercial')`);
    await sequelize.query(`UPDATE orden_trabajo SET prioridad_atencion_codigo = NULL WHERE prioridad_atencion_codigo IS NOT NULL AND prioridad_atencion_codigo NOT IN ('1','2','3','E')`);
    await sequelize.query(`UPDATE orden_trabajo SET base_metalica_codigo = NULL WHERE base_metalica_codigo IS NOT NULL AND base_metalica_codigo NOT IN ('Si','No')`);
    await sequelize.query(`UPDATE orden_trabajo SET ot_status_codigo = NULL WHERE ot_status_codigo IS NOT NULL AND ot_status_codigo NOT IN ('Abierta','Cerrada','No Ejecutada')`);
    await sequelize.query(`UPDATE orden_trabajo SET recursos_status_codigo = NULL WHERE recursos_status_codigo IS NOT NULL AND recursos_status_codigo NOT IN ('En revision procesos','Recursos solicitados','En cotización','En aprobación','En espera de recursos','Recursos completos')`);
    await sequelize.query(`UPDATE orden_trabajo SET taller_status_codigo = NULL WHERE taller_status_codigo IS NOT NULL AND taller_status_codigo NOT IN ('Pdt Evaluación','Programado Evaluación','Pdt proceso','Programado Proceso','Terminado','Entregado','Cobranza')`);

    // Paso 2: borrar entradas viejas de los catálogos
    console.log('Eliminando entradas obsoletas de catálogos OT...');
    await sequelize.query(`DELETE FROM garantia WHERE codigo NOT IN ('Si','No')`);
    await sequelize.query(`DELETE FROM atencion_reparacion WHERE codigo NOT IN ('Contrato','Presupuesto','Emergencia')`);
    await sequelize.query(`DELETE FROM tipo_reparacion WHERE codigo NOT IN ('General','Parcial','Eval & Lim','Vestido')`);
    await sequelize.query(`DELETE FROM tipo_garantia WHERE codigo NOT IN ('Cliente','Por definir','HPK','Comercial')`);
    await sequelize.query(`DELETE FROM prioridad_atencion WHERE codigo NOT IN ('1','2','3','E')`);
    await sequelize.query(`DELETE FROM base_metalica WHERE codigo NOT IN ('Si','No')`);
    await sequelize.query(`DELETE FROM ot_status WHERE codigo NOT IN ('Abierta','Cerrada','No Ejecutada')`);
    await sequelize.query(`DELETE FROM recursos_status WHERE codigo NOT IN ('En revision procesos','Recursos solicitados','En cotización','En aprobación','En espera de recursos','Recursos completos')`);
    await sequelize.query(`DELETE FROM taller_status WHERE codigo NOT IN ('Pdt Evaluación','Programado Evaluación','Pdt proceso','Programado Proceso','Terminado','Entregado','Cobranza')`);
    console.log('✓ Catálogos OT limpiados\n');

    console.log('Sembrando Garantías...');
    await Garantia.bulkCreate([
      { codigo: 'Si', nombre: 'Si', activo: true },
      { codigo: 'No', nombre: 'No', activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 2 garantías\n');

    console.log('Sembrando Atención Reparación...');
    await AtencionReparacion.bulkCreate([
      { codigo: 'Contrato',    nombre: 'Contrato',    activo: true },
      { codigo: 'Presupuesto', nombre: 'Presupuesto', activo: true },
      { codigo: 'Emergencia',  nombre: 'Emergencia',  activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 3 atenciones de reparación\n');

    console.log('Sembrando Tipos de Reparación...');
    await TipoReparacion.bulkCreate([
      { codigo: 'General',    nombre: 'General',    activo: true },
      { codigo: 'Parcial',    nombre: 'Parcial',    activo: true },
      { codigo: 'Eval & Lim', nombre: 'Eval & Lim', activo: true },
      { codigo: 'Vestido',    nombre: 'Vestido',    activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 4 tipos de reparación\n');

    console.log('Sembrando Tipos de Garantía...');
    await TipoGarantia.bulkCreate([
      { codigo: 'Cliente',     nombre: 'Cliente',     activo: true },
      { codigo: 'Por definir', nombre: 'Por definir', activo: true },
      { codigo: 'HPK',         nombre: 'HPK',         activo: true },
      { codigo: 'Comercial',   nombre: 'Comercial',   activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 4 tipos de garantía\n');

    console.log('Sembrando Prioridad de Atención...');
    await PrioridadAtencion.bulkCreate([
      { codigo: '1', nombre: 'Alta',       nivel: 1, activo: true },
      { codigo: '2', nombre: 'Media',      nivel: 2, activo: true },
      { codigo: '3', nombre: 'Baja',       nivel: 3, activo: true },
      { codigo: 'E', nombre: 'Emergencia', nivel: 0, activo: true },
    ], { updateOnDuplicate: ['nombre', 'nivel', 'activo'] });
    console.log('✓ 4 prioridades de atención\n');

    console.log('Sembrando Base Metálica...');
    await BaseMetalica.bulkCreate([
      { codigo: 'Si', nombre: 'Si', activo: true },
      { codigo: 'No', nombre: 'No', activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 2 opciones de base metálica\n');

    console.log('Sembrando Status de OT...');
    await OtStatus.bulkCreate([
      { codigo: 'Abierta',      nombre: 'Abierta',      activo: true },
      { codigo: 'Cerrada',      nombre: 'Cerrada',      activo: true },
      { codigo: 'No Ejecutada', nombre: 'No Ejecutada', activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 3 status de OT\n');

    console.log('Sembrando Status de Recursos...');
    await RecursosStatus.bulkCreate([
      { codigo: 'En revision procesos',  nombre: 'En revision procesos',  activo: true },
      { codigo: 'Recursos solicitados',  nombre: 'Recursos solicitados',  activo: true },
      { codigo: 'En cotización',         nombre: 'En cotización',         activo: true },
      { codigo: 'En aprobación',         nombre: 'En aprobación',         activo: true },
      { codigo: 'En espera de recursos', nombre: 'En espera de recursos', activo: true },
      { codigo: 'Recursos completos',    nombre: 'Recursos completos',    activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 6 status de recursos\n');

    console.log('Sembrando Status de Taller...');
    await TallerStatus.bulkCreate([
      { codigo: 'Pdt Evaluación',        nombre: 'Pdt Evaluación',        activo: true },
      { codigo: 'Programado Evaluación', nombre: 'Programado Evaluación', activo: true },
      { codigo: 'Pdt proceso',           nombre: 'Pdt proceso',           activo: true },
      { codigo: 'Programado Proceso',    nombre: 'Programado Proceso',    activo: true },
      { codigo: 'Terminado',             nombre: 'Terminado',             activo: true },
      { codigo: 'Entregado',             nombre: 'Entregado',             activo: true },
      { codigo: 'Cobranza',              nombre: 'Cobranza',              activo: true },
    ], { updateOnDuplicate: ['nombre', 'activo'] });
    console.log('✓ 7 status de taller\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✓ SEEDS COMPLETADOS EXITOSAMENTE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('RESUMEN:');
    console.log('  2 Monedas | 19 Unidades de Medida | 1 Planta');
    console.log('  5 Áreas | 12 Sub-Áreas | 26 Fabricantes');
    console.log('  6 Categorías | 23 Clasificaciones');
    console.log('  5 Status Equipo | 17 Tipos Equipo | 3 Criticidades');
    console.log('  3 Status Estrategia | 8 Tipos Estrategia | 3 Tipos Tarea');
    console.log('  6 Tipos Cod Rep | 7 Categorías Cod Rep | 46 Flotas | 5 Posiciones');
    console.log('  16 Clientes | 2 Garantías | 3 Atención Rep');
    console.log('  4 Tipos Rep | 4 Tipos Garantía | 4 Prioridades | 2 Base Metálica');
    console.log('  3 OT Status | 6 Recursos Status | 7 Taller Status');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('Error al ejecutar seeds:', error);
    throw error;
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => sequelize.close())
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error fatal:', error);
      process.exit(1);
    });
}

export default seedDatabase;
