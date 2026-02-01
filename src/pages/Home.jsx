import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import BannerAd from "../components/BannerAd";

const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ───── SEARCH FILTER ───── */
  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products;

    const q = query.toLowerCase();

    return products.filter((p) => {
      return (
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        (Array.isArray(p.tags) &&
          p.tags.join(" ").toLowerCase().includes(q))
      );
    });
  }, [products, query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white px-4 pt-6 pb-24">
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      {/* ───── HEADER ───── */}
      <div className="mb-8 text-center relative z-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            Unlock Premium
          </span>
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Content
          </span>
        </h1>

        <p className="text-gray-400 text-lg max-w-md mx-auto mb-6">
          Reel bundles • Courses • Creator resources
        </p>

        {/* ───── SEARCH BAR ───── */}
        <div className="max-w-md mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition"
          />
        </div>
      </div>

      {/* ───── LOADING ───── */}
      {loading && (
        <div className="text-center text-gray-400 mt-20 relative z-10">
          Loading premium products…
        </div>
      )}

      {/* ───── NO RESULTS ───── */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 mt-20 relative z-10">
          No products found for “{query}”
        </div>
      )}

      {/* ───── PRODUCT GRID + ADS ───── */}
      {!loading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10">
          {filteredProducts.map((product, index) => (
            <div key={product.slug}>
              <ProductCard product={product} />

              {/* Banner Ad after every 3 products */}
              {(index + 1) % 3 === 0 && (
                <div className="md:col-span-2 lg:col-span-3">
                  <BannerAd />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ───── FOOTER NOTE ───── */}
      <p className="text-sm text-gray-500 text-center mt-16 px-4 max-w-md mx-auto relative z-10">
        Each product must be unlocked every time to ensure fair access and support creators.
      </p>
    </div>
  );
}
