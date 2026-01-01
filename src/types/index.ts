// --- 1. ATLETAS (Base do Sistema) ---
export interface Athlete {
  id: string;
  name: string;
  position: string;      // Ex: QB, WR, LB
  number: string | number;
  status: 'active' | 'injured' | 'inactive';
  photo_url?: string;    // Opcional (URL da imagem no Storage)
  email?: string;
  phone?: string;
  height?: string;
  weight?: string;
  created_at?: string;
}

// --- 2. EVENTOS (Calendário) ---
export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;          // Supabase retorna data como string ISO
  location?: string;
  type: 'game' | 'training' | 'meeting' | 'social';
  created_at?: string;
}

// --- 3. FINANCEIRO (Mensalidades) ---
export interface Payment {
  id: string;
  athlete_id?: string;   // Relacionado ao atleta (pode ser null se for avulso)
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  due_date: string;
  payment_date?: string;
  description: string;
  created_at?: string;
}

// --- 4. DASHBOARD (Estatísticas Gerais) ---
export interface DashboardStats {
  totalAthletes: number;
  activeAthletes: number;
  monthlyRevenue: number;
  upcomingEvents: number;
}