import { ContactShadows, Grid, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Compass, Grid3X3, Layers, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CameraPreset, LabPreviewState, ModuleId } from '../../types/lab';
import { Esp32Board3D } from './models/Esp32Board3D';
import { PidServoRig3D } from './models/PidServoRig3D';
import { PlanarArm3D } from './models/PlanarArm3D';
import { UltrasonicRig3D } from './models/UltrasonicRig3D';

interface LabViewportProps {
  activeModuleId: ModuleId;
  preview: LabPreviewState;
  selectedPinId: string | null;
  onSelectPin: (pinId: string) => void;
  onToggleExploded: () => void;
}

const PRESET_VIEWS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [4.2, 3.6, 4.4], target: [0, 0.5, 0] },
  front: { pos: [0, 1.8, 5.6], target: [0, 0.7, 0] },
  top: { pos: [0, 6.2, 0.01], target: [0, 0.3, 0] },
  reset: { pos: [4.2, 3.6, 4.4], target: [0, 0.5, 0] },
};

function CameraRig({
  preset,
  presetTrigger,
}: {
  preset: CameraPreset;
  presetTrigger: number;
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const animatingRef = useRef(false);
  const desiredPos = useRef(new THREE.Vector3(...PRESET_VIEWS.iso.pos));
  const desiredTarget = useRef(new THREE.Vector3(...PRESET_VIEWS.iso.target));

  useEffect(() => {
    const view = PRESET_VIEWS[preset];
    desiredPos.current.set(...view.pos);
    desiredTarget.current.set(...view.target);
    animatingRef.current = true;
  }, [preset, presetTrigger]);

  useFrame(() => {
    if (!animatingRef.current || !controlsRef.current) return;
    camera.position.lerp(desiredPos.current, 0.12);
    controlsRef.current.target.lerp(desiredTarget.current, 0.12);
    controlsRef.current.update();

    if (
      camera.position.distanceTo(desiredPos.current) < 0.03 &&
      controlsRef.current.target.distanceTo(desiredTarget.current) < 0.03
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
      minDistance={2.2}
      maxDistance={12}
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

  const moduleBadgeLabel: Record<ModuleId, string> = {
    esp32: 'ESP32 DevKit V1 (30-Pin) · 3D 인터랙티브 분해 뷰',
    kinematics: '2축 평면 로봇 팔 (Planar 2R) · FK/IK 작업공간',
    ultrasonic: 'HC-SR04 초음파 레이더 · 40kHz 15° 빔 콘',
    pid: '디지털 PID 서보 벤치 · 폐루프 감쇠 시뮬레이션',
  };

  return (
    <div className="no-touch-callout relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_50%_30%,#131E32_0%,#0B0F17_72%)]">
      {/* 3D Canvas (touch-action: none essential for iPad Safari orbit/pinch) */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: PRESET_VIEWS.iso.pos, fov: 42, near: 0.1, far: 100 }}
        style={{ touchAction: 'none' }}
      >
        <color attach="background" args={['#0B0F17']} />
        <fog attach="fog" args={['#0B0F17', 11, 24]} />

        {/* Studio Three-Point Lighting */}
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.4}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={1}
          shadow-camera-far={20}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
        />
        <directionalLight position={[-5, 4, -4]} intensity={0.65} color="#38BDF8" />
        <pointLight position={[0, 3.5, 2]} intensity={0.45} color="#E2E8F0" />

        {/* Engineering Workbench Grid & Shadows */}
        {showGrid && (
          <Grid
            position={[0, 0, 0]}
            args={[20, 20]}
            cellSize={0.5}
            cellThickness={0.6}
            cellColor="#1E293B"
            sectionSize={2}
            sectionThickness={1.1}
            sectionColor="#334155"
            fadeDistance={16}
            fadeStrength={1.2}
          />
        )}
        <ContactShadows
          position={[0, 0.002, 0]}
          opacity={0.48}
          scale={12}
          blur={2.2}
          far={4}
          color="#020617"
        />

        {/* Active 3D Assembly */}
        {activeModuleId === 'esp32' && (
          <Esp32Board3D
            exploded={preview.exploded}
            wifiActive={preview.wifiActive}
            selectedPinId={selectedPinId}
            onSelectPin={onSelectPin}
          />
        )}
        {activeModuleId === 'kinematics' && (
          <PlanarArm3D
            theta1Deg={preview.armTheta1Deg}
            theta2Deg={preview.armTheta2Deg}
            L1={preview.armL1}
            L2={preview.armL2}
          />
        )}
        {activeModuleId === 'ultrasonic' && (
          <UltrasonicRig3D
            distanceCm={preview.sonarDistanceCm}
            sweepDeg={preview.sonarSweepDeg}
          />
        )}
        {activeModuleId === 'pid' && (
          <PidServoRig3D
            setpointDeg={preview.pidSetpointDeg}
            kp={preview.pidKp}
            ki={preview.pidKi}
            kd={preview.pidKd}
          />
        )}

        <CameraRig preset={preset} presetTrigger={presetTrigger} />
      </Canvas>

      {/* Top Left HUD Overlay */}
      <div className="pointer-events-none absolute left-3 top-3 right-3 flex flex-wrap items-start justify-between gap-2">
        <div className="rounded-xl border border-slate-800/90 bg-slate-950/75 px-3 py-2 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38BDF8]" />
            <span className="text-xs font-semibold tracking-tight text-slate-100">
              {moduleBadgeLabel[activeModuleId]}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400">
            {activeModuleId === 'esp32'
              ? '3D 핀을 탭해 스펙 확인 · 1손가락 회전 · 2손가락 줌'
              : '1손가락 회전 · 2손가락 핀치 줌 · 우측/하단 시뮬레이터 탭에서 조작'}
          </p>
        </div>

        {/* Quick Explode Button on ESP32 */}
        {activeModuleId === 'esp32' && (
          <button
            type="button"
            onClick={onToggleExploded}
            className={`pointer-events-auto flex min-h-[44px] items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition backdrop-blur-md ${
              preview.exploded > 0.1
                ? 'border-sky-400/60 bg-sky-500/20 text-sky-200'
                : 'border-slate-700/80 bg-slate-950/75 text-slate-300 hover:border-slate-600'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>{preview.exploded > 0.1 ? '조립하기' : '분해 보기'}</span>
          </button>
        )}
      </div>

      {/* Bottom Camera Preset Bar (44px iPad Touch Targets) */}
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
        <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-slate-800/90 bg-slate-950/80 p-1 backdrop-blur-md">
          {(
            [
              { id: 'iso', label: '등각' },
              { id: 'front', label: '정면' },
              { id: 'top', label: '상단' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => triggerPreset(item.id)}
              className={`min-h-[38px] rounded-lg px-3 text-xs font-medium transition ${
                preset === item.id
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 border border-transparent'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => triggerPreset('reset')}
            title="카메라 리셋"
            className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800/80 hover:text-slate-200"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowGrid((v) => !v)}
          className={`pointer-events-auto flex min-h-[42px] items-center gap-1.5 rounded-xl border px-3 text-xs font-medium backdrop-blur-md transition ${
            showGrid
              ? 'border-slate-700 bg-slate-950/80 text-slate-200'
              : 'border-slate-800 bg-slate-950/60 text-slate-500'
          }`}
        >
          <Grid3X3 className="h-4 w-4 text-sky-400" />
          <span className="hidden sm:inline">그리드</span>
          <Compass className="h-3.5 w-3.5 text-slate-500 sm:hidden" />
        </button>
      </div>
    </div>
  );
}
