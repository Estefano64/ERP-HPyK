// Gestión de Órdenes de Compra - JavaScript
let ordenes = [];
let proveedores = [];
let materiales = [];
let editingId = null;
let productRows = [];

// Initialize function
function initOrdenesCompra() {
    loadProveedores();
    loadMateriales();
    loadOrdenes();

    // Set fecha actual
    const fechaEmisionElement = document.getElementById('orden-fecha-emision');
    if (fechaEmisionElement) {
        const today = new Date().toISOString().split('T')[0];
        fechaEmisionElement.value = today;
    }

    // Formulario
    const formElement = document.getElementById('form-orden');
    if (formElement && !formElement.dataset.initialized) {
        formElement.addEventListener('submit', submitOrden);
        formElement.dataset.initialized = 'true';
    }
}

// Auto-initialize when script loads or when called
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOrdenesCompra);
} else {
    setTimeout(initOrdenesCompra, 100);
}

// ─── LOAD PROVEEDORES ─────────────────────────────────────────────
async function loadProveedores() {
    try {
        const response = await fetch('/api/logistica/proveedores');
        if (response.ok) {
            const data = await response.json();
            proveedores = Array.isArray(data) ? data : (data.data || []);
        } else {
            proveedores = [];
        }
        fillProveedoresSelect();
    } catch (error) {
        console.error('Error al cargar proveedores:', error);
        proveedores = [];
        fillProveedoresSelect();
    }
}

// ─── LOAD MATERIALES (para autocomplete) ─────────────────────────
async function loadMateriales() {
    try {
        const response = await fetch('/api/logistica/inventario-valorizado');
        if (response.ok) {
            const data = await response.json();
            materiales = Array.isArray(data) ? data : (data.data || []);
            // Normalize field names
            materiales = materiales.map(m => ({
                id: m.material_id || m.id,
                codigo: m.codigo || '',
                nombre: m.descripcion || m.nombre || '',
                unidad: m.unidad_medida || m.unidad || 'und',
                precio_unitario: m.precio_unitario || 0
            }));
        } else {
            materiales = generateSampleMateriales();
        }
    } catch (error) {
        console.error('Error al cargar materiales:', error);
        materiales = generateSampleMateriales();
    }
}

// Sample materiales fallback (solo para autocompletado)
function generateSampleMateriales() {
    return [
        { id: 1, codigo: 'MAT-001', nombre: 'Acero Inoxidable 304', unidad: 'kg', precio_unitario: 25.50 },
        { id: 2, codigo: 'MAT-002', nombre: 'Sello Hidráulico Parker', unidad: 'und', precio_unitario: 85.00 },
        { id: 3, codigo: 'MAT-003', nombre: 'Rodamiento SKF 6205', unidad: 'und', precio_unitario: 95.00 },
        { id: 4, codigo: 'MAT-004', nombre: 'Válvula de Bola 1/2"', unidad: 'und', precio_unitario: 32.00 },
        { id: 5, codigo: 'MAT-005', nombre: 'Aceite Hidráulico ISO 46', unidad: 'gal', precio_unitario: 45.00 }
    ];
}

// Fill proveedores select
function fillProveedoresSelect() {
    const selects = ['orden-proveedor', 'filter-proveedor'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;
        const currentValue = select.value;
        select.innerHTML = selectId === 'orden-proveedor'
            ? '<option value="">Seleccione un proveedor...</option>'
            : '<option value="">Todos los Proveedores</option>';

        proveedores.forEach(p => {
            const nombre = p.razonSocial || p.razon_social || p.nombre || '';
            const ruc = p.ruc || '';
            select.innerHTML += `<option value="${p.id}">${nombre}${ruc ? ' (' + ruc + ')' : ''}</option>`;
        });

        if (currentValue) select.value = currentValue;
    });
}

// ─── LOAD ORDENES ─────────────────────────────────────────────────
async function loadOrdenes() {
    try {
        const response = await fetch('/api/logistica/compras');
        if (response.ok) {
            const data = await response.json();
            ordenes = Array.isArray(data) ? data : (data.data || []);
        } else {
            console.error('Error al cargar órdenes:', response.status);
            ordenes = [];
        }
        renderOrdenes();
        updateDashboard();
    } catch (error) {
        console.error('Error al cargar órdenes:', error);
        ordenes = [];
        renderOrdenes();
        updateDashboard();
    }
}

