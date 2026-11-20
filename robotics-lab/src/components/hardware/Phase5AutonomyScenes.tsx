import { LabPreviewState } from '../../types/lab';

interface SceneProps {
  preview: LabPreviewState;
  onChangePreview: (patch: Partial<LabPreviewState>) => void;
}

/* Helper 10x7 Grid A* Engine for Day 36 & Day 42 */
function computeGridAStar(
  cols: number,
  rows: number,
  baseObs: [number, number][],
  inflate: boolean,
  start: [number, number],
  goal: [number, number],
): { path: [number, number][]; inflatedSet: Set<string>; baseSet: Set<string> } {
  const baseSet = new Set(baseObs.map(([c, r]) => `${c},${r}`));
  const inflatedSet = new Set<string>();
  const blocked = new Set<string>(baseSet);

  if (inflate) {
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    for (const [oc, or] of baseObs) {
      for (const [dc, dr] of dirs) {
        const nc = oc + dc;
        const nr = or + dr;
        if (nc >= 0 && nc < cols && nr >= 0 && nr < rows) {
          const k = `${nc},${nr}`;
          if (!baseSet.has(k) && k !== `${start[0]},${start[1]}` && k !== `${goal[0]},${goal[1]}`) {
            inflatedSet.add(k);
            blocked.add(k);
          }
        }
      }
    }
  }

  const key = (c: number, r: number) => `${c},${r}`;
  const startKey = key(start[0], start[1]);
  const goalKey = key(goal[0], goal[1]);

  const open: { c: number; r: number; f: number }[] = [
    { c: start[0], r: start[1], f: Math.hypot(goal[0] - start[0], goal[1] - start[1]) },
  ];
  const gScore = new Map<string, number>([[startKey, 0]]);
  const cameFrom = new Map<string, [number, number]>();
  const closed = new Set<string>();

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const cur = open.shift()!;
    const ck = key(cur.c, cur.r);
    if (ck === goalKey) {
      const path: [number, number][] = [];
      let p: [number, number] | undefined = [cur.c, cur.r];
      while (p) {
        path.unshift(p);
        p = cameFrom.get(key(p[0], p[1]));
      }
      return { path, inflatedSet, baseSet };
    }
    closed.add(ck);

    for (const [dc, dr] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nc = cur.c + dc;
      const nr = cur.r + dr;
      const nk = key(nc, nr);
      if (nc < 0 || nc >= cols || nr < 0 || nr >= rows || blocked.has(nk) || closed.has(nk)) {
        continue;
      }
      const tentG = (gScore.get(ck) ?? 1e9) + 1;
      if (tentG < (gScore.get(nk) ?? 1e9)) {
        cameFrom.set(nk, [cur.c, cur.r]);
        gScore.set(nk, tentG);
        open.push({
          c: nc,
          r: nr,
          f: tentG + Math.hypot(goal[0] - nc, goal[1] - nr),
        });
      }
    }
  }

  return { path: [], inflatedSet, baseSet };
}

