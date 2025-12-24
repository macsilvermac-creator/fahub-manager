
import { GoogleGenAI } from "@google/genai";
import { RecruitmentCandidate, Player } from "../types";

const getAI = () => {
    // Guidelines: Always use named parameter for apiKey and exclusive process.env.API_KEY
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("Chave API do Gemini não configurada.");
    return new GoogleGenAI({ apiKey });
};

const cleanJson = (text: string) => {
    if (!text) return "{}";
    return text.replace(/```json|```/gi, '').trim();
};

export async function analyzeTryoutPerformance(candidate: RecruitmentCandidate) {
    const ai = getAI();
    const prompt = `Analise este candidato de Futebol Americano: ${JSON.stringify(candidate)}. Retorne JSON: { "potentialRating": number, "technicalAnalysis": "string" }`;
    
    // Guidelines: thinkingConfig for Gemini 3 series
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 1024 } 
        }
    });

    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function generatePracticeScript(focus: string, duration: number, intensity: string) {
    const ai = getAI();
    const prompt = `Gere treino de ${duration}min focado em: ${focus}. Intensidade: ${intensity}. Retorne array JSON de { id, startTime, durationMinutes, activityName, type }`;

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
    const prompt = `Analise o atleta ${player.name} (${player.position}) no contexto: ${context}.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text || "";
}

export async function scanFinancialDocument(base64: string) {
    const ai = getAI();
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Extraia dados do recibo para JSON: {title, amount, date, category}." },
                { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }
            ]
        }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function analyzeOpponentTendencies(notes: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise as tendências: ${notes}`,
        config: { responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 1024 } }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function suggestPlayConcepts(situation: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Sugira jogadas para: ${situation}`,
        config: { responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 1024 } }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
}

export async function explainPlayImage(base64: string, question: string) {
    const ai = getAI();
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: `Explique: ${question}` },
                { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }
            ]
        }
    });
    return response.text || "";
}

export async function analyzePlayMatchup(concept: string, scouting: any, opponent: string) {
    const ai = getAI();
    const prompt = `Analise ${concept} contra ${opponent}: ${JSON.stringify(scouting)}`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt
    });
    return response.text || "";
}

export async function importPlaybookFromImage(base64: string) {
    const ai = getAI();
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Converta diagrama para JSON array de {id, type, label, x, y}." },
                { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }
            ]
        }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
}

export async function generateMarketingContent(topic: string, platform: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Copy de marketing para ${platform}: ${topic}`
    });
    return response.text || "";
}

export async function generateSponsorshipProposal(company: string, amount: number) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Proposta para ${company} de R$ ${amount}`
    });
    return response.text || "";
}

export async function generateColorCommentary(home: string, away: string, context: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Narrador: ${home} vs ${away}. Contexto: ${context}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

/* Fix: Added missing generateInstallSchedule export */
export async function generateInstallSchedule(context: string) {
    const ai = getAI();
    const prompt = `Gere um cronograma de instalação tática baseado neste contexto: ${context}. Retorne array JSON de { id, day, category, concept }`;
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

/* Fix: Added missing generateGymPlan export */
export async function generateGymPlan(goal: string, equipment: string, program: string) {
    const ai = getAI();
    const prompt = `Gere um plano de treinamento de força focado em ${goal} para a modalidade ${program} com os seguintes equipamentos: ${equipment}. Retorne HTML formatado.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt
    });
    return response.text || "";
}
