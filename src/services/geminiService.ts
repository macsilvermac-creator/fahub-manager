
import { GoogleGenAI } from "@google/genai";

// Inicialização estrita conforme diretrizes
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Função genérica para chat/texto com o Coach
 */
export const generateCoachResponse = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            systemInstruction: "Você é um Head Coach de Futebol Americano experiente e motivador. Use gírias do esporte. Responda em Português Brasileiro.",
            temperature: 0.8
        }
    });
    return response.text || "";
};

/**
 * Análise de imagem para validar ambiente de academia (Iron Lab)
 */
export const validateGymImage = async (base64Data: string): Promise<boolean> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: "Esta imagem contém equipamentos de academia, pesos ou ambiente de treino físico? Responda estritamente TRUE ou FALSE." },
                { inlineData: { mimeType: "image/jpeg", data: base64Data.split(',')[1] } }
            ]
        }
    });
    const result = response.text?.trim().toUpperCase();
    return result?.includes('TRUE') || false;
};

/**
 * Gera plano de treino estruturado em JSON
 */
export const generateStructuredGymPlan = async (goal: string, equipment: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Crie um treino de academia focado em: ${goal}. Equipamentos: ${equipment}. Retorne um array JSON de objetos {title: string, focus: string, exercises: [{name, sets, reps, notes}]}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

/**
 * Analisa tendências do adversário (Scout)
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
 * Sugere conceitos de jogadas para uma situação tática
 */
export const suggestPlayConcepts = async (situation: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Sugira 3 jogadas de futebol americano para a situação: "${situation}". Retorne um array JSON de objetos {name, reason}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

/**
 * Analisa métricas de combine de um atleta
 */
export const analyzeCombineStats = async (stats: any, pos: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise as métricas de combine para a posição ${pos}: ${JSON.stringify(stats)}. Retorne um JSON com rating (0-100), potential, analysis e comparison.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

/**
 * Gera análise de performance do atleta para o modal de detalhes
 */
export const generatePlayerAnalysis = async (player: any, context: string): Promise<string> => {
    return generateCoachResponse(`Analise a performance do atleta ${player.name} (${player.position}) no seguinte contexto: ${context}. Seja técnico e específico.`);
};

/**
 * Gera conteúdo de marketing para redes sociais
 */
export const generateMarketingContent = async (topic: string, platform: string): Promise<string> => {
    return generateCoachResponse(`Crie um post para o ${platform} sobre o seguinte tópico do nosso time de Futebol Americano: ${topic}. Use emojis e hashtags.`);
};

/**
 * Sugere proposta de patrocínio
 */
export const generateSponsorshipProposal = async (companyName: string, amount: number): Promise<string> => {
    return generateCoachResponse(`Escreva um email profissional de prospecção de patrocínio para a empresa ${companyName} solicitando um investimento de R$ ${amount}.`);
};

/**
 * Classifica notas de voz do coach (Coach Game Day)
 */
export const classifyCoachVoiceNote = async (text: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Classifique esta nota de voz técnica: "${text}". Retorne um JSON {category: 'OFFENSE'|'DEFENSE'|'SPECIAL'|'GENERAL', tags: string[], action: string}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

/**
 * Explica uma imagem de jogada ou frame de vídeo
 */
export const explainPlayImage = async (base64Image: string, question: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: `Como um técnico de futebol americano, analise esta imagem e responda: ${question}` },
                { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } }
            ]
        }
    });
    return response.text || "Não foi possível analisar a imagem.";
};

// Aliases para compatibilidade legada
export const generatePracticePlan = (p: string) => generateCoachResponse(p);

export const generatePracticeScript = async (focus: string, duration: number, intensity: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Crie um roteiro de treino de ${duration}min focado em: ${focus}. Intensidade: ${intensity}. Retorne um array JSON de objetos {startTime, durationMinutes, type, activityName, description}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

// --- FIX: MISSING EXPORTED MEMBERS ---

/**
 * Analisa documentos financeiros como comprovantes e notas fiscais
 */
export const scanFinancialDocument = async (base64: string) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Extract data from this receipt to JSON: {title, amount, date (YYYY-MM-DD), category, description}. Use standard financial categories." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ],
        },
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

/**
 * Preve a próxima jogada com base no histórico
 */
export const predictPlayCall = async (history: any[], down: number, distance: number) => {
    const prompt = `Based on game history: ${JSON.stringify(history.slice(-10))}, predict the next play for ${down} & ${distance}. Return JSON {prediction, confidence, reason}.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

/**
 * Analisa o matchup de uma jogada contra um scout adversário
 */
export const analyzePlayMatchup = async (play: string, scout: any, opponent: string) => {
    const prompt = `Analyze play "${play}" against ${opponent}'s defense: ${JSON.stringify(scout)}. Provide a technical simulation result.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
    });
    return response.text || "";
};

/**
 * Gera cronograma de instalação semanal
 */
export const generateInstallSchedule = async (context: string, week: string) => {
    const prompt = `Create a weekly install schedule (Mon-Fri) for: ${context}. Context: ${week}. Return JSON Array<{day, category, concept}>.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

/**
 * Importa diagramas de playbook via OCR/Vision
 */
export const importPlaybookFromImage = async (base64: string) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Extract players from this football diagram into JSON Array<{id, type:'OFFENSE'|'DEFENSE', label, x, y}>. Canvas is 600x400." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ],
        },
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
};

/**
 * Gera comentários técnicos de narração para transmissões
 */
export const generateColorCommentary = async (home: string, away: string, context: string) => {
    const prompt = `Generate broadcast notes for ${home} vs ${away}. Context: ${context}. Return JSON {intro, homePlayerToWatch, awayPlayerToWatch, keyMatchups: string[]}.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};