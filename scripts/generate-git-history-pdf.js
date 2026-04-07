const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const repoRoot = process.cwd();
const sinceArg = process.argv[2] || '2026-03-01';
const outputArg = process.argv[3] || `reports/cambios-desde-${sinceArg}.pdf`;
const outputPath = path.resolve(repoRoot, outputArg);

function run(cmd) {
  try {
    return execSync(cmd, { cwd: repoRoot, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return '';
  }
}

function safeText(text) {
  return String(text || '').replace(/\t/g, '  ');
}

function addWrappedLine(doc, text, options = {}) {
  doc.font(options.font || 'Helvetica').fontSize(options.size || 10).text(safeText(text), {
    width: options.width || 520,
    align: options.align || 'left'
  });
}

function ensureParentDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function ensureSpace(doc, minY = 760) {
  if (doc.y > minY) doc.addPage();
}

function inferModule(filePath) {
  if (!filePath) return 'Otros';
  const p = filePath.replace(/\\/g, '/');
  const parts = p.split('/');

  if (parts[0] === 'src') {
    if (parts[1] === 'controllers') return `Controllers/${parts[2] || 'general'}`;
    if (parts[1] === 'routes') return `Routes/${parts[2] || 'general'}`;
    if (parts[1] === 'models') return 'Models';
    if (parts[1] === 'vistas') return `Vistas/${parts[2] || 'general'}`;
    if (parts[1] === 'config') return 'Config';
    if (parts[1] === 'seeds') return 'Seeds';
    return `Src/${parts[1] || 'general'}`;
  }

  if (parts[0] === 'migrations') return 'Migrations';
  if (parts[0] === 'data') return `Data/${parts[1] || 'general'}`;
  if (parts[0] === 'dist') return 'Dist';
  return 'Raiz/Otros';
}

function parseFunctionsFromPatch(patchText) {
  const found = new Set();
  const lines = patchText.split(/\r?\n/);

  for (const line of lines) {
    if (line.startsWith('@@')) {
      const m = line.match(/@@[^@]*@@\s*(.*)$/);
      const context = (m?.[1] || '').trim();
      if (context) found.add(context.slice(0, 120));
      continue;
    }

    if (!line.startsWith('+') || line.startsWith('+++')) continue;
    const added = line.slice(1).trim();
    if (!added) continue;

    let match = added.match(/^(?:async\s+)?function\s+([A-Za-z0-9_]+)/);
    if (match) {
      found.add(`function ${match[1]}()`);
      continue;
    }

    match = added.match(/^(?:const|let|var)\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?\(/);
    if (match) {
      found.add(`${match[1]} = (...) =>`);
      continue;
    }

    match = added.match(/^([A-Za-z0-9_]+)\s*\(([^)]*)\)\s*\{/);
    if (match && !['if', 'for', 'while', 'switch', 'catch'].includes(match[1])) {
      found.add(`${match[1]}(...)`);
      continue;
    }
  }

  return [...found].slice(0, 10);
}

function buildCommitDetails(commits) {
  const summaryByAuthor = new Map();
  const summaryByModule = new Map();
  let totalFilesChanged = 0;
  let totalInsertions = 0;
  let totalDeletions = 0;

  const commitDetails = commits.map((commit) => {
    const statRaw = run(`git show --numstat --format="" ${commit.hash}`);
    const statLines = statRaw ? statRaw.split(/\r?\n/).filter(Boolean) : [];

    const files = statLines.map((s) => {
      const [ins, del, file] = s.split(/\t+/);
      const insNum = ins === '-' ? 0 : Number(ins || 0);
      const delNum = del === '-' ? 0 : Number(del || 0);
      totalInsertions += insNum;
      totalDeletions += delNum;
      totalFilesChanged += 1;

      const moduleName = inferModule(file);
      summaryByModule.set(moduleName, (summaryByModule.get(moduleName) || 0) + 1);

      return { file, ins: insNum, del: delNum, moduleName };
    });

    summaryByAuthor.set(commit.author, (summaryByAuthor.get(commit.author) || 0) + 1);

    const modulesTouched = [...new Set(files.map((f) => f.moduleName))];

    const allFunctions = new Set();
    files.slice(0, 12).forEach((f) => {
      const patch = run(`git show --format="" --unified=0 ${commit.hash} -- "${f.file}"`);
      const fn = parseFunctionsFromPatch(patch);
      fn.forEach((name) => allFunctions.add(name));
    });

    return {
      ...commit,
      files,
      modulesTouched,
      functionsTouched: [...allFunctions].slice(0, 10)
    };
  });

  return {
    summaryByAuthor,
    summaryByModule,
    totalFilesChanged,
    totalInsertions,
    totalDeletions,
    commitDetails
  };
}

function writePdf({ commits, details }) {
  ensureParentDir(outputPath);

  const doc = new PDFDocument({ margin: 36, size: 'A4' });
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  doc.font('Helvetica-Bold').fontSize(18).text('ERP-HPyK - Reporte de Implementaciones (Exposicion)');
  doc.moveDown(0.4);
  addWrappedLine(doc, `Rango analizado: desde ${sinceArg} hasta ${new Date().toISOString().slice(0, 10)}`);
  addWrappedLine(doc, `Repositorio: ${path.basename(repoRoot)}`);
  addWrappedLine(doc, `Objetivo: mostrar que se implemento, en que modulo y que funciones se tocaron`);
  doc.moveDown(0.4);

  doc.font('Helvetica-Bold').fontSize(12).text('Resumen Ejecutivo');
  addWrappedLine(doc, `Total de commits: ${commits.length}`);
  addWrappedLine(doc, `Total de archivos modificados (acumulado): ${details.totalFilesChanged}`);
  addWrappedLine(doc, `Lineas agregadas: ${details.totalInsertions} | Lineas eliminadas: ${details.totalDeletions}`);

  doc.moveDown(0.4);
  doc.font('Helvetica-Bold').fontSize(12).text('Participacion por Autor');
  [...details.summaryByAuthor.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([author, count]) => addWrappedLine(doc, `- ${author}: ${count} commits`));

  doc.moveDown(0.4);
  doc.font('Helvetica-Bold').fontSize(12).text('Modulos con Mayor Actividad');
  [...details.summaryByModule.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .forEach(([moduleName, count]) => addWrappedLine(doc, `- ${moduleName}: ${count} archivos tocados`));

  doc.addPage();
  doc.font('Helvetica-Bold').fontSize(14).text('Detalle para Exposicion por Commit');
  doc.moveDown(0.5);

  details.commitDetails.forEach((c, idx) => {
    ensureSpace(doc, 730);

    doc.font('Helvetica-Bold').fontSize(11).text(`${idx + 1}. [${c.shortHash}] ${c.subject}`);
    addWrappedLine(doc, `Fecha: ${c.date} | Autor: ${c.author}`, { size: 9 });

    const objetivo = c.subject || 'Actualizacion tecnica';
    addWrappedLine(doc, `Que se implemento: ${objetivo}`, { size: 9 });

    if (c.modulesTouched.length > 0) {
      addWrappedLine(doc, `Modulo(s): ${c.modulesTouched.slice(0, 6).join(', ')}`, { size: 9 });
    } else {
      addWrappedLine(doc, 'Modulo(s): No identificado', { size: 9 });
    }

    if (c.functionsTouched.length > 0) {
      addWrappedLine(doc, `Funciones tocadas: ${c.functionsTouched.join(' | ')}`, { size: 9 });
    } else {
      addWrappedLine(doc, 'Funciones tocadas: No detectables por diff (puede ser cambio estructural)', { size: 9 });
    }

    addWrappedLine(doc, 'Archivos principales:', { size: 9, font: 'Helvetica-Bold' });
    c.files.slice(0, 8).forEach((f) => {
      addWrappedLine(doc, `  - +${f.ins} / -${f.del} | ${f.moduleName} | ${f.file}`, { size: 8.8 });
    });

    if (c.files.length > 8) {
      addWrappedLine(doc, `  ... ${c.files.length - 8} archivo(s) adicional(es)`, { size: 8.8 });
    }

    doc.moveDown(0.45);
  });

  doc.end();

  stream.on('finish', () => {
    console.log(`PDF generado: ${outputPath}`);
  });
}

function main() {
  const commitsRaw = run(`git log --since="${sinceArg}" --reverse --pretty=format:"%H|%h|%ad|%an|%s" --date=short`);
  const lines = commitsRaw ? commitsRaw.split(/\r?\n/) : [];

  const commits = lines
    .map((line) => {
      const [hash, shortHash, date, author, ...subjectParts] = line.split('|');
      return {
        hash,
        shortHash,
        date,
        author,
        subject: subjectParts.join('|')
      };
    })
    .filter((c) => c.hash);

  const details = buildCommitDetails(commits);
  writePdf({ commits, details });
}

main();
