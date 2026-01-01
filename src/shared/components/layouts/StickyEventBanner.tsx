import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const StickyEventBanner = () => {
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [userResponse, setUserResponse] = useState<string | null>(null);

  useEffect(() => {
    fetchNextEvent();
  }, []);

  const fetchNextEvent = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })
      .limit(1)
      .single();

    if (data) setNextEvent(data);
  };

  if (!nextEvent) return null;

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white px-6 py-2 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="bg-blue-600/20 p-1.5 rounded-lg border border-blue-500/30">
          <Calendar size={16} className="text-blue-400" />
        </div>
        <div className="flex items-center gap-3 whitespace-nowrap">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Próximo Evento:</span>
          <span className="text-sm font-medium truncate">{nextEvent.title}</span>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
            <Clock size={12} />
            {new Date(nextEvent.date).toLocaleDateString('pt-BR')} às {nextEvent.start_time?.slice(0, 5)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!userResponse ? (
          <>
            <button 
              onClick={() => setUserResponse('confirmed')}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs font-bold transition-all shadow-lg shadow-green-900/20"
            >
              <CheckCircle2 size={14} /> Confirmar
            </button>
            <button 
              onClick={() => setUserResponse('justified')}
              className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-md text-xs font-bold transition-all"
            >
              <XCircle size={14} /> Justificar
            </button>
          </>
        ) : (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold border ${
            userResponse === 'confirmed' ? 'bg-green-600/10 border-green-500/50 text-green-400' : 'bg-yellow-600/10 border-yellow-500/50 text-yellow-400'
          }`}>
            {userResponse === 'confirmed' ? 'Presença Confirmada' : 'Justificativa Enviada'}
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyEventBanner;