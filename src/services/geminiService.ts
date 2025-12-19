
import { GoogleGenAI, Type } from "@google/genai";
import { Player, GameScoutingReport, InstallMatrixItem, PracticeScriptItem, VideoClip, PlayElement, CombineStats, SidelineAudioNote } from "../types";

const getClient = (): GoogleGenAI => {
    if (!process.env.API_KEY) {
        throw new Error("Chave de API ausente no ambiente de execução.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const cleanJsonString = (input: string): string => {
    let clean = input.trim();
    clean = clean.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    return clean;
};

// NOVO: Processamento de Áudio Tático de Campo
export const parseSidelineVoice = async (transcript: string): Promise<Partial<SidelineAudioNote>> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise o seguinte comando de voz de um treinador de futebol americano: "${transcript}".
        As palavras-chave iniciais (Ataque, Defesa, ST) definem a unidade.
        Extraia:
        1. unit (ATAQUE, DEFESA, ST, GERAL)
        2. playerNumber (apenas se mencionado)
        3. action (o que aconteceu)
        4. insight (análise técnica do coach)
        
        Retorne APENAS um JSON válido.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    unit: { type: Type.STRING },
                    playerNumber: { type: Type.NUMBER },
                    action: { type: Type.STRING },
                    insight: { type: Type.STRING }
                }
            }
        }
    });
    
    try {
        const data = JSON.parse(cleanJsonString(response.text || "{}"));
        return {
            unit: data.unit || 'GERAL',
            analysis: {
                playerNumber: data.playerNumber,
                action: data.action,
                insight: data.insight
            }
        };
    } catch (e) {
        return { unit: 'GERAL' };
    }
};

export const setRuntimeKey = (key: string) => {};

export const testProConnection = async (): Promise<boolean> => {
    try {
        const ai = getClient();
        await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: 'ping',
            config: { maxOutputTokens: 10, thinkingConfig: { thinkingBudget: 0 } }
        });
        return true;
    } catch (e) {
        return false;
    }
};

const generateCoachResponse = async (prompt: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            systemInstruction: "Você é um Head Coach de Futebol Americano de elite. Seu tom é técnico, inspirador e extremamente profissional.",
            temperature: 0.7
        }
    });
    return response.text || "";
};

export const generatePracticePlan = async (prompt: string): Promise<string> => {
    return await generateCoachResponse(prompt);
};

export const validateGymImage = async (base64Data: string): Promise<boolean> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image', 
        contents: {
            parts: [
                { text: "A imagem mostra um ambiente de academia ou treino físico? Responda TRUE ou FALSE." },
                { inlineData: { mimeType: "image/jpeg", data: base64Data.split(',')[1] } }
            ]
        }
    });
    return response.text?.trim().toUpperCase().includes('TRUE') || false;
};

export const generateStructuredGymPlan = async (goal: string, equipment: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Gere um plano de musculação específico para Futebol Americano. Objetivo: ${goal}. Equipamentos: ${equipment}. Retorne APENAS um JSON array de GymDay.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

export const analyzeOpponentTendencies = async (notes: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Aja como um Coordenador Tático. Analise estas notas de scout: "${notes}". 
        Retorne um JSON estruturado com: 
        1. summary (análise geral) 
        2. keysToVictory (array de strings) 
        3. suggestedConcepts (conceitos que exploram fraquezas).`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

export const suggestPlayConcepts = async (situation: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Situação de jogo: ${situation}. Sugira 3 jogadas/conceitos técnicos (ex: Mesh, Flood, Cover 2 Man). Retorne JSON array de {name, reason}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

export const analyzeCombineStats = async (stats: any, pos: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Avalie estes números de combine para a posição ${pos}: ${JSON.stringify(stats)}. Compare com benchmarks da NFL/CFL. Retorne JSON com rating (0-100), potential, analysis e comparison.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

export const generatePlayerAnalysis = async (player: any, context: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Analise o perfil do atleta ${player.name} (${player.position}) considerando o contexto: ${context}. Forneça um feedback construtivo de elite.`,
    });
    return response.text || "";
};

export const generateMarketingContent = async (topic: string, platform: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Crie um post engajador para ${platform} sobre o tema: ${topic}. Use emojis e tom de comunidade esportiva.`,
    });
    return response.text || "";
};

export const generateSponsorshipProposal = async (companyName: string, amount: number): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Escreva uma proposta formal de patrocínio para a empresa ${companyName}. O valor do aporte é R$ ${amount}. Foque em ROI, visibilidade e impacto social do esporte.`,
    });
    return response.text || "";
};

export const explainPlayImage = async (base64Image: string, question: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image', 
        contents: {
            parts: [
                { text: `Aja como um Video Coordinator da NFL. Analise tecnicamente esta imagem. Pergunta: ${question}` },
                { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } }
            ]
        }
    });
    return response.text || "";
};

export const scanFinancialDocument = async (base64: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Extraia os dados deste recibo/nota fiscal para um objeto JSON: {title, amount, date (YYYY-MM-DD), category, description}." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ],
        }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

export const predictPlayCall = async (history: any[], down: number, distance: number) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Baseado no histórico de jogadas: ${JSON.stringify(history)}, qual a probabilidade de jogada para uma ${down}ª para ${distance}? Retorne JSON {prediction, confidence, reason}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

export const generateInstallSchedule = async (context: string, week: string): Promise<InstallMatrixItem[]> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Crie uma matriz de instalação semanal para o time. Contexto: ${context}. Semana: ${week}. Retorne APENAS um JSON array de InstallMatrixItem {id, day, category, concept}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

export const importPlaybookFromImage = async (base64: string): Promise<PlayElement[]> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Analise este diagrama tático e extraia a localização dos jogadores. Retorne APENAS um JSON array de PlayElement {id, type (OFFENSE/DEFENSE), label, x, y}." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ],
        },
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

export const generatePracticeScript = async (focus: string, duration: number, intensity: string): Promise<PracticeScriptItem[]> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Crie um roteiro de treino de ${duration} minutos com foco em ${focus} e intensidade ${intensity}. Retorne um JSON array de PracticeScriptItem {startTime, durationMinutes, type, activityName, description}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

export const analyzePlayMatchup = async (play: string, scouting: any, opponent: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Simule nossa jogada "${play}" contra a defesa de ${opponent} baseada neste scout: ${JSON.stringify(scouting)}. Descreva o resultado provável e o ajuste necessário.`,
    });
    return response.text || "";
};

export const generateGymPlan = async (goal: string, equipment: string, program: string): Promise<string> => {
    return await generateCoachResponse(`Gere um plano de treino detalhado em HTML para um atleta de ${program}. Objetivo: ${goal}. Equipamentos: ${equipment}.`);
};

export const generateColorCommentary = async (home: string, away: string, context: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: `Crie notas de narração para ${home} vs ${away}. Contexto: ${context}. Retorne JSON {intro, homePlayerToWatch, awayPlayerToWatch, keyMatchups}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};