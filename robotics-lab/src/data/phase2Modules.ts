import { LabModule } from '../types/lab';

export const PHASE2_MODULES: LabModule[] = [
  {
    id: 'day08_board',
    order: 8,
    dayLabel: 'Day 08',
    phaseLabel: 'Phase 2 · ESP32/모터',
    title: '실제 ESP32 보드 해부 & 펌웨어 업로드 원리',
    shortTitle: 'D08 · ESP32 해부',
    subtitle: 'ESP-WROOM-32 · CP2102 USB-UART · AMS1117 · EN/BOOT 버튼',
    badge: 'MCU 아키텍처',
    milestoneTag: 'Day 08 보드 해부 랩',
    failFirstHook:
      '보드 옆면에 적힌 D13, D21 같은 실크스크린 표기만 보고 헷갈리거나, "Connecting........___" 업로드 타임아웃이 뜰 때 BOOT 버튼의 역할을 몰라 보드가 고장 난 줄 알고 포기합니다.',
    beginnerAnalogy:
      'ESP32 개발 보드는 작은 컴퓨터 본체입니다. 은색 덮개(ESP-WROOM-32)가 CPU+Wi-Fi 뇌이고, 검은 사각 칩(CP2102)이 USB를 통역해 주며, AMS1117이 5V를 3.3V로 낮춰주는 변압기입니다.',
    overviewSummary:
      '실물 ESP32 DevKit V1 보드를 손에 들었을 때 위 부품들이 각각 무엇인지, 왜 버튼이 두 개(EN, BOOT)나 있는지, 코드의 GPIO 번호와 보드 글자를 어떻게 대응시키는지 직접 눌러보며 익힙니다.',
    guidedMissions: [
      {
        id: 'd08-parts',
        title: '보드 해부도에서 CP2102(USB-UART)와 AMS1117(3.3V) 눌러 역할 확인하기',
        hint: '기판 위 주요 부품 또는 직접 실습 탭의 부품 선택 버튼을 눌러보세요.',
      },
      {
        id: 'd08-boot',
        title: '업로드(Flashing) 모드로 전환해 GPIO 0과 BOOT 버튼 동작 확인하기',
        hint: '직접 실습 탭에서 "부팅/업로드 모드"를 펌웨어 업로드(BOOT)로 바꿔보세요.',
      },
      {
        id: 'd08-code',
        title: '코드 랩에서 보드 핀 번호 vs 코드 GPIO 매핑 버그 수정하기',
        hint: '코드 랩 탭 하단의 디버깅 챌린지를 풀어보세요.',
      },
    ],
    highlights: [
      {
        title: 'CP2102 / CH340 USB-to-UART 브릿지 칩',
        body: 'PC의 USB 신호와 ESP32의 UART0(GPIO 1 TX0 / GPIO 3 RX0) 사이를 통역합니다. PC에서 포트가 안 잡히면 대부분 이 칩 드라이버 미설치나 "충전 전용 USB 케이블" 사용 때문입니다.',
        tone: 'cyan',
      },
      {
        title: 'EN (Reset) 버튼 vs BOOT (GPIO 0) 버튼',
        body: 'EN을 누르면 칩이 재부팅됩니다. 업로드가 안 될 때 BOOT 버튼을 누른 상태(GPIO 0 = LOW)에서 EN을 눌렀다 떼면 펌웨어 다운로드(Bootloader) 모드로 강제 진입합니다.',
        tone: 'amber',
      },
      {
        title: 'VIN(5V) vs 3V3 핀 & 실크스크린(D13 = GPIO 13)',
        body: 'USB 5V나 외부 5V는 VIN으로 들어가 온보드 AMS1117을 거쳐 3.3V가 됩니다. 보드에 D13, D2처럼 D가 붙어 있어도 Arduino/ESP32 코드에서는 숫자 13, 2 그대로 씁니다.',
        tone: 'emerald',
      },
    ],
    formulas: [
      {
        title: 'USB 5V 입력 시 온보드 AMS1117 3.3V 레귤레이터 손실',
        latex: String.raw`P_{\text{AMS1117}} = (5.0\text{ V} - 3.3\text{ V}) \cdot I_{\text{3V3 load}}`,
        description:
          'Wi-Fi 피크 전류(~250mA)까지는 온보드 LDO가 감당하지만, 서보·모터까지 3V3 핀에서 뽑으면 레귤레이터가 과열·차단됩니다.',
      },
    ],
    specs: [
      { label: 'CPU 아키텍처', value: '듀얼코어 240 MHz', note: 'Xtensa LX6 + 520KB SRAM', tone: 'cyan' },
      { label: 'USB 브릿지 칩', value: 'CP2102 / CH340', note: '데이터 선 있는 USB 케이블 필수', tone: 'emerald' },
      { label: '부트로더 진입', value: 'GPIO 0 = LOW', note: '업로드 시 BOOT 버튼 연결', tone: 'amber' },
      { label: '3V3 레귤레이터', value: 'AMS1117-3.3', note: '서보·모터 직결 금지', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: 'PC 연결 (데이터 케이블)',
        pin: 'Micro-USB / USB-C 포트',
        detail: '포트가 아예 안 뜨면 전원선만 있는 충전 전용 케이블이 아닌지 먼저 교체해 보세요.',
      },
      {
        signal: '내장 LED 테스트',
        pin: 'GPIO 2 (파란색 LED)',
        detail: '대부분의 DevKit V1 보드는 GPIO 2에 파란색 상태 LED가 이미 납땜되어 있어 첫 테스트에 좋습니다.',
      },
    ],
    codeTitle: 'day08_board_blink_serial.ino',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 08: 실물 ESP32 보드 첫 생존 확인 (내장 LED + 시리얼 모니터)
// 보드에 D2라고 적혀 있어도 코드에서는 정수 2 (GPIO 2)를 씁니다!

const int ONBOARD_LED = 2;

void setup() {
  Serial.begin(115200); // 시리얼 모니터 우측 하단 속도(Baud)도 115200으로 맞추세요!
  pinMode(ONBOARD_LED, OUTPUT);
  Serial.println("ESP32 Booted! Dual Core Ready.");
}

void loop() {
  digitalWrite(ONBOARD_LED, HIGH);
  Serial.println("[LED] ON");
  delay(500);
  digitalWrite(ONBOARD_LED, LOW);
  Serial.println("[LED] OFF");
  delay(500);
}`,
    codeChallenge: {
      prompt: '시리얼 모니터를 열었는데 외계어 깨진 글자()만 쏟아집니다. setup()의 통신 속도 설정 문제를 찾아 고쳐보세요!',
      buggyLine: 'Serial.begin(9600); // PC 모니터는 115200인데 코드는 9600으로 맞춤!',
      options: [
        'Serial.begin(115200);',
        'Serial.begin(1);',
        'pinMode(1, INPUT);',
      ],
      correctIndex: 0,
      explanation:
        'ESP32 부트로더와 기본 시리얼 모니터는 115200 bps를 표준으로 씁니다. 보드와 PC 모니터의 Baud Rate가 다르면 글자가 깨집니다.',
    },
    quizzes: [
      {
        id: 'P2D8-1',
        question: 'ESP32 보드를 PC에 꽂았는데 장치 관리자/포트 목록에 아무 COM 포트도 잡히지 않을 때 가장 먼저 의심해야 할 2가지는?',
        options: [
          '데이터 선이 빠진 "충전 전용 USB 케이블" 사용 또는 CP2102/CH340 드라이버 미설치',
          '방 안의 조명이 너무 어두움',
          '저항값이 220Ω이 아님',
          'Wi-Fi 비밀번호 오류',
        ],
        correctIndex: 0,
        explanation:
          '스마트폰 충전용 저가 케이블에는 D+/D- 데이터 선이 없는 경우가 많습니다. 데이터 케이블 교체와 USB-UART 드라이버 확인이 1순위입니다.',
      },
      {
        id: 'P2D8-2',
        question: '아두이노 IDE에서 펌웨어 업로드 중 "Connecting........_____" 메시지가 뜨며 실패할 때 눌러야 하는 버튼과 그 핀 번호는?',
        options: [
          'BOOT 버튼 (GPIO 0을 LOW로 당겨 다운로드 모드 진입)',
          'GPIO 34 버튼',
          '전원 LED 직접 누르기',
          'GND와 VIN을 점퍼선으로 연결하기',
        ],
        correctIndex: 0,
        explanation:
          '업로드 시 PC가 보드를 리셋할 때 BOOT 버튼(GPIO 0)이 LOW로 잡혀야 칩이 펌웨어 다운로드 부트로더 모드로 진입합니다.',
      },
      {
        id: 'P2D8-3',
        question: 'ESP32 DevKit V1 보드에 탑재된 AMS1117 칩의 역할은?',
        options: [
          'USB 5V 입력 전압을 ESP32가 쓰는 3.3V로 낮춰주는 선형 전압 레귤레이터',
          '모터 회전 속도를 측정하는 엔코더',
          'Wi-Fi 안테나 신호 증폭기',
          '초음파 발신기',
        ],
        correctIndex: 0,
        explanation:
          'AMS1117-3.3은 VIN 또는 USB로 들어온 5V를 3.3V로 강압해 ESP-WROOM-32 모듈에 공급합니다.',
      },
      {
        id: 'P2D8-4',
        question: 'ESP32 보드 핀 옆에 "D13"이라고 인쇄되어 있을 때, C/C++ 코드에서 이 핀을 제어하려면 어떤 번호를 넣어야 할까요?',
        options: ['"D13" 문자열', '정수 13 (GPIO 13)', '정수 113', '정수 31'],
        correctIndex: 1,
        explanation:
          'ESP32 보드 실크스크린의 D13은 Digital GPIO 13번을 뜻하므로 코드에는 정수 13을 그대로 입력합니다.',
      },
      {
        id: 'P2D8-5',
        question: 'Serial.begin(115200)으로 작성했는데 PC 시리얼 모니터에 알아볼 수 없는 깨진 기호만 나올 때 확인해야 할 것은?',
        options: [
          'PC 시리얼 모니터 창의 보드레이트(Baud Rate) 드롭다운이 115200으로 일치하는지 확인한다.',
          '모터를 연결한다.',
          'LED 색상을 파랑으로 바꾼다.',
          '배터리를 9V로 바꾼다.',
        ],
        correctIndex: 0,
        explanation:
          'UART 통신은 송신 측(ESP32)과 수신 측(PC)의 초당 비트 전송 속도(Baud Rate)가 정확히 일치해야 문자가 정상 해독됩니다.',
      },
    ],
  },
  {
    id: 'day10_nonblocking',
    order: 10,
    dayLabel: 'Day 10',
    phaseLabel: 'Phase 2 · ESP32/모터',
    title: '임베디드 C/C++ & 논블로킹 코딩(millis)',
    shortTitle: '논블로킹 C/C++',
    subtitle: 'uint8_t · volatile · delay() 블로킹 함정 vs millis() 멀티태스킹',
    badge: '펌웨어 핵심',
    milestoneTag: 'Day 10 논블로킹 타임라인 랩',
    failFirstHook:
      '초보자가 상태 LED를 1초마다 깜빡이려고 loop()에 delay(1000)을 넣으면, 그 1초 동안 로봇의 눈(센서)과 브레이크가 완전히 얼어붙어 앞 벽에 정면 충돌합니다.',
    beginnerAnalogy:
      'delay(1000)은 라면 물 끓는 1분 동안 아무것도 못 하고 냄비만 멍하니 쳐다보는 것(블로킹)이고, millis()는 손목시계를 흘깃 보며 "아직 1초 안 됐네? 그럼 앞 장애물부터 확인하자" 하고 여러 일을 동시에 처리하는 비결입니다.',
    overviewSummary:
      '로봇은 센서 읽기, 모터 제어, 통신, LED 점멸을 1초에 수십 번 이상 동시에 처리해야 합니다. delay()가 CPU 타임라인을 어떻게 마비시키는지, 그리고 millis() 타임스탬프 비교로 어떻게 안전하게 동시 동작을 구현하는지 시뮬레이터로 비교하세요.',
    guidedMissions: [
      {
        id: 'd10-delay',
        title: 'delay() 블로킹 모드에서 대기 시간을 800ms 이상 올려 벽 충돌 체험하기',
        hint: '실습 탭에서 "delay() 블로킹" 선택 후 delay 시간을 늘려 로버가 벽 앞에서 반응하는지 보세요.',
      },
      {
        id: 'd10-millis',
        title: 'millis() 논블로킹 모드로 전환해 50ms마다 센서 확인하며 안전 정지하기',
        hint: '"millis() 논블로킹"으로 바꾸면 타임라인에 빈틈없이 센서 체크가 실행됩니다.',
      },
      {
        id: 'd10-code',
        title: '코드 랩에서 millis() 타이머 갱신 누락 버그 수정하기',
        hint: '코드 랩 하단의 버그 수정 챌린지를 해결하세요.',
      },
    ],
    highlights: [
      {
        title: 'delay(N) 동안 CPU는 다른 모든 명령을 멈춥니다',
        body: 'delay(1000)을 호출하면 1초 동안 버튼 입력도, 초음파 거리 읽기도, 비상 정지 명령도 전혀 처리하지 못합니다. 실제 로봇 제어 loop()에서는 delay()를 0~수 ms 외에는 절대 쓰지 않습니다.',
        tone: 'rose',
      },
      {
        title: 'millis() 비차단 타이머 패턴 (오버플로우에도 안전한 뺄셈)',
        body: '항상 `if (millis() - prevTime >= interval)` 처럼 "현재 - 과거 >= 간격" 뺄셈 형태로 비교하세요. unsigned long(uint32_t) 변수를 쓰면 약 49.7일 뒤 숫자가 0으로 돌아가도(롤오버) 부호 없는 연산 특성상 오작동하지 않습니다.',
        tone: 'emerald',
      },
      {
        title: '임베디드 자료형: uint8_t, int16_t, volatile',
        body: 'RAM이 제한적인 MCU에서는 크기가 명확한 `uint8_t`(0~255, 1바이트), `int16_t`(-32768~32767)를 선호하며, 인터럽트(ISR)와 메인 루프가 공유하는 변수에는 컴파일러 최적화로 값이 무시되지 않게 `volatile`을 붙입니다.',
        tone: 'cyan',
      },
    ],
    formulas: [
      {
        title: '논블로킹 주기 판별 & 비트 결합 (I2C 16-bit 센서 조립)',
        latex: String.raw`(\text{millis()} - t_{\text{prev}}) \ge \Delta T, \quad \text{value}_{16} = (\text{highByte} \ll 8) \mid \text{lowByte}`,
        description:
          '2바이트 센서 데이터(MSB, LSB)를 시프트(<< 8)와 OR(|) 연산으로 하나의 16비트 정수로 합치는 패턴은 IMU 등에서 매일 쓰입니다.',
      },
    ],
    specs: [
      { label: 'millis() 반환형', value: 'unsigned long', note: '32-bit, 약 49.7일 롤오버', tone: 'cyan' },
      { label: '안전 비교 패턴', value: 'now - prev >= dt', note: '롤오버 안전 뺄셈', tone: 'emerald' },
      { label: 'delay() 한계', value: 'CPU 완전 정지', note: '센서/통신 입력 누락 위험', tone: 'rose' },
      { label: 'ISR 공유 변수', value: 'volatile 필수', note: '컴파일러 캐시 최적화 방지', tone: 'amber' },
    ],
    wiringNotes: [
      {
        signal: '타이밍 디버깅 팁',
        pin: 'GPIO 2 내장 LED + 시리얼 타임스탬프',
        detail: '상태 LED를 millis()로 500ms마다 토글하면 루프가 멈추지 않고 살아있는지(Heartbeat) 눈으로 바로 확인할 수 있습니다.',
      },
    ],
    codeTitle: 'day10_nonblocking_millis.ino',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 10: delay() 없이 LED 깜빡임(500ms)과 센서 확인(50ms)을 동시에 수행
unsigned long prevSensorMs = 0;
unsigned long prevLedMs    = 0;
bool ledState = false;

void loop() {
  unsigned long now = millis(); // 부팅 후 경과 시간(ms)

  // 작업 1: 매 50ms마다 앞 장애물 체크 (전혀 멈추지 않음!)
  if (now - prevSensorMs >= 50) {
    prevSensorMs = now;
    // checkUltrasonicAndStopIfNeeded();
  }

  // 작업 2: 매 500ms마다 상태 LED 깜빡이기
  if (now - prevLedMs >= 500) {
    prevLedMs = now;
    ledState = !ledState;
    digitalWrite(2, ledState);
  }
}`,
    codeChallenge: {
      prompt: '50ms마다 센서를 읽으려는데 첫 50ms가 지난 뒤부터 매 루프마다 멈추지 않고 계속 실행되어 버립니다. 누락된 한 줄을 고르세요!',
      buggyLine: 'if (now - prevSensorMs >= 50) { readSensor(); /* prevSensorMs 갱신 누락! */ }',
      options: [
        'if (now - prevSensorMs >= 50) { prevSensorMs = now; readSensor(); }',
        'if (now - prevSensorMs >= 50) { delay(50); readSensor(); }',
        'if (now + prevSensorMs >= 50) { prevSensorMs = 0; readSensor(); }',
      ],
      correctIndex: 0,
      explanation:
        '작업이 실행될 때마다 반드시 prevSensorMs = now;로 기준 타임스탬프를 갱신해야 다음 50ms 뒤에 다시 실행됩니다.',
    },
    quizzes: [
      {
        id: 'P2D10-1',
        question: '주행 로봇의 loop() 안에서 LED를 1초 켜고 끄기 위해 delay(1000)을 사용했을 때 발생하는 치명적 문제는?',
        options: [
          '1초 동안 초음파 센서 읽기, 비상 정지 버튼, 모터 속도 보정이 모두 멈춰 장애물에 충돌할 수 있다.',
          'LED 수명이 1초로 줄어든다.',
          '배터리 전압이 10V로 올라간다.',
          'ESP32가 자동으로 절전 모드로 들어간다.',
        ],
        correctIndex: 0,
        explanation:
          'delay()는 CPU를 완전히 멈추는 블로킹 함수이므로, 그 시간 동안 들어오는 모든 센서 변화와 긴급 정지 명령을 놓치게 됩니다.',
      },
      {
        id: 'P2D10-2',
        question: 'millis()를 사용할 때 오버플로우(약 49.7일 후 0으로 초기화)에도 오작동하지 않는 안전한 시간 경과 비교식은?',
        options: [
          'if (millis() >= nextTargetTime)',
          'if (millis() - prevTime >= interval) // 부호 없는 정수 뺄셈',
          'if (millis() + prevTime == interval)',
          'if (prevTime - millis() > interval)',
        ],
        correctIndex: 1,
        explanation:
          'unsigned long 뺄셈(now - prev)은 now가 오버플로우로 작은 수가 되어도 2의 보수 순환 연산 덕분에 정확한 경과 시간을 계산해 줍니다.',
      },
      {
        id: 'P2D10-3',
        question: '하드웨어 인터럽트(ISR) 함수 안에서 변경하고 메인 loop()에서 읽어 쓰는 전역 변수 앞에 반드시 붙여야 하는 C/C++ 키워드는?',
        options: ['static', 'volatile', 'const', 'inline'],
        correctIndex: 1,
        explanation:
          'volatile은 "이 변수는 코드 흐름 밖(인터럽트나 하드웨어)에서 언제든 바뀔 수 있으니 CPU 레지스터에 캐시하지 말고 매번 메모리에서 새로 읽어라"라고 컴파일러에 지시합니다.',
      },
      {
        id: 'P2D10-4',
        question: '센서로부터 상위 8비트(highByte = 0x01)와 하위 8비트(lowByte = 0x2C)를 받았을 때 16비트 정수로 합치는 비트 연산식은?',
        options: [
          '(highByte << 8) | lowByte',
          'highByte + lowByte',
          '(highByte >> 8) & lowByte',
          'highByte * lowByte',
        ],
        correctIndex: 0,
        explanation:
          '상위 바이트를 왼쪽으로 8비트 밀어(<< 8) 0x0100을 만든 뒤 하위 바이트 0x2C와 비트 OR(|)하면 0x012C(= 300)가 됩니다.',
      },
      {
        id: 'P2D10-5',
        question: '0~255 범위의 PWM 듀티 사이클 값을 저장할 때 메모리를 가장 아끼며 정확하게 표현하는 표준 정수 자료형은?',
        options: ['uint8_t', 'double', 'int64_t', 'String'],
        correctIndex: 0,
        explanation:
          'uint8_t는 부호 없는 8비트 정수(0~255)로 딱 1바이트만 차지하므로 임베디드 C/C++에서 핀 번호나 8-bit PWM 값에 표준으로 사용합니다.',
      },
    ],
  },
  {
    id: 'day11_fsm',
    order: 11,
    dayLabel: 'Day 11',
    phaseLabel: 'Phase 2 · ESP32/모터',
    title: '유한 상태 머신(FSM)으로 로봇 행동 설계하기',
    shortTitle: 'FSM 상태머신',
    subtitle: 'if/else 스파게티 탈출 · IDLE → PATROL → AVOID → ESTOP 상태 전이',
    badge: '소프트웨어 아키텍처',
    milestoneTag: 'Day 11 FSM 상태 전이 랩',
    failFirstHook:
      '로봇에 "탐색", "장애물 회피", "비상 정지"를 bool 변수(`isMoving`, `isTurning`, `isBlocked`) 여러 개로 짜면, 두 조건이 동시에 참일 때 바퀴 한쪽은 전진하고 한쪽은 정지하는 기괴한 버그가 발생합니다.',
    beginnerAnalogy:
      '신호등은 절대로 초록불과 빨간불이 동시에 켜지지 않습니다. 유한 상태 머신(FSM)도 로봇이 지금 딱 하나의 상태(`PATROL` 또는 `AVOID`)에만 머물게 강제하는 교통 신호등 설계입니다.',
    overviewSummary:
      '로봇 펌웨어가 길어져도 버그 없이 유지보수할 수 있는 핵심 비결은 enum과 switch-case 기반 유한 상태 머신(Finite State Machine)입니다. 각 상태와 전이 이벤트를 직접 클릭해 로봇 동작을 검증하세요.',
    guidedMissions: [
      {
        id: 'd11-patrol',
        title: 'IDLE 상태에서 "시작(Start)" 이벤트를 발생시켜 PATROL 주행 상태로 진입하기',
        hint: '직접 실습 탭 또는 상태 머신 다이어그램의 "시작" 버튼을 눌러보세요.',
      },
      {
        id: 'd11-avoid',
        title: 'PATROL 중 "장애물 감지"를 트리거해 AVOID 회피 상태로 전이하기',
        hint: '장애물 감지 이벤트로 회피 회전 상태 전환을 확인하세요.',
      },
      {
        id: 'd11-estop',
        title: '비상 정지(E-STOP) 상태를 눌러 모든 모터 출력 0으로 차단하기',
        hint: 'E-STOP은 어느 상태에서든 최우선으로 즉시 진입해 모터를 정지시킵니다.',
      },
    ],
    highlights: [
      {
        title: '상호 배타적 단일 상태 (Mutually Exclusive State)',
        body: '로봇은 언제나 `IDLE`, `PATROL`, `AVOID`, `ESTOP` 중 딱 하나만 가집니다. boolean 플래그 5개를 조합할 때 생기는 32가지 꼬인 예외 상태를 원천 차단합니다.',
        tone: 'cyan',
      },
      {
        title: '논블로킹 FSM = switch(state) + millis()',
        body: 'AVOID 상태에서 400ms 동안 제자리 회전을 할 때도 `delay(400)`을 쓰지 않고, AVOID에 들어온 시각(`stateEnteredMs`)을 기록해 400ms 후 PATROL로 복귀합니다.',
        tone: 'emerald',
      },
      {
        title: '최우선 안전 전이 (E-STOP Override)',
        body: '어떤 상태에 있더라도 비상 정지 버튼이나 통신 두절, 배터리 저전압이 감지되면 즉시 `ESTOP`으로 전이시켜 모터를 끕니다.',
        tone: 'rose',
      },
    ],
    formulas: [
      {
        title: '유한 상태 머신 수학적 정의',
        latex: String.raw`S_{k+1} = \delta(S_k, E_k), \quad U_k = \lambda(S_k)`,
        description:
          '다음 상태 S_{k+1}은 현재 상태 S_k와 입력 이벤트 E_k(센서/타이머)에 의해 결정되며, 모터 출력 U_k는 현재 상태에 종속됩니다.',
      },
    ],
    specs: [
      { label: '상태 정의', value: 'enum class State', note: '컴파일 타임 타입 안전', tone: 'cyan' },
      { label: '핵심 분기문', value: 'switch (state)', note: '단일 진입/단일 출력', tone: 'emerald' },
      { label: '회피 지속 시간', value: 'stateEnteredMs', note: 'delay() 없이 시간 측정', tone: 'amber' },
      { label: '비상 전이', value: 'E-STOP 최우선', note: '전 상태에서 즉시 전이', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '비상 정지 (E-STOP) 물리 버튼',
        pin: 'GPIO 32 (INPUT_PULLUP) ↔ 버튼 ↔ GND',
        detail: '소프트웨어 루프 맨 위에서 E-STOP 여부를 먼저 검사한 뒤 switch(state)를 실행합니다.',
      },
    ],
    codeTitle: 'day11_robot_fsm.ino',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 11: enum class + switch-case 기반 논블로킹 로봇 FSM
enum class RobotState { IDLE, PATROL, AVOID, ESTOP };
RobotState state = RobotState::IDLE;
unsigned long avoidStartMs = 0;

void updateFSM(float distCm, bool estopPressed, bool startBtn) {
  if (estopPressed) { state = RobotState::ESTOP; } // 최우선 안전 전이

  switch (state) {
    case RobotState::IDLE:
      setMotors(0, 0);
      if (startBtn) state = RobotState::PATROL;
      break;
    case RobotState::PATROL:
      setMotors(160, 160);
      if (distCm < 30.0) {
        avoidStartMs = millis();
        state = RobotState::AVOID;
      }
      break;
    case RobotState::AVOID:
      setMotors(-140, 140); // 제자리 회전 회피
      if (millis() - avoidStartMs >= 450 && distCm >= 35.0) {
        state = RobotState::PATROL;
      }
      break;
    case RobotState::ESTOP:
      setMotors(0, 0);
      break;
  }
}`,
    codeChallenge: {
      prompt: '로봇이 PATROL 상태에서 벽을 만났을 때 AVOID로 넘어갔는데, 회피 회전 후 PATROL로 돌아오지 못하고 멈춰버립니다. switch문의 흔한 C++ 실수를 찾아 고쳐보세요!',
      buggyLine: 'case RobotState::PATROL: setMotors(160, 160); /* break; 누락! -> 아래 AVOID로 떨어짐(Fall-through) */',
      options: [
        '각 case 블록 끝에 반드시 break;를 넣는다.',
        'switch 대신 goto문을 사용한다.',
        '모든 case를 지우고 delay(5000)을 넣는다.',
      ],
      correctIndex: 0,
      explanation:
        'C/C++의 switch-case 문에서는 break;를 빠뜨리면 다음 case 코드까지 연달아 실행되는 Fall-through 버그가 발생합니다.',
    },
    quizzes: [
      {
        id: 'P2D11-1',
        question: '로봇 펌웨어에서 여러 bool 플래그(isMoving, isTurning 등) 대신 유한 상태 머신(FSM)을 쓰는 가장 큰 이유는?',
        options: [
          '로봇이 한 시점에 오직 하나의 명확한 상태만 갖도록 보장해 상충되는 모터 명령 버그를 막기 때문',
          'ESP32 클럭 속도가 2배 빨라지기 때문',
          '저항 없이 LED를 꽂아도 타지 않게 해주기 때문',
          '전선 굵기를 줄일 수 있기 때문',
        ],
        correctIndex: 0,
        explanation:
          'FSM은 상호 배타적인 단일 상태를 유지하므로 "전진과 회전과 정지가 동시에 참이 되는" 스파게티 조건 충돌을 구조적으로 방지합니다.',
      },
      {
        id: 'P2D11-2',
        question: 'AVOID(장애물 회피) 상태에서 "450ms 동안 회전한 뒤 다시 PATROL로 복귀"하도록 짤 때 가장 바람직한 구현 방식은?',
        options: [
          'AVOID 진입 시 millis()를 저장해 두고, 매 루프마다 경과 시간이 450ms 이상인지 비교해 복귀한다.',
          'switch 문 안에 delay(450)을 넣는다.',
          'for문으로 100만 번 공회전한다.',
          '전원을 껐다 켠다.',
        ],
        correctIndex: 0,
        explanation:
          '진입 타임스탬프와 millis() 차이를 비교하면 회전 중에도 E-STOP 버튼이나 다른 센서 입력을 놓치지 않고 논블로킹으로 전이할 수 있습니다.',
      },
      {
        id: 'P2D11-3',
        question: '비상 정지(E-STOP) 입력 처리는 FSM 코드에서 어느 위치에 두는 것이 가장 안전할까요?',
        options: [
          'switch 문 진입 전 최상단에서 검사해 어느 상태든 즉시 ESTOP 상태로 강제 전이시킨다.',
          'IDLE 상태 안에서만 검사한다.',
          '10초에 한 번만 검사한다.',
          '코드 맨 마지막 줄에만 둔다.',
        ],
        correctIndex: 0,
        explanation:
          '안전 인터락(E-STOP)은 현재 상태와 무관하게 최우선 순위로 평가되어 즉시 액추에이터 출력을 차단해야 합니다.',
      },
      {
        id: 'P2D11-4',
        question: 'C++ switch 문에서 case 블록 끝에 break; 키워드를 실수로 생략했을 때 발생하는 현상은?',
        options: [
          '컴파일러가 알아서 멈춘다.',
          '아래에 있는 다음 case의 코드까지 계속 이어서 실행(Fall-through)되어 의도치 않은 모터 명령이 덮어씌워진다.',
          'ESP32가 Wi-Fi에 연결된다.',
          '변수가 0으로 초기화된다.',
        ],
        correctIndex: 1,
        explanation:
          'C/C++ switch는 break가 없으면 다음 case 블록으로 그대로 흘러내려가는(Fall-through) 동작을 하므로 주의해야 합니다.',
      },
      {
        id: 'P2D11-5',
        question: '다음 중 상태 전이(State Transition) 조건 설계로 올바른 것은?',
        options: [
          'PATROL → AVOID: 거리 < 30cm, AVOID → PATROL: 거리 ≥ 35cm (히스테리시스 여유 두기)',
          'PATROL → AVOID: 거리 < 30cm, AVOID → PATROL: 거리 > 30cm (경계에서 떨림 유발)',
          '전이 조건 없이 랜덤으로 바꾼다.',
          '항상 IDLE에만 머문다.',
        ],
        correctIndex: 0,
        explanation:
          '진입 문턱값(30cm)과 복귀 문턱값(35cm) 사이에 약간의 차이(히스테리시스)를 두어야 경계 거리에서 상태가 쉴 새 없이 왔다 갔다 하는 채터링을 막을 수 있습니다.',
      },
    ],
  },
  {
    id: 'day12_comms',
    order: 12,
    dayLabel: 'Day 12',
    phaseLabel: 'Phase 2 · ESP32/모터',
    title: '센서 대화 언어 3대장: UART · I2C · SPI',
    shortTitle: 'UART·I2C·SPI',
    subtitle: 'TX↔RX 교차 배선 · I2C 2선 주소 & 풀업 · SPI 4선 고속 통신',
    badge: '통신 프로토콜',
    milestoneTag: 'Day 12 통신 버스 배선 랩',
    failFirstHook:
      'UART에서 TX를 상대방 TX에 그대로 꽂아 먹통이 되거나, I2C 센서 2개를 달았는데 주소(0x68)가 같아서 충돌하거나, 풀업 저항이 빠져 통신이 멈추는 실수가 매우 흔합니다.',
    beginnerAnalogy:
      'UART는 1:1 무전기(내 입 TX → 상대 귀 RX 교차!), I2C는 2가닥 선에 번호표(주소)를 달고 여러 센서가 차례로 대답하는 교실, SPI는 속도 빠른 4차선 전용 고속도로입니다.',
    overviewSummary:
      '고급 센서(IMU MPU-6050, OLED 화면, LiDAR, GPS, SD카드)는 단순 HIGH/LOW가 아니라 디지털 통신 프로토콜로 대화합니다. UART·I2C·SPI의 선 개수, 배선 규칙, 대표적인 배선 실수를 비교해 보세요.',
    guidedMissions: [
      {
        id: 'd12-uart',
        title: 'UART 모드에서 TX↔RX 교차 배선과 오류(TX-TX 충돌) 비교하기',
        hint: '프로토콜 "UART" 선택 후 "배선 오류 시뮬레이션"을 켜보세요.',
      },
      {
        id: 'd12-i2c',
        title: 'I2C 모드에서 단 2가닥(SDA 21, SCL 22)으로 두 센서가 연결되는 구조 확인하기',
        hint: '프로토콜을 "I2C"로 바꾸고 0x68 IMU와 0x3C OLED가 버스를 공유하는 모습을 보세요.',
      },
      {
        id: 'd12-spi',
        title: 'SPI 모드에서 장치별로 CS(Chip Select) 선이 따로 뻗어나가는 모습 확인하기',
        hint: '프로토콜을 "SPI"로 바꾸어 MOSI/MISO/SCK 공유와 개별 CS 핀을 확인하세요.',
      },
    ],
    highlights: [
      {
        title: 'UART: 1:1 비동기 통신 (TX ↔ RX 교차!)',
        body: '클럭 선 없이 약속된 속도(Baud Rate, 예: 115200bps)로 주고받습니다. 송신(TX)은 반드시 상대 수신(RX)에 엇갈려 연결해야 하며, GPS 모듈·블루투스·시리얼 디버깅에 씁니다.',
        tone: 'cyan',
      },
      {
        title: 'I2C: 2가닥(SDA, SCL) 버스 공유 & 풀업 저항 필수',
        body: 'ESP32 기본 핀은 GPIO 21(SDA), GPIO 22(SCL)입니다. 7비트 주소(예: MPU-6050=0x68, OLED=0x3C)로 최대 100여 개 센서를 단 두 선에 병렬 연결합니다. 오픈 드레인 구조라 4.7kΩ 풀업 저항이 필수(보통 모듈에 내장)입니다.',
        tone: 'emerald',
      },
      {
        title: 'SPI: 4선 전이중 초고속 통신 (CS 핀으로 상대 선택)',
        body: 'ESP32 VSPI 기본 핀은 23(MOSI), 19(MISO), 18(SCK), 5(CS)입니다. 수십 MHz로 매우 빨라 컬러 LCD, SD카드, 고속 IMU에 쓰지만, 장치가 늘어날 때마다 CS 핀이 1개씩 더 필요합니다.',
        tone: 'amber',
      },
    ],
    formulas: [
      {
        title: 'UART 전송 시간 및 I2C 7-bit 주소 공간',
        latex: String.raw`T_{\text{byte}} \approx \frac{10\text{ bits}}{\text{Baud Rate}}, \quad N_{\text{I2C addr}} = 2^7 = 128\text{ (예약 주소 제외 112개)}`,
        description:
          '115200bps에서 1바이트(Start 1 + Data 8 + Stop 1 = 10비트)는 약 86.8μs 걸립니다.',
      },
    ],
    specs: [
      { label: 'UART (시리얼)', value: 'TX↔RX · 2선', note: '1:1 교차 연결, Baud 일치', tone: 'cyan' },
      { label: 'I2C (Wire)', value: 'SDA 21 · SCL 22', note: '주소 기반 멀티 연결, 100~400kHz', tone: 'emerald' },
      { label: 'SPI (고속)', value: 'MOSI/MISO/SCK/CS', note: '장치당 CS 1개 추가, ~40MHz', tone: 'amber' },
      { label: '공통 주의사항', value: '공통 GND + 3.3V', note: '5V I2C 직결 금지', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: 'ESP32 기본 I2C 버스',
        pin: 'GPIO 21 (SDA) · GPIO 22 (SCL)',
        detail: 'Wire.begin() 호출 시 기본 할당되는 안전 핀입니다. 여러 모듈을 꽂을 때는 주소가 겹치지 않는지 I2C Scanner로 확인하세요.',
      },
      {
        signal: 'ESP32 기본 VSPI 버스',
        pin: 'MOSI=23 · MISO=19 · SCK=18 · CS=5(또는 13/17)',
        detail: 'GPIO 5는 스트래핑 핀이지만 VSPI 기본 CS로 쓰입니다. 부팅 민감 장치에는 CS로 안전 핀(13, 17, 27 등) 할당도 가능합니다.',
        warning: 'UART2는 GPIO 16(RX2), 17(TX2)을 쓰며 WROVER PSRAM 보드에서는 충돌을 주의하세요.',
      },
    ],
    codeTitle: 'day12_i2c_scanner.ino',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 12: 실물 보드에서 센서가 잘 꽂혔는지 1초 만에 찾는 I2C 주소 스캐너
#include <Wire.h>

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22); // SDA=GPIO 21, SCL=GPIO 22
  Serial.println("I2C 장치 스캔 중...");

  for (uint8_t addr = 1; addr < 127; addr++) {
    Wire.beginTransmission(addr);
    if (Wire.endTransmission() == 0) {
      Serial.printf("발견! I2C 주소: 0x%02X\\n", addr);
    }
  }
}`,
    codeChallenge: {
      prompt: 'GPS 모듈을 ESP32의 UART2(RX2=GPIO 16, TX2=GPIO 17)에 연결했는데 데이터가 전혀 안 들어옵니다. 배선 규칙에 맞게 코드 주석을 고쳐보세요!',
      buggyLine: '// 배선: GPS TX -> ESP32 TX2(17), GPS RX -> ESP32 RX2(16) (직선 연결 오류!)',
      options: [
        '// 올바른 배선: GPS TX -> ESP32 RX2(16), GPS RX -> ESP32 TX2(17) (교차 연결)',
        '// 올바른 배선: GPS TX와 RX를 한 핀에 묶는다',
        '// 올바른 배선: GND를 연결하지 않는다',
      ],
      correctIndex: 0,
      explanation:
        'UART는 말하기(TX)와 듣기(RX)가 따로 있으므로 반드시 상대의 TX를 내 RX에, 내 TX를 상대의 RX에 엇갈리게(Cross) 연결해야 합니다.',
    },
    quizzes: [
      {
        id: 'P2D12-1',
        question: 'UART 시리얼 통신으로 ESP32와 GPS 모듈을 연결할 때 올바른 신호선 결선법은?',
        options: [
          'ESP32 TX ↔ GPS RX, ESP32 RX ↔ GPS TX 로 서로 교차 연결한다.',
          'TX는 TX끼리, RX는 RX끼리 나란히 연결한다.',
          'TX 선 1개만 연결하고 GND는 뺀다.',
          'I2C SDA 핀에 연결한다.',
        ],
        correctIndex: 0,
        explanation:
          '송신(Transmit) 핀과 수신(Receive) 핀은 서로 마주 보며 교차 연결해야 데이터를 주고받을 수 있습니다.',
      },
      {
        id: 'P2D12-2',
        question: 'I2C 버스의 가장 큰 장점과 ESP32 기본 핀 번호 조합으로 올바른 것은?',
        options: [
          '단 2선(SDA=GPIO 21, SCL=GPIO 22)에 고유 주소를 가진 여러 센서를 동시에 연결할 수 있다.',
          '최소 6가닥 선이 필요하며 오직 1개 센서만 연결할 수 있다.',
          'GPIO 6, 7번을 기본으로 사용한다.',
          '클럭 선 없이 100Mbps로 통신한다.',
        ],
        correctIndex: 0,
        explanation:
          'I2C는 GPIO 21(SDA), 22(SCL) 두 선으로 주소가 다른 여러 센서(IMU, OLED 등)를 병렬 연결할 수 있어 핀 절약에 탁월합니다.',
      },
      {
        id: 'P2D12-3',
        question: '같은 I2C 버스에 같은 모델의 센서 2개(둘 다 기본 주소 0x68)를 그대로 병렬 연결하면 어떤 문제가 발생하나요?',
        options: [
          '두 센서가 동시에 대답하며 주소 충돌(Bus Collision)이 일어나 정상 값을 읽을 수 없다.',
          '속도가 두 배 빨라진다.',
          '주소가 자동으로 0x69로 바뀐다.',
          '센서가 서보모터로 바뀐다.',
        ],
        correctIndex: 0,
        explanation:
          'I2C 슬레이브는 주소로 구분되므로, 같은 센서를 2개 쓰려면 AD0 핀 등으로 한쪽 주소를 0x69로 바꾸거나 I2C 멀티플렉서(TCA9548A)를 써야 합니다.',
      },
      {
        id: 'P2D12-4',
        question: '컬러 디스플레이나 SD카드처럼 빠른 대용량 데이터 전송이 필요할 때 주로 쓰는 4선 통신 방식은?',
        options: ['SPI (MOSI, MISO, SCK, CS)', '1-Wire', '아날로그 ADC', 'UART 9600bps'],
        correctIndex: 0,
        explanation:
          'SPI는 송수신선이 분리되어 있고 Push-Pull 고속 클럭(SCK)을 사용하므로 수십 MHz의 빠른 대역폭을 낼 수 있습니다.',
      },
      {
        id: 'P2D12-5',
        question: 'SPI 버스에 장치 3개를 동시에 연결할 때 반드시 3개가 따로 필요한 제어 선은?',
        options: [
          'CS (Chip Select / SS) 핀 3개 (장비마다 각 1개씩 선택선 할당)',
          'SCK 클럭 핀 3개',
          'MOSI 핀 3개',
          '전원 스위치를 3개 꽂는다.',
        ],
        correctIndex: 0,
        explanation:
          'SPI에서 MOSI, MISO, SCK는 모든 장치가 공유하지만, 지금 누구와 대화할지 지정하는 CS(Chip Select) 핀은 슬레이브 장치마다 독립적으로 하나씩 필요합니다.',
      },
    ],
  },
  {
    id: 'day13_actuators',
    order: 13,
    dayLabel: 'Day 13',
    phaseLabel: 'Phase 2 · ESP32/모터',
    title: '액추에이터 A to Z: DC · 서보 · 스테퍼 모터',
    shortTitle: '모터 & 기어비',
    subtitle: '기어비(Gear Ratio) · 토크 vs 속도 반비례 · 스톨 전류 · 모터 선정',
    badge: '동력/기구',
    milestoneTag: 'Day 13 모터/기어비 랩',
    failFirstHook:
      '싼 맛에 초소형 서보(SG90)로 무거운 팔을 들어 올리거나 감속기 없는 10,000 RPM DC 모터를 바퀴에 바로 달면, 힘(토크)이 모자라 한 걸음도 못 가고 모터만 타버립니다.',
    beginnerAnalogy:
      '자전거 오르막길에서 기어를 저단(높은 기어비)으로 놓으면 바퀴 회전 속도는 느려지지만 페달을 밟는 힘(토크)이 어마어마하게 커지는 것과 똑같습니다!',
    overviewSummary:
      '로봇을 움직이는 대표 3대 모터(DC 기어드, 서보, 스테퍼)의 내부 구조와 용도를 비교하고, 기어비를 조절할 때 속도와 토크가 어떻게 반비례로 바뀌는지 계산기로 검증해 보세요.',
    guidedMissions: [
      {
        id: 'd13-compare',
        title: 'DC 모터 · 서보 · 스테퍼 모터를 번갈아 눌러 내부 구조 차이 확인하기',
        hint: '직접 실습 탭에서 3가지 모터 종류 버튼을 모두 눌러보세요.',
      },
      {
        id: 'd13-stall',
        title: '부하 토크를 올려 모터 스톨(Stall · 과부하 멈춤) 경고를 확인하기',
        hint: '기어비를 낮추고 필요 부하 토크를 올려보면 모터가 버티지 못하는 순간을 볼 수 있습니다.',
      },
      {
        id: 'd13-gear',
        title: '기어비를 높여(예: 1:30 이상) 무거운 부하를 안전하게 들어 올리기',
        hint: '기어비 슬라이더를 올려 필요 부하 토크보다 모터 토크가 크게 만드세요.',
      },
    ],
    highlights: [
      {
        title: 'DC 기어드 모터: 빠른 회전 + 감속 기어박스 (바퀴 주행용)',
        body: '모터 자체는 수천~1만 RPM으로 힘없이 빠르게 돕니다. 감속 기어비(예: 1:48 노란 TT모터)를 붙여 속도를 낮추고 토크를 키워 바퀴 구동에 씁니다.',
        tone: 'cyan',
      },
      {
        title: '서보(Servo) 모터: 내부 포텐쇼미터 + 피드백 제어기 내장 (관절용)',
        body: 'DC 모터 + 감속기 + 각도 센서(가변저항) + 제어 보드가 한 통에 들어 있습니다. 50Hz PWM으로 목표 각도를 주면 알아서 그 각도로 가서 버팁니다.',
        tone: 'emerald',
      },
      {
        title: '스테퍼(Stepper) 모터: 스텝각(1.8°) 펄스 정밀 이동 (3D 프린터/CNC용)',
        body: '한 회전(360°)을 200조각(1.8°/스텝)으로 쪼개 코일 여자 순서대로 정확히 한 걸음씩 움직입니다. 정밀 위치 제어에 좋지만 무겁고 전력을 계속 먹습니다.',
        tone: 'amber',
      },
    ],
    formulas: [
      {
        title: '기어비(N)에 따른 출력 토크 및 회전 속도 변환',
        latex: String.raw`\tau_{\text{out}} = \eta \cdot N \cdot \tau_{\text{motor}}, \quad \omega_{\text{out}} = \frac{\omega_{\text{motor}}}{N}`,
        description:
          '감속비 N이 커질수록 출력 속도는 1/N로 줄어드는 대신 출력 토크는 효율(η ≈ 0.85) × N배만큼 강해집니다.',
      },
    ],
    specs: [
      { label: 'DC 기어드 모터', value: '바퀴 / 팬 구동', note: '속도 제어, 엔코더 추가 가능', tone: 'cyan' },
      { label: 'SG90 / MG996R 서보', value: '1.8 / 10 kg·cm', note: '로봇 팔 관절·조향 각도', tone: 'emerald' },
      { label: 'NEMA-17 스테퍼', value: '1.8° (200스텝)', note: '개루프 정밀 위치/CNC', tone: 'amber' },
      { label: '스톨 전류 (Stall)', value: '무부하의 5~10배', note: '축이 막힐 때 최대 전류 폭발', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '스톨 전류(Stall Current) 대비 필수',
        pin: '전원/드라이버는 평상시 전류가 아닌 스톨 전류 기준 선정',
        detail: '바퀴가 벽에 끼어 멈춘 순간 모터는 최대 전류(Stall Current)를 빨아들이므로 드라이버와 배터리가 이를 견뎌야 합니다.',
      },
    ],
    codeTitle: 'day13_servo_vs_stepper.ino',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 13: 50Hz LEDC PWM으로 16-bit 정밀 서보 각도(0° ~ 180°) 제어하기
const int SERVO_PIN = 13;

void setup() {
  ledcAttach(SERVO_PIN, 50, 16); // 50Hz(20ms 주기), 16-bit(0~65535)
}

void setServoAngle(int deg) {
  deg = constrain(deg, 0, 180);
  // 0.5ms(2.5%) ~ 2.5ms(12.5%) -> 65535 기준 1638 ~ 8192
  uint32_t duty = map(deg, 0, 180, 1638, 8192);
  ledcWrite(SERVO_PIN, duty);
}

void loop() {
  setServoAngle(0);   delay(1000);
  setServoAngle(90);  delay(1000);
  setServoAngle(180); delay(1000);
}`,
    codeChallenge: {
      prompt: '서보 모터에 0°~180°를 넣었는데 서보가 45° 부근에서 덜덜 떨리며 끝까지 움직이지 않습니다. 50Hz PWM 주파수 설정 버그를 고쳐보세요!',
      buggyLine: 'ledcAttach(SERVO_PIN, 5000, 16); // DC모터용 5kHz를 서보에 넣음!',
      options: [
        'ledcAttach(SERVO_PIN, 50, 16); // 표준 RC 서보는 50Hz(20ms)',
        'ledcAttach(SERVO_PIN, 1, 16);',
        'ledcAttach(SERVO_PIN, 40000, 16);',
      ],
      correctIndex: 0,
      explanation:
        'RC 서보는 20ms마다(50Hz) 들어오는 펄스 폭을 읽으므로, 수 kHz 신호를 주면 제어 칩이 정상 각도를 해독하지 못하고 진동하거나 과열됩니다.',
    },
    quizzes: [
      {
        id: 'P2D13-1',
        question: '모터 데이터시트에 적힌 "스톨 전류(Stall Current)"가 의미하는 상황은?',
        options: [
          '모터 축이 외부 힘에 의해 강제로 꽉 막혀 회전하지 못할 때 흐르는 최대 위험 전류',
          '모터가 아무 부하 없이 공중에서 헛돌 때 흐르는 최소 전류',
          '전원을 껐을 때의 대기 전류',
          '서보 모터가 90도에 정지해 있을 때 전류 0mA 상태',
        ],
        correctIndex: 0,
        explanation:
          '모터가 막혀 회전하지 못하면 역기전력이 0이 되어 코일 순수 저항만으로 전류가 흐르므로 평상시보다 수 배~십 배 큰 스톨 전류가 흘러 드라이버가 탈 수 있습니다.',
      },
      {
        id: 'P2D13-2',
        question: '기본 회전 속도 6,000 RPM, 토크 0.1 kg·cm인 DC 모터에 1:30 감속 기어박스(효율 100% 가정)를 달면 출력 속도 및 토크는?',
        options: [
          '속도 200 RPM, 토크 3.0 kg·cm',
          '속도 180,000 RPM, 토크 0.1 kg·cm',
          '속도 200 RPM, 토크 0.1 kg·cm',
          '속도 6,000 RPM, 토크 3.0 kg·cm',
        ],
        correctIndex: 0,
        explanation:
          '감속 기어를 쓰면 출력 속도는 6000 / 30 = 200 RPM으로 줄어드는 대신 출력 토크는 0.1 × 30 = 3.0 kg·cm로 30배 증가합니다.',
      },
      {
        id: 'P2D13-3',
        question: '일반 RC 서보(예: SG90) 내부에 이미 내장되어 있어 별도 외부 센서 없이도 지정 각도로 이동할 수 있게 해주는 부품 조합은?',
        options: [
          'DC 모터 + 감속 기어 + 각도 피드백 가변저항(포텐쇼미터) + 제어 회로',
          '초음파 센서 + LiPo 배터리',
          '브레드보드 + OLED 디스플레이',
          '광학 라이다 센서만 내장',
        ],
        correctIndex: 0,
        explanation:
          '서보 모터 자체가 내부 포텐쇼미터로 현재 축 각도를 읽고 목표 펄스폭과 비교하는 소형 폐루프 위치 제어기입니다.',
      },
      {
        id: 'P2D13-4',
        question: '스텝 각도가 1.8°인 NEMA-17 스테퍼 모터를 풀 스텝(Full-Step)으로 정확히 1바퀴(360°) 회전시키려면 총 몇 스텝 펄스를 줘야 할까요?',
        options: ['50 스텝', '100 스텝', '200 스텝', '360 스텝'],
        correctIndex: 2,
        explanation:
          '360° / 1.8° = 200 스텝입니다. 마이크로스텝(예: 1/16)을 켜면 3,200 펄스로 더 부드럽게 움직일 수 있습니다.',
      },
      {
        id: 'P2D13-5',
        question: '서보 모터의 토크 표기가 "10 kg·cm"일 때 물리적으로 올바른 해석은?',
        options: [
          '모터 회전축으로부터 1cm 떨어진 팔 끝에서 약 10kg 무게를 버틸 수 있다 (10cm 팔 끝에서는 1kg).',
          '모터 자체 무게가 10kg이다.',
          '10cm 팔 끝에서도 10kg을 무조건 든다.',
          '모터가 10cm 길이로 늘어난다.',
        ],
        correctIndex: 0,
        explanation:
          '토크 = 힘 × 팔 길이(r)이므로 팔 길이가 1cm에서 10cm로 10배 길어지면 들 수 있는 최대 무게는 10kg에서 1kg으로 1/10로 줄어듭니다.',
      },
    ],
  },
  {
    id: 'day14_hbridge',
    order: 14,
    dayLabel: 'Day 14',
    phaseLabel: 'Phase 2 · ESP32/모터',
    title: '모터 드라이버(H-브리지) & 브라운아웃 완전 정복',
    shortTitle: 'H-브리지 드라이버',
    subtitle: 'TB6612FNG · Q1~Q4 전류 방향 제어 · 역기전력 플라이백 · 전원 분리',
    badge: '전력/구동기',
    milestoneTag: 'Day 14 H-브리지 스위칭 랩',
    failFirstHook:
      'DC 모터를 ESP32 GPIO 핀에 직접 꽂으면 핀당 40mA 한계를 넘어 핀이 영구 손상되고, 모터를 멈출 때 코일에서 튀는 역전압(역기전력)이 보드 CPU를 파괴합니다.',
    beginnerAnalogy:
      'H-브리지는 모터 양쪽에 물길 밸브 4개(Q1~Q4)를 알파벳 H 모양으로 배치해, 대각선 밸브 두 개를 열면 정방향 물줄기, 반대 대각선을 열면 역방향 물줄기를 만드는 전류 방향 전환 장치입니다.',
    overviewSummary:
      'ESP32의 약한 3.3V 신호(두뇌)로 7.4V 고전류 DC 모터(근육)를 정회전·역회전·급제동시키는 H-브리지(TB6612FNG)의 내부 4-스위치 원리와 슛스루(Shoot-through) 단락 위험, 그리고 공통 GND의 중요성을 실험하세요.',
    guidedMissions: [
      {
        id: 'd14-dir',
        title: 'H-브리지 모드를 정회전(Forward)과 역회전(Reverse)으로 바꿔 전류 방향 보기',
        hint: '직접 실습 탭에서 정회전 ↔ 역회전을 누르면 대각선 스위치(Q1+Q4 vs Q3+Q2)가 바뀝니다.',
      },
      {
        id: 'd14-shoot',
        title: '금지 조합 "슛스루(Shoot-Through)"를 눌러 왜 한쪽 두 스위치를 동시에 켜면 안 되는지 보기',
        hint: 'Q1+Q2가 동시에 닫히면 모터 대신 배터리가 GND로 직통 단락되어 폭발 위험이 생깁니다.',
      },
      {
        id: 'd14-gnd',
        title: '공통 GND 스위치를 꺼서 로직 신호 기준점이 끊기는 오류 체험하기',
        hint: '공통 GND 토글을 OFF로 바꾸고 모터 드라이버 경고를 확인하세요.',
      },
    ],
    highlights: [
      {
        title: 'TB6612FNG vs 구형 L298N: 왜 요즘은 TB6612를 쓸까?',
        body: '구형 L298N은 BJT 트랜지스터 구조라 내부에서 약 1.8~2.5V가 열로 날아가고 덩치가 큽니다. 최신 MOSFET 기반 TB6612FNG나 DRV8833은 전압 손실이 거의 없고 발열이 적어 소형 배터리 로봇에 표준으로 쓰입니다.',
        tone: 'emerald',
      },
      {
        title: '역기전력(Back-EMF)과 플라이백 다이오드',
        body: '모터 코일에 흐르던 전류를 갑자기 끊으면 코일이 전류를 계속 흘리려 수십~수백 V의 역전압 스파이크를 뿜어냅니다. H-브리지 내장 플라이백 다이오드가 이 에너지를 안전하게 순환시켜 칩을 보호합니다.',
        tone: 'amber',
      },
      {
        title: '절대 금지 상태: 슛스루(Shoot-Through)',
        body: 'H-브리지의 왼쪽 위(Q1)와 왼쪽 아래(Q2) 스위치가 동시에 닫히면 전원 VM이 모터를 거치지 않고 GND로 직통 단락됩니다. 상용 드라이버 IC(IN1/IN2 입력)는 내부 로직이 이를 막아주지만 직접 MOSFET 회로를 짤 때는 반드시 주의해야 합니다.',
        tone: 'rose',
      },
    ],
    formulas: [
      {
        title: 'TB6612FNG 진리표 & 모터 단자 전압',
        latex: String.raw`\text{AIN1}=1,\;\text{AIN2}=0 \implies \text{CW}, \quad \text{AIN1}=1,\;\text{AIN2}=1 \implies \text{Short Brake}`,
        description:
          'PWM 핀에 속도를 넣고 AIN1/AIN2로 방향(또는 급제동)을 지시합니다. STBY 핀은 반드시 HIGH로 켜야 동작합니다.',
      },
    ],
    specs: [
      { label: '추천 드라이버 IC', value: 'TB6612FNG / DRV8833', note: 'MOSFET 기반 저손실·저발열', tone: 'emerald' },
      { label: '모터 전원 (VM)', value: '배터리 직결 (6~12V)', note: 'ESP32 3V3 핀 사용 절대 금지', tone: 'cyan' },
      { label: '로직 전원 (VCC)', value: 'ESP32 3.3V 연결', note: 'GND는 반드시 공통 연결', tone: 'amber' },
      { label: '최악의 고장', value: '슛스루 (Q1+Q2 ON)', note: 'VM→GND 직통 합선 폭발', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: 'TB6612FNG 전원 분리 배선',
        pin: 'VM=배터리 7.4V · VCC=ESP32 3.3V · GND=모두 공통',
        detail: 'STBY 핀을 ESP32 3.3V(또는 제어 GPIO HIGH)에 연결하지 않으면 드라이버가 대기 상태라 전혀 돌지 않습니다.',
      },
      {
        signal: '제어 신호 (모터 A)',
        pin: 'PWMA=GPIO 13 · AIN1=GPIO 27 · AIN2=GPIO 26',
        detail: '모터 전원 커패시터(100μF + 0.1μF)를 드라이버 VM–GND 근처에 달면 노이즈에 의한 보드 리셋이 크게 줄어듭니다.',
        warning: 'ESP32의 3V3 핀에서 모터 VM 전원을 절대 끌어오지 마세요!',
      },
    ],
    codeTitle: 'day14_tb6612_hbridge.ino',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 14: TB6612FNG H-브리지 모터 드라이버 정회전 · 역회전 · 급제동 제어
const int PWMA = 13, AIN1 = 27, AIN2 = 26, STBY = 25;

void setup() {
  pinMode(AIN1, OUTPUT); pinMode(AIN2, OUTPUT); pinMode(STBY, OUTPUT);
  digitalWrite(STBY, HIGH); // 드라이버 대기 모드 해제 (필수!)
  ledcAttach(PWMA, 1000, 8);
}

void driveMotor(int speed) { // -255 ~ +255
  if (speed > 0) {
    digitalWrite(AIN1, HIGH); digitalWrite(AIN2, LOW); // 정회전 (Q1+Q4)
  } else if (speed < 0) {
    digitalWrite(AIN1, LOW); digitalWrite(AIN2, HIGH); // 역회전 (Q3+Q2)
  } else {
    digitalWrite(AIN1, HIGH); digitalWrite(AIN2, HIGH); // 급제동 (Brake)
  }
  ledcWrite(PWMA, min(255, abs(speed)));
}`,
    codeChallenge: {
      prompt: '배선을 완벽히 하고 PWM과 AIN1/AIN2 신호를 보냈는데 모터가 꼼짝도 하지 않습니다. TB6612FNG 드라이버가 잠들어 있는 원인을 코드에서 고쳐보세요!',
      buggyLine: 'digitalWrite(STBY, LOW); // 드라이버가 Standby(절전 정지) 모드에 묶여있음!',
      options: [
        'digitalWrite(STBY, HIGH); // Standby 해제',
        'digitalWrite(AIN1, LOW); digitalWrite(AIN2, LOW);',
        'ledcWrite(PWMA, 0);',
      ],
      correctIndex: 0,
      explanation:
        'TB6612FNG는 STBY(Standby) 핀이 HIGH(3.3V)여야 내부 H-브리지가 깨어나 모터에 전력을 공급합니다.',
    },
    quizzes: [
      {
        id: 'P2D14-1',
        question: 'DC 모터를 ESP32 GPIO 핀에 직접 연결하면 안 되고 반드시 H-브리지 모터 드라이버를 거쳐야 하는 이유 2가지는?',
        options: [
          'GPIO 핀 허용 전류(20~40mA)를 수십 배 초과하는 모터 전류 + 정지 시 튀는 역기전력 스파이크 때문',
          '모터가 3.3V에서 너무 빠르게 돌아서',
          'DC 모터는 디지털 1만 입력받기 때문',
          'GPIO 핀이 모터를 고정할 물리적 나사가 없어서',
        ],
        correctIndex: 0,
        explanation:
          'DC 모터는 수백 mA~수 A의 큰 전류를 소비하고 방향 전환도 필요하며, 인덕턴스 코일 특성상 역기전력이 발생하므로 전용 H-브리지 드라이버가 필수입니다.',
      },
      {
        id: 'P2D14-2',
        question: 'H-브리지(Q1 좌상, Q2 좌하, Q3 우상, Q4 우하)에서 모터를 정회전시키기 위해 닫아야 하는 스위치 쌍은?',
        options: [
          '대각선 쌍 (Q1과 Q4)',
          '같은 왼쪽 쌍 (Q1과 Q2)',
          '같은 위쪽 쌍 (Q1과 Q3)',
          '4개 스위치 전부 동시 ON',
        ],
        correctIndex: 0,
        explanation:
          '대각선 스위치(Q1+Q4)를 닫아야 전류가 모터 왼쪽에서 오른쪽으로 흘러 한 방향으로 회전합니다. 반대 방향은 (Q3+Q2)를 닫습니다.',
      },
      {
        id: 'P2D14-3',
        question: 'H-브리지에서 왼쪽 위 스위치(Q1)와 왼쪽 아래 스위치(Q2)가 동시에 켜지는 위험한 단락 현상을 무엇이라 하나요?',
        options: [
          '슛스루 (Shoot-Through)',
          '플로팅 (Floating)',
          '디바운싱 (Debouncing)',
          '오도메트리 (Odometry)',
        ],
        correctIndex: 0,
        explanation:
          '한쪽 레그의 상단/하단 스위치가 동시에 닫히면 전원 VM이 모터를 거치지 않고 GND로 직결 단락되는 Shoot-Through가 발생해 칩이 폭발·손상됩니다.',
      },
      {
        id: 'P2D14-4',
        question: '최신 소형 로봇에서 구형 L298N 드라이버 대신 TB6612FNG(또는 DRV8833)가 더 많이 추천되는 이유는?',
        options: [
          'MOSFET 기반이라 내부 전압 강하(발열 손실)가 훨씬 적고 크기가 작아 배터리 효율이 높기 때문',
          'L298N은 DC 모터를 역회전시킬 수 없기 때문',
          'TB6612FNG는 배터리 없이 혼자 전기를 만들기 때문',
          'TB6612FNG는 220V 가정용 교류 전용이기 때문',
        ],
        correctIndex: 0,
        explanation:
          'L298N은 양극성 트랜지스터(BJT) 구조로 약 2V 가까이 전압이 손실되지만, MOSFET 드라이버는 온저항(Rds_on)이 매우 낮아 발열과 전압 손실이 적습니다.',
      },
      {
        id: 'P2D14-5',
        question: '모터 전원(7.4V LiPo → 드라이버 VM)과 ESP32 로직 전원(USB 5V)을 분리할 때 반드시 연결해야 하는 선은?',
        options: [
          '두 회로의 GND(접지)를 한 점으로 묶어주는 공통 GND 선',
          '7.4V 배터리 +극을 ESP32 3V3 핀에 연결',
          '모터 양극 선을 RX0에 연결',
          '아무 선도 연결하지 않는다.',
        ],
        correctIndex: 0,
        explanation:
          '전원 레일은 분리하더라도 신호의 기준 전위(0V)를 맞추기 위해 공통 GND는 반드시 연결되어야 PWM과 방향 제어 신호가 전달됩니다.',
      },
    ],
  },
  {
    id: 'day15_rtos_wireless',
    order: 15,
    dayLabel: 'Day 15',
    phaseLabel: 'Phase 2 · ESP32/모터',
    title: '실시간 시스템(ISR/FreeRTOS) & 무선 조종 기초',
    shortTitle: 'FreeRTOS·무선',
    subtitle: '하드웨어 인터럽트(ISR) · FreeRTOS 듀얼코어 고정 Δt · ESP-NOW 무선',
    badge: '실시간 제어',
    milestoneTag: 'Day 15 듀얼코어 RTOS 랩',
    failFirstHook:
      'Wi-Fi 웹 서버 통신과 모터 제어 코드를 하나의 loop()에 섞어 넣으면, 무선 패킷이 몰릴 때 제어 주기 Δt가 10ms에서 150ms로 출렁이며 로봇 제어기가 발산합니다.',
    beginnerAnalogy:
      'ESP32는 요리사 2명(Core 0과 Core 1)이 있습니다. Core 0은 무선 주문(Wi-Fi/ESP-NOW)만 전담시키고, Core 1은 오직 10ms 정각마다 칼같이 모터 제어만 돌리는 것이 FreeRTOS 듀얼코어 분업입니다.',
    overviewSummary:
      '빠른 엔코더 펄스를 놓치지 않는 하드웨어 인터럽트(ISR) 작성 규칙과, ESP32의 내장 FreeRTOS로 Wi-Fi 통신과 실시간 제어 루프(고정 Δt)를 코어별로 분리하는 원리를 실험하세요.',
    guidedMissions: [
      {
        id: 'd15-rtos',
        title: 'FreeRTOS 듀얼코어 분리를 켜서 Δt 지터(Jitter)가 10.0ms로 고정되는지 확인하기',
        hint: '직접 실습 탭에서 "FreeRTOS 듀얼코어 분리"를 ON/OFF 하며 타임라인을 비교하세요.',
      },
      {
        id: 'd15-isr',
        title: 'ISR 규칙 토글을 꺼서 인터럽트 내 Serial.print() 크래시 경고 확인하기',
        hint: 'ISR 안전 규칙 스위치를 꺼보면 왜 무거운 작업을 ISR 밖에 둬야 하는지 보입니다.',
      },
      {
        id: 'd15-cmd',
        title: '무선 ESP-NOW 조종 명령(전진/좌회전/정지)을 눌러 로버 반응 확인하기',
        hint: '무선 조종 패드 버튼을 눌러 Core 0 → Core 1 명령 전달을 확인하세요.',
      },
    ],
    highlights: [
      {
        title: 'ESP32 듀얼코어 FreeRTOS: Core 0 (통신) vs Core 1 (제어)',
        body: 'ESP-IDF/Arduino-ESP32는 이미 FreeRTOS 위에서 동작합니다. 기본 Wi-Fi/BLE 스택은 Core 0에 묶여 있으므로, 정밀 주기 제어가 필요한 제어 태스크는 `xTaskCreatePinnedToCore(..., 1)`로 Core 1에 고정하고 `vTaskDelayUntil()`로 정확한 Δt를 유지합니다.',
        tone: 'cyan',
      },
      {
        title: '하드웨어 인터럽트(ISR) 3대 철칙',
        body: '엔코더 펄스처럼 0.1ms 단위로 들어오는 신호는 `attachInterrupt`로 잡되, ISR 함수에는 반드시 `IRAM_ATTR`를 붙이고, 내부에서는 오직 `volatile` 카운터만 증가시킨 뒤 즉시 빠져나옵니다(`Serial.print`·`delay` 절대 금지).',
        tone: 'rose',
      },
      {
        title: 'ESP-NOW vs Wi-Fi WebSocket 무선 조종',
        body: '로봇 두 대끼리나 전용 리모컨과 1~5ms 초저지연으로 조종할 때는 공유기 없이 MAC 주소로 직접 패킷을 쏘는 ESP-NOW가 유리하며, 스마트폰/PC 웹 브라우저 조종에는 Wi-Fi WebSocket이 편리합니다.',
        tone: 'emerald',
      },
    ],
    formulas: [
      {
        title: '실시간 주기 제어 지터(Jitter)와 FreeRTOS 절대 주기 대기',
        latex: String.raw`t_{k+1} = t_k + \Delta T_{\text{fixed}} \quad (\text{vTaskDelayUntil})`,
        description:
          '일반 delay(10)은 연산 시간만큼 주기가 밀려(10ms + 연산시간) 오차가 누적되지만, vTaskDelayUntil은 절대 시각 간격을 정확히 맞춥니다.',
      },
    ],
    specs: [
      { label: 'Core 0 (PRO_CPU)', value: 'Wi-Fi / ESP-NOW', note: '무선 패킷 수신 전담', tone: 'cyan' },
      { label: 'Core 1 (APP_CPU)', value: '10ms 제어 태스크', note: 'vTaskDelayUntil 고정 Δt', tone: 'emerald' },
      { label: 'ISR 필수 속성', value: 'IRAM_ATTR + volatile', note: 'Serial.print / delay 금지', tone: 'rose' },
      { label: 'ESP-NOW 지연', value: '약 1 ~ 5 ms', note: '공유기 불필요, 최대 250B', tone: 'amber' },
    ],
    wiringNotes: [
      {
        signal: '인터럽트 입력 핀 (엔코더 / E-STOP)',
        pin: 'GPIO 32, 33, 34, 35 (안전 입력 핀)',
        detail: 'GPIO 34~39는 인터럽트도 지원하지만 내부 풀업이 없으므로 외부 풀업과 함께 쓰세요.',
      },
    ],
    codeTitle: 'day15_freertos_isr.ino',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 15: IRAM_ATTR 인터럽트 + Core 1 고정 주기 FreeRTOS 태스크
volatile long encoderTicks = 0;

void IRAM_ATTR onEncoderPulse() {
  encoderTicks++; // ISR 안에서는 오직 초고속 변수 갱신만!
}

void controlTask(void *pv) {
  TickType_t lastWake = xTaskGetTickCount();
  const TickType_t period = pdMS_TO_TICKS(10); // 정확히 10ms(100Hz) 고정
  for (;;) {
    long ticks = encoderTicks;
    // PID 및 모터 제어 계산...
    vTaskDelayUntil(&lastWake, period);
  }
}

void setup() {
  pinMode(32, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(32), onEncoderPulse, RISING);
  xTaskCreatePinnedToCore(controlTask, "Ctrl", 4096, NULL, 2, NULL, 1); // Core 1 고정
}`,
    codeChallenge: {
      prompt: '엔코더 인터럽트(onEncoderPulse)가 발생할 때마다 보드가 "Guru Meditation Error (Panic)"를 뿜으며 재부팅됩니다. ISR 내부 금지 코드를 고쳐보세요!',
      buggyLine: 'void IRAM_ATTR onEncoderPulse() { encoderTicks++; Serial.println(encoderTicks); }',
      options: [
        'void IRAM_ATTR onEncoderPulse() { encoderTicks++; } // Serial 출력은 메인 태스크로 이동',
        'void IRAM_ATTR onEncoderPulse() { delay(100); encoderTicks++; }',
        'void onEncoderPulse() { WiFi.begin(); }',
      ],
      correctIndex: 0,
      explanation:
        'ISR 내부에서 Serial.print(), delay(), 동적 메모리 할당을 호출하면 인터럽트 중첩/데드락과 워치독 타임아웃(Panic)이 발생합니다. ISR은 깃발(volatile)만 세우고 즉시 나와야 합니다.',
    },
    quizzes: [
      {
        id: 'P2D15-1',
        question: '하드웨어 인터럽트 서비스 루틴(ISR) 내부에 Serial.println()이나 delay()를 절대 넣으면 안 되는 이유는?',
        options: [
          'ISR 실행 중 다른 인터럽트가 멈추어 시리얼 버퍼 대기 중 데드락·워치독 리셋(Panic)이 발생하기 때문',
          'Serial.println()이 RGB LED 색깔을 바꾸기 때문',
          'ISR 안에서는 덧셈 연산을 할 수 없어서',
          '배터리 전압이 12V로 올라가서',
        ],
        correctIndex: 0,
        explanation:
          'ISR은 극도로 짧고 결정적이어야 합니다. UART 송신 대기나 delay()는 시스템 전체를 멈추게 해 크래시를 유발합니다.',
      },
      {
        id: 'P2D15-2',
        question: 'FreeRTOS에서 일반 vTaskDelay(10) 대신 vTaskDelayUntil(&lastWake, 10)을 써서 제어 루프를 돌리는 이유는?',
        options: [
          '제어 연산이 3ms 걸렸어도 다음 깨어나는 시각을 절대 기준(10ms 정각)으로 맞춰 샘플링 주기 Δt를 일정하게 유지하기 위해',
          '로봇을 10초 동안 재우기 위해',
          'Core 0을 끄기 위해',
          'Wi-Fi 비밀번호를 저장하기 위해',
        ],
        correctIndex: 0,
        explanation:
          'vTaskDelay(10)은 작업 시간(예: 3ms) + 10ms = 13ms가 되지만, vTaskDelayUntil은 이전 깨어난 시각 + 10ms에 정확히 맞춰 지터를 없앱니다.',
      },
      {
        id: 'P2D15-3',
        question: 'ESP32의 FreeRTOS 듀얼코어 구조에서 기본 Wi-Fi/BLE 프로토콜 스택이 주로 실행되는 코어와, 실시간 모터 제어 태스크를 배치하기 좋은 코어는?',
        options: [
          'Wi-Fi는 Core 0, 실시간 모터 제어는 Core 1에 배치(Pinning)해 간섭을 줄인다.',
          '둘 다 Core 0에 몰아넣고 Core 1은 끈다.',
          'ESP32는 단일 코어 8-bit 칩이다.',
          '둘 다 같은 1개의 delay(100) 안에서 돌린다.',
        ],
        correctIndex: 0,
        explanation:
          '무선 스택이 실행되는 Core 0과 분리해 Core 1에 제어 루프를 고정하면 무선 통신 부하가 걸려도 제어 주기가 크게 흔들리지 않습니다.',
      },
      {
        id: 'P2D15-4',
        question: 'ESP32 보드끼리 와이파이 공유기 없이 1~5ms 수준의 낮은 지연시간으로 무선 조종 패킷을 주고받는 Espressif 전용 프로토콜은?',
        options: ['ESP-NOW', 'FTP', 'SMTP', 'HDMI'],
        correctIndex: 0,
        explanation:
          'ESP-NOW는 2.4GHz Wi-Fi 무선을 사용하지만 공유기 연결 절차 없이 MAC 주소 기반으로 250바이트 이하 제어 패킷을 초고속으로 전송합니다.',
      },
      {
        id: 'P2D15-5',
        question: 'ESP32에서 인터럽트 함수를 RAM에 상주시켜 플래시 메모리 접근 지연/크래시를 막기 위해 함수 선언에 붙이는 매크로는?',
        options: ['IRAM_ATTR', 'PROGMEM_ONLY', 'NO_INLINE', 'FLASH_SLOW'],
        correctIndex: 0,
        explanation:
          'ESP32에서는 플래시 쓰기/캐시 작업 중에도 인터럽트 함수가 즉시 실행될 수 있도록 IRAM_ATTR를 붙여 내부 고속 RAM에 올립니다.',
      },
    ],
  },
  {
    id: 'day16_rover_project',
    order: 16,
    dayLabel: 'Day 16',
    phaseLabel: 'Phase 2 · ESP32/모터',
    title: '[Phase 2 미니 프로젝트] ESP32 무선 RC 로버 통합',
    shortTitle: '무선 RC 로버',
    subtitle: '2S LiPo + 5V Buck + TB6612 + ESP32 + 무선 Failsafe FSM 완주',
    badge: 'Phase 2 프로젝트',
    milestoneTag: 'Day 16 무선 RC 로버 랩',
    failFirstHook:
      '무선 조종기로 전진 명령을 보내고 달리다가 통신 범위 밖으로 나가 패킷이 끊어졌을 때, 타임아웃 안전 정지(Failsafe)를 안 넣으면 로버가 마지막 속도 그대로 책상에서 추락합니다.',
    beginnerAnalogy:
      'Phase 1(전원 분리)과 Phase 2(ESP32 안전 핀맵, 논블로킹 FSM, H-브리지 모터 드라이버, 무선 통신)를 모두 합쳐 내 손으로 굴러가는 첫 번째 무선 RC 로봇을 완성하는 마일스톤입니다!',
    overviewSummary:
      '2S LiPo 배터리, 5V 벅 컨버터, TB6612FNG 듀얼 드라이버, 좌우 DC 모터, 전방 팬 서보가 연결된 무선 RC 로버에서 조종 명령·전원 분리·500ms 통신 두절 Failsafe까지 하나로 통합 검증해 보세요.',
    guidedMissions: [
      {
        id: 'd16-drive',
        title: '무선 조종(전진/좌회전/우회전)을 눌러 좌우 바퀴 회전 방향과 속도 확인하기',
        hint: '직접 실습 탭에서 전진·좌회전·우회전 버튼을 눌러보세요.',
      },
      {
        id: 'd16-power',
        title: '전원 분리를 꺼서(ESP32 3V3 직결) 왜 브라운아웃 리셋이 나는지 확인한 뒤 복구하기',
        hint: '"5V 벅 전원 분리" 스위치를 OFF했다가 다시 ON으로 켜보세요.',
      },
      {
        id: 'd16-failsafe',
        title: '무선 신호 끊김 시간을 500ms 이상으로 늘려 Failsafe 자동 정지 작동 확인하기',
        hint: '"Failsafe(500ms)"를 켠 상태에서 신호 끊김 슬라이더를 600ms 이상으로 올려보세요.',
      },
    ],
    highlights: [
      {
        title: '무선 로봇의 생명줄: 500ms Failsafe Timeout',
        body: '조종 패킷이 들어올 때마다 `lastRxMs = millis()`를 기록하고, `millis() - lastRxMs > 500`이 되면 즉시 `FAILSAFE` 상태로 전이해 양쪽 모터를 강제 정지시킵니다.',
        tone: 'rose',
      },
      {
        title: '충돌 없는 듀얼 모터 + 서보 + Wi-Fi 통합 핀맵',
        body: 'PWMA=13, AIN1=27, AIN2=26, PWMB=18, BIN1=19, BIN2=23, Servo=16, Battery ADC=34(ADC1). 부팅 스트래핑 핀(0, 2, 5, 12, 15)과 SPI Flash(6~11), Wi-Fi ADC2 충돌을 100% 피한 실전 핀맵입니다.',
        tone: 'emerald',
      },
      {
        title: '전원 2갈래 분리 아키텍처',
        body: '2S LiPo(7.4V) → TB6612FNG VM(모터 전력 직결), 2S LiPo → LM2596 5V Buck → ESP32 VIN & SG90 서보 VCC. 두 회로의 GND는 굵은 선으로 하나로 묶습니다.',
        tone: 'cyan',
      },
    ],
    formulas: [
      {
        title: '차동 구동 조이스틱 믹싱(Arcade Drive) & Failsafe 조건',
        latex: String.raw`v_L = \text{throttle} + \text{steer}, \quad v_R = \text{throttle} - \text{steer}, \quad (t_{\text{now}} - t_{\text{rx}} > 500\text{ ms}) \implies v_L = v_R = 0`,
        description:
          '앞뒤(throttle)와 좌우(steer) 조이스틱 값을 좌/우 바퀴 PWM으로 섞어 직관적인 RC 주행을 구현합니다.',
      },
    ],
    specs: [
      { label: '동력 / 로직 전원', value: '7.4V VM / 5V Buck', note: '브라운아웃 원천 차단', tone: 'cyan' },
      { label: '모터 드라이버', value: 'TB6612FNG 듀얼', note: '좌우 바퀴 독립 PWM', tone: 'emerald' },
      { label: '안전 핀 할당', value: 'ADC1(34) + 안전 I/O', note: 'Wi-Fi·부팅 글리치 제로', tone: 'amber' },
      { label: 'Failsafe 기준', value: '500 ms 무응답 정지', note: '폭주·추락 방지 필수', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '좌측/우측 모터 드라이버 (TB6612)',
        pin: 'A: PWM=13, 27, 26 | B: PWM=18, 19, 23 | STBY=25',
        detail: '모두 부팅 글리치가 없는 안전 I/O 핀으로 구성해 전원을 켜자마자 바퀴가 튀는 현상을 막습니다.',
      },
      {
        signal: '배터리 잔량 감시 (Wi-Fi 동시 동작)',
        pin: 'GPIO 34 (ADC1) ← 30kΩ+10kΩ 분압기',
        detail: 'Wi-Fi/ESP-NOW 무선 통신 중에도 충돌 없이 2S LiPo 전압을 읽어 저전압을 감지합니다.',
        warning: 'Failsafe 타임아웃과 공통 GND 확인 없이는 절대 실외 주행을 시작하지 마세요.',
      },
    ],
    codeTitle: 'day16_wireless_rover_failsafe.ino',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 16 Phase 2 미니 프로젝트: 차동 구동 믹싱 + 500ms Failsafe FSM
unsigned long lastPacketMs = 0;
int cmdThrottle = 0, cmdSteer = 0;

void onWirelessPacket(int throttle, int steer) {
  cmdThrottle = constrain(throttle, -255, 255);
  cmdSteer    = constrain(steer, -255, 255);
  lastPacketMs = millis(); // 패킷 수신 시각 갱신!
}

void loop() {
  if (millis() - lastPacketMs > 500) {
    // 0.5초 이상 무선 신호 두절 시 즉시 안전 정지 (Failsafe)
    driveLeft(0);
    driveRight(0);
  } else {
    int leftPwm  = constrain(cmdThrottle + cmdSteer, -255, 255);
    int rightPwm = constrain(cmdThrottle - cmdSteer, -255, 255);
    driveLeft(leftPwm);
    driveRight(rightPwm);
  }
}`,
    codeChallenge: {
      prompt: '무선 리모컨 전원을 껐는데도 로버가 멈추지 않고 계속 마지막 명령대로 굴러갑니다. 수신 콜백에서 빠진 한 줄을 찾아 고쳐보세요!',
      buggyLine: 'void onWirelessPacket(int t, int s) { cmdThrottle = t; cmdSteer = s; /* 수신 시각 갱신 누락 혹은 조건 부호 반전 */ }',
      options: [
        'lastPacketMs = millis(); 를 수신 때마다 갱신하고, millis() - lastPacketMs > 500 일 때 정지한다.',
        'if (millis() - lastPacketMs < 500) 일 때 정지한다.',
        'delay(5000); 을 loop()에 추가한다.',
      ],
      correctIndex: 0,
      explanation:
        '신호가 들어올 때마다 lastPacketMs = millis()로 생존 신호를 갱신하고, 경과 시간이 500ms를 초과(> 500)하면 즉시 모터를 0으로 꺼야 합니다.',
    },
    quizzes: [
      {
        id: 'P2D16-1',
        question: '무선 RC 로버에서 조종기 통신이 500ms 이상 끊겼을 때 모터를 강제로 끄는 안전 기법은?',
        options: [
          'Failsafe Timeout (워치독 안전 정지)',
          'Overclocking',
          'Anti-Windup',
          'Pull-up Floating',
        ],
        correctIndex: 0,
        explanation:
          '무선 통신은 장애물이나 거리 때문에 언제든 끊길 수 있으므로, 일정 시간(예: 500ms) 동안 새 명령이 안 오면 자동 정지하는 Failsafe가 필수입니다.',
      },
      {
        id: 'P2D16-2',
        question: 'Wi-Fi로 조종하는 로버에서 2S LiPo 배터리 전압을 분압기로 낮춰 읽으려고 할 때 반드시 사용해야 하는 ADC 핀은?',
        options: [
          'GPIO 34 (ADC1 채널)',
          'GPIO 25 (ADC2 채널)',
          'GPIO 6 (SPI Flash)',
          'GPIO 12 (Strapping + ADC2)',
        ],
        correctIndex: 0,
        explanation:
          'Wi-Fi 통신 중에는 ADC2 블록 전체가 리소스 충돌로 사용 불가하므로, 반드시 ADC1 채널(GPIO 32~39)을 사용해야 합니다.',
      },
      {
        id: 'P2D16-3',
        question: '모터 Enable이나 PWM 핀에 부팅 글리치가 발생하는 GPIO 0, 5, 14, 15번을 할당했을 때 전원을 켜는 순간 생길 수 있는 사고는?',
        options: [
          '프로그램이 시작되기도 전에 부팅 순간 모터가 덜컥 튀어 나가 로버가 책상에서 떨어질 수 있다.',
          '바퀴 색깔이 바뀐다.',
          '배터리가 자동으로 충전된다.',
          '무선 거리가 10km로 늘어난다.',
        ],
        correctIndex: 0,
        explanation:
          '부팅 순간 UART/PWM 글리치가 나오는 핀에 모터 구동선을 물리면 부팅 도중 의도치 않은 회전 펄스가 인가될 수 있습니다.',
      },
      {
        id: 'P2D16-4',
        question: '차동 구동 로버(좌바퀴 v_L, 우바퀴 v_R)를 제자리에서 오른쪽(시계방향)으로 회전시키려면 바퀴 속도 부호는?',
        options: [
          '왼쪽 바퀴 정회전(+), 오른쪽 바퀴 역회전(-)',
          '양쪽 바퀴 모두 정회전(+)',
          '양쪽 바퀴 모두 역회전(-)',
          '양쪽 바퀴 모두 0',
        ],
        correctIndex: 0,
        explanation:
          '왼쪽 바퀴는 앞으로 밀고 오른쪽 바퀴는 뒤로 당기면 두 힘이 우회전 토크를 만들어 제자리 회전합니다.',
      },
      {
        id: 'P2D16-5',
        question: '로버에서 2S LiPo 배터리를 TB6612 모터 드라이버 VM에 직접 연결하고, ESP32 VIN에는 5V DC-DC 벅 컨버터를 거쳐 연결하는 이유는?',
        options: [
          '모터에는 큰 전류·전압을 바로 주면서, 5V 벅 컨버터가 ESP32에는 안정적인 5V를 별도로 공급해 모터 시동 시 보드가 재부팅(Brownout)되지 않게 하기 위해',
          '선 개수를 늘려 복잡하게 보이기 위해',
          '5V 벅 컨버터가 Wi-Fi 안테나 역할을 하기 때문',
          'TB6612가 220V로 작동하기 때문',
        ],
        correctIndex: 0,
        explanation:
          '동력 계통(모터)과 두뇌 계통(ESP32)의 전류 경로를 분리하고 레귤레이터로 전압을 안정화해야 실전 주행 중 보드 리셋을 막을 수 있습니다.',
      },
    ],
  },
];
