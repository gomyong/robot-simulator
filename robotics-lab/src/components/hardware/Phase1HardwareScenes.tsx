import { LabPreviewState } from '../../types/lab';
import {
  bbPin,
  JumperWire,
  RealBatterySvg,
  RealBreadboardSvg,
  RealEsp32BoardSvg,
  RealHcsr04Svg,
  RealLedSvg,
  RealMultimeterSvg,
  RealResistorSvg,
} from './HardwarePartsSvg';

interface SceneProps {
  preview: LabPreviewState;
  onChangePreview: (patch: Partial<LabPreviewState>) => void;
  selectedPinId?: string | null;
  onSelectPin?: (pinId: string) => void;
}

/* -------------------------------------------------------------------------- */
/* Day 01: Real Hardware Anatomy Loop OR Breadboard + LED Safety Circuit      */
/* -------------------------------------------------------------------------- */
export function Day01HardwareScene({ preview, onChangePreview }: SceneProps) {
  if (preview.day01Mode === 'anatomy') {
    const focus = preview.day01FocusPart;
    return (
      <svg viewBox="0 0 700 380" className="h-full w-full select-none">
        {/* 1. Sensor: Real HC-SR04 */}
        <g
          onClick={() => onChangePreview({ day01FocusPart: 'sensor' })}
          className="cursor-pointer"
        >
          <rect
            x="38"
            y="118"
            width="180"
            height="128"
            rx="10"
            fill={focus === 'sensor' ? '#EEF2FF' : 'transparent'}
            stroke={focus === 'sensor' ? '#635BFF' : 'transparent'}
            strokeWidth="2"
          />
          <RealHcsr04Svg x={48} y={134} scale={1} />
          <text
            x="128"
            y="264"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#0A2540"
          >
            ① 센서 (HC-SR04)
          </text>
        </g>

        {/* 2. Brain: Real ESP32 DevKit */}
        <g
          onClick={() => onChangePreview({ day01FocusPart: 'brain' })}
          className="cursor-pointer"
        >
          <rect
            x="256"
            y="42"
            width="174"
            height="294"
            rx="10"
            fill={focus === 'brain' ? '#EEF2FF' : 'transparent'}
            stroke={focus === 'brain' ? '#635BFF' : 'transparent'}
            strokeWidth="2"
          />
          <RealEsp32BoardSvg x={269} y={52} scale={0.78} />
          <text
            x="343"
            y="354"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#0A2540"
          >
            ② 두뇌 (ESP32 MCU)
          </text>
        </g>

        {/* 3. Actuator: Real SG90 Servo Motor */}
        <g
          onClick={() => onChangePreview({ day01FocusPart: 'actuator' })}
          className="cursor-pointer"
        >
          <rect
            x="484"
            y="108"
            width="176"
            height="156"
            rx="10"
            fill={focus === 'actuator' ? '#EEF2FF' : 'transparent'}
            stroke={focus === 'actuator' ? '#635BFF' : 'transparent'}
            strokeWidth="2"
          />
          {/* SG90 Blue Micro Servo Illustration */}
          <g transform="translate(515, 130)">
            <rect x="0" y="18" width="114" height="58" rx="4" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
            <rect x="-12" y="34" width="138" height="10" rx="2" fill="#0EA5E9" />
            <circle cx="84" cy="47" r="24" fill="#0369A1" />
            {/* White Servo Horn */}
            <g transform="translate(84, 47) rotate(-25)">
              <rect x="-8" y="-36" width="16" height="48" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
              <circle cx="0" cy="0" r="5" fill="#94A3B8" />
            </g>
            <text x="26" y="54" fontSize="9" fontWeight="700" fill="#E0F2FE">
              SG90
            </text>
          </g>
          <text
            x="572"
            y="246"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#0A2540"
          >
            ③ 액추에이터 (서보 모터)
          </text>
        </g>

        {/* Animated Signal Jumper Wires */}
        <JumperWire
          x1={152}
          y1={202}
          x2={278}
          y2={182}
          color="#0284C7"
          arc={34}
          animated
        />
        <JumperWire
          x1={408}
          y1={230}
          x2={516}
          y2={195}
          color="#F97316"
          arc={-30}
          animated
        />

        {/* Focus Info Banner */}
        <g transform="translate(150, 12)">
          <rect
            width="400"
            height="24"
            rx="6"
            fill="#FFFFFF"
            stroke="#E6E8EC"
          />
          <text
            x="200"
            y="16"
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill="#0A2540"
          >
            {focus === 'sensor'
              ? '센서: 초음파로 거리를 재어 전기 신호(ECHO)로 두뇌에 전달'
              : focus === 'brain'
                ? '두뇌: 센서 신호를 계산하고 모터에 PWM 제어 명령 출력'
                : '액추에이터: 전기 PWM 명령을 받아 실제 물리적 각도 회전'}
          </text>
        </g>
      </svg>
    );
  }

  // Mode 2: Real Breadboard + Power Source + Dynamic Color-Band Resistor + Real LED
  const Vs = preview.circuitVoltageV;
  const Vf = preview.circuitLedVf;
  const R = preview.circuitResistanceOhm;
  const effectiveR = Math.max(R, 5);
  const currentMa = Vs > Vf ? ((Vs - Vf) / effectiveR) * 1000 : 0;
  const isOver = currentMa > 30;
  const lit =
    Vs <= Vf ? 0 : isOver ? 0 : Math.min(1, Math.max(0.08, currentMa / 18));
  const ledColor = Vf >= 3.0 ? '#0EA5E9' : Vf >= 2.15 ? '#16A34A' : '#EF4444';

  const bx = 175;
  const by = 86;
  const pPlus = bbPin(bx, by, 3, 'top+');
  const pMinus = bbPin(bx, by, 14, 'top-');
  const rStart = bbPin(bx, by, 5, 'c');
  const rEnd = bbPin(bx, by, 10, 'c');
  const ledA = bbPin(bx, by, 10, 'e');
  const ledK = bbPin(bx, by, 12, 'e');

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      {/* Power Source Card on Left */}
      <g transform="translate(30, 125)">
        <rect
          width="112"
          height="116"
          rx="10"
          fill="#1E293B"
          stroke="#0F172A"
          strokeWidth="1.5"
        />
        <text x="56" y="34" textAnchor="middle" fontSize="11" fill="#94A3B8">
          DC POWER
        </text>
        <text
          x="56"
          y="64"
          textAnchor="middle"
          fontSize="22"
          fontWeight="700"
          fontFamily="monospace"
          fill="#FACC15"
        >
          {Vs.toFixed(1)}V
        </text>
        <circle cx="96" cy="36" r="5" fill="#EF4444" />
        <circle cx="96" cy="84" r="5" fill="#3B82F6" />
        <text x="80" y="40" fontSize="9" fontWeight="700" fill="#FCA5A5">
          +
        </text>
        <text x="80" y="88" fontSize="9" fontWeight="700" fill="#93C5FD">
          -
        </text>
      </g>

      {/* Real MB-102 Breadboard */}
      <RealBreadboardSvg
        x={bx}
        y={by}
        xray={preview.exploded > 0.1}
        highlightRail={currentMa > 0 ? 'top_plus' : undefined}
      />

      {/* Power Wires from Supply to Breadboard Rails */}
      <JumperWire
        x1={126}
        y1={161}
        x2={pPlus.x}
        y2={pPlus.y}
        color="#EF4444"
        arc={-28}
        animated={currentMa > 0}
      />
      <JumperWire
        x1={126}
        y1={209}
        x2={pMinus.x}
        y2={pMinus.y}
        color="#2563EB"
        arc={-70}
        animated={currentMa > 0}
      />

      {/* Bridge Wires inside Breadboard */}
      <JumperWire
        x1={bbPin(bx, by, 5, 'top+').x}
        y1={bbPin(bx, by, 5, 'top+').y}
        x2={bbPin(bx, by, 5, 'a').x}
        y2={bbPin(bx, by, 5, 'a').y}
        color="#EF4444"
        arc={-10}
        animated={currentMa > 0}
      />
      <JumperWire
        x1={bbPin(bx, by, 12, 'a').x}
        y1={bbPin(bx, by, 12, 'a').y}
        x2={bbPin(bx, by, 12, 'top-').x}
        y2={bbPin(bx, by, 12, 'top-').y}
        color="#2563EB"
        arc={-10}
        animated={currentMa > 0}
      />

      {/* Real Dynamic Color-Band Resistor */}
      <RealResistorSvg
        x1={rStart.x}
        y1={rStart.y}
        x2={rEnd.x}
        y2={rEnd.y}
        ohms={R}
        label={R === 0 ? '0Ω 직결!' : `${R}Ω`}
      />

      {/* Real 5mm Domed LED */}
      <RealLedSvg
        x={(ledA.x + ledK.x) / 2}
        y={ledA.y - 22}
        color={ledColor}
        litIntensity={lit}
        overcurrent={isOver}
        label={`LED (Vf ${Vf}V)`}
      />

      {/* Live Status Readout */}
      <g transform="translate(185, 326)">
        <rect
          width="460"
          height="32"
          rx="8"
          fill={isOver ? '#FFF1F2' : '#FFFFFF'}
          stroke={isOver ? '#FDA4AF' : '#E6E8EC'}
        />
        <text
          x="230"
          y="20"
          textAnchor="middle"
          fontSize="11.5"
          fontWeight="600"
          fontFamily="monospace"
          fill={isOver ? '#BE123C' : '#0A2540'}
        >
          {Vs <= Vf
            ? `전압 부족: ${Vs.toFixed(1)}V ≤ LED 문턱(${Vf.toFixed(1)}V) → 전류 0 mA (OFF)`
            : isOver
              ? `과전류 ${currentMa.toFixed(0)} mA! (LED·GPIO 한계 초과 → 소손 위험)`
              : `안전 전류 I = ${currentMa.toFixed(1)} mA · 소비 전력 ${(Vs * currentMa).toFixed(0)} mW`}
        </text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 02: Real Breadboard X-Ray + Handheld Digital Multimeter                */
/* -------------------------------------------------------------------------- */
export function Day02HardwareScene({ preview, onChangePreview }: SceneProps) {
  const bx = 36;
  const by = 82;
  const isShort = preview.breadboardScenario === 'short_rail';
  const isBridgeErr = preview.breadboardScenario === 'bridge_trench';

  const meterReading =
    preview.multimeterMode === 'voltage'
      ? isShort
        ? '0.00 V'
        : '5.00 V'
      : preview.multimeterMode === 'resistance'
        ? isShort
          ? '0.1 Ω'
          : '220.0 Ω'
        : isShort
          ? 'BEEP!'
          : 'OPEN';

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <RealBreadboardSvg
        x={bx}
        y={by}
        xray={preview.exploded > 0.1}
        highlightRowX={preview.breadboardScenario === 'correct' ? 10 : undefined}
        shortRowX={isShort ? 10 : undefined}
      />

      {/* Correct Wiring across Center Trench */}
      {preview.breadboardScenario === 'correct' && (
        <g>
          <JumperWire
            x1={bbPin(bx, by, 4, 'top+').x}
            y1={bbPin(bx, by, 4, 'top+').y}
            x2={bbPin(bx, by, 6, 'b').x}
            y2={bbPin(bx, by, 6, 'b').y}
            color="#EF4444"
            arc={-18}
            animated
          />
          <RealResistorSvg
            x1={bbPin(bx, by, 6, 'e').x}
            y1={bbPin(bx, by, 6, 'e').y}
            x2={bbPin(bx, by, 6, 'f').x}
            y2={bbPin(bx, by, 6, 'f').y}
            ohms={220}
            label="220Ω (골짜기 횡단)"
          />
          <RealLedSvg
            x={(bbPin(bx, by, 6, 'h').x + bbPin(bx, by, 8, 'h').x) / 2}
            y={bbPin(bx, by, 6, 'h').y - 20}
            color="#10B981"
            litIntensity={0.85}
          />
          <JumperWire
            x1={bbPin(bx, by, 8, 'j').x}
            y1={bbPin(bx, by, 8, 'j').y}
            x2={bbPin(bx, by, 10, 'bot-').x}
            y2={bbPin(bx, by, 10, 'bot-').y}
            color="#2563EB"
            arc={14}
            animated
          />
        </g>
      )}

      {/* Fault 1: Short on same 5-pin vertical column */}
      {isShort && (
        <g>
          <JumperWire
            x1={bbPin(bx, by, 10, 'a').x}
            y1={bbPin(bx, by, 10, 'a').y}
            x2={bbPin(bx, by, 10, 'e').x}
            y2={bbPin(bx, by, 10, 'e').y}
            color="#E11D48"
            arc={-18}
          />
          <RealLedSvg
            x={bbPin(bx, by, 10, 'c').x + 18}
            y={bbPin(bx, by, 10, 'c').y - 16}
            color="#EF4444"
            overcurrent
            label="같은 5핀 줄 합선!"
          />
        </g>
      )}

      {/* Fault 2: IC chip placed on one side without straddling trench */}
      {isBridgeErr && (
        <g>
          <rect
            x={bbPin(bx, by, 8, 'b').x - 6}
            y={bbPin(bx, by, 8, 'b').y - 4}
            width="92"
            height="32"
            rx="3"
            fill="#1E293B"
            stroke="#E11D48"
            strokeWidth="2"
          />
          <text
            x={bbPin(bx, by, 8, 'b').x + 40}
            y={bbPin(bx, by, 8, 'b').y + 15}
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="700"
            fill="#FDA4AF"
          >
            IC 위아래 핀 쇼트!
          </text>
        </g>
      )}

      {/* Real Handheld Digital Multimeter */}
      <RealMultimeterSvg
        x={544}
        y={86}
        mode={preview.multimeterMode}
        reading={meterReading}
        alert={isShort}
        onClickMode={() => {
          const order: LabPreviewState['multimeterMode'][] = [
            'voltage',
            'resistance',
            'continuity',
          ];
          const next =
            order[(order.indexOf(preview.multimeterMode) + 1) % order.length];
          onChangePreview({ multimeterMode: next });
        }}
      />

      {/* Multimeter Probes touching Breadboard */}
      <JumperWire
        x1={580}
        y1={252}
        x2={bbPin(bx, by, 15, 'top-').x}
        y2={bbPin(bx, by, 15, 'top-').y}
        color="#1E293B"
        arc={60}
      />
      <JumperWire
        x1={632}
        y1={252}
        x2={bbPin(bx, by, 17, 'top+').x}
        y2={bbPin(bx, by, 17, 'top+').y}
        color="#DC2626"
        arc={82}
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 03: Real ESP32 + Breadboard Tactile Switch + Floating/Pull-up Waveform */
/* -------------------------------------------------------------------------- */
export function Day03HardwareScene({ preview, onChangePreview }: SceneProps) {
  const mode = preview.digitalPullMode;
  const pressed = preview.buttonPressed;
  const isFloating = mode === 'floating' && !pressed;
  const isHigh =
    (mode === 'pullup' && !pressed) ||
    (mode === 'pulldown' && pressed) ||
    (mode === 'floating' && pressed);

  const bx = 225;
  const by = 80;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      {/* Real ESP32 on Left */}
      <RealEsp32BoardSvg x={24} y={56} scale={0.78} selectedPinId="GPIO32" />

      {/* Real Breadboard */}
      <RealBreadboardSvg x={bx} y={by} />

      {/* Wire: ESP32 3V3 -> Top + Rail & GND -> Top - Rail */}
      <JumperWire
        x1={160}
        y1={288}
        x2={bbPin(bx, by, 2, 'top+').x}
        y2={bbPin(bx, by, 2, 'top+').y}
        color="#EF4444"
        arc={-40}
      />
      <JumperWire
        x1={160}
        y1={274}
        x2={bbPin(bx, by, 4, 'top-').x}
        y2={bbPin(bx, by, 4, 'top-').y}
        color="#1E293B"
        arc={-25}
      />

      {/* Signal Wire: ESP32 GPIO 32 -> Breadboard Pin 8c */}
      <JumperWire
        x1={34}
        y1={164}
        x2={bbPin(bx, by, 8, 'c').x}
        y2={bbPin(bx, by, 8, 'c').y}
        color="#635BFF"
        arc={-75}
        animated={!isFloating}
      />

      {/* Pull-up / Pull-down 10kΩ Resistor */}
      {mode === 'pullup' && (
        <RealResistorSvg
          x1={bbPin(bx, by, 8, 'top+').x}
          y1={bbPin(bx, by, 8, 'top+').y}
          x2={bbPin(bx, by, 8, 'b').x}
          y2={bbPin(bx, by, 8, 'b').y}
          ohms={10000}
          label="10kΩ Pull-up"
        />
      )}
      {mode === 'pulldown' && (
        <RealResistorSvg
          x1={bbPin(bx, by, 8, 'top-').x}
          y1={bbPin(bx, by, 8, 'top-').y}
          x2={bbPin(bx, by, 8, 'b').x}
          y2={bbPin(bx, by, 8, 'b').y}
          ohms={10000}
          label="10kΩ Pull-down"
        />
      )}

      {/* Clickable 4-Pin Tactile Push Button Straddling Center Trench */}
      <g
        transform={`translate(${bbPin(bx, by, 14, 'e').x - 18}, ${bbPin(bx, by, 14, 'e').y - 6})`}
        onClick={() => onChangePreview({ buttonPressed: !pressed })}
        className="cursor-pointer"
      >
        <rect
          width="36"
          height="36"
          rx="4"
          fill="#E2E8F0"
          stroke="#475569"
          strokeWidth="1.5"
        />
        <circle
          cx="18"
          cy="18"
          r="10"
          fill={pressed ? '#635BFF' : '#0A2540'}
        />
        <text
          x="18"
          y="48"
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="700"
          fill="#0A2540"
        >
          {pressed ? '버튼 눌림 (클릭)' : '버튼 뗌 (클릭)'}
        </text>
      </g>

      {/* Button to GPIO node & GND/3V3 return */}
      <JumperWire
        x1={bbPin(bx, by, 8, 'd').x}
        y1={bbPin(bx, by, 8, 'd').y}
        x2={bbPin(bx, by, 13, 'd').x}
        y2={bbPin(bx, by, 13, 'd').y}
        color="#635BFF"
        arc={-12}
      />
      <JumperWire
        x1={bbPin(bx, by, 15, 'g').x}
        y1={bbPin(bx, by, 15, 'g').y}
        x2={bbPin(bx, by, 15, 'bot-').x}
        y2={bbPin(bx, by, 15, 'bot-').y}
        color={mode === 'pulldown' ? '#EF4444' : '#1E293B'}
        arc={10}
      />

      {/* Live Oscilloscope Logic Trace Strip */}
      <g transform="translate(225, 315)">
        <rect width="450" height="46" rx="8" fill="#0A2540" />
        <text x="14" y="18" fontSize="9.5" fontFamily="monospace" fill="#94A3B8">
          GPIO 32 LOGIC MONITOR
        </text>
        <text
          x="14"
          y="35"
          fontSize="12"
          fontWeight="700"
          fontFamily="monospace"
          fill={isFloating ? '#FBBF24' : isHigh ? '#34D399' : '#94A3B8'}
        >
          {isFloating
            ? 'FLOATING! 0 ↔ 1 무작위 노이즈 진동'
            : isHigh
              ? '3.30 V · HIGH (1) 안정'
              : '0.00 V · LOW (0) 안정'}
        </text>
        {/* Trace Path */}
        <path
          d={
            isFloating
              ? 'M 250 32 L 265 12 L 275 34 L 290 16 L 302 30 L 318 11 L 330 35 L 348 15 L 365 31 L 385 13 L 405 33 L 430 18'
              : isHigh
                ? 'M 250 15 L 430 15'
                : 'M 250 33 L 430 33'
          }
          fill="none"
          stroke={isFloating ? '#FBBF24' : isHigh ? '#34D399' : '#94A3B8'}
          strokeWidth="2.5"
        />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 04: Real Potentiometer -> ESP32 -> Oscilloscope PWM -> DC Motor/Servo  */
/* -------------------------------------------------------------------------- */
export function Day04HardwareScene({ preview }: SceneProps) {
  const adcRaw = Math.round((preview.adcVoltageV / 3.3) * 4095);
  const dutyFrac = preview.pwmDutyPct / 100;
  const knobAngle = ((preview.adcVoltageV / 3.3) - 0.5) * 240;
  const isServo = preview.pwmFreqHz === 50;
  const servoAngle = (dutyFrac - 0.5) * 140;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      {/* 1. Real Rotary Potentiometer */}
      <g transform="translate(46, 118)">
        <rect
          x="0"
          y="0"
          width="96"
          height="108"
          rx="10"
          fill="#FFFFFF"
          stroke="#E6E8EC"
          strokeWidth="1.5"
        />
        <g transform={`translate(48, 48) rotate(${knobAngle})`}>
          <circle cx="0" cy="0" r="28" fill="#0A2540" />
          <circle cx="0" cy="0" r="21" fill="#1E293B" />
          <line x1="0" y1="0" x2="0" y2="-22" stroke="#F97316" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        <text x="48" y="96" textAnchor="middle" fontSize="10" fontWeight="600" fontFamily="monospace" fill="#0A2540">
          {preview.adcVoltageV.toFixed(2)}V ({adcRaw})
        </text>
      </g>

      {/* 2. Real ESP32 DevKit */}
      <RealEsp32BoardSvg x={240} y={40} scale={0.78} selectedPinId="GPIO34" />

      {/* Wires Pot -> GPIO 34, GPIO 13 -> Actuator */}
      <JumperWire x1={142} y1={172} x2={249} y2={118} color="#0284C7" arc={-24} animated />
      <JumperWire x1={249} y1={244} x2={494} y2={182} color="#635BFF" arc={40} animated={preview.pwmDutyPct > 0} />

      {/* 3. Real Actuator (DC Motor Fan OR SG90 Servo) */}
      <g transform="translate(494, 110)">
        <rect width="166" height="122" rx="10" fill="#FFFFFF" stroke="#E6E8EC" strokeWidth="1.5" />
        {isServo ? (
          <g transform="translate(26, 22)">
            <rect x="0" y="14" width="114" height="54" rx="4" fill="#0284C7" />
            <circle cx="82" cy="41" r="20" fill="#0369A1" />
            <g transform={`translate(82, 41) rotate(${servoAngle})`}>
              <rect x="-7" y="-32" width="14" height="42" rx="7" fill="#F8FAFC" stroke="#CBD5E1" />
              <circle cx="0" cy="0" r="4.5" fill="#64748B" />
            </g>
            <text x="57" y="90" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0A2540">
              SG90 서보 ({Math.round(dutyFrac * 180)}°)
            </text>
          </g>
        ) : (
          <g transform="translate(83, 52)">
            <circle cx="0" cy="0" r="34" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
            <g>
              {preview.pwmDutyPct > 2 && (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 0 0"
                  to="360 0 0"
                  dur={`${Math.max(0.25, 2.2 - dutyFrac * 1.95)}s`}
                  repeatCount="indefinite"
                />
              )}
              <rect x="-26" y="-5" width="52" height="10" rx="4" fill="#10B981" />
              <rect x="-5" y="-26" width="10" height="52" rx="4" fill="#10B981" />
              <circle cx="0" cy="0" r="6" fill="#0A2540" />
            </g>
            <text x="0" y="54" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0A2540">
              DC 모터 (Duty {preview.pwmDutyPct}%)
            </text>
          </g>
        )}
      </g>

      {/* 4. Live PWM Oscilloscope Trace */}
      <g transform="translate(46, 314)">
        <rect width="614" height="48" rx="8" fill="#0A2540" />
        <text x="14" y="18" fontSize="9.5" fontFamily="monospace" fill="#94A3B8">
          PWM OSCILLOSCOPE ({preview.pwmFreqHz} Hz)
        </text>
        <text x="14" y="36" fontSize="11.5" fontWeight="700" fontFamily="monospace" fill="#38BDF8">
          Duty {preview.pwmDutyPct}% · 평균 {(3.3 * dutyFrac).toFixed(2)}V
        </text>
        {/* Dynamic Square Wave */}
        {(() => {
          const period = 72;
          const highW = Math.max(2, Math.round(period * dutyFrac));
          let d = 'M 250 36';
          for (let i = 0; i < 4; i++) {
            const x0 = 250 + i * period;
            if (preview.pwmDutyPct <= 0) {
              d += ` L ${x0 + period} 36`;
            } else if (preview.pwmDutyPct >= 100) {
              d += ` L ${x0} 14 L ${x0 + period} 14`;
            } else {
              d += ` L ${x0} 14 L ${x0 + highW} 14 L ${x0 + highW} 36 L ${x0 + period} 36`;
            }
          }
          return <path d={d} fill="none" stroke="#635BFF" strokeWidth="2.5" />;
        })()}
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 05: Real HC-SR04 -> Breadboard Voltage Divider (R1/R2) -> Real ESP32   */
/* -------------------------------------------------------------------------- */
export function Day05HardwareScene({ preview }: SceneProps) {
  const vOut =
    preview.dividerVinV *
    (preview.dividerR2K / Math.max(0.1, preview.dividerR1K + preview.dividerR2K));
  const isOver = vOut > 3.6;
  const isSafe = vOut >= 2.2 && vOut <= 3.6;

  const bx = 185;
  const by = 110;
  const bs = 0.64;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      {/* 5V HC-SR04 Source */}
      <RealHcsr04Svg x={20} y={130} scale={0.9} />
      <text x="92" y="220" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0A2540">
        5.0V ECHO 출력
      </text>

      {/* Center Breadboard with R1 + R2 Divider */}
      <RealBreadboardSvg x={bx} y={by} scale={bs} />

      {/* Wire: HC-SR04 ECHO -> Breadboard row 4b */}
      <JumperWire
        x1={103}
        y1={194}
        x2={bbPin(bx, by, 4, 'b', bs).x}
        y2={bbPin(bx, by, 4, 'b', bs).y}
        color="#F59E0B"
        arc={-30}
        animated
      />

      {/* R1 Horizontal Resistor (4c -> 11c) */}
      <RealResistorSvg
        x1={bbPin(bx, by, 4, 'c', bs).x}
        y1={bbPin(bx, by, 4, 'c', bs).y}
        x2={bbPin(bx, by, 11, 'c', bs).x}
        y2={bbPin(bx, by, 11, 'c', bs).y}
        ohms={preview.dividerR1K * 1000}
        label={`R1 ${preview.dividerR1K}kΩ`}
      />

      {/* R2 Vertical Resistor to Bottom GND Rail (11e -> 11bot-) */}
      <RealResistorSvg
        x1={bbPin(bx, by, 11, 'e', bs).x}
        y1={bbPin(bx, by, 11, 'e', bs).y}
        x2={bbPin(bx, by, 11, 'bot-', bs).x}
        y2={bbPin(bx, by, 11, 'bot-', bs).y}
        ohms={preview.dividerR2K * 1000}
        label={`R2 ${preview.dividerR2K}kΩ`}
      />

      {/* Real ESP32 on Right */}
      <RealEsp32BoardSvg x={520} y={42} scale={0.76} selectedPinId="GPIO19" />

      {/* Midpoint Wire to ESP32 GPIO 19 */}
      <JumperWire
        x1={bbPin(bx, by, 11, 'a', bs).x}
        y1={bbPin(bx, by, 11, 'a', bs).y}
        x2={651}
        y2={136}
        color={isOver ? '#E11D48' : '#10B981'}
        arc={-64}
        animated
      />

      {/* Overvoltage Warning or Safe Readout */}
      <g transform="translate(150, 326)">
        <rect
          width="400"
          height="32"
          rx="8"
          fill={isOver ? '#FFF1F2' : '#FFFFFF'}
          stroke={isOver ? '#FDA4AF' : '#E6E8EC'}
        />
        <text
          x="200"
          y="20"
          textAnchor="middle"
          fontSize="11.5"
          fontWeight="600"
          fontFamily="monospace"
          fill={isOver ? '#BE123C' : isSafe ? '#047857' : '#B45309'}
        >
          {`GPIO 19 입력 V_out = ${vOut.toFixed(2)}V · ${
            isOver
              ? '3.6V 초과! ESP32 핀 과전압 위험'
              : isSafe
                ? 'SAFE (안전한 HIGH 인식 범위)'
                : '전압 너무 낮음 (HIGH 인식 불안정)'
          }`}
        </text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 06: Real Battery Pack -> LDO vs LM2596 Buck -> Real ESP32 + Motor Load */
/* -------------------------------------------------------------------------- */
export function Day06HardwareScene({ preview }: SceneProps) {
  const battMeta = {
    '9v_alkaline': { vin: 9.0, maxMa: 350 },
    aa_4x: { vin: 6.0, maxMa: 1500 },
    lipo_2s: { vin: 7.4, maxMa: 44000 },
  }[preview.batteryType];

  const totalMa = preview.motorLoadMa + 80;
  const isBrownout = totalMa > battMeta.maxMa;
  const isLdo = preview.regulatorType === 'ldo';
  const lossW = isLdo
    ? ((battMeta.vin - 3.3) * totalMa) / 1000
    : (battMeta.vin * totalMa * 0.1) / 1000;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      {/* 1. Real Battery */}
      <RealBatterySvg x={44} y={115} type={preview.batteryType} />

      {/* 2. Regulator Board (AMS1117 LDO vs LM2596 Buck Converter) */}
      <g transform="translate(230, 120)">
        <rect
          width="144"
          height="108"
          rx="8"
          fill={isLdo ? '#1E293B' : '#0369A1'}
          stroke={isLdo && lossW > 1.8 ? '#F97316' : '#0F172A'}
          strokeWidth="2"
        />
        {isLdo ? (
          <>
            <rect x="44" y="24" width="56" height="44" rx="3" fill="#0F172A" stroke="#94A3B8" />
            <rect x="54" y="16" width="36" height="10" fill="#CBD5E1" />
            <text x="72" y="50" textAnchor="middle" fontSize="9" fontWeight="700" fill="#F8FAFC">
              AMS1117 LDO
            </text>
            <text x="72" y="92" textAnchor="middle" fontSize="9.5" fontFamily="monospace" fill="#FDBA74">
              발열 {lossW.toFixed(2)}W
            </text>
          </>
        ) : (
          <>
            {/* Inductor Coil + Electrolytic Caps */}
            <rect x="20" y="24" width="36" height="36" rx="4" fill="#334155" stroke="#94A3B8" />
            <text x="38" y="46" textAnchor="middle" fontSize="9" fontWeight="700" fill="#E2E8F0">
              330
            </text>
            <circle cx="80" cy="40" r="14" fill="#0F172A" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="114" cy="40" r="14" fill="#0F172A" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="72" y="92" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#E0F2FE">
              LM2596 Buck ({lossW.toFixed(2)}W)
            </text>
          </>
        )}
      </g>

      {/* 3. Real ESP32 + DC Load */}
      <RealEsp32BoardSvg x={465} y={40} scale={0.78} />

      {/* Power Wires */}
      <JumperWire x1={148} y1={160} x2={230} y2={160} color="#EF4444" arc={-15} animated={!isBrownout} />
      <JumperWire x1={374} y1={160} x2={474} y2={282} color="#EF4444" arc={30} animated={!isBrownout} />
      <JumperWire x1={374} y1={188} x2={474} y2={266} color="#1E293B" arc={55} />

      {/* Status Banner */}
      <g transform="translate(130, 326)">
        <rect
          width="440"
          height="32"
          rx="8"
          fill={isBrownout ? '#FFF1F2' : '#FFFFFF'}
          stroke={isBrownout ? '#FDA4AF' : '#E6E8EC'}
        />
        <text
          x="220"
          y="20"
          textAnchor="middle"
          fontSize="11.5"
          fontWeight="600"
          fontFamily="monospace"
          fill={isBrownout ? '#BE123C' : '#0A2540'}
        >
          {isBrownout
            ? `BROWNOUT! 총 부하 ${totalMa}mA > 배터리 한계(${battMeta.maxMa}mA) → 보드 재부팅`
            : `안정 공급 중 · 총 부하 ${totalMa}mA · 예상 동작 ${(battMeta.vin > 0 ? (preview.batteryType === '9v_alkaline' ? 500 : preview.batteryType === 'aa_4x' ? 2000 : 2200) / totalMa : 0).toFixed(1)}시간`}
        </text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 07: Phase 1 Mini Project — Full Integrated Hardware Prototype          */
/* -------------------------------------------------------------------------- */
export function Day07HardwareScene({ preview }: SceneProps) {
  const allSafe =
    preview.projectCommonGnd &&
    preview.projectEchoDivider &&
    preview.projectLedResistor;
  const triggered = allSafe && preview.projectObstacleCm < 30;
  const obsY = 16 + Math.min(68, ((preview.projectObstacleCm - 5) / 115) * 68);
  const bx = 178;
  const by = 110;
  const bs = 0.68;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      {/* 2S LiPo Battery */}
      <g transform="translate(24, 212) scale(0.82)">
        <RealBatterySvg x={0} y={0} type="lipo_2s" />
      </g>

      {/* HC-SR04 + Moving Obstacle */}
      <RealHcsr04Svg x={20} y={115} scale={0.82} />
      <rect
        x="42"
        y={96 - obsY}
        width="88"
        height="18"
        rx="4"
        fill={triggered ? '#E11D48' : '#10B981'}
      />
      <text x="86" y={108 - obsY} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#FFFFFF">
        장애물 {preview.projectObstacleCm}cm
      </text>

      {/* Center Breadboard with Divider + 220Ω LED + Buzzer */}
      <RealBreadboardSvg x={bx} y={by} scale={bs} />

      {/* Divider Resistors on Breadboard */}
      <RealResistorSvg
        x1={bbPin(bx, by, 4, 'c', bs).x}
        y1={bbPin(bx, by, 4, 'c', bs).y}
        x2={bbPin(bx, by, 9, 'c', bs).x}
        y2={bbPin(bx, by, 9, 'c', bs).y}
        ohms={preview.projectEchoDivider ? 10000 : 0}
        label={preview.projectEchoDivider ? '10k+20k' : '분압 누락!'}
      />

      {/* 220Ω LED Protection + Alarm LED */}
      <RealResistorSvg
        x1={bbPin(bx, by, 14, 'e', bs).x}
        y1={bbPin(bx, by, 14, 'e', bs).y}
        x2={bbPin(bx, by, 18, 'e', bs).x}
        y2={bbPin(bx, by, 18, 'e', bs).y}
        ohms={preview.projectLedResistor ? 220 : 0}
        label={preview.projectLedResistor ? '220Ω' : '저항 누락!'}
      />
      <RealLedSvg
        x={bbPin(bx, by, 21, 'e', bs).x}
        y={bbPin(bx, by, 21, 'e', bs).y - 22}
        color="#EF4444"
        litIntensity={triggered ? 1 : 0}
        overcurrent={!preview.projectLedResistor}
      />

      {/* Real ESP32 on Right */}
      <RealEsp32BoardSvg x={532} y={38} scale={0.75} />

      {/* Common GND Bus Wire (Broken visually when Common GND unchecked!) */}
      {preview.projectCommonGnd ? (
        <JumperWire
          x1={108}
          y1={305}
          x2={541}
          y2={262}
          color="#1E293B"
          arc={25}
          animated={allSafe}
        />
      ) : (
        <g>
          <line
            x1={108}
            y1={305}
            x2={290}
            y2={305}
            stroke="#E11D48"
            strokeWidth="3"
            strokeDasharray="5 5"
          />
          <text x="330" y="309" fontSize="11" fontWeight="700" fill="#E11D48">
            ✕ 공통 GND 끊어짐!
          </text>
        </g>
      )}

      {/* Ultrasonic ECHO -> Breadboard -> ESP32 */}
      <JumperWire
        x1={98}
        y1={172}
        x2={bbPin(bx, by, 4, 'b', bs).x}
        y2={bbPin(bx, by, 4, 'b', bs).y}
        color="#F59E0B"
        arc={-18}
        animated={allSafe}
      />
      <JumperWire
        x1={bbPin(bx, by, 9, 'a', bs).x}
        y1={bbPin(bx, by, 9, 'a', bs).y}
        x2={662}
        y2={132}
        color={preview.projectEchoDivider ? '#10B981' : '#E11D48'}
        arc={-56}
        animated={allSafe}
      />

      {/* Status Banner */}
      <g transform="translate(150, 330)">
        <rect
          width="400"
          height="32"
          rx="8"
          fill={!allSafe || triggered ? '#FFF1F2' : '#FFFFFF'}
          stroke={!allSafe || triggered ? '#FDA4AF' : '#E6E8EC'}
        />
        <text
          x="200"
          y="20"
          textAnchor="middle"
          fontSize="11.5"
          fontWeight="600"
          fontFamily="monospace"
          fill={!allSafe || triggered ? '#BE123C' : '#047857'}
        >
          {!preview.projectCommonGnd
            ? '오류: 공통 GND 누락으로 신호 기준 전위 불일치!'
            : !preview.projectEchoDivider
              ? '오류: ECHO 5V→3.3V 전압 분배기 누락!'
              : !preview.projectLedResistor
                ? '오류: LED 220Ω 보호 저항 누락!'
                : triggered
                  ? `경보 발동! 장애물 ${preview.projectObstacleCm}cm (<30cm)`
                  : `시스템 정상 가동 (ARMED) · 장애물 ${preview.projectObstacleCm}cm`}
        </text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 09: Full Realistic 30-Pin ESP32 DevKit V1 Interactive Board            */
/* -------------------------------------------------------------------------- */
export function Esp32HardwareScene({
  preview,
  selectedPinId,
  onSelectPin,
}: SceneProps) {
  return (
    <svg viewBox="0 0 700 400" className="h-full w-full select-none">
      {/* Main Centered Real ESP32 Board */}
      <RealEsp32BoardSvg
        x={245}
        y={18}
        scale={1.06}
        wifiActive={preview.wifiActive}
        selectedPinId={selectedPinId}
        onSelectPin={onSelectPin}
        showInternalFlash={preview.exploded > 0.1}
      />

      {/* Subtle Pin Legend on Left */}
      <g transform="translate(26, 40)">
        <text x="0" y="0" fontSize="11" fontWeight="700" fill="#0A2540">
          핀 등급 컬러 가이드
        </text>
        {[
          { color: '#10B981', label: '안전 핀 (권장 I/O · PWM)' },
          { color: '#0284C7', label: '입력 전용 (34, 35, 36, 39)' },
          { color: '#D97706', label: '부팅 스트래핑 / 글리치 주의' },
          { color: '#E11D48', label: '사용 금지 (6~11) / Wi-Fi 충돌' },
          { color: '#64748B', label: '전원 / 공통 접지 (VIN, 3V3, GND)' },
        ].map((item, i) => (
          <g key={item.label} transform={`translate(0, ${22 + i * 24})`}>
            <circle cx="5" cy="-3.5" r="4.5" fill={item.color} />
            <text x="16" y="0" fontSize="11" fill="#425466">
              {item.label}
            </text>
          </g>
        ))}
      </g>

      {/* Live Status Callout on Right */}
      <g transform="translate(476, 40)">
        <rect
          width="198"
          height="92"
          rx="8"
          fill="#FFFFFF"
          stroke="#E6E8EC"
        />
        <text x="14" y="24" fontSize="11" fontWeight="700" fill="#0A2540">
          실시간 보드 상태
        </text>
        <text x="14" y="46" fontSize="11" fontFamily="monospace" fill={preview.wifiActive ? '#E11D48' : '#425466'}>
          Wi-Fi: {preview.wifiActive ? 'ON (ADC2 충돌!)' : 'OFF'}
        </text>
        <text x="14" y="66" fontSize="11" fontFamily="monospace" fill="#425466">
          내부 Flash: {preview.exploded > 0.1 ? '노출됨 (6~11)' : '차폐됨'}
        </text>
      </g>
    </svg>
  );
}
