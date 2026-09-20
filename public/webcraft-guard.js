/**
 * WebCraft Guard - Client Anti-Theft & Remote License Kill-Switch
 * (C) 2026 WebCraft BD. All rights reserved.
 * 
 * Embed anywhere with:
 * <script src="https://license.webcraftbd.com/webcraft-guard.js" data-project="wg_giftvibes"></script>
 */
(function () {
  'use strict';

  // Extract config from script tag
  var currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var projectId = currentScript ? currentScript.getAttribute('data-project') : null;
  if (!projectId) return;

  var bypassKey = 'wg_unlocked_' + projectId;
  if (localStorage.getItem(bypassKey) === 'true') {
    // Already unlocked permanently with passkey
    return;
  }

  var FIRESTORE_URL = 'https://firestore.googleapis.com/v1/projects/webcraft-guard--master/databases/(default)/documents/projects/' + projectId;

  // Check project status (Firestore Cloud Sync with LocalStorage Fallback)
  function checkStatus() {
    // 1. Primary: Real-time Cloud fetch from Firebase Firestore
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', FIRESTORE_URL, true);
      xhr.setRequestHeader('Cache-Control', 'no-cache');
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            var doc = JSON.parse(xhr.responseText);
            var f = doc.fields || {};
            var remoteProject = {
              id: projectId,
              status: f.status && f.status.stringValue ? f.status.stringValue : 'ACTIVE',
              clientName: f.clientName && f.clientName.stringValue ? f.clientName.stringValue : '',
              domain: f.domain && f.domain.stringValue ? f.domain.stringValue : '',
              dueAmount: f.dueAmount && (f.dueAmount.integerValue || f.dueAmount.stringValue) ? (f.dueAmount.integerValue || f.dueAmount.stringValue) : 0,
              passkey: f.passkey && f.passkey.stringValue ? f.passkey.stringValue : '',
              whatsappNumber: f.whatsappNumber && f.whatsappNumber.stringValue ? f.whatsappNumber.stringValue : '01629559653',
              contactNumber: f.contactNumber && f.contactNumber.stringValue ? f.contactNumber.stringValue : '01629559653'
            };

            if (remoteProject.status === 'LOCKED') {
              renderLockScreen(remoteProject);
            } else {
              removeLockScreen();
            }
          } catch (parseErr) {}
        }
      };
      xhr.send();
    } catch (e) {}

    // 2. Fallback: LocalStorage check
    try {
      var raw = localStorage.getItem('webcraft_guard_projects_v1');
      if (raw) {
        var projects = JSON.parse(raw);
        var match = projects.find(function(p) { return p.id === projectId; });
        if (match) {
          if (match.status === 'LOCKED') {
            renderLockScreen(match);
          } else {
            removeLockScreen();
          }
        }
      }
    } catch (e) {}
  }

  function renderLockScreen(project) {
    if (document.getElementById('webcraft-lock-overlay')) return;

    var overlay = document.createElement('div');
    overlay.id = 'webcraft-lock-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999999999;background:rgba(5,8,16,0.95);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,sans-serif;color:#fff;overflow-y:auto;';

    var waNum = project.whatsappNumber || '01629559653';
    var callNum = project.contactNumber || '01629559653';
    var waUrl = 'https://wa.me/88' + waNum.replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent('হ্যালো WebCraft BD, আমি ' + (project.clientName || 'Gift Vibes E-commerce') + ' ওয়েবসাইটের বকেয়া বিল ৳' + (project.dueAmount || '8000') + ' টাকা পরিশোধ করে সাইটটি চালু করতে চাই। পেমেন্ট নাম্বার দিন।');

    overlay.innerHTML = 
      '<div style="max-width:560px;width:100%;background:#0a0f1d;border:1px solid rgba(244,63,94,0.5);border-radius:28px;padding:36px 28px;text-align:center;box-shadow:0 0 80px rgba(244,63,94,0.3);position:relative;animation:wgFadeIn 0.3s ease;font-family:system-ui,-apple-system,sans-serif;">' +
        '<div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,transparent,#f43f5e,transparent);box-shadow:0 0 15px #f43f5e;"></div>' +
        '<div style="width:68px;height:68px;background:rgba(244,63,94,0.15);border:2px solid rgba(244,63,94,0.5);border-radius:24px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;box-shadow:0 10px 25px rgba(244,63,94,0.2);">' +
          '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>' +
        '</div>' +
        '<div style="display:inline-block;padding:6px 16px;background:rgba(244,63,94,0.15);color:#fda4af;font-size:11px;font-weight:800;border-radius:9999px;margin-bottom:14px;text-transform:uppercase;letter-spacing:1px;border:1px solid rgba(244,63,94,0.3);">' +
          '⚠️ লাইসেন্স স্থগিতাদেশ • সার্ভিস সাময়িক বন্ধ' +
        '</div>' +
        '<h2 style="font-size:22px;font-weight:900;color:#fff;margin:0 0 12px;line-height:1.35;letter-spacing:-0.5px;">ওয়েবসাইট চালু করতে আগে বকেয়া পেমেন্ট সম্পূর্ণ পরিশোধ করুন</h2>' +
        '<p style="font-size:13px;color:#cbd5e1;line-height:1.65;margin:0 0 22px;">সম্মানিত গ্রাহক, চুক্তিনুযায়ী <strong>' + (project.clientName || 'Gift Vibes E-commerce') + '</strong> ওয়েবসাইটের ডেভেলপমেন্ট বিল এখনো বকেয়া রয়েছে। বকেয়া বিল সম্পূর্ণ পরিশোধ না করা পর্যন্ত এজেন্সির সেন্ট্রাল সার্ভার থেকে এই ওয়েবসাইটটির সকল লাইসেন্স ও অনলাইন সার্ভিস বন্ধ থাকবে।</p>' +
        
        '<div style="background:#050813;border:1px solid rgba(244,63,94,0.3);border-radius:18px;padding:18px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;text-align:left;">' +
          '<div>' +
            '<div style="font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;">মোট বকেয়া বিল (Due Amount)</div>' +
            '<div style="font-size:24px;color:#f43f5e;font-weight:900;font-family:monospace;text-shadow:0 0 10px rgba(244,63,94,0.5);">৳' + (project.dueAmount ? Number(project.dueAmount).toLocaleString() : '8,000') + ' <span style="font-size:13px;color:#fda4af;font-weight:normal;">BDT</span></div>' +
          '</div>' +
          '<div style="text-align:right;">' +
            '<div style="font-size:11px;color:#94a3b8;font-weight:600;">পেমেন্ট মেথড:</div>' +
            '<div style="font-size:12px;color:#e2e8f0;font-weight:700;margin-top:2px;">বিকাশ / নগদ / ব্যাংক</div>' +
          '</div>' +
        '</div>' +

        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">' +
          '<a href="' + waUrl + '" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;background:linear-gradient(135deg,#10b981,#059669);color:#000;font-weight:900;font-size:13px;border-radius:14px;text-decoration:none;box-shadow:0 8px 20px rgba(16,185,129,0.3);">' +
            '<span>💬 WhatsApp Support</span>' +
          '</a>' +
          '<a href="tel:' + callNum + '" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;background:#1e293b;color:#fff;font-weight:800;font-size:13px;border-radius:14px;text-decoration:none;border:1px solid #334155;">' +
            '<span>📞 কল: ' + callNum + '</span>' +
          '</a>' +
        '</div>' +

        '<div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:20px;text-align:left;">' +
          '<label style="display:block;font-size:11px;font-weight:700;color:#94a3b8;margin-bottom:8px;">মাস্টার আনলক পাস-কি (Master Key):</label>' +
          '<div style="display:flex;gap:8px;">' +
            '<input type="password" id="wg-passkey-input" placeholder="যেমন: WG-XXXX-PASS" style="flex:1;padding:12px 14px;background:#050813;border:1px solid #334155;border-radius:12px;color:#fff;font-size:13px;font-family:monospace;outline:none;" />' +
            '<button id="wg-unlock-btn" style="padding:12px 20px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;font-weight:900;font-size:13px;border:none;border-radius:12px;cursor:pointer;">আনলক</button>' +
          '</div>' +
          '<div id="wg-error-msg" style="color:#f87171;font-size:12px;font-weight:600;margin-top:8px;display:none;"></div>' +
        '</div>' +

        '<div style="margin-top:24px;font-size:11px;color:#475569;display:flex;align-items:center;justify-content:center;gap:6px;">' +
          '<span>WebCraft Guard BD • Remote Anti-Theft & Kill-Switch System</span>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';

    // Hook unlock button
    var unlockBtn = document.getElementById('wg-unlock-btn');
    var passInput = document.getElementById('wg-passkey-input');
    var errorMsg = document.getElementById('wg-error-msg');

    if (unlockBtn && passInput) {
      unlockBtn.onclick = function() {
        var entered = passInput.value.trim();
        if (!entered) return;

        if (entered === project.passkey) {
          localStorage.setItem(bypassKey, 'true');
          removeLockScreen();
          alert('অভিনন্দন! ওয়েবসাইটটি সফলভাবে আনলক করা হয়েছে।');
        } else {
          errorMsg.innerText = 'পাস-কি সঠিক নয়। এজেন্সির সাথে যোগাযোগ করুন।';
          errorMsg.style.display = 'block';
          passInput.style.borderColor = '#ef4444';
        }
      };

      passInput.onkeydown = function(e) {
        if (e.key === 'Enter') unlockBtn.click();
      };
    }
  }

  function removeLockScreen() {
    var existing = document.getElementById('webcraft-lock-overlay');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
      document.body.style.overflow = '';
    }
  }

  // Initial check
  checkStatus();

  // Realtime listeners
  window.addEventListener('webcraft_guard_update', checkStatus);
  window.addEventListener('storage', checkStatus);
  setInterval(checkStatus, 3000);
})();
