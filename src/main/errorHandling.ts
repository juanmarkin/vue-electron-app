import type { BrowserWindow } from 'electron';

export function registerMainProcessErrorHandlers(_params: {
    getMainWindow: () => BrowserWindow | null;
    createWindow: () => BrowserWindow | null;
    isDev: boolean;
}) {
    process.on('uncaughtException', (error) => console.error('[main:uncaughtException]', error));
    process.on('unhandledRejection', (reason) => console.error('[main:unhandledRejection]', reason));
}
