"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Image from 'next/image';

interface FloatingLogoProps {
  opacity?: number;
}

function FloatingLogo3D() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Smooth floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color="#0052ff"
        metalness={0.7}
        roughness={0.2}
        opacity={0.15}
        transparent
      />
    </mesh>
  );
}

function BlockchainGrid() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          args={[particles, 3]}
          attach="attributes-position"
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#0ce50c"
        opacity={0.3}
        transparent
        sizeAttenuation
      />
    </points>
  );
}

export default function AnimatedBackground({ opacity = 0.4 }: FloatingLogoProps) {
  return (
    <>
      {/* 3D Canvas */}
      <div className="fixed inset-0 z-0" style={{ opacity }}>
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#0052ff" />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#0ce50c" />
          <FloatingLogo3D />
          <BlockchainGrid />
        </Canvas>
      </div>

      {/* Animated PENX Logo */}
      <div 
        className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: opacity * 0.5 }}
      >
        <div 
          className="relative animate-float"
          style={{
            animation: 'float 6s ease-in-out infinite',
          }}
        >
          <Image
            src="/penx-icon-nobg.png"
            alt="PENX"
            width={400}
            height={400}
            className="opacity-20 blur-sm"
            style={{
              filter: 'brightness(0.3) blur(8px)',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(0.95);
          }
          50% {
            transform: translateY(-30px) scale(1.05);
          }
        }
      `}</style>
    </>
  );
}
