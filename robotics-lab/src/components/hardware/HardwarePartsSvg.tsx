import { ESP32_PINS, PIN_CATEGORY_META } from '../../data/esp32Pins';

/* -------------------------------------------------------------------------- */
/* Resistor Color Code Helper (IEC 60062 4-Band)                              */
/* -------------------------------------------------------------------------- */
const DIGIT_COLORS = [
  '#1E293B', // 0 Black
  '#78350F', // 1 Brown
  '#DC2626', // 2 Red
  '#EA580C', // 3 Orange
  '#EAB308', // 4 Yellow
  '#16A34A', // 5 Green
  '#2563EB', // 6 Blue
  '#7C3AED', // 7 Violet
  '#64748B', // 8 Grey
  '#F8FAFC', // 9 White
];

function getResistorBands(ohms: number): [string, string, string, string] {
  if (ohms <= 0) return ['#1E293B', '#1E293B', '#1E293B', '#1E293B'];
  const rounded = Math.max(10, Math.round(ohms));
  const exp = Math.floor(Math.log10(rounded)) - 1;
  const base = Math.round(rounded / Math.pow(10, exp));
  const d1 = Math.min(9, Math.max(0, Math.floor(base / 10)));
  const d2 = Math.min(9, Math.max(0, base % 10));
  const mult = Math.min(9, Math.max(0, exp));
  return [DIGIT_COLORS[d1], DIGIT_COLORS[d2], DIGIT_COLORS[mult], '#D4AF37'];
}

