# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

Borra el ejemplo de abajo cuando escribas el primero.


---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Antes de nada, léete el repo y devuélveme el estado real del proyecto: qué capabilities ya existen (auth…) y un diagrama rápido del modelo de datos actual (entidades y relaciones, en Mermaid).
No propongas cambios todavía; solo quiero el mapa de lo que hay.
```

**Qué salió:** Menciona que dejó el mapa completo en el fichero de plan, pero no se pudo saber a que fichero se refiere.

---

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Donde dejaste el mapa completo?
```

**Qué salió:** Escribió el mapa completo en el archivo `c:\Users\[mi user]\.claude\plans\antes-de-nada-l-ete-mighty-dawn.md`.

---

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Actúa como product partner escéptico. Aquí tienes una idea difusa para FlowSync: «Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira.» Antes de proponer nada, hazme las 5 preguntas que más reducirían la incertidumbre sobre el problema, los usuarios y el alcance. No asumas; pregunta. Ten en cuenta el estado del repo que acabas de mapear (auth; las tareas aún no existen). Una sola ronda: con mis respuestas, continúa sin abrir otra tanda de preguntas. Quédate a nivel de producto: nada de modelo de datos, esquema, estados internos, endpoints ni latencias, eso se decide más adelante.
```

**Qué salió:** 
	Me planteo las 5 preguntas de modo interactivo, es decir, de modo multiple choice (AskUserQuestions); no permitiendome ingresarle el prompt con todas las respuestas como indica el ejercicio. No se si esto fue por estar usandolo en modo `plan on`.
	Tuve que cancelar la emision de las respuestas y pase a entregarle el prompt siguiente.

---

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
- Qué duele hoy: la daily de sincronización y el "¿en qué estás?" constante por Slack/chat. Nadie ve el estado del equipo sin interrumpir a alguien.
- Quién cobra el valor: los pares, no un lead. No hay reporte hacia arriba y a un manager le daría igual. Duele a los dos devs que descubren tarde que iban a lo mismo, y al que interrumpe a otro para preguntar.
- Episodio concreto: dos personas del equipo tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera. Dos días perdidos.
- Qué reunión desaparece (respuesta honesta, no la vendas de más): la daily NO desaparece entera. Desaparece la ronda de "¿en qué estás?", que hoy se come la mitad de los 15 minutos. La parte de bloqueos sigue, y este MVP no la resuelve.
- Usuarios / equipo: equipos remotos pequeños, 3–10 personas. Roles planos: en el MVP todos ven y editan lo mismo, sin jerarquía de permisos.
- Primer usuario concreto: equipo de 6 personas de producto SaaS, en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada. Es un CASO DE ESTUDIO, no un cliente real.
- Fronteras: un espacio único compartido, sin entidad "equipo". Varios equipos separados, o gente en más de uno, queda FUERA del MVP: se anota como supuesto en el PRD, no se construye.
- "Tiempo real" = ver los cambios de estado de las tareas sin refrescar ni preguntar. NO es chat, NO es videollamada, NO es colaboración simultánea sobre el mismo documento.
- Es frescura, no presencia: el estado es de la TAREA, no de la persona. Nada de "quién está conectado ahora" ni indicadores de actividad; eso es vigilancia y lo rechazamos a propósito.
- Forma de la señal: resumen que espera, no aviso que interrumpe. El caso es "llego por la mañana o vuelvo de una reunión y veo qué se ha movido". Sin notificaciones push.
- Qué decisión cambia: no empezar algo que otra persona ya está tocando, y elegir lo siguiente sabiendo qué está libre. Si la única respuesta fuera "sentirse informado", el tiempo real no valdría lo que cuesta.
- De dónde sale el estado: lo teclea la persona que hace la tarea, en segundos. Derivarlo de señales externas (Git/PRs, CI, calendario) está FUERA del MVP: es otro producto, con integraciones y OAuth de terceros.
- Por qué se sostiene: no porque sea más agradable, sino porque son dos clics sobre una lista ya abierta, sin campos obligatorios, sin decidir sprint ni estimación. Y quien lo escribe cobra en el momento: esa misma lista es su cola de trabajo, la mira para decidir qué coge, y de paso deja de recibir interrupciones preguntándole cómo va. Si el beneficio fuera solo para los demás, no lo escribiría.
- Si la información se queda vieja: el producto pierde el sentido, y lo asumo. Es el riesgo #1 a validar, no un detalle. La mitigación es que actualizar cueste dos clics, no obligar a nadie.
- Es donde se hace el trabajo, no donde se cuenta: sustituye al gestor de tareas, no convive con él. FlowSync crea las tareas, no lee las de otro sitio. Convivir exigiría doble actualización, que es como muere esta categoría.
- Renuncia explícita a sprints, estimaciones, épicas, backlog priorizado e informes. Un equipo que necesite eso no es nuestro usuario.
- "Menos rollo que Jira" = crear una tarea y cambiarle el estado en segundos, sin flujos de configuración ni campos obligatorios. Lo mínimo para saber quién está en qué.
- Qué necesita una tarea en el MVP: título, responsable, estado y fecha de vencimiento. La fecha, para ver de un vistazo qué se ha pasado de plazo.
- Cómo se consume la lista: filtrando por estado, para centrarse en lo pendiente.
- Éxito para el usuario: dejar de hacer la ronda de "¿en qué estás?" de la daily porque el estado del equipo se ve de un vistazo.
- Criterio a una semana de uso real: que el equipo cancele esa ronda y nadie pida que vuelva. Si la siguen haciendo igual, no funcionó.
- Cuánto construir: una vertical fina y usable de punta a punta, no el andamiaje amplio de un producto. Prefiero una capability terminada a tres a medias.
```

