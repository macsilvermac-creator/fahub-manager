
import React from 'react';
import PageHeader from '../../components/PageHeader';
import { HeartPulseIcon, AlertTriangleIcon, CheckCircleIcon } from '../../components/icons/UiIcons';

const MedicalLab: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader title="Medical Lab" subtitle="Monitoramento de saúde." />
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-900/20 p-4 rounded-xl border-l-4 border-red-500 flex items-center gap-3">
                    <AlertTriangleIcon className="w-6 h-6 text-red-500" />
                    <div><p className="text-xl font-black text-white">3</p><p className="text-[9px] text-red-300 font-bold uppercase">Risco Alto</p></div>
                </div>
                <div className="bg-green-900/20 p-4 rounded-xl border-l-4 border-green-500 flex items-center gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    <div><p className="text-xl font-black text-white">42</p><p className="text-[9px] text-green-300 font-bold uppercase">Aptos</p></div>
                </div>
            </div>
            <div className="bg-secondary/30 rounded-2xl border border-white/5 p-6 text-center opacity-50">
                <HeartPulseIcon className="w-12 h-12 mx-auto mb-2"/>
                <p className="text-xs">Lista detalhada carregando...</p>
            </div>
        </div>
    );
};
export default MedicalLab;