/**
 * WebCraft Guard - 24/7 Automated Hourly Credential Rotator
 * Can be run via Cron, GitHub Actions, or local background task.
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');
const https = require('https');

const firebaseConfig = {
  apiKey: 'AIzaSyDlME0mBBDMt0QVfvEMle6mMOBNpCXx78A',
  authDomain: 'webcraft-guard--master.firebaseapp.com',
  projectId: 'webcraft-guard--master',
  storageBucket: 'webcraft-guard--master.firebasestorage.app',
  messagingSenderId: '549584792270',
  appId: '1:549584792270:web:15a857d16bdb4c7d9cfe9f'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BOT_TOKEN = '8744311876:AAGCb-UExwxH71dEM47v2yvavnuFltpfnnQ';
const CHAT_ID = '8115654358';
const ROTATION_INTERVAL_MS = 60 * 60 * 1000; // 1 Hour

function generateDynamicPassword() {
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
}

function generateDynamicUsername() {
  const randomNum = Math.floor(10 + Math.random() * 90);
  return `towsif_${randomNum}`;
}

function sendTelegramMessage(text) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });

    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ ok: false, error: e.message });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(data);
    req.end();
  });
}

async function runRotation(force = false) {
  console.log(`[${new Date().toISOString()}] Checking credential expiry...`);
  
  const docRef = doc(db, 'agency_settings', 'admin_auth');
  const snap = await getDoc(docRef);
  const current = snap.exists() ? snap.data() : {};
  const now = Date.now();

  const isExpired = !current.expiresAt || now >= current.expiresAt;

  if (!force && !isExpired) {
    const remainingMins = Math.round((current.expiresAt - now) / 60000);
    console.log(`Credentials still valid for ${remainingMins} minutes. (expiresAt: ${new Date(current.expiresAt).toLocaleTimeString()}). No rotation needed.`);
    return { rotated: false, current };
  }

  const newUsername = generateDynamicUsername();
  const newPassword = generateDynamicPassword();
  const newExpiresAt = now + ROTATION_INTERVAL_MS;
  const newVersion = (current.version || 0) + 1;

  const newAuthState = {
    username: newUsername,
    password: newPassword,
    generatedAt: now,
    expiresAt: newExpiresAt,
    version: newVersion
  };

  // 1. Write to Firestore
  await setDoc(docRef, newAuthState, { merge: true });
  console.log(`Updated Firestore with version ${newVersion}: ${newUsername} / ${newPassword}`);

  // 2. Dispatch to Telegram
  const formattedTime = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const expiryTime = new Date(newExpiresAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  const message = [
    '🛡️ <b>[WebCraft Guard Security Alert]</b>',
    '━━━━━━━━━━━━━━━━━━━━━',
    '🔄 <b>১-ঘণ্টার স্বয়ংক্রিয় ক্রেডেনশিয়াল রোটেশন</b>',
    '━━━━━━━━━━━━━━━━━━━━━',
    '',
    'আপনার কন্ট্রোল প্যানেলের নতুন লগইন তথ্য:',
    '',
    '👤 <b>ইউজারনেম (Username):</b>',
    `<code>${newUsername}</code>`,
    '',
    '🔑 <b>নতুন পাসওয়ার্ড (Password):</b>',
    `<code>${newPassword}</code>`,
    '',
    `⏳ <b>মেয়াদ শেষ হবে:</b> ${expiryTime} (ঠিক ১ ঘণ্টা পর)`,
    `🕒 <b>তৈরি হয়েছে:</b> ${formattedTime}`,
    '',
    '⚠️ <i>নিরাপত্তা বিধিনিষেধ: ১ ঘণ্টা পর সকল ডিভাইস থেকে স্বয়ংক্রিয়ভাবে লগআউট হবে এবং পুনরায় নতুন পাসওয়ার্ড তৈরি হবে। এই তথ্য কাউকে শেয়ার করবেন না।</i>',
    '━━━━━━━━━━━━━━━━━━━━━',
    '🌐 <b>কন্ট্রোল প্যানেল:</b> https://webcraft-guard.vercel.app',
    '© 2026 WebCraft Guard BD'
  ].join('\n');

  const tgRes = await sendTelegramMessage(message);
  console.log('Telegram delivery response:', tgRes.ok ? 'SUCCESS' : tgRes);

  return { rotated: true, credentials: newAuthState };
}

// If run directly from command line
if (require.main === module) {
  const force = process.argv.includes('--force');
  runRotation(force)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Rotation error:', err);
      process.exit(1);
    });
}

module.exports = { runRotation };
