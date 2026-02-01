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
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(
      p =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tags?.join(" ").toLowerCase().includes(q)
    );
  }, [products, query]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white px-4 pt-6 pb-24">

      {/* HEADER (UNCHANGED) */}
      <div className="mb-8 text-center relative z-10">
        <h1 className="text-4xl font-bold mb-4">
          Unlock Premium Content
        </h1>

        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full max-w-md mx-auto px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
        />
      </div>

      {loading && (
        <div className="text-center text-gray-400 mt-20">
          Loading premium products…
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No products found
        </div>
      )}

      {!loading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredProducts.map((product, index) => (
            <div key={product.slug} className="contents">
              <ProductCard product={product} />

              {/* Banner after every 3 products */}
              {(index + 1) % 3 === 0 && (
                <div className="md:col-span-2 lg:col-span-3">
                  <BannerAd />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
