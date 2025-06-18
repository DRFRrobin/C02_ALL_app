@echo off
:: ---------- Portable Node bootstrap ----------
set NODE_DIR=%~dp0node
set NODE_BIN=%NODE_DIR%\node.exe
if not exist "%NODE_BIN%" (
  echo [run] Portable Node not found…
  if exist "%~dp0node.zip" (
    powershell -Command "Expand-Archive -LiteralPath '%~dp0node.zip' -DestinationPath '%NODE_DIR%' -Force"
  ) else (
    echo [run] Downloading Node.js 20 LTS…
    powershell -Command "Invoke-WebRequest -Uri https://nodejs.org/dist/v20.14.0/node-v20.14.0-win-x64.zip -OutFile '%~dp0node.zip'"
    powershell -Command "Expand-Archive -LiteralPath '%~dp0node.zip' -DestinationPath '%NODE_DIR%' -Force"
  )
)
set "PATH=%NODE_DIR%;%NODE_DIR%\node_modules\npm\bin;%PATH%"
:: ---------- End Node bootstrap ---------------

cd /d "%~dp0app"

:: Offline cache extraction
if exist "%~dp0npm-offline.tgz" tar -xf "%~dp0npm-offline.tgz" -C "%~dp0"

:: Install deps
if exist package-lock.json (
  npm ci --offline || npm ci || npm install --no-audit --fund=false
) else (
  npm install --offline || npm install --no-audit --fund=false
)

npx electron .
