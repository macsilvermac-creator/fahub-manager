
:root {
  --team-primary: #059669;
  --highlight: #059669;
}

body {
  background-color: #0B1120;
  color: #f1f5f9;
  font-family: 'Inter', sans-serif;
  overscroll-behavior: none;
}

/* Efeito Holográfico */
.holographic-glow {
  position: relative;
  overflow: hidden;
}

.holographic-glow::after {
  content: "";
  position: absolute;
  top: -150%;
  left: -150%;
  width: 300%;
  height: 300%;
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(255, 255, 255, 0.03) 45%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.03) 55%,
    transparent 100%
  );
  transform: rotate(-45deg);
  transition: all 0.8s;
  pointer-events: none;
}

.holographic-glow:hover::after {
  top: -50%;
  left: -50%;
}

/* Animação de Shimmer */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 3s infinite linear;
}

/* Pulse Neon */
@keyframes neon-pulse {
  0%, 100% { box-shadow: 0 0 15px rgba(5, 150, 105, 0.2); }
  50% { box-shadow: 0 0 30px rgba(5, 150, 105, 0.5); }
}

.shadow-neon {
  animation: neon-pulse 3s infinite ease-in-out;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.glass-panel {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
