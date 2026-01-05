
import React, { useState } from 'react';
import { Target, User, Shield, ArrowRight, CheckSquare, Square, Plus, Trash2, Trophy, Star, Lock, Unlock, PenLine, ChevronDown, CheckCircle2 } from 'lucide-react';

import { UserIdentity, Goal } from '../types';

interface IdentityMapProps {
  identity: UserIdentity;
  setIdentity: (identity: UserIdentity) => void;
  goals: Goal[];
  updateGoal: (goal: Goal) => void;
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
  onAddGoal: () => void;
  onDeleteGoal: (id: string) => void;
}

const IdentityMap: React.FC<IdentityMapProps> = ({ identity, setIdentity, goals, updateGoal, triggerHaptic, onAddGoal, onDeleteGoal }) => {
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState('');
  const [isLocked, setIsLocked] = useState(!!identity.north_star);

  // Local state for inputs to prevent DB thrashing on every keystroke
  const [localIdentity, setLocalIdentity] = useState<UserIdentity>(identity);

  // Sync local state when identity prop changes (e.g. initial load)
  React.useEffect(() => {
    setLocalIdentity(identity);
  }, [identity.north_star, identity.current_identity, identity.new_identity]);

  const handleLocalChange = (field: keyof UserIdentity, value: string) => {
    setLocalIdentity(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof UserIdentity) => {
    if (localIdentity[field] !== identity[field]) {
      setIdentity({ ...identity, [field]: localIdentity[field] });
    }
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

  const handleSealDestiny = () => {
    if (isLocked) {
      triggerHaptic('medium');
      setIsLocked(false);
    } else {
      triggerHaptic('heavy');
      setIsLocked(true);
      // Ensure everything is saved when locking
      setIdentity({ ...localIdentity });
    }
  };

  return (
    <div className="p-6 space-y-12 animate-in fade-in slide-in-from-bottom-4 pb-32">
      {/* HEADER TÁCTICO */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">CENTRO DE MANDO</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Tu visión es tu mapa. Tu acción es tu brújula.</p>
        </div>

        {/* EDIT/LOCK TOGGLE */}
        <button
          onClick={handleSealDestiny}
          className={`px-4 py-2 rounded-full border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all scale-on-tap ${isLocked ? 'items-center bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white' : 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]'}`}
        >
          {isLocked ? (
            <><PenLine size={12} /> MODIFICAR</>
          ) : (
            <><Unlock size={12} /> EDICIÓN ACTIVA</>
          )}
        </button>
      </div>

      {/* BLOQUE 1: LA ESTRELLA NORTE */}
      <section className={`relative group transition-all duration-500 ${isLocked ? 'opacity-90' : 'opacity-100'}`}>
        <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700] to-transparent opacity-10 rounded-3xl blur-xl group-hover:opacity-30 transition-opacity duration-700"></div>
        <div className={`relative bg-zinc-900/80 p-8 rounded-3xl border overflow-hidden shadow-2xl transition-colors ${isLocked ? 'border-zinc-800' : 'border-[#FFD700]/30'}`}>
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.1] group-hover:scale-110 transition-all duration-700">
            <Star className="text-[#FFD700]" size={100} />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className={`h-2 w-2 rounded-full animate-pulse ${isLocked ? 'bg-zinc-600' : 'bg-[#FFD700]'}`}></div>
            <h3 className={`font-black text-xs uppercase tracking-[0.2em] ${isLocked ? 'text-zinc-500' : 'text-[#FFD700]'}`}>LA ESTRELLA NORTE</h3>
          </div>
          <h4 className="text-[10px] text-zinc-500 font-bold uppercase mb-2">¿POR QUÉ HAGO TODO ESTO?</h4>
          <textarea
            value={localIdentity.north_star}
            onChange={(e) => handleLocalChange('north_star', e.target.value)}
            onBlur={() => handleBlur('north_star')}
            disabled={isLocked}
            className={`w-full bg-transparent border-none p-0 text-xl font-black focus:ring-0 placeholder-zinc-800 resize-none h-24 scrollbar-hide ${isLocked ? 'text-zinc-300' : 'text-white'}`}
            placeholder="Escribe tu misión innegociable..."
          />
        </div>
      </section>

      {/* BLOQUE 2: TRANSICIÓN DE IDENTIDAD */}
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <div className={`flex-1 bg-zinc-900/50 p-6 rounded-2xl border transition-colors ${isLocked ? 'border-zinc-900' : 'border-zinc-800'}`}>
            <h5 className="text-[9px] font-black text-zinc-600 uppercase mb-3 tracking-widest">QUIEN SOY HOY</h5>
            <textarea
              value={localIdentity.current_identity}
              onChange={(e) => handleLocalChange('current_identity', e.target.value)}
              onBlur={() => handleBlur('current_identity')}
              disabled={isLocked}
              className="w-full bg-transparent border-none p-0 text-xs font-bold text-zinc-500 focus:ring-0 placeholder-zinc-800 resize-none h-16"
              placeholder="Lo que dejo atrás..."
            />
          </div>
          <div className={`shrink-0 animate-pulse ${isLocked ? 'text-zinc-800' : 'text-[#FFD700]'}`}>
            <ArrowRight size={24} />
          </div>
          <div className={`flex-1 bg-zinc-900/50 p-6 rounded-2xl border shadow-[0_0_20px_rgba(255,215,0,0.03)] transition-all ${isLocked ? 'border-[#FFD700]/10' : 'border-[#FFD700]/40'}`}>
            <h5 className={`text-[9px] font-black uppercase mb-3 tracking-widest ${isLocked ? 'text-zinc-500' : 'text-[#FFD700]'}`}>EN QUIEN ME CONVIERTO</h5>
            <textarea
              value={localIdentity.new_identity}
              onChange={(e) => handleLocalChange('new_identity', e.target.value)}
              onBlur={() => handleBlur('new_identity')}
              disabled={isLocked}
              className={`w-full bg-transparent border-none p-0 text-xs font-black focus:ring-0 placeholder-zinc-800 resize-none h-16 ${isLocked ? 'text-zinc-300' : 'text-white'}`}
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
          <div className="space-y-3">
            {goals.map((goal) => {
              const isExpanded = activeGoalId === goal.id;
              // Local state for goal renaming is implicit here by not managing it at component level 
              // but we need to prevent onchange spam.
              // Best approach: uncontrolled input with default value that saves on blur,
              // or a small local component. For simplicity, let's use a controlled input 
              // but we need a local state map for it? Or just make the rename input uncontrolled for now.
              // Actually, simply using defaultValue + onBlur is safer for performance here
              // without complex local state management for list items.

              return (
                <div
                  key={goal.id}
                  className={`bg-zinc-900/50 rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-[#FFD700] bg-zinc-900' : 'border-zinc-800 hover:border-zinc-700'}`}
                >
                  {/* ACCORDION HEADER */}
                  <div
                    onClick={() => { triggerHaptic('light'); setActiveGoalId(isExpanded ? null : goal.id); }}
                    className="p-5 flex justify-between items-center cursor-pointer group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className={`font-black text-lg uppercase tracking-tight transition-colors ${isExpanded ? 'text-[#FFD700]' : 'text-white'}`}>
                          {goal.goal_title}
                        </h3>
                        {goal.progress_percentage === 100 && <CheckCircle2 size={16} className="text-[#FFD700]" />}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex-1 h-1 bg-zinc-800 rounded-full w-24 overflow-hidden">
                          <div className="h-full bg-[#FFD700]" style={{ width: `${goal.progress_percentage}%` }}></div>
                        </div>
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{goal.progress_percentage}% REALIZADO</span>
                      </div>
                    </div>
                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#FFD700]' : 'text-zinc-600 group-hover:text-white'}`}>
                      <ChevronDown size={20} />
                    </div>
                  </div>

                  {/* ACCORDION BODY */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-2 duration-300">
                      <div className="border-t border-zinc-800/50 pt-4 mb-4">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">RENOMBRAR META</label>
                        <input
                          defaultValue={goal.goal_title}
                          onBlur={(e) => {
                            if (e.target.value !== goal.goal_title) {
                              updateGoal({ ...goal, goal_title: e.target.value });
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-bold text-white focus:border-[#FFD700] outline-none transition-colors"
                        />
                      </div>

                      <div className="space-y-3 mb-4">
                        {goal.sub_tasks.length === 0 && (
                          <p className="text-xs text-zinc-600 font-medium italic text-center py-4">No hay tareas definidas aún.</p>
                        )}
                        {goal.sub_tasks.map((task, idx) => (
                          <div key={idx} className="flex items-center justify-between group/task bg-black/20 p-2 rounded-lg hover:bg-black/40 transition-colors">
                            <div
                              onClick={(e) => { e.stopPropagation(); toggleSubTask(goal, idx); }}
                              className="flex items-center gap-3 cursor-pointer flex-1"
                            >
                              <div className={`transition-colors duration-300 ${task.is_done ? 'text-[#FFD700]' : 'text-zinc-700'}`}>
                                {task.is_done ? <CheckSquare size={18} /> : <Square size={18} />}
                              </div>
                              <span className={`text-xs font-bold uppercase ${task.is_done ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}>
                                {task.task_name}
                              </span>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteSubTask(goal, idx); }}
                              className="text-zinc-700 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 mb-6">
                        <input
                          value={newTaskName}
                          onChange={(e) => setNewTaskName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSubTask(goal)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Nueva sub-tarea..."
                          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-bold text-white focus:border-[#FFD700] outline-none"
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); addSubTask(goal); }}
                          className="bg-[#FFD700] text-black px-4 rounded-lg text-[10px] font-black uppercase hover:bg-[#FFD700]/90"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="flex justify-end border-t border-zinc-800 pt-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteGoal(goal.id); }}
                          className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={12} /> ELIMINAR META DE IMPACTO
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* ADD NEW GOAL BUTTON */}
            <button
              onClick={onAddGoal}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-zinc-800 text-zinc-500 font-bold uppercase text-xs tracking-widest hover:border-[#FFD700] hover:text-[#FFD700] transition-all flex items-center justify-center gap-2 group"
            >
              <Plus size={16} className="group-hover:scale-110 transition-transform" /> AÑADIR NUEVA META DE IMPACTO
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER ACTION PREMIUM */}
      {!isLocked && (
        <button
          onClick={handleSealDestiny}
          className="w-full bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black font-black py-6 rounded-3xl shadow-[0_20px_50px_-10px_rgba(255,215,0,0.3)] scale-on-tap transition-all text-lg uppercase tracking-tight flex items-center justify-center gap-3 group animate-in slide-in-from-bottom-2"
        >
          <Lock size={22} className="group-hover:scale-110 transition-transform" /> SELLAR MI DESTINO
        </button>
      )}
    </div>
  );
};

export default IdentityMap;
