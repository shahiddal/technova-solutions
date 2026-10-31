import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { adminApi } from "../api";
import { LoadError } from "./PageStatus";

// Sections without a page yet are shown as "Soon" (management comes in later steps)
const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Services" },
  { label: "Projects" },
  { label: "Blogs" },
  { label: "Enquiries" },
];

// Shell for every protected admin page. The API enforces the session on each
// request; this check only decides what to render.
function AdminLayout() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    adminApi
      .get("/me")
      .then((response) => active && setAdmin(response.data.admin))
      .catch((err) => {
        if (!active) return;
        if (err.response?.status === 401) navigate("/admin/login", { replace: true });
        else setError(true);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const logout = async () => {
    setLoggingOut(true);
    // The cookie is cleared even if this fails, on the next request the API answers 401
    await adminApi.post("/logout").catch(() => {});
    navigate("/admin/login", { replace: true });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-32 text-white">
        <div className="mx-auto max-w-3xl">
          <LoadError message="We couldn't reach the admin service. Please check your connection and try again." />
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400"
        aria-busy="true"
      >
        Checking your session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white md:flex">
      {/* Sidebar */}
      <aside className="border-b border-white/10 bg-slate-900/60 md:min-h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        <div className="px-5 py-5">
          <Link to="/admin/dashboard" className="text-xl font-bold tracking-wide">
            Tech<span className="text-cyan-400">Nova</span>{" "}
            <span className="text-sm font-medium text-slate-400">Admin</span>
          </Link>
        </div>

        <nav aria-label="Admin" className="flex flex-wrap gap-2 px-5 pb-5 md:flex-col md:gap-1">
          {NAV_ITEMS.map((item) =>
            item.to ? (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-300"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <span
                key={item.label}
                aria-disabled="true"
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-slate-500"
              >
                {item.label}
                <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wider">
                  Soon
                </span>
              </span>
            )
          )}
        </nav>
      </aside>

      <div className="flex-1">
        {/* Top bar */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-8">
          <p className="min-w-0 truncate text-sm text-slate-400">
            Signed in as <span className="font-medium text-slate-200">{admin.email}</span>
          </p>

          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold transition hover:border-cyan-400 hover:text-cyan-400 disabled:opacity-60"
          >
            {loggingOut ? "Logging out..." : "Log out"}
          </button>
        </header>

        <main className="px-5 py-8 sm:px-8">
          <Outlet context={{ admin }} />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
