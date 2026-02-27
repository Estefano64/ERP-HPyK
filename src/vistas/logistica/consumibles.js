// Control de Consumibles - JavaScript
let consumibles = [];
let movimientos = [];
let editingId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadConsumibles();
    loadMovimientos();
    
    // Set fecha actual
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('mov-fecha').value = today;
    
    // Formularios
    document.getElementById('form-consumible').addEventListener('submit', submitConsumible);
    document.getElementById('form-movimiento').addEventListener('submit', submitMovimiento);
});

// Switch tabs
function switchTab(tab) {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('border-purple-600', 'text-purple-600');
        btn.classList.add('border-transparent', 'text-gray-500');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    document.getElementById(`tab-${tab}`).classList.remove('border-transparent', 'text-gray-500');
    document.getElementById(`tab-${tab}`).classList.add('border-purple-600', 'text-purple-600');
    document.getElementById(`content-${tab}`).classList.remove('hidden');
    
    if (tab === 'estadisticas') {
        updateEstadisticas();
    }
}

// Load consumibles
async function loadConsumibles() {
    try {
        const response = await fetch('/api/consumibles');
        if (response.ok) {
            consumibles = await response.json();
        } else {
            consumibles = generateSampleConsumibles();
        }
        renderConsumibles();
        updateDashboard();
        fillConsumiblesSelect();
    } catch (error) {
        console.error('Error:', error);
        consumibles = generateSampleConsumibles();
        renderConsumibles();
        updateDashboard();
        fillConsumiblesSelect();
    }
}

// Generate sample data
function generateSampleConsumibles() {
    return [
        { id: 1, codigo: 'CONS-001', nombre: 'Guantes de Látex', categoria: 'epp', unidad: 'par', stock: 150, stock_minimo: 50, marca: '3M', proveedor: 'Proveedor A', ubicacion: 'Almacén EPP - A1', precio_unitario: 2.50, consumo_mensual: 45 },
        { id: 2, codigo: 'CONS-002', nombre: 'Mascarilla N95', categoria: 'epp', unidad: 'unidad', stock: 80, stock_minimo: 100, marca: 'Honeywell', proveedor: 'Importadora XYZ', ubicacion: 'Almacén EPP - A2', precio_unitario: 5.00, consumo_mensual: 65 },
        { id: 3, codigo: 'CONS-003', nombre: 'Desinfectante Multiuso', categoria: 'limpieza', unidad: 'litro', stock: 25, stock_minimo: 30, marca: 'Clorox', proveedor: 'Distribuidora ABC', ubicacion: 'Almacén Limpieza - B1', precio_unitario: 8.50, consumo_mensual: 18 },
        { id: 4, codigo: 'CONS-004', nombre: 'Papel Higiénico Industrial', categoria: 'limpieza', unidad: 'paquete', stock: 120, stock_minimo: 50, marca: 'Elite', proveedor: 'Proveedora DEF', ubicacion: 'Almacén Limpieza - B2', precio_unitario: 15.00, consumo_mensual: 28 },
        { id: 5, codigo: 'CONS-005', nombre: 'Bolígrafos Azules', categoria: 'oficina', unidad: 'caja', stock: 45, stock_minimo: 20, marca: 'BIC', proveedor: 'Librería Total', ubicacion: 'Almacén Oficina - C1', precio_unitario: 12.00, consumo_mensual: 8 },
        { id: 6, codigo: 'CONS-006', nombre: 'Hojas A4 (500 hojas)', categoria: 'oficina', unidad: 'paquete', stock: 35, stock_minimo: 40, marca: 'Chamex', proveedor: 'Librería Total', ubicacion: 'Almacén Oficina - C2', precio_unitario: 22.00, consumo_mensual: 15 },
        { id: 7, codigo: 'CONS-007', nombre: 'Cuchillas Descartables', categoria: 'herramientas', unidad: 'caja', stock: 8, stock_minimo: 15, marca: 'Stanley', proveedor: 'Ferretería GHI', ubicacion: 'Almacén Herramientas - D1', precio_unitario: 18.00, consumo_mensual: 12 },
        { id: 8, codigo: 'CONS-008', nombre: 'Aceite Lubricante SAE 40', categoria: 'mantenimiento', unidad: 'litro', stock: 18, stock_minimo: 25, marca: 'Shell', proveedor: 'Lubricantes JKL', ubicacion: 'Almacén Mantenimiento - E1', precio_unitario: 32.00, consumo_mensual: 22 },
        { id: 9, codigo: 'CONS-009', nombre: 'Filtros de Aire', categoria: 'mantenimiento', unidad: 'unidad', stock: 12, stock_minimo: 20, marca: 'Mann', proveedor: 'Repuestos MNO', ubicacion: 'Almacén Mantenimiento - E2', precio_unitario: 45.00, consumo_mensual: 10 },
        { id: 10, codigo: 'CONS-010', nombre: 'Casco de Seguridad', categoria: 'epp', unidad: 'unidad', stock: 5, stock_minimo: 10, marca: '3M', proveedor: 'Proveedor A', ubicacion: 'Almacén EPP - A3', precio_unitario: 65.00, consumo_mensual: 3, ultimo_movimiento: '2026-02-15' }
    ];
}

