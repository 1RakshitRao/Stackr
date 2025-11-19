const propertyRows = [
  { label: "Selected Brick", value: "None" },
  { label: "Position", value: "—" },
  { label: "Rotation", value: "—" },
];

export default function PropertiesPanel() {
  return (
    <section className="flex h-full flex-col rounded-3xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur">
      <h2 className="text-lg font-semibold text-white">Properties</h2>
      <p className="mt-1 text-sm text-slate-400">
        Pick a brick to edit its position, rotation, and color.
      </p>
      <dl className="mt-4 space-y-3">
        {propertyRows.map((row) => (
          <div
            key={row.label}
            className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3"
          >
            <dt className="text-xs uppercase tracking-widest text-slate-400">
              {row.label}
            </dt>
            <dd className="text-lg font-semibold text-white">{row.value}</dd>
          </div>
        ))}
      </dl>
      <button
        type="button"
        disabled
        className="mt-auto rounded-2xl border border-rose-400/40 px-4 py-2 text-sm font-semibold text-rose-200 opacity-50"
      >
        Delete Brick
      </button>
    </section>
  );
}

