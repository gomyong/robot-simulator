import { Html, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { AxisTriad3D, ParallelGripper3D, ServoMotor3D } from './HardwareParts3D';

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
  const j1Ref = useRef<THREE.Group>(null);
  const j2Ref = useRef<THREE.Group>(null);
  const curAnglesRef = useRef({ t1: 0, t2: 0 });

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
    };
  }, [targetX, targetY, elbowUp, payloadKg, ratedNm]);

  useFrame((_, delta) => {
    const k = Math.min(1, delta * 9);
    curAnglesRef.current.t1 = THREE.MathUtils.lerp(curAnglesRef.current.t1, analysis.t1, k);
    curAnglesRef.current.t2 = THREE.MathUtils.lerp(curAnglesRef.current.t2, analysis.t2, k);
    if (j1Ref.current) j1Ref.current.rotation.y = curAnglesRef.current.t1;
    if (j2Ref.current) j2Ref.current.rotation.y = curAnglesRef.current.t2;
  });

  const outerRadius = L1 + L2;
  const innerRadius = Math.abs(L1 - L2);
  const payloadScale = THREE.MathUtils.clamp(0.16 + payloadKg * 0.06, 0.16, 0.28);

  return (
    <group position={[0, 0.15, 0]}>
      <AxisTriad3D position={[0, 0.02, 0]} scale={0.48} label="base_link" />

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

      {/* Reach Vector Line on Floor */}
      <Line
        points={[
          new THREE.Vector3(0, 0.03, 0),
          new THREE.Vector3(targetX, 0.03, -targetY),
        ]}
        color={analysis.reachable ? '#635BFF' : '#EF4444'}
        lineWidth={1.6}
        dashed
        dashSize={0.14}
        gapSize={0.09}
      />

      {/* Target Goal Sphere at (targetX, targetY) mapped to XZ ground (X, -Y) */}
      <group position={[targetX, 0.35, -targetY]}>
        <mesh castShadow>
          <sphereGeometry args={[0.14, 20, 20]} />
          <meshStandardMaterial
            color={analysis.reachable ? '#635BFF' : '#EF4444'}
            emissive={analysis.reachable ? '#635BFF' : '#EF4444'}
            emissiveIntensity={0.45}
          />
        </mesh>
        <Html position={[0, 0.36, 0]} center zIndexRange={[10, 0]}>
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

      {/* Base Pedestal & Shoulder Motor Assembly */}
      <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.5, 0.28, 32]} />
        <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.33, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.14, 24]} />
        <meshStandardMaterial
          color={analysis.torqueSafe ? '#10B981' : '#EF4444'}
          metalness={0.45}
          roughness={0.3}
        />
      </mesh>

      {/* Link 1 Twin-Rail Truss */}
      <group ref={j1Ref} position={[0, 0.42, 0]}>
        <ServoMotor3D position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} scale={1.15} />
        {[-0.08, 0.08].map((lz, i) => (
          <mesh key={i} position={[L1 / 2, 0, lz]} castShadow>
            <boxGeometry args={[L1, 0.12, 0.04]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.26} />
          </mesh>
        ))}
        <mesh position={[L1 / 2, 0, 0]}>
          <boxGeometry args={[L1 * 0.65, 0.06, 0.12]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.75} roughness={0.25} />
        </mesh>

        {/* Elbow Joint */}
        <group ref={j2Ref} position={[L1, 0.06, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.24, 24]} />
            <meshStandardMaterial
              color={analysis.nearSingularity ? '#F59E0B' : '#38BDF8'}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>

          {/* Link 2 Twin-Strut (ends at L2 - 0.25 so Gripper TCP sits right at L2!) */}
          {[-0.065, 0.065].map((lz, i) => (
            <mesh key={i} position={[(L2 - 0.25) / 2, 0.04, lz]} castShadow>
              <boxGeometry args={[L2 - 0.25, 0.1, 0.032]} />
              <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.26} />
            </mesh>
          ))}

          {/* Parallel Gripper Holding Payload Block (TCP at L2!) */}
          <group position={[L2 - 0.25, 0.04, 0]}>
            <ParallelGripper3D
              openRatio={0.22}
              activeColor={analysis.torqueSafe ? '#635BFF' : '#EF4444'}
            >
              <mesh position={[0.25, 0, 0]} castShadow>
                <boxGeometry args={[payloadScale, payloadScale, payloadScale]} />
                <meshStandardMaterial
                  color={analysis.torqueSafe ? '#635BFF' : '#EF4444'}
                  metalness={0.25}
                  roughness={0.4}
                />
              </mesh>
            </ParallelGripper3D>
          </group>
        </group>
      </group>

      {/* Floating 3-Gate Validation Summary */}
      <Html position={[0, 1.5, 0]} center zIndexRange={[10, 0]}>
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
