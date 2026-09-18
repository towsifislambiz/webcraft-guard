import React from 'react';
import { ShieldCheck, ShieldAlert, Users, Coins } from 'lucide-react';

const toBengaliNumber = (num) => {
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => bn[Number(d)]);
};

export default function MetricsOverview({ projects }) {
  const total = projects.length;
  const active = projects.filter((p) => p.status === 'ACTIVE').length;
  const locked = projects.filter((p) => p.status === 'LOCKED').length;
  const totalDue = projects.reduce((sum, p) => sum + (Number(p.dueAmount) || 0), 0);

  const cards = [
    {
      title: 'মোট ক্লায়েন্ট প্রজেক্ট',
      value: toBengaliNumber(total) + ' টি',
      icon: Users,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
      accent: 'from-indigo-500/20 to-transparent',
    },
    {
      title: 'সক্রিয় ও স্বাভাবিক সাইট',
      value: toBengaliNumber(active) + ' টি',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      accent: 'from-emerald-500/20 to-transparent',
    },
    {
      title: 'সাসপেন্ড / লক করা প্রজেক্ট',
      value: toBengaliNumber(locked) + ' টি',
      icon: ShieldAlert,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      accent: 'from-rose-500/20 to-transparent',
    },
    {
      title: 'মোট বকেয়া টাকার পরিমাণ',
      value: '৳' + toBengaliNumber(totalDue.toLocaleString()),
      icon: Coins,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      accent: 'from-amber-500/20 to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden bg-[#0C1120]/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 line-clamp-1">{card.title}</span>
              <div className={`w-8 h-8 rounded-xl ${card.bg} border flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {card.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
