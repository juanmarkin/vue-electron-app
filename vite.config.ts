import { defineConfig } from 'vite';
import path from 'node:path';
import electron from 'vite-plugin-electron/simple';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';

export default defineConfig({
    plugins: [
        vue(),
        electron({
            main: { entry: 'src/main/main.ts' },
            preload: { input: path.join(__dirname, 'src/main/preload.ts') },
            renderer: process.env.NODE_ENV === 'test' ? undefined : {},
        }),
    ],
    resolve: {
        alias: {
            '@src': fileURLToPath(new URL('src', import.meta.url)),
            '@core': fileURLToPath(new URL('src/core', import.meta.url)),
            '@features': fileURLToPath(new URL('src/renderer/features', import.meta.url)),
            '@shared': fileURLToPath(new URL('src/renderer/shared', import.meta.url)),
            '@icons': fileURLToPath(new URL('src/renderer/assets/icons', import.meta.url)),
        },
    },
});
