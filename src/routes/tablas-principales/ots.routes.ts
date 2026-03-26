/**
 * Rutas para ÓRDENES DE TRABAJO (6_OTs)
 * Área: TODOS (tabla central del ERP)
 * 
 * Campos principales: OT (código), Cliente, Estrategia, Cod Rep, Equipo, NS, 
 *                     Plaqueteo, WO Cliente, PO Cliente, ID Viajero, Fecha recepción, 
 *                     PCR, Horas, Garantía, Tipo Reparación, Prioridad, Contratos,
 *                     Status (OT, Recursos, Taller), Comentarios, etc.
 * 
 * Catálogos asociados: Cliente, Estrategia, Garantía, Atención reparación, 
 *                      Tipo Reparación, Tipo Garantía, Prioridad Atención, 
 *                      Base Metálica, OT Status, Recursos Status, Taller Status
 */

import { Router } from 'express';
import * as ordenTrabajoController from '../../controllers/operativos/ordenTrabajoController';
import * as otRepuestoController from '../../controllers/operativos/otRepuestoController';
import * as otHistorialController from '../../controllers/operativos/otHistorialController';
import * as planificacionOTController from '../../controllers/operativos/planificacionOTController';

const router = Router();

// CRUD completo de órdenes de trabajo
router.get('/', ordenTrabajoController.getAllOrdenesTrabajo);
router.get('/estadisticas', ordenTrabajoController.getEstadisticasOrdenesTrabajo);
// Vista unificada de seguimiento — ANTES de /:id para no ser capturada como ID
router.get('/produccion-tracking', ordenTrabajoController.getProduccionTracking);
// Siguiente número de OT disponible (para preview en formulario)
router.get('/next-number', ordenTrabajoController.getNextOtNumber);
router.get('/:id', ordenTrabajoController.getOrdenTrabajoById);
router.post('/', ordenTrabajoController.createOrdenTrabajo);
router.put('/:id', ordenTrabajoController.updateOrdenTrabajo);
router.delete('/:id', ordenTrabajoController.deleteOrdenTrabajo);

// === REPUESTOS DE OT ===
// Obtener repuestos de una OT específica
router.get('/:otId/repuestos', otRepuestoController.getRepuestosByOT);

// Auto-generar repuestos desde Task List del CodRep de la OT
router.post('/:otId/repuestos/from-task-list', otRepuestoController.createRepuestosFromTaskList);

// Crear repuestos para una OT (batch)
router.post('/:otId/repuestos', otRepuestoController.createRepuestos);

// Actualizar un repuesto específico (cambiar estado, aprobar, vincular a PO)
router.put('/repuestos/:id', otRepuestoController.updateRepuesto);

// Eliminar un repuesto (solo si está en estado Pendiente)
router.delete('/repuestos/:id', otRepuestoController.deleteRepuesto);

// === HISTORIAL DE OT ===
// Obtener historial de operaciones de una OT
router.get('/:otId/historial', otHistorialController.getHistorialByOT);

// Obtener historial detallado con información relacionada
router.get('/:otId/historial/detailed', otHistorialController.getHistorialDetailedByOT);

// Obtener resumen de operaciones agrupadas
router.get('/:otId/historial/resumen', otHistorialController.getResumenOperaciones);

// Crear una entrada manual en el historial
router.post('/:otId/historial', otHistorialController.createHistorialEntry);

// === PLANIFICACIÓN DE OT ===
// Obtener operaciones planificadas de una OT
router.get('/:otId/planificacion', planificacionOTController.getPlanificacionByOT);

// Crear operación manual de planificación para una OT
router.post('/:otId/planificacion', planificacionOTController.createOperacion);

// Auto-generar plan desde clasificación STD/NOSTD de la evaluación
router.post('/:otId/planificacion/generar', planificacionOTController.generatePlanificacion);

// Actualizar una operación planificada
router.put('/planificacion/:id', planificacionOTController.updateOperacion);

// Eliminar una operación planificada
router.delete('/planificacion/:id', planificacionOTController.deleteOperacion);

export default router;
