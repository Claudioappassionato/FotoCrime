export enum AnalysisMode {
  FULL_REPORT = 'FULL_REPORT', // Generale
  SYMBOLOGY = 'SYMBOLOGY', // Simbologia
  TECHNIQUE_GEO = 'TECHNIQUE_GEO', // Tecnica e Geologia
  CULTURAL_COMPARE = 'CULTURAL_COMPARE', // Confronto Culturale
  EXPERT_VALIDATION = 'EXPERT_VALIDATION' // Analisi Specialistica
}

export interface AnalysisResult {
  markdown: string;
  timestamp: string;
  mode: AnalysisMode;
  imageUrls: string[]; 
}

export interface ProcessingState {
  isAnalyzing: boolean;
  statusMessage: string;
}