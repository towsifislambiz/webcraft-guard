import React from 'react';
import { Globe, ShieldCheck, AlertOctagon, DollarSign, BellOff, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

export default function StatCards({ projects = [] }) {
  const totalCount = projects.length;
  const activeCount = projects.filter((p) => p.status === 'ACTIVE').length;
  const lockedCount = projects.filter((p) => p.status === 'LOCKED').length;

  const totalDues = projects.reduce((acc, p) => acc + Number(p.dueAmount || 0), 0);
  const totalEarnings = projects.reduce((acc, p) => {
    const bill = Number(p.totalBill || 0);
    const due = Number(p.dueAmount || 0);
    return acc + Math.max(0, bill - due);
  }, 0);

  const percentSecure = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 font-sans">
      
      {/* 1. মোট ওয়েবসাইট (Purple Glow) */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#12102B] via-[#0E0F24] to-[#0A0D1E] border border-purple-500/30 p-5 shadow-xl shadow-purple-950/20 overflow-hidden group hover:border-purple-500/50 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center">
            <Globe className="w-5 h-5 text-purple-400" />
          </div>
          
          {/* Purple Sparkline SVG */}
          <svg className="w-16 h-8 text-purple-400/80" viewBox="0 0 64 32" fill="none">
            <path d="M2 28L14 20L28 24L42 10L52 14L62 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div>
          <span className="text-xs font-bold text-slate-400 block mb-1">মোট ওয়েবসাইট</span>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {totalCount}
          </div>
          <span className="text-[11px] font-semibold text-purple-400/90 mt-1 block">
            সবগুলো / মোট
          </span>
        </div>
      </div>

      {/* 2. সুরক্ষিত ওয়েবসাইট (Emerald/Cyan Glow) */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#0B1E22] via-[#09171C] to-[#061018] border border-emerald-500/30 p-5 shadow-xl shadow-emerald-950/20 overflow-hidden group hover:border-emerald-500/50 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          
          <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        <div>
          <span className="text-xs font-bold text-slate-400 block mb-1">সুরক্ষিত ওয়েবসাইট</span>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {activeCount}
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 mt-1 block">
            {percentSecure}% সুরক্ষিত
          </span>
        </div>
      </div>

      {/* 3. এক্সেস বন্ধ (Crimson/Rose Glow) */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#240C16] via-[#1A0912] to-[#0E060C] border border-rose-500/30 p-5 shadow-xl shadow-rose-950/20 overflow-hidden group hover:border-rose-500/50 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
          </div>
          
          {/* Red Sparkline */}
          <svg className="w-16 h-8 text-rose-400/80" viewBox="0 0 64 32" fill="none">
            <path d="M2 18L16 26L30 14L44 20L58 8L62 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div>
          <span className="text-xs font-bold text-slate-400 block mb-1">এক্সেস বন্ধ</span>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {lockedCount}
          </div>
          <span className="text-[11px] font-semibold text-rose-400 mt-1 block">
            {lockedCount === 0 ? 'কোনো সাইট বন্ধ নেই' : `${lockedCount}টি সাইট বন্ধ রয়েছে`}
          </span>
        </div>
      </div>

      {/* 4. মোট আয় (Teal/Blue Glow) */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#0B1A28] via-[#091522] to-[#060D17] border border-cyan-500/30 p-5 shadow-xl shadow-cyan-950/20 overflow-hidden group hover:border-cyan-500/50 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
            <span className="text-cyan-400 font-bold text-base">৳</span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>

        <div>
          <span className="text-xs font-bold text-slate-400 block mb-1">বকেয়া বিল (Pending)</span>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono tracking-tight">
            ৳{totalDues.toLocaleString()}
          </div>
          <span className="text-[11px] font-semibold text-rose-400 mt-1 block">
            {totalDues > 0 ? 'পেমেন্ট এখনো বাকি' : 'সকল বিল পরিশোধিত'}
          </span>
        </div>
      </div>

    </div>
  );
}
