import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { LabPreviewState } from '../../../types/lab';
import {
  AxisTriad3D,
  DetailedWheel3D,
  HotspotChips3D,
  HotspotInfo,
} from './HardwareParts3D';

interface AutonomySlam3DProps {
  moduleId:
    | 'day38_tf2_urdf'
    | 'day40_mcl_particle'
    | 'day41_slam_grid'
    | 'day42_maze_project';
  preview: LabPreviewState;
  activeHotspotId: string | null;
  onSelectHotspot: (spot: HotspotInfo) => void;
}

/** Compact stylized mini rover used inside arena/SLAM/TF2 scenes */
function ArenaRover3D({
  position = [0, 0.25, 0],
  rotationY = 0,
  tint = '#1E293B',
  lidarSpin = true,
  lidarOffsetX = 0.25,
  showTriads = false,
}: {
  position?: [number, number, number];
  rotationY?: number;
  tint?: string;
  lidarSpin?: boolean;
  lidarOffsetX?: number;
  showTriads?: boolean;
}) {
  const turretRef = useRef<THREE.Mesh>(null);
  const wLRef = useRef<THREE.Group>(null);
  const wRRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (lidarSpin && turretRef.current) {
      turretRef.current.rotation.y += delta * 7.5;
    }
    if (wLRef.current) wLRef.current.rotation.z -= delta * 3.5;
    if (wRRef.current) wRRef.current.rotation.z -= delta * 3.5;
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Main Chassis */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.16, 0.78]} />
        <meshStandardMaterial color={tint} metalness={0.45} roughness={0.38} />
      </mesh>
      {/* Side Detailed Wheels */}
      <group scale={[0.55, 0.55, 0.55]}>
        <DetailedWheel3D
          wheelRef={wLRef}
          position={[-0.35, -0.04, -0.82]}
          side={-1}
          radius={0.38}
          showMotorAndEncoder={false}
        />
        <DetailedWheel3D
          wheelRef={wRRef}
          position={[-0.35, -0.04, 0.82]}
          side={1}
          radius={0.38}
          showMotorAndEncoder={false}
        />
      </group>
      {/* Spinning 360° 2D LiDAR Turret shifted along +X */}
      <group position={[lidarOffsetX, 0.16, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.18, 0.08, 20]} />
          <meshStandardMaterial color="#0F172A" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh ref={turretRef} position={[0, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.07, 20]} />
          <meshStandardMaterial color="#0EA5E9" metalness={0.6} roughness={0.25} />
        </mesh>
      </group>

      {showTriads && (
        <>
          <AxisTriad3D position={[0, 0.12, 0]} scale={0.35} label="base_link" />
          <AxisTriad3D position={[lidarOffsetX, 0.3, 0]} scale={0.32} label="laser_link" />
        </>
      )}
    </group>
  );
}

