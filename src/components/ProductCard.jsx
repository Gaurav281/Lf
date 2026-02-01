import { Link } from "react-router-dom";
import AdButton from "./AdButton";

export default function ProductCard({ product }) {
  return (
    <div className="relative group bg-gradient-to-br from-gray-900/60 to-gray-900/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800/60 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">

      {/* ───── POSTER / TITLE BANNER ───── */}
      <div className="relative h-32 bg-gradient-to-r from-purple-700/30 via-blue-700/30 to-indigo-700/30 flex items-center justify-center px-4">
        
        {/* Overlay pattern */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Category badge */}
        {product.category && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-black/70 border border-white/10 text-white backdrop-blur">
            {product.category}
          </span>
        )}

        {/* Poster title */}
        <h2 className="relative z-10 text-center text-lg font-extrabold leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {product.title}
        </h2>
      </div>

      {/* ───── BODY ───── */}
      <div className="p-6 relative z-10">
        <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">
          {product.description}
        </p>

        <Link to={`/product/${product.slug}`}>
          <AdButton className="group/btn relative w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 active:scale-95 transition-all duration-300 font-semibold overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative">
              Unlock Now
            </span>
          </AdButton>
        </Link>
      </div>
    </div>
  );
}
