import { LabPreviewState } from '../../types/lab';
import {
  JumperWire,
  RealBatterySvg,
  RealEsp32BoardSvg,
  RealHcsr04Svg,
  RealLedSvg,
  RealResistorSvg,
} from './HardwarePartsSvg';

interface SceneProps {
  preview: LabPreviewState;
  onChangePreview: (patch: Partial<LabPreviewState>) => void;
  selectedPinId?: string | null;
  onSelectPin?: (pinId: string) => void;
}

/* -------------------------------------------------------------------------- */
/* Day 08: ESP32 DevKit V1 Architecture & Bootloader Sequencing Lab           */
/* -------------------------------------------------------------------------- */
export function Day08BoardScene({
  preview,
  onChangePreview,
  selectedPinId,
  onSelectPin,
}: SceneProps) {
  const focus = preview.day08FocusPart;
  const isFlashing = preview.day08BootMode === 'flashing';

  const focusMeta: Record<
    LabPreviewState['day08FocusPart'],
    { title: string; badge: string; desc: string; tip: string }
  > = {
    wroom: {
      title: 'ESP-WROOM-32 모듈 (듀얼코어 + Wi-Fi/BT + 4MB Flash)',
      badge: 'CPU · 240MHz',
      desc: '금속 쉴드 내부에 Xtensa LX6 듀얼코어 CPU와 4MB SPI 플래시가 들어 있고, 상단 구불구불한 PCB 트레이스가 2.4GHz 안테나입니다.',
      tip: '금속 쉴드 바로 위에 점퍼선·배터리를 두면 무선 감도가 크게 떨어집니다.',
    },
    cp2102: {
      title: 'CP2102 / CH340 USB-to-UART 브리지 IC',
      badge: 'SERIAL · DTR/RTS',
      desc: 'PC USB 신호를 ESP32의 TX0/RX0 시리얼로 변환하고, DTR/RTS 트랜지스터 회로를 통해 EN과 GPIO0을 자동 조작해 업로드를 시작합니다.',
      tip: '노트북에서 포트가 안 보이면 90% 확률로 충전 전용 USB 케이블(데이터선 없음) 문제입니다.',
    },
    ams1117: {
      title: 'AMS1117-3.3 선형 LDO 레귤레이터',
      badge: 'POWER · 5V→3.3V',
      desc: 'USB 또는 VIN으로 들어온 5V를 ESP32 칩이 사용하는 정밀 3.3V로 낮춥니다. 최대 출력은 약 800mA(권장 연속 500mA 이하)입니다.',
      tip: '서보/DC 모터를 보드의 3V3 핀에 물리면 LDO 과열 및 Brownout 리셋이 즉시 발생합니다.',
    },
    buttons: {
      title: 'EN(Reset) & BOOT(GPIO0) 물리 버튼 + 자동 부트 회로',
      badge: 'BOOTLOADER',
      desc: 'EN을 누르면 칩이 리셋되고, 리셋 순간 GPIO0(BOOT)이 LOW이면 UART 다운로드 모드, HIGH이면 Flash 실행 모드로 부팅합니다.',
      tip: 'Connecting... 에서 멈출 때는 업로드 중 BOOT 버튼을 1~2초간 꾹 눌러주세요.',
    },
    pins: {
      title: '30-Pin 양측 헤더 & Strapping Pin 제약',
      badge: 'GPIO · 3.3V ONLY',
      desc: 'GPIO0·2·12·15는 부팅 시 전압 레벨에 따라 플래시 전압이나 부팅 모드를 결정하는 Strapping 핀이며, GPIO34~39는 입력 전용입니다.',
      tip: 'GPIO12에 외부 풀업 저항을 달면 3.3V 플래시 전압 설정이 깨져 부팅에 실패합니다.',
    },
  };

  const info = focusMeta[focus];

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      {/* Subtle Grid */}
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Left: Real ESP32 Board + Clickable Subsystem Callouts */}
      <g transform="translate(34, 18)">
        <RealEsp32BoardSvg
          x={50}
          y={4}
          scale={0.96}
          wifiActive={focus === 'wroom'}
          selectedPinId={selectedPinId}
          onSelectPin={(pid) => {
            onSelectPin?.(pid);
            onChangePreview({ day08FocusPart: 'pins' });
          }}
          showInternalFlash={preview.exploded > 0.1}
        />

        {/* Clickable Target Zones over Board Subsystems */}
        <g
          onClick={() => onChangePreview({ day08FocusPart: 'wroom' })}
          className="cursor-pointer"
        >
          <rect
            x="92"
            y="18"
            width="95"
            height="112"
            rx="6"
            fill={focus === 'wroom' ? '#635BFF' : 'transparent'}
            fillOpacity={focus === 'wroom' ? 0.12 : 0}
            stroke={focus === 'wroom' ? '#635BFF' : '#94A3B8'}
            strokeWidth={focus === 'wroom' ? 2 : 1}
            strokeDasharray={focus === 'wroom' ? undefined : '4 3'}
          />
          <text x="139" y="14" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={focus === 'wroom' ? '#635BFF' : '#475569'}>
            ① WROOM-32
          </text>
        </g>

        <g
          onClick={() => onChangePreview({ day08FocusPart: 'cp2102' })}
          className="cursor-pointer"
        >
          <rect
            x="108"
            y="192"
            width="64"
            height="58"
            rx="5"
            fill={focus === 'cp2102' ? '#635BFF' : 'transparent'}
            fillOpacity={focus === 'cp2102' ? 0.14 : 0}
            stroke={focus === 'cp2102' ? '#635BFF' : '#94A3B8'}
            strokeWidth={focus === 'cp2102' ? 2 : 1}
            strokeDasharray={focus === 'cp2102' ? undefined : '4 3'}
          />
          <text x="20" y="222" fontSize="8.5" fontWeight="700" fill={focus === 'cp2102' ? '#635BFF' : '#475569'}>
            ② CP2102
          </text>
          <line x1="65" y1="220" x2="108" y2="220" stroke={focus === 'cp2102' ? '#635BFF' : '#CBD5E1'} strokeDasharray="3 2" />
        </g>

        <g
          onClick={() => onChangePreview({ day08FocusPart: 'ams1117' })}
          className="cursor-pointer"
        >
          <rect
            x="78"
            y="252"
            width="48"
            height="46"
            rx="5"
            fill={focus === 'ams1117' ? '#635BFF' : 'transparent'}
            fillOpacity={focus === 'ams1117' ? 0.14 : 0}
            stroke={focus === 'ams1117' ? '#635BFF' : '#94A3B8'}
            strokeWidth={focus === 'ams1117' ? 2 : 1}
            strokeDasharray={focus === 'ams1117' ? undefined : '4 3'}
          />
          <text x="14" y="278" fontSize="8.5" fontWeight="700" fill={focus === 'ams1117' ? '#635BFF' : '#475569'}>
            ③ LDO 3.3V
          </text>
          <line x1="65" y1="275" x2="78" y2="275" stroke={focus === 'ams1117' ? '#635BFF' : '#CBD5E1'} strokeDasharray="3 2" />
        </g>

        <g
          onClick={() => onChangePreview({ day08FocusPart: 'buttons' })}
          className="cursor-pointer"
        >
          <rect
            x="76"
            y="300"
            width="126"
            height="34"
            rx="5"
            fill={focus === 'buttons' ? '#635BFF' : 'transparent'}
            fillOpacity={focus === 'buttons' ? 0.14 : 0}
            stroke={focus === 'buttons' ? '#635BFF' : '#94A3B8'}
            strokeWidth={focus === 'buttons' ? 2 : 1}
            strokeDasharray={focus === 'buttons' ? undefined : '4 3'}
          />
          <text x="208" y="320" fontSize="8.5" fontWeight="700" fill={focus === 'buttons' ? '#635BFF' : '#475569'}>
            ④ EN / BOOT
          </text>
        </g>

        <g
          onClick={() => onChangePreview({ day08FocusPart: 'pins' })}
          className="cursor-pointer"
        >
          <rect
            x="212"
            y="36"
            width="22"
            height="255"
            rx="4"
            fill={focus === 'pins' ? '#635BFF' : 'transparent'}
            fillOpacity={focus === 'pins' ? 0.16 : 0}
            stroke={focus === 'pins' ? '#635BFF' : '#94A3B8'}
            strokeWidth={focus === 'pins' ? 2 : 1}
            strokeDasharray={focus === 'pins' ? undefined : '3 3'}
          />
          <text x="242" y="164" fontSize="8.5" fontWeight="700" fill={focus === 'pins' ? '#635BFF' : '#475569'}>
            ⑤ GPIO 헤더
          </text>
        </g>
      </g>

      {/* Right Top: Selected Subsystem Card */}
      <g transform="translate(334, 24)">
        <rect x="0" y="0" width="342" height="140" rx="8" fill="#F7F8FA" stroke="#E6E8EC" />
        <rect x="12" y="12" width="108" height="18" rx="4" fill="#635BFF" fillOpacity="0.12" />
        <text x="18" y="24" fontSize="9.5" fontFamily="monospace" fontWeight="700" fill="#635BFF">
          {info.badge}
        </text>
        <text x="12" y="48" fontSize="12" fontWeight="700" fill="#0A2540">
          {info.title}
        </text>
        <foreignObject x="12" y="56" width="318" height="50">
          <p className="text-[11px] leading-[1.45] text-[#425466]">{info.desc}</p>
        </foreignObject>
        <rect x="12" y="108" width="318" height="22" rx="4" fill="#FFFBEB" stroke="#FDE68A" />
        <text x="18" y="122" fontSize="9.5" fontWeight="600" fill="#92400E">
          실전 팁: {info.tip}
        </text>
      </g>

      {/* Right Bottom: Boot Mode & DTR/RTS Timing Diagram */}
      <g transform="translate(334, 178)">
        <rect x="0" y="0" width="342" height="178" rx="8" fill="#0F172A" />
        <text x="14" y="22" fontSize="10.5" fontWeight="700" fill="#F8FAFC">
          부트스트랩 시퀀스 (EN 상승 엣지에서 GPIO0 샘플링)
        </text>

        {/* Interactive Mode Switcher inside Oscilloscope */}
        <g
          onClick={() => onChangePreview({ day08BootMode: 'normal' })}
          className="cursor-pointer"
        >
          <rect
            x="14"
            y="32"
            width="150"
            height="24"
            rx="5"
            fill={!isFlashing ? '#10B981' : '#1E293B'}
            stroke={!isFlashing ? '#34D399' : '#334155'}
          />
          <text x="89" y="47" textAnchor="middle" fontSize="10" fontWeight="700" fill={!isFlashing ? '#06281E' : '#94A3B8'}>
            Flash 일반 실행 (GPIO0=H)
          </text>
        </g>

        <g
          onClick={() => onChangePreview({ day08BootMode: 'flashing' })}
          className="cursor-pointer"
        >
          <rect
            x="174"
            y="32"
            width="154"
            height="24"
            rx="5"
            fill={isFlashing ? '#635BFF' : '#1E293B'}
            stroke={isFlashing ? '#818CF8' : '#334155'}
          />
          <text x="251" y="47" textAnchor="middle" fontSize="10" fontWeight="700" fill={isFlashing ? '#FFFFFF' : '#94A3B8'}>
            펌웨어 업로드 (GPIO0=L)
          </text>
        </g>

        {/* EN Signal Waveform */}
        <text x="14" y="80" fontSize="9.5" fontFamily="monospace" fill="#38BDF8">
          EN (Reset)
        </text>
        <path
          d="M 94 74 L 144 74 L 144 88 L 194 88 L 194 74 L 324 74"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="2"
        />
        <line x1="194" y1="64" x2="194" y2="140" stroke="#FBBF24" strokeDasharray="3 2" />
        <text x="198" y="69" fontSize="8.5" fontFamily="monospace" fill="#FBBF24">
          샘플링 엣지!
        </text>

        {/* GPIO0 Signal Waveform */}
        <text x="14" y="114" fontSize="9.5" fontFamily="monospace" fill={isFlashing ? '#F472B6' : '#34D399'}>
          GPIO0 (BOOT)
        </text>
        {isFlashing ? (
          <path
            d="M 94 106 L 128 106 L 128 122 L 260 122 L 260 106 L 324 106"
            fill="none"
            stroke="#F472B6"
            strokeWidth="2"
          />
        ) : (
          <path
            d="M 94 106 L 324 106"
            fill="none"
            stroke="#34D399"
            strokeWidth="2"
          />
        )}

        {/* Result Terminal Output */}
        <rect x="14" y="138" width="314" height="28" rx="4" fill="#020617" stroke="#334155" />
        <text x="22" y="155" fontSize="9.5" fontFamily="monospace" fill={isFlashing ? '#A5B4FC' : '#34D399'}>
          {isFlashing
            ? 'rst:0x1 · boot:0x3 (DOWNLOAD_BOOT) → esptool Writing 100%'
            : 'rst:0x1 · boot:0x13 (SPI_FAST_FLASH_BOOT) → setup() 시작!'}
        </text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 10: Non-Blocking Firmware (delay vs millis Dual-Task Timing Bench)     */
