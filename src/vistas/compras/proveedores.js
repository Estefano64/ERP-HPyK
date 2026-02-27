// Gestión de Proveedores - JavaScript
let proveedores = [];
let editingId = null;

// Initialize function
function initProveedores() {
    const formElement = document.getElementById('form-proveedor');
    if (formElement && !formElement.dataset.initialized) {
        formElement.addEventListener('submit', submitProveedor);
        formElement.dataset.initialized = 'true';
    }
    loadProveedores();
}

// Auto-initialize when script loads or when called
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProveedores);
} else {
    // DOM already loaded, initialize immediately
    setTimeout(initProveedores, 100);
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
        renderProveedores();
        updateDashboard();
        updateTopProveedores();
    } catch (error) {
        console.error('Error:', error);
        proveedores = generateSampleProveedores();
        renderProveedores();
        updateDashboard();
        updateTopProveedores();
    }
}

// Generate sample data
function generateSampleProveedores() {
    return [
        {
            id: 1,
            ruc: '20123456789',
            razon_social: 'Distribuidora Industrial SAC',
            nombre_comercial: 'DISAINSA',
            categoria: 'materiales',
            contacto: 'Juan Pérez',
            telefono: '+51 999 888 777',
            email: 'ventas@disainsa.com',
            direccion: 'Av. Industrial 1234, Cercado de Lima',
            ciudad: 'Lima',
            pais: 'Perú',
            dias_credito: 30,
            tiempo_entrega: 7,
            calificacion: 4.8,
            banco: 'BCP',
            cuenta: '191-1234567-0-01',
            estado: 'activo',
            web: 'https://www.disainsa.com',
            total_compras: 45,
            fecha_registro: '2024-01-15'
        },
        {
            id: 2,
            ruc: '20987654321',
            razon_social: 'Herramientas y Equipos del Norte EIRL',
            nombre_comercial: 'HENOR',
            categoria: 'herramientas',
            contacto: 'María López',
            telefono: '+51 955 444 333',
            email: 'contacto@henor.pe',
            direccion: 'Jr. Los Artesanos 567, San Juan de Lurigancho',
            ciudad: 'Lima',
            pais: 'Perú',
            dias_credito: 45,
            tiempo_entrega: 5,
            calificacion: 4.9,
            banco: 'Interbank',
            cuenta: '200-3456789-0-02',
            estado: 'activo',
            web: 'https://www.henor.pe',
            total_compras: 38,
            fecha_registro: '2024-02-20'
        },
        {
            id: 3,
            ruc: '20555888999',
            razon_social: 'Comercial EPP Seguro SAC',
            nombre_comercial: 'EPP Seguro',
            categoria: 'consumibles',
            contacto: 'Carlos Ruiz',
            telefono: '+51 988 777 666',
            email: 'ventas@eppseguro.com',
            direccion: 'Av. Los Precursores 890, Surco',
            ciudad: 'Lima',
            pais: 'Perú',
            dias_credito: 15,
            tiempo_entrega: 3,
            calificacion: 4.5,
            banco: 'BBVA',
            cuenta: '0011-0123-4567-8900',
            estado: 'activo',
            web: 'https://www.eppseguro.com',
            total_compras: 52,
            fecha_registro: '2023-11-10'
        },
        {
            id: 4,
            ruc: '20777666555',
            razon_social: 'Servicios Técnicos Industriales SRL',
            nombre_comercial: 'SETEIN',
            categoria: 'servicios',
            contacto: 'Ana Torres',
            telefono: '+51 944 333 222',
            email: 'info@setein.com.pe',
            direccion: 'Calle Los Ingenieros 234, Ate',
            ciudad: 'Lima',
            pais: 'Perú',
            dias_credito: 60,
            tiempo_entrega: 10,
            calificacion: 4.7,
            banco: 'Scotiabank',
            cuenta: '039-5678901-0-03',
            estado: 'activo',
            web: 'https://www.setein.com.pe',
            total_compras: 25,
            fecha_registro: '2024-03-05'
        },
        {
            id: 5,
            ruc: '20111222333',
            razon_social: 'Importadora de Equipos Técnicos SAC',
            nombre_comercial: 'IMPETEC',
            categoria: 'equipos',
            contacto: 'Pedro Gómez',
            telefono: '+51 977 666 555',
            email: 'ventas@impetec.pe',
            direccion: 'Av. Universitaria 1567, Los Olivos',
            ciudad: 'Lima',
            pais: 'Perú',
            dias_credito: 90,
            tiempo_entrega: 15,
            calificacion: 4.6,
            banco: 'BCP',
            cuenta: '191-9876543-0-04',
            estado: 'activo',
            web: 'https://www.impetec.pe',
            total_compras: 18,
            fecha_registro: '2023-09-12'
        },
        {
            id: 6,
            ruc: '20444555666',
            razon_social: 'Transportes y Logística Veloz EIRL',
            nombre_comercial: 'Trans Veloz',
            categoria: 'transporte',
            contacto: 'Luis Martínez',
            telefono: '+51 966 555 444',
            email: 'operaciones@transveloz.pe',
            direccion: 'Av. Industrial 2890, Callao',
            ciudad: 'Callao',
            pais: 'Perú',
            dias_credito: 30,
            tiempo_entrega: 2,
            calificacion: 4.4,
            banco: 'Interbank',
            cuenta: '200-1122334-0-05',
            estado: 'activo',
            web: 'https://www.transveloz.pe',
            total_compras: 60,
            fecha_registro: '2023-12-01'
        },
        {
            id: 7,
            ruc: '20888999111',
            razon_social: 'Materiales de Construcción Lima SAC',
            nombre_comercial: 'MCL',
            categoria: 'materiales',
            contacto: 'Rosa Vega',
            telefono: '+51 933 222 111',
            email: 'ventas@mcl.com.pe',
            direccion: 'Av. Colonial 3456, Callao',
            ciudad: 'Callao',
            pais: 'Perú',
            dias_credito: 45,
            tiempo_entrega: 5,
            calificacion: 4.3,
            banco: 'BBVA',
            cuenta: '0011-9988776-0-06',
            estado: 'activo',
            web: 'https://www.mcl.com.pe',
            total_compras: 32,
            fecha_registro: '2024-01-20'
        },
        {
            id: 8,
            ruc: '20222333444',
            razon_social: 'Suministros Industriales del Centro EIRL',
            nombre_comercial: 'SUINDCE',
            categoria: 'consumibles',
            contacto: 'Jorge Díaz',
            telefono: '+51 922 111 000',
            email: 'contacto@suindce.pe',
            direccion: 'Jr. Cuzco 678, Lima Centro',
            ciudad: 'Lima',
            pais: 'Perú',
            dias_credito: 20,
            tiempo_entrega: 4,
            calificacion: 4.2,
            banco: 'Scotiabank',
            cuenta: '039-7788990-0-07',
            estado: 'inactivo',
            web: 'https://www.suindce.pe',
            total_compras: 12,
            fecha_registro: '2023-08-15'
        },
        {
            id: 9,
            ruc: '20666777888',
            razon_social: 'Tecnología Industrial Avanzada SAC',
            nombre_comercial: 'TECINAV',
            categoria: 'equipos',
            contacto: 'Carmen Silva',
            telefono: '+51 911 000 999',
            email: 'ventas@tecinav.com',
            direccion: 'Av. Javier Prado 4567, San Isidro',
            ciudad: 'Lima',
            pais: 'Perú',
            dias_credito: 60,
            tiempo_entrega: 20,
            calificacion: 4.9,
            banco: 'BCP',
            cuenta: '191-5544332-0-08',
            estado: 'activo',
            web: 'https://www.tecinav.com',
            total_compras: 15,
            fecha_registro: '2024-02-10'
        },
        {
            id: 10,
            ruc: '20333444555',
            razon_social: 'Mantenimiento y Reparaciones Generales SRL',
            nombre_comercial: 'MAREGES',
            categoria: 'servicios',
            contacto: 'Roberto Castillo',
            telefono: '+51 900 888 777',
            email: 'info@mareges.pe',
            direccion: 'Calle Industrial 123, Villa El Salvador',
            ciudad: 'Lima',
            pais: 'Perú',
            dias_credito: 30,
            tiempo_entrega: 7,
            calificacion: 4.1,
            banco: 'Interbank',
            cuenta: '200-6655443-0-09',
            estado: 'inactivo',
            observaciones: 'Proveedor suspendido temporalmente por incumplimiento',
            total_compras: 8,
            fecha_registro: '2023-07-22'
        }
    ];
}

