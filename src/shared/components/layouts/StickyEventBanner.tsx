import { useState, useEffect } from 'react';
import { Calendar as CalIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useUserRole } from '../../hooks/useUserRole';

const StickyEventBanner = () => {
  const { userId } = useUserRole();
  const [event, setEvent] = useState<any>(null);
  const [status, setStatus] = useState<'none' | 'confirmed' | 'excused'>('none');

  useEffect(() => {
    const fetchEvent = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase.from('events').select('*').gte('date', today).order('date', { ascending: true }).limit(1).single();
      if (data) {
        setEvent(data);
        const { data: pres } = await supabase.from('event_presences').select('status').eq('event_id', data.id).eq('athlete_id', userId).maybeSingle();
        if (pres) setStatus(pres.status as any);
      }
    };
    fetchEvent();
  }, [userId]);

  const updatePresence = async (newStatus: 'confirmed' | 'excused') => {
    if (!event) return;
    const { error } = await supabase.from('event_presences').upsert({
      event_id: event.id,
      athlete_id: userId,
      status: newStatus
    });
    if (!error) setStatus(newStatus);
  };

  if (!event) return null;

  return (
    <div className="bg-[#0f172a] text-white px-6 py-2 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <CalIcon size={14} className="text-blue-400" />
        <span className="text-sm font-bold">{event.title}</span>
        <span className="text-slate-400 text-xs flex items-center gap-1"><Clock size={12}/> {event.start_time?.slice(0,5)}</span>
      </div>
      <div className="flex gap-2">
        {status === 'none' ? (
          <>
            <button onClick={() => updatePresence('confirmed')} className="bg-green-600 px-4 py-1.5 rounded-lg text-xs font-black">CONFIRMAR</button>
            <button onClick={() => updatePresence('excused')} className="bg-slate-800 px-4 py-1.5 rounded-lg text-xs font-black">JUSTIFICAR</button>
          </>
        ) : (
          <div className="text-[10px] font-black uppercase text-blue-400 border border-blue-500/30 px-3 py-1 rounded-md">
            Status: {status === 'confirmed' ? 'Confirmado' : 'Justificado'}
          </div>
        )}
      </div>
    </div>
  );
};
export default StickyEventBanner;