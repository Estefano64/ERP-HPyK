/**
 * Controlador para Compras (Purchase Orders)
 * Maneja la generación de POs desde OTs y su vinculación
 */

import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import Compra from '../../models/Compra';
import CompraDetalle from '../../models/CompraDetalle';
import OTRepuesto from '../../models/OTRepuesto';
import OTHistorial from '../../models/OTHistorial';
import sequelize from '../../config/database';

// Helper para asegurar que el parámetro sea string
const ensureString = (param: string | string[]): string => {
  return Array.isArray(param) ? param[0] : param;
};

// Obtener todas las compras
export const getAllCompras = async (req: Request, res: Response) => {
  try {
    const compras = await sequelize.query(
      `SELECT
        c.*,
        p."razonSocial" as proveedor_nombre,
        a.nombre as almacen_nombre,
        o.ot as ot_numero
      FROM compras c
      LEFT JOIN proveedores p ON c.proveedor_id = p.id
      LEFT JOIN almacenes a ON c.almacen_id = a.id
      LEFT JOIN orden_trabajo o ON c.ot_id = o.id
      ORDER BY c.fecha_solicitud DESC`,
      {
        type: QueryTypes.SELECT
      }
    );
    
    res.json(compras);
  } catch (error) {
    console.error('Error al obtener compras:', error);
    res.status(500).json({ error: 'Error al obtener compras', details: error });
  }
};

// Obtener compra por ID con detalles
export const getCompraById = async (req: Request, res: Response) => {
  try {
    const id = ensureString(req.params.id);
    
    const compra = await sequelize.query(
      `SELECT 
        c.*,
        p.razonSocial as proveedor_nombre,
        a.nombre as almacen_nombre
      FROM compras c
      LEFT JOIN proveedores p ON c.proveedor_id = p.id
      LEFT JOIN almacenes a ON c.almacen_id = a.id
      WHERE c.id = :id`,
      {
        replacements: { id },
        type: QueryTypes.SELECT
      }
    );
    
    if (!compra || compra.length === 0) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }
    
    // Obtener detalles de la compra
    const detalles = await sequelize.query(
      `SELECT
        cd.*,
        m.descripcion as material_nombre,
        m.codigo as material_codigo
      FROM compras_detalle cd
      LEFT JOIN material m ON cd.material_id = m.material_id
      WHERE cd.compra_id = :id`,
      {
        replacements: { id },
        type: QueryTypes.SELECT
      }
    );
    
    res.json({
      ...compra[0],
      detalles
    });
  } catch (error) {
    console.error('Error al obtener compra:', error);
    res.status(500).json({ error: 'Error al obtener compra', details: error });
  }
};

