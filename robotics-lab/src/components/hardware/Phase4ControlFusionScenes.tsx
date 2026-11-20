import { LabPreviewState } from '../../types/lab';

interface SceneProps {
  preview: LabPreviewState;
  onChangePreview: (patch: Partial<LabPreviewState>) => void;
}

/* -------------------------------------------------------------------------- */
/* Day 27: Quadrature Encoder (A/B Phase) & Wheel Odometry Drift Lab          */
/* -------------------------------------------------------------------------- */
export function Day27EncoderOdomScene({ preview, onChangePreview }: SceneProps) {
  const dir = preview.day27Direction;
  const rpm = preview.day27Rpm;
  const slip = preview.day27WheelSlipPct;

  const ppr = 11;
  const gear = 30;
  const quadTicksPerRev = ppr * 4 * gear; // 1320 ticks
  const freqHz = Math.round(((dir === 'stop' ? 0 : rpm) / 60) * quadTicksPerRev);

  // Simulate 10m drive trajectory drift due to wheel slip asymmetry
  const slipDeviationPx = (slip / 30) * 68;
  const estEndY = 230; // Estimator thinks it went straight along y=230
  const trueEndY = 230 - slipDeviationPx;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Top Quick Direction Switch */}
      <g transform="translate(22, 18)">
        {[
          { id: 'cw' as const, label: '정회전 (CW · A상 90° 선행)' },
          { id: 'ccw' as const, label: '역회전 (CCW · B상 90° 선행)' },
          { id: 'stop' as const, label: '정지 (STOP · 주파수 0 Hz)' },
        ].map((btn, i) => {
          const active = dir === btn.id;
          return (
            <g
              key={btn.id}
              transform={`translate(${i * 222}, 0)`}
              onClick={() => onChangePreview({ day27Direction: btn.id })}
              className="cursor-pointer"
            >
              <rect
                x="0"
                y="0"
                width="212"
                height="28"
                rx="6"
                fill={active ? '#0A2540' : '#F7F8FA'}
                stroke={active ? '#0A2540' : '#E6E8EC'}
              />
              <text
                x="106"
                y="18"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={active ? '#FFFFFF' : '#425466'}
              >
                {btn.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* Left: Quadrature A/B Oscilloscope */}
      <g transform="translate(22, 58)">
        <rect x="0" y="0" width="340" height="298" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11" fontWeight="700" fill="#F8FAFC">
          직교 엔코더 A/B상 오실로스코프 (4체배 디코딩)
        </text>
        <text x="16" y="44" fontSize="9.5" fontFamily="monospace" fill="#94A3B8">
          4× 해상도: {quadTicksPerRev} ticks/rev · 펄스: {freqHz} Hz
        </text>

        {/* Channel A */}
        <text x="16" y="84" fontSize="10" fontFamily="monospace" fontWeight="700" fill="#38BDF8">
          CH A
        </text>
        {dir === 'stop' ? (
          <line x1="62" y1="92" x2="322" y2="92" stroke="#38BDF8" strokeWidth="2.2" />
        ) : (
          <path
            d="M 62 92 L 78 92 L 78 68 L 126 68 L 126 92 L 174 92 L 174 68 L 222 68 L 222 92 L 270 92 L 270 68 L 318 68"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="2.4"
          />
        )}

        {/* Channel B shifted +90 deg (CW) or -90 deg (CCW) */}
        <text x="16" y="142" fontSize="10" fontFamily="monospace" fontWeight="700" fill="#34D399">
          CH B
        </text>
        {dir === 'stop' ? (
          <line x1="62" y1="150" x2="322" y2="150" stroke="#34D399" strokeWidth="2.2" />
        ) : dir === 'cw' ? (
          /* B lags A by 24px (90 deg) */
          <path
            d="M 62 150 L 102 150 L 102 126 L 150 126 L 150 150 L 198 150 L 198 126 L 246 126 L 246 150 L 294 150 L 294 126 L 318 126"
            fill="none"
            stroke="#34D399"
            strokeWidth="2.4"
          />
        ) : (
          /* B leads A by 24px (90 deg) */
          <path
            d="M 62 126 L 102 126 L 102 150 L 150 150 L 150 126 L 198 126 L 198 150 L 246 150 L 246 126 L 294 126 L 294 150 L 318 150"
            fill="none"
            stroke="#34D399"
            strokeWidth="2.4"
          />
        )}

        {/* 4x Edge Guides */}
        {dir !== 'stop' &&
          [78, 102, 126, 150, 174, 198, 222, 246].map((ex) => (
            <g key={ex}>
              <line x1={ex} y1="64" x2={ex} y2="174" stroke="#FBBF24" strokeOpacity="0.35" strokeDasharray="3 3" />
              <circle cx={ex} cy="174" r="2.5" fill="#FBBF24" />
            </g>
          ))}
        <text x="62" y="190" fontSize="9" fontFamily="monospace" fill="#FBBF24">
          ▲ 1주기마다 상승/하강 총 4개의 엣지(4×) 카운트!
        </text>

        {/* Direction Decode Summary Box */}
        <rect x="16" y="210" width="308" height="72" rx="7" fill="#020617" stroke="#334155" />
        <text x="26" y="232" fontSize="10.5" fontWeight="700" fill={dir === 'cw' ? '#38BDF8' : dir === 'ccw' ? '#FBBF24' : '#94A3B8'}>
          {dir === 'cw'
            ? '디코더 판정: 정회전 (+Ticks · A상 90° 먼저 상승)'
            : dir === 'ccw'
              ? '디코더 판정: 역회전 (-Ticks · B상 90° 먼저 상승)'
              : '디코더 판정: 정지 (ΔTicks = 0)'}
        </text>
        <text x="26" y="252" fontSize="9.5" fill="#CBD5E1">
          현재 바퀴 속도: {dir === 'stop' ? 0 : rpm} RPM ({dir === 'ccw' ? '-' : ''}
          {((rpm / 60) * 0.204).toFixed(2)} m/s)
        </text>
        <text x="26" y="268" fontSize="9" fontFamily="monospace" fill="#64748B">
          ESP32 PCNT 하드웨어 카운터로 인터럽트 부하 없이 계수
        </text>
      </g>

      {/* Right: Wheel Odometry Slip Drift Visualization */}
      <g transform="translate(376, 58)">
        <rect x="0" y="0" width="302" height="298" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="16" y="26" fontSize="11" fontWeight="700" fill="#0A2540">
          10m 주행 오도메트리 누적 오차(Drift)
        </text>

        {/* Grid Map */}
        <line x1="26" y1="230" x2="276" y2="230" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="276" y="244" textAnchor="end" fontSize="9" fontFamily="monospace" fill="#475569">
          로봇이 믿는 오도메트리 (10.0m, 0.0m)
        </text>

        {/* Actual Robot Path with Slip Divergence */}
        <path
          d={`M 32 230 Q 154 ${230 - slipDeviationPx * 0.25} 266 ${trueEndY}`}
          fill="none"
          stroke={slip > 10 ? '#EF4444' : '#10B981'}
          strokeWidth="3.2"
        />
        <circle cx="32" cy="230" r="5" fill="#0A2540" />
        <circle cx="266" cy={estEndY} r="5" fill="#94A3B8" />
        <circle cx="266" cy={trueEndY} r="6" fill={slip > 10 ? '#EF4444' : '#10B981'} />

        {/* Vertical Error Gap Line */}
        {slip > 2 && (
          <>
            <line x1="266" y1={estEndY} x2="266" y2={trueEndY} stroke="#EF4444" strokeWidth="2" strokeDasharray="3 2" />
            <text x="256" y={(estEndY + trueEndY) / 2} textAnchor="end" fontSize="10" fontWeight="700" fill="#DC2626">
              위치 오차 {(slip * 0.08).toFixed(2)}m!
            </text>
          </>
        )}

        <rect x="16" y="254" width="270" height="34" rx="6" fill="#FFFFFF" stroke="#E2E8F0" />
        <text x="24" y="274" fontSize="9.5" fill="#334155">
          {slip >= 15
            ? '⚠ 바퀴 슬립 심각 → IMU 자이로 융합(EKF) 필수!'
            : '미세한 각도(θ) 오차도 거리가 길어질수록 폭증합니다.'}
        </text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 28: MPU-6050 IMU Dissection — Accel Vibration vs Gyro Integration Drift*/
/* -------------------------------------------------------------------------- */
export function Day28ImuScene({ preview, onChangePreview }: SceneProps) {
  const trueDeg = preview.day28TrueAngleDeg;
  const vibG = preview.day28VibrationG;
  const bias = preview.day28GyroBiasDps;
  const calib = preview.day28Calibrated;

  const effectiveBias = calib ? bias * 0.04 : bias;

  // Build 10-second deterministic waveform points
  const n = 50;
  const mapY = (deg: number) => 176 - Math.max(-45, Math.min(45, deg)) * 2.2;

  const accPoints: string[] = [];
  const gyroPoints: string[] = [];

  for (let i = 0; i <= n; i++) {
    const tSec = (i / n) * 10; // 0 .. 10s
    const x = 24 + (i / n) * 380;
    const hfNoise =
      (Math.sin(i * 1.9) * 0.6 + Math.cos(i * 3.1) * 0.4) * vibG * 42;
    const accDeg = trueDeg + hfNoise;
    const gyroDeg = trueDeg + effectiveBias * tSec * 3.5;

    accPoints.push(`${x.toFixed(1)},${mapY(accDeg).toFixed(1)}`);
    gyroPoints.push(`${x.toFixed(1)},${mapY(gyroDeg).toFixed(1)}`);
  }

  const finalDrift = effectiveBias * 10 * 3.5;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Left: IMU Hardware Tilt Rig */}
      <g transform="translate(20, 20)">
        <rect x="0" y="0" width="224" height="340" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="14" y="24" fontSize="11" fontWeight="700" fill="#0A2540">
          MPU-6050 자세 &amp; 캘리브레이션
        </text>

        {/* Tilting Blue PCB Module */}
        <g transform={`translate(112, 130) rotate(${-trueDeg})`}>
          <rect x="-56" y="-22" width="112" height="44" rx="6" fill="#1D4ED8" stroke="#1E3A8A" strokeWidth="2" />
          <rect x="-14" y="-12" width="28" height="24" rx="2" fill="#0F172A" />
          <circle cx="-40" cy="0" r="4" fill="#FBBF24" />
          <circle cx="40" cy="0" r="4" fill="#FBBF24" />
          <text x="0" y="4" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#FFFFFF">
            MPU6050
          </text>
        </g>

        <text x="112" y="206" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="700" fill="#0A2540">
          실제 기울기: {trueDeg}°
        </text>
        <text x="112" y="224" textAnchor="middle" fontSize="9.5" fill={vibG > 0.25 ? '#D97706' : '#64748B'}>
          모터 진동: ±{vibG.toFixed(2)} g
        </text>

        {/* Calibration Button */}
        <g
          onClick={() => onChangePreview({ day28Calibrated: !calib })}
          className="cursor-pointer"
        >
          <rect
            x="16"
            y="246"
            width="192"
            height="34"
            rx="7"
            fill={calib ? '#10B981' : '#EF4444'}
          />
          <text x="112" y="267" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#FFFFFF">
            {calib ? '✓ 영점 캘리브레이션 적용됨' : '⚠ 바이어스 미보정 (클릭해 보정)'}
          </text>
        </g>

        <text x="112" y="304" textAnchor="middle" fontSize="9.5" fontFamily="monospace" fill="#475569">
          10초 후 자이로 누적 오차: {finalDrift >= 0 ? `+${finalDrift.toFixed(1)}` : finalDrift.toFixed(1)}°
        </text>
      </g>

      {/* Right: Oscilloscope Comparison */}
      <g transform="translate(258, 20)">
        <rect x="0" y="0" width="422" height="340" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          10초 시계열 비교: 가속도계(진동) vs 자이로 적분(드리프트)
        </text>

        {/* Legend */}
        <g transform="translate(16, 40)">
          <line x1="0" y1="6" x2="18" y2="6" stroke="#FFFFFF" strokeDasharray="3 3" strokeWidth="1.8" />
          <text x="24" y="10" fontSize="9.5" fill="#CBD5E1">실제 각도</text>

          <line x1="94" y1="6" x2="112" y2="6" stroke="#38BDF8" strokeWidth="2" />
          <text x="118" y="10" fontSize="9.5" fill="#38BDF8">가속도계 (진동 노이즈)</text>

          <line x1="250" y1="6" x2="268" y2="6" stroke="#F59E0B" strokeWidth="2.5" />
          <text x="274" y="10" fontSize="9.5" fill="#FBBF24">자이로 적분 (드리프트)</text>
        </g>

        {/* Plot Area */}
        <rect x="16" y="64" width="390" height="214" rx="6" fill="#020617" stroke="#334155" />
        <line
          x1="24"
          y1={mapY(trueDeg)}
          x2="404"
          y2={mapY(trueDeg)}
          stroke="#FFFFFF"
          strokeOpacity="0.45"
          strokeDasharray="4 4"
        />

        {/* Accel Polyline */}
        <polyline
          points={accPoints.join(' ')}
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1.6"
          strokeOpacity="0.85"
        />

        {/* Gyro Polyline */}
        <polyline
          points={gyroPoints.join(' ')}
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2.5"
        />

        <text x="16" y="302" fontSize="10" fill="#E2E8F0">
          • 가속도계는 평균값이 맞지만 진동(±{vibG.toFixed(2)}g) 때문에 순간 각도가 요동칩니다.
        </text>
        <text x="16" y="320" fontSize="10" fill={calib ? '#34D399' : '#FCA5A5'}>
          • {calib ? '영점 보정으로 자이로 드리프트가 대폭 억제되었습니다!' : '바이어스 미보정으로 자이로 각도가 10초 만에 크게 빗나갔습니다.'}
        </text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 29: LPF Phase Lag vs Complementary Sensor Fusion Oscilloscope          */
/* -------------------------------------------------------------------------- */
export function Day29SensorFusionScene({ preview, onChangePreview }: SceneProps) {
  const mode = preview.day29FilterMode;
  const alpha = preview.day29LpfAlpha;
  const gamma = preview.day29CfGyroWeight;

  // Simulate step tilt from 0° -> +30° at step=15 (out of 60 steps, dt=0.05s)
  const n = 60;
  const dt = 0.05;
  let lpfVal = 0;
  let gyroOnlyVal = 0;
  let compVal = 0;

  const truePts: string[] = [];
  const activePts: string[] = [];

  for (let i = 0; i <= n; i++) {
    const x = 24 + (i / n) * 412;
    const trueDeg = i < 15 ? 0 : 30;
    const trueOmega = i === 15 ? 30 / dt : 0; // impulse jump rate

    const accNoisy = trueDeg + Math.sin(i * 2.3) * 6.5 + Math.cos(i * 3.7) * 3.5;
    const gyroRate = trueOmega + 3.2; // 3.2 dps constant bias drift

    gyroOnlyVal += gyroRate * dt;
    lpfVal = alpha * lpfVal + (1 - alpha) * accNoisy;
    compVal = gamma * (compVal + gyroRate * dt) + (1 - gamma) * accNoisy;

    const chosen =
      mode === 'raw_acc'
        ? accNoisy
        : mode === 'gyro_only'
          ? gyroOnlyVal
          : mode === 'lpf'
            ? lpfVal
            : compVal;

    const mapY = (d: number) => 226 - Math.max(-12, Math.min(50, d)) * 3.2;
    truePts.push(`${x.toFixed(1)},${mapY(trueDeg).toFixed(1)}`);
    activePts.push(`${x.toFixed(1)},${mapY(chosen).toFixed(1)}`);
  }

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Top Filter Selector Tabs */}
      <g transform="translate(20, 18)">
        {[
          { id: 'raw_acc' as const, label: '① 가속도 원시 (진동)' },
          { id: 'gyro_only' as const, label: '② 자이로 단독 (드리프트)' },
          { id: 'lpf' as const, label: '③ 1차 LPF (위상 지연)' },
          { id: 'complementary' as const, label: '④ 상보 필터 (최적 퓨전)' },
        ].map((item, i) => {
          const active = mode === item.id;
          return (
            <g
              key={item.id}
              transform={`translate(${i * 166}, 0)`}
              onClick={() => onChangePreview({ day29FilterMode: item.id })}
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
              <text
                x="79"
                y="18"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill={active ? '#FFFFFF' : '#425466'}
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* Left Oscilloscope Plot */}
      <g transform="translate(20, 58)">
        <rect x="0" y="0" width="448" height="300" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11" fontWeight="700" fill="#F8FAFC">
          계단 기울기 응답 (0° → +30°) 필터링 파형 비교
        </text>
        <rect x="14" y="42" width="420" height="214" rx="6" fill="#020617" stroke="#334155" />

        <polyline
          points={truePts.join(' ')}
          fill="none"
          stroke="#94A3B8"
          strokeWidth="1.8"
          strokeDasharray="4 4"
        />
        <polyline
          points={activePts.join(' ')}
          fill="none"
          stroke={
            mode === 'complementary'
              ? '#10B981'
              : mode === 'lpf'
                ? '#38BDF8'
                : mode === 'gyro_only'
                  ? '#F59E0B'
                  : '#EF4444'
          }
          strokeWidth="2.8"
        />
        <text x="18" y="280" fontSize="9.5" fill="#CBD5E1">
          회색 점선 = 실제 기울기 (t=0.75s에 +30° 기울임) · 실선 = 선택 필터 출력
        </text>
      </g>

      {/* Right Verdict Dashboard */}
      <g transform="translate(480, 58)">
        <rect x="0" y="0" width="200" height="300" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="14" y="26" fontSize="11" fontWeight="700" fill="#0A2540">
          필터 성능 판정
        </text>

        <rect x="14" y="44" width="172" height="56" rx="7" fill="#FFFFFF" stroke="#E2E8F0" />
        <text x="24" y="64" fontSize="9.5" fill="#64748B">현재 파라메터</text>
        <text x="24" y="84" fontSize="12" fontFamily="monospace" fontWeight="700" fill="#635BFF">
          {mode === 'lpf'
            ? `α = ${alpha.toFixed(2)}`
            : mode === 'complementary'
              ? `γ = ${gamma.toFixed(2)} (Gyro)`
              : mode === 'raw_acc'
                ? '무필터 가속도'
                : '순수 적분'}
        </text>

        <rect x="14" y="114" width="172" height="170" rx="7" fill="#FFFFFF" stroke="#E2E8F0" />
        <text x="24" y="138" fontSize="10.5" fontWeight="700" fill="#0A2540">
          {mode === 'raw_acc'
            ? '✗ 진동 노이즈 과다'
            : mode === 'gyro_only'
              ? '✗ 시간에 따른 드리프트'
              : mode === 'lpf'
                ? '⚠ 시간 지연 (Phase Lag)'
                : '✓ 최적 응답 + 안정성'}
        </text>
        <foreignObject x="24" y="148" width="152" height="124">
          <p className="text-[10.5px] leading-[1.45] text-[#425466]">
            {mode === 'raw_acc'
              ? '평균 30°는 맞추지만 ±8° 진동이 그대로 남아 모터가 떨립니다.'
              : mode === 'gyro_only'
                ? '스텝 변화는 지연 없이 칼같이 따르지만 바이어스 때문에 점점 40° 이상으로 흘러갑니다.'
                : mode === 'lpf'
                  ? `α=${alpha.toFixed(2)}가 클수록 매끈해지지만 30°에 도달하는 데 한참 늦어집니다.`
                  : '자이로의 빠른 반응성과 가속도계의 장기 평균 정확성을 모두 취해 지연도 드리프트도 거의 없습니다!'}
          </p>
        </foreignObject>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 31: Advanced PID Troubleshooting (Anti-Windup, Deriv LPF, Stall Test)  */
/* -------------------------------------------------------------------------- */
export function Day31PidAdvancedScene({ preview }: SceneProps) {
  const {
    day31Kp: kp,
    day31Ki: ki,
    day31Kd: kd,
    day31AntiWindup: antiWindup,
    day31DerivLpf: derivLpf,
    day31DisturbanceStall: stallTest,
  } = preview;

  // Discrete plant simulation over 2.4s (120 steps at dt=0.02s)
  const steps = 120;
  const dt = 0.02;
  const uMax = 12.0;

  let y = 0;
  let v = 0;
  let integral = 0;
  let prevY = 0;
  let dFilt = 0;
  let maxY = 0;
  let maxI = 0;

  const yPts: string[] = [];
  const iPts: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i * dt;
    const setpoint = 1.0; // Normalized target 1.0 (= 90°)
    const measNoise = Math.sin(i * 2.9) * 0.015;
    const yMeas = y + measNoise;

    const err = setpoint - yMeas;
    const P = kp * err;

    const rawD = -kd * ((yMeas - prevY) / dt);
    dFilt = derivLpf ? 0.8 * dFilt + 0.2 * rawD : rawD;
    prevY = yMeas;

    const preOut = P + integral + dFilt;
    if (!antiWindup || Math.abs(preOut) < uMax || preOut * err < 0) {
      integral += ki * err * dt;
      if (antiWindup) {
        integral = Math.max(-uMax * 0.5, Math.min(uMax * 0.5, integral));
      }
    }

    const u = Math.max(-uMax, Math.min(uMax, P + integral + dFilt));

    // Mechanical hold stall between t=0.45s and t=1.15s if enabled
    const isStalled = stallTest && t >= 0.45 && t <= 1.15;
    if (isStalled) {
      v = 0;
      y = 0.25; // Held down physically by hand/obstacle
    } else {
      const accel = u * 3.8 - v * 4.2;
      v += accel * dt;
      y = Math.max(-0.5, Math.min(2.2, y + v * dt));
    }

    if (y > maxY) maxY = y;
    if (Math.abs(integral) > maxI) maxI = Math.abs(integral);

    const px = 22 + (i / steps) * 412;
    const py = 196 - Math.max(-0.2, Math.min(1.9, y)) * 86;
    const pi = 304 - Math.max(-1.0, Math.min(2.2, integral / uMax)) * 22;

    yPts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
    iPts.push(`${px.toFixed(1)},${pi.toFixed(1)}`);
  }

  const overshootPct = Math.max(0, (maxY - 1.0) * 100);
  const steadyErrPct = Math.abs(1.0 - y) * 100;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Left Main Oscilloscope */}
      <g transform="translate(18, 20)">
        <rect x="0" y="0" width="448" height="340" rx="10" fill="#0F172A" />
        <text x="16" y="24" fontSize="11" fontWeight="700" fill="#F8FAFC">
          실시간 스텝 응답 &amp; 적분 와인드업(Windup) 오실로스코프
        </text>

        {/* Disturbance Highlight Band */}
        {stallTest && (
          <g>
            <rect
              x={22 + (0.45 / 2.4) * 412}
              y="38"
              width={((1.15 - 0.45) / 2.4) * 412}
              height="182"
              fill="#EF4444"
              fillOpacity="0.16"
            />
            <text
              x={22 + (0.8 / 2.4) * 412}
              y="54"
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="#FCA5A5"
            >
              손으로 강제 구속 구간!
            </text>
          </g>
        )}

        {/* Plot Frame 1: Position Response */}
        <rect x="16" y="38" width="420" height="182" rx="6" fill="none" stroke="#334155" />
        {/* Target y=1.0 */}
        <line x1="22" y1="110" x2="434" y2="110" stroke="#F59E0B" strokeDasharray="4 4" strokeWidth="1.5" />
        <text x="26" y="104" fontSize="9" fontFamily="monospace" fill="#FBBF24">
          목표 Setpoint (1.0)
        </text>
        <polyline
          points={yPts.join(' ')}
          fill="none"
          stroke={overshootPct > 25 ? '#EF4444' : '#34D399'}
          strokeWidth="2.6"
        />

        {/* Plot Frame 2: Integral Accumulation */}
        <text x="16" y="240" fontSize="9.5" fontFamily="monospace" fill="#94A3B8">
          적분항 누적 크기 I(t) — Anti-Windup OFF 시 천장 돌파!
        </text>
        <rect x="16" y="248" width="420" height="76" rx="6" fill="#020617" stroke="#334155" />
        <polyline points={iPts.join(' ')} fill="none" stroke="#38BDF8" strokeWidth="2.2" />
      </g>

      {/* Right Diagnostic Metrics */}
      <g transform="translate(478, 20)">
        <rect x="0" y="0" width="202" height="340" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="14" y="26" fontSize="11" fontWeight="700" fill="#0A2540">
          제어 품질 진단
        </text>

        <g transform="translate(14, 44)">
          <rect x="0" y="0" width="174" height="62" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
          <text x="12" y="20" fontSize="9.5" fill="#64748B">최대 오버슈트 (Overshoot)</text>
          <text x="12" y="48" fontSize="17" fontFamily="monospace" fontWeight="700" fill={overshootPct > 20 ? '#DC2626' : '#059669'}>
            +{overshootPct.toFixed(1)}%
          </text>

          <rect x="0" y="72" width="174" height="62" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
          <text x="12" y="92" fontSize="9.5" fill="#64748B">최종 정상상태 오차 · 최대 적분 I</text>
          <text x="12" y="120" fontSize="14" fontFamily="monospace" fontWeight="700" fill="#0A2540">
            {steadyErrPct.toFixed(1)}% · I_max {maxI.toFixed(1)}
          </text>
        </g>

        <rect
          x="14"
          y="194"
          width="174"
          height="130"
          rx="8"
          fill={overshootPct > 25 ? '#FEF2F2' : '#ECFDF5'}
          stroke={overshootPct > 25 ? '#EF4444' : '#10B981'}
        />
        <text x="24" y="218" fontSize="10.5" fontWeight="700" fill={overshootPct > 25 ? '#B91C1C' : '#047857'}>
          {overshootPct > 25 ? '⚠ 적분 와인드업 폭주!' : '✓ 안정적 수렴 제어'}
        </text>
        <foreignObject x="24" y="226" width="154" height="88">
          <p className="text-[10.5px] leading-[1.45] text-[#334155]">
            {stallTest && !antiWindup
              ? '구속 구간에서 적분이 너무 많이 쌓여 구속 해제 후 목표를 크게 넘어섭니다. Anti-Windup을 켜보세요!'
              : derivLpf
                ? 'Anti-Windup 및 D-LPF 필터가 활성화되어 급격한 튀는 현상 없이 부드럽게 수렴합니다.'
                : 'D-term LPF가 꺼져 있으면 엔코더 계단 노이즈가 미세하게 증폭됩니다.'}
          </p>
        </foreignObject>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 32: Trapezoidal Velocity Profile & Pure Pursuit Path Tracking          */
/* -------------------------------------------------------------------------- */
export function Day32TrajectoryScene({ preview, onChangePreview }: SceneProps) {
  const mode = preview.day32Mode;
  const maxAccel = preview.day32MaxAccel;
  const ld = preview.day32LookaheadM;

  // Path tracking simulation depending on Lookahead L_d
  const oscAmp = ld < 0.35 ? (0.38 - ld) * 65 : 0;
  const cornerCut = ld > 0.9 ? (ld - 0.85) * 42 : 0;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Mode Switch */}
      <g transform="translate(22, 18)">
        {[
          { id: 'profile' as const, label: '① 사다리꼴 속도 프로파일 (가속 제한)' },
          { id: 'pursuit' as const, label: '② Pure Pursuit 경로 추종 (Lookahead L_d)' },
        ].map((m, i) => {
          const active = mode === m.id;
          return (
            <g
              key={m.id}
              transform={`translate(${i * 332}, 0)`}
              onClick={() => onChangePreview({ day32Mode: m.id })}
              className="cursor-pointer"
            >
              <rect
                x="0"
                y="0"
                width="320"
                height="28"
                rx="6"
                fill={active ? '#635BFF' : '#F7F8FA'}
                stroke={active ? '#635BFF' : '#E6E8EC'}
              />
              <text
                x="160"
                y="18"
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="700"
                fill={active ? '#FFFFFF' : '#425466'}
              >
                {m.label}
              </text>
            </g>
          );
        })}
      </g>

      {mode === 'profile' ? (
        <>
          <g transform="translate(22, 60)">
            <rect x="0" y="0" width="420" height="296" rx="10" fill="#0F172A" />
            <text x="16" y="26" fontSize="11" fontWeight="700" fill="#F8FAFC">
              사다리꼴 속도 v(t) 프로파일 (최대 가속도 a_max = {maxAccel.toFixed(1)} m/s²)
            </text>
            <rect x="18" y="48" width="384" height="210" rx="6" fill="#020617" stroke="#334155" />

            {/* Step jump (bad) */}
            <path d="M 36 226 L 36 88 L 340 88 L 340 226" fill="none" stroke="#EF4444" strokeDasharray="4 4" strokeWidth="1.6" />
            {/* Smooth Trapezoid */}
            {(() => {
              const rampPx = Math.max(20, Math.min(130, 140 / maxAccel));
              return (
                <path
                  d={`M 36 226 L ${36 + rampPx} 88 L ${340 - rampPx} 88 L 340 226`}
                  fill="#10B981"
                  fillOpacity="0.16"
                  stroke="#10B981"
                  strokeWidth="3"
                />
              );
            })()}
            <text x="36" y="280" fontSize="9.5" fill="#CBD5E1">
              빨간 점선 = 순간 점프(기어 충격/슬립) · 초록 실선 = 사다리꼴 가감속
            </text>
          </g>

          <g transform="translate(456, 60)">
            <rect x="0" y="0" width="222" height="296" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="16" y="28" fontSize="11" fontWeight="700" fill="#0A2540">
              가속 제한 효과
            </text>
            <foreignObject x="16" y="44" width="190" height="220">
              <p className="text-[11px] leading-[1.55] text-[#425466]">
                최대 가속도 a_max가 낮을수록(1.0~1.5 m/s²) 출발과 정지 램프 기울기가 완만해져 타이어 슬립이나 서보 기어 백래시 충격 없이 부드럽게 목표 거리에 안착합니다.
              </p>
            </foreignObject>
          </g>
        </>
      ) : (
        <>
          <g transform="translate(22, 60)">
            <rect x="0" y="0" width="420" height="296" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="16" y="24" fontSize="11" fontWeight="700" fill="#0A2540">
              Pure Pursuit 경로 추종 (Lookahead L_d = {ld.toFixed(2)} m)
            </text>

            {/* Target Sharp 90-degree Corner Path */}
            <polyline
              points="44,240 210,240 210,96 382,96"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="3"
              strokeDasharray="6 4"
            />

            {/* Robot Tracked Trajectory */}
            {ld < 0.35 ? (
              <path
                d={`M 44 240 Q 90 ${240 - oscAmp} 135 240 T 210 240 Q ${210 + oscAmp} 170 210 130 T 210 96 Q 290 ${96 - oscAmp} 382 96`}
                fill="none"
                stroke="#EF4444"
                strokeWidth="3"
              />
            ) : ld > 0.9 ? (
              <path
                d={`M 44 240 Q ${210 - cornerCut * 1.4} ${240 - cornerCut * 0.2} ${210 - cornerCut * 0.4} ${168 - cornerCut * 0.3} T 382 96`}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="3"
              />
            ) : (
              <path
                d="M 44 240 L 180 240 Q 210 240 210 210 L 210 126 Q 210 96 240 96 L 382 96"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
              />
            )}

            {/* Lookahead Circle Illustration */}
            <circle cx="152" cy="240" r={Math.max(18, ld * 68)} fill="#635BFF" fillOpacity="0.1" stroke="#635BFF" strokeDasharray="4 3" />
            <circle cx="152" cy="240" r="7" fill="#0A2540" />
            <circle cx={Math.min(210, 152 + ld * 68)} cy={240 - Math.max(0, 152 + ld * 68 - 210)} r="5" fill="#635BFF" />
            <text x="152" y="276" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#4338CA">
              반경 L_d 원이 경로와 만나는 전방 주시점(보라색) 추적
            </text>
          </g>

          <g transform="translate(456, 60)">
            <rect x="0" y="0" width="222" height="296" rx="10" fill="#0F172A" />
            <text x="16" y="26" fontSize="11" fontWeight="700" fill="#F8FAFC">
              Lookahead L_d 튜닝 진단
            </text>
            <rect x="16" y="48" width="190" height="72" rx="7" fill="#1E293B" />
            <text x="26" y="72" fontSize="10" fill="#94A3B8">상태</text>
            <text x="26" y="98" fontSize="12" fontWeight="700" fill={ld < 0.35 ? '#F87171' : ld > 0.9 ? '#FBBF24' : '#34D399'}>
              {ld < 0.35
                ? '✗ 진동 발생 (L_d 과소)'
                : ld > 0.9
                  ? '⚠ 코너 컷팅 (L_d 과다)'
                  : '✓ 매끄러운 최적 추종'}
            </text>
            <foreignObject x="16" y="136" width="190" height="140">
              <p className="text-[10.5px] leading-[1.5] text-[#CBD5E1]">
                {ld < 0.35
                  ? 'L_d가 너무 짧아 작은 오차에도 ω=2v·sin(α)/L_d 값이 크게 치솟아 좌우로 진동합니다.'
                  : ld > 0.9
                    ? '너무 먼 점을 보고 먼저 핸들을 꺾어 모서리 안쪽을 크게 잘라먹습니다(코너 장애물 충돌 주의).'
                    : '적정 전방 주시 거리는 차체 길이의 약 1.5~2.5배 범위로 코너 추종과 안정성의 균형이 잡힙니다.'}
              </p>
            </foreignObject>
          </g>
        </>
      )}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 33: Kalman Filter Gaussian Fusion (Predict Q vs Measurement R)         */
/* -------------------------------------------------------------------------- */
export function Day33KalmanScene({ preview }: SceneProps) {
  const Q = preview.day33ProcessQ;
  const R = preview.day33MeasureR;

  const predMean = 4.2;
  const measMean = 5.6;
  const Ppred = 0.25 + Q;
  const K = Ppred / (Ppred + R);
  const postMean = predMean + K * (measMean - predMean);
  const postVar = (1 - K) * Ppred;

  const gaussianPath = (mean: number, variance: number, scaleY: number) => {
    const std = Math.sqrt(Math.max(0.05, variance));
    const pts: string[] = [];
    for (let i = 0; i <= 70; i++) {
      const val = 1.5 + (i / 70) * 6.5; // x range [1.5 .. 8.0]
      const px = 22 + (i / 70) * 392;
      const pdf =
        Math.exp(-0.5 * ((val - mean) / std) ** 2) /
        (std * Math.sqrt(2 * Math.PI));
      const py = 258 - Math.min(180, pdf * scaleY);
      pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
    }
    return pts.join(' ');
  };

  const predPts = gaussianPath(predMean, Ppred, 125);
  const measPts = gaussianPath(measMean, R, 125);
  const postPts = gaussianPath(postMean, postVar, 125);

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Left Gaussian Distribution Curves */}
      <g transform="translate(18, 20)">
        <rect x="0" y="0" width="436" height="340" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#0A2540">
          가우시안 확률 밀도 융합: 예측(Q) × 관측(R) → 사후 추정
        </text>

        <line x1="22" y1="258" x2="414" y2="258" stroke="#94A3B8" strokeWidth="1.5" />

        {/* Predict Gaussian (Amber) */}
        <polyline points={predPts} fill="none" stroke="#F59E0B" strokeWidth="2.4" strokeDasharray="5 3" />
        {/* Measurement Gaussian (Blue) */}
        <polyline points={measPts} fill="none" stroke="#0EA5E9" strokeWidth="2.4" strokeDasharray="5 3" />
        {/* Posterior Fused Gaussian (Purple) */}
        <polyline points={postPts} fill="none" stroke="#635BFF" strokeWidth="3.4" />

        {/* Mean Markers */}
        <circle cx={22 + ((predMean - 1.5) / 6.5) * 392} cy="258" r="5" fill="#F59E0B" />
        <circle cx={22 + ((measMean - 1.5) / 6.5) * 392} cy="258" r="5" fill="#0EA5E9" />
        <circle cx={22 + ((postMean - 1.5) / 6.5) * 392} cy="258" r="7" fill="#635BFF" />

        <text x="22" y="288" fontSize="9.5" fontWeight="700" fill="#D97706">
          주황 점선 = 예측 분포 (x̂⁻={predMean}, P⁻={Ppred.toFixed(2)})
        </text>
        <text x="22" y="306" fontSize="9.5" fontWeight="700" fill="#0284C7">
          하늘 점선 = 센서 관측 (z={measMean}, R={R.toFixed(2)})
        </text>
        <text x="22" y="324" fontSize="9.5" fontWeight="700" fill="#4338CA">
          보라 실선 = 칼만 추정 (x̂={postMean.toFixed(2)}, P={postVar.toFixed(2)} 가장 뾰족!)
        </text>
      </g>

      {/* Right Kalman Gain Dashboard */}
      <g transform="translate(468, 20)">
        <rect x="0" y="0" width="212" height="340" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          칼만 이득(Kalman Gain) K
        </text>

        <rect x="16" y="46" width="180" height="82" rx="8" fill="#1E293B" />
        <text x="26" y="68" fontSize="9.5" fill="#94A3B8">K = P⁻ / (P⁻ + R)</text>
        <text x="26" y="106" fontSize="24" fontFamily="monospace" fontWeight="700" fill="#34D399">
          {K.toFixed(3)}
        </text>

        {/* Visual Trust Balance Bar */}
        <text x="16" y="154" fontSize="9.5" fontFamily="monospace" fill="#CBD5E1">
          예측 신뢰 ↔ 센서 관측 신뢰 비율
        </text>
        <rect x="16" y="164" width="180" height="14" rx="7" fill="#F59E0B" />
        <rect x="16" y="164" width={180 * K} height="14" rx="7" fill="#0EA5E9" />
        <text x="16" y="192" fontSize="8.5" fill="#7DD3FC">센서 {Math.round(K * 100)}%</text>
        <text x="196" y="192" textAnchor="end" fontSize="8.5" fill="#FCD34D">모델 {Math.round((1 - K) * 100)}%</text>

        <rect x="16" y="210" width="180" height="114" rx="8" fill="#020617" stroke="#334155" />
        <text x="26" y="232" fontSize="10.5" fontWeight="700" fill="#F8FAFC">
          {K > 0.7
            ? '센서 측정 적극 신뢰 (K > 0.7)'
            : K < 0.3
              ? '물리 예측 모델 신뢰 (K < 0.3)'
              : '균형 잡힌 센서 퓨전 상태'}
        </text>
        <foreignObject x="26" y="240" width="160" height="76">
          <p className="text-[10.5px] leading-[1.45] text-[#CBD5E1]">
            {K > 0.7
              ? '센서 노이즈 R이 작아 관측값 쪽으로 추정 중심이 바짝 당겨집니다.'
              : K < 0.3
                ? '센서 노이즈 R이 커서 노이즈를 거르고 예측 모델을 믿습니다.'
                : '예측 분산과 측정 분산을 수학적으로 곱해 분산 P가 둘 다보다 작아졌습니다.'}
          </p>
        </foreignObject>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 34: Phase 4 Capstone — Encoder + IMU Straight-Line Fusion Rover        */
/* -------------------------------------------------------------------------- */
export function Day34FusionProjectScene({ preview }: SceneProps) {
  const mismatch = preview.day34MotorMismatchPct;
  const encPid = preview.day34EncoderPid;
  const imuPid = preview.day34ImuHeadingPid;

  // Calculate 3.0m path lateral drift (cm) across control modes
  const openLoopDriftCm = mismatch * 4.2; // e.g., 12% mismatch -> 50.4 cm drift!
  const encOnlyDriftCm = mismatch * 0.9; // tire radius tolerance remains
  const fullFusionDriftCm = 0.8; // corrected to < 1cm

  const activeDriftCm =
    !encPid && !imuPid
      ? openLoopDriftCm
      : encPid && !imuPid
        ? encOnlyDriftCm
        : !encPid && imuPid
          ? mismatch * 0.55
          : fullFusionDriftCm;

  const endDeviationPx = Math.min(92, activeDriftCm * 1.45);
  const pathColor =
    !encPid && !imuPid ? '#EF4444' : encPid && imuPid ? '#10B981' : '#F59E0B';

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Left Top-Down 3.0m Straight Track */}
      <g transform="translate(20, 20)">
        <rect x="0" y="0" width="430" height="340" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#0A2540">
          3.0m 직진 테스트 트랙 (좌/우 모터 하드웨어 편차 {mismatch}%)
        </text>

        {/* Safe Corridor Walls */}
        <rect x="28" y="76" width="374" height="190" rx="4" fill="#FFFFFF" stroke="#CBD5E1" />
        <line x1="28" y1="86" x2="402" y2="86" stroke="#EF4444" strokeDasharray="4 4" strokeWidth="1.5" />
        <line x1="28" y1="256" x2="402" y2="256" stroke="#EF4444" strokeDasharray="4 4" strokeWidth="1.5" />
        <text x="40" y="70" fontSize="9" fontWeight="700" fill="#DC2626">
          트랙 벽 경계 (이탈 시 충돌!)
        </text>

        {/* Center Target Reference Line */}
        <line x1="40" y1="171" x2="386" y2="171" stroke="#94A3B8" strokeDasharray="5 4" strokeWidth="1.5" />
        <circle cx="386" cy="171" r="10" fill="none" stroke="#10B981" strokeWidth="2" />
        <text x="386" y="196" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="700" fill="#059669">
          목표 (3.00m)
        </text>

        {/* Simulated Rover Path */}
        <path
          d={`M 48 171 Q 210 ${171 - endDeviationPx * 0.3} 386 ${171 - endDeviationPx}`}
          fill="none"
          stroke={pathColor}
          strokeWidth="3.5"
        />

        {/* Rover Position at End */}
        <rect
          x="374"
          y={171 - endDeviationPx - 11}
          width="24"
          height="22"
          rx="4"
          fill="#1E293B"
          stroke={pathColor}
          strokeWidth="2"
        />

        <text x="16" y="302" fontSize="10.5" fontWeight="700" fill={pathColor}>
          최종 횡방향 편차: {activeDriftCm.toFixed(1)} cm{' '}
          {activeDriftCm > 30 ? '→ 개루프 휨 벽 충돌 위험!' : activeDriftCm <= 2 ? '→ 자처럼 반듯한 직진 성공!' : '→ 미세 편향 존재'}
        </text>
        <text x="16" y="322" fontSize="9.5" fill="#64748B">
          내부: 좌우 엔코더 속도 PID (100Hz) · 외부: IMU Yaw 상보 필터 각도 보정 루프
        </text>
      </g>

      {/* Right Control Architecture Checklist */}
      <g transform="translate(464, 20)">
        <rect x="0" y="0" width="216" height="340" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          2단 퓨전 제어 루프 상태
        </text>

        <g transform="translate(16, 48)">
          <rect
            x="0"
            y="0"
            width="184"
            height="68"
            rx="8"
            fill="#1E293B"
            stroke={encPid ? '#10B981' : '#EF4444'}
          />
          <text x="12" y="22" fontSize="10" fontWeight="700" fill={encPid ? '#34D399' : '#FCA5A5'}>
            ① 엔코더 속도 PID: {encPid ? 'ON' : 'OFF'}
          </text>
          <text x="12" y="42" fontSize="9" fill="#CBD5E1">
            {encPid ? '좌우 모터 RPM 마찰 편차 1차 제거' : '동일 PWM 인가 → 왼쪽/오른쪽 속도 다름'}
          </text>

          <rect
            x="0"
            y="82"
            width="184"
            height="68"
            rx="8"
            fill="#1E293B"
            stroke={imuPid ? '#10B981' : '#EF4444'}
          />
          <text x="12" y="104" fontSize="10" fontWeight="700" fill={imuPid ? '#34D399' : '#FCA5A5'}>
            ② IMU Yaw 보정 루프: {imuPid ? 'ON' : 'OFF'}
          </text>
          <text x="12" y="124" fontSize="9" fill="#CBD5E1">
            {imuPid ? 'θ_err = 0 유지 → 바퀴 슬립 편향 복원' : '타이어 마모/슬립 누적 시 계속 휘어짐'}
          </text>
        </g>

        <rect x="16" y="222" width="184" height="98" rx="8" fill="#020617" stroke="#334155" />
        <text x="26" y="246" fontSize="10" fontFamily="monospace" fontWeight="700" fill="#38BDF8">
          v_L = vBase - Kp_yaw * θ
        </text>
        <text x="26" y="264" fontSize="10" fontFamily="monospace" fontWeight="700" fill="#38BDF8">
          v_R = vBase + Kp_yaw * θ
        </text>
        <text x="26" y="288" fontSize="9.5" fill="#94A3B8">
          마지막 0.5m는 √(2·a·d_rem) 감속
        </text>
      </g>
    </svg>
  );
}
