// ============================================================
// evaluacion.js — Generador dinámico de hojas de evaluación
// Cada tipo de componente tiene su formulario personalizado
// basado en Hoja_de_Evaluacion_HPK.xlsx
// ============================================================

// ─── Funciones globales para interacción dinámica ────────────

/** Agregar un item nuevo al checklist dinámico */
function agregarCheckItem(btn) {
    const inputEl = btn.previousElementSibling;
    if (!inputEl || !inputEl.value.trim()) return;
    const texto = inputEl.value.trim();
    const targetId = inputEl.getAttribute('data-target');
    const container = document.querySelector(`.checklist-items[data-checklist="${targetId}"]`);
    if (!container) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-center gap-2 checklist-dynamic-item';
    wrapper.innerHTML = `
        <label class="flex items-center gap-2 flex-1"><input type="checkbox" class="text-blue-600" checked><span>${texto}</span></label>
        <button type="button" onclick="this.closest('.checklist-dynamic-item').remove()" class="text-red-400 hover:text-red-600 text-[11px] px-1" title="Quitar">
            <i class="fas fa-times"></i>
        </button>`;
    container.appendChild(wrapper);
    inputEl.value = '';
}

// ─── Helpers HTML ────────────────────────────────────────────

function inp(name, placeholder = '') {
    return `<input type="number" name="${name}" step="0.0001" inputmode="decimal"
        oninput="limitDecimals(this,4)"
        class="w-full border rounded px-2 py-1.5 text-xs text-right input-medida" placeholder="${placeholder}">`;
}

function inpText(name, placeholder = '', readonly = false) {
    const ro = readonly ? 'readonly bg-gray-100' : '';
    return `<input type="text" name="${name}" class="w-full border rounded px-2 py-1.5 text-xs ${ro}" placeholder="${placeholder}">`;
}

function medidaXY(prefix, label) {
    return `<tr>
        <td class="border px-2 py-1 text-gray-700">${label}</td>
        <td class="border px-1 text-center">${inp(prefix + '_x')}</td>
        <td class="border px-1 text-center">${inp(prefix + '_y')}</td>
    </tr>`;
}

function medidaSingle(prefix, label) {
    return `<tr>
        <td class="border px-2 py-1 text-gray-700">${label}</td>
        <td class="border px-1 text-center" colspan="2">${inp(prefix)}</td>
    </tr>`;
}

function imgReferencia(label) {
    return `<div class="border border-dashed border-gray-300 rounded-lg p-3 flex flex-col items-center justify-center text-center bg-white/60 min-h-[140px]">
        <i class="fas fa-image text-gray-300 text-3xl mb-2"></i>
        <span class="text-[11px] text-gray-400">Imagen de referencia</span>
        <span class="text-[10px] text-gray-400">${label}</span>
    </div>`;
}

/** Layout: (ref + img ref izquierda) | medidas centro | checks derecha */
function layoutSeccion(refHtml, medidasHtml, imgRefLabel, checksHtml) {
    return `<div class="grid grid-cols-1 lg:grid-cols-[200px_1fr_auto] gap-4">
        <div class="space-y-3">
            ${refHtml}
            ${imgReferencia(imgRefLabel)}
        </div>
        <div>${medidasHtml}</div>
        <div class="min-w-[250px]">${checksHtml}</div>
    </div>`;
}

function medidaA1A4(prefix) {
    let html = `<div class="mb-2">
        <label class="block font-semibold text-gray-700 mb-1 text-xs">Diámetro Interior (A1–A4)</label>
        <div class="grid grid-cols-4 gap-2 text-[10px]">`;
    for (let i = 1; i <= 4; i++) {
        html += `<div class="space-y-1">
            <span class="font-semibold text-gray-600">A${i}</span>
            <div class="flex gap-1">
                <div class="flex-1"><span class="text-gray-500">X</span>${inp(prefix + '_a' + i + '_x')}</div>
                <div class="flex-1"><span class="text-gray-500">Y</span>${inp(prefix + '_a' + i + '_y')}</div>
            </div>
        </div>`;
    }
    html += `</div></div>`;
    return html;
}

function radioBM(prefix, label) {
    return `<tr>
        <td class="border px-2 py-1 text-gray-700 text-xs">${label}</td>
        <td class="border px-2 py-1 text-center"><input type="radio" name="${prefix}" value="Bueno"></td>
        <td class="border px-2 py-1 text-center"><input type="radio" name="${prefix}" value="Malo"></td>
        <td class="border px-2 py-1 text-center"><input type="radio" name="${prefix}" value="NA"></td>
    </tr>`;
}

function radioSN(prefix, label) {
    return `<tr>
        <td class="border px-2 py-1 text-gray-700 text-xs">${label}</td>
        <td class="border px-2 py-1 text-center"><input type="radio" name="${prefix}" value="SI"></td>
        <td class="border px-2 py-1 text-center"><input type="radio" name="${prefix}" value="NO"></td>
        <td class="border px-2 py-1 text-center"><input type="radio" name="${prefix}" value="NA"></td>
    </tr>`;
}

function tablaChecks(prefix, items) {
    let html = `<table class="w-full text-xs border border-gray-200">
        <thead class="bg-gray-50"><tr>
            <th class="border px-2 py-1 text-left"></th>
            <th class="border px-2 py-1 text-center w-14">Bueno</th>
            <th class="border px-2 py-1 text-center w-14">Malo</th>
            <th class="border px-2 py-1 text-center w-14">N/A</th>
        </tr></thead><tbody>`;
    items.forEach(item => {
        if (item.tipo === 'sn') {
            html += radioSN(prefix + '_' + item.key, item.label);
        } else {
            html += radioBM(prefix + '_' + item.key, item.label);
        }
    });
    html += `</tbody></table>`;
    return html;
}

function selectOpciones(name, label, opciones) {
    let html = `<div>
        <label class="block font-semibold text-gray-700 mb-1 text-xs">${label}</label>
        <select name="${name}" class="w-full border rounded px-2 py-1.5 text-xs bg-white">
            <option value="">Seleccione...</option>`;
    opciones.forEach(op => {
        html += `<option value="${op}">${op}</option>`;
    });
    html += `</select></div>`;
    return html;
}

function checkItem(label) {
    return `<label class="flex items-center gap-2"><input type="checkbox" class="text-blue-600"><span>${label}</span></label>`;
}

function seccionCard(numero, titulo, contenido) {
    return `<div class="bg-white rounded-lg shadow-md">
        <div class="bg-gray-800 text-white px-6 py-3 rounded-t-lg flex items-center space-x-3">
            <span class="bg-white text-gray-800 font-bold rounded-full w-7 h-7 flex items-center justify-center text-sm">${numero}</span>
            <h2 class="text-lg font-bold">${titulo}</h2>
        </div>
        <div class="p-6 space-y-4 text-sm">${contenido}</div>
    </div>`;
}

function imgSection(id, label) {
    return `<div class="border-t border-gray-200 pt-4 mt-2">
        <label class="block font-semibold text-gray-700 mb-2 text-sm">Imágenes - ${label}</label>
        <div class="space-y-2">
            <div id="preview-${id}" class="min-h-[120px] border-2 border-dashed border-gray-300 rounded text-xs text-gray-500 bg-white/40 relative overflow-hidden">
                <span id="preview-${id}-text" class="absolute inset-0 flex items-center justify-center px-2 text-center pointer-events-none">Añadir fotos (máx. 6)</span>
                <div id="preview-${id}-grid" class="flex flex-wrap gap-3 p-3"></div>
            </div>
            <button type="button" class="px-3 py-1 text-xs border rounded bg-white hover:bg-gray-100"
                onclick="document.getElementById('file-${id}').click()">Subir imagen</button>
            <input id="file-${id}" name="img_${id}" type="file" accept="image/*" multiple class="hidden">
        </div>
    </div>`;
}

function resultadoYRecomendaciones(prefix, label) {
    return `<div>
        <label class="block font-semibold text-gray-700 mb-1">Resultado evaluación - ${label}</label>
        <textarea name="${prefix}_resultado" rows="2" class="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Conclusiones..."></textarea>
    </div>
    <div>
        <label class="block font-semibold text-gray-700 mb-1">Recomendaciones - ${label}</label>
        <textarea name="${prefix}_recomendaciones" rows="2" class="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Recomendaciones técnicas..."></textarea>
    </div>`;
}

function comentarios(prefix, label) {
    return `<div class="mt-2">
        <label class="block text-xs font-semibold text-gray-700 mb-1">Comentarios - ${label}</label>
        <textarea name="${prefix}_comentarios" class="w-full border rounded px-2 py-2 text-xs" rows="3" placeholder="Observaciones adicionales..."></textarea>
    </div>`;
}

