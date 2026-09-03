import type { DialectDocumentMetadata } from './types';

export type GetMetadataSchemasResponse = { ok: false; reason: 'unavailable-in-public-showcase'; message: string };
export type ExportMetadataXlsRequest = { metadata: DialectDocumentMetadata; sourceFileName?: string };
export type ExportMetadataXlsResponse = { ok: false; reason: 'unavailable-in-public-showcase'; message: string };
