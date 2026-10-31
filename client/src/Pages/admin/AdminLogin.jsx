import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { adminApi } from "../../api";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400";

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Already logged in: go straight to the dashboard
  useEffect(() => {
    let active = true;

    adminApi
      .get("/me")
      .then(() => active && navigate("/admin/dashboard", { replace: true }))
      .catch(() => active && setChecking(false));

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await adminApi.post("/login", form);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      const status = err.response?.status;

      setError(
        status === 429
          ? err.response.data.message
          : status === 400 || status === 401
            ? "Invalid email or password."
            : "We couldn't reach the server. Please try again."
      );
      setForm({ ...form, password: "" });
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400"
        aria-busy="true"
      >
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16 text-white">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center text-2xl font-bold tracking-wide">
          Tech<span className="text-cyan-400">Nova</span>
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8">
          <h1 className="text-2xl font-bold">Admin Login</h1>

          <p className="mt-2 text-sm text-gray-400">
            Sign in to manage your website.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                autoComplete="username"
                maxLength={254}
                value={form.email}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                maxLength={200}
                value={form.password}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <Link
          to="/"
          className="mt-6 block text-center text-sm text-slate-400 transition hover:text-cyan-400"
        >
          ← Back to website
        </Link>
      </div>
    </div>
  );
}

export default AdminLogin;
