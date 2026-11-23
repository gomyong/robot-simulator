import {
  BoardId,
  WbBoardPin,
  WbComponentPinDef,
  WbComponentType,
  WbMissionPreset,
} from '../types/lab';

export interface WbComponentCatalogItem {
  type: WbComponentType;
  name: string;
  shortName: string;
  desc: string;
  pins: WbComponentPinDef[];
}

export const WORKBENCH_COMPONENT_DEFS: Record<
  WbComponentType,
  WbComponentCatalogItem
> = {
  led: {
    type: 'led',
    name: '빨강 LED (발광 다이오드)',
    shortName: 'LED',
    desc: '긴 다리(+)에 220Ω 저항을 거쳐 전류를 흘려야 타지 않고 빛납니다.',
    pins: [
      { id: 'anode', label: '+ (애노드)', x: -24, y: 38, kind: 'signal_in' },
      { id: 'cathode', label: '- (GND)', x: 24, y: 38, kind: 'gnd' },
    ],
  },
  resistor_220: {
    type: 'resistor_220',
    name: '보호 저항 220Ω',
    shortName: '220Ω 저항',
    desc: 'LED 앞/뒤에 직렬로 연결해 과전류 폭발을 막는 안전 밸브입니다.',
    pins: [
      { id: 'a', label: 'A', x: -46, y: 0, kind: 'passive' },
      { id: 'b', label: 'B', x: 46, y: 0, kind: 'passive' },
    ],
  },
  button: {
    type: 'button',
    name: '택트 버튼 스위치',
    shortName: '버튼',
    desc: '눌렀을 때 SIG 핀을 GND(또는 전원)와 이어주는 입력 스위치입니다.',
    pins: [
      { id: 'sig', label: 'SIG', x: -24, y: 36, kind: 'signal_out' },
      { id: 'gnd', label: 'GND', x: 24, y: 36, kind: 'gnd' },
    ],
  },
  hcsr04: {
    type: 'hcsr04',
    name: 'HC-SR04 초음파 거리 센서',
    shortName: 'HC-SR04',
    desc: '5V로 동작하며 ECHO 핀에서 5V 신호가 나옵니다. 3.3V 보드는 전압 분배기 필수!',
    pins: [
      { id: 'vcc', label: 'VCC(5V)', x: -42, y: 40, kind: 'power' },
      { id: 'trig', label: 'TRIG', x: -14, y: 40, kind: 'signal_in' },
      { id: 'echo', label: 'ECHO(5V)', x: 14, y: 40, kind: 'signal_out' },
      { id: 'gnd', label: 'GND', x: 42, y: 40, kind: 'gnd' },
    ],
  },
  divider: {
    type: 'divider',
    name: '5V→3.3V 전압 분배기 (10k+20kΩ)',
    shortName: '전압 분배기',
    desc: '5V 센서 출력(ECHO 등)을 3.3V 보드가 안전하게 읽을 수 있도록 3.3V로 낮춰줍니다.',
    pins: [
      { id: 'in5v', label: 'IN(5V)', x: -38, y: 30, kind: 'signal_in' },
      { id: 'out3v3', label: 'OUT(3.3V)', x: 0, y: 30, kind: 'signal_out' },
      { id: 'gnd', label: 'GND', x: 38, y: 30, kind: 'gnd' },
    ],
  },
  servo: {
    type: 'servo',
    name: 'SG90 서보 모터 (0~180°)',
    shortName: '서보 모터',
    desc: '5V 큰 전류가 필요하므로 3.3V 핀에 물리면 브라운아웃이 발생합니다. PWM 핀과 연결하세요.',
    pins: [
      { id: 'vcc', label: 'VCC(5V)', x: -34, y: 42, kind: 'power' },
      { id: 'sig', label: 'PWM SIG', x: 0, y: 42, kind: 'signal_in' },
      { id: 'gnd', label: 'GND', x: 34, y: 42, kind: 'gnd' },
    ],
  },
  pot: {
    type: 'pot',
    name: '가변저항 노브 (아날로그)',
    shortName: '가변저항',
    desc: '손잡이를 돌리면 0~3.3V/5V 연속 전압을 출력합니다. 보드의 ADC 핀에 연결해야 합니다.',
    pins: [
      { id: 'vcc', label: 'VCC', x: -32, y: 38, kind: 'power' },
      { id: 'wiper', label: 'OUT(ADC)', x: 0, y: 38, kind: 'signal_out' },
      { id: 'gnd', label: 'GND', x: 32, y: 38, kind: 'gnd' },
    ],
  },
  battery_5v: {
    type: 'battery_5v',
    name: '외부 5V 전원 / 배터리 팩',
    shortName: '외부 5V 전원',
    desc: '서보·모터용 독립 전원입니다. 반드시 보드의 GND와 공통 접지(GND)를 이어야 합니다!',
    pins: [
      { id: 'pos5v', label: '+5V', x: -24, y: 38, kind: 'power' },
      { id: 'gnd', label: 'GND(-)', x: 24, y: 38, kind: 'gnd' },
    ],
  },
};

