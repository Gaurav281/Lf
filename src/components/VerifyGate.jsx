import { useEffect, useState } from "react";

export default function VerifyGate({ onVerified }) {
  const [verified, setVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (!verified) return;

    const end = Date.now() + 5000;
    const tick = () => {
      const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setTimeLeft(left);
      if (left > 0) requestAnimationFrame(tick);
      else onVerified();
    };

    requestAnimationFrame(tick);
  }, [verified]);

  if (verified)
    return (
      <div className="text-center text-yellow-300 font-semibold">
        Verifying… {timeLeft}s
      </div>
    );

  return (
    <button
      onClick={() => setVerified(true)}
      className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold"
    >
      Verify to Continue
    </button>
  );
}
