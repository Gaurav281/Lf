import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import AdButton from "../components/AdButton";
import AdGateOverlay from "../components/AdGateOverlay";
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

  /* ───── STEP STATES ───── */
  const [showGate, setShowGate] = useState(true);

  const [verifyStarted, setVerifyStarted] = useState(false);
  const [verifyDone, setVerifyDone] = useState(false);
  const [verifyTime, setVerifyTime] = useState(VERIFY_TIME);

  const [canContinue, setCanContinue] = useState(false);
  const [rewardedShown, setRewardedShown] = useState(false);

  const rafVerifyRef = useRef(null);
  const verifyLastRef = useRef(null);
  const verifyElapsedRef = useRef(0);
  const verifyDoneRef = useRef(false);

  /* ───── INIT ───── */
  useEffect(() => {
    const init = async () => {
      const [unlockRes, productRes] = await Promise.all([
        fetch(`${API}/unlock/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, productId: slug })
        }),
        fetch(`${API}/products/${slug}`)
      ]);

      const unlockData = await unlockRes.json();
      const productData = await productRes.json();

      const currentProgress = unlockData.progress || 0;
      const currentStep = Math.floor(currentProgress / 25) + 1;

      setProgress(currentProgress);
      setStep(currentStep);
      setProduct(productData);
      setLoading(false);
      setShowGate(true);
    };

    init();
  }, [slug, sessionId]);

  /* ───── VERIFY TIMER (RAF – SAFE) ───── */
  const startVerify = () => {
    cancelAnimationFrame(rafVerifyRef.current);

    verifyElapsedRef.current = 0;
    verifyLastRef.current = null;
    verifyDoneRef.current = false;

    setVerifyStarted(true);
    setVerifyDone(false);
    setVerifyTime(VERIFY_TIME);

    const tick = (now) => {
      if (verifyDoneRef.current) return;

      if (document.visibilityState !== "visible") {
        verifyLastRef.current = now;
        rafVerifyRef.current = requestAnimationFrame(tick);
        return;
      }

      if (!verifyLastRef.current) {
        verifyLastRef.current = now;
        rafVerifyRef.current = requestAnimationFrame(tick);
        return;
      }

      const delta = (now - verifyLastRef.current) / 1000;
      verifyLastRef.current = now;
      verifyElapsedRef.current += delta;

      const elapsed = Math.min(verifyElapsedRef.current, VERIFY_TIME);
      const remaining = Math.max(0, VERIFY_TIME - elapsed);

      setVerifyTime(Math.ceil(remaining));

      if (elapsed >= VERIFY_TIME) {
        verifyDoneRef.current = true;
        setVerifyStarted(false);
        setVerifyDone(true);
        return;
      }

      rafVerifyRef.current = requestAnimationFrame(tick);
    };

    rafVerifyRef.current = requestAnimationFrame(tick);
  };

  /* ───── SCROLL TRACKING ───── */
  useEffect(() => {
    if (!verifyDone) return;

    const checkScroll = () => {
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      // Short content → auto allow
      if (docHeight <= winHeight + 10) {
        setCanContinue(true);
        return;
      }

      const scrolled =
        window.scrollY / (docHeight - winHeight);

      // Rewarded ad on odd steps at 50%
      if (
        scrolled >= 0.5 &&
        step % 2 === 1 &&
        !rewardedShown
      ) {
        openRewardedAd();
        setRewardedShown(true);
      }

      if (scrolled >= 0.9) {
        setCanContinue(true);
      }
    };

    checkScroll();
    window.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [verifyDone, step, rewardedShown]);

  /* ───── NEXT STEP ───── */
  const nextStep = async () => {
    cancelAnimationFrame(rafVerifyRef.current);

    const res = await fetch(`${API}/unlock/next`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, productId: slug })
    });

    const data = await res.json();

    setProgress(data.progress);
    setStep((s) => s + 1);

    // Reset state
    setShowGate(true);
    setVerifyStarted(false);
    setVerifyDone(false);
    setVerifyTime(VERIFY_TIME);
    setCanContinue(false);
    setRewardedShown(false);

    verifyElapsedRef.current = 0;
    verifyLastRef.current = null;
    verifyDoneRef.current = false;

    const rewarded = document.getElementById("rewarded-ad-container");
    if (rewarded) rewarded.innerHTML = "";

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ───── FINAL STATE ───── */
  if (!loading && progress >= 100) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold mb-6">
          Access Unlocked 🎉
        </h1>
        <button
          onClick={async () => {
            const res = await fetch(
              `${API}/products/${slug}/telegram`
            );
            const data = await res.json();
            window.open(data.telegramLink, "_blank");
          }}
          className="px-8 py-4 rounded-xl bg-green-600 font-bold text-lg"
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

      {/* VERIFY */}
      {!verifyDone && !verifyStarted && !showGate && (
        <div className="min-h-screen flex items-center justify-center">
          <AdButton
            onClick={startVerify}
            className="px-10 py-4 rounded-xl bg-purple-600 font-bold text-lg"
          >
            Verify to Continue
          </AdButton>
        </div>
      )}

      {verifyStarted && (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-yellow-400 text-xl font-bold">
            Verifying… {verifyTime}s
          </p>
        </div>
      )}

      {/* BLOG */}
      {verifyDone && (
        <div className="max-w-3xl mx-auto pt-24">
          <h1 className="text-3xl font-bold mb-4">
            {product.title}
          </h1>

          <p className="text-gray-400 mb-8">
            {product.description}
          </p>

          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: product.blog }}
          />

          <div id="rewarded-ad-container" className="my-12" />

          {!canContinue && (
            <p className="text-center text-gray-400 mt-12">
              Scroll to read full content to continue
            </p>
          )}

          {canContinue && (
            <div className="flex justify-center mt-16">
              <AdButton
                onClick={nextStep}
                className="px-10 py-4 rounded-xl bg-blue-600 font-bold text-lg"
              >
                Continue to Next Step
              </AdButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
