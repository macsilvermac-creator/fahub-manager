
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { TacticalPlay } from '../types';
import { 
    SparklesIcon, ImageIcon, TrashIcon, SearchIcon,
    PlayCircleIcon, ScanIcon, BrainIcon
} from '../components/icons/UiIcons';
import { parseTacticalDiagram } from '../services/geminiService';
import { compressImage } from '../utils/imageOptimizer';
import { useToast } from '../contexts/ToastContext';
import PageHeader from '../components/PageHeader';

const CiatorsHub: React.FC = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [plays, setPlays] = useState<TacticalPlay[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setPlays(storageService.getTacticalPlays() || []);
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsProcessing(true);
            toast.info("Otimizando e analisando prancheta via Vision AI...");
            
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const originalBase64 = reader.result as string;
                
                try {
                    // 1. Comprime a imagem para manter o banco leve e rápido
                    const optimizedBase64 = await compressImage(originalBase64, 800, 0.6);
                    
                    // 2. Processa com Gemini 2.5 Flash Vision
                    const parsed = await parseTacticalDiagram(optimizedBase64, "IA Vision Upload");
                    
                    const newPlay: TacticalPlay = {
                        id: `play-${Date.now()}`,
                        name: parsed.name || 'Nova Jogada Digital',
                        concept: parsed.concept || 'Conceito extraído via visão computacional.',
                        unit: parsed.unit as any || 'OFFENSE',
                        category: parsed.category as any || 'PASS',
                        elements: parsed.elements || [],
                        originalImageUrl: optimizedBase64,
                        createdAt: new Date()
                    };
                    
                    const updated = [newPlay, ...plays];
                    setPlays(updated);
                    storageService.saveTacticalPlays(updated);
                    toast.success("Sucesso! Jogada digitalizada e salva na biblioteca.");
                } catch (err) {
                    toast.error("Erro no processamento visual. Tente uma foto mais nítida.");
                } finally {
                    setIsProcessing(false);
                }
            };
        }
    };

    const handleDelete = (id: string) => {
        const updated = plays.filter(p => p.id !== id);
        setPlays(updated);
        storageService.saveTacticalPlays(updated);
        toast.info("Jogada removida.");
    };

    const filteredPlays = plays.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.concept.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <PageHeader title="CIATORS" subtitle="Cognitive Intelligence & Tactical Offensive Recovery System" />

            <div className="bg-gradient-to-br from-slate-900 via-[#0B1120] to-black p-10 rounded-[3rem] border border-cyan-500/20 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <BrainIcon className="w-64 h-64 text-cyan-400" />
                </div>
                
                <div className="relative z-10 max-w-xl">
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Vision Decoder</h2>
                    <p className="text-text-secondary text-sm mt-3 font-medium leading-relaxed">Digitalize desenhos táticos feitos à mão ou capturas de vídeo. A IA identificará os jogadores e converterá em elementos editáveis no Tactical Lab.</p>
                </div>

                <div className="shrink-0 relative z-10">
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessing}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 px-10 rounded-[2rem] uppercase italic shadow-glow-blue transition-all flex items-center gap-3 disabled:opacity-50 active:scale-95"
                    >
                        {isProcessing ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <ScanIcon className="w-6 h-6" />}
                        Digitalizar Prancheta
                    </button>
                </div>
            </div>

            <div className="relative max-w-lg">
                 <SearchIcon className="absolute left-4 top-3.5 w-5 h-5 text-text-secondary opacity-40" />
                 <input 
                    className="w-full bg-secondary/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-cyan-500 outline-none transition-all" 
                    placeholder="Buscar na biblioteca tática..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                 />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredPlays.map(play => (
                    <div key={play.id} className="bg-secondary/40 rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col hover:border-cyan-500/50 transition-all group shadow-xl h-full">
                        <div className="aspect-[4/3] bg-black relative overflow-hidden">
                            {/* Preview Estático dos Tokens */}
                            <div className="absolute inset-0 p-6 opacity-30">
                                {play.elements.map((el, i) => (
                                    <div key={i} className="absolute w-2.5 h-2.5 rounded-full border border-white/20" 
                                         style={{ left: `${(el.x/600)*100}%`, top: `${(el.y/400)*100}%`, backgroundColor: el.type === 'OFFENSE' ? '#3b82f6' : '#ef4444' }} />
                                ))}
                            </div>
                            
                            {/* Hover Actions */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/60 backdrop-blur-sm gap-4">
                                <button 
                                    onClick={() => navigate(`/ciators/presentation/${play.id}`)} 
                                    className="p-4 bg-cyan-600 rounded-2xl text-white shadow-glow-blue transform hover:scale-110 active:scale-95 transition-all"
                                    title="Modo Apresentação"
                                >
                                    <PlayCircleIcon className="w-8 h-8" />
                                </button>
                                <button 
                                    onClick={() => handleDelete(play.id)} 
                                    className="p-4 bg-red-600/20 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all transform hover:scale-110 active:scale-95"
                                    title="Excluir"
                                >
                                    <TrashIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-white font-black uppercase italic text-sm truncate">{play.name}</h4>
                                <span className="text-[8px] font-black text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded uppercase">{play.category}</span>
                            </div>
                            <p className="text-[10px] text-text-secondary line-clamp-2 italic leading-relaxed">"{play.concept}"</p>
                            <button 
                                onClick={() => navigate('/tactical-lab')}
                                className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-widest transition-all"
                            >
                                Abrir no Editor
                            </button>
                        </div>
                    </div>
                ))}

                {filteredPlays.length === 0 && (
                    <div className="col-span-full py-40 text-center opacity-20 italic font-black uppercase text-sm tracking-widest border-2 border-dashed border-white/10 rounded-[3rem]">
                        Biblioteca vazia ou nenhum resultado encontrado.
                    </div>
                )}
            </div>
        </div>
    );
};

export default CiatorsHub;
