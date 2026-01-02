
import React from 'react';
import { ChevronRight, Lock, CheckCircle2, ArrowDownCircle, Zap, ShieldCheck, Download } from 'lucide-react';
import { Pilar } from '../types';

import { useSoundFX } from '../src/hooks/useSoundFX';

interface TimelineProps {
  pilares: Pilar[];
  onPilarClick: (id: number) => void;
  onOpenEbook: () => void;
}

const Timeline: React.FC<TimelineProps> = ({ pilares, onPilarClick, onOpenEbook }) => {
  const { playClick } = useSoundFX();
  return (
    <div className="p-6 relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#FFD700]/5 to-transparent pointer-events-none -z-10 blur-[120px]"></div>

      {/* Vertical Progress Line with Tactical Look */}
      <div className="absolute left-10 top-10 bottom-10 w-[1px] bg-gradient-to-b from-[#FFD700]/40 via-zinc-800 to-transparent opacity-30 -z-0"></div>

      <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 relative z-10">
        {pilares.map((pilar, index) => {
          const isLocked = pilar.bloqueado;
          const isCompleted = pilar.completado;
          const isActive = !isLocked && !isCompleted;

          return (
            <div
              key={pilar.id}
              className="flex gap-6 group staggered-item"
              style={{ animationDelay: `${(index + 3) * 0.1}s` }}
            >
              {/* Pillar Indicator Ring - Premium HUD Style */}
              <div className="relative shrink-0 mt-1">
                {isActive && (
                  <div className="absolute -inset-4 bg-[#FFD700]/10 rounded-full animate-pulse blur-md"></div>
                )}
                <div className={`h-10 w-10 rounded-full flex items-center justify-center border transition-all duration-1000 shadow-2xl ${isCompleted
                  ? 'bg-gradient-to-br from-[#FFD700] to-[#B8860B] border-[#FFD700] text-black shadow-[0_0_25px_rgba(255,215,0,0.4)]'
                  : isLocked
                    ? 'bg-black border-zinc-800 text-zinc-800'
                    : 'bg-black border-[#FFD700]/60 text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.15)] group-hover:border-[#FFD700] group-hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]'
                  }`}>
                  {isCompleted ? <CheckCircle2 size={22} strokeWidth={3} /> :
                    isLocked ? <Lock size={16} /> :
                      <span className="text-xs font-black tracking-tighter">{index + 1}</span>}
                </div>
              </div>

              {/* Pilar Card - High-End Dark UI */}
              <div
                onClick={() => {
                  if (!isLocked) {
                    playClick();
                    onPilarClick(pilar.id);
                  }
                }}
                className={`flex-1 p-7 pb-8 rounded-[2.5rem] transition-all duration-700 border-2 relative overflow-hidden shadow-2xl ${isLocked
                  ? 'bg-zinc-950/40 border-zinc-900/50 opacity-40 cursor-not-allowed'
                  : 'bg-[#050505] border-zinc-900 cursor-pointer hover:border-[#FFD700]/30 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,1)] hover:-translate-y-2 active:scale-[0.98]'
                  }`}
              >
                {/* Background Textures & Accents */}
                {!isLocked && (
                  <>
                    <div className="absolute -right-8 -top-8 opacity-[0.02] group-hover:opacity-[0.06] group-hover:rotate-12 group-hover:scale-125 transition-all duration-1000">
                      <Zap size={160} className="text-[#FFD700] fill-[#FFD700]" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  </>
                )}

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black tracking-[0.4em] uppercase ${isLocked ? 'text-zinc-800' : 'text-[#FFD700] opacity-80'
                        }`}>
                        FASE 0{index + 1}
                      </span>
                      {isCompleted && (
                        <div className="flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                          <CheckCircle2 size={8} className="text-green-500" />
                          <span className="text-[7px] font-black text-green-500 uppercase tracking-widest">DOMINADO</span>
                        </div>
                      )}
                    </div>
                    <h3 className={`font-black tracking-tighter text-2xl uppercase leading-none transition-colors duration-500 ${isLocked ? 'text-zinc-700' : 'text-white group-hover:text-[#FFD700]'
                      }`}>
                      {pilar.titulo}
                    </h3>
                  </div>
                  {!isLocked && (
                    <div className="h-11 w-11 rounded-2xl bg-zinc-900/50 flex items-center justify-center text-zinc-500 group-hover:bg-[#FFD700] group-hover:text-black group-hover:shadow-[0_10px_20px_-5px_rgba(255,215,0,0.3)] transition-all duration-500 shadow-inner">
                      <ChevronRight size={24} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  )}
                </div>

                <p className={`text-[12px] leading-relaxed mb-6 relative z-10 font-medium transition-colors duration-500 ${isLocked ? 'text-zinc-800' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}>
                  {pilar.concepto}
                </p>

                {/* Tactical Card Footer */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={12} className={isLocked ? 'text-zinc-800' : 'text-[#FFD700] opacity-30'} />
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isLocked ? 'text-zinc-800' : 'text-zinc-600'}`}>
                      {isLocked ? 'AVANZÁ Y DESBLOQUEÁ' : 'PROTOCOLO ABIERTO'}
                    </span>
                  </div>
                  {!isLocked && (
                    <span className="text-[10px] font-black text-[#FFD700] opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-700">
                      COMENZAR ACCIÓN
                    </span>
                  )}
                </div>

                {/* Sleek Minimalist Progress Bar - Docked at Bottom */}
                {!isLocked && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-950 overflow-hidden">
                    <div
                      className={`h-full progress-bar-fill transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,215,0,0.5)] ${isCompleted ? 'bg-[#FFD700]' : 'bg-zinc-800 group-hover:bg-[#FFD700]/40'
                        }`}
                      style={{ width: isCompleted ? '100%' : '15%' }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* EBOOK DOWNLOAD FOOTER BUTTON */}
      <div className="mt-8 animate-in slide-in-from-bottom-4 duration-700 delay-300 md:col-span-full">
        <button
          onClick={onOpenEbook}
          className="w-full group relative overflow-hidden bg-black border border-zinc-800 rounded-[2rem] p-6 text-left transition-all hover:border-[#FFD700]/50 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)]"
        >
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h4 className="text-[#FFD700] font-black uppercase tracking-tight text-lg group-hover:tracking-widest transition-all duration-300">
                Descargá aquí tu Ebook
              </h4>
              <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] mt-1 group-hover:text-zinc-400">
                Manual Operativo 2.0
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-[#FFD700] group-hover:text-black transition-all">
              <Download size={18} />
            </div>
          </div>
          {/* Bg Hover Effect */}
          <div className="absolute inset-0 bg-[#FFD700]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </button>
      </div>
    </div>
  );

}; // Final del componente

export default Timeline;
