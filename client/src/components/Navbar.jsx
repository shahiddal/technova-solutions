import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-xl font-bold tracking-wide text-white sm:text-2xl"
        >
          Tech<span className="text-cyan-400">Nova</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm text-gray-300 transition hover:text-cyan-400"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="text-sm text-gray-300 transition hover:text-cyan-400"
          >
            About
          </Link>

          <Link
            to="/services"
            className="text-sm text-gray-300 transition hover:text-cyan-400"
          >
            Services
          </Link>

          <Link
            to="/portfolio"
            className="text-sm text-gray-300 transition hover:text-cyan-400"
          >
            Portfolio
          </Link>

          <Link
            to="/blog"
            className="text-sm text-gray-300 transition hover:text-cyan-400"
          >
            Blog
          </Link>

          <Link
            to="/contact"
            className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Contact
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl text-white md:hidden"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-white/10 bg-slate-950 px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4">

            <Link
              to="/"
              onClick={closeMenu}
              className="text-gray-300 transition hover:text-cyan-400"
            >
              Home
            </Link>

            <Link
              to="/about"
              onClick={closeMenu}
              className="text-gray-300 transition hover:text-cyan-400"
            >
              About
            </Link>

            <Link
              to="/services"
              onClick={closeMenu}
              className="text-gray-300 transition hover:text-cyan-400"
            >
              Services
            </Link>

            <Link
              to="/portfolio"
              onClick={closeMenu}
              className="text-gray-300 transition hover:text-cyan-400"
            >
              Portfolio
            </Link>

            <Link
              to="/blog"
              onClick={closeMenu}
              className="text-gray-300 transition hover:text-cyan-400"
            >
              Blog
            </Link>

            <Link
              to="/contact"
              onClick={closeMenu}
              className="rounded-lg bg-cyan-500 px-5 py-3 text-center font-semibold text-slate-950"
            >
              Contact
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;