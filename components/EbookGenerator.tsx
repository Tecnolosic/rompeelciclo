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
                    className="w-[210mm] min-h-[297mm] bg-white text-black p-[20mm] shadow-2xl print:shadow-none print:w-full print:m-0"
                >
                    {/* COVER PAGE */}
                    <div className="min-h-[297mm] flex flex-col justify-between border-4 border-black p-8 page-break-after">
                        <div>
                            <div className="flex items-center gap-2 mb-8">
                                <Shield size={32} className="text-black" />
                                <span className="font-black tracking-[0.3em] uppercase">Rompe el Ciclo</span>
                            </div>
                            <h1 className="text-7xl font-black uppercase leading-[0.8] mb-4 tracking-tighter">
                                Manual<br />Operativo<br />Personal
                            </h1>
                            <p className="text-xl font-bold uppercase tracking-widest text-zinc-600">Protocolo de Intervención</p>
                        </div>

                        <div className="space-y-8">
                            <div className="border-l-4 border-black pl-6">
                                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Operador Asignado</p>
                                <p className="text-3xl font-black uppercase">{identity.name || 'NO IDENTIFICADO'}</p>
                            </div>
                            <div className="border-l-4 border-black pl-6">
                                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Estrella Norte (Objetivo)</p>
                                <p className="text-2xl font-bold uppercase">{identity.north_star || 'PENDIENTE DE DEFINICIÓN'}</p>
                            </div>
                            <div className="pt-12 border-t-2 border-dashed border-black">
                                <p className="text-xs font-mono">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                                <p className="text-xs font-mono">FECHA DE GENERACIÓN: {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* CONTENT PAGES */}
                    {EBOOK_CONTENT.map((phase, index) => (
                        <div key={index} className="mt-8 page-break-inside-avoid">
                            <div className="flex items-center gap-4 mb-8 border-b-2 border-black pb-4">
                                <span className="text-6xl font-black text-zinc-200">{phase.phase}</span>
                                <div>
                                    <h2 className="text-2xl font-black uppercase">{phase.title}</h2>
                                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{phase.subtitle}</p>
                                </div>
                            </div>

                            <div className="space-y-12">
                                {phase.chapters.map((chapter, cIndex) => (
                                    <div key={cIndex} className="mb-12">
                                        <h3 className="text-lg font-black uppercase mb-4 flex items-center gap-2">
                                            <Target size={16} /> {chapter.title}
                                        </h3>
                                        <div className="text-justify leading-relaxed font-serif text-lg text-zinc-800 whitespace-pre-wrap">
                                            {chapter.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="h-12"></div> {/* Spacer */}
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
            .page-break-before { page-break-before: always; }
            .page-break-inside-avoid { break-inside: avoid; }
            body { background: white; color: black; }
        }
      `}</style>
        </div>
    );
};

export default EbookGenerator;
