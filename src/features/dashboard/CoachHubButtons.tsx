
import React from 'react';
import { DumbbellIcon, ClipboardIcon } from '../../components/icons/UiIcons';
import { TrophyIcon, BookIcon } from '../../components/icons/NavIcons';

interface CoachHubButtonsProps {
    setActiveHub: (hub: string) => void;
    setActiveModule: (module: string) => void;
    nextGame: any;
    program: string;
}

const CoachHubButtons: React.FC<CoachHubButtonsProps> = ({ setActiveHub, setActiveModule, nextGame, program }) => (
    <div className="grid grid-cols-1 gap-4 h-[calc(100vh-250px)]">
        <button onClick={() => { setActiveHub('TRAINING'); setActiveModule('PRACTICE'); }} className={`glass-panel bg-gradient-to-br ${program === 'TACKLE' ? 'from-blue-900/40 hover:border-blue-400' : 'from-yellow-900/40 hover:border-yellow-400'} to-transparent rounded-2xl flex flex-col items-center justify-center p-6 shadow-lg active:scale-95 transition-transform group`}>
            <DumbbellIcon className={`w-12 h-12 mb-2 group-hover:scale-110 transition-transform ${program === 'TACKLE' ? 'text-blue-400' : 'text-yellow-400'}`} />
            <span className="text-2xl font-black text-white uppercase">Dia de Treino</span>
            <span className={`text-xs mt-1 ${program === 'TACKLE' ? 'text-blue-300' : 'text-yellow-300'}`}>Scripts, IA & Performance ({program})</span>
        </button>
        <button onClick={() => { setActiveHub('GAME'); setActiveModule('MISSION_CONTROL'); }} className="glass-panel bg-gradient-to-br from-red-900/40 to-transparent rounded-2xl flex flex-col items-center justify-center p-6 shadow-lg active:scale-95 transition-transform group hover:border-red-400">
            <TrophyIcon className="w-12 h-12 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-black text-white uppercase">Dia de Jogo</span>
                {nextGame ? 
                <span className="text-xs text-red-200 bg-red-900/50 px-2 py-1 rounded mt-2">Próximo: vs {nextGame.opponent}</span> :
                <span className="text-xs text-red-200 mt-1">Nenhum jogo agendado</span>
                }
        </button>
        <div className="grid grid-cols-2 gap-4 h-full">
            <button onClick={() => { setActiveHub('PLANNING'); setActiveModule('ROSTER'); }} className="glass-panel bg-gradient-to-br from-green-900/40 to-transparent rounded-2xl flex flex-col items-center justify-center p-4 shadow-lg active:scale-95 transition-transform group hover:border-green-400">
                <ClipboardIcon className="w-8 h-8 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-lg font-black text-white uppercase">Gestão</span>
            </button>
            <button onClick={() => { setActiveHub('STUDY'); setActiveModule('VIDEO'); }} className="glass-panel bg-gradient-to-br from-purple-900/40 to-transparent rounded-2xl flex flex-col items-center justify-center p-4 shadow-lg active:scale-95 transition-transform group hover:border-purple-400">
                <BookIcon className="w-8 h-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-lg font-black text-white uppercase">Estudos (IA)</span>
            </button>
        </div>
    </div>
);

export default CoachHubButtons;
