import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import OrdenCompra from '../../models/OrdenCompra';
import sequelize from '../../config/database';

// ─── GET todas las órdenes (retorna array para la tabla HTML) ────
export const getAllOrdenesCompra = async (req: Request, res: Response) => {
  try {
    const ordenes = await sequelize.query(
      `SELECT
        oc.id,
        oc.numero_oc,
        oc.fecha_orden,
        oc.fecha_entrega_requerida,
        oc.proveedor_id,
        oc.contacto_proveedor,
        p."razonSocial"  AS proveedor_nombre,
        oc.material_id,
        m.descripcion    AS material_nombre,
        m.codigo         AS material_codigo,
        oc.descripcion,
        oc.cantidad,
        oc.unidad_medida,
        oc.precio_unitario,
        oc.subtotal,
        oc.igv_porcentaje,
        oc.descuento_porcentaje,
        oc.total_final,
        oc.forma_pago,
        oc.plazo_pago,
        oc.moneda,
        oc.almacen_id,
        a.nombre         AS almacen_nombre,
        oc.direccion_entrega,
        oc.incoterm,
        oc.estado,
        oc.prioridad,
        oc.tipo_compra,
        oc.observaciones,
        oc.user_crea,
        oc.ot_id,
        oc."createdAt",
        oc."updatedAt"
      FROM ordenes_compra oc
      LEFT JOIN proveedores    p ON p.id = oc.proveedor_id
      LEFT JOIN material       m ON m.material_id = oc.material_id
      LEFT JOIN almacenes      a ON a.id = oc.almacen_id
      ORDER BY oc."createdAt" DESC`,
      { type: QueryTypes.SELECT }
    );
    res.json(ordenes);
  } catch (error) {
    console.error('Error al obtener órdenes de compra:', error);
    res.status(500).json({ error: 'Error al obtener órdenes de compra', details: String(error) });
  }
};

// ─── GET por ID ───────────────────────────────────────────────────
export const getOrdenCompraById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [orden] = await sequelize.query(
      `SELECT
        oc.*,
        p."razonSocial"  AS proveedor_nombre,
        p.ruc            AS proveedor_ruc,
        p.direccion      AS proveedor_direccion,
        m.descripcion    AS material_nombre,
        m.codigo         AS material_codigo,
        a.nombre         AS almacen_nombre
      FROM ordenes_compra oc
      LEFT JOIN proveedores p ON p.id = oc.proveedor_id
      LEFT JOIN material    m ON m.material_id = oc.material_id
      LEFT JOIN almacenes   a ON a.id = oc.almacen_id
      WHERE oc.id = :id`,
      { type: QueryTypes.SELECT, replacements: { id: parseInt(id as string) } }
    );
    if (!orden) return res.status(404).json({ error: 'Orden de compra no encontrada' });
    res.json(orden);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener orden de compra', details: String(error) });
  }
};

// ─── POST crear orden de compra ────────────────────────────────────
export const createOrdenCompra = async (req: Request, res: Response) => {
  try {
    const {
      numero_oc, fecha_orden, fecha_entrega_requerida,
      proveedor_id, contacto_proveedor,
      material_id, descripcion,
      cantidad, unidad_medida, precio_unitario,
      subtotal, igv_porcentaje, descuento_porcentaje, total_final,
      forma_pago, plazo_pago, moneda,
      almacen_id, direccion_entrega, incoterm,
      estado, prioridad, tipo_compra,
      observaciones, user_crea, ot_id,
    } = req.body;

    const pId = Number(proveedor_id);
    if (!numero_oc || !fecha_orden || !pId || isNaN(pId)) {
      return res.status(400).json({ error: 'Faltan campos requeridos: numero_oc, fecha_orden, proveedor_id' });
    }

    const nueva = await OrdenCompra.create({
      numero_oc: String(numero_oc).trim(),
      fecha_orden,
      fecha_entrega_requerida: fecha_entrega_requerida || undefined,
      proveedor_id: pId,
      contacto_proveedor: contacto_proveedor || undefined,
      material_id: material_id && !isNaN(Number(material_id)) ? Number(material_id) : undefined,
      descripcion: descripcion || undefined,
      cantidad: cantidad != null && !isNaN(Number(cantidad)) ? Number(cantidad) : undefined,
      unidad_medida: unidad_medida || undefined,
      precio_unitario: precio_unitario != null && !isNaN(Number(precio_unitario)) ? Number(precio_unitario) : undefined,
      subtotal: subtotal != null && !isNaN(Number(subtotal)) ? Number(subtotal) : undefined,
      igv_porcentaje: igv_porcentaje != null ? Number(igv_porcentaje) : 18,
      descuento_porcentaje: descuento_porcentaje != null ? Number(descuento_porcentaje) : 0,
      total_final: total_final != null && !isNaN(Number(total_final)) ? Number(total_final) : undefined,
      forma_pago: forma_pago || undefined,
      plazo_pago: plazo_pago && !isNaN(Number(plazo_pago)) ? Number(plazo_pago) : undefined,
      moneda: moneda || 'USD',
      almacen_id: almacen_id && !isNaN(Number(almacen_id)) ? Number(almacen_id) : undefined,
      direccion_entrega: direccion_entrega || undefined,
      incoterm: incoterm || undefined,
      estado: (estado || 'borrador') as any,
      prioridad: (prioridad || 'media') as any,
      tipo_compra: tipo_compra || undefined,
      observaciones: observaciones || undefined,
      user_crea: user_crea || undefined,
      ot_id: ot_id && !isNaN(Number(ot_id)) ? Number(ot_id) : undefined,
    });

    res.status(201).json(nueva);
  } catch (error) {
    console.error('Error al crear orden de compra:', error);
    res.status(400).json({ error: 'Error al crear orden de compra', details: String(error) });
  }
};

