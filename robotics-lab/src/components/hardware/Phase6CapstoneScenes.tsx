import { LabPreviewState } from '../../types/lab';

interface SceneProps {
  preview: LabPreviewState;
  onChangePreview: (patch: Partial<LabPreviewState>) => void;
}

/* -------------------------------------------------------------------------- */
/* Day 43: PCB Layout — Trace Current Width, 0.1uF Decap & GND Copper Pour    */
/* -------------------------------------------------------------------------- */
export function Day43PcbDesignScene({ preview, onChangePreview }: SceneProps) {
  const widthMm = preview.day43TraceWidthMm;
  const decapClose = preview.day43DecouplingClose;
  const gndPour = preview.day43GndPour;

  const traceSafe = widthMm >= 1.4;
  const tracePx = Math.max(2, Math.min(20, widthMm * 9));
  const drcOk = traceSafe && decapClose && gndPour;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Left: Realistic Green 2-Layer PCB Canvas */}
      <g transform="translate(20, 20)">
        <rect
          x="0"
          y="0"
          width="426"
          height="340"
          rx="12"
          fill={gndPour ? '#064E3B' : '#065F46'}
          stroke="#047857"
          strokeWidth="2.5"
        />

        {/* Copper GND Pour Hatching Pattern visual cue */}
        {gndPour && (
          <rect
            x="10"
            y="10"
            width="406"
            height="320"
            rx="8"
            fill="#10B981"
            fillOpacity="0.16"
            stroke="#34D399"
            strokeDasharray="6 4"
          />
        )}

        <text x="20" y="30" fontSize="11" fontWeight="700" fill="#ECFDF5">
          CUSTOM ROBOT SHIELD PCB v1.0 (TOP + GND POUR)
        </text>

        {/* XT60 / Lipo Terminal -> TB6612 Power Trace */}
        <rect x="28" y="72" width="64" height="54" rx="5" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
        <text x="60" y="102" textAnchor="middle" fontSize="10" fontWeight="800" fill="#422006">
          7.4V IN
        </text>

        <line
          x1="92"
          y1="99"
          x2="262"
          y2="99"
          stroke={traceSafe ? '#F59E0B' : '#EF4444'}
          strokeWidth={tracePx}
          strokeLinecap="round"
        />
        <text
          x="177"
          y="80"
          textAnchor="middle"
          fontSize="9.5"
          fontFamily="monospace"
          fontWeight="700"
          fill={traceSafe ? '#FDE68A' : '#FCA5A5'}
        >
          모터 3A 전원 트레이스: {widthMm.toFixed(2)} mm {traceSafe ? '(안전)' : '🔥 과열!'}
        </text>

        <rect x="262" y="64" width="124" height="72" rx="6" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
        <text x="324" y="102" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
          TB6612 드라이버 IC
        </text>

        {/* ESP32 Footprint + 0.1uF Decoupling Cap Placement */}
        <rect x="136" y="178" width="144" height="106" rx="6" fill="#0F172A" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="208" y="232" textAnchor="middle" fontSize="11" fontWeight="700" fill="#F8FAFC">
          ESP32 MODULE
        </text>
        <circle cx="136" cy="202" r="5" fill="#FBBF24" />
        <text x="148" y="206" fontSize="8.5" fontFamily="monospace" fill="#FDE68A">
          3V3_VCC
        </text>

        {/* 0.1uF Ceramic Cap */}
        {decapClose ? (
          <g transform="translate(104, 192)">
            <rect x="0" y="0" width="22" height="14" rx="2" fill="#D97706" stroke="#FEF08A" />
            <line x1="22" y1="7" x2="32" y2="10" stroke="#FBBF24" strokeWidth="2.5" />
            <text x="-8" y="28" fontSize="8.5" fontFamily="monospace" fill="#6EE7B7">
              0.1µF (2mm OK)
            </text>
          </g>
        ) : (
          <g transform="translate(34, 260)">
            <rect x="0" y="0" width="22" height="14" rx="2" fill="#D97706" stroke="#FCA5A5" />
            <path d="M 22 7 L 78 7 L 78 202 L 102 202" fill="none" stroke="#EF4444" strokeWidth="1.8" strokeDasharray="3 3" />
            <text x="0" y="28" fontSize="8.5" fontFamily="monospace" fill="#FCA5A5">
              ✗ 0.1µF 너무 멂 (리플!)
            </text>
          </g>
        )}

        <text x="20" y="316" fontSize="10" fontWeight="700" fill={drcOk ? '#6EE7B7' : '#FDE68A'}>
          {drcOk
            ? '✓ DRC PASS: Gerber 파일 생성 & PCB 발주 준비 완료!'
            : 'DRC 점검 항목을 모두 초록색으로 맞춰 주세요.'}
        </text>
      </g>

      {/* Right DRC Rules Dashboard */}
      <g transform="translate(460, 20)">
        <rect x="0" y="0" width="220" height="340" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          KiCad DRC 안전 체크
        </text>

        <g transform="translate(16, 48)">
          <rect x="0" y="0" width="188" height="60" rx="7" fill="#1E293B" stroke={traceSafe ? '#10B981' : '#EF4444'} />
          <text x="12" y="22" fontSize="10" fontWeight="700" fill={traceSafe ? '#34D399' : '#FCA5A5'}>
            {traceSafe ? '✓' : '✗'} 3A 전원 선폭 ({widthMm.toFixed(2)}mm)
          </text>
          <text x="12" y="42" fontSize="9" fill="#CBD5E1">
            최소 1.4mm 이상 권장
          </text>
        </g>

        <g
          transform="translate(16, 122)"
          onClick={() => onChangePreview({ day43DecouplingClose: !decapClose })}
          className="cursor-pointer"
        >
          <rect x="0" y="0" width="188" height="60" rx="7" fill="#1E293B" stroke={decapClose ? '#10B981' : '#EF4444'} />
          <text x="12" y="22" fontSize="10" fontWeight="700" fill={decapClose ? '#34D399' : '#FCA5A5'}>
            {decapClose ? '✓' : '✗'} 0.1µF 디커플링 위치
          </text>
          <text x="12" y="42" fontSize="9" fill="#CBD5E1">
            {decapClose ? 'IC 핀 2mm 이내 직근 배치' : '멀리 떨어짐 (클릭 이동)'}
          </text>
        </g>

        <g
          transform="translate(16, 196)"
          onClick={() => onChangePreview({ day43GndPour: !gndPour })}
          className="cursor-pointer"
        >
          <rect x="0" y="0" width="188" height="60" rx="7" fill="#1E293B" stroke={gndPour ? '#10B981' : '#F59E0B'} />
          <text x="12" y="22" fontSize="10" fontWeight="700" fill={gndPour ? '#34D399' : '#FDE68A'}>
            {gndPour ? '✓' : '•'} 하단 GND Copper Pour
          </text>
          <text x="12" y="42" fontSize="9" fill="#CBD5E1">
            {gndPour ? '접지 플레인 완성 (EMI↓)' : '미적용 (클릭해 채우기)'}
          </text>
        </g>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 44: 5-Minute Divide & Conquer Robot Debugging + Motor EMI Suppression  */
