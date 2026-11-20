import { LabModule } from '../types/lab';

export const PHASE6_MODULES: LabModule[] = [
  {
    id: 'day43_pcb_design',
    order: 43,
    dayLabel: 'Day 43',
    phaseLabel: 'Phase 6 · 기판 & 최종 캡스톤',
    title: '브레드보드에서 나만의 기판으로 (PCB 설계 입문)',
    shortTitle: 'D43 · KiCad PCB설계',
    subtitle: '회로도→풋프린트→모터 전류 트레이스 폭 · 0.1µF 디커플링 · GND 플레인',
    badge: '하드웨어 양산',
    milestoneTag: 'Day 43 PCB 레이아웃 랩',
    failFirstHook:
      '빵판에서 되던 회로를 주행시켰더니 점퍼선이 진동으로 빠져 불이 꺼지고, 처음 그린 PCB에서 모터가 도는 구리 선폭(Trace)을 신호선과 똑같이 0.2mm로 그렸다가 구리 패턴이 열기로 녹아 끊어집니다.',
    beginnerAnalogy:
      '신호선(0.25mm)은 1차선 골목길이고, 3A 모터 전원선(1.5~2.0mm)은 대형 트럭이 다니는 6차선 고속도로입니다. 그리고 각 칩 현관 바로 앞(2mm 이내)에 작은 물통(0.1µF 디커플링 커패시터)을 둬야 갑작스러운 전력 목마름을 막습니다.',
    overviewSummary:
      '나만의 로봇 확장 보드(Shield) PCB 레이아웃 시뮬레이터에서 1) 3A 모터 전원 트레이스 폭(0.2mm 과열 소손 vs 1.5mm+ 안전), 2) ESP32 전원 핀 앞 0.1µF 디커플링 커패시터 배치 거리, 3) 하단 GND Copper Pour 유무를 검증해 DRC를 통과하세요.',
    guidedMissions: [
      {
        id: 'd43-trace',
        title: '모터 전원 트레이스 폭을 0.25mm(과열 위험)에서 1.5mm 이상(3A 안전)으로 넓히기',
        hint: '트레이스 폭 슬라이더를 올려 온도 상승 경고가 초록색 안전 범위로 바뀌는지 확인하세요.',
      },
      {
        id: 'd43-decap',
        title: '0.1µF 디커플링 커패시터를 IC 전원 핀 바로 옆으로 배치해 리플 노이즈 잡기',
        hint: '디커플링 캡 배치 스위치를 "IC 핀 직근" 상태로 전환해 보세요.',
      },
      {
        id: 'd43-pour',
        title: '하단 GND 구리 플레인(Copper Pour)을 깔아 귀환 전류 저항 및 노이즈 최소화하기',
        hint: 'GND Copper Pour 스위치를 ON으로 켜서 깔끔한 PCB 배선을 완성하세요.',
      },
    ],
    highlights: [
      {
        title: 'IPC-2221 기준 전류별 구리 트레이스 폭 설계',
        body: '일반 1oz(35µm) 구리 PCB에서 20mA I2C/UART 신호선은 0.25mm로 충분하지만, 2~3A 모터 드라이버와 배터리 메인 선로는 최소 1.5~2.5mm 이상 굵게(또는 Polygon Pour로) 그려야 발열을 막습니다.',
        tone: 'rose',
      },
      {
        title: '0.1µF 세라믹 디커플링 커패시터 = IC 핀 바로 옆 2~3mm 이내',
        body: '디지털 칩(ESP32·IMU·모터 드라이버)이 수십 MHz로 스위칭할 때 발생하는 순간 전류 요구는 긴 PCB 배선의 인덕턴스 때문에 공급이 늦습니다. 반드시 VCC-GND 핀 최단 거리 바로 옆에 0.1µF를 배치합니다.',
        tone: 'cyan',
      },
      {
        title: 'GND 플레인(Copper Pour) & DRC 검사 → Gerber 발주',
        body: '빈 기판 바닥면 전체를 GND 구리판으로 덮으면 모든 부품의 접지 귀환 경로(Return Path)가 가장 짧아져 EMI 노이즈와 전압 강하가 급감합니다. 최종 ERC/DRC 에러 0개 확인 후 Gerber.zip을 제조사에 올립니다.',
        tone: 'emerald',
      },
    ],
    formulas: [
      {
        title: 'IPC-2221 PCB 외부층 트레이스 허용 전류 근사식',
        latex: String.raw`I_{\max} = k \cdot (\Delta T)^{0.44} \cdot (W \cdot t_{\text{Cu}})^{0.725}`,
        description: '외부층 k=0.048, 온도 상승 ΔT=10°C, 1oz(1.378mil) 기준 3A 통과에는 약 1.3~1.5mm 이상 선폭이 필요합니다.',
      },
      {
        title: '디커플링 루프 인덕턴스 전압 강하',
        latex: String.raw`V_{\text{droop}} = L_{\text{loop}} \cdot \frac{dI}{dt}`,
        description: '트레이스 루프가 길수록 인덕턴스 L이 커져 고속 스위칭(dI/dt) 시 순간 전압 강하(글리치)가 심해집니다.',
      },
    ],
    specs: [
      { label: '신호 트레이스 (GPIO)', value: '0.25 mm (10 mil)', note: '수십 mA 통신/로직용', tone: 'cyan' },
      { label: '모터 전원 (2~3A)', value: '1.5 ~ 2.5 mm', note: '1oz 구리 발열 안전폭', tone: 'amber' },
      { label: '디커플링 커패시터', value: '0.1 µF (100 nF) + 10 µF', note: 'IC VCC 핀 2mm 이내 배치', tone: 'emerald' },
      { label: '제조 공차 (JLCPCB 등)', value: '선폭/간격 ≥ 0.15mm', note: '4홀 구멍 최소 0.3mm', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '풋프린트(Footprint) 1:1 종이 인쇄 검증',
        pin: 'Gerber 발주 전 A4 용지 100% 배율 인쇄 후 실제 부품 올려보기',
        detail: '핀 간격(2.54mm 헤더, JST-XH, 배럴잭, USB 위치)을 실물로 대보지 않고 발주하면 보드가 도착한 날 구멍이 안 맞아 못 쓰는 비극을 막을 수 있습니다.',
      },
      {
        signal: '실크스크린에 극성(+/-)과 핀 번호 꼼꼼히 적기',
        pin: 'J_LIPO (+ / -), RX / TX, SDA / SCL 명시',
        detail: '보드가 조립되고 나면 회로도를 일일이 펴보지 않아도 실크 글씨만 보고 꽂을 수 있어야 실수가 줄어듭니다.',
      },
    ],
    codeTitle: 'day43_kicad_design_rules.txt',
    codeLanguage: 'plaintext',
    codeSnippet: `# Day 43: 로봇 제어 보드 KiCad DRC(Design Rule Check) 필수 기준
- Signal Net (GPIO/I2C/UART): min width 0.25 mm, clearance 0.20 mm
- Power Net (VMOT_7V4 / 5V_BUCK / GND): min width 1.50 mm ~ 2.50 mm
- Decoupling Caps: C_100nF placed <= 2.5 mm from ESP32_3V3 & MPU6050_VCC
- Bottom Layer: Full Copper Zone assigned to Net [GND]
- Before Gerber Export: Run ERC (0 errors) + DRC (0 unconnected/clearance)`,
    codeChallenge: {
      prompt: 'PCB 설계에서 0.1µF 세라믹 디커플링 커패시터와 IC 전원 핀을 연결할 때 가장 지켜야 할 물리적 규칙은?',
      buggyLine: '커패시터를 보드 반대쪽 모서리에 몰아두고 10cm 얇은 선으로 각 칩에 연결한다.',
      options: [
        '해당 IC의 VCC와 GND 핀 바로 옆(2~3mm 최단 거리)에 굵은 짧은 배선으로 붙여 고주파 루프 면적을 최소화한다',
        '모터 드라이버 출력 선에 직렬로 연결한다',
        '크기가 큰 1000µF 전해 커패시터 1개만 멀리 둔다',
      ],
      correctIndex: 0,
      explanation: '고주파 스위칭 노이즈를 즉각 흡수하려면 배선 자체의 기생 인덕턴스 L_loop를 줄여야 하므로 IC 전원 핀 바로 코앞에 배치해야 효과가 있습니다.',
    },
    quizzes: [
      {
        id: 'P6D43-1',
        question: '모터 드라이버로 최대 3A 전류가 흐르는 PCB 전원 패턴을 0.2mm 두께의 가느다란 신호선과 같게 그렸을 때 발생하는 위험은?',
        options: [
          '배선 저항 I²R 열로 인해 구리 패턴이 과열·박리되거나 심각한 전압 강하(Brownout)가 발생한다',
          '전기가 더 빨리 흐른다',
          'CPU 클록이 2배 빨라진다',
          '아무 문제 없다',
        ],
        correctIndex: 0,
        explanation: '대전류 경로는 단면적을 넓혀야(1.5mm 이상) 저항과 발열을 낮출 수 있습니다.',
      },
      {
        id: 'P6D43-2',
        question: 'ESP32나 IMU 칩의 전원 핀 바로 옆에 다는 0.1µF(100nF) 세라믹 커패시터의 역할은?',
        options: [
          '배터리를 완충한다',
          'IC 내부 트랜지스터 스위칭 시 발생하는 순간 전류 결핍과 고주파 노이즈를 바로 옆에서 즉각 메워준다(디커플링)',
          '전압을 5V에서 12V로 승압한다',
          '모터 회전 방향을 반전한다',
        ],
        correctIndex: 1,
        explanation: '고주파 임피던스가 매우 낮은 소형 세라믹 캡이 IC 옆 국소 에너지 탱크 역할을 합니다.',
      },
      {
        id: 'P6D43-3',
        question: 'PCB 하단 면 전체를 구리로 채워 GND 네트에 연결하는 "Ground Copper Pour(접지 플레인)"의 주요 장점이 아닌 것은?',
        options: [
          '접지 귀환 경로 저항과 인덕턴스를 최소화해 EMI 노이즈와 그라운드 바운스를 줄인다',
          '배선 방열 효과가 좋아지고 식각 약품 소모도 줄인다',
          '배선 실수로 전원 +5V와 +12V를 서로 합선시켜도 알아서 막아준다',
          '안정적인 기준 전위를 제공한다',
        ],
        correctIndex: 2,
        explanation: 'GND 플레인은 기준 전위/노이즈 저감용이며, 서로 다른 고전압 전원 합선을 막아주지는 않습니다.',
      },
      {
        id: 'P6D43-4',
        question: 'KiCad에서 회로도와 배선 완료 후 Gerber 파일을 제조사에 발주하기 직전 가장 유익한 실물 오류 예방 확인법은?',
        options: [
          '1:1 실제 크기로 A4 용지에 출력해 실물 ESP32, 커넥터, 나사 구멍을 올려보며 간섭과 홀 규격을 대조한다',
          '3D 뷰를 끈다',
          '실크스크린 글씨를 모두 지운다',
          'DRC 에러를 강제로 숨긴다',
        ],
        correctIndex: 0,
        explanation: '회로도상 맞더라도 풋프린트 핀 피치나 커넥터 방향, 기구 간섭을 1:1 종이 출력 실물 대조로 거의 다 걸러낼 수 있습니다.',
      },
      {
        id: 'P6D43-5',
        question: 'PCB 설계 흐름에서 논리적 연결만 그리는 "회로도 심볼(Symbol)"과 실제 기판 위 납땜 패드 치수를 가진 "풋프린트(Footprint)"의 관계는?',
        options: [
          '같은 부품(예: 저항, 버튼)이라도 실물 크기(SMD 0805 vs 1206 vs 스루홀)에 맞춰 올바른 풋프린트를 연결(Assign)해야 납땜이 가능하다',
          '심볼을 그리면 실물 크기는 공장이 알아서 추측한다',
          '둘은 같은 파일이다',
          '코드 크기에 따라 달라진다',
        ],
        correctIndex: 0,
        explanation: '부품 다리 간격과 구멍 지름이 실제 풋프린트와 일치해야 실물 납땜 조립이 가능합니다.',
      },
    ],
  },
  {
    id: 'day44_debugging',
    order: 44,
    dayLabel: 'Day 44',
    phaseLabel: 'Phase 6 · 기판 & 최종 캡스톤',
    title: '실전 로봇 디버깅 마스터 & EMI 노이즈 격리',
    shortTitle: 'D44 · 실전 디버깅/EMI',
    subtitle: '먹통 로봇 5분 격리 진단 (전원→부팅→I2C→구동기) · DC 모터 스파크 EMI 억제',
    badge: '트러블슈팅',
    milestoneTag: 'Day 44 디버깅 & EMI 랩',
    failFirstHook:
      '책상 위에서는 잘 되던 I2C IMU 센서가 바퀴 모터만 돌리면 갑자기 뻗어 버립니다. 브러시 DC 모터 정류자 스파크가 내뿜는 고주파 전자기 노이즈(EMI)가 통신선을 타고 CPU와 센서를 마비시키기 때문입니다.',
    beginnerAnalogy:
      '의사가 열이 난다고 무조건 수술부터 하지 않고 혈압→체온→청진기 순으로 원인을 좁히듯, 고장 난 로봇도 전원 → 시리얼 부팅 → 센서 단독 → 모터 순으로 한 층씩 격리(Divide & Conquer)하면 5분 안에 범인을 잡습니다.',
    overviewSummary:
      '4단계 현장 격리 진단 파이프라인(1. 전원 레일 → 2. 부팅/UART → 3. I2C 스캔 → 4. 모터 부하 EMI 테스트)을 순서대로 클릭해 숨겨진 고장 원인을 좁히고, 모터 단자 0.1µF 세라믹 커패시터 + 연선 배선으로 EMI I2C 통신 깨짐을 복구하세요.',
    guidedMissions: [
      {
        id: 'd44-steps',
        title: '격리 진단 4단계(전원 → 부팅 → I2C → EMI)를 순서대로 점검해 고장 위치 격리하기',
        hint: '상단 진단 단계 버튼을 1단계부터 4단계까지 차례로 클릭해 각 단계의 점검 항목을 확인하세요.',
      },
      {
        id: 'd44-emi',
        title: '4단계 EMI 노이즈 환경에서 0.1µF 커패시터 & 연선 대책을 적용해 I2C 버스 복구하기',
        hint: '"4. 모터 EMI" 단계에서 "0.1µF 캡 + 연선 EMI 대책" 버튼을 ON으로 전환해 I2C 파형이 깨끗해지는지 보세요.',
      },
      {
        id: 'd44-code',
        title: 'I2C 버스 교착(Hang) 복구 및 격리 디버깅 코드 챌린지 풀기',
        hint: '코드 탭의 I2C 타임아웃/격리 디버깅 버그 수정 챌린지를 맞혀보세요.',
      },
    ],
    highlights: [
      {
        title: 'Divide & Conquer: 절대 전체를 한꺼번에 디버깅하지 말라',
        body: '문제 발생 시 모터를 먼저 뽑고 USB 전원으로 MCU+센서만 단독 테스트(Minimum Viable Test)해 보면, 코드 버그인지 모터 전원/노이즈 때문인지 단 30초 만에 양분됩니다.',
        tone: 'cyan',
      },
      {
        title: '먹통 로봇 5분 진단 순서: 전원 → 클럭/부팅 → 통신 → 구동기',
        body: '1) 멀티미터로 3.3V/5V/공통 GND 전압 확인 → 2) Serial.println("BOOT OK")로 리셋/워치독 확인 → 3) i2c_scanner로 센서 ACK(0x68) 확인 → 4) 마지막에 모터 전원 투입.',
        tone: 'emerald',
      },
      {
        title: '브러시 DC 모터 EMI 대책 3신기: 0.1µF 캡 + 연선 + 전원 분리',
        body: 'DC 모터 두 단자 사이 및 각 단자-금속 케이스에 0.1µF(104) 세라믹 커패시터를 납땜하고, 두 모터 전선을 서로 꽈서(Twisted Pair) 자기장을 상쇄한 뒤 센서선과 물리적으로 멀리 떨어뜨립니다.',
        tone: 'amber',
      },
    ],
    formulas: [
      {
        title: '이진 탐색(Binary Search) 디버깅 효율',
        latex: String.raw`\text{Steps} = \lceil \log_2(N_{\text{subsystems}}) \rceil \quad (\text{8개 모듈도 단 3번 분리로 원인 특정})`,
        description: '절반씩 선을 뽑아가며 어느 절반에서 고장이 남는지 쪼개면 전체를 다 뜯지 않아도 금방 원인을 찾습니다.',
      },
      {
        title: 'I2C Wire 타임아웃 방어 (ESP32 Arduino)',
        latex: String.raw`\texttt{Wire.setTimeOut(20); // ms — 슬레이브 무응답 시 무한 대기 탈출}`,
        description: 'EMI 노이즈로 SDA 라인이 LOW에 걸려도 루프 전체가 영구 먹통(Hang)이 되지 않게 타임아웃을 겁니다.',
      },
    ],
    specs: [
      { label: '1단계 점검', value: '3.3V · 5V · GND 도통', note: '멀티미터 전압 확인 먼저', tone: 'cyan' },
      { label: '2단계 점검', value: 'WDT / Brownout 로그', note: '115200bps 시리얼 부트 메시지', tone: 'amber' },
      { label: '3단계 점검', value: 'I2C Scanner (0x68 등)', note: '풀업 저항 & 주소 충돌 확인', tone: 'emerald' },
      { label: '4단계 EMI 대책', value: '0.1µF (104) + 연선', note: '브러시 스파크 고주파 바이패스', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '점퍼선 접촉 불량(느슨한 암수 핀) 의심 1순위',
        pin: '진동하는 로버에서 갑자기 센서 끊김 시 케이블 흔들어 보기',
        detail: '중국산 얇은 브레드보드 점퍼선 내부가 단선되거나 핀이 헐거워 주행 진동 시 순간 단선이 가장 흔합니다. 본 로봇에는 JST/크림프 커넥터를 씁니다.',
      },
      {
        signal: '스타 그라운드 (Star Grounding)',
        pin: '고전류 모터 GND와 저전류 센서 GND를 배터리 단자 1점에서 만남',
        detail: '모터 2A 전류가 흐르는 가느다란 GND 선 중간에 IMU 센서의 GND를 물리지 마세요(그라운드 바운스로 센서 값 흔들림).',
      },
    ],
    codeTitle: 'day44_i2c_scanner_diagnostics.cpp',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 44: 실전 격리 진단용 I2C 버스 스캐너 & 타임아웃 보호
#include <Wire.h>

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
  Wire.setTimeOut(20); // EMI로 통신 멈춤 방지!

  for (byte addr = 1; addr < 127; addr++) {
    Wire.beginTransmission(addr);
    if (Wire.endTransmission() == 0) {
      Serial.printf("Found I2C device at 0x%02X\\n", addr);
    }
  }
}`,
    codeChallenge: {
      prompt: '책상 위에서는 잘 되던 I2C 센서가 바퀴 DC 모터를 돌리자마자 먹통이 되어 ESP32 loop() 전체가 멈추는 현상을 완화하는 하드웨어+소프트웨어 대책은?',
      buggyLine: '// 모터 직결 배선 + Wire 기본 무한 대기 -> 한 번 깨지면 영구 정지!',
      options: [
        '모터 단자에 0.1µF 세라믹 커패시터 + 선 꼬기(Twisted Pair)로 EMI를 줄이고 Wire.setTimeOut()으로 무한 대기(Hang)를 차단한다',
        '모터 선과 I2C SDA 선을 케이블타이로 바짝 묶어 같이 깐다',
        '모터 PWM을 0Hz로 둔다',
      ],
      correctIndex: 0,
      explanation: '세라믹 캡과 연선이 브러시 스파크 고주파 방사 노이즈를 억제하고, I2C 타임아웃 설정이 일시 오류 후 자동 복구를 가능케 합니다.',
    },
    quizzes: [
      {
        id: 'P6D44-1',
        question: '모든 부품과 코드를 연결하고 전원을 켰는데 로봇이 아무 반응도 없이 먹통일 때 가장 먼저(Step 1) 해야 할 점검은?',
        options: [
          'PID Kd 게인 수정',
          '멀티미터로 배터리, 5V 벅 출력, ESP32 3V3 핀 전압과 공통 GND 연결이 정상인지 확인한다',
          'A* 휴리스틱 수정',
          '3D 프린터 노즐 교체',
        ],
        correctIndex: 1,
        explanation: '전원이 죽었거나 3.3V가 무너진 상태에서 코드를 아무리 고쳐도 소용없으므로 무조건 전원 레일부터 확인합니다.',
      },
      {
        id: 'P6D44-2',
        question: '모터를 뽑았을 때는 I2C 센서가 100% 잘 읽히는데, 브러시 DC 모터를 구동하자마자 I2C 통신이 끊기고 보드가 리셋된다면 의심해야 할 원인은?',
        options: [
          '모터 돌입 전류에 의한 전원 전압 강하(Brownout) 또는 브러시 정류자 스파크 EMI 노이즈 간섭',
          '파이썬 문법 오류',
          '로봇 팔 길이가 길어서',
          'ArUco 마커 해상도',
        ],
        correctIndex: 0,
        explanation: '부품 단독 동작은 되는데 모터 투입 순간 죽는다면 전력(전원 분리 부족) 혹은 EMI 노이즈 문제입니다.',
      },
      {
        id: 'P6D44-3',
        question: '브러시 DC 모터 양단자와 모터 금속 외함 사이에 0.1µF(104) 세라믹 커패시터를 3개 납땜하는 주된 목적은?',
        options: [
          '브러시 마찰 스파크에서 발생하는 수십 MHz 고주파 노이즈(EMI)를 모터 단자 바로 앞에서 단락시켜 전선으로 퍼지지 않게 막으려고',
          '모터 회전 속도를 2배 높이려고',
          '역기전력 대신 직류 전류를 막으려고',
          '무게 중심을 맞추려고',
        ],
        correctIndex: 0,
        explanation: '소형 세라믹 커패시터는 고주파에 대해 임피던스가 낮아 모터 내부 스파크 노이즈를 로컬 바이패스 시킵니다.',
      },
      {
        id: 'P6D44-4',
        question: '모터 2A 전류가 흐르는 전원/GND 라인을 센서 보드 GND 선과 직렬로 데이지 체인 연결하지 않고 배터리 한 점에서 나누어 연결하는(Star Ground) 이유는?',
        options: [
          '모터 큰 전류가 GND 배선 저항 위를 흐르며 만드는 전압 흔들림(그라운드 바운스)이 센서 기준 0V를 오염시키지 않게 하려고',
          '전선을 더 많이 쓰려고',
          '납땜이 쉬워서',
          '아무 이유 없다',
        ],
        correctIndex: 0,
        explanation: 'Star Ground는 고전류 리턴 경로와 정밀 센서/로직 리턴 경로를 물리적으로 분리해 공통 임피던스 결합 노이즈를 막습니다.',
      },
      {
        id: 'P6D44-5',
        question: '현장에서 로버가 가끔 1초에 1번씩 멈칫하거나 재부팅될 때 시리얼 모니터에 `Brownout detector was triggered`가 떴다면 해결책은?',
        options: [
          '모터와 ESP32 전원을 벅 컨버터 등으로 분리하고 ESP32 VIN 옆에 대용량 디커플링 전해 커패시터(470µF)를 달며 배터리를 충전한다',
          'baud rate를 9600으로 바꾼다',
          'LED 저항을 뺀다',
          'delay(1000)을 추가한다',
        ],
        correctIndex: 0,
        explanation: 'Brownout 메시지는 입력 전원 순간 강하를 직접 뜻하므로 전력 공급 보강 및 분리, 버퍼 캡 추가가 정답입니다.',
      },
    ],
  },
  {
    id: 'day45_capstone',
    order: 45,
    dayLabel: 'Day 45',
    phaseLabel: 'Phase 6 · 기판 & 최종 캡스톤',
    title: '[최종 졸업 캡스톤] 자율 픽앤플레이스 모바일 매니퓰레이터',
    shortTitle: 'D45 · 졸업 캡스톤',
    subtitle: '전원/ESP32 · EKF+PID 주행 · ArUco+TF2 3D 인식 · 2축 IK+토크 검증 통합',
    badge: '최종 졸업 작품',
    milestoneTag: 'Day 45 풀스택 통합 랩',
    failFirstHook:
      '바퀴 주행, 비전 인식, 로봇 팔 역기구학이 각자 따로 시험할 땐 100% 성공했는데, 하나로 합쳐 통합 실행하는 순간 전원 강하·TF2 좌표 오프셋 불일치·통신 타임아웃이 한꺼번에 터집니다.',
    beginnerAnalogy:
      '45일간의 여정(전자회로 → ESP32/H-브리지 → 2R 기구학/동역학 → 엔코더/IMU/PID → ROS 2/비전/A*/SLAM)을 모두 연결해 "카메라로 블록을 찾아 차동 로버로 다가가고, TF2로 변환된 좌표에 로봇 팔 역기구학을 풀어 물건을 집어 올리는" 진정한 완전체 로봇을 완성합니다!',
    overviewSummary:
      '자율 픽앤플레이스 모바일 매니퓰레이터의 4단계 풀스택 임무(1. A*+EKF+PID 목표 접근 → 2. ArUco 비전 인식 & TF2 변환 → 3. 2R 역기구학 & 토크 게이트 픽업 → 4. 안전 구역 이동 및 안착)를 실행하며 전원 분리와 TF2 정합 게이트를 검증하세요.',
    guidedMissions: [
      {
        id: 'd45-checks',
        title: '전원 분리(5V Buck) + TF2(camera→base_link) 정합 사전 안전 체크 모두 통과하기',
        hint: '우측/하단 컨트롤에서 전원 분리 ON과 TF2 좌표 정합 ON이 모두 켜져 있는지 확인하세요.',
      },
      {
        id: 'd45-pick',
        title: '1단계 주행 → 2단계 ArUco 인식 → 3단계 2R IK 팔 픽업 단계 실행하기',
        hint: '미션 시퀀스 버튼에서 "2. 비전+TF2" 와 "3. IK 픽업"을 차례로 실행해 보세요.',
      },
      {
        id: 'd45-place',
        title: '4단계 목표 바구니 투하(Place) 완료하여 45일 풀스택 졸업 캡스톤 달성하기',
        hint: '"4. 목표 안착(Place)" 버튼을 눌러 전체 자율 픽앤플레이스 사이클을 완주하세요!',
      },
    ],
    highlights: [
      {
        title: '아키텍처 통합: 6대 핵심 공학 도메인 총결집',
        body: '기구/역기구학(Phase 3), 전원·H-브리지·ESP32 FreeRTOS(Phase 1~2), 엔코더·IMU·PID(Phase 4), OpenCV·TF2·A*(Phase 5), PCB·EMI 격리(Phase 6)가 하나의 상태 머신(FSM) 안에서 협력합니다.',
        tone: 'cyan',
      },
      {
        title: '하드웨어 안전과 소프트웨어 좌표 정렬이 최우선 관문',
        body: '자율 팔이 작동할 때는 주행 바퀴와 팔 서보가 동시에 돌입 전류를 당기므로 전원 분리(2S LiPo → 5V Buck + 6V Servo Rail)가 필수이며, 카메라가 찾은 ArUco 목표는 반드시 TF2로 팔 베이스 좌표로 변환해야 헛손질하지 않습니다.',
        tone: 'emerald',
      },
      {
        title: '유한 상태 머신(FSM) 통합 시퀀스 + 전 단계 Failsafe',
        body: 'NAVIGATE → VISUAL_SERVO → IK_PICK → TRANSPORT → PLACE → DONE 각 상태마다 타임아웃·특이점·토크 한계·CRC 에러 시 즉시 안전 복귀하는 구조가 취미 작품과 공학 로봇을 가릅니다.',
        tone: 'amber',
      },
    ],
    formulas: [
      {
        title: '비전(Camera) → 로봇 팔 베이스(Arm Base) 통합 좌표 체인',
        latex: String.raw`\mathbf{p}_{\text{arm}} = \left(T_{\text{base}}^{\text{arm}}\right)^{-1} T_{\text{base}}^{\text{cam}} \cdot \mathbf{p}_{\text{aruco}}^{\text{cam}} \quad\Longrightarrow\quad \operatorname{IK2R}(x_{\text{arm}}, y_{\text{arm}})`,
        description: '카메라 3D 인식 결과에 TF2 동차 변환을 거친 뒤에야 비로소 로봇 팔 IK 함수에 넣을 수 있습니다.',
      },
      {
        title: '풀스택 FSM 상태 전환 가드',
        latex: String.raw`\text{PICK\_OK} \iff \text{ValidCRC} \land |D_{\text{IK}}| \le 1 \land |\sin\theta_2| > 0.15 \land (\text{SF}_{\text{torque}} \ge 1.5)`,
        description: '통신·기구학·특이점·동역학 4대 관문을 동시 통과할 때만 그리퍼를 닫습니다.',
      },
    ],
    specs: [
      { label: '하위 MCU', value: 'ESP32 (FreeRTOS 100Hz)', note: 'PID · 엔코더 · 서보 · H브리지', tone: 'cyan' },
      { label: '상위 두뇌', value: 'Python + OpenCV + TF2', note: 'ArUco · A* · CRC8 브릿지', tone: 'amber' },
      { label: '전력 시스템', value: '2S LiPo → Buck 2레일', note: '로직 5V / 서보 6V / 모터 7.4V', tone: 'rose' },
      { label: '완주 성과', value: '45일 로보틱스 마스터', note: '이론→하드웨어→자율시스템', tone: 'emerald' },
    ],
    wiringNotes: [
      {
        signal: '동시 구동 피크 전류 예산 확인',
        pin: '주행 중 정지(바퀴 PWM=0) 후 로봇 팔 픽업 시작 (순차 시퀀스)',
        detail: '모바일 매니퓰레이터는 주행과 팔 동작을 FSM 상태로 나누어(정차 후 팔 뻗기) 전원 피크 전류를 낮추고 진동 오차도 방지합니다.',
      },
      {
        signal: '축하합니다! 이제 실제 부품을 사서 만들 준비가 되었습니다',
        pin: 'BOM: ESP32 DevKit + TB6612 + TT기어드(엔코더) + DS3225/SG90 + LM2596×2 + 2S LiPo + MPU6050 + 웹캠',
        detail: '이 45일 랩에서 검증한 회로와 코드 구조를 그대로 적용하면 내 손으로 첫 자율 로봇을 완성할 수 있습니다.',
      },
    ],
    codeTitle: 'day45_mobile_manipulator_fsm.py',
    codeLanguage: 'python',
    codeSnippet: `# Day 45: 최종 졸업 캡스톤 — 자율 픽앤플레이스 모바일 매니퓰레이터 메인 루프
def run_capstone_cycle(state, pose, aruco_cam_pt, power_ok, tf_ok):
    if not power_ok or not tf_ok:
        return "ESTOP", (0.0, 0.0) # 하드웨어/TF 이상 시 즉시 정지

    if state == "NAVIGATE":
        return step_dwa_to_target(pose), "VISION" if arrived else "NAVIGATE"
    elif state == "VISION":
        pt_arm = transform_cam_to_arm(aruco_cam_pt) # TF2 변환!
        if solve_safe_ik_and_torque(pt_arm):
            return move_arm_and_grip(pt_arm), "PLACE"
    return "DONE", (0.0, 0.0)`,
    codeChallenge: {
      prompt: '카메라가 물체의 3D 위치 p_cam을 검출했을 때, 로봇 팔 역기구학 함수 solve_2R_IK(x, y)에 넣기 직전 반드시 거쳐야 하는 단계는?',
      buggyLine: 'theta1, theta2 = solve_2R_IK(aruco_cam_x, aruco_cam_y) # 카메라 좌표를 팔에 그대로 대입!',
      options: [
        'TF2 동차 변환 T_arm_cam 을 곱해 카메라 좌표계 좌표를 로봇 팔 베이스 좌표계(p_arm)로 변환한다',
        'HSV로 한 번 더 변환한다',
        'CRC8을 곱한다',
      ],
      correctIndex: 0,
      explanation: '카메라 위치/기울기와 로봇 팔 원점이 물리적으로 떨어져 있으므로 TF2 좌표 변환 없이 넣으면 엉뚱한 허공을 집습니다.',
    },
    quizzes: [
      {
        id: 'P6D45-1',
        question: '모바일 매니퓰레이터(주행 바퀴 + 로봇 팔)가 물체를 집으려 할 때, FSM 단계를 "정지(NAV 완료) → 비전 정밀 확인 → 팔 픽업"으로 나누는 공학적 이유는?',
        options: [
          '주행 진동과 동적 관성 중엔 팔 정밀도·비전이 흔들리고, 바퀴+팔 동시 피크 전류에 의한 전원 전압 강하도 막을 수 있으므로',
          '코드 줄 수를 늘리려고',
          '모터가 1개라서',
          'Wi-Fi를 끄려고',
        ],
        correctIndex: 0,
        explanation: '바퀴를 멈추고 안정화한 뒤 픽업하면 전원 부하 분산과 카메라/IK 정밀도 확보를 동시에 달성합니다.',
      },
      {
        id: 'P6D45-2',
        question: '카메라(camera_link)가 ArUco 마커 중심을 (0.0m, 0.05m, 0.40m)로 인식했을 때, 로봇 팔 베이스 원점 기준 좌표로 올바르게 바꾸는 수학 도구는?',
        options: [
          '동차 변환 행렬 SE(3) / ROS 2 TF2 좌표 변환 (T_arm_cam)',
          '옴의 법칙 V = I·R',
          '1차 LPF',
          '4체배 엔코더',
        ],
        correctIndex: 0,
        explanation: '두 좌표 프레임 사이의 평행이동 + 회전 장착 각도를 반영한 SE(3) 변환(TF2)이 필요합니다.',
      },
      {
        id: 'P6D45-3',
        question: '자율 픽앤플레이스 시스템 통합 테스트에서 Python(PC)과 ESP32(하위 제어) 사이 시리얼 링크가 1초간 끊겼을 때 로봇이 취해야 할 최선의 행동은?',
        options: [
          'ESP32 자체 Failsafe 타임아웃(예: 500ms)이 발동해 바퀴 PWM을 0으로 정지하고 안전 상태로 대기한다',
          '마지막 속도로 계속 돌진한다',
          '모든 서보를 180도로 꺾는다',
          '플래시 메모리를 지운다',
        ],
        correctIndex: 0,
        explanation: '상위 컴퓨터나 무선 링크가 뻗더라도 하위 MCU가 독립적으로 500ms 워치독 정지를 수행해야 안전합니다.',
      },
      {
        id: 'P6D45-4',
        question: '2S LiPo 배터리(7.4V) 1개로 ESP32(3.3V), MG996R 로봇 팔 서보(6V, 최대 2A), 2WD 바퀴 모터(7.4V)를 모두 구동할 때 권장되는 전원 구성은?',
        options: [
          '로직용 5V Buck(→ESP32)과 고전류 서보용 5~6V Buck, 모터 드라이버용 7.4V 직결을 분리하고 공통 GND + 커패시터를 둔다',
          'ESP32 보드 위의 작은 3V3 핀에서 서보와 바퀴 모터를 전부 끌어다 쓴다',
          '9V 네모 건전지 1개로 전부 연결한다',
          'GND 선을 서로 분리해 끊어 둔다',
        ],
        correctIndex: 0,
        explanation: '고전류 액추에이터(서보/바퀴)와 민감한 두뇌(ESP32) 레일을 스위칭 벅 컨버터로 분리해야 브라운아웃 리셋이 안 납니다.',
      },
      {
        id: 'P6D45-5',
        question: '45일 풀스택 로보틱스 커리큘럼 완주 후 실제 로봇 제작 시 실패를 10배 줄여주는 핵심 엔지니어링 습관은?',
        options: [
          '배선 전 전원/분압 계산 → 3D/기구 공차 검증 → 하위 단위 격리 테스트(센서/엔코더/PID 단독 검증) → 상위 시스템 통합 및 Failsafe 우선 구현',
          '부품 전부 납땜하고 코드 1,000줄을 한 번에 짠 뒤 테스트 없이 전원 넣기',
          '공통 GND 생략하기',
          '특이점과 토크 여유 계산 생략하기',
        ],
        correctIndex: 0,
        explanation: '단위 모듈별 격리 검증, 물리·전기 한계 사전 계산, 그리고 Failsafe 안전 설계가 프로 엔지니어의 핵심 워크플로우입니다.',
      },
    ],
  },
];
