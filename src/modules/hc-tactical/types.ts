export interface PracticeReport {
  id: string;
  coordinator_name: string;
  unit: 'OFFENSE' | 'DEFENSE' | 'ST';
  content: string;
  created_at: string;
}

export interface OpponentStat {
  id: string;
  stat_key: string;
  stat_value: string;
}

export interface OpponentTrend {
  id: string;
  title: string;
  description: string;
}

export interface NexusModuleProps {
  userPersona: string;
  entityId: string;
  supabaseClient: any;
  onAction: (e: string, d: any) => void;
}