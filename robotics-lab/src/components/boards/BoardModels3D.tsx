import { Html, Line } from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { BoardId, BoardPartSpec, BoardSpec } from '../../types/lab';

interface ExplodablePartProps {
  part: BoardPartSpec;
  isLifted: boolean;
  isSelected: boolean;
  isAssembleTarget?: boolean;
  showLabels: boolean;
  onSelect: (part: BoardPartSpec) => void;
  children: ReactNode;
}

function ExplodablePart({
  part,
  isLifted,
  isSelected,
  isAssembleTarget = false,
  showLabels,
  onSelect,
  children,
}: ExplodablePartProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const bob = isAssembleTarget
      ? Math.sin(clock.getElapsedTime() * 3.2 + part.pos[0]) * 0.045
      : 0;
    const tx = isLifted ? part.explodeOffset[0] : 0;
    const ty = (isLifted ? part.explodeOffset[1] : 0) + bob;
    const tz = isLifted ? part.explodeOffset[2] : 0;

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      tx,
      0.14,
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      ty,
      0.14,
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      tz,
      0.14,
    );
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(part);
  };

  const guideEnd: [number, number, number] = [
    part.pos[0] + part.explodeOffset[0],
    part.pos[1] + part.explodeOffset[1],
    part.pos[2] + part.explodeOffset[2],
  ];

  return (
    <group>
      {isLifted && (
        <Line
          points={[part.pos, guideEnd]}
          color={isSelected || isAssembleTarget ? '#635BFF' : '#94A3B8'}
          lineWidth={1.2}
          dashed
          dashSize={0.08}
          gapSize={0.06}
        />
      )}

      <group
        ref={groupRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        {children}

        {/* Subtle interactive selection ring */}
        {(isSelected || hovered || isAssembleTarget) && (
          <mesh
            position={[part.pos[0], part.pos[1] + 0.02, part.pos[2]]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.24, 0.3, 28]} />
            <meshBasicMaterial
              color={
                isSelected
                  ? '#635BFF'
                  : isAssembleTarget
                    ? '#10B981'
                    : '#F59E0B'
              }
              side={THREE.DoubleSide}
              transparent
              opacity={0.85}
            />
          </mesh>
        )}

        {(showLabels || isSelected || hovered) && (
          <Html
            position={[
              part.pos[0],
              part.pos[1] + (part.explodeOffset[1] < 0 ? -0.28 : 0.34),
              part.pos[2],
            ]}
            center
            zIndexRange={[5, 0]}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(part);
              }}
              className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-sm transition ${
                isSelected
                  ? 'bg-[#635BFF] text-white ring-2 ring-white'
                  : isAssembleTarget
                    ? 'bg-emerald-600 text-white ring-2 ring-white'
                    : 'border border-[#E6E8EC] bg-white/95 text-[#0A2540] hover:border-[#635BFF] hover:text-[#635BFF]'
              }`}
            >
              {part.label}
            </button>
          </Html>
        )}
      </group>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Reusable Hardware 3D Primitives                                            */
/* -------------------------------------------------------------------------- */

function PinHeaderRow({
  count,
  position,
  female = false,
  axis = 'z',
  pitch = 0.17,
  pinDown = true,
  colorCodedPi = false,
}: {
  count: number;
  position: [number, number, number];
  female?: boolean;
  axis?: 'z' | 'x';
  pitch?: number;
  pinDown?: boolean;
  colorCodedPi?: boolean;
}) {
  const indices = useMemo(
    () => Array.from({ length: count }, (_, i) => i - (count - 1) / 2),
    [count],
  );
  const length = count * pitch + 0.04;

  return (
    <group position={position}>
      {/* Plastic Base Strip */}
      <mesh castShadow receiveShadow>
        <boxGeometry
          args={
            axis === 'z'
              ? [female ? 0.14 : 0.12, female ? 0.22 : 0.07, length]
              : [length, female ? 0.22 : 0.07, female ? 0.14 : 0.12]
          }
        />
        <meshStandardMaterial color="#111827" roughness={0.55} />
      </mesh>

      {/* Gold Pins / Female Sockets */}
      {indices.map((offset, idx) => {
        const px = axis === 'x' ? offset * pitch : 0;
        const pz = axis === 'z' ? offset * pitch : 0;
        const pinColor = colorCodedPi
          ? idx % 5 === 0
            ? '#EF4444'
            : idx % 4 === 1
              ? '#111827'
              : '#F59E0B'
          : '#F59E0B';
        return (
          <mesh
            key={idx}
            position={[
              px,
              female ? 0.112 : pinDown ? -0.09 : 0.11,
              pz,
            ]}
          >
            <boxGeometry
              args={
                female
                  ? [0.055, 0.015, 0.055]
                  : [0.036, 0.24, 0.036]
              }
            />
            <meshStandardMaterial
              color={female ? '#030712' : pinColor}
              metalness={female ? 0.1 : 0.88}
              roughness={female ? 0.8 : 0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function DualRowHeader({
  cols,
  position,
  axis = 'z',
  pitch = 0.15,
  pinUp = true,
  colorCoded = false,
}: {
  cols: number;
  position: [number, number, number];
  axis?: 'z' | 'x';
  pitch?: number;
  pinUp?: boolean;
  colorCoded?: boolean;
}) {
  const offsets = useMemo(
    () => Array.from({ length: cols }, (_, i) => i - (cols - 1) / 2),
    [cols],
  );
  const length = cols * pitch + 0.06;

  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry
          args={axis === 'z' ? [0.24, 0.07, length] : [length, 0.07, 0.24]}
        />
        <meshStandardMaterial color="#111827" roughness={0.6} />
      </mesh>
      {offsets.map((off, idx) =>
        [-0.06, 0.06].map((rowOff, rIdx) => {
          const px = axis === 'x' ? off * pitch : rowOff;
          const pz = axis === 'z' ? off * pitch : rowOff;
          let color = '#F59E0B';
          if (colorCoded) {
            if (rIdx === 1 && idx < 2) color = '#EF4444';
            else if (idx === 2 || idx === 4 || idx === 9) color = '#1F2937';
          }
          return (
            <mesh
              key={`${idx}-${rIdx}`}
              position={[px, pinUp ? 0.1 : -0.1, pz]}
            >
              <boxGeometry args={[0.032, 0.22, 0.032]} />
              <meshStandardMaterial
                color={color}
                metalness={0.85}
                roughness={0.22}
              />
            </mesh>
          );
        }),
      )}
    </group>
  );
}

function UsbConnector3D({
  type,
  position,
}: {
  type: 'usb_b' | 'micro' | 'mini' | 'usb_c';
  position: [number, number, number];
}) {
  if (type === 'usb_b') {
    return (
      <group position={position}>
        <mesh castShadow>
          <boxGeometry args={[0.68, 0.54, 0.82]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.85} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0, -0.415]}>
          <boxGeometry args={[0.46, 0.36, 0.02]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        <mesh position={[0, 0, -0.42]}>
          <boxGeometry args={[0.24, 0.14, 0.03]} />
          <meshStandardMaterial color="#F8FAFC" />
        </mesh>
      </group>
    );
  }
  const w = type === 'usb_c' ? 0.46 : type === 'mini' ? 0.38 : 0.42;
  const h = type === 'usb_c' ? 0.16 : 0.14;
  const d = type === 'mini' ? 0.46 : 0.34;
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.85} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0, d / 2 + 0.005]}>
        <boxGeometry args={[w * 0.72, h * 0.55, 0.015]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>
    </group>
  );
}

function BarrelJack3D({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.48, 0.72]} />
        <meshStandardMaterial color="#111827" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0, -0.365]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.03, 18]} />
        <meshStandardMaterial color="#030712" />
      </mesh>
      <mesh position={[0, 0, -0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.14, 12]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function TactileButton3D({
  position,
  capColor = '#E2E8F0',
  scale = 1,
}: {
  position: [number, number, number];
  capColor?: string;
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[0.24, 0.08, 0.24]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.06, 14]} />
        <meshStandardMaterial color={capColor} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Regulator3D({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.26, 0.08, 0.3]} />
        <meshStandardMaterial color="#0F172A" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.01, -0.17]}>
        <boxGeometry args={[0.18, 0.04, 0.08]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.85} roughness={0.22} />
      </mesh>
    </group>
  );
}

function Crystal3D({
  position,
  rotationY = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
}) {
  return (
    <mesh position={position} rotation={[0, rotationY, 0]} castShadow>
      <boxGeometry args={[0.22, 0.07, 0.42]} />
      <meshStandardMaterial color="#E2E8F0" metalness={0.88} roughness={0.18} />
    </mesh>
  );
}

function MeanderAntenna3D({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[-0.4, -0.2, 0, 0.2, 0.4].map((ax, i) => (
        <mesh key={i} position={[ax, 0, 0]}>
          <boxGeometry args={[0.055, 0.016, 0.34]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.22} />
        </mesh>
      ))}
      <mesh position={[0, 0, -0.15]}>
        <boxGeometry args={[0.86, 0.016, 0.055]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.22} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Procedural PCB Silkscreen Canvas Texture Generator (Top + Bottom!)         */
/* -------------------------------------------------------------------------- */
function useBoardTextures(board: BoardSpec) {
  return useMemo(() => {
    // 1. Top Silkscreen Texture
    const topCanvas = document.createElement('canvas');
    topCanvas.width = 512;
    topCanvas.height = 768;
    const tctx = topCanvas.getContext('2d')!;
    tctx.fillStyle = board.pcbColor;
    tctx.fillRect(0, 0, 512, 768);

    // Subtle trace lines
    tctx.strokeStyle = board.pcbAccent;
    tctx.lineWidth = 4;
    for (let i = 0; i < 12; i++) {
      const y = 130 + i * 48;
      tctx.beginPath();
      tctx.moveTo(28, y);
      tctx.lineTo(130, y);
      tctx.lineTo(160, y - 16);
      tctx.stroke();

      tctx.beginPath();
      tctx.moveTo(484, y);
      tctx.lineTo(382, y);
      tctx.lineTo(352, y - 16);
      tctx.stroke();
    }

    // Gold mounting holes at 4 corners
    const holes: [number, number][] = [
      [34, 34],
      [478, 34],
      [34, 734],
      [478, 734],
    ];
    for (const [hx, hy] of holes) {
      tctx.fillStyle = '#F59E0B';
      tctx.beginPath();
      tctx.arc(hx, hy, 14, 0, Math.PI * 2);
      tctx.fill();
      tctx.fillStyle = '#F8FAFC';
      tctx.beginPath();
      tctx.arc(hx, hy, 7, 0, Math.PI * 2);
      tctx.fill();
    }

    // Silkscreen title
    tctx.fillStyle = '#F8FAFC';
    tctx.font = 'bold 30px monospace';
    tctx.textAlign = 'center';
    tctx.fillText(board.shortName.toUpperCase(), 256, 445);
    tctx.font = 'bold 18px monospace';
    tctx.fillStyle = '#E2E8F0';
    tctx.fillText(`${board.maker} · ${board.logicVoltage} LOGIC`, 256, 476);

    // Edge Pin Labels
    tctx.font = 'bold 14px monospace';
    tctx.fillStyle = '#F8FAFC';
    tctx.textAlign = 'left';
    tctx.fillText('GND', 44, 620);
    tctx.fillText(board.logicVoltage, 44, 650);
    tctx.textAlign = 'right';
    tctx.fillText('GPIO', 468, 620);
    tctx.fillText('PWM/ADC', 468, 650);

    const topTex = new THREE.CanvasTexture(topCanvas);
    topTex.colorSpace = THREE.SRGBColorSpace;
    topTex.anisotropy = 4;

    // 2. Bottom Underside Texture (Solder pads + underside silkscreen)
    const botCanvas = document.createElement('canvas');
    botCanvas.width = 512;
    botCanvas.height = 768;
    const bctx = botCanvas.getContext('2d')!;
    bctx.fillStyle = board.pcbColor;
    bctx.fillRect(0, 0, 512, 768);

    // Copper ground plane hatching
    bctx.strokeStyle = board.pcbAccent;
    bctx.lineWidth = 2;
    for (let y = 40; y < 740; y += 28) {
      bctx.beginPath();
      bctx.moveTo(90, y);
      bctx.lineTo(422, y);
      bctx.stroke();
    }

    // Gold/silver solder pads along edges
    for (let i = 0; i < 15; i++) {
      const py = 120 + i * 38;
      for (const px of [44, 468]) {
        bctx.fillStyle = '#CBD5E1';
        bctx.beginPath();
        bctx.arc(px, py, 9, 0, Math.PI * 2);
        bctx.fill();
        bctx.fillStyle = '#1E293B';
        bctx.beginPath();
        bctx.arc(px, py, 3.5, 0, Math.PI * 2);
        bctx.fill();
      }
    }

    bctx.fillStyle = '#F8FAFC';
    bctx.font = 'bold 24px monospace';
    bctx.textAlign = 'center';
    bctx.fillText(`${board.name}`, 256, 360);
    bctx.font = '16px monospace';
    bctx.fillStyle = '#CBD5E1';
    bctx.fillText('BOTTOM SOLDER SIDE', 256, 396);
    bctx.fillText(`INPUT: ${board.inputVoltage}`, 256, 428);

    const botTex = new THREE.CanvasTexture(botCanvas);
    botTex.colorSpace = THREE.SRGBColorSpace;
    botTex.anisotropy = 4;

    return { topTex, botTex };
  }, [board]);
}

/* -------------------------------------------------------------------------- */
/* Individual Board 3D Assemblies                                             */
/* -------------------------------------------------------------------------- */

interface BoardMesh3DProps {
  board: BoardSpec;
  exploded: boolean;
  showLabels: boolean;
  selectedPartId: string | null;
  assembledPartIds?: string[];
  assembleMode?: boolean;
  onSelectPart: (part: BoardPartSpec) => void;
}

export function BoardMesh3D({
  board,
  exploded,
  showLabels,
  selectedPartId,
  assembledPartIds = [],
  assembleMode = false,
  onSelectPart,
}: BoardMesh3DProps) {
  const { topTex, botTex } = useBoardTextures(board);
  const [w, t, l] = board.pcbSize;

  const isPartLifted = (partId: string) => {
    if (assembleMode) {
      return !assembledPartIds.includes(partId);
    }
    return exploded;
  };

  const partMap = useMemo(() => {
    const m = new Map<string, BoardPartSpec>();
    for (const p of board.parts) m.set(p.id, p);
    return m;
  }, [board.parts]);

  const getPart = (id: string) => partMap.get(id)!;

  const pcbMaterials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: board.pcbAccent, roughness: 0.6 }),
      new THREE.MeshStandardMaterial({ color: board.pcbAccent, roughness: 0.6 }),
      new THREE.MeshStandardMaterial({ map: topTex, roughness: 0.55, metalness: 0.14 }),
      new THREE.MeshStandardMaterial({ map: botTex, roughness: 0.55, metalness: 0.14 }),
      new THREE.MeshStandardMaterial({ color: board.pcbAccent, roughness: 0.6 }),
      new THREE.MeshStandardMaterial({ color: board.pcbAccent, roughness: 0.6 }),
    ],
    [board.pcbAccent, topTex, botTex],
  );

  const renderBoardDetails = (id: BoardId) => {
    switch (id) {
      case 'uno': {
        const mcu = getPart('uno_mcu');
        const usb = getPart('uno_usb');
        const barrel = getPart('uno_barrel');
        const reg = getPart('uno_reg');
        const reset = getPart('uno_reset');
        const headers = getPart('uno_headers');

        return (
          <>
            {/* Empty DIP-28 IC Socket left on PCB when exploded */}
            <mesh position={[0.35, 0.08, 0.25]} castShadow>
              <boxGeometry args={[0.42, 0.06, 1.48]} />
              <meshStandardMaterial color="#1F2937" roughness={0.6} />
            </mesh>
            {/* 16MHz Crystal */}
            <Crystal3D position={[-0.35, 0.085, -0.35]} />
            {/* Power / Pin13 LEDs */}
            <mesh position={[-0.55, 0.07, 0.9]}>
              <boxGeometry args={[0.08, 0.04, 0.08]} />
              <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={1.3} />
            </mesh>
            <mesh position={[0.25, 0.07, -0.78]}>
              <boxGeometry args={[0.08, 0.04, 0.08]} />
              <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={1.2} />
            </mesh>

            <ExplodablePart
              part={mcu}
              isLifted={isPartLifted(mcu.id)}
              isSelected={selectedPartId === mcu.id}
              isAssembleTarget={assembleMode && isPartLifted(mcu.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <group position={mcu.pos}>
                <mesh castShadow>
                  <boxGeometry args={[0.34, 0.11, 1.38]} />
                  <meshStandardMaterial color="#0F172A" roughness={0.4} />
                </mesh>
                {Array.from({ length: 14 }, (_, i) => (i - 6.5) * 0.095).map((pz, idx) => (
                  <group key={idx}>
                    <mesh position={[-0.19, -0.04, pz]}>
                      <boxGeometry args={[0.06, 0.09, 0.03]} />
                      <meshStandardMaterial color="#CBD5E1" metalness={0.85} roughness={0.2} />
                    </mesh>
                    <mesh position={[0.19, -0.04, pz]}>
                      <boxGeometry args={[0.06, 0.09, 0.03]} />
                      <meshStandardMaterial color="#CBD5E1" metalness={0.85} roughness={0.2} />
                    </mesh>
                  </group>
                ))}
              </group>
            </ExplodablePart>

            <ExplodablePart
              part={usb}
              isLifted={isPartLifted(usb.id)}
              isSelected={selectedPartId === usb.id}
              isAssembleTarget={assembleMode && isPartLifted(usb.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <UsbConnector3D type="usb_b" position={usb.pos} />
              <mesh position={[-0.4, 0.08, -0.62]} rotation={[0, Math.PI / 4, 0]} castShadow>
                <boxGeometry args={[0.26, 0.05, 0.26]} />
                <meshStandardMaterial color="#0F172A" />
              </mesh>
            </ExplodablePart>

            <ExplodablePart
              part={barrel}
              isLifted={isPartLifted(barrel.id)}
              isSelected={selectedPartId === barrel.id}
              isAssembleTarget={assembleMode && isPartLifted(barrel.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <BarrelJack3D position={barrel.pos} />
            </ExplodablePart>

            <ExplodablePart
              part={reg}
              isLifted={isPartLifted(reg.id)}
              isSelected={selectedPartId === reg.id}
              isAssembleTarget={assembleMode && isPartLifted(reg.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <Regulator3D position={reg.pos} />
              {/* Electrolytic caps */}
              <mesh position={[0.35, 0.14, -0.82]} castShadow>
                <cylinderGeometry args={[0.1, 0.1, 0.22, 16]} />
                <meshStandardMaterial color="#CBD5E1" metalness={0.75} roughness={0.25} />
              </mesh>
            </ExplodablePart>

            <ExplodablePart
              part={reset}
              isLifted={isPartLifted(reset.id)}
              isSelected={selectedPartId === reset.id}
              isAssembleTarget={assembleMode && isPartLifted(reset.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <TactileButton3D position={reset.pos} capColor="#EF4444" />
            </ExplodablePart>

            <ExplodablePart
              part={headers}
              isLifted={isPartLifted(headers.id)}
              isSelected={selectedPartId === headers.id}
              isAssembleTarget={assembleMode && isPartLifted(headers.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <PinHeaderRow count={16} position={[-1.08, 0.16, 0.18]} female pitch={0.16} />
              <PinHeaderRow count={14} position={[1.08, 0.16, 0.28]} female pitch={0.16} />
            </ExplodablePart>
          </>
        );
      }

      case 'nano': {
        const mcu = getPart('nano_mcu');
        const usb = getPart('nano_usb');
        const reset = getPart('nano_reset');
        const icsp = getPart('nano_icsp');
        const pins = getPart('nano_pins');
        return (
          <>
            <ExplodablePart
              part={mcu}
              isLifted={isPartLifted(mcu.id)}
              isSelected={selectedPartId === mcu.id}
              isAssembleTarget={assembleMode && isPartLifted(mcu.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <mesh position={mcu.pos} rotation={[0, Math.PI / 4, 0]} castShadow>
                <boxGeometry args={[0.36, 0.055, 0.36]} />
                <meshStandardMaterial color="#0F172A" roughness={0.38} />
              </mesh>
            </ExplodablePart>

            <ExplodablePart
              part={usb}
              isLifted={isPartLifted(usb.id)}
              isSelected={selectedPartId === usb.id}
              isAssembleTarget={assembleMode && isPartLifted(usb.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <UsbConnector3D type="mini" position={usb.pos} />
            </ExplodablePart>

            <ExplodablePart
              part={reset}
              isLifted={isPartLifted(reset.id)}
              isSelected={selectedPartId === reset.id}
              isAssembleTarget={assembleMode && isPartLifted(reset.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <TactileButton3D position={reset.pos} capColor="#F8FAFC" scale={0.8} />
            </ExplodablePart>

            <ExplodablePart
              part={icsp}
              isLifted={isPartLifted(icsp.id)}
              isSelected={selectedPartId === icsp.id}
              isAssembleTarget={assembleMode && isPartLifted(icsp.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <DualRowHeader cols={3} position={icsp.pos} axis="x" pitch={0.14} />
            </ExplodablePart>

            <ExplodablePart
              part={pins}
              isLifted={isPartLifted(pins.id)}
              isSelected={selectedPartId === pins.id}
              isAssembleTarget={assembleMode && isPartLifted(pins.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <PinHeaderRow count={15} position={[-0.39, -0.06, 0.04]} pitch={0.135} />
              <PinHeaderRow count={15} position={[0.39, -0.06, 0.04]} pitch={0.135} />
            </ExplodablePart>
          </>
        );
      }

      case 'mega': {
        const mcu = getPart('mega_mcu');
        const usb = getPart('mega_usb');
        const barrel = getPart('mega_barrel');
        const rear = getPart('mega_rear_pins');
        const analog = getPart('mega_analog');
        return (
          <>
            <Crystal3D position={[-0.45, 0.085, -0.95]} />
            <Regulator3D position={[0.68, 0.085, -1.35]} />
            <TactileButton3D position={[-0.95, 0.09, -2.05]} capColor="#EF4444" />

            <ExplodablePart
              part={mcu}
              isLifted={isPartLifted(mcu.id)}
              isSelected={selectedPartId === mcu.id}
              isAssembleTarget={assembleMode && isPartLifted(mcu.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <mesh position={mcu.pos} castShadow>
                <boxGeometry args={[0.72, 0.07, 0.72]} />
                <meshStandardMaterial color="#0F172A" roughness={0.38} />
              </mesh>
            </ExplodablePart>

            <ExplodablePart
              part={usb}
              isLifted={isPartLifted(usb.id)}
              isSelected={selectedPartId === usb.id}
              isAssembleTarget={assembleMode && isPartLifted(usb.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <UsbConnector3D type="usb_b" position={usb.pos} />
            </ExplodablePart>

            <ExplodablePart
              part={barrel}
              isLifted={isPartLifted(barrel.id)}
              isSelected={selectedPartId === barrel.id}
              isAssembleTarget={assembleMode && isPartLifted(barrel.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <BarrelJack3D position={barrel.pos} />
            </ExplodablePart>

            <ExplodablePart
              part={rear}
              isLifted={isPartLifted(rear.id)}
              isSelected={selectedPartId === rear.id}
              isAssembleTarget={assembleMode && isPartLifted(rear.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <PinHeaderRow count={14} position={[-0.12, 0.16, 2.25]} female axis="x" pitch={0.145} />
              <PinHeaderRow count={14} position={[-0.12, 0.16, 2.08]} female axis="x" pitch={0.145} />
            </ExplodablePart>

            <ExplodablePart
              part={analog}
              isLifted={isPartLifted(analog.id)}
              isSelected={selectedPartId === analog.id}
              isAssembleTarget={assembleMode && isPartLifted(analog.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <PinHeaderRow count={20} position={[1.08, 0.16, 0.35]} female pitch={0.16} />
              <PinHeaderRow count={20} position={[-1.08, 0.16, 0.35]} female pitch={0.16} />
            </ExplodablePart>
          </>
        );
      }

      case 'esp32': {
        const wroom = getPart('esp32_wroom');
        const antenna = getPart('esp32_antenna');
        const usb = getPart('esp32_usb');
        const ldo = getPart('esp32_ldo');
        const buttons = getPart('esp32_buttons');
        const pins = getPart('esp32_pins');
        return (
          <>
            {/* Internal silicon dies revealed when WROOM shield lifts */}
            <group position={[0, 0.075, -0.58]}>
              <mesh position={[-0.18, 0, 0]} castShadow>
                <boxGeometry args={[0.38, 0.05, 0.38]} />
                <meshStandardMaterial color="#0F172A" roughness={0.35} />
              </mesh>
              <mesh position={[0.26, 0, 0.1]} castShadow>
                <boxGeometry args={[0.26, 0.04, 0.32]} />
                <meshStandardMaterial color="#334155" roughness={0.4} />
              </mesh>
            </group>

            <ExplodablePart
              part={wroom}
              isLifted={isPartLifted(wroom.id)}
              isSelected={selectedPartId === wroom.id}
              isAssembleTarget={assembleMode && isPartLifted(wroom.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <mesh position={wroom.pos} castShadow>
                <boxGeometry args={[1.18, 0.18, 1.32]} />
                <meshStandardMaterial color="#CBD5E1" metalness={0.72} roughness={0.25} />
              </mesh>
            </ExplodablePart>

            <ExplodablePart
              part={antenna}
              isLifted={isPartLifted(antenna.id)}
              isSelected={selectedPartId === antenna.id}
              isAssembleTarget={assembleMode && isPartLifted(antenna.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <MeanderAntenna3D position={antenna.pos} />
            </ExplodablePart>

            <ExplodablePart
              part={usb}
              isLifted={isPartLifted(usb.id)}
              isSelected={selectedPartId === usb.id}
              isAssembleTarget={assembleMode && isPartLifted(usb.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <UsbConnector3D type="usb_c" position={usb.pos} />
              <mesh position={[0, 0.08, 1.04]} castShadow>
                <boxGeometry args={[0.3, 0.05, 0.3]} />
                <meshStandardMaterial color="#0F172A" />
              </mesh>
            </ExplodablePart>

            <ExplodablePart
              part={ldo}
              isLifted={isPartLifted(ldo.id)}
              isSelected={selectedPartId === ldo.id}
              isAssembleTarget={assembleMode && isPartLifted(ldo.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <Regulator3D position={ldo.pos} />
            </ExplodablePart>

            <ExplodablePart
              part={buttons}
              isLifted={isPartLifted(buttons.id)}
              isSelected={selectedPartId === buttons.id}
              isAssembleTarget={assembleMode && isPartLifted(buttons.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <TactileButton3D position={[-0.58, 0.09, 1.4]} />
              <TactileButton3D position={[0.58, 0.09, 1.4]} />
            </ExplodablePart>

            <ExplodablePart
              part={pins}
              isLifted={isPartLifted(pins.id)}
              isSelected={selectedPartId === pins.id}
              isAssembleTarget={assembleMode && isPartLifted(pins.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <PinHeaderRow count={15} position={[-0.85, -0.06, 0.1]} pitch={0.185} />
              <PinHeaderRow count={15} position={[0.85, -0.06, 0.1]} pitch={0.185} />
            </ExplodablePart>
          </>
        );
      }

      case 'esp8266': {
        const mod = getPart('esp8266_mod');
        const ant = getPart('esp8266_ant');
        const usb = getPart('esp8266_usb');
        const ldo = getPart('esp8266_ldo');
        const btns = getPart('esp8266_btns');
        return (
          <>
            <PinHeaderRow count={15} position={[-0.92, -0.06, 0.05]} pitch={0.2} />
            <PinHeaderRow count={15} position={[0.92, -0.06, 0.05]} pitch={0.2} />

            <ExplodablePart
              part={mod}
              isLifted={isPartLifted(mod.id)}
              isSelected={selectedPartId === mod.id}
              isAssembleTarget={assembleMode && isPartLifted(mod.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <mesh position={mod.pos} castShadow>
                <boxGeometry args={[1.05, 0.16, 1.15]} />
                <meshStandardMaterial color="#CBD5E1" metalness={0.75} roughness={0.24} />
              </mesh>
            </ExplodablePart>

            <ExplodablePart
              part={ant}
              isLifted={isPartLifted(ant.id)}
              isSelected={selectedPartId === ant.id}
              isAssembleTarget={assembleMode && isPartLifted(ant.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <MeanderAntenna3D position={ant.pos} />
            </ExplodablePart>

            <ExplodablePart
              part={usb}
              isLifted={isPartLifted(usb.id)}
              isSelected={selectedPartId === usb.id}
              isAssembleTarget={assembleMode && isPartLifted(usb.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <UsbConnector3D type="micro" position={usb.pos} />
              <mesh position={[0, 0.08, 1.16]} castShadow>
                <boxGeometry args={[0.28, 0.05, 0.28]} />
                <meshStandardMaterial color="#0F172A" />
              </mesh>
            </ExplodablePart>

            <ExplodablePart
              part={ldo}
              isLifted={isPartLifted(ldo.id)}
              isSelected={selectedPartId === ldo.id}
              isAssembleTarget={assembleMode && isPartLifted(ldo.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <Regulator3D position={ldo.pos} />
            </ExplodablePart>

            <ExplodablePart
              part={btns}
              isLifted={isPartLifted(btns.id)}
              isSelected={selectedPartId === btns.id}
              isAssembleTarget={assembleMode && isPartLifted(btns.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <TactileButton3D position={[-0.58, 0.09, 1.54]} />
              <TactileButton3D position={[0.58, 0.09, 1.54]} />
            </ExplodablePart>
          </>
        );
      }

      case 'pico': {
        const rp = getPart('pico_rp2040');
        const bootsel = getPart('pico_bootsel');
        const usb = getPart('pico_usb');
        const flash = getPart('pico_flash');
        const pins = getPart('pico_pins');
        return (
          <>
            {/* 3-pin SWD debug header at bottom */}
            <PinHeaderRow count={3} position={[0, 0.08, 1.42]} axis="x" pitch={0.16} pinDown={false} />
            {/* Onboard Green LED GP25 */}
            <mesh position={[0.35, 0.07, -1.18]}>
              <boxGeometry args={[0.08, 0.04, 0.08]} />
              <meshStandardMaterial color="#22C55E" emissive="#22C55E" emissiveIntensity={1.5} />
            </mesh>

            <ExplodablePart
              part={rp}
              isLifted={isPartLifted(rp.id)}
              isSelected={selectedPartId === rp.id}
              isAssembleTarget={assembleMode && isPartLifted(rp.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <mesh position={rp.pos} castShadow>
                <boxGeometry args={[0.48, 0.06, 0.48]} />
                <meshStandardMaterial color="#0F172A" roughness={0.35} />
              </mesh>
            </ExplodablePart>

            <ExplodablePart
              part={bootsel}
              isLifted={isPartLifted(bootsel.id)}
              isSelected={selectedPartId === bootsel.id}
              isAssembleTarget={assembleMode && isPartLifted(bootsel.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <TactileButton3D position={bootsel.pos} capColor="#FFFFFF" />
            </ExplodablePart>

            <ExplodablePart
              part={usb}
              isLifted={isPartLifted(usb.id)}
              isSelected={selectedPartId === usb.id}
              isAssembleTarget={assembleMode && isPartLifted(usb.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <UsbConnector3D type="micro" position={usb.pos} />
            </ExplodablePart>

            <ExplodablePart
              part={flash}
              isLifted={isPartLifted(flash.id)}
              isSelected={selectedPartId === flash.id}
              isAssembleTarget={assembleMode && isPartLifted(flash.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <mesh position={flash.pos} castShadow>
                <boxGeometry args={[0.22, 0.05, 0.26]} />
                <meshStandardMaterial color="#0F172A" />
              </mesh>
              <mesh position={[0, 0.075, 0.72]} castShadow>
                <boxGeometry args={[0.32, 0.07, 0.22]} />
                <meshStandardMaterial color="#334155" />
              </mesh>
            </ExplodablePart>

            <ExplodablePart
              part={pins}
              isLifted={isPartLifted(pins.id)}
              isSelected={selectedPartId === pins.id}
              isAssembleTarget={assembleMode && isPartLifted(pins.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <PinHeaderRow count={20} position={[-0.66, -0.06, 0.02]} pitch={0.15} />
              <PinHeaderRow count={20} position={[0.66, -0.06, 0.02]} pitch={0.15} />
            </ExplodablePart>
          </>
        );
      }

      case 'stm32': {
        const mcu = getPart('stm_mcu');
        const boot = getPart('stm_boot');
        const swd = getPart('stm_swd');
        const crystals = getPart('stm_crystals');
        const pins = getPart('stm_pins');
        return (
          <>
            <UsbConnector3D type="micro" position={[0, 0.14, -1.58]} />
            <TactileButton3D position={[0, 0.09, 0.72]} capColor="#F8FAFC" scale={0.85} />

            <ExplodablePart
              part={mcu}
              isLifted={isPartLifted(mcu.id)}
              isSelected={selectedPartId === mcu.id}
              isAssembleTarget={assembleMode && isPartLifted(mcu.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <mesh position={mcu.pos} rotation={[0, Math.PI / 4, 0]} castShadow>
                <boxGeometry args={[0.48, 0.06, 0.48]} />
                <meshStandardMaterial color="#0F172A" roughness={0.35} />
              </mesh>
            </ExplodablePart>

            <ExplodablePart
              part={boot}
              isLifted={isPartLifted(boot.id)}
              isSelected={selectedPartId === boot.id}
              isAssembleTarget={assembleMode && isPartLifted(boot.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <group position={boot.pos}>
                <mesh position={[0, -0.04, 0]} castShadow>
                  <boxGeometry args={[0.42, 0.14, 0.28]} />
                  <meshStandardMaterial color="#FACC15" roughness={0.4} />
                </mesh>
              </group>
            </ExplodablePart>

            <ExplodablePart
              part={swd}
              isLifted={isPartLifted(swd.id)}
              isSelected={selectedPartId === swd.id}
              isAssembleTarget={assembleMode && isPartLifted(swd.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <PinHeaderRow count={4} position={swd.pos} axis="x" pitch={0.16} pinDown={false} />
            </ExplodablePart>

            <ExplodablePart
              part={crystals}
              isLifted={isPartLifted(crystals.id)}
              isSelected={selectedPartId === crystals.id}
              isAssembleTarget={assembleMode && isPartLifted(crystals.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <Crystal3D position={crystals.pos} rotationY={Math.PI / 2} />
            </ExplodablePart>

            <ExplodablePart
              part={pins}
              isLifted={isPartLifted(pins.id)}
              isSelected={selectedPartId === pins.id}
              isAssembleTarget={assembleMode && isPartLifted(pins.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <PinHeaderRow count={20} position={[-0.68, -0.06, 0.02]} pitch={0.155} />
              <PinHeaderRow count={20} position={[0.68, -0.06, 0.02]} pitch={0.155} />
            </ExplodablePart>
          </>
        );
      }

      case 'pi4': {
        const soc = getPart('pi4_soc');
        const ports = getPart('pi4_ports');
        const usbc = getPart('pi4_usbc');
        const gpio = getPart('pi4_gpio');
        const csi = getPart('pi4_csi');
        const sd = getPart('pi4_sd');
        return (
          <>
            {/* DSI Display Ribbon slot */}
            <mesh position={[0, 0.11, -1.55]} castShadow>
              <boxGeometry args={[1.05, 0.12, 0.16]} />
              <meshStandardMaterial color="#F8FAFC" />
            </mesh>

            <ExplodablePart
              part={soc}
              isLifted={isPartLifted(soc.id)}
              isSelected={selectedPartId === soc.id}
              isAssembleTarget={assembleMode && isPartLifted(soc.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              {/* Broadcom SoC Silver Heatspreader */}
              <mesh position={soc.pos} castShadow>
                <boxGeometry args={[0.72, 0.09, 0.72]} />
                <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.22} />
              </mesh>
              {/* LPDDR4 RAM next to SoC */}
              <mesh position={[0.45, 0.1, -0.35]} castShadow>
                <boxGeometry args={[0.42, 0.06, 0.54]} />
                <meshStandardMaterial color="#0F172A" />
              </mesh>
            </ExplodablePart>

            <ExplodablePart
              part={ports}
              isLifted={isPartLifted(ports.id)}
              isSelected={selectedPartId === ports.id}
              isAssembleTarget={assembleMode && isPartLifted(ports.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <group position={ports.pos}>
                {/* Gigabit Ethernet RJ45 */}
                <mesh position={[-0.78, 0, 0]} castShadow>
                  <boxGeometry args={[0.78, 0.68, 0.96]} />
                  <meshStandardMaterial color="#CBD5E1" metalness={0.82} roughness={0.24} />
                </mesh>
                {/* Dual USB 3.0 Stack (Blue insert) */}
                <mesh position={[0.05, 0.04, 0]} castShadow>
                  <boxGeometry args={[0.66, 0.76, 0.88]} />
                  <meshStandardMaterial color="#CBD5E1" metalness={0.82} roughness={0.24} />
                </mesh>
                <mesh position={[0.05, 0.14, 0.445]}>
                  <boxGeometry args={[0.5, 0.18, 0.02]} />
                  <meshStandardMaterial color="#2563EB" />
                </mesh>
                {/* Dual USB 2.0 Stack */}
                <mesh position={[0.82, 0.04, 0]} castShadow>
                  <boxGeometry args={[0.66, 0.76, 0.88]} />
                  <meshStandardMaterial color="#CBD5E1" metalness={0.82} roughness={0.24} />
                </mesh>
              </group>
            </ExplodablePart>

            <ExplodablePart
              part={usbc}
              isLifted={isPartLifted(usbc.id)}
              isSelected={selectedPartId === usbc.id}
              isAssembleTarget={assembleMode && isPartLifted(usbc.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <group position={usbc.pos} rotation={[0, Math.PI / 2, 0]}>
                <UsbConnector3D type="usb_c" position={[0.4, 0, 0]} />
                <UsbConnector3D type="micro" position={[-0.2, 0, 0]} />
                <UsbConnector3D type="micro" position={[-0.75, 0, 0]} />
              </group>
            </ExplodablePart>

            <ExplodablePart
              part={gpio}
              isLifted={isPartLifted(gpio.id)}
              isSelected={selectedPartId === gpio.id}
              isAssembleTarget={assembleMode && isPartLifted(gpio.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <DualRowHeader cols={20} position={gpio.pos} pitch={0.14} colorCoded />
            </ExplodablePart>

            <ExplodablePart
              part={csi}
              isLifted={isPartLifted(csi.id)}
              isSelected={selectedPartId === csi.id}
              isAssembleTarget={assembleMode && isPartLifted(csi.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <mesh position={csi.pos} castShadow>
                <boxGeometry args={[1.05, 0.14, 0.16]} />
                <meshStandardMaterial color="#F8FAFC" />
              </mesh>
            </ExplodablePart>

            <ExplodablePart
              part={sd}
              isLifted={isPartLifted(sd.id)}
              isSelected={selectedPartId === sd.id}
              isAssembleTarget={assembleMode && isPartLifted(sd.id)}
              showLabels={showLabels}
              onSelect={onSelectPart}
            >
              <group position={sd.pos}>
                <mesh castShadow>
                  <boxGeometry args={[0.72, 0.08, 0.62]} />
                  <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.25} />
                </mesh>
                <mesh position={[0, -0.01, -0.26]}>
                  <boxGeometry args={[0.56, 0.04, 0.25]} />
                  <meshStandardMaterial color="#0F172A" />
                </mesh>
              </group>
            </ExplodablePart>
          </>
        );
      }
    }
  };

  return (
    <group position={[0, 0.35, 0]}>
      {/* Main PCB Plate with Top & Bottom Silkscreens */}
      <mesh castShadow receiveShadow material={pcbMaterials}>
        <boxGeometry args={[w, t, l]} />
      </mesh>
      {renderBoardDetails(board.id)}
    </group>
  );
}
