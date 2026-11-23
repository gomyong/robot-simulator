import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { LabModule } from '../../types/lab';
import { GlossaryText } from '../GlossaryText';

interface QuizTabProps {
  module: LabModule;
  answers: Record<string, number>;
  onAnswer: (questionId: string, optionIndex: number) => void;
  onResetModuleQuiz: (questionIds: string[]) => void;
}

export function QuizTab({
  module,
  answers,
  onAnswer,
  onResetModuleQuiz,
}: QuizTabProps) {
  const answeredCount = module.quizzes.filter(
    (q) => answers[q.id] !== undefined,
  ).length;
  const correctCount = module.quizzes.filter(
    (q) => answers[q.id] === q.correctIndex,
  ).length;

  return (
    <div className="space-y-5">
      {/* Clean Header Row */}
      <div className="flex items-center justify-between gap-2 border-b border-[#E6E8EC] pb-3.5">
        <div>
          <div className="text-xs font-semibold text-[#0A2540]">
            {module.shortTitle} 검증 퀴즈
          </div>
          <div className="mt-0.5 font-mono text-[11px] text-[#697386]">
            진행 {answeredCount}/{module.quizzes.length} · 정답 {correctCount} (+20 EXP)
          </div>
        </div>
        {answeredCount > 0 && (
          <button
            type="button"
            onClick={() => onResetModuleQuiz(module.quizzes.map((q) => q.id))}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[#425466] transition hover:bg-[#F1F3F6] hover:text-[#0A2540]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>초기화</span>
          </button>
        )}
      </div>

      {/* Hairline-Separated Questions (Zero Outer Card Soup) */}
      <div className="divide-y divide-[#E6E8EC]">
        {module.quizzes.map((q, qIdx) => {
          const picked = answers[q.id];
          const isAnswered = picked !== undefined;
          const isCorrect = picked === q.correctIndex;

          return (
            <div key={q.id} className="py-5 first:pt-1">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 font-mono text-[11px] font-semibold text-[#635BFF]">
                  Q{qIdx + 1}
                </span>
                <p className="text-xs font-semibold leading-relaxed text-[#0A2540]">
                  <GlossaryText text={q.question} />
                </p>
              </div>

              <div className="mt-3 space-y-1.5">
                {q.options.map((opt, optIdx) => {
                  const chosen = picked === optIdx;
                  const rightOption = optIdx === q.correctIndex;

                  let btnStyle =
                    'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA] hover:text-[#0A2540]';
                  if (isAnswered) {
                    if (rightOption) {
                      btnStyle =
                        'border-emerald-300 bg-emerald-50/60 text-emerald-900';
                    } else if (chosen && !rightOption) {
                      btnStyle =
                        'border-rose-300 bg-rose-50/60 text-rose-900';
                    } else {
                      btnStyle =
                        'border-[#ECEEF2] bg-[#F7F8FA]/50 text-[#98A2B3]';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => onAnswer(q.id, optIdx)}
                      className={`flex min-h-[40px] w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs font-medium transition ${btnStyle}`}
                    >
                      <span className="leading-relaxed">
                        <span className="mr-2 font-mono text-[11px] text-[#98A2B3]">
                          {optIdx + 1}.
                        </span>
                        {opt}
                      </span>
                      {isAnswered && rightOption && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      )}
                      {isAnswered && chosen && !rightOption && (
                        <XCircle className="h-4 w-4 shrink-0 text-rose-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <p
                  className={`mt-3 border-l-2 pl-3 text-xs leading-relaxed ${
                    isCorrect
                      ? 'border-emerald-500 text-[#425466]'
                      : 'border-amber-500 text-[#425466]'
                  }`}
                >
                  <strong className="mr-1.5 text-[#0A2540]">
                    {isCorrect
                      ? '정답 (+20 EXP)'
                      : `오답 (정답: ${q.correctIndex + 1}번 · 복습 등록)`}
                  </strong>
                  <GlossaryText text={q.explanation} />
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
