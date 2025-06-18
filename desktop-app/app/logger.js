import log from 'electron-log';
import { promises as fs } from 'fs';
import path from 'path';

let LOG_DIR = '';
let debugEnabled = false;

export async function initLogger(dataDir, debug = false) {
  LOG_DIR = path.join(dataDir, 'logs');
  debugEnabled = debug;
  await fs.mkdir(LOG_DIR, { recursive: true });
  rotateLogs();
  log.transports.file.resolvePathFn = () => {
    const day = new Date().toISOString().slice(0, 10);
    return path.join(LOG_DIR, `app-${day}.log`);
  };
  log.transports.console.level = false;
  log.transports.file.level = debug ? 'debug' : 'info';
}

export function writeLog(level, message) {
  if (level === 'debug' && !debugEnabled) return;
  if (typeof log[level] === 'function') {
    log[level](message);
  } else {
    log.info(message);
  }
}

async function rotateLogs() {
  try {
    const files = await fs.readdir(LOG_DIR);
    const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
    await Promise.all(
      files.map(async f => {
        if (!/^app-\d{4}-\d{2}-\d{2}\.log$/.test(f)) return;
        const file = path.join(LOG_DIR, f);
        try {
          const stat = await fs.stat(file);
          if (stat.mtime.getTime() < cutoff) {
            await fs.unlink(file);
          }
        } catch {}
      })
    );
  } catch {}
}