function tablaMedidas(filas) {
    let html = `<div class="overflow-x-auto">
        <table class="table-auto text-xs border border-gray-200 rounded w-full">
            <thead class="bg-gray-100"><tr>
                <th class="px-2 py-1 border text-left">Parámetro</th>
                <th class="px-2 py-1 border text-center">X</th>
                <th class="px-2 py-1 border text-center">Y</th>
            </tr></thead><tbody>`;
    filas.forEach(f => {
        if (f.tipo === 'xy') html += medidaXY(f.prefix, f.label);
        else html += medidaSingle(f.prefix, f.label);
    });
    html += `</tbody></table></div>`;
    return html;
}

// ─── Checklist errores comunes (compartido cilindros) ────────

/** Genera un checklist dinámico: items predefinidos + botón para agregar nuevos */
function checklistDinamico(id, titulo, grupos) {
    let html = `<div class="border-t border-gray-200 pt-3 mt-2">
        <h3 class="font-semibold text-gray-800 text-base mb-3">${titulo}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">`;

    grupos.forEach((grupo, gi) => {
        html += `<div class="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1">
            <h4 class="font-semibold text-gray-700 mb-1 text-[11px] tracking-wide uppercase">${grupo.nombre}</h4>
            <div class="space-y-1 checklist-items" data-checklist="${id}_g${gi}">`;
        grupo.items.forEach(item => {
            html += checkItem(item);
        });
        html += `</div>
            <div class="flex items-center gap-1 mt-2">
                <input type="text" placeholder="Agregar hallazgo..." class="flex-1 border rounded px-2 py-1 text-[11px] checklist-new-input" data-target="${id}_g${gi}">
                <button type="button" onclick="agregarCheckItem(this)" class="px-2 py-1 text-[11px] bg-gray-800 text-white rounded hover:bg-black">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>`;
    });

    html += `</div></div>`;
    return html;
}

function checklistCilindro(prefix) {
    return checklistDinamico(prefix + '_cil', 'Check list - Cilindro', [
        { nombre: 'Cilindro Interior', items: [
            'Presenta rayaduras axiales en interior',
            'Presenta rayaduras radiales en interior',
            'Diámetro interior presenta deformación',
            'Medida interna fuera de tolerancia',
            'Diámetro interior muestra desgaste',
            'Diámetro de sellado muestra desgaste',
        ]},
        { nombre: 'Cilindro Exterior', items: [
            'Presenta golpes en el exterior del cilindro',
            'Presenta desgaste en exterior del cilindro',
            'Presenta deformación en exterior de cilindro',
            'Presenta depósitos de soldadura ajenos al diseño original',
        ]},
    ]) + comentarios(prefix + '_cil', 'Cilindro');
}

function checklistVastago(prefix) {
    return checklistDinamico(prefix + '_vas', 'Check list - Vástago y accesorios', [
        { nombre: 'Cojinete', items: [
            'Presenta corrosión en exterior de cojinete',
            'Presenta picaduras en exterior de cojinete',
            'Presenta desgaste en exterior de cojinete',
            'Cojinete llegó fisurado',
            'Cojinete llegó fracturado',
            'Llegó sin cojinete',
            'Cojinete presenta forma ovoide',
            'Llegó sin sellos limpiadores',
        ]},
        { nombre: 'Rótula', items: [
            'Presenta corrosión en interior de rótula',
            'Presenta picaduras en interior de rótula',
            'Presenta desgaste en interior de rótula',
            'Rótula llegó fracturada',
            'Rótula llegó fisurada',
            'Llegó sin rótula',
        ]},
        { nombre: 'Cáncamo', items: [
            'Presenta desgaste en alojamiento',
            'Presenta forma ovoide',
            'Presenta corrosión en alojamiento',
            'Presenta fisura en alojamiento',
        ]},
        { nombre: 'Vástago (barra)', items: [
            'Presenta desgaste en superficie cromada',
            'Presenta picaduras en superficie cromada',
            'Barra presenta flexión',
            'Presenta flexión de espiga',
            'Presenta poco espesor de cromo',
            'Presenta desprendimiento de capa de cromo',
            'Presenta excesiva capa de cromo',
            'Presenta daño en superficie roscada de espiga',
            'Presenta fisura en espiga',
            'Presenta fisura en junta',
            'Llegó sin cáncamo',
            'Llegó con cáncamo desprendido',
        ]},
    ]) + comentarios(prefix + '_vas', 'Vástago y accesorios');
}

function checklistTapa(prefix) {
    return checklistDinamico(prefix + '_tapa', 'Check list - Tapa', [
        { nombre: 'Tapa', items: [
            'Desgaste en alojamientos de sellos',
            'Corrosión en superficie exterior',
            'Corrosión en superficie interior',
            'Fisura o fractura en cuerpo de tapa',
            'Daño en roscas exteriores',
            'Ovalización en alojamiento de vástago',
        ]},
    ]) + comentarios(prefix + '_tapa', 'Tapa');
}

function checklistPiston(prefix) {
    return checklistDinamico(prefix + '_emb', 'Check list - Émbolo', [
        { nombre: 'Émbolo', items: [
            'Desgaste excesivo en diámetro exterior',
            'Desgaste en alojamientos de sellos',
            'Corrosión en superficie del émbolo',
            'Golpes o deformación en caras del émbolo',
            'Daño en roscas interiores',
            'Fisuras visibles en cuerpo del émbolo',
        ]},
    ]) + comentarios(prefix + '_emb', 'Émbolo');
}


// ═══════════════════════════════════════════════════════════════
// TIPO 1 — CILINDRO HIDRÁULICO VÁSTAGO SIMPLE
// ═══════════════════════════════════════════════════════════════

/** Helper: sección vástago estándar con Flexión/Cromo y ojos (tipos 1,2,3,4,8) */
function vastagoBCD(p) {
    return `<div class="mt-2">
        <label class="block font-semibold text-gray-700 mb-1 text-xs">Diámetro Vástago (B, C, D)</label>
        <table class="table-auto text-xs border border-gray-200 rounded w-full">
            <thead class="bg-gray-100"><tr>
                <th class="px-2 py-1 border"></th><th class="px-2 py-1 border">X</th><th class="px-2 py-1 border">Y</th>
            </tr></thead><tbody>
                ${medidaXY(p + '_dvas_b', 'B')}
                ${medidaXY(p + '_dvas_c', 'C')}
                ${medidaXY(p + '_dvas_d', 'D')}
            </tbody>
        </table>
    </div>`;
}

function tablaFlexCromo(p) {
    return `<label class="block font-semibold text-gray-700 mb-2 text-xs">Flexión y Espesor de Cromo</label>
    <table class="table-auto text-xs border border-gray-200 rounded w-full">
        <thead class="bg-gray-100"><tr>
            <th class="px-2 py-1 border"></th><th class="px-2 py-1 border">B</th><th class="px-2 py-1 border">C</th><th class="px-2 py-1 border">D</th>
        </tr></thead><tbody>
            <tr><td class="border px-2 py-1 text-gray-700">Flexión</td>
                <td class="border px-1">${inp(p + '_flex_b')}</td>
                <td class="border px-1">${inp(p + '_flex_c')}</td>
                <td class="border px-1">${inp(p + '_flex_d')}</td></tr>
            <tr><td class="border px-2 py-1 text-gray-700">Esp. Cromo</td>
                <td class="border px-1">${inp(p + '_cromo_b')}</td>
                <td class="border px-1">${inp(p + '_cromo_c')}</td>
                <td class="border px-1">${inp(p + '_cromo_d')}</td></tr>
        </tbody>
    </table>`;
}

