// frontend/src/components/VerifyGate.jsx
import { useEffect, useRef, useState } from "react";
import { openAd } from "../utils/adManager";

const VERIFY_TIME = 5; // seconds

export default function VerifyGate({ onVerified }) {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(VERIFY_TIME);

  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const elapsedRef = useRef(0);
  const doneRef = useRef(false);

  /* ───── START VERIFY TIMER ───── */
  useEffect(() => {
    if (!started) return;

    // RESET refs
    elapsedRef.current = 0;
    lastTimeRef.current = null;
    doneRef.current = false;
    setTimeLeft(VERIFY_TIME);

    // Load banner ads ONCE
    requestAnimationFrame(() => {
      openAd("verify-ad-top");
      openAd("verify-ad-bottom");
    });

    const tick = (now) => {
      if (doneRef.current) return;

      // Pause timer if tab is inactive
      if (document.visibilityState !== "visible") {
        lastTimeRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      elapsedRef.current += delta;

      const elapsed = Math.min(elapsedRef.current, VERIFY_TIME);
      const remaining = Math.max(0, VERIFY_TIME - elapsed);

      setTimeLeft(Math.ceil(remaining));

      if (elapsed >= VERIFY_TIME) {
        doneRef.current = true;
        onVerified();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [started, onVerified]);

  /* ───── BEFORE VERIFY ───── */
  if (!started) {
    return (
      <button
        onClick={() => setStarted(true)}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-lg"
      >
        Verify to Continue
      </button>
    );
  }

  /* ───── VERIFYING UI ───── */
  return (
    <div className="w-full max-w-md mx-auto text-center space-y-4">

      {/* TOP BANNER */}
      <div
        id="verify-ad-top"
        className="h-20 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 text-sm cursor-pointer"
      >
        Advertisement
      </div>

      {/* TIMER */}
      <div className="text-yellow-300 font-semibold text-lg">
        Verifying… {timeLeft}s
      </div>

      <p className="text-xs text-gray-400">
        Please wait while we verify your access
      </p>

      {/* BOTTOM BANNER */}
      <div
        id="verify-ad-bottom"
        className="h-20 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 text-sm cursor-pointer"
      >
        Advertisement
      </div>
    </div>
  );
}
