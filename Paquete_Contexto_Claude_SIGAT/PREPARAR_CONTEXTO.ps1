$ErrorActionPreference = "Stop"
$root = (Get-Location).Path
$out = Join-Path $root "CONTEXTO_CLAUDE"

if (!(Test-Path (Join-Path $root "frontend\src")) -or !(Test-Path (Join-Path $root "backend\src"))) {
    throw "Ejecuta este script desde la raíz del proyecto (deben existir frontend\src y backend\src)."
}

if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item -ItemType Directory -Path $out | Out-Null

# Copia fuentes del frontend y backend, excluyendo dependencias y artefactos.
Copy-Item (Join-Path $root "frontend\src") (Join-Path $out "frontend\src") -Recurse -Force
Copy-Item (Join-Path $root "backend\src") (Join-Path $out "backend\src") -Recurse -Force

# Manifiestos y archivos de configuración útiles (nunca .env).
$files = @(
 "frontend\package.json",
 "backend\package.json",
 "frontend\vite.config.js",
 "frontend\vite.config.ts",
 "backend\server.js",
 "backend\app.js",
 "backend\index.js",
 "README.md",
 "database\Schema.sql",
 "database\schema.sql",
 ".gitignore"
)
foreach ($f in $files) {
  $src = Join-Path $root $f
  if (Test-Path $src -PathType Leaf) {
    $dest = Join-Path $out ("archivos\" + ($f -replace '[\\/]', '_'))
    New-Item -ItemType Directory -Path (Split-Path $dest -Parent) -Force | Out-Null
    Copy-Item $src $dest -Force
  }
}

# Inventario filtrado: no incluye nombres de archivos secretos.
Get-ChildItem $root -Recurse -File |
  Where-Object {
    $_.FullName -notmatch '\\(node_modules|\.git|dist|build|coverage|\.vite)\\' -and
    $_.Name -notmatch '(^\.env|secret|credential|password|token|\.pem$|\.key$)'
  } |
  ForEach-Object { $_.FullName.Substring($root.Length + 1) } |
  Set-Content (Join-Path $out "INVENTARIO_ARCHIVOS.txt") -Encoding UTF8

try {
  git -C $root status --short 2>&1 |
    Set-Content (Join-Path $out "GIT_STATUS.txt") -Encoding UTF8
} catch {
  "No se pudo consultar git status." | Set-Content (Join-Path $out "GIT_STATUS.txt")
}

# Exporta únicamente estructura de MySQL, nunca datos. Pide contraseña de root.
$dump = Get-Command mysqldump -ErrorAction SilentlyContinue
if ($dump) {
  $schemaDir = Join-Path $out "base_datos"
  New-Item -ItemType Directory -Path $schemaDir -Force | Out-Null
  & mysqldump -u root -p --no-data --routines --triggers llantera_lh |
    Set-Content (Join-Path $schemaDir "esquema_actual.sql") -Encoding UTF8
} else {
  "mysqldump no está disponible en PATH. Exporta manualmente SOLO estructura de llantera_lh." |
    Set-Content (Join-Path $out "base_datos_ESQUEMA_PENDIENTE.txt") -Encoding UTF8
}

# Copia documentos de contexto del paquete, si el paquete está junto al script.
$sourceContext = Join-Path $PSScriptRoot "CONTEXTO_CLAUDE"
if (Test-Path $sourceContext) {
  Copy-Item (Join-Path $sourceContext "*") $out -Recurse -Force
}

Write-Host "Contexto generado en: $out" -ForegroundColor Green
Write-Host "Revisa los archivos antes de compartirlos. Nunca incluyas .env, secretos ni datos reales."
