
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DumbbellIcon, ClipboardIcon, WhistleIcon, 
  // Fix: Added ActivityIcon and UsersIcon to imports
  TrophyIcon, BookIcon, BrainIcon, ActivityIcon, UsersIcon
} from '../../components/icons/UiIcons';

interface CoachHubButtonsProps {
    setActiveHub: (hub: string) => void;
    setActiveModule: (module: string) => void;
    nextGame: any;
    program: string;
}

const CoachHubButtons: React.FC<CoachHubButtonsProps> = ({ program }) => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 h-full px-2">
            {/* Main Action Block: TRAINING */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                    onClick={() => navigate('/training-day')}
                    className="relative overflow-hidden bg-gradient-to-br from-blue-900/60 to-black rounded-[3rem] border border-blue-500/30 p-10 flex flex-col items-start text-left group transition-all hover:border-blue-400 shadow-2xl"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <WhistleIcon className="w-48 h-48 text-white" />
                    </div>
                    <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-400 mb-6">
                        <DumbbellIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Training Day</h3>
                    <p className="text-sm text-blue-200 mt-3 font-bold uppercase tracking-widest opacity-80">Scripts & Performance ({program})</p>
                    <div className="mt-auto pt-10 flex items-center gap-2 text-highlight font-black uppercase text-[10px] tracking-[0.2em]">
                        Operar Campo <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </button>

                <button 
                    onClick={() => navigate('/sideline')}
                    className="relative overflow-hidden bg-gradient-to-br from-red-900/60 to-black rounded-[3rem] border border-red-500/30 p-10 flex flex-col items-start text-left group transition-all hover:border-red-400 shadow-2xl"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrophyIcon className="w-48 h-48 text-white" />
                    </div>
                    <div className="p-4 bg-red-500/20 rounded-2xl text-red-400 mb-6">
                        <ActivityIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Game Day</h3>
                    <p className="text-sm text-red-200 mt-3 font-bold uppercase tracking-widest opacity-80">Súmula Digital & Rotação</p>
                    <div className="mt-auto pt-10 flex items-center gap-2 text-red-400 font-black uppercase text-[10px] tracking-[0.2em]">
                        Mission Control <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </button>
            </div>

            {/* Sidebar Support Blocks */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <button 
                    onClick={() => navigate('/tactical-lab')}
                    className="flex-1 bg-secondary/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-highlight group transition-all shadow-xl"
                >
                    <div className="flex justify-between items-center">
                        <h4 className="text-white font-black uppercase italic tracking-widest">Tactical Lab</h4>
                        <BrainIcon className="w-6 h-6 text-highlight group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-xs text-text-secondary font-medium leading-relaxed mt-4">CIATORS: Digitalize suas jogadas e use Vision AI para scout.</p>
                </button>

                <button 
                    onClick={() => navigate('/roster')}
                    className="flex-1 bg-secondary/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-blue-400 group transition-all shadow-xl"
                >
                    <div className="flex justify-between items-center">
                        <h4 className="text-white font-black uppercase italic tracking-widest">Roster Control</h4>
                        <UsersIcon className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-xs text-text-secondary font-medium leading-relaxed mt-4">Gestão de Depth Chart e histórico de performance.</p>
                </button>
            </div>
        </div>
    );
};

export default CoachHubButtons;