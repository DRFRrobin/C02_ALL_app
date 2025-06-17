import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '.data');
const CONFIG_NAME = 'config.json';
const DEFAULT_CONFIG = path.join(__dirname, 'config', 'default-config.json');
const CONFIG_PATH = path.join(DATA_DIR, CONFIG_NAME);

export async function ensureConfig() {
  try {
    await fs.access(CONFIG_PATH);
  } catch {
    const data = await fs.readFile(DEFAULT_CONFIG, 'utf-8');
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(CONFIG_PATH, data);
  }
}

export async function readConfig() {
  await ensureConfig();
  const data = await fs.readFile(CONFIG_PATH, 'utf-8');
  return JSON.parse(data);
}

export async function saveConfig(cfg) {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(cfg, null, 2));
}

export async function checkPassword(login, password) {
  const cfg = await readConfig();
  const user = cfg.users.find(u => u.login === login);
  if (!user) return false;
  return bcrypt.compareSync(password, user.pass);
}
