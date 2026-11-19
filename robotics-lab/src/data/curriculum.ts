import { LabModule } from '../types/lab';

export const LAB_MODULES: LabModule[] = [
  {
    id: 'esp32',
    order: 1,
    title: 'ESP32 아키텍처 & GPIO 핀 제약',
    shortTitle: '1. ESP32 핀맵',
    subtitle: '안전 핀 · 입력 전용(GPI) · 스트래핑 핀 · SPI Flash 금지 핀',
    badge: '하드웨어 기초',
    milestoneTag: 'M1 인터랙티브 보드',
    overviewSummary:
      'ESP32(ESP-WROOM-32 기준)는 강력한 듀얼 코어 MCU지만, 부팅 스트래핑과 내장 SPI 플래시, 출력 드라이버 유무, Wi-Fi-ADC2 리소스 공유 같은 물리적 제약이 존재합니다. 3D 보드의 각 핀을 탭해 안전 등급과 전기적 한계를 확인하세요.',
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
    title: '2축 평면 로봇 팔 기구학 (FK / IK)',
    shortTitle: '2. 2축 로봇 팔',
    subtitle: '순기구학 · 역기구학 · 작업공간 환형 경계 · 특이점',
    badge: '기구학 모델',
    milestoneTag: 'M1 프리뷰 리그 (M3 확장)',
    overviewSummary:
      '2자유도 평면 회전 관절(Planar 2R) 로봇 팔은 관절 각도(θ₁, θ₂)에서 끝점 좌표(x, y)를 구하는 순기구학(FK)과, 목표 좌표에서 각도를 역산하는 역기구학(IK)의 핵심 원리를 보여줍니다.',
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
    title: 'HC-SR04 초음파 ToF 거리 계측',
    shortTitle: '3. 초음파 센서',
    subtitle: '40kHz 펄스 시퀀스 · 왕복 시간 거리식 · 3.3V 분압 보호',
    badge: '센서 인터페이스',
    milestoneTag: 'M1 프리뷰 리그 (M3 확장)',
    overviewSummary:
      'HC-SR04는 40kHz 초음파 버스트 8주기를 송출하고 반사파의 왕복 시간(ToF)을 측정해 2cm~400cm 거리를 계산합니다. 5V 구동 센서이므로 ESP32의 3.3V GPIO 보호를 위한 전압 분배가 핵심입니다.',
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
    title: '이산 시간 디지털 PID 제어 알고리즘',
    shortTitle: '4. 디지털 PID',
    subtitle: '위치형/증분형 이산화 · 안티 와인드업 · 미분항 LPF 필터',
    badge: '폐루프 제어',
    milestoneTag: 'M1 프리뷰 리그 (M3 확장)',
    overviewSummary:
      '마이크로컨트롤러는 샘플링 주기 Δt마다 오차 e[k]를 계산해 제어 입력을 갱신합니다. Kp·Ki·Kd의 물리적 역할뿐 아니라 포화 시 적분 누적(와인드업)과 미분 노이즈 증폭을 막는 실무 기법이 중요합니다.',
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
