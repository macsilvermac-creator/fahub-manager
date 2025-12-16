
import React from 'react';
import { Drill } from '../types';
import { ClockIcon, TrashIcon, CheckCircleIcon } from './icons/UiIcons';
import { VideoIcon } from './icons/NavIcons';

interface DrillCardProps {
    drill: Drill;
    onSelect?: (drill: Drill) => void;
    onDelete?: (id: string) => void;
    isSelected?: boolean;
}

const DrillCard: React.FC<DrillCardProps> = ({ drill, onSelect, onDelete, isSelected }) => {
    return (
        <div 
            className={`relative bg-secondary rounded-xl p-4 border transition-all cursor-pointer group hover:-translate-y-1 ${isSelected ? 'border-highlight bg-highlight/5 shadow-glow' : 'border-white/5 hover:border-white/20'}`}
            onClick={() => onSelect && onSelect(drill)}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-white text-sm line-clamp-2 pr-6">{drill.name}</h4>
                {isSelected && <CheckCircleIcon className="w-5 h-5 text-highlight absolute top-4 right-4" />}
            </div>
            
            <p className="text-xs text-text-secondary line-clamp-3 mb-3 min-h-[40px]">
                {drill.description}
            </p>
            
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-blue-300 bg-blue-900/20 px-2 py-0.5 rounded">
                        <ClockIcon className="w-3 h-3" /> {drill.durationMinutes}m
                    </span>
                    {drill.videoSearchTerm && (
                        <a 
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(drill.videoSearchTerm)}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-text-secondary hover:text-red-400" 
                            onClick={(e) => e.stopPropagation()}
                            title="Ver no YouTube"
                        >
                            <VideoIcon className="w-4 h-4" />
                        </a>
                    )}
                </div>
                
                {onDelete && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(drill.id); }} 
                        className="text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default DrillCard;