/* -------------------------------------------------------------------------- */
export function Day10NonBlockingScene({ preview, onChangePreview }: SceneProps) {
  const isMillis = preview.day10Mode === 'millis';
  const delayMs = preview.day10DelayMs;
  const blockedRatio = Math.min(1, delayMs / 1000);

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Left: Physical Setup — ESP32 wired to Heartbeat LED + Emergency Stop Switch */}
      <g transform="translate(20, 20)">
        <RealEsp32BoardSvg x={0} y={8} scale={0.78} wifiActive={isMillis} />

        {/* LED on GPIO2 */}
        <RealLedSvg
          x={220}
          y={82}
          color="#10B981"
          litIntensity={isMillis ? 0.95 : 0.45}
          label="Task1: LED (500ms)"
        />
        <RealResistorSvg x1={150} y1={108} x2={208} y2={95} ohms={220} />
        <JumperWire x1={136} y1={165} x2={150} y2={108} color="#10B981" arc={-14} animated />

        {/* Emergency Stop Tactile Switch on GPIO4 */}
        <g transform="translate(198, 200)">
          <rect x="0" y="0" width="96" height="72" rx="8" fill="#F8FAFC" stroke={isMillis ? '#10B981' : '#EF4444'} strokeWidth="1.5" />
          <circle cx="48" cy="30" r="14" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
          <text x="48" y="34" textAnchor="middle" fontSize="8" fontWeight="700" fill="#FFFFFF">
            STOP
          </text>
          <text x="48" y="56" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0A2540">
            Task2: 긴급 정지
          </text>
          <text x="48" y="67" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill={isMillis ? '#059669' : '#DC2626'}>
            {isMillis ? '응답: < 1 ms' : `최악 지연: ${delayMs} ms`}
          </text>
        </g>
        <JumperWire x1={136} y1={210} x2={198} y2={230} color="#EF4444" arc={18} animated={isMillis} />
      </g>

      {/* Right: CPU Execution & Real-Time Oscilloscope Comparison */}
      <g transform="translate(332, 20)">
        <rect x="0" y="0" width="346" height="340" rx="10" fill="#0F172A" />
        <text x="16" y="24" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          ESP32 메인 루프 CPU 점유율 & 실시간 반응성
        </text>

        {/* Interactive Mode Tabs */}
        <g onClick={() => onChangePreview({ day10Mode: 'delay' })} className="cursor-pointer">
          <rect
            x="16"
            y="36"
            width="152"
            height="26"
            rx="6"
            fill={!isMillis ? '#EF4444' : '#1E293B'}
            stroke={!isMillis ? '#F87171' : '#334155'}
          />
          <text x="92" y="53" textAnchor="middle" fontSize="10" fontWeight="700" fill={!isMillis ? '#FFFFFF' : '#94A3B8'}>
            delay({delayMs}) 블로킹
          </text>
        </g>

        <g onClick={() => onChangePreview({ day10Mode: 'millis' })} className="cursor-pointer">
          <rect
            x="178"
            y="36"
            width="152"
            height="26"
            rx="6"
            fill={isMillis ? '#10B981' : '#1E293B'}
            stroke={isMillis ? '#34D399' : '#334155'}
          />
          <text x="254" y="53" textAnchor="middle" fontSize="10" fontWeight="700" fill={isMillis ? '#052E16' : '#94A3B8'}>
            millis() 논블로킹
          </text>
        </g>

        {/* Lane 1: CPU Execution Timeline */}
        <text x="16" y="88" fontSize="9.5" fontFamily="monospace" fill="#94A3B8">
          CPU Time (0 ~ 1000 ms)
        </text>
        <rect x="16" y="96" width="314" height="32" rx="4" fill="#1E293B" />

        {!isMillis ? (
          <>
            <rect
              x="16"
              y="96"
              width={Math.max(40, Math.round(290 * blockedRatio))}
              height="32"
              rx="4"
              fill="#EF4444"
              fillOpacity="0.82"
            />
            <text x="24" y="116" fontSize="10" fontFamily="monospace" fontWeight="700" fill="#FFFFFF">
              CPU FROZEN (NOP 대기 {delayMs}ms)
            </text>
          </>
        ) : (
          <>
            {[20, 72, 124, 176, 228, 280].map((tx, idx) => (
              <g key={tx}>
                <rect x={tx} y="98" width="12" height="28" rx="2" fill={idx % 2 === 0 ? '#10B981' : '#38BDF8'} />
                <text x={tx + 16} y="116" fontSize="8.5" fontFamily="monospace" fill="#64748B">
                  free
                </text>
              </g>
            ))}
          </>
        )}

        {/* Lane 2: Emergency Button Event */}
        <text x="16" y="156" fontSize="9.5" fontFamily="monospace" fill="#FBBF24">
          외부 이벤트: t = 250ms 긴급 정지 버튼 클릭!
        </text>
        <line x1="95" y1="164" x2="95" y2="232" stroke="#FBBF24" strokeWidth="2" strokeDasharray="3 2" />
        <circle cx="95" cy="176" r="5" fill="#FBBF24" />

        {/* Lane 3: Motor Stop Reaction */}
        <rect x="16" y="192" width="314" height="44" rx="6" fill="#020617" stroke={isMillis ? '#10B981' : '#EF4444'} />
        {!isMillis ? (
          <>
            <text x="26" y="211" fontSize="10.5" fontWeight="700" fill="#F87171">
              긴급 정지 놓침 / 지연 ({delayMs}ms 경과 후에야 읽음)
            </text>
            <text x="26" y="226" fontSize="9.5" fontFamily="monospace" fill="#CBD5E1">
              로봇 속도 1m/s 기준 → 제동 전 {(delayMs / 1000).toFixed(2)}m 더 돌진!
            </text>
          </>
        ) : (
          <>
            <text x="26" y="211" fontSize="10.5" fontWeight="700" fill="#34D399">
              즉각 반응 (0.08ms 이내 STOP 처리 완료!)
            </text>
            <text x="26" y="226" fontSize="9.5" fontFamily="monospace" fill="#CBD5E1">
              LED 깜빡임 · 초음파 · 긴급정지 3개 작업이 간섭 없이 공존
            </text>
          </>
        )}

        {/* Bottom Formula Box */}
        <rect x="16" y="252" width="314" height="72" rx="6" fill="#1E293B" />
        <text x="26" y="272" fontSize="10" fontFamily="monospace" fontWeight="700" fill="#38BDF8">
          unsigned long now = millis();
        </text>
        <text x="26" y="290" fontSize="10" fontFamily="monospace" fill="#E2E8F0">
          if (now - prevLedMs &gt;= 500) {'{'} prevLedMs = now; toggle(); {'}'}
        </text>
        <text x="26" y="309" fontSize="9.5" fill="#94A3B8">
          뺄셈(now - prev)을 써야 49.7일 오버플로우에도 안전합니다.
        </text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 11: Finite State Machine (FSM) + Live Robot State Rig                  */
