# Sistema de Navegación Modular - HP&K ERP

## Descripción

Este sistema permite mantener un menú de navegación estandarizado en todas las vistas del ERP usando un solo archivo de configuración. Esto facilitará enormemente el mantenimiento y asegura consistencia visual en todo el sistema.

## Archivos del Sistema

- **`/vistas/shared/nav-menu.html`** - Menú de navegación estándar
- **`/vistas/shared/navigation.js`** - Script que carga y gestiona el menú
- **`/vistas/shared/template.html`** - Plantilla base para nuevas vistas
- **`/vistas/shared/navigation-converter.js`** - Herramienta para convertir vistas existentes

## Estructura del Menú

El menú está organizado en 5 secciones principales:

### 1. Logística
- Inventario (`/vistas/catalogos/materiales.html`)
- Proveedores (`/vistas/logistica/proveedores.html`)
- Almacenes (`/vistas/logistica/almacenes.html`)
- Compras (`/vistas/logistica/compras.html`)
- Movimientos (`/vistas/logistica/movimientos.html`)

### 2. Mantenimiento
- Equipos (`/vistas/mantenimiento/equipos.html`)
- Estrategias (`/vistas/mantenimiento/estrategias.html`)
- Herramientas (`/vistas/mantenimiento/herramientas.html`)

### 3. Producción
- Códigos Reparación (`/vistas/mantenimiento/codigos-reparacion.html`)
- Tareas (`/vistas/produccion/tareas.html`)
- Registro Producción (`/vistas/produccion/registro-produccion.html`)

### 4. OT (Órdenes de Trabajo)
- Órdenes de Trabajo (`/vistas/operativos/ordenes-trabajo.html`)

### 5. Maestros
- Plantas (`/vistas/catalogo/plantas.html`)
- Áreas (`/vistas/catalogo/areas.html`)
- Categorías (`/vistas/catalogo/categorias.html`)
- Clientes (`/vistas/logistica/clientes.html`)

## Cómo Crear una Nueva Vista

### Usando la Plantilla

1. Copiar `/vistas/shared/template.html`
2. Reemplazar los placeholders:
   - `{{TITLE}}` - Título de la página
   - `{{ICON}}` - Ícono FontAwesome
   - `{{HEADER_TITLE}}` - Título del header
   - `{{HEADER_SUBTITLE}}` - Subtítulo del header
3. Agregar el contenido específico en la sección Main Content

### Ejemplo de Nueva Vista

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Vista - HP&K ERP</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="/vistas/shared/navigation.js"></script>
</head>
<body class="bg-gray-50">
    <!-- Navigation Menu will be loaded here -->
    <div id="navigation-container"></div>

    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <!-- Header content -->
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-6 py-6">
        <!-- Vista específica aquí -->
    </div>

    <script>
        // Funciones específicas de la vista
    </script>
</body>
</html>
```

## Cómo Convertir una Vista Existente

### Método Manual

1. **Agregar script de navegación al head:**
```html
<script src="/vistas/shared/navigation.js"></script>
```

2. **Reemplazar el nav existente:**
```html
<!-- Antes -->
<nav class="...">
    <!-- Todo el menú -->
</nav>

<!-- Después -->
<div id="navigation-container"></div>
```

3. **Remover funciones dropdown:**
   - Eliminar `toggleDropdown()`
   - Eliminar `closeAllDropdowns()`
   - Eliminar `onclick="closeAllDropdowns(event)"` del body

### Método Automático (Navegador)

1. Abrir la vista en el navegador
2. Abrir consola del desarrollador (F12)
3. Cargar el script: 
```javascript
// Cargar el convertidor
const script = document.createElement('script');
script.src = '/vistas/shared/navigation-converter.js';
document.head.appendChild(script);

// Ejecutar conversión
setTimeout(() => convertToModularNavigation(), 1000);
```

## Funcionalidades Automáticas

### Detección de Sección Activa

El sistema detecta automáticamente en qué sección está el usuario basado en la URL:
- `/logistica/` → Resalta "Logística"
- `/mantenimiento/` → Resalta "Mantenimiento"
- `/produccion/` → Resalta "Producción"
- `/operativos/` → Resalta "OT"
- `/catalogo/` → Resalta "Maestros"

### Gestión de Dropdowns

- Auto-cierre al hacer clic fuera
- Un solo dropdown abierto a la vez
- Eventos manejados automáticamente

## Mantenimiento del Sistema

### Cambiar el Menú

Para modificar el menú en **toda la aplicación**:
1. Editar `/vistas/shared/nav-menu.html`
2. Los cambios se aplicarán automáticamente a todas las vistas

### Agregar Nueva Sección

1. Editar `nav-menu.html` para agregar el nuevo dropdown
2. Actualizar `navigation.js` en `detectCurrentSection()` para incluir la nueva ruta
3. Actualizar este README

### Cambiar Estilos

Los estilos del menú están en `nav-menu.html`. Para cambios globales:
- Modificar las clases CSS del menú
- Mantener la estructura de dropdowns existente

## Archivos Convertidos

**Completados:**
- `/vistas/catalogo/areas.html`
- `/vistas/logistica/materiales.html` (en progreso)

🔄 **Pendientes de conversión:** ~35 archivos más

## Beneficios del Sistema

1. **Mantenimiento centralizado** - Un solo archivo para el menú
2. **Consistencia total** - Mismo menú en toda la aplicación  
3. **Fácil actualización** - Cambios automáticos en todas las vistas
4. **Detección automática** - Resaltado de sección actual sin configuración
5. **Performance** - Carga asíncrona del menú
6. **Escalabilidad** - Fácil agregar nuevas secciones

## Soporte

Para dudas o problemas con el sistema de navegación, consultar este README o revisar los archivos de ejemplo convertidos.