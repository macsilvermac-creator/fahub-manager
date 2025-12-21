
import React, { useState, useEffect, useContext } from 'react';
import { storageService } from '../services/storageService';
import { KanbanTask } from '../types';
import { KanbanIcon } from '../components/icons/NavIcons';
import { TrashIcon, CheckCircleIcon, SparklesIcon } from '../components/icons/UiIcons';
import Modal from '../components/Modal';
import { UserContext } from '../components/Layout';

const TeamTasks: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const [tasks, setTasks] = useState<KanbanTask[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
    
    // Form State
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    // Changed state types to string to accommodate assignedToDepartment and priority from KanbanTask interface
    const [taskDept, setTaskDept] = useState<string>('GENERAL');
    const [taskPriority, setTaskPriority] = useState<string>('MEDIUM');

    const isPlayer = currentRole === 'PLAYER';

    useEffect(() => {
        // Fix: Casting to any to allow CoordinatorTask structures
        setTasks(storageService.getTasks() as any);
    }, []);

    const openAddModal = () => {
        setEditingTask(null);
        setTaskTitle('');
        setTaskDesc('');
        setTaskDept('GENERAL');
        setTaskPriority('MEDIUM');
        setIsModalOpen(true);
    };

    const openEditModal = (task: KanbanTask) => {
        setEditingTask(task);
        setTaskTitle(task.title);
        setTaskDesc(task.description || '');
        // Fix: assignedToDepartment and priority are string in interface, which is compatible with string state
        setTaskDept(task.assignedToDepartment);
        setTaskPriority(task.priority);
        setIsModalOpen(true);
    };

    const handleSaveTask = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingTask) {
            // Update Existing
            const updatedTasks = tasks.map(t => t.id === editingTask.id ? {
                ...t,
                title: taskTitle,
                description: taskDesc,
                assignedToDepartment: taskDept as any,
                priority: taskPriority as any
            } : t);
            setTasks(updatedTasks);
            storageService.saveTasks(updatedTasks);
        } else {
            // Create New
            const newTask: KanbanTask = {
                id: Date.now().toString(),
                title: taskTitle,
                description: taskDesc,
                status: 'TODO',
                assignedToDepartment: taskDept as any,
                priority: taskPriority as any,
                dueDate: new Date()
            };
            const updated = [...tasks, newTask];
            setTasks(updated);
            storageService.saveTasks(updated);
        }
        setIsModalOpen(false);
    };

    const updateTaskStatus = (id: string, newStatus: 'TODO' | 'DOING' | 'DONE') => {
        const updated = tasks.map(t => t.id === id ? { ...t, status: newStatus } : t);
        setTasks(updated);
        storageService.saveTasks(updated);
    };

    const handleDelete = (id: string) => {
        const updated = tasks.filter(t => t.id !== id);
        setTasks(updated);
        storageService.saveTasks(updated);
    };

    const renderColumn = (status: 'TODO' | 'DOING' | 'DONE', title: string, colorClass: string) => {
        const colTasks = tasks.filter(t => t.status === status);
        return (
            <div className="bg-secondary/40 rounded-xl p-4 border border-white/5 flex flex-col h-full min-h-[500px]">
                <h3 className={`font-bold mb-4 uppercase text-sm tracking-wider ${colorClass}`}>{title} ({colTasks.length})</h3>
                <div className="space-y-3 flex-1">
                    {colTasks.map(task => (
                        <div key={task.id} className="bg-secondary p-4 rounded-lg border border-white/5 shadow-sm hover:border-white/20 transition-all group relative">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex gap-2">
                                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-text-secondary font-bold">{task.assignedToDepartment}</span>
                                    {task.priority === 'HIGH' && <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold">ALTA</span>}
                                </div>
                                {!isPlayer && (
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(task)} className="text-text-secondary hover:text-highlight" title="Editar">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        </button>
                                        <button onClick={() => handleDelete(task.id)} className="text-text-secondary hover:text-red-400" title="Excluir">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p className="text-white font-medium text-sm mb-1">{task.title}</p>
                            {task.description && <p className="text-xs text-text-secondary line-clamp-2 mb-3">{task.description}</p>}
                            
                            {/* Controls to move tasks */}
                            <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                {status !== 'TODO' && (
                                    <button onClick={() => updateTaskStatus(task.id, status === 'DONE' ? 'DOING' : 'TODO')} className="text-xs text-text-secondary hover:text-white">
                                        ← Voltar
                                    </button>
                                )}
                                {status !== 'DONE' && (
                                    <button onClick={() => updateTaskStatus(task.id, status === 'TODO' ? 'DOING' : 'DONE')} className="text-xs text-highlight font-bold hover:text-white ml-auto">
                                        Avançar →
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in h-[calc(100vh-8rem)]">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl">
                        <KanbanIcon className="h-8 w-8 text-highlight" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">{isPlayer ? 'Morning Stats (Tarefas Pessoais)' : 'Fluxo de Trabalho (WorkFlow)'}</h2>
                        <p className="text-text-secondary">{isPlayer ? 'Suas metas diárias e tarefas.' : 'Gestão de tarefas descentralizada.'}</p>
                    </div>
                </div>
                <button onClick={openAddModal} className="bg-highlight hover:bg-highlight-hover text-white px-4 py-2 rounded-lg font-bold">
                    + Nova Tarefa
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full pb-4 overflow-x-auto">
                {renderColumn('TODO', 'A Fazer', 'text-text-secondary')}
                {renderColumn('DOING', 'Em Progresso', 'text-yellow-400')}
                {renderColumn('DONE', 'Concluído', 'text-green-400')}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTask ? "Editar Tarefa" : "Nova Tarefa"}>
                <form onSubmit={handleSaveTask} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-text-secondary block mb-1">Título</label>
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" required value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-text-secondary block mb-1">Descrição</label>
                        <textarea className="w-full bg-black/20 border border-white/10 rounded p-2 text-white h-24" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-text-secondary block mb-1">Departamento</label>
                            <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={taskDept} onChange={e => setTaskDept(e.target.value)}>
                                <option value="GENERAL">Geral</option>
                                <option value="MARKETING">Marketing</option>
                                <option value="COMMERCIAL">Comercial</option>
                                <option value="FINANCE">Financeiro</option>
                                <option value="TECHNICAL">Técnico</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-text-secondary block mb-1">Prioridade</label>
                            <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={taskPriority} onChange={e => setTaskPriority(e.target.value)}>
                                <option value="LOW">Baixa</option>
                                <option value="MEDIUM">Média</option>
                                <option value="HIGH">Alta</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/10">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="text-text-secondary hover:text-white px-4 py-2 mr-2">Cancelar</button>
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold">Salvar Tarefa</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
export default TeamTasks;