import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import { supabase } from '../../lib/supabase';
import { Plus } from 'lucide-react';
import { useUserRole } from '../../shared/hooks/useUserRole';

const Agenda = () => {
  const { role } = useUserRole();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => { 
    fetchEvents(); 
  }, []);

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*');
    if (data) setEvents(data);
  };

  if (role !== 'gestor') {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-xl">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Acesso Restrito</h2>
        <p className="text-slate-500 mt-2">Apenas gestores podem gerenciar a agenda oficial.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black italic tracking-tight">AGENDA <span className="text-blue-600">GLADIATORS</span></h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Painel do Gestor</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all flex items-center gap-2">
          <Plus size={20} /> NOVO EVENTO
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
        <Calendar 
          onChange={(val: any) => setSelectedDate(val)} 
          value={selectedDate} 
          tileContent={({ date, view }: any) => {
            if (view === 'month') {
              const dayEvents = events.filter(e => e.date === date.toISOString().split('T')[0]);
              return (
                <div className="flex flex-col gap-1 mt-1 w-full overflow-hidden">
                  {dayEvents.map((e, i) => (
                    <div key={i} className="text-[8px] bg-blue-600 text-white p-1 rounded font-bold truncate">
                      {e.title}
                    </div>
                  ))}
                </div>
              );
            }
          }} 
        />
      </div>
    </div>
  );
};

export default Agenda;