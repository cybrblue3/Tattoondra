# Cambios Importantes - Sistema Tattoondra

**Fecha:** 22 de Febrero, 2026
**Cambios realizados por:** Luis & Claude (Mentor)

---

## 🎯 Decisiones Tomadas Hoy

### 1. **Enfoque del Sistema: Dashboard Interno (No Portal de Clientes)**

**Cambio:**
- ❌ Ya NO es un sistema donde los clientes se agendan solos
- ✅ ES un dashboard administrativo interno solo para Alejandra

**Por qué:**
- Alejandra prefiere tener control total de su agenda
- Ella decide cuándo trabaja y a quién agendar
- Los clientes siguen contactándola por WhatsApp/redes
- Ella manualmente crea las citas en el sistema

**Impacto:**
- Sistema más simple de construir
- Más alineado con el flujo de trabajo real de Alejandra
- Menos features complejos de scheduling

---

### 2. **Enfoque de Inventario: Simple con Actualizaciones Manuales (Opción 4)**

**Cambio:**
- ❌ Ya NO rastreamos materiales usados por sesión
- ✅ Tracking simple: Alejandra actualiza stock manualmente

**Cómo funciona:**
1. Alejandra agrega materiales al sistema (configuración inicial)
2. Cuando compra más → botón "Agregar Stock"
3. Si necesita ajustar → botón "Quitar Stock"
4. Sistema muestra alertas rojas cuando stock < 25%

**Por qué:**
- Obtiene el 80% del valor (saber cuándo reabastecer)
- Toma solo 2-3 días construir (vs. 1 semana)
- Cero fricción en su flujo de trabajo
- Puede agregar tracking detallado después SI lo pide

**Impacto:**
- Semana 7 ahora toma 25-30 horas (vs. 35-40)
- Base de datos más simple (menos tablas)
- Más fácil de mantener

---

### 3. **Integración Google Calendar: Enfoque por Fases**

**Plan:**
- **Semana 1-3:** Embed simple (iframe de Google Calendar en el dashboard)
- **Semana 5:** API completa (crear eventos desde el dashboard → sincroniza con Google Calendar)

**Por qué:**
- Progreso rápido inicial (momentum)
- Aprenden la API cuando tienen más tiempo
- Reduce riesgo del proyecto

---

## 📁 Archivos Actualizados

### ✅ Nuevos Archivos Creados

1. **`docs/GUIA-COMPLETA-SISTEMA-ES.md`** ⭐ **NUEVO**
   - Guía completa en español para Martín
   - Explica todo el sistema con diagramas
   - Mockups de UI traducidos
   - Flujos de trabajo de Alejandra
   - Plan de 8 semanas resumido
   - Stack tecnológico explicado

### ✅ Archivos Actualizados

2. **`docs/8-week-roadmap.md`**
   - Semana 7 actualizada con enfoque simple de inventario
   - Horas estimadas reducidas (25-30 vs. 35-40)
   - Notas sobre por qué es simple

3. **`backend/prisma/schema.prisma`**
   - Modelos `Session` y `MaterialUsage` comentados (post-MVP)
   - Modelo `Material` simplificado
   - Comentarios explicando qué descomentar para features avanzados
   - Relaciones innecesarias removidas

---

## 🗂️ Estructura de la Base de Datos (MVP)

### **5 Tablas Principales:**

1. **User** - Cuenta de Alejandra (y futuros artistas)
2. **Client** - Clientes de Alejandra
3. **Appointment** - Citas (creadas manualmente por Alejandra)
4. **Payment** - Registros de pagos
5. **Material** - Inventario de materiales

### **Tablas Opcionales (Comentadas - Post-MVP):**
- `Session` - Sesiones de trabajo detalladas
- `MaterialUsage` - Uso de materiales por sesión

**Para habilitar después:**
Solo descomentar en `schema.prisma` y correr `npx prisma migrate dev`

---

## 🎯 Próximos Pasos Inmediatos

### **1. Para Luis (Wicho) - HOY**
- [ ] Compartir `docs/GUIA-COMPLETA-SISTEMA-ES.md` con Martín
- [ ] Leerla juntos en videollamada/presencial
- [ ] Resolver dudas de Martín
- [ ] Confirmar alcance con Alejandra

