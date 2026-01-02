
import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, User, Calendar, Briefcase, Loader2, Mail, Lock } from 'lucide-react';
import { OnboardingStep } from '../types';
import { supabase } from '../src/lib/supabase';

interface OnboardingProps {
  onComplete: (data: { email: string; deviceId: string; blocker: string; name: string; dob: string; profession: string }) => void;
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, triggerHaptic }) => {
  const [step, setStep] = useState<OnboardingStep>(OnboardingStep.CONTRACT);
  const [blocker, setBlocker] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [profession, setProfession] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

  const [currentDeviceId] = useState(() => {
    let id = localStorage.getItem('rompe_local_device_id');
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('rompe_local_device_id', id);
    }
    return id;
  });

  // Auto-detect session to skip Auth step if already logged in but not onboarded
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // If user is logged in, skip to QUIZ
        setEmail(session.user.email || '');
        if (step === OnboardingStep.CONTRACT || step === OnboardingStep.AUTH) {
          setStep(OnboardingStep.QUIZ);
        }
      }
    });
  }, []);

  const handleAuth = async () => {
    setIsFinishing(true);
    setError(null);
    triggerHaptic('medium');

    try {
      if (isLogin) {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;
        // Login successful. 
        // Advance to QUIZ immediately. If the user is already fully onboarded, App.tsx will unmount this component shortly.
        // If they are NOT fully onboarded, this lets them continue the flow.
        setStep(OnboardingStep.QUIZ);
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: email.split('@')[0], // Default meta
            }
          }
        });

        if (signUpError) throw signUpError;

        if (data.session) {
          // Auto-login worked (Email Confirm Disabled or unnecessary)
          setStep(OnboardingStep.QUIZ);
        } else if (data.user) {
          // User created but no session -> Email Confirmation Required
          setError("Cuenta creada. Por favor VERIFICA tu email para continuar.");
          setIsLogin(true); // Switch to login mode so they can sign in after verifying
        }
      }
    } catch (e: any) {
      console.error("Auth Error Full:", e);
      const msg = e.message?.toLowerCase() || '';

      if (msg.includes('rate limit')) {
        setError("⛔ Bloqueo temporal por seguridad (IP). Espera un momento o cambia de red WiFi/Datos.");
      } else if (msg.includes('already registered') || msg.includes('user already registered')) {
        setError("⚠️ Este email ya existe. Redirigiendo a inicio de sesión...");
        setTimeout(() => setIsLogin(true), 2000);
      } else {
        setError(`Error: ${e.message}`);
      }
    } finally {
      setIsFinishing(false);
    }
  };

  const handleFinish = async () => {
    console.log('[Onboarding] handleFinish started');
    setIsFinishing(true);
    triggerHaptic('heavy');
    setError(null);

    try {
      let { data: { user } } = await supabase.auth.getUser();
      console.log('[Onboarding] Initial User Check:', user?.id);

      // RECOVERY: If no user, but we have credentials, try to sign in
      if (!user && email && password) {
        console.log('[Onboarding] No session found. Attempting silent login recovery...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          console.error('[Onboarding] Recovery login failed:', signInError);
          throw new Error('No se pudo establecer sesión. Por favor inicia sesión manualmente.');
        }

        if (signInData.user) {
          user = signInData.user;
          console.log('[Onboarding] Recovery login successful. User:', user.id);
        }
      }

      if (!user) {
        throw new Error('Error crítico: No hay usuario autenticado después del registro.');
      }

      console.log('[Onboarding] Attempting upsert for:', user.id);
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name,
          dob,
          profession,
          north_star: '',
          current_identity: '',
          new_identity: '',
          xp: 0,
          updated_at: new Date().toISOString()
        });

      if (updateError) {
        console.error('[Onboarding] Upsert error:', updateError);
        throw updateError;
      }
      console.log('[Onboarding] Upsert successful');

      console.log('[Onboarding] Calling onComplete');
      onComplete({
        email,
        deviceId: currentDeviceId,
        blocker: blocker || 'General',
        name,
        dob,
        profession
      });
    } catch (e: any) {
      console.error('[Onboarding] Error catch:', e);
      setError(e.message);
    } finally {
      setIsFinishing(false);
      console.log('[Onboarding] handleFinish done');
    }
  };

  const renderStep = () => {
    switch (step) {
      case OnboardingStep.CONTRACT:
        return (
          <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in duration-700">
            <div className="h-20 w-20 bg-[#FFD700]/10 rounded-full flex items-center justify-center border border-[#FFD700]/30 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
              <ShieldCheck className="text-[#FFD700]" size={40} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-white leading-none">EL CONTRATO</h1>
            <p className="text-zinc-400 text-sm px-4 leading-relaxed">
              "Esta aplicación es el martillo. Tú eres el brazo que golpea. No buscamos comodidad, buscamos resultados."
            </p>
            <button
              onClick={() => { triggerHaptic('medium'); setStep(OnboardingStep.AUTH); }}
              className="w-full bg-[#FFD700] text-black font-black py-5 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-tight scale-on-tap"
            >
              ACEPTO EL TRATO <ArrowRight size={20} />
            </button>
          </div>
        );

      case OnboardingStep.AUTH:
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAuth();
            }}
            className="flex flex-col space-y-6 animate-in slide-in-from-right duration-500"
          >
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                {isLogin ? 'VINCULAR TERMINAL' : 'CREAR IDENTIDAD'}
              </h2>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                {isLogin ? 'Ingresa tus credenciales de operador' : 'Inicia el protocolo de registro core'}
              </p>
            </div>
            {error && <p className="text-red-500 text-[10px] font-black uppercase bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FFD700] transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="EMAIL / OPERADOR ID"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 pl-12 text-sm font-bold text-white outline-none focus:border-[#FFD700] transition-all"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FFD700] transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="CONTRASEÑA"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 pl-12 text-sm font-bold text-white outline-none focus:border-[#FFD700] transition-all"
                />
              </div>
            </div>
            <div className="space-y-3">
              <button
                type="submit"
                disabled={!email || password.length < 6 || isFinishing}
                className={`w-full py-5 rounded-2xl font-black uppercase flex items-center justify-center gap-3 transition-all ${email && password.length >= 6 && !isFinishing
                  ? 'bg-[#FFD700] text-black shadow-[0_10px_30px_rgba(255,215,0,0.2)] scale-on-tap'
                  : 'bg-zinc-800 text-zinc-600 opacity-50'
                  }`}
              >
                {isFinishing ? (
                  <>PROCESANDO... <Loader2 className="animate-spin" size={20} /></>
                ) : (
                  <>{isLogin ? 'ACCEDER AL SISTEMA' : 'ESTABLECER VÍNCULO'} <ArrowRight size={20} /></>
                )}
              </button>
              <button
                onClick={() => { setIsLogin(!isLogin); setError(null); triggerHaptic('light'); }}
                className="w-full mt-4 py-4 rounded-xl border border-zinc-800 bg-[#FFD700]/5 text-[#FFD700] text-xs font-black uppercase tracking-widest hover:bg-[#FFD700]/10 hover:border-[#FFD700]/50 transition-all flex items-center justify-center gap-2"
                type="button"
              >
                {isLogin ? (
                  <>¿NO TIENES CUENTA? <span className="underline">CREAR NUEVA</span></>
                ) : (
                  <>¿YA REGISTRADO? <span className="underline">INICIAR SESIÓN AQUÍ</span></>
                )}
              </button>
              <button
                onClick={() => {
                  triggerHaptic('medium');
                  onComplete({
                    email: 'invitado@rompe.com',
                    deviceId: currentDeviceId,
                    blocker: 'Invitado',
                    name: 'Invitado',
                    dob: '',
                    profession: ''
                  });
                }}
                className="w-full text-zinc-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors pt-2"
                type="button"
              >
                MODO INVITADO (SIN REGISTRO)
              </button>
            </div>
          </form>
        );

      case OnboardingStep.QUIZ:
        return (
          <div className="flex flex-col space-y-8 animate-in slide-in-from-right duration-500">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">EL DIAGNÓSTICO</h2>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Identifica tu ancla principal</p>
            </div>
            <div className="grid gap-4">
              {['Miedo al qué dirán', 'Perfeccionismo', 'Falta de Tiempo'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => { triggerHaptic('light'); setBlocker(opt); }}
                  className={`p-6 rounded-2xl border-2 transition-all text-left uppercase font-black text-sm ${blocker === opt ? 'bg-[#FFD700]/10 border-[#FFD700] text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button
              disabled={!blocker}
              onClick={() => { triggerHaptic('medium'); setStep(OnboardingStep.PROFILE); }}
              className={`w-full py-5 rounded-2xl font-black uppercase transition-all ${blocker ? 'bg-white text-black scale-on-tap shadow-xl' : 'bg-zinc-800 text-zinc-600 opacity-50'
                }`}
            >
              CONTINUAR
            </button>
          </div>
        );

      case OnboardingStep.PROFILE:
        return (
          <div className="flex flex-col space-y-6 animate-in slide-in-from-right duration-500">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">CENSO OPERADOR</h2>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Configuración de parámetros vitales</p>
            </div>
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FFD700] transition-colors" size={18} />
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="NOMBRE COMPLETO"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 pl-12 text-sm font-bold text-white outline-none focus:border-[#FFD700] transition-all"
                />
              </div>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FFD700] transition-colors" size={18} />
                <input
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 pl-12 text-sm font-bold text-white outline-none focus:border-[#FFD700] transition-all"
                />
              </div>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#FFD700] transition-colors" size={18} />
                <select
                  value={profession}
                  onChange={e => setProfession(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 pl-12 text-sm font-bold text-white outline-none focus:border-[#FFD700] appearance-none transition-all"
                >
                  <option value="">PROFESIÓN / ROL</option>
                  <option value="Emprendedor">Emprendedor</option>
                  <option value="Artista">Artista / Creativo</option>
                  <option value="Empleado">Empleado / Profesional</option>
                  <option value="Estudiante">Estudiante</option>
                </select>
              </div>
            </div>
            <button
              disabled={!name || !dob || !profession || isFinishing}
              onClick={handleFinish}
              className={`w-full py-5 rounded-2xl font-black uppercase flex items-center justify-center gap-3 transition-all ${name && dob && profession && !isFinishing
                ? 'bg-[#FFD700] text-black shadow-[0_10px_30px_rgba(255,215,0,0.2)] scale-on-tap'
                : 'bg-zinc-800 text-zinc-600 opacity-50'
                }`}
            >
              {isFinishing ? (
                <>INICIANDO SISTEMA... <Loader2 className="animate-spin" size={20} /></>
              ) : (
                <>VINCULAR PERFIL Y COMENZAR <ArrowRight size={20} /></>
              )}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 selection:bg-[#FFD700] selection:text-black">
      <div className="w-full max-sm relative">
        <div className="absolute -inset-20 bg-[#FFD700]/5 rounded-full blur-[100px] pointer-events-none"></div>
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;
