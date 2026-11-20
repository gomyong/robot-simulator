import { Html } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

export interface HotspotInfo {
  id: string;
  label: string;
  title: string;
  desc: string;
  pos: [number, number, number];
  focusTarget: [number, number, number];
  focusZoom: number;
  color: string;
}

/* -------------------------------------------------------------------------- */
/* Reusable 3D Jumper Wire (Bezier / CatmullRom TubeGeometry + Dupont Boots)  */
/* -------------------------------------------------------------------------- */
export function JumperWire3D({
  start,
  end,
  color = '#EF4444',
  arcHeight = 0.65,
  dashed = false,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  arcHeight?: number;
  dashed?: boolean;
}) {
  const geom = useMemo(() => {
    const p0 = new THREE.Vector3(...start);
    const p3 = new THREE.Vector3(...end);
    const mid1 = new THREE.Vector3().lerpVectors(p0, p3, 0.25);
    const mid2 = new THREE.Vector3().lerpVectors(p0, p3, 0.75);
    mid1.y += arcHeight;
    mid2.y += arcHeight;
    const curve = new THREE.CatmullRomCurve3([p0, mid1, mid2, p3]);
    return new THREE.TubeGeometry(curve, 24, 0.024, 8, false);
  }, [start, end, arcHeight]);

  return (
    <group>
      <mesh geometry={geom} castShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          transparent={dashed}
          opacity={dashed ? 0.35 : 1}
        />
      </mesh>
      {/* Black Dupont Connector Boots */}
      {[start, end].map((pt, i) => (
        <mesh key={i} position={[pt[0], pt[1] + 0.04, pt[2]]} castShadow>
          <boxGeometry args={[0.075, 0.12, 0.075]} />
          <meshStandardMaterial color="#111827" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* 3D MB-102 Breadboard with X-Ray Copper Clip Internals                      */
/* -------------------------------------------------------------------------- */
export function Breadboard3D({
  position = [0, 0, 0],
  xray = false,
  highlightShort = false,
}: {
  position?: [number, number, number];
  xray?: boolean;
  highlightShort?: boolean;
}) {
  const topTex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, 512, 256);

    // Top & Bottom Power Rails (+ Red / - Blue stripes)
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(22, 16);
    ctx.lineTo(490, 16);
    ctx.moveTo(22, 240);
    ctx.lineTo(490, 240);
    ctx.stroke();

    ctx.strokeStyle = '#2563EB';
    ctx.beginPath();
    ctx.moveTo(22, 42);
    ctx.lineTo(490, 42);
    ctx.moveTo(22, 214);
    ctx.lineTo(490, 214);
    ctx.stroke();

    // Central Trench
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(14, 120, 484, 16);

    // Pin Holes Grid
    ctx.fillStyle = '#1E293B';
    const railY = [24, 34, 222, 232];
    for (let c = 0; c < 30; c++) {
      const hx = 28 + c * 15.5;
      // Power rails (skip every 6th for split visual)
      if (c % 6 !== 5) {
        for (const ry of railY) {
          ctx.fillRect(hx - 2, ry - 2, 4, 4);
        }
      }
      // Main 5-hole columns top & bottom
      for (let r = 0; r < 5; r++) {
        ctx.fillRect(hx - 2, 58 + r * 12, 4, 4);
        ctx.fillRect(hx - 2, 146 + r * 12, 4, 4);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);

  return (
    <group position={position}>
      {/* Internal Copper Spring Clips (Exposed cleanly when X-Ray toggled) */}
      <group position={[0, 0.08, 0]}>
        {/* Horizontal Power Rail Strips */}
        {[-0.86, 0.86].map((rz, idx) => (
          <mesh key={idx} position={[0, 0, rz]}>
            <boxGeometry args={[3.9, 0.03, 0.05]} />
            <meshStandardMaterial color="#D97706" metalness={0.85} roughness={0.25} />
          </mesh>
        ))}
        {/* Vertical 5-Hole Column Strips */}
        {Array.from({ length: 18 }).map((_, i) => {
          const cx = -1.7 + i * 0.2;
          const isShortCol = highlightShort && i === 8;
          return (
            <group key={i} position={[cx, 0, 0]}>
              <mesh position={[0, 0, -0.36]}>
                <boxGeometry args={[0.055, 0.03, 0.52]} />
                <meshStandardMaterial
                  color={isShortCol ? '#EF4444' : '#F59E0B'}
                  emissive={isShortCol ? '#EF4444' : '#000000'}
                  emissiveIntensity={isShortCol ? 0.9 : 0}
                  metalness={0.8}
                  roughness={0.25}
                />
              </mesh>
              <mesh position={[0, 0, 0.36]}>
                <boxGeometry args={[0.055, 0.03, 0.52]} />
                <meshStandardMaterial
                  color={isShortCol ? '#EF4444' : '#F59E0B'}
                  emissive={isShortCol ? '#EF4444' : '#000000'}
                  emissiveIntensity={isShortCol ? 0.9 : 0}
                  metalness={0.8}
                  roughness={0.25}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Main White ABS Breadboard Body (Translucent or lifted when X-Ray) */}
      <mesh position={[0, xray ? 0.28 : 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.18, 2.1]} />
        <meshStandardMaterial
          map={topTex}
          transparent={xray}
          opacity={xray ? 0.48 : 1}
          roughness={0.55}
        />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* 3D Axial Resistor with Color Bands                                         */
/* -------------------------------------------------------------------------- */
export function Resistor3D({
  position = [0, 0.24, 0],
  rotationY = 0,
  ohms = 220,
}: {
  position?: [number, number, number];
  rotationY?: number;
  ohms?: number;
}) {
  const bands =
    ohms === 0
      ? ['#94A3B8', '#94A3B8', '#94A3B8']
      : ohms >= 10000
        ? ['#78350F', '#111827', '#F97316']
        : ['#EF4444', '#EF4444', '#78350F'];

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Metal Leads */}
      <mesh position={[0, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.014, 0.014, 0.66, 8]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.85} roughness={0.2} />
      </mesh>
      {[-0.32, 0.32].map((lx, i) => (
        <mesh key={i} position={[lx, -0.09, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 0.14, 8]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.85} roughness={0.2} />
        </mesh>
      ))}
      {/* Ceramic Tan Body */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.28, 16]} />
        <meshStandardMaterial color={ohms === 0 ? '#E2E8F0' : '#FDE68A'} roughness={0.45} />
      </mesh>
      {/* Color Bands */}
      {bands.map((col, i) => (
        <mesh key={i} position={[-0.08 + i * 0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.058, 0.058, 0.025, 16]} />
          <meshStandardMaterial color={col} />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* 3D 5mm Domed LED                                                           */
/* -------------------------------------------------------------------------- */
export function Led3D({
  position = [0, 0.2, 0],
  color = '#EF4444',
  intensity = 0.8,
  overcurrent = false,
}: {
  position?: [number, number, number];
  color?: string;
  intensity?: number;
  overcurrent?: boolean;
}) {
  const glowColor = overcurrent ? '#FCA5A5' : color;
  const emissiveStrength = overcurrent ? 3.2 : Math.max(0.05, intensity * 2.0);

  return (
    <group position={position}>
      {/* Legs */}
      <mesh position={[-0.04, 0.06, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.85} />
      </mesh>
      <mesh position={[0.04, 0.06, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.85} />
      </mesh>
      {/* Epoxy Skirt + Cylinder + Dome */}
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.125, 0.04, 20]} />
        <meshStandardMaterial color={color} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.095, 0.095, 0.14, 20]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={emissiveStrength}
          transparent
          opacity={0.88}
          roughness={0.18}
        />
      </mesh>
      <mesh position={[0, 0.31, 0]}>
        <sphereGeometry args={[0.095, 20, 14]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={emissiveStrength}
          transparent
          opacity={0.9}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* 3D HC-SR04 Ultrasonic Sensor Module                                        */
/* -------------------------------------------------------------------------- */
export function Hcsr04Module3D({
  position = [0, 0.45, 0],
  rotationY = 0,
}: {
  position?: [number, number, number];
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.15, 0.52, 0.08]} />
        <meshStandardMaterial color="#0284C7" roughness={0.4} metalness={0.2} />
      </mesh>
      {[-0.31, 0.31].map((x, idx) => (
        <group key={idx} position={[x, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.28, 24]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.85} roughness={0.22} />
          </mesh>
          <mesh position={[0, 0.145, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.02, 20]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
        </group>
      ))}
      {/* 4 Gold Pins below */}
      {[-0.18, -0.06, 0.06, 0.18].map((px, i) => (
        <mesh key={i} position={[px, -0.32, 0]}>
          <boxGeometry args={[0.03, 0.18, 0.03]} />
          <meshStandardMaterial color="#FACC15" metalness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* 3D 2S LiPo Battery Pack                                                    */
/* -------------------------------------------------------------------------- */
export function LipoBattery3D({
  position = [0, 0.2, 0],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.25, 0.36, 0.72]} />
        <meshStandardMaterial color="#1E293B" roughness={0.45} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.185, 0]}>
        <boxGeometry args={[0.92, 0.015, 0.46]} />
        <meshStandardMaterial color="#0EA5E9" roughness={0.5} />
      </mesh>
      {/* Yellow XT60 Plug End */}
      <mesh position={[0.7, 0, 0]} castShadow>
        <boxGeometry args={[0.18, 0.2, 0.28]} />
        <meshStandardMaterial color="#FACC15" roughness={0.35} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Interactive 3D Hotspot Chip Helper (No distanceFactor on Orthographic!)    */
/* -------------------------------------------------------------------------- */
export function HotspotChips3D({
  spots,
  activeId,
  onSelect,
}: {
  spots: HotspotInfo[];
  activeId: string | null;
  onSelect: (spot: HotspotInfo) => void;
}) {
  return (
    <>
      {spots.map((spot) => {
        const isActive = activeId === spot.id;
        return (
          <Html key={spot.id} position={spot.pos} center zIndexRange={[10, 0]}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(spot);
              }}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold shadow-sm transition ${
                isActive
                  ? 'border-[#0A2540] bg-[#0A2540] text-white'
                  : 'border-[#E6E8EC] bg-white/95 text-[#0A2540] hover:border-[#635BFF]'
              }`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: spot.color }}
              />
              <span>{spot.label}</span>
            </button>
          </Html>
        );
      })}
    </>
  );
}
