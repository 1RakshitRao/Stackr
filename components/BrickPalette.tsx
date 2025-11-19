"use client";

import { useBuilderStore } from "@/lib/store";

export default function BrickPalette() {
  const palette = useBuilderStore((state) => state.palette);
  const activeBrickTypeId = useBuilderStore(
    (state) => state.activeBrickTypeId,
  );
  const setActiveBrickType = useBuilderStore(
    (state) => state.setActiveBrickType,
  );

  return (
    <section className="flex h-full flex-col rounded-3xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Brick Palette</h2>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
          Alpha
        </span>
      </div>
      <ul className="space-y-3">
        {palette.map((brick) => {
          const isActive = brick.id === activeBrickTypeId;
          return (
            <li
              key={brick.id}
              className={`cursor-pointer rounded-2xl border p-3 transition hover:border-emerald-300/40 ${
                isActive
                  ? "border-emerald-300/60 bg-emerald-400/5"
                  : "border-white/10 bg-white/5"
              }`}
              onClick={() => setActiveBrickType(brick.id)}
              role="button"
              aria-pressed={isActive}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveBrickType(brick.id);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {brick.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {brick.description}
                  </p>
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
          );
        })}
      </ul>
    </section>
  );
}