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
    // DOM already loaded, initialize immediately
    setTimeout(initOrdenesCompra, 100);
}

// Load proveedores
async function loadProveedores() {
    try {
        const response = await fetch('/api/proveedores');
        if (response.ok) {
            proveedores = await response.json();
        } else {
            proveedores = generateSampleProveedores();
        }
        fillProveedoresSelect();
    } catch (error) {
        console.error('Error:', error);
        proveedores = generateSampleProveedores();
        fillProveedoresSelect();
    }
}

// Generate sample proveedores (simplified)
function generateSampleProveedores() {
    return [
        { id: 1, ruc: '20123456789', razon_social: 'Distribuidora Industrial SAC', nombre_comercial: 'DISAINSA' },
        { id: 2, ruc: '20987654321', razon_social: 'Herramientas y Equipos del Norte EIRL', nombre_comercial: 'HENOR' },
        { id: 3, ruc: '20555888999', razon_social: 'Comercial EPP Seguro SAC', nombre_comercial: 'EPP Seguro' },
        { id: 4, ruc: '20777666555', razon_social: 'Servicios Técnicos Industriales SRL', nombre_comercial: 'SETEIN' },
        { id: 5, ruc: '20111222333', razon_social: 'Importadora de Equipos Técnicos SAC', nombre_comercial: 'IMPETEC' }
    ];
}

// Load materiales
async function loadMateriales() {
    try {
        const response = await fetch('/api/materiales');
        if (response.ok) {
            materiales = await response.json();
        } else {
            materiales = generateSampleMateriales();
        }
    } catch (error) {
        console.error('Error:', error);
        materiales = generateSampleMateriales();
    }
}

// Generate sample materiales
function generateSampleMateriales() {
    return [
        { id: 1, codigo: 'MAT-001', nombre: 'Acero Inoxidable 304', unidad: 'kg', precio_unitario: 25.50 },
        { id: 2, codigo: 'MAT-002', nombre: 'Tubo PVC 2"', unidad: 'unidad', precio_unitario: 18.00 },
        { id: 3, codigo: 'MAT-003', nombre: 'Cable Eléctrico 12 AWG', unidad: 'metro', precio_unitario: 3.50 },
        { id: 4, codigo: 'MAT-004', nombre: 'Tornillo Hexagonal M8', unidad: 'unidad', precio_unitario: 0.80 },
        { id: 5, codigo: 'MAT-005', nombre: 'Pintura Anticorrosiva', unidad: 'litro', precio_unitario: 45.00 },
        { id: 6, codigo: 'MAT-006', nombre: 'Rodamiento SKF 6205', unidad: 'unidad', precio_unitario: 85.00 },
        { id: 7, codigo: 'MAT-007', nombre: 'Válvula de Bola 1/2"', unidad: 'unidad', precio_unitario: 32.00 },
        { id: 8, codigo: 'MAT-008', nombre: 'Soldadura E6011', unidad: 'kg', precio_unitario: 28.00 }
    ];
}

// Fill proveedores select
function fillProveedoresSelect() {
    const selects = ['orden-proveedor', 'filter-proveedor-oc'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        const currentValue = select.value;
        select.innerHTML = selectId === 'orden-proveedor' 
            ? '<option value="">Seleccione un proveedor...</option>'
            : '<option value="">Todos los Proveedores</option>';
        
        proveedores.forEach(p => {
            select.innerHTML += `<option value="${p.id}">${p.razon_social} (${p.ruc})</option>`;
        });
        
        if (currentValue) select.value = currentValue;
    });
}

// Load ordenes
async function loadOrdenes() {
    try {
        const response = await fetch('/api/ordenes-compra');
        if (response.ok) {
            ordenes = await response.json();
        } else {
            ordenes = generateSampleOrdenes();
        }
        renderOrdenes();
        updateDashboard();
    } catch (error) {
        console.error('Error:', error);
        ordenes = generateSampleOrdenes();
        renderOrdenes();
        updateDashboard();
    }
}

