const stats = [
  { value: "2,400+", label: "Students enrolled" },
  { value: "94%", label: "Completion rate" },
  { value: "4.9", label: "Average rating" },
  { value: "10", label: "Weeks to production" },
];

export const StatsBar = () => {
  return (
    <section className="w-full px-4 sm:px-6">
      <div className="mx-auto -mt-6 max-w-5xl md:-mt-8">
        <div className="grid grid-cols-2 gap-6 rounded-2xl border border-[#e8dfd0]/60 bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:grid-cols-4 sm:rounded-3xl sm:p-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-medium text-2xl tracking-tight text-[#2c231a] sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-[#8b7355] sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
