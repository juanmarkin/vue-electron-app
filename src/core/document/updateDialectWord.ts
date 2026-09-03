import { DraftWordToken } from '../../renderer/features/params';
import { splitTextParts } from '../tokenization/tokenizeTextLayer';
import type { WorkingDialectDocument } from './types';

export function updateDialectWord(document: WorkingDialectDocument, payload: DraftWordToken): WorkingDialectDocument {
    const updatedWords = document.words.map((word) => word.id !== payload.wordId ? word : ({ ...word, source: payload.text1, layers: { text1: { value: payload.text1, parts: splitTextParts(payload.text1) }, text2: { value: payload.text2, parts: splitTextParts(payload.text2) }, text3: { value: payload.text3, parts: splitTextParts(payload.text3) } }, note: payload.note, lexRef: payload.lexRef, sem: payload.sem }));
    const updatedTokens = document.tokens.map((token) => token.kind !== 'word' || token.id !== payload.wordId ? token : (updatedWords.find((word) => word.id === payload.wordId) ?? token));
    return { ...document, tokens: updatedTokens, words: updatedWords, layers: rebuildLayers(updatedWords), sentences: rebuildSentences(updatedWords), isDirty: true };
}

function rebuildLayers(words: WorkingDialectDocument['words']): WorkingDialectDocument['layers'] {
    return { text1: words.map((word) => word.layers.text1.value), text2: words.map((word) => word.layers.text2.value), text3: words.map((word) => word.layers.text3.value) };
}

function rebuildSentences(words: WorkingDialectDocument['words']): string[] {
    const sentences: string[] = [];
    for (const word of words) {
        const sentenceIndex = word.sentenceIndex;
        if (!sentences[sentenceIndex]) sentences[sentenceIndex] = '';
        sentences[sentenceIndex] = `${sentences[sentenceIndex]} ${word.layers.text3.value}`.trim();
    }
    return sentences;
}
