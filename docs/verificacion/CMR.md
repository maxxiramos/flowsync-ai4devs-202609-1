# Trazabilidad: «Lo que cada tarea muestra de su responsable»

Requisito: `openspec/specs/tasks/spec.md:97-114`

**Total: 3 scenarios · Cubiertos: 0 de 3 (0 %)**

|  Scenario | Prueba que lo cubre | Estado | Qué te faltó
|---|---|---|---|
| Responsable identificable (`spec.md:101`) | - | NO cubierto | -
| La tarea no filtra datos de cuenta (`spec.md:106`) | - | NO cubierto | - 
| Responsable sin nombre (`spec.md:111`) | - | NO cubierto | - 

En `backend/tests/` solo hay cuatro ficheros, todos en `functional/auth/` (signup, login, session, initials). Ningún test llama a una ruta de tareas: buscar `tasks` y `assignee` en todo `backend/tests/` no da ningún resultado. Hay tests de auth que tocan lo mismo (cómo se calculan las iniciales, una cuenta sin nombre), pero comprueban la respuesta de auth, no lo que devuelve una tarea. Por eso ninguno cuenta como cobertura.

---


# Parte B: las 3 líneas

1. Scenarios cubiertos vs. no cubiertos:
   1. Scenarios que creía cubiertos antes de mirar: 	3
   2. Scenarios que realmente estaban cubiertos:		0

2. Scenario en el que no supe si faltaba un test o faltaba la regla en la spec: 
   
	Dudé en el segundo scenario (si el mismo estaba bien epecificado ya que no aclaraba como dar las "iniciales") y tuve que lee `openspec\specs\auth\spec.md`.
	Luego saber si estaban o faltabas los tests para el requisito «Lo que cada tarea muestra de su responsable» fue facil (o solo consideré) ya que todos estaban desarrollados en `functional/auth/`. Además el mismo agente me permitió verificar que ningún test llama a una ruta de tareas (como se menciona más arriba).

3. Algo que el scenario no determinaba: 
   
	Cómo mencioné en el punto anterior, dudé de si el 2º scenario estaba bien definido. Eso me llevo a realizar una busqueda (la realice manual) a ver si estaba escrito en algun lado la regla que determina las "iniciales". La misma, si bien no estaba en el scenario puntual, sí lo estaba en la spec de Auth (`openspec\specs\auth\spec.md`).
