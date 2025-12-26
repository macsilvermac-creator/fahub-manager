import React from 'react';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import { PlayCircleIcon, StarIcon, TrophyIcon, SparklesIcon } from '@/components/icons/UiIcons';

const BrainLab: React.FC = () => {
    const CourseCard = ({ title, level }: { title: string, level: string }) => (
        <div className="bg-black/40 rounded-3xl p-6 border border-white/5 group hover:border-highlight/50 transition-all cursor-pointer relative overflow-hidden flex-none w-[300px]">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <TrophyIcon className="w-12 h-12 text-white" />
            </div>
            <span className="text-[8px] font-black text-highlight bg-highlight/10 px-2 py-0.5 rounded uppercase tracking-widest">{level}</span>
            <h4 className="text-white font-black uppercase italic text-lg mt-3 leading-tight group-hover:text-highlight transition-colors">{title}</h4>
            <div className="mt-6 flex justify-between items-center">
                <span className="text-[9px] text-text-secondary font-bold uppercase tracking-widest">Ver Módulos</span>
                <PlayCircleIcon className="w-8 h-8 text-white/20 group-hover:text-white transition-all" />
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden">
            <PageHeader title="Brain Lab" subtitle="Cognição tática e evolução de inteligência de jogo." />

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
                {/* LEFT: 2 HORIZONTAL CONTAINERS */}
                <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden">
                    {/* Suggested by Coach */}
                    <div className="flex-1 bg-secondary/40 rounded-[3rem] border border-white/5 p-8 flex flex-col overflow-hidden relative">
                        <div className="flex items-center gap-3 mb-6">
                            <SparklesIcon className="w-5 h-5 text-yellow-500" />
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Coach's Selection</h3>
                        </div>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                            <CourseCard title="Leitura de Coberturas 101" level="Essential" />
                            <CourseCard title="Blitz Pickup para O-Line" level="Pro" />
                            <CourseCard title="Gestão de Relógio" level="Elite" />
                        </div>
                    </div>

                    {/* Suggested for Position */}
                    <div className="flex-1 bg-secondary/40 rounded-[3rem] border border-white/5 p-8 flex flex-col overflow-hidden">
                         <div className="flex items-center gap-3 mb-6">
                            <StarIcon className="w-5 h-5 text-highlight" />
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Específicos: QB / Skill</h3>
                        </div>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                            <CourseCard title="Deep Ball Mechanics" level="Pro" />
                            <CourseCard title="Footwork de Elite" level="Master" />
                            <CourseCard title="Análise de Safeties" level="Elite" />
                        </div>
                    </div>
                </div>

                {/* RIGHT: 1 VERTICAL CONTAINER */}
                <div className="lg:col-span-4 bg-gradient-to-b from-highlight/10 to-transparent rounded-[3rem] border border-highlight/20 p-8 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Hot Now (Shop)</h3>
                        <span className="text-[10px] bg-white/10 text-white px-3 py-1 rounded-full font-black uppercase animate-pulse">Trending</span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className="bg-black/20 rounded-2xl p-5 border border-white/5 hover:border-highlight transition-all group">
                                <p className="text-[8px] font-black text-highlight uppercase mb-1">Destaque da Loja</p>
                                <h4 className="text-white font-black text-sm uppercase italic">Curso Completo de Kickoff Return v2.0</h4>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-lg font-black text-white">R$ 49,90</span>
                                    <button className="bg-white text-black px-4 py-1.5 rounded-xl font-black text-[10px] uppercase group-hover:bg-highlight group-hover:text-white transition-all">Adquirir</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrainLab;