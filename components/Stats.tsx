import React, { useMemo } from 'react';
import { TrendingUp, Trophy, Zap, Activity, Quote, Flame } from 'lucide-react';
import { Confession, UserStats, DailySpark } from '../types';

interface StatsProps {
  userStats: UserStats;
  confessions: Confession[];
  dailySparks: DailySpark[];
  interactions: any[]; // Raw interaction logs from DB
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
  activityLogs: any[]; // Kept for compatibility if needed
}

const Stats: React.FC<StatsProps> = ({ userStats, dailySparks, interactions = [], triggerHaptic }) => {

  // Calculate specific "Traction" metrics from real data
  const tractionData = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const shortDays = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

    // Group by day of week
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        fullDate: d.toISOString().split('T')[0],
        dayName: shortDays[d.getDay()],
        count: 0
      };
    });

    let todayCount = 0;

    interactions.forEach(log => {
      const date = log.created_at.split('T')[0];
      const dayEntry = last7Days.find(d => d.fullDate === date);
      if (dayEntry) dayEntry.count++;
      if (date === today) todayCount++;
    });

    // Find max for scaling
    const maxCount = Math.max(...last7Days.map(d => d.count), 1); // Avoid div by 0

    return { chartData: last7Days, todayCount, maxCount };
  }, [interactions]);

  const dailyFuel = dailySparks.length > 0 ? dailySparks[0] : { quote: "La disciplina es el puente entre metas y logros.", author: "Jim Rohn" };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 pb-32">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div onClick={() => triggerHaptic('light')}>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">MOTOR DE TRACCIÓN</h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">MÉTRICAS DE RENDIMIENTO REAL</p>
        </div>
        <div className="px-3 py-1 bg-[#FFD700]/10 rounded-full border border-[#FFD700]/20 flex items-center gap-2">
          <Zap size={12} className="text-[#FFD700] fill-[#FFD700]" />
          <span className="text-[#FFD700] text-xs font-black tracking-tighter">{userStats.xp} XP</span>
        </div>
      </div>

      {/* DAILY FUEL (Cita del día) */}
      <section className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800 relative overflow-hidden group hover:border-[#FFD700]/30 transition-all">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Quote size={40} className="text-white transform rotate-12" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={14} className="text-orange-500 fill-orange-500 animate-pulse" />
            <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">COMBUSTIBLE DIARIO</p>
          </div>
          <p className="text-lg font-medium text-white italic leading-relaxed">"{dailyFuel.quote}"</p>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider text-right">— {dailyFuel.author || 'Anónimo'}</p>
        </div>
      </section>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/50 p-5 rounded-3xl border border-zinc-800 hover:border-zinc-700 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">EMPUJE DE HOY</p>
              <h3 className="text-4xl font-black text-white tracking-tighter">{tractionData.todayCount}</h3>
            </div>
            <div className="p-2 bg-black rounded-xl border border-zinc-800 text-green-500 group-hover:scale-110 transition-transform">
              <Activity size={18} />
            </div>
          </div>
          <p className="text-[10px] text-zinc-600 font-medium">Interacciones totales</p>
        </div>

        <div className="bg-zinc-900/50 p-5 rounded-3xl border border-zinc-800 hover:border-zinc-700 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">DÍAS EN RACHA</p>
              <h3 className="text-4xl font-black text-white tracking-tighter">{userStats.current_streak}</h3>
            </div>
            <div className="p-2 bg-black rounded-xl border border-zinc-800 text-[#FFD700] group-hover:scale-110 transition-transform">
              <Trophy size={18} />
            </div>
          </div>
          <p className="text-[10px] text-zinc-600 font-medium">Mejor: {userStats.best_streak} días</p>
        </div>
      </div>

      {/* TRACTION CHART */}
      <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800 relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} className="text-[#FFD700]" />
            MOMENTUM SEMANAL
          </h3>
        </div>

        <div className="flex items-end justify-between h-40 gap-3">
          {tractionData.chartData.map((d, i) => {
            const heightPercent = (d.count / tractionData.maxCount) * 100;
            const isToday = i === 6; // Last item is today

            return (
              <div key={i} className="flex flex-col items-center gap-3 flex-1 h-full justify-end group cursor-pointer" onClick={() => triggerHaptic('light')}>
                <div className="relative w-full flex flex-col justify-end h-full">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-1000 ease-out relative ${isToday ? 'bg-[#FFD700]' : 'bg-zinc-800 group-hover:bg-zinc-700'}`}
                    style={{ height: `${Math.max(heightPercent, 5)}%` }} // Min height 5% so it shows
                  >
                    {/* TOOLTIP */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black border border-zinc-700 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
                      {d.count} acciones
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold ${isToday ? 'text-white' : 'text-zinc-600'}`}>{d.dayName}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* GAMIFICATION LEVEL */}
      <div className="bg-gradient-to-r from-zinc-900 to-black p-1 rounded-[2rem] border border-zinc-800">
        <div className="bg-black/50 p-6 rounded-[1.8rem] flex items-center gap-4">
          <div className="h-16 w-16 rounded-full border-4 border-[#FFD700] flex items-center justify-center bg-zinc-900 relative">
            <span className="text-2xl font-black text-white">{Math.floor(userStats.xp / 1000) + 1}</span>
            <div className="absolute -bottom-2 bg-[#FFD700] text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase">NIVEL</div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
              <span>Progreso al siguiente nivel</span>
              <span>{userStats.xp % 1000} / 1000 XP</span>
            </div>
            <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div className="h-full bg-[#FFD700] shadow-[0_0_10px_#FFD700]" style={{ width: `${(userStats.xp % 1000) / 10}%` }}></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Stats;
