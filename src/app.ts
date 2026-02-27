import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import sequelize from './config/database';
import { setupAssociations } from './models';
import { runMigrations } from './utils/migrations';

// Importar TODOS los modelos para sincronización manual
import Planta from './models/catalogs/Planta';
import Area from './models/catalogs/Area';
import SubArea from './models/catalogs/SubArea';
import UnidadMedida from './models/catalogs/UnidadMedida';
import Moneda from './models/catalogs/Moneda';
import Fabricante from './models/catalogs/Fabricante';
import Categoria from './models/catalogs/Categoria';
import Clasificacion from './models/catalogs/Clasificacion';
import StatusEquipo from './models/catalogs/StatusEquipo';
import TipoEquipo from './models/catalogs/TipoEquipo';
import Criticidad from './models/catalogs/Criticidad';
import StatusEstrategia from './models/catalogs/StatusEstrategia';
import TipoEstrategia from './models/catalogs/TipoEstrategia';
import TipoTarea from './models/catalogs/TipoTarea';
import TipoCodRep from './models/catalogs/TipoCodRep';
import CategoriaCodRep from './models/catalogs/CategoriaCodRep';
import FlotaEquipo from './models/catalogs/FlotaEquipo';
import Posicion from './models/catalogs/Posicion';
import Cliente from './models/catalogs/Cliente';
import Garantia from './models/catalogs/Garantia';
import AtencionReparacion from './models/catalogs/AtencionReparacion';
import TipoReparacion from './models/catalogs/TipoReparacion';
import TipoGarantia from './models/catalogs/TipoGarantia';
import PrioridadAtencion from './models/catalogs/PrioridadAtencion';
import BaseMetalica from './models/catalogs/BaseMetalica';
import OtStatus from './models/catalogs/OtStatus';
import RecursosStatus from './models/catalogs/RecursosStatus';
import TallerStatus from './models/catalogs/TallerStatus';
import Material from './models/Material';
import Equipo from './models/Equipo';
import Estrategia from './models/Estrategia';
import CodigoReparacion from './models/CodigoReparacion';
import Tarea from './models/Tarea';
import OrdenTrabajo from './models/OrdenTrabajo';

// Importar modelos de Logística
import Compra from './models/Compra';
import CompraDetalle from './models/CompraDetalle';
import OrdenCompra from './models/OrdenCompra';
import OrdenCompraView from './models/OrdenCompraView';
import Almacen from './models/Almacen';
import MovimientoInventario from './models/MovimientoInventario';
import Proveedor from './models/Proveedor';
import OTHistorial from './models/OTHistorial';
import OTRepuesto from './models/OTRepuesto';
import Herramienta from './models/Herramienta';

// Importar rutas centralizadas
import apiRoutes from './routes/index';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (vistas HTML)
app.use(express.static(path.join(__dirname, 'vistas')));

// ============= RUTAS DE VISTAS HTML =============
// Dashboard
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'index.html'));
});

app.get('/index.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'index.html'));
});

// LOGÍSTICA
app.get('/logistica', (req: Request, res: Response) => {
  res.redirect('/logistica/index.html');
});

app.get('/logistica/index.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'logistica', 'index.html'));
});

app.get('/logistica/materiales.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'logistica', 'materiales.html'));
});

app.get('/logistica/almacenes.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'logistica', 'almacenes.html'));
});
app.get('/logistica/ordenes-compra.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'logistica', 'ordenes-compra.html'));
});
app.get('/logistica/movimientos.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'logistica', 'movimientos.html'));
});

app.get('/logistica/proveedores.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'logistica', 'proveedores.html'));
});

app.get('/logistica/compras.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'logistica', 'compras.html'));
});

app.get('/logistica/inventario-valorizado.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'logistica', 'inventario-valorizado.html'));
});

app.get('/logistica/dashboard-stock.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'logistica', 'dashboard-stock.html'));
});

app.get('/logistica/herramientas.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'logistica', 'herramientas.html'));
});

// MANTENIMIENTO
app.get('/mantenimiento/index.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'mantenimiento', 'index.html'));
});

app.get('/mantenimiento/equipos.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'mantenimiento', 'equipos.html'));
});

app.get('/mantenimiento/herramientas.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'mantenimiento', 'herramientas.html'));
});

app.get('/mantenimiento/codigos-reparacion.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'mantenimiento', 'codigos-reparacion.html'));
});

app.get('/mantenimiento/ordenes-trabajo.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'mantenimiento', 'ordenes-trabajo.html'));
});

app.get('/mantenimiento/estrategias.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'mantenimiento', 'estrategias.html'));
});

// PRODUCCIÓN
app.get('/produccion/index.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'produccion', 'index.html'));
});

app.get('/produccion/productos.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'produccion', 'productos.html'));
});

app.get('/produccion/categorias.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'produccion', 'categorias.html'));
});

app.get('/produccion/recetas.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'produccion', 'recetas.html'));
});

app.get('/produccion/plantas.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'produccion', 'plantas.html'));
});

app.get('/produccion/produccion.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'produccion', 'produccion.html'));
});

app.get('/produccion/perdidas.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'produccion', 'perdidas.html'));
});

app.get('/produccion/tareas.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'produccion', 'tareas.html'));
});

// OPERATIVOS
app.get('/operativos/index.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'operativos', 'index.html'));
});

