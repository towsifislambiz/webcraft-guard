import React, { useState } from 'react';
import {
  Search,
  Plus,
  Globe,
  Lock,
  Unlock,
  Key,
  Copy,
  Check,
  Code,
  Info,
  Trash2,
  ExternalLink,
  MessageSquare,
  DollarSign,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Filter
} from 'lucide-react';

export default function WebsitesView({
  projects = [],
  onToggleStatus,
  onOpenDetails,
  onOpenEmbed,
  onDeleteProject,
  onOpenAdd
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL | ACTIVE | LOCKED | DUE
  const [copiedKeyId, setCopiedKeyId] = useState(null);

  // Filter projects
  const filtered = projects.filter((p) => {
    const matchSearch =
      (p.clientName || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.domain || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.id || '').toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    if (statusFilter === 'ACTIVE') return p.status === 'ACTIVE';
    if (statusFilter === 'LOCKED') return p.status === 'LOCKED';
    if (statusFilter === 'DUE') return (p.dueAmount || 0) > 0;
    return true;
  });

  const activeCount = projects.filter((p) => p.status === 'ACTIVE').length;
  const lockedCount = projects.filter((p) => p.status === 'LOCKED').length;
  const dueCount = projects.filter((p) => (p.dueAmount || 0) > 0).length;

  const handleCopyPasskey = (passkey, id) => {
    navigator.clipboard.writeText(passkey);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Header Card */}
      <div className="rounded-3xl bg-[#091024] border border-cyan-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                আমার ওয়েবসাইট ব্যবস্থাপনা
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              যুক্ত থাকা সকল ক্লায়েন্ট ওয়েবসাইট এক ক্লিকে নিয়ন্ত্রণ ও রিমোট কিল-সুইচ করুন
            </p>
          </div>

          <button
            onClick={onOpenAdd}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>নতুন ওয়েবসাইট যোগ করুন</span>
          </button>
        </div>

        {/* Quick Filter Counts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              statusFilter === 'ALL'
                ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300'
                : 'bg-[#060B18] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-[11px] block font-medium">মোট সাইট</span>
            <span className="text-lg font-black text-white">{projects.length}</span>
          </button>

          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              statusFilter === 'ACTIVE'
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                : 'bg-[#060B18] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-[11px] block font-medium">সুরক্ষিত (Active)</span>
            <span className="text-lg font-black text-emerald-400">{activeCount}</span>
          </button>

          <button
            onClick={() => setStatusFilter('LOCKED')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              statusFilter === 'LOCKED'
                ? 'bg-rose-500/15 border-rose-500/50 text-rose-300'
                : 'bg-[#060B18] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-[11px] block font-medium">স্থগিত (Suspended)</span>
            <span className="text-lg font-black text-rose-400">{lockedCount}</span>
          </button>

          <button
            onClick={() => setStatusFilter('DUE')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              statusFilter === 'DUE'
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                : 'bg-[#060B18] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-[11px] block font-medium">বকেয়া বিল (Due)</span>
            <span className="text-lg font-black text-amber-400">{dueCount}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ক্লায়েন্টের নাম, ডোমেইন বা আইডি দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#091024] border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 font-bold shrink-0 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            ফিল্টার:
          </span>
          {['ALL', 'ACTIVE', 'LOCKED', 'DUE'].map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setStatusFilter(filterKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                statusFilter === filterKey
                  ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300'
                  : 'bg-[#091024] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {filterKey === 'ALL' && 'সবগুলো'}
              {filterKey === 'ACTIVE' && 'শুধুমাত্র সক্রিয়'}
              {filterKey === 'LOCKED' && 'শুধুমাত্র স্থগিত'}
              {filterKey === 'DUE' && 'বকেয়া বিল'}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="rounded-3xl bg-[#091024] border border-slate-800 p-12 text-center">
          <Globe className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">কোনো ওয়েবসাইট পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-400 mt-1">
            আপনার সার্চ ফিল্টারের সাথে মিলে এমন কোনো প্রজেক্ট নেই।
          </p>
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('ALL');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 transition-all"
          >
            ফিল্টার ক্লিয়ার করুন
          </button>
        </div>
      )}

      {/* Mobile Card View (< md) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filtered.map((project) => {
          const isLocked = project.status === 'LOCKED';
          const isCopied = copiedKeyId === project.id;
          const waNum = project.whatsappNumber || '01629559653';

          return (
            <div
              key={project.id}
              className={`rounded-2xl p-4 border transition-all ${
                isLocked
                  ? 'bg-[#120D1B] border-rose-500/40 shadow-lg shadow-rose-950/20'
                  : 'bg-[#091024] border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center font-black text-cyan-400 text-sm shrink-0">
                    {project.clientName?.charAt(0) || 'W'}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white leading-tight">
                      {project.clientName}
                    </h4>
                    <a
                      href={`https://${project.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 mt-0.5"
                    >
                      <span>{project.domain}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${
                    isLocked
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {isLocked ? 'স্থগিত' : 'সক্রিয়'}
                </span>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#060B18] border border-slate-800/80 text-xs mb-3">
                <div>
                  <span className="text-[10px] text-slate-500 block">প্যাকেজ:</span>
                  <span className="font-bold text-white">{project.planType || 'Standard'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">বকেয়া বিল:</span>
                  <span className={`font-mono font-bold ${(project.dueAmount || 0) > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    ৳{(project.dueAmount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">সিক্রেট পাসকি:</span>
                  <button
                    onClick={() => handleCopyPasskey(project.passkey, project.id)}
                    className="flex items-center gap-1 font-mono text-[11px] text-amber-300 font-bold hover:underline"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Key className="w-3 h-3 text-amber-400" />}
                    <span>{isCopied ? 'কপি হয়েছে!' : project.passkey}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {/* Kill Switch */}
                <button
                  onClick={() => onToggleStatus(project.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md ${
                    isLocked
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                      : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                  }`}
                >
                  {isLocked ? (
                    <>
                      <Unlock className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>আনলক করুন</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>লক করুন</span>
                    </>
                  )}
                </button>

                {/* Details Button */}
                <button
                  onClick={() => onOpenDetails(project)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="বিস্তারিত"
                >
                  <Info className="w-4 h-4" />
                </button>

                {/* Embed Script */}
                <button
                  onClick={() => onOpenEmbed(project)}
                  className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors"
                  title="স্ক্রিপ্ট কোড"
                >
                  <Code className="w-4 h-4" />
                </button>

                {/* WhatsApp Chat */}
                <a
                  href={`https://wa.me/88${waNum.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                  title="হোয়াটসঅ্যাপ"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>

                {/* Delete */}
                <button
                  onClick={() => onDeleteProject(project.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  title="ডিলিট"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (>= md) */}
      <div className="hidden md:block rounded-3xl bg-[#091024] border border-slate-800/90 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-[#060B18]/60 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-5">ক্লায়েন্ট ও ডোমেইন</th>
                <th className="py-3.5 px-4">প্যাকেজ</th>
                <th className="py-3.5 px-4">পাসকি (Passkey)</th>
                <th className="py-3.5 px-4">বকেয়া বিল</th>
                <th className="py-3.5 px-4">স্ট্যাটাস</th>
                <th className="py-3.5 px-5 text-right">রিমোট কিল-সুইচ অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((project) => {
                const isLocked = project.status === 'LOCKED';
                const isCopied = copiedKeyId === project.id;
                const waNum = project.whatsappNumber || '01629559653';

                return (
                  <tr
                    key={project.id}
                    className={`hover:bg-slate-800/30 transition-colors ${
                      isLocked ? 'bg-rose-950/10' : ''
                    }`}
                  >
                    {/* Client & Domain */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center font-black text-cyan-400 text-xs shrink-0">
                          {project.clientName?.charAt(0) || 'W'}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">{project.clientName}</div>
                          <a
                            href={`https://${project.domain}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 text-[11px] mt-0.5"
                          >
                            <span>{project.domain}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Plan Badge */}
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-bold text-slate-200 text-[11px]">
                        {project.planType || 'Standard'}
                      </span>
                    </td>

                    {/* Passkey */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleCopyPasskey(project.passkey, project.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#060B18] border border-slate-800 font-mono text-[11px] text-amber-300 font-bold hover:border-amber-500/50 transition-all"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Key className="w-3 h-3 text-amber-400" />}
                        <span>{isCopied ? 'কপি হয়েছে!' : project.passkey}</span>
                      </button>
                    </td>

                    {/* Due Bill */}
                    <td className="py-4 px-4 font-mono font-bold">
                      {(project.dueAmount || 0) > 0 ? (
                        <span className="text-rose-400">৳{(project.dueAmount || 0).toLocaleString()}</span>
                      ) : (
                        <span className="text-emerald-400">পরিশোধিত</span>
                      )}
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          isLocked
                            ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                            : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isLocked ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                        <span>{isLocked ? 'স্থগিত (Locked)' : 'সক্রিয় (Active)'}</span>
                      </span>
                    </td>

                    {/* Kill Switch Toggle & Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Kill-switch Toggle */}
                        <button
                          onClick={() => onToggleStatus(project.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                            isLocked
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                              : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                          }`}
                        >
                          {isLocked ? (
                            <>
                              <Unlock className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>চালু করুন</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>বন্ধ করুন</span>
                            </>
                          )}
                        </button>

                        {/* Embed Code Modal Opener */}
                        <button
                          onClick={() => onOpenEmbed(project)}
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white transition-colors"
                          title="স্ক্রিপ্ট দেখুন"
                        >
                          <Code className="w-4 h-4" />
                        </button>

                        {/* Details Modal Opener */}
                        <button
                          onClick={() => onOpenDetails(project)}
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="বিস্তারিত"
                        >
                          <Info className="w-4 h-4" />
                        </button>

                        {/* WhatsApp */}
                        <a
                          href={`https://wa.me/88${waNum.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                          title="হোয়াটসঅ্যাপ"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>

                        {/* Delete */}
                        <button
                          onClick={() => onDeleteProject(project.id)}
                          className="p-1.5 rounded-xl hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                          title="ডিলিট"
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

    </div>
  );
}
