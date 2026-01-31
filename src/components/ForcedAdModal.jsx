import { useEffect, useState } from "react";
import { X, AlertCircle, Clock } from "lucide-react";

const CLOSE_DELAY = 4;

export default function ForcedAdModal() {
  const [visible, setVisible] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(CLOSE_DELAY);
  const [canClose, setCanClose] = useState(false);

  const popupKey = import.meta.env.VITE_ADSTERRA_POPUP_KEY;
  const popupSrc = import.meta.env.VITE_ADSTERRA_POPUP_SRC;

  useEffect(() => {
    if (sessionStorage.getItem("forced_ad_shown")) return;

    sessionStorage.setItem("forced_ad_shown", "true");
    document.body.style.overflow = "hidden";
    setVisible(true);

    const endTime = Date.now() + CLOSE_DELAY * 1000;

    const tick = () => {
      const remaining = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
      );

      setSecondsLeft(remaining);

      if (remaining <= 0) {
        setCanClose(true);
        return;
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center gap-3">
          <AlertCircle className="text-yellow-400" />
          <div>
            <h2 className="text-lg font-bold text-white">
              Support Our Creators
            </h2>
            <p className="text-sm text-gray-400">
              Quick ad to keep content free
            </p>
          </div>
        </div>

        {/* Ad */}
        <div className="p-3">
          <div
            id="adsterra-popup"
            className="w-full h-[280px] bg-black rounded-xl overflow-hidden"
            dangerouslySetInnerHTML={{
              __html: `
                <script>
                  atOptions = {
                    'key': '${popupKey}',
                    'format': 'iframe',
                    'height': 280,
                    'width': 300,
                    'params': {}
                  };
                </script>
                <script src="${popupSrc}"></script>
              `
            }}
          />
        </div>

        {/* Timer / Close */}
        <div className="p-5 border-t border-gray-800 text-center">
          {!canClose ? (
            <div className="flex items-center justify-center gap-3 text-yellow-300">
              <Clock />
              <span className="text-lg font-bold">
                Ad closes in {secondsLeft}s
              </span>
            </div>
          ) : (
            <button
              onClick={() => {
                setVisible(false);
                document.body.style.overflow = "auto";
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 font-bold"
            >
              <span className="flex items-center justify-center gap-2">
                <X /> Close & Continue
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
