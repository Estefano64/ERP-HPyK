/**
 * Rutas para CÓDIGOS DE REPARACIÓN (5_Cod_Rep)
 * Área: PRODUCCIÓN (+ Logística para precio)
 * 
 * Campos: Cod Rep (código), Descripción, Tipo, Categoría, Flota, Fabricante,
 *         NP (Número de parte), Posición, Precio
 */

import { Router } from 'express';
import * as codigoReparacionController from '../../controllers/mantenimiento/codigoReparacionController';
import * as tareaController from '../../controllers/operativos/tareaController';

const router = Router();

// CRUD completo de códigos de reparación
router.get('/', codigoReparacionController.getAllCodigosReparacion);
// Task List de un CodRep (ANTES de /:id para evitar ambigüedad de Express)
router.get('/:id/task-list', tareaController.getTaskListByCodRep);
router.get('/:id', codigoReparacionController.getCodigoReparacionById);
router.post('/', codigoReparacionController.createCodigoReparacion);
router.put('/:id', codigoReparacionController.updateCodigoReparacion);
router.delete('/:id', codigoReparacionController.deleteCodigoReparacion);

export default router;
