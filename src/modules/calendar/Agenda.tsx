import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import { supabase } from '../../lib/supabase';
import { Plus, ShieldAlert } from 'lucide-react';

type CalendarValue = Date | null | [Date | null, Date | null];

const Agenda = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Controle de Perfil (Altere para 'atleta' para testar o bloqueio)
  const [userRole] = useState<'gestor' | 'atleta'>('gestor');

  const [formData, setFormData] = useState({
    title: '',
    modality: 'tackle',
    start_time: '19:30',
    date: new Date().toISOString().split('T')[0],
    location: 'Campo do Grêmio',
    description: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*');
    if (data) setEvents(data);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== 'gestor') return;

    const { error } = await supabase.from('events').insert([formData]);
    if (!error) {
      setIsModalOpen(false);
      fetchEvents();
    } else {
      alert('Erro: ' + error.message);
    }
  };

  const handleDateChange = (value: CalendarValue) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setFormData(prev => ({ ...prev, date: value.toISOString().split('T')[0] }));
    }
  };

  const renderTileContent = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') {
      const dayEvents = events.filter(e => e.date === date.toISOString().split('T')[0]);
      return (
        <div className="flex flex-col gap-1 mt-1 w-full overflow-hidden">
          {dayEvents.map((event, idx) => (
            <div key={idx} className={`text-[9px] p-1 rounded border truncate font-bold ${
              event.modality === 'flag' ? 'bg-orange-500 text-white border-orange-600' : 'bg-blue-600 text-white border-blue-700'
            }`}>
              {event.start_time?.slice(0,5)} {event.title}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight italic">AGENDA <span className="text-blue-600">GLADIATORS</span></h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
            Visualização: {userRole === 'gestor' ? 'Administrador' : 'Atleta'}
          </p>
        </div>
        
        {userRole === 'gestor' && (
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center gap-2 font-bold shadow-lg shadow-blue-900/20 transition-all"
          >
            <Plus size={20} /> NOVO EVENTO
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
        <Calendar 
          onChange={handleDateChange} 
          value={selectedDate} 
          tileContent={renderTileContent} 
          className="rounded-2xl border-none w-full" 
        />
      </div>

      {isModalOpen && userRole === 'gestor' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold mb-6 text-slate-800">Novo Evento na Agenda</h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Título</label>
                <input className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50" required
                  onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" className="border border-slate-200 rounded-xl p-3 bg-slate-50" value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})} />
                <input type="time" className="border border-slate-200 rounded-xl p-3 bg-slate-50" value={formData.start_time} 
                  onChange={e => setFormData({...formData, start_time: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95">
                SALVAR EVENTO
              </button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-full text-slate-400 text-xs font-bold mt-2">CANCELAR</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;