app.get('/operativos/ordenes-trabajo.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'operativos', 'ordenes-trabajo.html'));
});

// CATÁLOGOS
app.get('/catalogos/plantas.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'catalogos', 'plantas.html'));
});

app.get('/catalogos/areas.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'catalogos', 'areas.html'));
});

app.get('/catalogos/subareas.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'catalogos', 'subareas.html'));
});

app.get('/catalogos/categorias.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'catalogos', 'categorias.html'));
});

app.get('/catalogos/clasificaciones.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'catalogos', 'clasificaciones.html'));
});

app.get('/catalogos/unidades-medida.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'catalogos', 'unidades-medida.html'));
});

app.get('/catalogos/monedas.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'catalogos', 'monedas.html'));
});

app.get('/catalogos/fabricantes.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'catalogos', 'fabricantes.html'));
});

app.get('/catalogos/criticidad.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'catalogos', 'criticidad.html'));
});

app.get('/catalogos/posiciones.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'catalogos', 'posiciones.html'));
});

app.get('/catalogos/clientes.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'catalogos', 'clientes.html'));
});

// COMPARTIDO
app.get('/compartido/estrategias.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'compartido', 'estrategias.html'));
});

app.get('/compartido/ubicaciones.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'compartido', 'ubicaciones.html'));
});

app.get('/compartido/ventas.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'compartido', 'ventas.html'));
});

app.get('/compartido/clientes.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'compartido', 'clientes.html'));
});

app.get('/compartido/reportes.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'compartido', 'reportes.html'));
});

// RUTAS LEGACY (mantener compatibilidad)
app.get('/catalogo/plantas', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'catalogo', 'plantas.html'));
});

app.get('/catalogo/areas', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'catalogo', 'areas.html'));
});

app.get('/maestros/equipos', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'maestros', 'equipos.html'));
});

app.get('/operativos/ordenes-trabajo', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'vistas', 'operativos', 'ordenes-trabajo.html'));
});

// ============= RUTAS DE API =============
// Todas las rutas del API están centralizadas en /api
app.use('/api', apiRoutes);

// Manejo de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Ruta 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✓ Conexión a la base de datos establecida');

    // Configurar asociaciones entre modelos
    setupAssociations();
    console.log('✓ Asociaciones de modelos configuradas');

    // Ejecutar migraciones manuales (comentado para primera migración)
    // await runMigrations();

    // Sincronizar modelos con la base de datos EN ORDEN CORRECTO
    console.log('Sincronizando modelos con NUEVA ESTRUCTURA...');
    console.log('   1/4 Creando catálogos básicos...');
    
    // NIVEL 1: Catálogos sin dependencias
    await Planta.sync({ force: false });
    await Area.sync({ force: false });
    await UnidadMedida.sync({ force: false });
    await Moneda.sync({ force: false });
    await Fabricante.sync({ force: false });
    await Categoria.sync({ force: false });
    await Clasificacion.sync({ force: false });
    await StatusEquipo.sync({ force: false });
    await TipoEquipo.sync({ force: false });
    await Criticidad.sync({ force: false });
    await StatusEstrategia.sync({ force: false });
    await TipoEstrategia.sync({ force: false });
    await TipoTarea.sync({ force: false });
    await TipoCodRep.sync({ force: false });
    await CategoriaCodRep.sync({ force: false });
    await FlotaEquipo.sync({ force: false });
    await Posicion.sync({ force: false });
    await Cliente.sync({ force: false });
    await Garantia.sync({ force: false });
    await AtencionReparacion.sync({ force: false });
    await TipoReparacion.sync({ force: false });
    await TipoGarantia.sync({ force: false });
    await PrioridadAtencion.sync({ force: false });
    await BaseMetalica.sync({ force: false });
    await OtStatus.sync({ force: false });
    await RecursosStatus.sync({ force: false });
    await TallerStatus.sync({ force: false });
    
    console.log('   2/4 Creando catálogos con dependencias...');
    // NIVEL 2: Catálogos que dependen de otros catálogos
    await SubArea.sync({ force: false });
    
    console.log('   3/4 Creando tablas principales...');
    // NIVEL 3: Tablas principales
    await Material.sync({ force: false });
    await Equipo.sync({ force: false });
    await Estrategia.sync({ force: false });
    await CodigoReparacion.sync({ force: false });
    await Almacen.sync({ force: false });
    await Proveedor.sync({ force: false });
    await Herramienta.sync({ force: false });
    await OrdenTrabajo.sync({ force: false }); // Mover antes de Compra
    await Compra.sync({ force: false });
    await OrdenCompra.sync({ force: false });
    await OrdenCompraView.sync({ force: false });
    
    console.log('   4/4 Creando tablas de relación...');
    // NIVEL 4: Tablas que dependen de tablas principales
    await Tarea.sync({ force: false });
    await CompraDetalle.sync({ force: false });
    await MovimientoInventario.sync({ force: false });
    await OTHistorial.sync({ force: false });
    await OTRepuesto.sync({ force: false });
    
    console.log('✓ ¡TABLAS CREADAS CON NUEVA ESTRUCTURA!');

    // Iniciar servidor Express
    app.listen(PORT, () => {
      console.log(`\nServidor corriendo en http://localhost:${PORT}`);
      console.log(`Dashboard disponible en http://localhost:${PORT}`);
      console.log(`API disponible en http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;
