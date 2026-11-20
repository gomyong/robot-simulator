import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
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

  const dialTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const cx = 256;
    const cy = 256;

    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle concentric dial rings
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 3;
    for (const r of [140, 195, 228]) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 24 Degree Ticks (every 15 deg, top = 0 deg)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 18px monospace';
    for (let deg = -180; deg < 180; deg += 15) {
      const rad = ((deg - 90) * Math.PI) / 180;
      const major = deg % 45 === 0;
      const rIn = major ? 196 : 210;
      const rOut = 228;
      ctx.strokeStyle = deg === 0 ? '#10B981' : major ? '#94A3B8' : '#475569';
      ctx.lineWidth = major ? 3 : 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(rad) * rIn, cy + Math.sin(rad) * rIn);
      ctx.lineTo(cx + Math.cos(rad) * rOut, cy + Math.sin(rad) * rOut);
      ctx.stroke();

      if (deg % 90 === 0) {
        ctx.fillStyle = deg === 0 ? '#34D399' : '#CBD5E1';
        ctx.fillText(`${deg}°`, cx + Math.cos(rad) * 165, cy + Math.sin(rad) * 165);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);

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
    <group position={[0, 1.25, 0]}>
      {/* Encoder Backplate Rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.48, 1.48, 0.14, 48]} />
        <meshStandardMaterial color="#1E293B" roughness={0.45} metalness={0.4} />
      </mesh>

      {/* Protractor Degree Faceplate */}
      <mesh position={[0, 0, 0.075]}>
        <circleGeometry args={[1.38, 48]} />
        <meshStandardMaterial map={dialTexture} roughness={0.55} />
      </mesh>

      {/* Target Setpoint Ghost Needle */}
      <group rotation={[0, 0, -setpointRad]}>
        <mesh position={[0, 0.72, 0.1]}>
          <boxGeometry args={[0.05, 1.18, 0.025]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#F59E0B"
            emissiveIntensity={0.6}
          />
        </mesh>
        <mesh position={[0, 1.32, 0.1]}>
          <coneGeometry args={[0.075, 0.16, 12]} />
          <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Active Controlled Rotor Arm + Brass Payload Weight */}
      <group ref={armRef}>
        <mesh position={[0, 0.52, 0.16]} castShadow>
          <boxGeometry args={[0.15, 1.18, 0.07]} />
          <meshStandardMaterial color="#38BDF8" metalness={0.55} roughness={0.24} />
        </mesh>
        <mesh position={[0, 1.05, 0.16]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.11, 20]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.12, 24]} />
          <meshStandardMaterial color="#10B981" metalness={0.65} roughness={0.28} />
        </mesh>
      </group>

      {/* Pedestal Stand + Heavy Foot */}
      <mesh position={[0, -0.95, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 1.1, 0.35]} />
        <meshStandardMaterial color="#1E293B" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, -1.2, 0]} receiveShadow>
        <boxGeometry args={[1.4, 0.1, 0.85]} />
        <meshStandardMaterial color="#334155" metalness={0.45} roughness={0.45} />
      </mesh>

      <Html position={[0, -1.0, 0.45]} center zIndexRange={[10, 0]}>
        <div className="pointer-events-none whitespace-nowrap rounded-md border border-[#E6E8EC] bg-white/95 px-2 py-0.5 font-mono text-[11px] font-medium text-[#0A2540] shadow-xs">
          목표각 {setpointDeg}° · Kp={kp.toFixed(1)} Ki={ki.toFixed(1)} Kd={kd.toFixed(2)}
        </div>
      </Html>
    </group>
  );
}
