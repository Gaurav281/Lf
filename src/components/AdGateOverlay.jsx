import { useEffect, useRef, useState } from "react";

const TOTAL_TIME = 15;

export default function AdGateOverlay({ onComplete, stepProgress }) {
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
          elapsedRef.current += (now - lastFrameRef.current) / 1000;
        }

        const left = Math.max(
          0,
          Math.ceil(TOTAL_TIME - elapsedRef.current)
        );
        setRemaining(left);

        if (left <= 0) {
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
      <div className="w-full max-w-md bg-gray-900/80 border border-gray-700 rounded-3xl p-5">

        {/* Top Banner */}
        <div
          onClick={skip}
          className="mb-4 rounded-xl overflow-hidden cursor-pointer"
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

        {/* Center */}
        <div className="text-center mb-4">
          <p className="text-yellow-300 font-medium">
            Click any ad to skip the wait
          </p>

          <div className="text-4xl font-bold text-white my-2">
            {remaining}s
          </div>

          <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              style={{ width: `${timerProgress}%` }}
            />
          </div>

          <p className="text-sm text-gray-300">
            Unlock progress: <b>{stepProgress}%</b>
          </p>

          <p className="text-xs text-red-400 mt-1">
            ⚠️ Do not refresh the page or you will lose progress
          </p>
        </div>

        {/* Bottom Banner */}
        <div
          onClick={skip}
          className="rounded-xl overflow-hidden cursor-pointer"
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
