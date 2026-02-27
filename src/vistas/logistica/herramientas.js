// Gestión de Herramientas y Equipos - JavaScript
let herramientas = [];
let prestamos = [];
let mantenimientos = [];
let editingId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadHerramientas();
    loadPrestamos();
    loadMantenimientos();
    
    // Set fecha actual en formularios
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('prest-fecha-inicio').value = today;
    
    // Formularios
    document.getElementById('form-herramienta').addEventListener('submit', submitHerramienta);
    document.getElementById('form-prestamo').addEventListener('submit', submitPrestamo);
    document.getElementById('form-mantenimiento').addEventListener('submit', submitMantenimiento);
});

// Switch tabs
function switchTab(tab) {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('border-cyan-600', 'text-cyan-600');
        btn.classList.add('border-transparent', 'text-gray-500');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    document.getElementById(`tab-${tab}`).classList.remove('border-transparent', 'text-gray-500');
    document.getElementById(`tab-${tab}`).classList.add('border-cyan-600', 'text-cyan-600');
    document.getElementById(`content-${tab}`).classList.remove('hidden');
}

// Load herramientas
async function loadHerramientas() {
    try {
        const response = await fetch('/api/herramientas');
        if (response.ok) {
            herramientas = await response.json();
        } else {
            herramientas = generateSampleHerramientas();
        }
        renderHerramientas();
        updateDashboard();
        fillHerramientasSelect();
    } catch (error) {
        console.error('Error:', error);
        herramientas = generateSampleHerramientas();
        renderHerramientas();
        updateDashboard();
        fillHerramientasSelect();
    }
}

// Generate sample data
function generateSampleHerramientas() {
    return [
        { id: 1, codigo: 'HERR-001', nombre: 'Taladro Eléctrico Bosch', categoria: 'electricas', marca: 'Bosch', modelo: 'GSB 13 RE', estado: 'disponible', ubicacion: 'Taller - Estante A1', fecha_adquisicion: '2023-01-15', proximo_mantenimiento: '2026-03-01' },
        { id: 2, codigo: 'HERR-002', nombre: 'Llave Inglesa 12"', categoria: 'manuales', marca: 'Stanley', modelo: 'ST90', estado: 'disponible', ubicacion: 'Taller - Caja 1', fecha_adquisicion: '2022-05-20', proximo_mantenimiento: '2026-06-01' },
        { id: 3, codigo: 'HERR-003', nombre: 'Multímetro Digital', categoria: 'medicion', marca: 'Fluke', modelo: '117', estado: 'en_uso', ubicacion: 'Lab. Eléctrico', fecha_adquisicion: '2023-08-10', proximo_mantenimiento: '2026-04-15', ultimo_uso: '2026-02-20' },
        { id: 4, codigo: 'HERR-004', nombre: 'Esmeril Angular', categoria: 'electricas', marca: 'Makita', modelo: 'GA5030', estado: 'mantenimiento', ubicacion: 'Taller - Banco 2', fecha_adquisicion: '2021-11-05', proximo_mantenimiento: '2026-02-28' },
        { id: 5, codigo: 'HERR-005', nombre: 'Casco de Seguridad', categoria: 'seguridad', marca: '3M', modelo: 'H-700', estado: 'disponible', ubicacion: 'Almacén EPP', fecha_adquisicion: '2023-12-01', proximo_mantenimiento: '2027-01-01' }
    ];
}

