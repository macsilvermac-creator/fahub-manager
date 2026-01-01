import { useState, useEffect } from 'react';
import { Calendar as CalIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const StickyEventBanner = () => {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNextEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true })
          .order('start_time', { ascending: true })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Erro ao buscar evento:', error);
        } else if (data) {
          setEvent(data);
        }
      } catch (err) {
        console.error('Erro de conexão:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNextEvent();
  }, []);

  if (loading || !event) return null;

  return (
    <div className="bg-[#0f172a] border-b border-slate-800 text-white px-6 py-2.5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="bg-blue-500/20 p-1.5 rounded-lg border border-blue-500/40 hidden sm:block">
          <CalIcon size={14} className="text-blue-400" />
        </div>
        <div className="flex items-center gap-3 whitespace-nowrap">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Próximo Evento:</span>
          <span className="text-sm font-bold tracking-tight truncate">{event.title}</span>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-700">
            <Clock size={12} />
            <span>{event.start_time?.slice(0, 5)}</span>
          </div>
          {event.modality === 'flag' && (
            <span className="bg-orange-600/20 text-orange-400 text-[9px] font-black px-2 py-0.5 rounded border border-orange-500/30 uppercase tracking-tighter">
              Flag
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => alert('Funcionalidade de presença em desenvolvimento')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-green-900/20 active:scale-95"
        >
          <CheckCircle2 size={14} /> 
          <span className="hidden xs:inline uppercase">Confirmar Presença</span>
          <span className="xs:hidden">Confirmar</span>
        </button>
        
        <button 
          className="text-slate-400 hover:text-white transition-colors p-1"
          title="Justificar ausência"
        >
          <AlertCircle size={16} />
        </button>
      </div>
    </div>
  );
};

export default StickyEventBanner;