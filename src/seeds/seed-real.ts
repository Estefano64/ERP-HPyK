import * as path from 'path';
import { QueryTypes } from 'sequelize';
import sequelize from '../config/database';
import Material from '../models/Material';
import CodigoReparacion from '../models/CodigoReparacion';
import Tarea from '../models/Tarea';
import Proveedor from '../models/Proveedor';
import Almacen from '../models/Almacen';
import seedCatalogs from './catalogs.seed';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const xlsx = require('xlsx');

// ================================================================
// SEED REAL — Datos reales de los Excel de HP&K
// Fuentes:
//   - data/1 Log - material.xlsx           → 834 materiales (catálogo oficial)
//   - data/5. Cod Rep.xlsx                 → 118 códigos de reparación
//   - data/4. Log prod - Task list...xlsx  → 1486 tareas
// ================================================================

// ── Rutas a los archivos Excel ──────────────────────────────────
const ROOT            = path.resolve(__dirname, '../../data');
const MATERIAL_PATH   = path.join(ROOT, '1 Log - material.xlsx');
const COD_REP_PATH    = path.join(ROOT, '5. Cod Rep.xlsx');
const TASK_LIST_PATH  = path.join(ROOT, '4. Log prod - Task list materiales.xlsx');

// ── Mapa fabricante Excel → codigo catalogo ─────────────────────
// Acepta tanto nombres completos (CATERPILLAR) como códigos cortos (CAT)
const FABRICANTE_MAP: Record<string, string> = {
  // Nombres completos → código corto del catálogo fabricante
  'CATERPILLAR':         'CAT',
  'KOMATSU':             'KOM',
  'ALTERNATIVO':         'ALT',
  'MACHEN':              'MAC',
  'BOHLER':              'BOH',
  'VISTONY':             'VIS',
  'CANTESCO':            'CAN',
  'TEKBOND':             'TEK',
  'SOLPACK':             'SOL',
  'TRUPER':              'TRU',
  'SHURTAPE':            'SHU',
  'NORTON':              'NOR',
  'UYUSTOOLS':           'UYU',
  'SILICONI':            'SIL',
  'ANYPSA':              'ANY',
  'CLUTE':               'CLU',
  'FERRAWYY':            'FER',
  'PROTEC':              'PRO',
  'BAHCO':               'BAH',
  'ABRALIT':             'ABR',
  'SEGPRO':              'SEG',
  'HENKEL':              'HEN',
  'KLINGSPOR':           'KLI',
  'STEELPRO':            'STE',
  'ELITE':               'ELI',
  'SOLDIMIX':            'SDM',
  'ESAB':                'ESA',
  'OERLIKON':            'OER',
  'NACHO':               'NAC',
  'TRAPEX':              'TRA',
  'ALICORP':             'ALI',
  'ANSELL':              'ANS',
  'XIADAL':              'XIA',
  'ARAGCU':              'ARA',
  'LINDE':               'LIN',
  'ALDISE':              'ALD',
  'SUNNEN':              'SUN',
  'ZCC-CT':              'ZCC',
  'LINCOLN':             'LIN',
  'MILLER':              'MIL',
  'PARKER':              'PAR',
  'BOSCH':               'BOC',
  'MAKITA':              'MAK',
  'METABO':              'MET',
  'SNAPON':              'SNP',
  'COLUMBIA':            'COL',
  'SARO':                'SAR',
  'NILES':               'NIL',
  'ZAYER':               'ZAY',
  'UNION':               'UNI',
  'EPIROC':              'EPI',
  'IKO':                 'IKO',
  'SEAL SOURCE':         'ALT',
  // Códigos cortos (ya son el valor final)
  'ALT': 'ALT', 'MAC': 'MAC', 'BOH': 'BOH', 'CAT': 'CAT', 'KOM': 'KOM',
  'VIS': 'VIS', 'CAN': 'CAN', 'TEK': 'TEK', 'SOL': 'SOL', 'TRU': 'TRU',
  'SHU': 'SHU', 'C&A': 'C&A', 'NOR': 'NOR', 'UYU': 'UYU', 'SIL': 'SIL',
  'ANY': 'ANY', 'CLU': 'CLU', 'FER': 'FER', 'PRO': 'PRO', 'BAH': 'BAH',
  'ABR': 'ABR', 'SEG': 'SEG', 'HEN': 'HEN', 'KLI': 'KLI', 'STE': 'STE',
  'ELI': 'ELI', 'SDM': 'SDM', 'ESA': 'ESA', 'OER': 'OER', 'NAC': 'NAC',
  'TRA': 'TRA', 'ALI': 'ALI', '3M': '3M', 'ANS': 'ANS', 'XIA': 'XIA',
  'ARA': 'ARA', 'ALD': 'ALD', 'SUN': 'SUN', 'ZCC': 'ZCC',
  'GEN': 'ALT', 'TAE': 'ALT', 'EPS': 'ALT',
  // Variantes con espacios / puntos
  'KOM ':  'KOM', 'CAT.': 'CAT', 'CAT ': 'CAT', 'cat': 'CAT',
  '4 CAT': 'CAT', 'CAT.ALTERNATIVO': 'CAT', 'SEAL SOURCE CAT': 'CAT',
  'KOM SEAL SOURCE': 'KOM', '2 SEAL SOURCE Y CAT': 'ALT',
};

