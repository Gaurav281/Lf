import { useEffect, useState } from "react";
import { createProduct, deleteProduct } from "../../api/admin";

const API = import.meta.env.VITE_API_URL;

const CATEGORIES = [
  "Growth",
  "Entertainment",
  "Education",
  "Tools",
  "Marketing",
  "Resources"
];

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    slug: "",
    title: "",
    category: "Growth",
    description: "",
    blog: "",
    telegramLink: ""
  });

  const token = localStorage.getItem("admin_token");

  /* ───── PROTECT ROUTE ───── */
  useEffect(() => {
    if (!token) {
      window.location.href = "/admin/login";
    }
  }, [token]);

  /* ───── LOAD PRODUCTS (LATEST FIRST) ───── */
  const loadProducts = async () => {
    setLoading(true);
    const res = await fetch(`${API}/products?admin=true`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    setProducts(data.reverse()); // latest first (frontend safety)
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* ───── FORM HANDLERS ───── */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (
      !form.slug ||
      !form.title ||
      !form.category ||
      !form.telegramLink ||
      !form.blog
    ) {
      alert("Please fill all required fields");
      return;
    }

    await createProduct(form, token);

    setForm({
      slug: "",
      title: "",
      category: "Growth",
      description: "",
      blog: "",
      telegramLink: ""
    });

    loadProducts();
  };

  const remove = async (slug) => {
    if (!confirm("Delete this product permanently?")) return;
    await deleteProduct(slug, token);
    loadProducts();
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="text-sm text-red-400 hover:text-red-300"
        >
          Logout
        </button>
      </div>

      {/* ADD PRODUCT */}
      <div className="max-w-3xl mx-auto bg-gray-900 p-6 rounded-2xl border border-gray-700 mb-12">
        <h2 className="text-xl font-semibold mb-6">
          Add New Product
        </h2>

        <form onSubmit={submit} className="space-y-4">

          <input
            name="slug"
            placeholder="Slug (unique, URL-safe)"
            value={form.slug}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 outline-none"
          />

          <input
            name="title"
            placeholder="Product Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 outline-none"
          />

          {/* CATEGORY */}
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 outline-none"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <textarea
            name="description"
            placeholder="Short description (shown on card)"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 rounded bg-gray-800 outline-none"
          />

          <textarea
            name="blog"
            placeholder="Blog content (HTML allowed, shown on unlock page)"
            value={form.blog}
            onChange={handleChange}
            rows="8"
            className="w-full p-3 rounded bg-gray-800 outline-none"
          />

          <input
            name="telegramLink"
            placeholder="Telegram Invite Link"
            value={form.telegramLink}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 outline-none"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-bold"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* PRODUCT LIST */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          Existing Products
        </h2>

        {loading ? (
          <p className="text-gray-400">Loading…</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products found</p>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.slug}
                className="flex justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-700"
              >
                <div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-xs text-gray-400">
                    {p.slug} • {p.category}
                  </p>
                </div>

                <button
                  onClick={() => remove(p.slug)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
