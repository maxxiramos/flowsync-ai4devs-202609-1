# FlowSync — Alcance del MVP

> Alcance consensuado que sirve de base al PRD. Aún no es el PRD: no incluye decisiones de implementación (modelo de datos, endpoints, nombres de enum, mecanismo de sincronización).

## 1. Problema

- En un equipo remoto pequeño, la mitad de la daily de 15 minutos se va en la ronda de «¿en qué estás?», y entre dailies la misma pregunta se repite por chat. Nadie ve el estado del equipo sin interrumpir a alguien.
- El coste real son las colisiones. Caso observado: dos personas tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera. Se perdieron dos días.
- **Lo que este MVP no resuelve:** la parte de bloqueos de la daily. La daily no desaparece entera; desaparece la ronda de estado.

## 2. Usuarios

- Pares de equipos remotos pequeños (3–10 personas) con roles planos. No hay lead, jerarquía ni nadie que reciba informes; a un manager le daría igual.
- Ganan dos perfiles:
  - Quien iba a empezar algo que otra persona ya tenía en curso.
  - Quien interrumpe o es interrumpido para preguntar «¿cómo va?».
- **Caso de estudio (no es un cliente real):** equipo de producto SaaS de 6 personas, repartido en 3 husos horarios. Hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada.
- **Momentos de uso:**
  - «Voy a empezar algo»: ¿lo está tocando ya otra persona?
  - «Llego por la mañana o vuelvo de una reunión»: ¿cómo está el equipo?

## 3. Propuesta de valor

**Una lista compartida que es a la vez tu cola de trabajo y el estado del equipo.** Cambiar el estado de una tarea cuesta dos clics y los demás lo ven sin preguntar ni recargar.

- **Es donde se hace el trabajo, no donde se cuenta.** Sustituye al gestor de tareas; no convive con él, porque la doble actualización es como muere esta categoría.
- **Se sostiene porque quien escribe el estado cobra en el momento.** La lista es su propia cola para decidir qué coge, y deja de recibir preguntas sobre cómo va.
- **El estado es de la tarea, nunca de la persona.** Frescura, no presencia.
- **«Menos rollo que Jira»** significa crear una tarea y cambiarle el estado en segundos, sin configuración ni campos superfluos.

**Criterio de éxito:** tras una semana de uso real, el equipo cancela la ronda de «¿en qué estás?» de la daily y nadie pide que vuelva. Si la siguen haciendo igual, no funcionó.

## 4. Alcance (IN)

Una vertical fina y usable de punta a punta. Mejor una capability terminada que tres a medias.

1. **Espacio único compartido.** Toda persona con cuenta ve y edita todas las tareas. Se reutiliza la autenticación existente.
2. **Crear tarea.** Título y responsable obligatorios; fecha de vencimiento opcional. No hay más campos.
3. **Tres estados fijos, no configurables: pendiente, en curso y hecho.** «En curso» es la señal que el producto existe para transmitir. El estado se cambia desde la propia lista, en uno o dos clics.
4. **Reasignar el responsable**, para poder coger una tarea pendiente de otra persona.
5. **Lista del equipo** con título, responsable, estado y vencimiento. Una tarea con fecha pasada y sin terminar se marca como vencida; una sin fecha nunca aparece como vencida.
6. **Filtro por estado**, para centrarse en lo pendiente.
7. **Frescura.** Los cambios de otras personas aparecen en la lista abierta en 5–10 segundos, sin recargar.
8. **Tests.** El trabajo se entrega con tests; se da por hecho dentro del alcance.

**Supuestos del alcance:**
- Un único espacio y registro abierto: quien se registra ve todo. Vale para el caso de estudio y es lo primero que rompe fuera de él.
- La tarea se crea y se pasa a «en curso» **antes** de empezar el trabajo. Sin eso, las colisiones no se evitan.
- Con el responsable obligatorio no existe la tarea «libre». La decisión que se apoya es «no empiezo lo que otra persona tiene en curso».
- El equipo arranca con la lista vacía al dejar su gestor anterior.

**Riesgos que hay que validar, por orden:**
1. **Que la información se quede vieja.** Si nadie actualiza, el producto pierde el sentido. Mitigación: actualizar cuesta dos clics; no se obliga a nadie.
2. **Que se marque «en curso» a tiempo.**
3. **Que el equipo abandone su gestor anterior.**

## 5. NO-alcance (OUT)

