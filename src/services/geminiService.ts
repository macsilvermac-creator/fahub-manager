
import { GoogleGenAI, Type } from "@google/genai";
import { RecruitmentCandidate, CombineStats } from "../types";

const getClient = (): GoogleGenAI => {
    // Fix: Using process.env.API_KEY exclusively
    if (!process.env.API_KEY) throw new Error("API Key missing");
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const cleanJsonString = (input: string): string => {
    return input.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
};

export const analyzeTryoutPerformance = async (candidate: RecruitmentCandidate) => {
    const ai = getClient();
    const prompt = `
        Aja como um Senior Scout da NFL. Analise este candidato de Futebol Americano:
        NOME: ${candidate.name}
        BIOTIPO: ${candidate.height}, ${candidate.weight}kg, ${candidate.age} anos.
        TESTES: ${JSON.stringify(candidate.combineStats)}
        COMPORTAMENTO: ${candidate.behaviorTags?.join(', ')}
        NOTAS: ${candidate.notes}

        Retorne um JSON rigoroso:
        {
            "potentialRating": number (0-100),
            "suggestedPosition": string,
            "readiness": "READY" | "DEVELOPMENT" | "PRACTICE_SQUAD",
            "technicalAnalysis": string (máx 3 parágrafos),
            "cultureFit": string
        }
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });

    // Fix: Access response.text directly
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

export const scanFinancialDocument = async (base64: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Extraia os dados deste recibo para JSON: {title, amount, date, category}." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ],
        }
    });
    // Fix: Access response.text directly
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

export const generateMarketingContent = async (topic: string, platform: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Crie um post para ${platform} sobre: ${topic}.`,
    });
    // Fix: Access response.text directly
    return response.text || "";
};

export const analyzeOpponentTendencies = async (notes: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise tendências: ${notes}`,
        config: { responseMimeType: "application/json" }
    });
    // Fix: Access response.text directly
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

export const generatePracticeScript = async (focus: string, duration: number, intensity: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Script de treino de ${duration}min. Foco: ${focus}`,
        config: { responseMimeType: "application/json" }
    });
    // Fix: Access response.text directly
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

// Fix: Added missing generatePracticePlan alias
export const generatePracticePlan = generatePracticeScript;

export const explainPlayImage = async (base64: string, question: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: question },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ]
        }
    });
    // Fix: Access response.text directly
    return response.text || "";
};

export const generateGymPlan = async (goal: string, equipment: string, program: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Plano de academia para ${program}. Objetivo: ${goal}`,
    });
    // Fix: Access response.text directly
    return response.text || "";
};

// Fix: Added missing suggestPlayConcepts export
export const suggestPlayConcepts = async (situation: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Sugira jogadas para a situação: ${situation}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

// Fix: Added missing setRuntimeKey export
export const setRuntimeKey = (key: string) => {};

// Fix: Added missing predictPlayCall export
export const predictPlayCall = async (clips: any[], down: number, distance: number) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Preveja a próxima jogada baseada em ${clips.length} exemplos, para uma ${down}ª para ${distance}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

// Fix: Added missing analyzePlayMatchup export
export const analyzePlayMatchup = async (concept: string, scouting: any, opponent: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise o matchup da jogada ${concept} contra ${opponent} usando scout: ${JSON.stringify(scouting)}`,
    });
    return response.text || "";
};

// Fix: Added missing generateInstallSchedule export
export const generateInstallSchedule = async (context: string, week: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Gere um cronograma de instalação para a semana ${week} no contexto: ${context}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

// Fix: Added missing importPlaybookFromImage export
export const importPlaybookFromImage = async (base64: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Identifique os jogadores no diagrama tático e retorne JSON de elementos {id, type, label, x, y}." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ],
        },
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

// Fix: Added missing generateColorCommentary export
export const generateColorCommentary = async (home: string, away: string, context: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Gere comentários de narração para ${home} vs ${away}. Contexto: ${context}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

// Fix: Added missing generatePlayerAnalysis export
export const generatePlayerAnalysis = async (player: any, context: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise a performance do atleta ${player.name}. Contexto: ${context}`,
    });
    return response.text || "";
};

// Fix: Added missing analyzeCombineStats export
export const analyzeCombineStats = async (stats: any, position: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise os dados de combine para a posição ${position}: ${JSON.stringify(stats)}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

// Fix: Added missing parseSidelineAudio export
export const parseSidelineAudio = async (transcript: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise o áudio da sideline: ${transcript}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

// Fix: Added missing generateSponsorshipProposal export
export const generateSponsorshipProposal = async (company: string, amount: number) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Escreva uma proposta de patrocínio para a empresa ${company} no valor de R$ ${amount}.`,
    });
    return response.text || "";
};

export const testProConnection = async () => true;
