
import React, { useState, useEffect } from 'react';

const BreathingCircle: React.FC = () => {
    const [phase, setPhase] = useState<'INHALE' | 'HOLD' | 'EXHALE' | 'HOLD_EMPTY'>('INHALE');
    const [seconds, setSeconds] = useState(4);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setSeconds((prev) => {
                if (prev === 1) {
                    switch (phase) {
                        case 'INHALE': setPhase('HOLD'); return 4;
                        case 'HOLD': setPhase('EXHALE'); return 4;
                        case 'EXHALE': setPhase('HOLD_EMPTY'); return 4;
                        case 'HOLD_EMPTY': setPhase('INHALE'); return 4;
                    }
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, phase]);

    const toggle = () => {
        setIsActive(!isActive);
        if (!isActive) {
            setPhase('INHALE');
            setSeconds(4);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-zinc-900/50 rounded-3xl border border-zinc-900">
            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                {/* Animated Rings */}
                <div className={`absolute inset-0 rounded-full border-4 border-[#FFD700] transition-all duration-[4000ms] ease-in-out ${!isActive ? 'scale-100 opacity-20' :
                    phase === 'INHALE' ? 'scale-100 opacity-100' :
                        phase === 'HOLD' ? 'scale-100 opacity-80' :
                            phase === 'EXHALE' ? 'scale-50 opacity-60' :
                                'scale-50 opacity-40' // HOLD_EMPTY
                    }`} />

                <div className={`absolute inset-0 rounded-full bg-[#FFD700]/10 blur-xl transition-all duration-[4000ms] ease-in-out ${!isActive ? 'scale-75 opacity-0' :
                    phase === 'INHALE' ? 'scale-100 opacity-100' :
                        phase === 'EXHALE' ? 'scale-50 opacity-0' :
                            'scale-75 opacity-50'
                    }`} />

                <div className="text-center z-10">
                    <span className="text-4xl font-black text-white tabular-nums block">{isActive ? seconds : 'INICIO'}</span>
                    <span className="text-[10px] uppercase font-bold text-[#FFD700] tracking-widest">
                        {isActive ? (
                            phase === 'INHALE' ? 'INHALA' :
                                phase === 'HOLD' ? 'MANTÉN' :
                                    phase === 'EXHALE' ? 'EXHALA' :
                                        'VACÍO' // HOLD_EMPTY
                        ) : 'RESPIRACIÓN TÁCTICA'}
                    </span>
                </div>
            </div>

            <button onClick={toggle} className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isActive ? 'bg-zinc-800 text-zinc-500' : 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20'}`}>
                {isActive ? 'DETENER PROTOCOLO' : 'INICIAR REGULACIÓN'}
            </button>
        </div>
    );
};

export default BreathingCircle;

