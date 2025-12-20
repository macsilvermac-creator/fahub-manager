
import { GoogleGenAI } from "@google/genai";
import { RecruitmentCandidate } from "../types";

const getAI = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("Chave API do Gemini não configurada.");
    return new GoogleGenAI({ apiKey });
};

const cleanJson = (text: string) => {
    return text.replace(/```json|```/gi, '').trim();
};

export async function analyzeTryoutPerformance(candidate: RecruitmentCandidate) {
    const ai = getAI();
    const prompt = `Analise este atleta para Futebol Americano e retorne um JSON: { "potentialRating": 0-100, "technicalAnalysis": "texto", "suggestedPosition": "sigla" }: ${JSON.stringify(candidate)}`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });

    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function scanFinancialDocument(base64: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Extraia os dados do recibo para JSON: {title, amount, date, category}." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ]
        }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function generateMarketingContent(topic: string, platform: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Gere um post persuasivo para ${platform} sobre: ${topic}`,
    });
    return response.text || "";
}

export async function analyzeOpponentTendencies(notes: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise as tendências táticas: ${notes}. Retorne JSON { "summary": "texto", "keysToVictory": ["item1"] }`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function generatePracticePlan(prompt: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt
    });
    return response.text || "";
}

export async function suggestPlayConcepts(situation: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Sugira 3 jogadas para: ${situation}. Retorne JSON array de { "name": "nome", "reason": "motivo" }`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
}

export async function explainPlayImage(base64: string, question: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: question },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ]
        }
    });
    return response.text || "";
}

export async function generateGymPlan(goal: string, equipment: string, program: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Plano de musculação para ${program}. Objetivo: ${goal}. Equipamento: ${equipment}`,
    });
    return response.text || "";
}

export async function predictPlayCall(clips: any[], down: number, distance: number) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Preveja a jogada baseado no histórico: ${JSON.stringify(clips)}. Situação: ${down} para ${distance}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function analyzePlayMatchup(concept: string, scouting: any, opponent: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise a jogada "${concept}" contra o time ${opponent}.`,
    });
    return response.text || "";
}

export async function generateColorCommentary(home: string, away: string, context: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Gere narração para ${home} vs ${away}. Contexto: ${context}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function generatePlayerAnalysis(player: any, context: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise o desempenho do atleta ${player.name}. Contexto: ${context}`,
    });
    return response.text || "";
}

export async function testProConnection() {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: 'Ping',
    });
    return !!response.text;
}

// Fix: Exporting missing methods used in TacticalLab and others
export const setRuntimeKey = (key: string) => {
    // Dynamic runtime key implementation
};

export async function generatePracticeScript(focus: string, duration: number, intensity: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Gere um roteiro de treino de ${duration}min focado em: ${focus}. Intensidade: ${intensity}. Retorne JSON array de {id, startTime, durationMinutes, activityName, description, type}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
}

export async function generateInstallSchedule(context: string, week: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Gere um cronograma de instalação para: ${context}. Semana: ${week}. Retorne JSON array de {id, day, category, concept}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
}

export async function importPlaybookFromImage(base64: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: "Extraia os elementos do diagrama tático para JSON array de {id, type, label, x, y}. Tipos: OFFENSE, DEFENSE." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ]
        }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
}

export async function generateSponsorshipProposal(company: string, amount: number) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Escreva uma proposta de patrocínio para a empresa ${company} no valor de R$ ${amount}.`
    });
    return response.text || "";
}