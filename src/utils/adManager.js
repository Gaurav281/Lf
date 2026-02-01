let lastAdTime = 0;

export function openAd() {
  const now = Date.now();
  if (now - lastAdTime < 2000) return;
  lastAdTime = now;

  const link = import.meta.env.VITE_ADSTERRA_DIRECT_LINK;
  if (link) window.open(link, "_blank", "noopener,noreferrer");
}

export function openRewardedAd() {
  const link = import.meta.env.VITE_ADSTERRA_REWARDED_LINK;
  if (link) window.open(link, "_blank", "noopener,noreferrer");
}
