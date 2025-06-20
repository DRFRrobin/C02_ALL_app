# MyWebDesktop (Offline Electron Windows-like Environment)

A fully offline Electron application that emulates a Windows-10 style desktop: login screen, taskbar, icons, draggable windows—everything stored locally in **%APPDATA%/MyWebDesktop**.

---
## 1. Prerequisites
- **Windows 10 / 11** 64-bit
- **Git (optional)** if you clone instead of downloading ZIP
- *(No separate Node.js install required – a portable runtime is bundled)*

> **Offline note**  
> After first download you can cut the network: installation, execution and packaging are 100 % offline.

---
## 2. Quick-start
```bash
# unzip / clone the repo
cd desktop-app
run.bat     # double-click under Explorer
```

`run.bat` will :

1. Ensure a portable Node.js runtime is available (auto-download if missing)
2. Extract **npm-offline.tgz** (if present) into *node_modules/*
3. Run `npm ci --offline || npm ci` (falls back to online install once)
4. Launch Electron full-screen

---

## 3. Offline install from scratch

On a connected PC :

```bash
cd desktop-app/app
npm ci --ignore-scripts
cd ..
tar -czf npm-offline.tgz node_modules app/package-lock.json
```

Copy the whole *desktop-app* (with **npm-offline.tgz**) to the offline machine and double-click **run.bat**.
If `node.zip` is present, the script will extract it to provide a portable Node runtime.

---

## 4. Scripts

| Purpose              | Command                                 |
| -------------------- | --------------------------------------- |
| Dev launch           | `run.bat` or `npm start`                |
| Unit tests           | `npm test -- --experimental-vm-modules` |
| Build standalone EXE | `app/build-scripts/win-pack.bat`        |
| Update from Git      | `update.bat [PR]` (from `desktop-app`)  |

---

## 5. Tests

```bash
cd desktop-app/app
npm test -- --experimental-vm-modules
```

(Flag needed because the codebase is ES Modules.)

---

## 6. Layout

```
 desktop-app/
 │ run.bat          → offline-aware launcher
 │ update.bat       → self-update helper
 │ node/            → portable Node runtime
 │ node.zip         → fallback Node archive
 │ npm-offline.tgz  → optional cache
└─ app/
   ├─ main.js, preload.js
   ├─ renderer/…
   ├─ assets/
   ├─ tests/ (auth, config, log)
   └─ build-scripts/win-pack.bat
```

---

## 7. Data storage

Everything is written to **%APPDATA%/MyWebDesktop** :

* `config.json` – credentials, layout, prefs
* `logs/` – daily rotating logs (14-day retention)
* `files/` – user-chosen data folder
* `sqlite/` – optional DB

An **Export** button in the desktop UI zips this directory for backup.

---

## 8. Security

* `contextIsolation: true`, `sandbox: true`, external navigation blocked
* No analytics / telemetry / network calls

---

## 9. Troubleshooting

| Issue                             | Fix |
| --------------------------------- | ------------------------------------------ |
| Electron window stays black       | Check GPU drivers; ensure portable Node extracted |
| `npm ERR! offline` during install | Ensure `npm-offline.tgz` is present |
| Jest ESM SyntaxError              | Run tests with `--experimental-vm-modules` |
---

## 10. License

MIT

---

## 15. Logging system

Runtime events are traced to `%APPDATA%/MyWebDesktop/logs` with one file per day
named `app-YYYY-MM-DD.log`. Only the last fourteen files are kept. The logger
supports four levels: `info`, `warn`, `error` and `debug` (only written when
`debug` is enabled in `config.json`). Call `window.api.log(level, message)` from
the renderer to append a new entry.
