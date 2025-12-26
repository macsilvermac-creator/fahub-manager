import React from 'react';
import PageHeader from '@/components/PageHeader';
import { QrcodeIcon, LinkIcon, CheckCircleIcon, WalletIcon, BusIcon, TrophyIcon, ActivityIcon } from '@/components/icons/UiIcons';
import { useToast } from '@/contexts/ToastContext';

const VaultHub: React.FC = () => {
    const toast = useToast();

    const PaymentCard = ({ title, amount, icon: Icon, type }: { title: string, amount: string, icon: any, type: string }) => (
        <div className="bg-black/40 rounded-[2rem] border border-white/5 p-5 flex flex-col group hover:border-highlight/40 transition-all shadow-xl">
            <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 bg-white/5 rounded-xl text-text-secondary group-hover:text-highlight transition-colors">
                    <Icon className="w-5 h-5" />
                </div>
                <span className="text-[7px] font-black text-white/30 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full">{type}</span>
            </div>
            
            <div className="mb-4 text-center">
                <div className="bg-white p-2.5 rounded-xl inline-block shadow-inner mb-3 relative overflow-hidden group-hover:scale-105 transition-transform">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=PAYMENT-${title}`} alt="QR Code" className="w-20 h-20" />
                    <div className="absolute inset-0 bg-highlight/5 animate-pulse pointer-events-none"></div>
                </div>
                <h4 className="text-white font-black uppercase italic text-[11px] truncate leading-tight">{title}</h4>
                <p className="text-highlight font-mono font-bold text-lg mt-0.5 leading-none">R$ {amount}</p>
            </div>

            <div className="space-y-1.5 mt-auto">
                <button 
                    onClick={() => { navigator.clipboard.writeText("PIX_CODE_HERE"); toast.success("PIX copiado!"); }}
                    className="w-full py-2 bg-highlight/10 hover:bg-highlight text-highlight hover:text-white rounded-lg text-[8px] font-black uppercase transition-all flex items-center justify-center gap-2"
                >
                    <QrcodeIcon className="w-2.5 h-2.5" /> Pix Copie/Cola
                </button>
                <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[8px] font-black uppercase transition-all border border-white/5 flex items-center justify-center gap-2">
                    <LinkIcon className="w-2.5 h-2.5" /> Link Direto
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-4 animate-fade-in">
            <PageHeader title="Vault Hub" subtitle="Controle financeiro de alta performance." />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* LEFT: ACTIONS */}
                <div className="bg-secondary/20 rounded-[2.5rem] border border-white/5 p-6 flex flex-col shadow-2xl">
                    <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] mb-4 px-1">Ações Pendentes</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <PaymentCard title="Mensalidade Outubro" amount="150,00" icon={WalletIcon} type="Regular" />
                        <PaymentCard title="Inscrição Torneio" amount="80,00" icon={TrophyIcon} type="Taxa" />
                        <PaymentCard title="Transporte Jogos" amount="120,00" icon={BusIcon} type="Viagem" />
                        <PaymentCard title="Store: Jersey 2024" amount="450,00" icon={ActivityIcon} type="Compra" />
                    </div>
                </div>

                {/* RIGHT: HISTORY */}
                <div className="bg-secondary/20 rounded-[2.5rem] border border-white/5 p-6 flex flex-col shadow-2xl">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em]">Payment History</h3>
                        <span className="text-[9px] text-highlight font-black uppercase tracking-widest">Elegível</span>
                    </div>
                    <div className="space-y-2">
                        {[1,2,3,4,5,6,7,8,9,10].map(i => (
                            <div key={i} className="bg-black/20 rounded-2xl p-3.5 border border-white/5 flex items-center justify-between group hover:bg-black/40 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-highlight/10 rounded-lg flex items-center justify-center">
                                        <CheckCircleIcon className="w-4 h-4 text-highlight" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold uppercase text-[10px] leading-none">Mensalidade {i}</h4>
                                        <p className="text-[7px] text-text-secondary uppercase tracking-widest mt-1 opacity-50">Confirmado</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-black text-xs italic leading-none">R$ 150,00</p>
                                    <button className="text-[7px] font-black text-highlight uppercase mt-1 hover:underline">Recibo PDF</button>
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