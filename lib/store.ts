"use client";

import { create } from "zustand";
import { BRICK_LIBRARY, DEFAULT_BRICK_ID, snapToGrid } from "@/lib/bricks";

export type BrickInstance = {
  id: string;
  typeId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  color?: string;
};

type HistoryState = {
  past: BrickInstance[][];
  future: BrickInstance[][];
};

type BuilderState = {
  bricks: BrickInstance[];
  history: HistoryState;
  palette: typeof BRICK_LIBRARY;
  selectedBrickId: string | null;
  activeBrickTypeId: string;
  cameraView: "iso" | "top" | "front";
  
  setCameraView: (view: "iso" | "top" | "front") => void;
  setActiveBrickType: (typeId: string) => void;
  selectBrick: (brickId: string | null) => void;
  
  placeBrickAt: (point: [number, number, number]) => void;
  deleteSelectedBrick: () => void;
  updateSelectedBrickColor: (color: string) => void;
  updateBrickPosition: (brickId: string, position: [number, number, number]) => void;
  
  saveBuild: () => void;
  loadBuild: () => void;
  clearBuild: () => void;
  
  undo: () => void;
  redo: () => void;
};

let brickCounter = 0;
const nextBrickId = () => `brick-${brickCounter++}`;

const getBrickDefinition = (typeId: string) =>
  BRICK_LIBRARY.find((brick) => brick.id === typeId);

const pushToHistory = (state: BuilderState): Partial<BuilderState> => {
  const newPast = [...state.history.past, state.bricks];
  // Limit history size if needed, e.g., 50 steps
  if (newPast.length > 50) newPast.shift();
  
  return {
    history: {
      past: newPast,
      future: [],
    },
  };
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
  bricks: [],
  history: { past: [], future: [] },
  palette: BRICK_LIBRARY,
  selectedBrickId: null,
  activeBrickTypeId: DEFAULT_BRICK_ID,
  cameraView: "iso",

  setCameraView: (view) => set({ cameraView: view }),
  setActiveBrickType: (typeId) => set({ activeBrickTypeId: typeId }),
  selectBrick: (brickId) => set({ selectedBrickId: brickId }),

  placeBrickAt: (point) => {
    const { activeBrickTypeId } = get();
    const definition = getBrickDefinition(activeBrickTypeId);
    if (!definition) return;

    const x = snapToGrid(point[0]);
    const z = snapToGrid(point[2]);
    const y = definition.size[1] / 2;

    const newBrick: BrickInstance = {
      id: nextBrickId(),
      typeId: definition.id,
      position: [x, y, z],
      rotation: [0, 0, 0],
    };

    set((state) => ({
      ...pushToHistory(state),
      bricks: [...state.bricks, newBrick],
      selectedBrickId: newBrick.id,
    }));
  },

  deleteSelectedBrick: () =>
    set((state) => {
      if (!state.selectedBrickId) return state;
      
      return {
        ...pushToHistory(state),
        bricks: state.bricks.filter(
          (brick) => brick.id !== state.selectedBrickId,
        ),
        selectedBrickId: null,
      };
    }),

  updateSelectedBrickColor: (color) =>
    set((state) => {
      if (!state.selectedBrickId) return state;
      
      return {
        ...pushToHistory(state),
        bricks: state.bricks.map((brick) =>
          brick.id === state.selectedBrickId ? { ...brick, color } : brick,
        ),
      };
    }),

  updateBrickPosition: (brickId, position) =>
    set((state) => ({
      ...pushToHistory(state),
      bricks: state.bricks.map((brick) =>
        brick.id === brickId ? { ...brick, position } : brick,
      ),
    })),

  undo: () =>
    set((state) => {
      const { past, future } = state.history;
      if (past.length === 0) return state;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, -1);

      return {
        bricks: previous,
        history: {
          past: newPast,
          future: [state.bricks, ...future],
        },
        selectedBrickId: null, // Deselect on undo to avoid stale IDs
      };
    }),

  redo: () =>
    set((state) => {
      const { past, future } = state.history;
      if (future.length === 0) return state;

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        bricks: next,
        history: {
          past: [...past, state.bricks],
          future: newFuture,
        },
        selectedBrickId: null,
      };
    }),

  saveBuild: () => {
    const { bricks } = get();
    const data = JSON.stringify(bricks);
    localStorage.setItem("lego-build", data);
    alert("Build saved to local storage!");
  },

  loadBuild: () => {
    const data = localStorage.getItem("lego-build");
    if (data) {
      try {
        const bricks = JSON.parse(data);
        brickCounter = bricks.length > 0 ? bricks.length + 1 : 0;
        set((state) => ({
          ...pushToHistory(state),
          bricks,
          selectedBrickId: null,
        }));
      } catch (e) {
        console.error("Failed to load build", e);
        alert("Failed to load build data.");
      }
    } else {
      alert("No saved build found.");
    }
  },

  clearBuild: () => {
    if (confirm("Are you sure you want to clear the build?")) {
      set((state) => ({
        ...pushToHistory(state),
        bricks: [],
        selectedBrickId: null,
      }));
      brickCounter = 0;
    }
  },
}));
