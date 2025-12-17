
import { GoogleGenAI } from "@google/genai";
import { Player, GameScoutingReport, InstallMatrixItem, PracticeScriptItem, VideoClip, PlayElement, CombineStats, QuizQuestion, GymDay, Drill } from "../types";

// @ts-ignore
const ENV_API_KEY = process.env.API_KEY || "";

let aiClientInstance: GoogleGenAI | null = null;

// --- AI CACHE SYSTEM (MEMOIZATION) ---
const AI_CACHE: Record<string, { timestamp: number, data: any }> = {};
const CACHE_TTL = 1000 * 60 * 60; // 1 Hora de Cache

const getCacheKey = (model: string, prompt: string): string => {
    return btoa(encodeURIComponent(`${model}:${prompt.substring(0, 100)}`)); 
};

const checkCache = (key: string) => {
    const entry = AI_CACHE[key];
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > CACHE_TTL) {
        delete AI_CACHE[key];
        return null;
    }
    console.log("⚡ [AI CACHE] Hit!");
    return entry.data;
};

const setCache = (key: string, data: any) => {
    AI_CACHE[key] = {
        timestamp: Date.now(),
        data: data
    };
};

const getClient = (): GoogleGenAI => {
    if (!ENV_API_KEY) {
        console.warn("API Key missing in environment variables. AI features will be disabled.");
        throw new Error("Chave de API não configurada no ambiente.");
    }
    if (!aiClientInstance) {
        aiClientInstance = new GoogleGenAI({ apiKey: ENV_API_KEY });
    }
    return aiClientInstance;
};

const cleanJsonString = (input: string): string => {
    let clean = input.trim();
    clean = clean.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    return clean;
};

const generateJson = async (prompt: string): Promise<any> => {
    const model = 'gemini-2.5-flash';
    const cacheKey = getCacheKey(model, prompt);
    
    const cached = checkCache(cacheKey);
    if (cached) return cached;

    try {
        const ai = getClient();
        console.log("🤖 Gemini Request (JSON):", prompt.substring(0, 50) + "...");
        
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                temperature: 0.4,
            }
        });
        
        if (response.text) {
            try {
                const parsed = JSON.parse(cleanJsonString(response.text));
                setCache(cacheKey, parsed);
                return parsed;
            } catch (parseError) {
                console.warn("⚠️ JSON Parse Error, trying fix.");
                const jsonMatch = response.text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
                if (jsonMatch) {
                    const corrected = JSON.parse(jsonMatch[0]);
                    setCache(cacheKey, corrected);
                    return corrected;
                }
                return null;
            }
        }
        return null;
    } catch (e: any) {
        console.error("❌ Erro Gemini JSON:", e.message);
        throw e;
    }
};

const generateText = async (prompt: string): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const cacheKey = getCacheKey(model, prompt);
    const cached = checkCache(cacheKey);
    if (cached) return cached;

    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: { temperature: 0.7 }
        });
        const text = response.text || "";
        setCache(cacheKey, text);
        return text;
    } catch (e: any) {
        console.error("❌ Erro Gemini Texto:", e.message);
        throw e;
    }
};

// --- NEW AGENTS ---

export const generateDrillCards = async (focus: string, level: string): Promise<Drill[]> => {
    const prompt = `Create 3 American Football Drills for focus: "${focus}". Level: ${level}.
    Return JSON Array: [
        {
            "name": "Title of Drill",
            "description": "Setup and Execution instructions (keep concise)",
            "durationMinutes": 10,
            "videoSearchTerm": "Youtube search term for this drill"
        }
    ]`;
    
    const result = await generateJson(prompt);
    if (Array.isArray(result)) {
        return result.map((d: any) => ({ ...d, id: `gen-${Date.now()}-${Math.random()}` }));
    }
    return [];
};

export const analyzeDriveFootage = async (base64Video: string): Promise<any> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Flash é ideal para vídeo rápido
            contents: {
                parts: [
                    { text: `Analyze this American Football drive video. I need a statistical summary for the broadcast.
                    Return JSON: 
                    {
                        "playCount": number,
                        "passPlays": number,
                        "runPlays": number,
                        "totalYardsEst": number,
                        "result": "TOUCHDOWN" | "FIELD_GOAL" | "PUNT" | "TURNOVER" | "END_OF_HALF",
                        "keyPlayerNumber": number (if visible, else null),
                        "summary": "Short text summary in Portuguese (PT-BR) for the announcer"
                    }` },
                    { inlineData: { mimeType: "video/mp4", data: base64Video.split(',')[1] } }
                ]
            },
            config: { responseMimeType: "application/json" }
        });
        return response.text ? JSON.parse(cleanJsonString(response.text)) : null;
    } catch (e) {
        console.error("Erro Video Drive:", e);
        throw new Error("Falha ao analisar vídeo da campanha.");
    }
};

export const generateQuizFromContent = async (topic: string): Promise<QuizQuestion[]> => {
    const prompt = `Create a quiz for Football players about: "${topic}". Return JSON Array: [{ question: string, options: string[], correctAnswer: number (index 0-3), explanation: string }]. Generate 5 hard questions. Language: PT-BR.`;
    return (await generateJson(prompt)) || [];
};

