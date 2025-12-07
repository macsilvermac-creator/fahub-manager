
import React, { useState, useEffect, useContext } from 'react';
import { UserRole, TeamDocument } from '../types';
import { storageService } from '../services/storageService';
import { TrashIcon } from '../components/icons/UiIcons';
import { FolderIcon } from '../components/icons/NavIcons';
import { UserContext } from '../components/Layout';

const CATEGORIES = ['ALL', 'PLAYBOOK', 'MEDICAL', 'ADMIN', 'SCOUT'];

const Resources: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const [documents, setDocuments] = useState<TeamDocument[]>([]);
    const [filter, setFilter] = useState('ALL');
    const [isUploading, setIsUploading] = useState(false);
    
    // Upload form state
    const [newDocTitle, setNewDocTitle] = useState('');
    const [newDocCategory, setNewDocCategory] = useState('PLAYBOOK');

    const isPlayer = currentRole === 'PLAYER';
    const canUpload = !isPlayer; // Only non-players can upload

    useEffect(() => {
        setDocuments(storageService.getDocuments());
    }, []);

    const filteredDocs = filter === 'ALL' ? documents : documents.filter(d => d.category === filter);

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate upload
        const newDoc: TeamDocument = {
            id: Date.now().toString(),
            title: newDocTitle,
            type: 'PDF', // Simplified for demo
            category: newDocCategory as any,
            uploadDate: new Date(),
            size: '2.5 MB', // Mock size
            url: '#'
        };
        const updated = [...documents, newDoc];
        setDocuments(updated);
        storageService.saveDocuments(updated);
        setIsUploading(false);
        setNewDocTitle('');
    };

    const handleDelete = (id: string) => {
        const updated = documents.filter(d => d.id !== id);
        setDocuments(updated);
        storageService.saveDocuments(updated);
    };

    const getIconForType = (type: string) => {
        if(type === 'PDF') return <span className="text-red-400 font-bold text-xs">PDF</span>;
        if(type === 'DOC') return <span className="text-blue-400 font-bold text-xs">DOC</span>;
        return <span className="text-gray-400 font-bold text-xs">FILE</span>;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Arquivos do Time</h2>
                    <p className="text-text-secondary mt-1 flex items-center gap-2">
                        <FolderIcon className="w-4 h-4" />
                        Playbooks, Fichas Médicas e Regulamentos.
                    </p>
                </div>
                {canUpload && (
                    <button 
                        onClick={() => setIsUploading(!isUploading)}
                        className="px-6 py-2 bg-gradient-to-r from-highlight to-highlight-hover text-white rounded-xl font-semibold hover:shadow-glow transition-all"
                    >
                        {isUploading ? 'Cancelar' : 'Upload de Arquivo'}
                    </button>
                )}
            </div>

            {/* Upload Area (Coach Only) */}
            {isUploading && canUpload && (
                <div className="bg-secondary/50 border border-dashed border-white/20 rounded-xl p-6 animate-slide-in">
                    <h3 className="font-bold text-white mb-4">Novo Arquivo</h3>
                    <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-xs text-text-secondary mb-1">Nome do Arquivo</label>
                            <input 
                                className="w-full bg-primary border border-tertiary rounded-lg p-2 focus:border-highlight focus:outline-none"
                                placeholder="ex: Playbook Ataque v3.pdf"
                                value={newDocTitle}
                                onChange={e => setNewDocTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <label className="block text-xs text-text-secondary mb-1">Categoria</label>
                            <select 
                                className="w-full bg-primary border border-tertiary rounded-lg p-2 focus:border-highlight focus:outline-none"
                                value={newDocCategory}
                                onChange={e => setNewDocCategory(e.target.value)}
                            >
                                <option value="PLAYBOOK">Playbook</option>
                                <option value="MEDICAL">Médico</option>
                                <option value="SCOUT">Scouting</option>
                                <option value="ADMIN">Administrativo</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                            Salvar
                        </button>
                    </form>
                </div>
            )}

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === cat ? 'bg-highlight text-white shadow-glow' : 'bg-secondary text-text-secondary hover:bg-accent'}`}
                    >
                        {cat === 'ALL' ? 'Todos' : cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredDocs.map(doc => (
                    <div key={doc.id} className="group bg-secondary hover:bg-secondary/80 border border-white/5 rounded-xl p-4 transition-all hover:scale-[1.02] cursor-pointer relative">
                         {!isPlayer && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                                className="absolute top-2 right-2 p-1.5 rounded-full text-text-secondary hover:bg-red-500/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        )}
                        
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-black/30 flex items-center justify-center border border-white/10">
                                {getIconForType(doc.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium truncate" title={doc.title}>{doc.title}</h4>
                                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-text-secondary uppercase tracking-wider">{doc.category}</span>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-[10px] text-text-secondary border-t border-white/5 pt-3 mt-1">
                            <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                            <span>{doc.size}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            {filteredDocs.length === 0 && (
                <div className="text-center py-12 bg-secondary/20 rounded-xl border border-dashed border-white/10">
                    <p className="text-text-secondary">Nenhum arquivo encontrado nesta categoria.</p>
                </div>
            )}
        </div>
    );
};

export default Resources;
