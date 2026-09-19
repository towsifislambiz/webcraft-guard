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
    var waUrl = 'https://wa.me/88' + waNum.replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent('হ্যালো WebCraft BD, আমার ওয়েবসাইট (' + (project.domain || project.clientName) + ') সাময়িকভাবে স্থগিত দেখাচ্ছে। আমি বকেয়া বিল পরিশোধ করতে চাই।');

    overlay.innerHTML = 
      '<div style="max-width:540px;width:100%;background:#0c1120;border:1px solid rgba(239,68,68,0.3);border-radius:24px;padding:32px 24px;text-align:center;box-shadow:0 25px 50px -12px rgba(0,0,0,0.8);position:relative;animation:wgFadeIn 0.3s ease;">' +
        '<div style="width:64px;height:64px;background:rgba(239,68,68,0.15);border:2px solid rgba(239,68,68,0.4);border-radius:20px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">' +
          '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>' +
        '</div>' +
        '<div style="display:inline-block;padding:4px 12px;background:rgba(239,68,68,0.15);color:#f87171;font-size:12px;font-weight:700;border-radius:9999px;margin-bottom:12px;text-transform:uppercase;letter-spacing:1px;">' +
          '⚠️ সাসপেনশন নোটিশ' +
        '</div>' +
        '<h2 style="font-size:22px;font-weight:800;color:#fff;margin:0 0 12px;line-height:1.3;">ওয়েবসাইট সাময়িকভাবে স্থগিত রাখা হয়েছে</h2>' +
        '<p style="font-size:14px;color:#94a3b8;line-height:1.6;margin:0 0 20px;">সম্মানিত গ্রাহক, <strong>' + (project.clientName || 'এই প্রজেক্টটির') + '</strong> বিলিং বা ডেভেলপমেন্ট পেমেন্ট বকেয়া রয়েছে। সেবাটি পুনরায় সচল করতে অবিলম্বে এজেন্সির সাথে যোগাযোগ করুন।</p>' +
        
        '<div style="background:#131b30;border:1px solid #1e293b;border-radius:16px;padding:16px;margin-bottom:24px;display:flex;justify-content:space-around;gap:12px;">' +
          '<div><div style="font-size:11px;color:#64748b;font-weight:600;">ডোমেইন</div><div style="font-size:13px;color:#cbd5e1;font-weight:700;">' + (project.domain || 'Unassigned') + '</div></div>' +
          (project.dueAmount ? '<div><div style="font-size:11px;color:#64748b;font-weight:600;">বকেয়া বিল</div><div style="font-size:14px;color:#f87171;font-weight:800;">৳' + Number(project.dueAmount).toLocaleString() + ' BDT</div></div>' : '') +
        '</div>' +

        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:24px;">' +
          '<a href="' + waUrl + '" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;background:#22c55e;color:#000;font-weight:700;font-size:13px;border-radius:12px;text-decoration:none;transition:transform 0.2s;">' +
            '<span>💬 WhatsApp Support</span>' +
          '</a>' +
          '<a href="tel:' + callNum + '" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;background:#1e293b;color:#e2e8f0;font-weight:700;font-size:13px;border-radius:12px;text-decoration:none;border:1px solid #334155;">' +
            '<span>📞 কল করুন</span>' +
          '</a>' +
        '</div>' +

        '<div style="border-top:1px solid #1e293b;padding-top:20px;text-align:left;">' +
          '<label style="display:block;font-size:12px;font-weight:700;color:#94a3b8;margin-bottom:8px;">আনলক পাস-কি প্রদান করুন (Unlock Passkey):</label>' +
          '<div style="display:flex;gap:8px;">' +
            '<input type="password" id="wg-passkey-input" placeholder="যেমন: WG-XXXX-PASS" style="flex:1;padding:12px 14px;background:#070a13;border:1px solid #334155;border-radius:12px;color:#fff;font-size:13px;font-family:monospace;outline:none;" />' +
            '<button id="wg-unlock-btn" style="padding:12px 18px;background:linear-gradient(135deg,#eab308,#ca8a04);color:#000;font-weight:800;font-size:13px;border:none;border-radius:12px;cursor:pointer;">আনলক</button>' +
          '</div>' +
          '<div id="wg-error-msg" style="color:#f87171;font-size:12px;font-weight:600;margin-top:8px;display:none;"></div>' +
        '</div>' +

        '<div style="margin-top:24px;font-size:11px;color:#475569;display:flex;align-items:center;justify-content:center;gap:6px;">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>' +
          '<span>Protected by WebCraft Guard Realtime Engine</span>' +
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
