import { useMemo, useState } from 'react';
import { BOARDS_CATALOG } from '../../data/boardsCatalog';
import {
  BOARD_CANVAS_CENTER,
  WORKBENCH_BOARD_PINS,
  WORKBENCH_COMPONENT_DEFS,
  WORKBENCH_SLOTS,
} from '../../data/workbenchData';
import {
  BoardId,
  WbBoardPin,
  WbComponentInstance,
  WbWire,
} from '../../types/lab';
import { WorkbenchAnalysisResult } from '../../utils/workbenchRules';

interface WorkbenchCanvasSvgProps {
  boardId: BoardId;
  components: WbComponentInstance[];
  wires: WbWire[];
  pendingPinRef: string | null;
  analysis: WorkbenchAnalysisResult;
  isRunning: boolean;
  buttonPressed: boolean;
  potPercent: number;
  sonarDistanceCm: number;
  onClickPin: (pinRef: string) => void;
  onRemoveWire: (wireId: string) => void;
  onRemoveComponent: (uid: string) => void;
  onToggleButtonPressed: () => void;
}

function getPinRoleColor(role: WbBoardPin['role']) {
  switch (role) {
    case 'power_5v':
    case 'vin':
      return '#EF4444';
    case 'power_3v3':
      return '#F59E0B';
    case 'gnd':
      return '#1E293B';
    case 'prohibited':
      return '#E11D48';
    case 'input_only':
      return '#0EA5E9';
    default:
      return '#635BFF';
  }
}

