import { GoogleGenAI } from "@google/genai";
import { Player, GameScoutingReport, InstallMatrixItem, PracticeScriptItem, VideoClip, PlayElement, CombineStats } from "../types";

// Fallback para evitar crash se a env não estiver definida, mas avisa no console
const API_KEY = process.env.API_KEY || "";

let runtimeKey: string | null = null;
let aiClientInstance: GoogleGenAI | null = null;

export const setRuntimeKey = (key: string) => {
    console.log("🔑 Chave de API atualizada manualmente para a sessão.");
    runtimeKey = key;
    aiClientInstance = null; // Força recriação do cliente
};

const getClient = (): GoogleGenAI => {
    const activeKey = runtimeKey || API_KEY;
    if (!activeKey) {
        throw new Error("⚠️ Chave de API do Google Gemini não encontrada. Configure no .env ou insira manualmente nas configurações.");
    }
    if (!aiClientInstance) {
        aiClientInstance = new GoogleGenAI({ apiKey: activeKey });
    }
    return aiClientInstance;
};

// Limpeza agressiva de JSON (Remove blocos de código Markdown ```json ... ```)
const cleanJsonString = (input: string): string => {
    let clean = input.trim();
    clean = clean.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '');
    return clean;
};

// Wrapper genérico para chamadas JSON com tratamento de erro
const generateJson = async (prompt: string): Promise<any> => {
    try {
        const ai = getClient();
        console.log("🤖 [AI Request]:", prompt.substring(0, 100) + "...");
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                temperature: 0.4, // Baixa temperatura para dados estruturados
            }
        });
        
        if (response.text) {
            try {
                return JSON.parse(cleanJsonString(response.text));
            } catch (parseError) {
                console.warn("⚠️ JSON Parse Error. Raw text:", response.text);
                return null;
            }
        }
        return null;
    } catch (e: any) {
        console.error("❌ Erro na API Gemini:", e.message);
        if (e.message.includes('API key')) {
            alert("Erro de Autenticação: Verifique sua chave de API do Gemini.");
        }
        return null;
    }
};

const generateText = async (prompt: string): Promise<string> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 0.7 }
        });
        return response.text || "Sem resposta da IA.";
    } catch (e: any) {
        console.error("❌ Erro na API Gemini (Texto):", e.message);
        return "Erro ao processar solicitação. Verifique a chave de API.";
    }
};

// --- FUNÇÕES DE NEGÓCIO ---

export const classifyCoachVoiceNote = async (text: string): Promise<{ category: 'OFFENSE' | 'DEFENSE' | 'SPECIAL' | 'GENERAL', tags: string[], sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL', action?: string }> => {
    const prompt = `
    Analyze this football coach voice note: "${text}".
    Return JSON with:
    - category: 'OFFENSE', 'DEFENSE', 'SPECIAL', or 'GENERAL'.
    - tags: array of strings (e.g. "Blitz", "OL", "Tempo").
    - sentiment: 'POSITIVE', 'NEGATIVE', 'NEUTRAL'.
    - action: Short suggested action (e.g. "Review tape", "Sub player").
    `;
    const res = await generateJson(prompt);
    return res || { category: 'GENERAL', tags: ['Raw'], sentiment: 'NEUTRAL' };
};

export const generatePracticeScript = async (focus: string, duration: number, intensity: string): Promise<PracticeScriptItem[]> => {
    const prompt = `
    Create a Football Practice Script.
    Context: Focus on "${focus}". Duration: ${duration} minutes. Intensity: ${intensity}.
    Return JSON Array of objects: { startTime (HH:MM), durationMinutes (int), type (WARMUP|INDY|GROUP|TEAM|SPECIAL), activityName (string), description (string) }.
    Start time at 19:00. Make sure durations sum up to ${duration}.
    `;
    const res = await generateJson(prompt);
    return Array.isArray(res) ? res.map((i: any) => ({ ...i, id: `ai-${Date.now()}-${Math.random()}` })) : [];
};

export const analyzeOpponentTendencies = async (notes: string) => {
    return (await generateJson(`Analyze these scout notes and return JSON {summary, keysToVictory (array), suggestedConcepts (array)}: "${notes}"`)) || {};
};

