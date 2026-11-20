import { Maximize2, Minimize2, X } from 'lucide-react';
import { useState } from 'react';
import { ModuleId } from '../../types/lab';

interface SchematicPipOverlayProps {
  moduleId: ModuleId;
  onClose: () => void;
}

export function SchematicPipOverlay({
  moduleId,
  onClose,
}: SchematicPipOverlayProps) {
  const [expanded, setExpanded] = useState(false);

  const isEspBoard = moduleId === 'day08_board' || moduleId === 'esp32';
  const isBasicCircuit = moduleId === 'day01_basics' || moduleId === 'day02_breadboard';
  const isDivider = moduleId === 'day05_divider' || moduleId === 'day07_project';
  const isRover =
    moduleId === 'day16_rover_project' ||
    moduleId === 'day34_fusion_project' ||
    moduleId === 'day45_capstone';
  const isSonar = moduleId === 'ultrasonic';
  const isPid = moduleId === 'pid';

  return (
    <div
      className={`pointer-events-auto overflow-hidden rounded-xl border border-[#E6E8EC] bg-white/95 shadow-sm backdrop-blur-sm transition-all ${
        expanded ? 'w-[290px] sm:w-[340px]' : 'w-[195px] sm:w-[228px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#ECEEF2] bg-[#F7F8FA] px-2.5 py-1.5">
        <span className="font-mono text-[10px] font-semibold text-[#0A2540]">
          {isEspBoard
            ? '회로도 · ESP32 내부 전원/LED'
            : isBasicCircuit
              ? '회로도 · 직류 + 저항 + LED'
              : isDivider
                ? '회로도 · HC-SR04 5V→3.3V 분압'
                : isRover
                  ? '아키텍처 · 2S LiPo 전원 분리'
                  : isSonar
                    ? '회로도 · HC-SR04 ToF 배선'
                    : isPid
                      ? '제어 블록도 · 디지털 PID 루프'
                      : '기구 도식 · 좌표계 변환'}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            title={expanded ? '축소' : '확대'}
            className="rounded p-0.5 text-[#697386] hover:bg-[#E6E8EC] hover:text-[#0A2540]"
          >
            {expanded ? (
              <Minimize2 className="h-3 w-3" />
            ) : (
              <Maximize2 className="h-3 w-3" />
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            title="회로도 닫기"
            className="rounded p-0.5 text-[#697386] hover:bg-[#E6E8EC] hover:text-[#0A2540]"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Inline 2D SVG Schematic */}
      <div className="p-2">
        {isEspBoard ? (
          <svg viewBox="0 0 260 155" className="w-full select-none">
            <rect x="6" y="6" width="248" height="143" rx="6" fill="#FAFBFD" stroke="#E6E8EC" />
            <rect x="86" y="20" width="92" height="114" rx="4" fill="#FFFFFF" stroke="#0A2540" strokeWidth="1.5" />
            <text x="132" y="38" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0A2540">
              ESP32-WROOM
            </text>
            <text x="14" y="48" fontSize="8" fontFamily="monospace" fill="#475569">USB 5V</text>
            <line x1="48" y1="45" x2="86" y2="45" stroke="#EF4444" strokeWidth="1.5" />
            <text x="92" y="48" fontSize="7.5" fontFamily="monospace" fill="#EF4444">VIN/LDO</text>

            <text x="92" y="70" fontSize="7.5" fontFamily="monospace" fill="#D97706">3V3</text>
            <line x1="56" y1="67" x2="86" y2="67" stroke="#F59E0B" strokeWidth="1.5" />
            <text x="16" y="70" fontSize="8" fontFamily="monospace" fill="#D97706">3.3V</text>

            <text x="92" y="96" fontSize="7.5" fontFamily="monospace" fill="#059669">GPIO 0</text>
            <line x1="50" y1="93" x2="86" y2="93" stroke="#10B981" strokeWidth="1.4" />
            <rect x="28" y="87" width="22" height="12" rx="2" fill="#ECFDF5" stroke="#10B981" />
            <text x="39" y="96" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#047857">BOOT</text>

            <text x="172" y="64" textAnchor="end" fontSize="7.5" fontFamily="monospace" fill="#2563EB">GPIO 2</text>
            <line x1="178" y1="61" x2="196" y2="61" stroke="#3B82F6" strokeWidth="1.5" />
            <rect x="196" y="57" width="18" height="8" rx="1" fill="#FEF3C7" stroke="#D97706" />
            <line x1="214" y1="61" x2="226" y2="61" stroke="#3B82F6" strokeWidth="1.5" />
            <circle cx="233" cy="61" r="6" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" />
            <text x="233" y="77" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#1D4ED8">LED</text>
            <line x1="233" y1="67" x2="233" y2="118" stroke="#64748B" strokeWidth="1.2" />
            <line x1="226" y1="118" x2="240" y2="118" stroke="#64748B" strokeWidth="1.5" />
            <text x="233" y="130" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#475569">GND</text>

            <text x="132" y="122" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#DC2626">
              GPIO 6~11: Flash 전용 금지
            </text>
          </svg>
        ) : isBasicCircuit ? (
          <svg viewBox="0 0 260 155" className="w-full select-none">
            <rect x="6" y="6" width="248" height="143" rx="6" fill="#FAFBFD" stroke="#E6E8EC" />
            <rect x="24" y="48" width="44" height="58" rx="4" fill="#FFFFFF" stroke="#0A2540" strokeWidth="1.5" />
            <text x="46" y="74" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0A2540">전원 +V</text>
            <text x="46" y="88" textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill="#EF4444">3.3~9V</text>
            <line x1="68" y1="58" x2="108" y2="58" stroke="#EF4444" strokeWidth="1.6" />
            <rect x="108" y="51" width="38" height="14" rx="2" fill="#FEF3C7" stroke="#D97706" />
            <text x="127" y="61" textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill="#92400E">R (Ω)</text>
            <line x1="146" y1="58" x2="188" y2="58" stroke="#EF4444" strokeWidth="1.6" />
            <circle cx="200" cy="58" r="10" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
            <text x="200" y="61" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#DC2626">LED</text>
            <path d="M 200 68 L 200 112 L 46 112 L 46 106" fill="none" stroke="#475569" strokeWidth="1.4" />
            <text x="130" y="128" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#475569">
              I = (V - Vf) / R · 공통 GND 폐회로
            </text>
          </svg>
        ) : isDivider || isSonar ? (
          <svg viewBox="0 0 260 155" className="w-full select-none">
            <rect x="6" y="6" width="248" height="143" rx="6" fill="#FAFBFD" stroke="#E6E8EC" />
            <rect x="14" y="30" width="76" height="94" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
            <text x="52" y="52" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0284C7">HC-SR04</text>
            <text x="52" y="66" textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill="#64748B">5V 로직</text>
            <line x1="90" y1="84" x2="132" y2="84" stroke="#EF4444" strokeWidth="1.5" />
            <text x="110" y="78" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#DC2626">ECHO 5V</text>
            <rect x="132" y="78" width="22" height="12" rx="2" fill="#FEF3C7" stroke="#D97706" />
            <text x="143" y="87" textAnchor="middle" fontSize="7" fontFamily="monospace">10k</text>
            <line x1="154" y1="84" x2="180" y2="84" stroke="#10B981" strokeWidth="1.5" />
            <line x1="162" y1="84" x2="162" y2="108" stroke="#64748B" strokeWidth="1.2" />
            <rect x="152" y="108" width="20" height="12" rx="2" fill="#FEF3C7" stroke="#D97706" />
            <text x="162" y="117" textAnchor="middle" fontSize="7" fontFamily="monospace">20k</text>
            <line x1="162" y1="120" x2="162" y2="132" stroke="#64748B" strokeWidth="1.5" />
            <rect x="180" y="30" width="66" height="94" rx="4" fill="#FFFFFF" stroke="#0A2540" strokeWidth="1.5" />
            <text x="213" y="52" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0A2540">ESP32</text>
            <text x="213" y="88" textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill="#059669">3.3V 안전!</text>
          </svg>
        ) : isRover ? (
          <svg viewBox="0 0 260 155" className="w-full select-none">
            <rect x="6" y="6" width="248" height="143" rx="6" fill="#FAFBFD" stroke="#E6E8EC" />
            <rect x="14" y="48" width="52" height="58" rx="4" fill="#1E293B" />
            <text x="40" y="74" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#FFFFFF">2S LiPo</text>
            <text x="40" y="88" textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill="#38BDF8">7.4V</text>
            <line x1="66" y1="62" x2="104" y2="42" stroke="#EF4444" strokeWidth="1.5" />
            <line x1="66" y1="90" x2="104" y2="108" stroke="#10B981" strokeWidth="1.5" />
            <rect x="104" y="24" width="62" height="36" rx="4" fill="#FEE2E2" stroke="#EF4444" />
            <text x="135" y="45" textAnchor="middle" fontSize="8" fontWeight="700" fill="#B91C1C">모터 드라이버</text>
            <rect x="104" y="90" width="62" height="36" rx="4" fill="#ECFDF5" stroke="#10B981" />
            <text x="135" y="111" textAnchor="middle" fontSize="8" fontWeight="700" fill="#047857">5V Buck→ESP</text>
            <line x1="166" y1="108" x2="196" y2="108" stroke="#635BFF" strokeWidth="1.5" />
            <rect x="196" y="34" width="48" height="90" rx="4" fill="#EEF2FF" stroke="#635BFF" />
            <text x="220" y="76" textAnchor="middle" fontSize="8" fontWeight="700" fill="#4338CA">로봇 제어</text>
            <text x="220" y="90" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4338CA">공통 GND</text>
          </svg>
        ) : (
          <svg viewBox="0 0 260 155" className="w-full select-none">
            <rect x="6" y="6" width="248" height="143" rx="6" fill="#FAFBFD" stroke="#E6E8EC" />
            <rect x="18" y="52" width="54" height="44" rx="5" fill="#EEF2FF" stroke="#635BFF" />
            <text x="45" y="77" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#4338CA">목표 입력</text>
            <line x1="72" y1="74" x2="102" y2="74" stroke="#0A2540" strokeWidth="1.5" />
            <rect x="102" y="52" width="62" height="44" rx="5" fill="#FFFFFF" stroke="#0A2540" />
            <text x="133" y="77" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#0A2540">
              {isPid ? 'PID 연산' : '기구학 변환'}
            </text>
            <line x1="164" y1="74" x2="192" y2="74" stroke="#0A2540" strokeWidth="1.5" />
            <rect x="192" y="52" width="52" height="44" rx="5" fill="#ECFDF5" stroke="#10B981" />
            <text x="218" y="77" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#047857">서보/로봇</text>
            <path d="M 218 96 L 218 124 L 45 124 L 45 96" fill="none" stroke="#64748B" strokeDasharray="3 2" strokeWidth="1.3" />
            <text x="132" y="136" textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill="#64748B">
              센서 피드백 폐루프 (Feedback)
            </text>
          </svg>
        )}
      </div>
    </div>
  );
}
