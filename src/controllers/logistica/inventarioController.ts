import { Request, Response } from 'express';
import Material from '../../models/Material';
import MovimientoInventario from '../../models/MovimientoInventario';
import { Op } from 'sequelize';
import sequelize from '../../config/database';

/**
 * Obtener inventario valorizado con stock actual
 */
export const getInventarioValorizado = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    // Obtener todos los materiales
    const materiales = await Material.findAll({
      order: [['codigo', 'ASC']],
    });

    const inventario = [];

    for (const material of materiales) {
      // Calcular stock inicial (movimientos antes de fechaInicio)
      let stockInicial = 0;
      if (fechaInicio) {
        const movimientosIniciales = await MovimientoInventario.findAll({
          where: {
            material_id: material.material_id,
            fecha_movimiento: { [Op.lt]: new Date(fechaInicio as string) },
          },
        });

        stockInicial = movimientosIniciales.reduce((acc, mov) => {
          if (mov.tipo_movimiento === 'ENTRADA') return acc + parseFloat(mov.cantidad.toString());
          if (mov.tipo_movimiento === 'SALIDA') return acc - parseFloat(mov.cantidad.toString());
          return acc;
        }, 0);
      }

      // Calcular movimientos en el período
      const whereClause: any = { material_id: material.material_id };
      if (fechaInicio && fechaFin) {
        whereClause.fecha_movimiento = {
          [Op.gte]: new Date(fechaInicio as string),
          [Op.lte]: new Date(fechaFin as string),
        };
      }

      const movimientos = await MovimientoInventario.findAll({
        where: whereClause,
        order: [['fecha_movimiento', 'ASC']],
      });

      // Obtener primer y último movimiento del período
      const primerMovimiento = movimientos.length > 0 ? movimientos[0] : null;
      const ultimoMovimiento = movimientos.length > 0 ? movimientos[movimientos.length - 1] : null;

      // Calcular stock final
      const stockFinal = stockInicial + movimientos.reduce((acc, mov) => {
        if (mov.tipo_movimiento === 'ENTRADA') return acc + parseFloat(mov.cantidad.toString());
        if (mov.tipo_movimiento === 'SALIDA') return acc - parseFloat(mov.cantidad.toString());
        return acc;
      }, 0);

      // Precio unitario y total
      const precioUnitario = material.precio ? parseFloat(material.precio.toString()) : 0;
      const total = stockFinal * precioUnitario;

      inventario.push({
        numero: inventario.length + 1,
        fecha1: primerMovimiento?.fecha_movimiento || null,
        fecha2: ultimoMovimiento?.fecha_movimiento || null,
        codigo: material.codigo,
        descripcion: material.descripcion,
        stockInicial: stockInicial,
        ubicacion: material.ubicacion || '',
        precioUnitario: precioUnitario,
        stockFinal: stockFinal,
        total: total,
        movimientos: movimientos.length,
      });
    }

    res.json(inventario);
  } catch (error) {
    console.error('Error al obtener inventario valorizado:', error);
    res.status(500).json({
      message: 'Error al obtener inventario valorizado',
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

/**
 * Obtener resumen de inventario
 */
export const getResumenInventario = async (req: Request, res: Response): Promise<void> => {
  try {
    // Total de materiales
    const totalMateriales = await Material.count();

    // Calcular valor total del inventario
    const materiales = await Material.findAll();
    let valorTotal = 0;

    for (const material of materiales) {
      const movimientos = await MovimientoInventario.findAll({
        where: { material_id: material.material_id },
      });

      const stockActual = movimientos.reduce((acc, mov) => {
        if (mov.tipo_movimiento === 'ENTRADA') return acc + parseFloat(mov.cantidad.toString());
        if (mov.tipo_movimiento === 'SALIDA') return acc - parseFloat(mov.cantidad.toString());
        return acc;
      }, 0);

      valorTotal += stockActual * (material.precio ? parseFloat(material.precio.toString()) : 0);
    }

    // Total de movimientos
    const totalMovimientos = await MovimientoInventario.count();

    // Movimientos del mes actual
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const movimientosMes = await MovimientoInventario.count({
      where: {
        fecha_movimiento: { [Op.gte]: inicioMes },
      },
    });

    res.json({
      totalMateriales,
      valorTotal: valorTotal.toFixed(2),
      totalMovimientos,
      movimientosMes,
    });
  } catch (error) {
    console.error('Error al obtener resumen:', error);
    res.status(500).json({
      message: 'Error al obtener resumen',
      error: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};
