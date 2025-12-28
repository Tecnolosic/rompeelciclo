
import React from 'react';
import { ArrowLeft, Zap, Sparkles, MessageCircleQuestion, Microscope, Target } from 'lucide-react';

interface ReadingViewProps {
  pilarId: number;
  onClose: () => void;
  onComplete: (id: number) => void;
  onDeepDive: (id: number) => void;
}

const CONTENT: Record<number, any> = {
  0: {
    title: "EL DESPERTAR",
    subtitle: "Protocolo de Consciencia Cruda",
    metaphor: "Tu vida actual es una rueda de hámster bañada en oro. Te sientes rápido, te sientes ocupado, pero el paisaje por la ventana es el mismo que hace 365 días.",
    counterIntuitive: "Saber que estás mal es tu mayor trampa. La 'consciencia' sin movimiento es solo una forma más sofisticada de masoquismo. Muchos usan su diagnóstico como una almohada para dormir más tranquilos.",
    science: "El Sistema de Activación Reticular (SAR) de tu cerebro filtra el mundo según tus órdenes. Si no le das una acción nueva, seguirá mostrándote razones para quedarte exactamente donde estás.",
    cta: "Si tu vida fuera una película y la audiencia viera tus últimas 24 horas... ¿estarían vitoreando al héroe o pidiendo que les devuelvan el dinero por la repetición?",
    actionLabel: "ESTOY LISTO PARA ROMPER EL CICLO"
  },
  1: {
    title: "TRAMPA MENTAL",
    subtitle: "Anatomía de la Procrastinación Culta",
    metaphor: "Estás afilando el hacha para un árbol que nunca vas a golpear. El hacha ya tiene filo, pero el bosque te aterra.",
    counterIntuitive: "Estudiar es la forma más cobarde de procrastinar. Tiene el 'dopamina' del progreso pero el impacto real de la nada. Consumir contenido te hace sentir que trabajas, mientras tu cuenta bancaria y tu realidad siguen en cero.",
    science: "El cerebro no distingue entre 'saber' y 'hacer' cuando hay sobreestimulación de información. Creas un bucle de recompensa ficticio que anula tu instinto de supervivencia.",
    cta: "¿Cuántos miles de dólares en 'conocimiento' tienes acumulados en tu cabeza que hoy no están generando ni un solo centavo de retorno real?",
    actionLabel: "DEJAR DE SER UN CONSUMIDOR"
  },
  2: {
    title: "VERDAD DEL MIEDO",
    subtitle: "Gestión de Riesgo Emocional",
    metaphor: "El miedo es una niebla en un sendero de montaña. No puedes ver el camino desde la línea de salida; solo aparece cuando tu pie ya está en el aire.",
    counterIntuitive: "Esperar a 'sentirse listo' es una sentencia de muerte. El coraje no es una causa, es un subproducto. El coraje aparece después de la acción, nunca antes. Si no tienes náuseas, no estás creciendo.",
    science: "La Amígdala detecta la incertidumbre como una amenaza de muerte. La única forma de apagar la alarma biológica es la exposición controlada: la acción masiva.",
    cta: "¿Cuál es el costo exacto en tiempo, dinero y dignidad de todas las cosas que NO hiciste el año pasado porque estabas esperando el 'momento adecuado'?",
    actionLabel: "CONTRATO DE VALENTÍA"
  },
  3: {
    title: "VENDER ES AMAR",
    subtitle: "Arquitectura del Valor Real",
    metaphor: "Tienes la cura para una plaga en el bolsillo, pero te da 'vergüenza' decirle al moribundo que la medicina cuesta dinero. Eso no es modestia, es crueldad.",
    counterIntuitive: "Si no cobras caro, no estás ayudando. Los precios bajos atraen a personas que no harán el trabajo, y tú no tendrás los recursos para entregar excelencia. Tu timidez es puro egoísmo.",
    science: "El 'Sesgo de Costo Hundido' dicta que los humanos solo valoran aquello en lo que invierten. Si tu solución es barata o gratis, el cerebro del cliente la ignorará por completo.",
    cta: "¿Es tu producto realmente tan malo que te da miedo cobrar lo que vale, o simplemente eres demasiado cobarde para hacerte responsable de la transformación de tu cliente?",
    actionLabel: "ASUMIR MI VALOR"
  },
  4: {
    title: "MOTOR DE ACCIÓN",
    subtitle: "Sistemas sobre Emociones",
    metaphor: "Un avión usa el 80% de su combustible solo para despegar. Una vez a 30.000 pies, planea. Tú sigues en la pista de carreteo porque estás esperando a que el clima 'se sienta bien'.",
    counterIntuitive: "La motivación es una mentira para amateurs. Los profesionales operan bajo el IMPULSO. El impulso no requiere tu permiso ni tu buen humor; requiere que el sistema sea más fuerte que tus excusas de hoy.",
    science: "El Efecto Zeigarnik demuestra que comenzar una tarea crea una tensión cognitiva que te obliga a terminarla. La acción genera energía, no al revés.",
    cta: "¿Cuál es la acción más pequeña, ridícula y patética que puedes tomar ahora mismo que haga que sea imposible decir que hoy no hiciste nada?",
    actionLabel: "INICIAR MI NUEVA VIDA"
  },
  5: {
    title: "CÍRCULO DE FUEGO",
    subtitle: "Gestión Táctica del Entorno",
    metaphor: "Tu entorno es el sistema operativo de tu vida. Si intentas correr un software de millonario en un hardware lleno de virus y rodeado de cables pelados, el sistema va a colapsar.",
    counterIntuitive: "Tu fuerza de voluntad no sirve para nada contra tu entorno. La voluntad es una batería que se agota; el entorno es el enchufe. Si te rodeas de víctimas que solo hablan de deudas y dramas, terminarás hablando su idioma.",
    science: "Las Neuronas Espejo te obligan a imitar las micro-expresiones y estados emocionales de quienes tienes cerca. El 'contagio social' no es una teoría, es un proceso biológico inevitable.",
    cta: "Si hoy tuvieras que 'despedir' a dos amigos que están succionando tu ROI emocional para sobrevivir como operador de alto nivel... ¿quiénes serían?",
    actionLabel: "SELLAR MI CÍRCULO"
  },
  6: {
    title: "EL FRACASO ES DATO",
    subtitle: "Ingeniería de la Resiliencia",
    metaphor: "Eres un ingeniero de sonido mezclando una canción. Cuando una frecuencia suena mal, no lloras ni te rindes; ajustas el ecualizador y sigues. El error no es personal, es técnico.",
    counterIntuitive: "El perfeccionismo es el lujo de los que no construyen nada. Esperar a que todo sea impecable es cobardía con traje de gala. El éxito es simplemente la acumulación de datos correctos tras mil experimentos fallidos.",
    science: "El aprendizaje real ocurre cuando la brecha entre la predicción y el resultado es mayor. Tu cerebro genera más mielina (velocidad neural) cuando cometes errores y los corriges activamente.",
    cta: "¿Qué aprendiste de tu último 'error' que te ahorró miles de dólares o años de vida, y por qué sigues castigándote en lugar de dar las gracias por el dato?",
    actionLabel: "DOMINAR EL KAIZEN"
  }
};

