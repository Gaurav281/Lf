import { useEffect, useRef, useState } from "react";

const TOTAL_TIME = 15; // seconds

export default function AdGateOverlay({ onComplete, stepProgress , step}) {
  const [remaining, setRemaining] = useState(TOTAL_TIME);

  const lastFrameRef = useRef(null);
  const elapsedRef = useRef(0);
  const rafRef = useRef(null);

  const topKey = import.meta.env.VITE_ADSTERRA_BANNER_TOP_KEY;
  const topSrc = import.meta.env.VITE_ADSTERRA_BANNER_TOP_SRC;

  const bottomKey = import.meta.env.VITE_ADSTERRA_BANNER_BOTTOM_KEY;
  const bottomSrc = import.meta.env.VITE_ADSTERRA_BANNER_BOTTOM_SRC;

  useEffect(() => {
    const tick = (now) => {
      if (document.visibilityState === "visible") {
        if (lastFrameRef.current != null) {
          const delta = (now - lastFrameRef.current) / 1000;
          elapsedRef.current += delta;
        }

        const timeLeft = Math.max(
          0,
          Math.ceil(TOTAL_TIME - elapsedRef.current)
        );
        setRemaining(timeLeft);

        if (timeLeft <= 0) {
          onComplete();
          return;
        }
      }

      lastFrameRef.current = now;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  const skip = () => onComplete();

  const timerProgress =
    ((TOTAL_TIME - remaining) / TOTAL_TIME) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      {/* STEP COUNT */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="px-4 py-2 rounded-full bg-gray-900/80 border border-gray-700 text-sm font-semibold text-white">
          Step {step} / 4
        </div>
      </div>
      <div className="w-full max-w-md rounded-3xl bg-gray-900/80 border border-gray-700 shadow-2xl p-5">

        {/* ───── TOP AD ───── */}
        <div
          onClick={skip}
          className="h-24 rounded-xl bg-gray-800 mb-4 flex items-center justify-center text-gray-400 text-sm cursor-pointer overflow-hidden"
          dangerouslySetInnerHTML={{
            __html: `
              <script>
                atOptions = {
                  'key': '${topKey}',
                  'format': 'iframe',
                  'height': 250,
                  'width': 300,
                  'params': {}
                };
              </script>
              <script src="${topSrc}"></script>
            `
          }}
        />

        {/* ───── CENTER INFO ───── */}
        <div className="text-center mb-4">
          <p className="text-yellow-300 font-medium mb-2">
            Click any ad to skip the wait
          </p>

          <div className="text-4xl font-bold text-white mb-2">
            {remaining}s
          </div>

          {/* Timer progress */}
          <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
              style={{ width: `${timerProgress}%` }}
            />
          </div>

          {/* Unlock progress */}
          <p className="text-sm text-gray-300">
            Unlock progress:{" "}
            <span className="font-bold text-white">
              {stepProgress}%
            </span>
          </p>

          <p className="mt-2 text-xs text-red-400">
            ⚠️ Do not refresh the page or you will lose your progress
          </p>
        </div>

        {/* ───── BOTTOM AD ───── */}
        <div
          onClick={skip}
          className="h-24 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 text-sm cursor-pointer overflow-hidden"
          dangerouslySetInnerHTML={{
            __html: `
              <script>
                atOptions = {
                  'key': '${bottomKey}',
                  'format': 'iframe',
                  'height': 250,
                  'width': 300,
                  'params': {}
                };
              </script>
              <script src="${bottomSrc}"></script>
            `
          }}
        />
      </div>
    </div>
  );
}
