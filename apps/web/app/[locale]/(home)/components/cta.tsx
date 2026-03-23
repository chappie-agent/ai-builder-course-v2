import { ArrowRight, MessageCircle, Users, Video } from "lucide-react";
import Link from "next/link";

export const CTA = () => {
  return (
    <section className="w-full px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f5f0e8] via-[#ede6da] to-[#e8dfd0] sm:rounded-[3rem]">
          {/* Subtle decorative circles */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#8b7355]/[0.06]" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#8b7355]/[0.04]" />

          <div className="relative px-6 py-16 text-center sm:px-12 sm:py-24 md:px-16 md:py-32">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-[#8b7355]">
              Ready to start?
            </p>
            <h2 className="mx-auto max-w-3xl font-medium text-3xl leading-tight tracking-tight text-[#2c231a] sm:text-4xl md:text-5xl lg:text-6xl">
              Your AI journey
              <br />
              begins here
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#6b5c4c]/70 md:text-lg">
              Join the next cohort and learn how to design, build, automate,
              and launch with AI in a practical, hands-on way.
            </p>

            {/* Community signals */}
            <div className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-5 text-sm text-[#6b5c4c]/70">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#8b7355]" />
                Private community
              </span>
              <span className="flex items-center gap-2">
                <Video className="h-4 w-4 text-[#8b7355]" />
                Live cohort sessions
              </span>
              <span className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-[#8b7355]" />
                Direct instructor access
              </span>
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
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-[#c4b5a0]/50 bg-white/50 px-8 py-3.5 text-sm font-medium text-[#2c231a] backdrop-blur-sm transition-all hover:bg-white/80 sm:text-base"
              >
                Get in touch
              </Link>
            </div>
            <p className="mt-6 text-xs text-[#8b7355]/60">
              Limited seats per cohort · next cohort starts soon
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
