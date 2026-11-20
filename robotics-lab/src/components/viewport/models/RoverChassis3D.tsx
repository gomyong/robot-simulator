import { Html, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { LabPreviewState } from '../../../types/lab';
import { Esp32Hardware3D } from './Esp32Hardware3D';
import {
  ArucoBlock3D,
  AxisTriad3D,
  DetailedWheel3D,
  HotspotChips3D,
  HotspotInfo,
  JumperWire3D,
  LipoBattery3D,
  ParallelGripper3D,
  ServoMotor3D,
  UsbCamera3D,
} from './HardwareParts3D';

interface RoverChassis3DProps {
  moduleId: 'day16_rover_project' | 'day34_fusion_project' | 'day45_capstone';
  preview: LabPreviewState;
  sketchRunning: boolean;
  activeHotspotId: string | null;
  onSelectHotspot: (spot: HotspotInfo) => void;
  replaySeq?: number;
}

const WHEEL_RADIUS = 0.4;
const DECK_BASE_Y = 0.4;
const ARM_PEDESTAL_LOCAL: [number, number, number] = [0.42, 0.46, 0];
const ARM_WORLD_BASE_Y = DECK_BASE_Y + ARM_PEDESTAL_LOCAL[1]; // 0.86
const L1 = 0.78;
const L2 = 0.68;
const GRIPPER_TCP_OFFSET = 0.25;

const PICKUP_WORLD_X = 0.45;
const PLACE_WORLD_X = 2.05;
const BLOCK_SIZE = 0.26;
const BLOCK_REST_Y = 0.1 + BLOCK_SIZE * 0.5; // 0.23
const ROVER_PICK_X = -0.82;
const ROVER_NAV_START_X = -1.85;
const ROVER_PLACE_X = 0.84;

/** Analytical 2R elbow-up IK in vertical XY plane (returns shoulder t1, elbow t2 in rad) */
function solve2RIk(dx: number, dy: number): { t1: number; t2: number; reachable: boolean } {
  const r2 = dx * dx + dy * dy;
  const maxR = (L1 + L2) * 0.995;
  const minR = Math.abs(L1 - L2) + 0.02;
  const r = Math.sqrt(r2);
  let sx = dx;
  let sy = dy;
  const reachable = r <= maxR && r >= minR;
  if (r > maxR && r > 1e-4) {
    sx = (dx / r) * maxR;
    sy = (dy / r) * maxR;
  } else if (r < minR && r > 1e-4) {
    sx = (dx / r) * minR;
    sy = (dy / r) * minR;
  }
  const sr2 = sx * sx + sy * sy;
  const cosT2 = THREE.MathUtils.clamp((sr2 - L1 * L1 - L2 * L2) / (2 * L1 * L2), -1, 1);
  // Negative sin => elbow-up configuration in +X/+Y right-handed plane
  const t2 = -Math.acos(cosT2);
  const t1 = Math.atan2(sy, sx) - Math.atan2(L2 * Math.sin(t2), L1 + L2 * Math.cos(t2));
  return { t1, t2, reachable };
}

export function RoverChassis3D({
  moduleId,
  preview,
  sketchRunning,
  activeHotspotId,
  onSelectHotspot,
  replaySeq = 0,
}: RoverChassis3DProps) {
  const leftWheelRef = useRef<THREE.Group>(null);
  const rightWheelRef = useRef<THREE.Group>(null);
  const roverGroupRef = useRef<THREE.Group>(null);

  // Articulated arm joint refs (Day 45)
  const shoulderGroupRef = useRef<THREE.Group>(null);
  const elbowGroupRef = useRef<THREE.Group>(null);
  const wristGroupRef = useRef<THREE.Group>(null);
  const jawLeftRef = useRef<THREE.Group>(null);
  const jawRightRef = useRef<THREE.Group>(null);

  // Day 45 dynamic block / ghost / drop-pad visual refs
  const tableBlockRef = useRef<THREE.Group>(null);
  const carriedBlockRef = useRef<THREE.Group>(null);
  const ghostMissRef = useRef<THREE.Group>(null);

  // React flags synced only on state transition so <Html> badges never leak on hidden groups
  const [blockOnPedestal, setBlockOnPedestal] = useState(true);
  const [blockLanded, setBlockLanded] = useState(false);
  const syncedFlagsRef = useRef({ onPedestal: true, landed: false });

  // Continuous stage timer & kinematics state (strict wall-clock seconds)
  const stageStartMsRef = useRef(performance.now());
  const prevStageRef = useRef(preview.day45Stage);

  const poseRef = useRef({
    roverX: moduleId === 'day45_capstone' ? ROVER_NAV_START_X : 0,
    roverYaw: 0,
    wristLocalX: 0.36,
    wristLocalY: 0.25,
    jawOpen: 0.85,
  });

  useEffect(() => {
    stageStartMsRef.current = performance.now();
    prevStageRef.current = preview.day45Stage;
    syncedFlagsRef.current = { onPedestal: true, landed: false };
    setBlockOnPedestal(true);
    setBlockLanded(false);

    if (
      moduleId === 'day45_capstone' &&
      preview.day45Stage === 'place' &&
      preview.day45TfVerified &&
      preview.day45PowerSeparated
    ) {
      const timer = window.setTimeout(() => {
        syncedFlagsRef.current.landed = true;
        syncedFlagsRef.current.onPedestal = false;
        setBlockOnPedestal(false);
        setBlockLanded(true);
      }, 2350);
      return () => window.clearTimeout(timer);
    }
  }, [moduleId, preview.day45Stage, preview.day45TfVerified, preview.day45PowerSeparated, replaySeq]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);

    if (moduleId === 'day16_rover_project') {
      const brownout = !preview.day16BuckSeparated && preview.day16DriveCmd !== 'stop';
      const safeHalt = preview.day16SignalLostMs >= 500 && preview.day16FailsafeEnabled;
      let linV = 0;
      let yawRate = 0;

      if (!brownout && !safeHalt) {
        if (preview.day16DriveCmd === 'forward') linV = 0.95;
        else if (preview.day16DriveCmd === 'reverse') linV = -0.95;
        else if (preview.day16DriveCmd === 'left') yawRate = 1.65;
        else if (preview.day16DriveCmd === 'right') yawRate = -1.65;
      }

      // Gently loop forward/reverse along bench without running off screen
      let nextX = poseRef.current.roverX + linV * Math.cos(poseRef.current.roverYaw) * dt;
      if (nextX > 1.35) nextX = -1.35;
      if (nextX < -1.35) nextX = 1.35;
      poseRef.current.roverX = linV === 0 ? THREE.MathUtils.lerp(poseRef.current.roverX, 0, dt * 2) : nextX;
      poseRef.current.roverYaw += yawRate * dt;

      const lSpin = (linV - yawRate * 0.45) / WHEEL_RADIUS;
      const rSpin = (linV + yawRate * 0.45) / WHEEL_RADIUS;
      if (leftWheelRef.current) leftWheelRef.current.rotation.z -= lSpin * dt;
      if (rightWheelRef.current) rightWheelRef.current.rotation.z -= rSpin * dt;

      if (roverGroupRef.current) {
        roverGroupRef.current.position.x = poseRef.current.roverX;
        roverGroupRef.current.rotation.y = poseRef.current.roverYaw;
      }
      return;
    }

    if (moduleId === 'day34_fusion_project') {
      const baseSpeed = 1.45;
      const mismatchRatio = preview.day34MotorMismatchPct / 100;
      const lWheelOmega = baseSpeed / WHEEL_RADIUS;
      const rWheelOmega = preview.day34EncoderPid
        ? baseSpeed / WHEEL_RADIUS
        : (baseSpeed * (1 - mismatchRatio)) / WHEEL_RADIUS;

      const targetYaw = preview.day34ImuHeadingPid
        ? 0
        : preview.day34EncoderPid
          ? -0.09
          : -(preview.day34MotorMismatchPct * 0.028);

      const driftZ = preview.day34ImuHeadingPid
        ? 0
        : preview.day34EncoderPid
          ? 0.14
          : Math.sin(-targetYaw) * 1.1;

      if (leftWheelRef.current) leftWheelRef.current.rotation.z -= lWheelOmega * dt;
      if (rightWheelRef.current) rightWheelRef.current.rotation.z -= rWheelOmega * dt;

      if (roverGroupRef.current) {
        roverGroupRef.current.position.x = THREE.MathUtils.lerp(roverGroupRef.current.position.x, 0, dt * 4);
        roverGroupRef.current.position.z = THREE.MathUtils.lerp(roverGroupRef.current.position.z, driftZ, dt * 4);
        roverGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          roverGroupRef.current.rotation.y,
          targetYaw,
          dt * 4,
        );
      }
      return;
    }

    // ---------------- DAY 45 CAPSTONE: 2R IK + CONTINUOUS PICK & PLACE ----------------
    const tSec = (performance.now() - stageStartMsRef.current) / 1000;
    const powerOk = preview.day45PowerSeparated;
    const tfOk = preview.day45TfVerified;

    let goalRoverX = ROVER_PICK_X;
    let goalWristX = 0.36;
    let goalWristY = 0.25;
    let goalJawOpen = 0.88;
    let showOnPedestal = true;
    let showCarried = false;
    let showDropped = false;

    if (preview.day45Stage === 'nav') {
      const p = THREE.MathUtils.clamp(tSec / 1.8, 0, 1);
      const ease = p * p * (3 - 2 * p);
      goalRoverX = THREE.MathUtils.lerp(ROVER_NAV_START_X, ROVER_PICK_X, ease);
      goalWristX = 0.34;
      goalWristY = 0.26;
      goalJawOpen = 0.85;
    } else if (preview.day45Stage === 'vision') {
      goalRoverX = ROVER_PICK_X;
      goalWristX = 0.4;
      goalWristY = 0.24;
      goalJawOpen = 0.88;
    } else if (preview.day45Stage === 'pick') {
      goalRoverX = ROVER_PICK_X;
      // Shoulder world X at ROVER_PICK_X = -0.82 + 0.42 = -0.40
      const shWorldX = goalRoverX + ARM_PEDESTAL_LOCAL[0];
      const shWorldY = ARM_WORLD_BASE_Y;
      // If TF error is active, arm reaches 0.36 units PAST the actual block
      const perceivedBlockX = tfOk ? PICKUP_WORLD_X : PICKUP_WORLD_X + 0.36;
      const targetWristLocalX = perceivedBlockX - GRIPPER_TCP_OFFSET - shWorldX;
      const targetWristLocalY = BLOCK_REST_Y - shWorldY;

      if (!powerOk) {
        // Brownout droop halfway
        const p = THREE.MathUtils.clamp(tSec / 0.8, 0, 1);
        goalWristX = THREE.MathUtils.lerp(0.38, targetWristLocalX * 0.65, p);
        goalWristY = THREE.MathUtils.lerp(0.24, -0.35, p);
        goalJawOpen = 0.7;
      } else if (tSec < 0.9) {
        // Phase 1: Reach cleanly toward the block from slightly above
        const p = THREE.MathUtils.clamp(tSec / 0.9, 0, 1);
        const ease = p * p * (3 - 2 * p);
        goalWristX = THREE.MathUtils.lerp(0.38, targetWristLocalX, ease);
        goalWristY = THREE.MathUtils.lerp(0.24, targetWristLocalY, ease);
        goalJawOpen = 0.95;
      } else if (tSec < 1.45) {
        // Phase 2: Close parallel jaws onto block (or empty air if !tfOk)
        const p = THREE.MathUtils.clamp((tSec - 0.9) / 0.5, 0, 1);
        goalWristX = targetWristLocalX;
        goalWristY = targetWristLocalY;
        goalJawOpen = THREE.MathUtils.lerp(0.95, 0.08, p);
      } else {
        // Phase 3: Lift clamped block cleanly up!
        const p = THREE.MathUtils.clamp((tSec - 1.45) / 0.85, 0, 1);
        const ease = p * p * (3 - 2 * p);
        goalWristX = THREE.MathUtils.lerp(targetWristLocalX, 0.48, ease);
        goalWristY = THREE.MathUtils.lerp(targetWristLocalY, 0.16, ease);
        goalJawOpen = 0.08;
        if (tfOk) {
          showOnPedestal = false;
          showCarried = true;
        }
      }
    } else if (preview.day45Stage === 'place') {
      if (!powerOk || !tfOk) {
        goalRoverX = ROVER_PICK_X;
        goalWristX = 0.48;
        goalWristY = -0.25;
        goalJawOpen = 0.15;
        showOnPedestal = true;
      } else if (tSec < 1.55) {
        // Phase 1: Carry gripped block while driving smoothly to Place Zone
        const p = THREE.MathUtils.clamp(tSec / 1.55, 0, 1);
        const ease = p * p * (3 - 2 * p);
        goalRoverX = THREE.MathUtils.lerp(ROVER_PICK_X, ROVER_PLACE_X, ease);
        goalWristX = 0.48;
        goalWristY = 0.16;
        goalJawOpen = 0.08;
        showOnPedestal = false;
        showCarried = true;
      } else if (tSec < 2.35) {
        // Phase 2: Lower arm smoothly onto Basket Pad
        goalRoverX = ROVER_PLACE_X;
        const shWorldX = ROVER_PLACE_X + ARM_PEDESTAL_LOCAL[0];
        const targetWristLocalX = PLACE_WORLD_X - GRIPPER_TCP_OFFSET - shWorldX;
        const targetWristLocalY = BLOCK_REST_Y + 0.02 - ARM_WORLD_BASE_Y;
        const p = THREE.MathUtils.clamp((tSec - 1.55) / 0.8, 0, 1);
        const ease = p * p * (3 - 2 * p);
        goalWristX = THREE.MathUtils.lerp(0.48, targetWristLocalX, ease);
        goalWristY = THREE.MathUtils.lerp(0.16, targetWristLocalY, ease);
        goalJawOpen = 0.08;
        showOnPedestal = false;
        showCarried = true;
      } else if (tSec < 2.85) {
        // Phase 3: Open parallel gripper fingers to release block onto pad
        goalRoverX = ROVER_PLACE_X;
        const shWorldX = ROVER_PLACE_X + ARM_PEDESTAL_LOCAL[0];
        const targetWristLocalX = PLACE_WORLD_X - GRIPPER_TCP_OFFSET - shWorldX;
        const targetWristLocalY = BLOCK_REST_Y + 0.02 - ARM_WORLD_BASE_Y;
        const p = THREE.MathUtils.clamp((tSec - 2.35) / 0.45, 0, 1);
        goalWristX = targetWristLocalX;
        goalWristY = targetWristLocalY;
        goalJawOpen = THREE.MathUtils.lerp(0.08, 0.95, p);
        showOnPedestal = false;
        showDropped = true;
      } else {
        // Phase 4: Retract gripper slightly upward clear of docked block
        goalRoverX = ROVER_PLACE_X;
        const shWorldX = ROVER_PLACE_X + ARM_PEDESTAL_LOCAL[0];
        const targetWristLocalX = PLACE_WORLD_X - GRIPPER_TCP_OFFSET - shWorldX;
        const targetWristLocalY = BLOCK_REST_Y + 0.02 - ARM_WORLD_BASE_Y;
        const p = THREE.MathUtils.clamp((tSec - 2.85) / 0.65, 0, 1);
        const ease = p * p * (3 - 2 * p);
        goalWristX = THREE.MathUtils.lerp(targetWristLocalX, 0.45, ease);
        goalWristY = THREE.MathUtils.lerp(targetWristLocalY, 0.22, ease);
        goalJawOpen = 0.95;
        showOnPedestal = false;
        showDropped = true;
      }
    }

    // Physical wheel rotation tied strictly to chassis displacement dx / R!
    const prevX = poseRef.current.roverX;
    const nextX = THREE.MathUtils.lerp(prevX, goalRoverX, Math.min(1, dt * 8.5));
    const dxMoved = nextX - prevX;
    poseRef.current.roverX = nextX;

    poseRef.current.wristLocalX = THREE.MathUtils.lerp(
      poseRef.current.wristLocalX,
      goalWristX,
      Math.min(1, dt * 10),
    );
    poseRef.current.wristLocalY = THREE.MathUtils.lerp(
      poseRef.current.wristLocalY,
      goalWristY,
      Math.min(1, dt * 10),
    );
    poseRef.current.jawOpen = THREE.MathUtils.lerp(
      poseRef.current.jawOpen,
      goalJawOpen,
      Math.min(1, dt * 12),
    );

    if (roverGroupRef.current) {
      roverGroupRef.current.position.x = nextX;
      roverGroupRef.current.position.z = 0;
      roverGroupRef.current.rotation.y = 0;
    }

    const dWheelTheta = dxMoved / WHEEL_RADIUS;
    if (leftWheelRef.current) leftWheelRef.current.rotation.z -= dWheelTheta;
    if (rightWheelRef.current) rightWheelRef.current.rotation.z -= dWheelTheta;

    // Solve analytical 2R IK & keep gripper level with +X forward!
    const { t1, t2 } = solve2RIk(poseRef.current.wristLocalX, poseRef.current.wristLocalY);
    if (shoulderGroupRef.current) shoulderGroupRef.current.rotation.z = t1;
    if (elbowGroupRef.current) elbowGroupRef.current.rotation.z = t2;
    if (wristGroupRef.current) wristGroupRef.current.rotation.z = -(t1 + t2);

    // Animate jaw gap smoothly without React re-render
    const jawZ = 0.148 + THREE.MathUtils.clamp(poseRef.current.jawOpen, 0, 1) * 0.105;
    if (jawLeftRef.current) jawLeftRef.current.position.z = -jawZ;
    if (jawRightRef.current) jawRightRef.current.position.z = jawZ;

    // Toggle block visibility cleanly across pedestal / gripper / basket
    if (tableBlockRef.current) tableBlockRef.current.visible = showOnPedestal;
    if (carriedBlockRef.current) carriedBlockRef.current.visible = showCarried;
    if (syncedFlagsRef.current.onPedestal !== showOnPedestal) {
      syncedFlagsRef.current.onPedestal = showOnPedestal;
      setBlockOnPedestal(showOnPedestal);
    }
    if (syncedFlagsRef.current.landed !== showDropped) {
      syncedFlagsRef.current.landed = showDropped;
      setBlockLanded(showDropped);
    }
    if (ghostMissRef.current) {
      ghostMissRef.current.position.y = BLOCK_REST_Y + Math.sin(state.clock.elapsedTime * 3) * 0.015;
    }
  });

  const hotspots: HotspotInfo[] =
    moduleId === 'day16_rover_project'
      ? [
          {
            id: 'rover_esp',
            label: 'ESP32 두뇌',
            title: 'ESP32 무선 수신기 + Failsafe',
            desc: 'ESP-NOW 패킷을 50Hz로 수신하며, 500ms 이상 신호 두절 시 즉시 모터를 정지시킵니다.',
            pos: [0.48, 1.02, 0],
            focusTarget: [0.45, 0.65, 0],
            focusZoom: 112,
            color: '#635BFF',
          },
          {
            id: 'rover_buck',
            label: '5V 벅 컨버터',
            title: 'LM2596 5V 전원 분리 모듈',
            desc: '모터 돌입 전류가 ESP32 전원을 흔들지 못하도록 로직 5V 레일을 분리합니다.',
            pos: [-0.08, 0.92, 0.48],
            focusTarget: [-0.08, 0.6, 0.4],
            focusZoom: 120,
            color: '#10B981',
          },
          {
            id: 'rover_driver',
            label: 'TB6612 / L298N',
            title: '듀얼 H-브리지 모터 드라이버',
            desc: 'ESP32의 약한 PWM 신호로 좌우 TT DC 모터를 7.4V 고전류 정·역회전 구동합니다.',
            pos: [-0.48, 0.92, -0.45],
            focusTarget: [-0.45, 0.6, -0.4],
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
              pos: [0.76, 1.12, 0.35],
              focusTarget: [0.6, 0.6, 0],
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
              pos: [0.95, 1.05, 0.72],
              focusTarget: [0.45, 0.75, 0.15],
              focusZoom: 105,
              color: '#0EA5E9',
            },
            {
              id: 'cap_arm',
              label: '2R IK + 평행 집게',
              title: '2축 역기구학 + 수평 2-Jaw 그리퍼',
              desc: '목표 블록 좌표까지 2축 역기구학(IK)으로 손목을 수평 접근시킨 뒤 평행 집게로 파지해 바구니에 안착시킵니다.',
              pos: [0.22, 1.72, -0.18],
              focusTarget: [0.1, 0.75, 0],
              focusZoom: 95,
              color: '#635BFF',
            },
          ];

  const day45TargetFloorPts = useMemo(
    () => [
      new THREE.Vector3(-2.1, 0.015, 0),
      new THREE.Vector3(2.4, 0.015, 0),
    ],
    [],
  );

  const day34CorridorPts = useMemo(
    () => [
      new THREE.Vector3(-2.2, 0.015, 0),
      new THREE.Vector3(2.2, 0.015, 0),
    ],
    [],
  );

  return (
    <group>
      {/* Floor Reference Guides */}
      {moduleId === 'day34_fusion_project' && (
        <group>
          <Line
            points={day34CorridorPts}
            color="#10B981"
            lineWidth={2.5}
            dashed
            dashSize={0.18}
            gapSize={0.12}
          />
          {/* Lane Side Rails */}
          <Line
            points={[new THREE.Vector3(-2.2, 0.012, -0.58), new THREE.Vector3(2.2, 0.012, -0.58)]}
            color="#CBD5E1"
            lineWidth={1.2}
          />
          <Line
            points={[new THREE.Vector3(-2.2, 0.012, 0.58), new THREE.Vector3(2.2, 0.012, 0.58)]}
            color="#CBD5E1"
            lineWidth={1.2}
          />
        </group>
      )}

      {moduleId === 'day45_capstone' && (
        <group>
          {/* Planned A* Floor Track */}
          <Line
            points={day45TargetFloorPts}
            color="#635BFF"
            lineWidth={2}
            dashed
            dashSize={0.16}
            gapSize={0.1}
          />
          {/* Pickup Pedestal Stand */}
          <group position={[PICKUP_WORLD_X, 0.05, 0]}>
            <mesh receiveShadow castShadow>
              <boxGeometry args={[0.48, 0.1, 0.48]} />
              <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.16, 0.2, 24]} />
              <meshBasicMaterial color="#F59E0B" transparent opacity={0.6} />
            </mesh>
          </group>

          {/* ArUco Block resting on Pickup Pedestal */}
          <group ref={tableBlockRef} position={[PICKUP_WORLD_X, BLOCK_REST_Y, 0]}>
            <ArucoBlock3D
              size={BLOCK_SIZE}
              tint="#F59E0B"
              statusBadge={blockOnPedestal ? 'ArUco #17' : undefined}
            />
          </group>

          {/* Ghost Offset Error Block when TF2 is NOT calibrated */}
          {!preview.day45TfVerified &&
            (preview.day45Stage === 'vision' || preview.day45Stage === 'pick') && (
              <group ref={ghostMissRef} position={[PICKUP_WORLD_X + 0.36, BLOCK_REST_Y, 0]}>
                <mesh>
                  <boxGeometry args={[BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE]} />
                  <meshBasicMaterial color="#EF4444" wireframe transparent opacity={0.75} />
                </mesh>
                <Html position={[0.14, 0.42, 0]} center zIndexRange={[10, 0]}>
                  <span className="pointer-events-none whitespace-nowrap rounded border border-rose-300 bg-rose-50/95 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-rose-700">
                    TF 오차 착시 좌표!
                  </span>
                </Html>
              </group>
            )}

          {/* Destination Place Basket Zone */}
          <group position={[PLACE_WORLD_X, 0.04, 0]}>
            <mesh receiveShadow>
              <boxGeometry args={[0.66, 0.08, 0.66]} />
              <meshStandardMaterial color="#EEF2FF" roughness={0.6} />
            </mesh>
            {/* Raised Basket Rim Walls */}
            {[
              { pos: [0, 0.05, 0.31] as [number, number, number], size: [0.66, 0.06, 0.04] as [number, number, number] },
              { pos: [0, 0.05, -0.31] as [number, number, number], size: [0.66, 0.06, 0.04] as [number, number, number] },
              { pos: [0.31, 0.05, 0] as [number, number, number], size: [0.04, 0.06, 0.6] as [number, number, number] },
              { pos: [-0.31, 0.05, 0] as [number, number, number], size: [0.04, 0.06, 0.6] as [number, number, number] },
            ].map((wall, idx) => (
              <mesh key={idx} position={wall.pos}>
                <boxGeometry args={wall.size} />
                <meshStandardMaterial color="#635BFF" roughness={0.35} />
              </mesh>
            ))}
            <Html position={[0, 0.14, 0.48]} center zIndexRange={[10, 0]}>
              <span className="pointer-events-none whitespace-nowrap rounded border border-indigo-200 bg-white/95 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#4338CA]">
                목표 바구니
              </span>
            </Html>
          </group>

          {/* Docked Green/ArUco Block inside Place Basket (ONLY rendered once actually landed!) */}
          {blockLanded && (
            <group position={[PLACE_WORLD_X, 0.08 + BLOCK_SIZE * 0.5, 0]}>
              <ArucoBlock3D size={BLOCK_SIZE} tint="#10B981" statusBadge="✓ 안착 완료" />
            </group>
          )}
        </group>
      )}

      {/* ---------------- MOVING 2WD ROVER ASSEMBLY ---------------- */}
      <group
        ref={roverGroupRef}
        position={[moduleId === 'day45_capstone' ? ROVER_NAV_START_X : 0, DECK_BASE_Y, 0]}
      >
        {/* Lower Motor Chassis Plate */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.05, 0.09, 1.38]} />
          <meshStandardMaterial color="#1E293B" roughness={0.45} metalness={0.45} />
        </mesh>

        {/* 4 Brass Hex Standoffs Supporting Upper Electronics Deck */}
        {[
          [-0.85, 0.12, -0.55],
          [-0.85, 0.12, 0.55],
          [0.75, 0.12, -0.55],
          [0.75, 0.12, 0.55],
        ].map((pos, idx) => (
          <mesh key={idx} position={pos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.22, 6]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.25} />
          </mesh>
        ))}

        {/* Upper Dark Anodized Electronics Deck */}
        <mesh position={[-0.04, 0.24, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.07, 1.32]} />
          <meshStandardMaterial color="#0F172A" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Front Steel Ball Caster + Bracket (Touches Floor at y = -0.40) */}
        <group position={[0.82, -0.14, 0]}>
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.16, 0.14, 0.14, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[0, -0.12, 0]} castShadow>
            <sphereGeometry args={[0.14, 18, 18]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.15} />
          </mesh>
        </group>

        {/* Left (-Z) & Right (+Z) Detailed Geared TT Motors + Treaded Wheels */}
        <DetailedWheel3D
          wheelRef={leftWheelRef}
          position={[-0.42, 0, -0.84]}
          side={-1}
          radius={WHEEL_RADIUS}
          rimColor={moduleId === 'day34_fusion_project' && !preview.day34EncoderPid ? '#F59E0B' : '#38BDF8'}
        />
        <DetailedWheel3D
          wheelRef={rightWheelRef}
          position={[-0.42, 0, 0.84]}
          side={1}
          radius={WHEEL_RADIUS}
          rimColor={moduleId === 'day34_fusion_project' && !preview.day34EncoderPid ? '#EF4444' : '#38BDF8'}
        />

        {/* On-Deck Electronics */}
        <group position={[-0.52, 0.4, 0.32]} scale={[0.64, 0.64, 0.64]}>
          <LipoBattery3D position={[0, 0, 0]} />
        </group>

        {/* Red TB6612 / L298N Motor Driver with Heatsink Fins */}
        <group position={[-0.55, 0.32, -0.34]}>
          <mesh castShadow>
            <boxGeometry args={[0.52, 0.08, 0.52]} />
            <meshStandardMaterial color="#B91C1C" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.09, 0]} castShadow>
            <boxGeometry args={[0.24, 0.12, 0.24]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.85} roughness={0.25} />
          </mesh>
        </group>

        {/* LM2596 5V Buck Converter Module */}
        <group position={[-0.08, 0.32, 0.44]}>
          <mesh castShadow>
            <boxGeometry args={[0.42, 0.08, 0.26]} />
            <meshStandardMaterial
              color={
                (moduleId === 'day16_rover_project' && !preview.day16BuckSeparated) ||
                (moduleId === 'day45_capstone' && !preview.day45PowerSeparated)
                  ? '#EF4444'
                  : '#0EA5E9'
              }
              emissive={
                (moduleId === 'day16_rover_project' && !preview.day16BuckSeparated) ||
                (moduleId === 'day45_capstone' && !preview.day45PowerSeparated)
                  ? '#EF4444'
                  : '#000000'
              }
              emissiveIntensity={0.45}
              roughness={0.35}
            />
          </mesh>
          {/* Toroid Inductor Cylinder */}
          <mesh position={[0.08, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.055, 0.025, 10, 18]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>

        {/* Onboard ESP32 Brain */}
        <group position={[0.12, 0.32, -0.18]} scale={[0.4, 0.4, 0.4]} rotation={[0, Math.PI / 2, 0]}>
          <Esp32Hardware3D
            exploded={false}
            wifiActive={moduleId === 'day16_rover_project'}
            sketchRunning={sketchRunning}
            activeHotspotId={null}
            onSelectHotspot={() => {}}
            showHotspots={false}
          />
        </group>

        {/* Crisp Curved Deck Jumper Harnesses */}
        <JumperWire3D start={[-0.32, 0.36, -0.32]} end={[-0.02, 0.36, -0.18]} color="#F59E0B" arcHeight={0.22} />
        <JumperWire3D start={[-0.08, 0.36, 0.38]} end={[0.12, 0.36, 0.02]} color="#10B981" arcHeight={0.22} />

        {/* Day 34 MPU-6050 IMU Breakout Board + Coordinate Triad */}
        {moduleId === 'day34_fusion_project' && (
          <group position={[0.68, 0.31, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.3, 0.06, 0.24]} />
              <meshStandardMaterial color="#2563EB" roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[0.1, 0.03, 0.1]} />
              <meshStandardMaterial color="#0F172A" />
            </mesh>
            <AxisTriad3D position={[0, 0.08, 0]} scale={0.35} label="IMU (θ)" />
          </group>
        )}

        {/* Day 45 Capstone: USB Vision Camera + Articulated 2R IK Arm + True 2-Jaw Parallel Gripper */}
        {moduleId === 'day45_capstone' && (
          <>
            {/* Front USB Camera on Mast Bracket + Optional Vision FOV & TF2 Triads */}
            <UsbCamera3D
              position={[0.84, 0.38, 0.34]}
              rotation={[0, 0, -0.18]}
              showFov={preview.day45Stage === 'vision' || preview.day45Stage === 'pick'}
              fovLength={1.65}
              fovColor={preview.day45TfVerified ? '#0EA5E9' : '#EF4444'}
            />
            {preview.day45Stage === 'vision' && (
              <>
                <AxisTriad3D position={[0.84, 0.45, 0.46]} scale={0.28} label="camera_link" />
                <AxisTriad3D position={[ARM_PEDESTAL_LOCAL[0], 0.36, -0.45]} scale={0.28} label="arm_base" />
              </>
            )}

            {/* 2-DOF + Level-Wrist Manipulator Pedestal */}
            <group position={[ARM_PEDESTAL_LOCAL[0], 0.28, 0]}>
              {/* Base Turret Flange */}
              <mesh position={[0, 0.08, 0]} castShadow>
                <cylinderGeometry args={[0.18, 0.23, 0.16, 24]} />
                <meshStandardMaterial color="#334155" metalness={0.55} roughness={0.32} />
              </mesh>
              {/* Shoulder Pivot Bracket & MG996 Servo */}
              <ServoMotor3D position={[0, 0.18, 0]} scale={1.15} color="#1E293B" />

              {/* JOINT 1 (Shoulder Pivot at local y = 0.18 => total ARM_PEDESTAL_LOCAL) */}
              <group ref={shoulderGroupRef} position={[0, 0.18, 0]}>
                {/* Machined Shoulder Joint Hub */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.1, 0.1, 0.2, 18]} />
                  <meshStandardMaterial color="#635BFF" metalness={0.5} roughness={0.3} />
                </mesh>

                {/* Link 1 Twin-Rail Struts along +X (length L1 = 0.78) */}
                {[-0.065, 0.065].map((lz, idx) => (
                  <mesh key={idx} position={[L1 * 0.5, 0, lz]} castShadow>
                    <boxGeometry args={[L1, 0.09, 0.028]} />
                    <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.26} />
                  </mesh>
                ))}
                {/* Cross-Brace Spacer */}
                <mesh position={[L1 * 0.5, 0, 0]}>
                  <boxGeometry args={[L1 * 0.45, 0.05, 0.1]} />
                  <meshStandardMaterial color="#94A3B8" metalness={0.75} roughness={0.25} />
                </mesh>

                {/* JOINT 2 (Elbow Pivot at [L1, 0, 0]) */}
                <group ref={elbowGroupRef} position={[L1, 0, 0]}>
                  <ServoMotor3D position={[0, 0, 0]} scale={0.95} color="#0F172A" />
                  <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.085, 0.085, 0.19, 18]} />
                    <meshStandardMaterial color="#10B981" metalness={0.5} roughness={0.3} />
                  </mesh>

                  {/* Link 2 Forearm Beam along +X (length L2 = 0.68) */}
                  {[-0.05, 0.05].map((lz, idx) => (
                    <mesh key={idx} position={[L2 * 0.5, 0, lz]} castShadow>
                      <boxGeometry args={[L2, 0.075, 0.025]} />
                      <meshStandardMaterial color="#64748B" metalness={0.7} roughness={0.25} />
                    </mesh>
                  ))}

                  {/* JOINT 3 (Leveling Wrist + Actuated 2-Jaw Parallel Gripper at [L2, 0, 0]) */}
                  <group ref={wristGroupRef} position={[L2, 0, 0]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                      <cylinderGeometry args={[0.068, 0.068, 0.16, 16]} />
                      <meshStandardMaterial color="#38BDF8" metalness={0.5} roughness={0.3} />
                    </mesh>

                    <ParallelGripper3D
                      jawLeftRef={jawLeftRef}
                      jawRightRef={jawRightRef}
                      activeColor={preview.day45TfVerified ? '#635BFF' : '#EF4444'}
                    >
                      {/* Carried ArUco Block Clamped Between Parallel Jaws at TCP (x = +0.25) */}
                      <group ref={carriedBlockRef} position={[GRIPPER_TCP_OFFSET, 0, 0]} visible={false}>
                        <ArucoBlock3D size={BLOCK_SIZE} tint="#F59E0B" />
                      </group>
                    </ParallelGripper3D>
                  </group>
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
    </group>
  );
}
