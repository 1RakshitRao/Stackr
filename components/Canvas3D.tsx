"use client";

import { Suspense, useCallback, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, Edges } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useBuilderStore, type BrickInstance } from "@/lib/store";
import type { BrickDefinition } from "@/lib/bricks";

const cameraPosition: [number, number, number] = [10, 9, 10];

type BrickMeshProps = {
  brick: BrickInstance;
  definition?: BrickDefinition;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
};

function BrickMesh({ brick, definition, isSelected, onSelect }: BrickMeshProps) {
  if (!definition) return null;

  return (
    <mesh
      key={brick.id}
      castShadow
      receiveShadow
      position={brick.position}
      rotation={brick.rotation}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect(brick.id);
      }}
    >
      <boxGeometry args={definition.size} />
      <meshStandardMaterial
        color={definition.color}
        roughness={0.4}
        metalness={0.08}
        emissive={isSelected ? "#22c55e" : "#000000"}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
      {isSelected && <Edges color="#bbf7d0" />}
    </mesh>
  );
}

type PlacementPlaneProps = {
  onPlace: (point: [number, number, number]) => void;
};

function PlacementPlane({ onPlace }: PlacementPlaneProps) {
  const handlePointerDown = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (event.nativeEvent.button !== 0) return;
      event.stopPropagation();
      const { point } = event;
      onPlace([point.x, point.y, point.z]);
    },
    [onPlace],
  );

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      onPointerDown={handlePointerDown}
    >
      <planeGeometry args={[80, 80, 1, 1]} />
      <meshStandardMaterial transparent opacity={0} />
    </mesh>
  );
}

function Scene() {
  const bricks = useBuilderStore((state) => state.bricks);
  const palette = useBuilderStore((state) => state.palette);
  const selectedBrickId = useBuilderStore((state) => state.selectedBrickId);
  const selectBrick = useBuilderStore((state) => state.selectBrick);
  const placeBrickAt = useBuilderStore((state) => state.placeBrickAt);

  const paletteMap = useMemo(
    () =>
      palette.reduce<Record<string, BrickDefinition>>((acc, brick) => {
        acc[brick.id] = brick;
        return acc;
      }, {}),
    [palette],
  );

  return (
    <>
      <color attach="background" args={["#020617"]} />
      <hemisphereLight
        intensity={0.4}
        groundColor="#0f172a"
        color="#f8fafc"
      />
      <directionalLight
        position={[6, 12, 8]}
        intensity={1.1}
        castShadow
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
      />
      <Suspense fallback={null}>
        <Grid
          args={[40, 40]}
          sectionSize={4}
          sectionColor="#475569"
          sectionThickness={1.5}
          cellThickness={0.8}
          cellColor="#1e293b"
          infiniteGrid
          fadeDistance={50}
          fadeStrength={2}
          position={[0, 0, 0]}
        />
        <PlacementPlane onPlace={placeBrickAt} />
        {bricks.map((brick) => (
          <BrickMesh
            key={brick.id}
            brick={brick}
            definition={paletteMap[brick.typeId]}
            isSelected={brick.id === selectedBrickId}
            onSelect={selectBrick}
          />
        ))}
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={0.15}
        maxDistance={40}
        minDistance={4}
      />
    </>
  );
}

export default function Canvas3D() {
  const selectBrick = useBuilderStore((state) => state.selectBrick);

  return (
    <div className="relative flex h-full w-full min-h-[420px] flex-1 overflow-hidden rounded-2xl bg-slate-900">
      <Canvas
        shadows
        onPointerMissed={() => selectBrick(null)}
        camera={{
          position: cameraPosition,
          fov: 45,
          near: 0.1,
          far: 100,
        }}
      >
        <Scene />
      </Canvas>
      <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs uppercase tracking-wide text-slate-200">
        Orbit • Pan • Zoom
      </div>
    </div>
  );
}

