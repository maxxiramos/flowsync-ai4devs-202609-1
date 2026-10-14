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
Vamos a documentar como spec de OpenSpec la capability que YA existe en este proyecto: la de Cuentas y Acceso (registro, inicio de sesión, sesión y perfil). Esto es ingeniería inversa: leer el código y escribir lo que hace HOY, no proponer nada nuevo ni cambiar una línea.
1. Explora el vertical de autenticación COMPLETO, en las dos capas. En `backend/`: sus controladores, el modelo de usuario, sus validadores, sus rutas y sus middlewares. En `frontend/`: las pantallas de acceso, el estado de sesión y la protección de rutas. Ignora todo lo que no sea autenticación.
2. Escribe `docs/spec-viva/CMR.md` con el formato exacto de una spec VIVA de OpenSpec: un `## Purpose` de una o dos frases, y debajo `## Requirements`, con `### Requirement:` en los que el sistema SHALL hacer algo, y bajo cada uno al menos un `#### Scenario:` de cuatro almohadillas con sus dos viñetas `- **WHEN**` y `- **THEN**`. En castellano, salvo las mayúsculas RFC-2119. No hay casilla para el GIVEN: la precondición se mete dentro del WHEN.
3. NO uses secciones ADDED, MODIFIED ni REMOVED: eso es de un delta, y esto no es un delta, es la verdad actual del sistema.
4. Describe solo comportamiento observable desde fuera. Nada de nombres de clase ni de rutas de archivo. Para el backend, observable = la petición y la respuesta HTTP. Para el frontend, observable = lo que una persona ve y puede hacer en pantalla.
5. Al terminar, dime qué comportamiento del código NO has podido expresar como requisito, y por qué.
No generes ninguna rama, ni realices commits ni PR.
```

**Qué salió:** Salio funcionando de primera.

---

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Cuantos "Requirement" has podido documentar?
```

**Qué salió:** Salio funcionando de primera.

---

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Donde esta el código que responde al requisito 1. Registro de cuenta?
```

**Qué salió:**  Funcionó a la primera.

---

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Donde esta el código que responde al requisito 2. Validación del registro?
```

**Qué salió:**  Funcionó a la primera.

---

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Donde esta el código que responde al requisito 3. Inicio de sesión?
```

**Qué salió:**  Funcionó a la primera.

---

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Donde esta el código que responde al requisito 4. Rechazo de credenciales inválidas?
		
```

**Qué salió:** Funcionó a la primera. 

---

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Donde esta el código que responde al requisito 5. Validación del inicio de sesión?
```

**Qué salió:** Funcionó a la primera.

---

## Prompt 8

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Donde esta el código que responde al requisito 6. Consulta del perfil propio?
```

**Qué salió:** Funcionó a la primera.

---

## Prompt 9

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Donde esta el código que responde al requisito 7. Iniciales del usuario?
```

**Qué salió:** Funcionó a la primera

---

## Prompt 10

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Ponte en el rol de un revisor de Requerimientos. Lee `docs/spec-viva/CMR.md` he indica posibles incoherencias que aparecen en dicho documento de spec. Una línea cada una, con dónde se ve.
```

**Qué salió:**  Funcionó a la primera.