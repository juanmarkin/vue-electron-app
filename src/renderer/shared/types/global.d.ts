export {};

declare global {
    interface Window {
        crocodileApi?: {
            openPrimaryTxt?: () => Promise<{ ok: true; file: { filePath: string; fileName: string; content: string } } | { ok: false; reason: string; message?: string }>;
            [key: string]: unknown;
        };
    }
}
