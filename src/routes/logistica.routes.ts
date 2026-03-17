import { Router, Request, Response } from 'express';
import * as proveedorController from '../controllers/logistica/proveedorController';
import * as almacenController from '../controllers/logistica/almacenController';
import * as movimientoController from '../controllers/logistica/movimientoController';
import * as ordenCompraController from '../controllers/logistica/ordenCompraController';
import * as compraController from '../controllers/logistica/compraController';
import * as inventarioController from '../controllers/logistica/inventarioController';
import * as herramientaController from '../controllers/logistica/herramientaController';
import { QueryTypes } from 'sequelize';
import sequelize from '../config/database';

const router = Router();

// Proveedores
router.get('/proveedores', proveedorController.getAllProveedores);
router.get('/proveedores/:id', proveedorController.getProveedorById);
router.post('/proveedores', proveedorController.createProveedor);
router.put('/proveedores/:id', proveedorController.updateProveedor);
router.delete('/proveedores/:id', proveedorController.deleteProveedor);

// Almacenes
router.get('/almacenes', almacenController.getAllAlmacenes);
router.get('/almacenes/:id', almacenController.getAlmacenById);
router.post('/almacenes', almacenController.createAlmacen);
router.put('/almacenes/:id', almacenController.updateAlmacen);
router.delete('/almacenes/:id', almacenController.deleteAlmacen);

// Movimientos de Inventario
router.get('/movimientos', movimientoController.getAllMovimientos);
router.get('/movimientos/:id', movimientoController.getMovimientoById);
router.post('/movimientos', movimientoController.createMovimiento);
router.put('/movimientos/:id', movimientoController.updateMovimiento);
router.delete('/movimientos/:id', movimientoController.deleteMovimiento);

// Órdenes de Compra
router.get('/compras', ordenCompraController.getAllOrdenesCompra);
router.get('/compras/:id/pdf', ordenCompraController.getOrdenCompraPDF);
router.get('/compras/:id', ordenCompraController.getOrdenCompraById);
router.post('/compras', ordenCompraController.createOrdenCompra);
router.put('/compras/:id', ordenCompraController.updateOrdenCompra);
router.delete('/compras/:id', ordenCompraController.deleteOrdenCompra);

// === NUEVA VISTA DE ÓRDENES DE COMPRA (Basada en interfaz moderna) ===
// Vista moderna con filtros y paginación
router.get('/ordenes-compra', ordenCompraController.getAllOrdenesCompra);
router.post('/ordenes-compra', ordenCompraController.createOrdenCompraView);
router.get('/ordenes-compra/export', ordenCompraController.exportarOrdenesExcel);
router.get('/ordenes-compra/stats', ordenCompraController.getEstadisticasOrdenes);

// === AUTOCOMPLETE DESCRIPCIONES ===
// Combina Task List (tarea) + Catálogo de materiales (material):
//   tipo=MAC → UNION de tarea.ref_descripcion y material.descripcion, con su np
//   tipo=SER → tarea.texto (servicios del Task List)
router.get('/autocomplete-descripcion', async (req: Request, res: Response) => {
  const tipo = (req.query.tipo as string || 'MAC').toUpperCase();
  try {
    if (tipo === 'SER') {
      const rows = await sequelize.query<{ texto: string }>(
        `SELECT DISTINCT texto FROM tarea
         WHERE tipo_codigo = 'SER' AND texto IS NOT NULL AND texto <> ''
         ORDER BY texto`,
        { type: QueryTypes.SELECT }
      );
      res.json(rows.map(r => ({ value: r.texto })));
    } else {
      // MAC: UNION tarea.ref_descripcion + material.descripcion
      const rows = await sequelize.query<{ descripcion: string; np: string }>(
        `SELECT descripcion, np FROM (
           SELECT DISTINCT ref_descripcion AS descripcion, np
           FROM tarea
           WHERE tipo_codigo = 'MAC'
             AND ref_descripcion IS NOT NULL AND ref_descripcion <> ''
           UNION
           SELECT DISTINCT descripcion, np
           FROM material
           WHERE descripcion IS NOT NULL AND descripcion <> ''
         ) combined
         ORDER BY descripcion`,
        { type: QueryTypes.SELECT }
      );
      res.json(rows.map(r => ({ value: r.descripcion, np: r.np || '' })));
    }
  } catch (e: any) {
    res.json([]);
  }
});

// === REQUERIMIENTOS DE COMPRA (Vista central logística — todos los repuestos de OTs) ===
router.get('/requerimientos', compraController.getRequerimientosPendientes);

// === ÓRDENES DE COMPRA DESDE OT (Nuevo módulo de integración OT-Repuestos-PO) ===
// Generar OC desde múltiples requerimientos (multi-OT)
router.post('/compras/crear-oc', compraController.createOCFromRequerimientos);

// Generar Order de Compra desde repuestos de una OT (legacy)
router.post('/compras/from-ot', compraController.createCompraFromOT);

// Obtener todas las compras con información relacionada (incluye ot_id)
router.get('/compras-extended', compraController.getAllCompras);

// Actualizar una compra usando el nuevo controller
router.put('/compras-extended/:id', compraController.updateCompra);

// Eliminar una compra (solo si estado es Pendiente)
router.delete('/compras-extended/:id', compraController.deleteCompra);

// === INVENTARIO VALORIZADO ===
// Obtener inventario valorizado con stock actual
router.get('/inventario-valorizado', inventarioController.getInventarioValorizado);

// Obtener resumen de inventario
router.get('/inventario-resumen', inventarioController.getResumenInventario);

// === HERRAMIENTAS (Recursos de Inventario) ===
router.get('/herramientas', herramientaController.getAllHerramientas);
router.get('/herramientas/:id', herramientaController.getHerramientaById);
router.post('/herramientas', herramientaController.createHerramienta);
router.put('/herramientas/:id', herramientaController.updateHerramienta);
router.delete('/herramientas/:id', herramientaController.deleteHerramienta);
router.post('/herramientas/:id/checkout', herramientaController.checkOutHerramienta);
router.post('/herramientas/:id/checkin', herramientaController.checkInHerramienta);

export default router;
