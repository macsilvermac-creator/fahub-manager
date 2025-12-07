
import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { TeamSettings } from '../types';
import { authService } from '../services/authService';

const PrintLayout: React.FC = () => {
    const [settings, setSettings] = useState<TeamSettings | null>(null);
    const [currentUser, setCurrentUser] = useState<string>('');

    useEffect(() => {
        setSettings(storageService.getTeamSettings());
        const user = authService.getCurrentUser();
        if (user) setCurrentUser(user.name);
    }, []);

    if (!settings) return null;

    return (
        <div className="hidden print:flex flex-col fixed inset-0 z-50 pointer-events-none text-black h-screen justify-between p-8">
            {/* BACKGROUND WATERMARK */}
            <div className="absolute inset-0 flex items-center justify-center z-[-1] opacity-[0.03]">
                <img src={settings.logoUrl} alt="Watermark" className="w-3/4 object-contain grayscale" />
            </div>

            {/* HEADER */}
            <div className="flex items-center border-b-2 border-gray-800 pb-4 mb-6">
                <img src={settings.logoUrl} alt="Logo" className="w-20 h-20 object-contain mr-6" />
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-widest text-gray-900">{settings.teamName}</h1>
                    <div className="text-sm text-gray-600 mt-1 flex flex-col">
                        <span>{settings.address}</span>
                        <span className="flex gap-4">
                            {settings.website && <span>🌐 {settings.website}</span>}
                            {settings.contactEmail && <span>📧 {settings.contactEmail}</span>}
                        </span>
                    </div>
                </div>
            </div>

            {/* SPACER FOR CONTENT (The actual page content will render normally in the flow, this component just adds decoration) */}
            <div className="flex-1"></div>

            {/* FOOTER */}
            <div className="border-t border-gray-300 pt-2 mt-4 text-[10px] text-gray-500 flex justify-between items-center">
                <span>Documento gerado oficialmente via Gridiron OS Platform.</span>
                <div className="text-right">
                    <p>Impresso por: <strong>{currentUser}</strong></p>
                    <p>Data: {new Date().toLocaleString('pt-BR')}</p>
                </div>
            </div>
        </div>
    );
};

export default PrintLayout;
