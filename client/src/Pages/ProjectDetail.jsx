import { Link, useParams } from "react-router-dom";

const projects = {
  "e-commerce-platform": {
    title: "E-Commerce Platform",
    category: "E-Commerce",
    description:
      "A modern and scalable e-commerce platform designed to provide customers with a smooth online shopping experience.",
    challenge:
      "The goal was to create a fast and responsive online store where users could easily browse products, manage their cart and complete their shopping journey.",
    solution:
      "We designed a responsive React frontend with a scalable Node.js and Express backend, supported by MongoDB for product and customer data.",
    technologies: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    features: [
      "Responsive product catalog",
      "Shopping cart",
      "Product management",
      "Customer accounts",
      "Order management",
      "Mobile-friendly interface",
    ],
  },

  "business-management-system": {
    title: "Business Management System",
    category: "Web Application",
    description:
      "A centralized business management application that helps teams organize operations and manage important business information.",
    challenge:
      "Businesses needed a simple system to manage their daily operations from one centralized platform.",
    solution:
      "We created a structured web application with reusable React components, REST APIs and MongoDB database integration.",
    technologies: ["React", "Node.js", "Express.js", "MongoDB"],
    features: [
      "Dashboard",
      "User management",
      "Data management",
      "Reports",
      "REST API",
      "Responsive interface",
    ],
  },

  "company-website": {
    title: "Company Website",
    category: "Corporate Website",
    description:
      "A professional corporate website designed to improve online presence and clearly present business services.",
    challenge:
      "The business needed a professional website that communicated its services clearly across all devices.",
    solution:
      "We created a modern responsive website with clear navigation, service sections, portfolio content and a contact system.",
    technologies: ["React", "Tailwind CSS", "JavaScript"],
    features: [
      "Responsive design",
      "Service pages",
      "Portfolio section",
      "Blog section",
      "Contact form",
      "Mobile navigation",
    ],
  },

  "task-management-app": {
    title: "Task Management App",
    category: "Productivity",
    description:
      "A productivity application that helps teams organize tasks and manage their work efficiently.",
    challenge:
      "Users needed a simple interface to create, organize and track their daily tasks.",
    solution:
      "We developed an intuitive task management interface with reusable components and structured application state.",
    technologies: ["React", "Node.js", "MongoDB"],
    features: [
      "Task creation",
      "Task status management",
      "User accounts",
      "Dashboard",
      "Responsive interface",
      "Data persistence",
    ],
  },

  "learning-platform": {
    title: "Learning Platform",
    category: "Education",
    description:
      "An online learning platform designed to provide students with accessible educational content.",
    challenge:
      "The platform needed an easy-to-use interface where students could discover and access learning resources.",
    solution:
      "We created a responsive learning experience with structured courses, content sections and user-friendly navigation.",
    technologies: ["React", "Node.js", "MongoDB"],
    features: [
      "Course listing",
      "Learning content",
      "Student dashboard",
      "Responsive design",
      "User authentication",
      "Progress tracking",
    ],
  },

  "analytics-dashboard": {
    title: "Analytics Dashboard",
    category: "Analytics",
    description:
      "A modern dashboard that presents business information through clear and easy-to-understand data views.",
    challenge:
      "Business users needed important information to be available in one clear dashboard.",
    solution:
      "We designed a responsive dashboard with reusable components and structured data presentation.",
    technologies: ["React", "JavaScript", "Node.js"],
    features: [
      "Dashboard widgets",
      "Data visualization",
      "Reports",
      "Responsive layout",
      "Reusable components",
      "Performance-focused UI",
    ],
  },
};

function ProjectDetail() {
  const { slug } = useParams();

  const project = projects[slug];

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-32 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold">Project Not Found</h1>

          <p className="mt-4 text-slate-400">
            The project you are looking for does not exist.
          </p>

          <Link
            to="/portfolio"
            className="mt-8 inline-block rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/portfolio"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-cyan-400"
        >
          ← Back to Portfolio
        </Link>

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
        </section>

        {/* Project Overview */}
        <section className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
            <h2 className="text-2xl font-bold">The Challenge</h2>

            <p className="mt-5 leading-8 text-slate-400">
              {project.challenge}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Our Solution</h2>

            <p className="mt-5 leading-8 text-slate-400">
              {project.solution}
            </p>
          </div>
        </section>

        {/* Technologies */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Technologies Used
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300"
              >
                {technology}
              </span>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Key Features
          </h2>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.features.map((feature, index) => (
              <div
                key={feature}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-cyan-500/40"
              >
                <span className="text-sm font-bold text-cyan-400">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p className="mt-3 font-medium text-slate-200">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Have a similar project in mind?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Let&apos;s discuss your idea and build a solution for your
            business.
          </p>

          <Link
            to="/contact"
            className="mt-7 inline-block rounded-lg bg-cyan-500 px-7 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Start a Project
          </Link>
        </section>
      </div>
    </div>
  );
}

export default ProjectDetail;