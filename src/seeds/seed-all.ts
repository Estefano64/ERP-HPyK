import sequelize from '../config/database';
import seedDatabase from './catalogs.seed';
import seedProveedoresAlmacenes from './seed-proveedores-almacenes';
import Material from '../models/Material';
import Equipo from '../models/Equipo';
import Herramienta from '../models/Herramienta';
import CodigoReparacion from '../models/CodigoReparacion';
import Estrategia from '../models/Estrategia';
import Tarea from '../models/Tarea';
import OrdenTrabajo from '../models/OrdenTrabajo';

async function seedAll() {
  try {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('       INICIANDO POBLACIÓN COMPLETA DE LA BASE DE DATOS        ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Sincronizar modelos (crear tablas si no existen)
    console.log('🔄 Sincronizando modelos con la base de datos...');
    await sequelize.sync({ force: false });
    console.log('✓ Tablas sincronizadas\n');

    // 1. Poblar catálogos primero
    console.log('📦 PASO 1: Poblando catálogos maestros...\n');
    await seedDatabase();

    // 1.5. Poblar proveedores y almacenes
    console.log('📦 PASO 1.5: Poblando proveedores y almacenes...\n');
    await seedProveedoresAlmacenes();

    // 2. Poblar materiales — Repuestos reales para cilindros hidráulicos HP&K
    console.log('\n📦 PASO 2: Creando materiales de ejemplo...');
    const materiales = await Material.bulkCreate([
      {
        codigo: 'MAT-001',
        np: 'NP-KS-CAT-001',
        descripcion: 'Kit de sellos CAT 793',
        descripcion_compuesta: 'Kit de sellos hidráulicos para cilindro dirección CAT 793',
        planta_codigo: 'AQPTA01',
        area_codigo: 'LG',
        categoria_codigo: 'CRI',
        clasificacion_codigo: 'KITS',
        unidad_medida_codigo: 'und',
        punto_reposicion: 2,
        stock_maximo: 10,
        stock_actual: 4,
        precio: 380.00,
        moneda_codigo: 'USD',
        fabricante_codigo: 'CAT',
        ubicacion: 'A-01-01',
        activo: true
      },
      {
        codigo: 'MAT-002',
        np: 'NP-KS-KOM-001',
        descripcion: 'Kit de sellos Komatsu 930E',
        descripcion_compuesta: 'Kit de sellos para cilindro de suspensión Komatsu 930E',
        planta_codigo: 'AQPTA01',
        area_codigo: 'LG',
        categoria_codigo: 'CRI',
        clasificacion_codigo: 'KITS',
        unidad_medida_codigo: 'und',
        punto_reposicion: 3,
        stock_maximo: 12,
        stock_actual: 6,
        precio: 450.00,
        moneda_codigo: 'USD',
        fabricante_codigo: 'KOMATSU',
        ubicacion: 'A-01-02',
        activo: true
      },
      {
        codigo: 'MAT-003',
        np: 'NP-ACEI-HID-001',
        descripcion: 'Aceite hidráulico ISO VG 46',
        descripcion_compuesta: 'Aceite hidráulico para pruebas en banco HP&K',
        planta_codigo: 'AQPTA01',
        area_codigo: 'LG',
        categoria_codigo: 'CON',
        clasificacion_codigo: 'ACEI',
        unidad_medida_codigo: 'lt',
        punto_reposicion: 100,
        stock_maximo: 500,
        stock_actual: 250,
        precio: 5.80,
        moneda_codigo: 'USD',
        fabricante_codigo: 'ALT',
        ubicacion: 'C-01-01',
        activo: true
      },
      {
        codigo: 'MAT-004',
        np: 'NP-VAS-CR-001',
        descripcion: 'Vástago cromado D=120mm L=2000mm',
        descripcion_compuesta: 'Vástago cromado duro para cilindro hidráulico minero',
        planta_codigo: 'AQPTA01',
        area_codigo: 'LG',
        categoria_codigo: 'REP',
        clasificacion_codigo: 'BARR',
        unidad_medida_codigo: 'und',
        punto_reposicion: 1,
        stock_maximo: 4,
        stock_actual: 2,
        precio: 1200.00,
        moneda_codigo: 'USD',
        fabricante_codigo: 'ALT',
        ubicacion: 'B-01-01',
        activo: true
      },
      {
        codigo: 'MAT-005',
        np: 'NP-ROTU-CAT-001',
        descripcion: 'Rótula esférica CAT 793/797',
        descripcion_compuesta: 'Rótula esférica para articulación de cilindro CAT serie 700',
        planta_codigo: 'AQPTA01',
        area_codigo: 'LG',
        categoria_codigo: 'CRI',
        clasificacion_codigo: 'ROTU',
        unidad_medida_codigo: 'und',
        punto_reposicion: 2,
        stock_maximo: 8,
        stock_actual: 3,
        precio: 680.00,
        moneda_codigo: 'USD',
        fabricante_codigo: 'CAT',
        ubicacion: 'A-02-05',
        activo: true
      }
    ], { ignoreDuplicates: true });
    console.log(`✓ ${materiales.length} materiales creados\n`);

    // 3. Poblar equipos — PARQUE DE EQUIPO real HP&K (34 activos)
    console.log('🔧 PASO 3: Creando equipos reales HP&K (PARQUE DE EQUIPO)...');
    const equipos = await Equipo.bulkCreate([
      // --- EQUIPOS DE EVALUACIÓN ---
      { codigo: 'HPK-BPR-01', descripcion: 'Banco de Pruebas 1', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'BPR', fecha_inicio: new Date('2019-01-01'), fabricante_codigo: 'COLUMBIA', modelo: 'Columbia Chrome', planta_codigo: 'AQPTA01', criticidad_codigo: 'ALTA', observaciones: 'Banco de pruebas hidráulicas principal' },
      { codigo: 'HPK-BPR-02', descripcion: 'Banco de Pruebas 2', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'BPR', fecha_inicio: new Date('2016-01-01'), planta_codigo: 'AQPTA01', criticidad_codigo: 'ALTA' },
      // --- EQUIPOS DE BRUÑIDO ---
      { codigo: 'HPK-BRU-01', descripcion: 'Bruñidora', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'BRU', fecha_inicio: new Date('2017-01-01'), planta_codigo: 'AQPTA01', criticidad_codigo: 'ALTA' },
      // --- EQUIPOS DE MAQUINADO ---
      { codigo: 'HPK-TOR-01', descripcion: 'Torno SP6-3000', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'TOR', fecha_inicio: new Date('2024-01-01'), fabricante_codigo: 'SARO', modelo: 'SP6-3000', planta_codigo: 'AQPTA01', criticidad_codigo: 'ALTA' },
      { codigo: 'HPK-TOR-02', descripcion: 'Torno Niles', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'TOR', fecha_inicio: new Date('2019-01-01'), fabricante_codigo: 'NILES', modelo: 'Niles', planta_codigo: 'AQPTA01', criticidad_codigo: 'ALTA' },
      { codigo: 'HPK-TOR-03', descripcion: 'Torno KNUTH 4', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'TOR', fecha_inicio: new Date('2021-01-01'), modelo: 'Sinus 330/3000', planta_codigo: 'AQPTA01', criticidad_codigo: 'ALTA' },
      { codigo: 'HPK-TOR-04', descripcion: 'Torno TK1000', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'TOR', fecha_inicio: new Date('2023-01-01'), modelo: 'TKM1000', planta_codigo: 'AQPTA01', criticidad_codigo: 'ALTA' },
      { codigo: 'HPK-FRE-01', descripcion: 'Fresadora Zayer', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'FRE', fecha_inicio: new Date('2018-01-01'), fabricante_codigo: 'ZAYER', modelo: 'Zayer', planta_codigo: 'AQPTA01', criticidad_codigo: 'MEDIA' },
      { codigo: 'HPK-MAN-01', descripcion: 'Mandrinadora BFT90/3-1', status_codigo: 'MANT', area_codigo: 'PR', tipo_codigo: 'MANDRIN', fecha_inicio: new Date('2023-01-01'), fabricante_codigo: 'UNION', modelo: 'BFT90/3-1', planta_codigo: 'AQPTA01', criticidad_codigo: 'ALTA', observaciones: 'Panel digital no se visualiza - correctivo pendiente' },
      { codigo: 'HPK-BAR-01', descripcion: 'Barrenador Portátil', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'BAR', fecha_inicio: new Date('2019-01-01'), planta_codigo: 'AQPTA01', criticidad_codigo: 'MEDIA' },
      { codigo: 'HPK-BAR-02', descripcion: 'Barrenador y Soldador WS2-PLUS', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'BAR', fecha_inicio: new Date('2025-01-01'), fabricante_codigo: 'SIR_MEC', modelo: 'WS2-PLUS', planta_codigo: 'AQPTA01', criticidad_codigo: 'ALTA' },
      { codigo: 'HPK-TAL-01', descripcion: 'Taladro de Banco', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'TAL', fecha_inicio: new Date('2018-01-01'), modelo: 'KM38', planta_codigo: 'AQPTA01', criticidad_codigo: 'BAJA' },
      { codigo: 'HPK-SIE-01', descripcion: 'Sierra Cinta', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'SIE', fecha_inicio: new Date('2024-01-01'), modelo: 'BS-1018B', planta_codigo: 'AQPTA01', criticidad_codigo: 'BAJA' },
      // --- EQUIPOS DE SOLDADURA ---
      { codigo: 'HPK-SOL-01', descripcion: 'Máquina de Soldar Miller 652', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'SOL', fecha_inicio: new Date('2019-01-01'), fabricante_codigo: 'MILLER', modelo: '652CC/CV', planta_codigo: 'AQPTA01', criticidad_codigo: 'MEDIA' },
      { codigo: 'HPK-SOL-02', descripcion: 'Máquina de Soldar Miller XMT 350', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'SOL', fecha_inicio: new Date('2019-01-01'), fabricante_codigo: 'MILLER', modelo: 'XMT 350', planta_codigo: 'AQPTA01', criticidad_codigo: 'MEDIA' },
      { codigo: 'HPK-SOL-03', descripcion: 'Máquina de Soldar MIG Eurofil', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'SOL', fecha_inicio: new Date('2019-01-01'), modelo: 'EUROFIL 300', planta_codigo: 'AQPTA01', criticidad_codigo: 'BAJA' },
      { codigo: 'HPK-SOL-04', descripcion: 'Máquina de Soldar Lincoln XL', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'SOL', fecha_inicio: new Date('2024-01-01'), fabricante_codigo: 'LINCOLN', modelo: 'Flextec 350x', planta_codigo: 'AQPTA01', criticidad_codigo: 'MEDIA' },
      { codigo: 'HPK-SOL-05', descripcion: 'Máquina de Soldar Lincoln XP', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'SOL', fecha_inicio: new Date('2025-01-01'), fabricante_codigo: 'LINCOLN', modelo: 'Flextec 350x', planta_codigo: 'AQPTA01', criticidad_codigo: 'MEDIA' },
      { codigo: 'HPK-OXI-01', descripcion: 'Equipos de Oxicorte', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'OXI', planta_codigo: 'AQPTA01', criticidad_codigo: 'BAJA' },
      // --- EQUIPOS DE INFRAESTRUCTURA/UTILIDADES ---
      { codigo: 'HPK-COM-01', descripcion: 'Compresor de Aire 1 Wilson', status_codigo: 'OPERATIVO', area_codigo: 'MT', tipo_codigo: 'COM', fecha_inicio: new Date('2025-01-01'), fabricante_codigo: 'WILSON', modelo: 'W-10380', planta_codigo: 'AQPTA01', criticidad_codigo: 'ALTA' },
      { codigo: 'HPK-PRE-01', descripcion: 'Prensa Hidráulica 120TN', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'PRE_HID', fecha_inicio: new Date('2023-01-01'), planta_codigo: 'AQPTA01', criticidad_codigo: 'ALTA' },
      { codigo: 'HPK-TRQ-01', descripcion: 'Torqueador Hidráulico', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'TRQ', fecha_inicio: new Date('2022-01-01'), planta_codigo: 'AQPTA01', criticidad_codigo: 'MEDIA' },
      // --- MONTACARGAS ---
      { codigo: 'HPK-MTC-01', descripcion: 'Montacargas HANGCHA CPQYD38', status_codigo: 'OPERATIVO', area_codigo: 'LG', tipo_codigo: 'MTC', fecha_inicio: new Date('2023-01-01'), fabricante_codigo: 'HANGCHA', modelo: 'CPQYD38', planta_codigo: 'AQPTA01', criticidad_codigo: 'ALTA' },
      { codigo: 'HPK-MTC-02', descripcion: 'Montacargas CAT GP30NM-GLP', status_codigo: 'OPERATIVO', area_codigo: 'LG', tipo_codigo: 'MTC', fecha_inicio: new Date('2020-01-01'), fabricante_codigo: 'CAT', modelo: 'GP30NM-GLP', planta_codigo: 'AQPTA01', criticidad_codigo: 'ALTA' },
      { codigo: 'HPK-MTC-03', descripcion: 'Montacargas HYUNDAI 30LE-7', status_codigo: 'OPERATIVO', area_codigo: 'LG', tipo_codigo: 'MTC', fecha_inicio: new Date('2025-01-01'), fabricante_codigo: 'HYUNDAI', modelo: '30LE-7', planta_codigo: 'AQPTA01', criticidad_codigo: 'ALTA' },
      // --- FLOTA VEHICULAR ---
      { codigo: 'HPK-CAM-01', descripcion: 'Camión JAC VCX-893', status_codigo: 'OPERATIVO', area_codigo: 'LG', tipo_codigo: 'CAM', fecha_inicio: new Date('2023-01-01'), fabricante_codigo: 'JAC', modelo: 'HFC1040KN', numero_serie: 'VCX-893', planta_codigo: 'AQPTA01', criticidad_codigo: 'MEDIA' },
      { codigo: 'HPK-CAM-02', descripcion: 'Camión JAC VAS-798', status_codigo: 'OPERATIVO', area_codigo: 'LG', tipo_codigo: 'CAM', fecha_inicio: new Date('2023-01-01'), fabricante_codigo: 'JAC', modelo: 'HFC1120KN', numero_serie: 'VAS-798', planta_codigo: 'AQPTA01', criticidad_codigo: 'MEDIA' },
      { codigo: 'HPK-CMT-01', descripcion: 'Camioneta Toyota Hilux VBX-924', status_codigo: 'OPERATIVO', area_codigo: 'LG', tipo_codigo: 'CMT', fecha_inicio: new Date('2023-01-01'), fabricante_codigo: 'TOYOTA', modelo: 'Hilux', numero_serie: 'VBX-924', planta_codigo: 'AQPTA01', criticidad_codigo: 'MEDIA' },
      { codigo: 'HPK-CMT-02', descripcion: 'Camioneta Toyota Fortuner V9M-357', status_codigo: 'OPERATIVO', area_codigo: 'LG', tipo_codigo: 'CMT', fecha_inicio: new Date('2018-01-01'), fabricante_codigo: 'TOYOTA', modelo: 'Fortuner', numero_serie: 'V9M-357', planta_codigo: 'AQPTA01', criticidad_codigo: 'MEDIA' },
      { codigo: 'HPK-CMT-03', descripcion: 'Camioneta VW Saveiro VCM-825', status_codigo: 'OPERATIVO', area_codigo: 'LG', tipo_codigo: 'CMT', fecha_inicio: new Date('2023-01-01'), fabricante_codigo: 'VW', modelo: 'Saveiro', numero_serie: 'VCM-825', planta_codigo: 'AQPTA01', criticidad_codigo: 'BAJA' },
      // --- HERRAMIENTAS ELÉCTRICAS (activos de taller) ---
      { codigo: 'HPK-ESM-01', descripcion: 'Esmeril de Banco', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'HPW', fecha_inicio: new Date('2024-01-01'), fabricante_codigo: 'MAKITA', planta_codigo: 'AQPTA01', criticidad_codigo: 'BAJA' },
      { codigo: 'HPK-ESA-01', descripcion: 'Esmeril Angular 4"', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'HPW', fecha_inicio: new Date('2021-01-01'), fabricante_codigo: 'BOSCH', planta_codigo: 'AQPTA01', criticidad_codigo: 'BAJA' },
      { codigo: 'HPK-ESA-02', descripcion: 'Esmeril Angular 7"', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'HPW', fecha_inicio: new Date('2021-01-01'), fabricante_codigo: 'BOSCH', planta_codigo: 'AQPTA01', criticidad_codigo: 'BAJA' },
      { codigo: 'HPK-TAL-02', descripcion: 'Taladro Manual Bosch', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'HPW', fecha_inicio: new Date('2021-01-01'), fabricante_codigo: 'BOSCH', planta_codigo: 'AQPTA01', criticidad_codigo: 'BAJA' },
      { codigo: 'HPK-PIS-01', descripcion: 'Pistola Neumática 3/4" Snapon', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'HPW', fecha_inicio: new Date('2022-01-01'), fabricante_codigo: 'SNAPON', planta_codigo: 'AQPTA01', criticidad_codigo: 'BAJA' },
      { codigo: 'HPK-AMO-01', descripcion: 'Amoladora Metabo 9"', status_codigo: 'OPERATIVO', area_codigo: 'PR', tipo_codigo: 'HPW', fecha_inicio: new Date('2020-01-01'), fabricante_codigo: 'METABO', planta_codigo: 'AQPTA01', criticidad_codigo: 'BAJA' },
    ], { ignoreDuplicates: true });
    console.log(`✓ ${equipos.length} equipos reales HP&K creados\n`);

    // 3.5 Poblar herramientas
    console.log('🛠️  PASO 3.5: Creando herramientas...');
    const herramientas = await Herramienta.bulkCreate([
      {
        codigo: 'TOOL-001',
        nombre: 'Taladro Percutor 1/2"',
        stock: 10,
        asignadas: 7,
        estado: 'Bajo Stock'
      },
      {
        codigo: 'TOOL-002',
        nombre: 'Llave de Impacto 3/4"',
        stock: 5,
        asignadas: 0,
        estado: 'Disponible'
      },
      {
        codigo: 'TOOL-003',
        nombre: 'Soldadora MIG 200A',
        stock: 3,
        asignadas: 3,
        estado: 'Agotado'
      },
      {
        codigo: 'TOOL-004',
        nombre: 'Multímetro Digital',
        stock: 15,
        asignadas: 5,
        estado: 'Disponible'
      },
      {
        codigo: 'TOOL-005',
        nombre: 'Esmeril Angular 7"',
        stock: 8,
        asignadas: 2,
        estado: 'Disponible'
      },
      {
        codigo: 'TOOL-006',
        nombre: 'Torquímetro 0-200 Nm',
        stock: 6,
        asignadas: 5,
        estado: 'Bajo Stock'
      },
      {
        codigo: 'TOOL-007',
        nombre: 'Prensa Hidráulica 20 Ton',
        stock: 2,
        asignadas: 0,
        estado: 'Disponible'
      },
      {
        codigo: 'TOOL-008',
        nombre: 'Calibrador Vernier Digital',
        stock: 12,
        asignadas: 8,
        estado: 'Bajo Stock'
      }
    ], { ignoreDuplicates: true });
    console.log(`✓ ${herramientas.length} herramientas creadas\n`);

    // 4. Poblar códigos de reparación — Tipos de trabajo HP&K (cilindros hidráulicos)
    console.log('🔨 PASO 4: Creando códigos de reparación...');
    const codigosRep = await CodigoReparacion.bulkCreate([
      {
        codigo: 'CIL-CAT-793-DIR',
        tipo_codigo: 'CIL',
        categoria_codigo: 'CAM',
        descripcion: 'Reparación cilindro dirección CAT 793',
        fabricante_codigo: 'CAT',
        flota_codigo: '793',
        posicion_codigo: 'DEL',
        np: 'NP-CIL-793-DIR',
        precio: 9500.00
      },
      {
        codigo: 'CIL-CAT-793-SUS',
        tipo_codigo: 'CIL',
        categoria_codigo: 'CAM',
        descripcion: 'Reparación cilindro suspensión CAT 793',
        fabricante_codigo: 'CAT',
        flota_codigo: '793',
        posicion_codigo: 'LH',
        np: 'NP-CIL-793-SUS',
        precio: 11000.00
      },
      {
        codigo: 'CIL-KOM-930-SUS',
        tipo_codigo: 'CIL',
        categoria_codigo: 'CAM',
        descripcion: 'Reparación cilindro suspensión Komatsu 930E',
        fabricante_codigo: 'KOMATSU',
        flota_codigo: '930E',
        posicion_codigo: 'LH',
        np: 'NP-CIL-930-SUS',
        precio: 13500.00
      },
      {
        codigo: 'CIL-CAT-16M-NIV',
        tipo_codigo: 'CIL',
        categoria_codigo: 'MOT',
        descripcion: 'Reparación cilindro nivelación CAT 16M',
        fabricante_codigo: 'CAT',
        flota_codigo: '16M',
        posicion_codigo: 'NA',
        np: 'NP-CIL-16M-NIV',
        precio: 5800.00
      }
    ], { ignoreDuplicates: true });
    console.log(`✓ ${codigosRep.length} códigos de reparación creados\n`);

    // 5. Poblar estrategias — Planes de mantenimiento de equipos HP&K
    console.log('📋 PASO 5: Creando estrategias...');
    const estrategias = await Estrategia.bulkCreate([
      {
        codigo: 'EST-BPR-001',
        area_codigo: 'PR',
        equipo_codigo: 'HPK-BPR-01',
        actividad_codigo: 'ACT-BPR-001',
        frecuencia: 90,
        unidad_medida_codigo: 'dia',
        descripcion: 'Mantenimiento preventivo Banco de Pruebas 1 - cada 3 meses',
        tipo_estrategia_codigo: 'MP',
        status_codigo: 'AC'
      },
      {
        codigo: 'EST-TOR-001',
        area_codigo: 'PR',
        equipo_codigo: 'HPK-TOR-01',
        actividad_codigo: 'ACT-TOR-001',
        frecuencia: 180,
        unidad_medida_codigo: 'dia',
        descripcion: 'Mantenimiento preventivo Tornos - cada 6 meses',
        tipo_estrategia_codigo: 'MP',
        status_codigo: 'AC'
      },
      {
        codigo: 'EST-MTC-001',
        area_codigo: 'MT',
        equipo_codigo: 'HPK-MTC-01',
        actividad_codigo: 'ACT-MTC-001',
        frecuencia: 250,
        unidad_medida_codigo: 'h',
        descripcion: 'Mantenimiento montacargas HANGCHA cada 250 horas',
        tipo_estrategia_codigo: 'CC',
        status_codigo: 'AC'
      }
    ], { ignoreDuplicates: true });
    console.log(`✓ ${estrategias.length} estrategias creadas\n`);

    // 6. Poblar tareas — Actividades de mantenimiento HP&K
    console.log('📝 PASO 6: Creando tareas...');
    const tareas = await Tarea.bulkCreate([
      {
        actividad_codigo: 'ACT-BPR-001',
        descripcion: 'Inspección de conexiones y sellos banco de pruebas',
        item_numero: 1,
        tipo_codigo: 'SER',
        requerimiento: 1,
        texto: 'Revisar conexiones hidráulicas, manómetros y sellos del banco de pruebas',
        precio: 120.00
      },
      {
        actividad_codigo: 'ACT-BPR-001',
        descripcion: 'Cambio de aceite hidráulico banco de pruebas',
        item_numero: 2,
        tipo_codigo: 'MAC',
        material_codigo: 'MAT-003',
        requerimiento: 20,
        np: 'NP-ACEI-HID-001'
      },
      {
        actividad_codigo: 'ACT-TOR-001',
        descripcion: 'Lubricación guías y husillos torno',
        item_numero: 1,
        tipo_codigo: 'MAC',
        material_codigo: 'MAT-003',
        requerimiento: 2,
        np: 'NP-ACEI-HID-001'
      },
      {
        actividad_codigo: 'ACT-TOR-001',
        descripcion: 'Inspección de mordazas y portaherramientas',
        item_numero: 2,
        tipo_codigo: 'SER',
        requerimiento: 1,
        texto: 'Verificar apriete y desgaste de mordazas del plato de torno',
        precio: 80.00
      },
      {
        actividad_codigo: 'ACT-MTC-001',
        descripcion: 'Cambio de aceite motor montacargas',
        item_numero: 1,
        tipo_codigo: 'MAC',
        material_codigo: 'MAT-003',
        requerimiento: 8,
        np: 'NP-ACEI-HID-001'
      }
    ], { ignoreDuplicates: true });
    console.log(`✓ ${tareas.length} tareas creadas\n`);

    // 7. Poblar órdenes de trabajo — OTs de ejemplo HP&K (cilindros hidráulicos mineros)
    console.log('🎫 PASO 7: Creando órdenes de trabajo...');
    const ordenesTrabajoData = [
      {
        ot: 'OT-2024-001',
        estrategia: false,
        tipo: 'General',
        descripcion: 'Reparación cilindro dirección CAT 793 - Las Bambas',
        ns: 'SN-CAT793-DIR-001',
        fecha_recepcion: new Date('2024-03-01'),
        pcr: 12000.00,
        horas: 10500.00,
        garantia_codigo: 'No',
        atencion_reparacion_codigo: 'Contrato',
        tipo_reparacion_codigo: 'General',
        prioridad_atencion_codigo: '1',
        contrato_dias: 45,
        ot_status_codigo: 'Cerrada',
        recursos_status_codigo: 'Recursos completos',
        taller_status_codigo: 'Entregado',
        nro_informe_evaluacion: '245024-E',
        nro_cotizacion: '245024-C',
        monto_cotizacion: 9500.00,
        fecha_entrega: new Date('2024-04-10'),
        nro_factura: 'F001-00245',
        usuario_crea: 'Admin',
        fecha_creacion: new Date()
      },
      {
        ot: 'OT-2024-002',
        estrategia: false,
        tipo: 'General',
        descripcion: 'Reparación cilindro suspensión Komatsu 930E - Antapaccay',
        ns: 'SN-KOM930-SUS-002',
        fecha_recepcion: new Date('2024-04-15'),
        pcr: 15000.00,
        horas: 14200.00,
        garantia_codigo: 'Si',
        tipo_garantia_codigo: 'HPK',
        atencion_reparacion_codigo: 'Presupuesto',
        tipo_reparacion_codigo: 'General',
        prioridad_atencion_codigo: '2',
        contrato_dias: 60,
        ot_status_codigo: 'Abierta',
        recursos_status_codigo: 'En espera de recursos',
        taller_status_codigo: 'Pdt proceso',
        nro_informe_evaluacion: '245025-E',
        nro_cotizacion: '245025-C',
        monto_cotizacion: 13500.00,
        usuario_crea: 'Admin',
        fecha_creacion: new Date()
      },
      {
        ot: 'OT-2024-003',
        estrategia: false,
        tipo: 'Parcial',
        descripcion: 'Reparación parcial cilindro dirección CAT 793 - Las Bambas',
        ns: 'SN-CAT793-DIR-003',
        fecha_recepcion: new Date('2024-05-02'),
        pcr: 12000.00,
        horas: 6000.00,
        garantia_codigo: 'No',
        atencion_reparacion_codigo: 'Emergencia',
        tipo_reparacion_codigo: 'Parcial',
        prioridad_atencion_codigo: 'E',
        contrato_dias: 20,
        ot_status_codigo: 'Abierta',
        recursos_status_codigo: 'En cotización',
        taller_status_codigo: 'Pdt Evaluación',
        usuario_crea: 'Admin',
        fecha_creacion: new Date()
      }
    ];

    const ordenesTrabajo = await OrdenTrabajo.bulkCreate(ordenesTrabajoData, { ignoreDuplicates: true });
    console.log(`✓ ${ordenesTrabajo.length} órdenes de trabajo creadas\n`);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('         ✓ BASE DE DATOS POBLADA EXITOSAMENTE                  ');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    console.log('📊 RESUMEN COMPLETO:\n');
    console.log('  CATÁLOGOS (28 tipos):');
    console.log('    - Monedas, Unidades de Medida, Plantas, Áreas');
    console.log('    - Fabricantes, Categorías, Status, Tipos, etc.\n');
    console.log('  DATOS DE TRABAJO:');
    console.log(`    - ${materiales.length} Materiales`);
    console.log(`    - ${equipos.length} Equipos`);
    console.log(`    - ${herramientas.length} Herramientas`);
    console.log(`    - ${codigosRep.length} Códigos de Reparación`);
    console.log(`    - ${estrategias.length} Estrategias`);
    console.log(`    - ${tareas.length} Tareas`);
    console.log(`    - ${ordenesTrabajo.length} Órdenes de Trabajo\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

  } catch (error: any) {
    console.error('\n❌ ERROR al poblar la base de datos:', error);
    console.error('Detalles:', error.message);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedAll()
    .then(() => {
      console.log('Cerrando conexión a la base de datos...');
      return sequelize.close();
    })
    .then(() => {
      console.log('✓ Conexión cerrada exitosamente\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}

export default seedAll;
