import { useMemo, useState } from 'react';
import { ESP32_PINS, PIN_CATEGORY_META } from '../../data/esp32Pins';
import { LabModule, PinSafetyCategory } from '../../types/lab';
import { GlossaryText } from '../GlossaryText';

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
    () => ESP32_PINS.find((p) => p.id === selectedPinId) ?? ESP32_PINS[5],
    [selectedPinId],
  );

  // Non-ESP32 modules: clean hairline wiring specification table
  if (module.id !== 'esp32') {
    return (
      <div className="space-y-5">
        <header>
          <div className="text-xs font-semibold text-[#0A2540]">
            {module.shortTitle} 안전 배선 가이드
          </div>
          <p className="mt-1 text-xs text-[#697386]">
            전원 손상과 부팅 충돌을 피하기 위한 실전 배선 기준입니다.
          </p>
        </header>

        <div className="divide-y divide-[#ECEEF2] border-y border-[#E6E8EC]">
          {module.wiringNotes.map((wire) => (
            <div key={wire.signal} className="py-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#0A2540]">
                  <GlossaryText text={wire.signal} />
                </span>
                <span className="rounded bg-[#F1F3F6] px-2 py-0.5 font-mono text-[11px] font-medium text-[#0A2540]">
                  {wire.pin}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[#425466]">
                <GlossaryText text={wire.detail} />
              </p>
              {wire.warning && (
                <p className="mt-2 border-l-2 border-rose-500 pl-2.5 text-[11px] font-medium text-rose-700">
                  <GlossaryText text={wire.warning} />
                </p>
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
    <div className="space-y-6">
      {/* Selected Pin Detail (Directly on White Surface + Subtle Tinted Block) */}
      <section className="rounded-xl bg-[#F7F8FA] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} />
            <span className="font-mono text-sm font-bold text-[#0A2540]">
              {selectedPin.label}
            </span>
          </div>
          <span
            className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${meta.badgeClass}`}
          >
            {selectedPin.categoryLabel}
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-[#425466]">
          <GlossaryText text={selectedPin.summary} />
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {selectedPin.roles.map((role) => (
            <span
              key={role}
              className="rounded bg-white px-2 py-0.5 font-mono text-[10px] font-medium text-[#425466]"
            >
              {role}
            </span>
          ))}
          <span className="rounded bg-white px-2 py-0.5 font-mono text-[10px] font-medium text-[#425466]">
            PWM: {selectedPin.pwmCapable ? '가능' : '불가'}
          </span>
          <span className="rounded bg-white px-2 py-0.5 font-mono text-[10px] font-medium text-[#425466]">
            풀업/다운: {selectedPin.internalPullResistor ? '있음' : '없음'}
          </span>
        </div>

        {adc2Conflict && (
          <div className="mt-3 border-l-2 border-rose-500 pl-3 text-xs text-rose-700">
            <strong>Wi-Fi 충돌:</strong> <code>ADC2</code> 블록에 속해 있어 Wi-Fi 구동 중 analogRead가 중단됩니다. ADC1(32~39)을 사용하세요.
          </div>
        )}

        {selectedPin.caution && (
          <div className="mt-2.5 border-l-2 border-amber-500 pl-3 text-xs text-amber-800">
            <GlossaryText text={selectedPin.caution} />
          </div>
        )}
      </section>

      {/* Minimal Filter Strip */}
      <div className="flex flex-wrap gap-1.5">
        {(
          [
            { id: 'all', label: '전체' },
            { id: 'safe', label: '안전 핀' },
            { id: 'input_only', label: '입력 전용' },
            { id: 'strapping', label: '스트래핑' },
            { id: 'prohibited', label: '사용 금지' },
            { id: 'power', label: '전원' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
              filter === item.id
                ? 'bg-[#0A2540] text-white'
                : 'bg-[#F7F8FA] text-[#425466] hover:bg-[#ECEEF2] hover:text-[#0A2540]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Clean Hairline Pin Directory */}
      <div className="divide-y divide-[#ECEEF2] border-y border-[#E6E8EC]">
        {filteredPins.map((pin) => {
          const pinMeta = PIN_CATEGORY_META[pin.category];
          const isSelected = pin.id === selectedPin.id;
          const isConflict = wifiActive && pin.adcChannel === 'ADC2';
          return (
            <button
              key={pin.id}
              type="button"
              onClick={() => onSelectPin(pin.id)}
              className={`flex w-full items-center justify-between gap-2 px-2 py-2.5 text-left transition ${
                isSelected ? 'bg-[#EEF2FF]' : 'hover:bg-[#F7F8FA]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`h-2 w-2 rounded-full ${pinMeta.dotClass}`} />
                <span className="font-mono text-xs font-semibold text-[#0A2540]">
                  {pin.label}
                </span>
                <span className="text-[11px] text-[#697386]">
                  {pin.roles[0]}
                </span>
              </div>
              {isConflict ? (
                <span className="font-mono text-[10px] font-semibold text-rose-600">
                  Wi-Fi 충돌
                </span>
              ) : pin.adcChannel ? (
                <span className="font-mono text-[10px] text-[#697386]">
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
