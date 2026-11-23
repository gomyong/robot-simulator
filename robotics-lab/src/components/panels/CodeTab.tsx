import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Play,
  Square,
  Terminal,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LabModule, TabId } from '../../types/lab';
import { GlossaryText } from '../GlossaryText';

interface CodeTabProps {
  module: LabModule;
  isCodeSolved: boolean;
  onSolveCodeChallenge: (moduleId: LabModule['id']) => void;
  onSelectTab: (tab: TabId) => void;
  sketchRunning: boolean;
  onToggleSketch: () => void;
}

export function CodeTab({
  module,
  isCodeSolved,
  onSolveCodeChallenge,
  onSelectTab,
  sketchRunning,
  onToggleSketch,
}: CodeTabProps) {
  const [copied, setCopied] = useState(false);
  const [pickedOption, setPickedOption] = useState<number | null>(
    isCodeSolved ? module.codeChallenge.correctIndex : null,
  );
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [serialOpen, setSerialOpen] = useState(true);
  const [serialLogs, setSerialLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const lines = useMemo(
    () => module.codeSnippet.split('\n'),
    [module.codeSnippet],
  );

  // Executable non-empty, non-comment line indices
  const execLineIndices = useMemo(() => {
    const indices: number[] = [];
    lines.forEach((line, idx) => {
      const t = line.trim();
      if (t && !t.startsWith('//') && !t.startsWith('#') && !t.startsWith('/*')) {
        indices.push(idx);
      }
    });
    return indices.length > 0 ? indices : [0];
  }, [lines]);

  useEffect(() => {
    setPickedOption(isCodeSolved ? module.codeChallenge.correctIndex : null);
    setSerialLogs([]);
    setActiveLine(null);
  }, [module.id, isCodeSolved, module.codeChallenge.correctIndex]);

  useEffect(() => {
    if (!sketchRunning) {
      setActiveLine(null);
      return;
    }

    setSerialOpen(true);
    setSerialLogs([
      `[esptool] 스케치 컴파일 중 (${module.codeTitle})...`,
      `[UART] USB로 보드 연결 중 (115200 bps)... Writing 100%`,
      `[BOOT] Hard resetting via RTS pin... 실행 시작!`,
    ]);

    let step = 0;
    let tick = 0;
    const interval = window.setInterval(() => {
      const lineIdx = execLineIndices[step % execLineIndices.length];
      setActiveLine(lineIdx);
      step += 1;

      if (step % 2 === 0) {
        tick += 1;
        const msg =
          module.id === 'day08_board' || module.id === 'esp32'
            ? `[GPIO2] digitalWrite(2, ${tick % 2 === 1 ? 'HIGH' : 'LOW'}) -> 파란 LED ${tick % 2 === 1 ? 'ON' : 'OFF'}`
            : module.id === 'ultrasonic'
              ? `[HC-SR04] TRIG 10us -> ECHO=5800us | 거리 = 100.0 cm`
              : module.id === 'pid' || module.id === 'day31_pid_advanced'
                ? `[PID 50Hz] SP=60.0° | err=${(Math.sin(tick) * 0.8).toFixed(2)}° | u=${(Math.cos(tick) * 1.4).toFixed(2)}`
                : `[${module.dayLabel}] loop tick #${tick} OK (115200 bps)`;
        setSerialLogs((prev) => [...prev.slice(-18), msg]);
      }
    }, 360);

    return () => window.clearInterval(interval);
  }, [sketchRunning, module.id, module.codeTitle, module.dayLabel, execLineIndices]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [serialLogs]);

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
      {/* Code Header & Interactive Runner */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-[#0A2540]">
              {module.codeTitle}
            </span>
            <span className="rounded bg-[#F1F3F6] px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase text-[#697386]">
              {module.codeLanguage}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
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

            <button
              type="button"
              onClick={onToggleSketch}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-white transition ${
                sketchRunning
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-[#635BFF] hover:bg-[#5249F5]'
              }`}
            >
              {sketchRunning ? (
                <>
                  <Square className="h-3 w-3 fill-current" />
                  <span>중지</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 fill-current" />
                  <span>스케치 실행</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Line-by-Line Highlightable Code Surface */}
        <div className="lab-scroll overflow-x-auto rounded-xl bg-[#0A2540] py-3 font-mono text-xs leading-relaxed text-slate-100">
          {lines.map((line, idx) => {
            const isHighlighted = sketchRunning && activeLine === idx;
            return (
              <div
                key={idx}
                className={`flex px-3 transition-colors ${
                  isHighlighted
                    ? 'border-l-2 border-[#F59E0B] bg-[#F59E0B]/20 text-white'
                    : 'border-l-2 border-transparent'
                }`}
              >
                <span className="mr-3 w-5 shrink-0 select-none text-right text-[11px] text-slate-500">
                  {idx + 1}
                </span>
                <span className="whitespace-pre">{line || ' '}</span>
              </div>
            );
          })}
        </div>

        {/* Docked Virtual Serial Monitor (Learn-ESP32 Style) */}
        <div className="mt-2.5 overflow-hidden rounded-xl border border-[#E6E8EC] bg-[#F7F8FA]">
          <button
            type="button"
            onClick={() => setSerialOpen((v) => !v)}
            className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[11px] font-semibold text-[#0A2540] hover:bg-[#ECEEF2]/60"
          >
            <div className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-[#635BFF]" />
              <span>시리얼 모니터 (115200 bps)</span>
            </div>
            <span
              className={`font-mono text-[10px] font-semibold ${
                sketchRunning ? 'text-emerald-600' : 'text-[#697386]'
              }`}
            >
              {sketchRunning ? '● 실행 중' : '○ 대기'}
            </span>
          </button>

          {serialOpen && (
            <div className="lab-scroll max-h-[120px] overflow-y-auto border-t border-[#E6E8EC] bg-[#0F172A] px-3 py-2 font-mono text-[11px] leading-relaxed text-emerald-300">
              {serialLogs.length === 0 ? (
                <span className="text-slate-400">
                  상단 &quot;스케치 실행&quot; 버튼을 누르면 코드 라인 실행과 함께 시리얼 로그가 출력됩니다.
                </span>
              ) : (
                serialLogs.map((log, i) => (
                  <div key={i} className="whitespace-pre-wrap">
                    {log}
                  </div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          )}
        </div>
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
          <GlossaryText text={challenge.prompt} />
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
            {isCorrect ? (
              <GlossaryText text={challenge.explanation} />
            ) : (
              '실제 보드나 공식에서 어떤 문제가 생길지 생각하며 다른 줄을 선택해 보세요.'
            )}
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
