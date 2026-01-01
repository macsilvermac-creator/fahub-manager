import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import { supabase } from '../../lib/supabase';
import { Plus } from 'lucide-react';

// Tipo para suportar os diferentes retornos do componente Calendar
type CalendarValue = Date | null | [Date | null, Date | null];

const Agenda = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [formData, setFormData] = useState({
    title: '',
    type: 'Treino Coletivo',
    modality: 'tackle',
    start_time: '19:30',
    target_audience: 'all',
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
    const { error } = await supabase.from('events').insert([{
      ...formData,
      date: selectedDate.toISOString(),
    }]);

    if (!error) {
      setIsModalOpen(false);
      fetchEvents();
    } else {
      alert('Erro ao salvar evento: ' + error.message);
    }
  };

  const handleDateChange = (value: CalendarValue) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      setSelectedDate(value[0]);
    }
  };

  const renderTileContent = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') {
      const dayEvents = events.filter(e => 
        new Date(e.date).toDateString() === date.toDateString()
      );
      return (
        <div className="flex flex-col gap-1 mt-1 w-full overflow-hidden">
          {dayEvents.map((event, idx) => (
            <div 
              key={idx} 
              className={`text-[9px] p-1 rounded border truncate font-bold ${
                event.modality === 'flag' 
                ? 'bg-orange-500 text-white border-orange-600' 
                : 'bg-blue-600 text-white border-blue-700'
              }`}
            >
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
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">AGENDA <span className="text-blue-600">GLADIATORS</span></h2>
          <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mt-1">Gestão de Campo: Tackle & Flag</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus size={20} /> NOVO EVENTO
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
        <Calendar 
          onChange={handleDateChange} 
          value={selectedDate}
          tileContent={renderTileContent}
          className="rounded-2xl border-none w-full"
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold mb-6 text-slate-800">Agendar Compromisso</h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Título</label>
                  <input 
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50" 
                    required
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Horário</label>
                  <input 
                    type="time" 
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50"
                    value={formData.start_time} 
                    onChange={e => setFormData({...formData, start_time: e.target.value})} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Modalidade</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 font-bold"
                    onChange={e => setFormData({...formData, modality: e.target.value})}
                  >
                    <option value="tackle">Tackle</option>
                    <option value="flag">Flag Football</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Público</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50"
                    onChange={e => setFormData({...formData, target_audience: e.target.value})}
                  >
                    <option value="all">Todos</option>
                    <option value="offense">Ataque</option>
                    <option value="defense">Defesa</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Descrição</label>
                <textarea 
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 h-24"
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all">
                Confirmar Agendamento
              </button>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="w-full text-slate-400 text-sm font-medium mt-2"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;