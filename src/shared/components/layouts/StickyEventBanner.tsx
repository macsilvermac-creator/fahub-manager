import { useState, useEffect } from 'react';
import { Calendar as CalIcon, Clock, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const StickyEventBanner = () => {
  const [event, setEvent] = useState<any>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase.from('events')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(1)
        .single();
      
      if (data) {
        setEvent(data);
        checkExistingPresence(data.id);
      }
    };
    fetchEvent();
  }, []);

  const checkExistingPresence = async (eventId: string) => {
    const { data } = await supabase.from('event_presences')
      .select('*')
      .eq('event_id', eventId)
      .limit(1);
    
    if (data && data.length > 0) setConfirmed(true);
  };

  const handlePresence = async () => {
    if (!event) return;

    // Obtém o primeiro atleta para simulação de teste
    const athleteRes = await supabase.from('athletes').select('id').limit(1).single();
    if (!athleteRes.data) return;

    const { error } = await supabase.from('event_presences').upsert({
      event_id: event.id,
      athlete_id: athleteRes.data.id,
      status: 'confirmed'
    });

    if (!error) {
      setConfirmed(true);
    }
  };

  if (!event) return null;

  return (
    <div className="bg-[#0f172a] border-b border-slate-800 text-white px-6 py-2 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
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

      <button 
        onClick={handlePresence}
        disabled={confirmed}
        className={`${
          confirmed ? 'bg-slate-700 opacity-50 cursor-default' : 'bg-green-600 hover:bg-green-700 shadow-green-900/20 active:scale-95'
        } text-white px-5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-2 shadow-lg`}
      >
        <CheckCircle2 size={14} /> 
        {confirmed ? 'PRESENÇA CONFIRMADA' : 'CONFIRMAR PRESENÇA'}
      </button>
    </div>
  );
};

export default StickyEventBanner;