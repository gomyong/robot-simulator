import { WarmupTerm } from '../types/lab';

export const PHASE0_WARMUP_TERMS: WarmupTerm[] = [
  {
    id: 'voltage',
    order: 1,
    term: '전압',
    english: 'Voltage (V)',
    oneLiner: '전기를 앞으로 밀어주는 힘(수압)입니다.',
    analogy:
      '물탱크가 높을수록 호스 끝에서 물이 세게 쏟아지듯, 전압(V)이 높을수록 전기를 미는 힘이 셉니다.',
    whyItMatters:
      'ESP32는 3.3V 힘만 버틸 수 있는데, 아두이노용 5V를 그대로 꽂으면 보드 핀이 망가집니다.',
    boardSighting: '보드 글씨: 3V3 (3.3V) · 5V / VIN · USB 5.0V',
    visualType: 'water_pressure',
    quickCheck: {
      question: '물 비유에서 "전압(V)"에 해당하는 것은 무엇인가요?',
      options: [
        '물탱크의 높이(물을 밀어내는 수압)',
        '호스를 잠그는 수도꼭지 밸브',
        '1초 동안 흘러간 물의 총량',
      ],
      correctIndex: 0,
      explanation: '정확합니다! 전압(V)은 전기를 밀어내는 압력(수압)입니다.',
    },
  },
  {
    id: 'current',
    order: 2,
    term: '전류',
    english: 'Current (A / mA)',
    oneLiner: '전선을 따라 실제로 흐르는 전기의 양입니다.',
    analogy:
      '수압(전압)에 밀려 수도 호스 안을 실제로 통과하는 "물의 양(물살)"이 전류입니다. 작은 부품은 mA(1000분의 1 A) 단위를 씁니다.',
    whyItMatters:
      'ESP32 핀 하나는 최대 20mA까지만 안전합니다. 모터처럼 전류를 많이 먹는 부품은 보드 핀에 바로 꽂으면 안 됩니다.',
    boardSighting: '안전 기준: LED 10~20mA · ESP32 핀 최대 20~40mA · 모터 500~2000mA',
    visualType: 'hose_flow',
    quickCheck: {
      question: '전류 단위로 1A(암페어)는 몇 mA(밀리암페어)일까요?',
      options: ['10 mA', '100 mA', '1,000 mA'],
      correctIndex: 2,
      explanation: '맞아요! 1A = 1,000mA이므로, LED가 쓰는 15mA는 0.015A입니다.',
    },
  },
  {
    id: 'resistance',
    order: 3,
    term: '저항',
    english: 'Resistance (Ω)',
    oneLiner: '전류가 너무 세게 흐르지 않도록 막아주는 안전 밸브입니다.',
    analogy:
      '호스 입구를 손가락이나 밸브로 살짝 좁혀 물살을 약하게 만드는 것과 똑같습니다. 단위는 옴(Ω)을 씁니다.',
    whyItMatters:
      'LED를 저항 없이 전원에 바로 꽂으면 전류가 수백 mA로 치솟아 1초 만에 "퍽" 하고 타버립니다.',
    boardSighting: '자주 쓰는 값: 220Ω / 330Ω (LED 보호용) · 10kΩ (버튼/센서용)',
    visualType: 'valve_resistor',
    quickCheck: {
      question: 'LED 앞에 220Ω 저항을 다는 가장 큰 이유는?',
      options: [
        'LED 색깔을 파란색으로 바꾸기 위해',
        '과한 전류가 흘러 LED와 보드가 타는 걸 막기 위해',
        '배터리 전압을 2배로 높이기 위해',
      ],
      correctIndex: 1,
      explanation: '정답! 저항은 전류의 상한을 막아 부품을 지키는 안전 밸브입니다.',
    },
  },
  {
    id: 'vcc_gnd',
    order: 4,
    term: 'VCC(+) 와 GND(-)',
    english: 'Power & Ground',
    oneLiner: '전기가 출발하는 입구(VCC)와 일을 마치고 돌아오는 출구(GND)입니다.',
    analogy:
      '전기는 반드시 플러스(+)에서 나와 부품을 거친 뒤 마이너스(GND)로 돌아오는 "닫힌 한 바퀴 고리"여야만 흐릅니다.',
    whyItMatters:
      '전원 선(+)만 꽂고 GND(-)를 서로 이어주지 않으면, 아무리 코드를 잘 짜도 로봇이 전혀 움직이지 않습니다.',
    boardSighting: '보드 글씨: VCC / 3V3 / 5V (+쪽) ↔ GND (-쪽, 모든 부품 공통 연결)',
    visualType: 'closed_loop',
    quickCheck: {
      question: '건전지와 ESP32 보드를 따로 전원에 연결했을 때 반드시 추가로 이어야 하는 선은?',
      options: [
        '두 장치의 GND(-)끼리 서로 연결한다',
        '3.3V와 5V를 직접 맞붙인다',
        '아무 선도 안 이어도 무선으로 전기가 통한다',
      ],
      correctIndex: 0,
      explanation: '완벽합니다! 서로 다른 전원을 쓸 때도 기준점(GND)은 하나로 묶어야 신호가 통합니다.',
    },
  },
  {
    id: 'breadboard',
    order: 5,
    term: '브레드보드 (빵판)',
    english: 'Breadboard',
    oneLiner: '납땜 없이 전선과 부품을 꽂아 회로를 실험하는 구멍판입니다.',
    analogy:
      '구멍 밑에 구리 클립이 숨어 있어 레고처럼 끼웠다 뺐다 하며 수정할 수 있습니다. 가운데 긴 홈은 좌우를 나누는 절벽입니다.',
    whyItMatters:
      '어느 줄끼리 구리로 붙어 있는지 모르고 꽂으면, +와 -가 바로 닿아 합선(열 발생)이 납니다.',
    boardSighting: '바깥 빨강/파랑 줄: 세로로 길게 연결 · 안쪽 구멍(a~e): 가로 5칸씩 연결',
    visualType: 'breadboard_rails',
    quickCheck: {
      question: '브레드보드 가운데 파인 긴 홈(트렌치)을 넘어서면 좌우 구멍은 연결되어 있을까요?',
      options: [
        '네, 전부 연결되어 있습니다',
        '아니요, 가운데 홈을 기준으로 서로 끊어져 있습니다',
        '전원을 켜면 자동으로 연결됩니다',
      ],
      correctIndex: 1,
      explanation: '정답! 가운데 홈은 칩의 왼쪽 다리와 오른쪽 다리가 합선되지 않도록 분리해 줍니다.',
    },
  },
  {
    id: 'mcu',
    order: 6,
    term: 'MCU (두뇌 보드)',
    english: 'Microcontroller (ESP32 / Arduino)',
    oneLiner: '로봇 안에서 센서 값을 읽고 판단해 명령을 내리는 작은 컴퓨터입니다.',
    analogy:
      '일반 PC처럼 윈도우가 깔린 게 아니라, 내가 짜서 넣어준 딱 한 가지 로봇 프로그램만 1초에 수만 번 반복 실행하는 전용 두뇌입니다.',
    whyItMatters:
      '아두이노, ESP32, 피코 등 생김새는 달라도 모두 센서(눈)→MCU(두뇌)→모터(근육)의 중심 역할을 합니다.',
    boardSighting: '대표 보드: ESP32 (Wi-Fi/블루투스 내장 · 3.3V) · Arduino Uno (입문용 · 5V)',
    visualType: 'mcu_brain',
    quickCheck: {
      question: '로봇의 기본 동작 3단계 순서로 가장 알맞은 것은?',
      options: [
        '센서(감각) → MCU(두뇌 판단) → 액추에이터(움직임)',
        '모터 → 저항 → 배터리',
        '와이파이 → 브레드보드 → 전선',
      ],
      correctIndex: 0,
      explanation: '맞습니다! 어떤 복잡한 로봇도 이 3요소 루프를 빠르게 반복할 뿐입니다.',
    },
  },
  {
    id: 'gpio',
    order: 7,
    term: 'GPIO (입출력 핀)',
    english: 'General-Purpose Input / Output',
    oneLiner: '두뇌 보드 양옆에 꽂힌 다리 중, 코드로 역할을 정할 수 있는 만능 연결 핀입니다.',
    analogy:
      '코드에서 "넌 듣는 귀(INPUT) 해!", "넌 전기를 내보내는 손(OUTPUT) 해!"라고 정해줄 수 있는 다목적 콘센트 구멍입니다.',
    whyItMatters:
      '보드 옆면에 D13이라고 적혀 있어도 코드에서는 숫자 13으로 부릅니다. 단, 몇몇 핀은 부팅 전용이라 피해서 써야 합니다.',
    boardSighting: '코드 예시: pinMode(13, OUTPUT); / digitalWrite(13, HIGH);',
    visualType: 'gpio_legs',
    quickCheck: {
      question: 'LED를 켜기 위해 13번 핀에서 전기를 바깥으로 내보내려면 어떤 모드로 설정해야 할까요?',
      options: ['INPUT (입력)', 'OUTPUT (출력)', 'GND (접지)'],
      correctIndex: 1,
      explanation: '정답! 바깥 부품을 움직이려면 OUTPUT, 버튼/센서를 읽으려면 INPUT으로 설정합니다.',
    },
  },
  {
    id: 'digital_analog',
    order: 8,
    term: '디지털 vs 아날로그(ADC)',
    english: 'Digital vs Analog',
    oneLiner: '디지털은 "켜짐/꺼짐(1/0)" 두 가지만, 아날로그는 "중간 세기"까지 연속으로 표현합니다.',
    analogy:
      '디지털은 똑딱이 전등 스위치(ON/OFF)이고, 아날로그는 온도계나 볼륨 노브처럼 부드럽게 변하는 값입니다.',
    whyItMatters:
      '버튼은 디지털(눌림/안눌림)로 읽지만, 거리·조도·배터리 잔량은 ADC라는 변환기를 통해 0~4095 숫자로 읽습니다.',
    boardSighting: '디지털: digitalRead() → 0 또는 1 · 아날로그: analogRead() → 0 ~ 4095',
    visualType: 'digital_vs_analog',
    quickCheck: {
      question: '손잡이(가변저항)를 돌린 각도에 따라 0~4095 사이의 세밀한 숫자를 읽고 싶을 때 쓰는 기능은?',
      options: ['digitalWrite', 'ADC (analogRead)', 'GND'],
      correctIndex: 1,
      explanation: '정확합니다! ADC가 연속 전압을 컴퓨터 숫자(0~4095)로 바꿔줍니다.',
    },
  },
  {
    id: 'pwm',
    order: 9,
    term: 'PWM (밝기·속도 조절)',
    english: 'Pulse Width Modulation',
    oneLiner: '1초에 수백~수천 번 전기를 껐다 켰다 해서 평균 세기를 조절하는 기술입니다.',
    analogy:
      '컴퓨터 핀은 0V와 3.3V 두 가지밖에 못 내보내지만, 1초에 1000번 중 절반(50%)만 켜두면 사람 눈에는 LED가 "절반 밝기"로 보입니다.',
    whyItMatters:
      'LED 밝기 조절, DC 모터 속도 제어, 서보모터 각도 명령까지 로보틱스 움직임 대부분이 PWM으로 동작합니다.',
    boardSighting: '켜진 비율 = 듀티 사이클 (0% 정지 · 50% 절반 속도 · 100% 최고 속도)',
    visualType: 'pwm_pulse',
    quickCheck: {
      question: 'PWM 듀티 사이클을 20%에서 80%로 올리면 모터나 LED는 어떻게 될까요?',
      options: [
        '전기가 켜져 있는 시간이 늘어나 더 빠르고 밝아진다',
        '반대로 더 느려지고 어두워진다',
        '아무 변화가 없다',
      ],
      correctIndex: 0,
      explanation: '맞아요! 한 주기 안에서 켜진(HIGH) 비율이 높을수록 평균 출력이 커집니다.',
    },
  },
  {
    id: 'serial',
    order: 10,
    term: '시리얼 통신 (UART)',
    english: 'Serial Monitor (115200 bps)',
    oneLiner: '보드와 PC가 USB 선으로 글자·숫자 대화를 주고받는 창구입니다.',
    analogy:
      '보드는 화면이 없어서 지금 무슨 생각을 하는지 모릅니다. 시리얼 모니터를 켜면 보드가 속마음(센서값, 에러)을 실시간 채팅처럼 출력해 줍니다.',
    whyItMatters:
      '로봇이 안 움직일 때 감으로 찍지 않고 시리얼 모니터로 값을 출력해 보면 1분 만에 원인을 찾을 수 있습니다.',
    boardSighting: '코드 필수: Serial.begin(115200); · Serial.println("Hello!");',
    visualType: 'serial_chat',
    quickCheck: {
      question: '시리얼 모니터에 알 수 없는 외계어(깨진 글자)만 뜬다면 가장 먼저 확인할 것은?',
      options: [
        '코드의 Serial.begin(속도)과 모니터 창의 통신 속도(115200)가 같은지 확인',
        'LED 색깔을 빨간색으로 바꾼다',
        '배터리를 냉장고에 넣는다',
      ],
      correctIndex: 0,
      explanation: '정답! 말하는 속도와 듣는 속도(Baud Rate)가 다르면 글자가 깨져 보입니다.',
    },
  },
];
