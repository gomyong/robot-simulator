import { Layers, Sliders, Wifi } from 'lucide-react';
import { LabModule, LabPreviewState } from '../../types/lab';

interface ControlsTabProps {
  module: LabModule;
  preview: LabPreviewState;
  onChangePreview: (patch: Partial<LabPreviewState>) => void;
}

function SliderRow({
  label,
  valueLabel,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-200">{label}</span>
        <span className="font-mono font-bold text-sky-300">{valueLabel}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-sky-400"
      />
    </div>
  );
}

export function ControlsTab({
  module,
  preview,
  onChangePreview,
}: ControlsTabProps) {
  const t1 = (preview.armTheta1Deg * Math.PI) / 180;
  const t2 = (preview.armTheta2Deg * Math.PI) / 180;
  const fkX = preview.armL1 * Math.cos(t1) + preview.armL2 * Math.cos(t1 + t2);
  const fkY = preview.armL1 * Math.sin(t1) + preview.armL2 * Math.sin(t1 + t2);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-300">
          <Sliders className="h-4 w-4" />
          <span>3D 리그 인터랙션 컨트롤</span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          마일스톤 1 코어 엔진으로 3D 모델 파라미터를 실시간 조작할 수 있습니다. 심화 배선 검증기(M2) 및 실시간 파형 그래프(M3)가 다음 단계에 결합됩니다.
        </p>
      </div>

      {module.id === 'esp32' && (
        <div className="space-y-3">
          <SliderRow
            label="3D 보드 분해 정도 (Exploded View)"
            valueLabel={`${Math.round(preview.exploded * 100)}%`}
            min={0}
            max={1}
            step={0.02}
            value={preview.exploded}
            onChange={(exploded) => onChangePreview({ exploded })}
          />

          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
            <div className="flex items-start gap-2.5">
              <Wifi
                className={`mt-0.5 h-4 w-4 ${
                  preview.wifiActive ? 'text-sky-400' : 'text-slate-500'
                }`}
              />
              <div>
                <div className="text-xs font-semibold text-slate-100">
                  내장 Wi-Fi 통신 활성화 시뮬레이션
                </div>
                <div className="mt-0.5 text-[11px] text-slate-400">
                  켜면 3D 보드와 핀맵에서 ADC2 채널 핀(0, 2, 4, 12~15, 25~27)이 빨간색 충돌 경고를 표시합니다.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChangePreview({ wifiActive: !preview.wifiActive })}
              className={`min-h-[40px] min-w-[64px] shrink-0 rounded-lg border px-3 text-xs font-bold transition ${
                preview.wifiActive
                  ? 'border-sky-400 bg-sky-500/20 text-sky-200'
                  : 'border-slate-700 bg-slate-800 text-slate-400'
              }`}
            >
              {preview.wifiActive ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-xs text-slate-400">
            <Layers className="h-4 w-4 shrink-0 text-sky-400" />
            <span>3D 화면의 금색 핀 헤더를 직접 탭하면 핀아웃 탭이 자동으로 동기화됩니다.</span>
          </div>
        </div>
      )}

      {module.id === 'kinematics' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3 font-mono text-xs">
            <div>
              <span className="text-slate-400">엔드이펙터 x: </span>
              <span className="font-bold text-sky-300">{fkX.toFixed(2)} m</span>
            </div>
            <div>
              <span className="text-slate-400">엔드이펙터 y: </span>
              <span className="font-bold text-emerald-300">{fkY.toFixed(2)} m</span>
            </div>
          </div>

          <SliderRow
            label="관절 1 각도 (θ₁)"
            valueLabel={`${preview.armTheta1Deg}°`}
            min={-160}
            max={160}
            step={1}
            value={preview.armTheta1Deg}
            onChange={(armTheta1Deg) => onChangePreview({ armTheta1Deg })}
          />
          <SliderRow
            label="관절 2 상대 각도 (θ₂)"
            valueLabel={`${preview.armTheta2Deg}°`}
            min={-165}
            max={165}
            step={1}
            value={preview.armTheta2Deg}
            onChange={(armTheta2Deg) => onChangePreview({ armTheta2Deg })}
          />
          <SliderRow
            label="링크 1 길이 (L₁)"
            valueLabel={`${preview.armL1.toFixed(1)} m`}
            min={1.0}
            max={2.6}
            step={0.1}
            value={preview.armL1}
            onChange={(armL1) => onChangePreview({ armL1 })}
          />
          <SliderRow
            label="링크 2 길이 (L₂)"
            valueLabel={`${preview.armL2.toFixed(1)} m`}
            min={0.6}
            max={2.2}
            step={0.1}
            value={preview.armL2}
            onChange={(armL2) => onChangePreview({ armL2 })}
          />
        </div>
      )}

      {module.id === 'ultrasonic' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3 font-mono text-xs">
            <div>
              <span className="text-slate-400">예상 ECHO 펄스: </span>
              <span className="font-bold text-sky-300">
                {preview.sonarDistanceCm >= 395
                  ? '38,000 μs (Timeout)'
                  : `${Math.round(preview.sonarDistanceCm * 58)} μs`}
              </span>
            </div>
            <div>
              <span className="text-slate-400">계산 거리: </span>
              <span className="font-bold text-emerald-300">
                {preview.sonarDistanceCm >= 395
                  ? '범위 초과'
                  : `${preview.sonarDistanceCm.toFixed(0)} cm`}
              </span>
            </div>
          </div>

          <SliderRow
            label="장애물 거리 (2 ~ 400 cm)"
            valueLabel={`${preview.sonarDistanceCm} cm`}
            min={2}
            max={400}
            step={1}
            value={preview.sonarDistanceCm}
            onChange={(sonarDistanceCm) => onChangePreview({ sonarDistanceCm })}
          />
          <SliderRow
            label="서보 스캔 각도 (GPIO 13)"
            valueLabel={`${preview.sonarSweepDeg}°`}
            min={-60}
            max={60}
            step={1}
            value={preview.sonarSweepDeg}
            onChange={(sonarSweepDeg) => onChangePreview({ sonarSweepDeg })}
          />
        </div>
      )}

      {module.id === 'pid' && (
        <div className="space-y-3">
          <SliderRow
            label="목표 각도 Setpoint (θ_d)"
            valueLabel={`${preview.pidSetpointDeg}°`}
            min={-135}
            max={135}
            step={5}
            value={preview.pidSetpointDeg}
            onChange={(pidSetpointDeg) => onChangePreview({ pidSetpointDeg })}
          />
          <SliderRow
            label="비례 게인 (Kp)"
            valueLabel={preview.pidKp.toFixed(1)}
            min={0.5}
            max={12.0}
            step={0.5}
            value={preview.pidKp}
            onChange={(pidKp) => onChangePreview({ pidKp })}
          />
          <SliderRow
            label="적분 게인 (Ki)"
            valueLabel={preview.pidKi.toFixed(1)}
            min={0.0}
            max={5.0}
            step={0.2}
            value={preview.pidKi}
            onChange={(pidKi) => onChangePreview({ pidKi })}
          />
          <SliderRow
            label="미분 게인 (Kd)"
            valueLabel={preview.pidKd.toFixed(2)}
            min={0.0}
            max={2.5}
            step={0.05}
            value={preview.pidKd}
            onChange={(pidKd) => onChangePreview({ pidKd })}
          />
        </div>
      )}
    </div>
  );
}
