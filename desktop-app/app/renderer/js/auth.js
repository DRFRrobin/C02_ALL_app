import bcrypt from 'bcryptjs';
import { readConfig } from './api.js';

window.addEventListener('DOMContentLoaded', () => {
  const loginEl = document.getElementById('login');
  const passEl = document.getElementById('pass');
  const submit = document.getElementById('submit');
  const error = document.getElementById('error');

  submit.addEventListener('click', async () => {
    const cfg = await readConfig();
    const user = cfg.users.find(u => u.login === loginEl.value);
    if (!user) {
      shake();
      return;
    }
    const ok = await bcrypt.compare(passEl.value, user.pass);
    if (ok) {
      window.api.loginSuccess();
    } else {
      shake();
    }
  });

  function shake() {
    error.classList.remove('hidden');
    submit.classList.add('shake');
    setTimeout(() => submit.classList.remove('shake'), 500);
  }
});
