import { ArrowRight, Check, CheckCircle2, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LabModule, TabId } from '../../types/lab';

interface CodeTabProps {
  module: LabModule;
  isCodeSolved: boolean;
  onSolveCodeChallenge: (moduleId: LabModule['id']) => void;
  onSelectTab: (tab: TabId) => void;
}

export function CodeTab({
  module,
  isCodeSolved,
  onSolveCodeChallenge,
  onSelectTab,
}: CodeTabProps) {
  const [copied, setCopied] = useState(false);
  const [pickedOption, setPickedOption] = useState<number | null>(
    isCodeSolved ? module.codeChallenge.correctIndex : null,
  );

  useEffect(() => {
    setPickedOption(isCodeSolved ? module.codeChallenge.correctIndex : null);
  }, [module.id, isCodeSolved, module.codeChallenge.correctIndex]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(module.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard fallback omitted for restricted contexts
    }
  };

  const handlePickFix = (idx: number) => {
    setPickedOption(idx);
    if (idx === module.codeChallenge.correctIndex) {
      onSolveCodeChallenge(module.id);
    }
  };

  const challenge = module.codeChallenge;
  const isCorrect = pickedOption === challenge.correctIndex;

  return (
    <div className="space-y-6">
      {/* Code Header & Stripe-dark Code Block */}
      <div>
        <div className="flex items-center justify-between pb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-[#0A2540]">
              {module.codeTitle}
            </span>
            <span className="rounded bg-[#F1F3F6] px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase text-[#697386]">
              {module.codeLanguage}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[#425466] transition hover:bg-[#F1F3F6] hover:text-[#0A2540]"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">복사됨</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>복사</span>
              </>
            )}
          </button>
        </div>

        <pre className="lab-scroll overflow-x-auto rounded-xl bg-[#0A2540] p-4 font-mono text-xs leading-relaxed text-slate-100">
          <code>{module.codeSnippet}</code>
        </pre>
      </div>

      {/* Inline Debugging Challenge */}
      <section className="border-t border-[#E6E8EC] pt-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-semibold text-[#0A2540]">
            버그 수정 챌린지
          </h3>
          <span
            className={`font-mono text-[11px] font-medium ${
              isCodeSolved || isCorrect ? 'text-emerald-600' : 'text-[#635BFF]'
            }`}
          >
            {isCodeSolved || isCorrect ? '완료 (+15 EXP)' : '+15 EXP'}
          </span>
        </div>

        <p className="mt-1.5 text-xs leading-relaxed text-[#425466]">
          {challenge.prompt}
        </p>

        <div className="mt-3 rounded-lg bg-[#0A2540] px-3 py-2 font-mono text-xs text-rose-300">
          - {challenge.buggyLine}
        </div>

        <div className="mt-3 space-y-1.5">
          {challenge.options.map((opt, idx) => {
            const chosen = pickedOption === idx;
            const right = idx === challenge.correctIndex;
            let cls =
              'border-[#E6E8EC] bg-white text-[#0A2540] hover:bg-[#F7F8FA]';
            if (chosen) {
              cls = right
                ? 'border-emerald-300 bg-emerald-50/70 text-emerald-900'
                : 'border-rose-300 bg-rose-50/70 text-rose-900';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePickFix(idx)}
                className={`flex min-h-[40px] w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left font-mono text-xs transition ${cls}`}
              >
                <span>{opt}</span>
                {chosen && right && (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                )}
              </button>
            );
          })}
        </div>

        {pickedOption !== null && (
          <p
            className={`mt-3 border-l-2 pl-3 text-xs leading-relaxed ${
              isCorrect
                ? 'border-emerald-500 text-emerald-900'
                : 'border-rose-500 text-rose-900'
            }`}
          >
            <strong>{isCorrect ? '정확합니다.' : '다시 선택해 보세요.'}</strong>{' '}
            {isCorrect
              ? challenge.explanation
              : '실제 보드나 공식에서 어떤 문제가 생길지 생각하며 다른 줄을 선택해 보세요.'}
          </p>
        )}
      </section>

      <div className="border-t border-[#E6E8EC] pt-5">
        <button
          type="button"
          onClick={() => onSelectTab('quiz')}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#635BFF] px-4 text-xs font-semibold text-white transition hover:bg-[#5249F5]"
        >
          <span>마지막 단계: 퀴즈 풀기</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
