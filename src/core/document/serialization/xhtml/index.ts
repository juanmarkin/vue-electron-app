import type { WorkingDialectDocument } from '../../types';

export type XhtmlExportLayerName = 'text1' | 'text2' | 'text3';
export type XhtmlMorphologyExportLayerName = 'text2' | 'text3';

export function exportDialectXhtml(document: WorkingDialectDocument, layerName: XhtmlExportLayerName = 'text3'): string {
    const lines: string[] = [];
    let current: string[] = [];
    for (const token of document.tokens) {
        if (token.kind === 'paragraph') {
            if (current.length) { lines.push(`<p>${current.join(' ')}</p>`); current = []; }
            continue;
        }
        current.push(escapeXmlText(token.layers[layerName].value));
    }
    if (current.length) lines.push(`<p>${current.join(' ')}</p>`);
    return `<?xml version="1.0" encoding="UTF-8"?>\n<html xmlns="http://www.w3.org/1999/xhtml"><head><meta charset="UTF-8" /></head><body>${lines.join('')}</body></html>`;
}

function escapeXmlText(value: string): string {
    return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}
