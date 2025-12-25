
import React, { useState, useEffect, useRef } from 'react';
import { storageService } from '../services/storageService';
import { TacticalPlay, GameUnit } from '../types';
import { 
    SparklesIcon, ImageIcon, TrashIcon, SearchIcon,
    PlayCircleIcon, ScanIcon
} from '../components/icons/UiIcons';
import { parseTacticalDiagram } from '../services/geminiService';
import { compressImage } from '../utils/imageOptimizer';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

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
            toast.info("Otimizando e analisando imagem...");
            
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const originalBase64 = reader.result as string;
                
                try {
                    // 1. Comprime antes de qualquer coisa (O segredo da velocidade e do banco leve)
                    const optimizedBase64 = await compressImage(originalBase64, 800, 0.6);
                    
                    // 2. Envia a versão leve para o Gemini
                    const parsed = await parseTacticalDiagram(optimizedBase64, "IA Vision");
                    
                    const newPlay: TacticalPlay = {
                        id: `play-${Date.now()}`,
                        name: parsed.name || 'Nova Jogada',
                        concept: parsed.concept || 'Extraído via Vision.',
                        unit: parsed.unit as any || 'OFFENSE',
                        category: parsed.category as any || 'PASS',
                        elements: parsed.elements || [],
                        // Salvamos apenas a versão comprimida para evitar o erro de 6.5MB
                        originalImageUrl: optimizedBase64,
                        createdAt: new Date()
                    };
                    
                    const updated = [newPlay, ...plays];
                    setPlays(updated);
                    storageService.saveTacticalPlays(updated);
                    toast.success("Pronto! Jogada digitalizada.");
                } catch (err) {
                    toast.error("Erro no processamento.");
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
    };

    const filteredPlays = plays.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.concept.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="bg-gradient-to-r from-cyan-900/40 to-slate-900 p-8 rounded-[3rem] border border-cyan-500/20 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">CIATORS</h2>
                    <p className="text-text-secondary text-sm mt-1 max-w-md">Otimizado para baixo consumo de memória e alta velocidade de resposta.</p>
                </div>

                <div className="shrink-0">
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessing}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-8 rounded-2xl uppercase italic shadow-lg transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                        {isProcessing ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <ScanIcon className="w-5 h-5" />}
                        IMPORTAR PLAYBOOK
                    </button>
                </div>
            </div>

            <div className="relative">
                 <SearchIcon className="absolute left-4 top-3 w-4 h-4 text-text-secondary opacity-40" />
                 <input 
                    className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs text-white focus:border-cyan-500 outline-none" 
                    placeholder="Filtrar biblioteca..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                 />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredPlays.map(play => (
                    <div key={play.id} className="bg-secondary/40 rounded-3xl border border-white/5 overflow-hidden flex flex-col hover:border-cyan-500/50 transition-all group">
                        <div className="aspect-[4/3] bg-black relative">
                            {/* Desenho estático leve para a galeria */}
                            <div className="absolute inset-0 p-4 opacity-40">
                                {play.elements.map((el, i) => (
                                    <div key={i} className="absolute w-2 h-2 rounded-full" 
                                         style={{ left: `${(el.x/600)*100}%`, top: `${(el.y/400)*100}%`, backgroundColor: el.type === 'OFFENSE' ? '#0ea5e9' : '#ef4444' }} />
                                ))}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm gap-4">
                                <button onClick={() => navigate(`/ciators/presentation/${play.id}`)} className="p-3 bg-cyan-600 rounded-full text-white"><PlayCircleIcon className="w-6 h-6" /></button>
                                <button onClick={() => handleDelete(play.id)} className="p-3 bg-red-600/20 text-red-500 rounded-full hover:bg-red-600 hover:text-white transition-all"><TrashIcon className="w-5 h-5" /></button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h4 className="text-white font-black uppercase italic text-sm truncate">{play.name}</h4>
                            <p className="text-[10px] text-text-secondary line-clamp-2 mt-1">{play.concept}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CiatorsHub;
