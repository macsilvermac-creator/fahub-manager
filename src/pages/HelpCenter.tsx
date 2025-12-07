
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { BookIcon, FootballIcon, TrophyIcon, FlagIcon, GlobeIcon } from '../components/icons/NavIcons';
import { PlayCircleIcon, UsersIcon, WalletIcon, ShieldCheckIcon, AlertTriangleIcon, CheckCircleIcon, SparklesIcon, WifiIcon, MicIcon, SearchIcon, ChevronRightIcon, ChevronDownIcon, LinkIcon } from '../components/icons/UiIcons';
import { storageService } from '../services/storageService';
import { TeamSettings } from '../types';

const HelpCenter: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'ECOSYSTEM' | 'GUIDES' | 'FAQ'>('ECOSYSTEM');
    const [selectedGuideRole, setSelectedGuideRole] = useState<'TEAM' | 'REFEREE' | 'LEAGUE' | 'CONFEDERATION'>('TEAM');
    const [settings, setSettings] = useState<TeamSettings | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setSettings(storageService.getTeamSettings());
    }, []);

    // --- DATA: MANUALS & GUIDES ---
    const GUIDES = {
        TEAM: [
            {
                title: 'Gestão de Elenco (Roster)',
                icon: <UsersIcon className="w-5 h-5" />,
                link: '/roster',
                steps: [
                    'Acesse a aba "Elenco" no menu lateral esquerdo.',
                    'Clique no botão "+ Recrutar" no canto superior direito.',
                    'Preencha os dados obrigatórios: Nome, Posição, Número, Peso e Altura.',
                    'Dica Pro: Adicione o link da foto do atleta para gerar a carteirinha digital automaticamente.',
                    'Atenção: O sistema valida a regra de estrangeiros (Max 3 inscritos).'
                ]
            },
            {
                title: 'Planejamento de Treinos',
                icon: <PlayCircleIcon className="w-5 h-5" />,
                link: '/practice',
                steps: [
                    'Vá para "Treinos" e clique em "Novo Treino".',
                    'Defina data, local e foco (ex: Red Zone).',
                    'Na aba "Roteiro", adicione blocos de tempo (Warmup, Indy, Team).',
                    'Use o botão de "Play" para iniciar o cronômetro ao vivo durante o treino.',
                    'Dica Pro: Use a aba "Playbook IA" para pedir sugestões de Drills para posições específicas.'
                ]
            },
            {
                title: 'Financeiro e Mensalidades',
                icon: <WalletIcon className="w-5 h-5" />,
                link: '/finance',
                steps: [
                    'Acesse "Finanças (CFO)".',
                    'Clique em "Criar Recebimento / Rateio" para gerar cobranças em massa.',
                    'Selecione os atletas alvo (Ex: Todo o Ataque) e o valor.',
                    'O sistema gera boletos/pix simulados e monitora quem pagou.',
                    'Dica Pro: Venda equipamentos do estoque na aba "Marketplace" para gerar receita extra.'
                ]
            }
        ],
        REFEREE: [
            {
                title: 'Protocolo Pré-Jogo (Súmula Digital)',
                icon: <ShieldCheckIcon className="w-5 h-5" />,
                link: '/officiating',
                steps: [
                    'Faça login e acesse a aba "Arbitragem".',
                    'Selecione o jogo escalado para você na lista.',
                    'Acesse a aba "1. Pré-Jogo" e realize o checklist obrigatório.',
                    'Verifique: Ambulância (obrigatório aguardar chegada), Marcações de Campo e Água.',
                    'Cronômetro: Se a ambulância não chegar em 30min, o botão "Decretar W.O." ficará disponível conforme regulamento.'
                ]
            },
            {
                title: 'Game Day (Lançamento de Faltas)',
                icon: <FlagIcon className="w-5 h-5" />,
                link: '/officiating',
                steps: [
                    'Na aba "3. Game Day", use a interface de botões grandes.',
                    'Fluxo Rápido: Selecione o Time -> Selecione o Número -> Selecione a Falta.',
                    'Comando de Voz: Clique no microfone e diga "Falta Holding Número 55" para preenchimento automático.',
                    'Dica Pro: O sistema alerta automaticamente se um jogador cometer 2 faltas antidesportivas (Ejeção).'
                ]
            },
            {
                title: 'Finalização e Relatório Jurídico',
                icon: <CheckCircleIcon className="w-5 h-5" />,
                link: '/officiating',
                steps: [
                    'Após o fim do tempo, clique em "Finalizar Jogo & Assinar".',
                    'O placar será enviado para a Federação e a tabela atualizada instantaneamente.',
                    'Se houve expulsões, use a aba "5. Zebra Bot" para gerar o relatório jurídico formal com IA para o tribunal.'
                ]
            }
        ],
        LEAGUE: [
            {
                title: 'War Room (Monitoramento Ao Vivo)',
                icon: <AlertTriangleIcon className="w-5 h-5" />,
                link: '/league',
                steps: [
                    'Acesse "Gestão de Ligas" -> Aba "War Room".',
                    'Visualize todos os jogos acontecendo em tempo real no estado.',
                    'Cards vermelhos indicam alertas críticos (ex: Falta de Ambulância ou Expulsão).',
                    'Clique no jogo para ver a súmula digital ao vivo.'
                ]
            }
        ],
        CONFEDERATION: [
            {
                title: 'BID e Transferências Nacionais',
                icon: <GlobeIcon className="w-5 h-5" />,
                link: '/confederation',
                steps: [
                    'Acesse "Confederação" -> Aba "BID Nacional".',
                    'Visualize solicitações de transferência entre times de diferentes estados.',
                    'Verifique se as taxas foram pagas e clique em "Aprovar".',
                    'O atleta mudará de time automaticamente no banco de dados nacional e o histórico ficará salvo na Auditoria.'
                ]
            }
        ]
    };

    // --- DATA: FAQ ---
    const FAQS = [
        { q: 'O sistema funciona sem internet no campo?', a: 'Sim! O Módulo de Arbitragem possui tecnologia Offline-First (PWA). Você pode lançar faltas sem sinal e o sistema sincroniza automaticamente quando a conexão voltar. Verifique o indicador "Offline" no topo da tela.' },
        { q: 'Como funciona a regra de estrangeiros?', a: 'O sistema permite inscrever até 3 estrangeiros no time, mas bloqueia o check-in de mais de 2 estrangeiros simultâneos na partida (Aba Roster Check), conforme regulamento da FCFA.' },
        { q: 'O que é o vídeo técnico obrigatório?', a: 'É a filmagem aberta do jogo. Deve ser upada na aba "Event Desk" até a quarta-feira seguinte ao jogo para evitar multas automáticas.' },
        { q: 'Como vender ingressos e produtos?', a: 'Vá em "Event Desk", configure os produtos (Ingresso, Bar) e use o PDV para registrar vendas na hora do jogo via Pix ou Cartão. O sistema calcula o fechamento do caixa.' },
        { q: 'Como a IA ajuda o técnico?', a: 'Na aba "Gemini Playbook", você pode pedir "Crie um treino de Redzone para DBs" e a IA gera a lista de exercícios e sugere vídeos de referência.' }
    ];

    const filteredFaqs = FAQS.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-secondary to-primary rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center border-2 border-highlight shadow-glow backdrop-blur-sm">
                            {/* Official FAHUB Logo Construction */}
                            <div className="w-14 h-14 bg-highlight rounded-xl transform -skew-x-6 flex items-center justify-center shadow-[0_0_15px_rgba(0,168,107,0.4)]">
                                <span className="text-white font-black text-2xl transform skew-x-6 tracking-tighter">FH</span>
                            </div>
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 bg-highlight/20 border border-highlight/50 px-3 py-1 rounded-full text-xs font-bold text-highlight mb-2">
                                <BookIcon className="w-4 h-4" /> Central de Conhecimento
                            </div>
                            <h1 className="text-4xl font-black text-white tracking-tight">Manual do Ecossistema</h1>
                            <p className="text-text-secondary mt-2">Documentação oficial, guias operacionais passo-a-passo e suporte.</p>
                        </div>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="w-full md:w-96 relative">
                        <input 
                            type="text" 
                            placeholder="Buscar ajuda (ex: Como lançar falta?)" 
                            className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-highlight focus:outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); if(e.target.value) setActiveTab('FAQ'); }}
                        />
                        <SearchIcon className="absolute left-4 top-3.5 w-5 h-5 text-text-secondary" />
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-center border-b border-white/10 overflow-x-auto">
                <button onClick={() => setActiveTab('ECOSYSTEM')} className={`px-8 py-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'ECOSYSTEM' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}>
                    <SparklesIcon className="w-4 h-4" /> Visão Geral
                </button>
                <button onClick={() => setActiveTab('GUIDES')} className={`px-8 py-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'GUIDES' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}>
                    <BookIcon className="w-4 h-4" /> Manuais por Função
                </button>
                <button onClick={() => setActiveTab('FAQ')} className={`px-8 py-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'FAQ' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}>
                    <AlertTriangleIcon className="w-4 h-4" /> FAQ & Suporte
                </button>
            </div>

            {/* CONTENT: ECOSYSTEM MAP */}
            {activeTab === 'ECOSYSTEM' && (
                <div className="space-y-8 animate-fade-in">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Como os dados fluem no FAHUB?</h2>
                        <p className="text-text-secondary">O sistema conecta todas as pontas em tempo real. Uma ação no campo reflete instantaneamente na gestão.</p>
                    </div>

                    <div className="relative py-10 px-4 max-w-6xl mx-auto">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-1/2 left-20 right-20 h-1 bg-gradient-to-r from-blue-600 via-yellow-500 to-green-600 rounded-full opacity-20 -z-10 transform -translate-y-1/2"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-secondary rounded-2xl border-2 border-blue-500 flex items-center justify-center shadow-lg group-hover:-translate-y-2 transition-transform duration-300 relative z-10">
                                    <UsersIcon className="w-10 h-10 text-blue-400" />
                                    <div className="absolute -top-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">1. Time</div>
                                </div>
                                <h3 className="mt-4 font-bold text-white text-lg">Gestão & Elenco</h3>
                                <p className="text-xs text-text-secondary mt-1 px-2">Cadastra atletas, planeja treinos, gerencia finanças e vende produtos.</p>
                            </div>

                            <div className="flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-secondary rounded-2xl border-2 border-yellow-500 flex items-center justify-center shadow-lg group-hover:-translate-y-2 transition-transform duration-300 relative z-10">
                                    <FlagIcon className="w-10 h-10 text-yellow-400" />
                                    <div className="absolute -top-3 bg-yellow-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">2. Campo</div>
                                </div>
                                <h3 className="mt-4 font-bold text-white text-lg">Arbitragem</h3>
                                <p className="text-xs text-text-secondary mt-1 px-2">App Offline para Súmula Digital, controle de tempo e faltas.</p>
                            </div>

                            <div className="flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-secondary rounded-2xl border-2 border-purple-500 flex items-center justify-center shadow-lg group-hover:-translate-y-2 transition-transform duration-300 relative z-10">
                                    <TrophyIcon className="w-10 h-10 text-purple-400" />
                                    <div className="absolute -top-3 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3. Liga</div>
                                </div>
                                <h3 className="mt-4 font-bold text-white text-lg">Federação</h3>
                                <p className="text-xs text-text-secondary mt-1 px-2">War Room ao vivo, homologação de jogos e Tribunal (TJD).</p>
                            </div>

                            <div className="flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-secondary rounded-2xl border-2 border-green-500 flex items-center justify-center shadow-lg group-hover:-translate-y-2 transition-transform duration-300 relative z-10">
                                    <GlobeIcon className="w-10 h-10 text-green-400" />
                                    <div className="absolute -top-3 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">4. Macro</div>
                                </div>
                                <h3 className="mt-4 font-bold text-white text-lg">Confederação</h3>
                                <p className="text-xs text-text-secondary mt-1 px-2">Inteligência nacional, Seleção Brasileira e BID Imutável.</p>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <Card className="hover:border-red-500/50 transition-colors">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-red-500/10 rounded-lg"><WifiIcon className="w-6 h-6 text-red-400" /></div>
                                <h4 className="font-bold text-white">Modo Offline (PWA)</h4>
                            </div>
                            <p className="text-sm text-text-secondary">O app do árbitro funciona sem internet no campo. Os dados sincronizam automaticamente assim que o sinal volta, garantindo que o jogo nunca pare.</p>
                        </Card>
                        <Card className="hover:border-blue-500/50 transition-colors">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg"><MicIcon className="w-6 h-6 text-blue-400" /></div>
                                <h4 className="font-bold text-white">Comando de Voz</h4>
                            </div>
                            <p className="text-sm text-text-secondary">Árbitros podem lançar faltas apenas falando: "Falta Holding número 55". O sistema entende e preenche a súmula.</p>
                        </Card>
                        <Card className="hover:border-yellow-500/50 transition-colors">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-yellow-500/10 rounded-lg"><SparklesIcon className="w-6 h-6 text-yellow-400" /></div>
                                <h4 className="font-bold text-white">IA Generativa</h4>
                            </div>
                            <p className="text-sm text-text-secondary">Criação de planos de treino, relatórios jurídicos de expulsão e posts de marketing com um clique, usando a tecnologia Gemini.</p>
                        </Card>
                    </div>
                </div>
            )}

            {/* CONTENT: GUIDES */}
            {activeTab === 'GUIDES' && (
                <div className="flex flex-col lg:flex-row gap-8 animate-slide-in">
                    {/* Sidebar Selector */}
                    <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
                        <p className="text-xs font-bold text-text-secondary uppercase mb-2 ml-2">Escolha seu Perfil</p>
                        <button onClick={() => setSelectedGuideRole('TEAM')} className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${selectedGuideRole === 'TEAM' ? 'bg-highlight/20 border-highlight text-white' : 'bg-secondary border-white/5 text-text-secondary hover:text-white'}`}>
                            <span className="font-bold flex items-center gap-2"><FootballIcon className="w-4 h-4"/> Time / Staff</span>
                            {selectedGuideRole === 'TEAM' && <ChevronRightIcon className="w-4 h-4"/>}
                        </button>
                        <button onClick={() => setSelectedGuideRole('REFEREE')} className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${selectedGuideRole === 'REFEREE' ? 'bg-highlight/20 border-highlight text-white' : 'bg-secondary border-white/5 text-text-secondary hover:text-white'}`}>
                            <span className="font-bold flex items-center gap-2"><FlagIcon className="w-4 h-4"/> Arbitragem</span>
                            {selectedGuideRole === 'REFEREE' && <ChevronRightIcon className="w-4 h-4"/>}
                        </button>
                        <button onClick={() => setSelectedGuideRole('LEAGUE')} className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${selectedGuideRole === 'LEAGUE' ? 'bg-highlight/20 border-highlight text-white' : 'bg-secondary border-white/5 text-text-secondary hover:text-white'}`}>
                            <span className="font-bold flex items-center gap-2"><TrophyIcon className="w-4 h-4"/> Federação</span>
                            {selectedGuideRole === 'LEAGUE' && <ChevronRightIcon className="w-4 h-4"/>}
                        </button>
                        <button onClick={() => setSelectedGuideRole('CONFEDERATION')} className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${selectedGuideRole === 'CONFEDERATION' ? 'bg-highlight/20 border-highlight text-white' : 'bg-secondary border-white/5 text-text-secondary hover:text-white'}`}>
                            <span className="font-bold flex items-center gap-2"><GlobeIcon className="w-4 h-4"/> Confederação</span>
                            {selectedGuideRole === 'CONFEDERATION' && <ChevronRightIcon className="w-4 h-4"/>}
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 space-y-6">
                        {GUIDES[selectedGuideRole].map((guide, idx) => (
                            <div key={idx} className="bg-secondary rounded-xl border border-white/5 overflow-hidden shadow-sm hover:border-white/20 transition-all">
                                <div className="bg-white/5 p-4 border-b border-white/5 flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-white flex items-center gap-3">
                                        <div className="p-2 bg-black/30 rounded-lg">{guide.icon}</div>
                                        {guide.title}
                                    </h3>
                                    <button 
                                        onClick={() => navigate(guide.link)}
                                        className="text-xs bg-highlight hover:bg-highlight-hover text-white px-3 py-1.5 rounded flex items-center gap-2 font-bold transition-colors"
                                    >
                                        Acessar Funcionalidade <LinkIcon className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4 relative">
                                        {/* Vertical line connecting steps */}
                                        <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-white/10 -z-10"></div>
                                        
                                        {guide.steps.map((step, sIdx) => (
                                            <div key={sIdx} className="flex gap-4">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary border-2 border-highlight text-highlight flex items-center justify-center font-bold text-xs shadow-glow z-10">
                                                    {sIdx + 1}
                                                </div>
                                                <p className="text-text-secondary text-sm leading-relaxed pt-0.5">
                                                    {step.includes('Dica Pro') ? (
                                                        <span className="block bg-yellow-500/10 text-yellow-200 p-3 rounded border border-yellow-500/20 mt-1">
                                                            <strong className="text-yellow-400 uppercase text-xs tracking-wider">💡 Dica Pro</strong><br/>
                                                            {step.replace('Dica Pro:', '')}
                                                        </span>
                                                    ) : step.includes('Atenção') ? (
                                                        <span className="block bg-red-500/10 text-red-200 p-3 rounded border border-red-500/20 mt-1">
                                                            <strong className="text-red-400 uppercase text-xs tracking-wider">⚠️ Atenção</strong><br/>
                                                            {step.replace('Atenção:', '')}
                                                        </span>
                                                    ) : (
                                                        step
                                                    )}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* CONTENT: FAQ */}
            {activeTab === 'FAQ' && (
                <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
                    {filteredFaqs.length === 0 && (
                        <p className="text-center text-text-secondary italic py-8">Nenhuma resposta encontrada para "{searchQuery}".</p>
                    )}
                    {filteredFaqs.map((faq, idx) => (
                        <details key={idx} className="bg-secondary rounded-xl border border-white/5 group open:border-highlight/50 transition-all">
                            <summary className="flex justify-between items-center p-5 cursor-pointer list-none font-bold text-white group-hover:text-highlight">
                                <span>{faq.q}</span>
                                <ChevronDownIcon className="w-5 h-5 transform group-open:rotate-180 transition-transform" />
                            </summary>
                            <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed border-t border-white/5 pt-3">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                    
                    <div className="mt-8 p-6 bg-blue-900/20 rounded-xl border border-blue-500/20 text-center">
                        <h4 className="font-bold text-white mb-2">Ainda precisa de ajuda?</h4>
                        <p className="text-sm text-text-secondary mb-4">Nossa equipe de suporte está disponível para diretores e presidentes.</p>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg hover:shadow-blue-500/30 transition-all">
                            Abrir Chamado de Suporte
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HelpCenter;
