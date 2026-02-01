import { useEffect, useRef } from "react";

export default function BannerAd() {
  const ref = useRef(null);
  const loadedRef = useRef(false);

  const key = import.meta.env.VITE_ADSTERRA_HOME_BANNER_KEY;
  const src = import.meta.env.VITE_ADSTERRA_HOME_BANNER_SRC;

  useEffect(() => {
    if (!key || !src) return;
    if (loadedRef.current) return;
    if (!ref.current) return;

    loadedRef.current = true;
    ref.current.innerHTML = "";

    const opt = document.createElement("script");
    opt.innerHTML = `
      atOptions = {
        'key': '${key}',
        'format': 'iframe',
        'height': 250,
        'width': 300,
        'params': {}
      };
    `;

    const scr = document.createElement("script");
    scr.src = src;
    scr.async = true;
    scr.setAttribute("data-cfasync", "false");

    ref.current.appendChild(opt);
    ref.current.appendChild(scr);
  }, [key, src]);

  return (
    <div className="w-full flex justify-center my-8">
      <div
        ref={ref}
        className="w-[300px] h-[250px] bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-center text-gray-500 text-sm"
      >
        Advertisement
      </div>
    </div>
  );
}
