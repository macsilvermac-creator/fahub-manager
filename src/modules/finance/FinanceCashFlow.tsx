import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Landmark, Upload, Download, 
  TrendingUp, TrendingDown, RefreshCw, FileCheck
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';

/** * FLUXO DE CAIXA OPERACIONAL - PROTOCOLO FAHUB
 * Interface de Conciliação Bancária com Sidebar Padrão.
 */

const FinanceCashFlow: React.FC = () => {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR PADRÃO FAHUB */}
      <aside className="w-64 bg-[#0a0f1e] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-8">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl shadow-lg mb-4 flex items-center justify-center shadow-emerald-500/20">
            <Landmark size={24} className="text-white" />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-widest italic text-slate-500">Fluxo de Caixa</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => navigate('/financeiro')} 
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-white font-bold italic text-xs uppercase border border-white/5 hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={18} /> Dashboard Master
          </button>
          <div className="pt-6 pb-2 px-4 text-[9px] font-black uppercase text-slate-600 tracking-widest italic">Operações de Banco</div>
          <SidebarLink icon={Upload} label="Importar OFX" />
          <SidebarLink icon={FileCheck} label="Conciliação" />
          <SidebarLink icon={Download} label="Relatório Diário" />
        </nav>
      </aside>

      {/* ÁREA DE CONTEÚDO */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="p-8 border-b border-white/5 bg-[#0a0f1e]/50 backdrop-blur-md flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">Fluxo de <span className="text-emerald-500">Caixa</span></h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic mt-1 font-sans">Sincronização e Auditoria Bancária</p>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={handleSync}
               className={`bg-white/5 border border-white/10 px-6 py-2 rounded-xl font-black italic text-xs uppercase flex items-center gap-2 transition-all ${isSyncing ? 'animate-pulse text-emerald-500' : ''}`}
             >
                <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
                {isSyncing ? 'Sincronizando...' : 'Sincronizar Banco'}
             </button>
          </div>
        </header>

        <div className="flex-1 p-8 space-y-6 overflow-y-auto custom-scrollbar">
          {/* CARDS DE LIQUIDEZ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatusCard icon={TrendingUp} label="Entradas (Mês)" value="R$ 15.420,00" color="text-emerald-500" />
            <StatusCard icon={TrendingDown} label="Saídas (Mês)" value="R$ 4.320,00" color="text-red-500" />
            <StatusCard icon={Landmark} label="Saldo em Conta" value="R$ 42.150,00" color="text-white" />
          </div>

          {/* ÁREA DE IMPORTAÇÃO/CONCILIAÇÃO */}
          <div className="flex-1 bg-[#0a0f1e] border-2 border-dashed border-white/10 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center group hover:border-emerald-500/30 transition-all min-h-[300px]">
             <div className="p-6 bg-white/5 rounded-full mb-6 group-hover:scale-110 transition-transform border border-white/5">
                <Upload size={48} className="text-emerald-500" />
             </div>
             <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">Importar Extrato OFX</h3>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest max-w-xs leading-relaxed italic">
                Acesse o internet banking, exporte o arquivo OFX e arraste-o aqui para conciliar os lançamentos automaticamente.
             </p>
          </div>
        </div>
      </main>

      <JulesAgent context="FINANCE" />
    </div>
  );
};

const SidebarLink = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-slate-500 hover:text-white transition-all italic">
    <Icon size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const StatusCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <div className="bg-[#0a0f1e] border border-white/5 p-6 rounded-3xl flex items-center gap-6 shadow-xl">
    <div className="p-4 bg-white/5 rounded-2xl border border-white/5"><Icon size={24} className={color} /></div>
    <div>
      <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1 italic">{label}</p>
      <p className={`text-2xl font-black italic tracking-tighter ${color}`}>{value}</p>
    </div>
  </div>
);

export default FinanceCashFlow;