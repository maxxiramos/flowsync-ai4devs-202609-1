# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este repo

FlowSync es el proyecto de un ejercicio de curso (módulo "harness"): un monorepo TypeScript de punta a punta con dos apps independientes, cada una con su propio `package.json` y `node_modules` (no hay workspace raíz):

- `backend/`: API en **AdonisJS 7** (Lucid ORM sobre SQLite, VineJS, auth por access tokens). **Ya está hecho y, en este ejercicio, no se modifica**: se lee para saber qué exige la API.
- `frontend/`: **React 19 + Vite 8**. Es donde se trabaja. Ahora mismo es la plantilla de Vite (`src/App.tsx`), sin router, sin Tailwind y sin shadcn/ui. El curso prevé usar shadcn/ui (componentes copiados al repo, no una dependencia).

`README.md` es la lección del ejercicio, generada desde fuera (no se edita a mano). `prompts.md` es la plantilla donde el alumno pega sus prompts tal cual los lanzó.

Requisito: **Node.js 24+** (con Node 20 el backend falla con `Unknown file extension ".ts"`).

## Comandos

Backend (`cd backend`), sirve en `http://localhost:3333`:

```bash
npm install
cp .env.example .env && node ace generate:key   # solo la primera vez
node ace migration:run                           # crea tmp/db.sqlite3 y regenera database/schema.ts
npm run dev          # node ace serve --hmr
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run format       # prettier (@adonisjs/prettier-config)
npm test             # node ace test (Japa)
node ace test functional            # una sola suite (unit | functional)
node ace test --files=tests/functional/auth.spec.ts   # un solo archivo
node ace test --tests="nombre del test"               # un solo test por título
```

Las suites están definidas en `adonisrc.ts`: `tests/unit/**/*.spec.ts` y `tests/functional/**/*.spec.ts` (hoy no hay ningún test escrito, solo `tests/bootstrap.ts`). Los tests usan `.env.test`.

Frontend (`cd frontend`), sirve en `http://localhost:5173`:

```bash
npm install
npm run dev
npm run build        # tsc -b && vite build (es también el type-check)
npm run lint         # oxlint
```

El frontend no tiene formateador ni tests configurados.

## Arquitectura del backend

Flujo de una petición: `start/routes.ts` → middleware (`start/kernel.ts`) → controlador (`app/controllers`) → validador VineJS (`app/validators`) → modelo Lucid (`app/models`) → transformer (`app/transformers`) → `ctx.serialize()`.

- **Rutas** (todas bajo `/api/v1`):
  - `POST /auth/signup` → `NewAccountController.store`
  - `POST /auth/login` → `AccessTokensController.store`
  - `GET /account/profile` → `ProfileController.show` (requiere auth)
  - `POST /account/logout` → `AccessTokensController.destroy` (requiere auth)
- Los controladores se referencian vía `controllers` de `#generated/controllers`, que junto con el resto de `.adonisjs/` lo **genera** el framework (hooks `indexEntities` y `generateRegistry` de Tuyau en `adonisrc.ts`). No editar `.adonisjs/` a mano; se regenera al arrancar `npm run dev`.
- `database/schema.ts` también es **generado** desde las migraciones (`node ace migration:run`); los modelos extienden esas clases (`User extends compose(UserSchema, withAuthFinder(hash))`). Los cambios de esquema van siempre en una migración nueva en `database/migrations/`.
- Imports con alias de subpath (`#models/*`, `#validators/*`, `#controllers/*`, etc.) definidos en `backend/package.json` `imports`.
- `providers/api_provider.ts` añade `ctx.serialize()`, que **envuelve toda respuesta en `{ data: ... }`**. `ForceJsonResponseMiddleware` fuerza respuestas JSON (incluidos los errores).
- Auth: guard por defecto `api` = access tokens opacos en BD (tabla `auth_access_tokens`), con prefijo `oat_`. Se envían como `Authorization: Bearer <token>`. Existe también un guard `web` de sesión, no usado por las rutas.
- CORS: en desarrollo acepta cualquier origen (`config/cors.ts`), así que el frontend puede llamar directamente a `http://localhost:3333`; no hay proxy en `vite.config.ts`.

### Contrato de la API que el frontend debe respetar

Definido en `app/validators/user.ts` y los controladores; los tickets de producto no siempre lo detallan:

- **Signup** body: `email` (email, máx. 254, único), `password` (8–32 caracteres), **`passwordConfirmation`** (obligatorio, igual a `password`) y `fullName` (opcional/nullable).
- **Login** body: `email`, `password`.
- Signup y login responden `{ data: { user, token } }`; profile responde `{ data: user }`. `user` = `id, fullName, email, createdAt, updatedAt, initials` (nunca el password).
- Errores de validación (p. ej. email ya registrado) → 422 con `{ errors: [{ field, rule, message }] }`. Credenciales inválidas en login → error `E_INVALID_CREDENTIALS` con `{ errors: [{ message }] }`.
