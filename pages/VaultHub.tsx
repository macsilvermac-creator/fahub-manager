import React from 'react';
import PageHeader from '@/components/PageHeader';
import { QrcodeIcon, LinkIcon, CheckCircleIcon, WalletIcon, BusIcon, TrophyIcon, ActivityIcon } from '@/components/icons/UiIcons';
import { useToast } from '@/contexts/ToastContext';

const VaultHub: React.FC = () => {
    const toast = useToast();

    const PaymentCard = ({ title, amount, icon: Icon, type }: { title: string, amount: string, icon: any, type: string }) => (
        <div className="bg-black/40 rounded-[2.5rem] border border-white/5 p-6 flex flex-col group hover:border-highlight/40 transition-all shadow-xl">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-2xl text-text-secondary group-hover:text-highlight transition-colors">
                    <Icon className="w-6 h-6" />
                </div>
                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-full">{type}</span>
            </div>
            
            <div className="mb-6 text-center">
                <div className="bg-white p-3 rounded-2xl inline-block shadow-inner mb-4 relative overflow-hidden group-hover:scale-105 transition-transform">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=PAYMENT-${title}`} alt="QR Code" className="w-24 h-24" />
                    <div className="absolute inset-0 bg-highlight/10 animate-pulse pointer-events-none"></div>
                </div>
                <h4 className="text-white font-black uppercase italic text-sm truncate">{title}</h4>
                <p className="text-highlight font-mono font-bold text-xl mt-1">R$ {amount}</p>
            </div>

            <div className="space-y-2">
                <button 
                    onClick={() => { navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX..."); toast.success("Código PIX copiado!"); }}
                    className="w-full py-2.5 bg-highlight/10 hover:bg-highlight text-highlight hover:text-white rounded-xl text-[9px] font-black uppercase transition-all flex items-center justify-center gap-2"
                >
                    <QrcodeIcon className="w-3 h-3" /> Pix Copie e Cola
                </button>
                <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] font-black uppercase transition-all border border-white/5 flex items-center justify-center gap-2">
                    <LinkIcon className="w-3 h-3" /> Link de Pagamento (Banco)
                </button>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden">
            <PageHeader title="Vault Hub" subtitle="Acesso e regularidade financeira da sua carreira." />

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
                {/* LEFT: ACTION CONTAINER */}
                <div className="bg-secondary/30 rounded-[3rem] border border-white/5 p-8 flex flex-col overflow-hidden shadow-2xl">
                    <h3 className="text-xs font-black text-text-secondary uppercase tracking-[0.4em] mb-6 px-2">Ações Pendentes</h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                        <div className="grid grid-cols-2 gap-4">
                            <PaymentCard title="Mensalidade Outubro" amount="150,00" icon={WalletIcon} type="Mensalidade" />
                            <PaymentCard title="Inscrição Catarinense" amount="80,00" icon={TrophyIcon} type="Taxa" />
                            <PaymentCard title="Transporte Timbó" amount="120,00" icon={BusIcon} type="Viagem" />
                            <PaymentCard title="Novo Capacete (Clube)" amount="450,00" icon={ActivityIcon} type="Loja" />
                        </div>
                    </div>
                </div>

                {/* RIGHT: HISTORY CONTAINER */}
                <div className="bg-secondary/30 rounded-[3rem] border border-white/5 p-8 flex flex-col overflow-hidden shadow-2xl">
                    <div className="flex justify-between items-center mb-6 px-2">
                        <h3 className="text-xs font-black text-text-secondary uppercase tracking-[0.4em]">Payment History</h3>
                        <span className="text-[10px] text-highlight font-black uppercase">Roster Eligible</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {[1,2,3,4,5,6,7,8].map(i => (
                            <div key={i} className="bg-black/20 rounded-2xl p-4 border border-white/5 flex items-center justify-between group hover:bg-black/40 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-highlight/10 rounded-xl flex items-center justify-center">
                                        <CheckCircleIcon className="w-5 h-5 text-highlight" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold uppercase text-xs">Mensalidade Setembro</h4>
                                        <p className="text-[9px] text-text-secondary uppercase tracking-widest mt-0.5">Confirmado em 05/09/2023</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-black text-sm italic">R$ 150,00</p>
                                    <button className="text-[8px] font-black text-highlight uppercase tracking-widest hover:underline mt-1">Download PDF</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VaultHub;