
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { TacticalPlay } from '../types';
import { XIcon, EraserIcon, WhistleIcon } from '../components/icons/UiIcons';

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

    // Usando RequestAnimationFrame para um desenho mais suave e menos pesado
    const renderBase = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !play) return;
        const ctx = canvas.getContext('2d', { alpha: false }); // Alpha false otimiza performance
        if (!ctx) return;

        const w = canvas.width = window.innerWidth;
        const h = canvas.height = window.innerHeight;

        // Fundo Coach
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(0, 0, w, h);

        // Grid sutil
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i < w; i += 60) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
        for (let i = 0; i < h; i += 60) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

        // Elementos Táticos
        const sX = w / 600;
        const sY = h / 400;

        play.elements.forEach(el => {
            const px = el.x * sX;
            const py = el.y * sY;
            ctx.beginPath();
            ctx.arc(px, py, 18 * sX, 0, Math.PI * 2);
            ctx.fillStyle = el.type === 'OFFENSE' ? '#0ea5e9' : '#ef4444';
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = `bold ${14 * sX}px Inter`;
            ctx.textAlign = 'center';
            ctx.fillText(el.label, px, py + (6 * sX));
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
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = penColor;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 8;
        ctx.shadowColor = penColor;
    };

    const handleDrawMove = (e: any) => {
        if (!isDrawing) return;
        const ctx = overlayCanvasRef.current?.getContext('2d');
        const rect = overlayCanvasRef.current!.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
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

            <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-3xl pointer-events-auto shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-cyan-600 rounded-2xl">
                             <WhistleIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase italic leading-none">{play?.name}</h2>
                            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-1">Presentation Active</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pointer-events-auto">
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex gap-2">
                         {['#22d3ee', '#fbbf24', '#f87171', '#4ade80'].map(c => (
                             <button key={c} onClick={() => setPenColor(c)} className={`w-8 h-8 rounded-lg border-2 ${penColor === c ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                         ))}
                         <button onClick={() => overlayCanvasRef.current?.getContext('2d')?.clearRect(0,0,window.innerWidth,window.innerHeight)} className="p-2 text-text-secondary hover:text-white"><EraserIcon className="w-6 h-6" /></button>
                    </div>
                    <button onClick={() => navigate('/ciators')} className="bg-red-600 text-white p-4 rounded-2xl shadow-xl active:scale-90 transition-all"><XIcon className="w-6 h-6" /></button>
                </div>
            </div>
        </div>
    );
};

export default CiatorsPresentation;
