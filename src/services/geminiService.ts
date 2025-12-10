
import { GoogleGenAI } from "@google/genai";
import { Player, GameScoutingReport, InstallMatrixItem, PracticeScriptItem, VideoClip, PlayElement } from "../types";

// @ts-ignore
const ENV_KEY = process.env.API_KEY;
// Chave de Fallback (Cópia da chave do Firebase para garantir funcionamento imediato)
const FALLBACK_KEY = "AIzaSyB6VDLKBK9Siz81DC_bEm54oMILT-Hd6wA";

const API_KEY = ENV_KEY || FALLBACK_KEY;

// Variável para armazenar chave temporária inserida pelo usuário na UI
let runtimeKey: string | null = null;

export const setRuntimeKey = (key: string) => {
    console.log("🔑 Chave de API atualizada manualmente!");
    runtimeKey = key;
};

// Função para obter o cliente correto
const getClient = () => {
    const activeKey = runtimeKey || API_KEY;
    return new GoogleGenAI({ apiKey: activeKey });
};

// Função auxiliar para limpar o JSON que a IA retorna
const cleanJsonString = (input: string): string => {
    let clean = input.trim();
    if (clean.startsWith('```json')) {
        clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
        clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return clean;
};

// Helper to handle JSON response safely
const generateJson = async (prompt: string): Promise<any> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                temperature: 0.4 
            }
        });
        
        if (response.text) {
            try {
                const cleanedText = cleanJsonString(response.text);
                return JSON.parse(cleanedText);
            } catch (jsonError) {
                console.error("🤖 Gemini: Falha ao fazer parse do JSON:", response.text);
                return null;
            }
        }
        return null;
    } catch (e: any) {
        console.error("🤖 Gemini JSON Error:", e);
        return null;
    }
};

// Helper for text response
const generateText = async (prompt: string): Promise<string> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "";
    } catch (e: any) {
        let errorMsg = "Erro desconhecido na IA.";
        const errorString = JSON.stringify(e);
        
        if (errorString.includes('403') || e.status === 403) {
            errorMsg = "ERRO 403 (PERMISSÃO): Chave inválida.";
        } else if (errorString.includes('400') || e.status === 400) {
            errorMsg = "ERRO 400 (REQ. INVÁLIDA): Verifique os dados.";
        }
        return `⚠️ ${errorMsg}`;
    }
};

// --- AGENTE 1: SCRIPT WIZARD (Gera Roteiro de Treino Completo) ---
export const generatePracticeScript = async (focus: string, duration: number, intensity: string): Promise<PracticeScriptItem[]> => {
    const prompt = `
    Você é um Head Coach expert em Futebol Americano.
    Crie um Roteiro de Treino (Practice Script) minuto a minuto.
    
    Parâmetros:
    - Foco Tático: "${focus}"
    - Duração Total: ${duration} minutos
    - Intensidade: ${intensity} (Ex: "Walkthrough" é leve, "Full Pads" é pesado)
    
    Regras de Ouro:
    1. Comece sempre com Warmup/Alongamento.
    2. Inclua períodos de "Indy" (Individual) específicos para o foco.
    3. Termine com "Team" (Coletivo) ou "Conditioning".
    4. A soma dos 'durationMinutes' deve ser EXATAMENTE ${duration}.
    
    Retorne APENAS um JSON Array com objetos:
    [
        {
            "startTime": "HH:MM" (Começando as 19:00),
            "durationMinutes": number,
            "type": "WARMUP" | "INDY" | "GROUP" | "TEAM" | "SPECIAL",
            "activityName": "Nome do Drill (Ex: Inside Run)",
            "description": "Explicação técnica breve em português."
        }
    ]
    `;

    const result = await generateJson(prompt);
    if (result && Array.isArray(result)) {
        return result.map((item: any) => ({ ...item, id: `script-${Date.now()}-${Math.random()}` }));
    }
    return [];
};

// --- AGENTE 2: SCOUT DECODER (Analisa Tendências) ---
export const analyzeOpponentTendencies = async (rawNotes: string): Promise<{ summary: string, keysToVictory: string[], suggestedConcepts: string[] }> => {
    const prompt = `
    Você é um Coordenador Defensivo/Ofensivo de elite. Analise estas anotações brutas de scout sobre o adversário:
    
    "${rawNotes}"
    
    Gere um relatório estratégico estruturado em JSON:
    {
        "summary": "Resumo de 2 linhas sobre a identidade do adversário.",
        "keysToVictory": ["Chave 1", "Chave 2", "Chave 3"],
        "suggestedConcepts": ["Conceito Tático 1 para usar", "Conceito 2"]
    }
    `;
    
    const result = await generateJson(prompt);
    return result || { summary: "Erro na análise.", keysToVictory: [], suggestedConcepts: [] };
};

