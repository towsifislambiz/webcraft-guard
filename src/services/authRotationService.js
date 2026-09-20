/**
 * WebCraft Guard - Dynamic 1-Hour Auth Rotation Engine
 * Automatically rotates username and password every 1 hour and syncs to Firestore & Telegram.
 */

import { db } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { sendTelegramCredentials, getTelegramConfig } from './telegramService';

const AUTH_STORAGE_KEY = 'webcraft_guard_auth_session';
const SESSION_TIMESTAMP_KEY = 'webcraft_guard_session_time';
const SESSION_VERSION_KEY = 'webcraft_guard_session_version';
const LOCAL_CREDENTIALS_KEY = 'webcraft_guard_rotating_creds_v1';

export const ROTATION_INTERVAL_MS = 60 * 60 * 1000; // 1 Hour in milliseconds
export const FIRESTORE_AUTH_DOC = 'system/admin_auth';

// Helper: Generate secure dynamic password
export const generateDynamicPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const nums = '23456789';
  const symbols = '!@#$*';
  
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += nums.charAt(Math.floor(Math.random() * nums.length));
  }
  const sym = symbols.charAt(Math.floor(Math.random() * symbols.length));
  const char = chars.charAt(Math.floor(Math.random() * chars.length));
  
  return `WG${sym}${rand}${char}`;
};

// Helper: Generate dynamic username
export const generateDynamicUsername = () => {
  const randomNum = Math.floor(10 + Math.random() * 90);
  return `towsif_${randomNum}`;
};

// Default initial state
export const DEFAULT_AUTH_STATE = {
  username: 'towsif_admin',
  password: 'WG#2026!Sec',
  generatedAt: Date.now(),
  expiresAt: Date.now() + ROTATION_INTERVAL_MS,
  version: 1,
};

/**
 * Get current credentials from LocalStorage fallback
 */
export const getLocalCredentials = () => {
  try {
    const raw = localStorage.getItem(LOCAL_CREDENTIALS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_CREDENTIALS_KEY, JSON.stringify(DEFAULT_AUTH_STATE));
      return DEFAULT_AUTH_STATE;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_AUTH_STATE;
  }
};

/**
 * Save credentials to LocalStorage
 */
export const saveLocalCredentials = (creds) => {
  localStorage.setItem(LOCAL_CREDENTIALS_KEY, JSON.stringify(creds));
  window.dispatchEvent(new CustomEvent('webcraft_guard_creds_update', { detail: creds }));
};

/**
 * Fetch current credentials from Firebase Firestore or fallback
 */
export const getActiveCredentials = async () => {
  try {
    const docRef = doc(db, 'system', 'admin_auth');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      saveLocalCredentials(data);
      return data;
    }
  } catch (err) {
    console.warn('[Auth Rotation] Firestore fetch warning:', err.message);
  }
  return getLocalCredentials();
};

/**
 * Rotate credentials and notify Telegram
 * @param {boolean} force - Force rotation immediately regardless of 1-hour timer
 */
export const rotateCredentialsAndNotify = async (force = false) => {
  const current = await getActiveCredentials();
  const now = Date.now();

  // If not forced and current credentials have not expired yet, return current
  if (!force && current.expiresAt && now < current.expiresAt) {
    return { rotated: false, credentials: current };
  }

  // Generate new username and password
  const newUsername = generateDynamicUsername();
  const newPassword = generateDynamicPassword();
  const expiresAt = now + ROTATION_INTERVAL_MS;
  const newVersion = (current.version || 0) + 1;

  const newAuthState = {
    username: newUsername,
    password: newPassword,
    generatedAt: now,
    expiresAt: expiresAt,
    version: newVersion,
  };

  // 1. Save to LocalStorage
  saveLocalCredentials(newAuthState);

  // 2. Save to Firestore Cloud
  try {
    const docRef = doc(db, 'system', 'admin_auth');
    await setDoc(docRef, newAuthState, { merge: true });
  } catch (err) {
    console.warn('[Auth Rotation] Cloud sync warning:', err.message);
  }

  // 3. Dispatch to Telegram Bot
  try {
    await sendTelegramCredentials({
      username: newUsername,
      password: newPassword,
      expiresAt: expiresAt,
      isManual: force,
    });
  } catch (tgErr) {
    console.warn('[Auth Rotation] Telegram dispatch warning:', tgErr.message);
  }

  return { rotated: true, credentials: newAuthState };
};

/**
 * Verify login credentials entered by the user
 */
export const verifyAdminCredentials = async (inputUsername, inputPassword) => {
  const creds = await getActiveCredentials();
  const cleanInputUser = (inputUsername || '').trim().toLowerCase();
  const cleanInputPass = (inputPassword || '').trim();

  const activeUser = (creds.username || '').toLowerCase();
  const activePass = (creds.password || '');

  // Master backup credentials for safety
  const isMasterBackup =
    cleanInputUser === 'towsif' &&
    (cleanInputPass === 'webcraft2026' || cleanInputPass === 'admin123');

  // Check against active dynamic credentials
  const isDynamicMatch =
    (cleanInputUser === activeUser || cleanInputUser === 'towsif' || cleanInputUser === 'admin') &&
    cleanInputPass === activePass;

  if (isDynamicMatch || isMasterBackup) {
    // Record login session time & version
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    localStorage.setItem(SESSION_TIMESTAMP_KEY, String(Date.now()));
    localStorage.setItem(SESSION_VERSION_KEY, String(creds.version || 1));
    return { success: true, credentials: creds };
  }

  return {
    success: false,
    error: 'ভুল ইউজারনেম বা পাসওয়ার্ড! আপনার টেলিগ্রামে পাঠানো সর্বশেষ পাসওয়ার্ড দিয়ে চেষ্টা করুন।',
  };
};

/**
 * Check if the current logged in session has expired (> 1 hour or rotated)
 */
export const checkSessionValidity = (currentAuthVersion = null) => {
  const isAuth = localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  if (!isAuth) return { valid: false, reason: 'NOT_LOGGED_IN' };

  const sessionStartStr = localStorage.getItem(SESSION_TIMESTAMP_KEY);
  const sessionVersionStr = localStorage.getItem(SESSION_VERSION_KEY);

  if (!sessionStartStr) return { valid: false, reason: 'NO_SESSION_TIME' };

  const sessionStart = Number(sessionStartStr);
  const now = Date.now();

  // 1. Check if 1 hour has passed
  if (now - sessionStart >= ROTATION_INTERVAL_MS) {
    clearAuthSession();
    return { valid: false, reason: 'EXPIRED_1_HOUR' };
  }

  // 2. Check if credentials were rotated in Firestore on another device
  if (currentAuthVersion && sessionVersionStr && Number(sessionVersionStr) < currentAuthVersion) {
    clearAuthSession();
    return { valid: false, reason: 'CREDENTIALS_ROTATED' };
  }

  return {
    valid: true,
    remainingMs: Math.max(0, ROTATION_INTERVAL_MS - (now - sessionStart)),
  };
};

/**
 * Clear session and log out
 */
export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(SESSION_TIMESTAMP_KEY);
  localStorage.removeItem(SESSION_VERSION_KEY);
};

/**
 * Real-time listener for Firestore credentials document
 */
export const subscribeToCredentials = (onUpdate) => {
  try {
    const docRef = doc(db, 'system', 'admin_auth');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        saveLocalCredentials(data);
        if (onUpdate) onUpdate(data);
      }
    });
  } catch (e) {
    return () => {};
  }
};
