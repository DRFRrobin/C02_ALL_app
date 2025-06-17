import path from 'path';
import os from 'os';
import fs from 'fs/promises';
const dir = path.join(os.tmpdir(), 'mwdlogs');
process.env.DATA_DIR = dir;
const { writeLog } = await import('../logger.js');

afterAll(async () => {
  await fs.rm(dir, { recursive: true, force: true });
});

test('write log creates file with message', async () => {
  await writeLog('info', 'test message');
  const day = new Date().toISOString().slice(0, 10);
  const logFile = path.join(dir, 'logs', `${day}.log`);
  const data = await fs.readFile(logFile, 'utf-8');
  expect(data).toMatch(/INFO/);
  expect(data).toMatch(/test message/);
});
