import { LabModule } from '../types/lab';
import { PHASE1_EXTRA_MODULES } from './phase1ExtraModules';
import { PHASE2_MODULES } from './phase2Modules';
import { PHASE3_MODULES } from './phase3Modules';
import { PHASE4_MODULES } from './phase4Modules';
import { PHASE5_MODULES } from './phase5Modules';
import { PHASE6_MODULES } from './phase6Modules';

const BASE_LAB_MODULES: LabModule[] = [
  {
    id: 'day01_basics',
    order: 0,
    dayLabel: 'Day 01',
    phaseLabel: 'Phase 1 · 전기/보드 기초',
    title: '로봇의 해부학 & 직류 전기 · 옴의 법칙',
    shortTitle: 'D01 · 전기/LED',
    subtitle: '센서–두뇌–액추에이터 3요소 · 전압/전류/저항 · LED 보호 저항',
    badge: '왕초보 첫걸음',
    milestoneTag: 'Day 01 인터랙티브 회로',
    failFirstHook:
      '5V 전원이나 보드 핀에 LED를 저항 없이 바로 꽂으면 전류가 수백 mA로 치솟아 1초 만에 LED가 "퍽" 하고 타며 보드 핀도 손상됩니다.',
    beginnerAnalogy:
      '전압(V)은 물탱크 높이(수압), 전류(A)는 호스에 흐르는 물의 양, 저항(Ω)은 호스를 좁혀 물살을 안전하게 조절하는 밸브입니다.',
    overviewSummary:
      '로봇은 거창한 기계가 아니라 [감각(센서) → 판단(두뇌 MCU) → 움직임(액추에이터)]의 반복 루프입니다. 이 신호들이 전선을 따라 흐르려면 전기의 3대장(전압 V, 전류 I, 저항 R)을 안전하게 다룰 줄 알아야 보드를 태우지 않습니다.',
    guidedMissions: [
      {
        id: 'd01-anatomy',
        title: '로봇 해부도에서 센서·두뇌·액추에이터 클릭하기',
        hint: '좌측/상단 캔버스의 로봇 부위를 눌러 신호 흐름을 확인하세요.',
      },
      {
        id: 'd01-overcurrent',
        title: '회로 실험실에서 저항을 0Ω으로 낮춰 과전류 경고 체험하기',
        hint: '실험실 상단 "직류 회로" 모드 → 0Ω(직결) 버튼을 눌러보세요.',
      },
      {
        id: 'd01-safe-led',
        title: '저항값을 맞춰 안전 구간(5~20mA)으로 LED 켜기',
        hint: '220Ω 또는 슬라이더로 전류가 초록색 SAFE 구간에 들어오게 맞추세요.',
      },
    ],
    highlights: [
      {
        title: '로봇의 3요소: 센서 → 두뇌 → 액추에이터',
        body: '초음파·카메라(센서)가 세상을 읽고, ESP32(두뇌)가 코드로 판단한 뒤, 모터·LED·서보(액추에이터)가 물리적으로 반응합니다. 어떤 거대한 휴머노이드도 이 루프의 확장입니다.',
        tone: 'cyan',
      },
      {
        title: '옴의 법칙 V = I × R 과 전류 제한',
        body: '전압(V)을 고정했을 때 저항(R)이 0에 가까워지면 전류(I = V/R)가 무한대로 치솟습니다(합선/단락). 부품을 보호하려면 반드시 적절한 저항으로 전류 상한을 막아주어야 합니다.',
        tone: 'emerald',
      },
      {
        title: 'ESP32 핀 20mA 규칙 & LED 순방향 전압(Vf)',
        body: '일반 빨강 LED는 약 2.0V만 넘으면 전류가 급증하며 10~20mA에서 밝게 켜집니다. ESP32 GPIO 핀의 권장 최대 전류도 20mA이므로, 5V나 3.3V에서 남은 전압을 저항이 흡수해 주어야 합니다.',
        tone: 'rose',
      },
    ],
    formulas: [
      {
        title: '옴의 법칙 (Ohm’s Law)',
        latex: String.raw`V = I \cdot R \quad \Longleftrightarrow \quad I = \frac{V}{R}`,
        description:
          '전류 I(A)는 전압 V(V)에 비례하고 저항 R(Ω)에 반비례합니다. (1 A = 1,000 mA)',
      },
      {
        title: 'LED 직렬 보호 저항 계산식',
        latex: String.raw`R = \frac{V_{\text{source}} - V_f}{I_{\text{target}}}`,
        description:
          '예: 5V 전원에서 빨강 LED(Vf = 2.0V)에 15mA(0.015A)를 흘리려면 R = (5 - 2) / 0.015 = 200Ω → 표준 220Ω 저항 선택!',
      },
      {
        title: '소비 전력 (발열 체크)',
        latex: String.raw`P = V \cdot I = I^2 R`,
        description:
          '일반 소형 1/4W(250mW) 저항은 0.25W 이상 열이 나면 타버립니다.',
      },
    ],
    specs: [
      { label: 'ESP32 핀 전압', value: '3.3 V', note: 'USB·아두이노는 5.0V', tone: 'cyan' },
      { label: '안전 LED 전류', value: '5 ~ 20 mA', note: 'GPIO 핀 권장 한계', tone: 'emerald' },
      { label: '빨강/파랑 LED Vf', value: '2.0V / 3.2V', note: '색상별 전압 강하 차이', tone: 'amber' },
      { label: '직결 (0Ω) 위험', value: '> 30 mA POP!', note: 'LED·MCU 핀 소손 위험', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '전원 플러스 (+ / VCC)',
        pin: '3.3V 또는 5V → 보호 저항 한쪽 다리',
        detail: '항상 전류가 LED로 들어가기 전(또는 나온 후) 직렬로 보호 저항(220Ω~330Ω)을 거칩니다.',
      },
      {
        signal: 'LED 극성 구분 (중요!)',
        pin: '긴 다리(+) 애노드 · 짧은 다리(-) 캐소드',
        detail: 'LED는 다이오드이므로 거꾸로 꽂으면 불이 켜지지 않습니다. 플라스틱 테두리의 깎인 평평한 면이 (-)입니다.',
      },
      {
        signal: '접지 (- / GND)',
        pin: 'LED 짧은 다리 → 보드 GND',
        detail: '전기는 +에서 출발해 반드시 GND(-)로 돌아오는 닫힌 고리(폐회로)를 만들어야 흐릅니다.',
        warning: '전원 +와 GND를 부품 없이 직접 이으면 합선(Short)으로 배터리가 과열됩니다.',
      },
    ],
    codeTitle: 'day01_ohm_led_safety.ino',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 01: 안전한 LED 점등 & 옴의 법칙 출력
// 하드웨어: GPIO 13 -> [220Ω 보호 저항] -> LED(+) -> LED(-) -> GND

const int LED_PIN = 13;

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT); // 핀을 출력(전압 공급) 모드로 설정

  float Vs = 3.3;     // ESP32 로직 전압 (V)
  float Vf = 2.0;     // 빨강 LED 순방향 전압 강하 (V)
  float R  = 220.0;   // 직렬 보호 저항 (Ω)
  float current_mA = ((Vs - Vf) / R) * 1000.0;

  Serial.printf("예상 전류: %.2f mA (권장 20mA 이하 안전!)\\n", current_mA);
}

