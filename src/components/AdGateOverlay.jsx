import { useEffect, useRef, useState } from "react";
import { openAd } from "../utils/adManager";
import NativeBanner from "./NativeBanner";

const TOTAL_TIME = 15;

export default function AdGateOverlay({ onComplete, stepProgress, step }) {
  const [remaining, setRemaining] = useState(TOTAL_TIME);

  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(null);
  const rafRef = useRef(null);
  const doneRef = useRef(false);
  const barRef = useRef(null);

  useEffect(() => {
    elapsedRef.current = 0;
    lastTimeRef.current = null;
    doneRef.current = false;

    // TOP banner (iframe banner)
    requestAnimationFrame(() => {
      openAd("adgate-top");
    });

    const tick = (now) => {
      if (doneRef.current) return;

      if (document.visibilityState !== "visible") {
        lastTimeRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (!lastTimeRef.current) {
        lastTimeRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      elapsedRef.current += delta;
      const elapsed = Math.min(elapsedRef.current, TOTAL_TIME);
      const left = Math.max(0, TOTAL_TIME - elapsed);

      setRemaining(Math.ceil(left));

      if (barRef.current) {
        barRef.current.style.width = `${(elapsed / TOTAL_TIME) * 100}%`;
      }

      if (elapsed >= TOTAL_TIME) {
        doneRef.current = true;
        onComplete();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  const skip = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="absolute top-6 left-1/2 -translate-x-1/2">
        <div className="px-4 py-2 rounded-full bg-gray-900/80 border border-gray-700 text-sm font-semibold text-white">
          Step {step} / 4
        </div>
      </div>

      <div className="w-full max-w-md rounded-3xl bg-gray-900/80 border border-gray-700 shadow-2xl p-5">

        {/* TOP BANNER */}
        <div
          id="adgate-top"
          onClick={skip}
          className="h-24 rounded-xl bg-gray-800 mb-4 cursor-pointer flex items-center justify-center text-gray-400 text-sm"
        >
          Advertisement
        </div>

        {/* CENTER */}
        <div className="text-center mb-4">
          <p className="text-yellow-300 font-medium mb-2">
            Click any ad to skip the wait
          </p>

          <div className="text-4xl font-bold text-white mb-2">
            {remaining}s
          </div>

          <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden mb-3">
            <div
              ref={barRef}
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-[width] duration-100 ease-linear"
              style={{ width: "0%" }}
            />
          </div>

          <p className="text-sm text-gray-300">
            Unlock progress: <span className="font-bold">{stepProgress}%</span>
          </p>

          <p className="mt-2 text-xs text-red-400">
            ⚠️ Do not refresh or leave this page
          </p>
        </div>

        {/* BOTTOM NATIVE BANNER */}
        <div onClick={skip}>
          <NativeBanner containerId="native-adgate-bottom" />
        </div>
      </div>
    </div>
  );
}
