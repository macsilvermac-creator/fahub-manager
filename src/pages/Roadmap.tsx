
import React from 'react';
import { CheckCircleIcon, ClockIcon, MapIcon, UsersIcon } from '../components/icons/UiIcons';
import { TrophyIcon, FlagIcon, GlobeIcon } from '../components/icons/NavIcons';
import Card from '../components/Card';

const Roadmap: React.FC = () => {
    const phases = [
        {
            id: 1,
            title: 'A Fundação (Times & Gestão)',
            status: 'CURRENT',
            icon: <UsersIcon className="w-8 h-8 text-blue-400" />,
            color: 'blue',
            features: [
                'Gestão de Elenco (Roster & ID)',
                'Financeiro & Mensalidades',
                'Playbook & Treinos',
                'Onboarding Mágico'
            ]
        },
        {
            id: 2,
            title: 'A Verdade do Campo (Jogos)',
            status: 'CURRENT',
            icon: <FlagIcon className="w-8 h-8 text-yellow-400" />,
            color: 'yellow',
            features: [
                'App Árbitro Offline (PWA)',
                'Súmula Digital em Tempo Real',
                'Portal do Fã (Livescore)',
                'Overlay de Transmissão TV'
            ]
        },
        {
            id: 3,
            title: 'A Rede (Federação)',
            status: 'NEXT',
            icon: <TrophyIcon className="w-8 h-8 text-purple-400" />,
            color: 'purple',
            features: [
                'Gestão de Campeonatos',
                'Tabelas Automáticas',
                'TJD Online (Justiça)',
                'BID Estadual Integrado'
            ]
        },
        {
            id: 4,
            title: 'O Ecossistema (Nacional)',
            status: 'FUTURE',
            icon: <GlobeIcon className="w-8 h-8 text-green-400" />,
            color: 'green',
            features: [
                'Passaporte Biológico do Atleta',
                'Marketplace Nacional',
                'Scout Seleção Brasileira',
                'Big Data & Analytics'
            ]
        }
    ];

    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            {/* Print Styles */}
            <style>{`
                @media print {
                    body { background: white !important; color: black !important; }
                    .no-print { display: none !important; }
                    .bg-primary { background: white !important; }
                    .text-white { color: black !important; }
                    .text-text-secondary { color: #555 !important; }
                    .border-white\\/10 { border-color: #ddd !important; }
                    .glass-panel { border: 1px solid #ccc !important; box-shadow: none !important; }
                }
            `}</style>

            <div className="flex justify-between items-center no-print">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl">
                        <MapIcon className="text-highlight w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Roadmap Estratégico</h2>
                        <p className="text-text-secondary">O Plano Mestre do FAHUB MANAGER (2025-2026).</p>
                    </div>
                </div>
                <button onClick={() => window.print()} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                    🖨️ Imprimir Visualização
                </button>
            </div>

            <div className="relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-white/10 -z-10 transform -translate-y-1/2 rounded-full"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {phases.map((phase, idx) => {
                        const isCurrent = phase.status === 'CURRENT';
                        const isNext = phase.status === 'NEXT';
                        
                        let borderColor = 'border-white/10';
                        let glowClass = '';
                        
                        if (phase.color === 'blue') { borderColor = 'border-blue-500'; glowClass = 'shadow-[0_0_15px_rgba(59,130,246,0.3)]'; }
                        if (phase.color === 'yellow') { borderColor = 'border-yellow-500'; glowClass = 'shadow-[0_0_15px_rgba(234,179,8,0.3)]'; }
                        if (phase.color === 'purple') { borderColor = 'border-purple-500'; }
                        if (phase.color === 'green') { borderColor = 'border-green-500'; }

                        return (
                            <div key={phase.id} className={`bg-secondary/80 backdrop-blur-md p-6 rounded-2xl border-t-4 ${borderColor} ${glowClass} relative flex flex-col h-full hover:-translate-y-1 transition-transform duration-300`}>
                                {/* Step Number Badge */}
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-secondary border border-white/20 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center z-10 shadow-lg">
                                    {phase.id}
                                </div>

                                <div className="mt-4 text-center mb-6">
                                    <div className={`w-16 h-16 mx-auto rounded-full bg-${phase.color}-500/20 flex items-center justify-center mb-3 border border-${phase.color}-500/30`}>
                                        {phase.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-white leading-tight">{phase.title}</h3>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded mt-2 inline-block ${isCurrent ? 'bg-green-500/20 text-green-400' : isNext ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-gray-400'}`}>
                                        {isCurrent ? 'IMPLEMENTADO' : isNext ? 'EM DESENVOLVIMENTO' : 'PLANEJADO'}
                                    </span>
                                </div>

                                <ul className="space-y-3 flex-1">
                                    {phase.features.map((feat, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-2 text-sm text-text-secondary">
                                            {isCurrent ? (
                                                <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border border-white/20 shrink-0 mt-0.5"></div>
                                            )}
                                            <span className={isCurrent ? 'text-white' : ''}>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detailed View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <Card title="Objetivos de Curto Prazo (Q3 2025)">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🚀</span>
                            <div>
                                <h4 className="font-bold text-white">Tração Inicial</h4>
                                <p className="text-sm text-text-secondary">Cadastrar 50 times e 2.000 atletas ativos na plataforma.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">💰</span>
                            <div>
                                <h4 className="font-bold text-white">Validação Financeira</h4>
                                <p className="text-sm text-text-secondary">Processar R$ 100k em mensalidades e inscrições via sistema.</p>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card title="Visão de Longo Prazo (2026+)">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🇧🇷</span>
                            <div>
                                <h4 className="font-bold text-white">Hegemonia Nacional</h4>
                                <p className="text-sm text-text-secondary">Ser o sistema oficial da Confederação Brasileira (CBFA) e todas as federações estaduais.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🧠</span>
                            <div>
                                <h4 className="font-bold text-white">Big Data Esportivo</h4>
                                <p className="text-sm text-text-secondary">O maior banco de dados de performance de atletas da América Latina.</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Roadmap;
