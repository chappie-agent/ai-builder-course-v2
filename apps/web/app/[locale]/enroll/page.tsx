import { CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { NavBar } from "../(home)/components/nav-bar";
import { SiteFooter } from "../(home)/components/site-footer";

const paths = [
  {
    name: "Starter",
    blurb: "For curious creators who want a practical, guided introduction to building with AI.",
  },
  {
    name: "Builder",
    blurb: "For makers and developers who want to ship real tools, workflows, and products faster.",
  },
  {
    name: "Team / Custom",
    blurb: "For companies or tailored learning tracks focused on workflows, automation, and implementation.",
  },
];

const focusAreas = [
  "AI-assisted development",
  "OpenClaw and agents",
  "Automation and workflows",
  "Image and video generation",
  "Shipping products with AI",
];

const steps = [
  {
    number: "01",
    title: "Choose your path",
    copy: "Pick the learning route that best matches your current level and ambitions.",
  },
  {
    number: "02",
    title: "Tell us where you are now",
    copy: "Share your current experience, tools, and what kind of AI work you want to do more of.",
  },
  {
    number: "03",
    title: "Set your focus",
    copy: "Select the themes you want to prioritize, from OpenClaw to automations to AI-first product building.",
  },
  {
    number: "04",
    title: "Confirm your intake",
    copy: "Review your choices and send your intake so the next step feels personal and relevant.",
  },
];

const EnrollPage = () => {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[linear-gradient(180deg,#d6c4b4_0%,#eee5da_18%,#f7f2ea_42%,#fbf8f3_100%)] px-4 pt-28 pb-16 text-[#2c231a] sm:px-6 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <section className="reveal-up overflow-hidden rounded-[2rem] border border-[#e8dfd0]/60 bg-gradient-to-br from-[#f5f0e8] via-[#ede6da] to-[#e8dfd0] px-6 py-16 shadow-sm sm:rounded-[3rem] sm:px-12 md:px-16 md:py-20 lg:px-24">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#8b7355]">
              Enroll
            </p>
            <h1 className="max-w-4xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              A calm, guided path into building with AI
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#6b5c4c]/80 md:text-lg">
              This intake flow is designed to feel clear and intentional. No rush, no clutter. Just the right next step into practical AI development, OpenClaw, workflows, and modern product building.
            </p>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <aside className="reveal-up-delay sticky top-28 h-fit rounded-[2rem] border border-[#e8dfd0]/60 bg-[#faf7f2] p-6 shadow-sm sm:rounded-[3rem] sm:p-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8b7355]">
                What to expect
              </p>
              <ul className="mt-6 space-y-4">
                {steps.map((step) => (
                  <li key={step.number} className="flex gap-4 border-b border-[#eadfd3]/70 pb-4 last:border-b-0 last:pb-0">
                    <span className="text-sm font-medium text-[#8b7355]">{step.number}</span>
                    <div>
                      <p className="font-medium text-[#2c231a]">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-[#6b5c4c]/75">{step.copy}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="space-y-5">
              <section className="reveal-up rounded-[2rem] border border-[#e8dfd0]/60 bg-[#faf7f2] p-6 shadow-sm sm:rounded-[3rem] sm:p-8 md:p-10">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-[#8b7355]">
                  <Sparkles className="h-4 w-4" />
                  Step 1 · Choose your path
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {paths.map((path, index) => (
                    <div
                      key={path.name}
                      className="reveal-up group rounded-[1.5rem] border border-[#e8dfd0]/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(246,238,228,0.92))] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#cfb89e]/70 hover:shadow-[0_20px_40px_rgba(112,83,55,0.08)]"
                      style={{ animationDelay: `${120 + index * 90}ms` }}
                    >
                      <p className="text-lg font-medium text-[#2c231a]">{path.name}</p>
                      <p className="mt-3 text-sm leading-relaxed text-[#6b5c4c]/75">{path.blurb}</p>
                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#8b7355]">
                        Select path
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="reveal-up-delay rounded-[2rem] border border-[#e8dfd0]/60 bg-[#faf7f2] p-6 shadow-sm sm:rounded-[3rem] sm:p-8 md:p-10">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-[#8b7355]">
                  <Sparkles className="h-4 w-4" />
                  Step 2 · Your details
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-[#6b5c4c]">
                    <span>First name</span>
                    <input className="h-12 w-full rounded-xl border border-[#d8c8b5] bg-white px-4 outline-none" />
                  </label>
                  <label className="space-y-2 text-sm text-[#6b5c4c]">
                    <span>Email</span>
                    <input className="h-12 w-full rounded-xl border border-[#d8c8b5] bg-white px-4 outline-none" />
                  </label>
                  <label className="space-y-2 text-sm text-[#6b5c4c] md:col-span-2">
                    <span>What are you building toward?</span>
                    <textarea className="min-h-28 w-full rounded-[1.25rem] border border-[#d8c8b5] bg-white px-4 py-3 outline-none" placeholder="A clearer AI workflow, stronger product building skills, better use of OpenClaw, or something more specific..." />
                  </label>
                </div>
              </section>

              <section className="reveal-up-delay-2 rounded-[2rem] border border-[#e8dfd0]/60 bg-[#faf7f2] p-6 shadow-sm sm:rounded-[3rem] sm:p-8 md:p-10">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-[#8b7355]">
                  <Sparkles className="h-4 w-4" />
                  Step 3 · Focus areas
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {focusAreas.map((area, index) => (
                    <label
                      key={area}
                      className="reveal-up group flex items-center gap-3 rounded-[1.25rem] border border-[#e8dfd0]/60 bg-white/80 px-4 py-3 text-sm text-[#4f4337] transition-all duration-200 hover:border-[#cfb89e]/70 hover:bg-white"
                      style={{ animationDelay: `${160 + index * 70}ms` }}
                    >
                      <input
                        type="checkbox"
                        className="checkbox-premium h-5 w-5 shrink-0 appearance-none rounded-[0.4rem] border border-[#b79f84] bg-[linear-gradient(180deg,#fffdf9,#f1e7db)] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(81,57,33,0.08)] transition-all duration-200 checked:border-[#8b7355] checked:bg-[#8b7355]"
                      />
                      <span>{area}</span>
                    </label>
                  ))}
                </div>
              </section>

              <section className="reveal-up-delay-3 rounded-[2rem] border border-[#d9c7b2]/70 bg-[linear-gradient(180deg,#f8f2ea,#efe3d5)] p-6 shadow-sm sm:rounded-[3rem] sm:p-8 md:p-10">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[#8b7355]" />
                  <div>
                    <p className="text-lg font-medium text-[#2c231a]">Ready to send your intake</p>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6b5c4c]/75 sm:text-base">
                      Once submitted, this can flow into a personalized follow-up, a course invitation, or a next-step conversation. For now, this is a polished front-end placeholder flow.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <button className="rounded-full bg-[#2c231a] px-6 py-3 text-sm font-medium text-[#f5f0e8] transition-colors hover:bg-[#3d3127]">
                        Complete enrollment
                      </button>
                      <button className="rounded-full border border-[#cfb89e]/70 bg-white/60 px-6 py-3 text-sm font-medium text-[#2c231a] transition-colors hover:bg-white/90">
                        Save for later
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
};

export default EnrollPage;
