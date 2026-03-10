# MANUAL DE USUARIO — ERP HP&K
**Sistema de Gestión Empresarial | Versión 1.0**
*Fecha: Febrero 2026*

---

## ÍNDICE
1. [¿Qué es el ERP HP&K?](#1-qué-es-el-erp-hpk)
2. [Cómo acceder al sistema](#2-cómo-acceder-al-sistema)
3. [Pantalla principal (Dashboard)](#3-pantalla-principal-dashboard)
4. [Módulo: Logística](#4-módulo-logística)
5. [Módulo: Mantenimiento](#5-módulo-mantenimiento)
6. [Módulo: Operativos (Órdenes de Trabajo)](#6-módulo-operativos-órdenes-de-trabajo)
7. [Módulo: Producción](#7-módulo-producción)
8. [Catálogos (Tablas de Referencia)](#8-catálogos-tablas-de-referencia)
9. [Flujo principal del negocio](#9-flujo-principal-del-negocio)
10. [Preguntas frecuentes](#10-preguntas-frecuentes)

---

## 1. ¿Qué es el ERP HP&K?

El ERP HP&K es un sistema de gestión empresarial diseñado para administrar:

- **Órdenes de Trabajo (OTs)** — desde la creación hasta la entrega al cliente
- **Inventario y Materiales** — control de stock, almacenes y repuestos
- **Equipos y Mantenimiento** — registro de equipos y estrategias preventivas
- **Compras y Proveedores** — órdenes de compra y seguimiento de POs
- **Producción** — recetas, registros y control de pérdidas

---

## 2. Cómo acceder al sistema

### Requisitos previos
- El servidor debe estar corriendo en la computadora del administrador
- Tener acceso a la red local

### Pasos para ingresar
1. Abrir el navegador web (Chrome, Edge o Firefox)
2. Ingresar la dirección: **`http://localhost:3000`**
3. Se cargará automáticamente el panel principal

> **Nota:** Si aparece una página en blanco o error, contactar al administrador del sistema para que inicie el servidor con `npm run dev`.

---

## 3. Pantalla Principal (Dashboard)

Al ingresar verás el menú principal con acceso a todos los módulos:

```
┌─────────────────────────────────────────┐
│           ERP HP&K - Panel Principal     │
├──────────────┬──────────────────────────┤
│  LOGÍSTICA   │  Materiales, Almacenes   │
│              │  Compras, Proveedores    │
├──────────────┼──────────────────────────┤
│ MANTENIMIENTO│  Equipos, Estrategias   │
│              │  Códigos de Reparación  │
├──────────────┼──────────────────────────┤
│  OPERATIVOS  │  Órdenes de Trabajo     │
│              │  Repuestos, Historial   │
├──────────────┼──────────────────────────┤
│  PRODUCCIÓN  │  Recetas, Producción    │
│              │  Pérdidas, Reportes     │
└──────────────┴──────────────────────────┘
```

---

## 4. Módulo: Logística

**URL:** `http://localhost:3000/logistica`

### 4.1 Materiales
**¿Para qué sirve?** Gestionar el catálogo de repuestos, insumos y materiales.

| Campo | Descripción |
|---|---|
| Código | Identificador único del material (ej: MAT-001) |
| NP | Número de parte del fabricante |
| Descripción | Nombre completo del material |
| Stock Actual | Cantidad disponible en almacén |
| Punto de Reposición | Cantidad mínima que activa una alerta |
| Precio | Precio unitario en moneda seleccionada |

**Acciones disponibles:**
- **Nuevo Material** → Llenar el formulario y guardar
- **Editar** → Clic en el ícono de lápiz en la fila
- **Eliminar** → Clic en el ícono de basurero (solo si no tiene movimientos)

### 4.2 Almacenes
**¿Para qué sirve?** Registrar las ubicaciones físicas donde se guarda el inventario.

- Cada almacén tiene un nombre, ubicación y responsable
- Los materiales pueden estar asignados a un almacén específico

### 4.3 Proveedores
**¿Para qué sirve?** Directorio de empresas que suministran materiales.

Datos que se registran:
- Razón social y nombre comercial
- RUC / documento de identidad
- Contacto, teléfono, email
- Condiciones de pago y plazo de entrega

### 4.4 Compras / Órdenes de Compra
**¿Para qué sirve?** Gestionar las compras de materiales a proveedores.

**Flujo de una compra:**
```
Solicitud de repuesto (desde OT)
        ↓
Se genera PO automáticamente
        ↓
Proveedor confirma y entrega
        ↓
Se registra recepción
        ↓
Stock se actualiza automáticamente
```

### 4.5 Herramientas
**¿Para qué sirve?** Controlar el inventario de herramientas de trabajo.

- **Checkout** → Registrar que una herramienta fue prestada
- **Checkin** → Registrar la devolución de una herramienta
- Estados: Disponible / Bajo Stock / Agotado

### 4.6 Movimientos de Inventario
Registro automático de todos los movimientos:
- Entradas (compras, devoluciones)
- Salidas (uso en OTs, préstamos)
- Ajustes de inventario

### 4.7 Inventario Valorizado
Reporte del valor total del inventario en soles/dólares.

### 4.8 Dashboard de Stock
Vista rápida con:
- Materiales bajo punto de reposición (alertas)
- Materiales sin stock
- Valor total por categoría

---

## 5. Módulo: Mantenimiento

**URL:** `http://localhost:3000/mantenimiento`

### 5.1 Equipos
**¿Para qué sirve?** Registrar todos los equipos que se reparan o mantienen.

| Campo | Descripción |
|---|---|
| Código | Identificador único (ej: EQ-TURBO-001) |
| Descripción | Nombre del equipo |
| NS | Número de serie |
| Fabricante | Empresa fabricante |
| Modelo | Modelo específico |
| PCR | Vida útil programada en horas |
| Criticidad | Alta / Media / Baja |
| Status | Operativo / En Mantenimiento / Baja |
| Planta | Planta donde opera |

### 5.2 Estrategias de Mantenimiento
**¿Para qué sirve?** Programar mantenimientos preventivos/predictivos recurrentes.

- Se asocia un equipo con una actividad y frecuencia
- Tipos: Preventivo, Predictivo, Correctivo
- Frecuencia en días, horas o semanas

### 5.3 Códigos de Reparación
**¿Para qué sirve?** Catálogo de tipos de reparación estándar con sus costos estimados.

Cada código incluye:
- Tipo (Correctivo / Preventivo / Overhaul)
- Categoría (Mecánico / Eléctrico / Hidráulico)
- Fabricante asociado
- Precio referencial

---

## 6. Módulo: Operativos (Órdenes de Trabajo)

**URL:** `http://localhost:3000/operativos/ordenes-trabajo.html`

Este es el **módulo central** del ERP. Aquí se gestiona todo el ciclo de vida de un trabajo.

### 6.1 ¿Qué es una Orden de Trabajo (OT)?

Una OT representa un trabajo a realizar para un cliente: reparación, mantenimiento, inspección u overhaul de un equipo.

### 6.2 Campos principales de una OT

| Campo | Descripción |
|---|---|
| OT | Número de orden (ej: OT-2024-001) |
| Cliente | Empresa que solicita el trabajo |
| Equipo | Equipo a intervenir |
| NS | Número de serie del equipo |
| PCR / Horas | Vida útil programada y horas actuales |
| % PCR | Porcentaje de vida útil consumida |
| Tipo Reparación | Correctivo / Preventivo / Overhaul / Inspección |
| Prioridad | Urgente / Alta / Media / Baja |
| Contrato (días) | Plazo comprometido con el cliente |

### 6.3 Estados de una OT

```
ABIERTA → EN PROCESO → EN ESPERA → CERRADA
                                 ↘ CANCELADA
```

| Estado OT | Significado |
|---|---|
| Abierta | OT creada, pendiente de inicio |
| En Proceso | Trabajo en curso |
| En Espera | Detenida (falta material, aprobación, etc.) |
| Cerrada | Trabajo completado y entregado |
| Cancelada | OT cancelada |

### 6.4 Estados del Taller

| Estado | Significado |
|---|---|
| No Ingresado | El equipo aún no llega al taller |
| En Taller | Equipo recibido, pendiente de diagnóstico |
| En Reparación | Reparación en curso |
| Finalizado | Reparación terminada, pendiente de entrega |
| Entregado | Equipo devuelto al cliente |

### 6.5 Estado de Recursos

| Estado | Significado |
|---|---|
| Pendiente | Materiales no solicitados |
| Parcial | Algunos materiales disponibles |
| Completo | Todos los materiales listos |

### 6.6 Fechas importantes en una OT

| Fecha | Qué registra |
|---|---|
| Fecha OT | Cuando se crea la orden |
| Fecha Ingreso | Cuando llega el equipo al taller |
| Fecha Inicio Trabajo | Cuando comienza la reparación |
| Fecha Término | Cuando finaliza el trabajo |
| Fecha Requerimiento Cliente | Fecha que pide el cliente para entrega |

### 6.7 Repuestos de una OT
Desde cada OT se pueden solicitar los repuestos necesarios:
1. Ir a la OT → pestaña "Repuestos"
2. Seleccionar material del catálogo
3. Indicar cantidad requerida
4. El sistema genera automáticamente una solicitud de compra si no hay stock

### 6.8 Historial de una OT
Registro automático de todos los cambios:
- Cambios de estado
- Solicitudes de repuestos
- Generación de POs
- Comentarios del técnico

---

## 7. Módulo: Producción

**URL:** `http://localhost:3000/produccion`

### 7.1 Recetas
Define los materiales y cantidades necesarias para un tipo de trabajo estándar (BOM - Lista de Materiales).

### 7.2 Registros de Producción
Documenta el trabajo realizado, horas empleadas y materiales usados.

### 7.3 Pérdidas
Registra materiales dañados, desperdiciados o perdidos durante el proceso.

---

## 8. Catálogos (Tablas de Referencia)

Los catálogos son las tablas de configuración del sistema. **Solo el administrador** debería modificarlos.

| Catálogo | ¿Para qué se usa? |
|---|---|
| Plantas | Sedes de la empresa |
| Áreas | Departamentos (Producción, Mantenimiento, etc.) |
| Sub-Áreas | Subdivisiones de área |
| Monedas | USD, PEN, EUR |
| Unidades de Medida | UND, KG, LT, HR, etc. |
| Fabricantes | Caterpillar, Cummins, Volvo, etc. |
| Categorías | Repuestos, Consumibles, Herramientas |
| Clasificaciones | A (crítico), B (importante), C (normal) |
| Clientes | Empresas clientes |
| Garantías | Con garantía / Sin garantía |
| Tipos de Reparación | Correctivo, Preventivo, Overhaul, Inspección |
| Criticidad de Equipos | Alta, Media, Baja |

---

## 9. Flujo Principal del Negocio

### El ciclo completo de una Orden de Trabajo:

```
1. CLIENTE solicita reparación de un equipo
        ↓
2. Se crea la OT con datos del equipo y cliente
        ↓
3. El equipo INGRESA al taller (fecha ingreso)
        ↓
4. Técnico hace DIAGNÓSTICO y lista materiales necesarios
        ↓
5. Se SOLICITAN REPUESTOS desde la OT
        ↓
6. Si no hay stock → se genera ORDEN DE COMPRA al proveedor
        ↓
7. Llegan los materiales → stock se actualiza
        ↓
8. Comienza la REPARACIÓN (fecha inicio trabajo)
        ↓
9. Se registra el trabajo en PRODUCCIÓN
        ↓
10. Reparación FINALIZADA
        ↓
11. OT se CIERRA y equipo se entrega al cliente
```

---

## 10. Preguntas Frecuentes

**¿Qué hago si el sistema no carga?**
Contactar al administrador. El servidor puede estar apagado. Ejecutar `npm run dev` en la terminal del servidor.

**¿Puedo eliminar una OT cerrada?**
No. Las OTs cerradas son registros históricos y no se eliminan.

**¿Cómo sé si un material está por agotarse?**
En Logística → Dashboard Stock verás los materiales con stock por debajo del punto de reposición marcados en rojo/amarillo.

**¿Cómo se calcula el % PCR?**
`% PCR = (Horas actuales / PCR programado) × 100`
Ejemplo: Si el equipo tiene 1450 horas y su PCR es 1500 horas → 96.7% de vida útil consumida.

**¿Qué significa "con garantía"?**
Indica si la reparación tiene garantía del taller o del fabricante. Afecta las condiciones de entrega al cliente.

**¿Puedo tener una OT sin equipo registrado?**
No se recomienda. El equipo debe estar en el catálogo de Equipos antes de crear la OT.

**¿Cómo agrego un nuevo cliente?**
Ir a Catálogos → Clientes → Nuevo Cliente. Completar RUC, razón social y datos de contacto.

---

## CONTACTO Y SOPORTE

Para reportar problemas o solicitar cambios en el sistema, contactar al equipo de desarrollo.

**Sistema desarrollado para HP&K | 2026**