// Render herramientas
function renderHerramientas() {
    const tbody = document.getElementById('herramientas-table');
    
    if (herramientas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-tools text-3xl mb-2"></i>
                    <p>No hay herramientas registradas</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = herramientas.map(h => {
        const estadoBadge = getEstadoBadge(h.estado);
        const ultimoUso = h.ultimo_uso ? new Date(h.ultimo_uso).toLocaleDateString('es-ES') : '-';
        const proxMant = h.proximo_mantenimiento ? new Date(h.proximo_mantenimiento).toLocaleDateString('es-ES') : '-';
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-semibold">${h.codigo}</td>
                <td class="px-4 py-3 text-sm">${h.nombre}</td>
                <td class="px-4 py-3 text-sm">${getCategoryLabel(h.categoria)}</td>
                <td class="px-4 py-3 text-sm">${h.marca || '-'} ${h.modelo || ''}</td>
                <td class="px-4 py-3 text-sm">${h.ubicacion}</td>
                <td class="px-4 py-3 text-center">${estadoBadge}</td>
                <td class="px-4 py-3 text-center text-sm">${ultimoUso}</td>
                <td class="px-4 py-3 text-center text-sm">${proxMant}</td>
                <td class="px-4 py-3 text-center">
                    <button onclick="editHerramienta(${h.id})" class="text-blue-600 hover:text-blue-800 mx-1" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="viewHerramienta(${h.id})" class="text-green-600 hover:text-green-800 mx-1" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="deleteHerramienta(${h.id})" class="text-red-600 hover:text-red-800 mx-1" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Update dashboard
function updateDashboard() {
    document.getElementById('total-herramientas').textContent = herramientas.length;
    document.getElementById('herramientas-disponibles').textContent = herramientas.filter(h => h.estado === 'disponible').length;
    document.getElementById('herramientas-en-uso').textContent = herramientas.filter(h => h.estado === 'en_uso').length;
    document.getElementById('herramientas-mantenimiento').textContent = herramientas.filter(h => h.estado === 'mantenimiento').length;
}

// Get estado badge
function getEstadoBadge(estado) {
    const badges = {
        'disponible': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">✅ Disponible</span>',
        'en_uso': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">👷 En Uso</span>',
        'mantenimiento': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">⚙️ Mantenimiento</span>',
        'dañado': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">❌ Dañado</span>',
        'baja': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">🗑️ Baja</span>'
    };
    return badges[estado] || '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">-</span>';
}

// Get category label
function getCategoryLabel(cat) {
    const labels = {
        'manuales': 'Manuales',
        'electricas': 'Eléctricas',
        'medicion': 'Medición',
        'seguridad': 'Seguridad'
    };
    return labels[cat] || cat;
}

// Filter herramientas
function filterHerramientas() {
    const search = document.getElementById('search-herramienta').value.toLowerCase();
    const estado = document.getElementById('filter-estado').value;
    const categoria = document.getElementById('filter-categoria').value;
    
    const rows = document.querySelectorAll('#herramientas-table tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const match = text.includes(search) && 
                     (!estado || text.includes(estado)) && 
                     (!categoria || text.includes(categoria));
        row.style.display = match ? '' : 'none';
    });
}

// Clear filters
function clearFilters() {
    document.getElementById('search-herramienta').value = '';
    document.getElementById('filter-estado').value = '';
    document.getElementById('filter-categoria').value = '';
    filterHerramientas();
}

// Filtrar por estado desde KPI
function filtrarEstado(estado) {
    document.getElementById('filter-estado').value = estado;
    filterHerramientas();
    switchTab('herramientas');
}

// Modal herramienta
function showNewHerramientaForm() {
    editingId = null;
    document.getElementById('modal-herr-title').textContent = 'Nueva Herramienta';
    document.getElementById('form-herramienta').reset();
    document.getElementById('modal-herramienta').classList.remove('hidden');
}

function closeHerramientaModal() {
    document.getElementById('modal-herramienta').classList.add('hidden');
}

function editHerramienta(id) {
    const herr = herramientas.find(h => h.id === id);
    if (!herr) return;
    
    editingId = id;
    document.getElementById('modal-herr-title').textContent = 'Editar Herramienta';
    document.getElementById('herr-codigo').value = herr.codigo;
    document.getElementById('herr-nombre').value = herr.nombre;
    document.getElementById('herr-categoria').value = herr.categoria;
    document.getElementById('herr-estado').value = herr.estado;
    document.getElementById('herr-marca').value = herr.marca || '';
    document.getElementById('herr-modelo').value = herr.modelo || '';
    document.getElementById('herr-serie').value = herr.numero_serie || '';
    document.getElementById('herr-ubicacion').value = herr.ubicacion;
    document.getElementById('herr-fecha-adquisicion').value = herr.fecha_adquisicion || '';
    document.getElementById('herr-proximo-mant').value = herr.proximo_mantenimiento || '';
    document.getElementById('herr-descripcion').value = herr.descripcion || '';
    document.getElementById('herr-observaciones').value = herr.observaciones || '';
    
    document.getElementById('modal-herramienta').classList.remove('hidden');
}

function viewHerramienta(id) {
    const herr = herramientas.find(h => h.id === id);
    if (herr) {
        const detalles = `
🔧 DETALLE DE HERRAMIENTA

📋 Código: ${herr.codigo}
📦 Nombre: ${herr.nombre}
🏷️ Categoría: ${getCategoryLabel(herr.categoria)}
🏭 Marca: ${herr.marca || 'N/A'}
🔖 Modelo: ${herr.modelo || 'N/A'}
🔢 Serie: ${herr.numero_serie || 'N/A'}
📍 Ubicación: ${herr.ubicacion}
🟢 Estado: ${herr.estado}
📅 Adquisición: ${herr.fecha_adquisicion || 'N/A'}
⚙️ Próx. Mantenimiento: ${herr.proximo_mantenimiento || 'N/A'}
${herr.descripcion ? '📝 Descripción: ' + herr.descripcion : ''}
${herr.observaciones ? '💬 Obs: ' + herr.observaciones : ''}
        `.trim();
        alert(detalles);
    }
}

function deleteHerramienta(id) {
    if (!confirm('¿Eliminar esta herramienta?')) return;
    
    herramientas = herramientas.filter(h => h.id !== id);
    renderHerramientas();
    updateDashboard();
    showToast('✅ Herramienta eliminada', 'success');
}

// Submit herramienta
async function submitHerramienta(e) {
    e.preventDefault();
    
    const data = {
        codigo: document.getElementById('herr-codigo').value,
        nombre: document.getElementById('herr-nombre').value,
        categoria: document.getElementById('herr-categoria').value,
        estado: document.getElementById('herr-estado').value,
        marca: document.getElementById('herr-marca').value,
        modelo: document.getElementById('herr-modelo').value,
        numero_serie: document.getElementById('herr-serie').value,
        ubicacion: document.getElementById('herr-ubicacion').value,
        fecha_adquisicion: document.getElementById('herr-fecha-adquisicion').value,
        proximo_mantenimiento: document.getElementById('herr-proximo-mant').value,
        descripcion: document.getElementById('herr-descripcion').value,
        observaciones: document.getElementById('herr-observaciones').value
    };
    
    if (editingId) {
        const index = herramientas.findIndex(h => h.id === editingId);
        herramientas[index] = { ...herramientas[index], ...data };
        showToast('✅ Herramienta actualizada', 'success');
    } else {
        data.id = herramientas.length + 1;
        herramientas.push(data);
        showToast('✅ Herramienta creada', 'success');
    }
    
    closeHerramientaModal();
    renderHerramientas();
    updateDashboard();
    fillHerramientasSelect();
}

// Fill herramientas select
function fillHerramientasSelect() {
    const selects = ['prest-herramienta', 'mant-herramienta'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Seleccione...</option>';
        herramientas.filter(h => h.estado === 'disponible').forEach(h => {
            select.innerHTML += `<option value="${h.id}">${h.codigo} - ${h.nombre}</option>`;
        });
    });
}

// ===== PRÉSTAMOS =====
function loadPrestamos() {
    prestamos = [
        { id: 1, herramienta_id: 3, herramienta_nombre: 'HERR-003 - Multímetro Digital', responsable: 'Juan Pérez', proyecto: 'OT-2024-001', fecha_inicio: '2026-02-20', fecha_fin_estimada: '2026-02-27', estado: 'activo' },
        { id: 2, herramienta_id: 1, herramienta_nombre: 'HERR-001 - Taladro Eléctrico', responsable: 'María López', proyecto: 'OT-2024-005', fecha_inicio: '2026-02-15', fecha_fin_estimada: '2026-02-22', fecha_devolucion: '2026-02-21', estado: 'devuelto' }
    ];
    renderPrestamos();
}

function renderPrestamos() {
    const tbody = document.getElementById('prestamos-table');
    
    if (prestamos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-handshake text-3xl mb-2"></i>
                    <p>No hay préstamos registrados</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = prestamos.map(p => {
        const dias = calculateDays(p.fecha_inicio, p.fecha_devolucion || new Date().toISOString().split('T')[0]);
        const estadoBadge = getPrestamoEstadoBadge(p);
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm">${p.herramienta_nombre}</td>
                <td class="px-4 py-3 text-sm font-semibold">${p.responsable}</td>
                <td class="px-4 py-3 text-sm">${p.proyecto || '-'}</td>
                <td class="px-4 py-3 text-center text-sm">${new Date(p.fecha_inicio).toLocaleDateString('es-ES')}</td>
                <td class="px-4 py-3 text-center text-sm">${p.fecha_devolucion ? new Date(p.fecha_devolucion).toLocaleDateString('es-ES') : new Date(p.fecha_fin_estimada).toLocaleDateString('es-ES')}</td>
                <td class="px-4 py-3 text-center">${estadoBadge}</td>
                <td class="px-4 py-3 text-center text-sm font-semibold">${dias}</td>
                <td class="px-4 py-3 text-center">
                    ${p.estado === 'activo' ? `<button onclick="devolverHerramienta(${p.id})" class="text-green-600 hover:text-green-800 mx-1" title="Devolver"><i class="fas fa-check-circle"></i></button>` : ''}
                    <button onclick="viewPrestamo(${p.id})" class="text-blue-600 hover:text-blue-800 mx-1" title="Ver"><i class="fas fa-eye"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function getPrestamoEstadoBadge(p) {
    if (p.estado === 'devuelto') {
        return '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">✅ Devuelto</span>';
    }
    
    const hoy = new Date();
    const fechaFin = new Date(p.fecha_fin_estimada);
    
    if (fechaFin < hoy) {
        return '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">🔴 Vencido</span>';
    }
    
    return '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">🟢 Activo</span>';
}

function calculateDays(inicio, fin) {
    const diff = new Date(fin) - new Date(inicio);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function showNewPrestamoForm() {
    document.getElementById('form-prestamo').reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('prest-fecha-inicio').value = today;
    document.getElementById('modal-prestamo').classList.remove('hidden');
}

function closePrestamoModal() {
    document.getElementById('modal-prestamo').classList.add('hidden');
}

async function submitPrestamo(e) {
    e.preventDefault();
    
    const herramientaId = parseInt(document.getElementById('prest-herramienta').value);
    const herramienta = herramientas.find(h => h.id === herramientaId);
    
    const data = {
        id: prestamos.length + 1,
        herramienta_id: herramientaId,
        herramienta_nombre: herramienta ? `${herramienta.codigo} - ${herramienta.nombre}` : '',
        responsable: document.getElementById('prest-responsable').value,
        proyecto: document.getElementById('prest-proyecto').value,
        fecha_inicio: document.getElementById('prest-fecha-inicio').value,
        fecha_fin_estimada: document.getElementById('prest-fecha-fin').value,
        observaciones: document.getElementById('prest-observaciones').value,
        estado: 'activo'
    };
    
    // Cambiar estado de herramienta
    if (herramienta) {
        herramienta.estado = 'en_uso';
        herramienta.ultimo_uso = data.fecha_inicio;
    }
    
    prestamos.push(data);
    closePrestamoModal();
    renderPrestamos();
    renderHerramientas();
    updateDashboard();
    showToast('✅ Préstamo registrado', 'success');
}

function devolverHerramienta(id) {
    const prestamo = prestamos.find(p => p.id === id);
    if (!prestamo) return;
    
    const today = new Date().toISOString().split('T')[0];
    prestamo.fecha_devolucion = today;
    prestamo.estado = 'devuelto';
    
    // Cambiar estado de herramienta a disponible
    const herramienta = herramientas.find(h => h.id === prestamo.herramienta_id);
    if (herramienta) {
        herramienta.estado = 'disponible';
    }
    
    renderPrestamos();
    renderHerramientas();
    updateDashboard();
    showToast('✅ Herramienta devuelta', 'success');
}

function viewPrestamo(id) {
    const prest = prestamos.find(p => p.id === id);
    if (prest) {
        const detalles = `
📋 DETALLE DE PRÉSTAMO

🔧 Herramienta: ${prest.herramienta_nombre}
👤 Responsable: ${prest.responsable}
📂 Proyecto/OT: ${prest.proyecto || 'N/A'}
📅 Fecha Préstamo: ${new Date(prest.fecha_inicio).toLocaleDateString('es-ES')}
📆 Fecha Estimada: ${new Date(prest.fecha_fin_estimada).toLocaleDateString('es-ES')}
${prest.fecha_devolucion ? '✅ Devuelto: ' + new Date(prest.fecha_devolucion).toLocaleDateString('es-ES') : ''}
🟢 Estado: ${prest.estado}
⏱️ Días: ${calculateDays(prest.fecha_inicio, prest.fecha_devolucion || new Date().toISOString().split('T')[0])}
${prest.observaciones ? '💬 Obs: ' + prest.observaciones : ''}
        `.trim();
        alert(detalles);
    }
}

function filterPrestamos() {
    const search = document.getElementById('search-prestamo').value.toLowerCase();
    const estado = document.getElementById('filter-prestamo-estado').value;
    const fecha = document.getElementById('filter-prestamo-fecha').value;
    
    const rows = document.querySelectorAll('#prestamos-table tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const match = text.includes(search) && 
                     (!estado || text.includes(estado)) && 
                     (!fecha || text.includes(fecha));
        row.style.display = match ? '' : 'none';
    });
}

function clearPrestamoFilters() {
    document.getElementById('search-prestamo').value = '';
    document.getElementById('filter-prestamo-estado').value = '';
    document.getElementById('filter-prestamo-fecha').value = '';
    filterPrestamos();
}

// ===== MANTENIMIENTOS =====
function loadMantenimientos() {
    mantenimientos = [
        { id: 1, herramienta_id: 4, herramienta_nombre: 'HERR-004 - Esmeril Angular', tipo: 'preventivo', fecha_programada: '2026-02-28', responsable: 'Carlos Ruiz', estado: 'pendiente' },
        { id: 2, herramienta_id: 1, herramienta_nombre: 'HERR-001 - Taladro Eléctrico', tipo: 'calibracion', fecha_programada: '2026-03-01', ultima_realizacion: '2025-09-01', responsable: 'Ana Torres', estado: 'pendiente' }
    ];
    renderMantenimientos();
    checkMantenimientosVencidos();
}

function renderMantenimientos() {
    const tbody = document.getElementById('mantenimientos-table');
    
    if (mantenimientos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-calendar-check text-3xl mb-2"></i>
                    <p>No hay mantenimientos programados</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = mantenimientos.map(m => {
        const estadoBadge = getMantenimientoEstadoBadge(m.estado);
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm">${m.herramienta_nombre}</td>
                <td class="px-4 py-3 text-sm">${m.tipo}</td>
                <td class="px-4 py-3 text-center text-sm">${new Date(m.fecha_programada).toLocaleDateString('es-ES')}</td>
                <td class="px-4 py-3 text-center text-sm">${m.ultima_realizacion ? new Date(m.ultima_realizacion).toLocaleDateString('es-ES') : '-'}</td>
                <td class="px-4 py-3 text-sm">${m.responsable}</td>
                <td class="px-4 py-3 text-center">${estadoBadge}</td>
                <td class="px-4 py-3 text-sm">${m.observaciones || '-'}</td>
                <td class="px-4 py-3 text-center">
                    ${m.estado !== 'completado' ? `<button onclick="completarMantenimiento(${m.id})" class="text-green-600 hover:text-green-800 mx-1" title="Completar"><i class="fas fa-check-circle"></i></button>` : ''}
                    <button onclick="viewMantenimiento(${m.id})" class="text-blue-600 hover:text-blue-800 mx-1" title="Ver"><i class="fas fa-eye"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function getMantenimientoEstadoBadge(estado) {
    const badges = {
        'pendiente': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">⏳ Pendiente</span>',
        'en_proceso': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">🔧 En Proceso</span>',
        'completado': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">✅ Completado</span>'
    };
    return badges[estado] || '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">-</span>';
}

function checkMantenimientosVencidos() {
    const hoy = new Date();
    const vencidos = mantenimientos.filter(m => {
        const fecha = new Date(m.fecha_programada);
        return fecha <= hoy && m.estado === 'pendiente';
    });
    
    if (vencidos.length > 0) {
        const alertaDiv = document.getElementById('alertas-mantenimiento');
        alertaDiv.innerHTML = `
            <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div class="flex items-center">
                    <i class="fas fa-exclamation-triangle text-red-600 text-2xl mr-3"></i>
                    <div>
                        <p class="font-bold text-red-800">⚠️ ${vencidos.length} Mantenimiento(s) Vencido(s)</p>
                        <p class="text-red-700 text-sm">Hay herramientas que requieren mantenimiento urgente</p>
                    </div>
                </div>
            </div>
        `;
    }
}

function showNewMantenimientoForm() {
    document.getElementById('form-mantenimiento').reset();
    document.getElementById('modal-mantenimiento').classList.remove('hidden');
}

function closeMantenimientoModal() {
    document.getElementById('modal-mantenimiento').classList.add('hidden');
}

async function submitMantenimiento(e) {
    e.preventDefault();
    
    const herramientaId = parseInt(document.getElementById('mant-herramienta').value);
    const herramienta = herramientas.find(h => h.id === herramientaId);
    
    const data = {
        id: mantenimientos.length + 1,
        herramienta_id: herramientaId,
        herramienta_nombre: herramienta ? `${herramienta.codigo} - ${herramienta.nombre}` : '',
        tipo: document.getElementById('mant-tipo').value,
        fecha_programada: document.getElementById('mant-fecha-programada').value,
        responsable: document.getElementById('mant-responsable').value,
        estado: document.getElementById('mant-estado').value,
        observaciones: document.getElementById('mant-observaciones').value
    };
    
    mantenimientos.push(data);
    closeMantenimientoModal();
    renderMantenimientos();
    checkMantenimientosVencidos();
    showToast('✅ Mantenimiento programado', 'success');
}

function completarMantenimiento(id) {
    const mant = mantenimientos.find(m => m.id === id);
    if (!mant) return;
    
    mant.estado = 'completado';
    mant.ultima_realizacion = new Date().toISOString().split('T')[0];
    
    renderMantenimientos();
    checkMantenimientosVencidos();
    showToast('✅ Mantenimiento completado', 'success');
}

function viewMantenimiento(id) {
    const mant = mantenimientos.find(m => m.id === id);
    if (mant) {
        const detalles = `
🔧 DETALLE DE MANTENIMIENTO

🛠️ Herramienta: ${mant.herramienta_nombre}
📋 Tipo: ${mant.tipo}
📅 Fecha Programada: ${new Date(mant.fecha_programada).toLocaleDateString('es-ES')}
${mant.ultima_realizacion ? '✅ Última Realización: ' + new Date(mant.ultima_realizacion).toLocaleDateString('es-ES') : ''}
👤 Responsable: ${mant.responsable}
🟡 Estado: ${mant.estado}
${mant.observaciones ? '💬 Observaciones: ' + mant.observaciones : ''}
        `.trim();
        alert(detalles);
    }
}

function filterMantenimientos() {
    const search = document.getElementById('search-mantenimiento').value.toLowerCase();
    const estado = document.getElementById('filter-mant-estado').value;
    
    const rows = document.querySelectorAll('#mantenimientos-table tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const match = text.includes(search) && (!estado || text.includes(estado));
        row.style.display = match ? '' : 'none';
    });
}

function clearMantFilters() {
    document.getElementById('search-mantenimiento').value = '';
    document.getElementById('filter-mant-estado').value = '';
    filterMantenimientos();
}

// Export herramientas
function exportarHerramientas() {
    if (herramientas.length === 0) {
        showToast('⚠️ No hay datos para exportar', 'error');
        return;
    }
    
    const data = herramientas.map(h => ({
        'Código': h.codigo,
        'Nombre': h.nombre,
        'Categoría': getCategoryLabel(h.categoria),
        'Marca': h.marca || '-',
        'Modelo': h.modelo || '-',
        'Serie': h.numero_serie || '-',
        'Estado': h.estado,
        'Ubicación': h.ubicacion,
        'Fecha Adquisición': h.fecha_adquisicion || '-',
        'Próximo Mantenimiento': h.proximo_mantenimiento || '-'
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Herramientas');
    XLSX.writeFile(wb, `Herramientas_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    showToast('✅ Excel exportado exitosamente', 'success');
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 text-white ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'info' ? 'bg-blue-500' : 'bg-gray-500'
    }`;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}
