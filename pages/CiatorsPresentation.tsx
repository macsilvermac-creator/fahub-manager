
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { TacticalPlay } from '../types';
import { XIcon, EraserIcon, WhistleIcon, PenIcon } from '../components/icons/UiIcons';

const CiatorsPresentation: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
    const [play, setPlay] = useState<TacticalPlay | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [penColor, setPenColor] = useState('#22d3ee');

    useEffect(() => {
        const found = storageService.getTacticalPlays().find(p => p.id === id);
        if (found) setPlay(found);
        else navigate('/ciators');
    }, [id, navigate]);

    const renderBase = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !play) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const w = canvas.width = window.innerWidth;
        const h = canvas.height = window.innerHeight;

        // Fundo Verde Coach Escuro
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(0, 0, w, h);

        // Grid Sutil para Referência
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i < w; i += 80) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
        for (let i = 0; i < h; i += 80) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

        // Elementos Táticos (Escalados)
        const sX = w / 600;
        const sY = h / 400;

        play.elements.forEach(el => {
            const px = el.x * sX;
            const py = el.y * sY;
            
            ctx.beginPath();
            ctx.arc(px, py, 22 * sX, 0, Math.PI * 2);
            ctx.fillStyle = el.type === 'OFFENSE' ? '#0ea5e9' : '#ef4444';
            ctx.fill();
            
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = `black ${18 * sX}px Inter, Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(el.label, px, py + (7 * sX));
        });
    }, [play]);

    useEffect(() => {
        renderBase();
        window.addEventListener('resize', renderBase);
        return () => window.removeEventListener('resize', renderBase);
    }, [renderBase]);

    const handleDrawStart = (e: any) => {
        setIsDrawing(true);
        const ctx = overlayCanvasRef.current?.getContext('2d');
        if (!ctx) return;
        const rect = overlayCanvasRef.current!.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = penColor;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 10;
        ctx.shadowColor = penColor;
    };

    const handleDrawMove = (e: any) => {
        if (!isDrawing) return;
        const ctx = overlayCanvasRef.current?.getContext('2d');
        const rect = overlayCanvasRef.current!.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
        ctx?.lineTo(x, y);
        ctx?.stroke();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black overflow-hidden select-none cursor-crosshair">
            <canvas ref={canvasRef} className="absolute inset-0" />
            <canvas 
                ref={overlayCanvasRef} 
                width={window.innerWidth} 
                height={window.innerHeight} 
                className="absolute inset-0 z-10"
                onMouseDown={handleDrawStart}
                onMouseMove={handleDrawMove}
                onMouseUp={() => setIsDrawing(false)}
                onTouchStart={handleDrawStart}
                onTouchMove={handleDrawMove}
                onTouchEnd={() => setIsDrawing(false)}
            />

            {/* UI Overlay */}
            <div className="absolute top-8 left-8 right-8 z-20 flex justify-between items-start pointer-events-none">
                <div className="bg-black/80 backdrop-blur-2xl border border-white/10 p-6 rounded-[2.5rem] pointer-events-auto shadow-2xl animate-fade-in">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-cyan-600 rounded-2xl shadow-glow-blue">
                             <WhistleIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{play?.name}</h2>
                            <p className="text-xs text-cyan-400 font-bold uppercase tracking-[0.3em] mt-2 italic">Apresentação Técnica Ativa</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pointer-events-auto animate-fade-in">
                    <div className="bg-black/80 backdrop-blur-2xl border border-white/10 p-3 rounded-[2rem] flex gap-3 shadow-2xl">
                         {['#22d3ee', '#fbbf24', '#f87171', '#4ade80'].map(c => (
                             <button 
                                key={c} 
                                onClick={() => setPenColor(c)} 
                                className={`w-10 h-10 rounded-xl border-4 transition-all ${penColor === c ? 'border-white scale-110' : 'border-transparent opacity-50'}`} 
                                style={{ backgroundColor: c }} 
                             />
                         ))}
                         <div className="w-px h-10 bg-white/10 mx-1"></div>
                         <button 
                            onClick={() => overlayCanvasRef.current?.getContext('2d')?.clearRect(0,0,window.innerWidth,window.innerHeight)} 
                            className="p-3 text-text-secondary hover:text-white transition-colors"
                            title="Limpar Desenho"
                         >
                            <EraserIcon className="w-6 h-6" />
                         </button>
                    </div>
                    <button 
                        onClick={() => navigate('/ciators')} 
                        className="bg-red-600 hover:bg-red-500 text-white p-6 rounded-[2rem] shadow-2xl active:scale-90 transition-all flex items-center justify-center border border-red-500/50"
                    >
                        <XIcon className="w-8 h-8" />
                    </button>
                </div>
            </div>
            
            {/* Legend Overlay Bottom */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-full flex gap-8 z-20 shadow-2xl pointer-events-none opacity-40">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#0ea5e9]"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Ataque</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Defesa</span>
                </div>
            </div>
        </div>
    );
};

export default CiatorsPresentation;