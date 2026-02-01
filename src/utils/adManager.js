let lastAdTime = 0;
const AD_COOLDOWN = 1200; // India safe

function canOpen() {
  const now = Date.now();
  if (now - lastAdTime < AD_COOLDOWN) return false;
  lastAdTime = now;
  return true;
}

/* ───────── IFRAME BANNER ─────────
   Used in Home, AdGateOverlay, VerifyGate
────────────────────────────────── */
export function openAd(containerId, key, src) {
  if (!containerId) return;
  if (!canOpen()) return;
  if (!key || !src) return;

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const options = document.createElement("script");
  options.innerHTML = `
    atOptions = {
      'key': '${key}',
      'format': 'iframe',
      'height': 250,
      'width': 300,
      'params': {}
    };
  `;

  const invoke = document.createElement("script");
  invoke.src = src;
  invoke.async = true;
  invoke.setAttribute("data-cfasync", "false");

  container.appendChild(options);
  container.appendChild(invoke);
}

/* ───────── DIRECT / SMARTLINK ───────── */
export function openSmartLink() {
  if (!canOpen()) return;
  const link = import.meta.env.VITE_ADSTERRA_DIRECT_LINK;
  if (!link) return;
  window.open(link, "_blank", "noopener,noreferrer");
}

/* ───────── REWARDED (REDIRECT) ───────── */
export function openRewardedAd() {
  if (!canOpen()) return;
  const link = import.meta.env.VITE_ADSTERRA_REWARDED_LINK;
  if (!link) return;
  window.open(link, "_blank", "noopener,noreferrer");
}
