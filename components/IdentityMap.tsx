
import React, { useState, useCallback } from 'react';
import { Target, User, Shield, ArrowRight, CheckSquare, Square, Plus, Trash2, Trophy, Star } from 'lucide-react';
import { UserIdentity, Goal, SubTask } from '../types';

interface IdentityMapProps {
  identity: UserIdentity;
  setIdentity: React.Dispatch<React.SetStateAction<UserIdentity>>;
  goals: Goal[];
  updateGoal: (goal: Goal) => void;
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
}

const IdentityMap: React.FC<IdentityMapProps> = ({ identity, setIdentity, goals, updateGoal, triggerHaptic }) => {
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState('');

  const handleIdentityChange = (field: keyof UserIdentity, value: string) => {
    setIdentity(prev => ({ ...prev, [field]: value }));
  };

  const toggleSubTask = (goal: Goal, index: number) => {
    triggerHaptic('light');
    const newSubTasks = [...goal.sub_tasks];
    newSubTasks[index].is_done = !newSubTasks[index].is_done;

    const completedCount = newSubTasks.filter(t => t.is_done).length;
    const progress = newSubTasks.length > 0 ? Math.round((completedCount / newSubTasks.length) * 100) : 0;

    const updatedGoal = { ...goal, sub_tasks: newSubTasks, progress_percentage: progress };
    updateGoal(updatedGoal);
  };

  const addSubTask = (goal: Goal) => {
    if (!newTaskName.trim()) return;
    triggerHaptic('medium');
    const newSubTasks = [...goal.sub_tasks, { task_name: newTaskName, is_done: false }];
    const progress = Math.round((newSubTasks.filter(t => t.is_done).length / newSubTasks.length) * 100);

    updateGoal({ ...goal, sub_tasks: newSubTasks, progress_percentage: progress });
    setNewTaskName('');
  };

  const deleteSubTask = (goal: Goal, index: number) => {
    triggerHaptic('light');
    const newSubTasks = goal.sub_tasks.filter((_, i) => i !== index);
    const progress = newSubTasks.length > 0
      ? Math.round((newSubTasks.filter(t => t.is_done).length / newSubTasks.length) * 100)
      : 0;

    updateGoal({ ...goal, sub_tasks: newSubTasks, progress_percentage: progress });
  };

  return (
    <div className="p-6 space-y-12 animate-in fade-in slide-in-from-bottom-4 pb-32">
      {/* HEADER TÁCTICO */}
      <div>
        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">CENTRO DE MANDO</h2>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Tu visión es tu mapa. Tu acción es tu brújula.</p>
      </div>

      {/* BLOQUE 1: LA ESTRELLA NORTE */}
      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700] to-transparent opacity-10 rounded-3xl blur-xl group-hover:opacity-30 transition-opacity duration-700"></div>
        <div className="relative bg-zinc-900/80 p-8 rounded-3xl border border-[#FFD700]/10 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.1] group-hover:scale-110 transition-all duration-700">
            <Star className="text-[#FFD700]" size={100} />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2 w-2 rounded-full bg-[#FFD700] animate-pulse"></div>
            <h3 className="font-black text-xs text-[#FFD700] uppercase tracking-[0.2em]">LA ESTRELLA NORTE</h3>
          </div>
          <h4 className="text-[10px] text-zinc-500 font-bold uppercase mb-2">¿POR QUÉ HAGO TODO ESTO?</h4>
          <textarea
            value={identity.north_star}
            onChange={(e) => handleIdentityChange('north_star', e.target.value)}
            className="w-full bg-transparent border-none p-0 text-xl font-black text-white focus:ring-0 placeholder-zinc-800 resize-none h-24 scrollbar-hide"
            placeholder="Escribe tu misión innegociable..."
          />
        </div>
      </section>

      {/* BLOQUE 2: TRANSICIÓN DE IDENTIDAD */}
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-900 hover:border-zinc-800 transition-colors">
            <h5 className="text-[9px] font-black text-zinc-600 uppercase mb-3 tracking-widest">QUIEN SOY HOY</h5>
            <textarea
              value={identity.current_identity}
              onChange={(e) => handleIdentityChange('current_identity', e.target.value)}
              className="w-full bg-transparent border-none p-0 text-xs font-bold text-zinc-500 focus:ring-0 placeholder-zinc-800 resize-none h-16"
              placeholder="Lo que dejo atrás..."
            />
          </div>
          <div className="shrink-0 text-[#FFD700] animate-pulse">
            <ArrowRight size={24} />
          </div>
          <div className="flex-1 bg-zinc-900/50 p-6 rounded-2xl border border-[#FFD700]/20 shadow-[0_0_20px_rgba(255,215,0,0.03)] hover:border-[#FFD700]/40 transition-all">
            <h5 className="text-[9px] font-black text-[#FFD700] uppercase mb-3 tracking-widest">EN QUIEN ME CONVIERTO</h5>
            <textarea
              value={identity.new_identity}
              onChange={(e) => handleIdentityChange('new_identity', e.target.value)}
              className="w-full bg-transparent border-none p-0 text-xs font-black text-white focus:ring-0 placeholder-zinc-800 resize-none h-16"
              placeholder="El nuevo estándar..."
            />
          </div>
        </div>
      </section>

      {/* BLOQUE 3: LAS 3 METAS DE IMPACTO (GOAL TRACKER) */}
      <section className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-black text-sm text-[#FFD700] uppercase tracking-widest">OBJETIVOS DE IMPACTO</h3>
          <span className="text-[9px] font-black text-zinc-700 uppercase">Fuerza Bruta</span>
        </div>

        <div className="space-y-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`bg-zinc-900/50 rounded-3xl border transition-all duration-500 overflow-hidden relative ${activeGoalId === goal.id ? 'border-[#FFD700]/40 p-6 bg-zinc-900/80' : 'border-zinc-800 p-5'}`}
            >
              <div className="flex justify-between items-start mb-5">
                <div className="flex-1 pr-4">
                  <input
                    value={goal.goal_title}
                    onChange={(e) => updateGoal({ ...goal, goal_title: e.target.value })}
                    className="bg-transparent border-none p-0 text-lg font-black text-white focus:ring-0 w-full placeholder-zinc-800"
                    placeholder="Escribe tu meta..."
                  />
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">
                    {goal.progress_percentage}% COMPLETADO • {goal.progress_percentage < 100 ? 'EMPUJA MÁS FUERTE' : 'OBJETIVO ANIQUILADO'}
                  </p>
                </div>
                <button
                  onClick={() => { triggerHaptic('light'); setActiveGoalId(activeGoalId === goal.id ? null : goal.id); }}
                  className={`p-2.5 rounded-full transition-all scale-on-tap ${activeGoalId === goal.id ? 'bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'bg-black text-zinc-600 border border-zinc-800'}`}
                >
                  <Plus size={16} className={`transition-transform duration-300 ${activeGoalId === goal.id ? 'rotate-45' : ''}`} />
                </button>
              </div>

              {/* CHECKLIST ITEMS CON TRANSICIONES */}
              {activeGoalId === goal.id && (
                <div className="space-y-5 animate-in slide-in-from-top-4 duration-500 mb-4">
                  <div className="space-y-3">
                    {goal.sub_tasks.length === 0 && (
                      <p className="text-[10px] text-zinc-700 font-bold uppercase text-center py-4 border border-dashed border-zinc-800 rounded-2xl">
                        Desglosa la meta en acciones mínimas
                      </p>
                    )}
                    {goal.sub_tasks.map((task, idx) => (
                      <div key={idx} className="flex items-center justify-between group/task">
                        <div
                          onClick={() => toggleSubTask(goal, idx)}
                          className="flex items-center gap-3 cursor-pointer group-active:scale-95 transition-transform"
                        >
                          <div className={`transition-colors duration-300 ${task.is_done ? 'text-[#FFD700]' : 'text-zinc-800'}`}>
                            {task.is_done ? <CheckSquare size={20} strokeWidth={2.5} /> : <Square size={20} />}
                          </div>
                          <span className={`text-[11px] font-bold uppercase transition-all duration-300 ${task.is_done ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}>
                            {task.task_name}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteSubTask(goal, idx)}
                          className="text-zinc-800 hover:text-red-500 opacity-0 group-hover/task:opacity-100 transition-opacity p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <input
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSubTask(goal)}
                      placeholder="Nueva acción clave..."
                      className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-[11px] font-bold text-white focus:border-[#FFD700] outline-none transition-colors"
                    />
                    <button
                      onClick={() => addSubTask(goal)}
                      className="bg-zinc-800 text-[#FFD700] px-5 rounded-xl text-[10px] font-black uppercase scale-on-tap transition-all border border-[#FFD700]/20 hover:bg-[#FFD700] hover:text-black"
                    >
                      AÑADIR
                    </button>
                  </div>
                </div>
              )}

              {/* Sleek Minimalist Progress Bar at bottom of card */}
              <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-zinc-950 overflow-hidden">
                <div
                  className={`h-full progress-bar-fill transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,215,0,0.5)] ${goal.progress_percentage === 100 ? 'bg-[#FFD700]' : 'bg-[#FFD700]/80'}`}
                  style={{ width: `${goal.progress_percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER ACTION PREMIUM */}
      <button
        onClick={() => { triggerHaptic('heavy'); alert("DESTINO SELLADO. Tu subconsciente ahora tiene una orden clara."); }}
        className="w-full bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black font-black py-6 rounded-3xl shadow-[0_20px_50px_-10px_rgba(255,215,0,0.3)] scale-on-tap transition-all text-lg uppercase tracking-tight flex items-center justify-center gap-3 group"
      >
        <Trophy size={22} className="group-hover:rotate-12 transition-transform" /> SELLAR MI DESTINO
      </button>
    </div>
  );
};

export default IdentityMap;
