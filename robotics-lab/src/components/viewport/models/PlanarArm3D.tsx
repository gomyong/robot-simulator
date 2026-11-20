import { Html } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

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
  const t1 = (theta1Deg * Math.PI) / 180;
  const t2 = (theta2Deg * Math.PI) / 180;

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
        <group position={[targetX, 0.35, -targetY]}>
          <mesh castShadow>
            <sphereGeometry args={[0.14, 18, 18]} />
            <meshStandardMaterial
              color={ikReachable ? '#635BFF' : '#EF4444'}
              emissive={ikReachable ? '#635BFF' : '#EF4444'}
              emissiveIntensity={0.45}
            />
          </mesh>
          <Html position={[0, 0.32, 0]} center>
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
      )}

      {/* Base Pedestal & Servo 1 */}
      <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.45, 0.28, 28]} />
        <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.34, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.16, 24]} />
        <meshStandardMaterial color="#38BDF8" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Joint 1 Rotation Group (around Y axis, mapped from 2D planar θ1) */}
      <group position={[0, 0.42, 0]} rotation={[0, -t1, 0]}>
        {/* Link 1 Body along +X */}
        <mesh position={[L1 / 2, 0, 0]} castShadow>
          <boxGeometry args={[L1, 0.14, 0.22]} />
          <meshStandardMaterial color="#334155" metalness={0.65} roughness={0.28} />
        </mesh>

        {/* Joint 2 Servo Housing at end of Link 1 */}
        <group position={[L1, 0.06, 0]} rotation={[0, -t2, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.24, 24]} />
            <meshStandardMaterial color="#10B981" metalness={0.55} roughness={0.3} />
          </mesh>

          {/* Link 2 Body along +X */}
          <mesh position={[L2 / 2, 0.04, 0]} castShadow>
            <boxGeometry args={[L2, 0.12, 0.18]} />
            <meshStandardMaterial color="#475569" metalness={0.65} roughness={0.28} />
          </mesh>

          {/* End-Effector Pen / Gripper Node */}
          <group position={[L2, 0.04, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.11, 0.08, 0.26, 20]} />
              <meshStandardMaterial
                color="#38BDF8"
                emissive="#38BDF8"
                emissiveIntensity={0.45}
                metalness={0.4}
                roughness={0.25}
              />
            </mesh>
            <Html position={[0, 0.35, 0]} center>
              <div className="pointer-events-none whitespace-nowrap rounded-md border border-[#E6E8EC] bg-white/95 px-2 py-0.5 font-mono text-[11px] font-medium text-[#0A2540]">
                ({fk.x.toFixed(2)}, {fk.y.toFixed(2)})
              </div>
            </Html>
          </group>
        </group>
      </group>
    </group>
  );
}
