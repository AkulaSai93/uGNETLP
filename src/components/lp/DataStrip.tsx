const stats = [
  { value: "4 Years", label: "On-campus B.Tech in CSE" },
  { value: "uGNET", label: "Online proctored entrance test" },
  { value: "50%", label: "Minimum in PCM, Class 12" },
  { value: "Under 20", label: "Years of age as of July 2026" },
  { value: "Up to 100%", label: "Scholarship" },
  { value: "MAANG", label: "Experts teach you" },
];

function StatList({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {stats.map((s) => (
        <li key={s.label} className="flex items-center">
          <span className="flex items-baseline gap-1.5 whitespace-nowrap px-5 text-[13px] leading-none">
            <span className="font-bold text-white">{s.value}</span>
            <span className="font-medium text-white/80">{s.label}</span>
          </span>
          <span aria-hidden="true" className="size-1 rotate-45 bg-white/70" />
        </li>
      ))}
    </ul>
  );
}

/** Thin red marquee of uGNET facts, stuck to the top of the page. */
export function DataStrip() {
  return (
    <div role="region" aria-label="uGNET 2026 at a glance" className="sticky top-0 z-50 bg-accent">
      <div className="marquee-mask py-2.5">
        <div className="marquee-track" style={{ animationDuration: "45s" }}>
          <StatList />
          <StatList hidden />
        </div>
      </div>
    </div>
  );
}
