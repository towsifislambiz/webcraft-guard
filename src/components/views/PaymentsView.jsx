import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  Search,
  Check,
  Copy,
  Receipt,
  Download,
  AlertCircle,
  ExternalLink,
  Plus
} from 'lucide-react';
import {
  getStoredPayments,
  savePayments,
  syncProjectToCloud
} from '../../services/storageService';

export default function PaymentsView({ projects = [], onUpdateProject, showToast }) {
  const [payments, setPayments] = useState(() => getStoredPayments());
  const [filter, setFilter] = useState('ALL'); // ALL | PAID | DUE
  const [search, setSearch] = useState('');
  const [copiedReceiptId, setCopiedReceiptId] = useState(null);

  // Sync payments state
  useEffect(() => {
    savePayments(payments);
  }, [payments]);

  // Financial Metrics
  const totalBilled = projects.reduce((acc, p) => acc + (Number(p.totalBill) || 0), 0);
  const totalDues = projects.reduce((acc, p) => acc + (Number(p.dueAmount) || 0), 0);
  const totalCollected = Math.max(0, totalBilled - totalDues);
  const recoveryRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 100;

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    const matchSearch =
      (p.clientName || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.trxId || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.domain || '').toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;
    if (filter === 'PAID') return p.status === 'PAID';
    if (filter === 'DUE') return p.status === 'DUE';
    return true;
  });

  // 1-Click Mark Payment Received
  const handleMarkAsPaid = (paymentId, projectId) => {
    // 1. Update Payment Transaction
    setPayments((prev) =>
      prev.map((item) =>
        item.id === paymentId
          ? {
              ...item,
              status: 'PAID',
              method: 'bKash/Nagad Verified',
              trxId: 'TX' + Math.floor(10000000 + Math.random() * 90000000),
              date: Date.now()
            }
          : item
      )
    );

    // 2. Update Project Due & Auto-unlock in projects list & Firestore
    if (projectId && onUpdateProject) {
      const match = projects.find((p) => p.id === projectId);
      if (match) {
        const updated = {
          ...match,
          dueAmount: 0,
          status: 'ACTIVE', // Automatically restore client site!
          updatedAt: Date.now(),
        };
        onUpdateProject(updated);
        syncProjectToCloud(updated);
      }
    }

    if (showToast) {
      showToast('🎉 পেমেন্ট সফলভাবে গৃহীত হয়েছে এবং ওয়েবসাইট স্বয়ংক্রিয়ভাবে আনলক হয়েছে!');
    }
  };

  const handleCopyReceipt = (payment) => {
    const receiptText = `=== WebCraft Guard Payment Receipt ===\nইনভয়েস: ${payment.id}\nক্লায়েন্ট: ${payment.clientName}\nডোমেইন: ${payment.domain}\nপরিমাণ: ৳${payment.amount.toLocaleString()}\nপেমেন্ট মেথড: ${payment.method}\nTrxID: ${payment.trxId}\nস্ট্যাটাস: ${payment.status === 'PAID' ? 'পরিশোধিত (PAID)' : 'বকেয়া (DUE)'}\nতারিখ: ${new Date(payment.date).toLocaleString('bn-BD')}`;
    navigator.clipboard.writeText(receiptText);
    setCopiedReceiptId(payment.id);
    setTimeout(() => setCopiedReceiptId(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner & Title */}
      <div className="rounded-3xl bg-[#091024] border border-cyan-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                পেমেন্ট ও বিলিং কন্ট্রোল সেন্টার
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              ক্লায়েন্টের বকেয়া বিলিং ট্র্যাকিং, ইনস্ট্যান্ট পেমেন্ট রিসিট ও অটোমেটিক আনলক ইঞ্জিন
            </p>
          </div>
        </div>

        {/* 4 Financial Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-5 border-t border-slate-800/80">
          
          {/* Card 1: Total Billed */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#060B18] border border-slate-800/90">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">মোট ইনভয়েস বিলিং</span>
            <div className="text-lg sm:text-xl font-black text-white font-mono">
              ৳{totalBilled.toLocaleString()}
            </div>
            <span className="text-[10px] text-cyan-400 mt-0.5 block">সর্বমোট ইস্যুকৃত বিল</span>
          </div>

          {/* Card 2: Collected */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#060B18] border border-emerald-500/30 shadow-sm shadow-emerald-950/20">
            <span className="text-[11px] font-semibold text-emerald-400 block mb-1">সংগৃহীত পেমেন্ট</span>
            <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
              ৳{totalCollected.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-500/90 mt-0.5 block">সফলভাবে প্রাপ্ত আয়</span>
          </div>

          {/* Card 3: Pending Dues */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#060B18] border border-rose-500/30 shadow-sm shadow-rose-950/20">
            <span className="text-[11px] font-semibold text-rose-400 block mb-1">বকেয়া বিল (Pending)</span>
            <div className="text-lg sm:text-xl font-black text-rose-400 font-mono">
              ৳{totalDues.toLocaleString()}
            </div>
            <span className="text-[10px] text-rose-400/90 mt-0.5 block">আদায়যোগ্য বকেয়া</span>
          </div>

          {/* Card 4: Recovery Rate */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#060B18] border border-slate-800/90">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">পেমেন্ট রিকভারি রেট</span>
            <div className="text-lg sm:text-xl font-black text-cyan-400 font-mono">
              {recoveryRate}%
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">কিল-সুইচ রিকভারি সাফল্য</span>
          </div>

        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ইনভয়েস আইডি, ক্লায়েন্ট বা TrxID দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#091024] border border-slate-800 focus:border-cyan-500 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'PAID', 'DUE'].map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => setFilter(statusKey)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                filter === statusKey
                  ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300'
                  : 'bg-[#091024] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {statusKey === 'ALL' && 'সকল লেনদেন'}
              {statusKey === 'PAID' && 'পরিশোধিত'}
              {statusKey === 'DUE' && 'বকেয়া লেনদেন'}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Card List (< md) */}
      <div className="grid grid-cols-1 gap-3.5 md:hidden">
        {filteredPayments.map((p) => {
          const isPaid = p.status === 'PAID';
          const isCopied = copiedReceiptId === p.id;

          return (
            <div
              key={p.id}
              className={`rounded-2xl p-4 border transition-all ${
                isPaid ? 'bg-[#091024] border-slate-800' : 'bg-[#150E1F] border-rose-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-cyan-400 font-bold">{p.id}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    isPaid
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {isPaid ? 'পরিশোধিত' : 'বকেয়া'}
                </span>
              </div>

              <h4 className="text-sm font-black text-white">{p.clientName}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{p.domain}</p>

              <div className="mt-3 p-2.5 rounded-xl bg-[#060B18] border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">পরিমাণ:</span>
                  <span className={`font-mono font-bold text-sm ${isPaid ? 'text-white' : 'text-rose-400'}`}>
                    ৳{p.amount.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">পেমেন্ট মেথড:</span>
                  <span className="text-slate-300 font-medium text-[11px]">{p.method}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => handleCopyReceipt(p)}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Receipt className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'রিসিট কপি হয়েছে' : 'রিসিট কপি'}</span>
                </button>

                {!isPaid && (
                  <button
                    onClick={() => handleMarkAsPaid(p.id, p.projectId)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95"
                  >
                    পেমেন্ট গ্রহণ করুন
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (>= md) */}
      <div className="hidden md:block rounded-3xl bg-[#091024] border border-slate-800/90 shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-[#060B18]/60 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-5">ইনভয়েস ও ক্লায়েন্ট</th>
              <th className="py-3.5 px-4">পরিমাণ (৳)</th>
              <th className="py-3.5 px-4">পেমেন্ট মাধ্যম</th>
              <th className="py-3.5 px-4">ট্রানজেকশন ID</th>
              <th className="py-3.5 px-4">স্ট্যাটাস</th>
              <th className="py-3.5 px-5 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredPayments.map((p) => {
              const isPaid = p.status === 'PAID';
              const isCopied = copiedReceiptId === p.id;

              return (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* Invoice & Client */}
                  <td className="py-4 px-5">
                    <div className="font-mono text-cyan-400 font-bold text-[11px]">{p.id}</div>
                    <div className="font-bold text-white text-xs mt-0.5">{p.clientName}</div>
                    <span className="text-slate-500 text-[10px]">{p.domain}</span>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4 font-mono font-bold text-sm">
                    <span className={isPaid ? 'text-white' : 'text-rose-400'}>
                      ৳{p.amount.toLocaleString()}
                    </span>
                  </td>

                  {/* Method */}
                  <td className="py-4 px-4 text-slate-300 font-medium">
                    {p.method}
                  </td>

                  {/* TrxID */}
                  <td className="py-4 px-4 font-mono text-slate-400 text-[11px]">
                    {p.trxId}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        isPaid
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      <span>{isPaid ? 'পরিশোধিত (Paid)' : 'বকেয়া (Due)'}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleCopyReceipt(p)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                        title="রিসিট কপি করুন"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Receipt className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'কপি হয়েছে' : 'রিসিট'}</span>
                      </button>

                      {!isPaid && (
                        <button
                          onClick={() => handleMarkAsPaid(p.id, p.projectId)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1 transition-all shadow-md active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>পেমেন্ট গ্রহণ</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
