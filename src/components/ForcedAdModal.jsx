import { useEffect, useRef, useState } from "react";
import { AlertCircle, Clock, X } from "lucide-react";
import { openAd } from "../utils/adManager";

const CLOSE_DELAY = 4; // seconds

export default function ForcedAdModal() {
  const [visible, setVisible] = useState(false);
  const [remaining, setRemaining] = useState(CLOSE_DELAY);
  const [canClose, setCanClose] = useState(false);

  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const elapsedRef = useRef(0);
  const finishedRef = useRef(false);

  useEffect(() => {
    // prevent multiple forced ads per session
    if (sessionStorage.getItem("forced_ad_done")) return;
    sessionStorage.setItem("forced_ad_done", "true");

    // RESET ALL REFS
    elapsedRef.current = 0;
    lastTimeRef.current = null;
    finishedRef.current = false;
    setRemaining(CLOSE_DELAY);
    setCanClose(false);

    document.body.style.overflow = "hidden";
    setVisible(true);

    // load ad once
    requestAnimationFrame(() => {
      openAd("forced-ad-container");
    });

    const tick = (now) => {
      if (finishedRef.current) return;

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

      const elapsed = Math.min(elapsedRef.current, CLOSE_DELAY);
      const left = Math.max(0, CLOSE_DELAY - elapsed);

      setRemaining(Math.ceil(left));

      if (elapsed >= CLOSE_DELAY) {
        finishedRef.current = true;
        setCanClose(true);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!visible) return null;

  const close = () => {
    finishedRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    document.body.style.overflow = "auto";
    setVisible(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center px-4">

      <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="p-5 border-b border-gray-800 flex items-center gap-3">
          <AlertCircle className="text-yellow-400" />
          <div>
            <h2 className="text-lg font-bold text-white">
              Support Our Creators
            </h2>
            <p className="text-sm text-gray-400">
              Please view this short ad
            </p>
          </div>
        </div>

        {/* AD CONTAINER */}
        <div className="p-3">
          <div
            id="forced-ad-container"
            className="w-full h-[280px] bg-black rounded-xl overflow-hidden flex items-center justify-center"
          >
            <span className="text-gray-500 text-sm">
              Advertisement loading…
            </span>
          </div>
        </div>

        {/* TIMER / CLOSE */}
        <div className="p-5 border-t border-gray-800 text-center">
          {!canClose ? (
            <div className="flex items-center justify-center gap-3 text-yellow-300">
              <Clock />
              <span className="text-lg font-bold">
                Ad closes in {remaining}s
              </span>
            </div>
          ) : (
            <button
              onClick={close}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 font-bold active:scale-95 transition"
            >
              <span className="flex items-center justify-center gap-2">
                <X /> Close & Continue
              </span>
            </button>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-5 py-3 bg-gray-950 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">
            Ads help keep premium content free
          </p>
        </div>
      </div>
    </div>
  );
}
