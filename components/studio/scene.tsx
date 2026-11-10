"use client";
import { useEffect, useRef, useState } from "react";

export default function Scene({
  variant = "hero",
}: {
  variant?: "hero" | "small" | "studio";
}) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!host.current) return;
    let disposed = false,
      cleanup: undefined | (() => void);
    const wrapper = host.current.parentElement;
    const fallbackMove = (e: PointerEvent) => {
      if (
        !wrapper ||
        document.documentElement.dataset.motion === "off" ||
        matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const r = wrapper.getBoundingClientRect();
      wrapper.style.setProperty(
        "--pointer-x",
        `${((e.clientX - r.left) / r.width - 0.5) * 24}deg`,
      );
      wrapper.style.setProperty(
        "--pointer-y",
        `${-((e.clientY - r.top) / r.height - 0.5) * 18}deg`,
      );
    };
    const fallbackLeave = () => {
      wrapper?.style.setProperty("--pointer-x", "0deg");
      wrapper?.style.setProperty("--pointer-y", "0deg");
    };
    const fallbackHost = host.current;
    fallbackHost.addEventListener("pointermove", fallbackMove);
    fallbackHost.addEventListener("pointerleave", fallbackLeave);
    const probe = document.createElement("canvas");
    const webgl = probe.getContext("webgl2");
    if (!webgl)
      return () => {
        fallbackHost.removeEventListener("pointermove", fallbackMove);
        fallbackHost.removeEventListener("pointerleave", fallbackLeave);
      };
    webgl.getExtension("WEBGL_lose_context")?.loseContext();
    import("three")
      .then(async (THREE) => {
        const { RoomEnvironment } =
          await import("three/addons/environments/RoomEnvironment.js");
        if (disposed || !host.current) return;
        const el = host.current;
        let renderer: InstanceType<typeof THREE.WebGLRenderer>;
        try {
          renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "low-power",
          });
        } catch {
          return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
        renderer.setClearColor(0x000000, 0);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.35;
        el.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
        camera.position.set(0, 0, 8.2);
        const pmrem = new THREE.PMREMGenerator(renderer);
        const room = new RoomEnvironment();
        const environment = pmrem.fromScene(room, 0.04);
        scene.environment = environment.texture;
        const group = new THREE.Group();
        scene.add(group);
        const material = new THREE.MeshPhysicalMaterial({
          color: 0xafa3ed,
          metalness: 0.94,
          roughness: 0.2,
          clearcoat: 1,
          clearcoatRoughness: 0.13,
          iridescence: 1,
          iridescenceIOR: 1.4,
          iridescenceThicknessRange: [100, 400],
        });
        const geometry = new THREE.TorusKnotGeometry(1.25, 0.44, 200, 40, 2, 3);
        const knot = new THREE.Mesh(geometry, material);
        knot.rotation.set(0.6, 0.2, -0.15);
        group.add(knot);
        const rings: InstanceType<typeof THREE.Mesh>[] = [];
        [2.2, 2.56].forEach((r, i) => {
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(r, 0.008, 6, 160),
            new THREE.MeshBasicMaterial({
              color: i ? 0x9de5f3 : 0xc8b4ff,
              transparent: true,
              opacity: i ? 0.17 : 0.35,
            }),
          );
          ring.rotation.set(1.18 + i * 0.4, 0.2 + i * 0.6, -0.4);
          group.add(ring);
          rings.push(ring);
        });
        const satellite = new THREE.Mesh(
          new THREE.SphereGeometry(0.105, 24, 24),
          new THREE.MeshStandardMaterial({
            color: 0xcdc0ff,
            emissive: 0xa486fb,
            emissiveIntensity: 0.9,
            metalness: 0.5,
            roughness: 0.1,
          }),
        );
        group.add(satellite);
        const satellite2 = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.14),
          new THREE.MeshStandardMaterial({
            color: 0x95eedf,
            emissive: 0x5adbc9,
            emissiveIntensity: 0.35,
            metalness: 0.8,
            roughness: 0.13,
          }),
        );
        group.add(satellite2);
        const key = new THREE.DirectionalLight(0xd6c5ff, 4.2);
        key.position.set(3, 4, 3);
        scene.add(key);
        const fill = new THREE.PointLight(0x8fffea, 40);
        fill.position.set(-3, -1, 3);
        scene.add(fill);
        const pink = new THREE.PointLight(0xf0a4ff, 25);
        pink.position.set(3, -2, -1);
        scene.add(pink);
        const clock = new THREE.Clock();
        let frame = 0,
          pointerX = 0,
          pointerY = 0,
          visible = true;
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const resize = () => {
          const w = el.clientWidth,
            h = el.clientHeight;
          if (!w || !h) return;
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        const observer = new ResizeObserver(resize);
        observer.observe(el);
        resize();
        const visibility = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
        });
        visibility.observe(el);
        const move = (e: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.55;
          pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.35;
        };
        const leave = () => {
          pointerX = 0;
          pointerY = 0;
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        const render = () => {
          frame = requestAnimationFrame(render);
          if (!visible || document.hidden) return;
          const reduced =
            mq.matches || document.documentElement.dataset.motion === "off";
          const t = reduced ? 1.6 : clock.getElapsedTime();
          knot.rotation.y = reduced ? 0.35 : t * 0.13;
          knot.rotation.z = -0.2 + Math.sin(t * 0.22) * 0.16;
          if (reduced) {
            group.rotation.x = 0;
            group.rotation.y = 0;
          } else {
            group.rotation.y += (pointerX - group.rotation.y) * 0.035;
            group.rotation.x += (pointerY - group.rotation.x) * 0.035;
          }
          group.position.y = Math.sin(t * 0.6) * 0.09;
          satellite.position.set(
            Math.cos(t * 0.32) * 2.2,
            Math.sin(t * 0.32) * 0.75,
            Math.sin(t * 0.32) * 1.65,
          );
          satellite2.position.set(
            Math.cos(t * 0.23 + 2) * 2.5,
            Math.sin(t * 0.23 + 2) * 1.7,
            -0.7,
          );
          renderer.render(scene, camera);
        };
        render();
        setReady(true);
        cleanup = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          visibility.disconnect();
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
          scene.traverse((o) => {
            if (o instanceof THREE.Mesh) {
              o.geometry.dispose();
              const m = o.material;
              Array.isArray(m) ? m.forEach((x) => x.dispose()) : m.dispose();
            }
          });
          room.dispose();
          environment.dispose();
          pmrem.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      })
      .catch(() => {});
    return () => {
      disposed = true;
      cleanup?.();
      fallbackHost.removeEventListener("pointermove", fallbackMove);
      fallbackHost.removeEventListener("pointerleave", fallbackLeave);
    };
  }, []);
  return (
    <div
      className={`scene scene-${variant} ${ready ? "is-ready" : ""}`}
      aria-label="Interactive rotating iridescent sculpture"
    >
      <div className="scene-glow" />
      <div className="scene-fallback" aria-hidden="true">
        <div />
        <div />
        <div />
      </div>
      <div className="scene-canvas" ref={host} />
      <div className="scene-cross cross-one">+</div>
      <div className="scene-cross cross-two">+</div>
      <span className="scene-coordinate">X 0.24&nbsp; Y 0.86&nbsp; Z 1.00</span>
    </div>
  );
}
