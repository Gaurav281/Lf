import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import AdGateOverlay from "../components/AdGateOverlay";
import VerifyGate from "../components/VerifyGate";
import AdButton from "../components/AdButton";
import { openRewardedAd } from "../utils/adManager";

const API = import.meta.env.VITE_API_URL;
const TOTAL_STEPS = 4;
const VERIFY_TIME = 5;

export default function Unlock() {
  const { slug } = useParams();
  const [sessionId] = useState(() => crypto.randomUUID());

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1);

  const [showGate, setShowGate] = useState(true);
  const [verified, setVerified] = useState(false);
  const [canContinue, setCanContinue] = useState(false);
  const [rewardedShown, setRewardedShown] = useState(false);

  /* INIT */
  useEffect(() => {
    Promise.all([
      fetch(`${API}/unlock/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, productId: slug })
      }),
      fetch(`${API}/products/${slug}`)
    ])
      .then(async ([u, p]) => {
        const unlock = await u.json();
        const prod = await p.json();

        const prog = unlock.progress || 0;
        setProgress(prog);
        setStep(Math.floor(prog / 25) + 1);
        setProduct(prod);
        setLoading(false);
      });
  }, [slug, sessionId]);

  /* SCROLL LOGIC */
  useEffect(() => {
    if (!verified) return;

    const check = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;

      if (max <= 50) {
        setCanContinue(true);
        return;
      }

      const ratio = window.scrollY / max;

      if (ratio >= 0.5 && !rewardedShown && step % 2 === 1) {
        openRewardedAd();
        setRewardedShown(true);
      }

      if (ratio >= 0.9) setCanContinue(true);
    };

    check();
    window.addEventListener("scroll", check);
    window.addEventListener("resize", check);

    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [verified, rewardedShown, step]);

  /* NEXT STEP */
  const nextStep = async () => {
    const res = await fetch(`${API}/unlock/next`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, productId: slug })
    });

    const data = await res.json();
    setProgress(data.progress);
    setStep(s => s + 1);

    setShowGate(true);
    setVerified(false);
    setCanContinue(false);
    setRewardedShown(false);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* FINAL */
  if (!loading && progress >= 100) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <button
          onClick={async () => {
            const res = await fetch(`${API}/products/${slug}/telegram`);
            const data = await res.json();
            window.open(data.telegramLink, "_blank");
          }}
          className="px-8 py-4 bg-green-600 rounded-xl font-bold"
        >
          Join Telegram
        </button>
      </div>
    );
  }

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Preparing unlock…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 pb-32">

      {/* STEP INDICATOR */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-1 rounded-full bg-gray-800 text-sm">
        Step {step} / {TOTAL_STEPS}
      </div>

      {/* AD GATE */}
      {showGate && (
        <AdGateOverlay
          step={step}
          stepProgress={progress}
          onComplete={() => setShowGate(false)}
        />
      )}

      {/* VERIFY GATE */}
      {!showGate && !verified && (
        <div className="min-h-screen flex items-center justify-center">
          <VerifyGate onVerified={() => setVerified(true)} />
        </div>
      )}

      {/* BLOG */}
      {verified && (
        <div className="max-w-3xl mx-auto pt-24">
          <h1 className="text-3xl font-bold mb-4">
            {product.title}
          </h1>

          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: product.blog }}
          />

          {!canContinue && (
            <p className="text-center text-gray-400 mt-8">
              Scroll to continue
            </p>
          )}

          {canContinue && (
            <div className="flex justify-center mt-12">
              <AdButton onClick={nextStep}>
                Continue to Next Step
              </AdButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