export const generateStructuredGymPlan = async (goal: string, equipment: string): Promise<GymDay[]> => {
    const prompt = `Create a 3-day Football Gym Plan. Goal: "${goal}". Equipment: "${equipment}". 
    Return JSON structure: 
    [
        {
            "title": "Day 1: Upper Power",
            "focus": "Explosive Push",
            "exercises": [
                { "name": "Bench Press", "sets": "4", "reps": "5", "notes": "Explosive up" }
            ]
        }
    ]
    Language: PT-BR (but keep standard exercise names in English if common).`;
    
    return (await generateJson(prompt)) || [];
};

export const explainPlayImage = async (base64Image: string, playerQuestion: string): Promise<string> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    { text: `You are an expert American Football Coach. Analyze this play diagram or game footage frame. The player asks: "${playerQuestion}". Explain the formation, identify key players if possible, and explain the concept clearly in Portuguese (PT-BR). Keep it tactical and encouraging.` },
                    { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } }
                ]
            }
        });
        return response.text || "Não consegui analisar a imagem.";
    } catch (e) {
        console.error(e);
        return "Erro ao analisar imagem da jogada.";
    }
};

// --- EXISTING EXPORTS ---
export const classifyCoachVoiceNote = async (text: string) => {
    const prompt = `Analyze football coach note: "${text}". Return JSON: { category: 'OFFENSE'|'DEFENSE'|'SPECIAL'|'GENERAL', tags: string[], sentiment: 'POSITIVE'|'NEGATIVE'|'NEUTRAL', action?: string }`;
    return (await generateJson(prompt)) || { category: 'GENERAL', tags: [], sentiment: 'NEUTRAL' };
};

export const generatePracticeScript = async (focus: string, duration: number, intensity: string): Promise<PracticeScriptItem[]> => {
    const prompt = `Create Football Practice Script JSON. Focus: "${focus}". Duration: ${duration}min. Return Array<{ startTime, durationMinutes, type, activityName, description }>. Start 19:00.`;
    const res = await generateJson(prompt);
    return Array.isArray(res) ? res.map((i: any) => ({ ...i, id: `ai-${Date.now()}-${Math.random()}` })) : [];
};

export const analyzeOpponentTendencies = async (notes: string) => {
    return (await generateJson(`Analyze opponent notes returning JSON {summary, keysToVictory[], suggestedConcepts[]}: "${notes}"`)) || {};
};

export const suggestPlayConcepts = async (sit: string) => {
    return (await generateJson(`Suggest 3 offensive plays for "${sit}". JSON Array<{name, reason}>.`)) || [];
};

export const predictPlayCall = async (history: VideoClip[], down: number, dist: number) => {
    const prompt = `Predict next play. Situation: ${down}&${dist}. Return JSON {prediction, confidence, reason}.`;
    return (await generateJson(prompt)) || { prediction: "N/A", confidence: "0%", reason: "Erro IA" };
};

export const importPlaybookFromImage = async (base64: string): Promise<PlayElement[]> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    { text: "Extract players from diagram to JSON Array<{id, type:'OFFENSE'|'DEFENSE', label, x, y}>. 600x400 canvas." },
                    { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
                ]
            },
            config: { responseMimeType: "application/json" }
        });
        return response.text ? JSON.parse(cleanJsonString(response.text)) : [];
    } catch (e) { return []; }
};

export const scanFinancialDocument = async (base64: string) => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    { text: "Extract receipt data to JSON: {title, amount, date (YYYY-MM-DD), category, description}." },
                    { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }
                ]
            },
            config: { responseMimeType: "application/json" }
        });
        return response.text ? JSON.parse(cleanJsonString(response.text)) : { title: "Erro", amount: 0 };
    } catch (e) { throw new Error("Falha na leitura."); }
};

export const analyzeCombineStats = async (stats: CombineStats, pos: string) => {
    return (await generateJson(`Analyze Combine stats for ${pos}: ${JSON.stringify(stats)}. JSON {rating (0-100), potential, analysis, comparison}`)) || {};
};

export const generatePracticePlan = (p: string) => generateText(p);
export const generatePlayerAnalysis = (p: Player, c: string) => generateText(`Analyze player ${p.name} (${p.position}) based on: ${c}. Keep it short.`);
export const generateMarketingContent = (t: string, p: string) => generateText(`Write a ${p} post about: "${t}". Use emojis. PT-BR.`);
export const generateSponsorshipProposal = (c: string, v: number) => generateText(`Write sponsorship email for ${c} asking R$${v}.`);
export const generateCourseCurriculum = (t: string, l: string) => generateText(`Create course JSON for "${t}" level "${l}". {title, description, modules:[{title, lessons:[{title, content, videoSearchTerm}]}]}`);
export const generateGymPlan = (g: string, e: string, p: string) => generateText(`Create HTML workout plan for: ${g}. Equipment: ${e}.`);
export const generateInstallSchedule = async (c: string, w: string) => generateJson(`Create install schedule JSON for context: "${c}". Array<{day, category, concept}>.`) || [];
export const analyzePlayMatchup = (p: string, s: GameScoutingReport, o: string) => generateText(`Simulate play "${p}" vs "${o}". Short result.`);
export const askRefereeBot = (q: string) => generateText(`Referee Bot: Answer based on IFAF rules: ${q}`);
export const generateJudicialReport = (i: number, e: any[]) => generateText(`Write judicial report for game ${i}, ejections: ${JSON.stringify(e)}.`);
