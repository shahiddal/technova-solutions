import { Link } from "react-router-dom";

import { useApi } from "../api";
import { LoadError, SkeletonGrid } from "../components/PageStatus";

function Blog() {
  const { data: blogs, error } = useApi("/api/blogs");

  return (
    <div className="min-h-screen bg-slate-950 px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <section className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            TechNova Insights
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Our Blog
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Explore technology insights, development tips and ideas for
            building better digital products.
          </p>
        </section>

        {/* Blog Cards */}
        {!blogs ? (
          error ? (
            <div className="mt-14">
              <LoadError />
            </div>
          ) : (
            <SkeletonGrid
              className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              cardClassName="h-64"
            />
          )
        ) : (
          <section className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Link
                key={blog.slug}
                to={`/blog/${blog.slug}`}
                className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    {blog.category}
                  </span>

                  <span className="text-xs text-slate-500">
                    {blog.date}
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-bold leading-7">
                  {blog.title}
                </h2>

                <p className="mt-4 flex-1 text-sm leading-6 text-slate-400">
                  {blog.summary}
                </p>

                <span className="mt-6 inline-block text-sm font-semibold text-cyan-400 transition group-hover:text-cyan-300">
                  Read Article →
                </span>
              </Link>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

export default Blog;