// frontend/src/utils/adManager.js

let lastAdTime = 0;

/**
 * AD MODE
 * "inline" → banners / native inside page
 * "blank"  → redirect smartlink in new tab
 *
 * Controlled from .env
 */
export const AD_MODE =
  import.meta.env.VITE_AD_MODE || "inline";

/* ─────────────────────────────
   GLOBAL THROTTLE (ANTI-SPAM)
───────────────────────────── */
function canOpen() {
  const now = Date.now();
  if (now - lastAdTime < 2000) return false;
  lastAdTime = now;
  return true;
}

/* ─────────────────────────────
   INLINE ADS (BANNER / NATIVE)
   ❗ Smartlink must NEVER come here
───────────────────────────── */
export function loadInlineAd(containerId, html) {
  if (!containerId) return;

  const el = document.getElementById(containerId);
  if (!el) return;

  // clear previous ad
  el.innerHTML = "";

  // inject ad html safely
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;

  el.appendChild(wrapper);
}

/* ─────────────────────────────
   SMARTLINK / POP / REDIRECT ADS
   ✔ Only opens new tab
   ✔ Fair-use compliant
───────────────────────────── */
export function openSmartLink() {
  if (!canOpen()) return;

  const link = import.meta.env.VITE_ADSTERRA_SMARTLINK;
  if (!link) return;

  window.open(link, "_blank", "noopener,noreferrer");
}

/* ─────────────────────────────
   REWARDED / VIDEO ADS
   ⚠ Adsterra rewarded = redirect based
───────────────────────────── */
export function openRewardedAd() {
  if (!canOpen()) return;

  const link = import.meta.env.VITE_ADSTERRA_REWARDED_LINK;
  if (!link) return;

  window.open(link, "_blank", "noopener,noreferrer");
}
