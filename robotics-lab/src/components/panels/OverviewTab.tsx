import { ArrowRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { LabModule, TabId } from '../../types/lab';
import { MathBlock } from '../MathBlock';
import { MascotSpeechBubble } from '../PixelMascot';

interface OverviewTabProps {
  module: LabModule;
  onSelectTab: (tab: TabId) => void;
}

const DOT_TONE = {
  cyan: 'bg-sky-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
};

const TEXT_TONE = {
  cyan: 'text-[#0A2540]',
  emerald: 'text-emerald-700',
  amber: 'text-amber-700',
  rose: 'text-rose-700',
};

export function OverviewTab({ module, onSelectTab }: OverviewTabProps) {
  const [showFormulas, setShowFormulas] = useState(true);

  return (
    <div className="space-y-7">
      {/* 1. Editorial Header (Directly on White Canvas — No Outer Box!) */}
      <header>
        <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-[#635BFF]">
          <span>{module.dayLabel}</span>
          <span className="text-[#D0D5DD]">·</span>
          <span className="text-[#697386]">{module.badge}</span>
        </div>
        <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-[#0A2540] sm:text-xl">
          {module.title}
        </h2>
        <p className="mt-0.5 text-xs text-[#697386]">{module.subtitle}</p>
        <p className="mt-3 text-[13px] leading-relaxed text-[#425466]">
          {module.overviewSummary}
        </p>
      </header>

      {/* 2. Analogy & Fail-First Editorial Callouts (Left Hairline Accents, Zero Cards) */}
      <div className="space-y-4 border-t border-[#ECEEF2] pt-5">
        <MascotSpeechBubble mood="happy" label="10초 일상 비유">
          {module.beginnerAnalogy}
        </MascotSpeechBubble>

        <div className="border-l-2 border-rose-500 py-0.5 pl-3.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">
            이걸 모르면 생기는 고장
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[#425466]">
            {module.failFirstHook}
          </p>
        </div>
      </div>

      {/* 3. Key Specs Hairline Table Grid (Instead of 4 Boxed Cards) */}
      <section className="grid grid-cols-2 border-y border-[#E6E8EC] bg-[#F7F8FA]/50">
        {module.specs.map((spec, idx) => {
          const valTone = TEXT_TONE[spec.tone ?? 'cyan'];
          const borderClasses = `${idx % 2 === 0 ? 'border-r border-[#E6E8EC]' : ''} ${
            idx < 2 ? 'border-b border-[#E6E8EC]' : ''
          }`;
          return (
            <div key={spec.label} className={`p-3.5 ${borderClasses}`}>
              <div className="text-[11px] font-medium text-[#697386]">
                {spec.label}
              </div>
              <div className={`mt-1 font-mono text-sm font-semibold ${valTone}`}>
                {spec.value}
              </div>
              {spec.note && (
                <div className="mt-0.5 text-[11px] text-[#697386]">
                  {spec.note}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* 4. Engineering Highlights (Clean Hairline List) */}
      <section>
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#697386]">
          핵심 공학 원리 & 설계 주의점
        </h3>
        <div className="mt-2.5 divide-y divide-[#ECEEF2] border-y border-[#E6E8EC]">
          {module.highlights.map((item) => (
            <div key={item.title} className="py-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0A2540]">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT_TONE[item.tone]}`}
                />
                <span>{item.title}</span>
              </div>
              <p className="mt-1.5 pl-3.5 text-xs leading-relaxed text-[#425466]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. KaTeX Equations (Clean Disclosure) */}
      {module.formulas.length > 0 && (
        <section className="border-t border-[#E6E8EC] pt-5">
          <button
            type="button"
            onClick={() => setShowFormulas((v) => !v)}
            className="flex w-full items-center justify-between text-left"
          >
            <div>
              <h3 className="text-xs font-semibold text-[#0A2540]">
                공학 수식 모델 ({module.formulas.length})
              </h3>
              <p className="text-[11px] text-[#697386]">
                직접 실습 후 펼쳐보며 수식과 연결해 보세요
              </p>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-[#697386] transition-transform ${
                showFormulas ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showFormulas && (
            <div className="mt-4 space-y-4">
              {module.formulas.map((f) => (
                <div key={f.title}>
                  <div className="text-xs font-medium text-[#0A2540]">
                    {f.title}
                  </div>
                  <MathBlock latex={f.latex} displayMode />
                  <p className="text-xs text-[#697386]">{f.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 6. Next Step CTA */}
      <div className="border-t border-[#E6E8EC] pt-5">
        <button
          type="button"
          onClick={() => onSelectTab('controls')}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#635BFF] px-4 text-xs font-semibold text-white transition hover:bg-[#5249F5]"
        >
          <span>다음 단계: 직접 실습해보기</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
