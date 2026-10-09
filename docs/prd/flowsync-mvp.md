# PRD — FlowSync MVP

> Base: [`alcance-mvp-CMR.md`](./alcance-mvp-CMR.md).
>
> Este documento define **qué** debe hacer el producto, no **cómo** se construye. El modelo de datos, los endpoints, los nombres internos de estados y el mecanismo de actualización se deciden en la spec de implementación. Todo lo marcado como **[SUPUESTO]** está pendiente de validar.

---

## 1. Problema y contexto

**Problema.** En un equipo remoto pequeño nadie ve en qué está el resto sin interrumpir a alguien.
- La mitad de la daily de 15 minutos se va en la ronda de «¿en qué estás?».
- Entre dailies, la misma pregunta se repite por chat.

**Coste observado.** Dos personas tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera. Se perdieron dos días de trabajo.

**Qué cambia con FlowSync.** Cada persona lleva su trabajo en una lista compartida y marca el estado de cada tarea con un par de clics. El resto lo ve sin preguntar.

**Qué no resuelve.** La parte de bloqueos de la daily sigue existiendo. El MVP elimina la ronda de estado, no la reunión entera.

**Contexto del repositorio.**
- Ya existen el registro, el login, el perfil y el logout.
- Las tareas no existen todavía.

## 2. Usuarios y jobs-to-be-done

**Usuario objetivo.** Miembros de un equipo remoto pequeño (3–10 personas) con roles planos.
- No hay lead ni jerarquía.
- Nadie recibe informes, así que el MVP no tiene comprador distinto del usuario.

**Caso de estudio (no es un cliente real).**
- Equipo de producto SaaS de 6 personas, repartido en 3 husos horarios.
- Hoy usa un gestor de tareas pesado y hace una daily de 15 minutos por videollamada.

**Jobs-to-be-done.**

| ID | Cuando… | quiero… | para… |
|---|---|---|---|
| JTBD-1 | voy a empezar algo | ver si otra persona ya lo tiene en curso | no duplicar trabajo |
| JTBD-2 | llego por la mañana o vuelvo de una reunión | ver de un vistazo cómo está el trabajo del equipo | no tener que preguntar a nadie |
| JTBD-3 | empiezo o termino una tarea | reflejarlo en segundos | que nadie me interrumpa para preguntarme cómo va |
| JTBD-4 | decido qué hago ahora | ver mi propia cola de pendientes y lo que se ha pasado de fecha | elegir sin abrir otra herramienta |

## 3. Propuesta de valor

**Una lista compartida que es a la vez tu cola de trabajo y el estado del equipo.** Cambiar el estado de una tarea cuesta dos clics y el resto lo ve sin preguntar ni recargar.

- **Es donde se hace el trabajo, no donde se cuenta.** FlowSync sustituye al gestor de tareas; no convive con él. Convivir obligaría a actualizar dos sitios.
- **Quien escribe el estado se beneficia en el momento.** La lista es su propia cola, y deja de recibir interrupciones.
- **El estado es de la tarea, nunca de la persona.** No hay presencia ni indicadores de actividad.
- **«Menos rollo que Jira».** Crear una tarea y cambiarle el estado lleva segundos, sin configuración ni campos superfluos.

## 4. Alcance / Fuera de alcance

### Dentro del alcance

Una vertical fina y usable de punta a punta.

1. **Espacio único compartido.** Toda persona con cuenta ve y edita todas las tareas.
2. **Crear tarea.** Título y responsable son obligatorios; la fecha de vencimiento es opcional.
3. **Tres estados fijos, no configurables: Pendiente, En curso y Hecho.**
4. **Cambiar el estado y reasignar el responsable** desde la propia lista.
5. **Lista del equipo** que marca las tareas vencidas.
6. **Filtro por estado.**
7. **Frescura.** Los cambios de otras personas aparecen en 5–10 segundos sin recargar.
8. **Tests** de todo lo anterior.

### Fuera de alcance

