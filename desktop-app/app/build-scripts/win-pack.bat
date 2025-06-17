@echo off
cd /d "%~dp0.."  & REM go to /desktop-app
npm install
npx electron-packager ./app "MyWebDesktop" --platform=win32 --arch=x64 --out dist --overwrite --prune=true
copy "run.bat" "dist\MyWebDesktop-win32-x64\run.bat"