void loop() {
  digitalWrite(LED_PIN, HIGH); // 3.3V 출력 -> LED ON
  delay(500);
  digitalWrite(LED_PIN, LOW);  // 0V 출력   -> LED OFF
  delay(500);
}`,
    codeChallenge: {
      prompt: 'LED를 제어하려고 GPIO 13번 핀에 HIGH 신호를 줬는데 불이 전혀 안 들어옵니다. 아래 setup()의 버그를 고쳐보세요!',
      buggyLine: 'pinMode(LED_PIN, INPUT); // 실수로 입력 모드로 설정함!',
      options: [
        'pinMode(LED_PIN, OUTPUT);',
        'digitalWrite(LED_PIN, INPUT);',
        'analogRead(LED_PIN);',
      ],
      correctIndex: 0,
      explanation:
        'LED나 모터처럼 보드가 바깥으로 전기를 내보내야 할 때는 반드시 pinMode(핀, OUTPUT)으로 설정해야 전류를 공급할 수 있습니다.',
    },
    quizzes: [
      {
        id: 'Q0-1',
        question: '모든 로봇이 주변 환경을 인식하고 움직이기 위해 반복하는 기본 3요소 루프의 올바른 순서는?',
        options: [
          '액추에이터 → 전원 → 센서',
          '센서(감각) → 마이크로컨트롤러(두뇌) → 액추에이터(근육)',
          '모터 → 저항 → 배터리',
          'Wi-Fi → LED → 브레드보드',
        ],
        correctIndex: 1,
        explanation:
          '로봇은 센서로 환경 정보를 읽고(Sense), MCU 두뇌가 판단해(Think), 모터·서보·LED 등 액추에이터로 행동(Act)하는 루프를 반복합니다.',
      },
      {
        id: 'Q0-2',
        question: '5V 전원(Vs = 5V)에 순방향 전압 Vf = 2V인 빨강 LED를 15mA(0.015A)로 안전하게 켜려고 합니다. 가장 적절한 직렬 보호 저항값은?',
        options: ['10 Ω', '50 Ω', '200 Ω (표준 220 Ω)', '10,000 Ω (10 kΩ)'],
        correctIndex: 2,
        explanation:
          'R = (Vs - Vf) / I = (5 - 2) / 0.015 = 3 / 0.015 = 200Ω입니다. 실제 부품에서는 가장 가까운 표준 저항인 220Ω을 사용합니다.',
      },
      {
        id: 'Q0-3',
        question: '회로에 걸리는 전압(V)이 같을 때, 보호 저항(R)을 0Ω(직결)으로 만들면 전류(I)는 어떻게 변하나요?',
        options: [
          '전류가 0mA가 되어 아무 일도 일어나지 않는다.',
          '전류가 급격히 커져 LED와 보드 GPIO 핀이 과전류로 손상된다.',
          'LED가 두 배 더 오래 수명을 유지한다.',
          '전압이 자동으로 0V로 내려간다.',
        ],
        correctIndex: 1,
        explanation:
          'I = V / R에서 분모인 R이 0에 가까워지면 전류가 폭발적으로 증가(단락/과전류)하여 LED가 타버리고 MCU 핀(최대 40mA)까지 파손될 수 있습니다.',
      },
      {
        id: 'Q0-4',
        question: 'ESP32의 3.3V 출력 핀에 파랑 LED(Vf = 3.2V)와 220Ω 저항을 연결했을 때 흐르는 전류는 약 얼마인가요? (빨강 LED Vf=2.0V와 비교해보세요)',
        options: [
          '약 0.45 mA (전압 여유가 0.1V뿐이라 매우 어둡거나 거의 안 켜짐)',
          '약 15 mA (아주 밝음)',
          '약 100 mA (과전류)',
          '약 500 mA (즉시 폭발)',
        ],
        correctIndex: 0,
        explanation:
          'I = (3.3 - 3.2) / 220 ≈ 0.00045A = 0.45mA입니다. 파랑·흰색 LED는 Vf가 약 3.0~3.3V로 높기 때문에 3.3V 보드에서는 100Ω 이하의 작은 저항을 쓰거나 5V 전원을 활용해야 밝게 켜집니다.',
      },
      {
        id: 'Q0-5',
        question: '직류 회로에서 전압 5V, 전류 0.2A(200mA)가 흐를 때 회로 전체가 소비하는 전력(P)은?',
        options: ['0.04 W', '1.0 W', '2.5 W', '25 W'],
        correctIndex: 1,
        explanation:
          '소비 전력 P = V × I = 5V × 0.2A = 1.0W(1,000mW)입니다. 저항이나 레귤레이터를 고를 때는 항상 정격 전력(예: 0.25W)을 넘지 않는지 확인해야 합니다.',
      },
    ],
  },
  {
    id: 'esp32',
    order: 1,
    dayLabel: 'Day 09',
    phaseLabel: 'Phase 2 · ESP32/모터',
    title: 'ESP32 아키텍처 & GPIO 핀 제약',
    shortTitle: 'D09 · ESP32 핀맵',
    subtitle: '안전 핀 · 입력 전용(GPI) · 스트래핑 핀 · SPI Flash 금지 핀',
    badge: '하드웨어 기초',
    milestoneTag: 'Day 09 인터랙티브 3D 보드',
    failFirstHook:
      'ESP32 보드 옆에 핀 번호가 많다고 아무 구멍이나 골라 GPIO 6~11에 센서를 꽂으면 보드가 즉시 먹통이 되고, GPIO 12에 풀업 저항을 달면 부팅조차 되지 않습니다.',
    beginnerAnalogy:
      'ESP32의 30개 핀은 똑같은 아파트 현관문 같지만, 어떤 문은 "내부 창고 전용(GPIO 6~11)", 어떤 문은 "출근 모드 체크 스위치(Strapping)", 어떤 문은 "초인종 전용(입력만 가능 34~39)"이라 용도를 알고 꽂아야 합니다.',
    overviewSummary:
      'ESP32(ESP-WROOM-32 기준)는 강력한 듀얼 코어 MCU지만, 부팅 스트래핑과 내장 SPI 플래시, 출력 드라이버 유무, Wi-Fi–ADC2 리소스 공유 같은 물리적 제약이 존재합니다. 3D 보드의 각 핀을 탭해 안전 등급과 전기적 한계를 확인하세요.',
    guidedMissions: [
      {
        id: 'esp32-prohibited',
        title: '3D 보드에서 핀(또는 GPIO 6~11 금지핀 필터) 직접 탭해 스펙 확인하기',
        hint: '3D 화면의 금색 핀을 클릭하거나 핀·배선 탭에서 "사용 금지" 필터를 눌러보세요.',
      },
      {
        id: 'esp32-wifi',
        title: '시뮬레이터에서 Wi-Fi 활성화 켜고 ADC2 빨간 충돌 확인하기',
        hint: '직접 실습 탭에서 "내장 Wi-Fi 통신 활성화" 스위치를 ON으로 바꾸세요.',
      },
      {
        id: 'esp32-explode',
        title: '3D 보드 "분해 보기"로 내부 RF 쉴드와 헤더 분리하기',
        hint: '3D 화면 우측 상단 "분해 보기" 버튼을 누르거나 분해 슬라이더를 올리세요.',
      },
    ],
    highlights: [
      {
        title: '전류 한계 & 3.3V 로직 레벨',
        body: 'GPIO 핀당 절대 최대 허용 전류는 40mA이며, 안정적인 연속 구동을 위한 권장 전류는 20mA 이하입니다. 모든 GPIO는 3.3V 로직 레벨로 구동됩니다.',
        tone: 'emerald',
      },
      {
        title: 'Wi-Fi 사용 시 ADC2 채널 충돌',
        body: 'ADC2 그룹(GPIO 0, 2, 4, 12~15, 25~27)은 Wi-Fi 드라이버와 하드웨어를 공유하므로, Wi-Fi 통신 중에는 반드시 ADC1(GPIO 32, 33, 34, 35, 36, 39)을 사용해야 합니다.',
        tone: 'amber',
      },
      {
        title: 'SPI Flash 직결 핀 (GPIO 6~11) 연결 금지',
        body: 'GPIO 6~11은 모듈 내부 SPI 플래시(CLK, SD0~3, CMD)에 직결되어 외부 결선 시 즉시 크래시 및 부팅 불가를 유발합니다.',
        tone: 'rose',
      },
    ],
    formulas: [
      {
        title: 'GPIO 핀당 연속 구동 권장 전류 조건',
        latex: String.raw`I_{\text{GPIO, rec}} \le 20\text{ mA} < I_{\text{GPIO, abs max}} = 40\text{ mA}`,
        description: '데이터시트 기준 절대 최대 40mA, 연속 구동 시 20mA 이하 권장',
      },
    ],
    specs: [
      { label: '동작 로직 전압', value: '3.3 V', note: '5V 직접 입력 금지', tone: 'cyan' },
      { label: '권장 / 최대 전류', value: '20 / 40 mA', note: 'GPIO 핀당 허용치', tone: 'emerald' },
      { label: '입력 전용 (GPI)', value: '34, 35, 36, 39', note: '내부 풀업/다운 없음', tone: 'amber' },
      { label: '사용 금지 (Flash)', value: 'GPIO 6 ~ 11', note: 'SPI 버스 충돌 위험', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '기본 I2C 버스',
        pin: 'GPIO 21 (SDA) · GPIO 22 (SCL)',
        detail: 'IMU(MPU6050), 조도 센서(BH1750) 연결 표준 안전 핀',
      },
      {
        signal: '기본 VSPI 버스',
        pin: 'GPIO 18 (SCK) · 19 (MISO) · 23 (MOSI)',
        detail: '고속 디스플레이, SD카드 등 SPI 주변장치 권장 핀',
      },
      {
        signal: '부팅 글리치 회피',
        pin: 'GPIO 0, 1, 3, 5, 14, 15 피하기',
        detail: '릴레이/모터 드라이버 Enable 핀에는 부팅 글리치가 없는 안전 핀 할당',
        warning: 'GPIO 12가 부팅 시 HIGH면 플래시 전압 오류로 부팅 실패',
      },
    ],
    codeTitle: 'esp32_safe_gpio_pwm.ino',
    codeLanguage: 'cpp',
    codeSnippet: `// ESP32 안전 핀 & ADC1 읽기 + LEDC PWM 예제
