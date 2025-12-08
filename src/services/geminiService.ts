import { GoogleGenAI } from "@google/genai";
import { Player, GameScoutingReport, InstallMatrixItem, PracticeScriptItem } from "../types";

// @ts-ignore
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will not work.");
}

// Inicialização segura
const ai = new GoogleGenAI({ apiKey: API_KEY || "dummy_key_to_prevent_crash" });

// Função auxiliar para limpar o JSON que a IA retorna (remove ```json e ```)
const cleanJsonString = (input: string): string => {
    let clean = input.trim();
    // Remove wrapping markdown code blocks if present
    if (clean.startsWith('```json')) {
        clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
        clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return clean;
};

// Helper to handle JSON response safely
const generateJson = async (prompt: string): Promise<any> => {
    if (!API_KEY) return null;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                // Aumentar temperatura para criatividade, mas manter topP baixo para coerência
                temperature: 0.4 
            }
        });
        
        if (response.text) {
            try {
                const cleanedText = cleanJsonString(response.text);
                return JSON.parse(cleanedText);
            } catch (jsonError) {
                console.error("Falha ao fazer parse do JSON da IA:", response.text);
                return null;
            }
        }
        return null;
    } catch (e) {
        console.error("Gemini JSON Error", e);
        return null;
    }
};

// Helper for text response
const generateText = async (prompt: string): Promise<string> => {
    if (!API_KEY) return "Erro: API Key não configurada. Verifique suas variáveis de ambiente no Vercel.";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "";
    } catch (e) {
        console.error("Gemini Text Error", e);
        return "Erro ao gerar conteúdo. Tente novamente em instantes.";
    }
};

export const generateInstallSchedule = async (coachContext: string, weekInfo: string): Promise<InstallMatrixItem[]> => {
    if (!API_KEY) return [];

    const prompt = `
    Aja como um Coordenador Tático experiente de Futebol Americano.
    Seu Head Coach te passou a seguinte visão estratégica para a semana:
    
    "${coachContext}"
    
    Contexto da Semana: ${weekInfo}
    
    Com base nisso, organize a Matriz de Instalação Semanal (Install Schedule).
    Distribua os conceitos táticos (RUN, PASS, DEFENSE, SITUATION) entre Terça (TUE), Quarta (WED) e Quinta (THU).
    
    Retorne APENAS um JSON array estrito com objetos neste formato:
    [
      { "day": "TUE", "category": "RUN", "concept": "Inside Zone & Duo", "notes": "Foco em combos duplos" },
      { "day": "WED", "category": "PASS", "concept": "Mesh & Shallow Cross", "notes": "Contra Man Coverage" }
    ]
    `;

    const result = await generateJson(prompt);
    if (result && Array.isArray(result)) {
        return result.map((item: any) => ({ ...item, id: `inst-${Date.now()}-${Math.random()}` }));
    }
    return [];
};

export const generatePracticePlan = async (prompt: string): Promise<string> => {
    return generateText(prompt);
};

export const generatePracticeScript = async (focus: string, duration: string): Promise<PracticeScriptItem[]> => {
    if (!API_KEY) return [];
    
    const prompt = `
    Aja como um treinador de futebol americano.
    Crie um roteiro de treino (Practice Script) detalhado.
    Foco: ${focus}
    Duração: ${duration}
    
    Retorne um JSON array estrito onde cada item é uma atividade com:
    - startTime (HH:MM relativo ao inicio)
    - durationMinutes (number)
    - type ('WARMUP' | 'INDY' | 'GROUP' | 'TEAM' | 'SPECIAL')
    - activityName (string)
    - description (string)
    
    Exemplo: [{"startTime": "19:00", "durationMinutes": 10, "type": "WARMUP", "activityName": "Dynamic Stretch", "description": "Alongamento dinâmico"}]
    `;

    const result = await generateJson(prompt);
    if (result && Array.isArray(result)) {
        return result.map((item: any) => ({ ...item, id: `script-${Date.now()}-${Math.random()}` }));
    }
    return [];
};

export const generatePlayerAnalysis = async (player: Player, context: string): Promise<string> => {
    const prompt = `
    Analise o jogador ${player.name} (${player.position}) do FAHUB Stars.
    Dados Físicos: Altura ${player.height}, Peso ${player.weight}lbs.
    Combine: 40y: ${player.combineStats?.fortyYards || 'N/A'}s, Bench: ${player.combineStats?.benchPress || 'N/A'} reps.
    
    Contexto de Jogos Recentes:
    ${context}
    
    Gere um Plano de Desenvolvimento Individual (PDI) para as próximas 4 semanas.
    Foque em pontos fortes, áreas de melhoria e sugestões de exercícios específicos para a posição.
    Use formatação Markdown.
    `;
    return generateText(prompt);
};

