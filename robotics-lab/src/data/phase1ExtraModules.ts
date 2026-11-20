import { LabModule } from '../types/lab';

export const PHASE1_EXTRA_MODULES: LabModule[] = [
  {
    id: 'day02_breadboard',
    order: 2,
    dayLabel: 'Day 02',
    phaseLabel: 'Phase 1 · 전기/보드 기초',
    title: '브레드보드(빵판) 구조 & 멀티미터 실전',
    shortTitle: 'D02 · 빵판/측정',
    subtitle: '내부 구리 레일 방향 · 쇼트(합선) 방지 · 멀티미터 DC V/Ω/도통 검사',
    badge: '하드웨어 기초',
    milestoneTag: 'Day 02 아이소메트릭 빵판 랩',
    failFirstHook:
      '빵판 내부 구멍이 어느 방향으로 이어져 있는지 모르고 LED 두 다리를 같은 5핀 가로줄에 꽂거나, +와 -를 같은 레일에 꽂으면 전기가 부품을 건너뛰어 합선(Short)되며 배터리가 순식간에 과열됩니다.',
    beginnerAnalogy:
      '브레드보드는 하얀 플라스틱 뚜껑 아래에 "숨겨진 금속 다리"가 깔려 있는 레고판입니다. 양쪽 끝 긴 줄(+/-)은 세로로 쭉 이어져 있고, 안쪽 5칸(a~e / f~j)은 가로로만 이어져 있으며 가운데 골짜기(Trench)는 완전히 끊어져 있습니다.',
    overviewSummary:
      '납땜 없이 회로를 꽂아 실험할 때 가장 먼저 익혀야 할 것은 브레드보드의 내부 결선 지도와 멀티미터(테스터기) 사용법입니다. 전원을 꽂기 전 단 3초의 도통 검사만으로 보드 소손 사고의 80%를 막을 수 있습니다.',
    guidedMissions: [
      {
        id: 'd02-xray',
        title: '"분해 보기"를 눌러 빵판 플라스틱 덮개 아래 숨겨진 구리 레일 확인하기',
        hint: '3D 화면 우측 상단 "분해 보기" 버튼을 눌러 내부 금속 클립 배열을 관찰하세요.',
      },
      {
        id: 'd02-short',
        title: '배선 시나리오를 "합선(Short)"으로 바꿔 왜 고장 나는지 눈으로 확인하기',
        hint: '직접 실습 탭에서 배선 시나리오를 "같은 줄 합선" 또는 "IC 다리 쇼트"로 전환하세요.',
      },
      {
        id: 'd02-multimeter',
        title: '멀티미터 모드를 전압(V) · 저항(Ω) · 도통(BEEP)으로 바꿔보기',
        hint: '직접 실습 탭의 멀티미터 모드 버튼을 눌러 측정값이 어떻게 달라지는지 확인하세요.',
      },
    ],
    highlights: [
      {
        title: '전원 레일(세로) vs 터미널 스트립(가로 5칸)',
        body: '양쪽 가장자리 빨강(+)/파랑(-) 전원 레일은 위에서 아래로 길게 연결되어 있고(일부 대형 빵판은 중앙에서 한 번 끊김), 중앙 a~e 5개 구멍과 f~j 5개 구멍은 서로 가로로 연결되어 있습니다.',
        tone: 'cyan',
      },
      {
        title: '가운데 골짜기(Center Trench)의 존재 이유',
        body: 'ESP32 보드나 칩(IC)을 중앙 골짜기를 가로질러 꽂아야 왼쪽 다리(a~e)와 오른쪽 다리(f~j)가 서로 쇼트되지 않고 각각 독립된 4개씩의 여유 구멍을 확보할 수 있습니다.',
        tone: 'emerald',
      },
      {
        title: '전원 투입 전 멀티미터 3초 규칙 (도통 & 저항 측정)',
        body: '전원(+VCC)을 꽂기 전, 멀티미터를 도통(삐- 소리) 모드로 두고 VCC 레일과 GND 레일을 찍어보세요. 여기서 "삐-" 소리가 나면 100% 합선이므로 절대 배터리를 연결하면 안 됩니다.',
        tone: 'rose',
      },
    ],
    formulas: [
      {
        title: '도통(Continuity) 및 직류 전압 측정 원리',
        latex: String.raw`R_{\text{short}} \approx 0\,\Omega \implies \text{BEEP! (위험)}, \quad V_{\text{rail}} = V_{\text{VCC}} - V_{\text{GND}}`,
        description:
          '전원 인가 전에는 저항/도통 모드로 0Ω 합선을 검사하고, 전원 인가 후에는 DC 전압(V) 모드로 각 노드의 전위를 측정합니다.',
      },
    ],
    specs: [
      { label: '중앙 터미널 줄', value: '5-Pin 가로 연결', note: 'a-b-c-d-e 독립 묶음', tone: 'cyan' },
      { label: '외곽 전원 레일', value: '+/- 세로 연결', note: 'VCC·GND 분배용', tone: 'emerald' },
      { label: '전압 측정 (DC V)', value: '병렬 연결', note: '전원 켜고 빨강(+)/검정(GND)', tone: 'amber' },
      { label: '저항 / 도통 측정', value: '무전원 상태 필수', note: '전원 끄고 측정해야 정확', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '빨강 프로브 (VΩmA) / 검정 프로브 (COM)',
        pin: 'COM = 항상 GND · 빨강 = 측정점',
        detail: 'DC 전압을 잴 때 검정 프로브를 GND에 대고 빨강 프로브로 각 핀을 짚으면 기준 대비 전압이 나옵니다.',
      },
      {
        signal: '저항(Ω) 및 도통(Beep) 측정 주의',
        pin: '반드시 전원 OFF 상태에서 측정',
        detail: '전원이 켜진 회로에 저항/도통 모드를 대면 오차가 나거나 멀티미터 내부 퓨즈가 끊어질 수 있습니다.',
        warning: '전류(A) 측정 단자에 프로브를 꽂은 채 전압을 재면 즉시 합선(퓨즈 단선)됩니다!',
      },
    ],
    codeTitle: 'day02_breadboard_probe_test.ino',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 02: 브레드보드 배선 검증용 간단한 GPIO 테스트 스케치
// 빵판의 서로 다른 5핀 행(Row)에 저항과 LED를 걸쳐 꽂았는지 확인합니다.

const int TEST_PIN = 13;

void setup() {
  Serial.begin(115200);
  pinMode(TEST_PIN, OUTPUT);
  Serial.println("Breadboard Check: 멀티미터 빨강 프로브를 GPIO 13과 GND에 대보세요.");
}

void loop() {
  digitalWrite(TEST_PIN, HIGH); // 멀티미터에서 약 3.30V가 측정되어야 정상!
  delay(2000);
  digitalWrite(TEST_PIN, LOW);  // 멀티미터에서 약 0.00V가 측정되어야 정상!
  delay(2000);
}`,
    codeChallenge: {
      prompt: '멀티미터로 저항값을 재려고 하는데 숫자가 이상하게 튀고 퓨즈가 날 것 같습니다. 코드/측정 절차 중 잘못된 행동은?',
      buggyLine: '// 전원(5V)을 켠 상태에서 멀티미터를 저항(Ω) 모드로 놓고 회로에 찍었다!',
      options: [
        '회로 전원을 완전히 끈(OFF) 상태에서 저항/도통 모드로 측정한다.',
        '멀티미터 전류(10A) 단자로 옮겨서 전압을 측정한다.',
        '전원을 켠 채로 배터리의 +와 -를 도통 모드로 바로 연결한다.',
      ],
      correctIndex: 0,
      explanation:
        '저항(Ω)과 도통(Beep) 모드는 멀티미터 자체가 미세한 시험 전류를 흘려보내 저항을 계산하므로, 반드시 회로의 외부 전원을 끄고 측정해야 합니다.',
    },
    quizzes: [
      {
        id: 'P1D2-1',
        question: '일반 브레드보드(빵판)의 중앙 영역(a~e열, f~j열) 내부 금속 클립 연결 구조로 올바른 것은?',
        options: [
          'a~e 5개 구멍이 가로 한 줄로 연결되어 있고, 가운데 골짜기를 건너 f~j와는 분리되어 있다.',
          '세로 방향 전체가 하나의 긴 구리판으로 연결되어 있다.',
          'a~j 10개 구멍이 가운데 골짜기 없이 전부 통째로 연결되어 있다.',
          '모든 구멍이 서로 절연되어 있어 점퍼선으로 하나하나 납땜해야 한다.',
        ],
        correctIndex: 0,
        explanation:
          '중앙 터미널 스트립은 가로 5칸(a~e, f~j) 단위로 연결되어 있으며, 중앙 골짜기(Center Trench)가 양쪽을 분리해 DIP 칩이나 ESP32 보드를 안전하게 꽂을 수 있게 해줍니다.',
      },
      {
        id: 'P1D2-2',
        question: 'LED의 두 다리(+)와 (-)를 실수로 브레드보드 중앙의 같은 가로줄(예: 12a와 12c)에 나란히 꽂으면 어떤 현상이 생기나요?',
        options: [
          '두 배 더 밝게 빛난다.',
          '내부 구리 클립을 통해 전류가 LED를 거치지 않고 바로 빠져나가(Short) 불이 켜지지 않는다.',
          'LED가 파란색으로 변한다.',
          '전압이 두 배로 증폭된다.',
        ],
        correctIndex: 1,
        explanation:
          '같은 5핀 가로줄(12a~12e)은 내부에서 이미 하나로 이어져 있으므로, 부품의 두 다리를 같은 줄에 꽂으면 양쪽 다리가 단락(Short)되어 전류가 부품으로 흐르지 못합니다.',
      },
      {
        id: 'P1D2-3',
        question: '회로 조립 후 배터리를 꽂기 직전, 합선(Short) 여부를 3초 만에 확인하는 가장 안전한 멀티미터 사용법은?',
        options: [
          '배터리를 먼저 꽂아 연기가 나는지 냄새를 맡아본다.',
          '전원 OFF 상태에서 멀티미터 도통(Beep) 모드로 VCC와 GND 사이를 찍어 삐- 소리가 안 나는지 확인한다.',
          '멀티미터를 교류(AC 750V) 모드로 두고 칩 위를 문지른다.',
          '검정 프로브만 들고 GND를 짚는다.',
        ],
        correctIndex: 1,
        explanation:
          '전원을 연결하기 전 도통 검사로 VCC와 GND 사이에 0Ω 단락이 없는지 확인하는 습관은 실제 보드 파손을 막는 가장 확실한 엔지니어링 안전 수칙입니다.',
      },
      {
        id: 'P1D2-4',
        question: 'ESP32 개발 보드(DevKit)를 브레드보드에 꽂을 때 반드시 지켜야 하는 배치 방법은?',
        options: [
          '양쪽 핀 헤더가 중앙 골짜기(Trench)를 사이에 두고 a~e와 f~j에 나뉘어 들어가게 꽂는다.',
          '모든 핀을 바깥쪽 + 전원 레일에 한꺼번에 꽂는다.',
          '한쪽 줄의 같은 가로 행에 양쪽 헤더를 겹쳐 꽂는다.',
          '빵판 위에 옆으로 눕혀서 올려둔다.',
        ],
        correctIndex: 0,
        explanation:
          '반드시 중앙 골짜기를 가로질러 꽂아야 좌측 15핀과 우측 15핀이 서로 단락되지 않고, 각 핀 옆에 외부 센서를 연결할 구멍이 남습니다.',
      },
      {
        id: 'P1D2-5',
        question: '멀티미터로 직류 전압(DC V)을 측정할 때 프로브 연결 규칙으로 옳은 것은?',
        options: [
          '회로 전원을 끈 뒤 저항과 직렬로 끼운다.',
          '회로 전원을 켠 상태에서 검정(COM)은 GND에, 빨강은 측정하려는 노드에 병렬로 댄다.',
          '빨강 프로브를 GND에, 검정 프로브를 10A 단자에 꽂는다.',
          '전선 피복 위 플라스틱 부분을 짚는다.',
        ],
        correctIndex: 1,
        explanation:
          '전압은 두 지점 사이의 전위차이므로 회로를 동작시킨 상태에서 측정 대상 노드에 병렬로 접촉하여 읽습니다.',
      },
    ],
  },
  {
    id: 'day03_digital',
    order: 3,
    dayLabel: 'Day 03',
    phaseLabel: 'Phase 1 · 전기/보드 기초',
    title: '디지털 신호(0과 1) & 플로팅 현상',
    shortTitle: 'D03 · 디지털/풀업',
    subtitle: '3.3V vs 5V 로직 문턱값 · 플로팅 노이즈 · 풀업/풀다운 10kΩ 저항',
    badge: '디지털 입력',
    milestoneTag: 'Day 03 아이소메트릭 풀업 랩',
    failFirstHook:
      '버튼 스위치 하나를 ESP32 입력 핀에 연결하면서 풀업/풀다운 저항을 빼먹으면, 버튼을 누르지도 않았는데 주변 전자기 노이즈 때문에 핀 값이 0과 1을 미친 듯이 오가며 로봇이 오작동합니다.',
    beginnerAnalogy:
      '저항이 연결되지 않은 디지털 입력 핀(Floating)은 바람 부는 들판에 묶여 있지 않은 깃발과 같습니다. 10kΩ 풀업 저항은 깃발을 평소 3.3V(HIGH) 천장에 매달아 두는 고무줄이고, 풀다운 저항은 0V(LOW) 바닥에 묶어두는 고무줄입니다.',
    overviewSummary:
      '마이크로컨트롤러는 전압을 읽어 0(LOW) 또는 1(HIGH)로 판정합니다. 하지만 전선이 아무 전압에도 연결되지 않고 공중에 뜨는(Floating) 순간 전압이 불규칙하게 요동칩니다. 10kΩ 풀업/풀다운 저항과 디바운싱 원리를 3D로 검증해 보세요.',
    guidedMissions: [
      {
        id: 'd03-floating',
        title: '풀업/풀다운 없이 "플로팅(Floating)" 상태로 두고 전압이 흔들리는 모습 관찰하기',
        hint: '직접 실습 탭에서 회로를 "플로팅(저항 없음)"으로 두고 버튼이 안 눌렸을 때의 노이즈를 확인하세요.',
      },
      {
        id: 'd03-pullup',
        title: '"풀업(Pull-up 10kΩ)"으로 바꿔 평소 3.3V 안정 상태 만들기',
        hint: '직접 실습 탭에서 "풀업(Pull-up)"을 선택하면 10kΩ 저항이 3.3V 쪽으로 연결됩니다.',
      },
      {
        id: 'd03-press',
        title: '스위치 버튼을 눌러 논리 상태가 반전(HIGH ↔ LOW)되는지 확인하기',
        hint: '버튼 누르기 토글로 누름/뗌 상태의 전압 변화를 비교하세요.',
      },
    ],
    highlights: [
      {
        title: '3.3V CMOS 로직 문턱 전압 (VIH / VIL)',
        body: 'ESP32(3.3V 기준)는 약 0.75 × 3.3V ≈ 2.48V 이상이면 확실한 HIGH(1), 0.25 × 3.3V ≈ 0.83V 이하이면 확실한 LOW(0)로 읽습니다. 그 사이 회색 지대에 머물면 값이 불안정합니다.',
        tone: 'cyan',
      },
      {
        title: '풀업(Pull-up)의 반전 논리: 누르면 LOW(0)',
        body: '아두이노/ESP32 실무에서는 대부분 내부/외부 풀업(pinMode(pin, INPUT_PULLUP))을 씁니다. 평소에는 3.3V(HIGH), 버튼을 눌러 GND와 이어질 때 LOW(0)가 읽히는 Active-Low 방식입니다.',
        tone: 'emerald',
      },
      {
        title: '왜 100Ω이 아니라 10kΩ을 쓸까?',
        body: '만약 100Ω 같은 작은 저항으로 풀업을 걸면 버튼을 누를 때마다 3.3V / 100Ω = 33mA가 낭비되어 배터리가 닳고 저항이 뜨거워집니다. 10kΩ(0.33mA)은 노이즈를 잡으면서도 전류 낭비를 거의 없앤 표준값입니다.',
        tone: 'amber',
      },
    ],
    formulas: [
      {
        title: '풀업 저항을 통한 버튼 누름 시 소비 전류',
        latex: String.raw`I_{\text{pullup}} = \frac{V_{CC}}{R_{\text{pull}}} = \frac{3.3\text{ V}}{10\,\text{k}\Omega} = 0.33\text{ mA}`,
        description:
          '10kΩ을 쓰면 스위치를 눌러도 단 0.33mA만 흘러 안전하고 전력 낭비가 적습니다.',
      },
    ],
    specs: [
      { label: 'HIGH 판정 (VIH)', value: '≥ 2.48 V', note: '3.3V × 0.75 이상', tone: 'emerald' },
      { label: 'LOW 판정 (VIL)', value: '≤ 0.83 V', note: '3.3V × 0.25 이하', tone: 'cyan' },
      { label: '표준 풀업/다운', value: '10 kΩ', note: '버튼 전류 0.33mA', tone: 'amber' },
      { label: 'GPIO 34~39 주의', value: '내부 풀업 없음', note: '반드시 외부 10kΩ 필요', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '내부 풀업 사용 (권장)',
        pin: 'GPIO 32 ↔ 버튼 ↔ GND',
        detail: 'pinMode(32, INPUT_PULLUP) 선언 시 저항을 따로 꽂지 않아도 내부 ~45kΩ 풀업이 켜집니다.',
      },
      {
        signal: '입력 전용 핀(GPIO 34~39) 버튼 연결',
        pin: '3.3V ─[10kΩ]─ GPIO 34 ─ 버튼 ─ GND',
        detail: 'GPIO 34, 35, 36, 39는 내부 풀업/다운 회로가 아예 없으므로 반드시 외부 10kΩ 저항을 달아야 플로팅을 막습니다.',
        warning: 'GPIO 34에 INPUT_PULLUP을 써도 작동하지 않아 플로팅 현상이 발생합니다!',
      },
    ],
    codeTitle: 'day03_pullup_debounce.ino',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 03: 풀업(Active-Low) 버튼 읽기 & 간단한 소프트웨어 디바운싱
const int BTN_PIN = 32; // 내부 풀업 지원 안전 핀 (34~39는 외부 10kΩ 필수!)

void setup() {
  Serial.begin(115200);
  pinMode(BTN_PIN, INPUT_PULLUP); // 평소 HIGH(1), 누르면 LOW(0)
}

void loop() {
  if (digitalRead(BTN_PIN) == LOW) {
    delay(20); // 20ms 기다려 기계식 스위치 채터링(떨림) 안정화
    if (digitalRead(BTN_PIN) == LOW) {
      Serial.println("버튼 확실히 눌림! (LOW)");
      while (digitalRead(BTN_PIN) == LOW) { delay(5); } // 뗄 때까지 대기
    }
  }
}`,
    codeChallenge: {
      prompt: 'GPIO 32번 핀에 버튼 한쪽을 연결하고 반대쪽을 GND에 꽂았습니다. 외부 저항 없이 플로팅을 막으려면 setup()을 어떻게 고쳐야 할까요?',
      buggyLine: 'pinMode(BTN_PIN, INPUT); // 내부 풀업이 꺼져 있어 플로팅 발생!',
      options: [
        'pinMode(BTN_PIN, INPUT_PULLUP);',
        'pinMode(BTN_PIN, OUTPUT);',
        'digitalWrite(BTN_PIN, LOW);',
      ],
      correctIndex: 0,
      explanation:
        '버튼 반대쪽이 GND에 연결되어 있을 때는 INPUT_PULLUP으로 내부 풀업을 켜야 평소에는 3.3V(HIGH)로 고정되고 누를 때만 0V(LOW)가 읽힙니다.',
    },
    quizzes: [
      {
        id: 'P1D3-1',
        question: '아무 저항도 없이 스위치 한쪽만 연결된 디지털 입력 핀이 손도 안 댔는데 0과 1을 무작위로 오가는 현상은?',
        options: [
          '플로팅(Floating) 현상',
          '브라운아웃(Brownout) 현상',
          '역기전력(Back-EMF) 현상',
          '와인드업(Windup) 현상',
        ],
        correctIndex: 0,
        explanation:
          '입력 핀의 임피던스가 매우 높아 기준 전압에 묶여 있지 않으면 주변 전파·정전기를 안테나처럼 받아 0과 1 사이를 떠도는 플로팅(Floating) 현상이 일어납니다.',
      },
      {
        id: 'P1D3-2',
        question: '풀업(Pull-up) 저항이 연결된 회로의 동작 논리(Active-Low)로 올바른 것은?',
        options: [
          '버튼을 안 누르면 0V(LOW), 누르면 3.3V(HIGH)가 읽힌다.',
          '버튼을 안 누르면 3.3V(HIGH), 버튼을 눌러 GND와 연결되면 0V(LOW)가 읽힌다.',
          '버튼을 누르면 핀이 6.6V로 두 배 상승한다.',
          '버튼 상태와 무관하게 항상 1.65V만 읽힌다.',
        ],
        correctIndex: 1,
        explanation:
          '풀업 저항이 핀을 3.3V로 당겨두고 있다가, 버튼을 누르는 순간 핀이 GND(0V)와 직결되므로 LOW(0)가 읽힙니다.',
      },
      {
        id: 'P1D3-3',
        question: '풀업/풀다운 저항값으로 10Ω처럼 작은 값이 아니라 보통 10kΩ을 사용하는 주된 이유는?',
        options: [
          '10Ω을 쓰면 스위치를 눌렀을 때 V/R 전류가 지나치게 크게 흘러 전력 낭비 및 발열/합선 위험이 커지기 때문',
          '10kΩ 저항이 색깔이 더 예뻐서',
          '10Ω은 전기를 아예 통과시키지 않기 때문',
          'ESP32가 10Ω 이하 저항만 인식할 수 있어서',
        ],
        correctIndex: 0,
        explanation:
          '3.3V / 10Ω = 330mA가 흘러 레귤레이터나 저항이 타버립니다. 10kΩ이면 0.33mA만 흘러 전력을 거의 소모하지 않으면서도 안정적으로 논리 레벨을 고정합니다.',
      },
      {
        id: 'P1D3-4',
        question: 'ESP32에서 pinMode(pin, INPUT_PULLUP)을 선언해도 내부 풀업 저항이 동작하지 않아 반드시 외부 10kΩ 저항을 붙여야 하는 핀은?',
        options: ['GPIO 13', 'GPIO 21', 'GPIO 32', 'GPIO 34'],
        correctIndex: 3,
        explanation:
          '입력 전용 핀(GPIO 34, 35, 36, 39)은 내부 풀업/풀다운 회로가 생략되어 있으므로 반드시 외부 저항 회로를 구성해야 합니다.',
      },
      {
        id: 'P1D3-5',
        question: '기계식 버튼을 한 번 눌렀는데 코드에서 3~5번 눌린 것처럼 인식되는 "채터링(Bouncing)" 문제를 해결하는 방법은?',
        options: [
          '전원 전압을 12V로 올린다.',
          '상태 변화 감지 후 10~30ms 정도 기다려 접점 떨림이 가라앉은 뒤 다시 읽는다(디바운싱).',
          'GND 선을 제거한다.',
          '버튼을 1초에 100번씩 빠르게 누른다.',
        ],
        correctIndex: 1,
        explanation:
          '물리적 금속 접점은 닿는 순간 수 ms 동안 미세하게 튕기므로, 10~30ms 지연 또는 타이머 필터로 안정화된 값을 취하는 디바운싱이 필요합니다.',
      },
    ],
  },
  {
    id: 'day04_adc_pwm',
    order: 4,
    dayLabel: 'Day 04',
    phaseLabel: 'Phase 1 · 전기/보드 기초',
    title: '아날로그 신호(ADC) & PWM의 마법',
    shortTitle: 'D04 · ADC/PWM',
    subtitle: '12-bit ADC 양자화(0~4095) · PWM 주파수 & 듀티 사이클 · 서보 제어',
    badge: '신호 변환',
    milestoneTag: 'Day 04 아이소메트릭 ADC·PWM 랩',
    failFirstHook:
      '마이크로컨트롤러 핀에 "모터를 절반 속도로 돌리게 1.65V만 내보내라"고 하면 일반 디지털 핀은 못 합니다. 0V와 3.3V 두 가지밖에 못 내보내기 때문에, 아주 빠르게 깜빡여 평균 전압을 흉내 내는 PWM을 써야 합니다.',
    beginnerAnalogy:
      '가변저항 다이얼의 부드러운 값을 4,096칸 자로 재서 숫자로 읽는 것이 ADC이고, 선풍기 스위치를 1초에 1,000번 켰다 껐다 하면서 켜져 있는 시간 비율(듀티 사이클)로 바람 세기를 조절하는 것이 PWM입니다.',
    overviewSummary:
      '현실 세계는 연속적인 아날로그(전압, 속도, 빛)지만 컴퓨터는 0과 1의 디지털입니다. 아날로그 입력을 숫자로 바꾸는 12-bit ADC와, 디지털 ON/OFF 펄스로 LED 밝기·DC 모터 속도·서보 각도를 제어하는 PWM을 3D 파형과 모터로 익힙니다.',
    guidedMissions: [
      {
        id: 'd04-adc',
        title: '아날로그 전압 다이얼을 돌려 12-bit ADC 숫자(0~4095) 변화 확인하기',
        hint: '직접 실습 탭에서 "아날로그 입력 전압" 슬라이더를 움직여 3D 노브와 12-bit 값을 보세요.',
      },
      {
        id: 'd04-pwm',
        title: 'PWM 듀티 사이클(%)을 조절해 3D 펄스 폭과 모터 회전 속도 변화 보기',
        hint: '듀티 사이클 슬라이더를 20% → 80%로 올리면 3D 사각파 폭과 로터 속도가 변합니다.',
      },
      {
        id: 'd04-freq',
        title: 'PWM 주파수를 "50Hz 서보 모드"로 전환해 각도 제어 원리 보기',
        hint: '직접 실습 탭에서 PWM 주파수 버튼을 "50Hz (서보)"로 눌러보세요.',
      },
    ],
    highlights: [
      {
        title: '12-bit ADC 분해능: 2¹² = 4,096단계 (0 ~ 4095)',
        body: '아두이노 우노는 10-bit(0~1023)지만 ESP32는 12-bit(0~4095)를 기본 지원합니다. 3.3V / 4095 ≈ 0.8mV 단위로 세밀하게 전압을 측정할 수 있습니다.',
        tone: 'cyan',
      },
      {
        title: 'PWM 듀티 사이클 (Duty Cycle) = 평균 전압 결정',
        body: '한 주기 중 HIGH 상태가 차지하는 비율이 듀티 사이클(%)입니다. 3.3V에서 듀티가 50%면 평균 1.65V, 25%면 평균 0.825V를 공급하는 효과를 냅니다.',
        tone: 'emerald',
      },
      {
        title: 'DC 모터(고주파 듀티) vs 서보 모터(50Hz 펄스폭)',
        body: 'DC 모터나 LED는 보통 1kHz~20kHz의 빠른 PWM 듀티 비율(0~100%)로 세기를 조절하지만, 표준 RC 서보 모터(SG90 등)는 반드시 50Hz(주기 20ms) 안에서 HIGH 펄스 폭(0.5ms~2.5ms) 길이로 각도(0°~180°)를 읽습니다.',
        tone: 'amber',
      },
    ],
    formulas: [
      {
        title: '12-bit ADC 변환 & PWM 평균 전압 계산식',
        latex: String.raw`\text{ADC}_{\text{raw}} = \operatorname{round}\!\left(\frac{V_{\text{in}}}{3.3\text{ V}} \times 4095\right), \quad V_{\text{avg}} = V_{\text{high}} \times \frac{\text{Duty}\,(\%)}{100}`,
        description:
          '예: 1.65V 입력 시 ADC는 약 2048을 반환하며, 3.3V 60% PWM의 평균 전압은 1.98V입니다.',
      },
    ],
    specs: [
      { label: 'ESP32 ADC 분해능', value: '12-bit (0~4095)', note: '1단계 ≈ 0.806 mV', tone: 'cyan' },
      { label: '듀티 사이클 범위', value: '0 ~ 100 %', note: '평균 출력 전압 비례', tone: 'emerald' },
      { label: 'LED/모터 PWM', value: '1 ~ 20 kHz', note: '가청 노이즈·깜빡임 회피', tone: 'amber' },
      { label: '서보 모터 PWM', value: '50 Hz (20 ms)', note: '0.5~2.5ms 펄스폭 각도', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '가변저항 / 아날로그 센서',
        pin: 'GPIO 34 (ADC1_CH6)',
        detail: 'Wi-Fi 사용 시에도 충돌 없는 ADC1 채널(32~39)에 연결하세요.',
      },
      {
        signal: 'PWM 출력 (LEDC)',
        pin: 'GPIO 13 (서보/모터 제어 안전 핀)',
        detail: '입력 전용 핀(34, 35, 36, 39)에서는 PWM 출력이 불가능합니다.',
        warning: '서보 전원(+5V)은 보드 3V3이 아니라 외부 5V 전원에서 공급해야 합니다.',
      },
    ],
    codeTitle: 'day04_adc_to_pwm.ino',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 04: 12-bit ADC 가변저항 값을 읽어 8-bit PWM으로 모터/LED 제어하기
const int POT_PIN = 34; // 12-bit ADC1 입력 (0 ~ 4095)
const int PWM_PIN = 13; // LEDC PWM 출력 (안전 핀)

void setup() {
  Serial.begin(115200);
  // 1000Hz, 8-bit 해상도(0~255)로 PWM 채널 설정 (ESP32 Arduino Core 3.x)
  ledcAttach(PWM_PIN, 1000, 8);
}

void loop() {
  int adcRaw = analogRead(POT_PIN);            // 0 ~ 4095
  int duty8bit = map(adcRaw, 0, 4095, 0, 255); // 0 ~ 255 듀티 변환
  ledcWrite(PWM_PIN, duty8bit);

  float voltage = (adcRaw / 4095.0) * 3.3;
  Serial.printf("ADC=%d (%.2fV) -> PWM Duty=%d/255\\n", adcRaw, voltage, duty8bit);
  delay(50);
}`,
    codeChallenge: {
      prompt: '가변저항 값(0~4095)을 8-bit PWM(0~255)으로 매핑하려는데, 듀티가 25% 이상으로 올라가지 않는 버그가 있습니다. 잘못된 줄을 고쳐보세요!',
      buggyLine: 'int duty8bit = map(adcRaw, 0, 4095, 0, 64); // 최대치가 255가 아니라 64!',
      options: [
        'int duty8bit = map(adcRaw, 0, 4095, 0, 255);',
        'int duty8bit = map(adcRaw, 0, 1023, 0, 255);',
        'int duty8bit = map(adcRaw, 0, 4095, 0, 4095);',
      ],
      correctIndex: 0,
      explanation:
        'ESP32의 analogRead()는 12-bit(0~4095)를 반환하고, 8-bit로 설정한 PWM은 0~255 범위를 받으므로 map(adcRaw, 0, 4095, 0, 255)가 정확합니다.',
    },
    quizzes: [
      {
        id: 'P1D4-1',
        question: '3.3V 기준 ESP32의 12-bit ADC(0~4095) 핀에 정확히 1.65V를 입력하면 읽히는 원시(Raw) 숫자값은 약 얼마인가요?',
        options: ['512', '1024', '2048', '4095'],
        correctIndex: 2,
        explanation:
          '1.65V는 최대 전압 3.3V의 정확히 절반(50%)이므로, 4095의 절반인 약 2048이 읽힙니다.',
      },
      {
        id: 'P1D4-2',
        question: '3.3V 디지털 핀에서 1kHz PWM 신호를 듀티 사이클 25%로 출력할 때, 부하가 느끼는 평균 전압은?',
        options: ['0.33 V', '0.825 V', '1.65 V', '3.3 V'],
        correctIndex: 1,
        explanation:
          '평균 전압 = 3.3V × 0.25 = 0.825V입니다. 듀티 사이클 비율에 비례해 평균 전력이 조절됩니다.',
      },
      {
        id: 'P1D4-3',
        question: '일반 RC 서보 모터(SG90 등)를 제어할 때 사용하는 표준 PWM 주파수와 주기(Period)는?',
        options: [
          '1 Hz (주기 1000 ms)',
          '50 Hz (주기 20 ms)',
          '1,000 Hz (주기 1 ms)',
          '40,000 Hz (주기 25 μs)',
        ],
        correctIndex: 1,
        explanation:
          '표준 아날로그/디지털 RC 서보는 매 20ms(50Hz)마다 들어오는 0.5ms~2.5ms 길이의 HIGH 펄스 폭으로 목표 각도를 해석합니다.',
      },
      {
        id: 'P1D4-4',
        question: 'LED 밝기를 조절하려고 PWM 주파수를 10Hz로 낮췄을 때 발생하는 현상은?',
        options: [
          'LED가 1초에 10번 깜빡거리는 것이 사람 눈에 그대로 보인다.',
          'LED가 두 배 더 밝아진다.',
          '전류가 0mA가 된다.',
          'ESP32가 자동으로 5V로 승압된다.',
        ],
        correctIndex: 0,
        explanation:
          '사람 눈의 잔상 효과 때문에 60Hz 이하의 낮은 주파수는 깜빡임(Flicker)으로 보입니다. LED 디밍은 보통 500Hz~5kHz 이상을 사용합니다.',
      },
      {
        id: 'P1D4-5',
        question: 'ESP32에서 PWM 출력 핀으로 절대로 할당할 수 없는 핀 그룹은?',
        options: [
          'GPIO 13, 18, 27',
          'GPIO 32, 33',
          'GPIO 34, 35, 36, 39 (입력 전용 GPI)',
          'GPIO 21, 22',
        ],
        correctIndex: 2,
        explanation:
          'GPIO 34, 35, 36, 39는 내부 출력 드라이버가 없는 입력 전용 핀(GPI)이므로 PWM이나 디지털 HIGH/LOW 출력이 불가능합니다.',
      },
    ],
  },
  {
    id: 'day05_divider',
    order: 5,
    dayLabel: 'Day 05',
    phaseLabel: 'Phase 1 · 전기/보드 기초',
    title: '전압 분배기 & 로직 레벨 시프터',
    shortTitle: 'D05 · 전압 분배기',
    subtitle: '5V 센서 → 3.3V 보드 안전 강압 · R1/R2 저항비 계산 · 양방향 I2C',
    badge: '회로 보호',
    milestoneTag: 'Day 05 아이소메트릭 분압기 랩',
    failFirstHook:
      'HC-SR04 초음파 센서처럼 5V 신호를 뱉는 부품을 3.3V 전용 ESP32 GPIO에 직결하면 핀 내부 보호 다이오드로 과전류가 흘러 핀이 망가지거나 보드 수명이 급격히 줄어듭니다.',
    beginnerAnalogy:
      '전압 분배기는 5m 높이 폭포수를 두 개의 계단(R1=10kΩ, R2=20kΩ)으로 나눠 3.3m 높이 지점에서 받아 마시는 완충 계단입니다. 아랫계단(R2) 비율만큼만 전압을 나눠 갖습니다.',
    overviewSummary:
      '로봇 부품은 5V(초음파, 아두이노 센서)와 3.3V(ESP32, IMU, 라즈베리파이)가 뒤섞여 있습니다. 직렬 저항 2개로 원하는 전압을 딱 잘라 만드는 전압 분배 공식과 양방향 레벨 시프터의 차이를 3D 회로로 확인하세요.',
    guidedMissions: [
      {
        id: 'd05-over',
        title: 'R1을 0Ω(직결)으로 만들어 ESP32 핀 과전압 경고 체험하기',
        hint: '직접 실습 탭에서 R1 슬라이더를 0kΩ으로 내리거나 "0Ω 직결" 프리셋을 눌러보세요.',
      },
      {
        id: 'd05-safe',
        title: '5V 입력을 R1=10kΩ, R2=20kΩ으로 맞춰 3.33V 안전 구간 달성하기',
        hint: '표준 분압 프리셋을 누르거나 R1=10k, R2=20k로 조절해 초록색 SAFE 상태를 확인하세요.',
      },
      {
        id: 'd05-code',
        title: '코드 랩에서 전압 분배 역산 버그 수정하기',
        hint: '코드 랩 탭의 배터리 전압 역산 챌린지를 풀어보세요.',
      },
    ],
    highlights: [
      {
        title: '전압 분배 공식: V_out = V_in × R₂ / (R₁ + R₂)',
        body: '위쪽 저항 R1(신호 소스 측)과 아래쪽 저항 R2(GND 측)가 직렬로 연결되면 중간 지점 전압은 전체 저항 합 대비 R2의 비율만큼만 남습니다. 5V에서 10kΩ + 20kΩ을 쓰면 5 × 20 / 30 = 3.33V가 됩니다.',
        tone: 'cyan',
      },
      {
        title: '분압기로 큰 전력(모터/전원)을 공급하면 안 되는 이유',
        body: '전압 분배기는 오직 전류를 거의 안 먹는 "신호(Signal)"나 ADC 전압 측정 전용입니다. 저항에 전류가 많이 흐르면 전압이 뚝 떨어지고 저항이 타므로 전원 공급에는 레귤레이터(벅 컨버터)를 써야 합니다.',
        tone: 'rose',
      },
      {
        title: '고속 양방향 통신(I2C/SPI)은 전용 레벨 시프터 사용',
        body: '저항 분배기는 한 방향(5V→3.3V)만 가능하고 저항값이 크면 고속 파형이 뭉개집니다. I2C(SDA/SCL)처럼 양방향으로 신호가 오가는 선은 MOSFET 기반 양방향 로직 레벨 시프터 모듈을 씁니다.',
        tone: 'amber',
      },
    ],
    formulas: [
      {
        title: '직렬 저항 전압 분배 (Voltage Divider)',
        latex: String.raw`V_{\text{out}} = V_{\text{in}} \cdot \frac{R_2}{R_1 + R_2}`,
        description:
          '예: 5.0V 입력에 R1 = 10kΩ, R2 = 20kΩ → V_out = 5.0 × (20 / 30) = 3.33V (안전!)',
      },
      {
        title: '분압 후 원시 배터리 전압 역산식 (ADC 계측용)',
        latex: String.raw`V_{\text{batt}} = V_{\text{ADC}} \cdot \frac{R_1 + R_2}{R_2}`,
        description:
          '예: 1:1 분압(10kΩ+10kΩ)으로 8.4V 배터리를 절반(4.2V) 혹은 1/3로 줄여 읽은 뒤 코드에서 배수를 다시 곱해 복원합니다.',
      },
    ],
    specs: [
      { label: '5V→3.3V 표준 비', value: '10kΩ + 20kΩ', note: 'V_out = 3.33V', tone: 'emerald' },
      { label: '5V→2.5V 대칭 비', value: '10kΩ + 10kΩ', note: '3.3V 보드 HIGH 인식 OK', tone: 'cyan' },
      { label: 'GPIO 3.3V 상한', value: '최대 3.6 V', note: '5V 직결 시 손상 위험', tone: 'rose' },
      { label: 'I2C 양방향 변환', value: '레벨 시프터 IC', note: 'BSS138 MOSFET 모듈', tone: 'amber' },
    ],
    wiringNotes: [
      {
        signal: '5V 센서 출력 (예: HC-SR04 ECHO)',
        pin: 'ECHO → R1(10kΩ) → [ESP32 GPIO] → R2(20kΩ) → GND',
        detail: 'R1과 R2가 만나는 가운데 마디에서 선을 따서 ESP32 입력 핀에 연결합니다.',
      },
      {
        signal: '3.3V ESP32 출력 → 5V 센서 입력 (예: TRIG)',
        pin: 'ESP32 GPIO → TRIG 직결 가능',
        detail: '대부분의 5V TTL 입력은 2.0V~3.0V 이상을 HIGH로 인식하므로 3.3V 출력은 별도 승압 없이 인식되는 경우가 많습니다.',
        warning: '반대 방향(5V → 3.3V)만 반드시 강압 보호하세요!',
      },
    ],
    codeTitle: 'day05_battery_divider_adc.ino',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 05: 2S LiPo 배터리 전압(최대 8.4V)을 30kΩ+10kΩ 분압기로 안전 측정하기
// 분압비: R2 / (R1 + R2) = 10 / (30 + 10) = 1/4 -> 8.4V일 때 ADC에는 2.1V 인가!

const int BATT_ADC_PIN = 35; // ADC1 입력 전용 안전 핀
const float R1 = 30000.0;    // 상단 저항 30kΩ
const float R2 = 10000.0;    // 하단 저항 10kΩ

void setup() {
  Serial.begin(115200);
}

void loop() {
  int raw = analogRead(BATT_ADC_PIN);
  float vAdc = (raw / 4095.0) * 3.3;
  float vBatt = vAdc * ((R1 + R2) / R2); // 역산 배수 4.0 곱하기!

  Serial.printf("ADC=%.2fV | 실제 배터리=%.2fV\\n", vAdc, vBatt);
  delay(500);
}`,
    codeChallenge: {
      prompt: 'R1=30kΩ, R2=10kΩ 분압기로 배터리를 읽었는데, 실제 8.0V 배터리가 2.0V로 잘못 출력되고 있습니다. 역산 공식을 고쳐보세요!',
      buggyLine: 'float vBatt = vAdc * (R2 / (R1 + R2)); // 거꾸로 1/4을 또 곱함!',
      options: [
        'float vBatt = vAdc * ((R1 + R2) / R2);',
        'float vBatt = vAdc + R1 + R2;',
        'float vBatt = vAdc * (R1 / R2);',
      ],
      correctIndex: 0,
      explanation:
        '하드웨어에서 R2 / (R1 + R2)만큼 전압을 줄였으므로, 소프트웨어에서 원래 전압을 복원하려면 역수인 (R1 + R2) / R2를 곱해야 합니다.',
    },
    quizzes: [
      {
        id: 'P1D5-1',
        question: '5.0V 입력에 R1 = 10kΩ(신호 측)과 R2 = 20kΩ(GND 측)으로 전압 분배기를 만들면 출력 전압 V_out은 약 얼마인가요?',
        options: ['1.67 V', '2.50 V', '3.33 V', '5.00 V'],
        correctIndex: 2,
        explanation:
          'V_out = 5.0 × 20 / (10 + 20) = 100 / 30 ≈ 3.33V입니다. 5V 센서를 3.3V MCU에 연결할 때 가장 많이 쓰이는 표준 저항비입니다.',
      },
      {
        id: 'P1D5-2',
        question: '만약 실수로 R1(20kΩ)과 R2(10kΩ)의 위치를 서로 바꾸어 연결하면 5V 입력 시 출력 전압은 어떻게 되나요?',
        options: [
          '약 1.67V가 되어 ESP32가 HIGH 신호를 못 읽을 수 있다.',
          '여전히 3.33V가 나온다.',
          '10V로 승압된다.',
          '전류가 반대로 흐른다.',
        ],
        correctIndex: 0,
        explanation:
          'R2가 10kΩ이 되면 5.0 × 10 / 30 ≈ 1.67V만 나오며, 이는 ESP32의 HIGH 판정 문턱값(약 2.48V)보다 낮아 신호가 무시될 수 있습니다.',
      },
      {
        id: 'P1D5-3',
        question: '전압 분배기 회로만으로 서보 모터나 ESP32 보드 전체 전원을 공급하면 안 되는 이유는?',
        options: [
          '저항이 커서 큰 전류가 흐르면 전압이 급락하고 저항이 과열되어 타버리기 때문',
          '전압 분배기는 교류(AC)에서만 동작하기 때문',
          '저항값이 항상 0Ω이기 때문',
          '모터가 거꾸로 돌기 때문',
        ],
        correctIndex: 0,
        explanation:
          '전압 분배기는 부하 전류가 거의 0에 가까운 신호선이나 ADC 계측에만 써야 합니다. 전력을 공급하려면 반드시 레귤레이터(벅 컨버터)를 사용해야 합니다.',
      },
      {
        id: 'P1D5-4',
        question: '5V I2C 센서와 3.3V ESP32를 양방향으로 고속 통신시킬 때 단순 저항 분배기 대신 권장되는 부품은?',
        options: [
          '1Ω 시멘트 저항',
          'MOSFET 기반 양방향 로직 레벨 시프터',
          '전구 소켓',
          '9V 건전지',
        ],
        correctIndex: 1,
        explanation:
          'I2C(SDA)는 데이터를 양방향으로 주고받으며 상승 에지 속도가 중요하므로 양방향 MOSFET 레벨 시프터(예: BSS138)를 사용합니다.',
      },
      {
        id: 'P1D5-5',
        question: '최대 8.4V까지 올라가는 2S LiPo 배터리 전압을 3.3V ADC 핀으로 안전하게 측정하려면 어떤 설계를 해야 할까요?',
        options: [
          '배터리 +극을 ADC 핀에 직결한다.',
          '최대 입력(8.4V)일 때도 분압 출력이 3.3V 이하(예: R1=30kΩ, R2=10kΩ → 2.1V)가 되도록 분압기를 거쳐 읽고 코드에서 배수를 곱한다.',
          'LED를 직렬로 10개 꽂는다.',
          'ADC 대신 PWM 출력 핀에 꽂는다.',
        ],
        correctIndex: 1,
        explanation:
          '항상 배터리의 만충 최대 전압(2S LiPo는 8.4V) 기준으로 분압 출력이 3.3V를 넘지 않도록 저항비를 설계해야 보드를 보호할 수 있습니다.',
      },
    ],
  },
  {
    id: 'day06_power',
    order: 6,
    dayLabel: 'Day 06',
    phaseLabel: 'Phase 1 · 전기/보드 기초',
    title: '배터리, 전원 예산(Power Budget) & 공구 기초',
    shortTitle: 'D06 · 배터리/전원',
    subtitle: 'LiPo/18650/9V 비교 · LDO vs DC-DC 벅 컨버터 · 브라운아웃 예방',
    badge: '전원 설계',
    milestoneTag: 'Day 06 아이소메트릭 전원 랩',
    failFirstHook:
      '로봇을 처음 만들 때 가장 많이 겪는 사고가 "모터만 돌면 ESP32가 툭툭 꺼지며 재부팅되는 현상(Brownout)"과, 선형 레귤레이터(LDO)가 손가락을 데일 정도로 뜨거워지는 문제입니다.',
    beginnerAnalogy:
      '배터리 용량(mAh)은 물탱크 크기이고 방전율(C-rate)은 한 번에 쏟아낼 수 있는 수문 폭입니다. 7.4V를 5V로 낮출 때 남은 2.4V를 열로 버리는 난로가 LDO라면, 알뜰하게 스위칭해 90% 효율로 변환하는 장치 가 DC-DC 벅 컨버터입니다.',
    overviewSummary:
      '실제 로봇은 전선과 배터리를 꽂았을 때부터 진짜 공학이 시작됩니다. 왜 네모난 9V 건전지로 모터를 못 돌리는지, LDO와 벅 컨버터의 발열 차이, 그리고 총 소비 전류(Power Budget)로 배터리 동작 시간을 계산하는 법을 실험해 보세요.',
    guidedMissions: [
      {
        id: 'd06-brownout',
        title: '9V 네모 건전지 상태에서 모터 부하를 높여 브라운아웃(전압 강하 리셋) 체험하기',
        hint: '배터리 종류를 "9V 알카라인"으로 두고 모터 부하를 600mA 이상 올려보세요.',
      },
      {
        id: 'd06-buck',
        title: '"2S LiPo + DC-DC 벅 컨버터"로 교체해 고효율·안정 전원 상태 만들기',
        hint: '배터리를 2S LiPo, 레귤레이터를 벅 컨버터로 바꾸어 발열과 안정성을 비교하세요.',
      },
      {
        id: 'd06-load',
        title: 'LDO vs 벅 컨버터 발열(mW) 차이를 직접 확인하기',
        hint: '레귤레이터 버튼을 LDO ↔ Buck으로 전환하며 낭비되는 열 손실 차이를 보세요.',
      },
    ],
    highlights: [
      {
        title: '9V 네모 건전지가 로봇 최악의 배터리인 이유',
        body: '작은 AAAA 셀 6개가 직렬로 들어있어 내부 저항이 매우 큽니다. 300~500mA만 끌어써도 배터리 단자 전압이 9V에서 4V 이하로 푹 꺼지며 MCU가 즉시 재부팅(Brownout)됩니다.',
        tone: 'rose',
      },
      {
        title: 'LDO 선형 레귤레이터 vs DC-DC 벅 컨버터',
        body: 'LDO는 (V_in - V_out) × I 만큼을 순수 열로 태워 버립니다. 7.4V에서 3.3V로 1A를 뽑으면 4.1W 난로가 되어 타버립니다. 모터/서보처럼 전류가 클 때는 스위칭 벅 컨버터(효율 85~95%)가 필수입니다.',
        tone: 'amber',
      },
      {
        title: 'LiPo 2S (7.4V)와 C-rate · 전선 굵기(AWG)',
        body: '2200mAh 20C 배터리는 최대 2.2A × 20 = 44A까지 전류를 내보낼 수 있습니다. 대신 전선이 가늘면(28AWG 듀폰선) 모터 전류에 선이 녹으므로 동력선은 20~18AWG 굵은 실리콘 선과 XT60/JST 커넥터를 씁니다.',
        tone: 'emerald',
      },
    ],
    formulas: [
      {
        title: 'LDO 열 손실(발열) 및 배터리 사용 시간 계산',
        latex: String.raw`P_{\text{heat, LDO}} = (V_{\text{in}} - V_{\text{out}}) \cdot I_{\text{load}}, \quad T_{\text{run}}\,[\text{h}] \approx \frac{\text{Capacity}\,[\text{mAh}]}{I_{\text{total}}\,[\text{mA}]}`,
        description:
          '예: 2200mAh 배터리로 총 1,100mA(1.1A)를 쓰는 로봇은 이론상 약 2시간(실전 안전 마진 70% 적용 시 약 1시간 20분) 구동됩니다.',
      },
    ],
    specs: [
      { label: '2S LiPo 공칭/만충', value: '7.4 V / 8.4 V', note: '셀당 3.7V~4.2V (방전 하한 3.2V)', tone: 'cyan' },
      { label: '2200mAh 20C 최대', value: '44 A 공급', note: '고전류 모터 구동 적합', tone: 'emerald' },
      { label: 'DC-DC 벅 효율', value: '85 ~ 95 %', note: '발열 극소화, 고전류 필수', tone: 'amber' },
      { label: '브라운아웃 위험', value: '9V 건전지 / USB', note: '내부저항·전류 한계 초과', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '동력 전원 경로 (Battery → Motor)',
        pin: '배터리(+) → 스위치/퓨즈 → 벅 컨버터(5V) & 모터 드라이버(VM)',
        detail: '굵은 전선(20AWG 이상)으로 모터와 벅 컨버터에 직결합니다.',
      },
      {
        signal: 'MCU 전원 경로 (Buck 5V → ESP32 VIN)',
        pin: '벅 컨버터 5V 출력 → ESP32 VIN(5V) + 공통 GND',
        detail: '로직 전원과 모터 전원을 분리해 꽂고, GND만 반드시 하나로 묶어야 모터 노이즈로 보드가 꺼지지 않습니다.',
        warning: '리튬(LiPo/18650) 배터리는 절대 +와 -를 쇼트시키면 안 되며, 과방전 보호(BMS 또는 전압 체크)가 필수입니다.',
      },
    ],
    codeTitle: 'day06_power_budget_monitor.ino',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 06: LiPo 2S 저전압(과방전) 경고 체크 로직
// 셀당 3.3V 이하(2S 기준 6.6V 이하)로 내려가면 배터리가 영구 손상되므로 즉시 정지!

const float LIPO_2S_MIN_V = 6.6;

void checkBatterySafety(float currentVoltage) {
  if (currentVoltage < LIPO_2S_MIN_V) {
    Serial.printf("[CRITICAL] 배터리 저전압 %.2fV! 모터를 즉시 정지하세요.\\n", currentVoltage);
    // stopAllMotors();
  } else {
    float pct = ((currentVoltage - 6.6) / (8.4 - 6.6)) * 100.0;
    Serial.printf("배터리 %.2fV (잔량 약 %.0f%%)\\n", currentVoltage, constrain(pct, 0.0, 100.0));
  }
}`,
    codeChallenge: {
      prompt: '2S LiPo 배터리가 6.2V까지 떨어졌는데도 로봇이 계속 모터를 돌려 배터리가 부풀어 오르고 있습니다. 안전 기준을 수정해 보세요!',
      buggyLine: 'const float LIPO_2S_MIN_V = 3.0; // 2S 직렬(2셀)인데 1셀 기준으로 잘못 적음!',
      options: [
        'const float LIPO_2S_MIN_V = 6.6; // 셀당 3.3V × 2셀',
        'const float LIPO_2S_MIN_V = 12.0; // 너무 높아 켜자마자 정지',
        'const float LIPO_2S_MIN_V = 0.0; // 보호 끔',
      ],
      correctIndex: 0,
      explanation:
        '2S(2셀 직렬) LiPo 배터리는 셀당 최소 안전 전압(3.2~3.3V) × 2 = 약 6.4~6.6V 이하로 방전하면 수명이 급감하거나 부풀어 오르므로 6.6V에서 정지해야 합니다.',
    },
    quizzes: [
      {
        id: 'P1D6-1',
        question: '모터 2개와 ESP32를 돌릴 때 흔히 구할 수 있는 네모난 9V 알카라인 건전지를 쓰면 안 되는 가장 큰 이유는?',
        options: [
          '전압이 9V라 너무 낮아서',
          '내부 저항이 매우 크고 최대 방전 전류가 낮아 모터 부하 시 전압이 급락해 보드가 재부팅(Brownout)되기 때문',
          '직류가 아니라 교류를 출력하기 때문',
          '전선 색깔이 맞지 않아서',
        ],
        correctIndex: 1,
        explanation:
          '9V 건전지는 전류 공급 능력이 수백 mA로 매우 낮아, 시동 전류가 큰 모터를 돌리면 단자 전압이 뚝 떨어져 MCU가 브라운아웃 리셋됩니다.',
      },
      {
        id: 'P1D6-2',
        question: '12V 배터리에서 LDO 선형 레귤레이터를 통해 3.3V를 만들며 0.5A(500mA)를 소비할 때, LDO 칩에서 열로 버려지는 전력은?',
        options: ['0.435 W', '1.65 W', '4.35 W', '6.0 W'],
        correctIndex: 2,
        explanation:
          'P_heat = (V_in - V_out) × I = (12.0 - 3.3) × 0.5 = 8.7 × 0.5 = 4.35W입니다. 작은 보드용 LDO는 방열판 없이 4.35W를 견디지 못하고 과열 셧다운됩니다.',
      },
      {
        id: 'P1D6-3',
        question: '용량 2000mAh 배터리가 평균 500mA를 소비하는 로봇에 연결되어 있을 때, 이론상 최대 동작 시간은?',
        options: ['30분', '1시간', '2시간', '4시간'],
        correctIndex: 3,
        explanation:
          '동작 시간 = 용량(2000mAh) / 소비전류(500mA) = 4시간입니다. (실전에서는 방전 효율과 저전압 차단 여유를 두어 약 70~80% 수준으로 잡습니다.)',
      },
      {
        id: 'P1D6-4',
        question: '배터리 스펙에 "2200mAh 25C"라고 적혀 있을 때, 이 배터리가 연속으로 공급할 수 있는 최대 전류는?',
        options: ['2.2 A', '25 A', '55 A', '220 A'],
        correctIndex: 2,
        explanation:
          '최대 방전 전류 = 용량(2.2Ah) × C-rate(25) = 55A입니다.',
      },
      {
        id: 'P1D6-5',
        question: '모터와 서보를 여러 개 쓰는 로봇에서 얇은 점퍼선(28AWG) 대신 굵은 실리콘 전선(18~20AWG)을 전원 메인선에 쓰는 이유는?',
        options: [
          '전선이 굵을수록 저항이 작아 큰 전류가 흐를 때 전압 강하와 발열(화재 위험)을 막을 수 있기 때문',
          '굵은 전선이 색깔이 더 선명해서',
          '가는 전선은 디지털 0만 통과시키기 때문',
          '굵은 전선이 Wi-Fi 신호를 증폭시켜서',
        ],
        correctIndex: 0,
        explanation:
          '전선 굵기(AWG 숫자가 작을수록 굵음)가 충분해야 고전류 모터 구동 시 선 자체의 저항 손실과 발열을 방지할 수 있습니다.',
      },
    ],
  },
  {
    id: 'day07_project',
    order: 7,
    dayLabel: 'Day 07',
    phaseLabel: 'Phase 1 · 전기/보드 기초',
    title: '[Phase 1 미니 프로젝트] 스마트 위험 감지기 통합 배선',
    shortTitle: 'D07 · 미니 프로젝트',
    subtitle: '2S LiPo + 벅 컨버터 + ESP32 + 5V 초음파 분압 + LED 보호 저항',
    badge: 'Phase 1 프로젝트',
    milestoneTag: 'Day 07 아이소메트릭 통합 검증',
    failFirstHook:
      '개별 부품을 하나씩 테스트할 때는 다 잘 되던 회로가, 배터리·센서·LED를 하나로 합치는 순간 "공통 접지(GND) 1가닥 누락" 또는 "분압 저항 1개 누락" 때문에 전체가 먹통이 되거나 핀이 손상됩니다.',
    beginnerAnalogy:
      '지금까지 배운 옴의 법칙(Day 1), 빵판/멀티미터(Day 2), 디지털/부저(Day 3), PWM(Day 4), 전압 분배(Day 5), 배터리/벅 컨버터(Day 6)를 모두 조립해 실제로 동작하는 첫 번째 안전 경보 장치를 완성하는 종합 실전입니다.',
    overviewSummary:
      '가상 아이소메트릭 캐리어 보드 위에서 3대 하드웨어 안전 수칙(① 공통 GND 연결 ② ECHO 5V→3.3V 분압 ③ LED 220Ω 보호 저항)을 모두 지키며 장애물 거리에 따라 경보가 울리는 스마트 위험 감지기를 완성하세요.',
    guidedMissions: [
      {
        id: 'd07-fault',
        title: '안전 스위치 중 하나를 꺼서 실제 하드웨어 결선 오류 경고 확인하기',
        hint: '직접 실습 탭에서 "공통 GND", "ECHO 분압기", "LED 보호 저항" 중 하나를 OFF로 해보세요.',
      },
      {
        id: 'd07-armed',
        title: '3대 하드웨어 안전 수칙을 모두 ON으로 맞춰 시스템 정상 가동(ARMED)시키기',
        hint: '3가지 보호 장치를 모두 켜면 보드가 정상 녹색 상태로 전환됩니다.',
      },
      {
        id: 'd07-alarm',
        title: '장애물 거리를 30cm 미만으로 가까이 대서 위험 경보(LED+부저) 작동시키기',
        hint: '안전 가동 상태에서 장애물 거리 슬라이더를 25cm 이하로 줄여보세요.',
      },
    ],
    highlights: [
      {
        title: '안전 수칙 1: 공통 접지 (Common Ground)',
        body: '5V 센서 전원, 3.3V ESP32, 배터리 전원이 섞여 있을 때 모든 부품의 GND(0V 기준선)가 하나로 이어져 있어야 신호 전압을 올바르게 읽을 수 있습니다.',
        tone: 'cyan',
      },
      {
        title: '안전 수칙 2: 이종 전압 보호 (5V ECHO → 3.3V 분압)',
        body: 'HC-SR04의 5V 출력(ECHO)은 10kΩ + 20kΩ 저항 분배기를 통해 3.33V로 낮춘 뒤 ESP32 GPIO 19번으로 들어갑니다.',
        tone: 'amber',
      },
      {
        title: '안전 수칙 3: 전류 제한 & 전원 분리 (220Ω + 벅 컨버터)',
        body: '경고 LED에는 220Ω 직렬 저항을 붙여 핀당 20mA 이하를 유지하고, 전체 시스템은 2S LiPo + DC-DC 벅 컨버터 5V 출력으로 안정 구동합니다.',
        tone: 'emerald',
      },
    ],
    formulas: [
      {
        title: '시스템 총 소비 전류 및 예상 구동 시간',
        latex: String.raw`I_{\text{total}} = I_{\text{ESP32}} + I_{\text{HC-SR04}} + I_{\text{alarm}} \approx 80 + 15 + 25 = 120\text{ mA}`,
        description:
          '2200mAh 2S LiPo 기준(벅 컨버터 효율 포함) 약 15시간 이상 연속 감시가 가능한 저전력 설계입니다.',
      },
    ],
    specs: [
      { label: '공급 전원 아키텍처', value: '2S LiPo → 5V Buck', note: '안정적인 5V/3.3V 분배', tone: 'cyan' },
      { label: '센서 보호 회로', value: '10kΩ + 20kΩ', note: '5V ECHO → 3.33V 감압', tone: 'amber' },
      { label: '경보 LED 전류', value: '≈ 5.9 mA (220Ω)', note: '(3.3V - 2.0V) / 220Ω', tone: 'emerald' },
      { label: '경보 임계 거리', value: '< 30 cm', note: '초음파 감지 시 점멸·부저', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '전원 & 공통 접지 버스',
        pin: '2S LiPo → Buck 5V → VIN & 센서 VCC (모든 GND 일체 연결)',
        detail: '센서는 5V에서, ESP32는 VIN 내부 레귤레이터를 통해 3.3V로 안정 구동됩니다.',
      },
      {
        signal: '초음파 & 경보 LED/부저 핀맵',
        pin: 'TRIG=18 · ECHO=19(분압) · LED=13(220Ω) · BUZZER=27',
        detail: 'Phase 2(ESP32 핀 규율)에서도 부팅 스트래핑과 충돌하지 않는 최상급 안전 핀들입니다.',
        warning: '공통 GND가 끊어지거나 ECHO 분압·LED 저항 중 하나라도 빠지면 즉시 결선 실패입니다.',
      },
    ],
    codeTitle: 'day07_smart_hazard_detector.ino',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 07 Phase 1 미니 프로젝트: 스마트 위험 감지기 통합 펌웨어
const int TRIG_PIN = 18;
const int ECHO_PIN = 19; // 10kΩ + 20kΩ 전압 분배기 경유
const int LED_PIN  = 13; // 220Ω 직렬 보호 저항 경유
const int BUZ_PIN  = 27;

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  ledcAttach(BUZ_PIN, 2000, 8); // 2kHz 피에조 부저 톤
}

void loop() {
  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long us = pulseIn(ECHO_PIN, HIGH, 40000);
  float cm = (us > 0) ? (us / 58.0) : 999.0;

  if (cm < 30.0) {
    digitalWrite(LED_PIN, HIGH);
    ledcWrite(BUZ_PIN, 128); // 50% 듀티 경보음
  } else {
    digitalWrite(LED_PIN, LOW);
    ledcWrite(BUZ_PIN, 0);
  }
  delay(65); // 잔향 간섭 방지 60ms 이상
}`,
    codeChallenge: {
      prompt: '스마트 위험 감지기가 장애물이 없을 때(timeout → us == 0)도 자꾸 경보를 울립니다. 거리 계산의 버그를 고쳐보세요!',
      buggyLine: 'float cm = us / 58.0; // 타임아웃(us == 0)일 때 cm = 0이 되어 < 30.0 조건에 걸림!',
      options: [
        'float cm = (us > 0) ? (us / 58.0) : 999.0;',
        'float cm = us * 58.0;',
        'if (cm <= 400.0) { digitalWrite(LED_PIN, HIGH); }',
      ],
      correctIndex: 0,
      explanation:
        'pulseIn()은 반사파가 안 돌아오면 0을 반환합니다. 예외처리 없이 0 / 58.0 = 0cm로 계산하면 "물체가 0cm 앞에 있다"고 착각해 계속 경보가 울립니다.',
    },
    quizzes: [
      {
        id: 'P1D7-1',
        question: '두 개의 서로 다른 전원(예: 5V 센서 전원과 3.3V ESP32 USB 전원)을 함께 쓸 때 신호가 정상 전달되기 위한 절대 조건은?',
        options: [
          '두 전원의 +선(VCC)을 서로 직접 묶는다.',
          '두 전원의 기준점인 GND(접지)를 반드시 전선으로 서로 연결(Common GND)한다.',
          '저항을 전부 빼고 연결한다.',
          '선 길이를 정확히 1m로 맞춘다.',
        ],
        correctIndex: 1,
        explanation:
          '전압은 상대적인 높이 차이입니다. 기준 높이(0V = GND)가 하나로 연결되어 있지 않으면 5V와 3.3V 신호를 서로 전혀 이해할 수 없습니다.',
      },
      {
        id: 'P1D7-2',
        question: 'Day 07 감지기 회로에서 ESP32의 3.3V GPIO 13번 핀에 빨강 LED(Vf = 2.0V)와 220Ω 저항을 직렬로 연결했을 때 흐르는 전류는 약 얼마인가요?',
        options: ['약 0.5 mA', '약 5.9 mA', '약 25 mA', '약 150 mA'],
        correctIndex: 1,
        explanation:
          'I = (3.3V - 2.0V) / 220Ω = 1.3 / 220 ≈ 0.0059A = 5.9mA입니다. ESP32 권장 전류(20mA 이하) 안에서 안전하게 동작합니다.',
      },
      {
        id: 'P1D7-3',
        question: '제작한 회로의 전원을 켰는데 아무 동작도 하지 않을 때, 멀티미터로 가장 먼저 점검해야 할 올바른 순서는?',
        options: [
          '코드부터 100줄 다시 짠다.',
          '전원 레일 전압(5V / 3.3V 정상 공급 여부)과 공통 GND 연결 상태를 먼저 확인한 뒤 신호선·코드를 본다.',
          'LED를 망치로 두드려본다.',
          '저항을 전부 0Ω으로 교체한다.',
        ],
        correctIndex: 1,
        explanation:
          '하드웨어 격리 디버깅의 제1원칙은 항상 전원(VCC/3.3V)과 접지(GND) 확인 → 센서 입력 → 출력/코드 순서로 좁혀가는 것입니다.',
      },
      {
        id: 'P1D7-4',
        question: '스마트 위험 감지기가 평소 80mA를 소비하다가 장애물 감지 시 부저+LED가 켜지며 120mA를 소비합니다. 1200mAh 배터리를 썼을 때 최소 보장 연속 동작 시간은?',
        options: ['약 1시간', '약 5시간', '약 10시간', '약 100시간'],
        correctIndex: 2,
        explanation:
          '최대 부하(120mA) 기준으로 계산하면 1200mAh / 120mA = 10시간입니다. 전원 예산은 항상 최악(최대 소비) 부하 기준으로 잡아야 안전합니다.',
      },
      {
        id: 'P1D7-5',
        question: '이 프로젝트에서 pulseIn()이 0을 반환했을 때(물체가 너무 멀어 타임아웃) cm = 0으로 처리하면 어떤 실전 버그가 발생하나요?',
        options: [
          '앞에 아무것도 없는 허공인데 "0cm 거리 장애물!"로 오인해 경보가 계속 울린다.',
          '초음파가 레이저로 바뀐다.',
          'ESP32가 자동으로 절전 모드로 들어간다.',
          '저항값이 무한대로 증가한다.',
        ],
        correctIndex: 0,
        explanation:
          '타임아웃(0 반환)은 "측정 범위 밖(장애물 없음)"을 뜻하므로, 반드시 0일 때 안전 거리(예: 999cm 또는 -1 예외)로 분기해야 오작동을 막을 수 있습니다.',
      },
    ],
  },
];
