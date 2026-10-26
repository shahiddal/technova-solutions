function About() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28">

      {/* Hero */}
      <section className="px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              About TechNova
            </p>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
              Building the Future with Technology
            </h1>

            <p className="mt-6 text-base leading-7 text-gray-400 sm:text-lg">
              We are a technology company focused on creating modern,
              scalable and user-friendly digital solutions for businesses.
            </p>
          </div>

          {/* About Content */}
          <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">

            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Who We Are
              </p>

              <h2 className="text-3xl font-bold sm:text-4xl">
                Technology that helps businesses grow.
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                TechNova Solutions is an IT company that provides web
                development, application development, UI/UX design and
                digital solutions.
              </p>

              <p className="mt-4 leading-7 text-gray-400">
                Our goal is to combine technology, creativity and business
                understanding to build products that create real value.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-5">

                <div className="rounded-xl border border-white/10 bg-slate-900 p-5">
                  <h3 className="text-3xl font-bold text-cyan-400">50+</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Projects Delivered
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-900 p-5">
                  <h3 className="text-3xl font-bold text-cyan-400">25+</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Happy Clients
                  </p>
                </div>

              </div>
            </div>

            {/* Right Side */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-slate-900 p-8 sm:p-10">

              <div className="grid gap-6 sm:grid-cols-2">

                <div>
                  <div className="text-3xl">🎯</div>
                  <h3 className="mt-4 text-xl font-semibold">
                    Our Mission
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    To deliver reliable and innovative technology solutions
                    that solve real business problems.
                  </p>
                </div>

                <div>
                  <div className="text-3xl">🚀</div>
                  <h3 className="mt-4 text-xl font-semibold">
                    Our Vision
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    To become a trusted technology partner for businesses
                    around the world.
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

export default About;