// ── Mapa clasificación nombre → código (del Excel Clasificacion sheet) ──
const CLASIFICACION_MAP: Record<string, string> = {
  'Aceite': 'ACEI', 'Acero': 'ACER', 'Adaptador': 'ADAP', 'Anillo': 'ANIL',
  'Anillo de desgaste': 'ADES', 'Anillo metalico': 'AMET', 'Anillo de respaldo': 'ARES',
  'Anillo de retencion': 'ARET', 'Arandela': 'ARAN', 'Arandela de goma': 'AGOM',
  'Back Up': 'BACK', 'Barras': 'BARR', 'Billa': 'BILL', 'Buffer': 'BUFF',
  'Calce': 'CALC', 'Carrier Seal': 'CASE', 'Casquillo': 'CASQ', 'Cojinete': 'COJI',
  'Conjunto amortiguador': 'CAMO', 'Conjunto de enchufe': 'CENC', 'Conjunto de iman': 'CIMA',
  'Conjunto de resorte': 'CRES', 'Conjunto de sello': 'CSEL', 'Conjunto de tapon': 'CTAP',
  'Conjunto de valvula': 'CVAL', 'Cone Roller': 'CONR', 'Contratuerca': 'CONT',
  'Cup Roller': 'CUPR', 'Damper': 'DAMP', 'Discos': 'DISC', 'Disco de friccion': 'DFRI',
  'Dowel Spring': 'DOWS', 'Duo cone': 'DUOC', 'Embolo': 'EMB',
  'Equipo de seguridad': 'EPPS', 'Espaciador': 'ESPA', 'Espiga': 'ESPI',
  'Guia': 'GUIA', 'Iman': 'IMAN', 'Insert': 'INSE', 'Iron Cast': 'IRONC',
  'Juego de receptaculo': 'JUREC', 'Kit de bladder': 'KITB', 'Kit de sellos': 'KITS',
  'Limpiadores': 'LIMP', 'Manguito': 'MANG', 'Sello anular': 'ORIN',
  'Pasador': 'PASA', 'Perno': 'PERN', 'Pista': 'PISTA', 'Placa': 'PLCA',
  'Plate': 'PLTE', 'Plug': 'PLUG', 'Prisionero de bola': 'PRIB',
  'Prisionero': 'PRIS', 'Protector': 'PROT', 'Protector de valvula': 'PROV',
  'Resorte': 'RESO', 'Reten': 'RETE', 'Ring Cushion': 'RINC',
  'Rodamiento': 'RODA', 'Rod Bushing': 'RODB', 'Rotulas': 'ROTU',
  'Seguro seager': 'SEGS', 'Seguros': 'SEGU', 'Sello anillo': 'SELA',
  'Sello de culata': 'SELC', 'Sello de funda': 'SELF', 'Sellos': 'SELL',
  'Sello principal': 'SELP', 'Sensores': 'SENS', 'Grupo de sensor': 'SENS',
  'Sensor de velocidad': 'SENSV', 'Shim': 'SHIM', 'Suministros': 'SUMI',
  'Tapa': 'TAPA', 'Tapon': 'TAPO', 'Tornillo': 'TORN', 'Trabador': 'TRAB',
  'Tubos': 'TUBO', 'Tuerca': 'TUER', 'Uniformes': 'UNIF', 'Valvula': 'VALV',
};

// ── Mapa categoría nombre → código ──
const CATEGORIA_MAP: Record<string, string> = {
  'Consumible': 'CON', 'Critico': 'CRI', 'Repuesto': 'REP',
  'Capital': 'CAP', 'Obsoleto': 'OBS', 'Fabricado': 'FAB',
};

