import React from 'react';
import {
  ShieldCheck,
  Activity,
  Zap,
  Lock,
  Unlock,
  AlertTriangle,
  Clock,
  Radio,
  CheckCircle2,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function SecurityWidgets({ projects = [] }) {
  const activeCount = projects.filter((p) => p.status === 'ACTIVE').length;
  const lockedCount = projects.filter((p) => p.status === 'LOCKED').length;
  const totalCount = projects.length;
  const healthPercent = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 98;

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* WIDGET 1: সুরক্ষা মনিটর (Security Monitor Circular Gauge) */}
      <div className="rounded-3xl bg-[#091024]/90 border border-slate-800/90 p-5 sm:p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-wide">সুরক্ষা মনিটর</h3>
              <p className="text-[10px] text-slate-400 font-medium">ক্লাউড ডিফেন্স স্ট্যাটাস</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>সচল</span>
          </div>
        </div>

        {/* Circular Progress Section */}
        <div className="flex items-center justify-center py-3">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Background SVG Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke="#0E172F"
                strokeWidth="10"
              />
              {/* Glowing Gradient Circle */}
              <defs>
                <linearGradient id="cyberGauge" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00F0FF" />
                  <stop offset="60%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke="url(#cyberGauge)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="301.6"
                strokeDashoffset={301.6 - (301.6 * (healthPercent * 0.98)) / 100}
                className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
              />
            </svg>
            
            {/* Center Stat */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white tracking-tight">
                ৯৮.৪%
              </span>
              <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase mt-0.5">
                নিরাপত্তা স্কোর
              </span>
              <span className="text-[9px] text-slate-400 mt-1">সব সিস্টেম স্বাভাবিক</span>
            </div>
          </div>
        </div>

        {/* Sub Metrics List */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              DDoS আক্রমণ ঠেকানো
            </span>
            <span className="text-white font-bold text-[11px] font-mono">১২টি</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              ম্যালওয়্যার স্ক্যান
            </span>
            <span className="text-emerald-400 font-bold text-[11px]">১০০% ক্লিন</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              সন্দেহজনক ট্র্যাফিক
            </span>
            <span className="text-slate-300 font-bold text-[11px] font-mono">০%</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              ক্লাউড ফায়ারওয়াল
            </span>
            <span className="text-cyan-400 font-bold text-[11px]">সক্রিয়</span>
          </div>
        </div>
      </div>


      {/* WIDGET 2: রিয়েল-টাইম ট্রাফিক (Real-time Traffic Graph) */}
      <div className="rounded-3xl bg-[#091024]/90 border border-slate-800/90 p-5 sm:p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-wide">রিয়েল-টাইম ট্রাফিক</h3>
              <p className="text-[10px] text-slate-400 font-medium">বিগত ২৪ ঘণ্টার ক্লাউড নেটওয়ার্ক</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            লাইভ
          </span>
        </div>

        {/* SVG Dual-Line Wave Chart */}
        <div className="relative h-28 w-full my-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="trafficGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            
            {/* Grid Lines */}
            <line x1="0" y1="20" x2="300" y2="20" stroke="#132042" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="0" y1="50" x2="300" y2="50" stroke="#132042" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="0" y1="80" x2="300" y2="80" stroke="#132042" strokeDasharray="3 3" strokeWidth="1" />

            {/* Cyan Area Fill */}
            <path
              d="M 0,75 Q 30,55 60,65 T 120,40 T 180,50 T 240,25 T 300,35 L 300,100 L 0,100 Z"
              fill="url(#trafficGradient)"
            />

            {/* Cyan Main Wave Line */}
            <path
              d="M 0,75 Q 30,55 60,65 T 120,40 T 180,50 T 240,25 T 300,35"
              fill="none"
              stroke="#00F0FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="drop-shadow-[0_0_6px_rgba(0,240,255,0.7)]"
            />

            {/* Rose Blocked Wave Line (Flat along bottom) */}
            <path
              d="M 0,95 Q 60,94 120,95 T 200,94 T 300,95"
              fill="none"
              stroke="#F43F5E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 4"
              className="opacity-70"
            />

            {/* Live Point on Cyan Wave */}
            <circle cx="240" cy="25" r="4" fill="#00F0FF" className="animate-ping" />
            <circle cx="240" cy="25" r="3" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#00F0FF]" />
            <span className="text-slate-300">সাধারণ ট্র্যাফিক:</span>
            <span className="font-mono font-bold text-cyan-400">১২.৪k</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 rounded-full bg-rose-500" />
            <span className="text-slate-400">ব্লক করা ট্র্যাফিক:</span>
            <span className="font-mono font-bold text-rose-400">০</span>
          </div>
        </div>
      </div>


      {/* WIDGET 3: সাম্প্রতিক কার্যক্রম (Recent Security Activity Feed) */}
      <div className="rounded-3xl bg-[#091024]/90 border border-slate-800/90 p-5 sm:p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-wide">সাম্প্রতিক কার্যক্রম</h3>
              <p className="text-[10px] text-slate-400 font-medium">নিরাপত্তা ও কিল-সুইচ লগ</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-400">রিয়েল-টাইম</span>
        </div>

        {/* Activity Timeline List */}
        <div className="space-y-3.5 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800/70">
          
          {/* Event 1: Locked Site */}
          <div className="flex items-start gap-3 relative">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 z-10">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white truncate">StyleBD Fashion House</h4>
                <span className="text-[10px] text-slate-400">২ মিনিট আগে</span>
              </div>
              <p className="text-[11px] text-rose-300/90 mt-0.5">
                বকেয়া বিলের কারণে রিমোট এক্সেস স্থগিত করা হয়েছে
              </p>
            </div>
          </div>

          {/* Event 2: Payment / Active */}
          <div className="flex items-start gap-3 relative">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 z-10">
              <Unlock className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white truncate">Gift Vibes E-commerce</h4>
                <span className="text-[10px] text-slate-400">১২ মিনিট আগে</span>
              </div>
              <p className="text-[11px] text-emerald-300/90 mt-0.5">
                লাইসেন্স সক্রিয় এবং কিল-সুইচ গার্ড রানিং
              </p>
            </div>
          </div>

          {/* Event 3: New Project Added */}
          <div className="flex items-start gap-3 relative">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 z-10">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white truncate">TechHub Portfolio</h4>
                <span className="text-[10px] text-slate-400">১ ঘণ্টা আগে</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                নতুন ওয়েবসাইটে গার্ড প্রোটেকশন ইন্টিগ্রেট সম্পন্ন
              </p>
            </div>
          </div>

          {/* Event 4: Global Scan */}
          <div className="flex items-start gap-3 relative">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 z-10">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white truncate">গ্লোবাল ফায়ারওয়াল স্ক্যান</h4>
                <span className="text-[10px] text-slate-400">২ ঘণ্টা আগে</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                সব ক্লায়েন্ট ডোমেইনে SSL ও ক্লাউড সিকিউরিটি ভেরিফায়েড
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
