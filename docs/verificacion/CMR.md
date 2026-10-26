# Trazabilidad: «Lo que cada tarea muestra de su responsable»

Requisito de `openspec/specs/tasks/spec.md` cruzado con los tests de `backend/tests/`.

**Total: 3 scenarios · Cubiertos: 0 · NO cubiertos: 3 (0 %)**

| # | Scenario | Test que lo cubre | Estado |
|---|---|---|---|
| 1 | Responsable identificable: el `assignee` trae el nombre «Ada Lovelace» y sus iniciales | — | NO cubierto |
| 2 | La tarea no filtra datos de cuenta: el `assignee` no trae el email ni ningún otro dato de acceso, ni en una tarea suelta ni en la lista | — | NO cubierto |
| 3 | Responsable sin nombre: el nombre llega nulo y las iniciales siguen llegando | — | NO cubierto |

## Tests que se parecen pero no cubren estos scenarios

- `backend/tests/functional/auth/initials.spec.ts`: tiene los casos «Ada Lovelace» → `AL` y «sin nombre» → iniciales sacadas del email, pero lee `data.user.initials` en la respuesta de `POST /api/v1/auth/login`, no el `assignee` de una tarea. Comprueba la regla que calcula las iniciales, no lo que devuelve una tarea.
- `backend/tests/functional/auth/signup.spec.ts` («una cuenta puede quedarse sin nombre», «la contraseña nunca sale en la respuesta»): tratan de la cuenta en el registro, no del responsable de una tarea.

Ningún test llama a `/api/v1/tasks`, así que ninguno de los tres scenarios tiene cobertura.
