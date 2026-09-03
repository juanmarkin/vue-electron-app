import { BrowserWindow, dialog, ipcMain } from 'electron';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export function registerIpcHandlers() {
    ipcMain.handle('file:open-primary-txt', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Text', extensions: ['txt'] }],
        });

        if (result.canceled || !result.filePaths[0]) {
            return { ok: false, reason: 'cancelled' };
        }

        const filePath = result.filePaths[0];
        const content = await readFile(filePath, 'utf8');

        return {
            ok: true,
            file: {
                filePath,
                fileName: path.basename(filePath),
                content,
            },
        };
    });

    const unavailable = {
        ok: false,
        reason: 'unavailable-in-public-showcase',
        message:
            'This production feature depends on resources intentionally excluded from the public repository.',
    };

    for (const channel of [
        'file:open-document',
        'file:save-document',
        'file:save-document-as',
        'file:save-xhtml-as',
        'file:save-xhtml',
        'metadata:get-schemas',
        'metadata:export-xls',
        'morphology:get-dialect-features-table',
        'morphology:get-settings',
        'morphology:update-settings',
        'morphology:health',
        'morphology:analyze-word',
        'morphology:analyze-document',
        'morphology:check-orpho',
    ]) {
        ipcMain.handle(channel, async () => unavailable);
    }

    ipcMain.handle('dialog:confirm-unsaved-changes', async () => ({
        ok: true,
        action: 'discard',
    }));

    ipcMain.handle(
        'dialog:show-error',
        async (_event, request: { title: string; message: string; detail?: string }) => {
            dialog.showErrorBox(
                request.title,
                request.detail ? `${request.message}\n\n${request.detail}` : request.message,
            );
            return { ok: true };
        },
    );

    ipcMain.handle('window:set-title', async (event, request: { title: string }) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        win?.setTitle(request.title);
        return { ok: true };
    });
}