/* -------------------------------------------------------------------------- */
export function Day44DebuggingScene({ preview, onChangePreview }: SceneProps) {
  const stage = preview.day44DebugStage;
  const emiSafe = preview.day44EmiFilterCaps;

  const steps: {
    id: LabPreviewState['day44DebugStage'];
    title: string;
    detail: string;
  }[] = [
    {
      id: 'power',
      title: '1. 전원 레일 & 공통 GND 점검',
      detail: '모터 뽑고 멀티미터로 5V=5.02V, 3V3=3.30V, 공통 GND(0Ω) 먼저 확인',
    },
    {
      id: 'boot',
      title: '2. 부팅 · 시리얼 Hello World',
      detail: '115200bps 시리얼에 "BOOT OK" 출력 확인 (Brownout/WDT 유무 판별)',
    },
    {
      id: 'i2c',
      title: '3. 모터 없이 I2C 스캐너 단독 확인',
      detail: 'i2c_scanner로 0x68(MPU6050) 혼자서는 100% 정상 응답하는지 격리 확인',
    },
    {
      id: 'emi',
      title: '4. 모터 부하 투입 + EMI 노이즈 격리',
      detail: '모터 켜자마자 I2C가 끊기면 브러시 스파크(EMI) → 0.1µF 캡 + 연선 적용!',
    },
  ];

  const activeInfo = steps.find((s) => s.id === stage) ?? steps[0];

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Top 4 Step Diagnostic Tabs */}
      <g transform="translate(20, 18)">
        {steps.map((s, idx) => {
          const active = stage === s.id;
          return (
            <g
              key={s.id}
              transform={`translate(${idx * 166}, 0)`}
              onClick={() => onChangePreview({ day44DebugStage: s.id })}
              className="cursor-pointer"
            >
              <rect
                x="0"
                y="0"
                width="158"
                height="28"
                rx="6"
                fill={active ? '#0A2540' : '#F7F8FA'}
                stroke={active ? '#0A2540' : '#E6E8EC'}
              />
              <text x="79" y="18" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={active ? '#FFFFFF' : '#425466'}>
                {s.title}
              </text>
            </g>
          );
        })}
      </g>

      {/* Left: Physical Isolation + Signal Wave */}
      <g transform="translate(20, 58)">
        <rect x="0" y="0" width="424" height="300" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11" fontWeight="700" fill="#F8FAFC">
          {activeInfo.title}
        </text>
        <text x="16" y="46" fontSize="9.5" fill="#94A3B8">
          {activeInfo.detail}
        </text>

        {/* I2C SDA Oscilloscope Line */}
        <rect x="16" y="68" width="392" height="148" rx="6" fill="#020617" stroke={stage === 'emi' && !emiSafe ? '#EF4444' : '#334155'} />
        <text x="26" y="88" fontSize="9.5" fontFamily="monospace" fill="#38BDF8">
          {stage === 'power'
            ? '3V3 Power Rail = 3.30V DC (리플 없음)'
            : stage === 'boot'
              ? 'UART TX0: "rst:0x1 · BOOT OK"'
              : stage === 'i2c'
                ? 'I2C SDA (모터 OFF): 0x68 ACK 깨끗!'
                : emiSafe
                  ? 'I2C SDA + 0.1µF 캡 & 연선 → 노이즈 제거 100% 복구!'
                  : 'I2C SDA (모터 ON · 필터 없음): 스파크 글리치로 ACK 깨짐!!'}
        </text>

        {stage === 'emi' && !emiSafe ? (
          <path
            d="M 28 156 L 60 156 L 65 110 L 72 195 L 82 120 L 96 188 L 114 156 L 144 156 L 150 105 L 160 198 L 175 156 L 230 156 L 238 112 L 248 192 L 310 156 L 320 116 L 332 195 L 392 156"
            fill="none"
            stroke="#EF4444"
            strokeWidth="2.4"
          />
        ) : (
          <path
            d="M 28 172 L 64 172 L 64 128 L 116 128 L 116 172 L 168 172 L 168 128 L 220 128 L 220 172 L 272 172 L 272 128 L 324 128 L 324 172 L 392 172"
            fill="none"
            stroke="#10B981"
            strokeWidth="2.6"
          />
        )}

        <text x="16" y="246" fontSize="10" fontWeight="700" fill={stage === 'emi' && !emiSafe ? '#FCA5A5' : '#34D399'}>
          {stage === 'emi' && !emiSafe
            ? '✗ 브러시 DC 모터 정류자 스파크가 고주파 방사 노이즈(EMI)를 I2C에 유기함'
            : '✓ 격리 검증 통과! 하위 계층 이상 없음'}
        </text>
      </g>

      {/* Right EMI Mitigation Toggle */}
      <g transform="translate(458, 58)">
        <rect x="0" y="0" width="220" height="300" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="16" y="28" fontSize="11" fontWeight="700" fill="#0A2540">
          하드웨어 EMI 노이즈 대책
        </text>

        <g
          onClick={() => onChangePreview({ day44EmiFilterCaps: !emiSafe })}
          className="cursor-pointer"
        >
          <rect
            x="16"
            y="48"
            width="188"
            height="40"
            rx="7"
            fill={emiSafe ? '#10B981' : '#EF4444'}
          />
          <text x="110" y="72" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
            {emiSafe ? '✓ 0.1µF 캡 + 연선 ON' : '⚠ 노이즈 대책 없음 (OFF)'}
          </text>
        </g>

        <rect x="16" y="106" width="188" height="176" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
        <text x="26" y="130" fontSize="10" fontWeight="700" fill="#0A2540">
          3대 EMI 방지 수칙
        </text>
        <text x="26" y="154" fontSize="9.5" fill="#425466">
          1. 모터 단자 간 0.1µF(104)
        </text>
        <text x="26" y="176" fontSize="9.5" fill="#425466">
          2. 모터 2선 서로 꽈배기 연선
        </text>
        <text x="26" y="198" fontSize="9.5" fill="#425466">
          3. Star Ground + Wire.setTimeOut
        </text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 45: Final Capstone — Autonomous Pick & Place Mobile Manipulator        */
