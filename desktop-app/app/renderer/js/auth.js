import bcrypt from 'bcryptjs';
import { readConfig, log } from './api.js';

window.addEventListener('DOMContentLoaded', () => {
  const loginEl = document.getElementById('login');
  const passEl = document.getElementById('pass');
  const submit = document.getElementById('submit');
  const error = document.getElementById('error');

  submit.addEventListener('click', async () => {
    const cfg = await readConfig();
    const user = cfg.users.find(u => u.login === loginEl.value);
    if (!user) {
      await log('warn', `Login failed for unknown user ${loginEl.value}`);
      shake();
      return;
    }
    const ok = await bcrypt.compare(passEl.value, user.pass);
    if (ok) {
      await log('info', `User ${loginEl.value} logged in`);
      window.location.href = 'desktop.html';
    } else {
      await log('warn', `Login failed for user ${loginEl.value}`);
      shake();
    }
  });

  function shake() {
    error.classList.remove('hidden');
    submit.classList.add('shake');
    setTimeout(() => submit.classList.remove('shake'), 500);
  }
});
