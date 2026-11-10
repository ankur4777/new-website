"use client";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatedIcon } from "./animated-icon";

type Mode = "attract" | "scatter" | "swirl";
const petals = Array.from({ length: 19 }, (_, i) => {
  const inner = i >= 12;
  const angle = ((inner ? i - 12 : i) / (inner ? 7 : 12)) * Math.PI * 2 + (inner ? 0.23 : 0);
  return { angle, radius: inner ? 0.38 : 1.02, inner, tilt: Math.sin(angle * 2) * 0.5 + (inner ? -0.6 : 0.38) };
});
const modes = [
  { id: "attract" as const, name: "Attract", icon: "magnet" as const, hint: "Move slowly. The petals follow your lead." },
  { id: "scatter" as const, name: "Scatter", icon: "scatter" as const, hint: "Get close. Give the petals a little space." },
  { id: "swirl" as const, name: "Swirl", icon: "swirl" as const, hint: "Move around. Send a ripple through the bloom." },
];

/** A procedural kinetic sculpture. No downloaded models, textures, or animation assets. */
export default function SignalBloom() {
  const stage = useRef<HTMLDivElement>(null);
  const canvasHost = useRef<HTMLDivElement>(null);
  const interaction = useRef({ x: 0, y: 0, active: false, down: false, lastX: 0, distance: 0, rotation: 0, burst: 0, mode: "attract" as Mode, reset: 0 });
  const [mode, setMode] = useState<Mode>("attract");
  const [ready, setReady] = useState(false);
  const [motion, setMotion] = useState(true);
  const [blooms, setBlooms] = useState(0);

  useEffect(() => {
    const el = stage.current, host = canvasHost.current;
    if (!el || !host) return;
    let disposed = false, visible = true, frame = 0, last = 0, elapsed = 0, spread = 0, angle = 0;
    let draw: ((t: number, dt: number, animate: boolean) => void) | undefined;
    let disposeGPU: (() => void) | undefined;
    let paletteGPU: (() => void) | undefined;
    let dirty = true, reduced = false;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreferences = () => {
      reduced = media.matches || document.documentElement.dataset.motion === "off";
      setMotion(!reduced);
      paletteGPU?.();
      dirty = true;
    };
    updatePreferences();
    const preferences = new MutationObserver(updatePreferences);
    preferences.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion", "data-palette"] });
    media.addEventListener("change", updatePreferences);
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; dirty = true; });
    visibility.observe(el);
    const slots = Array.from(el.querySelectorAll<HTMLElement>(".bloom-petal-slot"));
    const sculpture = el.querySelector<HTMLElement>(".bloom-sculpture");
    let seenBurst = 0, seenReset = 0;

    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      const dt = Math.min((now - (last || now)) / 1000, 0.04);
      last = now;
      if (!visible || document.hidden) return;
      const state = interaction.current;
      if (reduced && !dirty) return;
      if (!reduced) elapsed += dt;
      if (state.burst !== seenBurst) { spread = reduced ? 0 : 1; seenBurst = state.burst; }
      if (state.reset !== seenReset) { elapsed = 0; spread = 0; angle = 0; seenReset = state.reset; }
      if (draw) draw(elapsed, dt, !reduced);
      else if (sculpture) {
        const ease = 1 - Math.exp(-dt * 7);
        angle += ((reduced ? 0 : state.rotation + elapsed * 0.045) - angle) * ease;
        const x = reduced ? 0 : state.x, y = reduced ? 0 : state.y;
        sculpture.style.transform = `rotateX(${17 - y * 13}deg) rotateY(${-15 + x * 20}deg) rotateZ(${angle * 57.3}deg)`;
        slots.forEach((slot, i) => {
          const p = petals[i];
          const dx = x * 2 - Math.cos(p.angle), dy = -y * 2 - Math.sin(p.angle);
          const force = !reduced && state.active ? 1 / (1 + dx * dx + dy * dy) : 0;
          const direction = state.mode === "scatter" ? -1 : 1;
          const radius = p.radius * 54 + spread * 48 - force * 30 * direction;
          const sway = reduced ? 0 : Math.sin(elapsed * 0.8 + i * 0.7) * 8;
          const swirl = state.mode === "swirl" ? force * 50 : 0;
          slot.style.transform = `rotateZ(${p.angle * 57.3 + swirl}deg) translateY(${-radius}px) rotateX(${p.tilt * 57.3 + sway}deg) rotateY(${Math.cos(p.angle) * 22 + force * 15}deg) translateZ(${p.inner ? 30 : 0}px)`;
        });
      }
      spread *= Math.exp(-dt * 3.5);
      dirty = false;
    };
    frame = requestAnimationFrame(render);

    async function mount3D() {
      try {
        const probe = document.createElement("canvas");
        const gl = probe.getContext("webgl2");
        if (!gl) return;
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        const THREE = await import("three");
        const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
        if (disposed) return;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.3;
        renderer.setClearColor(0, 0);
        host!.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
        camera.position.set(0, 0, 9.6);
        const room = new RoomEnvironment(), pmrem = new THREE.PMREMGenerator(renderer);
        const environment = pmrem.fromScene(room, 0.04);
        scene.environment = environment.texture;
        const field = new THREE.Group();
        field.rotation.set(0.15, -0.2, 0);
        scene.add(field);

        // An asymmetric curved fin, formed here rather than loaded from a model.
        const shape = new THREE.Shape();
        shape.moveTo(-0.12, 0);
        shape.bezierCurveTo(-0.42, 0.45, -0.15, 1.25, 0.36, 1.7);
        shape.bezierCurveTo(0.65, 1.82, 0.82, 1.45, 0.65, 1.08);
        shape.bezierCurveTo(0.39, 0.58, 0.19, 0.25, 0.12, 0);
        shape.closePath();
        const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.045, bevelThickness: 0.045, curveSegments: 18 });
        const positions = geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) positions.setZ(i, positions.getZ(i) + Math.sin(positions.getY(i) / 1.8 * Math.PI) * 0.28);
        geometry.computeVertexNormals();
        const materials = [0, 1, 2].map(() => new THREE.MeshPhysicalMaterial({ metalness: 0.88, roughness: 0.23, clearcoat: 1, iridescence: 0.4, side: THREE.DoubleSide }));
        const nodes = petals.map((p, i) => {
          const mesh = new THREE.Mesh(geometry, materials[i % 3]);
          const rest = new THREE.Vector3(Math.cos(p.angle) * p.radius, Math.sin(p.angle) * p.radius, p.inner ? 0.42 : Math.sin(p.angle * 2) * 0.18);
          mesh.position.copy(rest);
          mesh.rotation.set(p.tilt, Math.cos(p.angle) * 0.38, p.angle - Math.PI / 2);
          if (p.inner) mesh.scale.setScalar(0.74);
          field.add(mesh);
          return { mesh, rest, offset: new THREE.Vector3(), velocity: new THREE.Vector3(), tilt: p.tilt, angle: p.angle };
        });
        const coreMaterial = new THREE.MeshPhysicalMaterial({ metalness: 0.6, roughness: 0.17, clearcoat: 1, emissiveIntensity: 0.18 });
        const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.48, 0), coreMaterial);
        field.add(core);
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(core.geometry), new THREE.LineBasicMaterial({ transparent: true, opacity: 0.45 }));
        core.add(edges);
        const dots = Array.from({ length: 5 }, (_, i) => {
          const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.055 + (i % 2) * 0.025), new THREE.MeshStandardMaterial({ metalness: 0.5, roughness: 0.1, emissiveIntensity: 0.6 }));
          field.add(mesh);
          return mesh;
        });
        const key = new THREE.DirectionalLight(0xffffff, 4);
        key.position.set(3, 5, 5);
        const fill = new THREE.PointLight(0xffffff, 30);
        fill.position.set(-3, -1, 3);
        scene.add(key, fill, new THREE.AmbientLight(0xffffff, 0.35));
        paletteGPU = () => {
          const css = getComputedStyle(document.documentElement);
          const primary = new THREE.Color(css.getPropertyValue("--accent").trim());
          const secondary = new THREE.Color(css.getPropertyValue("--mint").trim());
          materials[0].color.copy(primary).lerp(new THREE.Color(0xffffff), 0.2);
          materials[1].color.copy(secondary).lerp(new THREE.Color(0xffffff), 0.2);
          materials[2].color.copy(primary).lerp(new THREE.Color(0x667080), 0.55);
          coreMaterial.color.copy(primary); coreMaterial.emissive.copy(primary);
          edges.material.color.copy(secondary); fill.color.copy(secondary);
          dots.forEach((dot, i) => { dot.material.color.copy(i % 2 ? secondary : primary); dot.material.emissive.copy(dot.material.color); });
        };
        paletteGPU();
        const resize = () => {
          const width = host!.clientWidth, height = host!.clientHeight;
          if (!width || !height) return;
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.position.z = camera.aspect < 0.9 ? 11 : 9.6;
          camera.updateProjectionMatrix();
          dirty = true;
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host!); resize();
        const cursor = new THREE.Vector3(), delta = new THREE.Vector3(), target = new THREE.Vector3();
        let gpuBurst = 0, gpuReset = 0;
        draw = (time, dt, animate) => {
          const state = interaction.current;
          const step = Math.min(dt * 60, 2);
          const reset = gpuReset !== state.reset;
          gpuReset = state.reset;
          const burst = gpuBurst !== state.burst;
          gpuBurst = state.burst;
          const x = animate ? state.x : 0, y = animate ? state.y : 0;
          field.rotation.x += ((0.15 + y * 0.14) - field.rotation.x) * 0.05 * step;
          field.rotation.y += ((-0.2 + x * 0.2) - field.rotation.y) * 0.05 * step;
          field.rotation.z += ((animate ? state.rotation + time * 0.045 : 0) - field.rotation.z) * 0.035 * step;
          field.updateWorldMatrix(true, false);
          cursor.set(x * 3.25 * camera.aspect, -y * 3.25, 0);
          field.worldToLocal(cursor);
          nodes.forEach((node, i) => {
            if (!animate || reset) { node.offset.set(0, 0, 0); node.velocity.set(0, 0, 0); }
            target.set(0, 0, 0);
            if (animate && state.active) {
              delta.copy(cursor).sub(node.rest);
              const strength = 0.8 / (0.7 + delta.lengthSq());
              if (state.mode === "swirl") target.set(-delta.y, delta.x, Math.sin(i) * 0.4).multiplyScalar(strength);
              else target.copy(delta).multiplyScalar(strength * (state.mode === "scatter" ? -1.35 : 1));
              target.clampLength(0, 1.2);
            }
            if (animate) {
              if (burst) node.velocity.addScaledVector(node.rest.clone().normalize(), 0.22);
              node.velocity.addScaledVector(delta.copy(target).sub(node.offset), 0.025 * step).multiplyScalar(Math.pow(0.87, step));
              node.offset.addScaledVector(node.velocity, step);
            }
            node.mesh.position.copy(node.rest).add(node.offset);
            node.mesh.rotation.x = node.tilt + (animate ? Math.sin(time * 0.7 + i * 0.6) * 0.1 + node.offset.length() * 0.23 : 0);
          });
          core.rotation.set(time * 0.13, time * 0.19, 0.2);
          core.scale.setScalar(1 + (animate ? Math.sin(time * 1.2) * 0.04 : 0));
          dots.forEach((dot, i) => { const a = i / 5 * Math.PI * 2 + time * 0.12; dot.position.set(Math.cos(a) * (2.8 + i * 0.07), Math.sin(a) * 2.5, Math.sin(a * 2) * 0.7); });
          renderer.render(scene, camera);
        };
        disposeGPU = () => {
          resizeObserver.disconnect();
          geometry.dispose(); materials.forEach((m) => m.dispose());
          core.geometry.dispose(); coreMaterial.dispose(); edges.geometry.dispose(); edges.material.dispose();
          dots.forEach((d) => { d.geometry.dispose(); d.material.dispose(); });
          environment.dispose(); room.dispose(); pmrem.dispose(); renderer.dispose(); renderer.domElement.remove();
        };
        dirty = true;
        setReady(true);
      } catch { /* The CSS 3D sculpture remains fully interactive without WebGL. */ }
    }
    void mount3D();
    return () => {
      disposed = true; cancelAnimationFrame(frame); visibility.disconnect(); preferences.disconnect();
      media.removeEventListener("change", updatePreferences); disposeGPU?.();
    };
  }, []);

  function move(event: ReactPointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect(), state = interaction.current;
    state.x = Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1));
    state.y = Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1));
    state.active = true;
    if (state.down) {
      const distance = event.clientX - state.lastX;
      state.rotation += distance * 0.005;
      state.distance += Math.abs(distance);
      state.lastX = event.clientX;
    }
  }
  function bloom() { if (!motion) return; interaction.current.burst++; setBlooms((v) => v + 1); }
  function reset() {
    Object.assign(interaction.current, { x: 0, y: 0, active: false, rotation: 0, burst: 0, mode: "attract" });
    interaction.current.reset++; setMode("attract"); setBlooms(0);
  }
  function choose(next: Mode) { interaction.current.mode = next; setMode(next); }

  return <section className="bloom-section section-wrap" id="playground" aria-labelledby="bloom-title">
    <div className="bloom-intro">
      <div className="eyebrow"><span className="tiny-square"/>CURSOR PLAYGROUND / 002</div>
      <h2 id="bloom-title">Good things<br/>respond to<br/><span className="serif-word">a little curiosity.</span></h2>
      <p>Meet Signal Bloom. A living arrangement of nineteen metallic petals. You bring the movement. It brings a few surprises.</p>
      <div className="bloom-modes" role="group" aria-label="Sculpture interaction mode">{modes.map((m) => <button key={m.id} onClick={() => choose(m.id)} aria-pressed={mode === m.id} className={mode === m.id ? "active" : ""}><AnimatedIcon name={m.icon} size={18}/>{m.name}</button>)}</div>
      <p className="bloom-hint" aria-live="polite">{motion ? modes.find((m) => m.id === mode)!.hint : "Motion is paused. Turn it on in the footer to play."}</p>
      <div className="bloom-actions"><button onClick={bloom} disabled={!motion}><AnimatedIcon name="burst" size={19}/>Make it bloom</button><button onClick={reset} aria-label="Reset Signal Bloom"><AnimatedIcon name="reset" size={17}/>Reset</button></div>
      <span className="bloom-signature">BUILT FROM CURIOSITY. SHAPED BY YOU.</span>
    </div>
    <div className="bloom-art-wrap">
      <div className="bloom-art-top"><span><i/>SIGNAL BLOOM</span><span>INTERACTIVE OBJECT — 002</span></div>
      <div ref={stage} className={`bloom-stage ${ready ? "has-webgl" : ""}`} tabIndex={0} role="group" aria-label="Interactive Signal Bloom sculpture" aria-describedby="bloom-instructions" data-mode={mode}
        onPointerMove={move}
        onPointerDown={(e) => { if (e.button !== 0) return; move(e); interaction.current.down = true; interaction.current.lastX = e.clientX; interaction.current.distance = 0; e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerUp={(e) => { if (interaction.current.down && interaction.current.distance < 8) bloom(); interaction.current.down = false; if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); }}
        onPointerCancel={() => { interaction.current.down = false; interaction.current.active = false; }}
        onPointerLeave={() => { if (!interaction.current.down) { interaction.current.active = false; interaction.current.x = 0; interaction.current.y = 0; } }}
        onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); bloom(); } if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); interaction.current.rotation += e.key === "ArrowLeft" ? -0.3 : 0.3; } }}>
        <div className="bloom-halo"/><div className="bloom-floor"/>
        <div className="bloom-css" aria-hidden="true"><div className="bloom-sculpture">{petals.map((p, i) => <div className={`bloom-petal-slot ${p.inner ? "inner" : ""}`} key={i} style={{ transform: `rotateZ(${p.angle * 57.3}deg) translateY(${-p.radius * 54}px) rotateX(${p.tilt * 57.3}deg)`, "--petal-index": i } as React.CSSProperties}><i className="bloom-petal"/></div>)}<div className="bloom-core"><i/><i/><i/></div></div></div>
        <div className="bloom-canvas" ref={canvasHost} aria-hidden="true"/>
        <span className="bloom-cross bloom-cross-one">+</span><span className="bloom-cross bloom-cross-two">+</span>
      </div>
      <div className="bloom-art-bottom"><p id="bloom-instructions"><AnimatedIcon name="studio" size={14}/><span>Move to guide · Click to bloom · Drag to turn<span className="sr-only">. Keyboard: focus the sculpture, use left or right arrows to turn, and Enter or Space to bloom.</span></span></p><span className="bloom-counter" aria-live="polite">{String(blooms).padStart(2, "0")} BLOOMS</span></div>
    </div>
  </section>;
}
