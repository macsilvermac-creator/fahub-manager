import React, { useState } from 'react';
import Card from '../components/Card';
import { generatePracticePlan, analyzeOpponentTendencies, suggestPlayConcepts, setRuntimeKey } from '../services/geminiService';
import { SparklesIcon, AlertTriangleIcon, LinkIcon, KeyIcon, SearchIcon, PlayCircleIcon } from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';

const GeminiPlaybook: React.FC = () => {
  const toast = useToast();
  const [activeAgent, setActiveAgent] = useState<'DRILLS' | 'SCOUT' | 'TACTICS'>('DRILLS');
  
  // Inputs
  const [prompt, setPrompt] = useState('');
  const [scoutNotes, setScoutNotes] = useState('');
  const [tacticalSituation, setTacticalSituation] = useState('');
  const [manualKey, setManualKey] = useState('');

  // Outputs
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [scoutAnalysis, setScoutAnalysis] = useState<any>(null);
  const [playSuggestions, setPlaySuggestions] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);

  // --- HANDLERS ---

  const handleGenerateDrills = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setGeneratedPlan('');
    
    if (manualKey) setRuntimeKey(manualKey);
    
    const finalPrompt = `
      Atue como um treinador especialista. Gere um plano de drills técnicos.
      FOCO: ${prompt}
      Estrutura: 3 Drills detalhados com explicação do "Porquê" e termos de busca para vídeo.
    `;

    const result = await generatePracticePlan(finalPrompt);
    setGeneratedPlan(result);
    setIsLoading(false);
  };

  const handleAnalyzeScout = async () => {
      if (!scoutNotes.trim()) return;
      setIsLoading(true);
      if (manualKey) setRuntimeKey(manualKey);

      const result = await analyzeOpponentTendencies(scoutNotes);
      setScoutAnalysis(result);
      setIsLoading(false);
      toast.success("Análise de Scout concluída!");
  };

  const handleSuggestPlays = async () => {
      if (!tacticalSituation.trim()) return;
      setIsLoading(true);
      if (manualKey) setRuntimeKey(manualKey);

      const result = await suggestPlayConcepts(tacticalSituation);
      setPlaySuggestions(result);
      setIsLoading(false);
  };

  // --- RENDER HELPERS ---
  const formatPlanWithLinks = (text: string) => {
      // Basic formatting for markdown-like text
      let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-highlight">$1</strong>')
                          .replace(/### (.*?)\n/g, '<h3 class="text-lg font-bold text-white mt-4">$1</h3>')
                          .replace(/\n/g, '<br/>');
      return formatted;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg">
            <SparklesIcon className="h-8 w-8 text-white" />
        </div>
        <div>
            <h2 className="text-3xl font-bold text-text-primary">Coach Copilot AI</h2>
            <p className="text-text-secondary">Sua equipe de coordenadores virtuais powered by Gemini 2.5.</p>
        </div>
      </div>

      {/* AGENT SELECTOR */}
      <div className="flex gap-4 border-b border-white/10 pb-1 overflow-x-auto">
          <button onClick={() => setActiveAgent('DRILLS')} className={`px-6 py-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeAgent === 'DRILLS' ? 'border-purple-500 text-purple-400' : 'border-transparent text-text-secondary'}`}>
              🏈 Drills & Treino
          </button>
          <button onClick={() => setActiveAgent('SCOUT')} className={`px-6 py-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeAgent === 'SCOUT' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-secondary'}`}>
              🕵️ Scout Decoder
          </button>
          <button onClick={() => setActiveAgent('TACTICS')} className={`px-6 py-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeAgent === 'TACTICS' ? 'border-green-500 text-green-400' : 'border-transparent text-text-secondary'}`}>
              🧠 Oráculo Tático
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* INPUT AREA */}
        <Card title={activeAgent === 'DRILLS' ? "Gerador de Exercícios" : activeAgent === 'SCOUT' ? "Analisador de Tendências" : "Consultor de Chamadas"}>
          <div className="space-y-5">
            {activeAgent === 'DRILLS' && (
                <>
                    <label className="text-xs font-bold text-text-secondary uppercase">Foco Técnico</label>
                    <textarea 
                        className="w-full bg-primary border border-tertiary rounded-lg p-3 text-white h-32 focus:border-purple-500 focus:outline-none"
                        placeholder="Ex: Linebackers lendo Run vs Pass, WRs saindo da Press..."
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                    />
                    <button onClick={handleGenerateDrills} disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2">
                        {isLoading ? 'Criando Drills...' : 'Gerar Plano de Drills'}
                    </button>
                </>
            )}

            {activeAgent === 'SCOUT' && (
                <>
                    <label className="text-xs font-bold text-text-secondary uppercase">Notas Brutas do Adversário</label>
                    <textarea 
                        className="w-full bg-primary border border-tertiary rounded-lg p-3 text-white h-40 focus:border-blue-500 focus:outline-none text-sm font-mono"
                        placeholder={`Cole suas anotações aqui...\nEx: "Eles gostam de correr em descidas curtas. O QB não sabe lançar pra esquerda. A secundária joga muito em Cover 3."`}
                        value={scoutNotes}
                        onChange={e => setScoutNotes(e.target.value)}
                    />
                    <button onClick={handleAnalyzeScout} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2">
                        {isLoading ? 'Decodificando...' : 'Gerar Relatório Estratégico'}
                    </button>
                </>
            )}

            {activeAgent === 'TACTICS' && (
                <>
                    <label className="text-xs font-bold text-text-secondary uppercase">Situação de Jogo</label>
                    <input 
                        className="w-full bg-primary border border-tertiary rounded-lg p-3 text-white focus:border-green-500 focus:outline-none"
                        placeholder="Ex: 3rd & 12 na Redzone Adversária"
                        value={tacticalSituation}
                        onChange={e => setTacticalSituation(e.target.value)}
                    />
                    <button onClick={handleSuggestPlays} disabled={isLoading} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2">
                        {isLoading ? 'Consultando Playbook...' : 'Sugerir Conceitos'}
                    </button>
                </>
            )}

            {/* Configuração de Chave Manual (Debug) */}
            <div className="pt-4 border-t border-white/10">
                <details className="text-xs text-text-secondary cursor-pointer">
                    <summary>Configurações Avançadas (API Key)</summary>
                    <div className="mt-2">
                        <input 
                            type="text" 
                            className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"
                            placeholder="Chave API Personalizada (Opcional)"
                            value={manualKey}
                            onChange={e => setManualKey(e.target.value)}
                        />
                    </div>
                </details>
            </div>
          </div>
        </Card>

        {/* OUTPUT AREA */}
        <Card title="Resultado da IA" className="bg-secondary/30 border-dashed border-white/10 min-h-[300px]">
            {isLoading && (
                <div className="h-full flex flex-col items-center justify-center text-text-secondary animate-pulse">
                    <SparklesIcon className="w-12 h-12 mb-4 text-highlight" />
                    <p>Processando inteligência...</p>
                </div>
            )}

            {!isLoading && activeAgent === 'DRILLS' && generatedPlan && (
                <div className="prose prose-invert max-w-none text-sm custom-scrollbar max-h-[500px] overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ __html: formatPlanWithLinks(generatedPlan) }} />
                </div>
            )}

            {!isLoading && activeAgent === 'SCOUT' && scoutAnalysis && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-bold text-blue-300 uppercase text-xs mb-1">Identidade do Adversário</h4>
                        <p className="text-white text-sm">{scoutAnalysis.summary}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-2 flex items-center gap-2"><KeyIcon className="w-4 h-4 text-yellow-400"/> Chaves para a Vitória</h4>
                        <ul className="space-y-2">
                            {scoutAnalysis.keysToVictory?.map((key: string, idx: number) => (
                                <li key={idx} className="flex gap-2 text-sm text-text-secondary bg-black/20 p-2 rounded">
                                    <span className="text-yellow-500 font-bold">{idx + 1}.</span> {key}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-2">Conceitos Sugeridos</h4>
                        <div className="flex flex-wrap gap-2">
                            {scoutAnalysis.suggestedConcepts?.map((c: string, i: number) => (
                                <span key={i} className="bg-white/10 text-white text-xs px-3 py-1 rounded-full border border-white/10">{c}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {!isLoading && activeAgent === 'TACTICS' && playSuggestions.length > 0 && (
                <div className="space-y-4 animate-fade-in">
                    {playSuggestions.map((play, idx) => (
                        <div key={idx} className="bg-secondary p-4 rounded-xl border border-white/5 hover:border-green-500/50 transition-colors group">
                            <h4 className="font-bold text-green-400 text-lg mb-1 group-hover:text-green-300">{play.name}</h4>
                            <p className="text-sm text-text-secondary">{play.reason}</p>
                            <div className="mt-3 flex justify-end">
                                <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded">Copiar para Playbook</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && !generatedPlan && !scoutAnalysis && playSuggestions.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-text-secondary opacity-50">
                    <SearchIcon className="w-16 h-16 mb-4" />
                    <p>Aguardando comando...</p>
                </div>
            )}
        </Card>
      </div>
    </div>
  );
};

export default GeminiPlaybook;
