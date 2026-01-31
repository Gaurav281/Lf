const API = import.meta.env.VITE_API_URL;

/* ───── ADMIN LOGIN ───── */
export const adminLogin = async (password) => {
  const res = await fetch(`${API}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });

  return res.json();
};

/* ───── CREATE PRODUCT ───── */
export const createProduct = async (data) => {
  const token = localStorage.getItem("admin_token");

  const res = await fetch(`${API}/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

/* ───── DELETE PRODUCT ───── */
export const deleteProduct = async (slug) => {
  const token = localStorage.getItem("admin_token");

  const res = await fetch(`${API}/admin/products/${slug}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};
