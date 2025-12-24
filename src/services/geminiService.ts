
import { GoogleGenAI } from "@google/genai";
import { RecruitmentCandidate, Player } from "../types";

// Guidelines: Always use new GoogleGenAI({ apiKey: process.env.API_KEY }) directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanJson = (text: string) => {
    if (!text) return "{}";
    return text.replace(/```json|```/gi, '').trim();
};

export async function analyzeTryoutPerformance(candidate: RecruitmentCandidate) {
    const prompt = `
        Aja como um Senior Scout da NFL. Analise este candidato para Futebol Americano e sugira um rating OVR (0-100) e posição ideal.
        DADOS: ${JSON.stringify(candidate)}
        RETORNE APENAS JSON: { "potentialRating": number, "technicalAnalysis": "string", "suggestedPosition": "string" }
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { 
                responseMimeType: "application/json"
            }
        });
        return JSON.parse(cleanJson(response.text || "{}"));
    } catch (error) {
        console.error("Gemini Error:", error);
        return { potentialRating: 70, technicalAnalysis: "Análise indisponível no momento.", suggestedPosition: candidate.position };
    }
}

export async function generatePracticeScript(focus: string, duration: number, intensity: string) {
    const prompt = `
        Gere um roteiro de treino de ${duration}min for Futebol Americano focado em: ${focus}.
        INTENSIDADE: ${intensity}. 
        Retorne um array JSON de objetos: { "id": "string", "startTime": "HH:MM", "durationMinutes": number, "activityName": "string", "type": "string" }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { 
                responseMimeType: "application/json"
            }
        });
        return JSON.parse(cleanJson(response.text || "[]"));
    } catch (error) {
        console.error("Gemini Error:", error);
        return [];
    }
}

export async function generatePracticePlan(prompt: string) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });
        return response.text || "Sem resposta da IA.";
    } catch (error) {
        return "Erro ao gerar plano. Tente novamente.";
    }
}

export async function generatePlayerAnalysis(player: Player, context: string) {
    const prompt = `Analise a performance e biotipo do atleta ${player.name} (${player.position}) no contexto: ${context}. Gere um texto motivacional e técnico curto.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });
        return response.text || "";
    } catch (error) {
        return "Análise indisponível.";
    }
}

export async function importPlaybookFromImage(base64: string) {
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: {
                parts: [
                    { text: "Identifique os jogadores e rotas no diagrama tático e converta para JSON array de {id, type, label, x, y}." },
                    { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }
                ]
            }
        });
        return JSON.parse(cleanJson(response.text || "[]"));
    } catch (error) {
        console.error("Vision Error:", error);
        return [];
    }
}

export async function scanFinancialDocument(base64: string) {
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: {
                parts: [
                    { text: "Extraia os dados deste recibo para JSON: {title, amount, date, category}." },
                    { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }
                ]
            }
        });
        return JSON.parse(cleanJson(response.text || "{}"));
    } catch (error) {
        return {};
    }
}

export async function analyzeOpponentTendencies(notes: string) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Analise as tendências do adversário baseadas nestas notas de scout: ${notes}. Retorne JSON com summary e keysToVictory.`,
            config: { 
                responseMimeType: "application/json"
            }
        });
        return JSON.parse(cleanJson(response.text || "{}"));
    } catch (error) {
        return { summary: "Erro na análise.", keysToVictory: [] };
    }
}

export async function suggestPlayConcepts(situation: string) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Sugira jogadas e conceitos táticos para a seguinte situação: ${situation}`,
            config: { 
                responseMimeType: "application/json"
            }
        });
        return JSON.parse(cleanJson(response.text || "[]"));
    } catch (error) {
        return [];
    }
}

export async function explainPlayImage(base64: string, question: string) {
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: {
                parts: [
                    { text: `Explique este diagrama tático. Pergunta: ${question}` },
                    { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }
                ]
            }
        });
        return response.text || "";
    } catch (error) {
        return "Erro ao analisar imagem.";
    }
}

export async function analyzePlayMatchup(concept: string, scouting: any, opponent: string) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Analise como o conceito ${concept} se comporta contra o scout do adversário ${opponent}: ${JSON.stringify(scouting)}`,
        });
        return response.text || "";
    } catch (error) {
        return "Simulação indisponível.";
    }
}

export async function generateInstallSchedule(context: string) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Gere um cronograma de instalação tática baseado neste contexto: ${context}`,
            config: { 
                responseMimeType: "application/json"
            }
        });
        return JSON.parse(cleanJson(response.text || "[]"));
    } catch (error) {
        return [];
    }
}

export async function generateGymPlan(goal: string, equipment: string, program: string) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Gere um plano de treinamento de força focado em ${goal} para a modalidade ${program} com os seguintes equipamentos: ${equipment}. Formate em HTML simples.`,
        });
        return response.text || "";
    } catch (error) {
        return "Erro ao gerar treino.";
    }
}

export async function generateMarketingContent(topic: string, platform: string) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Crie um copy de marketing para a plataforma ${platform} sobre o tópico: ${topic}`,
        });
        return response.text || "";
    } catch (error) {
        return "Erro ao gerar copy.";
    }
}

export async function generateSponsorshipProposal(company: string, amount: number) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Escreva uma proposta formal de patrocínio para a empresa ${company} solicitando o valor de R$ ${amount}.`,
        });
        return response.text || "";
    } catch (error) {
        return "Erro ao gerar proposta.";
    }
}

export async function generateColorCommentary(home: string, away: string, context: string) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Aja como um narrador de Futebol Americano. Gere comentários sobre o jogo ${home} vs ${away} dado o contexto: ${context}. Responda em JSON com chaves: intro, homePlayerToWatch, awayPlayerToWatch, keyMatchups (array).`,
            config: { 
                responseMimeType: "application/json"
            }
        });
        return JSON.parse(cleanJson(response.text || "{}"));
    } catch (error) {
        return { intro: "Erro na conexão com narrador virtual.", keyMatchups: [] };
    }
}