import { Link, useParams } from "react-router-dom";

import { useApi } from "../api";
import { getReadingTime, getRelated } from "../data/helpers";
import NotFound from "./NotFound";
import { DetailError, DetailSkeleton } from "../components/PageStatus";
import {
  Breadcrumb,
  CtaSection,
  HeroVisual,
  RelatedGrid,
} from "../components/DetailSections";

function ArticleBlock({ block }) {
  if (block.type === "h2") {
    return (
      <h2 className="pt-4 text-2xl font-bold text-white sm:text-3xl">
        {block.text}
      </h2>
    );
  }

  if (block.type === "list") {
    return (
      <ul className="list-disc space-y-3 pl-6 text-base leading-8 text-slate-300 marker:text-cyan-400 sm:text-lg">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <p className="text-base leading-8 text-slate-300 sm:text-lg">
      {block.text}
    </p>
  );
}

function BlogDetail() {
  const { slug } = useParams();

  const { data: blog, loading, error, notFound } = useApi(`/api/blogs/${slug}`);
  // One list request feeds previous/next and the related cards
  const { data: blogs = [] } = useApi("/api/blogs");

  if (loading) return <DetailSkeleton />;

  if (notFound) {
    return (
      <NotFound
        title="Article Not Found"
        message="The article you are looking for does not exist."
        backTo="/blog"
        backLabel="Back to Blog"
      />
    );
  }

  if (error) return <DetailError />;

  const index = blogs.findIndex((item) => item.slug === blog.slug);
  const previous = index > 0 ? blogs[index - 1] : null;
  const next = index >= 0 ? blogs[index + 1] : null;

  return (
    <div className="min-h-screen bg-slate-950 px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <article className="mx-auto max-w-4xl">
          <Breadcrumb
            items={[
              { label: "Home", to: "/" },
              { label: "Blog", to: "/blog" },
              { label: blog.title },
            ]}
          />

          {/* Header */}
          <header>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              {blog.category}
            </p>

            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              {blog.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-400">
              <span className="font-medium text-slate-200">{blog.author}</span>
              <span className="text-slate-600">•</span>
              <time>{blog.date}</time>
              <span className="text-slate-600">•</span>
              <span>{getReadingTime(blog)}</span>
            </div>
          </header>

          <HeroVisual icon={blog.icon} className="mt-10 h-56 sm:h-80" />

          {/* Article */}
          <div className="mt-12 space-y-7">
            {blog.content.map((block, blockIndex) => (
              <ArticleBlock key={blockIndex} block={block} />
            ))}
          </div>

          {/* Tags */}
          <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-slate-800 pt-8">
            <span className="text-sm font-semibold text-slate-400">Tags:</span>

            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Previous / Next */}
          <nav
            aria-label="More articles"
            className="mt-10 grid gap-4 sm:grid-cols-2"
          >
            {previous ? (
              <Link
                to={`/blog/${previous.slug}`}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-500/40"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  ← Previous
                </span>
                <p className="mt-2 font-semibold leading-6">{previous.title}</p>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}

            {next && (
              <Link
                to={`/blog/${next.slug}`}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-right transition hover:border-cyan-500/40"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  Next →
                </span>
                <p className="mt-2 font-semibold leading-6">{next.title}</p>
              </Link>
            )}
          </nav>
        </article>

        <RelatedGrid
          title="Related Articles"
          items={blogs.length ? getRelated(blogs, blog.slug) : []}
          basePath="/blog"
          linkLabel="Read Article"
        />

        <CtaSection
          title="Need help with your next project?"
          text="Talk to the TechNova Solutions team about your requirements."
        />
      </div>
    </div>
  );
}

export default BlogDetail;