export const suggestPlayConcepts = async (sit: string) => {
    return (await generateJson(`Suggest 3 offensive play concepts for situation: "${sit}". Return JSON array {name, reason}.`)) || [];
};

export const predictPlayCall = async (history: VideoClip[], down: number, dist: number) => {
    // Extrai contexto dos últimos clips para dar "memória" à IA
    const context = history.slice(-5).map(c => `${c.tags.down}&${c.tags.distance}: ${c.tags.offensivePlayCall}`).join(' | ');
    
    const prompt = `
    Predict the next offensive play call.
    Situation: ${down} down & ${dist} yards.
    Recent History: [${context}].
    Return JSON {prediction (string), confidence (string percentage), reason (string)}.
    `;
    return (await generateJson(prompt)) || { prediction: "Indisponível", confidence: "0%", reason: "Erro na IA" };
};

export const importPlaybookFromImage = async (base64: string): Promise<PlayElement[]> => {
     try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Flash é melhor para vision rápida
            contents: [
                { role: "user", parts: [
                    { text: "Analyze this football play diagram. Return a JSON array of players. Each object: {id (string), type ('OFFENSE'|'DEFENSE'), label (e.g. QB, WR, C, FS), x (int 0-600), y (int 0-400)}. Assume standard field orientation." }, 
                    { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
                ]}
            ],
            config: { responseMimeType: "application/json" }
        });
        return response.text ? JSON.parse(cleanJsonString(response.text)) : [];
    } catch (e) { 
        console.error("Vision Error", e);
        return []; 
    }
};

export const scanFinancialDocument = async (base64: string) => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                { role: "user", parts: [
                    { text: "Extract data from this receipt/invoice. Return JSON: {title (string), amount (number), date (YYYY-MM-DD), category (string enum: EQUIPMENT, TRANSPORT, FIELD_RENTAL, OTHER), description (string)}." }, 
                    { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
                ]}
            ],
            config: { responseMimeType: "application/json" }
        });
        return response.text ? JSON.parse(cleanJsonString(response.text)) : { title: "Erro na Leitura", amount: 0 };
    } catch (e) { throw new Error("Falha na leitura do documento."); }
};

export const analyzeCombineStats = async (stats: CombineStats, pos: string) => {
    return (await generateJson(`Analyze these NFL Combine stats for a ${pos}: ${JSON.stringify(stats)}. Return JSON {rating (0-100), potential (string), analysis (string), comparison (NFL Player Name)}`)) || {};
};

// Text Generators
export const generatePracticePlan = (p: string) => generateText(p);
export const generatePlayerAnalysis = (p: Player, c: string) => generateText(`Act as a Head Coach. Analyze player ${p.name} (${p.position}) based on these game logs: ${c}. Provide constructive feedback.`);
export const generateMarketingContent = (t: string, p: string) => generateText(`Write a ${p} post about: ${t}. Use emojis and hashtags.`);
export const generateSponsorshipProposal = (c: string, v: number) => generateText(`Write a sponsorship proposal email for company ${c} asking for R$${v}. Focus on youth program benefits.`);
export const generateCourseCurriculum = (t: string, l: string) => generateText(`Create a course curriculum JSON for topic "${t}" level "${l}". Structure: {title, description, modules: [{title, lessons: [{title, content, videoSearchTerm}]}]}.`);
export const generateGymPlan = (g: string, e: string, p: string) => generateText(`Create a gym workout plan for goal: ${g}, using equipment: ${e}. Format as HTML with bold tags.`);
export const generateInstallSchedule = async (c: string, w: string) => generateJson(`Create a weekly install schedule JSON based on this coach context: "${c}" for week "${w}". Return array of {day, category, concept}.`) || [];
export const analyzePlayMatchup = (p: string, s: GameScoutingReport, o: string) => generateText(`Analyze matchup: Play "${p}" vs Opponent "${o}" (Scout: ${s.defenseAnalysis}). Simulate outcome.`);
export const askRefereeBot = (q: string) => generateText(`You are a senior referee. Answer this rule question based on IFAF rules: ${q}`);
export const generateJudicialReport = (i: number, e: any[]) => generateText(`Write a formal judicial report for game ID ${i} regarding these ejections: ${JSON.stringify(e)}.`);
