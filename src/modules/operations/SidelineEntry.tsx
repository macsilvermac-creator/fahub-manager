import React, { useState } from 'react';
import { ClipboardCheck, UserPlus, Save, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

/**
 * Interface para gerenciar os prospectos (Atletas em Seletiva)
 */
interface Prospect {
  id: string;
  name: string;
  category: 'base' | 'professional';
  position: string;
  status: 'pending' | 'technical_approved' | 'rejected';
}

const SidelineEntry: React.FC = () => {
  // Estado para controlar qual aba operacional está ativa (Entrada de Treino ou Seletiva)
  const [activeTab, setActiveTab] = useState<'training' | 'tryout'>('training');
  
  // Estado para simular a lista de prospectos da seletiva
  const [prospects, setProspects] = useState<Prospect[]>([
    { id: '1', name: 'João Silva', category: 'base', position: 'WR', status: 'pending' },
    { id: '2', name: 'Lucas Oliveira', category: 'professional', position: 'LB', status: 'pending' }
  ]);

  /**
   * Função para o HC realizar a aprovação técnica (Responsabilidade delegada)
   */
  const handleTechnicalDecision = (id: string, decision: 'technical_approved' | 'rejected') => {
    setProspects(prev => prev.map(p => 
      p.id === id ? { ...p, status: decision } : p
    ));
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Cabeçalho de Operação */}
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter italic">OPERAÇÃO <span className="text-blue-600">SIDELINE</span></h2>
        <div className="flex bg-slate-100 p-1 rounded-2xl w-full">
          <button 
            onClick={() => setActiveTab('training')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'training' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
          >
            <ClipboardCheck size={16} /> RELATÓRIO DE TREINO
          </button>
          <button 
            onClick={() => setActiveTab('tryout')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'tryout' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
          >
            <UserPlus size={16} /> SELETIVA / CONVIDADOS
          </button>
        </div>
      </header>

      {/* Conteúdo: Relatório de Treino */}
      {activeTab === 'training' && (
        <section className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Resumo Técnico do Dia</label>
              <textarea 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
                placeholder="Ex: Treino focado em Redzone. Melhora na sincronia QB/WR..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="block text-[9px] font-black text-slate-400 uppercase">Intensidade</span>
                <select className="w-full bg-transparent font-bold text-slate-700 outline-none mt-1">
                  <option>Baixa (Recuperação)</option>
                  <option>Média (Técnico)</option>
                  <option>Alta (Scrimmage)</option>
                </select>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="block text-[9px] font-black text-slate-400 uppercase">Clima</span>
                <select className="w-full bg-transparent font-bold text-slate-700 outline-none mt-1">
                  <option>Sol / Limpo</option>
                  <option>Chuva / Úmido</option>
                </select>
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 transition-all">
              <Save size={18} /> ENVIAR RELATÓRIO
            </button>
          </div>
        </section>
      )}

      {/* Conteúdo: Seletiva (Tryouts) */}
      {activeTab === 'tryout' && (
        <section className="space-y-4">
          {prospects.map(prospect => (
            <div key={prospect.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-lg flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black">
                  {prospect.position}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 tracking-tight">{prospect.name}</h4>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${prospect.category === 'base' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    {prospect.category === 'base' ? 'Categoria de Base' : 'Profissional'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {prospect.status === 'pending' ? (
                  <>
                    <button 
                      onClick={() => handleTechnicalDecision(prospect.id, 'rejected')}
                      className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                      <XCircle size={20} />
                    </button>
                    <button 
                      onClick={() => handleTechnicalDecision(prospect.id, 'technical_approved')}
                      className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-green-50 hover:text-green-600 transition-all shadow-sm"
                    >
                      <CheckCircle2 size={20} />
                    </button>
                  </>
                ) : (
                  <span className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl border ${prospect.status === 'technical_approved' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {prospect.status === 'technical_approved' ? 'Aprovado (HC)' : 'Recusado'}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Jules AI auxiliando na Seletiva */}
          <div className="bg-slate-900 rounded-[2rem] p-5 border border-slate-800 flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-xl">
              <AlertCircle size={18} className="text-white" />
            </div>
            <p className="text-[11px] text-slate-300 italic flex-1">
              "HC, identifiquei 2 prospectos com biotipo acima da média para a posição de LB na Base. Deseja que eu destaque os dados físicos para a Diretoria?"
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default SidelineEntry;