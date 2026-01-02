import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Save, Trash2, Maximize2, RotateCcw, Image as ImageIcon, Copy, Share2 } from 'lucide-react';
import JulesAgent from '../../lib/Jules';

// --- TIPOS MOCKADOS PARA O CREATIVE LAB ---
interface CreativeAsset {
  id: string;
  title: string;
  type: 'STORY' | 'FEED' | 'REELS';
  platform: 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE';
  date: string;
  imageUrl: string; // URL da imagem gerada/salva
  promptUsed: string;
}

const CreativeLab: React.FC = () => {
  const navigate = useNavigate();
  
  // ESTADOS DA MÁQUINA
  const [platform, setPlatform] = useState('INSTAGRAM');
  const [format, setFormat] = useState('STORY');
  const [tone, setTone] = useState('EPIC'); // Épico, Divertido, Informativo
  const [sponsor, setSponsor] = useState('NONE');
  const [promptText, setPromptText] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{image: string, caption: string} | null>(null);

  // MOCK DATA: Biblioteca de Criações Anteriores
  const library: CreativeAsset[] = [
    { id: '1', title: 'Vitória vs Steamrollers', type: 'FEED', platform: 'INSTAGRAM', date: '12/01/2026', imageUrl: '🏆', promptUsed: 'Foto épica do time comemorando...' },
    { id: '2', title: 'Promoção Red Zone', type: 'STORY', platform: 'INSTAGRAM', date: '10/01/2026', imageUrl: '⚡', promptUsed: 'Garrafa de energético com fundo neon...' },
    { id: '3', title: 'Highlight TD #88', type: 'REELS', platform: 'TIKTOK', date: '08/01/2026', imageUrl: '🎬', promptUsed: 'Clip rápido do touchdown...' },
    { id: '4', title: 'Convite Tryout', type: 'FEED', platform: 'INSTAGRAM', date: '05/01/2026', imageUrl: '🧬', promptUsed: 'Texto chamativo sobre seletiva...' },
  ];

  // FUNÇÃO DE GERAÇÃO (SIMULADA - GEMINI/IMAGEN)
  const handleGenerate = () => {
    if (!promptText) return;
    
    setIsGenerating(true);
    
    // Simula o tempo de processamento da IA
    setTimeout(() => {
      setGeneratedResult({
        image: '🏈', // Placeholder visual
        caption: `🔥 PREPARE-SE PARA A BATALHA! 🔥\n\nNeste domingo, o Gladiators entra em campo para defender a nossa casa! 💪\n\n📅 Domingo | 14:00\n📍 Estádio Municipal\n\n#GoGladiators #FutebolAmericano ${sponsor !== 'NONE' ? '#Parceria' : ''}`
      });
      setIsGenerating(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col h-screen bg-[#020617] overflow-hidden text-white font-sans">
      
      {/* HEADER SIMPLIFICADO */}
      <header className="p-4 border-b border-purple-900/30 bg-[#0f172a]/50 backdrop-blur flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-white rounded-lg transition">← Voltar</button>
          <div>
            <h1 className="text-xl font-black italic text-white flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">🎨 CREATIVE LAB</span>
            </h1>
            <p className="text-[10px] text-purple-400 uppercase tracking-widest font-mono">
              Powered by Google Gemini & Imagen
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold bg-purple-900/30 text-purple-300 px-2 py-1 rounded border border-purple-500/30">
              ⚡ 450 Créditos IA Disponíveis
           </span>
        </div>
      </header>

      {/* ÁREA DE TRABALHO (GRID) */}
      <main className="flex-1 overflow-hidden p-4 md:p-6 w-full max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* --- CONTEINER 1: A MÁQUINA (INPUT) - 1/3 DA TELA (4 COLS) --- */}
        <div className="md:col-span-4 flex flex-col h-full bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
           
           {/* Título do Setor */}
           <div className="p-4 border-b border-slate-800 bg-[#1e293b]/50">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-purple-500"></span> 1. Configuração do Prompt
              </h3>
           </div>

           <div className="p-6 flex-1 overflow-y-auto space-y-6">
              
              {/* SETOR 1: SELETORES TÉCNICOS */}
              <div className="space-y-4">
                 <label className="text-[10px] text-slate-500 uppercase font-bold">Plataforma & Formato</label>
                 <div className="grid grid-cols-2 gap-3">
                    <select 
                      value={platform} onChange={(e) => setPlatform(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-purple-500 outline-none"
                    >
                       <option value="INSTAGRAM">Instagram</option>
                       <option value="TIKTOK">TikTok</option>
                       <option value="LINKEDIN">LinkedIn</option>
                    </select>
                    <select 
                      value={format} onChange={(e) => setFormat(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-purple-500 outline-none"
                    >
                       <option value="STORY">Story (9:16)</option>
                       <option value="FEED">Feed (4:5)</option>
                       <option value="REELS">Reels (Vídeo)</option>
                    </select>
                 </div>
              </div>

              {/* SETOR 2: PARÂMETROS DE MARCA */}
              <div className="space-y-4">
                 <label className="text-[10px] text-slate-500 uppercase font-bold">Tom de Voz & Parceiros</label>
                 <div className="grid grid-cols-2 gap-3">
                    <select 
                      value={tone} onChange={(e) => setTone(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-purple-500 outline-none"
                    >
                       <option value="EPIC">🔥 Épico / Agressivo</option>
                       <option value="FUN">😂 Divertido / Meme</option>
                       <option value="INFO">ℹ️ Informativo / Sério</option>
                    </select>
                    <select 
                      value={sponsor} onChange={(e) => setSponsor(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-purple-500 outline-none"
                    >
                       <option value="NONE">Sem Patrocínio</option>
                       <option value="REDZONE">⚡ Red Zone Energy</option>
                       <option value="BURGER">🍔 Hamburgueria TD</option>
                    </select>
                 </div>
              </div>

              {/* SETOR 3: INPUT DE TEXTO (O PROMPT) */}
              <div className="space-y-2 flex-1">
                 <div className="flex justify-between items-center">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Descreva sua Ideia</label>
                    <span className="text-[9px] text-purple-400 cursor-pointer hover:underline">✨ Melhorar com IA</span>
                 </div>
                 <textarea 
                   value={promptText}
                   onChange={(e) => setPromptText(e.target.value)}
                   className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-white resize-none focus:border-purple-500 outline-none"
                   placeholder="Ex: Jogador correndo com a bola, estádio cheio ao fundo, luzes de neon azul e laranja, estilo realista..."
                 />
                 
                 {/* ATALHOS RÁPIDOS (Variáveis Dinâmicas) */}
                 <div className="flex flex-wrap gap-2">
                    <button className="px-2 py-1 bg-slate-800 text-[9px] text-slate-300 rounded border border-slate-700 hover:bg-slate-700 hover:text-white transition">+ Próximo Jogo</button>
                    <button className="px-2 py-1 bg-slate-800 text-[9px] text-slate-300 rounded border border-slate-700 hover:bg-slate-700 hover:text-white transition">+ Data/Hora</button>
                    <button className="px-2 py-1 bg-slate-800 text-[9px] text-slate-300 rounded border border-slate-700 hover:bg-slate-700 hover:text-white transition">+ Adversário</button>
                 </div>
              </div>

           </div>

           {/* BOTÃO DE AÇÃO */}
           <div className="p-6 border-t border-slate-800 bg-[#1e293b]/50">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !promptText}
                className={`w-full py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all
                  ${isGenerating ? 'bg-slate-700 cursor-wait text-slate-400' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white hover:scale-[1.02]'}
                `}
              >
                 {isGenerating ? (
                   <span className="animate-pulse">PROCESSANDO...</span>
                 ) : (
                   <>
                     <Sparkles size={18} /> GERAR MÍDIA ⚡
                   </>
                 )}
              </button>
           </div>
        </div>


        {/* --- COLUNA DIREITA (2/3 DA TELA) --- */}
        <div className="md:col-span-8 flex flex-col gap-6 h-full">
           
           {/* --- CONTEINER 2: O PALCO (VALIDAÇÃO) - 60% DA ALTURA --- */}
           <div className="flex-1 bg-[#1e293b]/20 border border-slate-800 rounded-2xl overflow-hidden relative flex flex-col md:flex-row">
              
              {/* ÁREA DA IMAGEM (Centro) */}
              <div className="flex-1 bg-black/40 flex items-center justify-center relative p-8">
                 {generatedResult ? (
                    <div className="relative group w-full max-w-md aspect-[4/5] bg-slate-900 rounded-lg shadow-2xl flex items-center justify-center border border-slate-700 overflow-hidden">
                       <span className="text-9xl animate-bounce">{generatedResult.image}</span>
                       
                       {/* Overlay de Ações da Imagem */}
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                          <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur" title="Expandir"><Maximize2 size={24} /></button>
                          <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur" title="Salvar na Biblioteca"><Save size={24} /></button>
                       </div>
                    </div>
                 ) : (
                    <div className="text-center opacity-30">
                       <ImageIcon size={64} className="mx-auto mb-4" />
                       <p className="text-sm font-mono uppercase tracking-widest">Aguardando Criação</p>
                    </div>
                 )}
              </div>

              {/* ÁREA DA LEGENDA (Lateral) - Só aparece se tiver resultado */}
              {generatedResult && (
                 <div className="w-full md:w-80 bg-[#0f172a] border-l border-slate-800 p-6 flex flex-col">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Legenda Sugerida</h3>
                    <div className="flex-1 bg-slate-900 rounded-xl p-4 text-sm text-slate-300 font-medium whitespace-pre-wrap border border-slate-700 overflow-y-auto mb-4 custom-scrollbar">
                       {generatedResult.caption}
                    </div>
                    <div className="flex gap-2">
                       <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 transition">
                          <Copy size={14} /> Copiar
                       </button>
                       <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 transition">
                          <RotateCcw size={14} /> Refinar
                       </button>
                    </div>
                 </div>
              )}
           </div>


           {/* --- CONTEINER 3: A BIBLIOTECA (ACERVO) - 40% DA ALTURA (MIN) --- */}
           <div className="h-64 bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-800 bg-[#1e293b]/50 flex justify-between items-center">
                 <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-500"></span> 3. Biblioteca de Assets
                 </h3>
                 <div className="flex gap-2">
                    <input type="text" placeholder="Buscar..." className="bg-black/30 border border-slate-700 rounded px-2 py-1 text-[10px] text-white w-32 focus:border-purple-500 outline-none" />
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                 {/* Header da Tabela */}
                 <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[9px] uppercase font-bold text-slate-500">
                    <div className="col-span-1">Preview</div>
                    <div className="col-span-4">Nome do Arquivo</div>
                    <div className="col-span-2">Plataforma</div>
                    <div className="col-span-2">Data</div>
                    <div className="col-span-3 text-right">Ações</div>
                 </div>

                 {/* Lista de Itens */}
                 {library.map(item => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 px-4 py-3 bg-[#1e293b]/30 hover:bg-[#1e293b] rounded-lg border border-transparent hover:border-slate-700 items-center transition group">
                       <div className="col-span-1">
                          <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center text-lg shadow-sm">{item.imageUrl}</div>
                       </div>
                       <div className="col-span-4">
                          <p className="text-xs font-bold text-white truncate">{item.title}</p>
                          <p className="text-[9px] text-slate-500 truncate w-full">{item.promptUsed}</p>
                       </div>
                       <div className="col-span-2">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border ${
                             item.platform === 'INSTAGRAM' ? 'border-pink-500/30 text-pink-400 bg-pink-500/10' : 
                             item.platform === 'TIKTOK' ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10' : 
                             'border-slate-500/30 text-slate-400'
                          }`}>
                             {item.platform} • {item.type}
                          </span>
                       </div>
                       <div className="col-span-2 text-[10px] text-slate-400 font-mono">
                          {item.date}
                       </div>
                       <div className="col-span-3 flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition">
                          <button className="p-1.5 hover:bg-slate-700 rounded text-slate-300" title="Reutilizar Prompt"><RotateCcw size={14} /></button>
                          <button className="p-1.5 hover:bg-slate-700 rounded text-slate-300" title="Compartilhar"><Share2 size={14} /></button>
                          <button className="p-1.5 hover:bg-red-900/30 text-slate-300 hover:text-red-400 rounded" title="Excluir"><Trash2 size={14} /></button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>

      </main>

      <JulesAgent context="SETTINGS" />
    </div>
  );
};

export default CreativeLab;