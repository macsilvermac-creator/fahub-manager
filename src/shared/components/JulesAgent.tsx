import React, { useState, useEffect } from 'react';

interface JulesAgentProps {
  context: 'DASHBOARD' | 'FINANCE' | 'PEOPLE' | 'SETTINGS';
}

const JulesAgent: React.FC<JulesAgentProps> = ({ context }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Simulação de Inteligência Contextual (O "Cérebro")
  useEffect(() => {
    // Reseta
    setVisible(false);
    
    // Timer para simular o processamento da IA (2.5 segundos para não ser intrusivo)
    const timer = setTimeout(() => {
      generateInsight();
      setVisible(true);
      setIsAnimating(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [context]);

  const generateInsight = () => {
    switch (context) {
      case 'FINANCE':
        setMessage('Analisei os contratos de patrocínio. O contrato da "Red Zone Energy" vence em 15 dias. Deseja gerar uma minuta de renovação automática?');
        break;
      case 'PEOPLE':
        setMessage('Atenção: 3 atletas da Defesa apresentaram queda de 20% no rendimento físico esta semana. Sugiro agendar avaliação com a Fisioterapia.');
        break;
      case 'SETTINGS':
        setMessage('O Google Drive da entidade "Flag Football" está 90% cheio. Deseja autorizar a limpeza de arquivos de vídeo antigos (2023)?');
        break;
      case 'DASHBOARD':
      default:
        setMessage('Detectei um padrão de atraso de 15% nas mensalidades da Base este mês. Deseja disparar lembretes automáticos via WhatsApp?');
        break;
    }
  };

  const handleAction = (action: string) => {
    console.log(`[JULES - ${context}] Ação do Humano: ${action}`);
    setIsAnimating(false);
    setTimeout(() => setVisible(false), 300); // Fecha suavemente
  };

  if (!visible) return null;

  return (
    <div className={`fixed bottom-6 left-0 right-0 px-4 flex justify-center z-50 transition-all duration-500 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Container Principal Glassmorphism */}
      <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-indigo-500/50 p-1 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.4)] max-w-3xl w-full flex flex-col md:flex-row items-center gap-4 pr-2">
        
        {/* Avatar Jules (Animado) */}
        <div className="p-3 bg-indigo-600/20 rounded-xl border border-indigo-500/30 flex-shrink-0 relative group">
          <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse"></div>
          <span className="text-2xl relative z-10">🤖</span>
        </div>

        {/* Texto do Insight */}
        <div className="flex-1 py-2 text-center md:text-left">
          <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1 flex items-center gap-2 justify-center md:justify-start">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            JULES • {context} INTELLIGENCE
          </p>
          <p className="text-sm text-white font-medium leading-snug">
            {message}
          </p>
        </div>

        {/* Botões de Decisão (Human-in-the-Loop) */}
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => handleAction('IGNORE')}
            className="flex-1 md:flex-none px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition"
          >
            IGNORAR
          </button>
          <button 
            onClick={() => handleAction('AUTHORIZE')}
            className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold border border-indigo-400 shadow-lg shadow-indigo-500/20 transition transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>✓</span> AUTORIZAR
          </button>
        </div>

      </div>
    </div>
  );
};

export default JulesAgent;
