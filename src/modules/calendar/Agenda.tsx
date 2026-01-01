import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import { supabase } from '../../lib/supabase';
import { Plus, Users, Clock, MapPin, Info } from 'lucide-react';
import Modal from '../../shared/components/Modal';

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
              className={`text-[10px] p-1 rounded border truncate ${
                event.modality === 'flag' 
                ? 'bg-orange-50 border-orange-200 text-orange-700' 
                : 'bg-blue-50 border-blue-200 text-blue-700'
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Agenda Gladiators</h2>
          <p className="text-slate-500">Gestão de treinos, jogos e eventos</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Tackle</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded-full"></span> Flag</span>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} /> Novo Evento
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <Calendar 
          onChange={setSelectedDate} 
          value={selectedDate}
          tileContent={renderTileContent}
          className="rounded-xl overflow-hidden"
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Agendar Evento">
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <input 
                className="w-full border rounded-lg p-2" 
                placeholder="Ex: Treino de Defesa"
                required
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Horário</label>
              <input 
                type="time" 
                className="w-full border rounded-lg p-2"
                value={formData.start_time}
                onChange={e => setFormData({...formData, start_time: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Modalidade</label>
              <select 
                className="w-full border rounded-lg p-2"
                onChange={e => setFormData({...formData, modality: e.target.value})}
              >
                <option value="tackle">Tackle (Full-Pads)</option>
                <option value="flag">Flag Football</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select 
                className="w-full border rounded-lg p-2"
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option>Treino de Unidade</option>
                <option>Treino Coletivo</option>
                <option>Jogo / Amistoso</option>
                <option>Reunião de Vídeo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Público-Alvo</label>
            <select 
              className="w-full border rounded-lg p-2"
              onChange={e => setFormData({...formData, target_audience: e.target.value})}
            >
              <option value="all">Todos os Atletas</option>
              <option value="offense">Ataque</option>
              <option value="defense">Defesa</option>
              <option value="staff">Apenas Staff</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição / Instruções</label>
            <textarea 
              className="w-full border rounded-lg p-2 h-24"
              placeholder="Ex: Trazer capacete e shoulder. Aquecimento pontual."
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
            Confirmar Agendamento
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Agenda;