import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  FlaskConical,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { LAB_MODULES } from '../../data/curriculum';
import { PHASE0_WARMUP_TERMS } from '../../data/phase0Warmup';
import {
  PHASE_LIST,
  ROADMAP_45_DAYS,
  SKILL_DOMAINS,
} from '../../data/roadmap45';
import { CurriculumDay, ModuleId, PhaseId } from '../../types/lab';
import { DaySyllabusModal } from './DaySyllabusModal';

interface RoadmapHomeViewProps {
  completedDays: number[];
  warmupCompletedIds: string[];
  exp: number;
  wrongQuizCount: number;
  onOpenLab: (moduleId: ModuleId, dayNum?: number) => void;
  onOpenWrongQuizModule: () => void;
  onToggleDayComplete: (dayNum: number) => void;
  onOpenWarmup: (tab: 'warmup' | 'glossary', targetId?: string) => void;
}

export function RoadmapHomeView({
  completedDays,
  warmupCompletedIds,
  exp,
  wrongQuizCount,
  onOpenLab,
  onOpenWrongQuizModule,
  onToggleDayComplete,
  onOpenWarmup,
}: RoadmapHomeViewProps) {
  const [selectedPhase, setSelectedPhase] = useState<'all' | 'phase0' | PhaseId>(
    'all',
  );
  const [openDisclosure, setOpenDisclosure] = useState<
    'none' | 'guide' | 'skills'
  >('none');
  const [inspectingDay, setInspectingDay] = useState<CurriculumDay | null>(null);

  const nextRecommendedDay = useMemo(() => {
    const firstIncomplete = ROADMAP_45_DAYS.find(
      (d) => !completedDays.includes(d.day),
    );
    return firstIncomplete ?? ROADMAP_45_DAYS[0];
  }, [completedDays]);

  const visiblePhases = useMemo(() => {
    if (selectedPhase === 'all') return PHASE_LIST;
    if (selectedPhase === 'phase0') return [];
    return PHASE_LIST.filter((p) => p.id === selectedPhase);
  }, [selectedPhase]);

  const warmupClearedCount = PHASE0_WARMUP_TERMS.filter((t) =>
    warmupCompletedIds.includes(t.id),
  ).length;

  const level = Math.floor(exp / 100) + 1;
  const overallPct = Math.round(
    (completedDays.length / ROADMAP_45_DAYS.length) * 100,
  );

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white lg:flex-row">
      {/* Left Sidebar Rail (Recessed Luminance #F7F8FA, Zero Shadows — Linear Style) */}
      <aside className="lab-scroll hidden w-64 shrink-0 flex-col justify-between overflow-y-auto border-r border-[#E6E8EC] bg-[#F7F8FA] p-3.5 lg:flex">
        <div className="space-y-6">
          {/* Compact Progress Summary */}
          <div className="px-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#0A2540]">LV.{level}</span>
              <span className="font-mono text-[11px] tabular-nums text-[#697386]">
                {completedDays.length}/{ROADMAP_45_DAYS.length}일 · {exp} EXP
              </span>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#E6E8EC]">
              <div
                className="h-full bg-[#635BFF] transition-all"
                style={{ width: `${Math.max(overallPct, 2)}%` }}
              />
            </div>
          </div>

          {/* Phase Sidebar Navigation */}
          <div>
            <div className="px-2 text-[11px] font-medium text-[#697386]">
              커리큘럼 단계
            </div>
            <nav className="mt-1.5 space-y-0.5">
              <button
                type="button"
                onClick={() => setSelectedPhase('all')}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition ${
                  selectedPhase === 'all'
                    ? 'bg-[#ECEEF2] text-[#0A2540]'
                    : 'text-[#425466] hover:bg-black/[0.03] hover:text-[#0A2540]'
                }`}
              >
                <span>전체 45일 과정</span>
                <span className="font-mono text-[11px] text-[#697386]">45</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPhase('phase0')}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition ${
                  selectedPhase === 'phase0'
                    ? 'bg-[#ECEEF2] text-[#0A2540]'
                    : 'text-[#425466] hover:bg-black/[0.03] hover:text-[#0A2540]'
                }`}
              >
                <span className="truncate">0단계 · 3분 워밍업</span>
                <span className="font-mono text-[11px] text-[#635BFF]">
                  {warmupClearedCount}/10
                </span>
              </button>
              {PHASE_LIST.map((phase) => {
                const active = selectedPhase === phase.id;
                const phaseCount = ROADMAP_45_DAYS.filter(
                  (d) => d.phaseId === phase.id,
                ).length;
                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => setSelectedPhase(phase.id)}
                    className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition ${
                      active
                        ? 'bg-[#ECEEF2] text-[#0A2540]'
                        : 'text-[#425466] hover:bg-black/[0.03] hover:text-[#0A2540]'
                    }`}
                  >
                    <span className="truncate">{phase.shortTitle}</span>
                    <span className="font-mono text-[11px] text-[#697386]">
                      {phaseCount}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Live 3D Labs Quick Access (like Linear Favorites) */}
          <div>
            <div className="px-2 text-[11px] font-medium text-[#697386]">
              인터랙티브 실습실 ({LAB_MODULES.length})
            </div>
            <div className="mt-1.5 space-y-0.5">
              {LAB_MODULES.map((mod) => (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => onOpenLab(mod.id)}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs font-medium text-[#425466] transition hover:bg-black/[0.03] hover:text-[#0A2540]"
                >
                  <FlaskConical className="h-3.5 w-3.5 shrink-0 text-[#635BFF]" />
                  <span className="truncate">{mod.shortTitle}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#E6E8EC] px-2 pt-3 text-[11px] text-[#697386]">
          대학 커리큘럼 + 메이커 실전 기반
        </div>
      </aside>

      {/* Main Document Canvas (#FFFFFF, Pure Whitespace & Hairline Hierarchy) */}
      <div className="lab-scroll min-h-0 flex-1 overflow-y-auto bg-white">
        {/* Mobile/Tablet Compact Phase Strip */}
        <div className="lab-scroll flex items-center gap-1.5 overflow-x-auto border-b border-[#E6E8EC] bg-[#F7F8FA] px-4 py-2 lg:hidden">
          <button
            type="button"
            onClick={() => setSelectedPhase('all')}
            className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium ${
              selectedPhase === 'all'
                ? 'bg-white text-[#0A2540] shadow-[0_1px_2px_rgba(10,37,64,0.06)]'
                : 'text-[#697386]'
            }`}
          >
            전체 45일
          </button>
          <button
            type="button"
            onClick={() => setSelectedPhase('phase0')}
            className={`shrink-0 rounded-md px-2.5 py-1 font-mono text-xs font-medium ${
              selectedPhase === 'phase0'
                ? 'bg-white text-[#635BFF] shadow-[0_1px_2px_rgba(10,37,64,0.06)]'
                : 'text-[#697386]'
            }`}
          >
            P0
          </button>
          {PHASE_LIST.map((phase) => (
            <button
              key={phase.id}
              type="button"
              onClick={() => setSelectedPhase(phase.id)}
              className={`shrink-0 rounded-md px-2.5 py-1 font-mono text-xs font-medium ${
                selectedPhase === phase.id
                  ? 'bg-white text-[#0A2540] shadow-[0_1px_2px_rgba(10,37,64,0.06)]'
                  : 'text-[#697386]'
              }`}
            >
              P{phase.order}
            </button>
          ))}
        </div>

        <div
          className="mx-auto max-w-4xl px-5 py-7 sm:px-9 sm:py-10"
          style={{ paddingBottom: 'calc(3rem + var(--safe-bottom))' }}
        >
          {/* Editorial Intro Header (No Outer Card!) */}
          <header className="border-b border-[#E6E8EC] pb-8">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#635BFF]">
              45-Day Robotics Engineering Curriculum
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[#0A2540] sm:text-[28px]">
              실제 기판을 만나도 당황하지 않는 로보틱스 기초
            </h2>
            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-[#425466]">
              전기·회로 기초(Day 01)부터 ESP32 핀 제약, 기구학, PID 제어, ROS 2와 SLAM까지.
              매일 하나의 주제를 아이소메트릭 3D 실험실과 코드·트러블슈팅 퀴즈로 익힙니다.
            </p>

            {/* Primary CTA + Phase 0 Warmup + Quiet Secondary Disclosures */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (nextRecommendedDay.linkedLabModuleId) {
                    onOpenLab(
                      nextRecommendedDay.linkedLabModuleId,
                      nextRecommendedDay.day,
                    );
                  } else {
                    setInspectingDay(nextRecommendedDay);
                  }
                }}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#635BFF] px-4 text-xs font-semibold text-white transition hover:bg-[#5249F5]"
              >
                <span>
                  {completedDays.length === 0
                    ? 'Day 01 시작하기'
                    : `Day ${String(nextRecommendedDay.day).padStart(2, '0')} 이어서 학습`}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onOpenWarmup('warmup')}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E6E8EC] bg-[#F7F8FA] px-3.5 text-xs font-semibold text-[#0A2540] transition hover:border-[#635BFF]/40 hover:bg-[#EEF2FF]/70"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#635BFF]" />
                <span>
                  Phase 0 · 필수 용어 3분 워밍업 ({warmupClearedCount}/10)
                </span>
              </button>

              {wrongQuizCount > 0 && (
                <button
                  type="button"
                  onClick={onOpenWrongQuizModule}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#E6E8EC] bg-white px-3.5 text-xs font-medium text-[#0A2540] transition hover:bg-[#F7F8FA]"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-rose-600" />
                  <span>오답 복습 ({wrongQuizCount})</span>
                </button>
              )}

              <div className="flex items-center gap-3 pl-1 text-xs font-medium text-[#697386]">
                <button
                  type="button"
                  onClick={() =>
                    setOpenDisclosure((v) => (v === 'guide' ? 'none' : 'guide'))
                  }
                  className="inline-flex items-center gap-1 transition hover:text-[#0A2540]"
                >
                  <span>학습 방법</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      openDisclosure === 'guide' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <span className="text-[#E6E8EC]">|</span>
                <button
                  type="button"
                  onClick={() =>
                    setOpenDisclosure((v) =>
                      v === 'skills' ? 'none' : 'skills',
                    )
                  }
                  className="inline-flex items-center gap-1 transition hover:text-[#0A2540]"
                >
                  <span>18대 핵심 스킬 매핑</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      openDisclosure === 'skills' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Mobile Quick Live Labs Strip */}
            <div className="mt-5 flex flex-wrap items-center gap-1.5 lg:hidden">
              <span className="mr-1 text-[11px] font-medium text-[#697386]">
                3D 실습실:
              </span>
              {LAB_MODULES.map((mod) => (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => onOpenLab(mod.id)}
                  className="rounded-md border border-[#E6E8EC] bg-[#F7F8FA] px-2 py-1 text-[11px] font-medium text-[#0A2540]"
                >
                  {mod.shortTitle}
                </button>
              ))}
            </div>

            {/* Inline Disclosure: Learning Guide */}
            {openDisclosure === 'guide' && (
              <div className="mt-6 grid gap-4 rounded-lg bg-[#F7F8FA] p-4 text-xs text-[#425466] sm:grid-cols-3">
                <div>
                  <div className="font-mono text-[11px] font-semibold text-[#0A2540]">
                    01 · 직관 & 실패 사례
                  </div>
                  <p className="mt-1 leading-relaxed">
                    어려운 수식 대신 부품을 태워먹는 실제 고장 사례와 10초 일상 비유로 시작합니다.
                  </p>
                </div>
                <div>
                  <div className="font-mono text-[11px] font-semibold text-[#0A2540]">
                    02 · 아이소메트릭 3D 실험
                  </div>
                  <p className="mt-1 leading-relaxed">
                    정사영 3D 벤치 위에서 부품 결합과 전류/각도/파형 변화를 직접 조작해 검증합니다.
                  </p>
                </div>
                <div>
                  <div className="font-mono text-[11px] font-semibold text-[#0A2540]">
                    03 · 코드 & 디버깅 퀴즈
                  </div>
                  <p className="mt-1 leading-relaxed">
                    실제 보드 펌웨어의 버그를 고치고 트러블슈팅 퀴즈를 풀어 오답을 복습합니다.
                  </p>
                </div>
              </div>
            )}

            {/* Inline Disclosure: 18-Skill Coverage Matrix */}
            {openDisclosure === 'skills' && (
              <div className="mt-6 grid gap-x-8 gap-y-5 rounded-lg bg-[#F7F8FA] p-5 sm:grid-cols-2 lg:grid-cols-3">
                {SKILL_DOMAINS.map((domain) => (
                  <div key={domain.id}>
                    <div className="flex items-center justify-between border-b border-[#E6E8EC] pb-1.5">
                      <span className="text-xs font-semibold text-[#0A2540]">
                        {domain.titleKo}
                      </span>
                      <span className="font-mono text-[10px] text-[#697386]">
                        {domain.groupLabel === 'Hardware & Mechanics'
                          ? 'HW'
                          : 'SW'}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {domain.skills.map((skill) => (
                        <li
                          key={skill.name}
                          className="flex items-center justify-between gap-2 text-[11px] text-[#425466]"
                        >
                          <span className="truncate">{skill.name}</span>
                          <span className="shrink-0 font-mono text-[10px] text-[#635BFF]">
                            D{skill.days.join(',')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </header>

          {/* Linear-style Clean Hairline List of Phases & 45 Days */}
          <div className="mt-8 space-y-10">
            {(selectedPhase === 'all' || selectedPhase === 'phase0') && (
              <section>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold text-[#635BFF]">
                        Phase 0 · 약 3분
                      </span>
                      <h3 className="text-sm font-semibold text-[#0A2540] sm:text-base">
                        Day 01 시작 전 워밍업: 필수 용어 10개
                      </h3>
                    </div>
                    <p className="mt-0.5 text-xs text-[#697386]">
                      어려운 공학 단어 10개만 일상 비유로 3분 안에 훑고 시작하면 Day 01부터 막히지 않습니다.
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs tabular-nums text-[#697386]">
                      {warmupClearedCount}/10
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenWarmup('warmup')}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#0A2540] px-3 text-[11px] font-semibold text-white transition hover:bg-[#163459]"
                    >
                      <Sparkles className="h-3 w-3 text-[#A5B4FC]" />
                      <span>
                        {warmupClearedCount === 10
                          ? '다시 복습하기'
                          : '3분 워밍업 시작'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-[#ECEEF2] border-y border-[#E6E8EC]">
                  {PHASE0_WARMUP_TERMS.map((item) => {
                    const isDone = warmupCompletedIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onOpenWarmup('warmup', item.id)}
                        className="group flex w-full items-center justify-between gap-3 px-2 py-2.5 text-left transition hover:bg-[#F7F8FA]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 text-[#D0D5DD] group-hover:text-[#98A2B3]" />
                          )}

                          <span className="w-9 shrink-0 font-mono text-[11px] font-medium text-[#635BFF]">
                            T{String(item.order).padStart(2, '0')}
                          </span>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-baseline gap-2">
                              <span
                                className={`text-[13px] font-medium ${
                                  isDone
                                    ? 'text-[#697386]'
                                    : 'text-[#0A2540] group-hover:text-[#635BFF]'
                                }`}
                              >
                                {item.term}
                              </span>
                              <span className="font-mono text-[11px] text-[#697386]">
                                {item.english}
                              </span>
                            </div>
                            <div className="truncate text-[11px] text-[#697386]">
                              {item.oneLiner}
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <span className="hidden rounded bg-[#EEF2FF] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#4F46E5] sm:inline-block">
                            3분 카드
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 text-[#CBD5E1] transition group-hover:translate-x-0.5 group-hover:text-[#697386]" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {visiblePhases.map((phase) => {
              const phaseDays = ROADMAP_45_DAYS.filter(
                (d) => d.phaseId === phase.id,
              );
              const clearedInPhase = phaseDays.filter((d) =>
                completedDays.includes(d.day),
              ).length;

              return (
                <section key={phase.id}>
                  {/* Section Heading (No Outer Box) */}
                  <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold text-[#635BFF]">
                          {phase.dayRange}
                        </span>
                        <h3 className="text-sm font-semibold text-[#0A2540] sm:text-base">
                          {phase.title}
                        </h3>
                      </div>
                      <p className="mt-0.5 text-xs text-[#697386]">
                        {phase.goal}
                      </p>
                    </div>
                    <span className="font-mono text-xs tabular-nums text-[#697386]">
                      {clearedInPhase}/{phaseDays.length}
                    </span>
                  </div>

                  {/* Clean Hairline Rows (Zero Card Borders, Zero Shadows) */}
                  <div className="divide-y divide-[#ECEEF2] border-y border-[#E6E8EC]">
                    {phaseDays.map((dayItem) => {
                      const isDone = completedDays.includes(dayItem.day);
                      const hasLiveLab = Boolean(dayItem.linkedLabModuleId);

                      return (
                        <button
                          key={dayItem.day}
                          type="button"
                          onClick={() => setInspectingDay(dayItem)}
                          className="group flex w-full items-center justify-between gap-3 py-3 px-2 text-left transition hover:bg-[#F7F8FA]"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                            ) : (
                              <Circle className="h-4 w-4 shrink-0 text-[#D0D5DD] group-hover:text-[#98A2B3]" />
                            )}

                            <span className="w-9 shrink-0 font-mono text-[11px] font-medium text-[#697386]">
                              D{String(dayItem.day).padStart(2, '0')}
                            </span>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`truncate text-[13px] font-medium ${
                                    isDone
                                      ? 'text-[#697386] line-through'
                                      : 'text-[#0A2540] group-hover:text-[#635BFF]'
                                  }`}
                                >
                                  {dayItem.title}
                                </span>
                              </div>
                              <div className="truncate text-[11px] text-[#697386]">
                                {dayItem.subtitle}
                              </div>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2.5">
                            {dayItem.isMiniProject && (
                              <span className="hidden rounded bg-[#F1F3F6] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#425466] sm:inline-block">
                                PROJECT
                              </span>
                            )}
                            {hasLiveLab && (
                              <span className="inline-flex items-center gap-1 rounded bg-[#EEF2FF] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#4F46E5]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#635BFF]" />
                                LIVE LAB
                              </span>
                            )}
                            <span className="hidden w-8 text-right font-mono text-[11px] tabular-nums text-[#98A2B3] sm:inline-block">
                              {dayItem.durationMin}m
                            </span>
                            <ChevronRight className="h-3.5 w-3.5 text-[#CBD5E1] transition group-hover:translate-x-0.5 group-hover:text-[#697386]" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>

      {/* Day Syllabus & Lab Launcher Modal */}
      <DaySyllabusModal
        day={inspectingDay}
        isCompleted={
          inspectingDay ? completedDays.includes(inspectingDay.day) : false
        }
        onClose={() => setInspectingDay(null)}
        onOpenLab={onOpenLab}
        onToggleDayComplete={onToggleDayComplete}
      />
    </div>
  );
}
