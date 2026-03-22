import { Check, ArrowRight, PhoneCall } from "lucide-react";
import Link from "next/link";
import { NavBar } from "../(home)/components/nav-bar";
import { SiteFooter } from "../(home)/components/site-footer";

const tiers = [
  {
    name: "Free",
    price: "€0",
    period: null,
    description:
      "Get a feel for the course. No credit card, no commitment — just start.",
    cta: { label: "Start for free", href: "/enroll?tier=free", primary: false },
    badge: null,
    highlighted: false,
    features: [
      "Introduction module",
      "Course overview & roadmap",
      "Community access",
      "Sample exercises",
    ],
  },
  {
    name: "Mini",
    price: "€97",
    period: "one-time",
    description:
      "The core building blocks. Ideal if you want to move fast with focused depth.",
    cta: { label: "Enroll in Mini", href: "/enroll?tier=mini", primary: false },
    badge: null,
    highlighted: false,
    features: [
      "Everything in Free",
      "3 core modules",
      "Hands-on project exercises",
      "Module recordings (lifetime)",
      "Email support",
    ],
  },
  {
    name: "Full",
    price: "€297",
    period: "one-time",
    description:
      "The complete experience. All modules, live sessions, community, and your capstone reviewed.",
    cta: { label: "Enroll in Full", href: "/enroll?tier=full", primary: true },
    badge: "Most popular",
    highlighted: true,
    features: [
      "Everything in Mini",
      "All 6 modules",
      "Live cohort sessions",
      "Capstone project review",
      "Private community access",
      "Lifetime access to recordings",
      "Certificate of completion",
    ],
  },
];

const Pricing = () => (
  <>
    <NavBar />
    <main className="min-h-screen bg-[linear-gradient(180deg,#d6c4b4_0%,#eee5da_18%,#f7f2ea_42%,#fbf8f3_100%)] text-[#2c231a]">
      <section className="w-full px-4 pt-32 pb-16 sm:px-6 md:pt-40 md:pb-24">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-16 text-center md:mb-20">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#8b7355]">
              Pricing
            </p>
            <h1 className="mx-auto max-w-2xl font-medium text-4xl leading-tight tracking-tight text-[#2c231a] sm:text-5xl md:text-6xl">
              Pick your path
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#6b5c4c]/70 md:text-lg">
              Start free and upgrade when you're ready. All tiers include lifetime
              access to what you enroll in.
            </p>
          </div>

          {/* Tier cards */}
          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {tiers.map((tier) =>
              tier.highlighted ? (
                /* Highlighted card — dark */
                <div
                  key={tier.name}
                  className="relative overflow-hidden rounded-[2rem] bg-[#2c231a] p-8 sm:rounded-[3rem] sm:p-10"
                >
                  {tier.badge && (
                    <div className="mb-6 inline-flex">
                      <span className="rounded-full border border-[#8b7355]/50 bg-[#8b7355]/20 px-4 py-1 text-xs font-medium text-[#c4b5a0]">
                        {tier.badge}
                      </span>
                    </div>
                  )}
                  <p className="font-medium text-2xl text-[#f5f0e8]">
                    {tier.name}
                  </p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-medium text-5xl tracking-tight text-[#f5f0e8]">
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-sm text-[#c4b5a0]/60">
                        {tier.period}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#c4b5a0]/70">
                    {tier.description}
                  </p>

                  <Link
                    href={tier.cta.href}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#f5f0e8] px-6 py-3.5 text-sm font-medium text-[#2c231a] transition-colors hover:bg-white"
                  >
                    {tier.cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <ul className="mt-8 space-y-3.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#8b7355]" />
                        <span className="text-sm text-[#c4b5a0]/80">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                /* Standard card — light */
                <div
                  key={tier.name}
                  className="relative overflow-hidden rounded-[2rem] border border-[#e8dfd0]/60 bg-gradient-to-b from-[#faf7f2] to-[#f5f0e8] p-8 sm:rounded-[3rem] sm:p-10"
                >
                  {tier.badge && (
                    <div className="mb-6 inline-flex">
                      <span className="rounded-full border border-[#8b7355]/40 bg-[#8b7355]/10 px-4 py-1 text-xs font-medium text-[#8b7355]">
                        {tier.badge}
                      </span>
                    </div>
                  )}
                  <p className="font-medium text-2xl text-[#2c231a]">
                    {tier.name}
                  </p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-medium text-5xl tracking-tight text-[#2c231a]">
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-sm text-[#6b5c4c]/60">
                        {tier.period}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#6b5c4c]/70">
                    {tier.description}
                  </p>

                  <Link
                    href={tier.cta.href}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-[#c4b5a0]/50 bg-white/60 px-6 py-3.5 text-sm font-medium text-[#2c231a] transition-colors hover:bg-white"
                  >
                    {tier.cta.label}
                  </Link>

                  <ul className="mt-8 space-y-3.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#8b7355]" />
                        <span className="text-sm text-[#6b5c4c]/80">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>

          {/* Enterprise/team note */}
          <div className="mt-8 rounded-2xl border border-[#e8dfd0]/60 bg-[#faf7f2] px-8 py-6 sm:rounded-3xl md:mt-10">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-medium text-[#2c231a]">
                  Team or company enrollment?
                </p>
                <p className="mt-1 text-sm text-[#6b5c4c]/70">
                  We offer group rates and tailored programs for teams and
                  organizations.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#c4b5a0]/50 bg-white/70 px-6 py-2.5 text-sm font-medium text-[#2c231a] transition-colors hover:bg-white"
              >
                <PhoneCall className="h-4 w-4" />
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>
);

export default Pricing;