/* -------------------------------------------------------------------------- */
export function Day45CapstoneScene({ preview, onChangePreview }: SceneProps) {
  const stage = preview.day45Stage;
  const tfOk = preview.day45TfVerified;
  const powerOk = preview.day45PowerSeparated;
  const missionFailed = !tfOk || !powerOk;

  const stageLabel: Record<LabPreviewState['day45Stage'], string> = {
    nav: '1. A* + EKF 목표 전진',
    vision: '2. ArUco PnP + TF2 변환',
    pick: '3. 2R IK + 토크 검증 파지',
    place: '4. 수송 및 바구니 안착 완료!',
  };

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Top Sequence Selector */}
      <g transform="translate(20, 18)">
        {[
          { id: 'nav' as const, label: '1. 자율 주행' },
          { id: 'vision' as const, label: '2. 비전+TF2' },
          { id: 'pick' as const, label: '3. IK 픽업' },
          { id: 'place' as const, label: '4. 목표 안착' },
        ].map((s, i) => {
          const active = stage === s.id;
          return (
            <g
              key={s.id}
              transform={`translate(${i * 166}, 0)`}
              onClick={() => onChangePreview({ day45Stage: s.id })}
              className="cursor-pointer"
            >
              <rect
                x="0"
                y="0"
                width="158"
                height="28"
                rx="6"
                fill={active ? '#635BFF' : '#F7F8FA'}
                stroke={active ? '#635BFF' : '#E6E8EC'}
              />
              <text x="79" y="18" textAnchor="middle" fontSize="10" fontWeight="700" fill={active ? '#FFFFFF' : '#425466'}>
                {s.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* Center Stage: Mobile Manipulator Illustration */}
      <g transform="translate(20, 58)">
        <rect x="0" y="0" width="430" height="300" rx="10" fill="#F8FAFC" stroke={missionFailed ? '#EF4444' : '#E2E8F0'} strokeWidth="2" />
        <line x1="20" y1="242" x2="410" y2="242" stroke="#94A3B8" strokeWidth="2" />

        {/* Mobile Rover Base */}
        <g transform={`translate(${stage === 'nav' ? 76 : stage === 'place' ? 245 : 172}, 190)`}>
          <rect x="0" y="0" width="84" height="36" rx="6" fill="#1E293B" />
          <circle cx="18" cy="40" r="12" fill="#334155" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="66" cy="40" r="12" fill="#334155" stroke="#38BDF8" strokeWidth="2" />
          {/* Mounted Camera */}
          <rect x="64" y="-12" width="16" height="12" rx="2" fill="#0EA5E9" />
          {/* 2-DOF Manipulator Arm */}
          <line
            x1="42"
            y1="0"
            x2={stage === 'pick' ? 88 : 56}
            y2={stage === 'pick' ? -30 : -46}
            stroke="#475569"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <line
            x1={stage === 'pick' ? 88 : 56}
            y1={stage === 'pick' ? -30 : -46}
            x2={stage === 'pick' ? 124 : 92}
            y2={stage === 'pick' ? 24 : -28}
            stroke="#635BFF"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Held Payload Box in Place Stage */}
          {stage === 'place' && !missionFailed && (
            <rect x="86" y="-26" width="18" height="18" rx="3" fill="#10B981" stroke="#FFFFFF" />
          )}
        </g>

        {/* Target ArUco Block / Basket */}
        {stage !== 'place' && (
          <g transform="translate(296, 214)">
            <rect x="0" y="0" width="28" height="28" rx="4" fill="#F59E0B" stroke="#78350F" />
            <text x="14" y="18" textAnchor="middle" fontSize="9" fontWeight="800" fill="#FFFFFF">
              AR
            </text>
          </g>
        )}
        <g transform="translate(344, 210)">
          <rect x="0" y="0" width="52" height="32" rx="4" fill="#EEF2FF" stroke="#635BFF" strokeWidth="2" />
          <text x="26" y="20" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#4338CA">
            투하 목표
          </text>
        </g>

        <text x="16" y="282" fontSize="10.5" fontWeight="700" fill={missionFailed ? '#DC2626' : '#059669'}>
          {!powerOk
            ? '✗ 중단: 팔+바퀴 동시 구동 시 전원 분리 미적용 → ESP32 Brownout 리셋!'
            : !tfOk
              ? '✗ 헛손질: camera→base_link TF2 변환 미적용 → 허공을 집음!'
              : `✓ ${stageLabel[stage]} (전 공학 도메인 정상 통합!)`}
        </text>
      </g>

      {/* Right Full-Stack Verification Checklist */}
      <g transform="translate(464, 58)">
        <rect x="0" y="0" width="214" height="300" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          45일 풀스택 시스템 점검
        </text>

        <g
          transform="translate(16, 48)"
          onClick={() => onChangePreview({ day45PowerSeparated: !powerOk })}
          className="cursor-pointer"
        >
          <rect x="0" y="0" width="182" height="58" rx="7" fill="#1E293B" stroke={powerOk ? '#10B981' : '#EF4444'} />
          <text x="12" y="22" fontSize="10" fontWeight="700" fill={powerOk ? '#34D399' : '#FCA5A5'}>
            {powerOk ? '✓' : '✗'} 전원 2레일 분리 (5V Buck)
          </text>
          <text x="12" y="40" fontSize="9" fill="#CBD5E1">
            로직/서보/바퀴 분리 OK
          </text>
        </g>

        <g
          transform="translate(16, 120)"
          onClick={() => onChangePreview({ day45TfVerified: !tfOk })}
          className="cursor-pointer"
        >
          <rect x="0" y="0" width="182" height="58" rx="7" fill="#1E293B" stroke={tfOk ? '#10B981' : '#EF4444'} />
          <text x="12" y="22" fontSize="10" fontWeight="700" fill={tfOk ? '#34D399' : '#FCA5A5'}>
            {tfOk ? '✓' : '✗'} TF2 좌표 변환 정합
          </text>
          <text x="12" y="40" fontSize="9" fill="#CBD5E1">
            camera → arm_base SE(3)
          </text>
        </g>

        <rect
          x="16"
          y="196"
          width="182"
          height="86"
          rx="8"
          fill={stage === 'place' && !missionFailed ? '#022C22' : '#020617'}
          stroke={stage === 'place' && !missionFailed ? '#10B981' : '#334155'}
        />
        <text x="26" y="220" fontSize="10.5" fontWeight="700" fill={stage === 'place' && !missionFailed ? '#6EE7B7' : '#38BDF8'}>
          {stage === 'place' && !missionFailed ? '🎓 45일 과정 완주 달성!' : '현재 단계: ' + stage.toUpperCase()}
        </text>
        <foreignObject x="26" y="228" width="162" height="48">
          <p className="text-[10px] leading-[1.45] text-[#CBD5E1]">
            하드웨어·펌웨어·기구학·제어·비전·자율주행 통합 검증 완료!
          </p>
        </foreignObject>
      </g>
    </svg>
  );
}
