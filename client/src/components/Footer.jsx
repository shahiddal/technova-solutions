import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-white">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Company */}
          <div className="lg:col-span-2">

            <Link
              to="/"
              className="text-2xl font-bold tracking-wide"
            >
              Tech<span className="text-cyan-400">Nova</span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-gray-400">
              TechNova Solutions helps businesses build modern websites,
              powerful applications and scalable digital products using
              modern technologies.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-sm text-gray-400 transition hover:border-cyan-400 hover:text-cyan-400"
                aria-label="LinkedIn"
              >
                in
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-sm text-gray-400 transition hover:border-cyan-400 hover:text-cyan-400"
                aria-label="GitHub"
              >
                GH
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-sm text-gray-400 transition hover:border-cyan-400 hover:text-cyan-400"
                aria-label="Instagram"
              >
                IG
              </a>

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold">Quick Links</h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-gray-400">

              <Link
                to="/"
                className="transition hover:text-cyan-400"
              >
                Home
              </Link>

              <Link
                to="/about"
                className="transition hover:text-cyan-400"
              >
                About
              </Link>

              <Link
                to="/services"
                className="transition hover:text-cyan-400"
              >
                Services
              </Link>

              <Link
                to="/portfolio"
                className="transition hover:text-cyan-400"
              >
                Portfolio
              </Link>

              <Link
                to="/blog"
                className="transition hover:text-cyan-400"
              >
                Blog
              </Link>

              <Link
                to="/contact"
                className="transition hover:text-cyan-400"
              >
                Contact
              </Link>

            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold">Services</h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-gray-400">

              <span>Web Development</span>
              <span>MERN Development</span>
              <span>App Development</span>
              <span>UI/UX Design</span>
              <span>E-Commerce Solutions</span>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-center text-sm text-gray-500 sm:px-8 md:flex-row md:items-center md:justify-between md:text-left lg:px-10">

          <p>
            © 2026 TechNova Solutions. All Rights Reserved.
          </p>

          <div className="flex justify-center gap-5">
            <span className="cursor-pointer transition hover:text-gray-300">
              Privacy Policy
            </span>

            <span className="cursor-pointer transition hover:text-gray-300">
              Terms & Conditions
            </span>
          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;