
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Home, Map, Wrench, Calendar, Zap, Shield, Trophy, BrainCircuit, Check, LogOut, Loader2, Menu, Library } from 'lucide-react';
import Resources from './components/Resources';
import EbookGenerator from './components/EbookGenerator';
import { AppSection, Pilar, Confession, UserStats, DailySpark, ActivityLog, Goal, UserIdentity, OnboardingStep } from './types';
import lottie from 'lottie-web';
import Timeline from './components/Timeline';
import IdentityMap from './components/IdentityMap';
import Toolbox from './components/Toolbox';
import Stats from './components/Stats';
import BunkerMode from './components/BunkerMode';
import ReadingView from './components/ReadingView';
import Onboarding from './components/Onboarding';
import MentorNode from './components/MentorNode';
import VerificationGate from './components/VerificationGate';
import LandingPage from './components/LandingPage';
import OfferPage from './components/OfferPage';
import { useSupabaseSync } from './src/hooks/useSupabaseSync';
import { supabase } from './src/lib/supabase';
import { useSoundFX } from './src/hooks/useSoundFX';
import LevelUpOverlay from './components/LevelUpOverlay';
// @ts-ignore
import confetti from 'canvas-confetti';

const INITIAL_PILARES: Pilar[] = [
  { id: 0, titulo: 'EL DESPERTAR', subtitulo: 'Protocolo de Consciencia', concepto: 'Tu vida es una repetición. Romper el ciclo requiere dolor.', accion: 'Análisis de Patrones', ejercicio: 'El Muro de la Verdad', completado: false, bloqueado: false },
  { id: 1, titulo: 'TRAMPA MENTAL', subtitulo: 'Procrastinación Culta', concepto: 'Estudiar es un escondite. La teoría sin práctica es veneno.', accion: 'Dieta de Información', ejercicio: 'Confesión del Espejo', completado: false, bloqueado: true },
  { id: 2, titulo: 'VERDAD DEL MIEDO', subtitulo: 'Riesgo Emocional', concepto: 'Decidir con miedo es la única forma de crecer.', accion: 'Regla 30 días.', ejercicio: 'Botón del Pánico Inverso', completado: false, bloqueado: true },
  { id: 3, titulo: 'VENDER ES AMAR', subtitulo: 'Tu Valor Real', concepto: 'No vender es egoísmo puro.', accion: 'Lanzamiento Flash.', ejercicio: 'Generador de Oferta Flash', completado: false, bloqueado: true },
  { id: 4, titulo: 'MOTOR DE ACCIÓN', subtitulo: 'Sistemas sobre Emociones', concepto: 'El impulso vence a la motivación.', accion: 'Acción Mínima Diaria.', ejercicio: 'Streak Tracker', completado: false, bloqueado: true },
  { id: 5, titulo: 'CÍRCULO DE FUEGO', subtitulo: 'Gestión del Entorno', concepto: 'Tu fuerza de voluntad no puede contra tu entorno.', accion: 'Auditoría Social', ejercicio: 'Lista de Despido', completado: false, bloqueado: true },
  { id: 6, titulo: 'EL FRACASO ES DATO', subtitulo: 'Resiliencia Kaizen', concepto: 'Quítale la emoción al error. Solo es información.', accion: 'Re-encuadre Táctico', ejercicio: 'Post-Mortem de Éxito', completado: false, bloqueado: true }
];

const INITIAL_IDENTITY: UserIdentity = {
  north_star: '',
  current_identity: '',
  new_identity: ''
};

const INITIAL_GOALS: Goal[] = [
  { id: '1', goal_title: 'Meta de Impacto 1', target_date: '', sub_tasks: [], progress_percentage: 0 },
  { id: '2', goal_title: 'Meta de Impacto 2', target_date: '', sub_tasks: [], progress_percentage: 0 },
  { id: '3', goal_title: 'Meta de Impacto 3', target_date: '', sub_tasks: [], progress_percentage: 0 },
];

