import { ipcRenderer, contextBridge } from 'electron';
import type { AnalyzeDocumentRequest, AnalyzeWordRequest, GetDialectFeaturesTableResponse } from '../core/morphology/ipcTypes';
import type { UpdateMorphologySettingsRequest } from '../core/morphology/settings';
import type { ConfirmUnsavedChangesRequest, SaveDocumentRequest, ShowErrorDialogRequest } from '../core/document/fileIpcTypes';
import type { ExportMetadataXlsRequest, ExportMetadataXlsResponse, GetMetadataSchemasResponse } from '../core/metadata/ipcTypes';
import type { SetWindowTitleRequest } from '../core/electron/windowIpcTypes';

contextBridge.exposeInMainWorld('crocodileApi', {
    openPrimaryTxt: () => ipcRenderer.invoke('file:open-primary-txt'),
    openDocument: () => ipcRenderer.invoke('file:open-document'),
    saveDocument: (payload: SaveDocumentRequest) => ipcRenderer.invoke('file:save-document', payload),
    saveDocumentAs: (payload: SaveDocumentRequest) => ipcRenderer.invoke('file:save-document-as', payload),
    saveXhtmlAs: (payload: SaveDocumentRequest) => ipcRenderer.invoke('file:save-xhtml-as', payload),
    saveXhtml: (payload: SaveDocumentRequest) => ipcRenderer.invoke('file:save-xhtml', payload),
    confirmUnsavedChanges: (request?: ConfirmUnsavedChangesRequest) => ipcRenderer.invoke('dialog:confirm-unsaved-changes', request),
    showErrorDialog: (request: ShowErrorDialogRequest) => ipcRenderer.invoke('dialog:show-error', request),
    setWindowTitle: (request: SetWindowTitleRequest) => ipcRenderer.invoke('window:set-title', request),
    getMetadataSchemas: (): Promise<GetMetadataSchemasResponse> => ipcRenderer.invoke('metadata:get-schemas'),
    exportMetadataXls: (request: ExportMetadataXlsRequest): Promise<ExportMetadataXlsResponse> => ipcRenderer.invoke('metadata:export-xls', request),
    getDialectFeaturesTable: (): Promise<GetDialectFeaturesTableResponse> => ipcRenderer.invoke('morphology:get-dialect-features-table'),
    getMorphologySettings: () => ipcRenderer.invoke('morphology:get-settings'),
    updateMorphologySettings: (request: UpdateMorphologySettingsRequest) => ipcRenderer.invoke('morphology:update-settings', request),
    morphologyHealth: () => ipcRenderer.invoke('morphology:health'),
    analyzeWord: (request: AnalyzeWordRequest) => ipcRenderer.invoke('morphology:analyze-word', request),
    analyzeDocument: (request: AnalyzeDocumentRequest) => ipcRenderer.invoke('morphology:analyze-document', request),
    checkOrpho: (request: AnalyzeDocumentRequest) => ipcRenderer.invoke('morphology:check-orpho', request),
    onAnalyzeDocumentFromMenu: (callback: () => void) => { ipcRenderer.on('menu:analyze-document', callback); return () => ipcRenderer.removeListener('menu:analyze-document', callback); },
    onAnalyzeWordFromMenu: (callback: () => void) => { ipcRenderer.on('menu:analyze-word', callback); return () => ipcRenderer.removeListener('menu:analyze-word', callback); },
    onOpenPrimaryTxtFromMenu: (callback: () => void) => { ipcRenderer.on('menu:open-primary-txt', callback); return () => ipcRenderer.removeListener('menu:open-primary-txt', callback); },
    onOpenDocumentFromMenu: (callback: () => void) => { ipcRenderer.on('menu:open-document', callback); return () => ipcRenderer.removeListener('menu:open-document', callback); },
    onSaveXhtmlFromMenu: (callback: () => void) => { ipcRenderer.on('menu:save-xhtml', callback); return () => ipcRenderer.removeListener('menu:save-xhtml', callback); },
    onSaveDocumentAsFromMenu: (callback: () => void) => { ipcRenderer.on('menu:save-document-as', callback); return () => ipcRenderer.removeListener('menu:save-document-as', callback); },
    onSaveDocumentFromMenu: (callback: () => void) => { ipcRenderer.on('menu:save-document', callback); return () => ipcRenderer.removeListener('menu:save-document', callback); },
    onOpenAddressMetadataFromMenu: (callback: () => void) => { ipcRenderer.on('menu:metadata-address', callback); return () => ipcRenderer.removeListener('menu:metadata-address', callback); },
    onOpenPhoneticsMetadataFromMenu: (callback: () => void) => { ipcRenderer.on('menu:metadata-phonetics', callback); return () => ipcRenderer.removeListener('menu:metadata-phonetics', callback); },
    onOpenDialectTextMetadataFromMenu: (callback: () => void) => { ipcRenderer.on('menu:metadata-dialect-text', callback); return () => ipcRenderer.removeListener('menu:metadata-dialect-text', callback); },
    onOpenGeographyMetadataFromMenu: (callback: () => void) => { ipcRenderer.on('menu:metadata-geography', callback); return () => ipcRenderer.removeListener('menu:metadata-geography', callback); },
    onExportMetadataXlsFromMenu: (callback: () => void) => { ipcRenderer.on('menu:metadata-export-xls', callback); return () => ipcRenderer.removeListener('menu:metadata-export-xls', callback); },
    onAppCloseRequest: (callback: (request: { requestId: string; reason: 'window-close' | 'quit' }) => void) => {
        const listener = (_event: Electron.IpcRendererEvent, request: { requestId: string; reason: 'window-close' | 'quit' }) => callback(request);
        ipcRenderer.on('app:close-request', listener);
        return () => ipcRenderer.removeListener('app:close-request', listener);
    },
    resolveAppCloseRequest: (response: { requestId: string; allow: boolean }) => ipcRenderer.invoke('app:close-response', response),
});
