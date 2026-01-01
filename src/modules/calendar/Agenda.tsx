import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import { supabase } from '../../lib/supabase';
import { Plus } from 'lucide-react';
import { useUserRole } from '../../shared/hooks/useUserRole';

type CalendarValue = Date | null | [Date | null, Date | null];

const Agenda = () => {
  const { role } = useUserRole();
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*');
    if (data) setEvents(data);
  };

  if (role !== 'gestor') {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-xl">
        <h2 className="text-xl font-bold text-slate-800">Acesso Restrito</h2>
        <p className="text-slate-500">Apenas gestores podem gerenciar a agenda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-black italic">AGENDA <span className="text-blue-600">GLADIATORS</span></h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg">
          <Plus size={20} /> NOVO EVENTO
        </button>
      </div>
      <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
        <Calendar onChange={(val: any) => setSelectedDate(val)} value={selectedDate} 
          tileContent={({ date, view }: any) => {
            if (view === 'month') {
              const dayEvents = events.filter(e => e.date === date.toISOString().split('T')[0]);
              return <div className="flex flex-col gap-1 mt-1">{dayEvents.map((e, i) => <div key={i} className="text-[8px] bg-blue-600 text-white p-1 rounded">{e.title}</div>)}</div>;
            }
          }} 
        />
      </div>
    </div>
  );
};
export default Agenda;