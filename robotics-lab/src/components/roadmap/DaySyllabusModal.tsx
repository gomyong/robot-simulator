import { ArrowRight, CheckCircle2, Clock, X } from 'lucide-react';
import { useEffect } from 'react';
import { PHASE_LIST } from '../../data/roadmap45';
import { CurriculumDay, ModuleId } from '../../types/lab';
import { MascotSpeechBubble } from '../PixelMascot';

interface DaySyllabusModalProps {
  day: CurriculumDay | null;
  isCompleted: boolean;
  onClose: () => void;
  onOpenLab: (moduleId: ModuleId, dayNum: number) => void;
  onToggleDayComplete: (dayNum: number) => void;
}

const LESSON_STAGES = [
  '1. 실패 사례',
  '2. 아이소메트릭 3D 실험',
  '3. 공학 원리',
  '4. 코드 챌린지',
  '5. 디버깅 퀴즈',
];

export function DaySyllabusModal({
  day,
  isCompleted,
  onClose,
  onOpenLab,
  onToggleDayComplete,
}: DaySyllabusModalProps) {
  useEffect(() => {
    if (!day) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [day, onClose]);

  if (!day) return null;

  const phase = PHASE_LIST.find((p) => p.id === day.phaseId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2540]/25 p-3 backdrop-blur-[2px] sm:p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="day-modal-title"
    >
      <div
        className="lab-scroll max-h-[88dvh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#E6E8EC] bg-white p-6 shadow-[0_24px_48px_rgba(10,37,64,0.14)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Meta */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#697386]">
            <span className="font-semibold text-[#635BFF]">
              DAY {String(day.day).padStart(2, '0')}
            </span>
            {phase && (
              <>
                <span>·</span>
                <span>{phase.shortTitle}</span>
              </>
            )}
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {day.durationMin}m
            </span>
            {day.isMiniProject && (
              <>
                <span>·</span>
                <span className="font-semibold text-[#0A2540]">PROJECT</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="모달 닫기"
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#697386] transition hover:bg-[#F1F3F6] hover:text-[#0A2540]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h2
          id="day-modal-title"
          className="mt-3 text-lg font-semibold tracking-tight text-[#0A2540] sm:text-xl"
        >
          {day.title}
        </h2>
        <p className="mt-1 text-xs text-[#697386]">{day.subtitle}</p>

        {/* Clean Hairline Sections (No Nested Cards) */}
        <div className="mt-6 space-y-5 border-t border-[#E6E8EC] pt-5">
          {/* Fail First Hook */}
          <div className="border-l-2 border-rose-500 pl-3.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">
              이걸 모르면 생기는 고장
            </div>
            <p className="mt-1 text-xs leading-relaxed text-[#425466]">
              {day.failFirstHook}
            </p>
          </div>

          {/* 10-sec Analogy */}
          <MascotSpeechBubble mood="thinking" label="10초 일상 비유">
            {day.beginnerAnalogy}
          </MascotSpeechBubble>

          {/* Learning Goals */}
          <div className="border-t border-[#ECEEF2] pt-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#697386]">
              학습 목표
            </div>
            <ul className="mt-2.5 space-y-2">
              {day.learningGoals.map((goal, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-[#0A2540]"
                >
                  <span className="mt-0.5 font-mono text-[11px] font-semibold text-[#635BFF]">
                    0{idx + 1}
                  </span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cycle & Tags */}
          <div className="border-t border-[#ECEEF2] pt-4">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#697386]">
              {LESSON_STAGES.map((stage, i) => (
                <span key={stage} className="inline-flex items-center gap-1.5">
                  <span>{stage}</span>
                  {i < LESSON_STAGES.length - 1 && (
                    <span className="text-[#D0D5DD]">→</span>
                  )}
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {day.skillTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-[#F1F3F6] px-2 py-0.5 font-mono text-[10px] font-medium text-[#425466]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E6E8EC] pt-4">
          <button
            type="button"
            onClick={() => onToggleDayComplete(day.day)}
            className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition ${
              isCompleted
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA] hover:text-[#0A2540]'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{isCompleted ? '완료됨' : '완료 표시'}</span>
          </button>

          {day.linkedLabModuleId ? (
            <button
              type="button"
              onClick={() => {
                onOpenLab(day.linkedLabModuleId!, day.day);
                onClose();
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#635BFF] px-4 text-xs font-semibold text-white transition hover:bg-[#5249F5]"
            >
              <span>3D 실습실 열기</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] text-[#697386]">
                상세 시뮬레이터 순차 확장 예정
              </span>
              <button
                type="button"
                onClick={() => {
                  onOpenLab('day01_basics', 1);
                  onClose();
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#0A2540] px-3.5 text-xs font-semibold text-white transition hover:bg-[#163459]"
              >
                <span>Day 01 체험</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
