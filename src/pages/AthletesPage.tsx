import React, { useState } from 'react';
import { useAthletes } from '../hooks/useAthletes';
import { AthleteTable } from '../components/athletes/AthleteTable';
import { AthleteForm } from '../components/athletes/AthleteForm';
import { Athlete } from '../types';

export const AthletesPage = () => {
  const { athletes, addAthlete, updateAthlete, deleteAthlete } = useAthletes();
  
  // Controle de UI
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);

  // Handler: Salvar (Criação ou Edição)
  const handleFormSubmit = (formData: Omit<Athlete, 'id'>) => {
    if (editingAthlete) {
      // MODO EDIÇÃO
      updateAthlete(editingAthlete.id, formData);
      alert('Atleta atualizado com sucesso!');
    } else {
      // MODO CRIAÇÃO
      const newId = crypto.randomUUID();
      addAthlete({ ...formData, id: newId, status: 'Active' });
      alert('Atleta cadastrado com sucesso!');
    }
    closeForm();
  };

  // Handler: Iniciar Edição
  const handleEditClick = (athlete: Athlete) => {
    setEditingAthlete(athlete); // Preenche o estado com o atleta selecionado
    setIsFormOpen(true);        // Abre o formulário (agora preenchido)
  };

  // Handler: Excluir
  const handleDeleteClick = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este atleta?')) {
      deleteAthlete(id);
    }
  };

  // Utilitário para limpar
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingAthlete(null); // Importante limpar a seleção ao fechar
  };

  return (
    <div className="p-6">
      {/* ... Header e Botão Novo ... */}
      
      {isFormOpen ? (
        <AthleteForm 
          onSubmit={handleFormSubmit} 
          onCancel={closeForm}
          initialData={editingAthlete} // Passa os dados para o form
        />
      ) : (
        <AthleteTable 
          data={athletes}
          onEdit={handleEditClick}     // Conecta o lápis
          onDelete={handleDeleteClick} // Conecta a lixeira
        />
      )}
    </div>
  );
};