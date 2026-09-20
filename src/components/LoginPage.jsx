import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, Sparkles, Key, AlertCircle, CheckCircle2 } from 'lucide-react';
import { setAuthSession } from '../services/storageService';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('towsif');
  const [password, setPassword] = useState('webcraft2026');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Accepted credential pairs
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const u = username.trim().toLowerCase();
      const p = password.trim();

      const isValidUser = (u === 'admin' || u === 'towsif' || u === 'webcraft');
      const isValidPass = (p === 'admin' || p === 'admin123' || p === '123456' || p === 'webcraft2026' || p === 'towsif123');

      if (isValidUser && isValidPass) {
        setAuthSession(true);
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('ইউজারনেম বা পাসওয়ার্ড সঠিক নয়! অনুগ্রহ করে সঠিক তথ্য দিন।');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-black">
      {/* Cyber Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/20 to-rose-600/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Cyber Grid Texture Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#0A1024]/90 backdrop-blur-2xl border border-cyan-500/25 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-cyan-950/40 relative z-10">
        
        {/* Glow Top Accent */}
        <div className="absolute -top-px left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]" />

        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-rose-500 p-0.5 shadow-lg shadow-cyan-500/25">
              <div className="w-full h-full bg-[#070D1E] rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-9 h-9 text-cyan-400 stroke-[2.2]" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0A1024] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 mb-1.5">
            <h1 className="text-2xl font-black tracking-tight text-white">
              WebCraft <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-rose-400">Guard</span>
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 tracking-wider">
              PRO
            </span>
          </div>
          
          <p className="text-xs text-slate-400 font-medium">
            অ্যাডমিন সিকিউরিটি কনসোল ও মাস্টার-কি কন্ট্রোলার
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>ইউজারনেম (Username)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="যেমন: towsif বা admin"
                className="w-full bg-[#070B18] border border-slate-700/80 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 font-medium focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>পাসওয়ার্ড (Password)</span>
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পাসওয়ার্ড লিখুন"
                className="w-full bg-[#070B18] border border-slate-700/80 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 font-medium focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 transition-colors p-1"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-rose-500 hover:opacity-95 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span>কন্ট্রোল প্যানেলে প্রবেশ করুন</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Hint Footer */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-300 font-mono flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>ইউজার: <strong>towsif</strong> | পাসওয়ার্ড: <strong>webcraft2026</strong></span>
          </div>
          <p className="text-[10px] text-slate-500 mt-3">
            WebCraft BD • Agency License Security System
          </p>
        </div>

      </div>
    </div>
  );
}
