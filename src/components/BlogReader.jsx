import { useEffect, useRef, useState } from "react";
import { openRewardedAd } from "../utils/adManager";

export default function BlogReader({ html, step, onComplete }) {
  const ref = useRef(null);
  const [rewardShown, setRewardShown] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const percent =
        el.scrollTop / (el.scrollHeight - el.clientHeight);

      // Rewarded ad on odd steps after 50%
      if (!rewardShown && step % 2 === 1 && percent > 0.5) {
        openRewardedAd();
        setRewardShown(true);
      }

      // Complete after full scroll
      if (percent > 0.98 && !done) {
        setDone(true);
        onComplete();
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [step]);

  return (
    <div
      ref={ref}
      className="h-64 overflow-y-auto rounded-xl bg-gray-800/60 border border-gray-700 p-4 text-sm text-gray-200"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
