import { tokenizeDialectText1 } from '../tokenization/tokenizeTextLayer';
import { createEmptyDialectDocumentMetadata } from '../metadata/types';

import {
    getDefaultDialectSaveFilePath,
    getFileExtension,
    inferDocumentSourceFormat,
} from './fileState';
import type { WorkingDialectDocument, WorkingDocumentWarning } from './types';

type CreateWorkingDocumentParams = {
    fileName: string;
    filePath?: string;
    extension?: string;
    format?: 'txt' | 'xhtml' | 'html';
    rawText1: string;
};

export function createWorkingDocument(params: CreateWorkingDocumentParams): WorkingDialectDocument {
    const warnings: WorkingDocumentWarning[] = [];
    const extension = params.extension ?? getFileExtension(params.filePath || params.fileName) ?? '.txt';
    const format = params.format ?? inferDocumentSourceFormat(params.filePath || params.fileName) ?? 'txt';
    const normalizedText1 = normalizeRawText(params.rawText1);

    if (!normalizedText1.trim()) {
        warnings.push({ code: 'EMPTY_TEXT', message: 'Первичный .txt пустой или содержит только пробельные символы.' });
    }

    const tokenizeResult = tokenizeDialectText1(normalizedText1, { addParagraphTokens: true, keepEmptyLines: false });

    if (tokenizeResult.words.length === 0) {
        warnings.push({ code: 'NO_WORDFORMS', message: 'Не удалось выделить ни одной словоформы.' });
    }

    return {
        id: createDocumentId(),
        sourceFile: { fileName: params.fileName, filePath: params.filePath, extension, format },
        saveFilePath: getDefaultDialectSaveFilePath({ fileName: params.fileName, filePath: params.filePath, format }),
        documentKind: 'dialect',
        rawText1: normalizedText1,
        tokens: tokenizeResult.tokens,
        words: tokenizeResult.words,
        layers: tokenizeResult.layers,
        sentences: tokenizeResult.sentences,
        selectedWordId: tokenizeResult.words[0]?.id ?? null,
        warnings,
        metadata: createEmptyDialectDocumentMetadata(),
        isDirty: false,
    };
}

function normalizeRawText(input: string): string {
    return input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function createDocumentId(): string {
    return `doc-${Date.now()}`;
}
