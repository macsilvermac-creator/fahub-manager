
import React from 'react';
import { Player } from '../types';
import { TrashIcon } from './icons/UiIcons';

interface AthleteCardProps {
  player: Player;
  onClick: (player: Player) => void;
  onDelete: (player: Player) => void;
}

const AthleteCard: React.FC<AthleteCardProps> = ({ player, onClick, onDelete }) => {
  // Cor baseada na posição para dar identidade visual
  const getPositionColor = (pos: string) => {
    if (['QB', 'WR', 'RB', 'TE'].includes(pos)) return 'from-blue-600 to-blue-400'; // Ataque Skill
    if (['OL', 'DL'].includes(pos)) return 'from-orange-600 to-orange-400'; // Linha
    if (['LB', 'CB', 'S'].includes(pos)) return 'from-red-600 to-red-400'; // Defesa
    return 'from-green-600 to-green-400'; // Especialistas
  };

  return (
    <div 
      onClick={() => onClick(player)}
      className="group relative bg-secondary/80 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-glow cursor-pointer"
    >
        {/* Banner de Topo com Gradiente */}
        <div className={`h-20 bg-gradient-to-r ${getPositionColor(player.position)} relative overflow-hidden`}>
            {/* Padrão de fundo decorativo */}
            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px'}}></div>
            
            <div className="absolute top-2 right-2 bg-black/30 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-md border border-white/10">
                OVR <span className="text-lg">{player.rating}</span>
            </div>
            
            <button 
                className="absolute top-2 left-2 p-1.5 text-white/70 hover:text-white bg-black/20 hover:bg-red-500/80 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(player);
                }}
                title="Excluir Jogador"
            >
                <TrashIcon />
            </button>
        </div>

        {/* Conteúdo do Jogador */}
        <div className="px-4 pb-4 relative">
            {/* Avatar Centralizado */}
            <div className="relative -mt-12 mb-3 flex justify-center">
                 <div className="relative">
                    <img 
                        src={player.avatarUrl} 
                        alt={player.name} 
                        className="w-24 h-24 rounded-full object-cover border-4 border-secondary shadow-lg z-10 relative" 
                    />
                    {/* Badge de Nível */}
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm border-2 border-secondary z-20 shadow-md" title="Nível do Jogador">
                        {player.level}
                    </div>
                 </div>
            </div>

            <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-text-primary leading-tight">{player.name}</h3>
                <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-xs font-bold bg-white/10 text-white px-2 py-0.5 rounded uppercase tracking-wide">{player.position}</span>
                    <span className="text-xs text-text-secondary">#{player.jerseyNumber}</span>
                    <span className="text-xs text-text-secondary">• {player.class}</span>
                </div>
            </div>

            {/* Gamification Stats */}
            <div className="space-y-3">
                {/* XP Bar */}
                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-text-secondary uppercase font-semibold">
                        <span>Experiência</span>
                        <span>{player.xp} / 100 XP</span>
                    </div>
                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <div 
                            className="h-full bg-gradient-to-r from-highlight to-cyan-400 rounded-full" 
                            style={{ width: `${player.xp}%` }}
                        ></div>
                    </div>
                </div>

                {/* Mini Badges Row */}
                <div className="flex justify-center gap-2 pt-1 min-h-[24px]">
                    {player.badges && player.badges.slice(0, 3).map((badge, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-tertiary rounded-full text-text-secondary border border-white/5 flex items-center">
                            {badge === 'Capitão' && '©️ '}
                            {badge === 'MVP' && '👑 '}
                            {badge === 'Velocista' && '⚡ '}
                            {badge}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default AthleteCard;
