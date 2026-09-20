import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';

// Views
import DashboardView from './components/views/DashboardView';
import WebsitesView from './components/views/WebsitesView';
import PaymentsView from './components/views/PaymentsView';
import SettingsView from './components/views/SettingsView';
import SupportView from './components/views/SupportView';

// Modals
import FastAddWebsiteModal from './components/FastAddWebsiteModal';
import WebsiteDetailsModal from './components/WebsiteDetailsModal';
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
  checkAuthSession,
  setAuthSession,
  generatePasskey
} from './services/storageService';

import {
  ShieldAlert,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuthSession());

  // Active View Tab ('dashboard' | 'websites' | 'payments' | 'settings' | 'support')
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mobile Drawer State
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Projects & Settings State
  const [projects, setProjects] = useState(() => getStoredProjects());
  const [agencySettings, setAgencySettings] = useState(() => getAgencySettings());

  // Modals State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedDetailsProject, setSelectedDetailsProject] = useState(null);
  const [selectedEmbedProject, setSelectedEmbedProject] = useState(null);
  const [selectedSimulatorProject, setSelectedSimulatorProject] = useState(null);

  // Toast Notification State
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

  // Save to LocalStorage whenever projects change
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  // Handle Logout
  const handleLogout = () => {
    setAuthSession(false);
    setIsAuthenticated(false);
    showToast('সফলভাবে লগআউট হয়েছে!', 'info');
  };

  // Handle 1-Click Remote Toggle (ACTIVE <-> LOCKED) with Dynamic Key Generation
  const handleToggleStatus = (projectId) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const newStatus = p.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
          // When locking, dynamically generate a fresh new verification key!
          const newPasskey = newStatus === 'LOCKED' ? generatePasskey() : p.passkey;
          const updated = {
            ...p,
            status: newStatus,
            passkey: newPasskey,
            updatedAt: Date.now()
          };
          
          // Push instantly to Firebase Cloud
          syncProjectToCloud(updated);

          showToast(
            newStatus === 'LOCKED'
              ? `🔒 ${p.clientName} লক করা হয়েছে! ভেরিফিকেশন কি: ${newPasskey}`
              : `✅ ${p.clientName} পুনরায় আনলক ও সচল করা হয়েছে!`,
            newStatus === 'LOCKED' ? 'error' : 'success'
          );
          return updated;
        }
        return p;
      })
    );
  };

  // Handle Verify Key & Activate (from Admin Panel or Verification Modal)
  const handleVerifyKey = (projectId, enteredKey) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return false;

    if (
      enteredKey &&
      target.passkey &&
      enteredKey.trim().toUpperCase() === target.passkey.trim().toUpperCase()
    ) {
      const updated = {
        ...target,
        status: 'ACTIVE',
        updatedAt: Date.now(),
      };
      setProjects((prev) => prev.map((p) => (p.id === projectId ? updated : p)));
      syncProjectToCloud(updated);
      showToast(`🎉 কি সঠিক! ${target.clientName} সফলভাবে আনলক ও অ্যাক্টিভ হয়েছে!`, 'success');
      return true;
    } else {
      showToast(`❌ ভুল কি! সঠিক কি দিয়ে ভেরিফাই করুন।`, 'error');
      return false;
    }
  };

  // Handle Add New Website
  const handleSaveNewProject = (newProj) => {
    setProjects((prev) => [newProj, ...prev]);
    syncProjectToCloud(newProj);
    showToast(`🎉 ${newProj.clientName} সফলভাবে যুক্ত করা হয়েছে!`, 'success');
  };

  // Handle Single Project Update (e.g. from Payments)
  const handleUpdateProject = (updatedProject) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
  };

  // Handle Bulk Update Projects (e.g. Master Lock / Unlock All)
  const handleBulkUpdateProjects = (updatedProjectsList) => {
    setProjects(updatedProjectsList);
  };

  // Handle Delete Project
  const handleDeleteProject = (projectId) => {
    if (window.confirm('আপনি কি নিশ্চিত এই প্রজেক্টটি ডিলিট করতে চান?')) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      deleteProjectFromCloud(projectId);
      showToast('প্রজেক্ট মুছে ফেলা হয়েছে।', 'info');
    }
  };

  // Handle Settings Save
  const handleSaveSettings = (newSettings) => {
    setAgencySettings(newSettings);
    saveAgencySettings(newSettings);
    showToast('এজেন্সি সেটিংস আপডেট হয়েছে!', 'success');
  };

  // If Not Logged In, Render Cyberpunk Login Screen
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#060B18] text-slate-100 flex font-sans selection:bg-cyan-500/30 selection:text-cyan-200 antialiased">
      
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-xs font-bold border backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200 ${
            toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200 shadow-rose-950/50'
              : toast.type === 'info'
              ? 'bg-slate-900/90 border-cyan-500/50 text-cyan-200 shadow-cyan-950/50'
              : 'bg-[#0A1A2F]/90 border-emerald-500/50 text-emerald-200 shadow-emerald-950/50'
          }`}
        >
          {toast.type === 'error' ? (
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          ) : toast.type === 'info' ? (
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Responsive Left Sidebar (Desktop Sticky + Mobile Drawer) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        projects={projects}
        onOpenSimulator={() => setSelectedSimulatorProject(projects[0] || null)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Navbar with Mobile Hamburger Button */}
        <TopNavbar
          onLogout={handleLogout}
          onOpenAdd={() => setIsAddOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenSimulator={() => setSelectedSimulatorProject(projects[0] || null)}
          onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          
          {/* 1. Dashboard View */}
          {activeTab === 'dashboard' && (
            <DashboardView
              projects={projects}
              onToggleStatus={handleToggleStatus}
              onOpenDetails={(p) => setSelectedDetailsProject(p)}
              onOpenEmbed={(p) => setSelectedEmbedProject(p)}
              onDeleteProject={handleDeleteProject}
              onOpenAdd={() => setIsAddOpen(true)}
            />
          )}

          {/* 2. Websites Management View */}
          {activeTab === 'websites' && (
            <WebsitesView
              projects={projects}
              onToggleStatus={handleToggleStatus}
              onOpenDetails={(p) => setSelectedDetailsProject(p)}
              onOpenEmbed={(p) => setSelectedEmbedProject(p)}
              onDeleteProject={handleDeleteProject}
              onOpenAdd={() => setIsAddOpen(true)}
            />
          )}

          {/* 3. Payments & Billing View */}
          {activeTab === 'payments' && (
            <PaymentsView
              projects={projects}
              onUpdateProject={handleUpdateProject}
              showToast={showToast}
            />
          )}

          {/* 4. Settings View */}
          {activeTab === 'settings' && (
            <SettingsView
              settings={agencySettings}
              onSaveSettings={handleSaveSettings}
              projects={projects}
              onBulkUpdateProjects={handleBulkUpdateProjects}
              showToast={showToast}
            />
          )}

          {/* 5. Support & Docs View */}
          {activeTab === 'support' && (
            <SupportView
              onOpenSimulator={() => setSelectedSimulatorProject(projects[0] || null)}
            />
          )}

        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-800/80 bg-[#080E1E]/90 py-5 text-center text-xs text-slate-500">
          <p>© 2026 WebCraft Guard BD — All Systems Secured. Real-time Cloud Active.</p>
        </footer>

      </div>

      {/* Modals */}
      <FastAddWebsiteModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleSaveNewProject}
      />

      <WebsiteDetailsModal
        project={selectedDetailsProject}
        isOpen={!!selectedDetailsProject}
        onClose={() => setSelectedDetailsProject(null)}
        onToggleStatus={handleToggleStatus}
        onOpenEmbed={(p) => setSelectedEmbedProject(p)}
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
