
import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import { SearchIcon, UsersIcon, CalendarIcon, FileTextIcon, ChevronRightIcon } from './icons/UiIcons';
import { storageService } from '../services/storageService';
import { Player } from '../types';

const GlobalSearch: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // Atalho de Teclado (Ctrl+K ou Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Lógica de Busca
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const searchResults: any[] = [];

        // 1. Pages (Navegação)
        const pages = [
            { title: 'Dashboard', path: '/dashboard', icon: '🏠', type: 'PAGE' },
            { title: 'Elenco (Roster)', path: '/roster', icon: '👥', type: 'PAGE' },
            { title: 'Financeiro', path: '/finance', icon: '💰', type: 'PAGE' },
            { title: 'Treinos', path: '/practice', icon: '🏈', type: 'PAGE' },
            { title: 'Calendário', path: '/schedule', icon: '📅', type: 'PAGE' },
            { title: 'Playbook IA', path: '/gemini-playbook', icon: '🤖', type: 'PAGE' },
        ];
        
        pages.forEach(p => {
            if (p.title.toLowerCase().includes(lowerQuery)) searchResults.push(p);
        });

        // 2. Players
        const players = storageService.getPlayers();
        players.forEach(p => {
            if (p.name.toLowerCase().includes(lowerQuery) || String(p.jerseyNumber).includes(lowerQuery)) {
                searchResults.push({
                    title: `${p.name} #${p.jerseyNumber}`,
                    subtitle: p.position,
                    path: '/roster', // Idealmente abriria o modal direto, mas simplificamos
                    icon: '👤',
                    type: 'PLAYER',
                    id: p.id
                });
            }
        });

        setResults(searchResults.slice(0, 5)); // Limit 5 results
    }, [query]);

    const handleSelect = (result: any) => {
        setIsOpen(false);
        setQuery('');
        navigate(result.path);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm p-4" onClick={() => setIsOpen(false)}>
            <div className="w-full max-w-lg bg-secondary rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="flex items-center px-4 border-b border-white/10">
                    <SearchIcon className="w-5 h-5 text-text-secondary" />
                    <input 
                        ref={inputRef}
                        className="w-full bg-transparent p-4 text-white placeholder-text-secondary focus:outline-none"
                        placeholder="Buscar jogador, página ou comando..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <div className="hidden md:flex gap-1">
                        <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-text-secondary">ESC</span>
                    </div>
                </div>
                
                {results.length > 0 ? (
                    <div className="py-2">
                        {results.map((res, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => handleSelect(res)}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 group transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg group-hover:bg-white/10 transition-colors">
                                        {res.icon}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-white group-hover:text-highlight transition-colors">{res.title}</p>
                                        {res.subtitle && <p className="text-xs text-text-secondary">{res.subtitle}</p>}
                                    </div>
                                </div>
                                <ChevronRightIcon className="w-4 h-4 text-white/20 group-hover:text-white" />
                            </button>
                        ))}
                    </div>
                ) : query && (
                    <div className="p-8 text-center text-text-secondary text-sm">
                        Nenhum resultado encontrado para "{query}"
                    </div>
                )}
                
                {!query && (
                    <div className="p-4 bg-black/20 text-[10px] text-text-secondary flex justify-between">
                        <span>Dica: Digite o nome de um jogador para ir ao perfil.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlobalSearch;
