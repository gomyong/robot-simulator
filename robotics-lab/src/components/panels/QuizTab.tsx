import { CheckCircle2, HelpCircle, RotateCcw, XCircle } from 'lucide-react';
import { LabModule } from '../../types/lab';

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
  const answeredCount = module.quizzes.filter((q) => answers[q.id] !== undefined).length;
  const correctCount = module.quizzes.filter(
    (q) => answers[q.id] === q.correctIndex,
  ).length;

  return (
    <div className="space-y-4">
      {/* Score Summary Bar */}
      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="h-4 w-4 text-sky-400" />
          <div>
            <div className="text-xs font-bold text-slate-100">
              {module.shortTitle} 핵심 검증 퀴즈
            </div>
            <div className="mt-0.5 font-mono text-[11px] text-slate-400">
              진행 {answeredCount}/{module.quizzes.length} · 정답 {correctCount}문항
            </div>
          </div>
        </div>
        {answeredCount > 0 && (
          <button
            type="button"
            onClick={() => onResetModuleQuiz(module.quizzes.map((q) => q.id))}
            className="flex min-h-[36px] items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>다시 풀기</span>
          </button>
        )}
      </div>

      {/* Question Cards */}
      <div className="space-y-4">
        {module.quizzes.map((q, qIdx) => {
          const picked = answers[q.id];
          const isAnswered = picked !== undefined;
          const isCorrect = picked === q.correctIndex;

          return (
            <div
              key={q.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5 rounded-md border border-sky-500/35 bg-sky-500/15 px-1.5 py-0.5 font-mono text-[11px] font-bold text-sky-300">
                  Q{qIdx + 1}
                </span>
                <p className="text-xs font-semibold leading-relaxed text-slate-100">
                  {q.question}
                </p>
              </div>

              <div className="mt-3 space-y-2">
                {q.options.map((opt, optIdx) => {
                  const chosen = picked === optIdx;
                  const rightOption = optIdx === q.correctIndex;

                  let btnStyle =
                    'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900';
                  if (isAnswered) {
                    if (rightOption) {
                      btnStyle =
                        'border-emerald-500/60 bg-emerald-500/15 text-emerald-200';
                    } else if (chosen && !rightOption) {
                      btnStyle =
                        'border-rose-500/60 bg-rose-500/15 text-rose-200';
                    } else {
                      btnStyle =
                        'border-slate-800/60 bg-slate-950/30 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => onAnswer(q.id, optIdx)}
                      className={`flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-xs transition ${btnStyle}`}
                    >
                      <span className="leading-relaxed">
                        <span className="mr-2 font-mono font-bold text-slate-400">
                          {optIdx + 1}.
                        </span>
                        {opt}
                      </span>
                      {isAnswered && rightOption && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      )}
                      {isAnswered && chosen && !rightOption && (
                        <XCircle className="h-4 w-4 shrink-0 text-rose-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div
                  className={`mt-3 rounded-lg border p-3 text-xs leading-relaxed ${
                    isCorrect
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                  }`}
                >
                  <strong className="mr-1.5">
                    {isCorrect ? '정답입니다!' : `오답 (정답: ${q.correctIndex + 1}번)`}
                  </strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
