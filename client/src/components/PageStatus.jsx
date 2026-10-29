// Loading and error states for pages that read content from the API

export function SkeletonGrid({ count = 6, className = "", cardClassName = "h-64" }) {
  return (
    <div className={className} aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={`animate-pulse rounded-2xl border border-white/10 bg-slate-900 ${cardClassName}`}
        />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div
      className="min-h-screen bg-slate-950 px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="mb-6 h-4 w-48 rounded bg-slate-800" />
        <div className="h-72 rounded-3xl border border-slate-800 bg-slate-900/60 sm:h-80" />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-28 rounded-2xl bg-slate-900" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function LoadError({
  message = "We couldn't load this content. Please check your connection and try again.",
}) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center"
    >
      <p className="text-red-300">{message}</p>

      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-5 rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
      >
        Try Again
      </button>
    </div>
  );
}

export function DetailError() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-32 text-white">
      <div className="mx-auto max-w-3xl">
        <LoadError />
      </div>
    </div>
  );
}