/* -------------------------------------------------------------------------- */
export function Day11FsmScene({ preview, onChangePreview }: SceneProps) {
  const state = preview.day11FsmState;

  const nodes: {
    id: LabPreviewState['day11FsmState'];
    x: number;
    y: number;
    label: string;
    sub: string;
    color: string;
  }[] = [
    { id: 'IDLE', x: 75, y: 95, label: 'IDLE', sub: '대기 · 0%', color: '#64748B' },
    { id: 'PATROL', x: 245, y: 95, label: 'PATROL', sub: '순찰 · +70%', color: '#10B981' },
    { id: 'AVOID', x: 245, y: 245, label: 'AVOID', sub: '회피 · R턴', color: '#F59E0B' },
    { id: 'ESTOP', x: 75, y: 245, label: 'ESTOP', sub: '비상정지', color: '#EF4444' },
  ];

  const motorTelemetry = {
    IDLE: { left: '0%', right: '0%', dist: '85 cm', led: '#64748B', msg: 'START 버튼 입력 대기 중' },
    PATROL: { left: '+70% FWD', right: '+70% FWD', dist: '78 cm', led: '#10B981', msg: '장애물 없음 → 안정 직진 주행' },
    AVOID: { left: '-50% REV', right: '+50% FWD', dist: '19 cm', led: '#F59E0B', msg: '전방 장애물 < 30cm → 제자리 우회전' },
    ESTOP: { left: '0% BRAKE', right: '0% BRAKE', dist: 'LOCKED', led: '#EF4444', msg: 'E-STOP 래치 발동 → 리셋 전 이동 불가' },
  }[state];

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Left: Interactive State Diagram */}
      <g transform="translate(22, 20)">
        <rect x="0" y="0" width="330" height="340" rx="10" fill="#F8FAFC" stroke="#E6E8EC" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#0A2540">
          상태 전이도 (노드를 클릭해 상태 전환)
        </text>

        {/* Transition Arrows */}
        <defs>
          <marker id="fsmArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#64748B" />
          </marker>
        </defs>

        {/* IDLE -> PATROL */}
        <line x1="125" y1="88" x2="195" y2="88" stroke="#64748B" strokeWidth="1.6" markerEnd="url(#fsmArrow)" />
        <text x="160" y="80" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="#475569">
          START
        </text>

        {/* PATROL -> AVOID */}
        <line x1="258" y1="138" x2="258" y2="202" stroke="#F59E0B" strokeWidth="1.6" markerEnd="url(#fsmArrow)" />
        <text x="292" y="172" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="#B45309">
          d &lt; 30cm
        </text>

        {/* AVOID -> PATROL */}
        <line x1="232" y1="202" x2="232" y2="138" stroke="#10B981" strokeWidth="1.6" markerEnd="url(#fsmArrow)" />
        <text x="198" y="172" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="#047857">
          clear
        </text>

        {/* ANY -> ESTOP */}
        <line x1="196" y1="252" x2="125" y2="252" stroke="#EF4444" strokeWidth="1.6" markerEnd="url(#fsmArrow)" />
        <line x1="75" y1="138" x2="75" y2="202" stroke="#EF4444" strokeWidth="1.6" markerEnd="url(#fsmArrow)" />
        <text x="160" y="244" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="#DC2626">
          FAULT / BTN
        </text>

        {/* State Circles */}
        {nodes.map((n) => {
          const active = n.id === state;
          return (
            <g
              key={n.id}
              onClick={() => onChangePreview({ day11FsmState: n.id })}
              className="cursor-pointer"
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={active ? 44 : 40}
                fill={active ? n.color : '#FFFFFF'}
                stroke={n.color}
                strokeWidth={active ? 3 : 2}
              />
              <text
                x={n.x}
                y={n.y - 3}
                textAnchor="middle"
                fontSize="11.5"
                fontWeight="800"
                fontFamily="monospace"
                fill={active ? '#FFFFFF' : '#0A2540'}
              >
                {n.label}
              </text>
              <text
                x={n.x}
                y={n.y + 13}
                textAnchor="middle"
                fontSize="9"
                fill={active ? '#F8FAFC' : '#64748B'}
              >
                {n.sub}
              </text>
            </g>
          );
        })}

        {/* Bottom Guard Note */}
        <rect x="14" y="298" width="302" height="30" rx="6" fill="#FFFFFF" stroke="#E2E8F0" />
        <text x="24" y="316" fontSize="9.5" fontFamily="monospace" fill="#0A2540">
          switch(currentState) → 한 틱에 딱 1개의 안전 상태만 실행
        </text>
      </g>

      {/* Right: Robot Chassis + ESP32 + HC-SR04 Reacting Live */}
      <g transform="translate(370, 20)">
        <rect x="0" y="0" width="308" height="340" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          로봇 하드웨어 실시간 출력 ({state})
        </text>

        {/* Top-Down Chassis */}
        <g transform="translate(88, 66)">
          {/* Wheels */}
          <rect x="-18" y="36" width="16" height="58" rx="4" fill={state === 'PATROL' || state === 'AVOID' ? '#38BDF8' : '#475569'} />
          <rect x="134" y="36" width="16" height="58" rx="4" fill={state === 'PATROL' || state === 'AVOID' ? '#38BDF8' : '#475569'} />

          {/* Chassis Body */}
          <rect x="0" y="16" width="132" height="106" rx="14" fill="#1E293B" stroke={motorTelemetry.led} strokeWidth="2.5" />

          {/* Status Beacon */}
          <circle cx="66" cy="68" r="14" fill={motorTelemetry.led} fillOpacity="0.28" stroke={motorTelemetry.led} strokeWidth="2" />
          <circle cx="66" cy="68" r="6" fill={motorTelemetry.led} />

          {/* Front HC-SR04 */}
          <RealHcsr04Svg x={36} y={-6} scale={0.38} />

          {/* Obstacle Block in AVOID state */}
          {state === 'AVOID' && (
            <g transform="translate(18, -28)">
              <rect x="0" y="0" width="96" height="16" rx="3" fill="#F59E0B" />
              <text x="48" y="11" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#451A03">
                장애물 19cm!
              </text>
            </g>
          )}
        </g>

        {/* Live Motor & Sensor Telemetry */}
        <g transform="translate(16, 206)">
          <rect x="0" y="0" width="134" height="56" rx="6" fill="#1E293B" />
          <text x="10" y="19" fontSize="9.5" fill="#94A3B8">좌측 모터 (L)</text>
          <text x="10" y="42" fontSize="13" fontFamily="monospace" fontWeight="700" fill="#38BDF8">
            {motorTelemetry.left}
          </text>

          <rect x="142" y="0" width="134" height="56" rx="6" fill="#1E293B" />
          <text x="152" y="19" fontSize="9.5" fill="#94A3B8">우측 모터 (R)</text>
          <text x="152" y="42" fontSize="13" fontFamily="monospace" fontWeight="700" fill="#38BDF8">
            {motorTelemetry.right}
          </text>
        </g>

        <rect x="16" y="274" width="276" height="50" rx="6" fill="#020617" stroke={motorTelemetry.led} />
        <text x="26" y="295" fontSize="10" fontFamily="monospace" fontWeight="700" fill={motorTelemetry.led}>
          Ultrasonic: {motorTelemetry.dist}
        </text>
        <text x="26" y="313" fontSize="10" fill="#E2E8F0">
          {motorTelemetry.msg}
        </text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 12: UART / I2C / SPI Bus Hardware & Protocol Analyzer                  */
