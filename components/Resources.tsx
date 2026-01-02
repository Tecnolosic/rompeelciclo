import React from 'react';
import { BookOpen, Download, Shield } from 'lucide-react';

interface ResourcesProps {
    onOpenEbook: () => void;
    triggerHaptic: (type: 'light' | 'medium' | 'heavy') => void;
}

const Resources: React.FC<ResourcesProps> = ({ onOpenEbook, triggerHaptic }) => {
    return (
        <div className="p-6 space-y-12 animate-in fade-in slide-in-from-bottom-4 pb-32">
            {/* HEADER */}
            <div>
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">ARSENAL TÁCTICO</h2>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Documentación y recursos de campo.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* EBOOK CARD */}
                <div
                    onClick={() => { triggerHaptic('medium'); onOpenEbook(); }}
                    className="group relative bg-[#111] border border-zinc-800 rounded-[2rem] p-8 overflow-hidden cursor-pointer hover:border-[#FFD700]/30 transition-all duration-500"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500 group-hover:scale-110 group-hover:rotate-12 transform">
                        <BookOpen size={120} className="text-[#FFD700]" />
                    </div>

                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-full bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700] mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Shield size={24} />
                        </div>

                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-[#FFD700] transition-colors">
                            Manual Operativo Personal
                        </h3>
                        <p className="text-zinc-500 text-xs font-bold leading-relaxed mb-8 max-w-[80%]">
                            Compendio completo del protocolo Rompe el Ciclo. Personalizado con tu identidad y objetivos.
                        </p>

                        <div className="flex items-center gap-3">
                            <span className="bg-white text-black text-[10px] font-black uppercase px-4 py-2 rounded-full flex items-center gap-2 group-hover:bg-[#FFD700] transition-colors">
                                <Download size={12} /> Generar PDF
                            </span>
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">VERSIÓN 2.0</span>
                        </div>
                    </div>
                </div>

                {/* COMING SOON PLACEHOLDERS */}
                <div className="opacity-40 border border-dashed border-zinc-800 rounded-[2rem] p-8 flex items-center justify-center">
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">Más recursos en desarrollo...</p>
                </div>
            </div>
        </div>
    );
};

export default Resources;