// ── Mapa unidad de medida Excel → codigo catalogo ──────────────
function mapUnidad(raw: string | null): string {
  if (!raw) return 'und';
  const u = raw.trim().toLowerCase();
  const UNIDAD_MAP: Record<string, string> = {
    'unidad': 'und', 'und': 'und', 'pza': 'und', 'pieza': 'und', 'pz': 'und',
    'metro': 'm', 'metros': 'm', 'mt': 'm', 'm': 'm',
    'milimetro': 'mm', 'mm': 'mm',
    'centimetro': 'cm', 'cm': 'cm',
    'pulgada': 'in', 'pulg': 'in', 'in': 'in', '"': 'in',
    'kilogramo': 'kg', 'kg': 'kg', 'kilo': 'kg',
    'tonelada': 't', 'ton': 't', 't': 't',
    'hora': 'h', 'hr': 'h', 'h': 'h',
    'litro': 'lt', 'lt': 'lt', 'l': 'lt',
    'galon': 'gl', 'gal': 'gl', 'gl': 'gl',
    'juego': 'und', 'jgo': 'und', 'set': 'und', 'kit': 'und',
    'par': 'und', 'rollo': 'und', 'balde': 'und',
  };
  return UNIDAD_MAP[u] || 'und';
}

// ── Mapa flota Excel → codigo catalogo (≤10 chars) ─────────────
// Los flotas numéricos se convierten a string primero
const FLOTA_MAP: Record<string, string> = {
  '16M':          '16M',
  '24':           '24',
  '24M':          '24M',
  '336DL':        '336DL',
  '374DL':        '374DL',
  '374FL':        '374FL',
  '390DL':        '390DL',
  '390FL':        '390FL',
  '420E':         '420E',
  '6060FS':       '6060FS',
  '793':          '793',
  '793D':         '793D',
  '797':          '797',
  '797F':         '797F',
  '830DC':        '830DC',
  '830E':         '830E',
  '834H':         '834H',
  '834K':         '834K',
  '844H':         '844H',
  '844K':         '844K',
  '924G':         '924G',
  '928H':         '928H',
  '930E':         '930E',
  '930E-4SE':     '930E-4SE',
  '950H':         '950H',
  '966H':         '966H',
  '966M':         '966M',
  '980':          '980',
  '980E-4SE':     '980E-4SE',
  '980H':         '980H',
  '988K':         '988K',
  '992K':         '992K',
  '994F':         '994F',
  '994K':         '994K',
  'D11':          'D11',
  'D11T':         'D11T',
  'D475':         'D475',
  'D8T':          'D8T',
  'D9R':          'D9R',
  'HD1500':       'HD1500',
  'MD6540':       'MD6540',
  'MD6640':       'MD6640',
  'PC1250':       'PC1250',
  'PC2000':       'PC2000',
  'PITVIPER 351': 'PTV351',
  'WA900':        'WA900',
};


// ── Leer materiales del 1 Log - material.xlsx ────────────────────
// 2 filas de encabezado, datos desde fila índice 2
// [0]=Usuario, [1]=CodigoMaterial(Software/vacío), [2]=Descripción, [3]=Planta,
// [4]=Area, [5]=Categoría, [6]=Clasificación, [7]=Pto.Rep,
// [8]=Stock Máx, [9]=Und Med, [10]=Plazo, [11]=Precio,
// [12]=Moneda, [13]=Fabricante, [14]=NP

interface MaterialRow {
  codigo: string;
  descripcion: string;
  np: string | null;
  fabricante: string | null;
  fabricante_codigo: string | null;
  precio: number | null;
  moneda: string | null;
  unidad: string | null;
  area: string | null;
  categoria: string | null;
  clasificacion: string | null;
  punto_reposicion: number | null;
  stock_maximo: number | null;
  plazo_entrega: number | null;
}