**Qué salió:** Dio como respuesta un documento de MVP propuesto. Algunos puntos en el "*NO ALCANCE*" no están explicitos, como por ejemplo "*analítica/reporting, comentarios en tareas.*". Al terminar sigue haciendo preguntas a modo multiple choice (AskUserQuestions); debo precionar ESC.

---

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Sumo las siguientes consideraciones:
- Fuera del MVP: notificaciones push, integración con Slack, roles/permisos avanzados, analítica/reporting, comentarios en tareas.
- Estados: tres, fijos y no configurables: pendiente/en curso/hecho. "En curso" es la señal que el producto existe para transmitir, así que está DENTRO. "Bloqueado" es otra cosa y está FUERA: es la mitad de la daily que declaramos no resuelta. Los nombres exactos del enum en código bajan a la spec de implementación, no al PRD.
- Obligatoriedad: responsable SÍ (una tarea sin responsable no cumple el propósito); fecha de vencimiento NO (opcional, y sin fecha nunca aparece como vencida). "Sin campos obligatorios" iba contra la configuración tipo Jira, no contra estos dos.
- Latencia: 5-10 segundos vale. El sync en tiempo real de E3 no entra en este MVP.
- Tests: sí, el trabajo llega con tests. Darlo por hecho en el alcance.
```

**Qué salió:** Si bien funcionó a la primera, hay puntos que no incluiría. Al terminar sigue haciendo preguntas a modo multiple choice (AskUserQuestions); debo precionar ESC.

---

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Con mis respuestas, propón el alcance de un MVP: problema, usuarios, propuesta de valor, alcance (in) y NO-alcance (out). Sé agresivo recortando: es un MVP, no el producto final. Justifica cada exclusión.
```

**Qué salió:** Funcionó a la primera. Al terminar sigue haciendo preguntas a modo multiple choice (AskUserQuestions); debo precionar ESC.

---

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Consolida lo anterior en un alcance final en 5 bloques (problema, usuarios, propuesta de valor, alcance, NO-alcance), listo para ser la base de un PRD. Guarda ese alcance consensuado en docs/prd/alcance-mvp-CRM.md, para que no dependa de la conversación. Todavía no escribas el PRD. No habras una rama nueva ni hagas commit.
```

**Qué salió:** Paso a el modo `manual mode on`. Me pregunta si sobreescribe el archivo final de entrega.

---

## Prompt 8

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Crea y escribelo en el archivo docs/prd/alcance-mvp-CRM-borrador.md
```

**Qué salió:** Funcionó a la primera.

---

