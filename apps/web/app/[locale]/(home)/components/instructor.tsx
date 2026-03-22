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
    <section className="w-full overflow-hidden px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* No card — open editorial layout on the page gradient */}
        <div className="relative grid items-center gap-0 md:grid-cols-2">
          {/* Left: text */}
          <div className="relative z-10 py-8 pr-0 md:py-16 md:pr-12">
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

          {/* Right: photo — bleeds to edge, fades left into page bg */}
          <div className="relative -mr-4 flex justify-end sm:-mr-6">
            {/*
              The image background in the photo is #faf7f2 — same as this section's
              surrounding page colour. The left-side mask-image gradient fades the
              photo edge to transparent so it blends seamlessly with the text column.
              Swap /instructor.jpg for your actual photo.
            */}
            <div
              className="relative h-[420px] w-full sm:h-[520px] md:h-[600px]"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 28%), linear-gradient(to top, transparent 0%, black 8%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 28%), linear-gradient(to top, transparent 0%, black 8%)",
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
              }}
            >
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
