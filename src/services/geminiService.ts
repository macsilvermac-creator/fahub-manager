
import { GoogleGenAI } from "@google/genai";
import { Player, GameScoutingReport, InstallMatrixItem, PracticeScriptItem, VideoClip, PlayElement, CombineStats } from "../types";

// Guideline: Create a new GoogleGenAI instance right before making an API call to ensure it uses the up-to-date key.
const getClient = (): GoogleGenAI => {
    // Guideline: Use process.env.API_KEY exclusively.
    if (!process.env.API_KEY) {
        throw new Error("Chave de API ausente no ambiente de execução.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Helper for cleaning JSON output from potential Markdown code blocks
const cleanJsonString = (input: string): string => {
    let clean = input.trim();
    clean = clean.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    return clean;
};

// COMPLIANCE: API key selection and dialog management are handled by the platform.
// No-op for runtime key setting to satisfy component imports while maintaining guideline adherence.
export const setRuntimeKey = (key: string) => {
    console.debug("API Key management is handled by the platform execution context.");
};

/**
 * Checks connectivity to the Gemini 3 Pro model.
 */
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
        console.error("Pro Connection Check Failed:", e);
        return false;
    }
};

/**
 * Common technical technical response generator.
 */
const generateCoachResponse = async (prompt: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: prompt,
        config: {
            systemInstruction: "Você é um Head Coach de Futebol Americano de elite. Seu tom é técnico, inspirador e extremamente profissional.",
            temperature: 0.7
        }
    });
    // Guideline: Access the generated text directly via the .text property.
    return response.text || "";
};

/**
 * Generates a practice plan based on coach requirements.
 */
export const generatePracticePlan = async (prompt: string): Promise<string> => {
    return await generateCoachResponse(prompt);
};

// TAREFA DE IMAGEM: Validação Visual (Padrão Gemini 2.5 Flash Image)
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

// TAREFA PRO: Planejamento Físico Estruturado
export const generateStructuredGymPlan = async (goal: string, equipment: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Gere um plano de musculação específico para Futebol Americano. Objetivo: ${goal}. Equipamentos: ${equipment}. Retorne APENAS um JSON array de GymDay.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

// TAREFA PRO: Scout Profundo de Oponente
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

// TAREFA PRO: Criatividade Tática
export const suggestPlayConcepts = async (situation: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Situação de jogo: ${situation}. Sugira 3 jogadas/conceitos técnicos (ex: Mesh, Flood, Cover 2 Man). Retorne JSON array de {name, reason}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

// TAREFA PRO: Análise de Atributos Físicos
export const analyzeCombineStats = async (stats: any, pos: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Avalie estes números de combine para a posição ${pos}: ${JSON.stringify(stats)}. Compare com benchmarks da NFL/CFL. Retorne JSON com rating (0-100), potential, analysis e comparison.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

// TAREFA PRO: Performance Review do Atleta
export const generatePlayerAnalysis = async (player: any, context: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Analise o perfil do atleta ${player.name} (${player.position}) considerando o contexto: ${context}. Forneça um feedback construtivo de elite.`,
    });
    return response.text || "";
};

// TAREFA FLASH: Marketing (Texto rápido e engajador)
export const generateMarketingContent = async (topic: string, platform: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Crie um post engajador para ${platform} sobre o tema: ${topic}. Use emojis e tom de comunidade esportiva.`,
    });
    return response.text || "";
};

// TAREFA PRO: Email de Patrocínio Profissional
export const generateSponsorshipProposal = async (companyName: string, amount: number): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Escreva uma proposta formal de patrocínio para a empresa ${companyName}. O valor do aporte é R$ ${amount}. Foque em ROI, visibilidade e impacto social do esporte.`,
    });
    return response.text || "";
};

// TAREFA PRO: Análise Visual de Prancheta/Vídeo
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

// TAREFA DE IMAGEM: Extração de Dados de Recibos
export const scanFinancialDocument = async (base64: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Extraia os dados deste recibo/nota fiscal para um objeto JSON: {title, amount, date (YYYY-MM-DD), category, description}." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ],
        },
        config: { } 
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

// TAREFA PRO: Predição Preditiva de Playcall
export const predictPlayCall = async (history: any[], down: number, distance: number) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Baseado no histórico de jogadas: ${JSON.stringify(history)}, qual a probabilidade de jogada para uma ${down}ª para ${distance}? Retorne JSON {prediction, confidence, reason}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

/**
 * Generates an installation schedule for tactical concepts.
 */
export const generateInstallSchedule = async (context: string, week: string): Promise<InstallMatrixItem[]> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Crie uma matriz de instalação semanal para o time. Contexto: ${context}. Semana: ${week}. Retorne APENAS um JSON array de InstallMatrixItem {id, day, category, concept}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

/**
 * Detects players and positions from a playbook image.
 */
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
        config: { }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

// TAREFA PRO: Roteiro de Treino Minuto-a-Minuto
export const generatePracticeScript = async (focus: string, duration: number, intensity: string): Promise<PracticeScriptItem[]> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Crie um roteiro de treino de ${duration} minutos com foco em ${focus} e intensidade ${intensity}. Retorne um JSON array de PracticeScriptItem {startTime, durationMinutes, type, activityName, description}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

// TAREFA PRO: Simulação de Matchup Tático
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
