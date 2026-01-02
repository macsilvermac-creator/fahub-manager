import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Filter, Download, 
  User, CheckCircle2, AlertCircle, Clock,
  MessageSquare, MoreHorizontal, DollarSign
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';

/** * GESTÃO DE RECEBÍVEIS - PROTOCOLO FAHUB
 * Focado em Mensalidades de Atletas, Sócios e Receitas de Patrocínio.
 */

const FinanceReceivables: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock de dados operacionais para validação de fluxo
  const receivables = [
    { id: 1, member: 'Carlos Oliveira', ref: 'Mensalidade Jan/26', value: 'R$ 150,00', status: 'PAID', method: 'PIX', date: '01/01/2026' },
    { id: 2, member: 'Bruno Silva', ref: 'Mensalidade Jan/26', value: 'R$ 150,00', status: 'PENDING', method: 'BOLETO', date: '05/01/2026' },
    { id: 3, member: 'Rafael Santos', ref: 'Anuidade 2026', value: 'R$ 1.200,00', status: 'OVERDUE', method: 'CARTÃO', date: '20/12/2025' },
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR PADRÃO RESTAURADA */}
      <aside className="w-64 bg-[#0a0f1e] border-r border-white/5 flex flex-col shadow-2xl">
        <div className="p-8">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/20 mb-4 flex items-center justify-center">
            <DollarSign size={24} className="text-white" />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] italic text-slate-500">Módulo Financeiro</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => navigate('/financeiro')} 
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-white font-bold italic text-xs uppercase hover:bg-white/10 transition-all border border-white/5"
          >
            <ArrowLeft size={18} /> Dashboard Master
          </button>
          <div className="pt-6 pb-2 px-4 text-[9px] font-black uppercase text-slate-600 tracking-widest italic">Controle de Receita</div>
          <SidebarLink icon={User} label="Base de Sócios" />
          <SidebarLink icon={Download} label="Gerar Boletos" />
          <SidebarLink icon={Filter} label="Inadimplência" />
        </nav>
        <div className="p-6 border-t border-white/5">
           <button onClick={() => navigate('/')} className="flex items-center gap-4 text-slate-500 hover:text-white transition-colors group">
              <span className="text-[10px] font-black uppercase tracking-widest italic group-hover:text-emerald-500 transition-colors">← Nexus Portal</span>
           </button>
        </div>
      </aside>

      {/* PAINEL OPERACIONAL */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="p-8 border-b border-white/5 bg-[#0a0f1e]/50 backdrop-blur-md flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">Contas a <span className="text-emerald-500">Receber</span></h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic mt-1">Fluxo de Caixa de Entrada & Mensalidades</p>
          </div>
          <div className="flex gap-4">
             <div className="flex bg-black/40 border border-white/10 rounded-xl px-4 py-2 items-center gap-3">
                <Search size={16} className="text-slate-500" />
                <input 
                  placeholder="Buscar membro..." 
                  className="bg-transparent border-none outline-none text-[10px] font-bold w-40 text-white"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
             <button className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-xl font-black italic text-xs uppercase shadow-lg shadow-emerald-500/20 transition-all">
                Nova Cobrança
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {/* TABELA DE MEMBROS E STATUS */}
          <div className="bg-[#0a0f1e] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[9px] font-black uppercase text-slate-500 tracking-widest italic">
                  <th className="px-8 py-6">Atleta / Referência</th>
                  <th className="px-8 py-6">Data Ref</th>
                  <th className="px-8 py-6">Valor</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {receivables.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                          <User size={14} className="text-slate-500" />
                        </div>
                        <div>
                          <div className="font-black italic text-white uppercase tracking-tight">{item.member}</div>
                          <div className="text-[9px] text-slate-500 uppercase font-bold">{item.ref} • {item.method}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-mono text-xs text-slate-500">{item.date}</td>
                    <td className="px-8 py-6 font-black italic text-white text-lg">{item.value}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {item.status === 'PAID' ? (
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        ) : item.status === 'OVERDUE' ? (
                          <AlertCircle size={16} className="text-red-500 animate-pulse" />
                        ) : (
                          <Clock size={16} className="text-orange-500" />
                        )}
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          item.status === 'PAID' ? 'text-emerald-500' : 
                          item.status === 'OVERDUE' ? 'text-red-500' : 'text-orange-500'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-white/5 rounded-lg hover:bg-emerald-500/20 text-emerald-400 border border-white/5 transition-all shadow-sm" title="Notificar via WhatsApp">
                          <MessageSquare size={18} />
                        </button>
                        <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-slate-400 border border-white/5 transition-all">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* INDICADORES DE PERFORMANCE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-3xl p-6">
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1 italic">Recebido (Mês)</p>
                <p className="text-2xl font-black italic text-emerald-400 tracking-tighter">R$ 15.420,00</p>
             </div>
             <div className="bg-orange-900/10 border border-orange-500/20 rounded-3xl p-6">
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1 italic">Pendente</p>
                <p className="text-2xl font-black italic text-orange-400 tracking-tighter">R$ 3.200,00</p>
             </div>
             <div className="bg-red-900/10 border border-red-500/20 rounded-3xl p-6">
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1 italic">Taxa de Inadimplência</p>
                <p className="text-2xl font-black italic text-red-400 tracking-tighter">12.4%</p>
             </div>
          </div>
        </div>
      </main>

      <JulesAgent context="FINANCE" />
    </div>
  );
};

// Componente Interno Sidebar
const SidebarLink = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-slate-500 hover:text-white transition-all">
    <Icon size={18} />
    <span className="text-[10px] font-black uppercase tracking-widest italic">{label}</span>
  </button>
);

export default FinanceReceivables;