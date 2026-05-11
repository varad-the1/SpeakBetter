import { GoogleGenAI, Type } from "@google/genai";
import { PracticeSession } from "../types/communication";

let aiInstance: GoogleGenAI | null = null;

function getGeminiAI(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API Key is not configured.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function runPracticeAnalysis(
  audioBase64: string,
  mimeType: string,
  durationSeconds: number,
  topicText?: string
): Promise<PracticeSession> {
  const ai = getGeminiAI();
  const model = "gemini-3-flash-preview";

  const systemInstruction = `
    You are a supportive, intelligent speaking companion. 
    Analyze the provided speech recording.
    
    TONE:
    - Conversational, honest, and supportive.
    - Avoid robotic terminology or aggressive warnings.
    - Sound like a mentor or a helpful friend.

    ANALYSIS FOCUS:
    - Fluency (flow, hesitation)
    - Pace (is the speed comfortable?)
    - Clarity (pronunciation, sentence structure)
    - Vocabulary (richness, repetition)
    
    SCORING:
    - ALL scores (overallScore and metric scores) MUST be integers between 0 and 100.
    - 0-100 scale represents the percentage of mastery (100 is perfect, native-like).
    - Do NOT use decimals or 1-10 scales.
    
    OUTPUT:
    - JSON format according to the schema.
    - In conversationalFeedback, sound human. 
      E.g., Instead of "PASSIVE LANGUAGE DETECTED", say "You might feel more confident if you try to be a bit more direct in your explanations."
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          {
            inlineData: {
              data: audioBase64,
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze this speaking practice session. Topic: ${topicText || 'Free talk'}. Length: ${durationSeconds} seconds.`,
          },
        ],
      },
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          transcript: { type: Type.STRING },
          overallScore: { type: Type.NUMBER },
          metrics: {
            type: Type.OBJECT,
            properties: {
              fluency: {
                type: Type.OBJECT,
                properties: { label: { type: Type.STRING }, value: { type: Type.STRING }, score: { type: Type.NUMBER }, feedback: { type: Type.STRING } }
              },
              pace: {
                type: Type.OBJECT,
                properties: { label: { type: Type.STRING }, value: { type: Type.STRING }, score: { type: Type.NUMBER }, feedback: { type: Type.STRING } }
              },
              clarity: {
                type: Type.OBJECT,
                properties: { label: { type: Type.STRING }, value: { type: Type.STRING }, score: { type: Type.NUMBER }, feedback: { type: Type.STRING } }
              },
              vocabulary: {
                type: Type.OBJECT,
                properties: { label: { type: Type.STRING }, value: { type: Type.STRING }, score: { type: Type.NUMBER }, feedback: { type: Type.STRING } }
              },
            },
          },
          fillerWords: { type: Type.ARRAY, items: { type: Type.STRING } },
          conversationalFeedback: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
          },
        },
      },
    },
  });

  const parsed = JSON.parse(response.text);

  // Normalize scores to 0-100 range if they come back as 0-10 or decimals
  const normalize = (val: any) => {
    const num = Number(val);
    if (isNaN(num)) return 0;
    if (num > 0 && num <= 10) return Math.round(num * 10);
    return Math.min(100, Math.max(0, Math.round(num)));
  };

  const normalized = {
    ...parsed,
    overallScore: normalize(parsed.overallScore),
    metrics: {
      fluency: { ...parsed.metrics.fluency, score: normalize(parsed.metrics.fluency?.score) },
      pace: { ...parsed.metrics.pace, score: normalize(parsed.metrics.pace?.score) },
      clarity: { ...parsed.metrics.clarity, score: normalize(parsed.metrics.clarity?.score) },
      vocabulary: { ...parsed.metrics.vocabulary, score: normalize(parsed.metrics.vocabulary?.score) },
    }
  };
  
  return {
    ...normalized,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    durationSeconds,
  };
}
