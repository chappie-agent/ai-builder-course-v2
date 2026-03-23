import { Check } from "lucide-react";

const outcomes = [
  "Ship a working AI agent from scratch",
  "Build image and video generation pipelines",
  "Design end-to-end automation workflows",
  "Set up a professional AI development environment",
  "Create a portfolio-worthy capstone project",
  "Deploy and monitor AI systems in production",
];

export const Outcomes = () => {
  return (
    <section className="w-full px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#8b7355]">
            What you'll walk away with
          </p>
          <h2 className="mx-auto max-w-2xl font-medium text-3xl leading-tight tracking-tight text-[#2c231a] sm:text-4xl md:text-5xl">
            Real skills, real output
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#6b5c4c]/70 md:text-lg">
            This isn't about watching videos. By the end you'll have built,
            shipped, and deployed actual projects.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2 md:mt-16">
          {outcomes.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-[#e8dfd0]/60 bg-[#faf7f2] p-5"
            >
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2c231a]">
                <Check className="h-3 w-3 text-[#f5f0e8]" />
              </div>
              <span className="text-sm leading-relaxed text-[#2c231a] sm:text-base">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
