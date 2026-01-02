import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Wallet, Shield, Plus, 
  Search, Box, Tag, ClipboardList
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';

const FinancePatrimony: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
      
      <aside className="w-64 bg-[#0a0f1e] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-8">
          <div className="w-12 h-12 bg-purple-600 rounded-2xl shadow-lg mb-4 flex items-center justify-center">
            <Wallet size={24} className="text-white" />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-widest italic text-slate-500">Bens & Ativos</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => navigate('/financeiro')} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-white font-bold italic text-xs uppercase border border-white/5 hover:bg-white/10 transition-all">
            <ArrowLeft size={18} /> Dashboard Master
          </button>
          <div className="pt-6 pb-2 px-4 text-[9px] font-black uppercase text-slate-600 tracking-widest italic">Controle Físico</div>
          <SidebarLink icon={Box} label="Equipamentos" />
          <SidebarLink icon={Tag} label="Tombamento" />
          <SidebarLink icon={ClipboardList} label="Relatório Depreciação" />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="p-8 border-b border-white/5 bg-[#0a0f1e]/50 backdrop-blur-md flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">Patrimônio & <span className="text-purple-500">Bens</span></h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic mt-1 font-sans">Inventário de Ativos Físicos e Tecnológicos</p>
          </div>
          <button className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-xl font-black italic text-xs uppercase shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2">
            <Plus size={16} /> Novo Ativo
          </button>
        </header>

        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0a0f1e] border border-white/5 p-8 rounded-[2.5rem] flex justify-between items-center shadow-xl">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1 italic">Avaliação Total do Clube</p>
                <p className="text-4xl font-black italic tracking-tighter text-white font-sans">R$ 158.000,00</p>
              </div>
              <Shield size={48} className="text-purple-500 opacity-30" />
            </div>
            <div className="bg-[#0a0f1e] border border-white/5 p-8 rounded-[2.5rem] flex justify-between items-center shadow-xl">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1 italic">Itens sob Custódia</p>
                <p className="text-4xl font-black italic tracking-tighter text-white font-sans">412 <span className="text-xs text-slate-500 uppercase">Unidades</span></p>
              </div>
              <Box size={48} className="text-blue-500 opacity-30" />
            </div>
          </div>

          <div className="flex-1 bg-[#0a0f1e] border border-white/5 rounded-[2.5rem] overflow-hidden">
            <div className="p-6 bg-white/5 flex justify-between items-center border-b border-white/5">
              <h3 className="text-[10px] font-black uppercase italic tracking-widest italic">Ativos Registrados</h3>
              <div className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 flex items-center gap-2">
                <Search size={14} className="text-slate-500" />
                <input placeholder="Buscar bem..." className="bg-transparent border-none outline-none text-[10px] font-bold italic" />
              </div>
            </div>
            <div className="p-20 flex flex-col items-center justify-center text-center opacity-30">
               <Shield size={64} className="text-slate-600 mb-4" />
               <p className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-relaxed">Aguardando Importação de Inventário <br/> Módulo de Bens em Standby</p>
            </div>
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

export default FinancePatrimony;