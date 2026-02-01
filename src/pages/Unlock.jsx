import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import AdButton from "../components/AdButton";
import AdGateOverlay from "../components/AdGateOverlay";

const API = import.meta.env.VITE_API_URL;

export default function Unlock() {
  const { slug } = useParams();
  const [sessionId] = useState(() => crypto.randomUUID());

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1);

  const [product, setProduct] = useState(null);

  const [verified, setVerified] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [showBlog, setShowBlog] = useState(false);
  const [canContinue, setCanContinue] = useState(false);
  const [rewardedShown, setRewardedShown] = useState(false);

  const blogRef = useRef(null);

  /* ───── START SESSION + LOAD PRODUCT ───── */
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

      setProgress(unlockData.progress || 0);
      setStep(Math.floor((unlockData.progress || 0) / 25) + 1);
      setProduct(productData);
      setLoading(false);
    };

    init();
  }, [slug, sessionId]);

  /* ───── BLOG SCROLL TRACKING ───── */
  useEffect(() => {
    if (!showBlog) return;

    const checkScrollOrSize = () => {
      const docHeight =
        document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      // ✅ CASE 1: Content is NOT scrollable
      if (docHeight <= winHeight + 5) {
        // treat as fully read
        setCanContinue(true);

        // rewarded ad for odd steps (optional but consistent)
        if (step % 2 === 1 && !rewardedShown) {
          window.open(
            import.meta.env.VITE_REWARDED_AD,
            "_blank"
          );
          setRewardedShown(true);
        }

        return;
      }

      // ✅ CASE 2: Normal scroll behavior
      const scrollTop = window.scrollY;
      const scrollable = docHeight - winHeight;
      const scrolled = scrollTop / scrollable;

      // Rewarded ad after 50% (odd steps only)
      if (scrolled >= 0.5 && step % 2 === 1 && !rewardedShown) {
        window.open(
          import.meta.env.VITE_REWARDED_AD,
          "_blank"
        );
        setRewardedShown(true);
      }

      // Enable continue after 90%
      if (scrolled >= 0.9) {
        setCanContinue(true);
      }
    };

    // Run once immediately
    checkScrollOrSize();

    // Listen for scroll
    window.addEventListener("scroll", checkScrollOrSize);
    window.addEventListener("resize", checkScrollOrSize);

    return () => {
      window.removeEventListener("scroll", checkScrollOrSize);
      window.removeEventListener("resize", checkScrollOrSize);
    };
  }, [showBlog, step, rewardedShown]);


  /* ───── NEXT STEP ───── */
  const nextStep = async () => {
    const res = await fetch(`${API}/unlock/next`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, productId: slug })
    });

    const data = await res.json();

    setProgress(data.progress);
    setStep(s => s + 1);

    // reset step UI
    setVerified(false);
    setShowGate(false);
    setShowBlog(false);
    setCanContinue(false);
    setRewardedShown(false);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Preparing unlock…
      </div>
    );
  }

  /* ───── FINAL STATE ───── */
  if (progress >= 100) {
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

  return (
    <div className="min-h-screen bg-black text-white px-4 pb-24">

      {/* STEP INDICATOR */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-1 rounded-full bg-gray-800 text-sm">
        Step {step} / 4
      </div>

      {/* AD GATE */}
      {showGate && (
        <AdGateOverlay
          step={step}
          stepProgress={progress}
          onComplete={() => {
            setShowGate(false);
            setShowBlog(true);
          }}
        />
      )}

      {/* VERIFY */}
      {!verified && !showGate && (
        <div className="min-h-screen flex items-center justify-center">
          <AdButton
            onClick={() => {
              setVerified(true);
              setShowGate(true);
            }}
            className="px-10 py-4 rounded-xl bg-purple-600 font-bold text-lg"
          >
            Verify to Continue
          </AdButton>
        </div>
      )}

      {/* BLOG CONTENT */}
      {showBlog && (
        <div ref={blogRef} className="max-w-3xl mx-auto pt-24">
          <h1 className="text-3xl font-bold mb-4">
            {product.title}
          </h1>

          <p className="text-gray-400 mb-8">
            {product.description}
          </p>

          {/* BLOG HTML */}
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: product.blog }}
          />

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
