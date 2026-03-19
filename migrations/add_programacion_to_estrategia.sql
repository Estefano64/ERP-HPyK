-- Agregar columnas de programación de mantenimiento a la tabla estrategia
-- Ejecutar este script en la base de datos PostgreSQL

ALTER TABLE estrategia 
ADD COLUMN IF NOT EXISTS fecha_ultima_ejecucion DATE,
ADD COLUMN IF NOT EXISTS fecha_proxima_ejecucion DATE;

COMMENT ON COLUMN estrategia.fecha_ultima_ejecucion IS 'Última fecha en que se ejecutó la estrategia de mantenimiento';
COMMENT ON COLUMN estrategia.fecha_proxima_ejecucion IS 'Próxima fecha programada de ejecución según la frecuencia';

-- Verificar estructura
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'estrategia'
  AND column_name IN ('fecha_ultima_ejecucion', 'fecha_proxima_ejecucion');
