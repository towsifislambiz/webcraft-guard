import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Key,
  Copy,
  Check,
  Code,
  ExternalLink,
  Trash2,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';

const toBengaliNumber = (num) => {
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => bn[Number(d)]);
};

export default function ProjectTable({
  projects,
  onToggleStatus,
  onOpenEmbed,
  onDeleteProject,
  onTestInSimulator,
}) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (projects.length === 0) {
    return (
      <div className="bg-[#0C1120]/70 border border-slate-800/90 rounded-3xl p-12 text-center">
        <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white mb-1">কোনো প্রজেক্ট যুক্ত করা হয়নি</h3>
        <p className="text-xs text-slate-400 mb-5">উপরের বাটনে ক্লিক করে প্রথম ক্লায়েন্ট যোগ করুন</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white">ক্লায়েন্ট লাইসেন্স ট্র্যাকার</h2>
          <p className="text-xs text-slate-400">দূর থেকে লাইভ সুইচ চেপে প্রজেক্ট বন্ধ বা চালু করুন</p>
        </div>
        <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
          মোট: {toBengaliNumber(projects.length)}টি প্রজেক্ট
        </span>
      </div>

      {/* ─── Desktop Table (md and up) ─── */}
      <div className="hidden md:block bg-[#0C1120]/80 border border-slate-800/90 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#10172A] border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">ক্লায়েন্ট ও ডোমেইন</th>
                <th className="py-4 px-4">বকেয়া বিল</th>
                <th className="py-4 px-4">লাইভ স্ট্যাটাস</th>
                <th className="py-4 px-4">সিক্রেট পাস-কি</th>
                <th className="py-4 px-6 text-right">রিমোট কিল-সুইচ ও অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {projects.map((proj) => {
                const isLocked = proj.status === 'LOCKED';
                return (
                  <tr key={proj.id} className="hover:bg-slate-900/40 transition-colors">
                    
                    {/* Client Info */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-sm">{proj.clientName}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-400 font-mono mt-0.5">
                        <span>{proj.domain || 'No domain'}</span>
                        {proj.domain && (
                          <a
                            href={'https://' + proj.domain}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-500 hover:text-amber-400 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      {proj.notes && (
                        <div className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                          📝 {proj.notes}
                        </div>
                      )}
                    </td>

                    {/* Due Amount */}
                    <td className="py-4 px-4">
                      {proj.dueAmount > 0 ? (
                        <div>
                          <span className="font-bold text-rose-400">
                            ৳{toBengaliNumber(Number(proj.dueAmount).toLocaleString())}
                          </span>
                          <div className="text-[10px] text-slate-500">
                            মোট: ৳{toBengaliNumber(Number(proj.totalBill || proj.dueAmount).toLocaleString())}
                          </div>
                        </div>
                      ) : (
                        <span className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          পরিশোধিত ✅
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      {isLocked ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          <span>লকড (স্থগিত)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>অ্যাক্টিভ ও লাইভ</span>
                        </span>
                      )}
                    </td>

                    {/* Passkey */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <code className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-300 font-mono text-xs font-bold">
                          {proj.passkey}
                        </code>
                        <button
                          onClick={() => handleCopy(proj.passkey, proj.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                          title="পাস-কি কপি করুন"
                        >
                          {copiedId === proj.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* 1-Click Remote Toggle Button */}
                        <button
                          onClick={() => onToggleStatus(proj.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${
                            isLocked
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                          }`}
                        >
                          {isLocked ? (
                            <>
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>আনলক করুন</span>
                            </>
                          ) : (
                            <>
                              <ShieldAlert className="w-3.5 h-3.5" />
                              <span>সাইট অফ করুন</span>
                            </>
                          )}
                        </button>

                        {/* Test in Simulator */}
                        <button
                          onClick={() => onTestInSimulator(proj)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white border border-slate-700 transition-all"
                          title="সিমুলেটরে সরাসরি টেস্ট করুন"
                        >
                          <Play className="w-4 h-4 fill-indigo-400" />
                        </button>

                        {/* Get Embed Code */}
                        <button
                          onClick={() => onOpenEmbed(proj)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
                          title="ক্লায়েন্ট স্ক্রিপ্ট কোড দেখুন"
                        >
                          <Code className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => onDeleteProject(proj.id)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border border-slate-800 transition-all"
                          title="প্রজেক্ট মুছুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Mobile Cards View (sm and down) ─── */}
      <div className="grid grid-cols-1 gap-3.5 md:hidden">
        {projects.map((proj) => {
          const isLocked = proj.status === 'LOCKED';
          return (
            <div
              key={proj.id}
              className={`bg-[#0C1120]/90 border rounded-2xl p-4 transition-all ${
                isLocked ? 'border-rose-500/40 shadow-lg shadow-rose-950/20' : 'border-slate-800'
              }`}
            >
              {/* Top Row: Client Name & Status */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div>
                  <h3 className="font-bold text-white text-sm">{proj.clientName}</h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{proj.domain}</div>
                </div>
                {isLocked ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                    লকড ⚠️
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    অ্যাক্টিভ ✅
                  </span>
                )}
              </div>

              {/* Due & Passkey */}
              <div className="bg-[#131B30] border border-slate-800 rounded-xl p-3 mb-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">বকেয়া বিল</span>
                  <span className="font-black text-rose-400 text-sm">
                    ৳{toBengaliNumber(Number(proj.dueAmount || 0).toLocaleString())}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px]">সিক্রেট পাস-কি</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <code className="text-amber-300 font-mono font-bold">{proj.passkey}</code>
                    <button
                      onClick={() => handleCopy(proj.passkey, proj.id)}
                      className="p-1 rounded bg-slate-800 text-slate-400"
                    >
                      {copiedId === proj.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                
                {/* 1-Click Toggle */}
                <button
                  onClick={() => onToggleStatus(proj.id)}
                  className={`col-span-2 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md active:scale-95 ${
                    isLocked
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {isLocked ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>সাইট আনলক করুন</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>দূর থেকে সাইট অফ করুন</span>
                    </>
                  )}
                </button>

                {/* Test in Simulator */}
                <button
                  onClick={() => onTestInSimulator(proj)}
                  className="py-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center justify-center gap-1 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-indigo-400" />
                  <span>টেস্ট</span>
                </button>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