/* -------------------------------------------------------------------------- */
/* Day 35: Python PC <-> ESP32 Serial Binary Bridge & CRC8 Guard              */
/* -------------------------------------------------------------------------- */
export function Day35PythonBridgeScene({ preview, onChangePreview }: SceneProps) {
  const corrupt = preview.day35CorruptByte;
  const crcOn = preview.day35CrcEnabled;
  const runaway = corrupt && !crcOn;
  const safelyRejected = corrupt && crcOn;

  const packetBytes = [
    { label: 'HDR0', hex: '0xAA', color: '#635BFF' },
    { label: 'HDR1', hex: '0x55', color: '#635BFF' },
    { label: 'v (f32)', hex: corrupt ? '0xFF*' : '0.45', color: corrupt ? '#EF4444' : '#0EA5E9' },
    { label: 'ω (f32)', hex: '0.20', color: '#0EA5E9' },
    { label: 'CRC8', hex: '0x7C', color: crcOn ? '#10B981' : '#94A3B8' },
  ];

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Top Two Computers Bridge */}
      <g transform="translate(22, 20)">
        {/* Python Host PC */}
        <rect x="0" y="0" width="210" height="114" rx="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#0A2540">
          상위 두뇌 (PC / RPi Python)
        </text>
        <text x="16" y="46" fontSize="9.5" fill="#475569">
          OpenCV · 경로계획 · ROS 2 노드
        </text>
        <rect x="14" y="60" width="182" height="38" rx="6" fill="#FFFFFF" stroke="#E2E8F0" />
        <text x="22" y="82" fontSize="9.5" fontFamily="monospace" fill="#4338CA">
          struct.pack(&apos;&lt;BBffB&apos;, 0xAA, 0x55...)
        </text>

        {/* UART Cable */}
        <line
          x1="210"
          y1="57"
          x2="446"
          y2="57"
          stroke={corrupt ? '#EF4444' : '#10B981'}
          strokeWidth="3"
          strokeDasharray="6 4"
        />
        <rect
          x="266"
          y="38"
          width="124"
          height="38"
          rx="6"
          fill={corrupt ? '#FEF2F2' : '#ECFDF5'}
          stroke={corrupt ? '#EF4444' : '#10B981'}
        />
        <text x="328" y="55" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={corrupt ? '#DC2626' : '#059669'}>
          {corrupt ? '⚡ EMI 1바이트 손상!' : 'UART 115200 bps'}
        </text>
        <text x="328" y="69" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="#475569">
          TX → RX (11 Bytes)
        </text>

        {/* ESP32 Real-time MCU */}
        <rect
          x="446"
          y="0"
          width="210"
          height="114"
          rx="10"
          fill={runaway ? '#FEF2F2' : '#0F172A'}
          stroke={runaway ? '#EF4444' : safelyRejected ? '#F59E0B' : '#10B981'}
          strokeWidth="2"
        />
        <text x="462" y="26" fontSize="11.5" fontWeight="700" fill={runaway ? '#B91C1C' : '#F8FAFC'}>
          하위 척수 (ESP32 C++)
        </text>
        <text x="462" y="46" fontSize="9.5" fill={runaway ? '#991B1B' : '#94A3B8'}>
          100Hz 엔코더 · PID · PWM 구동
        </text>
        <rect x="460" y="60" width="182" height="38" rx="6" fill={runaway ? '#FFFFFF' : '#1E293B'} />
        <text
          x="468"
          y="83"
          fontSize="9.5"
          fontFamily="monospace"
          fontWeight="700"
          fill={runaway ? '#DC2626' : safelyRejected ? '#FBBF24' : '#34D399'}
        >
          {runaway
            ? '목표 v = 9999.0 m/s 폭주!!'
            : safelyRejected
              ? 'CRC 불일치 → 패킷 폐기 OK'
              : '목표 v = 0.45 m/s 정상 구동'}
        </text>
      </g>

      {/* Middle Binary Byte Frame Breakdown */}
      <g transform="translate(22, 152)">
        <rect x="0" y="0" width="656" height="94" rx="10" fill="#F7F8FA" stroke="#E6E8EC" />
        <text x="16" y="24" fontSize="10.5" fontWeight="700" fill="#0A2540">
          바이너리 프레임 구조 (Little-Endian)
        </text>
        {packetBytes.map((b, i) => (
          <g key={b.label} transform={`translate(${16 + i * 126}, 36)`}>
            <rect x="0" y="0" width="118" height="44" rx="6" fill="#FFFFFF" stroke={b.color} strokeWidth="2" />
            <text x="59" y="17" textAnchor="middle" fontSize="9" fontWeight="700" fill={b.color}>
              {b.label}
            </text>
            <text x="59" y="34" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="700" fill="#0A2540">
              {b.hex}
            </text>
          </g>
        ))}
      </g>

      {/* Bottom Interactive Controls & Status */}
      <g transform="translate(22, 260)">
        <rect x="0" y="0" width="656" height="96" rx="10" fill="#0F172A" />
        <g
          onClick={() => onChangePreview({ day35CorruptByte: !corrupt })}
          className="cursor-pointer"
        >
          <rect x="16" y="16" width="200" height="30" rx="6" fill={corrupt ? '#EF4444' : '#1E293B'} stroke="#334155" />
          <text x="116" y="35" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
            {corrupt ? '1바이트 노이즈 주입 ON' : '노이즈 주입 (클릭해 깨뜨리기)'}
          </text>
        </g>

        <g
          onClick={() => onChangePreview({ day35CrcEnabled: !crcOn })}
          className="cursor-pointer"
        >
          <rect x="230" y="16" width="200" height="30" rx="6" fill={crcOn ? '#10B981' : '#EF4444'} />
          <text x="330" y="35" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
            {crcOn ? 'CRC8 무결성 검사 ON' : 'CRC8 검사 OFF (위험!)'}
          </text>
        </g>

        <text x="16" y="74" fontSize="10.5" fontWeight="700" fill={runaway ? '#FCA5A5' : safelyRejected ? '#FDE68A' : '#34D399'}>
          {runaway
            ? '✗ 치명적 사고: 깨진 float 바이트를 그대로 모터에 인가해 로봇이 급발진했습니다!'
            : safelyRejected
              ? '✓ 안전 방어: CRC8 불일치를 감지해 손상 패킷을 버리고 이전 안전 상태를 지켰습니다.'
              : '✓ 정상 통신: 2바이트 헤더 동기화 + Little-Endian struct + CRC8 모두 정상 동작 중.'}
        </text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 36: C-Space Obstacle Inflation + Live Grid A* & DWA Avoidance          */
