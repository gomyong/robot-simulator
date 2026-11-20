import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

export interface Esp32Hotspot {
  id: 'wroom' | 'antenna' | 'cp2102' | 'ams1117' | 'buttons' | 'led' | 'pins';
  label: string;
  title: string;
  desc: string;
  pos: [number, number, number];
  focusTarget: [number, number, number];
  focusZoom: number;
  color: string;
}

export const ESP32_HOTSPOTS: Esp32Hotspot[] = [
  {
    id: 'wroom',
    label: 'ESP-WROOM-32',
    title: 'ESP-WROOM-32 모듈 (Xtensa 듀얼코어)',
    desc: '240MHz 듀얼코어 CPU(Core 0 Wi-Fi/BT · Core 1 앱 제어)와 4MB SPI Flash가 금속 EMI 쉴드 안에 통합되어 있습니다.',
    pos: [0, 0.34, -0.55],
    focusTarget: [0, 0.3, -0.45],
    focusZoom: 120,
    color: '#F59E0B',
  },
  {
    id: 'antenna',
    label: '2.4GHz 안테나',
    title: 'PCB 미앤더 2.4GHz 안테나',
    desc: 'Wi-Fi와 BLE 신호를 송수신합니다. 금속 프레임이나 배터리 바로 옆에 붙이면 전파 감도가 급감합니다.',
    pos: [0, 0.22, -1.62],
    focusTarget: [0, 0.2, -1.5],
    focusZoom: 145,
    color: '#38BDF8',
  },
  {
    id: 'cp2102',
    label: 'USB-C · CP2102',
    title: 'USB-C 포트 & CP2102 USB-UART 브리지',
    desc: 'PC와 시리얼(115200bps) 통신을 중계하며 DTR/RTS 신호로 EN과 GPIO0을 자동 조작해 펌웨어를 업로드합니다.',
    pos: [0, 0.25, 1.58],
    focusTarget: [0, 0.2, 1.35],
    focusZoom: 135,
    color: '#635BFF',
  },
  {
    id: 'ams1117',
    label: 'AMS1117 3.3V',
    title: 'AMS1117-3.3 선형 LDO 레귤레이터',
    desc: 'USB 5V를 ESP32 전용 3.3V(최대 ~800mA)로 강압합니다. 서보나 모터를 3V3 핀에 물리면 과열로 리셋됩니다.',
    pos: [-0.46, 0.22, 0.72],
    focusTarget: [-0.35, 0.2, 0.7],
    focusZoom: 145,
    color: '#EF4444',
  },
  {
    id: 'buttons',
    label: 'BOOT · GPIO 0',
    title: 'EN(리셋) & BOOT(GPIO 0) 버튼',
    desc: '리셋 순간 BOOT(GPIO 0)이 LOW이면 UART 펌웨어 업로드 모드로 진입합니다.',
    pos: [0.58, 0.22, 1.42],
    focusTarget: [0.4, 0.2, 1.35],
    focusZoom: 150,
    color: '#10B981',
  },
  {
    id: 'led',
    label: '파란 LED · GPIO 2',
    title: '내장 상태 LED (GPIO 2)',
    desc: 'ESP32 보드에 내장된 파란색 LED로, GPIO 2(OUTPUT)에 연결되어 코드 실행 시 깜빡임을 바로 테스트할 수 있습니다.',
    pos: [0.36, 0.22, 0.88],
    focusTarget: [0.3, 0.2, 0.85],
    focusZoom: 155,
    color: '#3B82F6',
  },
  {
    id: 'pins',
    label: '30-Pin GPIO 헤더',
    title: '양측 15×2 금도금 핀 헤더 (3.3V 전용)',
    desc: 'GPIO 6~11은 Flash 직결 금지 핀, 34~39는 입력 전용, 0/2/12/15는 부팅 스트래핑 핀이므로 규율을 지켜야 합니다.',
    pos: [-0.95, 0.24, 0.05],
    focusTarget: [-0.6, 0.2, 0.0],
    focusZoom: 115,
    color: '#EC4899',
  },
];

interface Esp32Hardware3DProps {
  exploded: boolean;
  wifiActive: boolean;
  sketchRunning: boolean;
  activeHotspotId: string | null;
  onSelectHotspot: (spot: Esp32Hotspot) => void;
  onSelectPin?: (pinId: string) => void;
}

