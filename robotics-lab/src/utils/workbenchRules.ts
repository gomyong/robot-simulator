import { BOARDS_CATALOG } from '../data/boardsCatalog';
import { WORKBENCH_BOARD_PINS } from '../data/workbenchData';
import {
  BoardId,
  WbBoardPin,
  WbComponentInstance,
  WbDiagnostic,
  WbWire,
} from '../types/lab';

export interface WorkbenchAnalysisResult {
  status: 'idle' | 'ok' | 'warning' | 'danger';
  diagnostics: WbDiagnostic[];
  ledStates: Record<
    string,
    { lit: boolean; burned: boolean; reversed: boolean; pinLabel?: string }
  >;
  servoStates: Record<
    string,
    { active: boolean; brownout: boolean; targetDeg: number; pinLabel?: string }
  >;
  sonarStates: Record<
    string,
    { active: boolean; overvoltage: boolean; distanceCm: number }
  >;
  potStates: Record<
    string,
    { active: boolean; adcValue: number; voltage: number; overvoltage: boolean }
  >;
  buttonStates: Record<string, { active: boolean; pinLabel?: string }>;
  generatedCodeTitle: string;
  generatedCodeLanguage: 'cpp' | 'python';
  generatedCode: string;
  serialPreviewLines: string[];
}

interface TraceEdge {
  to: string;
  viaResistor: boolean;
}

