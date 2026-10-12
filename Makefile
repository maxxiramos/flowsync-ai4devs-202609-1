# FlowSync — atajos de desarrollo (Windows nativo, PowerShell).
#
# Requisitos: Node.js + npm y GNU Make.
#   - Windows:  winget install ezwinports.make   (o: choco install make)
#
# Las recetas se ejecutan con Windows PowerShell 5.1, que viene con Windows.
# En macOS, Linux o WSL usa la versión POSIX: make -f Makefile.linux <target>

SHELL := powershell.exe
.SHELLFLAGS := -NoProfile -ExecutionPolicy Bypass -Command

# Cómo se escriben las recetas, y por qué:
#
#   - .ONESHELL no sirve: en Windows, GNU Make vuelca la receta a un .bat y la
#     ejecuta con cmd.exe, ignorando SHELL.
#   - Las continuaciones `\` tampoco: Make se las pasa tal cual a PowerShell,
#     que no las entiende.
#
# Así que cada script de varias líneas va en un `define` y se aplana con
# $(call ps,...), que cambia los saltos de línea por espacios. Por eso cada
# sentencia termina en `;` (salvo las que acaban en `{` o `}` de un bloque).
#
# Los textos que se imprimen van sin tildes ni emojis: Make lanza PowerShell
# con CreateProcess en la página de códigos ANSI y los caracteres no ASCII
# llegan corruptos a la consola.
define NL


endef
ps = $(subst $(NL), ,$(1))

BACKEND  := backend
FRONTEND := frontend

.DEFAULT_GOAL := help
.PHONY: help setup start install env migrate clean

# La ayuda se genera a partir de los comentarios `## ...` de cada target, para
# que no haya un segundo listado que mantener a mano y que pueda divergir.
define PS_HELP
Write-Host 'FlowSync - targets disponibles:';
Write-Host '';
Select-String -Path '$(firstword $(MAKEFILE_LIST))' -Pattern '^([a-zA-Z_-]+):.*## (.*)$$' |
  ForEach-Object { '  make {0,-8} {1}' -f $$_.Matches[0].Groups[1].Value, $$_.Matches[0].Groups[2].Value };
Write-Host '';
endef

help: ## Muestra esta ayuda
	@$(call ps,$(PS_HELP))

# ---------------------------------------------------------------------------
# setup
# ---------------------------------------------------------------------------

setup: install env migrate ## Deja el proyecto listo para arrancar
	@Write-Host ''; Write-Host '[OK] Setup completado. Arranca todo con: make start'

define PS_INSTALL
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Host '[ERROR] Node.js no esta instalado.'; exit 1 }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { Write-Host '[ERROR] npm no esta instalado.'; exit 1 }
Write-Host '[npm] Instalando dependencias del backend...';
Push-Location '$(BACKEND)'; npm install; $$code = $$LASTEXITCODE; Pop-Location;
if ($$code -ne 0) { exit $$code }
Write-Host '[npm] Instalando dependencias del frontend...';
Push-Location '$(FRONTEND)'; npm install; $$code = $$LASTEXITCODE; Pop-Location;
exit $$code
endef

install:
	@$(call ps,$(PS_INSTALL))

define PS_ENV
foreach ($$dir in '$(BACKEND)', '$(FRONTEND)') {
  if (-not (Test-Path "$$dir/.env")) {
    Write-Host "[env] Creando $$dir/.env desde .env.example...";
    Copy-Item "$$dir/.env.example" "$$dir/.env";
  } else {
    Write-Host "[env] $$dir/.env ya existe, no se toca.";
  }
}
if (Select-String -Path '$(BACKEND)/.env' -Pattern '^APP_KEY=.+' -Quiet) {
  Write-Host '[key] APP_KEY ya definida, no se regenera.';
} else {
  Write-Host '[key] Generando APP_KEY...';
  Push-Location '$(BACKEND)'; node ace generate:key; $$code = $$LASTEXITCODE; Pop-Location;
  exit $$code
}
endef

env:
	@$(call ps,$(PS_ENV))

define PS_MIGRATE
Write-Host '[db] Ejecutando migraciones...';
Push-Location '$(BACKEND)'; node ace migration:run; $$code = $$LASTEXITCODE; Pop-Location;
exit $$code
endef

migrate:
	@$(call ps,$(PS_MIGRATE))

# ---------------------------------------------------------------------------
# start
# ---------------------------------------------------------------------------

# Lanza los dos servidores en paralelo dentro de la misma receta.
#
# Cada servidor es un proceso hijo (`Start-Process -NoNewWindow`) que comparte
# esta consola, así que sus logs y los atajos interactivos de Adonis y Vite
# siguen llegando. El script se queda en un bucle hasta que uno de los dos
# termina: si el backend crashea al arrancar, el frontend no puede quedarse
# vivo para siempre sin que el usuario se entere.
#
# Al salir — porque uno se ha parado o porque llega un Ctrl-C — el `finally`
# mata con `taskkill /T` el árbol completo de cada `npm`: matar solo el
# `npm.cmd` dejaría vivos a los `node` hijos ocupando los puertos 3333 y 5173.
define PS_START
if (-not (Test-Path '$(BACKEND)/node_modules') -or -not (Test-Path '$(FRONTEND)/node_modules')) {
  Write-Host '[ERROR] Faltan dependencias. Ejecuta primero: make setup'; exit 1
}
if (-not (Test-Path '$(BACKEND)/.env')) {
  Write-Host '[ERROR] Falta $(BACKEND)/.env. Ejecuta primero: make setup'; exit 1
}
Write-Host '[start] Arrancando backend (http://localhost:3333) y frontend (http://localhost:5173)...';
Write-Host '   Ctrl-C para parar los dos. Si uno se cae, el otro se cierra tambien.';
Write-Host '';
$$backend = $$null; $$frontend = $$null;
try {
  $$backend  = Start-Process npm.cmd -ArgumentList 'run', 'dev' -WorkingDirectory '$(BACKEND)'  -NoNewWindow -PassThru;
  $$frontend = Start-Process npm.cmd -ArgumentList 'run', 'dev' -WorkingDirectory '$(FRONTEND)' -NoNewWindow -PassThru;
  while (-not $$backend.HasExited -and -not $$frontend.HasExited) { Start-Sleep -Milliseconds 500 }
  Write-Host '';
  if ($$backend.HasExited) {
    Write-Host '[!] El backend se ha parado. Cerrando el frontend.';
  } else {
    Write-Host '[!] El frontend se ha parado. Cerrando el backend.';
  }
} finally {
  foreach ($$p in $$backend, $$frontend) {
    if ($$p -and -not $$p.HasExited) { taskkill /T /F /PID $$p.Id *> $$null }
  }
}
endef

start: ## Levanta backend y frontend a la vez
	@$(call ps,$(PS_START))

# ---------------------------------------------------------------------------
# clean
# ---------------------------------------------------------------------------

define PS_CLEAN
Write-Host '[clean] Limpiando...';
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue '$(BACKEND)/node_modules', '$(FRONTEND)/node_modules';
Remove-Item -Force -ErrorAction SilentlyContinue '$(BACKEND)/tmp/db.sqlite3', '$(BACKEND)/tmp/db.sqlite3-wal', '$(BACKEND)/tmp/db.sqlite3-shm';
Write-Host '[OK] Listo. Vuelve a ejecutar: make setup';
endef

clean: ## Borra node_modules y la base de datos SQLite
	@$(call ps,$(PS_CLEAN))
