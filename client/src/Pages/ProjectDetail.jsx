import { useParams } from "react-router-dom";

import { projects } from "../data/projects";
import { findBySlug, getRelated } from "../data/helpers";
import NotFound from "./NotFound";
import {
  Breadcrumb,
  CheckList,
  CtaSection,
  HeroVisual,
  InfoCard,
  NumberedGrid,
  PillList,
  RelatedGrid,
  SectionHeading,
} from "../components/DetailSections";

function ProjectDetail() {
  const { slug } = useParams();

  const project = findBySlug(projects, slug);

  if (!project) {
    return (
      <NotFound
        title="Project Not Found"
        message="The project you are looking for does not exist."
        backTo="/portfolio"
        backLabel="Back to Portfolio"
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Portfolio", to: "/portfolio" },
            { label: project.title },
          ]}
        />

        {/* Hero */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-10 lg:p-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            {project.category}
          </p>

          <h1 className="mt-4 text-3xl font-bold sm:text-5xl">
            {project.title}
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
            {project.description}
          </p>

          {(project.liveUrl || project.githubUrl) && (
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-cyan-500 px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  Live Demo
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/20 px-6 py-3 text-center font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-400"
                >
                  View on GitHub
                </a>
              )}
            </div>
          )}

          <HeroVisual icon={project.icon} className="mt-10 h-56 sm:h-80" />
        </section>

        {/* Development + Technologies */}
        <section className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeading eyebrow="Project Overview" title="How We Built It" />

            <div className="mt-5 space-y-5">
              {project.development.map((paragraph) => (
                <p key={paragraph} className="leading-8 text-slate-400">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <InfoCard title="Technologies Used">
            <PillList items={project.technologies} />
          </InfoCard>
        </section>

        {/* Features */}
        <section className="mt-16">
          <SectionHeading eyebrow="What It Does" title="Key Features" />

          <div className="mt-8">
            <NumberedGrid items={project.features} />
          </div>
        </section>

        {/* Challenges + Solutions */}
        <section className="mt-16 grid gap-8 lg:grid-cols-2">
          <InfoCard title="The Challenges">
            <CheckList items={project.challenges} />
          </InfoCard>

          <InfoCard title="Our Solutions">
            <CheckList items={project.solutions} />
          </InfoCard>
        </section>

        {/* Results */}
        <section className="mt-16">
          <SectionHeading eyebrow="Outcome" title="Results" />

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {project.results.map((result) => (
              <div
                key={result}
                className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 font-medium leading-7 text-slate-200"
              >
                {result}
              </div>
            ))}
          </div>
        </section>

        <CtaSection
          title="Have a similar project in mind?"
          text="Let's discuss your idea and build a solution for your business."
          buttonLabel="Start a Project"
        />

        <RelatedGrid
          title="Related Projects"
          items={getRelated(projects, project.slug)}
          basePath="/projects"
          linkLabel="View Project"
        />
      </div>
    </div>
  );
}

export default ProjectDetail;
