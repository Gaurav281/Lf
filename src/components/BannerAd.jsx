import { useEffect, useRef } from "react";

export default function BannerAd() {
  const containerRef = useRef(null);
  const loadedRef = useRef(false);

  const key = import.meta.env.VITE_ADSTERRA_HOME_BANNER_KEY;
  const src = import.meta.env.VITE_ADSTERRA_HOME_BANNER_SRC;

  useEffect(() => {
    if (!key || !src) return;
    if (loadedRef.current) return;

    loadedRef.current = true;

    // Create isolated atOptions
    const optionsScript = document.createElement("script");
    optionsScript.type = "text/javascript";
    optionsScript.innerHTML = `
      atOptions = {
        'key': '${key}',
        'format': 'iframe',
        'height': 250,
        'width': 300,
        'params': {}
      };
    `;

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = src;
    invokeScript.async = true;

    if (containerRef.current) {
      containerRef.current.appendChild(optionsScript);
      containerRef.current.appendChild(invokeScript);
    }
  }, [key, src]);

  if (!key || !src) return null;

  return (
    <div className="w-full flex justify-center my-8">
      <div
        ref={containerRef}
        className="w-[300px] h-[250px] bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-center text-gray-500 text-sm overflow-hidden"
      >
        Advertisement
      </div>
    </div>
  );
}