export interface WorkbenchSlotCoord {
  x: number;
  y: number;
  zone: string;
}

// 5 clean ergonomic component slots around the central MCU board (viewBox 780 x 470, board at x=390, y=235)
export const WORKBENCH_SLOTS: WorkbenchSlotCoord[] = [
  { x: 145, y: 110, zone: '좌상단' },
  { x: 145, y: 325, zone: '좌하단' },
  { x: 635, y: 110, zone: '우상단' },
  { x: 635, y: 265, zone: '우중단' },
  { x: 635, y: 395, zone: '우하단' },
];

export const BOARD_CANVAS_CENTER = { x: 390, y: 235 };

function makeSidePins(
  leftSpecs: Omit<WbBoardPin, 'x' | 'y' | 'side'>[],
  rightSpecs: Omit<WbBoardPin, 'x' | 'y' | 'side'>[],
): WbBoardPin[] {
  const startY = -126;
  const stepY = 36;
  const left = leftSpecs.map((p, i) => ({
    ...p,
    x: -78,
    y: startY + i * stepY,
    side: 'left' as const,
  }));
  const right = rightSpecs.map((p, i) => ({
    ...p,
    x: 78,
    y: startY + i * stepY,
    side: 'right' as const,
  }));
  return [...left, ...right];
}