function renderTipo1() {
    const botella = seccionCard(2, 'Cilindro (Botella)', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Cilindro</label>
            ${inpText('ref_cilindro', '', true)}`,
            `${medidaA1A4('t1_cil')}
            ${tablaMedidas([
                { prefix: 't1_cil_dsal', label: 'Diámetro de Salida (B)', tipo: 'xy' },
                { prefix: 't1_cil_dext', label: 'Diámetro Exterior (C)', tipo: 'xy' },
                { prefix: 't1_cil_lbru', label: 'Longitud Bruñido (D)', tipo: 'single' },
                { prefix: 't1_cil_ltot', label: 'Longitud Total (E)', tipo: 'single' },
            ])}
            <div class="mt-3 space-y-2">
                ${selectOpciones('t1_cil_tipo_cancamo', 'Tipo de cáncamo', ['Convencional', 'Cóncavo'])}
            </div>
            ${tablaMedidas([
                { prefix: 't1_cil_dojo', label: 'Diámetro Ojo (F)', tipo: 'xy' },
            ])}
            ${selectOpciones('t1_cil_elem_sujecion', 'Elemento de sujeción', ['Cojinete', 'Rótula', 'Pin directo'])}
            ${tablaMedidas([
                { prefix: 't1_cil_dint_coj', label: 'Diám. Int. elem. sujeción (G)', tipo: 'xy' },
                { prefix: 't1_cil_ancho_ojo', label: 'Ancho de Ojo', tipo: 'single' },
            ])}`,
            'Cilindro (A, B, C, D, E, F, G)',
            tablaChecks('t1_cil', [
                { key: 'tomas', label: 'Tomas' },
                { key: 'roscada', label: 'Est. de sup. Roscada' },
                { key: 'bocina1', label: 'Bocina STOP 1' },
                { key: 'bocina2', label: 'Bocina STOP 2' },
                { key: 'estado_cancamo', label: 'Estado de cáncamo' },
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
            ])
        )}
        ${checklistCilindro('t1')}
        ${resultadoYRecomendaciones('t1_cil', 'Cilindro')}
        ${imgSection('t1-cilindro', 'Cilindro')}
    `);

    const vastago = seccionCard(3, 'Vástago', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Vástago</label>
            ${inpText('ref_vastago', '', true)}`,
            `${tablaMedidas([{ prefix: 't1_vas_desp', label: 'Diámetro Espiga (A)', tipo: 'xy' }])}
            ${vastagoBCD('t1_vas')}
            ${tablaMedidas([
                { prefix: 't1_vas_lcro', label: 'Longitud Cromo (E)', tipo: 'single' },
                { prefix: 't1_vas_ltot', label: 'Longitud Total (F)', tipo: 'single' },
                { prefix: 't1_vas_lesp', label: 'Longitud de Espiga (G)', tipo: 'single' },
            ])}
            ${selectOpciones('t1_vas_tipo_cancamo', 'Tipo de cáncamo', ['Convencional', 'Cóncavo'])}
            ${tablaMedidas([{ prefix: 't1_vas_dext_ojo', label: 'Diám. Ext. Ojo (H)', tipo: 'xy' }])}
            ${selectOpciones('t1_vas_elem_sujecion', 'Elemento de sujeción', ['Cojinete', 'Rótula', 'Pin directo'])}
            ${tablaMedidas([
                { prefix: 't1_vas_dint_ojo', label: 'Diám. Int. Ojo (I)', tipo: 'xy' },
                { prefix: 't1_vas_dint_coj', label: 'Diám. Int. elem. sujeción (J)', tipo: 'xy' },
                { prefix: 't1_vas_ancho_ojo', label: 'Ancho de Ojo', tipo: 'single' },
            ])}`,
            'Vástago (A–J)',
            `${tablaFlexCromo('t1_vas')}
            <div class="mt-4">
                ${tablaChecks('t1_vas', [
                    { key: 'estado_cancamo', label: 'Estado de cáncamo' },
                    { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
                    { key: 'sensor', label: 'Sensor', tipo: 'sn' },
                ])}
            </div>`
        )}
        ${checklistVastago('t1')}
        ${resultadoYRecomendaciones('t1_vas', 'Vástago')}
        ${imgSection('t1-vastago', 'Vástago')}
    `);

    const tapa = seccionCard(4, 'Tapa', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Tapa</label>
            ${inpText('ref_tapa', '', true)}`,
            `${tablaMedidas([
                { prefix: 't1_tapa_dext', label: 'Diámetro Exterior (A)', tipo: 'single' },
                { prefix: 't1_tapa_dint', label: 'Diámetro Interior (B)', tipo: 'single' },
                { prefix: 't1_tapa_dsell', label: 'Diámetro Sellado (C)', tipo: 'single' },
                { prefix: 't1_tapa_ltot', label: 'Longitud Total (D)', tipo: 'single' },
            ])}`,
            'Tapa (A, B, C, D)',
            tablaChecks('t1_tapa', [
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
                { key: 'ext_roscado', label: 'Exterior roscado', tipo: 'sn' },
                { key: 'est_roscada', label: 'Est. de sup. Roscada' },
            ])
        )}
        ${checklistTapa('t1')}
        ${resultadoYRecomendaciones('t1_tapa', 'Tapa')}
        ${imgSection('t1-tapa', 'Tapa')}
    `);

    const embolo = seccionCard(5, 'Émbolo', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Émbolo</label>
            ${inpText('ref_embolo', '', true)}`,
            `${tablaMedidas([
                { prefix: 't1_emb_dext', label: 'Diámetro Exterior (A)', tipo: 'single' },
                { prefix: 't1_emb_dint', label: 'Diámetro Interior (B)', tipo: 'single' },
                { prefix: 't1_emb_ltot', label: 'Longitud Total (D)', tipo: 'single' },
            ])}`,
            'Émbolo (A, B, D)',
            tablaChecks('t1_emb', [
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
                { key: 'int_roscado', label: 'Interior roscado', tipo: 'sn' },
                { key: 'est_roscada', label: 'Est. de sup. Roscada' },
            ])
        )}
        ${checklistPiston('t1')}
        ${resultadoYRecomendaciones('t1_emb', 'Émbolo')}
        ${imgSection('t1-embolo', 'Émbolo')}
    `);

    return botella + vastago + tapa + embolo;
}


// ═══════════════════════════════════════════════════════════════
// TIPO 2 — CILINDRO HIDRÁULICO PIVOTADO
// ═══════════════════════════════════════════════════════════════

function renderTipo2() {
    const botella = seccionCard(2, 'Cilindro (Botella)', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Cilindro</label>
            ${inpText('ref_cilindro', '', true)}`,
            `${medidaA1A4('t2_cil')}
            ${tablaMedidas([
                { prefix: 't2_cil_dsal', label: 'Diámetro de Salida (B)', tipo: 'xy' },
                { prefix: 't2_cil_dext', label: 'Diámetro Exterior (C)', tipo: 'xy' },
                { prefix: 't2_cil_lbru', label: 'Longitud Bruñido (D)', tipo: 'single' },
                { prefix: 't2_cil_ltot', label: 'Longitud Total (E)', tipo: 'single' },
            ])}
            <div class="mt-3">
                <label class="block font-semibold text-gray-700 mb-1 text-xs">Diám. Ext. de cojinete (G) — 2 medidas</label>
                <div class="grid grid-cols-2 gap-2">
                    <div><span class="text-[10px] text-gray-500">Medida 1</span>
                        <div class="flex gap-1">${inp('t2_cil_coj_g1_x', 'X')} ${inp('t2_cil_coj_g1_y', 'Y')}</div>
                    </div>
                    <div><span class="text-[10px] text-gray-500">Medida 2</span>
                        <div class="flex gap-1">${inp('t2_cil_coj_g2_x', 'X')} ${inp('t2_cil_coj_g2_y', 'Y')}</div>
                    </div>
                </div>
            </div>
            <div class="mt-2">
                <label class="block font-semibold text-gray-700 mb-1 text-xs">Diám. Ext. de pivotante — 2 medidas</label>
                <div class="grid grid-cols-2 gap-2">
                    <div><span class="text-[10px] text-gray-500">Medida 1</span>
                        <div class="flex gap-1">${inp('t2_cil_piv1_x', 'X')} ${inp('t2_cil_piv1_y', 'Y')}</div>
                    </div>
                    <div><span class="text-[10px] text-gray-500">Medida 2</span>
                        <div class="flex gap-1">${inp('t2_cil_piv2_x', 'X')} ${inp('t2_cil_piv2_y', 'Y')}</div>
                    </div>
                </div>
            </div>
            ${tablaMedidas([
                { prefix: 't2_cil_lpiv', label: 'Longitud de pivotante', tipo: 'single' },
            ])}`,
            'Cilindro (A, B, C, D, E, G)',
            tablaChecks('t2_cil', [
                { key: 'tomas', label: 'Tomas' },
                { key: 'roscada', label: 'Est. de sup. Roscada' },
                { key: 'trunnion', label: 'Estado de trunnion' },
                { key: 'estanqueidad', label: 'Pasa prueba de estanqueidad', tipo: 'sn' },
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
            ])
        )}
        ${checklistCilindro('t2')}
        ${resultadoYRecomendaciones('t2_cil', 'Cilindro')}
        ${imgSection('t2-cilindro', 'Cilindro')}
    `);

    // Vástago igual al tipo 1
    const vastago = seccionCard(3, 'Vástago', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Vástago</label>
            ${inpText('ref_vastago', '', true)}`,
            `${tablaMedidas([{ prefix: 't2_vas_desp', label: 'Diámetro Espiga (A)', tipo: 'xy' }])}
            ${vastagoBCD('t2_vas')}
            ${tablaMedidas([
                { prefix: 't2_vas_lcro', label: 'Longitud Cromo (E)', tipo: 'single' },
                { prefix: 't2_vas_ltot', label: 'Longitud Total (F)', tipo: 'single' },
                { prefix: 't2_vas_lesp', label: 'Longitud de Espiga (G)', tipo: 'single' },
            ])}
            ${selectOpciones('t2_vas_tipo_cancamo', 'Tipo de cáncamo', ['Convencional', 'Cóncavo'])}
            ${tablaMedidas([{ prefix: 't2_vas_dext_ojo', label: 'Diám. Ext. Ojo (H)', tipo: 'xy' }])}
            ${selectOpciones('t2_vas_elem_sujecion', 'Elemento de sujeción', ['Cojinete', 'Rótula', 'Pin directo'])}
            ${tablaMedidas([
                { prefix: 't2_vas_dint_ojo', label: 'Diám. Int. Ojo (I)', tipo: 'xy' },
                { prefix: 't2_vas_dint_coj', label: 'Diám. Int. elem. sujeción (J)', tipo: 'xy' },
                { prefix: 't2_vas_ancho_ojo', label: 'Ancho de Ojo', tipo: 'single' },
            ])}`,
            'Vástago (A–J)',
            `${tablaFlexCromo('t2_vas')}
            <div class="mt-4">
                ${tablaChecks('t2_vas', [
                    { key: 'estado_cancamo', label: 'Estado de cáncamo' },
                    { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
                    { key: 'sensor', label: 'Sensor', tipo: 'sn' },
                ])}
            </div>`
        )}
        ${checklistVastago('t2')}
        ${resultadoYRecomendaciones('t2_vas', 'Vástago')}
        ${imgSection('t2-vastago', 'Vástago')}
    `);

    const tapa = seccionCard(4, 'Tapa', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Tapa</label>
            ${inpText('ref_tapa', '', true)}`,
            `${tablaMedidas([
                { prefix: 't2_tapa_dext', label: 'Diámetro Exterior (A)', tipo: 'single' },
                { prefix: 't2_tapa_dint', label: 'Diámetro Interior (B)', tipo: 'single' },
                { prefix: 't2_tapa_dsell', label: 'Diámetro Sellado (C)', tipo: 'single' },
                { prefix: 't2_tapa_ltot', label: 'Longitud Total (D)', tipo: 'single' },
            ])}`,
            'Tapa (A, B, C, D)',
            tablaChecks('t2_tapa', [
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
                { key: 'ext_roscado', label: 'Exterior roscado', tipo: 'sn' },
            ])
        )}
        ${checklistTapa('t2')}
        ${resultadoYRecomendaciones('t2_tapa', 'Tapa')}
        ${imgSection('t2-tapa', 'Tapa')}
    `);

    const embolo = seccionCard(5, 'Émbolo', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Émbolo</label>
            ${inpText('ref_embolo', '', true)}`,
            `${tablaMedidas([
                { prefix: 't2_emb_dext', label: 'Diámetro Exterior (A)', tipo: 'single' },
                { prefix: 't2_emb_dint', label: 'Diámetro Interior (B)', tipo: 'single' },
                { prefix: 't2_emb_ltot', label: 'Longitud Total (D)', tipo: 'single' },
            ])}`,
            'Émbolo (A, B, D)',
            tablaChecks('t2_emb', [
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
                { key: 'int_roscado', label: 'Interior roscado', tipo: 'sn' },
            ])
        )}
        ${checklistPiston('t2')}
        ${resultadoYRecomendaciones('t2_emb', 'Émbolo')}
        ${imgSection('t2-embolo', 'Émbolo')}
    `);

    return botella + vastago + tapa + embolo;
}


// ═══════════════════════════════════════════════════════════════
// TIPO 3 — CILINDRO HIDRÁULICO DE PISTÓN DE DOBLE VÁSTAGO
// ═══════════════════════════════════════════════════════════════

function renderTipo3() {
    const botella = seccionCard(2, 'Cilindro (Botella)', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Cilindro</label>
            ${inpText('ref_cilindro', '', true)}`,
            `${medidaA1A4('t3_cil')}
            ${tablaMedidas([
                { prefix: 't3_cil_dsal', label: 'Diámetro de Salida (B)', tipo: 'xy' },
                { prefix: 't3_cil_dext', label: 'Diámetro Exterior (C)', tipo: 'xy' },
                { prefix: 't3_cil_lbru', label: 'Longitud Bruñido (D)', tipo: 'single' },
                { prefix: 't3_cil_ltot', label: 'Longitud Total (E)', tipo: 'single' },
            ])}`,
            'Cilindro (A, B, C, D, E)',
            tablaChecks('t3_cil', [
                { key: 'tomas', label: 'Tomas' },
                { key: 'roscada', label: 'Est. de sup. Roscada' },
                { key: 'sop_sujecion', label: 'Estado de soporte de sujeción' },
                { key: 'estanqueidad', label: 'Pasa prueba de estanqueidad', tipo: 'sn' },
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
            ])
        )}
        ${checklistCilindro('t3')}
        ${resultadoYRecomendaciones('t3_cil', 'Cilindro')}
        ${imgSection('t3-cilindro', 'Cilindro')}
    `);

    // Vástago — cáncamo: Convencional / N/A
    const vastago = seccionCard(3, 'Vástago', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Vástago</label>
            ${inpText('ref_vastago', '', true)}`,
            `${tablaMedidas([{ prefix: 't3_vas_desp', label: 'Diámetro Espiga (A)', tipo: 'xy' }])}
            ${vastagoBCD('t3_vas')}
            ${tablaMedidas([
                { prefix: 't3_vas_lcro', label: 'Longitud Cromo (E)', tipo: 'single' },
                { prefix: 't3_vas_ltot', label: 'Longitud Total (F)', tipo: 'single' },
                { prefix: 't3_vas_lesp', label: 'Longitud de Espiga (G)', tipo: 'single' },
            ])}
            ${selectOpciones('t3_vas_tipo_cancamo', 'Tipo de cáncamo', ['Convencional', 'N/A'])}
            ${tablaMedidas([{ prefix: 't3_vas_dext_ojo', label: 'Diám. Ext. Ojo (H)', tipo: 'xy' }])}
            ${selectOpciones('t3_vas_elem_sujecion', 'Elemento de sujeción', ['Cojinete', 'Rótula', 'Pin directo'])}
            ${tablaMedidas([
                { prefix: 't3_vas_dint_ojo', label: 'Diám. Int. Ojo (I)', tipo: 'xy' },
                { prefix: 't3_vas_dint_coj', label: 'Diám. Int. elem. sujeción (J)', tipo: 'xy' },
                { prefix: 't3_vas_ancho_ojo', label: 'Ancho de Ojo', tipo: 'single' },
            ])}`,
            'Vástago (A–J)',
            `${tablaFlexCromo('t3_vas')}
            <div class="mt-4">
                ${tablaChecks('t3_vas', [
                    { key: 'estado_cancamo', label: 'Estado de cáncamo' },
                    { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
                ])}
            </div>`
        )}
        ${checklistVastago('t3')}
        ${resultadoYRecomendaciones('t3_vas', 'Vástago')}
        ${imgSection('t3-vastago', 'Vástago')}
    `);

    // Tapa con medidas dobles (A1/A2, B1/B2, C1/C2, D1/D2)
    const tapa = seccionCard(4, 'Tapa', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Tapa</label>
            ${inpText('ref_tapa', '', true)}`,
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Medidas dobles (Tapa 1 / Tapa 2)</label>
            <table class="table-auto text-xs border border-gray-200 rounded w-full">
                <thead class="bg-gray-100"><tr>
                    <th class="px-2 py-1 border"></th><th class="px-2 py-1 border">Tapa 1</th><th class="px-2 py-1 border">Tapa 2</th>
                </tr></thead><tbody>
                    <tr><td class="border px-2 py-1">Diám. Exterior (A)</td>
                        <td class="border px-1">${inp('t3_tapa_dext_1')}</td>
                        <td class="border px-1">${inp('t3_tapa_dext_2')}</td></tr>
                    <tr><td class="border px-2 py-1">Diám. Interior (B)</td>
                        <td class="border px-1">${inp('t3_tapa_dint_1')}</td>
                        <td class="border px-1">${inp('t3_tapa_dint_2')}</td></tr>
                    <tr><td class="border px-2 py-1">Diám. Sellado (C)</td>
                        <td class="border px-1">${inp('t3_tapa_dsell_1')}</td>
                        <td class="border px-1">${inp('t3_tapa_dsell_2')}</td></tr>
                    <tr><td class="border px-2 py-1">Longitud Total (D)</td>
                        <td class="border px-1">${inp('t3_tapa_ltot_1')}</td>
                        <td class="border px-1">${inp('t3_tapa_ltot_2')}</td></tr>
                </tbody>
            </table>`,
            'Tapa (A, B, C, D)',
            tablaChecks('t3_tapa', [
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
                { key: 'ext_roscado', label: 'Exterior roscado', tipo: 'sn' },
            ])
        )}
        ${checklistTapa('t3')}
        ${resultadoYRecomendaciones('t3_tapa', 'Tapa')}
        ${imgSection('t3-tapa', 'Tapa')}
    `);

    const embolo = seccionCard(5, 'Émbolo', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Émbolo</label>
            ${inpText('ref_embolo', '', true)}`,
            `${tablaMedidas([
                { prefix: 't3_emb_dext', label: 'Diámetro Exterior (A)', tipo: 'single' },
                { prefix: 't3_emb_dint', label: 'Diámetro Interior (B)', tipo: 'single' },
                { prefix: 't3_emb_ltot', label: 'Longitud Total (D)', tipo: 'single' },
            ])}`,
            'Émbolo (A, B, D)',
            tablaChecks('t3_emb', [
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
                { key: 'int_roscado', label: 'Interior roscado', tipo: 'sn' },
            ])
        )}
        ${checklistPiston('t3')}
        ${resultadoYRecomendaciones('t3_emb', 'Émbolo')}
        ${imgSection('t3-embolo', 'Émbolo')}
    `);

    return botella + vastago + tapa + embolo;
}


// ═══════════════════════════════════════════════════════════════
// TIPO 4 — CILINDRO HIDRÁULICO TELESCÓPICO
// ═══════════════════════════════════════════════════════════════

/** Genera un Cuerpo Intermedio (camisa móvil) para el telescópico */
function generarCuerpoIntermedio(n) {
    const p = 't4_ci' + n;
    return seccionCard('CI' + n, `Cuerpo Intermedio ${n} (Camisa móvil)`, `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Cuerpo Intermedio ${n}</label>
            ${inpText('ref_cuerpo_int_' + n, '')}`,
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Diámetro Interior (3 puntos)</label>
            <table class="table-auto text-xs border border-gray-200 rounded w-full">
                <thead class="bg-gray-100"><tr>
                    <th class="px-2 py-1 border"></th><th class="px-2 py-1 border">X</th><th class="px-2 py-1 border">Y</th>
                </tr></thead><tbody>
                    ${medidaXY(p + '_dint_1', 'Punto 1')}
                    ${medidaXY(p + '_dint_2', 'Punto 2')}
                    ${medidaXY(p + '_dint_3', 'Punto 3')}
                </tbody>
            </table>
            <label class="block font-semibold text-gray-700 mb-1 mt-3 text-xs">Diámetro Exterior (3 puntos)</label>
            <table class="table-auto text-xs border border-gray-200 rounded w-full">
                <thead class="bg-gray-100"><tr>
                    <th class="px-2 py-1 border"></th><th class="px-2 py-1 border">X</th><th class="px-2 py-1 border">Y</th>
                </tr></thead><tbody>
                    ${medidaXY(p + '_dext_1', 'Punto 1')}
                    ${medidaXY(p + '_dext_2', 'Punto 2')}
                    ${medidaXY(p + '_dext_3', 'Punto 3')}
                </tbody>
            </table>
            ${tablaMedidas([
                { prefix: p + '_lcro', label: 'Longitud Cromo', tipo: 'single' },
                { prefix: p + '_lbru', label: 'Longitud Bruñido', tipo: 'single' },
                { prefix: p + '_ltot', label: 'Longitud Total', tipo: 'single' },
            ])}`,
            'Cuerpo Intermedio ' + n,
            `<label class="block font-semibold text-gray-700 mb-2 text-xs">Flexión y Esp. Cromo (3 puntos)</label>
            <table class="table-auto text-xs border border-gray-200 rounded w-full">
                <thead class="bg-gray-100"><tr>
                    <th class="px-2 py-1 border"></th><th class="px-2 py-1 border">1</th><th class="px-2 py-1 border">2</th><th class="px-2 py-1 border">3</th>
                </tr></thead><tbody>
                    <tr><td class="border px-2 py-1">Flexión</td>
                        <td class="border px-1">${inp(p + '_flex_1')}</td>
                        <td class="border px-1">${inp(p + '_flex_2')}</td>
                        <td class="border px-1">${inp(p + '_flex_3')}</td></tr>
                    <tr><td class="border px-2 py-1">Esp. Cromo</td>
                        <td class="border px-1">${inp(p + '_cromo_1')}</td>
                        <td class="border px-1">${inp(p + '_cromo_2')}</td>
                        <td class="border px-1">${inp(p + '_cromo_3')}</td></tr>
                </tbody>
            </table>
            <div class="mt-4">
                ${tablaChecks(p, [
                    { key: 'diam_sal_roscado', label: 'Diám. Salida Roscado', tipo: 'sn' },
                    { key: 'roscada', label: 'Est. de sup. Roscada' },
                    { key: 'ndt', label: 'Pasa NDT', tipo: 'sn' },
                ])}
            </div>`
        )}
        ${resultadoYRecomendaciones(p, 'Cuerpo Intermedio ' + n)}
        ${imgSection('t4-ci' + n, 'Cuerpo Intermedio ' + n)}
    `);
}

/** Genera una Tapa Roscada Secundaria para el telescópico */
function generarTapaRoscada(n) {
    const p = 't4_tr' + n;
    return seccionCard('TR' + n, `Tapa Roscada Secundaria ${n}`, `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Tapa Roscada ${n}</label>
            ${inpText('ref_tapa_roscada_' + n, '')}`,
            `${tablaMedidas([
                { prefix: p + '_dext', label: 'Diámetro Exterior (A)', tipo: 'single' },
                { prefix: p + '_dint', label: 'Diámetro Interior (B)', tipo: 'single' },
                { prefix: p + '_dsell', label: 'Diámetro Sellado (C)', tipo: 'single' },
                { prefix: p + '_ltot', label: 'Longitud Total (D)', tipo: 'single' },
            ])}`,
            'Tapa Roscada ' + n + ' (A, B, C, D)',
            tablaChecks(p, [
                { key: 'roscada', label: 'Est. de sup. Roscada' },
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
            ])
        )}
        ${checklistTapa(p)}
        ${resultadoYRecomendaciones(p, 'Tapa Roscada ' + n)}
        ${imgSection('t4-tr' + n, 'Tapa Roscada ' + n)}
    `);
}

