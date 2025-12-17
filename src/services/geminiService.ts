
import { GoogleGenAI } from "@google/genai";

const ENV_API_KEY = process.env.API_KEY || "";
let aiClientInstance: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
    if (!aiClientInstance && ENV_API_KEY) {
        aiClientInstance = new GoogleGenAI({ apiKey: ENV_API_KEY });
    }
    return aiClientInstance!;
};

// --- CORE GENERATION ---

export const generateCoachResponse = async (prompt: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            systemInstruction: "Você é um Head Coach motivador de Futebol Americano. Use gírias do esporte, seja firme mas encorajador. Sua missão é elevar o QI de futebol americano dos atletas. Responda em PT-BR.",
            temperature: 0.8
        }
    });
    return response.text || "";
};

// --- IMAGE VALIDATION ---

export const validateGymImage = async (base64Data: string): Promise<boolean> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: "Analise esta imagem. Ela contém equipamentos de academia, pesos, esteiras ou ambiente de treino físico? Responda apenas TRUE ou FALSE." },
                { inlineData: { mimeType: "image/jpeg", data: base64Data.split(',')[1] } }
            ]
        }
    });
    return response.text?.trim().toUpperCase().includes('TRUE') || false;
};

// --- TACTICAL & SCOUTING ---

export const analyzeCombineStats = async (stats: any, pos: string) => {
    const prompt = `Analyze Combine stats for ${pos}: ${JSON.stringify(stats)}. Return JSON with properties: rating (0-100), potential (string), analysis (string), comparison (string).`;
    const ai = getClient();
    const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(res.text || "{}");
};

export const generatePracticeScript = async (focus: string, duration: number, intensity: string) => {
    const prompt = `Create Football Practice Script JSON. Focus: "${focus}". Duration: ${duration}min. Return Array of objects with properties: startTime, durationMinutes, type, activityName, description. Start 19:00.`;
    const ai = getClient();
    const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(res.text || "[]");
};

export const classifyCoachVoiceNote = async (text: string) => {
    const prompt = `Analyze football coach note: "${text}". Return JSON with properties: category ('OFFENSE'|'DEFENSE'|'SPECIAL'|'GENERAL'), tags (string[]), sentiment ('POSITIVE'|'NEGATIVE'|'NEUTRAL'), action (string, optional).`;
    const ai = getClient();
    const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(res.text || "{}");
};

export const analyzePlayMatchup = async (play: string, scout: any, opponent: string) => {
    const prompt = `Simulate play "${play}" vs "${opponent}" defense based on scout: ${JSON.stringify(scout)}. Provide a short result summary.`;
    return await generateCoachResponse(prompt);
};

export const generateInstallSchedule = async (context: string, week: string) => {
    const prompt = `Create install schedule JSON for context: "${context}". Week: "${week}". Return Array of objects with properties: id, day, category, concept.`;
    const ai = getClient();
    const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(res.text || "[]");
};

export const importPlaybookFromImage = async (base64: string) => {
    const prompt = "Extract players from diagram to JSON Array of objects with properties: id, type ('OFFENSE'|'DEFENSE'), label, x, y. 600x400 canvas.";
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: prompt },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ]
        },
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

export const explainPlayImage = async (base64: string, question: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: `Analyze this tactical diagram: ${question}` },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ]
        }
    });
    return response.text || "";
};

export const generateColorCommentary = async (home: string, away: string, context: string) => {
    const prompt = `Generate color commentary notes for ${home} vs ${away}. Context: ${context}. Return JSON with properties: intro (string), homePlayerToWatch (string), awayPlayerToWatch (string), keyMatchups (string[]).`;
    const ai = getClient();
    const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(res.text || "{}");
};

export const predictPlayCall = async (history: any[], down: number, dist: number) => {
    const prompt = `Predict next play based on situation ${down}&${dist}. History: ${JSON.stringify(history)}. Return JSON with properties: prediction (string), confidence (string), reason (string).`;
    const ai = getClient();
    const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(res.text || "{}");
};

// --- LEGACY HELPERS ---

export const generatePracticePlan = (p: string) => generateCoachResponse(p);
export const generatePlayerAnalysis = (p: any, c: string) => generateCoachResponse(`Analise o atleta ${p.name}: ${c}`);
export const generateMarketingContent = (t: string, p: string) => generateCoachResponse(`Crie um post para ${p} sobre: ${t}`);
export const generateStructuredGymPlan = async (g: string, e: string) => {
    const prompt = `Crie um plano de treino para: ${g}. Equipamentos: ${e}. Retorne apenas um JSON Array de objetos GymDay.`;
    const ai = getClient();
    const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(res.text || "[]");
};
export const generateSponsorshipProposal = (company: string, value: number) => generateCoachResponse(`Escreva um email de prospecção para a empresa ${company} solicitando patrocínio de R$ ${value}.`);
export const scanFinancialDocument = async (base64: string) => {
    const prompt = "Extraia título, valor e data deste recibo em JSON.";
    const ai = getClient();
    const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }, { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }] },
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(res.text || "{}");
};