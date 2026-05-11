export type AnalysisType = 'fluency' | 'pace' | 'clarity' | 'fillers';

export interface SimpleMetric {
  label: string;
  value: string | number;
  score: number; // 0-100
  feedback: string;
}

export interface PracticeSession {
  id: string;
  timestamp: string;
  topic?: {
    category: string;
    text: string;
  };
  transcript: string;
  audioUrl?: string;
  durationSeconds: number;
  
  // Simplified Analytics
  overallScore: number;
  metrics: {
    fluency: SimpleMetric;
    pace: SimpleMetric;
    clarity: SimpleMetric;
    vocabulary: SimpleMetric;
  };
  
  fillerWords: string[];
  
  // Conversational Insights
  conversationalFeedback: {
    summary: string;
    strengths: string[];
    improvements: string[];
  };
}
