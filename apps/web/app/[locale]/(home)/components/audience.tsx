const audience = [
  {
    title: "Creators who want to build",
    description:
      "Turn ideas, moodboards, and rough concepts into real interfaces, workflows, and digital products.",
    image: "/audience-creators.png",
  },
  {
    title: "Developers who want leverage",
    description:
      "Use AI to write, debug, structure, and ship faster without losing quality or control.",
    image: "/audience-developers.png",
  },
  {
    title: "Founders and operators",
    description:
      "Design AI workflows, automations, and agent systems that save time and create actual business value.",
    image: "/audience-founders.png",
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
            {audience.map((item) => (
              <div
                key={item.title}
                className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-[1.5rem] border border-[#e8dfd0]/60 transition-all duration-300 hover:-translate-y-1 hover:border-[#cfb89e]/70 hover:shadow-[0_20px_40px_rgba(112,83,55,0.08)]"
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.image})` }}
                />

                {/* Text overlay with gradient for readability */}
                <div className="relative z-10 bg-gradient-to-t from-[#2c231a]/90 via-[#2c231a]/60 to-transparent p-5 pt-16">
                  <h3 className="text-lg font-medium text-[#f5f0e8]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#f5f0e8]/75">
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
