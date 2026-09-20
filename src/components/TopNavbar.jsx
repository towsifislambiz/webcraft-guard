import React, { useState } from 'react';
import {
  Activity,
  Bell,
  User,
  ChevronDown,
  LogOut,
  Settings,
  Plus,
  Zap,
  Menu,
  ShieldCheck
} from 'lucide-react';
import { setAuthSession } from '../services/storageService';

export default function TopNavbar({
  onLogout,
  onOpenAdd,
  onOpenSettings,
  onOpenSimulator,
  onToggleMobileMenu
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, text: 'StyleBD Fashion House এক্সেস স্থগিত করা হয়েছে', time: '২ মিনিট আগে', type: 'alert' },
    { id: 2, text: 'Gift Vibes থেকে ৳২,০০০ পেমেন্ট গৃহীত হয়েছে', time: '১২ মিনিট আগে', type: 'success' },
    { id: 3, text: 'TechHub Portfolio সফলভাবে যুক্ত করা হয়েছে', time: '১ ঘণ্টা আগে', type: 'info' },
  ];

  return (
    <header className="h-16 sm:h-20 bg-[#080E1E]/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 font-sans">
      
      {/* Left: Mobile Hamburger Toggle + System Status Pill */}
      <div className="flex items-center gap-3">
        {/* Hamburger Menu Button (Mobile & Tablet) */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white transition-all active:scale-95"
          title="মেনু খুলুন"
        >
          <Menu className="w-5 h-5 text-cyan-400" />
        </button>

        {/* System Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold shadow-sm shadow-emerald-950">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="hidden xs:inline sm:inline">সব সিস্টেম সচল</span>
          <span className="xs:hidden sm:hidden">সচল</span>
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse hidden sm:inline" />
        </div>

        {/* Live Simulator Quick Trigger (Tablet & Desktop) */}
        <button
          onClick={onOpenSimulator}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition-all"
        >
          <Zap className="w-3 h-3 text-indigo-400" />
          <span>সিমুলেটর টেস্ট</span>
        </button>
      </div>

      {/* Right: Add New Button + Notification Bell + Profile Avatar */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        
        {/* Fast Add Website Button */}
        <button
          onClick={onOpenAdd}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-cyan-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">নতুন ওয়েবসাইট যোগ করুন</span>
          <span className="sm:hidden">যুক্ত করুন</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0F172E] hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-[#080E1E]">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0C1222] border border-slate-700/80 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-black text-white">নোটিফিকেশন</span>
                <span className="text-[10px] text-cyan-400 font-bold">৩টি নতুন</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                    <p className="text-slate-200 font-medium">{n.text}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5 sm:pr-3 rounded-2xl bg-[#0F172E] hover:bg-slate-800 border border-slate-700/80 transition-colors"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-sm">
              <div className="w-full h-full bg-[#070D1E] rounded-[10px] flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-cyan-300" />
              </div>
            </div>
            
            <div className="text-left hidden md:block">
              <div className="text-xs font-black text-white leading-tight">Towsif Islam</div>
              <div className="text-[10px] text-slate-400 font-medium">Agency Owner</div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#0C1222] border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in duration-200">
              <div className="px-3 py-2 border-b border-slate-800 mb-1">
                <div className="text-xs font-black text-white">Towsif Islam</div>
                <div className="text-[10px] text-cyan-400 font-mono">webcraftbd.official@gmail.com</div>
              </div>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  onOpenSettings();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>এজেন্সি সেটিংস</span>
              </button>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  setAuthSession(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>লগআউট (Lock Console)</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
