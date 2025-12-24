
import React from 'react';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import Skeleton from '../../components/Skeleton';
import { AlertTriangleIcon, SparklesIcon, CheckCircleIcon, ClipboardIcon } from '../../components/icons/UiIcons';

interface StatusWidgetsProps {
    systemHealth: any;
}

const StatusWidgets: React.FC<StatusWidgetsProps> = ({ systemHealth }) => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
                !systemHealth ? <Skeleton key={i} height="80px" /> : 
                <div key={i} className="glass-panel p-4 rounded-xl shadow-lg flex items-center justify-between">
                    {i === 1 && (
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-full"><AlertTriangleIcon className="text-blue-400 w-5 h-5" /></div>
                            <div>
                                <h3 className="text-xs font-bold text-text-secondary uppercase">Versão</h3>
                                <p className="text-white font-mono font-bold">{systemHealth.version}</p>
                            </div>
                        </div>
                    )}
                    {i === 2 && (
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${systemHealth.api ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                <SparklesIcon className={`w-5 h-5 ${systemHealth.api ? 'text-green-400' : 'text-red-400'}`} />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-text-secondary uppercase">IA Gemini</h3>
                                <p className={`font-bold ${systemHealth.api ? 'text-green-400' : 'text-red-400'}`}>
                                    {systemHealth.api ? 'IA Ativa (GPU)' : 'Sem Chave'}
                                </p>
                            </div>
                        </div>
                    )}
                    {i === 3 && (
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 rounded-full"><CheckCircleIcon className="text-green-400 w-5 h-5" /></div>
                            <div>
                                <h3 className="text-xs font-bold text-text-secondary uppercase">RAM DB</h3>
                                <p className="text-green-400 font-bold text-sm">Otimizado</p>
                            </div>
                        </div>
                    )}
                    {i === 4 && (
                        <div className="flex items-center gap-3 w-full cursor-pointer hover:bg-white/5 transition-colors" onClick={() => navigate('/admin')}>
                            <div className="p-2 bg-white/5 rounded-full"><ClipboardIcon className="text-white w-5 h-5" /></div>
                            <div>
                                <h3 className="text-xs font-bold text-text-secondary uppercase">Admin</h3>
                                <p className="text-white font-bold text-sm underline">Configurações →</p>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default StatusWidgets;