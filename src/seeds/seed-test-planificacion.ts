/**
 * Seed de prueba: Crea OTs de ejemplo con tareas de planificación
 * para probar el módulo de Programación Semanal.
 *
 * Uso: npx ts-node src/seeds/seed-test-planificacion.ts
 */
import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';

const OPERARIOS = [
  'Armando Ramos', 'Rolando Llayque', 'Gabriel Anco', 'Jose Huamani',
  'Justo Arocutipa', 'Giancarlo Ibarra', 'Gabriel Gallegos', 'Erick Cardenas',
  'Ricardo Yana', 'Tomas Vilca', 'Carlos Hernani', 'Yampier Braulio'
];

const EQUIPOS = [
  'TORNO 1', 'TORNO 2', 'TORNO 3', 'TORNO 4',
  'FRESADORA', 'MANDRINADORA', 'BRUÑIDORA',
  'BARRENADOR 1', 'BARRENADOR 2',
  'SOLDADURA 1', 'SOLDADURA 2', 'SOLDADURA 3',
  'PRENSA HIDRAULICA', 'BANCO PRUEBAS 1', 'BANCO PRUEBAS 2',
  'EVALUACION', 'ARMADO'
];

// Operaciones reales de HP&K
const OPERACIONES = {
  CIL_STD: [
    { cod: 'RELC', desc: 'Rellenado de alojamiento de cilindro', horas: 4 },
    { cod: 'BARC', desc: 'Barrenado de alojamiento de cilindro', horas: 6 },
    { cod: 'BRUC', desc: 'Bruñido de cilindro', horas: 3 },
  ],
  CIL_NOSTD: [
    { cod: 'COR-C', desc: 'Corte de cilindro', horas: 2 },
    { cod: 'MAQ-ENBC', desc: 'Maq. Encastre de brida', horas: 5 },
    { cod: 'MAQ-ENCC', desc: 'Maq. Encastre de cáncamo / tapa posterior', horas: 4 },
    { cod: 'ENC-TC', desc: 'Encastre de tubo de cilindro', horas: 3 },
    { cod: 'SOL-JC', desc: 'Soldadura de juntas de cilindro', horas: 6 },
    { cod: 'RELC', desc: 'Rellenado de alojamiento de cilindro', horas: 4 },
    { cod: 'MAQ-DSALC', desc: 'Maq. Diam. Salida de cilindro', horas: 3 },
  ],
  VAS_STD: [
    { cod: 'RELV', desc: 'Rellenado de alojamiento de vástago', horas: 3 },
    { cod: 'BARV', desc: 'Barrenado de alojamiento de vástago', horas: 5 },
    { cod: 'CROV', desc: 'Cromado de vástago', horas: 8 },
  ],
  VAS_NOSTD: [
    { cod: 'COR-V', desc: 'Corte de vástago', horas: 2 },
    { cod: 'ENC-CV', desc: 'Encastre de cáncamo de vástago', horas: 4 },
    { cod: 'ENC-BV', desc: 'Encastre de barra de vástago', horas: 5 },
    { cod: 'MAQ-EV', desc: 'Maq. Espiga de vástago', horas: 3 },
    { cod: 'SOL-JV', desc: 'Soldadura de Junta de vástago', horas: 4 },
  ],
  TAPA_STD: [
    { cod: 'PUL-T', desc: 'Pulido de tapa', horas: 2 },
    { cod: 'REC-T', desc: 'Rectificado de tapa', horas: 3 },
    { cod: 'FAB-T', desc: 'Fabricación de tapa', horas: 5 },
  ],
  PISTON_STD: [
    { cod: 'PUL-P', desc: 'Pulido de pistón', horas: 2 },
    { cod: 'REC-P', desc: 'Rectificado de pistón', horas: 3 },
    { cod: 'FAB-P', desc: 'Fabricación de pistón', horas: 4 },
  ],
};

