import { Link, useParams } from "react-router-dom";

import { services } from "../data/services";
import { findBySlug, getRelated } from "../data/helpers";
import NotFound from "./NotFound";
import {
  Breadcrumb,
  CheckList,
  CtaSection,
  HeroVisual,
  InfoCard,
  NumberedGrid,
  PillList,
  RelatedGrid,
  SectionHeading,
  StepList,
} from "../components/DetailSections";

function ServiceDetail() {
  const { slug } = useParams();

  const service = findBySlug(services, slug);

  if (!service) {
    return (
      <NotFound
        title="Service Not Found"
        message="The service you are looking for does not exist."
        backTo="/services"
        backLabel="Back to Services"
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Services", to: "/services" },
            { label: service.title },
          ]}
        />

        {/* Hero */}
        <section className="grid items-center gap-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Our Services
            </p>

            <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
              {service.title}
            </h1>

            <p className="mt-6 text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              {service.shortDescription}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/contact"
                className="rounded-lg bg-cyan-500 px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Get Started
              </Link>

              <Link
                to="/contact"
                className="rounded-lg border border-white/20 px-6 py-3 text-center font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-400"
              >
                Send an Enquiry
              </Link>
            </div>
          </div>

          <HeroVisual icon={service.icon} />
        </section>

        {/* Description + Technologies */}
        <section className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="About This Service"
              title="Solutions built around your business"
            />

            <p className="mt-5 leading-8 text-slate-400">
              {service.description}
            </p>
          </div>

          <InfoCard title="Technologies & Tools">
            <PillList items={service.technologies} />
          </InfoCard>
        </section>

        {/* Features */}
        <section className="mt-16">
          <SectionHeading eyebrow="What We Provide" title="Key Features" />

          <div className="mt-8">
            <NumberedGrid items={service.features} />
          </div>
        </section>

        {/* Process */}
        <section className="mt-16">
          <SectionHeading eyebrow="How We Work" title="Our Process" />

          <div className="mt-8">
            <StepList steps={service.process} />
          </div>
        </section>

        {/* Why choose + Benefits */}
        <section className="mt-16 grid gap-8 lg:grid-cols-2">
          <InfoCard title="Why Choose TechNova">
            <CheckList items={service.whyChoose} />
          </InfoCard>

          <InfoCard title="Benefits for Your Business">
            <CheckList items={service.benefits} />
          </InfoCard>
        </section>

        <CtaSection
          title="Ready to build your next project?"
          text="Let's discuss your requirements and create a solution that fits your business."
        />

        <RelatedGrid
          title="Related Services"
          items={getRelated(services, service.slug)}
          basePath="/services"
          linkLabel="Learn More"
        />
      </div>
    </div>
  );
}

export default ServiceDetail;
