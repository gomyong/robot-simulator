import { ContactShadows, Grid, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Compass, Grid3X3, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CameraPreset, LabPreviewState, ModuleId } from '../../types/lab';
import { HardwareWorkbench } from '../hardware/HardwareWorkbench';
import { ArmProject3D } from './models/ArmProject3D';
import { PidServoRig3D } from './models/PidServoRig3D';
import { PlanarArm3D } from './models/PlanarArm3D';
import { RotationGimbal3D } from './models/RotationGimbal3D';
import { UltrasonicRig3D } from './models/UltrasonicRig3D';

interface LabViewportProps {
  activeModuleId: ModuleId;
  preview: LabPreviewState;
  onChangePreview: (patch: Partial<LabPreviewState>) => void;
  selectedPinId: string | null;
  onSelectPin: (pinId: string) => void;
  onToggleExploded: () => void;
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
  'day01_basics',
  'day02_breadboard',
  'day03_digital',
  'day04_adc_pwm',
  'day05_divider',
  'day06_power',
  'day07_project',
  'day08_board',
  'esp32',
  'day10_nonblocking',
  'day11_fsm',
  'day12_comms',
  'day13_actuators',
  'day14_hbridge',
  'day15_rtos_wireless',
  'day16_rover_project',
  'day17_math',
  'day19_cad_tolerance',
  'day20_mobile_kinematics',
  'day23_jacobian',
  'day24_dynamics',
  'day27_encoder_odom',
  'day28_imu',
  'day29_sensor_fusion',
  'day31_pid_advanced',
  'day32_trajectory',
  'day33_kalman',
  'day34_fusion_project',
  'day35_python_bridge',
  'day36_path_planning',
  'day37_ros2_arch',
  'day38_tf2_urdf',
  'day39_vision',
  'day40_mcl_particle',
  'day41_slam_grid',
  'day42_maze_project',
  'day43_pcb_design',
  'day44_debugging',
  'day45_capstone',
]);

type SpatialModuleId =
  | 'day18_rotation3d'
  | 'kinematics'
  | 'day25_arm_project'
  | 'ultrasonic'
  | 'pid';

const MODULE_DEFAULT_ZOOM: Record<SpatialModuleId, number> = {
  day18_rotation3d: 82,
  kinematics: 58,
  day25_arm_project: 58,
  ultrasonic: 76,
  pid: 92,
};

function CameraRig({
  preset,
  presetTrigger,
  targetZoom,
}: {
  preset: CameraPreset;
  presetTrigger: number;
  targetZoom: number;
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
}: LabViewportProps) {
  const [preset, setPreset] = useState<CameraPreset>('iso');
  const [presetTrigger, setPresetTrigger] = useState(0);
  const [showGrid, setShowGrid] = useState(true);

  const triggerPreset = (next: CameraPreset) => {
    setPreset(next);
    setPresetTrigger((n) => n + 1);
  };

  useEffect(() => {
    triggerPreset('iso');
  }, [activeModuleId]);

  // Use Wokwi/Fritzing-grade Realistic Interactive Hardware Bench for Circuit & Board Labs
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
    day18_rotation3d: 'Day 18 · SO(3)/SE(3) 오일러 짐벌락 & 쿼터니언 3D',
    kinematics: 'Day 21~22 · 2축 평면 로봇 팔 FK/IK',
    day25_arm_project: 'Day 25 · 로봇 팔 좌표·특이점·토크 3단계 검증 3D',
    ultrasonic: 'Day 26 · HC-SR04 초음파 레이더',
    pid: 'Day 30~31 · 디지털 PID 서보 벤치',
  };

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
        />
      </Canvas>

      {/* Top Minimal HUD */}
      <div className="pointer-events-none absolute left-4 top-3.5 right-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#635BFF]" />
          <span className="text-xs font-semibold tracking-tight text-[#0A2540]">
            {moduleBadgeLabel[spatialId]}
          </span>
        </div>
        <p className="mt-0.5 pl-3.5 text-[11px] text-[#697386]">
          아이소메트릭 시점 · 우측/하단 직접 실습 탭에서 조작
        </p>
      </div>

      {/* Bottom Camera Preset Strip */}
      <div className="pointer-events-none absolute bottom-3.5 left-4 right-4 flex items-center justify-between gap-2">
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
                preset === item.id
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

        <button
          type="button"
          onClick={() => setShowGrid((v) => !v)}
          className={`pointer-events-auto inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-medium backdrop-blur-sm transition ${
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
  );
}
