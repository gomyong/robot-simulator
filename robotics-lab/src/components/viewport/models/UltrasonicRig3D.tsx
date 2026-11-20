import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { ServoMotor3D } from './HardwareParts3D';

interface UltrasonicRig3DProps {
  distanceCm: number;
  sweepDeg: number;
}

export function UltrasonicRig3D({ distanceCm, sweepDeg }: UltrasonicRig3DProps) {
  const pulse1Ref = useRef<THREE.Mesh>(null);
  const pulse2Ref = useRef<THREE.Mesh>(null);
  const mountRef = useRef<THREE.Group>(null);

  // Scale: 100 cm = 1.6 scene units (clamped smoothly for bench visibility)
  const clampedCm = Math.max(2, Math.min(400, distanceCm));
  const sceneDist = 0.6 + (clampedCm / 400) * 2.6;
  const sweepRad = (sweepDeg * Math.PI) / 180;
  const outOfRange = clampedCm >= 395;

  // 15-degree beam cone half-angle radius at target distance
  const coneRadius = Math.tan((7.5 * Math.PI) / 180) * sceneDist;

  useFrame((state, delta) => {
    if (mountRef.current) {
      mountRef.current.rotation.y = THREE.MathUtils.lerp(
        mountRef.current.rotation.y,
        sweepRad,
        Math.min(1, delta * 10),
      );
    }

    const t = state.clock.elapsedTime;
    const rings = [pulse1Ref.current, pulse2Ref.current];
    rings.forEach((mesh, idx) => {
      if (!mesh) return;
      const phase = (t * 1.15 + idx * 0.5) % 1;
      const zTravel = -0.25 - phase * (sceneDist - 0.05);
      const radiusAtZ = 0.08 + phase * Math.max(0.14, coneRadius * 0.9);
      mesh.position.z = zTravel;
      mesh.scale.set(radiusAtZ, radiusAtZ, 1);
    });
  });

  return (
    <group position={[0, 0.2, 0.6]}>
      {/* Bench Base Plate + SG90 Servo Mount */}
      <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.05, 0.1, 0.72]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.35} />
      </mesh>
      <ServoMotor3D position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} scale={1.3} color="#0284C7" />

      {/* Rotating Servo Horn + HC-SR04 Sensor Assembly */}
      <group ref={mountRef} position={[0, 0.54, 0]}>
        {/* Aluminum Sensor Bracket */}
        <mesh position={[0, -0.14, 0.05]} castShadow>
          <boxGeometry args={[0.9, 0.18, 0.16]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.25} />
        </mesh>

        {/* HC-SR04 Blue PCB */}
        <mesh castShadow>
          <boxGeometry args={[1.38, 0.62, 0.08]} />
          <meshStandardMaterial color="#0284C7" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Center 4.000 MHz Quartz Crystal Oscillator Can */}
        <mesh position={[0, 0.16, -0.055]} castShadow>
          <boxGeometry args={[0.32, 0.12, 0.06]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* 4 Bottom Gold Header Pins (VCC / TRIG / ECHO / GND) */}
        {[-0.18, -0.06, 0.06, 0.18].map((px, i) => (
          <mesh key={i} position={[px, -0.35, 0]}>
            <boxGeometry args={[0.032, 0.14, 0.032]} />
            <meshStandardMaterial color="#FACC15" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* Left & Right Ultrasonic Transducers (40kHz T/R) */}
        {[-0.38, 0.38].map((x, idx) => (
          <group key={idx} position={[x, -0.02, -0.18]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.24, 0.24, 0.32, 24]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.85} roughness={0.22} />
            </mesh>
            <mesh position={[0, -0.165, 0]}>
              <cylinderGeometry args={[0.19, 0.19, 0.02, 20]} />
              <meshStandardMaterial color="#0F172A" roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.178, 0]}>
              <ringGeometry args={[0.08, 0.16, 16]} />
              <meshBasicMaterial color="#64748B" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        {/* 15° Ultrasonic Cone Beam along -Z */}
        <mesh
          position={[0, 0, -sceneDist / 2 - 0.25]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <coneGeometry args={[coneRadius, sceneDist, 32, 1, true]} />
          <meshBasicMaterial
            color={outOfRange ? '#F59E0B' : '#38BDF8'}
            transparent
            opacity={0.14}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Moving Acoustic Wavefront Rings */}
        {[pulse1Ref, pulse2Ref].map((rRef, idx) => (
          <mesh key={idx} ref={rRef} position={[0, 0, -0.4]}>
            <ringGeometry args={[0.82, 1.0, 28]} />
            <meshBasicMaterial
              color={outOfRange ? '#F59E0B' : '#0EA5E9'}
              transparent
              opacity={0.48}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        {/* Target Obstacle Block */}
        <group position={[0, -0.12, -sceneDist - 0.35]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.78, 0.78, 0.24]} />
            <meshStandardMaterial
              color={outOfRange ? '#475569' : '#10B981'}
              roughness={0.4}
              metalness={0.25}
            />
          </mesh>
          <Html position={[0, 0.65, 0]} center zIndexRange={[10, 0]}>
            <div className="pointer-events-none whitespace-nowrap rounded-md border border-[#E6E8EC] bg-white/95 px-2 py-0.5 font-mono text-[11px] font-medium text-[#0A2540] shadow-xs">
              {outOfRange ? '38ms 타임아웃' : `${clampedCm.toFixed(0)} cm · ${Math.round(clampedCm * 58)} μs`}
            </div>
          </Html>
        </group>
      </group>
    </group>
  );
}
