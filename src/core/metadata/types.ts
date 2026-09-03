export type MetadataSectionKind = 'address' | 'phonetics' | 'dialectText' | 'geography';

export type DialectAddressMetadata = {
    textName: string;
    providerName: string;
    providerContact: string;
    providerPosition: string;
    recorder: string;
    recordingPlaceOblast: string;
    recordingPlaceRegion: string;
    recordingPlaceTown: string;
    recordingYear: string;
    informantId: string;
    informantAge: string;
    informantBirthYear: string;
    informantCity: string;
    informantEducation: string;
    informantOccupation: string;
    informantAdditional: string;
    publicationInfo: string;
    archiveInfo: string;
};

export type MetadataOption = { id: string; label: string; parentId?: string };
export type MetadataFeature = { id: string; label: string; options: MetadataOption[]; selectedOptionIds: string[] };
export type MetadataSubtable = { id: string; label: string; features: MetadataFeature[] };
export type CheckboxMetadataSection = { kind: 'phonetics' | 'dialectText'; subtables: MetadataSubtable[] };
export type GeographyMetadata = { federalDistrict: string; oblast: string; district: string };
export type DialectDocumentMetadata = { address: DialectAddressMetadata; phonetics: CheckboxMetadataSection; dialectText: CheckboxMetadataSection; geography: GeographyMetadata };

export function createEmptyDialectAddressMetadata(): DialectAddressMetadata {
    return { textName: '', providerName: '', providerContact: '', providerPosition: '', recorder: '', recordingPlaceOblast: '', recordingPlaceRegion: '', recordingPlaceTown: '', recordingYear: '', informantId: '', informantAge: '', informantBirthYear: '', informantCity: '', informantEducation: '', informantOccupation: '', informantAdditional: '', publicationInfo: '', archiveInfo: '' };
}
export function createEmptyCheckboxMetadataSection(kind: CheckboxMetadataSection['kind']): CheckboxMetadataSection { return { kind, subtables: [] }; }
export function createEmptyGeographyMetadata(): GeographyMetadata { return { federalDistrict: '', oblast: '', district: '' }; }
export function createEmptyDialectDocumentMetadata(): DialectDocumentMetadata {
    return { address: createEmptyDialectAddressMetadata(), phonetics: createEmptyCheckboxMetadataSection('phonetics'), dialectText: createEmptyCheckboxMetadataSection('dialectText'), geography: createEmptyGeographyMetadata() };
}
