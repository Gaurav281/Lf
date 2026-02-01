import { useEffect, useRef } from "react";

export default function NativeBanner({ containerId }) {
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!containerId) return;
    if (loadedRef.current) return;
    loadedRef.current = true;

    const script = document.createElement("script");
    script.src =
      "https://pl28624788.effectivegatecpm.com/8c531d7bb87effd987767434419c3ff5/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [containerId]);

  return (
    <div
      id={containerId}
      className="w-full min-h-[120px] rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 text-sm"
    >
      Advertisement
    </div>
  );
}
