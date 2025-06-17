import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { readConfig, saveConfig } from '../configManager.js';

const dir = path.join(os.tmpdir(), 'mwdconfig');
process.env.DATA_DIR = dir;

afterAll(async () => {
  await fs.rm(dir, { recursive: true, force: true });
});

test('read default config', async () => {
  const cfg = await readConfig();
  expect(cfg.users[0].login).toBe('admin');
});

test('save config persists', async () => {
  const cfg = await readConfig();
  cfg.testKey = 'value';
  await saveConfig(cfg);
  const newCfg = await readConfig();
  expect(newCfg.testKey).toBe('value');
});
