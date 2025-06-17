# MyWebDesktop (Offline Electron Windows-like Environment)

A fully offline Electron application that emulates a Windows-10 style desktop: login screen, taskbar, icons, draggable windows—everything stored locally in **%APPDATA%/MyWebDesktop**.

---
## 1. Prerequisites
- **Windows 10 / 11** 64-bit  
- **Node.js 20 LTS** (npm ≥ 10)  
- **Git (optional)** if you clone instead of downloading ZIP  

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

1. Extract **npm-offline.tgz** (if present) into *node_modules/*
2. Run `npm ci --offline || npm ci`
3. Launch Electron full-screen

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

---

## 4. Scripts

| Purpose              | Command                                 |
| -------------------- | --------------------------------------- |
| Dev launch           | `run.bat` or `npm start`                |
| Unit tests           | `npm test -- --experimental-vm-modules` |
| Build standalone EXE | `app/build-scripts/win-pack.bat`        |

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

| Issue                             | Fix                                        |
| --------------------------------- | ------------------------------------------ |
| Electron window stays black       | Check GPU drivers + Node ≥ 20              |
| `npm ERR! offline` during install | Ensure `npm-offline.tgz` is present        |
| Jest ESM SyntaxError              | Run tests with `--experimental-vm-modules` |

---

## 10. License

MIT

---

## 15. Logging system

Daily log files are stored under `%APPDATA%/MyWebDesktop/logs` with a 14-day retention policy. Each log entry is timestamped and includes a level (`INFO`, `WARN`, etc.).
