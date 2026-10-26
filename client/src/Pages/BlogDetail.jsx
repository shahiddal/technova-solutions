import { Link, useParams } from "react-router-dom";

const blogs = {
  "modern-website-for-business": {
    title: "Why Businesses Need a Modern Website in 2026",
    category: "Web Development",
    date: "October 20, 2026",
    content: [
      "A modern website is one of the most important digital assets for a business. Customers often visit a company's website before deciding whether to contact or purchase from that business.",
      "A professional website helps businesses create trust, present their services clearly and provide customers with an easy way to get in touch.",
      "Responsive design is also important because customers use different devices to browse the internet. A good website should provide a smooth experience on mobile phones, tablets and desktop computers.",
      "Modern technologies such as React, Node.js and MongoDB can help businesses build fast, scalable and maintainable web applications.",
    ],
  },

  "mern-stack-modern-applications": {
    title: "MERN Stack: Why It Is Popular for Modern Applications",
    category: "Technology",
    date: "October 18, 2026",
    content: [
      "MERN is a popular JavaScript-based technology stack consisting of MongoDB, Express.js, React and Node.js.",
      "React is used to create interactive frontend interfaces, while Node.js and Express.js can be used to build backend APIs.",
      "MongoDB provides a flexible database solution that works well with JavaScript-based applications.",
      "One of the biggest advantages of MERN is that developers can use JavaScript across both frontend and backend development.",
    ],
  },

  "responsive-design-user-experience": {
    title: "How Responsive Design Improves User Experience",
    category: "UI/UX",
    date: "October 15, 2026",
    content: [
      "Responsive design allows a website to automatically adapt its layout to different screen sizes.",
      "Mobile users should be able to navigate a website easily without zooming or horizontally scrolling.",
      "Tablet users also need layouts that make good use of the available screen space.",
      "Using responsive CSS techniques such as flexible grids, breakpoints and responsive typography helps create a consistent experience across devices.",
    ],
  },

  "scalable-web-applications": {
    title: "Best Practices for Building Scalable Web Applications",
    category: "Development",
    date: "October 12, 2026",
    content: [
      "Scalable applications should be designed with maintainability and future growth in mind.",
      "Separating frontend components, backend controllers, routes and database models makes applications easier to maintain.",
      "Using APIs and reusable components can also reduce duplicated code and make future development easier.",
      "Performance optimization, database design and proper error handling are important parts of building reliable applications.",
    ],
  },
};

function BlogDetail() {
  const { slug } = useParams();

  const blog = blogs[slug];

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-32 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold">Article Not Found</h1>

          <p className="mt-4 text-slate-400">
            The article you are looking for does not exist.
          </p>

          <Link
            to="/blog"
            className="mt-8 inline-block rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl">
        <Link
          to="/blog"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-cyan-400"
        >
          ← Back to Blog
        </Link>

        {/* Header */}
        <header className="border-b border-slate-800 pb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            {blog.category}
          </p>

          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
            {blog.title}
          </h1>

          <p className="mt-5 text-sm text-slate-500">
            Published on {blog.date}
          </p>
        </header>

        {/* Article */}
        <div className="mt-10 space-y-7">
          {blog.content.map((paragraph, index) => (
            <p
              key={index}
              className="text-base leading-8 text-slate-300 sm:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-2xl border border-slate-800 bg-slate-900 p-7 text-center sm:p-10">
          <h2 className="text-2xl font-bold">
            Need help with your next project?
          </h2>

          <p className="mt-3 text-slate-400">
            Talk to the TechNova Solutions team about your requirements.
          </p>

          <Link
            to="/contact"
            className="mt-6 inline-block rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Contact Us
          </Link>
        </div>
      </article>
    </div>
  );
}

export default BlogDetail;