import { Link } from "react-router-dom";
import AdButton from "./AdButton";

export default function ProductCard({ product }) {
  return (
    <div className="relative group bg-gradient-to-br from-gray-900/50 to-gray-900/10 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
      
      {/* Gradient Corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-bl-full pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <h2 className="text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
          {product.title}
        </h2>

        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
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