### **2. Para Ambos - ESTE FIN DE SEMANA**
- [ ] Crear cuenta en Railway (base de datos PostgreSQL)
- [ ] Instalar dependencias backend: `cd backend && npm install`
- [ ] Crear archivo `.env` con DATABASE_URL
- [ ] Correr migraciones: `npx prisma migrate dev --name init`
- [ ] Probar backend: `npm run dev` → visitar http://localhost:5000/health
- [ ] Crear repositorio GitHub
- [ ] Push del código inicial

### **3. Para Ambos - SEMANA 1**
- [ ] Inicializar frontend con Vite
- [ ] Instalar Material-UI
- [ ] Desplegar backend a Railway
- [ ] Desplegar frontend a Vercel
- [ ] Probar que producción funciona

---

## 💡 Puntos Clave para Recordar

### **Para Martín:**

1. **El sistema es SOLO para Alejandra**
   - No es público, no tiene login de clientes
   - Solo ella lo usa en su celular/laptop

2. **Ella crea las citas manualmente**
   - Clientes no se agendan solos
   - Ella tiene control total

3. **Inventario es simple**
   - Solo rastreamos cantidades
   - Ella actualiza manualmente
   - Alertas automáticas cuando está bajo

4. **Mobile-first**
   - Probar en celular cada semana
   - La mayoría del uso será en celular

### **Para Luis (Wicho):**

1. **Mentor al equipo**
   - Hacer check-ins diarios con Martín (15 min)
   - Dividir trabajo claramente
   - Code reviews antes de merge

2. **Documentar para tesis**
   - Actualizar `docs/weekly-progress-tracker.md` cada viernes
   - Guardar decisiones importantes
   - Screenshots del progreso

3. **Mantener alcance**
   - Resistir agregar features extras
   - Seguir el plan de 8 semanas
   - MVP primero, mejoras después

---

## 📊 Métricas de Éxito

### **Fin de Semana 1 =**
✅ Backend corriendo en Railway (en línea)
✅ Frontend corriendo en Vercel (en línea)
✅ Base de datos con tablas creadas
✅ Hello World desplegado

### **Fin de Semana 4 =**
✅ Crear una cita completa funciona
✅ Alejandra puede hacer login
✅ Ver calendario en el dashboard

### **Fin de Semana 8 =**
✅ Alejandra usa el sistema diariamente
✅ Todas las features MVP completas
✅ Sistema estable en producción
✅ Documentación de tesis completa

---

## 🔄 Historial de Decisiones

| Fecha | Decisión | Razón |
|-------|----------|-------|
| 22 Feb 2026 | Cambio a dashboard interno (no portal de clientes) | Alineado con flujo real de Alejandra |
| 22 Feb 2026 | Inventario simple (sin tracking por sesión) | Reduce complejidad, entrega más valor más rápido |
| 22 Feb 2026 | Google Calendar por fases (embed → API) | Momentum inicial + aprender después |
| 22 Feb 2026 | Base de datos simplificada (5 tablas vs. 7) | Menos complejidad de mantenimiento |

---

## 🤔 Si Tienen Dudas...

**Sobre el sistema:**
- Leer `docs/GUIA-COMPLETA-SISTEMA-ES.md` de nuevo
- Preguntar a Claude (mentor AI)

**Sobre el código:**
- Revisar archivos en `docs/`
- Ver ejemplos en los mockups de UI
- Preguntar antes de empezar a codear

**Sobre el plan:**
- Revisar `docs/8-week-roadmap.md`
- Actualizar `docs/weekly-progress-tracker.md` cada semana

---

## ✅ Checklist de Confirmación

Antes de empezar a codear, asegúrense de:

- [ ] Ambos leyeron `docs/GUIA-COMPLETA-SISTEMA-ES.md`
- [ ] Entendemos que es un dashboard interno (no portal de clientes)
- [ ] Sabemos que inventario es simple (manual)
- [ ] Alejandra confirmó que el alcance es correcto
- [ ] Ambos tienen cuentas en Railway y Vercel
- [ ] Repositorio GitHub está creado
- [ ] División de trabajo está clara

**Cuando todo esté ✅ → ¡A CODEAR! 🚀**

---

**Última actualización:** 22 de Febrero, 2026
**Próxima revisión:** Viernes, fin de Semana 1

**¡Éxito, equipo! 💪**