export const WORKBENCH_BOARD_PINS: Record<BoardId, WbBoardPin[]> = {
  uno: makeSidePins(
    [
      { id: '5V', label: '5V', gpio: null, role: 'power_5v', pwm: false, adc: false, note: '안정화 5V 출력' },
      { id: '3V3', label: '3.3V', gpio: null, role: 'power_3v3', pwm: false, adc: false, note: '약 50mA 한계 (센서 소형만)' },
      { id: 'GND1', label: 'GND', gpio: null, role: 'gnd', pwm: false, adc: false },
      { id: 'VIN', label: 'VIN', gpio: null, role: 'vin', pwm: false, adc: false, note: '7~12V 입력' },
      { id: 'A0', label: 'A0', gpio: 14, role: 'gpio', pwm: false, adc: true, note: '10-bit 아날로그 입력' },
      { id: 'A1', label: 'A1', gpio: 15, role: 'gpio', pwm: false, adc: true },
      { id: 'A4', label: 'A4/SDA', gpio: 18, role: 'gpio', pwm: false, adc: true },
      { id: 'A5', label: 'A5/SCL', gpio: 19, role: 'gpio', pwm: false, adc: true },
    ],
    [
      { id: 'D13', label: 'D13', gpio: 13, role: 'gpio', pwm: false, adc: false, note: '내장 LED 연결 핀' },
      { id: 'D12', label: 'D12', gpio: 12, role: 'gpio', pwm: false, adc: false },
      { id: 'D11', label: 'D11~', gpio: 11, role: 'gpio', pwm: true, adc: false, note: 'PWM 출력 가능' },
      { id: 'D10', label: 'D10~', gpio: 10, role: 'gpio', pwm: true, adc: false, note: 'PWM 출력 가능' },
      { id: 'D9', label: 'D9~', gpio: 9, role: 'gpio', pwm: true, adc: false, note: '서보/PWM 추천 핀' },
      { id: 'D6', label: 'D6~', gpio: 6, role: 'gpio', pwm: true, adc: false },
      { id: 'D2', label: 'D2', gpio: 2, role: 'gpio', pwm: false, adc: false },
      { id: 'GND2', label: 'GND', gpio: null, role: 'gnd', pwm: false, adc: false },
    ],
  ),
  nano: makeSidePins(
    [
      { id: 'D13', label: 'D13', gpio: 13, role: 'gpio', pwm: false, adc: false },
      { id: '3V3', label: '3V3', gpio: null, role: 'power_3v3', pwm: false, adc: false },
      { id: 'A0', label: 'A0', gpio: 14, role: 'gpio', pwm: false, adc: true },
      { id: 'A1', label: 'A1', gpio: 15, role: 'gpio', pwm: false, adc: true },
      { id: 'A6', label: 'A6(IN)', gpio: 20, role: 'input_only', pwm: false, adc: true, note: '입력 전용 아날로그' },
      { id: '5V', label: '5V', gpio: null, role: 'power_5v', pwm: false, adc: false },
      { id: 'GND1', label: 'GND', gpio: null, role: 'gnd', pwm: false, adc: false },
      { id: 'VIN', label: 'VIN', gpio: null, role: 'vin', pwm: false, adc: false },
    ],
    [
      { id: 'D12', label: 'D12', gpio: 12, role: 'gpio', pwm: false, adc: false },
      { id: 'D11', label: 'D11~', gpio: 11, role: 'gpio', pwm: true, adc: false },
      { id: 'D9', label: 'D9~', gpio: 9, role: 'gpio', pwm: true, adc: false },
      { id: 'D6', label: 'D6~', gpio: 6, role: 'gpio', pwm: true, adc: false },
      { id: 'D5', label: 'D5~', gpio: 5, role: 'gpio', pwm: true, adc: false },
      { id: 'D3', label: 'D3~', gpio: 3, role: 'gpio', pwm: true, adc: false },
      { id: 'D2', label: 'D2', gpio: 2, role: 'gpio', pwm: false, adc: false },
      { id: 'GND2', label: 'GND', gpio: null, role: 'gnd', pwm: false, adc: false },
    ],
  ),
  mega: makeSidePins(
    [
      { id: '5V', label: '5V', gpio: null, role: 'power_5v', pwm: false, adc: false },
      { id: '3V3', label: '3V3', gpio: null, role: 'power_3v3', pwm: false, adc: false },
      { id: 'GND1', label: 'GND', gpio: null, role: 'gnd', pwm: false, adc: false },
      { id: 'A0', label: 'A0', gpio: 54, role: 'gpio', pwm: false, adc: true },
      { id: 'A1', label: 'A1', gpio: 55, role: 'gpio', pwm: false, adc: true },
      { id: 'A8', label: 'A8', gpio: 62, role: 'gpio', pwm: false, adc: true },
      { id: 'D20', label: 'D20/SDA', gpio: 20, role: 'gpio', pwm: false, adc: false },
      { id: 'D21', label: 'D21/SCL', gpio: 21, role: 'gpio', pwm: false, adc: false },
    ],
    [
      { id: 'D13', label: 'D13~', gpio: 13, role: 'gpio', pwm: true, adc: false },
      { id: 'D11', label: 'D11~', gpio: 11, role: 'gpio', pwm: true, adc: false },
      { id: 'D9', label: 'D9~', gpio: 9, role: 'gpio', pwm: true, adc: false },
      { id: 'D6', label: 'D6~', gpio: 6, role: 'gpio', pwm: true, adc: false },
      { id: 'D22', label: 'D22', gpio: 22, role: 'gpio', pwm: false, adc: false },
      { id: 'D24', label: 'D24', gpio: 24, role: 'gpio', pwm: false, adc: false },
      { id: 'D44', label: 'D44~', gpio: 44, role: 'gpio', pwm: true, adc: false },
      { id: 'GND2', label: 'GND', gpio: null, role: 'gnd', pwm: false, adc: false },
    ],
  ),
  esp32: makeSidePins(
    [
      { id: 'VIN', label: 'VIN(5V)', gpio: null, role: 'power_5v', pwm: false, adc: false, note: 'USB 연결 시 5V 출력' },
      { id: 'GND1', label: 'GND', gpio: null, role: 'gnd', pwm: false, adc: false },
      { id: 'D34', label: 'D34(IN)', gpio: 34, role: 'input_only', pwm: false, adc: true, note: '입력 전용 + ADC1 (LED 출력 불가)' },
      { id: 'D35', label: 'D35(IN)', gpio: 35, role: 'input_only', pwm: false, adc: true, note: '입력 전용 + ADC1' },
      { id: 'D32', label: 'D32', gpio: 32, role: 'gpio', pwm: true, adc: true, note: '안전 핀 · ADC1 (Wi-Fi OK)' },
      { id: 'D33', label: 'D33', gpio: 33, role: 'gpio', pwm: true, adc: true, note: '안전 핀 · ADC1' },
      { id: 'D13', label: 'D13', gpio: 13, role: 'gpio', pwm: true, adc: true, adc2WifiConflict: true, note: '안전 출력 · ADC2(Wi-Fi 충돌)' },
      { id: 'D6', label: 'D6(금지)', gpio: 6, role: 'prohibited', pwm: false, adc: false, note: 'SPI Flash 직결 금지 핀!' },
    ],
    [
      { id: '3V3', label: '3V3', gpio: null, role: 'power_3v3', pwm: false, adc: false, note: '3.3V 출력 (모터 연결 금지)' },
      { id: 'GND2', label: 'GND', gpio: null, role: 'gnd', pwm: false, adc: false },
      { id: 'D23', label: 'D23', gpio: 23, role: 'gpio', pwm: true, adc: false, note: '안전 GPIO/PWM' },
      { id: 'D22', label: 'D22/SCL', gpio: 22, role: 'gpio', pwm: true, adc: false, note: 'I2C SCL 안전 핀' },
      { id: 'D21', label: 'D21/SDA', gpio: 21, role: 'gpio', pwm: true, adc: false, note: 'I2C SDA 안전 핀' },
      { id: 'D19', label: 'D19', gpio: 19, role: 'gpio', pwm: true, adc: false },
      { id: 'D18', label: 'D18', gpio: 18, role: 'gpio', pwm: true, adc: false },
      { id: 'D4', label: 'D4', gpio: 4, role: 'gpio', pwm: true, adc: true, adc2WifiConflict: true },
    ],
  ),
  esp8266: makeSidePins(
    [
      { id: 'VIN', label: 'VIN(5V)', gpio: null, role: 'power_5v', pwm: false, adc: false },
      { id: 'GND1', label: 'GND', gpio: null, role: 'gnd', pwm: false, adc: false },
      { id: 'A0', label: 'A0(ADC)', gpio: 17, role: 'input_only', pwm: false, adc: true, note: '유일한 아날로그 입력' },
      { id: 'D1', label: 'D1(G5)', gpio: 5, role: 'gpio', pwm: true, adc: false, note: '안전 GPIO 5' },
      { id: 'D2', label: 'D2(G4)', gpio: 4, role: 'gpio', pwm: true, adc: false, note: '안전 GPIO 4' },
      { id: 'D5', label: 'D5(G14)', gpio: 14, role: 'gpio', pwm: true, adc: false },
      { id: 'D6', label: 'D6(G12)', gpio: 12, role: 'gpio', pwm: true, adc: false },
      { id: 'D7', label: 'D7(G13)', gpio: 13, role: 'gpio', pwm: true, adc: false },
    ],
    [
      { id: '3V3', label: '3V3', gpio: null, role: 'power_3v3', pwm: false, adc: false },
      { id: 'GND2', label: 'GND', gpio: null, role: 'gnd', pwm: false, adc: false },
      { id: 'D0', label: 'D0(G16)', gpio: 16, role: 'gpio', pwm: false, adc: false, note: 'PWM 불가 핀' },
      { id: 'D4', label: 'D4(G2)', gpio: 2, role: 'gpio', pwm: true, adc: false },
      { id: 'D8', label: 'D8(G15)', gpio: 15, role: 'gpio', pwm: true, adc: false },
      { id: 'RX', label: 'RX', gpio: 3, role: 'gpio', pwm: false, adc: false },
      { id: 'TX', label: 'TX', gpio: 1, role: 'gpio', pwm: false, adc: false },
      { id: 'S3', label: 'SD3(금지)', gpio: 10, role: 'prohibited', pwm: false, adc: false, note: '플래시 충돌 위험' },
    ],
  ),
  pico: makeSidePins(
    [
      { id: 'VBUS', label: 'VBUS(5V)', gpio: null, role: 'power_5v', pwm: false, adc: false, note: 'USB 5V 출력' },
      { id: '3V3', label: '3V3(OUT)', gpio: null, role: 'power_3v3', pwm: false, adc: false },
      { id: 'GND1', label: 'GND', gpio: null, role: 'gnd', pwm: false, adc: false },
      { id: 'GP26', label: 'GP26/A0', gpio: 26, role: 'gpio', pwm: true, adc: true, note: 'ADC0 입력 + PWM' },
      { id: 'GP27', label: 'GP27/A1', gpio: 27, role: 'gpio', pwm: true, adc: true, note: 'ADC1 입력 + PWM' },
      { id: 'GP28', label: 'GP28/A2', gpio: 28, role: 'gpio', pwm: true, adc: true },
      { id: 'GP16', label: 'GP16', gpio: 16, role: 'gpio', pwm: true, adc: false },
      { id: 'GP17', label: 'GP17', gpio: 17, role: 'gpio', pwm: true, adc: false },
    ],
    [
      { id: 'GP0', label: 'GP0', gpio: 0, role: 'gpio', pwm: true, adc: false },
      { id: 'GP2', label: 'GP2', gpio: 2, role: 'gpio', pwm: true, adc: false },
      { id: 'GP4', label: 'GP4/SDA', gpio: 4, role: 'gpio', pwm: true, adc: false },
      { id: 'GP5', label: 'GP5/SCL', gpio: 5, role: 'gpio', pwm: true, adc: false },
      { id: 'GP12', label: 'GP12', gpio: 12, role: 'gpio', pwm: true, adc: false },
      { id: 'GP14', label: 'GP14', gpio: 14, role: 'gpio', pwm: true, adc: false },
      { id: 'GP15', label: 'GP15', gpio: 15, role: 'gpio', pwm: true, adc: false },
      { id: 'GND2', label: 'GND', gpio: null, role: 'gnd', pwm: false, adc: false },
    ],
  ),
  stm32: makeSidePins(
    [
      { id: '5V', label: '5V', gpio: null, role: 'power_5v', pwm: false, adc: false },
      { id: '3V3', label: '3.3V', gpio: null, role: 'power_3v3', pwm: false, adc: false },
      { id: 'GND1', label: 'GND', gpio: null, role: 'gnd', pwm: false, adc: false },
      { id: 'PA0', label: 'PA0(ADC)', gpio: 0, role: 'gpio', pwm: true, adc: true, note: '12-bit ADC + PWM' },
      { id: 'PA1', label: 'PA1(ADC)', gpio: 1, role: 'gpio', pwm: true, adc: true },
      { id: 'PA2', label: 'PA2', gpio: 2, role: 'gpio', pwm: true, adc: true },
      { id: 'PA6', label: 'PA6', gpio: 6, role: 'gpio', pwm: true, adc: true },
      { id: 'PB0', label: 'PB0', gpio: 16, role: 'gpio', pwm: true, adc: true },
    ],
    [
      { id: 'PC13', label: 'PC13', gpio: 45, role: 'gpio', pwm: false, adc: false, note: '내장 LED 핀' },
      { id: 'PB6', label: 'PB6/SCL', gpio: 22, role: 'gpio', pwm: true, adc: false },
      { id: 'PB7', label: 'PB7/SDA', gpio: 23, role: 'gpio', pwm: true, adc: false },
      { id: 'PB8', label: 'PB8~', gpio: 24, role: 'gpio', pwm: true, adc: false },
      { id: 'PB9', label: 'PB9~', gpio: 25, role: 'gpio', pwm: true, adc: false },
      { id: 'PA8', label: 'PA8~', gpio: 8, role: 'gpio', pwm: true, adc: false },
      { id: 'PA9', label: 'PA9/TX', gpio: 9, role: 'gpio', pwm: true, adc: false },
      { id: 'GND2', label: 'GND', gpio: null, role: 'gnd', pwm: false, adc: false },
    ],
  ),
  pi4: makeSidePins(
    [
      { id: '5V', label: '5V(PIN2)', gpio: null, role: 'power_5v', pwm: false, adc: false, note: '5V 전원 핀' },
      { id: '3V3', label: '3V3(PIN1)', gpio: null, role: 'power_3v3', pwm: false, adc: false },
      { id: 'GND1', label: 'GND', gpio: null, role: 'gnd', pwm: false, adc: false },
      { id: 'GP2', label: 'GP2/SDA', gpio: 2, role: 'gpio', pwm: false, adc: false, note: '아날로그 ADC 없음!' },
      { id: 'GP3', label: 'GP3/SCL', gpio: 3, role: 'gpio', pwm: false, adc: false },
      { id: 'GP4', label: 'GP4', gpio: 4, role: 'gpio', pwm: false, adc: false },
      { id: 'GP17', label: 'GP17', gpio: 17, role: 'gpio', pwm: false, adc: false },
      { id: 'GP27', label: 'GP27', gpio: 27, role: 'gpio', pwm: false, adc: false },
    ],
    [
      { id: 'GP18', label: 'GP18~', gpio: 18, role: 'gpio', pwm: true, adc: false, note: '하드웨어 PWM' },
      { id: 'GP12', label: 'GP12~', gpio: 12, role: 'gpio', pwm: true, adc: false, note: '하드웨어 PWM' },
      { id: 'GP13', label: 'GP13~', gpio: 13, role: 'gpio', pwm: true, adc: false },
      { id: 'GP22', label: 'GP22', gpio: 22, role: 'gpio', pwm: false, adc: false },
      { id: 'GP23', label: 'GP23', gpio: 23, role: 'gpio', pwm: false, adc: false },
      { id: 'GP24', label: 'GP24', gpio: 24, role: 'gpio', pwm: false, adc: false },
      { id: 'GP25', label: 'GP25', gpio: 25, role: 'gpio', pwm: false, adc: false },
      { id: 'GND2', label: 'GND', gpio: null, role: 'gnd', pwm: false, adc: false },
    ],
  ),
};