/* -------------------------------------------------------------------------- */
/* 1. Realistic MB-102 Breadboard (30 Columns x a..j + Top/Bottom Rails)      */
/* -------------------------------------------------------------------------- */
export function RealBreadboardSvg({
  x = 0,
  y = 0,
  scale = 1,
  xray = false,
  highlightRowX,
  shortRowX,
  highlightRail,
}: {
  x?: number;
  y?: number;
  scale?: number;
  xray?: boolean;
  highlightRowX?: number;
  shortRowX?: number;
  highlightRail?: 'top_plus' | 'top_minus' | 'bot_plus' | 'bot_minus';
}) {
  // 24 visible columns spaced at 18px each for crisp readability
  const cols = Array.from({ length: 24 }, (_, i) => i + 1);
  const colSpacing = 18;
  const startX = 34;
  const boardW = 480;
  const boardH = 220;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Soft Drop Base */}
      <rect
        x="2"
        y="4"
        width={boardW}
        height={boardH}
        rx="8"
        fill="#CBD5E1"
        opacity="0.45"
      />
      {/* Main ABS Plastic Body */}
      <rect
        x="0"
        y="0"
        width={boardW}
        height={boardH}
        rx="8"
        fill={xray ? 'rgba(255,255,255,0.45)' : '#FAF9F6'}
        stroke="#CBD5E1"
        strokeWidth="1.5"
      />

      {/* Internal Copper Clips Layer (Visible clearly in X-Ray mode!) */}
      <g opacity={xray ? 0.92 : 0}>
        {/* Top + / - Horizontal Copper Bus Strips */}
        <rect
          x="26"
          y="16"
          width={boardW - 52}
          height="6"
          rx="2"
          fill="#EF4444"
          opacity="0.7"
        />
        <rect
          x="26"
          y="32"
          width={boardW - 52}
          height="6"
          rx="2"
          fill="#2563EB"
          opacity="0.7"
        />
        {/* Bottom + / - Horizontal Copper Bus Strips */}
        <rect
          x="26"
          y={boardH - 38}
          width={boardW - 52}
          height="6"
          rx="2"
          fill="#EF4444"
          opacity="0.7"
        />
        <rect
          x="26"
          y={boardH - 22}
          width={boardW - 52}
          height="6"
          rx="2"
          fill="#2563EB"
          opacity="0.7"
        />

        {/* Vertical 5-Pin Terminal Copper Clips */}
        {cols.map((col, idx) => {
          const cx = startX + idx * colSpacing;
          const isShort = shortRowX === col;
          const isHl = highlightRowX === col;
          const clipColor = isShort
            ? '#E11D48'
            : isHl
              ? '#10B981'
              : '#D97706';
          return (
            <g key={col}>
              <rect
                x={cx - 4}
                y="54"
                width="8"
                height="48"
                rx="2"
                fill={clipColor}
                opacity={isShort || isHl ? 0.95 : 0.55}
              />
              <rect
                x={cx - 4}
                y="118"
                width="8"
                height="48"
                rx="2"
                fill={clipColor}
                opacity={isShort || isHl ? 0.95 : 0.55}
              />
            </g>
          );
        })}
      </g>

      {/* Top & Bottom Power Rail Lines */}
      <line
        x1="20"
        y1="12"
        x2={boardW - 20}
        y2="12"
        stroke="#EF4444"
        strokeWidth={highlightRail === 'top_plus' ? 2.5 : 1.5}
      />
      <line
        x1="20"
        y1="42"
        x2={boardW - 20}
        y2="42"
        stroke="#2563EB"
        strokeWidth={highlightRail === 'top_minus' ? 2.5 : 1.5}
      />
      <text x="10" y="23" fontSize="10" fontWeight="700" fill="#DC2626">
        +
      </text>
      <text x="11" y="38" fontSize="11" fontWeight="700" fill="#2563EB">
        -
      </text>

      <line
        x1="20"
        y1={boardH - 42}
        x2={boardW - 20}
        y2={boardH - 42}
        stroke="#EF4444"
        strokeWidth={highlightRail === 'bot_plus' ? 2.5 : 1.5}
      />
      <line
        x1="20"
        y1={boardH - 12}
        x2={boardW - 20}
        y2={boardH - 12}
        stroke="#2563EB"
        strokeWidth={highlightRail === 'bot_minus' ? 2.5 : 1.5}
      />
      <text
        x="10"
        y={boardH - 31}
        fontSize="10"
        fontWeight="700"
        fill="#DC2626"
      >
        +
      </text>
      <text
        x="11"
        y={boardH - 15}
        fontSize="11"
        fontWeight="700"
        fill="#2563EB"
      >
        -
      </text>

      {/* Center IC Trench Groove */}
      <rect
        x="18"
        y="104"
        width={boardW - 36}
        height="12"
        rx="2"
        fill="#E5E7EB"
        opacity={xray ? 0.35 : 0.9}
      />

      {/* Rail Pin Holes (Grouped in 5s) */}
      {cols.map((col, idx) => {
        if (col % 6 === 0) return null; // realistic breadboard rail gap
        const cx = startX + idx * colSpacing;
        return (
          <g key={`rail-${col}`}>
            <rect x={cx - 2.5} y="17" width="5" height="5" rx="1" fill="#334155" />
            <rect x={cx - 2.5} y="32" width="5" height="5" rx="1" fill="#334155" />
            <rect
              x={cx - 2.5}
              y={boardH - 37}
              width="5"
              height="5"
              rx="1"
              fill="#334155"
            />
            <rect
              x={cx - 2.5}
              y={boardH - 22}
              width="5"
              height="5"
              rx="1"
              fill="#334155"
            />
          </g>
        );
      })}

      {/* Main Terminal Matrix (a..e & f..j) + Silkscreen Labels */}
      {cols.map((col, idx) => {
        const cx = startX + idx * colSpacing;
        const topYs = [57, 67, 77, 87, 97];
        const botYs = [121, 131, 141, 151, 161];
        const isShort = shortRowX === col;
        return (
          <g key={`col-${col}`}>
            {(col === 1 || col % 5 === 0) && (
              <text
                x={cx}
                y="51"
                textAnchor="middle"
                fontSize="7"
                fontFamily="monospace"
                fill="#64748B"
              >
                {col}
              </text>
            )}
            {topYs.map((hy, rIdx) => (
              <rect
                key={`t-${rIdx}`}
                x={cx - 2.5}
                y={hy - 2.5}
                width="5"
                height="5"
                rx="1"
                fill={isShort ? '#E11D48' : '#1E293B'}
              />
            ))}
            {botYs.map((hy, rIdx) => (
              <rect
                key={`b-${rIdx}`}
                x={cx - 2.5}
                y={hy - 2.5}
                width="5"
                height="5"
                rx="1"
                fill="#1E293B"
              />
            ))}
          </g>
        );
      })}

      {/* Row Letters a..e / f..j */}
      {['a', 'b', 'c', 'd', 'e'].map((ch, i) => (
        <text
          key={ch}
          x="14"
          y={60 + i * 10}
          fontSize="7"
          fontFamily="monospace"
          fill="#64748B"
        >
          {ch}
        </text>
      ))}
      {['f', 'g', 'h', 'i', 'j'].map((ch, i) => (
        <text
          key={ch}
          x="14"
          y={124 + i * 10}
          fontSize="7"
          fontFamily="monospace"
          fill="#64748B"
        >
          {ch}
        </text>
      ))}
    </g>
  );
}