export function Esp32Hardware3D({
  exploded,
  wifiActive,
  sketchRunning,
  activeHotspotId,
  onSelectHotspot,
  onSelectPin,
}: Esp32Hardware3DProps) {
  const shieldRef = useRef<THREE.Group>(null);
  const [blinkOn, setBlinkOn] = useState(false);

  // Blink blue onboard LED when sketchRunning is active
  useEffect(() => {
    if (!sketchRunning) {
      setBlinkOn(false);
      return;
    }
    setBlinkOn(true);
    const id = window.setInterval(() => setBlinkOn((v) => !v), 500);
    return () => window.clearInterval(id);
  }, [sketchRunning]);

  // Smoothly float WROOM shield upward in exploded (X-Ray) mode
  useFrame(() => {
    if (!shieldRef.current) return;
    const targetY = exploded ? 0.65 : 0.14;
    shieldRef.current.position.y = THREE.MathUtils.lerp(
      shieldRef.current.position.y,
      targetY,
      0.12,
    );
  });

  // Procedural Canvas Textures (PCB Silkscreen + WROOM Shield Label)
  const { pcbTex, shieldTex } = useMemo(() => {
    const pcbCanvas = document.createElement('canvas');
    pcbCanvas.width = 512;
    pcbCanvas.height = 1024;
    const ctx = pcbCanvas.getContext('2d')!;
    ctx.fillStyle = '#1D2029';
    ctx.fillRect(0, 0, 512, 1024);

    // Subtle copper trace lines
    ctx.strokeStyle = '#2B3140';
    ctx.lineWidth = 3;
    for (let i = 0; i < 15; i++) {
      const py = 260 + i * 44;
      ctx.beginPath();
      ctx.moveTo(46, py);
      ctx.lineTo(145, py);
      ctx.lineTo(175, py - 14);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(466, py);
      ctx.lineTo(367, py);
      ctx.lineTo(337, py - 14);
      ctx.stroke();
    }

    // Silkscreen Board Text
    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ESP32 DEVKIT V1', 256, 610);
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('30-PIN · 3.3V LOGIC', 256, 638);
    ctx.fillText('EN', 110, 910);
    ctx.fillText('BOOT', 402, 910);
    ctx.fillStyle = '#F59E0B';
    ctx.fillText('PWR', 110, 682);
    ctx.fillStyle = '#60A5FA';
    ctx.fillText('D2', 368, 745);

    const pTex = new THREE.CanvasTexture(pcbCanvas);
    pTex.colorSpace = THREE.SRGBColorSpace;
    pTex.anisotropy = 4;

    // Metal Shield Canvas Texture
    const shCanvas = document.createElement('canvas');
    shCanvas.width = 512;
    shCanvas.height = 512;
    const sctx = shCanvas.getContext('2d')!;
    sctx.fillStyle = '#CBD5E1';
    sctx.fillRect(0, 0, 512, 512);
    sctx.strokeStyle = '#94A3B8';
    sctx.lineWidth = 10;
    sctx.strokeRect(14, 14, 484, 484);

    sctx.fillStyle = '#1E293B';
    sctx.font = 'bold 42px sans-serif';
    sctx.textAlign = 'center';
    sctx.fillText('ESP-WROOM-32', 256, 175);
    sctx.font = 'bold 26px monospace';
    sctx.fillStyle = '#475569';
    sctx.fillText('Wi-Fi + BLE MCU', 256, 225);
    sctx.font = '20px monospace';
    sctx.fillText('240MHz · 4MB FLASH', 256, 265);
    sctx.fillText('FCC ID: 2AC7Z', 256, 360);

    const sTex = new THREE.CanvasTexture(shCanvas);
    sTex.colorSpace = THREE.SRGBColorSpace;
    sTex.anisotropy = 4;

    return { pcbTex: pTex, shieldTex: sTex };
  }, []);

  const leftPins = [
    'EN', 'VP', 'VN', 'D34', 'D35', 'D32', 'D33', 'D25',
    'D26', 'D27', 'D14', 'D12', 'GND', 'D13', 'VIN',
  ];
  const rightPins = [
    'D23', 'D22', 'TX0', 'RX0', 'D21', 'D19', 'D18', 'D5',
    'TX2', 'RX2', 'D4', 'D2', 'D15', 'GND', '3V3',
  ];

  return (
    <group position={[0, 0.45, 0]}>
      {/* Main Matte Black PCB */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.96, 0.1, 3.62]} />
        <meshStandardMaterial map={pcbTex} roughness={0.62} metalness={0.18} />
      </mesh>

      {/* Gold-Plated 2.4GHz Meander PCB Antenna */}
      <group position={[0, 0.055, -1.55]}>
        {[-0.4, -0.2, 0, 0.2, 0.4].map((ax, i) => (
          <mesh key={i} position={[ax, 0, 0]}>
            <boxGeometry args={[0.06, 0.015, 0.34]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.22} />
          </mesh>
        ))}
        <mesh position={[0, 0, -0.15]}>
          <boxGeometry args={[0.86, 0.015, 0.06]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.22} />
        </mesh>
      </group>

      {/* Internal Silicon Dies (Visible when Exploded!) */}
      <group position={[0, 0.07, -0.68]}>
        <mesh position={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.42, 0.05, 0.42]} />
          <meshStandardMaterial color="#0F172A" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[0.28, 0, 0.12]} castShadow>
          <boxGeometry args={[0.28, 0.04, 0.34]} />
          <meshStandardMaterial color="#334155" metalness={0.35} roughness={0.35} />
        </mesh>
        {/* 40MHz Crystal */}
        <mesh position={[0.26, 0, -0.28]} castShadow>
          <boxGeometry args={[0.24, 0.045, 0.18]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.25} />
        </mesh>
      </group>

      {/* ESP-WROOM-32 Metal EMI Shield (Floats up in exploded mode) */}
      <group ref={shieldRef} position={[0, 0.14, -0.68]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.28, 0.18, 1.32]} />
          <meshStandardMaterial map={shieldTex} metalness={0.72} roughness={0.28} />
        </mesh>
      </group>

      {/* CP2102 USB-UART Bridge IC */}
      <mesh position={[0, 0.07, 0.92]} castShadow>
        <boxGeometry args={[0.38, 0.05, 0.38]} />
        <meshStandardMaterial color="#0F172A" roughness={0.45} metalness={0.2} />
      </mesh>

      {/* AMS1117 3.3V LDO Regulator + Tab */}
      <group position={[-0.44, 0.08, 0.68]}>
        <mesh castShadow>
          <boxGeometry args={[0.32, 0.08, 0.24]} />
          <meshStandardMaterial color="#111827" roughness={0.4} />
        </mesh>
        <mesh position={[-0.14, 0.01, 0]}>
          <boxGeometry args={[0.08, 0.05, 0.18]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* USB-C Metallic Port at Front (+Z) */}
      <group position={[0, 0.11, 1.66]}>
        <mesh castShadow>
          <boxGeometry args={[0.56, 0.18, 0.42]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.85} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0, 0.215]}>
          <boxGeometry args={[0.42, 0.09, 0.02]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
      </group>

      {/* EN & BOOT Tactile Buttons */}
      {[-0.54, 0.54].map((bx, i) => (
        <group key={i} position={[bx, 0.08, 1.44]}>
          <mesh castShadow>
            <boxGeometry args={[0.24, 0.06, 0.2]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.65} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.045, 0]} castShadow>
            <cylinderGeometry args={[0.055, 0.055, 0.04, 16]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
        </group>
      ))}

      {/* Power Red LED + GPIO2 Blue Programmable LED */}
      <mesh position={[-0.42, 0.075, 1.15]}>
        <boxGeometry args={[0.1, 0.04, 0.06]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.85} />
      </mesh>
      <mesh position={[0.38, 0.075, 0.88]}>
        <boxGeometry args={[0.1, 0.04, 0.06]} />
        <meshStandardMaterial
          color={blinkOn ? '#3B82F6' : '#1E3A8A'}
          emissive="#3B82F6"
          emissiveIntensity={blinkOn ? 2.2 : 0.08}
        />
      </mesh>

      {/* 30-Pin Gold Headers (15 Left, 15 Right) */}
      {leftPins.map((pinName, idx) => {
        const pz = -1.02 + idx * 0.17;
        return (
          <group
            key={pinName + idx}
            position={[-0.84, 0, pz]}
            onClick={(e) => {
              e.stopPropagation();
              const mapped = pinName.startsWith('D') ? `GPIO${pinName.slice(1)}` : pinName;
              onSelectPin?.(mapped);
            }}
          >
            {/* Plastic Spacer */}
            <mesh position={[0, -0.09, 0]} castShadow>
              <boxGeometry args={[0.16, 0.1, 0.14]} />
              <meshStandardMaterial color="#0F172A" roughness={0.7} />
            </mesh>
            {/* Top Solder Pin + Bottom Long Header Pin */}
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.1, 10]} />
              <meshStandardMaterial color="#FACC15" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.26, 0]}>
              <boxGeometry args={[0.04, 0.34, 0.04]} />
              <meshStandardMaterial color="#FACC15" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        );
      })}

      {rightPins.map((pinName, idx) => {
        const pz = -1.02 + idx * 0.17;
        return (
          <group
            key={pinName + idx}
            position={[0.84, 0, pz]}
            onClick={(e) => {
              e.stopPropagation();
              const mapped = pinName.startsWith('D') ? `GPIO${pinName.slice(1)}` : pinName;
              onSelectPin?.(mapped);
            }}
          >
            <mesh position={[0, -0.09, 0]} castShadow>
              <boxGeometry args={[0.16, 0.1, 0.14]} />
              <meshStandardMaterial color="#0F172A" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.1, 10]} />
              <meshStandardMaterial color="#FACC15" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.26, 0]}>
              <boxGeometry args={[0.04, 0.34, 0.04]} />
              <meshStandardMaterial color="#FACC15" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        );
      })}

      {/* Wi-Fi Signal Rings */}
      {wifiActive && (
        <group position={[0, 0.24, -1.65]} rotation={[-Math.PI / 2, 0, 0]}>
          {[0.38, 0.58, 0.78].map((r, i) => (
            <mesh key={i}>
              <ringGeometry args={[r, r + 0.025, 32, 1, 0.35, Math.PI - 0.7]} />
              <meshBasicMaterial color="#38BDF8" transparent opacity={0.65 - i * 0.16} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      )}

      {/* Interactive 3D Hotspot Callouts (Learn-ESP32 Style) */}
      {ESP32_HOTSPOTS.map((spot) => {
        const isActive = activeHotspotId === spot.id;
        return (
          <Html
            key={spot.id}
            position={spot.pos}
            center
            zIndexRange={[10, 0]}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot(spot);
              }}
              className={`group flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold shadow-sm transition ${
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
    </group>
  );
}
