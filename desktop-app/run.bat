@echo off
cd /d "%~dp0app"
if not exist node_modules (
  npm install
)
npx electron .
