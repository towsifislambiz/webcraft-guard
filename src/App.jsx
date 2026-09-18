import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricsOverview from './components/MetricsOverview';
import ProjectTable from './components/ProjectTable';
import AddProjectModal from './components/AddProjectModal';
import EmbedCodeModal from './components/EmbedCodeModal';
import LiveSimulatorModal from './components/LiveSimulatorModal';
import SettingsModal from './components/SettingsModal';
import {
  getStoredProjects,
  saveProjects,
  getAgencySettings,
  saveAgencySettings,
  subscribeToFirebaseProjects,
  syncProjectToCloud,
  deleteProjectFromCloud,
} from './services/storageService';
import { ShieldCheck, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState(() => getStoredProjects());
  const [agencySettings, setAgencySettings] = useState(() => getAgencySettings());

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedEmbedProject, setSelectedEmbedProject] = useState(null);
  const [selectedSimulatorProject, setSelectedSimulatorProject] = useState(null);

  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Real-time Firebase Cloud Listener
  useEffect(() => {
    const unsubscribe = subscribeToFirebaseProjects((remoteProjects) => {
      if (Array.isArray(remoteProjects) && remoteProjects.length > 0) {
        setProjects(remoteProjects);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync state to LocalStorage and window listeners
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  // Handle 1-Click Remote Toggle
  const handleToggleStatus = (projectId) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const newStatus = p.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
          const updated = { ...p, status: newStatus, updatedAt: Date.now() };
          // Push to Firebase Cloud
          syncProjectToCloud(updated);
          showToast(
            newStatus === 'LOCKED'
              ? `⚠️ ${p.clientName} সফলভাবে সাসপেন্ড ও লক করা হয়েছে!`
              : `✅ ${p.clientName} পুনরায় আনলক ও অ্যাক্টিভ করা হয়েছে!`,
            newStatus === 'LOCKED' ? 'error' : 'success'
          );
          return updated;
        }
        return p;
      })
    );
  };

  // Handle Add Project
  const handleSaveNewProject = (newProj) => {
    setProjects([newProj, ...projects]);
    syncProjectToCloud(newProj);
    showToast(`🎉 ${newProj.clientName} সফলভাবে যুক্ত করা হয়েছে!`);
  };

  // Handle Delete
  const handleDeleteProject = (projectId) => {
    if (confirm('আপনি কি নিশ্চিত এই প্রজেক্টটি ডিলিট করতে চান?')) {
      setProjects(projects.filter((p) => p.id !== projectId));
      deleteProjectFromCloud(projectId);
      showToast('প্রজেক্ট মুছে ফেলা হয়েছে।');
    }
  };

  // Handle Settings Save
  const handleSaveSettings = (newSettings) => {
    setAgencySettings(newSettings);
    saveAgencySettings(newSettings);
    showToast('এজেন্সি সেটিংস আপডেট হয়েছে!');
  };

  return (
    <div className="min-h-screen bg-[#070A13] text-slate-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold border animate-in slide-in-from-bottom-5 duration-200 ${
            toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
          }`}
        >
          {toast.type === 'error' ? (
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <Header
        onOpenAdd={() => setIsAddOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSimulator={() => setSelectedSimulatorProject(projects[0] || null)}
        activeCount={projects.filter((p) => p.status === 'ACTIVE').length}
        lockedCount={projects.filter((p) => p.status === 'LOCKED').length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Banner Alert */}
        <div className="bg-gradient-to-r from-indigo-900/30 via-slate-900/60 to-rose-900/30 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white">রিমোট কিল-সুইচ ইঞ্জিন সক্রিয় আছে</h3>
              <p className="text-[11px] text-slate-400">
                যেকোনো প্রজেক্টের পাশে <strong>"সাইট অফ করুন"</strong> চাপলে নিমেষেই ক্লায়েন্টের স্ক্রিনে পেমেন্ট লক ভেসে উঠবে।
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedSimulatorProject(projects[0] || null)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 transition-all shrink-0 active:scale-95"
          >
            ⚡ নিজে টেস্ট করে দেখুন
          </button>
        </div>

        {/* 4 Metric Cards */}
        <MetricsOverview projects={projects} />

        {/* Project Table & Actions */}
        <ProjectTable
          projects={projects}
          onToggleStatus={handleToggleStatus}
          onOpenEmbed={(p) => setSelectedEmbedProject(p)}
          onDeleteProject={handleDeleteProject}
          onTestInSimulator={(p) => setSelectedSimulatorProject(p)}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0C1120]/50 py-6 text-center text-xs text-slate-500">
        <p>© 2026 WebCraft BD — Agency Client License & Kill-Switch Security System</p>
      </footer>

      {/* Modals */}
      <AddProjectModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleSaveNewProject}
      />

      <EmbedCodeModal
        project={selectedEmbedProject}
        isOpen={!!selectedEmbedProject}
        onClose={() => setSelectedEmbedProject(null)}
      />

      <LiveSimulatorModal
        project={selectedSimulatorProject}
        isOpen={!!selectedSimulatorProject}
        onClose={() => setSelectedSimulatorProject(null)}
        onToggleStatus={handleToggleStatus}
      />

      <SettingsModal
        settings={agencySettings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />

    </div>
  );
}
