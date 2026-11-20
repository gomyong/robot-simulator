import { Html } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

interface ArmProject3DProps {
  targetX: number;
  targetY: number;
  elbowUp: boolean;
  payloadKg: number;
  ratedNm: number;
}

const L1 = 1.8;
const L2 = 1.3;

export function ArmProject3D({
  targetX,
  targetY,
  elbowUp,
  payloadKg,
  ratedNm,
}: ArmProject3DProps) {
  const analysis = useMemo(() => {
    const r2 = targetX * targetX + targetY * targetY;
    const r = Math.sqrt(r2);
    const D = (r2 - L1 * L1 - L2 * L2) / (2 * L1 * L2);
    const reachable = Math.abs(D) <= 1.0 && r >= Math.abs(L1 - L2);

    const clampedD = THREE.MathUtils.clamp(D, -1, 1);
    const s2 = (elbowUp ? 1 : -1) * Math.sqrt(Math.max(0, 1 - clampedD * clampedD));
    const t2 = Math.atan2(s2, clampedD);
    const t1 =
      Math.atan2(targetY, targetX) -
      Math.atan2(L2 * Math.sin(t2), L1 + L2 * Math.cos(t2));

    const sinT2Abs = Math.abs(Math.sin(t2));
    const nearSingularity = reachable && sinT2Abs < 0.15;

    // Static gravity torque on shoulder joint (assuming horizontal reach risk)
    const linkTorque = 0.35 * (L1 * 0.5) * 9.81;
    const payloadTorque = payloadKg * Math.max(0.2, Math.abs(targetX)) * 9.81;
    const reqNm = linkTorque + payloadTorque;
    const safetyFactor = ratedNm / Math.max(0.05, reqNm);
    const torqueSafe = safetyFactor >= 1.5;

    const fkX = L1 * Math.cos(t1) + L2 * Math.cos(t1 + t2);
    const fkY = L1 * Math.sin(t1) + L2 * Math.sin(t1 + t2);

    return {
      t1,
      t2,
      D,
      reachable,
      nearSingularity,
      sinT2Abs,
      reqNm,
      safetyFactor,
      torqueSafe,
      allPass: reachable && !nearSingularity && torqueSafe,
      fkX,
      fkY,
    };
  }, [targetX, targetY, elbowUp, payloadKg, ratedNm]);

  const outerRadius = L1 + L2;
  const innerRadius = Math.abs(L1 - L2);
  const payloadScale = 0.16 + payloadKg * 0.08;

  return (
    <group position={[0, 0.15, 0]}>
      {/* Workspace Annulus */}
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <mesh>
          <ringGeometry args={[innerRadius, outerRadius, 64]} />
          <meshBasicMaterial
            color={analysis.allPass ? '#10B981' : '#EF4444'}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh>
          <ringGeometry args={[outerRadius - 0.03, outerRadius, 64]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <ringGeometry args={[innerRadius, innerRadius + 0.03, 64]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Target Goal Sphere at (targetX, targetY) mapped to XZ ground (X, -Y) */}
      <group position={[targetX, 0.35, -targetY]}>
        <mesh castShadow>
          <sphereGeometry args={[0.16, 20, 20]} />
          <meshStandardMaterial
            color={analysis.reachable ? '#635BFF' : '#EF4444'}
            emissive={analysis.reachable ? '#635BFF' : '#EF4444'}
            emissiveIntensity={0.45}
          />
        </mesh>
        <Html position={[0, 0.35, 0]} center>
          <div
            className={`pointer-events-none whitespace-nowrap rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
              analysis.reachable
                ? 'border-[#C7D2FE] bg-white/95 text-[#4338CA]'
                : 'border-rose-300 bg-rose-50/95 text-rose-700'
            }`}
          >
            목표 ({targetX.toFixed(1)}, {targetY.toFixed(1)})
            {!analysis.reachable && ` · |D|=${Math.abs(analysis.D).toFixed(2)} > 1 불가!`}
          </div>
        </Html>
      </group>

      {/* Base & Shoulder Joint */}
      <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.48, 0.28, 28]} />
        <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.34, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.16, 24]} />
        <meshStandardMaterial
          color={analysis.torqueSafe ? '#10B981' : '#EF4444'}
          metalness={0.45}
          roughness={0.3}
        />
      </mesh>

      {/* Link 1 */}
      <group position={[0, 0.42, 0]} rotation={[0, -analysis.t1, 0]}>
        <mesh position={[L1 / 2, 0, 0]} castShadow>
          <boxGeometry args={[L1, 0.15, 0.24]} />
          <meshStandardMaterial color="#334155" metalness={0.65} roughness={0.28} />
        </mesh>

        {/* Elbow Joint */}
        <group position={[L1, 0.06, 0]} rotation={[0, -analysis.t2, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.19, 0.19, 0.24, 24]} />
            <meshStandardMaterial
              color={analysis.nearSingularity ? '#F59E0B' : '#38BDF8'}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>

          {/* Link 2 */}
          <mesh position={[L2 / 2, 0.04, 0]} castShadow>
            <boxGeometry args={[L2, 0.12, 0.19]} />
            <meshStandardMaterial color="#475569" metalness={0.65} roughness={0.28} />
          </mesh>

          {/* End-Effector + Payload Block */}
          <group position={[L2, 0.04, 0]}>
            <mesh position={[0, 0.14, 0]} castShadow>
              <boxGeometry args={[payloadScale, payloadScale, payloadScale]} />
              <meshStandardMaterial
                color={analysis.torqueSafe ? '#635BFF' : '#EF4444'}
                metalness={0.25}
                roughness={0.4}
              />
            </mesh>
          </group>
        </group>
      </group>

      {/* Floating 3-Gate Validation Summary */}
      <Html position={[0, 1.5, 0]} center>
        <div className="pointer-events-none flex items-center gap-2 whitespace-nowrap rounded-lg border border-[#E6E8EC] bg-white/95 px-2.5 py-1 font-mono text-[10px] font-semibold shadow-sm">
          <span className={analysis.reachable ? 'text-emerald-600' : 'text-rose-600'}>
            {analysis.reachable ? '✓ 도달OK' : '✗ 범위초과'}
          </span>
          <span className="text-[#CBD5E1]">|</span>
          <span className={!analysis.nearSingularity ? 'text-emerald-600' : 'text-amber-600'}>
            {!analysis.nearSingularity
              ? '✓ 특이점안전'
              : `⚠ 특이점근접(|sinθ₂|=${analysis.sinT2Abs.toFixed(2)})`}
          </span>
          <span className="text-[#CBD5E1]">|</span>
          <span className={analysis.torqueSafe ? 'text-emerald-600' : 'text-rose-600'}>
            {analysis.torqueSafe
              ? `✓ 토크SF=${analysis.safetyFactor.toFixed(1)}x`
              : `✗ 토크과부하(${analysis.reqNm.toFixed(1)}/${ratedNm}Nm)`}
          </span>
        </div>
      </Html>
    </group>
  );
}
