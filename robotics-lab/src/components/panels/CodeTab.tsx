import { Check, Code2, Copy } from 'lucide-react';
import { useState } from 'react';
import { LabModule } from '../../types/lab';

interface CodeTabProps {
  module: LabModule;
}

export function CodeTab({ module }: CodeTabProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(module.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard fallback omitted for restricted contexts
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-sky-400" />
          <span className="font-mono text-xs font-semibold text-slate-200">
            {module.codeTitle}
          </span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] uppercase text-slate-400">
            {module.codeLanguage}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 text-xs font-medium text-slate-200 transition hover:border-sky-500/50 hover:text-sky-200"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-300">복사됨</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>복사</span>
            </>
          )}
        </button>
      </div>

      <pre className="lab-scroll overflow-x-auto rounded-xl border border-slate-800 bg-[#070B12] p-4 font-mono text-xs leading-relaxed text-slate-200">
        <code>{module.codeSnippet}</code>
      </pre>
    </div>
  );
}
