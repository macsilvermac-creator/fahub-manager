import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
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
      setLoading(true);

      // 1. Total de Atletas
      const { count: totalCount } = await supabase
        .from('athletes')
        .select('*', { count: 'exact', head: true });

      // 2. Atletas Ativos (Garantindo que a busca não quebre se não houver ativos)
      const { count: activeCount } = await supabase
        .from('athletes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // 3. Próximos Eventos
      const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('date', new Date().toISOString());

      // 4. Receita (Soma manual para evitar erros de RPC do Supabase)
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'paid')
        .gte('payment_date', startOfMonth);

      const totalRevenue = paymentsData?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

      setStats({
        totalAthletes: totalCount || 0,
        activeAthletes: activeCount || 0,
        upcomingEvents: eventsCount || 0,
        monthlyRevenue: totalRevenue
      });

    } catch (error) {
      console.error('Erro detalhado no Dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refresh: fetchStats };
};