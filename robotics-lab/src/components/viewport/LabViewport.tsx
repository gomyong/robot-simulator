import { ContactShadows, Grid, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Compass, Cpu, Grid3X3, Layers, RotateCcw, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CameraPreset, LabPreviewState, ModuleId } from '../../types/lab';
import { HardwareWorkbench } from '../hardware/HardwareWorkbench';
import { ActuatorDrive3D } from './models/ActuatorDrive3D';
import { ArmProject3D } from './models/ArmProject3D';
import { AutonomySlam3D } from './models/AutonomySlam3D';
import { BreadboardCircuit3D } from './models/BreadboardCircuit3D';
import {
  ESP32_HOTSPOTS,
  Esp32Hardware3D,
} from './models/Esp32Hardware3D';
import { HotspotInfo } from './models/HardwareParts3D';
import { PidServoRig3D } from './models/PidServoRig3D';
import { PlanarArm3D } from './models/PlanarArm3D';
import { RotationGimbal3D } from './models/RotationGimbal3D';
import { RoverChassis3D } from './models/RoverChassis3D';
import { UltrasonicRig3D } from './models/UltrasonicRig3D';
import { SchematicPipOverlay } from './SchematicPipOverlay';

interface LabViewportProps {
  activeModuleId: ModuleId;
  preview: LabPreviewState;
  onChangePreview: (patch: Partial<LabPreviewState>) => void;
  selectedPinId: string | null;
  onSelectPin: (pinId: string) => void;
  onToggleExploded: () => void;
  sketchRunning?: boolean;
}

const PRESET_VIEWS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [8, 8, 8], target: [0, 0.35, 0] },
  front: { pos: [0, 1.5, 11], target: [0, 0.55, 0] },
  top: { pos: [0, 12, 0.01], target: [0, 0.25, 0] },
  reset: { pos: [8, 8, 8], target: [0, 0.35, 0] },
};

const HARDWARE_MODULES = new Set<ModuleId>([
  'day03_digital',
  'day04_adc_pwm',
  'day06_power',
  'day10_nonblocking',
  'day11_fsm',
  'day12_comms',
  'day13_actuators',
  'day15_rtos_wireless',
  'day17_math',
  'day19_cad_tolerance',
  'day23_jacobian',
  'day24_dynamics',
  'day28_imu',
  'day29_sensor_fusion',
  'day31_pid_advanced',
  'day32_trajectory',
  'day33_kalman',
  'day35_python_bridge',
  'day36_path_planning',
  'day37_ros2_arch',
  'day39_vision',
  'day43_pcb_design',
  'day44_debugging',
]);

type SpatialModuleId =
  | 'day01_basics'
  | 'day02_breadboard'
  | 'day05_divider'
  | 'day07_project'
  | 'day08_board'
  | 'esp32'
  | 'day14_hbridge'
  | 'day16_rover_project'
  | 'day18_rotation3d'
  | 'day20_mobile_kinematics'
  | 'kinematics'
  | 'day25_arm_project'
  | 'ultrasonic'
  | 'day27_encoder_odom'
  | 'pid'
  | 'day34_fusion_project'
  | 'day38_tf2_urdf'
  | 'day40_mcl_particle'
  | 'day41_slam_grid'
  | 'day42_maze_project'
  | 'day45_capstone';

const MODULE_DEFAULT_ZOOM: Record<SpatialModuleId, number> = {
  day01_basics: 74,
  day02_breadboard: 82,
  day05_divider: 66,
  day07_project: 64,
  day08_board: 88,
  esp32: 88,
  day14_hbridge: 76,
  day16_rover_project: 74,
  day18_rotation3d: 82,
  day20_mobile_kinematics: 76,
  kinematics: 58,
  day25_arm_project: 58,
  ultrasonic: 76,
  day27_encoder_odom: 82,
  pid: 92,
  day34_fusion_project: 74,
  day38_tf2_urdf: 72,
  day40_mcl_particle: 64,
  day41_slam_grid: 68,
  day42_maze_project: 64,
  day45_capstone: 66,
};

