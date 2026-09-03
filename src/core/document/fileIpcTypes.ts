import type { DocumentSourceFormat, WorkingDialectDocument } from './types';
import type { XhtmlMorphologyExportLayerName } from './serialization/xhtml';
import type { IpcResult } from '../../shared/ipc/ipc-result';

export type FileIpcErrorReason = 'cancelled' | 'error' | 'unsupported-extension';
export type FileIpcErrorResult = { ok: false; reason: FileIpcErrorReason; message?: string };
export type PrimaryTxtFile = { filePath: string; fileName: string; content: string };
export type OpenPrimaryTxtResult = { ok: true; file: PrimaryTxtFile } | FileIpcErrorResult;
export type OpenDocumentData = { document: WorkingDialectDocument; file: { filePath: string; fileName: string; extension: string; format?: DocumentSourceFormat } };
export type OpenDocumentResult = IpcResult<OpenDocumentData>;
export type SaveDocumentRequest = { document: WorkingDialectDocument; layerName?: XhtmlMorphologyExportLayerName };
export type SaveDocumentData = { filePath: string; fileName: string; extension: string; format: 'xhtml' };
export type SaveDocumentResult = IpcResult<SaveDocumentData>;
export type SaveXhtmlRequest = SaveDocumentRequest;
export type SaveXhtmlResult = SaveDocumentResult;
export type ConfirmUnsavedChangesRequest = { reason?: 'open' | 'close' };
export type ConfirmUnsavedChangesResult = { ok: true; action: 'save' | 'discard' | 'cancel' } | FileIpcErrorResult;
export type ShowErrorDialogRequest = { title: string; message: string; detail?: string };
export type ShowErrorDialogResult = { ok: true } | FileIpcErrorResult;
