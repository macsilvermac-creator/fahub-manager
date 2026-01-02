import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Cpu, Database, Play, Save, Trash2, ArrowLeft, Plus, Zap, TrendingUp, Target, BarChart2 } from 'lucide-react';
import JulesAgent from '../../lib/Jules';

// --- TIPOS ---
interface DataNode {
  id: string;
  label: string;
  category: 'TIER' | 'SEGMENT' | 'REGION' | 'PAIN';
}

interface AnalysisResult {
  roi: string;
  matchScore: number;
  pitch: string;
  benefits: string[];
}

const SponsorLab: React.FC = () => {
  const navigate = useNavigate();

  // ESTADOS DA MÁQUINA
  const [activeNodes, setActiveNodes] = useState<DataNode[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  // MOCK: Nódulos Disponíveis
  const availableNodes: DataNode[] = [
    { id: 'n1', label: 'Cota Master', category: 'TIER' },
    { id: 'n2', label: 'Cota Prata', category: 'TIER' },
    { id: 'n3', label: 'Setor Tech', category: 'SEGMENT' },
    { id: 'n4', label: 'Varejo Local', category: 'SEGMENT' },
    { id: 'n5', label: 'Joinville/SC', category: 'REGION' },
    { id: 'n6', label: 'Alcance Digital', category: 'PAIN' },
    { id: 'n7', label: 'Networking B2B', category: 'PAIN' },
  ];

  // MOCK: Biblioteca de Memória
  const memoryLibrary = [
    { id: 'mem1', title: 'Análise Mercado Têxtil (Out/25)', result: 'Fechado: R$ 12k' },
    { id: 'mem2', title: 'Prospecção Software House (Jan/26)', result: 'Em negociação' },
  ];

  // LOGICA: Adicionar/Remover Nódulo
  const toggleNode = (node: DataNode) => {
    if (activeNodes.find(n => n.id === node.id)) {
      setActiveNodes(activeNodes.filter(n => n.id !== node.id));
    } else {
      setActiveNodes([...activeNodes, node]);
    }
  };

  // LOGICA: Executar Agente Prospector
  const handleRunAnalysis = () => {
    if (activeNodes.length === 0) return;
    setIsAnalyzing(true);
    setAnalysis(null);

    setTimeout(() => {
      setAnalysis({
        roi: '3.5x investimento anual',
        matchScore: 92,
        pitch: "A marca se conecta através do pilar de inovação dos Gladiators, utilizando a base de fãs de 12k seguidores como canal de conversão direta para o e-commerce do parceiro.",
        benefits: ['Logo no capacete', '3 posts colab/mês', 'Ativação no intervalo']
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#020617] overflow-hidden text-white font-sans">
      
      {/* HEADER TÉCNICO */}
      <header className="p-4 border-b border-indigo-900/30 bg-[#0f172a]/50 backdrop-blur flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-white transition">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black italic text-white flex items-center gap-2">
              <span className="text-indigo-400">🧬</span> SPONSOR LAB <span className="text-slate-600">/ Intelligence Engine</span>
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
           <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded text-[10px] font-bold uppercase">
              Agente Prospector: Online
           </span>
        </div>
      </header>

      {/* ÁREA DE TRABALHO: 3 ZONAS */}
      <main className="flex-1 overflow-hidden p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* --- ZONA 1: INTERROGAÇÃO (1/3 DA TELA) --- */}
        <section className="md:col-span-4 flex flex-col gap-4 h-full">
           <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 flex-1 flex flex-col shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Layers size={80} /></div>
              
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Zap size={14} className="text-yellow-400" /> 1. Configurar Nódulos
              </h3>

              <div className="flex-1 space-y-6">
                 {/* Seleção de Nódulos por Categoria */}
                 <div className="space-y-3">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Inventário Comercial</p>
                    <div className="flex flex-wrap gap-2">
                       {availableNodes.map(node => (
                         <button 
                           key={node.id}
                           onClick={() => toggleNode(node)}
                           className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all 
                             ${activeNodes.find(n => n.id === node.id) 
                               ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/30 scale-105' 
                               : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                         >
                           {node.label}
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* Custom Context */}
                 <div className="space-y-2">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Contexto Adicional</p>
                    <textarea 
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Ex: Focar em branding e renovação de imagem..."
                      className="w-full h-32 bg-[#020617] border border-slate-700 rounded-xl p-4 text-sm text-slate-300 focus:border-indigo-500 outline-none resize-none"
                    />
                 </div>
              </div>

              {/* Botão Gerar */}
              <button 
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || activeNodes.length === 0}
                className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-3 transition-all
                  ${isAnalyzing ? 'bg-slate-800 text-slate-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20'}`}
              >
                {isAnalyzing ? <><Cpu className="animate-spin" size={18} /> PROCESSANDO...</> : <><Play size={18} /> INICIAR ANÁLISE PROFUNDA</>}
              </button>
           </div>
        </section>


        {/* --- COLUNA DIREITA (2/3 DA TELA) --- */}
        <section className="md:col-span-8 flex flex-col gap-6 h-full">
           
           {/* --- ZONA 2: PROCESSAMENTO (ANÁLISE PROFUNDA) - 65% ALTURA --- */}
           <div className="flex-[2] bg-[#1e293b]/20 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
              <div className="p-4 border-b border-slate-800 bg-[#0f172a]/50 flex justify-between items-center">
                 <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <Cpu size={14} /> 2. Diagnóstico de Viabilidade
                 </h3>
                 {analysis && <button className="text-[10px] font-bold text-emerald-400 hover:underline flex items-center gap-1"><Save size={12}/> SALVAR ATIVO</button>}
              </div>

              <div className="flex-1 p-8 relative overflow-y-auto custom-scrollbar">
                 {!analysis && !isAnalyzing && (
                   <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center">
                      <Target size={48} className="mb-4 opacity-20" />
                      <p className="text-sm font-mono uppercase tracking-widest">Aguardando injeção de nódulos comerciais...</p>
                   </div>
                 )}

                 {isAnalyzing && (
                   <div className="h-full flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-indigo-400 font-mono text-xs animate-pulse tracking-widest">CRUZANDO DADOS DE AUDIÊNCIA COM PERFIL DO PATROCINADOR...</p>
                   </div>
                 )}

                 {analysis && (
                   <div className="space-y-8 animate-fade-in">
                      {/* ROI e Match Score */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="bg-slate-900/50 border border-slate-700 p-6 rounded-2xl">
                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">ROI Estimado</p>
                            <h2 className="text-3xl font-black text-emerald-400 italic">{analysis.roi}</h2>
                         </div>
                         <div className="bg-slate-900/50 border border-slate-700 p-6 rounded-2xl">
                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Match Score (IA)</p>
                            <div className="flex items-center gap-4">
                               <h2 className="text-3xl font-black text-indigo-400 italic">{analysis.matchScore}%</h2>
                               <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="bg-indigo-500 h-full" style={{ width: `${analysis.matchScore}%` }}></div>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Pitch Estratégico */}
                      <div className="bg-indigo-900/10 border border-indigo-500/20 p-6 rounded-2xl">
                         <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Zap size={14} /> The Sales Pitch (IA Suggested)
                         </h4>
                         <p className="text-slate-300 leading-relaxed italic">"{analysis.pitch}"</p>
                      </div>

                      {/* Lista de Benefícios */}
                      <div>
                         <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Entregáveis Sugeridos</h4>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {analysis.benefits.map((b, i) => (
                              <div key={i} className="bg-slate-800/50 border border-slate-700 p-3 rounded-xl text-xs text-slate-200 flex items-center gap-2">
                                 <span className="text-emerald-500 font-bold">✓</span> {b}
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                 )}
              </div>
           </div>


           {/* --- ZONA 3: MEMÓRIA (BIBLIOTECA) - 35% ALTURA --- */}
           <div className="flex-1 bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
              <div className="p-4 border-b border-slate-800 bg-[#1e293b]/50 flex justify-between items-center">
                 <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    <Database size={14} /> 3. Memória de Inteligência Comercial
                 </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                 {memoryLibrary.map(item => (
                   <div key={item.id} className="bg-[#1e293b]/30 border border-transparent hover:border-slate-700 p-3 rounded-xl flex justify-between items-center group transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className="p-2 bg-slate-800 rounded-lg text-slate-500 group-hover:text-indigo-400 transition-colors">
                            <BarChart2 size={18} />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-200">{item.title}</p>
                            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{item.result}</p>
                         </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors" title="Carregar Análise"><RotateCcw size={14}/></button>
                         <button className="p-2 hover:bg-red-900/30 text-slate-400 hover:text-red-400 transition-colors" title="Deletar Ativo"><Trash2 size={14}/></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

        </section>

      </main>

      <JulesAgent context="FINANCE" />
    </div>
  );
};

export default SponsorLab;