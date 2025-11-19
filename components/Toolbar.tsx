const actions = [
  { label: "Undo", disabled: true },
  { label: "Redo", disabled: true },
  { label: "Save Build" },
  { label: "Load Build" },
  { label: "Reset Camera" },
  { label: "New Build", variant: "danger" },
];

export default function Toolbar() {
  return (
    <section className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur">
      {actions.map((action) => (
        <button
          key={action.label}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 ${
            action.variant === "danger"
              ? "bg-rose-500/20 text-rose-200"
              : "bg-white/5 text-slate-100"
          } ${action.disabled ? "cursor-not-allowed opacity-40" : ""}`}
          disabled={action.disabled}
          type="button"
        >
          {action.label}
        </button>
      ))}
      <div className="ml-auto flex gap-2">
        <button
          type="button"
          className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/30"
        >
          Top View
        </button>
        <button
          type="button"
          className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/30"
        >
          Iso View
        </button>
      </div>
    </section>
  );
}