function leerMaterial(): MaterialRow[] {
  const wb = xlsx.readFile(MATERIAL_PATH);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data: any[][] = xlsx.utils.sheet_to_json(ws, { header: 1 });

  const rows: MaterialRow[] = [];
  // Contadores por clasificación para generar código secuencial
  const seqPorClasificacion: Record<string, number> = {};
  const usedCodigos = new Set<string>();

  for (let i = 2; i < data.length; i++) {  // datos desde fila 2 (skip 2 headers)
    const row = data[i];
    if (!row || !row[2]) continue;

    const descripcion = String(row[2]).trim();
    if (!descripcion) continue;

    const npRaw = row[14] ? String(row[14]).trim() : '';
    const fabRaw = row[13] ? String(row[13]).trim() : null;
    const clasificacionNombre = row[6] ? String(row[6]).trim() : '';
    const categoriaNombre = row[5] ? String(row[5]).trim() : '';

    // Resolver clasificación: nombre → código (ej: "Sellos" → "SELL")
    const clasCodigo = CLASIFICACION_MAP[clasificacionNombre] || 'SUMI';

    // Resolver categoría: nombre → código (ej: "Repuesto" → "REP")
    const catCodigo = CATEGORIA_MAP[categoriaNombre] || 'REP';

    // Resolver fabricante: nombre completo o código corto → código catálogo
    let fabCodigo: string | null = null;
    if (fabRaw) {
      fabCodigo = FABRICANTE_MAP[fabRaw] || FABRICANTE_MAP[fabRaw.toUpperCase()] || null;
    }

    // Generar código: {CLAS}-{SEQ:4}  → ej: SELL-0001, ACEI-0003
    if (!seqPorClasificacion[clasCodigo]) seqPorClasificacion[clasCodigo] = 0;
    seqPorClasificacion[clasCodigo]++;
    let codigo = `${clasCodigo}-${String(seqPorClasificacion[clasCodigo]).padStart(4, '0')}`;

    // Asegurar unicidad
    if (usedCodigos.has(codigo)) {
      codigo = `${clasCodigo}-${String(seqPorClasificacion[clasCodigo]).padStart(4, '0')}-${i}`;
    }
    usedCodigos.add(codigo);

    rows.push({
      codigo,
      descripcion,
      np:                npRaw || null,
      fabricante:        fabRaw,
      fabricante_codigo: fabCodigo,
      precio:            row[11] != null ? Number(row[11]) || null : null,
      moneda:            row[12] ? String(row[12]).trim() : null,
      unidad:            row[9]  ? String(row[9]).trim()  : null,
      area:              row[4]  ? String(row[4]).trim()  : null,
      categoria:         catCodigo,
      clasificacion:     clasCodigo,
      punto_reposicion:  row[7]  != null ? Number(row[7]) || null : null,
      stock_maximo:      row[8]  != null ? Number(row[8]) || null : null,
      plazo_entrega:     row[10] != null ? Number(row[10]) || null : null,
    });
  }
  return rows;
}

// ── Leer códigos de reparación del 5. Cod Rep.xlsx ───────────────
// Header row (index 1): [0]=Usuario, [1]=CodRep, [2]=Descripcion,
// [3]=Tipo, [4]=Categoria, [5]=Flota, [6]=Fabricante,
// [7]=NP, [8]=Posicion, [9]=Precio

interface CodRepRow {
  descripcion: string;
  tipo: string;
  categoria: string;
  flota: string;
  fabricante: string | null;
  np: string | null;
  posicion: string | null;
  precio: number | null;
}

function leerCodRep(): CodRepRow[] {
  const wb = xlsx.readFile(COD_REP_PATH);
  const ws = wb.Sheets['Cod Rep'];
  const data: any[][] = xlsx.utils.sheet_to_json(ws, { header: 1 });

  const rows: CodRepRow[] = [];
  for (let i = 2; i < data.length; i++) {  // datos desde fila 2
    const row = data[i];
    if (!row || !row[2] || !row[3]) continue;  // necesita Descripcion y Tipo

    const flota = row[5] != null ? String(row[5]).trim() : '';

    rows.push({
      descripcion: String(row[2]).trim(),
      tipo: String(row[3]).trim().toUpperCase(),
      categoria: String(row[4] || '').trim().toUpperCase(),
      flota,
      fabricante: row[6] ? String(row[6]).trim() : null,
      np: row[7] ? String(row[7]).trim().substring(0, 100) : null,
      posicion: row[8] ? String(row[8]).trim().toUpperCase() : null,
      precio: row[9] ? Number(row[9]) : null,
    });
  }
  return rows;
}

// ── Generar código único para CodigoReparacion ───────────────────
function generarCodigoCodRep(
  tipo: string,
  flota: string,
  np: string | null,
  posicion: string | null,
  usedCodes: Set<string>,
  idx: number
): string {
  const flotaClean = flota.replace(/[^A-Z0-9]/gi, '').substring(0, 8).toUpperCase();
  const npClean    = (np || '').replace(/[^A-Z0-9]/gi, '').substring(0, 8).toUpperCase();
  const posClean   = (posicion || 'NA').substring(0, 3).toUpperCase();

  let base = `${tipo}-${flotaClean}-${npClean}-${posClean}`.substring(0, 50);
  if (!usedCodes.has(base)) {
    usedCodes.add(base);
    return base;
  }
  // Conflict: append index
  const withIdx = `${tipo}-${flotaClean}-${npClean}-${posClean}-${idx}`.substring(0, 50);
  usedCodes.add(withIdx);
  return withIdx;
}

// ── Leer Task List del 4. Log prod - Task list materiales.xlsx ───
// Header (row 1):
// [0]=Usuario, [1]=Actividad, [2]=Cod Rep, [3]=N/P cod 1,
// [4]=N/P cod 2, [5]=ID TUBO, [6]=OD VAS, [7]=Descripción,
// [8]=Item, [9]=Tipo, [10]=Material, [11]=Requerimiento,
// [12]=Ref descripcion, [13]=NP, [14]=Texto, [15]=Precio
// Data starts at row index 2.

