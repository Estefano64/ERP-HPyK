-- Script para agregar proveedores y almacenes de prueba
-- Ejecuta esto en tu base de datos PostgreSQL

-- Insertar Proveedores
INSERT INTO proveedores (ruc, "razonSocial", nombre, direccion, telefono, email, contacto, "calificacion", activo, "createdAt", "updatedAt")
VALUES 
  ('20123456789', 'REPUESTOS MINEROS SAC', 'Repuestos Mineros', 'Av. Industrial 123, Arequipa', '054-123456', 'ventas@repuestosmineros.com', 'Juan Pérez', 5, true, NOW(), NOW()),
  ('20987654321', 'HIDRAULICA DEL SUR EIRL', 'Hidráulica del Sur', 'Calle Los Tornos 456, Arequipa', '054-654321', 'contacto@hidraulicasur.com', 'María García', 4, true, NOW(), NOW()),
  ('20456789123', 'SELLOS Y REPUESTOS SA', 'Sellos y Repuestos', 'Jr. Maquinaria 789, Lima', '01-7778888', 'info@sellosrepuestos.com', 'Carlos López', 5, true, NOW(), NOW()),
  ('20789456123', 'IMPORTACIONES CATERPILLAR', 'Importaciones CAT', 'Av. República 321, Lima', '01-4445555', 'cat@importaciones.com', 'Ana Torres', 5, true, NOW(), NOW()),
  ('20321654987', 'SUMINISTROS INDUSTRIALES HP', 'Suministros HP', 'Calle Comercio 654, Arequipa', '054-999888', 'ventas@suministroshp.com', 'Luis Fernández', 4, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insertar Almacenes
INSERT INTO almacenes (codigo, nombre, capacidad, ocupacion, zonas, ubicacion, estado, "createdAt", "updatedAt")
VALUES 
  ('ALM-PRIN', 'Almacén Principal Arequipa', 5000.00, 3200.00, 20, 'Planta principal - Zona A', 'Activo', NOW(), NOW()),
  ('ALM-REP', 'Almacén de Repuestos', 2000.00, 1500.00, 10, 'Planta principal - Zona B', 'Activo', NOW(), NOW()),
  ('ALM-CONS', 'Almacén de Consumibles', 1000.00, 600.00, 5, 'Planta principal - Zona C', 'Activo', NOW(), NOW()),
  ('ALM-HERRA', 'Almacén de Herramientas', 500.00, 350.00, 8, 'Taller mecánico', 'Activo', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Verificar resultados
SELECT COUNT(*) as total_proveedores FROM proveedores;
SELECT COUNT(*) as total_almacenes FROM almacenes;

SELECT * FROM proveedores ORDER BY id;
SELECT * FROM almacenes ORDER BY id;
