
import { GoogleGenAI, Type } from "@google/genai";

// Initialize AI Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

/**
 * Common coach personality for basic responses.
 */
export const generateCoachResponse = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            systemInstruction: "Você é um Head Coach de Futebol Americano motivador e firme. Use gírias do esporte. Responda em PT-BR.",
            temperature: 0.8
        }
    });
    return response.text || "";
};

/**
 * Validates if an image contains gym environment elements.
 */
export const validateGymImage = async (base64Data: string): Promise<boolean> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: "Analise esta imagem. Ela contém equipamentos de academia, pesos, esteiras ou ambiente de treino físico? Responda apenas TRUE ou FALSE." },
                { inlineData: { mimeType: "image/jpeg", data: base64Data.split(',')[1] } }
            ]
        }
    });
    const result = response.text?.trim().toUpperCase();
    return result?.includes('TRUE') || false;
};

/**
 * Analyzes opponent tendencies from raw notes.
 */
export const analyzeOpponentTendencies = async (notes: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise estas notas de scout e retorne um JSON com summary (string), keysToVictory (array) e suggestedConcepts (array): "${notes}"`,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING },
                    keysToVictory: { type: Type.ARRAY, items: { type: Type.STRING } },
                    suggestedConcepts: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['summary', 'keysToVictory', 'suggestedConcepts']
            }
        }
    });
    return JSON.parse(response.text || "{}");
};

/**
 * Suggests offensive or defensive play concepts for a given situation.
 */
export const suggestPlayConcepts = async (situation: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Sugira 3 jogadas de futebol americano para: "${situation}". Retorne Array de objetos {name, reason}.`,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        reason: { type: Type.STRING }
                    },
                    required: ['name', 'reason']
                }
            }
        }
    });
    return JSON.parse(response.text || "[]");
};

/**
 * Generates a structured gym plan in JSON format.
 */
export const generateStructuredGymPlan = async (goal: string, equipment: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Crie um treino de academia focado em: ${goal}. Equipamentos: ${equipment}. Retorne JSON Array de GymDay.`,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        focus: { type: Type.STRING },
                        exercises: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    sets: { type: Type.STRING },
                                    reps: { type: Type.STRING },
                                    notes: { type: Type.STRING }
                                },
                                required: ['name', 'sets', 'reps', 'notes']
                            }
                        }
                    },
                    required: ['title', 'focus', 'exercises']
                }
            }
        }
    });
    return JSON.parse(response.text || "[]");
};

/**
 * Analyzes player combine metrics.
 */
export const analyzeCombineStats = async (stats: any, pos: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise as métricas de combine para ${pos}: ${JSON.stringify(stats)}. Retorne JSON.`,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    rating: { type: Type.NUMBER },
                    potential: { type: Type.STRING },
                    analysis: { type: Type.STRING },
                    comparison: { type: Type.STRING }
                },
                required: ['rating', 'potential', 'analysis', 'comparison']
            }
        }
    });
    return JSON.parse(response.text || "{}");
};

/**
 * Explains tactical responsibility based on a diagram or frame.
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
 * Scans a financial document and extracts metadata.
 */
export const scanFinancialDocument = async (base64Image: string) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Extraia dados deste comprovante para JSON: {title, amount (number), date (YYYY-MM-DD), category, description}." },
                { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } }
            ]
        },
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    amount: { type: Type.NUMBER },
                    date: { type: Type.STRING },
                    category: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ['title', 'amount', 'date', 'category', 'description']
            }
        }
    });
    return JSON.parse(response.text || "{}");
};

/**
 * Generates a formal sponsorship proposal email.
 */
export const generateSponsorshipProposal = async (company: string, value: number) => {
    return generateCoachResponse(`Escreva um email formal de prospecção de patrocínio para a empresa ${company} solicitando um investimento de R$ ${value}. Destaque o retorno de marca em um time de futebol americano.`);
};

/**
 * Classifies a coach's spoken voice note.
 */
export const classifyCoachVoiceNote = async (text: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Classifique a nota do técnico: "${text}". Retorne JSON: { category, tags: string[], action?: string }.`,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    category: { type: Type.STRING },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    action: { type: Type.STRING }
                },
                required: ['category', 'tags']
            }
        }
    });
    return JSON.parse(response.text || '{"category": "GENERAL", "tags": []}');
};

/**
 * Predicts the next play call based on history and situation.
 */
export const predictPlayCall = async (history: any[], down: number, dist: number) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Preveja a próxima jogada. Situação: ${down}ª & ${dist}. Histórico: ${JSON.stringify(history.slice(-10))}. Retorne JSON {prediction, confidence, reason}.`,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    prediction: { type: Type.STRING },
                    confidence: { type: Type.STRING },
                    reason: { type: Type.STRING }
                },
                required: ['prediction', 'confidence', 'reason']
            }
        }
    });
    return JSON.parse(response.text || '{"prediction": "N/A", "confidence": "0%", "reason": "IA indisponível"}');
};

