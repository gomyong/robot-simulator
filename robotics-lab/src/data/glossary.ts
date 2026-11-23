import { GlossaryEntry } from '../types/lab';

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  // --- 전기 기초 ---
  {
    id: 'voltage',
    term: '전압 (V)',
    english: 'Voltage',
    category: '전기 기초',
    plainSummary: '전기를 앞으로 밀어주는 힘의 세기(수압)입니다. 보드마다 쓰는 전압(3.3V vs 5V)이 다릅니다.',
    analogy: '물탱크가 높을수록 물이 세게 내려오는 "수압"과 같습니다.',
    aliases: ['전압'],
    warmupId: 'voltage',
  },
  {
    id: 'current',
    term: '전류 (A / mA)',
    english: 'Current',
    category: '전기 기초',
    plainSummary: '전선을 따라 실제로 흘러가는 전기의 양입니다. 너무 많이 흐르면 부품이 뜨거워져 탑니다.',
    analogy: '수도 호스 안을 실제로 통과하는 "물의 양(물살)"과 같습니다.',
    aliases: ['과전류', '전류'],
    warmupId: 'current',
  },
  {
    id: 'resistance',
    term: '저항 (Ω)',
    english: 'Resistance',
    category: '전기 기초',
    plainSummary: '전기가 너무 세게 흐르지 못하도록 길을 좁혀 조절해 주는 안전 밸브 부품입니다.',
    analogy: '물줄기가 너무 세서 화분이 망가지지 않게 잠가주는 "수도꼭지 밸브"입니다.',
    aliases: ['보호 저항', '풀업 저항', '풀다운 저항', '저항'],
    warmupId: 'resistance',
  },
  {
    id: 'ohm_law',
    term: '옴의 법칙',
    english: "Ohm's Law",
    category: '전기 기초',
    plainSummary: '전압(V) = 전류(I) × 저항(R)이라는 전기의 기본 공식입니다. 저항이 0이면 전류가 폭주합니다.',
    analogy: '수압(V)이 같아도 밸브(R)를 활짝 열면 물(I)이 쏟아지는 원리입니다.',
    aliases: ['옴의 법칙'],
  },
  {
    id: 'vcc',
    term: 'VCC (+ 전원)',
    english: 'Voltage Common Collector',
    category: '전기 기초',
    plainSummary: '칩이나 센서에 플러스(+) 전기를 넣어주는 입구 핀 이름입니다. 보통 3.3V 또는 5V를 연결합니다.',
    analogy: '집으로 깨끗한 물이 들어오는 "수도 공급관(+)"입니다.',
    aliases: ['VCC'],
    warmupId: 'vcc_gnd',
  },
  {
    id: 'gnd',
    term: 'GND (접지 / -)',
    english: 'Ground',
    category: '전기 기초',
    plainSummary: '전기가 일을 마치고 마이너스(-)로 돌아가는 공통 기준선입니다. 모든 부품의 GND가 서로 이어져야 동작합니다.',
    analogy: '물을 쓰고 난 뒤 하수구로 모여 돌아가는 "공통 배수관(-)"입니다.',
    aliases: ['공통 GND', 'GND'],
    warmupId: 'vcc_gnd',
  },
  {
    id: 'closed_loop',
    term: '폐회로',
    english: 'Closed Circuit',
    category: '전기 기초',
    plainSummary: '플러스(+)에서 출발한 전기가 부품을 지나 마이너스(GND)까지 끊김 없이 한 바퀴 연결된 상태입니다.',
    analogy: '한쪽 길이라도 끊어진 회전교차로는 차가 돌 수 없는 것과 같습니다.',
    aliases: ['폐회로'],
    warmupId: 'vcc_gnd',
  },
  {
    id: 'short_circuit',
    term: '합선 / 단락',
    english: 'Short Circuit',
    category: '전기 기초',
    plainSummary: '전기를 쓸 부품(저항/LED) 없이 +와 -가 직접 닿아 전류가 폭발적으로 흐르는 위험한 상태입니다.',
    analogy: '댐 수문이 통째로 무너져 물이 한꺼번에 쏟아지는 상황입니다.',
    aliases: ['관통 단락', '단락', '합선'],
  },
  {
    id: 'vf',
    term: '순방향 전압 (Vf)',
    english: 'Forward Voltage',
    category: '전기 기초',
    plainSummary: 'LED가 불을 켜기 위해 최소한으로 필요한 입장료 같은 전압입니다(빨강 약 2.0V, 파랑 약 3.2V).',
    analogy: '자동문 문턱을 넘기 위해 필요한 최소 힘이라고 보면 됩니다.',
    aliases: ['순방향 전압', 'Vf'],
  },
  {
    id: 'polarity_led',
    term: '애노드(+) / 캐소드(-)',
    english: 'Anode / Cathode',
    category: '전기 기초',
    plainSummary: 'LED처럼 방향이 있는 부품의 플러스(+) 다리를 애노드, 마이너스(-) 다리를 캐소드라고 부릅니다.',
    analogy: '건전지를 거꾸로 끼우면 작동 안 하듯, 긴 다리가 (+), 짧은 다리가 (-)입니다.',
    aliases: ['애노드', '캐소드'],
  },
  {
    id: 'breadboard',
    term: '브레드보드',
    english: 'Breadboard',
    category: '전기 기초',
    plainSummary: '납땜 없이 부품 다리와 전선을 꽂았다 뺐다 하며 회로를 실험하는 구멍판(빵판)입니다.',
    analogy: '블록을 끼웠다 빼며 쉽게 고칠 수 있는 전자 회로용 레고판입니다.',
    aliases: ['브레드보드', '빵판'],
    warmupId: 'breadboard',
  },
  {
    id: 'multimeter',
    term: '멀티미터',
    english: 'Multimeter',
    category: '전기 기초',
    plainSummary: '눈에 안 보이는 전압(V), 저항(Ω), 전선 연결 여부(삐- 소리)를 숫자로 측정해 주는 전기 청진기입니다.',
    analogy: '의사가 청진기·체온계로 몸 상태를 재듯 회로의 아픈 곳을 찾는 도구입니다.',
    aliases: ['디지털 멀티미터', '멀티미터'],
  },
  {
    id: 'voltage_divider',
    term: '전압 분배기',
    english: 'Voltage Divider',
    category: '전기 기초',
    plainSummary: '저항 2개를 이어 붙여 높은 전압(예: 5V)을 보드가 버틸 수 있는 안전한 전압(3.3V)으로 낮추는 회로입니다.',
    analogy: '강한 수압을 2단계 감압 밸브로 나눠 반쯤 줄여 보내는 장치입니다.',
    aliases: ['전압 분배기', '전압 분배'],
  },
  {
    id: 'ldo',
    term: 'LDO (선형 레귤레이터)',
    english: 'Low-Dropout Regulator',
    category: '전기 기초',
    plainSummary: '남는 전압을 열로 태워 없애면서 안정적인 전압(예: 5V→3.3V)을 만들어 주는 작은 변압 칩입니다.',
    analogy: '브레이크를 살짝 밟아 속도를 일정하게 유지하는 방식이라 열이 많이 납니다.',
    aliases: ['LDO', 'AMS1117', '레귤레이터'],
  },
  {
    id: 'buck_converter',
    term: '벅 컨버터',
    english: 'Buck Converter',
    category: '전기 기초',
    plainSummary: '열로 버리지 않고 빠른 스위칭으로 높은 전압을 낮은 전압으로 알뜰하게 바꿔주는 고효율 변압 모듈입니다.',
    analogy: '수도꼭지를 초고속으로 열었다 닫았다 해서 물 손실 없이 수압을 낮추는 장치입니다.',
    aliases: ['벅 컨버터'],
  },
  {
    id: 'brownout',
    term: '브라운아웃',
    english: 'Brownout',
    category: '전기 기초',
    plainSummary: '모터가 큰 전류를 잡아먹는 순간 배터리의 전압이 뚝 떨어져 두뇌 보드(ESP32)가 갑자기 재부팅되는 현상입니다.',
    analogy: '집에서 대형 에어컨을 켜자마자 순간적으로 거실 불이 깜빡 꺼지는 것과 같습니다.',
    aliases: ['브라운아웃'],
  },

  // --- 보드·핀 ---
  {
    id: 'mcu',
    term: 'MCU (마이크로컨트롤러)',
    english: 'Microcontroller Unit',
    category: '보드·핀',
    plainSummary: '로봇 안에서 센서 값을 읽고 코드를 실행해 모터에 명령을 내리는 초소형 두뇌 칩입니다(예: ESP32).',
    analogy: '거대한 PC 대신 로봇 몸통 안에 들어가는 손바닥만 한 전용 지휘관입니다.',
    aliases: ['마이크로컨트롤러', 'MCU'],
    warmupId: 'mcu',
  },
  {
    id: 'gpio',
    term: 'GPIO (범용 입출력 핀)',
    english: 'General-Purpose Input/Output',
    category: '보드·핀',
    plainSummary: '보드의 두뇌가 바깥 센서·LED·모터와 전기 신호를 주고받기 위해 뚫어놓은 다리(연결 구멍)입니다.',
    analogy: '코드로 "듣기(INPUT)" 또는 "말하기(OUTPUT)"로 바꿀 수 있는 보드의 손발입니다.',
    aliases: ['GPIO'],
    warmupId: 'gpio',
  },
  {
    id: 'silkscreen',
    term: '실크스크린',
    english: 'Silkscreen',
    category: '보드·핀',
    plainSummary: '기판 표면에 하얀 글씨로 인쇄된 핀 번호(D13, GND, 3V3 등)와 부품 안내 표시입니다.',
    analogy: '기판 위에 적힌 이정표 이름표입니다. 단, 보드마다 표기가 조금씩 다를 수 있습니다.',
    aliases: ['실크스크린'],
  },
  {
    id: 'bootloader',
    term: '부트로더 / 플래싱',
    english: 'Bootloader / Flashing',
    category: '보드·핀',
    plainSummary: '새 코드를 보드 메모리에 덮어쓰기 위해 보드가 대기 상태로 들어가는 특별한 시작 프로그램입니다.',
    analogy: '스마트폰을 켜기 전에 업데이트 모드로 들어가는 것과 비슷합니다.',
    aliases: ['Bootloader', '부트로더', 'Flashing'],
  },
  {
    id: 'strapping_pin',
    term: '스트래핑 핀',
    english: 'Strapping Pin',
    category: '보드·핀',
    plainSummary: '보드가 막 켜질 때(부팅 순간) 부팅 방식을 결정하는 데 쓰이는 예민한 핀이라 함부로 부품을 달면 안 됩니다.',
    analogy: '비행기가 이륙하는 1초 동안은 건드리면 안 되는 조종석 스위치와 같습니다.',
    aliases: ['스트래핑 핀', '스트래핑'],
  },
  {
    id: 'floating',
    term: '플로팅 (Floating)',
    english: 'Floating Pin',
    category: '보드·핀',
    plainSummary: '입력 핀이 +에도 -에도 연결되지 않아 주변 전자파 때문에 0과 1 사이를 미친 듯이 흔들리는 불안정한 상태입니다.',
    analogy: '아무도 안 잡은 문이 바람에 따라 열렸다 닫혔다 덜컹거리는 상태입니다.',
    aliases: ['플로팅'],
  },
  {
    id: 'pullup_pulldown',
    term: '풀업 / 풀다운',
    english: 'Pull-up / Pull-down',
    category: '보드·핀',
    plainSummary: '버튼을 안 눌렀을 때 핀 값이 흔들리지 않도록 약한 저항으로 3.3V(풀업)나 0V(풀다운)에 살짝 묶어두는 기법입니다.',
    analogy: '바람에 흔들리지 않게 문에 달아둔 약한 용수철(도어클로저)입니다.',
    aliases: ['INPUT_PULLUP', '풀업', '풀다운'],
  },

  // --- 신호·통신 ---
  {
    id: 'digital',
    term: '디지털 신호 (HIGH / LOW)',
    english: 'Digital Signal',
    category: '신호·통신',
    plainSummary: '전기가 켜짐(HIGH, 3.3V, 1) 아니면 꺼짐(LOW, 0V, 0) 두 가지 상태만 있는 깔끔한 신호입니다.',
    analogy: '밝기 조절 없이 켜기/끄기만 되는 똑딱이 전등 스위치와 같습니다.',
    aliases: ['digitalWrite', 'digitalRead', '디지털'],
    warmupId: 'digital_analog',
  },
  {
    id: 'analog',
    term: '아날로그 신호',
    english: 'Analog Signal',
    category: '신호·통신',
    plainSummary: '켜짐/꺼짐 딱 두 개가 아니라 0V부터 3.3V까지 연속적으로 부드럽게 변하는 전압 신호입니다.',
    analogy: '단계 없이 연속으로 돌리는 가스레인지 불 조절 다이얼과 같습니다.',
    aliases: ['아날로그'],
    warmupId: 'digital_analog',
  },
  {
    id: 'adc',
    term: 'ADC (아날로그→숫자 변환기)',
    english: 'Analog-to-Digital Converter',
    category: '신호·통신',
    plainSummary: '센서가 보내는 연속 전압(0~3.3V)을 컴퓨터가 계산할 수 있는 숫자(ESP32는 0~4095)로 바꿔주는 장치입니다.',
    analogy: '눈금 없는 물컵의 높이를 자로 재서 "3.2cm"라는 숫자로 적는 과정입니다.',
    aliases: ['analogRead', 'ADC1', 'ADC2', 'ADC'],
    warmupId: 'digital_analog',
  },
  {
    id: 'pwm',
    term: 'PWM (펄스 폭 변조)',
    english: 'Pulse Width Modulation',
    category: '신호·통신',
    plainSummary: '전기를 1초에 수백~수천 번 아주 빠르게 껐다 켰다 해서, 평균 힘(LED 밝기, 모터 속도)을 조절하는 기술입니다.',
    analogy: '선풍기를 1초마다 켜고 끄면 약하게 돌아가는 것을 1초에 1,000번 반복하는 셈입니다.',
    aliases: ['PWM'],
    warmupId: 'pwm',
  },
  {
    id: 'duty_cycle',
    term: '듀티 사이클',
    english: 'Duty Cycle',
    category: '신호·통신',
    plainSummary: 'PWM 한 주기 동안 전기가 켜져 있는 시간의 비율(%)입니다. 0%면 정지, 50%면 절반 힘, 100%면 최대 출력입니다.',
    analogy: '10초 중 7초를 달리면 "듀티 70%"로 달린 것과 같습니다.',
    aliases: ['듀티 사이클', '듀티비', '듀티'],
    warmupId: 'pwm',
  },
  {
    id: 'serial_uart',
    term: '시리얼 통신 / UART',
    english: 'UART / Serial',
    category: '신호·통신',
    plainSummary: '보드와 PC(또는 두 보드)가 선 2개(TX 보내기, RX 받기)를 통해 한 줄씩 글자·데이터를 주고받는 대화 방식입니다.',
    analogy: '무전기처럼 한 선으로 말하고(TX) 다른 선으로 듣는(RX) 1:1 직통 전화입니다.',
    aliases: ['시리얼 통신', '시리얼 모니터', 'Serial.begin', 'UART0', 'UART'],
    warmupId: 'serial',
  },
  {
    id: 'baud',
    term: '통신 속도 (Baud)',
    english: 'Baud Rate',
    category: '신호·통신',
    plainSummary: '시리얼 통신에서 1초에 몇 개의 신호를 주고받을지 정한 속도 약속입니다(예: 115200). 양쪽 숫자가 같아야 글자가 안 깨집니다.',
    analogy: '말하는 사람과 듣는 사람이 똑같이 "1배속"으로 재생 속도를 맞추는 약속입니다.',
    aliases: ['Baud', 'bps'],
    warmupId: 'serial',
  },
  {
    id: 'i2c',
    term: 'I2C 통신',
    english: 'Inter-Integrated Circuit',
    category: '신호·통신',
    plainSummary: '단 2개의 선(SDA 데이터, SCL 시계)에 주소가 다른 센서 여러 개를 줄줄이 연결할 수 있는 편리한 통신 방식입니다.',
    analogy: '한 도로 위에서 집 주소(0x68 등)를 불러 원하는 센서에게만 택배를 전하는 방식입니다.',
    aliases: ['I2C'],
  },
  {
    id: 'spi',
    term: 'SPI 통신',
    english: 'Serial Peripheral Interface',
    category: '신호·통신',
    plainSummary: '선을 4개 이상 쓰지만 속도가 매우 빨라 화면(LCD), SD카드, 고속 센서 연결에 쓰는 고속 통신 방식입니다.',
    analogy: '전용 고속도로 차선을 여러 개 뚫어 대용량 화물을 빠르게 옮기는 방식입니다.',
    aliases: ['SPI'],
  },
  {
    id: 'nonblocking',
    term: '논블로킹 (millis)',
    english: 'Non-blocking Timing',
    category: '신호·통신',
    plainSummary: 'delay()로 보드를 멍하니 멈춰 세우지 않고, 시계(millis)를 보면서 여러 센서와 모터를 동시에 처리하는 코딩 방식입니다.',
    analogy: '라면 물 끓는 3분 동안 가만히 서 있지 않고 그동안 김치를 썰어두는 멀티태스킹입니다.',
    aliases: ['논블로킹', 'millis()'],
  },
  {
    id: 'fsm',
    term: '유한 상태 머신 (FSM)',
    english: 'Finite State Machine',
    category: '신호·통신',
    plainSummary: '로봇의 행동을 "대기 → 주행 → 회피 → 비상정지"처럼 몇 개의 명확한 상태와 전환 규칙으로 정리해 짜는 설계법입니다.',
    analogy: '신호등이 빨강→초록→노랑 정해진 규칙대로만 바뀌어 사고를 막는 구조입니다.',
    aliases: ['유한 상태 머신', 'FSM'],
  },
  {
    id: 'isr',
    term: '인터럽트 (ISR)',
    english: 'Interrupt Service Routine',
    category: '신호·통신',
    plainSummary: '평소 코드를 실행하다가 긴급 신호가 들어오면 하던 일을 잠깐 멈추고 0.001초 만에 즉시 처리하는 응급 호출 함수입니다.',
    analogy: '공부하다가 현관 초인종이 울리면 즉시 문을 열고 다시 공부로 돌아오는 것과 같습니다.',
    aliases: ['ISR', '인터럽트'],
  },
  {
    id: 'freertos',
    term: 'FreeRTOS (듀얼코어 태스크)',
    english: 'Real-Time Operating System',
    category: '신호·통신',
    plainSummary: 'ESP32의 두 개 CPU 코어에 "주행 제어"와 "무선 통신" 같은 작업을 나눠 동시에 돌리게 해주는 초경량 운영체제입니다.',
    analogy: '요리사 2명이 한 명은 면 삶고, 한 명은 소스 만들며 분업하는 주방 시스템입니다.',
    aliases: ['FreeRTOS'],
  },

  // --- 모터·기구 ---
  {
    id: 'actuator',
    term: '액추에이터',
    english: 'Actuator',
    category: '모터·기구',
    plainSummary: '전기 신호를 받아 실제로 움직이거나 소리·빛 같은 물리적 행동을 만들어 내는 로봇의 근육 부품(모터, 서보, 부저 등)입니다.',
    analogy: '두뇌(MCU)의 명령을 받아 실제로 팔다리를 움직이는 "근육"입니다.',
    aliases: ['액추에이터'],
  },
  {
    id: 'torque',
    term: '토크 (회전 힘)',
    english: 'Torque',
    category: '모터·기구',
    plainSummary: '모터 축이 물체를 비틀어 돌리는 힘입니다(단위: kg·cm 또는 N·m). 팔이 길어질수록 더 큰 토크가 필요합니다.',
    analogy: '긴 막대기 끝에 무거운 가방을 매달면 손목이 더 묵직해지는 회전 힘입니다.',
    aliases: ['토크'],
  },
  {
    id: 'h_bridge',
    term: 'H-브리지 (모터 드라이버)',
    english: 'H-Bridge',
    category: '모터·기구',
    plainSummary: 'DC 모터에 흐르는 전기 방향을 뒤집어 정회전·역회전을 시키고, 큰 모터 전류를 대신 감당해 주는 스위치 4개 회로입니다.',
    analogy: '기차 선로 변환기처럼 전류 방향을 앞뒤로 바꿔 모터를 정/역회전시키는 장치입니다.',
    aliases: ['H-브리지', 'MOSFET'],
  },
  {
    id: 'servo_stepper',
    term: '서보 / 스테퍼 모터',
    english: 'Servo / Stepper Motor',
    category: '모터·기구',
    plainSummary: '서보는 원하는 각도(0~180°)로 딱 멈추는 모터이고, 스테퍼는 1도씩 딱딱 끊어 정밀 회전하는 3D프린터용 모터입니다.',
    analogy: '서보는 "오른쪽으로 45도 봐!" 하면 멈추는 관절, 스테퍼는 눈금 따라 한 칸씩 걷는 시계 바늘입니다.',
    aliases: ['서보', '스테퍼'],
  },
  {
    id: 'gimbal_quaternion',
    term: '짐벌락 & 쿼터니언',
    english: 'Gimbal Lock & Quaternion',
    category: '모터·기구',
    plainSummary: '3D 회전을 각도 3개(오일러)로 표현하면 두 축이 겹쳐 회전이 잠기는(짐벌락) 버그가 생기며, 이를 4개 숫자로 막는 방식이 쿼터니언입니다.',
    analogy: '나침반 고리 2개가 90도로 겹쳐 한 방향으로 못 도는 현상을 4차원 수로 피하는 기법입니다.',
    aliases: ['짐벌락', '쿼터니언'],
  },
  {
    id: 'kinematics_fk_ik',
    term: '정기구학(FK) / 역기구학(IK)',
    english: 'Forward / Inverse Kinematics',
    category: '모터·기구',
    plainSummary: '관절 각도를 주고 손 끝 위치를 구하는 게 FK, 반대로 "손 끝을 (x, y)로 보내려면 관절을 몇 도로 꺾어야 하지?"를 푸는 게 IK입니다.',
    analogy: '팔꿈치를 30도 접고 뻗으면 어디 닿는지 계산이 FK, 물컵 잡으려고 팔 각도를 역산하는 게 IK입니다.',
    aliases: ['기구학', '정기구학', '역기구학', 'FK', 'IK'],
  },
  {
    id: 'jacobian_singularity',
    term: '야코비안 & 특이점',
    english: 'Jacobian & Singularity',
    category: '모터·기구',
    plainSummary: '야코비안은 관절 속도와 손 끝 속도의 비율표이고, 특이점은 로봇 팔이 완전히 펴지거나 접혀 특정 방향으로 움직일 수 없게 막히는 자세입니다.',
    analogy: '팔을 일자로 쭉 편 상태에서는 손끝을 바깥으로 더 밀 수 없어 관절이 버벅이는 것과 같습니다.',
    aliases: ['야코비안', '특이점'],
  },

  // --- 제어·자율 ---
  {
    id: 'encoder_odometry',
    term: '엔코더 & 오도메트리',
    english: 'Encoder & Odometry',
    category: '제어·자율',
    plainSummary: '엔코더는 바퀴가 몇 바퀴 돌았는지 세는 센서이고, 오도메트리는 그 회전수를 합산해 로봇의 현재 이동 거리를 계산하는 방법입니다.',
    analogy: '눈을 감고 "내 걸음 수 × 보폭"으로 내가 몇 미터 걸었는지 추정하는 것과 같습니다.',
    aliases: ['오도메트리', '엔코더'],
  },
  {
    id: 'imu_drift',
    term: 'IMU & 자이로 드리프트',
    english: 'IMU & Gyro Drift',
    category: '제어·자율',
    plainSummary: 'IMU는 기울기와 회전 속도를 재는 균형 감각 센서(가속도+자이로)입니다. 자이로 오차가 시간에 따라 쌓여 각도가 슬금슬금 틀어지는 게 드리프트입니다.',
    analogy: '귀 속 평형기관 같은 센서지만, 오래 적분하면 조금씩 방향 감각이 어긋나는 약점이 있습니다.',
    aliases: ['IMU', '드리프트'],
  },
  {
    id: 'filters',
    term: 'LPF / 상보 필터 / 칼만 필터',
    english: 'Low-Pass / Complementary / Kalman Filter',
    category: '제어·자율',
    plainSummary: '센서의 덜덜 떨리는 노이즈를 걸러내거나(LPF), 두 센서의 장점만 섞어(상보/칼만) 진짜 자세와 위치를 깔끔하게 추정하는 수학 거름망입니다.',
    analogy: '흔들리는 손떨림 영상에서 부드러운 움직임만 남겨주는 카메라 손떨림 보정과 같습니다.',
    aliases: ['상보 필터', '칼만 필터', 'LPF'],
  },
  {
    id: 'pid_windup',
    term: 'PID 제어 & 와인드업',
    english: 'PID Control & Anti-Windup',
    category: '제어·자율',
    plainSummary: '목표와의 차이(P), 쌓인 오차(I), 변화 속도(D)를 합쳐 목표에 부드럽게 맞추는 제어법입니다. 모터가 막혔을 때 오차(I)가 무한히 쌓이는 병이 와인드업입니다.',
    analogy: '샤워기 물 온도를 맞출 때 차가우면 더 돌리고, 너무 뜨거워지려 하면 미리 줄이는 자동 조절입니다.',
    aliases: ['안티 와인드업', '와인드업', 'PID'],
  },
  {
    id: 'crc8',
    term: 'CRC8 (오류 검사 코드)',
    english: 'Cyclic Redundancy Check',
    category: '제어·자율',
    plainSummary: '통신 중 잡음 때문에 숫자 한 글자라도 깨졌는지 수신 측에서 바로 알아채고 버리기 위해 끝에 붙이는 검증용 요약 숫자입니다.',
    analogy: '택배 상자 안에 "총 5개 맞는지 확인용 숫자"를 적어 보내는 것과 같습니다.',
    aliases: ['CRC8'],
  },
  {
    id: 'cspace_path',
    term: 'C-Space / A* / DWA',
    english: 'Configuration Space / Path Planning',
    category: '제어·자율',
    plainSummary: '로봇 몸체 반지름만큼 장애물을 뚱뚱하게 키워 충돌을 막고(C-Space), 최단 경로를 찾은 뒤(A*), 갑자기 튀어나온 장애물을 피해 주행(DWA)하는 기술입니다.',
    analogy: '내비게이션으로 큰길을 먼저 찾고(A*), 골목길에서 사람이 튀어나오면 핸들을 꺾는(DWA) 것과 같습니다.',
    aliases: ['C-Space', 'A*', 'DWA'],
  },
  {
    id: 'ros2_tf2_urdf',
    term: 'ROS 2 / QoS / TF2 / URDF',
    english: 'Robot Operating System 2',
    category: '제어·자율',
    plainSummary: 'ROS 2는 로봇 프로그램들이 서로 대화(Topic/QoS)하는 표준 OS이며, URDF는 로봇 설계도, TF2는 카메라·바퀴·팔의 상대 위치를 실시간 계산하는 좌표 트리입니다.',
    analogy: '눈·귀·팔·다리가 각자 다른 회사 부품이어도 표준 언어로 대화하게 해주는 공용 통역망입니다.',
    aliases: ['ROS 2', 'QoS', 'TF2', 'URDF'],
  },
  {
    id: 'mcl_slam',
    term: '파티클 필터(MCL) & SLAM',
    english: 'Localization & Mapping',
    category: '제어·자율',
    plainSummary: '점 수백 개를 뿌려 로봇 위치를 맞추는 게 파티클 필터(MCL), 낯선 방을 돌아다니며 지도를 그리면서 동시에 내 위치도 찾는 기술이 SLAM입니다.',
    analogy: '어두운 건물에서 벽을 더듬으며 평면도를 직접 그리면서 내가 몇 층 어디인지 파악하는 과정입니다.',
    aliases: ['몬테카를로 위치 추정', '파티클 필터', '루프 클로저', 'SLAM', 'MCL'],
  },

  // --- 기판·디버그 ---
  {
    id: 'pcb_trace',
    term: 'PCB & 트레이스 / 풋프린트',
    english: 'PCB Trace & Footprint',
    category: '기판·디버그',
    plainSummary: 'PCB는 점퍼선 없이 구리 길로 만든 완성형 기판이고, 트레이스는 전기가 다니는 구리 선폭, 풋프린트는 부품을 납땜할 구멍·패드 도면입니다.',
    analogy: '전선 뭉치를 깔끔한 인쇄 도로(트레이스)로 찍어낸 맞춤 전자 기판입니다.',
    aliases: ['풋프린트', '트레이스', 'Copper Pour', 'GND 플레인', 'PCB'],
  },
  {
    id: 'decoupling',
    term: '디커플링 커패시터 & 리플',
    english: 'Decoupling Capacitor',
    category: '기판·디버그',
    plainSummary: '칩이 순간적으로 큰 전기를 빨아들일 때 전압이 출렁이는(리플) 것을 막기 위해 칩 현관 바로 앞에 붙여두는 초소형 전기 물통(0.1µF)입니다.',
    analogy: '화장실 변기 물을 내릴 때 수도 압력이 떨어지지 않게 옆에 두는 작은 보조 물탱크입니다.',
    aliases: ['디커플링 커패시터', '리플'],
  },
  {
    id: 'gerber_drc',
    term: 'ERC / DRC & Gerber',
    english: 'Design Rule Check & Gerber',
    category: '기판·디버그',
    plainSummary: 'DRC는 구리선이 너무 가깝거나 끊긴 곳이 없는지 자동으로 검사하는 기능이고, Gerber는 공장에 PCB 제작을 맡길 때 보내는 최종 설계 파일입니다.',
    analogy: '인쇄소에 책을 넘기기 전 오탈자와 여백 오류를 자동 검사(DRC)하고 PDF(Gerber)로 내보내는 과정입니다.',
    aliases: ['Gerber', 'DRC', 'ERC'],
  },
  {
    id: 'emi',
    term: 'EMI (전자파 간섭 노이즈)',
    english: 'Electromagnetic Interference',
    category: '기판·디버그',
    plainSummary: 'DC 모터 브러시 등에서 튀는 전기 스파크가 공중이나 전선을 타고 날아가 주변 센서·보드 통신을 오작동시키는 잡음입니다.',
    analogy: '근처에서 드릴을 돌릴 때 TV 화면이나 라디오에 지지직 잡음이 끼는 현상입니다.',
    aliases: ['EMI'],
  },
];

