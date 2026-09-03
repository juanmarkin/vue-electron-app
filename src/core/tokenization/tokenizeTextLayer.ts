import { t1ToT2Dialect, t2ToT3Dialect } from '../detranscription/dialectDetranscriptor';
import type { MorphologyLayerName, WordMorphologyState } from '../morphology/types';

export type DialectTokenKind = 'paragraph' | 'word';

export type TextParts = {
    left: string;
    core: string;
    right: string;
};

export type DialectLayerName = 'text1' | 'text2' | 'text3';
export type DialectTokenLayer = { value: string; parts: TextParts };
export type DialectParagraphToken = { id: string; kind: 'paragraph'; lineIndex: number };
export type DialectWordToken = {
    id: string;
    kind: 'word';
    note?: string;
    sem?: string;
    lexRef?: string;
    isOrphoError?: boolean;
    morphology?: Partial<Record<MorphologyLayerName, WordMorphologyState>>;
    lineIndex: number;
    wordIndex: number;
    fragmentIndex: number;
    sentenceIndex: number;
    source: string;
    isBracketed: boolean;
    layers: Record<DialectLayerName, DialectTokenLayer>;
};
export type DialectToken = DialectParagraphToken | DialectWordToken;
export type DialectTokenizeResult = {
    tokens: DialectToken[];
    words: DialectWordToken[];
    layers: Record<DialectLayerName, string[]>;
    sentences: string[];
};
export type TokenizeDialectTextOptions = { addParagraphTokens?: boolean; keepEmptyLines?: boolean };

const TOKEN_SPLITTER = /^\s*([^\s{}]+(?:\{[^*%}]*[*%]\})?)(.*)$/u;
const ONLY_PUNCTUATION_RE = /^[,\.:;\?!"«»'\-\(\)\[\]\{\}<>\\/]*$/u;
const TEXT_PARTS_RE = /^([,\.:;"«»'\-\(\)\[\]\{\}<>\\/]*)([^,\.:;\?!"«»'\(\)\[\]\{\}<>\\].*?)([,\.:;\?!"«»'\-–—\(\)\[\]\{\}<>\\/]*)$/u;
const DIALECT_SENTENCE_END_RE = /^[)\]}"»”‟]*[?!.,;:]+[)\]}"»”‟]*$/u;

function createParagraphToken(lineIndex: number): DialectParagraphToken {
    return { id: `p-${lineIndex}`, kind: 'paragraph', lineIndex };
}
function createLayer(value: string): DialectTokenLayer { return { value, parts: splitTextParts(value) }; }

export function splitTextParts(input: string): TextParts {
    const normalized = decodeLegacyEntities(input);
    if (ONLY_PUNCTUATION_RE.test(normalized)) return { left: '', core: normalized, right: '' };
    const match = normalized.match(TEXT_PARTS_RE);
    if (!match) return { left: '', core: normalized, right: '' };
    return { left: match[1] ?? '', core: match[2] ?? '', right: match[3] ?? '' };
}

function decodeLegacyEntities(input: string): string {
    return input.replaceAll('&#769;', '\u0301').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&apos;', "'").replaceAll('&amp;', '&').replaceAll('&quot;', '"');
}

function splitLineToRawTokens(line: string): string[] {
    const result: string[] = [];
    let rest = line;
    while (rest.length > 0) {
        const match = rest.match(TOKEN_SPLITTER);
        if (!match) break;
        const token = match[1];
        const nextRest = match[2] ?? '';
        if (!token) break;
        result.push(token);
        if (nextRest === rest) break;
        rest = nextRest;
    }
    return result;
}

function shouldEndDialectSentence(token: DialectWordToken): boolean {
    return DIALECT_SENTENCE_END_RE.test(token.layers.text3.parts.right);
}

function buildSentences(words: DialectWordToken[]): string[] {
    const sentences: string[] = [];
    for (const word of words) {
        const sentenceIndex = word.sentenceIndex;
        if (!sentences[sentenceIndex]) sentences[sentenceIndex] = '';
        sentences[sentenceIndex] = `${sentences[sentenceIndex]} ${word.layers.text3.value}`.trim();
    }
    return sentences;
}

