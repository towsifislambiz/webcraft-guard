import React, { useState } from 'react';
import {
  Settings,
  ShieldAlert,
  ShieldCheck,
  Save,
  Lock,
  Unlock,
  Building,
  Phone,
  MessageSquare,
  AlertTriangle,
  Eye,
  EyeOff,
  Sparkles,
  Check,
  Send,
  RefreshCw,
  Key,
  Clock,
  ExternalLink,
  Bot,
  Info,
  Radio
} from 'lucide-react';
import { syncProjectToCloud } from '../../services/storageService';
import {
  getTelegramConfig,
  saveTelegramConfig,
  testTelegramConnection
} from '../../services/telegramService';
import {
  rotateCredentialsAndNotify
} from '../../services/authRotationService';

export default function SettingsView({
  settings = {},
  onSaveSettings,
  projects = [],
  onBulkUpdateProjects,
  showToast
}) {
  const [agencyName, setAgencyName] = useState(settings.agencyName || 'WebCraft BD');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '01629559653');
  const [contactNumber, setContactNumber] = useState(settings.contactNumber || '01629559653');
  const [warningTitle, setWarningTitle] = useState(
    settings.defaultWarningTitle || 'ওয়েবসাইট সাময়িকভাবে স্থগিত রাখা হয়েছে'
  );
  const [warningMessage, setWarningMessage] = useState(
    settings.defaultWarningMessage ||
      'সম্মানিত গ্রাহক, এই ওয়েবসাইটটির ডেভেলপমেন্ট বিলিং পেন্ডিং রয়েছে। সেবাটি পুনরায় সচল করতে এজেন্সির সাথে যোগাযোগ করুন।'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Telegram Bot Configuration State
  const initialTgConfig = getTelegramConfig();
  const [botToken, setBotToken] = useState(initialTgConfig.botToken || '');
  const [chatId, setChatId] = useState(initialTgConfig.chatId || '');
  const [showBotToken, setShowBotToken] = useState(false);
  const [isTestingTg, setIsTestingTg] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [tgTestStatus, setTgTestStatus] = useState(null);
  const [tgSaveSuccess, setTgSaveSuccess] = useState(false);

  const isTgConfigured = Boolean(botToken.trim() && chatId.trim());

  // Save Telegram Config
  const handleSaveTelegram = (e) => {
    if (e) e.preventDefault();
    saveTelegramConfig({
      botToken: botToken.trim(),
      chatId: chatId.trim(),
      autoRotateEnabled: true,
      rotationIntervalMinutes: 60,
    });
    setTgSaveSuccess(true);
    setTimeout(() => setTgSaveSuccess(false), 2500);
    if (showToast) showToast('✅ টেলিগ্রাম বট কনফিগারেশন সংরক্ষিত হয়েছে!', 'success');
  };

  // Test Telegram Connection
  const handleTestTelegram = async () => {
    if (!botToken.trim() || !chatId.trim()) {
      if (showToast) showToast('⚠️ অনুগ্রহ করে প্রথমে Bot Token এবং Chat ID লিখুন।', 'error');
      return;
    }
    setIsTestingTg(true);
    setTgTestStatus(null);
    try {
      const res = await testTelegramConnection(botToken.trim(), chatId.trim());
      if (res.success) {
        setTgTestStatus({ success: true, msg: '✅ টেলিগ্রামে টেস্ট মেসেজ সফলভাবে পৌঁছেছে!' });
        if (showToast) showToast('✅ টেলিগ্রামে টেস্ট মেসেজ সফলভাবে পাঠানো হয়েছে!', 'success');
      } else {
        setTgTestStatus({ success: false, msg: `❌ এরর: ${res.error}` });
        if (showToast) showToast(`❌ এরর: ${res.error}`, 'error');
      }
    } catch (err) {
      setTgTestStatus({ success: false, msg: `❌ এরর: ${err.message}` });
    } finally {
      setIsTestingTg(false);
    }
  };

  // Force Immediate Rotation and Dispatch to Telegram
  const handleForceRotate = async () => {
    if (
      !window.confirm(
        'আপনি কি এখনই নতুন ইউজারনেম ও পাসওয়ার্ড জেনারেট করে টেলিগ্রামে পাঠাতে চান? এটি করলে বর্তমান সেশন এবং সকল ডিভাইসের ক্রেডেনশিয়াল আপডেট হয়ে যাবে।'
      )
    ) {
      return;
    }
    setIsRotating(true);
    try {
      const res = await rotateCredentialsAndNotify(true);
      if (res && res.credentials) {
        if (showToast) {
          showToast(
            `🔄 নতুন ইউজার: ${res.credentials.username} ও পাসওয়ার্ড টেলিগ্রামে পাঠানো হয়েছে!`,
            'success'
          );
        }
      }
    } catch (err) {
      if (showToast) showToast(`❌ রোটেশন ব্যর্থ: ${err.message}`, 'error');
    } finally {
      setIsRotating(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      agencyName,
      whatsappNumber,
      contactNumber,
      defaultWarningTitle: warningTitle,
      defaultWarningMessage: warningMessage,
    };
    onSaveSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    if (showToast) showToast('✅ এজেন্সি সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  // Emergency Master Panic Actions
  const handleLockAllDues = () => {
    if (window.confirm('⚠️ সতর্কতা: আপনি কি বকেয়া থাকা সকল ক্লায়েন্ট ওয়েবসাইট এক ক্লিকে লক ও স্থগিত করতে চান?')) {
      const updatedProjects = projects.map((p) => {
        if ((p.dueAmount || 0) > 0) {
          const lockedP = { ...p, status: 'LOCKED', updatedAt: Date.now() };
          syncProjectToCloud(lockedP);
          return lockedP;
        }
        return p;
      });
      if (onBulkUpdateProjects) onBulkUpdateProjects(updatedProjects);
      if (showToast) showToast('🔒 বকেয়া থাকা সকল ওয়েবসাইট সফলভাবে লক করা হয়েছে!', 'error');
    }
  };

  const handleUnlockAll = () => {
    if (window.confirm('আপনি কি সকল ওয়েবসাইট পুনরায় আনলক ও সচল করতে চান?')) {
      const updatedProjects = projects.map((p) => {
        const activeP = { ...p, status: 'ACTIVE', updatedAt: Date.now() };
        syncProjectToCloud(activeP);
        return activeP;
      });
      if (onBulkUpdateProjects) onBulkUpdateProjects(updatedProjects);
      if (showToast) showToast('✅ সকল ওয়েবসাইট সফলভাবে আনলক ও চালু করা হয়েছে!', 'success');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 font-sans">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-[#091024] border border-cyan-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              এজেন্সি সেটিংস ও লাইসেন্স কন্ট্রোল
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              ক্লায়েন্ট লক স্ক্রিনের বার্তা, এজেন্সি ব্র্যান্ডিং ও ইমার্জেন্সি মাস্টার কিল-সুইচ
            </p>
          </div>
        </div>
      </div>

      {/* Telegram Security Bot & 1-Hour Dynamic Rotation Section */}
      <div className="rounded-3xl bg-[#091024] border border-cyan-500/30 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  টেলিগ্রাম সিকিউরিটি বট ও ১-ঘণ্টা অটো ক্রেডেনশিয়াল রোটেশন
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                প্রতি ১ ঘণ্টা পর পর ইউজারনেম ও পাসওয়ার্ড স্বয়ংক্রিয়ভাবে পরিবর্তিত হবে এবং সরাসরি আপনার টেলিগ্রামে লাইভ মেসেজ যাবে।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold border flex items-center gap-1.5 ${
                isTgConfigured
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isTgConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span>{isTgConfigured ? 'টেলিগ্রাম সক্রিয়' : 'কনফিগারেশন প্রয়োজন'}</span>
            </span>
          </div>
        </div>

        {/* Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
          {/* Left 7 cols: Bot Token & Chat ID Inputs */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>টেলিগ্রাম বট টোকেন (Telegram Bot Token)</span>
                </span>
                <span className="text-[10px] text-cyan-400/80 font-mono">@BotFather থেকে প্রাপ্ত</span>
              </label>
              <div className="relative">
                <input
                  type={showBotToken ? 'text' : 'password'}
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder="যেমন: 7123456789:AAFxxx... (BotFather Token)"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl bg-[#060B18] border border-slate-800 focus:border-cyan-500 text-xs text-white outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowBotToken(!showBotToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400"
                >
                  {showBotToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-cyan-400" />
                  <span>টেলিগ্রাম চ্যাট আইডি (Telegram Chat ID)</span>
                </span>
                <span className="text-[10px] text-cyan-400/80 font-mono">@userinfobot থেকে প্রাপ্ত</span>
              </label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="যেমন: 1234567890 (আপনার টেলিগ্রাম আইডি)"
                className="w-full px-4 py-2.5 rounded-xl bg-[#060B18] border border-slate-800 focus:border-cyan-500 text-xs text-white outline-none font-mono"
              />
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-start gap-2.5 text-[11px] text-slate-300 leading-relaxed">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <b>সেটআপ গাইড:</b> ১. টেলিগ্রামে <code className="text-cyan-300">@BotFather</code>-এ গিয়ে <code className="text-cyan-300">/newbot</code> দিয়ে একটি বট তৈরি করে API Token নিন। ২. টেলিগ্রামে আপনার নতুন বটের চ্যাটে গিয়ে একবার <b>/start</b> লিখুন। ৩. এরপর <code className="text-cyan-300">@userinfobot</code>-এ মেসেজ দিয়ে আপনার নিজের <b>Id</b> সংগ্রহ করে এখানে বসিয়ে সেভ করুন।
              </span>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSaveTelegram}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-950/50 active:scale-[0.98]"
            >
              {tgSaveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{tgSaveSuccess ? 'টেলিগ্রাম কনফিগারেশন সংরক্ষিত হয়েছে!' : 'টেলিগ্রাম সেটিংস সংরক্ষণ করুন'}</span>
            </button>
          </div>

          {/* Right 5 cols: Actions & Security Rules */}
          <div className="lg:col-span-5 space-y-3.5 flex flex-col justify-between">
            <div className="p-4 rounded-2xl bg-[#060B18] border border-slate-800/80 space-y-3">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>অটোমেশন ও সিকিউরিটি রুলস:</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><b>১-ঘণ্টা সেশন লিমিট:</b> যেকোনো ব্রাউজারে লগইন করার ঠিক ৬০ মিনিট পর স্বয়ংক্রিয়ভাবে লগআউট হয়ে যাবে।</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><b>অটো ক্রেডেনশিয়াল রোটেশন:</b> প্রতি ১ ঘণ্টা পর পর নতুন ইউজারনেম ও পাসওয়ার্ড স্বয়ংক্রিয়ভাবে তৈরি হবে।</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><b>ইনস্ট্যান্ট টেলিগ্রাম অ্যালার্ট:</b> প্রতি রোটেশনের সাথে সাথে আপনার টেলিগ্রামে মেসেজ পাঠানো হবে।</span>
                </li>
              </ul>
            </div>

            {/* Test Connection Button */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleTestTelegram}
                disabled={isTestingTg}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-cyan-500/30 active:scale-95"
              >
                <Send className={`w-3.5 h-3.5 ${isTestingTg ? 'animate-spin' : ''}`} />
                <span>{isTestingTg ? 'পরীক্ষা করা হচ্ছে...' : 'টেলিগ্রাম টেস্ট মেসেজ পাঠান'}</span>
              </button>

              {tgTestStatus && (
                <div
                  className={`text-[11px] font-bold p-2.5 rounded-xl border text-center ${
                    tgTestStatus.success
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {tgTestStatus.msg}
                </div>
              )}

              {/* Force Rotate Button */}
              <button
                type="button"
                onClick={handleForceRotate}
                disabled={isRotating}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-950/50 active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
                <span>{isRotating ? 'রোটেশন হচ্ছে...' : 'এখনই নতুন পাসওয়ার্ড তৈরি ও টেলিগ্রামে পাঠান'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7">
        
        {/* Left Form: Agency Details & Warning Customizer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="rounded-3xl bg-[#091024] border border-slate-800/90 p-5 sm:p-6 shadow-xl space-y-5">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-cyan-400" />
              <span>এজেন্সি পরিচিতি ও যোগাযোগ</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                এজেন্সির নাম
              </label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#060B18] border border-slate-800 focus:border-cyan-500 text-xs text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>হটলাইন নাম্বার</span>
                </label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#060B18] border border-slate-800 focus:border-cyan-500 text-xs text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>অফিসিয়াল হোয়াটসঅ্যাপ</span>
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#060B18] border border-slate-800 focus:border-cyan-500 text-xs text-white outline-none font-mono"
                />
              </div>
            </div>

            {/* Warning Message Customizer */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>ক্লায়েন্ট লক স্ক্রিন নোটিশ কাস্টমাইজ</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  সাসপেনশন নোটিশ শিরোনাম
                </label>
                <input
                  type="text"
                  value={warningTitle}
                  onChange={(e) => setWarningTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#060B18] border border-slate-800 focus:border-rose-500 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  সাসপেনশন সতর্কবার্তা বিবরণ
                </label>
                <textarea
                  rows={3}
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#060B18] border border-slate-800 focus:border-rose-500 text-xs text-white outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'সংরক্ষিত হয়েছে!' : 'সেটিংস সংরক্ষণ করুন'}</span>
            </button>
          </form>
        </div>

        {/* Right: Live Preview & Master Lockdown (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Preview Box */}
          <div className="rounded-3xl bg-[#091024] border border-slate-800 p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-cyan-400" />
                ক্লায়েন্ট স্ক্রিনে যা দেখা যাবে (Preview):
              </span>
              <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                LOCKED SCREEN
              </span>
            </div>

            {/* Mock Screen */}
            <div className="p-4 rounded-2xl bg-[#080B15] border border-rose-500/30 text-center shadow-inner">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-2.5">
                <Lock className="w-5 h-5" />
              </div>
              <div className="inline-block px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 font-bold text-[10px] mb-2 uppercase tracking-wide">
                ⚠️ সাসপেনশন নোটিশ
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">{warningTitle}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{warningMessage}</p>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>হোয়াটসঅ্যাপে যোগাযোগ করুন</span>
              </div>
            </div>
          </div>

          {/* Emergency Panic Actions */}
          <div className="rounded-3xl bg-[#091024] border border-rose-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">ইমার্জেন্সি মাস্টার কন্ট্রোল</h3>
                <p className="text-[10px] text-slate-400">জরুরি অবস্থায় তাৎক্ষণিক বাল্ক অ্যাকশন</p>
              </div>
            </div>

            <div className="space-y-2.5 mt-4">
              <button
                type="button"
                onClick={handleLockAllDues}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-950/50 active:scale-95"
              >
                <Lock className="w-4 h-4" />
                <span>বকেয়া থাকা সকল সাইট এক ক্লিকে লক করুন</span>
              </button>

              <button
                type="button"
                onClick={handleUnlockAll}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-700 active:scale-95"
              >
                <Unlock className="w-4 h-4 text-emerald-400" />
                <span>সকল ক্লায়েন্ট সাইট আনলক করুন</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
