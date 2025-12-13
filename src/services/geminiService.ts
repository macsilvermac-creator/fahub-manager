
import { GoogleGenAI } from "@google/genai";
import { Player, GameScoutingReport, InstallMatrixItem, PracticeScriptItem, VideoClip, PlayElement, CombineStats } from "../types";

// @ts-ignore
const ENV_KEY = process.env.API_KEY;
const FALLBACK_KEY = "AIzaSyB6VDLKBK9Siz81DC_bEm54oMILT-Hd6wA";
const API_KEY = ENV_KEY || FALLBACK_KEY;

let runtimeKey: string | null = null;
let aiClientInstance: GoogleGenAI | null = null; // Singleton

export const setRuntimeKey = (key: string) => {
    console.log("🔑 Chave de API atualizada manualmente!");
    runtimeKey = key;
    aiClientInstance = null; // Força recriação
};

// Singleton Getter - Previne Memory Leak no VS Code e Browser
const getClient = () => {
    if (aiClientInstance) return aiClientInstance;
    
    const activeKey = runtimeKey || API_KEY;
    aiClientInstance = new GoogleGenAI({ apiKey: activeKey });
    return aiClientInstance;
};

const cleanJsonString = (input: string): string => {
    let clean = input.trim();
    if (clean.startsWith('```json')) {
        clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
        clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return clean;
};

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
                return JSON.parse(cleanJsonString(response.text));
            } catch (e) {
                return null;
            }
        }
        return null;
    } catch (e) {
        console.error("Gemini Error:", e);
        return null;
    }
};

const generateText = async (prompt: string): Promise<string> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "";
    } catch (e) {
        return "Erro ao processar IA.";
    }
};

export const classifyCoachVoiceNote = async (text: string): Promise<{ category: 'GENERAL' | 'TACTICAL' | 'PLAYER' | 'OFFICIAL', tags: string[], sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL', action?: string }> => {
    if (!text || text.length < 2) return { category: 'GENERAL', tags: [], sentiment: 'NEUTRAL' };

    const prompt = `
    Analise esta fala de um Coach de FA na sideline: "${text}"
    Classifique a intenção: TACTICAL, PLAYER, OFFICIAL, GENERAL.
    Sentiment: POSITIVE, NEGATIVE, NEUTRAL.
    Tags: Keywords.
    Action: Sugestão de ação curta.
    Retorne JSON.
    `;

    const result = await generateJson(prompt);
    return result || { category: 'GENERAL', tags: ['RAW_VOICE'], sentiment: 'NEUTRAL' };
};

export const generatePracticeScript = async (focus: string, duration: number, intensity: string): Promise<PracticeScriptItem[]> => {
    const prompt = `Create a Football Practice Script JSON for: ${focus}, ${duration}min, ${intensity}. Array of objects: {startTime, durationMinutes, type, activityName, description}.`;
    const result = await generateJson(prompt);
    return Array.isArray(result) ? result.map((i: any) => ({ ...i, id: `ai-${Date.now()}-${Math.random()}` })) : [];
};

export const analyzeOpponentTendencies = async (notes: string) => {
    return (await generateJson(`Analyze opponent notes and return JSON {summary, keysToVictory, suggestedConcepts}: ${notes}`)) || {};
};

export const suggestPlayConcepts = async (sit: string) => {
    return (await generateJson(`Suggest 3 football play concepts for: ${sit}. Return JSON array {name, reason}.`)) || [];
};

export const predictPlayCall = async (history: VideoClip[], down: number, dist: number) => {
    const context = history.slice(0, 10).map(c => c.tags.offensivePlayCall).join(', ');
    const prompt = `Predict next play based on history: [${context}] for situation ${down} & ${dist}. Return JSON {prediction, confidence, reason}.`;
    return (await generateJson(prompt)) || { prediction: "Indisponível", confidence: "Baixa", reason: "Poucos dados." };
};

export const importPlaybookFromImage = async (base64: string): Promise<PlayElement[]> => {
     try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                { role: "user", parts: [{ text: "Extract football players X/O positions to JSON array {id, type, label, x, y} based on 600x400 canvas." }, { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }] }
            ],
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
            contents: [
                { role: "user", parts: [{ text: "Extract receipt data to JSON {title, amount, date, category, description}." }, { inlineData: { mimeType: "image/jpeg", data: base64.split(',')[1] } }] }
            ],
            config: { responseMimeType: "application/json" }
        });
        return response.text ? JSON.parse(cleanJsonString(response.text)) : {};
    } catch (e) { throw new Error("Falha na leitura"); }
};

export const analyzeCombineStats = async (stats: CombineStats, pos: string) => {
    return (await generateJson(`Analyze NFL Combine stats for ${pos}: ${JSON.stringify(stats)}. Return JSON {rating, potential, analysis, comparison}`)) || {};
};

export const generatePracticePlan = (p: string) => generateText(p);
export const generatePlayerAnalysis = (p: Player, c: string) => generateText(`Analyze player ${p.name}: ${c}`);
export const generateMarketingContent = (t: string, p: string) => generateText(`Write ${p} post about ${t}`);
export const generateSponsorshipProposal = (c: string, v: number) => generateText(`Sponsorship proposal for ${c} value ${v}`);
export const generateCourseCurriculum = (t: string, l: string) => generateText(`Course curriculum for ${t} level ${l} as JSON`);
export const generateGymPlan = (g: string, e: string, p: string) => generateText(`Gym plan for ${g} using ${e}`);
export const generateInstallSchedule = async (c: string, w: string) => generateJson(`Install schedule JSON for ${c} week ${w}`) || [];
export const analyzePlayMatchup = (p: string, s: GameScoutingReport, o: string) => generateText(`Matchup ${p} vs ${o}`);
export const askRefereeBot = (q: string) => generateText(`Rule check: ${q}`);
export const generateJudicialReport = (i: number, e: any[]) => generateText(`Judicial report game ${i}`);
