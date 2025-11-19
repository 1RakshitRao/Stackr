"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";

const cameraPosition: [number, number, number] = [10, 9, 10];

function DemoBrick() {
  return (
    <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
      <boxGeometry args={[2, 1.5, 2]} />
      <meshStandardMaterial color="#f97316" roughness={0.45} metalness={0.1} />
    </mesh>
  );
}

function Scene() {
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
        <DemoBrick />
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
  return (
    <div className="relative flex h-full w-full min-h-[420px] flex-1 overflow-hidden rounded-2xl bg-slate-900">
      <Canvas
        shadows
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

