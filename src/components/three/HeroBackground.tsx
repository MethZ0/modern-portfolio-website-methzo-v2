import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 800 }) {
  const mesh = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const { viewport } = useThree();

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      spd[i] = 0.002 + Math.random() * 0.005;
    }
    return [pos, spd];
  }, [count]);

  useFrame(({ pointer }) => {
    if (!mesh.current) return;
    mouse.current.x += (pointer.x * viewport.width * 0.3 - mouse.current.x) * 0.02;
    mouse.current.y += (pointer.y * viewport.height * 0.3 - mouse.current.y) * 0.02;

    mesh.current.rotation.x += 0.0003;
    mesh.current.rotation.y += 0.0005;
    mesh.current.position.x = mouse.current.x * 0.15;
    mesh.current.position.y = mouse.current.y * 0.15;

    const posArray = mesh.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] -= speeds[i];
      if (posArray[i * 3 + 1] < -4) {
        posArray[i * 3 + 1] = 4;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#888888"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function FloatingLines() {
  const group = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    return Array.from({ length: 15 }, () => {
      const points = [];
      const startX = (Math.random() - 0.5) * 10;
      const startY = (Math.random() - 0.5) * 6;
      const startZ = (Math.random() - 0.5) * 4;
      for (let j = 0; j < 20; j++) {
        points.push(new THREE.Vector3(
          startX + j * 0.15,
          startY + Math.sin(j * 0.5) * 0.3,
          startZ
        ));
      }
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, []);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.0002;
    }
  });

  return (
    <group ref={group}>
      {lines.map((geo, i) => (
        <mesh key={i}>
          <primitive object={geo} attach="geometry" />
          <lineBasicMaterial color="#555555" transparent opacity={0.12} />
        </mesh>
      ))}
    </group>
  );
}

export function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Particles />
        <FloatingLines />
      </Canvas>
    </div>
  );
}
