# Guía Completa del Sistema Tattoondra

**Proyecto:** Sistema de Gestión para Estudio de Tatuajes
**Cliente:** Alejandra (Dueña de Tattoondra)
**Equipo:** Luis (Wicho) - Líder del Proyecto & Martín - Desarrollador Full-Stack
**Duración:** 8 semanas (2 meses)
**Fecha de Inicio:** Semana del 22 de Febrero, 2026

---

## 📋 Índice

1. [¿Qué Vamos a Construir?](#qué-vamos-a-construir)
2. [El Problema Actual de Alejandra](#el-problema-actual)
3. [La Solución: Dashboard Administrativo](#la-solución)
4. [Las 4 Secciones Principales](#las-4-secciones-principales)
5. [Flujos de Trabajo de Alejandra](#flujos-de-trabajo)
6. [Arquitectura Técnica](#arquitectura-técnica)
7. [Plan de 8 Semanas](#plan-de-8-semanas)
8. [Manejo de Inventario (Decisión Final)](#manejo-de-inventario)
9. [Stack Tecnológico](#stack-tecnológico)
10. [Próximos Pasos](#próximos-pasos)

---

## 🎯 ¿Qué Vamos a Construir?

**Nombre del Proyecto:** Tattoondra Management Dashboard

**En pocas palabras:**
Una aplicación web móvil (PWA) que Alejandra usa en su celular o laptop para manejar todo su negocio de tatuajes: citas, clientes, pagos e inventario.

**¿Quién la usa?**
- **SOLO Alejandra** (es un dashboard administrativo interno)
- **NO es para clientes** (ellos siguen contactándola por WhatsApp/redes)

**¿Para qué la usa?**
- Crear y manejar citas manualmente (ELLA decide cuándo y a quién agendar)
- Guardar información de todos sus clientes (reemplaza el historial de WhatsApp)
- Registrar pagos (depósitos y pagos finales)
- Controlar inventario de materiales (alertas cuando se acabe algo)
- Ver reportes financieros mensuales

---

## 😓 El Problema Actual de Alejandra

### Lo Que Usa Ahora:
- **WhatsApp** - Contacto con clientes
- **Google Calendar** - Su agenda
- **Redes sociales** - Comunicación
- **Papel** - TODO lo demás (registros, pagos, notas)

### Los Problemas:
1. **Sin registro de clientes** - Todo guardado en chats de WhatsApp
2. **Sin tracking financiero** - ¡No ha llevado registro en 8 meses!
3. **Sin control de inventario** - A veces se le acaba la tinta a medio tatuaje
4. **Documentos legales inexistentes** - No tiene consentimiento informado formal
5. **Desorganización general** - Pierde tiempo buscando información

### Lo Que Necesita:
✅ Un lugar digital para guardar TODO
✅ Ver su agenda fácilmente desde el celular
✅ Saber cuánto ha ganado cada mes
✅ Alertas cuando se acabe material
✅ Sistema profesional y organizado

---

## 💡 La Solución: Dashboard Administrativo

**Un dashboard web** (página web) que funciona en celular y computadora donde Alejandra puede:

### Pantalla Principal (Home)
```
┌─────────────────────────┐
│ ☰  TATOONDRA       👤   │
├─────────────────────────┤
│ 📅 Hoy: 22 Feb, 2026    │
│                         │
│ 📊 Resumen Rápido       │
│ ┌─────┐ ┌─────┐ ┌─────┐│
│ │  3  │ │ $600│ │  2  ││
│ │Citas│ │ Hoy │ │Pend ││
│ └─────┘ └─────┘ └─────┘│
│                         │
│ 🗓️ Agenda de Hoy        │
│ ┌─────────────────────┐ │
│ │ 2:00 PM - María G.  │ │
│ │ ✅ Pagado           │ │
│ ├─────────────────────┤ │
│ │ 5:00 PM - Carlos R. │ │
│ │ ⚠️  Depósito pend.  │ │
│ └─────────────────────┘ │
│                         │
│ [ + Nueva Cita ]        │
│                         │
│ 📆 Mi Calendario        │
│ [Vista Google Calendar] │
│                         │
└─────────────────────────┘

Navegación inferior:
[ 🏠 Inicio ] [ 👥 Clientes ] [ 💰 Pagos ] [ 📦 Inventario ]
```

---

## 🗂️ Las 4 Secciones Principales

### 1️⃣ CITAS (Appointments)

**¿Qué hace?**
Alejandra crea y maneja todas sus citas aquí.

**Pantalla: Lista de Citas**
```
┌─────────────────────────┐
│ ☰  Citas                │
├─────────────────────────┤
│ [ + Nueva Cita ]        │
│                         │
│ Filtros: [Todas ▼] [Feb▼]│
│                         │
│ ┌─────────────────────┐ │
│ │ 22 Feb - 2:00 PM    │ │
│ │ María González      │ │
│ │ Manga floral        │ │
│ │ ✅ Confirmada       │ │
│ │ ✅ Depósito recib.  │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ 25 Feb - 4:00 PM    │ │
│ │ Carlos Ruiz         │ │
│ │ Dragón espalda      │ │
│ │ ⏳ Pendiente        │ │
│ │ ⚠️  Sin depósito    │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Pantalla: Crear Nueva Cita**
```
┌─────────────────────────┐
│ ☰  Nueva Cita           │
├─────────────────────────┤
│                         │
│ Cliente *               │
│ [Buscar o agregar... ▼] │
│                         │
│ Fecha *                 │
│ [📅 25 Feb, 2026     ]  │
│                         │
│ Hora *                  │
│ [🕐 2:00 PM          ]  │
│                         │
│ Duración (minutos)      │
│ [60              ]      │
│                         │
│ Descripción             │
│ [                    ]  │
│ [                    ]  │
│                         │
│ Precio Estimado (MXN)   │
│ [$               ]      │
│                         │
│ ─────────────────────   │
│ Depósito Requerido:     │
│ 💵 $200.00 MXN          │
│ (o 30% si >$2000)       │
│                         │
│ [ Cancelar ] [ Crear ]  │
└─────────────────────────┘
```

**¿Qué pasa cuando hace clic en "Crear"?**
1. ✅ La cita se guarda en la base de datos
2. ✅ Se sincroniza con Google Calendar (Semana 5+)
3. ✅ Se actualiza el perfil del cliente
4. ✅ Aparece en "Agenda de Hoy" en el dashboard

**Pantalla: Detalle de Cita**
```
┌─────────────────────────┐
│ ← Detalle de Cita       │
├─────────────────────────┤
│                         │
│ 👤 María González       │
│ 📞 +52 123 456 7890     │
│ 📧 maria@email.com      │
│                         │
│ 📅 22 Feb, 2026         │
│ 🕐 2:00 PM (60 min)     │
│                         │
│ 📝 Descripción:         │
│ Manga floral en brazo   │
│ derecho, a color        │
│                         │
│ 💰 Financiero           │
│ Precio Total: $1,500 MXN│
│ Depósito: $200 MXN      │
│ ✅ Depósito recibido    │
│    (15 Feb - Transfer.) │
│                         │
│ Saldo: $1,300 MXN       │
│ ⚠️  Pago pendiente      │
│                         │
│ [ Registrar Pago ]      │
│                         │
│ 📄 Consentimiento       │
│ ✅ Firmado (15 Feb)     │
│ [ Ver PDF ]             │
│                         │
│ ─────────────────────   │
│ [ Editar ] [ Cancelar ] │
│                         │
│ 📝 Notas Internas:      │
│ [Cliente prefiere       │
│  colores pastel...]     │
│                         │
└─────────────────────────┘
```

---

### 2️⃣ CLIENTES (Clients)

**¿Qué hace?**
Reemplazo digital del historial de WhatsApp. Toda la info de clientes en un solo lugar.

**Pantalla: Lista de Clientes**
```
┌─────────────────────────┐
│ ☰  Clientes             │
├─────────────────────────┤
│ [ + Agregar Cliente ]   │
│                         │
│ 🔍 Buscar clientes...   │
│ [                    ]  │
│                         │
│ ┌─────────────────────┐ │
│ │ MG María González   │ │
│ │ +52 123 456 7890    │ │
│ │ 3 citas             │ │
│ │ Última: 22 Feb 2026 │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ CR Carlos Ruiz      │ │
│ │ +52 987 654 3210    │ │
│ │ 1 cita              │ │
│ │ Última: 25 Feb 2026 │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ AL Ana López        │ │
│ │ +52 555 123 4567    │ │
│ │ 5 citas             │ │
│ │ Última: 10 Ene 2026 │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Pantalla: Detalle de Cliente**
```
┌─────────────────────────┐
│ ← María González        │
├─────────────────────────┤
│                         │
│ 📱 Información Contacto │
│ Tel: +52 123 456 7890   │
│ Email: maria@email.com  │
│                         │
│ 📄 Consentimiento       │
│ ✅ Firmado (15 Feb 2026)│
│ [ Ver ] [ Reenviar ]    │
│                         │
│ 📅 Historial de Citas   │
│ ┌─────────────────────┐ │
│ │ 22 Feb, 2026        │ │
│ │ Manga floral        │ │
│ │ $1,500 - ✅ Pagado  │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 10 Ene, 2026        │ │
│ │ Rosa muñeca pequeña │ │
│ │ $400 - ✅ Pagado    │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 5 Dic, 2025         │ │
│ │ Consulta            │ │
│ │ Gratis              │ │
│ └─────────────────────┘ │
│                         │
│ 💰 Resumen Financiero   │
│ Total gastado: $1,900   │
│ Pendiente: $0           │
│                         │
│ 📝 Notas                │
│ [Prefiere colores       │
│  pastel. Alérgica al    │
│  látex. Tolera bien.]   │
│                         │
│ [ Editar Cliente ]      │
└─────────────────────────┘
```

**Formulario: Agregar/Editar Cliente**
```
┌─────────────────────────┐
│ ☰  Nuevo Cliente        │
├─────────────────────────┤
│                         │
│ Nombre Completo *       │
│ [                    ]  │
│                         │
│ Email                   │
│ [                    ]  │
│                         │
│ Teléfono *              │
│ [+52              ]     │
│                         │
│ Notas                   │
│ [Alergias, preferen-]   │
│ [cias, notas esp.   ]   │
│                         │
│ ☑️ Enviar consentimiento│
│   por email             │
│                         │
│ [ Cancelar ] [ Guardar ]│
└─────────────────────────┘
```

---

### 3️⃣ PAGOS (Payments)

**¿Qué hace?**
Rastrear todo el dinero - depósitos, pagos finales, qué está pendiente. Reemplaza las notas en papel.

**Pantalla: Dashboard de Pagos**
```
┌─────────────────────────┐
│ ☰  Pagos                │
├─────────────────────────┤
│                         │
│ 📊 Este Mes (Febrero)   │
│ ┌─────────────────────┐ │
│ │ Ingresos Totales    │ │
│ │ $4,200 MXN          │ │
│ ├─────────────────────┤ │
│ │ 💵 Efectivo: $1,500 │ │
│ │ 🏦 Transfer: $2,700 │ │
│ └─────────────────────┘ │
│                         │
│ ⚠️  Pagos Pendientes    │
│ ┌─────────────────────┐ │
│ │ Carlos R. - 25 Feb  │ │
│ │ Saldo: $1,800       │ │
│ │ [ Registrar Pago ]  │ │
│ └─────────────────────┘ │
│                         │
│ 📜 Pagos Recientes      │
│ ┌─────────────────────┐ │
│ │ 22 Feb - María G.   │ │
│ │ Final: $1,300       │ │
│ │ 💵 Efectivo         │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 20 Feb - Ana L.     │ │
│ │ Depósito: $200      │ │
│ │ 🏦 Transferencia    │ │
│ └─────────────────────┘ │
│                         │
│ [ Ver Todos los Pagos ] │
│ [ Exportar Reporte ]    │
└─────────────────────────┘
```

**Modal: Registrar Pago**
```
┌─────────────────────────┐
│ Registrar Pago          │
├─────────────────────────┤
│                         │
│ Cita                    │
│ Carlos R. - 25 Feb      │
│                         │
│ Tipo de Pago *          │
│ ◉ Depósito              │
│ ○ Pago Final            │
│ ○ Pago Parcial          │
│                         │
│ Cantidad (MXN) *        │
│ [$200.00         ]      │
│                         │
│ Método de Pago *        │
│ ◉ Efectivo              │
│ ○ Transferencia Bancaria│
│                         │
│ Notas (opcional)        │
│ [Ref transfer: 123...]  │
│                         │
│ [ Cancelar ] [ Guardar ]│
└─────────────────────────┘
```

**Pantalla: Reporte Mensual**
```
┌─────────────────────────┐
│ ☰  Reporte Febrero 2026 │
├─────────────────────────┤
│                         │
│ 📊 Resumen              │
│ Ingresos Totales: $4,200│
│ Citas: 8                │
│ Promedio/cita: $525     │
│                         │
│ 💰 Por Método de Pago   │
│ ┌─────────────────────┐ │
│ │ Efectivo $1,500 36% │ │
│ │ Transfer $2,700 64% │ │
│ └─────────────────────┘ │
│                         │
│ 📅 Por Semana           │
│ Semana 1: $800          │
│ Semana 2: $1,200        │
│ Semana 3: $1,500        │
│ Semana 4: $700          │
│                         │
│ [ Exportar PDF ]        │
│ [ Exportar CSV ]        │
└─────────────────────────┘
```

---

### 4️⃣ INVENTARIO (Inventory)

**¿Qué hace?**
Rastrear materiales de tatuaje - saber qué se está acabando, cuándo reabastecer.

**⚠️ IMPORTANTE: Enfoque Simple para MVP (Opción 4)**

Para el MVP (primeras 8 semanas), construiremos un sistema de inventario **SIMPLE**:
- Solo rastreamos niveles de stock totales
- Alejandra actualiza manualmente cuando compra más material
- Alertas automáticas cuando algo está bajo (< 25%)
- **NO rastreamos uso por sesión** (eso es opcional para después)

**¿Por qué simple?**
✅ Ella obtiene el 80% del valor (saber cuándo reabastecer)
✅ Toma 2-3 días construir (Semana 7 es alcanzable)
✅ Cero fricción en su flujo de trabajo
✅ Puede decidir después si quiere tracking detallado por sesión

**Pantalla: Dashboard de Inventario**
```
┌─────────────────────────┐
│ ☰  Inventario           │
├─────────────────────────┤
│ [ + Agregar Material ]  │
│                         │
│ ⚠️  Stock Bajo (2)      │
│ ┌─────────────────────┐ │
│ │ 🔴 Tinta Negra 30ml │ │
│ │    2 botellas (20%) │ │
│ │    [ + Agregar ]    │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 🔴 Papel Transfer   │ │
│ │    5 hojas (25%)    │ │
│ │    [ + Agregar ]    │ │
│ └─────────────────────┘ │
│                         │
│ ✅ Stock Bueno (8)      │
│ ┌─────────────────────┐ │
│ │ ✅ Agujas RL7       │ │
│ │    15 piezas (75%)  │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ ✅ Guantes          │ │
│ │    42 pares (84%)   │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Modal: Agregar Stock**
```
┌─────────────────────────┐
│ Agregar Stock           │
├─────────────────────────┤
│ Material: Tinta Negra   │
│                         │
│ Stock actual: 2         │
│                         │
│ Agregar cantidad:       │
│ [ + ] [5] [ - ]         │
│                         │
│ Nuevo total: 7 botellas │
│                         │
│ Costo (opcional):       │
│ [$750.00 MXN]           │
│ (5 × $150)              │
│                         │
│ [ Cancelar ] [ Agregar ]│
└─────────────────────────┘
```

**Modal: Quitar/Usar Stock**
```
┌─────────────────────────┐
│ Quitar Stock            │
├─────────────────────────┤
│ Material: Tinta Negra   │
│                         │
│ Stock actual: 7         │
│                         │
│ Quitar cantidad:        │
│ [ + ] [1] [ - ]         │
│                         │
│ Nuevo total: 6 botellas │
│                         │
│ Razón (opcional):       │
│ ○ Usado en sesión       │
│ ○ Dañado/Caducado       │
│ ○ Otro ajuste           │
│                         │
│ [ Cancelar ] [ Quitar ] │
└─────────────────────────┘
```

**Formulario: Agregar Material**
```
┌─────────────────────────┐
│ ☰  Agregar Material     │
├─────────────────────────┤
│                         │
│ Nombre del Material *   │
│ [                    ]  │
│                         │
│ Categoría               │
│ [Tinta          ▼]      │
│ (Tinta, Agujas, Guantes)│
│                         │
│ Cantidad Inicial *      │
│ [10              ]      │
│                         │
│ Unidad                  │
│ [botella        ▼]      │
│ (botella, caja, pieza)  │
│                         │
│ Alerta de Stock (%)     │
│ [25              ]      │
│ Alertar cuando <25%     │
│                         │
│ Costo por Unidad (MXN)  │
│ [$150.00         ]      │
│                         │
│ [ Cancelar ] [ Guardar ]│
└─────────────────────────┘
```

---

## 🔄 Flujos de Trabajo de Alejandra

### **Escenario 1: Cliente le Manda Mensaje por WhatsApp**

**Forma actual (papel/WhatsApp):**
1. Cliente: "Hola, ¿puedo agendar cita?"
2. Alejandra revisa Google Calendar
3. Le responde con fechas disponibles
4. Cliente elige
5. Alejandra lo apunta en papel
6. Manualmente lo agrega a Google Calendar
7. Rastrea depósito en papel
8. Pierde el rastro después de 8 meses 😅

**Nueva forma (con el sistema):**
1. Cliente: "Hola, ¿puedo agendar cita?"
2. Alejandra abre dashboard en celular
3. Ve calendario + disponibilidad de un vistazo
4. Responde con fechas
5. Cliente elige
6. **Alejandra hace clic en botón "+ Nueva Cita"**
7. Llena formulario rápido (30 segundos)
8. Hace clic en "Crear"
9. ✅ Guardado en base de datos
10. ✅ Se sincroniza automáticamente con Google Calendar
11. ✅ Perfil del cliente creado/actualizado
12. Cuando llega el depósito → clic en "Registrar Pago"
13. Todo rastreado digitalmente para siempre

**Tiempo ahorrado:** 5 minutos por cita
**Precisión:** 100% (no más notas perdidas en papel)

---

### **Escenario 2: Fin de Mes - Alejandra Necesita Reporte Financiero**

**Forma actual:**
1. Busca entre 8 meses de notas en papel
2. Revisa historial de chat de WhatsApp
3. Intenta recordar quién pagó qué
4. Lo suma todo manualmente
5. Toma 3-4 horas
6. Todavía no está segura si es preciso

**Nueva forma:**
1. Abre dashboard
2. Clic en pestaña "Pagos"
3. Clic en "Reporte Febrero 2026"
4. Ve todo: ingresos totales, métodos de pago, pagos pendientes
5. Clic en "Exportar PDF"
6. Listo en 30 segundos

**Tiempo ahorrado:** 3-4 horas por mes
**Precisión:** 100% (todos los datos rastreados)

---

### **Escenario 3: Se Está Quedando Sin Tinta Negra**

**Forma actual:**
1. Se da cuenta que no hay tinta a mitad de sesión
2. Pánico
3. No puede terminar el tatuaje
4. Tiene que reprogramar al cliente
5. Ingresos perdidos

**Nueva forma:**
1. Dashboard muestra alerta 🔴 STOCK BAJO
2. Lo ve 2 semanas antes de quedarse sin material
3. Ordena más tinta
4. Nunca se queda sin material a mitad de sesión
5. Clientes felices, no hay ingresos perdidos

---

## 🏗️ Arquitectura Técnica (Simplificada)

**Cómo funciona todo detrás de escena:**

```
┌─────────────────────────────────────────┐
│      CELULAR DE ALEJANDRA               │
│  (Navegador: Chrome/Safari)             │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │   FRONTEND (React + Material-UI)  │  │
│  │                                   │  │
│  │  - Página de login                │  │
│  │  - Dashboard                      │  │
│  │  - Formularios de citas           │  │
│  │  - Lista de clientes              │  │
│  │  - Tracking de pagos              │  │
│  │  - Manejo de inventario           │  │
│  └───────────────────────────────────┘  │
│              ↕️  (llamadas HTTPS)       │
└─────────────────────────────────────────┘
                 ↕️
┌─────────────────────────────────────────┐
│       BACKEND API (Node + Express)      │
│       Alojado en: Railway               │
│                                         │
│  Rutas:                                 │
│  - POST /api/login                      │
│  - GET  /api/appointments               │
│  - POST /api/appointments               │
│  - GET  /api/clients                    │
│  - POST /api/payments                   │
│  - GET  /api/materials                  │
│                                         │
│  Servicios:                             │
│  - Autenticación (JWT)                  │
│  - Lógica de negocio                    │
│  - Sincronización Google Calendar       │
│  - Notificaciones por email             │
└─────────────────────────────────────────┘
                 ↕️
┌─────────────────────────────────────────┐
│     BASE DE DATOS (PostgreSQL+Prisma)   │
│     Alojado en: Railway/Supabase        │
│                                         │
│  Tablas:                                │
│  - User (cuenta de Alejandra)           │
│  - Client (sus clientes)                │
│  - Appointment (citas)                  │
│  - Payment (registros financieros)      │
│  - Material (inventario)                │
└─────────────────────────────────────────┘
                 ↕️
┌─────────────────────────────────────────┐
│      SERVICIOS EXTERNOS                 │
│                                         │
│  - Google Calendar API (sincr. eventos) │
│  - Resend (notificaciones por email)    │
│  - Vercel (alojamiento frontend)        │
└─────────────────────────────────────────┘
```

**En términos simples:**
1. Alejandra abre la app en celular (frontend React)
2. Frontend habla con tu API (backend Node)
3. API guarda/lee datos de la base de datos (PostgreSQL)
4. API también sincroniza con Google Calendar
5. Todo se actualiza en tiempo real

---

## 📅 Plan de 8 Semanas

### **Semana 1: Fundación**
**Objetivo:** Ambiente de desarrollo funcionando + Hello World desplegado

**Qué construimos:**
- ✅ Setup del proyecto (React + Node + PostgreSQL)
- ✅ Esquema de base de datos
- ✅ Login simple (JWT)
- ✅ Desplegar frontend a Vercel
- ✅ Desplegar backend a Railway

---

### **Semana 2-3: Manejo de Clientes**
**Objetivo:** Alejandra puede agregar/ver/editar clientes

**Qué construimos:**
- ✅ Lista de clientes
- ✅ Formulario agregar/editar cliente
- ✅ Página de detalle de cliente
- ✅ Búsqueda y filtros

---

### **Semana 4: Manejo de Citas**
**Objetivo:** Alejandra puede crear citas + ver calendario

**Qué construimos:**
- ✅ Formulario crear cita
- ✅ Lista de citas
- ✅ Página de detalle de cita
- ✅ Integración Google Calendar (iframe embed)
- ✅ Vincular citas con clientes

---

### **Semana 5: Tracking de Pagos**
**Objetivo:** Registrar todos los pagos

**Qué construimos:**
- ✅ Registrar pago (efectivo/transferencia)
- ✅ Estado de pago por cita
- ✅ Dashboard financiero básico
- ✅ Integración API Google Calendar (crear eventos desde el dashboard)

---

### **Semana 6: Reportes y Pulido**
**Objetivo:** Reportes financieros + mejoras UX

**Qué construimos:**
- ✅ Reporte de ingresos mensuales
- ✅ Desglose por método de pago
- ✅ Exportar a CSV/PDF
- ✅ Mejoras de UI/UX
- ✅ Optimización móvil

---

### **Semana 7: Manejo de Inventario**
**Objetivo:** Tracking básico de stock operacional

**Qué construimos:**
- ✅ CRUD de materiales (agregar/editar/eliminar)
- ✅ Alertas de stock bajo (<25%)
- ✅ Agregar/quitar stock manualmente
- ✅ Dashboard de inventario

**⚠️ NO construimos (no es necesario para MVP):**
- ❌ Tracking de uso por sesión (opcional para después)
- ❌ Historial detallado de uso
- ❌ Análisis de costos por tatuaje

---

### **Semana 8: Testing, Despliegue, Documentación**
**Objetivo:** Sistema listo para producción

**Qué hacemos:**
- ✅ Testing completo del sistema
- ✅ Corrección de bugs
- ✅ Optimización de rendimiento
- ✅ Despliegue final
- ✅ Guía de usuario para Alejandra
- ✅ Documentación técnica para tesis
- ✅ Sesión de capacitación con Alejandra

---

## 📦 Manejo de Inventario (Decisión Final)

### **Opción Elegida: Inventario Simple (Opción 4)**

Después de evaluar múltiples enfoques, decidimos:

**Para el MVP (Semana 7):**

**Lo que CONSTRUIMOS:**
1. **Lista de Materiales**
   - Nombre, categoría, cantidad, unidad
   - Umbral de stock bajo (alerta al 25%)
   - Costo por unidad (opcional)

2. **Actualizaciones Manuales de Stock**
   - Botón "Agregar Stock" (cuando compra más)
   - Botón "Quitar Stock" (ajuste manual)
   - Ingresar cuántos agregar/quitar

3. **Alertas de Stock Bajo**
   - Dashboard muestra alertas 🔴
   - Sección "Reabastecer Pronto"

**Lo que Alejandra hace:**
- Agrega materiales una vez (configuración inicial)
- Actualiza cantidad cuando compra más suministros
- Recibe alertas cuando está bajo
- Ajusta manualmente si es necesario

**Por qué funciona:**
- ✅ Obtiene el 80% del valor (saber cuándo reabastecer)
- ✅ Toma 2-3 días construir (Semana 7 es alcanzable)
- ✅ Cero fricción en su flujo de trabajo
- ✅ Puede decidir después si quiere tracking por sesión

---

**Mejora Post-MVP (si ella lo quiere):**

Después de usar el sistema por un mes, le preguntamos:

*"¿Te gustaría rastrear materiales por sesión? Te ayudaría a ver:*
- *Cuánto cuesta cada tipo de tatuaje en suministros*
- *Qué materiales usas más*
- *Tracking de inventario más preciso"*

Si SÍ → Agregamos logging con checkboxes post-sesión
Si NO → Lo mantenemos simple, ella está feliz

---

## 🛠️ Stack Tecnológico

### **Frontend**
- **React 18** - Librería de UI
- **Vite** - Build tool (súper rápido)
- **Material-UI (MUI)** - Componentes de UI
- **React Router** - Navegación entre páginas
- **Axios** - Llamadas a la API
- **PWA** - Se instala en celular como app nativa

### **Backend**
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **Prisma** - ORM (manejo de base de datos)
- **JWT** - Autenticación
- **Google Calendar API** - Sincronización de calendario

### **Base de Datos**
- **PostgreSQL** - Base de datos relacional
- **5 Tablas:**
  - User (Alejandra)
  - Client (sus clientes)
  - Appointment (citas)
  - Payment (pagos)
  - Material (inventario)

### **Alojamiento & Servicios**
- **Vercel** - Frontend (gratis)
- **Railway** - Backend + Database (gratis)
- **Google Calendar API** - Sincronización (gratis)
- **Resend** - Emails (100/día gratis)

**Costo Total Mensual:** **$0** para MVP

---

## 🚀 Próximos Pasos

### **Paso 1: Confirmar con Alejandra (HOY)**

Llamarla o mandarle mensaje:

*"Hola Alejandra, queremos confirmar el alcance del sistema. Basándonos en nuestra conversación, quieres:*

*1. Un dashboard en tu celular/laptop donde TÚ creas las citas (no que los clientes se agenden solos)*
*2. Guardar toda la información de clientes digitalmente (reemplazar chats de WhatsApp)*
*3. Rastrear pagos (depósitos y pagos finales)*
*4. Rastrear inventario (materiales y herramientas)*

*El sistema se sincronizará con tu Google Calendar para que veas todo en un solo lugar.*

*¿Suena bien?"*

**Conseguir su SÍ antes de continuar.**

---

### **Paso 2: Setup de Ambiente de Desarrollo (ESTE FIN DE SEMANA)**

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Editar .env y pegar DATABASE_URL
npx prisma migrate dev --name init
npm run dev
```

**Frontend:**
```bash
cd ..
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install @mui/material @emotion/react @emotion/styled
npm install react-router-dom axios
npm run dev
```

---

### **Paso 3: Crear Repositorio GitHub (HOY/MAÑANA)**

```bash
git init
git add .
git commit -m "Initial setup - Tattoondra Management System"
git remote add origin TU_URL_DE_GITHUB
git push -u origin main
```

Agregar a Martín como colaborador.

---

### **Paso 4: División del Trabajo**

**Sugerencia:**
- **Wicho (Luis):** Backend lead + integración Google Calendar + despliegue
- **Martín:** Frontend lead + componentes UI + diseño responsive

**O ambos full-stack (se coordinan por feature)**

Ustedes deciden - discútanlo.

---

### **Paso 5: Reunión de Kick-off (Wicho + Martín)**

**Agenda de 30 minutos:**
1. Revisar esta guía juntos
2. Hacer preguntas
3. Decidir división del trabajo
4. Configurar ambiente de desarrollo
5. Planear check-ins diarios (15 min cada día)

---

## 📞 Contacto & Ayuda

**¿Atascado?**
- Preguntar a Claude (tu mentor AI)
- Revisar docs en carpeta `/docs`
- Buscar en documentación oficial

**Recursos útiles:**
- React: https://react.dev
- Prisma: https://prisma.io/docs
- Material-UI: https://mui.com
- Express: https://expressjs.com

---

## 🎯 Criterios de Éxito

### **Éxito Semana 1 =**
✅ Backend desplegado en Railway (accesible en línea)
✅ Frontend desplegado en Vercel (accesible en línea)
✅ Base de datos corriendo con todas las tablas
✅ Repo de GitHub con todo el código

### **Éxito Semana 4 =**
✅ Puedes crear una cita de principio a fin (formulario cliente → base de datos)
✅ Alejandra puede hacer login y ver el dashboard

### **Éxito Semana 8 =**
✅ Alejandra está usando el sistema diariamente
✅ Sistema completamente funcional en producción
✅ Documentación completa para tesis

---

## 💪 Mensajes Finales

**Para Martín:**

Hermano, esto es un proyecto REAL para un negocio real. No es solo práctica - Alejandra va a usar esto todos los días.

**Lo que vas a aprender:**
- React moderno (componentes, hooks, routing)
- APIs RESTful (cómo frontend habla con backend)
- Bases de datos (PostgreSQL con Prisma)
- Deployment (poner apps en producción)
- Trabajo en equipo (Git, code reviews)

**Consejos:**
- 🚫 No copies y pegues código que no entiendas
- ✅ Haz preguntas cuando estés atascado (no pierdas horas)
- ✅ Haz commits pequeños y frecuentes
- ✅ Prueba en celular cada semana (no solo en navegador)
- ✅ Documenta decisiones importantes
- ✅ ¡Celebra las pequeñas victorias con Wicho!

**Esto es grande. Ustedes pueden hacerlo. ¡Vamos con todo! 🔥**

---

**Creado:** 22 de Febrero, 2026
**Autores:** Luis (Wicho) & Claude (Mentor AI)
**Para:** Martín & el equipo de Tattoondra

**¡Éxito, chavos! 💪🚀**