const SuccessOverlay: React.FC<{ type: 'goal' | 'streak'; onClose: () => void }> = ({ type, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { playLevelUp } = useSoundFX();

  useEffect(() => {
    // Play sound immediately
    playLevelUp();

    if (containerRef.current) {
      const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: type === 'goal'
          ? 'https://lottie.host/b0429f4b-3245-420d-9b7e-967a505f564b/4rXo0Iq5eN.json'
          : 'https://lottie.host/62539097-f078-4389-9e8c-572242630f91/zUaP9vR9m9.json'
      });

      const timer = setTimeout(() => {
        onClose();
      }, 3500);

      return () => {
        animation.destroy();
        clearTimeout(timer);
      };
    }
  }, [type, onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      {/* SCREEN FLASH EFFECT */}
      <div className="absolute inset-0 bg-[#FFD700] animate-flash pointer-events-none opacity-0 mix-blend-overlay"></div>

      <div className="relative w-80 h-80 flex items-center justify-center mb-8">
        <div className={`absolute inset-0 rounded-full blur-[100px] opacity-30 animate-pulse ${type === 'goal' ? 'bg-[#FFD700]' : 'bg-white'}`}></div>

        {/* LIGHTNING ICON FOR STREAK/POWER */}
        {type === 'streak' && (
          <div className="absolute inset-0 flex items-center justify-center z-20 animate-bounce-slow">
            <Zap size={120} className="text-[#FFD700] fill-[#FFD700] drop-shadow-[0_0_50px_rgba(255,215,0,0.8)]" />
          </div>
        )}

        <div ref={containerRef} className="w-full h-full relative z-10 scale-150" />
      </div>

      <div className="text-center space-y-4 mt-8 animate-in slide-in-from-bottom-6 duration-700 relative z-30">
        <h2 className="text-6xl font-black text-white uppercase tracking-tighter gold-glow animate-pulse">
          {type === 'goal' ? 'OBJETIVO ANIQUILADO' : 'RACHA DE PODER'}
        </h2>
        <p className="text-[#FFD700] font-black uppercase text-xs tracking-[0.6em] opacity-90 drop-shadow-lg">
          {type === 'goal' ? 'HAS ROTO EL CICLO HOY' : 'SISTEMA NERVIOSO REPROGRAMADO'}
        </p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { session, loading, fetchUserData, saveProfile, saveGoal, saveConfession, savePilarProgress, logout } = useSupabaseSync();
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [showOffer, setShowOffer] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HOME);
  const [pilares, setPilares] = useState<Pilar[]>(INITIAL_PILARES);
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [bunkerActive, setBunkerActive] = useState(false);
  const [readingPilarId, setReadingPilarId] = useState<number | null>(null);
  const [mentorTrigger, setMentorTrigger] = useState<string | null>(null);
  const [dailySparks, setDailySparks] = useState<DailySpark[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]); // CORRECTION: Added missing state
  const [showSuccess, setShowSuccess] = useState<'goal' | 'streak' | null>(null);
  const [showLevelUp, setShowLevelUp] = useState<boolean>(false);
  const [showEbook, setShowEbook] = useState<boolean>(false);
  // NEW: Control initial onboarding step for navigation (Landing -> Login)
  const [onboardingStartStep, setOnboardingStartStep] = useState<OnboardingStep>(OnboardingStep.CONTRACT);

  const { playClick, playSuccess, playLevelUp, playType } = useSoundFX();
  const prevLevelRef = useRef<number>(1);
  const [isEjecutando, setIsEjecutando] = useState(false);

  const [userStats, setUserStats] = useState<UserStats>({ current_streak: 0, best_streak: 0, last_active_date: null, total_milestones: 0, xp: 0 });
  const [identity, setIdentity] = useState<UserIdentity>(INITIAL_IDENTITY);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);

  useEffect(() => {
    if (session) {
      setShowLanding(false);
      loadData();
    } else {
      // RESET STATE ON LOGOUT
      setIsOnboarded(false);
      setIsVerified(false);
      setIdentity(INITIAL_IDENTITY);
      setUserStats({ current_streak: 0, best_streak: 0, last_active_date: null, total_milestones: 0, xp: 0 });
      setGoals(INITIAL_GOALS);
      setConfessions([]);
      setPilares(INITIAL_PILARES);
      setShowLanding(true);
    }
  }, [session]);

  // Level Up Detection
  useEffect(() => {
    const currentLevel = Math.floor(userStats.xp / 1000) + 1;
    if (currentLevel > prevLevelRef.current) {
      playLevelUp();
      setShowLevelUp(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFFFFF']
      });
      prevLevelRef.current = currentLevel;
    }
  }, [userStats.xp]);

  const loadData = async () => {
    const data = await fetchUserData();
    if (data) {
      const { profile, goals: dbGoals, confessions: dbConfessions, pillarProgress: dbPillarProgress, pillars: dbPillars, dailySparks: dbSparks, interactions: dbInteractions } = data;

      if (profile) {
        setIdentity(prev => ({ ...prev, ...profile }));
        setUserStats({
          current_streak: profile.current_streak || 0,
          best_streak: profile.best_streak || 0,
          last_active_date: profile.last_active_date,
          total_milestones: profile.total_milestones || 0,
          xp: profile.xp || 0
        });
        // Check if profile exists. If user has name OR profession OR is_verified, assume onboarded.
        // Relaxed check to prevent returning users from getting stuck in Onboarding loop.
        setIsOnboarded(!!profile.name || !!profile.profession || !!profile.is_verified);
        setIsVerified(profile.is_verified || false);
      }

      if (dbGoals.length > 0) setGoals(dbGoals.map((g: any) => ({
        id: g.id,
        goal_title: g.goal_title,
        target_date: g.target_date || '',
        sub_tasks: g.sub_tasks || [],
        progress_percentage: g.progress_percentage || 0
      })));

      if (dbConfessions.length > 0) setConfessions(dbConfessions.map((c: any) => ({
        id: c.id,
        content: c.content,
        type: c.type,
        timestamp: c.timestamp,
        date: c.date,
        pilarId: c.pilar_id,
        sessionName: c.session_name,
        note: c.note
      })));

      // Dynamic Pillars Logic
      if (dbPillars && dbPillars.length > 0) {
        const mergedPillars = dbPillars.map((p: any) => {
          const progress = dbPillarProgress.find((dp: any) => dp.pilar_id === p.id);
          return {
            id: p.id,
            titulo: p.titulo,
            subtitulo: p.subtitulo,
            concepto: p.concepto,
            accion: p.accion,
            ejercicio: p.ejercicio,
            completado: progress ? progress.completed : false,
            bloqueado: progress ? !progress.unlocked : p.is_locked_by_default
          };
        });
        setPilares(mergedPillars.sort((a: any, b: any) => a.id - b.id));
      } else if (dbPillarProgress.length > 0) {
        // Fallback: Static Pillars + Dynamic Progress
        setPilares(prev => prev.map(p => {
          const progress = dbPillarProgress.find((dp: any) => dp.pilar_id === p.id);
          if (progress) return { ...p, completado: progress.completed, bloqueado: !progress.unlocked };
          return p;
        }));
      }

      if (dbSparks && dbSparks.length > 0) {
        setDailySparks(dbSparks);
      }

      if (dbInteractions) {
        setInteractions(dbInteractions);
      }
    }
  };



  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      const patterns = { light: 15, medium: 40, heavy: 80 };
      window.navigator.vibrate(patterns[type]);
    }
  }, []);

  const updateStreak = () => {
    setIsEjecutando(true);
    triggerHaptic('medium');
    playSuccess();
    setTimeout(() => {
      setShowSuccess('streak');
      const now = new Date();
      const newStats = {
        ...userStats,
        current_streak: userStats.current_streak + 1,
        best_streak: Math.max(userStats.best_streak, userStats.current_streak + 1),
        last_active_date: now.toISOString(),
        xp: userStats.xp + 100
      };
      setUserStats(newStats);
      saveProfile(newStats);
      setIsEjecutando(false);
    }, 800);
  };

  const handlePilarComplete = (id: number) => {
    setPilares(prev => prev.map(p => {
      if (p.id === id) {
        savePilarProgress(id, true, true);
        return { ...p, completado: true };
      }
      if (p.id === id + 1) {
        savePilarProgress(id + 1, false, true);
        return { ...p, bloqueado: false };
      }
      return p;
    }));
    updateStreak();
  };

  const handleDeepDive = (pilarId: number | string) => {
    if (typeof pilarId === 'number') {
      const pilar = pilares.find(p => p.id === pilarId);
      if (!pilar) return;
      setMentorTrigger(`[CONTEXTO: CAPITULO ${pilarId + 1} - ${pilar.titulo}]`);
    } else {
      setMentorTrigger(pilarId);
    }
    triggerHaptic('heavy');
    setReadingPilarId(null);
    setActiveSection(AppSection.MENTOR);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4 font-sans text-white">
      <Loader2 className="text-[#FFD700] animate-spin" size={48} />
      <p className="text-[#FFD700] font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Sincronizando Sistema...</p>
    </div>
  );

  if (showLanding && !session) return <LandingPage onStart={() => { setShowOffer(true); setShowLanding(false); setOnboardingStartStep(OnboardingStep.CONTRACT); }} onLogin={() => { setOnboardingStartStep(OnboardingStep.AUTH); setShowLanding(false); }} />;

  if (showOffer && !session) return (
    <OfferPage
      onCheckout={() => {
        // Redirección directa a Lemon Squeezy
        window.location.href = 'https://rompeelciclo.lemonsqueezy.com/checkout/buy/a4e123fa-eb45-42b4-b21c-31edda254689';
      }}
      onLogin={() => { setOnboardingStartStep(OnboardingStep.AUTH); setShowOffer(false); setShowLanding(false); }}
    />
  );

  if (!isOnboarded) return <Onboarding initialStep={onboardingStartStep} onComplete={(d) => {
    setIdentity(prev => ({ ...prev, ...d }));
    saveProfile(d); // PERSIST TO DB
    setIsOnboarded(true);
  }} triggerHaptic={triggerHaptic} />;

  if (!isVerified && identity.name !== 'Invitado') return <VerificationGate identity={identity} onVerify={() => {
    setIsVerified(true);
    saveProfile({ is_verified: true });
  }} triggerHaptic={triggerHaptic} />;

  if (bunkerActive) return <BunkerMode onExit={() => setBunkerActive(false)} />;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white w-full md:max-w-7xl md:mx-auto shadow-2xl relative overflow-hidden font-sans selection:bg-[#FFD700] selection:text-black">

      {/* GLOBAL NOISE TEXTURE */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay"></div>

      {/* AMBIENT GLOW */}
      <div className="fixed top-0 left-0 w-full h-32 bg-[#FFD700]/5 blur-[80px] pointer-events-none z-[0]"></div>

      {showSuccess && <SuccessOverlay type={showSuccess} onClose={() => setShowSuccess(null)} />}

      <header className="px-6 pt-12 pb-6 flex justify-between items-end border-b border-zinc-800 bg-black/90 backdrop-blur-xl sticky top-0 z-[100]">
        <div className="relative z-10">
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase leading-none">ROMPE EL CICLO</h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
            NIVEL {Math.floor(userStats.xp / 1000) + 1} • <span className="text-[#FFD700]">{identity.name?.split(' ')[0].toUpperCase()}</span>
          </p>
        </div>
        <div className="flex gap-2 relative z-10">
          <button onClick={() => { triggerHaptic('medium'); playClick(); setBunkerActive(true); }} className="bg-zinc-900 hover:bg-zinc-800 p-2.5 rounded-xl border border-zinc-800 transition-colors group">
            <Shield size={20} className="text-zinc-500 group-hover:text-[#FFD700]" />
          </button>
          <button onClick={() => { triggerHaptic('heavy'); playClick(); logout(); }} className="bg-zinc-900 hover:bg-zinc-800 p-2.5 rounded-xl border border-zinc-800 transition-colors group">
            <LogOut size={20} className="text-zinc-500 group-hover:text-red-500" />
          </button>
        </div>

        {/* PROGRESS LINE */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-zinc-900 overflow-hidden">
          <div className="h-full bg-[#FFD700] shadow-[0_0_10px_#FFD700]" style={{ width: `${(userStats.xp % 1000) / 10}%` }} />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32 smooth-scroll relative z-10">
        {activeSection === AppSection.HOME && (
          <div className="space-y-6 pb-12">
            <Timeline pilares={pilares} onPilarClick={(id) => setReadingPilarId(id)} onOpenEbook={() => setShowEbook(true)} />
          </div>
        )}
        {activeSection === AppSection.MAPA && (
          <IdentityMap
            identity={identity}
            setIdentity={(newIdentity) => {
              setIdentity(newIdentity);
              if (typeof newIdentity !== 'function') {
                saveProfile(newIdentity);
              }
            }}
            goals={goals}
            updateGoal={(g) => {
              setGoals(prev => prev.map(p => p.id === g.id ? g : p));
              saveGoal(g);
            }}
            triggerHaptic={triggerHaptic}
          />
        )}
        {activeSection === AppSection.MENTOR && <MentorNode identity={identity} confessions={confessions} goals={goals} userStats={userStats} triggerHaptic={triggerHaptic} initialTrigger={mentorTrigger} onTriggerHandled={() => setMentorTrigger(null)} />}

        {activeSection === AppSection.HERRAMIENTAS && (
          <Toolbox
            onAddConfession={(c) => {
              const newConf = { ...c, id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), date: new Date().toISOString() };
              setConfessions(prev => [newConf, ...prev]);
              saveConfession(newConf);
            }}
            triggerHaptic={triggerHaptic}
            onTriggerMentor={handleDeepDive}
          />
        )}
        {activeSection === AppSection.RACHA && (
          <Stats
            userStats={userStats}
            confessions={confessions}
            dailySparks={dailySparks}
            interactions={interactions}
            activityLogs={[]}
            triggerHaptic={triggerHaptic}
          />
        )}
      </main>

      {readingPilarId !== null && (
        <ReadingView
          pilarId={readingPilarId}
          onClose={() => setReadingPilarId(null)}
          onComplete={(id) => { handlePilarComplete(id); }}
          onDeepDive={handleDeepDive}
        />
      )}

      {showEbook && (
        <EbookGenerator identity={identity} onClose={() => setShowEbook(false)} />
      )}

      {/* TACTICAL NAV (HUD) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md md:max-w-xl bg-zinc-950/90 border border-zinc-800 rounded-2xl flex justify-between items-center h-20 backdrop-blur-xl z-[100] px-4 shadow-2xl shadow-black/50">
        {[{ id: AppSection.HOME, icon: Home }, { id: AppSection.MAPA, icon: Map }, { id: AppSection.MENTOR, icon: BrainCircuit }, { id: AppSection.HERRAMIENTAS, icon: Wrench }, { id: AppSection.RACHA, icon: Trophy }].map(item => (
          <button
            key={item.id}
            onClick={() => { setActiveSection(item.id); playClick(); }}
            className={`relative p-3 rounded-xl transition-all duration-300 ${activeSection === item.id ? 'text-[#FFD700] bg-[#FFD700]/10' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <item.icon size={22} className="" />
            {activeSection === item.id && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FFD700] rounded-full shadow-[0_0_8px_#FFD700]"></span>
            )}
          </button>
        ))}
      </nav>

      {showLevelUp && <LevelUpOverlay level={Math.floor(userStats.xp / 1000) + 1} onClose={() => setShowLevelUp(false)} />}
    </div>
  );
};

export default App;
