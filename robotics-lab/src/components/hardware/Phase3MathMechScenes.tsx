import { LabPreviewState } from '../../types/lab';

interface SceneProps {
  preview: LabPreviewState;
  onChangePreview: (patch: Partial<LabPreviewState>) => void;
}

/* -------------------------------------------------------------------------- */
/* Day 17: Radians vs Degrees, atan vs atan2 Quadrant Trap, Dot/Cross Vectors */
/* -------------------------------------------------------------------------- */
export function Day17MathScene({ preview, onChangePreview }: SceneProps) {
  const mode = preview.day17Mode;
  const tx = preview.day17TargetX;
  const ty = preview.day17TargetY;
  const useAtan2 = preview.day17UseAtan2;
  const vecAngle = preview.day17VecAngleDeg;

  const r = Math.hypot(tx, ty);
  const atan2Deg = (Math.atan2(ty, tx) * 180) / Math.PI;
  const naiveAtanDeg =
    Math.abs(tx) < 0.05
      ? ty >= 0
        ? 90
        : -90
      : (Math.atan(ty / tx) * 180) / Math.PI;
  const shownDeg = useAtan2 ? atan2Deg : naiveAtanDeg;
  const shownRad = (shownDeg * Math.PI) / 180;
  const wrongQuadrant = !useAtan2 && tx < 0;

  // Map math (-10..10) to SVG circle center (178, 196), radius scale 12px/unit
  const cx = 178;
  const cy = 196;
  const px = cx + tx * 11;
  const py = cy - ty * 11;
  const headingX = cx + Math.cos(shownRad) * 98;
  const headingY = cy - Math.sin(shownRad) * 98;

  // Vector mode math
  const vRad = (vecAngle * Math.PI) / 180;
  const dot = Math.cos(vRad);
  const crossZ = Math.sin(vRad);

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Top Mode Strip */}
      <g transform="translate(22, 18)">
        {[
          { id: 'angle' as const, label: '① atan(y/x) vs atan2(y,x) 사분면 비교' },
          { id: 'vector' as const, label: '② 벡터 내적(정렬도) & 외적(회전 방향)' },
        ].map((item, i) => {
          const active = mode === item.id;
          return (
            <g
              key={item.id}
              transform={`translate(${i * 332}, 0)`}
              onClick={() => onChangePreview({ day17Mode: item.id })}
              className="cursor-pointer"
            >
              <rect
                x="0"
                y="0"
                width="320"
                height="28"
                rx="6"
                fill={active ? '#0A2540' : '#F7F8FA'}
                stroke={active ? '#0A2540' : '#E6E8EC'}
              />
              <text
                x="160"
                y="18"
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="700"
                fill={active ? '#FFFFFF' : '#425466'}
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </g>

      {mode === 'angle' ? (
        <>
          {/* Left Coordinate Plane */}
          <g>
            <rect x="24" y="58" width="308" height="296" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            {/* Axes */}
            <line x1="44" y1={cy} x2="312" y2={cy} stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1={cx} y1="76" x2={cx} y2="334" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r="98" fill="none" stroke="#E2E8F0" strokeDasharray="4 4" />
            <text x="304" y={cy - 6} fontSize="9.5" fontFamily="monospace" fill="#64748B">+X</text>
            <text x={cx + 6} y="88" fontSize="9.5" fontFamily="monospace" fill="#64748B">+Y</text>

            {/* Quadrant Labels */}
            <text x="278" y="96" fontSize="9" fill="#94A3B8">Q1 (+,+)</text>
            <text x="48" y="96" fontSize="9" fill="#94A3B8">Q2 (-,+)</text>
            <text x="48" y="324" fontSize="9" fill="#94A3B8">Q3 (-,-)</text>
            <text x="278" y="324" fontSize="9" fill="#94A3B8">Q4 (+,-)</text>

            {/* Target Coordinate */}
            <line x1={cx} y1={cy} x2={px} y2={py} stroke="#94A3B8" strokeDasharray="3 3" />
            <circle cx={px} cy={py} r="7" fill="#635BFF" />
            <text x={px + 10} y={py - 6} fontSize="10" fontFamily="monospace" fontWeight="700" fill="#4338CA">
              Target ({tx}, {ty})
            </text>

            {/* Computed Heading Arrow */}
            <line
              x1={cx}
              y1={cy}
              x2={headingX}
              y2={headingY}
              stroke={wrongQuadrant ? '#EF4444' : '#10B981'}
              strokeWidth="3.5"
            />
            <circle cx={headingX} cy={headingY} r="5" fill={wrongQuadrant ? '#EF4444' : '#10B981'} />
            <text
              x={cx}
              y="346"
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill={wrongQuadrant ? '#DC2626' : '#059669'}
            >
              {wrongQuadrant
                ? '⚠ 180° 정반대 방향 조준 (기구물 충돌!)'
                : '✓ 목표 방향 정확히 조준 완료'}
            </text>
          </g>

          {/* Right Comparison Dashboard */}
          <g transform="translate(348, 58)">
            <rect x="0" y="0" width="330" height="296" rx="10" fill="#0F172A" />
            <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
              사분면 각도 &amp; 라디안 변환 실시간 비교
            </text>

            <g
              onClick={() => onChangePreview({ day17UseAtan2: !useAtan2 })}
              className="cursor-pointer"
            >
              <rect
                x="16"
                y="40"
                width="298"
                height="30"
                rx="6"
                fill={useAtan2 ? '#10B981' : '#EF4444'}
              />
              <text x="165" y="59" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#FFFFFF">
                {useAtan2 ? '현재: atan2(y, x) 사용 중 (클릭해 atan 테스트)' : '현재: atan(y/x) 함정 상태 (클릭해 atan2 복구)'}
              </text>
            </g>

            <g transform="translate(16, 86)">
              <rect x="0" y="0" width="144" height="68" rx="7" fill="#1E293B" />
              <text x="12" y="20" fontSize="9.5" fill="#94A3B8">계산된 각도 (deg)</text>
              <text x="12" y="48" fontSize="17" fontFamily="monospace" fontWeight="700" fill={wrongQuadrant ? '#F87171' : '#34D399'}>
                {shownDeg.toFixed(1)}°
              </text>

              <rect x="154" y="0" width="144" height="68" rx="7" fill="#1E293B" />
              <text x="166" y="20" fontSize="9.5" fill="#94A3B8">라디안 (rad)</text>
              <text x="166" y="48" fontSize="17" fontFamily="monospace" fontWeight="700" fill="#38BDF8">
                {shownRad.toFixed(2)}
              </text>
            </g>

            <rect x="16" y="170" width="298" height="110" rx="7" fill="#020617" stroke={wrongQuadrant ? '#EF4444' : '#334155'} />
            <text x="26" y="192" fontSize="10" fontFamily="monospace" fontWeight="700" fill="#FBBF24">
              실제 거리 r = √({tx}² + {ty}²) = {r.toFixed(2)}
            </text>
            <text x="26" y="214" fontSize="10" fontFamily="monospace" fill="#CBD5E1">
              atan2({ty}, {tx}) = {atan2Deg.toFixed(1)}°
            </text>
            <text x="26" y="234" fontSize="10" fontFamily="monospace" fill="#F87171">
              atan({ty}/{tx}) = {naiveAtanDeg.toFixed(1)}°
            </text>
            <text x="26" y="260" fontSize="9.5" fill="#94A3B8">
              x &lt; 0 일 때 나눗셈 부호가 상쇄되어 180° 오차가 발생합니다.
            </text>
          </g>
        </>
      ) : (
        <>
          {/* Vector Dot & Cross Product Visual */}
          <g transform="translate(24, 58)">
            <rect x="0" y="0" width="308" height="296" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <line x1="36" y1="220" x2="280" y2="220" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="154" y1="70" x2="154" y2="268" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Reference Vector a (Robot Heading +X) */}
            <line x1="154" y1="220" x2="262" y2="220" stroke="#0EA5E9" strokeWidth="4" />
            <circle cx="262" cy="220" r="5" fill="#0EA5E9" />
            <text x="242" y="240" fontSize="10" fontWeight="700" fill="#0284C7">
              a (전방 기준)
            </text>

            {/* Target Vector b rotated by vecAngle */}
            <line
              x1="154"
              y1="220"
              x2={154 + Math.cos(vRad) * 108}
              y2={220 - Math.sin(vRad) * 108}
              stroke="#635BFF"
              strokeWidth="4"
            />
            <circle
              cx={154 + Math.cos(vRad) * 108}
              cy={220 - Math.sin(vRad) * 108}
              r="5"
              fill="#635BFF"
            />
            <text
              x={154 + Math.cos(vRad) * 116}
              y={220 - Math.sin(vRad) * 116 - 4}
              fontSize="10"
              fontWeight="700"
              fill="#4338CA"
            >
              b ({vecAngle}°)
            </text>

            {/* Dot Projection */}
            <line
              x1={154 + Math.cos(vRad) * 108}
              y1={220 - Math.sin(vRad) * 108}
              x2={154 + Math.cos(vRad) * 108}
              y2="220"
              stroke="#10B981"
              strokeDasharray="3 3"
              strokeWidth="1.8"
            />
            <line
              x1="154"
              y1="224"
              x2={154 + Math.cos(vRad) * 108}
              y2="224"
              stroke="#10B981"
              strokeWidth="4"
            />
            <text x="154" y="284" textAnchor="middle" fontSize="10" fill="#059669" fontWeight="700">
              초록 막대 = b를 전방축에 투영한 내적 크기 ({dot.toFixed(2)})
            </text>
          </g>

          <g transform="translate(348, 58)">
            <rect x="0" y="0" width="330" height="296" rx="10" fill="#0F172A" />
            <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
              내적(Dot) &amp; 외적(Cross Z) 실시간 계측
            </text>

            <g transform="translate(16, 48)">
              <rect x="0" y="0" width="144" height="82" rx="8" fill="#1E293B" />
              <text x="12" y="22" fontSize="9.5" fill="#94A3B8">내적 a·b = cos θ</text>
              <text x="12" y="52" fontSize="20" fontFamily="monospace" fontWeight="700" fill="#34D399">
                {dot.toFixed(3)}
              </text>
              <text x="12" y="70" fontSize="9" fill="#CBD5E1">
                {Math.abs(dot) < 0.05 ? '직교 (정렬 0)' : dot > 0 ? '같은 전방 반구' : '뒤편 반구'}
              </text>

              <rect x="154" y="0" width="144" height="82" rx="8" fill="#1E293B" />
              <text x="166" y="22" fontSize="9.5" fill="#94A3B8">외적 (a×b)z = sin θ</text>
              <text x="166" y="52" fontSize="20" fontFamily="monospace" fontWeight="700" fill="#FBBF24">
                {crossZ.toFixed(3)}
              </text>
              <text x="166" y="70" fontSize="9" fill="#CBD5E1">
                {crossZ > 0.05 ? 'CCW 좌회전(+) 토크' : '일직선 정렬'}
              </text>
            </g>

            <rect x="16" y="150" width="298" height="128" rx="8" fill="#020617" stroke="#334155" />
            <text x="26" y="176" fontSize="10.5" fontWeight="700" fill="#F8FAFC">
              자율주행 조향 &amp; 물리 직관
            </text>
            <foreignObject x="26" y="186" width="278" height="80">
              <p className="text-[11px] leading-[1.5] text-[#CBD5E1]">
                목표 지점이 정면에서 왼쪽 90°(θ=90°)에 있을 때 전방 정렬도(내적)는 0.0이 되고, 반시계 회전 방향을 가리키는 외적(sin 90°)이 최대치 +1.0이 되어 최대 좌회전 토크를 냅니다.
              </p>
            </foreignObject>
          </g>
        </>
      )}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 19: CAD & 3D Printing Reality Tolerance Section View Bench             */
/* -------------------------------------------------------------------------- */
export function Day19CadToleranceScene({ preview, onChangePreview }: SceneProps) {
  const clear = preview.day19HoleClearanceMm;
  const wall = preview.day19WallThickMm;
  const nozzleWidth = 0.4;
  const wallLines = Math.round(wall / nozzleWidth);
  const isMultiple = Math.abs(wall - wallLines * nozzleWidth) < 0.02;

  // Real printed hole loses ~0.18mm diameter from PLA shrinkage / line squishing
  const shrinkageMm = 0.18;
  const cadDiameter = 5.0 + clear;
  const actualPrintedHole = Math.max(4.4, cadDiameter - shrinkageMm);
  const gapEachSide = (actualPrintedHole - 5.0) / 2;

  const fitStatus =
    actualPrintedHole < 4.96
      ? { label: '조립 불가 (간섭/파손 위험)', color: '#EF4444', bg: '#FEF2F2' }
      : actualPrintedHole <= 5.08
        ? { label: '억지 끼움 (Press Fit · 망치/열 압입)', color: '#D97706', bg: '#FFFBEB' }
        : actualPrintedHole <= 5.35
          ? { label: '최적 슬라이딩/회전 맞춤 (Clearance)', color: '#059669', bg: '#ECFDF5' }
          : { label: '헐거움 과다 (유격·흔들림 발생)', color: '#635BFF', bg: '#EEF2FF' };

  const holePx = 76 + (actualPrintedHole - 5.0) * 44;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Top Fit Presets */}
      <g transform="translate(22, 18)">
        {[
          { id: 'press' as const, label: '억지 끼움 (+0.05mm)', c: 0.05 },
          { id: 'transition' as const, label: '중간 맞춤 (+0.20mm)', c: 0.2 },
          { id: 'clearance' as const, label: '회전/M3 통과 (+0.35mm)', c: 0.35 },
        ].map((p, i) => {
          const active = preview.day19FitType === p.id;
          return (
            <g
              key={p.id}
              transform={`translate(${i * 222}, 0)`}
              onClick={() =>
                onChangePreview({ day19FitType: p.id, day19HoleClearanceMm: p.c })
              }
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
                {p.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* Left: Magnified Cross Section (PLA Part + 5.00mm Steel Shaft) */}
      <g transform="translate(24, 58)">
        <rect x="0" y="0" width="330" height="296" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="16" y="24" fontSize="11" fontWeight="700" fill="#0A2540">
          확대 단면도: Ø 5.00mm 스틸 축 vs 3D 프린팅 구멍
        </text>

        {/* Left & Right 3D Printed Plastic Walls */}
        <rect x="44" y="54" width={165 - holePx / 2 - 44} height="154" rx="4" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
        <rect x={165 + holePx / 2} y="54" width={286 - (165 + holePx / 2)} height="154" rx="4" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />

        {/* Wall Perimeters Visual Lines */}
        <line x1={165 - holePx / 2 - 6} y1="54" x2={165 - holePx / 2 - 6} y2="208" stroke="#635BFF" strokeDasharray="3 3" />
        <line x1={165 + holePx / 2 + 6} y1="54" x2={165 + holePx / 2 + 6} y2="208" stroke="#635BFF" strokeDasharray="3 3" />

        {/* 5.00mm Precision Steel Shaft in Center */}
        <rect x={165 - 38} y="42" width="76" height="178" rx="4" fill="#475569" stroke="#1E293B" strokeWidth="2" />
        <text x="165" y="135" textAnchor="middle" fontSize="10.5" fontFamily="monospace" fontWeight="700" fill="#F8FAFC">
          Ø 5.00 mm 축
        </text>

        {/* Interference Highlight */}
        {actualPrintedHole < 5.0 && (
          <>
            <rect x={165 - 40} y="64" width="6" height="134" fill="#EF4444" />
            <rect x={165 + 34} y="64" width="6" height="134" fill="#EF4444" />
          </>
        )}

        {/* Fit Result Badge */}
        <rect x="16" y="232" width="298" height="48" rx="7" fill={fitStatus.bg} stroke={fitStatus.color} />
        <text x="165" y="253" textAnchor="middle" fontSize="11" fontWeight="700" fill={fitStatus.color}>
          {fitStatus.label}
        </text>
        <text x="165" y="270" textAnchor="middle" fontSize="9.5" fontFamily="monospace" fill="#334155">
          CAD Ø{cadDiameter.toFixed(2)}mm → 출력 실측 약 Ø{actualPrintedHole.toFixed(2)}mm (편측 {gapEachSide >= 0 ? `+${gapEachSide.toFixed(2)}` : gapEachSide.toFixed(2)}mm)
        </text>
      </g>

      {/* Right: Nozzle Line Packing & Mechanical Specs */}
      <g transform="translate(370, 58)">
        <rect x="0" y="0" width="308" height="296" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          0.4mm 노즐 적층 벽 두께 &amp; 강성 분석
        </text>

        {/* Wall Perimeters Diagram */}
        <rect x="16" y="44" width="276" height="86" rx="8" fill="#1E293B" />
        <text x="28" y="66" fontSize="10" fontFamily="monospace" fill="#94A3B8">
          설계 벽 두께: {wall.toFixed(1)} mm ({isMultiple ? `0.4mm × ${wallLines}겹 완벽 밀착` : '비정수배 → 내부 빈 틈 발생'})
        </text>
        <g transform="translate(28, 78)">
          {Array.from({ length: Math.min(8, Math.max(1, wallLines)) }).map((_, idx) => (
            <rect
              key={idx}
              x={idx * 26}
              y="0"
              width="24"
              height="34"
              rx="10"
              fill={isMultiple ? '#10B981' : '#F59E0B'}
              fillOpacity="0.85"
              stroke="#0F172A"
            />
          ))}
        </g>

        <rect x="16" y="144" width="276" height="136" rx="8" fill="#020617" stroke="#334155" />
        <text x="28" y="168" fontSize="10.5" fontWeight="700" fill="#38BDF8">
          3D 프린팅 로봇 부품 설계 체크리스트
        </text>
        <text x="28" y="192" fontSize="10" fill="#CBD5E1">
          • CAD 5.00mm = 출력 후 수축으로 약 4.82mm가 됨
        </text>
        <text x="28" y="212" fontSize="10" fill="#CBD5E1">
          • M3 볼트 자유 통과 홀: CAD Ø 3.3 ~ 3.4 mm
        </text>
        <text x="28" y="232" fontSize="10" fill="#CBD5E1">
          • 베어링 압입: 테스트 쿠폰 출력 후 +0.05~0.15mm 튜닝
        </text>
        <text x="28" y="252" fontSize="10" fill={wall >= 1.6 ? '#34D399' : '#F87171'}>
          • 브래킷 두께 {wall.toFixed(1)}mm: {wall >= 1.6 ? '구조 강성 권장(≥1.6mm) 충족' : '얇아서 모터 부하 시 휨 위험'}
        </text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 20: Mobile Robot Kinematics (Differential Drive, ICR & Architectures)  */
/* -------------------------------------------------------------------------- */
export function Day20MobileKinematicsScene({ preview, onChangePreview }: SceneProps) {
  const arch = preview.day20DriveArch;
  const v = preview.day20LinearV;
  const w = preview.day20AngularW;
  const W = preview.day20WheelBaseM;

  const vL = v - (W * 0.5) * w;
  const vR = v + (W * 0.5) * w;
  const hasTurn = Math.abs(w) >= 0.08;
  const icrR = hasTurn ? v / w : Infinity;

  // Map ICR radius on canvas (center of robot at x=190, y=196)
  // Left direction of robot (up-facing robot): +Y robotics is Left (-X on SVG top view when facing Up)
  const clampedSvgOffset = Number.isFinite(icrR)
    ? Math.max(-135, Math.min(135, -icrR * 48))
    : 0;
  const icrX = 190 + clampedSvgOffset;
  const icrY = 196;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Top Architecture Tabs */}
      <g transform="translate(22, 18)">
        {[
          { id: 'diff' as const, label: '차동 구동 (2WD + 캐스터)' },
          { id: 'ackermann' as const, label: '애커먼 조향 (자동차형)' },
          { id: 'mecanum' as const, label: '4WD 메카넘 옴니 (전방향)' },
        ].map((item, i) => {
          const active = arch === item.id;
          return (
            <g
              key={item.id}
              transform={`translate(${i * 222}, 0)`}
              onClick={() => onChangePreview({ day20DriveArch: item.id })}
              className="cursor-pointer"
            >
              <rect
                x="0"
                y="0"
                width="212"
                height="28"
                rx="6"
                fill={active ? '#635BFF' : '#F7F8FA'}
                stroke={active ? '#635BFF' : '#E6E8EC'}
              />
              <text
                x="106"
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

      {/* Left Top-Down Motion Plane */}
      <g>
        <rect x="24" y="58" width="334" height="296" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        {/* Axle Extension Dashed Line */}
        <line x1="36" y1="196" x2="346" y2="196" stroke="#CBD5E1" strokeDasharray="4 4" />

        {/* ICR Circle Trajectory if Diff Drive & Turning */}
        {arch === 'diff' && hasTurn && (
          <>
            <circle
              cx={icrX}
              cy={icrY}
              r={Math.max(18, Math.abs(icrX - 190))}
              fill="none"
              stroke="#635BFF"
              strokeWidth="1.8"
              strokeDasharray="5 4"
            />
            <circle cx={icrX} cy={icrY} r="6" fill="#EF4444" />
            <text x={icrX} y={icrY - 12} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#DC2626">
              ICR (R={icrR.toFixed(2)}m)
            </text>
          </>
        )}

        {/* Straight Path Arrow if no turn */}
        {(!hasTurn || arch === 'mecanum') && Math.abs(v) > 0.05 && (
          <line
            x1="190"
            y1="196"
            x2="190"
            y2={v > 0 ? 92 : 300}
            stroke="#10B981"
            strokeWidth="2.5"
            strokeDasharray="5 4"
          />
        )}

        {/* Robot Top-Down Chassis (Facing Up) */}
        <g transform="translate(148, 146)">
          {/* Chassis */}
          <rect x="12" y="10" width="60" height="80" rx="10" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          {/* Front marker */}
          <polygon points="42,2 34,14 50,14" fill="#38BDF8" />

          {/* Wheels depending on arch */}
          {arch === 'diff' && (
            <>
              <rect x="-4" y="32" width="14" height="36" rx="3" fill={Math.abs(vL) > 0.05 ? '#38BDF8' : '#64748B'} />
              <rect x="74" y="32" width="14" height="36" rx="3" fill={Math.abs(vR) > 0.05 ? '#38BDF8' : '#64748B'} />
              <circle cx="42" cy="76" r="5" fill="#94A3B8" />
            </>
          )}

          {arch === 'ackermann' && (
            <>
              <rect x="-4" y="14" width="12" height="24" rx="3" fill="#F59E0B" transform="rotate(-18 2 26)" />
              <rect x="76" y="14" width="12" height="24" rx="3" fill="#F59E0B" transform="rotate(-15 82 26)" />
              <rect x="-4" y="60" width="12" height="26" rx="3" fill="#38BDF8" />
              <rect x="76" y="60" width="12" height="26" rx="3" fill="#38BDF8" />
            </>
          )}

          {arch === 'mecanum' && (
            <>
              {[
                { x: -6, y: 12, tilt: 35 },
                { x: 76, y: 12, tilt: -35 },
                { x: -6, y: 60, tilt: -35 },
                { x: 76, y: 60, tilt: 35 },
              ].map((wh, idx) => (
                <g key={idx} transform={`translate(${wh.x}, ${wh.y})`}>
                  <rect x="0" y="0" width="14" height="26" rx="3" fill="#10B981" />
                  <line x1="2" y1="13" x2="12" y2="13" stroke="#022C22" strokeWidth="2" transform={`rotate(${wh.tilt} 7 13)`} />
                </g>
              ))}
              {/* Lateral Holonomic Arrows */}
              <line x1="-26" y1="50" x2="110" y2="50" stroke="#10B981" strokeWidth="2" strokeDasharray="3 3" />
            </>
          )}

          {/* Left & Right Velocity Bars */}
          <line
            x1="2"
            y1="50"
            x2="2"
            y2={50 - Math.max(-44, Math.min(44, vL * 42))}
            stroke="#10B981"
            strokeWidth="3.5"
          />
          <line
            x1="82"
            y1="50"
            x2="82"
            y2={50 - Math.max(-44, Math.min(44, vR * 42))}
            stroke="#F59E0B"
            strokeWidth="3.5"
          />
        </g>

        <text x="191" y="340" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">
          {arch === 'diff'
            ? '차동 구동: v_y = 0 (옆으로 게걸음 불가 · 논홀로노믹)'
            : arch === 'ackermann'
              ? '애커먼 조향: 최소 회전 반경 존재 · 제자리 턴 불가'
              : '4WD 메카넘: 45° 롤러 힘 분해로 전방향(vx, vy, ω) 즉시 이동'}
        </text>
      </g>

      {/* Right Kinematic Telemetry Panel */}
      <g transform="translate(372, 58)">
        <rect x="0" y="0" width="306" height="296" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          (v, ω) ↔ (v_L, v_R) 바퀴 속도 실시간 분배
        </text>

        <g transform="translate(16, 44)">
          <rect x="0" y="0" width="132" height="72" rx="8" fill="#1E293B" />
          <text x="12" y="22" fontSize="9.5" fill="#94A3B8">좌측 바퀴 (v_L)</text>
          <text x="12" y="50" fontSize="18" fontFamily="monospace" fontWeight="700" fill="#34D399">
            {vL >= 0 ? `+${vL.toFixed(2)}` : vL.toFixed(2)}
          </text>
          <text x="88" y="50" fontSize="9.5" fontFamily="monospace" fill="#94A3B8">m/s</text>

          <rect x="142" y="0" width="132" height="72" rx="8" fill="#1E293B" />
          <text x="154" y="22" fontSize="9.5" fill="#94A3B8">우측 바퀴 (v_R)</text>
          <text x="154" y="50" fontSize="18" fontFamily="monospace" fontWeight="700" fill="#FBBF24">
            {vR >= 0 ? `+${vR.toFixed(2)}` : vR.toFixed(2)}
          </text>
          <text x="230" y="50" fontSize="9.5" fontFamily="monospace" fill="#94A3B8">m/s</text>
        </g>

        <rect x="16" y="132" width="274" height="58" rx="8" fill="#1E293B" />
        <text x="28" y="155" fontSize="10" fill="#94A3B8">
          순간 회전 중심 반경 (R = v / ω)
        </text>
        <text x="28" y="177" fontSize="14" fontFamily="monospace" fontWeight="700" fill="#38BDF8">
          {Number.isFinite(icrR)
            ? `R = ${icrR.toFixed(2)} m ${Math.abs(icrR) < 0.04 ? '(제자리 회전!)' : ''}`
            : 'R = ∞ (완전 직진)'}
        </text>

        <rect x="16" y="204" width="274" height="76" rx="8" fill="#020617" stroke="#334155" />
        <text x="26" y="226" fontSize="10" fontFamily="monospace" fill="#E2E8F0">
          v_L = v - (W/2)ω · (W = {W.toFixed(2)}m)
        </text>
        <text x="26" y="246" fontSize="10" fontFamily="monospace" fill="#E2E8F0">
          v_R = v + (W/2)ω
        </text>
        <text x="26" y="266" fontSize="9.5" fill="#94A3B8">
          v = 0, ω ≠ 0 일 때 양 바퀴 크기가 같고 방향이 반대가 됩니다.
        </text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 23: Jacobian Velocity Manipulability Ellipsoid & Singularity Lab       */
/* -------------------------------------------------------------------------- */
export function Day23JacobianScene({ preview }: SceneProps) {
  const t1 = (preview.day23Theta1Deg * Math.PI) / 180;
  const t2 = (preview.day23Theta2Deg * Math.PI) / 180;
  const Fx = preview.day23EndFxN;
  const Fy = preview.day23EndFyN;

  const L1 = 1.6;
  const L2 = 1.2;

  const s1 = Math.sin(t1);
  const c1 = Math.cos(t1);
  const s12 = Math.sin(t1 + t2);
  const c12 = Math.cos(t1 + t2);

  // Forward kinematics points
  const x1 = L1 * c1;
  const y1 = L1 * s1;
  const x2 = x1 + L2 * c12;
  const y2 = y1 + L2 * s12;

  // Jacobian 2x2 entries: J = [[j11, j12], [j21, j22]]
  const j11 = -L1 * s1 - L2 * s12;
  const j12 = -L2 * s12;
  const j21 = L1 * c1 + L2 * c12;
  const j22 = L2 * c12;

  const detJ = L1 * L2 * Math.sin(t2);
  const isSingular = Math.abs(Math.sin(t2)) < 0.16;

  // J * J^T = [[a, b], [b, c]] for Manipulability Ellipsoid
  const a = j11 * j11 + j12 * j12;
  const b = j11 * j21 + j12 * j22;
  const c = j21 * j21 + j22 * j22;
  const disc = Math.sqrt((a - c) * (a - c) + 4 * b * b);
  const lam1 = (a + c + disc) / 2;
  const lam2 = Math.max(0.002, (a + c - disc) / 2);
  const r1 = Math.sqrt(lam1) * 26;
  const r2 = Math.sqrt(lam2) * 26;
  const ellipDeg = (0.5 * Math.atan2(2 * b, a - c) * 180) / Math.PI;

  // Static torques: tau = J^T * F
  const tau1 = j11 * Fx + j21 * Fy;
  const tau2 = j12 * Fx + j22 * Fy;

  // Map math space to SVG canvas (origin at 136, 226; 54px per meter)
  const ox = 136;
  const oy = 226;
  const sc = 54;
  const sx1 = ox + x1 * sc;
  const sy1 = oy - y1 * sc;
  const sx2 = ox + x2 * sc;
  const sy2 = oy - y2 * sc;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Left: 2R Arm + Manipulability Ellipsoid + Force Vector */}
      <g>
        <rect x="20" y="20" width="356" height="340" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="34" y="42" fontSize="11" fontWeight="700" fill="#0A2540">
          조작성 타원(Manipulability) &amp; 특이점 시각화
        </text>

        {/* Coordinate Grid Lines */}
        <line x1="34" y1={oy} x2="360" y2={oy} stroke="#CBD5E1" strokeDasharray="3 3" />
        <line x1={ox} y1="62" x2={ox} y2="342" stroke="#CBD5E1" strokeDasharray="3 3" />

        {/* Manipulability Ellipsoid Centered at End Effector */}
        <ellipse
          cx={sx2}
          cy={sy2}
          rx={r1}
          ry={Math.max(2.5, r2)}
          transform={`rotate(${-ellipDeg} ${sx2} ${sy2})`}
          fill={isSingular ? '#EF4444' : '#635BFF'}
          fillOpacity="0.16"
          stroke={isSingular ? '#EF4444' : '#635BFF'}
          strokeWidth="2"
        />

        {/* Links */}
        <line x1={ox} y1={oy} x2={sx1} y2={sy1} stroke="#1E293B" strokeWidth="9" strokeLinecap="round" />
        <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke="#475569" strokeWidth="7" strokeLinecap="round" />

        {/* Joints */}
        <circle cx={ox} cy={oy} r="9" fill="#0EA5E9" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx={sx1} cy={sy1} r="8" fill={isSingular ? '#EF4444' : '#10B981'} stroke="#FFFFFF" strokeWidth="2" />
        <circle cx={sx2} cy={sy2} r="6" fill="#635BFF" stroke="#FFFFFF" strokeWidth="1.5" />

        {/* Force Arrow F */}
        {(Math.abs(Fx) > 0.5 || Math.abs(Fy) > 0.5) && (
          <line
            x1={sx2}
            y1={sy2}
            x2={sx2 + Fx * 2.2}
            y2={sy2 - Fy * 2.2}
            stroke="#F59E0B"
            strokeWidth="3"
          />
        )}

        <text
          x="198"
          y="344"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill={isSingular ? '#DC2626' : '#059669'}
        >
          {isSingular
            ? '⚠ 특이점(Singularity)! 타원이 납작해져 반경 방향 자유도 소실'
            : '✓ 타원이 둥글수록 모든 방향으로 손끝 제어가 수월함'}
        </text>
      </g>

      {/* Right: Jacobian Matrix + Dual Force/Torque */}
      <g transform="translate(390, 20)">
        <rect x="0" y="0" width="290" height="340" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          실시간 야코비안 J(θ) &amp; 정역학 τ = JᵀF
        </text>

        {/* Live 2x2 Matrix Display */}
        <rect x="16" y="42" width="258" height="72" rx="8" fill="#1E293B" />
        <text x="28" y="64" fontSize="10" fill="#94A3B8">J(θ₁={preview.day23Theta1Deg}°, θ₂={preview.day23Theta2Deg}°)</text>
        <text x="28" y="86" fontSize="11.5" fontFamily="monospace" fill="#38BDF8">
          [ {j11.toFixed(2)}   {j12.toFixed(2)} ]
        </text>
        <text x="28" y="104" fontSize="11.5" fontFamily="monospace" fill="#38BDF8">
          [ {j21.toFixed(2)}   {j22.toFixed(2)} ]
        </text>

        {/* Determinant & Condition Readout */}
        <rect
          x="16"
          y="126"
          width="258"
          height="58"
          rx="8"
          fill={isSingular ? '#450A0A' : '#020617'}
          stroke={isSingular ? '#EF4444' : '#10B981'}
        />
        <text x="28" y="149" fontSize="10.5" fontFamily="monospace" fontWeight="700" fill={isSingular ? '#FCA5A5' : '#34D399'}>
          det(J) = L₁L₂ sinθ₂ = {detJ.toFixed(3)}
        </text>
        <text x="28" y="169" fontSize="9.5" fill="#CBD5E1">
          {isSingular
            ? '역행렬 J⁻¹ 폭주! DLS 감쇠 λ 필요'
            : `단축/장축 비율: ${(Math.sqrt(lam2 / lam1) * 100).toFixed(0)}% (100%가 등방성)`}
        </text>

        {/* Static Torque Display */}
        <g transform="translate(16, 198)">
          <rect x="0" y="0" width="124" height="70" rx="8" fill="#1E293B" />
          <text x="10" y="20" fontSize="9.5" fill="#94A3B8">어깨 토크 τ₁</text>
          <text x="10" y="48" fontSize="16" fontFamily="monospace" fontWeight="700" fill="#FBBF24">
            {tau1.toFixed(1)}
          </text>
          <text x="86" y="48" fontSize="9.5" fontFamily="monospace" fill="#94A3B8">N·m</text>

          <rect x="134" y="0" width="124" height="70" rx="8" fill="#1E293B" />
          <text x="144" y="20" fontSize="9.5" fill="#94A3B8">팔꿈치 토크 τ₂</text>
          <text x="144" y="48" fontSize="16" fontFamily="monospace" fontWeight="700" fill="#FBBF24">
            {tau2.toFixed(1)}
          </text>
          <text x="220" y="48" fontSize="9.5" fontFamily="monospace" fill="#94A3B8">N·m</text>
        </g>

        <text x="16" y="294" fontSize="9.5" fill="#94A3B8">
          외력 F = ({Fx}N, {Fy}N) 인가 시 관절 모터가 버텨야 할 정적 토크
        </text>
        <text x="16" y="314" fontSize="9.5" fontFamily="monospace" fill="#38BDF8">
          θ₂ = ±90°에서 조작성 면적 최대 (det = {(L1 * L2).toFixed(2)})
        </text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 24: Robot Dynamics FBD & Servo Torque Margin Bench                     */
/* -------------------------------------------------------------------------- */
export function Day24DynamicsScene({ preview }: SceneProps) {
  const Lcm = preview.day24ArmLengthCm;
  const angle = preview.day24AngleDeg;
  const payloadG = preview.day24PayloadG;
  const servoMax = preview.day24ServoRatedKgCm;

  const linkMassKg = (Lcm / 30) * 0.12; // approx 120g per 30cm 3D printed link
  const payloadKg = payloadG / 1000;
  const rad = (angle * Math.PI) / 180;

  const momentArmFactor = Math.cos(rad);
  const reqKgCm = (linkMassKg * 0.5 + payloadKg) * Lcm * momentArmFactor;
  const sf = servoMax / Math.max(0.05, reqKgCm);
  const isOverload = sf < 1.0;
  const isMarginal = sf >= 1.0 && sf < 1.5;

  // Pivot point at (96, 232)
  const px = 96;
  const py = 232;
  const armPx = 85 + (Lcm / 50) * 145;
  const ex = px + Math.cos(rad) * armPx;
  const ey = py - Math.sin(rad) * armPx;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Left: Free Body Diagram */}
      <g>
        <rect x="20" y="20" width="350" height="340" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="34" y="44" fontSize="11" fontWeight="700" fill="#0A2540">
          자유물체도 (FBD): 모멘트 암 r = L·cos({angle}°)
        </text>

        {/* Ground & Shoulder Servo Pedestal */}
        <rect x="56" y="232" width="80" height="62" rx="6" fill="#334155" />
        <line x1="36" y1="294" x2="346" y2="294" stroke="#94A3B8" strokeWidth="2" />

        {/* Horizontal Reference & Angle Arc */}
        <line x1={px} y1={py} x2={ex} y2={py} stroke="#CBD5E1" strokeDasharray="4 4" strokeWidth="1.5" />

        {/* Moment Arm Dimension Line */}
        <line x1={px} y1="258" x2={ex} y2="258" stroke="#635BFF" strokeWidth="1.8" />
        <text x={(px + ex) / 2} y="274" textAnchor="middle" fontSize="9.5" fontFamily="monospace" fontWeight="700" fill="#4338CA">
          수평 거리 r = {(Lcm * momentArmFactor).toFixed(1)} cm
        </text>

        {/* Robot Arm Link */}
        <line x1={px} y1={py} x2={ex} y2={ey} stroke="#1E293B" strokeWidth="12" strokeLinecap="round" />
        <circle cx={px} cy={py} r="14" fill={isOverload ? '#EF4444' : isMarginal ? '#F59E0B' : '#10B981'} stroke="#FFFFFF" strokeWidth="2.5" />

        {/* Payload Weight + Gravity Force Arrow */}
        <rect x={ex - 16} y={ey - 16} width="32" height="32" rx="5" fill="#635BFF" stroke="#FFFFFF" strokeWidth="2" />
        <line x1={ex} y1={ey + 16} x2={ex} y2={ey + 64} stroke="#EF4444" strokeWidth="3" />
        <polygon points={`${ex},${ey + 70} ${ex - 5},${ey + 60} ${ex + 5},${ey + 60}`} fill="#EF4444" />
        <text x={ex} y={ey + 82} textAnchor="middle" fontSize="9.5" fontFamily="monospace" fontWeight="700" fill="#DC2626">
          {payloadG}g 중력 F = {(payloadKg * 9.81).toFixed(1)}N
        </text>
      </g>

      {/* Right: Torque Budget & Servo Selection */}
      <g transform="translate(386, 20)">
        <rect x="0" y="0" width="294" height="340" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          필요 정적 토크 vs 서보 안전율(SF) 판정
        </text>

        <g transform="translate(16, 46)">
          <rect x="0" y="0" width="126" height="72" rx="8" fill="#1E293B" />
          <text x="12" y="20" fontSize="9.5" fill="#94A3B8">필요 중력 토크</text>
          <text x="12" y="50" fontSize="17" fontFamily="monospace" fontWeight="700" fill="#FBBF24">
            {reqKgCm.toFixed(1)}
          </text>
          <text x="82" y="50" fontSize="9.5" fontFamily="monospace" fill="#94A3B8">kg·cm</text>

          <rect x="136" y="0" width="126" height="72" rx="8" fill="#1E293B" />
          <text x="148" y="20" fontSize="9.5" fill="#94A3B8">선택 서보 정격</text>
          <text x="148" y="50" fontSize="17" fontFamily="monospace" fontWeight="700" fill="#38BDF8">
            {servoMax}
          </text>
          <text x="214" y="50" fontSize="9.5" fontFamily="monospace" fill="#94A3B8">kg·cm</text>
        </g>

        {/* Torque Utilization Bar */}
        <text x="16" y="144" fontSize="10" fontFamily="monospace" fill="#CBD5E1">
          토크 부하율: {((reqKgCm / servoMax) * 100).toFixed(0)}% · 안전율 SF = {sf.toFixed(2)}×
        </text>
        <rect x="16" y="154" width="262" height="14" rx="7" fill="#1E293B" />
        <rect
          x="16"
          y="154"
          width={Math.min(262, Math.max(8, (reqKgCm / servoMax) * 262))}
          height="14"
          rx="7"
          fill={isOverload ? '#EF4444' : isMarginal ? '#F59E0B' : '#10B981'}
        />

        {/* Pass/Fail Banner */}
        <rect
          x="16"
          y="186"
          width="262"
          height="74"
          rx="8"
          fill={isOverload ? '#450A0A' : isMarginal ? '#451A03' : '#022C22'}
          stroke={isOverload ? '#EF4444' : isMarginal ? '#F59E0B' : '#10B981'}
        />
        <text
          x="26"
          y="210"
          fontSize="11"
          fontWeight="700"
          fill={isOverload ? '#FCA5A5' : isMarginal ? '#FDE68A' : '#6EE7B7'}
        >
          {isOverload
            ? '✗ OVERLOAD: 서보 기어 파손 / 탈조!'
            : isMarginal
              ? '⚠ 여유 부족 (SF < 1.5): 가속 시 처짐 위험'
              : '✓ SAFE PASS (SF ≥ 1.5): 안정적 동적 구동'}
        </text>
        <text x="26" y="232" fontSize="9.5" fill="#E2E8F0">
          {isOverload
            ? '서보 스펙을 높이거나 팔 길이·무게를 줄이세요.'
            : isMarginal
              ? '가속 관성 M(q)q̈ 여유를 위해 SF 1.5배 이상 권장!'
              : `정지 토크 대비 ${(sf * 100 - 100).toFixed(0)}% 여유 토크 확보됨`}
        </text>

        <text x="16" y="294" fontSize="9.5" fontFamily="monospace" fill="#94A3B8">
          환산: {reqKgCm.toFixed(1)} kg·cm ≈ {(reqKgCm / 10.2).toFixed(2)} N·m
        </text>
        <text x="16" y="314" fontSize="9.5" fill="#CBD5E1">
          θ = 0°(수평)일 때 최대 모멘트, θ = 90°(수직)일 때 0이 됩니다.
        </text>
      </g>
    </svg>
  );
}