// Calcular semana ISO actual y las próximas
function getISOWeek(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const w1 = new Date(d.getFullYear(), 0, 4);
  const wn = 1 + Math.round(((d.getTime() - w1.getTime()) / 86400000 - 3 + (w1.getDay() + 6) % 7) / 7);
  return `${d.getFullYear()}W${String(wn).padStart(2, '0')}`;
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addWorkHours(start: Date, hours: number): Date {
  const cur = new Date(start);
  let rest = hours;
  while (rest > 0) {
    const dow = cur.getDay();
    if (dow === 0 || dow === 6) { cur.setDate(cur.getDate() + 1); cur.setHours(8, 0, 0, 0); continue; }
    const h = cur.getHours() + cur.getMinutes() / 60;
    if (h < 8) { cur.setHours(8, 0, 0, 0); continue; }
    if (h >= 18) { cur.setDate(cur.getDate() + 1); cur.setHours(8, 0, 0, 0); continue; }
    if (h >= 12.5 && h < 13.5) { cur.setHours(13, 30, 0, 0); continue; }
    const nextBreak = h < 12.5 ? 12.5 : 18;
    const avail = nextBreak - h;
    if (rest <= avail) { cur.setMinutes(cur.getMinutes() + rest * 60); rest = 0; }
    else { rest -= avail; cur.setHours(Math.floor(nextBreak), (nextBreak % 1) * 60, 0, 0); }
  }
  return cur;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la BD.');

    // Obtener clientes existentes
    const clientes: any[] = await sequelize.query(
      `SELECT cliente_id FROM cliente LIMIT 5`, { type: QueryTypes.SELECT }
    );
    if (clientes.length === 0) {
      console.error('No hay clientes en la BD. Ejecuta primero npm run seed.');
      process.exit(1);
    }

    const now = new Date();
    const monday = getMonday(now);
    const currentWeek = getISOWeek(now);
    const nextMonday = new Date(monday); nextMonday.setDate(nextMonday.getDate() + 7);
    const nextWeek = getISOWeek(nextMonday);
    const prevMonday = new Date(monday); prevMonday.setDate(prevMonday.getDate() - 7);
    const prevWeek = getISOWeek(prevMonday);

    console.log(`Semanas: anterior=${prevWeek}, actual=${currentWeek}, siguiente=${nextWeek}`);

    // Definir 8 OTs de prueba
    const otDefs = [
      { ot: 'OT-TEST-001', desc: 'CIL SUSP DELANTERO 930E', flota: '930E', tipo: 'STD', componentes: ['CIL_STD', 'VAS_STD', 'TAPA_STD'] },
      { ot: 'OT-TEST-002', desc: 'CIL STEERING 797F', flota: '797F', tipo: 'NOSTD', componentes: ['CIL_NOSTD', 'VAS_STD', 'PISTON_STD'] },
      { ot: 'OT-TEST-003', desc: 'CIL BOOM PC5500', flota: 'PC5500', tipo: 'STD', componentes: ['CIL_STD', 'VAS_STD'] },
      { ot: 'OT-TEST-004', desc: 'CIL BUCKET 930E', flota: '930E', tipo: 'NOSTD', componentes: ['CIL_NOSTD', 'TAPA_STD', 'PISTON_STD'] },
      { ot: 'OT-TEST-005', desc: 'CIL SUSP TRASERO 797F', flota: '797F', tipo: 'STD', componentes: ['CIL_STD', 'VAS_STD', 'TAPA_STD', 'PISTON_STD'] },
      { ot: 'OT-TEST-006', desc: 'CIL LEVANTE PC4000', flota: 'PC4000', tipo: 'STD', componentes: ['VAS_STD', 'TAPA_STD'] },
      { ot: 'OT-TEST-007', desc: 'CIL EMPUJE PC5500', flota: 'PC5500', tipo: 'NOSTD', componentes: ['CIL_NOSTD', 'VAS_NOSTD'] },
      { ot: 'OT-TEST-008', desc: 'CIL HOIST 930E', flota: '930E', tipo: 'STD', componentes: ['CIL_STD', 'PISTON_STD'] },
    ];

    // Limpiar datos de prueba anteriores
    console.log('Limpiando datos de prueba anteriores...');
    const existingOTs: any[] = await sequelize.query(
      `SELECT id FROM orden_trabajo WHERE ot LIKE 'OT-TEST-%'`, { type: QueryTypes.SELECT }
    );
    if (existingOTs.length > 0) {
      const ids = existingOTs.map(o => o.id).join(',');
      await sequelize.query(`DELETE FROM planificacion_ot WHERE ot_id IN (${ids})`);
      await sequelize.query(`DELETE FROM orden_trabajo WHERE id IN (${ids})`);
      console.log(`  Eliminadas ${existingOTs.length} OTs de prueba anteriores.`);
    }

    // Crear OTs
    console.log('Creando OTs de prueba...');
    const createdOTs: number[] = [];
    for (const def of otDefs) {
      const clienteId = pick(clientes).cliente_id;
      const [result]: any = await sequelize.query(`
        INSERT INTO orden_trabajo (ot, id_cliente, descripcion, cod_rep_flota, ot_status_codigo, fecha_recepcion, prioridad_atencion_codigo, taller_status_codigo)
        VALUES (:ot, :clienteId, :desc, :flota, 'Abierta', :fechaRec, :prioridad, :taller)
        RETURNING id
      `, {
        type: QueryTypes.INSERT,
        replacements: {
          ot: def.ot,
          clienteId,
          desc: def.desc,
          flota: def.flota,
          fechaRec: new Date(monday.getTime() - Math.random() * 14 * 86400000).toISOString().split('T')[0],
          prioridad: pick(['1', '2', '3', 'E']),
          taller: pick(['Pdt Evaluación', 'Pdt proceso', 'Programado Proceso']),
        },
      });
      const otId = result[0]?.id || result[0];
      createdOTs.push(otId);
      console.log(`  ${def.ot} → id=${otId}`);
    }

    // Crear tareas de planificación
    console.log('Creando tareas de planificación...');
    let totalTareas = 0;

    // Distribución de semanas: 60% semana actual, 25% próxima, 15% sin semana
    const weekDistribution = [
      currentWeek, currentWeek, currentWeek, currentWeek, currentWeek, currentWeek,
      nextWeek, nextWeek, nextWeek,
      prevWeek,
      null, null,
    ];

    // Para cada OT, generar sus operaciones
    for (let i = 0; i < otDefs.length; i++) {
      const otId = createdOTs[i];
      const def = otDefs[i];
      let orden = 1;

      for (const compKey of def.componentes) {
        const ops = (OPERACIONES as any)[compKey];
        if (!ops) continue;
        const componente = compKey.split('_')[0]; // CIL, VAS, TAPA, PISTON
        const tipoRep = compKey.includes('NOSTD') ? 'NOSTD' : 'STD';

        for (const op of ops) {
          const semana = pick(weekDistribution);
          const equipo = pick(EQUIPOS);
          const operario = pick(OPERARIOS);
          const horas = op.horas + (Math.random() * 2 - 1); // ±1 hora variación
          const horasRound = Math.round(horas * 2) / 2; // redondear a 0.5

          // Para tareas con semana asignada, algunas tendrán fecha_inicio
          let fechaInicio: string | null = null;
          let fechaFin: string | null = null;
          const tieneFecha = semana && Math.random() > 0.3; // 70% con fecha

          if (tieneFecha && semana) {
            const semanaMonday = semana === currentWeek ? monday
              : semana === nextWeek ? nextMonday
              : prevMonday;
            const dayOffset = Math.floor(Math.random() * 5); // Lun-Vie
            const hourOffset = 8 + Math.floor(Math.random() * 7); // 8-14
            const minOffset = pick([0, 30]);
            const start = new Date(semanaMonday);
            start.setDate(start.getDate() + dayOffset);
            start.setHours(hourOffset, minOffset, 0, 0);
            // Skip lunch
            if (start.getHours() === 12 && start.getMinutes() >= 30) start.setHours(13, 30, 0, 0);
            if (start.getHours() === 13 && start.getMinutes() < 30) start.setHours(13, 30, 0, 0);

            const end = addWorkHours(start, horasRound);
            fechaInicio = start.toISOString();
            fechaFin = end.toISOString();
          }

          const estado = pick(['Pendiente', 'Pendiente', 'Pendiente', 'Programado', 'Programado']);
          const heChecked = Math.random() < 0.15; // 15% con horas extras
          const heQty = heChecked ? pick([1, 1.5, 2, 2.5, 3]) : null;

          await sequelize.query(`
            INSERT INTO planificacion_ot (ot_id, componente, operacion_codigo, descripcion, tipo_reparacion, orden, horas_estimadas, fecha_inicio, fecha_fin, tecnico, maquina, estado, semana_plan, qty_personal, horas_extras, horas_extras_qty, created_at, updated_at)
            VALUES (:otId, :comp, :cod, :desc, :tipo, :orden, :horas, :fi, :ff, :tec, :maq, :estado, :semana, :qty, :he, :heQty, NOW(), NOW())
          `, {
            type: QueryTypes.INSERT,
            replacements: {
              otId, comp: componente, cod: op.cod, desc: op.desc, tipo: tipoRep,
              orden, horas: horasRound, fi: fechaInicio, ff: fechaFin,
              tec: operario, maq: equipo, estado, semana,
              qty: pick([1, 1, 1, 2]), he: heChecked, heQty,
            },
          });
          orden++;
          totalTareas++;
        }
      }
    }

    console.log(`\n✔ Creadas ${otDefs.length} OTs de prueba con ${totalTareas} tareas de planificación.`);
    console.log(`  Semanas con datos: ${prevWeek}, ${currentWeek}, ${nextWeek}`);
    console.log(`\nPuedes verlas en:`);
    console.log(`  → Planificación: /produccion/planificacion-programacion.html`);
    console.log(`  → Programación Semanal: /produccion/programacion-semanal.html`);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
