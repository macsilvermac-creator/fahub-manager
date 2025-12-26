import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import { UsersIcon, ShieldCheckIcon, ActivityIcon, CheckCircleIcon } from '@/components/icons/UiIcons';
import LazyImage from '@/components/LazyImage';

const RegisterLab: React.FC = () => {
    const [eligibility, setEligibility] = useState(85);

    const FormSection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
        <div className="bg-black/20 rounded-[2rem] border border-white/5 p-6 space-y-4 shadow-inner">
            <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-highlight" />
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{title}</h3>
            </div>
            {children}
        </div>
    );

    const inputClass = "w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-highlight outline-none transition-all placeholder:text-white/10 font-medium";
    const labelClass = "text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] mb-1 block ml-1";

    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-4 animate-fade-in">
            <PageHeader title="Register Lab" subtitle="Identidade oficial federativa FAHUB." />

            {/* ELIGIBILITY BAR COMPACTA */}
            <div className="bg-secondary/40 rounded-3xl p-4 border border-white/5 shadow-xl shrink-0">
                <div className="flex justify-between items-center mb-2 px-1">
                    <p className="text-[9px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                        <ShieldCheckIcon className="w-3.5 h-3.5 text-highlight" /> Sumula Digital Eligibility
                    </p>
                    <span className="text-sm font-black text-highlight italic">{eligibility}%</span>
                </div>
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-highlight shadow-glow transition-all duration-1000" style={{ width: `${eligibility}%` }}></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* LEFT: DATA */}
                <div className="lg:col-span-8 space-y-4 pb-10">
                    <FormSection title="Identity Record" icon={UsersIcon}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Nome Completo</label>
                                <input className={inputClass} value="Lucas Thor Machado" readOnly />
                            </div>
                            <div>
                                <label className={labelClass}>Documento (RG/SSP)</label>
                                <input className={inputClass} placeholder="0.000.000 SSP/SC" />
                            </div>
                            <div>
                                <label className={labelClass}>Tax ID (CPF)</label>
                                <input className={inputClass} value="000.000.000-00" readOnly />
                            </div>
                            <div>
                                <label className={labelClass}>Data de Nascimento</label>
                                <input className={inputClass} type="date" value="1995-10-15" />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Match Day Specs" icon={CheckCircleIcon}>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className={labelClass}>Posição</label>
                                <select className={inputClass}>
                                    <option>QB</option><option>WR</option><option>RB</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Jersey (#)</label>
                                <input className={inputClass} type="number" value="12" />
                            </div>
                            <div>
                                <label className={labelClass}>Categoria</label>
                                <input className={inputClass} value="Elite Pro" readOnly />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Biometrics" icon={ActivityIcon}>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className={labelClass}>Peso (kg)</label>
                                <input className={inputClass} type="number" value="95" />
                            </div>
                            <div>
                                <label className={labelClass}>Altura (m)</label>
                                <input className={inputClass} type="text" value="1.88" />
                            </div>
                            <div>
                                <label className={labelClass}>Exame Médico</label>
                                <input className={`${inputClass} ${eligibility < 100 ? 'border-red-500/50 text-red-400' : ''}`} type="date" />
                            </div>
                        </div>
                    </FormSection>
                </div>

                {/* RIGHT: ID CARD & ACTIONS */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="bg-gradient-to-br from-highlight/10 to-black rounded-[2.5rem] border border-highlight/20 p-6 flex flex-col items-center text-center shadow-2xl">
                         <div className="w-36 h-36 rounded-[2rem] border-4 border-highlight p-0.5 shadow-glow mb-4">
                             <LazyImage src="https://ui-avatars.com/api/?name=Lucas+Thor&background=059669&color=fff&size=150" className="w-full h-full rounded-[1.8rem] object-cover" />
                         </div>
                         <h4 className="text-white font-black uppercase italic text-sm leading-tight">Foto Oficial de Súmula</h4>
                         <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white text-text-secondary hover:text-black font-black uppercase italic text-[9px] rounded-xl transition-all border border-white/10">Atualizar Foto</button>
                    </div>

                    <div className="bg-black/40 rounded-[2rem] border border-white/5 p-6 flex flex-col gap-4">
                         <h4 className="text-[9px] font-black text-white uppercase tracking-widest mb-1">Dossiê Digital</h4>
                         <div className="space-y-2">
                             {['RG_FRONT', 'HEALTH_CERT'].map(doc => (
                                 <div key={doc} className="bg-white/5 p-2.5 rounded-xl flex justify-between items-center border border-white/5">
                                     <span className="text-[8px] text-text-secondary font-bold uppercase">{doc}</span>
                                     <span className="text-[8px] text-highlight font-black">VALIDO</span>
                                 </div>
                             ))}
                         </div>
                         <button className="w-full py-3 bg-highlight/10 hover:bg-highlight text-highlight hover:text-white font-black uppercase text-[9px] rounded-xl border border-highlight/30 transition-all active:scale-95 mt-2">
                            SALVAR IDENTIDADE DIGITAL
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterLab;