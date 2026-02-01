import { useEffect } from "react";

export default function NativeBanner({ containerId }) {
  const src = import.meta.env.VITE_ADSTERRA_NATIVE_SRC;

  useEffect(() => {
    if (!src) return;

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [src]);

  return (
    <div
      id={containerId}
      className="w-full min-h-[120px] rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 text-sm"
    >
      Advertisement
    </div>
  );
}
