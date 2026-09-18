import React, { useState } from 'react';
import { X, Code, Copy, Check, Sparkles } from 'lucide-react';

export default function EmbedCodeModal({ project, isOpen, onClose }) {
  if (!isOpen || !project) return null;

  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);

  // Script code for HTML / PHP / cPanel
  const htmlSnippet = `<!-- WebCraft Guard License Kill-Switch -->
<script src="https://license.webcraftbd.com/webcraft-guard.js" data-project="${project.id}"></script>`;

  // React Component Code
  const reactSnippet = `// 1. Install or copy WebcraftGuard.jsx into your React/Vite/Next.js project
// 2. In App.jsx:
import WebcraftGuard from './components/WebcraftGuard';

export default function App() {
  return (
    <>
      <WebcraftGuard projectId="${project.id}" />
      {/* Your Normal Website Code */}
    </>
  );
}`;

  const currentCode = activeTab === 'html' ? htmlSnippet : reactSnippet;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0C1120] border border-slate-700/80 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
            <Code className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">{project.clientName}</h3>
            <p className="text-xs text-slate-400">এই প্রজেক্টের সাইটে নিচের কোডটি পেস্ট করে দিন</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 mb-4">
          <button
            onClick={() => setActiveTab('html')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'html' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            HTML / PHP / cPanel (১ লাইনের কোড)
          </button>
          <button
            onClick={() => setActiveTab('react')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'react' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            React / Vite / Next.js
          </button>
        </div>

        {/* Code Snippet Box */}
        <div className="relative mb-5">
          <pre className="p-4 rounded-2xl bg-[#070A13] border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto selection:bg-emerald-500/30 selection:text-white leading-relaxed">
            {currentCode}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'কপি হয়েছে!' : 'কোড কপি'}</span>
          </button>
        </div>

        {/* How it works info */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-400 space-y-1.5">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>কীভাবে কাজ করবে?</span>
          </div>
          <p>
            ১. ক্লায়েন্টের ওয়েবসাইটে <code>&lt;head&gt;</code> অথবা <code>&lt;body&gt;</code> এর মধ্যে কোডটি পেস্ট করে সেভ করে দিন।
          </p>
          <p>
            ২. ক্লায়েন্ট যদি বিল পরিশোধ না করে, তখন আপনার এই ড্যাশবোর্ড থেকে <strong>"সাইট অফ করুন"</strong> বাটনে চাপ দিলেই তার সাইট অটোমেটিক লক হয়ে যাবে।
          </p>
        </div>

      </div>
    </div>
  );
}
