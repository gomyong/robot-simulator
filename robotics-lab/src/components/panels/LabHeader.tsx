import { BookOpen, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { LAB_MODULES } from '../../data/curriculum';
import { AppView, ModuleId } from '../../types/lab';
import { PixelMascot } from '../PixelMascot';

interface LabHeaderProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  activeModuleId: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  exp: number;
  completedDaysCount: number;
  totalCorrect: number;
  totalQuestions: number;
  warmupDoneCount: number;
  onOpenGlossary: (tab: 'warmup' | 'glossary') => void;
}

export function LabHeader({
  activeView,
  onSelectView,
  activeModuleId,
  onSelectModule,
  exp,
  completedDaysCount,
  totalCorrect,
  totalQuestions,
  warmupDoneCount,
  onOpenGlossary,
}: LabHeaderProps) {
  const [showPwaTip, setShowPwaTip] = useState(false);

  return (
    <header className="relative z-20 border-b border-[#E6E8EC] bg-[#F7F8FA]">
      <div className="flex h-12 items-center justify-between gap-3 px-3 sm:px-5">
        {/* Left: Minimal Brand + Segmented View Switch */}
        <div className="flex shrink-0 items-center gap-2.5 sm:gap-4">
          <button
            type="button"
            onClick={() => onSelectView('roadmap')}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap text-left transition hover:opacity-80"
          >
            <PixelMascot mood="idle" size="sm" />
            <span className="hidden text-sm font-semibold tracking-tight text-[#0A2540] sm:inline">
              Robotics Lab
            </span>
          </button>

          <span className="hidden h-4 w-px bg-[#E6E8EC] sm:block" />

          <nav
            aria-label="화면 전환"
            className="flex shrink-0 items-center gap-1 rounded-lg bg-[#ECEEF2] p-0.5"
          >
            <button
              type="button"
              onClick={() => onSelectView('roadmap')}
              className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition ${
                activeView === 'roadmap'
                  ? 'bg-white text-[#0A2540] shadow-[0_1px_2px_rgba(10,37,64,0.06)]'
                  : 'text-[#697386] hover:text-[#0A2540]'
              }`}
            >
              커리큘럼
            </button>
            <button
              type="button"
              onClick={() => onSelectView('lab')}
              className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition ${
                activeView === 'lab'
                  ? 'bg-white text-[#0A2540] shadow-[0_1px_2px_rgba(10,37,64,0.06)]'
                  : 'text-[#697386] hover:text-[#0A2540]'
              }`}
            >
              3D 실습실
            </button>
            <button
              type="button"
              onClick={() => onSelectView('boards')}
              className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition ${
                activeView === 'boards'
                  ? 'bg-white text-[#0A2540] shadow-[0_1px_2px_rgba(10,37,64,0.06)]'
                  : 'text-[#697386] hover:text-[#0A2540]'
              }`}
            >
              <span>보드 도감</span>
              <span className="hidden rounded bg-[#EEF2FF] px-1 py-0.2 font-mono text-[9px] font-semibold text-[#4F46E5] sm:inline">
                8종
              </span>
            </button>
            <button
              type="button"
              onClick={() => onSelectView('workbench')}
              className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition ${
                activeView === 'workbench'
                  ? 'bg-white text-[#0A2540] shadow-[0_1px_2px_rgba(10,37,64,0.06)]'
                  : 'text-[#697386] hover:text-[#0A2540]'
              }`}
            >
              <span>조립 작업대</span>
            </button>
          </nav>
        </div>

        {/* Right: Quiet Monospace Telemetry + iPad Install */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2.5 whitespace-nowrap font-mono text-[11px] tabular-nums text-[#697386] lg:flex">
            <span>
              Day <strong className="font-semibold text-[#0A2540]">{completedDaysCount}</strong>/45
            </span>
            <span className="text-[#D0D5DD]">·</span>
            <span>
              Quiz <strong className="font-semibold text-[#0A2540]">{totalCorrect}</strong>/{totalQuestions}
            </span>
            <span className="text-[#D0D5DD]">·</span>
            <span className="font-semibold text-[#635BFF]">{exp} EXP</span>
          </div>

          <button
            type="button"
            onClick={() =>
              onOpenGlossary(warmupDoneCount < 10 ? 'warmup' : 'glossary')
            }
            className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-[#E6E8EC] bg-white px-2.5 text-xs font-medium text-[#0A2540] transition hover:bg-[#ECEEF2]"
          >
            <BookOpen className="h-3.5 w-3.5 text-[#635BFF]" />
            <span>용어 사전</span>
            {warmupDoneCount < 10 && (
              <span className="hidden rounded bg-[#EEF2FF] px-1 py-0.5 font-mono text-[10px] font-semibold text-[#4F46E5] sm:inline">
                {warmupDoneCount}/10
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowPwaTip((v) => !v)}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2 text-xs font-medium text-[#425466] transition hover:bg-[#ECEEF2] hover:text-[#0A2540]"
          >
            <Smartphone className="h-3.5 w-3.5 text-[#697386]" />
            <span className="hidden md:inline">iPad 앱 설치</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation strip inside Lab View (Underline tabs, zero cards) */}
      {activeView === 'lab' && (
        <nav
          aria-label="실습 모듈 선택"
          className="lab-scroll flex items-center gap-5 overflow-x-auto border-t border-[#E6E8EC] bg-white px-4 sm:px-5"
        >
          {LAB_MODULES.map((mod) => {
            const active = mod.id === activeModuleId;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onSelectModule(mod.id)}
                className={`relative shrink-0 py-2.5 text-xs font-medium transition ${
                  active
                    ? 'text-[#0A2540]'
                    : 'text-[#697386] hover:text-[#0A2540]'
                }`}
              >
                {mod.shortTitle}
                {active && (
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#635BFF]" />
                )}
              </button>
            );
          })}
        </nav>
      )}

      {/* Minimal Floating PWA Tip */}
      {showPwaTip && (
        <div className="absolute right-4 top-12 z-30 w-72 rounded-xl border border-[#E6E8EC] bg-white p-4 text-xs text-[#425466] shadow-[0_16px_36px_rgba(10,37,64,0.12)]">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#0A2540]">
              iPad Safari 앱 설치
            </span>
            <button
              type="button"
              onClick={() => setShowPwaTip(false)}
              className="text-[11px] font-medium text-[#697386] hover:text-[#0A2540]"
            >
              닫기
            </button>
          </div>
          <ol className="mt-2.5 list-decimal space-y-1.5 pl-4 text-[11px] leading-relaxed text-[#425466]">
            <li>iPad Safari에서 이 페이지를 엽니다.</li>
            <li>상단 공유 버튼을 탭합니다.</li>
            <li>
              <strong className="text-[#0A2540]">홈 화면에 추가</strong>를 선택하면 오프라인 앱으로 동작합니다.
            </li>
          </ol>
        </div>
      )}
    </header>
  );
}
