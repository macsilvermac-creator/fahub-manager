import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import { UsersIcon, ShieldCheckIcon, ActivityIcon, CheckCircleIcon } from '@/components/icons/UiIcons';
import LazyImage from '@/components/LazyImage';

const RegisterLab: React.FC = () => {
    const [eligibility, setEligibility] = useState(85);

    const FormSection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
        <div className="bg-black/20 rounded-[2.5rem] border border-white/5 p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5 text-highlight" />
                <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">{title}</h3>
            </div>
            {children}
        </div>
    );

    const inputClass = "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-highlight outline-none transition-all placeholder:text-white/20 font-medium";
    const labelClass = "text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5 block ml-1";

    return (
        <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden">
            <PageHeader title="Register Lab" subtitle="Sua identidade oficial federativa e prontuário de campo." />

            {/* ELIGIBILITY BAR */}
            <div className="bg-secondary/40 rounded-3xl p-6 border border-white/5 shadow-xl">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                        <ShieldCheckIcon className="w-4 h-4 text-highlight" /> Sumula Digital Eligibility
                    </p>
                    <span className="text-lg font-black text-highlight italic">{eligibility}%</span>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-highlight shadow-glow transition-all duration-1000" style={{ width: `${eligibility}%` }}></div>
                </div>
                {eligibility < 100 && (
                    <p className="text-[9px] text-yellow-500 font-bold uppercase mt-2 italic">Atenção: Carregue seu atestado médico para atingir 100%.</p>
                )}
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-y-auto custom-scrollbar pr-2 pb-10">
                
                {/* LEFT: FORM DATA */}
                <div className="lg:col-span-8 space-y-6">
                    <FormSection title="Identity Record" icon={UsersIcon}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Nome Completo</label>
                                <input className={inputClass} value="Lucas Thor Machado" readOnly />
                            </div>
                            <div>
                                <label className={labelClass}>RG (com órgão emissor)</label>
                                <input className={inputClass} placeholder="0.000.000 SSP/SC" />
                            </div>
                            <div>
                                <label className={labelClass}>CPF</label>
                                <input className={inputClass} value="000.000.000-00" readOnly />
                            </div>
                            <div>
                                <label className={labelClass}>Data de Nascimento</label>
                                <input className={inputClass} type="date" value="1995-10-15" />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Field Specs (Súmula)" icon={CheckCircleIcon}>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Posição Primária</label>
                                <select className={inputClass}>
                                    <option>QB</option>
                                    <option>WR</option>
                                    <option>RB</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Jersey Number (#)</label>
                                <input className={inputClass} type="number" value="12" />
                            </div>
                            <div>
                                <label className={labelClass}>Categoria</label>
                                <input className={inputClass} value="Senior / Full Pads" readOnly />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Physical Biometrics" icon={ActivityIcon}>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Peso (kg)</label>
                                <input className={inputClass} type="number" value="95" />
                            </div>
                            <div>
                                <label className={labelClass}>Altura (m)</label>
                                <input className={inputClass} type="text" value="1.88" />
                            </div>
                            <div>
                                <label className={labelClass}>Vencimento Atestado</label>
                                <input className={`${inputClass} border-red-500/50 text-red-400`} type="date" value="2023-12-01" />
                            </div>
                        </div>
                    </FormSection>
                </div>

                {/* RIGHT: PHOTO & CARD */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-gradient-to-br from-highlight/20 to-black rounded-[3rem] border border-highlight/30 p-8 flex flex-col items-center text-center shadow-2xl">
                         <div className="w-48 h-48 rounded-[2.5rem] border-4 border-highlight p-1 shadow-glow mb-6">
                             <LazyImage src="https://ui-avatars.com/api/?name=Lucas+Thor&background=059669&color=fff&size=200" className="w-full h-full rounded-[2rem] object-cover" />
                         </div>
                         <h4 className="text-white font-black uppercase italic text-lg leading-tight">Foto Oficial de Súmula</h4>
                         <p className="text-[10px] text-text-secondary mt-2 uppercase tracking-widest px-4">Esta imagem será usada pelos árbitros para conferência de campo.</p>
                         
                         <button className="mt-8 w-full py-4 bg-white text-black font-black uppercase italic text-xs rounded-2xl shadow-xl hover:bg-highlight hover:text-white transition-all">Substituir Foto</button>
                    </div>

                    <div className="bg-black/40 rounded-[2.5rem] border border-white/5 p-8">
                         <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4">Documentos Anexos</h4>
                         <div className="space-y-2">
                             <div className="bg-white/5 p-3 rounded-xl flex justify-between items-center">
                                 <span className="text-[10px] text-text-secondary font-bold uppercase">RG_FRENTE.JPG</span>
                                 <span className="text-[10px] text-highlight font-black">✔ OK</span>
                             </div>
                             <div className="bg-white/5 p-3 rounded-xl flex justify-between items-center">
                                 <span className="text-[10px] text-text-secondary font-bold uppercase">ATESTADO.PDF</span>
                                 <span className="text-[10px] text-red-500 font-black">✖ EXPIROU</span>
                             </div>
                         </div>
                         <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] rounded-xl border border-white/10 transition-all">Upload Documentos</button>
                    </div>

                    <button className="w-full py-6 bg-highlight text-white font-black uppercase italic text-sm rounded-[2rem] shadow-glow transform active:scale-95 transition-all">Salvar Todos os Dados</button>
                </div>
            </div>
        </div>
    );
};

export default RegisterLab;