
import React, { useEffect, useState } from 'react';
// @ts-ignore
import { useParams } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { realtimeService } from '../services/realtimeService';

const BroadcastOverlay: React.FC = () => {
    const { gameId } = useParams<{ gameId: string }>();
    const [game, setGame] = useState<any | null>(null);
    const [sponsorIndex, setSponsorIndex] = useState(0);

    useEffect(() => {
        const fetchGame = () => {
            if (gameId) {
                const data = storageService.getPublicGameData(gameId);
                setGame(data);
            }
        };

        fetchGame(); 

        // Inscreve no serviço de tempo real (usando realtimeService)
        const unsubscribe = realtimeService.subscribe((data) => {
            if (data.gameId === Number(gameId) && (data.type === 'SCORE' || data.type === 'CLOCK' || data.type === 'STATUS')) {
                setGame((prev: any) => ({ ...prev, ...data.payload }));
            }
        });

        return () => unsubscribe();
    }, [gameId]);

    // Rotação de Patrocinadores
    useEffect(() => {
        const interval = setInterval(() => {
            if (game?.sponsors?.length) {
                setSponsorIndex(prev => (prev + 1) % game.sponsors.length);
            }
        }, 15000);
        return () => clearInterval(interval);
    }, [game]);

    if (!game) return <div className="flex items-center justify-center h-screen text-white font-bold bg-black/50">Aguardando sinal...</div>;

    const currentSponsor = game.sponsors?.[sponsorIndex];
    const score = game.score ? game.score.split('-') : ['0', '0'];
    const homeTeam = game.homeTeamName ? game.homeTeamName.toUpperCase() : 'HOME';

    return (
        <div className="w-screen h-screen bg-transparent overflow-hidden font-sans relative">
            <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between animate-fade-in">
                <div className="flex items-stretch shadow-2xl rounded-xl overflow-hidden border-2 border-white/10 bg-gray-900">
                    {/* Placar Mandante */}
                    <div className="bg-[#0B1120] px-6 py-2 flex flex-col items-center justify-center border-r border-white/10 min-w-[140px]">
                        <span className="text-4xl font-black text-white">{score[0] || '0'}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{homeTeam}</span>
                    </div>
                    
                    {/* Relógio Central */}
                    <div className="bg-gray-800 px-4 py-2 flex flex-col items-center justify-center min-w-[100px] border-x border-white/5 relative">
                        <span className="text-2xl font-mono font-bold text-yellow-400">{game.clock || '00:00'}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase">Q{game.currentQuarter || 1}</span>
                        {game.status === 'IN_PROGRESS' && (
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                        )}
                    </div>
                    
                    {/* Placar Visitante */}
                    <div className="bg-[#0B1120] px-6 py-2 flex flex-col items-center justify-center border-l border-white/10 min-w-[140px]">
                        <span className="text-4xl font-black text-white">{score[1] || '0'}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{game.opponent?.substring(0,12) || 'VISITANTE'}</span>
                    </div>
                </div>
                
                {currentSponsor && (
                    <div className="bg-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
                         <span className="text-xs text-gray-500 font-bold block mb-1">Oferecimento</span>
                         <span className="text-lg font-black text-black">{currentSponsor.companyName}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BroadcastOverlay;