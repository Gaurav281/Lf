import { useEffect, useRef, useState } from "react";
import { openAd } from "../utils/adManager";
import NativeBanner from "./NativeBanner";

const TOTAL_TIME = 15;

export default function AdGateOverlay({ onComplete, step, stepProgress }) {
  const [remaining, setRemaining] = useState(TOTAL_TIME);

  const rafRef = useRef(null);
  const lastRef = useRef(null);
  const elapsedRef = useRef(0);
  const doneRef = useRef(false);

  useEffect(() => {
    doneRef.current = false;
    elapsedRef.current = 0;
    lastRef.current = null;
    setRemaining(TOTAL_TIME);

    // Load top banner
    requestAnimationFrame(() => {
      openAd(
        "adgate-top",
        import.meta.env.VITE_ADSTERRA_GATE_BANNER_KEY,
        import.meta.env.VITE_ADSTERRA_GATE_BANNER_SRC
      );
    });

    const tick = (now) => {
      if (doneRef.current) return;

      if (document.visibilityState !== "visible") {
        lastRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (!lastRef.current) {
        lastRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const delta = (now - lastRef.current) / 1000;
      lastRef.current = now;
      elapsedRef.current += delta;

      const left = Math.max(0, TOTAL_TIME - elapsedRef.current);
      setRemaining(Math.ceil(left));

      if (elapsedRef.current >= TOTAL_TIME) {
        doneRef.current = true;
        onComplete();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  // Skip when user clicks any ad
  const skipNow = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-gray-900/90 border border-gray-700 shadow-2xl p-5">

        {/* STEP */}
        <div className="text-center text-sm text-gray-300 mb-3">
          Step {step} / 4 · Progress {stepProgress}%
        </div>

        {/* TOP BANNER */}
        <div
          id="adgate-top"
          onClick={skipNow}
          className="h-[250px] rounded-xl bg-gray-800 mb-4 cursor-pointer flex items-center justify-center text-gray-400 text-sm"
        >
          Advertisement
        </div>

        {/* TIMER */}
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-2">
            {remaining}s
          </div>
          <p className="text-yellow-300 text-sm mb-3">
            Click any ad to continue instantly
          </p>
        </div>

        {/* NATIVE BOTTOM */}
        <div onClick={skipNow}>
          <NativeBanner />
        </div>

        <p className="mt-3 text-xs text-red-400 text-center">
          ⚠ Do not refresh or leave this page
        </p>
      </div>
    </div>
  );
}
