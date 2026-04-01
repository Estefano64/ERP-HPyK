import { Router } from 'express';
import * as codigoReparacionController from '../controllers/mantenimiento/codigoReparacionController';
import * as herramientaController from '../controllers/mantenimiento/herramientaController';
import * as mantenimientoDashboardController from '../controllers/mantenimiento/mantenimientoDashboardController';

const router = Router();

// Códigos de Reparación
router.get('/codigos-reparacion', codigoReparacionController.getAllCodigosReparacion);
router.get('/codigos-reparacion/:id', codigoReparacionController.getCodigoReparacionById);
router.post('/codigos-reparacion', codigoReparacionController.createCodigoReparacion);
router.put('/codigos-reparacion/:id', codigoReparacionController.updateCodigoReparacion);
router.delete('/codigos-reparacion/:id', codigoReparacionController.deleteCodigoReparacion);

// Herramientas de mantenimiento (CRUD básico)
router.get('/herramientas', herramientaController.getAllHerramientas);
router.get('/herramientas/:id', herramientaController.getHerramientaById);
router.post('/herramientas', herramientaController.createHerramienta);
router.put('/herramientas/:id', herramientaController.updateHerramienta);
router.delete('/herramientas/:id', herramientaController.deleteHerramienta);

// 13.3 - Tabla de frecuencia de mantenimiento
router.get('/frecuencias', mantenimientoDashboardController.getTablaFrecuenciaMantenimiento);

// 13.4 - Parque de equipos (resumen)
router.get('/parque-equipos', mantenimientoDashboardController.getParqueEquiposResumen);

// 13.5 / 13.7 - Equipos prontos a recibir mantenimiento (notificación)
router.get('/equipos-proximos', mantenimientoDashboardController.getEquiposProximosMantenimiento);

// 13.6 - Solicitud de requerimientos por estrategia
router.get('/estrategias/:id/requerimientos', mantenimientoDashboardController.getRequerimientosPorEstrategia);

export default router;
