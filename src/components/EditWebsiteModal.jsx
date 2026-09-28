import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Clock,
  Calendar,
  DollarSign,
  Globe,
  Key,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
  Info
} from 'lucide-react';
import { generatePasskey } from '../services/storageService';

export default function EditWebsiteModal({
  project,
  isOpen,
  onClose,
  onSave
}) {
  if (!isOpen || !project) return null;

  const [clientName, setClientName] = useState('');
  const [domain, setDomain] = useState('');
  const [planType, setPlanType] = useState('Standard');
  const [monthlyPrice, setMonthlyPrice] = useState(2500);
  const [totalBill, setTotalBill] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [passkey, setPasskey] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [notes, setNotes] = useState('');

  // Auto-Lock on Deadline Timer
  const [autoLockEnabled, setAutoLockEnabled] = useState(false);
  const [autoLockDate, setAutoLockDate] = useState('');

  // Initialize form when project changes
  useEffect(() => {
    if (project) {
      setClientName(project.clientName || '');
      setDomain(project.domain || '');
      setPlanType(project.planType || 'Standard');
      setMonthlyPrice(project.monthlyPrice || 2500);
      setTotalBill(project.totalBill || project.dueAmount || 0);
      setDueAmount(project.dueAmount ?? 0);
      setPasskey(project.passkey || generatePasskey());
      setStatus(project.status || 'ACTIVE');
      setWhatsappNumber(project.whatsappNumber || '01629559653');
      setContactNumber(project.contactNumber || '01629559653');
      setNotes(project.notes || '');

      setAutoLockEnabled(Boolean(project.autoLockEnabled));
      // Format to YYYY-MM-DDTHH:mm for datetime-local input
      if (project.autoLockDate) {
        try {
          const d = new Date(project.autoLockDate);
          if (!isNaN(d.getTime())) {
            const pad = (n) => String(n).padStart(2, '0');
            const localIso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
            setAutoLockDate(localIso);
          } else {
            setAutoLockDate('');
          }
        } catch (_) {
          setAutoLockDate('');
        }
      } else {
        setAutoLockDate('');
      }
    }
  }, [project]);

  const handleRegenerateKey = () => {
    setPasskey(generatePasskey());
  };

  const handleQuickDeadline = (days) => {
    const target = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const pad = (n) => String(n).padStart(2, '0');
    const localIso = `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}T${pad(target.getHours())}:${pad(target.getMinutes())}`;
    setAutoLockDate(localIso);
    setAutoLockEnabled(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const numDue = Number(dueAmount);

    const updated = {
      ...project,
      clientName: clientName.trim(),
      domain: domain.trim().replace(/^https?:\/\//, ''),
      planType,
      monthlyPrice: Number(monthlyPrice) || 0,
      totalBill: Number(totalBill) || 0,
      dueAmount: numDue >= 0 ? numDue : 0,
      passkey: passkey.trim(),
      status,
      whatsappNumber: whatsappNumber.trim() || '01629559653',
      contactNumber: contactNumber.trim() || '01629559653',
      notes: notes.trim(),
      autoLockEnabled: Boolean(autoLockEnabled && numDue > 0 && autoLockDate),
      autoLockDate: autoLockEnabled && autoLockDate ? new Date(autoLockDate).toISOString() : null,
      updatedAt: Date.now(),
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#091024] border border-cyan-500/40 p-5 sm:p-7 shadow-2xl shadow-cyan-950/40 overflow-hidden text-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              {clientName ? clientName.slice(0, 2).toUpperCase() : 'WG'}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>ওয়েবসাইট ও পেমেন্ট এডিট</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">ID: {project.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 py-4 space-y-5 flex-1">
          
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                ক্লায়েন্ট / প্রতিষ্ঠানের নাম *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#060B18] border border-slate-700/80 focus:border-cyan-400 rounded-xl text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                ডোমেইন লিঙ্ক *
              </label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="domain.com"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#060B18] border border-slate-700/80 focus:border-cyan-400 rounded-xl text-xs text-white outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Billing & Due Amount (Direct Payment Baki Editor) */}
          <div className="p-4 rounded-2xl bg-[#060B18] border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>বিলিং ও পেমেন্ট হিসাব (Payment Baki)</span>
              </span>
              <span className="text-[10px] text-slate-400">আপনি নিজে বকেয়া কমাতে বা বাড়াতে পারবেন</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                  মোট প্রজেক্ট বিল (Total Bill)
                </label>
                <input
                  type="number"
                  min="0"
                  value={totalBill}
                  onChange={(e) => setTotalBill(e.target.value)}
                  className="w-full px-3 py-2 bg-[#091024] border border-slate-700 focus:border-cyan-400 rounded-xl text-xs text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-rose-300 block mb-1 flex items-center justify-between">
                  <span>বকেয়া টাকা (Due Amount) *</span>
                  {Number(dueAmount) === 0 && (
                    <span className="text-[9px] text-emerald-400 font-bold">পরিশোধিত</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={dueAmount}
                    onChange={(e) => setDueAmount(e.target.value)}
                    className={`w-full px-3 py-2 bg-[#091024] border rounded-xl text-xs font-mono font-bold outline-none transition-colors ${
                      Number(dueAmount) > 0
                        ? 'border-rose-500/80 text-rose-300 focus:border-rose-400 shadow-sm shadow-rose-950/40'
                        : 'border-emerald-500/60 text-emerald-300 focus:border-emerald-400'
                    }`}
                  />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setDueAmount(0)}
                    className="text-[10px] text-emerald-400 hover:underline font-bold"
                  >
                    ✓ সম্পূর্ণ পরিশোধ (০ টাকা)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                  প্যাকেজ / মাসিক ফি
                </label>
                <input
                  type="number"
                  min="0"
                  value={monthlyPrice}
                  onChange={(e) => setMonthlyPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-[#091024] border border-slate-700 focus:border-cyan-400 rounded-xl text-xs text-white font-mono outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Auto-Lock on Deadline (Timer Feature) */}
          <div className={`p-4 rounded-2xl border transition-all ${
            autoLockEnabled
              ? 'bg-gradient-to-b from-[#130E24] to-[#0A0D1E] border-amber-500/50 shadow-lg shadow-amber-950/20'
              : 'bg-[#060B18] border-slate-800'
          }`}>
            <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  autoLockEnabled ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                    <span>স্বয়ংক্রিয় লক টাইমার (Auto-Lock on Deadline)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      অটোমেটিক
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    টাইমার শেষ হলে ওয়েবসাইট নিজে থেকেই স্বয়ংক্রিয়ভাবে বন্ধ হয়ে যাবে
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={autoLockEnabled}
                  onChange={(e) => setAutoLockEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {autoLockEnabled && (
              <div className="space-y-3 pt-3 border-t border-slate-800/80 animate-in fade-in duration-200">
                <div>
                  <label className="text-[11px] font-bold text-amber-300 block mb-1">
                    লক হওয়ার নির্দিষ্ট তারিখ ও সময় (Deadline):
                  </label>
                  <input
                    type="datetime-local"
                    value={autoLockDate}
                    onChange={(e) => setAutoLockDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#091024] border border-amber-500/40 focus:border-amber-400 rounded-xl text-xs text-white font-mono outline-none"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">দ্রুত সেট করুন:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickDeadline(1)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition-colors"
                  >
                    +১ দিন
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDeadline(2)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition-colors"
                  >
                    +২ দিন
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDeadline(3)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition-colors"
                  >
                    +৩ দিন
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDeadline(7)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition-colors"
                  >
                    +৭ দিন (১ সপ্তাহ)
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>কীভাবে কাজ করবে:</strong> এই নির্ধারিত সময় অতিক্রম হওয়া মাত্রই (যদি বকেয়া বিল থাকে), ওয়েবসাইট সাথে সাথে লক স্ক্রিন প্রদর্শন করবে। আপনাকে ম্যানুয়ালি সাইটে ঢুকতে হবে না। ক্লায়েন্ট বিল পরিশোধ করে দিলে আপনি বকেয়া ০ করে দিলেই টাইমার স্বয়ংক্রিয় নিষ্ক্রিয় হয়ে যাবে।
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Current Status & Passkey */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                বর্তমান সার্ভিস স্ট্যাটাস
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#060B18] border border-slate-700/80 focus:border-cyan-400 rounded-xl text-xs text-white outline-none cursor-pointer"
              >
                <option value="ACTIVE">সক্রিয় (Active - সাইট সচল)</option>
                <option value="LOCKED">স্থগিত (Locked - সাইবার লক চালু)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                আনলক পাস-কি (Passkey)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2.5 bg-[#060B18] border border-slate-700/80 focus:border-amber-400 rounded-xl text-xs text-amber-300 font-mono font-bold outline-none uppercase"
                />
                <button
                  type="button"
                  onClick={handleRegenerateKey}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition-colors"
                  title="নতুন পাস-কি তৈরি"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Section 5: Notes */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              নোট বা চুক্তি সংক্রান্ত বিবরণ
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="যেমন: ৩ দিন পর বাকি টাকা দেওয়ার কথা..."
              className="w-full px-3.5 py-2 bg-[#060B18] border border-slate-700/80 focus:border-cyan-400 rounded-xl text-xs text-white outline-none resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>পরিবর্তন সংরক্ষণ করুন</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
