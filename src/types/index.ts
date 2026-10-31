export type Language = 'en' | 'ur' | 'hi';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface SolutionStep {
  stepNumber: number;
  title: string;
  instruction: string;
  actionableTip?: string;
  commandOrPath?: string;
  isCaution?: boolean;
}

export interface DetailedSolution {
  solutionNumber: number;
  title: string;
  strategy: string;
  steps: SolutionStep[];
  expectedOutcome?: string;
}

export interface AnalysisResult {
  errorTitle: string;
  category: string;
  severity: Severity;
  confidenceScore: number;
  detectedErrorText: string;
  rootCause: string;
  screenshotsAnalyzedCount?: number;
  combinedProblemExplanation?: string;
  fourSolutions?: DetailedSolution[];
  confirmedFacts?: string[];
  possibleCauses?: string[];
  quickFix: string;
  steps: SolutionStep[];
  preventionTips: string[];
  alternativeSolution: string;
  technicalDetails?: string;
}

export interface UploadedScreenshot {
  id: string;
  dataUrl: string;
  fileName: string;
  fileSize: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface SampleError {
  id: string;
  title: string;
  titleUrdu: string;
  titleHindi: string;
  category: string;
  description: string;
  thumbnailSvg: string;
  dataUrl: string;
  contextNote: string;
}
