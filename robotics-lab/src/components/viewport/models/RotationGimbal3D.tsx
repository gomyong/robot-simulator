import { Html } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

interface RotationGimbal3DProps {
  mode: 'euler' | 'quaternion';
  rollDeg: number;
  pitchDeg: number;
  yawDeg: number;
}

export function RotationGimbal3D({
  mode,
  rollDeg,
  pitchDeg,
  yawDeg,
}: RotationGimbal3DProps) {
  const rRad = (rollDeg * Math.PI) / 180;
  const pRad = (pitchDeg * Math.PI) / 180;
  const yRad = (yawDeg * Math.PI) / 180;

  // Map robotics Z-up (Yaw about Y in Three.js up, Pitch about Z/X, Roll about X)
  // Using ZYX Euler order: Yaw(up=Y in Three.js) -> Pitch(Z) -> Roll(X)
  const isGimbalLocked = mode === 'euler' && Math.abs(pitchDeg) >= 82;

  const quatData = useMemo(() => {
    const euler = new THREE.Euler(rRad, yRad, pRad, 'YXZ');
    const q = new THREE.Quaternion().setFromEuler(euler).normalize();
    const angleRad = 2 * Math.acos(THREE.MathUtils.clamp(q.w, -1, 1));
    const s = Math.sqrt(Math.max(0, 1 - q.w * q.w));
    const axis =
      s > 1e-4
        ? new THREE.Vector3(q.x / s, q.y / s, q.z / s).normalize()
        : new THREE.Vector3(0, 1, 0);
    const axisQuat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      axis,
    );
    return {
      q,
      angleDeg: (angleRad * 180) / Math.PI,
      axis,
      axisQuat,
    };
  }, [rRad, pRad, yRad]);

  const bodyRig = (
    <group>
      {/* Drone / Robot IMU Body */}
      <mesh castShadow>
        <boxGeometry args={[1.15, 0.24, 0.72]} />
        <meshStandardMaterial color="#1E293B" metalness={0.55} roughness={0.35} />
      </mesh>
      {/* Front Nose (+X) */}
      <mesh position={[0.66, 0, 0]} castShadow>
        <coneGeometry args={[0.18, 0.36, 16]} />
        <meshStandardMaterial color="#635BFF" />
      </mesh>
      {/* Body Local Axes: X(Red-Front), Y(Green-Left/Side), Z(Blue-Up) */}
      <mesh position={[0.55, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 1.1, 12]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.1, 12]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, 0, 0.48]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.96, 12]} />
        <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.25} />
      </mesh>
    </group>
  );

  return (
    <group position={[0, 1.85, 0]}>
      {/* Base Stand */}
      <mesh position={[0, -1.75, 0]} receiveShadow>
        <cylinderGeometry args={[0.75, 0.95, 0.2, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.45, 16]} />
        <meshStandardMaterial color="#64748B" />
      </mesh>

      {mode === 'euler' ? (
        /* Yaw (around Y up) -> Pitch (around Z) -> Roll (around X) */
        <group rotation={[0, yRad, 0]}>
          {/* Outer Ring: Yaw */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.65, 0.045, 16, 64]} />
            <meshStandardMaterial
              color={isGimbalLocked ? '#EF4444' : '#0EA5E9'}
              emissive={isGimbalLocked ? '#EF4444' : '#000000'}
              emissiveIntensity={0.35}
            />
          </mesh>

          <group rotation={[0, 0, pRad]}>
            {/* Middle Ring: Pitch */}
            <mesh>
              <torusGeometry args={[1.38, 0.045, 16, 64]} />
              <meshStandardMaterial color="#10B981" />
            </mesh>

            <group rotation={[rRad, 0, 0]}>
              {/* Inner Ring: Roll */}
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[1.1, 0.045, 16, 64]} />
                <meshStandardMaterial
                  color={isGimbalLocked ? '#EF4444' : '#635BFF'}
                  emissive={isGimbalLocked ? '#EF4444' : '#000000'}
                  emissiveIntensity={0.35}
                />
              </mesh>
              {bodyRig}
            </group>
          </group>
        </group>
      ) : (
        <group>
          {/* Single Eigen-Axis Skewer Visualization for Quaternion */}
          <group quaternion={quatData.axisQuat}>
            <mesh>
              <cylinderGeometry args={[0.032, 0.032, 3.6, 16]} />
              <meshStandardMaterial
                color="#F59E0B"
                emissive="#F59E0B"
                emissiveIntensity={0.4}
              />
            </mesh>
            <mesh position={[0, 1.85, 0]}>
              <coneGeometry args={[0.1, 0.24, 16]} />
              <meshStandardMaterial color="#F59E0B" />
            </mesh>
          </group>

          {/* Outer Clean Reference Sphere Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.55, 0.025, 12, 64]} />
            <meshStandardMaterial color="#94A3B8" transparent opacity={0.45} />
          </mesh>

          {/* Body Oriented via Quaternion Directly */}
          <group quaternion={quatData.q}>{bodyRig}</group>
        </group>
      )}

      {/* Top Floating Telemetry */}
      <Html position={[0, 2.15, 0]} center>
        <div
          className={`pointer-events-none whitespace-nowrap rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold shadow-sm ${
            isGimbalLocked
              ? 'border-rose-300 bg-rose-50/95 text-rose-700'
              : mode === 'quaternion'
                ? 'border-amber-300 bg-amber-50/95 text-amber-900'
                : 'border-[#E6E8EC] bg-white/95 text-[#0A2540]'
          }`}
        >
          {isGimbalLocked
            ? 'GIMBAL LOCK! Pitch ≈ ±90° → Roll축 & Yaw축 평행 겹침 (자유도 상실)'
            : mode === 'quaternion'
              ? `q = (${quatData.q.x.toFixed(2)}, ${quatData.q.y.toFixed(2)}, ${quatData.q.z.toFixed(2)}, ${quatData.q.w.toFixed(2)}) · θ=${quatData.angleDeg.toFixed(1)}°`
              : `ZYX Euler: R=${rollDeg}° P=${pitchDeg}° Y=${yawDeg}°`}
        </div>
      </Html>
    </group>
  );
}
