import sequelize from '../config/database';
import seedDatabase from './catalogs.seed';
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

    // 1. Poblar catálogos primero
    console.log('📦 PASO 1: Poblando catálogos maestros...\n');
    await seedDatabase();

    // 2. Poblar materiales
    console.log('\n📦 PASO 2: Creando materiales de ejemplo...');
    const materiales = await Material.bulkCreate([
      {
        codigo: 'MAT-001',
        np: 'NP-12345',
        descripcion: 'Rodamiento de bolas SKF 6205',
        descripcion_compuesta: 'Rodamiento de bolas SKF 6205 - Alta precisión para aplicaciones industriales',
        planta_codigo: 'LIMA',
        area_codigo: 'MANT',
        categoria_codigo: 'REP',
        clasificacion_codigo: 'A',
        unidad_medida_codigo: 'UND',
        punto_reposicion: 10,
        stock_maximo: 25,
        stock_actual: 8,
        precio: 45.50,
        moneda_codigo: 'USD',
        fabricante_codigo: 'CAT',
        ubicacion: 'A-01-15',
        activo: true
      },
      {
        codigo: 'MAT-002',
        np: 'NP-67890',
        descripcion: 'Filtro de aceite industrial',
        descripcion_compuesta: 'Filtro de aceite industrial - Compatible con motores diesel',
        planta_codigo: 'LIMA',
        area_codigo: 'MANT',
        categoria_codigo: 'CONS',
        clasificacion_codigo: 'B',
        unidad_medida_codigo: 'UND',
        punto_reposicion: 15,
        stock_maximo: 30,
        stock_actual: 20,
        precio: 22.00,
        moneda_codigo: 'USD',
        fabricante_codigo: 'CUMMINS',
        ubicacion: 'B-02-08',
        activo: true
      },
      {
        codigo: 'MAT-003',
        np: 'NP-11223',
        descripcion: 'Aceite lubricante SAE 15W-40',
        descripcion_compuesta: 'Aceite lubricante SAE 15W-40 - Multigrado para uso industrial pesado',
        planta_codigo: 'CALLAO',
        area_codigo: 'ALMACEN',
        categoria_codigo: 'CONS',
        clasificacion_codigo: 'A',
        unidad_medida_codigo: 'GLN',
        punto_reposicion: 50,
        stock_maximo: 120,
        stock_actual: 0,
        precio: 18.75,
        moneda_codigo: 'USD',
        fabricante_codigo: 'GE',
        ubicacion: 'C-01-01',
        activo: true
      },
      {
        codigo: 'MAT-004',
        np: 'NP-44556',
        descripcion: 'Sello mecánico para bomba',
        descripcion_compuesta: 'Sello mecánico para bomba centrífuga - Material cerámico',
        planta_codigo: 'LIMA',
        area_codigo: 'MANT',
        categoria_codigo: 'REP',
        clasificacion_codigo: 'B',
        unidad_medida_codigo: 'UND',
        punto_reposicion: 5,
        stock_maximo: 12,
        stock_actual: 15,
        precio: 85.00,
        moneda_codigo: 'USD',
        fabricante_codigo: 'VOLVO',
        ubicacion: 'A-03-20',
        activo: true
      },
      {
        codigo: 'MAT-005',
        np: 'NP-77889',
        descripcion: 'Kit de empaquetaduras turbo',
        descripcion_compuesta: 'Kit completo de empaquetaduras para turbocompresor - Incluye todos los sellos',
        planta_codigo: 'LIMA',
        area_codigo: 'PROD',
        categoria_codigo: 'REP',
        clasificacion_codigo: 'A',
        unidad_medida_codigo: 'UND',
        punto_reposicion: 8,
        stock_maximo: 15,
        stock_actual: 12,
        precio: 125.50,
        moneda_codigo: 'USD',
        fabricante_codigo: 'MAN',
        ubicacion: 'A-01-05',
        activo: true
      }
    ], { ignoreDuplicates: true });
    console.log(`✓ ${materiales.length} materiales creados\n`);

    // 3. Poblar equipos
    console.log('🔧 PASO 3: Creando equipos de ejemplo...');
    const equipos = await Equipo.bulkCreate([
      {
        codigo: 'EQ-TURBO-001',
        descripcion: 'Turbocompresor Caterpillar 3516',
        status_codigo: 'OPERATIVO',
        area_codigo: 'PROD',
        sub_area_codigo: 'PROD-TURBO',
        tipo_codigo: 'TURBO',
        fecha_inicio: new Date('2024-01-15'),
        fecha_fabricacion: new Date('2023-11-20'),
        fabricante_codigo: 'CAT',
        modelo: 'CAT-3516-TURBO',
        numero_serie: 'SN-TURBO-001-2023',
        numero_parte: 'NP-TURBO-3516',
        capacidad: 1500.00,
        unidad_medida_codigo: 'HR',
        observaciones: 'Turbocompresor de alta eficiencia para uso industrial',
        planta_codigo: 'LIMA',
        criticidad_codigo: 'ALTA'
      },
      {
        codigo: 'EQ-MOTOR-001',
        descripcion: 'Motor Diesel Cummins QSK50',
        status_codigo: 'OPERATIVO',
        area_codigo: 'PROD',
        sub_area_codigo: 'PROD-MOTOR',
        tipo_codigo: 'MOTOR',
        fecha_inicio: new Date('2024-02-01'),
        fecha_fabricacion: new Date('2023-12-10'),
        fabricante_codigo: 'CUMMINS',
        modelo: 'QSK50-G4',
        numero_serie: 'SN-MOTOR-001-2023',
        numero_parte: 'NP-MOTOR-QSK50',
        capacidad: 2000.00,
        unidad_medida_codigo: 'HR',
        observaciones: 'Motor diesel de alta potencia',
        planta_codigo: 'LIMA',
        criticidad_codigo: 'ALTA'
      },
      {
        codigo: 'EQ-COMP-001',
        descripcion: 'Compresor de aire industrial',
        status_codigo: 'OPERATIVO',
        area_codigo: 'MANT',
        sub_area_codigo: 'MANT-PREV',
        tipo_codigo: 'COMPRESOR',
        fecha_inicio: new Date('2023-10-01'),
        fecha_fabricacion: new Date('2023-08-15'),
        fabricante_codigo: 'GE',
        modelo: 'GE-COMP-500',
        numero_serie: 'SN-COMP-001-2023',
        numero_parte: 'NP-COMP-500',
        capacidad: 500.00,
        unidad_medida_codigo: 'HR',
        planta_codigo: 'CALLAO',
        criticidad_codigo: 'MEDIA'
      },
      {
        codigo: 'EQ-BOMBA-001',
        descripcion: 'Bomba centrífuga Volvo',
        status_codigo: 'MANT',
        area_codigo: 'MANT',
        sub_area_codigo: 'MANT-CORR',
        tipo_codigo: 'BOMBA',
        fecha_inicio: new Date('2024-01-05'),
        fabricante_codigo: 'VOLVO',
        modelo: 'VOLVO-BC-350',
        numero_serie: 'SN-BOMBA-001-2024',
        numero_parte: 'NP-BOMBA-350',
        planta_codigo: 'LIMA',
        criticidad_codigo: 'BAJA'
      },
      {
        codigo: 'EQ-GEN-001',
        descripcion: 'Generador eléctrico MAN',
        status_codigo: 'OPERATIVO',
        area_codigo: 'PROD',
        tipo_codigo: 'GENERADOR',
        fecha_inicio: new Date('2023-11-10'),
        fabricante_codigo: 'MAN',
        modelo: 'MAN-GEN-1000',
        numero_serie: 'SN-GEN-001-2023',
        planta_codigo: 'CALLAO',
        criticidad_codigo: 'ALTA'
      }
    ], { ignoreDuplicates: true });
    console.log(`✓ ${equipos.length} equipos creados\n`);

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

    // 4. Poblar códigos de reparación
    console.log('🔨 PASO 4: Creando códigos de reparación...');
    const codigosRep = await CodigoReparacion.bulkCreate([
      {
        codigo: 'REP-TURBO-001',
        tipo_codigo: 'OVERHAUL',
        categoria_codigo: 'MECANICO',
        descripcion: 'Overhaul completo de turbocompresor',
        fabricante_codigo: 'CAT',
        flota_codigo: 'INDUSTRIAL',
        posicion_codigo: 'FRONTAL',
        np: 'NP-TURBO-3516',
        precio: 8500.00
      },
      {
        codigo: 'REP-MOTOR-001',
        tipo_codigo: 'PREVENTIVO',
        categoria_codigo: 'MECANICO',
        descripcion: 'Mantenimiento preventivo motor diesel',
        fabricante_codigo: 'CUMMINS',
        flota_codigo: 'MINERIA',
        posicion_codigo: 'FRONTAL',
        np: 'NP-MOTOR-QSK50',
        precio: 3500.00
      },
      {
        codigo: 'REP-COMP-001',
        tipo_codigo: 'CORRECTIVO',
        categoria_codigo: 'MECANICO',
        descripcion: 'Reparación correctiva de compresor',
        fabricante_codigo: 'GE',
        flota_codigo: 'INDUSTRIAL',
        posicion_codigo: 'LAT_IZQ',
        precio: 1200.00
      },
      {
        codigo: 'REP-BOMBA-001',
        tipo_codigo: 'CORRECTIVO',
        categoria_codigo: 'HIDRAULICO',
        descripcion: 'Cambio de sellos mecánicos bomba',
        fabricante_codigo: 'VOLVO',
        flota_codigo: 'INDUSTRIAL',
        posicion_codigo: 'INFERIOR',
        precio: 850.00
      }
    ], { ignoreDuplicates: true });
    console.log(`✓ ${codigosRep.length} códigos de reparación creados\n`);

    // 5. Poblar estrategias
    console.log('📋 PASO 5: Creando estrategias...');
    const estrategias = await Estrategia.bulkCreate([
      {
        codigo: 'EST-PREV-001',
        area_codigo: 'PROD',
        equipo_codigo: 'EQ-TURBO-001',
        actividad_codigo: 'ACT-PREV-001',
        frecuencia: 180,
        unidad_medida_codigo: 'DIA',
        descripcion: 'Estrategia preventiva turbos industriales - Mantenimiento cada 6 meses',
        tipo_estrategia_codigo: 'PREV',
        status_codigo: 'ACTIVA'
      },
      {
        codigo: 'EST-PREV-002',
        area_codigo: 'PROD',
        equipo_codigo: 'EQ-MOTOR-001',
        actividad_codigo: 'ACT-PREV-002',
        frecuencia: 90,
        unidad_medida_codigo: 'DIA',
        descripcion: 'Estrategia preventiva motores diesel - Mantenimiento cada 3 meses',
        tipo_estrategia_codigo: 'PREV',
        status_codigo: 'ACTIVA'
      },
      {
        codigo: 'EST-PRED-001',
        area_codigo: 'MANT',
        equipo_codigo: 'EQ-COMP-001',
        actividad_codigo: 'ACT-PRED-001',
        frecuencia: 60,
        unidad_medida_codigo: 'DIA',
        descripcion: 'Estrategia predictiva análisis aceite - Análisis mensual',
        tipo_estrategia_codigo: 'PRED',
        status_codigo: 'ACTIVA'
      }
    ], { ignoreDuplicates: true });
    console.log(`✓ ${estrategias.length} estrategias creadas\n`);

    // 6. Poblar tareas
    console.log('📝 PASO 6: Creando tareas...');
    const tareas = await Tarea.bulkCreate([
      {
        actividad_codigo: 'ACT-PREV-001',
        cod_rep_codigo: 'REP-TURBO-001',
        descripcion: 'Inspección visual de componentes turbo',
        item_numero: 1,
        tipo_codigo: 'SERVICIO',
        requerimiento: 1,
        texto: 'Inspección completa de componentes críticos del turbocompresor',
        precio: 50.00
      },
      {
        actividad_codigo: 'ACT-PREV-001',
        cod_rep_codigo: 'REP-TURBO-001',
        descripcion: 'Cambio de rodamientos',
        item_numero: 2,
        tipo_codigo: 'MATERIAL',
        material_codigo: 'MAT-001',
        requerimiento: 2,
        np: 'NP-12345',
        ref_descripcion: 'Rodamiento principal y secundario'
      },
      {
        actividad_codigo: 'ACT-PREV-002',
        cod_rep_codigo: 'REP-MOTOR-001',
        descripcion: 'Cambio de filtros y aceite',
        item_numero: 1,
        tipo_codigo: 'MATERIAL',
        material_codigo: 'MAT-003',
        requerimiento: 4,
        np: 'NP-11223'
      },
      {
        actividad_codigo: 'ACT-PRED-001',
        descripcion: 'Análisis de vibraciones',
        item_numero: 1,
        tipo_codigo: 'SERVICIO',
        requerimiento: 1,
        texto: 'Medición y análisis predictivo de vibraciones',
        precio: 80.00
      },
      {
        actividad_codigo: 'ACT-PREV-001',
        cod_rep_codigo: 'REP-TURBO-001',
        descripcion: 'Reemplazo kit empaquetaduras',
        item_numero: 3,
        tipo_codigo: 'MATERIAL',
        material_codigo: 'MAT-005',
        requerimiento: 1,
        np: 'NP-77889'
      }
    ], { ignoreDuplicates: true });
    console.log(`✓ ${tareas.length} tareas creadas\n`);

    // 7. Poblar órdenes de trabajo
    console.log('🎫 PASO 7: Creando órdenes de trabajo...');
    const ordenesTrabajoData = [
      {
        ot: 'OT-2024-001',
        id_cliente: 1, // Minera del Sur
        estrategia: true,
        tipo: 'Overhaul',
        descripcion: 'Overhaul completo de turbocompresor CAT 3516',
        equipo_codigo: 'EQ-TURBO-001',
        ns: 'SN-TURBO-001-2023',
        fecha_ot: new Date('2024-02-01'),
        fecha_ingreso: new Date('2024-02-05'),
        fecha_inicio_trabajo: new Date('2024-02-10'),
        pcr: 1500.00,
        horas: 1450.00,
        garantia_codigo: 'NO',
        atencion_reparacion_codigo: 'PROGRAMADO',
        tipo_reparacion_codigo: 'OVERHAUL',
        prioridad_atencion_codigo: 'MEDIA',
        contrato_dias: 30,
        ot_status_codigo: 'EN_PROCESO',
        recursos_status_codigo: 'COMPLETO',
        taller_status_codigo: 'REPARANDO',
        usuario_crea: 'Admin',
        fecha_creacion: new Date()
      },
      {
        ot: 'OT-2024-002',
        id_cliente: 2, // Transportes del Norte
        estrategia: true,
        tipo: 'Preventivo',
        descripcion: 'Mantenimiento preventivo motor Cummins QSK50',
        equipo_codigo: 'EQ-MOTOR-001',
        ns: 'SN-MOTOR-001-2023',
        fecha_ot: new Date('2024-02-15'),
        fecha_ingreso: new Date('2024-02-16'),
        pcr: 2000.00,
        horas: 1950.00,
        garantia_codigo: 'SI',
        tipo_garantia_codigo: 'FABRICANTE',
        atencion_reparacion_codigo: 'NORMAL',
        tipo_reparacion_codigo: 'PREVENTIVO',
        prioridad_atencion_codigo: 'BAJA',
        contrato_dias: 15,
        ot_status_codigo: 'ABIERTA',
        recursos_status_codigo: 'PARCIAL',
        taller_status_codigo: 'NO_INGRESO',
        usuario_crea: 'Admin',
        fecha_creacion: new Date()
      },
      {
        ot: 'OT-2024-003',
        id_cliente: 1,
        estrategia: false,
        tipo: 'Correctivo',
        descripcion: 'Reparación de fuga en compresor de aire',
        equipo_codigo: 'EQ-COMP-001',
        ns: 'SN-COMP-001-2023',
        fecha_ot: new Date('2024-02-20'),
        fecha_ingreso: new Date('2024-02-20'),
        fecha_inicio_trabajo: new Date('2024-02-21'),
        pcr: 500.00,
        horas: 480.00,
        garantia_codigo: 'NO',
        atencion_reparacion_codigo: 'URGENTE',
        tipo_reparacion_codigo: 'CORRECTIVO',
        prioridad_atencion_codigo: 'URGENTE',
        contrato_dias: 7,
        ot_status_codigo: 'EN_PROCESO',
        recursos_status_codigo: 'COMPLETO',
        taller_status_codigo: 'REPARANDO',
        usuario_crea: 'Admin',
        fecha_creacion: new Date()
      },
      {
        ot: 'OT-2024-004',
        id_cliente: 2,
        estrategia: false,
        tipo: 'Correctivo',
        descripcion: 'Cambio de sellos mecánicos bomba Volvo',
        equipo_codigo: 'EQ-BOMBA-001',
        ns: 'SN-BOMBA-001-2024',
        fecha_ot: new Date('2024-02-22'),
        fecha_ingreso: new Date('2024-02-23'),
        garantia_codigo: 'SI',
        tipo_garantia_codigo: 'TALLER',
        atencion_reparacion_codigo: 'NORMAL',
        tipo_reparacion_codigo: 'CORRECTIVO',
        prioridad_atencion_codigo: 'ALTA',
        contrato_dias: 10,
        ot_status_codigo: 'ABIERTA',
        recursos_status_codigo: 'PENDIENTE',
        taller_status_codigo: 'NO_INGRESO',
        usuario_crea: 'Admin',
        fecha_creacion: new Date()
      },
      {
        ot: 'OT-2024-005',
        id_cliente: 1,
        estrategia: false,
        tipo: 'Inspección',
        descripcion: 'Inspección anual generador MAN',
        equipo_codigo: 'EQ-GEN-001',
        ns: 'SN-GEN-001-2023',
        fecha_ot: new Date('2024-02-25'),
        fecha_ingreso: new Date('2024-02-26'),
        fecha_inicio_trabajo: new Date('2024-02-26'),
        fecha_termino: new Date('2024-02-26'),
        garantia_codigo: 'NO',
        atencion_reparacion_codigo: 'PROGRAMADO',
        tipo_reparacion_codigo: 'INSPECCION',
        prioridad_atencion_codigo: 'MEDIA',
        contrato_dias: 1,
        ot_status_codigo: 'CERRADA',
        recursos_status_codigo: 'COMPLETO',
        taller_status_codigo: 'ENTREGADO',
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
