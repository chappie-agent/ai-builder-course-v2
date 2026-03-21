const audience = [
  {
    title: "Creators who want to build",
    description:
      "Turn ideas, moodboards, and rough concepts into real interfaces, workflows, and digital products.",
  },
  {
    title: "Developers who want leverage",
    description:
      "Use AI to write, debug, structure, and ship faster without losing quality or control.",
  },
  {
    title: "Founders and operators",
    description:
      "Design AI workflows, automations, and agent systems that save time and create actual business value.",
  },
];

export const Audience = () => {
  return (
    <section className="w-full px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 rounded-[2rem] border border-[#e8dfd0]/60 bg-[#faf7f2] p-6 shadow-sm sm:rounded-[3rem] sm:p-8 md:grid-cols-[0.9fr_1.1fr] md:p-12">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#8b7355]">
              Built for
            </p>
            <h2 className="max-w-md text-3xl font-medium leading-tight tracking-tight text-[#2c231a] sm:text-4xl md:text-5xl">
              People who want AI to become part of how they actually work
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[#6b5c4c]/75 md:text-lg">
              Not just more prompts. Better systems, clearer output, and a faster path from concept to something real.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {audience.map((item, index) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-[1.5rem] border border-[#e8dfd0]/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(246,238,228,0.92))] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#cfb89e]/70 hover:shadow-[0_20px_40px_rgba(112,83,55,0.08)]"
              >
                <div
                  className={`pointer-events-none absolute inset-0 opacity-80 transition-transform duration-500 group-hover:scale-[1.03] ${
                    index === 0
                      ? "bg-[radial-gradient(circle_at_top_left,rgba(216,194,170,0.38),transparent_45%),linear-gradient(135deg,transparent,rgba(201,177,151,0.10))]"
                      : index === 1
                        ? "bg-[radial-gradient(circle_at_top_right,rgba(227,212,194,0.42),transparent_42%),linear-gradient(180deg,transparent,rgba(191,170,146,0.10))]"
                        : "bg-[radial-gradient(circle_at_bottom_right,rgba(214,195,172,0.36),transparent_44%),linear-gradient(135deg,rgba(255,255,255,0.18),transparent)]"
                  }`}
                />
                <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(#8b7355 0.6px, transparent 0.6px)", backgroundSize: "18px 18px" }} />
                <div className="relative transition-transform duration-300 group-hover:-translate-y-0.5">
                  <h3 className="text-lg font-medium text-[#2c231a]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#6b5c4c]/75">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
