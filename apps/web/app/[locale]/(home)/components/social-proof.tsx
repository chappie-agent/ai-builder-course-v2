import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "This course completely changed how I approach software development. I shipped three side projects in the time it used to take me to finish one.",
    name: "Sarah Chen",
    role: "Full-Stack Developer",
    initials: "SC",
  },
  {
    quote:
      "The agentic systems module alone was worth the entire course. I now automate workflows that used to eat up half my week.",
    name: "Marcus Rivera",
    role: "Product Engineer",
    initials: "MR",
  },
  {
    quote:
      "Finally an AI course that focuses on building real things instead of just theory. The OpenClaw tooling section is incredibly practical.",
    name: "Anika Johal",
    role: "Startup Founder",
    initials: "AJ",
  },
];

const stats = [
  { value: "2,400+", label: "Students enrolled" },
  { value: "94%", label: "Completion rate" },
  { value: "4.9", label: "Average rating" },
  { value: "10", label: "Weeks to production" },
];

export const SocialProof = () => {
  return (
    <section className="w-full px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Stats bar */}
        <div className="mb-16 grid grid-cols-2 gap-6 rounded-2xl border border-[#e8dfd0]/60 bg-[#faf7f2] p-6 sm:grid-cols-4 sm:rounded-3xl sm:p-8 md:mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-medium text-2xl tracking-tight text-[#2c231a] sm:text-3xl md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-[#8b7355] sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#8b7355]">
            What students say
          </p>
          <h2 className="mx-auto max-w-xl font-medium text-3xl leading-tight tracking-tight text-[#2c231a] sm:text-4xl md:text-5xl">
            Trusted by builders
          </h2>
        </div>

        {/* Testimonial cards */}
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-between rounded-2xl border border-[#e8dfd0]/60 bg-gradient-to-b from-[#faf7f2] to-[#f5f0e8] p-6 sm:rounded-3xl sm:p-8"
            >
              <div>
                {/* Stars */}
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      // biome-ignore lint/suspicious/noArrayIndexKey: static
                      key={i}
                      className="h-4 w-4 fill-[#8b7355] text-[#8b7355]"
                    />
                  ))}
                </div>
                <p className="text-base leading-relaxed text-[#4a3f33]">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-[#e8dfd0]/60 pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2c231a] text-xs font-medium text-[#f5f0e8]">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2c231a]">{t.name}</p>
                  <p className="text-xs text-[#8b7355]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
