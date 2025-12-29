import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Loader2, MessageSquareWarning, Mic, StopCircle, Video, FileText, MessageSquareQuote, CheckCircle2, Camera, Trash2, ShieldCheck, Info, Check, Ghost, Trophy, Search, Rocket, BookOpen } from 'lucide-react';
import { generateSalesScripts } from '../geminiService';
import { Confession } from '../types';
import BreathingCircle from './BreathingCircle';

import { useSoundFX } from '../src/hooks/useSoundFX';

interface ToolboxProps {
  onAddConfession: (confession: Omit<Confession, 'id' | 'timestamp' | 'date'>) => void;
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
  onTriggerMentor?: (cmd: string) => void;
}

const Toolbox: React.FC<ToolboxProps> = ({ onAddConfession, triggerHaptic, onTriggerMentor }) => {
  const { playClick, playType, playSuccess, playError } = useSoundFX();
  const [product, setProduct] = useState('');
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [scripts, setScripts] = useState<string | null>(null);

  // Helper para compatibilidad de navegador (Safari/iOS vs Chrome)
  const getSupportedMimeType = (type: 'video' | 'audio') => {
    const types = type === 'video'
      ? ['video/webm;codecs=vp9,opus', 'video/webm', 'video/mp4', 'video/mp4;codecs=h264,aac']
      : ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/aac'];

    return types.find(t => MediaRecorder.isTypeSupported(t)) || '';
  };

  const [confessionText, setConfessionText] = useState('');
  const [reflectionNote, setReflectionNote] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [tempVideoUrl, setTempVideoUrl] = useState<string | null>(null);
  const [videoBase64, setVideoBase64] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);

  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleGenerateScripts = async () => {
    if (!product || !target) return;
    triggerHaptic('medium');
    setLoading(true);
    try {
      const res = await generateSalesScripts(product, target);
      setScripts(res);
      triggerHaptic('light');
    } catch (e) {
      setScripts('Error al conectar con la inteligencia.');
    } finally {
      setLoading(false);
    }
  };

  const handleTextConfession = () => {
    if (!confessionText.trim()) return;
    triggerHaptic('medium');
    const today = new Date().toISOString().split('T')[0];
    onAddConfession({
      content: confessionText,
      type: 'text',
      pilarId: 1,
      sessionName: `RMC_Session_${today}_TEXTO`,
      note: confessionText.slice(0, 50) + '...'
    });
    setConfessionText('');
  };

  const startVoiceRecording = async () => {
    triggerHaptic('medium');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mimeType = getSupportedMimeType('audio');
      // @ts-ignore - Options type mismatch in some TS versions
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setVideoBase64(reader.result as string);
          setTempVideoUrl('voice_ready');
        };
      };
      recorder.start();
      audioRecorderRef.current = recorder;
      setIsRecordingVoice(true);
    } catch (err) { alert("Micrófono denegado."); }
  };

  const stopVoiceRecording = () => {
    triggerHaptic('medium');
    audioRecorderRef.current?.stop();
    setIsRecordingVoice(false);
  };

  const startVideoRecording = async () => {
    triggerHaptic('medium');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      const mimeType = getSupportedMimeType('video');
      // @ts-ignore
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      videoChunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) videoChunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: mimeType || 'video/webm' });
        setTempVideoUrl(URL.createObjectURL(videoBlob));
        const reader = new FileReader();
        reader.readAsDataURL(videoBlob);
        reader.onloadend = () => setVideoBase64(reader.result as string);
      };
      recorder.start();
      videoRecorderRef.current = recorder;
      setIsRecordingVideo(true);
    } catch (e) { alert("Cámara denegada."); }
  };

  const stopVideoRecording = () => {
    triggerHaptic('medium');
    videoRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
    setIsRecordingVideo(false);
  };

  const saveConfession = (type: 'voice' | 'video') => {
    if (!videoBase64) return;
    triggerHaptic('medium');
    setUploadStatus('uploading');
    setUploadProgress(0);

    const duration = 1500;
    const interval = 20;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setUploadStatus('success');
          triggerHaptic('heavy');

          setTimeout(() => {
            const today = new Date().toISOString().split('T')[0];
            onAddConfession({
              content: videoBase64,
              type: type,
              pilarId: 1,
              sessionName: `RMC_Session_${today}_${type.toUpperCase()}`,
              note: reflectionNote || 'Registro sin notas'
            });
            setUploadStatus('idle');
            setTempVideoUrl(null);
            setVideoBase64(null);
            setReflectionNote('');
          }, 1200);

          return 100;
        }
        return prev + step;
      });
    }, interval);
  };

  const handleTacticalResource = (cmd: string) => {
    triggerHaptic('medium');
    onTriggerMentor?.(cmd);
  };

  return (
    <div className="p-6 space-y-8 pb-32 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-8">
        <div onClick={() => triggerHaptic('light')}>
          <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">ARSENAL TÁCTICO</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Herramientas de intervención inmediata</p>
        </div>
        <div className="bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800 flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#FFD700]" />
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">SECURE STORAGE</span>
        </div>
      </div>

      <div className="grid gap-6">

        {/* ROW 1: BIO-HACKING & MENTALITY (2 COLUMNS) */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* CARD 1: BREATHING */}
          <section className="group relative bg-black p-8 rounded-[2rem] border border-zinc-900 hover:border-[#FFD700]/50 transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-zinc-900/50 rounded-2xl flex items-center justify-center group-hover:bg-[#FFD700]/10 transition-colors">
                <Zap className="text-[#FFD700]" size={24} />
              </div>
              <div>
                <h3 className="font-black text-lg text-white uppercase tracking-tighter">BIO-REGULACIÓN</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Control del Sistema Nervioso</p>
              </div>
            </div>
            <BreathingCircle />
          </section>

          {/* CARD 2: MENTALITY RESOURCES */}
          <section className="group relative bg-black p-6 rounded-[2rem] border border-zinc-900 hover:border-[#FFD700]/50 transition-all duration-500">
            <div className="mb-6">
              <h3 className="font-black text-lg text-white uppercase tracking-tighter truncate">REPROGRAMATE</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Inyecciones de Mentalidad</p>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => { playClick(); handleTacticalResource('[CMD: STORY_FAILURE]'); }} className="bg-zinc-900/30 p-3 rounded-xl border border-zinc-800 flex items-center justify-between hover:border-red-500/50 hover:bg-red-500/5 transition-all scale-on-tap group/btn w-full">
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

        {/* ROW 2: MIRROR (FULL WIDTH) */}
        <section className="group relative bg-black p-8 rounded-[2rem] border border-zinc-900 hover:border-[#FFD700]/50 transition-all duration-500 overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
            <Video className="text-zinc-800 w-32 h-32 -mr-10 -mt-10" />
          </div>

          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="w-12 h-12 bg-zinc-900/50 rounded-2xl flex items-center justify-center group-hover:bg-[#FFD700]/10 transition-colors">
              <Camera className="text-[#FFD700]" size={24} />
            </div>
            <div>
              <h3 className="font-black text-lg text-white uppercase tracking-tighter">EL ESPEJO DE LA VERDAD</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Confrontación Visual Directa</p>
            </div>
          </div>

          <div className="relative z-10">
            {uploadStatus !== 'idle' ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-in zoom-in duration-300">
                <div className="relative h-32 w-32">
                  <svg className="h-full w-full -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                    <circle
                      cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                      strokeDasharray={364}
                      strokeDashoffset={364 - (364 * uploadProgress) / 100}
                      strokeLinecap="round"
                      className={`transition-all duration-75 ease-linear ${uploadStatus === 'success' ? 'text-green-500' : 'text-[#FFD700]'}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {uploadStatus === 'success' ? (
                      <div className="bg-green-500 rounded-full p-3 animate-in zoom-in duration-500">
                        <Check className="text-black" size={40} strokeWidth={4} />
                      </div>
                    ) : (
                      <span className="text-xl font-black text-white tabular-nums">{Math.round(uploadProgress)}%</span>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <p className={`text-xs font-black uppercase tracking-widest ${uploadStatus === 'success' ? 'text-green-500' : 'text-[#FFD700]'}`}>
                    {uploadStatus === 'success' ? 'VINCULACIÓN COMPLETADA' : 'SELLANDO EN DISCO LOCAL'}
                  </p>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">NO CIERRES LA TERMINAL</p>
                </div>
              </div>
            ) : isRecordingVideo ? (
              <div className="space-y-6">
                <div className="relative rounded-3xl overflow-hidden border-2 border-red-500 shadow-2xl bg-black">
                  <video ref={videoRef} autoPlay muted playsInline className="w-full aspect-video object-cover" />
                  <div className="absolute top-6 left-6 bg-black/80 px-4 py-2 rounded-full flex items-center gap-3 backdrop-blur-md">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">GRABANDO</span>
                  </div>
                </div>
                <button onClick={stopVideoRecording} className="w-full bg-red-600 hover:bg-red-500 text-white py-5 rounded-2xl font-black uppercase text-xs shadow-lg scale-on-tap transition-all tracking-widest">
                  DETENER Y CONFRONTAR
                </button>
              </div>
            ) : tempVideoUrl ? (
              <div className="space-y-6 animate-in slide-in-from-bottom-6">
                {tempVideoUrl !== 'voice_ready' && <video src={tempVideoUrl} controls playsInline className="w-full aspect-video object-cover rounded-3xl bg-black border border-zinc-800 shadow-2xl" />}

                <div className="bg-zinc-900/30 p-6 rounded-3xl border border-zinc-800">
                  <p className="text-[10px] text-[#FFD700] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Info size={12} /> REGLA DE REFLEXIÓN
                  </p>
                  <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                    La IA no verá el video. Describe qué sentiste al decirlo en voz alta o qué notaste en tu cara al verte.
                  </p>
                  <textarea value={reflectionNote} onChange={(e) => { setReflectionNote(e.target.value); if (e.target.value.length % 5 === 0) triggerHaptic('light'); }} placeholder="Escribe tu análisis aquí..." className="w-full bg-black/50 border border-zinc-800 rounded-xl p-4 text-xs text-white focus:border-[#FFD700] outline-none h-24 placeholder-zinc-600" />
                </div>

                <div className="flex gap-4">
                  <button onClick={() => saveConfession(tempVideoUrl === 'voice_ready' ? 'voice' : 'video')} className="flex-[2] bg-[#FFD700] text-black py-5 rounded-2xl font-black text-xs uppercase shadow-lg shadow-[#FFD700]/10 scale-on-tap transition-all tracking-widest hover:bg-[#FFC000]">
                    SELLAR REGISTRO
                  </button>
                  <button onClick={() => { setTempVideoUrl(null); setVideoBase64(null); setReflectionNote(''); triggerHaptic('light'); }} className="flex-1 bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 py-5 rounded-2xl font-black text-xs uppercase scale-on-tap transition-all flex items-center justify-center">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button onClick={startVideoRecording} className="bg-zinc-900/20 p-8 rounded-3xl flex flex-col items-center justify-center gap-4 border border-zinc-800 hover:border-[#FFD700] hover:bg-zinc-900/40 transition-all group/cam scale-on-tap h-48">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center group-hover/cam:scale-110 transition-transform border border-zinc-800 group-hover/cam:border-[#FFD700]/50">
                    <Camera size={32} className="text-[#FFD700]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover/cam:text-white">VIDEO LOG</span>
                </button>
                <button onClick={isRecordingVoice ? stopVoiceRecording : startVoiceRecording} className={`p-8 rounded-3xl flex flex-col items-center justify-center gap-4 border transition-all scale-on-tap h-48 ${isRecordingVoice ? 'bg-red-500/10 border-red-500 animate-pulse' : 'bg-zinc-900/20 border-zinc-800 hover:border-[#FFD700] hover:bg-zinc-900/40 group/mic'}`}>
                  {isRecordingVoice ? (
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500">
                      <StopCircle size={32} className="text-red-500" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center group-hover/mic:scale-110 transition-transform border border-zinc-800 group-hover/mic:border-[#FFD700]/50">
                      <Mic size={32} className="text-[#FFD700]" />
                    </div>
                  )}
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isRecordingVoice ? 'text-red-500' : 'text-zinc-400 group-hover/mic:text-white'}`}>{isRecordingVoice ? 'DETENER' : 'AUDIO LOG'}</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ROW 3: CONFESSION & SCRIPTS (2 COLUMNS) */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* CONFESSION */}
          <section className="group relative bg-black p-8 rounded-[2rem] border border-zinc-900 hover:border-[#FFD700]/50 transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-zinc-900/50 rounded-2xl flex items-center justify-center group-hover:bg-[#FFD700]/10 transition-colors">
                <MessageSquareQuote className="text-[#FFD700]" size={24} />
              </div>
              <div>
                <h3 className="font-black text-lg text-white uppercase tracking-tighter">CONFESIÓN</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Verdad Radical</p>
              </div>
            </div>
            <textarea value={confessionText} onChange={(e) => { setConfessionText(e.target.value); if (e.target.value.length % 10 === 0) triggerHaptic('light'); }} placeholder="¿Qué mentira te estás contando hoy?" className="w-full bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 text-xs text-white focus:border-[#FFD700] outline-none h-32 mb-4 placeholder-zinc-600 resize-none" />
            <button onClick={handleTextConfession} className="w-full bg-[#FFD700] text-black font-black text-xs py-4 rounded-2xl uppercase shadow-lg shadow-[#FFD700]/10 scale-on-tap transition-all tracking-widest hover:bg-[#FFC000]">
              GUARDAR VERDAD
            </button>
          </section>

          {/* SCRIPT GENERATOR */}
          <section className="group relative bg-black p-8 rounded-[2rem] border border-zinc-900 hover:border-[#FFD700]/50 transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-zinc-900/50 rounded-2xl flex items-center justify-center group-hover:bg-[#FFD700]/10 transition-colors">
                <FileText className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-black text-lg text-white uppercase tracking-tighter">ESTRATEGIA</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Generador IA</p>
              </div>
            </div>

            <div className="space-y-3">
              <input value={product} onChange={e => { setProduct(e.target.value); triggerHaptic('light'); }} placeholder="¿Qué vendes?" className="w-full bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-white focus:border-[#FFD700] outline-none" />
              <input value={target} onChange={e => { setTarget(e.target.value); triggerHaptic('light'); }} placeholder="¿A quién?" className="w-full bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-white focus:border-[#FFD700] outline-none" />
              <button onClick={handleGenerateScripts} disabled={loading} className="w-full bg-zinc-800 text-white hover:bg-zinc-700 font-black text-xs py-4 rounded-xl scale-on-tap transition-all uppercase tracking-widest border border-zinc-700">
                {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : 'GENERAR SCRIPT'}
              </button>
            </div>

            {scripts && <div className="mt-4 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-[10px] text-zinc-400 whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto scrollbar-hide">{scripts}</div>}
          </section>
        </div>

      </div>
    </div>
  );
};

export default Toolbox;
