import { useEffect, useRef } from "react";

/**
 * 3D animated background: a wireframe icosahedron + glowing particles.
 * Optimizations:
 *  - Skips entirely on prefers-reduced-motion or coarse-pointer (mobile) devices.
 *  - Lazy-loads three.js so it doesn't block first paint.
 *  - Pauses RAF loop when the tab is hidden or the hero scrolls off-screen.
 *  - Caps pixel ratio + uses a low-power GPU hint.
 */
export function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || coarsePointer) return;

    let cleanup: (() => void) | null = null;
    let cancelled = false;

    const init = async () => {
      const THREE = await import("three");
      if (cancelled || !mount) return;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0a0506, 0.04);

      const camera = new THREE.PerspectiveCamera(
        60,
        mount.clientWidth / mount.clientHeight,
        0.1,
        1000,
      );
      camera.position.z = 8;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const geo = new THREE.IcosahedronGeometry(2.2, 1);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xff1a1a,
        emissive: 0xff0010,
        emissiveIntensity: 0.6,
        metalness: 0.9,
        roughness: 0.2,
        wireframe: true,
      });
      const ico = new THREE.Mesh(geo, mat);
      scene.add(ico);

      const coreGeo = new THREE.IcosahedronGeometry(1.4, 0);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x330000,
        emissive: 0xff2020,
        emissiveIntensity: 0.4,
        metalness: 1,
        roughness: 0.3,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      scene.add(core);

      const particleCount = 500;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      }
      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0xff3344,
        size: 0.04,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      scene.add(new THREE.AmbientLight(0x220000, 0.5));
      const point1 = new THREE.PointLight(0xff0033, 4, 50);
      point1.position.set(5, 5, 5);
      scene.add(point1);
      const point2 = new THREE.PointLight(0xff4400, 3, 50);
      point2.position.set(-5, -3, 4);
      scene.add(point2);

      const mouse = { x: 0, y: 0 };
      let mouseRaf = 0;
      const onMove = (e: MouseEvent) => {
        if (mouseRaf) return;
        mouseRaf = requestAnimationFrame(() => {
          mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
          mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
          mouseRaf = 0;
        });
      };
      window.addEventListener("mousemove", onMove, { passive: true });

      let frame = 0;
      let raf = 0;
      let running = true;
      const animate = () => {
        if (!running) return;
        frame += 0.005;
        ico.rotation.x = frame * 0.6;
        ico.rotation.y = frame * 0.8;
        core.rotation.x = -frame * 0.4;
        core.rotation.z = frame * 0.5;
        particles.rotation.y = frame * 0.1;
        camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.05;
        camera.position.y += (-mouse.y * 1.5 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      animate();

      const start = () => {
        if (running) return;
        running = true;
        animate();
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(raf);
      };

      const onVisibility = () => {
        if (document.hidden) stop();
        else start();
      };
      document.addEventListener("visibilitychange", onVisibility);

      const visObs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) start();
          else stop();
        },
        { threshold: 0 },
      );
      visObs.observe(mount);

      const onResize = () => {
        if (!mount) return;
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        stop();
        if (mouseRaf) cancelAnimationFrame(mouseRaf);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);
        visObs.disconnect();
        renderer.dispose();
        geo.dispose();
        mat.dispose();
        coreGeo.dispose();
        coreMat.dispose();
        particleGeo.dispose();
        particleMat.dispose();
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      };
    };

    const idle =
      "requestIdleCallback" in window
        ? (window as unknown as {
            requestIdleCallback: (cb: () => void) => number;
          }).requestIdleCallback
        : (cb: () => void) => window.setTimeout(cb, 200);
    idle(() => {
      if (!cancelled) init();
    });

    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" aria-hidden="true" />;
}
