import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface PidServoRig3DProps {
  setpointDeg: number;
  kp: number;
  ki: number;
  kd: number;
}

export function PidServoRig3D({ setpointDeg, kp, ki, kd }: PidServoRig3DProps) {
  const armRef = useRef<THREE.Group>(null);
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const integralRef = useRef(0);
  const prevErrRef = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.033);
    const targetRad = (setpointDeg * Math.PI) / 180;
    const err = targetRad - angleRef.current;

    integralRef.current = THREE.MathUtils.clamp(
      integralRef.current + err * dt,
      -2.0,
      2.0,
    );
    const deriv = (err - prevErrRef.current) / Math.max(dt, 0.001);
    prevErrRef.current = err;

    const torque = kp * err + ki * integralRef.current + kd * deriv;
    // Simple 2nd-order rotational plant preview
    const accel = torque * 6.5 - velocityRef.current * 2.2;
    velocityRef.current = THREE.MathUtils.clamp(velocityRef.current + accel * dt, -18, 18);
    angleRef.current = THREE.MathUtils.clamp(
      angleRef.current + velocityRef.current * dt,
      -Math.PI,
      Math.PI,
    );

    if (armRef.current) {
      armRef.current.rotation.z = -angleRef.current;
    }
  });

  const setpointRad = (setpointDeg * Math.PI) / 180;

  return (
    <group position={[0, 1.15, 0]}>
      {/* Dial / Encoder Backplate */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.45, 1.45, 0.14, 48]} />
        <meshStandardMaterial color="#111827" roughness={0.45} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.32, 1.32, 0.02, 48]} />
        <meshStandardMaterial color="#0F172A" roughness={0.6} />
      </mesh>

      {/* Target Setpoint Ghost Indicator */}
      <group rotation={[0, 0, -setpointRad]}>
        <mesh position={[0, 0.72, 0.11]}>
          <boxGeometry args={[0.06, 1.15, 0.03]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#F59E0B"
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>

      {/* Active Controlled Rotor Arm */}
      <group ref={armRef}>
        <mesh position={[0, 0.62, 0.16]} castShadow>
          <boxGeometry args={[0.14, 1.18, 0.08]} />
          <meshStandardMaterial color="#38BDF8" metalness={0.5} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.12, 24]} />
          <meshStandardMaterial color="#10B981" metalness={0.65} roughness={0.28} />
        </mesh>
      </group>

      {/* Pedestal Stand */}
      <mesh position={[0, -0.95, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 1.1, 0.35]} />
        <meshStandardMaterial color="#1E293B" metalness={0.5} roughness={0.4} />
      </mesh>

      <Html position={[0, -0.95, 0.35]} center>
        <div className="pointer-events-none whitespace-nowrap rounded-md border border-[#E6E8EC] bg-white/95 px-2 py-0.5 font-mono text-[11px] font-medium text-[#0A2540]">
          목표각 {setpointDeg}° · Kp={kp.toFixed(1)} Ki={ki.toFixed(1)} Kd={kd.toFixed(2)}
        </div>
      </Html>
    </group>
  );
}
