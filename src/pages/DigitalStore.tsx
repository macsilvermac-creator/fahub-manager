
import React, { useState, useEffect } from 'react';
import { DigitalProduct, Entitlement } from '../types';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { TrophyIcon, BriefcaseIcon } from '../components/icons/NavIcons';
import { LockIcon, CheckCircleIcon, SparklesIcon, CloudIcon, ShieldCheckIcon, WalletIcon } from '../components/icons/UiIcons';
import PaymentModal from '../components/PaymentModal';
import { useToast } from '../contexts/ToastContext';

// Catálogo Fixo de Serviços FAHUB (SaaS Features)
const FAHUB_SERVICES: DigitalProduct[] = [
    {
        id: 'srv-scout-ai',
        title: 'FAHUB Intelligence Suite',
        description: 'Desbloqueie o poder total do Gemini 2.5 Pro para análise de vídeo automática, predição de jogadas em tempo real e relatórios de scout detalhados.',
        price: 149.90,
        type: 'SCOUT_REPORT',
        durationHours: 720, // 30 dias
        coverUrl: '' 
    },
    {
        id: 'srv-video-cloud',
        title: 'Video Cloud 4K (1TB)',
        description: 'Armazenamento de alta performance para seus jogos. Upload sem compressão, streaming adaptativo para os atletas e ferramenta de corte ilimitada.',
        price: 89.90,
        type: 'GAME_VIDEO',
        durationHours: 720, // 30 dias
        coverUrl: ''
    },
    {
        id: 'srv-national-db',
        title: 'Acesso Scout Nacional',
        description: 'Visualize dados avançados de atletas de outros estados. Ideal para recrutamento e preparação para torneios nacionais.',
        price: 199.00,
        type: 'DOCUMENT',
        durationHours: 2160, // 3 meses (Temporada)
        coverUrl: ''
    },
    {
        id: 'srv-academy-pro',
        title: 'Academy Pro (Certificação)',
        description: 'Libera acesso a todos os cursos técnicos avançados para sua comissão técnica e certificação oficial da Confederação.',
        price: 299.00,
        type: 'COURSE',
        durationHours: 8760, // 1 ano
        coverUrl: ''
    }
];

