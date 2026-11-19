import { AlertOctagon, Cpu, Wifi } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ESP32_PINS, PIN_CATEGORY_META } from '../../data/esp32Pins';
import { LabModule, PinSafetyCategory } from '../../types/lab';

interface PinoutTabProps {
  module: LabModule;
  selectedPinId: string | null;
  onSelectPin: (pinId: string) => void;
  wifiActive: boolean;
}

export function PinoutTab({
  module,
  selectedPinId,
  onSelectPin,
  wifiActive,
}: PinoutTabProps) {
  const [filter, setFilter] = useState<'all' | PinSafetyCategory>('all');

  const filteredPins = useMemo(() => {
    if (filter === 'all') return ESP32_PINS;
    return ESP32_PINS.filter((p) => p.category === filter);
  }, [filter]);

  const selectedPin = useMemo(
    () => ESP32_PINS.find((p) => p.id === selectedPinId) ?? ESP32_PINS[5], // default GPIO 32
    [selectedPinId],
  );

  // For non-ESP32 modules, show module-specific wiring notes + link to ESP32 full map
  if (module.id !== 'esp32') {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-300">
            <Cpu className="h-4 w-4" />
            <span>{module.shortTitle} ESP32 권장 배선 매핑</span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
            하드웨어 보호와 부팅 안정성을 고려해 ESP-WROOM-32 기준 안전 핀에 배선한 가이드입니다.
          </p>
        </div>

        <div className="space-y-2.5">
          {module.wiringNotes.map((wire) => (
            <div
              key={wire.signal}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-100">{wire.signal}</span>
                <span className="rounded-md border border-sky-500/35 bg-sky-500/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-sky-300">
                  {wire.pin}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                {wire.detail}
              </p>
              {wire.warning && (
                <div className="mt-2 flex items-start gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-[11px] text-rose-200">
                  <AlertOctagon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
                  <span>{wire.warning}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const meta = PIN_CATEGORY_META[selectedPin.category];
  const adc2Conflict = wifiActive && selectedPin.adcChannel === 'ADC2';

  return (
    <div className="space-y-4">
      {/* Selected Pin Detail Card */}
      <div className="rounded-xl border border-slate-700/80 bg-slate-900/90 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${meta.dotClass}`} />
            <span className="font-mono text-base font-bold text-slate-100">
              {selectedPin.label}
            </span>
          </div>
          <span
            className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${meta.badgeClass}`}
          >
            {selectedPin.categoryLabel}
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          {selectedPin.summary}
        </p>

        {/* Capability Pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {selectedPin.roles.map((role) => (
            <span
              key={role}
              className="rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] text-slate-300"
            >
              {role}
            </span>
          ))}
          <span className="rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] text-slate-300">
            PWM: {selectedPin.pwmCapable ? '가능' : '불가'}
          </span>
          <span className="rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] text-slate-300">
            내부 풀업/다운: {selectedPin.internalPullResistor ? '있음' : '없음'}
          </span>
        </div>

        {adc2Conflict && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-rose-500/40 bg-rose-500/15 p-2.5 text-xs text-rose-200">
            <Wifi className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
            <span>
              <strong>Wi-Fi 활성화 충돌:</strong> 이 핀은 <code>ADC2</code> 블록에 속해 있어 현재 Wi-Fi 사용 중 아날로그 전압 읽기(analogRead)가 중단됩니다. ADC1 핀(32~39)을 사용하세요.
            </span>
          </div>
        )}

        {selectedPin.caution && (
          <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-amber-500/35 bg-amber-500/10 p-2.5 text-xs text-amber-200">
            <AlertOctagon className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <span>{selectedPin.caution}</span>
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-1.5">
        {(
          [
            { id: 'all', label: '전체' },
            { id: 'safe', label: '안전 핀' },
            { id: 'input_only', label: '입력 전용' },
            { id: 'strapping', label: '스트래핑' },
            { id: 'prohibited', label: '사용 금지(6~11)' },
            { id: 'power', label: '전원' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`min-h-[34px] rounded-lg border px-2.5 text-[11px] font-medium transition ${
              filter === item.id
                ? 'border-sky-400/60 bg-sky-500/20 text-sky-200'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Interactive Pin List (Bidirectionally Synced with 3D Board) */}
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {filteredPins.map((pin) => {
          const pinMeta = PIN_CATEGORY_META[pin.category];
          const isSelected = pin.id === selectedPin.id;
          const isConflict = wifiActive && pin.adcChannel === 'ADC2';
          return (
            <button
              key={pin.id}
              type="button"
              onClick={() => onSelectPin(pin.id)}
              className={`flex min-h-[44px] items-center justify-between rounded-xl border px-3 py-2 text-left transition ${
                isSelected
                  ? 'border-sky-400 bg-sky-500/15'
                  : 'border-slate-800/90 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${pinMeta.dotClass}`} />
                <div>
                  <div className="font-mono text-xs font-bold text-slate-100">
                    {pin.label}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {pin.roles[0]}
                  </div>
                </div>
              </div>
              {isConflict ? (
                <span className="rounded bg-rose-500/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-rose-300">
                  Wi-Fi 충돌
                </span>
              ) : pin.adcChannel ? (
                <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                  {pin.adcChannel}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
