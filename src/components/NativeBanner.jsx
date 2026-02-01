import { useEffect, useRef } from "react";

let nativeLoaded = false;

export default function NativeBanner() {
  const ref = useRef(null);

  useEffect(() => {
    if (nativeLoaded) return;
    nativeLoaded = true;

    const script = document.createElement("script");
    script.src = import.meta.env.VITE_ADSTERRA_NATIVE_SCRIPT;
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div
      id={import.meta.env.VITE_ADSTERRA_NATIVE_CONTAINER}
      ref={ref}
      className="w-full min-h-[120px] rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 text-sm"
    >
      Advertisement
    </div>
  );
}
