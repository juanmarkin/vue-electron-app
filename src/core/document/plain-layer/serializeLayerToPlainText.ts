import type { WorkingDialectDocument } from '../types';
type PlainEditableLayerName = 'text2' | 'text3';

export function serializeLayerToPlainText(document: WorkingDialectDocument, layerName: PlainEditableLayerName): string {
    const lines: string[] = [];
    let currentLine: string[] = [];
    function pushCurrentLine() { lines.push(currentLine.join(' ').trim()); currentLine = []; }
    for (const token of document.tokens) {
        if (token.kind === 'paragraph') {
            if (currentLine.length > 0 || lines.length > 0) pushCurrentLine();
            continue;
        }
        currentLine.push(token.layers[layerName].value);
    }
    if (currentLine.length > 0) pushCurrentLine();
    return lines.map((line) => line.trim()).join('\n');
}
