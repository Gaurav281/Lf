import { useState } from "react";
import { adminLogin } from "../../api/admin";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const data = await adminLogin(password);

    if (!data.token) {
      setError("Invalid admin password");
      return;
    }

    // ✅ STORE TOKEN
    localStorage.setItem("admin_token", data.token);

    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-gray-900 p-6 rounded-2xl border border-gray-700"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          Admin Login
        </h1>

        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 outline-none mb-4"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-bold"
        >
          Login
        </button>
      </form>
    </div>
  );
}
