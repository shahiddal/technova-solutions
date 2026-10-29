import { Link } from "react-router-dom";

import { useApi } from "../api";
import { LoadError, SkeletonGrid } from "../components/PageStatus";

function Portfolio() {
  const { data: projects, error } = useApi("/api/projects");

  return (
    <div className="min-h-screen bg-slate-950 px-5 pb-20 pt-28 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Our Work
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Featured Projects
          </h1>

          <p className="mt-6 text-base leading-7 text-gray-400 sm:text-lg">
            Explore some of the digital products and solutions we have
            created using modern technologies.
          </p>
        </div>

        {/* Projects */}
        {!projects ? (
          error ? (
            <div className="mt-14">
              <LoadError />
            </div>
          ) : (
            <SkeletonGrid
              className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3"
              cardClassName="h-96"
            />
          )
        ) : (
          <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.slug}
                to={`/projects/${project.slug}`}
                className="group block overflow-hidden rounded-2xl border border-white/10 bg-slate-900 transition duration-300 hover:-translate-y-2 hover:border-cyan-400/40"
              >
                {/* Project Image Placeholder */}
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-cyan-500/20 via-slate-900 to-slate-950">
                  <span className="text-6xl transition duration-300 group-hover:scale-110">
                    {project.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-sm font-medium text-cyan-400">
                    {project.category}
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    {project.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    {project.summary}
                  </p>

                  {/* Technologies */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.technologies.map((technology, techIndex) => (
                      <span
                        key={techIndex}
                        className="rounded-full border border-white/10 bg-slate-950 px-3 py-1 text-xs text-gray-300"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>

                  {/* Button */}
                  <span className="mt-6 inline-block text-sm font-semibold text-cyan-400 transition group-hover:text-cyan-300">
                    View Project →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Want to build something similar?
          </h2>

          <p className="mt-3 text-gray-400">
            Let's turn your idea into a powerful digital product.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Portfolio;