export type ParsedPlainLayerText = { words: string[]; paragraphs: string[][] };

export function parsePlainLayerText(text: string): ParsedPlainLayerText {
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const paragraphs = normalizedText.split('\n').map((line) => splitLineToWords(line)).filter((words) => words.length > 0);
    return { paragraphs, words: paragraphs.flat() };
}

function splitLineToWords(line: string): string[] {
    return line.trim().split(/\s+/u).filter(Boolean);
}
