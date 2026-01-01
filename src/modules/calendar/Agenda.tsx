import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import { supabase } from '../../lib/supabase';
import { Plus } from 'lucide-react';

const Agenda = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*');
    if (data) setEvents(data);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">AGENDA <span className="text-blue-600">NEXUS</span></h2>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2 font-bold transition-all">
          <Plus size={18} /> NOVO EVENTO
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <Calendar 
          onChange={setSelectedDate} 
          value={selectedDate}
          className="rounded-2xl border-none w-full"
        />
      </div>
    </div>
  );
};

export default Agenda;