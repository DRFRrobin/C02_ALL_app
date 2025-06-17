import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { checkPassword } from '../configManager.js';

const tmp = path.join(os.tmpdir(), 'mwdauth');
process.env.DATA_DIR = tmp;

afterAll(async () => {
  await fs.rm(tmp, { recursive: true, force: true });
});

test('correct password passes', async () => {
  const ok = await checkPassword('admin', 'admin');
  expect(ok).toBe(true);
});

test('wrong password fails', async () => {
  const ok = await checkPassword('admin', 'wrong');
  expect(ok).toBe(false);
});
