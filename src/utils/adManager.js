// frontend/src/utils/adManager.js

let lastAdTime = 0;

/**
 * Cooldown tuned for Indian traffic
 */
const AD_COOLDOWN = 1200; // 1.2 seconds

function canOpen() {
  const now = Date.now();
  if (now - lastAdTime < AD_COOLDOWN) return false;
  lastAdTime = now;
  return true;
}

/* ─────────────────────────────
   INLINE / IFRAME BANNER ADS
   Used by:
   - ForcedAdModal
   - AdGateOverlay
   - VerifyGate
───────────────────────────── */
export function openAd(containerId) {
  if (!containerId) return;
  if (!canOpen()) return;

  const key = import.meta.env.VITE_ADSTERRA_GATE_BANNER_KEY;
  const src = import.meta.env.VITE_ADSTERRA_GATE_BANNER_SRC;

  if (!key || !src) return;

  const container = document.getElementById(containerId);
  if (!container) return;

  // Clear previous ad (important)
  container.innerHTML = "";

  // Adsterra expects global atOptions
  const optionsScript = document.createElement("script");
  optionsScript.type = "text/javascript";
  optionsScript.innerHTML = `
    atOptions = {
      'key': '${key}',
      'format': 'iframe',
      'height': 250,
      'width': 300,
      'params': {}
    };
  `;

  const invokeScript = document.createElement("script");
  invokeScript.type = "text/javascript";
  invokeScript.src = src;
  invokeScript.async = true;
  invokeScript.setAttribute("data-cfasync", "false");

  container.appendChild(optionsScript);
  container.appendChild(invokeScript);
}

/* ─────────────────────────────
   SMARTLINK / POP / REDIRECT
   (new tab only)
───────────────────────────── */
export function openSmartLink() {
  if (!canOpen()) return;

  const link = import.meta.env.VITE_ADSTERRA_SMARTLINK;
  if (!link) return;

  window.open(link, "_blank", "noopener,noreferrer");
}

/* ─────────────────────────────
   REWARDED / VIDEO (redirect)
───────────────────────────── */
export function openRewardedAd() {
  if (!canOpen()) return;

  const link = import.meta.env.VITE_ADSTERRA_REWARDED_LINK;
  if (!link) return;

  window.open(link, "_blank", "noopener,noreferrer");
}
