// frontend/src/components/NativeBanner.jsx
import { useEffect, useRef } from "react";

export default function NativeBanner({ containerId }) {
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    if (!containerId) return;

    // 1️⃣ Set atOptions BEFORE script
    window.atOptions = {
      key: import.meta.env.VITE_ADSTERRA_NATIVE_KEY,
      format: "native",
      container: containerId,
      params: {}
    };

    // 2️⃣ Inject script
    const script = document.createElement("script");
    script.src = import.meta.env.VITE_ADSTERRA_NATIVE_SRC;
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
