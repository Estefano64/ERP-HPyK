import { Router } from 'express';
import * as codigoReparacionController from '../controllers/mantenimiento/codigoReparacionController';

const router = Router();

// Códigos de Reparación
router.get('/codigos-reparacion', codigoReparacionController.getAllCodigosReparacion);
router.get('/codigos-reparacion/:id', codigoReparacionController.getCodigoReparacionById);
router.post('/codigos-reparacion', codigoReparacionController.createCodigoReparacion);
router.put('/codigos-reparacion/:id', codigoReparacionController.updateCodigoReparacion);
router.delete('/codigos-reparacion/:id', codigoReparacionController.deleteCodigoReparacion);

export default router;
