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
  Sparkles,
  Check
} from 'lucide-react';
import { syncProjectToCloud } from '../../services/storageService';

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