// ─── PUT actualizar ────────────────────────────────────────────────
export const updateOrdenCompra = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orden = await OrdenCompra.findByPk(parseInt(id as string));
    if (!orden) return res.status(404).json({ error: 'Orden de compra no encontrada' });
    await orden.update(req.body);
    res.json(orden);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar orden de compra', details: String(error) });
  }
};

// ─── DELETE ────────────────────────────────────────────────────────
export const deleteOrdenCompra = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orden = await OrdenCompra.findByPk(parseInt(id as string));
    if (!orden) return res.status(404).json({ error: 'Orden de compra no encontrada' });
    await orden.destroy();
    res.json({ message: 'Orden de compra eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar orden de compra', details: String(error) });
  }
};

// ─── GET PDF — retorna HTML imprimible de la OC ────────────────────
export const getOrdenCompraPDF = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [orden] = await sequelize.query(
      `SELECT
        oc.*,
        p."razonSocial"  AS proveedor_nombre,
        p.ruc            AS proveedor_ruc,
        p.direccion      AS proveedor_direccion,
        p.telefono       AS proveedor_telefono,
        p.email          AS proveedor_email,
        m.descripcion    AS material_nombre,
        m.codigo         AS material_codigo,
        a.nombre         AS almacen_nombre
      FROM ordenes_compra oc
      LEFT JOIN proveedores p ON p.id = oc.proveedor_id
      LEFT JOIN material    m ON m.material_id = oc.material_id
      LEFT JOIN almacenes   a ON a.id = oc.almacen_id
      WHERE oc.id = :id`,
      { type: QueryTypes.SELECT, replacements: { id: parseInt(id as string) } }
    ) as any[];

    if (!orden) return res.status(404).json({ error: 'Orden de compra no encontrada' });

    const oc = orden as any;
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>OC-${oc.numero_oc} — HP&K ERP</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 12px; color: #222; padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1e40af; padding-bottom: 16px; margin-bottom: 20px; }
    .company { }
    .company h1 { font-size: 22px; font-weight: bold; color: #1e40af; }
    .company p { color: #555; font-size: 11px; }
    .doc-info { text-align: right; }
    .doc-info .oc-number { font-size: 20px; font-weight: bold; color: #1e40af; }
    .doc-info p { font-size: 11px; color: #444; margin-top: 2px; }
    .section { margin-bottom: 16px; }
    .section h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #1e40af; border-bottom: 1px solid #bfdbfe; padding-bottom: 4px; margin-bottom: 8px; font-weight: bold; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 20px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px 20px; }
    .field label { font-size: 10px; color: #666; display: block; }
    .field span { font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    thead th { background: #1e40af; color: #fff; padding: 6px 8px; text-align: left; font-size: 11px; }
    tbody td { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; }
    tbody tr:nth-child(even) { background: #f8fafc; }
    .totals { margin-top: 12px; display: flex; justify-content: flex-end; }
    .totals-box { width: 280px; }
    .totals-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #e5e7eb; }
    .totals-row.final { font-size: 14px; font-weight: bold; color: #1e40af; border-top: 2px solid #1e40af; border-bottom: none; margin-top: 4px; padding-top: 6px; }
    .footer { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; text-align: center; }
    .firma { border-top: 1px solid #555; padding-top: 6px; font-size: 10px; color: #555; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; }
    .badge-borrador { background: #e5e7eb; color: #374151; }
    .badge-enviada { background: #dbeafe; color: #1e40af; }
    .badge-confirmada { background: #d1fae5; color: #065f46; }
    .badge-recibida { background: #ccfbf1; color: #0f766e; }
    .badge-cancelada { background: #fee2e2; color: #991b1b; }
    @media print { body { padding: 8px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="company">
      <h1>HP&amp;K</h1>
      <p>Reparación de Componentes de Maquinaria Pesada</p>
      <p>Arequipa, Perú</p>
    </div>
    <div class="doc-info">
      <div class="oc-number">ORDEN DE COMPRA</div>
      <p><strong>N°:</strong> ${oc.numero_oc}</p>
      <p><strong>Fecha:</strong> ${oc.fecha_orden || '-'}</p>
      <p><strong>Estado:</strong> <span class="badge badge-${oc.estado}">${(oc.estado || 'borrador').toUpperCase()}</span></p>
    </div>
  </div>

  <div class="grid-2" style="margin-bottom:16px;">
    <div class="section">
      <h3>Datos del Proveedor</h3>
      <div class="grid-2">
        <div class="field"><label>Razón Social</label><span>${oc.proveedor_nombre || '-'}</span></div>
        <div class="field"><label>RUC</label><span>${oc.proveedor_ruc || '-'}</span></div>
        <div class="field"><label>Teléfono</label><span>${oc.proveedor_telefono || '-'}</span></div>
        <div class="field"><label>Email</label><span>${oc.proveedor_email || '-'}</span></div>
        <div class="field" style="grid-column:span 2"><label>Dirección</label><span>${oc.proveedor_direccion || '-'}</span></div>
        ${oc.contacto_proveedor ? `<div class="field"><label>Contacto</label><span>${oc.contacto_proveedor}</span></div>` : ''}
      </div>
    </div>
    <div class="section">
      <h3>Condiciones de Compra</h3>
      <div class="grid-2">
        <div class="field"><label>Forma de Pago</label><span>${oc.forma_pago || '-'}</span></div>
        <div class="field"><label>Plazo (días)</label><span>${oc.plazo_pago || '-'}</span></div>
        <div class="field"><label>Moneda</label><span>${oc.moneda || 'USD'}</span></div>
        <div class="field"><label>Incoterm</label><span>${oc.incoterm || '-'}</span></div>
        <div class="field"><label>Tipo Compra</label><span>${oc.tipo_compra || '-'}</span></div>
        <div class="field"><label>Prioridad</label><span>${(oc.prioridad || '-').toUpperCase()}</span></div>
        <div class="field"><label>Almacén Destino</label><span>${oc.almacen_nombre || '-'}</span></div>
        <div class="field"><label>F. Entrega Req.</label><span>${oc.fecha_entrega_requerida || '-'}</span></div>
      </div>
    </div>
  </div>

  <div class="section">
    <h3>Detalle del Pedido</h3>
    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Descripción</th>
          <th style="text-align:center">Cant.</th>
          <th style="text-align:center">UM</th>
          <th style="text-align:right">P. Unit.</th>
          <th style="text-align:right">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${oc.material_codigo || '-'}</td>
          <td>${oc.descripcion || oc.material_nombre || '-'}</td>
          <td style="text-align:center">${oc.cantidad || '-'}</td>
          <td style="text-align:center">${oc.unidad_medida || '-'}</td>
          <td style="text-align:right">${oc.moneda} ${parseFloat(oc.precio_unitario || 0).toFixed(2)}</td>
          <td style="text-align:right">${oc.moneda} ${parseFloat(oc.subtotal || 0).toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-box">
        <div class="totals-row"><span>Subtotal:</span><span>${oc.moneda} ${parseFloat(oc.subtotal || 0).toFixed(2)}</span></div>
        <div class="totals-row"><span>Descuento (${oc.descuento_porcentaje || 0}%):</span><span>- ${oc.moneda} ${(parseFloat(oc.subtotal||0) * parseFloat(oc.descuento_porcentaje||0) / 100).toFixed(2)}</span></div>
        <div class="totals-row"><span>IGV (${oc.igv_porcentaje || 18}%):</span><span>${oc.moneda} ${((parseFloat(oc.subtotal||0) * (1 - parseFloat(oc.descuento_porcentaje||0)/100)) * parseFloat(oc.igv_porcentaje||18) / 100).toFixed(2)}</span></div>
        <div class="totals-row final"><span>TOTAL:</span><span>${oc.moneda} ${parseFloat(oc.total_final || 0).toFixed(2)}</span></div>
      </div>
    </div>
  </div>

  ${oc.observaciones ? `<div class="section"><h3>Observaciones</h3><p>${oc.observaciones}</p></div>` : ''}
  ${oc.direccion_entrega ? `<div class="section"><h3>Dirección de Entrega</h3><p>${oc.direccion_entrega}</p></div>` : ''}

  <div class="footer">
    <div class="firma">_______________________<br>Solicitado por<br>${oc.user_crea || 'Logística'}</div>
    <div class="firma">_______________________<br>Aprobado por<br>Gerencia</div>
    <div class="firma">_______________________<br>Conformidad Proveedor</div>
  </div>

  <script>window.onload = () => window.print();</script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({ error: 'Error al generar PDF', details: String(error) });
  }
};

// ─── Stubs para compatibilidad con rutas antiguas ──────────────────
export const createOrdenCompraView = createOrdenCompra;
export const exportarOrdenesExcel = async (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Función no disponible' });
};
export const getEstadisticasOrdenes = async (_req: Request, res: Response) => {
  try {
    const [stats] = await sequelize.query(
      `SELECT
        COUNT(*) AS total,
        COUNT(CASE WHEN estado = 'borrador' THEN 1 END) AS borradores,
        COUNT(CASE WHEN estado = 'enviada'  THEN 1 END) AS enviadas,
        COUNT(CASE WHEN estado = 'confirmada' THEN 1 END) AS confirmadas,
        COALESCE(SUM(total_final), 0) AS monto_total
      FROM ordenes_compra`,
      { type: QueryTypes.SELECT }
    );
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: String(error) });
  }
};
