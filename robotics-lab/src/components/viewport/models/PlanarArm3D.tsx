import { Html, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { AxisTriad3D, ParallelGripper3D, ServoMotor3D } from './HardwareParts3D';

interface PlanarArm3DProps {
  theta1Deg: number;
  theta2Deg: number;
  L1: number;
  L2: number;
  ikMode?: boolean;
  targetX?: number;
  targetY?: number;
}

export function PlanarArm3D({
  theta1Deg,
  theta2Deg,
  L1,
  L2,
  ikMode = false,
  targetX = 2.0,
  targetY = 1.2,
}: PlanarArm3DProps) {
  const j1Ref = useRef<THREE.Group>(null);
  const j2Ref = useRef<THREE.Group>(null);
  const t1 = (theta1Deg * Math.PI) / 180;
  const t2 = (theta2Deg * Math.PI) / 180;

  useFrame((_, delta) => {
    const k = Math.min(1, delta * 12);
    if (j1Ref.current) j1Ref.current.rotation.y = THREE.MathUtils.lerp(j1Ref.current.rotation.y, t1, k);
    if (j2Ref.current) j2Ref.current.rotation.y = THREE.MathUtils.lerp(j2Ref.current.rotation.y, t2, k);
  });

  const ikD = (targetX * targetX + targetY * targetY - L1 * L1 - L2 * L2) / (2 * L1 * L2);
  const ikReachable = Math.abs(ikD) <= 1;

  const fk = useMemo(() => {
    const x = L1 * Math.cos(t1) + L2 * Math.cos(t1 + t2);
    const y = L1 * Math.sin(t1) + L2 * Math.sin(t1 + t2);
    return { x, y };
  }, [L1, L2, t1, t2]);

  const outerRadius = L1 + L2;
  const innerRadius = Math.abs(L1 - L2);

  return (
    <group position={[0, 0.15, 0]}>
      <AxisTriad3D position={[0, 0.02, 0]} scale={0.45} label="O (0,0)" />

      {/* Workspace Annulus Visualization on the XY-plane mapped to XZ ground */}
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <mesh>
          <ringGeometry args={[Math.max(0.05, innerRadius), outerRadius, 64]} />
          <meshBasicMaterial
            color="#38BDF8"
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh>
          <ringGeometry args={[outerRadius - 0.025, outerRadius, 64]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>
        {innerRadius > 0.05 && (
          <mesh>
            <ringGeometry args={[innerRadius, innerRadius + 0.025, 64]} />
            <meshBasicMaterial color="#F59E0B" transparent opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>

      {ikMode && (
        <>
          <Line
            points={[new THREE.Vector3(0, 0.03, 0), new THREE.Vector3(targetX, 0.03, -targetY)]}
            color={ikReachable ? '#635BFF' : '#EF4444'}
            lineWidth={1.5}
            dashed
            dashSize={0.14}
            gapSize={0.08}
          />
          <group position={[targetX, 0.35, -targetY]}>
            <mesh castShadow>
              <sphereGeometry args={[0.14, 18, 18]} />
              <meshStandardMaterial
                color={ikReachable ? '#635BFF' : '#EF4444'}
                emissive={ikReachable ? '#635BFF' : '#EF4444'}
                emissiveIntensity={0.45}
              />
            </mesh>
            <Html position={[0, 0.32, 0]} center zIndexRange={[10, 0]}>
              <div
                className={`pointer-events-none whitespace-nowrap rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                  ikReachable
                    ? 'border-[#C7D2FE] bg-white/95 text-[#4338CA]'
                    : 'border-rose-300 bg-rose-50/95 text-rose-700'
                }`}
              >
                IK 목표 ({targetX.toFixed(1)}, {targetY.toFixed(1)})
                {!ikReachable && ' · |D|>1 도달불가!'}
              </div>
            </Html>
          </group>
        </>
      )}

      {/* Base Pedestal & Servo 1 */}
      <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.48, 0.28, 32]} />
        <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.33, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.14, 24]} />
        <meshStandardMaterial color="#38BDF8" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Joint 1 Rotation Group */}
      <group ref={j1Ref} position={[0, 0.42, 0]}>
        <ServoMotor3D position={[0, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]} scale={1.05} />
        {/* Twin-Rail Link 1 */}
        {[-0.075, 0.075].map((lz, i) => (
          <mesh key={i} position={[L1 / 2, 0, lz]} castShadow>
            <boxGeometry args={[L1, 0.12, 0.036]} />
            <meshStandardMaterial color="#334155" metalness={0.68} roughness={0.28} />
          </mesh>
        ))}

        {/* Joint 2 Servo Housing at end of Link 1 */}
        <group ref={j2Ref} position={[L1, 0.06, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.24, 24]} />
            <meshStandardMaterial color="#10B981" metalness={0.55} roughness={0.3} />
          </mesh>

          {/* Twin-Rail Link 2 (ends at L2 - 0.25 so Gripper TCP hits exact FK point (x, -y)!) */}
          {[-0.06, 0.06].map((lz, i) => (
            <mesh key={i} position={[(L2 - 0.25) / 2, 0.04, lz]} castShadow>
              <boxGeometry args={[L2 - 0.25, 0.1, 0.03]} />
              <meshStandardMaterial color="#475569" metalness={0.68} roughness={0.28} />
            </mesh>
          ))}

          {/* Parallel Gripper End-Effector + TCP Coordinate Readout */}
          <group position={[L2 - 0.25, 0.04, 0]}>
            <ParallelGripper3D openRatio={0.65} activeColor="#38BDF8" />
            <Html position={[0.25, 0.36, 0]} center zIndexRange={[10, 0]}>
              <div className="pointer-events-none whitespace-nowrap rounded-md border border-[#E6E8EC] bg-white/95 px-2 py-0.5 font-mono text-[11px] font-medium text-[#0A2540] shadow-xs">
                TCP ({fk.x.toFixed(2)}, {fk.y.toFixed(2)})
              </div>
            </Html>
          </group>
        </group>
      </group>
    </group>
  );
}
