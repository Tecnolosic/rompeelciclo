import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Mic, StopCircle, Terminal, Sparkles, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/genai";
import { Confession, Goal, UserIdentity, UserStats } from '../types';
import { getCoachResponseStream } from '../geminiService';
import ReactMarkdown from 'react-markdown';

import { useSoundFX } from '../src/hooks/useSoundFX';

interface MentorNodeProps {
  identity: UserIdentity;
  confessions: Confession[];
  goals: Goal[];
  userStats: UserStats;
  triggerHaptic: () => void;
  initialTrigger?: string | null;
  onTriggerHandled?: () => void;
}

const MentorNode: React.FC<MentorNodeProps> = ({ identity, confessions, goals, userStats, triggerHaptic, initialTrigger, onTriggerHandled }) => {
  const { playClick, playType, playSuccess } = useSoundFX();
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
    { role: 'assistant', text: "Conexión establecida. Sistema Cortex V2 listo. Esperando instrucciones tácticas..." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (initialTrigger) {
      handleSend(initialTrigger);
      if (onTriggerHandled) onTriggerHandled();
    }
  }, [initialTrigger]);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        triggerHaptic();
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        triggerHaptic();
      };

      recognition.start();
    } else {
      alert('Tu navegador no soporta reconocimiento de voz.');
    }
  };

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || input;
    if (!text.trim()) return;

    if (!textOverride) setInput('');
    triggerHaptic();

    // Add user message immediately
    const userMsg = { role: 'user' as const, text };
    setMessages(prev => [...prev, userMsg]);

    setLoading(true);

    try {
      // Prepare placeholder for streaming response
      setMessages(prev => [...prev, { role: 'assistant', text: '' }]);

      let fullResponse = "";

      await getCoachResponseStream(
        text,
        messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
        identity,
        confessions,
        goals,
        userStats,
        (chunk) => {
          fullResponse += chunk;
          setMessages(prev => {
            const newMsgs = [...prev];
            // Update the last message
            if (newMsgs.length > 0) {
              const lastMsg = newMsgs[newMsgs.length - 1];
              if (lastMsg.role === 'assistant') {
                newMsgs[newMsgs.length - 1] = { ...lastMsg, text: fullResponse };
              }
            }
            return newMsgs;
          });
        }
      );

    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "ERROR CRÍTICO EN NODO NEURONAL. REINTENTAR." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-md mx-auto relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-zinc-900 border-zinc-700' : 'bg-[#FFD700]/10 border-[#FFD700]/30'}`}>
              {msg.role === 'user' ? <User size={14} className="text-zinc-400" /> : <Terminal size={14} className="text-[#FFD700]" />}
            </div>

            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed border backdrop-blur-sm ${msg.role === 'user'
              ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
              : 'bg-black/40 border-[#FFD700]/10 text-zinc-100 shadow-[0_0_15px_rgba(255,215,0,0.05)]'
              }`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-invert prose-p:text-sm prose-strong:text-[#FFD700] prose-headings:text-[#FFD700] prose-code:text-[#FFD700] prose-code:bg-[#FFD700]/10 prose-code:px-1 prose-code:rounded">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                  {loading && idx === messages.length - 1 && (
                    <span className="inline-block w-2 h-4 bg-[#FFD700] ml-1 animate-pulse align-middle"></span>
                  )}
                </div>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-black/80 backdrop-blur-xl border-t border-zinc-800 sticky bottom-0">
        <div className="relative flex items-center gap-3 bg-zinc-900/50 p-2 pr-3 rounded-2xl border border-zinc-800 focus-within:border-[#FFD700] focus-within:shadow-[0_0_20px_rgba(255,215,0,0.1)] transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ingresa comando o consulta..."
            className="flex-1 bg-transparent text-white placeholder-zinc-600 focus:outline-none px-3 font-mono text-sm py-2"
          />

          <div className="h-6 w-[1px] bg-zinc-800"></div>

          <button
            onClick={isListening ? () => { } : () => { playClick(); startListening(); }}
            className={`p-2 rounded-xl transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'hover:bg-zinc-800 text-zinc-500 hover:text-[#FFD700]'}`}
          >
            {isListening ? <StopCircle size={18} /> : <Mic size={18} />}
          </button>

          <button
            onClick={() => { playClick(); handleSend(); }}
            disabled={!input.trim() && !loading}
            className="p-2 bg-[#FFD700] text-black rounded-xl hover:bg-[#FFC000] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-2 flex justify-center items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
          <p className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">Cortex V2 Online</p>
        </div>
      </div>
    </div>
  );
};

export default MentorNode;
