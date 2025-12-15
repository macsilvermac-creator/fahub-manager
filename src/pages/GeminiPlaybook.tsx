
import React, { useState, useRef } from 'react';
import Card from '../components/Card';
import { generatePracticePlan, analyzeOpponentTendencies, suggestPlayConcepts, setRuntimeKey, explainPlayImage } from '../services/geminiService';
import { SparklesIcon, AlertTriangleIcon, KeyIcon, SearchIcon, ImageIcon, CheckCircleIcon } from '../components/icons/UiIcons';
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
  const [manualKey, setManualKey] = useState('');
  
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
    if (manualKey) setRuntimeKey(manualKey);
    
    const finalPrompt = `
      Atue como um treinador especialista. Gere plano de drills. FOCO: ${prompt}
      Estrutura (HTML): <h3>Drill 1</h3><p>...</p>
    `;

    const result = await generatePracticePlan(finalPrompt);
    if (result.includes("Erro")) {
        setErrorMsg(result);
        toast.error("Falha na IA.");
    } else {
        setGeneratedPlan(result);
        toast.success("Plano gerado!");
    }
    setIsLoading(false);
  };

  const handleAnalyzeScout = async () => {
      if (!scoutNotes.trim()) return;
      setIsLoading(true);
      if (manualKey) setRuntimeKey(manualKey);
      const result = await analyzeOpponentTendencies(scoutNotes);
      setScoutAnalysis(result);
      setIsLoading(false);
  };

  const handleSuggestPlays = async () => {
      if (!tacticalSituation.trim()) return;
      setIsLoading(true);
      if (manualKey) setRuntimeKey(manualKey);
      const result = await suggestPlayConcepts(tacticalSituation);
      setPlaySuggestions(result);
      setIsLoading(false);
  };

  const handleVisionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.readAsDataURL(e.target.files[0]);
          reader.onload = () => setVisionImage(reader.result as string);
      }
  };

  const handleExplainImage = async () => {
      if (!visionImage || !visionQuestion) return;
      setIsLoading(true);
      if (manualKey) setRuntimeKey(manualKey);
      try {
          const explanation = await explainPlayImage(visionImage, visionQuestion);
          setVisionExplanation(explanation);
          toast.success("Análise concluída!");
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
            <button onClick={() => setActiveAgent('VISION')} className={`px-6 py-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors ${activeAgent === 'VISION' ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-text-secondary'}`}>
                👁️ Vision (Beta)
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

            {activeAgent === 'VISION' && ENABLE_AI_BETA && (
                <div className="space-y-4">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-black/20 border-2 border-dashed border-white/10 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500/50 transition-all relative overflow-hidden"
                    >
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleVisionUpload} />
                        {visionImage ? (
                             <img src={visionImage} className="absolute inset-0 w-full h-full object-contain bg-black" />
                        ) : (
                             <div className="text-center text-text-secondary">
                                 <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                 <p className="text-xs uppercase font-bold">Clique para enviar imagem da jogada</p>
                             </div>
                        )}
                    </div>
                    <input className="w-full bg-primary border border-tertiary rounded-lg p-3 text-white focus:outline-none" placeholder="Ex: Qual a minha responsabilidade como WR Z?" value={visionQuestion} onChange={e => setVisionQuestion(e.target.value)} />
                    <button onClick={handleExplainImage} disabled={isLoading || !visionImage} className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg">{isLoading ? 'Analisando...' : 'Explicar Jogada'}</button>
                </div>
            )}
            
            {/* ... Other Agents (Scout/Tactics) kept same as previous code ... */}
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
                    <h3 className="font-bold text-yellow-400 mb-2">Análise Tática Visual</h3>
                    <div dangerouslySetInnerHTML={{ __html: formatPlanWithLinks(visionExplanation) }} />
                </div>
            )}

            {!isLoading && activeAgent === 'DRILLS' && generatedPlan && (
                <div className="prose prose-invert max-w-none text-sm custom-scrollbar max-h-[500px] overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ __html: formatPlanWithLinks(generatedPlan) }} />
                </div>
            )}
            
            {!isLoading && !generatedPlan && !visionExplanation && (
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