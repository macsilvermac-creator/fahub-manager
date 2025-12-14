
import React, { useEffect, useState } from 'react';
// @ts-ignore
import { useParams } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { liveGameService } from '../services/liveGameService';

const BroadcastOverlay: React.FC = () => {
    const { gameId } = useParams<{ gameId: string }>();
    const [game, setGame] = useState<any | null>(null);

    useEffect(() => {
        const fetchGame = () => {
            if (gameId) {
                const data = storageService.getPublicGameData(gameId);
                setGame(data);
            }
        };

        fetchGame(); 

        // Inscreve no serviço de tempo real para atualizações instantâneas
        const unsubscribe = liveGameService.subscribe((data) => {
            if (data.gameId === Number(gameId) && (data.type === 'SCORE' || data.type === 'CLOCK' || data.type === 'STATUS')) {
                setGame((prev: any) => ({ ...prev, ...data.payload }));
            }
        });

        return () => unsubscribe();
    }, [gameId]);

    if (!game) return <div className="flex items-center justify-center h-screen text-white font-bold bg-black/50">Aguardando sinal...</div>;

    const score = game.score ? game.score.split('-') : ['0', '0'];
    const homeTeam = game.homeTeamName ? game.homeTeamName.toUpperCase() : 'HOME';

    return (
        <div className="w-screen h-screen bg-transparent overflow-hidden font-sans relative">
            <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between animate-fade-in">
                <div className="flex items-stretch shadow-2xl rounded-xl overflow-hidden border-2 border-white/10 bg-gray-900">
                    <div className="bg-[#0B1120] px-6 py-2 flex flex-col items-center justify-center border-r border-white/10 min-w-[140px]">
                        <span className="text-3xl font-black text-white">{score[0] || '0'}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{homeTeam}</span>
                    </div>
                    <div className="bg-gray-800 px-4 py-2 flex flex-col items-center justify-center min-w-[100px]">
                        <span className="text-xl font-mono font-bold text-yellow-400">{game.clock || '00:00'}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase">Q{game.currentQuarter || 1}</span>
                    </div>
                    <div className="bg-[#0B1120] px-6 py-2 flex flex-col items-center justify-center border-l border-white/10 min-w-[140px]">
                        <span className="text-3xl font-black text-white">{score[1] || '0'}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{game.opponent?.substring(0,12) || 'VISITANTE'}</span>
                    </div>
                </div>
                
                {game.status === 'IN_PROGRESS' && (
                    <div className="bg-red-600 text-white px-3 py-1 rounded font-bold text-xs uppercase animate-pulse shadow-lg">
                        ● AO VIVO
                    </div>
                )}
            </div>
        </div>
    );
};

export default BroadcastOverlay;