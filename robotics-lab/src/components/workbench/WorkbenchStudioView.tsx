import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Code2,
  Cpu,
  Play,
  Plus,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Square,
  Terminal,
  Wrench,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { BOARDS_CATALOG } from '../../data/boardsCatalog';
import {
  WORKBENCH_BOARD_PINS,
  WORKBENCH_COMPONENT_DEFS,
  WORKBENCH_MISSIONS,
  WORKBENCH_SLOTS,
} from '../../data/workbenchData';
import {
  BoardId,
  ModuleId,
  WbComponentInstance,
  WbComponentType,
  WbMissionPreset,
  WbWire,
} from '../../types/lab';
import { analyzeWorkbenchCircuit } from '../../utils/workbenchRules';
import { GlossaryText } from '../GlossaryText';
import { WorkbenchCanvasSvg } from './WorkbenchCanvasSvg';

interface WorkbenchStudioViewProps {
  initialBoardId: BoardId;
  completedMissionIds: string[];
  onCompleteMission: (missionId: string) => void;
  onOpenLab: (moduleId: ModuleId, dayNum?: number) => void;
}

const WIRE_COLORS = [
  { id: '#EF4444', label: '빨강(+)' },
  { id: '#111827', label: '검정(-)' },
  { id: '#635BFF', label: '보라(신호)' },
  { id: '#10B981', label: '초록' },
  { id: '#0EA5E9', label: '파랑' },
  { id: '#F59E0B', label: '노랑' },
];

function remapPinRef(
  ref: string,
  fromBoardId: BoardId,
  toBoardId: BoardId,
): string | null {
  if (!ref.startsWith('board:')) return ref;
  const oldId = ref.slice('board:'.length);
  const oldPins = WORKBENCH_BOARD_PINS[fromBoardId];
  const newPins = WORKBENCH_BOARD_PINS[toBoardId];
  if (newPins.some((p) => p.id === oldId)) return ref;

  const oldPin = oldPins.find((p) => p.id === oldId);
  if (!oldPin) return null;

  let target =
    oldPin.role === 'power_5v' || oldPin.role === 'vin'
      ? newPins.find((p) => p.role === 'power_5v')
      : oldPin.role === 'power_3v3'
        ? newPins.find((p) => p.role === 'power_3v3')
        : oldPin.role === 'gnd'
          ? newPins.find((p) => p.role === 'gnd')
          : oldPin.adc
            ? newPins.find((p) => p.adc) ?? newPins.find((p) => p.role === 'gpio')
            : oldPin.pwm
              ? newPins.find((p) => p.pwm && p.role === 'gpio') ??
                newPins.find((p) => p.role === 'gpio')
              : newPins.find((p) => p.role === 'gpio');

  target ??= newPins.find((p) => p.role === 'gpio') ?? newPins[0];
  return target ? `board:${target.id}` : null;
}

export function WorkbenchStudioView({
  initialBoardId,
  completedMissionIds,
  onCompleteMission,
  onOpenLab,
}: WorkbenchStudioViewProps) {
  const [boardId, setBoardId] = useState<BoardId>(initialBoardId);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(
    WORKBENCH_MISSIONS[0].id,
  );
  const [components, setComponents] = useState<WbComponentInstance[]>(() =>
    WORKBENCH_MISSIONS[0].components.map((c) => ({
      ...c,
      label: WORKBENCH_COMPONENT_DEFS[c.type].shortName,
    })),
  );
  const [wires, setWires] = useState<WbWire[]>(WORKBENCH_MISSIONS[0].wires);
  const [pendingPinRef, setPendingPinRef] = useState<string | null>(null);
  const [wireColor, setWireColor] = useState('#635BFF');
  const [isRunning, setIsRunning] = useState(false);

  // Interactive runtime inputs
  const [buttonPressed, setButtonPressed] = useState(false);
  const [sonarDistanceCm, setSonarDistanceCm] = useState(42);
  const [potPercent, setPotPercent] = useState(50);

  const [rightTab, setRightTab] = useState<
    'diagnostics' | 'missions' | 'code'
  >('diagnostics');

  // Sync if user navigated from BoardsStudioView "작업대에서 배선하기"
  useEffect(() => {
    setBoardId((prev) => {
      if (prev === initialBoardId) return prev;
      setWires((curWires) =>
        curWires
          .map((w) => {
            const fromRef = remapPinRef(w.fromRef, prev, initialBoardId);
            const toRef = remapPinRef(w.toRef, prev, initialBoardId);
            return fromRef && toRef ? { ...w, fromRef, toRef } : null;
          })
          .filter((w): w is WbWire => w !== null),
      );
      return initialBoardId;
    });
  }, [initialBoardId]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPendingPinRef(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const analysis = useMemo(
    () =>
      analyzeWorkbenchCircuit({
        boardId,
        components,
        wires,
        isRunning,
        buttonPressed,
        sonarDistanceCm,
        potPercent,
      }),
    [
      boardId,
      components,
      wires,
      isRunning,
      buttonPressed,
      sonarDistanceCm,
      potPercent,
    ],
  );

  // Auto-award mission completion when running cleanly with zero danger/warning
  useEffect(() => {
    if (!isRunning || !activeMissionId || analysis.status !== 'ok') return;
    if (
      activeMissionId === 'wb_safe_led' &&
      Object.values(analysis.ledStates).some((s) => s.lit || s.pinLabel)
    ) {
      onCompleteMission('wb_safe_led');
    } else if (
      activeMissionId === 'wb_ultrasonic_divider' &&
      Object.values(analysis.sonarStates).some((s) => s.active)
    ) {
      onCompleteMission('wb_ultrasonic_divider');
    } else if (
      activeMissionId === 'wb_servo_power' &&
      Object.values(analysis.servoStates).some((s) => s.active)
    ) {
      onCompleteMission('wb_servo_power');
    } else if (
      activeMissionId === 'wb_pot_adc' &&
      Object.values(analysis.potStates).some((s) => s.active)
    ) {
      onCompleteMission('wb_pot_adc');
    }
  }, [isRunning, activeMissionId, analysis, onCompleteMission]);

  const activeMission = useMemo(
    () => WORKBENCH_MISSIONS.find((m) => m.id === activeMissionId) ?? null,
    [activeMissionId],
  );

  const loadMission = (mission: WbMissionPreset) => {
    setBoardId(mission.recommendedBoard);
    setActiveMissionId(mission.id);
    setComponents(
      mission.components.map((c) => ({
        ...c,
        label: WORKBENCH_COMPONENT_DEFS[c.type].shortName,
      })),
    );
    setWires(mission.wires);
    setPendingPinRef(null);
    setIsRunning(false);
    setRightTab('diagnostics');
  };

  const handleClickPin = (pinRef: string) => {
    if (!pendingPinRef) {
      setPendingPinRef(pinRef);
      // Auto-pick intuitive wire color based on pin name
      const lower = pinRef.toLowerCase();
      if (lower.includes('gnd')) setWireColor('#111827');
      else if (lower.includes('5v') || lower.includes('vcc') || lower.includes('vin') || lower.includes('3v3'))
        setWireColor('#EF4444');
      return;
    }

    if (pendingPinRef === pinRef) {
      setPendingPinRef(null);
      return;
    }

    // Prevent duplicate exact wire
    const exists = wires.some(
      (w) =>
        (w.fromRef === pendingPinRef && w.toRef === pinRef) ||
        (w.fromRef === pinRef && w.toRef === pendingPinRef),
    );
    if (!exists) {
      setWires((prev) => [
        ...prev,
        {
          id: `w_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          fromRef: pendingPinRef,
          toRef: pinRef,
          color: wireColor,
        },
      ]);
    }
    setPendingPinRef(null);
  };

  const handleRemoveWire = (wireId: string) => {
    setWires((prev) => prev.filter((w) => w.id !== wireId));
  };

  const handleAddComponent = (type: WbComponentType) => {
    const usedSlots = new Set(components.map((c) => c.slotIndex));
    const freeSlotIdx = WORKBENCH_SLOTS.findIndex((_, idx) => !usedSlots.has(idx));
    if (freeSlotIdx === -1) return;

    const uid = `comp_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 5)}`;
    setComponents((prev) => [
      ...prev,
      {
        uid,
        type,
        slotIndex: freeSlotIdx,
        label: WORKBENCH_COMPONENT_DEFS[type].shortName,
      },
    ]);
  };

  const handleRemoveComponent = (uid: string) => {
    setComponents((prev) => prev.filter((c) => c.uid !== uid));
    setWires((prev) =>
      prev.filter(
        (w) => !w.fromRef.startsWith(`${uid}:`) && !w.toRef.startsWith(`${uid}:`),
      ),
    );
    if (pendingPinRef?.startsWith(`${uid}:`)) {
      setPendingPinRef(null);
    }
  };

  const handleClearWires = () => {
    setWires([]);
    setPendingPinRef(null);
    setIsRunning(false);
  };

  const hasSonar = components.some((c) => c.type === 'hcsr04');
  const hasPot = components.some((c) => c.type === 'pot');
  const hasButton = components.some((c) => c.type === 'button');
  const slotsFull = components.length >= WORKBENCH_SLOTS.length;
  const activeBoard =
    BOARDS_CATALOG.find((b) => b.id === boardId) ?? BOARDS_CATALOG[0];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      {/* Top Workbench Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#E6E8EC] bg-white px-3 py-2 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Board Switcher */}
          <div className="flex items-center gap-1.5 rounded-lg border border-[#E6E8EC] bg-[#F7F8FA] px-2.5 py-1">
            <Cpu className="h-3.5 w-3.5 text-[#635BFF]" />
            <label htmlFor="wb-board-select" className="sr-only">
              작업대 보드 선택
            </label>
            <select
              id="wb-board-select"
              value={boardId}
              onChange={(e) => {
                const nextBoard = e.target.value as BoardId;
                setWires((curWires) =>
                  curWires
                    .map((w) => {
                      const fromRef = remapPinRef(w.fromRef, boardId, nextBoard);
                      const toRef = remapPinRef(w.toRef, boardId, nextBoard);
                      return fromRef && toRef ? { ...w, fromRef, toRef } : null;
                    })
                    .filter((w): w is WbWire => w !== null),
                );
                setBoardId(nextBoard);
                setPendingPinRef(null);
              }}
              className="bg-transparent text-xs font-semibold text-[#0A2540] focus:outline-none"
            >
              {BOARDS_CATALOG.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.logicVoltage})
                </option>
              ))}
            </select>
          </div>

          {/* Wire Color Picker */}
          <div className="hidden items-center gap-1 rounded-lg border border-[#E6E8EC] bg-[#F7F8FA] px-2 py-1 sm:flex">
            <span className="mr-1 text-[10px] font-medium text-[#697386]">
              전선 색
            </span>
            {WIRE_COLORS.map((wc) => (
              <button
                key={wc.id}
                type="button"
                title={wc.label}
                onClick={() => setWireColor(wc.id)}
                className={`h-4 w-4 rounded-full border transition ${
                  wireColor === wc.id
                    ? 'scale-110 ring-2 ring-[#635BFF] ring-offset-1'
                    : 'border-black/15 opacity-75 hover:opacity-100'
                }`}
                style={{ backgroundColor: wc.id }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleClearWires}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#E6E8EC] bg-white px-2.5 text-xs font-medium text-[#425466] transition hover:bg-[#F7F8FA] hover:text-[#0A2540]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">배선 초기화</span>
          </button>
        </div>

        {/* Right: Run / Stop + Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`hidden rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold md:inline-flex ${
              analysis.status === 'danger'
                ? 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200'
                : analysis.status === 'warning'
                  ? 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200'
                  : analysis.status === 'ok'
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200'
                    : 'bg-[#F1F3F6] text-[#697386]'
            }`}
          >
            {analysis.status === 'danger'
              ? '위험 감지됨'
              : analysis.status === 'warning'
                ? '주의 필요'
                : analysis.status === 'ok'
                  ? '회로 안전'
                  : '배선 대기'}
          </span>

          <button
            type="button"
            onClick={() => setIsRunning((v) => !v)}
            className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3.5 text-xs font-semibold text-white transition ${
              isRunning
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-[#635BFF] hover:bg-[#5249F5]'
            }`}
          >
            {isRunning ? (
              <>
                <Square className="h-3 w-3 fill-current" />
                <span>전원 끄기</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 fill-current" />
                <span>전원 ON · 실행</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Mission Strip */}
      {activeMission && (
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#ECEEF2] bg-[#F7F8FA] px-4 py-2 sm:px-5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#635BFF]">
                <Wrench className="h-3 w-3" />
                {activeMission.title}
              </span>
              {completedMissionIds.includes(activeMission.id) && (
                <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" />
                  해결 완료 (+20 EXP)
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[11px] text-[#425466]">
              <GlossaryText text={activeMission.goalText} />
            </p>
          </div>
          <button
            type="button"
            onClick={() => loadMission(activeMission)}
            className="shrink-0 rounded-md border border-[#E6E8EC] bg-white px-2.5 py-1 text-[11px] font-medium text-[#0A2540] hover:bg-[#ECEEF2]"
          >
            미션 다시 불러오기
          </button>
        </div>
      )}

      {/* Main Split Workspace */}
      <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[46dvh_1fr] lg:grid-cols-[1.35fr_1fr] lg:grid-rows-1">
        {/* Left: Interactive SVG Wiring Bench */}
        <section className="relative min-h-0 w-full overflow-hidden border-b border-[#E6E8EC] lg:border-b-0 lg:border-r">
          <WorkbenchCanvasSvg
            boardId={boardId}
            components={components}
            wires={wires}
            pendingPinRef={pendingPinRef}
            analysis={analysis}
            isRunning={isRunning}
            buttonPressed={buttonPressed}
            potPercent={potPercent}
            sonarDistanceCm={sonarDistanceCm}
            onClickPin={handleClickPin}
            onRemoveWire={handleRemoveWire}
            onRemoveComponent={handleRemoveComponent}
            onToggleButtonPressed={() => setButtonPressed((v) => !v)}
          />

          {/* Bottom Canvas Hint */}
          <div className="pointer-events-none absolute bottom-2.5 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
            <div className="pointer-events-auto rounded-lg border border-[#E6E8EC] bg-white/95 px-2.5 py-1 text-[11px] font-medium text-[#425466] shadow-sm backdrop-blur-sm">
              {pendingPinRef ? (
                <span className="font-semibold text-[#635BFF]">
                  연결할 대상 핀을 클릭하세요 (ESC 취소)
                </span>
              ) : (
                <span>
                  핀 클릭 → 다른 핀 클릭 = 전선 연결 · 기존 선 클릭 = 삭제
                </span>
              )}
            </div>

            <div className="rounded-lg border border-[#E6E8EC] bg-white/95 px-2.5 py-1 font-mono text-[10px] font-semibold text-[#0A2540] shadow-sm">
              {activeBoard.shortName} ({activeBoard.logicVoltage}) · 선 {wires.length}개
            </div>
          </div>
        </section>

        {/* Right: Diagnostics, Parts Palette, Missions, Auto-Code */}
        <aside className="flex min-h-0 flex-col bg-white">
          {/* Underline Tabs */}
          <div className="flex shrink-0 items-center gap-5 border-b border-[#E6E8EC] px-4 sm:px-5">
            {(
              [
                { id: 'diagnostics', label: '회로 진단 · 부품' },
                { id: 'missions', label: `미션 (${WORKBENCH_MISSIONS.length})` },
                { id: 'code', label: '자동 코드 · 시리얼' },
              ] as const
            ).map((t) => {
              const active = rightTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setRightTab(t.id)}
                  className={`relative py-3 text-xs font-medium transition ${
                    active
                      ? 'text-[#0A2540]'
                      : 'text-[#697386] hover:text-[#0A2540]'
                  }`}
                >
                  {t.label}
                  {active && (
                    <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#635BFF]" />
                  )}
                </button>
              );
            })}
          </div>

          <div
            className="lab-scroll min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5"
            style={{ paddingBottom: 'calc(1.5rem + var(--safe-bottom))' }}
          >
            {rightTab === 'diagnostics' && (
              <div className="space-y-6">
                {/* 1. Live Diagnostics */}
                <section>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#697386]">
                    실시간 전기 · 핀 안전 진단
                  </div>

                  {analysis.diagnostics.length === 0 ? (
                    <div className="mt-2.5 rounded-xl border border-dashed border-[#D0D5DD] bg-[#F7F8FA] p-4 text-xs text-[#697386]">
                      아직 연결된 회로가 없습니다. 핀 두 개를 클릭해 연결하거나 상단 &ldquo;미션&rdquo; 탭에서 예제를 불러와 보세요.
                    </div>
                  ) : (
                    <div className="mt-2.5 space-y-2.5">
                      {analysis.diagnostics.map((diag) => {
                        const cls =
                          diag.severity === 'danger'
                            ? 'border-rose-200 bg-rose-50/70 text-rose-900'
                            : diag.severity === 'warning'
                              ? 'border-amber-200 bg-amber-50/70 text-amber-900'
                              : 'border-emerald-200 bg-emerald-50/70 text-emerald-900';

                        return (
                          <div
                            key={diag.id}
                            className={`rounded-xl border p-3.5 text-xs ${cls}`}
                          >
                            <div className="flex items-start gap-2">
                              {diag.severity === 'danger' ? (
                                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                              ) : diag.severity === 'warning' ? (
                                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                              ) : (
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="font-semibold">{diag.title}</div>
                                <p className="mt-1 leading-relaxed opacity-90">
                                  <GlossaryText text={diag.detail} />
                                </p>
                                {diag.relatedDay && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onOpenLab(
                                        diag.relatedDay!.moduleId,
                                        diag.relatedDay!.dayNum,
                                      )
                                    }
                                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#4F46E5] hover:underline"
                                  >
                                    <span>{diag.relatedDay.label}</span>
                                    <ArrowRight className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

                {/* 2. Interactive Environment Controls (when applicable parts are on bench) */}
                {(hasButton || hasSonar || hasPot) && (
                  <section className="space-y-3 border-t border-[#E6E8EC] pt-5">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#697386]">
                      실행 중 센서 · 입력 조작
                    </div>

                    {hasButton && (
                      <div className="flex items-center justify-between rounded-lg border border-[#E6E8EC] bg-[#F7F8FA] px-3 py-2.5 text-xs">
                        <span className="font-medium text-[#0A2540]">
                          택트 버튼 상태
                        </span>
                        <button
                          type="button"
                          onClick={() => setButtonPressed((v) => !v)}
                          className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                            buttonPressed
                              ? 'bg-[#635BFF] text-white'
                              : 'border border-[#E6E8EC] bg-white text-[#0A2540]'
                          }`}
                        >
                          {buttonPressed ? '눌림 (Pressed)' : '안 눌림 (누르기)'}
                        </button>
                      </div>
                    )}

                    {hasSonar && (
                      <div className="rounded-lg border border-[#E6E8EC] bg-[#F7F8FA] px-3 py-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#0A2540]">
                            앞쪽 장애물 거리 (HC-SR04)
                          </span>
                          <span className="font-mono font-semibold text-[#635BFF]">
                            {sonarDistanceCm} cm
                          </span>
                        </div>
                        <input
                          type="range"
                          min={5}
                          max={200}
                          value={sonarDistanceCm}
                          onChange={(e) =>
                            setSonarDistanceCm(Number(e.target.value))
                          }
                          className="studio-range mt-2.5 cursor-pointer"
                        />
                      </div>
                    )}

                    {hasPot && (
                      <div className="rounded-lg border border-[#E6E8EC] bg-[#F7F8FA] px-3 py-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#0A2540]">
                            가변저항 노브 회전 (서보/ADC 연동)
                          </span>
                          <span className="font-mono font-semibold text-[#635BFF]">
                            {potPercent}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={potPercent}
                          onChange={(e) => setPotPercent(Number(e.target.value))}
                          className="studio-range mt-2.5 cursor-pointer"
                        />
                      </div>
                    )}
                  </section>
                )}

                {/* 3. Component Palette */}
                <section className="border-t border-[#E6E8EC] pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#697386]">
                      부품 추가 팔레트 ({components.length}/{WORKBENCH_SLOTS.length}슬롯)
                    </span>
                    {slotsFull && (
                      <span className="text-[10px] font-medium text-amber-700">
                        부품 × 버튼으로 자리를 비우세요
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    {Object.values(WORKBENCH_COMPONENT_DEFS).map((def) => (
                      <button
                        key={def.type}
                        type="button"
                        disabled={slotsFull}
                        onClick={() => handleAddComponent(def.type)}
                        className="flex items-start gap-2 rounded-lg border border-[#E6E8EC] bg-white p-2.5 text-left transition hover:border-[#635BFF]/50 hover:bg-[#F7F8FA] disabled:opacity-45"
                      >
                        <Plus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#635BFF]" />
                        <div className="min-w-0">
                          <div className="truncate text-xs font-semibold text-[#0A2540]">
                            {def.shortName}
                          </div>
                          <div className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-[#697386]">
                            {def.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {rightTab === 'missions' && (
              <div className="space-y-3">
                <p className="text-xs leading-relaxed text-[#425466]">
                  고장난 회로나 실수하기 쉬운 배선 함정을 불러와 직접 고치고 실행해 보세요. 미션을 안전하게 성공하면 <strong className="text-[#635BFF]">+20 EXP</strong>가 적립됩니다.
                </p>

                <div className="divide-y divide-[#ECEEF2] border-y border-[#E6E8EC]">
                  {WORKBENCH_MISSIONS.map((mission) => {
                    const done = completedMissionIds.includes(mission.id);
                    const active = activeMissionId === mission.id;
                    return (
                      <div key={mission.id} className="py-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A2540]">
                              <span>{mission.title}</span>
                              {done && (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              )}
                            </div>
                            <p className="mt-0.5 text-[11px] text-[#697386]">
                              {mission.subtitle}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => loadMission(mission)}
                          className={`mt-2.5 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition ${
                            active
                              ? 'bg-[#635BFF] text-white'
                              : 'border border-[#E6E8EC] bg-[#F7F8FA] text-[#0A2540] hover:bg-[#ECEEF2]'
                          }`}
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>{mission.starterModeLabel}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {rightTab === 'code' && (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0A2540]">
                      <Code2 className="h-3.5 w-3.5 text-[#635BFF]" />
                      <span>{analysis.generatedCodeTitle}</span>
                    </div>
                    <span className="rounded bg-[#F1F3F6] px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase text-[#697386]">
                      {analysis.generatedCodeLanguage}
                    </span>
                  </div>
                  <pre className="lab-scroll overflow-x-auto rounded-xl bg-[#0A2540] p-3.5 font-mono text-[11px] leading-relaxed text-slate-100">
                    {analysis.generatedCode}
                  </pre>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 pb-2 text-xs font-semibold text-[#0A2540]">
                    <Terminal className="h-3.5 w-3.5 text-[#635BFF]" />
                    <span>가상 시리얼 모니터</span>
                  </div>
                  <div className="rounded-xl border border-[#E6E8EC] bg-[#0F172A] p-3 font-mono text-[11px] leading-relaxed text-emerald-300">
                    {analysis.serialPreviewLines.map((line, i) => (
                      <div
                        key={i}
                        className={
                          line.startsWith('[ERROR]') || line.startsWith('!')
                            ? 'text-rose-400'
                            : undefined
                        }
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
