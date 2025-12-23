import { GoogleGenAI } from "@google/genai";
import { RecruitmentCandidate, Player } from "../types";

const cleanJson = (text: string) => {
    return text.replace(/```json|```/gi, '').trim();
};

export async function analyzeTryoutPerformance(candidate: RecruitmentCandidate) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
        Aja como um Senior Scout da NFL. Analise este candidato para Futebol Americano e sugira um rating OVR (0-100) e posição ideal.
        DADOS: ${JSON.stringify(candidate)}
        RETORNE APENAS JSON: { "potentialRating": number, "technicalAnalysis": "string", "suggestedPosition": "string" }
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 } 
        }
    });

    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function generatePracticeScript(focus: string, duration: number, intensity: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
        Gere um roteiro de treino de ${duration}min for Futebol Americano focado em: ${focus}.
        INTENSIDADE: ${intensity}. 
        Retorne um array JSON de objetos: { "id": "string", "startTime": "HH:MM", "durationMinutes": number, "activityName": "string", "type": "string" }
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 } 
        }
    });

    return JSON.parse(cleanJson(response.text || "[]"));
}

export async function generatePracticePlan(prompt: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt
    });
    return response.text || "";
}

export async function generatePlayerAnalysis(player: Player, context: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Analise a performance e biotipo do atleta ${player.name} (${player.position}) no contexto: ${context}. Gere um texto motivacional e técnico curto.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text || "";
}

export async function importPlaybookFromImage(base64: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Identifique os jogadores e rotas no diagrama tático e converta para JSON array de {id, type, label, x, y}." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ]
        }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
}

export async function scanFinancialDocument(base64: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Extraia os dados deste recibo para JSON: {title, amount, date, category}." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ]
        }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function analyzeOpponentTendencies(notes: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise as tendências do adversário baseadas nestas notas de scout: ${notes}`,
        config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 } 
        }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function suggestPlayConcepts(situation: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Sugira jogadas e conceitos táticos para a seguinte situação: ${situation}`,
        config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 } 
        }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
}

export async function explainPlayImage(base64: string, question: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: `Explique este diagrama tático. Pergunta: ${question}` },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ]
        }
    });
    return response.text || "";
}

export async function predictPlayCall(clips: any[], down: number, distance: number) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Preveja a próxima jogada baseado no histórico de clips ${JSON.stringify(clips)} para uma situação de ${down}ª para ${distance}.`,
        config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 } 
        }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function analyzePlayMatchup(concept: string, scouting: any, opponent: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise como o conceito ${concept} se comporta contra o scout do adversário ${opponent}: ${JSON.stringify(scouting)}`,
    });
    return response.text || "";
}

export async function generateInstallSchedule(context: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Gere um cronograma de instalação tática baseado neste contexto: ${context}`,
        config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 } 
        }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
}

export async function generateGymPlan(goal: string, equipment: string, program: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Gere um plano de treinamento de força focado em ${goal} para a modalidade ${program} com os seguintes equipamentos: ${equipment}`,
    });
    return response.text || "";
}

export async function generateMarketingContent(topic: string, platform: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Crie um copy de marketing para a plataforma ${platform} sobre o tópico: ${topic}`,
    });
    return response.text || "";
}

export async function generateSponsorshipProposal(company: string, amount: number) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Escreva uma proposta formal de patrocínio para a empresa ${company} solicitando o valor de R$ ${amount}.`,
    });
    return response.text || "";
}

export async function generateColorCommentary(home: string, away: string, context: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Aja como um narrador de Futebol Americano. Gere comentários sobre o jogo ${home} vs ${away} dado o contexto: ${context}`,
        config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 } 
        }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}
// Fix: Added missing generateColorCommentary method
export async function generateColorCommentary(home: string, away: string, context: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Aja como um narrador de Futebol Americano. Gere comentários sobre o jogo ${home} vs ${away} dado o contexto: ${context}`,
        config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 } 
        }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}