// Load movimientos
function loadMovimientos() {
    movimientos = [
        { id: 1, consumible_id: 1, consumible_nombre: 'CONS-001 - Guantes de Látex', cantidad: 20, fecha: '2026-02-25', responsable: 'Juan Pérez', destino: 'OT-2024-001', motivo: 'Trabajo de soldadura' },
        { id: 2, consumible_id: 2, consumible_nombre: 'CONS-002 - Mascarilla N95', cantidad: 15, fecha: '2026-02-24', responsable: 'María López', destino: 'Área de Pintura', motivo: 'Aplicación de pintura industrial' },
        { id: 3, consumible_id: 3, consumible_nombre: 'CONS-003 - Desinfectante', cantidad: 5, fecha: '2026-02-23', responsable: 'Carlos Ruiz', destino: 'Limpieza General', motivo: 'Limpieza de áreas comunes' },
        { id: 4, consumible_id: 5, consumible_nombre: 'CONS-005 - Bolígrafos Azules', cantidad: 2, fecha: '2026-02-22', responsable: 'Ana Torres', destino: 'Oficina Administración', motivo: 'Reposición mensual oficina' },
        { id: 5, consumible_id: 7, consumible_nombre: 'CONS-007 - Cuchillas', cantidad: 4, fecha: '2026-02-20', responsable: 'Pedro Gómez', destino: 'OT-2024-005', motivo: 'Corte de materiales' }
    ];
    renderMovimientos();
}