#define SAFE_PWM_PIN   13   // 서보/모터 제어 안전 핀
#define SAFE_ADC1_PIN  34   // 입력 전용(GPI) + ADC1 (Wi-Fi 중에도 안정적)

void setup() {
  Serial.begin(115200);
  // 주의: GPIO 34, 35, 36, 39는 내부 풀업/풀다운이 없으므로 외부 저항 필요
  pinMode(SAFE_ADC1_PIN, INPUT);
  ledcAttach(SAFE_PWM_PIN, 50, 16); // 50Hz 서보 PWM, 16-bit 해상도
}

void loop() {
  int raw = analogRead(SAFE_ADC1_PIN);        // 0 ~ 4095 (12-bit ADC1)
  uint32_t duty = map(raw, 0, 4095, 1638, 8192); // ~0.5ms ~ 2.5ms 펄스폭
  ledcWrite(SAFE_PWM_PIN, duty);
  delay(20);
}`,
    codeChallenge: {
      prompt: 'Wi-Fi로 조종하는 로봇에서 배터리 전압(아날로그)을 읽으려는데 Wi-Fi를 켜자마자 값이 안 읽힙니다. 안전하게 핀을 교체해 보세요!',
      buggyLine: '#define BATTERY_ADC_PIN 25 // ADC2 핀: Wi-Fi와 충돌!',
      options: [
        '#define BATTERY_ADC_PIN 34 // ADC1 핀: Wi-Fi 중에도 안정',
        '#define BATTERY_ADC_PIN 6  // SPI Flash 핀',
        '#define BATTERY_ADC_PIN 12 // Strapping + ADC2 핀',
      ],
      correctIndex: 0,
      explanation:
        'GPIO 25는 ADC2 블록이라 Wi-Fi가 켜지면 아날로그 읽기가 중단됩니다. GPIO 32, 33, 34, 35, 36, 39 중 하나(ADC1)로 옮겨야 합니다.',
    },
    quizzes: [
      {
        id: 'Q1-1',
        question:
          'ESP32에서 내부 풀업 및 풀다운 회로가 집적되어 있지 않아 오직 입력(GPI)으로만 사용할 수 있는 핀 그룹은?',
        options: [
          'GPIO 16, 17, 18, 19',
          'GPIO 34, 35, 36, 39',
          'GPIO 6, 7, 8, 9',
          'GPIO 0, 2, 4, 5',
        ],
        correctIndex: 1,
        explanation:
          'GPIO 34, 35, 36(SENSOR_VP), 39(SENSOR_VN)은 내부 풀업/풀다운 저항 및 출력 트랜지스터가 생략된 입력 전용 핀으로 출력으로 구동할 수 없습니다.',
      },
      {
        id: 'Q1-2',
        question:
          '부팅 시 특정 로직 전압 레벨을 검출하여 칩의 동작 모드를 결정하는 스트래핑(Strapping) 핀이 아닌 것은?',
        options: ['GPIO 0', 'GPIO 12', 'GPIO 15', 'GPIO 21'],
        correctIndex: 3,
        explanation:
          'GPIO 0, 2, 5, 12, 15는 칩 초기화 및 부팅 모드를 구성하는 스트래핑 핀입니다. GPIO 21은 안전하게 입출력으로 쓸 수 있는 일반 I2C SDA 핀입니다.',
      },
      {
        id: 'Q1-3',
        question:
          '모듈 내부의 통합 SPI 플래시 메모리에 직결되어 있어 외부 회로를 연결할 경우 즉각적인 펌웨어 충돌을 일으키는 핀 번호 범위는?',
        options: [
          'GPIO 6 ~ GPIO 11',
          'GPIO 12 ~ GPIO 15',
          'GPIO 21 ~ GPIO 23',
          'GPIO 32 ~ GPIO 35',
        ],
        correctIndex: 0,
        explanation:
          'GPIO 6~11은 ESP-WROOM-32 내부 SPI 플래시 메모리(CLK, SD0, SD1, SD2, SD3, CMD)에 직결되어 있으므로 외부 결선이 엄격히 금지됩니다.',
      },
      {
        id: 'Q1-4',
        question:
          'ESP32에서 내장 Wi-Fi 모듈이 활성화되었을 때 하드웨어 리소스 경합으로 인해 아날로그 전압 읽기(analogRead)가 제한되는 블록은?',
        options: ['ADC1', 'ADC2', 'DAC1', 'DAC2'],
        correctIndex: 1,
        explanation:
          'ADC2 채널(GPIO 0, 2, 4, 12~15, 25~27)은 Wi-Fi 하드웨어 드라이버와 내부 회로를 공유하므로 Wi-Fi 구동 중에는 ADC1만 안정적으로 활용할 수 있습니다.',
      },
      {
        id: 'Q1-5',
        question: 'ESP32의 GPIO 전기적 정격 사양에 대한 설명으로 옳은 것은?',
        options: [
          'GPIO 핀당 절대 최대 허용 전류는 40mA이다.',
          '모든 GPIO 핀은 5V 로직 입력을 직접 인가받을 수 있다.',
          '부팅 직후 모든 GPIO는 글리치 없이 완전한 LOW 상태를 유지한다.',
          '아날로그 디지털 변환기는 기본 8비트 분해능만을 지원한다.',
        ],
        correctIndex: 0,
        explanation:
          'ESP32 GPIO의 핀당 절대 최대 정격 전류는 40mA(권장 20mA 이하)입니다. 칩은 3.3V 로직 레벨로 구동되며, 부팅 시 특정 핀에서 PWM 및 UART 신호 글리치가 발생할 수 있습니다.',
      },
    ],
  },
  {
    id: 'kinematics',
    order: 2,
    dayLabel: 'Day 21~22',
    phaseLabel: 'Phase 3 · 수학/기구학/CAD',
    title: '2축 평면 로봇 팔 기구학 (FK / IK)',
    shortTitle: 'D21 · 2축 로봇 팔',
    subtitle: '순기구학 · 역기구학 · 작업공간 환형 경계 · 특이점',
    badge: '기구학 모델',
    milestoneTag: 'Day 21~22 3D 기구학 랩',
    failFirstHook:
      '팔 길이(L1+L2)보다 먼 목표 좌표를 입력했는데 |D| > 1 예외처리를 빼먹으면 sqrt(음수) 때문에 NaN이 발생해 서보가 한계 각도까지 꺾이며 기어가 부서집니다.',
    beginnerAnalogy:
      '순기구학(FK)은 "어깨 30도, 팔꿈치 45도 구부렸을 때 손끝이 어디 있지?"를 구하는 문제이고, 역기구학(IK)은 반대로 "책상 위 물컵(x, y)을 잡으려면 어깨와 팔꿈치를 몇 도로 구부려야 하지?"를 거꾸로 푸는 문제입니다.',
    overviewSummary:
      '2자유도 평면 회전 관절(Planar 2R) 로봇 팔은 관절 각도(θ₁, θ₂)에서 끝점 좌표(x, y)를 구하는 순기구학(FK)과, 목표 좌표에서 각도를 역산하는 역기구학(IK)의 핵심 원리를 보여줍니다.',
    guidedMissions: [
      {
        id: 'kin-theta',
        title: '관절 각도(θ₁, θ₂) 슬라이더를 움직여 끝점 좌표 (x, y) 변화 확인하기',
        hint: '직접 실습 탭에서 θ₁ 또는 θ₂ 슬라이더를 드래그해 3D 팔을 움직여 보세요.',
      },
      {
        id: 'kin-link',
        title: '링크 길이를 L₁ ≠ L₂로 바꿔 작업공간 중앙의 주황색 비도달 구멍 보기',
        hint: 'L₁과 L₂ 길이를 다르게 설정하면 바닥 원에 내부 도넛 홀(|L₁−L₂|)이 나타납니다.',
      },
      {
        id: 'kin-code',
        title: '코드 랩에서 역기구학 도달 불가 예외처리 버그 수정하기',
        hint: '코드 랩 탭 하단의 미니 코드 디버깅 챌린지를 풀어보세요.',
      },
    ],
    highlights: [
      {
        title: 'Elbow-up (Lefty) vs Elbow-down (Righty)',
        body: '동일한 목표 좌표 (x, y)에 대해 θ₂의 부호(+/-)에 따라 팔꿈치가 위로 솟는 형상(θ₂ > 0)과 아래로 향하는 형상(θ₂ < 0) 두 가지 해가 존재합니다.',
        tone: 'cyan',
      },
      {
        title: '도달 불가(Unreachable) 조건 |D| > 1',
        body: '원점과의 거리 r이 최대 반경 L₁+L₂를 넘거나(D > 1), 두 링크 길이가 다를 때 내부 홀 |L₁−L₂| 안쪽으로 들어가면(D < −1) 실수해가 존재하지 않습니다.',
        tone: 'rose',
      },
      {
        title: '기구학적 특이점 (Singularity)',
        body: '팔을 완전히 편 상태(D = 1, θ₂ = 0)나 완전히 접은 상태(D = −1, θ₂ = π)에서는 야코비안 행렬식이 0이 되어 반경 방향 순간 이동 자유도를 잃습니다.',
        tone: 'amber',
      },
    ],
    formulas: [
      {
        title: '순기구학 (Forward Kinematics, FK)',
        latex: String.raw`x = L_1 \cos\theta_1 + L_2 \cos(\theta_1 + \theta_2), \quad y = L_1 \sin\theta_1 + L_2 \sin(\theta_1 + \theta_2)`,
        description: '링크 2의 절대 각도는 θ₁ + θ₂ 입니다.',
      },
      {
        title: '역기구학 (Inverse Kinematics, IK) — 제2코사인 법칙',
        latex: String.raw`D = \cos\theta_2 = \frac{x^2 + y^2 - L_1^2 - L_2^2}{2 L_1 L_2}`,
        description: '|D| ≤ 1 일 때만 도달 가능한 실수해가 존재합니다.',
      },
      {
        title: '관절각 θ₂ 및 θ₁ 해석적 해',
        latex: String.raw`\theta_2 = \operatorname{atan2}\left(\pm\sqrt{1 - D^2},\; D\right), \quad \theta_1 = \operatorname{atan2}(y, x) - \operatorname{atan2}(L_2 \sin\theta_2,\; L_1 + L_2 \cos\theta_2)`,
        description: 'atan2 함수로 전 사분면의 각도 부호를 정확히 보존합니다.',
      },
    ],
    specs: [
      { label: '외부 작업반경', value: 'L₁ + L₂', note: '최대 도달 거리 (D = 1)', tone: 'cyan' },
      { label: '내부 비도달 반경', value: '|L₁ - L₂|', note: 'L₁ = L₂일 때만 원점 도달', tone: 'amber' },
      { label: '이중 해 형상', value: 'Lefty / Righty', note: 'θ₂ 부호(+/-) 선택', tone: 'emerald' },
      { label: '특이점 조건', value: 'θ₂ = 0 또는 π', note: 'det(J) = 0 경계 상태', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '관절 1 서보 (Base θ₁)',
        pin: 'GPIO 13 (LEDC CH0)',
        detail: '50Hz PWM 제어선 + 별도 5~6V 외부 전원 연결 (GND 공통)',
      },
      {
        signal: '관절 2 서보 (Elbow θ₂)',
        pin: 'GPIO 27 (LEDC CH1)',
        detail: '상대 각도 θ₂ 지령 인가, ESP32 3V3 핀 전원 직결 금지',
        warning: '팔 길이가 길어질수록 베이스 서보 요구 토크가 급증하므로 외부 전원 필수',
      },
    ],
    codeTitle: 'planar_2r_kinematics.ts',
    codeLanguage: 'typescript',
    codeSnippet: `export interface IKResult {
  reachable: boolean;
  theta1Rad: number;
  theta2Rad: number;
  D: number;
  singularity: boolean;
}