## Prompt 9

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Lee @docs/prd/alcance-mvp-CRM-borrador.md. 
Redacta un PRD de MVP para FlowSync en docs/prd/alcance-mvp-CRM.md. Estructura: 1) Problema y contexto, 2) Usuarios y jobs-to-be-done, 3) Propuesta de valor, 4) Alcance/Fuera de alcance, 5) Épicas del MVP: exactamente estas tres y en este orden, E1 «Cuentas y acceso», E2 «Gestión de tareas», E3 «Actividad del equipo» (una línea cada una: nombre + qué agrupa), 6) Requisitos funcionales a nivel producto (numerados, RF-1…; el qué debe hacer el sistema, NO endpoints ni tablas ni modelo de datos), 7) Requisitos no funcionales, 8) Restricciones (stack actual: AdonisJS 7 + React 19; auth ya existe), 9) Métricas de éxito. Sé concreto y testable. No incluyas diseño técnico (ER, arquitectura, diagramas C4): esto es producto. No inventes cifras de mercado; si algo es supuesto, márcalo como [SUPUESTO].
```

**Qué salió:** Funcionó a la primera

---

## Prompt 10

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Ahora cambia de sombrero: sé un revisor de producto adversarial. Lee el PRD que acabas de escribir y atácalo. ¿Qué requisitos son ambiguos o no testables? ¿Qué supuesto, si es falso, tumba el MVP entero? ¿Dónde hay scope creep escondido? ¿Qué métrica de éxito no se puede medir de verdad? Prioriza por riesgo.
```

**Qué salió:** Enumero 27 problemas en diferentes criticidades. Muchas tenian sentido.

---

## Prompt 11

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
De tus hallazgos acepto uno y el resto van a puntos abiertos.
Acepto el que sea una CONTRADICCIÓN INTERNA del documento: donde el PRD se pide a sí mismo algo que él mismo prohíbe, o promete algo que su propio alcance impide cumplir. Eso es un fallo mío, no una opinión discutible, y se arregla en un párrafo. Aplícalo, y resuélvelo por el lado honesto: si algo no se puede medir o no se puede cumplir, se declara así, sin maquillarlo ni inventarle una mitigación de adorno.
Los que sean decisiones de producto —qué se ve, en qué orden, con qué lente, cuánto de algo— no se deciden en treinta segundos delante de una clase. Pásalos a la sección de puntos abiertos, cada uno con tu argumento resumido y con lo que haría falta para decidirlo.
Los que tú mismo marcas como subsanables durante la construcción, a puntos abiertos también.
Dos cosas NO se tocan, aunque las hayas cuestionado bien: la fecha de vencimiento y el filtrado por estado se quedan DENTRO del alcance y bajo la épica E2. Si algún hallazgo tuyo los ataca, va a puntos abiertos, nunca al NO-alcance.
Actualiza docs/prd/alcance-mvp-CRM.md con eso y nada más. No reescribas secciones que ningún hallazgo toque.
```

**Qué salió:** Ejecutado solo por error personal.

---

## Prompt 12

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Realiza los siguientes renombramientos de documentos:
 - `docs/prd/alcance-mvp-CRM.md` por `docs/prd/flowsync-mvp.md`
 - `docs/prd/alcance-mvp-CRM-borrador.md` por `docs/prd/alcance-mvp-CRM.md`
```

**Qué salió:** Funciono

---

## Prompt 13

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
! git add docs/
```

**Qué salió:** No funciono.

---

## Prompt 14

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
! git add .
```

**Qué salió:** Funciono.

---

## Prompt 15

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
/commit
```

**Qué salió:** Funciono.

---

## Prompt 16

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Lee @docs/prd/flowsync-mvp.md.
Descompón la épica E2 "Gestión de tareas" en historias de usuario.Cada historia en formato "Como <rol>, quiero <acción> para <beneficio>".Aplica INVEST: pequeñas, testables. NO escribas criterios todavía, solo el listado.Valida cada historia contra el alcance del PRD: si alguna se sale del MVP, márcala explícitamente como "fuera de alcance MVP" en vez de colarla.
```

**Qué salió:** Funciono.

---

