import { Link } from "react-router-dom";

function Services() {
  const services = [
    {
      icon: "💻",
      slug: "web-development",
      title: "Web Development",
      description:
        "Fast, responsive and scalable websites built using modern web technologies.",
    },
    {
      icon: "⚛️",
      slug: "mern-development",
      title: "MERN Development",
      description:
        "Full-stack applications built with MongoDB, Express.js, React.js and Node.js.",
    },
    {
      icon: "📱",
      slug: "app-development",
      title: "App Development",
      description:
        "Modern applications designed to provide smooth experiences across devices.",
    },
    {
      icon: "🎨",
      slug: "ui-ux-design",
      title: "UI/UX Design",
      description:
        "Clean, intuitive and user-friendly interfaces focused on great user experience.",
    },
    {
      icon: "🛒",
      slug: "e-commerce",
      title: "E-Commerce",
      description:
        "Powerful online stores with secure and scalable e-commerce solutions.",
    },
    {
      icon: "☁️",
      slug: "cloud-solutions",
      title: "Cloud Solutions",
      description:
        "Reliable cloud-based solutions designed for scalability and performance.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-5 pb-20 pt-28 text-white sm:px-8 lg:px-10">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            What We Offer
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Our Services
          </h1>

          <p className="mt-6 text-base leading-7 text-gray-400 sm:text-lg">
            From websites to complete software solutions, we help businesses
            transform their ideas into powerful digital products.
          </p>

        </div>

        {/* Services */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {services.map((service, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-white/10 bg-slate-900 p-7 transition duration-300 hover:-translate-y-2 hover:border-cyan-400/40 hover:bg-slate-900/80"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-400/10 text-3xl transition group-hover:bg-cyan-400/20">
                {service.icon}
              </div>

              <h2 className="mt-6 text-xl font-semibold">
                {service.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                {service.description}
              </p>

              <Link
                to={`/services/${service.slug}`}
                className="mt-6 inline-block text-sm font-semibold text-cyan-400 hover:text-cyan-300"
              >
                Learn More →
              </Link>

            </div>
          ))}

        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-500/10 to-slate-900 p-8 text-center sm:p-12">

          <h2 className="text-3xl font-bold sm:text-4xl">
            Have a project in mind?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Let's discuss your idea and build something amazing together.
          </p>

          <Link
            to="/contact"
            className="mt-7 inline-block rounded-lg bg-cyan-500 px-7 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Start a Project
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Services;