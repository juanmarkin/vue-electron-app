import type { DocumentSourceFormat } from './types';

export function inferDocumentSourceFormat(fileNameOrPath: string | undefined): DocumentSourceFormat | undefined {
    const extension = getFileExtension(fileNameOrPath);
    if (extension === '.txt') return 'txt';
    if (extension === '.xhtml') return 'xhtml';
    if (extension === '.html' || extension === '.htm') return 'html';
    return undefined;
}

export function getFileExtension(fileNameOrPath: string | undefined): string | undefined {
    const fileName = getBaseName(fileNameOrPath);
    const dotIndex = fileName.lastIndexOf('.');
    if (dotIndex <= 0 || dotIndex === fileName.length - 1) return undefined;
    return fileName.slice(dotIndex).toLowerCase();
}

export function getDefaultDialectSaveFilePath(params: { fileName: string; filePath?: string; format: DocumentSourceFormat }): string | undefined {
    const sourcePath = params.filePath || params.fileName;
    if (!sourcePath) return undefined;
    if (params.format === 'xhtml') return sourcePath;
    return replaceFileExtension(sourcePath, '.xhtml');
}

export function replaceFileExtension(fileNameOrPath: string, extension: string): string {
    const currentExtension = getFileExtension(fileNameOrPath);
    return currentExtension ? `${fileNameOrPath.slice(0, -currentExtension.length)}${extension}` : `${fileNameOrPath}${extension}`;
}

function getBaseName(fileNameOrPath: string | undefined): string {
    if (!fileNameOrPath) return '';
    return fileNameOrPath.split(/[\\/]/u).pop() ?? fileNameOrPath;
}
