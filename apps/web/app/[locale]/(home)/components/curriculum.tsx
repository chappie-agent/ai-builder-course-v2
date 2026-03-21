import { Check } from "lucide-react";

const phases = [
  {
    number: "01",
    title: "Foundations",
    weeks: "Weeks 1–3",
    items: [
      "Understanding large language models",
      "Prompt engineering fundamentals",
      "Setting up your AI development environment",
      "Introduction to OpenClaw tooling",
    ],
  },
  {
    number: "02",
    title: "Build",
    weeks: "Weeks 4–7",
    items: [
      "AI-assisted coding workflows",
      "Image & video generation mastery",
      "Building your first AI agent",
      "API integration patterns",
    ],
  },
  {
    number: "03",
    title: "Scale",
    weeks: "Weeks 8–10",
    items: [
      "Multi-agent orchestration",
      "Production workflow automations",
      "Deploying & monitoring AI systems",
      "Shipping your capstone project",
    ],
  },
];

export const Curriculum = () => {
  return (
    <section id="curriculum" className="w-full px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Large warm container */}
        <div className="overflow-hidden rounded-[2rem] bg-[#2c231a] sm:rounded-[3rem]">
          <div className="px-6 py-14 sm:px-12 sm:py-20 md:px-16 lg:px-24">
            {/* Section header */}
            <div className="mb-12 max-w-2xl md:mb-16">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#c4b5a0]">
                The journey
              </p>
              <h2 className="font-medium text-3xl leading-tight tracking-tight text-[#f5f0e8] sm:text-4xl md:text-5xl">
                From curious to capable
                <br />
                in 10 weeks
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#c4b5a0]/70 md:text-lg">
                A structured path through three distinct phases, each building on the last.
                Every week includes hands-on projects and guided exercises.
              </p>
            </div>

            {/* Phases */}
            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              {phases.map((phase) => (
                <div
                  key={phase.number}
                  className="rounded-2xl border border-[#4a3f33] bg-[#362d22] p-6 sm:p-8"
                >
                  <div className="mb-4 flex items-baseline gap-3">
                    <span className="font-mono text-3xl font-light text-[#8b7355]">
                      {phase.number}
                    </span>
                    <div>
                      <h3 className="font-medium text-xl text-[#f5f0e8]">
                        {phase.title}
                      </h3>
                      <p className="text-sm text-[#c4b5a0]/60">{phase.weeks}</p>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#8b7355]" />
                        <span className="text-sm leading-relaxed text-[#c4b5a0]/80">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