| Fuera | Por qué |
|---|---|
| Estado «bloqueado» | Es la parte de la daily que el MVP declara no resuelta. Meterlo a medias promete algo que no se cumple. |
| Estados configurables o flujos | Es la configuración que hace pesado a Jira. Tres estados bastan para responder «¿quién está en qué?». |
| Sincronización en tiempo real (E3) | Con 5–10 segundos basta: nadie mira la lista segundo a segundo. Las colisiones vienen de no actualizar a tiempo, no de la latencia. |
| Notificaciones push o email | La señal es un resumen que espera, no un aviso que interrumpe. Cambiar el ping de Slack por otro ping no quita interrupciones. |
| Integración con Slack | Supone convivir con otra superficie y abre la doble actualización. Además exige OAuth de terceros. |
| Derivar el estado de Git, PRs, CI o calendario | Es otro producto, con integraciones propias. Primero hay que validar si la gente escribe el estado a mano. |
| Importar desde otro gestor | Es caro y solo resuelve el primer día. Con 6 personas, recrear las tareas abiertas lleva minutos. |
| Roles y permisos avanzados | Los roles son planos y no hay a quién reportar. Cualquier jerarquía añade fricción sin que nadie la pida. |
| Varios equipos o espacios, personas en más de uno | El caso de estudio es un solo equipo. Queda como supuesto; es lo primero que rompe al crecer, pero hoy no duele. |
| Invitaciones y control de acceso al espacio | Con un solo espacio y registro abierto, el caso de estudio funciona. Va ligado a «varios equipos». |
| Comentarios en tareas | Convierten la lista en un hilo y la acercan al chat, que se descarta. |
| Descripción, subtareas, etiquetas, adjuntos | Cada campo es una pregunta más al crear. La señal que importa (qué, quién, en qué estado) cabe en el título. |
| Editar título o fecha, borrar tareas | Recorte agresivo. Si algo queda mal, se marca como hecho y se crea de nuevo. Es lo primero en volver si el piloto lo pide. |
| Filtro por responsable, búsqueda, orden configurable | Con 3–10 personas la lista cabe en una pantalla, y el filtro por estado ya separa lo pendiente. |
| Historial o «qué cambió desde mi última visita» | Es útil para el caso de «vuelvo por la mañana», pero es una segunda capability. Primero se valida si basta la foto actual. |
| Presencia e indicadores de actividad de personas | Es vigilancia y se rechaza a propósito. El estado es de la tarea, no de la persona. |
| Chat, videollamada, edición simultánea | Eso no es «tiempo real» en este producto. Son otras categorías. |
| Sprints, estimaciones, épicas, backlog priorizado | Un equipo que los necesita no es nuestro usuario. |
| Analítica y reporting | No hay a quién reportar. |
| App móvil nativa | El momento de uso es en el escritorio, al empezar trabajo. Basta con la web. |

---


# Parte B: las 3 lineas

1. 
   - Cantidad de cosas propuso la IA meter dentro del alcance: 12
   - Cantidad de cosas quedaron dentro después de tu recorte: 7

2. Tres cosas que dejaste fuera, y por qué cada una. El porqué tiene una forma concreta: qué hipótesis del producto no ayuda a validar. "No da tiempo" no vale, porque no es una decisión de producto: es una excusa de calendario, y mañana deja de ser cierta.
   1. Punto dejado fuera:
      - Punto dejado fuera: «Sin campos obligatorios» choca con «la tarea tiene responsable, estado y fecha». Solo el título es obligatorio. Una tarea sin responsable significa «libre», y eso es justo lo que se necesita para «elegir lo siguiente sabiendo qué está libre».
      - Porque: El Responsable es obligatorio, sino una Tarea sin Responsable no cumple el propósito. El estado "pendiente" significa que fue asignada la tarea pero ni iniciada.
   2. Punto dejado fuera:
      - Punto dejado fuera: El tiempo real y el resumen que espera son dos cosas distintas. El tiempo real ayuda con la lista abierta, en el momento de coger algo. El caso de «llego por la mañana» no necesita tiempo real: necesita ver qué cambió. **Filtrar por estado no lo cubre. Recomiendo ordenar por cambio reciente, que es el mínimo, y dejar «marcar lo nuevo desde mi última visita» como candidato si el mínimo no basta.**
      - Porque: Al tener en el alcance el punto 7 "Frescura. Los cambios de otras personas aparecen en la lista abierta en 5–10 segundos, sin recargar." cubre parcialmente este punto.
   3. Punto dejado fuera:
      - Punto dejado fuera: La fecha de vencimiento es la pieza más cercana a Jira. Sin reportes ni lead, ¿a quién le importa? **Agrego una fecha de estimación de termino de la tarea?**
      - Porque: La fecha de vencimiento es parte del control personal de cada persona y además es el requerimiento minimo para poder gestionar las tareas que poseen depencia.
	

3. La exclusión de la que menos seguro estás, y qué tendría que pasar para que entrara. Lo que interesa es qué dos cosas se contradecían: lo que te pedían contra lo que veías, lo barato contra lo que valida, lo que enamora contra lo que se puede sostener.
	Exclusión de la que menos seguridad se tiene, y qué tendría que pasar para que entrara.
		La nuemro 2.1. Lo sugerido me parecía mas intuitivo (aún que va en contra de lo "*sino una Tarea sin Responsable no cumple el propósito*"). Considero que es un requerimiento a incluir en caso de que el equipo tenga confusion en el interpretacion de una tarea libre (o posible a tomar, más puntualmente) y/o si el gestor de proyecto desea incluir tareas que todavia no sabe a quien asignar pero le sirve para dejar asentado el backlog. 
