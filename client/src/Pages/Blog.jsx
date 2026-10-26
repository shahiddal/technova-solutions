import { Link } from "react-router-dom";

const blogs = [
  {
    title: "Why Businesses Need a Modern Website in 2026",
    slug: "modern-website-for-business",
    category: "Web Development",
    date: "October 20, 2026",
    description:
      "Learn why a modern, responsive website is important for businesses that want to build trust and grow online.",
  },
  {
    title: "MERN Stack: Why It Is Popular for Modern Applications",
    slug: "mern-stack-modern-applications",
    category: "Technology",
    date: "October 18, 2026",
    description:
      "Explore the benefits of MongoDB, Express, React and Node.js for building modern full-stack applications.",
  },
  {
    title: "How Responsive Design Improves User Experience",
    slug: "responsive-design-user-experience",
    category: "UI/UX",
    date: "October 15, 2026",
    description:
      "Understand why websites need to work smoothly across mobile, tablet and desktop devices.",
  },
  {
    title: "Best Practices for Building Scalable Web Applications",
    slug: "scalable-web-applications",
    category: "Development",
    date: "October 12, 2026",
    description:
      "Discover practical development approaches that help applications remain maintainable and scalable.",
  },
];

function Blog() {
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
        <section className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog.slug}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/40"
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
                {blog.description}
              </p>

              <Link
                to={`/blog/${blog.slug}`}
                className="mt-6 inline-block text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Read Article →
              </Link>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

export default Blog;