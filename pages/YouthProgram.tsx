
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { YouthClass, YouthStudent } from '../types';
import { storageService } from '../services/storageService';
// Fix: StarIcon is exported from NavIcons, not UiIcons
import { UsersIcon, CheckCircleIcon } from '../components/icons/UiIcons';
import { SchoolIcon, StarIcon } from '../components/icons/NavIcons';
import Modal from '../components/Modal';

const YouthProgram: React.FC = () => {
    const [classes, setClasses] = useState<YouthClass[]>([]);
    const [students, setStudents] = useState<YouthStudent[]>([]);
    const [activeTab, setActiveTab] = useState<'CLASSES' | 'STUDENTS'>('CLASSES');
    
    // Add Class State
    const [isAddClassOpen, setIsAddClassOpen] = useState(false);
    const [newClassName, setNewClassName] = useState('');
    const [newClassAge, setNewClassAge] = useState('Sub-12');

    useEffect(() => {
        setClasses(storageService.getYouthClasses());
        setStudents(storageService.getYouthStudents());
    }, []);

    const handleAddClass = (e: React.FormEvent) => {
        e.preventDefault();
        const newClass: YouthClass = {
            id: `yc-${Date.now()}`,
            name: newClassName,
            ageGroup: newClassAge,
            schedule: 'Seg/Qua 18h',
            coachId: 'coach-1',
            students: [],
            maxCapacity: 20
        };
        const updated = [...classes, newClass];
        setClasses(updated);
        storageService.saveYouthClasses(updated);
        setIsAddClassOpen(false);
        setNewClassName('');
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl">
                        <SchoolIcon className="text-highlight w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Escolinhas & Social</h2>
                        <p className="text-text-secondary">Formação de Atletas e Projetos Comunitários.</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsAddClassOpen(true)}
                    className="bg-highlight hover:bg-highlight-hover text-white px-6 py-2 rounded-xl font-bold shadow-lg"
                >
                    + Nova Turma
                </button>
            </div>

            {/* Dashboard Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-indigo-900/40 to-secondary border-l-4 border-l-indigo-500">
                    <div className="flex items-center gap-4">
                        <UsersIcon className="w-8 h-8 text-indigo-400" />
                        <div>
                            <p className="text-xs text-text-secondary font-bold uppercase">Total de Alunos</p>
                            <p className="text-2xl font-bold text-white">{students.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-pink-900/40 to-secondary border-l-4 border-l-pink-500">
                    <div className="flex items-center gap-4">
                        <CheckCircleIcon className="w-8 h-8 text-pink-400" />
                        <div>
                            <p className="text-xs text-text-secondary font-bold uppercase">Bolsistas (Social)</p>
                            <p className="text-2xl font-bold text-white">{students.filter(s => s.isSocialProject).length}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Content Tabs */}
            <div className="flex border-b border-white/10">
                <button onClick={() => setActiveTab('CLASSES')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'CLASSES' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>Turmas Ativas</button>
                <button onClick={() => setActiveTab('STUDENTS')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'STUDENTS' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>Lista de Alunos</button>
            </div>

            {activeTab === 'CLASSES' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map(cls => (
                        <div key={cls.id} className="bg-secondary rounded-xl p-5 border border-white/5 hover:border-highlight/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-white/10 text-white text-xs font-bold px-2 py-1 rounded uppercase">{cls.ageGroup}</span>
                                <span className="text-text-secondary text-xs">{cls.schedule}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{cls.name}</h3>
                            <p className="text-sm text-text-secondary mb-4">Coach Responsável: {cls.coachId}</p>
                            
                            <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden mb-2">
                                <div className="bg-green-500 h-full" style={{ width: `${(cls.students.length / cls.maxCapacity) * 100}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-text-secondary mb-4">
                                <span>{cls.students.length} Inscritos</span>
                                <span>Capacidade: {cls.maxCapacity}</span>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 bg-highlight hover:bg-highlight-hover text-white py-2 rounded text-sm font-bold">Chamada</button>
                                <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded text-sm font-bold">Boletim</button>
                            </div>
                        </div>
                    ))}
                    {classes.length === 0 && (
                        <div className="col-span-full text-center py-12 text-text-secondary italic bg-secondary/20 rounded-xl">
                            Nenhuma turma cadastrada. Crie uma para começar.
                        </div>
                    )}
                </div>
            )}

            {/* Add Class Modal */}
            <Modal isOpen={isAddClassOpen} onClose={() => setIsAddClassOpen(false)} title="Nova Turma">
                <form onSubmit={handleAddClass} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase">Nome da Turma</label>
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newClassName} onChange={e => setNewClassName(e.target.value)} placeholder="Ex: Little Giants" required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase">Faixa Etária</label>
                        <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newClassAge} onChange={e => setNewClassAge(e.target.value)}>
                            <option value="Sub-10">Sub-10 (Kids)</option>
                            <option value="Sub-12">Sub-12</option>
                            <option value="Sub-15">Sub-15</option>
                            <option value="Sub-17">Sub-17</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 rounded mt-4">Criar Turma</button>
                </form>
            </Modal>
        </div>
    );
};

export default YouthProgram;