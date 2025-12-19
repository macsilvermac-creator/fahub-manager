mport { GoogleGenAI, Type } from "@google/genai";
import { Player, SidelineAudioNote, InstallMatrixItem, PlayElement } from "../types";

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

// Fix: Added missing setRuntimeKey export
export const setRuntimeKey = (key: string) => {
    // Platform context handles API key management via environment
};

// Fix: Added missing testProConnection export
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

/**
 * Especialista em traduzir áudio bruto do campo para dados táticos estruturados.
 */
export const parseSidelineAudio = async (transcript: string): Promise<Partial<SidelineAudioNote>> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise este comentário de voz de um treinador durante o jogo: "${transcript}". Retorne JSON: { "unit": "ATAQUE" | "DEFESA" | "ST" | "GERAL", "playerNumber": number | null, "action": string, "insight": string }`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    unit: { type: Type.STRING },
                    playerNumber: { type: Type.NUMBER, nullable: true },
                    action: { type: Type.STRING },
                    insight: { type: Type.STRING }
                }
            }
        }
    });

    try {
        // Guideline: Use response.text directly (not a method).
        const data = JSON.parse(cleanJsonString(response.text || "{}"));
        return {
            unit: (data.unit as any) || 'GERAL',
            analysis: {
                playerNumber: data.playerNumber,
                action: data.action,
                insight: data.insight
            }
        };
    } catch (e) {
        return { unit: 'GERAL', rawTranscript: transcript };
    }
};

export const generateMarketingContent = async (topic: string, platform: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Crie um post para ${platform} sobre o tema: ${topic}. Seja empolgante e use emojis de futebol americano.`,
    });
    return response.text || "";
};

export const generateGymPlan = async (goal: string, equipment: string, program: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Gere um plano de treino físico (HTML) focado em: ${goal}. Equipamentos: ${equipment}. Modalidade: ${program}.`,
    });
    return response.text || "";
};

export const generatePracticeScript = async (focus: string, duration: number, intensity: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Crie um roteiro de treino de ${duration} minutos com foco em ${focus} e intensidade ${intensity}. Retorne um JSON array de {startTime, durationMinutes, type, activityName, description}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

export const analyzeOpponentTendencies = async (notes: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Aja como um Coordenador Tático. Analise estas notas de scout: "${notes}". Retorne JSON com {summary, keysToVictory: string[], suggestedConcepts: string[]}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

// Fix: Added missing analyzeCombineStats export
export const analyzeCombineStats = async (stats: any, pos: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Avalie estes números de combine para a posição ${pos}: ${JSON.stringify(stats)}. Retorne JSON com rating (0-100), potential, analysis, comparison.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

// Fix: Added missing scanFinancialDocument export
export const scanFinancialDocument = async (base64: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Extraia os dados deste recibo para JSON: {title, amount, date (YYYY-MM-DD), category, description}." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ],
        }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

// Fix: Added missing generateSponsorshipProposal export
export const generateSponsorshipProposal = async (companyName: string, amount: number): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Escreva uma proposta formal de patrocínio para a empresa ${companyName}. O valor do aporte é R$ ${amount}.`,
    });
    return response.text || "";
};

// Fix: Added missing analyzePlayMatchup export
export const analyzePlayMatchup = async (play: string, scouting: any, opponent: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Simule nossa jogada "${play}" contra a defesa de ${opponent} baseada neste scout: ${JSON.stringify(scouting)}.`,
    });
    return response.text || "";
};

// Fix: Added missing generateInstallSchedule export
export const generateInstallSchedule = async (context: string, week: string): Promise<InstallMatrixItem[]> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Crie uma matriz de instalação semanal. Contexto: ${context}. Semana: ${week}. Retorne JSON array de {id, day, category, concept}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

// Fix: Added missing importPlaybookFromImage export
export const importPlaybookFromImage = async (base64: string): Promise<PlayElement[]> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Analise este diagrama tático e extraia a localização dos jogadores. Retorne JSON array de {id, type (OFFENSE/DEFENSE), label, x, y}." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ],
        },
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

// Fix: Added missing suggestPlayConcepts export
export const suggestPlayConcepts = async (situation: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Situação de jogo: ${situation}. Sugira 3 jogadas. Retorne JSON array de {name, reason}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

// Fix: Added missing explainPlayImage export
export const explainPlayImage = async (base64Image: string, question: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: `Analise tecnicamente esta imagem. Pergunta: ${question}` },
                { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } }
            ]
        }
    });
    return response.text || "";
};

// Fix: Added missing generateColorCommentary export
export const generateColorCommentary = async (home: string, away: string, context: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: `Crie notas de narração para ${home} vs ${away}. Contexto: ${context}. Retorne JSON {intro, homePlayerToWatch, awayPlayerToWatch, keyMatchups}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

// Fix: Added missing generatePlayerAnalysis export
export const generatePlayerAnalysis = async (player: any, context: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Analise o perfil do atleta ${player.name} (${player.position}) considerando o contexto: ${context}.`,
    });
    return response.text || "";
};

// Fix: Added missing predictPlayCall export
export const predictPlayCall = async (history: any[], down: number, distance: number) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `Baseado no histórico de jogadas: ${JSON.stringify(history)}, qual a probabilidade de jogada para uma ${down}ª para ${distance}? Retorne JSON {prediction, confidence, reason}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

// Fix: Added missing generatePracticePlan export
export const generatePracticePlan = async (prompt: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
    });
    return response.text || "";
};
