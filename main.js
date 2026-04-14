'use strict';

// ── Global error handlers ────────────────────────────────────────────────────
process.on('uncaughtException',  (err) => console.error('[Main] uncaughtException:', err));
process.on('unhandledRejection', (err) => console.error('[Main] unhandledRejection:', err));

const { app, BrowserWindow, shell, ipcMain, Notification } = require('electron');
const path = require('path');
const fs   = require('fs');

const APP_URL = 'https://habit-pulse-gules.vercel.app/';

// Resolve notification icon to an existing PNG (favicon.ico doesn't exist)
const ICON_PATH = (() => {
  const candidates = [
    path.join(__dirname, 'public', 'icon-light-32x32.png'),
    path.join(__dirname, 'public', 'apple-icon.png'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
})();

// ── Window creation ──────────────────────────────────────────────────────────
function createWindow() {
  const win = new BrowserWindow({
    width:  1280,
    height: 860,
    minWidth:  800,
    minHeight: 600,
    title: 'HabitPulse',
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    backgroundColor: '#0b0b0c',
    autoHideMenuBar: true,
    show: false,           // ← hidden until 'ready-to-show' fires
    webPreferences: {
      nodeIntegration:  false,
      contextIsolation: true,
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Prevent renderer from changing window title
  win.on('page-title-updated', (e) => {
    e.preventDefault();
  });

  // Setup splash screen for smooth loading experience
  const splash = new BrowserWindow({
    width: 300,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
  });

  splash.loadFile(path.join(__dirname, 'assets', 'loading.html'));

  // Show window only after first paint (prevents blank flash / invisible window)
  win.once('ready-to-show', () => {
    splash.close();
    win.show();
    win.focus();
    console.log('[Electron] Window shown');
  });

  // Open Vercel-internal links inside Electron; everything else in system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://habit-pulse-gules.vercel.app')) {
      return { action: 'allow' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // ── Debug events ──────────────────────────────────────────────────────────
  win.webContents.on('did-start-loading', () => console.log('[Electron] Loading started…'));
  win.webContents.on('did-finish-load',   () => console.log('[Electron] Page loaded ✓'));
  win.webContents.on('did-fail-load', (_e, code, desc, url) => {
    console.error(`[Electron] did-fail-load  code=${code}  desc=${desc}  url=${url}`);
  });
  win.webContents.on('render-process-gone', (_e, details) => {
    console.error('[Electron] Renderer crashed:', details);
  });
  win.webContents.on('console-message', (_e, level, message) => {
    console.log(`[Renderer] ${message}`);
  });

  // ── Load the app ──────────────────────────────────────────────────────────
  win.loadURL(APP_URL).catch((err) => {
    console.error('[Electron] loadURL failed:', err);
  });

  win.on('closed', () => {
    console.log('[Electron] Window closed');
  });
}

// ── IPC: native notifications ────────────────────────────────────────────────
ipcMain.on('show-notification', (_event, data) => {
  if (Notification.isSupported()) {
    new Notification({
      title: data.title,
      body:  data.body,
      ...(ICON_PATH ? { icon: ICON_PATH } : {}),
    }).show();
  }
});

// ── App lifecycle ────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  console.log('[Electron] App ready – creating window');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}).catch((err) => {
  console.error('[Electron] app.whenReady failed:', err);
  app.quit();
});

app.on('window-all-closed', () => {
  console.log('[Electron] All windows closed');
  if (process.platform !== 'darwin') app.quit();
});
