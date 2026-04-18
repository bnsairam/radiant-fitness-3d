import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * 3D animated background: a wireframe icosahedron + glowing particles
 * giving the hero a deep, cinematic, red, three-dimensional feel.
 */
export function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0506, 0.04);

    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Central sculpted icosahedron (red metallic wireframe)
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

    // Solid inner core
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

    // Particle field
    const particleCount = 800;
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

    // Lights
    const ambient = new THREE.AmbientLight(0x220000, 0.5);
    scene.add(ambient);
    const point1 = new THREE.PointLight(0xff0033, 4, 50);
    point1.position.set(5, 5, 5);
    scene.add(point1);
    const point2 = new THREE.PointLight(0xff4400, 3, 50);
    point2.position.set(-5, -3, 4);
    scene.add(point2);

    // Mouse parallax
    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    let frame = 0;
    let raf = 0;
    const animate = () => {
      frame += 0.005;
      ico.rotation.x = frame * 0.6;
      ico.rotation.y = frame * 0.8;
      core.rotation.x = -frame * 0.4;
      core.rotation.z = frame * 0.5;
      particles.rotation.y = frame * 0.1;

      // Camera parallax
      camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.05;
      camera.position.y += (-mouse.y * 1.5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

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
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
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
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" aria-hidden="true" />;
}
