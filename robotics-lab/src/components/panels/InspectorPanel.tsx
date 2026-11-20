import { CheckCircle2, ChevronDown, Circle, Target } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { LabModule, LabPreviewState, ModuleId, TabId } from '../../types/lab';
import { CodeTab } from './CodeTab';
import { ControlsTab } from './ControlsTab';
import { OverviewTab } from './OverviewTab';
import { PinoutTab } from './PinoutTab';
import { QuizTab } from './QuizTab';

interface InspectorPanelProps {
  module: LabModule;
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  selectedPinId: string | null;
  onSelectPin: (pinId: string) => void;
  preview: LabPreviewState;
  onChangePreview: (patch: Partial<LabPreviewState>) => void;
  quizAnswers: Record<string, number>;
  onAnswerQuiz: (questionId: string, optionIndex: number) => void;
  onResetModuleQuiz: (questionIds: string[]) => void;
  completedMissions: string[];
  onToggleMission: (missionId: string) => void;
  solvedCodeChallenges: string[];
  onSolveCodeChallenge: (moduleId: ModuleId) => void;
  sketchRunning: boolean;
  onToggleSketch: () => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: '개요·직관' },
  { id: 'controls', label: '직접 실습' },
  { id: 'pinout', label: '핀·배선' },
  { id: 'code', label: '코드 랩' },
  { id: 'quiz', label: '퀴즈' },
];

export function InspectorPanel({
  module,
  activeTab,
  onSelectTab,
  selectedPinId,
  onSelectPin,
  preview,
  onChangePreview,
  quizAnswers,
  onAnswerQuiz,
  onResetModuleQuiz,
  completedMissions,
  onToggleMission,
  solvedCodeChallenges,
  onSolveCodeChallenge,
  sketchRunning,
  onToggleSketch,
}: InspectorPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showMissions, setShowMissions] = useState(true);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [module.id, activeTab]);

  const doneCount = module.guidedMissions.filter((m) =>
    completedMissions.includes(m.id),
  ).length;

  return (
    <aside className="flex h-full min-h-0 flex-col border-t border-[#E6E8EC] bg-white lg:border-l lg:border-t-0">
      {/* Minimal Underline Tab Bar */}
      <div
        role="tablist"
        aria-label="학습 패널 탭"
        className="lab-scroll flex shrink-0 items-center gap-5 overflow-x-auto border-b border-[#E6E8EC] bg-white px-4 sm:px-5"
      >
        {TABS.map(({ id, label }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => onSelectTab(id)}
              className={`relative shrink-0 py-3 text-xs font-medium transition ${
                active
                  ? 'text-[#0A2540]'
                  : 'text-[#697386] hover:text-[#0A2540]'
              }`}
            >
              {label}
              {active && (
                <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#635BFF]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Subtle Recessed Mission Checklist Strip (Luminance Depth, No Cards) */}
      <div className="shrink-0 border-b border-[#E6E8EC] bg-[#F7F8FA] px-4 py-2 sm:px-5">
        <button
          type="button"
          onClick={() => setShowMissions((v) => !v)}
          className="flex w-full items-center justify-between py-0.5 text-left"
        >
          <div className="flex items-center gap-2">
            <Target className="h-3.5 w-3.5 text-[#635BFF]" />
            <span className="text-xs font-semibold text-[#0A2540]">
              실습 미션
            </span>
            <span className="font-mono text-[11px] tabular-nums text-[#697386]">
              {doneCount}/{module.guidedMissions.length}
            </span>
          </div>
          <ChevronDown
            className={`h-3.5 w-3.5 text-[#697386] transition-transform ${
              showMissions ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showMissions && (
          <div className="mt-2 divide-y divide-[#ECEEF2] border-t border-[#E6E8EC]">
            {module.guidedMissions.map((mission) => {
              const done = completedMissions.includes(mission.id);
              return (
                <button
                  key={mission.id}
                  type="button"
                  onClick={() => onToggleMission(mission.id)}
                  className="flex w-full items-start gap-2.5 py-2 text-left text-[11px] transition hover:opacity-80"
                >
                  {done ? (
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  ) : (
                    <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#CBD5E1]" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div
                      className={`font-medium ${
                        done
                          ? 'text-[#697386] line-through'
                          : 'text-[#0A2540]'
                      }`}
                    >
                      {mission.title}
                    </div>
                    {!done && (
                      <div className="mt-0.5 text-[10px] text-[#697386]">
                        {mission.hint}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Clean White Scrollable Reading / Lab Surface */}
      <div
        ref={scrollRef}
        className="lab-scroll min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6"
        style={{ paddingBottom: 'calc(1.5rem + var(--safe-bottom))' }}
      >
        {activeTab === 'overview' && (
          <OverviewTab module={module} onSelectTab={onSelectTab} />
        )}
        {activeTab === 'pinout' && (
          <PinoutTab
            module={module}
            selectedPinId={selectedPinId}
            onSelectPin={onSelectPin}
            wifiActive={preview.wifiActive}
          />
        )}
        {activeTab === 'controls' && (
          <ControlsTab
            module={module}
            preview={preview}
            onChangePreview={onChangePreview}
            onSelectTab={onSelectTab}
          />
        )}
        {activeTab === 'code' && (
          <CodeTab
            module={module}
            isCodeSolved={solvedCodeChallenges.includes(module.id)}
            onSolveCodeChallenge={onSolveCodeChallenge}
            onSelectTab={onSelectTab}
            sketchRunning={sketchRunning}
            onToggleSketch={onToggleSketch}
          />
        )}
        {activeTab === 'quiz' && (
          <QuizTab
            module={module}
            answers={quizAnswers}
            onAnswer={onAnswerQuiz}
            onResetModuleQuiz={onResetModuleQuiz}
          />
        )}
      </div>
    </aside>
  );
}
