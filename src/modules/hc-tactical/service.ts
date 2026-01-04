import type { PracticeReport } from './types';

export const HCService = {
  async getLatestReports(supabase: any, entityId: string): Promise<PracticeReport[]> {
    const { data, error } = await supabase
      .from('hc_practice_reports')
      .select('*')
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });
    
    if (error) console.error('[NEXUS SERVICE ERROR]:', error);
    return data || [];
  },

  async getOpponentData(supabase: any, entityId: string) {
    const stats = await supabase
      .from('hc_opponent_intelligence')
      .select('*')
      .eq('entity_id', entityId)
      .eq('category', 'STAT');

    const trends = await supabase
      .from('hc_opponent_intelligence')
      .select('*')
      .eq('entity_id', entityId)
      .eq('category', 'TREND');

    return { 
      stats: stats.data || [], 
      trends: trends.data || [] 
    };
  }
};