export function WorkbenchCanvasSvg({
  boardId,
  components,
  wires,
  pendingPinRef,
  analysis,
  isRunning,
  buttonPressed,
  potPercent,
  sonarDistanceCm,
  onClickPin,
  onRemoveWire,
  onRemoveComponent,
  onToggleButtonPressed,
}: WorkbenchCanvasSvgProps) {
  const [hoveredWireId, setHoveredWireId] = useState<string | null>(null);
  const [hoveredPinRef, setHoveredPinRef] = useState<string | null>(null);

  const board = useMemo(
    () => BOARDS_CATALOG.find((b) => b.id === boardId) ?? BOARDS_CATALOG[0],
    [boardId],
  );
  const boardPins = WORKBENCH_BOARD_PINS[boardId];

  // Build map from pinRef -> absolute SVG [x, y]
  const pinCoords = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    for (const p of boardPins) {
      map.set(`board:${p.id}`, {
        x: BOARD_CANVAS_CENTER.x + p.x,
        y: BOARD_CANVAS_CENTER.y + p.y,
      });
    }
    for (const comp of components) {
      const slot = WORKBENCH_SLOTS[comp.slotIndex];
      const def = WORKBENCH_COMPONENT_DEFS[comp.type];
      if (!slot || !def) continue;
      for (const p of def.pins) {
        map.set(`${comp.uid}:${p.id}`, {
          x: slot.x + p.x,
          y: slot.y + p.y,
        });
      }
    }
    return map;
  }, [boardPins, components]);

  return (
    <svg
      viewBox="0 0 780 470"
      className="h-full w-full select-none bg-[#F7F9FC]"
      role="img"
      aria-label={`${board.name} 인터랙티브 배선 작업대`}
    >
      <defs>
        <pattern
          id="wb-grid"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 24 0 L 0 0 0 24"
            fill="none"
            stroke="#E5EAF2"
            strokeWidth="1"
          />
        </pattern>
        <filter id="led-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="780" height="470" fill="url(#wb-grid)" />

      {/* Subtle Empty Slot Guides */}
      {WORKBENCH_SLOTS.map((slot, idx) => {
        const occupied = components.some((c) => c.slotIndex === idx);
        if (occupied) return null;
        return (
          <g key={idx} transform={`translate(${slot.x}, ${slot.y})`}>
            <rect
              x="-66"
              y="-46"
              width="132"
              height="92"
              rx="10"
              fill="#FFFFFF"
              fillOpacity="0.45"
              stroke="#CBD5E1"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <text
              x="0"
              y="4"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="#94A3B8"
            >
              빈 부품 슬롯 ({slot.zone})
            </text>
          </g>
        );
      })}

      {/* Central MCU / SBC Board */}
      <g
        transform={`translate(${BOARD_CANVAS_CENTER.x}, ${BOARD_CANVAS_CENTER.y})`}
      >
        {/* Main PCB Shadow + Body */}
        <rect
          x="-86"
          y="-168"
          width="172"
          height="336"
          rx="14"
          fill="#0A2540"
          fillOpacity="0.08"
          transform="translate(3, 5)"
        />
        <rect
          x="-86"
          y="-168"
          width="172"
          height="336"
          rx="14"
          fill={board.pcbColor}
          stroke={board.pcbAccent}
          strokeWidth="2.5"
        />

        {/* USB Connector at Top */}
        <rect
          x="-28"
          y="-176"
          width="56"
          height="24"
          rx="4"
          fill="#CBD5E1"
          stroke="#64748B"
          strokeWidth="1.5"
        />
        <text
          x="0"
          y="-161"
          textAnchor="middle"
          fontSize="8"
          fontWeight="700"
          fill="#334155"
        >
          USB
        </text>

        {/* Center MCU Chip Silhouette */}
        <rect
          x="-32"
          y="-54"
          width="64"
          height="72"
          rx="6"
          fill="#0F172A"
          stroke="#334155"
          strokeWidth="1.5"
        />
        <text
          x="0"
          y="-22"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="#F8FAFC"
        >
          {board.shortName}
        </text>
        <text
          x="0"
          y="-6"
          textAnchor="middle"
          fontSize="9"
          fontFamily="monospace"
          fill="#94A3B8"
        >
          {board.logicVoltage} LOGIC
        </text>

        {/* Power / Status LED on Board */}
        <circle
          cx="0"
          cy="52"
          r="6"
          fill={
            !isRunning
              ? '#475569'
              : analysis.status === 'danger'
                ? '#EF4444'
                : '#10B981'
          }
          filter={isRunning ? 'url(#led-glow)' : undefined}
        />
        <text
          x="0"
          y="70"
          textAnchor="middle"
          fontSize="8"
          fontWeight="700"
          fill="#E2E8F0"
        >
          {!isRunning
            ? 'PWR 대기'
            : analysis.status === 'danger'
              ? '보호 차단!'
              : 'PWR ON'}
        </text>

        {/* Board Clickable Pins */}
        {boardPins.map((pin) => {
          const ref = `board:${pin.id}`;
          const isPending = pendingPinRef === ref;
          const isHovered = hoveredPinRef === ref;
          const color = getPinRoleColor(pin.role);
          const isLeft = pin.side === 'left';

          return (
            <g
              key={pin.id}
              transform={`translate(${pin.x}, ${pin.y})`}
              onClick={() => onClickPin(ref)}
              onMouseEnter={() => setHoveredPinRef(ref)}
              onMouseLeave={() => setHoveredPinRef(null)}
              className="cursor-pointer"
            >
              {/* Invisible generous hit area */}
              <circle r="14" fill="transparent" />
              {/* Selection halo */}
              {(isPending || isHovered) && (
                <circle
                  r="11"
                  fill="none"
                  stroke={isPending ? '#635BFF' : '#0A2540'}
                  strokeWidth="2"
                  strokeDasharray={isPending ? '3 2' : undefined}
                />
              )}
              {/* Gold header pad */}
              <circle
                r="6.5"
                fill="#FDE68A"
                stroke={color}
                strokeWidth="2.5"
              />
              <circle r="2.2" fill="#0F172A" />

              {/* Pin Label Pill inside board */}
              <text
                x={isLeft ? 12 : -12}
                y="3.5"
                textAnchor={isLeft ? 'start' : 'end'}
                fontSize="9.5"
                fontFamily="monospace"
                fontWeight="700"
                fill={
                  pin.role === 'prohibited'
                    ? '#FDA4AF'
                    : pin.role === 'power_5v'
                      ? '#FCA5A5'
                      : pin.role === 'power_3v3'
                        ? '#FCD34D'
                        : '#F8FAFC'
                }
              >
                {pin.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* Placed Components */}
      {components.map((comp) => {
        const slot = WORKBENCH_SLOTS[comp.slotIndex];
        const def = WORKBENCH_COMPONENT_DEFS[comp.type];
        if (!slot || !def) return null;

        const ledState = analysis.ledStates[comp.uid];
        const servoState = analysis.servoStates[comp.uid];
        const sonarState = analysis.sonarStates[comp.uid];
        const potState = analysis.potStates[comp.uid];
        const btnState = analysis.buttonStates[comp.uid];

        return (
          <g key={comp.uid} transform={`translate(${slot.x}, ${slot.y})`}>
            {/* Component Base Card */}
            <rect
              x="-66"
              y="-46"
              width="132"
              height="92"
              rx="10"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="1.5"
            />

            {/* Remove Component Badge */}
            <g
              transform="translate(54, -34)"
              onClick={() => onRemoveComponent(comp.uid)}
              className="cursor-pointer opacity-75 hover:opacity-100"
            >
              <circle r="8" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
              <text
                x="0"
                y="3.5"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#64748B"
              >
                ×
              </text>
            </g>

            {/* Component Title */}
            <text
              x="-56"
              y="-30"
              fontSize="9.5"
              fontWeight="700"
              fill="#0A2540"
            >
              {def.shortName}
            </text>

            {/* Component-Specific Visual Body */}
            {comp.type === 'led' && (
              <g>
                {ledState?.lit && (
                  <circle
                    cx="0"
                    cy="2"
                    r="24"
                    fill="#EF4444"
                    opacity="0.25"
                    filter="url(#led-glow)"
                  />
                )}
                <circle
                  cx="0"
                  cy="2"
                  r="14"
                  fill={
                    ledState?.burned
                      ? '#1F2937'
                      : ledState?.lit
                        ? '#EF4444'
                        : '#FECACA'
                  }
                  stroke={ledState?.burned ? '#EF4444' : '#DC2626'}
                  strokeWidth="2"
                />
                {ledState?.burned && (
                  <text
                    x="0"
                    y="6"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="800"
                    fill="#FCA5A5"
                  >
                    POP!
                  </text>
                )}
                {ledState?.reversed && (
                  <text
                    x="0"
                    y="24"
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="700"
                    fill="#D97706"
                  >
                    극성 반대
                  </text>
                )}
              </g>
            )}

            {comp.type === 'resistor_220' && (
              <g>
                <line
                  x1="-38"
                  y1="0"
                  x2="38"
                  y2="0"
                  stroke="#94A3B8"
                  strokeWidth="3"
                />
                <rect
                  x="-26"
                  y="-11"
                  width="52"
                  height="22"
                  rx="6"
                  fill="#FDE68A"
                  stroke="#D97706"
                  strokeWidth="1.5"
                />
                <rect x="-17" y="-11" width="4" height="22" fill="#DC2626" />
                <rect x="-7" y="-11" width="4" height="22" fill="#DC2626" />
                <rect x="3" y="-11" width="4" height="22" fill="#92400E" />
                <rect x="14" y="-11" width="4" height="22" fill="#D97706" />
                <text
                  x="0"
                  y="24"
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="700"
                  fill="#B45309"
                >
                  220Ω 보호 저항
                </text>
              </g>
            )}

            {comp.type === 'button' && (
              <g
                onClick={onToggleButtonPressed}
                className="cursor-pointer"
              >
                <rect
                  x="-22"
                  y="-18"
                  width="44"
                  height="34"
                  rx="6"
                  fill="#E2E8F0"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                />
                <circle
                  cx="0"
                  cy="-1"
                  r="11"
                  fill={buttonPressed ? '#635BFF' : '#0A2540'}
                />
                <text
                  x="0"
                  y="24"
                  textAnchor="middle"
                  fontSize="8.5"
                  fontWeight="700"
                  fill={btnState?.active && buttonPressed ? '#4F46E5' : '#64748B'}
                >
                  {buttonPressed ? '눌림 (클릭해제)' : '클릭해 누르기'}
                </text>
              </g>
            )}

            {comp.type === 'hcsr04' && (
              <g>
                <rect
                  x="-46"
                  y="-18"
                  width="92"
                  height="38"
                  rx="6"
                  fill="#0284C7"
                  stroke="#0369A1"
                  strokeWidth="1.5"
                />
                <circle cx="-22" cy="1" r="12" fill="#E2E8F0" stroke="#64748B" />
                <circle cx="-22" cy="1" r="6" fill="#0F172A" />
                <circle cx="22" cy="1" r="12" fill="#E2E8F0" stroke="#64748B" />
                <circle cx="22" cy="1" r="6" fill="#0F172A" />
                {sonarState?.active && (
                  <text
                    x="0"
                    y="-22"
                    textAnchor="middle"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="700"
                    fill="#0284C7"
                  >
                    {sonarDistanceCm} cm
                  </text>
                )}
                {sonarState?.overvoltage && (
                  <text
                    x="0"
                    y="-22"
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="700"
                    fill="#E11D48"
                  >
                    5V ECHO 위험!
                  </text>
                )}
              </g>
            )}

            {comp.type === 'divider' && (
              <g>
                <rect
                  x="-46"
                  y="-16"
                  width="92"
                  height="30"
                  rx="6"
                  fill="#EEF2FF"
                  stroke="#635BFF"
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="3"
                  textAnchor="middle"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="700"
                  fill="#4F46E5"
                >
                  5V → 3.3V 분배
                </text>
              </g>
            )}

            {comp.type === 'servo' && (
              <g>
                <rect
                  x="-36"
                  y="-16"
                  width="72"
                  height="36"
                  rx="5"
                  fill="#2563EB"
                  stroke="#1D4ED8"
                  strokeWidth="1.5"
                />
                <circle cx="14" cy="2" r="12" fill="#1E40AF" />
                {/* Rotating Servo Horn */}
                <g
                  transform={`translate(14, 2) rotate(${
                    (servoState?.active ? servoState.targetDeg : 90) - 90
                  })`}
                >
                  <rect
                    x="-4"
                    y="-22"
                    width="8"
                    height="26"
                    rx="4"
                    fill="#F8FAFC"
                    stroke="#CBD5E1"
                  />
                  <circle cx="0" cy="0" r="3" fill="#0F172A" />
                </g>
                <text
                  x="-18"
                  y="5"
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="700"
                  fill="#FFFFFF"
                >
                  {servoState?.brownout
                    ? '3.3V↓'
                    : servoState?.active
                      ? `${servoState.targetDeg}°`
                      : 'SG90'}
                </text>
              </g>
            )}

            {comp.type === 'pot' && (
              <g>
                <circle
                  cx="0"
                  cy="0"
                  r="18"
                  fill="#E2E8F0"
                  stroke="#64748B"
                  strokeWidth="2"
                />
                <g
                  transform={`rotate(${(potPercent / 100) * 260 - 130})`}
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="-14"
                    stroke="#635BFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </g>
                <text
                  x="0"
                  y="-22"
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="700"
                  fill="#0A2540"
                >
                  {potState?.active
                    ? `${potState.adcValue} (${potState.voltage}V)`
                    : `${potPercent}%`}
                </text>
              </g>
            )}

            {comp.type === 'battery_5v' && (
              <g>
                <rect
                  x="-38"
                  y="-16"
                  width="76"
                  height="32"
                  rx="6"
                  fill="#0F172A"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="700"
                  fill="#FBBF24"
                >
                  5.0V PACK
                </text>
              </g>
            )}

            {/* Component Clickable Pins */}
            {def.pins.map((cp) => {
              const ref = `${comp.uid}:${cp.id}`;
              const isPending = pendingPinRef === ref;
              const isHovered = hoveredPinRef === ref;
              const pinFill =
                cp.kind === 'power'
                  ? '#EF4444'
                  : cp.kind === 'gnd'
                    ? '#1E293B'
                    : '#635BFF';

              return (
                <g
                  key={cp.id}
                  transform={`translate(${cp.x}, ${cp.y})`}
                  onClick={() => onClickPin(ref)}
                  onMouseEnter={() => setHoveredPinRef(ref)}
                  onMouseLeave={() => setHoveredPinRef(null)}
                  className="cursor-pointer"
                >
                  <circle r="13" fill="transparent" />
                  {(isPending || isHovered) && (
                    <circle
                      r="10"
                      fill="none"
                      stroke={isPending ? '#635BFF' : '#0A2540'}
                      strokeWidth="2"
                    />
                  )}
                  <circle
                    r="6"
                    fill="#FFFFFF"
                    stroke={pinFill}
                    strokeWidth="2.5"
                  />
                  <text
                    x="0"
                    y={cp.y > 0 ? 16 : -10}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="700"
                    fill="#334155"
                  >
                    {cp.label}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Jumper Wires (Cubic Bezier Curves with Click-to-Delete) */}
      {wires.map((w) => {
        const p1 = pinCoords.get(w.fromRef);
        const p2 = pinCoords.get(w.toRef);
        if (!p1 || !p2) return null;

        const dx = Math.abs(p2.x - p1.x);
        const arc = Math.min(70, 22 + dx * 0.22);
        const c1x = p1.x + (p2.x >= p1.x ? arc : -arc) * 0.55;
        const c2x = p2.x + (p1.x >= p2.x ? arc : -arc) * 0.55;
        const c1y = p1.y - 26;
        const c2y = p2.y - 26;
        const d = `M ${p1.x} ${p1.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
        const isHovered = hoveredWireId === w.id;

        return (
          <g
            key={w.id}
            onClick={() => onRemoveWire(w.id)}
            onMouseEnter={() => setHoveredWireId(w.id)}
            onMouseLeave={() => setHoveredWireId(null)}
            className="cursor-pointer"
          >
            {/* Generous invisible hit path */}
            <path d={d} fill="none" stroke="transparent" strokeWidth="14" />
            {/* Crisp wire */}
            <path
              d={d}
              fill="none"
              stroke={isHovered ? '#E11D48' : w.color}
              strokeWidth={isHovered ? 5 : 3.5}
              strokeLinecap="round"
              opacity={isHovered ? 0.95 : 0.9}
            />
            <circle cx={p1.x} cy={p1.y} r="4.5" fill="#111827" />
            <circle cx={p2.x} cy={p2.y} r="4.5" fill="#111827" />
            {isHovered && (
              <g
                transform={`translate(${(p1.x + p2.x) / 2}, ${
                  (p1.y + p2.y) / 2 - 22
                })`}
              >
                <rect
                  x="-26"
                  y="-10"
                  width="52"
                  height="18"
                  rx="5"
                  fill="#0A2540"
                />
                <text
                  x="0"
                  y="2.5"
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="700"
                  fill="#FFFFFF"
                >
                  선 지우기
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
