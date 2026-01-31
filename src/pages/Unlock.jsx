import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AdButton from "../components/AdButton";
import AdGateOverlay from "../components/AdGateOverlay";

const API = import.meta.env.VITE_API_URL; // 🔁 change in production

export default function Unlock() {
  const { slug } = useParams();

  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [showGate, setShowGate] = useState(true);

  /* ───── START SESSION ───── */
  useEffect(() => {
    const startSession = async () => {
      const res = await fetch(`${API}/unlock/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          productId: slug
        })
      });

      const data = await res.json();
      setProgress(data.progress || 0);
      setLoading(false);
      setShowGate(true);
    };

    startSession();
  }, [slug, sessionId]);

  /* ───── NEXT STEP ───── */
  const nextStep = async () => {
    const res = await fetch(`${API}/unlock/next`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        productId: slug
      })
    });

    const data = await res.json();
    setProgress(data.progress);
    setShowGate(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Preparing unlock…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white flex items-center justify-center px-4">

      {/* ───── AD GATE ───── */}
      {showGate && progress < 100 && (
        <AdGateOverlay
          onComplete={() => setShowGate(false)}
          stepProgress={progress}
        />
      )}

      {/* ───── MAIN CARD ───── */}
      <div className="w-full max-w-md rounded-3xl bg-gray-900/70 border border-gray-700 shadow-2xl p-8 text-center">

        <h1 className="text-2xl font-bold mb-2">
          Unlock Product Access
        </h1>

        <p className="text-gray-400 text-sm mb-6">
          Complete all steps to reveal the Telegram link
        </p>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span className="font-bold">{progress}%</span>
          </div>

          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Action */}
        {progress < 100 && !showGate && (
          <AdButton
            onClick={nextStep}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 font-bold text-lg"
          >
            Continue ({progress}%)
          </AdButton>
        )}

        {progress >= 100 && (
          <button
            onClick={async () => {
              const res = await fetch(
                `${API}/products/${slug}/telegram`
              );
              const data = await res.json();
              window.open(data.telegramLink, "_blank");
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 font-bold text-lg"
          >
            Join Telegram
          </button>
        )}
      </div>
    </div>
  );
}
