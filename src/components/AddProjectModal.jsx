import React, { useState } from 'react';
import { X, ShieldPlus, Sparkles, Key, Globe, User, DollarSign, Phone } from 'lucide-react';
import { generatePasskey, generateProjectId } from '../services/storageService';

export default function AddProjectModal({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  const [form, setForm] = useState({
    clientName: '',
    domain: '',
    totalBill: 8000,
    dueAmount: 8000,
    whatsappNumber: '01629559653',
    contactNumber: '01629559653',
    notes: '',
    passkey: generatePasskey(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.clientName.trim()) return;

    const newProject = {
      ...form,
      id: generateProjectId(form.clientName),
      status: 'ACTIVE',
      totalBill: Number(form.totalBill) || 0,
      dueAmount: Number(form.dueAmount) || 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    onSave(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0C1120] border border-slate-700/80 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center">
            <ShieldPlus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">নতুন ক্লায়েন্ট প্রজেক্ট যুক্ত করুন</h3>
            <p className="text-xs text-slate-400">প্রজেক্ট আইডি ও ইউনিক পাস-কি স্বয়ংক্রিয়ভাবে তৈরি হবে</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Client Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">ক্লায়েন্টের নাম বা শপের নাম *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                placeholder="যেমন: Gift Vibes E-commerce"
                className="w-full pl-10 pr-4 py-2.5 bg-[#070A13] border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Domain */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">ডোমেইন বা ওয়েবসাইট লিংক</label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value.replace(/^https?:\/\//, '') })}
                placeholder="যেমন: giftvibesbd.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#070A13] border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Bill & Due */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">মোট প্রজেক্ট বিল (৳)</label>
              <input
                type="number"
                value={form.totalBill}
                onChange={(e) => setForm({ ...form, totalBill: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A13] border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">বকেয়া বিল (৳)</label>
              <input
                type="number"
                value={form.dueAmount}
                onChange={(e) => setForm({ ...form, dueAmount: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#070A13] border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:border-rose-400 focus:outline-none font-mono text-rose-400 font-bold"
              />
            </div>
          </div>

          {/* Passkey */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">অটোমেটিক সিক্রেট পাস-কি</label>
              <button
                type="button"
                onClick={() => setForm({ ...form, passkey: generatePasskey() })}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-bold"
              >
                <Sparkles className="w-3 h-3" /> নতুন কি তৈরি
              </button>
            </div>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
              <input
                type="text"
                readOnly
                value={form.passkey}
                className="w-full pl-10 pr-4 py-2.5 bg-[#131B30] border border-amber-500/30 rounded-xl text-amber-300 text-xs sm:text-sm font-mono font-bold select-all"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">এই পাস-কি ক্লায়েন্টকে দিলে সে নিজে সাইট আনলক করতে পারবে</p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">নোট (ঐচ্ছিক)</label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="যেমন: ডেলিভারি পর ৩ দিন পর দেওয়ার কথা"
              className="w-full px-3.5 py-2.5 bg-[#070A13] border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-500/25 transition-all mt-4"
          >
            প্রজেক্ট সংরক্ষণ ও অ্যাক্টিভ করুন 🚀
          </button>

        </form>

      </div>
    </div>
  );
}
