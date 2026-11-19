import { Cpu, Smartphone, Trophy } from 'lucide-react';
import { useState } from 'react';
import { LAB_MODULES } from '../../data/curriculum';
import { ModuleId } from '../../types/lab';

interface LabHeaderProps {
  activeModuleId: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  totalCorrect: number;
  totalQuestions: number;
}

export function LabHeader({
  activeModuleId,
  onSelectModule,
  totalCorrect,
  totalQuestions,
}: LabHeaderProps) {
  const [showPwaTip, setShowPwaTip] = useState(false);

  return (
    <header className="relative z-20 border-b border-slate-800 bg-[#0B0F17]/95 px-3 py-2 backdrop-blur-md sm:px-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/35 bg-sky-500/15 text-sky-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-slate-100 sm:text-base">
                로보틱스 디자인 랩
              </h1>
              <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-sky-300">
                M1 코어
              </span>
            </div>
            <p className="hidden text-[11px] text-slate-400 sm:block">
              ESP32 하드웨어 · 2축 기구학 · 초음파 ToF · 디지털 PID
            </p>
          </div>
        </div>

        {/* Status + iPad PWA Guide */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1.5 text-xs">
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-mono font-semibold text-slate-200">
              {totalCorrect}/{totalQuestions}
            </span>
            <span className="hidden text-slate-400 sm:inline">퀴즈</span>
          </div>

          <button
            type="button"
            onClick={() => setShowPwaTip((v) => !v)}
            className="flex min-h-[38px] items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900 px-2.5 text-xs font-medium text-slate-300 transition hover:border-sky-500/50 hover:text-sky-200"
          >
            <Smartphone className="h-3.5 w-3.5 text-sky-400" />
            <span className="hidden sm:inline">iPad 앱 설치</span>
          </button>
        </div>
      </div>

      {/* Horizontal Module Selector Pills (Scrollable on narrow iPad portrait) */}
      <nav
        aria-label="학습 모듈 선택"
        className="lab-scroll mt-2 flex items-center gap-1.5 overflow-x-auto pb-0.5"
      >
        {LAB_MODULES.map((mod) => {
          const active = mod.id === activeModuleId;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => onSelectModule(mod.id)}
              className={`min-h-[40px] shrink-0 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? 'border-sky-400/60 bg-sky-500/15 text-sky-200 shadow-[0_0_16px_rgba(56,189,248,0.12)]'
                  : 'border-slate-800 bg-slate-900/70 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {mod.shortTitle}
            </button>
          );
        })}
      </nav>

      {/* Lightweight iPad PWA Tip Popover */}
      {showPwaTip && (
        <div className="absolute right-3 top-14 z-30 w-72 rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 text-xs text-slate-300 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sky-300">iPad Safari PWA 설치 방법</span>
            <button
              type="button"
              onClick={() => setShowPwaTip(false)}
              className="text-slate-400 hover:text-slate-200"
            >
              닫기
            </button>
          </div>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-[11px] leading-relaxed text-slate-400">
            <li>iPad Safari에서 이 앱 주소를 엽니다.</li>
            <li>상단 공유 버튼(네모+위 화살표)을 탭합니다.</li>
            <li>
              <strong className="text-slate-200">홈 화면에 추가</strong>를 선택하면 전체 화면 앱처럼 오프라인에서도 실행됩니다.
            </li>
          </ol>
        </div>
      )}
    </header>
  );
}
