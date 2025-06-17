@echo off
cd /d "%~dp0.."  REM back to /desktop-app
npm ci --offline || npm ci
npx electron-packager ./app "MyWebDesktop" --platform=win32 --arch=x64 --out dist --overwrite --prune=true
copy "%~dp0..\run.bat" "dist\MyWebDesktop-win32-x64\run.bat"