interface TaskRow {
  actividad_codigo: string;
  cod_rep_codigo?: string;
  np_cod1?: string;
  np_cod2?: string;
  id_tubo?: string;
  od_vas?: string;
  descripcion: string;
  item_numero: number;
  tipo_codigo: string;
  material_codigo?: string;
  requerimiento: number;
  ref_descripcion?: string;
  np?: string;
  texto?: string;
  precio?: number;
}

function leerTaskList(): TaskRow[] {
  const wb = xlsx.readFile(TASK_LIST_PATH);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data: any[][] = xlsx.utils.sheet_to_json(ws, { header: 1 });

  const rows: TaskRow[] = [];
  let autoIdx = 0;

  for (let i = 2; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[7]) continue; // skip rows without description

    autoIdx++;
    const actividad = row[1]
      ? String(row[1]).trim().substring(0, 50)
      : `TL-${String(autoIdx).padStart(5, '0')}`;

    rows.push({
      actividad_codigo:  actividad,
      cod_rep_codigo:    row[2]  ? String(row[2]).trim().substring(0, 50)   : undefined,
      np_cod1:           row[3]  ? String(row[3]).trim().substring(0, 100)  : undefined,
      np_cod2:           row[4]  ? String(row[4]).trim().substring(0, 100)  : undefined,
      id_tubo:           row[5]  ? String(row[5]).trim().substring(0, 50)   : undefined,
      od_vas:            row[6]  ? String(row[6]).trim().substring(0, 50)   : undefined,
      descripcion:       String(row[7]).trim(),
      item_numero:       row[8]  != null ? Number(row[8]) : autoIdx,
      tipo_codigo:       row[9]  ? String(row[9]).trim().substring(0, 10)   : 'MAC',
      material_codigo:   row[10] ? String(row[10]).trim().substring(0, 50)  : undefined,
      requerimiento:     row[11] != null ? Number(row[11]) : 1,
      ref_descripcion:   row[12] ? String(row[12]).trim()                   : undefined,
      np:                row[13] ? String(row[13]).trim().substring(0, 100) : undefined,
      texto:             row[14] ? String(row[14]).trim()                   : undefined,
      precio:            row[15] != null ? Number(row[15])                  : undefined,
    });
  }

  return rows;
}

async function seedTaskList() {
  const tareas = leerTaskList();
  console.log(`   Filas leídas del Excel: ${tareas.length}`);

  // Limpiar para reimportación idempotente
  await sequelize.query('TRUNCATE TABLE tarea RESTART IDENTITY CASCADE');

  let creados = 0;
  const BATCH = 200;
  for (let i = 0; i < tareas.length; i += BATCH) {
    await Tarea.bulkCreate(tareas.slice(i, i + BATCH));
    creados += Math.min(BATCH, tareas.length - i);
  }
  console.log(`   ✓ ${creados} tareas importadas`);

  // ── LINKEO AUTOMÁTICO: resolver columnas "Software" vacías ──────
  // 1. cod_rep_codigo: tarea.np_cod1 → codigo_reparacion.np
  //    Un mismo np puede tener varios CodRep (LH/RH/NA), tomamos el primero
  const linkCodRep = await sequelize.query(`
    UPDATE tarea t
    SET cod_rep_codigo = sub.codigo
    FROM (
      SELECT DISTINCT ON (np) np, codigo
      FROM codigo_reparacion
      WHERE np IS NOT NULL AND np <> ''
      ORDER BY np, codigo
    ) sub
    WHERE t.np_cod1 IS NOT NULL
      AND t.np_cod1 = sub.np
      AND (t.cod_rep_codigo IS NULL OR t.cod_rep_codigo = '')
  `, { type: QueryTypes.UPDATE }) as any;
  const codRepLinked = Array.isArray(linkCodRep) ? (linkCodRep[1] ?? 0) : 0;
  console.log(`   ✓ ${codRepLinked} tareas vinculadas a código de reparación (via np_cod1 → cod_rep.np)`);

  // 2. material_codigo: tarea.np → material.np (solo tipo MAC)
  //    Un mismo np puede tener varios materiales, tomamos el primero
  const linkMat = await sequelize.query(`
    UPDATE tarea t
    SET material_codigo = sub.codigo
    FROM (
      SELECT DISTINCT ON (np) np, codigo
      FROM material
      WHERE np IS NOT NULL AND np <> ''
      ORDER BY np, codigo
    ) sub
    WHERE t.np IS NOT NULL
      AND t.np = sub.np
      AND t.tipo_codigo = 'MAC'
      AND (t.material_codigo IS NULL OR t.material_codigo = '')
  `, { type: QueryTypes.UPDATE }) as any;
  const matLinked = Array.isArray(linkMat) ? (linkMat[1] ?? 0) : 0;
  console.log(`   ✓ ${matLinked} tareas vinculadas a material (via tarea.np → material.np)`);

  // 3. actividad_codigo: generar código automático TL-{NP_COD1}-{ITEM}
  await sequelize.query(`
    UPDATE tarea
    SET actividad_codigo = 'TL-' || COALESCE(SUBSTRING(np_cod1, 1, 20), 'X') || '-' || LPAD(item_numero::text, 3, '0')
    WHERE actividad_codigo LIKE 'TL-%'
  `, { type: QueryTypes.UPDATE });
  console.log(`   ✓ Códigos de actividad generados`);

  return creados;
}

