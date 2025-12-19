
import React, { useEffect, useState } from 'react';
// @ts-ignore
import { useParams } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { realtimeService } from '../services/realtimeService';
import LazyImage from '../components/LazyImage';

const BroadcastOverlay: React.FC = () => {
    const { gameId } = useParams<{ gameId: string }>();
    const [game, setGame] = useState<any | null>(null);
    const [sponsorIndex, setSponsorIndex] = useState(0);
    
    const [tickerMessage, setTickerMessage] = useState('');
    const [activeLowerThird, setActiveLowerThird] = useState<{ title: string, subtitle: string, image?: string } | null>(null);
    const [forcedSponsor, setForcedSponsor] = useState<string | null>(null);

    useEffect(() => {
        const fetchGame = () => {
            if (gameId) {
                const data = storageService.getPublicGameData(gameId);
                setGame(data);
            }
        };

        fetchGame(); 

        const unsubscribe = realtimeService.subscribe((data) => {
            if (data.gameId === Number(gameId) && (data.type === 'SCORE' || data.type === 'CLOCK' || data.type === 'STATUS')) {
                setGame((prev: any) => ({ ...prev, ...data.payload }));
            }
            
            if (data.type === 'BROADCAST_CONFIG') {
                if (data.payload.action === 'SET_TICKER') setTickerMessage(data.payload.text);
                if (data.payload.action === 'SHOW_LOWER_THIRD') setActiveLowerThird(data.payload.data);
                if (data.payload.action === 'HIDE_LOWER_THIRD') setActiveLowerThird(null);
                if (data.payload.action === 'FORCE_SPONSOR') setForcedSponsor(data.payload.sponsorName);
                if (data.payload.action === 'AUTO_SPONSOR') setForcedSponsor(null);
            }
        });

        return () => unsubscribe();
    }, [gameId]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!forcedSponsor && game?.sponsors?.length) {
                setSponsorIndex(prev => (prev + 1) % game.sponsors.length);
            }
        }, 15000);
        return () => clearInterval(interval);
    }, [game, forcedSponsor]);

    if (!game) return <div className="flex items-center justify-center h-screen text-white font-bold bg-black/50">Aguardando sinal...</div>;

    const currentSponsor = forcedSponsor 
        ? game.sponsors?.find((s: any) => s.companyName === forcedSponsor) 
        : game.sponsors?.[sponsorIndex];
        
    const score = game.score ? game.score.split('-') : ['0', '0'];
    const homeTeam = game.homeTeamName ? game.homeTeamName.toUpperCase() : 'HOME';

    return (
        <div className="w-screen h-screen bg-transparent overflow-hidden font-sans relative">
            
            {activeLowerThird && (
                <div className="absolute bottom-32 left-10 animate-slide-in flex items-end">
                    {activeLowerThird.image && (
                        <div className="w-24 h-24 mr-[-20px] z-10 relative">
                             <LazyImage src={activeLowerThird.image} className="w-full h-full rounded-full border-4 border-highlight object-cover shadow-lg" />
                        </div>
                    )}
                    <div className="bg-gradient-to-r from-blue-900 to-black border-l-4 border-highlight pl-8 pr-6 py-3 rounded-r-xl shadow-2xl min-w-[300px]">
                        <h2 className="text-2xl font-black text-white uppercase italic leading-none">{activeLowerThird.title}</h2>
                        <p className="text-sm font-bold text-highlight uppercase">{activeLowerThird.subtitle}</p>
                    </div>
                </div>
            )}

            <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between transition-all duration-500">
                <div className="flex items-stretch shadow-2xl rounded-xl overflow-hidden border-2 border-white/10 bg-gray-900">
                    <div className="bg-[#0B1120] px-6 py-2 flex flex-col items-center justify-center border-r border-white/10 min-w-[140px]">
                        <span className="text-4xl font-black text-white">{score[0] || '0'}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{homeTeam}</span>
                    </div>
                    
                    <div className="bg-gray-800 px-4 py-2 flex flex-col items-center justify-center min-w-[100px] border-x border-white/5 relative">
                        <span className="text-2xl font-mono font-bold text-yellow-400">{game.clock || '00:00'}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase">Q{game.currentQuarter || 1}</span>
                        {game.status === 'IN_PROGRESS' && (
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                        )}
                    </div>
                    
                    <div className="bg-[#0B1120] px-6 py-2 flex flex-col items-center justify-center border-l border-white/10 min-w-[140px]">
                        <span className="text-4xl font-black text-white">{score[1] || '0'}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{game.opponent?.substring(0,12) || 'VISITANTE'}</span>
                    </div>
                </div>
                
                {currentSponsor && (
                    <div className="bg-white px-4 py-2 rounded-lg shadow-lg animate-fade-in border-b-4 border-highlight">
                         <span className="text-[10px] text-gray-500 font-bold block mb-0 leading-none">OFERECIMENTO</span>
                         <span className="text-xl font-black text-black uppercase">{currentSponsor.companyName}</span>
                    </div>
                )}
            </div>

            {tickerMessage && (
                <div className="absolute bottom-0 left-0 right-0 bg-highlight/90 h-8 flex items-center overflow-hidden border-t border-white/20">
                    <div className="whitespace-nowrap animate-marquee text-sm font-bold text-white px-4">
                        {tickerMessage}
                    </div>
                </div>
            )}
            
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                    animation: marquee 15s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default BroadcastOverlay;