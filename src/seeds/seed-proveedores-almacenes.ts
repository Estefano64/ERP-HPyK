/**
 * Script para poblar proveedores y almacenes iniciales
 */

import sequelize from '../config/database';
import Proveedor from '../models/Proveedor';
import Almacen from '../models/Almacen';

async function seedProveedoresAlmacenes() {
  try {
    console.log('🏢 Poblando Proveedores y Almacenes...\n');

    // Crear proveedores
    const proveedores = await Proveedor.bulkCreate([
      {
        ruc: '20123456789',
        razonSocial: 'REPUESTOS MINEROS SAC',
        nombre: 'Repuestos Mineros',
        direccion: 'Av. Industrial 123, Arequipa',
        telefono: '054-123456',
        email: 'ventas@repuestosmineros.com',
        contacto: 'Juan Pérez',
        calificacion: 5,
        activo: true
      },
      {
        ruc: '20987654321',
        razonSocial: 'HIDRAULICA DEL SUR EIRL',
        nombre: 'Hidráulica del Sur',
        direccion: 'Calle Los Tornos 456, Arequipa',
        telefono: '054-654321',
        email: 'contacto@hidraulicasur.com',
        contacto: 'María García',
        calificacion: 4,
        activo: true
      },
      {
        ruc: '20456789123',
        razonSocial: 'SELLOS Y REPUESTOS SA',
        nombre: 'Sellos y Repuestos',
        direccion: 'Jr. Maquinaria 789, Lima',
        telefono: '01-7778888',
        email: 'info@sellosrepuestos.com',
        contacto: 'Carlos López',
        calificacion: 5,
        activo: true
      },
      {
        ruc: '20789456123',
        razonSocial: 'IMPORTACIONES CATERPILLAR',
        nombre: 'Importaciones CAT',
        direccion: 'Av. República 321, Lima',
        telefono: '01-4445555',
        email: 'cat@importaciones.com',
        contacto: 'Ana Torres',
        calificacion: 5,
        activo: true
      },
      {
        ruc: '20321654987',
        razonSocial: 'SUMINISTROS INDUSTRIALES HP',
        nombre: 'Suministros HP',
        direccion: 'Calle Comercio 654, Arequipa',
        telefono: '054-999888',
        email: 'ventas@suministroshp.com',
        contacto: 'Luis Fernández',
        calificacion: 4,
        activo: true
      }
    ], { ignoreDuplicates: true });

    console.log(`✓ ${proveedores.length} proveedores creados`);

    // Crear almacenes
    const almacenes = await Almacen.bulkCreate([
      {
        codigo: 'ALM-PRIN',
        nombre: 'Almacén Principal Arequipa',
        capacidad: 5000.00,
        ocupacion: 3200.00,
        zonas: 20,
        ubicacion: 'Planta principal - Zona A',
        estado: 'Activo'
      },
      {
        codigo: 'ALM-REP',
        nombre: 'Almacén de Repuestos',
        capacidad: 2000.00,
        ocupacion: 1500.00,
        zonas: 10,
        ubicacion: 'Planta principal - Zona B',
        estado: 'Activo'
      },
      {
        codigo: 'ALM-CONS',
        nombre: 'Almacén de Consumibles',
        capacidad: 1000.00,
        ocupacion: 600.00,
        zonas: 5,
        ubicacion: 'Planta principal - Zona C',
        estado: 'Activo'
      },
      {
        codigo: 'ALM-HERRA',
        nombre: 'Almacén de Herramientas',
        capacidad: 500.00,
        ocupacion: 350.00,
        zonas: 8,
        ubicacion: 'Taller mecánico',
        estado: 'Activo'
      }
    ], { ignoreDuplicates: true });

    console.log(`✓ ${almacenes.length} almacenes creados\n`);

    // Mostrar resumen
    const totalProveedores = await Proveedor.count();
    const totalAlmacenes = await Almacen.count();

    console.log('═══════════════════════════════════════');
    console.log(`📊 Total Proveedores en BD: ${totalProveedores}`);
    console.log(`📊 Total Almacenes en BD: ${totalAlmacenes}`);
    console.log('═══════════════════════════════════════\n');

    return { proveedores: totalProveedores, almacenes: totalAlmacenes };

  } catch (error) {
    console.error('❌ Error poblando proveedores y almacenes:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedProveedoresAlmacenes()
    .then(() => {
      console.log('✅ Seed completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en seed:', error);
      process.exit(1);
    });
}

export default seedProveedoresAlmacenes;
