// Generador de Vistas de Catálogos para ERP Monasterio
// Este script genera vistas HTML para todos los catálogos del sistema

const catalogsConfig = {
    // ===== MAESTROS GLOBALES (11 catálogos) =====
    plantas: {
        name: 'plantas',
        title: 'Plantas',
        icon: 'fa-building',
        color: 'gray',
        description: 'Gestión de plantas de producción',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'ubicacion', label: 'Ubicación', type: 'text', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'ubicacion', 'activo']
    },
    
    areas: {
        name: 'areas',
        title: 'Áreas',
        icon: 'fa-map-marked-alt',
        color: 'gray',
        description: 'Gestión de áreas de trabajo',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'planta_codigo', label: 'Planta', type: 'text', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'planta_codigo', 'activo']
    },

    subareas: {
        name: 'subareas',
        title: 'Subáreas',
        icon: 'fa-layer-group',
        color: 'gray',
        description: 'Gestión de subáreas de trabajo',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'area_codigo', label: 'Área', type: 'text', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'area_codigo', 'activo']
    },

    categorias: {
        name: 'categorias',
        title: 'Categorías',
        icon: 'fa-folder',
        color: 'gray',
        description: 'Gestión de categorías de clasificación',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'tipo', label: 'Tipo', type: 'text', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'tipo', 'activo']
    },

    clasificaciones: {
        name: 'clasificaciones',
        title: 'Clasificaciones',
        icon: 'fa-sitemap',
        color: 'gray',
        description: 'Gestión de clasificaciones del sistema',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'activo']
    },

    unidades_medida: {
        name: 'unidades-medida',
        title: 'Unidades de Medida',
        icon: 'fa-ruler',
        color: 'gray',
        description: 'Gestión de unidades de medida',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'simbolo', label: 'Símbolo', type: 'text', required: false },
            { name: 'tipo', label: 'Tipo', type: 'text', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'simbolo', 'tipo', 'activo']
    },

    monedas: {
        name: 'monedas',
        title: 'Monedas',
        icon: 'fa-dollar-sign',
        color: 'gray',
        description: 'Gestión de monedas y tipos de cambio',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'simbolo', label: 'Símbolo', type: 'text', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'simbolo', 'activo']
    },

    fabricantes: {
        name: 'fabricantes',
        title: 'Fabricantes',
        icon: 'fa-industry',
        color: 'gray',
        description: 'Gestión de fabricantes y proveedores',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'pais', label: 'País', type: 'text', required: false },
            { name: 'contacto', label: 'Contacto', type: 'text', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'pais', 'activo']
    },

    criticidad: {
        name: 'criticidad',
        title: 'Criticidad',
        icon: 'fa-exclamation-circle',
        color: 'gray',
        description: 'Gestión de niveles de criticidad',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'nivel', label: 'Nivel', type: 'number', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'nivel', 'activo']
    },

    posiciones: {
        name: 'posiciones',
        title: 'Posiciones',
        icon: 'fa-location-dot',
        color: 'gray',
        description: 'Gestión de posiciones de equipos',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'activo']
    },

    clientes: {
        name: 'clientes',
        title: 'Clientes',
        icon: 'fa-users',
        color: 'gray',
        description: 'Gestión de clientes',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'contacto', label: 'Contacto', type: 'text', required: false },
            { name: 'telefono', label: 'Teléfono', type: 'text', required: false },
            { name: 'email', label: 'Email', type: 'email', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'contacto', 'telefono', 'activo']
    },

    // ===== CATÁLOGOS MANTENIMIENTO (6) =====
    tipo_equipo: {
        name: 'tipo-equipo',
        title: 'Tipos de Equipo',
        icon: 'fa-tag',
        color: 'green',
        description: 'Gestión de tipos de equipo',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'activo']
    },

    tipo_componente: {
        name: 'tipo-componente',
        title: 'Tipos de Componente',
        icon: 'fa-tag',
        color: 'green',
        description: 'Gestión de tipos de componente',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'activo']
    },

    status_equipo: {
        name: 'status-equipo',
        title: 'Status de Equipo',
        icon: 'fa-traffic-light',
        color: 'green',
        description: 'Gestión de estados de equipos',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'activo']
    },

    tipo_estrategia: {
        name: 'tipo-estrategia',
        title: 'Tipos de Estrategia',
        icon: 'fa-tag',
        color: 'green',
        description: 'Gestión de tipos de estrategia',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'activo']
    },

    status_estrategia: {
        name: 'status-estrategia',
        title: 'Status de Estrategia',
        icon: 'fa-traffic-light',
        color: 'green',
        description: 'Gestión de estados de estrategias',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'activo']
    },

    estrategia_ot: {
        name: 'estrategia-ot',
        title: 'Estrategias OT',
        icon: 'fa-lightbulb',
        color: 'green',
        description: 'Gestión de estrategias para órdenes de trabajo',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'activo']
    },

    // ===== CATÁLOGOS OT (10) =====
    ot_status: {
        name: 'ot-status',
        title: 'Status de OT',
        icon: 'fa-traffic-light',
        color: 'orange',
        description: 'Gestión de estados de órdenes de trabajo',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'activo']
    },

    recursos_status: {
        name: 'recursos-status',
        title: 'Status de Recursos',
        icon: 'fa-traffic-light',
        color: 'orange',
        description: 'Gestión de estados de recursos',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'activo']
    },

    taller_status: {
        name: 'taller-status',
        title: 'Status de Taller',
        icon: 'fa-traffic-light',
        color: 'orange',
        description: 'Gestión de estados del taller',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'activo']
    },

    tipo_garantia: {
        name: 'tipo-garantia',
        title: 'Tipos de Garantía',
        icon: 'fa-shield-alt',
        color: 'orange',
        description: 'Gestión de tipos de garantía',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'duracion_meses', label: 'Duración (meses)', type: 'number', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'duracion_meses', 'activo']
    },

    garantias: {
        name: 'garantias',
        title: 'Garantías',
        icon: 'fa-certificate',
        color: 'orange',
        description: 'Gestión de garantías',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'tipo_codigo', label: 'Tipo Garantía', type: 'text', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'tipo_codigo', 'activo']
    },

    tipo_reparacion: {
        name: 'tipo-reparacion',
        title: 'Tipos de Reparación',
        icon: 'fa-wrench',
        color: 'orange',
        description: 'Gestión de tipos de reparación',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'activo']
    },

    atencion_reparacion: {
        name: 'atencion-reparacion',
        title: 'Atención a Reparación',
        icon: 'fa-bell',
        color: 'orange',
        description: 'Gestión de tipos de atención a reparaciones',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'activo']
    },

    prioridad_atencion: {
        name: 'prioridad-atencion',
        title: 'Prioridad de Atención',
        icon: 'fa-flag',
        color: 'orange',
        description: 'Gestión de prioridades de atención',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'nivel', label: 'Nivel', type: 'number', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'nivel', 'activo']
    },

    base_metalica: {
        name: 'base-metalica',
        title: 'Bases Metálicas',
        icon: 'fa-cube',
        color: 'orange',
        description: 'Gestión de bases metálicas',
        fields: [
            { name: 'codigo', label: 'Código', type: 'text', required: true, readonly: false },
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
            { name: 'material', label: 'Material', type: 'text', required: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', required: false, default: true }
        ],
        tableColumns: ['codigo', 'nombre', 'material', 'activo']
    }
};

