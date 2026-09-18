import React, { useState } from 'react';
import {
  X,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  ShoppingBag,
  Sparkles,
  Phone,
  MessageCircle,
  Key,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LiveSimulatorModal({ project, isOpen, onClose, onToggleStatus }) {
  if (!isOpen || !project) return null;

  const [enteredKey, setEnteredKey] = useState('');
  const [keyError, setKeyError] = useState('');
  const [temporaryUnlocked, setTemporaryUnlocked] = useState(false);

  const isLocked = project.status === 'LOCKED' && !temporaryUnlocked;

  const handleUnlockWithKey = (e) => {
    e.preventDefault();
    if (enteredKey.trim() === project.passkey) {
      setTemporaryUnlocked(true);
      setKeyError('');
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      setKeyError('পাস-কি সঠিক নয়! এজেন্সির দেওয়া সঠিক কি লিখুন।');
    }
  };

  const resetSimulator = () => {
    setTemporaryUnlocked(false);
    setEnteredKey('');
    setKeyError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0C1120] border border-slate-700/80 rounded-3xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Simulator Control Bar */}
        <div className="bg-[#10172A] border-b border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <div>
              <span className="text-xs font-bold text-slate-400">লাইভ ক্লায়েন্ট টেস্ট সিমুলেটর:</span>
              <h4 className="text-sm font-black text-white">{project.clientName} ({project.domain})</h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Toggle from inside simulator */}
            <button
              onClick={() => {
                onToggleStatus(project.id);
                resetSimulator();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                project.status === 'LOCKED'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
            >
              {project.status === 'LOCKED' ? 'ড্যাশবোর্ড থেকে Active করুন' : 'ড্যাশবোর্ড থেকে Lock করুন'}
            </button>

            {temporaryUnlocked && (
              <button
                onClick={resetSimulator}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1"
                title="সিমুলেটর রিসেট"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>রিসেট</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Virtual Client Website Area */}
        <div className="flex-1 relative overflow-y-auto bg-slate-100 font-sans text-slate-900">
          
          {/* Mock Client Store Header */}
          <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-amber-600" />
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">{project.clientName}</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
              <span>হোম</span>
              <span>কালেকশন</span>
              <span>যোগাযোগ</span>
              <span className="px-3 py-1 bg-amber-500 text-white rounded-full">কার্ট (০)</span>
            </div>
          </nav>

          {/* Mock Client Store Hero */}
          <div className="p-8 sm:p-12 text-center bg-gradient-to-b from-amber-50 to-white">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full uppercase">
              প্রিমিয়াম কালেকশন ২০২৬
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mt-4 mb-2">
              সেরা মানের ঐতিহ্যবাহী শাড়ি কম্বো
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
              ঘরে বসেই অর্ডার করুন এবং ক্যাশ অন ডেলিভারিতে পণ্য বুঝে পেয়ে পেমেন্ট করুন।
            </p>
            <button className="px-6 py-2.5 bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md">
              অর্ডার করুন এখনই
            </button>
          </div>

          {/* Mock Products Grid */}
          <div className="max-w-4xl mx-auto p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                <div className="h-36 bg-slate-100 rounded-xl mb-3 flex items-center justify-center text-slate-400 text-xs font-bold">
                  পণ্য ছবি #{item}
                </div>
                <h4 className="font-bold text-xs text-slate-800">সুতি জামদানি কম্বো সেট</h4>
                <div className="text-amber-600 font-black text-sm mt-1">৳১,৮৫০</div>
              </div>
            ))}
          </div>

          {/* ─── REALTIME LOCK OVERLAY (Visible only when Locked) ─── */}
          {isLocked && (
            <div className="absolute inset-0 z-50 bg-[#070A13]/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="bg-[#0C1120] border border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl shadow-black/80 relative">
                
                {/* Lock Icon */}
                <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center mx-auto mb-5">
                  <ShieldAlert className="w-8 h-8 text-rose-400 stroke-[2.5]" />
                </div>

                {/* Badge */}
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-500/15 text-rose-400 border border-rose-500/30 uppercase tracking-wider mb-3">
                  ⚠️ ওয়েবসাইট সাসপেন্ডেড
                </span>

                <h2 className="text-lg sm:text-xl font-black text-white mb-2 leading-snug">
                  ওয়েবসাইট সাময়িকভাবে স্থগিত রাখা হয়েছে
                </h2>

                <p className="text-xs text-slate-400 leading-relaxed mb-5">
                  সম্মানিত গ্রাহক, <strong>{project.clientName}</strong>-এর ডেভেলপমেন্ট বিলিং পেন্ডিং রয়েছে। সেবাটি পুনরায় চালু করতে অবিলম্বে এজেন্সির সাথে যোগাযোগ করে বকেয়া পরিশোধ করুন।
                </p>

                {/* Due info badge */}
                <div className="bg-[#131B30] border border-slate-800 rounded-2xl p-3 mb-5 flex items-center justify-around text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">ডোমেইন</span>
                    <span className="font-bold text-slate-300 font-mono">{project.domain}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">বকেয়া বিল</span>
                    <span className="font-black text-rose-400 text-sm">৳{Number(project.dueAmount || 0).toLocaleString()} BDT</span>
                  </div>
                </div>

                {/* Contact Agency Buttons */}
                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  <a
                    href={`https://wa.me/88${(project.whatsappNumber || '01629559653').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20"
                  >
                    <MessageCircle className="w-4 h-4 fill-slate-950" />
                    <span>WhatsApp Agency</span>
                  </a>
                  <a
                    href={`tel:${project.contactNumber || '01629559653'}`}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>কল করুন</span>
                  </a>
                </div>

                {/* Secret Passkey Unlock Field */}
                <form onSubmit={handleUnlockWithKey} className="border-t border-slate-800/80 pt-5 text-left">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>আনলক পাস-কি প্রদান করুন (Passkey):</span>
                  </label>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={enteredKey}
                      onChange={(e) => setEnteredKey(e.target.value)}
                      placeholder={`পাস-কি: ${project.passkey}`}
                      className="flex-1 px-3 py-2.5 bg-[#070A13] border border-slate-700 rounded-xl text-white text-xs font-mono font-bold focus:border-amber-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-xl transition-all shadow-md active:scale-95"
                    >
                      আনলক
                    </button>
                  </div>

                  {keyError && (
                    <div className="text-xs font-bold text-rose-400 mt-2">{keyError}</div>
                  )}
                  
                  <div className="text-[11px] text-slate-500 mt-2">
                    💡 <em>টেস্ট টিপ: পাস-কি ঘরে <code>{project.passkey}</code> লিখে আনলক বাটনে চাপ দিন।</em>
                  </div>
                </form>

              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
