import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:pt-48">

        {/* Background Glow */}
        <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl"></div>

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-4xl text-center">

            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Digital Solutions for Modern Business
            </p>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
              We Build
              <span className="text-cyan-400"> Digital Experiences </span>
              That Matter.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
              TechNova Solutions helps businesses build modern websites,
              powerful applications, and scalable digital products.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

              <Link
                to="/services"
                className="rounded-lg bg-cyan-500 px-7 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Explore Services
              </Link>

              <Link
                to="/contact"
                className="rounded-lg border border-white/20 px-7 py-3.5 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-400"
              >
                Let's Talk
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="border-t border-white/10 bg-slate-900/50 py-20">

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              What We Do
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Our Core Services
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              We provide modern technology solutions to help businesses grow
              and succeed in the digital world.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {/* Card 1 */}
            <Link
              to="/services/web-development"
              className="block rounded-2xl border border-white/10 bg-slate-950 p-6 transition duration-300 hover:-translate-y-2 hover:border-cyan-400/40"
            >
              <div className="mb-5 text-3xl">💻</div>

              <h3 className="text-xl font-semibold">
                Web Development
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Modern and responsive websites built with the latest
                technologies.
              </p>
            </Link>

            {/* Card 2 */}
            <Link
              to="/services/app-development"
              className="block rounded-2xl border border-white/10 bg-slate-950 p-6 transition duration-300 hover:-translate-y-2 hover:border-cyan-400/40"
            >
              <div className="mb-5 text-3xl">📱</div>

              <h3 className="text-xl font-semibold">
                App Development
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Powerful applications designed for modern users and
                businesses.
              </p>
            </Link>

            {/* Card 3 */}
            <Link
              to="/services/ui-ux-design"
              className="block rounded-2xl border border-white/10 bg-slate-950 p-6 transition duration-300 hover:-translate-y-2 hover:border-cyan-400/40"
            >
              <div className="mb-5 text-3xl">🎨</div>

              <h3 className="text-xl font-semibold">
                UI/UX Design
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Clean and user-friendly interfaces that provide great
                experiences.
              </p>
            </Link>

            {/* Card 4 */}
            <Link
              to="/services"
              className="block rounded-2xl border border-white/10 bg-slate-950 p-6 transition duration-300 hover:-translate-y-2 hover:border-cyan-400/40"
            >
              <div className="mb-5 text-3xl">🚀</div>

              <h3 className="text-xl font-semibold">
                Digital Solutions
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Scalable technology solutions tailored to your business
                needs.
              </p>
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;