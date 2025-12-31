import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
// Se o seu arquivo de tipos for 'src/types.ts', o import abaixo está correto.
// Se der erro de "cannot find module types", mude para '../../types.ts' ou o caminho correto.
import type { DashboardStats } from '../../types'; 

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalAthletes: 0,
    activeAthletes: 0,
    monthlyRevenue: 0,
    upcomingEvents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // 1. Buscando total de Atletas
      const { count: totalAthletes } = await supabase
        .from('athletes')
        .select('*', { count: 'exact', head: true });

      // 2. Buscando Atletas Ativos
      const { count: activeAthletes } = await supabase
        .from('athletes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // 3. Buscando Eventos Futuros (Data >= Hoje)
      const { count: upcomingEvents } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('date', new Date().toISOString());

      // 4. Calculando Receita (Soma dos pagamentos 'paid' deste mês)
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      
      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'paid')
        .gte('payment_date', startOfMonth);

      // Soma simples dos valores
      const monthlyRevenue = payments?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

      setStats({
        totalAthletes: totalAthletes || 0,
        activeAthletes: activeAthletes || 0,
        upcomingEvents: upcomingEvents || 0,
        monthlyRevenue
      });

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refresh: fetchStats };
};