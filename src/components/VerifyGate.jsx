import { useEffect, useRef, useState } from "react";
import { openAd } from "../utils/adManager";

const VERIFY_TIME = 5;

export default function VerifyGate({ onVerified }) {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(VERIFY_TIME);

  const rafRef = useRef(null);
  const lastRef = useRef(null);
  const elapsedRef = useRef(0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!started) return;

    doneRef.current = false;
    elapsedRef.current = 0;
    lastRef.current = null;
    setTimeLeft(VERIFY_TIME);

    requestAnimationFrame(() => {
      openAd(
        "verify-banner",
        import.meta.env.VITE_ADSTERRA_VERIFY_BANNER_KEY,
        import.meta.env.VITE_ADSTERRA_VERIFY_BANNER_SRC
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

      const left = Math.max(0, VERIFY_TIME - elapsedRef.current);
      setTimeLeft(Math.ceil(left));

      if (elapsedRef.current >= VERIFY_TIME) {
        doneRef.current = true;
        onVerified();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [started, onVerified]);

  if (!started) {
    return (
      <button
        onClick={() => setStarted(true)}
        className="px-10 py-4 rounded-xl bg-purple-600 font-bold text-lg"
      >
        Verify to Continue
      </button>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-4">

      {/* VERIFY BANNER */}
      <div
        id="verify-banner"
        className="h-[250px] rounded-xl bg-gray-800 flex items-center justify-center text-gray-400"
      >
        Advertisement
      </div>

      <div className="text-yellow-300 font-bold text-xl">
        Verifying… {timeLeft}s
      </div>

      <p className="text-xs text-gray-400">
        Please stay on this page
      </p>
    </div>
  );
}
