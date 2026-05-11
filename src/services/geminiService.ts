import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getGeminiAI(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API Key is not configured. Please ensure process.env.GEMINI_API_KEY is set.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function analyzeSpeech(
  audioBase64: string,
  mimeType: string,
  durationSeconds: number
): Promise<AnalysisResult> {
  const ai = getGeminiAI();
  const model = "gemini-2.5-flash";

    const prompt = `
    Analyze this spoken English audio. 
    1. Transcribe the audio accurately.
    2. Provide a detailed analysis of the speaking performance including fluency, grammar, and filler words.
    3. Perform an accent analysis: evaluate clarity, identify pronunciation issues, and assess intonation patterns.
    
    CRITICAL INSTRUCTIONS:
    - The "fillerWords" array must ONLY contain the actual filler word (e.g., "uh") and its integer count.
    - DO NOT include any explanations, reasoning, or concatenated strings in the "word" field.
    - The "count" field must be a pure number, not a string or description.
    
    Return the result in the following JSON format:
    {
      "transcript": "the full text of the speech",
      "fluencyScore": number (1-10),
      "confidenceScore": number (1-10),
      "grammarMistakes": ["mistake 1", "mistake 2"],
      "fillerWords": [{"word": "um", "count": 2}, {"word": "like", "count": 5}],
      "rewrittenNatural": "a more natural spoken version",
      "interviewLevel": "a professional interview-ready version",
      "commonPatterns": "description of recurring issues",
      "exercises": ["exercise 1", "exercise 2"],
      "accentAnalysis": {
        "clarityScore": number (1-10),
        "pronunciationIssues": ["issue 1", "issue 2"],
        "intonationFeedback": "feedback on tone and rhythm",
        "actionableTips": ["tip 1", "tip 2"]
      }
    }
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
            text: prompt,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          transcript: { type: Type.STRING },
          fluencyScore: { type: Type.NUMBER },
          confidenceScore: { type: Type.NUMBER },
          grammarMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
          fillerWords: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                count: { type: Type.NUMBER },
              },
            },
          },
          rewrittenNatural: { type: Type.STRING },
          interviewLevel: { type: Type.STRING },
          commonPatterns: { type: Type.STRING },
          exercises: { type: Type.ARRAY, items: { type: Type.STRING } },
          accentAnalysis: {
            type: Type.OBJECT,
            properties: {
              clarityScore: { type: Type.NUMBER },
              pronunciationIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
              intonationFeedback: { type: Type.STRING },
              actionableTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["clarityScore", "pronunciationIssues", "intonationFeedback", "actionableTips"],
          },
        },
        required: [
          "transcript",
          "fluencyScore",
          "confidenceScore",
          "grammarMistakes",
          "fillerWords",
          "rewrittenNatural",
          "interviewLevel",
          "commonPatterns",
          "exercises",
          "accentAnalysis"
        ],
      },
    },
  });

  const result = JSON.parse(response.text || "{}");
  
  // Robust parsing for filler words
  const fillerWords = (result.fillerWords || []).map((fw: any) => ({
    word: String(fw.word || "").split(/[-:]/)[0].trim(), // Strip any trailing explanations
    count: Number(fw.count) || 0
  })).filter((fw: any) => fw.word && fw.count > 0);

  const totalFillerCount = fillerWords.reduce((acc: number, curr: any) => acc + curr.count, 0);
  const fillerPerMinute = durationSeconds > 0 ? (totalFillerCount / (durationSeconds / 60)) : 0;

  return {
    ...result,
    fillerWords,
    totalFillerCount,
    fillerPerMinute: parseFloat(fillerPerMinute.toFixed(1)),
    durationSeconds,
    timestamp: new Date().toISOString(),
  };
}

export async function analyzeText(
  transcript: string,
  durationSeconds: number
): Promise<AnalysisResult> {
  const ai = getGeminiAI();
  const model = "gemini-2.5-flash";

    const prompt = `
    Analyze this spoken English transcript.
    Transcript: ${transcript}
    
    CRITICAL INSTRUCTIONS:
    - The "fillerWords" array must ONLY contain the actual filler word (e.g., "uh") and its integer count.
    - DO NOT include any explanations, reasoning, or concatenated strings in the "word" field.
    - The "count" field must be a pure number, not a string or description.
    
    Return the result in the following JSON format:
    {
      "fluencyScore": number (1-10),
      "confidenceScore": number (1-10),
      "grammarMistakes": ["mistake 1", "mistake 2"],
      "fillerWords": [{"word": "um", "count": 2}, {"word": "like", "count": 5}],
      "rewrittenNatural": "a more natural spoken version",
      "interviewLevel": "a professional interview-ready version",
      "commonPatterns": "description of recurring issues",
      "exercises": ["exercise 1", "exercise 2"],
      "accentAnalysis": {
        "clarityScore": number (1-10),
        "pronunciationIssues": ["issue 1", "issue 2"],
        "intonationFeedback": "feedback on tone and rhythm",
        "actionableTips": ["tip 1", "tip 2"]
      }
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          fluencyScore: { type: Type.NUMBER },
          confidenceScore: { type: Type.NUMBER },
          grammarMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
          fillerWords: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                count: { type: Type.NUMBER },
              },
            },
          },
          rewrittenNatural: { type: Type.STRING },
          interviewLevel: { type: Type.STRING },
          commonPatterns: { type: Type.STRING },
          exercises: { type: Type.ARRAY, items: { type: Type.STRING } },
          accentAnalysis: {
            type: Type.OBJECT,
            properties: {
              clarityScore: { type: Type.NUMBER },
              pronunciationIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
              intonationFeedback: { type: Type.STRING },
              actionableTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["clarityScore", "pronunciationIssues", "intonationFeedback", "actionableTips"],
          },
        },
        required: [
          "fluencyScore",
          "confidenceScore",
          "grammarMistakes",
          "fillerWords",
          "rewrittenNatural",
          "interviewLevel",
          "commonPatterns",
          "exercises",
          "accentAnalysis"
        ],
      },
    },
  });

  const result = JSON.parse(response.text || "{}");
  
  // Robust parsing for filler words
  const fillerWords = (result.fillerWords || []).map((fw: any) => ({
    word: String(fw.word || "").split(/[-:]/)[0].trim(), // Strip any trailing explanations
    count: Number(fw.count) || 0
  })).filter((fw: any) => fw.word && fw.count > 0);

  const totalFillerCount = fillerWords.reduce((acc: number, curr: any) => acc + curr.count, 0);
  const fillerPerMinute = durationSeconds > 0 ? (totalFillerCount / (durationSeconds / 60)) : 0;

  return {
    ...result,
    transcript,
    fillerWords,
    totalFillerCount,
    fillerPerMinute: parseFloat(fillerPerMinute.toFixed(1)),
    durationSeconds,
    timestamp: new Date().toISOString(),
  };
}