function renderTipo4() {
    // Selector de etapas + contenedor dinámico
    const etapas = `<div class="bg-white rounded-lg shadow-md">
        <div class="bg-blue-800 text-white px-6 py-3 rounded-t-lg flex items-center space-x-3">
            <i class="fas fa-layer-group"></i>
            <h2 class="text-lg font-bold">Configuración de etapas</h2>
        </div>
        <div class="p-6 text-sm">
            <p class="text-xs text-gray-600 mb-3">Seleccione el número de etapas. Se generarán los cuerpos intermedios y tapas correspondientes.</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs mb-3">
                <div class="bg-gray-50 border rounded p-2"><strong>2 ETAPAS:</strong> 1 camisa fija + 1 camisa móvil + 1 vástago</div>
                <div class="bg-gray-50 border rounded p-2"><strong>3 ETAPAS:</strong> 1 camisa fija + 2 camisas móviles + 1 vástago</div>
                <div class="bg-gray-50 border rounded p-2"><strong>4 ETAPAS:</strong> 1 camisa fija + 3 camisas móviles + 1 vástago</div>
            </div>
            <div>
                <label class="block font-semibold text-gray-700 mb-1 text-xs">Número de etapas</label>
                <select id="t4-etapas-select" name="t4_num_etapas" class="w-full max-w-xs border rounded px-2 py-1.5 text-xs bg-white" onchange="actualizarEtapasTelescopico()">
                    <option value="2" selected>2 Etapas</option>
                    <option value="3">3 Etapas</option>
                    <option value="4">4 Etapas</option>
                </select>
            </div>
        </div>
    </div>`;

    const botella = seccionCard(2, 'Cilindro (Botella) — Camisa fija', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Cilindro</label>
            ${inpText('ref_cilindro', '', true)}`,
            `${medidaA1A4('t4_cil')}
            ${tablaMedidas([
                { prefix: 't4_cil_dsal', label: 'Diámetro de Salida (B)', tipo: 'xy' },
                { prefix: 't4_cil_dext', label: 'Diámetro Exterior (C)', tipo: 'xy' },
                { prefix: 't4_cil_lbru', label: 'Longitud Bruñido (D)', tipo: 'single' },
                { prefix: 't4_cil_ltot', label: 'Longitud Total (E)', tipo: 'single' },
            ])}
            <div class="mt-3 space-y-2">
                ${selectOpciones('t4_cil_tipo_anclaje', 'Tipo de anclaje', ['Con Cáncamo', 'Sin Cáncamo'])}
            </div>
            ${tablaMedidas([
                { prefix: 't4_cil_dojo', label: 'Diámetro Ojo (F)', tipo: 'xy' },
            ])}
            ${selectOpciones('t4_cil_elem_sujecion', 'Elemento de sujeción', ['Cojinete', 'Rótula', 'Pin directo'])}
            ${tablaMedidas([
                { prefix: 't4_cil_dint_coj', label: 'Diám. Int. elem. sujeción (G)', tipo: 'xy' },
                { prefix: 't4_cil_ancho_ojo', label: 'Ancho de Ojo', tipo: 'single' },
            ])}`,
            'Cilindro (A, B, C, D, E, F, G)',
            tablaChecks('t4_cil', [
                { key: 'tomas', label: 'Tomas' },
                { key: 'roscada', label: 'Est. de sup. Roscada' },
                { key: 'estado_cancamo', label: 'Estado de cáncamo' },
                { key: 'ndt', label: 'Pasa NDT', tipo: 'sn' },
            ])
        )}
        ${checklistCilindro('t4')}
        ${resultadoYRecomendaciones('t4_cil', 'Cilindro')}
        ${imgSection('t4-cilindro', 'Cilindro')}
    `);

    const vastago = seccionCard(3, 'Vástago', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Vástago</label>
            ${inpText('ref_vastago', '', true)}`,
            `${tablaMedidas([{ prefix: 't4_vas_desp', label: 'Diámetro Espiga (A)', tipo: 'xy' }])}
            ${vastagoBCD('t4_vas')}
            ${tablaMedidas([
                { prefix: 't4_vas_lcro', label: 'Longitud Cromo (E)', tipo: 'single' },
                { prefix: 't4_vas_ltot', label: 'Longitud Total (F)', tipo: 'single' },
                { prefix: 't4_vas_lesp', label: 'Longitud de Espiga (G)', tipo: 'single' },
                { prefix: 't4_vas_dext_ojo', label: 'Diám. Ext. Ojo (H)', tipo: 'xy' },
            ])}
            ${selectOpciones('t4_vas_elem_sujecion', 'Elemento de sujeción', ['Cojinete', 'Rótula', 'Pin directo'])}
            ${tablaMedidas([
                { prefix: 't4_vas_dint_ojo', label: 'Diám. Int. Ojo (I)', tipo: 'xy' },
                { prefix: 't4_vas_dint_coj', label: 'Diám. Int. elem. sujeción (J)', tipo: 'xy' },
                { prefix: 't4_vas_ancho_ojo', label: 'Ancho de Ojo', tipo: 'single' },
            ])}`,
            'Vástago (A–J)',
            `${tablaFlexCromo('t4_vas')}
            <div class="mt-4">
                ${tablaChecks('t4_vas', [
                    { key: 'estado_cancamo', label: 'Estado de cáncamo' },
                    { key: 'ndt', label: 'Pasa NDT', tipo: 'sn' },
                ])}
            </div>`
        )}
        ${checklistVastago('t4')}
        ${resultadoYRecomendaciones('t4_vas', 'Vástago')}
        ${imgSection('t4-vastago', 'Vástago')}
    `);

    // Contenedor donde se inyectan dinámicamente los cuerpos intermedios + tapas roscadas
    const dynamicStages = `<div id="t4-dynamic-stages"></div>`;

    // Tapa Posterior de Sujeción (siempre 1, campos según Excel rows 58-63)
    const tapaPosterior = seccionCard('TP', 'Tapa Posterior de Sujeción', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Tapa Posterior</label>
            ${inpText('ref_tapa_posterior', '')}`,
            `${tablaMedidas([
                { prefix: 't4_tp_dsell', label: 'Diám. Sellado', tipo: 'single' },
                { prefix: 't4_tp_dint_ojo', label: 'Diám. Int. Ojo', tipo: 'xy' },
                { prefix: 't4_tp_dint_rotula', label: 'Diám. Int. Rótula', tipo: 'single' },
                { prefix: 't4_tp_ancho_ojo', label: 'Ancho de Ojo', tipo: 'single' },
            ])}`,
            'Tapa Posterior',
            tablaChecks('t4_tp', [
                { key: 'soldadura', label: 'Est. de soldadura' },
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
            ])
        )}
        ${resultadoYRecomendaciones('t4_tp', 'Tapa Posterior')}
        ${imgSection('t4-tapa-posterior', 'Tapa Posterior')}
    `);

    // Tapa principal (Excel rows 68-73)
    const tapa = seccionCard('T', 'Tapa', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Tapa</label>
            ${inpText('ref_tapa', '', true)}`,
            `${tablaMedidas([
                { prefix: 't4_tapa_dext', label: 'Diámetro Exterior (A)', tipo: 'single' },
                { prefix: 't4_tapa_dint', label: 'Diámetro Interior (B)', tipo: 'single' },
                { prefix: 't4_tapa_dsell', label: 'Diámetro Sellado (C)', tipo: 'single' },
                { prefix: 't4_tapa_ltot', label: 'Longitud Total (D)', tipo: 'single' },
            ])}`,
            'Tapa (A, B, C, D)',
            tablaChecks('t4_tapa', [
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
                { key: 'ext_roscado', label: 'Exterior roscado', tipo: 'sn' },
                { key: 'est_roscada', label: 'Est. de sup. Roscada' },
            ])
        )}
        ${checklistTapa('t4_tapa')}
        ${resultadoYRecomendaciones('t4_tapa', 'Tapa')}
        ${imgSection('t4-tapa', 'Tapa')}
    `);

    // Émbolo (Excel rows 76-80)
    const embolo = seccionCard('E', 'Émbolo', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Émbolo</label>
            ${inpText('ref_embolo', '', true)}`,
            `${tablaMedidas([
                { prefix: 't4_emb_dext', label: 'Diámetro Exterior (A)', tipo: 'single' },
                { prefix: 't4_emb_dint', label: 'Diámetro Interior (B)', tipo: 'single' },
                { prefix: 't4_emb_ltot', label: 'Longitud Total (D)', tipo: 'single' },
            ])}`,
            'Émbolo (A, B, D)',
            tablaChecks('t4_emb', [
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
                { key: 'int_roscado', label: 'Interior roscado', tipo: 'sn' },
                { key: 'est_roscada', label: 'Est. de sup. Roscada' },
            ])
        )}
        ${checklistPiston('t4_emb')}
        ${resultadoYRecomendaciones('t4_emb', 'Émbolo')}
        ${imgSection('t4-embolo', 'Émbolo')}
    `);

    return etapas + botella + vastago + dynamicStages + tapaPosterior + tapa + embolo;
}