export const WORKBENCH_MISSIONS: WbMissionPreset[] = [
  {
    id: 'wb_safe_led',
    title: '미션 1 · 보호 저항으로 LED 안전 점등',
    subtitle: '고장난 회로(저항 없이 직결)를 고쳐 LED가 안 터지게 켜보세요',
    recommendedBoard: 'esp32',
    starterModeLabel: '고장난 회로 불러오기 (수정 필요)',
    goalText:
      '현재 LED가 220Ω 저항을 거치지 않고 D13 핀에 바로 연결되어 과전류 위험 상태입니다! 기존 빨강 선을 지우고, [D13 → 220Ω 저항 → LED(+)] 순서로 직렬 연결한 뒤 실행을 눌러보세요.',
    components: [
      { uid: 'c_res', type: 'resistor_220', slotIndex: 2 },
      { uid: 'c_led', type: 'led', slotIndex: 3 },
    ],
    wires: [
      {
        id: 'w1',
        fromRef: 'board:D13',
        toRef: 'c_led:anode',
        color: '#EF4444',
      },
      {
        id: 'w2',
        fromRef: 'c_led:cathode',
        toRef: 'board:GND2',
        color: '#111827',
      },
    ],
  },
  {
    id: 'wb_ultrasonic_divider',
    title: '미션 2 · 5V 초음파 센서 & 3.3V 전압 분배',
    subtitle: 'ESP32에 5V ECHO 신호를 그냥 꽂으면 왜 위험한지 확인하고 고쳐보세요',
    recommendedBoard: 'esp32',
    starterModeLabel: '5V 과전압 함정 불러오기',
    goalText:
      'HC-SR04의 ECHO 핀은 5V 신호를 뱉어내어 3.3V 보드(ESP32)에 바로 꽂으면 위험합니다! ECHO → 전압 분배기 IN(5V), OUT(3.3V) → D22, 전압 분배기 GND → GND로 고쳐 안전 실행을 달성하세요.',
    components: [
      { uid: 'c_sonar', type: 'hcsr04', slotIndex: 2 },
      { uid: 'c_div', type: 'divider', slotIndex: 4 },
    ],
    wires: [
      { id: 'w1', fromRef: 'board:VIN', toRef: 'c_sonar:vcc', color: '#EF4444' },
      { id: 'w2', fromRef: 'board:D23', toRef: 'c_sonar:trig', color: '#10B981' },
      { id: 'w3', fromRef: 'c_sonar:echo', toRef: 'board:D22', color: '#F59E0B' },
      { id: 'w4', fromRef: 'c_sonar:gnd', toRef: 'board:GND2', color: '#111827' },
    ],
  },
  {
    id: 'wb_servo_power',
    title: '미션 3 · 서보 모터 전원 분리 & 공통 GND',
    subtitle: '외부 5V 배터리 사용 시 공통 GND를 빼먹으면 생기는 고장을 해결하세요',
    recommendedBoard: 'esp32',
    starterModeLabel: '공통 GND 누락 회로 불러오기',
    goalText:
      '서보의 전원은 외부 5V 배터리에 잘 연결했지만, 보드 GND와 배터리 GND가 연결되지 않아 PWM 신호가 통하지 않습니다! 배터리 GND(-)와 보드 GND를 이어 공통 접지를 완성하세요.',
    components: [
      { uid: 'c_servo', type: 'servo', slotIndex: 2 },
      { uid: 'c_batt', type: 'battery_5v', slotIndex: 0 },
    ],
    wires: [
      { id: 'w1', fromRef: 'c_batt:pos5v', toRef: 'c_servo:vcc', color: '#EF4444' },
      { id: 'w2', fromRef: 'c_batt:gnd', toRef: 'c_servo:gnd', color: '#111827' },
      { id: 'w3', fromRef: 'board:D18', toRef: 'c_servo:sig', color: '#635BFF' },
    ],
  },
  {
    id: 'wb_pot_adc',
    title: '미션 4 · 가변저항 노브로 아날로그(ADC) 읽기',
    subtitle: 'ADC 핀에 가변저항을 연결해 노브 각도를 숫자로 읽어보세요 (Pi 4 비교 가능)',
    recommendedBoard: 'uno',
    starterModeLabel: '완성 예시 또는 직접 배선',
    goalText:
      '가변저항 VCC → 보드 3.3V/5V, OUT(ADC) → 보드 ADC 핀(예: Uno A0 / ESP32 D32), GND → 보드 GND로 연결해 실행하세요. 참고로 Raspberry Pi 4로 바꾸면 ADC 핀이 없어 경고가 뜹니다!',
    components: [{ uid: 'c_pot', type: 'pot', slotIndex: 2 }],
    wires: [
      { id: 'w1', fromRef: 'board:5V', toRef: 'c_pot:vcc', color: '#EF4444' },
      { id: 'w2', fromRef: 'c_pot:wiper', toRef: 'board:A0', color: '#0EA5E9' },
      { id: 'w3', fromRef: 'c_pot:gnd', toRef: 'board:GND2', color: '#111827' },
    ],
  },
];
