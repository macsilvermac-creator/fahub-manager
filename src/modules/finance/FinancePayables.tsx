import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Filter, Search, Calendar, 
  FileText, CheckCircle2, AlertCircle, 
  Clock, ExternalLink, MoreVertical
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';

/** * TESOURARIA DE SAÍDA - PROTOCOLO FAHUB
 * Interface para autorização de pagamentos e gestão de fornecedores.
 */

const FinancePayables: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');

  const payables = [
    { id: 1, provider: 'Federação Catarinense', desc: 'Taxa de Inscrição Campeonato', value: 'R$ 1.500,00', dueDate: '10/01/2026', status: 'PENDING', priority: 'HIGH' },
    { id: 2, provider: 'Arena Joinville', desc: 'Aluguel de Campo - Janeiro', value: 'R$ 800,00', dueDate: '15/01/2026', status: 'AUTHORIZED', priority: 'MEDIUM' },
    { id: 3, provider: 'Riddell Sports', desc: 'Importação de Faceguards', value: 'R$ 2.020,00', dueDate: '05/01/2026', status: 'OVERDUE', priority: 'CRITICAL' },
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR PADRÃO RESTAURADA */}
      <aside className="w-64 bg-[#0a0f1e] border-r border-white/5 flex flex-col">
        <div className="p-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 mb-4"></div>
          <h2 className="text-xs font-black uppercase tracking-[0.3em] italic text-slate-500">Módulo Financeiro</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => navigate('/financeiro')} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-white font-bold italic text-xs uppercase">
            <ArrowLeft size={18} /> Dashboard Master
          </button>
          <div className="pt-4 pb-2 px-4 text-[9px] font-black uppercase text-slate-600 tracking-widest">Operacional</div>
          <SidebarLink icon={Calendar} label="Calendário Pgto" />
          <SidebarLink icon={FileText} label="Notas Fiscais" />
          <SidebarLink icon={Search} label="Busca Avançada" />
        </nav>
        <div className="p-6 border-t border-white/5">
           <button onClick={() => navigate('/')} className="flex items-center gap-4 text-slate-500 hover:text-white transition-colors">
              <span className="text-[10px] font-black uppercase tracking-widest">Nexus Portal</span>
           </button>
        </div>
      </aside>

      {/* ÁREA OPERACIONAL */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="p-8 border-b border-white/5 flex justify-between items-center bg-[#0a0f1e]/50 backdrop-blur">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black italic uppercase tracking-tighter">Contas a <span className="text-red-500">Pagar</span></h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Execução de Tesouraria & Autorizações</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="flex bg-black/40 border border-white/10 rounded-xl px-4 py-2 items-center gap-3">
                <Filter size={16} className="text-slate-500" />
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-transparent border-none outline-none text-[10px] font-black uppercase italic text-slate-300"
                >
                  <option value="ALL">Todas as Contas</option>
                  <option value="PENDING">Pendentes</option>
                  <option value="OVERDUE">Atrasadas</option>
                </select>
             </div>
             <button className="bg-red-600 hover:bg-red-500 px-6 py-2 rounded-xl font-black italic text-xs uppercase shadow-lg shadow-red-500/20 transition-all">
                Novo Lançamento
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="bg-[#0a0f1e] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[9px] font-black uppercase text-slate-500 tracking-widest italic">
                  <th className="px-8 py-6">Fornecedor / Descrição</th>
                  <th className="px-8 py-6">Vencimento</th>
                  <th className="px-8 py-6">Valor</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {payables.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-black italic text-white uppercase tracking-tight">{item.provider}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{item.desc}</div>
                    </td>
                    <td className="px-8 py-6 font-mono text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className={item.status === 'OVERDUE' ? 'text-red-500' : 'text-slate-600'} />
                        {item.dueDate}
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black italic text-white text-lg">{item.value}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {item.status === 'AUTHORIZED' ? (
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        ) : (
                          <AlertCircle size={16} className={item.status === 'OVERDUE' ? 'text-red-500 animate-pulse' : 'text-orange-500'} />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-white/5 rounded-lg hover:bg-emerald-500/20 text-emerald-400 border border-white/5 transition-all">
                          <CheckCircle2 size={18} />
                        </button>
                        <button className="p-2 bg-white/5 rounded-lg hover:bg-blue-500/20 text-blue-400 border border-white/5 transition-all">
                          <ExternalLink size={18} />
                        </button>
                        <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-slate-400 border border-white/5 transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-2 bg-blue-900/10 border border-blue-500/20 rounded-3xl p-6 flex items-start gap-4">
                <AlertCircle className="text-blue-400 flex-shrink-0" size={24} />
                <div>
                   <h4 className="text-xs font-black uppercase italic text-blue-400 mb-1">Atenção da Diretoria</h4>
                   <p className="text-[10px] text-slate-400 leading-relaxed font-bold">
                      Existem registros de atraso que requerem ação imediata para evitar multas contratuais.
                   </p>
                </div>
             </div>
             <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-3xl p-6 flex flex-col justify-center text-center">
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 italic">Autorizado Hoje</p>
                <p className="text-2xl font-black italic text-emerald-400">R$ 800,00</p>
             </div>
          </div>
        </div>
      </main>

      <JulesAgent context="FINANCE" />
    </div>
  );
};

const SidebarLink = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-slate-500 hover:text-white transition-all">
    <Icon size={18} />
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default FinancePayables;
