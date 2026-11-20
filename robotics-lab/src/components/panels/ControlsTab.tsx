import { ArrowRight } from 'lucide-react';
import { LabModule, LabPreviewState, TabId } from '../../types/lab';

interface ControlsTabProps {
  module: LabModule;
  preview: LabPreviewState;
  onChangePreview: (patch: Partial<LabPreviewState>) => void;
  onSelectTab: (tab: TabId) => void;
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
    <div className="py-4">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-[#0A2540]">{label}</span>
        <span className="font-mono text-xs font-semibold tabular-nums text-[#635BFF]">
          {valueLabel}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="studio-range mt-3 cursor-pointer"
      />
    </div>
  );
}

export function ControlsTab({
  module,
  preview,
  onChangePreview,
  onSelectTab,
}: ControlsTabProps) {
  const t1 = (preview.armTheta1Deg * Math.PI) / 180;
  const t2 = (preview.armTheta2Deg * Math.PI) / 180;
  const fkX = preview.armL1 * Math.cos(t1) + preview.armL2 * Math.cos(t1 + t2);
  const fkY = preview.armL1 * Math.sin(t1) + preview.armL2 * Math.sin(t1 + t2);

  // Day 01 circuit
  const Vs = preview.circuitVoltageV;
  const Vf = preview.circuitLedVf;
  const R = preview.circuitResistanceOhm;
  const effectiveR = Math.max(R, 5);
  const currentMa = Vs > Vf ? ((Vs - Vf) / effectiveR) * 1000 : 0;
  const recommendedMinR =
    Vs > Vf ? Math.ceil(((Vs - Vf) / 0.02) * 10) / 10 : 0;

  // Day 05 divider
  const vOut =
    preview.dividerVinV *
    (preview.dividerR2K / Math.max(0.1, preview.dividerR1K + preview.dividerR2K));

  // Day 06 power
  const battCap =
    preview.batteryType === '9v_alkaline'
      ? { mah: 500, vin: 9.0, maxMa: 350 }
      : preview.batteryType === 'aa_4x'
        ? { mah: 2000, vin: 6.0, maxMa: 1500 }
        : { mah: 2200, vin: 7.4, maxMa: 44000 };
  const totalMa = preview.motorLoadMa + 80;
  const runtimeHours = battCap.mah / totalMa;

  return (
    <div className="space-y-6">
      <header className="border-b border-[#E6E8EC] pb-3.5">
        <div className="text-xs font-semibold text-[#0A2540]">
          아이소메트릭 벤치 파라미터
        </div>
        <p className="mt-1 text-xs text-[#697386]">
          값을 변경하면 좌측(상단) 3D 조립·회로 모델이 즉시 반영됩니다.
        </p>
      </header>

      {module.id === 'day01_basics' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="pb-4">
            <div className="text-xs font-medium text-[#0A2540]">실험 모드</div>
            <div className="mt-2 grid grid-cols-2 rounded-lg bg-[#ECEEF2] p-0.5">
              <button
                type="button"
                onClick={() => onChangePreview({ day01Mode: 'anatomy' })}
                className={`rounded-md py-1.5 text-xs font-medium transition ${
                  preview.day01Mode === 'anatomy'
                    ? 'bg-white text-[#0A2540] shadow-[0_1px_2px_rgba(10,37,64,0.06)]'
                    : 'text-[#697386] hover:text-[#0A2540]'
                }`}
              >
                ① 로봇 3요소 조립
              </button>
              <button
                type="button"
                onClick={() => onChangePreview({ day01Mode: 'circuit' })}
                className={`rounded-md py-1.5 text-xs font-medium transition ${
                  preview.day01Mode === 'circuit'
                    ? 'bg-white text-[#0A2540] shadow-[0_1px_2px_rgba(10,37,64,0.06)]'
                    : 'text-[#697386] hover:text-[#0A2540]'
                }`}
              >
                ② 직류 회로/LED
              </button>
            </div>
          </div>

          {preview.day01Mode === 'anatomy' && (
            <div className="py-4">
              <div className="text-xs font-medium text-[#0A2540]">
                부품 포커스 (3D 클릭 가능)
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {[
                  { id: 'sensor' as const, label: '1. 센서' },
                  { id: 'brain' as const, label: '2. 두뇌' },
                  { id: 'actuator' as const, label: '3. 액추에이터' },
                ].map((part) => (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => onChangePreview({ day01FocusPart: part.id })}
                    className={`rounded-lg border py-2 text-xs font-medium transition ${
                      preview.day01FocusPart === part.id
                        ? 'border-[#635BFF] bg-[#EEF2FF] text-[#4F46E5]'
                        : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                    }`}
                  >
                    {part.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="py-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#0A2540]">공급 전압 (Vs)</span>
              <span className="font-mono font-semibold text-[#635BFF]">
                {Vs.toFixed(1)} V
              </span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {[
                { label: '3.3V ESP32', v: 3.3 },
                { label: '5.0V USB', v: 5.0 },
                { label: '9.0V 배터리', v: 9.0 },
              ].map((src) => (
                <button
                  key={src.v}
                  type="button"
                  onClick={() =>
                    onChangePreview({
                      day01Mode: 'circuit',
                      circuitVoltageV: src.v,
                    })
                  }
                  className={`rounded-lg border py-1.5 text-[11px] font-medium transition ${
                    Vs === src.v
                      ? 'border-[#0A2540] bg-[#0A2540] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {src.label}
                </button>
              ))}
            </div>
          </div>

          <div className="py-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#0A2540]">LED 문턱 전압 (Vf)</span>
              <span className="font-mono font-semibold text-[#425466]">
                {Vf.toFixed(1)} V
              </span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {[
                { label: '빨강 2.0V', vf: 2.0 },
                { label: '초록 2.2V', vf: 2.2 },
                { label: '파랑 3.2V', vf: 3.2 },
              ].map((led) => (
                <button
                  key={led.vf}
                  type="button"
                  onClick={() =>
                    onChangePreview({
                      day01Mode: 'circuit',
                      circuitLedVf: led.vf,
                    })
                  }
                  className={`rounded-lg border py-1.5 text-[11px] font-medium transition ${
                    Vf === led.vf
                      ? 'border-[#0A2540] bg-[#0A2540] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {led.label}
                </button>
              ))}
            </div>
          </div>

          <SliderRow
            label="직렬 보호 저항 (R)"
            valueLabel={R === 0 ? '0 Ω (직결 위험)' : `${R} Ω`}
            min={0}
            max={2000}
            step={10}
            value={R}
            onChange={(circuitResistanceOhm) =>
              onChangePreview({
                day01Mode: 'circuit',
                circuitResistanceOhm,
              })
            }
          />

          <div className="pt-4">
            <div className="rounded-lg bg-[#F7F8FA] p-3.5 text-xs">
              <div className="font-mono text-xs text-[#0A2540]">
                I = ({Vs.toFixed(1)}V − {Vf.toFixed(1)}V) /{' '}
                {R === 0 ? '5Ω(내부)' : `${R}Ω`} ={' '}
                <strong className="font-semibold text-[#635BFF]">
                  {currentMa.toFixed(1)} mA
                </strong>
              </div>
              <p className="mt-1 text-[11px] text-[#697386]">
                {Vs > Vf
                  ? `20mA 이하 안전 구동을 위한 최소 저항은 약 ${recommendedMinR}Ω 입니다.`
                  : '전원 전압이 LED 문턱 전압(Vf)보다 높을 때만 전류가 흐릅니다.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {module.id === 'day02_breadboard' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="pb-4">
            <div className="text-xs font-medium text-[#0A2540]">
              빵판 배선 시나리오 비교
            </div>
            <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
              {[
                { id: 'correct' as const, label: '정상 배선 (골짜기 건너기)' },
                { id: 'short_rail' as const, label: '같은 줄 합선 (Short)' },
                { id: 'bridge_trench' as const, label: 'IC 칩 쇼트 오류' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onChangePreview({ breadboardScenario: s.id })}
                  className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition ${
                    preview.breadboardScenario === s.id
                      ? 'border-[#0A2540] bg-[#0A2540] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              디지털 멀티미터 측정 모드
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {[
                { id: 'voltage' as const, label: '전압 (DC V)' },
                { id: 'resistance' as const, label: '저항 (Ω)' },
                { id: 'continuity' as const, label: '도통 (BEEP)' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangePreview({ multimeterMode: m.id })}
                  className={`rounded-lg border py-2 text-xs font-medium transition ${
                    preview.multimeterMode === m.id
                      ? 'border-[#635BFF] bg-[#EEF2FF] text-[#4F46E5]'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                빵판 내부 구리 클립 투시 (X-Ray)
              </div>
              <p className="mt-0.5 text-[11px] text-[#697386]">
                상단 플라스틱 덮개를 들어올려 보이지 않는 5핀 연결 구조를 확인합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({ exploded: preview.exploded > 0.1 ? 0 : 1 })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.exploded > 0.1
                  ? 'border-[#635BFF] bg-[#635BFF] text-white'
                  : 'border-[#E6E8EC] bg-[#F7F8FA] text-[#425466]'
              }`}
            >
              {preview.exploded > 0.1 ? '투시 ON' : '투시 OFF'}
            </button>
          </div>
        </div>
      )}

      {module.id === 'day03_digital' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="pb-4">
            <div className="text-xs font-medium text-[#0A2540]">
              입력 핀 저항 구성
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {[
                { id: 'floating' as const, label: '플로팅 (저항 없음)' },
                { id: 'pullup' as const, label: '풀업 (10kΩ→3.3V)' },
                { id: 'pulldown' as const, label: '풀다운 (10kΩ→GND)' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangePreview({ digitalPullMode: m.id })}
                  className={`rounded-lg border px-2 py-2 text-[11px] font-medium transition ${
                    preview.digitalPullMode === m.id
                      ? 'border-[#0A2540] bg-[#0A2540] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                물리 버튼 누름 상태 (3D 버튼 클릭 가능)
              </div>
              <p className="mt-0.5 text-[11px] text-[#697386]">
                풀업 회로는 평상시 HIGH(3.3V), 버튼을 누르면 LOW(0V)가 됩니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({ buttonPressed: !preview.buttonPressed })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                preview.buttonPressed
                  ? 'border-[#635BFF] bg-[#635BFF] text-white'
                  : 'border-[#E6E8EC] bg-[#F7F8FA] text-[#425466]'
              }`}
            >
              {preview.buttonPressed ? '눌림 (Pressed)' : '뗌 (Released)'}
            </button>
          </div>
        </div>
      )}

      {module.id === 'day04_adc_pwm' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="rounded-lg bg-[#F7F8FA] p-3 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[#697386]">12-bit ADC 값:</span>
              <strong className="text-[#0A2540]">
                {Math.round((preview.adcVoltageV / 3.3) * 4095)} / 4095
              </strong>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-[#697386]">PWM 등가 평균 전압:</span>
              <strong className="text-[#635BFF]">
                {(3.3 * (preview.pwmDutyPct / 100)).toFixed(2)} V
              </strong>
            </div>
          </div>

          <SliderRow
            label="아날로그 입력 전압 (가변저항)"
            valueLabel={`${preview.adcVoltageV.toFixed(2)} V`}
            min={0}
            max={3.3}
            step={0.05}
            value={preview.adcVoltageV}
            onChange={(adcVoltageV) => onChangePreview({ adcVoltageV })}
          />

          <SliderRow
            label="PWM 듀티 사이클 (%)"
            valueLabel={`${preview.pwmDutyPct}%`}
            min={0}
            max={100}
            step={2}
            value={preview.pwmDutyPct}
            onChange={(pwmDutyPct) => onChangePreview({ pwmDutyPct })}
          />

          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">PWM 주파수 모드</div>
            <div className="mt-2 grid grid-cols-2 rounded-lg bg-[#ECEEF2] p-0.5">
              <button
                type="button"
                onClick={() => onChangePreview({ pwmFreqHz: 1000 })}
                className={`rounded-md py-1.5 text-xs font-medium transition ${
                  preview.pwmFreqHz === 1000
                    ? 'bg-white text-[#0A2540] shadow-[0_1px_2px_rgba(10,37,64,0.06)]'
                    : 'text-[#697386]'
                }`}
              >
                1,000 Hz (DC 모터/LED)
              </button>
              <button
                type="button"
                onClick={() => onChangePreview({ pwmFreqHz: 50 })}
                className={`rounded-md py-1.5 text-xs font-medium transition ${
                  preview.pwmFreqHz === 50
                    ? 'bg-white text-[#0A2540] shadow-[0_1px_2px_rgba(10,37,64,0.06)]'
                    : 'text-[#697386]'
                }`}
              >
                50 Hz (서보 각도)
              </button>
            </div>
          </div>
        </div>
      )}

      {module.id === 'day05_divider' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="pb-4">
            <div className="text-xs font-medium text-[#0A2540]">
              빠른 저항 조합 프리셋
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {[
                { label: '0Ω 직결 (위험)', r1: 0, r2: 20 },
                { label: '10k+20k (3.33V)', r1: 10, r2: 20 },
                { label: '10k+10k (2.50V)', r1: 10, r2: 10 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() =>
                    onChangePreview({ dividerR1K: p.r1, dividerR2K: p.r2 })
                  }
                  className="rounded-lg border border-[#E6E8EC] bg-white px-2 py-1.5 text-[11px] font-medium text-[#0A2540] transition hover:bg-[#F7F8FA]"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <SliderRow
            label="상단 저항 (R1 · 센서 측)"
            valueLabel={`${preview.dividerR1K} kΩ`}
            min={0}
            max={30}
            step={1}
            value={preview.dividerR1K}
            onChange={(dividerR1K) => onChangePreview({ dividerR1K })}
          />
          <SliderRow
            label="하단 저항 (R2 · GND 측)"
            valueLabel={`${preview.dividerR2K} kΩ`}
            min={1}
            max={30}
            step={1}
            value={preview.dividerR2K}
            onChange={(dividerR2K) => onChangePreview({ dividerR2K })}
          />

          <div className="pt-4">
            <div className="rounded-lg bg-[#F7F8FA] p-3.5 font-mono text-xs text-[#0A2540]">
              V_out = {preview.dividerVinV.toFixed(1)}V × ({preview.dividerR2K} /{' '}
              {preview.dividerR1K + preview.dividerR2K}) ={' '}
              <strong
                className={
                  vOut > 3.6
                    ? 'text-rose-600'
                    : vOut >= 2.2
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                }
              >
                {vOut.toFixed(2)} V
              </strong>
            </div>
          </div>
        </div>
      )}

      {module.id === 'day06_power' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="pb-4">
            <div className="text-xs font-medium text-[#0A2540]">배터리 선택</div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {[
                { id: '9v_alkaline' as const, label: '9V 건전지' },
                { id: 'aa_4x' as const, label: 'AA × 4 (6V)' },
                { id: 'lipo_2s' as const, label: '2S LiPo (7.4V)' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onChangePreview({ batteryType: b.id })}
                  className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                    preview.batteryType === b.id
                      ? 'border-[#0A2540] bg-[#0A2540] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466]'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              전압 변환기 (레귤레이터)
            </div>
            <div className="mt-2 grid grid-cols-2 rounded-lg bg-[#ECEEF2] p-0.5">
              <button
                type="button"
                onClick={() => onChangePreview({ regulatorType: 'ldo' })}
                className={`rounded-md py-1.5 text-xs font-medium transition ${
                  preview.regulatorType === 'ldo'
                    ? 'bg-white text-[#0A2540] shadow-[0_1px_2px_rgba(10,37,64,0.06)]'
                    : 'text-[#697386]'
                }`}
              >
                LDO 선형 (발열 큼)
              </button>
              <button
                type="button"
                onClick={() => onChangePreview({ regulatorType: 'buck' })}
                className={`rounded-md py-1.5 text-xs font-medium transition ${
                  preview.regulatorType === 'buck'
                    ? 'bg-white text-[#0A2540] shadow-[0_1px_2px_rgba(10,37,64,0.06)]'
                    : 'text-[#697386]'
                }`}
              >
                DC-DC 벅 컨버터 (고효율)
              </button>
            </div>
          </div>

          <SliderRow
            label="모터 부하 전류 (+ ESP32 80mA)"
            valueLabel={`${preview.motorLoadMa} mA`}
            min={100}
            max={2000}
            step={50}
            value={preview.motorLoadMa}
            onChange={(motorLoadMa) => onChangePreview({ motorLoadMa })}
          />

          <div className="pt-4">
            <div className="rounded-lg bg-[#F7F8FA] p-3.5 text-xs">
              <div className="font-mono text-[#0A2540]">
                총 소비 {totalMa}mA · 예상 구동{' '}
                <strong className="text-[#635BFF]">
                  {runtimeHours >= 1
                    ? `${runtimeHours.toFixed(1)}시간`
                    : `${Math.round(runtimeHours * 60)}분`}
                </strong>
              </div>
              <p className="mt-1 text-[11px] text-[#697386]">
                {totalMa > battCap.maxMa
                  ? '배터리 최대 허용 전류를 초과해 전압 강하(Brownout)가 발생합니다!'
                  : '배터리 전류 공급 여유 범위 안에서 안정적으로 동작합니다.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {module.id === 'day07_project' && (
        <div className="divide-y divide-[#ECEEF2]">
          {[
            {
              key: 'projectCommonGnd' as const,
              title: '① 공통 접지 (Common GND) 연결',
              desc: '5V 센서·벅 컨버터·ESP32의 GND를 하나로 묶습니다.',
              val: preview.projectCommonGnd,
            },
            {
              key: 'projectEchoDivider' as const,
              title: '② ECHO 5V→3.3V 전압 분배기 (10kΩ+20kΩ)',
              desc: '5V 초음파 에코 신호로부터 ESP32 핀을 보호합니다.',
              val: preview.projectEchoDivider,
            },
            {
              key: 'projectLedResistor' as const,
              title: '③ 경보 LED 220Ω 직렬 보호 저항',
              desc: '핀당 전류를 20mA 이하(약 5.9mA)로 제한합니다.',
              val: preview.projectLedResistor,
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-3 py-3.5"
            >
              <div>
                <div className="text-xs font-medium text-[#0A2540]">
                  {item.title}
                </div>
                <div className="mt-0.5 text-[11px] text-[#697386]">
                  {item.desc}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onChangePreview({ [item.key]: !item.val })}
                className={`shrink-0 rounded-lg border px-3 py-1 font-mono text-xs font-semibold transition ${
                  item.val
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : 'border-rose-300 bg-rose-50 text-rose-700'
                }`}
              >
                {item.val ? 'ON' : 'OFF'}
              </button>
            </div>
          ))}

          <SliderRow
            label="전방 장애물 거리 (임계값 30cm)"
            valueLabel={`${preview.projectObstacleCm} cm`}
            min={5}
            max={120}
            step={1}
            value={preview.projectObstacleCm}
            onChange={(projectObstacleCm) =>
              onChangePreview({ projectObstacleCm })
            }
          />
        </div>
      )}

      {module.id === 'day08_board' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              해부할 보드 핵심 영역
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[
                { id: 'wroom' as const, label: '① WROOM-32' },
                { id: 'cp2102' as const, label: '② CP2102 USB' },
                { id: 'ams1117' as const, label: '③ AMS1117 3.3V' },
                { id: 'buttons' as const, label: '④ EN/BOOT 버튼' },
                { id: 'pins' as const, label: '⑤ GPIO 헤더' },
              ].map((part) => (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => onChangePreview({ day08FocusPart: part.id })}
                  className={`rounded-lg border px-2.5 py-2 text-left text-[11px] font-medium transition ${
                    preview.day08FocusPart === part.id
                      ? 'border-[#0A2540] bg-[#0A2540] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {part.label}
                </button>
              ))}
            </div>
          </div>

          <div className="py-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#0A2540]">부트스트랩 모드</span>
              <span className="font-mono text-xs font-semibold text-[#635BFF]">
                {preview.day08BootMode === 'flashing' ? 'GPIO0=LOW (Upload)' : 'GPIO0=HIGH (Run)'}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[
                { id: 'normal' as const, label: '일반 실행 (Flash Boot)' },
                { id: 'flashing' as const, label: '업로드 (UART Download)' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onChangePreview({ day08BootMode: mode.id })}
                  className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                    preview.day08BootMode === mode.id
                      ? 'border-[#635BFF] bg-[#635BFF] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <SliderRow
            label="내부 실리콘/Flash 투시"
            valueLabel={`${Math.round(preview.exploded * 100)}%`}
            min={0}
            max={1}
            step={0.1}
            value={preview.exploded}
            onChange={(exploded) => onChangePreview({ exploded })}
          />
        </div>
      )}

      {module.id === 'esp32' && (
        <div className="divide-y divide-[#ECEEF2]">
          <SliderRow
            label="3D 보드 분해 정도 (Exploded View)"
            valueLabel={`${Math.round(preview.exploded * 100)}%`}
            min={0}
            max={1}
            step={0.02}
            value={preview.exploded}
            onChange={(exploded) => onChangePreview({ exploded })}
          />

          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                내장 Wi-Fi 통신 활성화
              </div>
              <p className="mt-0.5 text-[11px] text-[#697386]">
                켜면 3D 보드와 핀맵에서 ADC2 채널 충돌을 표시합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChangePreview({ wifiActive: !preview.wifiActive })}
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.wifiActive
                  ? 'border-[#635BFF] bg-[#635BFF] text-white'
                  : 'border-[#E6E8EC] bg-[#F7F8FA] text-[#425466]'
              }`}
            >
              {preview.wifiActive ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}

      {module.id === 'day10_nonblocking' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              루프 아키텍처 선택
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[
                { id: 'delay' as const, label: 'delay() 블로킹' },
                { id: 'millis' as const, label: 'millis() 논블로킹' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangePreview({ day10Mode: m.id })}
                  className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                    preview.day10Mode === m.id
                      ? m.id === 'delay'
                        ? 'border-rose-300 bg-rose-50 text-rose-700'
                        : 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <SliderRow
            label="delay(ms) 블로킹 지속 시간"
            valueLabel={`${preview.day10DelayMs} ms`}
            min={100}
            max={2000}
            step={50}
            value={preview.day10DelayMs}
            onChange={(day10DelayMs) => onChangePreview({ day10DelayMs })}
          />

          <div className="pt-4">
            <div className="rounded-lg bg-[#F7F8FA] p-3.5 text-xs">
              <div className="font-mono text-[#0A2540]">
                긴급 정지 최악 응답:{' '}
                <strong
                  className={
                    preview.day10Mode === 'delay' ? 'text-rose-600' : 'text-emerald-600'
                  }
                >
                  {preview.day10Mode === 'delay' ? `${preview.day10DelayMs} ms 지연` : '< 1 ms (즉시)'}
                </strong>
              </div>
              <p className="mt-1 text-[11px] text-[#697386]">
                {preview.day10Mode === 'delay'
                  ? 'delay() 동안 CPU가 멈춰 버튼·센서·모터 제어가 모두 먹통이 됩니다.'
                  : 'millis() 뺄셈 타이머는 매 루프(수십 µs)마다 모든 작업을 비동기로 확인합니다.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {module.id === 'day11_fsm' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              로봇 유한 상태(State) 전이 테스트
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[
                { id: 'IDLE' as const, label: 'IDLE (대기)' },
                { id: 'PATROL' as const, label: 'PATROL (순찰 전진)' },
                { id: 'AVOID' as const, label: 'AVOID (장애물 회피)' },
                { id: 'ESTOP' as const, label: 'ESTOP (비상 정지)' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onChangePreview({ day11FsmState: st.id })}
                  className={`rounded-lg border px-2.5 py-2 font-mono text-[11px] font-medium transition ${
                    preview.day11FsmState === st.id
                      ? st.id === 'ESTOP'
                        ? 'border-rose-500 bg-rose-600 text-white'
                        : 'border-[#635BFF] bg-[#635BFF] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <div className="rounded-lg bg-[#F7F8FA] p-3.5 text-xs text-[#425466]">
              상태 변수(`enum RobotState`)와 `switch-case`를 분리하면 플래그 변수(`isAvoiding`, `isPaused`)가 꼬여 생기는 유령 오작동을 막을 수 있습니다.
            </div>
          </div>
        </div>
      )}

      {module.id === 'day12_comms' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              직렬 통신 프로토콜 선택
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {[
                { id: 'uart' as const, label: 'UART' },
                { id: 'i2c' as const, label: 'I2C' },
                { id: 'spi' as const, label: 'SPI' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onChangePreview({ day12Protocol: p.id })}
                  className={`rounded-lg border py-2 font-mono text-xs font-semibold transition ${
                    preview.day12Protocol === p.id
                      ? 'border-[#0A2540] bg-[#0A2540] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                실전 배선 실수 주입
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                {preview.day12Protocol === 'uart'
                  ? 'TX↔TX 직결 오배선 시뮬레이션'
                  : preview.day12Protocol === 'i2c'
                    ? '4.7kΩ 풀업 저항 누락 시뮬레이션'
                    : '두 장치의 CS 핀 중복 충돌 시뮬레이션'}
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({ day12WiringError: !preview.day12WiringError })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day12WiringError
                  ? 'border-rose-300 bg-rose-50 text-rose-700'
                  : 'border-emerald-300 bg-emerald-50 text-emerald-700'
              }`}
            >
              {preview.day12WiringError ? '오류 ON' : '정상'}
            </button>
          </div>
        </div>
      )}

      {module.id === 'day13_actuators' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              액추에이터 종류 비교
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {[
                { id: 'dc' as const, label: 'DC 모터' },
                { id: 'servo' as const, label: '서보 모터' },
                { id: 'stepper' as const, label: '스테퍼' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangePreview({ day13MotorType: m.id })}
                  className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                    preview.day13MotorType === m.id
                      ? 'border-[#635BFF] bg-[#635BFF] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <SliderRow
            label="감속 기어비 (Gear Ratio)"
            valueLabel={`${preview.day13GearRatio} : 1`}
            min={5}
            max={120}
            step={1}
            value={preview.day13GearRatio}
            onChange={(day13GearRatio) => onChangePreview({ day13GearRatio })}
          />

          <SliderRow
            label="외부 부하 토크 (Load)"
            valueLabel={`${preview.day13LoadKgCm.toFixed(1)} kg·cm`}
            min={0.4}
            max={10.0}
            step={0.2}
            value={preview.day13LoadKgCm}
            onChange={(day13LoadKgCm) => onChangePreview({ day13LoadKgCm })}
          />
        </div>
      )}

      {module.id === 'day14_hbridge' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              H-브리지 MOSFET 스위칭 상태
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[
                { id: 'forward' as const, label: '정회전 (Q1+Q4)' },
                { id: 'reverse' as const, label: '역회전 (Q3+Q2)' },
                { id: 'brake' as const, label: '브레이크 (Q2+Q4)' },
                { id: 'coast' as const, label: '공회전 (ALL OFF)' },
                { id: 'shoot_through' as const, label: '⚠ 관통 단락 (Q1+Q2)' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangePreview({ day14HbridgeMode: m.id })}
                  className={`rounded-lg border px-2.5 py-2 text-[11px] font-medium transition ${
                    preview.day14HbridgeMode === m.id
                      ? m.id === 'shoot_through'
                        ? 'border-rose-500 bg-rose-600 text-white'
                        : 'border-[#635BFF] bg-[#635BFF] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                ESP32 ↔ 모터 드라이버 공통 GND
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                끈을 해제하면 PWM 로직 기준 전위가 사라져 제어 불능이 됩니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({ day14CommonGnd: !preview.day14CommonGnd })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day14CommonGnd
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-rose-300 bg-rose-50 text-rose-700'
              }`}
            >
              {preview.day14CommonGnd ? '연결 OK' : '단선!'}
            </button>
          </div>
        </div>
      )}

      {module.id === 'day15_rtos_wireless' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="flex items-center justify-between gap-3 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                FreeRTOS 듀얼코어 분할 (Core 0 / Core 1)
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                Wi-Fi(Core 0)와 20ms 모터 제어 루프(Core 1)를 격리합니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({ day15RtosEnabled: !preview.day15RtosEnabled })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day15RtosEnabled
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-amber-300 bg-amber-50 text-amber-800'
              }`}
            >
              {preview.day15RtosEnabled ? 'RTOS ON' : '단일 루프'}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                인터럽트 핸들러(ISR) 안전 규율
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                OFF 시 ISR 내부에 Serial.println()을 넣어 WDT 크래시를 재현합니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({ day15IsrSafe: !preview.day15IsrSafe })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day15IsrSafe
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-rose-300 bg-rose-50 text-rose-700'
              }`}
            >
              {preview.day15IsrSafe ? 'IRAM 안전' : 'WDT 패닉!'}
            </button>
          </div>

          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              ESP-NOW 조종 패킷 전송 테스트
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {[
                { id: 'forward' as const, label: '전진' },
                { id: 'turn' as const, label: '회전' },
                { id: 'stop' as const, label: '정지' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onChangePreview({ day15Command: c.id })}
                  className={`rounded-lg border py-2 text-xs font-medium transition ${
                    preview.day15Command === c.id
                      ? 'border-[#635BFF] bg-[#635BFF] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {module.id === 'day16_rover_project' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              2WD RC 로버 조종 명령 (D-Pad)
            </div>
            <div className="mt-2 grid grid-cols-5 gap-1">
              {[
                { id: 'forward' as const, label: '▲ 전진' },
                { id: 'left' as const, label: '◀ 좌' },
                { id: 'stop' as const, label: '■ 정지' },
                { id: 'right' as const, label: '▶ 우' },
                { id: 'reverse' as const, label: '▼ 후진' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onChangePreview({ day16DriveCmd: c.id })}
                  className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                    preview.day16DriveCmd === c.id
                      ? 'border-[#635BFF] bg-[#635BFF] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                LM2596 5V 벅 컨버터 전원 분리
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                해제 시 모터 돌입 전류로 ESP32가 Brownout 리셋됩니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({
                  day16BuckSeparated: !preview.day16BuckSeparated,
                })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day16BuckSeparated
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-rose-300 bg-rose-50 text-rose-700'
              }`}
            >
              {preview.day16BuckSeparated ? '분리 OK' : '노이즈 직격'}
            </button>
          </div>

          <SliderRow
            label="무선 패킷 미수신 경과 시간 (Timeout 500ms)"
            valueLabel={`${preview.day16SignalLostMs} ms`}
            min={0}
            max={1200}
            step={50}
            value={preview.day16SignalLostMs}
            onChange={(day16SignalLostMs) =>
              onChangePreview({ day16SignalLostMs })
            }
          />

          <div className="flex items-center justify-between gap-3 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                500ms Failsafe 워치독 활성화
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                무선 끊김 시 모터를 강제 정지해 폭주 사고를 막습니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({
                  day16FailsafeEnabled: !preview.day16FailsafeEnabled,
                })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day16FailsafeEnabled
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-rose-300 bg-rose-50 text-rose-700'
              }`}
            >
              {preview.day16FailsafeEnabled ? '안전 ON' : '폭주 위험'}
            </button>
          </div>
        </div>
      )}

      {module.id === 'day17_math' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              실습 모드 선택
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[
                { id: 'angle' as const, label: '① atan2 사분면' },
                { id: 'vector' as const, label: '② 내적/외적 벡터' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangePreview({ day17Mode: m.id })}
                  className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                    preview.day17Mode === m.id
                      ? 'border-[#0A2540] bg-[#0A2540] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {preview.day17Mode === 'angle' ? (
            <>
              <div className="flex items-center justify-between gap-3 py-4">
                <div>
                  <div className="text-xs font-medium text-[#0A2540]">
                    함수 선택: atan2(y, x) vs atan(y/x)
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#697386]">
                    x &lt; 0 영역에서 atan()의 180° 오작동을 확인하세요.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onChangePreview({ day17UseAtan2: !preview.day17UseAtan2 })
                  }
                  className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                    preview.day17UseAtan2
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-rose-300 bg-rose-50 text-rose-700'
                  }`}
                >
                  {preview.day17UseAtan2 ? 'atan2()' : 'atan() 함정'}
                </button>
              </div>
              <SliderRow
                label="목표 X 좌표"
                valueLabel={`${preview.day17TargetX}`}
                min={-8}
                max={8}
                step={0.5}
                value={preview.day17TargetX}
                onChange={(day17TargetX) => onChangePreview({ day17TargetX })}
              />
              <SliderRow
                label="목표 Y 좌표"
                valueLabel={`${preview.day17TargetY}`}
                min={-8}
                max={8}
                step={0.5}
                value={preview.day17TargetY}
                onChange={(day17TargetY) => onChangePreview({ day17TargetY })}
              />
            </>
          ) : (
            <SliderRow
              label="두 벡터 사이각 θ (내적 cos θ vs 외적 sin θ)"
              valueLabel={`${preview.day17VecAngleDeg}°`}
              min={0}
              max={180}
              step={5}
              value={preview.day17VecAngleDeg}
              onChange={(day17VecAngleDeg) =>
                onChangePreview({ day17VecAngleDeg })
              }
            />
          )}
        </div>
      )}

      {module.id === 'day18_rotation3d' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              3D 회전 표현 방식
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[
                { id: 'euler' as const, label: '오일러 각 (3축 짐벌)' },
                { id: 'quaternion' as const, label: '쿼터니언 (x,y,z,w)' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangePreview({ day18Mode: m.id })}
                  className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                    preview.day18Mode === m.id
                      ? 'border-[#635BFF] bg-[#635BFF] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <SliderRow
            label="Roll (X축 갸우뚱)"
            valueLabel={`${preview.day18RollDeg}°`}
            min={-180}
            max={180}
            step={5}
            value={preview.day18RollDeg}
            onChange={(day18RollDeg) => onChangePreview({ day18RollDeg })}
          />
          <SliderRow
            label="Pitch (Z축 숙이기 · ±90° 짐벌락!)"
            valueLabel={`${preview.day18PitchDeg}°`}
            min={-90}
            max={90}
            step={5}
            value={preview.day18PitchDeg}
            onChange={(day18PitchDeg) => onChangePreview({ day18PitchDeg })}
          />
          <SliderRow
            label="Yaw (Y상방 좌우 선회)"
            valueLabel={`${preview.day18YawDeg}°`}
            min={-180}
            max={180}
            step={5}
            value={preview.day18YawDeg}
            onChange={(day18YawDeg) => onChangePreview({ day18YawDeg })}
          />
        </div>
      )}

      {module.id === 'day19_cad_tolerance' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              끼워맞춤 프리셋 (Ø 5.0mm 축 기준)
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {[
                { id: 'press' as const, label: '억지 (+0.05)', c: 0.05 },
                { id: 'transition' as const, label: '중간 (+0.20)', c: 0.2 },
                { id: 'clearance' as const, label: '여유 (+0.35)', c: 0.35 },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    onChangePreview({
                      day19FitType: p.id,
                      day19HoleClearanceMm: p.c,
                    })
                  }
                  className={`rounded-lg border py-2 font-mono text-[11px] font-medium transition ${
                    preview.day19FitType === p.id
                      ? 'border-[#0A2540] bg-[#0A2540] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <SliderRow
            label="CAD 설계 구멍 여유 공차 (5.00 + Δ mm)"
            valueLabel={`+${preview.day19HoleClearanceMm.toFixed(2)} mm`}
            min={-0.1}
            max={0.7}
            step={0.05}
            value={preview.day19HoleClearanceMm}
            onChange={(day19HoleClearanceMm) =>
              onChangePreview({ day19HoleClearanceMm })
            }
          />
          <SliderRow
            label="브래킷 벽 두께 (0.4mm 노즐 배수 권장)"
            valueLabel={`${preview.day19WallThickMm.toFixed(1)} mm`}
            min={0.8}
            max={3.2}
            step={0.2}
            value={preview.day19WallThickMm}
            onChange={(day19WallThickMm) =>
              onChangePreview({ day19WallThickMm })
            }
          />
        </div>
      )}

      {module.id === 'day20_mobile_kinematics' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              이동 로봇 섀시 구동 방식
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {[
                { id: 'diff' as const, label: '차동 2WD' },
                { id: 'ackermann' as const, label: '애커먼' },
                { id: 'mecanum' as const, label: '메카넘 4WD' },
              ].map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => onChangePreview({ day20DriveArch: a.id })}
                  className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                    preview.day20DriveArch === a.id
                      ? 'border-[#635BFF] bg-[#635BFF] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <SliderRow
            label="목표 전진 선속도 (v)"
            valueLabel={`${preview.day20LinearV.toFixed(2)} m/s`}
            min={-1.0}
            max={1.0}
            step={0.05}
            value={preview.day20LinearV}
            onChange={(day20LinearV) => onChangePreview({ day20LinearV })}
          />
          <SliderRow
            label="목표 회전 각속도 (ω)"
            valueLabel={`${preview.day20AngularW.toFixed(2)} rad/s`}
            min={-3.0}
            max={3.0}
            step={0.1}
            value={preview.day20AngularW}
            onChange={(day20AngularW) => onChangePreview({ day20AngularW })}
          />
          <SliderRow
            label="좌우 바퀴 간격 (Wheelbase W)"
            valueLabel={`${preview.day20WheelBaseM.toFixed(2)} m`}
            min={0.15}
            max={0.5}
            step={0.05}
            value={preview.day20WheelBaseM}
            onChange={(day20WheelBaseM) => onChangePreview({ day20WheelBaseM })}
          />
        </div>
      )}

      {module.id === 'kinematics' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#0A2540]">
                제어 모드 (Day 21 순기구학 vs Day 22 역기구학)
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onChangePreview({ armIkMode: false })}
                className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                  !preview.armIkMode
                    ? 'border-[#0A2540] bg-[#0A2540] text-white'
                    : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                }`}
              >
                FK (각도 직접 조절)
              </button>
              <button
                type="button"
                onClick={() => onChangePreview({ armIkMode: true })}
                className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                  preview.armIkMode
                    ? 'border-[#635BFF] bg-[#635BFF] text-white'
                    : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                }`}
              >
                IK (목표 X,Y 역산)
              </button>
            </div>
          </div>

          <div className="py-3">
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-[#F7F8FA] p-3 font-mono text-xs">
              <div>
                <span className="text-[#697386]">엔드이펙터 x: </span>
                <span className="font-semibold text-[#0A2540]">
                  {fkX.toFixed(2)} m
                </span>
              </div>
              <div>
                <span className="text-[#697386]">엔드이펙터 y: </span>
                <span className="font-semibold text-[#0A2540]">
                  {fkY.toFixed(2)} m
                </span>
              </div>
            </div>
          </div>

          {preview.armIkMode ? (
            <>
              <SliderRow
                label="IK 목표 X 좌표"
                valueLabel={`${preview.armTargetX.toFixed(1)} m`}
                min={-3.5}
                max={3.5}
                step={0.1}
                value={preview.armTargetX}
                onChange={(armTargetX) => onChangePreview({ armTargetX })}
              />
              <SliderRow
                label="IK 목표 Y 좌표"
                valueLabel={`${preview.armTargetY.toFixed(1)} m`}
                min={-3.5}
                max={3.5}
                step={0.1}
                value={preview.armTargetY}
                onChange={(armTargetY) => onChangePreview({ armTargetY })}
              />
              <div className="flex items-center justify-between gap-3 py-4">
                <span className="text-xs font-medium text-[#0A2540]">
                  팔꿈치 형상 해 (θ₂ 부호)
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onChangePreview({ armElbowUp: !preview.armElbowUp })
                  }
                  className="rounded-lg border border-[#E6E8EC] bg-[#F7F8FA] px-3 py-1.5 font-mono text-xs font-semibold text-[#0A2540] hover:bg-white"
                >
                  {preview.armElbowUp ? 'Elbow-Up (θ₂>0)' : 'Elbow-Down (θ₂<0)'}
                </button>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
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

      {module.id === 'day23_jacobian' && (
        <div className="divide-y divide-[#ECEEF2]">
          <SliderRow
            label="어깨 관절 각도 (θ₁)"
            valueLabel={`${preview.day23Theta1Deg}°`}
            min={-90}
            max={90}
            step={5}
            value={preview.day23Theta1Deg}
            onChange={(day23Theta1Deg) => onChangePreview({ day23Theta1Deg })}
          />
          <SliderRow
            label="팔꿈치 각도 (θ₂ · 0° = 특이점!)"
            valueLabel={`${preview.day23Theta2Deg}°`}
            min={-175}
            max={175}
            step={5}
            value={preview.day23Theta2Deg}
            onChange={(day23Theta2Deg) => onChangePreview({ day23Theta2Deg })}
          />
          <SliderRow
            label="손끝 수평 외력 (Fx)"
            valueLabel={`${preview.day23EndFxN} N`}
            min={-25}
            max={25}
            step={1}
            value={preview.day23EndFxN}
            onChange={(day23EndFxN) => onChangePreview({ day23EndFxN })}
          />
          <SliderRow
            label="손끝 수직 외력 (Fy)"
            valueLabel={`${preview.day23EndFyN} N`}
            min={-25}
            max={25}
            step={1}
            value={preview.day23EndFyN}
            onChange={(day23EndFyN) => onChangePreview({ day23EndFyN })}
          />
        </div>
      )}

      {module.id === 'day24_dynamics' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              서보 모터 스펙 선택 (Stall Torque)
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[
                { val: 1.8, label: 'SG90 (1.8 kg·cm)' },
                { val: 10, label: 'MG996R (10 kg·cm)' },
                { val: 20, label: 'DS3225 (20 kg·cm)' },
                { val: 35, label: 'RDS3235 (35 kg·cm)' },
              ].map((s) => (
                <button
                  key={s.val}
                  type="button"
                  onClick={() =>
                    onChangePreview({ day24ServoRatedKgCm: s.val })
                  }
                  className={`rounded-lg border px-2 py-2 font-mono text-[11px] font-medium transition ${
                    preview.day24ServoRatedKgCm === s.val
                      ? 'border-[#635BFF] bg-[#635BFF] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <SliderRow
            label="팔 길이 (L)"
            valueLabel={`${preview.day24ArmLengthCm} cm`}
            min={15}
            max={50}
            step={1}
            value={preview.day24ArmLengthCm}
            onChange={(day24ArmLengthCm) =>
              onChangePreview({ day24ArmLengthCm })
            }
          />
          <SliderRow
            label="팔 자세 각도 (0° 수평 최대 부하 ~ 90° 수직)"
            valueLabel={`${preview.day24AngleDeg}°`}
            min={0}
            max={90}
            step={5}
            value={preview.day24AngleDeg}
            onChange={(day24AngleDeg) => onChangePreview({ day24AngleDeg })}
          />
          <SliderRow
            label="끝단 페이로드 무게"
            valueLabel={`${preview.day24PayloadG} g`}
            min={100}
            max={1500}
            step={50}
            value={preview.day24PayloadG}
            onChange={(day24PayloadG) => onChangePreview({ day24PayloadG })}
          />
        </div>
      )}

      {module.id === 'day25_arm_project' && (
        <div className="divide-y divide-[#ECEEF2]">
          <SliderRow
            label="목표 X 좌표 (작업공간 0.5 ≤ r ≤ 3.1)"
            valueLabel={`${preview.day25TargetX.toFixed(1)} m`}
            min={-3.4}
            max={3.6}
            step={0.1}
            value={preview.day25TargetX}
            onChange={(day25TargetX) => onChangePreview({ day25TargetX })}
          />
          <SliderRow
            label="목표 Y 좌표"
            valueLabel={`${preview.day25TargetY.toFixed(1)} m`}
            min={-3.2}
            max={3.2}
            step={0.1}
            value={preview.day25TargetY}
            onChange={(day25TargetY) => onChangePreview({ day25TargetY })}
          />
          <div className="flex items-center justify-between gap-3 py-4">
            <span className="text-xs font-medium text-[#0A2540]">
              역기구학 자세 (Elbow-Up vs Down)
            </span>
            <button
              type="button"
              onClick={() =>
                onChangePreview({ day25ElbowUp: !preview.day25ElbowUp })
              }
              className="rounded-lg border border-[#E6E8EC] bg-[#F7F8FA] px-3 py-1.5 font-mono text-xs font-semibold text-[#0A2540] hover:bg-white"
            >
              {preview.day25ElbowUp ? 'Elbow-Up' : 'Elbow-Down'}
            </button>
          </div>
          <SliderRow
            label="끝단 물체 질량 (Payload)"
            valueLabel={`${preview.day25PayloadKg.toFixed(1)} kg`}
            min={0.1}
            max={2.0}
            step={0.1}
            value={preview.day25PayloadKg}
            onChange={(day25PayloadKg) => onChangePreview({ day25PayloadKg })}
          />
          <SliderRow
            label="베이스 모터 정격 토크 (안전율 1.5x 기준)"
            valueLabel={`${preview.day25JointRatedNm} N·m`}
            min={5}
            max={60}
            step={1}
            value={preview.day25JointRatedNm}
            onChange={(day25JointRatedNm) =>
              onChangePreview({ day25JointRatedNm })
            }
          />
        </div>
      )}

      {module.id === 'ultrasonic' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-[#F7F8FA] p-3 font-mono text-xs">
            <div>
              <span className="text-[#697386]">ECHO 펄스: </span>
              <span className="font-semibold text-[#0A2540]">
                {preview.sonarDistanceCm >= 395
                  ? '38,000 μs (Timeout)'
                  : `${Math.round(preview.sonarDistanceCm * 58)} μs`}
              </span>
            </div>
            <div>
              <span className="text-[#697386]">거리: </span>
              <span className="font-semibold text-[#0A2540]">
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

      {module.id === 'day27_encoder_odom' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              바퀴 회전 방향 (A/B상 위상 비교)
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {[
                { id: 'cw' as const, label: '정회전 CW' },
                { id: 'ccw' as const, label: '역회전 CCW' },
                { id: 'stop' as const, label: '정지 STOP' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onChangePreview({ day27Direction: d.id })}
                  className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                    preview.day27Direction === d.id
                      ? 'border-[#0A2540] bg-[#0A2540] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <SliderRow
            label="바퀴 회전 속도 (RPM)"
            valueLabel={`${preview.day27Rpm} rpm`}
            min={20}
            max={240}
            step={10}
            value={preview.day27Rpm}
            onChange={(day27Rpm) => onChangePreview({ day27Rpm })}
          />
          <SliderRow
            label="바퀴 헛돌기 / 슬립률 (Wheel Slip)"
            valueLabel={`${preview.day27WheelSlipPct}%`}
            min={0}
            max={30}
            step={1}
            value={preview.day27WheelSlipPct}
            onChange={(day27WheelSlipPct) =>
              onChangePreview({ day27WheelSlipPct })
            }
          />
        </div>
      )}

      {module.id === 'day28_imu' && (
        <div className="divide-y divide-[#ECEEF2]">
          <SliderRow
            label="실제 기울기 각도 (θ_true)"
            valueLabel={`${preview.day28TrueAngleDeg}°`}
            min={-40}
            max={40}
            step={2}
            value={preview.day28TrueAngleDeg}
            onChange={(day28TrueAngleDeg) =>
              onChangePreview({ day28TrueAngleDeg })
            }
          />
          <SliderRow
            label="모터/바닥 고주파 진동 노이즈"
            valueLabel={`±${preview.day28VibrationG.toFixed(2)} g`}
            min={0}
            max={0.6}
            step={0.05}
            value={preview.day28VibrationG}
            onChange={(day28VibrationG) => onChangePreview({ day28VibrationG })}
          />
          <SliderRow
            label="자이로 정지 바이어스 (Drift 원인)"
            valueLabel={`${preview.day28GyroBiasDps.toFixed(2)} °/s`}
            min={-1.5}
            max={1.5}
            step={0.1}
            value={preview.day28GyroBiasDps}
            onChange={(day28GyroBiasDps) =>
              onChangePreview({ day28GyroBiasDps })
            }
          />
          <div className="flex items-center justify-between gap-3 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                기동 시 500샘플 영점 캘리브레이션
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                정지 상태에서 측정한 바이어스 오프셋을 실시간 감산합니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({ day28Calibrated: !preview.day28Calibrated })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day28Calibrated
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-rose-300 bg-rose-50 text-rose-700'
              }`}
            >
              {preview.day28Calibrated ? '보정 ON' : '미보정 OFF'}
            </button>
          </div>
        </div>
      )}

      {module.id === 'day29_sensor_fusion' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              필터링 &amp; 퓨전 방식 비교
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[
                { id: 'raw_acc' as const, label: '가속도 원시 (진동)' },
                { id: 'gyro_only' as const, label: '자이로 단독 (드리프트)' },
                { id: 'lpf' as const, label: '1차 LPF (지연)' },
                { id: 'complementary' as const, label: '상보 필터 (최적)' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangePreview({ day29FilterMode: m.id })}
                  className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                    preview.day29FilterMode === m.id
                      ? 'border-[#635BFF] bg-[#635BFF] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <SliderRow
            label="1차 LPF 평활 계수 (α · 높을수록 지연↑)"
            valueLabel={preview.day29LpfAlpha.toFixed(2)}
            min={0.2}
            max={0.96}
            step={0.04}
            value={preview.day29LpfAlpha}
            onChange={(day29LpfAlpha) => onChangePreview({ day29LpfAlpha })}
          />
          <SliderRow
            label="상보 필터 자이로 신뢰 비중 (γ)"
            valueLabel={`${(preview.day29CfGyroWeight * 100).toFixed(0)}%`}
            min={0.8}
            max={0.99}
            step={0.01}
            value={preview.day29CfGyroWeight}
            onChange={(day29CfGyroWeight) =>
              onChangePreview({ day29CfGyroWeight })
            }
          />
        </div>
      )}

      {module.id === 'pid' && (
        <div className="divide-y divide-[#ECEEF2]">
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
            label="비례 게인 (Kp · 스프링 세기)"
            valueLabel={preview.pidKp.toFixed(1)}
            min={0.5}
            max={12.0}
            step={0.5}
            value={preview.pidKp}
            onChange={(pidKp) => onChangePreview({ pidKp })}
          />
          <SliderRow
            label="적분 게인 (Ki · 오차 끈기)"
            valueLabel={preview.pidKi.toFixed(1)}
            min={0.0}
            max={5.0}
            step={0.2}
            value={preview.pidKi}
            onChange={(pidKi) => onChangePreview({ pidKi })}
          />
          <SliderRow
            label="미분 게인 (Kd · 브레이크 댐퍼)"
            valueLabel={preview.pidKd.toFixed(2)}
            min={0.0}
            max={2.5}
            step={0.05}
            value={preview.pidKd}
            onChange={(pidKd) => onChangePreview({ pidKd })}
          />
        </div>
      )}

      {module.id === 'day31_pid_advanced' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="flex items-center justify-between gap-3 py-3.5">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                외란 구속 테스트 (t=0.45~1.15s 팔 붙잡기)
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                구속 중 적분항(I)이 얼마나 쌓여 폭주하는지 재현합니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({
                  day31DisturbanceStall: !preview.day31DisturbanceStall,
                })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day31DisturbanceStall
                  ? 'border-rose-300 bg-rose-50 text-rose-700'
                  : 'border-[#E6E8EC] bg-white text-[#425466]'
              }`}
            >
              {preview.day31DisturbanceStall ? '구속 ON' : '구속 OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 py-3.5">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                Anti-Windup 적분 클램핑
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                출력 포화 시 적분 누적을 동결해 거대 오버슈트를 막습니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({ day31AntiWindup: !preview.day31AntiWindup })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day31AntiWindup
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-rose-300 bg-rose-50 text-rose-700'
              }`}
            >
              {preview.day31AntiWindup ? 'ON (안전)' : 'OFF (폭주)'}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 py-3.5">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                미분항 D-Term LPF 필터
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                측정 노이즈에 의한 고주파 D 떨림을 억제합니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({ day31DerivLpf: !preview.day31DerivLpf })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day31DerivLpf
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-[#E6E8EC] bg-white text-[#425466]'
              }`}
            >
              {preview.day31DerivLpf ? 'LPF ON' : 'LPF OFF'}
            </button>
          </div>

          <SliderRow
            label="Kp (비례)"
            valueLabel={preview.day31Kp.toFixed(1)}
            min={2.0}
            max={20.0}
            step={0.5}
            value={preview.day31Kp}
            onChange={(day31Kp) => onChangePreview({ day31Kp })}
          />
          <SliderRow
            label="Ki (적분)"
            valueLabel={preview.day31Ki.toFixed(1)}
            min={0.0}
            max={25.0}
            step={0.5}
            value={preview.day31Ki}
            onChange={(day31Ki) => onChangePreview({ day31Ki })}
          />
          <SliderRow
            label="Kd (미분)"
            valueLabel={preview.day31Kd.toFixed(2)}
            min={0.0}
            max={3.0}
            step={0.1}
            value={preview.day31Kd}
            onChange={(day31Kd) => onChangePreview({ day31Kd })}
          />
        </div>
      )}

      {module.id === 'day32_trajectory' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              모드 선택
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[
                { id: 'profile' as const, label: '사다리꼴 속도 프로파일' },
                { id: 'pursuit' as const, label: 'Pure Pursuit 경로 추종' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangePreview({ day32Mode: m.id })}
                  className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                    preview.day32Mode === m.id
                      ? 'border-[#635BFF] bg-[#635BFF] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <SliderRow
            label="사다리꼴 최대 가속도 (a_max)"
            valueLabel={`${preview.day32MaxAccel.toFixed(1)} m/s²`}
            min={0.6}
            max={4.0}
            step={0.2}
            value={preview.day32MaxAccel}
            onChange={(day32MaxAccel) => onChangePreview({ day32MaxAccel })}
          />
          <SliderRow
            label="Pure Pursuit 전방 주시 거리 (L_d)"
            valueLabel={`${preview.day32LookaheadM.toFixed(2)} m`}
            min={0.2}
            max={1.4}
            step={0.05}
            value={preview.day32LookaheadM}
            onChange={(day32LookaheadM) => onChangePreview({ day32LookaheadM })}
          />
        </div>
      )}

      {module.id === 'day33_kalman' && (
        <div className="divide-y divide-[#ECEEF2]">
          <SliderRow
            label="프로세스(운동 모델) 노이즈 공분산 Q"
            valueLabel={preview.day33ProcessQ.toFixed(2)}
            min={0.1}
            max={3.0}
            step={0.1}
            value={preview.day33ProcessQ}
            onChange={(day33ProcessQ) => onChangePreview({ day33ProcessQ })}
          />
          <SliderRow
            label="센서 측정 노이즈 공분산 R"
            valueLabel={preview.day33MeasureR.toFixed(2)}
            min={0.1}
            max={3.0}
            step={0.1}
            value={preview.day33MeasureR}
            onChange={(day33MeasureR) => onChangePreview({ day33MeasureR })}
          />
        </div>
      )}

      {module.id === 'day34_fusion_project' && (
        <div className="divide-y divide-[#ECEEF2]">
          <SliderRow
            label="좌/우 모터 하드웨어 출력 편차"
            valueLabel={`${preview.day34MotorMismatchPct}%`}
            min={0}
            max={25}
            step={1}
            value={preview.day34MotorMismatchPct}
            onChange={(day34MotorMismatchPct) =>
              onChangePreview({ day34MotorMismatchPct })
            }
          />

          <div className="flex items-center justify-between gap-3 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                ① 좌/우 바퀴 엔코더 속도 PID 루프
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                기어 마찰과 전압 차이에 의한 좌우 속도 편차를 1차 보정합니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({ day34EncoderPid: !preview.day34EncoderPid })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day34EncoderPid
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-rose-300 bg-rose-50 text-rose-700'
              }`}
            >
              {preview.day34EncoderPid ? 'PID ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                ② IMU Yaw 헤딩 보정 루프
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                바퀴 슬립과 타이어 편차로 틀어진 각도를 0°로 실시간 정렬합니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({
                  day34ImuHeadingPid: !preview.day34ImuHeadingPid,
                })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day34ImuHeadingPid
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-rose-300 bg-rose-50 text-rose-700'
              }`}
            >
              {preview.day34ImuHeadingPid ? 'IMU ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}

      {module.id === 'day35_python_bridge' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="flex items-center justify-between gap-3 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                1바이트 통신 노이즈(변조) 주입
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                모터 EMI로 시리얼 속도 페이로드 1바이트가 깨진 상황을 모사합니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({ day35CorruptByte: !preview.day35CorruptByte })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day35CorruptByte
                  ? 'border-rose-300 bg-rose-50 text-rose-700'
                  : 'border-[#E6E8EC] bg-white text-[#425466]'
              }`}
            >
              {preview.day35CorruptByte ? '변조 ON' : '정상'}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                CRC8 체크섬 무결성 검증
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                켜면 깨진 패킷을 즉각 폐기(Reject)해 로봇 폭주를 막습니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({ day35CrcEnabled: !preview.day35CrcEnabled })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day35CrcEnabled
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-rose-300 bg-rose-50 text-rose-700'
              }`}
            >
              {preview.day35CrcEnabled ? 'CRC ON' : 'OFF (위험)'}
            </button>
          </div>
        </div>
      )}

      {module.id === 'day36_path_planning' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="flex items-center justify-between gap-3 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                C-Space 로봇 반지름 장애물 팽창
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                벽 모서리에 로봇 외곽이 긁히지 않도록 안전 마진을 부풀립니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({
                  day36CspaceInflation: !preview.day36CspaceInflation,
                })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day36CspaceInflation
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-rose-300 bg-rose-50 text-rose-700'
              }`}
            >
              {preview.day36CspaceInflation ? '팽창 ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                경로상 돌발 동적 장애물(박스) 출현
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                기존 정적 지도에 없던 장애물을 배치해 지역 회피를 시험합니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({
                  day36DynamicObstacle: !preview.day36DynamicObstacle,
                })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day36DynamicObstacle
                  ? 'border-amber-300 bg-amber-50 text-amber-800'
                  : 'border-[#E6E8EC] bg-white text-[#425466]'
              }`}
            >
              {preview.day36DynamicObstacle ? '장애물 ON' : '없음'}
            </button>
          </div>

          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              경로 플래너 모드
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[
                { id: 'astar' as const, label: '전역 A* (정적 지도)' },
                { id: 'dwa' as const, label: '전역 A* + DWA 회피' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangePreview({ day36PlannerAlgo: m.id })}
                  className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                    preview.day36PlannerAlgo === m.id
                      ? 'border-[#635BFF] bg-[#635BFF] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {module.id === 'day37_ros2_arch' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              ROS 2 통신 모델
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {[
                { id: 'topic' as const, label: 'Topic' },
                { id: 'service' as const, label: 'Service' },
                { id: 'action' as const, label: 'Action' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onChangePreview({ day37Pattern: p.id })}
                  className={`rounded-lg border py-2 font-mono text-xs font-semibold transition ${
                    preview.day37Pattern === p.id
                      ? 'border-[#0A2540] bg-[#0A2540] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                QoS 신뢰성 정책 (Reliability)
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                Best-Effort(실시간) vs Reliable(재전송 보장)
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({
                  day37QosReliable: !preview.day37QosReliable,
                })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day37QosReliable
                  ? 'border-amber-300 bg-amber-50 text-amber-800'
                  : 'border-emerald-300 bg-emerald-50 text-emerald-700'
              }`}
            >
              {preview.day37QosReliable ? 'Reliable' : 'Best-Effort'}
            </button>
          </div>

          <SliderRow
            label="Wi-Fi 무선 패킷 손실률"
            valueLabel={`${preview.day37PacketLossPct}%`}
            min={0}
            max={40}
            step={5}
            value={preview.day37PacketLossPct}
            onChange={(day37PacketLossPct) =>
              onChangePreview({ day37PacketLossPct })
            }
          />
        </div>
      )}

      {module.id === 'day38_tf2_urdf' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="flex items-center justify-between gap-3 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                base_link → laser_link Static TF 등록
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                OFF 시 센서 오프셋이 무시되어 지도상 벽 위치가 뒤로 밀립니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({ day38TfConfigured: !preview.day38TfConfigured })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day38TfConfigured
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-rose-300 bg-rose-50 text-rose-700'
              }`}
            >
              {preview.day38TfConfigured ? 'Static TF ON' : '누락 OFF'}
            </button>
          </div>

          <SliderRow
            label="센서 전방 장착 거리 오프셋 (URDF +X)"
            valueLabel={`+${preview.day38CamOffsetCm} cm`}
            min={5}
            max={35}
            step={1}
            value={preview.day38CamOffsetCm}
            onChange={(day38CamOffsetCm) =>
              onChangePreview({ day38CamOffsetCm })
            }
          />
        </div>
      )}

      {module.id === 'day39_vision' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              색공간 마스킹 방식
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[
                { id: 'rgb' as const, label: 'RGB 임계값 (조명 취약)' },
                { id: 'hsv' as const, label: 'HSV Hue 분리 (강인함)' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onChangePreview({ day39ColorSpace: c.id })}
                  className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                    preview.day39ColorSpace === c.id
                      ? 'border-[#635BFF] bg-[#635BFF] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                저조도 / 그림자 환경 시뮬레이션
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                어두운 그늘에서 RGB 대비 HSV의 압도적 내성을 확인하세요.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({ day39LowLight: !preview.day39LowLight })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day39LowLight
                  ? 'border-slate-700 bg-slate-800 text-white'
                  : 'border-[#E6E8EC] bg-white text-[#425466]'
              }`}
            >
              {preview.day39LowLight ? '어두움 ON' : '밝음'}
            </button>
          </div>

          <SliderRow
            label="ArUco 마커까지 실제 거리 (Z)"
            valueLabel={`${preview.day39ArucoDistCm} cm`}
            min={35}
            max={180}
            step={5}
            value={preview.day39ArucoDistCm}
            onChange={(day39ArucoDistCm) =>
              onChangePreview({ day39ArucoDistCm })
            }
          />
        </div>
      )}

      {module.id === 'day40_mcl_particle' && (
        <div className="py-4">
          <div className="text-xs font-medium text-[#0A2540]">
            MCL 파티클 필터 단계 시뮬레이션
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {[
              { s: 0 as const, label: '0. 전역 살포' },
              { s: 1 as const, label: '1. 다봉 가설(우도)' },
              { s: 2 as const, label: '2. 리샘플링 수렴' },
              { s: 3 as const, label: '3. 납치 복구' },
            ].map((btn) => (
              <button
                key={btn.s}
                type="button"
                onClick={() => onChangePreview({ day40MclStage: btn.s })}
                className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                  preview.day40MclStage === btn.s
                    ? 'border-[#635BFF] bg-[#635BFF] text-white'
                    : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {module.id === 'day41_slam_grid' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="flex items-center justify-between gap-3 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                루프 클로저 &amp; Pose-Graph 최적화
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                출발점 재방문 시 어긋난 지도를 한 겹으로 정렬합니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({ day41LoopClosure: !preview.day41LoopClosure })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day41LoopClosure
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-rose-300 bg-rose-50 text-rose-700'
              }`}
            >
              {preview.day41LoopClosure ? 'ON (정합)' : 'OFF (이중벽)'}
            </button>
          </div>

          <SliderRow
            label="주행 누적 오도메트리 각도 드리프트"
            valueLabel={`${preview.day41OdomDriftDeg}°`}
            min={0}
            max={20}
            step={1}
            value={preview.day41OdomDriftDeg}
            onChange={(day41OdomDriftDeg) =>
              onChangePreview({ day41OdomDriftDeg })
            }
          />
        </div>
      )}

      {module.id === 'day42_maze_project' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              미로 자율주행 내비게이션 스택
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[
                { id: 'astar_only' as const, label: '정적 A* 단독' },
                { id: 'full_nav' as const, label: 'SLAM + C-Space + DWA' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangePreview({ day42NavMode: m.id })}
                  className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                    preview.day42NavMode === m.id
                      ? 'border-[#635BFF] bg-[#635BFF] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                경로 위 신규 돌발 상자 출현
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                DWA 지역 회피 및 재계획 동작을 시험합니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({
                  day42ObstacleBlocked: !preview.day42ObstacleBlocked,
                })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day42ObstacleBlocked
                  ? 'border-amber-300 bg-amber-50 text-amber-800'
                  : 'border-[#E6E8EC] bg-white text-[#425466]'
              }`}
            >
              {preview.day42ObstacleBlocked ? '상자 ON' : '없음'}
            </button>
          </div>
        </div>
      )}

      {module.id === 'day43_pcb_design' && (
        <div className="divide-y divide-[#ECEEF2]">
          <SliderRow
            label="3A 모터 전원 트레이스 선폭 (≥1.4mm 안전)"
            valueLabel={`${preview.day43TraceWidthMm.toFixed(2)} mm`}
            min={0.2}
            max={2.5}
            step={0.1}
            value={preview.day43TraceWidthMm}
            onChange={(day43TraceWidthMm) =>
              onChangePreview({ day43TraceWidthMm })
            }
          />
          <div className="flex items-center justify-between gap-3 py-4">
            <span className="text-xs font-medium text-[#0A2540]">
              0.1µF 디커플링 캡 (IC 핀 2mm 이내 배치)
            </span>
            <button
              type="button"
              onClick={() =>
                onChangePreview({
                  day43DecouplingClose: !preview.day43DecouplingClose,
                })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day43DecouplingClose
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-rose-300 bg-rose-50 text-rose-700'
              }`}
            >
              {preview.day43DecouplingClose ? '직근 OK' : '멂 (리플!)'}
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 py-4">
            <span className="text-xs font-medium text-[#0A2540]">
              하단 GND 구리 플레인 (Copper Pour)
            </span>
            <button
              type="button"
              onClick={() =>
                onChangePreview({ day43GndPour: !preview.day43GndPour })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day43GndPour
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-[#E6E8EC] bg-white text-[#425466]'
              }`}
            >
              {preview.day43GndPour ? 'Pour ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}

      {module.id === 'day44_debugging' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              5분 격리 진단 4단계 선택
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[
                { id: 'power' as const, label: '1. 전원 레일' },
                { id: 'boot' as const, label: '2. 부팅/UART' },
                { id: 'i2c' as const, label: '3. I2C 스캔' },
                { id: 'emi' as const, label: '4. 모터 EMI' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onChangePreview({ day44DebugStage: s.id })}
                  className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                    preview.day44DebugStage === s.id
                      ? 'border-[#0A2540] bg-[#0A2540] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 py-4">
            <div>
              <div className="text-xs font-medium text-[#0A2540]">
                DC 모터 0.1µF 캡 + 연선(Twisted Pair) EMI 대책
              </div>
              <div className="mt-0.5 text-[11px] text-[#697386]">
                4단계에서 브러시 스파크 I2C 깨짐을 복구합니다.
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChangePreview({
                  day44EmiFilterCaps: !preview.day44EmiFilterCaps,
                })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day44EmiFilterCaps
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-rose-300 bg-rose-50 text-rose-700'
              }`}
            >
              {preview.day44EmiFilterCaps ? 'EMI 대책 ON' : 'OFF (노이즈!)'}
            </button>
          </div>
        </div>
      )}

      {module.id === 'day45_capstone' && (
        <div className="divide-y divide-[#ECEEF2]">
          <div className="py-4">
            <div className="text-xs font-medium text-[#0A2540]">
              자율 픽앤플레이스 미션 단계
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[
                { id: 'nav' as const, label: '1. A*+PID 접근' },
                { id: 'vision' as const, label: '2. ArUco+TF2 인식' },
                { id: 'pick' as const, label: '3. 2R IK 파지' },
                { id: 'place' as const, label: '4. 목표 바구니 안착' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onChangePreview({ day45Stage: s.id })}
                  className={`rounded-lg border py-2 text-[11px] font-medium transition ${
                    preview.day45Stage === s.id
                      ? 'border-[#635BFF] bg-[#635BFF] text-white'
                      : 'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 py-4">
            <span className="text-xs font-medium text-[#0A2540]">
              전원 2레일 분리 (5V Buck + 모터 분리)
            </span>
            <button
              type="button"
              onClick={() =>
                onChangePreview({
                  day45PowerSeparated: !preview.day45PowerSeparated,
                })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day45PowerSeparated
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-rose-300 bg-rose-50 text-rose-700'
              }`}
            >
              {preview.day45PowerSeparated ? '분리 OK' : 'Brownout 위험'}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 py-4">
            <span className="text-xs font-medium text-[#0A2540]">
              TF2 (camera → arm_base) 좌표 정합
            </span>
            <button
              type="button"
              onClick={() =>
                onChangePreview({
                  day45TfVerified: !preview.day45TfVerified,
                })
              }
              className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                preview.day45TfVerified
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-rose-300 bg-rose-50 text-rose-700'
              }`}
            >
              {preview.day45TfVerified ? '정합 OK' : 'TF 오류'}
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-[#E6E8EC] pt-5">
        <button
          type="button"
          onClick={() => onSelectTab('code')}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0A2540] px-4 text-xs font-semibold text-white transition hover:bg-[#163459]"
        >
          <span>다음 단계: 코드 랩 & 버그 수정</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
