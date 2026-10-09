# Backlog — E2 «Gestión de tareas»

> Fuentes: [PRD](../prd/flowsync-mvp.md) · [FS-118](./E2-gestion-tareas/us-fechas-vencimiento.md) · [FS-142](./E2-gestion-tareas/us-filtrar-por-estado.md)
>
> Cada ticket **hereda** los criterios de aceptación de su historia. La Definition of Done describe *cómo se entrega* el ticket, no *qué* hace. Los tickets nombran la capa que tocan, pero no fijan columnas, rutas ni códigos de respuesta: eso se decide en la implementación.

**Contenido**
1. [FS-118 · Fecha de vencimiento y tareas vencidas](#1-fs-118--fecha-de-vencimiento-y-tareas-vencidas)
2. [FS-142 · Filtrar tareas por estado](#2-fs-142--filtrar-tareas-por-estado)
3. [Matriz impacto × complejidad y orden de backlog](#3-matriz-impacto--complejidad-y-orden-de-backlog)

---

## 1. FS-118 · Fecha de vencimiento y tareas vencidas

### Dependencias externas

| Ref. | Qué hace falta | De dónde viene |
|---|---|---|
| **EXT-A** | Que la tarea exista: crearla con título y responsable y verla en la lista | E2-H1 (crear tarea) + E3 (lista, RF-20/21) |
| **EXT-B** | Cambiar de estado y reasignar | E2-H4…H7 |
| **EXT-C** | Filtrar por estado | FS-142 |

### Tickets

| ID | Título | Tipo | Capa | Hereda | Bloqueado por | Talla | Riesgo |
|---|---|---|---|---|---|---|---|
| **FS-118.1** | La tarea admite una fecha de vencimiento opcional | Migración/DB | Migración | CA-2, CA-6, CA-15 | EXT-A | S | 🟢 Bajo |
| **FS-118.2** | El modelo de tarea expone la fecha de vencimiento como «solo día» | Modelo/Dominio | Modelo (backend) | CA-15 | FS-118.1 | S | 🟠 Medio |
| **FS-118.3** | Crear una tarea con fecha de vencimiento opcional y validada | Endpoint/API | Validador + endpoint de creación | CA-1, CA-2, CA-9, CA-12, CA-15 | FS-118.2 | M | 🟠 Medio |
| **FS-118.4** | La lista devuelve la fecha y ninguna otra operación la modifica | Endpoint/API | Transformer + endpoints de lista, estado y reasignación | CA-1, CA-14, CA-17 | FS-118.2, EXT-B | M | 🟠 Medio |
| **FS-118.5** | Regla de «vencida» según el día de quien mira | Modelo/Dominio | Dominio (frontend) | CA-3 a CA-11 | — | S | 🔴 Alto |
| **FS-118.6** | Campo de fecha en el formulario de creación | Frontend | UI + `lib/api.ts` | CA-1, CA-2, CA-12, CA-13, CA-15 | FS-118.3 | M | 🟠 Medio |
| **FS-118.7** | La lista muestra la fecha y la marca de vencida | Frontend | UI | CA-1, CA-10, CA-16, CA-18, CA-19 | FS-118.4, FS-118.5, EXT-C (solo para CA-18) | M | 🟠 Medio |
| **FS-118.8** | Prueba de aceptación de la historia completa | Test | Recorrido de punta a punta | CA-1 a CA-19 | FS-118.6, FS-118.7 | M | 🟢 Bajo |

**Sobre FS-118.5.** La regla vive donde se conoce el día de quien mira, porque lo exige CA-11; no es una decisión de diseño. Si PA-11 se resuelve con una zona horaria común al espacio, la regla puede cambiar de capa y este ticket se rehace.

**El tipo Bug no aparece** porque la historia aún no existe. Solo surgirá a partir de FS-118.8.

### Tallas

Todos los tickets caben en media jornada, que fue la regla al cortarlos. La talla indica cuánto de esa sesión ocupan:

- **S:** una sola capa, poca lógica y nada desconocido. Sobra sesión.
- **M:** varias piezas o varios casos que probar, o alguna incógnita acotada. Ocupa la sesión.
- **L:** no debería existir. Un ticket L incumple la regla de media jornada y hay que partirlo.

| Ticket | En qué se basa la talla | Nota de riesgo |
|---|---|---|
| 118.1 | Un único dato opcional en una tabla. El esquema lo regenera la herramienta. | `database/schema.ts` es generado. Si EXT-A y este ticket migran en ramas paralelas, habrá conflictos en ese fichero. Se resuelven regenerándolo, nunca a mano. |
| 118.2 | Poca lógica: exponer la fecha como «solo día» y contemplar que no haya fecha. | Es el sitio clásico del error de «la fecha se corre un día». Si el valor se trata como fecha con hora y se serializa en otra zona horaria, el 15 se convierte en 14. |
| 118.3 | Validador, endpoint y tests para el camino feliz más tres casos de error o borde. | VineJS 4 y AdonisJS 7 van por delante de la documentación conocida: hay que comprobar en los `.d.ts` cómo se valida una fecha. Si es el primer test funcional del repo, carga con montar el aislamiento de la base de datos, y eso lo llevaría a L. |
| 118.4 | El cambio en el transformer es pequeño. El peso está en los tests de tres operaciones. | Toca endpoints que construye EXT-B. Si no están, o cambian, el ticket se bloquea o hay que rehacerlo. Si EXT-B ya devuelve la tarea con el transformer común, baja a S. |
| 118.5 | Una función pura con una regla de tres condiciones. Lo laborioso son los casos, no el código. | Arrastra dos decisiones abiertas: PA-11 (husos horarios) y PA-16 (no hay runner de tests en el frontend). Si se decide añadir un runner, es un ticket propio; esconderlo aquí convertiría este en L. |
| 118.6 | Campo nuevo, mensajes de error junto al campo y conservar lo introducido si falla otro campo. | El selector de fecha decide el tamaño. El campo de fecha nativo del navegador es lo más barato. Un calendario de shadcn trae componentes nuevos, el idioma y otra vez el riesgo de que la fecha se corra un día. |
| 118.7 | Mostrar la fecha en formato español, una marca accesible y usar la regla de 118.5. | CA-10, el cambio de día con la lista abierta, es sutil: la marca tiene que recalcularse sin recargar. CA-18 depende de FS-142. |
| 118.8 | Son 19 criterios que recorrer a mano, dos de ellos alterando fecha y zona horaria. | Simular otro huso horario es tedioso pero factible con las herramientas de desarrollo del navegador. El riesgo real son los Bugs que destape. |

**Qué podría convertir un ticket en L y obligar a partirlo:**
1. 118.3, si le toca estrenar los tests funcionales del repo.
2. 118.5, si se decide añadir un runner de tests al frontend.
3. 118.6, si se elige un calendario de shadcn en lugar del campo de fecha nativo.

### Definition of Done por tipo

#### Migración/DB (FS-118.1)
- [ ] La migración se crea con `node ace make:migration` y es reversible: se puede deshacer y volver a aplicar.
- [ ] `node ace migration:run` regenera `database/schema.ts`, y ese diff va en el commit. `schema.ts` no se edita a mano.
- [ ] `node ace migration:fresh` funciona sobre una base de datos limpia.
- [ ] Las tareas que ya existían siguen siendo válidas tras migrar: quedan sin fecha (CA-6).
- [ ] `npm run typecheck` y `npm run lint` pasan en `backend/`.

#### Modelo/Dominio

**Backend (FS-118.2)**
- [ ] El modelo extiende la clase generada y no redeclara columnas. Solo añade la lógica necesaria.
- [ ] Hay tests unitarios en `tests/unit/` para el comportamiento «solo día», incluido el caso de que no haya fecha.
- [ ] Typecheck y lint pasan.

**Frontend (FS-118.5)**
- [ ] La regla es una función pura, sin acceso a la API ni a componentes, y recibe el «hoy» como entrada para poder probarla.
- [ ] Cubre, uno por uno, los casos CA-3 a CA-11: futura, pasada, hoy, sin fecha, Hecho, reabierta y cambio de día. CA-11 se prueba con dos «hoy» distintos.
- [ ] ⚠️ **Tests:** el frontend no tiene runner (PA-16). Antes de cerrar el ticket hay que decidir si se añade uno o si los casos quedan como prueba manual documentada.
- [ ] `npm run build` (incluye el typecheck) y `npm run lint` (oxlint) pasan.

#### Endpoint/API (FS-118.3, FS-118.4)
- [ ] La validación usa un validador VineJS en `app/validators/` con `vine.create`, reutilizando los builders que existan.
- [ ] La respuesta pasa por un transformer de `app/transformers/` y por `serialize()`. Nunca se devuelve el modelo crudo.
- [ ] Los errores de validación llegan por campo, de modo que el frontend los traduce a castellano mediante `ApiError.fieldErrors` (CA-12).
- [ ] Solo funciona con sesión iniciada: la ruta está dentro del grupo con `middleware.auth()` (RF-5).
- [ ] Hay tests funcionales en `tests/functional/` con `apiClient`, y los tests aíslan la base de datos con `testUtils.db()` (RNF-10). Cubren el camino feliz y cada criterio de error heredado.
- [ ] En FS-118.4, hay tests que demuestran que cambiar el estado y reasignar la tarea no alteran la fecha (CA-14, CA-17).
- [ ] Los ficheros generados de `.adonisjs/` (controladores y registro Tuyau) están regenerados y en el commit.
- [ ] Typecheck y lint pasan.

#### Frontend (FS-118.6, FS-118.7)
- [ ] Toda llamada nueva a la API va en `src/lib/api.ts`, no en los componentes.
- [ ] Los componentes de shadcn se traen con `npx shadcn@latest add` y no se editan a mano.
- [ ] Los mensajes de error se muestran en castellano junto al campo afectado (CA-12). Un error no borra lo que la persona ya había introducido (CA-13).
- [ ] La marca de vencida tiene texto o etiqueta accesible, no solo color (CA-16).
- [ ] Se comprueba a mano, en el navegador, cada criterio heredado. Los criterios aún [PROPUESTO] se verifican solo si se han aprobado.
- [ ] `npm run build` y `npm run lint` pasan; Prettier se aplica con el hook.

#### Test (FS-118.8)
- [ ] Hay un guion de prueba que recorre CA-1 a CA-19 y anota el resultado de cada criterio.
- [ ] CA-10 (cambio de día) y CA-11 (husos horarios) se reproducen alterando la fecha o la zona horaria del navegador, y el guion explica cómo.
- [ ] Todo fallo encontrado se registra como ticket de tipo **Bug** ligado a FS-118. No se arregla dentro de este ticket.
- [ ] Toda la suite de backend (`npm test`) pasa.

### Grafo de dependencias

```
                 ┌─────────┐
   EXT-A ───────►│ 118.1   │ Migración/DB
  (tareas base)  └────┬────┘
                      ▼
                 ┌─────────┐
                 │ 118.2   │ Modelo/Dominio (backend)
                 └──┬───┬──┘
                    │   │
          ┌─────────┘   └──────────┐
          ▼                        ▼
     ┌─────────┐              ┌─────────┐
     │ 118.3   │ API crear    │ 118.4   │◄──── EXT-B
     └────┬────┘              └────┬────┘     (estado / reasignar)
          ▼                        │
     ┌─────────┐                   │      ┌─────────┐
     │ 118.6   │ UI formulario     │      │ 118.5   │ Dominio (front)
     └────┬────┘                   │      │ (sin    │ regla «vencida»
          │                        ▼      │ deps)   │
          │                   ┌─────────┐ └────┬────┘
          │                   │ 118.7   │◄─────┘
          │                   │ UI lista│◄──── EXT-C (solo para CA-18)
          │                   └────┬────┘
          │                        │
          └──────────┬─────────────┘
                     ▼
                ┌─────────┐
                │ 118.8   │ Test de aceptación
                └─────────┘
```

| Ticket | Lo bloquean | Bloquea a |
|---|---|---|
| 118.1 | EXT-A | 118.2 |
| 118.2 | 118.1 | 118.3, 118.4 |
| 118.3 | 118.2 | 118.6 |
| 118.4 | 118.2, EXT-B | 118.7 |
| 118.5 | — | 118.7 |
| 118.6 | 118.3 | 118.8 |
| 118.7 | 118.4, 118.5, EXT-C (solo para CA-18) | 118.8 |
| 118.8 | 118.6, 118.7 | — |

**Ruta crítica:** EXT-A → 118.1 → 118.2 → 118.4 → 118.7 → 118.8. Es la más larga y además depende de EXT-B, así que cualquier retraso en 118.4 retrasa toda la historia.

### Orden de implementación recomendado

| # | Ticket | Por qué en este punto |
|---|---|---|
| 1 | **118.5** · Regla de «vencida» | No depende de nada y puede empezar antes incluso de que existan las tareas. Obliga a resolver pronto PA-11 y PA-16. |
| 2 | **118.1** · Migración | Es la primera pieza en cuanto exista EXT-A. Todo el backend cuelga de ella. |
| 3 | **118.2** · Modelo | Desbloquea los dos tickets de API a la vez. |
| 4 | **118.3** · API de creación | Va antes que 118.4 porque no depende de EXT-B. Sin tareas con fecha no hay nada que listar ni que probar. |
| 5 | **118.4** · API de lista, sin modificar la fecha | En cuanto esté EXT-B. Si EXT-B se retrasa, adelanta 118.6 a este puesto. |
| 6 | **118.6** · Formulario | Crear tareas con fecha desde la interfaz proporciona los datos con los que se verifica 118.7 a mano. |
| 7 | **118.7** · Lista con marca de vencida | Junta 118.4 y 118.5. Si FS-142 aún no está, se cierra sin CA-18 y ese criterio se verifica después. |
| 8 | **118.8** · Prueba de aceptación | Cierra la historia. Lo que falle se registra como Bug. |

**Trabajo en paralelo con dos personas:**

```
Persona 1 (backend):   118.1 ─► 118.2 ─► 118.3 ─► 118.4 ────────────┐
Persona 2 (frontend):  118.5 ───────────────────► 118.6 ─► 118.7 ─┴─► 118.8
```

### Riesgos que conviene atacar primero

| Riesgo | Afecta a | Cómo se reduce |
|---|---|---|
| Decisiones abiertas PA-11 y PA-16 | 118.5, y en cadena 118.7 | Decidirlas antes de empezar 118.5. |
| La fecha se corre un día | 118.2, 118.6, 118.7 | Tratarla siempre como «solo día» de punta a punta, y añadir un test con una fecha cerca de medianoche en otra zona horaria. |
| Dependencia de otras historias (EXT-A, EXT-B) | 118.1, 118.4 | Planificar antes la historia base de tareas. Hasta entonces, solo 118.5 puede avanzar. |

### A tener en cuenta antes de planificar

- **Criterios [PROPUESTO] sin aprobar:** CA-10, CA-12, CA-13, CA-17, CA-18 y CA-19. Si se rechaza alguno, el ticket que lo hereda se reduce, pero ninguno desaparece.
- **CA-11 depende de PA-11.** Es el criterio con más riesgo de que haya que rehacer FS-118.5 y FS-118.7.
- **EXT-A bloquea toda la historia.** Mientras no existan las tareas, FS-118 solo puede avanzar con FS-118.5.
- **CA-18 es el único criterio que depende de FS-142.** Si FS-142 va después, FS-118.7 se puede cerrar sin CA-18 y verificarlo cuando llegue el filtro.

---

## 2. FS-142 · Filtrar tareas por estado

**No hay ticket de Migración/DB.** Filtrar no cambia lo que se guarda: los tres estados ya los aporta la historia base de tareas.

### Dependencias externas y decisiones pendientes

| Ref. | Qué hace falta | De dónde viene |
|---|---|---|
| **EXT-A** | Que existan las tareas con sus tres estados y la lista del equipo | E2-H1 (crear tarea) + E3 (lista, RF-20/21) |
| **EXT-B** | Poder cambiar el estado de una tarea | E2-H4…H6. Lo necesitan CA-10 y CA-11. |
| **EXT-C** | Que la lista se actualice sola en 10 segundos o menos | E3 (RF-26). Lo necesita CA-11. |
| **EXT-D** | La marca de vencida en la lista | FS-118.7. Lo necesita CA-14. |
| **DEC-1** | Decidir la vista por defecto. RF-23 solo ofrece «un estado» o «todos», pero RF-24 pide «todo menos Hecho». | PA-12. Bloquea CA-15. |
| **DEC-2** | Decidir si «pendiente» en minúsculas o «en-curso» con guion se aceptan o son estados inexistentes | Pregunta abierta de FS-142 |

### Tickets

| ID | Título | Tipo | Capa | Hereda | Bloqueado por |
|---|---|---|---|---|---|
| **FS-142.1** | La lista acepta un filtro opcional por estado y rechaza los estados que no existen | Endpoint/API | Validador + endpoint de lista | CA-1, CA-2, CA-6, CA-7, CA-9 | EXT-A |
| **FS-142.2** | Interpretar el filtro pedido: estado válido, «todas» o estado inexistente | Modelo/Dominio | Dominio (frontend) | CA-6, CA-7, CA-12 | DEC-2 |
| **FS-142.3** | Selector de filtro y lista filtrada en pantalla | Frontend | UI + `lib/api.ts` | CA-1 a CA-5, CA-9, CA-10, CA-13, CA-14 | FS-142.1, EXT-B (solo para CA-10), EXT-D (solo para CA-14) |
| **FS-142.4** | El filtro viaja en la dirección de la página, con aviso si el estado no existe | Frontend | UI (enrutado) | CA-6, CA-7, CA-8, CA-12 | FS-142.2, FS-142.3 |
| **FS-142.5** | Vista por defecto al entrar | Frontend | UI | CA-15 | FS-142.3, **DEC-1** |
| **FS-142.6** | Prueba de aceptación de la historia completa | Test | Recorrido de punta a punta | CA-1 a CA-15 | FS-142.4, FS-142.5, EXT-C (solo para CA-11) |

**Por qué el estado inexistente se valida en dos sitios (FS-142.1 y FS-142.2).** Según CA-6 y la nota de la historia, se puede pedir un estado inexistente por dos caminos: por la dirección de la página (CA-12) y llamando a la lista sin pasar por la interfaz. No es una decisión de diseño: es lo que exige el criterio.

### Definition of Done por tipo

#### Endpoint/API (FS-142.1)
- [ ] El filtro se valida con un validador VineJS en `app/validators/` usando `vine.create`. Los estados válidos se toman de la misma fuente que usa la historia base, sin redefinirlos.
- [ ] Pedir la lista sin filtro sigue devolviendo lo mismo que antes. Hay un test que protege esa regresión.
- [ ] Un estado inexistente produce un **error de validación**, nunca una lista vacía (CA-6). El error trae el detalle necesario para que el frontend lo muestre en castellano a través de `ApiError`.
- [ ] La respuesta pasa por el transformer y por `serialize()`.
- [ ] Solo funciona con sesión iniciada: la ruta está dentro del grupo con `middleware.auth()`.
- [ ] Hay tests funcionales en `tests/functional/` con `apiClient`, y los tests aíslan la base de datos con `testUtils.db()`. Cubren:
  - cada uno de los tres estados;
  - sin filtro;
  - un estado inexistente («Archivado»);
  - «Bloqueado» (CA-7);
  - un estado válido sin tareas, que devuelve una lista vacía y no un error (CA-9).
- [ ] Los ficheros generados de `.adonisjs/` (controladores y registro Tuyau) están regenerados y en el commit.
- [ ] `npm run typecheck` y `npm run lint` pasan.

#### Modelo/Dominio (FS-142.2)
- [ ] Es una función pura, sin acceso a la API ni a componentes. Recibe lo que llega por la dirección de la página y devuelve un estado válido, «todas» o «inexistente».
- [ ] Usa la misma lista de estados válidos que la interfaz, sin duplicar literales.
- [ ] Cubre los tres estados, la ausencia de filtro, un valor inexistente, «Bloqueado» y el caso de DEC-2, con el comportamiento que se haya decidido.
- [ ] ⚠️ **Tests:** el frontend no tiene runner (PA-16). Antes de cerrar el ticket hay que decidir si se añade uno o si los casos quedan como prueba manual documentada.
- [ ] `npm run build` y `npm run lint` (oxlint) pasan.

#### Frontend (FS-142.3, FS-142.4, FS-142.5)
- [ ] Toda llamada nueva a la API va en `src/lib/api.ts`, no en los componentes.
- [ ] Los componentes de shadcn se traen con `npx shadcn@latest add` y no se editan a mano.
- [ ] El filtro activo se distingue sin depender solo del color (CA-5).
- [ ] **FS-142.3:** cambiar el filtro no recarga la página (CA-4). El mensaje de «sin tareas en este estado» (CA-9) es distinto del aviso de error de FS-142.4. El filtro no se guarda en ningún sitio compartido con otras personas (CA-13).
- [ ] **FS-142.4:** el aviso de estado inexistente está en castellano, nombra los tres estados válidos y no deja una lista vacía en pantalla (CA-6). Elegir un estado válido lo hace desaparecer (CA-8).
- [ ] **FS-142.5:** no empieza hasta que se resuelva DEC-1. La decisión tomada queda reflejada en el PRD (RF-23/RF-24) antes de cerrar el ticket.
- [ ] Se comprueba a mano, en el navegador, cada criterio heredado. Los criterios aún [PROPUESTO] se verifican solo si se han aprobado.
- [ ] `npm run build` y `npm run lint` pasan; Prettier se aplica con el hook.

#### Test (FS-142.6)
- [ ] Hay un guion que recorre CA-1 a CA-15 y anota el resultado de cada criterio.
- [ ] CA-11 y CA-13 se prueban con dos sesiones simultáneas de personas distintas.
- [ ] CA-6 y CA-7 se prueban por las dos vías: escribiendo la dirección de la página a mano y llamando a la lista sin pasar por la interfaz.
- [ ] Todo fallo encontrado se registra como ticket de tipo **Bug** ligado a FS-142. No se arregla dentro de este ticket.
- [ ] Toda la suite de backend (`npm test`) pasa.

### Grafo de dependencias

```
EXT-A ─► 142.1 ─► 142.3 ─┬─► 142.4 ─┐
DEC-2 ─► 142.2 ──────────┘          ├─► 142.6
                 142.3 ─► 142.5 ────┘
                 DEC-1 ──┘
```

FS-142.1 y FS-142.2 pueden avanzar en paralelo.

> Para FS-142 no se definieron ni tallas ni un orden de implementación aparte del grafo. Quedan pendientes.

### A tener en cuenta antes de planificar

- **DEC-1 bloquea FS-142.5.** Mientras no se resuelva la contradicción entre RF-23 y RF-24, la historia no se puede cerrar entera.
- **FS-142.4 depende de CA-12, que es [PROPUESTO].** Si CA-12 se rechaza, el estado inexistente solo llegaría por la vía de FS-142.1 y no habría que mostrar el aviso en la interfaz.
- **Criterios [PROPUESTO] sin aprobar:** CA-5, CA-8, CA-10, CA-11, CA-12 y CA-13.
- **CA-11 y CA-14 se verifican con piezas de otras historias:** la frescura de E3 y la marca de vencida de FS-118.7. Si esas piezas llegan más tarde, FS-142.6 puede cerrarse sin esos dos criterios y revisarlos cuando lleguen.

---

## 3. Matriz impacto × complejidad y orden de backlog

Incluye todas las historias de E2, también las que quedaron fuera del MVP, y el sync en tiempo real de E3.

**En qué se basa cada eje:**
- **Impacto:** cuánto acerca al objetivo del MVP, que es cancelar la ronda de «¿en qué estás?» (M-1) y evitar colisiones (JTBD-1).
- **Complejidad:** capas que toca, dependencias de otras historias y decisiones abiertas que arrastra. Cuenta la complejidad de producto, no solo la técnica.

Las dos valoraciones son cualitativas: no hay datos del piloto que las respalden.

### Matriz

```
              │ COMPLEJIDAD BAJA          │ COMPLEJIDAD MEDIA         │ COMPLEJIDAD ALTA
──────────────┼───────────────────────────┼───────────────────────────┼──────────────────────────
              │ ⭐ H4 Pasar a En curso    │ H1 Crear tarea (base)     │ X4 Estado «Bloqueado» ⛔
IMPACTO ALTO  │ ⭐ H5 Marcar Hecho        │ X9 Aviso de conflicto     │
              │ ⭐ X6 «Mis tareas» ⛔     │    al tomar tarea ⛔      │
──────────────┼───────────────────────────┼───────────────────────────┼──────────────────────────
              │ H6 Volver a Pendiente     │ H2 Elegir responsable     │
IMPACTO MEDIO │ X1 Editar título ⛔       │ H7 Reasignar              │
              │ X3 Borrar tarea ⛔        │ FS-118 Fecha y vencidas   │
              │ X5 Notas ⛔               │ FS-142 Filtrar por estado │
──────────────┼───────────────────────────┼───────────────────────────┼──────────────────────────
              │ X2 Cambiar o quitar fecha │                           │ E3 Sync en tiempo real ⛔
IMPACTO BAJO  │    ⛔                     │                           │ X8 Avisos de reasignación ⛔
              │ X7 Tarea sin responsable  │                           │ X10 Estados configurables ⛔
              │    ⛔                     │                           │
```
⭐ = quick win (alto impacto, baja complejidad) · ⛔ = fuera de alcance MVP

### Por qué cada posición

| Historia | Impacto | Complejidad | Motivo |
|---|---|---|---|
| **H1** Crear tarea | Alto | Media | Sin ella no hay producto. Es media porque estrena todo a la vez: migración, modelo, API, interfaz y los primeros tests funcionales del repo. |
| ⭐ **H4** En curso | Alto | Baja | Es la señal que el producto existe para transmitir. Con H1 hecha, solo es un cambio de estado. |
| ⭐ **H5** Hecho | Alto | Baja | Sin ella, la ronda de la daily sigue siendo necesaria para saber qué se terminó. Usa el mismo mecanismo que H4. |
| **H6** Volver a Pendiente | Medio | Baja | Corrige errores y permite reabrir, pero es menos frecuente. Usa el mismo mecanismo. |
| **H2** Elegir responsable | Medio | Media | El responsable por defecto (yo) cubre el caso común. Necesita el listado de miembros de E1 (RF-7), que no existe. |
| **H7** Reasignar | Medio | Media | Es necesaria para «coger lo siguiente». Depende de RF-7 y arrastra el riesgo de PA-7. |
| **FS-118** Fecha y vencidas | Medio | Media | No toca la señal central y no hay nadie a quien reportar. Son 8 tickets, con el riesgo de los husos horarios (PA-11). |
| **FS-142** Filtrar por estado | Medio | Media | Ayuda a centrarse en lo pendiente, pero con 3–10 personas la lista ya cabe en pantalla. Son 6 tickets, con DEC-1 abierta. |
| ⭐ **X6** «Mis tareas» ⛔ | Alto | Baja | Es lo único que cumple JTBD-4 y sostiene el incentivo de quien escribe el estado (PA-8). Una vez hecha FS-142, añadir otro filtro es poco trabajo. |
| **X9** Aviso de conflicto ⛔ | Alto | Media | Protege el escenario de colisión, que es la razón de ser del producto (PA-7). Exige detectar que la tarea cambió desde que la viste. |
| **X4** «Bloqueado» ⛔ | Alto | Alta | Ataca la otra mitad de la daily. Añadir el estado es fácil; lo complejo es el producto (quién desbloquea y cómo se entera), sin descubrimiento previo. |
| **X1** Editar título ⛔ | Medio | Baja | Evita el workaround de «Hecho y recrear» que ensucia el estado (PA-10). El PRD ya la señala como lo primero en volver. |
| **X3** Borrar tarea ⛔ | Medio | Baja | El mismo motivo que X1 (PA-10). |
| **X5** Notas ⛔ | Medio | Baja | Reduce la convivencia con otra herramienta (PA-5), aunque aumenta la fricción al crear. |
| **X2** Cambiar o quitar fecha ⛔ | Bajo | Baja | La fecha es secundaria y el workaround es raro de necesitar. |
| **X7** Tarea sin responsable ⛔ | Bajo | Baja | Contradice una decisión ya tomada: el responsable es obligatorio. |
| **E3** Sync en tiempo real ⛔ | Bajo | Alta | El PRD dice que 5–10 segundos bastan: las colisiones vienen de no actualizar a tiempo, no de la latencia. Exige infraestructura nueva. |
| **X8** Avisos de reasignación ⛔ | Bajo | Alta | Va contra el principio de «esperar, no interrumpir» y necesita un sistema de notificaciones. |
| **X10** Estados configurables ⛔ | Bajo | Alta | Es la anti-meta del producto («menos rollo que Jira»). |

### Quick wins

| Quick win | Estado |
|---|---|
| **H4** En curso | ✅ Dentro del MVP. Va primero tras H1. |
| **H5** Hecho | ✅ Dentro del MVP. |
| **X6** «Mis tareas» | ⛔ **Fuera de alcance MVP.** Es un quick win, pero meterlo exige resolver PA-8 y reabrir el alcance. |

### Orden de backlog priorizado

#### Dentro del MVP

| # | Historia | Motivo del puesto |
|---|---|---|
| 0 | *Lista del equipo (E3, RF-20/21) sin tiempo real* | No es de E2, pero todas las historias de E2 la necesitan. Va junto con H1. |
| 1 | **H1** Crear tarea | Desbloquea todo lo demás. |
| 2 | ⭐ **H4** En curso | Quick win, y es la señal núcleo del producto. |
| 3 | ⭐ **H5** Hecho | Quick win. Con H1, H4 y H5 ya se puede probar M-1 en una versión mínima. |
| 4 | **H6** Volver a Pendiente | Es barata, con el mecanismo ya hecho. Completa los tres estados. |
| 5 | **H2** Elegir responsable | Necesita RF-7 de E1. |
| 6 | **H7** Reasignar | Reutiliza RF-7. Hay que decidir PA-7 antes de cerrarla. |
| 7 | **FS-142** Filtrar por estado | Va antes que FS-118 porque FS-118.7 la necesita para CA-18. Resolver DEC-1 primero. |
| 8 | **FS-118** Fecha y vencidas | El ticket FS-118.5 puede adelantarse en paralelo en cualquier momento. |

#### Después del MVP, solo si se reabre el punto abierto correspondiente

| # | Historia | Requisito para entrar |
|---|---|---|
| 9 | ⭐ **X6** «Mis tareas» | Resolver PA-8. Es el candidato más barato y con más impacto. |
| 10 | **X9** Aviso de conflicto | Resolver PA-7. Protege el caso de colisión. |
| 11 | **X1** Editar título + **X3** Borrar | Resolver PA-10, y que el piloto confirme que el workaround molesta. |
| 12 | **X5** Notas | Resolver PA-5, con datos de qué contexto usa el equipo en sus tareas. |
| 13 | **X4** «Bloqueado» | Requiere descubrimiento de producto propio: es la siguiente gran apuesta, no un añadido. |
| 14 | **X2** Cambiar o quitar fecha | Solo si el piloto lo pide. |
| 15 | **E3** Sync en tiempo real | Solo si el piloto demuestra que 10 segundos no bastan (M-4). |

#### Descartadas

- **X7** Tarea sin responsable: contradice una decisión ya tomada.
- **X8** Avisos de reasignación: va contra el principio de no interrumpir.
- **X10** Estados configurables: es la anti-meta del producto.

### Observaciones

- **FS-118 y FS-142, las dos historias ya refinadas, están en la parte de impacto medio.** Las prioridades de producto las dejaron dentro del alcance, pero en esta matriz ninguna es la que más acerca al objetivo. Si hay que recortar plazo, son las primeras candidatas a ir al final del MVP.
- **Las tres historias de fuera de alcance con impacto alto (X6, X9 y X4) responden a puntos abiertos del PRD (PA-8, PA-7) o a lo que el MVP declara no resuelto.** Es una señal de que esos puntos abiertos no son detalles menores.

### Referencia: historias de E2

| ID | Historia | Alcance |
|---|---|---|
| E2-H1 | Crear una tarea escribiendo solo su título | MVP |
| E2-H2 | Elegir otro miembro como responsable al crear | MVP |
| E2-H3 + E2-H8 | → **FS-118** Fecha de vencimiento y tareas vencidas | MVP |
| E2-H4 | Pasar una tarea a «En curso» | MVP |
| E2-H5 | Marcar una tarea como «Hecho» | MVP |
| E2-H6 | Devolver una tarea a «Pendiente» | MVP |
| E2-H7 | Reasignar el responsable | MVP |
| E2-H9 | → **FS-142** Filtrar tareas por estado | MVP |
| E2-X1 | Editar el título | Fuera |
| E2-X2 | Cambiar o quitar la fecha de vencimiento | Fuera |
| E2-X3 | Borrar o descartar una tarea | Fuera |
| E2-X4 | Estado «Bloqueado» | Fuera |
| E2-X5 | Descripción o notas | Fuera |
| E2-X6 | Filtrar por responsable / «mis tareas» | Fuera |
| E2-X7 | Crear tarea sin responsable | Fuera |
| E2-X8 | Aviso al ser reasignado | Fuera |
| E2-X9 | Aviso de conflicto al tomar una tarea | Fuera |
| E2-X10 | Estados configurables | Fuera |
