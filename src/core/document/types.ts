import type { DialectLayerName, DialectToken, DialectWordToken } from '../tokenization/tokenizeTextLayer';
import type { DialectDocumentMetadata } from '../metadata/types';

export type DocumentSourceFormat = 'txt' | 'xhtml' | 'html';

export type WorkingDialectDocument = {
    id: string;
    sourceFile: { fileName: string; filePath?: string; extension?: string; format?: DocumentSourceFormat };
    saveFilePath?: string;
    documentKind?: 'dialect';
    rawText1: string;
    tokens: DialectToken[];
    words: DialectWordToken[];
    layers: Record<DialectLayerName, string[]>;
    sentences: string[];
    selectedWordId: string | null;
    warnings: WorkingDocumentWarning[];
    metadata?: DialectDocumentMetadata;
    isDirty: boolean;
};

export type WorkingDocumentWarning = { code: string; message: string; details?: unknown };
