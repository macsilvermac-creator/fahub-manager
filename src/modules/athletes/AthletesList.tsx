import React, { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { useAthletes } from './useAthletes';
import AthleteTable from './AthleteTable';
import AthleteForm from './AthleteForm';
import DashboardSidebar from '../dashboard/components/DashboardSidebar';
import JulesAgent from '../../lib/Jules';
import type { Athlete } from './types';

/**
 * MÓDULO: ELENCO (ROSTER) - ORQUESTRADOR
 * Padrão: Protocolo Nexus (Dark Mode / Modular)
 * Lógica: Conectado ao Supabase via useAthletes
 */
const AthletesList: React.FC = () => {
  const { athletes, addAthlete, updateAthlete, deleteAthlete } = useAthletes();
  
  // Estados de Interface
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);

  // --- LÓGICA DE OPERAÇÃO ---

  const handleSave = (data: Omit<Athlete, 'id'>) => {
    if (editingAthlete) {
      updateAthlete(editingAthlete.id, data);
    } else {
      addAthlete(data);
    }
    handleCloseForm();
  };

  const handleNew = () => {
    setEditingAthlete(null);
    setShowForm(true);
  };

  const handleEdit = (athlete: Athlete) => {
    setEditingAthlete(athlete);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAthlete(null);
  };

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden text-white font-sans">
      
      {/* 1. NAVEGAÇÃO LATERAL (Integrada ao Protocolo) */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-y-auto relative">
        
        {/* HEADER DE COMANDO OPERACIONAL */}
        <header className="p-4 md:p-6 border-b border-slate-800 bg-[#0f172a]/50 backdrop-blur sticky top-0 z-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Botão Mobile Menu */}
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden p-2 text-gray-300 bg-slate-800 rounded-lg"
            >
              ☰
            </button>
            <div>
              <h1 className="text-xl font-black italic text-white flex items-center gap-2 uppercase tracking-tighter">
                <Users className="text-indigo-500" size={24} />
                Gestão de Elenco <span className="text-slate-600">/ Roster</span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                Operação: <span className="text-indigo-400 font-bold">Unidade Esportiva</span> • Status: <span className="text-emerald-500">Online</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {!showForm && (
              <button 
                onClick={handleNew}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 transform active:scale-95"
              >
                <Plus size={16} />
                CADASTRAR ATLETA
              </button>
            )}
          </div>
        </header>

        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-32">
          
          {/* ÁREA DE TRABALHO: WORKSHOP (FORMULÁRIO) */}
          {showForm && (
            <div className="mb-8 animate-fade-in-down">
              <div className="bg-[#1e293b]/20 border border-indigo-500/30 rounded-2xl p-1 shadow-2xl backdrop-blur-sm">
                <AthleteForm 
                  initialData={editingAthlete}
                  onSubmit={handleSave} 
                  onCancel={handleCloseForm} 
                />
              </div>
            </div>
          )}

          {/* LISTAGEM DE ALTA PERFORMANCE (TABELA) */}
          <div className="relative">
            {/* Overlay sutil para destacar a tabela no fundo escuro */}
            <div className="absolute -inset-4 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl relative z-10">
              <div className="p-4 border-b border-slate-800/50 bg-[#0f172a]/50 flex justify-between items-center">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                  Base de Dados Atletas ({athletes.length})
                </h3>
              </div>
              
              <AthleteTable 
                athletes={athletes} 
                onEdit={handleEdit}
                onDelete={deleteAthlete}
              />
            </div>
          </div>

        </main>

        {/* 4. INTELIGÊNCIA ARTIFICIAL (JULES) */}
        <JulesAgent context="PEOPLE" />

      </div>
    </div>
  );
};

export default AthletesList;