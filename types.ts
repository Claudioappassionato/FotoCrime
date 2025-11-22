export enum AnalysisType {
  ANOMALIES = 'ANOMALIES',
  SUBSTANCES = 'SUBSTANCES',
  SPATIAL = 'SPATIAL',
  TRAJECTORY = 'TRAJECTORY',
  FULL_REPORT = 'FULL_REPORT'
}

export interface AnalysisResult {
  type: AnalysisType;
  timestamp: string;
  content: string;
}

export interface UploadedImage {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}