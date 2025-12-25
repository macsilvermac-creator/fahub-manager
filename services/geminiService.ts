
import { GoogleGenAI, Type } from "@google/genai";
import { TacticalPlay, Player, GameScoutingReport, RecruitmentCandidate } from "../types";

const getAI = () => {
    // Fix: Using correct initialization for GoogleGenAI with API key from process.env.API_KEY
    return new GoogleGenAI({ apiKey: process.env.API_KEY! });
};

const cleanJson = (text: string) => {
    if (!text) return "{}";
    return text.replace(/```json|```/gi, '').trim();
};

export async function parseTacticalDiagram(base64: string, context: string): Promise<Partial<TacticalPlay>> {
    const ai = getAI();
    // Remove cabeçalho data:image/jpeg;base64,
    const cleanBase64 = base64.split(',')[1] || base64;
    
    const prompt = `
        Analise este desenho tático de Futebol Americano.
        Converta círculos em jogadores ofensivos e X em defensivos.
        Retorne estritamente um JSON: {
            "name": "Nome curto",
            "concept": "Descrição técnica 1 frase",
            "unit": "OFFENSE|DEFENSE",
            "category": "RUN|PASS",
            "elements": [
                { "id": "uuid", "type": "OFFENSE|DEFENSE", "label": "POS", "x": 0-600, "y": 0-400 }
            ]
        }
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: prompt },
                { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }
            ]
        }
    });

    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function generatePracticeScript(focus: string, duration: number, intensity: string) {
    const ai = getAI();
    const prompt = `Gere roteiro de treino ${duration}min: ${focus}. Retorne JSON array de { id, startTime, durationMinutes, activityName, type }`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        startTime: { type: Type.STRING },
                        durationMinutes: { type: Type.NUMBER },
                        activityName: { type: Type.STRING },
                        type: { type: Type.STRING }
                    },
                    required: ["id", "startTime", "durationMinutes", "activityName", "type"]
                }
            }
        }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
}

// Fix: Added missing exported functions to satisfy dependencies in other components

export async function generatePracticePlan(prompt: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text || "";
}

export async function analyzeOpponentTendencies(notes: string) {
    const ai = getAI();
    const prompt = `Analise as tendências do adversário baseando-se nestas notas: ${notes}. Retorne JSON com summary (string) e keysToVictory (array de strings).`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING },
                    keysToVictory: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function suggestPlayConcepts(situation: string) {
    const ai = getAI();
    const prompt = `Sugira 3 conceitos de jogadas para a situação: ${situation}. Retorne JSON array de { name, reason }.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        reason: { type: Type.STRING }
                    }
                }
            }
        }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
}

export async function explainPlayImage(base64: string, question: string) {
    const ai = getAI();
    const cleanBase64 = base64.split(',')[1] || base64;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: question },
                { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }
            ]
        }
    });
    return response.text || "";
}

export async function generatePlayerAnalysis(player: Player, context: string) {
    const ai = getAI();
    const prompt = `Analise a evolução do jogador ${player.name} (${player.position}) no contexto: ${context}. Gere um relatório de PDI em português.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt
    });
    return response.text || "";
}

export async function analyzePlayMatchup(playDescription: string, scouting: GameScoutingReport, opponent: string) {
    const ai = getAI();
    const prompt = `Analise a eficácia da jogada "${playDescription}" contra o adversário "${opponent}" que tem este scout: ${scouting.defenseAnalysis}.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt
    });
    return response.text || "";
}

export async function generateGymPlan(goal: string, equipment: string, program: string) {
    const ai = getAI();
    const prompt = `Crie um plano de treino de academia para ${program} focado em ${goal} usando ${equipment}. Use HTML para formatação básica.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text || "";
}

export async function generateMarketingContent(topic: string, platform: string) {
    const ai = getAI();
    const prompt = `Crie um post de marketing para ${platform} sobre o tópico: ${topic}. Seja persuasivo e use emojis.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text || "";
}

export async function generateSponsorshipProposal(company: string, value: number) {
    const ai = getAI();
    const prompt = `Escreva um email profissional de prospecção de patrocínio para a empresa ${company} solicitando o valor de R$ ${value}.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text || "";
}

export async function scanFinancialDocument(base64: string) {
    const ai = getAI();
    const cleanBase64 = base64.split(',')[1] || base64;
    const prompt = `Extraia dados financeiros deste recibo. Retorne JSON: { "title": "string", "amount": number, "date": "YYYY-MM-DD", "category": "TUITION|EQUIPMENT|EVENT|STORE|OTHER" }`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: prompt },
                { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }
            ]
        },
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function generateInstallSchedule(plays: string[]) {
    const ai = getAI();
    const prompt = `Gere uma matriz de instalação semanal para estas jogadas: ${plays.join(', ')}. Retorne formato amigável.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text || "";
}

export async function importPlaybookFromImage(base64: string) {
    const ai = getAI();
    const cleanBase64 = base64.split(',')[1] || base64;
    const prompt = `Identifique jogadores ofensivos e defensivos nesta imagem. Retorne JSON array de elements: { "id": "uuid", "type": "OFFENSE|DEFENSE", "label": "POS", "x": number, "y": number }.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: prompt },
                { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }
            ]
        },
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
}

export async function analyzeTryoutPerformance(candidate: RecruitmentCandidate) {
    const ai = getAI();
    const prompt = `Analise o desempenho deste candidato de tryout: ${candidate.name}, 40y: ${candidate.combineStats?.fortyYards}s. Retorne JSON: { "technicalAnalysis": "string", "potentialRating": number }.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function generateColorCommentary(home: string, away: string, situation: string) {
    const ai = getAI();
    const prompt = `Atue como um narrador de futebol americano. Gere notas de transmissão para ${home} vs ${away}. Contexto: ${situation}. Retorne JSON com intro, homePlayerToWatch, awayPlayerToWatch, keyMatchups (array).`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}
