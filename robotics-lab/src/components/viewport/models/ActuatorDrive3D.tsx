import { Html, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { LabPreviewState } from '../../../types/lab';
import {
  AxisTriad3D,
  DetailedWheel3D,
  HotspotChips3D,
  HotspotInfo,
  JumperWire3D,
  LipoBattery3D,
} from './HardwareParts3D';

interface ActuatorDrive3DProps {
  moduleId: 'day14_hbridge' | 'day20_mobile_kinematics' | 'day27_encoder_odom';
  preview: LabPreviewState;
  activeHotspotId: string | null;
  onSelectHotspot: (spot: HotspotInfo) => void;
}

export function ActuatorDrive3D({
  moduleId,
  preview,
  activeHotspotId,
  onSelectHotspot,
}: ActuatorDrive3DProps) {
  const wheelARef = useRef<THREE.Group>(null);
  const wheelBRef = useRef<THREE.Group>(null);
  const wheelCRef = useRef<THREE.Group>(null);
  const wheelDRef = useRef<THREE.Group>(null);
  const encoderDiscRef = useRef<THREE.Group>(null);
  const chALedRef = useRef<THREE.MeshStandardMaterial>(null);
  const chBLedRef = useRef<THREE.MeshStandardMaterial>(null);
  const encoderAngleRef = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    if (moduleId === 'day14_hbridge') {
      const validGnd = preview.day14CommonGnd;
      let omega = 0;
      if (validGnd) {
        if (preview.day14HbridgeMode === 'forward') omega = 6.5;
        else if (preview.day14HbridgeMode === 'reverse') omega = -6.5;
        else if (preview.day14HbridgeMode === 'coast') omega = 1.2;
      }
      if (wheelARef.current) wheelARef.current.rotation.z -= omega * dt;
      return;
    }

    if (moduleId === 'day20_mobile_kinematics') {
      const v = preview.day20LinearV;
      const w = preview.day20AngularW;
      const W = preview.day20WheelBaseM;
      const vL = v - (w * W) / 2;
      const vR = v + (w * W) / 2;
      const lOmega = (vL / 0.28) * 2.2;
      const rOmega = (vR / 0.28) * 2.2;
      if (wheelARef.current) wheelARef.current.rotation.z -= lOmega * dt;
      if (wheelBRef.current) wheelBRef.current.rotation.z -= rOmega * dt;
      if (wheelCRef.current) wheelCRef.current.rotation.z -= lOmega * dt;
      if (wheelDRef.current) wheelDRef.current.rotation.z -= rOmega * dt;
      return;
    }

    if (moduleId === 'day27_encoder_odom') {
      const dir =
        preview.day27Direction === 'cw'
          ? 1
          : preview.day27Direction === 'ccw'
            ? -1
            : 0;
      const radPerSec = dir * ((preview.day27Rpm * Math.PI * 2) / 60) * 0.45;
      encoderAngleRef.current += radPerSec * dt;
      if (wheelARef.current) wheelARef.current.rotation.z -= radPerSec * dt;
      if (encoderDiscRef.current) encoderDiscRef.current.rotation.z = -encoderAngleRef.current;

      // Pulse Ch A & Ch B quadrature LEDs 90° out of phase
      const phase = encoderAngleRef.current * 20;
      const chAOn = dir !== 0 && Math.sin(phase) > 0;
      const chBOn = dir !== 0 && Math.cos(phase) > 0;
      if (chALedRef.current) chALedRef.current.emissiveIntensity = chAOn ? 2.2 : 0.08;
      if (chBLedRef.current) chBLedRef.current.emissiveIntensity = chBOn ? 2.2 : 0.08;
    }
  });

  // Turning arc & ICC radius visualization for Day 20 mobile kinematics
  const { day20ArcPoints, iccZ, hasIcc } = useMemo(() => {
    const v = preview.day20LinearV;
    const w = preview.day20AngularW;
    const pts: THREE.Vector3[] = [];
    const noseX = 0.96;
    const turning = Math.abs(w) >= 0.08;
    const R = turning ? THREE.MathUtils.clamp((v / w) * 2.8, -5.5, 5.5) : 0;
    const effectiveR = turning && Math.abs(R) < 0.65 ? (R >= 0 ? 0.65 : -0.65) : R;

    for (let i = 0; i <= 24; i++) {
      const s = (i / 24) * 2.5;
      if (!turning) {
        const dir = v >= 0 ? 1 : -1;
        pts.push(new THREE.Vector3(noseX + dir * s, 0.03, 0));
      } else {
        const th = (s / Math.abs(effectiveR)) * (w >= 0 ? 1 : -1) * (v >= 0 ? 1 : -1);
        pts.push(
          new THREE.Vector3(
            noseX + Math.abs(effectiveR) * Math.sin(th),
            0.03,
            -effectiveR * (1 - Math.cos(th)),
          ),
        );
      }
    }
    return {
      day20ArcPoints: pts,
      iccZ: THREE.MathUtils.clamp(-effectiveR, -3.2, 3.2),
      hasIcc: turning,
    };
  }, [preview.day20LinearV, preview.day20AngularW]);

  const hotspots: HotspotInfo[] =
    moduleId === 'day14_hbridge'
      ? [
          {
            id: 'hb_mosfets',
            label: 'Q1~Q4 H-브리지',
            title: '4-MOSFET 양방향 전류 제어 회로',
            desc: '대각선(Q1+Q4 / Q3+Q2)을 켜 전류 방향을 뒤집습니다. 같은 쪽 상·하단(Q1+Q2) 동시 ON 시 단락 파손!',
            pos: [-1.15, 0.95, 0],
            focusTarget: [-1.15, 0.35, 0],
            focusZoom: 110,
            color: '#EF4444',
          },
          {
            id: 'hb_gnd',
            label: '공통 GND 선',
            title: 'ESP32 ↔ 드라이버 기준 전위(GND)',
            desc: '제어 신호의 0V 기준이 같아야 PWM 듀티가 MOSFET 게이트에 정확히 전달됩니다.',
            pos: [-0.25, 0.65, 0.65],
            focusTarget: [-0.35, 0.25, 0.45],
            focusZoom: 115,
            color: '#10B981',
          },
        ]
      : moduleId === 'day20_mobile_kinematics'
        ? [
            {
              id: 'mk_icc',
              label: '선회 반경 R = v/ω',
              title: '순간 선회 중심(ICC) 기구학',
              desc: '차동/애커먼/메카넘 섀시별 바퀴 속도(v_L, v_R) 또는 조향각(δ)이 실제 주행 궤적 곡률을 결정합니다.',
              pos: [0.4, 1.05, 0],
              focusTarget: [0, 0.4, 0],
              focusZoom: 90,
              color: '#635BFF',
            },
          ]
        : [
            {
              id: 'enc_disc',
              label: '20-Slot 광학 엔코더',
              title: '2채널 직교(Quadrature Ch A/B) 디스크',
              desc: '90° 위상차 두 포토인터럽터로 회전 거리(펄스 수)와 회전 방향(A·B 선후)을 동시 판독합니다.',
              pos: [-0.45, 1.15, 0.2],
              focusTarget: [-0.45, 0.65, 0.15],
              focusZoom: 120,
              color: '#38BDF8',
            },
          ];

  // Ackermann front wheel steer angle
  const ackermannSteerRad = THREE.MathUtils.clamp(
    Math.atan2(preview.day20AngularW * 0.45, Math.max(0.35, Math.abs(preview.day20LinearV))),
    -0.52,
    0.52,
  );
  const halfWScene = 0.55 + (preview.day20WheelBaseM - 0.15) * 1.4;

  return (
    <group>
      {/* ---------------- DAY 14: H-BRIDGE & MOTOR TEST BENCH ---------------- */}
      {moduleId === 'day14_hbridge' && (
        <group>
          {/* Wooden/Anodized Test Bench Plate */}
          <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
            <boxGeometry args={[4.4, 0.1, 2.3]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.65} />
          </mesh>

          {/* 2S LiPo Battery Pack */}
          <group position={[-1.4, 0.28, -0.62]} scale={[0.72, 0.72, 0.72]}>
            <LipoBattery3D position={[0, 0, 0]} />
          </group>

          {/* Red L298N / MOSFET H-Bridge Driver Board */}
          <group position={[-1.15, 0.18, 0.22]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.25, 0.12, 1.05]} />
              <meshStandardMaterial
                color={preview.day14HbridgeMode === 'shoot_through' ? '#7F1D1D' : '#B91C1C'}
                roughness={0.4}
              />
            </mesh>
            {/* Tall Black Aluminum Heatsink Fins */}
            {[-0.14, 0, 0.14].map((hz, i) => (
              <mesh key={i} position={[0, 0.28, hz]} castShadow>
                <boxGeometry args={[0.42, 0.38, 0.04]} />
                <meshStandardMaterial
                  color={preview.day14HbridgeMode === 'shoot_through' ? '#EF4444' : '#334155'}
                  emissive={preview.day14HbridgeMode === 'shoot_through' ? '#EF4444' : '#000000'}
                  emissiveIntensity={preview.day14HbridgeMode === 'shoot_through' ? 0.7 : 0}
                  metalness={0.75}
                  roughness={0.28}
                />
              </mesh>
            ))}

            {/* 4 MOSFET Status LEDs (Q1, Q2, Q3, Q4) */}
            {[
              {
                name: 'Q1',
                pos: [-0.42, 0.1, -0.3] as [number, number, number],
                on: preview.day14HbridgeMode === 'forward' || preview.day14HbridgeMode === 'shoot_through',
                short: preview.day14HbridgeMode === 'shoot_through',
              },
              {
                name: 'Q2',
                pos: [-0.42, 0.1, 0.3] as [number, number, number],
                on:
                  preview.day14HbridgeMode === 'reverse' ||
                  preview.day14HbridgeMode === 'brake' ||
                  preview.day14HbridgeMode === 'shoot_through',
                short: preview.day14HbridgeMode === 'shoot_through',
              },
              {
                name: 'Q3',
                pos: [0.42, 0.1, -0.3] as [number, number, number],
                on: preview.day14HbridgeMode === 'reverse',
                short: false,
              },
              {
                name: 'Q4',
                pos: [0.42, 0.1, 0.3] as [number, number, number],
                on: preview.day14HbridgeMode === 'forward' || preview.day14HbridgeMode === 'brake',
                short: false,
              },
            ].map((q) => (
              <group key={q.name} position={q.pos}>
                <mesh castShadow>
                  <boxGeometry args={[0.16, 0.08, 0.16]} />
                  <meshStandardMaterial color="#0F172A" />
                </mesh>
                <mesh position={[0, 0.05, 0]}>
                  <sphereGeometry args={[0.045, 10, 10]} />
                  <meshStandardMaterial
                    color={q.short ? '#EF4444' : q.on ? '#10B981' : '#334155'}
                    emissive={q.short ? '#EF4444' : q.on ? '#10B981' : '#000000'}
                    emissiveIntensity={q.on ? 1.8 : 0}
                  />
                </mesh>
              </group>
            ))}
          </group>

          {/* Motor Drive Output Wires & Common GND Wire */}
          <JumperWire3D start={[-0.55, 0.25, 0.05]} end={[0.5, 0.45, -0.15]} color="#F59E0B" arcHeight={0.45} />
          <JumperWire3D start={[-0.55, 0.25, 0.35]} end={[0.5, 0.45, 0.05]} color="#3B82F6" arcHeight={0.45} />
          <JumperWire3D
            start={[-1.05, 0.25, 0.72]}
            end={[0.35, 0.22, 0.72]}
            color={preview.day14CommonGnd ? '#111827' : '#EF4444'}
            arcHeight={0.28}
            dashed={!preview.day14CommonGnd}
          />

          {/* Mounted Test Stand + Geared DC Wheel */}
          <group position={[1.05, 0.62, 0]}>
            <mesh position={[0, -0.34, -0.25]} castShadow>
              <boxGeometry args={[0.85, 0.48, 0.45]} />
              <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.35} />
            </mesh>
            <DetailedWheel3D
              wheelRef={wheelARef}
              position={[0, 0, 0.15]}
              side={1}
              radius={0.52}
              rimColor={preview.day14HbridgeMode === 'shoot_through' || !preview.day14CommonGnd ? '#EF4444' : '#38BDF8'}
            />
          </group>
        </group>
      )}

      {/* ---------------- DAY 20: MOBILE KINEMATICS ARCHITECTURES ---------------- */}
      {moduleId === 'day20_mobile_kinematics' && (
        <group position={[0, 0.4, 0]}>
          <AxisTriad3D position={[0, 0.22, 0]} scale={0.42} label="base_link" />

          {/* Main Chassis Deck */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.95, 0.14, Math.max(1.0, halfWScene * 1.45)]} />
            <meshStandardMaterial color="#1E293B" metalness={0.45} roughness={0.4} />
          </mesh>
          {/* Front Heading Pointer Arrow */}
          <mesh position={[1.08, 0.08, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.16, 0.28, 16]} />
            <meshStandardMaterial color="#635BFF" />
          </mesh>

          {/* Left / Right Rear Drive Wheels (Widened dynamically with Wheelbase W) */}
          <DetailedWheel3D
            wheelRef={wheelARef}
            position={[-0.48, 0, -halfWScene]}
            side={-1}
            radius={0.4}
            showMotorAndEncoder={preview.day20DriveArch === 'diff'}
            rimColor={preview.day20DriveArch === 'mecanum' ? '#10B981' : '#38BDF8'}
          />
          <DetailedWheel3D
            wheelRef={wheelBRef}
            position={[-0.48, 0, halfWScene]}
            side={1}
            radius={0.4}
            showMotorAndEncoder={preview.day20DriveArch === 'diff'}
            rimColor={preview.day20DriveArch === 'mecanum' ? '#10B981' : '#38BDF8'}
          />

          {/* Architecture-Specific Front Hardware */}
          {preview.day20DriveArch === 'diff' ? (
            <mesh position={[0.76, -0.24, 0]} castShadow>
              <sphereGeometry args={[0.16, 18, 18]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.85} roughness={0.2} />
            </mesh>
          ) : (
            <>
              {/* Front Left & Right Wheels (Ackermann steers them; Mecanum renders omni rollers!) */}
              <group
                position={[0.62, 0, -halfWScene]}
                rotation={[0, preview.day20DriveArch === 'ackermann' ? ackermannSteerRad : 0, 0]}
              >
                <DetailedWheel3D
                  wheelRef={wheelCRef}
                  side={-1}
                  radius={0.4}
                  showMotorAndEncoder={false}
                  rimColor={preview.day20DriveArch === 'mecanum' ? '#F59E0B' : '#635BFF'}
                />
              </group>
              <group
                position={[0.62, 0, halfWScene]}
                rotation={[0, preview.day20DriveArch === 'ackermann' ? ackermannSteerRad : 0, 0]}
              >
                <DetailedWheel3D
                  wheelRef={wheelDRef}
                  side={1}
                  radius={0.4}
                  showMotorAndEncoder={false}
                  rimColor={preview.day20DriveArch === 'mecanum' ? '#F59E0B' : '#635BFF'}
                />
              </group>
            </>
          )}

          {/* Floor Turning Trajectory Curvature Arc + ICC Center Line */}
          <group position={[0, -0.38, 0]}>
            <Line points={day20ArcPoints} color="#635BFF" lineWidth={3.5} />
            {hasIcc && (
              <>
                <Line
                  points={[
                    new THREE.Vector3(-0.48, 0.03, 0),
                    new THREE.Vector3(-0.48, 0.03, iccZ),
                  ]}
                  color="#0EA5E9"
                  lineWidth={2}
                  dashed
                  dashSize={0.14}
                  gapSize={0.1}
                />
                <mesh position={[-0.48, 0.06, iccZ]}>
                  <cylinderGeometry args={[0.09, 0.09, 0.08, 16]} />
                  <meshStandardMaterial color="#0EA5E9" emissive="#0EA5E9" emissiveIntensity={0.45} />
                </mesh>
              </>
            )}
          </group>
        </group>
      )}

      {/* ---------------- DAY 27: OPTICAL QUADRATURE ENCODER LAB ---------------- */}
      {moduleId === 'day27_encoder_odom' && (
        <group>
          <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
            <boxGeometry args={[4.2, 0.1, 2.2]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.65} />
          </mesh>

          {/* Aluminum Axle Bearing Pillow Blocks */}
          {[-0.25, 0.72].map((bx, idx) => (
            <mesh key={idx} position={[bx, 0.42, 0]} castShadow>
              <boxGeometry args={[0.14, 0.68, 0.45]} />
              <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}

          {/* Common Steel Drive Shaft */}
          <mesh position={[0.15, 0.65, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.045, 0.045, 2.1, 16]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.18} />
          </mesh>

          {/* Drive Wheel on Right End of Shaft */}
          <group position={[1.05, 0.65, 0]} rotation={[0, Math.PI / 2, 0]}>
            <DetailedWheel3D
              wheelRef={wheelARef}
              side={1}
              radius={0.55}
              showMotorAndEncoder={false}
              rimColor={preview.day27WheelSlipPct > 15 ? '#F59E0B' : '#38BDF8'}
            />
          </group>

          {/* 20-Slot Optical Encoder Disc on Left Side of Shaft */}
          <group position={[-0.65, 0.65, 0]} rotation={[0, Math.PI / 2, 0]}>
            <group ref={encoderDiscRef}>
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.48, 0.48, 0.04, 32]} />
                <meshStandardMaterial color="#0F172A" roughness={0.5} />
              </mesh>
              {/* 12 Visible Optical Slots */}
              {Array.from({ length: 12 }).map((_, i) => {
                const ang = (i / 12) * Math.PI * 2;
                return (
                  <mesh
                    key={i}
                    position={[Math.cos(ang) * 0.36, Math.sin(ang) * 0.36, 0]}
                    rotation={[0, 0, ang]}
                  >
                    <boxGeometry args={[0.14, 0.045, 0.05]} />
                    <meshStandardMaterial color="#F8FAFC" />
                  </mesh>
                );
              })}
            </group>
          </group>

          {/* U-Shaped Dual Channel Photo-Interrupter Fork Module */}
          <group position={[-0.65, 1.08, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.32, 0.24, 0.36]} />
              <meshStandardMaterial color="#1E293B" roughness={0.45} />
            </mesh>
            {/* Ch A & Ch B Quadrature Status LEDs */}
            <mesh position={[-0.08, 0.14, -0.06]}>
              <sphereGeometry args={[0.045, 10, 10]} />
              <meshStandardMaterial ref={chALedRef} color="#38BDF8" emissive="#38BDF8" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0.08, 0.14, 0.06]}>
              <sphereGeometry args={[0.045, 10, 10]} />
              <meshStandardMaterial ref={chBLedRef} color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.2} />
            </mesh>
          </group>

          {/* Slip Error Indicator Bar on Bench */}
          {preview.day27WheelSlipPct > 0 && (
            <Html position={[1.05, 0.18, 0.72]} center zIndexRange={[10, 0]}>
              <span className="pointer-events-none whitespace-nowrap rounded border border-amber-300 bg-amber-50/95 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-800">
                바퀴 슬립 {preview.day27WheelSlipPct}% → 실제 이동보다 엔코더 과다 카운트!
              </span>
            </Html>
          )}
        </group>
      )}

      <HotspotChips3D spots={hotspots} activeId={activeHotspotId} onSelect={onSelectHotspot} />
    </group>
  );
}
