import { useState, useEffect } from 'react';
import { Calendar as CalIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const StickyEventBanner = () => {
  const [event, setEvent] = useState<any>(null);
  const [status, setStatus] = useState<'none' | 'confirmed' | 'excused'>('none');

  useEffect(() => {
    const fetchEvent = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase.from('events').select('*')
        .gte('date', today).order('date', { ascending: true }).limit(1).single();
      
      if (data) {
        setEvent(data);
        checkStatus(data.id);
      }
    };
    fetchEvent();
  }, []);

  const checkStatus = async (eventId: string) => {
    const { data } = await supabase.from('event_presences').select('status').eq('event_id', eventId).limit(1).single();
    if (data) setStatus(data.status as any);
  };

  const updatePresence = async (newStatus: 'confirmed' | 'excused') => {
    const athleteRes = await supabase.from('athletes').select('id').limit(1).single();
    if (!athleteRes.data) return;

    let justification = '';
    if (newStatus === 'excused') {
      justification = prompt('Por favor, informe o motivo da ausência:') || 'Não informado';
    }

    const { error } = await supabase.from('event_presences').upsert({
      event_id: event.id,
      athlete_id: athleteRes.data.id,
      status: newStatus,
      justification: justification
    });

    if (!error) setStatus(newStatus);
  };

  if (!event) return null;

  return (
    <div className="bg-[#0f172a] border-b border-slate-800 text-white px-6 py-2 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="bg-blue-500/20 p-1.5 rounded-lg border border-blue-500/40">
          <CalIcon size={14} className="text-blue-400" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">PRÓXIMO:</span>
          <span className="text-sm font-bold tracking-tight">{event.title}</span>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-700">
            <Clock size={12} /> {event.start_time?.slice(0, 5)}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {status === 'none' ? (
          <>
            <button 
              onClick={() => updatePresence('confirmed')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-2"
            >
              <CheckCircle2 size={14} /> CONFIRMAR
            </button>
            <button 
              onClick={() => updatePresence('excused')}
              className="bg-slate-800 hover:bg-red-900/40 text-slate-300 hover:text-red-400 border border-slate-700 px-4 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-2"
            >
              <AlertCircle size={14} /> JUSTIFICAR
            </button>
          </>
        ) : (
          <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-2 border ${
            status === 'confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
          }`}>
            {status === 'confirmed' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            {status === 'confirmed' ? 'PRESENÇA CONFIRMADA' : 'AUSÊNCIA JUSTIFICADA'}
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyEventBanner;