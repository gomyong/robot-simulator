import { ContactShadows, Grid, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Cpu,
  Eye,
  Layers,
  Puzzle,
  RotateCw,
  Search,
  Sparkles,
  Tag,
  Wifi,
  Wrench,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { BOARDS_CATALOG } from '../../data/boardsCatalog';
import {
  BoardCameraPreset,
  BoardId,
  BoardPartSpec,
  ModuleId,
} from '../../types/lab';
import { GlossaryText } from '../GlossaryText';
import { MascotSpeechBubble } from '../PixelMascot';
import { BoardCompareView } from './BoardCompareView';
import { BoardMesh3D } from './BoardModels3D';

interface BoardsStudioViewProps {
  masteredBoardIds: BoardId[];
  onMasterBoard: (boardId: BoardId) => void;
  onOpenLab: (moduleId: ModuleId, dayNum?: number) => void;
  onOpenWorkbench: (boardId: BoardId) => void;
}

const BOARD_CAMERA_PRESETS: Record<
  BoardCameraPreset,
  { pos: [number, number, number]; target: [number, number, number]; zoom: number }
> = {
  iso: { pos: [5.8, 5.4, 6.2], target: [0, 0.35, 0], zoom: 82 },
  top: { pos: [0, 9.5, 0.01], target: [0, 0.35, 0], zoom: 86 },
  bottom: { pos: [1.8, -8.8, 2.2], target: [0, 0.3, 0], zoom: 84 },
  front: { pos: [0, 2.2, 8.8], target: [0, 0.35, 0], zoom: 84 },
};

function BoardCameraRig({
  preset,
  presetTrigger,
  boardId,
  autoRotate,
  focusGoal,
}: {
  preset: BoardCameraPreset;
  presetTrigger: number;
  boardId: BoardId;
  autoRotate: boolean;
  focusGoal: { target: [number, number, number]; zoom: number; seq: number } | null;
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const animatingRef = useRef(false);
  const desiredPos = useRef(new THREE.Vector3(...BOARD_CAMERA_PRESETS.iso.pos));
  const desiredTarget = useRef(
    new THREE.Vector3(...BOARD_CAMERA_PRESETS.iso.target),
  );
  const desiredZoom = useRef(BOARD_CAMERA_PRESETS.iso.zoom);

  useEffect(() => {
    const view = BOARD_CAMERA_PRESETS[preset];
    desiredPos.current.set(...view.pos);
    desiredTarget.current.set(...view.target);
    desiredZoom.current = boardId === 'mega' ? view.zoom - 14 : view.zoom;
    animatingRef.current = true;
  }, [preset, presetTrigger, boardId]);

  useEffect(() => {
    if (!focusGoal) return;
    const [tx, ty, tz] = focusGoal.target;
    desiredTarget.current.set(tx, ty, tz);
    const ySign = ty < 0 ? -4.5 : 4.8;
    desiredPos.current.set(tx + 4.2, ty + ySign, tz + 4.4);
    desiredZoom.current = focusGoal.zoom;
    animatingRef.current = true;
  }, [focusGoal]);

  useFrame(() => {
    if (!controlsRef.current) return;
    if (animatingRef.current) {
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
    } else if (autoRotate) {
      controlsRef.current.update();
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
      autoRotate={autoRotate}
      autoRotateSpeed={1.6}
      minZoom={42}
      maxZoom={170}
      minPolarAngle={0.05}
      maxPolarAngle={Math.PI - 0.05}
      onStart={() => {
        animatingRef.current = false;
      }}
    />
  );
}

export function BoardsStudioView({
  masteredBoardIds,
  onMasterBoard,
  onOpenLab,
  onOpenWorkbench,
}: BoardsStudioViewProps) {
  const [subView, setSubView] = useState<'explore' | 'compare'>('explore');
  const [activeBoardId, setActiveBoardId] = useState<BoardId>('uno');
  const [cameraPreset, setCameraPreset] = useState<BoardCameraPreset>('iso');
  const [presetTrigger, setPresetTrigger] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [exploded, setExploded] = useState(false);

  // Interactive Modes: 'inspect' | 'find' | 'assemble'
  const [interactionMode, setInteractionMode] = useState<
    'inspect' | 'find' | 'assemble'
  >('inspect');
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [focusGoal, setFocusGoal] = useState<{
    target: [number, number, number];
    zoom: number;
    seq: number;
  } | null>(null);

  // Find-the-part state
  const [findIdx, setFindIdx] = useState(0);
  const [findFeedback, setFindFeedback] = useState<{
    type: 'correct' | 'wrong' | 'done';
    message: string;
  } | null>(null);

  // Assemble-it state
  const [assembledPartIds, setAssembledPartIds] = useState<string[]>([]);
  const [assembleCompleted, setAssembleCompleted] = useState(false);

  const activeBoard = useMemo(
    () => BOARDS_CATALOG.find((b) => b.id === activeBoardId) ?? BOARDS_CATALOG[0],
    [activeBoardId],
  );

  const selectedPart = useMemo(
    () =>
      activeBoard.parts.find((p) => p.id === selectedPartId) ??
      activeBoard.parts[0],
    [activeBoard, selectedPartId],
  );

  const resetBoardInteraction = useCallback((boardId: BoardId) => {
    const board =
      BOARDS_CATALOG.find((b) => b.id === boardId) ?? BOARDS_CATALOG[0];
    setSelectedPartId(board.parts[0]?.id ?? null);
    setFocusGoal(null);
    setCameraPreset('iso');
    setPresetTrigger((n) => n + 1);
    setFindIdx(0);
    setFindFeedback(null);
    setAssembledPartIds([]);
    setAssembleCompleted(false);
  }, []);

  const handleSelectBoard = useCallback(
    (boardId: BoardId) => {
      setActiveBoardId(boardId);
      setInteractionMode('inspect');
      setExploded(false);
      resetBoardInteraction(boardId);
    },
    [resetBoardInteraction],
  );

  useEffect(() => {
    if (subView !== 'explore') return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const idx = BOARDS_CATALOG.findIndex((b) => b.id === activeBoardId);
      if (e.key === 'ArrowRight' && idx < BOARDS_CATALOG.length - 1) {
        handleSelectBoard(BOARDS_CATALOG[idx + 1].id);
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        handleSelectBoard(BOARDS_CATALOG[idx - 1].id);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [subView, activeBoardId, handleSelectBoard]);

  const triggerCamera = (preset: BoardCameraPreset) => {
    setFocusGoal(null);
    setCameraPreset(preset);
    setPresetTrigger((n) => n + 1);
  };

  const startFindMode = () => {
    setInteractionMode('find');
    setExploded(false);
    setAutoRotate(false);
    setFindIdx(0);
    setFindFeedback(null);
    triggerCamera('iso');
  };

  const startAssembleMode = () => {
    setInteractionMode('assemble');
    setExploded(false);
    setAutoRotate(false);
    setAssembledPartIds([]);
    setAssembleCompleted(false);
    triggerCamera('iso');
  };

  const handleSelectPartFrom3D = (part: BoardPartSpec) => {
    setSelectedPartId(part.id);

    if (interactionMode === 'find') {
      const target = activeBoard.parts[findIdx];
      if (!target) return;

      if (part.id === target.id) {
        if (findIdx + 1 >= activeBoard.parts.length) {
          setFindFeedback({
            type: 'done',
            message: `${activeBoard.shortName}의 모든 부품을 찾았습니다! (+15 EXP)`,
          });
          onMasterBoard(activeBoard.id);
        } else {
          const nextIdx = findIdx + 1;
          setFindIdx(nextIdx);
          setFindFeedback({
            type: 'correct',
            message: `정답! ${part.label} — ${part.beginnerDesc}`,
          });
        }
      } else {
        setFindFeedback({
          type: 'wrong',
          message: `방금 누른 부품은 "${part.label}"입니다. 힌트를 보고 다시 찾아보세요!`,
        });
      }
      return;
    }

    if (interactionMode === 'assemble') {
      if (!assembledPartIds.includes(part.id)) {
        const next = [...assembledPartIds, part.id];
        setAssembledPartIds(next);
        if (next.length >= activeBoard.parts.length) {
          setAssembleCompleted(true);
          onMasterBoard(activeBoard.id);
        }
      }
      return;
    }

    // Normal inspect mode: focus camera gently on clicked part
    setFocusGoal((prev) => ({
      target: part.focusTarget,
      zoom: part.focusZoom,
      seq: (prev?.seq ?? 0) + 1,
    }));
    if (part.pos[1] < 0) {
      setCameraPreset('bottom');
    }
  };

  const isMastered = masteredBoardIds.includes(activeBoard.id);
  const currentFindTarget = activeBoard.parts[findIdx];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      {/* Studio Sub-Navigation Strip (Matches LabHeader Calm Minimalism) */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#E6E8EC] bg-white px-4 py-2 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg bg-[#ECEEF2] p-0.5">
            <button
              type="button"
              onClick={() => setSubView('explore')}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                subView === 'explore'
                  ? 'bg-white text-[#0A2540] shadow-[0_1px_2px_rgba(10,37,64,0.06)]'
                  : 'text-[#697386] hover:text-[#0A2540]'
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-[#635BFF]" />
              <span>3D 보드 해부 · 조립</span>
            </button>
            <button
              type="button"
              onClick={() => setSubView('compare')}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                subView === 'compare'
                  ? 'bg-white text-[#0A2540] shadow-[0_1px_2px_rgba(10,37,64,0.06)]'
                  : 'text-[#697386] hover:text-[#0A2540]'
              }`}
            >
              <Cpu className="h-3.5 w-3.5 text-[#697386]" />
              <span>8종 스펙 비교표</span>
            </button>
          </div>

          <span className="hidden text-[11px] text-[#697386] md:inline">
            실제 로봇 제작에 쓰이는 대표 보드 8종을 3D로 분해하고 부품을 찾아보세요
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-[#697386]">
          <span>
            도감 정복{' '}
            <strong className="font-semibold text-[#635BFF]">
              {masteredBoardIds.length}
            </strong>
            /8
          </span>
        </div>
      </div>

      {/* Dedicated Non-Occluding Interactive Challenge Strip (Find / Assemble) */}
      {subView === 'explore' && interactionMode === 'find' && currentFindTarget && (
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#635BFF]/25 bg-[#EEF2FF]/70 px-4 py-2 sm:px-6">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#4F46E5]">
                <Search className="h-3.5 w-3.5" />
                부품 찾기 ({findIdx + 1}/{activeBoard.parts.length})
              </span>
              {findFeedback?.type === 'done' ? (
                <span className="text-xs font-semibold text-emerald-700">
                  {findFeedback.message}
                </span>
              ) : (
                <span className="text-xs font-semibold text-[#0A2540]">
                  {currentFindTarget.findPrompt}
                </span>
              )}
            </div>
            {findFeedback && findFeedback.type !== 'done' && (
              <p
                className={`mt-0.5 text-[11px] font-medium ${
                  findFeedback.type === 'correct'
                    ? 'text-emerald-700'
                    : 'text-rose-600'
                }`}
              >
                {findFeedback.message}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setInteractionMode('inspect')}
            className="shrink-0 rounded-md border border-[#E6E8EC] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#425466] hover:text-[#0A2540]"
          >
            {findFeedback?.type === 'done' ? '완료' : '종료'}
          </button>
        </div>
      )}

      {subView === 'explore' && interactionMode === 'assemble' && (
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-emerald-200 bg-emerald-50/75 px-4 py-2 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-700">
              <Puzzle className="h-3.5 w-3.5" />
              직접 조립하기 ({assembledPartIds.length}/{activeBoard.parts.length})
            </span>
            <span className="text-xs font-medium text-[#0A2540]">
              {assembleCompleted
                ? `${activeBoard.shortName} 조립 완성! (+15 EXP)`
                : '3D 화면에 떠 있는 부품이나 라벨을 클릭해 제자리에 끼워보세요!'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setInteractionMode('inspect')}
            className="shrink-0 rounded-md border border-emerald-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-50"
          >
            {assembleCompleted ? '확인' : '종료'}
          </button>
        </div>
      )}

      {subView === 'compare' ? (
        <div className="min-h-0 flex-1">
          <BoardCompareView
            onSelectBoard3D={(boardId) => {
              handleSelectBoard(boardId);
              setSubView('explore');
            }}
          />
        </div>
      ) : (
        /* Explore Studio: Left Board Card + Inspector | Right Full-Bleed 3D Blueprint Canvas + Bottom Dock */
        <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[46dvh_1fr] lg:grid-cols-[380px_1fr] lg:grid-rows-1">
          {/* 3D Canvas (Top on mobile, Right on Desktop via order classes) */}
          <section className="relative order-1 min-h-0 w-full overflow-hidden bg-[#F2F5FA] lg:order-2">
            {/* Blueprint Grid Canvas */}
            <Canvas
              orthographic
              shadows
              dpr={[1, 2]}
              camera={{ position: [5.8, 5.4, 6.2], zoom: 82, near: 0.1, far: 120 }}
            >
              <color attach="background" args={['#F2F5FA']} />
              <ambientLight intensity={0.85} />
              <directionalLight
                position={[7, 12, 7]}
                intensity={1.3}
                castShadow
                shadow-mapSize={[1024, 1024]}
              />
              <directionalLight
                position={[-6, -6, -4]}
                intensity={0.45}
                color="#E0E7FF"
              />

              <BoardMesh3D
                board={activeBoard}
                exploded={exploded}
                showLabels={showLabels && interactionMode !== 'find'}
                selectedPartId={selectedPartId}
                assembleMode={interactionMode === 'assemble'}
                assembledPartIds={assembledPartIds}
                onSelectPart={handleSelectPartFrom3D}
              />

              <ContactShadows
                position={[0, -0.02, 0]}
                opacity={0.22}
                scale={12}
                blur={2.2}
                far={4}
              />
              <Grid
                position={[0, -0.03, 0]}
                args={[22, 22]}
                cellSize={0.5}
                cellThickness={0.5}
                cellColor="#CBD5E1"
                sectionSize={2}
                sectionThickness={1}
                sectionColor="#94A3B8"
                fadeDistance={16}
                infiniteGrid
              />

              <BoardCameraRig
                preset={cameraPreset}
                presetTrigger={presetTrigger}
                boardId={activeBoard.id}
                autoRotate={autoRotate}
                focusGoal={focusGoal}
              />
            </Canvas>

            {/* Top-Left Subtle Hint */}
            <div className="pointer-events-none absolute left-3 top-3 z-10 hidden items-center gap-1.5 rounded-lg border border-[#E6E8EC] bg-white/90 px-2.5 py-1 text-[11px] font-medium text-[#425466] backdrop-blur-sm sm:inline-flex">
              <Compass className="h-3.5 w-3.5 text-[#635BFF]" />
              <span>드래그 회전 · 휠 줌 · Bottom으로 뒷면 확인</span>
            </div>

            {/* Top-Right Floating Toolbar (Matches Reel's 3/4 · Top · Bottom · Front · Rotate · Labels · Assemble!) */}
            <div className="lab-scroll absolute right-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] items-center gap-1 overflow-x-auto rounded-xl border border-[#E6E8EC] bg-white/95 p-1 shadow-[0_6px_18px_rgba(10,37,64,0.08)] backdrop-blur-sm">
              {(
                [
                  { id: 'iso', label: '3/4' },
                  { id: 'top', label: 'Top' },
                  { id: 'bottom', label: 'Bottom' },
                  { id: 'front', label: 'Front' },
                ] as const
              ).map((cam) => (
                <button
                  key={cam.id}
                  type="button"
                  onClick={() => triggerCamera(cam.id)}
                  className={`shrink-0 rounded-lg px-2 py-1 font-mono text-[11px] font-medium transition ${
                    cameraPreset === cam.id && !focusGoal
                      ? 'bg-[#0A2540] text-white'
                      : 'text-[#425466] hover:bg-[#F1F3F6]'
                  }`}
                >
                  {cam.label}
                </button>
              ))}

              <span className="mx-0.5 h-4 w-px shrink-0 bg-[#E6E8EC]" />

              <button
                type="button"
                onClick={() => setAutoRotate((v) => !v)}
                className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition ${
                  autoRotate
                    ? 'bg-[#EEF2FF] text-[#4F46E5]'
                    : 'text-[#425466] hover:bg-[#F1F3F6]'
                }`}
              >
                <RotateCw className="h-3 w-3" />
                <span className="hidden sm:inline">회전</span>
              </button>

              <button
                type="button"
                onClick={() => setShowLabels((v) => !v)}
                className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition ${
                  showLabels
                    ? 'bg-[#EEF2FF] text-[#4F46E5]'
                    : 'text-[#425466] hover:bg-[#F1F3F6]'
                }`}
              >
                <Tag className="h-3 w-3" />
                <span className="hidden sm:inline">라벨</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (interactionMode === 'assemble') {
                    setInteractionMode('inspect');
                    setExploded(false);
                  } else {
                    setExploded((v) => !v);
                    setInteractionMode('inspect');
                  }
                }}
                className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                  exploded
                    ? 'bg-[#635BFF] text-white'
                    : 'bg-[#F1F3F6] text-[#0A2540] hover:bg-[#E6E8EC]'
                }`}
              >
                <Layers className="h-3 w-3" />
                <span>{exploded ? '합치기' : '분해 보기'}</span>
              </button>
            </div>

            {/* Bottom 8-Board Selector Dock */}
            <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10">
              <div className="lab-scroll pointer-events-auto mx-auto flex w-fit max-w-full items-center gap-1.5 overflow-x-auto rounded-xl border border-[#E6E8EC] bg-white/95 p-1.5 shadow-[0_8px_24px_rgba(10,37,64,0.1)] backdrop-blur-sm">
                {BOARDS_CATALOG.map((board) => {
                  const active = board.id === activeBoard.id;
                  const done = masteredBoardIds.includes(board.id);
                  return (
                    <button
                      key={board.id}
                      type="button"
                      onClick={() => handleSelectBoard(board.id)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left transition ${
                        active
                          ? 'bg-[#0A2540] text-white'
                          : 'text-[#425466] hover:bg-[#F1F3F6] hover:text-[#0A2540]'
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-sm border border-white/30"
                        style={{ backgroundColor: board.pcbColor }}
                      />
                      <span className="whitespace-nowrap text-[11px] font-semibold">
                        {board.shortName}
                      </span>
                      <span
                        className={`rounded px-1 py-0.2 font-mono text-[9px] font-semibold ${
                          active
                            ? 'bg-white/15 text-white'
                            : board.logicVoltage === '5V'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-sky-50 text-sky-800'
                        }`}
                      >
                        {board.logicVoltage}
                      </span>
                      {done && (
                        <CheckCircle2
                          className={`h-3 w-3 shrink-0 ${
                            active ? 'text-emerald-300' : 'text-emerald-600'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Left Board Overview & Part Inspector Panel (Bottom on mobile, Left on Desktop) */}
          <aside className="lab-scroll order-2 min-h-0 overflow-y-auto border-t border-[#E6E8EC] bg-white p-5 lg:order-1 lg:border-r lg:border-t-0">
            <div
              className="space-y-6"
              style={{ paddingBottom: 'calc(1.5rem + var(--safe-bottom))' }}
            >
              {/* Board Header Card */}
              <header>
                <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-[#697386]">
                  <span className="font-semibold text-[#635BFF]">
                    {activeBoard.maker} · {activeBoard.year}
                  </span>
                  <span>
                    {String(activeBoard.order).padStart(2, '0')} / 08
                  </span>
                </div>

                <div className="mt-1.5 flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-[#0A2540]">
                    {activeBoard.name}
                  </h2>
                  {isMastered && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-[#697386]">
                  {activeBoard.tagline}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span
                    className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold ${
                      activeBoard.logicVoltage === '5V'
                        ? 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200'
                        : 'bg-sky-50 text-sky-800 ring-1 ring-inset ring-sky-200'
                    }`}
                  >
                    로직 {activeBoard.logicVoltage}
                  </span>
                  <span className="rounded-md bg-[#F1F3F6] px-2 py-0.5 text-[10px] font-semibold text-[#425466]">
                    {activeBoard.difficultyLabel}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#F1F3F6] px-2 py-0.5 text-[10px] font-medium text-[#425466]">
                    <Wifi className="h-2.5 w-2.5" />
                    {activeBoard.wireless.split(' ')[0]}
                  </span>
                </div>

                {/* Action Buttons: Find the part + Assemble it */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={startFindMode}
                    className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border text-xs font-semibold transition ${
                      interactionMode === 'find'
                        ? 'border-[#635BFF] bg-[#EEF2FF] text-[#4F46E5]'
                        : 'border-[#E6E8EC] bg-white text-[#0A2540] hover:bg-[#F7F8FA]'
                    }`}
                  >
                    <Search className="h-3.5 w-3.5 text-[#635BFF]" />
                    <span>부품 찾기</span>
                  </button>
                  <button
                    type="button"
                    onClick={startAssembleMode}
                    className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition ${
                      interactionMode === 'assemble'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#0A2540] text-white hover:bg-[#163459]'
                    }`}
                  >
                    <Puzzle className="h-3.5 w-3.5" />
                    <span>직접 조립</span>
                  </button>
                </div>
              </header>

              {/* Beginner Summary & Analogy */}
              <div className="space-y-3.5 border-t border-[#ECEEF2] pt-4">
                <p className="text-xs leading-relaxed text-[#425466]">
                  <GlossaryText text={activeBoard.beginnerSummary} />
                </p>

                <MascotSpeechBubble mood="happy" label="초보자 한눈 비유">
                  <GlossaryText text={activeBoard.analogy} />
                </MascotSpeechBubble>
              </div>

              {/* Compact Spec Grid */}
              <section className="grid grid-cols-2 border-y border-[#E6E8EC] bg-[#F7F8FA]/60 text-[11px]">
                <div className="border-b border-r border-[#E6E8EC] p-2.5">
                  <div className="text-[#697386]">두뇌 (CPU)</div>
                  <div className="mt-0.5 font-semibold text-[#0A2540]">
                    {activeBoard.cpu}
                  </div>
                </div>
                <div className="border-b border-[#E6E8EC] p-2.5">
                  <div className="text-[#697386]">권장 입력 전원</div>
                  <div className="mt-0.5 font-mono font-semibold text-[#0A2540]">
                    {activeBoard.inputVoltage}
                  </div>
                </div>
                <div className="border-r border-[#E6E8EC] p-2.5">
                  <div className="text-[#697386]">핀 구성</div>
                  <div className="mt-0.5 font-medium text-[#0A2540]">
                    <GlossaryText text={activeBoard.gpioSummary} />
                  </div>
                </div>
                <div className="p-2.5">
                  <div className="text-[#697386]">대략적인 가격</div>
                  <div className="mt-0.5 font-semibold text-[#0A2540]">
                    {activeBoard.priceApprox}
                  </div>
                </div>
              </section>

              {/* Clicked 3D Part Inspector */}
              {selectedPart && (
                <section className="rounded-xl border border-[#E6E8EC] bg-[#F7F8FA] p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded bg-[#EEF2FF] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#4F46E5]">
                      <Eye className="h-3 w-3" />
                      선택된 부품 · {selectedPart.category}
                    </span>
                    <span className="font-mono text-[10px] text-[#697386]">
                      3D 클릭됨
                    </span>
                  </div>
                  <div className="mt-1.5 text-xs font-bold text-[#0A2540]">
                    {selectedPart.title}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#425466]">
                    <GlossaryText text={selectedPart.beginnerDesc} />
                  </p>
                  <p className="mt-2 border-l-2 border-[#635BFF] pl-2.5 text-[11px] leading-relaxed text-[#425466]">
                    <strong className="mr-1 text-[#635BFF]">비유</strong>
                    <GlossaryText text={selectedPart.analogy} />
                  </p>

                  {/* Quick Parts Chip Bar */}
                  <div className="mt-3 flex flex-wrap gap-1 border-t border-[#E6E8EC] pt-2.5">
                    {activeBoard.parts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPartFrom3D(p)}
                        className={`rounded px-2 py-0.5 text-[10px] font-medium transition ${
                          selectedPart.id === p.id
                            ? 'bg-[#635BFF] text-white'
                            : 'bg-white text-[#425466] hover:bg-[#ECEEF2]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Best For & Watch Out */}
              <section className="space-y-2.5 text-xs">
                <div className="border-l-2 border-emerald-500 pl-3">
                  <div className="text-[11px] font-semibold text-emerald-700">
                    이럴 때 고르세요
                  </div>
                  <p className="mt-0.5 leading-relaxed text-[#425466]">
                    <GlossaryText text={activeBoard.bestFor} />
                  </p>
                </div>
                <div className="border-l-2 border-rose-500 pl-3">
                  <div className="text-[11px] font-semibold text-rose-600">
                    초보자 주의점
                  </div>
                  <p className="mt-0.5 leading-relaxed text-[#425466]">
                    <GlossaryText text={activeBoard.watchOut} />
                  </p>
                </div>
              </section>

              {/* Workbench & Curriculum Bridge CTAs */}
              <div className="space-y-2 border-t border-[#E6E8EC] pt-4">
                <button
                  type="button"
                  onClick={() => onOpenWorkbench(activeBoard.id)}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0A2540] px-4 text-xs font-semibold text-white transition hover:bg-[#163459]"
                >
                  <Wrench className="h-3.5 w-3.5 text-[#A5B4FC]" />
                  <span>작업대에서 {activeBoard.shortName} 배선하기</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                {activeBoard.connectedDay && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenLab(
                        activeBoard.connectedDay!.moduleId,
                        activeBoard.connectedDay!.dayNum,
                      )
                    }
                    className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#E6E8EC] bg-white px-4 text-xs font-semibold text-[#635BFF] transition hover:bg-[#EEF2FF]/60"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{activeBoard.connectedDay.label}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
