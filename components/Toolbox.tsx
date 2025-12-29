import React from 'react';
import { ShieldCheck, Zap, Ghost, Trophy, Search, Rocket } from 'lucide-react';
import BreathingCircle from './BreathingCircle';
import UrgeSurfer from './UrgeSurfer';
import Grounding54321 from './Grounding54321';
import ThoughtBurner from './ThoughtBurner';
import { useSoundFX } from '../src/hooks/useSoundFX';

interface ToolboxProps {
  onAddConfession?: any; // Kept for interface compatibility but unused
  triggerHaptic: (type: 'light' | 'medium' | 'heavy') => void;
  onTriggerMentor?: (cmd: string) => void;
}

const Toolbox: React.FC<ToolboxProps> = ({ triggerHaptic, onTriggerMentor }) => {
  const { playClick } = useSoundFX();

  const handleTacticalResource = (cmd: string) => {
    triggerHaptic('medium');
    playClick();
    onTriggerMentor?.(cmd);
  };

  return (
    <div className="p-6 space-y-8 pb-32 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-8">
        <div onClick={() => triggerHaptic('light')}>
          <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">ARSENAL TÁCTICO</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Protocolos de Crisis & Control</p>
        </div>
        <div className="bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800 flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#FFD700]" />
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">READY</span>
        </div>
      </div>

      <div className="grid gap-6">

        {/* SECTION 1: CRISIS INTERVENTION (THE TRIAD) */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest pl-2 border-l-2 border-[#FFD700]">INTERVENCIÓN INMEDIATA</h3>

          <div className="grid md:grid-cols-3 gap-4">
            {/* TOOL 1: URGE SURFER (Mata-Impulsos) */}
            <UrgeSurfer triggerHaptic={triggerHaptic} />

            {/* TOOL 2: GROUNDING (Puesta a Tierra) */}
            <Grounding54321 triggerHaptic={triggerHaptic} />

            {/* TOOL 3: INCINERATOR (Catarsis) */}
            <ThoughtBurner triggerHaptic={triggerHaptic} />
          </div>
        </div>

        {/* SECTION 2: BIO-REGULATION & MENTALITY */}
        <div className="space-y-4 pt-8">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest pl-2 border-l-2 border-blue-500">MANTENIMIENTO DEL SISTEMA</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* CARD 1: BREATHING */}
            <section className="group relative bg-black p-8 rounded-[2rem] border border-zinc-900 hover:border-blue-900/50 transition-all duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-zinc-900/50 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                  <Zap className="text-blue-500" size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white uppercase tracking-tighter">BIO-REGULACIÓN</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Control del Sistema Nervioso</p>
                </div>
              </div>
              <BreathingCircle />
            </section>

            {/* CARD 2: MENTALITY RESOURCES */}
            <section className="group relative bg-black p-6 rounded-[2rem] border border-zinc-900 hover:border-blue-900/50 transition-all duration-500">
              <div className="mb-6">
                <h3 className="font-black text-lg text-white uppercase tracking-tighter truncate">REPROGRAMATE</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Inyecciones de Mentalidad</p>
              </div>

              <div className="flex flex-col gap-3">
                <button onClick={() => handleTacticalResource('[CMD: STORY_FAILURE]')} className="bg-zinc-900/30 p-3 rounded-xl border border-zinc-800 flex items-center justify-between hover:border-red-500/50 hover:bg-red-500/5 transition-all scale-on-tap group/btn w-full">
                  <div className="flex items-center gap-3 min-w-0">
                    <Ghost size={18} className="text-zinc-600 group-hover/btn:text-red-500 transition-colors shrink-0" />
                    <span className="text-[10px] font-black uppercase text-zinc-400 group-hover/btn:text-white tracking-widest truncate">DETECTÁ EL FALLO</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/30 group-hover/btn:bg-red-500 transition-colors shrink-0"></div>
                </button>

                <button onClick={() => handleTacticalResource('[CMD: STORY_SUCCESS]')} className="bg-zinc-900/30 p-3 rounded-xl border border-zinc-800 flex items-center justify-between hover:border-[#FFD700]/50 hover:bg-[#FFD700]/5 transition-all scale-on-tap group/btn w-full">
                  <div className="flex items-center gap-3 min-w-0">
                    <Trophy size={18} className="text-zinc-600 group-hover/btn:text-[#FFD700] transition-colors shrink-0" />
                    <span className="text-[10px] font-black uppercase text-zinc-400 group-hover/btn:text-white tracking-widest truncate">APRENDÉ A GANAR</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700]/30 group-hover/btn:bg-[#FFD700] transition-colors shrink-0"></div>
                </button>

                <button onClick={() => handleTacticalResource('[CMD: DEEP_QUESTIONS]')} className="bg-zinc-900/30 p-3 rounded-xl border border-zinc-800 flex items-center justify-between hover:border-white/50 hover:bg-white/5 transition-all scale-on-tap group/btn w-full">
                  <div className="flex items-center gap-3 min-w-0">
                    <Search size={18} className="text-zinc-600 group-hover/btn:text-white transition-colors shrink-0" />
                    <span className="text-[10px] font-black uppercase text-zinc-400 group-hover/btn:text-white tracking-widest truncate">ENFRENTATE</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover/btn:bg-white transition-colors shrink-0"></div>
                </button>

                <button onClick={() => handleTacticalResource('[CMD: ACTION_MODE]')} className="bg-zinc-900/30 p-3 rounded-xl border border-zinc-800 flex items-center justify-between hover:border-green-500/50 hover:bg-green-500/5 transition-all scale-on-tap group/btn w-full">
                  <div className="flex items-center gap-3 min-w-0">
                    <Rocket size={18} className="text-zinc-600 group-hover/btn:text-green-500 transition-colors shrink-0" />
                    <span className="text-[10px] font-black uppercase text-zinc-400 group-hover/btn:text-white tracking-widest truncate">ACCIONÁ</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/30 group-hover/btn:bg-green-500 transition-colors shrink-0"></div>
                </button>
              </div>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Toolbox;
