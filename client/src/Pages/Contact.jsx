import { useState } from "react";
import axios from "axios";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setSuccess("");
  setError("");

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/contact`,
      formData
    );

    setSuccess(response.data.message);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    if (error.response) {
      setError(error.response.data.message);
    } else {
      setError("Something went wrong. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-950 px-5 pb-20 pt-28 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Get In Touch
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Let's Work Together
          </h1>

          <p className="mt-6 text-base leading-7 text-gray-400 sm:text-lg">
            Have a project or an idea? Send us a message and our team will
            get back to you.
          </p>
        </div>

        {/* Contact Section */}
        <div className="mt-14 grid gap-10 lg:grid-cols-2">

          {/* Contact Information */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Contact Information
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              We'd love to hear from you.
            </h2>

            <p className="mt-5 max-w-lg leading-7 text-gray-400">
              Whether you have a question, want to discuss a project, or
              simply want to say hello, feel free to reach out to us.
            </p>

            {/* Information Cards */}
            <div className="mt-8 space-y-5">

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-900 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl">
                  📧
                </div>

                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    hello@technova.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-900 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl">
                  📞
                </div>

                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    +91 98765 43210
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-900 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl">
                  📍
                </div>

                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Ahmedabad, Gujarat, India
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8">

            <h2 className="text-2xl font-bold">
              Send Us a Message
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Fill out the form below and we'll get back to you soon.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">

            {success && (
  <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-400">
    {success}
  </div>
)}

{error && (
  <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
    {error}
  </div>
)}


              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Your Name
                </label>

                <input
                  type="text"
                  name="name"
                  maxLength={100}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  maxLength={254}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  maxLength={200}
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400"
                />
              </div>

              {/* Message */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Message
                </label>

                <textarea
                  name="message"
                  maxLength={5000}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project..."
                  rows="5"
                  required
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400"
                ></textarea>
              </div>

              {/* Submit */}
              {/* <button
                type="submit"
                className="w-full rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Send Message →
              </button> */}

              <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
              {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Contact;