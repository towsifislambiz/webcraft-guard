/**
 * WebCraft Guard - Telegram Bot Notification Service
 * Sends real-time security alerts and rotating login credentials directly to Telegram.
 */

const TELEGRAM_CONFIG_KEY = 'webcraft_guard_telegram_config_v1';

// Default configuration (can be updated in Settings by the user)
export const DEFAULT_TELEGRAM_CONFIG = {
  botToken: '8744311876:AAGCb-UExwxH71dEM47v2yvavnuFltpfnnQ', // @towsif_guard_alert_bot
  chatId: '',   // e.g. from @userinfobot
  autoRotateEnabled: true,
  rotationIntervalMinutes: 60, // 1 hour
};

export const getTelegramConfig = () => {
  try {
    const raw = localStorage.getItem(TELEGRAM_CONFIG_KEY);
    if (!raw) {
      localStorage.setItem(TELEGRAM_CONFIG_KEY, JSON.stringify(DEFAULT_TELEGRAM_CONFIG));
      return DEFAULT_TELEGRAM_CONFIG;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_TELEGRAM_CONFIG,
      ...parsed,
      botToken: parsed.botToken || DEFAULT_TELEGRAM_CONFIG.botToken,
    };
  } catch (e) {
    return DEFAULT_TELEGRAM_CONFIG;
  }
};

export const saveTelegramConfig = (config) => {
  localStorage.setItem(TELEGRAM_CONFIG_KEY, JSON.stringify(config));
};

/**
 * Send a message via Telegram Bot API
 */
export const sendTelegramMessage = async (messageText, customConfig = null) => {
  const config = customConfig || getTelegramConfig();
  const token = (config.botToken || '').trim();
  const chatId = (config.chatId || '').trim();

  if (!token || !chatId) {
    console.warn('[Telegram Service] Bot Token or Chat ID is not configured.');
    return {
      success: false,
      error: 'টেলিগ্রাম বট টোকেন বা চ্যাট আইডি সেট করা নেই। সেটিংস থেকে কনফিগার করুন।',
    };
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();
    if (data.ok) {
      return { success: true, result: data.result };
    } else {
      return { success: false, error: data.description || 'টেলিগ্রাম মেসেজ পাঠানো ব্যর্থ হয়েছে।' };
    }
  } catch (err) {
    return { success: false, error: err.message || 'নেটওয়ার্ক এরর হয়েছে।' };
  }
};

/**
 * Format and send rotating login credentials to Telegram
 */
export const sendTelegramCredentials = async ({
  username,
  password,
  expiresAt,
  isManual = false,
}) => {
  const formattedTime = new Date().toLocaleTimeString('bn-BD', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const expiryTime = new Date(expiresAt).toLocaleTimeString('bn-BD', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const message = `
🛡️ <b>[WebCraft Guard Security Alert]</b>
━━━━━━━━━━━━━━━━━━━━━
${isManual ? '⚡ <b>অন-ডিমান্ড পাসওয়ার্ড রিকোয়েস্ট</b>' : '🔄 <b>১-ঘণ্টার স্বয়ংক্রিয় ক্রেডেনশিয়াল রোটেশন</b>'}
━━━━━━━━━━━━━━━━━━━━━

আপনার কন্ট্রোল প্যানেলের নতুন লগইন তথ্য:

👤 <b>ইউজারনেম (Username):</b>
<code>${username}</code>

🔑 <b>নতুন পাসওয়ার্ড (Password):</b>
<code>${password}</code>

⏳ <b>মেয়াদ শেষ হবে:</b> ${expiryTime} (ঠিক ১ ঘণ্টা পর)
🕒 <b>তৈরি হয়েছে:</b> ${formattedTime}

⚠️ <i>নিরাপত্তা বিধিনিষেধ: ১ ঘণ্টা পর সকল ডিভাইস থেকে স্বয়ংক্রিয়ভাবে লগআউট হবে এবং পুনরায় নতুন পাসওয়ার্ড জেনারেট হবে। এই তথ্য কাউকে শেয়ার করবেন না।</i>

🌐 <b>কন্ট্রোল প্যানেল:</b> https://webcraft-guard-pro.vercel.app
━━━━━━━━━━━━━━━━━━━━━
© 2026 WebCraft Guard BD
`.trim();

  return await sendTelegramMessage(message);
};

/**
 * Send a test ping to verify Bot Token and Chat ID
 */
export const testTelegramConnection = async (botToken, chatId) => {
  const testMessage = `
✅ <b>[WebCraft Guard] টেস্ট নোটিফিকেশন</b>
━━━━━━━━━━━━━━━━━━━━━
আপনার টেলিগ্রাম বট সফলভাবে WebCraft Guard-এর সাথে কানেক্ট হয়েছে!
এখন থেকে প্রতি ১ ঘণ্টা পর পর নতুন লগইন পাসওয়ার্ড এখানে পাঠানো হবে।

🕒 <b>সময়:</b> ${new Date().toLocaleString('bn-BD')}
`.trim();

  return await sendTelegramMessage(testMessage, { botToken, chatId });
};
