let lastAdTime = 0;

export function openAd() {
  const now = Date.now();
  if (now - lastAdTime < 2000) return;

  lastAdTime = now;

  const adLink = import.meta.env.VITE_ADSTERRA_DIRECT_LINK;
  window.open(adLink, "_blank", "noopener,noreferrer");
}
