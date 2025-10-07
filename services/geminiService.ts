import { GoogleGenAI } from "@google/genai";

// We will initialize this on first use to avoid crashing the app on load
// if the API key is not present.
let ai: GoogleGenAI | null = null;

function getAiInstance(): GoogleGenAI {
    if (ai) {
        return ai;
    }

    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        // This error will be caught by the UI and displayed to the user,
        // which is better than crashing the whole application.
        throw new Error("Google Gemini API 키가 설정되지 않았습니다. 앱이 작동하려면 환경 변수에 API_KEY를 설정해야 합니다.");
    }

    ai = new GoogleGenAI({ apiKey: API_KEY });
    return ai;
}


type ImagePart = {
    mimeType: string;
    data: string;
};

export async function analyzeProblem(prompt: string, image: ImagePart | null, onChunk: (chunk: string) => void): Promise<void> {
    const model = 'gemini-2.5-flash';
    
    const parts: any[] = [{ text: prompt }];

    if (image) {
        parts.push({
            inlineData: {
                mimeType: image.mimeType,
                data: image.data,
            },
        });
    }

    try {
        const genAI = getAiInstance(); // Get instance here, may throw an error

        const response = await genAI.models.generateContentStream({
            model: model,
            contents: { parts: parts },
            config: {
                 systemInstruction: "You are an expert problem solver. Analyze the user's text and/or image input, identify the core problem, and provide a clear, step-by-step solution. If it's a math problem, show your work. If it's code, explain the error and suggest a fix. If it's a general question, provide a comprehensive answer. Format your response in Korean using markdown.",
            }
        });

        for await (const chunk of response) {
            onChunk(chunk.text);
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // Re-throw the error so it can be handled by the UI component
        throw error;
    }
}