export const analyzeDrillExecution = async (drillName: string, description: string, observation: string): Promise<string> => {
    const prompt = `
    Como um treinador expert, analise a execução do drill "${drillName}".
    Descrição do Drill: ${description}
    Observação do Coach (o que aconteceu): "${observation}"
    
    Forneça feedback corretivo para o atleta e uma sugestão de como melhorar na próxima repetição.
    `;
    return generateText(prompt);
};

export const analyzePlayMatchup = async (playConcept: string, scouting: GameScoutingReport, opponentName: string): Promise<string> => {
    const prompt = `
    Simule o matchup da seguinte jogada contra a defesa do ${opponentName}.
    
    Nossa Jogada (Conceito): ${playConcept}
    
    Relatório de Scout da Defesa Adversária:
    ${scouting.defenseAnalysis}
    Jogadores Chave Deles: ${scouting.keyPlayersToWatch}
    
    Analise:
    1. Probabilidade de Sucesso (Baixa/Média/Alta)
    2. Ponto Fraco da Defesa que exploramos
    3. Maior Risco (quem pode estragar a jogada)
    `;
    return generateText(prompt);
};

export const generateCourseCurriculum = async (topic: string, level: string): Promise<string> => {
    const prompt = `
    Crie um currículo de curso sobre "${topic}" para um público nível "${level}".
    
    Retorne um JSON puro (sem markdown) com a seguinte estrutura:
    {
      "title": "Título Criativo do Curso",
      "description": "Descrição curta e engajadora",
      "modules": [
        {
          "title": "Módulo 1: ...",
          "lessons": [
            { "title": "Lição 1.1", "content": "Resumo do conteúdo...", "videoSearchTerm": "termo de busca youtube" }
          ]
        }
      ]
    }
    `;
    // Aqui usamos generateText mas tentamos parsear manualmente pois courses usa JSON complexo
    const raw = await generateText(prompt);
    return cleanJsonString(raw); 
};

export const generateGymPlan = async (goal: string, equipment: string, profile: string): Promise<string> => {
    const prompt = `
    Crie um plano de treino de academia (musculação/força) para um jogador de Futebol Americano.
    Perfil: ${profile}
    Objetivo: ${goal}
    Equipamento Disponível: ${equipment}
    
    Gere o treino em formato Markdown, dividido por dias (ex: Dia A, Dia B). Inclua séries e repetições.
    `;
    return generateText(prompt);
};

export const generateMarketingContent = async (topic: string, platform: string): Promise<string> => {
    const prompt = `
    Atue como Social Media Manager de um time de Futebol Americano.
    Crie um texto (legenda/copy) para um post sobre: "${topic}".
    Plataforma: ${platform}.
    
    Use emojis, hashtags relevantes e um tom engajador e vibrante para a torcida.
    `;
    return generateText(prompt);
};

export const generateSponsorshipProposal = async (companyName: string, value: number): Promise<string> => {
    const prompt = `
    Escreva um email de prospecção de patrocínio para a empresa "${companyName}".
    Somos o time FAHUB Stars.
    Estamos solicitando um investimento de R$ ${value}.
    
    Destaque:
    - Visibilidade da marca no uniforme e transmissões.
    - Engajamento da torcida local.
    - Valores do esporte (disciplina, estratégia).
    
    O tom deve ser profissional mas apaixonado.
    `;
    return generateText(prompt);
};

export const askRefereeBot = async (query: string): Promise<string> => {
    const prompt = `
    Você é um especialista em regras de Futebol Americano (IFAF/CBFA).
    Responda a seguinte dúvida de um árbitro: "${query}"
    Seja conciso e cite a regra se possível.
    `;
    return generateText(prompt);
};

export const generateJudicialReport = async (gameId: number, ejections: any[]): Promise<string> => {
    const prompt = `
    Gere um relatório jurídico formal para o Tribunal de Justiça Desportiva (TJD).
    Jogo ID: ${gameId}
    Expulsões registradas: ${JSON.stringify(ejections)}
    
    O texto deve ser formal, descrevendo os fatos de forma imparcial para julgamento.
    `;
    return generateText(prompt);
};