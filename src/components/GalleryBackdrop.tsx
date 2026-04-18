import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Cinematic gallery backdrop:
 *  - red ambient fog
 *  - drifting dust particles
 *  - two volumetric light cones (top corners)
 * Sits behind the transformation gallery.
 */
export function GalleryBackdrop() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0506, 0.06);

    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Floating dust particles
    const count = 600;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xff5555,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // Two volumetric light cones (cylinders) for spotlights
    const makeCone = (x: number, color: number) => {
      const geo = new THREE.CylinderGeometry(0.05, 6, 18, 32, 1, true);
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.07,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const cone = new THREE.Mesh(geo, mat);
      cone.position.set(x, 6, -4);
      cone.rotation.z = (x > 0 ? -1 : 1) * 0.35;
      return cone;
    };
    const coneL = makeCone(-7, 0xff2030);
    const coneR = makeCone(7, 0xff4020);
    scene.add(coneL, coneR);

    let frame = 0;
    let raf = 0;
    const animate = () => {
      frame += 0.003;
      dust.rotation.y = frame * 0.2;
      const arr = dust.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        arr[i] += 0.005; // drift up
        if (arr[i] > 12) arr[i] = -12;
      }
      dust.geometry.attributes.position.needsUpdate = true;
      coneL.material.opacity = 0.06 + Math.sin(frame * 4) * 0.02;
      coneR.material.opacity = 0.06 + Math.cos(frame * 4) * 0.02;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      coneL.geometry.dispose();
      (coneL.material as THREE.Material).dispose();
      coneR.geometry.dispose();
      (coneR.material as THREE.Material).dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />;
}
