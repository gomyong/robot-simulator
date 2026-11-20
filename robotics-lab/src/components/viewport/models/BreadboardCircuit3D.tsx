import { Html } from '@react-three/drei';
import { LabPreviewState } from '../../../types/lab';
import { Esp32Hardware3D } from './Esp32Hardware3D';
import {
  Breadboard3D,
  Hcsr04Module3D,
  HotspotChips3D,
  HotspotInfo,
  JumperWire3D,
  Led3D,
  LipoBattery3D,
  Resistor3D,
} from './HardwareParts3D';

interface BreadboardCircuit3DProps {
  moduleId: 'day01_basics' | 'day02_breadboard' | 'day05_divider' | 'day07_project';
  preview: LabPreviewState;
  sketchRunning: boolean;
  activeHotspotId: string | null;
  onSelectHotspot: (spot: HotspotInfo) => void;
  onChangePreview: (patch: Partial<LabPreviewState>) => void;
}

export function BreadboardCircuit3D({
  moduleId,
  preview,
  sketchRunning,
  activeHotspotId,
  onSelectHotspot,
  onChangePreview,
}: BreadboardCircuit3DProps) {
  const xray = preview.exploded > 0.1;

  // Day 01: Anatomy (Sensor -> Brain -> Actuator) OR Breadboard LED Circuit
  if (moduleId === 'day01_basics') {
    if (preview.day01Mode === 'anatomy') {
      const spots: HotspotInfo[] = [
        {
          id: 'sensor',
          label: '① 센서 (HC-SR04)',
          title: '감각 기관: 초음파 거리 센서',
          desc: '40kHz 초음파를 쏘고 되돌아오는 왕복 시간(ToF)을 측정해 앞 장애물 거리를 전기 신호로 바꿉니다.',
          pos: [-2.1, 1.05, 0],
          focusTarget: [-2.0, 0.4, 0],
          focusZoom: 105,
          color: '#0EA5E9',
        },
        {
          id: 'brain',
          label: '② 두뇌 (ESP32)',
          title: '판단 두뇌: ESP32 MCU',
          desc: '센서 값을 읽어 조건문/제어식으로 판단한 뒤 액추에이터에 PWM/디지털 제어 명령을 내립니다.',
          pos: [0, 0.9, 0],
          focusTarget: [0, 0.35, 0],
          focusZoom: 100,
          color: '#635BFF',
        },
        {
          id: 'actuator',
          label: '③ 액추에이터 (서보/LED)',
          title: '운동 근육: 서보 모터 & LED',
          desc: 'ESP32가 보낸 전기 신호를 실제 물리적 회전·움직임·빛으로 바꿉니다.',
          pos: [2.1, 1.05, 0],
          focusTarget: [2.0, 0.4, 0],
          focusZoom: 105,
          color: '#10B981',
        },
      ];

      return (
        <group>
          <Hcsr04Module3D position={[-2.1, 0.52, 0]} />
          <group position={[0, -0.1, 0]} scale={[0.68, 0.68, 0.68]}>
            <Esp32Hardware3D
              exploded={false}
              wifiActive={false}
              sketchRunning={sketchRunning}
              activeHotspotId={null}
              onSelectHotspot={() => {}}
              showHotspots={false}
            />
          </group>
          {/* Servo Motor Actuator */}
          <group position={[2.1, 0.36, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.8, 0.65, 0.45]} />
              <meshStandardMaterial color="#2563EB" roughness={0.4} />
            </mesh>
            <mesh position={[0.15, 0.42, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.14, 0.2, 20]} />
              <meshStandardMaterial color="#F8FAFC" />
            </mesh>
            <mesh position={[0.35, 0.52, 0]} castShadow>
              <boxGeometry args={[0.55, 0.08, 0.14]} />
              <meshStandardMaterial color="#F8FAFC" />
            </mesh>
          </group>

          <JumperWire3D start={[-1.6, 0.35, 0.1]} end={[-0.6, 0.25, 0.2]} color="#38BDF8" arcHeight={0.5} />
          <JumperWire3D start={[0.6, 0.25, 0.2]} end={[1.75, 0.35, 0.1]} color="#10B981" arcHeight={0.5} />

          <HotspotChips3D
            spots={spots}
            activeId={activeHotspotId ?? preview.day01FocusPart}
            onSelect={(spot) => {
              onSelectHotspot(spot);
              onChangePreview({
                day01FocusPart: spot.id as LabPreviewState['day01FocusPart'],
              });
            }}
          />
        </group>
      );
    }

    // Day 01 Circuit mode: 3D Breadboard + Resistor + LED
    const Vs = preview.circuitVoltageV;
    const Vf = preview.circuitLedVf;
    const R = preview.circuitResistanceOhm;
    const effR = Math.max(R, 5);
    const currentMa = Vs > Vf ? ((Vs - Vf) / effR) * 1000 : 0;
    const overcurrent = currentMa > 30;
    const ledHex = Vf >= 3.0 ? '#3B82F6' : Vf >= 2.15 ? '#10B981' : '#EF4444';

    return (
      <group>
        <Breadboard3D position={[0.45, 0, 0]} xray={xray} />
        <LipoBattery3D position={[-2.4, 0.18, 0]} />
        <Resistor3D position={[0.1, 0.26, -0.35]} ohms={R} />
        <Led3D
          position={[0.85, 0.2, -0.35]}
          color={ledHex}
          intensity={sketchRunning || currentMa >= 4 ? Math.min(1, currentMa / 15) : 0.05}
          overcurrent={overcurrent}
        />

        <JumperWire3D start={[-1.7, 0.25, -0.1]} end={[-0.22, 0.22, -0.35]} color="#EF4444" arcHeight={0.55} />
        <JumperWire3D start={[0.92, 0.22, -0.35]} end={[-1.7, 0.25, 0.2]} color="#111827" arcHeight={0.45} />

        <Html position={[0.45, 0.95, -0.35]} center zIndexRange={[10, 0]}>
          <div
            className={`whitespace-nowrap rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold shadow-sm ${
              overcurrent
                ? 'border-rose-300 bg-rose-50/95 text-rose-700'
                : currentMa >= 5 && currentMa <= 20
                  ? 'border-emerald-300 bg-emerald-50/95 text-emerald-700'
                  : 'border-[#E6E8EC] bg-white/95 text-[#0A2540]'
            }`}
          >
            {overcurrent
              ? `POP! 과전류 ${currentMa.toFixed(0)} mA — 보호 저항 필요!`
              : `전류 I = ${currentMa.toFixed(1)} mA (안전 범위 5~20 mA)`}
          </div>
        </Html>
      </group>
    );
  }

  // Day 02: 3D Breadboard Anatomy + X-Ray Copper Strip + Short Scenario
  if (moduleId === 'day02_breadboard') {
    const scenario = preview.breadboardScenario;
    const isFault = scenario !== 'correct';
    const spots: HotspotInfo[] = [
      {
        id: 'rail',
        label: '가로 전원 레일 (+ / -)',
        title: '상·하단 가로 방향 전원 버스',
        desc: '빨간(+)과 파란(-) 줄은 가로(수평) 방향으로 구멍이 한 줄로 연결되어 있습니다.',
        pos: [-0.8, 0.48, -0.88],
        focusTarget: [-0.5, 0.15, -0.8],
        focusZoom: 115,
        color: '#EF4444',
      },
      {
        id: 'col',
        label: '세로 5구멍 연결열',
        title: '내부 수직 5-Hole 구리 클립',
        desc: '가운데 5개 구멍(a~e 또는 f~j)은 세로 방향으로 5개씩 연결되어 부품 다리를 꽂습니다.',
        pos: [0.3, 0.48, -0.32],
        focusTarget: [0.3, 0.15, -0.3],
        focusZoom: 120,
        color: '#F59E0B',
      },
      {
        id: 'trench',
        label: '중앙 절연 골짜기',
        title: '중앙 단절 골짜기 (DIP IC용)',
        desc: '위(a~e)와 아래(f~j) 구리 클립은 중앙 골짜기를 경계로 완전히 분리되어 있습니다.',
        pos: [0.9, 0.42, 0],
        focusTarget: [0.5, 0.15, 0],
        focusZoom: 115,
        color: '#635BFF',
      },
    ];

    return (
      <group>
        <Breadboard3D
          position={[0, 0, 0]}
          xray={xray}
          highlightShort={scenario === 'short_rail'}
        />
        <Led3D
          position={[0.6, 0.2, -0.35]}
          color="#10B981"
          intensity={isFault ? 0 : 0.9}
          overcurrent={scenario === 'short_rail'}
        />
        {scenario === 'short_rail' ? (
          <>
            <JumperWire3D start={[-0.1, 0.22, -0.85]} end={[-0.1, 0.22, -0.32]} color="#EF4444" arcHeight={0.45} />
            <JumperWire3D start={[-0.1, 0.22, 0.85]} end={[-0.1, 0.22, -0.44]} color="#111827" arcHeight={0.55} />
          </>
        ) : scenario === 'bridge_trench' ? (
          <>
            <JumperWire3D start={[0.6, 0.22, -0.3]} end={[0.6, 0.22, 0.3]} color="#EF4444" arcHeight={0.42} />
          </>
        ) : (
          <>
            <Resistor3D position={[0.15, 0.25, -0.35]} ohms={220} />
            <JumperWire3D start={[-0.25, 0.22, -0.85]} end={[-0.25, 0.22, -0.35]} color="#EF4444" arcHeight={0.35} />
            <JumperWire3D start={[0.65, 0.22, 0.85]} end={[0.65, 0.22, -0.25]} color="#111827" arcHeight={0.45} />
          </>
        )}

        <Html position={[0, 1.05, 0]} center zIndexRange={[10, 0]}>
          <div
            className={`whitespace-nowrap rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold shadow-sm ${
              isFault
                ? 'border-rose-300 bg-rose-50/95 text-rose-700'
                : 'border-emerald-300 bg-emerald-50/95 text-emerald-700'
            }`}
          >
            {scenario === 'short_rail'
              ? '합선(Short)! 같은 세로 5구멍 열에 +5V와 GND를 같이 꽂았습니다!'
              : scenario === 'bridge_trench'
                ? '회로 단선! 중앙 골짜기는 위아래가 끊어져 있습니다!'
                : '정상 배선 · [내부 투시] 버튼으로 속 구리 클립을 열어보세요'}
          </div>
        </Html>

        <HotspotChips3D
          spots={spots}
          activeId={activeHotspotId}
          onSelect={onSelectHotspot}
        />
      </group>
    );
  }

  // Day 05: HC-SR04 5V ECHO -> Voltage Divider Breadboard -> ESP32 3.3V
  if (moduleId === 'day05_divider') {
    const vOut =
      preview.dividerVinV *
      (preview.dividerR2K / Math.max(0.1, preview.dividerR1K + preview.dividerR2K));
    const overvolt = vOut > 3.6;

    return (
      <group>
        <Hcsr04Module3D position={[-2.5, 0.52, -0.3]} />
        <Breadboard3D position={[0, 0, 0]} xray={xray} />
        <group position={[2.45, -0.1, 0]} scale={[0.66, 0.66, 0.66]}>
          <Esp32Hardware3D
            exploded={false}
            wifiActive={false}
            sketchRunning={sketchRunning}
            activeHotspotId={null}
            onSelectHotspot={() => {}}
            showHotspots={false}
          />
        </group>

        <Resistor3D position={[-0.35, 0.25, -0.35]} ohms={preview.dividerR1K * 1000} />
        <Resistor3D position={[0.45, 0.25, 0.15]} rotationY={Math.PI / 2} ohms={preview.dividerR2K * 1000} />

        {/* 5V ECHO Wire -> R1 -> Split Node -> ESP32 GPIO 14 */}
        <JumperWire3D start={[-2.2, 0.3, -0.25]} end={[-0.7, 0.22, -0.35]} color="#EF4444" arcHeight={0.55} />
        <JumperWire3D start={[0.45, 0.22, -0.35]} end={[1.85, 0.25, 0.15]} color={overvolt ? '#EF4444' : '#10B981'} arcHeight={0.6} />

        <Html position={[0.1, 1.05, 0]} center zIndexRange={[10, 0]}>
          <div
            className={`whitespace-nowrap rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold shadow-sm ${
              overvolt
                ? 'border-rose-300 bg-rose-50/95 text-rose-700'
                : 'border-emerald-300 bg-emerald-50/95 text-emerald-700'
            }`}
          >
            {`분압 출력 V_out = ${vOut.toFixed(2)}V → ${
              overvolt ? '과전압 위험 (> 3.6V ESP32 핀 손상!)' : '3.3V GPIO 안전'
            }`}
          </div>
        </Html>
      </group>
    );
  }

  // Day 07: Smart Hazard Detector Integrated 3D Breadboard Project
  const allSafe =
    preview.projectCommonGnd &&
    preview.projectEchoDivider &&
    preview.projectLedResistor;
  const alarm = allSafe && preview.projectObstacleCm < 30;

  return (
    <group>
      <LipoBattery3D position={[-2.5, 0.18, 0.85]} />
      <Hcsr04Module3D position={[-2.4, 0.52, -0.65]} />
      <Breadboard3D position={[0, 0, 0]} xray={xray} />
      <group position={[2.45, -0.1, 0]} scale={[0.66, 0.66, 0.66]}>
        <Esp32Hardware3D
          exploded={false}
          wifiActive={false}
          sketchRunning={sketchRunning || alarm}
          activeHotspotId={null}
          onSelectHotspot={() => {}}
          showHotspots={false}
        />
      </group>

      {preview.projectEchoDivider && (
        <>
          <Resistor3D position={[-0.45, 0.25, -0.35]} ohms={10000} />
          <Resistor3D position={[0.15, 0.25, 0.12]} rotationY={Math.PI / 2} ohms={20000} />
        </>
      )}
      {preview.projectLedResistor && (
        <Resistor3D position={[0.85, 0.25, -0.35]} ohms={220} />
      )}
      <Led3D
        position={[1.38, 0.2, -0.35]}
        color="#EF4444"
        intensity={alarm ? 1.0 : allSafe ? 0.15 : 0}
        overcurrent={!preview.projectLedResistor && preview.projectCommonGnd}
      />

      {/* Common GND Wire */}
      <JumperWire3D
        start={[-1.9, 0.22, 0.85]}
        end={[1.85, 0.22, 0.65]}
        color="#111827"
        arcHeight={0.6}
        dashed={!preview.projectCommonGnd}
      />
      {/* ECHO Signal Wire */}
      <JumperWire3D
        start={[-2.0, 0.3, -0.65]}
        end={[1.85, 0.24, -0.2]}
        color={preview.projectEchoDivider ? '#10B981' : '#EF4444'}
        arcHeight={0.7}
      />

      <Html position={[0.1, 1.15, 0]} center zIndexRange={[10, 0]}>
        <div
          className={`whitespace-nowrap rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold shadow-sm ${
            !allSafe
              ? 'border-rose-300 bg-rose-50/95 text-rose-700'
              : alarm
                ? 'border-amber-300 bg-amber-50/95 text-amber-800'
                : 'border-emerald-300 bg-emerald-50/95 text-emerald-700'
          }`}
        >
          {!preview.projectCommonGnd
            ? '공통 GND 단선! 기준 전위가 없어 동작 안 함'
            : !preview.projectEchoDivider
              ? 'ECHO 5V 직결 위험! 분압 저항을 켜세요'
              : !preview.projectLedResistor
                ? '경보 LED 저항 누락! 과전류 위험'
                : alarm
                  ? `경보 작동! 장애물 ${preview.projectObstacleCm}cm < 30cm`
                  : `안전 가동 중 · 장애물 ${preview.projectObstacleCm}cm`}
        </div>
      </Html>
    </group>
  );
}
