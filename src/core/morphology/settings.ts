export type MorphologyEngineMode = 'mock' | 'native-windows' | 'wine' | 'auto' | 'remote';
export type MorphologySettings = { engineMode: MorphologyEngineMode; winePath?: string };
export type UpdateMorphologySettingsRequest = Partial<MorphologySettings>;
