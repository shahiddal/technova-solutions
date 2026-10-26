import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-32 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
          404
        </p>

        <h1 className="mt-4 text-4xl font-bold">Page Not Found</h1>

        <p className="mt-4 text-slate-400">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="mt-8 inline-block rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