/** Actualiza las secciones dinámicas de etapas (cuerpos intermedios + tapas roscadas) */
function actualizarEtapasTelescopico() {
    const sel = document.getElementById('t4-etapas-select');
    const container = document.getElementById('t4-dynamic-stages');
    if (!sel || !container) return;

    const numEtapas = parseInt(sel.value) || 2;
    // Cantidad de camisas móviles = etapas - 1
    const numCuerpos = numEtapas - 1;

    let html = '';
    for (let i = 1; i <= numCuerpos; i++) {
        html += generarCuerpoIntermedio(i);
        html += generarTapaRoscada(i);
    }

    container.innerHTML = `<div class="space-y-6">${html}</div>`;

    // Re-inicializar imágenes en las secciones nuevas
    container.querySelectorAll('input[type="file"]').forEach(input => {
        const id = input.id;
        if (!id) return;
        const baseId = id.replace('file-', '');
        if (typeof initImageUploadMulti === 'function') {
            initImageUploadMulti(id, 'preview-' + baseId + '-grid', 'preview-' + baseId + '-text', 6);
        }
    });

    // Aplicar unidades
    if (typeof window.actualizarUnidadesMedicion === 'function') {
        window.actualizarUnidadesMedicion();
    }
}


// ═══════════════════════════════════════════════════════════════
// TIPO 5 — ACUMULADOR DE ÉMBOLO
// ═══════════════════════════════════════════════════════════════

