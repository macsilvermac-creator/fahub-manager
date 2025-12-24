import { GoogleGenAI } from "@google/genai";
import { RecruitmentCandidate, Player } from "../types";

const getAI = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("Chave API do Gemini não configurada nas variáveis de ambiente.");
    return new GoogleGenAI({ apiKey });
};

const cleanJson = (text: string) => {
    return text.replace(/```json|```/gi, '').trim();
};

export async function analyzeTryoutPerformance(candidate: RecruitmentCandidate) {
    const ai = getAI();
    const prompt = `Analise tecnicamente o desempenho deste atleta de Futebol Americano no Tryout: ${JSON.stringify(candidate)}. Retorne um JSON com: { "potentialRating": number (0-100), "technicalAnalysis": "string" }`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
            responseMimeType: "application/json"
        }
    });

    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function generatePracticeScript(focus: string, duration: number, intensity: string) {
    const ai = getAI();
    const prompt = `Como um Head Coach de elite, gere um roteiro de treino de ${duration}min focado em: ${focus}. Intensidade esperada: ${intensity}. Retorne um array JSON de objetos { id, startTime, durationMinutes, activityName, type } onde type pode ser WARMUP, INDY, GROUP, TEAM, CONDITIONING.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 1024 } 
        }
    });

    return JSON.parse(cleanJson(response.text || "[]"));
}

export async function generatePracticePlan(prompt: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt
    });
    return response.text || "";
}

export async function generatePlayerAnalysis(player: Player, context: string) {
    const ai = getAI();
    const prompt = `Analise o perfil e evolução do atleta ${player.name} (Posição: ${player.position}, OVR: ${player.rating}). Contexto de performance: ${context}. Gere um relatório PDI (Plano de Desenvolvimento Individual).`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { thinkingConfig: { thinkingBudget: 1024 } }
    });
    return response.text || "";
}

export async function scanFinancialDocument(base64: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Extraia os dados deste recibo de despesa da associação esportiva. Retorne JSON: {title, amount, date (YYYY-MM-DD), category (TRANSPORT, EQUIPMENT, REFEREE, FIELD_RENTAL, EVENT, OTHER)}." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ]
        }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function analyzeOpponentTendencies(notes: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise as tendências táticas do adversário baseada nestas anotações de scout: ${notes}. Retorne JSON com { summary: string, keysToVictory: string[] }`,
        config: { responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 2048 } }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function suggestPlayConcepts(situation: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Sugira conceitos de jogadas (Play Call) para a seguinte situação: ${situation}. Retorne um array JSON de objetos { name, reason }.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
}

export async function explainPlayImage(base64: string, question: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: `Como um coordenador tático, analise este diagrama ou frame de vídeo e responda: ${question}` },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ]
        }
    });
    return response.text || "";
}

export async function generateMarketingContent(topic: string, platform: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Escreva um post engajador para ${platform} sobre o seguinte tópico do time de Futebol Americano: ${topic}. Use emojis e tom motivacional/épico.`
    });
    return response.text || "";
}

export async function generateSponsorshipProposal(company: string, amount: number) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Crie uma proposta de patrocínio formal para a empresa ${company} solicitando o valor de R$ ${amount}. Destaque o retorno de marca em um esporte que cresce 20% ao ano no Brasil.`,
        config: { thinkingConfig: { thinkingBudget: 1024 } }
    });
    return response.text || "";
}

export async function generateColorCommentary(home: string, away: string, context: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Gere notas de narração (Spotter Notes) para o jogo ${home} vs ${away}. Contexto atual: ${context}. Retorne JSON: { intro: string, homePlayerToWatch: string, awayPlayerToWatch: string, keyMatchups: string[] }`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}
