import React, { useState, useEffect, useRef } from 'react';
import { Timer, XCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useSoundFX } from '../src/hooks/useSoundFX';

const BunkerMode: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [broken, setBroken] = useState(false);
  const timerRef = useRef<number | null>(null);
  const { playClick, playError, playSuccess } = useSoundFX();

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && isActive) {
        setIsActive(false);
        setBroken(true);
        playError();
        if (timerRef.current) clearInterval(timerRef.current);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isActive]);

  const toggleTimer = () => {
    if (broken) return;
    playClick();
    if (isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsActive(false);
    } else {
      setIsActive(true);
      timerRef.current = window.setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) playSuccess();
          return t > 0 ? t - 1 : 0;
        });
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500 ${broken ? 'bg-red-950/90' : 'bg-black'}`}>
      <div className="text-center space-y-8 max-w-xs relative">

        {/* Pulse effect when active */}
        {isActive && !broken && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FFD700]/5 blur-[60px] rounded-full animate-pulse pointer-events-none" />
        )}

        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className={`p-4 rounded-full transition-colors duration-300 ${broken ? 'bg-red-500/20 animate-bounce' : isActive ? 'bg-[#FFD700]/20 animate-pulse' : 'bg-[#FFD700]/10'}`}>
            {broken ? <ShieldAlert className="text-red-500" size={48} /> : <Timer className="text-[#FFD700]" size={48} />}
          </div>
          <h2 className={`text-3xl font-black tracking-tighter uppercase ${broken ? 'text-red-500' : 'text-[#FFD700]'}`}>
            {broken ? 'BÚNKER VULNERADO' : 'MODO BÚNKER'}
          </h2>
          <p className={`text-[10px] font-bold uppercase tracking-widest leading-tight ${broken ? 'text-red-400' : 'text-zinc-500'}`}>
            {broken ? 'FOCUS ROTO. REINICIA. EL DOLOR ES TU MAESTRO.' : 'SI SALES DE ESTA PANTALLA, EL CONTRATO SE ROMPE.'}
          </p>
        </div>

        <div className={`text-7xl font-mono font-black tracking-tighter tabular-nums py-10 transition-colors ${broken ? 'text-red-500' : isActive ? 'text-white' : 'text-zinc-600'}`}>
          {formatTime(timeLeft)}
        </div>

        {!broken ? (
          <button
            onClick={toggleTimer}
            className={`w-full py-5 rounded-xl font-black border-2 transition-all uppercase tracking-widest text-xs relative overflow-hidden group ${isActive ? 'border-zinc-800 text-zinc-500' : 'border-[#FFD700] text-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.15)] hover:bg-[#FFD700]/10'
              }`}
          >
            {isActive ? 'PAUSAR REIOJ (DEBILIDAD)' : 'INICIAR PROTOCOLO DEEP WORK'}
          </button>
        ) : (
          <button
            onClick={() => { setBroken(false); setTimeLeft(25 * 60); playClick(); }}
            className="w-full py-5 rounded-xl font-black bg-red-600 text-white uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(220,38,38,0.4)] animate-pulse"
          >
            REINTENTAR (PENALIZACIÓN -50 XP)
          </button>
        )}

        <button onClick={() => { playClick(); onExit(); }} className="text-zinc-700 text-[10px] font-black uppercase hover:text-zinc-500 transition-colors pt-4">
          ABANDONAR MISIÓN
        </button>
      </div>
    </div>
  );
};

export default BunkerMode;
