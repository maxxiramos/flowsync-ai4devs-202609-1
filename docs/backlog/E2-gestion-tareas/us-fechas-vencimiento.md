# Fecha de vencimiento y tareas vencidas

**Identificador:** FS-118
**Épica:** E2 — Gestión de tareas

> **Como** miembro del equipo, **quiero** indicar una fecha de vencimiento opcional al crear una tarea y ver marcadas las que se han pasado de plazo, **para** saber de un vistazo qué va tarde sin preguntar a nadie.

**Leyenda:** sin marca = sale del PRD · **[PROPUESTO]** = criterio propuesto, pendiente de revisión · **[SUPUESTO PRD]** = está en el PRD pero sigue abierto.

## Criterios de aceptación

### Camino feliz

**CA-1 · Crear con fecha**
- **DADO** que estoy creando una tarea con título y responsable
- **CUANDO** indico una fecha de vencimiento y la guardo
- **ENTONCES** la tarea aparece en la lista mostrando esa fecha.

**CA-2 · Crear sin fecha**
- **DADO** que estoy creando una tarea con título y responsable
- **CUANDO** la guardo sin indicar fecha de vencimiento
- **ENTONCES** la tarea se crea sin problema y en la lista no muestra ninguna fecha.

**CA-3 · Fecha futura**
- **DADO** una tarea Pendiente cuya fecha de vencimiento es posterior a hoy
- **CUANDO** miro la lista
- **ENTONCES** la tarea **no** aparece como vencida.

**CA-4 · Fecha pasada en una tarea sin terminar**
- **DADO** una tarea en Pendiente o en En curso cuya fecha de vencimiento es anterior a hoy
- **CUANDO** miro la lista
- **ENTONCES** la tarea aparece marcada como vencida.

### Bordes de la regla de vencimiento

**CA-5 · Vence hoy no es vencida**
- **DADO** una tarea sin terminar cuya fecha de vencimiento es hoy
- **CUANDO** miro la lista
- **ENTONCES** la tarea **no** aparece como vencida.

**CA-6 · Sin fecha nunca vence**
- **DADO** una tarea sin fecha de vencimiento, en cualquier estado y con cualquier antigüedad
- **CUANDO** miro la lista
- **ENTONCES** la tarea nunca aparece como vencida.

**CA-7 · Hecho nunca está vencida**
- **DADO** una tarea con fecha de vencimiento pasada
- **CUANDO** la marco como Hecho
- **ENTONCES** deja de aparecer como vencida.

**CA-8 · Reabrir devuelve la marca**
- **DADO** una tarea en Hecho con fecha de vencimiento pasada
- **CUANDO** la devuelvo a Pendiente o a En curso
- **ENTONCES** vuelve a aparecer marcada como vencida.

**CA-9 · Crear con fecha ya pasada**
- **DADO** que estoy creando una tarea
- **CUANDO** indico una fecha anterior a hoy y la guardo
- **ENTONCES** la tarea se crea sin error y aparece directamente como vencida.

**CA-10 · Una tarea pasa a vencida con el cambio de día** **[PROPUESTO]**
- **DADO** una tarea sin terminar que ayer no estaba vencida y cuya fecha de vencimiento era ayer
- **CUANDO** miro la lista hoy
- **ENTONCES** aparece marcada como vencida, sin que nadie haya tocado la tarea.

**CA-11 · Cada persona ve según su propio día** **[SUPUESTO PRD, abierto en PA-11]**
- **DADO** dos miembros en husos horarios distintos, y una tarea sin terminar que vence en la fecha en la que uno de ellos ya está y el otro todavía no
- **CUANDO** ambos miran la lista a la vez
- **ENTONCES** para quien ya ha pasado al día siguiente la tarea aparece vencida, y para quien sigue en el día de vencimiento todavía no.
- *Si en PA-11 se decide fijar una zona horaria común al espacio, este criterio se reescribe.*

### Errores y validación

**CA-12 · Fecha no válida** **[PROPUESTO]**
- **DADO** que estoy creando una tarea
- **CUANDO** indico una fecha que no existe (por ejemplo, 31 de febrero) o que no se reconoce como fecha
- **ENTONCES** la tarea no se crea y veo, junto al campo de fecha, un mensaje en castellano que explica el problema.

**CA-13 · Un error en otro campo no borra la fecha** **[PROPUESTO]**
- **DADO** que estoy creando una tarea con una fecha de vencimiento válida y el título vacío
- **CUANDO** intento guardarla
- **ENTONCES** la tarea no se crea, veo el error del título, y la fecha que había indicado sigue puesta para no tener que repetirla.

**CA-14 · La fecha no se puede cambiar ni quitar después**
- **DADO** una tarea ya creada, con fecha o sin ella
- **CUANDO** la miro en la lista
- **ENTONCES** no tengo forma de añadir, cambiar ni quitar su fecha de vencimiento.
- *Lo excluye RF-19. Si la fecha está mal, el único camino es «Hecho y recrear» (PA-10).*

**CA-15 · Solo día, sin hora**
- **DADO** que estoy indicando una fecha de vencimiento
- **CUANDO** la elijo
- **ENTONCES** solo puedo indicar el día, no una hora.

### Visibilidad y convivencia con otras historias

**CA-16 · La marca de vencida no depende solo del color**
- **DADO** una tarea vencida en la lista
- **CUANDO** la miro sin distinguir colores, o con un lector de pantalla
- **ENTONCES** la condición de vencida se identifica igualmente, porque lleva un texto o un icono con etiqueta.

**CA-17 · Reasignar no toca la fecha** **[PROPUESTO]**
- **DADO** una tarea con fecha de vencimiento, vencida o no
- **CUANDO** cambio su responsable
- **ENTONCES** conserva la misma fecha y la misma condición de vencida.

**CA-18 · El filtro por estado conserva la marca** **[PROPUESTO]**
- **DADO** que hay tareas vencidas entre las Pendientes
- **CUANDO** filtro la lista por Pendiente
- **ENTONCES** las vencidas siguen apareciendo marcadas como tales.

**CA-19 · Formato de la fecha** **[PROPUESTO]**
- **DADO** una tarea con fecha de vencimiento
- **CUANDO** la veo en la lista
- **ENTONCES** la fecha se muestra en formato español de día, mes y año (por ejemplo, 08/10/2026).