| Fuera | Motivo |
|---|---|
| Estado «Bloqueado» | Es la parte de la daily que el MVP declara no resuelta. |
| Estados configurables o flujos | Es justo la configuración que hace pesado a Jira. |
| Sincronización en tiempo real (actualización instantánea) | Con 5–10 segundos basta. Las colisiones vienen de no actualizar a tiempo, no de la latencia. |
| Notificaciones push o email | La señal debe esperar al usuario, no interrumpirle. |
| Integración con Slack | Implicaría convivir con otra superficie y actualizar dos sitios. Además exige OAuth de terceros. |
| Derivar el estado de Git, PRs, CI o calendario | Es otro producto. Primero hay que validar si la gente escribe el estado a mano. |
| Importar desde otro gestor | Solo resuelve el primer día. Con 6 personas, recrear las tareas abiertas lleva minutos. |
| Roles y permisos avanzados | Los roles son planos. |
| Varios equipos o espacios | El caso de estudio es un solo equipo. |
| Invitaciones y control de acceso al espacio | Con un solo espacio y registro abierto, el caso de estudio funciona. |
| Comentarios en tareas | Acercan el producto al chat, que se descarta. |
| Descripción, subtareas, etiquetas, adjuntos | Cada campo añade fricción al crear la tarea. |
| Editar título o fecha, borrar tareas | Recorte del MVP: lo que quede mal se marca como Hecho y se crea de nuevo. Es lo primero en volver si el piloto lo pide. |
| Filtro por responsable, búsqueda, orden configurable | Con 3–10 personas, la lista cabe en una pantalla. |
| Historial o «qué cambió desde mi última visita» | Es una segunda capability. Primero hay que validar si basta con ver el estado actual. |
| Presencia e indicadores de actividad de personas | Es vigilancia; se rechaza a propósito. |
| Chat, videollamada, edición simultánea | Son otras categorías de producto. |
| Sprints, estimaciones, épicas, backlog priorizado | Un equipo que los necesita no es nuestro usuario. |
| Analítica y reporting | No hay a quién reportar. |
| App móvil nativa | El uso es en escritorio, al empezar a trabajar. |

## 5. Épicas del MVP

- **E1 — Cuentas y acceso:** registro, login, logout y perfil, que ya existen; restricción de todo el contenido a personas autenticadas, y el listado de miembros para poder elegir responsable.
- **E2 — Gestión de tareas:** crear tareas, asignar y reasignar responsable, la fecha de vencimiento opcional y la marca de vencidas, el cambio entre los tres estados y el filtrado por estado.
- **E3 — Actividad del equipo:** la vista compartida del trabajo del equipo y su frescura en 5–10 segundos sin recargar. El sync en tiempo real queda fuera.

## 6. Requisitos funcionales

Cada requisito se puede verificar con un test o con una prueba manual reproducible.

### E1 — Cuentas y acceso

- **RF-1.** Una persona puede registrarse con email, contraseña y confirmación de contraseña. El nombre es opcional. *(Ya existe.)*
- **RF-2.** No se puede registrar un email que ya tiene cuenta. El sistema muestra un error en castellano junto al campo. *(Ya existe.)*
- **RF-3.** Una persona registrada puede iniciar sesión con email y contraseña. Si las credenciales son incorrectas, ve un mensaje en castellano y no se le revela cuál de los dos campos falló. *(Ya existe.)*
- **RF-4.** Una persona con sesión iniciada puede cerrarla. Después no puede ver ni modificar tareas hasta volver a entrar. *(Ya existe.)*
- **RF-5.** Sin sesión iniciada no se puede ver, crear ni modificar ninguna tarea, ni ver el listado de miembros. Quien intenta acceder a la lista acaba en la pantalla de login.
- **RF-6.** Toda persona registrada es automáticamente miembro del espacio compartido. No hace falta invitación ni aprobación. **[SUPUESTO]** Es aceptable para el caso de estudio porque solo se registra el equipo.
- **RF-7.** El sistema ofrece el listado de todos los miembros para elegir responsable. Cada miembro se muestra con su nombre o, si no lo indicó, con su email.

