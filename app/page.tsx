import BrickPalette from "@/components/BrickPalette";
import Canvas3D from "@/components/Canvas3D";
import Header from "@/components/Header";
import PropertiesPanel from "@/components/PropertiesPanel";
import Toolbar from "@/components/Toolbar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Toolbar />
        <section className="flex flex-1 gap-4">
          <aside className="w-64 flex-shrink-0">
            <BrickPalette />
          </aside>
          <div className="flex flex-1 rounded-3xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur">
            <Canvas3D />
          </div>
          <aside className="w-72 flex-shrink-0">
            <PropertiesPanel />
          </aside>
        </section>
      </div>
    </main>
  );
}