// Render proveedores
function renderProveedores() {
    const tbody = document.getElementById('proveedores-table');
    if (!tbody) return; // Element not found, skip rendering
    
    if (proveedores.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-truck text-3xl mb-2"></i>
                    <p>No hay proveedores registrados</p>
                </td>
            </tr>
        `;
        const totalElement = document.getElementById('total-registros-prov');
        if (totalElement) totalElement.textContent = '0';
        return;
    }
    
    tbody.innerHTML = proveedores.map(p => {
        const estadoBadge = getEstadoBadge(p.estado);
        const stars = getStarRating(p.calificacion);
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm font-semibold">${p.ruc}</td>
                <td class="px-4 py-3 text-sm">
                    <div class="font-semibold">${p.razon_social}</div>
                    ${p.nombre_comercial ? `<div class="text-xs text-gray-500">${p.nombre_comercial}</div>` : ''}
                </td>
                <td class="px-4 py-3 text-sm">${getCategoryLabel(p.categoria)}</td>
                <td class="px-4 py-3 text-sm">
                    <div>${p.contacto}</div>
                    <div class="text-xs text-gray-500">${p.email}</div>
                </td>
                <td class="px-4 py-3 text-sm">${p.telefono}</td>
                <td class="px-4 py-3 text-center">${stars}</td>
                <td class="px-4 py-3 text-center text-sm font-semibold">${p.dias_credito || 0} días</td>
                <td class="px-4 py-3 text-center">${estadoBadge}</td>
                <td class="px-4 py-3 text-center">
                    <button onclick="editProveedor(${p.id})" class="text-blue-600 hover:text-blue-800 mx-1" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="viewProveedor(${p.id})" class="text-green-600 hover:text-green-800 mx-1" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="deleteProveedor(${p.id})" class="text-red-600 hover:text-red-800 mx-1" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    document.getElementById('total-registros-prov').textContent = proveedores.length;
}

// Get estado badge
function getEstadoBadge(estado) {
    const badges = {
        'activo': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">✅ Activo</span>',
        'inactivo': '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">⏸️ Inactivo</span>'
    };
    return badges[estado] || '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">-</span>';
}

// Get star rating
function getStarRating(rating) {
    if (!rating) return '<span class="text-xs text-gray-400">Sin calificar</span>';
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    let html = '<div class="flex items-center justify-center gap-1">';
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            html += '<i class="fas fa-star text-yellow-500 text-sm"></i>';
        } else if (i === fullStars && hasHalfStar) {
            html += '<i class="fas fa-star-half-alt text-yellow-500 text-sm"></i>';
        } else {
            html += '<i class="far fa-star text-gray-300 text-sm"></i>';
        }
    }
    html += `<span class="text-xs text-gray-600 ml-1">${rating.toFixed(1)}</span>`;
    html += '</div>';
    return html;
}

// Get category label
function getCategoryLabel(cat) {
    const labels = {
        'materiales': 'Materiales',
        'herramientas': 'Herramientas',
        'consumibles': 'Consumibles',
        'servicios': 'Servicios',
        'equipos': 'Equipos',
        'transporte': 'Transporte'
    };
    return labels[cat] || cat;
}

// Update dashboard
function updateDashboard() {
    const updateElement = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };
    
    updateElement('total-proveedores', proveedores.length);
    
    const activos = proveedores.filter(p => p.estado === 'activo').length;
    const inactivos = proveedores.filter(p => p.estado === 'inactivo').length;
    
    updateElement('proveedores-activos', activos);
    updateElement('proveedores-inactivos', inactivos);
    
    // Calificación promedio
    const totalCalif = proveedores.reduce((sum, p) => sum + (p.calificacion || 0), 0);
    const promedioCalif = proveedores.length > 0 ? totalCalif / proveedores.length : 0;
    updateElement('calificacion-promedio', promedioCalif.toFixed(1));
    
    // Crédito promedio
    const totalCredito = proveedores.reduce((sum, p) => sum + (p.dias_credito || 0), 0);
    const promedioCredito = proveedores.length > 0 ? Math.round(totalCredito / proveedores.length) : 0;
    updateElement('credito-promedio', promedioCredito);
}

// Update top proveedores
function updateTopProveedores() {
    // Top calificados
    const topCalificados = [...proveedores]
        .filter(p => p.calificacion)
        .sort((a, b) => b.calificacion - a.calificacion)
        .slice(0, 5);
    
    const topCalifHtml = topCalificados.map((p, i) => {
        const icon = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
        const color = i === 0 ? 'bg-yellow-50 border-yellow-400' : i === 1 ? 'bg-gray-50 border-gray-400' : i === 2 ? 'bg-orange-50 border-orange-400' : 'bg-white border-gray-200';
        
        return `
            <div class="flex items-center justify-between p-3 border-l-4 ${color} rounded">
                <div class="flex items-center gap-3">
                    <span class="text-xl font-bold w-8">${icon}</span>
                    <div>
                        <p class="font-semibold">${p.razon_social}</p>
                        <p class="text-sm text-gray-600">${getCategoryLabel(p.categoria)}</p>
                    </div>
                </div>
                <div class="text-right">
                    ${getStarRating(p.calificacion)}
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('top-calificados').innerHTML = topCalifHtml || '<p class="text-gray-500 text-center">No hay datos</p>';
    
    // Top utilizados
    const topUtilizados = [...proveedores]
        .filter(p => p.total_compras)
        .sort((a, b) => b.total_compras - a.total_compras)
        .slice(0, 5);
    
    const topUtilHtml = topUtilizados.map((p, i) => {
        const icon = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
        const color = i === 0 ? 'bg-blue-50 border-blue-400' : i === 1 ? 'bg-indigo-50 border-indigo-400' : i === 2 ? 'bg-purple-50 border-purple-400' : 'bg-white border-gray-200';
        
        return `
            <div class="flex items-center justify-between p-3 border-l-4 ${color} rounded">
                <div class="flex items-center gap-3">
                    <span class="text-xl font-bold w-8">${icon}</span>
                    <div>
                        <p class="font-semibold">${p.razon_social}</p>
                        <p class="text-sm text-gray-600">${getCategoryLabel(p.categoria)}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold text-indigo-600">${p.total_compras}</p>
                    <p class="text-xs text-gray-600">OCs</p>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('top-utilizados').innerHTML = topUtilHtml || '<p class="text-gray-500 text-center">No hay datos</p>';
}

// Filter proveedores
function filterProveedores() {
    const search = document.getElementById('search-proveedor').value.toLowerCase();
    const categoria = document.getElementById('filter-categoria').value;
    const estado = document.getElementById('filter-estado').value;
    
    const rows = document.querySelectorAll('#proveedores-table tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const match = text.includes(search) && 
                     (!categoria || text.includes(categoria.toLowerCase())) && 
                     (!estado || text.includes(estado));
        row.style.display = match ? '' : 'none';
        if (match) visibleCount++;
    });
    
    document.getElementById('total-registros-prov').textContent = visibleCount;
}

// Clear filters
function clearProveedoresFilters() {
    document.getElementById('search-proveedor').value = '';
    document.getElementById('filter-categoria').value = '';
    document.getElementById('filter-estado-prov').value = '';
    filterProveedores();
}

// Filtrar por estado desde KPI
function filtrarEstado(estado) {
    document.getElementById('filter-estado-prov').value = estado;
    filterProveedores();
}

// Modal proveedor
function showNewProveedorForm() {
    editingId = null;
    document.getElementById('modal-prov-title').textContent = 'Nuevo Proveedor';
    document.getElementById('form-proveedor').reset();
    document.getElementById('prov-estado').value = 'activo';
    document.getElementById('prov-calificacion').value = '5.0';
    document.getElementById('modal-proveedor').classList.remove('hidden');
}

function closeProveedorModal() {
    document.getElementById('modal-proveedor').classList.add('hidden');
}

function editProveedor(id) {
    const prov = proveedores.find(p => p.id === id);
    if (!prov) return;
    
    editingId = id;
    document.getElementById('modal-prov-title').textContent = 'Editar Proveedor';
    document.getElementById('prov-ruc').value = prov.ruc;
    document.getElementById('prov-razon-social').value = prov.razon_social;
    document.getElementById('prov-nombre-comercial').value = prov.nombre_comercial || '';
    document.getElementById('prov-categoria').value = prov.categoria;
    document.getElementById('prov-contacto').value = prov.contacto;
    document.getElementById('prov-telefono').value = prov.telefono;
    document.getElementById('prov-email').value = prov.email;
    document.getElementById('prov-telefono-alt').value = prov.telefono_alt || '';
    document.getElementById('prov-direccion').value = prov.direccion;
    document.getElementById('prov-ciudad').value = prov.ciudad || '';
    document.getElementById('prov-pais').value = prov.pais || '';
    document.getElementById('prov-dias-credito').value = prov.dias_credito || '';
    document.getElementById('prov-tiempo-entrega').value = prov.tiempo_entrega || '';
    document.getElementById('prov-calificacion').value = prov.calificacion || '';
    document.getElementById('prov-banco').value = prov.banco || '';
    document.getElementById('prov-cuenta').value = prov.cuenta || '';
    document.getElementById('prov-estado').value = prov.estado;
    document.getElementById('prov-web').value = prov.web || '';
    document.getElementById('prov-observaciones').value = prov.observaciones || '';
    
    document.getElementById('modal-proveedor').classList.remove('hidden');
}

function viewProveedor(id) {
    const prov = proveedores.find(p => p.id === id);
    if (prov) {
        const detalles = `
🏢 DETALLE DE PROVEEDOR

📋 RUC/NIT: ${prov.ruc}
🏭 Razón Social: ${prov.razon_social}
${prov.nombre_comercial ? '💼 Nombre Comercial: ' + prov.nombre_comercial : ''}
🏷️ Categoría: ${getCategoryLabel(prov.categoria)}

👤 Contacto: ${prov.contacto}
📞 Teléfono: ${prov.telefono}
${prov.telefono_alt ? '📱 Tel. Alternativo: ' + prov.telefono_alt : ''}
📧 Email: ${prov.email}
📍 Dirección: ${prov.direccion}
🌆 Ciudad: ${prov.ciudad || 'N/A'}
🌍 País: ${prov.pais || 'N/A'}

💳 Días de Crédito: ${prov.dias_credito || 0} días
⏱️ Tiempo de Entrega: ${prov.tiempo_entrega || 0} días
⭐ Calificación: ${prov.calificacion ? prov.calificacion.toFixed(1) + '/5.0' : 'Sin calificar'}
🏦 Banco: ${prov.banco || 'N/A'}
💰 Cuenta: ${prov.cuenta || 'N/A'}
🌐 Web: ${prov.web || 'N/A'}
🟢 Estado: ${prov.estado.toUpperCase()}
📊 Total Compras: ${prov.total_compras || 0} OCs
${prov.observaciones ? '💬 Observaciones: ' + prov.observaciones : ''}
        `.trim();
        alert(detalles);
    }
}

function deleteProveedor(id) {
    const prov = proveedores.find(p => p.id === id);
    if (!prov) return;
    
    if (!confirm(`¿Eliminar el proveedor "${prov.razon_social}"?`)) return;
    
    proveedores = proveedores.filter(p => p.id !== id);
    renderProveedores();
    updateDashboard();
    updateTopProveedores();
    showToast('✅ Proveedor eliminado', 'success');
}

// Submit proveedor
async function submitProveedor(e) {
    e.preventDefault();
    
    const data = {
        ruc: document.getElementById('prov-ruc').value,
        razon_social: document.getElementById('prov-razon-social').value,
        nombre_comercial: document.getElementById('prov-nombre-comercial').value,
        categoria: document.getElementById('prov-categoria').value,
        contacto: document.getElementById('prov-contacto').value,
        telefono: document.getElementById('prov-telefono').value,
        email: document.getElementById('prov-email').value,
        telefono_alt: document.getElementById('prov-telefono-alt').value,
        direccion: document.getElementById('prov-direccion').value,
        ciudad: document.getElementById('prov-ciudad').value,
        pais: document.getElementById('prov-pais').value,
        dias_credito: parseInt(document.getElementById('prov-dias-credito').value) || 0,
        tiempo_entrega: parseInt(document.getElementById('prov-tiempo-entrega').value) || 0,
        calificacion: parseFloat(document.getElementById('prov-calificacion').value) || null,
        banco: document.getElementById('prov-banco').value,
        cuenta: document.getElementById('prov-cuenta').value,
        estado: document.getElementById('prov-estado').value,
        web: document.getElementById('prov-web').value,
        observaciones: document.getElementById('prov-observaciones').value,
        total_compras: 0,
        fecha_registro: new Date().toISOString().split('T')[0]
    };
    
    if (editingId) {
        const index = proveedores.findIndex(p => p.id === editingId);
        proveedores[index] = { ...proveedores[index], ...data };
        showToast('✅ Proveedor actualizado', 'success');
    } else {
        data.id = proveedores.length > 0 ? Math.max(...proveedores.map(p => p.id)) + 1 : 1;
        proveedores.push(data);
        showToast('✅ Proveedor creado', 'success');
    }
    
    closeProveedorModal();
    renderProveedores();
    updateDashboard();
    updateTopProveedores();
}

// Export proveedores
function exportarProveedores() {
    if (proveedores.length === 0) {
        showToast('⚠️ No hay datos para exportar', 'error');
        return;
    }
    
    const data = proveedores.map(p => ({
        'RUC/NIT': p.ruc,
        'Razón Social': p.razon_social,
        'Nombre Comercial': p.nombre_comercial || '-',
        'Categoría': getCategoryLabel(p.categoria),
        'Contacto': p.contacto,
        'Teléfono': p.telefono,
        'Email': p.email,
        'Dirección': p.direccion,
        'Ciudad': p.ciudad || '-',
        'País': p.pais || '-',
        'Días Crédito': p.dias_credito || 0,
        'Tiempo Entrega': p.tiempo_entrega || 0,
        'Calificación': p.calificacion || '-',
        'Banco': p.banco || '-',
        'Cuenta': p.cuenta || '-',
        'Estado': p.estado,
        'Total Compras': p.total_compras || 0,
        'Web': p.web || '-',
        'Observaciones': p.observaciones || '-'
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Proveedores');
    XLSX.writeFile(wb, `Proveedores_${new Date().toISOString().split('T')[0]}.xlsx`);
    
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
