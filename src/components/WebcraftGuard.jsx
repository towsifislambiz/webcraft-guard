import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Phone,
  Key,
  Lock,
  CheckCircle2,
  Check
} from 'lucide-react';

/**
 * WebCraft Guard - Client Anti-Theft & Remote License Kill-Switch
 * Embedded Component for Client Project (Kormoker Bari / WebCraft Guard Connected)
 */
export default function WebcraftGuard({ projectId = 'wg_kormokerbari' }) {
  const [project, setProject] = useState(null);
  const [enteredKey, setEnteredKey] = useState('');
  const [keyError, setKeyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);

  // Clear any old legacy bypass keys from localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('wg_unlocked_' + projectId);
    } catch (e) {}
  }, [projectId]);

  useEffect(() => {
    const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/webcraft-guard--master/databases/(default)/documents/projects/${projectId}`;

    const checkProject = async () => {
      try {
        // 1. Primary: Real-time Cloud fetch from Firebase Firestore REST API
        const res = await fetch(FIRESTORE_URL, { cache: 'no-store' });
        if (res.ok) {
          const doc = await res.json();
          const f = doc.fields || {};
          const remote = {
            id: projectId,
            status: f.status?.stringValue || 'ACTIVE',
            clientName: f.clientName?.stringValue || 'Kormoker Bari',
            domain: f.domain?.stringValue || 'kormokerbari.com',
            dueAmount: Number(f.dueAmount?.integerValue || f.dueAmount?.stringValue || 0),
            passkey: f.passkey?.stringValue || 'WG-KB26-PASS',
            whatsappNumber: f.whatsappNumber?.stringValue || '01629559653',
            contactNumber: f.contactNumber?.stringValue || '01629559653',
            autoLockEnabled: Boolean(f.autoLockEnabled?.booleanValue),
            autoLockDate: f.autoLockDate?.stringValue || null,
          };
          setProject(remote);
          return;
        }
      } catch (err) {
        // network issue fallback to localStorage
      }

      // 2. Fallback: LocalStorage check
      try {
        const raw = localStorage.getItem('webcraft_guard_projects_v1');
        if (raw) {
          const list = JSON.parse(raw);
          const match = list.find((p) => p.id === projectId);
          if (match) setProject(match);
        }
      } catch (e) {}
    };

    // Immediate check
    checkProject();

    // Real-time 1.5-second cloud polling interval
    const interval = setInterval(checkProject, 1500);
    window.addEventListener('webcraft_guard_update', checkProject);
    window.addEventListener('storage', checkProject);

    return () => {
      clearInterval(interval);
      window.removeEventListener('webcraft_guard_update', checkProject);
      window.removeEventListener('storage', checkProject);
    };
  }, [projectId]);

  // Check if status is LOCKED OR auto-lock deadline has expired
  const now = Date.now();
  const isAutoLockExpired = Boolean(
    project?.autoLockEnabled &&
    Number(project?.dueAmount) > 0 &&
    project?.autoLockDate &&
    now >= new Date(project.autoLockDate).getTime()
  );

  // If auto-lock deadline expired on client side, sync to Firestore
  useEffect(() => {
    if (isAutoLockExpired && project && project.status !== 'LOCKED') {
      const patchUrl = `https://firestore.googleapis.com/v1/projects/webcraft-guard--master/databases/(default)/documents/${projectId}?updateMask.fieldPaths=status&updateMask.fieldPaths=updatedAt`;
      fetch(patchUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            status: { stringValue: 'LOCKED' },
            updatedAt: { integerValue: String(Date.now()) },
          },
        }),
      }).catch(() => {});
    }
  }, [isAutoLockExpired, project, projectId]);

  const isActuallyLocked = project?.status === 'LOCKED' || isAutoLockExpired;

  // If not locked and deadline not expired, don't show the overlay
  if (!project || !isActuallyLocked) return null;

  // Handle Verify Key & Unlock
  const handleVerifyUnlock = async (e) => {
    e.preventDefault();
    setKeyError('');

    const cleanEntered = enteredKey.trim().toUpperCase();
    const cleanExpected = (project.passkey || '').trim().toUpperCase();

    if (!cleanEntered) {
      setKeyError('অনুগ্রহ করে সঠিক কি (Key) প্রদান করুন।');
      return;
    }

    if (cleanEntered === cleanExpected) {
      setIsVerifying(true);
      setVerifySuccess(true);

      try {
        // Send PATCH to Firestore to set status to ACTIVE in real-time
        const patchUrl = `https://firestore.googleapis.com/v1/projects/webcraft-guard--master/databases/(default)/documents/projects/${projectId}?updateMask.fieldPaths=status&updateMask.fieldPaths=updatedAt`;
        await fetch(patchUrl, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: {
              status: { stringValue: 'ACTIVE' },
              updatedAt: { integerValue: String(Date.now()) },
            },
          }),
        });

        // Also update LocalStorage so both apps update immediately
        try {
          const raw = localStorage.getItem('webcraft_guard_projects_v1');
          if (raw) {
            const list = JSON.parse(raw);
            const updatedList = list.map((p) =>
              p.id === projectId ? { ...p, status: 'ACTIVE', updatedAt: Date.now() } : p
            );
            localStorage.setItem('webcraft_guard_projects_v1', JSON.stringify(updatedList));
            window.dispatchEvent(new CustomEvent('webcraft_guard_update', { detail: updatedList }));
          }
        } catch (_) {}

        // Small delay to show verification success animation, then remove lock
        setTimeout(() => {
          setProject((prev) => ({ ...prev, status: 'ACTIVE' }));
          setIsVerifying(false);
        }, 1200);

      } catch (err) {
        setIsVerifying(false);
        setKeyError('ক্লাউড ভেরিফিকেশন ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ চেক করুন।');
      }
    } else {
      setKeyError('ভুল কি! সঠিক আনলক কি দিয়ে ভেরিফাই করুন অথবা এজেন্সির সাথে যোগাযোগ করুন।');
    }
  };

  const waNumber = (project.whatsappNumber || '01629559653').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/88${waNumber}?text=` + encodeURIComponent(
    `হ্যালো WebCraft BD, আমি ${project.clientName || 'Kormoker Bari'} ওয়েবসাইটের বকেয়া বিল ৳${project.dueAmount || 0} টাকা পরিশোধ করে সাইটটি চালু করতে চাই। পেমেন্ট নাম্বার দিন।`
  );

  return (
    <div className="fixed inset-0 z-[9999999999] bg-[#04060E]/98 backdrop-blur-3xl flex items-center justify-center p-4 sm:p-6 font-sans text-white overflow-y-auto antialiased select-none">
      
      {/* Cyber ambient glow background */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-rose-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Lock Card */}
      <div className="max-w-xl w-full bg-[#0A0F1D]/95 border border-rose-500/50 rounded-3xl p-6 sm:p-9 text-center shadow-[0_0_80px_rgba(244,63,94,0.25)] relative overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-300">
        
        {/* Top Glowing Laser Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_15px_#F43F5E]" />

        {/* Pulsing Lock & Shield Icon */}
        <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
          <div className="absolute inset-0 bg-rose-500/25 rounded-3xl blur-xl animate-pulse" />
          <div className="relative w-full h-full bg-gradient-to-b from-rose-500/20 to-red-950/60 border-2 border-rose-500/60 rounded-3xl flex items-center justify-center shadow-lg shadow-rose-950/50">
            <Lock className="w-9 h-9 text-rose-400 stroke-[2.5] animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-600 border-2 border-[#0A0F1D] flex items-center justify-center text-[11px] font-black">
            !
          </span>
        </div>

        {/* Security Alert Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          <span>{isAutoLockExpired ? 'পেমেন্ট ডেডলাইন অতিক্রান্ত • স্বয়ংক্রিয় লক' : 'লাইসেন্স স্থগিতাদেশ • সার্ভিস সাময়িক বন্ধ'}</span>
        </div>

        {/* Main Urgent Headline */}
        <h2 className="text-xl sm:text-2xl font-black text-white mb-3 leading-tight tracking-tight">
          ওয়েবসাইট চালু করতে আগে বকেয়া পেমেন্ট সম্পূর্ণ পরিশোধ করুন
        </h2>

        {/* Detailed Formal Notice */}
        <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed mb-6 font-normal">
          সম্মানিত গ্রাহক, চুক্তিনুযায়ী <strong className="text-white font-bold">{project.clientName}</strong> ওয়েবসাইটের ডেভেলপমেন্ট বিল এখনো বকেয়া রয়েছে। বকেয়া বিল সম্পূর্ণ পরিশোধ না করা পর্যন্ত এজেন্সির সেন্ট্রাল সার্ভার থেকে এই ওয়েবসাইটটির সকল লাইসেন্স ও অনলাইন সার্ভিস বন্ধ থাকবে।
        </p>

        {/* Due Bill & Project Card */}
        <div className="bg-[#050813] border border-rose-500/30 rounded-2xl p-4 sm:p-5 mb-6 text-left relative overflow-hidden shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-xs uppercase">
                {(project.clientName || 'KB').slice(0, 2)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-none">{project.clientName}</h4>
                <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">{project.domain}</span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-black">
              পেমেন্ট বকেয়া
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
                মোট বকেয়া বিল (Due Amount)
              </span>
              <div className="text-2xl font-black text-rose-400 font-mono drop-shadow-[0_0_10px_rgba(244,63,94,0.4)] mt-0.5">
                ৳{(project.dueAmount || 0).toLocaleString()} <span className="text-xs text-rose-300/80 font-normal">BDT</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-semibold">পেমেন্ট মেথড:</span>
              <span className="text-xs font-bold text-slate-200 block mt-0.5">বিকাশ / নগদ / ব্যাংক</span>
            </div>
          </div>
        </div>

        {/* Key Verification & Unlock Form (Always Visible) */}
        <div className="p-4 rounded-2xl bg-[#070D1E] border border-amber-500/40 text-left mb-6 shadow-md shadow-amber-950/20">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-400" />
              <span>এজেন্সি আনলক কি (Verification Key):</span>
            </label>
            <span className="text-[10px] text-slate-400">এডমিন প্যানেলে কি পাওয়া যাবে</span>
          </div>

          <form onSubmit={handleVerifyUnlock} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={enteredKey}
                onChange={(e) => setEnteredKey(e.target.value)}
                placeholder="যেমন: WG-XXXX-PASS"
                className="flex-1 px-3.5 py-2.5 bg-[#040711] border border-slate-700 focus:border-amber-400 rounded-xl text-white text-xs font-mono font-bold outline-none uppercase"
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
              >
                {verifySuccess ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                    <span>ভেরিফাইড!</span>
                  </>
                ) : (
                  <span>ভেরিফাই ও আনলক</span>
                )}
              </button>
            </div>

            {keyError && (
              <div className="text-xs font-bold text-rose-400 pt-1">
                {keyError}
              </div>
            )}

            {verifySuccess && (
              <div className="text-xs font-bold text-emerald-400 pt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>কি সফলভাবে ভেরিফাই হয়েছে! ওয়েবসাইট সচল হচ্ছে...</span>
              </div>
            )}
          </form>
        </div>

        {/* Action Buttons: WhatsApp & Call */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/30 active:scale-95"
          >
            <MessageSquare className="w-4 h-4 fill-slate-950" />
            <span>হোয়াটসঅ্যাপে পেমেন্ট ক্লিয়ার করুন</span>
          </a>

          <a
            href={`tel:${project.contactNumber || '01629559653'}`}
            className="py-3.5 px-5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700/80 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Phone className="w-4 h-4 text-cyan-400" />
            <span>সরাসরি কল: {project.contactNumber || '01629559653'}</span>
          </a>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-800/40 text-[10px] text-slate-500">
          <span>WebCraft Guard BD • Remote Anti-Theft & Kill-Switch System</span>
        </div>

      </div>
    </div>
  );
}