### E2 — Gestión de tareas

- **RF-8.** Una persona autenticada puede crear una tarea indicando título, responsable y, opcionalmente, fecha de vencimiento.
- **RF-9.** El título es obligatorio y no puede estar vacío ni ser solo espacios. Su longitud máxima es de 200 caracteres **[SUPUESTO]**. Si no se cumple, la tarea no se crea y se muestra un error en castellano junto al campo.
- **RF-10.** El responsable es obligatorio y debe ser un miembro existente. Si falta, la tarea no se crea y se muestra un error en castellano.
- **RF-11.** El responsable por defecto al crear es la propia persona que crea la tarea, y se puede cambiar antes de guardar. **[SUPUESTO]** El caso más frecuente es crear trabajo propio.
- **RF-12.** La fecha de vencimiento es opcional y es solo una fecha, sin hora. Se puede crear una tarea con fecha pasada; aparecerá directamente como vencida.
- **RF-13.** Toda tarea nueva empieza en el estado **Pendiente**.
- **RF-14.** Una tarea solo puede estar en uno de tres estados: **Pendiente**, **En curso** o **Hecho**. No se pueden añadir, renombrar ni eliminar estados.
- **RF-15.** Cualquier miembro puede pasar cualquier tarea a cualquiera de los tres estados, en cualquier dirección. Por ejemplo, de Hecho a Pendiente para reabrirla.
- **RF-16.** Cambiar el estado se hace desde la propia lista, sin abrir un formulario ni otra pantalla, y requiere como máximo dos interacciones (clic o tecla).
- **RF-17.** Cualquier miembro puede reasignar el responsable de cualquier tarea a otro miembro desde la propia lista. La reasignación no cambia el estado.
- **RF-18.** Ninguna operación pide más campos que los de RF-8: no hay descripción, prioridad, estimación ni etiquetas.
- **RF-19.** No se pueden editar el título ni la fecha de una tarea existente, ni borrar tareas.
- **RF-22.** Una tarea aparece marcada como **vencida** si y solo si tiene fecha de vencimiento, esa fecha es anterior al día actual y no está en Hecho.
  - Una tarea que vence hoy no está vencida.
  - Una tarea sin fecha nunca está vencida.
  - Una tarea en Hecho nunca está vencida.
  - **[SUPUESTO]** El «día actual» es el del navegador de quien mira, por los 3 husos horarios. Ver la restricción R-6.
- **RF-23.** La lista se puede filtrar por un estado (Pendiente, En curso o Hecho) o mostrar todos. El filtro se aplica sin recargar la página.

> Los identificadores RF-22 y RF-23 se mantienen para no romper las referencias, aunque pertenecen a E2.

### E3 — Actividad del equipo

- **RF-20.** La vista principal tras iniciar sesión es la lista de tareas de todo el espacio.
- **RF-21.** Para cada tarea, la lista muestra el título, el responsable (nombre o email), el estado y la fecha de vencimiento si la tiene.
- **RF-24.** Por defecto, la lista muestra todas las tareas que no están en Hecho. **[SUPUESTO]** El foco es lo pendiente y lo que está en curso.
- **RF-25.** La lista tiene un orden fijo y predecible que no configura el usuario. **[SUPUESTO]** Primero En curso, después Pendiente y por último Hecho; dentro de cada grupo, de la más reciente a la más antigua.
- **RF-26.** Con la lista abierta, la creación de tareas, los cambios de estado y las reasignaciones hechas por otras personas aparecen sin recargar la página ni pulsar nada (ver RNF-1).
- **RF-27.** Los cambios propios se reflejan en la lista inmediatamente, sin esperar al ciclo de actualización.
- **RF-28.** Si se aplica a la vez un cambio propio y uno ajeno sobre la misma tarea, prevalece el último que llega al sistema. La lista acaba mostrando ese valor en todas las sesiones. No se avisa del conflicto.
- **RF-29.** La vista no muestra quién está conectado, cuándo se conectó cada persona ni ningún indicador de actividad individual.
- **RF-30.** Si la lista está vacía, en total o tras filtrar, se muestra un mensaje que lo indica y, si no hay ninguna tarea, se ofrece crear la primera.

