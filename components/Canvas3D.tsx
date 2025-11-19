"use client";

import { Suspense, useCallback, useMemo, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Grid, OrbitControls, Edges } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useBuilderStore, type BrickInstance } from "@/lib/store";
import type { BrickDefinition } from "@/lib/bricks";
import { snapToGrid as doSnap } from "@/lib/bricks";
import * as THREE from "three";

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
        color={brick.color ?? definition.color}
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
  onPointerDown: (point: [number, number, number]) => void;
};

function PlacementPlane({ onPointerDown }: PlacementPlaneProps) {
  const handlePointerDown = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (event.nativeEvent.button !== 0) return;
      event.stopPropagation();
      const { point } = event;
      onPointerDown([point.x, point.y, point.z]);
    },
    [onPointerDown],
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

function CameraController() {
  const { camera, controls } = useThree();
  const cameraView = useBuilderStore((state) => state.cameraView);
  
  useEffect(() => {
    const orbitControls = controls as unknown as {
      reset: () => void;
      object: THREE.Camera;
      target: THREE.Vector3;
      update: () => void;
    };

    if (!orbitControls) return;

    switch (cameraView) {
      case "top":
        camera.position.set(0, 20, 0);
        camera.lookAt(0, 0, 0);
        break;
      case "iso":
        camera.position.set(10, 9, 10);
        camera.lookAt(0, 0, 0);
        break;
    }
    orbitControls.target.set(0, 0, 0);
    orbitControls.update();
  }, [cameraView, camera, controls]);

  return null;
}

function Scene() {
  const bricks = useBuilderStore((state) => state.bricks);
  const palette = useBuilderStore((state) => state.palette);
  const selectedBrickId = useBuilderStore((state) => state.selectedBrickId);
  const selectBrick = useBuilderStore((state) => state.selectBrick);
  const placeBrickAt = useBuilderStore((state) => state.placeBrickAt);
  const updateBrickPosition = useBuilderStore((state) => state.updateBrickPosition);

  const paletteMap = useMemo(
    () =>
      palette.reduce<Record<string, BrickDefinition>>((acc, brick) => {
        acc[brick.id] = brick;
        return acc;
      }, {}),
    [palette],
  );

  const handlePlaneClick = (point: [number, number, number]) => {
    // Logic:
    // If a brick is selected -> Move it to this position (snap).
    // If no brick is selected -> Place a new brick.
    
    if (selectedBrickId) {
       // Move Logic
       // We need to find the selected brick to know its Y (height).
       // But simpler: just keep current Y or reset based on definition? 
       // Let's assume we move it on the floor for now or keep Y if stacked.
       // Actually, better to look up the brick.
       const brick = bricks.find(b => b.id === selectedBrickId);
       if (brick) {
          const definition = paletteMap[brick.typeId];
          const snappedX = doSnap(point[0]);
          const snappedZ = doSnap(point[2]);
          // Keep existing Y or reset to floor height?
          // User asked to "move the block". Usually implies dragging on the floor plane.
          // Let's reset to floor height based on definition for consistent placement.
          // If we want to support stacking, we need more complex raycasting logic (which we had implicitly with placement).
          const y = definition ? definition.size[1] / 2 : brick.position[1]; 
          
          updateBrickPosition(brick.id, [snappedX, y, snappedZ]);
       }
    } else {
       // Place Logic
       placeBrickAt(point);
    }
  };

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
        <CameraController />
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
        <PlacementPlane onPointerDown={handlePlaneClick} />
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
  const selectedBrickId = useBuilderStore((state) => state.selectedBrickId);

  return (
    <div className="relative flex h-full w-full min-h-[420px] flex-1 overflow-hidden rounded-2xl bg-slate-900">
      <Canvas
        shadows
        onPointerMissed={(e) => {
           if (e.type === 'click') selectBrick(null);
        }}
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
        {selectedBrickId 
          ? "Click grid to Move Selected • Click empty to Deselect"
          : "Click grid to Place New • Click brick to Select"
        }
      </div>
    </div>
  );
}