// Generate next OC number (based on loaded ordenes)
function generateNextOCNumber() {
    const year = new Date().getFullYear();
    const prefix = `OC-${year}-`;

    const existingNumbers = ordenes
        .filter(o => (o.numero_oc || '').startsWith(prefix))
        .map(o => parseInt((o.numero_oc || '').replace(prefix, '')))
        .filter(n => !isNaN(n));

    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const nextNumber = (maxNumber + 1).toString().padStart(4, '0');

    return `${prefix}${nextNumber}`;
}

// ─── RENDER ORDENES ───────────────────────────────────────────────
function renderOrdenes() {
    const tbody = document.getElementById('ordenes-table');
    if (!tbody) return;

    if (!ordenes || ordenes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-shopping-cart text-3xl mb-2"></i>
                    <p>No hay órdenes de compra registradas</p>
                </td>
            </tr>
        `;
        const totalEl = document.getElementById('total-registros');
        if (totalEl) totalEl.textContent = '0';
        return;
    }

    tbody.innerHTML = ordenes.map(o => {
        const estadoBadge = getEstadoBadge(o.estado);
        const monedaSymbol = o.moneda === 'USD' ? '$' : 'S/';
        const total = parseFloat(o.total_final) || 0;
        const fechaOrden = o.fecha_orden ? formatDate(o.fecha_orden) : '-';
        const fechaEntrega = o.fecha_entrega_requerida ? formatDate(o.fecha_entrega_requerida) : '-';

        return `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-bold text-green-700">${o.numero_oc || '-'}</td>
                <td class="px-4 py-3 text-sm">${o.proveedor_nombre || '-'}</td>
                <td class="px-4 py-3 text-center text-sm">${fechaOrden}</td>
                <td class="px-4 py-3 text-center text-sm">${fechaEntrega}</td>
                <td class="px-4 py-3 text-right text-sm font-bold">${monedaSymbol} ${total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                <td class="px-4 py-3 text-center">${estadoBadge}</td>
                <td class="px-4 py-3 text-center">
                    <button onclick="viewOrden(${o.id})" class="text-blue-600 hover:text-blue-800 mx-1" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${o.estado === 'borrador' ? `
                        <button onclick="editOrden(${o.id})" class="text-green-600 hover:text-green-800 mx-1" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                    ` : ''}
                    <button onclick="imprimirOrden(${o.id})" class="text-purple-600 hover:text-purple-800 mx-1" title="Imprimir PDF">
                        <i class="fas fa-file-pdf"></i>
                    </button>
                    ${o.estado !== 'recibida' && o.estado !== 'cancelada' ? `
                        <button onclick="cambiarEstado(${o.id})" class="text-orange-600 hover:text-orange-800 mx-1" title="Cambiar Estado">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                    ` : ''}
                    ${o.estado === 'borrador' ? `
                        <button onclick="deleteOrden(${o.id})" class="text-red-600 hover:text-red-800 mx-1" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');

    const totalEl = document.getElementById('total-registros');
    if (totalEl) totalEl.textContent = ordenes.length;
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
        return new Date(dateStr).toLocaleDateString('es-PE');
    } catch {
        return dateStr;
    }
}

// Get estado badge
function getEstadoBadge(estado) {
    const badges = {
        'borrador': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Borrador</span>',
        'enviada': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Enviada</span>',
        'confirmada': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">Confirmada</span>',
        'en_transito': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">En Tránsito</span>',
        'recibida': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Recibida</span>',
        'cancelada': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Cancelada</span>'
    };
    return badges[estado] || `<span class="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">${estado || '-'}</span>`;
}

// ─── UPDATE DASHBOARD ─────────────────────────────────────────────
function updateDashboard() {
    const updateEl = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    updateEl('total-ocs', ordenes.length);

    const estados = { borrador: 0, enviada: 0, confirmada: 0, en_transito: 0, recibida: 0 };
    ordenes.forEach(o => {
        if (estados.hasOwnProperty(o.estado)) estados[o.estado]++;
    });

    updateEl('ocs-borrador', estados.borrador);
    updateEl('ocs-enviada', estados.enviada);
    updateEl('ocs-confirmada', estados.confirmada);
    updateEl('ocs-transito', estados.en_transito);
    updateEl('ocs-recibida', estados.recibida);
}

// ─── FILTER ORDENES ───────────────────────────────────────────────
function filterOrdenes() {
    const search = (document.getElementById('search-orden')?.value || '').toLowerCase();
    const estado = document.getElementById('filter-estado')?.value || '';
    const proveedorId = document.getElementById('filter-proveedor')?.value || '';
    const fecha = document.getElementById('filter-fecha')?.value || '';

    const rows = document.querySelectorAll('#ordenes-table tr');
    let visibleCount = 0;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const matchSearch = !search || text.includes(search);
        const matchEstado = !estado || text.includes(estado);
        const matchFecha = !fecha || text.includes(fecha);
        const match = matchSearch && matchEstado && matchFecha;
        row.style.display = match ? '' : 'none';
        if (match) visibleCount++;
    });

    const totalEl = document.getElementById('total-registros');
    if (totalEl) totalEl.textContent = visibleCount;
}

function clearFilters() {
    const fields = ['search-orden', 'filter-estado', 'filter-proveedor', 'filter-fecha'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    filterOrdenes();
}

// Alias para compatibilidad con llamadas antiguas
function clearOrdenesFilters() { clearFilters(); }

// Filtrar por estado desde KPI
function filtrarEstado(estado) {
    const el = document.getElementById('filter-estado');
    if (el) el.value = estado;
    filterOrdenes();
}

// Alias antiguo
function filtrarEstadoOC(estado) { filtrarEstado(estado); }

// ─── MODAL NUEVA/EDITAR ORDEN ─────────────────────────────────────
function showNewOrdenForm() {
    editingId = null;
    document.getElementById('modal-orden-title').textContent = 'Nueva Orden de Compra';
    document.getElementById('form-orden').reset();

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('orden-fecha-emision').value = today;

    const nextNumber = generateNextOCNumber();
    document.getElementById('orden-numero').value = nextNumber;
    document.getElementById('numero-oc-display').textContent = nextNumber;

    document.getElementById('orden-estado').value = 'borrador';
    document.getElementById('orden-moneda').value = 'PEN';

    productRows = [];
    renderProductRows();
    addProductRow();

    document.getElementById('modal-orden').classList.remove('hidden');
}

function closeOrdenModal() {
    document.getElementById('modal-orden').classList.add('hidden');
}

// ─── PRODUCT ROWS ─────────────────────────────────────────────────
function addProductRow() {
    const newRow = {
        id: Date.now(),
        codigo: '',
        descripcion: '',
        unidad: '',
        cantidad: 1,
        precio_unitario: 0,
        subtotal: 0
    };
    productRows.push(newRow);
    renderProductRows();
}

function removeProductRow(rowId) {
    productRows = productRows.filter(r => r.id !== rowId);
    renderProductRows();
    calculateTotals();
}

function renderProductRows() {
    const tbody = document.getElementById('productos-table-body');
    if (!tbody) return;

    if (productRows.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-4 py-3 text-center text-gray-500 text-sm">
                    No hay productos agregados. Haga clic en "Agregar Producto"
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = productRows.map((row) => `
        <tr data-row-id="${row.id}">
            <td class="px-3 py-2 border-b">
                <input type="text"
                       value="${row.codigo || ''}"
                       data-row-id="${row.id}"
                       data-field="codigo"
                       list="materiales-list"
                       class="codigo-input w-full px-2 py-1 border border-gray-300 rounded text-sm"
                       placeholder="Código">
            </td>
            <td class="px-3 py-2 border-b">
                <input type="text"
                       value="${row.descripcion || ''}"
                       data-row-id="${row.id}"
                       data-field="descripcion"
                       class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                       placeholder="Descripción del producto">
            </td>
            <td class="px-3 py-2 border-b">
                <input type="text"
                       value="${row.unidad || ''}"
                       data-row-id="${row.id}"
                       data-field="unidad"
                       class="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                       placeholder="Und">
            </td>
            <td class="px-3 py-2 border-b">
                <input type="number"
                       value="${row.cantidad || 1}"
                       data-row-id="${row.id}"
                       data-field="cantidad"
                       min="0.01"
                       step="0.01"
                       class="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-center">
            </td>
            <td class="px-3 py-2 border-b">
                <input type="number"
                       value="${row.precio_unitario || 0}"
                       data-row-id="${row.id}"
                       data-field="precio_unitario"
                       min="0"
                       step="0.01"
                       class="w-28 px-2 py-1 border border-gray-300 rounded text-sm text-right">
            </td>
            <td class="px-3 py-2 border-b text-right text-sm font-semibold">
                ${(row.subtotal || 0).toFixed(2)}
            </td>
            <td class="px-3 py-2 border-b text-center">
                <button type="button" onclick="removeProductRow(${row.id})" class="text-red-600 hover:text-red-800" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    // Datalist para autocompletado
    let datalist = document.getElementById('materiales-list');
    if (!datalist) {
        datalist = document.createElement('datalist');
        datalist.id = 'materiales-list';
        document.body.appendChild(datalist);
    }
    datalist.innerHTML = materiales.map(m => `<option value="${m.codigo}">${m.nombre}</option>`).join('');

    // Event listeners
    tbody.querySelectorAll('input').forEach(input => {
        const rowId = parseInt(input.getAttribute('data-row-id'));
        const field = input.getAttribute('data-field');

        if (field === 'cantidad' || field === 'precio_unitario') {
            input.addEventListener('input', function() {
                const value = parseFloat(this.value) || (field === 'cantidad' ? 1 : 0);
                updateProductRow(rowId, field, value);
            });
        } else if (field) {
            input.addEventListener('change', function() {
                updateProductRow(rowId, field, this.value);
            });
        }
    });
}

function updateProductRow(rowId, field, value) {
    const row = productRows.find(r => r.id === rowId);
    if (!row) return;

    row[field] = value;

    if (field === 'codigo') {
        const material = materiales.find(m => m.codigo === value);
        if (material) {
            row.descripcion = material.nombre;
            row.unidad = material.unidad;
            row.precio_unitario = material.precio_unitario || 0;
            const inputs = document.querySelectorAll(`input[data-row-id="${rowId}"]`);
            inputs.forEach(inp => {
                const f = inp.getAttribute('data-field');
                if (f === 'descripcion') inp.value = row.descripcion;
                else if (f === 'unidad') inp.value = row.unidad;
                else if (f === 'precio_unitario') inp.value = row.precio_unitario;
            });
        }
    }

    row.subtotal = (parseFloat(row.cantidad) || 0) * (parseFloat(row.precio_unitario) || 0);

    const subtotalCell = document.querySelector(`tr[data-row-id="${rowId}"] td:nth-child(6)`);
    if (subtotalCell) subtotalCell.textContent = (row.subtotal || 0).toFixed(2);

    calculateTotals();
}

function calculateTotals() {
    const subtotal = productRows.reduce((sum, row) => sum + (row.subtotal || 0), 0);
    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    const moneda = document.getElementById('orden-moneda')?.value || 'PEN';
    const symbol = moneda === 'USD' ? '$' : 'S/';

    const subtotalEl = document.getElementById('subtotal-display');
    const igvEl = document.getElementById('igv-display');
    const totalEl = document.getElementById('total-display');

    if (subtotalEl) subtotalEl.textContent = `${symbol} ${subtotal.toFixed(2)}`;
    if (igvEl) igvEl.textContent = `${symbol} ${igv.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `${symbol} ${total.toFixed(2)}`;
}

// ─── EDIT ORDEN ───────────────────────────────────────────────────
function editOrden(id) {
    const orden = ordenes.find(o => o.id === id);
    if (!orden || orden.estado !== 'borrador') {
        showToast('Solo se pueden editar órdenes en borrador', 'error');
        return;
    }

    editingId = id;
    document.getElementById('modal-orden-title').textContent = 'Editar Orden de Compra';
    document.getElementById('orden-numero').value = orden.numero_oc || '';
    document.getElementById('numero-oc-display').textContent = orden.numero_oc || '';
    document.getElementById('orden-proveedor').value = orden.proveedor_id || '';
    document.getElementById('orden-estado').value = orden.estado || 'borrador';
    document.getElementById('orden-fecha-emision').value = orden.fecha_orden ? orden.fecha_orden.split('T')[0] : '';
    document.getElementById('orden-fecha-entrega').value = orden.fecha_entrega_requerida ? orden.fecha_entrega_requerida.split('T')[0] : '';
    document.getElementById('orden-condicion-pago').value = orden.forma_pago || 'contado';
    document.getElementById('orden-moneda').value = orden.moneda || 'PEN';
    document.getElementById('orden-observaciones').value = orden.observaciones || '';

    // Reconstruir producto desde campos de la OC
    productRows = [{
        id: Date.now(),
        codigo: orden.material_codigo || '',
        descripcion: orden.descripcion || orden.material_nombre || '',
        unidad: orden.unidad_medida || '',
        cantidad: parseFloat(orden.cantidad) || 1,
        precio_unitario: parseFloat(orden.precio_unitario) || 0,
        subtotal: parseFloat(orden.subtotal) || 0
    }];

    renderProductRows();
    calculateTotals();

    document.getElementById('modal-orden').classList.remove('hidden');
}

// ─── VIEW ORDEN ───────────────────────────────────────────────────
function viewOrden(id) {
    const orden = ordenes.find(o => o.id === id);
    if (!orden) return;

    const monedaSymbol = orden.moneda === 'USD' ? '$' : 'S/';
    const total = parseFloat(orden.total_final) || 0;

    const detalles = `
ORDEN DE COMPRA

Número: ${orden.numero_oc || '-'}
Proveedor: ${orden.proveedor_nombre || '-'}
Fecha Orden: ${formatDate(orden.fecha_orden)}
Fecha Entrega: ${formatDate(orden.fecha_entrega_requerida)}
Estado: ${(orden.estado || '-').toUpperCase().replace('_', ' ')}
Forma de Pago: ${orden.forma_pago || '-'}
Moneda: ${orden.moneda || 'PEN'}

PRODUCTO:
${orden.descripcion || orden.material_nombre || '-'}
Cantidad: ${orden.cantidad || '-'} ${orden.unidad_medida || ''}
Precio Unitario: ${monedaSymbol} ${parseFloat(orden.precio_unitario || 0).toFixed(2)}
Subtotal: ${monedaSymbol} ${parseFloat(orden.subtotal || 0).toFixed(2)}

IGV (${orden.igv_porcentaje || 18}%): ${monedaSymbol} ${(total - parseFloat(orden.subtotal || 0)).toFixed(2)}
TOTAL: ${monedaSymbol} ${total.toFixed(2)}

${orden.observaciones ? 'Observaciones: ' + orden.observaciones : ''}
    `.trim();

    alert(detalles);
}

// ─── DELETE ORDEN ─────────────────────────────────────────────────
async function deleteOrden(id) {
    const orden = ordenes.find(o => o.id === id);
    if (!orden) return;

    if (orden.estado !== 'borrador') {
        showToast('Solo se pueden eliminar órdenes en borrador', 'error');
        return;
    }

    if (!confirm(`¿Eliminar la orden ${orden.numero_oc}?`)) return;

    try {
        const response = await fetch(`/api/logistica/compras/${id}`, { method: 'DELETE' });
        if (response.ok) {
            ordenes = ordenes.filter(o => o.id !== id);
            renderOrdenes();
            updateDashboard();
            showToast('Orden eliminada correctamente', 'success');
        } else {
            const err = await response.json().catch(() => ({}));
            showToast('Error al eliminar: ' + (err.error || response.status), 'error');
        }
    } catch (error) {
        console.error('Error al eliminar:', error);
        showToast('Error de conexión al eliminar', 'error');
    }
}

// ─── CAMBIAR ESTADO ───────────────────────────────────────────────
async function cambiarEstado(id) {
    const orden = ordenes.find(o => o.id === id);
    if (!orden) return;

    const estados = {
        'borrador': 'enviada',
        'enviada': 'confirmada',
        'confirmada': 'en_transito',
        'en_transito': 'recibida'
    };

    const nuevoEstado = estados[orden.estado];
    if (!nuevoEstado) return;

    const mensajes = {
        'enviada': '¿Enviar esta orden al proveedor?',
        'confirmada': '¿Confirmar que el proveedor aceptó la orden?',
        'en_transito': '¿Marcar como en tránsito (productos despachados)?',
        'recibida': '¿Confirmar recepción de productos?'
    };

    if (!confirm(mensajes[nuevoEstado])) return;

    try {
        const response = await fetch(`/api/logistica/compras/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        if (response.ok) {
            await loadOrdenes();
            showToast(`Estado actualizado a: ${nuevoEstado.replace('_', ' ').toUpperCase()}`, 'success');
        } else {
            const err = await response.json().catch(() => ({}));
            showToast('Error al cambiar estado: ' + (err.error || response.status), 'error');
        }
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        showToast('Error de conexión', 'error');
    }
}

// ─── SUBMIT ORDEN ─────────────────────────────────────────────────
async function submitOrden(e) {
    e.preventDefault();

    if (productRows.length === 0) {
        showToast('Debe agregar al menos un producto', 'error');
        return;
    }

    const proveedor_id = parseInt(document.getElementById('orden-proveedor').value);
    if (!proveedor_id || isNaN(proveedor_id)) {
        showToast('Debe seleccionar un proveedor', 'error');
        return;
    }

    const numero_oc = document.getElementById('orden-numero').value;
    if (!numero_oc) {
        showToast('El número de OC es requerido', 'error');
        return;
    }

    const fecha_orden = document.getElementById('orden-fecha-emision').value;
    if (!fecha_orden) {
        showToast('La fecha de emisión es requerida', 'error');
        return;
    }

    // Calcular totales
    const subtotal = productRows.reduce((sum, row) => sum + (row.subtotal || 0), 0);
    const igv_porcentaje = 18;
    const igv_monto = subtotal * (igv_porcentaje / 100);
    const total_final = subtotal + igv_monto;

    // Primer producto (el backend soporta una línea por OC)
    const firstRow = productRows[0] || {};
    // Combinar descripciones si hay más de una fila
    const descripcionCombinada = productRows.length > 1
        ? productRows.map((r, i) => `${i+1}. ${r.descripcion || r.codigo} (${r.cantidad} ${r.unidad})`).join(' | ')
        : (firstRow.descripcion || firstRow.codigo || '');

    const data = {
        numero_oc,
        fecha_orden,
        fecha_entrega_requerida: document.getElementById('orden-fecha-entrega').value || null,
        proveedor_id,
        estado: document.getElementById('orden-estado').value || 'borrador',
        forma_pago: document.getElementById('orden-condicion-pago').value || 'contado',
        moneda: document.getElementById('orden-moneda').value || 'PEN',
        observaciones: document.getElementById('orden-observaciones').value || '',
        descripcion: descripcionCombinada,
        cantidad: parseFloat(firstRow.cantidad) || 1,
        unidad_medida: firstRow.unidad || 'und',
        precio_unitario: parseFloat(firstRow.precio_unitario) || 0,
        subtotal,
        igv_porcentaje,
        total_final,
        user_crea: 'Admin'
    };

    try {
        let response;
        if (editingId) {
            response = await fetch(`/api/logistica/compras/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch('/api/logistica/compras', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        if (response.ok) {
            closeOrdenModal();
            await loadOrdenes();
            showToast(editingId ? 'Orden actualizada correctamente' : 'Orden creada correctamente', 'success');
            editingId = null;
        } else {
            const err = await response.json().catch(() => ({}));
            const msg = err.error || err.details || `Error ${response.status}`;
            showToast('Error al guardar: ' + msg, 'error');
        }
    } catch (error) {
        console.error('Error al guardar orden:', error);
        showToast('Error de conexión al guardar', 'error');
    }
}

// ─── IMPRIMIR ORDEN (PDF del servidor) ───────────────────────────
function imprimirOrden(id) {
    window.open(`/api/logistica/compras/${id}/pdf`, '_blank');
}

// ─── EXPORTAR EXCEL ───────────────────────────────────────────────
function exportarOrdenes() {
    if (!ordenes || ordenes.length === 0) {
        showToast('No hay datos para exportar', 'error');
        return;
    }

    const data = ordenes.map(o => ({
        'Número OC': o.numero_oc || '',
        'Proveedor': o.proveedor_nombre || '',
        'Fecha Orden': o.fecha_orden ? o.fecha_orden.split('T')[0] : '',
        'Fecha Entrega': o.fecha_entrega_requerida ? o.fecha_entrega_requerida.split('T')[0] : '',
        'Estado': o.estado || '',
        'Forma Pago': o.forma_pago || '',
        'Moneda': o.moneda || 'PEN',
        'Subtotal': parseFloat(o.subtotal || 0).toFixed(2),
        'IGV %': o.igv_porcentaje || 18,
        'Total': parseFloat(o.total_final || 0).toFixed(2),
        'Descripción': o.descripcion || '',
        'Observaciones': o.observaciones || '',
        'Creado Por': o.user_crea || ''
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Órdenes de Compra');
    XLSX.writeFile(wb, `Ordenes_Compra_${new Date().toISOString().split('T')[0]}.xlsx`);

    showToast('Excel exportado correctamente', 'success');
}

// ─── TOAST ────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 text-white ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'info' ? 'bg-blue-500' : 'bg-gray-500'
    }`;
    toast.classList.remove('hidden');

    setTimeout(() => toast.classList.add('hidden'), 3000);
}