// Generate sample ordenes
function generateSampleOrdenes() {
    return [
        {
            id: 1,
            numero: 'OC-2026-0001',
            proveedor_id: 1,
            proveedor_nombre: 'Distribuidora Industrial SAC',
            fecha_emision: '2026-02-20',
            fecha_entrega: '2026-02-27',
            estado: 'enviada',
            condicion_pago: 'credito_30',
            moneda: 'PEN',
            subtotal: 2500.00,
            igv: 450.00,
            total: 2950.00,
            observaciones: 'Entrega en horario de oficina',
            productos: [
                { codigo: 'MAT-001', descripcion: 'Acero Inoxidable 304', unidad: 'kg', cantidad: 50, precio_unitario: 25.50, subtotal: 1275.00 },
                { codigo: 'MAT-005', descripcion: 'Pintura Anticorrosiva', unidad: 'litro', cantidad: 20, precio_unitario: 45.00, subtotal: 900.00 },
                { codigo: 'MAT-007', descripcion: 'Válvula de Bola 1/2"', unidad: 'unidad', cantidad: 10, precio_unitario: 32.50, subtotal: 325.00 }
            ],
            creado_por: 'Admin',
            fecha_creacion: '2026-02-20'
        },
        {
            id: 2,
            numero: 'OC-2026-0002',
            proveedor_id: 2,
            proveedor_nombre: 'Herramientas y Equipos del Norte EIRL',
            fecha_emision: '2026-02-22',
            fecha_entrega: '2026-02-29',
            estado: 'confirmada',
            condicion_pago: 'credito_45',
            moneda: 'PEN',
            subtotal: 1800.00,
            igv: 324.00,
            total: 2124.00,
            observaciones: '',
            productos: [
                { codigo: 'MAT-006', descripcion: 'Rodamiento SKF 6205', unidad: 'unidad', cantidad: 20, precio_unitario: 85.00, subtotal: 1700.00 },
                { codigo: 'MAT-004', descripcion: 'Tornillo Hexagonal M8', unidad: 'unidad', cantidad: 125, precio_unitario: 0.80, subtotal: 100.00 }
            ],
            creado_por: 'Admin',
            fecha_creacion: '2026-02-22'
        },
        {
            id: 3,
            numero: 'OC-2026-0003',
            proveedor_id: 3,
            proveedor_nombre: 'Comercial EPP Seguro SAC',
            fecha_emision: '2026-02-24',
            fecha_entrega: '2026-03-02',
            estado: 'en_transito',
            condicion_pago: 'credito_15',
            moneda: 'PEN',
            subtotal: 950.00,
            igv: 171.00,
            total: 1121.00,
            observaciones: 'Material urgente para OT-2024-005',
            productos: [
                { codigo: 'MAT-003', descripcion: 'Cable Eléctrico 12 AWG', unidad: 'metro', cantidad: 200, precio_unitario: 3.50, subtotal: 700.00 },
                { codigo: 'MAT-008', descripcion: 'Soldadura E6011', unidad: 'kg', cantidad: 9, precio_unitario: 28.00, subtotal: 252.00 }
            ],
            creado_por: 'Admin',
            fecha_creacion: '2026-02-24'
        },
        {
            id: 4,
            numero: 'OC-2026-0004',
            proveedor_id: 1,
            proveedor_nombre: 'Distribuidora Industrial SAC',
            fecha_emision: '2026-02-25',
            fecha_entrega: '2026-03-05',
            estado: 'borrador',
            condicion_pago: 'credito_30',
            moneda: 'PEN',
            subtotal: 720.00,
            igv: 129.60,
            total: 849.60,
            observaciones: 'Revisar stock antes de confirmar',
            productos: [
                { codigo: 'MAT-002', descripcion: 'Tubo PVC 2"', unidad: 'unidad', cantidad: 40, precio_unitario: 18.00, subtotal: 720.00 }
            ],
            creado_por: 'Admin',
            fecha_creacion: '2026-02-25'
        },
        {
            id: 5,
            numero: 'OC-2026-0005',
            proveedor_id: 4,
            proveedor_nombre: 'Servicios Técnicos Industriales SRL',
            fecha_emision: '2026-02-18',
            fecha_entrega: '2026-02-25',
            estado: 'recibida',
            condicion_pago: 'contado',
            moneda: 'PEN',
            subtotal: 3200.00,
            igv: 576.00,
            total: 3776.00,
            observaciones: 'Recibido conforme - Factura N° F001-12345',
            productos: [
                { codigo: 'MAT-001', descripcion: 'Acero Inoxidable 304', unidad: 'kg', cantidad: 100, precio_unitario: 25.50, subtotal: 2550.00 },
                { codigo: 'MAT-006', descripcion: 'Rodamiento SKF 6205', unidad: 'unidad', cantidad: 5, precio_unitario: 85.00, subtotal: 425.00 },
                { codigo: 'MAT-007', descripcion: 'Válvula de Bola 1/2"', unidad: 'unidad', cantidad: 7, precio_unitario: 32.00, subtotal: 224.00 }
            ],
            creado_por: 'Admin',
            fecha_creacion: '2026-02-18',
            fecha_recepcion: '2026-02-25'
        }
    ];
}

