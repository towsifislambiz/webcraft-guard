import React from 'react';
import { ShieldCheck, Shield, CheckCircle2, Terminal, Flame, Zap } from 'lucide-react';
import hackerHeroImg from '../assets/cyber_hacker_hero.jpg';

export default function HeroSecurityBanner({ totalWebsites = 4, lockedWebsites = 0 }) {
  const securityBadges = [
    { label: 'DDoS Protection', status: 'Active' },
    { label: 'Firewall', status: 'Active' },
    { label: 'Malware Scan', status: 'Active' },
    { label: 'Real-time Monitor', status: 'Active' },
  ];

  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-[#091226] via-[#0C1530] to-[#0A1024] border border-cyan-500/25 p-6 sm:p-8 overflow-hidden shadow-2xl shadow-cyan-950/40 mb-8 font-sans">
      
      {/* Cyber Neon Ambient Lights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-px left-12 right-12 h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Headlines and Badges */}
        <div className="max-w-xl text-left">
          
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <Shield className="w-4 h-4 text-cyan-400 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black tracking-wide text-cyan-300">
              WebCraft <span className="text-white">Guard</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-3">
            আপনার ওয়েবসাইট এখন <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
              ২৪/৭ সুরক্ষিত
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mb-6 max-w-lg">
            আপনার এজেন্সির সকল ওয়েবসাইটকে রাখুন হ্যাকার, ডিডস এবং অনাকাঙ্ক্ষিত আক্রমণ থেকে সম্পূর্ণ নিরাপদ।
          </p>

          {/* 4 Feature Badges */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {securityBadges.map((badge, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#080E1E]/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-xs shadow-emerald-950/50"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </div>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Center: Cyber Hacker Visual with Neon Glow */}
        <div className="relative w-full max-w-xs lg:max-w-sm flex items-center justify-center">
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 shadow-2xl shadow-cyan-900/40 group">
            <img
              src={hackerHeroImg}
              alt="WebCraft Cyber Guard"
              className="w-full h-48 sm:h-56 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Cyber Scanline Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1024] via-transparent to-transparent opacity-80" />

            {/* Glowing W Badge over image */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1 rounded-xl bg-[#080E1E]/90 border border-cyan-500/40 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[11px] font-black text-cyan-300 font-mono tracking-wider">
                NODE_ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Cyber Terminal Screen */}
        <div className="w-full lg:w-72 bg-[#060A16]/90 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 font-mono text-xs shadow-xl shadow-black/60 relative">
          
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 tracking-wider">
              TERMINAL.SEC
            </span>
          </div>

          <div className="text-emerald-400 font-extrabold text-sm mb-3 tracking-wide flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>SYSTEM SECURED</span>
          </div>

          <ul className="space-y-1.5 text-emerald-300/90 text-xs font-mono">
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">&gt;</span>
              <span>Firewall Active</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">&gt;</span>
              <span>DDoS Protection Active</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">&gt;</span>
              <span>Malware Scan Active</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">&gt;</span>
              <span>All Websites Online</span>
            </li>
          </ul>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Uptime: 99.98%</span>
            <span className="text-cyan-400 font-bold">Latency: 12ms</span>
          </div>

        </div>

      </div>

    </div>
  );
}
