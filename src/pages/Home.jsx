import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const API = import.meta.env.VITE_API_URL; // 🔁 change in production

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white px-4 pt-6 pb-24">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      {/* ───── HEADER ───── */}
      <div className="mb-10 text-center relative z-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            Unlock Premium
          </span>
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Content
          </span>
        </h1>

        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Reel bundles • Courses • Creator resources
        </p>
      </div>

      {/* ───── LOADING STATE ───── */}
      {loading && (
        <div className="text-center text-gray-400 mt-20 relative z-10">
          Loading premium products…
        </div>
      )}

      {/* ───── PRODUCT GRID ───── */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
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