export function tokenizeDialectText1(text1: string, options: TokenizeDialectTextOptions = {}): DialectTokenizeResult {
    const { addParagraphTokens = true, keepEmptyLines = false } = options;
    const tokens: DialectToken[] = [];
    const words: DialectWordToken[] = [];
    const layers: Record<DialectLayerName, string[]> = { text1: [], text2: [], text3: [] };
    const lines = text1.split(/\r?\n/u);
    let wordIndex = 0;
    let fragmentIndex = 0;
    let sentenceIndex = 0;
    let isBracketed = false;
    let resetBracketOnNextToken = false;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
        const line = lines[lineIndex];
        if (/^\s*$/u.test(line)) {
            if (keepEmptyLines && addParagraphTokens) tokens.push(createParagraphToken(lineIndex));
            continue;
        }
        if (addParagraphTokens) tokens.push(createParagraphToken(lineIndex));
        const rawTokens = splitLineToRawTokens(line);
        for (const source of rawTokens) {
            if (resetBracketOnNextToken) { isBracketed = false; resetBracketOnNextToken = false; }
            if (source.startsWith('[')) isBracketed = true;
            const tokenIsBracketed = isBracketed;
            const text2 = tokenIsBracketed ? source : t1ToT2Dialect(source);
            const text3 = tokenIsBracketed ? source : t2ToT3Dialect(text2);
            const wordToken: DialectWordToken = {
                id: `w-${wordIndex}`, kind: 'word', lineIndex, wordIndex, fragmentIndex, sentenceIndex,
                source, isBracketed: tokenIsBracketed,
                layers: { text1: createLayer(source), text2: createLayer(text2), text3: createLayer(text3) },
            };
            tokens.push(wordToken); words.push(wordToken);
            layers.text1.push(source); layers.text2.push(text2); layers.text3.push(text3);
            if (tokenIsBracketed && /\][^\[]*$/u.test(source)) resetBracketOnNextToken = true;
            if (shouldEndDialectSentence(wordToken)) sentenceIndex += 1;
            wordIndex += 1; fragmentIndex += 1;
        }
    }
    return { tokens, words, layers, sentences: buildSentences(words) };
}

export function tokenizePreparedDialectLayers(text1: string, text2: string, text3: string, options: TokenizeDialectTextOptions = {}): DialectTokenizeResult {
    const { addParagraphTokens = true, keepEmptyLines = false } = options;
    const tokens: DialectToken[] = [];
    const words: DialectWordToken[] = [];
    const layers: Record<DialectLayerName, string[]> = { text1: [], text2: [], text3: [] };
    const lines1 = text1.split(/\r?\n/u), lines2 = text2.split(/\r?\n/u), lines3 = text3.split(/\r?\n/u);
    const maxLines = Math.max(lines1.length, lines2.length, lines3.length);
    let wordIndex = 0, fragmentIndex = 0, sentenceIndex = 0;
    for (let lineIndex = 0; lineIndex < maxLines; lineIndex += 1) {
        const line1 = lines1[lineIndex] ?? '', line2 = lines2[lineIndex] ?? '', line3 = lines3[lineIndex] ?? '';
        const isEmptyLine = /^\s*$/u.test(line1) && /^\s*$/u.test(line2) && /^\s*$/u.test(line3);
        if (isEmptyLine) { if (keepEmptyLines && addParagraphTokens) tokens.push(createParagraphToken(lineIndex)); continue; }
        if (addParagraphTokens) tokens.push(createParagraphToken(lineIndex));
        const rawTokens1 = splitLineToRawTokens(line1), rawTokens2 = splitLineToRawTokens(line2), rawTokens3 = splitLineToRawTokens(line3);
        const maxTokens = Math.max(rawTokens1.length, rawTokens2.length, rawTokens3.length);
        for (let tokenIndex = 0; tokenIndex < maxTokens; tokenIndex += 1) {
            const source = rawTokens1[tokenIndex] ?? '', preparedText2 = rawTokens2[tokenIndex] ?? '', preparedText3 = rawTokens3[tokenIndex] ?? '';
            const wordToken: DialectWordToken = { id: `w-${wordIndex}`, kind: 'word', lineIndex, wordIndex, fragmentIndex, sentenceIndex, source, isBracketed: source.startsWith('['), layers: { text1: createLayer(source), text2: createLayer(preparedText2), text3: createLayer(preparedText3) } };
            tokens.push(wordToken); words.push(wordToken);
            layers.text1.push(source); layers.text2.push(preparedText2); layers.text3.push(preparedText3);
            if (shouldEndDialectSentence(wordToken)) sentenceIndex += 1;
            wordIndex += 1; fragmentIndex += 1;
        }
    }
    return { tokens, words, layers, sentences: buildSentences(words) };
}
