import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface UltrasonicRig3DProps {
  distanceCm: number;
  sweepDeg: number;
}

export function UltrasonicRig3D({ distanceCm, sweepDeg }: UltrasonicRig3DProps) {
  // Scale: 100 cm = 1.6 scene units (clamped smoothly for bench visibility)
  const clampedCm = Math.max(2, Math.min(400, distanceCm));
  const sceneDist = 0.6 + (clampedCm / 400) * 2.6;
  const sweepRad = (sweepDeg * Math.PI) / 180;
  const outOfRange = clampedCm >= 395;

  // 15-degree beam cone half-angle radius at target distance
  const coneRadius = Math.tan((7.5 * Math.PI) / 180) * sceneDist;

  return (
    <group position={[0, 0.2, 0.6]}>
      {/* Servo SG90 Mount Base */}
      <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.28, 0.45]} />
        <meshStandardMaterial color="#1E293B" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Rotating Servo Horn + HC-SR04 Sensor Assembly */}
      <group position={[0, 0.48, 0]} rotation={[0, sweepRad, 0]}>
        {/* HC-SR04 Blue PCB */}
        <mesh castShadow>
          <boxGeometry args={[1.35, 0.6, 0.08]} />
          <meshStandardMaterial color="#0284C7" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Left & Right Ultrasonic Transducers (40kHz T/R) */}
        {[-0.36, 0.36].map((x, idx) => (
          <group key={idx} position={[x, 0, -0.18]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.24, 0.24, 0.32, 24]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.85} roughness={0.22} />
            </mesh>
            <mesh position={[0, -0.165, 0]}>
              <cylinderGeometry args={[0.19, 0.19, 0.02, 20]} />
              <meshStandardMaterial color="#0F172A" roughness={0.7} />
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
            opacity={0.18}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Target Obstacle Block */}
        <group position={[0, -0.1, -sceneDist - 0.35]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.75, 0.75, 0.24]} />
            <meshStandardMaterial
              color={outOfRange ? '#475569' : '#10B981'}
              roughness={0.4}
              metalness={0.25}
            />
          </mesh>
          <Html position={[0, 0.62, 0]} center>
            <div className="pointer-events-none whitespace-nowrap rounded-md border border-[#E6E8EC] bg-white/95 px-2 py-0.5 font-mono text-[11px] font-medium text-[#0A2540]">
              {outOfRange ? '38ms 타임아웃' : `${clampedCm.toFixed(0)} cm · ${Math.round(clampedCm * 58)} μs`}
            </div>
          </Html>
        </group>
      </group>
    </group>
  );
}
