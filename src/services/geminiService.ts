
import { GoogleGenAI } from "@google/genai";
import { Player, GameScoutingReport, InstallMatrixItem, PracticeScriptItem, VideoClip, PlayElement, CombineStats } from "../types";

let runtimeKey: string | null = null;

export const setRuntimeKey = (key: string) => {
    runtimeKey = key;
};

// Guideline: Create a new GoogleGenAI instance right before making an API call to ensure it uses the up-to-date key.
const getClient = (): GoogleGenAI => {
    // Guideline: Use process.env.API_KEY directly or runtime key if provided.
    const key = runtimeKey || process.env.API_KEY;
    if (!key) {
        throw new Error("Chave de API ausente.");
    }
    return new GoogleGenAI({ apiKey: key });
};

// Helper for cleaning JSON output from potential Markdown code blocks
const cleanJsonString = (input: string): string => {
    let clean = input.trim();
    clean = clean.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    return clean;
};

export const testProConnection = async (): Promise<boolean> => {
    try {
        const ai = getClient();
        // Tenta um ping simples no modelo PRO para validar a chave e permissões
        await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: 'Ping de teste de conexão.',
        });
        return true;
    } catch (e) {
        console.error("Falha no teste Pro:", e);
        return false;
    }
};

// TAREFA BÁSICA: Chat Rápido (Mantém Flash para velocidade)
const generateCoachResponse = async (prompt: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            systemInstruction: "Você é um Head Coach de Futebol Americano. Seja técnico e inspirador.",
            temperature: 0.8
        }
    });
    // Guideline: Access generated text via the .text property.
    return response.text || "";
};

// TAREFA PRO: Visão Computacional Avançada
export const validateGymImage = async (base64Data: string): Promise<boolean> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        // Guideline: Use gemini-2.5-flash-image for general image tasks.
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
        model: 'gemini-3-flash-preview',
        contents: `Plano de academia: ${goal}. Equipamentos: ${equipment}. Retorne JSON array de GymDay.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

// TAREFA PRO: Raciocínio Tático Profundo (Scout)
export const analyzeOpponentTendencies = async (notes: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // UPGRADE: Raciocínio complexo para scout
        contents: `Aja como um Coordenador Defensivo experiente. Analise estas notas brutas de scout: "${notes}". 
        
        Gere um relatório JSON estruturado com:
        1. summary (Resumo executivo da identidade do oponente)
        2. keysToVictory (Lista de 3 chaves táticas para vencer)
        3. suggestedConcepts (Lista de conceitos ofensivos/defensivos que funcionam contra eles)`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

// TAREFA PRO: Criatividade Tática
export const suggestPlayConcepts = async (situation: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // UPGRADE: Sugestões mais criativas e precisas
        contents: `Situação de jogo crítica: "${situation}".
        Sugira 3 conceitos de jogada (Play Concepts) do nível NFL/NCAA.
        Retorne JSON array de {name, reason}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

export const analyzeCombineStats = async (stats: any, pos: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', // Flash é suficiente para comparar números
        contents: `Analise combine ${pos}: ${JSON.stringify(stats)}. Retorne JSON com rating, potential, analysis e comparison.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

// TAREFA PRO: Análise Holística do Atleta
export const generatePlayerAnalysis = async (player: any, context: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // UPGRADE: Cruza dados físicos, mentais e de jogo
        contents: `Analise o atleta ${player.name} (${player.position}) profundamente.
        Dados: ${context}.
        Forneça um feedback construtivo estilo "Performance Review".`,
    });
    return response.text || "";
};

export const generateMarketingContent = async (topic: string, platform: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Post para ${platform}: ${topic}. Use emojis e tom engajador.`,
    });
    return response.text || "";
};

export const generateSponsorshipProposal = async (companyName: string, amount: number): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // UPGRADE: Texto mais persuasivo e profissional
        contents: `Escreva um email frio de patrocínio para a empresa ${companyName}.
        Valor solicitado: R$ ${amount}.
        Foque em ROI, comunidade e visibilidade.`,
    });
    return response.text || "";
};

