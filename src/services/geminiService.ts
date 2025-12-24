import { GoogleGenAI } from "@google/genai";
import { RecruitmentCandidate, Player } from "../types";

const getAI = () => {
    // A API KEY é injetada via processo de build (Vite define)
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

const cleanJson = (text: string) => {
    return text.replace(/```json|```/gi, '').trim();
};

export async function analyzeTryoutPerformance(candidate: RecruitmentCandidate) {
    const ai = getAI();
    const prompt = `Analise tecnicamente o atleta: ${JSON.stringify(candidate)}. Retorne JSON: { "potentialRating": number, "technicalAnalysis": "string" }`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });

    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function generatePracticeScript(focus: string, duration: number, intensity: string) {
    const ai = getAI();
    const prompt = `Gere roteiro de treino de ${duration}min focado em: ${focus}. Retorne array JSON de { id, startTime, durationMinutes, activityName, type }`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
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
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Extraia dados do recibo para JSON: {title, amount, date, category}." },
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
        contents: `Analise taticamente estas tendências: ${notes}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function suggestPlayConcepts(situation: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Sugira conceitos de jogadas para: ${situation}`,
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
                { text: `Explique este diagrama: ${question}` },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ]
        }
    });
    return response.text || "";
}

export async function analyzePlayMatchup(concept: string, scouting: any, opponent: string) {
    const ai = getAI();
    const prompt = `Analise a jogada ${concept} contra o scout de ${opponent}: ${JSON.stringify(scouting)}`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt
    });
    return response.text || "";
}

export async function importPlaybookFromImage(base64: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Converta este diagrama em um array JSON de objetos {id, type, label, x, y}." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ]
        }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
}

export async function generateMarketingContent(topic: string, platform: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Escreva um post de marketing para ${platform} sobre: ${topic}`
    });
    return response.text || "";
}

export async function generateSponsorshipProposal(company: string, amount: number) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Escreva uma proposta formal para ${company} no valor de R$ ${amount}`
    });
    return response.text || "";
}

export async function generateColorCommentary(home: string, away: string, context: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Gere comentários de narração para ${home} vs ${away}. Contexto: ${context}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function generateInstallSchedule(context: string) {
    const ai = getAI();
    const prompt = `Gere um cronograma de instalação tática em JSON array de { id, day, category, concept } baseado em: ${context}`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
}

export async function generateGymPlan(goal: string, equipment: string, program: string) {
    const ai = getAI();
    const prompt = `Crie um plano de treino focado em ${goal} para um atleta de ${program}. Equipamento: ${equipment}. Formate em HTML.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt
    });
    return response.text || "";
}