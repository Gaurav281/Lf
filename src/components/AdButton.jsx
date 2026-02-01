import { openSmartLink } from "../utils/adManager";

export default function AdButton({
  onClick,
  children,
  className = "",
  type = "button"
}) {
  const handleClick = (e) => {
    e.stopPropagation();

    // Monetized redirect (safe, user-initiated)
    openSmartLink();

    // App logic must ALWAYS run
    if (typeof onClick === "function") {
      onClick();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`group relative overflow-hidden ${className}`}
    >
      {/* subtle shine, no UI redesign */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