## 7. Requisitos no funcionales

- **RNF-1 · Frescura.** Un cambio hecho por una persona aparece en la lista abierta de otra en **10 segundos o menos** desde que se confirma, sin acción del usuario. Se mide en una prueba con dos sesiones simultáneas. Actualizar al instante no es un objetivo.
- **RNF-2 · Rapidez de uso.** Con la lista abierta, crear una tarea con título y responsable por defecto requiere un campo de texto y una confirmación. Una persona que ya conoce la herramienta lo hace en menos de 10 segundos **[SUPUESTO]**. Cambiar el estado cumple RF-16.
- **RNF-3 · Respuesta.** Con el volumen de RNF-4, crear una tarea, cambiar su estado o reasignarla se confirma en pantalla en menos de 1 segundo en una red normal **[SUPUESTO]**.
- **RNF-4 · Volumen.** El MVP funciona sin degradación visible con hasta 10 miembros y 500 tareas en el espacio **[SUPUESTO]**. Paginar no es un requisito.
- **RNF-5 · Seguridad.**
  - Ningún dato de tareas ni de miembros es accesible sin sesión válida (RF-5).
  - El listado de miembros no expone contraseñas ni ningún otro dato que no sea nombre y email.
  - Las contraseñas se siguen almacenando con hash, como ya hace el sistema.
- **RNF-6 · Idioma.** Toda la interfaz y todos los mensajes de error que ve el usuario están en castellano.
- **RNF-7 · Plataforma.** Aplicación web en las dos últimas versiones de Chrome, Firefox, Edge y Safari de escritorio **[SUPUESTO]**. En pantallas estrechas debe ser usable, pero el MVP no se optimiza para móvil.
- **RNF-8 · Accesibilidad básica.**
  - Crear una tarea y cambiar su estado se pueden hacer solo con teclado.
  - El estado y la marca de vencida no se transmiten únicamente con color: llevan texto o icono con etiqueta.
- **RNF-9 · Calidad.** Cada RF nuevo (RF-5 a RF-30) tiene al menos un test automatizado. Los de permisos y validación tienen tests funcionales en el backend. La suite completa pasa antes de dar el MVP por terminado.
- **RNF-10 · Aislamiento de tests.** Los tests no dejan datos en la base de datos de desarrollo ni dependen del orden de ejecución.

## 8. Restricciones

- **R-1 · Stack.** Backend en AdonisJS 7 (con Lucid 22, VineJS 4 y SQLite) y frontend en React 19 con Vite 8. No se introduce otro framework, otro lenguaje de servidor ni otra base de datos para el MVP.
- **R-2 · Auth existente.** Se reutilizan el registro, el login, el logout y el perfil actuales, con sesión por token. No se rehace la autenticación ni se añaden proveedores externos (OAuth, SSO).
- **R-3 · Sin servicios de terceros.** El MVP no depende de servicios externos: ni mensajería, ni notificaciones, ni integraciones.
- **R-4 · Un único espacio.** El producto asume un solo espacio compartido. Soportar varios queda explícitamente fuera y no debe condicionar el MVP.
- **R-5 · Convenciones.** Las convenciones de código, el formato de respuesta y la estructura de carpetas siguen las ya establecidas en el repositorio (ver `CLAUDE.md`).
- **R-6 · Husos horarios.** El equipo del caso de estudio está repartido en 3 husos horarios. La regla de vencimiento de RF-22 debe dar un resultado coherente para cada persona según su propio día.

## 9. Métricas de éxito

El MVP no incluye analítica (está fuera de alcance), así que las métricas se recogen **por observación y una encuesta breve** durante una prueba de una semana con el equipo del caso de estudio.

