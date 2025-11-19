"use client";

import { useEffect } from "react";
import { useBuilderStore } from "@/lib/store";

export default function Toolbar() {
  const saveBuild = useBuilderStore((state) => state.saveBuild);
  const loadBuild = useBuilderStore((state) => state.loadBuild);
  const clearBuild = useBuilderStore((state) => state.clearBuild);
  const setCameraView = useBuilderStore((state) => state.setCameraView);
  const undo = useBuilderStore((state) => state.undo);
  const redo = useBuilderStore((state) => state.redo);
  const history = useBuilderStore((state) => state.history);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          if (canRedo) redo();
        } else {
          if (canUndo) undo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  const actions = [
    { label: "Undo", disabled: !canUndo, action: undo },
    { label: "Redo", disabled: !canRedo, action: redo },
    { label: "Save Build", action: saveBuild },
    { label: "Load Build", action: loadBuild },
    { label: "Reset Camera", action: () => setCameraView("iso") },
    { label: "New Build", variant: "danger", action: clearBuild },
  ];

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
          onClick={action.action}
        >
          {action.label}
        </button>
      ))}
      <div className="ml-auto flex gap-2">
        <button
          type="button"
          className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/30"
          onClick={() => setCameraView("top")}
        >
          Top View
        </button>
        <button
          type="button"
          className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/30"
          onClick={() => setCameraView("iso")}
        >
          Iso View
        </button>
      </div>
    </section>
  );
}
