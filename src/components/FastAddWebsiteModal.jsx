import React, { useState } from 'react';
import {
  X,
  Plus,
  ShieldCheck,
  Globe,
  DollarSign,
  Phone,
  Key,
  Copy,
  Check,
  Sparkles,
  Layers,
  Code
} from 'lucide-react';
import { generatePasskey, generateProjectId } from '../services/storageService';

export default function FastAddWebsiteModal({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  const [clientName, setClientName] = useState('');
  const [domain, setDomain] = useState('');
  const [planType, setPlanType] = useState('Standard');
  const [monthlyPrice, setMonthlyPrice] = useState(2500);
  const [dueAmount, setDueAmount] = useState(2500);
  const [whatsappNumber, setWhatsappNumber] = useState('01629559653');
  const [notes, setNotes] = useState('');

  const [createdProject, setCreatedProject] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPasskey, setCopiedPasskey] = useState(false);

  // Auto generated IDs
  const projectId = clientName ? generateProjectId(clientName) : 'wg_my_client';
  const autoPasskey = generatePasskey();

  const handlePlanSelect = (type, price) => {
    setPlanType(type);
    setMonthlyPrice(price);
    if (!dueAmount || dueAmount === monthlyPrice) {
      setDueAmount(price);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const newProject = {
      id: generateProjectId(clientName),
      clientName: clientName.trim(),
      domain: (domain.trim() || `${clientName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`).replace(/^https?:\/\//, ''),
      planType,
      monthlyPrice: Number(monthlyPrice) || 2500,
      status: 'ACTIVE',
      passkey: autoPasskey,
      totalBill: Number(dueAmount) || Number(monthlyPrice) || 2500,
      dueAmount: Number(dueAmount) || 0,
      whatsappNumber: whatsappNumber || '01629559653',
      contactNumber: whatsappNumber || '01629559653',
      notes: notes || 'নতুন যুক্ত করা প্রজেক্ট',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    onSave(newProject);
    setCreatedProject(newProject);
  };

  const resetAndClose = () => {
    setClientName('');
    setDomain('');
    setCreatedProject(null);
    setCopiedCode(false);
    onClose();
  };

  const embedScript = createdProject
    ? `<script src="${window.location.origin}/webcraft-guard.js" data-project-id="${createdProject.id}" async></script>`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#091024] border border-cyan-500/40 p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 overflow-hidden text-slate-100">
        
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success View after Adding */}
        {createdProject ? (
          <div className="space-y-6 text-center py-2 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">
                ওয়েবসাইট সফলভাবে যুক্ত হয়েছে! 🚀
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                <span className="text-cyan-400 font-bold">{createdProject.clientName}</span> এখন রিমোট গার্ডের সাথে কানেক্টেড।
              </p>
            </div>

            {/* Quick Embed Snippet */}
            <div className="text-left bg-[#050813] border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-cyan-400" />
                  ক্লায়েন্টের ওয়েবসাইটে বসানোর স্ক্রিপ্ট:
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(embedScript);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold transition-all border border-cyan-500/40"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                </button>
              </div>

              <pre className="p-3 bg-[#0A1024] rounded-xl text-[11px] font-mono text-cyan-300/90 overflow-x-auto border border-slate-800/80">
                {embedScript}
              </pre>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/60">
                <span>সিক্রেট পাসকি:</span>
                <span className="font-mono font-bold text-amber-300">{createdProject.passkey}</span>
              </div>
            </div>

            <button
              onClick={resetAndClose}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition-all"
            >
              ড্যাশবোর্ডে ফিরে যান
            </button>
          </div>
        ) : (
          /* Form to Add */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Modal Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">নতুন ওয়েবসাইট যুক্ত করুন</h3>
                <p className="text-xs text-slate-400">১-ক্লিকে ক্লাউড গার্ড ও রিমোট কিল-সুইচ সেটআপ</p>
              </div>
            </div>

            {/* Input 1: Client / Website Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ক্লায়েন্ট বা ওয়েবসাইটের নাম <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="যেমন: Style Mart BD"
                className="w-full px-4 py-2.5 rounded-xl bg-[#060B18] border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>

            {/* Input 2: Domain URL */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>ওয়েবসাইট ডোমেইন</span>
                <span className="text-[10px] text-slate-500 font-normal">https:// ছাড়া লিখুন</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="যেমন: stylemartbd.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#060B18] border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Plan Selector Buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                প্যাকেজ নির্বাচন করুন
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { name: 'Basic', price: 2000, label: '৳২,০০০' },
                  { name: 'Standard', price: 2500, label: '৳২,৫০০' },
                  { name: 'Premium', price: 3000, label: '৳৩,০০০' },
                ].map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handlePlanSelect(p.name, p.price)}
                    className={`py-2.5 px-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                      planType === p.name
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/20'
                        : 'bg-[#060B18] border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-black">{p.name}</span>
                    <span className="text-[11px] font-mono font-bold text-slate-200">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Due Amount in 2 Cols */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  বকেয়া বিল (৳)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="number"
                    value={dueAmount}
                    onChange={(e) => setDueAmount(e.target.value)}
                    placeholder="2500"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#060B18] border border-slate-800 focus:border-cyan-500 text-sm text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  হোয়াটসঅ্যাপ নাম্বার
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="01629559653"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#060B18] border border-slate-800 focus:border-cyan-500 text-sm text-white font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Generated Project ID Preview */}
            <div className="p-3 bg-[#060B18] rounded-xl border border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">অটো-জেনারেটেড আইডি:</span>
              <span className="font-mono text-cyan-400 font-bold">{projectId}</span>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={resetAndClose}
                className="w-1/3 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
              >
                বাতিল
              </button>

              <button
                type="submit"
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs tracking-wide shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                <span>ওয়েবসাইট যুক্ত করুন</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