// ── Proveedores reales de HP&K ───────────────────────────────────
async function seedProveedores() {
  const proveedores = [
    { ruc: '20100070970', razonSocial: 'KOMATSU-MITSUI MAQUINARIAS PERU SA', contacto: 'Ventas', telefono: '014226000', email: 'ventas@komatsu.com.pe', direccion: 'Av. Argentina 2085, Lima', estado: 'Activo' as const },
    { ruc: '20100039207', razonSocial: 'FERREYROS SA', contacto: 'Ventas CAT', telefono: '016136060', email: 'ventas@ferreyros.com.pe', direccion: 'Av. Argentina 3297, Lima', estado: 'Activo' as const },
    { ruc: '20521847962', razonSocial: 'SEAL SOURCE PERU SAC', contacto: 'Contacto Comercial', telefono: '014370000', email: 'ventas@sealsource.com.pe', direccion: 'Lima, Peru', estado: 'Activo' as const },
    { ruc: '20507678458', razonSocial: 'PARKER HANNIFIN PERU SAC', contacto: 'Ventas Industriales', telefono: '016120700', email: 'peru@parker.com', direccion: 'Av. La Marina 3245, San Miguel, Lima', estado: 'Activo' as const },
    { ruc: '20601459231', razonSocial: 'EPIROC PERU SAC', contacto: 'Soporte Técnico', telefono: '017000000', email: 'contacto@epiroc.com.pe', direccion: 'Lima, Peru', estado: 'Activo' as const },
    { ruc: '20510536140', razonSocial: 'IKO BEARINGS PERU SAC', contacto: 'Ventas', telefono: '012001234', email: 'ventas@iko.com.pe', direccion: 'Lima, Peru', estado: 'Activo' as const },
    { ruc: '20600123456', razonSocial: 'DISTRIBUIDORA INDUSTRIAL ANDINA SAC', contacto: 'Compras', telefono: '054000111', email: 'compras@diandina.com.pe', direccion: 'Arequipa, Peru', estado: 'Activo' as const },
    { ruc: '20413765824', razonSocial: 'PERU OIL SAC', contacto: 'Ventas', telefono: '054321000', email: 'ventas@peruoil.com.pe', direccion: 'Arequipa, Peru', estado: 'Activo' as const },
  ];

  let creados = 0;
  for (const p of proveedores) {
    const [, created] = await Proveedor.findOrCreate({ where: { ruc: p.ruc }, defaults: p });
    if (created) creados++;
  }
  console.log(`   ✓ ${creados} proveedores creados (${proveedores.length - creados} ya existían)`);
}

// ── Almacenes reales de HP&K ─────────────────────────────────────
async function seedAlmacenes() {
  const almacenes = [
    { codigo: 'ALM-PRIN', nombre: 'Almacén Principal', capacidad: 500, ocupacion: 0, zonas: 10, ubicacion: 'Planta Arequipa - Sector A', estado: 'Activo' as const },
    { codigo: 'ALM-TALL', nombre: 'Almacén Taller', capacidad: 200, ocupacion: 0, zonas: 5, ubicacion: 'Planta Arequipa - Taller', estado: 'Activo' as const },
    { codigo: 'ALM-HIDRA', nombre: 'Almacén Hidráulica', capacidad: 150, ocupacion: 0, zonas: 4, ubicacion: 'Planta Arequipa - Sector Hidráulica', estado: 'Activo' as const },
    { codigo: 'ALM-CAMP', nombre: 'Almacén Campo', capacidad: 100, ocupacion: 0, zonas: 3, ubicacion: 'Unidad Minera', estado: 'Activo' as const },
    { codigo: 'ALM-CRIT', nombre: 'Almacén Materiales Críticos', capacidad: 80, ocupacion: 0, zonas: 2, ubicacion: 'Planta Arequipa - Sector B', estado: 'Activo' as const },
  ];

  let creados = 0;
  for (const a of almacenes) {
    const [, created] = await Almacen.findOrCreate({ where: { codigo: a.codigo }, defaults: a });
    if (created) creados++;
  }
  console.log(`   ✓ ${creados} almacenes creados (${almacenes.length - creados} ya existían)`);
}

