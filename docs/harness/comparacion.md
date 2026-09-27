# Comparacion

## Parte A

### 1. Qué archivos tocó, contados:

**Con harness**
Modifico 28 archivos
   1. frontend/src/assets/hero.png
   2. frontend/src/assets/react.svg
   3. frontend/src/assets/vite.svg
   4. frontend/src/auth/auth-context.ts
   5. frontend/src/auth/AuthProvider.tsx
   6. frontend/src/auth/guards.tsx
   7. frontend/src/components/ui/alert.tsx
   8. frontend/src/components/ui/button.tsx
   9. frontend/src/components/ui/card.tsx
   10. frontend/src/components/ui/input.tsx
   11. frontend/src/components/ui/label.tsx
   12. frontend/src/components/AuthCard.tsx
   13. frontend/src/lib/api.ts
   14. frontend/src/lib/auth-errors.ts
   15. frontend/src/lib/utils.ts
   16. frontend/src/pages/LoginPage.tsx
   17. frontend/src/pages/ProfilePage.tsx
   18. frontend/src/pages/SignupPage.tsx
   19. frontend/src/App.css
   20. frontend/src/App.tsx
   21. frontend/src/index.css
   22. frontend/components.json
   23. frontend/index.html
   24. frontend/package-lock.json
   25. frontend/package.json
   26. frontend/tsconfig.app.json
   27. frontend/tsconfig.json
   28. frontend/vite.config.ts
	
**Sin harness**
Modifico 39 archivos
A pesar de decir que no tocó el backend, hay archivos modificados.


### 2. Qué convenciones del proyecto respetó y cuáles no, nombrándolas una a una. Si en un lado no había ninguna escrita en ninguna parte, esa es la respuesta y vale.
**Con harness**
   - Se mantuvo sin modificar el backend.
   - Al momento de solicitarle la creacion del hook, creó una nueva rama.
   - Al empezar a implementar, creo una nueva rama `feat/flow-1-login`. Sobre esta realizo el commit y la solicitud del PR.
   - Ejecuto realmente el subagente `adversarial-reviewer`.
   - A pesar de que no tenia la extension de Claude Code de Chrome, no sé como hizo para generar los gif solicitados en los tests.
   - NO llego a notar si no cumplio algo de lo solicitado.

**Sin harness**
   - Se mantuvo en el rama `s1/start` en todo momento. 
   - No habia convenciones, de hecho trato de respetar las que se mencionaban en el README.md original del repo.

### 3. Cuántas veces tuviste que intervenir: corregir, aclarar, repetir el encargo o pararlo en seco.
**Con harness**
Tuve que inervenir indicnadole que ejecute el plan. Luego se ejecuto de corrido.

**Sin harness**
Se interrumpio luego del 1º promt, luego del cual tuve que agregar el archivo `.mcp.json`. Luego de reuniciar Claude, volví a reiterar el promp inicial.
Luego de ello, tuve que indicale que trabaje sobre la misma rama.
Finalmente, que ejecute el plan indicado.

### 4. Qué te tocaría arreglar a mano antes de enseñarle eso a alguien de tu equipo.
**Con harness**
   - Tomar mayor conciencia de la implementación que hizo para poder explicarla.
   - Armar una explicacion del harness creado, de forma que entienda los archivos y su proposito.
   - Luego lo creado por Cluade, es extremadamente bueno, sobre todo la documentacion y comentarios realizados en los commit sobre GitHub.

**Sin harness**
   - Tomar mayor conciencia de la implementación que hizo para poder explicarla.
   - Revisar que toco del backend.


---

## Parte B: las tres líneas

### 1. Qué piezas montaste y cuál te costó más de lo que esperabas. Los nombres tal cual, y en qué se te fue el rato de verdad.

	- Sin ninguna duda me costo más el configurar las herramientas y todo el entorno, es decir el configuration management. 
	- El hacer la similitud entre trabajar en una PC con Windows y lo mostrado en la sesion en vivo en una Apple Mac.
	- Tambien me llevó tiempo refrescar el volver a la tarea de codificar o volver a un IDE para dicha tarea.
	- Para el harness monte los siguientes archivos:
		- CLAUDE.md
		- .mcp.json
		- settings.local.json
		- Agente: adversarial-reviewer
		- Hook: format-frontend.mjs (que llevo a crear el archivo `settings.json`)
		- Skills:
    		- commit
    		- priority-ticket
  		- Archivo `AGENTS.md`.

### 2. La primera diferencia que viste entre las dos salidas, y en qué te fijaste para verla. Ojo, no cuál fue mejor: qué salió distinto, concretamente, y dónde estabas mirando cuando lo notaste. Si tuviste que abrir un archivo para verlo, dilo.

El primer punto evidente ya fue desde lo descrito por el mismo Claude Code en su salida en el proyecto **sin harness**: "_No he hecho commit ni tocado el ticket en Jira_".
Lo segundo fue la difenrencia en la implementacion realizada, evidenciada inicialmente por la cantidad de archivos modificados/generados.


### 3. Algo que dejaste escrito en el harness y que el agente no cumplió igualmente.

No pude detectar nada.
