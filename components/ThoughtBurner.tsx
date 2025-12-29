import React, { useState } from 'react';
import { Flame, Trash2, Send } from 'lucide-react';

interface ThoughtBurnerProps {
    triggerHaptic: (type: 'light' | 'medium' | 'heavy') => void;
}

const ThoughtBurner: React.FC<ThoughtBurnerProps> = ({ triggerHaptic }) => {
    const [thought, setThought] = useState('');
    const [isBurning, setIsBurning] = useState(false);
    const [isAsh, setIsAsh] = useState(false);

    const handleBurn = () => {
        if (!thought.trim()) return;
        triggerHaptic('heavy');
        setIsBurning(true);

        // Simulation of burning process
        setTimeout(() => {
            triggerHaptic('medium'); // Crackle 1
        }, 500);
        setTimeout(() => {
            triggerHaptic('medium'); // Crackle 2
        }, 1200);

        setTimeout(() => {
            setIsBurning(false);
            setIsAsh(true);
            setThought('');
            triggerHaptic('light'); // Done

            // Reset state after showing ash message
            setTimeout(() => setIsAsh(false), 3000);
        }, 2000);
    };

    return (
        <div className="relative overflow-hidden rounded-3xl bg-black border border-zinc-800 p-6 h-80 flex flex-col justify-between group hover:border-orange-900/50 transition-all">

            {/* Dynamic Background (Fire Effect Placeholder) */}
            {isBurning && (
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-orange-600/20 via-red-900/10 to-transparent animate-pulse" />
            )}

            {/* Header */}
            <div className="z-10 flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <Flame className={`${isBurning ? 'text-orange-500 animate-bounce' : 'text-zinc-600'}`} size={18} fill={isBurning ? "currentColor" : "none"} />
                        Incineradora
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                        Catarsis Visual • Destruye el pensamiento
                    </p>
                </div>
            </div>

            {/* Main Area */}
            <div className="z-10 flex-1 flex flex-col justify-center py-4">
                {isAsh ? (
                    <div className="text-center animate-in zoom-in duration-500">
                        <div className="text-4xl mb-2">🌪️</div>
                        <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
                            PENSAMIENTO ELIMINADO.<br />SÓLO QUEDAN CENIZAS.
                        </p>
                    </div>
                ) : isBurning ? (
                    <div className="text-center space-y-4 animate-pulse">
                        <p className="text-orange-500 font-black text-2xl uppercase tracking-tighter blur-sm select-none">
                            {thought.slice(0, 10)}...
                        </p>
                        <p className="text-red-600 text-xs font-bold uppercase tracking-widest">
                            INCINERANDO...
                        </p>
                    </div>
                ) : (
                    <textarea
                        value={thought}
                        onChange={(e) => setThought(e.target.value)}
                        placeholder="Escribe eso que no te deja en paz..."
                        className="w-full h-full bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-orange-500/50 outline-none resize-none placeholder-zinc-700 font-medium"
                    />
                )}
            </div>

            {/* Action */}
            {!isAsh && !isBurning && (
                <button
                    onClick={handleBurn}
                    disabled={!thought.trim()}
                    className="z-10 w-full py-4 rounded-xl bg-gradient-to-r from-orange-700 to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20 scale-on-tap hover:brightness-110 transition-all"
                >
                    <Trash2 size={16} /> QUEMAR AHORA
                </button>
            )}
        </div>
    );
};

export default ThoughtBurner;
