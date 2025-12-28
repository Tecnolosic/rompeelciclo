
import React, { useEffect } from 'react';
import { Trophy, Share2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LevelUpOverlayProps {
    level: number;
    onClose: () => void;
}

const LevelUpOverlay: React.FC<LevelUpOverlayProps> = ({ level, onClose }) => {
    useEffect(() => {
        // Fire celebratory confetti
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#FFD700', '#FFFFFF']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#FFD700', '#FFFFFF']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, []);

    return (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-500">
            <div className="relative w-full max-w-md p-8 text-center">

                {/* Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FFD700]/20 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="relative z-10 space-y-8">
                    <div className="inline-flex p-4 rounded-full bg-[#FFD700]/10 border-2 border-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.3)] animate-bounce">
                        <Trophy size={48} className="text-[#FFD700] fill-[#FFD700]" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter animate-pulse">
                            NIVEL {level} ALCANZADO
                        </h2>
                        <p className="text-xs font-bold text-[#FFD700] uppercase tracking-[0.3em]">
                            Nueva Jerarquía Desbloqueada
                        </p>
                    </div>

                    <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                        <p className="text-sm text-zinc-300 leading-relaxed">
                            "Tu evolución es inevitable. El viejo tú ha muerto. Larga vida al nuevo Operador."
                        </p>
                    </div>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-[#FFD700] text-black font-black uppercase rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#FFD700]/20"
                        >
                            CONTINUAR MISIÓN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LevelUpOverlay;
