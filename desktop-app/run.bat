@echo off
cd /d "%~dp0app"
:: Offline install support — extract cached modules if present
if exist "%~dp0npm-offline.tgz" (
  tar -xf "%~dp0npm-offline.tgz" -C "%~dp0"
)
:: Install without hitting the network if cache present
npm ci --offline || npm ci
npx electron .
