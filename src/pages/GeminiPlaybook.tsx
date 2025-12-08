import React, { useState } from 'react';
import Card from '../components/Card';
import { generatePracticePlan } from '../services/geminiService';
import { SparklesIcon, AlertTriangleIcon } from '../components/icons/UiIcons';
import { VideoIcon } from '../components/icons/NavIcons';

const POSITIONS = [
    { value: 'ALL', label: 'Time Completo / Geral' },
    { value: 'QB', label: 'Quarterbacks (QB)' },
    { value: 'RB', label: 'Running Backs (RB)' },
    { value: 'WR', label: 'Wide Receivers (WR)' },
    { value: 'OL', label: 'Linha Ofensiva (OL)' },
    { value: 'DL', label: 'Linha Defensiva (DL)' },
    { value: 'LB', label: 'Linebackers (LB)' },
    { value: 'DB', label: 'Defensive Backs (DB)' },
    { value: 'ST', label: 'Special Teams (ST)' }
];

const GeminiPlaybook: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('ALL');
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setGeneratedPlan('');
    setErrorMessage('');
    
    const targetAudience = POSITIONS.find(p => p.value === selectedPosition)?.label || 'Time Completo';
    
    const finalPrompt = `
      Atue como um treinador especialista. Gere um plano de treino detalhado.
      
      PÚBLICO ALVO: ${targetAudience}
      FOCO DO TREINO: ${prompt}
      
      Estrutura Obrigatória:
      1. Aquecimento Específico para ${selectedPosition === 'ALL' ? 'Futebol Americano' : 'a posição de ' + selectedPosition}.
      2. "Indy Drills" (Exercícios Individuais): Liste 3 drills técnicos detalhados especificamente para ${targetAudience}. Explique o "Porquê" de cada drill. IMPORTANTE: Para cada drill, sugira um TERMO DE BUSCA PARA VÍDEO entre parênteses.
      3. ${selectedPosition === 'ALL' ? 'Treino Coletivo / Team Period' : 'Aplicação em Situação de Jogo'}: Como aplicar isso no campo.
      4. Condicionamento Final.
    `;

    const result = await generatePracticePlan(finalPrompt);
    
    if (result.startsWith('⚠️')) {
        setErrorMessage(result);
        setGeneratedPlan('');
    } else {
        setGeneratedPlan(result);
        setErrorMessage('');
    }
    
    setIsLoading(false);
  };

  const handleExampleClick = (examplePrompt: string, position: string = 'ALL') => {
    setPrompt(examplePrompt);
    setSelectedPosition(position);
  };
  
  const formatPlanWithLinks = (text: string) => {
      let formatted = text.replace(/(\*\*|###|##|#)(.*?)\1/g, (match, p1, p2) => {
        if (p1 === '**') return `<strong class="text-highlight">${p2}</strong>`;
        if (p1 === '###') return `<h3 class="text-lg font-semibold mt-4 mb-2 text-text-primary">${p2}</h3>`;
        if (p1 === '##') return `<h2 class="text-xl font-bold mt-6 mb-3 text-text-primary border-b border-accent pb-1">${p2}</h2>`;
        if (p1 === '#') return `<h1 class="text-2xl font-bold mt-8 mb-4 text-text-primary">${p2}</h1>`;
        return match;
      }).replace(/\* (.*?)\n/g, '<li class="ml-5 list-disc">$1</li>');

      formatted = formatted.replace(/\((Busca sugerida|Video Search): (.*?)\)/gi, (match, p1, term) => {
          const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(term)}`;
          return ` <a href="${url}" target="_blank" class="inline-flex items-center gap-1 text-xs bg-red-600/20 text-red-400 hover:text-red-300 px-2 py-0.5 rounded border border-red-500/30 no-underline ml-1">🎥 Buscar Vídeo: "${term}"</a>`;
      });

      return formatted;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <SparklesIcon className="h-8 w-8 text-highlight" />
        <h2 className="text-3xl font-bold text-text-primary">Assistente de Playbook Gemini</h2>
      </div>
      <p className="text-text-secondary max-w-2xl">
        Aproveite o poder do modelo Google Gemini Pro para gerar planos de treino complexos e detalhados.
        A IA irá sugerir termos de busca para vídeos de demonstração dos exercícios.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Configurar Plano de Treino">
          <div className="space-y-5">
            
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                    Grupo / Posição Alvo
                </label>
                <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="w-full bg-primary border border-tertiary rounded-lg p-3 text-text-primary focus:ring-2 focus:ring-highlight focus:outline-none"
                >
                    {POSITIONS.map(pos => (
                        <option key={pos.value} value={pos.label}>{pos.label}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-text-secondary mb-2">
                Objetivo / Foco do Treino
                </label>
                <textarea
                id="prompt"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-primary border border-tertiary rounded-lg p-3 text-text-primary focus:ring-2 focus:ring-highlight focus:outline-none placeholder-gray-600"
                placeholder={selectedPosition === 'ALL' 
                    ? "ex: Instalação de Cover 2, Red Zone Offense..." 
                    : `ex: ${selectedPosition === 'WR' ? 'Release na linha de scrimmage, rotas profundas...' : 'Técnica de pés, leitura de bloqueio...'}`
                }
                />
            </div>
            
            <div className="text-sm text-text-secondary">
              <span className="font-bold text-white">Sugestões Rápidas:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                  <button onClick={() => handleExampleClick('Pass Rush Moves (Swim & Rip)', 'DL')} className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-xs text-cyan-400 border border-white/10">
                      DL: Pass Rush
                  </button>
                  <button onClick={() => handleExampleClick('Leitura de Zone Coverage e Quebra de Rota', 'WR')} className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-xs text-cyan-400 border border-white/10">
                      WR: Zone Read
                  </button>
                  <button onClick={() => handleExampleClick('Footwork no Pocket e Progressão de Leitura', 'QB')} className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-xs text-cyan-400 border border-white/10">
                      QB: Footwork
                  </button>
                  <button onClick={() => handleExampleClick('Cobertura Man-to-Man Press', 'DB')} className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-xs text-cyan-400 border border-white/10">
                      DB: Press Man
                  </button>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-3 bg-gradient-to-r from-highlight to-highlight-hover text-white rounded-lg font-bold shadow-lg hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando Drills & Plano...
                </>
              ) : 'Gerar Plano com IA'}
            </button>
          </div>
        </Card>

        <Card title="Plano Gerado pela IA" className={generatedPlan || isLoading ? 'bg-secondary/40' : 'flex items-center justify-center bg-secondary/20 border-dashed border-white/10'}>
          {isLoading && (
              <div className="text-center p-8">
                  <SparklesIcon className="w-12 h-12 text-highlight mx-auto mb-4 animate-pulse" />
                  <p className="text-text-primary font-bold text-lg">Consultando Base de Conhecimento...</p>
                  <p className="text-sm text-text-secondary mt-2">Criando exercícios específicos para {selectedPosition}...</p>
              </div>
          )}
          
          {!isLoading && errorMessage && (
              <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
                  <AlertTriangleIcon className="w-12 h-12 text-red-400 mx-auto mb-3" />
                  <h3 className="text-red-400 font-bold mb-2">Falha na Geração</h3>
                  <p className="text-sm text-white/80 mb-4">{errorMessage}</p>
                  <p className="text-xs text-text-secondary">Dica: Verifique se sua chave API tem permissão para 'Generative AI' no console do Google Cloud.</p>
              </div>
          )}

          {generatedPlan ? (
            <div className="prose prose-invert max-w-none prose-p:text-text-secondary prose-li:text-text-secondary custom-scrollbar max-h-[600px] overflow-y-auto pr-2" dangerouslySetInnerHTML={{ __html: formatPlanWithLinks(generatedPlan) }}></div>
          ) : !isLoading && !errorMessage && (
              <div className="text-center p-8 text-text-secondary opacity-60">
                  <SparklesIcon className="w-12 h-12 mx-auto mb-3" />
                  <p>Selecione uma posição e um tema para gerar seu treino.</p>
              </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default GeminiPlaybook;