export enum Difficulty {
  CASUAL = "Casual",
  ACADEMIC = "Academic",
  INTERVIEW = "Interview",
  TECHNICAL = "Technical",
}

export interface SpeakingTopic {
  id: string;
  text: string;
  difficulty: Difficulty;
  date: string;
}

export interface AnalysisResult {
  fluencyScore: number;
  confidenceScore: number;
  grammarMistakes: string[];
  fillerWords: { word: string; count: number }[];
  rewrittenNatural: string;
  interviewLevel: string;
  commonPatterns: string;
  exercises: string[];
  totalFillerCount: number;
  fillerPerMinute: number;
  durationSeconds: number;
  timestamp: string;
  transcript: string;
  accentAnalysis?: {
    clarityScore: number;
    pronunciationIssues: string[];
    intonationFeedback: string;
    actionableTips: string[];
  };
}

export interface UserProgress {
  history: AnalysisResult[];
}