| ID | Métrica | Objetivo | Cómo se mide |
|---|---|---|---|
| M-1 · **Principal** | Ronda de «¿en qué estás?» en la daily | Cancelada al final de la semana y nadie pide que vuelva | Observación de la daily y pregunta directa al equipo al cerrar la semana |
| M-2 | Colisiones (dos personas trabajando en lo mismo sin saberlo) | 0 durante la semana | Pregunta al equipo al cerrar la semana |
| M-3 | Tareas que pasan por En curso antes de Hecho | **No medible en este MVP** | — |
| M-4 | Frescura percibida | Ninguna persona encuentra durante la semana una tarea cuyo estado real no coincida con la lista | Encuesta al cerrar la semana. Valida el riesgo #1: que la información se quede vieja. |
| M-5 | Preguntas de estado por chat | Disminuyen respecto a la semana anterior, según el propio equipo | Autoevaluación del equipo. **[SUPUESTO]** No hay línea base medida, así que es cualitativa. |
| M-6 | Uso exclusivo | El equipo no actualiza su gestor anterior durante la semana | Pregunta al equipo. Valida el riesgo #3: que sustituya, no conviva. |

**Sobre M-3.** El producto solo guarda el estado actual de cada tarea y el historial está fuera de alcance (§4). Al final de la semana, una tarea en Hecho no deja rastro de si pasó por En curso ni de cuándo. Por tanto, el riesgo #2 (que «En curso» se marque a tiempo) **queda sin validar** en este MVP. La métrica se mantiene en la tabla para que el hueco quede a la vista, no para medirla.

**Criterio de fracaso explícito:** si al final de la semana la ronda de estado se sigue haciendo igual, el MVP no ha funcionado, aunque el resto de métricas sean buenas.

## 10. Puntos abiertos

Hallazgos de la revisión adversarial que no se resuelven en este documento. Para cada uno: el argumento y lo que haría falta para decidir.

### Supuestos y validación

- **PA-1 · La colisión del episodio no se evita solo con títulos.** El episodio fue sobre un *módulo*, pero el producto solo muestra títulos de tarea en texto libre. Evitar colisiones exige tres cosas: crear la tarea antes de empezar, marcarla En curso a tiempo y que el título revele el área tocada. Solo la primera está declarada como supuesto.
  - *Para decidir:* si estos supuestos se aceptan como apuesta del MVP o si el producto necesita alguna lente adicional para hacer visible el solapamiento.
- **PA-2 · ¿Quién hace el piloto?** Las métricas de §9 se miden con «el equipo del caso de estudio», que no es un cliente real.
  - *Para decidir:* nombrar un equipo concreto que vaya a usarlo una semana, o declarar §9 como hipótesis no validable hasta que exista ese equipo.
- **PA-3 · M-2 (0 colisiones en una semana) no tiene línea base.** Si antes había una colisión al trimestre, cero en una semana no demuestra nada.
  - *Para decidir:* la frecuencia histórica de colisiones del equipo piloto y una ventana de medición proporcional a ella.
- **PA-4 · M-1, M-4 y M-5 son débiles.**
  - M-1: una semana es poco para un cambio de ritual, y la pregunta está sujeta a presión social.
  - M-4: mide si alguien *notó* un desfase, no si lo hubo.
  - M-5: no tiene línea base.
  - *Para decidir:* la duración del piloto (por ejemplo, repetir M-1 a las dos semanas) y si M-5 se mantiene como métrica o pasa a ser solo una observación.

### Decisiones de producto

- **PA-5 · Recortes frente a «sustituye, no convive».** Sin descripción, edición ni borrado, el contexto del trabajo se queda en otra herramienta, y eso empuja a la convivencia que §3 declara letal.
  - *Para decidir:* si se rebaja la promesa durante el piloto o se admite un campo de notas opcional. Hace falta saber qué información extra usa hoy el equipo piloto en sus tareas.
- **PA-6 · Privacidad del listado de miembros (RF-6, RF-7, RNF-5).** Con registro abierto, cualquiera que se registre ve el email de todos los miembros.
  - *Para decidir:* mostrar solo el nombre (lo que obligaría a pedirlo al registrarse) o restringir el registro. Depende de quién pueda acceder realmente al despliegue del piloto.