// Función para generar el HTML de una vista de catálogo
function generateCatalogHTML(catalogKey) {
    const config = catalogsConfig[catalogKey];
    const colorClasses = {
        gray: { gradient: 'from-gray-700 to-gray-900', bg: 'bg-gray-700', hover: 'hover:bg-gray-800', ring: 'ring-gray-500' },
        green: { gradient: 'from-green-600 to-green-800', bg: 'bg-green-600', hover: 'hover:bg-green-700', ring: 'ring-green-500' },
        orange: { gradient: 'from-orange-600 to-orange-800', bg: 'bg-orange-600', hover: 'hover:bg-orange-700', ring: 'ring-orange-500' }
    };
    const colors = colorClasses[config.color] || colorClasses.gray;

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title} - ERP Monasterio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .dropdown-menu { display: none; }
        .dropdown.active .dropdown-menu { display: block; }
        .modal { display: none; }
        .modal.active { display: flex; }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Configuración del catálogo -->
    <script>
        const CATALOG_CONFIG = ${JSON.stringify({
            name: config.name,
            title: config.title,
            icon: config.icon,
            apiEndpoint: `/api/catalogos/${config.name}`,
            primaryKey: 'codigo',
            description: config.description,
            fields: config.fields,
            tableColumns: config.tableColumns
        }, null, 8)};
    </script>

    <!-- NOTA: El resto del HTML es idéntico al template -->
    <!-- Incluir aquí el contenido del template-catalogo.html desde la línea 16 en adelante -->
    
</body>
</html>`;
}

// Exportar configuraciones y función generadora
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        catalogsConfig,
        generateCatalogHTML
    };
}

console.log('Configuraciones de catálogos cargadas');
console.log(`Total de catálogos configurados: ${Object.keys(catalogsConfig).length}`);
console.log('\nCatálogos por categoría:');
console.log('- Maestros Globales: 11');
console.log('- Mantenimiento: 6');
console.log('- OT: 10');