// Generar HTML imprimible de una compra (PO) con requerimientos asociados
export const getCompraPDF = async (req: Request, res: Response) => {
  try {
    const id = ensureString(req.params.id);

    const [compra]: any[] = await sequelize.query(
      `SELECT 
        c.*, 
        p."razonSocial" AS proveedor_nombre,
        p.ruc            AS proveedor_ruc,
        p.direccion      AS proveedor_direccion,
        p.telefono       AS proveedor_telefono,
        p.email          AS proveedor_email,
        a.nombre         AS almacen_nombre
      FROM compras c
      LEFT JOIN proveedores p ON c.proveedor_id = p.id
      LEFT JOIN almacenes  a ON c.almacen_id = a.id
      WHERE c.id = :id`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );

    if (!compra) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }

    const requerimientos: any[] = await sequelize.query(
      `SELECT
        r.*, 
        ot.ot                 AS numero_ot,
        ot.equipo_codigo      AS equipo_codigo,
        c.razon_social        AS cliente_nombre,
        m.descripcion         AS material_nombre,
        m.codigo              AS material_codigo
      FROM ot_repuestos r
      JOIN orden_trabajo ot ON r.ot_id = ot.id
      LEFT JOIN cliente c    ON ot.id_cliente = c.cliente_id
      LEFT JOIN material m   ON r.material_id = m.material_id
      WHERE r.po_id = :id
      ORDER BY r.nro_req NULLS LAST, r.item_req NULLS LAST, r.id`,
      { replacements: { id }, type: QueryTypes.SELECT }
    ) as any[];

    const po = compra as any;
    const moneda = po.moneda || 'USD';

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>PO ${po.numero_po || ''} — HP&K ERP</title>
  <style>
    * { box-sizing:border-box; }
    body { font-family: Arial, sans-serif; font-size: 11px; color:#111; padding:16px; }
    h1 { font-size:20px; margin:0 0 4px 0; }
    h2 { font-size:14px; margin:16px 0 4px 0; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; }
    .empresa { font-size:11px; color:#374151; }
    .po-box { text-align:right; }
    .po-num { font-size:18px; font-weight:bold; color:#1d4ed8; }
    .badge { display:inline-block; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:bold; }
    .badge-Pendiente { background:#dbeafe; color:#1d4ed8; }
    .badge-Recibido { background:#dcfce7; color:#166534; }
    .badge-Cancelado { background:#fee2e2; color:#b91c1c; }
    table { border-collapse:collapse; width:100%; }
    .tabla-resumen td { border:1px solid #e5e7eb; padding:4px 6px; font-size:10px; }
    .tabla-resumen th { border:1px solid #e5e7eb; padding:4px 6px; background:#f3f4f6; font-size:10px; text-align:left; }
    .tabla-detalle thead th { border:1px solid #9ca3af; background:#e5e7eb; padding:4px 6px; font-size:10px; text-align:center; }
    .tabla-detalle tbody td { border:1px solid #d1d5db; padding:3px 4px; font-size:10px; }
    .right { text-align:right; }
    .center { text-align:center; }
    .small { font-size:9px; color:#4b5563; }
    .mt-1 { margin-top:4px; }
    .mt-2 { margin-top:8px; }
    .mt-3 { margin-top:12px; }
    .totales { margin-top:8px; width:260px; margin-left:auto; }
    .totales td { border:1px solid #e5e7eb; padding:3px 4px; font-size:10px; }
    .totales tr:last-child td { font-weight:bold; background:#f0f9ff; }
    @media print { body { padding:8px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="empresa">
      <h1>HP&K INVERSIONES S.R.L.</h1>
      <div>Sistema Hidráulico de Gestión</div>
      <div>Arequipa, Perú</div>
    </div>
    <div class="po-box">
      <div class="small">Orden de Compra (PO)</div>
      <div class="po-num">${po.numero_po || '-'}</div>
      <div class="small">Fecha: ${po.fecha_solicitud ? String(po.fecha_solicitud).substring(0,10) : '-'}</div>
      <div class="small">Estado: <span class="badge badge-${po.estado || 'Pendiente'}">${po.estado || 'Pendiente'}</span></div>
    </div>
  </div>

  <h2>Resumen de la PO</h2>
  <table class="tabla-resumen">
    <tr>
      <th>Proveedor</th><td>${po.proveedor_nombre || '-'}</td>
      <th>RUC</th><td>${po.proveedor_ruc || '-'}</td>
    </tr>
    <tr>
      <th>Almacén Destino</th><td>${po.almacen_nombre || '-'}</td>
      <th>F. Entrega Esperada</th><td>${po.fecha_entrega_esperada ? String(po.fecha_entrega_esperada).substring(0,10) : '-'}</td>
    </tr>
    <tr>
      <th>Moneda</th><td>${moneda}</td>
      <th>Usuario Solicita</th><td>${po.usuario_solicita || '-'}</td>
    </tr>
    <tr>
      <th>Observaciones</th><td colspan="3">${po.observaciones || ''}</td>
    </tr>
  </table>

  <h2 class="mt-3">Requerimientos vinculados</h2>
  <table class="tabla-detalle mt-1">
    <thead>
      <tr>
        <th>N° Req</th>
        <th>Item</th>
        <th>OT</th>
        <th>Cliente / Equipo</th>
        <th>Tipo</th>
        <th>Código</th>
        <th>Descripción</th>
        <th>Cant.</th>
        <th>UM</th>
        <th>Precio Unit.</th>
        <th>Total</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      ${requerimientos.length === 0
        ? `<tr><td colspan="12" class="center small">No hay requerimientos vinculados a esta PO</td></tr>`
        : requerimientos.map(r => {
            const cant = parseFloat(r.cantidad || 0) || 0;
            const pu   = parseFloat(r.precio_unitario || 0) || 0;
            const total = cant * pu;
            return `<tr>
              <td class="center">${r.nro_req || ''}</td>
              <td class="center">${r.item_req || ''}</td>
              <td class="center">${r.numero_ot || r.ot_id || ''}</td>
              <td>${(r.cliente_nombre || '') + (r.equipo_codigo ? ' / ' + r.equipo_codigo : '')}</td>
              <td class="center">${r.tipo_codigo || ''}</td>
              <td>${r.material_codigo || ''}</td>
              <td>${r.material_nombre || r.descripcion || r.texto || ''}</td>
              <td class="right">${cant ? cant.toFixed(2) : ''}</td>
              <td class="center">${r.unidad_medida || ''}</td>
              <td class="right">${pu ? moneda + ' ' + pu.toFixed(2) : ''}</td>
              <td class="right">${total ? moneda + ' ' + total.toFixed(2) : ''}</td>
              <td class="center">${r.estado || ''}</td>
            </tr>`;
          }).join('')}
    </tbody>
  </table>

  <table class="totales mt-2">
    <tr><td>Subtotal</td><td class="right">${moneda} ${(parseFloat(po.subtotal || 0) || 0).toFixed(2)}</td></tr>
    <tr><td>Impuestos</td><td class="right">${moneda} ${(parseFloat(po.impuesto || 0) || 0).toFixed(2)}</td></tr>
    <tr><td>Total PO</td><td class="right">${moneda} ${(parseFloat(po.total || 0) || 0).toFixed(2)}</td></tr>
  </table>

  <script>window.onload = function(){ window.print(); };</script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error('Error al generar PDF de compra:', error);
    res.status(500).json({ error: 'Error al generar PDF de compra', details: String(error) });
  }
};

// Generar PO desde una OT con repuestos
export const createCompraFromOT = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { 
      ot_id, 
      proveedor_id, 
      almacen_id, 
      repuestos_ids, 
      fecha_entrega_esperada,
      moneda = 'USD',
      usuario 
    } = req.body;
    
    if (!ot_id || !proveedor_id || !almacen_id || !repuestos_ids || repuestos_ids.length === 0) {
      return res.status(400).json({ 
        error: 'Faltan datos requeridos: ot_id, proveedor_id, almacen_id, repuestos_ids' 
      });
    }
    
    // Obtener los repuestos solicitados
    const repuestos = await OTRepuesto.findAll({
      where: {
        id: repuestos_ids,
        ot_id: ot_id,
        estado: 'Pendiente'
      }
    });
    
    if (repuestos.length === 0) {
      return res.status(400).json({ 
        error: 'No se encontraron repuestos pendientes con los IDs proporcionados' 
      });
    }
    
    // Generar número de PO automático
    const lastPO = await Compra.findOne({
      order: [['id', 'DESC']]
    });
    
    const year = new Date().getFullYear();
    const lastNumber = lastPO ? parseInt(lastPO.numero_po.split('-').pop() || '0') : 0;
    const numero_po = `PO-${year}-${String(lastNumber + 1).padStart(4, '0')}`;
    
    // Obtener información de materiales con precios (simulado por ahora)
    const materialesInfo = await sequelize.query(
      `SELECT m.material_id, m.descripcion, m.precio, m.stock_actual
       FROM material m
       WHERE m.material_id IN (:ids)`,
      {
        replacements: { ids: repuestos.map(r => r.material_id) },
        type: QueryTypes.SELECT
      }
    );

    // Calcular totales
    let subtotal = 0;
    const detallesCompra = repuestos.map((rep: any) => {
      const materialInfo: any = materialesInfo.find((m: any) => m.material_id === rep.material_id);
      const precio = materialInfo?.precio || 0;
      const itemSubtotal = precio * rep.cantidad;
      subtotal += itemSubtotal;
      
      return {
        material_id: rep.material_id,
        cantidad: rep.cantidad,
        precio_unitario: precio,
        subtotal: itemSubtotal,
        descuento: 0,
        impuesto: itemSubtotal * 0.18, // IGV Perú
        total: itemSubtotal * 1.18
      };
    });
    
    const impuesto = subtotal * 0.18;
    const total = subtotal + impuesto;
    
    // Crear la compra
    const compra = await Compra.create({
      numero_po,
      ot_id,
      proveedor_id,
      almacen_id,
      fecha_solicitud: new Date(),
      fecha_entrega_esperada: fecha_entrega_esperada ? new Date(fecha_entrega_esperada) : undefined,
      estado: 'Pendiente',
      subtotal,
      impuesto,
      total,
      moneda,
      usuario_solicita: usuario || 'Admin',
      observaciones: `Generado desde OT #${ot_id}`
    }, { transaction });
    
    // Crear detalles de la compra
    await Promise.all(
      detallesCompra.map(detalle => 
        CompraDetalle.create({
          compra_id: compra.id,
          ...detalle
        }, { transaction })
      )
    );
    
    // Actualizar estado de repuestos a "En PO"
    await Promise.all(
      repuestos.map(rep => 
        rep.update({
          estado: 'En PO',
          po_id: compra.id
        }, { transaction })
      )
    );
    
    // Registrar en historial de OT
    await OTHistorial.create({
      ot_id,
      tipo_operacion: 'Generación PO',
      descripcion: `Orden de Compra ${numero_po} generada con ${repuestos.length} item(s)`,
      usuario: usuario || 'Admin',
      fecha: new Date(),
      datos_adicionales: JSON.stringify({ 
        po_id: compra.id, 
        numero_po, 
        total,
        cantidad_items: repuestos.length 
      })
    }, { transaction });
    
    await transaction.commit();
    
    res.status(201).json({
      message: 'Orden de Compra generada exitosamente',
      compra,
      detalles: detallesCompra
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('Error al generar PO desde OT:', error);
    res.status(400).json({ error: 'Error al generar Orden de Compra', details: error });
  }
};

// Actualizar compra
export const updateCompra = async (req: Request, res: Response) => {
  try {
    const id = ensureString(req.params.id);
    
    const compra = await Compra.findByPk(parseInt(id));
    
    if (!compra) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }
    
    await compra.update(req.body);
    
    res.json(compra);
  } catch (error) {
    console.error('Error al actualizar compra:', error);
    res.status(400).json({ error: 'Error al actualizar compra', details: error });
  }
};

// Obtener todos los requerimientos pendientes de compra (vista central logística)
export const getRequerimientosPendientes = async (req: Request, res: Response) => {
  try {
    const { estado, cliente_id } = req.query;

    const whereClause = estado
      ? `WHERE r.estado = '${estado}'`
      : `WHERE r.estado NOT IN ('COM', 'ANU', 'DEV', 'ANULADO')`;

    const clienteFilter = cliente_id
      ? ` AND ot.id_cliente = ${cliente_id}`
      : '';

    const query = `
      SELECT
        r.id, r.ot_id, r.material_id, r.nro_req, r.item_req, r.tipo_codigo,
        r.cantidad, r.estado, r.estado_cot,
        r.precio_unitario, r.precio_venta, r.moneda,
        r.fecha_solicitud, r.fecha_requerida,
        r.observaciones, r.proveedor_id, r.po_id, r.nro_oc, r.item_oc,
        r.descripcion, r.fabricante_codigo, r.texto, r.unidad_medida, r.usuario_solicita,
        r.fecha_oc, r.fecha_entrega_esperada, r.fecha_entrega_real,
        r.nro_guia, r.nro_factura_proveedor, r.factura_cliente, r.gr_mina,
        r.ubicacion, r.fecha_salida_almacen, r.fecha_envio_mina, r.fecha_facturacion,
        ot.ot as numero_ot, ot.prioridad_atencion_codigo,
        ot.taller_status_codigo, ot.ot_status_codigo,
        ot.equipo_codigo, ot.tipo_reparacion_codigo,
        c.razon_social as cliente_nombre,
        m.descripcion as material_nombre, m.codigo as material_codigo,
        m.stock_actual,
        p."razonSocial" as proveedor_nombre,
        comp.numero_po
      FROM ot_repuestos r
      JOIN orden_trabajo ot ON r.ot_id = ot.id
      LEFT JOIN cliente c ON ot.id_cliente = c.cliente_id
      LEFT JOIN material m ON r.material_id = m.material_id
      LEFT JOIN proveedores p ON r.proveedor_id = p.id
      LEFT JOIN compras comp ON r.po_id = comp.id
      ${whereClause}${clienteFilter}
      ORDER BY
        CASE ot.prioridad_atencion_codigo
          WHEN 'E' THEN 1 WHEN '1' THEN 2 WHEN '2' THEN 3 ELSE 4 END,
        r.fecha_solicitud ASC
    `;

    const [results] = await sequelize.query(query);
    res.json(results);
  } catch (error) {
    console.error('Error getRequerimientosPendientes:', error);
    res.status(500).json({ error: 'Error al obtener requerimientos' });
  }
};

// Crear OC desde múltiples requerimientos (puede ser de varias OTs)
export const createOCFromRequerimientos = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const { repuesto_ids, proveedor_id, almacen_id, fecha_entrega_esperada, moneda = 'USD', usuario } = req.body;

    if (!proveedor_id || !almacen_id || !Array.isArray(repuesto_ids) || repuesto_ids.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Faltan: proveedor_id, almacen_id, repuesto_ids[]' });
    }

    // Obtener los repuestos (sin filtrar por ot_id — multi-OT)
    const repuestos = await OTRepuesto.findAll({ where: { id: repuesto_ids } });
    if (repuestos.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'No se encontraron los requerimientos indicados' });
    }

    // Generar número OC en formato D{yy}{NNNN}
    const yy = String(new Date().getFullYear()).slice(-2);
    const [lastRow]: any = await sequelize.query(
      `SELECT numero_po FROM compras WHERE numero_po LIKE 'D${yy}%' ORDER BY numero_po DESC LIMIT 1`
    );
    let seq = 1;
    if (lastRow && lastRow.length > 0) {
      const lastNum = parseInt((lastRow[0].numero_po || '').slice(3)) || 0;
      seq = lastNum + 1;
    }
    const numero_po = `D${yy}${String(seq).padStart(4, '0')}`;

    // Calcular totales
    let subtotal = 0;
    const detalles = repuestos.map((r: any) => {
      const precio = parseFloat(r.precio_unitario) || 0;
      // Forzar cantidad a entero para coincidir con el tipo INTEGER en la BD
      const rawCantidad = r.cantidad != null ? String(r.cantidad).replace(',', '.') : '0';
      const cantidad = parseInt(parseFloat(rawCantidad).toString().split('.')[0], 10) || 0;
      const itemSub = precio * cantidad;
      subtotal += itemSub;
      return {
        material_id: r.material_id,
        cantidad,
        precio_unitario: precio,
        subtotal: itemSub,
        descuento: 0,
        impuesto: itemSub * 0.18,
        total: itemSub * 1.18,
      };
    });
    const impuesto = subtotal * 0.18;
    const total = subtotal + impuesto;

    // Crear Compra (ot_id = null para OC multi-OT)
    const compra = await Compra.create({
      numero_po,
      proveedor_id,
      almacen_id,
      fecha_solicitud: new Date(),
      fecha_entrega_esperada: fecha_entrega_esperada ? new Date(fecha_entrega_esperada) : undefined,
      estado: 'Pendiente',
      subtotal, impuesto, total, moneda,
      usuario_solicita: usuario || 'Logística',
      observaciones: `OC generada desde ${repuestos.length} requerimiento(s) — ${repuesto_ids.length} item(s)`,
    }, { transaction });

    // Crear detalles (solo ítems MAC con material_id — SER/CAD no aplican en compras_detalle)
    const detallesConMaterial = detalles.filter(d => d.material_id != null);
    await Promise.all(detallesConMaterial.map(d => CompraDetalle.create({ compra_id: compra.id, ...d }, { transaction })));

    // Actualizar cada repuesto: estado='En PO', nro_oc, po_id
    await Promise.all(repuestos.map((r: any) =>
      r.update({ estado: 'En PO', nro_oc: numero_po, po_id: compra.id }, { transaction })
    ));

    // Registrar historial por cada OT única involucrada
    const otIds = [...new Set(repuestos.map((r: any) => r.ot_id))];
    await Promise.all(otIds.map(otId =>
      OTHistorial.create({
        ot_id: otId, tipo_operacion: 'Generación PO',
        descripcion: `OC ${numero_po} generada (multi-OT) con ${repuestos.filter((r: any) => r.ot_id === otId).length} ítem(s)`,
        usuario: usuario || 'Logística', fecha: new Date(),
        datos_adicionales: JSON.stringify({ po_id: compra.id, numero_po }),
      }, { transaction })
    ));

    await transaction.commit();
    res.status(201).json({ message: `OC ${numero_po} generada con ${repuestos.length} ítem(s)`, compra });
  } catch (error: any) {
    await transaction.rollback();
    console.error('Error createOCFromRequerimientos:', error);
    res.status(400).json({ error: 'Error al generar OC', details: error.message });
  }
};

// Eliminar compra
export const deleteCompra = async (req: Request, res: Response) => {
  try {
    const id = ensureString(req.params.id);
    
    const compra = await Compra.findByPk(parseInt(id));
    
    if (!compra) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }
    
    if (compra.estado !== 'Pendiente') {
      return res.status(400).json({ 
        error: 'Solo se pueden eliminar compras en estado Pendiente' 
      });
    }
    
    await compra.destroy();
    
    res.json({ message: 'Compra eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar compra:', error);
    res.status(500).json({ error: 'Error al eliminar compra', details: error });
  }
};