// --- AGENTE 3: TACTICAL ORACLE (Sugere Jogadas) ---
export const suggestPlayConcepts = async (situation: string): Promise<{ name: string, reason: string }[]> => {
    const prompt = `
    Situação de Jogo: ${situation}
    Sugira 3 conceitos táticos modernos de futebol americano para vencer essa situação.
    
    Retorne JSON Array:
    [ { "name": "Nome da Jogada (Ex: Mesh)", "reason": "Por que funciona aqui." } ]
    `;
    
    const result = await generateJson(prompt);
    return Array.isArray(result) ? result : [];
};

// --- AGENTE 4: PREDICTIVE PLAY CALLER (Vision Core) ---
export const predictPlayCall = async (historyClips: VideoClip[], currentDown: number, currentDistance: number): Promise<{ prediction: string, confidence: string, reason: string }> => {
    // 1. Summarize History Data for the Token Window
    const simplifiedHistory = historyClips.map(c => ({
        down: c.tags.down,
        dist: c.tags.distance,
        off: c.tags.offensiveFormation,
        play: c.tags.offensivePlayCall,
        result: c.tags.result
    })).slice(0, 30); // Limit to last 30 clips to fit context

    const prompt = `
    Atue como um Coordenador Defensivo analisando dados do adversário.
    
    Histórico de Jogadas Recentes (JSON):
    ${JSON.stringify(simplifiedHistory)}
    
    Situação Atual no Campo:
    ${currentDown}ª Descida para ${currentDistance} jardas.
    
    Tarefa:
    Com base no padrão histórico acima, preveja qual será a próxima jogada ofensiva.
    
    Retorne JSON:
    {
        "prediction": "Ex: Corrida Inside Zone ou Passe Curto",
        "confidence": "Ex: Alta (80%)",
        "reason": "Ex: Eles correm 90% das vezes em descidas curtas com esta formação."
    }
    `;

    const result = await generateJson(prompt);
    return result || { prediction: "Dados insuficientes", confidence: "Baixa", reason: "Poucos clips tagueados." };
};

// --- AGENTE 5: PLAYBOOK DIGITIZER (Multimodal) ---
export const importPlaybookFromImage = async (base64Image: string): Promise<PlayElement[]> => {
    try {
        const ai = getClient();
        const prompt = `
        You are an Offensive Coordinator. Analyze this image of a football play.
        Identify the positions of offensive (O) and defensive (X) players.
        
        The image represents a field.
        Top-Left is (0,0). Bottom-Right is (600, 400).
        
        Return a JSON array of elements:
        [
            { "id": "generated-1", "type": "OFFENSE", "label": "QB", "x": 300, "y": 250 },
            { "id": "generated-2", "type": "DEFENSE", "label": "LB", "x": 300, "y": 150 }
        ]
        
        Use standard labels: QB, RB, WR, TE, OL, C for Offense. LB, CB, S, DL for Defense.
        Approximate the coordinates to fit a 600x400 canvas.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } }
                    ],
                },
            ],
            config: { responseMimeType: "application/json" }
        });

        if (response.text) {
            const clean = cleanJsonString(response.text);
            const elements = JSON.parse(clean);
            if (Array.isArray(elements)) {
                return elements.map((el: any) => ({
                    ...el,
                    id: `gen-${Date.now()}-${Math.random()}`,
                    // Ensure coordinates are within bounds
                    x: Math.min(580, Math.max(20, el.x)),
                    y: Math.min(380, Math.max(20, el.y))
                }));
            }
        }
        return [];
    } catch (e) {
        console.error("Gemini Vision Error:", e);
        return [];
    }
};

// --- LEGACY FUNCTIONS (Mantidas para compatibilidade) ---
export const generatePracticePlan = async (prompt: string): Promise<string> => generateText(prompt);
export const generatePlayerAnalysis = async (player: Player, context: string): Promise<string> => generateText(`Analise ${player.name}: ${context}`);
export const generateMarketingContent = async (topic: string, platform: string): Promise<string> => generateText(`Post sobre ${topic} para ${platform}`);
export const generateSponsorshipProposal = async (company: string, value: number): Promise<string> => generateText(`Proposta para ${company} valor ${value}`);
export const generateCourseCurriculum = async (topic: string, level: string): Promise<string> => generateText(`Curso sobre ${topic} nível ${level}`);
export const generateGymPlan = async (goal: string, equip: string, profile: string): Promise<string> => generateText(`Treino ${goal} com ${equip}`);
export const generateInstallSchedule = async (ctx: string, week: string): Promise<InstallMatrixItem[]> => {
    const res = await generateJson(`Install schedule for ${ctx} week ${week}. Return JSON array.`);
    return Array.isArray(res) ? res : [];
};
export const analyzePlayMatchup = async (play: string, scout: GameScoutingReport, opp: string): Promise<string> => generateText(`Matchup: ${play} vs ${opp}`);
export const askRefereeBot = async (query: string): Promise<string> => generateText(`Regra FA: ${query}`);
export const generateJudicialReport = async (id: number, ejections: any[]): Promise<string> => generateText(`Relatório TJD jogo ${id}`);
