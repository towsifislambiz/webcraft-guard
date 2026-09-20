import React from 'react';
import {
  LayoutDashboard,
  Globe,
  CreditCard,
  Settings,
  Headphones,
  Shield,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  X,
  LogOut,
  Radio,
  Zap
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  mobileOpen = false,
  onCloseMobile,
  projects = [],
  onOpenSimulator,
  onLogout
}) {
  const activeCount = projects.filter((p) => p.status === 'ACTIVE').length;
  const lockedCount = projects.filter((p) => p.status === 'LOCKED').length;
  const dueCount = projects.filter((p) => p.dueAmount > 0).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'ড্যাশবোর্ড',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'websites',
      label: 'আমার ওয়েবসাইট',
      icon: Globe,
      badge: projects.length.toString(),
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    },
    {
      id: 'payments',
      label: 'পেমেন্ট হিস্ট্রি',
      icon: CreditCard,
      badge: dueCount > 0 ? `${dueCount} বকেয়া` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    {
      id: 'settings',
      label: 'সেটিংস',
      icon: Settings,
      badge: null
    },
    {
      id: 'support',
      label: 'সহায়তা ও গাইড',
      icon: Headphones,
      badge: 'Help',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4 font-sans select-none overflow-y-auto">
      <div>
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between px-2 py-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-rose-500 p-0.5 shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-[#070D1E] rounded-[10px] flex items-center justify-center">
                  <span className="font-black text-cyan-400 text-lg tracking-wider">W</span>
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#080E1E] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-extrabold text-white tracking-tight">
                  WebCraft <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">Guard</span>
                </h2>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Agency Remote Security
              </p>
            </div>
          </div>

          {/* Close button for Mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/10 to-transparent text-cyan-300 border-l-2 border-cyan-400 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Promo & Logout */}
      <div className="space-y-3.5 pt-4 border-t border-slate-800/80">
        
        {/* Neon Security Box */}
        <div className="relative rounded-2xl p-3.5 bg-gradient-to-b from-[#0F172E] to-[#0B1124] border border-cyan-500/25 overflow-hidden shadow-lg shadow-cyan-950/50">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute top-2 right-2 opacity-15">
            <Shield className="w-12 h-12 text-cyan-400" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-cyan-400 stroke-[2.5]" />
            </div>
            <h4 className="text-xs font-black text-white">
              ক্লাউড কিল-সুইচ সচল
            </h4>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
            {lockedCount > 0 ? `${lockedCount}টি সাইট বর্তমানে স্থগিত` : 'সব ক্লায়েন্ট ওয়েবসাইট নিরাপদ'}
          </p>

          <button
            onClick={() => {
              if (onOpenSimulator) onOpenSimulator();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-90 text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>সিমুলেটরে টেস্ট করুন</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>প্যানেল থেকে লগআউট</span>
          </button>
        )}

        {/* Copyright */}
        <div className="text-[10px] text-slate-500 text-center font-medium">
          <p>© 2026 WebCraft Guard BD</p>
        </div>

      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (visible on lg screens) */}
      <aside className="hidden lg:flex w-64 bg-[#080E1E] border-r border-slate-800/80 flex-col h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay & Sidebar (visible on < lg when open) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={onCloseMobile}
          />
          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#080E1E] border-r border-cyan-500/30 shadow-2xl shadow-cyan-950/50 z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
