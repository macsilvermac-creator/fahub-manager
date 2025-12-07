
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { FlagIcon } from '../components/icons/NavIcons';

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
        // PERFORMANCE: Increased interval to 10s
        const interval = setInterval(fetchGame, 10000); 
        return () => clearInterval(interval);
    }, [gameId]);

    // Rotate Sponsors slower
    useEffect(() => {
        const interval = setInterval(() => {
            if (game?.sponsors?.length) {
                setSponsorIndex(prev => (prev + 1) % game.sponsors.length);
            }
        }, 15000);
        return () => clearInterval(interval);
    }, [game]);

    if (!game) return <div className="flex items-center justify-center h-screen text-white font-bold bg-black/50">Carregando...</div>;

    const currentSponsor = game.sponsors?.[sponsorIndex];
    const score = game.score ? game.score.split('-') : ['0', '0'];
    const homeTeam = game.homeTeamName ? game.homeTeamName.toUpperCase() : 'HOME';

    return (
        <div className="w-screen h-screen bg-transparent overflow-hidden font-sans relative">
            <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between">
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
            </div>
        </div>
    );
};

export default BroadcastOverlay;
