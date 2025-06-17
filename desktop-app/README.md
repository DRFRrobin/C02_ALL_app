# MyWebDesktop

Simple Windows-like desktop environment built with Electron.

## Quick Start

1. Install Node.js on Windows.
2. Double-click `run.bat` to start the app for development.
3. Run `win-pack.bat` inside `app/build-scripts` to build a standalone executable.

All user data is stored under the folder returned by `app.getPath('userData')`.

## Offline installation

1. On a machine with Internet access, run `npm install` inside the `app` folder and then create `npm-offline.tgz` by running:
   ```
   tar -czf npm-offline.tgz node_modules package-lock.json
   ```
   Place this file next to `run.bat`.
2. Copy the entire `desktop-app` folder (including `npm-offline.tgz`) to the offline PC.
3. Launch `run.bat`. It extracts the cached modules and installs without network access.
