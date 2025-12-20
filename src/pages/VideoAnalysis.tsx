
import React, { useState, useEffect, useContext, useRef } from 'react';
import Card from '../components/Card';
/* Fix: Correcting type imports */
import { VideoClip, VideoTag, UserRole, Player } from '../types';
import { storageService } from '../services/storageService';
import { predictPlayCall } from '../services/geminiService';
import { VideoIcon } from '../components/icons/NavIcons';
import { ScissorsIcon, FilterIcon, PlayCircleIcon, CheckCircleIcon, TrashIcon, SparklesIcon, AlertCircleIcon, PenIcon, EraserIcon, BrainIcon, EyeIcon, TrendingUpIcon, SearchIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';
import Modal from '../components/Modal';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import LazyImage from '../components/LazyImage';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface VideoSource {
    id: string;
    title: string;
    url: string;
    type: 'YOUTUBE' | 'LOCAL' | 'VIMEO' | 'DRIVE';
}

const VideoAnalysis: React.FC = () => {
    const { currentRole } = useContext(UserContext) as any;
    const [activeTab, setActiveTab] = useState<'CUTTER' | 'LIBRARY' | 'PLAYLISTS' | 'REPORTS'>('CUTTER');
    
    // Refs for Local Player & Canvas
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const [taggingMode, setTaggingMode] = useState<'FULLPADS' | 'FLAG'>('FULLPADS');

    // Video Sources
    const [videoSources, setVideoSources] = useState<VideoSource[]>([
        { id: 'g1', title: 'Gladiators Highlight (Demo)', url: 'https://www.youtube.com/watch?v=2vjPBrBU-TM', type: 'YOUTUBE' }, 
    ]);
    const [selectedGame, setSelectedGame] = useState(videoSources[0].id);
    
    // Add Video Modal
    const [isAddingVideo, setIsAddingVideo] = useState(false);
    const [addVideoTab, setAddVideoTab] = useState<'LINK' | 'FILE'>('LINK');
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [newVideoTitle, setNewVideoTitle] = useState('');
    const [localFile, setLocalFile] = useState<File | null>(null);

    // Data State
    const [clips, setClips] = useState<VideoClip[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    
    // Cutter State
    const [startCut, setStartCut] = useState(0);
    const [endCut, setEndCut] = useState(0);
    
    // Tagging Form
    const [tagData, setTagData] = useState<VideoTag>({
        down: 1, distance: 10, yardLine: 20, hash: 'MIDDLE',
        offensiveFormation: '', defensiveFormation: '',
        offensivePlayCall: '', defensivePlayCall: '',
        personnel: '', result: 'GAIN', gain: 0,
        involvedPlayerIds: [], startX: 50, startY: 50
    });
    const [clipTitle, setClipTitle] = useState('');

    // AI Prediction State
    const [prediction, setPrediction] = useState<{prediction: string, confidence: string, reason: string} | null>(null);
    const [isPredicting, setIsPredicting] = useState(false);

    // Smart Filter
    const [naturalSearch, setNaturalSearch] = useState('');
    const [filteredClips, setFilteredClips] = useState<VideoClip[]>([]);

    // Telestration
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawColor, setDrawColor] = useState('#ffff00');
    const [drawingActive, setDrawingActive] = useState(false);

    const isPlayer = currentRole === 'PLAYER';

    useEffect(() => {
        setClips(storageService.getClips());
        setPlayers(storageService.getPlayers());
        const teamSettings = storageService.getTeamSettings();
        /* Fix: Correct property mapping for sportType */
        if(teamSettings.sportType) {
            const mode: 'FULLPADS' | 'FLAG' = teamSettings.sportType === 'FLAG' ? 'FLAG' : 'FULLPADS';
            setTaggingMode(mode);
        }
    }, []);

    // Smart Filtering Logic (Natural Language Approximation)
    useEffect(() => {
        if (!naturalSearch) {
            setFilteredClips(clips);
            return;
        }
        const query = naturalSearch.toLowerCase();
        const res = clips.filter(c => 
            c.title.toLowerCase().includes(query) || 
            c.tags.offensivePlayCall.toLowerCase().includes(query) ||
            c.tags.result.toLowerCase().includes(query) ||
            (query.includes('passe') && c.tags.offensivePlayCall.toLowerCase().includes('pass')) ||
            (query.includes('corrida') && c.tags.offensivePlayCall.toLowerCase().includes('run')) ||
            (query.includes('touchdown') && c.tags.result === 'TOUCHDOWN')
        );
        setFilteredClips(res);
    }, [naturalSearch, clips]);

    // AI Prediction Handler
    const handlePredictPlay = async () => {
        setIsPredicting(true);
        try {
            const result = await predictPlayCall(clips, tagData.down, tagData.distance);
            setPrediction(result);
        } catch (e) {
            console.error("AI Error", e);
        } finally {
            setIsPredicting(false);
        }
    };

    // --- TELESTRATION ---
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        setDrawingActive(true);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = 3;
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!drawingActive || !isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const stopDrawing = () => setDrawingActive(false);
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        ctx?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
    };

    // --- HELPERS ---
    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (ytMatch && ytMatch[1]) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
        return url;
    };

    return (
        <div className="space-y-6 pb-20 animate-fade-in">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl shadow-glow">
                        <VideoIcon className="text-highlight w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-text-primary italic uppercase tracking-tighter">Video Lab & Film Room</h2>
                        <p className="text-text-secondary text-sm">Análise periódica e Correção Técnica.</p>
                    </div>
                </div>
            </div>

            <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveTab('CUTTER')} className={`px-6 py-3 font-bold text-xs border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'CUTTER' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>
                    <ScissorsIcon className="w-4 h-4" /> FILM CUTTER
                </button>
                <button onClick={() => setActiveTab('LIBRARY')} className={`px-6 py-3 font-bold text-xs border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'LIBRARY' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>
                    BIBLIOTECA
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Player Room">
                         <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
                             <iframe 
                                width="100%" 
                                height="100%" 
                                src={getEmbedUrl(videoSources.find(v => v.id === selectedGame)?.url || '')}
                                title="Video Player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                             ></iframe>
                         </div>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card title="Anotações Técnicas">
                        <p className="text-sm text-text-secondary italic">Estudo de vídeo ativo.</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default VideoAnalysis;