import { Html } from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ESP32_PINS, PIN_CATEGORY_META } from '../../../data/esp32Pins';
import { Esp32PinSpec } from '../../../types/lab';

interface Esp32Board3DProps {
  exploded: number; // 0..1
  wifiActive: boolean;
  selectedPinId: string | null;
  onSelectPin: (pinId: string) => void;
}

export function Esp32Board3D({
  exploded,
  wifiActive,
  selectedPinId,
  onSelectPin,
}: Esp32Board3DProps) {
  const shieldRef = useRef<THREE.Group>(null);
  const pcbRef = useRef<THREE.Group>(null);
  const leftHeaderRef = useRef<THREE.Group>(null);
  const rightHeaderRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  const leftPins = useMemo(
    () => ESP32_PINS.filter((p) => p.side === 'left').sort((a, b) => a.headerIndex - b.headerIndex),
    [],
  );
  const rightPins = useMemo(
    () => ESP32_PINS.filter((p) => p.side === 'right').sort((a, b) => a.headerIndex - b.headerIndex),
    [],
  );

  const selectedPin = useMemo(
    () => ESP32_PINS.find((p) => p.id === selectedPinId) ?? null,
    [selectedPinId],
  );

  useFrame(({ clock }) => {
    const t = exploded;
    if (shieldRef.current) {
      shieldRef.current.position.y = THREE.MathUtils.lerp(
        shieldRef.current.position.y,
        0.16 + t * 0.85,
        0.14,
      );
    }
    if (pcbRef.current) {
      pcbRef.current.position.y = THREE.MathUtils.lerp(
        pcbRef.current.position.y,
        0.04 + t * 0.15,
        0.14,
      );
    }
    if (leftHeaderRef.current) {
      leftHeaderRef.current.position.x = THREE.MathUtils.lerp(
        leftHeaderRef.current.position.x,
        -0.98 - t * 0.48,
        0.14,
      );
      leftHeaderRef.current.position.y = THREE.MathUtils.lerp(
        leftHeaderRef.current.position.y,
        -0.06 - t * 0.25,
        0.14,
      );
    }
    if (rightHeaderRef.current) {
      rightHeaderRef.current.position.x = THREE.MathUtils.lerp(
        rightHeaderRef.current.position.x,
        0.98 + t * 0.48,
        0.14,
      );
      rightHeaderRef.current.position.y = THREE.MathUtils.lerp(
        rightHeaderRef.current.position.y,
        -0.06 - t * 0.25,
        0.14,
      );
    }
    if (pulseRef.current) {
      const s = 1 + 0.12 * Math.sin(clock.getElapsedTime() * 4.5);
      pulseRef.current.scale.set(s, s, 1);
    }
  });

  const handlePinTap = (e: ThreeEvent<MouseEvent>, pin: Esp32PinSpec) => {
    e.stopPropagation();
    onSelectPin(pin.id);
  };

  const renderPinRow = (pins: Esp32PinSpec[], sideSign: -1 | 1) =>
    pins.map((pin) => {
      const zPos = -1.75 + pin.headerIndex * 0.25;
      const isSelected = pin.id === selectedPinId;
      const isAdc2Conflict = wifiActive && pin.adcChannel === 'ADC2';
      const meta = PIN_CATEGORY_META[pin.category];
      const pinColor = isAdc2Conflict ? '#F43F5E' : meta.colorHex;

      return (
        <group key={pin.id} position={[0, 0, zPos]}>
          {/* Plastic shroud block */}
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.18, 0.12, 0.19]} />
            <meshStandardMaterial color="#1E293B" roughness={0.6} metalness={0.1} />
          </mesh>

          {/* Gold-plated header pin (tappable target) */}
          <mesh
            position={[0, -0.1, 0]}
            castShadow
            onClick={(e) => handlePinTap(e, pin)}
          >
            <boxGeometry args={[0.06, 0.36, 0.06]} />
            <meshStandardMaterial
              color={isSelected ? '#FFFFFF' : '#EAB308'}
              emissive={isSelected ? '#38BDF8' : isAdc2Conflict ? '#F43F5E' : '#000000'}
              emissiveIntensity={isSelected ? 0.9 : isAdc2Conflict ? 0.45 : 0}
              metalness={0.85}
              roughness={0.22}
            />
          </mesh>

          {/* Color-coded safety collar dot on PCB edge */}
          <mesh
            position={[sideSign * 0.02, 0.1, 0]}
            onClick={(e) => handlePinTap(e, pin)}
          >
            <cylinderGeometry args={[0.055, 0.055, 0.03, 16]} />
            <meshStandardMaterial
              color={pinColor}
              emissive={pinColor}
              emissiveIntensity={isSelected ? 1.2 : 0.45}
              roughness={0.35}
            />
          </mesh>

          {/* Selection highlight ring */}
          {isSelected && (
            <mesh ref={pulseRef} position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.085, 0.125, 24]} />
              <meshBasicMaterial color="#38BDF8" side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>
      );
    });

  return (
    <group position={[0, 0.55, 0]}>
      {/* Main Matte Black PCB */}
      <group ref={pcbRef}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.3, 0.1, 4.1]} />
          <meshStandardMaterial color="#111827" roughness={0.48} metalness={0.22} />
        </mesh>

        {/* Gold mounting holes at 4 corners */}
        {[
          [-0.98, 0.055, -1.88],
          [0.98, 0.055, -1.88],
          [-0.98, 0.055, 1.88],
          [0.98, 0.055, 1.88],
        ].map((pos, idx) => (
          <mesh key={idx} position={pos as [number, number, number]}>
            <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.25} />
          </mesh>
        ))}

        {/* CP2102 USB-UART Bridge IC */}
        <mesh position={[0, 0.08, 1.05]} castShadow>
          <boxGeometry args={[0.42, 0.06, 0.42]} />
          <meshStandardMaterial color="#1E293B" roughness={0.35} metalness={0.3} />
        </mesh>

        {/* AMS1117 3.3V Voltage Regulator */}
        <mesh position={[-0.45, 0.08, 1.4]} castShadow>
          <boxGeometry args={[0.32, 0.07, 0.46]} />
          <meshStandardMaterial color="#0F172A" roughness={0.4} metalness={0.4} />
        </mesh>

        {/* Micro-USB Port */}
        <mesh position={[0, 0.14, 1.92]} castShadow>
          <boxGeometry args={[0.62, 0.18, 0.44]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.88} roughness={0.22} />
        </mesh>

        {/* EN (Reset) & BOOT Tactile Buttons */}
        <group position={[-0.55, 0.09, 1.72]}>
          <mesh castShadow>
            <boxGeometry args={[0.26, 0.07, 0.2]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.05, 12]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>

        <group position={[0.55, 0.09, 1.72]}>
          <mesh castShadow>
            <boxGeometry args={[0.26, 0.07, 0.2]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.05, 12]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>

        {/* Power LED + GPIO 2 Blue Status LED */}
        <mesh position={[-0.36, 0.07, 1.66]}>
          <boxGeometry args={[0.08, 0.04, 0.12]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#EF4444"
            emissiveIntensity={1.4}
          />
        </mesh>
        <mesh position={[0.36, 0.07, 1.66]}>
          <boxGeometry args={[0.08, 0.04, 0.12]} />
          <meshStandardMaterial
            color="#38BDF8"
            emissive="#38BDF8"
            emissiveIntensity={wifiActive ? 1.8 : 0.4}
          />
        </mesh>
      </group>

      {/* ESP-WROOM-32 Module + RF Shield Layer (separates upward in Exploded View) */}
      <group ref={shieldRef} position={[0, 0.16, -0.78]}>
        {/* Module sub-PCB with PCB antenna */}
        <mesh castShadow>
          <boxGeometry args={[1.48, 0.05, 2.05]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} metalness={0.2} />
        </mesh>

        {/* Gold PCB Meander Antenna Trace */}
        <mesh position={[0, 0.032, -0.8]}>
          <boxGeometry args={[1.1, 0.015, 0.34]} />
          <meshStandardMaterial color="#D97706" metalness={0.8} roughness={0.25} />
        </mesh>

        {/* Metallic RF Shield Can */}
        <mesh position={[0, 0.12, 0.22]} castShadow>
          <boxGeometry args={[1.38, 0.18, 1.46]} />
          <meshStandardMaterial
            color="#94A3B8"
            metalness={0.86}
            roughness={0.24}
          />
        </mesh>

        {/* Wi-Fi active halo indicator */}
        {wifiActive && (
          <mesh position={[0, 0.24, -0.75]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.28, 0.36, 32]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.75} side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>

      {/* Left & Right 15-pin Headers */}
      <group ref={leftHeaderRef} position={[-0.98, -0.06, 0]}>
        {renderPinRow(leftPins, -1)}
      </group>
      <group ref={rightHeaderRef} position={[0.98, -0.06, 0]}>
        {renderPinRow(rightPins, 1)}
      </group>

      {/* Floating 3D Callout Badge for Selected Pin */}
      {selectedPin && selectedPin.side !== 'internal' && (
        <Html
          position={[
            (selectedPin.side === 'left' ? -1 : 1) * (1.15 + exploded * 0.48),
            0.42,
            -1.75 + selectedPin.headerIndex * 0.25,
          ]}
          center
          distanceFactor={8}
        >
          <div className="pointer-events-none whitespace-nowrap rounded-lg border border-sky-400/60 bg-slate-950/90 px-2.5 py-1 text-xs font-medium text-slate-100 shadow-lg backdrop-blur-md">
            <span className="font-mono font-bold text-sky-300">{selectedPin.label}</span>
            <span className="ml-1.5 text-[11px] text-slate-400">
              {selectedPin.categoryLabel}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}