export function analyzeWorkbenchCircuit({
  boardId,
  components,
  wires,
  isRunning,
  buttonPressed,
  sonarDistanceCm,
  potPercent,
}: {
  boardId: BoardId;
  components: WbComponentInstance[];
  wires: WbWire[];
  isRunning: boolean;
  buttonPressed: boolean;
  sonarDistanceCm: number;
  potPercent: number;
}): WorkbenchAnalysisResult {
  const boardSpec =
    BOARDS_CATALOG.find((b) => b.id === boardId) ?? BOARDS_CATALOG[0];
  const boardPins = WORKBENCH_BOARD_PINS[boardId];
  const pinMap = new Map<string, WbBoardPin>();
  for (const p of boardPins) pinMap.set(`board:${p.id}`, p);

  // Build direct adjacency graph (wires only)
  const directAdj = new Map<string, Set<string>>();
  const addDirectEdge = (a: string, b: string) => {
    if (!directAdj.has(a)) directAdj.set(a, new Set());
    if (!directAdj.has(b)) directAdj.set(b, new Set());
    directAdj.get(a)!.add(b);
    directAdj.get(b)!.add(a);
  };
  for (const w of wires) {
    addDirectEdge(w.fromRef, w.toRef);
  }

  // Build resistor-aware adjacency graph (wires + resistor_220 internal bridge)
  const conductiveAdj = new Map<string, TraceEdge[]>();
  const addCondEdge = (a: string, b: string, viaResistor: boolean) => {
    if (!conductiveAdj.has(a)) conductiveAdj.set(a, []);
    if (!conductiveAdj.has(b)) conductiveAdj.set(b, []);
    conductiveAdj.get(a)!.push({ to: b, viaResistor });
    conductiveAdj.get(b)!.push({ to: a, viaResistor });
  };
  for (const w of wires) {
    addCondEdge(w.fromRef, w.toRef, false);
  }
  for (const comp of components) {
    if (comp.type === 'resistor_220') {
      addCondEdge(`${comp.uid}:a`, `${comp.uid}:b`, true);
    }
  }

  const getDirectNet = (start: string): Set<string> => {
    const visited = new Set<string>([start]);
    const queue = [start];
    while (queue.length > 0) {
      const cur = queue.shift()!;
      for (const nxt of directAdj.get(cur) ?? []) {
        if (!visited.has(nxt)) {
          visited.add(nxt);
          queue.push(nxt);
        }
      }
    }
    return visited;
  };

  // BFS over conductive graph returning shortest resistor count to each node
  const getConductiveReach = (
    start: string,
  ): Map<string, { resistorCount: number }> => {
    const best = new Map<string, { resistorCount: number }>();
    best.set(start, { resistorCount: 0 });
    const queue: { node: string; res: number }[] = [{ node: start, res: 0 }];
    while (queue.length > 0) {
      const { node, res } = queue.shift()!;
      for (const edge of conductiveAdj.get(node) ?? []) {
        const nextRes = res + (edge.viaResistor ? 1 : 0);
        const prev = best.get(edge.to);
        if (!prev || nextRes < prev.resistorCount) {
          best.set(edge.to, { resistorCount: nextRes });
          queue.push({ node: edge.to, res: nextRes });
        }
      }
    }
    return best;
  };

  const diagnostics: WbDiagnostic[] = [];
  const pushDiag = (diag: WbDiagnostic) => {
    if (!diagnostics.some((d) => d.id === diag.id)) {
      diagnostics.push(diag);
    }
  };

  const boardGndRefs = boardPins
    .filter((p) => p.role === 'gnd')
    .map((p) => `board:${p.id}`);

  const isBoardGndConnected = (directNet: Set<string>) =>
    boardGndRefs.some((g) => directNet.has(g));

  const batteryComps = components.filter((c) => c.type === 'battery_5v');
  const isPower5vNode = (ref: string) => {
    const bp = pinMap.get(ref);
    if (bp?.role === 'power_5v') return true;
    return batteryComps.some((b) => `${b.uid}:pos5v` === ref);
  };
  const isPower3v3Node = (ref: string) => {
    const bp = pinMap.get(ref);
    return bp?.role === 'power_3v3';
  };
  const isAnyGndNode = (ref: string) => {
    const bp = pinMap.get(ref);
    if (bp?.role === 'gnd') return true;
    return batteryComps.some((b) => `${b.uid}:gnd` === ref);
  };

  // 1. Global Short Circuit Check (5V/3.3V directly tied to GND or 5V tied to 3.3V)
  for (const p of boardPins) {
    if (p.role === 'power_5v' || p.role === 'power_3v3') {
      const net = getDirectNet(`board:${p.id}`);
      if (isBoardGndConnected(net) || [...net].some((r) => isAnyGndNode(r))) {
        pushDiag({
          id: `short-${p.id}`,
          severity: 'danger',
          title: `전원 합선(단락) 발생! (${p.label} ↔ GND)`,
          detail:
            '전원 플러스(+)와 GND(-)가 부품 없이 직접 연결되었습니다. 실제 보드에서는 즉시 과전류로 USB 포트가 차단되거나 기판이 탑니다.',
          relatedDay: {
            moduleId: 'day01_basics',
            dayNum: 1,
            label: 'Day 01 옴의 법칙 보기',
          },
        });
      }
      if (
        p.role === 'power_5v' &&
        [...net].some((r) => isPower3v3Node(r))
      ) {
        pushDiag({
          id: 'short-5v-3v3',
          severity: 'danger',
          title: '5V 전원과 3.3V 레일 직접 충돌!',
          detail:
            '5V 선이 3.3V 출력 레일에 바로 닿아 3.3V 칩들이 고전압으로 손상됩니다.',
          relatedDay: {
            moduleId: 'day05_divider',
            dayNum: 5,
            label: 'Day 05 전압 분배 보기',
          },
        });
      }
    }
  }

  // 2. Check Prohibited / Input-only / Overvoltage on all direct board pin nets
  for (const p of boardPins) {
    const net = getDirectNet(`board:${p.id}`);
    if (net.size <= 1) continue;

    if (p.role === 'prohibited') {
      pushDiag({
        id: `prohibited-${p.id}`,
        severity: 'danger',
        title: `사용 금지 핀(${p.label})에 배선됨!`,
        detail: `${boardSpec.shortName}의 ${p.label} 핀은 내부 SPI Flash 메모리와 직결되어 있어 부품을 꽂으면 부팅이 멈춥니다.`,
        relatedDay: {
          moduleId: 'esp32',
          dayNum: 9,
          label: 'Day 09 핀 안전 규율 보기',
        },
      });
    }

    if (boardSpec.logicVoltage === '3.3V' && (p.role === 'gpio' || p.role === 'input_only')) {
      if ([...net].some((r) => isPower5vNode(r))) {
        pushDiag({
          id: `ov-5v-${p.id}`,
          severity: 'danger',
          title: `3.3V 보드 핀(${p.label})에 5V 직결 위험!`,
          detail: `${boardSpec.shortName}의 GPIO 핀 최대 허용 전압은 3.3V입니다. 5V 전원을 바로 꽂으면 핀 내부 회로가 손상됩니다.`,
          relatedDay: {
            moduleId: 'day05_divider',
            dayNum: 5,
            label: 'Day 05 전압 분배기 보기',
          },
        });
      }
    }
  }

  // 3. Check Battery Common GND
  for (const batt of batteryComps) {
    const posNet = getDirectNet(`${batt.uid}:pos5v`);
    const gndNet = getDirectNet(`${batt.uid}:gnd`);
    if (posNet.size > 1 && gndNet.size > 1 && !isBoardGndConnected(gndNet)) {
      pushDiag({
        id: `common-gnd-${batt.uid}`,
        severity: 'warning',
        title: '공통 GND(접지) 누락!',
        detail:
          '외부 5V 배터리의 GND(-)가 보드의 GND와 연결되지 않았습니다. 보드와 외부 전원은 기준점(GND)을 서로 이어야 제어 신호가 통합니다.',
        relatedDay: {
          moduleId: 'day16_rover_project',
          dayNum: 16,
          label: 'Day 16 전원 분리 & 공통 GND',
        },
      });
    }
  }

  const ledStates: WorkbenchAnalysisResult['ledStates'] = {};
  const servoStates: WorkbenchAnalysisResult['servoStates'] = {};
  const sonarStates: WorkbenchAnalysisResult['sonarStates'] = {};
  const potStates: WorkbenchAnalysisResult['potStates'] = {};
  const buttonStates: WorkbenchAnalysisResult['buttonStates'] = {};

  const wiredGpioForCode: { role: string; pinLabel: string; gpioNum: number | null }[] = [];

  // Check if any button is wired and pressed
  let anyButtonClosed = false;
  for (const btn of components.filter((c) => c.type === 'button')) {
    const sigNet = getDirectNet(`${btn.uid}:sig`);
    const gndNet = getDirectNet(`${btn.uid}:gnd`);
    const gpioPin = [...sigNet]
      .map((r) => pinMap.get(r))
      .find((p): p is WbBoardPin => Boolean(p && (p.role === 'gpio' || p.role === 'input_only')));
    const gndOk = isBoardGndConnected(gndNet);

    if (gpioPin && gndOk) {
      buttonStates[btn.uid] = { active: true, pinLabel: gpioPin.label };
      wiredGpioForCode.push({
        role: 'BUTTON',
        pinLabel: gpioPin.label,
        gpioNum: gpioPin.gpio,
      });
      if (buttonPressed) anyButtonClosed = true;
    } else {
      buttonStates[btn.uid] = { active: false };
      if (sigNet.size > 1 || gndNet.size > 1) {
        pushDiag({
          id: `btn-inc-${btn.uid}`,
          severity: 'warning',
          title: '버튼 배선이 완성되지 않았습니다',
          detail: '버튼 SIG는 보드 입력 핀에, GND는 보드 GND에 연결하세요.',
          relatedDay: { moduleId: 'day03_digital', dayNum: 3, label: 'Day 03 풀업 버튼' },
        });
      }
    }
  }

  // Evaluate LEDs
  for (const led of components.filter((c) => c.type === 'led')) {
    const anodeReach = getConductiveReach(`${led.uid}:anode`);
    const cathodeReach = getConductiveReach(`${led.uid}:cathode`);

    // Find positive drivers reaching anode
    const findDriver = (reach: Map<string, { resistorCount: number }>) => {
      for (const [ref, info] of reach.entries()) {
        const bp = pinMap.get(ref);
        if (bp && (bp.role === 'gpio' || bp.role === 'power_5v' || bp.role === 'power_3v3')) {
          return { ref, pin: bp, resistorCount: info.resistorCount };
        }
        if (bp && bp.role === 'input_only') {
          return { ref, pin: bp, resistorCount: info.resistorCount };
        }
      }
      return null;
    };

    const findGnd = (reach: Map<string, { resistorCount: number }>) => {
      for (const [ref, info] of reach.entries()) {
        if (isAnyGndNode(ref)) {
          return { ref, resistorCount: info.resistorCount };
        }
      }
      return null;
    };

    const anodeDriver = findDriver(anodeReach);
    const cathodeGnd = findGnd(cathodeReach);

    // Check reversed polarity
    const cathodeDriver = findDriver(cathodeReach);
    const anodeGnd = findGnd(anodeReach);

    if (!anodeDriver && !cathodeGnd && cathodeDriver && anodeGnd) {
      ledStates[led.uid] = { lit: false, burned: false, reversed: true };
      pushDiag({
        id: `led-rev-${led.uid}`,
        severity: 'warning',
        title: 'LED 극성이 거꾸로 꽂혔습니다!',
        detail:
          'LED의 +(긴 다리)가 GND에, -(짧은 다리)가 플러스 신호에 연결되었습니다. 방향을 반대로 바꿔 연결하세요.',
        relatedDay: { moduleId: 'day01_basics', dayNum: 1, label: 'Day 01 LED 극성 보기' },
      });
      continue;
    }

    if (anodeDriver?.pin.role === 'input_only') {
      ledStates[led.uid] = { lit: false, burned: false, reversed: false };
      pushDiag({
        id: `led-inputonly-${led.uid}`,
        severity: 'danger',
        title: `입력 전용 핀(${anodeDriver.pin.label})으로는 LED를 켤 수 없습니다`,
        detail: `${boardSpec.shortName}의 ${anodeDriver.pin.label} 핀은 읽기(INPUT) 전용이라 전기를 내보낼 수 없습니다. 다른 일반 GPIO 핀을 사용하세요.`,
        relatedDay: { moduleId: 'esp32', dayNum: 9, label: 'Day 09 입력 전용 핀 확인' },
      });
      continue;
    }

    if (anodeDriver && cathodeGnd) {
      const totalResistors = anodeDriver.resistorCount + cathodeGnd.resistorCount;
      if (totalResistors === 0) {
        ledStates[led.uid] = {
          lit: false,
          burned: isRunning,
          reversed: false,
          pinLabel: anodeDriver.pin.label,
        };
        pushDiag({
          id: `led-nores-${led.uid}`,
          severity: 'danger',
          title: '보호 저항(220Ω) 없이 LED 직결 → 과전류 소손 위험!',
          detail:
            'LED가 저항을 거치지 않고 핀에 바로 연결되어 전류가 허용치(20mA)를 넘깁니다. 220Ω 저항을 직렬로 끼워주세요!',
          relatedDay: { moduleId: 'day01_basics', dayNum: 1, label: 'Day 01 보호 저항 계산' },
        });
      } else {
        const hasBtn = Object.values(buttonStates).some((b) => b.active);
        const lit = isRunning && (!hasBtn || anyButtonClosed);
        ledStates[led.uid] = {
          lit,
          burned: false,
          reversed: false,
          pinLabel: anodeDriver.pin.label,
        };
        if (anodeDriver.pin.role === 'gpio') {
          wiredGpioForCode.push({
            role: 'LED',
            pinLabel: anodeDriver.pin.label,
            gpioNum: anodeDriver.pin.gpio,
          });
        }
        pushDiag({
          id: `led-ok-${led.uid}`,
          severity: 'ok',
          title: `LED 안전 회로 완성 (${anodeDriver.pin.label} · 220Ω 보호)`,
          detail: hasBtn
            ? '실행 상태에서 작업대 버튼을 누르면 LED가 켜집니다!'
            : '220Ω 보호 저항 덕분에 약 6~14mA 안전 전류로 LED가 밝게 켜집니다.',
        });
      }
    } else {
      ledStates[led.uid] = { lit: false, burned: false, reversed: false };
      if (wires.some((w) => w.fromRef.startsWith(led.uid) || w.toRef.startsWith(led.uid))) {
        pushDiag({
          id: `led-inc-${led.uid}`,
          severity: 'warning',
          title: 'LED 회로가 닫히지 않았습니다 (폐회로 미완성)',
          detail:
            'LED의 + 다리는 보드 핀(저항 경유)에, - 다리는 보드 GND에 모두 연결되어야 전기가 한 바퀴 돕니다.',
          relatedDay: { moduleId: 'day01_basics', dayNum: 1, label: 'Day 01 폐회로 보기' },
        });
      }
    }
  }

  // Evaluate HC-SR04 Ultrasonic Sensors
  for (const sonar of components.filter((c) => c.type === 'hcsr04')) {
    const vccNet = getDirectNet(`${sonar.uid}:vcc`);
    const trigNet = getDirectNet(`${sonar.uid}:trig`);
    const echoNet = getDirectNet(`${sonar.uid}:echo`);
    const gndNet = getDirectNet(`${sonar.uid}:gnd`);

    const vccIs5v = [...vccNet].some((r) => isPower5vNode(r));
    const vccIs3v3 = [...vccNet].some((r) => isPower3v3Node(r));
    const gndOk = isBoardGndConnected(gndNet);

    const trigPin = [...trigNet]
      .map((r) => pinMap.get(r))
      .find((p): p is WbBoardPin => Boolean(p && p.role === 'gpio'));

    // Check Echo direct vs via Divider
    const directEchoPin = [...echoNet]
      .map((r) => pinMap.get(r))
      .find((p): p is WbBoardPin =>
        Boolean(p && (p.role === 'gpio' || p.role === 'input_only')),
      );

    let dividedEchoPin: WbBoardPin | undefined;
    let dividerGndOk = false;
    for (const div of components.filter((c) => c.type === 'divider')) {
      if (echoNet.has(`${div.uid}:in5v`)) {
        const outNet = getDirectNet(`${div.uid}:out3v3`);
        const divGndNet = getDirectNet(`${div.uid}:gnd`);
        dividerGndOk = isBoardGndConnected(divGndNet);
        const found = [...outNet]
          .map((r) => pinMap.get(r))
          .find((p): p is WbBoardPin =>
            Boolean(p && (p.role === 'gpio' || p.role === 'input_only')),
          );
        if (found) {
          dividedEchoPin = found;
          break;
        }
      }
    }

    if (vccIs3v3) {
      pushDiag({
        id: `sonar-3v3-${sonar.uid}`,
        severity: 'warning',
        title: 'HC-SR04 VCC가 3.3V에 연결됨',
        detail: 'HC-SR04는 5V 전용 초음파 센서입니다. 5V(또는 VIN) 핀에 연결해야 정상 측정됩니다.',
      });
    }

    if (directEchoPin && boardSpec.logicVoltage === '3.3V') {
      sonarStates[sonar.uid] = {
        active: false,
        overvoltage: true,
        distanceCm: sonarDistanceCm,
      };
      pushDiag({
        id: `sonar-ov-${sonar.uid}`,
        severity: 'danger',
        title: `5V ECHO 신호가 3.3V 핀(${directEchoPin.label})에 직결됨!`,
        detail: `${boardSpec.shortName}는 3.3V 보드이므로 HC-SR04 ECHO(5V)를 바로 꽂으면 핀이 손상됩니다. ECHO → 전압 분배기 IN(5V) → OUT(3.3V) → 보드 핀으로 연결하세요!`,
        relatedDay: {
          moduleId: 'day05_divider',
          dayNum: 5,
          label: 'Day 05 전압 분배기 실습',
        },
      });
      continue;
    }

    if (dividedEchoPin && !dividerGndOk) {
      sonarStates[sonar.uid] = {
        active: false,
        overvoltage: false,
        distanceCm: sonarDistanceCm,
      };
      pushDiag({
        id: `div-nognd-${sonar.uid}`,
        severity: 'warning',
        title: '전압 분배기 GND가 연결되지 않았습니다!',
        detail:
          '전압 분배기의 GND가 비어 있으면 5V가 그대로 통과해 3.3V로 낮아지지 않습니다. 분배기 GND를 보드 GND에 연결하세요.',
        relatedDay: {
          moduleId: 'day05_divider',
          dayNum: 5,
          label: 'Day 05 전압 분배 원리',
        },
      });
      continue;
    }

    const activeEchoPin =
      boardSpec.logicVoltage === '5V' ? directEchoPin ?? dividedEchoPin : dividedEchoPin;

    if (vccIs5v && gndOk && trigPin && activeEchoPin) {
      sonarStates[sonar.uid] = {
        active: isRunning,
        overvoltage: false,
        distanceCm: sonarDistanceCm,
      };
      wiredGpioForCode.push(
        { role: 'TRIG', pinLabel: trigPin.label, gpioNum: trigPin.gpio },
        { role: 'ECHO', pinLabel: activeEchoPin.label, gpioNum: activeEchoPin.gpio },
      );
      pushDiag({
        id: `sonar-ok-${sonar.uid}`,
        severity: 'ok',
        title: `초음파 센서 안전 연결 완료 (${trigPin.label} / ${activeEchoPin.label})`,
        detail:
          boardSpec.logicVoltage === '3.3V'
            ? '전압 분배기로 5V ECHO 신호를 3.3V로 안전하게 낮춰 정상 측정 중입니다.'
            : '5V 보드에서 TRIG/ECHO가 정상 연결되었습니다.',
      });
    } else {
      sonarStates[sonar.uid] = {
        active: false,
        overvoltage: false,
        distanceCm: sonarDistanceCm,
      };
      if (
        vccNet.size > 1 ||
        trigNet.size > 1 ||
        echoNet.size > 1 ||
        gndNet.size > 1
      ) {
        pushDiag({
          id: `sonar-inc-${sonar.uid}`,
          severity: 'warning',
          title: '초음파 센서(HC-SR04) 배선을 마저 연결하세요',
          detail: 'VCC(5V), TRIG(GPIO), ECHO(3.3V 보드는 분배기 경유), GND 4선이 모두 이어져야 합니다.',
        });
      }
    }
  }

  // Evaluate Potentiometer (ADC)
  let potServoPercent: number | null = null;
  for (const pot of components.filter((c) => c.type === 'pot')) {
    const vccNet = getDirectNet(`${pot.uid}:vcc`);
    const wiperNet = getDirectNet(`${pot.uid}:wiper`);
    const gndNet = getDirectNet(`${pot.uid}:gnd`);

    const vcc5v = [...vccNet].some((r) => isPower5vNode(r));
    const vcc3v3 = [...vccNet].some((r) => isPower3v3Node(r));
    const gndOk = isBoardGndConnected(gndNet);

    const wiperPin = [...wiperNet]
      .map((r) => pinMap.get(r))
      .find((p): p is WbBoardPin =>
        Boolean(p && (p.role === 'gpio' || p.role === 'input_only')),
      );

    if (wiperPin && !wiperPin.adc) {
      potStates[pot.uid] = {
        active: false,
        adcValue: 0,
        voltage: 0,
        overvoltage: false,
      };
      pushDiag({
        id: `pot-noadc-${pot.uid}`,
        severity: 'danger',
        title: `${wiperPin.label} 핀은 아날로그(ADC) 읽기를 지원하지 않습니다!`,
        detail:
          boardId === 'pi4'
            ? 'Raspberry Pi 4는 보드 자체에 ADC(아날로그→숫자 변환기)가 전혀 없습니다! 가변저항을 읽으려면 Arduino, ESP32, Pico 등을 사용해야 합니다.'
            : `${boardSpec.shortName}의 ${wiperPin.label} 핀에는 ADC 기능이 없습니다. ADC가 표시된 핀(예: A0, D32, GP26)에 연결하세요.`,
        relatedDay: { moduleId: 'day04_adc_pwm', dayNum: 4, label: 'Day 04 ADC 개념 보기' },
      });
      continue;
    }

    if (wiperPin && vcc5v && boardSpec.logicVoltage === '3.3V') {
      potStates[pot.uid] = {
        active: false,
        adcValue: 0,
        voltage: 5,
        overvoltage: true,
      };
      pushDiag({
        id: `pot-ov-${pot.uid}`,
        severity: 'danger',
        title: `가변저항 VCC를 3.3V 대신 5V에 연결함!`,
        detail: `${boardSpec.shortName}는 3.3V 보드이므로 가변저항 VCC도 반드시 3.3V에 꽂아야 ADC 핀이 과전압으로 타지 않습니다.`,
      });
      continue;
    }

    if ((vcc5v || vcc3v3) && gndOk && wiperPin?.adc) {
      const maxAdc = boardId === 'uno' || boardId === 'nano' || boardId === 'mega' ? 1023 : 4095;
      const vRef = boardSpec.logicVoltage === '5V' ? 5.0 : 3.3;
      const adcValue = Math.round((potPercent / 100) * maxAdc);
      const voltage = Number(((potPercent / 100) * vRef).toFixed(2));
      potStates[pot.uid] = {
        active: isRunning,
        adcValue,
        voltage,
        overvoltage: false,
      };
      potServoPercent = potPercent;
      wiredGpioForCode.push({
        role: 'POT_ADC',
        pinLabel: wiperPin.label,
        gpioNum: wiperPin.gpio,
      });
      pushDiag({
        id: `pot-ok-${pot.uid}`,
        severity: 'ok',
        title: `아날로그(ADC) 노브 정상 연결 (${wiperPin.label})`,
        detail: wiperPin.adc2WifiConflict
          ? '정상 동작하지만 이 핀은 ADC2라 실제 로봇에서 Wi-Fi를 켜면 충돌합니다. ADC1(D32/D33)을 권장합니다.'
          : '가변저항 슬라이더를 돌리면 실시간 전압과 ADC 숫자(0~4095 / 1023)가 변합니다.',
      });
    } else {
      potStates[pot.uid] = {
        active: false,
        adcValue: 0,
        voltage: 0,
        overvoltage: false,
      };
    }
  }

  // Evaluate SG90 Servos
  for (const servo of components.filter((c) => c.type === 'servo')) {
    const vccNet = getDirectNet(`${servo.uid}:vcc`);
    const sigNet = getDirectNet(`${servo.uid}:sig`);
    const gndNet = getDirectNet(`${servo.uid}:gnd`);

    const vccFrom3v3 = [...vccNet].some((r) => isPower3v3Node(r));
    const vccFromBatt = [...vccNet].some((r) =>
      batteryComps.some((b) => `${b.uid}:pos5v` === r),
    );
    const vccFromBoard5v = [...vccNet].some((r) => {
      const bp = pinMap.get(r);
      return bp?.role === 'power_5v';
    });

    const gndBoardConnected = isBoardGndConnected(gndNet);
    const sigPin = [...sigNet]
      .map((r) => pinMap.get(r))
      .find((p): p is WbBoardPin => Boolean(p && p.role === 'gpio'));

    const targetDeg = Math.round(((potServoPercent ?? 50) / 100) * 180);

    if (vccFrom3v3) {
      servoStates[servo.uid] = {
        active: false,
        brownout: true,
        targetDeg,
        pinLabel: sigPin?.label,
      };
      pushDiag({
        id: `servo-3v3-${servo.uid}`,
        severity: 'danger',
        title: '서보 모터를 3.3V 핀에 연결 → 브라운아웃 리셋 위험!',
        detail:
          '서보 모터는 회전할 때 500~800mA 큰 전류를 뽑아 먹어 3.3V 레귤레이터가 과열로 꺼집니다. 5V(VIN) 또는 외부 5V 배터리를 사용하세요!',
        relatedDay: {
          moduleId: 'day06_power',
          dayNum: 6,
          label: 'Day 06 전원 분리 보기',
        },
      });
      continue;
    }

    if (sigPin && !sigPin.pwm) {
      servoStates[servo.uid] = {
        active: false,
        brownout: false,
        targetDeg,
        pinLabel: sigPin.label,
      };
      pushDiag({
        id: `servo-nopwm-${servo.uid}`,
        severity: 'warning',
        title: `${sigPin.label} 핀은 PWM 서보 제어를 지원하지 않습니다`,
        detail: 'PWM(~) 표시가 있는 핀에 서보 SIG 선을 연결하세요.',
      });
      continue;
    }

    const commonGndOk = vccFromBatt
      ? gndBoardConnected &&
        batteryComps.some((b) => gndNet.has(`${b.uid}:gnd`))
      : gndBoardConnected;

    if ((vccFromBatt || vccFromBoard5v) && commonGndOk && sigPin?.pwm) {
      servoStates[servo.uid] = {
        active: isRunning,
        brownout: false,
        targetDeg,
        pinLabel: sigPin.label,
      };
      wiredGpioForCode.push({
        role: 'SERVO',
        pinLabel: sigPin.label,
        gpioNum: sigPin.gpio,
      });
      pushDiag({
        id: `servo-ok-${servo.uid}`,
        severity: 'ok',
        title: `서보 모터 안전 구동 (${sigPin.label} PWM)`,
        detail: vccFromBatt
          ? '외부 5V 전원과 공통 GND가 완벽히 연결되어 브라운아웃 없이 회전합니다!'
          : 'PWM 신호가 정상 연결되었습니다. (실제 대형 로봇에서는 외부 5V 배터리 분리를 권장합니다)',
      });
    } else {
      servoStates[servo.uid] = {
        active: false,
        brownout: false,
        targetDeg,
        pinLabel: sigPin?.label,
      };
      if (vccNet.size > 1 || sigNet.size > 1 || gndNet.size > 1) {
        pushDiag({
          id: `servo-inc-${servo.uid}`,
          severity: 'warning',
          title: '서보 모터 배선 또는 공통 GND가 덜 연결되었습니다',
          detail:
            'VCC(+5V), PWM SIG(보드 PWM 핀), GND(보드 GND + 배터리 GND 공통 연결)를 모두 확인하세요.',
        });
      }
    }
  }

  // Overall status
  let status: WorkbenchAnalysisResult['status'] = 'idle';
  if (diagnostics.some((d) => d.severity === 'danger')) {
    status = 'danger';
  } else if (diagnostics.some((d) => d.severity === 'warning')) {
    status = 'warning';
  } else if (diagnostics.some((d) => d.severity === 'ok')) {
    status = 'ok';
  }

  // Auto-generate board-appropriate code reflecting wired pins
  const isPythonBoard = boardId === 'pico' || boardId === 'pi4';
  const generatedCodeLanguage: 'cpp' | 'python' = isPythonBoard ? 'python' : 'cpp';
  const generatedCodeTitle = isPythonBoard
    ? `${boardId}_workbench.py`
    : `${boardId}_workbench.ino`;

  const ledPin = wiredGpioForCode.find((x) => x.role === 'LED');
  const trigPin = wiredGpioForCode.find((x) => x.role === 'TRIG');
  const echoPin = wiredGpioForCode.find((x) => x.role === 'ECHO');
  const servoPin = wiredGpioForCode.find((x) => x.role === 'SERVO');
  const potPin = wiredGpioForCode.find((x) => x.role === 'POT_ADC');

  let generatedCode = '';
  if (isPythonBoard) {
    generatedCode = `# ${boardSpec.name} 자동 생성 코드 (${boardId === 'pico' ? 'MicroPython' : 'Python gpiozero'})
import time
${ledPin ? `# LED 연결 핀: ${ledPin.pinLabel} (GPIO ${ledPin.gpioNum})` : '# 작업대에서 LED나 센서를 배선하면 핀 번호가 자동 반영됩니다'}
${servoPin ? `# 서보 PWM 핀: ${servoPin.pinLabel} (GPIO ${servoPin.gpioNum})` : ''}
${potPin ? `# ADC 입력 핀: ${potPin.pinLabel} (GPIO ${potPin.gpioNum})` : ''}

while True:
    ${ledPin ? `print("[${ledPin.pinLabel}] LED ON")` : 'print("Waiting for wiring...")'}
    time.sleep(0.5)`;
  } else {
    const defs: string[] = [];
    const setups: string[] = ['  Serial.begin(115200);'];
    const loops: string[] = [];

    if (ledPin) {
      defs.push(`const int LED_PIN = ${ledPin.gpioNum ?? ledPin.pinLabel};`);
      setups.push('  pinMode(LED_PIN, OUTPUT);');
      loops.push('  digitalWrite(LED_PIN, HIGH);');
    }
    if (trigPin && echoPin) {
      defs.push(`const int TRIG_PIN = ${trigPin.gpioNum};`);
      defs.push(`const int ECHO_PIN = ${echoPin.gpioNum};`);
      setups.push('  pinMode(TRIG_PIN, OUTPUT);');
      setups.push('  pinMode(ECHO_PIN, INPUT);');
      loops.push(
        `  // 초음파 거리 측정 (ECHO -> ${echoPin.pinLabel})\n  Serial.printf("Distance: %.1f cm\\n", ${sonarDistanceCm.toFixed(1)});`,
      );
    }
    if (potPin) {
      defs.push(`const int POT_PIN = ${potPin.pinLabel};`);
      loops.push(
        `  int adc = analogRead(POT_PIN);\n  Serial.printf("ADC=%d\\n", adc);`,
      );
    }
    if (servoPin) {
      defs.push(`const int SERVO_PIN = ${servoPin.gpioNum}; // PWM`);
      loops.push(
        `  // Servo PWM 출력 (${servoPin.pinLabel}) -> ${Math.round(((potServoPercent ?? 50) / 100) * 180)} deg`,
      );
    }

    generatedCode = `// ${boardSpec.name} 작업대 자동 생성 스케치
${defs.length > 0 ? defs.join('\n') : '// 왼쪽 보드 핀과 부품을 선으로 연결하면 코드가 자동 완성됩니다.'}

void setup() {
${setups.join('\n')}
}

void loop() {
${loops.length > 0 ? loops.join('\n') : '  delay(100);'}
  delay(200);
}`;
  }

  const serialPreviewLines: string[] = [];
  if (!isRunning) {
    serialPreviewLines.push('[대기] 우측 상단 "전원 ON · 실행"을 누르면 시뮬레이션이 시작됩니다.');
  } else if (status === 'danger') {
    serialPreviewLines.push('[ERROR] 위험 배선이 감지되어 하드웨어 보호 모드가 작동했습니다!');
    for (const d of diagnostics.filter((x) => x.severity === 'danger')) {
      serialPreviewLines.push(`! ${d.title}`);
    }
  } else {
    serialPreviewLines.push(`[BOOT] ${boardSpec.name} (${boardSpec.logicVoltage}) 실행 중...`);
    Object.values(ledStates).forEach((s) => {
      if (s.pinLabel) {
        serialPreviewLines.push(`[${s.pinLabel}] LED ${s.lit ? 'ON (SAFE 12mA)' : 'OFF'}`);
      }
    });
    Object.values(sonarStates).forEach((s) => {
      if (s.active) {
        serialPreviewLines.push(`[HC-SR04] 거리 = ${s.distanceCm.toFixed(1)} cm`);
      }
    });
    Object.values(potStates).forEach((s) => {
      if (s.active) {
        serialPreviewLines.push(`[ADC] value=${s.adcValue} (${s.voltage}V)`);
      }
    });
    Object.values(servoStates).forEach((s) => {
      if (s.active) {
        serialPreviewLines.push(`[SERVO ${s.pinLabel}] target = ${s.targetDeg}°`);
      }
    });
  }

  return {
    status,
    diagnostics,
    ledStates,
    servoStates,
    sonarStates,
    potStates,
    buttonStates,
    generatedCodeTitle,
    generatedCodeLanguage,
    generatedCode,
    serialPreviewLines,
  };
}
