import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { adminApi } from "../../api";
import { LoadError, SkeletonGrid } from "../../components/PageStatus";

const SECTIONS = [
  { key: "services", label: "Services" },
  { key: "projects", label: "Projects" },
  { key: "blogs", label: "Blogs" },
  { key: "enquiries", label: "Enquiries" },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    adminApi
      .get("/dashboard")
      .then((response) => active && setStats(response.data.data))
      .catch((err) => {
        if (!active) return;
        if (err.response?.status === 401) navigate("/admin/login", { replace: true });
        else setError(true);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
        Overview
      </p>

      <h1 className="mt-3 text-3xl font-bold">Dashboard</h1>

      {error ? (
        <div className="mt-8">
          <LoadError />
        </div>
      ) : !stats ? (
        <SkeletonGrid count={4} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" cardClassName="h-32" />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((section) => (
            <div
              key={section.key}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <p className="text-sm text-slate-400">{section.label}</p>

              <p className="mt-2 text-3xl font-bold">{stats[section.key]}</p>

              {section.key === "enquiries" && (
                <p className="mt-2 text-sm text-cyan-300">{stats.newEnquiries} new</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 text-sm leading-6 text-slate-300">
        Management tools for services, projects, blogs and enquiries are coming
        next. Until then, content is updated with the seed script.
      </div>
    </div>
  );
}

export default AdminDashboard;
