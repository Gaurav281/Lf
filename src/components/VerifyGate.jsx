// frontend/src/components/VerifyGate.jsx
import { useEffect, useRef, useState } from "react";
import NativeBanner from "./NativeBanner";

const VERIFY_TIME = 15; // seconds

export default function VerifyGate({ onVerified }) {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(VERIFY_TIME);

  const rafRef = useRef(null);
  const startRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!started) return;

    startRef.current = null;
    doneRef.current = false;
    setTimeLeft(VERIFY_TIME);

    const tick = (now) => {
      if (doneRef.current) return;

      if (document.visibilityState !== "visible") {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (!startRef.current) startRef.current = now;

      const elapsed = (now - startRef.current) / 1000;
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
    return () => cancelAnimationFrame(rafRef.current);
  }, [started, onVerified]);

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

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-4">

      {/* TOP IFRAME BANNER */}
      <div className="h-[250px] w-full rounded-xl overflow-hidden bg-gray-800">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              atOptions = {
                'key': '${import.meta.env.VITE_ADSTERRA_BANNER_TOP_KEY}',
                'format': 'iframe',
                'height': 250,
                'width': 300,
                'params': {}
              };
            `
          }}
        />
        <script src={import.meta.env.VITE_ADSTERRA_BANNER_TOP_SRC} />
      </div>

      {/* TIMER */}
      <div className="text-yellow-300 font-bold text-xl">
        Verifying… {timeLeft}s
      </div>

      <p className="text-xs text-gray-400">
        Please stay on this page
      </p>

      {/* BOTTOM NATIVE BANNER */}
      <NativeBanner containerId="verify-native-bottom" />
    </div>
  );
}
