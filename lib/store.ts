"use client";

import { create } from "zustand";
import { BRICK_LIBRARY, DEFAULT_BRICK_ID, snapToGrid } from "@/lib/bricks";

export type BrickInstance = {
  id: string;
  typeId: string;
  position: [number, number, number];
  rotation: [number, number, number];
};

type BuilderState = {
  bricks: BrickInstance[];
  palette: typeof BRICK_LIBRARY;
  selectedBrickId: string | null;
  activeBrickTypeId: string;
  setActiveBrickType: (typeId: string) => void;
  selectBrick: (brickId: string | null) => void;
  placeBrickAt: (point: [number, number, number]) => void;
  deleteSelectedBrick: () => void;
};

let brickCounter = 0;
const nextBrickId = () => `brick-${brickCounter++}`;

const getBrickDefinition = (typeId: string) =>
  BRICK_LIBRARY.find((brick) => brick.id === typeId);

export const useBuilderStore = create<BuilderState>((set, get) => ({
  bricks: [],
  palette: BRICK_LIBRARY,
  selectedBrickId: null,
  activeBrickTypeId: DEFAULT_BRICK_ID,
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
      bricks: [...state.bricks, newBrick],
      selectedBrickId: newBrick.id,
    }));
  },
  deleteSelectedBrick: () =>
    set((state) => {
      if (!state.selectedBrickId) {
        return state;
      }

      return {
        bricks: state.bricks.filter(
          (brick) => brick.id !== state.selectedBrickId,
        ),
        selectedBrickId: null,
      };
    }),
}));

