// PostToolUse (Edit|Write): formatea con Prettier el archivo editado si está dentro de frontend/.
import { execFileSync } from 'node:child_process'
import path from 'node:path'

let input = ''
for await (const chunk of process.stdin) input += chunk

const { tool_input: toolInput = {}, tool_response: toolResponse = {} } = JSON.parse(input || '{}')
const filePath = toolResponse.filePath ?? toolInput.file_path
if (!filePath) process.exit(0)

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const frontendDir = path.resolve(projectDir, 'frontend')
const relative = path.relative(frontendDir, path.resolve(filePath))
if (relative.startsWith('..') || path.isAbsolute(relative)) process.exit(0)

try {
  execFileSync(process.execPath, [path.join(frontendDir, 'node_modules/prettier/bin/prettier.cjs'), '--write', '--ignore-unknown', '--no-color', relative], {
    cwd: frontendDir,
    stdio: ['ignore', 'ignore', 'pipe'],
  })
} catch (error) {
  // No bloquea la edición: solo avisa (p. ej. error de sintaxis que Prettier no puede parsear).
  console.log(JSON.stringify({ systemMessage: `Prettier no pudo formatear ${relative}: ${error.stderr?.toString().trim() ?? error.message}` }))
}