export function solve2LinkIK(
  x: number,
  y: number,
  L1: number,
  L2: number,
  elbowUp = true
): IKResult {
  const r2 = x * x + y * y;
  const D = (r2 - L1 * L1 - L2 * L2) / (2 * L1 * L2);

  if (Math.abs(D) > 1) {
    return { reachable: false, theta1Rad: 0, theta2Rad: 0, D, singularity: false };
  }

  const sinTheta2 = (elbowUp ? 1 : -1) * Math.sqrt(Math.max(0, 1 - D * D));
  const theta2Rad = Math.atan2(sinTheta2, D);
  const theta1Rad =
    Math.atan2(y, x) - Math.atan2(L2 * Math.sin(theta2Rad), L1 + L2 * Math.cos(theta2Rad));

  return {
    reachable: true,
    theta1Rad,
    theta2Rad,
    D,
    singularity: Math.abs(Math.abs(D) - 1) < 1e-3,
  };
}`,
    codeChallenge: {
      prompt: '목표 좌표가 작업공간 밖일 때 NaN 크래시를 막으려면 D 값의 어떤 조건을 먼저 검사해야 할까요?',
      buggyLine: 'if (D === 0) { return { reachable: false, ... }; } // 잘못된 조건!',
      options: [
        'if (Math.abs(D) > 1) { return { reachable: false, ... }; }',
        'if (D < 0) { return { reachable: false, ... }; }',
        'if (L1 === L2) { return { reachable: false, ... }; }',
      ],
      correctIndex: 0,
      explanation:
        'D = cos(θ₂)이므로 실수 각도가 존재하려면 반드시 -1 ≤ D ≤ 1 이어야 합니다. 따라서 Math.abs(D) > 1이면 도달 불가(Unreachable)로 즉시 반환해야 안전합니다.',
    },
    quizzes: [
      {
        id: 'Q2-1',
        question:
          '링크 길이가 각각 L₁, L₂인 평면 2R 로봇 팔의 순기구학(FK) 좌표 (x, y) 표현식으로 올바른 것은?',
        options: [
          'x = L₁ cosθ₁ + L₂ sinθ₂,  y = L₁ sinθ₁ + L₂ cosθ₂',
          'x = L₁ cosθ₁ + L₂ cos(θ₁ + θ₂),  y = L₁ sinθ₁ + L₂ sin(θ₁ + θ₂)',
          'x = (L₁ + L₂)cos(θ₁ + θ₂),  y = (L₁ + L₂)sin(θ₁ + θ₂)',
          'x = L₁ cosθ₁ - L₂ sin(θ₁ + θ₂),  y = L₁ sinθ₁ + L₂ cos(θ₁ + θ₂)',
        ],
        correctIndex: 1,
        explanation:
          '링크 2의 지면 대비 절대 방위각은 관절각의 합인 θ₁ + θ₂이므로 순기구학 방정식은 x = L₁ cosθ₁ + L₂ cos(θ₁ + θ₂), y = L₁ sinθ₁ + L₂ sin(θ₁ + θ₂)입니다.',
      },
      {
        id: 'Q2-2',
        question:
          '역기구학 유도 시 제2코사인 법칙으로부터 도출되는 중간 계수 D = cosθ₂의 정의식은?',
        options: [
          'D = (x² + y² - L₁² - L₂²) / (2 L₁ L₂)',
          'D = (L₁² + L₂² - x² - y²) / (2 L₁ L₂)',
          'D = (x² + y² + L₁² + L₂²) / (L₁ L₂)',
          'D = √(x² + y²) / (L₁ + L₂)',
        ],
        correctIndex: 0,
        explanation:
          '삼각형 기하학에서 r² = x² + y² = L₁² + L₂² + 2L₁L₂cosθ₂가 성립하므로 D = (x² + y² - L₁² - L₂²) / (2L₁L₂)입니다.',
      },
      {
        id: 'Q2-3',
        question:
          'L₁ = 4m, L₂ = 1m인 평면 2축 로봇 팔의 도달 가능한 작업공간(Workspace) 영역은?',
        options: [
          '원점 기준 반지름 r ≤ 5m인 원 전체 영역',
          '3m ≤ √(x² + y²) ≤ 5m 범위의 환형 도넛 영역',
          '1m ≤ √(x² + y²) ≤ 4m 범위의 영역',
          '0m ≤ √(x² + y²) ≤ 3m 범위의 영역',
        ],
        correctIndex: 1,
        explanation:
          '작업공간의 내부 반경은 |L₁ - L₂| = 3m, 외부 반경은 L₁ + L₂ = 5m이므로 두 반경 사이의 환형 영역이 됩니다.',
      },
      {
        id: 'Q2-4',
        question:
          '역기구학 해에서 제2관절각 θ₂의 부호(+ 및 -)에 따라 결정되는 두 가지 로봇 팔 형상은?',
        options: [
          'Forward 형상 및 Reverse 형상',
          'Lefty (Elbow-up) 형상 및 Righty (Elbow-down) 형상',
          'Yaw 자세 및 Pitch 자세',
          '홀로노믹(Holonomic) 및 논홀로노믹(Nonholonomic) 자세',
        ],
        correctIndex: 1,
        explanation:
          'θ₂ > 0은 팔꿈치가 위로 꺾이는 Elbow-up(Lefty), θ₂ < 0은 아래로 꺾이는 Elbow-down(Righty) 형상에 해당합니다.',
      },
      {
        id: 'Q2-5',
        question:
          '2축 평면 로봇 팔의 역기구학에서 목표 지점이 도달 불가능(Unreachable)하여 실수해가 존재하지 않는 수학적 조건은?',
        options: ['|D| ≤ 1', '|D| > 1', 'D = 0', 'θ₁ + θ₂ = 0'],
        correctIndex: 1,
        explanation:
          'θ₂ = atan2(±√(1 - D²), D)에서 |D| > 1이 되면 근호 내부가 음수가 되어 실수 영역에서 역기구학 해를 구할 수 없습니다.',
      },
    ],
  },
  {
    id: 'ultrasonic',
    order: 3,
    dayLabel: 'Day 26',
    phaseLabel: 'Phase 4 · 센서/PID/필터',
    title: 'HC-SR04 초음파 ToF 거리 계측',
    shortTitle: 'D26 · 초음파 센서',
    subtitle: '40kHz 펄스 시퀀스 · 왕복 시간 거리식 · 3.3V 분압 보호',
    badge: '센서 인터페이스',
    milestoneTag: 'Day 26 초음파 3D 레이더',
    failFirstHook:
      '5V로 동작하는 HC-SR04의 ECHO 선을 저항 분배기 없이 3.3V ESP32 핀에 바로 꽂으면 핀이 손상될 수 있고, 측정 주기를 60ms보다 짧게 잡으면 메아리(잔향) 때문에 거리가 미친 듯이 튑니다.',
    beginnerAnalogy:
      '절벽 앞에서 "야호!" 외치고 메아리가 되돌아올 때까지 스톱워치를 재는 원리입니다. 소리가 벽까지 갔다가 돌아온 왕복 시간이므로 거리를 구할 때는 꼭 절반(÷2)을 나눠야 합니다.',
    overviewSummary:
      'HC-SR04는 40kHz 초음파 버스트 8주기를 송출하고 반사파의 왕복 시간(ToF)을 측정해 2cm~400cm 거리를 계산합니다. 5V 구동 센서이므로 ESP32의 3.3V GPIO 보호를 위한 전압 분배가 핵심입니다.',
    guidedMissions: [
      {
        id: 'us-dist',
        title: '장애물 거리 슬라이더로 ECHO 펄스(μs) 변화 관찰하기',
        hint: '직접 실습 탭에서 장애물 거리를 2~350cm 사이로 움직여 보세요.',
      },
      {
        id: 'us-timeout',
        title: '거리를 395cm 이상으로 올려 38ms 타임아웃 상태 만들기',
        hint: '최대 측정 범위(400cm) 근처에서 반사파가 없을 때 타임아웃 배지를 확인하세요.',
      },
      {
        id: 'us-sweep',
        title: '서보 스캔 각도를 돌려 15° 초음파 빔 회전시키기',
        hint: '서보 스캔 각도 슬라이더(-60°~+60°)를 좌우로 돌려 레이더처럼 탐지하세요.',
      },
    ],
    highlights: [
      {
        title: '계측 시퀀스: 10μs TRIG → 60ms 주기',
        body: 'TRIG에 최소 10μs HIGH 펄스를 주면 40kHz 버스트 8주기가 발사됩니다. 잔향 간섭을 막기 위해 최소 60ms 이상의 측정 주기를 지켜야 합니다.',
        tone: 'cyan',
      },
      {
        title: '5V ECHO → ESP32 3.3V 전압 분배 필수',
        body: 'HC-SR04는 5V 로직을 출력하므로, ECHO와 ESP32 입력 핀 사이에 10kΩ + 20kΩ 저항 분배기(또는 레벨 시프터)를 연결해 3.3V 이하로 감압해야 합니다.',
        tone: 'rose',
      },
      {
        title: '무반사 타임아웃 (~38ms)',
        body: '장애물이 없거나 400cm를 벗어나면 ECHO 핀은 약 38ms 길이의 타임아웃 펄스를 출력한 뒤 LOW로 복귀합니다.',
        tone: 'amber',
      },
    ],
    formulas: [
      {
        title: '왕복 비행 시간(ToF) 거리 계산식',
        latex: String.raw`\text{Distance} = \frac{t \times v}{2}, \quad v \approx 340\text{ m/s} = 0.034\text{ cm/}\mu\text{s}`,
        description: 'ECHO HIGH 지속 시간 t는 왕복 시간이므로 2로 나눕니다.',
      },
      {
        title: '마이크로초(μs) → cm / inch 환산 근사식',
        latex: String.raw`\text{Distance (cm)} = \frac{t\;[\mu\text{s}]}{58.82} \approx \frac{t\;[\mu\text{s}]}{58}, \quad \text{Distance (inch)} = \frac{t\;[\mu\text{s}]}{148}`,
        description: '0.017 cm/μs를 곱하는 형태와 동일합니다.',
      },
    ],
    specs: [
      { label: '공급 전압 / 전류', value: 'DC 5.0V · 15mA', note: 'ECHO 출력 5V 주의', tone: 'rose' },
      { label: '유효 측정 거리', value: '2 ~ 400 cm', note: '분해능 0.3 cm (3mm)', tone: 'cyan' },
      { label: '동작 주파수 / 지향각', value: '40 kHz · < 15°', note: '원뿔형 빔 패턴', tone: 'emerald' },
      { label: '권장 주기 / 타임아웃', value: '≥ 60 ms / 38 ms', note: '잔향 간섭 방지', tone: 'amber' },
    ],
    wiringNotes: [
      {
        signal: 'VCC / GND',
        pin: 'VIN (5V) · GND',
        detail: 'HC-SR04는 5.0V 정격 구동 센서입니다.',
      },
      {
        signal: 'TRIG (ESP32 → 센서)',
        pin: 'GPIO 18 (출력 안전 핀)',
        detail: 'ESP32의 3.3V HIGH 신호로도 HC-SR04 트리거(TTL) 인식이 가능합니다.',
      },
      {
        signal: 'ECHO (센서 → ESP32)',
        pin: 'GPIO 19 (10kΩ + 20kΩ 분배 경유)',
        detail: '센서 5V 출력을 3.3V로 강압해 ESP32 게이트 산화막 손상을 방지합니다.',
        warning: 'ECHO를 ESP32 GPIO에 직결하면 과전압 손상 위험!',
      },
    ],
    codeTitle: 'esp32_hcsr04_radar.ino',
    codeLanguage: 'cpp',
    codeSnippet: `const int TRIG_PIN = 18;
const int ECHO_PIN = 19; // 반드시 10kΩ / 20kΩ 저항 분배기 경유 (5V -> 3.3V)

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10); // 최소 10μs HIGH 트리거 펄스
  digitalWrite(TRIG_PIN, LOW);

  // 최대 38ms 타임아웃 대응 (40,000μs)
  long durationUs = pulseIn(ECHO_PIN, HIGH, 40000);
  float distanceCm = durationUs > 0 ? durationUs / 58.0 : -1.0;

  Serial.printf("Echo: %ld us | Distance: %.1f cm\\n", durationUs, distanceCm);
  delay(65); // 잔향 간섭 방지를 위해 최소 60ms 이상 주기 유지
}`,
    codeChallenge: {
      prompt: '초음파 거리 값이 계속 잔향 때문에 요동치고 있습니다. loop() 마지막의 대기 시간을 데이터시트 권장 주기에 맞게 고쳐보세요!',
      buggyLine: 'delay(5); // 5ms마다 발사하면 이전 메아리와 충돌!',
      options: [
        'delay(65); // 최소 60ms 이상 측정 주기 유지',
        'delayMicroseconds(10); // 더 빠르게 발사',
        'delay(0); // 대기 없이 즉시 발사',
      ],
      correctIndex: 0,
      explanation:
        '이전 초음파 펄스의 벽 반사 잔향이 사라진 뒤 다음 측정을 시작하려면 최소 60ms 이상(예: 65ms) 간격을 두어야 합니다.',
    },
    quizzes: [
      {
        id: 'Q3-1',
        question:
          'HC-SR04 센서가 40kHz 초음파 펄스를 송출하도록 시작 신호를 주기 위해 TRIG 핀에 인가해야 하는 펄스는?',
        options: [
          '최소 10μs 지속 시간의 HIGH TTL 펄스',
          '최소 10ms 지속 시간의 LOW TTL 펄스',
          '1kHz 연속 사각파 신호',
          '아날로그 5V 직류 정전압',
        ],
        correctIndex: 0,
        explanation:
          'TRIG 핀에 최소 10μs 이상의 HIGH 펄스를 공급해야 센서 내부 로직이 8주기 40kHz 초음파 방출을 개시합니다.',
      },
      {
        id: 'Q3-2',
        question:
          'HC-SR04의 ECHO 핀이 HIGH를 유지한 지속 시간이 1160μs로 측정되었을 때, 장애물과의 편도 거리는 약 얼마인가?',
        options: ['10cm', '20cm', '40cm', '116cm'],
        correctIndex: 1,
        explanation:
          '센티미터 단위 거리 계산 공식 Distance = t[μs] / 58에 대입하면 1160 / 58 = 20 cm가 산출됩니다.',
      },
      {
        id: 'Q3-3',
        question: 'HC-SR04 초음파 모듈의 기술 사양에 대한 설명으로 올바르지 않은 것은?',
        options: [
          '동작 전압 규격은 DC 5V이다.',
          '유효 계측 거리 범위는 2cm ~ 400cm이다.',
          '센서 음파 방출의 유효 지향 각도는 15도 미만이다.',
          '연속 측정 시 권장 주기는 잔향 간섭 방지를 위해 1ms 이하이다.',
        ],
        correctIndex: 3,
        explanation:
          '초음파 잔향으로 인한 오측정을 방지하기 위해 연속 측정 시 권장 주기는 60ms 이상이어야 합니다.',
      },
      {
        id: 'Q3-4',
        question:
          '5V로 구동되는 HC-SR04 모듈을 3.3V 정격의 ESP32 GPIO 핀에 결선할 때 하드웨어 보호를 위해 취해야 할 올바른 조치는?',
        options: [
          'TRIG 라인에 강압 회로를 추가한다.',
          'ECHO 라인에 저항 분배기나 로직 레벨 시프터를 장착하여 3.3V 이하로 감압한다.',
          'VCC 공급 라인에 전류 제한 저항을 직렬로 연결한다.',
          'GND 라인에 역전류 방지 다이오드를 삽입한다.',
        ],
        correctIndex: 1,
        explanation:
          'ECHO 신호는 5V 로직 레벨로 출력되므로 ESP32 GPIO 핀 손상을 방지하기 위해 전압 분배 회로나 레벨 시프터를 반드시 거쳐야 합니다.',
      },
      {
        id: 'Q3-5',
        question:
          '물체가 초음파 센서의 최대 측정 거리를 벗어나 반사파가 수신되지 않을 때 HC-SR04가 생성하는 에코 신호의 특징은?',
        options: [
          '영구적인 LOW 상태를 유지한다.',
          '영구적인 HIGH 상태를 유지하여 인터럽트를 점유한다.',
          '약 38ms 길이의 타임아웃 펄스를 출력한 후 LOW로 복귀한다.',
          '1초 동안 40kHz 발진 신호를 출력한다.',
        ],
        correctIndex: 2,
        explanation:
          '초음파 반사 신호가 들어오지 않을 경우 센서는 약 38ms의 타임아웃 펄스를 방출하고 LOW 레벨로 복귀합니다.',
      },
    ],
  },
  {
    id: 'pid',
    order: 4,
    dayLabel: 'Day 30~31',
    phaseLabel: 'Phase 4 · 센서/PID/필터',
    title: '이산 시간 디지털 PID 제어 알고리즘',
    shortTitle: 'D30 · 디지털 PID',
    subtitle: '위치형/증분형 이산화 · 안티 와인드업 · 미분항 LPF 필터',
    badge: '폐루프 제어',
    milestoneTag: 'Day 30~31 3D PID 서보 벤치',
    failFirstHook:
      '단순 비례(Kp) 게인만 너무 높이 올리면 모터가 목표 각도를 뚫고 지나쳐 좌우로 미친 듯이 흔들리고, 적분(I) 클램핑이 없으면 손으로 막았다 놓을 때 반대편으로 폭주합니다.',
    beginnerAnalogy:
      '자동차 주차로 비유하면: P는 목표까지 밟는 액셀 세기(스프링), I는 살짝 모자란 거리를 끝까지 밀어주는 끈기, D는 주차선 앞에서 스르륵 브레이크를 밟아 들이받지 않게 막는 댐퍼입니다.',
    overviewSummary:
      '마이크로컨트롤러는 샘플링 주기 Δt마다 오차 e[k]를 계산해 제어 입력을 갱신합니다. Kp·Ki·Kd의 물리적 역할뿐 아니라 포화 시 적분 누적(와인드업)과 미분 노이즈 증폭을 막는 실무 기법이 중요합니다.',
    guidedMissions: [
      {
        id: 'pid-setpoint',
        title: '목표 각도(Setpoint)를 바꿔 3D 로터가 주황 목표선을 쫓아가는 모습 보기',
        hint: '직접 실습 탭에서 목표 각도 슬라이더를 -90° 또는 +110°로 움직여 보세요.',
      },
      {
        id: 'pid-kp',
        title: '비례 게인(Kp)을 9.0 이상으로 높여 오버슈트·진동 체험하기',
        hint: 'Kp를 높이고 Kd를 낮추면 목표선 주변을 넘나들며 출렁이는 현상이 보입니다.',
      },
      {
        id: 'pid-kd',
        title: '미분 게인(Kd)을 올려 브레이크(감쇠)로 진동 잡기',
        hint: 'Kd를 0.8 이상으로 올린 뒤 목표 각도를 바꾸면 매끄럽게 멈추는 것을 확인하세요.',
      },
    ],
    highlights: [
      {
        title: 'P · I · D 세 항의 물리적 역할',
        body: 'P는 현재 오차에 비례하는 가상 스프링 복원력, I는 누적 오차로 정상 상태 오차(Steady-State Error) 제거, D는 변화율을 감쇠(Damping)해 오버슈트를 억제합니다.',
        tone: 'cyan',
      },
      {
        title: '안티 와인드업 (Anti-Windup)',
        body: '구동기가 최대 토크/전압에 포화(Saturation)된 상태에서 오차가 계속 적분되면 목표 도달 후에도 역방향으로 복귀하지 못합니다. 적분항 상·하한 클램핑으로 방지합니다.',
        tone: 'amber',
      },
      {
        title: '미분 노이즈 증폭 & LPF 필터링',
        body: '센서 양자화 노이즈는 1/Δt로 나뉘며 크게 증폭되어 모터 진동·발열을 부릅니다. 미분 경로에 1차 저역통과 필터(LPF)를 적용하거나 측정값 미분(-dθ/dt)을 사용합니다.',
        tone: 'rose',
      },
    ],
    formulas: [
      {
        title: '위치형(Positional) 이산 시간 PID 제어 출력',
        latex: String.raw`u[k] = K_p e[k] + K_i \sum_{j=0}^{k} e[j]\Delta t + K_d \frac{e[k] - e[k-1]}{\Delta t}`,
        description: '적분항은 Euler 전진 합, 미분항은 후향 유한 차분으로 근사합니다.',
      },
      {
        title: '증분형(Velocity / Incremental) PID 업데이트',
        latex: String.raw`\Delta u[k] = K_p \left(e[k] - e[k-1]\right) + K_i e[k]\Delta t + K_d \frac{e[k] - 2e[k-1] + e[k-2]}{\Delta t}`,
        description: 'u[k] = u[k-1] + Δu[k] 로 갱신되어 모드 전환 시 충격이 적습니다.',
      },
    ],
    specs: [
      { label: '비례 게인 (Kp)', value: '가상 스프링', note: '과도 시 위상 지연 발산', tone: 'cyan' },
      { label: '적분 게인 (Ki)', value: '정상 오차 제거', note: 'Anti-Windup 클램핑 필수', tone: 'amber' },
      { label: '미분 게인 (Kd)', value: '감쇠 (Damping)', note: '고주파 노이즈 LPF 필수', tone: 'emerald' },
      { label: '샘플링 주기 (Δt)', value: '일정 주기 유지', note: '타이머/태스크 고정 권장', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '모터 엔코더 / 위치 피드백',
        pin: 'GPIO 32, 33 (인터럽트 안전 핀)',
        detail: '양방향 직교(Quadrature) A/B 펄스를 일정 Δt 주기로 샘플링',
      },
      {
        signal: 'PWM 구동기 출력',
        pin: 'GPIO 13 (LEDC) → 모터 드라이버',
        detail: '계산된 제어량 u[k]를 듀티 사이클로 매핑하되 포화 시 적분 클램핑 적용',
        warning: '부팅 글리치가 있는 핀(GPIO 0,1,3,5,14,15)은 모터 Enable에 연결 금지',
      },
    ],
    codeTitle: 'discrete_pid_controller.ts',
    codeLanguage: 'typescript',
    codeSnippet: `export class DiscretePID {
  private eInt = 0;
  private prevError = 0;
  private dFiltered = 0;

  step(
    setpoint: number,
    measured: number,
    dt: number,
    kp: number,
    ki: number,
    kd: number,
    uMax = 100
  ): number {
    const error = setpoint - measured;

    // 1) 비례항
    const pTerm = kp * error;

    // 2) 적분항 + Anti-Windup 클램핑
    this.eInt = Math.max(-uMax, Math.min(uMax, this.eInt + error * dt));
    const iTerm = ki * this.eInt;

    // 3) 미분항 + 1차 저역통과 필터 (LPF)
    const rawD = (error - this.prevError) / dt;
    this.dFiltered = 0.7 * this.dFiltered + 0.3 * rawD;
    const dTerm = kd * this.dFiltered;

    this.prevError = error;
    return Math.max(-uMax, Math.min(uMax, pTerm + iTerm + dTerm));
  }
}`,
    codeChallenge: {
      prompt: '로봇 팔이 장애물에 걸려 멈춘 동안 적분항(eInt)이 끝없이 커지는 와인드업(Windup)을 막으려면 어떻게 업데이트해야 할까요?',
      buggyLine: 'this.eInt = this.eInt + error / dt; // dt를 나누고 클램핑도 없음!',
      options: [
        'this.eInt = Math.max(-uMax, Math.min(uMax, this.eInt + error * dt));',
        'this.eInt = error * dt; // 이전 적분을 매번 버림',
        'this.eInt = this.eInt + (error - this.prevError) * dt;',
      ],
      correctIndex: 0,
      explanation:
        '적분은 오차 면적(error * dt)을 누적해야 하며, 구동기 포화 시 폭주를 막기 위해 반드시 [-uMax, +uMax] 범위로 클램핑(Anti-Windup)해야 합니다.',
    },
    quizzes: [
      {
        id: 'Q4-1',
        question:
          'PID 제어기에서 각 성분이 제어 루프에서 수행하는 물리적 역할에 대한 기술로 가장 정확한 것은?',
        options: [
          'P는 정상 상태 오차 제거, I는 오차 감쇠, D는 비례 반발력 제공',
          'P는 현재 오차 비례 복원, I는 오차 누적을 통한 정상 상태 오차 제거, D는 오차 변화율 감쇠를 통한 오버슈트 억제',
          'P는 고주파 노이즈 필터링, I는 외란 감지, D는 샘플링 주기 보정',
          'P는 위상 지연 보상, I는 위상 진퇴 보상, D는 직류 이득 증가',
        ],
        correctIndex: 1,
        explanation:
          '비례(P)는 현재 오차에 즉각 비례하는 힘을 가하고, 적분(I)은 과거 누적 오차를 제거하며, 미분(D)은 오차 변화 속도를 억제하여 댐퍼 역할을 수행합니다.',
      },
      {
        id: 'Q4-2',
        question:
          '샘플링 주기 Δt를 갖는 위치형 이산 시간 PID 제어기에서 적분항 I[k]의 올바른 업데이트 수식은?',
        options: [
          'I[k] = I[k-1] + Ki · (e[k] / Δt)',
          'I[k] = I[k-1] + Ki · e[k] · Δt',
          'I[k] = Ki · (e[k] - e[k-1]) · Δt',
          'I[k] = I[k-1] + Ki · (e[k] - e[k-1])',
        ],
        correctIndex: 1,
        explanation:
          '수치 적분에서 누적 오차에 샘플링 면적 e[k]·Δt가 더해지므로 I[k] = I[k-1] + Ki · e[k] · Δt가 됩니다.',
      },
      {
        id: 'Q4-3',
        question:
          '마이크로컨트롤러에서 후향 차분을 통해 미분항 D[k] = Kd·(e[k] - e[k-1])/Δt을 계산할 때 발생하는 실무적 문제점과 대응책은?',
        options: [
          '정상 상태 오차가 점진적으로 누적되므로 적분 게인을 0으로 만든다.',
          '센서 신호의 고주파 노이즈가 급격히 증폭되므로 미분 경로에 저역통과 필터(LPF)를 적용한다.',
          '액추에이터의 응답 지연이 발생하므로 샘플링 주기를 크게 늘린다.',
          '시스템의 비례 이득이 급감하므로 피드포워드 게인을 무한대로 키운다.',
        ],
        correctIndex: 1,
        explanation:
          '유한 차분 연산은 작은 고주파 센서 노이즈를 미분하여 크게 증폭시키므로 1차 저역통과 필터링이나 측정값 미분 방식을 채택합니다.',
      },
      {
        id: 'Q4-4',
        question:
          '액추에이터 출력이 물리적 한계치(포화)에 도달했음에도 오차가 해소되지 않아 적분값이 과도하게 누적되어 발생하는 현상과 방지 기법은?',
        options: [
          '채터링(Chattering) 현상 - 데드밴드(Deadband) 설정',
          '와인드업(Windup) 현상 - 안티 와인드업(Anti-windup) 누적 제한',
          '공진(Resonance) 현상 - 노치 필터(Notch filter)',
          '에일리어싱(Aliasing) 현상 - 섀넌 샘플링 복원',
        ],
        correctIndex: 1,
        explanation:
          '구동기 포화 상태에서 적분기가 통제 불능으로 누적되는 현상을 와인드업이라고 하며, 적분 변수의 상·하한을 제한하는 안티 와인드업 기법으로 해결합니다.',
      },
      {
        id: 'Q4-5',
        question:
          '이산 시간 디지털 제어 루프에서 비례 게인 Kp만을 과도하게 높게 설정할 때 나타나는 주요 시스템 거동은?',
        options: [
          '정상 상태 오차가 0에 도달하지 못하고 선형적으로 증가한다.',
          '유한한 샘플링 주기로 인한 위상 지연으로 과도한 오버슈트 및 시스템 발산(진동 불안정성)이 초래된다.',
          '시스템의 위상 여유가 무한대로 증가하여 지나치게 둔감해진다.',
          '모터 엔코더 펄스의 분해능이 물리적으로 감소한다.',
        ],
        correctIndex: 1,
        explanation:
          '디지털 제어기는 샘플링 주기 단위로 지연이 존재하므로 비례 게인이 과도하게 높으면 제어력이 오차를 지나쳐 오버슈트와 고주파 진동 및 발산을 초래합니다.',
      },
    ],
  },
];

export const LAB_MODULES: LabModule[] = [
  BASE_LAB_MODULES[0],
  ...PHASE1_EXTRA_MODULES,
  PHASE2_MODULES[0], // day08_board
  BASE_LAB_MODULES[1], // esp32 (Day 09)
  ...PHASE2_MODULES.slice(1), // day10 .. day16
  ...PHASE3_MODULES.slice(0, 4), // day17 .. day20
  BASE_LAB_MODULES[2], // kinematics (D21~D22)
  ...PHASE3_MODULES.slice(4), // day23 .. day25
  BASE_LAB_MODULES[3], // ultrasonic (D26)
  ...PHASE4_MODULES.slice(0, 3), // day27 .. day29
  BASE_LAB_MODULES[4], // pid (D30)
  ...PHASE4_MODULES.slice(3), // day31 .. day34
  ...PHASE5_MODULES, // day35 .. day42
  ...PHASE6_MODULES, // day43 .. day45
];
