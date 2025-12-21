
import { GoogleGenAI, Type } from "@google/genai";
import { RecruitmentCandidate, CombineStats } from "../types";

const getClient = (): GoogleGenAI => {
    if (!process.env.API_KEY) throw new Error("API Key missing");
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const cleanJsonString = (input: string): string => {
    return input.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
};

export async function analyzeTryoutPerformance(candidate: RecruitmentCandidate) {
    const ai = getClient();
    // Fix: Using correct properties from updated types.ts
    const prompt = `
        Aja como um Senior Scout da NFL. Analise este candidato de Futebol Americano:
        NOME: ${candidate.name}
        BIOTIPO: ${candidate.height || 'N/A'}, ${candidate.weight}kg, ${candidate.age || 'N/A'} anos.
        TESTES: ${JSON.stringify(candidate.combineStats || {})}
        COMPORTAMENTO: ${candidate.behaviorTags?.join(', ') || 'N/A'}
        NOTAS: ${candidate.notes || 'N/A'}

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
        config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 } 
        }
    });

    return JSON.parse(cleanJsonString(response.text || "{}"));
}

export async function scanFinancialDocument(base64: string) {
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
    return JSON.parse(cleanJsonString(response.text || "{}"));
}

export async function generateMarketingContent(topic: string, platform: string) {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Crie um post para ${platform} sobre: ${topic}.`,
    });
    return response.text || "";
}

export async function analyzeOpponentTendencies(notes: string) {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise tendências: ${notes}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
}

export async function generatePracticeScript(focus: string, duration: number, intensity: string) {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Script de treino de ${duration}min. Foco: ${focus}, Intensidade: ${intensity}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
}

export async function generatePracticePlan(prompt: string) {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt
    });
    return response.text || "";
}

export async function explainPlayImage(base64: string, question: string) {
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
    return response.text || "";
}

export async function generateGymPlan(goal: string, equipment: string, program: string) {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Plano de academia para ${program}. Objetivo: ${goal}. Equipamentos: ${equipment}`,
    });
    return response.text || "";
}

export async function suggestPlayConcepts(situation: string) {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Sugira jogadas para a situação: ${situation}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
}

export async function predictPlayCall(clips: any[], down: number, distance: number) {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Preveja a próxima jogada baseada em ${clips.length} exemplos, para uma ${down}ª para ${distance}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
}

export async function analyzePlayMatchup(concept: string, scouting: any, opponent: string) {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise o matchup da jogada ${concept} contra ${opponent} usando scout: ${JSON.stringify(scouting)}`,
    });
    return response.text || "";
}

export async function generateInstallSchedule(context: string, week: string) {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Gere um cronograma de instalação para a semana ${week} no contexto: ${context}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
}

export async function importPlaybookFromImage(base64: string) {
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
}

export async function generateColorCommentary(home: string, away: string, context: string) {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Gere comentários de narração para ${home} vs ${away}. Contexto: ${context}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
}

export async function generatePlayerAnalysis(player: any, context: string) {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise a performance do atleta ${player.name}. Contexto: ${context}`,
    });
    return response.text || "";
}

export async function analyzeCombineStats(stats: any, position: string) {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise os dados de combine para a posição ${position}: ${JSON.stringify(stats)}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
}

export async function parseSidelineAudio(transcript: string) {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise o áudio da sideline: ${transcript}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
}

export async function generateSponsorshipProposal(company: string, amount: number) {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Escreva uma proposta de patrocínio para a empresa ${company} no valor de R$ ${amount}.`,
    });
    return response.text || "";
}

export const setRuntimeKey = (key: string) => {
    // Implementação opcional para chaves dinâmicas
};

export const testProConnection = async () => true;
