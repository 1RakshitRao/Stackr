"use client";

import { useMemo } from "react";
import { useBuilderStore } from "@/lib/store";

const formatVector = (vector: [number, number, number]) =>
  vector.map((value) => value.toFixed(2)).join(", ");

const COLORS = [
  "#f97316", // orange
  "#38bdf8", // sky
  "#a855f7", // purple
  "#22d3ee", // cyan
  "#ef4444", // red
  "#10b981", // emerald
  "#eab308", // yellow
  "#f472b6", // pink
  "#94a3b8", // slate
];

export default function PropertiesPanel() {
  const bricks = useBuilderStore((state) => state.bricks);
  const palette = useBuilderStore((state) => state.palette);
  const selectedBrickId = useBuilderStore((state) => state.selectedBrickId);
  const deleteSelectedBrick = useBuilderStore(
    (state) => state.deleteSelectedBrick,
  );
  const updateSelectedBrickColor = useBuilderStore(
    (state) => state.updateSelectedBrickColor,
  );

  const selectedBrick = useMemo(
    () => bricks.find((brick) => brick.id === selectedBrickId) ?? null,
    [bricks, selectedBrickId],
  );
  const selectedDefinition = useMemo(
    () =>
      palette.find((brick) => brick.id === selectedBrick?.typeId) ?? null,
    [palette, selectedBrick],
  );

  return (
    <section className="flex h-full flex-col rounded-3xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur">
      <h2 className="text-lg font-semibold text-white">Properties</h2>
      <p className="mt-1 text-sm text-slate-400">
        Pick a brick to inspect its properties or remove it from the scene.
      </p>
      <dl className="mt-4 space-y-3">
        <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
          <dt className="text-xs uppercase tracking-widest text-slate-400">
            Selected Brick
          </dt>
          <dd className="text-lg font-semibold text-white">
            {selectedBrick ? selectedDefinition?.name ?? "Unknown" : "None"}
          </dd>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
          <dt className="text-xs uppercase tracking-widest text-slate-400">
            Position
          </dt>
          <dd className="text-lg font-semibold text-white">
            {selectedBrick ? formatVector(selectedBrick.position) : "—"}
          </dd>
        </div>
        {selectedBrick && (
          <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
            <dt className="text-xs uppercase tracking-widest text-slate-400">
              Color
            </dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`h-6 w-6 rounded-full border transition ${
                    (selectedBrick.color ?? selectedDefinition?.color) === color
                      ? "scale-110 border-white"
                      : "border-white/20 hover:scale-110 hover:border-white/60"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateSelectedBrickColor(color)}
                  aria-label={`Set color to ${color}`}
                />
              ))}
            </dd>
          </div>
        )}
      </dl>
      <button
        type="button"
        disabled={!selectedBrick}
        onClick={deleteSelectedBrick}
        className={`mt-auto rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
          selectedBrick
            ? "border-rose-400/60 text-rose-200 hover:bg-rose-500/10"
            : "cursor-not-allowed border-white/10 text-slate-500 opacity-50"
        }`}
      >
        Delete Brick
      </button>
    </section>
  );
}