const DigitalStore: React.FC = () => {
    const toast = useToast();
    const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
    const [balance, setBalance] = useState(0); // Créditos do time no sistema

    // Purchase State
    const [selectedService, setSelectedService] = useState<DigitalProduct | null>(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    const user = authService.getCurrentUser();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        if (user) {
            // Load Active Subscriptions
            const allEntitlements = storageService.getEntitlements();
            const myEntitlements = allEntitlements.filter(e => e.userId === user.id && new Date(e.expiresAt) > new Date());
            setEntitlements(myEntitlements);

            // Mock Credits Balance
            setBalance(450.00); 
        }
    };

    const handleContractClick = (service: DigitalProduct) => {
        setSelectedService(service);
        setIsPaymentOpen(true);
    };

    const handlePaymentSuccess = () => {
        if (user && selectedService) {
            storageService.purchaseDigitalProduct(user.id, selectedService);
            toast.success(`Serviço "${selectedService.title}" ativado com sucesso!`);
            setIsPaymentOpen(false);
            setSelectedService(null);
            loadData(); // Refresh active services
        }
    };

    const getActiveSubscription = (serviceId: string) => {
        return entitlements.find(e => e.productId === serviceId);
    };

    const getIconForService = (id: string) => {
        switch(id) {
            case 'srv-scout-ai': return <SparklesIcon className="w-10 h-10 text-purple-400" />;
            case 'srv-video-cloud': return <CloudIcon className="w-10 h-10 text-blue-400" />;
            case 'srv-national-db': return <ShieldCheckIcon className="w-10 h-10 text-green-400" />;
            case 'srv-academy-pro': return <TrophyIcon className="w-10 h-10 text-yellow-400" />;
            default: return <BriefcaseIcon className="w-10 h-10 text-gray-400" />;
        }
    };

    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            {/* Header / Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-indigo-900 rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-highlight/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/50 px-3 py-1 rounded-full text-xs font-bold text-indigo-300 mb-2">
                            <SparklesIcon className="w-3 h-3" /> FAHUB Premium Services
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Marketplace de Serviços</h1>
                        <p className="text-indigo-200 mt-2 max-w-xl text-sm md:text-base">
                            Potencialize sua gestão contratando módulos adicionais de inteligência, infraestrutura e dados exclusivos fornecidos pelo FAHUB.
                        </p>
                    </div>
                    
                    <div className="bg-black/30 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-4">
                        <div>
                            <p className="text-[10px] text-text-secondary uppercase font-bold text-right">Créditos Disponíveis</p>
                            <p className="text-2xl font-mono font-bold text-green-400">R$ {balance.toFixed(2)}</p>
                        </div>
                        <div className="p-3 bg-green-500/20 rounded-xl">
                            <WalletIcon className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Subscriptions Summary */}
            {entitlements.length > 0 && (
                <div className="animate-slide-in">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" /> Seus Serviços Ativos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {entitlements.map(entitlement => {
                            const service = FAHUB_SERVICES.find(s => s.id === entitlement.productId);
                            if (!service) return null;
                            const daysLeft = Math.ceil((new Date(entitlement.expiresAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                            
                            return (
                                <div key={entitlement.id} className="bg-green-900/10 border border-green-500/30 p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500/20 rounded-lg">
                                            {getIconForService(service.id)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{service.title}</p>
                                            <p className="text-xs text-green-300">Expira em {daysLeft} dias</p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Service Catalog Grid */}
            <div>
                <h3 className="text-lg font-bold text-white mb-6">Catálogo de Upgrades</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {FAHUB_SERVICES.map(service => {
                        const activeSub = getActiveSubscription(service.id);
                        
                        return (
                            <div key={service.id} className={`group bg-secondary hover:bg-secondary/80 rounded-2xl border ${activeSub ? 'border-green-500/30' : 'border-white/5'} overflow-hidden transition-all hover:-translate-y-1 hover:shadow-glow flex flex-col h-full relative`}>
                                {activeSub && (
                                    <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">
                                        ATIVO
                                    </div>
                                )}
                                
                                <div className="p-6 flex-1">
                                    <div className="mb-4">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${activeSub ? 'bg-green-500/10' : 'bg-black/30'}`}>
                                            {getIconForService(service.id)}
                                        </div>
                                        <h3 className="text-xl font-bold text-white leading-tight mb-2">{service.title}</h3>
                                        <p className="text-xs text-text-secondary leading-relaxed">{service.description}</p>
                                    </div>

                                    <div className="bg-black/20 rounded-lg p-3 mb-4">
                                        <p className="text-[10px] text-text-secondary uppercase font-bold mb-1">Incluso no pacote:</p>
                                        <ul className="text-xs text-gray-300 space-y-1">
                                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-highlight rounded-full"></div> Acesso Imediato</li>
                                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-highlight rounded-full"></div> Suporte Prioritário</li>
                                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-highlight rounded-full"></div> Updates Automáticos</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="p-6 pt-0 mt-auto border-t border-white/5">
                                    <div className="flex justify-between items-end mb-4 pt-4">
                                        <div>
                                            <p className="text-xs text-text-secondary">A partir de</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-lg font-bold text-white">R$</span>
                                                <span className="text-2xl font-black text-white">{service.price.toFixed(0)}</span>
                                                <span className="text-xs text-text-secondary">,{service.price.toFixed(2).split('.')[1]}</span>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold bg-white/5 px-2 py-1 rounded text-text-secondary">
                                            {service.durationHours > 720 ? 'Anual' : 'Mensal'}
                                        </span>
                                    </div>

                                    {activeSub ? (
                                        <button 
                                            disabled
                                            className="w-full bg-green-600/20 border border-green-500/30 text-green-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-default"
                                        >
                                            <CheckCircleIcon className="w-4 h-4" /> Contratado
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleContractClick(service)}
                                            className="w-full bg-highlight hover:bg-highlight-hover text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            Contratar Agora
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* PAYMENT MODAL */}
            <PaymentModal 
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                onSuccess={handlePaymentSuccess}
                amount={selectedService?.price || 0}
                description={selectedService ? `Contratação: ${selectedService.title} (${selectedService.durationHours / 24} dias)` : 'Serviço FAHUB'}
            />
        </div>
    );
};

export default DigitalStore;