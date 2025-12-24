
import React, { useState, useRef } from 'react';
import { LegalDocument } from '../types';
import { ShieldCheckIcon, LockIcon } from './icons/UiIcons';

interface ComplianceModalProps {
    document: LegalDocument;
    onSign: () => void;
}

const ComplianceModal: React.FC<ComplianceModalProps> = ({ document, onSign }) => {
    const [hasRead, setHasRead] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (contentRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
            // Check if user scrolled to bottom (with small tolerance)
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                setHasRead(true);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-secondary w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-900 to-secondary p-6 border-b border-white/10 flex items-center gap-4">
                    <div className="bg-red-500/20 p-3 rounded-full">
                        <ShieldCheckIcon className="w-8 h-8 text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Termos de Uso Obrigatórios</h2>
                        <p className="text-red-300 text-sm">Ação Necessária: Segurança e Compliance Financeiro</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 overflow-hidden flex flex-col">
                    <p className="text-text-secondary mb-4 text-sm">
                        Para acessar o módulo financeiro, você deve ler e aceitar o documento abaixo. 
                        Sua assinatura digital será registrada com data, hora e IP para fins de auditoria.
                    </p>
                    
                    <div className="bg-primary border border-white/5 rounded-lg flex-1 overflow-y-auto p-6 text-sm text-text-secondary leading-relaxed font-mono custom-scrollbar"
                         ref={contentRef}
                         onScroll={handleScroll}
                    >
                        <h3 className="font-bold text-white mb-4 text-lg text-center uppercase border-b border-white/10 pb-2">{document.title}</h3>
                        <div className="whitespace-pre-line">
                            {document.content}
                        </div>
                        <div className="mt-8 pt-4 border-t border-white/10 text-center text-xs text-gray-500">
                            --- Fim do Documento (Versão {document.version}) ---
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-secondary/50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <LockIcon className="w-4 h-4" />
                        <span>Conexão Segura & Logada (Audit Trail)</span>
                    </div>
                    
                    <button 
                        onClick={onSign}
                        disabled={!hasRead}
                        className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 ${hasRead ? 'bg-green-600 hover:bg-green-500 text-white cursor-pointer' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                    >
                        {hasRead ? (
                            <>
                                <ShieldCheckIcon className="w-5 h-5" />
                                Li, Compreendi e Aceito
                            </>
                        ) : (
                            "Role até o fim para aceitar"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComplianceModal;