function renderTipo5() {
    const botella = seccionCard(2, 'Cilindro (Botella)', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Cilindro</label>
            ${inpText('ref_cilindro', '', true)}`,
            `${medidaA1A4('t5_cil')}
            ${tablaMedidas([
                { prefix: 't5_cil_dsal', label: 'Diámetro de Salida (B)', tipo: 'xy' },
                { prefix: 't5_cil_dext', label: 'Diámetro Exterior (C)', tipo: 'xy' },
                { prefix: 't5_cil_lbru', label: 'Longitud Bruñido (D)', tipo: 'single' },
                { prefix: 't5_cil_ltot', label: 'Longitud Total (E)', tipo: 'single' },
            ])}
            <div class="mt-3">
                <label class="block font-semibold text-gray-700 mb-1 text-xs">Volumen</label>
                <div class="flex items-center gap-2">
                    ${inp('t5_cil_volumen', 'GL')}
                    <span class="text-xs text-gray-500">GL</span>
                </div>
            </div>`,
            'Cilindro (A, B, C, D, E)',
            tablaChecks('t5_cil', [
                { key: 'tomas', label: 'Tomas' },
                { key: 'roscada', label: 'Est. de sup. Roscada' },
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
            ])
        )}
        ${checklistCilindro('t5')}
        ${resultadoYRecomendaciones('t5_cil', 'Cilindro')}
        ${imgSection('t5-cilindro', 'Cilindro')}
    `);

    const tapa = seccionCard(3, 'Tapa', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Tapa</label>
            ${inpText('ref_tapa', '', true)}`,
            `${tablaMedidas([
                { prefix: 't5_tapa_dext', label: 'Diámetro Exterior (A)', tipo: 'single' },
                { prefix: 't5_tapa_dsell', label: 'Diámetro Sellado (B)', tipo: 'single' },
                { prefix: 't5_tapa_ltot', label: 'Longitud Total (C)', tipo: 'single' },
            ])}`,
            'Tapa (A, B, C)',
            tablaChecks('t5_tapa', [
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
                { key: 'ext_roscado', label: 'Exterior roscado', tipo: 'sn' },
                { key: 'est_roscada', label: 'Est. de sup. Roscada' },
            ])
        )}
        ${checklistTapa('t5')}
        ${resultadoYRecomendaciones('t5_tapa', 'Tapa')}
        ${imgSection('t5-tapa', 'Tapa')}
    `);

    const embolo = seccionCard(4, 'Émbolo', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Émbolo</label>
            ${inpText('ref_embolo', '', true)}`,
            `${tablaMedidas([
                { prefix: 't5_emb_dext', label: 'Diámetro Exterior (A)', tipo: 'single' },
                { prefix: 't5_emb_ltot', label: 'Longitud Total (B)', tipo: 'single' },
            ])}`,
            'Émbolo (A, B)',
            tablaChecks('t5_emb', [
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
            ])
        )}
        ${checklistPiston('t5')}
        ${resultadoYRecomendaciones('t5_emb', 'Émbolo')}
        ${imgSection('t5-embolo', 'Émbolo')}
    `);

    return botella + tapa + embolo;
}