// Generate next OC number
function generateNextOCNumber() {
    const year = new Date().getFullYear();
    const prefix = `OC-${year}-`;
    
    const existingNumbers = ordenes
        .filter(o => o.numero.startsWith(prefix))
        .map(o => parseInt(o.numero.split('-')[2]))
        .filter(n => !isNaN(n));
    
    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const nextNumber = (maxNumber + 1).toString().padStart(4, '0');
    
    return `${prefix}${nextNumber}`;
}

// Render ordenes
function renderOrdenes() {
    const tbody = document.getElementById('ordenes-table');
    if (!tbody) return; // Element not found, skip rendering
    
    if (ordenes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-shopping-cart text-3xl mb-2"></i>
                    <p>No hay órdenes de compra registradas</p>
                </td>
            </tr>
        `;
        const totalElement = document.getElementById('total-registros-oc');
        if (totalElement) totalElement.textContent = '0';
        return;
    }
    
    tbody.innerHTML = ordenes.map(o => {
        const estadoBadge = getEstadoBadge(o.estado);
        const monedaSymbol = o.moneda === 'USD' ? '$' : 'S/';
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-bold text-green-700">${o.numero}</td>
                <td class="px-4 py-3 text-sm">${o.proveedor_nombre}</td>
                <td class="px-4 py-3 text-center text-sm">${new Date(o.fecha_emision).toLocaleDateString('es-ES')}</td>
                <td class="px-4 py-3 text-center text-sm">${new Date(o.fecha_entrega).toLocaleDateString('es-ES')}</td>
                <td class="px-4 py-3 text-right text-sm font-bold">${monedaSymbol} ${o.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
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
                    ${o.estado !== 'recibida' ? `
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
    
    const totalElement = document.getElementById('total-registros-oc');
    if (totalElement) totalElement.textContent = ordenes.length;
}

// Get estado badge
function getEstadoBadge(estado) {
    const badges = {
        'borrador': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">📄 Borrador</span>',
        'enviada': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">📤 Enviada</span>',
        'confirmada': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">✅ Confirmada</span>',
        'en_transito': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">🚚 En Tránsito</span>',
        'recibida': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">✔️ Recibida</span>'
    };
    return badges[estado] || '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">-</span>';
}

// Update dashboard
function updateDashboard() {
    const updateElement = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };
    
    updateElement('total-ocs', ordenes.length);
    
    const estados = {
        borrador: 0,
        enviada: 0,
        confirmada: 0,
        en_transito: 0,
        recibida: 0
    };
    
    ordenes.forEach(o => {
        if (estados.hasOwnProperty(o.estado)) {
            estados[o.estado]++;
        }
    });
    
    updateElement('ocs-borrador', estados.borrador);
    updateElement('ocs-enviada', estados.enviada);
    updateElement('ocs-confirmada', estados.confirmada);
    updateElement('ocs-transito', estados.en_transito);
    updateElement('ocs-recibida', estados.recibida);
}

// Filter ordenes
function filterOrdenes() {
    const search = document.getElementById('search-orden').value.toLowerCase();
    const estado = document.getElementById('filter-estado-oc').value;
    const proveedorId = document.getElementById('filter-proveedor-oc').value;
    const fecha = document.getElementById('filter-fecha-oc').value;
    
    const rows = document.querySelectorAll('#ordenes-table tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const match = text.includes(search) && 
                     (!estado || text.includes(estado)) &&
                     (!proveedorId || row.innerHTML.includes(`proveedor_id: ${proveedorId}`)) &&
                     (!fecha || text.includes(fecha));
        row.style.display = match ? '' : 'none';
        if (match) visibleCount++;
    });
    
    document.getElementById('total-registros-oc').textContent = visibleCount;
}

// Clear filters
function clearOrdenesFilters() {
    document.getElementById('search-orden').value = '';
    document.getElementById('filter-estado-oc').value = '';
    document.getElementById('filter-proveedor-oc').value = '';
    document.getElementById('filter-fecha-oc').value = '';
    filterOrdenes();
}

// Filtrar por estado desde KPI
function filtrarEstadoOC(estado) {
    document.getElementById('filter-estado-oc').value = estado;
    filterOrdenes();
}

