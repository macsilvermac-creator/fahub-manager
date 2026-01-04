import React, { useState, useEffect } from 'react';
import { Users, ClipboardList, BarChart3, Calendar } from 'lucide-react';
import { NexusModuleProps, PracticeReport } from './types';
import { HCService } from './service';

const HC_Module: React.FC<NexusModuleProps> = ({ entityId, supabaseClient }) => {
  const [view, setView] = useState<'dash' | 'reports' | 'intel'>('dash');
  const [reports, setReports] = useState<PracticeReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<PracticeReport | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await HCService.getLatestReports(supabaseClient, entityId);
      setReports(data);
      if (data.length > 0) setSelectedReport(data[0]);
    };
    loadData();
  }, [entityId, supabaseClient]);

  const Card = ({ title, icon: Icon, onClick, children }: any) => (
    <div 
      onClick={onClick}
      className="group cursor-pointer bg-[#0a0f1e]/40 border border-white/5 backdrop-blur-xl p-6 rounded-xl hover:border-blue-500/50 transition-all duration-500"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-black italic uppercase tracking-tighter text-xl text-white/90">{title}</h3>
        <Icon className="text-blue-400 group-hover:scale-110 transition-transform" size={24} />
      </div>
      {children}
    </div>
  );

  if (view === 'dash') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-full">
        <Card title="Relatórios" icon={ClipboardList} onClick={() => setView('reports')}>
          <p className="text-xs text-white/40 uppercase">Último treino</p>
          <p className="text-sm font-bold text-blue-400 mt-1">{reports[0]?.coordinator_name || 'Sem dados'}</p>
        </Card>

        <Card title="Adversário" icon={BarChart3} onClick={() => console.log('Intel')}>
          <p className="text-xs text-white/40">Próximo Matchup</p>
          <p className="text-sm font-bold text-red-400 mt-1 italic uppercase tracking-widest text-lg">Scouting ativo</p>
        </Card>

        <Card title="Atletas" icon={Users} onClick={() => console.log('Roster')}>
          <div className="flex gap-4 mt-2">
            <div className="text-center"><p className="text-lg font-black italic">45</p><p className="text-[10px] opacity-50">TOTAL</p></div>
            <div className="text-center text-red-400"><p className="text-lg font-black italic">03</p><p className="text-[10px] opacity-50">DM</p></div>
          </div>
        </Card>

        <Card title="Calendário" icon={Calendar} onClick={() => console.log('Schedule')}>
          <div className="mt-2 border-l-2 border-blue-500 pl-3">
            <p className="text-xs font-bold italic">DOMINGO - 15:00</p>
            <p className="text-sm opacity-80 uppercase">Estádio Municipal</p>
          </div>
        </Card>
      </div>
    );
  }

  if (view === 'reports') {
    return (
      <div className="flex flex-col md:flex-row gap-4 p-4 h-full animate-in slide-in-from-right duration-500">
        <div className="w-full md:w-2/3 bg-[#0a0f1e]/60 border border-white/5 p-8 rounded-xl backdrop-blur-md">
          <button onClick={() => setView('dash')} className="text-[10px] uppercase font-bold text-blue-400 mb-4 tracking-tighter">← Voltar para Nexus</button>
          <h2 className="font-black italic uppercase tracking-tighter text-4xl mb-4 text-white">Relatório Detalhado</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-white/80 leading-relaxed text-lg whitespace-pre-wrap">
              {selectedReport?.content || "Selecione um relatório na biblioteca ao lado."}
            </p>
          </div>
        </div>
         
        <div className="w-full md:w-1/3 bg-black/20 border border-white/5 rounded-xl flex flex-col overflow-hidden h-[600px]">
          <div className="p-4 border-b border-white/5 bg-white/5 font-black italic uppercase text-xs text-white">Biblioteca</div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {reports.map((r) => (
              <div 
                key={r.id} 
                onClick={() => setSelectedReport(r)}
                className={`p-3 rounded border border-white/5 cursor-pointer transition-colors ${selectedReport?.id === r.id ? 'bg-blue-500/20 border-blue-500/50' : 'hover:bg-white/5'}`}
              >
                <p className="text-[10px] font-bold text-blue-400">{new Date(r.created_at).toLocaleDateString()}</p>
                <p className="text-xs font-black uppercase italic text-white">{r.coordinator_name}</p>
                <p className="text-[10px] opacity-50 text-white/60">{r.unit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default HC_Module;