/**
 * Analyzes a tactical matchup between a play and scouting report.
 */
export const analyzePlayMatchup = async (playConcept: string, scoutReport: any, opponent: string) => {
    return generateCoachResponse(`Analise como o conceito "${playConcept}" se comportaria contra a defesa do ${opponent} (Scout: ${JSON.stringify(scoutReport)}). Responda com pontos fortes e fracos da chamada.`);
};

/**
 * Generates an installation schedule for the week.
 */
export const generateInstallSchedule = async (context: string, weekInfo: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Crie uma matriz de instalação semanal para: ${context}. Semana: ${weekInfo}. Retorne JSON Array de objetos {day, category, concept}.`,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        day: { type: Type.STRING },
                        category: { type: Type.STRING },
                        concept: { type: Type.STRING }
                    },
                    required: ['day', 'category', 'concept']
                }
            }
        }
    });
    return JSON.parse(response.text || "[]");
};

/**
 * Extracts play elements from a hand-drawn diagram or image.
 */
export const importPlaybookFromImage = async (base64Image: string) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
            parts: [
                { text: "Extraia jogadores do diagrama para JSON Array<{id, type:'OFFENSE'|'DEFENSE', label, x, y}>. Canvas 600x400." },
                { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } }
            ]
        },
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        type: { type: Type.STRING },
                        label: { type: Type.STRING },
                        x: { type: Type.NUMBER },
                        y: { type: Type.NUMBER }
                    },
                    required: ['id', 'type', 'label', 'x', 'y']
                }
            }
        }
    });
    return JSON.parse(response.text || "[]");
};

/**
 * Generates color commentary notes for broadcasters.
 */
export const generateColorCommentary = async (homeTeam: string, awayTeam: string, situation: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Gere notas de narração para ${homeTeam} vs ${awayTeam}. Situação: ${situation}. Retorne JSON {intro, homePlayerToWatch, awayPlayerToWatch, keyMatchups: string[]}.`,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    intro: { type: Type.STRING },
                    homePlayerToWatch: { type: Type.STRING },
                    awayPlayerToWatch: { type: Type.STRING },
                    keyMatchups: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['intro', 'homePlayerToWatch', 'awayPlayerToWatch', 'keyMatchups']
            }
        }
    });
    return JSON.parse(response.text || "{}");
};

/**
 * AI Assistant for Referee rules questions.
 */
export const askRefereeBot = async (question: string) => {
    return generateCoachResponse(`Atue como um árbitro principal da IFAF. Responda tecnicamente sobre as regras: ${question}`);
};

/**
 * Generates a formal judicial report for game ejections.
 */
export const generateJudicialReport = async (gameId: number, ejections: any[]) => {
    return generateCoachResponse(`Escreva um relatório oficial de súmula para o TJD sobre as expulsões no jogo #${gameId}: ${JSON.stringify(ejections)}. Use linguagem jurídica desportiva formal.`);
};

/**
 * Standard content generation for practice plans.
 */
export const generatePracticePlan = (p: string) => generateCoachResponse(p);

/**
 * Specific function for minute-by-minute practice scripts.
 */
export const generatePracticeScript = async (focus: string, duration: number, intensity: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Crie um roteiro de treino de ${duration}min focado em: ${focus}. Intensidade: ${intensity}. Retorne JSON Array de PracticeScriptItem {startTime, durationMinutes, type, activityName, description}. Comece às 19:00.`,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        startTime: { type: Type.STRING },
                        durationMinutes: { type: Type.NUMBER },
                        type: { type: Type.STRING },
                        activityName: { type: Type.STRING },
                        description: { type: Type.STRING }
                    },
                    required: ['startTime', 'durationMinutes', 'type', 'activityName', 'description']
                }
            }
        }
    });
    return JSON.parse(response.text || "[]");
};

/**
 * Course curriculum generator.
 */
export const generateCourseCurriculum = async (topic: string, level: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Crie um currículo de curso sobre "${topic}" para nível "${level}". Retorne JSON com title, description e modules.`,
        config: { 
            responseMimeType: "application/json"
        }
    });
    return response.text || "{}";
};

/**
 * Markdown workout plan generator (legacy text support).
 */
export const generateGymPlan = (goal: string, equipment: string, userType: string) => {
    return generateCoachResponse(`Crie um plano de treino de musculação (HTML/Markdown) para um ${userType} focado em: ${goal}. Equipamento: ${equipment}.`);
};
