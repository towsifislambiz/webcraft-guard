import React, { useState } from 'react';
import { ShieldCheck, Plus, Settings, Sparkles, ExternalLink, Zap } from 'lucide-react';

export default function Header({ onOpenAdd, onOpenSettings, onOpenSimulator, activeCount, lockedCount }) {
  return (
    <header className="border-b border-slate-800/80 bg-[#0C1120]/90 backdrop-blur-xl sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <ShieldCheck className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0C1120] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                WebCraft <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">Guard</span>
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                PRO KILL-SWITCH v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              এজেন্সি রিমোট লাইসেন্স ও ক্লায়েন্ট পাস-কি কন্ট্রোলার
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Live Simulator Button */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 text-xs font-bold transition-all active:scale-95"
          >
            <Zap className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="hidden sm:inline">লাইভ সিমুলেটর টেস্ট</span>
            <span className="sm:hidden">সিমুলেটর</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all active:scale-95"
            title="এজেন্সি সেটিংস"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Add Client Button */}
          <button
            onClick={onOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 hover:from-amber-400 hover:via-rose-400 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>নতুন ক্লায়েন্ট যোগ</span>
          </button>

        </div>

      </div>
    </header>
  );
}
