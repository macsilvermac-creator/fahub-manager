
import React from 'react';
import PageHeader from '../../components/PageHeader';
import { ActivityIcon } from '../../components/icons/UiIcons';

const SidelineLab: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader title="Sideline Lab" subtitle="Analytics de combate." />
            <div className="bg-gradient-to-r from-purple-900/80 to-indigo-950 p-6 rounded-2xl border border-purple-500/20 shadow-lg">
                <h3 className="text-lg font-black text-white italic uppercase">AI Tactical Insight</h3>
                <p className="text-purple-200 text-xs mt-1">"Corridas pelo Gap A rendendo +2.4 jardas."</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded-xl text-center border border-white/5">
                    <p className="text-[9px] uppercase font-bold text-text-secondary">3rd Down Eff</p>
                    <p className="text-2xl font-black text-white">42%</p>
                </div>
                <div className="bg-black/20 p-4 rounded-xl text-center border border-white/5">
                    <p className="text-[9px] uppercase font-bold text-text-secondary">Redzone TD</p>
                    <p className="text-2xl font-black text-white">68%</p>
                </div>
            </div>
        </div>
    );
};
export default SidelineLab;