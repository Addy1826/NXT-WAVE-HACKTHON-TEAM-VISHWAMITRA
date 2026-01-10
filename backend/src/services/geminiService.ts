import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { logger } from '../utils/logger';

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            logger.error('GEMINI_API_KEY is not set in environment variables');
            throw new Error('GEMINI_API_KEY is missing');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        // Using gemini-flash-latest
        this.model = this.genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    }

    async generateResponse(prompt: string): Promise<string> {
        try {
            // Configure safety settings to allow discussion of sensitive topics (like mental health)
            // but still block malicious content. We rely on the prompt to handle safety constructively.
            const safetySettings = [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                // Self-harm category removed due to SDK type definition mismatch. 
                // Relying on DANGEROUS_CONTENT and prompt engineering.
            ];

            const result = await this.model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                safetySettings: safetySettings,
            });

            const response = result.response;
            const text = response.text();

            return text;
        } catch (error: any) {
            logger.error('Error generating response from Gemini:', error);
            // Check for safety blocking
            if (error.response?.promptFeedback?.blockReason) {
                logger.warn(`Gemini blocked content: ${error.response.promptFeedback.blockReason}`);
                return "I care about your safety. If you are in immediate danger, please call 988 or text 741741. I cannot continue this specific conversation right now.";
            }
            throw error;
        }
    }

    async checkHealth(): Promise<boolean> {
        try {
            // fast probe
            const result = await this.model.generateContent("ping");
            return !!result.response.text();
        } catch (error) {
            logger.error('Gemini service health check failed:', error);
            return false;
        }
    }
}