/* -------------------------------------------------------------------------- */
export function Day36PathPlanningScene({ preview, onChangePreview }: SceneProps) {
  const inflate = preview.day36CspaceInflation;
  const dynObs = preview.day36DynamicObstacle;
  const algo = preview.day36PlannerAlgo;

  const cols = 10;
  const rows = 7;
  const baseObstacles: [number, number][] = [
    [3, 1],
    [3, 2],
    [3, 3],
    [6, 3],
    [6, 4],
    [6, 5],
    ...(dynObs ? ([[4, 5]] as [number, number][]) : []),
  ];

  // If dynamic obstacle active and algo === 'dwa', plan around with safety
  const useSafeCspace = inflate || algo === 'dwa';
  const { path, inflatedSet, baseSet } = computeGridAStar(
    cols,
    rows,
    baseObstacles,
    useSafeCspace,
    [1, 5],
    [8, 1],
  );

  // If inflate is OFF and algo is astar, path hugs corners adjacently -> collision warning
  const huggingCorner = !inflate && algo === 'astar';

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Left Interactive 10x7 Planning Grid */}
      <g transform="translate(22, 22)">
        <rect x="0" y="0" width="414" height="336" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="16" y="24" fontSize="11" fontWeight="700" fill="#0A2540">
          10×7 C-Space &amp; 실시간 A*/DWA 탐색 격자
        </text>

        <g transform="translate(18, 38)">
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((__, c) => {
              const k = `${c},${r}`;
              const isObs = baseSet.has(k);
              const isDyn = dynObs && c === 4 && r === 5;
              const isInf = inflatedSet.has(k);
              const isStart = c === 1 && r === 5;
              const isGoal = c === 8 && r === 1;
              return (
                <rect
                  key={k}
                  x={c * 37}
                  y={r * 37}
                  width="35"
                  height="35"
                  rx="4"
                  fill={
                    isDyn
                      ? '#F59E0B'
                      : isObs
                        ? '#1E293B'
                        : isInf
                          ? '#CBD5E1'
                          : isStart
                            ? '#10B981'
                            : isGoal
                              ? '#635BFF'
                              : '#FFFFFF'
                  }
                  stroke="#E2E8F0"
                />
              );
            }),
          )}

          {/* Path Polyline */}
          {path.length > 1 && (
            <polyline
              points={path.map(([c, r]) => `${c * 37 + 17.5},${r * 37 + 17.5}`).join(' ')}
              fill="none"
              stroke={huggingCorner ? '#EF4444' : algo === 'dwa' ? '#10B981' : '#635BFF'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          <text x={1 * 37 + 17.5} y={5 * 37 + 21} textAnchor="middle" fontSize="11" fontWeight="800" fill="#FFFFFF">
            S
          </text>
          <text x={8 * 37 + 17.5} y={1 * 37 + 21} textAnchor="middle" fontSize="11" fontWeight="800" fill="#FFFFFF">
            G
          </text>
        </g>

        <text x="16" y="320" fontSize="10" fontWeight="700" fill={huggingCorner ? '#DC2626' : '#059669'}>
          {huggingCorner
            ? '⚠ C-Space 팽창 OFF → 로봇이 벽 모서리에 0cm로 스쳐 실제 차체 충돌!'
            : algo === 'dwa' && dynObs
              ? '✓ DWA 회피 활성화: 동적 박스(주황) 회피 후 안전 경로 유지!'
              : `✓ C-Space 안전 경로 탐색 완료 (경로 길이: ${path.length}칸)`}
        </text>
      </g>

      {/* Right Strategy Panel */}
      <g transform="translate(450, 22)">
        <rect x="0" y="0" width="228" height="336" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          탐색 계층 &amp; 안전 마진
        </text>

        <g
          onClick={() => onChangePreview({ day36CspaceInflation: !inflate })}
          className="cursor-pointer"
        >
          <rect x="16" y="44" width="196" height="34" rx="7" fill={inflate ? '#10B981' : '#EF4444'} />
          <text x="114" y="65" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
            C-Space 반지름 팽창: {inflate ? 'ON' : 'OFF'}
          </text>
        </g>

        <g
          onClick={() => onChangePreview({ day36DynamicObstacle: !dynObs })}
          className="cursor-pointer"
        >
          <rect x="16" y="88" width="196" height="34" rx="7" fill={dynObs ? '#F59E0B' : '#1E293B'} stroke="#334155" />
          <text x="114" y="109" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
            돌발 박스 장애물: {dynObs ? '출현 ON' : '없음 OFF'}
          </text>
        </g>

        <g
          onClick={() =>
            onChangePreview({ day36PlannerAlgo: algo === 'astar' ? 'dwa' : 'astar' })
          }
          className="cursor-pointer"
        >
          <rect x="16" y="132" width="196" height="34" rx="7" fill="#635BFF" />
          <text x="114" y="153" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
            플래너: {algo === 'astar' ? '전역 A* (클릭 전환)' : '전역 A* + DWA 회피'}
          </text>
        </g>

        <rect x="16" y="182" width="196" height="136" rx="8" fill="#020617" stroke="#334155" />
        <text x="26" y="206" fontSize="10" fontFamily="monospace" fontWeight="700" fill="#38BDF8">
          f(n) = g(n) + h(n)
        </text>
        <foreignObject x="26" y="214" width="176" height="96">
          <p className="text-[10.5px] leading-[1.45] text-[#CBD5E1]">
            진회색은 물리 벽, 연회색은 로봇 반지름만큼 부풀린 C-Space 안전지대입니다. 팽창을 켜야 모서리에 안 부딪힙니다.
          </p>
        </foreignObject>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 37: ROS 2 Architecture (Topic / Service / Action & QoS)                */
/* -------------------------------------------------------------------------- */
export function Day37Ros2ArchScene({ preview, onChangePreview }: SceneProps) {
  const pat = preview.day37Pattern;
  const reliable = preview.day37QosReliable;
  const loss = preview.day37PacketLossPct;

  const isStalledStream = pat === 'topic' && reliable && loss >= 15;
  const msgDelivered = reliable ? 100 : 100 - loss;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Top Pattern Tabs */}
      <g transform="translate(22, 18)">
        {[
          { id: 'topic' as const, label: 'Topic (Pub/Sub 스트림)' },
          { id: 'service' as const, label: 'Service (단발 요청/응답)' },
          { id: 'action' as const, label: 'Action (목표+피드백+취소)' },
        ].map((item, i) => {
          const active = pat === item.id;
          return (
            <g
              key={item.id}
              transform={`translate(${i * 222}, 0)`}
              onClick={() => onChangePreview({ day37Pattern: item.id })}
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
                {item.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* Node Graph Canvas */}
      <g transform="translate(22, 60)">
        <rect x="0" y="0" width="430" height="296" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />

        {/* Node 1 */}
        <rect x="24" y="96" width="136" height="90" rx="10" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
        <text x="92" y="132" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF">
          {pat === 'topic' ? '/camera_node' : pat === 'service' ? '/nav_client' : '/bt_navigator'}
        </text>
        <text x="92" y="152" textAnchor="middle" fontSize="9.5" fontFamily="monospace" fill="#7DD3FC">
          {pat === 'topic' ? 'Publisher' : pat === 'service' ? 'Client' : 'Action Client'}
        </text>

        {/* Connection Arrows */}
        <line x1="160" y1="126" x2="270" y2="126" stroke={isStalledStream ? '#EF4444' : '#635BFF'} strokeWidth="3" />
        {(pat === 'service' || pat === 'action') && (
          <line x1="270" y1="162" x2="160" y2="162" stroke="#10B981" strokeWidth="2.5" strokeDasharray="4 3" />
        )}

        <rect x="172" y="94" width="88" height="24" rx="4" fill="#FFFFFF" stroke="#E2E8F0" />
        <text x="216" y="110" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="700" fill="#4338CA">
          {pat === 'topic' ? '/scan · 30Hz' : pat === 'service' ? '/reset_odom' : '/navigate_pose'}
        </text>

        {(pat === 'service' || pat === 'action') && (
          <text x="216" y="180" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#059669">
            {pat === 'service' ? '← Response(OK)' : '← Feedback(65%)'}
          </text>
        )}

        {/* Node 2 */}
        <rect x="270" y="96" width="136" height="90" rx="10" fill="#0F172A" stroke="#10B981" strokeWidth="2" />
        <text x="338" y="132" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF">
          {pat === 'topic' ? '/planner_node' : pat === 'service' ? '/odom_server' : '/controller_srv'}
        </text>
        <text x="338" y="152" textAnchor="middle" fontSize="9.5" fontFamily="monospace" fill="#6EE7B7">
          {pat === 'topic' ? 'Subscriber' : pat === 'service' ? 'Server' : 'Action Server'}
        </text>

        <text x="215" y="256" textAnchor="middle" fontSize="10" fontWeight="700" fill={isStalledStream ? '#DC2626' : '#059669'}>
          {isStalledStream
            ? '⚠ Reliable + 패킷 손실(>=15%) → 영상 재전송 지연(3s+) 병목!'
            : `수신률 ${msgDelivered}% · ${reliable ? 'Reliable 무결성 보장' : 'Best-Effort 최저 지연'}`}
        </text>
      </g>

      {/* Right QoS Dashboard */}
      <g transform="translate(466, 60)">
        <rect x="0" y="0" width="212" height="296" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          DDS QoS 설정 &amp; 네트워크
        </text>
        <g
          onClick={() => onChangePreview({ day37QosReliable: !reliable })}
          className="cursor-pointer"
        >
          <rect x="16" y="46" width="180" height="32" rx="6" fill={reliable ? '#F59E0B' : '#10B981'} />
          <text x="106" y="66" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
            QoS: {reliable ? 'RELIABLE (재전송)' : 'BEST_EFFORT (실시간)'}
          </text>
        </g>

        <rect x="16" y="96" width="180" height="184" rx="8" fill="#020617" stroke="#334155" />
        <text x="26" y="120" fontSize="10" fontWeight="700" fill="#38BDF8">
          Wi-Fi 패킷 손실률: {loss}%
        </text>
        <foreignObject x="26" y="132" width="160" height="136">
          <p className="text-[10.5px] leading-[1.5] text-[#CBD5E1]">
            고주파 센서(/scan, /image_raw)는 최신 프레임이 생명이므로 BEST_EFFORT가 적합합니다. 반면 1번 실패하면 안 되는 목표 전달이나 파라미터 응답은 RELIABLE이 필수입니다.
          </p>
        </foreignObject>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 38: ROS 2 TF2 Coordinate Tree & Laser Sensor Static Offset Alignment   */
/* -------------------------------------------------------------------------- */
export function Day38Tf2UrdfScene({ preview }: SceneProps) {
  const offsetCm = preview.day38CamOffsetCm;
  const tfOn = preview.day38TfConfigured;

  // Wall sits 60cm in front of robot center (base_link at x=120) -> real wall at x=240
  const realWallX = 240;
  // Laser sits offsetCm (scaled 2px/cm) in front of base_link
  const laserX = 120 + offsetCm * 2;
  // If TF offset applied correctly, reconstructed scan dot aligns at realWallX; else shifted backward!
  const plottedWallX = tfOn ? realWallX : realWallX - offsetCm * 2;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Left: REP-105 TF Tree Hierarchy */}
      <g transform="translate(22, 20)">
        <rect x="0" y="0" width="246" height="340" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          REP-105 표준 TF2 좌표 트리
        </text>

        {[
          { frame: 'map', sub: '지도 고정 원점 (SLAM)', y: 54, col: '#F59E0B' },
          { frame: 'odom', sub: '주행 시작점 (연속 · 드리프트)', y: 124, col: '#38BDF8' },
          { frame: 'base_link', sub: '로봇 차체 중심', y: 194, col: '#10B981' },
          { frame: 'laser_link', sub: tfOn ? `전방 +${offsetCm}cm Static TF` : '✗ Static TF 누락 (0cm!)', y: 264, col: tfOn ? '#635BFF' : '#EF4444' },
        ].map((node, idx, arr) => (
          <g key={node.frame} transform={`translate(24, ${node.y})`}>
            <rect x="0" y="0" width="198" height="44" rx="7" fill="#1E293B" stroke={node.col} strokeWidth="2" />
            <text x="14" y="19" fontSize="11" fontFamily="monospace" fontWeight="700" fill="#FFFFFF">
              {node.frame}
            </text>
            <text x="14" y="34" fontSize="9.5" fill={node.col}>
              {node.sub}
            </text>
            {idx < arr.length - 1 && (
              <line x1="99" y1="44" x2="99" y2="70" stroke="#94A3B8" strokeWidth="2" />
            )}
          </g>
        ))}
      </g>

      {/* Right: Physical Projection Verification */}
      <g transform="translate(282, 20)">
        <rect x="0" y="0" width="398" height="340" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#0A2540">
          TF2 오프셋 적용 여부에 따른 실제 장애물 정합 비교
        </text>

        {/* Robot Body centered at x=120 */}
        <rect x="84" y="136" width="72" height="58" rx="8" fill="#1E293B" />
        <circle cx="120" cy="165" r="5" fill="#10B981" />
        <text x="120" y="210" textAnchor="middle" fontSize="9.5" fontFamily="monospace" fill="#0A2540">
          base_link
        </text>

        {/* Mounted LiDAR sensor in front */}
        <circle cx={laserX} cy="165" r="8" fill="#635BFF" />
        <text x={laserX} y="148" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#4338CA">
          laser (+{offsetCm}cm)
        </text>

        {/* Real Physical Wall at x=240 */}
        <rect x={realWallX} y="82" width="14" height="166" fill="#334155" />
        <text x={realWallX + 7} y="74" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#334155">
          실제 물리 벽
        </text>

        {/* Reconstructed Scan Point in Map */}
        <circle cx={plottedWallX} cy="165" r="9" fill={tfOn ? '#10B981' : '#EF4444'} fillOpacity="0.85" />
        <text
          x={plottedWallX}
          y="264"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill={tfOn ? '#059669' : '#DC2626'}
        >
          {tfOn
            ? '✓ TF2 변환 일치: 지도상 벽 = 실제 벽!'
            : `✗ 오차 ${offsetCm}cm 발생 (벽을 뒤로 착각해 충돌!)`}
        </text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 39: Computer Vision (RGB vs HSV Shadow Test & ArUco Pinhole 3D)        */
/* -------------------------------------------------------------------------- */
export function Day39VisionScene({ preview }: SceneProps) {
  const space = preview.day39ColorSpace;
  const lowLight = preview.day39LowLight;
  const distCm = preview.day39ArucoDistCm;

  const detected = !(space === 'rgb' && lowLight);
  const fx = 620;
  const arucoRealCm = 10;
  const pxWidth = Math.round((fx * arucoRealCm) / distCm);

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Left: Camera Viewfinder Feed */}
      <g transform="translate(20, 20)">
        <rect
          x="0"
          y="0"
          width="394"
          height="340"
          rx="10"
          fill={lowLight ? '#1E293B' : '#E2E8F0'}
          stroke="#475569"
          strokeWidth="2"
        />
        <text x="16" y="24" fontSize="11" fontWeight="700" fill={lowLight ? '#F8FAFC' : '#0A2540'}>
          카메라 뷰파인더 ({lowLight ? '저조도 그림자 환경' : '표준 밝은 조명'})
        </text>

        {/* Red Target Object */}
        <circle
          cx="116"
          cy="176"
          r="42"
          fill={lowLight ? '#7F1D1D' : '#EF4444'}
          stroke={detected ? '#10B981' : '#EF4444'}
          strokeWidth="3"
        />
        {detected ? (
          <rect x="64" y="124" width="104" height="104" fill="none" stroke="#10B981" strokeWidth="2.5" strokeDasharray="5 3" />
        ) : (
          <text x="116" y="180" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FCA5A5">
            검출 실패 (RGB 어두움)
          </text>
        )}
        <text x="116" y="248" textAnchor="middle" fontSize="10" fontWeight="700" fill={detected ? '#10B981' : '#F87171'}>
          {detected ? `✓ ${space.toUpperCase()} 윤곽선 중심 (116, 176) 추적 OK` : '✗ Tracking Lost!'}
        </text>

        {/* ArUco Marker Scaling with Distance */}
        {(() => {
          const box = Math.max(22, Math.min(110, Math.round(pxWidth * 0.72)));
          const ax = 286 - box / 2;
          const ay = 176 - box / 2;
          return (
            <g>
              <rect x={ax} y={ay} width={box} height={box} fill="#FFFFFF" stroke="#635BFF" strokeWidth="2.5" />
              <rect x={ax + box * 0.16} y={ay + box * 0.16} width={box * 0.68} height={box * 0.68} fill="#0F172A" />
              <rect x={ax + box * 0.3} y={ay + box * 0.3} width={box * 0.25} height={box * 0.4} fill="#FFFFFF" />
              <text x="286" y="256" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="700" fill={lowLight ? '#A5B4FC' : '#4338CA'}>
                ArUco ID:7 · 폭 {pxWidth} px
              </text>
            </g>
          );
        })()}
      </g>

      {/* Right Pinhole 3D Calculation */}
      <g transform="translate(428, 20)">
        <rect x="0" y="0" width="252" height="340" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          비전 &amp; 핀홀 PnP 3D 역산
        </text>

        <rect x="16" y="48" width="220" height="82" rx="8" fill="#1E293B" />
        <text x="28" y="70" fontSize="9.5" fill="#94A3B8">역산된 ArUco 3D 거리 Z</text>
        <text x="28" y="106" fontSize="22" fontFamily="monospace" fontWeight="700" fill="#34D399">
          {distCm} cm
        </text>

        <rect x="16" y="144" width="220" height="72" rx="8" fill="#1E293B" />
        <text x="28" y="166" fontSize="9.5" fill="#94A3B8">이미지상 가로 픽셀 (w_px)</text>
        <text x="28" y="196" fontSize="18" fontFamily="monospace" fontWeight="700" fill="#38BDF8">
          {pxWidth} px (fx=620)
        </text>

        <rect x="16" y="232" width="220" height="90" rx="8" fill="#020617" stroke="#334155" />
        <text x="26" y="256" fontSize="10" fontFamily="monospace" fill="#FBBF24">
          Z = (fx × W_real) / w_px
        </text>
        <foreignObject x="26" y="264" width="200" height="50">
          <p className="text-[10px] leading-[1.45] text-[#CBD5E1]">
            HSV는 밝기(V)와 분리된 색상(H)을 보므로 그림자가 져도 목표물을 안정적으로 찾습니다.
          </p>
        </foreignObject>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 40: Monte Carlo Localization (Particle Filter) 4 Stages                */
/* -------------------------------------------------------------------------- */
export function Day40MclParticleScene({ preview, onChangePreview }: SceneProps) {
  const stage = preview.day40MclStage;

  // Deterministic particle coordinates per stage across symmetric rooms
  const truePose = stage === 3 ? { x: 295, y: 120 } : { x: 145, y: 145 };

  const particles: { x: number; y: number; r: number }[] = [];
  if (stage === 0 || stage === 3) {
    // Spread across the entire map
    for (let i = 0; i < 42; i++) {
      particles.push({
        x: 34 + ((i * 67) % 340),
        y: 54 + ((i * 53) % 190),
        r: 3.5,
      });
    }
  } else if (stage === 1) {
    // Bimodal symmetry hypothesis: Room A (x~145) & Room B (x~295)
    for (let i = 0; i < 18; i++) {
      particles.push({ x: 120 + (i % 5) * 12, y: 125 + Math.floor(i / 5) * 11, r: 4 });
      particles.push({ x: 270 + (i % 5) * 12, y: 125 + Math.floor(i / 5) * 11, r: 3.5 });
    }
  } else {
    // Stage 2: Converged sharply around true robot pose
    for (let i = 0; i < 32; i++) {
      const ang = (i / 32) * Math.PI * 2;
      const rad = (i % 4) * 5;
      particles.push({
        x: truePose.x + Math.cos(ang) * rad,
        y: truePose.y + Math.sin(ang) * rad,
        r: 4,
      });
    }
  }

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Top Stage Buttons */}
      <g transform="translate(20, 18)">
        {[
          { s: 0 as const, label: '0. 전역 살포' },
          { s: 1 as const, label: '1. 다봉 가설(우도)' },
          { s: 2 as const, label: '2. 리샘플링 수렴' },
          { s: 3 as const, label: '3. 납치 복구(재살포)' },
        ].map((btn, i) => {
          const active = stage === btn.s;
          return (
            <g
              key={btn.s}
              transform={`translate(${i * 166}, 0)`}
              onClick={() => onChangePreview({ day40MclStage: btn.s })}
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

      {/* Map + Particles */}
      <g transform="translate(20, 58)">
        <rect x="0" y="0" width="420" height="300" rx="10" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
        {/* Symmetric Room Divider */}
        <rect x="206" y="42" width="12" height="128" fill="#334155" />

        {/* Particle Cloud */}
        {particles.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r={pt.r} fill="#EF4444" fillOpacity="0.65" />
        ))}

        {/* True Robot */}
        <circle cx={truePose.x} cy={truePose.y} r="11" fill="#0A2540" stroke="#10B981" strokeWidth="2.5" />
        <text x="16" y="282" fontSize="10" fontWeight="700" fill="#0A2540">
          빨간 점 = 파티클 후보 가설 · 진파랑 원 = 실제 로봇 위치
        </text>
      </g>

      {/* Right MCL Explanation */}
      <g transform="translate(454, 58)">
        <rect x="0" y="0" width="224" height="300" rx="10" fill="#0F172A" />
        <text x="16" y="28" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          AMCL 상태 분석 (Stage {stage})
        </text>
        <foreignObject x="16" y="48" width="192" height="232">
          <p className="text-[11px] leading-[1.55] text-[#CBD5E1]">
            {stage === 0
              ? '초기 위치를 몰라 방 전체에 파티클이 고르게 흩뿌려져 있습니다.'
              : stage === 1
                ? '좌우 방 구조가 비슷해 두 방 모두에 높은 확률 가설 군집(Multi-modal)이 동시에 형성됩니다. EKF로는 불가능한 다중 후보 추적입니다.'
                : stage === 2
                  ? '리샘플링 결과 실제 로봇 위치에 파티클이 한 점으로 날카롭게 수렴했습니다!'
                  : '납치 문제 발생! 기존 위치와 LiDAR 관측 우도가 급감하자 AMCL이 전체 지도 위로 무작위 파티클을 재살포해 새 위치를 찾아냅니다.'}
          </p>
        </foreignObject>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 41: Occupancy Grid SLAM & Loop Closure Double-Wall Correction          */
/* -------------------------------------------------------------------------- */
export function Day41SlamGridScene({ preview, onChangePreview }: SceneProps) {
  const loopOn = preview.day41LoopClosure;
  const drift = preview.day41OdomDriftDeg;

  const shiftPx = loopOn ? 0 : (drift / 20) * 32;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Left SLAM Map View */}
      <g transform="translate(22, 20)">
        <rect x="0" y="0" width="424" height="340" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#0A2540">
          점유 격자 지도 작성 (루프 클로저: {loopOn ? 'ON' : 'OFF'})
        </text>

        {/* Reference First-Pass Corridor Loop */}
        <rect x="64" y="64" width="286" height="214" rx="8" fill="none" stroke="#1E293B" strokeWidth="6" />
        <rect x="136" y="122" width="142" height="98" rx="4" fill="#CBD5E1" stroke="#334155" strokeWidth="3" />

        {/* Second-Pass Drifted Wall Overlay if Loop Closure OFF */}
        {!loopOn && shiftPx > 2 && (
          <g transform={`translate(${shiftPx}, ${shiftPx * 0.6}) rotate(${drift * 0.55} 207 171)`}>
            <rect
              x="64"
              y="64"
              width="286"
              height="214"
              rx="8"
              fill="none"
              stroke="#EF4444"
              strokeWidth="4"
              strokeDasharray="6 4"
            />
          </g>
        )}

        {/* Loop Closure Link */}
        {loopOn && (
          <g>
            <circle cx="96" cy="248" r="14" fill="#10B981" fillOpacity="0.25" stroke="#10B981" strokeWidth="2.5" />
            <text x="116" y="252" fontSize="10" fontWeight="700" fill="#059669">
              ✓ Loop Closure 스캔 정합 완료!
            </text>
          </g>
        )}

        <text x="16" y="320" fontSize="10" fontWeight="700" fill={loopOn ? '#059669' : '#DC2626'}>
          {loopOn
            ? 'Pose-Graph 최적화로 찌그러진 과거 궤적을 펴서 깨끗한 단일 벽 지도 완성!'
            : `⚠ 오도메트리 드리프트(${drift}°) 누적 → 출발점 복귀 시 벽이 두 겹(Double Wall)으로 어긋남`}
        </text>
      </g>

      {/* Right Control Panel */}
      <g transform="translate(460, 20)">
        <rect x="0" y="0" width="218" height="340" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          SLAM 그래프 최적화
        </text>

        <g
          onClick={() => onChangePreview({ day41LoopClosure: !loopOn })}
          className="cursor-pointer"
        >
          <rect x="16" y="48" width="186" height="34" rx="7" fill={loopOn ? '#10B981' : '#EF4444'} />
          <text x="109" y="69" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
            루프 클로저: {loopOn ? 'ON (정합)' : 'OFF (어긋남)'}
          </text>
        </g>

        <rect x="16" y="102" width="186" height="218" rx="8" fill="#020617" stroke="#334155" />
        <text x="26" y="128" fontSize="10" fontFamily="monospace" fontWeight="700" fill="#38BDF8">
          l_t = l_(t-1) + l_sensor
        </text>
        <foreignObject x="26" y="138" width="166" height="164">
          <p className="text-[10.5px] leading-[1.5] text-[#CBD5E1]">
            점유 격자 지도는 Log-Odds 덧셈으로 벽(검정)과 빈 공간(흰색)을 기록하고, 루프 클로저가 재방문 순간의 일치 오차를 전체 경로에 역분배해 지도를 반듯하게 폅니다.
          </p>
        </foreignObject>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Day 42: Phase 5 Capstone — Maze SLAM + A* + DWA Navigation                 */
/* -------------------------------------------------------------------------- */
export function Day42MazeProjectScene({ preview, onChangePreview }: SceneProps) {
  const mode = preview.day42NavMode;
  const blocked = preview.day42ObstacleBlocked;

  const cols = 10;
  const rows = 7;
  const mazeWalls: [number, number][] = [
    [2, 0], [2, 1], [2, 2], [2, 3], [2, 4],
    [5, 2], [5, 3], [5, 4], [5, 5], [5, 6],
    [7, 1], [7, 2], [7, 3],
  ];

  // Static A* ignores dynamic box; full_nav includes dynamic box at [4, 1] and inflates!
  const dynWalls: [number, number][] =
    blocked && mode === 'full_nav' ? [...mazeWalls, [4, 1]] : mazeWalls;

  const { path, baseSet } = computeGridAStar(
    cols,
    rows,
    dynWalls,
    mode === 'full_nav',
    [0, 1],
    [9, 5],
  );

  const collisionAtBox = mode === 'astar_only' && blocked;

  return (
    <svg viewBox="0 0 700 380" className="h-full w-full select-none">
      <rect x="8" y="8" width="684" height="364" rx="12" fill="#FFFFFF" stroke="#E6E8EC" />

      {/* Left Maze Simulator */}
      <g transform="translate(20, 20)">
        <rect x="0" y="0" width="424" height="340" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="16" y="24" fontSize="11.5" fontWeight="700" fill="#0A2540">
          미로 자율주행 통합 (SLAM 격자 + A* + DWA)
        </text>

        <g transform="translate(22, 42)">
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((__, c) => {
              const k = `${c},${r}`;
              const isWall = baseSet.has(k);
              const isDynBox = blocked && c === 4 && r === 1;
              const isStart = c === 0 && r === 1;
              const isGoal = c === 9 && r === 5;
              return (
                <rect
                  key={k}
                  x={c * 38}
                  y={r * 36}
                  width="36"
                  height="34"
                  rx="4"
                  fill={
                    isDynBox
                      ? '#F59E0B'
                      : isWall
                        ? '#1E293B'
                        : isStart
                          ? '#10B981'
                          : isGoal
                            ? '#635BFF'
                            : '#FFFFFF'
                  }
                  stroke="#E2E8F0"
                />
              );
            }),
          )}

          {path.length > 1 && (
            <polyline
              points={path.map(([c, r]) => `${c * 38 + 18},${r * 36 + 17}`).join(' ')}
              fill="none"
              stroke={collisionAtBox ? '#EF4444' : '#10B981'}
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}

          {collisionAtBox && (
            <circle cx={4 * 38 + 18} cy={1 * 36 + 17} r="14" fill="none" stroke="#EF4444" strokeWidth="3" />
          )}
        </g>

        <text x="16" y="320" fontSize="10" fontWeight="700" fill={collisionAtBox ? '#DC2626' : '#059669'}>
          {collisionAtBox
            ? '✗ 충돌! A* 단독 추종이 새로 놓인 상자(주황)를 보지 못하고 정면 충돌'
            : '✓ C-Space + DWA 실시간 회피로 미로 탈출 목표(G) 무충돌 도착!'}
        </text>
      </g>

      {/* Right Navigation Controls */}
      <g transform="translate(458, 20)">
        <rect x="0" y="0" width="220" height="340" rx="10" fill="#0F172A" />
        <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="#F8FAFC">
          자율주행 스택 컨트롤
        </text>

        <g
          onClick={() =>
            onChangePreview({ day42NavMode: mode === 'astar_only' ? 'full_nav' : 'astar_only' })
          }
          className="cursor-pointer"
        >
          <rect x="16" y="48" width="188" height="36" rx="7" fill={mode === 'full_nav' ? '#10B981' : '#EF4444'} />
          <text x="110" y="70" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
            {mode === 'full_nav' ? '통합 자율주행 (A* + DWA)' : '정적 A* 단독 추종'}
          </text>
        </g>

        <g
          onClick={() => onChangePreview({ day42ObstacleBlocked: !blocked })}
          className="cursor-pointer"
        >
          <rect x="16" y="96" width="188" height="36" rx="7" fill={blocked ? '#F59E0B' : '#1E293B'} stroke="#334155" />
          <text x="110" y="118" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
            돌발 박스: {blocked ? '경로 위 배치 ON' : '없음 OFF'}
          </text>
        </g>

        <rect x="16" y="150" width="188" height="170" rx="8" fill="#020617" stroke="#334155" />
        <foreignObject x="26" y="164" width="168" height="146">
          <p className="text-[10.5px] leading-[1.5] text-[#CBD5E1]">
            전역 A*가 지도를 따라 대로를 짜고, 20Hz DWA + Raytrace Clearing이 방금 나타난 상자를 피해 아래 통로로 실시간 재계획합니다.
          </p>
        </foreignObject>
      </g>
    </svg>
  );
}
