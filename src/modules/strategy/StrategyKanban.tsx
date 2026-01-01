import React from 'react';
import { ArrowLeft, Plus, MoreVertical, MessageSquare, AlertCircle, Columns3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StrategyKanban: React.FC = () => {
  const navigate = useNavigate();

  // Dados simulados para garantir a estrutura sólida de metas OKR
  const columns = [
    { id: 'todo', title: 'A FAZER', color: 'bg-slate-100' },
    { id: 'doing', title: 'EM EXECUÇÃO', color: 'bg-blue-50' },
    { id: 'done', title: 'CONCLUÍDO', color: 'bg-emerald-50' }
  ];

  const cards = [
    { 
      id: 1, 
      column: 'doing', 
      title: 'Expansão Base Sub-17', 
      tag: 'Crescimento', 
      progress: 60,
      responsible: 'HC Base'
    },
    { 
      id: 2, 
      column: 'todo', 
      title: 'Parceria Fisioterapia', 
      tag: 'Saúde', 
      progress: 0,
      responsible: 'Dir. Esportes'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra de Navegação Superior */}
      <nav className="bg-white border-b border-slate-200 p-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-blue-600 transition-all"
          >
            <ArrowLeft size={16} /> Voltar ao Dash
          </button>
          <div className="flex items-center gap-2">
            <Columns3 size={18} className="text-blue-600" />
            <h1 className="text-sm font-black text-slate-800 tracking-tighter italic uppercase">Evolução Estratégica</h1>
          </div>
          <button className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all">
            <Plus size={20} />
          </button>
        </div>
      </nav>

      {/* Grid do Kanban - Responsivo com Scroll Horizontal */}
      <main className="p-4 md:p-8 overflow-x-auto">
        <div className="flex gap-6 min-w-[1000px] md:min-w-full">
          {columns.map(col => (
            <div key={col.id} className="flex-1 flex flex-col gap-4">
              <div className={`p-4 rounded-3xl ${col.color} border border-slate-200/50 flex items-center justify-between shadow-sm`}>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{col.title}</span>
                <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-400 border border-slate-100">
                  {cards.filter(c => c.column === col.id).length}
                </span>
              </div>

              <div className="space-y-4">
                {cards.filter(c => c.column === col.id).map(card => (
                  <div key={card.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-md hover:shadow-xl transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg uppercase tracking-wider italic">
                        {card.tag}
                      </span>
                      <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={16} /></button>
                    </div>
                    
                    <h4 className="text-sm font-black text-slate-800 leading-tight mb-4 group-hover:text-blue-600 transition-colors">{card.title}</h4>
                    
                    {/* Indicador de Progresso */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Status</span>
                        <span>{card.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden border border-slate-100">
                        <div className="bg-blue-600 h-full transition-all duration-700" style={{ width: `${card.progress}%` }} />
                      </div>
                    </div>

                    {/* Rodapé do Card */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-[8px] font-black text-white italic">
                          {card.responsible.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{card.responsible}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <MessageSquare size={14} />
                        <span className="text-[10px] font-black">2</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Assistente Jules Analítico */}
      <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[400px] z-40">
        <div className="bg-slate-900 p-5 rounded-[2.5rem] shadow-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
             <AlertCircle size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 italic">Jules / Estratégia</p>
            <p className="text-[11px] text-slate-300 leading-tight font-medium">
              "A expansão da Base está em 60%. O próximo passo requer autorização do Financeiro. <span className="text-white font-bold">Deseja que eu envie o lembrete?</span>"
            </p>
          </div>
          <button className="bg-white text-slate-950 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-blue-50 transition-all">
            SIM
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrategyKanban;