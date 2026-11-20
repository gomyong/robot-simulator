import {
  CurriculumDay,
  CurriculumPhase,
  SkillDomainCoverage,
} from '../types/lab';

export const PHASE_LIST: CurriculumPhase[] = [
  {
    id: 'phase1',
    order: 1,
    title: 'Phase 1. 보드와 친해지기: 전기·전자 & 메이커 기초',
    shortTitle: '1단계 · 전기/보드 기초',
    dayRange: 'Day 01 ~ 07',
    goal: '멀티미터, 브레드보드, 배터리, 3.3V/5V 구분을 몸으로 익혀 실제 기판을 태우지 않고 안전하게 연결할 수 있습니다.',
    accent: 'sky',
    miniProjectTitle: 'Day 07 미니 프로젝트: 가상 브레드보드 스마트 위험 감지기',
  },
  {
    id: 'phase2',
    order: 2,
    title: 'Phase 2. 로봇의 두뇌와 근육: ESP32 · 임베디드 C/C++ · 모터 구동',
    shortTitle: '2단계 · ESP32/모터',
    dayRange: 'Day 08 ~ 16',
    goal: 'ESP32 핀맵과 논블로킹 펌웨어(FSM), UART/I2C/SPI 통신, H-브리지 모터 드라이버와 전원 분리로 무선 RC 봇을 구현합니다.',
    accent: 'emerald',
    miniProjectTitle: 'Day 16 미니 프로젝트: 브라운아웃 없는 ESP32 무선 RC 로버',
  },
  {
    id: 'phase3',
    order: 3,
    title: 'Phase 3. 로보틱스 수학, 3D 기구학 & 기계 설계',
    shortTitle: '3단계 · 수학/기구학/CAD',
    dayRange: 'Day 17 ~ 25',
    goal: '라디안·변환행렬·쿼터니언과 CAD/3D프린팅 공차, 바퀴 로봇 기구학, 로봇 팔 FK/IK·야코비안·토크 선정을 마스터합니다.',
    accent: 'amber',
    miniProjectTitle: 'Day 25 미니 프로젝트: 2R/3R 로봇 팔 좌표 이동 & 토크 검증기',
  },
  {
    id: 'phase4',
    order: 4,
    title: 'Phase 4. 센서 심화, 피드백 제어 & 상태 추정',
    shortTitle: '4단계 · 센서/PID/필터',
    dayRange: 'Day 26 ~ 34',
    goal: '초음파·엔코더·IMU 노이즈를 상보/칼만 필터로 정제하고, 안티 와인드업·캐스케이드 PID와 궤적 추종기를 튜닝합니다.',
    accent: 'violet',
    miniProjectTitle: 'Day 34 미니 프로젝트: 엔코더+IMU 퓨전 직진 보정 & PID 추종 로봇',
  },
  {
    id: 'phase5',
    order: 5,
    title: 'Phase 5. 경로 계획, 컴퓨터 비전, ROS 2 & SLAM',
    shortTitle: '5단계 · ROS 2/비전/SLAM',
    dayRange: 'Day 35 ~ 42',
    goal: 'Python 시리얼 브릿지, C-Space/A*/RRT/DWA 경로 계획, ROS 2 노드/TF2, OpenCV 비전, 파티클 필터와 SLAM을 구현합니다.',
    accent: 'rose',
    miniProjectTitle: 'Day 42 미니 프로젝트: 미로 탐색 A* + 파티클 필터 자율주행',
  },
  {
    id: 'phase6',
    order: 6,
    title: 'Phase 6. 나만의 기판(PCB) 제작 & 최종 통합 캡스톤',
    shortTitle: '6단계 · PCB/캡스톤',
    dayRange: 'Day 43 ~ 45',
    goal: 'KiCad PCB 설계·디버깅 체크리스트를 익히고, 하드웨어·제어·인지를 하나로 통합한 자율 모바일 매니퓰레이터를 완성합니다.',
    accent: 'indigo',
    miniProjectTitle: 'Day 45 졸업 캡스톤: 자율 픽앤플레이스 모바일 매니퓰레이터',
  },
];

export const SKILL_DOMAINS: SkillDomainCoverage[] = [
  {
    id: 'mechanical',
    groupLabel: 'Hardware & Mechanics',
    title: 'Mechanical Design',
    titleKo: '기구 설계 & 역학',
    skills: [
      { name: 'CAD Modeling & 3D프린팅 공차', days: [19, 38] },
      { name: 'Kinematics (로봇 팔 & 바퀴 로봇)', days: [17, 18, 20, 21, 22, 23] },
      { name: 'Robot Dynamics & 토크 계산', days: [24, 25] },
    ],
  },
  {
    id: 'electronics',
    groupLabel: 'Hardware & Mechanics',
    title: 'Electronics',
    titleKo: '전자 회로 & 전원',
    skills: [
      { name: 'PCB Design & 브레드보드/전원', days: [1, 2, 5, 6, 43] },
      { name: 'Sensors (초음파·엔코더·IMU·LiDAR)', days: [3, 4, 26, 27, 28] },
      { name: 'Actuators (DC·서보·스테퍼·H-브리지)', days: [13, 14] },
    ],
  },
  {
    id: 'embedded',
    groupLabel: 'Hardware & Mechanics',
    title: 'Embedded Systems',
    titleKo: '임베디드 시스템',
    skills: [
      { name: 'Microcontrollers (ESP32 핀맵/안전)', days: [8, 9, 12] },
      { name: 'Embedded C/C++ & FSM', days: [10, 11, 44] },
      { name: 'Real-Time Systems (ISR & RTOS)', days: [15, 16] },
    ],
  },
  {
    id: 'programming',
    groupLabel: 'Software & Intelligence',
    title: 'Programming',
    titleKo: '로보틱스 소프트웨어',
    skills: [
      { name: 'Python & NumPy 시리얼 브릿지', days: [35, 39] },
      { name: 'C++ 펌웨어 & 고성능 루프', days: [10, 11, 15, 37] },
      { name: 'ROS 2 (Node·Topic·TF2·URDF)', days: [37, 38, 45] },
    ],
  },
  {
    id: 'control',
    groupLabel: 'Software & Intelligence',
    title: 'Control Systems',
    titleKo: '제어 공학 & 상태 추정',
    skills: [
      { name: 'PID Control & Anti-Windup', days: [30, 31, 34] },
      { name: 'Trajectory Tracking & 경로 계획', days: [32, 36] },
      { name: 'State Estimation (상보/칼만 필터)', days: [29, 33, 40] },
    ],
  },
  {
    id: 'ai_perception',
    groupLabel: 'Software & Intelligence',
    title: 'AI & Perception',
    titleKo: '인지 · 융합 · SLAM',
    skills: [
      { name: 'Computer Vision (핀홀·ArUco·객체인식)', days: [39, 45] },
      { name: 'Sensor Fusion (엔코더+IMU+거리)', days: [29, 33, 34] },
      { name: 'SLAM & 파티클 필터 내비게이션', days: [40, 41, 42] },
    ],
  },
];

