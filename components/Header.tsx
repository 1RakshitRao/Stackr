const buildInfo = [
  { label: "Session", value: "Local draft" },
  { label: "Version", value: "v0.1.0" },
];

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-6 py-4 backdrop-blur">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
          Lego 3D Builder
        </p>
        <h1 className="text-2xl font-semibold text-white">
          Build modular brick scenes
        </h1>
      </div>
      <dl className="flex gap-6 text-right text-sm text-slate-400">
        {buildInfo.map((item) => (
          <div key={item.label}>
            <dt className="uppercase tracking-wide text-[0.65rem] opacity-70">
              {item.label}
            </dt>
            <dd className="text-base font-medium text-slate-100">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </header>
  );
}

