import type { WorkingDialectDocument } from '../document/types';
import type { MorphologyLayerName, WordMorphologyState } from './types';

export type AnalyzeWordRequest = { tokenId: string; value: string; layerName: MorphologyLayerName };
export type AnalyzeDocumentRequest = { document: WorkingDialectDocument; layerName?: MorphologyLayerName };
export type PublicMorphologyUnavailable = { ok: false; reason: 'unavailable-in-public-showcase'; message: string };
export type AnalyzeWordResponse = PublicMorphologyUnavailable | { ok: true; state: WordMorphologyState };
export type AnalyzeDocumentResponse = PublicMorphologyUnavailable;
export type GetDialectFeaturesTableResponse = PublicMorphologyUnavailable;
