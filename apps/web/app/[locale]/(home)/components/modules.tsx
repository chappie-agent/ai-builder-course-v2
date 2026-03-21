import { Bot, Code2, Film, Layers, Sparkles, Workflow } from "lucide-react";

const modules = [
  {
    icon: Code2,
    title: "AI-Assisted Development",
    description:
      "Write better code faster. Use AI pair programming to build, debug, and ship production applications with confidence.",
    accent: "from-[#8b7355] to-[#a08b6e]",
  },
  {
    icon: Bot,
    title: "Agentic Systems",
    description:
      "Design and deploy autonomous AI agents that reason, plan, and execute complex multi-step tasks on your behalf.",
    accent: "from-[#6b5c4c] to-[#8b7355]",
  },
  {
    icon: Sparkles,
    title: "Image Generation",
    description:
      "Master prompt engineering for visual AI. Create stunning images, brand assets, and design concepts with generative models.",
    accent: "from-[#a08b6e] to-[#c4b5a0]",
  },
  {
    icon: Film,
    title: "Video Generation",
    description:
      "Produce AI-generated video content, motion graphics, and cinematic visuals using cutting-edge generation tools.",
    accent: "from-[#8b7355] to-[#6b5c4c]",
  },
  {
    icon: Workflow,
    title: "Workflows & Automations",
    description:
      "Build end-to-end automated pipelines that connect AI models, APIs, and business logic into seamless workflows.",
    accent: "from-[#6b5c4c] to-[#4a3f33]",
  },
  {
    icon: Layers,
    title: "OpenClaw & Tooling",
    description:
      "Learn the OpenClaw ecosystem and modern AI tooling stack. Set up professional development environments that scale.",
    accent: "from-[#4a3f33] to-[#6b5c4c]",
  },
];

export const Modules = () => {
  return (
    <section id="modules" className="w-full px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-12 max-w-2xl md:mb-16">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#8b7355]">
            What you'll learn
          </p>
          <h2 className="font-medium text-3xl leading-tight tracking-tight text-[#2c231a] sm:text-4xl md:text-5xl">
            Six pillars of
            <br />
            modern AI craft
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#6b5c4c]/70 md:text-lg">
            Each module is designed to take you from understanding to implementation.
            Real projects, real tools, real results.
          </p>
        </div>

        {/* Module cards grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <div
              key={mod.title}
              className="group relative overflow-hidden rounded-2xl border border-[#e8dfd0]/60 bg-gradient-to-b from-[#faf7f2] to-[#f5f0e8] p-6 transition-all duration-300 hover:border-[#c4b5a0]/60 hover:shadow-md sm:rounded-3xl sm:p-8"
            >
              {/* Icon */}
              <div className={`mb-5 inline-flex rounded-xl bg-gradient-to-br ${mod.accent} p-3`}>
                <mod.icon className="h-5 w-5 text-white" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h3 className="mb-2 font-medium text-lg text-[#2c231a] sm:text-xl">
                {mod.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#6b5c4c]/70">
                {mod.description}
              </p>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#8b7355] to-[#c4b5a0] transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
