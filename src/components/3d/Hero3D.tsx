import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  MeshDistortMaterial, 
  MeshWobbleMaterial, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows,
  OrbitControls,
  Text
} from '@react-three/drei';
import * as THREE from 'three';

const Windmill = ({ position }: { position: [number, number, number] }) => {
  const bladeRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (bladeRef.current) {
      bladeRef.current.rotation.z += 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Tower */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.1, 0.2, 2, 8]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* Blades */}
      <group ref={bladeRef} position={[0, 1.8, 0.2]}>
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
          <mesh key={i} rotation={[0, 0, angle]}>
            <boxGeometry args={[0.1, 1.2, 0.05]} />
            <meshStandardMaterial color="#34d399" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const Tree = ({ position, scale = 1 }: { position: [number, number, number], scale?: number }) => {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <coneGeometry args={[0.3, 0.8, 8]} />
        <meshStandardMaterial color="#059669" />
      </mesh>
    </group>
  );
};

const Island = () => {
  return (
    <group>
      {/* Main Land */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <cylinderGeometry args={[4, 3, 1, 32]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      
      {/* Dirt Layer */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <cylinderGeometry args={[3, 2, 0.5, 32]} />
        <meshStandardMaterial color="#4b2e1e" />
      </mesh>

      {/* Farm Elements */}
      <Windmill position={[-1.5, 0, -1]} />
      <Tree position={[1, 0, 1]} scale={1.2} />
      <Tree position={[1.8, 0, 0.2]} scale={0.8} />
      <Tree position={[0.5, 0, -1.5]} scale={1.1} />
      
      {/* House */}
      <group position={[-0.5, 0, 1.5]} rotation={[0, Math.PI / 4, 0]}>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1, 0.8, 1]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 1, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.9, 0.6, 4]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </group>
    </group>
  );
};

const Scene = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle float and rotation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[10, 8, 15]} fov={35} />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        maxPolarAngle={Math.PI / 2} 
        minPolarAngle={Math.PI / 4}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Environment preset="city" />

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={groupRef}>
          <Island />
          
          {/* Tech Nodes */}
          <mesh position={[2, 2, -2]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
          </mesh>
          <mesh position={[-3, 1.5, 2]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
          </mesh>
        </group>
      </Float>

      <ContactShadows 
        position={[0, -2, 0]} 
        opacity={0.4} 
        scale={20} 
        blur={2} 
        far={4.5} 
      />
    </>
  );
};

const Hero3D: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[500px]">
      <Canvas shadows>
        <Scene />
      </Canvas>
    </div>
  );
};

export default Hero3D;
