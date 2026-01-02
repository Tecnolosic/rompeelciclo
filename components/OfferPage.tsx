import React, { useState, useEffect } from 'react';
import { Check, Star, Shield, Lock, ArrowRight, X, Flame, Zap, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { useSoundFX } from '../src/hooks/useSoundFX';

interface OfferPageProps {
    onCheckout: () => void;
    onLogin: () => void;
}

const OfferPage: React.FC<OfferPageProps> = ({ onCheckout, onLogin }) => {
    const { playClick } = useSoundFX();
    const [timeLeft, setTimeLeft] = useState(900); // 15:00 minutes in seconds

    useEffect(() => {
        window.scrollTo(0, 0);
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#FFD700] selection:text-black font-sans pb-20">

            {/* NAVBAR */}
            <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-zinc-900 h-16 flex items-center justify-between px-6">
                <div className="flex items-center gap-2">
                    <Shield size={16} className="text-[#FFD700]" />
                    <span className="text-xs font-black uppercase tracking-widest text-white">ROMPE EL CICLO</span>
                </div>
                <button onClick={(e) => {
                    e.preventDefault();
                    playClick();
                    onLogin();
                }} className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase transition-colors">
                    Ya soy miembro
                </button>
            </nav>

            {/* STICKY URGENCY BAR */}
            <div className="sticky top-16 z-40 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 shadow-xl text-center md:text-left">
                <div className="flex items-center gap-2 font-black uppercase tracking-tighter text-xs md:text-sm animate-pulse">
                    <Flame size={14} className="fill-white" />
                    HAPPY NEW YEAR SALE — 45% OFF
                </div>
                <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold bg-black/20 px-3 py-1 rounded-full">
                    <Clock size={12} />
                    +2312 personas se unieron esta semana
                </div>
                <div className="hidden md:block text-[10px] font-medium opacity-90">
                    Últimos cupos a precio promocional
                </div>        </div>

            <div className="max-w-4xl mx-auto px-6 pt-16">

                {/* HEADLINE */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                        Entrená tu mente para<br />
                        <span className="text-[#FFD700]">pasar a la acción.</span>
                    </h1>
                    <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Acceso completo al sistema + coach asistido por IA + herramientas de acción + actualizaciones de por vida.<br />
                        <strong className="text-white">Pagás una sola vez. Acceso para siempre.</strong>
                    </p>
                </div>

                {/* PRICING CARD */}
                <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl relative max-w-2xl mx-auto mb-20 overflow-hidden">
                    <div className="absolute top-0 right-0 bg-[#FFD700] text-black text-xs font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                        Oferta Limitada
                    </div>

                    <div className="mb-8 p-4 bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-xl">
                        <p className="text-zinc-300 text-sm font-medium leading-relaxed">
                            No estás pagando por información. Estás accediendo a una <strong className="text-white">herramienta para romper el bloqueo</strong> en el momento exacto en que ocurre.
                            <br /><span className="text-[#FFD700] block mt-2">Si hoy te frena, entrás al sistema → salís en acción.</span>
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8 mt-4">
                        <div className="text-zinc-500 text-2xl font-bold decoration-red-500 line-through decoration-2">
                            $39.98 USD
                        </div>
                        <div className="text-5xl md:text-6xl font-black text-white flex items-center gap-2 text-shadow-glow">
                            $17.98 <span className="text-sm font-bold text-[#FFD700] bg-[#FFD700]/10 px-2 py-1 rounded border border-[#FFD700]/20 tracking-normal">45% OFF</span>
                        </div>
                    </div>

                    <p className="text-center text-zinc-500 text-xs uppercase tracking-widest mb-8">
                        Promoción exclusiva por New Year. Vuelve a precio normal en {formatTime(timeLeft)}.
                    </p>

                    <button
                        onClick={() => { try { playClick(); } catch (e) { console.error(e); } onCheckout(); }}
                        className="w-full bg-[#FFD700] hover:bg-[#FFC000] text-black font-black text-xl py-6 rounded-xl shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:shadow-[0_0_60px_rgba(255,215,0,0.5)] transform hover:scale-[1.01] transition-all flex items-center justify-center gap-3 uppercase tracking-tight mb-6"
                    >
                        👉 QUIERO ROMPER EL CICLO AHORA
                    </button>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-wide max-w-sm mx-auto mb-6 text-left">
                        <span className="flex items-center gap-2"><Check size={12} className="text-[#FFD700]" /> Acceso inmediato al sistema</span>
                        <span className="flex items-center gap-2"><Check size={12} className="text-[#FFD700]" /> Garantía de uso real</span>
                        <span className="flex items-center gap-2"><Check size={12} className="text-[#FFD700]" /> Código exclusivo</span>
                        <span className="flex items-center gap-2"><Check size={12} className="text-[#FFD700]" /> Funciona en cualquier dispositivo</span>
                    </div>        </div>

                {/* WHAT'S INCLUDED */}
                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">
                            Todo lo que recibís hoy:
                        </h3>
                        <ul className="space-y-6">
                            {[
                                "Acceso completo al Sistema Romper el Ciclo",
                                "Coach asistido por IA — 24/7",
                                "Mapa de Bloqueos + Rutas de Acción",
                                "Pilares de claridad mental",
                                "Herramientas de acción inmediata",
                                "Registro de avances y progreso"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className="bg-[#FFD700]/10 p-1 rounded">
                                        <Check size={16} className="text-[#FFD700]" strokeWidth={3} />
                                    </div>
                                    <span className="font-bold text-zinc-200">{item}</span>
                                </li>
                            ))}
                            <li className="flex items-start gap-4 pt-4 border-t border-zinc-800">
                                <div className="bg-[#FFD700]/20 p-1 rounded">
                                    <Star size={16} className="text-[#FFD700] fill-[#FFD700]" />
                                </div>
                                <span className="font-bold text-white">BONUS: Biblioteca de foco y activación</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-[#FFD700]/20 p-1 rounded">
                                    <Star size={16} className="text-[#FFD700] fill-[#FFD700]" />
                                </div>
                                <span className="font-bold text-white">BONUS: Material descargable</span>
                            </li>
                        </ul>
                        <div className="mt-8 p-4 bg-zinc-900/50 border-l-2 border-[#FFD700] rounded-r-xl">
                            <p className="text-sm text-zinc-400 italic">
                                "No es un curso que mirás y olvidás. Es una herramienta que usás cuando tu mente te frena."
                            </p>
                        </div>
                    </div>

                    {/* COMPARISON */}
                    <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                            Por qué es una oportunidad absurda
                        </h3>
                        <p className="text-red-500 font-bold text-xs uppercase tracking-widest mb-6">
                            Lo que hoy te frena… te cuesta mucho más que $17.98
                        </p>
                        <div className="border border-zinc-800 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-zinc-900 text-zinc-400 font-black uppercase text-[10px] tracking-widest">
                                    <tr>
                                        <th className="p-4">Alternativa</th>
                                        <th className="p-4">Costo</th>
                                        <th className="p-4 hidden sm:table-cell">Resultado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {[
                                        { name: 'Terapia Tradicional', cost: '$40-100 /sesión', res: 'Lento' },
                                        { name: 'Cursos Guru', cost: '$100-500', res: 'Poca acción' },
                                        { name: 'Videos Gratis', cost: 'Tiempo perdido', res: 'Efímero' },
                                        { name: 'Costo de NO decidir', cost: 'Incalculable', res: 'Meses perdidos', isPain: true },
                                        { name: 'Romper el Ciclo', cost: '$17.98 Único', res: 'Acción Inmediata', highlight: true }
                                    ].map((row: any, i) => (
                                        <tr key={i} className={row.highlight ? 'bg-[#FFD700]/10' : row.isPain ? 'bg-red-900/10' : ''}>
                                            <td className={`p-4 font-bold ${row.highlight ? 'text-white' : row.isPain ? 'text-red-400' : 'text-zinc-400'}`}>{row.name}</td>
                                            <td className={`p-4 font-bold ${row.highlight ? 'text-[#FFD700]' : row.isPain ? 'text-red-400' : 'text-zinc-500'}`}>{row.cost}</td>
                                            <td className={`p-4 hidden sm:table-cell text-xs ${row.highlight ? 'text-white' : row.isPain ? 'text-red-400' : 'text-zinc-600'}`}>{row.res}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => { try { playClick(); } catch (e) { console.error(e); } onCheckout(); }}
                                className="text-[#FFD700] font-black uppercase text-sm border-b-2 border-[#FFD700] hover:text-white hover:border-white transition-colors pb-1"
                            >
                                Quiero Acceso Completo Ahora
                            </button>
                        </div>
                    </div>
                </div>

                {/* TESTIMONIALS */}
                <div className="mb-20">
                    <h3 className="text-center text-3xl font-black text-white uppercase tracking-tighter mb-12">
                        Personas Reales. Avances Reales.
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { txt: "Pasé de dar vueltas 2 meses a tomar una decisión en una tarde.", stars: 5 },
                            { txt: "Lo uso cada vez que me freno. Me ordena la cabeza en minutos.", stars: 5 },
                            { txt: "Me ayudó a lanzar mi proyecto sin volver al círculo de duda.", stars: 5 },
                            { txt: "Sentí que recuperé el control sobre mi tiempo y mis decisiones.", stars: 5 }
                        ].map((t, i) => (
                            <div key={i} className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800/50">
                                <div className="flex gap-1 text-[#FFD700] mb-3">
                                    {[...Array(t.stars)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <p className="font-bold text-zinc-300">"{t.txt}"</p>
                                <div className="flex items-center gap-2 mt-4 opacity-50">
                                    <CheckCircle2 size={12} />
                                    <span className="text-[10px] uppercase font-bold">Usuario Verificado</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* GUARANTEE */}
                <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center mb-20">
                    <Shield size={48} className="text-[#FFD700] mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-white uppercase mb-4">Ingresás hoy sin riesgo mental</h3>
                    <p className="text-zinc-400 max-w-lg mx-auto mb-6 text-lg">
                        Si lo usás, vas a sentir el cambio desde la primera sesión — o no era para vos.
                        <br /><strong className="text-white">Entrás sin riesgo.</strong>
                    </p>
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
                        Porque el problema nunca fue motivación — fue el ciclo mental que hoy empezás a romper.
                    </p>
                </div>

                {/* FINAL CLOSING */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                        TU FUTURO NO CAMBIA SOLO.
                    </h2>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
                        Cambia cuando tomás acción… y ese momento es ahora.<br />
                        <strong className="text-white">Una sola decisión hoy → un ciclo menos mañana.</strong>
                    </p>
                </div>

                {/* FINAL CTA */}
                <div id="checkout" className="text-center pb-12">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-none">
                        Tu ciclo no se rompe mañana.<br />
                        <span className="text-[#FFD700]">Se rompe hoy.</span>
                    </h2>

                    <div className="inline-block bg-[#FFD700]/10 border border-[#FFD700]/30 px-6 py-3 rounded-lg mb-8">
                        <div className="text-[#FFD700] font-black uppercase tracking-wider text-sm flex items-center gap-2">
                            <Clock size={16} /> Oferta New Year Expira en {formatTime(timeLeft)}
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2 mb-8">
                        <div className="text-zinc-500 text-xl font-bold line-through decoration-red-500 decoration-2">
                            $39.98 USD
                        </div>
                        <div className="text-6xl font-black text-white">
                            $17.98 USD
                        </div>
                    </div>

                    <button
                        onClick={() => { try { playClick(); } catch (e) { console.error(e); } onCheckout(); }}
                        className="w-full max-w-md mx-auto bg-[#FFD700] hover:bg-[#FFC000] text-black font-black text-2xl py-6 rounded-xl shadow-[0_0_50px_rgba(255,215,0,0.4)] hover:shadow-[0_0_80px_rgba(255,215,0,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 uppercase tracking-tight"
                    >
                        👉 QUIERO ROMPER EL CICLO AHORA
                    </button>
                    <p className="mt-6 text-[10px] uppercase font-bold text-zinc-600 tracking-widest">
                        Pago Seguro · Acceso Inmediato
                    </p>
                </div>

            </div>
        </div>
    );
};

export default OfferPage;
