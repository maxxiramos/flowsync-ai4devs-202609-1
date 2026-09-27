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

## En el repo con harness

### Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
/init in spanish
```

**Qué salió:** tuve que insistir cerrando Claude y reabriendolo. Por lo cual el promt fue ejecutado 2 veces. La 1º creo la carpeta `.claude`, en la segunda creó el archivo `CLAUDE.md`.

### Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
claude mcp add --transport http --scope project atlassian https://mcp.atlassian.com/v1/mcp/authv2
```

**Qué salió:** funcionó a la primera, creo el archivo .mcp.json con la configuracion mcp de Atlassian.

### Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Configura un hook que corra el formateador del frontend cada vez que se edite un archivo.
```

**Qué salió:** creo el archivo `settings.json`.

### Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
/priority-ticket
```

---


## En el repo sin harness

### Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Este es el ejemplo. Bórralo.

El prompt va aquí dentro, entero y con sus saltos de línea,
para que se sepa dónde empieza y dónde acaba.
```

**Qué salió:** (opcional, una línea) funcionó a la primera / tuve que insistir / me inventó una ruta que no existe.


### Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Busca en Jira el ticket de mayor prioridad asignado a mí, resume sus criterios de aceptación, y entra en plan mode para implementarlo.
```

**Qué salió:** no funcionó a la primera, ya que no pudo conectarse a jira. Tuve que al igual del en vivo, copiar el archivo `.mcp.json`.
.

### Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Busca en Jira el ticket de mayor prioridad asignado a mí, resume sus criterios de aceptación, y entra en plan mode para implementarlo.
```

**Qué salió:** Ofrecio un plan, pero advirtió que no tenia un harness amando que este directoria tenia la copia limpia. Igualmente mande a ejecutar el plan.

### Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Sí, implementalo.
```

**Qué salió:** Ofrecio un plan, pero advirtió que no tenia un harness amando que este directoria tenia la copia limpia. Igualmente mande a ejecutar el plan.

