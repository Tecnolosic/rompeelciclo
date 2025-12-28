import React, { useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { ShieldCheck, Lock, Unlock, AlertTriangle, Loader2, CheckCircle, CreditCard, ArrowRight } from 'lucide-react';
import { UserIdentity } from '../types';

interface VerificationGateProps {
  identity: UserIdentity;
  onVerify: () => void;
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
}

const VerificationGate: React.FC<VerificationGateProps> = ({ identity, onVerify, triggerHaptic }) => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const VALID_CODE = "RMC-PRO-X92-ACCESS";

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    triggerHaptic('medium');
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId: 'price_PLACEHOLDER', // TODO: User to replace
          successUrl: window.location.origin + '?session_id={CHECKOUT_SESSION_ID}',
          cancelUrl: window.location.origin,
        }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (e: any) {
      console.error(e);
      setErrorMessage("Error iniciando pago: " + e.message);
      setStatus('error');
      setIsCheckingOut(false);
    }
  };

  const handleVerify = async () => {
    if (!code.trim()) return;

    setStatus('verifying');
    setErrorMessage('');
    triggerHaptic('medium');

    try {
      const { data, error } = await supabase.functions.invoke('validate-license', {
        body: { licenseKey: code.trim() }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // Success
      setStatus('success');
      triggerHaptic('heavy');
      setTimeout(() => {
        onVerify();
      }, 1800);

    } catch (e: any) {
      console.error("Verification failed:", e);
      setStatus('error');
      setErrorMessage(e.message || "Error validando licencia. Intenta nuevamente.");
      triggerHaptic('heavy');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 selection:bg-[#FFD700] selection:text-black">
      <div className="w-full max-w-sm space-y-12 animate-in fade-in zoom-in duration-700">

        {/* ICON SECTION */}
        <div className="flex flex-col items-center gap-6">
          <div className={`h-24 w-24 rounded-full flex items-center justify-center border transition-all duration-700 ${status === 'success'
            ? 'bg-green-500/10 border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.3)]'
            : status === 'error'
              ? 'bg-red-500/10 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)]'
              : 'bg-[#FFD700]/5 border-[#FFD700]/20 shadow-[0_0_30px_rgba(255,215,0,0.05)]'
            }`}>
            {status === 'success' ? (
              <Unlock className="text-green-500 animate-in zoom-in duration-500" size={40} />
            ) : status === 'error' ? (
              <AlertTriangle className="text-red-500 animate-bounce" size={40} />
            ) : (
              <Lock className="text-[#FFD700] opacity-80" size={40} />
            )}
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tighter uppercase text-white mb-2">ACCESO EXCLUSIVO</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Protocolo de Seguridad Nivel 4</p>
          </div>
        </div>

        {/* INPUT SECTION */}
        <div className="space-y-6 overflow-hidden min-h-[140px] flex flex-col justify-center">
          {status === 'success' ? (
            <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-2xl text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
              <p className="text-green-500 font-black text-sm uppercase tracking-wider mb-1">
                Licencia verificada.
              </p>
              <div className="h-[1px] w-12 bg-green-500/30 mx-auto my-2" />
              <p className="text-white font-bold text-xs uppercase opacity-90">
                Bienvenido a la élite, {identity.name?.split(' ')[0]}
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">

              {/* PURCHASE OPTION */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || status === 'verifying'}
                className="w-full bg-[#FFD700] text-black py-4 rounded-2xl font-black uppercase flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,215,0,0.2)] scale-on-tap hover:bg-[#FFC000] transition-all"
              >
                {isCheckingOut ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />}
                ADQUIRIR ACCESO
              </button>

              <div className="relative flex items-center justify-center">
                <div className="h-[1px] bg-zinc-800 w-full absolute"></div>
                <span className="bg-black px-3 text-[10px] text-zinc-500 font-bold uppercase relative z-10">O ingresa tu licencia</span>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">CÓDIGO DE LICENCIA PRO</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="X-XXXX-XXXX-X"
                  className={`w-full bg-zinc-900 border-2 rounded-2xl p-4 text-center font-mono font-bold tracking-widest text-white outline-none transition-all ${status === 'error' ? 'border-red-500' : 'border-zinc-800 focus:border-[#FFD700]'
                    }`}
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-in shake duration-300">
                  <AlertTriangle className="text-red-500 shrink-0" size={16} />
                  <p className="text-[10px] text-red-500 font-bold uppercase leading-tight">{errorMessage}</p>
                </div>
              )}

              <button
                onClick={handleVerify}
                disabled={status === 'verifying' || !code.trim() || isCheckingOut}
                className={`w-full py-4 rounded-2xl font-black uppercase transition-all flex items-center justify-center gap-3 ${status === 'verifying'
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-zinc-900 text-white border border-zinc-800 hover:border-white'
                  }`}
              >
                {status === 'verifying' ? (
                  <>VERIFICANDO... <Loader2 className="animate-spin" size={18} /></>
                ) : (
                  <>VALIDAR CÓDIGO <ArrowRight size={18} /></>
                )}
              </button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="text-center">
          <p className="text-[8px] text-zinc-700 font-black uppercase tracking-[0.2em] max-w-[200px] mx-auto leading-relaxed">
            Esta instancia de Rompe el Ciclo está vinculada a tu identidad digital de alto rendimiento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationGate;
