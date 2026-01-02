import React, { useState, useEffect } from 'react';
import { Shield, Zap, BookOpen, BrainCircuit, ArrowRight, CheckCircle2, Star, Trophy, Terminal, AlertTriangle, Fingerprint, Map, MoveRight, Quote } from 'lucide-react';
import { useSoundFX } from '../src/hooks/useSoundFX';

interface LandingPageProps {
    onStart: () => void;
    onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
    const { playClick } = useSoundFX();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const scrollToSection = (id: string) => {
        playClick();
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#FFD700] selection:text-black overflow-x-hidden font-sans">
            {/* AMBIENT NOISE & LIGHTING */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FFD700]/5 blur-[120px] rounded-full opacity-20 animate-pulse-slow"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            {/* NAV */}
            <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-900/50">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#FFD700] rounded-sm flex items-center justify-center transform rotate-3">
                            <Shield className="text-black" size={18} fill="currentColor" />
                        </div>
                        <span className="font-black tracking-tighter text-lg uppercase hidden md:block">ROMPE EL CICLO</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            playClick();
                            onLogin();
                        }}
                        className="text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors border border-zinc-800 px-6 py-2 rounded-full hover:border-[#FFD700] hover:bg-[#FFD700]/10"
                    >
                        Acceso Miembros
                    </button>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="relative pt-48 pb-32 px-6 max-w-5xl mx-auto flex flex-col items-center text-center z-10">
                <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

                    <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#FFD700]/30 rounded-full bg-[#FFD700]/5 mb-8 animate-in fade-in zoom-in duration-1000">
                        <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse"></span>
                        <span className="text-[10px] font-black tracking-[0.2em] text-[#FFD700] uppercase">Sistema v2.0 Activo</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 uppercase tracking-tighter leading-[0.9]">
                        No estás bloqueado.<br />
                        <span className="text-zinc-600">Estás atrapado</span><br />
                        en un ciclo.
                    </h1>

                    <p className="text-zinc-400 text-lg md:text-2xl font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
                        Y hoy lo vamos a romper.<br className="hidden md:block" />
                        <span className="text-white">Este proceso te devuelve el control — ahora mismo.</span>
                    </p>

                    <button
                        onClick={() => scrollToSection('emotional')}
                        className="group relative bg-[#FFD700] hover:bg-[#FFC000] text-black font-black text-xl py-6 px-12 rounded-sm transform transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:shadow-[0_0_60px_rgba(255,215,0,0.5)] uppercase tracking-tight"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            CONOCÉ MÁS <ArrowRight className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                        </span>
                    </button>
                </div>
            </section>

            {/* EMOTIONAL CONNECTION */}
            <section id="emotional" className="py-32 px-6 bg-zinc-950 border-t border-zinc-900 relative">
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">
                                Sabés lo que querés hacer.<br />
                                <span className="text-zinc-500">Sabés dónde querés estar.</span>
                            </h2>
                            <div className="w-12 h-1 bg-[#FFD700]"></div>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                Tenés ideas, planes, ganas. Querés crecer.
                                Pero cuando llega el momento de arrancar:
                            </p>
                            <ul className="space-y-4">
                                {['Dudás', 'Te frenás', 'Te llenás de pensamientos', 'Terminás diciendo "después"'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-white font-bold text-lg uppercase tracking-wide opacity-80">
                                        <AlertTriangle className="text-red-500" size={20} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-xl font-bold text-white border-l-4 border-red-500 pl-4 py-2 bg-red-500/5">
                                Y ese "después"… nunca llega.
                            </p>
                        </div>
                        <div className="bg-black border border-zinc-800 p-8 rounded-sm relative">
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-zinc-800 rounded-full blur-2xl opacity-50"></div>
                            <h3 className="text-2xl font-black text-white uppercase mb-6">La Verdad Brutal</h3>
                            <p className="text-zinc-400 mb-6 leading-relaxed">
                                No sos flojo. <br />
                                No te falta disciplina.
                            </p>
                            <p className="text-white text-xl font-bold leading-relaxed">
                                Es un <span className="text-[#FFD700]">patrón automático</span> que incorporaste — y te mantiene atrapado.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* REFRAME (CONTRAST) */}
            <section className="py-32 px-6 bg-[#FFD700] text-black pattern-grid-lg">
                <div className="max-w-4xl mx-auto text-center transform hover:scale-[1.01] transition-transform duration-500">
                    <Quote className="w-12 h-12 mx-auto mb-6 opacity-30" />
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
                        No necesitás más motivación.<br />
                        Necesitás un sistema.
                    </h2>
                    <p className="text-xl md:text-2xl font-bold max-w-2xl mx-auto opacity-80 leading-relaxed">
                        Un sistema simple que te saque del bloqueo en el momento exacto en que te estás frenando… y transforme inacción en acción real.
                    </p>
                    <div className="mt-12 inline-block border-4 border-black px-8 py-3 font-black text-2xl uppercase tracking-widest">
                        ESO ES ROMPER EL CICLO
                    </div>
                </div>
            </section>

            {/* WHAT IS IT? */}
            <section className="py-32 px-6 bg-zinc-950 border-y border-zinc-900">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-6">
                        ¿QUÉ ES ROMPER EL CICLO?
                    </h2>
                    <p className="text-zinc-400 text-xl max-w-2xl mx-auto leading-relaxed">
                        Un sistema guiado, práctico y probado para salir del estancamiento mental y avanzar — incluso cuando no tenés ganas, claridad o motivación.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
                    <div className="bg-black p-8 border border-zinc-800 hover:border-[#FFD700] transition-all group">
                        <Terminal className="text-zinc-600 group-hover:text-[#FFD700] mb-6 transition-colors" size={40} />
                        <h3 className="text-xl font-black text-white uppercase mb-4">Detecta el Bloqueo</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">Identifica el patrón exacto que te está frenando en tiempo real.</p>
                    </div>
                    <div className="bg-black p-8 border border-zinc-800 hover:border-[#FFD700] transition-all group">
                        <Zap className="text-zinc-600 group-hover:text-[#FFD700] mb-6 transition-colors" size={40} />
                        <h3 className="text-xl font-black text-white uppercase mb-4">Lo Desarma</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">Herramientas psicológicas de aplicación inmediata para desactivar la parálisis.</p>
                    </div>
                    <div className="bg-black p-8 border border-zinc-800 hover:border-[#FFD700] transition-all group">
                        <MoveRight className="text-zinc-600 group-hover:text-[#FFD700] mb-6 transition-colors" size={40} />
                        <h3 className="text-xl font-black text-white uppercase mb-4">Acción Real</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">Te lleva a movimiento tangible en minutos. Sin pensar. Solo ejecutar.</p>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="system" className="py-32 px-6 relative overflow-hidden bg-black">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
                        <div className="md:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                                CÓMO FUNCIONA
                            </h2>
                            <p className="text-zinc-400 font-medium">
                                Cuando te estás frenando, entrás al sistema y:
                            </p>
                        </div>
                        <div className="md:w-1/2 h-1 bg-zinc-900 rounded-full"></div>
                    </div>

                    <div className="grid gap-8">
                        {[
                            { icon: Map, title: 'El Mapa', desc: 'Te muestra dónde estás y qué te está deteniendo ahora mismo.' },
                            { icon: BrainCircuit, title: 'Coach IA', desc: 'Asistente inteligente que ordena tu cabeza y te guía hacia la acción.' },
                            { icon: Shield, title: 'Pilares de Claridad', desc: 'Cortan el ruido mental para que veas con enfoque láser.' },
                            { icon: Zap, title: 'Herramientas', desc: 'Ejercicios de acción inmediata para empujarte a avanzar.' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-8 group">
                                <div className="hidden md:flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center group-hover:border-[#FFD700] group-hover:bg-[#FFD700] transition-colors">
                                        <item.icon size={20} className="text-zinc-500 group-hover:text-black" />
                                    </div>
                                    {idx !== 3 && <div className="h-12 w-[1px] bg-zinc-800 mt-4 group-hover:bg-[#FFD700]/50"></div>}
                                </div>
                                <div className="flex-1 bg-zinc-900/30 p-8 rounded-sm border border-zinc-800/50 hover:bg-zinc-900 hover:border-[#FFD700]/30 transition-all">
                                    <h3 className="text-xl font-black text-white uppercase mb-2 flex items-center gap-3">
                                        <item.icon size={20} className="md:hidden text-[#FFD700]" />
                                        {item.title}
                                    </h3>
                                    <p className="text-zinc-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <p className="text-xl font-black text-white uppercase tracking-wider">
                            No es teoría. No es motivación vacía.<br />
                            <span className="text-[#FFD700]">Es acción guiada, en tus momentos reales.</span>
                        </p>
                        <button
                            onClick={() => scrollToSection('final')}
                            className="mt-8 text-sm font-bold text-zinc-500 hover:text-white uppercase tracking-widest border-b border-zinc-800 hover:border-white pb-1 transition-colors"
                        >
                            CRECER AHORA
                        </button>
                    </div>
                </div>
            </section>

            {/* DIFFERENTIAL */}
            <section className="py-32 px-6 bg-zinc-950 border-t border-zinc-900">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-block p-4 rounded-full bg-[#FFD700]/10 mb-8">
                        <Trophy className="text-[#FFD700] w-12 h-12" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8">
                        NO ES UN CURSO.<br />NO ES UN LIBRO.
                    </h2>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12">
                        Es una herramienta que usás <strong className="text-white">cuando estás bloqueado</strong>.<br />
                        Funciona en la vida real, en los momentos en los que tu cabeza te frena.
                    </p>

                    {/* TESTIMONIALS */}
                    <div className="grid md:grid-cols-3 gap-6 mt-16">
                        {[
                            { name: "Carlos M.", role: "Emprendedor", txt: "Dejé de dar vueltas en 10 minutos. Brutal." },
                            { name: "Sofía L.", role: "Diseñadora", txt: "Es como tener un coach al lado gritándote la verdad." },
                            { name: "Javier R.", role: "Developer", txt: "Simple. Directo. Funciona." }
                        ].map((t, i) => (
                            <div key={i} className="bg-black p-6 border border-zinc-800 rounded-sm hover:border-zinc-700 transition-colors text-left">
                                <div className="flex gap-1 text-[#FFD700] mb-4">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                                </div>
                                <p className="text-zinc-300 text-sm mb-4 italic">"{t.txt}"</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-bold text-zinc-500">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white uppercase">{t.name}</p>
                                        <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section id="final" className="py-40 px-6 bg-[#FFD700] text-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-multiply"></div>
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.85]">
                        ROMPE EL CICLO<br />EMPIEZA AHORA
                    </h2>
                    <p className="text-xl md:text-2xl font-bold mb-12 opacity-80 max-w-xl mx-auto leading-tight">
                        Tomá decisiones. Avanzá. Recuperá el control de tu tiempo, tus proyectos y tu vida.
                    </p>
                    <button
                        onClick={() => { playClick(); onStart(); }}
                        className="bg-black text-white font-black text-2xl py-8 px-16 rounded-sm hover:scale-[1.02] hover:shadow-2xl transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] uppercase tracking-widest flex items-center justify-center gap-4 mx-auto"
                    >
                        ROMPER EL CICLO AHORA <ArrowRight size={28} />
                    </button>
                    <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] opacity-60">
                        Acceso Inmediato • Garantía de Impacto
                    </p>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 bg-black text-center border-t border-zinc-900">
                <div className="flex items-center justify-center gap-2 mb-6 opacity-30">
                    <Shield size={16} />
                    <span className="font-black tracking-tighter uppercase">ROMPE EL CICLO SYSTEM</span>
                </div>
                <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">
                    © 2024 V2.5.0 • Developed for High Performance
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;