export const classifyCoachVoiceNote = async (text: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Classifique nota técnica: ${text}. Retorne JSON {category, tags, action}`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

// TAREFA PRO: Visão Tática (Diagramas)
export const explainPlayImage = async (base64Image: string, question: string): Promise<string> => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        // Guideline: Use gemini-2.5-flash-image for general image tasks.
        model: 'gemini-2.5-flash-image', 
        contents: {
            parts: [
                { text: `Você é um analista de vídeo expert. Analise esta imagem tática/frame de jogo. Pergunta do técnico: ${question}` },
                { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } }
            ]
        }
    });
    return response.text || "";
};

export const scanFinancialDocument = async (base64: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        // Guideline: Use gemini-2.5-flash-image for image-based data extraction.
        model: "gemini-2.5-flash-image", 
        contents: {
            parts: [
                { text: "Extraia dados do recibo/nota fiscal para JSON estrito: {title, amount (number), date (YYYY-MM-DD), category (enum: EQUIPMENT, TRANSPORT, FOOD, OTHER), description}." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ],
        },
        // Guideline: DO NOT set responseMimeType for image models.
        config: { } 
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

// TAREFA PRO: Predição de Jogada (Padrões Complexos)
export const predictPlayCall = async (history: any[], down: number, distance: number) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // UPGRADE: Análise de séries históricas
        contents: `Preveja a próxima jogada defensiva.
        Situação: ${down}ª para ${distance} jardas.
        Histórico recente: ${JSON.stringify(history)}.
        
        Retorne JSON {prediction, confidence (%), reason}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

export const generateInstallSchedule = async (context: string, week: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Crie uma matriz de instalação semanal (Install Schedule).
        Contexto: ${context}. Semana: ${week}.
        Retorne JSON Array de InstallMatrixItem.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

export const importPlaybookFromImage = async (base64: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        // Guideline: Use gemini-2.5-flash-image for image-based diagram analysis.
        model: "gemini-2.5-flash-image", 
        contents: {
            parts: [
                { text: "Analise este diagrama de playbook. Identifique a posição (x,y) de cada jogador (OFFENSE=O, DEFENSE=X). Retorne JSON Array de PlayElement." },
                { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
            ],
        },
        // Guideline: DO NOT set responseMimeType for image models.
        config: { } 
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

export const generateColorCommentary = async (home: string, away: string, context: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', // Flash é ok para texto criativo rápido
        contents: `Narração ${home} vs ${away}: ${context}. Retorne JSON {intro, homePlayerToWatch, awayPlayerToWatch, keyMatchups}.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
};

export const generatePracticePlan = (p: string) => generateCoachResponse(p);

// TAREFA PRO: Logística de Treino
export const generatePracticeScript = async (focus: string, duration: number, intensity: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // UPGRADE: Melhor gestão de tempo e encadeamento lógico
        contents: `Crie um roteiro de treino de futebol americano.
        Foco: ${focus}. Duração Total: ${duration}min. Intensidade: ${intensity}.
        
        Regras:
        1. Inclua Warmup e Cool down.
        2. Divida em blocos lógicos (Indy, Group, Team).
        3. Seja específico nos drills.
        
        Retorne JSON array de PracticeScriptItem.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
};

export const analyzePlayMatchup = async (play: string, scouting: any, opponent: string) => {
    const ai = getClient();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // UPGRADE: Análise de matchup tático
        contents: `Simule a jogada "${play}" contra a defesa de ${opponent}.
        Baseie-se neste scout report: ${JSON.stringify(scouting)}.
        
        Descreva o resultado provável e o porquê. Seja breve.`,
    });
    return response.text || "";
};

export const generateGymPlan = async (goal: string, equipment: string, program: string): Promise<string> => {
    return await generateCoachResponse(`Gere um plano de treino HTML para: ${goal}. Equipamentos: ${equipment}. Programa: ${program}.`);
};