export const ROADMAP_45_DAYS: CurriculumDay[] = [
  // Phase 1 (Days 1..7)
  {
    day: 1,
    phaseId: 'phase1',
    title: '로봇의 해부학 & 직류 전기 기초',
    subtitle: '센서–두뇌–액추에이터 3요소 · 전압/전류/저항 · 옴의 법칙',
    durationMin: 25,
    skillDomains: ['electronics'],
    skillTags: ['DC 전기', 'V=IR', 'LED 보호 저항'],
    failFirstHook:
      '5V 전원에 LED를 저항 없이 바로 꽂으면 1초 만에 "퍽" 하고 타버리며 보드 핀까지 손상됩니다.',
    beginnerAnalogy:
      '전압(V)은 물탱크 높이(수압), 전류(A)는 흐르는 물의 양, 저항(Ω)은 호스를 좁혀 물살을 조절하는 밸브입니다.',
    learningGoals: [
      '모든 로봇이 센서(눈)→두뇌(MCU)→액추에이터(근육) 루프로 동작함을 이해한다.',
      '옴의 법칙 V = I·R로 회로에 흐르는 전류(mA)를 계산한다.',
      'LED 순방향 전압(Vf)을 고려해 적절한 보호 저항(220Ω 등)을 선정한다.',
    ],
    linkedLabModuleId: 'day01_basics',
  },
  {
    day: 2,
    phaseId: 'phase1',
    title: '브레드보드(빵판) 구조 & 멀티미터 실전',
    subtitle: '내부 금속 레일 연결 · 쇼트(합선) 방지 · 도통/전압 측정법',
    durationMin: 25,
    skillDomains: ['electronics'],
    skillTags: ['브레드보드', '멀티미터', '쇼트 예방'],
    failFirstHook:
      '빵판 구멍이 가로로 연결된 줄 알고 +와 -를 같은 줄에 꽂으면 배터리가 순식간에 뜨거워지며 합선(Short)됩니다.',
    beginnerAnalogy:
      '브레드보드는 보이지 않는 구리 다리가 아래에 깔린 레고 판입니다. 바깥 레일은 세로로, 안쪽 5칸은 가로로 이어져 있어요.',
    learningGoals: [
      '브레드보드 전원 레일(+/-)과 5핀 터미널 스트립의 내부 도통 방향을 구별한다.',
      '멀티미터로 직류 전압(DC V), 저항(Ω), 도통(삐- 소리) 모드를 올바르게 사용한다.',
      '전원을 켜기 전 VCC–GND 간 쇼트 여부를 3초 만에 검사하는 습관을 들인다.',
    ],
    linkedLabModuleId: 'day02_breadboard',
  },
  {
    day: 3,
    phaseId: 'phase1',
    title: '디지털 신호(0과 1) & 플로팅 현상',
    subtitle: '3.3V vs 5V 로직 문턱값 · 스위치 바운싱 · 풀업/풀다운 저항',
    durationMin: 25,
    skillDomains: ['electronics'],
    skillTags: ['3.3V 로직', '플로팅', '풀업/풀다운'],
    failFirstHook:
      '버튼 하나만 핀에 연결하고 저항을 빼먹으면, 손을 대지도 않았는데 코드가 버튼을 수백 번 누른 것처럼 미친 듯이 튑니다.',
    beginnerAnalogy:
      '아무 저항도 없는 입력 핀은 바람에 흔들리는 깃발(Floating)과 같습니다. 풀업/풀다운 저항은 깃발을 기본 위치에 묶어두는 고무줄입니다.',
    learningGoals: [
      '디지털 HIGH/LOW 판정 전압 범위와 3.3V·5V 시스템 차이를 구분한다.',
      '플로팅 노이즈가 생기는 원인을 이해하고 10kΩ 풀업/풀다운 회로를 구성한다.',
      '기계식 스위치의 채터링(Bouncing)을 소프트웨어로 걸러내는 개념을 익힌다.',
    ],
    linkedLabModuleId: 'day03_digital',
  },
  {
    day: 4,
    phaseId: 'phase1',
    title: '아날로그 신호(ADC) & PWM의 마법',
    subtitle: '12-bit ADC 양자화(0~4095) · PWM 주파수와 듀티 사이클',
    durationMin: 25,
    skillDomains: ['electronics'],
    skillTags: ['ADC 12-bit', 'PWM 듀티', '아날로그 변환'],
    failFirstHook:
      '디지털 핀에 "전압을 1.5V만 내보내라"고 하면 모터가 안 돕니다. MCU는 0V와 3.3V만 매우 빠르게 깜빡여 평균 전압을 만듭니다.',
    beginnerAnalogy:
      '선풍기 버튼을 1초에 1,000번씩 켰다 껐다 하면서 켜진 시간 비율(듀티 사이클)을 50%로 맞추면 절반 세기의 바람이 나오는 원리입니다.',
    learningGoals: [
      '아날로그 전압(0~3.3V)이 12-bit ADC 숫자(0~4095)로 양자화되는 계산을 수행한다.',
      'PWM의 주파수(Hz)와 듀티 사이클(%) 차이를 이해한다.',
      'LED 밝기(고주파)와 서보모터 각도(50Hz 펄스폭 0.5~2.5ms)의 PWM 차이를 구분한다.',
    ],
    linkedLabModuleId: 'day04_adc_pwm',
  },
  {
    day: 5,
    phaseId: 'phase1',
    title: '전압 분배기 & 로직 레벨 시프터',
    subtitle: '5V 센서 출력을 3.3V 보드에 안전하게 연결하기 · 저항비 계산',
    durationMin: 30,
    skillDomains: ['electronics'],
    skillTags: ['전압 분배', '레벨 시프터', '3.3V 보호'],
    failFirstHook:
      'HC-SR04 초음파 센서의 5V ECHO 신호를 3.3V 전용 ESP32 핀에 직결하면 핀 보호 다이오드가 타며 보드가 고장 날 수 있습니다.',
    beginnerAnalogy:
      '전압 분배기는 5m 높이에서 떨어지는 폭포 물을 두 개의 계단(저항 10kΩ + 20kΩ)으로 나눠 3.3m 높이로 낮춰 받는 완충 계단입니다.',
    learningGoals: [
      '전압 분배 공식 V_out = V_in · R2 / (R1 + R2)로 5V→3.3V 강압 저항비를 설계한다.',
      '단방향 저항 분배기와 양방향 MOSFET I2C 레벨 시프터의 쓰임새를 구별한다.',
      '실제 센서 데이터시트에서 "VIH / VIL"과 "Absolute Maximum Voltage" 항목을 찾는다.',
    ],
    linkedLabModuleId: 'day05_divider',
  },
  {
    day: 6,
    phaseId: 'phase1',
    title: '배터리, 전원 예산(Power Budget) & 공구 기초',
    subtitle: 'LiPo/18650/BMS · DC-DC 벅 컨버터 · 와이어 AWG · 납땜 기초',
    durationMin: 30,
    skillDomains: ['electronics'],
    skillTags: ['배터리/C-rate', '벅 컨버터', '납땜/AWG'],
    failFirstHook:
      'USB 포트나 9V 네모 건전지로 모터를 돌리려다 전압이 뚝 떨어져 보드가 계속 재부팅되거나, 가는 선이 녹아내립니다.',
    beginnerAnalogy:
      '배터리는 댐(mAh 용량)과 수문 크기(C-rate 최대 전류)입니다. 7.4V 배터리를 5V로 낮출 때 열로 날리지 않고 알뜰하게 줄이는 장치가 벅 컨버터예요.',
    learningGoals: [
      'AA 건전지, 18650 리튬이온, LiPo 배터리의 공칭 전압·방전율(C-rate)·보호회로(BMS)를 비교한다.',
      '선형 레귤레이터(LDO)의 발열 문제와 스위칭 DC-DC 벅 컨버터의 필요성을 이해한다.',
      '모터 전류에 맞는 전선 굵기(AWG), 커넥터(JST/XT60), 납땜 안전 수칙을 익힌다.',
    ],
    linkedLabModuleId: 'day06_power',
  },
  {
    day: 7,
    phaseId: 'phase1',
    title: '[Phase 1 미니 프로젝트] 가상 브레드보드 스마트 위험 감지기',
    subtitle: '5V 센서 + 분압 저항 + 3.3V LED/부저 + 배터리 안전 결선 총복습',
    durationMin: 35,
    isMiniProject: true,
    skillDomains: ['electronics'],
    skillTags: ['미니 프로젝트', '회로 검증', '전원 예산'],
    failFirstHook:
      '공통 접지(GND) 하나를 빠뜨리거나 저항값을 한 자리 잘못 꽂으면 전체 시스템이 전혀 반응하지 않습니다.',
    beginnerAnalogy:
      '지금까지 배운 옴의 법칙, 빵판, 풀업 저항, 분압기, 배터리 규격을 모두 합쳐 첫 번째 작은 전자 장치를 조립하는 실전 시험입니다.',
    learningGoals: [
      '5V 입력 장치와 3.3V 표시 장치가 섞인 회로의 전원/접지 배선을 완성한다.',
      '각 부품의 소비 전류(mA)를 합산해 배터리 동작 시간을 어림잡아 계산한다.',
      '멀티미터 점검 순서대로 오배선 원인을 스스로 찾아낸다.',
    ],
    linkedLabModuleId: 'day07_project',
  },

  // Phase 2 (Days 8..16)
  {
    day: 8,
    phaseId: 'phase2',
    title: '실제 ESP32 보드 해부 & 개발환경',
    subtitle: 'USB-UART · 3.3V 레귤레이터 · EN/BOOT 버튼 · PlatformIO vs Arduino',
    durationMin: 25,
    skillDomains: ['embedded'],
    skillTags: ['ESP32 구조', 'EN/BOOT', '개발환경'],
    failFirstHook:
      '보드 옆면에 적힌 D2, D15 같은 글자만 보고 코딩하거나, 업로드할 때 BOOT 버튼 타이밍을 몰라 계속 Timeout 오류를 겪습니다.',
    beginnerAnalogy:
      'ESP32 보드는 작은 컴퓨터 본체입니다. 금속 방열판 아래 듀얼코어 CPU와 Wi-Fi가 있고, USB 칩이 통역사, 레귤레이터가 변압기 역할을 합니다.',
    learningGoals: [
      'ESP32 DevKit 보드 위 주요 칩(ESP-WROOM-32, CP2102/CH340, AMS1117)의 역할을 구별한다.',
      '보드 실크스크린 표기(D/RX/TX/VIN/3V3)와 코드 상의 GPIO 번호 매핑을 이해한다.',
      '펌웨어 업로드 모드(GPIO 0 LOW + EN 리셋) 원리를 이해한다.',
    ],
    linkedLabModuleId: 'day08_board',
  },
  {
    day: 9,
    phaseId: 'phase2',
    title: 'ESP32 GPIO 안전 규율 & 핀 인스펙터',
    subtitle: '입력 전용(34~39) · 금지 핀(6~11 Flash) · 스트래핑 핀 · Wi-Fi ADC2 충돌',
    durationMin: 30,
    skillDomains: ['embedded'],
    skillTags: ['ESP32 핀맵', 'Strapping', 'ADC1 vs ADC2'],
    failFirstHook:
      '아무 핀이나 골라 GPIO 6~11에 센서를 꽂으면 보드가 영원히 크래시되고, GPIO 12가 HIGH면 부팅조차 되지 않습니다.',
    beginnerAnalogy:
      '보드 위의 30개 구멍은 다 똑같아 보이지만, 어떤 구멍은 "내부 창고 전용 통로(Flash)", 어떤 구멍은 "출근 체크 스위치(Strapping)"라 함부로 건드리면 안 됩니다.',
    learningGoals: [
      'ESP32에서 안전하게 쓸 수 있는 범용 I/O 핀과 입력 전용 핀(34, 35, 36, 39)을 구별한다.',
      'SPI Flash 직결 핀(GPIO 6~11) 및 부팅 스트래핑 핀(0, 2, 5, 12, 15)의 위험성을 설명한다.',
      'Wi-Fi 활성화 시 ADC2 채널이 막히는 이유와 ADC1 대안을 인터랙티브 보드에서 검증한다.',
    ],
    linkedLabModuleId: 'esp32',
  },
  {
    day: 10,
    phaseId: 'phase2',
    title: '임베디드 C/C++ & 논블로킹 코딩(millis)',
    subtitle: 'uint8_t/volatile · 비트 연산 · delay()의 함정과 논블로킹 타이머',
    durationMin: 30,
    skillDomains: ['embedded', 'programming'],
    skillTags: ['C/C++', 'millis()', '논블로킹'],
    failFirstHook:
      '코드에 delay(1000)을 넣으면 1초 동안 로봇 눈이 멀어서 앞의 벽을 못 보고 그대로 들이받습니다.',
    beginnerAnalogy:
      'delay()는 라면 물 끓을 때까지 3분 동안 멍하니 냄비만 쳐다보는 것이고, millis()는 시계를 보며 김치도 썰고 계란도 깨는 멀티태스킹 요리사입니다.',
    learningGoals: [
      '메모리가 작은 MCU에서 uint8_t, int16_t, float, volatile 키워드를 쓰는 이유를 안다.',
      'delay() 블로킹 코드를 millis() 타임스탬프 비교 기반 논블로킹 루프로 바꾼다.',
      '비트 시프트(<<, &)로 레지스터 플래그나 센서 2바이트 데이터를 합치는 법을 익힌다.',
    ],
    linkedLabModuleId: 'day10_nonblocking',
  },
  {
    day: 11,
    phaseId: 'phase2',
    title: '유한 상태 머신(FSM)으로 로봇 행동 설계하기',
    subtitle: 'if/else 스파게티 탈출 · IDLE → PATROL → AVOID → STOP 상태 전이',
    durationMin: 25,
    skillDomains: ['embedded', 'programming'],
    skillTags: ['상태 머신(FSM)', '아키텍처', '로봇 행동'],
    failFirstHook:
      '기능이 3개만 늘어나도 bool 플래그와 중첩 if문이 얽혀, 로봇이 후진하면서 동시에 전진 명령을 내리는 버그가 터집니다.',
    beginnerAnalogy:
      '신호등처럼 로봇은 한 번에 딱 하나의 명확한 상태(탐색 중 / 회피 중 / 정지)에만 머물고, 조건이 맞을 때만 다음 상태로 건너뛰게 만드는 설계도입니다.',
    learningGoals: [
      'enum class와 switch-case를 이용해 깔끔한 유한 상태 머신(FSM)을 작성한다.',
      '상태 진입/유지/탈출 조건을 정의해 센서 이벤트 간 충돌을 막는다.',
      '비상 정지(E-STOP) 최상위 상태 전이를 모든 루프에 반영한다.',
    ],
    linkedLabModuleId: 'day11_fsm',
  },
  {
    day: 12,
    phaseId: 'phase2',
    title: '센서 대화 언어 3대장: UART · I2C · SPI',
    subtitle: '시리얼 디버깅 · I2C 주소 스캔 & 풀업 저항 · SPI 고속 통신',
    durationMin: 30,
    skillDomains: ['embedded'],
    skillTags: ['UART', 'I2C', 'SPI'],
    failFirstHook:
      'TX-TX를 맞물려 연결해 데이터가 안 나오거나, I2C 주소 0x68을 몰라서 센서를 못 찾고 하루를 날립니다.',
    beginnerAnalogy:
      'UART는 1:1 무전기(TX↔RX 교차), I2C는 2가닥 선에 번호표(주소) 달고 줄 선 교실, SPI는 속도 빠른 4차선 전용 고속도로입니다.',
    learningGoals: [
      'UART의 TX/RX 교차 연결과 Baud Rate(115200bps) 동기화 원리를 익힌다.',
      'I2C 버스(SDA/SCL)의 7비트 주소 체계, 풀업 저항, 다중 센서 연결법을 이해한다.',
      'SPI의 MOSI/MISO/SCK/CS 신호선 역할과 I2C 대비 고속 장점을 구별한다.',
    ],
    linkedLabModuleId: 'day12_comms',
  },
  {
    day: 13,
    phaseId: 'phase2',
    title: '액추에이터 A to Z: DC · 서보 · 스테퍼 모터',
    subtitle: '기어비 & 토크-속도 곡선 · SG90 vs 연속회전 서보 · 마이크로스텝',
    durationMin: 30,
    skillDomains: ['electronics', 'mechanical'],
    skillTags: ['Actuators', 'DC/서보/스테퍼', '토크/기어비'],
    failFirstHook:
      '3,000원짜리 SG90 소형 서보로 무거운 로봇 팔을 들어 올리려다 내부 플라스틱 기어가 갈려버립니다.',
    beginnerAnalogy:
      'DC 모터는 쌩쌩 달리는 바퀴, 서보 모터는 정해진 각도만 딱 짚는 로봇 관절, 스테퍼 모터는 1.8도씩 한 걸음씩 정확히 밟는 3D 프린터용 모터입니다.',
    learningGoals: [
      '스톨 전류(Stall Current)와 정격 토크(kg·cm / N·m)의 의미를 데이터시트에서 읽는다.',
      '기어비(Gear Ratio)를 높이면 속도는 줄고 토크가 늘어나는 반비례 관계를 계산한다.',
      '만들려는 로봇 부위별로 DC·서보·스테퍼 중 적합한 모터를 고른다.',
    ],
    linkedLabModuleId: 'day13_actuators',
  },
  {
    day: 14,
    phaseId: 'phase2',
    title: '모터 드라이버(H-브리지) & 브라운아웃 완전 정복',
    subtitle: 'TB6612/L298N · 역기전력 플라이백 다이오드 · 전원 분리 & 공통 GND',
    durationMin: 30,
    skillDomains: ['electronics'],
    skillTags: ['H-브리지', '전원 분리', '브라운아웃 해결'],
    failFirstHook:
      'ESP32 핀에 DC 모터를 직접 꽂거나 3V3 핀에서 모터 전원을 따면, 역기전력으로 핀이 죽거나 모터 도는 순간 보드가 재부팅됩니다.',
    beginnerAnalogy:
      'H-브리지는 물길 밸브 4개를 X자로 엮어 모터 전류 방향(정회전/역회전/브레이크)을 바꾸는 장치이고, 모터 전원 분리는 엘리베이터 전원과 컴퓨터 전원을 따로 뽑는 것과 같습니다.',
    learningGoals: [
      'H-브리지 4개 스위치 조합으로 정회전·역회전·관성정지·급제동(Brake)을 만든다.',
      '모터 전원(6~12V)과 MCU 로직 전원(3.3V)을 분리하되 GND는 반드시 하나로 묶는 이유를 설명한다.',
      '디커플링 커패시터와 플라이백 다이오드로 브라운아웃 리셋을 해결한다.',
    ],
    linkedLabModuleId: 'day14_hbridge',
  },
  {
    day: 15,
    phaseId: 'phase2',
    title: '실시간 시스템(ISR/RTOS) & 무선 조종 기초',
    subtitle: '하드웨어 인터럽트 · FreeRTOS 듀얼코어 고정 Δt · ESP-NOW/Wi-Fi & 시리얼 플로터',
    durationMin: 30,
    skillDomains: ['embedded', 'programming'],
    skillTags: ['Real-Time Systems', 'FreeRTOS', '무선 텔레메트리'],
    failFirstHook:
      'loop() 안에 Wi-Fi 통신과 센서 대기를 같이 넣었더니 제어 주기 Δt가 5ms에서 120ms로 출렁이며 로봇이 덜덜 떨립니다.',
    beginnerAnalogy:
      'FreeRTOS는 주방장 두 명(ESP32 코어 0, 1)에게 "너는 무조건 10ms마다 모터 제어만 해, 다른 한 명은 Wi-Fi 주문만 받아"라고 임무를 나누는 시스템입니다.',
    learningGoals: [
      '하드웨어 인터럽트(ISR) 안에서 무거운 연산이나 Serial.print를 금지하는 이유를 이해한다.',
      'FreeRTOS 태스크와 vTaskDelayUntil로 정확한 제어 주기 Δt를 유지한다.',
      '시리얼 플로터와 Wi-Fi/ESP-NOW 무선 조종 패킷 구조를 설계한다.',
    ],
    linkedLabModuleId: 'day15_rtos_wireless',
  },
  {
    day: 16,
    phaseId: 'phase2',
    title: '[Phase 2 미니 프로젝트] ESP32 무선 RC 로버 통합 설계',
    subtitle: '배터리 + 벅 컨버터 + TB6612 + ESP32 + FSM 무선 조종 완성',
    durationMin: 40,
    isMiniProject: true,
    skillDomains: ['embedded', 'electronics', 'programming'],
    skillTags: ['미니 프로젝트', '무선 로버', '전원/FSM'],
    failFirstHook:
      '무선 연결이 잠깐 끊겼을 때 안전 정지(Failsafe Timeout)를 안 넣으면, 로버가 마지막 속도 명령 그대로 책상 밖으로 돌진합니다.',
    beginnerAnalogy:
      '배터리부터 모터 바퀴, 무선 수신기, 안전 정지 FSM까지 실제 굴러가는 원격 로봇의 전체 뼈대를 조립하는 단계입니다.',
    learningGoals: [
      'ESP32 안전 핀맵 규칙을 어기지 않고 2모터+서보+Wi-Fi 핀을 충돌 없이 할당한다.',
      '배터리→벅컨버터→ESP32 / 배터리→모터드라이버 분리 전원도를 설계한다.',
      '통신 두절 500ms 초과 시 자동으로 모터를 끄는 Failsafe FSM을 작성한다.',
    ],
    linkedLabModuleId: 'day16_rover_project',
  },

  // Phase 3 (Days 17..25)
  {
    day: 17,
    phaseId: 'phase3',
    title: '로보틱스 수학 워밍업: 각도·벡터·행렬',
    subtitle: '라디안(rad) vs 도(deg) · atan2 사분면 보존 · 벡터 내적/외적',
    durationMin: 25,
    skillDomains: ['mechanical'],
    skillTags: ['라디안', 'atan2', '벡터/행렬'],
    failFirstHook:
      '코드에서 sin(90)을 그대로 호출하거나 일반 atan(y/x)를 쓰면 로봇 팔이 180도 반대편으로 꺾이며 기구물을 부숩니다.',
    beginnerAnalogy:
      '라디안은 "반지름 길이만큼 원 둘레를 걸어간 각도"이고, atan2(y, x)는 동서남북 어느 사분면에 있는지 방향까지 정확히 기억하는 나침반입니다.',
    learningGoals: [
      '도(deg)와 라디안(rad) 변환(π = 180°)을 모든 삼각함수 코드에 적용한다.',
      'atan(y/x)의 0 나누기·사분면 모호성 문제와 atan2(y, x)의 장점을 설명한다.',
      '2D/3D 벡터의 내적(각도/투영)과 외적(수직축/토크 방향)을 계산한다.',
    ],
    linkedLabModuleId: 'day17_math',
  },
  {
    day: 18,
    phaseId: 'phase3',
    title: '3D 공간 좌표계 & 회전 표현 (SO(3), SE(3))',
    subtitle: '동차 변환 행렬 · 오일러 각(Roll/Pitch/Yaw) & 짐벌락 · 쿼터니언 직관',
    durationMin: 30,
    skillDomains: ['mechanical'],
    skillTags: ['동차 변환', '오일러 vs 쿼터니언', 'SE(3)'],
    failFirstHook:
      '드론이나 로봇 머리가 위를 90도 쳐다보는 순간(Pitch=90°) Roll과 Yaw 축이 겹쳐 회전이 잠기는 짐벌락(Gimbal Lock)에 빠집니다.',
    beginnerAnalogy:
      '오일러 각은 "고개 돌리고→숙이고→갸우뚱" 3단계 순서가 꼬이면 헷갈리지만, 쿼터니언은 "3D 공간에 꼬치(축) 하나를 꽂고 그 축 중심으로 한 번에 몇 도 돌린다"는 표현입니다.',
    learningGoals: [
      '회전 행렬 R과 위치 벡터 p를 합친 4×4 동차 변환 행렬(SE(3))로 좌표계를 변환한다.',
      '좌표계 곱셈 순서(전역 좌표계 기준 vs 몸체 기준)의 차이를 구분한다.',
      'IMU와 ROS 2가 오일러 각 대신 단위 쿼터니언(x, y, z, w)을 쓰는 이유를 이해한다.',
    ],
    linkedLabModuleId: 'day18_rotation3d',
  },
  {
    day: 19,
    phaseId: 'phase3',
    title: '기구 설계, CAD & 3D 프린팅 현실 감각',
    subtitle: '자유도(DOF) · 링크/조인트 · CAD 스케치→어셈블리 · 프린팅 공차(0.2~0.4mm)',
    durationMin: 30,
    skillDomains: ['mechanical'],
    skillTags: ['CAD Modeling', '3D프린팅 공차', 'URDF'],
    failFirstHook:
      'CAD 도면에서 축 지름 5.0mm에 구멍 지름을 딱 5.0mm로 뽑아 출력하면, 플라스틱 수축 때문에 볼트나 베어링이 절대 안 들어갑니다.',
    beginnerAnalogy:
      '종이 설계도는 오차가 0이지만 현실의 3D 프린터는 플라스틱을 녹여 쌓으므로, 헐거운 맞춤(0.3mm 여유)과 억지 끼움(0.1mm) 공차 설계가 노하우입니다.',
    learningGoals: [
      '기구학 자유도(DOF)와 회전(Revolute)·직동(Prismatic) 조인트를 구분한다.',
      '3D 프린팅 부품의 끼워맞춤 공차(0.2~0.4mm), M3 볼트/너트 포켓, 무게중심 배치를 설계한다.',
      'CAD 어셈블리가 시뮬레이터용 로봇 설명 파일(URDF)로 어떻게 변환되는지 이해한다.',
    ],
    linkedLabModuleId: 'day19_cad_tolerance',
  },
  {
    day: 20,
    phaseId: 'phase3',
    title: '바퀴 달린 로봇 기구학 (Mobile Robot Kinematics)',
    subtitle: '차동 구동 (v, ω) ↔ (v_L, v_R) · 순간 회전 중심(ICR) · 옴니/메카넘 휠',
    durationMin: 30,
    skillDomains: ['mechanical'],
    skillTags: ['차동 구동', 'ICR', '홀로노믹/메카넘'],
    failFirstHook:
      '두 바퀴 로봇에게 "오른쪽으로 10cm 옆으로 이동해"라고 명령해도 물리적으로 불가능합니다(논홀로노믹 제약). 먼저 몸을 틀고 전진해야 합니다.',
    beginnerAnalogy:
      '마트 카트나 자동차처럼 옆으로 게걸음을 못 치는 것이 논홀로노믹이고, 왼쪽·오른쪽 바퀴 속도 차이만으로 선회 중심(ICR)을 바꾸는 것이 차동 구동입니다.',
    learningGoals: [
      '선속도 v와 각속도 ω를 좌/우 바퀴 목표 속도(v_L, v_R)로 변환하는 기구학 식을 유도한다.',
      '양 바퀴 속도가 같을 때(직진), 크기가 같고 부호가 반대일 때(제자리 회전)의 ICR을 찾는다.',
      '차동 구동, 애커먼 조향(자동차), 메카넘 옴니휠의 기동성과 마찰 장단점을 비교한다.',
    ],
    linkedLabModuleId: 'day20_mobile_kinematics',
  },
  {
    day: 21,
    phaseId: 'phase3',
    title: '로봇 팔 순기구학 (Forward Kinematics)',
    subtitle: '2축 평면 로봇 팔 FK · 누적 회전각(θ₁+θ₂) · 다관절 DH/PoE 입문',
    durationMin: 30,
    skillDomains: ['mechanical'],
    skillTags: ['Kinematics', 'FK', 'DH 파라미터'],
    failFirstHook:
      '두 번째 관절이 팔꿈치에서 30도 꺾였을 때, 손끝의 방향을 θ₂가 아니라 (θ₁ + θ₂)로 계산해야 맞습니다.',
    beginnerAnalogy:
      '어깨를 30도 들고 팔꿈치를 추가로 45도 굽히면, 손목의 최종 각도는 지면 기준으로 75도가 되는 사슬 덧셈 원리입니다.',
    learningGoals: [
      '2R 평면 로봇 팔의 순기구학 공식 x, y를 유도하고 3D 모델로 즉시 확인한다.',
      '관절 각도 변화에 따른 엔드이펙터 위치 변화를 예측한다.',
      '3축 이상의 공간 로봇 팔을 체계적으로 기술하는 DH 파라미터와 PoE 개념을 이해한다.',
    ],
    linkedLabModuleId: 'kinematics',
  },
  {
    day: 22,
    phaseId: 'phase3',
    title: '로봇 팔 역기구학 (Inverse Kinematics) & 작업공간',
    subtitle: '제2코사인 법칙 · Elbow-up/down · 환형 영역(|D|≤1) · 수치 해법 입문',
    durationMin: 35,
    skillDomains: ['mechanical'],
    skillTags: ['Kinematics', 'IK', '작업공간'],
    failFirstHook:
      '팔 길이 합(L1+L2)보다 먼 좌표를 넣었는데 |D|>1 예외처리를 안 하면 sqrt(음수) 때문에 NaN이 떠서 서보가 폭주합니다.',
    beginnerAnalogy:
      '손끝 목표 위치(x, y)를 먼저 찍고 거꾸로 "어깨와 팔꿈치를 몇 도 굽혀야 거기 닿을까?"를 계산하는 문제로, 위/아래 두 가지 팔꿈치 자세가 나옵니다.',
    learningGoals: [
      '제2코사인 법칙과 atan2로 2R 로봇 팔의 해석적 역기구학 해를 도출한다.',
      '도달 가능한 환형 작업공간(|L1−L2| ≤ r ≤ L1+L2)과 Elbow-up/down 이중 해를 구별한다.',
      '공식으로 안 풀리는 6축 로봇 팔에 쓰는 반복 수치 역기구학(Newton-Raphson) 아이디어를 이해한다.',
    ],
    linkedLabModuleId: 'kinematics',
  },
  {
    day: 23,
    phaseId: 'phase3',
    title: '속도 기구학, 야코비안(Jacobian) & 특이점',
    subtitle: 'ẋ = J(θ)θ̇ · 정적 힘 쌍대성 τ = JᵀF · 특이점(Singularity)의 물리적 의미',
    durationMin: 30,
    skillDomains: ['mechanical'],
    skillTags: ['야코비안', '특이점', '정역학'],
    failFirstHook:
      '로봇 팔을 일자로 쫙 편 특이점 근처에서 직선 이동을 시키면, 손끝은 천천히 가는데 관절 모터가 무한대 속도로 돌려고 발작합니다.',
    beginnerAnalogy:
      '야코비안은 "관절 모터 회전 속도가 손끝의 x, y 속도로 얼마나 증폭/변환되는지" 알려주는 기어비 행렬입니다.',
    learningGoals: [
      '순기구학 식을 미분해 2R 로봇 팔의 2×2 야코비안 행렬 J(θ)를 구한다.',
      'det(J) = L1·L2·sin(θ2) = 0이 되는 특이점(θ2 = 0, π)에서 왜 한 방향 자유도를 잃는지 설명한다.',
      '손끝에 걸리는 외력 F가 각 관절에 만드는 토크 τ = JᵀF 관계를 이해한다.',
    ],
    linkedLabModuleId: 'day23_jacobian',
  },
  {
    day: 24,
    phaseId: 'phase3',
    title: '로봇 동역학 (Robot Dynamics) & 모터 토크 선정',
    subtitle: '토크 τ = r×F · 관성 모멘트 · M(q)q̈ + C(q,q̇)q̇ + g(q) = τ 직관',
    durationMin: 30,
    skillDomains: ['mechanical'],
    skillTags: ['Robot Dynamics', '관성/토크', '서보 선정'],
    failFirstHook:
      '기구학상 완벽히 닿는 40cm짜리 로봇 팔을 만들었는데, 막상 전원을 켜니 중력 때문에 팔이 축 처지며 모터에서 연기만 납니다.',
    beginnerAnalogy:
      '아령을 몸에 붙이고 들면 가볍지만 팔을 수평으로 쫙 펴면 어깨가 부서질 듯 무겁습니다. 거리(r)가 길어질수록 필요한 회전 힘(토크)이 커집니다.',
    learningGoals: [
      '팔 길이와 링크 질량, 페이로드 무게로부터 베이스 관절이 버텨야 할 정적 중력 토크를 계산한다.',
      '동역학 방정식의 세 항(가속도 관성 M, 원심/코리올리 C, 중력 g)의 물리적 의미를 이해한다.',
      '계산된 필요 토크에 안전율(1.5~2배)을 곱해 서보/감속기 스펙을 선정한다.',
    ],
    linkedLabModuleId: 'day24_dynamics',
  },
  {
    day: 25,
    phaseId: 'phase3',
    title: '[Phase 3 미니 프로젝트] 로봇 팔 좌표 이동 & 토크 검증기',
    subtitle: '목표 (x, y) 입력 → IK/특이점 검사 → 페이로드 토크 안전성 판별',
    durationMin: 35,
    isMiniProject: true,
    skillDomains: ['mechanical', 'programming'],
    skillTags: ['미니 프로젝트', 'IK + 동역학', '작업공간'],
    failFirstHook:
      '작업공간 안쪽이고 IK 해가 나와도, 특이점 경계나 토크 한계 초과를 함께 체크하지 않으면 실제 하드웨어가 고장 납니다.',
    beginnerAnalogy:
      'Phase 3에서 배운 수학, FK/IK, 야코비안, 토크 계산을 하나로 엮어 로봇 팔을 제작하기 전에 미리 검증하는 엔지니어링 툴을 완성합니다.',
    learningGoals: [
      '목표 좌표의 도달 가능성과 특이점 근접 여부를 사전에 판별한다.',
      '주어진 링크 길이·질량 조건에서 최대 연장 자세의 필요 토크를 검증한다.',
      '한 자세에서 다른 자세로 이동할 때 Elbow-up/down 전환 충돌을 피한다.',
    ],
    linkedLabModuleId: 'day25_arm_project',
  },

  // Phase 4 (Days 26..34)
  {
    day: 26,
    phaseId: 'phase4',
    title: '거리 센서 & 데이터시트 타이밍도 해독 (HC-SR04)',
    subtitle: '40kHz ToF 10μs 트리거 · 38ms 타임아웃 · 60ms 주기 · ToF/LiDAR 비교',
    durationMin: 30,
    skillDomains: ['electronics'],
    skillTags: ['Sensors', 'HC-SR04', 'ToF/LiDAR'],
    failFirstHook:
      '초음파를 5ms마다 연속 발사하면 이전 음파의 벽 반사(잔향)를 새 반사파로 착각해 거리가 5cm↔300cm로 미친 듯이 튑니다.',
    beginnerAnalogy:
      '동굴에서 "야호!" 외치고 메아리가 다 가라앉기 전에 또 외치면 어느 메아리인지 헷갈리는 것과 똑같아 최소 60ms 쉬어야 합니다.',
    learningGoals: [
      'HC-SR04의 TRIG 10μs → 40kHz 8주기 → ECHO HIGH(t/58 cm) 타이밍도를 해독한다.',
      '5V ECHO를 3.3V ESP32 핀에 연결하기 위한 분압 회로와 38ms 타임아웃 처리를 구현한다.',
      '초음파(넓은 빔, 저가) vs 적외선(색상 민감) vs ToF 레이저(VL53L0X) vs 2D LiDAR 특성을 비교한다.',
    ],
    linkedLabModuleId: 'ultrasonic',
  },
  {
    day: 27,
    phaseId: 'phase4',
    title: '엔코더(Encoder) & 바퀴 오도메트리(Odometry)',
    subtitle: '직교 엔코더(A/B상) 4체배 디코딩 · RPM 측정 · 휠 슬립 누적 오차',
    durationMin: 30,
    skillDomains: ['electronics', 'control'],
    skillTags: ['Sensors', '엔코더', '오도메트리'],
    failFirstHook:
      '엔코더 1채널만 읽으면 바퀴가 앞으로 가는지 뒤로 굴러가는지 모르고, 10m만 달려도 바퀴 헛돌기 때문에 위치 오차가 눈덩이처럼 커집니다.',
    beginnerAnalogy:
      '두 개의 눈(A상, B상)이 90도 어긋나게 줄무늬를 보면 "어느 쪽이 먼저 깜빡였지?"를 통해 정회전/역회전 방향까지 알아내는 원리입니다.',
    learningGoals: [
      '광학/자기식 직교 엔코더의 A/B상 위상차로 회전 방향과 4체배 펄스를 디코딩한다.',
      '좌/우 바퀴 펄스 변화량(Δticks)으로 로봇의 이동 좌표 (x, y, θ)를 적분(오도메트리)한다.',
      '오도메트리가 시간이 지날수록 드리프트(누적 오차)가 생기는 물리적 원인을 이해한다.',
    ],
    linkedLabModuleId: 'day27_encoder_odom',
  },
  {
    day: 28,
    phaseId: 'phase4',
    title: '관성 측정 장치 IMU (MPU-6000/6050) 해부',
    subtitle: '가속도계(중력 벡터·진동 취약) vs 자이로(각속도 적분·드리프트) + 지자기',
    durationMin: 30,
    skillDomains: ['electronics'],
    skillTags: ['Sensors', 'IMU', '가속도/자이로'],
    failFirstHook:
      '자이로 센서 값만 적분해 로봇 기울기를 구하면, 가만히 책상에 뒀는데도 1분 뒤 기울기가 15도씩 혼자 돌아가 있습니다.',
    beginnerAnalogy:
      '자이로는 눈 감고 회전의자를 타는 감각(순간 변화는 예민하지만 오래 지나면 방향을 잃음), 가속도계는 추를 매단 수평계(평균은 정확하지만 흔들림에 약함)입니다.',
    learningGoals: [
      'MPU-6000/6050 데이터시트에서 감도(LSB/g, LSB/°/s)와 I2C/SPI 레지스터 구조를 이해한다.',
      '가속도계(고주파 진동 노이즈)와 자이로스코프(바이어스 드리프트)의 상호 보완적 특성을 설명한다.',
      '실물 보드 기동 직후 1~2초 정지 상태에서 자이로 영점 캘리브레이션(Offset 제거)을 수행한다.',
    ],
    linkedLabModuleId: 'day28_imu',
  },
  {
    day: 29,
    phaseId: 'phase4',
    title: '센서 퓨전 1단계: 신호 필터링 & 상보 필터',
    subtitle: '이동 평균 vs 1차 LPF(EMA) · 가속도+자이로 상보 필터(Complementary Filter)',
    durationMin: 30,
    skillDomains: ['ai_perception', 'control'],
    skillTags: ['Sensor Fusion', 'LPF 필터', '상보 필터'],
    failFirstHook:
      '로터 진동이 심한 로봇에서 원시 가속도 값으로 균형을 잡으려 하면 노이즈 때문에 모터가 고주파로 비명을 지르며 넘어집니다.',
    beginnerAnalogy:
      '상보 필터는 "98%는 재빠른 자이로를 믿고, 2%씩만 믿음직한 가속도계 중력 방향으로 슬쩍 나침반을 교정하는" 가장 가벼운 센서 융합 공식입니다.',
    learningGoals: [
      '1차 저역통과 필터 y[k] = α·y[k-1] + (1-α)·x[k]의 차단 주파수와 지연(Phase Lag) 트레이드오프를 이해한다.',
      '상보 필터(θ = 0.98·(θ + ω·dt) + 0.02·θ_acc)를 구현해 드리프트와 진동을 동시에 잡는다.',
      'IMU + 엔코더 회전각을 비교해 바퀴 슬립을 감지하는 센서 퓨전 원리를 익힌다.',
    ],
    linkedLabModuleId: 'day29_sensor_fusion',
  },
  {
    day: 30,
    phaseId: 'phase4',
    title: '디지털 PID 제어 기초: P · I · D의 물리적 직관',
    subtitle: '개루프 vs 폐루프 · 가상 스프링(P) · 정상오차 제거(I) · 댐퍼(D) · 중력 보상',
    durationMin: 30,
    skillDomains: ['control'],
    skillTags: ['PID Control', '이산화', '폐루프 제어'],
    failFirstHook:
      'P 게인만 무작정 키우면 목표 지점을 지나쳐 좌우로 계속 진동(오버슈트/발산)하고, 너무 낮추면 목표에 못 미친 채 멈춰 버립니다.',
    beginnerAnalogy:
      '목표 위치까지 당기는 용수철이 P, 끝까지 안 닿는 끈기를 보태는 힘이 I, 너무 빨리 돌진해 벽을 치지 않게 잡아주는 브레이크(충격흡수기)가 D입니다.',
    learningGoals: [
      '오차 e[k] = setpoint - measured 기반 폐루프 피드백 구조를 도식화한다.',
      '위치형(Positional)과 증분형(Velocity) 이산 PID 방정식을 구현한다.',
      '로봇 팔처럼 중력이 작용할 때 필요한 중력 보상(Feedforward + PID) 개념을 이해한다.',
    ],
    linkedLabModuleId: 'pid',
  },
  {
    day: 31,
    phaseId: 'phase4',
    title: '실전 PID 트러블슈팅 & 캐스케이드 제어',
    subtitle: '안티 와인드업(Anti-Windup) · 미분항 LPF · 속도+위치 이중 캐스케이드 루프',
    durationMin: 35,
    skillDomains: ['control'],
    skillTags: ['PID Control', 'Anti-Windup', '캐스케이드 제어'],
    failFirstHook:
      '로봇 팔을 손으로 3초간 잡고 놓으면, 그 사이 적분항(I)이 폭발적으로 누적(Windup)되어 놓는 순간 반대편 끝까지 폭주합니다.',
    beginnerAnalogy:
      '바퀴 로봇은 "위치 제어기"가 "목표 속도"를 정해주고, 안쪽의 빠른 "속도 제어기"가 바퀴 RPM을 맞추는 2단 기어 구조(캐스케이드)로 훨씬 안정적으로 움직입니다.',
    learningGoals: [
      '구동기 포화 시 적분 누적을 막는 Anti-Windup 클램핑/역계산을 구현한다.',
      '센서 양자화 노이즈가 미분항에서 증폭되는 문제(Derivative Kick/Noise)를 LPF로 해결한다.',
      '스텝 응답 그래프(오버슈트·정착시간·정상오차)를 보고 Kp, Ki, Kd를 체계적으로 튜닝한다.',
    ],
    linkedLabModuleId: 'day31_pid_advanced',
  },
  {
    day: 32,
    phaseId: 'phase4',
    title: '궤적 생성 & 추종 (Trajectory Tracking)',
    subtitle: '사다리꼴 속도 프로파일 · 3차 다항식 보간 · Pure Pursuit 경로 추종',
    durationMin: 30,
    skillDomains: ['control'],
    skillTags: ['Trajectory Tracking', '속도 프로파일', 'Pure Pursuit'],
    failFirstHook:
      '로봇에게 갑자기 "0도에서 180도로 순간이동해!"(Step Input)를 주면 기어에 엄청난 충격이 가고 바퀴가 미끄러집니다.',
    beginnerAnalogy:
      '엘리베이터처럼 부드럽게 가속했다가 등속으로 가고 부드럽게 감속해 멈추는 시간표(사다리꼴 프로파일)를 짜주고, 로봇이 당근(전방 주시점)을 쫓아가듯 따라가게 만드는 기법입니다.',
    learningGoals: [
      '최대 속도·가속도 제약 하에서 사다리꼴(Trapezoidal) 속도 프로파일을 생성한다.',
      '시작·끝 속도가 0인 3차 다항식(Cubic Spline) 위치 보간식을 계산한다.',
      '차동 구동 로봇이 웨이포인트 경로를 따라가는 Pure Pursuit 전방 주시 거리(Lookahead) 효과를 이해한다.',
    ],
    linkedLabModuleId: 'day32_trajectory',
  },
  {
    day: 33,
    phaseId: 'phase4',
    title: '상태 추정 2단계: 칼만 필터(Kalman Filter) & EKF',
    subtitle: '가우시안 불확실성 · 예측(Predict) + 보정(Update) · 칼만 이득 K · 비선형 EKF',
    durationMin: 35,
    skillDomains: ['control', 'ai_perception'],
    skillTags: ['State Estimation', 'Sensor Fusion', '칼만/EKF'],
    failFirstHook:
      '상보 필터는 가중치를 사람이 감으로 찍어야 하지만, 센서 상태나 속도가 변하면 고정 가중치로는 최적의 정밀도를 낼 수 없습니다.',
    beginnerAnalogy:
      '칼만 필터는 "내 이동 모델의 예측(불확실성 포함)"과 "센서 측정값(노이즈 포함)" 두 종의 종을 겹쳐서, 매 순간 더 믿을 만한 쪽에 자동으로 더 큰 가중치(칼만 이득)를 주는 수학적 중재자입니다.',
    learningGoals: [
      '상태 평균과 분산(불확실성)이 예측 단계에서 커지고, 관측 보정 단계에서 줄어드는 과정을 이해한다.',
      '칼만 이득(Kalman Gain)이 프로세스 노이즈 Q와 측정 노이즈 R의 비율에 따라 어떻게 변하는지 계산한다.',
      '비선형 로봇 운동 모델(cos θ, sin θ)에 선형화(야코비안)를 적용하는 확장 칼만 필터(EKF) 원리를 익힌다.',
    ],
    linkedLabModuleId: 'day33_kalman',
  },
  {
    day: 34,
    phaseId: 'phase4',
    title: '[Phase 4 미니 프로젝트] 오도메트리+IMU 퓨전 직진 보정 로봇',
    subtitle: '좌/우 모터 편차 극복 · 엔코더 속도 PID + IMU 요(Yaw) 각도 보정 루프',
    durationMin: 40,
    isMiniProject: true,
    skillDomains: ['control', 'ai_perception'],
    skillTags: ['미니 프로젝트', 'PID + 퓨전', '직진 제어'],
    failFirstHook:
      '똑같은 모터를 두 개 달아도 왼쪽·오른쪽 마찰이 달라, 그냥 똑같은 PWM을 주면 3m도 못 가고 크게 휘어집니다.',
    beginnerAnalogy:
      'Phase 4의 센서·필터·PID를 모두 합쳐, 바닥이 미끄럽거나 양쪽 바퀴 힘이 달라도 자처럼 반듯하게 달리는 자율 주행 기초를 완성합니다.',
    learningGoals: [
      '좌/우 엔코더 속도 PID 루프를 각각 닫아 목표 RPM을 유지한다.',
      'IMU 자이로+가속도 필터로 구한 헤딩 각도 오차를 이용해 바퀴 속도 차이를 실시간 보정한다.',
      '목표 거리 2m 지점 앞에서 사다리꼴 감속 프로파일로 부드럽게 정지한다.',
    ],
    linkedLabModuleId: 'day34_fusion_project',
  },

  // Phase 5 (Days 35..42)
  {
    day: 35,
    phaseId: 'phase5',
    title: '로보틱스 Python & PC↔ESP32 시리얼 브릿지',
    subtitle: 'C++ 하위 실시간 제어 vs Python 상위 지능 · 구조체 패킷과 CRC 체크섬',
    durationMin: 30,
    skillDomains: ['programming'],
    skillTags: ['Python', 'NumPy', '시리얼 프로토콜'],
    failFirstHook:
      'ESP32에 카메라 AI나 복잡한 지도를 올리려다 메모리가 터지고, 시리얼 통신 도중 1바이트만 깨져도 로봇이 엉뚱한 숫자를 읽어 폭주합니다.',
    beginnerAnalogy:
      'ESP32는 반사신경(척수: 모터·센서 제어), Python이 도는 라즈베리파이/PC는 대뇌(판단·비전·지도)로 역할을 나누고 우편 봉투(헤더+CRC)로 대화합니다.',
    learningGoals: [
      'Python과 NumPy로 변환 행렬과 벡터 연산을 빠르고 간결하게 작성한다.',
      'PC(Python)와 ESP32(C++) 간 바이너리/JSON 패킷 통신의 장단점과 프레임 동기화(Header + Checksum)를 설계한다.',
      '시리얼 통신 지연이 제어 안정성에 미치는 영향을 분리 아키텍처로 차단한다.',
    ],
    linkedLabModuleId: 'day35_python_bridge',
  },
  {
    day: 36,
    phaseId: 'phase5',
    title: '경로 계획 (Global & Local Path Planning)',
    subtitle: 'C-Space 장애물 팽창 · Dijkstra & A* · 다관절 RRT · 동적 회피 DWA',
    durationMin: 35,
    skillDomains: ['control'],
    skillTags: ['Trajectory Tracking', 'A* / RRT', 'DWA 회피'],
    failFirstHook:
      '로봇을 점으로 생각하고 벽 바로 옆으로 경로를 짜면, 실제 로봇의 반지름 때문에 모서리를 돌다 매번 부딪힙니다.',
    beginnerAnalogy:
      'C-Space는 로봇 크기만큼 벽을 두껍게 팽창시켜 놓고 내 몸을 점으로 줄여 길을 찾는 지혜이고, A*는 내비게이션(전역 경로), DWA는 갑자기 튀어나온 사람을 피하는 급핸들(지역 회피)입니다.',
    learningGoals: [
      '로봇 반지름만큼 장애물을 부풀리는 Configuration Space(C-Space) 개념을 적용한다.',
      '비용 g(n) + 휴리스틱 h(n)을 사용하는 A* 그래프 탐색으로 최단 경로를 찾는다.',
      '고차원 로봇 팔에 쓰는 샘플링 기반 RRT와 실시간 속도 공간 회피 알고리즘 DWA를 구별한다.',
    ],
    linkedLabModuleId: 'day36_path_planning',
  },
  {
    day: 37,
    phaseId: 'phase5',
    title: 'ROS 2 핵심 아키텍처 & 통신 모델',
    subtitle: 'Node · Topic(Pub/Sub) · Service · Action · QoS · colcon 워크스페이스',
    durationMin: 35,
    skillDomains: ['programming'],
    skillTags: ['ROS 2', 'Topic/Service', '리눅스 CLI'],
    failFirstHook:
      '모든 기능을 거대한 단일 main() 파일에 몰아넣으면 센서 하나 바꿀 때마다 전체 코드를 뜯어고쳐야 하고 남이 만든 드라이버를 쓸 수 없습니다.',
    beginnerAnalogy:
      'ROS 2는 부품들이 각자 독립 프로그램(Node)으로 돌면서 라디오 방송(Topic)으로 센서 값을 뿌리고, 필요한 것만 구독해 조립하는 레고 신경망입니다.',
    learningGoals: [
      'Topic(비동기 스트림), Service(요청/응답), Action(장기 목표+피드백+취소)의 용도를 구분한다.',
      '센서 데이터용 Best-Effort QoS와 중요 명령용 Reliable QoS 설정 차이를 이해한다.',
      'ROS 2 패키지 생성, Python/C++ 노드 작성 및 colcon build 워크플로우를 익힌다.',
    ],
    linkedLabModuleId: 'day37_ros2_arch',
  },
  {
    day: 38,
    phaseId: 'phase5',
    title: 'ROS 2 TF2 좌표 트리 & URDF / 시뮬레이터',
    subtitle: 'map → odom → base_link → laser_frame · URDF 로봇 모델링 · Gazebo/Webots',
    durationMin: 30,
    skillDomains: ['programming', 'mechanical'],
    skillTags: ['ROS 2', 'TF2 좌표 트리', 'URDF/Gazebo'],
    failFirstHook:
      '카메라가 로봇 앞쪽 15cm 위에 달려 있다는 걸 좌표계로 연결하지 않으면, 로봇이 "내 눈앞 30cm 장애물" 위치를 엉뚱한 곳에 찍습니다.',
    beginnerAnalogy:
      'TF2는 "방(map) 안의 주행 기준(odom) 안의 로봇 몸통(base_link) 위 카메라(camera_link)"가 서로 어디에 있는지 실시간으로 통역해 주는 좌표 가계도입니다.',
    learningGoals: [
      'ROS 2 표준 REP-105 좌표계 계층(map → odom → base_link)의 의미를 설명한다.',
      'URDF XML로 링크(Link)·조인트(Joint)·충돌체·관성 정보를 정의해 시뮬레이터에 띄운다.',
      '정적 변환(Static Transform)과 동적 변환(odom→base_link) 브로드캐스트 차이를 이해한다.',
    ],
    linkedLabModuleId: 'day38_tf2_urdf',
  },
  {
    day: 39,
    phaseId: 'phase5',
    title: '로보틱스 컴퓨터 비전 (Computer Vision) 기초',
    subtitle: '핀홀 카메라 모델 & 캘리브레이션 · HSV 색추적 · ArUco 마커 3D 자세 추정',
    durationMin: 35,
    skillDomains: ['ai_perception', 'programming'],
    skillTags: ['Computer Vision', 'OpenCV', 'ArUco 3D'],
    failFirstHook:
      'RGB 기준으로 빨간 공을 찾도록 코딩하면 조명 그림자만 져도 전혀 못 찾고, 렌즈 왜곡을 안 잡으면 거리 계산이 다 틀립니다.',
    beginnerAnalogy:
      'HSV 색공간은 조명이 어두워져도 "빨강이라는 색상(Hue)"을 따로 떼어내 볼 수 있는 선글라스이고, ArUco 마커는 로봇이 크기와 기울기를 한눈에 재는 QR 자(Ruler)입니다.',
    learningGoals: [
      '카메라 내부 파라미터 행렬(초점거리 fx, fy, 주점 cx, cy)과 렌즈 왜곡 보정의 역할을 이해한다.',
      'RGB에서 HSV로 변환해 조명 변화에 강인한 색상 마스킹 및 윤곽선(Contour) 중심점을 구한다.',
      'ArUco 마커 코너 검출(PnP)로 카메라 기준 물체의 3D 위치 (x, y, z)를 역산한다.',
    ],
    linkedLabModuleId: 'day39_vision',
  },
  {
    day: 40,
    phaseId: 'phase5',
    title: '확률적 위치 추정 (MCL / 파티클 필터)',
    subtitle: '파티클 살포 → 이동 예측 → LiDAR 관측 가중치 → 리샘플링 · 납치 로봇 문제',
    durationMin: 35,
    skillDomains: ['control', 'ai_perception'],
    skillTags: ['State Estimation', 'SLAM', '파티클 필터'],
    failFirstHook:
      '로봇을 켜자마자 "내가 지도의 어느 방에 있는지" 모르는 상태에서 EKF만 돌리면 엉뚱한 벽에 부딪히며 위치가 발산합니다.',
    beginnerAnalogy:
      '"내가 건물 어딘가에 눈 감고 떨어졌다"고 할 때, 지도 위에 가상의 분신 1,000명(파티클)을 뿌리고 벽 거리 측정과 일치하는 분신만 살아남게 해 내 위치를 찾는 게임입니다.',
    learningGoals: [
      '가우시안 단일 가설(EKF)과 다봉 확률 분포를 표현하는 파티클 필터(MCL)의 차이를 설명한다.',
      '모션 업데이트 → 센서 우도(Likelihood) 가중치 계산 → 중요도 리샘플링 3단계를 구현한다.',
      'AMCL에서 로봇을 들고 딴 곳에 놓는(Kidnapped Robot) 상황 복구 전략을 이해한다.',
    ],
    linkedLabModuleId: 'day40_mcl_particle',
  },
  {
    day: 41,
    phaseId: 'phase5',
    title: 'SLAM: 동시적 위치 추정 및 지도 작성',
    subtitle: '점유 격자 지도(Log-Odds) · 스캔 매칭(ICP) · 루프 클로저 & Pose-Graph SLAM',
    durationMin: 35,
    skillDomains: ['ai_perception'],
    skillTags: ['SLAM', 'Occupancy Grid', '루프 클로저'],
    failFirstHook:
      '복도를 한 바퀴 돌아 출발점으로 돌아왔는데 오도메트리 오차가 쌓여 지도 상의 복도가 두 겹으로 어긋나 버립니다.',
    beginnerAnalogy:
      '눈을 감고 방을 돌며 지도를 그리다 출발점의 익숙한 소파를 다시 만났을 때(루프 클로저), "아! 내가 제자리로 왔구나" 하고 전체 지도의 찌그러짐을 한 번에 펴주는 기술입니다.',
    learningGoals: [
      '베이즈 로그 오즈(Log-Odds) 갱신으로 LiDAR 빔이 지나간 빈 공간과 맞은 벽을 격자 지도에 채운다.',
      '연속된 두 스캔을 겹쳐 정렬하는 ICP(Iterative Closest Point) 스캔 매칭 원리를 이해한다.',
      '루프 클로저(Loop Closure)가 누적 오차를 제거하고 일관된 지도를 완성하는 과정을 설명한다.',
    ],
    linkedLabModuleId: 'day41_slam_grid',
  },
  {
    day: 42,
    phaseId: 'phase5',
    title: '[Phase 5 미니 프로젝트] 미로 탐색 A* + 파티클 필터 자율주행',
    subtitle: '미지 격자 지도 탐험 → A* 전역 경로 → DWA 장애물 회피 목표 도달',
    durationMin: 40,
    isMiniProject: true,
    skillDomains: ['ai_perception', 'control', 'programming'],
    skillTags: ['미니 프로젝트', 'SLAM + A*', '자율주행'],
    failFirstHook:
      '전역 경로(A*)만 따르고 센서 기반 지역 회피(DWA)를 안 켜면, 지도에 없던 새로운 의자나 사람과 그대로 충돌합니다.',
    beginnerAnalogy:
      '가상 미로 속에서 라이다로 벽을 그려가며 내 위치를 추정하고, 최적 경로를 실시간으로 다시 짜며 탈출하는 자율주행 로버 시뮬레이션입니다.',
    learningGoals: [
      '2D 거리 센서 스캔 데이터로 점유 격자 지도를 업데이트한다.',
      '팽창된 C-Space 지도 위에서 A* 경로를 생성하고 추종한다.',
      '동적 장애물 출현 시 경로 재계획 또는 지역 회피로 충돌 없이 목표에 도달한다.',
    ],
    linkedLabModuleId: 'day42_maze_project',
  },

  // Phase 6 (Days 43..45)
  {
    day: 43,
    phaseId: 'phase6',
    title: '브레드보드에서 나만의 기판으로 (PCB Design 입문)',
    subtitle: 'KiCad 회로도→풋프린트→전류별 트레이스 폭 · 디커플링 커패시터 · 거버 발주',
    durationMin: 35,
    skillDomains: ['electronics'],
    skillTags: ['PCB Design', 'KiCad', '전원/EMI'],
    failFirstHook:
      '빵판에서 잘 되던 로봇을 주행시켰더니 진동 때문에 점퍼선이 빠져 불이 꺼지거나, PCB 전류 선폭을 너무 얇게 그려 구리 패턴이 타버립니다.',
    beginnerAnalogy:
      '빵판이 실과 테이프로 임시로 고정한 옷이라면, PCB는 치수를 재고 다림질해 공장에서 찍어내는 튼튼한 맞춤형 정장입니다.',
    learningGoals: [
      '회로도(Schematic) 기호와 실제 부품 납땜 패드(Footprint)를 매칭하는 흐름을 이해한다.',
      '모터 대용량 전류선 트레이스 폭 계산과 IC 전원 핀 바로 옆 0.1μF 디커플링 커패시터 배치 원칙을 익힌다.',
      '그라운드 플레인(GND Pour), 실크스크린 표기, DRC 검사 후 Gerber 파일로 PCB 발주하는 절차를 확인한다.',
    ],
    linkedLabModuleId: 'day43_pcb_design',
  },
  {
    day: 44,
    phaseId: 'phase6',
    title: '실전 로봇 디버깅 마스터 클래스',
    subtitle: '먹통 로봇 5분 격리 진단: 전원 → 클럭/부팅 → 통신 → 센서 → 구동기 & EMI',
    durationMin: 30,
    skillDomains: ['embedded', 'electronics'],
    skillTags: ['격리 디버깅', 'EMI 대책', '실전 트러블슈팅'],
    failFirstHook:
      '모든 부품과 코드를 한꺼번에 꽂고 전원을 켰는데 아무 반응이 없으면, 어디가 고장인지 몰라 며칠을 헤맵니다.',
    beginnerAnalogy:
      '의사가 혈압→호흡→반사신경 순으로 진찰하듯, 1) 전압 체크 → 2) 시리얼 Hello World → 3) I2C 스캔 → 4) 모터 단독 테스트 순으로 쪼개 범인을 잡는 기술입니다.',
    learningGoals: [
      '전원 레일 이상·부팅 스트래핑 충돌·공통 GND 누락을 5분 안에 분리 진단한다.',
      '브러시 DC 모터의 노이즈(EMI)가 센서 I2C 통신을 끊을 때 0.1μF 세라믹 커패시터·연선(Twisted Pair)으로 잡는 법을 안다.',
      '시리얼 로그와 상태 LED만으로 현장 디버깅하는 체크리스트를 체득한다.',
    ],
    linkedLabModuleId: 'day44_debugging',
  },
  {
    day: 45,
    phaseId: 'phase6',
    title: '[최종 졸업 캡스톤] 자율 픽앤플레이스 모바일 매니퓰레이터',
    subtitle: '전원/ESP32 배선 + 차동 오도메트리/EKF + PID + ArUco 비전 + 2축 IK 통합',
    durationMin: 45,
    isMiniProject: true,
    skillDomains: [
      'mechanical',
      'electronics',
      'embedded',
      'programming',
      'control',
      'ai_perception',
    ],
    skillTags: ['졸업 캡스톤', '풀스택 통합', '모바일 매니퓰레이터'],
    failFirstHook:
      '각 모듈은 따로 잘 돌아가지만, 전체를 합칠 때 전원 예산 부족·좌표계(TF2) 불일치·제어 주기 지연이 겹치며 마지막 순간에 무너지기 쉽습니다.',
    beginnerAnalogy:
      '45일 동안 배운 모든 퍼즐(전기, 보드, 모터, 기구학, 제어, 비전, ROS 2/SLAM)을 한 대의 로봇에 모두 조립해 "물체를 찾아 달려가 집어 올리는" 최종 졸업 시험입니다.',
    learningGoals: [
      '배터리→로직/모터 분리 전원 및 ESP32 충돌 없는 풀 핀맵을 완성한다.',
      'EKF+차동구동 PID 주행과 A*/DWA 회피로 ArUco 목표 앞 작업공간에 정밀 정차한다.',
      '카메라 좌표를 로봇 팔 베이스 좌표로 TF 변환한 뒤 IK와 토크 안전 조건을 통과시켜 파지한다.',
    ],
    linkedLabModuleId: 'day45_capstone',
  },
];
