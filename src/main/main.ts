import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createAppMenu } from './menu/createAppMenu';
import { registerIpcHandlers } from './ipc/register-ipc-handlers';
import { registerMainProcessErrorHandlers } from './errorHandling';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, '..');
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

export let win: BrowserWindow | null;
app.setName('Vue Electron App');

type CloseRequestReason = 'window-close' | 'quit';
type PendingCloseRequest = { requestId: string; reason: CloseRequestReason; window: BrowserWindow };
let allowClose = false;
let pendingCloseRequest: PendingCloseRequest | null = null;
let closeRequestCounter = 0;

registerMainProcessErrorHandlers({
    getMainWindow: () => win,
    createWindow: () => { createWindow(); return win; },
    isDev: Boolean(VITE_DEV_SERVER_URL),
});

export function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 1280,
        minHeight: 800,
        useContentSize: true,
        webPreferences: { preload: path.join(__dirname, 'preload.mjs'), devTools: true },
    });

    if (!app.isPackaged) win.webContents.openDevTools({ mode: 'right' });

    win.webContents.on('before-input-event', (_event, input) => {
        const isDevToolsShortcut = input.key === 'F12' || (input.control && input.shift && input.key.toLowerCase() === 'i') || (input.meta && input.alt && input.key.toLowerCase() === 'i');
        if (isDevToolsShortcut && isWindowUsable(win)) win.webContents.toggleDevTools();
    });

    win.webContents.on('did-finish-load', () => sendToWindow(win, 'main-process-message', new Date().toLocaleString()));

    if (VITE_DEV_SERVER_URL) win.loadURL(VITE_DEV_SERVER_URL);
    else win.loadFile(path.join(RENDERER_DIST, 'index.html'));

    installCloseGuard(win);
    win.on('closed', () => { clearPendingCloseRequestForWindow(win); win = null; });
}

function installCloseGuard(window: BrowserWindow) {
    window.on('close', (event) => {
        if (allowClose || !isWindowUsable(window)) return;
        event.preventDefault();
        requestCloseConfirmation(window, 'window-close');
    });
}

function requestCloseConfirmation(window: BrowserWindow, reason: CloseRequestReason) {
    clearDestroyedPendingCloseRequest();
    if (pendingCloseRequest) return;
    if (!isWindowUsable(window)) {
        allowClose = true;
        if (reason === 'quit') app.quit();
        return;
    }
    const requestId = `close-${Date.now()}-${closeRequestCounter++}`;
    pendingCloseRequest = { requestId, reason, window };
    window.webContents.send('app:close-request', { requestId, reason });
}

ipcMain.handle('app:close-response', async (_event, response: { requestId: string; allow: boolean }) => {
    if (!pendingCloseRequest || pendingCloseRequest.requestId !== response.requestId) return { ok: false };
    const request = pendingCloseRequest;
    pendingCloseRequest = null;
    if (!response.allow) return { ok: true };
    allowClose = true;
    if (request.reason === 'quit') app.quit();
    else if (isWindowUsable(request.window)) request.window.close();
    return { ok: true };
});

app.on('window-all-closed', () => { app.quit(); win = null; });
app.on('before-quit', (event) => {
    if (allowClose) return;
    const window = getActiveCloseGuardWindow();
    if (!window) { allowClose = true; return; }
    event.preventDefault();
    requestCloseConfirmation(window, 'quit');
});
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
app.whenReady().then(() => { registerIpcHandlers(); createWindow(); createAppMenu(win!); });

function getActiveCloseGuardWindow(): BrowserWindow | null {
    if (isWindowUsable(win)) return win;
    return BrowserWindow.getAllWindows().find((window) => isWindowUsable(window)) ?? null;
}
function isWindowUsable(window: BrowserWindow | null | undefined): window is BrowserWindow {
    return Boolean(window && !window.isDestroyed() && !window.webContents.isDestroyed());
}
function sendToWindow(window: BrowserWindow | null | undefined, channel: string, ...args: unknown[]) {
    if (isWindowUsable(window)) window.webContents.send(channel, ...args);
}
function clearDestroyedPendingCloseRequest() {
    if (pendingCloseRequest && !isWindowUsable(pendingCloseRequest.window)) pendingCloseRequest = null;
}
function clearPendingCloseRequestForWindow(window: BrowserWindow | null) {
    if (pendingCloseRequest?.window === window) pendingCloseRequest = null;
}
