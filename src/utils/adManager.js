let lastAdTime = 0;

/**
 * GLOBAL AD MODE
 * "blank"  → opens new tab
 * "inline" → loads inside container
 * controlled from .env
 */
export const AD_MODE =
  import.meta.env.VITE_AD_MODE || "inline";

function canOpen() {
  const now = Date.now();
  if (now - lastAdTime < 2000) return false;
  lastAdTime = now;
  return true;
}

/* ───── NORMAL / SMARTLINK ADS ───── */
export function openAd(containerId) {
  if (!canOpen()) return;

  const link = import.meta.env.VITE_ADSTERRA_DIRECT_LINK;
  if (!link) return;

  // OPEN IN NEW TAB
  if (AD_MODE === "blank" || !containerId) {
    window.open(link, "_blank", "noopener,noreferrer");
    return;
  }

  // INLINE MODE
  const el = document.getElementById(containerId);
  if (!el) {
    // fallback safety
    window.open(link, "_blank", "noopener,noreferrer");
    return;
  }

  // force reload iframe
  el.innerHTML = "";

  const iframe = document.createElement("iframe");
  iframe.src = link;
  iframe.className = "w-full h-full border-0";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer";
  iframe.sandbox =
    "allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation-by-user-activation";

  el.appendChild(iframe);
}

/* ───── REWARDED / VIDEO ADS ───── */
export function openRewardedAd(containerId) {
  if (!canOpen()) return;

  const link = import.meta.env.VITE_ADSTERRA_REWARDED_LINK;
  if (!link) return;

  if (AD_MODE === "blank" || !containerId) {
    window.open(link, "_blank", "noopener,noreferrer");
    return;
  }

  const el = document.getElementById(containerId);
  if (!el) {
    window.open(link, "_blank", "noopener,noreferrer");
    return;
  }

  el.innerHTML = "";

  const iframe = document.createElement("iframe");
  iframe.src = link;
  iframe.className = "w-full h-full border-0";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer";
  iframe.sandbox =
    "allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation-by-user-activation";

  el.appendChild(iframe);
}