## Prompt 17

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
De las historias que acabas de listar, coge la de la fecha de vencimiento y las tareas vencidas. Si te salieron separadas (poner o quitar la fecha por un lado, ver si se ha pasado de plazo por otro), consolídalas en UNA sola historia antes de seguir: para nosotros es una única historia y se llama FS-118.
Escribe sus criterios de aceptación en formato Given/When/Then, redactados en español (DADO/CUANDO/ENTONCES).
Reglas MUY importantes:
- Un criterio de historia es una REGLA DE NEGOCIO observable: qué es verdad para el usuario. NO uses endpoints, status codes ni nombres de campo internos (nada de "PATCH/tasks/:id", "422", "isOverdue"). Ese detalle técnico es de la fase de implementación, no de aquí.
- Incluye el camino feliz Y los edge cases/errores que se me puedan olvidar.
- Marca los criterios que propongas tú para mi revisión.
```

**Qué salió:** Funciono.

---

## Prompt 18

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Ahora la historia de filtrar las tareas por estado para centrarse en lo pendiente. Si no apareció al descomponer E2 porque ese requisito quedó bajo otra épica, tómala igualmente: para nosotros es una historia de E2 y se llama
FS-142.
Mismos criterios: reglas de negocio observables en Given/When/Then, en español (DADO/CUANDO/ENTONCES), sin endpoints ni status codes. Incluye el caso de que se pida un estado que no existe (el sistema debe avisar del error, no devolver una lista vacía en silencio).
```

**Qué salió:** Funciono.

---

## Prompt 19

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Guarda en docs/backlog/E2-gestion-tareas/ SOLO las dos historias que acabamos de enriquecer con criterios de aceptación, un archivo markdown por historia. Las demás historias del listado no se guardan todavía. La de fechas de vencimiento va en
us-fechas-vencimiento.md.
Cada archivo: el título de la historia, su identificador, su formulación "Como <rol>, quiero <acción> para <beneficio>" y sus criterios de aceptación en Given/When/Then, en español (DADO/CUANDO/ENTONCES), tal como los hemos aprobado y con mis ediciones incluidas. Sin endpoints, status codes ni nombres de campo internos.
Los identificadores los fijo yo, no los inventes: la historia de fechas de vencimiento es FS-118 y la de filtrar por estado es FS-142.
```

**Qué salió:** Funciono.

---

## Prompt 20

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
!git add docs/
```

**Qué salió:** Funciono.


---

## Prompt 21

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
/commit
```

**Qué salió:** Funciono.

---

## Prompt 22

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Coge @docs/backlog/E2-gestion-tareas/us-fechas-vencimiento.md.
Descompón esta historia en TICKETS: cada ticket = una unidad de trabajo que una persona termina en una sesión (media jornada máx).
Para cada ticket: ID derivado de la historia (la historia es FS-118, así que sus tickets son FS-118.1, FS-118.2, FS-118.3…), título, tipo (uno de estos: Endpoint/API, Migración/DB, Modelo/Dominio, Frontend, Bug o Test), Definition of Done según su tipo, y dependencias (qué ticket lo bloquea).
El ticket HEREDA los criterios de la historia; su Definition of Done es una checklist de "cómo lo entregamos" (tests, manejo de error, convenciones), NO criterios nuevos ni estimación en horas.
El ticket NOMBRA la capa que toca (migración, modelo, endpoint, UI), pero NO diseña: nada de tipos de columna, si admiten nulos, índices, nombres de ruta ni status codes. Esa decisión es de la implementación.
```

**Qué salió:** Funciono.

---

## Prompt 23

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Ahora coge la historia FS-142 "Filtrar tareas por estado", de @docs/backlog/E2-gestion-tareas/.
Descompón esta historia en TICKETS con la misma convención que la anterior: ID derivado de la historia (la historia es FS-142, así que sus tickets son FS-142.1, FS-142.2…), título, tipo (uno de estos: Endpoint/API, Migración/DB, Modelo/Dominio, Frontend, Bug o Test), Definition of Done según su tipo, y dependencias (qué ticket lo bloquea).
El ticket HEREDA los criterios de la historia; su Definition of Done es una checklist de "cómo lo entregamos" (tests, manejo de error, convenciones), NO criterios nuevos ni estimación en horas.
El ticket NOMBRA la capa que toca (migración, modelo, endpoint, UI), pero NO diseña: nada de tipos de columna, si admiten nulos, índices, nombres de ruta ni status codes. Esa decisión es de la implementación.
```

**Qué salió:** Funciono.

---

## Prompt 24

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Muéstrame las dependencias entre los tickets de FS-118 como un grafo simple (qué bloquea a qué) y el orden de implementación recomendado.
```

