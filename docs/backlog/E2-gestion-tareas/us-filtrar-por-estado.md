# Filtrar tareas por estado

**Identificador:** FS-142
**Épica:** E2 — Gestión de tareas

> **Como** miembro del equipo, **quiero** filtrar la lista de tareas por estado y poder volver a verlas todas, **para** centrarme en lo pendiente o en lo que está en curso.

**Leyenda:** sin marca = sale del PRD o de la petición de producto · **[PROPUESTO]** = criterio propuesto, pendiente de revisión · **[SUPUESTO PRD]** = está en el PRD pero sigue abierto.

## Criterios de aceptación

### Camino feliz

**CA-1 · Filtrar por un estado**
- **DADO** que en la lista hay tareas en Pendiente, En curso y Hecho
- **CUANDO** filtro por `<estado>`
- **ENTONCES** veo únicamente las tareas en `<estado>`, y ninguna de los otros dos estados.

| estado |
|---|
| Pendiente |
| En curso |
| Hecho |

**CA-2 · Ver todas**
- **DADO** que tengo aplicado un filtro por estado
- **CUANDO** elijo ver todas las tareas
- **ENTONCES** veo las tareas de los tres estados.

**CA-3 · Un solo estado a la vez**
- **DADO** que estoy filtrando la lista
- **CUANDO** elijo un estado
- **ENTONCES** se sustituye el filtro anterior: no se combinan varios estados a la vez.

**CA-4 · Sin recargar**
- **DADO** que estoy viendo la lista
- **CUANDO** cambio el filtro
- **ENTONCES** la lista se actualiza sin que la página se recargue.

**CA-5 · Se ve qué filtro está aplicado** **[PROPUESTO]**
- **DADO** que he filtrado por un estado
- **CUANDO** miro la lista
- **ENTONCES** se indica claramente qué filtro está activo, sin depender solo del color.

### Estado inexistente

**CA-6 · Se avisa del error, no se devuelve una lista vacía**
- **DADO** que pido la lista filtrada por un estado que no existe (por ejemplo, «Archivado»)
- **CUANDO** se muestra la lista
- **ENTONCES**:
  - veo un aviso en castellano que dice que ese estado no existe e indica los válidos: Pendiente, En curso y Hecho;
  - **no** se muestra una lista vacía como si fuera un resultado correcto;
  - el aviso se distingue claramente del mensaje de «no hay tareas en este estado» (CA-9).

**CA-7 · «Bloqueado» también es un estado inexistente**
- **DADO** que pido la lista filtrada por «Bloqueado»
- **CUANDO** se muestra la lista
- **ENTONCES** recibo el mismo aviso que en CA-6, porque «Bloqueado» no es un estado del producto.

**CA-8 · Salir del error** **[PROPUESTO]**
- **DADO** que veo el aviso de estado inexistente
- **CUANDO** elijo un estado válido o elijo ver todas
- **ENTONCES** el aviso desaparece y veo la lista correspondiente.

### Bordes

**CA-9 · Filtro sin resultados**
- **DADO** que no hay ninguna tarea en En curso
- **CUANDO** filtro por En curso
- **ENTONCES** veo un mensaje que dice que no hay tareas en ese estado, distinto del aviso de error de CA-6.

**CA-10 · Una tarea que cambio de estado sale del filtro** **[PROPUESTO]**
- **DADO** que estoy filtrando por Pendiente
- **CUANDO** paso una de esas tareas a En curso
- **ENTONCES** la tarea deja de aparecer en la lista filtrada, y el filtro sigue en Pendiente.

**CA-11 · Los cambios de otras personas respetan el filtro** **[PROPUESTO]**
- **DADO** que estoy filtrando por En curso y otra persona pasa una tarea de Pendiente a En curso
- **CUANDO** la lista se actualiza sola (frescura de E3, 10 segundos o menos)
- **ENTONCES** esa tarea aparece en mi lista filtrada sin que yo recargue.

**CA-12 · El filtro se conserva al recargar o al compartir el enlace** **[PROPUESTO]**
- **DADO** que he filtrado por Hecho
- **CUANDO** recargo la página, o abro en otra pestaña la misma dirección
- **ENTONCES** la lista sigue filtrada por Hecho.

**CA-13 · Mi filtro es solo mío** **[PROPUESTO]**
- **DADO** que filtro la lista por Hecho
- **CUANDO** otra persona mira la lista en su sesión
- **ENTONCES** su vista no cambia: el filtro no afecta a los demás.

**CA-14 · Las tareas vencidas conservan su marca dentro del filtro**
- **DADO** que hay tareas vencidas entre las Pendientes
- **CUANDO** filtro por Pendiente
- **ENTONCES** siguen apareciendo marcadas como vencidas.
- *Es el mismo comportamiento que FS-118 CA-18.*

### Vista por defecto

**CA-15 · Lo que se ve al entrar** **[SUPUESTO PRD, abierto en PA-12]**
- **DADO** que acabo de iniciar sesión
- **CUANDO** se muestra la lista
- **ENTONCES** veo las tareas en Pendiente y En curso, sin las de Hecho.