- **PA-7 · Conflicto al «tomar» una tarea (RF-17, RF-28, RNF-1).** Con hasta 10 segundos de desfase y la regla del último cambio, dos personas pueden tomar la misma tarea y una pierde en silencio. Es el escenario que el producto quiere evitar.
  - *Para decidir:* si se avisa a quien actúa sobre una tarea que cambió desde que la vio, y cuánto coste se acepta por ello.
- **PA-8 · JTBD-4 («mi propia cola») no tiene ningún RF que lo cumpla.** El filtro por responsable está fuera de alcance, y sin una vista propia se debilita el incentivo de quien escribe el estado (§3).
  - *Para decidir:* recuperar una vista «mis tareas» o retirar JTBD-4. Haría falta observar si, con 3–10 personas, localizar las tareas propias en la lista común es un problema real.
- **PA-9 · JTBD-2 no cubre «qué se ha movido».** El caso original era ver qué ha cambiado al volver; la foto actual no lo muestra y el historial está fuera de alcance. Tampoco se especifica qué pasa con una pestaña en segundo plano: el navegador puede frenar la actualización justo mientras la persona está en una reunión.
  - *Para decidir:* si se declara como renuncia explícita o se añade algo mínimo, y si RNF-1 debe cubrir el momento de volver a la pestaña.
- **PA-10 · «Hecho» como cajón de sastre (RF-19).** Una tarea abandonada o creada por error solo sale de la vista marcándola Hecho, y eso degrada la fiabilidad del estado, que es el valor del producto.
  - *Para decidir:* si se acepta el coste o se incluye borrar o descartar. Haría falta estimar con qué frecuencia se crean tareas erróneas o que se abandonan.
- **PA-11 · Vencimiento y husos horarios (RF-22, R-6).** Con el día del navegador, la misma tarea puede aparecer vencida para una persona y no para otra, y R-6 pide un resultado «coherente» sin definirlo. La fecha de vencimiento y la marca de vencida **se mantienen en el alcance (E2)**; lo abierto es la regla.
  - *Para decidir:* aceptar la divergencia de forma explícita o fijar una zona horaria del espacio.
- **PA-12 · Decisiones de UX añadidas sin pactar.**
  - RF-11: responsable por defecto.
  - RF-24: vista por defecto sin Hecho. El filtrado por estado **se mantiene en el alcance (E2)**; lo abierto es el valor por defecto.
  - RF-25: orden fijo, sin aclarar si «más reciente» es por creación o por último cambio.
  - RF-30: estados vacíos.
  - *Para decidir:* validar cada una con el equipo piloto o retirarla del PRD y dejarla a criterio de la implementación.
- **PA-13 · Alcance de RNF-7 y RNF-8.** Cuatro navegadores en dos versiones, más el uso solo con teclado, multiplican el coste de prueba y no estaban pactados.
  - *Para decidir:* qué navegadores usa de verdad el equipo piloto y si la accesibilidad por teclado es un requisito del MVP o un objetivo posterior.
- **PA-14 · E1 cuenta requisitos ya existentes (RF-1 a RF-4).** Hinchan el número de RF sin añadir trabajo.
  - *Para decidir:* si se mantienen como referencia o se marcan aparte como línea base.

### Subsanables durante la construcción

- **PA-15 · Redacción no testable.** Se resuelve al escribir los criterios de aceptación de cada historia:
  - RF-16: qué cuenta como «interacción».
  - RF-27: «inmediatamente», y qué pasa si el guardado falla.
  - RNF-2: «persona que ya conoce la herramienta» y «10 segundos».
  - RNF-3: «red normal».
  - RF-29: requisito negativo que solo se verifica por inspección.
- **PA-16 · Tests de frontend (RNF-9).** El frontend no tiene runner de tests, y varios RF son puramente de interfaz (RF-16, RF-22, RF-27, RF-29, RF-30, RNF-8).
  - *Para decidir:* al planificar E2 y E3, qué se cubre con tests de backend, qué con un runner de front o e2e (que habría que añadir) y qué con pruebas manuales documentadas.
