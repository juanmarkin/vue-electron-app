export type MorphologyLayerName = 'text2' | 'text3';
export type MorphologyDisplayMode = 'lat' | 'rus';
export type MorphologyAnalysisQuality = 'norm' | 'bastard' | 'nonlex' | 'ciph' | 'unknown';
export type DialectFeatureLevel = 'stem' | 'flexion' | 'suffix' | 'form' | 'animacy' | 'gender' | 'number' | 'case' | 'declension' | 'contractedness' | 'fullness' | 'aspect' | 'transitivity' | 'reflexivity' | 'tense';
export type DialectFeatures = { isDialectal: boolean; levels: DialectFeatureLevel[]; comment?: string };
export type LemmerRawAnalysis = { raw: string; input: string; surface: string; score: number; status: string; statusFlags: string[]; grammemesRaw: string; lemma: string; start: number; end: number; lang: string; flags: string[] };
export type MorphologyAnalysis = {
    id: string; input: string; surface: string; lex: string; gr: string; grammemes: string[]; lang: string;
    quality: MorphologyAnalysisQuality; raw: string; source: 'auto' | 'manual'; sem?: string; sem2?: string; note?: string; lexRef?: string;
    dialectFeatures?: DialectFeatures; isNorm: boolean; isCiph: boolean; isBastard: boolean; isNonLex: boolean;
};
export type WordMorphologyState = { analyses: MorphologyAnalysis[]; selectedAnalysisId?: string; isAnalyzed: boolean; isOrphoError: boolean; rawLines: string[] };
export type MorphologyInputSkipReason = 'empty' | 'bracketed';
export type MorphologyInputToken = { tokenId: string; value: string; normalizedInput: string; isBracketed: boolean; shouldAnalyze: boolean; skipReason?: MorphologyInputSkipReason };
