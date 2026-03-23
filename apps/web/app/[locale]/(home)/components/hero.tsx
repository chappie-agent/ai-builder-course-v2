import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { HeroCrossPattern } from "./hero-cross-pattern";

const tools = [
  "Claude",
  "Cursor",
  "v0",
  "OpenClaw",
  "Vercel",
  "Next.js",
  "Midjourney",
  "Runway",
  "Make",
  "n8n",
];

export const Hero = () => {
  return (
    <section className="relative w-full px-4 pt-8 pb-12 sm:px-6 md:pt-12 md:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem]">
          {/* Background layer — fades out at bottom, content stays fully visible */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#f5f0e8] via-[#ede6da] to-[#e8dfd0]"
            style={{
              maskImage: "linear-gradient(to bottom, black 88%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 88%, transparent 100%)",
            }}
          />
          <HeroCrossPattern />

          <div className="relative px-6 pt-16 pb-10 sm:px-12 sm:pt-24 sm:pb-16 md:px-16 md:pt-32 md:pb-8 lg:px-24">
            <div className="mb-8 flex justify-center md:mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#c4b5a0]/40 bg-white/60 px-4 py-1.5 text-sm text-[#6b5c4c] backdrop-blur-sm">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#8b7355]" />
                Now enrolling · Limited seats available
              </div>
            </div>

            <div className="mx-auto max-w-4xl text-center">
              <h1 className="font-medium text-[2.5rem] leading-[1.05] tracking-tight text-[#2c231a] sm:text-6xl md:text-7xl lg:text-8xl">
                Learn to build
                <br />
                <span className="text-[#8b7355]">with AI</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#6b5c4c]/80 sm:mt-8 sm:text-lg md:text-xl">
                Learn AI-assisted development, OpenClaw, agents, image and video generation,
                automations, and modern workflows. Go from ideas and prompts to real,
                shippable products.
              </p>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
              <Link
                href="/enroll"
                className="group inline-flex items-center gap-2 rounded-full bg-[#2c231a] px-8 py-3.5 text-sm font-medium text-[#f5f0e8] transition-all hover:bg-[#3d3127] sm:text-base"
              >
                Enroll now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/#curriculum"
                className="inline-flex items-center gap-2 rounded-full border border-[#c4b5a0]/50 bg-white/50 px-8 py-3.5 text-sm font-medium text-[#2c231a] backdrop-blur-sm transition-all hover:bg-white/80 sm:text-base"
              >
                View curriculum
              </Link>
            </div>

            {/* Tools strip */}
            <div className="mt-12 sm:mt-16 md:mt-20">
              <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-[#8b7355]/60">
                Tools you'll work with
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-sm font-medium text-[#8b7355]/70 sm:text-base"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
