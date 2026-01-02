import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Archive, RotateCcw, Search, ExternalLink, Calendar, AlertTriangle, ChevronsDown, ChevronsUp, Target, ListTodo, CheckCircle, Clock } from 'lucide-react';
import JulesAgent from '../../lib/Jules';

// Tipagem para um Projeto/Meta
interface ProjectGoal {
  id: string;
  name: string;
  description: string;
  type: 'CAMPAIGN' | 'EVENT' | 'GROWTH' | 'PARTNERSHIP' | 'INTERNAL';
  status: 'BACKLOG' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED'; // Para o Kanban
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  kpis: string; // Ex: "Atingir 15k seguidores"
  responsable: string;
  attachments?: string[]; // Futuro: links para arquivos no Google Drive
}

const MarketingProjectsGoals: React.FC = () => {
  const navigate = useNavigate();

  // Estados
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectGoal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // MOCK DATA: Projetos Ativos e Concluídos
  const [projects, setProjects] = useState<ProjectGoal[]>(() => [
    {
      id: 'proj1', name: 'Campanha de Sócios - 2026', description: 'Lançar nova campanha de sócios torcedores com foco em descontos e benefícios exclusivos.',
      type: 'CAMPAIGN', status: 'IN_PROGRESS', priority: 'HIGH', startDate: '2026-01-10', endDate: '2026-03-30',
      kpis: '200 novos sócios', responsable: 'CMO'
    },
    {
      id: 'proj2', name: 'Briefing Jogo vs Steamrollers', description: 'Coletar informações pré-jogo para criar conteúdo de aquecimento nas redes sociais.',
      type: 'EVENT', status: 'REVIEW', priority: 'MEDIUM', startDate: '2026-01-20', endDate: '2026-01-24',
      kpis: '2 posts feitos, 1 stories por hora no jogo', responsable: 'CMO'
    },
    {
      id: 'proj3', name: 'Planejamento de Parceria Red Zone', description: 'Reunião para definir novas ações de marketing com a Red Zone Energy até o final do ano.',
      type: 'PARTNERSHIP', status: 'BACKLOG', priority: 'LOW', startDate: '2026-02-01', endDate: '2026-02-15',
      kpis: '3 ideias de ativação aprovadas', responsable: 'CMO'
    },
  ]);

  const [completedProjects, setCompletedProjects] = useState<ProjectGoal[]>(() => [
    {
      id: 'comp1', name: 'Lançamento Coleção Inverno 2025', description: 'Campanha integrada para a nova linha de produtos de inverno.',
      type: 'CAMPAIGN', status: 'COMPLETED', priority: 'HIGH', startDate: '2025-06-01', endDate: '2025-08-30',
      kpis: '10k vendas na loja virtual', responsable: 'CMO'
    },
    {
      id: 'comp2', name: 'Tryout Lab 2025 - Divulgação', description: 'Divulgação da seletiva de 2025 em todos os canais de mídia.',
      type: 'EVENT', status: 'COMPLETED', priority: 'CRITICAL', startDate: '2025-11-15', endDate: '2025-12-10',
      kpis: '300 inscritos no Forms', responsable: 'CMO'
    },
  ]);

  const kanbanColumns = ['BACKLOG', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];

  // Funções de Gerenciamento do Projeto (Mock)
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
    if (window.confirm('Deseja arquivar este projeto como CONCLUÍDO?')) {
      setProjects(projects.filter(p => p.id !== project.id));
      setCompletedProjects([...completedProjects, { ...project, status: 'COMPLETED', endDate: new Date().toISOString().split('T')[0] }]);
    }
  };

  const handleReactivateProject = (project: ProjectGoal) => {
    if (window.confirm('Deseja reativar este projeto? Ele voltará para o Backlog.')) {
      setCompletedProjects(completedProjects.filter(p => p.id !== project.id));
      setProjects([...projects, { ...project, status: 'BACKLOG', endDate: '' /* Resetar prazo */ }]);
    }
  };

  const handleDrop = (projectId: string, newStatus: ProjectGoal['status']) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        if (newStatus === 'COMPLETED') {
          handleMoveToCompleted(p); // Usa a função existente para mover para concluídos
          return { ...p }; // Não deve permanecer em 'projects'
        }
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-white font-sans">
      
      {/* HEADER DO MÓDULO */}
      <header className="p-4 md:p-6 border-b border-slate-800 bg-[#0f172a] flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white transition">
              ← Voltar
            </button>
            <h1 className="text-2xl font-bold text-orange-500 tracking-tight">Projetos & Metas (CMO)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 pl-16">
            GESTÃO DE INICIATIVAS • OBJETIVOS ESTRATÉGICOS
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setShowForm(!showForm); setEditingProject(null); }}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition shadow-lg 
              ${showForm ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-green-600 hover:bg-green-500 text-white shadow-green-500/20'}`}
          >
            {showForm ? 'Fechar Formulário' : '+ Novo Projeto/Meta'}
          </button>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL (Grid de 2 linhas principais) */}
      <main className="flex-1 overflow-y-auto w-full max-w-full lg:max-w-[1920px] mx-auto p-4 md:p-6 space-y-6">

        {/* --- CONTEINER 1: WORKSHOP (Criação & Edição) --- */}
        {showForm && (
          <div className="bg-[#1e293b]/50 border border-slate-700 rounded-xl p-6 shadow-2xl animate-fade-in-down">
            <h2 className="text-xl font-bold text-white mb-4">{editingProject ? 'Editar Projeto/Meta' : 'Criar Novo Projeto/Meta'}</h2>
            <ProjectForm 
              initialData={editingProject} 
              onSubmit={handleSaveProject} 
              onCancel={() => { setShowForm(false); setEditingProject(null); }} 
            />
          </div>
        )}

        {/* --- CONTEINER 2: KANBAN TÁTICO (Projetos Ativos) --- */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="p-2 border-b border-slate-800 flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Kanban Tático</h3>
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="bg-black/30 border border-slate-700 rounded px-2 py-1 text-xs text-white max-w-[150px] focus:border-orange-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} className="text-slate-500" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 lg:min-h-[400px]">
            {kanbanColumns.map(status => (
              <KanbanColumn 
                key={status} 
                title={status === 'BACKLOG' ? 'Em Rascunho' : status === 'IN_PROGRESS' ? 'Em Execução' : status === 'REVIEW' ? 'Em Revisão' : 'Concluído (Arrastar p/ Arquivar)'}
                status={status as ProjectGoal['status']}
                projects={projects.filter(p => (p.status === status || status === 'COMPLETED' ) && p.name.toLowerCase().includes(searchTerm.toLowerCase()))} // Filtra projetos do COMPLETED para aqui antes de arquivar
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                onDrop={handleDrop}
                onMoveToCompleted={handleMoveToCompleted}
              />
            ))}
          </div>
        </div>

        {/* --- CONTEINER 3: LEGADO (Biblioteca de Concluídos) --- */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 shadow-xl mb-6">
          <div className="p-2 border-b border-slate-800 flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Biblioteca de Concluídos</h3>
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                placeholder="Buscar na Biblioteca..." 
                className="bg-black/30 border border-slate-700 rounded px-2 py-1 text-xs text-white max-w-[150px] focus:border-orange-500 outline-none"
                // Implementar busca real aqui no futuro
              />
              <Search size={16} className="text-slate-500" />
            </div>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2 pr-2">
            {completedProjects.length > 0 ? (
              completedProjects.map(proj => (
                <ProjectGoalListItem 
                  key={proj.id} 
                  project={proj} 
                  onReactivate={handleReactivateProject} 
                  onViewDetails={() => alert(`Detalhes de: ${proj.name}`)} 
                />
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 italic">Nenhum projeto concluído na biblioteca ainda.</div>
            )}
          </div>
        </div>

      </main>

      {/* JULES AGENT */}
      <JulesAgent context="SETTINGS" /> {/* Contexto específico para projetos seria bom no futuro */}
    </div>
  );
};

export default MarketingProjectsGoals;


// --- SUB-COMPONENTS (Dentro do mesmo arquivo para simplicidade inicialmente) ---

interface ProjectFormProps {
  initialData?: ProjectGoal | null;
  onSubmit: (data: Omit<ProjectGoal, 'id' | 'status'>) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [type, setType] = useState<ProjectGoal['type']>(initialData?.type || 'GROWTH');
  const [priority, setPriority] = useState<ProjectGoal['priority']>(initialData?.priority || 'MEDIUM');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [kpis, setKpis] = useState(initialData?.kpis || '');
  const [responsable, setResponsable] = useState(initialData?.responsable || 'CMO'); // Default

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, type, priority, startDate, endDate, kpis, responsable });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      <div className="md:col-span-2">
        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nome do Projeto/Meta</label>
        <input required type="text" value={name} onChange={(e) => setName(e.target.value)} 
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-green-500 outline-none"/>
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Descrição Detalhada</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white resize-none focus:border-green-500 outline-none"/>
      </div>
      
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tipo</label>
        <select value={type} onChange={(e) => setType(e.target.value as any)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-green-500 outline-none">
          <option value="CAMPAIGN">Campanha</option>
          <option value="EVENT">Evento</option>
          <option value="GROWTH">Crescimento (Meta)</option>
          <option value="PARTNERSHIP">Parceria</option>
          <option value="INTERNAL">Interno</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Prioridade</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value as any)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-green-500 outline-none">
          <option value="LOW">Baixa</option>
          <option value="MEDIUM">Média</option>
          <option value="HIGH">Alta</option>
          <option value="CRITICAL">Crítica</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Data Início</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-green-500 outline-none"/>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Prazo Final</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-green-500 outline-none"/>
      </div>

      <div className="md:col-span-2">
        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">KPIs / Meta de Sucesso</label>
        <input type="text" value={kpis} onChange={(e) => setKpis(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-green-500 outline-none"
          placeholder="Ex: 200 novos sócios, 15k seguidores..." />
      </div>

      <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-slate-700">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-700 rounded-lg text-slate-400 hover:bg-slate-800 transition">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 shadow-green-500/20 transition">Salvar Projeto</button>
      </div>
    </form>
  );
};


interface KanbanColumnProps {
  title: string;
  status: ProjectGoal['status'];
  projects: ProjectGoal[];
  onEdit: (project: ProjectGoal) => void;
  onDelete: (id: string) => void;
  onDrop: (projectId: string, newStatus: ProjectGoal['status']) => void;
  onMoveToCompleted: (project: ProjectGoal) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, status, projects, onEdit, onDelete, onDrop, onMoveToCompleted }) => {
  const getStatusColor = (currentStatus: ProjectGoal['status']) => {
    switch (currentStatus) {
      case 'BACKLOG': return 'border-slate-500';
      case 'IN_PROGRESS': return 'border-blue-500';
      case 'REVIEW': return 'border-orange-500';
      case 'COMPLETED': return 'border-emerald-500';
      default: return 'border-slate-500';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Permite o drop
  };

  const handleDropEvent = (e: React.DragEvent) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData('projectId');
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project && status === 'COMPLETED') { // Se arrastar para "Concluído"
        onMoveToCompleted(project);
      } else if (project) {
        onDrop(projectId, status);
      }
    }
  };

  return (
    <div 
      className={`bg-[#1e293b]/40 rounded-xl p-4 flex flex-col min-h-[200px] border-t-4 ${getStatusColor(status)}`}
      onDragOver={handleDragOver}
      onDrop={handleDropEvent}
    >
      <h4 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
        {title}
        <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400">{projects.length}</span>
      </h4>
      <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
        {projects.map(proj => (
          <KanbanCard 
            key={proj.id} 
            project={proj} 
            onEdit={onEdit} 
            onDelete={onDelete} 
            onMoveToCompleted={onMoveToCompleted}
          />
        ))}
      </div>
    </div>
  );
};


