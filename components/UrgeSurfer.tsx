import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Circle } from 'lucide-react';

interface UrgeSurferProps {
    onComplete?: () => void;
    triggerHaptic: (type: 'light' | 'medium' | 'heavy') => void;
}

const UrgeSurfer: React.FC<UrgeSurferProps> = ({ onComplete, triggerHaptic }) => {
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(90); // 90 seconds
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let interval: any;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
                if (timeLeft % 10 === 0) triggerHaptic('light'); // Pulse every 10s
            }, 1000);
        } else if (timeLeft === 0) {
            triggerHaptic('heavy');
            setIsActive(false);
            onComplete?.();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    // Wave Animation Logic
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let phase = 0;

        const render = () => {
            if (!ctx || !canvas) return;

            // Resize canvas to parent
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const intensity = isActive ? (timeLeft / 90) : 0.1; // Wave calms down as time passes
            const color = isActive ? '#3b82f6' : '#52525b'; // Blue active, Zinc idle

            ctx.beginPath();
            // Complex wave math
            for (let x = 0; x < canvas.width; x++) {
                const y = canvas.height / 2 +
                    (Math.sin(x * 0.02 + phase) * 20 * intensity) +
                    (Math.sin(x * 0.01 + phase * 1.5) * 15 * intensity);
                ctx.lineTo(x, y);
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();

            if (isActive) phase += 0.1;
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [isActive, timeLeft]);

    const toggleTimer = () => {
        triggerHaptic('medium');
        setIsActive(!isActive);
    };

    const progress = ((90 - timeLeft) / 90) * 100;

    return (
        <div className="relative overflow-hidden rounded-3xl bg-zinc-900/50 border border-zinc-800 p-6 flex flex-col items-center justify-between h-80 group hover:border-blue-500/30 transition-all">
            {/* Background Canvas */}
            <div className="absolute inset-0 z-0 opacity-30">
                <canvas ref={canvasRef} className="w-full h-full" />
            </div>

            <div className="z-10 text-center space-y-2">
                <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2 justify-center">
                    <Circle className="text-blue-500 fill-blue-500/20" size={16} />
                    Mata-Impulsos
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    Surfea la ola • 90 Segundos
                </p>
            </div>

            {/* Timer Display */}
            <div className="z-10 relative">
                <div className="text-6xl font-black text-white tabular-nums tracking-tighter">
                    {timeLeft}
                    <span className="text-lg text-zinc-600 ml-1">s</span>
                </div>
            </div>

            {/* Controls */}
            <div className="z-10 w-full space-y-4">
                {/* Progress Bar */}
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <button
                    onClick={toggleTimer}
                    className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all scale-on-tap shadow-lg flex items-center justify-center gap-2
            ${isActive
                            ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20'
                            : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20'
                        }`}
                >
                    {isActive ? (
                        <><Square size={14} fill="currentColor" /> Detener</>
                    ) : (
                        <><Play size={14} fill="currentColor" /> {timeLeft < 90 ? 'Continuar' : 'Iniciar'}</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default UrgeSurfer;
