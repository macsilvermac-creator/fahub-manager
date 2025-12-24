
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Player } from '../types';
import LazyImage from './LazyImage';
import { CheckCircleIcon, AlertTriangleIcon, ActivityIcon, XIcon } from './icons/UiIcons';

interface QuickEvaluationModalProps {
    isOpen: boolean;
    onClose: () => void;
    player: Player | null;
    onSave: (playerId: number, grade: number, notes: string, tags: string[]) => void;
}

const QuickEvaluationModal: React.FC<QuickEvaluationModalProps> = ({ isOpen, onClose, player, onSave }) => {
    const [grade, setGrade] = useState(75); // Começa na média (C)
    const [tags, setTags] = useState<string[]>([]);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (isOpen) {
            setGrade(75);
            setTags([]);
            setNotes('');
        }
    }, [isOpen, player]);

    const adjustGrade = (delta: number) => {
        setGrade(prev => Math.max(0, Math.min(100, prev + delta)));
    };

    const toggleTag = (tag: string, scoreImpact: number) => {
        if (tags.includes(tag)) {
            setTags(prev => prev.filter(t => t !== tag));
            adjustGrade(-scoreImpact); 
        } else {
            setTags(prev => [...prev, tag]);
            adjustGrade(scoreImpact);
        }
    };

    const getGradeColor = () => {
        if (grade >= 90) return 'text-green-400 border-green-500';
        if (grade >= 80) return 'text-blue-400 border-blue-500';
        if (grade >= 70) return 'text-yellow-400 border-yellow-500';
        return 'text-red-400 border-red-500';
    };

    const handleSave = () => {
        if (player) {
            onSave(player.id, grade, notes, tags);
            onClose();
        }
    };

    if (!player) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Avaliação de Campo" maxWidth="max-w-md">
            <div className="flex flex-col items-center">
                {/* Header do Atleta */}
                <div className="flex items-center gap-4 mb-6 w-full bg-secondary/50 p-3 rounded-xl border border-white/5">
                    <LazyImage src={player.avatarUrl} className="w-16 h-16 rounded-full border-2 border-white/20" />
                    <div>
                        <h3 className="text-xl font-bold text-white">{player.name}</h3>
                        <p className="text-sm text-text-secondary">{player.position} #{player.jerseyNumber}</p>
                    </div>
                    <div className={`ml-auto text-3xl font-black px-4 py-2 rounded-lg border-2 ${getGradeColor()}`}>
                        {grade}
                    </div>
                </div>

                {/* Barra de Progresso Interativa */}
                <div className="w-full mb-6 relative">
                    <div className="flex justify-between text-xs text-text-secondary mb-1 font-bold uppercase">
                        <span>Ruim</span>
                        <span>Média</span>
                        <span>Elite</span>
                    </div>
                    <div className="h-6 w-full bg-black/40 rounded-full overflow-hidden border border-white/10 relative">
                        <div 
                            className={`h-full transition-all duration-300 ${grade >= 80 ? 'bg-gradient-to-r from-blue-500 to-green-400' : grade >= 60 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' : 'bg-gradient-to-r from-red-600 to-red-400'}`}
                            style={{ width: `${grade}%` }}
                        ></div>
                        <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-white/20"></div>
                    </div>
                    
                    {/* Botões de Ajuste Fino */}
                    <div className="flex justify-between mt-2">
                        <button onClick={() => adjustGrade(-5)} className="w-12 h-12 rounded-full bg-red-600/20 border border-red-500 text-red-400 font-bold text-xl hover:bg-red-600 hover:text-white transition-colors">-5</button>
                        <button onClick={() => adjustGrade(-1)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10">-1</button>
                        <span className="text-xs text-text-secondary self-center uppercase">Ajuste Fino</span>
                        <button onClick={() => adjustGrade(+1)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10">+1</button>
                        <button onClick={() => adjustGrade(+5)} className="w-12 h-12 rounded-full bg-green-600/20 border border-green-500 text-green-400 font-bold text-xl hover:bg-green-600 hover:text-white transition-colors">+5</button>
                    </div>
                </div>

                {/* Botões Grandes de Contexto */}
                <div className="grid grid-cols-2 gap-3 w-full mb-6">
                    <button 
                        onClick={() => toggleTag('EXECUCAO', 10)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${tags.includes('EXECUCAO') ? 'bg-green-600 border-green-400 text-white shadow-glow' : 'bg-secondary border-green-500/30 hover:border-green-500 text-green-400'}`}
                    >
                        <CheckCircleIcon className="w-8 h-8" />
                        <span className="font-bold uppercase text-sm">Boa Execução</span>
                    </button>

                    <button 
                        onClick={() => toggleTag('TECNICA', -10)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${tags.includes('TECNICA') ? 'bg-orange-600 border-orange-400 text-white shadow-glow' : 'bg-secondary border-orange-500/30 hover:border-orange-500 text-orange-400'}`}
                    >
                        <ActivityIcon className="w-8 h-8" />
                        <span className="font-bold uppercase text-sm">Erro Técnico</span>
                    </button>

                    <button 
                        onClick={() => toggleTag('MENTAL', -15)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${tags.includes('MENTAL') ? 'bg-yellow-600 border-yellow-400 text-white shadow-glow' : 'bg-secondary border-yellow-500/30 hover:border-yellow-500 text-yellow-400'}`}
                    >
                        <AlertTriangleIcon className="w-8 h-8" />
                        <span className="font-bold uppercase text-sm">Erro Mental</span>
                    </button>

                    <button 
                        onClick={() => toggleTag('LOAF', -20)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${tags.includes('LOAF') ? 'bg-red-600 border-red-400 text-white shadow-glow' : 'bg-secondary border-red-500/30 hover:border-red-500 text-red-400'}`}
                    >
                        <XIcon className="w-8 h-8" />
                        <span className="font-bold uppercase text-sm">Loaf (Esforço)</span>
                    </button>
                </div>

                <textarea 
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm mb-4 focus:outline-none focus:border-highlight"
                    placeholder="Notas adicionais (opcional)..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={2}
                />

                <button 
                    onClick={handleSave}
                    className="w-full bg-gradient-to-r from-highlight to-green-600 hover:to-green-500 text-white font-bold py-4 rounded-xl shadow-lg transform transition-transform hover:scale-[1.02]"
                >
                    Salvar Avaliação
                </button>
            </div>
        </Modal>
    );
};

export default QuickEvaluationModal;