// ═══════════════════════════════════════════════════════════════
// TIPO 6 — ACUMULADOR DE VEJIGA
// ═══════════════════════════════════════════════════════════════

function renderTipo6() {
    const botella = seccionCard(2, 'Cilindro (Botella)', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Cilindro</label>
            ${inpText('ref_cilindro', '', true)}`,
            `${tablaMedidas([
                { prefix: 't6_cil_dsal1', label: 'Diámetro de Salida 1 (A)', tipo: 'xy' },
                { prefix: 't6_cil_dsal2', label: 'Diámetro de Salida 2 (B)', tipo: 'xy' },
                { prefix: 't6_cil_dext', label: 'Diámetro Exterior (C)', tipo: 'xy' },
                { prefix: 't6_cil_ltot', label: 'Longitud Total (D)', tipo: 'single' },
            ])}
            <div class="mt-3">
                <label class="block font-semibold text-gray-700 mb-1 text-xs">Volumen</label>
                <div class="flex items-center gap-2">
                    ${inp('t6_cil_volumen', 'E')}
                    <span class="text-xs text-gray-500">GL</span>
                </div>
            </div>`,
            'Acumulador de Vejiga (A, B, C, D, E)',
            tablaChecks('t6_cil', [
                { key: 'valv_muelle', label: 'Válv. Hid. De Muelle' },
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
            ])
        )}
        ${resultadoYRecomendaciones('t6_cil', 'Acumulador de Vejiga')}
        ${imgSection('t6-cilindro', 'Acumulador')}
    `);

    return botella;
}


// ═══════════════════════════════════════════════════════════════
// TIPO 7 — RUEDA DELANTERA
// ═══════════════════════════════════════════════════════════════

function renderTipo7() {
    const mediciones = seccionCard(2, 'Mediciones HUB / SPINDLE', `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p class="font-semibold text-gray-700 mb-2">HUB — Diámetros de alojamientos de pista de rodamiento</p>
                <div class="mb-3">
                    <label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. HUB</label>
                    ${inpText('ref_hub', '', true)}
                </div>
                <table class="w-full text-[11px] border border-gray-200">
                    <thead class="bg-gray-100"><tr>
                        <th class="border px-1 py-0.5 text-left"></th>
                        <th class="border px-1 py-0.5 text-center">X</th>
                        <th class="border px-1 py-0.5 text-center">Y</th>
                    </tr></thead><tbody>
                        ${medidaXY('t7_hub_a', 'A — Rodamiento mayor')}
                        ${medidaXY('t7_hub_b', 'B — Rodamiento menor')}
                    </tbody>
                </table>
            </div>
            <div class="flex items-start justify-center pt-2">
                ${imgReferencia('Rueda delantera')}
            </div>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p class="font-semibold text-gray-700 mb-2">SPINDLE — Diámetros de asiento de rodamiento</p>
                <div class="mb-3">
                    <label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. SPINDLE</label>
                    ${inpText('ref_spindle', '', true)}
                </div>
                <table class="w-full text-[11px] border border-gray-200">
                    <thead class="bg-gray-100"><tr>
                        <th class="border px-1 py-0.5 text-left"></th>
                        <th class="border px-1 py-0.5 text-center">X</th>
                        <th class="border px-1 py-0.5 text-center">Y</th>
                    </tr></thead><tbody>
                        ${medidaXY('t7_spindle_a', 'A — Rodamiento mayor')}
                        ${medidaXY('t7_spindle_b', 'B — Rodamiento menor')}
                    </tbody>
                </table>
            </div>
        </div>
        ${imgSection('t7-mediciones', 'Hub / Spindle')}
    `);

    // Checklist RESULTADOS (dinámico)
    const resultados = seccionCard(3, 'Check list RESULTADOS', `
        ${checklistDinamico('t7_res', 'Resultados de la evaluación', [
            { nombre: 'Spindle', items: [
                'Presenta picaduras en asiento de rodamiento',
                'Presenta rayaduras en asiento de rodamiento',
                'Daños en alojamientos roscados',
                'Presenta daños en alojamiento cónico',
                'Presenta corrosión en alojamiento cónico',
                'Presenta picaduras en alojamiento cónico',
                'Alojamientos roscados de pernos de sujeción de bastidor presentan daño',
            ]},
            { nombre: 'Hub', items: [
                'Alojamientos de pistas de rodamientos cónicos presentan desgaste',
                'Alojamientos de pistas de rodamientos cónicos presentan rayaduras',
                'Pistas de rodamientos cónicos presentan desgaste',
                'Pistas de rodamientos cónicos presentan rayaduras',
                'Pernos de sujeción de rueda presentan desgaste',
                'Pernos de sujeción de rueda presentan fatiga',
                'Pernos de sujeción de rueda presentan hilos dañados',
                'Pernos de sujeción de rueda presentan fractura',
                'Presenta corrosión en portasellos',
                'Sello Duo Cone presenta desgaste',
                'Engranaje de sensor presenta corrosión',
                'Lainas de separación llegaron dañadas',
                'Revisión de engranaje interior',
                'Revisión de pernos de sujeción de engranaje interior (32 UND)',
            ]},
            { nombre: 'Conjunto de Freno', items: [
                'Pistón de freno presenta rayaduras en alojamientos de sellos',
                'Presenta desgaste en resortes de retracción',
                'Pernos de sujeción llegaron elongados',
                'Sellos presentan desgaste',
            ]},
            { nombre: 'Caja de Freno', items: [
                'Presenta rayas en asientos de sellos',
                'Alojamientos roscados presentan contaminación',
            ]},
            { nombre: 'General', items: [
                'Discos de fricción presentan desgaste',
                'Discos de fricción presentan marcas de temperatura (recalentamiento)',
                'Placas separadoras presentan rayas circulares',
                'Placas separadoras presentan desgaste',
                'Placas separadoras presentan manchas de sobrecalentamiento',
                'Dumpers presentan desgaste y daños por temperatura (trabajo)',
            ]},
        ])}
        ${comentarios('t7_resultados', 'Resultados')}
    `);

    // Checklist RECOMENDACIONES (dinámico)
    const recomendaciones = seccionCard(4, 'Check list RECOMENDACIONES', `
        ${checklistDinamico('t7_rec', 'Recomendaciones', [
            { nombre: 'Spindle', items: [
                'Pulido de asientos de rodamientos',
                'Metalizado de asientos de rodamientos',
                'Cambio de rodamientos',
                'Rectificado de alojamientos roscados',
                'Realizar NDT',
                'Pulido de alojamiento cónico',
                'Rectificado de alojamientos roscados de sujeción de bastidor',
                'Realizar NDT en brazo de dirección',
            ]},
            { nombre: 'Hub', items: [
                'Cambio de pistas cónicas de rodamientos',
                'Realizar pulido de alojamientos de pistas',
                'Realizar metalizado de alojamientos de pistas',
                'Realizar cambio de Stud',
                'Repasar superficie roscada de Stud',
                'Cambio de lainas de engranaje de sensor',
                'Cambio de sello Duo Cone',
                'Realizar pulido de portasello',
                'Realizar pulido de engranaje sensor',
                'Realizar pulido de corona interior',
                'Realizar limpieza de pernos de sujeción de engranaje interior',
                'Realizar cambio de pernos de sujeción de engranaje interior',
                'Repasar alojamientos roscados de pernos de sujeción de engranaje interior',
                'Realizar cambio de engranaje',
            ]},
            { nombre: 'Conjunto de Freno', items: [
                'Realizar pulido de alojamientos de sellos',
                'Realizar cambio de sellos',
                'Realizar cambio de resortes',
                'Realizar cambio de pernos',
                'Realizar metalizado de pistón',
            ]},
            { nombre: 'Caja de Freno', items: [
                'Realizar pulido de asientos de sellos',
                'Repasar alojamientos roscados',
                'Realizar metalizado de asientos de sellos',
            ]},
            { nombre: 'General', items: [
                'Realizar cambio de discos de fricción (10) según NP Komatsu',
                'Realizar cambio de placas separadoras (9) según NP Komatsu',
                'Realizar cambio de dumpers (2) según NP Komatsu',
                'Realizar cambio de lainas según NP Komatsu',
            ]},
        ])}
        ${comentarios('t7_recomendaciones', 'Recomendaciones')}
    `);

    // Resultados por subsistema
    const resSubsistema = seccionCard(5, 'Resultados por subsistema', `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="space-y-2">
                ${resultadoYRecomendaciones('t7_spindle', 'SPINDLE')}
                ${resultadoYRecomendaciones('t7_hub', 'HUB')}
                ${resultadoYRecomendaciones('t7_conj_freno', 'CONJUNTO DE FRENO')}
            </div>
            <div class="space-y-2">
                ${resultadoYRecomendaciones('t7_caja_freno', 'CAJA DE FRENO')}
                ${resultadoYRecomendaciones('t7_general', 'GENERAL')}
            </div>
        </div>
        ${imgSection('t7-general', 'Rueda delantera')}
    `);

    return mediciones + resultados + recomendaciones + resSubsistema;
}


