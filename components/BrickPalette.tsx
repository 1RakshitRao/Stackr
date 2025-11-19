type PaletteBrick = {
  name: string;
  description: string;
  studs: string;
  color: string;
};

const palette: PaletteBrick[] = [
  {
    name: "Brick 2 x 2",
    description: "Great for sturdy cores and columns.",
    studs: "2 x 2",
    color: "#f97316",
  },
  {
    name: "Brick 2 x 4",
    description: "The classic brick for most builds.",
    studs: "2 x 4",
    color: "#38bdf8",
  },
  {
    name: "Brick 4 x 1",
    description: "Useful for edges and trim.",
    studs: "1 x 4",
    color: "#a855f7",
  },
  {
    name: "Plate 4 x 4",
    description: "Thin plate ideal for floors.",
    studs: "4 x 4",
    color: "#22d3ee",
  },
];

export default function BrickPalette() {
  return (
    <section className="flex h-full flex-col rounded-3xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Brick Palette</h2>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
          Alpha
        </span>
      </div>
      <ul className="space-y-3">
        {palette.map((brick) => (
          <li
            key={brick.name}
            className="rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:border-emerald-300/40"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{brick.name}</p>
                <p className="text-xs text-slate-400">{brick.description}</p>
              </div>
              <span
                className="h-8 w-8 rounded-lg border border-white/20"
                style={{ backgroundColor: brick.color }}
              />
            </div>
            <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
              Studs: {brick.studs}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

