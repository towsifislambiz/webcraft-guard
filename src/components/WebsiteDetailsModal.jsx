import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Globe,
  DollarSign,
  Key,
  Copy,
  Check,
  Code,
  Lock,
  Unlock,
  ExternalLink,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function WebsiteDetailsModal({
  project,
  isOpen,
  onClose,
  onToggleStatus,
  onOpenEmbed
}) {
  if (!isOpen || !project) return null;

  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const isLocked = project.status === 'LOCKED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#091024] border border-cyan-500/30 p-6 sm:p-7 shadow-2xl shadow-cyan-950/40 overflow-hidden text-slate-100">
        
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center font-black text-lg text-cyan-400">
            {project.clientName?.charAt(0) || 'W'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">{project.clientName}</h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isLocked
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                }`}
              >
                {isLocked ? 'সাসপেন্ডেড' : 'সক্রিয়'}
              </span>
            </div>
            <a
              href={`https://${project.domain}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 mt-0.5"
            >
              <span>{project.domain}</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-4 text-xs">
          
          {/* Project ID & Passkey */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#060B18] border border-slate-800">
              <span className="text-[10px] text-slate-500 block mb-1">প্রজেক্ট আইডি</span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-cyan-300 font-bold truncate text-[11px]">{project.id}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(project.id);
                    setCopiedId(true);
                    setTimeout(() => setCopiedId(false), 2000);
                  }}
                  className="p-1 text-slate-400 hover:text-cyan-400"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#060B18] border border-slate-800">
              <span className="text-[10px] text-slate-500 block mb-1">সিক্রেট মাস্টার পাসকি</span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-amber-300 font-bold truncate text-[11px]">{project.passkey}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(project.passkey);
                    setCopiedKey(true);
                    setTimeout(() => setCopiedKey(false), 2000);
                  }}
                  className="p-1 text-slate-400 hover:text-amber-400"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Billing & Package */}
          <div className="p-4 rounded-2xl bg-[#060B18] border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">লাইসেন্স প্যাকেজ:</span>
              <span className="font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
                {project.planType || 'Standard'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">মাসিক চার্জ:</span>
              <span className="font-mono font-bold text-white">৳{(project.monthlyPrice || 0).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-slate-400">বকেয়া বিল (Due):</span>
              <span className={`font-mono font-bold ${project.dueAmount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                ৳{(project.dueAmount || 0).toLocaleString()}
              </span>
            </div>

            {project.notes && (
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-500 block mb-0.5">নোট:</span>
                <p className="text-slate-300 text-[11px]">{project.notes}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
            {/* Kill-switch Toggle */}
            <button
              onClick={() => {
                onToggleStatus(project.id);
                onClose();
              }}
              className={`w-full sm:w-1/2 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                isLocked
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
              }`}
            >
              {isLocked ? (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>ওয়েবসাইট আনলক করুন</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>রিমোট এক্সেস বন্ধ করুন</span>
                </>
              )}
            </button>

            {/* Embed Code Modal Opener */}
            <button
              onClick={() => {
                onClose();
                onOpenEmbed(project);
              }}
              className="w-full sm:w-1/2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Code className="w-4 h-4 text-cyan-400" />
              <span>ইন্টিগ্রেশন স্ক্রিপ্ট দেখুন</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
