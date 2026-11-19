import { BookOpen, Code2, Cpu, HelpCircle, Sliders } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { LabModule, LabPreviewState, TabId } from '../../types/lab';
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
}

const TABS: { id: TabId; label: string; Icon: typeof BookOpen }[] = [
  { id: 'overview', label: '개요', Icon: BookOpen },
  { id: 'pinout', label: '핀아웃', Icon: Cpu },
  { id: 'controls', label: '시뮬레이터', Icon: Sliders },
  { id: 'code', label: '코드', Icon: Code2 },
  { id: 'quiz', label: '퀴즈', Icon: HelpCircle },
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
}: InspectorPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [module.id, activeTab]);

  return (
    <aside className="flex h-full min-h-0 flex-col border-t border-slate-800 bg-[#0E1420] lg:border-l lg:border-t-0">
      {/* 5-Tab Bar (>=44px touch targets) */}
      <div
        role="tablist"
        aria-label="학습 패널 탭"
        className="lab-scroll flex shrink-0 items-center gap-1 overflow-x-auto border-b border-slate-800 bg-[#0B0F17]/80 px-2.5 py-2"
      >
        {TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => onSelectTab(id)}
              className={`flex min-h-[42px] shrink-0 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition ${
                active
                  ? 'border-sky-500/45 bg-sky-500/15 text-sky-200'
                  : 'border-transparent text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Scrollable Tab Content with Safe Area Bottom Padding */}
      <div
        ref={scrollRef}
        className="lab-scroll min-h-0 flex-1 overflow-y-auto p-3.5 sm:p-4"
        style={{ paddingBottom: 'calc(1rem + var(--safe-bottom))' }}
      >
        {activeTab === 'overview' && <OverviewTab module={module} />}
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
          />
        )}
        {activeTab === 'code' && <CodeTab module={module} />}
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
