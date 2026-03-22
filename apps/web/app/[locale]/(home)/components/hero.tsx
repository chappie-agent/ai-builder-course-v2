import {
  ArrowRight,
  Bot,
  Code2,
  Film,
  Image as ImageIcon,
  Layers,
  Rocket,
  Sparkles,
  TerminalSquare,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { HeroCrossPattern } from "./hero-cross-pattern";

const heroItems = [
  { label: "Agents", icon: Bot },
  { label: "Workflows", icon: Workflow },
  { label: "AI Dev", icon: Code2 },
  { label: "Image Gen", icon: ImageIcon },
  { label: "Video Gen", icon: Film },
  { label: "OpenClaw", icon: Layers },
  { label: "Automations", icon: Sparkles },
  { label: "Ship Fast", icon: Rocket },
  { label: "Prompting", icon: TerminalSquare },
  { label: "Launch", icon: ArrowRight },
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
              maskImage: "linear-gradient(to bottom, black 55%, transparent 90%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 90%)",
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

            <div className="mt-12 sm:mt-16 md:mt-20">
              <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[#d4c8b5]/40 bg-gradient-to-b from-[#faf7f2] to-[#f0e9dd] shadow-lg sm:rounded-3xl">
                <div className="grid grid-cols-2 gap-px bg-[#d4c8b5]/30 sm:grid-cols-5">
                  {heroItems.map((item, index) => (
                    <div
                      key={item.label}
                      className={`flex aspect-[1.1/1] flex-col items-center justify-center gap-3 p-4 text-center ${index % 2 === 0 ? "bg-[#faf7f2]" : "bg-[#f5f0e8]"}`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#bda98f]/40 bg-[linear-gradient(135deg,#ffffff,#e9dccd)] shadow-sm">
                        <item.icon className="h-4.5 w-4.5 text-[#7b6651]" strokeWidth={1.75} />
                      </div>
                      <span className="text-xs text-[#8b7355] sm:text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
