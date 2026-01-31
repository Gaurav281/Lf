import { openAd } from "../utils/adManager";

export default function AdButton({
  onClick,
  children,
  className = "",
  type = "button"
}) {
  const handleClick = (e) => {
    e.stopPropagation();

    // Open Adsterra direct link
    openAd();

    // Continue action
    if (typeof onClick === "function") {
      onClick();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
