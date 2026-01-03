import React, { useState, useEffect } from 'react';

// Tipagem expandida para cobrir todos os módulos do Nexus
interface JulesAgentProps {
  context: 'DASHBOARD' | 'FINANCE' | 'PEOPLE' | 'SETTINGS' | 'CALENDAR' | 'STRATEGY' | 'MARKETING';
}

const JulesAgent: React.FC<JulesAgentProps> = ({ context }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Simulação de Inteligência Contextual (O "Cérebro")
  useEffect(() => {
    // Reseta visualização ao mudar de contexto
    setVisible(false);
    setIsAnimating(false);
    
    // Timer inteligente: Demora um pouco para "pensar" e não atrapalhar a navegação rápida
    const timer = setTimeout(() => {
      generateInsight();
      setVisible(true);
      // Pequeno delay para a animação CSS entrar suave
      setTimeout(() => setIsAnimating(true), 50);
    }, 2000);

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
      case 'CALENDAR':
        setMessage('Detectei um conflito de horários no Campo 2 para a próxima terça-feira (Treino Base vs Manutenção). Sugiro mover o treino para as 18:00.');
        break;
      case 'STRATEGY':
        setMessage('A meta de "Venda de Ingressos" está 12% abaixo do esperado para o trimestre. Deseja ativar uma campanha relâmpago no Instagram?');
        break;
      case 'MARKETING':
        setMessage('O engajamento no último post foi 40% superior à média. Sugiro impulsionar este conteúdo com R$ 200,00.');
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
    
    // Animação de saída
    setIsAnimating(false);
    setTimeout(() => setVisible(false), 500); 
    
    // Feedback visual (opcional)
    if (action === 'AUTHORIZE') {
      // Aqui entraria a lógica real de execução da IA
      alert("Comando enviado para processamento pelo Núcleo Nexus.");
    }
  };

  if (!visible) return null;

  return (
    <div className={`fixed bottom-6 left-0 right-0 px-4 flex justify-center z-[100] pointer-events-none transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 scale-95'}`}>
      {/* Container Principal Glassmorphism */}
      <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-indigo-500/50 p-1 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.25)] max-w-3xl w-full flex flex-col md:flex-row items-center gap-4 pr-2 pointer-events-auto ring-1 ring-white/10">
        
        {/* Avatar Jules (Animado) */}
        <div className="p-3 bg-indigo-600/20 rounded-xl border border-indigo-500/30 flex-shrink-0 relative group overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500 blur-md opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse"></div>
          <span className="text-2xl relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">🤖</span>
        </div>

        {/* Texto do Insight */}
        <div className="flex-1 py-2 text-center md:text-left">
          <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1 flex items-center gap-2 justify-center md:justify-start">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
            JULES • {context} INTELLIGENCE
          </p>
          <p className="text-sm text-slate-200 font-medium leading-snug">
            {message}
          </p>
        </div>

        {/* Botões de Decisão (Human-in-the-Loop) */}
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => handleAction('IGNORE')}
            className="flex-1 md:flex-none px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 text-[10px] uppercase font-bold border border-slate-700 transition"
          >
            Ignorar
          </button>
          <button 
            onClick={() => handleAction('AUTHORIZE')}
            className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] uppercase font-black border border-indigo-400 shadow-lg shadow-indigo-500/20 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>✓</span> Autorizar
          </button>
        </div>

      </div>
    </div>
  );
};

export default JulesAgent;