// Public showcase replacement.
//
// The production application contains a large domain-specific detranscription
// ruleset ported from the legacy editor. That implementation is intentionally
// omitted from the public repository together with the third-party linguistic
// resources it was designed to work with.

const DASH_LIKE_RE = /[\u058A\u05BE\u1400\u1806\u2010-\u2015\u2053\u207B\u208B\u2212\u2E17\u2E1A\u2E3A-\u2E3B\u2E40\u301C\u3030\u30A0\uFE31-\uFE32\uFE58\uFE63\uFF0D]/gu;
const APOSTROPHE_LIKE_RE = /[\u0060\u00B4\u02B9\u02BB-\u02BE\u02C8\u2018-\u201B\u2032\u275B-\u275C\u275F-\u2760\uA78C\uFF07]/gu;

export function normalizeTranscriptionInput(input: string): string {
    return input
        .replace(DASH_LIKE_RE, '-')
        .replace(/-{2,}/gu, '-')
        .replace(APOSTROPHE_LIKE_RE, "'");
}

export function normalizeDialectDetranscriptionInput(input: string): string {
    return normalizeTranscriptionInput(input);
}

export function t1ToT2Dialect(input: string): string {
    return normalizeTranscriptionInput(input);
}

export function t2ToT3Dialect(input: string): string {
    return normalizeTranscriptionInput(input);
}

export function detranscribeDialect(input: string) {
    const text1 = normalizeTranscriptionInput(input);
    const text2 = t1ToT2Dialect(text1);
    const text3 = t2ToT3Dialect(text2);
    return { text1, text2, text3 };
}
