import React, { useState, useEffect } from 'react';
import { ShieldAlert, MessageCircle, Phone, Key, Lock } from 'lucide-react';

/**
 * WebCraft Guard - Embedded React Component
 * 
 * Usage in any Client React Project (e.g. App.jsx):
 * import WebcraftGuard from './WebcraftGuard';
 * <WebcraftGuard projectId="wg_giftvibes" />
 */
export default function WebcraftGuard({ projectId }) {
  const [project, setProject] = useState(null);
  const [isUnlockedPermanently, setIsUnlockedPermanently] = useState(false);
  const [enteredKey, setEnteredKey] = useState('');
  const [keyError, setKeyError] = useState('');

  const bypassKey = 'wg_unlocked_' + projectId;

  useEffect(() => {
    if (localStorage.getItem(bypassKey) === 'true') {
      setIsUnlockedPermanently(true);
      return;
    }

    const checkProject = () => {
      try {
        const raw = localStorage.getItem('webcraft_guard_projects_v1');
        if (raw) {
          const list = JSON.parse(raw);
          const match = list.find((p) => p.id === projectId);
          if (match) setProject(match);
        }
      } catch (e) {}
    };

    checkProject();
    window.addEventListener('webcraft_guard_update', checkProject);
    window.addEventListener('storage', checkProject);
    const interval = setInterval(checkProject, 3000);

    return () => {
      window.removeEventListener('webcraft_guard_update', checkProject);
      window.removeEventListener('storage', checkProject);
      clearInterval(interval);
    };
  }, [projectId]);

  if (isUnlockedPermanently) return null;
  if (!project || project.status !== 'LOCKED') return null;

  const handleUnlock = (e) => {
    e.preventDefault();
    if (enteredKey.trim() === project.passkey) {
      localStorage.setItem(bypassKey, 'true');
      setIsUnlockedPermanently(true);
      alert('অভিনন্দন! ওয়েবসাইটটি সফলভাবে সক্রিয় করা হয়েছে।');
    } else {
      setKeyError('পাস-কি সঠিক নয়। এজেন্সির সাথে যোগাযোগ করুন।');
    }
  };

  const waNumber = (project.whatsappNumber || '01629559653').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/88${waNumber}?text=` + encodeURIComponent(
    `হ্যালো WebCraft BD, আমার ওয়েবসাইট (${project.domain || project.clientName}) সাময়িকভাবে স্থগিত দেখাচ্ছে। আমি বকেয়া বিল পরিশোধ করতে চাই।`
  );

  return (
    <div className="fixed inset-0 z-[9999999999] bg-[#050810]/95 backdrop-blur-2xl flex items-center justify-center p-4 font-sans text-white overflow-y-auto">
      <div className="max-w-md w-full bg-[#0C1120] border border-rose-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-black relative animate-in fade-in duration-300">
        
        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-8 h-8 text-rose-400 stroke-[2.5]" />
        </div>

        {/* Badge */}
        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-500/15 text-rose-400 border border-rose-500/30 uppercase tracking-wider mb-3">
          ⚠️ সার্ভিস স্থগিতাদেশ
        </span>

        <h2 className="text-xl font-black text-white mb-2 leading-tight">
          ওয়েবসাইট সাময়িকভাবে স্থগিত রাখা হয়েছে
        </h2>

        <p className="text-xs text-slate-400 leading-relaxed mb-5">
          সম্মানিত গ্রাহক, <strong>{project.clientName}</strong>-এর ডেভেলপমেন্ট বিলিং পেন্ডিং রয়েছে। সেবাটি পুনরায় চালু করতে অবিলম্বে এজেন্সির সাথে যোগাযোগ করে বকেয়া পরিশোধ করুন।
        </p>

        {/* Domain & Bill Badge */}
        <div className="bg-[#131B30] border border-slate-800 rounded-2xl p-3.5 mb-5 flex items-center justify-around text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] font-semibold">ডোমেইন</span>
            <span className="font-bold text-slate-300 font-mono">{project.domain}</span>
          </div>
          {project.dueAmount && (
            <div>
              <span className="text-slate-500 block text-[10px] font-semibold">বকেয়া বিল</span>
              <span className="font-black text-rose-400 text-sm">৳{Number(project.dueAmount).toLocaleString()} BDT</span>
            </div>
          )}
        </div>

        {/* Contact Buttons */}
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950" />
            <span>WhatsApp</span>
          </a>
          <a
            href={`tel:${project.contactNumber || '01629559653'}`}
            className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>কল করুন</span>
          </a>
        </div>

        {/* Secret Passkey Field */}
        <form onSubmit={handleUnlock} className="border-t border-slate-800/80 pt-5 text-left">
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>আনলক পাস-কি প্রদান করুন:</span>
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={enteredKey}
              onChange={(e) => setEnteredKey(e.target.value)}
              placeholder="পাস-কি লিখুন"
              className="flex-1 px-3 py-2.5 bg-[#070A13] border border-slate-700 rounded-xl text-white text-xs font-mono font-bold focus:border-amber-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-extrabold text-xs rounded-xl transition-all shadow-md active:scale-95"
            >
              আনলক
            </button>
          </div>
          {keyError && (
            <div className="text-xs font-bold text-rose-400 mt-2">{keyError}</div>
          )}
        </form>

      </div>
    </div>
  );
}
