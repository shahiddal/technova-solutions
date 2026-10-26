import { Link, useParams } from "react-router-dom";

const services = {
  "web-development": {
    title: "Web Development",
    shortDescription:
      "Modern, responsive and high-performance websites built for businesses.",
    description:
      "We build modern and scalable websites that provide a smooth experience across desktop, tablet and mobile devices. Our websites are designed with clean code, responsive layouts and business-focused user experiences.",
    features: [
      "Responsive Website Development",
      "Modern UI Implementation",
      "SEO-Friendly Structure",
      "Performance Optimization",
      "Cross-Browser Compatibility",
      "Website Maintenance",
    ],
    technologies: ["React", "JavaScript", "Tailwind CSS", "Node.js"],
  },

  "mern-development": {
    title: "MERN Development",
    shortDescription:
      "Complete full-stack web applications using MongoDB, Express, React and Node.js.",
    description:
      "Our MERN development services help businesses build complete full-stack applications with modern frontend interfaces, powerful backend APIs and scalable MongoDB databases.",
    features: [
      "React Frontend Development",
      "Node.js Backend",
      "REST API Development",
      "MongoDB Database Integration",
      "Authentication & Authorization",
      "Scalable Application Architecture",
    ],
    technologies: ["MongoDB", "Express.js", "React", "Node.js"],
  },

  "app-development": {
    title: "App Development",
    shortDescription:
      "User-friendly mobile applications designed for modern businesses.",
    description:
      "We create mobile application experiences focused on usability, performance and scalability. Our development approach helps businesses provide their customers with a smooth mobile experience.",
    features: [
      "Mobile UI Development",
      "Responsive Application Design",
      "API Integration",
      "User Authentication",
      "Performance Optimization",
      "Application Maintenance",
    ],
    technologies: ["React Native", "JavaScript", "Node.js", "REST API"],
  },

  "ui-ux-design": {
    title: "UI/UX Design",
    shortDescription:
      "Clean, modern and user-focused designs that improve digital experiences.",
    description:
      "We design intuitive digital experiences that focus on usability, visual consistency and user needs. Every interface is planned to provide a simple and engaging experience.",
    features: [
      "User Interface Design",
      "User Experience Design",
      "Responsive Design",
      "Wireframes",
      "Design Systems",
      "Prototype Development",
    ],
    technologies: ["Figma", "UI Design", "UX Research", "Prototyping"],
  },

  "e-commerce": {
    title: "E-Commerce Development",
    shortDescription:
      "Scalable online stores designed to help businesses sell products online.",
    description:
      "We develop modern e-commerce platforms with product management, shopping experiences and secure backend systems. The platforms are designed to work smoothly across desktop, tablet and mobile devices.",
    features: [
      "Product Management",
      "Shopping Cart",
      "Order Management",
      "Customer Accounts",
      "Payment Gateway Integration",
      "Responsive Storefront",
    ],
    technologies: ["React", "Node.js", "MongoDB", "Express.js"],
  },

  "cloud-solutions": {
    title: "Cloud Solutions",
    shortDescription:
      "Reliable cloud-based solutions designed for scalability and performance.",
    description:
      "We help businesses move their applications and services toward modern cloud infrastructure. Our solutions focus on scalability, reliability and application performance.",
    features: [
      "Cloud Deployment",
      "Application Hosting",
      "Database Deployment",
      "Scalable Infrastructure",
      "Performance Monitoring",
      "Application Maintenance",
    ],
    technologies: ["AWS", "Cloud Deployment", "Node.js", "MongoDB"],
  },
};

function ServiceDetail() {
  const { slug } = useParams();

  const service = services[slug];

  if (!service) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-32 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold">Service Not Found</h1>

          <p className="mt-4 text-slate-400">
            The service you are looking for does not exist.
          </p>

          <Link
            to="/services"
            className="mt-8 inline-block rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Back to Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/services"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-cyan-400"
        >
          ← Back to Services
        </Link>

        {/* Hero */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 lg:p-14">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              TechNova Solutions
            </p>

            <h1 className="text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {service.title}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              {service.shortDescription}
            </p>

            <Link
              to="/contact"
              className="mt-8 inline-block rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* Description */}
        <section className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              About This Service
            </p>

            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              Solutions built around your business
            </h2>

            <p className="mt-5 leading-8 text-slate-400">
              {service.description}
            </p>
          </div>

          {/* Technologies */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
            <h2 className="text-xl font-bold">Technologies</h2>

            <div className="mt-5 flex flex-wrap gap-3">
              {service.technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mt-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            What We Provide
          </p>

          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            Key Features
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.features.map((feature, index) => (
              <div
                key={feature}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/40"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-sm font-bold text-cyan-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="pt-1 text-sm font-medium leading-6 text-slate-200">
                    {feature}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to build your next project?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Let&apos;s discuss your requirements and create a solution that
            fits your business.
          </p>

          <Link
            to="/contact"
            className="mt-7 inline-block rounded-lg bg-cyan-500 px-7 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Contact Us
          </Link>
        </section>
      </div>
    </main>
  );
}

export default ServiceDetail;