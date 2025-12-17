
import React, { useState } from 'react';
import { Player } from '../types';
import { TrashIcon, ShareIcon, StarIcon } from './icons/UiIcons';
import LazyImage from './LazyImage';

interface AthleteCardProps {
  player: Player;
  onClick: (player: Player) => void;
  onDelete: (player: Player) => void;
}

const AthleteCard: React.FC<AthleteCardProps> = ({ player, onClick, onDelete }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => setRotate({ x: 0, y: 0 });

  const getPositionColor = (pos: string) => {
    if (['QB', 'WR', 'RB', 'TE'].includes(pos)) return 'from-blue-600 to-indigo-400';
    if (['OL', 'DL'].includes(pos)) return 'from-orange-600 to-yellow-500';
    return 'from-red-600 to-pink-500';
  };

  return (
    <div 
      className="perspective-1000 group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        onClick={() => onClick(player)}
        style={{ transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` }}
        className="relative bg-secondary rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-transform duration-200 cursor-pointer w-full"
      >
        {/* Holographic Overly */}
        <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-30 pointer-events-none bg-gradient-to-tr from-white/20 via-transparent to-white/20 animate-shimmer"></div>

        <div className={`h-24 bg-gradient-to-r ${getPositionColor(player.position)} relative`}>
            <div className="absolute top-2 right-2 bg-black/40 text-white text-[10px] font-black px-2 py-1 rounded backdrop-blur-md">
                OVR {player.rating}
            </div>
            <button 
                className="absolute top-2 left-2 p-1.5 text-white/50 hover:text-white bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                onClick={(e) => { e.stopPropagation(); onDelete(player); }}
            >
                <TrashIcon className="w-4 h-4" />
            </button>
        </div>

        <div className="px-4 pb-6 relative flex flex-col items-center">
            <div className="relative -mt-12 mb-3">
                <LazyImage 
                    src={player.avatarUrl} 
                    className="w-24 h-24 rounded-full border-4 border-secondary shadow-xl object-cover bg-primary" 
                    fallbackText={player.name}
                />
                <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black w-8 h-8 flex items-center justify-center rounded-full font-black text-xs border-2 border-secondary">
                    {player.level}
                </div>
            </div>

            <h3 className="text-lg font-black text-white italic tracking-tighter uppercase">{player.name}</h3>
            <div className="flex gap-2 mt-1">
                <span className="text-[10px] font-bold bg-white/10 text-white px-2 py-0.5 rounded">{player.position}</span>
                <span className="text-[10px] text-text-secondary">#{player.jerseyNumber}</span>
            </div>

            {/* Commitment Bar */}
            <div className="w-full mt-4 space-y-1">
                <div className="flex justify-between text-[8px] font-black text-text-secondary uppercase">
                    <span>Comprometimento</span>
                    <span>90%</span>
                </div>
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-highlight w-[90%]"></div>
                </div>
            </div>

            <button className="mt-4 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 transition-all">
                <ShareIcon className="w-3 h-3" /> Hype no Instagram
            </button>
        </div>
      </div>
    </div>
  );
};

export default AthleteCard;