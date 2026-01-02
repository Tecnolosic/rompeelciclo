import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { UserIdentity } from '../types'; // Adjust imports as needed
import { EBOOK_CONTENT } from '../src/data/ebookContent';
import { Zap, Shield, Target } from 'lucide-react';

interface EbookGeneratorProps {
    identity: UserIdentity;
    onClose: () => void;
}

const EbookGenerator: React.FC<EbookGeneratorProps> = ({ identity, onClose }) => {
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Rompe_El_Ciclo_Manual_${identity.name || 'Operador'}`,
    });

    return (
        <div className="fixed inset-0 bg-black z-[200] overflow-y-auto">
            <div className="fixed top-0 left-0 right-0 bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center z-50 no-print">
                <h2 className="text-white font-black uppercase">Generador de Manual Táctico</h2>
                <div className="flex gap-4">
                    <button onClick={onClose} className="text-zinc-500 hover:text-white uppercase text-xs font-bold">Cerrar</button>
                    <button
                        onClick={handlePrint}
                        className="bg-[#FFD700] text-black px-6 py-2 rounded-full font-black uppercase text-xs tracking-widest hover:bg-[#FFD700]/90 transition-colors flex items-center gap-2"
                    >
                        <Zap size={14} /> Descargar PDF
                    </button>
                </div>
            </div>

            <div className="pt-24 pb-20 px-4 flex justify-center bg-[#111]">
                {/* PRINTABLE AREA */}
                <div
                    ref={componentRef}
                    className="w-[210mm] min-h-[297mm] bg-white text-black text-left shadow-2xl print:shadow-none print:w-full print:m-0"
                >
                    {/* COVER PAGE */}
                    <div className="h-[297mm] relative flex flex-col justify-between border-4 border-black p-12 page-break-after">
                        {/* Watermark / Background Element */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                            <Shield size={400} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-12">
                                <Shield size={32} className="text-black" />
                                <span className="font-extrabold tracking-[0.4em] uppercase text-sm">Rompe el Ciclo</span>
                            </div>
                            <h1 className="text-8xl font-black uppercase leading-[0.8] mb-6 tracking-tighter">
                                Manual<br />Operativo<br />Personal
                            </h1>
                            <p className="text-2xl font-bold uppercase tracking-widest text-zinc-600 border-l-4 border-black pl-4">Protocolo de Intervención</p>
                        </div>

                        <div className="space-y-10 relative z-10">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Operador Asignado</p>
                                <p className="text-4xl font-black uppercase break-words border-b-2 border-black pb-2">{identity.name || 'NO IDENTIFICADO'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Estrella Norte (Objetivo)</p>
                                <p className="text-2xl font-bold uppercase leading-tight">{identity.north_star || 'PENDIENTE DE DEFINICIÓN'}</p>
                            </div>
                            <div className="pt-8 border-t-2 border-dashed border-zinc-300 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-mono text-zinc-400">ID DE SESIÓN</p>
                                    <p className="text-sm font-mono font-bold">{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-mono text-zinc-400">FECHA DE GENERACIÓN</p>
                                    <p className="text-sm font-mono font-bold">{new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TABLE OF CONTENTS */}
                    <div className="min-h-[297mm] p-16 page-break-after bg-zinc-50">
                        <h2 className="text-4xl font-black uppercase mb-12 border-b-4 border-black pb-4">Índice Operativo</h2>
                        <div className="space-y-6">
                            {EBOOK_CONTENT.map((phase, idx) => (
                                <div key={idx} className="flex items-baseline justify-between border-b border-dashed border-zinc-300 pb-2">
                                    <div className="flex items-baseline gap-4">
                                        <span className="font-mono text-zinc-400 font-bold">{(idx + 1).toString().padStart(2, '0')}</span>
                                        <h3 className="text-xl font-bold uppercase tracking-tight">{phase.title.replace(/FASE \d+ — /, '')}</h3>
                                    </div>
                                    <span className="text-zinc-400 text-sm font-mono">FASE {phase.phase}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CONTENT PAGES */}
                    {EBOOK_CONTENT.map((phase, index) => (
                        <div key={index} className="px-16 py-16 break-before-page min-h-[297mm] flex flex-col">
                            {/* Phase Header */}
                            <div className="flex items-start gap-6 mb-12 border-b-4 border-black pb-8">
                                <span className="text-9xl font-black text-zinc-100 leading-none -mt-4 select-none">{phase.phase}</span>
                                <div className="pt-2">
                                    <h2 className="text-3xl font-black uppercase leading-none mb-2">{phase.title}</h2>
                                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{phase.subtitle}</p>
                                </div>
                            </div>

                            <div className="space-y-16">
                                {phase.chapters.map((chapter, cIndex) => (
                                    <div key={cIndex} className="avoid-break mb-16">
                                        {/* CHAPTER TITLE */}
                                        <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-3 border-b-2 border-black pb-2">
                                            <span className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">{cIndex + 1}</span>
                                            {chapter.title.split('—')[1] || chapter.title}
                                        </h3>

                                        {/* MAIN CONTENT (Theory) */}
                                        <div className="text-justify leading-relaxed font-serif text-lg text-zinc-800 whitespace-pre-wrap mb-8 columns-1">
                                            {chapter.content.replace(/\{NOMBRE\}/g, identity.name || 'Operador')}
                                        </div>

                                        {/* EXAMPLE BOX */}
                                        {chapter.example && (
                                            <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8 rounded-r-lg break-inside-avoid">
                                                <h4 className="font-bold text-amber-900 uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                                                    <Zap size={14} /> Ejemplo Claro
                                                </h4>
                                                <p className="text-amber-900/80 font-serif italic text-base leading-relaxed">
                                                    {chapter.example.replace('💡 EJEMPLO CLARO:', '').trim()}
                                                </p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 gap-6 break-inside-avoid">
                                            {/* DEEP DIVE BOX */}
                                            {chapter.deep_dive && (
                                                <div className="bg-zinc-100 p-6 rounded-lg text-sm">
                                                    <h4 className="font-black text-zinc-500 uppercase text-[10px] tracking-[0.2em] mb-3 flex items-center gap-2">
                                                        <Shield size={12} /> Profundización
                                                    </h4>
                                                    <p className="text-zinc-700 leading-relaxed font-sans">
                                                        {chapter.deep_dive.replace(/.*?:/, '').trim()}
                                                    </p>
                                                </div>
                                            )}

                                            {/* ACTIONABLE BOX */}
                                            {chapter.actionable && (
                                                <div className="border-2 border-dashed border-black p-6 relative bg-white">
                                                    <div className="absolute -top-3 left-4 bg-white px-2">
                                                        <span className="font-black text-black uppercase text-xs tracking-widest flex items-center gap-2">
                                                            <Target size={14} /> Tu Turno
                                                        </span>
                                                    </div>
                                                    <p className="text-black font-medium text-base leading-relaxed">
                                                        {chapter.actionable.replace(/.*?:/, '').trim()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer for each page */}
                            <div className="mt-auto pt-8 border-t border-zinc-200 flex justify-between text-[10px] text-zinc-400 font-mono uppercase tracking-widest">
                                <span>Rompe el Ciclo / Manual Táctico</span>
                                <span> {identity.name ? `Operador: ${identity.name}` : ''} // Fase {phase.phase}</span>
                            </div>
                        </div>
                    ))}

                    {/* BACK COVER */}
                    <div className="min-h-[297mm] flex flex-col items-center justify-center bg-zinc-100 text-center p-12 page-break-before">
                        <Shield size={64} className="mb-6 opacity-20" />
                        <h2 className="text-3xl font-black uppercase mb-4">El ciclo se rompe hoy.</h2>
                        <p className="font-serif italic text-xl max-w-md mx-auto text-zinc-600">
                            "No es falta de voluntad. Es un sistema que se repite sin que lo cuestiones. Ahora tienes el mapa."
                        </p>
                        <div className="mt-20 border-t border-black pt-4 w-full max-w-xs mx-auto">
                            <p className="text-xs font-black uppercase tracking-widest">Rompe el Ciclo © 2024</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @media print {
            .no-print { display: none !important; }
            .page-break-after { page-break-after: always; }
            .break-before-page { page-break-before: always; break-before: page; }
            .page-break-inside-avoid { break-inside: avoid; }
            .avoid-break { break-inside: avoid; page-break-inside: avoid; }
            body { background: white; color: black; }
        }
      `}</style>
        </div>
    );
};

export default EbookGenerator;
