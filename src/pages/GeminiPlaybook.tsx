
import React, { useState, useRef } from 'react';
import Card from '../components/Card';
import { generatePracticePlan, analyzeOpponentTendencies, suggestPlayConcepts, explainPlayImage } from '../services/geminiService';
import { SparklesIcon, KeyIcon, SearchIcon, ImageIcon, CheckCircleIcon, EyeIcon } from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';

// --- FEATURE FLAG ---
const ENABLE_AI_BETA = true;

const GeminiPlaybook: React.FC = () => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeAgent, setActiveAgent] = useState<'DRILLS' | 'SCOUT' | 'TACTICS' | 'VISION'>('DRILLS');
  
  // Inputs
  const [prompt, setPrompt] = useState('');
  const [scoutNotes, setScoutNotes] = useState('');
  const [tacticalSituation, setTacticalSituation] = useState('');
  
  // Vision Inputs
  const [visionImage, setVisionImage] = useState<string | null>(null);
  const [visionQuestion, setVisionQuestion] = useState('');

  // Outputs
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [scoutAnalysis, setScoutAnalysis] = useState<any>(null);
  const [playSuggestions, setPlaySuggestions] = useState<any[]>([]);
  const [visionExplanation, setVisionExplanation] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // --- HANDLERS ---

  const handleGenerateDrills = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setGeneratedPlan('');
    setErrorMsg('');
    
    const finalPrompt = `
      Atue como um treinador especialista. Gere plano de drills. FOCO: ${prompt}
      Estrutura (HTML): <h3>Drill 1</h3><p>...</p>
    `;

    try {
        const result = await generatePracticePlan(finalPrompt);
        setGeneratedPlan(result);
        toast.success("Plano gerado!");
    } catch (e) {
        toast.error("Erro na IA. Verifique a configuração.");
    }
    setIsLoading(false);
  };

  const handleAnalyzeScout = async () => {
      if (!scoutNotes.trim()) return;
      setIsLoading(true);
      try {
          const result = await analyzeOpponentTendencies(scoutNotes);
          setScoutAnalysis(result);
      } catch (e) {
          toast.error("Erro ao analisar scout.");
      }
      setIsLoading(false);
  };

  const handleSuggestPlays = async () => {
      if (!tacticalSituation.trim()) return;
      setIsLoading(true);
      try {
          const result = await suggestPlayConcepts(tacticalSituation);
          setPlaySuggestions(result);
      } catch (e) {
          toast.error("Erro ao sugerir jogadas.");
      }
      setIsLoading(false);
  };

  const handleVisionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.readAsDataURL(e.target.files[0]);
          reader.onload = () => setVisionImage(reader.result as string);
          toast.info("Imagem carregada. Faça sua pergunta.");
      }
  };

  const handleExplainImage = async () => {
      if (!visionImage || !visionQuestion) {
          toast.warning("Envie uma imagem e faça uma pergunta.");
          return;
      }
      setIsLoading(true);
      try {
          const explanation = await explainPlayImage(visionImage, visionQuestion);
          setVisionExplanation(explanation);
          toast.success("Análise tática concluída!");
      } catch (e) {
          toast.error("Erro na visão computacional.");
      } finally {
          setIsLoading(false);
      }
  };

  // --- RENDER HELPERS ---
  const formatPlanWithLinks = (text: string) => {
      return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-highlight">$1</strong>')
                 .replace(/### (.*?)\n/g, '<h3 class="text-lg font-bold text-white mt-4">$1</h3>')
                 .replace(/\n/g, '<br/>');
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

      <div className="flex gap-4 border-b border-white/10 pb-1 overflow-x-auto">
          <button onClick={() => setActiveAgent('DRILLS')} className={`px-6 py-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors ${activeAgent === 'DRILLS' ? 'border-purple-500 text-purple-400' : 'border-transparent text-text-secondary'}`}>
              🏈 Drills
          </button>
          <button onClick={() => setActiveAgent('SCOUT')} className={`px-6 py-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors ${activeAgent === 'SCOUT' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-secondary'}`}>
              🕵️ Scout
          </button>
          <button onClick={() => setActiveAgent('TACTICS')} className={`px-6 py-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors ${activeAgent === 'TACTICS' ? 'border-green-500 text-green-400' : 'border-transparent text-text-secondary'}`}>
              🧠 Tática
          </button>
          {ENABLE_AI_BETA && (
            <button onClick={() => setActiveAgent('VISION')} className={`px-6 py-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeAgent === 'VISION' ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-text-secondary'}`}>
                <EyeIcon className="w-4 h-4"/> Vision (Beta)
            </button>
          )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <Card title="Entrada de Dados">
          <div className="space-y-5">
            {activeAgent === 'DRILLS' && (
                <>
                    <textarea className="w-full bg-primary border border-tertiary rounded-lg p-3 text-white h-32 focus:outline-none" placeholder="Ex: Drills de Tackle seguro..." value={prompt} onChange={e => setPrompt(e.target.value)} />
                    <button onClick={handleGenerateDrills} disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg">{isLoading ? 'Criando...' : 'Gerar Plano'}</button>
                </>
            )}

            {activeAgent === 'SCOUT' && (
                <>
                    <textarea className="w-full bg-primary border border-tertiary rounded-lg p-3 text-white h-40 focus:outline-none" placeholder="Cole anotações do jogo..." value={scoutNotes} onChange={e => setScoutNotes(e.target.value)} />
                    <button onClick={handleAnalyzeScout} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg">{isLoading ? 'Processando...' : 'Gerar Relatório'}</button>
                </>
            )}

            {activeAgent === 'TACTICS' && (
                 <>
                    <input className="w-full bg-primary border border-tertiary rounded-lg p-3 text-white focus:outline-none" placeholder="Ex: 3rd & 8 na Redzone" value={tacticalSituation} onChange={e => setTacticalSituation(e.target.value)} />
                    <button onClick={handleSuggestPlays} disabled={isLoading} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg">{isLoading ? 'Pensando...' : 'Sugerir Jogadas'}</button>
                </>
            )}

            {activeAgent === 'VISION' && ENABLE_AI_BETA && (
                <div className="space-y-4">
                    <div className="p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
                        <p className="text-xs text-yellow-200">
                            <strong>Dica Pro:</strong> Tire um print de um vídeo ou foto de um desenho tático e peça para a IA explicar a responsabilidade de cada position.
                        </p>
                    </div>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-black/20 border-2 border-dashed border-white/10 rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500/50 transition-all relative overflow-hidden group"
                    >
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleVisionUpload} />
                        {visionImage ? (
                             <img src={visionImage} className="absolute inset-0 w-full h-full object-contain bg-black" />
                        ) : (
                             <div className="text-center text-text-secondary group-hover:text-yellow-400 transition-colors">
                                 <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50 group-hover:opacity-100" />
                                 <p className="text-xs uppercase font-bold">Upload de Frame ou Diagrama</p>
                             </div>
                        )}
                    </div>
                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase mb-1">O que você quer saber?</label>
                        <input className="w-full bg-primary border border-tertiary rounded-lg p-3 text-white focus:outline-none" placeholder="Ex: Qual a formação defensiva? O que o WR X deve fazer?" value={visionQuestion} onChange={e => setVisionQuestion(e.target.value)} />
                    </div>
                    <button onClick={handleExplainImage} disabled={isLoading || !visionImage} className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                        {isLoading ? 'IA Analisando Pixels...' : <><EyeIcon className="w-4 h-4"/> Analisar Visualmente</>}
                    </button>
                </div>
            )}
            
          </div>
        </Card>

        <Card title="Resultado da IA" className="bg-secondary/30 border-dashed border-white/10 min-h-[300px]">
            {isLoading && (
                <div className="h-full flex flex-col items-center justify-center text-text-secondary animate-pulse">
                    <SparklesIcon className="w-12 h-12 mb-4 text-highlight" />
                    <p>Processando inteligência...</p>
                </div>
            )}

            {!isLoading && activeAgent === 'VISION' && visionExplanation && (
                <div className="prose prose-invert max-w-none text-sm p-4">
                    <h3 className="font-bold text-yellow-400 mb-4 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5"/> Análise Visual Concluída
                    </h3>
                    <div dangerouslySetInnerHTML={{ __html: formatPlanWithLinks(visionExplanation) }} />
                </div>
            )}

            {!isLoading && activeAgent === 'DRILLS' && generatedPlan && (
                <div className="prose prose-invert max-w-none text-sm custom-scrollbar max-h-[500px] overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ __html: formatPlanWithLinks(generatedPlan) }} />
                </div>
            )}

            {!isLoading && activeAgent === 'SCOUT' && scoutAnalysis && (
                <div className="space-y-4 p-4">
                    <h4 className="font-bold text-blue-400">Análise de Tendências</h4>
                    <p className="text-sm text-white">{scoutAnalysis.summary}</p>
                    <div className="flex flex-wrap gap-2">
                        {scoutAnalysis.keysToVictory?.map((k:string, i:number) => <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded">{k}</span>)}
                    </div>
                </div>
            )}

            {!isLoading && activeAgent === 'TACTICS' && playSuggestions.length > 0 && (
                <div className="space-y-4 p-4">
                    {playSuggestions.map((p:any, i:number) => (
                        <div key={i} className="bg-white/5 p-3 rounded">
                            <p className="font-bold text-green-400">{p.name}</p>
                            <p className="text-xs text-text-secondary">{p.reason}</p>
                        </div>
                    ))}
                </div>
            )}
            
            {!isLoading && !generatedPlan && !visionExplanation && !scoutAnalysis && playSuggestions.length === 0 && (
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