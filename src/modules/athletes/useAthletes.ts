import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Athlete } from './types';

export const useAthletes = () => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Buscar atletas ao carregar a página
  useEffect(() => {
    fetchAthletes();
  }, []);

  const fetchAthletes = async () => {
    try {
      const { data, error } = await supabase
        .from('athletes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAthletes(data || []);
    } catch (error) {
      console.error('Erro ao buscar atletas:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Criar novo atleta no Banco
  const addAthlete = async (newAthleteData: Omit<Athlete, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('athletes')
        .insert([newAthleteData])
        .select()
        .single();

      if (error) throw error;
      // Atualiza a tela imediatamente com o dado que voltou do banco
      if (data) setAthletes((prev) => [data, ...prev]);
      
    } catch (error) {
      console.error('Erro ao criar atleta:', error);
      alert('Erro ao salvar. Verifique o console.');
    }
  };

  // 3. Editar atleta no Banco
  const updateAthlete = async (id: string, updatedData: Partial<Athlete>) => {
    try {
      const { error } = await supabase
        .from('athletes')
        .update(updatedData)
        .eq('id', id);

      if (error) throw error;

      // Atualiza a lista local para refletir a mudança sem recarregar
      setAthletes((prev) =>
        prev.map((athlete) =>
          athlete.id === id ? { ...athlete, ...updatedData } : athlete
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    }
  };

  // 4. Excluir atleta do Banco
  const deleteAthlete = async (id: string) => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este atleta?');
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('athletes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove da lista visual
      setAthletes((prev) => prev.filter((athlete) => athlete.id !== id));
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  return {
    athletes,
    loading,
    addAthlete,
    updateAthlete,
    deleteAthlete
  };
};