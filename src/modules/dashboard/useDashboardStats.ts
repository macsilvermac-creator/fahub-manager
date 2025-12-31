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

      // 2. Atletas Ativos
      const { count: activeCount } = await supabase
        .from('athletes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // 3. Próximos Eventos (A partir de hoje)
      const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('date', new Date().toISOString());

      // 4. Receita Mensal (Soma de tudo que foi pago este mês)
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'paid')
        .gte('payment_date', startOfMonth);

      const totalRevenue = paymentsData?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;

      setStats({
        totalAthletes: totalCount || 0,
        activeAthletes: activeCount || 0,
        upcomingEvents: eventsCount || 0,
        monthlyRevenue: totalRevenue
      });

    } catch (error) {
      console.error('Erro ao carregar Dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refresh: fetchStats };
};