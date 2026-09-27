# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este repo

FlowSync: proyecto de ejercicio del máster (módulo de harness engineering). Monorepo TypeScript de punta a punta con dos apps independientes, cada una con su propio `package.json` y `node_modules` (no hay workspace raíz):

- `backend/`: API en **AdonisJS 7** (Lucid ORM sobre SQLite, VineJS, auth por access tokens). En esta sesión **ya existe y no se modifica**: se lee para saber qué exige la API.
- `frontend/`: **React 19 + Vite 8**, todavía la plantilla por defecto de Vite. Aquí es donde se trabaja. El curso usa **shadcn/ui** (componentes copiados al repo, no dependencia), aún no instalado.

`README.md` es el enunciado del ejercicio (generado, no se edita a mano). `prompts.md` es la plantilla donde el alumno pega sus prompts; no la reescribas.

Requiere **Node.js 24+** (con Node 20 falla con `Unknown file extension ".ts"`).

## Comandos

Backend (desde `backend/`):

```bash
npm install
cp .env.example .env && node ace generate:key   # primera vez
node ace migration:run                          # crea tmp/db.sqlite3 y regenera database/schema.ts
npm run dev          # node ace serve --hmr → http://localhost:3333
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run format       # prettier (@adonisjs/prettier-config)
npm test             # node ace test (Japa)
node ace test functional                       # una suite (unit | functional)
node ace test --files=tests/functional/x.spec.ts   # un solo archivo
node ace test --tests="nombre del test"            # un solo test
```

Los tests van en `tests/unit/**/*.spec.ts` y `tests/functional/**/*.spec.ts` (configurado en `adonisrc.ts`); de momento solo existe `tests/bootstrap.ts`.

Frontend (desde `frontend/`, en otra terminal):

```bash
npm install
npm run dev       # Vite → http://localhost:5173
npm run build     # tsc -b && vite build (el typecheck va aquí)
npm run lint      # oxlint (.oxlintrc.json)
npm run format    # prettier --write . (.prettierrc.json: sin punto y coma, comillas simples)
```

El frontend no tiene tests configurados. Un hook `PostToolUse` (`.claude/settings.json` → `.claude/hooks/format-frontend.mjs`) pasa Prettier sobre cada archivo de `frontend/` que Claude edita o escribe; los que ya existían aún no se han formateado en bloque.

## Arquitectura del backend

Flujo de una petición: `start/routes.ts` → controlador (`app/controllers`) → validador VineJS (`app/validators`) → modelo Lucid (`app/models`) → transformer (`app/transformers`) → `ctx.serialize(...)`.

- **Rutas** (`start/routes.ts`), todas bajo `/api/v1`:
  - `POST auth/signup` → `NewAccountController.store`
  - `POST auth/login` → `AccessTokensController.store`
  - `GET account/profile` → `ProfileController.show` (middleware `auth`)
  - `POST account/logout` → `AccessTokensController.destroy` (middleware `auth`)
- Los controladores se referencian vía `controllers.X` de `#generated/controllers`, no importándolos a mano.
- **Código generado** en `backend/.adonisjs/` (controladores, registry de rutas tipado de Tuyau, eventos) lo producen los hooks `indexEntities` y `generateRegistry` de `adonisrc.ts` al arrancar/compilar. `database/schema.ts` lo genera `migration:run` a partir de las migraciones. No se editan a mano; los modelos extienden esas clases (`User extends compose(UserSchema, withAuthFinder(hash))`).
- Los cambios de esquema van siempre en una migración nueva en `database/migrations/`.
- **Imports** con subpath imports de Node (`#models/*`, `#validators/*`, `#controllers/*`…, definidos en `backend/package.json`), con extensión `.js` resuelta.
- **Respuestas**: `providers/api_provider.ts` añade `ctx.serialize()`, que envuelve todo en `{ data: ... }`. Un middleware global fuerza `Accept: application/json`, así que los errores también salen en JSON.
- **Auth**: guard por defecto `api` (access tokens opacos con prefijo `oat_`, tabla `auth_access_tokens`). El cliente envía `Authorization: Bearer <token>`. Existe también un guard `web` de sesión, no usado por las rutas.
- **CORS**: en desarrollo acepta cualquier origen (`config/cors.ts`); en producción la lista está vacía.

### Contrato de auth que el frontend debe respetar

Definido en `app/validators/user.ts`; el enunciado del ticket no lo detalla todo:

- **signup** body: `email` (email válido, máx. 254, **único**), `password` (8–32 caracteres), `passwordConfirmation` (**obligatorio**, igual a `password`), `fullName` (opcional/nullable).
- **login** body: `email`, `password`.
- Signup y login responden `{ data: { user, token } }`; `user` = `id, fullName, email, createdAt, updatedAt, initials` (nunca el hash).
- Profile responde `{ data: user }`.
- Los errores de validación (p. ej. email ya registrado) vuelven como 422 con `errors: [{ field, message, rule }]`; credenciales inválidas en login lanzan `E_INVALID_CREDENTIALS`.

## Frontend

`src/main.tsx` monta `App.tsx` (plantilla de Vite). Sin router, sin cliente HTTP, sin Tailwind/shadcn todavía. TypeScript estricto con `verbatimModuleSyntax` y `noUnusedLocals/Parameters` (usa `import type` para tipos). La URL del backend en local es `http://localhost:3333`.


## Reglas de proceso
- Antes de tocar código: crear una rama nueva (`git checkout -b feat/<slug>`). Nunca commitear directo en `main`/`s1/start`.
- Al cerrar la tarea: usar la skill `/commit`, luego `gh pr create` con una descripción completa de los cambios en el cuerpo del PR.
- Después de abrir el PR: usar el subagente `adversarial-reviewer` sobre él, antes de darlo por terminado.
- No repitas ese resumen en el chat: la sesión se va a perder, el PR no. Responde solo con la URL del PR.
- Ejecuta pruebas e2e usando la extension de Chrome, y finaliza agregando un gif del recorrido en un nuevo comentario del PR de GitHub.