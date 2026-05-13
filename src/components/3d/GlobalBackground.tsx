import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Particles = ({ count = 500 }) => {
  const mesh = useRef<THREE.Points>(null);
  const light = useRef<THREE.PointLight>(null);

  // Generate random positions and colors for particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = THREE.MathUtils.randFloatSpread(100);
      const y = THREE.MathUtils.randFloatSpread(100);
      const z = THREE.MathUtils.randFloatSpread(100);
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#10b981"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
};

const GlobalBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none bg-background">
      <Canvas camera={{ position: [0, 0, 50], fov: 75 }}>
        <Particles />
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
};

export default GlobalBackground;
