import { readConfig, saveConfig, log } from './api.js';

let config;
const desktopIcons = document.getElementById('desktop-icons');
const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');
const windowZone = document.getElementById('window-zone');

window.addEventListener('DOMContentLoaded', async () => {
  config = await readConfig();
  renderIcons();
  applyWallpaper();
  log('info', 'Desktop loaded');
});

startBtn.addEventListener('click', () => {
  startMenu.classList.toggle('hidden');
});

desktopIcons.addEventListener('dblclick', e => {
  if (e.target.classList.contains('icon')) {
    createWindow(e.target.dataset.title);
  }
});

function renderIcons() {
  desktopIcons.innerHTML = '';
  const sample = [{ title: 'My App' }];
  sample.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'icon';
    div.textContent = item.title;
    div.dataset.title = item.title;
    desktopIcons.appendChild(div);
  });
}

function createWindow(title) {
  const win = document.createElement('div');
  win.className = 'window';
  win.style.top = '100px';
  win.style.left = '100px';
  win.style.width = '300px';
  win.style.height = '200px';
  const header = document.createElement('div');
  header.className = 'window-header';
  header.textContent = title;
  win.appendChild(header);
  const body = document.createElement('div');
  body.style.padding = '10px';
  body.textContent = 'Content';
  win.appendChild(body);
  windowZone.appendChild(win);
  dragElement(win, header);
  log('info', `Window opened: ${title}`);
}

function dragElement(el, handle) {
  let offX = 0, offY = 0, dragging = false;
  handle.addEventListener('mousedown', e => {
    dragging = true;
    offX = e.clientX - el.offsetLeft;
    offY = e.clientY - el.offsetTop;
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
  function onMove(e) {
    if (!dragging) return;
    el.style.left = e.clientX - offX + 'px';
    el.style.top = e.clientY - offY + 'px';
  }
  function onUp() {
    dragging = false;
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  }
}

function applyWallpaper() {
  if (config.settings.wallpaper) {
    document.getElementById('wallpaper').style.backgroundImage = `url(${config.settings.wallpaper})`;
  }
}
