import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import { API_URL, useApi } from "../api";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  message: "",
};

const MESSAGE_MIN = 20;
const FIELD_ORDER = ["name", "email", "phone", "company", "service", "message"];

// Same rules as server/utils/validateEnquiry.js, so visitors see errors before submitting
function validate(form) {
  const errors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();
  const message = form.message.trim();
  const phoneDigits = phone.replace(/\D/g, "").length;

  if (!name) errors.name = "Name is required";
  else if (name.length < 2) errors.name = "Name must be at least 2 characters";

  if (!email) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Please enter a valid email address";

  if (!phone) errors.phone = "Phone number is required";
  else if (!/^\+?[\d\s\-().]+$/.test(phone) || phoneDigits < 7 || phoneDigits > 15)
    errors.phone = "Please enter a valid phone number";

  if (!form.service) errors.service = "Please select a service";

  if (!message) errors.message = "Message is required";
  else if (message.length < MESSAGE_MIN)
    errors.message = `Message must be at least ${MESSAGE_MIN} characters`;

  return errors;
}

function FieldError({ name, error }) {
  if (!error) return null;

  return (
    <p id={`${name}-error`} className="mt-2 text-sm text-red-400">
      {error}
    </p>
  );
}

const inputClass = (error) =>
  `w-full rounded-xl border bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400 ${
    error ? "border-red-500/60" : "border-white/10"
  }`;

function Contact() {
  const [searchParams, setSearchParams] = useSearchParams();
  const projectSlug = searchParams.get("project");

  // Preselect the service (and project) when coming from an "Enquire Now" button
  const { data: services } = useApi("/api/services");
  const { data: project } = useApi(
    projectSlug ? `/api/projects/${projectSlug}` : null
  );

  const serviceOptions = [
    ...(services || []).map(({ slug, title }) => ({ slug, title })),
    { slug: "other", title: "Other" },
  ];

  const [formData, setFormData] = useState({
    ...EMPTY_FORM,
    service: searchParams.get("service") || "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const formRef = useRef(null);

  // A service from the URL or project only counts once it matches a loaded option
  const chosenService = formData.service || project?.service || "";
  const form = {
    ...formData,
    service: serviceOptions.some((option) => option.slug === chosenService)
      ? chosenService
      : "",
  };

  const focusFirstError = (fieldErrors) => {
    const first = FIELD_ORDER.find((field) => fieldErrors[field]);
    if (first) formRef.current.elements[first]?.focus();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const clearProject = () => {
    // Keep the service the project preselected
    setFormData({ ...formData, service: form.service });
    setSearchParams({}, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setSuccess("");
    setError("");

    const fieldErrors = validate(form);

    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      setError("Please correct the highlighted fields.");
      focusFirstError(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/enquiries`,
        {
          ...form,
          project: project?.slug,
          website: formRef.current.elements.website.value,
        },
        // The free API host can take ~50 s to wake up
        { timeout: 70000 }
      );

      setSuccess(response.data.message);
      setFormData(EMPTY_FORM);
      setSearchParams({}, { replace: true });
    } catch (error) {
      console.error("Enquiry form error:", error);

      const data = error.response?.data;

      if (data?.errors) {
        setErrors(data.errors);
        focusFirstError(data.errors);
      }

      setError(
        data?.message ||
          "We couldn't reach our server. Please check your connection and try again."
      );
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

          {/* Enquiry Form */}
          <div
            id="enquiry-form"
            className="rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8"
          >

            <h2 className="text-2xl font-bold">
              Send Us an Enquiry
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Tell us about your requirements and we'll get back to you within
              1 business day.
            </p>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              className="mt-7 space-y-5"
            >

              {success && (
                <div
                  role="status"
                  className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-4 text-green-400"
                >
                  <p className="font-semibold">Enquiry sent successfully ✓</p>
                  <p className="mt-1 text-sm text-green-300/90">{success}</p>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400"
                >
                  {error}
                </div>
              )}

              {project && (
                <div className="flex items-start justify-between gap-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-300">
                  <span>
                    Enquiring about project:{" "}
                    <strong className="text-white">{project.title}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={clearProject}
                    aria-label="Remove project from enquiry"
                    className="text-cyan-300 transition hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Honeypot: hidden from people, bots tend to fill it */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* Name */}
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-300">
                    Your Name <span className="text-cyan-400">*</span>
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    maxLength={100}
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={inputClass(errors.name)}
                  />

                  <FieldError name="name" error={errors.name} />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
                    Email Address <span className="text-cyan-400">*</span>
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    maxLength={254}
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={inputClass(errors.email)}
                  />

                  <FieldError name="email" error={errors.email} />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-300">
                    Phone Number <span className="text-cyan-400">*</span>
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    maxLength={30}
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    className={inputClass(errors.phone)}
                  />

                  <FieldError name="phone" error={errors.phone} />
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="mb-2 block text-sm font-medium text-gray-300">
                    Company <span className="text-gray-500">(optional)</span>
                  </label>

                  <input
                    id="company"
                    type="text"
                    name="company"
                    maxLength={100}
                    autoComplete="organization"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company name"
                    aria-invalid={Boolean(errors.company)}
                    aria-describedby={errors.company ? "company-error" : undefined}
                    className={inputClass(errors.company)}
                  />

                  <FieldError name="company" error={errors.company} />
                </div>

              </div>

              {/* Service */}
              <div>
                <label htmlFor="service" className="mb-2 block text-sm font-medium text-gray-300">
                  Service <span className="text-cyan-400">*</span>
                </label>

                <select
                  id="service"
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                  aria-invalid={Boolean(errors.service)}
                  aria-describedby={errors.service ? "service-error" : undefined}
                  className={inputClass(errors.service)}
                >
                  <option value="" disabled>
                    {services ? "Select a service" : "Loading services..."}
                  </option>

                  {serviceOptions.map((option) => (
                    <option key={option.slug} value={option.slug}>
                      {option.title}
                    </option>
                  ))}
                </select>

                <FieldError name="service" error={errors.service} />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-300">
                  Message <span className="text-cyan-400">*</span>
                </label>

                <textarea
                  id="message"
                  name="message"
                  maxLength={5000}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project, goals and timeline..."
                  rows="5"
                  required
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : "message-hint"}
                  className={`resize-none ${inputClass(errors.message)}`}
                ></textarea>

                {errors.message ? (
                  <FieldError name="message" error={errors.message} />
                ) : (
                  <p id="message-hint" className="mt-2 text-xs text-gray-500">
                    Minimum {MESSAGE_MIN} characters ({formData.message.trim().length}/5000)
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="w-full rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending your enquiry..." : "Send Enquiry"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Contact;
