import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  Key,
  AlertCircle,
  CheckCircle2,
  Send,
  Clock,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import {
  verifyAdminCredentials,
  rotateCredentialsAndNotify,
  getActiveCredentials,
  subscribeToCredentials
} from '../services/authRotationService';
import { getTelegramConfig } from '../services/telegramService';

export default function LoginPage({ onLoginSuccess, logoutReason = null }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);

  const [activeCreds, setActiveCreds] = useState(null);
  const [remainingTimeStr, setRemainingTimeStr] = useState('');

  // 1. Fetch credentials and set up live subscriber & 1-hour rotation check
  useEffect(() => {
    const initAuth = async () => {
      // Rotate if 1 hour expired
      const res = await rotateCredentialsAndNotify(false);
      setActiveCreds(res.credentials);
    };

    initAuth();

    const unsubscribe = subscribeToCredentials((remoteCreds) => {
      if (remoteCreds) setActiveCreds(remoteCreds);
    });

    return () => unsubscribe();
  }, []);

  // 2. Countdown timer for current 1-hour credentials
  useEffect(() => {
    if (!activeCreds || !activeCreds.expiresAt) return;

    const interval = setInterval(async () => {
      const diff = activeCreds.expiresAt - Date.now();
      if (diff <= 0) {
        setRemainingTimeStr('মেয়াদ উত্তীর্ণ (নতুন কি তৈরি হচ্ছে...)');
        // Trigger rotation automatically!
        const res = await rotateCredentialsAndNotify(false);
        setActiveCreds(res.credentials);
      } else {
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        setRemainingTimeStr(`${mins} মি. ${secs < 10 ? '0' : ''}${secs} সে.`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCreds]);

  // 3. Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const result = await verifyAdminCredentials(username, password);
      if (result.success) {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError(result.error || 'ইউজারনেম বা পাসওয়ার্ড সঠিক নয়!');
      }
    } catch (err) {
      setIsLoading(false);
      setError('লগইন ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।');
    }
  };

  // 4. Force rotate & send fresh credentials to Telegram on-demand
  const handleSendToTelegram = async () => {
    setIsSendingTelegram(true);
    setError('');
    setSuccessMsg('');

    try {
      const tgConfig = getTelegramConfig();
      const res = await rotateCredentialsAndNotify(true);
      setActiveCreds(res.credentials);
      setIsSendingTelegram(false);

      if (res && res.credentials) {
        setSuccessMsg('✅ আপনার টেলিগ্রামে নতুন ইউজারনেম ও পাসওয়ার্ড সফলভাবে পাঠানো হয়েছে!');
      }
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setIsSendingTelegram(false);
      setError('টেলিগ্রামে মেসেজ পাঠানো যায়নি। টেলিগ্রাম বট কনফিগারেশন চেক করুন।');
    }
  };

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-black antialiased">
      {/* Cyber Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/20 to-rose-600/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Cyber Grid Texture Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#0A1024]/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 sm:p-9 shadow-2xl shadow-cyan-950/40 relative z-10 my-auto">
        
        {/* Glow Top Accent */}
        <div className="absolute -top-px left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]" />

        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-rose-500 p-0.5 shadow-lg shadow-cyan-500/25">
              <div className="w-full h-full bg-[#070D1E] rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-9 h-9 text-cyan-400 stroke-[2.2]" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0A1024] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-2xl font-black tracking-tight text-white">
              WebCraft <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-rose-400">Guard</span>
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 tracking-wider">
              PRO
            </span>
          </div>
          
          <p className="text-xs text-slate-400 font-medium">
            অ্যাডমিন সিকিউরিটি কনসোল
          </p>
        </div>

        {/* Auto Logout Notice */}
        {logoutReason === 'EXPIRED_1_HOUR' && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0" />
            <span>🔒 আপনার ১ ঘণ্টার সেশন শেষ হয়েছে। টেলিগ্রামের নতুন পাসওয়ার্ড দিয়ে লগইন করুন।</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>ইউজারনেম (Username)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ইউজারনেম লিখুন"
                className="w-full bg-[#070B18] border border-slate-700/80 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 font-medium focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>পাসওয়ার্ড (Password)</span>
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পাসওয়ার্ড লিখুন"
                className="w-full bg-[#070B18] border border-slate-700/80 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 font-medium focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all pr-10"
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
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-rose-500 hover:opacity-95 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span>লগইন করুন</span>
              </>
            )}
          </button>
        </form>

        {/* Telegram On-Demand Passkey Button */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleSendToTelegram}
            disabled={isSendingTelegram}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600/20 via-blue-600/20 to-cyan-600/20 hover:from-sky-600/30 hover:to-cyan-600/30 border border-sky-500/40 text-sky-300 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md disabled:opacity-50"
          >
            {isSendingTelegram ? (
              <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
            ) : (
              <Send className="w-4 h-4 text-sky-400" />
            )}
            <span>🔄 টেলিগ্রামে নতুন পাসওয়ার্ড পাঠান</span>
          </button>
        </div>

      </div>
    </div>
  );
}
