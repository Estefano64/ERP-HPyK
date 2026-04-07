import { Router } from 'express';
import * as recetaController from '../controllers/produccion/recetaController';
import * as registroProduccionController from '../controllers/produccion/registroProduccionController';
import * as perdidaController from '../controllers/produccion/perdidaController';
import * as planProgramacionController from '../controllers/produccion/planProgramacionController';
import * as programacionSemanalController from '../controllers/produccion/programacionSemanalController';

const router = Router();

// Recetas
router.get('/recetas', recetaController.getAllRecetas);
router.get('/recetas/:id', recetaController.getRecetaById);
router.post('/recetas', recetaController.createReceta);
router.put('/recetas/:id', recetaController.updateReceta);
router.delete('/recetas/:id', recetaController.deleteReceta);

// Registros de Producción
router.get('/produccion', registroProduccionController.getAllRegistrosProduccion);
router.get('/produccion/:id', registroProduccionController.getRegistroProduccionById);
router.post('/produccion', registroProduccionController.createRegistroProduccion);
router.put('/produccion/:id', registroProduccionController.updateRegistroProduccion);
router.delete('/produccion/:id', registroProduccionController.deleteRegistroProduccion);

// Pérdidas
router.get('/perdidas', perdidaController.getAllPerdidas);
router.get('/perdidas/:id', perdidaController.getPerdidaById);
router.post('/perdidas', perdidaController.createPerdida);
router.put('/perdidas/:id', perdidaController.updatePerdida);
router.delete('/perdidas/:id', perdidaController.deletePerdida);

// Planificación
router.get('/plan-programacion', planProgramacionController.getAllTareasProgramadas);
router.put('/plan-programacion/:id', planProgramacionController.updateTareaProgramada);

// Programación Semanal
router.get('/programacion-semanal', programacionSemanalController.getTasksBySemana);
router.put('/programacion-semanal/bulk', programacionSemanalController.bulkUpdateTasks);

export default router;
