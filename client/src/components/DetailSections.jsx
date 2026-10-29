import { Link } from "react-router-dom";

// Shared building blocks for the service, project and blog detail pages

export function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <ol className="flex flex-wrap items-center gap-2 text-slate-400">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 && <span className="text-slate-600">/</span>}

            {item.to ? (
              <Link to={item.to} className="transition hover:text-cyan-400">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-slate-200">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Gradient image placeholder, same style as the portfolio cards
export function HeroVisual({ icon, className = "h-56 sm:h-72" }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border border-slate-800 bg-gradient-to-br from-cyan-500/20 via-slate-900 to-slate-950 ${className}`}
    >
      <span className="text-7xl sm:text-8xl" aria-hidden="true">
        {icon}
      </span>
    </div>
  );
}

export function SectionHeading({ eyebrow, title }) {
  return (
    <>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{title}</h2>
    </>
  );
}

export function PillList({ items }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function NumberedGrid({ items }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={item}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/40"
        >
          <div className="flex items-start gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-sm font-bold text-cyan-400">
              {String(index + 1).padStart(2, "0")}
            </span>

            <p className="pt-1 text-sm font-medium leading-6 text-slate-200">
              {item}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CheckList({ items }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 leading-7 text-slate-300">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-sm text-cyan-400">
            ✓
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function StepList({ steps }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <span className="text-sm font-bold text-cyan-400">
            Step {index + 1}
          </span>

          <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            {step.description}
          </p>
        </li>
      ))}
    </ol>
  );
}

export function InfoCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
      <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export function RelatedGrid({ title, items, basePath, linkLabel }) {
  return (
    <section className="mt-16">
      <SectionHeading eyebrow="Explore More" title={title} />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.slug}
            to={`${basePath}/${item.slug}`}
            className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/40"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl">
              {item.icon}
            </span>

            {item.category && (
              <span className="mt-5 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                {item.category}
              </span>
            )}

            <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>

            <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">
              {item.summary}
            </p>

            <span className="mt-5 text-sm font-semibold text-cyan-400 group-hover:text-cyan-300">
              {linkLabel} →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CtaSection({ title, text, buttonLabel = "Contact Us" }) {
  return (
    <section className="mt-16 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-8 text-center sm:p-12">
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>

      <p className="mx-auto mt-4 max-w-2xl text-slate-400">{text}</p>

      <Link
        to="/contact"
        className="mt-7 inline-block rounded-lg bg-cyan-500 px-7 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
      >
        {buttonLabel}
      </Link>
    </section>
  );
}
