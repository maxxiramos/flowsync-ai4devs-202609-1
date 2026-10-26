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
Lee los scenarios de `openspec/specs/tasks/spec.md` y los tests que haya en `backend/tests/`.
Genera una tabla de trazabilidad: cada scenario → qué prueba lo cubre → cubierto / NO cubierto. Cuenta cuántos scenarios hay en total y cuántos están cubiertos, y ponlo arriba. No cambies ningún archivo: esto es una lectura, no un arreglo.
```

**Qué salió:** 

---

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Limita la tabla de trazabilidad anterior solo al requisito «Lo que cada tarea muestra de su responsable» de `openspec/specs/tasks/spec.md`.
Vuelve a realizar el conteo de cuántos scenarios hay en total y cuántos están cubiertos, y ponlo arriba. 
No cambies ningún archivo: esto es una lectura, no un arreglo.
```

**Qué salió:** 

---

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Transcribe dicha tabla de trazabilidad al archivo `docs/verificacion/CMR.md`.
No realices ningun Commit, ni PR. Solo crea el archivo.
```

**Qué salió:** Tuve que editarlo a mano, para agregar al columna "_Qué te faltó_".

---

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Escribe los tests de integración que faltan para el requisito «Lo que cada tarea muestra de su responsable» de `openspec/specs/tasks/spec.md`: uno por cada scenario, en `backend/tests/functional/tasks/`. Sigue el estilo de los que ya existen en `backend/tests/functional/auth/`.
No toques nada fuera de `backend/tests/`: si algún test falla, déjalo fallando, que hoy queremos saber qué está mal, no taparlo.
No realices ningun Commit, ni PR. Solo crea los tests.
```

**Qué salió:** 

---

