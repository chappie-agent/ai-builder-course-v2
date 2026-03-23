import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const highlights = [
  "10+ years building digital products",
  "AI tooling & automation specialist",
  "Founder · builder · teacher",
  "Courses followed by 2,400+ students",
];

export const Instructor = () => {
  return (
    <section className="w-full px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Dark card for visual rhythm break */}
        <div className="overflow-hidden rounded-[2rem] bg-[#2c231a] shadow-sm sm:rounded-[3rem]">
          <div className="grid md:grid-cols-2">
            {/* Text column */}
            <div className="flex flex-col justify-center px-8 py-12 sm:px-12 md:px-14 md:py-16">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#c4b5a0]">
                Your instructor
              </p>
              <h2 className="font-medium text-3xl leading-tight tracking-tight text-[#f5f0e8] sm:text-4xl md:text-5xl">
                Hi, I'm
                <br />
                <span className="text-[#c4b5a0]">Elwyn de Neve</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[#c4b5a0]/75 md:text-lg">
                I've spent years at the intersection of design, development, and
                AI tooling. I built this course because I couldn't find one that
                actually taught you how to ship — not just how to prompt.
              </p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-[#c4b5a0]/75">
                Everything I teach comes from real projects, real mistakes, and
                real results. My goal is to give you the shortcut I didn't have.
              </p>

              <ul className="mt-8 space-y-2.5">
                {highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8b7355]" />
                    <span className="text-sm text-[#c4b5a0]/80">{h}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-[#f5f0e8] underline-offset-4 hover:underline"
                >
                  Ask me anything
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Image column — full-bleed, clipped by parent overflow-hidden */}
            <div className="relative min-h-[380px] sm:min-h-[460px] md:min-h-0">
              <Image
                src="/instructor.png"
                alt="Elwyn de Neve — instructor"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
