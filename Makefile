# FlowSync — atajos de desarrollo para Windows nativo (PowerShell / cmd).
#
# Requisitos: Node.js + npm y GNU Make para Windows.
#   - winget install ezwinports.make   (o: choco install make)
#
# Las recetas se ejecutan con Windows PowerShell (powershell.exe), que viene
# con Windows 10/11. En macOS, Linux o WSL usa el otro Makefile:
#   make -f Makefile.linux <target>

ifneq ($(OS),Windows_NT)
$(error Este Makefile es para Windows. En macOS / Linux / WSL usa: make -f Makefile.linux <target>)
endif

SHELL := powershell.exe
.SHELLFLAGS := -NoProfile -ExecutionPolicy Bypass -Command

BACKEND  := backend
FRONTEND := frontend

.DEFAULT_GOAL := help
.PHONY: help setup start install env migrate clean

# La ayuda se genera a partir de los comentarios `## ...` de cada target, para
# que no haya un segundo listado que mantener a mano y que pueda divergir.
help: ## Muestra esta ayuda
	@Write-Host 'FlowSync - targets disponibles:'; Write-Host ''; Select-String -Path '$(firstword $(MAKEFILE_LIST))' -Pattern '^([a-zA-Z_-]+):.*## (.*)$$' | ForEach-Object { '  make {0,-8} {1}' -f $$_.Matches[0].Groups[1].Value, $$_.Matches[0].Groups[2].Value }; Write-Host ''

# ---------------------------------------------------------------------------
# setup
# ---------------------------------------------------------------------------

setup: install env migrate ## Deja el proyecto listo para arrancar
	@Write-Host ''; Write-Host 'Setup completado. Arranca todo con: make start'

install:
	@if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Host 'Node.js no está instalado.'; exit 1 }
	@if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { Write-Host 'npm no está instalado.'; exit 1 }
	@Write-Host 'Instalando dependencias del backend...'
	@Set-Location $(BACKEND); npm install; exit $$LASTEXITCODE
	@Write-Host 'Instalando dependencias del frontend...'
	@Set-Location $(FRONTEND); npm install; exit $$LASTEXITCODE

env:
	@if (-not (Test-Path '$(BACKEND)/.env')) { Write-Host 'Creando $(BACKEND)/.env desde .env.example...'; Copy-Item '$(BACKEND)/.env.example' '$(BACKEND)/.env' } else { Write-Host '$(BACKEND)/.env ya existe, no se toca.' }
	@if (-not (Test-Path '$(FRONTEND)/.env')) { Write-Host 'Creando $(FRONTEND)/.env desde .env.example...'; Copy-Item '$(FRONTEND)/.env.example' '$(FRONTEND)/.env' } else { Write-Host '$(FRONTEND)/.env ya existe, no se toca.' }
	@if (Select-String -Path '$(BACKEND)/.env' -Pattern '^APP_KEY=.+' -Quiet) { Write-Host 'APP_KEY ya definida, no se regenera.' } else { Write-Host 'Generando APP_KEY...'; Set-Location $(BACKEND); node ace generate:key; exit $$LASTEXITCODE }

migrate:
	@Write-Host 'Ejecutando migraciones...'
	@Set-Location $(BACKEND); node ace migration:run; exit $$LASTEXITCODE

# ---------------------------------------------------------------------------
# start
# ---------------------------------------------------------------------------

# Lanza los dos servidores en paralelo compartiendo esta consola.
#
# Ctrl-C llega a todos los procesos de la consola, así que ambos servidores lo
# reciben igual que en una terminal POSIX. Además, si uno de los dos termina
# por su cuenta (p. ej. el backend crashea al arrancar), el bucle lo detecta y
# el `finally` mata el árbol de procesos del otro con `taskkill /T /F`, para no
# dejar nodos huérfanos ocupando los puertos 3333 / 5173.
start: ## Levanta backend y frontend a la vez
	@if (-not (Test-Path '$(BACKEND)/node_modules') -or -not (Test-Path '$(FRONTEND)/node_modules')) { Write-Host 'Faltan dependencias. Ejecuta primero: make setup'; exit 1 }
	@if (-not (Test-Path '$(BACKEND)/.env')) { Write-Host 'Falta $(BACKEND)/.env. Ejecuta primero: make setup'; exit 1 }
	@Write-Host 'Arrancando backend (http://localhost:3333) y frontend (http://localhost:5173)...'
	@Write-Host '   Ctrl-C para parar los dos. Si uno se cae, el otro se cierra también.'; Write-Host ''
	@$$be = Start-Process npm.cmd -ArgumentList 'run','dev' -WorkingDirectory '$(BACKEND)' -NoNewWindow -PassThru; $$fe = Start-Process npm.cmd -ArgumentList 'run','dev' -WorkingDirectory '$(FRONTEND)' -NoNewWindow -PassThru; try { while (-not $$be.HasExited -and -not $$fe.HasExited) { Start-Sleep -Milliseconds 500 }; Write-Host ''; if ($$be.HasExited) { Write-Host 'El backend se ha parado. Cerrando el frontend.' } else { Write-Host 'El frontend se ha parado. Cerrando el backend.' } } finally { foreach ($$p in @($$be, $$fe)) { if (-not $$p.HasExited) { taskkill /T /F /PID $$p.Id *> $$null } } }

# ---------------------------------------------------------------------------
# clean
# ---------------------------------------------------------------------------

clean: ## Borra node_modules y la base de datos SQLite
	@Write-Host 'Limpiando...'
	@Remove-Item -Recurse -Force -ErrorAction SilentlyContinue '$(BACKEND)/node_modules', '$(FRONTEND)/node_modules'; exit 0
	@Remove-Item -Force -ErrorAction SilentlyContinue '$(BACKEND)/tmp/db.sqlite3', '$(BACKEND)/tmp/db.sqlite3-wal', '$(BACKEND)/tmp/db.sqlite3-shm'; exit 0
	@Write-Host 'Listo. Vuelve a ejecutar: make setup'
