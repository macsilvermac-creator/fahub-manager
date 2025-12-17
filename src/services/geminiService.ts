
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

/**
 * Generates a response from the coach AI.
 */
export const generateCoachResponse = async (prompt: string): Promise<string> => {
    // Correct method: Always query generateContent directly with model name
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            systemInstruction: "Você é um Head Coach de Futebol Americano experiente e motivador. Use gírias do esporte (ex: Redzone, Blitz, Tackle). Seja firme mas encorajador. Responda em Português Brasileiro.",
            temperature: 0.8
        }
    });
    // Correct method: Use .text property directly
    return response.text || "";
};

/**
 * Validates a gym image using Gemini.
 */
export const validateGymImage = async (base64Data: string): Promise<boolean> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: "Esta imagem contém equipamentos de academia, pesos, esteiras ou ambiente de treino físico? Responda estritamente TRUE ou FALSE." },
                { inlineData: { mimeType: "image/jpeg", data: base64Data.split(',')[1] } }
            ]
        }
    });
    return response.text?.trim().toUpperCase().includes('TRUE') || false;
};

/**
 * Analyzes opponent tendencies from scout notes.
 */
export const analyzeOpponentTendencies = async (notes: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise estas notas de scout e retorne um JSON com summary (string), keysToVictory (array) e suggestedConcepts (array): "${notes}"`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

/**
 * Suggests play concepts based on a tactical situation.
 */
export const suggestPlayConcepts = async (situation: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Sugira 3 jogadas de futebol americano para: "${situation}". Retorne Array de objetos {name, reason}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

/**
 * Analyzes Combine stats for a specific position.
 */
export const analyzeCombineStats = async (stats: any, pos: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise as métricas de combine para ${pos}: ${JSON.stringify(stats)}. Retorne JSON com rating (0-100), potential, analysis e comparison.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

/**
 * Explains a tactical play diagram or video frame.
 */
export const explainPlayImage = async (base64Image: string, question: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: `Como um técnico especialista em futebol americano, explique esta imagem e responda: ${question}` },
                { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } }
            ]
        }
    });
    return response.text || "Não foi possível analisar a imagem.";
};

/**
 * Generates color commentary for a broadcast.
 */
export const generateColorCommentary = async (homeTeam: string, awayTeam: string, context: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Gere notas de narração para o jogo ${homeTeam} vs ${awayTeam}. Contexto atual: ${context}. Retorne JSON com intro, homePlayerToWatch, awayPlayerToWatch, keyMatchups (array).`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

/**
 * Predicts the next play call based on situation and history.
 */
export const predictPlayCall = async (history: any[], down: number, distance: number) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Preveja a próxima jogada. Situação: ${down}ª descida e ${distance} jardas. Histórico: ${JSON.stringify(history)}. Retorne JSON {prediction, confidence, reason}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

/**
 * Classifies a voice note from a coach.
 */
export const classifyCoachVoiceNote = async (text: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Classifique esta nota de voz de um coach: "${text}". Retorne JSON { category: 'OFFENSE'|'DEFENSE'|'SPECIAL'|'GENERAL', tags: string[], action: string }`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

/**
 * Generates a practice script.
 */
export const generatePracticeScript = async (focus: string, duration: number, intensity: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Crie um roteiro de treino de futebol americano. Foco: ${focus}. Duração: ${duration}min. Intensidade: ${intensity}. Retorne JSON Array de objetos {startTime, durationMinutes, type, activityName, description}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

/**
 * Analyzes a tactical matchup between a play and a defense.
 */
export const analyzePlayMatchup = async (playConcept: string, scoutingReport: any, opponentName: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Simule o matchup: Jogada "${playConcept}" contra a defesa do time ${opponentName}. Relatório de Scout: ${JSON.stringify(scoutingReport)}. Resuma o resultado esperado.`,
    });
    return response.text || "";
};

/**
 * Generates an install schedule for a week.
 */
export const generateInstallSchedule = async (context: string, weekInfo: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Crie um cronograma de instalação tática para a semana. Contexto: ${context}. Informação da Semana: ${weekInfo}. Retorne JSON Array de InstallMatrixItem {id, day, category, concept}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

/**
 * Imports a playbook from a diagram image using OCR/Vision.
 */
export const importPlaybookFromImage = async (base64Image: string): Promise<any[]> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: "Extraia os jogadores deste diagrama tático para JSON Array de PlayElement {id, type:'OFFENSE'|'DEFENSE', label, x, y}. Assuma canvas 600x400." },
                { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } }
            ]
        },
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

/**
 * Generates a sponsorship proposal.
 */
export const generateSponsorshipProposal = async (companyName: string, amount: number): Promise<string> => {
    const prompt = `Escreva um email profissional de prospecção de patrocínio para a empresa ${companyName} solicitando R$ ${amount}.`;
    return await generateCoachResponse(prompt);
};

// Compatibility aliases
export const generatePracticePlan = (p: string) => generateCoachResponse(p);
export const generatePlayerAnalysis = (p: any, c: string) => generateCoachResponse(`Analise o atleta ${p.name}: ${c}`);
export const generateMarketingContent = (t: string, p: string) => generateCoachResponse(`Crie um post de ${p} sobre: ${t}`);
export const generateStructuredGymPlan = async (goal: string, equipment: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Crie um treino de academia focado em: ${goal}. Equipamentos: ${equipment}. Retorne JSON Array de GymDay {title, focus, exercises: [{name, sets, reps, notes}]}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};
export const scanFinancialDocument = async (base64Image: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: "Extraia título, valor, data (YYYY-MM-DD), categoria e descrição deste recibo em JSON." },
                { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } }
            ]
        },
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};