/* -------------------------------------------------------------------------- */
export function Day12CommsScene({ preview, onChangePreview }: SceneProps) {
  const proto = preview.day12Protocol;
  const err = preview.day12WiringError;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Top Protocol Selector Strip */}
      <g transform="translate(20, 18)">
        {[
          { id: 'uart' as const, label: 'UART (1:1 비동기 직렬 · TX/RX 교차)' },
          { id: 'i2c' as const, label: 'I2C (2선식 버스 · SDA/SCL + 4.7kΩ 풀업)' },
          { id: 'spi' as const, label: 'SPI (고속 4선식 · 개별 CS 칩 선택)' },
        ].map((item, i) => {
          const active = proto === item.id;
          return (
            <g
              key={item.id}
              transform={`translate(${i * 222}, 0)`}
              onClick={() => onChangePreview({ day12Protocol: item.id })}
              className="cursor-pointer"
            >
              <rect
                x="0"
                y="0"
                width="214"
                height="28"
                rx="6"
                fill={active ? '#0A2540' : '#F7F8FA'}
                stroke={active ? '#0A2540' : '#E6E8EC'}
              />
              <text
                x="107"
                y="18"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={active ? '#FFFFFF' : '#425466'}
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* Left: ESP32 Master Board */}
      <g transform="translate(20, 52)">
        <RealEsp32BoardSvg x={0} y={0} scale={0.78} />
      </g>

      {/* Center: Wiring & Slave Devices depending on protocol */}
      {proto === 'uart' && (
        <g>
          {/* GPS / LiDAR UART Slave */}
          <g transform="translate(285, 80)">
            <rect x="0" y="0" width="150" height="112" rx="8" fill="#1E293B" stroke={err ? '#EF4444' : '#10B981'} strokeWidth="2" />
            <text x="75" y="24" textAnchor="middle" fontSize="11" fontWeight="700" fill="#F8FAFC">
              GPS / LiDAR 모듈
            </text>
            <text x="75" y="42" textAnchor="middle" fontSize="9.5" fontFamily="monospace" fill="#94A3B8">
              UART2 · 115200 bps
            </text>
            <text x="16" y="70" fontSize="10" fontFamily="monospace" fill="#38BDF8">RXD (수신)</text>
            <text x="16" y="92" fontSize="10" fontFamily="monospace" fill="#FBBF24">TXD (송신)</text>
          </g>

          {/* Wires */}
          {err ? (
            <>
              {/* TX->TX & RX->RX error */}
              <JumperWire x1={155} y1={170} x2={285} y2={169} color="#EF4444" arc={-18} />
              <JumperWire x1={155} y1={184} x2={285} y2={147} color="#EF4444" arc={18} />
              <rect x="174" y="132" width="96" height="22" rx="4" fill="#FEF2F2" stroke="#EF4444" />
              <text x="222" y="146" textAnchor="middle" fontSize="9" fontWeight="700" fill="#DC2626">
                TX↔TX 오배선!
              </text>
            </>
          ) : (
            <>
              {/* Correct TX->RX Crossover */}
              <JumperWire x1={155} y1={170} x2={285} y2={147} color="#10B981" arc={-14} animated />
              <JumperWire x1={155} y1={184} x2={285} y2={169} color="#F59E0B" arc={16} animated />
              <text x="222" y="132" textAnchor="middle" fontSize="9" fontWeight="700" fill="#059669">
                정상 크로스오버 (TX→RX)
              </text>
            </>
          )}
        </g>
      )}

      {proto === 'i2c' && (
        <g>
          {/* 3.3V Pull-up Resistors */}
          <text x="235" y="70" fontSize="9.5" fontWeight="700" fill={err ? '#DC2626' : '#059669'}>
            {err ? '풀업 저항 없음 (Open-Drain 고착!)' : '3.3V 풀업 저항 (4.7kΩ × 2)'}
          </text>
          {!err && (
            <>
              <RealResistorSvg x1={205} y1={82} x2={265} y2={82} ohms={4700} label="4.7kΩ SDA" />
              <RealResistorSvg x1={205} y1={104} x2={265} y2={104} ohms={4700} label="4.7kΩ SCL" />
            </>
          )}

          {/* I2C Bus Lines */}
          <JumperWire x1={155} y1={142} x2={295} y2={135} color={err ? '#EF4444' : '#3B82F6'} arc={-10} animated={!err} />
          <JumperWire x1={155} y1={156} x2={295} y2={195} color={err ? '#EF4444' : '#8B5CF6'} arc={10} animated={!err} />

          {/* Slave 1: MPU6050 */}
          <g transform="translate(295, 112)">
            <rect x="0" y="0" width="142" height="54" rx="7" fill="#1D4ED8" stroke={err ? '#EF4444' : '#93C5FD'} strokeWidth="1.5" />
            <text x="71" y="22" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#FFFFFF">
              MPU-6050 IMU
            </text>
            <text x="71" y="40" textAnchor="middle" fontSize="9.5" fontFamily="monospace" fill="#DBEAFE">
              주소: 0x68 (공유 버스)
            </text>
          </g>

          {/* Slave 2: OLED Display */}
          <g transform="translate(295, 178)">
            <rect x="0" y="0" width="142" height="54" rx="7" fill="#0F172A" stroke={err ? '#EF4444' : '#38BDF8'} strokeWidth="1.5" />
            <text x="71" y="22" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#FFFFFF">
              SSD1306 OLED
            </text>
            <text x="71" y="40" textAnchor="middle" fontSize="9.5" fontFamily="monospace" fill="#7DD3FC">
              주소: 0x3C (공유 버스)
            </text>
          </g>
        </g>
      )}

      {proto === 'spi' && (
        <g>
          {/* MOSI / MISO / SCK Shared Lines */}
          <JumperWire x1={155} y1={126} x2={295} y2={116} color="#0EA5E9" arc={-12} animated={!err} />
          <JumperWire x1={155} y1={152} x2={295} y2={146} color="#10B981" arc={0} animated={!err} />
          <JumperWire x1={155} y1={164} x2={295} y2={200} color="#8B5CF6" arc={12} animated={!err} />

          {/* CS1 vs CS2 */}
          <JumperWire x1={155} y1={210} x2={295} y2={132} color={err ? '#EF4444' : '#F59E0B'} arc={-6} />
          <JumperWire
            x1={155}
            y1={err ? 210 : 226}
            x2={295}
            y2={216}
            color={err ? '#EF4444' : '#EC4899'}
            arc={16}
          />

          <g transform="translate(295, 92)">
            <rect x="0" y="0" width="142" height="60" rx="7" fill="#334155" stroke={err ? '#EF4444' : '#F59E0B'} strokeWidth="1.5" />
            <text x="71" y="22" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#FFFFFF">
              microSD 카드 리더
            </text>
            <text x="71" y="42" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#FDE68A">
              CS1 → GPIO 5
            </text>
          </g>

          <g transform="translate(295, 174)">
            <rect x="0" y="0" width="142" height="60" rx="7" fill="#0F172A" stroke={err ? '#EF4444' : '#EC4899'} strokeWidth="1.5" />
            <text x="71" y="22" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#FFFFFF">
              ILI9341 TFT LCD
            </text>
            <text x="71" y="42" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={err ? '#FCA5A5' : '#FBCFE8'}>
              {err ? 'CS2도 GPIO 5 충돌!' : 'CS2 → GPIO 4 (독립)'}
            </text>
          </g>
        </g>
      )}

      {/* Right Panel: Logic Analyzer Waveform & Status */}
      <g transform="translate(454, 62)">
        <rect x="0" y="0" width="224" height="296" rx="10" fill="#0F172A" />
        <text x="14" y="24" fontSize="11" fontWeight="700" fill="#F8FAFC">
          로직 애널라이저 ({proto.toUpperCase()})
        </text>

        {/* Quick Error Injection Toggle */}
        <g
          onClick={() => onChangePreview({ day12WiringError: !err })}
          className="cursor-pointer"
        >
          <rect
            x="14"
            y="36"
            width="196"
            height="28"
            rx="6"
            fill={err ? '#EF4444' : '#10B981'}
          />
          <text x="112" y="54" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
            {err ? '배선 오류 ON (클릭해 복구)' : '정상 배선 (클릭해 고장 주입)'}
          </text>
        </g>

        {/* Waveforms */}
        <text x="14" y="92" fontSize="9.5" fontFamily="monospace" fill="#38BDF8">
          CLK / TX
        </text>
        <path
          d={
            err
              ? 'M 14 114 L 210 114'
              : 'M 14 114 L 30 114 L 30 98 L 48 98 L 48 114 L 66 114 L 66 98 L 84 98 L 84 114 L 112 114 L 112 98 L 130 98 L 130 114 L 170 114 L 170 98 L 190 98 L 190 114 L 210 114'
          }
          fill="none"
          stroke={err ? '#EF4444' : '#38BDF8'}
          strokeWidth="2"
        />

        <text x="14" y="144" fontSize="9.5" fontFamily="monospace" fill="#34D399">
          DATA / ACK
        </text>
        <path
          d={
            err
              ? 'M 14 166 L 210 166'
              : 'M 14 166 L 40 166 L 40 150 L 74 150 L 74 166 L 106 166 L 106 150 L 146 150 L 146 166 L 178 166 L 178 150 L 210 150'
          }
          fill="none"
          stroke={err ? '#F87171' : '#34D399'}
          strokeWidth="2"
        />

        {/* Diagnosis Log */}
        <rect x="14" y="186" width="196" height="96" rx="6" fill="#020617" stroke={err ? '#EF4444' : '#10B981'} />
        <text x="22" y="206" fontSize="10" fontWeight="700" fill={err ? '#F87171' : '#34D399'}>
          {err ? '통신 실패 (TIMEOUT / NACK)' : '통신 정상 (데이터 수신 중)'}
        </text>
        <foreignObject x="22" y="214" width="180" height="60">
          <p className="text-[10.5px] leading-[1.45] text-[#CBD5E1]">
            {proto === 'uart'
              ? err
                ? 'TX와 TX가 충돌해 수신 버퍼가 0바이트입니다.'
                : '9600~115200bps로 1:1 프레임 송수신 성공.'
              : proto === 'i2c'
                ? err
                  ? '풀업 저항이 없어 Open-Drain 라인이 3.3V로 복귀하지 못합니다.'
                  : '0x68(IMU) + 0x3C(OLED) 멀티 슬레이브 정상 ACK.'
                : err
                  ? '두 장치가 같은 CS 핀에 묶여 MISO 버스가 충돌(손상)합니다.'
                  : 'CS 분리 완료 · 20MHz 고속 SPI 풀듀플렉스 동작.'}
          </p>
        </foreignObject>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 13: Actuator Comparison Lab (DC Geared / Servo / Stepper)              */
/* -------------------------------------------------------------------------- */
export function Day13ActuatorsScene({ preview, onChangePreview }: SceneProps) {
  const motor = preview.day13MotorType;
  const gear = preview.day13GearRatio;
  const load = preview.day13LoadKgCm;

  const baseTorque = motor === 'dc' ? 0.12 : motor === 'servo' ? 1.8 : 4.2;
  const baseRpm = motor === 'dc' ? 6000 : motor === 'servo' ? 60 : 300;
  const outputTorque =
    motor === 'dc'
      ? Number((baseTorque * gear * 0.85).toFixed(2))
      : motor === 'servo'
        ? Number((baseTorque * (gear / 20)).toFixed(2))
        : baseTorque;
  const outputRpm =
    motor === 'dc'
      ? Math.round(baseRpm / gear)
      : motor === 'servo'
        ? Math.round(baseRpm * (20 / gear))
        : baseRpm;
  const isStalled = load > outputTorque;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Top Selector */}
      <g transform="translate(20, 18)">
        {[
          { id: 'dc' as const, label: '브러시 DC 모터 + 기어박스' },
          { id: 'servo' as const, label: 'SG90/MG996R 서보 (피드백 내장)' },
          { id: 'stepper' as const, label: 'NEMA-17 스테퍼 + A4988' },
        ].map((m, idx) => {
          const active = motor === m.id;
          return (
            <g
              key={m.id}
              transform={`translate(${idx * 222}, 0)`}
              onClick={() => onChangePreview({ day13MotorType: m.id })}
              className="cursor-pointer"
            >
              <rect
                x="0"
                y="0"
                width="214"
                height="28"
                rx="6"
                fill={active ? '#635BFF' : '#F7F8FA'}
                stroke={active ? '#635BFF' : '#E6E8EC'}
              />
              <text
                x="107"
                y="18"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={active ? '#FFFFFF' : '#425466'}
              >
                {m.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* Left Hardware Drawing */}
      <g transform="translate(26, 62)">
        <rect x="0" y="0" width="320" height="292" rx="10" fill="#F8FAFC" stroke={isStalled ? '#EF4444' : '#E2E8F0'} strokeWidth="1.5" />

        {motor === 'dc' && (
          <g transform="translate(36, 54)">
            {/* Yellow TT Gearbox */}
            <rect x="92" y="18" width="128" height="74" rx="10" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
            {/* Cylindrical DC Motor */}
            <rect x="0" y="28" width="96" height="54" rx="8" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
            <circle cx="176" cy="55" r="24" fill="#FFFFFF" stroke="#CA8A04" strokeWidth="2" />
            <circle cx="176" cy="55" r="8" fill="#334155" />
            {/* Spinning Shaft Indicator */}
            <line x1="176" y1="33" x2="176" y2="77" stroke="#635BFF" strokeWidth="3" />
            <text x="112" y="124" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0A2540">
              TT 기어드 DC 모터 ({gear}:1 감속)
            </text>
            <text x="112" y="142" textAnchor="middle" fontSize="10" fill="#64748B">
              연속 회전 구동 · 속도 제어(PWM) · 엔코더 없이 각도 불가
            </text>
          </g>
        )}

        {motor === 'servo' && (
          <g transform="translate(56, 46)">
            <rect x="20" y="34" width="160" height="88" rx="8" fill="#2563EB" stroke="#1E40AF" strokeWidth="2" />
            <rect x="0" y="54" width="200" height="14" rx="3" fill="#1D4ED8" />
            <circle cx="136" cy="34" r="26" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
            {/* Servo Horn */}
            <rect x="128" y="0" width="16" height="44" rx="7" fill="#FFFFFF" stroke="#475569" strokeWidth="1.5" />
            <circle cx="136" cy="34" r="6" fill="#0F172A" />
            {/* 3-pin cable */}
            <line x1="20" y1="100" x2="-20" y2="120" stroke="#EA580C" strokeWidth="3" />
            <line x1="20" y1="106" x2="-20" y2="126" stroke="#DC2626" strokeWidth="3" />
            <line x1="20" y1="112" x2="-20" y2="132" stroke="#78350F" strokeWidth="3" />
            <text x="102" y="152" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0A2540">
              RC 서보 모터 (50Hz 펄스폭 1~2ms)
            </text>
            <text x="102" y="170" textAnchor="middle" fontSize="10" fill="#64748B">
              내부 가변저항(포텐셔미터) 폐루프 → 0~180° 각도 고정
            </text>
          </g>
        )}

        {motor === 'stepper' && (
          <g transform="translate(46, 44)">
            {/* NEMA 17 body */}
            <rect x="18" y="16" width="110" height="110" rx="10" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <circle cx="73" cy="71" r="36" fill="#334155" stroke="#94A3B8" />
            <circle cx="73" cy="71" r="10" fill="#E2E8F0" />
            {/* A4988 Driver */}
            <rect x="150" y="34" width="76" height="72" rx="6" fill="#DC2626" stroke="#991B1B" />
            <rect x="166" y="48" width="44" height="34" rx="3" fill="#94A3B8" />
            <text x="188" y="122" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0A2540">
              A4988 드라이버
            </text>
            <text x="114" y="156" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0A2540">
              NEMA-17 스테퍼 (1스텝 = 1.8° 정밀)
            </text>
            <text x="114" y="174" textAnchor="middle" fontSize="10" fill="#64748B">
              개루프 위치 제어 · 과부하 시 탈조(Step Skip) 발생!
            </text>
          </g>
        )}

        {/* Load Stress Gauge */}
        <g transform="translate(20, 224)">
          <rect x="0" y="0" width="280" height="52" rx="8" fill={isStalled ? '#FEF2F2' : '#ECFDF5'} stroke={isStalled ? '#EF4444' : '#10B981'} />
          <text x="14" y="21" fontSize="11" fontWeight="700" fill={isStalled ? '#B91C1C' : '#047857'}>
            {isStalled
              ? '구속 토크 초과 (STALL / 탈조 발생!)'
              : '안전 구동 범위 (부하 토크 < 출력 토크)'}
          </text>
          <text x="14" y="40" fontSize="10" fontFamily="monospace" fill="#334155">
            외부 부하 {load.toFixed(1)} kg·cm vs 출력 토크 {outputTorque} kg·cm
          </text>
        </g>
      </g>

      {/* Right Torque/Speed Trade-off & Spec Dashboard */}
      <g transform="translate(362, 62)">
        <rect x="0" y="0" width="316" height="292" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          감속비 · 출력 토크 · 회전수 트레이드오프
        </text>

        <g transform="translate(16, 44)">
          <rect x="0" y="0" width="136" height="70" rx="8" fill="#1E293B" />
          <text x="12" y="22" fontSize="9.5" fill="#94A3B8">출력 토크 (τ_out)</text>
          <text x="12" y="50" fontSize="18" fontFamily="monospace" fontWeight="700" fill="#38BDF8">
            {outputTorque}
          </text>
          <text x="86" y="50" fontSize="10" fontFamily="monospace" fill="#94A3B8">kg·cm</text>

          <rect x="148" y="0" width="136" height="70" rx="8" fill="#1E293B" />
          <text x="160" y="22" fontSize="9.5" fill="#94A3B8">무부하 속도 (RPM)</text>
          <text x="160" y="50" fontSize="18" fontFamily="monospace" fontWeight="700" fill="#34D399">
            {outputRpm}
          </text>
          <text x="234" y="50" fontSize="10" fontFamily="monospace" fill="#94A3B8">rpm</text>
        </g>

        {/* Energy conservation comparison bar */}
        <text x="16" y="142" fontSize="10" fontFamily="monospace" fill="#CBD5E1">
          토크 증가율 (×{gear} 감속 · 효율 85%)
        </text>
        <rect x="16" y="150" width="284" height="12" rx="6" fill="#1E293B" />
        <rect
          x="16"
          y="150"
          width={Math.min(284, Math.max(24, (outputTorque / 12) * 284))}
          height="12"
          rx="6"
          fill={isStalled ? '#EF4444' : '#635BFF'}
        />

        <rect x="16" y="182" width="284" height="94" rx="8" fill="#020617" stroke="#334155" />
        <text x="26" y="204" fontSize="10.5" fontWeight="700" fill="#F8FAFC">
          로봇 공학 선택 가이드
        </text>
        <foreignObject x="26" y="210" width="264" height="60">
          <p className="text-[11px] leading-[1.45] text-[#CBD5E1]">
            {motor === 'dc'
              ? '바퀴 주행에는 DC 모터 + 기어박스가 최고입니다. 감속비를 높이면 오르막 토크가 커지고 속도는 반비례합니다.'
              : motor === 'servo'
                ? '로봇 팔 관절·초음파 팬/틸트에 적합. 단, 스톨 시 정격 전류의 5배 이상 흐르므로 외부 5V 전원이 필수입니다.'
                : '3D 프린터·정밀 위치 이동에 쓰지만, 부하가 정격을 넘으면 엔코더가 없어 탈조를 감지하지 못합니다.'}
          </p>
        </foreignObject>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 14: H-Bridge 4-MOSFET Topology, Common GND & Shoot-Through Hazard      */
/* -------------------------------------------------------------------------- */
export function Day14HbridgeScene({ preview, onChangePreview }: SceneProps) {
  const mode = preview.day14HbridgeMode;
  const gndOk = preview.day14CommonGnd;

  const q1 = mode === 'forward' || mode === 'shoot_through';
  const q2 = mode === 'reverse' || mode === 'brake' || mode === 'shoot_through';
  const q3 = mode === 'reverse';
  const q4 = mode === 'forward' || mode === 'brake';

  const shootThrough = mode === 'shoot_through';
  const motorAction = !gndOk
    ? '기준 전위 없음 (무반응)'
    : shootThrough
      ? '단락 폭발 (7.4V→GND 쇼트!)'
      : mode === 'forward'
        ? '정회전 (CW · Q1+Q4 ON)'
        : mode === 'reverse'
          ? '역회전 (CCW · Q3+Q2 ON)'
          : mode === 'brake'
            ? '능동 브레이크 (Q2+Q4 단락 제동)'
            : '관성 공회전 (ALL OFF · 환류 다이오드)';

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Left: ESP32 + 2S LiPo + Common GND Bridge */}
      <g transform="translate(18, 22)">
        <RealEsp32BoardSvg x={0} y={0} scale={0.72} />
        <RealBatterySvg x={10} y={266} type="lipo_2s" />

        {/* Common GND wire between ESP32 GND and Driver GND */}
        {gndOk ? (
          <>
            <JumperWire x1={134} y1={144} x2={244} y2={280} color="#0F172A" arc={24} animated />
            <rect x="148" y="218" width="84" height="20" rx="4" fill="#ECFDF5" stroke="#10B981" />
            <text x="190" y="231" textAnchor="middle" fontSize="9" fontWeight="700" fill="#047857">
              공통 GND 연결
            </text>
          </>
        ) : (
          <>
            <path d="M 134 144 Q 178 185 186 210" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="4 3" />
            <rect x="138" y="214" width="102" height="22" rx="4" fill="#FEF2F2" stroke="#EF4444" />
            <text x="189" y="228" textAnchor="middle" fontSize="9" fontWeight="700" fill="#DC2626">
              GND 단선! 제어 불능
            </text>
          </>
        )}
      </g>

      {/* Center-Right: H-Bridge 4-Switch Schematic */}
      <g transform="translate(248, 22)">
        <rect
          x="0"
          y="0"
          width="432"
          height="336"
          rx="10"
          fill="#0F172A"
          stroke={shootThrough || !gndOk ? '#EF4444' : '#334155'}
          strokeWidth="2"
        />
        <text x="18" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          H-브리지 4-MOSFET 토폴로지 ({motorAction})
        </text>

        {/* Top VMOT = 7.4V Rail */}
        <line x1="90" y1="54" x2="340" y2="54" stroke="#EF4444" strokeWidth="3" />
        <text x="215" y="46" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="700" fill="#FCA5A5">
          VMOT = +7.4V (2S LiPo)
        </text>

        {/* Left & Right Vertical Legs */}
        <line x1="120" y1="54" x2="120" y2="254" stroke={shootThrough ? '#EF4444' : '#475569'} strokeWidth={shootThrough ? 4 : 2.5} />
        <line x1="310" y1="54" x2="310" y2="254" stroke="#475569" strokeWidth="2.5" />

        {/* Bottom GND Rail */}
        <line x1="90" y1="254" x2="340" y2="254" stroke="#94A3B8" strokeWidth="3" />
        <text x="215" y="272" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#CBD5E1">
          POWER GND (공통 접지)
        </text>

        {/* Shoot-through Short Circuit Warning */}
        {shootThrough && (
          <g>
            <line x1="120" y1="54" x2="120" y2="254" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="6 4" />
            <rect x="26" y="138" width="90" height="32" rx="5" fill="#DC2626" />
            <text x="71" y="152" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#FFFFFF">
              관통 단락!
            </text>
            <text x="71" y="164" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="#FEF08A">
              I &gt; 40A 소손
            </text>
          </g>
        )}

        {/* Motor in Middle Bridge */}
        <line x1="120" y1="154" x2="310" y2="154" stroke="#38BDF8" strokeWidth="3" />
        <circle cx="215" cy="154" r="30" fill="#1E293B" stroke={shootThrough ? '#EF4444' : '#38BDF8'} strokeWidth="2.5" />
        <text x="215" y="151" textAnchor="middle" fontSize="13" fontWeight="800" fill="#F8FAFC">
          M
        </text>
        <text x="215" y="167" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#7DD3FC">
          {mode === 'forward' ? '→ CW →' : mode === 'reverse' ? '← CCW ←' : mode === 'brake' ? 'BRAKE' : 'IDLE'}
        </text>

        {/* 4 MOSFET Switches */}
        {[
          { id: 'Q1 (High-L)', x: 84, y: 78, on: q1 },
          { id: 'Q2 (Low-L)', x: 84, y: 196, on: q2 },
          { id: 'Q3 (High-R)', x: 274, y: 78, on: q3 },
          { id: 'Q4 (Low-R)', x: 274, y: 196, on: q4 },
        ].map((sw) => (
          <g key={sw.id} transform={`translate(${sw.x}, ${sw.y})`}>
            <rect
              x="0"
              y="0"
              width="72"
              height="32"
              rx="6"
              fill={sw.on ? (shootThrough && sw.x === 84 ? '#DC2626' : '#10B981') : '#1E293B'}
              stroke={sw.on ? '#FFFFFF' : '#475569'}
              strokeWidth="1.5"
            />
            <text x="36" y="14" textAnchor="middle" fontSize="9" fontWeight="700" fill="#FFFFFF">
              {sw.id}
            </text>
            <text x="36" y="26" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill={sw.on ? '#ECFDF5' : '#64748B'}>
              {sw.on ? 'ON (도통)' : 'OFF'}
            </text>
          </g>
        ))}

        {/* Quick Mode Buttons */}
        <g transform="translate(16, 288)">
          {[
            { id: 'forward' as const, label: '정회전' },
            { id: 'reverse' as const, label: '역회전' },
            { id: 'brake' as const, label: '브레이크' },
            { id: 'coast' as const, label: '공회전' },
            { id: 'shoot_through' as const, label: '쇼트 사고!' },
          ].map((b, i) => {
            const active = mode === b.id;
            return (
              <g
                key={b.id}
                transform={`translate(${i * 80}, 0)`}
                onClick={() => onChangePreview({ day14HbridgeMode: b.id })}
                className="cursor-pointer"
              >
                <rect
                  x="0"
                  y="0"
                  width="75"
                  height="28"
                  rx="6"
                  fill={active ? (b.id === 'shoot_through' ? '#EF4444' : '#635BFF') : '#1E293B'}
                  stroke={active ? '#FFFFFF' : '#334155'}
                />
                <text x="37" y="18" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#FFFFFF">
                  {b.label}
                </text>
              </g>
            );
          })}
        </g>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 15: Dual-Core FreeRTOS + ISR Interrupt Safety + Wireless RC            */
/* -------------------------------------------------------------------------- */
export function Day15RtosWirelessScene({ preview, onChangePreview }: SceneProps) {
  const rtos = preview.day15RtosEnabled;
  const isrSafe = preview.day15IsrSafe;
  const cmd = preview.day15Command;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Top Wireless RC Transmitter */}
      <g transform="translate(22, 24)">
        <rect x="0" y="0" width="180" height="332" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="16" y="26" fontSize="11" fontWeight="700" fill="#0A2540">
          2.4GHz 무선 조종기 (ESP-NOW)
        </text>
        <text x="16" y="42" fontSize="9.5" fill="#64748B">
          명령 패킷 지연 &lt; 2 ms · 50Hz 송신
        </text>

        {/* RC Command Buttons */}
        <g transform="translate(18, 66)">
          {[
            { id: 'forward' as const, label: '전진 (FWD 80%)', y: 0 },
            { id: 'turn' as const, label: '우회전 (TURN)', y: 44 },
            { id: 'stop' as const, label: '정지 (STOP 0%)', y: 88 },
          ].map((btn) => {
            const active = cmd === btn.id;
            return (
              <g
                key={btn.id}
                transform={`translate(0, ${btn.y})`}
                onClick={() => onChangePreview({ day15Command: btn.id })}
                className="cursor-pointer"
              >
                <rect
                  x="0"
                  y="0"
                  width="144"
                  height="34"
                  rx="7"
                  fill={active ? '#635BFF' : '#FFFFFF'}
                  stroke={active ? '#635BFF' : '#CBD5E1'}
                />
                <text
                  x="72"
                  y="21"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill={active ? '#FFFFFF' : '#0A2540'}
                >
                  {btn.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* ISR Safety Trigger Card */}
        <g transform="translate(16, 212)">
          <rect x="0" y="0" width="148" height="104" rx="8" fill={isrSafe ? '#ECFDF5' : '#FEF2F2'} stroke={isrSafe ? '#10B981' : '#EF4444'} />
          <text x="10" y="20" fontSize="10" fontWeight="700" fill={isrSafe ? '#047857' : '#B91C1C'}>
            엔코더 ISR 안전성
          </text>
          <text x="10" y="38" fontSize="9" fontFamily="monospace" fill="#334155">
            {isrSafe ? 'IRAM_ATTR + volatile++' : 'Serial.println() in ISR!'}
          </text>
          <g
            onClick={() => onChangePreview({ day15IsrSafe: !isrSafe })}
            className="cursor-pointer"
          >
            <rect x="10" y="54" width="128" height="32" rx="6" fill={isrSafe ? '#10B981' : '#EF4444'} />
            <text x="74" y="74" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#FFFFFF">
              {isrSafe ? 'ISR 안전 (고장 테스트)' : '패닉 발생! 복구하기'}
            </text>
          </g>
        </g>
      </g>

      {/* Wireless Waves */}
      <g transform="translate(208, 92)">
        <path d="M 8 24 Q 20 8 32 24" fill="none" stroke="#635BFF" strokeWidth="2.2" />
        <path d="M 14 34 Q 20 24 26 34" fill="none" stroke="#635BFF" strokeWidth="2.2" />
        <text x="20" y="52" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="#635BFF">
          {cmd.toUpperCase()}
        </text>
      </g>

      {/* Right: ESP32 Dual-Core Architecture */}
      <g transform="translate(248, 24)">
        <rect x="0" y="0" width="430" height="332" rx="10" fill="#0F172A" stroke={!isrSafe ? '#EF4444' : '#334155'} strokeWidth="2" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          ESP32 듀얼코어 FreeRTOS 태스크 스케줄러
        </text>

        {/* Core 0 */}
        <g transform="translate(16, 46)">
          <rect x="0" y="0" width="182" height="142" rx="8" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
          <text x="12" y="22" fontSize="10.5" fontWeight="700" fill="#38BDF8">
            Core 0 (PRO_CPU)
          </text>
          <text x="12" y="42" fontSize="9.5" fill="#CBD5E1">
            • Wi-Fi / ESP-NOW 무선 스택
          </text>
          <text x="12" y="60" fontSize="9.5" fill="#CBD5E1">
            • UDP 조종 패킷 수신 콜백
          </text>
          <rect x="12" y="80" width="158" height="46" rx="5" fill="#020617" />
          <text x="20" y="99" fontSize="9" fontFamily="monospace" fill="#7DD3FC">
            xQueueSend(cmdQueue,
          </text>
          <text x="20" y="114" fontSize="9" fontFamily="monospace" fill="#34D399">
            &quot;{cmd}&quot;) → Core 1 전달
          </text>
        </g>

        {/* Bridge Arrow */}
        <line x1="198" y1="116" x2="232" y2="116" stroke={rtos ? '#10B981' : '#F59E0B'} strokeWidth="2.5" />
        <text x="215" y="106" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="#E2E8F0">
          Queue
        </text>

        {/* Core 1 */}
        <g transform="translate(232, 46)">
          <rect x="0" y="0" width="182" height="142" rx="8" fill="#1E293B" stroke={rtos ? '#10B981' : '#F59E0B'} strokeWidth="1.5" />
          <text x="12" y="22" fontSize="10.5" fontWeight="700" fill={rtos ? '#34D399' : '#FBBF24'}>
            Core 1 (APP_CPU)
          </text>
          <text x="12" y="42" fontSize="9.5" fill="#CBD5E1">
            {rtos ? '• motorTask() 20ms 주기 고정' : '• 단일 loop() + 블로킹 혼재'}
          </text>
          <text x="12" y="60" fontSize="9.5" fill="#CBD5E1">
            • vTaskDelay(pdMS_TO_TICKS(20))
          </text>
          <rect x="12" y="80" width="158" height="46" rx="5" fill="#020617" />
          <text x="20" y="99" fontSize="9" fontFamily="monospace" fill="#F8FAFC">
            PWM Out: {cmd === 'forward' ? 'L=+80 R=+80' : cmd === 'turn' ? 'L=+65 R=-65' : 'L=0 R=0'}
          </text>
          <text x="20" y="114" fontSize="9" fontFamily="monospace" fill={rtos ? '#34D399' : '#FBBF24'}>
            {rtos ? 'Watchdog 리셋 방지 정상' : '무선 지연 시 모터 루프 밀림!'}
          </text>
        </g>

        {/* Bottom Status / Crash Panel */}
        <rect x="16" y="204" width="398" height="112" rx="8" fill={!isrSafe ? '#450A0A' : '#020617'} stroke={!isrSafe ? '#EF4444' : '#334155'} />
        {!isrSafe ? (
          <>
            <text x="28" y="230" fontSize="11.5" fontFamily="monospace" fontWeight="700" fill="#FCA5A5">
              Guru Meditation Error: Core 1 panic&apos;ed (Interrupt wdt timeout)
            </text>
            <text x="28" y="252" fontSize="10" fill="#FECACA">
              인터럽트(ISR) 안에서 Serial.print()·delay()·malloc()을 호출해 시스템이 재부팅되었습니다!
            </text>
            <text x="28" y="274" fontSize="10" fontFamily="monospace" fill="#FDE047">
              해결: void IRAM_ATTR onEncoder() {'{'} pulseCount++; {'}'} (플래그/카운터만 증가)
            </text>
          </>
        ) : (
          <>
            <text x="28" y="230" fontSize="11" fontWeight="700" fill={rtos ? '#34D399' : '#FBBF24'}>
              {rtos
                ? '듀얼코어 병렬화 활성화 · 실시간 제어 안정!'
                : '단일 루프 모드 (FreeRTOS 미사용 시 무선 패킷 지연 위험)'}
            </text>
            <text x="28" y="254" fontSize="10" fill="#CBD5E1">
              • Core 0은 무선 패킷 처리만 전담, Core 1은 PID/모터 제어만 50Hz로 전담합니다.
            </text>
            <text x="28" y="274" fontSize="10" fill="#94A3B8">
              • vTaskDelay()는 CPU를 점유하지 않고 다른 태스크에 양보(Yield)해 WDT를 리셋합니다.
            </text>
          </>
        )}
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 16: Capstone — 2WD Wireless RC Rover Full System & Failsafe Bench      */
/* -------------------------------------------------------------------------- */
export function Day16RoverScene({ preview, onChangePreview }: SceneProps) {
  const drive = preview.day16DriveCmd;
  const buckOk = preview.day16BuckSeparated;
  const lostMs = preview.day16SignalLostMs;
  const failsafe = preview.day16FailsafeEnabled;

  const signalLost = lostMs >= 500;
  const brownout = !buckOk && drive !== 'stop';
  const runaway = signalLost && !failsafe && drive !== 'stop';
  const safeHalted = signalLost && failsafe;

  const effectiveCmd = brownout || safeHalted ? 'stop' : drive;

  const wheelStatus = {
    stop: { l: '0%', r: '0%', arrow: 'STOP' },
    forward: { l: '+80%', r: '+80%', arrow: '▲ 직진' },
    reverse: { l: '-70%', r: '-70%', arrow: '▼ 후진' },
    left: { l: '-55%', r: '+55%', arrow: '◀ 좌회전' },
    right: { l: '+55%', r: '-55%', arrow: '▶ 우회전' },
  }[effectiveCmd];

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Left: Power Architecture (2S LiPo -> Buck 5V vs Motor Rail) */}
      <g transform="translate(18, 20)">
        <RealBatterySvg x={8} y={4} type="lipo_2s" />

        {/* LM2596 Buck Module */}
        <g transform="translate(8, 128)">
          <rect
            x="0"
            y="0"
            width="136"
            height="64"
            rx="8"
            fill={buckOk ? '#ECFDF5' : '#FEF2F2'}
            stroke={buckOk ? '#10B981' : '#EF4444'}
            strokeWidth="1.5"
          />
          <text x="68" y="20" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0A2540">
            LM2596 5V 벅 컨버터
          </text>
          <text x="68" y="36" textAnchor="middle" fontSize="9.5" fontFamily="monospace" fill={buckOk ? '#047857' : '#DC2626'}>
            {buckOk ? '로직 전원 분리 OK (3.3V 안정)' : '전원 분리 안 함 → 노이즈 직격!'}
          </text>
          <text x="68" y="52" textAnchor="middle" fontSize="8.5" fill="#64748B">
            + 470µF 디커플링 커패시터
          </text>
        </g>

        {/* ESP32 Mini Brain */}
        <g transform="translate(0, 208)">
          <RealEsp32BoardSvg x={0} y={0} scale={0.44} wifiActive={!signalLost && !brownout} />
          <text x="96" y="42" fontSize="10" fontWeight="700" fill="#0A2540">
            ESP32 로버 컨트롤러
          </text>
          <text x="96" y="58" fontSize="9.5" fontFamily="monospace" fill={brownout ? '#DC2626' : '#059669'}>
            {brownout ? 'VDD = 2.1V BROWNOUT!' : 'VDD = 3.30V 정상'}
          </text>
          <text x="96" y="76" fontSize="9" fontFamily="monospace" fill={signalLost ? '#D97706' : '#635BFF'}>
            {signalLost ? `신호 두절 ${lostMs}ms` : `연결 정상 (${lostMs}ms)`}
          </text>
        </g>
      </g>

      {/* Wires from Power to Driver & ESP32 */}
      <JumperWire x1={116} y1={52} x2={228} y2={70} color="#EF4444" arc={-14} animated />
      <JumperWire x1={144} y1={160} x2={228} y2={106} color={buckOk ? '#10B981' : '#F59E0B'} arc={10} animated={buckOk} />

      {/* Center: 2WD Rover Top-Down Hardware + L298N/TB6612 Driver */}
      <g transform="translate(226, 20)">
        <rect
          x="0"
          y="0"
          width="244"
          height="340"
          rx="10"
          fill="#0F172A"
          stroke={brownout || runaway ? '#EF4444' : safeHalted ? '#F59E0B' : '#10B981'}
          strokeWidth="2"
        />
        <text x="16" y="24" fontSize="11" fontWeight="700" fill="#F8FAFC">
          2WD 무선 로버 통합 구동부
        </text>

        {/* TB6612 / L298N Driver Board */}
        <g transform="translate(36, 40)">
          <rect x="0" y="0" width="172" height="58" rx="6" fill="#991B1B" stroke="#FCA5A5" />
          <text x="86" y="22" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
            L298N / TB6612FNG 드라이버
          </text>
          <text x="86" y="42" textAnchor="middle" fontSize="9.5" fontFamily="monospace" fill="#FDE68A">
            L: {wheelStatus.l} · R: {wheelStatus.r}
          </text>
        </g>

        {/* 2WD Chassis */}
        <g transform="translate(50, 124)">
          <rect x="-18" y="34" width="16" height="56" rx="4" fill={effectiveCmd === 'stop' ? '#475569' : '#38BDF8'} />
          <rect x="146" y="34" width="16" height="56" rx="4" fill={effectiveCmd === 'stop' ? '#475569' : '#38BDF8'} />
          <rect x="0" y="10" width="144" height="106" rx="14" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <circle cx="72" cy="22" r="9" fill="#94A3B8" />
          <text x="72" y="64" textAnchor="middle" fontSize="14" fontWeight="800" fill="#F8FAFC">
            {wheelStatus.arrow}
          </text>
          <text x="72" y="84" textAnchor="middle" fontSize="9.5" fontFamily="monospace" fill="#94A3B8">
            {runaway ? '제어 불능 폭주 중!' : safeHalted ? 'Failsafe 자동 정지' : '실시간 무선 주행'}
          </text>
        </g>

        {/* Status Banner */}
        <rect
          x="16"
          y="264"
          width="212"
          height="62"
          rx="6"
          fill={brownout || runaway ? '#450A0A' : safeHalted ? '#451A03' : '#020617'}
          stroke={brownout || runaway ? '#EF4444' : safeHalted ? '#F59E0B' : '#10B981'}
        />
        <text
          x="26"
          y="286"
          fontSize="10"
          fontWeight="700"
          fill={brownout || runaway ? '#FCA5A5' : safeHalted ? '#FCD34D' : '#34D399'}
        >
          {brownout
            ? 'BROWNOUT 리셋! 전원 분리 필요'
            : runaway
              ? 'RUNAWAY 위험! Failsafe OFF'
              : safeHalted
                ? 'FAILSAFE 발동: 500ms 신호두절 정지'
                : '시스템 정상: 안전 텔레메트리 OK'}
        </text>
        <text x="26" y="306" fontSize="9" fontFamily="monospace" fill="#CBD5E1">
          {brownout
            ? '모터 돌입전류로 ESP32가 무한 재부팅'
            : runaway
              ? '송신기가 꺼져도 마지막 명령을 계속 수행!'
              : 'millis() - lastRxMs > 500 → stop()'}
        </text>
      </g>

      {/* Right: Interactive D-Pad Remote Control */}
      <g transform="translate(486, 20)">
        <rect x="0" y="0" width="194" height="340" rx="10" fill="#F7F8FA" stroke="#E6E8EC" />
        <text x="16" y="26" fontSize="11" fontWeight="700" fill="#0A2540">
          스마트폰 D-Pad 조종
        </text>

        {/* D-Pad Buttons */}
        <g transform="translate(24, 56)">
          {[
            { id: 'forward' as const, label: '▲', x: 50, y: 0 },
            { id: 'left' as const, label: '◀', x: 0, y: 50 },
            { id: 'stop' as const, label: '■', x: 50, y: 50 },
            { id: 'right' as const, label: '▶', x: 100, y: 50 },
            { id: 'reverse' as const, label: '▼', x: 50, y: 100 },
          ].map((btn) => {
            const active = drive === btn.id;
            return (
              <g
                key={btn.id}
                transform={`translate(${btn.x}, ${btn.y})`}
                onClick={() => onChangePreview({ day16DriveCmd: btn.id })}
                className="cursor-pointer"
              >
                <rect
                  x="0"
                  y="0"
                  width="44"
                  height="44"
                  rx="8"
                  fill={active ? '#635BFF' : '#FFFFFF'}
                  stroke={active ? '#635BFF' : '#CBD5E1'}
                  strokeWidth="1.5"
                />
                <text
                  x="22"
                  y="27"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="700"
                  fill={active ? '#FFFFFF' : '#0A2540'}
                >
                  {btn.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Quick Checklist */}
        <g transform="translate(14, 218)">
          <rect x="0" y="0" width="166" height="106" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
          <text x="12" y="22" fontSize="10" fontWeight="700" fill="#0A2540">
            완성 체크리스트
          </text>
          <text x="12" y="44" fontSize="9.5" fill={buckOk ? '#059669' : '#DC2626'}>
            {buckOk ? '✓' : '✗'} 벅 컨버터 5V 전원 분리
          </text>
          <text x="12" y="64" fontSize="9.5" fill={failsafe ? '#059669' : '#DC2626'}>
            {failsafe ? '✓' : '✗'} 500ms Failsafe 워치독
          </text>
          <text x="12" y="84" fontSize="9.5" fill={drive !== 'stop' ? '#059669' : '#64748B'}>
            {drive !== 'stop' ? '✓' : '•'} D-Pad 주행 테스트
          </text>
        </g>
      </g>
    </svg>
  );
}