// Render consumibles
function renderConsumibles() {
    const tbody = document.getElementById('consumibles-table');
    
    if (consumibles.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-box-open text-3xl mb-2"></i>
                    <p>No hay consumibles registrados</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = consumibles.map(c => {
        const nivel = getStockNivel(c);
        const nivelBadge = getStockNivelBadge(nivel);
        const ultimoMov = c.ultimo_movimiento ? new Date(c.ultimo_movimiento).toLocaleDateString('es-ES') : '-';
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-semibold">${c.codigo}</td>
                <td class="px-4 py-3 text-sm">${c.nombre}</td>
                <td class="px-4 py-3 text-sm">${getCategoryLabel(c.categoria)}</td>
                <td class="px-4 py-3 text-center text-sm">${getUnidadLabel(c.unidad)}</td>
                <td class="px-4 py-3 text-center text-sm font-bold">${c.stock}</td>
                <td class="px-4 py-3 text-center text-sm text-gray-600">${c.stock_minimo}</td>
                <td class="px-4 py-3 text-center">${nivelBadge}</td>
                <td class="px-4 py-3 text-center text-sm">${c.consumo_mensual || 0}</td>
                <td class="px-4 py-3 text-center text-sm">${ultimoMov}</td>
                <td class="px-4 py-3 text-center">
                    <button onclick="registrarConsumo(${c.id})" class="text-purple-600 hover:text-purple-800 mx-1" title="Registrar Consumo">
                        <i class="fas fa-minus-circle"></i>
                    </button>
                    <button onclick="editConsumible(${c.id})" class="text-blue-600 hover:text-blue-800 mx-1" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="viewConsumible(${c.id})" class="text-green-600 hover:text-green-800 mx-1" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="deleteConsumible(${c.id})" class="text-red-600 hover:text-red-800 mx-1" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Get stock nivel
function getStockNivel(consumible) {
    if (consumible.stock <= consumible.stock_minimo * 0.5) return 'critico';
    if (consumible.stock <= consumible.stock_minimo) return 'bajo';
    return 'normal';
}

// Get stock nivel badge
function getStockNivelBadge(nivel) {
    const badges = {
        'normal': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">✅ Normal</span>',
        'bajo': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">⚠️ Bajo</span>',
        'critico': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">🔴 Crítico</span>'
    };
    return badges[nivel] || '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">-</span>';
}

// Get category label
function getCategoryLabel(cat) {
    const labels = {
        'epp': 'EPP',
        'limpieza': 'Limpieza',
        'oficina': 'Oficina',
        'herramientas': 'Herramientas',
        'mantenimiento': 'Mantenimiento'
    };
    return labels[cat] || cat;
}

// Get unidad label
function getUnidadLabel(unidad) {
    const labels = {
        'unidad': 'Und',
        'paquete': 'Paq',
        'caja': 'Cja',
        'litro': 'L',
        'kilogramo': 'Kg',
        'metro': 'M',
        'par': 'Par'
    };
    return labels[unidad] || unidad;
}

// Update dashboard
function updateDashboard() {
    document.getElementById('total-consumibles').textContent = consumibles.length;
    
    const niveles = { normal: 0, bajo: 0, critico: 0 };
    consumibles.forEach(c => {
        const nivel = getStockNivel(c);
        niveles[nivel]++;
    });
    
    document.getElementById('consumibles-normal').textContent = niveles.normal;
    document.getElementById('consumibles-bajo').textContent = niveles.bajo;
    document.getElementById('consumibles-critico').textContent = niveles.critico;
    
    // Consumo mensual estimado
    const consumoTotal = movimientos
        .filter(m => {
            const fecha = new Date(m.fecha);
            const hoy = new Date();
            const diff = (hoy - fecha) / (1000 * 60 * 60 * 24);
            return diff <= 30;
        })
        .reduce((sum, m) => {
            const cons = consumibles.find(c => c.id === m.consumible_id);
            return sum + (m.cantidad * (cons?.precio_unitario || 0));
        }, 0);
    
    document.getElementById('consumo-mensual').textContent = `$${consumoTotal.toLocaleString('es-ES', { maximumFractionDigits: 2 })}`;
}

// Filter consumibles
function filterConsumibles() {
    const search = document.getElementById('search-consumible').value.toLowerCase();
    const categoria = document.getElementById('filter-categoria').value;
    const stockNivel = document.getElementById('filter-stock-nivel').value;
    
    const rows = document.querySelectorAll('#consumibles-table tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const match = text.includes(search) && 
                     (!categoria || text.includes(categoria.toLowerCase())) && 
                     (!stockNivel || text.includes(stockNivel));
        row.style.display = match ? '' : 'none';
    });
}

// Clear filters
function clearFilters() {
    document.getElementById('search-consumible').value = '';
    document.getElementById('filter-categoria').value = '';
    document.getElementById('filter-stock-nivel').value = '';
    filterConsumibles();
}

// Filtrar por stock desde KPI
function filtrarStock(nivel) {
    document.getElementById('filter-stock-nivel').value = nivel;
    filterConsumibles();
    switchTab('consumibles');
}

// Modal consumible
function showNewConsumibleForm() {
    editingId = null;
    document.getElementById('modal-cons-title').textContent = 'Nuevo Consumible';
    document.getElementById('form-consumible').reset();
    document.getElementById('modal-consumible').classList.remove('hidden');
}

function closeConsumibleModal() {
    document.getElementById('modal-consumible').classList.add('hidden');
}

function editConsumible(id) {
    const cons = consumibles.find(c => c.id === id);
    if (!cons) return;
    
    editingId = id;
    document.getElementById('modal-cons-title').textContent = 'Editar Consumible';
    document.getElementById('cons-codigo').value = cons.codigo;
    document.getElementById('cons-nombre').value = cons.nombre;
    document.getElementById('cons-categoria').value = cons.categoria;
    document.getElementById('cons-unidad').value = cons.unidad;
    document.getElementById('cons-stock').value = cons.stock;
    document.getElementById('cons-stock-minimo').value = cons.stock_minimo;
    document.getElementById('cons-marca').value = cons.marca || '';
    document.getElementById('cons-proveedor').value = cons.proveedor || '';
    document.getElementById('cons-ubicacion').value = cons.ubicacion || '';
    document.getElementById('cons-precio').value = cons.precio_unitario || '';
    document.getElementById('cons-descripcion').value = cons.descripcion || '';
    
    document.getElementById('modal-consumible').classList.remove('hidden');
}

function viewConsumible(id) {
    const cons = consumibles.find(c => c.id === id);
    if (cons) {
        const detalles = `
📦 DETALLE DE CONSUMIBLE

📋 Código: ${cons.codigo}
📦 Nombre: ${cons.nombre}
🏷️ Categoría: ${getCategoryLabel(cons.categoria)}
📏 Unidad: ${getUnidadLabel(cons.unidad)}
📊 Stock Actual: ${cons.stock}
⚠️ Stock Mínimo: ${cons.stock_minimo}
🟢 Nivel: ${getStockNivel(cons).toUpperCase()}
🏭 Marca: ${cons.marca || 'N/A'}
🏢 Proveedor: ${cons.proveedor || 'N/A'}
📍 Ubicación: ${cons.ubicacion || 'N/A'}
💰 Precio: $${cons.precio_unitario || 0}
📊 Consumo/Mes: ${cons.consumo_mensual || 0}
${cons.descripcion ? '📝 Descripción: ' + cons.descripcion : ''}
        `.trim();
        alert(detalles);
    }
}

function deleteConsumible(id) {
    if (!confirm('¿Eliminar este consumible?')) return;
    
    consumibles = consumibles.filter(c => c.id !== id);
    renderConsumibles();
    updateDashboard();
    showToast('✅ Consumible eliminado', 'success');
}

// Submit consumible
async function submitConsumible(e) {
    e.preventDefault();
    
    const data = {
        codigo: document.getElementById('cons-codigo').value,
        nombre: document.getElementById('cons-nombre').value,
        categoria: document.getElementById('cons-categoria').value,
        unidad: document.getElementById('cons-unidad').value,
        stock: parseInt(document.getElementById('cons-stock').value),
        stock_minimo: parseInt(document.getElementById('cons-stock-minimo').value),
        marca: document.getElementById('cons-marca').value,
        proveedor: document.getElementById('cons-proveedor').value,
        ubicacion: document.getElementById('cons-ubicacion').value,
        precio_unitario: parseFloat(document.getElementById('cons-precio').value) || 0,
        descripcion: document.getElementById('cons-descripcion').value,
        consumo_mensual: 0
    };
    
    if (editingId) {
        const index = consumibles.findIndex(c => c.id === editingId);
        consumibles[index] = { ...consumibles[index], ...data };
        showToast('✅ Consumible actualizado', 'success');
    } else {
        data.id = consumibles.length + 1;
        consumibles.push(data);
        showToast('✅ Consumible creado', 'success');
    }
    
    closeConsumibleModal();
    renderConsumibles();
    updateDashboard();
    fillConsumiblesSelect();
}

// Fill consumibles select
function fillConsumiblesSelect() {
    const select = document.getElementById('mov-consumible');
    select.innerHTML = '<option value="">Seleccione...</option>';
    consumibles.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.codigo} - ${c.nombre} (Stock: ${c.stock})</option>`;
    });
}

// ===== MOVIMIENTOS =====
function renderMovimientos() {
    const tbody = document.getElementById('movimientos-table');
    
    if (movimientos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-exchange-alt text-3xl mb-2"></i>
                    <p>No hay movimientos registrados</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = movimientos
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .map(m => `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm">${new Date(m.fecha).toLocaleDateString('es-ES')}</td>
                <td class="px-4 py-3 text-sm font-semibold">${m.consumible_nombre}</td>
                <td class="px-4 py-3 text-center text-sm font-bold text-red-600">-${m.cantidad}</td>
                <td class="px-4 py-3 text-sm">${m.responsable}</td>
                <td class="px-4 py-3 text-sm">${m.destino || '-'}</td>
                <td class="px-4 py-3 text-sm">${m.motivo}</td>
                <td class="px-4 py-3 text-center">
                    <button onclick="viewMovimiento(${m.id})" class="text-blue-600 hover:text-blue-800 mx-1" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
}

function showNewMovimientoForm() {
    document.getElementById('form-movimiento').reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('mov-fecha').value = today;
    document.getElementById('modal-movimiento').classList.remove('hidden');
}

function closeMovimientoModal() {
    document.getElementById('modal-movimiento').classList.add('hidden');
}

function registrarConsumo(consumibleId) {
    showNewMovimientoForm();
    document.getElementById('mov-consumible').value = consumibleId;
}

async function submitMovimiento(e) {
    e.preventDefault();
    
    const consumibleId = parseInt(document.getElementById('mov-consumible').value);
    const cantidad = parseInt(document.getElementById('mov-cantidad').value);
    const consumible = consumibles.find(c => c.id === consumibleId);
    
    if (!consumible) {
        showToast('⚠️ Consumible no encontrado', 'error');
        return;
    }
    
    if (cantidad > consumible.stock) {
        showToast('⚠️ Stock insuficiente', 'error');
        return;
    }
    
    const data = {
        id: movimientos.length + 1,
        consumible_id: consumibleId,
        consumible_nombre: `${consumible.codigo} - ${consumible.nombre}`,
        cantidad: cantidad,
        fecha: document.getElementById('mov-fecha').value,
        responsable: document.getElementById('mov-responsable').value,
        destino: document.getElementById('mov-destino').value,
        motivo: document.getElementById('mov-motivo').value
    };
    
    // Reducir stock
    consumible.stock -= cantidad;
    consumible.ultimo_movimiento = data.fecha;
    
    movimientos.push(data);
    closeMovimientoModal();
    renderMovimientos();
    renderConsumibles();
    updateDashboard();
    showToast('✅ Consumo registrado', 'success');
}

function viewMovimiento(id) {
    const mov = movimientos.find(m => m.id === id);
    if (mov) {
        const detalles = `
📋 DETALLE DE MOVIMIENTO

📦 Consumible: ${mov.consumible_nombre}
📊 Cantidad: ${mov.cantidad}
📅 Fecha: ${new Date(mov.fecha).toLocaleDateString('es-ES')}
👤 Responsable: ${mov.responsable}
📍 Destino: ${mov.destino || 'N/A'}
💬 Motivo: ${mov.motivo}
        `.trim();
        alert(detalles);
    }
}

function filterMovimientos() {
    const search = document.getElementById('search-movimiento').value.toLowerCase();
    const fecha = document.getElementById('filter-fecha').value;
    
    const rows = document.querySelectorAll('#movimientos-table tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const match = text.includes(search) && (!fecha || text.includes(fecha));
        row.style.display = match ? '' : 'none';
    });
}

function clearMovFilters() {
    document.getElementById('search-movimiento').value = '';
    document.getElementById('filter-fecha').value = '';
    filterMovimientos();
}

// ===== ESTADÍSTICAS =====
function updateEstadisticas() {
    updateTopConsumidos();
    updateConsumoPorCategoria();
    updateAlertasReposicion();
}

function updateTopConsumidos() {
    const top = consumibles
        .sort((a, b) => (b.consumo_mensual || 0) - (a.consumo_mensual || 0))
        .slice(0, 10);
    
    const html = top.map((c, i) => {
        const color = i === 0 ? 'bg-yellow-100 border-yellow-400' : i === 1 ? 'bg-gray-100 border-gray-400' : i === 2 ? 'bg-orange-100 border-orange-400' : 'bg-white border-gray-200';
        const icon = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
        
        return `
            <div class="flex items-center justify-between p-3 border-l-4 ${color} rounded">
                <div class="flex items-center gap-3">
                    <span class="text-xl font-bold w-8">${icon}</span>
                    <div>
                        <p class="font-semibold">${c.nombre}</p>
                        <p class="text-sm text-gray-600">${c.codigo}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold text-purple-600">${c.consumo_mensual || 0}</p>
                    <p class="text-xs text-gray-600">und/mes</p>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('top-consumidos').innerHTML = html || '<p class="text-gray-500 text-center">No hay datos</p>';
}

function updateConsumoPorCategoria() {
    const categorias = {};
    
    consumibles.forEach(c => {
        if (!categorias[c.categoria]) {
            categorias[c.categoria] = { nombre: getCategoryLabel(c.categoria), total: 0, valor: 0 };
        }
        categorias[c.categoria].total += c.consumo_mensual || 0;
        categorias[c.categoria].valor += (c.consumo_mensual || 0) * (c.precio_unitario || 0);
    });
    
    const html = Object.values(categorias)
        .sort((a, b) => b.total - a.total)
        .map((cat, i) => {
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-red-500'];
            const color = colors[i % colors.length];
            
            return `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div class="flex items-center gap-3 flex-1">
                        <div class="${color} w-4 h-4 rounded"></div>
                        <span class="font-semibold">${cat.nombre}</span>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-gray-800">${cat.total}</p>
                        <p class="text-sm text-gray-600">$${cat.valor.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</p>
                    </div>
                </div>
            `;
        }).join('');
    
    document.getElementById('consumo-categoria').innerHTML = html || '<p class="text-gray-500 text-center">No hay datos</p>';
}

function updateAlertasReposicion() {
    const alertas = consumibles.filter(c => {
        const nivel = getStockNivel(c);
        return nivel === 'bajo' || nivel === 'critico';
    }).sort((a, b) => a.stock - b.stock);
    
    if (alertas.length === 0) {
        document.getElementById('alertas-reposicion').innerHTML = `
            <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div class="flex items-center">
                    <i class="fas fa-check-circle text-green-600 text-2xl mr-3"></i>
                    <div>
                        <p class="font-bold text-green-800">✅ Sin Alertas</p>
                        <p class="text-green-700 text-sm">Todos los consumibles tienen stock normal</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    const html = alertas.map(c => {
        const nivel = getStockNivel(c);
        const color = nivel === 'critico' ? 'red' : 'orange';
        const icon = nivel === 'critico' ? 'fa-exclamation-triangle' : 'fa-exclamation-circle';
        
        return `
            <div class="bg-${color}-50 border-l-4 border-${color}-500 p-4 rounded">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fas ${icon} text-${color}-600 text-2xl mr-3"></i>
                        <div>
                            <p class="font-bold text-${color}-800">${c.nombre}</p>
                            <p class="text-${color}-700 text-sm">${c.codigo} - Stock: ${c.stock} / Mínimo: ${c.stock_minimo}</p>
                        </div>
                    </div>
                    <button onclick="editConsumible(${c.id})" class="bg-white hover:bg-gray-50 text-${color}-600 px-4 py-2 rounded border border-${color}-300 transition">
                        <i class="fas fa-plus mr-1"></i> Reponer
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('alertas-reposicion').innerHTML = html;
}

// Export consumibles
function exportarConsumibles() {
    if (consumibles.length === 0) {
        showToast('⚠️ No hay datos para exportar', 'error');
        return;
    }
    
    const data = consumibles.map(c => ({
        'Código': c.codigo,
        'Nombre': c.nombre,
        'Categoría': getCategoryLabel(c.categoria),
        'Unidad': getUnidadLabel(c.unidad),
        'Stock Actual': c.stock,
        'Stock Mínimo': c.stock_minimo,
        'Nivel': getStockNivel(c).toUpperCase(),
        'Consumo/Mes': c.consumo_mensual || 0,
        'Marca': c.marca || '-',
        'Proveedor': c.proveedor || '-',
        'Precio Unit.': c.precio_unitario || 0,
        'Ubicación': c.ubicacion || '-'
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Consumibles');
    XLSX.writeFile(wb, `Consumibles_${new Date().toISOString().split('T')[0]}.xlsx`);
    
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
