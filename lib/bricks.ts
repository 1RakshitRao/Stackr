export type BrickDefinition = {
  id: string;
  name: string;
  description: string;
  studs: string;
  color: string;
  size: [number, number, number];
};

export const BRICK_LIBRARY: BrickDefinition[] = [
  {
    id: "brick-2x2",
    name: "Brick 2 x 2",
    description: "Great for sturdy cores and columns.",
    studs: "2 x 2",
    color: "#f97316",
    size: [2, 1.5, 2],
  },
  {
    id: "brick-2x4",
    name: "Brick 2 x 4",
    description: "The classic brick for most builds.",
    studs: "2 x 4",
    color: "#38bdf8",
    size: [2, 1.5, 4],
  },
  {
    id: "brick-1x4",
    name: "Brick 1 x 4",
    description: "Useful for edges and trim.",
    studs: "1 x 4",
    color: "#a855f7",
    size: [1, 1.25, 4],
  },
  {
    id: "plate-4x4",
    name: "Plate 4 x 4",
    description: "Thin plate ideal for floors.",
    studs: "4 x 4",
    color: "#22d3ee",
    size: [4, 0.6, 4],
  },
];

export const DEFAULT_BRICK_ID = BRICK_LIBRARY[0].id;
export const GRID_UNIT = 1;

export const snapToGrid = (value: number) =>
  Math.round(value / GRID_UNIT) * GRID_UNIT;
