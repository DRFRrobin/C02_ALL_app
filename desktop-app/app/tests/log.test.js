import path from 'path';
import os from 'os';
import fs from 'fs/promises';
const dir = path.join(os.tmpdir(), 'mwdlogs');
const { initLogger, writeLog } = await import('../logger.js');
await initLogger(dir, false);

afterAll(async () => {
  await fs.rm(dir, { recursive: true, force: true });
});

test('write log creates file with message', async () => {
  await writeLog('info', 'test message');
  const day = new Date().toISOString().slice(0, 10);
  const logFile = path.join(dir, 'logs', `app-${day}.log`);
  const data = await fs.readFile(logFile, 'utf-8');
  expect(data).toMatch(/info/i);
  expect(data).toMatch(/test message/);
});
