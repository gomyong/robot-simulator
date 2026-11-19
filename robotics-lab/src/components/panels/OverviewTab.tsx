import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-react';
import { LabModule } from '../../types/lab';
import { MathBlock } from '../MathBlock';

interface OverviewTabProps {
  module: LabModule;
}

const TONE_STYLES = {
  cyan: {
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/10',
    text: 'text-sky-300',
    Icon: Info,
  },
  emerald: {
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-300',
    Icon: CheckCircle2,
  },
  amber: {
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    text: 'text-amber-300',
    Icon: AlertTriangle,
  },
  rose: {
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/10',
    text: 'text-rose-300',
    Icon: ShieldAlert,
  },
};

export function OverviewTab({ module }: OverviewTabProps) {
  return (
    <div className="space-y-5">
      {/* Header Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-sky-500/35 bg-sky-500/15 px-2 py-0.5 text-[11px] font-semibold text-sky-300">
            {module.badge}
          </span>
          <span className="rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 font-mono text-[11px] text-slate-300">
            {module.milestoneTag}
          </span>
        </div>
        <h2 className="mt-2.5 text-lg font-bold tracking-tight text-slate-100">
          {module.title}
        </h2>
        <p className="mt-0.5 text-xs text-slate-400">{module.subtitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          {module.overviewSummary}
        </p>
      </div>

      {/* Spec Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {module.specs.map((spec) => {
          const tone = TONE_STYLES[spec.tone ?? 'cyan'];
          return (
            <div
              key={spec.label}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-3"
            >
              <div className="text-[11px] text-slate-400">{spec.label}</div>
              <div className={`mt-1 font-mono text-sm font-bold ${tone.text}`}>
                {spec.value}
              </div>
              {spec.note && (
                <div className="mt-0.5 text-[11px] text-slate-500">{spec.note}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Engineering Highlights */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          핵심 공학 원리 & 설계 주의점
        </h3>
        {module.highlights.map((item) => {
          const style = TONE_STYLES[item.tone];
          const Icon = style.Icon;
          return (
            <div
              key={item.title}
              className={`rounded-xl border ${style.border} ${style.bg} p-3.5`}
            >
              <div className={`flex items-center gap-2 text-xs font-bold ${style.text}`}>
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                {item.body}
              </p>
            </div>
          );
        })}
      </div>

      {/* KaTeX Equations */}
      {module.formulas.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            수학 모델 & 핵심 수식
          </h3>
          {module.formulas.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5"
            >
              <div className="text-xs font-semibold text-sky-300">{f.title}</div>
              <MathBlock latex={f.latex} displayMode />
              <p className="text-xs text-slate-400">{f.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