const ReadingView: React.FC<ReadingViewProps> = ({ pilarId, onClose, onComplete, onDeepDive }) => {
  const data = CONTENT[pilarId] || CONTENT[0];

  return (
    <div className="fixed inset-0 bg-black z-[150] overflow-y-auto pb-32 animate-in slide-in-from-right duration-500">
      <div className="p-6 max-w-md mx-auto">
        {/* Header Táctico */}
        <div className="flex justify-between items-center mb-10">
          <button onClick={onClose} className="text-zinc-500 hover:text-white flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] transition-colors">
            <ArrowLeft size={16} /> ABORTAR LECTURA
          </button>
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
            <div className="h-1.5 w-1.5 rounded-full bg-[#FFD700] animate-pulse"></div>
            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">NIVEL DE ACCESO: ELITE</span>
          </div>
        </div>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="text-[#FFD700]" size={20} />
            <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.4em]">CAPÍTULO {pilarId + 1}</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase mb-2 leading-none">
            {data.title}
          </h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em]">{data.subtitle}</p>
        </header>

        <div className="space-y-12">
          {/* 1. METÁFORA */}
          <section className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#FFD700]"></div>
            <h4 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3 ml-2">LA REALIDAD VISUAL</h4>
            <p className="text-xl font-black text-zinc-100 leading-tight ml-2">
              "{data.metaphor}"
            </p>
          </section>

          {/* 2. CONTRAINTUITIVO */}
          <section className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:rotate-12 transition-transform duration-700">
              <Sparkles size={100} className="text-[#FFD700]" />
            </div>
            <h4 className="text-[9px] font-black text-[#FFD700] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Target size={14} /> EL GOLPE CONTRAINTUITIVO
            </h4>
            <p className="text-sm text-zinc-300 leading-relaxed font-medium">
              {data.counterIntuitive}
            </p>
          </section>

          {/* 3. CIENCIA */}
          <section className="px-2">
            <h4 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Microscope size={14} /> MICRO-DOSIS DE CIENCIA
            </h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {data.science}
            </p>
          </section>

          {/* 4. CTA */}
          <section className="bg-zinc-950 p-8 rounded-[2.5rem] border-2 border-dashed border-zinc-900">
            <h4 className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-4">VERDAD INCÓMODA</h4>
            <p className="text-lg font-black text-white leading-tight">
              {data.cta}
            </p>
          </section>

          {/* Botones de Acción */}
          <div className="space-y-4 pt-10">
            <button
              onClick={() => { onComplete(pilarId); onClose(); }}
              className="w-full bg-white text-black font-black py-6 rounded-3xl shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] active:scale-95 transition-all text-xl uppercase tracking-tighter"
            >
              {data.actionLabel}
            </button>

            <button
              onClick={() => onDeepDive(pilarId)}
              className="w-full bg-zinc-900 border-2 border-[#FFD700]/30 text-[#FFD700] font-black py-6 rounded-3xl flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em] pulse-gold hover:bg-[#FFD700]/10 transition-all"
            >
              <MessageCircleQuestion size={20} /> DEBATIR CON EL MENTOR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingView;