**Qué salió:** Funciono.

---

## Prompt 25

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Estima cada ticket en t-shirt sizing (S/M/L) y da una nota de riesgo. No inventes horas exactas; explica en qué se basa cada talla.
```

**Qué salió:** Funciono.

---

## Prompt 26

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Coloca en una matriz impacto vs complejidad las historias de E2 "Gestión de tareas" (incluidas las que quedaron fuera del MVP) y también el sync en tiempo real de E3 "Actividad del equipo", y propón un orden de backlog. Marca los "quick wins" (alto impacto, baja complejidad).
```

**Qué salió:** Funciono. Colocó la tarea de "Crear tarea" como primera.

---

## Prompt 27

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Escribe en docs/backlog/ el backlog que acabamos de construir: los tickets de cada historia (ID derivado FS-118.1…, título, tipo, Definition of Done y dependencias), el grafo de dependencias y el orden de implementación, y la matriz impacto/complejidad de las historias de E2 con el orden de backlog priorizado. Respeta lo que hemos decidido en vivo; no añadas horas ni criterios nuevos.
```

**Qué salió:** Funciono.

---

## Prompt 28

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Materializa el backlog en el tablero FLOW de Jira usando el MCP de Atlassian. Hazlo SECUENCIAL, en este orden, sin lanzar creaciones en paralelo:

1. Crea la HISTORIA FS-118 como issue de tipo "Historia". Título: «FS-118 — Fechas de vencimiento y tareas vencidas». Descripción: sus criterios de aceptación en Given/When/Then, en español (DADO/CUANDO/ENTONCES), tal como los aprobamos (reglas de negocio, sin endpoints ni status codes). Etiquetas: "E2" y "FS-118".
2. Lee la clave que Jira devuelve para esa historia (tiene la forma FLOW-nnn) y úsala en el paso 3.
3. Crea cada ticket de esa historia (FS-118.1, FS-118.2, FS-118.3…) como issue de tipo "Subtarea", pasando el parámetro parent con la clave FLOW-nnn de la historia. En cada subtarea: título con su ID derivado («FS-118.1 — …»), descripción con su tipo y su Definition of Done, etiquetas "E2" y su ID.
4. Repite los pasos 1-3 con la HISTORIA FS-142 «Filtrar tareas por estado» y los tickets que le hayan salido (FS-142.1, FS-142.2…, los que sean). Si esa historia no tiene ningún ticket, créala igualmente como "Historia" y no le cuelgues subtareas.
5. Crea por último la HISTORIA que encabeza el orden priorizado, como issue de tipo "Historia" y SIN subtareas. Título: «E2-1 — Crear tarea con solo el título». Descripción: que es la primera del orden de backlog por ser prerrequisito de todo lo demás; que junto con E2-2, E2-3 y E2-4 forma la base de la capability de tareas (requisitos RF-5 a RF-9 del PRD: crear con solo el título, título obligatorio, responsable por defecto, los tres estados fijos y cambiar el estado desde la lista); y que sus criterios de aceptación viven en el backlog del repositorio, en docs/backlog/, no en este tablero: hoy en directo hemos enriquecido solo las dos historias de arriba. Etiquetas: "E2" y "E2-1". 

Restricciones que debes respetar:
- Los tipos de issue de este proyecto están EN ESPAÑOL: usa literalmente "Historia" y "Subtarea". "Story" o "Sub-task" no resuelven.
- Una subtarea NO se puede crear sin parent: la historia va siempre primero y su clave se encadena a cada subtarea. 
- No inventes claves de Jira: la clave real la asigna Jira (FLOW-nnn). FS-118 y FS-118.1 son nuestra convención y viven en el título y las etiquetas, nunca como clave.
```

**Qué salió:** Funciono!!!