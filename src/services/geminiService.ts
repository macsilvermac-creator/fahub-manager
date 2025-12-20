
import { GoogleGenAI, Type } from "@google/genai";
import { RecruitmentCandidate } from "../types";

const cleanJson = (text: string) => {
    return text.replace(/```json|```/gi, '').trim();
};

export async function analyzeTryoutPerformance(candidate: RecruitmentCandidate) {
    /* Correct initialization using process.env.API_KEY */
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Analise este atleta para Futebol Americano e retorne um JSON estrito { "potentialRating": 0-100, "technicalAnalysis": "texto", "suggestedPosition": "sigla" }: ${JSON.stringify(candidate)}`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 }
        }
    });

    const text = response.text;
    if (!text) throw new Error("IA retornou resposta vazia");
    return JSON.parse(cleanJson(text));
}

export async function scanFinancialDocument(base64: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Extraia do recibo para JSON: {title, amount, date, category (TRANSPORT|EQUIPMENT|TUITION|OTHER)}." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ]
        }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function generateMarketingContent(topic: string, platform: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Crie um post para ${platform} sobre o seguinte tópico de Futebol Americano: ${topic}`,
    });
    return response.text || "";
}

export async function analyzeOpponentTendencies(notes: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise as tendências deste adversário: ${notes}. Retorne JSON { "summary": "texto", "keysToVictory": ["item1", "item2"] }`,
        config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 }
        }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function generatePracticePlan(prompt: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt
    });
    return response.text || "";
}

/* Added generatePracticeScript used in PracticePlan.tsx */
export async function generatePracticeScript(focus: string, duration: number, intensity: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Gere um script de treino para o foco: ${focus}. Duração: ${duration} minutos. Intensidade: ${intensity}. Retorne como um array JSON de objetos { "id": "string", "startTime": "HH:MM", "durationMinutes": number, "type": "WARMUP" | "INDY" | "GROUP" | "TEAM" | "SPECIAL", "activityName": "string", "description": "string" }.`,
        config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 }
        }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
}

export async function suggestPlayConcepts(situation: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Sugira 3 jogadas para a situação: ${situation}. Retorne JSON array de { "name": "nome", "reason": "motivo" }`,
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Crie um plano de musculação para um atleta de Futebol Americano (${program}). Objetivo: ${goal}. Equipamentos: ${equipment}`,
    });
    return response.text || "";
}

export async function predictPlayCall(clips: any[], down: number, distance: number) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Baseado no histórico ${JSON.stringify(clips)}, qual a probabilidade de jogada para uma ${down}ª para ${distance}? Retorne JSON { "prediction": "tipo", "confidence": "0-100%" }`,
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
        contents: `Analise a eficácia da jogada "${concept}" contra o scout "${JSON.stringify(scouting)}" do time ${opponent}.`,
    });
    return response.text || "";
}

/* Added generateInstallSchedule used in TacticalLab.tsx */
export async function generateInstallSchedule(context: string, week: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Crie um cronograma de instalação técnica para a semana ${week}. Contexto: ${context}. Retorne um array JSON de objetos { "id": "string", "day": "string", "category": "string", "concept": "string" }.`,
        config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 }
        }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
}

/* Added importPlaybookFromImage used in TacticalLab.tsx */
export async function importPlaybookFromImage(base64: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: "Analise este diagrama tático de Futebol Americano. Identifique a posição de cada jogador e retorne como um array JSON de objetos { id: string, x: number, y: number, label: string, type: 'OFFENSE' | 'DEFENSE' }. O campo tem 600px de largura e 400px de altura." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ]
        },
        config: { 
            responseMimeType: "application/json"
        }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
}

/* Added generateSponsorshipProposal used in Commercial.tsx */
export async function generateSponsorshipProposal(company: string, amount: number) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Escreva uma proposta formal de patrocínio para a empresa "${company}" no valor de R$ ${amount.toFixed(2)}. Destaque os benefícios de visibilidade no Futebol Americano nacional.`,
    });
    return response.text || "";
}

export async function generateColorCommentary(home: string, away: string, context: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Gere comentários de narração para ${home} vs ${away}. Contexto: ${context}. Retorne JSON { "intro": "texto", "homePlayerToWatch": "nome", "awayPlayerToWatch": "nome" }`,
        config: { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 }
        }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
}

export async function generatePlayerAnalysis(player: any, context: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise o desempenho do atleta ${player.name}. Contexto: ${context}`,
    });
    return response.text || "";
}

export async function testProConnection() {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: 'Ping',
    });
    return !!response.text;
}

/* Added setRuntimeKey used in GeminiPlaybook.tsx */
export function setRuntimeKey(key: string) {
    /* In a real scenario, this might update a global state or re-init the client, 
       but for this implementation we rely on process.env.API_KEY as per instructions. */
    console.log("Runtime key update requested. Relying on environment configuration.");
}