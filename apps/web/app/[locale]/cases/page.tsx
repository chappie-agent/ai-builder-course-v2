import { ArrowRight, Bot, Image as ImageIcon, Layers3, Sparkles, Video } from "lucide-react";
import Link from "next/link";
import { NavBar } from "../(home)/components/nav-bar";
import { SiteFooter } from "../(home)/components/site-footer";

const caseStudies = [
  {
    title: "AI Product Studio",
    category: "AI-assisted development",
    result: "A premium concept-to-launch workflow for building and shipping micro SaaS ideas faster.",
    icon: Layers3,
    gradient:
      "bg-[radial-gradient(circle_at_top_left,rgba(218,197,173,0.46),transparent_40%),linear-gradient(135deg,#f8f2ea,#ebddcc,#dac7b2)]",
    bullets: [
      "Landing page and product concept",
      "AI-assisted UI build workflow",
      "GitHub and deploy-ready structure",
    ],
  },
  {
    title: "OpenClaw Operations Hub",
    category: "Agents and workflows",
    result: "A practical agent system that monitors tasks, orchestrates tools, and supports real work in the background.",
    icon: Bot,
    gradient:
      "bg-[radial-gradient(circle_at_top_right,rgba(205,184,159,0.44),transparent_42%),linear-gradient(135deg,#f6efe7,#eadcc8,#d9c2a6)]",
    bullets: [
      "Custom main agent behavior",
      "Developer and automation flows",
      "Memory and task orchestration",
    ],
  },
  {
    title: "Visual Content Engine",
    category: "Image and video generation",
    result: "A content workflow for generating branded campaign images and short-form video concepts at scale.",
    icon: ImageIcon,
    gradient:
      "bg-[radial-gradient(circle_at_bottom_right,rgba(219,198,171,0.42),transparent_44%),linear-gradient(135deg,#f7f1e8,#e7d7c4,#d7c0a4)]",
    bullets: [
      "Brand-aligned prompt systems",
      "Image and motion concept outputs",
      "Creative production shortcuts",
    ],
  },
  {
    title: "Workflow Automation Sprint",
    category: "Automations",
    result: "A smart internal system that connects repetitive work, APIs, and AI logic into one clear flow.",
    icon: Sparkles,
    gradient:
      "bg-[radial-gradient(circle_at_top_left,rgba(214,190,164,0.46),transparent_38%),linear-gradient(135deg,#f8f3ec,#ecdfd0,#dbc8b1)]",
    bullets: [
      "Automated content and admin tasks",
      "Better handoffs between tools",
      "Reduced manual busywork",
    ],
  },
  {
    title: "AI Video Launch Kit",
    category: "Video generation",
    result: "A structured concept package for launch assets, short-form video ideas, and campaign sequences.",
    icon: Video,
    gradient:
      "bg-[radial-gradient(circle_at_top_right,rgba(225,206,183,0.44),transparent_40%),linear-gradient(135deg,#f7f1e9,#e9dccd,#d8c3aa)]",
    bullets: [
      "Storyboard-style thinking",
      "Reusable video prompt structure",
      "Fast iteration on launch creative",
    ],
  },
  {
    title: "AI Builder Portfolio Project",
    category: "Capstone build",
    result: "A complete final project that combines interface design, AI workflows, and product thinking into one polished concept.",
    icon: ArrowRight,
    gradient:
      "bg-[radial-gradient(circle_at_bottom_left,rgba(210,186,159,0.44),transparent_44%),linear-gradient(135deg,#f8f2ea,#ead9c5,#d4bea0)]",
    bullets: [
      "Portfolio-worthy output",
      "Concept, UI, and workflow integration",
      "Presentation-ready final case",
    ],
  },
];

const EnrolledOutcomes = () => {
  return (
    <section className="mt-8 grid gap-4 md:grid-cols-3">
      {[
        "A project you can actually show",
        "A clearer AI workflow you understand",
        "A stronger story for clients or your own business",
      ].map((item, index) => (
        <div
          key={item}
          className="reveal-up rounded-[1.5rem] border border-[#e8dfd0]/60 bg-white/75 p-5 shadow-sm"
          style={{ animationDelay: `${120 + index * 80}ms` }}
        >
          <p className="text-base font-medium text-[#2c231a]">{item}</p>
        </div>
      ))}
    </section>
  );
};

const CasesPage = () => {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[linear-gradient(180deg,#d6c4b4_0%,#eee5da_18%,#f7f2ea_42%,#fbf8f3_100%)] px-4 pt-28 pb-16 text-[#2c231a] sm:px-6 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <section className="reveal-up overflow-hidden rounded-[2rem] border border-[#e8dfd0]/60 bg-gradient-to-br from-[#f5f0e8] via-[#ede6da] to-[#e8dfd0] px-6 py-16 shadow-sm sm:rounded-[3rem] sm:px-12 md:px-16 md:py-20 lg:px-24">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#8b7355]">
              Cases
            </p>
            <h1 className="max-w-4xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              End projects that help future students imagine what is possible
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#6b5c4c]/80 md:text-lg">
              These are the kinds of capstone-style outcomes students build during the course. Each one turns AI from a vague promise into something tangible, useful, and portfolio-worthy.
            </p>
          </section>

          <EnrolledOutcomes />

          <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {caseStudies.map((item, index) => (
              <article
                key={item.title}
                className="reveal-up group overflow-hidden rounded-[2rem] border border-[#e8dfd0]/60 bg-[#faf7f2] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#cfb89e]/70 hover:shadow-[0_20px_40px_rgba(112,83,55,0.08)] sm:rounded-[2.25rem] sm:p-8"
                style={{ animationDelay: `${140 + index * 80}ms` }}
              >
                <div className={`h-56 rounded-[1.5rem] border border-[#e6d7c7]/70 ${item.gradient} p-5`}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/50 bg-white/55 shadow-sm backdrop-blur-sm">
                    <item.icon className="h-5 w-5 text-[#6a5641]" strokeWidth={1.7} />
                  </div>
                  <div className="mt-20 inline-flex rounded-full border border-[#cbb59a]/60 bg-white/55 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#7b6651] backdrop-blur-sm">
                    {item.category}
                  </div>
                </div>
                <h2 className="mt-6 text-2xl font-medium tracking-tight text-[#2c231a] sm:text-3xl">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#6b5c4c]/78 sm:text-base">
                  {item.result}
                </p>
                <ul className="mt-6 space-y-3">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-sm text-[#4f4337]">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#8b7355]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </section>

          <section className="reveal-up-delay-2 mt-10 rounded-[2rem] border border-[#d9c7b2]/70 bg-[linear-gradient(180deg,#f8f2ea,#efe3d5)] px-6 py-12 shadow-sm sm:rounded-[3rem] sm:px-10 md:px-14 md:py-16">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8b7355]">
              Why this matters
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight text-[#2c231a] sm:text-4xl md:text-5xl">
              People do not just buy a course. They buy a clearer picture of what they could build next.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#6b5c4c]/78 md:text-lg">
              These cases show the course outcome in a way that feels real. They help future students imagine their own project, their own workflow, and their own momentum.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/enroll"
                className="inline-flex items-center justify-center rounded-full bg-[#2c231a] px-6 py-3 text-sm font-medium text-[#f5f0e8] transition-colors hover:bg-[#3d3127]"
              >
                Enroll now
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-[#cfb89e]/70 bg-white/60 px-6 py-3 text-sm font-medium text-[#2c231a] transition-colors hover:bg-white/90"
              >
                Ask about the course
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
};

export default CasesPage;
