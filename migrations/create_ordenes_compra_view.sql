-- Migración para crear la tabla ordenes_compra_view basada en la interfaz mostrada
-- Ejecutar este script en PostgreSQL para crear la tabla y datos de ejemplo

-- Crear la tabla ordenes_compra_view
CREATE TABLE IF NOT EXISTS ordenes_compra_view (
    id SERIAL PRIMARY KEY,
    serie VARCHAR(10) NOT NULL,
    correlativo VARCHAR(20) NOT NULL,
    fecha DATE NOT NULL,
    fecha_recepcion_guia DATE,
    fecha_pago DATE,
    identificador_externo VARCHAR(50),
    tipo_documento VARCHAR(50) NOT NULL CHECK (tipo_documento IN ('Factura Electrónica', 'Boleta Electrónica', 'Nota de Crédito', 'Nota de Débito', 'Guía de Remisión')),
    ruc_receptor VARCHAR(11) NOT NULL,
    receptor VARCHAR(200) NOT NULL,
    division VARCHAR(100),
    importe_total DECIMAL(15,2) NOT NULL,
    moneda VARCHAR(3) NOT NULL DEFAULT 'USD',
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Recibido', 'Pagado', 'Cancelado')),
    centro_costo VARCHAR(50),
    observaciones TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(serie, correlativo)
);

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_ordenes_compra_fecha ON ordenes_compra_view(fecha);
CREATE INDEX IF NOT EXISTS idx_ordenes_compra_estado ON ordenes_compra_view(estado);
CREATE INDEX IF NOT EXISTS idx_ordenes_compra_ruc ON ordenes_compra_view(ruc_receptor);
CREATE INDEX IF NOT EXISTS idx_ordenes_compra_centro ON ordenes_compra_view(centro_costo);

-- Insertar datos de ejemplo (basados en la imagen del usuario)
INSERT INTO ordenes_compra_view (
    serie, correlativo, fecha, fecha_recepcion_guia, tipo_documento,
    ruc_receptor, receptor, importe_total, centro_costo
) VALUES 
    ('F001', '00002950', '2026-02-06', '2026-02-08', 'Factura Electrónica', '20114915026', 'COMPAÑÍA MINERA ANTAPACCAY S.A.', 11420.61, 'operaciones'),
    ('F001', '00002949', '2026-02-06', '2026-02-06', 'Factura Electrónica', '20114915026', 'COMPAÑÍA MINERA ANTAPACCAY S.A.', 5539.78, 'logistica'),
    ('F001', '00002948', '2026-02-06', '2026-02-06', 'Factura Electrónica', '20114915026', 'COMPAÑÍA MINERA ANTAPACCAY S.A.', 10194.03, 'administracion'),
    ('F001', '00002947', '2026-02-06', '2026-02-06', 'Factura Electrónica', '20114915026', 'COMPAÑÍA MINERA ANTAPACCAY S.A.', 2055.50, 'operaciones')
ON CONFLICT (serie, correlativo) DO NOTHING;

-- Verificar la creación
SELECT 
    COUNT(*) as total_ordenes,
    SUM(importe_total) as monto_total,
    COUNT(DISTINCT centro_costo) as centros_costo
FROM ordenes_compra_view;