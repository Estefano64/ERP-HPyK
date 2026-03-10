/**
 * Script para verificar datos en la base de datos
 */

import sequelize from './src/config/database';
import Proveedor from './src/models/Proveedor';
import Almacen from './src/models/Almacen';

async function verificarDatos() {
  try {
    console.log('🔍 Verificando datos en la base de datos...\n');

    // Verificar proveedores
    const proveedores = await Proveedor.findAll();
    console.log(`📦 Proveedores encontrados: ${proveedores.length}`);
    
    if (proveedores.length > 0) {
      console.log('\nPrimeros 3 proveedores:');
      proveedores.slice(0, 3).forEach((p, i) => {
        console.log(`  ${i + 1}. ID: ${p.id} | RUC: ${p.ruc} | Razón Social: ${p.razonSocial}`);
      });
    } else {
      console.log('  ⚠️ No hay proveedores en la base de datos');
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Verificar almacenes
    const almacenes = await Almacen.findAll();
    console.log(`📦 Almacenes encontrados: ${almacenes.length}`);
    
    if (almacenes.length > 0) {
      console.log('\nPrimeros 3 almacenes:');
      almacenes.slice(0, 3).forEach((a, i) => {
        console.log(`  ${i + 1}. ID: ${a.id} | Código: ${a.codigo} | Nombre: ${a.nombre}`);
      });
    } else {
      console.log('  ⚠️ No hay almacenes en la base de datos');
    }

    console.log('\n' + '='.repeat(60) + '\n');

    if (proveedores.length === 0 || almacenes.length === 0) {
      console.log('💡 SOLUCIÓN: Ejecuta el seed para crear datos de prueba:');
      console.log('   npx ts-node src/seeds/seed-proveedores-almacenes.ts');
    } else {
      console.log('✅ Hay datos disponibles. El problema puede ser en el frontend.');
      console.log('   Verifica la consola del navegador cuando abres el modal.');
    }

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verificarDatos();
