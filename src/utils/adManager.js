let lastAdTime = 0;
const AD_COOLDOWN = 1200; // safe for India

function canOpen() {
  const now = Date.now();
  if (now - lastAdTime < AD_COOLDOWN) return false;
  lastAdTime = now;
  return true;
}

/* ─────────────────────────────
   IFRAME / BANNER ADS
   Used by:
   - ForcedAdModal
   - AdGateOverlay
   - VerifyGate
───────────────────────────── */
export function openAd(containerId, position = "top") {
  if (!containerId) return;
  if (!canOpen()) return;

  const key =
    position === "bottom"
      ? import.meta.env.VITE_ADSTERRA_BANNER_BOTTOM_KEY
      : import.meta.env.VITE_ADSTERRA_BANNER_TOP_KEY;

  const src =
    position === "bottom"
      ? import.meta.env.VITE_ADSTERRA_BANNER_BOTTOM_SRC
      : import.meta.env.VITE_ADSTERRA_BANNER_TOP_SRC;

  if (!key || !src) return;

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

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
   DIRECT / SMARTLINK (redirect)
───────────────────────────── */
export function openSmartLink() {
  if (!canOpen()) return;

  const link = import.meta.env.VITE_ADSTERRA_DIRECT_LINK;
  if (!link) return;

  window.open(link, "_blank", "noopener,noreferrer");
}

/* ─────────────────────────────
   REWARDED (redirect)
───────────────────────────── */
export function openRewardedAd() {
  if (!canOpen()) return;

  const link = import.meta.env.VITE_ADSTERRA_REWARDED_LINK;
  if (!link) return;

  window.open(link, "_blank", "noopener,noreferrer");
}
