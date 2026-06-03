import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Morphing wireframe icosahedron — the hero centerpiece.
 * Pure white edges on a transparent canvas. A breathing wireframe core,
 * a faint outline shell, and a sphere of orbiting points for a subtle
 * "neural / mechanical" feel. Everything is monochrome.
 */

const RADIUS = 1.7;

// Static geometry lives at module scope so it isn't a hook-owned value
// (the per-frame vertex mutation below would otherwise trip the immutability rule).
const coreGeo = new THREE.IcosahedronGeometry(RADIUS, 3);
const coreOriginal = Float32Array.from(coreGeo.attributes.position.array);

const pointGeo = (() => {
  const count = 220;
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // even-ish distribution via golden spiral
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = RADIUS * 1.35;
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  return g;
})();

function MorphCore() {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Vertex displacement — organic breathing morph (pure fn of original pos,
    // so duplicated verts stay watertight).
    const pos = coreGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const ix = i * 3;
      const ox = coreOriginal[ix];
      const oy = coreOriginal[ix + 1];
      const oz = coreOriginal[ix + 2];
      const len = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1;
      const noise =
        Math.sin(ox * 2.2 + t * 0.9) *
        Math.cos(oy * 2.2 + t * 0.7) *
        Math.sin(oz * 2.2 + t * 1.1);
      const disp = RADIUS * (1 + noise * 0.14);
      pos.setXYZ(i, (ox / len) * disp, (oy / len) * disp, (oz / len) * disp);
    }
    pos.needsUpdate = true;

    // Mouse parallax — gentle lerp toward pointer + slow drift.
    if (groupRef.current) {
      const g = groupRef.current;
      g.rotation.y += (state.pointer.x * 0.45 - g.rotation.y) * 0.04 + 0.0016;
      g.rotation.x += (-state.pointer.y * 0.3 - g.rotation.x) * 0.04;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = -t * 0.05;
      pointsRef.current.rotation.x = t * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {/* morphing wireframe core */}
      <mesh geometry={coreGeo}>
        <meshBasicMaterial wireframe color="#ffffff" transparent opacity={0.5} />
      </mesh>

      {/* faint inner solid for a hint of mass */}
      <mesh geometry={coreGeo} scale={0.985}>
        <meshBasicMaterial color="#000000" transparent opacity={0.55} />
      </mesh>

      {/* static larger outline shell */}
      <mesh scale={1.42}>
        <icosahedronGeometry args={[RADIUS, 1]} />
        <meshBasicMaterial wireframe color="#ffffff" transparent opacity={0.08} />
      </mesh>

      {/* orbiting node points */}
      <points ref={pointsRef} geometry={pointGeo}>
        <pointsMaterial color="#ffffff" size={0.028} transparent opacity={0.7} sizeAttenuation />
      </points>
    </group>
  );
}

interface Props {
  className?: string;
}

const Scene3D = ({ className }: Props) => {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
        frameloop={prefersReduced ? 'demand' : 'always'}
      >
        <MorphCore />
      </Canvas>
    </div>
  );
};

export default Scene3D;
