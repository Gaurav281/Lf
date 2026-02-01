import { openSmartLink } from "../utils/adManager";

export default function AdButton({
  onClick,
  children,
  className,
  type = "button"
}) {
  const handleClick = (e) => {
    e.stopPropagation();

    // Monetized redirect
    openSmartLink();

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
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      <span className="relative">{children}</span>
    </button>
  );
}
