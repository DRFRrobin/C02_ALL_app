import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), '.data');
const LOG_DIR = path.join(DATA_DIR, 'logs');

export async function writeLog(level, message) {
  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const logFile = path.join(LOG_DIR, `${day}.log`);
  const line = `${now.toISOString()} [${level.toUpperCase()}] ${message}\n`;
  await fs.mkdir(LOG_DIR, { recursive: true });
  await fs.appendFile(logFile, line, 'utf8');
  await rotateLogs();
}

async function rotateLogs() {
  let files;
  try {
    files = await fs.readdir(LOG_DIR);
  } catch {
    return;
  }
  const threshold = Date.now() - 14 * 24 * 60 * 60 * 1000;
  await Promise.all(
    files.map(async f => {
      const file = path.join(LOG_DIR, f);
      try {
        const stat = await fs.stat(file);
        if (stat.mtime.getTime() < threshold) {
          await fs.unlink(file);
        }
      } catch {}
    })
  );
}
