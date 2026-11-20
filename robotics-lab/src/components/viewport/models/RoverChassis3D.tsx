import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { LabPreviewState } from '../../../types/lab';
import { Esp32Hardware3D } from './Esp32Hardware3D';
import {
  HotspotChips3D,
  HotspotInfo,
  JumperWire3D,
  LipoBattery3D,
} from './HardwareParts3D';

interface RoverChassis3DProps {
  moduleId: 'day16_rover_project' | 'day34_fusion_project' | 'day45_capstone';
  preview: LabPreviewState;
  sketchRunning: boolean;
  activeHotspotId: string | null;
  onSelectHotspot: (spot: HotspotInfo) => void;
}

export function RoverChassis3D({
  moduleId,
  preview,
  sketchRunning,
  activeHotspotId,
  onSelectHotspot,
}: RoverChassis3DProps) {
  const leftWheelRef = useRef<THREE.Group>(null);
  const rightWheelRef = useRef<THREE.Group>(null);
  const roverGroupRef = useRef<THREE.Group>(null);

  // Spin wheels dynamically based on active mode
  useFrame((_, delta) => {
    let lSpeed = 0;
    let rSpeed = 0;
    let targetX = 0;
    let targetYaw = 0;

    if (moduleId === 'day16_rover_project') {
      const brownout = !preview.day16BuckSeparated && preview.day16DriveCmd !== 'stop';
      const safeHalt = preview.day16SignalLostMs >= 500 && preview.day16FailsafeEnabled;
      if (!brownout && !safeHalt) {
        if (preview.day16DriveCmd === 'forward') {
          lSpeed = 6;
          rSpeed = 6;
        } else if (preview.day16DriveCmd === 'reverse') {
          lSpeed = -6;
          rSpeed = -6;
        } else if (preview.day16DriveCmd === 'left') {
          lSpeed = -5;
          rSpeed = 5;
        } else if (preview.day16DriveCmd === 'right') {
          lSpeed = 5;
          rSpeed = -5;
        }
      }
    } else if (moduleId === 'day34_fusion_project') {
      lSpeed = 5.5;
      rSpeed = preview.day34EncoderPid ? 5.5 : 5.5 * (1 - preview.day34MotorMismatchPct / 100);
      if (!preview.day34ImuHeadingPid) {
        targetYaw = !preview.day34EncoderPid
          ? -(preview.day34MotorMismatchPct * 0.025)
          : -0.08;
      }
    } else if (moduleId === 'day45_capstone') {
      if (preview.day45Stage === 'nav') {
        targetX = -1.2;
        lSpeed = 4;
        rSpeed = 4;
      } else if (preview.day45Stage === 'vision' || preview.day45Stage === 'pick') {
        targetX = 0.0;
      } else if (preview.day45Stage === 'place') {
        targetX = 1.1;
        lSpeed = 3;
        rSpeed = 3;
      }
    }

    if (leftWheelRef.current) leftWheelRef.current.rotation.z -= lSpeed * delta;
    if (rightWheelRef.current) rightWheelRef.current.rotation.z -= rSpeed * delta;
    if (roverGroupRef.current) {
      roverGroupRef.current.position.x = THREE.MathUtils.lerp(
        roverGroupRef.current.position.x,
        targetX,
        0.08,
      );
      roverGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        roverGroupRef.current.rotation.y,
        targetYaw,
        0.08,
      );
    }
  });

  // Capstone 2-axis arm angles
  const armBaseRad =
    moduleId === 'day45_capstone'
      ? preview.day45Stage === 'pick'
        ? 0.25
        : preview.day45Stage === 'place'
          ? 0.7
          : 0.9
      : 0;
  const armElbowRad =
    moduleId === 'day45_capstone'
      ? preview.day45Stage === 'pick'
        ? -0.85
        : -0.55
      : 0;

  const hotspots: HotspotInfo[] =
    moduleId === 'day16_rover_project'
      ? [
          {
            id: 'rover_esp',
            label: 'ESP32 두뇌',
            title: 'ESP32 무선 수신기 + Failsafe',
            desc: 'ESP-NOW 패킷을 50Hz로 수신하며, 500ms 이상 신호 두절 시 즉시 모터를 정지시킵니다.',
            pos: [0.4, 0.95, 0],
            focusTarget: [0.4, 0.5, 0],
            focusZoom: 110,
            color: '#635BFF',
          },
          {
            id: 'rover_buck',
            label: '5V 벅 컨버터',
            title: 'LM2596 5V 전원 분리 모듈',
            desc: '모터 돌입 전류가 ESP32 전원을 흔들지 못하도록 로직 5V 레일을 분리합니다.',
            pos: [-0.35, 0.85, 0.45],
            focusTarget: [-0.35, 0.5, 0.4],
            focusZoom: 120,
            color: '#10B981',
          },
          {
            id: 'rover_driver',
            label: 'TB6612 / L298N',
            title: '듀얼 H-브리지 모터 드라이버',
            desc: 'ESP32의 약한 PWM 신호로 좌우 TT DC 모터를 7.4V 고전류 정·역회전 구동합니다.',
            pos: [-0.45, 0.85, -0.45],
            focusTarget: [-0.4, 0.5, -0.4],
            focusZoom: 120,
            color: '#EF4444',
          },
        ]
      : moduleId === 'day34_fusion_project'
        ? [
            {
              id: 'imu_chip',
              label: 'MPU-6050 IMU',
              title: '자이로+가속도 Yaw 헤딩 보정',
              desc: '바퀴 슬립이나 타이어 편차로 차체가 휘면 θ_IMU 오차를 계산해 좌우 바퀴 속도를 실시간 비틉니다.',
              pos: [0.45, 0.95, 0],
              focusTarget: [0.4, 0.5, 0],
              focusZoom: 115,
              color: '#38BDF8',
            },
          ]
        : [
            {
              id: 'cap_cam',
              label: 'USB 카메라 · TF2',
              title: 'camera_link → arm_base TF2 정합',
              desc: 'ArUco 마커의 3D 좌표를 카메라 기준에서 로봇 팔 베이스 좌표로 변환합니다.',
              pos: [0.85, 1.0, 0.35],
              focusTarget: [0.6, 0.7, 0.2],
              focusZoom: 110,
              color: '#0EA5E9',
            },
            {
              id: 'cap_arm',
              label: '2축 매니퓰레이터 IK',
              title: '2R 역기구학 + 토크 안전율 검증 팔',
              desc: '정지 후 ArUco 블록을 향해 2축 역기구학(IK) 해를 풀어 파지한 뒤 바구니로 옮깁니다.',
              pos: [0.45, 1.75, 0],
              focusTarget: [0.4, 1.0, 0],
              focusZoom: 100,
              color: '#635BFF',
            },
          ];

  const statusText =
    moduleId === 'day16_rover_project'
      ? !preview.day16BuckSeparated && preview.day16DriveCmd !== 'stop'
        ? '✗ 벅 컨버터 분리 안 됨 → Brownout 리셋 발생!'
        : preview.day16SignalLostMs >= 500 && preview.day16FailsafeEnabled
          ? `✓ Failsafe 작동 (${preview.day16SignalLostMs}ms 끊김 → 안전 정지)`
          : `주행 명령: ${preview.day16DriveCmd.toUpperCase()} (배터리 전원 안정)`
      : moduleId === 'day34_fusion_project'
        ? preview.day34EncoderPid && preview.day34ImuHeadingPid
          ? '✓ 엔코더 속도 PID + IMU Yaw 보정 → 완벽 직진!'
          : preview.day34EncoderPid
            ? '⚠ 엔코더 PID 단독 (미세 편향 잔존 — IMU 보정 켜기)'
            : `✗ 개루프 주행 (모터 편차 ${preview.day34MotorMismatchPct}%로 차체 휨!)`
        : !preview.day45PowerSeparated
          ? '✗ 전원 분리 미적용 → 팔 구동 중 Brownout!'
          : !preview.day45TfVerified
            ? '✗ TF2(camera→arm) 미정합 → 허공 집기 오류!'
            : `단계: ${preview.day45Stage.toUpperCase()} · 전 도메인 통합 정상`;

  return (
    <group>
      {/* Moving Rover Assembly */}
      <group ref={roverGroupRef} position={[0, 0.38, 0]}>
        {/* 2WD Dark Chassis Deck */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.14, 1.45]} />
          <meshStandardMaterial color="#1E293B" roughness={0.5} metalness={0.35} />
        </mesh>

        {/* Front Caster Support Ball */}
        <mesh position={[0.82, -0.18, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Left & Right Yellow TT Geared Motors + Animated Wheels */}
        {[-0.86, 0.86].map((wz, idx) => (
          <group key={idx} position={[-0.35, -0.05, wz]}>
            {/* Yellow TT Gearbox */}
            <mesh position={[0, 0, wz > 0 ? -0.16 : 0.16]} castShadow>
              <boxGeometry args={[0.52, 0.22, 0.2]} />
              <meshStandardMaterial color="#FACC15" roughness={0.4} />
            </mesh>
            {/* Spinning Wheel Tire + Rim */}
            <group ref={idx === 0 ? leftWheelRef : rightWheelRef}>
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.42, 0.42, 0.18, 24]} />
                <meshStandardMaterial color="#0F172A" roughness={0.85} />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.24, 0.24, 0.19, 16]} />
                <meshStandardMaterial color="#38BDF8" roughness={0.35} />
              </mesh>
              {/* Wheel Rotation Spokes Indicator */}
              <mesh position={[0, 0, wz > 0 ? 0.1 : -0.1]}>
                <boxGeometry args={[0.4, 0.05, 0.02]} />
                <meshStandardMaterial color="#FFFFFF" />
              </mesh>
            </group>
          </group>
        ))}

        {/* On-Deck Electronics: 2S LiPo + Buck + H-Bridge + ESP32 */}
        <group position={[-0.45, 0.22, 0]} scale={[0.72, 0.72, 0.72]}>
          <LipoBattery3D position={[0, 0, 0.55]} />
        </group>

        {/* Red H-Bridge Motor Driver Board */}
        <mesh position={[-0.48, 0.14, -0.38]} castShadow>
          <boxGeometry args={[0.55, 0.14, 0.55]} />
          <meshStandardMaterial color="#B91C1C" roughness={0.4} />
        </mesh>

        {/* Green/Blue LM2596 Buck Converter (Highlighted when separated) */}
        <mesh position={[-0.08, 0.14, 0.42]} castShadow>
          <boxGeometry args={[0.45, 0.12, 0.3]} />
          <meshStandardMaterial
            color={
              moduleId === 'day16_rover_project' && !preview.day16BuckSeparated
                ? '#EF4444'
                : '#0EA5E9'
            }
            roughness={0.35}
          />
        </mesh>

        {/* Onboard ESP32 Brain */}
        <group position={[0.45, 0.16, 0]} scale={[0.45, 0.45, 0.45]} rotation={[0, Math.PI / 2, 0]}>
          <Esp32Hardware3D
            exploded={false}
            wifiActive={moduleId === 'day16_rover_project'}
            sketchRunning={sketchRunning}
            activeHotspotId={null}
            onSelectHotspot={() => {}}
            showHotspots={false}
          />
        </group>

        {/* Internal Jumper Wires */}
        <JumperWire3D start={[-0.25, 0.22, -0.35]} end={[0.25, 0.22, -0.15]} color="#F59E0B" arcHeight={0.28} />
        <JumperWire3D start={[-0.08, 0.2, 0.35]} end={[0.35, 0.22, 0.18]} color="#10B981" arcHeight={0.28} />

        {/* Day 34 MPU-6050 IMU Sensor Chip on Deck */}
        {moduleId === 'day34_fusion_project' && (
          <mesh position={[0.8, 0.12, 0]} castShadow>
            <boxGeometry args={[0.28, 0.08, 0.22]} />
            <meshStandardMaterial color="#2563EB" />
          </mesh>
        )}

        {/* Day 45 Capstone: 2-Axis Manipulator + Front Camera Mounted on Rover */}
        {moduleId === 'day45_capstone' && (
          <>
            {/* Front USB Camera */}
            <mesh position={[0.92, 0.24, 0.35]} castShadow>
              <boxGeometry args={[0.2, 0.2, 0.24]} />
              <meshStandardMaterial color="#0284C7" />
            </mesh>

            {/* 2-DOF Manipulator Pedestal + Links */}
            <group position={[0.25, 0.12, 0]}>
              <mesh position={[0, 0.15, 0]} castShadow>
                <cylinderGeometry args={[0.22, 0.26, 0.3, 20]} />
                <meshStandardMaterial color="#334155" />
              </mesh>
              <group position={[0, 0.3, 0]} rotation={[0, 0, armBaseRad - Math.PI / 2]}>
                <mesh position={[0.45, 0, 0]} castShadow>
                  <boxGeometry args={[0.9, 0.12, 0.14]} />
                  <meshStandardMaterial color="#475569" />
                </mesh>
                <group position={[0.9, 0, 0]} rotation={[0, 0, armElbowRad]}>
                  <mesh position={[0.38, 0, 0]} castShadow>
                    <boxGeometry args={[0.76, 0.1, 0.12]} />
                    <meshStandardMaterial color="#635BFF" />
                  </mesh>
                  {/* Held Box during Place Stage */}
                  {preview.day45Stage === 'place' && preview.day45TfVerified && preview.day45PowerSeparated && (
                    <mesh position={[0.8, -0.05, 0]} castShadow>
                      <boxGeometry args={[0.24, 0.24, 0.24]} />
                      <meshStandardMaterial color="#10B981" />
                    </mesh>
                  )}
                </group>
              </group>
            </group>
          </>
        )}

        <HotspotChips3D
          spots={hotspots}
          activeId={activeHotspotId}
          onSelect={onSelectHotspot}
        />
      </group>

      {/* Day 45 External ArUco Target Block & Place Zone */}
      {moduleId === 'day45_capstone' && (
        <>
          {preview.day45Stage !== 'place' && (
            <group position={[1.45, 0.2, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.32, 0.32, 0.32]} />
                <meshStandardMaterial color="#F59E0B" />
              </mesh>
            </group>
          )}
          <group position={[2.65, 0.08, 0]}>
            <mesh receiveShadow>
              <boxGeometry args={[0.72, 0.12, 0.72]} />
              <meshStandardMaterial color="#635BFF" transparent opacity={0.35} />
            </mesh>
          </group>
        </>
      )}

      {/* Floating Status Readout */}
      <Html position={[0, 2.05, 0]} center zIndexRange={[10, 0]}>
        <div className="pointer-events-none whitespace-nowrap rounded-lg border border-[#E6E8EC] bg-white/95 px-2.5 py-1 font-mono text-[11px] font-semibold text-[#0A2540] shadow-sm">
          {statusText}
        </div>
      </Html>
    </group>
  );
}
