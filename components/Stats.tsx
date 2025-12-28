
import React, { useState, useRef } from 'react';
import { TrendingUp, Trophy, Play, Pause, Video, Maximize2, ShieldCheck, BarChart3 } from 'lucide-react';
import { Confession, UserStats, ActivityLog } from '../types';

interface StatsProps {
  userStats: UserStats;
  confessions: Confession[];
  activityLogs: ActivityLog[];
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
}

const Stats: React.FC<StatsProps> = ({ userStats, confessions, activityLogs, triggerHaptic }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [viewingVideoId, setViewingVideoId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getWeekData = () => {
    const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    return days.map((day, i) => ({
      day,
      value: Math.random() * 100 // Placeholder for now
    }));
  };

  const StatCard = ({ label, value, subtext, icon: Icon }: any) => (
    <div className="bg-zinc-900/50 p-5 rounded-3xl border border-zinc-800 hover:border-zinc-700 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">{label}</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-black text-white tracking-tighter">{value}</h3>
          </div>
        </div>
        <div className="p-2 bg-black rounded-xl border border-zinc-800 text-[#FFD700] group-hover:scale-110 transition-transform">
          <Icon size={18} />
        </div>
      </div>
      {subtext && <p className="text-[10px] text-zinc-600 font-medium">{subtext}</p>}
    </div>
  );

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">CENTRO DE MANDO</h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">ESTADÍSTICAS DE COMBATE</p>
        </div>
        <div className="px-3 py-1 bg-[#FFD700]/10 rounded-full border border-[#FFD700]/20">
          <span className="text-[#FFD700] text-xs font-black tracking-tighter">XP: {userStats.xp}</span>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Racha Actual"
          value={userStats.current_streak}
          subtext={`Mejor histórica: ${userStats.best_streak}`}
          icon={TrendingUp}
        />
        <StatCard
          label="Nivel"
          value={Math.floor(userStats.xp / 1000) + 1}
          subtext={`${1000 - (userStats.xp % 1000)} XP para sig. nivel`}
          icon={Trophy}
        />
      </div>

      {/* ACTIVITY CHART */}
      <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Actividad Táctica</h3>
          <BarChart3 size={16} className="text-zinc-500" />
        </div>

        <div className="flex items-end justify-between h-32 gap-2">
          {getWeekData().map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <div
                className="w-full bg-[#FFD700] rounded-t-lg opacity-80 hover:opacity-100 transition-opacity relative group"
                style={{ height: `${d.value}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-700">
                  {Math.round(d.value)}%
                </div>
              </div>
              <span className="text-[9px] font-bold text-zinc-600">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