interface KanbanCardProps {
  project: ProjectGoal;
  onEdit: (project: ProjectGoal) => void;
  onDelete: (id: string) => void;
  onMoveToCompleted: (project: ProjectGoal) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ project, onEdit, onDelete, onMoveToCompleted }) => {
  const getPriorityColor = (priority: ProjectGoal['priority']) => {
    switch (priority) {
      case 'LOW': return 'text-slate-500';
      case 'MEDIUM': return 'text-blue-400';
      case 'HIGH': return 'text-orange-400';
      case 'CRITICAL': return 'text-red-400';
      default: return 'text-slate-500';
    }
  };

  const getStatusDotColor = (status: ProjectGoal['status']) => {
    switch (status) {
      case 'BACKLOG': return 'bg-slate-500';
      case 'IN_PROGRESS': return 'bg-blue-500';
      case 'REVIEW': return 'bg-orange-500';
      case 'COMPLETED': return 'bg-emerald-500';
      default: return 'bg-slate-500';
    }
  };
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('projectId', project.id);
  };

  // Simula o cálculo de dias restantes
  const calculateDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining(project.endDate);

  return (
    <div 
      className="bg-[#0f172a] rounded-xl p-4 border border-slate-700 shadow hover:border-blue-500 transition-all group cursor-grab"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="flex justify-between items-start mb-2">
        <h5 className="font-bold text-white text-md flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${getStatusDotColor(project.status)}`}></span>
            {project.name}
        </h5>
        <span className={`text-[10px] uppercase font-bold ${getPriorityColor(project.priority)}`}>
            {project.priority === 'CRITICAL' ? <AlertTriangle size={12} className="inline-block mr-1" /> : ''}
            {project.priority}
        </span>
      </div>
      <p className="text-[10px] text-slate-400 leading-tight mb-3">
        {project.description.substring(0, 70)}...
      </p>

      <div className="flex justify-between items-center text-[10px] text-slate-500">
        <div className="flex items-center gap-1">
            <Clock size={12} /> Prazo: {project.endDate}
            {daysRemaining <= 7 && daysRemaining > 0 && <span className="ml-1 text-orange-400 font-bold">({daysRemaining} dias)</span>}
            {daysRemaining <= 0 && project.status !== 'COMPLETED' && <span className="ml-1 text-red-400 font-bold">(ATRASADO)</span>}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); onEdit(project); }} className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white"><Edit size={14} /></button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(project.id); }} className="p-1 rounded hover:bg-red-900/30 text-slate-400 hover:text-red-400"><Trash2 size={14} /></button>
        </div>
      </div>
    </div>
  );
};


interface ProjectGoalListItemProps {
  project: ProjectGoal;
  onReactivate: (project: ProjectGoal) => void;
  onViewDetails: (id: string) => void;
}

const ProjectGoalListItem: React.FC<ProjectGoalListItemProps> = ({ project, onReactivate, onViewDetails }) => {
  return (
    <div className="bg-[#1e293b]/30 rounded-lg border border-slate-700 p-3 flex justify-between items-center hover:border-purple-500/50 hover:bg-[#1e293b] transition group">
      <div>
        <h5 className="text-sm font-bold text-white">{project.name}</h5>
        <p className="text-[10px] text-slate-400 mt-1">
          <Target size={10} className="inline-block mr-1 text-purple-400" /> {project.kpis}
          <span className="ml-2 text-slate-500"> | Concluído em: {project.endDate}</span>
        </p>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onReactivate(project)} className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white" title="Reativar Projeto"><RotateCcw size={16} /></button>
        <button onClick={() => onViewDetails(project.id)} className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white" title="Ver Detalhes"><ExternalLink size={16} /></button>
      </div>
    </div>
  );
};