export function AutonomySlam3D({
  moduleId,
  preview,
  activeHotspotId,
  onSelectHotspot,
}: AutonomySlam3DProps) {
  const mclRoverRef = useRef<THREE.Group>(null);
  const slamRoverRef = useRef<THREE.Group>(null);
  const mazeRoverRef = useRef<THREE.Group>(null);

  // Deterministic pseudo-random particle set for Day 40 MCL
  const mclSeeds = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        rx: (((i * 37) % 100) / 100 - 0.5) * 4.2,
        rz: (((i * 73) % 100) / 100 - 0.5) * 2.8,
        rot: (((i * 53) % 100) / 100) * Math.PI * 2,
        cluster: i % 3,
      })),
    [],
  );

  // Day 42 Collision-Free S-Corridor Path Curves
  const mazeDirectPts = useMemo(
    () => [
      new THREE.Vector3(-1.85, 0.03, 1.1),
      new THREE.Vector3(-0.78, 0.03, 1.1),
      new THREE.Vector3(-0.18, 0.03, 0.52),
      new THREE.Vector3(0.0, 0.03, 0.0),
      new THREE.Vector3(0.18, 0.03, -0.52),
      new THREE.Vector3(0.78, 0.03, -1.1),
      new THREE.Vector3(1.85, 0.03, -1.1),
    ],
    [],
  );

  const mazeDetourPts = useMemo(
    () => [
      new THREE.Vector3(-1.85, 0.03, 1.1),
      new THREE.Vector3(-0.78, 0.03, 1.1),
      new THREE.Vector3(-0.46, 0.03, 0.85),
      new THREE.Vector3(-0.46, 0.03, -0.65),
      new THREE.Vector3(0.25, 0.03, -1.12),
      new THREE.Vector3(0.78, 0.03, -1.12),
      new THREE.Vector3(1.85, 0.03, -1.1),
    ],
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (moduleId === 'day40_mcl_particle' && mclRoverRef.current) {
      // Stage 3 shows robot "kidnapped" onto opposite side
      const gx = preview.day40MclStage === 3 ? 1.35 : -0.9;
      const gz = preview.day40MclStage === 3 ? -0.55 : 0.45;
      mclRoverRef.current.position.x = THREE.MathUtils.lerp(mclRoverRef.current.position.x, gx, 0.08);
      mclRoverRef.current.position.z = THREE.MathUtils.lerp(mclRoverRef.current.position.z, gz, 0.08);
    }

    if (moduleId === 'day41_slam_grid' && slamRoverRef.current) {
      const ang = t * 0.55;
      slamRoverRef.current.position.x = Math.cos(ang) * 1.35;
      slamRoverRef.current.position.z = Math.sin(ang) * 0.95;
      slamRoverRef.current.rotation.y = -ang - Math.PI / 2;
    }

    if (moduleId === 'day42_maze_project' && mazeRoverRef.current) {
      const activePts =
        preview.day42ObstacleBlocked && preview.day42NavMode === 'full_nav'
          ? mazeDetourPts
          : mazeDirectPts;
      const segCount = activePts.length - 1;
      let phase = (t * 0.22) % 1;
      if (preview.day42ObstacleBlocked && preview.day42NavMode === 'astar_only') {
        // Halts cleanly right in front of the central obstacle crate (segment ~0.40)
        phase = Math.min(phase, 0.41);
      }
      const scaled = phase * segCount;
      const idx = Math.min(segCount - 1, Math.floor(scaled));
      const frac = scaled - idx;
      const p0 = activePts[idx];
      const p1 = activePts[idx + 1];
      const rx = THREE.MathUtils.lerp(p0.x, p1.x, frac);
      const rz = THREE.MathUtils.lerp(p0.z, p1.z, frac);
      const heading = -Math.atan2(p1.z - p0.z, p1.x - p0.x);

      mazeRoverRef.current.position.x = THREE.MathUtils.lerp(mazeRoverRef.current.position.x, rx, 0.2);
      mazeRoverRef.current.position.z = THREE.MathUtils.lerp(mazeRoverRef.current.position.z, rz, 0.2);
      mazeRoverRef.current.rotation.y = heading;
    }
  });

  // Day 38 TF offset converted neatly into scene units (5..35 cm -> 0.12..0.72 units)
  const day38LidarShift = (preview.day38CamOffsetCm / 35) * 0.62;
  const trueWallX = 2.05;
  const mappedWallX = preview.day38TfConfigured ? trueWallX : trueWallX - day38LidarShift;

  // Day 41 drift angle in radians
  const driftRad = preview.day41LoopClosure ? 0 : (preview.day41OdomDriftDeg * Math.PI) / 180;

  const hotspots: HotspotInfo[] =
    moduleId === 'day38_tf2_urdf'
      ? [
          {
            id: 'tf_sensor',
            label: 'Static TF 오프셋',
            title: 'base_link → laser_link 강체 변환',
            desc: 'URDF에 정의된 +X 장착 거리만큼 레이저 스캔 점을 앞쪽으로 보정해야 지도 벽면이 밀리지 않습니다.',
            pos: [-0.85 + day38LidarShift, 0.95, 0],
            focusTarget: [0.3, 0.35, 0],
            focusZoom: 85,
            color: '#635BFF',
          },
        ]
      : moduleId === 'day40_mcl_particle'
        ? [
            {
              id: 'mcl_cloud',
              label: '파티클 군집',
              title: 'Monte Carlo 가설 입자 필터',
              desc: '로봇이 스스로 어디 있는지 모를 때 수십~수백 개의 위치 가설(파티클)을 센서 우도로 살아남겨 위치를 수렴시킵니다.',
              pos: [0, 1.25, 0],
              focusTarget: [0, 0.2, 0],
              focusZoom: 72,
              color: '#10B981',
            },
          ]
        : moduleId === 'day41_slam_grid'
          ? [
              {
                id: 'slam_loop',
                label: '루프 클로저',
                title: 'Pose-Graph 누적 오차 일괄 보정',
                desc: '출발 지점을 재인식(Loop Closure)하면 오도메트리 각도 드리프트로 생긴 이중벽을 한 겹으로 정렬합니다.',
                pos: [1.35, 1.1, -0.8],
                focusTarget: [0, 0.25, 0],
                focusZoom: 70,
                color: '#0EA5E9',
              },
            ]
          : [
              {
                id: 'maze_dwa',
                label: 'DWA + C-Space',
                title: '전역 A* 경로 + 지역 동적 회피',
                desc: '벽 주변 C-Space 팽창 안전거리와 돌발 상자를 감지해 DWA가 실시간 곡선 우회 경로를 생성합니다.',
                pos: [-0.46, 0.95, -0.95],
                focusTarget: [0, 0.25, 0],
                focusZoom: 70,
                color: '#635BFF',
              },
            ];

  return (
    <group>
      {/* ---------------- DAY 38: TF2 / URDF OFFSET ---------------- */}
      {moduleId === 'day38_tf2_urdf' && (
        <group>
          {/* Robot Placed Left */}
          <ArenaRover3D
            position={[-1.05, 0.25, 0]}
            lidarOffsetX={day38LidarShift}
            showTriads
          />

          {/* Laser Scan Beam from laser_link to Real Wall */}
          <Line
            points={[
              new THREE.Vector3(-1.05 + day38LidarShift, 0.44, 0),
              new THREE.Vector3(trueWallX, 0.44, 0),
            ]}
            color="#38BDF8"
            lineWidth={2.2}
          />
          <Line
            points={[
              new THREE.Vector3(-1.05 + day38LidarShift, 0.44, 0),
              new THREE.Vector3(trueWallX, 0.44, 0.65),
            ]}
            color="#38BDF8"
            lineWidth={1.2}
            dashed
            dashSize={0.12}
            gapSize={0.08}
          />
          <Line
            points={[
              new THREE.Vector3(-1.05 + day38LidarShift, 0.44, 0),
              new THREE.Vector3(trueWallX, 0.44, -0.65),
            ]}
            color="#38BDF8"
            lineWidth={1.2}
            dashed
            dashSize={0.12}
            gapSize={0.08}
          />

          {/* True Physical Wall */}
          <mesh position={[trueWallX + 0.12, 0.55, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.24, 1.1, 2.2]} />
            <meshStandardMaterial color="#334155" roughness={0.55} />
          </mesh>

          {/* Mapped Wall Overlay (Emerald when TF aligned, Red Shifted Phantom when TF missing!) */}
          <mesh position={[mappedWallX, 0.55, 0]}>
            <boxGeometry args={[0.08, 1.08, 2.24]} />
            <meshBasicMaterial
              color={preview.day38TfConfigured ? '#10B981' : '#EF4444'}
              transparent
              opacity={preview.day38TfConfigured ? 0.42 : 0.65}
            />
          </mesh>
        </group>
      )}

      {/* ---------------- DAY 40: MCL PARTICLE FILTER ARENA ---------------- */}
      {moduleId === 'day40_mcl_particle' && (
        <group>
          {/* Arena Floor & L-Walls */}
          <mesh position={[0, 0.02, 0]} receiveShadow>
            <boxGeometry args={[5.0, 0.04, 3.4]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.8} />
          </mesh>
          {[
            { pos: [0, 0.35, -1.65] as [number, number, number], size: [5.0, 0.7, 0.14] as [number, number, number] },
            { pos: [0, 0.35, 1.65] as [number, number, number], size: [5.0, 0.7, 0.14] as [number, number, number] },
            { pos: [-2.45, 0.35, 0] as [number, number, number], size: [0.14, 0.7, 3.4] as [number, number, number] },
            { pos: [2.45, 0.35, 0] as [number, number, number], size: [0.14, 0.7, 3.4] as [number, number, number] },
            { pos: [0.2, 0.35, -0.3] as [number, number, number], size: [1.5, 0.7, 0.16] as [number, number, number] },
          ].map((w, i) => (
            <mesh key={i} position={w.pos} castShadow receiveShadow>
              <boxGeometry args={w.size} />
              <meshStandardMaterial color="#334155" roughness={0.6} />
            </mesh>
          ))}

          {/* True Rover */}
          <group ref={mclRoverRef} position={[-0.9, 0.25, 0.45]}>
            <ArenaRover3D position={[0, 0, 0]} tint="#0F172A" />
          </group>

          {/* 36 Oriented MCL Hypothesis Particle Arrows */}
          {mclSeeds.map((s, idx) => {
            let px = s.rx;
            let pz = s.rz;
            let rot = s.rot;
            let col = '#635BFF';

            if (preview.day40MclStage === 1) {
              const centers = [
                [-0.9, 0.45],
                [1.1, 0.45],
                [-0.9, -0.95],
              ];
              const c = centers[s.cluster];
              px = c[0] + s.rx * 0.14;
              pz = c[1] + s.rz * 0.14;
              rot = 0;
              col = '#F59E0B';
            } else if (preview.day40MclStage === 2) {
              px = -0.9 + s.rx * 0.08;
              pz = 0.45 + s.rz * 0.08;
              rot = 0;
              col = '#10B981';
            } else if (preview.day40MclStage === 3) {
              px = idx % 2 === 0 ? 1.35 + s.rx * 0.25 : s.rx;
              pz = idx % 2 === 0 ? -0.55 + s.rz * 0.25 : s.rz;
              col = idx % 2 === 0 ? '#0EA5E9' : '#EF4444';
            }

            return (
              <group key={idx} position={[px, 0.1, pz]} rotation={[0, rot, -Math.PI / 2]}>
                <mesh>
                  <coneGeometry args={[0.055, 0.16, 8]} />
                  <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.35} />
                </mesh>
              </group>
            );
          })}
        </group>
      )}

      {/* ---------------- DAY 41: SLAM OCCUPANCY GRID + LOOP CLOSURE ---------------- */}
      {moduleId === 'day41_slam_grid' && (
        <group>
          {/* Pass 1 Reference Perimeter Walls */}
          {[
            { pos: [0, 0.3, -1.55] as [number, number, number], size: [4.2, 0.6, 0.12] as [number, number, number] },
            { pos: [0, 0.3, 1.55] as [number, number, number], size: [4.2, 0.6, 0.12] as [number, number, number] },
            { pos: [-2.05, 0.3, 0] as [number, number, number], size: [0.12, 0.6, 3.2] as [number, number, number] },
            { pos: [2.05, 0.3, 0] as [number, number, number], size: [0.12, 0.6, 3.2] as [number, number, number] },
          ].map((w, i) => (
            <mesh key={i} position={w.pos} castShadow>
              <boxGeometry args={w.size} />
              <meshStandardMaterial color="#0EA5E9" transparent opacity={0.55} />
            </mesh>
          ))}

          {/* Pass 2 Drifted Scan Wall Layer ("Double Wall" when Loop Closure OFF) */}
          <group
            position={[preview.day41LoopClosure ? 0 : 0.22, 0, preview.day41LoopClosure ? 0 : -0.15]}
            rotation={[0, driftRad, 0]}
          >
            {[
              { pos: [0, 0.32, -1.55] as [number, number, number], size: [4.2, 0.56, 0.1] as [number, number, number] },
              { pos: [0, 0.32, 1.55] as [number, number, number], size: [4.2, 0.56, 0.1] as [number, number, number] },
              { pos: [-2.05, 0.32, 0] as [number, number, number], size: [0.1, 0.56, 3.2] as [number, number, number] },
              { pos: [2.05, 0.32, 0] as [number, number, number], size: [0.1, 0.56, 3.2] as [number, number, number] },
            ].map((w, i) => (
              <mesh key={i} position={w.pos}>
                <boxGeometry args={w.size} />
                <meshStandardMaterial
                  color={preview.day41LoopClosure ? '#10B981' : '#EF4444'}
                  transparent
                  opacity={preview.day41LoopClosure ? 0.5 : 0.55}
                />
              </mesh>
            ))}
          </group>

          {/* Moving SLAM Rover + LiDAR Loop Track */}
          <group ref={slamRoverRef} position={[1.35, 0.25, 0]}>
            <ArenaRover3D position={[0, 0, 0]} tint="#1E293B" />
          </group>
        </group>
      )}

      {/* ---------------- DAY 42: AUTONOMOUS MAZE NAVIGATION STACK ---------------- */}
      {moduleId === 'day42_maze_project' && (
        <group>
          {/* S-Corridor Maze Walls + C-Space Safety Inflation Floor Bands */}
          {[
            { pos: [0, 0.35, -1.75] as [number, number, number], size: [4.8, 0.7, 0.14] as [number, number, number] },
            { pos: [0, 0.35, 1.75] as [number, number, number], size: [4.8, 0.7, 0.14] as [number, number, number] },
            { pos: [-0.8, 0.35, -0.58] as [number, number, number], size: [0.16, 0.7, 2.2] as [number, number, number] },
            { pos: [0.8, 0.35, 0.58] as [number, number, number], size: [0.16, 0.7, 2.2] as [number, number, number] },
          ].map((w, i) => (
            <group key={i}>
              <mesh position={w.pos} castShadow receiveShadow>
                <boxGeometry args={w.size} />
                <meshStandardMaterial color="#1E293B" roughness={0.55} />
              </mesh>
              {/* C-Space Inflation Halo on Floor */}
              <mesh position={[w.pos[0], 0.012, w.pos[2]]}>
                <boxGeometry args={[w.size[0] + 0.32, 0.015, w.size[2] + 0.32]} />
                <meshBasicMaterial color="#F59E0B" transparent opacity={0.14} />
              </mesh>
            </group>
          ))}

          {/* Goal Pad in Top-Right Open Corridor */}
          <mesh position={[1.85, 0.03, -1.1]}>
            <cylinderGeometry args={[0.32, 0.32, 0.05, 24]} />
            <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.35} />
          </mesh>

          {/* Dynamic Dropped Obstacle Crate in Open Central Hall (0, 0) */}
          {preview.day42ObstacleBlocked && (
            <group position={[0.0, 0.28, 0.0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.44, 0.54, 0.44]} />
                <meshStandardMaterial color="#F59E0B" roughness={0.4} />
              </mesh>
              <mesh position={[0, -0.26, 0]}>
                <cylinderGeometry args={[0.48, 0.48, 0.02, 24]} />
                <meshBasicMaterial color="#EF4444" transparent opacity={0.22} />
              </mesh>
            </group>
          )}

          {/* Planned A* / DWA Trajectory Line */}
          <Line
            points={
              preview.day42ObstacleBlocked && preview.day42NavMode === 'full_nav'
                ? mazeDetourPts
                : mazeDirectPts
            }
            color={
              preview.day42ObstacleBlocked && preview.day42NavMode === 'astar_only'
                ? '#EF4444'
                : '#10B981'
            }
            lineWidth={3}
          />

          {/* Compact Navigating Robot (Scaled 0.60 to glide cleanly through corridors) */}
          <group ref={mazeRoverRef} position={[-1.85, 0.16, 1.1]} scale={[0.6, 0.6, 0.6]}>
            <ArenaRover3D
              position={[0, 0, 0]}
              tint={
                preview.day42ObstacleBlocked && preview.day42NavMode === 'astar_only'
                  ? '#991B1B'
                  : '#0F172A'
              }
            />
          </group>
        </group>
      )}

      <HotspotChips3D spots={hotspots} activeId={activeHotspotId} onSelect={onSelectHotspot} />
    </group>
  );
}
