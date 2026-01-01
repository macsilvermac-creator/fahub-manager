import { useState, useEffect } from 'react';
import { Calendar as CalIcon, Clock, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const StickyEventBanner = () => {
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('events').select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true }).limit(1).single();
      if (data) setEvent(data);
    };
    fetch();
  }, []);

  if (!event) return null;

  return (
    <div className="bg-[#0f172a] border-b border-slate-800 text-white px-6 py-2.5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="bg-blue-500/20 p-1.5 rounded-lg border border-blue-500/40">
          <CalIcon size={14} className="text-blue-400" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Próximo:</span>
          <span className="text-sm font-bold tracking-tight">{event.title}</span>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-700">
            <Clock size={12} /> {event.start_time?.slice(0, 5)}
          </div>
        </div>
      </div>
      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-green-900/20">
        <CheckCircle2 size={14} /> CONFIRMAR PRESENÇA
      </button>
    </div>
  );
};

export default StickyEventBanner;