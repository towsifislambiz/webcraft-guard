import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

const STORAGE_KEY = 'webcraft_guard_projects_v1';
const SETTINGS_KEY = 'webcraft_guard_agency_settings_v1';

export const DEFAULT_AGENCY_SETTINGS = {
  agencyName: 'WebCraft BD',
  whatsappNumber: '01629559653',
  contactNumber: '01629559653',
  defaultWarningTitle: 'ওয়েবসাইট সাময়িকভাবে স্থগিত রাখা হয়েছে',
  defaultWarningMessage: 'সম্মানিত গ্রাহক, এই ওয়েবসাইটটির ডেভেলপমেন্ট বিলিং পেন্ডিং রয়েছে। সেবাটি চালু করতে এজেন্সির সাথে যোগাযোগ করুন।',
};

export const AUTH_STORAGE_KEY = 'webcraft_guard_auth_session';

export const checkAuthSession = () => {
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
};

export const setAuthSession = (status) => {
  if (status) {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

export const INITIAL_PROJECTS = [
  {
    id: 'wg_giftvibes',
    clientName: 'Gift Vibes E-commerce',
    domain: 'giftvibesbd.com',
    planType: 'Basic E-commerce',
    monthlyPrice: 2000,
    status: 'ACTIVE', // ACTIVE | LOCKED
    passkey: 'WG-7821-PASS',
    totalBill: 8000,
    dueAmount: 8000,
    whatsappNumber: '01629559653',
    contactNumber: '01629559653',
    notes: 'শাড়ি ও গিফট কম্বো ই-কমার্স প্রজেক্ট (পেমেন্ট বকেয়া রয়েছে)',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now(),
  },
];

export const getStoredProjects = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    // Remove dummy projects so only real projects remain
    const cleaned = parsed.filter(
      (p) => p.id !== 'wg_stylebd' && p.id !== 'wg_techhub' && p.id !== 'wg_digitalagency'
    );
    if (cleaned.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    return cleaned;
  } catch (e) {
    return INITIAL_PROJECTS;
  }
};

export const saveProjects = (projects) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  // Dispatch custom window event for multi-tab or simulator sync
  window.dispatchEvent(new CustomEvent('webcraft_guard_update', { detail: projects }));
};

export const getAgencySettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_AGENCY_SETTINGS));
      return DEFAULT_AGENCY_SETTINGS;
    }
    return { ...DEFAULT_AGENCY_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_AGENCY_SETTINGS;
  }
};

export const saveAgencySettings = (settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const generatePasskey = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return 'WG-' + rand + '-PASS';
};

export const generateProjectId = (clientName) => {
  const clean = (clientName || 'client')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 15);
  const num = Math.floor(100 + Math.random() * 900);
  return 'wg_' + clean + '_' + num;
};

// ─── Firebase Firestore Cloud Sync ────────────────────────────────────────────
export const syncProjectToCloud = async (project) => {
  try {
    await setDoc(doc(db, 'projects', project.id), project, { merge: true });
  } catch (err) {
    console.warn('Firebase Cloud sync warning (using local fallback):', err.message);
  }
};

export const deleteProjectFromCloud = async (projectId) => {
  try {
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (err) {
    console.warn('Firebase Cloud delete warning:', err.message);
  }
};

export const subscribeToFirebaseProjects = (onRemoteUpdate) => {
  try {
    const projectsCol = collection(db, 'projects');
    return onSnapshot(
      projectsCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteList = [];
          snapshot.forEach((d) => remoteList.push({ id: d.id, ...d.data() }));
          saveProjects(remoteList);
          if (onRemoteUpdate) onRemoteUpdate(remoteList);
        } else {
          // First time seed
          INITIAL_PROJECTS.forEach(async (p) => {
            try {
              await setDoc(doc(db, 'projects', p.id), p);
            } catch (_) {}
          });
        }
      },
      (err) => {
        console.warn('Firebase Realtime listener fallback:', err.message);
      }
    );
  } catch (err) {
    console.warn('Firebase subscription notice:', err);
    return () => {};
  }
};

// ─── Payment Transactions Store ────────────────────────────────────────────────
const PAYMENTS_KEY = 'webcraft_guard_payments_v1';

export const INITIAL_PAYMENTS = [
  {
    id: 'INV-GV-2026',
    projectId: 'wg_giftvibes',
    clientName: 'Gift Vibes E-commerce',
    domain: 'giftvibesbd.com',
    amount: 8000,
    method: 'Pending (বকেয়া)',
    trxId: 'UNPAID',
    status: 'DUE',
    date: Date.now() - 86400000 * 2,
  },
];

export const getStoredPayments = () => {
  try {
    const raw = localStorage.getItem(PAYMENTS_KEY);
    if (!raw) {
      localStorage.setItem(PAYMENTS_KEY, JSON.stringify(INITIAL_PAYMENTS));
      return INITIAL_PAYMENTS;
    }
    const parsed = JSON.parse(raw);
    const cleaned = parsed.filter(
      (p) => p.projectId === 'wg_giftvibes' || !['wg_techhub', 'wg_digitalagency', 'wg_stylebd'].includes(p.projectId)
    );
    if (cleaned.length === 0) {
      localStorage.setItem(PAYMENTS_KEY, JSON.stringify(INITIAL_PAYMENTS));
      return INITIAL_PAYMENTS;
    }
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(cleaned));
    return cleaned;
  } catch (e) {
    return INITIAL_PAYMENTS;
  }
};

export const savePayments = (payments) => {
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
  window.dispatchEvent(new CustomEvent('webcraft_guard_payments_update', { detail: payments }));
};


