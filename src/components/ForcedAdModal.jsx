import { useEffect, useRef, useState } from "react";
import { openAd } from "../utils/adManager";
import NativeBanner from "./NativeBanner";

const CLOSE_DELAY = 4;

export default function ForcedAdModal() {
  const [visible, setVisible] = useState(false);
  const [remaining, setRemaining] = useState(CLOSE_DELAY);

  const rafRef = useRef(null);
  const lastRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (sessionStorage.getItem("forced_ad_done")) return;
    sessionStorage.setItem("forced_ad_done", "true");

    setVisible(true);
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      openAd(
        "forced-ad-banner",
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

      setRemaining((r) => {
        if (r - delta <= 0) {
          doneRef.current = true;
          return 0;
        }
        return r - delta;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!visible) return null;

  const close = () => {
    doneRef.current = true;
    document.body.style.overflow = "auto";
    setVisible(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md rounded-3xl bg-gray-900 border border-gray-800 p-4">

        {/* BANNER */}
        <div
          id="forced-ad-banner"
          className="h-[250px] bg-gray-800 rounded-xl flex items-center justify-center text-gray-400"
        >
          Advertisement
        </div>

        {/* OPTIONAL NATIVE (won’t duplicate) */}
        <div className="mt-3">
          <NativeBanner />
        </div>

        {remaining > 0 ? (
          <p className="text-center text-yellow-300 font-bold mt-4">
            Ad closes in {Math.ceil(remaining)}s
          </p>
        ) : (
          <button
            onClick={close}
            className="w-full mt-4 py-3 rounded-xl bg-red-600 font-bold"
          >
            Close & Continue
          </button>
        )}
      </div>
    </div>
  );
}
