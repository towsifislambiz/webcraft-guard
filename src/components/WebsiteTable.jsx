import React, { useState } from 'react';
import {
  Search,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Info,
  MoreVertical,
  Code,
  Key,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Layers,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';

export default function WebsiteTable({
  projects = [],
  onToggleStatus,
  onOpenDetails,
  onOpenEmbed,
  onDeleteProject,
  onOpenAdd,
  onVerifyKey
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [copiedKeyId, setCopiedKeyId] = useState(null);

  // Filter projects
  const filtered = projects.filter((p) => {
    const matchSearch =
      (p.clientName || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.domain || '').toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'ACTIVE'
        ? p.status === 'ACTIVE'
        : p.status === 'LOCKED';

    return matchSearch && matchStatus;
  });

  return (
    <div className="rounded-3xl bg-[#091024]/90 border border-slate-800/90 shadow-2xl shadow-cyan-950/20 overflow-hidden font-sans">
      
      {/* Table Header Controls */}
      <div className="p-5 sm:p-6 border-b border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>আমার ওয়েবসাইট সমূহ</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              সব ওয়েবসাইট এক জায়গায়, সহজে নিয়ন্ত্রণ করুন
            </p>
          </div>
        </div>

        {/* Right Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ওয়েবসাইট খুঁজুন..."
              className="w-full bg-[#070D1E] border border-slate-700/80 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#070D1E] border border-slate-700/80 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-slate-300 font-medium focus:outline-none cursor-pointer"
          >
            <option value="ALL">সকল স্ট্যাটাস</option>
            <option value="ACTIVE">সক্রিয় (Active)</option>
            <option value="LOCKED">এক্সেস বন্ধ (Locked)</option>
          </select>

          {/* Fast Add Button */}
          <button
            onClick={onOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>নতুন যোগ</span>
          </button>
        </div>

      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          
          <thead className="bg-[#060B18] text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-800/80">
            <tr>
              <th className="py-3.5 px-5">ওয়েবসাইট</th>
              <th className="py-3.5 px-4">ডোমেইন</th>
              <th className="py-3.5 px-4">প্যাকেজ</th>
              <th className="py-3.5 px-4 text-center">স্ট্যাটাস</th>
              <th className="py-3.5 px-5 text-right">অ্যাকশন</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  কোনো ওয়েবসাইট পাওয়া যায়নি। নতুন ওয়েবসাইট যোগ করতে উপরের বাটনে ক্লিক করুন।
                </td>
              </tr>
            ) : (
              filtered.map((project) => {
                const isLocked = project.status === 'LOCKED';
                const isMenuOpen = openMenuId === project.id;

                return (
                  <tr
                    key={project.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isLocked ? 'bg-rose-950/15' : ''
                    }`}
                  >
                    {/* Website Thumbnail + Name */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        {/* Thumbnail Icon */}
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600/30 via-indigo-600/30 to-purple-600/30 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-xs">
                          <span className="font-mono text-cyan-300 font-black text-xs uppercase">
                            {project.clientName.slice(0, 2)}
                          </span>
                        </div>

                        <div>
                          <div className="font-extrabold text-white text-xs sm:text-sm">
                            {project.clientName}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {project.id}
                          </div>

                          {/* Dynamic Lock Key Badge when Locked */}
                          {isLocked && project.passkey && (
                            <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold shadow-sm">
                              <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>লক-কি: {project.passkey}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(project.passkey);
                                  setCopiedKeyId(project.id);
                                  setTimeout(() => setCopiedKeyId(null), 2000);
                                }}
                                className="ml-1 p-0.5 hover:text-white text-slate-400"
                                title="কি কপি করুন"
                              >
                                {copiedKeyId === project.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Domain Link */}
                    <td className="py-3.5 px-4 font-mono text-xs">
                      <a
                        href={project.domain.startsWith('http') ? project.domain : `https://${project.domain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        <span>{project.domain}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                    </td>

                    {/* Package */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                        {project.planType || 'Standard'}
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        ৳{Number(project.monthlyPrice || 2500).toLocaleString()} / মাস
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4 text-center">
                      <div
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide ${
                          isLocked
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isLocked ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'
                          }`}
                        />
                        <span>{isLocked ? 'Locked' : 'Active'}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2 relative">
                        
                        {/* Details Button */}
                        <button
                          onClick={() => onOpenDetails(project)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors"
                          title="বিস্তারিত তথ্য"
                        >
                          <Info className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="hidden sm:inline">ডিটেইলস</span>
                        </button>

                        {/* Kill Switch Toggle Button (Matches Mockup) */}
                        <button
                          onClick={() => onToggleStatus(project.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all shadow-sm active:scale-95 ${
                            isLocked
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                              : 'bg-rose-600/90 hover:bg-rose-500 text-white shadow-rose-600/20'
                          }`}
                        >
                          {isLocked ? (
                            <>
                              <Unlock className="w-3.5 h-3.5" />
                              <span>এক্সেস খুলুন</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              <span>এক্সেস বন্ধ</span>
                            </>
                          )}
                        </button>

                        {/* 3-Dots Menu Trigger */}
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(isMenuOpen ? null : project.id)}
                            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Dropdown Menu */}
                          {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#0C1222] border border-slate-700 rounded-2xl shadow-2xl p-1.5 z-30 text-left animate-in fade-in duration-150">
                              <button
                                onClick={() => {
                                  onOpenEmbed(project);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-cyan-300 hover:bg-slate-800 transition-colors"
                              >
                                <Code className="w-3.5 h-3.5 text-cyan-400" />
                                <span>এম্বেড কোড কপি</span>
                              </button>

                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(project.passkey);
                                  alert(`পাস-কি কপি করা হয়েছে: ${project.passkey}`);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-amber-300 hover:bg-slate-800 transition-colors"
                              >
                                <Key className="w-3.5 h-3.5 text-amber-400" />
                                <span>পাস-কি: {project.passkey}</span>
                              </button>

                              <button
                                onClick={() => {
                                  onDeleteProject(project.id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>মুছে ফেলুন</span>
                              </button>
                            </div>
                          )}
                        </div>

                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

        </table>
      </div>

      {/* Table Footer with Pagination */}
      <div className="p-4 px-6 border-t border-slate-800/80 bg-[#060B18] flex items-center justify-between text-xs text-slate-400">
        <div>
          মোট <strong className="text-white">{filtered.length}</strong> টি ওয়েবসাইট
        </div>

        <div className="flex items-center gap-1.5">
          <button className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-40">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="w-7 h-7 rounded-lg bg-cyan-600 text-white font-bold flex items-center justify-center text-xs">
            1
          </span>
          <button className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-40">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
