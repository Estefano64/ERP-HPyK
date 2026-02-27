# Vistas HTML - ERP HPyK

Sistema de vistas web para el ERP de mantenimiento y reparaciones.

## Estructura de Vistas

```
vistas/
├── layout.html              # Layout base con menú principal
├── index.html               # Dashboard principal
├── catalogo/                # Vistas de catálogos
│   ├── plantas.html
│   ├── areas.html
│   └── ... (otros catálogos)
├── maestros/                # Vistas de datos maestros
│   ├── equipos.html
│   ├── materiales.html
│   ├── componentes.html
│   └── ... (otros maestros)
└── operativos/              # Vistas operativas
    ├── ordenes-trabajo.html
    ├── tareas.html
    └── ... (otros operativos)
```

## Características

### Menú de Navegación
- **Menú superior fijo** con logo del sistema
- **Menús desplegables** organizados por categorías:
  - 📋 Catálogo (Plantas, Áreas, Categorías, etc.)
  - Maestros (Equipos, Materiales, Componentes, etc.)
  - Operativos (Órdenes de Trabajo, Tareas, etc.)
  - Reportes

### Funcionalidades Comunes
- **CRUD completo** (Crear, Leer, Actualizar, Eliminar)
- 🔍 **Búsqueda y filtrado** en tablas
- 📝 **Formularios modales** para crear/editar
- **Tablas responsivas** con paginación
- **Diseño moderno** con gradientes y sombras
- **Carga asíncrona** con fetch API
- ✨ **Feedback visual** con alertas y confirmaciones

### Dashboard
- **Estadísticas en tiempo real**: 
  - Órdenes activas
  - Equipos registrados
  - Materiales en inventario
  - Clientes totales
- **Accesos rápidos** a funciones principales
- **Órdenes recientes** con enlaces directos

## Integración con Backend

Las vistas se conectan a los endpoints del API:

```javascript
// Ejemplo de endpoints utilizados
GET    /api/catalogo/plantas
POST   /api/catalogo/plantas
PUT    /api/catalogo/plantas/:codigo
DELETE /api/catalogo/plantas/:codigo

GET    /api/maestros/equipos
POST   /api/maestros/equipos
PUT    /api/maestros/equipos/:id
DELETE /api/maestros/equipos/:id

GET    /api/operativos/ordenes-trabajo
POST   /api/operativos/ordenes-trabajo
PUT    /api/operativos/ordenes-trabajo/:id
DELETE /api/operativos/ordenes-trabajo/:id
```

## Estilos CSS

Los estilos están incluidos en el `layout.html` e incluyen:

- **Variables de color** profesionales
- **Sistema de grid** responsivo
- **Componentes reutilizables**: botones, tablas, formularios, cards
- **Efectos hover** y transiciones suaves
- **Alertas** de éxito, error e información

## Vistas Creadas

### Implementadas
1. **layout.html** - Template base con menú
2. **index.html** - Dashboard principal
3. **catalogo/plantas.html** - Gestión de plantas
4. **catalogo/areas.html** - Gestión de áreas
5. **maestros/equipos.html** - Gestión de equipos
6. **operativos/ordenes-trabajo.html** - Gestión de órdenes de trabajo

### 📋 Por implementar
Las demás vistas siguen el mismo patrón y estructura que las implementadas.

## Uso

Para servir estas vistas, necesitas:

1. Configurar un servidor Express para servir archivos estáticos
2. Configurar las rutas API correspondientes
3. Las vistas harán peticiones fetch a los endpoints

## Notas Técnicas

- **JavaScript Vanilla**: Sin dependencias de frameworks
- **CSS Puro**: Sin preprocesadores
- **Responsive**: Diseño adaptable a móviles
- **Accesibilidad**: Semántica HTML correcta
- **Performance**: Carga asíncrona de datos