/* Helper to convert breadboard (col 1..24, row 'a'..'j' | 'top+' | 'top-' | 'bot+' | 'bot-') to SVG xy */
export function bbPin(
  boardX: number,
  boardY: number,
  col: number,
  row: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'top+' | 'top-' | 'bot+' | 'bot-',
  scale = 1,
): { x: number; y: number } {
  const px = boardX + (34 + (col - 1) * 18) * scale;
  const map: Record<string, number> = {
    'top+': 19.5,
    'top-': 34.5,
    a: 57,
    b: 67,
    c: 77,
    d: 87,
    e: 97,
    f: 121,
    g: 131,
    h: 141,
    i: 151,
    j: 161,
    'bot+': 220 - 34.5,
    'bot-': 220 - 19.5,
  };
  return { x: px, y: boardY + map[row] * scale };
}

/* -------------------------------------------------------------------------- */
/* 2. Realistic 30-Pin ESP32 DevKit V1 Board (Clickable Pins + Silkscreen)    */
/* -------------------------------------------------------------------------- */
export function RealEsp32BoardSvg({
  x = 0,
  y = 0,
  scale = 1,
  wifiActive = false,
  selectedPinId = null,
  onSelectPin,
  showInternalFlash = false,
}: {
  x?: number;
  y?: number;
  scale?: number;
  wifiActive?: boolean;
  selectedPinId?: string | null;
  onSelectPin?: (pinId: string) => void;
  showInternalFlash?: boolean;
}) {
  const leftPins = ESP32_PINS.filter((p) => p.side === 'left').sort(
    (a, b) => a.headerIndex - b.headerIndex,
  );
  const rightPins = ESP32_PINS.filter((p) => p.side === 'right').sort(
    (a, b) => a.headerIndex - b.headerIndex,
  );
  const flashPins = ESP32_PINS.filter((p) => p.side === 'internal');

  const w = 186;
  const h = 340;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <defs>
        <linearGradient id="rfShieldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="50%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
        <linearGradient id="usbSteel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="50%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>

      {/* Matte Black PCB Substrate */}
      <rect
        x="0"
        y="0"
        width={w}
        height={h}
        rx="8"
        fill="#141821"
        stroke="#334155"
        strokeWidth="1.5"
      />

      {/* 4 Gold Mounting Holes */}
      {[
        [10, 10],
        [w - 10, 10],
        [10, h - 10],
        [w - 10, h - 10],
      ].map(([hx, hy], i) => (
        <g key={i}>
          <circle cx={hx} cy={hy} r="6" fill="#D4AF37" />
          <circle cx={hx} cy={hy} r="3" fill="#F4F5F7" />
        </g>
      ))}

      {/* ESP-WROOM-32 Sub-PCB + Meander Antenna */}
      <rect
        x="36"
        y="8"
        width="114"
        height="136"
        rx="3"
        fill="#0B0F17"
        stroke="#334155"
        strokeWidth="1"
      />
      {/* Gold PCB Wi-Fi Antenna Trace */}
      <path
        d="M 48 30 L 48 16 L 62 16 L 62 28 L 76 28 L 76 16 L 90 16 L 90 28 L 104 28 L 104 16 L 118 16 L 118 28 L 138 28"
        fill="none"
        stroke={wifiActive ? '#38BDF8' : '#D97706'}
        strokeWidth="3"
        strokeLinecap="square"
      />
      {wifiActive && (
        <circle
          cx="93"
          cy="22"
          r="20"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
      )}

      {/* Brushed Steel RF Shield Can */}
      <rect
        x="42"
        y="38"
        width="102"
        height="100"
        rx="4"
        fill="url(#rfShieldGrad)"
        stroke="#64748B"
        strokeWidth="1"
      />
      <text
        x="93"
        y="82"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="700"
        fontFamily="monospace"
        fill="#334155"
      >
        ESP-WROOM-32
      </text>
      <text
        x="93"
        y="95"
        textAnchor="middle"
        fontSize="6.5"
        fontFamily="monospace"
        fill="#475569"
      >
        Wi-Fi + BLE MCU
      </text>

      {/* Internal SPI Flash X-Ray Overlay (GPIO 6..11) */}
      {showInternalFlash && (
        <g>
          <rect
            x="48"
            y="102"
            width="90"
            height="32"
            rx="3"
            fill="#1E293B"
            stroke="#F43F5E"
            strokeWidth="1.2"
          />
          <text
            x="93"
            y="114"
            textAnchor="middle"
            fontSize="6.5"
            fontWeight="700"
            fill="#FDA4AF"
          >
            SPI FLASH (금지 핀)
          </text>
          <g transform="translate(51, 118)">
            {flashPins.map((fp, i) => (
              <g
                key={fp.id}
                transform={`translate(${i * 14.5}, 0)`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPin?.(fp.id);
                }}
                className="cursor-pointer"
              >
                <rect
                  width="12"
                  height="11"
                  rx="1.5"
                  fill={selectedPinId === fp.id ? '#F43F5E' : '#881337'}
                />
                <text
                  x="6"
                  y="8"
                  textAnchor="middle"
                  fontSize="6"
                  fontWeight="700"
                  fill="#FFFFFF"
                >
                  {fp.gpio}
                </text>
              </g>
            ))}
          </g>
        </g>
      )}

      {/* CP2102 USB-UART Bridge IC */}
      <rect x="76" y="218" width="34" height="34" rx="2" fill="#0F172A" stroke="#475569" />
      <text
        x="93"
        y="238"
        textAnchor="middle"
        fontSize="6"
        fontFamily="monospace"
        fill="#94A3B8"
      >
        CP2102
      </text>

      {/* AMS1117 3.3V Voltage Regulator */}
      <rect x="48" y="264" width="24" height="30" rx="2" fill="#0F172A" stroke="#64748B" />
      <rect x="52" y="259" width="16" height="6" fill="#CBD5E1" />
      <text
        x="60"
        y="282"
        textAnchor="middle"
        fontSize="5.5"
        fontFamily="monospace"
        fill="#94A3B8"
      >
        3.3V
      </text>

      {/* EN & BOOT Tactile Push Buttons */}
      <g transform="translate(46, 304)">
        <rect width="20" height="16" rx="2" fill="#CBD5E1" />
        <circle cx="10" cy="8" r="4" fill="#334155" />
        <text x="10" y="-3" textAnchor="middle" fontSize="6" fontWeight="700" fill="#CBD5E1">
          EN
        </text>
      </g>
      <g transform="translate(120, 304)">
        <rect width="20" height="16" rx="2" fill="#CBD5E1" />
        <circle cx="10" cy="8" r="4" fill="#334155" />
        <text x="10" y="-3" textAnchor="middle" fontSize="6" fontWeight="700" fill="#CBD5E1">
          BOOT
        </text>
      </g>

      {/* Micro-USB Connector */}
      <rect
        x="73"
        y="314"
        width="40"
        height="28"
        rx="2"
        fill="url(#usbSteel)"
        stroke="#475569"
      />
      <text
        x="93"
        y="331"
        textAnchor="middle"
        fontSize="6.5"
        fontWeight="700"
        fontFamily="monospace"
        fill="#334155"
      >
        USB
      </text>

      {/* Power Red LED + GPIO2 Blue LED */}
      <rect x="66" y="294" width="6" height="4" fill="#EF4444" />
      <rect
        x="114"
        y="294"
        width="6"
        height="4"
        fill={wifiActive ? '#38BDF8' : '#1E3A8A'}
      />

      {/* Left 15 Gold Header Pins + Crisp Silkscreen */}
      {leftPins.map((pin) => {
        const py = 46 + pin.headerIndex * 18;
        const isSel = selectedPinId === pin.id;
        const isConflict = wifiActive && pin.adcChannel === 'ADC2';
        const dotColor = isConflict
          ? '#F43F5E'
          : PIN_CATEGORY_META[pin.category].colorHex;
        const shortName = pin.label.replace('GPIO ', 'D').replace('VP / ', '').replace('VN / ', '');

        return (
          <g
            key={pin.id}
            transform={`translate(12, ${py})`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPin?.(pin.id);
            }}
            className={onSelectPin ? 'cursor-pointer' : undefined}
          >
            {/* Selection Halo */}
            {isSel && (
              <rect
                x="-6"
                y="-7.5"
                width="46"
                height="15"
                rx="3"
                fill="rgba(99, 91, 255, 0.35)"
                stroke="#818CF8"
                strokeWidth="1"
              />
            )}
            {/* Gold Solder Pad & Square Header Pin */}
            <circle cx="0" cy="0" r="5.5" fill={dotColor} opacity="0.9" />
            <rect x="-2.2" y="-2.2" width="4.4" height="4.4" fill="#FACC15" />
            <text
              x="9"
              y="3"
              fontSize="7.5"
              fontWeight="600"
              fontFamily="monospace"
              fill={isConflict ? '#FDA4AF' : '#F8FAFC'}
            >
              {shortName}
            </text>
          </g>
        );
      })}

      {/* Right 15 Gold Header Pins + Crisp Silkscreen */}
      {rightPins.map((pin) => {
        const py = 46 + pin.headerIndex * 18;
        const isSel = selectedPinId === pin.id;
        const isConflict = wifiActive && pin.adcChannel === 'ADC2';
        const dotColor = isConflict
          ? '#F43F5E'
          : PIN_CATEGORY_META[pin.category].colorHex;
        const shortName = pin.label
          .replace('GPIO ', 'D')
          .replace('TX0 / ', '')
          .replace('RX0 / ', '');

        return (
          <g
            key={pin.id}
            transform={`translate(${w - 12}, ${py})`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPin?.(pin.id);
            }}
            className={onSelectPin ? 'cursor-pointer' : undefined}
          >
            {isSel && (
              <rect
                x="-40"
                y="-7.5"
                width="46"
                height="15"
                rx="3"
                fill="rgba(99, 91, 255, 0.35)"
                stroke="#818CF8"
                strokeWidth="1"
              />
            )}
            <circle cx="0" cy="0" r="5.5" fill={dotColor} opacity="0.9" />
            <rect x="-2.2" y="-2.2" width="4.4" height="4.4" fill="#FACC15" />
            <text
              x="-9"
              y="3"
              textAnchor="end"
              fontSize="7.5"
              fontWeight="600"
              fontFamily="monospace"
              fill={isConflict ? '#FDA4AF' : '#F8FAFC'}
            >
              {shortName}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. Realistic Axial Ceramic Resistor with Dynamic 4-Band Color Coding       */
/* -------------------------------------------------------------------------- */
export function RealResistorSvg({
  x1,
  y1,
  x2,
  y2,
  ohms,
  label,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  ohms: number;
  label?: string;
}) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const [b1, b2, b3, b4] = getResistorBands(ohms);

  return (
    <g>
      {/* Bent Metallic Leads */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#94A3B8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx={x1} cy={y1} r="3" fill="#64748B" />
      <circle cx={x2} cy={y2} r="3" fill="#64748B" />

      {ohms === 0 ? (
        /* 0Ω Jumper Wire Highlight */
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#E11D48"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      ) : (
        <g transform={`translate(${mx}, ${my}) rotate(${angle})`}>
          {/* Ceramic Body */}
          <rect
            x={-Math.min(20, dist * 0.34)}
            y="-7"
            width={Math.min(40, dist * 0.68)}
            height="14"
            rx="5"
            fill="#F5DEB3"
            stroke="#B45309"
            strokeWidth="1"
          />
          {/* 4 Color Bands */}
          <rect x="-12" y="-7" width="3.5" height="14" fill={b1} />
          <rect x="-5" y="-7" width="3.5" height="14" fill={b2} />
          <rect x="2" y="-7" width="3.5" height="14" fill={b3} />
          <rect x="10" y="-7" width="3" height="14" fill={b4} />
        </g>
      )}

      {label && (
        <text
          x={mx}
          y={my - 12}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fontFamily="monospace"
          fill={ohms === 0 ? '#E11D48' : '#0A2540'}
        >
          {label}
        </text>
      )}
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Realistic 5mm Domed LED with Glow / Burnout Smoke                       */
/* -------------------------------------------------------------------------- */
export function RealLedSvg({
  x,
  y,
  color = '#EF4444',
  litIntensity = 0, // 0..1
  overcurrent = false,
  label,
}: {
  x: number;
  y: number;
  color?: string;
  litIntensity?: number;
  overcurrent?: boolean;
  label?: string;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Anode (+) Long Leg & Cathode (-) Short Leg */}
      <line x1="-6" y1="6" x2="-6" y2="26" stroke="#94A3B8" strokeWidth="2.5" />
      <line x1="6" y1="6" x2="6" y2="22" stroke="#94A3B8" strokeWidth="2.5" />
      <text x="-11" y="25" fontSize="8" fontWeight="700" fill="#DC2626">
        +
      </text>
      <text x="9" y="22" fontSize="8" fontWeight="700" fill="#2563EB">
        -
      </text>

      {/* Outer Radial Light Halo */}
      {litIntensity > 0.05 && !overcurrent && (
        <circle
          cx="0"
          cy="-8"
          r={18 + litIntensity * 14}
          fill={color}
          opacity={0.18 + litIntensity * 0.25}
        />
      )}

      {/* Overcurrent Smoke Wisps */}
      {overcurrent && (
        <g opacity="0.75">
          <circle cx="-5" cy="-28" r="6" fill="#64748B" />
          <circle cx="4" cy="-37" r="8" fill="#94A3B8" />
          <circle cx="-2" cy="-47" r="5" fill="#CBD5E1" />
        </g>
      )}

      {/* Plastic Rim Collar */}
      <rect x="-12" y="0" width="24" height="7" rx="2" fill="#334155" />
      {/* Translucent LED Dome */}
      <path
        d="M -10 0 L -10 -12 A 10 10 0 0 1 10 -12 L 10 0 Z"
        fill={overcurrent ? '#1E293B' : color}
        opacity={overcurrent ? 0.95 : 0.35 + litIntensity * 0.65}
        stroke={overcurrent ? '#E11D48' : color}
        strokeWidth="1.2"
      />
      {/* Specular Reflection Highlight */}
      <path
        d="M -6 -4 L -6 -12 A 6 6 0 0 1 0 -17"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />

      {label && (
        <text
          x="0"
          y="-26"
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fontFamily="monospace"
          fill={overcurrent ? '#E11D48' : '#0A2540'}
        >
          {label}
        </text>
      )}
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. Realistic HC-SR04 Ultrasonic Sensor                                     */
/* -------------------------------------------------------------------------- */
export function RealHcsr04Svg({
  x = 0,
  y = 0,
  scale = 1,
}: {
  x?: number;
  y?: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Blue Solder Mask PCB */}
      <rect
        x="0"
        y="0"
        width="160"
        height="72"
        rx="5"
        fill="#0369A1"
        stroke="#0C4A6E"
        strokeWidth="1.5"
      />
      {/* 4 Mounting Holes */}
      {[
        [7, 7],
        [153, 7],
        [7, 65],
        [153, 65],
      ].map(([mx, my], i) => (
        <circle
          key={i}
          cx={mx}
          cy={my}
          r="3.2"
          fill="#F4F5F7"
          stroke="#FACC15"
          strokeWidth="1.5"
        />
      ))}

      {/* 40.000MHz Crystal Can */}
      <rect
        x="67"
        y="6"
        width="26"
        height="10"
        rx="3"
        fill="#CBD5E1"
        stroke="#64748B"
      />

      {/* Left & Right Metallic Ultrasonic Transducer Cans */}
      {[36, 124].map((cx, i) => (
        <g key={i} transform={`translate(${cx}, 34)`}>
          <circle
            cx="0"
            cy="0"
            r="26"
            fill="#E2E8F0"
            stroke="#94A3B8"
            strokeWidth="2"
          />
          <circle cx="0" cy="0" r="21" fill="#0F172A" />
          {/* Acoustic Mesh Crosshatch */}
          <circle
            cx="0"
            cy="0"
            r="16"
            fill="none"
            stroke="#475569"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <circle cx="0" cy="0" r="7" fill="#334155" />
          <text
            x="0"
            y="34"
            textAnchor="middle"
            fontSize="7"
            fontWeight="700"
            fill="#E0F2FE"
          >
            {i === 0 ? 'T (송신)' : 'R (수신)'}
          </text>
        </g>
      ))}

      <text
        x="80"
        y="36"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fontFamily="monospace"
        fill="#FFFFFF"
      >
        HC-SR04
      </text>

      {/* Bottom 4-Pin Silkscreen & Gold Pads */}
      {['VCC', 'TRIG', 'ECHO', 'GND'].map((sig, i) => {
        const px = 56 + i * 16;
        return (
          <g key={sig} transform={`translate(${px}, 65)`}>
            <text
              x="0"
              y="-6"
              textAnchor="middle"
              fontSize="5.5"
              fontWeight="700"
              fontFamily="monospace"
              fill="#F8FAFC"
            >
              {sig}
            </text>
            <rect x="-2.5" y="-2" width="5" height="9" fill="#FACC15" />
          </g>
        );
      })}
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. Realistic Handheld Digital Multimeter                                   */
/* -------------------------------------------------------------------------- */
export function RealMultimeterSvg({
  x = 0,
  y = 0,
  mode,
  reading,
  alert = false,
  onClickMode,
}: {
  x?: number;
  y?: number;
  mode: 'voltage' | 'resistance' | 'continuity';
  reading: string;
  alert?: boolean;
  onClickMode?: () => void;
}) {
  const dialAngle = mode === 'voltage' ? -45 : mode === 'resistance' ? 20 : 65;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClickMode}
      className={onClickMode ? 'cursor-pointer' : undefined}
    >
      {/* Yellow Protective Holster */}
      <rect
        x="0"
        y="0"
        width="124"
        height="196"
        rx="14"
        fill="#FBBF24"
        stroke="#B45309"
        strokeWidth="1.5"
      />
      {/* Dark Inner Body */}
      <rect x="8" y="8" width="108" height="180" rx="9" fill="#1E293B" />

      {/* Backlit LCD Display */}
      <rect
        x="16"
        y="16"
        width="92"
        height="46"
        rx="4"
        fill={alert ? '#FEE2E2' : '#DCE7C8'}
        stroke="#0F172A"
        strokeWidth="1.5"
      />
      <text
        x="22"
        y="27"
        fontSize="7.5"
        fontWeight="700"
        fontFamily="monospace"
        fill="#475569"
      >
        {mode === 'voltage'
          ? 'DC VOLTS'
          : mode === 'resistance'
            ? 'OHMS Ω'
            : 'CONTINUITY'}
      </text>
      <text
        x="102"
        y="50"
        textAnchor="end"
        fontSize="14"
        fontWeight="700"
        fontFamily="monospace"
        fill={alert ? '#DC2626' : '#0F172A'}
      >
        {reading}
      </text>

      {/* Mode Labels around Rotary Dial */}
      <text x="24" y="88" fontSize="8" fontWeight="700" fill="#F8FAFC">
        V⎓
      </text>
      <text x="64" y="79" fontSize="8" fontWeight="700" fill="#F8FAFC">
        Ω
      </text>
      <text x="90" y="92" fontSize="8" fontWeight="700" fill="#FBBF24">
        🔊
      </text>

      {/* Rotary Selector Dial */}
      <g transform={`translate(62, 114) rotate(${dialAngle})`}>
        <circle cx="0" cy="0" r="24" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
        <rect x="-4" y="-21" width="8" height="42" rx="3" fill="#0F172A" />
        <polygon points="0,-21 4,-12 -4,-12" fill="#F97316" />
      </g>

      {/* COM & VΩmA Probe Jacks */}
      <g transform="translate(36, 166)">
        <circle cx="0" cy="0" r="9" fill="#0F172A" stroke="#64748B" strokeWidth="2" />
        <text x="0" y="-12" textAnchor="middle" fontSize="7" fill="#CBD5E1">
          COM
        </text>
      </g>
      <g transform="translate(88, 166)">
        <circle cx="0" cy="0" r="9" fill="#DC2626" stroke="#FCA5A5" strokeWidth="1.5" />
        <text x="0" y="-12" textAnchor="middle" fontSize="7" fill="#FCA5A5">
          VΩmA
        </text>
      </g>
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* 7. Curved Realistic Jumper Wire with DuPont Pin Connectors                 */
/* -------------------------------------------------------------------------- */
export function JumperWire({
  x1,
  y1,
  x2,
  y2,
  color = '#EF4444',
  arc = -24,
  animated = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  arc?: number;
  animated?: boolean;
}) {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 + arc;
  const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke="rgba(15, 23, 42, 0.14)"
        strokeWidth="4.5"
        strokeLinecap="round"
        transform="translate(0, 3)"
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {animated && (
        <path
          d={d}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeDasharray="4 10"
          strokeLinecap="round"
          opacity="0.85"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="14"
            to="0"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </path>
      )}
      {/* DuPont Black Pin Sleeves */}
      <rect x={x1 - 3} y={y1 - 3} width="6" height="6" rx="1" fill="#0F172A" />
      <rect x={x2 - 3} y={y2 - 3} width="6" height="6" rx="1" fill="#0F172A" />
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* 8. Realistic Battery Pack & Regulator Modules                              */
/* -------------------------------------------------------------------------- */
export function RealBatterySvg({
  x = 0,
  y = 0,
  type,
}: {
  x?: number;
  y?: number;
  type: '9v_alkaline' | 'aa_4x' | 'lipo_2s';
}) {
  if (type === '9v_alkaline') {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <rect
          x="0"
          y="10"
          width="68"
          height="102"
          rx="6"
          fill="#1E293B"
          stroke="#0F172A"
          strokeWidth="1.5"
        />
        <rect x="0" y="10" width="68" height="34" rx="5" fill="#D97706" />
        {/* Top Snap Terminals */}
        <circle cx="22" cy="8" r="6" fill="#CBD5E1" stroke="#64748B" />
        <circle cx="46" cy="8" r="7" fill="#CBD5E1" stroke="#64748B" />
        <text x="34" y="32" textAnchor="middle" fontSize="13" fontWeight="800" fill="#FFFFFF">
          9V
        </text>
        <text x="34" y="72" textAnchor="middle" fontSize="8" fill="#CBD5E1">
          ALKALINE
        </text>
        <text x="34" y="86" textAnchor="middle" fontSize="7" fill="#94A3B8">
          최대 ~350mA
        </text>
      </g>
    );
  }

  if (type === 'aa_4x') {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <rect
          x="0"
          y="0"
          width="96"
          height="108"
          rx="5"
          fill="#1E293B"
          stroke="#334155"
          strokeWidth="1.5"
        />
        {[8, 29, 50, 71].map((bx, i) => (
          <g key={i} transform={`translate(${bx}, 8)`}>
            <rect width="17" height="92" rx="3" fill="#D97706" />
            <rect width="17" height="26" rx="2" fill="#0F172A" />
            <text x="8.5" y="58" textAnchor="middle" fontSize="7" fontWeight="700" fill="#FFFFFF">
              1.5V
            </text>
          </g>
        ))}
        <text x="48" y="122" textAnchor="middle" fontSize="9" fontWeight="600" fill="#0A2540">
          4xAA (6.0V)
        </text>
      </g>
    );
  }

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 2S LiPo Shrink-Wrapped Pack + XT60 Connector */}
      <rect
        x="0"
        y="0"
        width="104"
        height="112"
        rx="6"
        fill="#0284C7"
        stroke="#0369A1"
        strokeWidth="1.5"
      />
      <rect x="8" y="10" width="88" height="92" rx="3" fill="#0F172A" opacity="0.25" />
      <text x="52" y="38" textAnchor="middle" fontSize="13" fontWeight="800" fill="#FFFFFF">
        2S LiPo
      </text>
      <text x="52" y="56" textAnchor="middle" fontSize="10" fontWeight="700" fill="#BAE6FD">
        7.4V · 2200mAh
      </text>
      <text x="52" y="74" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#FDE047">
        20C (44A MAX)
      </text>
      {/* Yellow XT60 Plug */}
      <rect x="74" y="112" width="20" height="14" rx="2" fill="#FACC15" stroke="#B45309" />
      <text x="84" y="122" textAnchor="middle" fontSize="6" fontWeight="700" fill="#0F172A">
        XT60
      </text>
    </g>
  );
}
