import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Save, Trash2, Maximize2, RotateCcw, 
  Image as ImageIcon, Copy, Share2 
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';

/** * CREATIVE LAB - PROTOCOLO NEXUS
 * Interface para Geração de Conteúdo IA (Pronta para integração Gemini/Imagen).
 */
interface CreativeAsset {
  id: string;
  title: string;
  type: 'STORY' | 'FEED' | 'REELS';
  platform: 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE';
  date: string;
  imageUrl: string;
  promptUsed: string;
}

const CreativeLab: React.FC = () => {
  const navigate = useNavigate();
  
  const [platform, setPlatform] = useState('INSTAGRAM');
  const [format, setFormat] = useState('STORY');
  const [tone, setTone] = useState('EPIC');
  const [sponsor, setSponsor] = useState('NONE');
  const [promptText, setPromptText] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{image: string, caption: string} | null>(null);

  const library: CreativeAsset[] = [
    { id: '1', title: 'Vitória vs Steamrollers', type: 'FEED', platform: 'INSTAGRAM', date: '12/01/2026', imageUrl: '🏆', promptUsed: 'Foto épica do time comemorando...' },
    { id: '2', title: 'Promoção Red Zone', type: 'STORY', platform: 'INSTAGRAM', date: '10/01/2026', imageUrl: '⚡', promptUsed: 'Garrafa de energético com fundo neon...' }
  ];

  const handleGenerate = () => {
    if (!promptText) return;
    setIsGenerating(true);
    
    // Simulação Mantida para Validação de Fluxo Nexus
    setTimeout(() => {
      setGeneratedResult({
        image: '🏈',
        caption: `🔥 PREPARE-SE PARA A BATALHA! 🔥\n\nNeste domingo, o Gladiators entra em campo!\n\n#GoGladiators ${sponsor !== 'NONE' ? '#Parceria' : ''}`
      });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#020617] overflow-hidden text-white font-sans">
      <header className="p-6 border-b border-purple-900/30 bg-[#0f172a]/50 backdrop-blur flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white transition">← Voltar</button>
          <div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter">
              🎨 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 text-2xl">Creative Lab</span>
            </h1>
            <p className="text-[9px] text-purple-400 uppercase tracking-[0.3em] font-bold">Protocolo Nexus / IA Vision</p>
          </div>
        </div>
        <div className="bg-purple-900/20 border border-purple-500/30 px-4 py-2 rounded-xl">
          <span className="text-[10px] font-black uppercase text-purple-300 italic tracking-widest">⚡ 450 Créditos IA</span>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-6 grid grid-cols-1 md:grid-cols-12 gap-8 max-w-[1800px] mx-auto w-full">
        {/* CONFIGURAÇÃO (COL 4) */}
        <div className="md:col-span-4 bg-[#0f172a] border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 bg-white/5">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">1. Parâmetros de Criação</h3>
          </div>
          <div className="p-8 space-y-8 flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <select value={platform} onChange={e => setPlatform(e.target.value)} className="bg-slate-900 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-purple-500 transition-colors">
                <option value="INSTAGRAM">Instagram</option><option value="TIKTOK">TikTok</option>
              </select>
              <select value={format} onChange={e => setFormat(e.target.value)} className="bg-slate-900 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-purple-500 transition-colors">
                <option value="STORY">Story</option><option value="FEED">Feed</option>
              </select>
            </div>
            <textarea 
              value={promptText} onChange={e => setPromptText(e.target.value)}
              placeholder="Descreva a cena épica..."
              className="w-full h-48 bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm italic font-medium outline-none focus:border-purple-500 transition-all resize-none"
            />
          </div>
          <div className="p-8 bg-white/5 border-t border-white/5">
            <button onClick={handleGenerate} disabled={isGenerating || !promptText} className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 font-black italic uppercase tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50">
              {isGenerating ? 'Processando Arquitetura...' : 'Gerar Mídia Master'}
            </button>
          </div>
        </div>

        {/* VISUALIZAÇÃO (COL 8) */}
        <div className="md:col-span-8 flex flex-col gap-8 h-full">
          <div className="flex-1 bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden relative flex items-center justify-center p-12">
            {generatedResult ? (
              <div className="w-full max-w-sm aspect-[9/16] bg-black rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center relative group">
                <span className="text-9xl">{generatedResult.image}</span>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6">
                  <button className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition"><Maximize2 size={24}/></button>
                  <button className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition"><Save size={24}/></button>
                </div>
              </div>
            ) : (
              <div className="text-center opacity-20">
                <ImageIcon size={80} className="mx-auto mb-4" />
                <p className="text-xs font-black uppercase tracking-[0.4em]">Laboratório em Standby</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <JulesAgent context="SETTINGS" />
    </div>
  );
};

export default CreativeLab;