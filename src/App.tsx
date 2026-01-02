import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Edit, Trash2, RotateCcw, Search, ExternalLink, 
  AlertTriangle, Target 
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';

// Tipagem para um Projeto/Meta
interface ProjectGoal {
  id: string;
  name: string;
  description: string;
  type: 'CAMPAIGN' | 'EVENT' | 'GROWTH' | 'PARTNERSHIP' | 'INTERNAL';
  status: 'BACKLOG' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  startDate: string;
  endDate: string;
  kpis: string;
  responsable: string;
}

const MarketingProjectsGoals: React.FC = () => {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectGoal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [projects, setProjects] = useState<ProjectGoal[]>(() => [
    {
      id: 'proj1', name: 'Campanha de Sócios - 2026', description: 'Lançar nova campanha de sócios torcedores com foco em benefícios exclusivos.',
      type: 'CAMPAIGN', status: 'IN_PROGRESS', priority: 'HIGH', startDate: '2026-01-10', endDate: '2026-03-30',
      kpis: '200 novos sócios', responsable: 'CMO'
    },
    {
      id: 'proj2', name: 'Briefing Jogo vs Steamrollers', description: 'Coletar informações pré-jogo para criar conteúdo de aquecimento.',
      type: 'EVENT', status: 'REVIEW', priority: 'MEDIUM', startDate: '2026-01-20', endDate: '2026-01-24',
      kpis: '2 posts feitos, 1 stories por hora', responsable: 'CMO'
    }
  ]);

  const [completedProjects, setCompletedProjects] = useState<ProjectGoal[]>(() => [
    {
      id: 'comp1', name: 'Lançamento Coleção Inverno 2025', description: 'Campanha integrada para a nova linha de produtos de inverno.',
      type: 'CAMPAIGN', status: 'COMPLETED', priority: 'HIGH', startDate: '2025-06-01', endDate: '2025-08-30',
      kpis: '10k vendas na loja virtual', responsable: 'CMO'
    }
  ]);

  const kanbanColumns = ['BACKLOG', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];

  const handleSaveProject = (data: Omit<ProjectGoal, 'id' | 'status'>) => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...data } : p));
      setEditingProject(null);
    } else {
      const newProject: ProjectGoal = { ...data, id: `proj${Date.now()}`, status: 'BACKLOG' };
      setProjects([...projects, newProject]);
    }
    setShowForm(false);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      setProjects(projects.filter(p => p.id !== id));
      setCompletedProjects(completedProjects.filter(p => p.id !== id));
    }
  };

  const handleEditProject = (project: ProjectGoal) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleMoveToCompleted = (project: ProjectGoal) => {
    setProjects(projects.filter(p => p.id !== project.id));
    setCompletedProjects([...completedProjects, { ...project, status: 'COMPLETED', endDate: new Date().toISOString().split('T')[0] }]);
  };

  const handleReactivateProject = (project: ProjectGoal) => {
    if (window.confirm('Deseja reativar este projeto?')) {
      setCompletedProjects(completedProjects.filter(p => p.id !== project.id));
      setProjects([...projects, { ...project, status: 'BACKLOG' }]);
    }
  };

  const handleDrop = (projectId: string, newStatus: ProjectGoal['status']) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      if (newStatus === 'COMPLETED') {
        handleMoveToCompleted(project);
      } else {
        setProjects(projects.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-white font-sans">
      <header className="p-6 border-b border-slate-800 bg-[#0f172a] flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white transition">← Voltar</button>
            <h1 className="text-2xl font-bold text-orange-500 italic uppercase">Projetos & Metas (CMO)</h1>
          </div>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingProject(null); }} className="bg-green-600 px-4 py-2 rounded-lg font-bold hover:bg-green-500 transition-all active:scale-95 shadow-lg shadow-green-500/20">
          {showForm ? 'Fechar' : '+ Novo Projeto'}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {showForm && (
          <div className="bg-[#1e293b]/50 border border-slate-700 rounded-[2.5rem] p-8 animate-in fade-in slide-in-from-top-4 duration-500 shadow-2xl">
            <ProjectForm 
              initialData={editingProject} 
              onSubmit={handleSaveProject} 
              onCancel={() => { setShowForm(false); setEditingProject(null); }} 
            />
          </div>
        )}

        <div className="bg-[#0f172a] border border-slate-800 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Kanban Tático</h3>
            <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
              <Search size={14} className="text-slate-500" />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Filtrar por nome..." className="bg-transparent outline-none text-xs w-48 font-bold italic" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            {kanbanColumns.map(status => (
              <KanbanColumn 
                key={status} 
                title={status === 'BACKLOG' ? 'Rascunho' : status === 'IN_PROGRESS' ? 'Execução' : status === 'REVIEW' ? 'Revisão' : 'Concluído'}
                status={status as ProjectGoal['status']}
                projects={projects.filter(p => p.status === status && p.name.toLowerCase().includes(searchTerm.toLowerCase()))}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                onDrop={handleDrop}
                onMoveToCompleted={handleMoveToCompleted}
              />
            ))}
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-[2.5rem] p-6 shadow-xl">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic mb-6">Biblioteca de Concluídos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedProjects.map(proj => (
              <div key={proj.id} className="bg-white/5 p-4 rounded-2xl flex justify-between items-center border border-white/5 hover:border-blue-500/30 transition-all group">
                <div>
                  <h5 className="text-sm font-black italic tracking-tight text-white">{proj.name}</h5>
                  <p className="text-[10px] text-slate-500 italic mt-1 font-bold"><Target size={10} className="inline mr-1 text-blue-500" /> {proj.kpis}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleReactivateProject(proj)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><RotateCcw size={16} /></button>
                  <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><ExternalLink size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <JulesAgent context="SETTINGS" />
    </div>
  );
};

// --- SUB-COMPONENTS ---
const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [type, setType] = useState<ProjectGoal['type']>(initialData?.type || 'GROWTH');
  const [priority, setPriority] = useState<ProjectGoal['priority']>(initialData?.priority || 'MEDIUM');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [kpis, setKpis] = useState(initialData?.kpis || '');
  const [responsable] = useState(initialData?.responsable || 'CMO');

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ name, description, type, priority, startDate, endDate, kpis, responsable }); }} className="grid grid-cols-2 gap-6">
      <div className="col-span-2">
        <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Nome da Iniciativa</label>
        <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-900/50 p-3 rounded-xl border border-slate-700 text-white font-bold outline-none focus:border-orange-500 transition-colors" />
      </div>
      <div className="col-span-2">
        <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Descrição Estratégica</label>
        <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-slate-900/50 p-3 rounded-xl border border-slate-700 text-white font-bold outline-none focus:border-orange-500 transition-colors resize-none" />
      </div>
      <div>
        <label className="text-[10px] font-black uppercase