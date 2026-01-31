const API = import.meta.env.VITE_API_URL;

export const fetchProducts = async () => {
  const res = await fetch(`${API}/products`);
  return res.json();
};

export const fetchTelegramLink = async (slug) => {
  const res = await fetch(`${API}/products/${slug}/telegram`);
  return res.json();
};
