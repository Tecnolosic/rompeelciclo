import React, { useState } from 'react';
import { Eye, Ear, Hand, Check, ArrowRight } from 'lucide-react';

interface GroundingProps {
    onComplete?: () => void;
    triggerHaptic: (type: 'light' | 'medium' | 'heavy') => void;
}

const steps = [
    { id: 1, icon: Eye, count: 5, label: "Cosas que ves", color: "text-red-500", bg: "bg-red-500" },
    { id: 2, icon: Hand, count: 4, label: "Cosas que tocas", color: "text-orange-500", bg: "bg-orange-500" },
    { id: 3, icon: Ear, count: 3, label: "Cosas que oyes", color: "text-yellow-500", bg: "bg-yellow-500" },
    /* Simplified for mobile UX - 5-4-3 is usually enough to break a loop */
];

const Grounding54321: React.FC<GroundingProps> = ({ onComplete, triggerHaptic }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [itemsClicked, setItemsClicked] = useState(0);

    const step = steps[currentStep];

    const handleItemClick = () => {
        triggerHaptic('medium');
        const newCount = itemsClicked + 1;
        setItemsClicked(newCount);

        if (newCount >= step.count) {
            triggerHaptic('heavy');
            setTimeout(() => {
                if (currentStep < steps.length - 1) {
                    setCurrentStep(prev => prev + 1);
                    setItemsClicked(0);
                } else {
                    onComplete?.();
                    // Reset after completion or show success state
                    setCurrentStep(0);
                    setItemsClicked(0);
                    alert("¡Conexión a tierra completada!");
                }
            }, 500);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-900 p-6 h-80 flex flex-col justify-between group hover:border-zinc-700 transition-all">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-wider">Puesta a Tierra</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Protocolo 5-4-3</p>
                </div>
                <div className="flex gap-1">
                    {steps.map((s, idx) => (
                        <div key={s.id} className={`w-2 h-2 rounded-full transition-colors ${idx === currentStep ? s.bg : idx < currentStep ? 'bg-zinc-600' : 'bg-zinc-800'}`} />
                    ))}
                </div>
            </div>

            {/* Main Interaction */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <step.icon size={48} className={`${step.color} animate-pulse`} />

                <div className="text-center space-y-2">
                    <p className="text-sm text-zinc-400 font-medium">Encuentra y toca:</p>
                    <h2 className={`text-3xl font-black uppercase tracking-tight ${step.color}`}>
                        {step.count - itemsClicked} {step.label}
                    </h2>
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={handleItemClick}
                className={`w-full py-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all scale-on-tap group/btn`}
            >
                <span>MARCAR 1</span>
                <Check size={16} className="text-zinc-500 group-hover/btn:text-white" />
            </button>

            {/* Progress Ring Background Effect (Optional) */}
            <div className={`absolute top-0 left-0 w-1 h-full ${step.bg} opacity-20`} />
        </div>
    );
};

export default Grounding54321;