// ── Main seed function ───────────────────────────────────────────
async function seedReal() {
  try {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  SEED REAL — Datos reales HP&K desde Excel');
    console.log('═══════════════════════════════════════════════════════\n');

    await sequelize.sync({ force: false });

    // 0. Migraciones previas: ampliar columnas VARCHAR que son demasiado cortas
    console.log('0. Aplicando migraciones de schema...');
    await sequelize.query(`ALTER TABLE atencion_reparacion ALTER COLUMN codigo TYPE VARCHAR(30);`);
    await sequelize.query(`ALTER TABLE ot_status ALTER COLUMN codigo TYPE VARCHAR(30);`);
    await sequelize.query(`ALTER TABLE recursos_status ALTER COLUMN codigo TYPE VARCHAR(30);`);
    await sequelize.query(`ALTER TABLE taller_status ALTER COLUMN codigo TYPE VARCHAR(30);`);
    await sequelize.query(`ALTER TABLE tipo_garantia ALTER COLUMN codigo TYPE VARCHAR(30);`);
    await sequelize.query(`ALTER TABLE fabricante ALTER COLUMN codigo TYPE VARCHAR(20);`);
    await sequelize.query(`ALTER TABLE material ADD COLUMN IF NOT EXISTS modelo VARCHAR(100);`);
    await sequelize.query(`ALTER TABLE material ADD COLUMN IF NOT EXISTS caja VARCHAR(50);`);

    // Migrar tabla ordenes_compra al nuevo schema (agrega columnas faltantes)
    const ocCols = [
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS numero_oc VARCHAR(50) UNIQUE`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS fecha_orden DATE`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS fecha_entrega_requerida DATE`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS proveedor_id INTEGER`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS contacto_proveedor VARCHAR(200)`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS material_id INTEGER`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS descripcion TEXT`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS cantidad DECIMAL(12,4)`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS unidad_medida VARCHAR(20)`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS precio_unitario DECIMAL(14,4)`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS subtotal DECIMAL(14,2)`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS igv_porcentaje DECIMAL(5,2) DEFAULT 18`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS descuento_porcentaje DECIMAL(5,2) DEFAULT 0`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS total_final DECIMAL(14,2)`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS forma_pago VARCHAR(50)`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS plazo_pago INTEGER`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS moneda VARCHAR(10) DEFAULT 'USD'`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS almacen_id INTEGER`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS direccion_entrega TEXT`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS incoterm VARCHAR(10)`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS prioridad VARCHAR(20) DEFAULT 'media'`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS tipo_compra VARCHAR(30)`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS user_crea VARCHAR(100)`,
      `ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS ot_id INTEGER`,
    ];
    for (const sql of ocCols) {
      await sequelize.query(sql).catch(() => {}); // ignora si ya existe
    }
    // Asegurar que el ENUM estado incluya los nuevos valores
    await sequelize.query(`DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_ordenes_compra_estado') THEN
        CREATE TYPE enum_ordenes_compra_estado AS ENUM ('borrador','enviada','confirmada','recibida','cancelada');
      END IF;
    END $$;`).catch(() => {});
    await sequelize.query(`ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'borrador'`).catch(() => {});
    console.log('   ✓ Migraciones aplicadas\n');

    // 1. Ejecutar catálogos primero (idempotente)
    console.log('1. Ejecutando catálogos base...');
    await seedCatalogs();

    // ────────────────────────────────────────────────────────────
    // 2. PROVEEDORES Y ALMACENES
    // ────────────────────────────────────────────────────────────
    console.log('\n2. Importando proveedores...');
    await seedProveedores();

    console.log('\n3. Importando almacenes...');
    await seedAlmacenes();

    // ────────────────────────────────────────────────────────────
    // 4. MATERIALES — 1 Log - material.xlsx (catálogo oficial)
    // ────────────────────────────────────────────────────────────
    console.log('\n4. Importando materiales del catálogo oficial...');
    const materialRows = leerMaterial();
    console.log(`   Filas leídas del Excel: ${materialRows.length}`);

    const materialesData = materialRows.map(row => {
      // Normalizar moneda
      const monedaRaw = (row.moneda || '').toUpperCase();
      const moneda_codigo = monedaRaw === 'USD' ? 'USD' : monedaRaw === 'SOL' ? 'PEN' : (row.precio ? 'USD' : undefined);

      // Mapear area: Produccion→PR, Logistica→LG
      const areaMap: Record<string, string> = { 'Produccion': 'PR', 'Logistica': 'LG' };
      const area_codigo = row.area ? (areaMap[row.area] || 'LG') : 'LG';

      return {
        codigo:               row.codigo,
        descripcion:          row.descripcion,
        descripcion_compuesta: row.descripcion,
        planta_codigo:        'AQPTA01',
        area_codigo,
        categoria_codigo:     row.categoria || 'REP',
        clasificacion_codigo: row.clasificacion || 'SUMI',
        unidad_medida_codigo: mapUnidad(row.unidad) || 'und',
        precio:               row.precio || undefined,
        moneda_codigo:        moneda_codigo as string | undefined,
        fabricante_codigo:    row.fabricante_codigo || undefined,
        np:                   row.np || row.codigo,
        stock_actual:         0,
        activo:               true,
      };
    });

    // Insertar en lotes de 100 (ignorar duplicados por codigo)
    let matCreados = 0;
    let matActualizados = 0;
    const BATCH = 100;
    for (let i = 0; i < materialesData.length; i += BATCH) {
      const batch = materialesData.slice(i, i + BATCH);
      const result = await Material.bulkCreate(batch, {
        updateOnDuplicate: [
          'descripcion', 'descripcion_compuesta', 'precio', 'moneda_codigo',
          'fabricante_codigo', 'np', 'categoria_codigo', 'clasificacion_codigo',
        ],
      });
      matCreados += result.length;
    }
    console.log(`   ✓ ${matCreados} materiales del catálogo oficial insertados/actualizados`);

    // ────────────────────────────────────────────────────────────
    // 5. CÓDIGOS DE REPARACIÓN — 5. Cod Rep.xlsx
    // ────────────────────────────────────────────────────────────
    console.log('\n5. Importando códigos de reparación...');
    const codRepRows = leerCodRep();
    console.log(`   Filas leídas del Excel: ${codRepRows.length}`);

    const usedCodes = new Set<string>();
    const codRepData = codRepRows.map((row, idx) => {
      // Mapear flota
      const flotaKey = row.flota;
      const flota_codigo = FLOTA_MAP[flotaKey] || flotaKey.substring(0, 10) || 'GEN';

      // Mapear fabricante (CAT→CAT, KOM→KOM, EPIROC→EPI)
      const fab = row.fabricante;
      let fabricante_codigo: string | null = null;
      if (fab) {
        fabricante_codigo = FABRICANTE_MAP[fab] || FABRICANTE_MAP[fab.toUpperCase()] || fab.substring(0, 10);
      }

      // Mapear posición
      const POSICION_MAP: Record<string, string> = {
        LH: 'LH', RH: 'RH', NA: 'NA', DEL: 'DEL', POS: 'POS',
      };
      const posicion_codigo = row.posicion ? (POSICION_MAP[row.posicion] || 'NA') : 'NA';

      const codigo = generarCodigoCodRep(
        row.tipo, flota_codigo, row.np, posicion_codigo, usedCodes, idx
      );

      return {
        codigo,
        descripcion:      row.descripcion,
        tipo_codigo:      row.tipo,
        categoria_codigo: row.categoria || 'CAM',
        flota_codigo,
        fabricante_codigo: fabricante_codigo || undefined,
        np:               row.np || undefined,
        posicion_codigo,
        precio:           row.precio || undefined,
      };
    });

    // Filtrar filas con datos esenciales
    const validCodRep = codRepData.filter(r =>
      r.tipo_codigo && r.categoria_codigo && r.flota_codigo
    );

    let codRepCreados = 0;
    for (let i = 0; i < validCodRep.length; i += BATCH) {
      const batch = validCodRep.slice(i, i + BATCH);
      const result = await CodigoReparacion.bulkCreate(batch, {
        updateOnDuplicate: [
          'descripcion', 'tipo_codigo', 'categoria_codigo', 'flota_codigo',
          'fabricante_codigo', 'np', 'posicion_codigo', 'precio',
        ],
      });
      codRepCreados += result.length;
    }
    console.log(`   ✓ ${codRepCreados} códigos de reparación insertados/actualizados`);

    // ────────────────────────────────────────────────────────────
    // 6. TASK LIST — 4. Log prod - Task list materiales.xlsx
    // ────────────────────────────────────────────────────────────
    console.log('\n6. Importando Task List (materiales por CodRep)...');
    const tareasCreadas = await seedTaskList();

    // ────────────────────────────────────────────────────────────
    // RESUMEN
    // ────────────────────────────────────────────────────────────
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  SEED REAL COMPLETADO EXITOSAMENTE');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`  Materiales:           ${matCreados}`);
    console.log(`  Códigos Reparación:   ${codRepCreados}`);
    console.log(`  Task List (tareas):   ${tareasCreadas}`);
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\nError en seed real:', error);
    throw error;
  }
}

if (require.main === module) {
  seedReal()
    .then(() => sequelize.close())
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Error fatal:', err);
      process.exit(1);
    });
}

export default seedReal;
