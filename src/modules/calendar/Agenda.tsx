import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import { supabase } from '../../lib/supabase';
import { Plus, Users, Clock, Info } from 'lucide-react';

const Agenda = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Treino Tackle',
    modality: 'tackle',
    start_time: '19:00',
    target_audience: 'all',
    description: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await supabase.from('events').select('*');
    if (data) setEvents(data);
    setLoading(false);
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
      alert('Erro ao criar evento: ' + error.message);
    }
  };

  const renderTileContent = ({ date, view }: any) => {
    if (view === 'month') {
      const dayEvents = events.filter(e => 
        new Date(e.date).toDateString() === date.toDateString()
      );
      return (
        <div className="flex flex-col gap-1 mt-1 w-full">
          {dayEvents.map((event, idx) => (
            <div 
              key={idx} 
              className={`text-[10px] p-1 rounded border truncate shadow-sm font-bold ${
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
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">AGENDA <span className="text-blue-600">GLADIATORS</span></h2>
          <p className="text-slate-500 text-sm">Gestão Unificada: Tackle & Flag Football</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-600 rounded-full"></span> Tackle</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 bg-orange-500 rounded-full"></span> Flag</span>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-900/20"
          >
            <Plus size={18} /> NOVO EVENTO
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
        <Calendar 
          onChange={setSelectedDate} 
          value={selectedDate}
          tileContent={renderTileContent}
          className="rounded-2xl border-none"
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
              <Plus className="text-blue-600" /> Agendar Novo Compromisso
            </h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Título</label>
                  <input 
                    className="w-full border-slate-200 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    placeholder="Ex: Treino de Defesa"
                    required
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Horário</label>
                  <input 
                    type="time" 
                    className="w-full border-slate-200 rounded-xl p-3 bg-slate-50 outline-none"
                    value={formData.start_time}
                    onChange={e => setFormData({...formData, start_time: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Modalidade</label>
                  <select 
                    className="w-full border-slate-200 rounded-xl p-3 bg-slate-50 outline-none font-bold"
                    onChange={e => setFormData({...formData, modality: e.target.value})}
                  >
                    <option value="tackle">Tackle (Full-Pads)</option>
                    <option value="flag">Flag Football</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Tipo de Evento</label>
                  <select 
                    className="w-full border-slate-200 rounded-xl p-3 bg-slate-50 outline-none"
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option>Treino Coletivo</option>
                    <option>Treino de Unidade</option>
                    <option>Jogo / Amistoso</option>
                    <option>Reunião de Vídeo</option>
                    <option>Evento Social</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Público-Alvo</label>
                <select 
                  className="w-full border-slate-200 rounded-xl p-3 bg-slate-50 outline-none"
                  onChange={e => setFormData({...formData, target_audience: e.target.value})}
                >
                  <option value="all">Todos os Atletas</option>
                  <option value="offense">Ataque</option>
                  <option value="defense">Defesa</option>
                  <option value="staff">Apenas Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Descrição</label>
                <textarea 
                  className="w-full border-slate-200 rounded-xl p-3 bg-slate-50 h-24 outline-none"
                  placeholder="Instruções para o elenco..."
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
                >
                  Salvar na Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;