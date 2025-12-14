import { GoogleGenAI } from "@google/genai";
import { Player, GameScoutingReport, InstallMatrixItem, PracticeScriptItem, VideoClip, PlayElement, CombineStats } from "../types";

// @ts-ignore
const ENV_API_KEY = process.env.API_KEY || "";

let runtimeKey: string | null = null;
let aiClientInstance: GoogleGenAI | null = null;

export const setRuntimeKey = (key: string) => {
    console.log("🔑 Chave de API definida manualmente.");
    runtimeKey = key;
    aiClientInstance = null;
};

const getClient = (): GoogleGenAI => {
    const activeKey = runtimeKey || ENV_API_KEY;
    if (!activeKey) {
        console.warn("API Key missing. AI features will fail.");
    }
    if (!aiClientInstance && activeKey) {
        aiClientInstance = new GoogleGenAI({ apiKey: activeKey });
    }
    if (!aiClientInstance) {
        throw new Error("Chave de API ausente. Configure no painel ou .env");
    }
    return aiClientInstance;
};

const cleanJsonString = (input: string): string => {
    let clean = input.trim();
    clean = clean.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    return clean;
};

const generateJson = async (prompt: string): Promise<any> => {
    try {
        const ai = getClient();
        console.log("🤖 Gemini Request (JSON):", prompt.substring(0, 50) + "...");
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                temperature: 0.4,
            }
        });
        
        if (response.text) {
            try {
                return JSON.parse(cleanJsonString(response.text));
            } catch (parseError) {
                console.warn("⚠️ JSON Parse Error. Tentando corrigir...", response.text);
                const jsonMatch = response.text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
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
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 0.7 }
        });
        return response.text || "";
    } catch (e: any) {
        console.error("❌ Erro Gemini Texto:", e.message);
        throw e;
    }
};

// --- EXPORTED FUNCTIONS ---

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
