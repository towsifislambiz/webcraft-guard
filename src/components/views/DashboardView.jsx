import React from 'react';
import HeroSecurityBanner from '../HeroSecurityBanner';
import StatCards from '../StatCards';
import WebsiteTable from '../WebsiteTable';
import SecurityWidgets from '../SecurityWidgets';
import { Quote, Shield } from 'lucide-react';

export default function DashboardView({
  projects = [],
  onToggleStatus,
  onOpenDetails,
  onOpenEmbed,
  onDeleteProject,
  onOpenAdd,
  onVerifyKey
}) {
  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Cyber Hero Banner */}
      <HeroSecurityBanner onOpenAdd={onOpenAdd} />

      {/* 4 Metric Stats Cards */}
      <StatCards projects={projects} />

      {/* Central 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7">
        
        {/* Left: Website Table (12 cols on mobile/tablet, 8 cols on desktop) */}
        <div className="lg:col-span-8">
          <WebsiteTable
            projects={projects}
            onToggleStatus={onToggleStatus}
            onOpenDetails={onOpenDetails}
            onOpenEmbed={onOpenEmbed}
            onDeleteProject={onDeleteProject}
            onOpenAdd={onOpenAdd}
            onVerifyKey={onVerifyKey}
          />
        </div>

        {/* Right: Security Widgets (12 cols on mobile/tablet, 4 cols on desktop) */}
        <div className="lg:col-span-4">
          <SecurityWidgets projects={projects} />
        </div>

      </div>

      {/* Bottom Cyber Hacker Quote Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#091024] via-[#0E1B38] to-[#091024] border border-cyan-500/20 p-4 sm:p-6 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="absolute top-0 left-1/4 w-96 h-12 bg-cyan-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 italic">
              "নিরাপত্তা শুধু সুরক্ষা নয়, এটা আপনার ব্যবসার ভবিষ্যৎ।"
            </p>
            <span className="text-[10px] sm:text-[11px] text-cyan-400 font-bold mt-0.5 block">
              — WebCraft Guard PRO Operations Center
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-300 shrink-0 self-end sm:self-auto">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>Stay Secure 24/7</span>
        </div>
      </div>
    </div>
  );
}
