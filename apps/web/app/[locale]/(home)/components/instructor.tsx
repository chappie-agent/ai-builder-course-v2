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
        <div className="relative overflow-hidden rounded-[2rem] border border-[#e8dfd0]/60 bg-[#faf7f2] sm:rounded-[3rem]">
          <div className="grid md:grid-cols-2">
            {/* Image column */}
            <div className="relative flex items-end justify-center overflow-hidden bg-[linear-gradient(160deg,#e8dfd0_0%,#d6c4b4_100%)] px-8 pt-12 md:px-12 md:pt-16">
              {/* Subtle dot pattern */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "radial-gradient(#8b7355 0.8px, transparent 0.8px)",
                  backgroundSize: "20px 20px",
                }}
              />
              {/* Instructor photo — replace /instructor.jpg with the real image */}
              <div className="relative z-10 h-[340px] w-[260px] sm:h-[400px] sm:w-[300px] md:h-[460px] md:w-[340px]">
                <Image
                  src="/instructor.jpg"
                  alt="Instructor"
                  fill
                  className="object-contain object-bottom drop-shadow-2xl"
                  sizes="(max-width: 768px) 300px, 340px"
                  priority
                />
              </div>
            </div>

            {/* Text column */}
            <div className="flex flex-col justify-center px-8 py-12 sm:px-12 md:px-14 md:py-16">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#8b7355]">
                Your instructor
              </p>
              <h2 className="font-medium text-3xl leading-tight tracking-tight text-[#2c231a] sm:text-4xl md:text-5xl">
                Hi, I'm
                <br />
                <span className="text-[#8b7355]">Elwyn de Neve</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[#6b5c4c]/75 md:text-lg">
                I've spent years at the intersection of design, development, and
                AI tooling. I built this course because I couldn't find one that
                actually taught you how to ship — not just how to prompt.
              </p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-[#6b5c4c]/75">
                Everything I teach comes from real projects, real mistakes, and
                real results. My goal is to give you the shortcut I didn't have.
              </p>

              <ul className="mt-8 space-y-2.5">
                {highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8b7355]" />
                    <span className="text-sm text-[#6b5c4c]/80">{h}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-[#2c231a] underline-offset-4 hover:underline"
                >
                  Ask me anything
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
