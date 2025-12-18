
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateCoachResponse = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            systemInstruction: "Você é um Head Coach de Futebol Americano. Seja técnico e inspirador.",
            temperature: 0.8
        }
    });
    return response.text || "";
};

export const validateGymImage = async (base64Data: string): Promise<boolean> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: "A imagem mostra um ambiente de academia ou treino físico? Responda TRUE ou FALSE." },
                { inlineData: { mimeType: "image/jpeg", data: base64Data.split(',')[1] } }
            ]
        }
    });
    return response.text?.trim().toUpperCase().includes('TRUE') || false;
};

export const generateStructuredGymPlan = async (goal: string, equipment: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Plano de academia: ${goal}. Equipamentos: ${equipment}. Retorne JSON array de GymDay.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

export const analyzeOpponentTendencies = async (notes: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise scout: ${notes}. Retorne JSON com summary, keysToVictory e suggestedConcepts.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

export const suggestPlayConcepts = async (situation: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Sugira jogadas para: ${situation}. Retorne JSON array de {name, reason}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

export const analyzeCombineStats = async (stats: any, pos: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise combine ${pos}: ${JSON.stringify(stats)}. Retorne JSON com rating, potential, analysis e comparison.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

export const generatePlayerAnalysis = async (player: any, context: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise atleta ${player.name}: ${context}`,
    });
    return response.text || "";
};

export const generateMarketingContent = async (topic: string, platform: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Post para ${platform}: ${topic}`,
    });
    return response.text || "";
};

export const generateSponsorshipProposal = async (companyName: string, amount: number): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Proposta patrocínio ${companyName} valor R$ ${amount}`,
    });
    return response.text || "";
};

export const classifyCoachVoiceNote = async (text: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Classifique nota técnica: ${text}. Retorne JSON {category, tags, action}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

export const explainPlayImage = async (base64Image: string, question: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: question },
                { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } }
            ]
        }
    });
    return response.text || "";
};

export const scanFinancialDocument = async (base64: string) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Extraia dados do recibo para JSON: {title, amount, date, category, description}." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ],
        },
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

export const predictPlayCall = async (history: any[], down: number, distance: number) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Preveja jogada ${down}&${distance} baseado em: ${JSON.stringify(history)}. Retorne JSON {prediction, confidence, reason}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

export const generateInstallSchedule = async (context: string, week: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Instalação semanal: ${context}. Semana: ${week}. Retorne JSON Array de InstallMatrixItem.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

export const importPlaybookFromImage = async (base64: string) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Extraia jogadores do diagrama para JSON Array de PlayElement." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ],
        },
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

export const generateColorCommentary = async (home: string, away: string, context: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Narração ${home} vs ${away}: ${context}. Retorne JSON {intro, homePlayerToWatch, awayPlayerToWatch, keyMatchups}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

export const generatePracticePlan = (p: string) => generateCoachResponse(p);

export const generatePracticeScript = async (focus: string, duration: number, intensity: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Roteiro treino ${duration}min: ${focus}. Retorne JSON array de PracticeScriptItem.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

/**
 * Simulates a tactical play matchup against an opponent's defense based on scouting reports.
 * @param play The play concept string.
 * @param scouting The scouting report data.
 * @param opponent The name of the opponent team.
 */
export const analyzePlayMatchup = async (play: string, scouting: any, opponent: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Simule a jogada "${play}" contra a defesa de ${opponent} baseando-se no scout: ${JSON.stringify(scouting)}. Retorne um resultado curto.`,
    });
    return response.text || "";
};