import React, { useState } from 'react';
import { X, Settings, Check, Phone, MessageSquare, Shield } from 'lucide-react';

export default function SettingsModal({ settings, isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0C1120] border border-slate-700/80 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
            <Settings className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">এজেন্সি ডিফল্ট সেটিংস</h3>
            <p className="text-xs text-slate-400">লক স্ক্রিনে প্রদর্শিত ফোন ও মেসেজ তথ্য</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">এজেন্সির নাম</label>
            <input
              type="text"
              value={form.agencyName}
              onChange={(e) => setForm({ ...form, agencyName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#070A13] border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">WhatsApp নম্বর (বাংলাদেশ)</label>
            <input
              type="text"
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              placeholder="01629559653"
              className="w-full px-3.5 py-2.5 bg-[#070A13] border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">সরাসরি কল করার নম্বর</label>
            <input
              type="text"
              value={form.contactNumber}
              onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
              placeholder="01629559653"
              className="w-full px-3.5 py-2.5 bg-[#070A13] border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : null}
            <span>{saved ? 'সেটিংস সংরক্ষিত হয়েছে!' : 'সংরক্ষণ করুন'}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