function CameraRig({
  preset,
  presetTrigger,
  targetZoom,
  focusGoal,
}: {
  preset: CameraPreset;
  presetTrigger: number;
  targetZoom: number;
  focusGoal: { target: [number, number, number]; zoom: number; seq: number } | null;
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const animatingRef = useRef(false);
  const desiredPos = useRef(new THREE.Vector3(...PRESET_VIEWS.iso.pos));
  const desiredTarget = useRef(new THREE.Vector3(...PRESET_VIEWS.iso.target));
  const desiredZoom = useRef(targetZoom);

  useEffect(() => {
    const view = PRESET_VIEWS[preset];
    desiredPos.current.set(...view.pos);
    desiredTarget.current.set(...view.target);
    desiredZoom.current = targetZoom;
    animatingRef.current = true;
  }, [preset, presetTrigger, targetZoom]);

  useEffect(() => {
    if (!focusGoal) return;
    const [tx, ty, tz] = focusGoal.target;
    desiredTarget.current.set(tx, ty, tz);
    desiredPos.current.set(tx + 4.5, ty + 5.2, tz + 4.5);
    desiredZoom.current = focusGoal.zoom;
    animatingRef.current = true;
  }, [focusGoal]);

  useFrame(() => {
    if (!animatingRef.current || !controlsRef.current) return;
    camera.position.lerp(desiredPos.current, 0.14);
    controlsRef.current.target.lerp(desiredTarget.current, 0.14);
    camera.zoom = THREE.MathUtils.lerp(camera.zoom, desiredZoom.current, 0.14);
    camera.updateProjectionMatrix();
    controlsRef.current.update();

    if (
      camera.position.distanceTo(desiredPos.current) < 0.04 &&
      controlsRef.current.target.distanceTo(desiredTarget.current) < 0.04 &&
      Math.abs(camera.zoom - desiredZoom.current) < 0.3
    ) {
      animatingRef.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.85}
      zoomSpeed={0.9}
      panSpeed={0.75}
      minZoom={36}
      maxZoom={185}
      maxPolarAngle={Math.PI / 2 - 0.04}
      onStart={() => {
        animatingRef.current = false;
      }}
    />
  );
}

export function LabViewport({
  activeModuleId,
  preview,
  onChangePreview,
  selectedPinId,
  onSelectPin,
  onToggleExploded,
  sketchRunning = false,
}: LabViewportProps) {
  const [preset, setPreset] = useState<CameraPreset>('iso');
  const [presetTrigger, setPresetTrigger] = useState(0);
  const [replaySeq, setReplaySeq] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [showSchematicPip, setShowSchematicPip] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<HotspotInfo | null>(null);
  const [focusGoal, setFocusGoal] = useState<{
    target: [number, number, number];
    zoom: number;
    seq: number;
  } | null>(null);

  const triggerPreset = (next: CameraPreset) => {
    setFocusGoal(null);
    setActiveHotspot(null);
    setPreset(next);
    setPresetTrigger((n) => n + 1);
  };

  useEffect(() => {
    triggerPreset('iso');
  }, [activeModuleId]);

  const handleSelectHotspot = (spot: HotspotInfo) => {
    setActiveHotspot(spot);
    setFocusGoal((prev) => ({
      target: spot.focusTarget,
      zoom: spot.focusZoom,
      seq: (prev?.seq ?? 0) + 1,
    }));
    if (activeModuleId === 'day08_board') {
      const partMap: Record<string, LabPreviewState['day08FocusPart']> = {
        wroom: 'wroom',
        antenna: 'wroom',
        cp2102: 'cp2102',
        ams1117: 'ams1117',
        buttons: 'buttons',
        led: 'pins',
        pins: 'pins',
      };
      const mapped = partMap[spot.id];
      if (mapped) onChangePreview({ day08FocusPart: mapped });
    }
  };

  // Use Wokwi/Fritzing-grade Realistic Interactive Hardware Bench for Waveform/Logic/Grid Labs
  if (HARDWARE_MODULES.has(activeModuleId)) {
    return (
      <HardwareWorkbench
        activeModuleId={activeModuleId}
        preview={preview}
        onChangePreview={onChangePreview}
        selectedPinId={selectedPinId}
        onSelectPin={onSelectPin}
        onToggleExploded={onToggleExploded}
      />
    );
  }

  const spatialId = activeModuleId as SpatialModuleId;
  const moduleBadgeLabel: Record<SpatialModuleId, string> = {
    day01_basics: 'Day 01 · 로봇 3요소 & LED 안전 회로 3D',
    day02_breadboard: 'Day 02 · MB-102 브레드보드 내부 구리 레일 X-Ray 3D',
    day05_divider: 'Day 05 · HC-SR04 5V → ESP32 3.3V 분압 회로 3D',
    day07_project: 'Day 07 · 스마트 위험 감지기 통합 브레드보드 3D',
    day08_board: 'Day 08 · ESP32 DevKit V1 실물 3D 해부 & 핫스팟',
    esp32: 'Day 09 · ESP32 30-Pin 3D 인스펙터',
    day14_hbridge: 'Day 14 · H-브리지 MOSFET 스위칭 & DC 모터 3D',
    day16_rover_project: 'Day 16 · 2WD 무선 RC 로버 3D 조립 & 전원 분리',
    day18_rotation3d: 'Day 18 · SO(3)/SE(3) 오일러 짐벌락 & 쿼터니언 3D',
    day20_mobile_kinematics: 'Day 20 · 차동 · 애커먼 · 메카넘 이동 기구학 3D',
    kinematics: 'Day 21~22 · 2축 평면 로봇 팔 FK/IK & 평행 그리퍼 3D',
    day25_arm_project: 'Day 25 · 로봇 팔 좌표·특이점·토크 3단계 검증 3D',
    ultrasonic: 'Day 26 · HC-SR04 초음파 음파 파동 3D',
    day27_encoder_odom: 'Day 27 · 2채널 광학 엔코더 디스크 & 슬립 3D',
    pid: 'Day 30~31 · 디지털 PID 서보 & 분도기 다이얼 3D',
    day34_fusion_project: 'Day 34 · 엔코더 PID + IMU Yaw 직진 보정 로버 3D',
    day38_tf2_urdf: 'Day 38 · URDF Static TF2 오프셋 & 레이저 스캔 정합 3D',
    day40_mcl_particle: 'Day 40 · MCL 몬테카를로 파티클 필터 전역 위치 추정 3D',
    day41_slam_grid: 'Day 41 · Occupancy Grid SLAM & 루프 클로저 정합 3D',
    day42_maze_project: 'Day 42 · C-Space · A* · DWA 자율 미로 탈출 3D',
    day45_capstone: 'Day 45 · [졸업 캡스톤] 2R IK & 평행 그리퍼 픽앤플레이스 3D',
  };
  const isEsp3D = spatialId === 'day08_board' || spatialId === 'esp32';
  const isBreadboard3D =
    spatialId === 'day01_basics' ||
    spatialId === 'day02_breadboard' ||
    spatialId === 'day05_divider' ||
    spatialId === 'day07_project';
  const isActuator3D =
    spatialId === 'day14_hbridge' ||
    spatialId === 'day20_mobile_kinematics' ||
    spatialId === 'day27_encoder_odom';
  const isRover3D =
    spatialId === 'day16_rover_project' ||
    spatialId === 'day34_fusion_project' ||
    spatialId === 'day45_capstone';
  const isAutonomy3D =
    spatialId === 'day38_tf2_urdf' ||
    spatialId === 'day40_mcl_particle' ||
    spatialId === 'day41_slam_grid' ||
    spatialId === 'day42_maze_project';
  const supportsExploded =
    isEsp3D ||
    spatialId === 'day02_breadboard' ||
    spatialId === 'day05_divider' ||
    spatialId === 'day07_project' ||
    (spatialId === 'day01_basics' && preview.day01Mode === 'circuit');

  return (
    <div className="no-touch-callout relative h-full w-full overflow-hidden bg-[#F4F5F7]">
      {/* Orthographic Isometric Studio 3D Canvas for Mechanics & Control Labs */}
      <Canvas
        shadows
        orthographic
        dpr={[1, 2]}
        camera={{
          position: PRESET_VIEWS.iso.pos,
          zoom: MODULE_DEFAULT_ZOOM[spatialId],
          near: -40,
          far: 80,
        }}
        style={{ touchAction: 'none' }}
      >
        <color attach="background" args={['#F4F5F7']} />

        <ambientLight intensity={1.05} />
        <hemisphereLight args={['#FFFFFF', '#CBD5E1', 0.65]} />
        <directionalLight
          position={[8, 12, 6]}
          intensity={1.3}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={-20}
          shadow-camera-far={40}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />
        <directionalLight position={[-6, 5, -6]} intensity={0.4} color="#E0F2FE" />

        {showGrid && (
          <Grid
            position={[0, 0, 0]}
            args={[24, 24]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#E2E8F0"
            sectionSize={2}
            sectionThickness={0.9}
            sectionColor="#CBD5E1"
            fadeDistance={24}
            fadeStrength={1}
          />
        )}
        <ContactShadows
          position={[0, 0.002, 0]}
          opacity={0.18}
          scale={12}
          blur={2.4}
          far={4}
          color="#64748B"
        />

        {isBreadboard3D && (
          <BreadboardCircuit3D
            moduleId={
              spatialId as
                | 'day01_basics'
                | 'day02_breadboard'
                | 'day05_divider'
                | 'day07_project'
            }
            preview={preview}
            sketchRunning={sketchRunning}
            activeHotspotId={activeHotspot?.id ?? null}
            onSelectHotspot={handleSelectHotspot}
            onChangePreview={onChangePreview}
          />
        )}
        {isActuator3D && (
          <ActuatorDrive3D
            moduleId={
              spatialId as
                | 'day14_hbridge'
                | 'day20_mobile_kinematics'
                | 'day27_encoder_odom'
            }
            preview={preview}
            activeHotspotId={activeHotspot?.id ?? null}
            onSelectHotspot={handleSelectHotspot}
          />
        )}
        {isRover3D && (
          <RoverChassis3D
            moduleId={
              spatialId as
                | 'day16_rover_project'
                | 'day34_fusion_project'
                | 'day45_capstone'
            }
            preview={preview}
            sketchRunning={sketchRunning}
            activeHotspotId={activeHotspot?.id ?? null}
            onSelectHotspot={handleSelectHotspot}
            replaySeq={replaySeq}
          />
        )}
        {isAutonomy3D && (
          <AutonomySlam3D
            moduleId={
              spatialId as
                | 'day38_tf2_urdf'
                | 'day40_mcl_particle'
                | 'day41_slam_grid'
                | 'day42_maze_project'
            }
            preview={preview}
            activeHotspotId={activeHotspot?.id ?? null}
            onSelectHotspot={handleSelectHotspot}
          />
        )}
        {isEsp3D && (
          <Esp32Hardware3D
            exploded={preview.exploded > 0.1}
            wifiActive={preview.wifiActive}
            sketchRunning={sketchRunning}
            activeHotspotId={
              activeHotspot?.id ??
              (spatialId === 'day08_board'
                ? (ESP32_HOTSPOTS.find((h) => h.id === preview.day08FocusPart)?.id ?? null)
                : null)
            }
            onSelectHotspot={handleSelectHotspot}
            onSelectPin={onSelectPin}
          />
        )}
        {spatialId === 'day18_rotation3d' && (
          <RotationGimbal3D
            mode={preview.day18Mode}
            rollDeg={preview.day18RollDeg}
            pitchDeg={preview.day18PitchDeg}
            yawDeg={preview.day18YawDeg}
          />
        )}
        {spatialId === 'kinematics' && (
          <PlanarArm3D
            theta1Deg={preview.armTheta1Deg}
            theta2Deg={preview.armTheta2Deg}
            L1={preview.armL1}
            L2={preview.armL2}
            ikMode={preview.armIkMode}
            targetX={preview.armTargetX}
            targetY={preview.armTargetY}
          />
        )}
        {spatialId === 'day25_arm_project' && (
          <ArmProject3D
            targetX={preview.day25TargetX}
            targetY={preview.day25TargetY}
            elbowUp={preview.day25ElbowUp}
            payloadKg={preview.day25PayloadKg}
            ratedNm={preview.day25JointRatedNm}
          />
        )}
        {spatialId === 'ultrasonic' && (
          <UltrasonicRig3D
            distanceCm={preview.sonarDistanceCm}
            sweepDeg={preview.sonarSweepDeg}
          />
        )}
        {spatialId === 'pid' && (
          <PidServoRig3D
            setpointDeg={preview.pidSetpointDeg}
            kp={preview.pidKp}
            ki={preview.pidKi}
            kd={preview.pidKd}
          />
        )}

        <CameraRig
          preset={preset}
          presetTrigger={presetTrigger}
          targetZoom={MODULE_DEFAULT_ZOOM[spatialId]}
          focusGoal={focusGoal}
        />
      </Canvas>

      {/* Top Minimal HUD */}
      <div className="pointer-events-none absolute left-4 top-3.5 right-4 z-20 flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#635BFF]" />
            <span className="text-xs font-semibold tracking-tight text-[#0A2540]">
              {moduleBadgeLabel[spatialId]}
            </span>
          </div>
          <p className="mt-0.5 pl-3.5 text-[11px] text-[#697386]">
            {isEsp3D || isBreadboard3D || isRover3D || isActuator3D || isAutonomy3D
              ? '부품 핫스팟을 클릭하면 줌인되며, 드래그·회전으로 입체 배선/동작을 확인하세요'
              : '아이소메트릭 시점 · 우측/하단 직접 실습 탭에서 조작'}
          </p>
        </div>

        {spatialId === 'day01_basics' && (
          <div className="pointer-events-auto inline-flex items-center gap-0.5 rounded-lg border border-[#E6E8EC] bg-white/95 p-0.5 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => onChangePreview({ day01Mode: 'anatomy' })}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                preview.day01Mode === 'anatomy'
                  ? 'bg-[#0A2540] text-white'
                  : 'text-[#697386] hover:text-[#0A2540]'
              }`}
            >
              로봇 3요소
            </button>
            <button
              type="button"
              onClick={() => onChangePreview({ day01Mode: 'circuit' })}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                preview.day01Mode === 'circuit'
                  ? 'bg-[#0A2540] text-white'
                  : 'text-[#697386] hover:text-[#0A2540]'
              }`}
            >
              LED 회로
            </button>
          </div>
        )}

        {(isRover3D || isActuator3D || isAutonomy3D) && (() => {
          const text =
            spatialId === 'day14_hbridge'
              ? !preview.day14CommonGnd
                ? '✗ 공통 GND 단선 → 모터 불응'
                : preview.day14HbridgeMode === 'shoot_through'
                  ? '✗ 관통 단락(Q1+Q2 ON)! 과전류!'
                  : `H-Bridge: ${preview.day14HbridgeMode.toUpperCase()} · 안전 구동`
              : spatialId === 'day16_rover_project'
                ? !preview.day16BuckSeparated && preview.day16DriveCmd !== 'stop'
                  ? '✗ 벅 컨버터 미분리 → Brownout 리셋!'
                  : preview.day16SignalLostMs >= 500 && preview.day16FailsafeEnabled
                    ? `✓ Failsafe 작동 (${preview.day16SignalLostMs}ms 끊김 정지)`
                    : `주행: ${preview.day16DriveCmd.toUpperCase()} · 전원 안정`
                : spatialId === 'day20_mobile_kinematics'
                  ? `${preview.day20DriveArch.toUpperCase()} · v=${preview.day20LinearV.toFixed(1)} · ω=${preview.day20AngularW.toFixed(1)}`
                  : spatialId === 'day27_encoder_odom'
                    ? `엔코더 ${preview.day27Direction.toUpperCase()} · ${preview.day27Rpm} RPM · 슬립 ${preview.day27WheelSlipPct}%`
                    : spatialId === 'day34_fusion_project'
                      ? preview.day34EncoderPid && preview.day34ImuHeadingPid
                        ? '✓ PID + IMU Yaw 보정 → 직진 안정!'
                        : preview.day34EncoderPid
                          ? '⚠ 엔코더 PID 단독 (IMU 보정 켜기)'
                          : `✗ 개루프 (${preview.day34MotorMismatchPct}% 편차 휨!)`
                      : spatialId === 'day38_tf2_urdf'
                        ? preview.day38TfConfigured
                          ? `✓ Static TF ON (+${preview.day38CamOffsetCm}cm 정합)`
                          : `✗ Static TF 누락 → ${preview.day38CamOffsetCm}cm 벽 밀림!`
                        : spatialId === 'day40_mcl_particle'
                          ? ['0. 전역 파티클 살포', '1. 다봉 가설', '2. 위치 수렴 완료!', '3. 납치 복구 재탐색!'][
                              preview.day40MclStage
                            ]
                          : spatialId === 'day41_slam_grid'
                            ? preview.day41LoopClosure
                              ? '✓ Loop Closure ON → 지도 정합 완료'
                              : `✗ Loop Closure OFF (${preview.day41OdomDriftDeg}° 이중벽)`
                            : spatialId === 'day42_maze_project'
                              ? preview.day42ObstacleBlocked && preview.day42NavMode === 'astar_only'
                                ? '✗ 정적 A* 단독 → 장애물 충돌 정지!'
                                : preview.day42ObstacleBlocked
                                  ? '✓ SLAM+C-Space+DWA → 곡선 우회 주행!'
                                  : '✓ 자율주행 미로 탈출 정상'
                              : !preview.day45PowerSeparated
                                ? '✗ 전원 미분리 → 팔 Brownout!'
                                : !preview.day45TfVerified
                                  ? '✗ TF2 미정합 → 허공 집기 오류!'
                                  : `단계: ${preview.day45Stage.toUpperCase()} · 2R IK + 평행 그리퍼`;
          const isError = text.startsWith('✗');
          return (
            <div className="pointer-events-auto flex items-center gap-2 rounded-lg border border-[#E6E8EC] bg-white/95 px-2.5 py-1 font-mono text-[11px] font-semibold shadow-sm backdrop-blur-sm">
              <span className={isError ? 'text-rose-600' : 'text-[#0A2540]'}>{text}</span>
              {spatialId === 'day45_capstone' && (
                <button
                  type="button"
                  onClick={() => setReplaySeq((n) => n + 1)}
                  className="inline-flex items-center gap-1 rounded bg-[#EEF2FF] px-1.5 py-0.5 text-[10px] font-semibold text-[#4338CA] hover:bg-[#E0E7FF]"
                  title="현재 단계 동작 다시 재생"
                >
                  <RotateCcw className="h-2.5 w-2.5" />
                  <span>재실행</span>
                </button>
              )}
            </div>
          );
        })()}
      </div>

      {/* Floating Hotspot Inspector Card (Learn-ESP32 Style) */}
      {activeHotspot && (
        <div className="pointer-events-auto absolute left-4 top-16 z-10 w-[250px] rounded-xl border border-[#E6E8EC] bg-white/95 p-3 shadow-sm backdrop-blur-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: activeHotspot.color }}
              />
              <span className="text-xs font-semibold text-[#0A2540]">
                {activeHotspot.title}
              </span>
            </div>
            <button
              type="button"
              onClick={() => triggerPreset('iso')}
              className="rounded p-0.5 text-[#697386] hover:bg-[#F1F3F6] hover:text-[#0A2540]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-[#425466]">
            {activeHotspot.desc}
          </p>
        </div>
      )}

      {/* Floating 2D Schematic PIP Overlay (Bottom Right above Toolbar) */}
      {showSchematicPip && (
        <div className="pointer-events-none absolute bottom-14 right-4 z-10">
          <SchematicPipOverlay
            moduleId={activeModuleId}
            onClose={() => setShowSchematicPip(false)}
          />
        </div>
      )}

      {/* Bottom Camera Preset Strip */}
      <div className="pointer-events-none absolute bottom-3.5 left-4 right-4 z-20 flex items-center justify-between gap-2">
        <div className="pointer-events-auto flex items-center gap-0.5 rounded-lg border border-[#E6E8EC] bg-white/90 p-0.5 backdrop-blur-sm">
          {(
            [
              { id: 'iso', label: '아이소메트릭' },
              { id: 'front', label: '정면' },
              { id: 'top', label: '상단' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => triggerPreset(item.id)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                preset === item.id && !focusGoal
                  ? 'bg-[#0A2540] text-white'
                  : 'text-[#697386] hover:text-[#0A2540]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => triggerPreset('reset')}
            title="카메라 리셋"
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#697386] transition hover:bg-[#F1F3F6] hover:text-[#0A2540]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5">
          {supportsExploded && (
            <button
              type="button"
              onClick={onToggleExploded}
              className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-medium backdrop-blur-sm transition ${
                preview.exploded > 0.1
                  ? 'border-[#635BFF] bg-[#635BFF] text-white'
                  : 'border-[#E6E8EC] bg-white/90 text-[#0A2540]'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{isEsp3D ? '내부 투시' : '구리 레일 X-Ray'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowSchematicPip((v) => !v)}
            className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-medium backdrop-blur-sm transition ${
              showSchematicPip
                ? 'border-[#0A2540] bg-[#0A2540] text-white'
                : 'border-[#E6E8EC] bg-white/90 text-[#0A2540]'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>회로도</span>
          </button>
          <button
            type="button"
            onClick={() => setShowGrid((v) => !v)}
            className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-medium backdrop-blur-sm transition ${
              showGrid
                ? 'border-[#E6E8EC] bg-white/90 text-[#0A2540]'
                : 'border-[#E6E8EC] bg-white/60 text-[#697386]'
            }`}
          >
            <Grid3X3 className="h-3.5 w-3.5 text-[#697386]" />
            <span className="hidden sm:inline">그리드</span>
            <Compass className="h-3.5 w-3.5 text-[#697386] sm:hidden" />
          </button>
        </div>
      </div>
    </div>
  );
}