export interface GlossaryToken {
  text: string;
  entry?: GlossaryEntry;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildPatternForAlias(alias: string): string {
  const escaped = escapeRegExp(alias);
  const startsAscii = /^[A-Za-z0-9]/.test(alias);
  const endsAscii = /[A-Za-z0-9]$/.test(alias);

  const prefix = startsAscii ? '(?<![A-Za-z0-9_])' : '';
  // Allow digits after ASCII acronyms (e.g. GPIO13, ADC1) and Korean particles after any term
  let suffix = endsAscii ? '(?![A-Za-z_])' : '';
  if (alias === '단락') {
    suffix = '(?!별)';
  }
  return `${prefix}${escaped}${suffix}`;
}

interface CompiledGlossaryMatcher {
  regex: RegExp;
  aliasMap: Map<string, GlossaryEntry>;
}

const COMPILED_MATCHER: CompiledGlossaryMatcher = (() => {
  const aliasPairs: { alias: string; entry: GlossaryEntry }[] = [];
  const aliasMap = new Map<string, GlossaryEntry>();

  for (const entry of GLOSSARY_ENTRIES) {
    for (const alias of entry.aliases) {
      if (!aliasMap.has(alias)) {
        aliasMap.set(alias, entry);
        aliasPairs.push({ alias, entry });
      }
    }
  }

  // Match longest aliases first so multi-word terms win over short fragments
  aliasPairs.sort((a, b) => b.alias.length - a.alias.length);

  const union = aliasPairs.map((p) => buildPatternForAlias(p.alias)).join('|');
  return {
    regex: new RegExp(union, 'g'),
    aliasMap,
  };
})();

export function tokenizeGlossaryText(text: string): GlossaryToken[] {
  if (!text) return [];
  const tokens: GlossaryToken[] = [];
  const { regex, aliasMap } = COMPILED_MATCHER;
  regex.lastIndex = 0;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const matchedText = match[0];
    const start = match.index;

    if (start > lastIndex) {
      tokens.push({ text: text.slice(lastIndex, start) });
    }

    const entry = aliasMap.get(matchedText);
    if (entry) {
      tokens.push({ text: matchedText, entry });
    } else {
      tokens.push({ text: matchedText });
    }

    lastIndex = start + matchedText.length;
  }

  if (lastIndex < text.length) {
    tokens.push({ text: text.slice(lastIndex) });
  }

  return tokens;
}
