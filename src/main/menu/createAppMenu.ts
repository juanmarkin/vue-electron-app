import { BrowserWindow, Menu } from 'electron';

export function createAppMenu(win: BrowserWindow) {
    const template: Electron.MenuItemConstructorOptions[] = [
        {
            label: 'File',
            submenu: [
                { label: 'Open text…', accelerator: 'CmdOrCtrl+O', click: () => win.webContents.send('menu:open-primary-txt') },
                { type: 'separator' },
                { role: process.platform === 'darwin' ? 'close' : 'quit' },
            ],
        },
        { role: 'editMenu' },
        { role: 'viewMenu' },
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