// Modal orden
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

// Product rows management
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
    
    tbody.innerHTML = productRows.map((row, index) => `
        <tr>
            <td class="px-3 py-2 border-b">
                <input type="text" 
                       value="${row.codigo}" 
                       onchange="updateProductRow(${row.id}, 'codigo', this.value)"
                       list="materiales-list"
                       class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                       placeholder="MAT-001">
            </td>
            <td class="px-3 py-2 border-b">
                <input type="text" 
                       value="${row.descripcion}" 
                       onchange="updateProductRow(${row.id}, 'descripcion', this.value)"
                       class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                       placeholder="Descripción del producto">
            </td>
            <td class="px-3 py-2 border-b">
                <input type="text" 
                       value="${row.unidad}" 
                       onchange="updateProductRow(${row.id}, 'unidad', this.value)"
                       class="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                       placeholder="Und">
            </td>
            <td class="px-3 py-2 border-b">
                <input type="number" 
                       value="${row.cantidad}" 
                       onchange="updateProductRow(${row.id}, 'cantidad', parseFloat(this.value))"
                       min="0.01"
                       step="0.01"
                       class="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                       placeholder="1">
            </td>
            <td class="px-3 py-2 border-b">
                <input type="number" 
                       value="${row.precio_unitario}" 
                       onchange="updateProductRow(${row.id}, 'precio_unitario', parseFloat(this.value))"
                       min="0"
                       step="0.01"
                       class="w-28 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                       placeholder="0.00">
            </td>
            <td class="px-3 py-2 border-b text-right text-sm font-semibold">
                ${row.subtotal.toFixed(2)}
            </td>
            <td class="px-3 py-2 border-b text-center">
                <button type="button" onclick="removeProductRow(${row.id})" class="text-red-600 hover:text-red-800" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    // Add datalist for material codes
    if (!document.getElementById('materiales-list')) {
        const datalist = document.createElement('datalist');
        datalist.id = 'materiales-list';
        datalist.innerHTML = materiales.map(m => `<option value="${m.codigo}">${m.nombre}</option>`).join('');
        document.body.appendChild(datalist);
    }
}

function updateProductRow(rowId, field, value) {
    const row = productRows.find(r => r.id === rowId);
    if (!row) return;
    
    row[field] = value;
    
    // Auto-fill from materiales if codigo matches
    if (field === 'codigo') {
        const material = materiales.find(m => m.codigo === value);
        if (material) {
            row.descripcion = material.nombre;
            row.unidad = material.unidad;
            row.precio_unitario = material.precio_unitario || 0;
        }
    }
    
    // Recalculate subtotal
    row.subtotal = row.cantidad * row.precio_unitario;
    
    renderProductRows();
    calculateTotals();
}

function calculateTotals() {
    const subtotal = productRows.reduce((sum, row) => sum + row.subtotal, 0);
    const igv = subtotal * 0.18;
    const total = subtotal + igv;
    
    const moneda = document.getElementById('orden-moneda').value;
    const symbol = moneda === 'USD' ? '$' : 'S/';
    
    document.getElementById('subtotal-display').textContent = `${symbol} ${subtotal.toFixed(2)}`;
    document.getElementById('igv-display').textContent = `${symbol} ${igv.toFixed(2)}`;
    document.getElementById('total-display').textContent = `${symbol} ${total.toFixed(2)}`;
}

// Edit orden
function editOrden(id) {
    const orden = ordenes.find(o => o.id === id);
    if (!orden || orden.estado !== 'borrador') {
        showToast('⚠️ Solo se pueden editar órdenes en borrador', 'error');
        return;
    }
    
    editingId = id;
    document.getElementById('modal-orden-title').textContent = 'Editar Orden de Compra';
    document.getElementById('orden-numero').value = orden.numero;
    document.getElementById('numero-oc-display').textContent = orden.numero;
    document.getElementById('orden-proveedor').value = orden.proveedor_id;
    document.getElementById('orden-estado').value = orden.estado;
    document.getElementById('orden-fecha-emision').value = orden.fecha_emision;
    document.getElementById('orden-fecha-entrega').value = orden.fecha_entrega;
    document.getElementById('orden-condicion-pago').value = orden.condicion_pago;
    document.getElementById('orden-moneda').value = orden.moneda;
    document.getElementById('orden-observaciones').value = orden.observaciones || '';
    
    productRows = orden.productos.map(p => ({
        id: Date.now() + Math.random(),
        codigo: p.codigo,
        descripcion: p.descripcion,
        unidad: p.unidad,
        cantidad: p.cantidad,
        precio_unitario: p.precio_unitario,
        subtotal: p.subtotal
    }));
    
    renderProductRows();
    calculateTotals();
    
    document.getElementById('modal-orden').classList.remove('hidden');
}

// View orden
function viewOrden(id) {
    const orden = ordenes.find(o => o.id === id);
    if (!orden) return;
    
    const productos = orden.productos.map((p, i) => 
        `${i + 1}. ${p.descripcion} (${p.codigo}) - ${p.cantidad} ${p.unidad} x S/ ${p.precio_unitario.toFixed(2)} = S/ ${p.subtotal.toFixed(2)}`
    ).join('\n');
    
    const monedaSymbol = orden.moneda === 'USD' ? '$' : 'S/';
    
    const detalles = `
📄 ORDEN DE COMPRA

🔢 Número: ${orden.numero}
🏢 Proveedor: ${orden.proveedor_nombre}
📅 Fecha Emisión: ${new Date(orden.fecha_emision).toLocaleDateString('es-ES')}
📆 Fecha Entrega: ${new Date(orden.fecha_entrega).toLocaleDateString('es-ES')}
🟢 Estado: ${orden.estado.toUpperCase().replace('_', ' ')}
💳 Condición Pago: ${orden.condicion_pago.replace('_', ' ')}
💰 Moneda: ${orden.moneda}

📦 PRODUCTOS:
${productos}

💵 TOTALES:
Subtotal: ${monedaSymbol} ${orden.subtotal.toFixed(2)}
IGV (18%): ${monedaSymbol} ${orden.igv.toFixed(2)}
TOTAL: ${monedaSymbol} ${orden.total.toFixed(2)}

${orden.observaciones ? '📝 Observaciones: ' + orden.observaciones : ''}
👤 Creado por: ${orden.creado_por}
📅 Fecha Creación: ${new Date(orden.fecha_creacion).toLocaleDateString('es-ES')}
${orden.fecha_recepcion ? '✅ Recibido: ' + new Date(orden.fecha_recepcion).toLocaleDateString('es-ES') : ''}
    `.trim();
    
    alert(detalles);
}

// Delete orden
function deleteOrden(id) {
    const orden = ordenes.find(o => o.id === id);
    if (!orden) return;
    
    if (orden.estado !== 'borrador') {
        showToast('⚠️ Solo se pueden eliminar órdenes en borrador', 'error');
        return;
    }
    
    if (!confirm(`¿Eliminar la orden ${orden.numero}?`)) return;
    
    ordenes = ordenes.filter(o => o.id !== id);
    renderOrdenes();
    updateDashboard();
    showToast('✅ Orden eliminada', 'success');
}

// Cambiar estado
function cambiarEstado(id) {
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
    
    orden.estado = nuevoEstado;
    
    if (nuevoEstado === 'recibida') {
        orden.fecha_recepcion = new Date().toISOString().split('T')[0];
    }
    
    renderOrdenes();
    updateDashboard();
    showToast(`✅ Estado actualizado a: ${nuevoEstado.replace('_', ' ').toUpperCase()}`, 'success');
}

// Submit orden
async function submitOrden(e) {
    e.preventDefault();
    
    if (productRows.length === 0) {
        showToast('⚠️ Debe agregar al menos un producto', 'error');
        return;
    }
    
    const proveedor_id = parseInt(document.getElementById('orden-proveedor').value);
    const proveedor = proveedores.find(p => p.id === proveedor_id);
    
    const subtotal = productRows.reduce((sum, row) => sum + row.subtotal, 0);
    const igv = subtotal * 0.18;
    const total = subtotal + igv;
    
    const data = {
        numero: document.getElementById('orden-numero').value,
        proveedor_id: proveedor_id,
        proveedor_nombre: proveedor ? proveedor.razon_social : '',
        fecha_emision: document.getElementById('orden-fecha-emision').value,
        fecha_entrega: document.getElementById('orden-fecha-entrega').value,
        estado: document.getElementById('orden-estado').value,
        condicion_pago: document.getElementById('orden-condicion-pago').value,
        moneda: document.getElementById('orden-moneda').value,
        subtotal: subtotal,
        igv: igv,
        total: total,
        observaciones: document.getElementById('orden-observaciones').value,
        productos: productRows.map(({ id, ...rest }) => rest),
        creado_por: 'Admin',
        fecha_creacion: new Date().toISOString().split('T')[0]
    };
    
    if (editingId) {
        const index = ordenes.findIndex(o => o.id === editingId);
        ordenes[index] = { ...ordenes[index], ...data };
        showToast('✅ Orden actualizada', 'success');
    } else {
        data.id = ordenes.length > 0 ? Math.max(...ordenes.map(o => o.id)) + 1 : 1;
        ordenes.push(data);
        showToast('✅ Orden creada', 'success');
    }
    
    closeOrdenModal();
    renderOrdenes();
    updateDashboard();
}

// Imprimir orden (PDF)
function imprimirOrden(id) {
    const orden = ordenes.find(o => o.id === id);
    if (!orden) return;
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const monedaSymbol = orden.moneda === 'USD' ? '$' : 'S/';
    
    // Header
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('ORDEN DE COMPRA', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`N° ${orden.numero}`, 105, 28, { align: 'center' });
    
    // Company info (left)
    doc.setFontSize(10);
    doc.text('ERP HPyK - Taller Industrial', 20, 45);
    doc.text('RUC: 20123456789', 20, 50);
    doc.text('Av. Industrial 123, Lima', 20, 55);
    doc.text('Telf: +51 999 888 777', 20, 60);
    
    // Order info (right)
    doc.text(`Fecha Emisión: ${new Date(orden.fecha_emision).toLocaleDateString('es-ES')}`, 120, 45);
    doc.text(`Fecha Entrega: ${new Date(orden.fecha_entrega).toLocaleDateString('es-ES')}`, 120, 50);
    doc.text(`Estado: ${orden.estado.toUpperCase().replace('_', ' ')}`, 120, 55);
    doc.text(`Condición: ${orden.condicion_pago.replace('_', ' ')}`, 120, 60);
    
    // Provider info
    doc.setFont(undefined, 'bold');
    doc.text('PROVEEDOR:', 20, 75);
    doc.setFont(undefined, 'normal');
    doc.text(orden.proveedor_nombre, 20, 80);
    
    // Products table
    const tableData = orden.productos.map(p => [
        p.codigo,
        p.descripcion,
        p.unidad,
        p.cantidad.toString(),
        `${monedaSymbol} ${p.precio_unitario.toFixed(2)}`,
        `${monedaSymbol} ${p.subtotal.toFixed(2)}`
    ]);
    
    doc.autoTable({
        startY: 90,
        head: [['Código', 'Descripción', 'Unid.', 'Cant.', 'P. Unit.', 'Subtotal']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94] },
        margin: { left: 20, right: 20 }
    });
    
    // Totals
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal: ${monedaSymbol} ${orden.subtotal.toFixed(2)}`, 140, finalY);
    doc.text(`IGV (18%): ${monedaSymbol} ${orden.igv.toFixed(2)}`, 140, finalY + 5);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text(`TOTAL: ${monedaSymbol} ${orden.total.toFixed(2)}`, 140, finalY + 12);
    
    // Observations
    if (orden.observaciones) {
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.text('Observaciones:', 20, finalY + 25);
        doc.text(orden.observaciones, 20, finalY + 30, { maxWidth: 170 });
    }
    
    // Footer
    doc.setFontSize(8);
    doc.text(`Creado por: ${orden.creado_por} | Fecha: ${new Date(orden.fecha_creacion).toLocaleDateString('es-ES')}`, 105, 280, { align: 'center' });
    
    // Save
    doc.save(`${orden.numero}.pdf`);
    showToast('✅ PDF generado exitosamente', 'success');
}

// Export ordenes
function exportarOrdenes() {
    if (ordenes.length === 0) {
        showToast('⚠️ No hay datos para exportar', 'error');
        return;
    }
    
    const data = ordenes.map(o => ({
        'Número OC': o.numero,
        'Proveedor': o.proveedor_nombre,
        'Fecha Emisión': o.fecha_emision,
        'Fecha Entrega': o.fecha_entrega,
        'Estado': o.estado,
        'Condición Pago': o.condicion_pago,
        'Moneda': o.moneda,
        'Subtotal': o.subtotal,
        'IGV': o.igv,
        'Total': o.total,
        'Productos': o.productos.length,
        'Observaciones': o.observaciones || '-',
        'Creado Por': o.creado_por,
        'Fecha Creación': o.fecha_creacion
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Órdenes de Compra');
    XLSX.writeFile(wb, `Ordenes_Compra_${new Date().toISOString().split('T')[0]}.xlsx`);
    
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