// ═══════════════════════════════════════════════════════════════
// TIPO 8 — SUSPENSIÓN DELANTERA
// ═══════════════════════════════════════════════════════════════

function renderTipo8() {
    const botella = seccionCard(2, 'Cilindro de Suspensión Delantera (Botella)', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Cilindro</label>
            ${inpText('ref_cilindro', '', true)}`,
            `${medidaA1A4('t8_cil')}
            ${tablaMedidas([
                { prefix: 't8_cil_dsal', label: 'Diámetro de Salida (B)', tipo: 'xy' },
                { prefix: 't8_cil_dext', label: 'Diámetro Exterior (C)', tipo: 'xy' },
                { prefix: 't8_cil_lbru', label: 'Longitud Bruñido (D)', tipo: 'single' },
                { prefix: 't8_cil_ltot', label: 'Longitud Total (E)', tipo: 'single' },
            ])}`,
            'Cilindro (A, B, C, D, E)',
            tablaChecks('t8_cil', [
                { key: 'cartelas', label: 'Est. De cartelas' },
                { key: 'roscada', label: 'Est. de sup. Roscada' },
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
            ])
        )}
        ${checklistCilindro('t8')}
        ${resultadoYRecomendaciones('t8_cil', 'Cilindro')}
        ${imgSection('t8-cilindro', 'Cilindro')}
    `);

    const vastago = seccionCard(3, 'Vástago', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Vástago</label>
            ${inpText('ref_vastago', '', true)}`,
            `${tablaMedidas([{ prefix: 't8_vas_desp', label: 'Diámetro Espiga (A)', tipo: 'xy' }])}
            ${vastagoBCD('t8_vas')}
            ${tablaMedidas([
                { prefix: 't8_vas_lcro', label: 'Longitud Cromo (E)', tipo: 'single' },
                { prefix: 't8_vas_ltot', label: 'Longitud Total (F)', tipo: 'single' },
                { prefix: 't8_vas_lesp', label: 'Longitud de Espiga (G)', tipo: 'single' },
            ])}`,
            'Vástago (A–G)',
            `${tablaFlexCromo('t8_vas')}
            <div class="mt-4">
                ${tablaChecks('t8_vas', [
                    { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
                ])}
            </div>`
        )}
        ${checklistVastago('t8')}
        ${resultadoYRecomendaciones('t8_vas', 'Vástago')}
        ${imgSection('t8-vastago', 'Vástago')}
    `);

    const tapa = seccionCard(4, 'Tapa', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Tapa</label>
            ${inpText('ref_tapa', '', true)}`,
            `${tablaMedidas([
                { prefix: 't8_tapa_dext', label: 'Diámetro Exterior (A)', tipo: 'single' },
                { prefix: 't8_tapa_dint', label: 'Diámetro Interior (B)', tipo: 'single' },
                { prefix: 't8_tapa_dsell', label: 'Diámetro Sellado (C)', tipo: 'single' },
                { prefix: 't8_tapa_ltot', label: 'Longitud Total (D)', tipo: 'single' },
            ])}`,
            'Tapa (A, B, C, D)',
            tablaChecks('t8_tapa', [
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
            ])
        )}
        ${checklistTapa('t8')}
        ${resultadoYRecomendaciones('t8_tapa', 'Tapa')}
        ${imgSection('t8-tapa', 'Tapa')}
    `);

    const embolo = seccionCard(5, 'Émbolo', `
        ${layoutSeccion(
            `<label class="block font-semibold text-gray-700 mb-1 text-xs">Ref. Émbolo</label>
            ${inpText('ref_embolo', '', true)}`,
            `${tablaMedidas([
                { prefix: 't8_emb_dext', label: 'Diámetro Exterior (A)', tipo: 'single' },
                { prefix: 't8_emb_dint', label: 'Diámetro Interior (B)', tipo: 'single' },
                { prefix: 't8_emb_ltot', label: 'Longitud Total (D)', tipo: 'single' },
            ])}`,
            'Émbolo (A, B, D)',
            tablaChecks('t8_emb', [
                { key: 'ndt', label: 'Pasa a NDT', tipo: 'sn' },
            ])
        )}
        ${checklistPiston('t8')}
        ${resultadoYRecomendaciones('t8_emb', 'Émbolo')}
        ${imgSection('t8-embolo', 'Émbolo')}
    `);

    return botella + vastago + tapa + embolo;
}


// ═══════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL — Renderizar formulario según tipo
// ═══════════════════════════════════════════════════════════════

const RENDER_MAP = {
    cil_vastago_simple: renderTipo1,
    cil_pivotado: renderTipo2,
    cil_doble_vastago: renderTipo3,
    cil_telescopico: renderTipo4,
    acum_embolo: renderTipo5,
    acum_vejiga: renderTipo6,
    rueda_delantera: renderTipo7,
    suspension_delantera: renderTipo8,
};

function renderEvaluacion(tipoValue) {
    const container = document.getElementById('dynamic-eval-content');
    if (!container) return;

    const renderFn = RENDER_MAP[tipoValue] || renderTipo1;
    container.innerHTML = `<div class="space-y-6">${renderFn()}</div>`;

    // Re-inicializar uploads de imágenes tras renderizar
    initDynamicImageUploads();

    // Aplicar unidades de medición (mm/in) a los nuevos inputs
    if (typeof window.actualizarUnidadesMedicion === 'function') {
        window.actualizarUnidadesMedicion();
    }

    // Si es telescópico, generar las etapas dinámicas
    if (tipoValue === 'cil_telescopico') {
        actualizarEtapasTelescopico();
    }
}

function initDynamicImageUploads() {
    // Buscar todos los file inputs generados dinámicamente y enlazar su preview
    document.querySelectorAll('#dynamic-eval-content input[type="file"]').forEach(input => {
        const id = input.id; // file-t1-cilindro, etc.
        if (!id) return;
        const baseId = id.replace('file-', '');
        const gridId = 'preview-' + baseId + '-grid';
        const textId = 'preview-' + baseId + '-text';

        if (typeof initImageUploadMulti === 'function') {
            initImageUploadMulti(id, gridId, textId, 6);
        }
    });
}
