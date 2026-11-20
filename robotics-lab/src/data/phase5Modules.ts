import { LabModule } from '../types/lab';

export const PHASE5_MODULES: LabModule[] = [
  {
    id: 'day35_python_bridge',
    order: 35,
    dayLabel: 'Day 35',
    phaseLabel: 'Phase 5 · 경로/ROS 2/SLAM',
    title: 'Python ↔ ESP32 시리얼 바이너리 브릿지 & CRC',
    shortTitle: 'D35 · 시리얼/CRC',
    subtitle: '상위 지능(Python) vs 실시간(C++) · struct.pack 바이너리 · CRC8 체크섬',
    badge: '컴퓨팅 아키텍처',
    milestoneTag: 'Day 35 시리얼 브릿지 랩',
    failFirstHook:
      '카메라 비전까지 ESP32에 올리다 RAM이 폭발하고, PC↔ESP32 UART 통신 중 전선 노이즈로 1바이트만 깨져도 checksum이 없으면 로봇이 999m/s 명령을 읽고 폭주합니다.',
    beginnerAnalogy:
      'ESP32는 10ms마다 바퀴를 돌리는 "반사신경 척수", Python/PC는 지도를 보고 판단하는 "대뇌"로 역할을 분업하고, 위조·오타 검사 도장(CRC8)을 찍은 바이너리 봉투만 열어봅니다.',
    overviewSummary:
      'PC(Python)와 ESP32(C++)가 `[0xAA][0x55][vL][vR][CRC8]` 바이너리 프레임을 주고받을 때 1바이트 손상이 발생하면 어떤 사고가 나는지, 그리고 CRC8 체크섬 필터가 손상된 패킷을 어떻게 방어하는지 확인하세요.',
    guidedMissions: [
      {
        id: 'd35-corrupt',
        title: 'CRC 미적용 상태에서 1바이트 손상 주입 → 폭주 오명령 실행 체험하기',
        hint: '"CRC8 검증 OFF" 상태에서 "노이즈 1바이트 변조"를 켜서 엉뚱한 목표 속도를 확인하세요.',
      },
      {
        id: 'd35-crc',
        title: 'CRC8 체크섬 활성화로 손상된 패킷 폐기(Reject) 및 안전 유지하기',
        hint: 'CRC8 검증 스위치를 ON으로 전환해 수신측이 잘못된 패킷을 걸러내는지 확인하세요.',
      },
      {
        id: 'd35-code',
        title: 'Python struct.pack() 리틀 엔디언 바이너리 포맷 버그 해결하기',
        hint: '코드 탭의 Python/C++ 바이너리 패킹 챌린지를 맞혀보세요.',
      },
    ],
    highlights: [
      {
        title: '척수(ESP32 C++) ↔ 대뇌(PC/라즈베리파이 Python) 계층 분리',
        body: '실시간 PID(100Hz)·PWM·엔코더는 ESP32가 맡고, OpenCV·NumPy 경로계획·ROS 2는 Python/리눅스가 담당한 뒤 시리얼(UART/USB)로 목표 (v, ω)만 주고받습니다.',
        tone: 'cyan',
      },
      {
        title: 'JSON 텍스트 vs struct 바이너리 패킷 + 2바이트 헤더',
        body: 'JSON 문자열({"v":0.5})은 파싱이 느리고 바이트가 크지만, struct.pack("<BBffB", ...) 바이너리는 단 11바이트로 100Hz 이상 전송 가능하며 0xAA, 0x55 헤더로 프레임 시작점을 동기화합니다.',
        tone: 'emerald',
      },
      {
        title: 'CRC8 / XOR 체크섬: 1바이트라도 틀리면 무조건 폐기',
        body: '모터 EMI 노이즈로 1비트만 반전돼도 float 값이 1e20 같은 쓰레기 숫자가 됩니다. 마지막 바이트 CRC 비교가 불일치하면 즉시 drop하고 이전 안전 명령(또는 Failsafe)을 유지합니다.',
        tone: 'rose',
      },
    ],
    formulas: [
      {
        title: '바이너리 패킷 구조 (Little-Endian)',
        latex: String.raw`\text{Frame} = [\underbrace{\texttt{0xAA, 0x55}}_{\text{Sync Header}}] + [\underbrace{v,\; \omega}_{\text{2×float32 (8B)}}] + [\underbrace{\text{CRC8}}_{\text{1B 검증}}]`,
        description: '총 11바이트 고정 길이 패킷. 115200bps 기준 1ms 이내 전송 완료됩니다.',
      },
      {
        title: 'XOR / CRC8 다항식 검증 조건',
        latex: String.raw`\text{CRC}_{\text{rx}} \stackrel{?}{=} \operatorname{CRC8}(\text{payload}[0..N-1]) \quad\Longrightarrow\quad \text{False면 REJECT!}`,
        description: '패킷 수신율과 무결성을 확인하기 위해 유효 패킷 수신 시각(lastValidRxMs)만 갱신합니다.',
      },
    ],
    specs: [
      { label: 'UART 권장 보드레이트', value: '115,200 ~ 921,600', note: '로봇 실전은 460800+ 권장', tone: 'cyan' },
      { label: '패킷 오버헤드', value: '11 Bytes (Binary)', note: 'JSON 대비 ~5× 경량', tone: 'emerald' },
      { label: '엔디언(Endianness)', value: 'Little-Endian (<)', note: 'ESP32(Xtensa) · x86/ARM 일치', tone: 'amber' },
      { label: '무결성 실패 대응', value: '패킷 폐기 + 타임아웃', note: '절대 손상 값으로 PWM 금지', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: 'C++ __attribute__((packed)) 필수',
        pin: 'struct __attribute__((packed)) CmdPacket { ... };',
        detail: '컴파일러가 4바이트 정렬 패딩(빈 공간)을 끼워 넣으면 Python struct와 크기가 달라지므로 packed 지시자가 필수입니다.',
      },
      {
        signal: '비동기 논블로킹 링버퍼 파싱',
        pin: 'while (Serial.available()) 상태 머신 파서 실행',
        detail: 'Serial.readBytes()나 readStringUntil()은 타임아웃 동안 PID 루프를 멈추므로 바이트 1개씩 상태 머신으로 읽습니다.',
      },
    ],
    codeTitle: 'day35_python_serial_bridge.py',
    codeLanguage: 'python',
    codeSnippet: `# Day 35: Python -> ESP32 바이너리 제어 패킷 송신 (Header + 2 float + CRC8)
import struct

def crc8_xor(data: bytes) -> int:
    c = 0
    for b in data:
        c ^= b
    return c

def pack_cmd(v_mps: float, omega_rps: float) -> bytes:
    payload = struct.pack('<ff', v_mps, omega_rps) # Little-endian 2 floats (8B)
    crc = crc8_xor(payload)
    return b'\\xaa\\x55' + payload + struct.pack('<B', crc)`,
    codeChallenge: {
      prompt: 'Python의 struct.pack()으로 ESP32(Xtensa C++)와 동일한 리틀 엔디언 float 2개를 묶으려 할 때 올바른 포맷 문자열은?',
      buggyLine: "payload = struct.pack('>ff', v_mps, omega_rps) # Big-endian 사용!",
      options: [
        "payload = struct.pack('<ff', v_mps, omega_rps)",
        "payload = struct.pack('<ii', v_mps, omega_rps)",
        'payload = str(v_mps) + str(omega_rps)',
      ],
      correctIndex: 0,
      explanation: 'ESP32와 일반 PC는 Little-Endian(<) 바이트 순서를 쓰며 32비트 float은 f입니다.',
    },
    quizzes: [
      {
        id: 'P5D35-1',
        question: 'PC(Python)와 ESP32(C++)를 역할을 나누어 연동할 때 ESP32 쪽에 남겨두어야 할 핵심 작업은?',
        options: [
          '수십 메가픽셀 딥러닝 영상 추론',
          '100Hz 엔코더 읽기 · PID 모터 PWM · 긴급 정지 Failsafe 같은 실시간(Hard Real-time) 하위 제어',
          '웹 브라우저 HTML 렌더링',
          'SLAM 글로벌 지도 최적화',
        ],
        correctIndex: 1,
        explanation: 'PC/라즈베리파이는 OS 스케줄링 지연이 크므로 주기 엄수가 필수인 센서·모터 루프는 MCU(ESP32)가 맡습니다.',
      },
      {
        id: 'P5D35-2',
        question: '시리얼 바이너리 패킷 맨 앞에 0xAA, 0x55 같은 고정 Sync Header 2바이트를 붙이는 이유는?',
        options: [
          '전선 전압을 높이기 위해',
          '통신 중간부터 연결되거나 바이트가 빠졌을 때 패킷의 정확한 시작 경계(Framing)를 다시 찾기 위해',
          'float 숫자를 정수로 바꾸기 위해',
          'USB 케이블 속도를 2배 높이기 위해',
        ],
        correctIndex: 1,
        explanation: '바이트 스트림은 시작과 끝 표시가 없으므로 고유한 2바이트 헤더 패턴을 찾아 프레임을 동기화합니다.',
      },
      {
        id: 'P5D35-3',
        question: 'C++ 구조체와 Python struct.pack() 사이에서 float 변수 1개와 uint8_t 변수 1개를 묶을 때 C++ 쪽에 __attribute__((packed))를 붙이는 이유는?',
        options: [
          '컴파일러가 CPU 성능 때문에 구조체 멤버 사이에 임의의 빈 공간(Memory Padding)을 삽입해 바이트 크기가 어긋나는 것을 막으려고',
          '메모리를 암호화하려고',
          '전류를 아끼려고',
          'C++ 변수 이름을 파이썬에 복사하려고',
        ],
        correctIndex: 0,
        explanation: 'packed 속성이 없으면 4바이트 정렬 규칙 때문에 uint8_t 뒤에 3바이트 패딩이 생겨 파싱 위치가 밀립니다.',
      },
      {
        id: 'P5D35-4',
        question: 'ESP32가 시리얼로 받은 패킷의 CRC8 검증에 실패했을 때 가장 안전한 처리 방법은?',
        options: [
          '일단 모터에 인가한 뒤 나중에 확인한다',
          '해당 손상 패킷 전체를 즉시 폐기(Drop)하고 헤더 탐색 상태로 복귀하며 lastValidRxMs를 갱신하지 않는다',
          '보드를 재부팅한다',
          '최고 속도로 돌린다',
        ],
        correctIndex: 1,
        explanation: '깨진 float는 NaN이나 엄청난 수로 해석될 수 있으므로 철저히 버려야 안전합니다.',
      },
      {
        id: 'P5D35-5',
        question: 'ESP32 제어 루프 안에서 Serial.readStringUntil("\\n") 같은 블로킹 수신 함수를 지양해야 하는 이유는?',
        options: [
          '데이터가 안 올 때 기본 1000ms 타임아웃 동안 CPU를 붙잡아 모터 PID 제어 주기를 멈춰버리므로',
          '파이썬이 못 읽으므로',
          '체크섬이 자동 삭제되므로',
          'float을 출력할 수 없으므로',
        ],
        correctIndex: 0,
        explanation: 'while (Serial.available())로 현재 도착한 바이트만 비동기로 읽어야 실시간 제어 주기가 깨지지 않습니다.',
      },
    ],
  },
  {
    id: 'day36_path_planning',
    order: 36,
    dayLabel: 'Day 36',
    phaseLabel: 'Phase 5 · 경로/ROS 2/SLAM',
    title: '경로 계획: C-Space 팽창 · A* · DWA 회피',
    shortTitle: 'D36 · C-Space/A*/DWA',
    subtitle: '로봇 반지름 장애물 팽창 · 휴리스틱 f=g+h 그래프 탐색 · 실시간 DWA',
    badge: '자율 경로 계획',
    milestoneTag: 'Day 36 경로 계획 그리드 랩',
    failFirstHook:
      '로봇을 크기 없는 "점"으로 취급해 벽 1cm 옆으로 A* 최단 경로를 짜면, 실제 로봇은 차체 반지름 때문에 코너를 돌 때마다 벽에 긁히며 끼입니다.',
    beginnerAnalogy:
      'C-Space는 장애물 벽에 로봇 몸통 반지름만큼 두꺼운 에어백을 씌워둔 지도입니다. 에어백 밖으로만 길을 찾으면(A*: 내비게이션), 실제 로봇이 절대 벽에 닿지 않으며, 갑툭튀 장애물은 DWA(급핸들)로 피합니다.',
    overviewSummary:
      '10×7 장애물 격자 맵에서 실제 A* 탐색 엔진이 실시간 계산하는 최단 경로를 관찰하세요. C-Space 장애물 팽창을 끄고 켤 때 코너 경로 안전성이 어떻게 바뀌는지, 그리고 동적 장애물 출현 시 DWA 지역 회피가 어떻게 반응하는지 확인하세요.',
    guidedMissions: [
      {
        id: 'd36-cspace',
        title: 'C-Space 팽창 OFF 상태의 벽 스침 충돌 위험 확인 후 팽창 ON으로 안전 경로 찾기',
        hint: 'C-Space 장애물 팽창 버튼을 OFF → ON으로 전환해 벽에서 1칸 떨어진 안전한 A* 경로를 확인하세요.',
      },
      {
        id: 'd36-dwa',
        title: '경로상 돌발 동적 장애물 배치 후 DWA(지역 회피) 모드로 우회 기동 확인하기',
        hint: '동적 장애물 스위치를 ON으로 켜고 플래너를 DWA 회피로 전환해 우회 경로를 확인하세요.',
      },
      {
        id: 'd36-code',
        title: 'A* 평가 함수 f(n) = g(n) + h(n) 휴리스틱 코드 챌린지 풀기',
        hint: '코드 탭의 A* 휴리스틱 버그 수정 챌린지를 풀어보세요.',
      },
    ],
    highlights: [
      {
        title: 'Configuration Space (C-Space) 장애물 팽창',
        body: '실제 장애물 셀 주변으로 로봇 내접 반지름 + 안전 마진만큼 셀을 회색(Inflation Layer)으로 부풀려두면, 이후 경로 계획은 로봇을 단순 점으로 취급해도 100% 무충돌이 보장됩니다.',
        tone: 'cyan',
      },
      {
        title: 'A* 전역 경로 탐색: f(n) = g(n) + h(n)',
        body: '출발점부터의 누적 비용 g(n)에 목표까지의 직선(유클리드/맨해튼) 추정 비용 h(n)을 더해, 다익스트라보다 불필요한 방향 탐색을 크게 줄이면서도 최적(Optimal) 경로를 찾습니다.',
        tone: 'emerald',
      },
      {
        title: 'RRT(다관절 로봇 팔) vs DWA(동적 장애물 지역 회피)',
        body: '6축 로봇 팔처럼 고차원 공간은 무작위 트리(RRT)로 뚫고, 바퀴 로봇 주행 중 사람/박스 같은 새 장애물이 나타나면 현재 속도·가속 한계 내에서 안전한 (v, ω) 쌍을 고르는 DWA가 즉각 피합니다.',
        tone: 'amber',
      },
    ],
    formulas: [
      {
        title: 'A* 노드 우선순위 평가 함수 & 허용 가능성(Admissible)',
        latex: String.raw`f(n) = g(n) + h(n), \qquad h(n) \le h^*(n)\; (\text{실제 최단 거리 초과 금지})`,
        description: '휴리스틱 h(n)이 실제 거리보다 절대 크지 않아야 최단 경로 보장이 깨지지 않습니다.',
      },
      {
        title: 'DWA (Dynamic Window Approach) 목적 함수',
        latex: String.raw`G(v, \omega) = \sigma\!\Bigl(\alpha\cdot\text{heading}(v,\omega) + \beta\cdot\text{dist}(v,\omega) + \gamma\cdot\text{vel}(v,\omega)\Bigr)`,
        description: '가속도 한계(Dynamic Window) 안의 후보 속도 중 목표 방향·장애물 거리·전진 속도가 최적인 쌍을 택합니다.',
      },
    ],
    specs: [
      { label: '다익스트라 vs A*', value: 'h(n) = 0 vs > 0', note: 'A*가 목표 방향으로 집중 탐색', tone: 'cyan' },
      { label: 'C-Space 마진', value: 'R_robot + 여유 3~5cm', note: 'ROS Nav2 Inflation Layer', tone: 'emerald' },
      { label: '고차원(6-DOF Arm)', value: 'RRT / RRT* / PRM', note: '격자 생성 불가 → 샘플링 기반', tone: 'amber' },
      { label: '동적 회피 (Local)', value: 'DWA / TEB (20Hz)', note: '기구학·관성 제약 직접 반영', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: 'Nav2 Global Planner + Local Controller 이원 구조',
        pin: 'Global(1~2Hz A*) + Local(20Hz DWA)',
        detail: '전역 지도 전체 A*를 매 10ms마다 다시 짜면 CPU가 뻗으므로, 전역 경로는 1초에 1~2번, 장애물 회피는 로봇 주변 2m 창(Local Costmap)에서 20Hz로 돌립니다.',
      },
      {
        signal: '원형 근사 vs 풋프린트 다각형',
        pin: '직사각형 로버는 반지름 R_circumscribed 기준 팽창',
        detail: '회전할 때 모서리가 스치지 않도록 차체 가장 긴 대각선 절반(외접 반지름)을 기준으로 팽창시켜야 안전합니다.',
      },
    ],
    codeTitle: 'day36_astar_planner.py',
    codeLanguage: 'python',
    codeSnippet: `# Day 36: 격자 지도 기반 A* (f = g + h) 핵심 루프
import heapq, math

def heuristic(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1]) # 유클리드 거리 <= 실제 거리

def astar(grid, start, goal):
    pq = [(0.0, start)]
    g_cost = {start: 0.0}
    while pq:
        _, cur = heapq.heappop(pq)
        if cur == goal:
            return True
        # 4방향/8방향 이웃 탐색 후 f = new_g + heuristic(nxt, goal)
    return False`,
    codeChallenge: {
      prompt: 'A* 알고리즘이 항상 수학적 최단 경로를 놓치지 않고 찾도록 보장하려면 휴리스틱 함수 h(n)의 값은 어떻게 설계해야 하나요?',
      buggyLine: 'f = g_cost + 100.0 * heuristic(nxt, goal); // 실제 거리보다 너무 과장됨!',
      options: [
        'h(n) <= 실제 최단 거리 (유클리드 거리 등 과대평가하지 않는 Admissible 휴리스틱 사용)',
        'h(n)은 항상 음수로 둔다',
        'g_cost를 무시하고 h(n)만 쓴다',
      ],
      correctIndex: 0,
      explanation: 'h(n)에 100배 가중치를 곱해 실제 최단 거리보다 과대평가(Inadmissible)하면 탐욕 탐색(Greedy)으로 변질되어 엉뚱한 우회 경로를 최단이라 착각할 수 있습니다.',
    },
    quizzes: [
      {
        id: 'P5D36-1',
        question: '격자 지도에서 경로를 찾기 전에 장애물 셀 주변을 로봇 반지름만큼 미리 부풀려 두는 기법과 목적은?',
        options: [
          'C-Space(Configuration Space) 팽창 — 이후 경로 계획 시 로봇을 크기 없는 점으로 다뤄도 벽 모서리 충돌을 원천 차단하려고',
          '칼만 이득 증가',
          '라이다 해상도 축소',
          '배터리 전압 상승',
        ],
        correctIndex: 0,
        explanation: '로봇 크기를 장애물 팽창(Minkowski Sum)으로 미리 흡수하면 점 로봇용 A*를 그대로 돌려도 안전합니다.',
      },
      {
        id: 'P5D36-2',
        question: 'A* 알고리즘의 f(n) = g(n) + h(n)에서 h(n) = 0 으로 두면 어떤 알고리즘과 같아질까요?',
        options: [
          '깊이 우선 탐색(DFS)',
          '다익스트라(Dijkstra) 알고리즘',
          'RRT',
          '칼만 필터',
        ],
        correctIndex: 1,
        explanation: '목표까지의 추정치 h(n)=0이면 출발점으로부터의 실제 누적 비용 g(n)만 고려해 사방으로 균일하게 뻗는 다익스트라가 됩니다.',
      },
      {
        id: 'P5D36-3',
        question: '6축 다관절 로봇 팔의 충돌 회피 경로를 찾을 때 2D 격자 기반 A* 대신 RRT/RRT* 같은 샘플링 기반 알고리즘을 쓰는 이유는?',
        options: [
          '6차원 관절 공간을 격자로 나누면 100⁶ = 1조 개 셀이 필요해 메모리/시간이 폭발(차원의 저주)하므로',
          '로봇 팔은 직선으로만 움직이므로',
          'A*는 3차원 이상에서 문법 오류라서',
          '무작위가 항상 더 정확해서',
        ],
        correctIndex: 0,
        explanation: '고차원 C-Space에서는 격자 이산화 대신 무작위 관절 자세를 샘플링해 트리를 뻗는 RRT 계열이 표준입니다.',
      },
      {
        id: 'P5D36-4',
        question: 'DWA(Dynamic Window Approach)가 로봇의 동역학적 현실을 고려하기 위해 후보 (v, ω) 공간을 제한하는 기준은?',
        options: [
          '로봇의 현재 속도(v, ω)에서 다음 제어 주기 Δt 동안 최대 가속/감속 한계 내로 실제 달성 가능한 속도 창(Window)',
          '무한대 속도 범위',
          '정지 상태 (0, 0)만 허용',
          'Wi-Fi 신호 세기',
        ],
        correctIndex: 0,
        explanation: '급정거나 급가속이 불가능한 물리 관성을 고려해 1틱 내 도달 가능하고 충돌 전 제동 가능한 속도 후보만 평가합니다.',
      },
      {
        id: 'P5D36-5',
        question: '전역 경로(A*)만 따르고 DWA 지역 회피를 껐을 때, 지도에 없던 의자가 앞을 막으면 발생하는 문제는?',
        options: [
          '의자가 기존 정적 지도(Static Map)에 없으므로 로봇이 A* 선을 그대로 밀고 들어가 정면 충돌한다',
          '로봇이 하늘로 난다',
          '자동으로 지도가 삭제된다',
          'GPS가 켜진다',
        ],
        correctIndex: 0,
        explanation: '실시간 거리 센서로 Local Costmap을 갱신하고 DWA/재계획으로 회피해야 동적 환경에서 안전합니다.',
      },
    ],
  },
  {
    id: 'day37_ros2_arch',
    order: 37,
    dayLabel: 'Day 37',
    phaseLabel: 'Phase 5 · 경로/ROS 2/SLAM',
    title: 'ROS 2 아키텍처: Node · Topic · Service · Action & QoS',
    shortTitle: 'D37 · ROS 2/QoS',
    subtitle: 'Pub/Sub Topic · Sync Service · Feedback Action · Best-Effort vs Reliable',
    badge: 'ROS 2 미들웨어',
    milestoneTag: 'Day 37 ROS 2 통신 그래프 랩',
    failFirstHook:
      '카메라 영상 스트림 QoS를 Reliable로 걸고 Wi-Fi가 잠깐 끊기면 재전송 대기열이 막히며 지연이 3초씩 밀리고, 반대로 긴급 모터 정지 명령을 Best-Effort로 보내면 패킷 1개 드롭 시 정지를 못 합니다.',
    beginnerAnalogy:
      'Topic은 끊임없이 방송되는 라디오 스트림(센서·속도), Service는 1초 내 즉답이 오는 창구 문의(파라미터/리셋), Action은 배달 기사처럼 진행률(% 피드백)과 취소 버튼을 주는 장기 작업(목표점 주행)입니다.',
    overviewSummary:
      'ROS 2 노드 그래프에서 Topic(연속 스트림) · Service(단발 요청/응답) · Action(진행 피드백+취소)의 데이터 흐름과, Wi-Fi 패킷 손실이 발생할 때 Best-Effort QoS와 Reliable QoS의 동작 차이를 실험하세요.',
    guidedMissions: [
      {
        id: 'd37-patterns',
        title: 'Topic · Service · Action 세 가지 통신 패턴의 메시지 흐름 모두 비교하기',
        hint: '상단 통신 패턴 탭(Topic / Service / Action)을 차례로 전환해 흐름을 확인하세요.',
      },
      {
        id: 'd37-qos',
        title: '패킷 손실률(20%) 주입 상태에서 Best-Effort vs Reliable QoS 차이 확인하기',
        hint: '패킷 손실을 20% 이상으로 올리고 QoS(Best-Effort vs Reliable) 스위치를 전환해 보세요.',
      },
      {
        id: 'd37-code',
        title: 'ROS 2 rclpy /cmd_vel 퍼블리셔 QoS 설정 코드 챌린지 풀기',
        hint: '코드 탭의 ROS 2 QoS 설정 버그 수정 챌린지를 맞혀보세요.',
      },
    ],
    highlights: [
      {
        title: 'Topic (1:N 비동기 스트림) vs Service (1:1 단발 요청)',
        body: 'LiDAR(/scan), IMU(/imu), 모터 속도(/cmd_vel)처럼 초당 수십 번 계속 흐르는 데이터는 Topic, 맵 저장이나 캘리브레이션처럼 즉각 성공/실패 답이 필요한 건 Service를 씁니다.',
        tone: 'cyan',
      },
      {
        title: 'Action (장기 비동기 임무 = Goal + Feedback + Cancel)',
        body: '"저쪽 방까지 자율 주행하라(NavigateToPose)"는 몇십 초가 걸리므로 Service로 부르면 그 사이 노드가 멈춥니다. Action은 중간 위치 피드백과 작업 도중 Cancel(취소)을 지원합니다.',
        tone: 'emerald',
      },
      {
        title: 'QoS 프로파일: SensorData(Best-Effort) vs Reliable',
        body: '고주파 센서(카메라/LiDAR)는 과거 프레임 재전송보다 최신 프레임 유지가 중요해 Best-Effort + KeepLast(1~5)를 쓰고, 내비게이션 목표나 긴급 정지는 유실 방지를 위해 Reliable을 씁니다.',
        tone: 'amber',
      },
    ],
    formulas: [
      {
        title: 'ROS 2 DDS QoS 호환성 규칙 (Pub ↔ Sub 매칭)',
        latex: String.raw`\text{Pub: Best-Effort} \;+\; \text{Sub: Reliable} \;\Longrightarrow\; \text{연결 거부 (Incompatible QoS!)}`,
        description: '퍼블리셔가 Best-Effort인데 서브스크라이버가 Reliable을 요구하면 토픽이 아예 연결되지 않습니다.',
      },
      {
        title: 'Action 내부 구조 = 3 Topic + 2 Service',
        latex: String.raw`\text{Action} = \{\text{SendGoal Srv},\; \text{Cancel Srv},\; \text{GetResult Srv}\} + \{\text{Feedback Topic},\; \text{Status Topic}\}`,
        description: 'ROS 2 Action은 실제로 서비스와 토픽을 표준 규격으로 조합해 구현됩니다.',
      },
    ],
    specs: [
      { label: '센서 스트림 (/scan)', value: 'Topic + Best-Effort', note: '지연 최소화 · 드롭 허용', tone: 'cyan' },
      { label: '즉각 요청 (/reset)', value: 'Service (Sync/Async)', note: '빠른 응답 전용', tone: 'amber' },
      { label: '자율주행 목표', value: 'Action + Reliable', note: '진행률 피드백 · 취소 지원', tone: 'emerald' },
      { label: '빌드 시스템', value: 'colcon build', note: '--symlink-install 추천', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '콜백 블로킹 금지 (Reentrant / MultiThreadedExecutor)',
        pin: 'Service 콜백 안에서 time.sleep()이나 다른 service call.call() 금지',
        detail: '단일 스레드 Executor 콜백 안에서 동기 대기를 걸면 데드락에 빠져 노드가 멈춥니다.',
      },
      {
        signal: 'QoS 불일치 디버깅 명령어',
        pin: 'ros2 topic info /scan --verbose',
        detail: '구독자인데 콜백이 아예 안 불리면 90% 확률로 QoS Reliability 불일치입니다. --verbose 옵션으로 즉시 잡습니다.',
      },
    ],
    codeTitle: 'day37_ros2_node_qos.py',
    codeLanguage: 'python',
    codeSnippet: `# Day 37: ROS 2 센서용 Best-Effort vs 제어용 Reliable QoS 구성
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy, HistoryPolicy
from geometry_msgs.msg import Twist

sensor_qos = QoSProfile(
    reliability=ReliabilityPolicy.BEST_EFFORT,
    history=HistoryPolicy.KEEP_LAST,
    depth=5,
)
# 제어 명령은 유실 방지를 위해 RELIABLE 기본값 사용`,
    codeChallenge: {
      prompt: '초당 30프레임 카메라 센서(/image_raw)를 Wi-Fi로 전송할 때 과거 프레임 재전송으로 영상이 수 초씩 밀리는 걸 막는 올바른 QoS 설정은?',
      buggyLine: 'QoSProfile(reliability=ReliabilityPolicy.RELIABLE, depth=100)',
      options: [
        'QoSProfile(reliability=ReliabilityPolicy.BEST_EFFORT, depth=1)',
        'QoSProfile(reliability=ReliabilityPolicy.RELIABLE, depth=1000)',
        'Service로 30Hz 요청하기',
      ],
      correctIndex: 0,
      explanation: '실시간 센서 스트림은 지나간 프레임을 재전송(Reliable)하려 대기하기보다 유실돼도 최신 프레임(Best-Effort, depth=1~5)을 받는 것이 유리합니다.',
    },
    quizzes: [
      {
        id: 'P5D37-1',
        question: '로봇에게 "3번 방으로 이동해라(30초 소요)"라고 지시하면서 중간 도착 확률과 도중 취소(Cancel) 기능이 필요할 때 알맞은 ROS 2 통신 모델은?',
        options: ['Topic', 'Service', 'Action', 'Parameter'],
        correctIndex: 2,
        explanation: '시간이 오래 걸리는 작업(Long-running task)에 Goal, Feedback, Cancel, Result를 모두 지원하는 모델은 Action입니다.',
      },
      {
        id: 'P5D37-2',
        question: '퍼블리셔(센서 드라이버)가 Best-Effort QoS로 토픽을 쏘고 있는데, 내 구독자 노드가 Reliable QoS로 구독하려 하면 어떤 일이 벌어지나요?',
        options: [
          '알아서 Best-Effort로 동작한다',
          'Incompatible QoS 경고와 함께 두 노드 간 데이터가 전혀 수신되지 않는다',
          '속도가 2배 빨라진다',
          '노드가 자동 컴파일된다',
        ],
        correctIndex: 1,
        explanation: 'QoS Matching 규칙상 Publisher가 요구 수준(Reliable)을 보장 못하면 DDS 미들웨어가 연결 자체를 성립시키지 않습니다.',
      },
      {
        id: 'P5D37-3',
        question: 'ROS 2 워크스페이스에서 Python 파일 수정 후 매번 다시 colcon build 하지 않아도 반영되게 해주는 유용한 빌드 옵션은?',
        options: [
          'colcon build --symlink-install',
          'colcon build --delete',
          'ros2 topic echo',
          'pip freeze',
        ],
        correctIndex: 0,
        explanation: '--symlink-install을 사용하면 설치 폴더에 파일 복사 대신 심볼릭 링크를 걸어 Python 스크립트 변경이 즉시 반영됩니다.',
      },
      {
        id: 'P5D37-4',
        question: '실시간 LiDAR/카메라 센서 데이터가 무선 네트워크에서 잠깐 끊겨도 과거 1초 전 데이터를 쌓아두지 않도록 하는 권장 QoS 조합은?',
        options: [
          'Reliable + KeepAll',
          'Best-Effort + KeepLast(depth=1~5)',
          'Transient Local + KeepAll',
          'Service Sync Call',
        ],
        correctIndex: 1,
        explanation: '센서 최신값이 생명인 데이터는 Best-Effort와 작은 큐 깊이(depth)로 레이턴시 누적을 막습니다.',
      },
      {
        id: 'P5D37-5',
        question: 'ROS 2 토픽의 메시지 타입과 양쪽 노드의 QoS 설정 불일치 여부를 한눈에 점검하는 CLI 명령어는?',
        options: [
          'ros2 topic info <topic_name> --verbose',
          'ros2 node list',
          'colcon test',
          'ls /dev/ttyUSB*',
        ],
        correctIndex: 0,
        explanation: '--verbose 플래그를 붙이면 현재 붙어 있는 Publisher와 Subscriber 각각의 QoS 정책이 출력됩니다.',
      },
    ],
  },
  {
    id: 'day38_tf2_urdf',
    order: 38,
    dayLabel: 'Day 38',
    phaseLabel: 'Phase 5 · 경로/ROS 2/SLAM',
    title: 'ROS 2 TF2 좌표 트리 & URDF 모델링',
    shortTitle: 'D38 · TF2 좌표트리',
    subtitle: 'REP-105 (map→odom→base_link) · Static vs Dynamic TF · 센서 오프셋 보정',
    badge: '좌표계/URDF',
    milestoneTag: 'Day 38 TF2 좌표트리 랩',
    failFirstHook:
      '라이다(또는 카메라)가 로봇 중심(base_link)에서 앞쪽 20cm에 달려 있다는 Static TF를 등록하지 않으면, 로봇이 자기 앞 벽 위치를 실제보다 20cm 뒤로 착각해 모서리에 부딪힙니다.',
    beginnerAnalogy:
      'TF2는 "지구(map) → 내가 출발한 주차선(odom) → 차체 중심(base_link) → 범퍼 위 라이다(laser_link)"까지 이어진 가족 가계도입니다. 라이다가 본 좌표를 차체나 지도 좌표로 자동 환산해 줍니다.',
    overviewSummary:
      'ROS 2 표준 REP-105 좌표 트리(map → odom → base_link → laser_link) 구조를 살펴보고, 센서 정적 오프셋(Static TF) 적용 여부에 따라 레이저 장애물 포인트가 실제 지도 벽과 일치하거나 어긋나는 현상을 실험하세요.',
    guidedMissions: [
      {
        id: 'd38-missing',
        title: 'TF2 정적 오프셋 미설정(TF Missing) 상태로 센서 점 위치 왜곡 확인하기',
        hint: 'Static TF 적용 스위치를 OFF로 두면 레이저 벽 점이 실제 벽과 엇갈리는 것을 보세요.',
      },
      {
        id: 'd38-static',
        title: 'Static TF 활성화로 base_link→laser_link 오프셋을 지도 벽과 정확히 정합하기',
        hint: 'Static TF 스위치를 ON으로 켜서 센서 포인트가 벽과 100% 겹치는지 확인하세요.',
      },
      {
        id: 'd38-offset',
        title: '센서 장착 위치 오프셋(cm)을 변경해 변환 행렬 실시간 반영 확인하기',
        hint: '센서 앞쪽 장착 오프셋 슬라이더를 +10cm ~ +35cm 사이로 움직여 보세요.',
      },
    ],
    highlights: [
      {
        title: '표준 REP-105 트리: map → odom → base_link',
        body: 'odom→base_link는 바퀴 오도메트리로 매끄럽고 연속적이지만 드리프트가 있고, map→odom은 SLAM/AMCL이 가끔 점프 보정해 전체 절대 위치를 맞춥니다. 두 부모가 같은 자식을 가질 수 없는 트리(Tree) 구조입니다.',
        tone: 'cyan',
      },
      {
        title: 'Static Transform (/tf_static) vs Dynamic Transform (/tf)',
        body: '볼트로 고정된 센서 위치(base_link → laser_link, camera_link)는 한 번만 쏘면 유지되는 Static TF(robot_state_publisher), 움직이는 차체와 바퀴·관절 각도는 계속 쏘는 Dynamic TF입니다.',
        tone: 'emerald',
      },
      {
        title: 'URDF: 로봇의 뼈대(Link), 관절(Joint), 충돌체, 질량',
        body: 'URDF(또는 매크로 Xacro) 파일에 각 링크의 시각/충돌 기하형상과 관절 좌표를 적어두면 robot_state_publisher가 /joint_states를 읽어 모든 TF를 자동 발행합니다.',
        tone: 'amber',
      },
    ],
    formulas: [
      {
        title: '연쇄 TF2 포인트 변환 (센서 점 → 지도 좌표)',
        latex: String.raw`\mathbf{p}_{\text{map}} = T_{\text{map}}^{\text{odom}} \cdot T_{\text{odom}}^{\text{base}} \cdot T_{\text{base}}^{\text{laser}} \cdot \mathbf{p}_{\text{laser}}`,
        description: '사용자는 lookupTransform("map", "laser_link", time)만 호출하면 TF2가 중간 행렬 곱을 대신 해줍니다.',
      },
      {
        title: 'TF2 단일 부모 제약 (Single-Parent Tree Rule)',
        latex: String.raw`\text{Parent}(\text{base\_link}) \in \{\text{odom}\}, \qquad \text{odom} \text{ 와 } \text{map} \text{ 둘 다 직계 부모 불가!}`,
        description: '만약 오도메트리와 AMCL이 둘 다 base_link의 부모로 TF를 쏘면 로봇이 순간이동하며 떨리는 TF 전쟁이 일어납니다.',
      },
    ],
    specs: [
      { label: 'map → odom', value: 'SLAM / AMCL 발행', note: '드리프트 보정(불연속 가능)', tone: 'amber' },
      { label: 'odom → base_link', value: '오도메트리 / EKF 발행', note: '로컬 제어용(매우 연속적)', tone: 'cyan' },
      { label: 'base → laser', value: '/tf_static (고정)', note: 'URDF로 자동 관리', tone: 'emerald' },
      { label: '조회 시간 오류', value: 'Extrapolation Error', note: '타임스탬프·시계 동기 확인', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '라이다 0° 방향과 +X 전방 일치 점검',
        pin: 'RPLiDAR 케이블 방향이 +X 인지 -X(180° 반전)인지 URDF yaw 확인',
        detail: '라이다를 거꾸로 달았는데 yaw=0으로 두면 앞 벽이 뒤편에 찍혀 주행 시작 즉시 역주행합니다.',
      },
      {
        signal: '디버깅 시각화: view_frames & rqt_tf_tree',
        pin: 'ros2 run tf2_tools view_frames',
        detail: '트리 끊김이나 두 부모 충돌 여부를 PDF 트리로 뽑아주는 필수 진단 도구입니다.',
      },
    ],
    codeTitle: 'day38_tf2_lookup.py',
    codeLanguage: 'python',
    codeSnippet: `# Day 38: TF2로 laser_link 기준 장애물 점을 map 좌표계로 변환
from tf2_ros import Buffer, TransformListener
import tf2_geometry_msgs

def transform_obstacle(tf_buffer: Buffer, pt_in_laser):
    # REP-105 트리(map->odom->base_link->laser_link)를 자동 순회해 변환
    tf = tf_buffer.lookup_transform('map', 'laser_link', rclpy.time.Time())
    return tf2_geometry_msgs.do_transform_point(pt_in_laser, tf)`,
    codeChallenge: {
      prompt: '바퀴 오도메트리 노드와 SLAM 노드가 모두 base_link를 자식으로 삼아 TF를 발행할 때 발생하는 오류와 REP-105 정답 구조는?',
      buggyLine: 'odom -> base_link  AND  map -> base_link // 두 개의 부모 충돌!',
      options: [
        'map -> odom -> base_link (단일 트리 체인: SLAM은 map->odom만, 오도메트리는 odom->base_link만 발행)',
        'base_link -> map -> odom 순서로 뒤집는다',
        '모두 static_transform_publisher로 발행한다',
      ],
      correctIndex: 0,
      explanation: 'TF2는 비순환 단일 부모 트리이므로 SLAM은 map→odom, 오도메트리는 odom→base_link를 담당해야 합니다.',
    },
    quizzes: [
      {
        id: 'P5D38-1',
        question: 'ROS 2 REP-105 표준 좌표 트리에서 map → odom 변환과 odom → base_link 변환을 각각 담당하는 주체는?',
        options: [
          'map→odom은 SLAM/AMCL(전역 보정), odom→base_link는 바퀴 오도메트리/EKF(연속 로컬 추적)',
          '둘 다 모터 드라이버가 발행한다',
          'map→odom은 바퀴 엔코더, odom→base_link는 카메라가 발행한다',
          '둘 다 변하지 않는 Static TF다',
        ],
        correctIndex: 0,
        explanation: '로컬 제어기는 끊김 없는 odom→base_link를, 전역 경로 계획은 누적 오차가 교정된 map→odom→base_link를 씁니다.',
      },
      {
        id: 'P5D38-2',
        question: '로봇 본체에 나사로 단단히 고정된 카메라(base_link → camera_link) 변환을 발행하는 가장 적합한 방식은?',
        options: [
          'URDF <joint type="fixed"> 또는 Static Transform Publisher (/tf_static)',
          '매 1ms마다 바퀴 엔코더로 계산한다',
          'GPS 신호로 계산한다',
          '등록하지 않아도 된다',
        ],
        correctIndex: 0,
        explanation: '상대 위치가 변하지 않는 고정 부품은 URDF fixed 조인트로 정의해 /tf_static으로 발행합니다.',
      },
      {
        id: 'P5D38-3',
        question: 'URDF에서 라이다 센서 장착 방향을 yaw = π (3.1416 rad) 대신 yaw = 0 으로 잘못 적으면 지도 작성 시 어떤 일이 생기나요?',
        options: [
          '로봇 앞쪽에 있는 장애물이 지도상 로봇 뒤쪽 180° 방향에 찍혀 전혀 엉뚱한 지도가 그려진다',
          '센서 색상이 바뀐다',
          '모터 전압이 높아진다',
          '통신 속도가 빨라진다',
        ],
        correctIndex: 0,
        explanation: '센서 프레임의 회전 오프셋이 실제 실물 장착 방향과 180° 반전되면 스캔 전체가 뒤집혀 매핑됩니다.',
      },
      {
        id: 'P5D38-4',
        question: 'TF2에서 lookupTransform 호출 시 "Extrapolation Error: Requested time is in the future" 오류가 자주 나는 원인은?',
        options: [
          '센서 메시지의 타임스탬프와 TF 브로드캐스트 시각 간 미세 지연 또는 두 PC/ESP32 시계 불일치(Clock Skew)',
          '바퀴가 너무 작아서',
          '3D 프린팅 공차 때문에',
          '파이썬 버전이 높아서',
        ],
        correctIndex: 0,
        explanation: '미래 시점의 TF를 요구할 때 발생하며, latest(Time(0)) 조회나 타임아웃 대기, NTP 시계 동기화로 해결합니다.',
      },
      {
        id: 'P5D38-5',
        question: '로봇의 모든 링크/조인트 TF 연결 계통도를 시각적 트리 다이어그램 PDF로 확인하는 ROS 2 명령어는?',
        options: [
          'ros2 run tf2_tools view_frames',
          'ros2 param list',
          'colcon build',
          'pip list',
        ],
        correctIndex: 0,
        explanation: 'view_frames를 실행하면 현재 브로드캐스트 중인 전체 TF 트리 구조, 발행 주기, 끊긴 노드 여부를 시각화합니다.',
      },
    ],
  },
  {
    id: 'day39_vision',
    order: 39,
    dayLabel: 'Day 39',
    phaseLabel: 'Phase 5 · 경로/ROS 2/SLAM',
    title: '로봇 비전: OpenCV HSV 마스킹 & ArUco 3D 거리 추정',
    shortTitle: 'D39 · HSV비전/ArUco',
    subtitle: '핀홀 카메라 모델 · RGB 조명 취약 vs HSV Hue 분리 · ArUco PnP 깊이 계산',
    badge: '컴퓨터 비전',
    milestoneTag: 'Day 39 OpenCV/ArUco 랩',
    failFirstHook:
      'RGB(R>200, G<50, B<50) 기준으로 빨간 공을 찾으면 형광등이 조금만 어두워지거나 그림자가 져도 값이 (120, 20, 20)으로 떨어져 목표 물체를 완전히 놓칩니다.',
    beginnerAnalogy:
      'RGB는 "밝기와 색깔이 뒤섞인 물감"이지만 HSV는 "색상(Hue) · 선명도(Saturation) · 밝기(Value)"를 세 개의 서랍으로 분리해 둔 덕분에 그림자가 져도 색상 서랍(H)만 보면 빨강을 족집게처럼 찾습니다.',
    overviewSummary:
      '실내 조명 밝기(표준 vs 저조도 그림자)와 색공간(RGB vs HSV)을 전환하며 빨간 물체 검출 성공 여부를 비교하고, ArUco 마커까지의 거리(cm)에 따라 카메라에 맺히는 픽셀 폭과 핀홀 깊이 추정 z = f·W/w_px 변화를 관찰하세요.',
    guidedMissions: [
      {
        id: 'd39-rgb-fail',
        title: '저조도 그림자 + RGB 모드에서 빨간 물체 검출 실패(Tracking Lost) 확인하기',
        hint: '저조도 환경을 켜고 RGB 색공간을 선택해 검출 실패 상태를 확인하세요.',
      },
      {
        id: 'd39-hsv-pass',
        title: '같은 저조도 그림자 환경에서 HSV 색공간으로 전환해 안정적 검출 성공하기',
        hint: '색공간을 HSV로 바꾸어 H(색상) 채널만으로 목표를 정확히 찾아내는지 보세요.',
      },
      {
        id: 'd39-aruco',
        title: 'ArUco 마커 거리 슬라이더로 핀홀 3D 깊이 역산(z = f·W / w_px) 확인하기',
        hint: 'ArUco 마커 거리를 40cm ~ 180cm 범위로 조절하며 픽셀 크기와 추정 거리를 보세요.',
      },
    ],
    highlights: [
      {
        title: 'RGB vs HSV: 그림자에 강인한 색상(Hue) 필터링',
        body: 'HSV에서는 H(0~179 in OpenCV)가 순수 색상 종류를, V(0~255)가 밝기를 담당하므로 V 범위를 넓게(40~255) 열어두면 어두운 그늘에 들어간 공도 정확히 추적합니다.',
        tone: 'emerald',
      },
      {
        title: '핀홀 카메라 닮은꼴 원리 & ArUco 3D 자세 추정 (PnP)',
        body: '실제 폭 W(예: 10cm)를 아는 ArUco 마커 4개의 모서리를 검출하면 카메라 초점거리(f_x, f_y)와 닮음비 z = (f · W) / w_px 및 PnP 알고리즘으로 3차원 좌표 (X, Y, Z)와 기울기까지 구합니다.',
        tone: 'cyan',
      },
      {
        title: '체커보드 카메라 캘리브레이션의 필요성',
        body: '렌즈 방사 왜곡(어안 렌즈 현상)과 정확한 초점거리 f_x, 주점 c_x를 체커보드로 미리 교정해야 ArUco 거리 오차가 1% 이내로 줄어듭니다.',
        tone: 'amber',
      },
    ],
    formulas: [
      {
        title: '핀홀 카메라 투영 & 단안 ArUco 거리 역산',
        latex: String.raw`u = f_x \frac{X}{Z} + c_x, \qquad v = f_y \frac{Y}{Z} + c_y \quad\Longrightarrow\quad Z = \frac{f_x \cdot W_{\text{real}}}{w_{\text{pixel}}}`,
        description: '실제 마커 한 변 길이 W_real과 이미지 상 가로 픽셀 수 w_pixel을 알면 거리 Z가 나옵니다.',
      },
      {
        title: 'OpenCV 빨강색 Hue 랩어라운드 (0° 경계)',
        latex: String.raw`H \in [0, 10] \;\cup\; [170, 179] \quad\text{(OpenCV uint8 H 범위 } 0..179\text{)}`,
        description: '빨강은 색상환 0°(180°) 경계에 걸려 두 구간 마스크를 bitwise_or()로 합쳐야 합니다.',
      },
    ],
    specs: [
      { label: 'OpenCV H 범위', value: '0 ~ 179 (2° 단위)', note: 'S, V는 0 ~ 255', tone: 'cyan' },
      { label: '잡음 제거(모폴로지)', value: 'Erode → Dilate (Open)', note: '작은 흰 점 노이즈 제거', tone: 'amber' },
      { label: 'ArUco 마커 크기', value: '정확한 실측 W (m)', note: '단위 m 틀리면 Z 배수 오차', tone: 'emerald' },
      { label: '조명/역광 취약', value: 'RGB 고정 임계값', note: '야외·그림자에서 검출 붕괴', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '카메라 화각(FOV)과 로봇 팔 작업 영역 일치',
        pin: '카메라 틸트 각도 URDF 반영 필수',
        detail: '카메라를 아래로 25° 숙여 달았다면, 카메라 기준 좌표 Z가 바닥 기준 X/Z로 회전 변환되도록 TF2에 정확한 pitch를 넣어야 합니다.',
      },
      {
        signal: 'ESP32-CAM vs 라즈베리파이/USB 웹캠',
        pin: 'OpenCV·ArUco 처리는 USB 웹캠 + PC/RPi, ESP32는 JPEG 스트리밍',
        detail: 'ESP32에서 고해상도 ArUco PnP를 돌리기보단 PC/RPi Python OpenCV에서 목표 좌표만 뽑아 ESP32로 넘기는 구조가 훨씬 빠르고 안정적입니다.',
      },
    ],
    codeTitle: 'day39_hsv_aruco_pnp.py',
    codeLanguage: 'python',
    codeSnippet: `# Day 39: HSV 빨강 마스크 & ArUco 핀홀 거리 추정
import cv2, numpy as np

hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
# 빨강은 H=0과 H=179 양쪽 끝에 걸려 있음!
mask1 = cv2.inRange(hsv, (0, 100, 40), (10, 255, 255))
mask2 = cv2.inRange(hsv, (170, 100, 40), (179, 255, 255))
red_mask = cv2.bitwise_or(mask1, mask2)

# ArUco 깊이 계산 (fx=620px, 실제 마커 폭 W=0.10m)
Z_meter = (620.0 * 0.10) / max(marker_width_px, 1.0)`,
    codeChallenge: {
      prompt: 'OpenCV HSV 색공간에서 순수 빨강(Red)을 검출할 때 0~10만 검사하면 절반의 빨간 물체를 놓치는 이유와 해결책은?',
      buggyLine: 'mask = cv2.inRange(hsv, (0, 100, 40), (10, 255, 255))',
      options: [
        '빨강은 색상환 0/180 경계에 걸려 있으므로 [0..10]과 [170..179] 두 구간을 bitwise_or()로 합쳐야 한다',
        'BGR 대신 HSV에서 V(명도) 채널을 0으로 두어야 한다',
        'Hue 대신 Blue 채널을 써야 한다',
      ],
      correctIndex: 0,
      explanation: 'HSV 색상환은 0과 180(OpenCV 179)이 맞닿아 있어 진한 빨강 일부가 170~179 구간에 분포합니다.',
    },
    quizzes: [
      {
        id: 'P5D39-1',
        question: '실내 조명이 어두워지거나 물체에 그림자가 드리울 때 RGB 대신 HSV 색공간이 훨씬 강인한 이유는?',
        options: [
          '밝기 정보(V)와 순수 색상 종류(H)가 채널별로 분리되어 있어 어두워져도 H(색상) 값은 거의 일정하므로',
          'HSV는 2차원 흑백 이미지라서',
          '카메라 화소 수가 2배 늘어나서',
          '조명을 자동으로 켜주어서',
        ],
        correctIndex: 0,
        explanation: 'RGB는 조도가 반으로 줄면 R, G, B 세 값이 전부 반으로 줄지만, HSV에서는 H 값은 유지되고 V만 줄어듭니다.',
      },
      {
        id: 'P5D39-2',
        question: '초점거리 fx = 600 px 인 카메라가 실제 폭 W = 0.10 m 인 ArUco 마커를 이미지에서 가로 120 px 크기로 포착했다면 마커까지의 거리 Z는?',
        options: ['0.25 m', '0.50 m', '1.00 m', '2.00 m'],
        correctIndex: 1,
        explanation: 'Z = (fx × W) / w_px = (600 × 0.10) / 120 = 60 / 120 = 0.50 m (50cm)입니다.',
      },
      {
        id: 'P5D39-3',
        question: 'HSV 이진 마스크(mask)에 자잘한 흰 점 노이즈(배경 먼지)가 섞였을 때 점들을 지우는 모폴로지 연산 순서는?',
        options: [
          '열림(Opening = 침식 Erode 후 팽창 Dilate)',
          '평균값 증가',
          '색반전',
          '고역통과 필터',
        ],
        correctIndex: 0,
        explanation: '작은 점들은 침식(Erode) 과정에서 사라지고 원래 크기의 물체만 팽창(Dilate)으로 원복됩니다.',
      },
      {
        id: 'P5D39-4',
        question: '광각 렌즈 카메라로 캘리브레이션 없이 ArUco 마커 위치를 구할 때 가장 흔히 발생하는 오차는?',
        options: [
          '방사 왜곡(직선이 휘어 보임)과 잘못된 초점거리 f 추정 때문에 화면 모서리 물체의 Z/X 좌표가 크게 틀어진다',
          '프레임률이 0이 된다',
          '색상이 반전된다',
          'USB 포트가 끊긴다',
        ],
        correctIndex: 0,
        explanation: '체커보드 캘리브레이션으로 카메라 내부 행렬(K)과 왜곡 계수(distCoeffs)를 먼저 구해야 정확한 3D 측정이 됩니다.',
      },
      {
        id: 'P5D39-5',
        question: 'solvePnP(또는 estimatePoseSingleMarkers)로 ArUco 마커의 3D 자세를 구했을 때 반환되는 rvec와 tvec의 의미는?',
        options: [
          '카메라 좌표계 기준 마커까지의 회전 벡터(rvec)와 3D 이동 위치(tvec: x, y, z)',
          '바퀴 PWM 값',
          '배터리 전압',
          '마커의 JPG 용량',
        ],
        correctIndex: 0,
        explanation: 'PnP(Perspective-n-Point) 해법은 마커 4코너의 2D 픽셀과 실제 3D 정사각 크기를 매칭해 상대 자세(rvec, tvec)를 복원합니다.',
      },
    ],
  },
  {
    id: 'day40_mcl_particle',
    order: 40,
    dayLabel: 'Day 40',
    phaseLabel: 'Phase 5 · 경로/ROS 2/SLAM',
    title: '몬테카를로 위치 추정 (MCL / 파티클 필터)',
    shortTitle: 'D40 · 파티클필터 MCL',
    subtitle: '가우시안 vs 다봉 분포 · 모션 예측 → LiDAR 우도 가중치 → 리샘플링 & 납치 복구',
    badge: '확률 위치 추정',
    milestoneTag: 'Day 40 파티클 필터 랩',
    failFirstHook:
      '주어진 건물 지도는 있는데 로봇의 시작 위치가 101호인지 102호인지 모를 때(Global Localization), 단일 가설만 다루는 EKF는 틀린 가설에 갇혀 복구하지 못합니다.',
    beginnerAnalogy:
      '눈을 감고 건물 어딘가에 뚝 떨어졌을 때, 지도 전체에 "내 위치 후보 분신(파티클) 1,000명"을 흩뿌린 뒤 내 앞 1.2m 벽 측정과 똑같은 벽 앞을 보고 있는 분신만 살아남게 복사하는 다수결 생존 게임입니다.',
    overviewSummary:
      '지도 위 4단계 MCL 시뮬레이션(0: 전역 무작위 살포 → 1: LiDAR 관측 우도 평가 → 2: 리샘플링 수렴 → 3: 납치 로봇 발생 및 무작위 재살포 복구)을 차례로 실행해 파티클 분포가 어떻게 수렴하고 복구되는지 보세요.',
    guidedMissions: [
      {
        id: 'd40-spread',
        title: 'Stage 0 (전역 살포)에서 복도 모양 대칭성 때문에 후보 군집이 여러 곳에 뜨는 상태 보기',
        hint: '단계 버튼에서 "0. 전역 살포"와 "1. 관측 가중치"를 클릭해 여러 후보가 공존하는 걸 확인하세요.',
      },
      {
        id: 'd40-converge',
        title: 'Stage 2 (리샘플링 수렴)로 로봇 실제 위치 주변에 파티클이 한 점으로 모이는 모습 확인하기',
        hint: '"2. 리샘플링 수렴" 버튼을 눌러 높은 가중치 파티클들이 살아남아 집중되는 것을 보세요.',
      },
      {
        id: 'd40-kidnap',
        title: 'Stage 3 (납치 로봇 복구)를 눌러 갑작스런 위치 이동 후 전역 파티클 재투입 확인하기',
        hint: '"3. 납치 복구"를 클릭해 로봇이 딴 곳으로 옮겨졌을 때 AMCL이 재탐색하는 원리를 확인하세요.',
      },
    ],
    highlights: [
      {
        title: 'EKF(단일 가우시안) vs MCL(다봉 확률 분포 표현)',
        body: '비슷하게 생긴 방 2개가 있으면 EKF는 평균인 벽 가운데를 찍어 버리지만, 파티클 필터는 방 A와 방 B 양쪽에 동시에 50%씩 가설을 유지하다가 특징 문턱을 지날 때 정답 방으로 100% 쏠립니다.',
        tone: 'cyan',
      },
      {
        title: 'MCL 3단계 사이클: Motion → Weight → Resampling',
        body: '1) 바퀴 오도메트리(+노이즈)만큼 모든 파티클 이동, 2) 실제 LiDAR 스캔과 지도상 예상 거리 일치도로 각 파티클 가중치 w_i 계산, 3) w_i에 비례해 복제(Roulette/Low-Variance Resampling).',
        tone: 'emerald',
      },
      {
        title: '파티클 고갈 방지 & 납치 로봇(Kidnapped Robot) 복구',
        body: '모든 파티클이 한 곳에 너무 몰리면 로봇을 들어 옮겼을 때 영영 못 찾습니다. 평균 센서 우도가 급감할 때 전체 파티클의 일정 비율을 지도에 다시 무작위 살포(Augmented MCL)해야 복구됩니다.',
        tone: 'rose',
      },
    ],
    formulas: [
      {
        title: '베이지안 센서 관측 가중치(우도) 업데이트',
        latex: String.raw`w_t^{(i)} \propto p\!\left(z_t \mid x_t^{(i)},\, m\right) = \prod_{k=1}^{K} \mathcal{N}\!\left(z_{t,k};\; z_{t,k}^*,\; \sigma_{\text{hit}}^2\right)`,
        description: '실제 빔 거리 z와 파티클 위치에서 레이캐스팅한 지도 벽 거리 z* 가 가까울수록 가중치 w가 큽니다.',
      },
      {
        title: '유효 파티클 수 (고갈 모니터링 지표)',
        latex: String.raw`N_{\text{eff}} = \frac{1}{\sum_{i=1}^{M} \left(\tilde{w}^{(i)}\right)^2}`,
        description: 'N_eff가 전체 수 M의 절반 밑으로 떨어질 때만 리샘플링을 수행해 파티클 다양성 손실을 막습니다.',
      },
    ],
    specs: [
      { label: '초기 위치 불명', value: '전역 위치추정 지원', note: 'EKF 불가 → MCL/AMCL 강점', tone: 'emerald' },
      { label: '리샘플링 기법', value: 'Low-Variance Resample', note: 'O(M) 1개 바퀴로 균일 추출', tone: 'cyan' },
      { label: 'ROS 2 표준 패키지', value: 'nav2_amcl', note: '적응형 파티클 수 조절', tone: 'amber' },
      { label: '납치 로봇 위기', value: '우도 급감 시 재살포', note: 'Augmented AMCL 전략', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: 'AMCL 초기 파티클 수와 계산 부하 균형',
        pin: 'min_particles: 300 ~ 500, max_particles: 2000 ~ 3000',
        detail: '전역 살포 직후엔 파티클을 2,000개 이상 늘렸다가 수렴 후(KLD-Sampling) 300개로 줄여야 라즈베리파이 CPU가 안 뻗습니다.',
      },
      {
        signal: '제자리에서 살짝 이동해야 수렴됨',
        pin: 'Update는 보통 0.2m 이동 또는 0.2rad 회전마다 트리거',
        detail: '대칭 구조 방에서는 로봇이 조금 전진하거나 회전해 새로운 벽 코너를 봐야 가짜 후보 군집이 탈락합니다.',
      },
    ],
    codeTitle: 'day40_mcl_resample.py',
    codeLanguage: 'python',
    codeSnippet: `# Day 40: Low-Variance Systematic Resampling (표준 MCL 추출기)
import random

def low_variance_resample(particles, weights):
    M = len(particles)
    new_p = []
    r = random.uniform(0.0, 1.0 / M)
    c = weights[0]
    i = 0
    for m in range(M):
        U = r + m / M
        while U > c and i < M - 1:
            i += 1
            c += weights[i]
        new_p.append(particles[i].copy())
    return new_p`,
    codeChallenge: {
      prompt: 'AMCL이 이미 한 곳에 100% 수렴한 상태에서 누군가 로봇을 들어 다른 방에 내려놓는(Kidnapped Robot) 문제를 복구하기 위한 핵심 아이디어는?',
      buggyLine: 'particles = [best_particle.copy() for _ in range(M)] # 다양성 0, 영원히 못 빠져나옴!',
      options: [
        '평균 측정 우도가 급락하면 지도에 일정 비율의 무작위 파티클을 추가 투입(Augmented MCL)하여 새 방 후보를 다시 탐색한다',
        '파티클 수를 1개로 줄인다',
        'LiDAR 센서를 끈다',
      ],
      correctIndex: 0,
      explanation: '기존 파티클 주변이 전혀 지도와 맞지 않아 평균 우도가 떨어지면 랜덤 파티클을 재주입해야 다른 방에서 되살아납니다.',
    },
    quizzes: [
      {
        id: 'P5D40-1',
        question: '동일하게 생긴 2개의 문이 복도 양쪽에 있을 때, 단일 가우시안 EKF 대비 파티클 필터(MCL)가 갖는 강점은?',
        options: [
          '두 문 앞 후보 위치에 동시에 가설 분포(다봉 분포)를 유지하다가 추가 스캔으로 한쪽이 틀렸음이 밝혀지면 즉시 정답으로 수렴한다',
          '센서가 전혀 필요 없다',
          '연산량이 0이다',
          '항상 직선만 달린다',
        ],
        correctIndex: 0,
        explanation: '파티클 필터는 확률 분포 형태에 가우시안 제한이 없어 여러 유력 후보(Multi-modal)를 동시에 추적할 수 있습니다.',
      },
      {
        id: 'P5D40-2',
        question: '파티클 필터의 3대 반복 단계를 올바른 실행 순서로 나열한 것은?',
        options: [
          '리샘플링 → 모션 예측 → 가중치 계산',
          '모션 예측(오도메트리 이동) → 관측 가중치 계산(LiDAR 우도) → 중요도 리샘플링',
          '가중치 계산 → 지도 삭제 → 이동',
          '캘리브레이션 → CRC 검사 → 직렬 출력',
        ],
        correctIndex: 1,
        explanation: '로봇이 움직인 만큼 파티클을 이동(예측)시키고, 센서 측정 일치도로 점수를 매긴 뒤(가중치), 점수 높은 놈을 복제(리샘플링)합니다.',
      },
      {
        id: 'P5D40-3',
        question: 'AMCL 파라미터에서 로봇이 실제로 움직이지 않고 제자리에 서 있을 때는 리샘플링을 매 루프 계속 수행하지 않는 이유는?',
        options: [
          '정지 상태에서 똑같은 관측으로 계속 리샘플링하면 파티클이 단 1개 위치에만 과도하게 복제되어 다양성이 고갈(Deprivation)되므로',
          '배터리를 아끼려고',
          '바퀴가 빠질까 봐',
          'UART 속도가 느려서',
        ],
        correctIndex: 0,
        explanation: '새로운 정보가 없는 정지 상태에서 리샘플링을 남발하면 운 좋게 점수 조금 높은 1개 파티클이 전체를 점령해 분산이 0으로 죽습니다.',
      },
      {
        id: 'P5D40-4',
        question: 'AMCL이 로봇의 초기 위치를 모르는 상태에서 수렴하기 위해 파티클 2,000개를 뿌렸다가, 위치를 확신한 뒤 자동으로 개수를 300개로 줄이는 기법은?',
        options: [
          'KLD-Sampling (쿨백-라이블러 발산 적응 샘플링)',
          'PWM 듀티 조절',
          'Anti-Windup',
          'HSV 마스킹',
        ],
        correctIndex: 0,
        explanation: 'Adaptive MCL(AMCL)의 핵심인 KLD-Sampling은 파티클이 퍼진 공간 크기에 비례해 필요한 최소 파티클 수를 동적으로 조절합니다.',
      },
      {
        id: 'P5D40-5',
        question: '파티클 필터에서 각 파티클의 LiDAR 기대 거리를 계산할 때 "실제 LiDAR 측정은 통과했는데 지도상 거기에 벽이 있다"고 하면 그 파티클 가중치는?',
        options: [
          '매우 낮게(거의 0에 가깝게) 부여되어 다음 리샘플링에서 탈락한다',
          '최고 점수를 받는다',
          '변하지 않는다',
          '무한대가 된다',
        ],
        correctIndex: 0,
        explanation: '지도 벽을 뚫고 지날 수는 없으므로 물리적으로 모순되는 위치 가설은 낮은 우도(Likelihood)로 걸러집니다.',
      },
    ],
  },
  {
    id: 'day41_slam_grid',
    order: 41,
    dayLabel: 'Day 41',
    phaseLabel: 'Phase 5 · 경로/ROS 2/SLAM',
    title: 'SLAM: 점유 격자 지도 & 루프 클로저(Loop Closure)',
    shortTitle: 'D41 · SLAM/루프클로저',
    subtitle: 'Log-Odds 확률 갱신 · ICP 스캔 매칭 · 누적 오차 한 번에 펴는 루프 클로저',
    badge: 'SLAM 지도 작성',
    milestoneTag: 'Day 41 SLAM/루프클로저 랩',
    failFirstHook:
      '복도를 크게 한 바퀴 돌고 출발점으로 되돌아왔는데 바퀴 오도메트리 오차가 쌓여, 방 벽이 한 개로 이어지지 않고 두 겹(Double Wall)으로 어긋난 괴물 지도가 완성됩니다.',
    beginnerAnalogy:
      '눈을 감고 발걸음만 세며 방 지도를 그리다 출발점의 독특한 기둥(스캔 특징)을 다시 만났을 때, "잠깐! 여긴 10분 전 출발점이잖아!" 하고 도화지의 비틀린 선을 전체적으로 찰칵 당겨 맞추는 게 루프 클로저입니다.',
    overviewSummary:
      '오도메트리 각도 드리프트(°)를 조절하며 복도를 한 바퀴 돌 때 지도가 두 겹으로 갈라지는 Double-Wall 현상을 확인하고, 루프 클로저(Pose-Graph Optimization)를 활성화해 지도 전체가 한 겹으로 정렬되는 과정을 실험하세요.',
    guidedMissions: [
      {
        id: 'd41-drift',
        title: '루프 클로저 OFF 상태에서 드리프트를 높여 이중 벽(Double Wall) 지도 붕괴 확인하기',
        hint: '루프 클로저 스위치를 OFF로 두고 드리프트 각도를 10° 이상 올려 두 겹 벽을 확인하세요.',
      },
      {
        id: 'd41-loop',
        title: '루프 클로저 ON으로 Pose-Graph 최적화를 실행해 지도를 깔끔히 하나로 펴기',
        hint: '루프 클로저 스위치를 ON으로 켜서 시작점과 끝점 벽이 완벽히 정합되는지 확인하세요.',
      },
      {
        id: 'd41-code',
        title: '점유 격자 Log-Odds 확률 누적 식 코드 챌린지 풀기',
        hint: '코드 탭의 Log-Odds 업데이트 버그 수정 문제를 풀어보세요.',
      },
    ],
    highlights: [
      {
        title: '점유 격자 지도(Occupancy Grid) & 로그 오즈(Log-Odds)',
        body: '확률 0~1을 직접 곱하면 부동소수점 언더플로우가 나므로, l(x) = log(p/(1-p)) 로그 오즈로 바꿔 단순 덧셈(레이저가 맞은 끝 셀 += l_occ, 지나간 빈 셀 += l_free)만으로 지도를 누적합니다.',
        tone: 'cyan',
      },
      {
        title: '스캔 매칭(Scan Matching / ICP)',
        body: '오도메트리만 믿지 않고 방금 찍은 LiDAR 점군과 직전 점군(또는 부분 지도)이 가장 잘 겹치는 회전·이동을 맞춰 실시간 오도메트리 오차를 줄입니다.',
        tone: 'amber',
      },
      {
        title: '루프 클로저 (Loop Closure) & Pose-Graph SLAM',
        body: '오래 돌아 출발했던 곳에 재방문했을 때 겹침 제약(Loop Constraint)을 그래프에 추가하고 비선형 최적화를 풀면, 지나왔던 과거 경로의 누적 오차가 소급 보정되며 지도가 하나로 정렬됩니다.',
        tone: 'emerald',
      },
    ],
    formulas: [
      {
        title: '베이즈 점유 격자 로그 오즈(Log-Odds) 덧셈 갱신',
        latex: String.raw`l_t(m_i) = l_{t-1}(m_i) + \underbrace{\log\frac{p(m_i \mid z_t)}{1 - p(m_i \mid z_t)}}_{\text{센서 역모델 } l_{\text{occ}} / l_{\text{free}}}, \qquad p(m_i) = 1 - \frac{1}{1 + e^{l_t(m_i)}}`,
        description: '덧셈 연산만으로 베이즈 확률 곱을 대신하며 l_min ~ l_max로 클램핑해 동적 물체 잔상을 지울 수 있습니다.',
      },
      {
        title: 'Pose-Graph 최적화 목적 함수',
        latex: String.raw`\min_{\mathbf{x}} \sum_{(i,j)} \mathbf{e}(\mathbf{x}_i, \mathbf{x}_j, \hat{\mathbf{z}}_{ij})^T \Omega_{ij}\, \mathbf{e}(\mathbf{x}_i, \mathbf{x}_j, \hat{\mathbf{z}}_{ij})`,
        description: '인접 오도메트리 간선과 루프 클로저 간선 오차를 모두 최소제곱으로 동시 균형 맞춥니다.',
      },
    ],
    specs: [
      { label: 'Log-Odds 점유 셀', value: 'p > 0.65 (검정 벽)', note: '장애물로 Nav2 등록', tone: 'cyan' },
      { label: 'Log-Odds 자유 셀', value: 'p < 0.35 (흰 바닥)', note: '주행 가능 공간', tone: 'emerald' },
      { label: '루프 클로저 효과', value: '이중 벽 제거', note: 'ROS 2 slam_toolbox 표준', tone: 'amber' },
      { label: '오탐 루프 위험', value: 'False Loop Closure', note: '복도 닮은 곳에 잘못 붙이면 지도 파손', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '스캔 매핑 중 급회전 자제',
        pin: '각속도 ω는 천천히(≤ 0.8 rad/s) 유지하며 지도 작성',
        detail: '2D 라이다는 한 바퀴 도는 데 100ms 이상 걸리므로 제자리에서 너무 빨리 돌면 스캔 1회 중 로봇이 돌아버려 벽이 휘어집니다(Motion Distortion).',
      },
      {
        signal: 'slam_toolbox 파라미터 튜닝',
        pin: 'map_update_interval · minimum_travel_distance',
        detail: '충분히 좋은 휠 오도메트리 + IMU EKF를 앞단에 넣어주어야 스캔 매칭이 헛돌지 않습니다.',
      },
    ],
    codeTitle: 'day41_logodds_grid.py',
    codeLanguage: 'python',
    codeSnippet: `# Day 41: Log-Odds 점유 격자 업데이트 (Bresenham 광선 추적 후 갱신)
import math

L_OCC  =  0.85  # 맞은 끝점 벽 확신 가산치
L_FREE = -0.40  # 지나간 빈 공간 차감치

def update_cell(log_odds_grid, r, c, is_hit: bool):
    val = log_odds_grid[r][c] + (L_OCC if is_hit else L_FREE)
    log_odds_grid[r][c] = max(-5.0, min(5.0, val)) # 클램핑으로 새 동적 변화 수용`,
    codeChallenge: {
      prompt: '지나간 의자가 치워졌을 때 지도에 영원히 유령 벽이 남지 않고 빠르게 빈 공간으로 갱신되도록 하려면 Log-Odds 값에 어떤 장치가 필요한가요?',
      buggyLine: 'log_odds_grid[r][c] += L_OCC; // 상한 제한 없이 +5000까지 무한 누적됨!',
      options: [
        'Log-Odds 값을 [-5.0, +5.0] 등 최소/최대 한계로 클램핑(Clamping)해 새 관측이 기존 확신을 몇 회 만에 뒤집을 수 있게 둔다',
        '매 스텝마다 지도 전체를 0으로 지운다',
        'L_FREE 값을 양수(+)로 바꾼다',
      ],
      correctIndex: 0,
      explanation: '클램핑이 없으면 10분간 벽이었던 곳에 l=+500이 쌓여, 물건을 치워도 1,000번 이상 쏴야 빈 공간으로 바뀌는 문제가 생깁니다.',
    },
    quizzes: [
      {
        id: 'P5D41-1',
        question: '점유 격자 지도(Occupancy Grid)를 업데이트할 때 확률(0~1)을 직접 곱하지 않고 Log-Odds 덧셈으로 변환해 계산하는 이유는?',
        options: [
          '곱셈보다 덧셈이 훨씬 빠르고 0.0001^100 같은 부동소수점 언더플로우(0으로 뭉개짐)를 방지하므로',
          '지도를 컬러로 출력하려고',
          'LiDAR 선 개수를 줄이려고',
          '음수 각도를 없애려고',
        ],
        correctIndex: 0,
        explanation: '확률 곱은 로그 공간에서 단순 덧셈이 되며 수치 안정성(언더플로우 방지)이 극대화됩니다.',
      },
      {
        id: 'P5D41-2',
        question: 'SLAM 주행 중 한 바퀴 돌아 제자리로 왔을 때 지도에 벽이 2줄로 어긋나 그려지는(Double Wall) 문제를 해결하는 핵심 메커니즘은?',
        options: [
          '루프 클로저(Loop Closure) 검출 및 Pose-Graph 전역 최적화',
          '모터 전압 증가',
          'PWM 주파수 변경',
          '엔코더 1채널 제거',
        ],
        correctIndex: 0,
        explanation: '재방문 장소 일치를 감지해 루프 제약 간선을 묶고 전체 경로 포즈를 최적화하면 누적 오차가 한 번에 펴집니다.',
      },
      {
        id: 'P5D41-3',
        question: '반대로 완전히 다른 층의 복도가 현재 위치와 비슷하게 생겨 잘못된 루프 클로저(False Positive)가 발생하면 어떤 치명적 문제가 생기나요?',
        options: [
          '전혀 다른 두 공간이 억지로 포개져 지도 전체가 기괴하게 찌그러지고 망가진다',
          '배터리 수명이 2배 늘어난다',
          '아무 일도 없다',
          '속도가 빨라진다',
        ],
        correctIndex: 0,
        explanation: '잘못된 루프 클로저 간선 하나가 그래프 최적화에서 거대한 힘으로 두 먼 노드를 잡아당겨 지도 전체를 망가뜨립니다.',
      },
      {
        id: 'P5D41-4',
        question: '2D LiDAR 빔이 로봇 중심(0,0)에서 날아가 (2.5m, 0.0m) 지점의 벽에 부딪혔을 때, 광선 경로 위 [0.1m .. 2.4m] 사이의 격자 셀들은 어떻게 갱신해야 할까요?',
        options: [
          '벽이 가로막고 있던 끝점만 점유(L_occ)를 더하고, 레이저가 무사히 통과한 중간 경로 셀들은 빈 공간(L_free)으로 차감한다',
          '중간 경로 셀도 모두 벽으로 표시한다',
          '중간 경로 셀은 건드리지 않는다',
          '로봇 자신 위치만 벽으로 표시한다',
        ],
        correctIndex: 0,
        explanation: '빛(레이저)이 지나갔다는 것은 중간에 장애물이 없다는 직접적 증거이므로 Bresenham 선분 위 셀들을 Free로 지워주어야 통로 지도가 열립니다.',
      },
      {
        id: 'P5D41-5',
        question: '스캔 매칭(ICP)과 휠 오도메트리를 함께 사용하는 SLAM에서, 바퀴 오도메트리가 너무 부정확할 때 나타나는 현상은?',
        options: [
          'ICP 초기 추정값(Initial Guess)이 크게 빗나가 지역 최솟값(Local Minimum)에 빠져 매칭이 헛돈다',
          '지도가 저절로 완성된다',
          'IC 주소가 바뀐다',
          '통신이 빨라진다',
        ],
        correctIndex: 0,
        explanation: 'ICP는 두 스캔이 어느 정도 비슷하게 겹친 상태에서 출발해야 수렴하므로, 회전 시 휠+IMU 오도메트리가 좋은 초기값을 줘야 합니다.',
      },
    ],
  },
  {
    id: 'day42_maze_project',
    order: 42,
    dayLabel: 'Day 42',
    phaseLabel: 'Phase 5 · 경로/ROS 2/SLAM',
    title: '[Phase 5 미니 프로젝트] 미로 탐색 SLAM + A* + DWA 자율주행',
    shortTitle: 'D42 · 미로 자율주행',
    subtitle: '미지 격자 지도 탐험 · C-Space A* 전역 계획 · 돌발 장애물 DWA 회피',
    badge: 'Phase 5 프로젝트',
    milestoneTag: 'Day 42 미로 자율주행 랩',
    failFirstHook:
      '정적 지도 위에서 짠 A* 전역 경로만 눈 감고 따라가면, 복도에 새로 놓인 박스(동적 장애물)를 피하지 못하고 그대로 충돌하며 멈춰버립니다.',
    beginnerAnalogy:
      '지금까지 만든 지능형 내비게이션(SLAM 격자 지도 + C-Space A* 전역 경로)에 즉석 회피 반사신경(DWA)까지 결합해, 미로 속 갑작스러운 장애물까지 요리조리 피해 탈출하는 자율주행 로버입니다.',
    overviewSummary:
      '미로 격자 환경에서 새 동적 장애물을 경로 위에 놓고, 1) 전역 A* 단독 추종 시 충돌 실패 vs 2) C-Space + DWA + 재계획 통합 자율주행 활성화 시 안전 우회 완주를 직접 비교 검증하세요.',
    guidedMissions: [
      {
        id: 'd42-astar-hit',
        title: '동적 장애물 출현 + "A* 단독" 모드에서 경로상 박스 충돌 사고 확인하기',
        hint: '동적 장애물 ON + "A* 단독 추종"을 선택해 미예측 장애물 충돌 경고를 확인하세요.',
      },
      {
        id: 'd42-dwa-avoid',
        title: '"통합 자율주행 (SLAM+C-Space+DWA)"로 전환해 장애물을 안전 우회 완주하기',
        hint: '"통합 자율주행 (Full Nav)" 버튼을 눌러 새로운 우회 궤적과 Goal 도달을 확인하세요.',
      },
      {
        id: 'd42-code',
        title: '자율주행 비용 지도(Costmap) 우선순위/회피 코드 챌린지 풀기',
        hint: '코드 탭의 동적 재계획 트리거 버그 챌린지를 풀어보세요.',
      },
    ],
    highlights: [
      {
        title: '계층형 자율주행 스택 (Nav2 3단 계층)',
        body: 'SLAM/AMCL이 지도를 바탕으로 현재 포즈를 추정하고(Where am I?), A*가 목적지까지의 대로를 긋고(Where to go?), 20Hz DWA가 센서에 비친 새 장애물을 실시간 비켜 갑니다(How to move now?).',
        tone: 'cyan',
      },
      {
        title: '프론티어 탐색 (Frontier Exploration) 직관',
        body: '미지의 방을 탐험할 때는 "알려진 빈 공간(White)"과 "미탐색 영역(Gray)"이 맞닿은 경계선(Frontier)을 A* 목표점으로 삼아 나아가면 사람이 조종하지 않아도 방 전체 지도를 스스로 완성합니다.',
        tone: 'emerald',
      },
      {
        title: 'Recovery Behavior (막다른 길 탈출 전략)',
        body: '앞을 가로막는 장애물 때문에 DWA 속도가 모두 차단되어 정체되면, 무작정 멈춰 있지 않고 제자리 회전(Spin)이나 짧은 후진(Back-up)으로 센서를 다시 확보해 재계획합니다.',
        tone: 'amber',
      },
    ],
    formulas: [
      {
        title: '자율주행 통합 비용 함수 (Global + Local Safety)',
        latex: String.raw`\text{TotalCost} = \underbrace{\sum g(n) + h(n)}_{\text{A* 최단 거리}} + \underbrace{w_{\text{obs}} \cdot \exp(-d_{\text{obstacle}})}_{\text{C-Space 벽 회피 마진}}`,
        description: '벽에 가까울수록 셀 통과 비용(Costmap Inflation Cost)을 지수적으로 높여 길 한가운데로 달립니다.',
      },
      {
        title: 'Recovery Trigger 조건',
        latex: String.raw`\|\mathbf{x}(t) - \mathbf{x}(t - T_{\text{stuck}})\| < 0.05\,\text{m} \;\Longrightarrow\; \text{Re-plan / Backup Recovery}`,
        description: '일정 시간 T_stuck 동안 5cm도 전진 못 하면 막힌 것으로 판단해 복구 모드를 실행합니다.',
      },
    ],
    specs: [
      { label: '전역 계획 (Global)', value: 'A* / Dijkstra (1~2Hz)', note: 'Static + Inflation 지도', tone: 'cyan' },
      { label: '지역 제어 (Local)', value: 'DWA / MPPI (20Hz)', note: '실시간 스캔으로 동적 회피', tone: 'emerald' },
      { label: '미탐색 탐사', value: 'Frontier Exploration', note: 'White-Gray 경계선 추적', tone: 'amber' },
      { label: '정체 복구', value: 'Costmap Clear + Spin', note: '유령 장애물 초기화 후 회전', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: 'Global/Local Costmap 주기적 Clear 기준',
        pin: '사람이 스쳐 지나간 잔상은 Local Costmap에서 바로 지워져야 함',
        detail: '지나간 사람이 Costmap에 벽으로 계속 남아 있으면 통로가 막힌 줄 알고 영원히 못 갑니다(Raytrace Clearing 활성화 필수).',
      },
      {
        signal: '실물 미로 테스트 안전 속도',
        pin: '실내 미로 주행 시 v_max = 0.25 ~ 0.45 m/s 권장',
        detail: '컴퓨터 시뮬레이션과 달리 실물 바닥에서는 제동 거리와 센서 지연 때문에 0.4 m/s 이내부터 안정화해야 합니다.',
      },
    ],
    codeTitle: 'day42_autonomous_nav_loop.py',
    codeLanguage: 'python',
    codeSnippet: `# Day 42: 전역 A* 추종 중 전방 동적 장애물 감지 시 DWA 우회 / 재계획
def nav_tick(pose, global_path, lidar_scan, cspace_grid):
    front_min = min(lidar_scan.front_sector)
    if front_min < 0.35:
        # 정적 A* 경로를 맹목적으로 따르지 않고 즉시 DWA 회피 + 재계획!
        update_local_obstacle(cspace_grid, pose, front_min)
        global_path = recompute_astar(cspace_grid, pose, goal)
    return dwa_select_cmd(pose, global_path, lidar_scan)`,
    codeChallenge: {
      prompt: '지나가는 사람이 잠깐 로버 앞을 지나간 뒤 비켰는데도, Costmap에 사람이 벽으로 남아서 로버가 못 움직일 때 확인해야 할 필수 옵션은?',
      buggyLine: 'marking: true, clearing: false // 장애물을 찍기만 하고 통과된 레이저로 지우지 않음!',
      options: [
        'clearing: true (Raytracing을 켜서 이후 라이다 빔이 무사히 통과하면 이전 장애물 셀을 지워줌)',
        'marking: false (모든 장애물을 무시)',
        'A* 목표를 뒤로 바꿈',
      ],
      correctIndex: 0,
      explanation: 'Raytrace Clearing이 켜져 있어야 이동 물체가 사라진 뒤 뒤쪽 벽까지 닿은 레이저가 빈 공간을 깨끗이 지워줍니다.',
    },
    quizzes: [
      {
        id: 'P5D42-1',
        question: '자율주행 로버가 미지의 미로를 사람의 조종 없이 스스로 돌아다니며 지도를 채우는 "프론티어 탐색(Frontier Exploration)"에서 목표점(Goal)을 고르는 기준은?',
        options: [
          '이미 탐색된 빈 공간(Free)과 아직 한 번도 보지 못한 미탐색 영역(Unknown)이 맞닿은 경계선(Frontier)',
          '가장 가까운 벽 한가운데',
          '배터리 전압이 0V인 곳',
          '무조건 출발점만 제자리 회전',
        ],
        correctIndex: 0,
        explanation: '열린 복도와 미지 공간의 경계(Frontier)로 가면 새 센서 시야가 열려 지도가 확장됩니다.',
      },
      {
        id: 'P5D42-2',
        question: '전역 경로(A*)가 지시한 길 위에 새로운 상자가 놓였을 때, 가장 알맞은 자율주행 시스템의 반응 순서는?',
        options: [
          '라이다로 상자를 Local Costmap에 반영 → DWA가 즉시 충돌 없는 우회 (v,ω) 선택 → 필요 시 A* 재계획(Re-planning)',
          'A* 경로가 뚫릴 때까지 10시간 기다린다',
          '상자를 밀어버린다',
          'SLAM을 종료한다',
        ],
        correctIndex: 0,
        explanation: '즉각 회피(DWA)와 전역 경로 재계산(Re-planning)이 맞물려야 동적 환경에서 멈추지 않습니다.',
      },
      {
        id: 'P5D42-3',
        question: 'Costmap에서 벽 바로 옆 셀(Inflation Radius 내)에 0이 아닌 높은 비용(Cost)을 점진적으로 깔아두면 A* 경로가 어떻게 변하나요?',
        options: [
          '최단 거리보다 살짝 돌아가더라도 벽에 바짝 붙지 않고 복도 한가운데 중앙선으로 안전하게 주행한다',
          '벽을 뚫고 지나간다',
          '속도가 0이 된다',
          '센서가 꺼진다',
        ],
        correctIndex: 0,
        explanation: '벽 주변에 비용 경사(Cost Gradient)를 두면 중심선 비용이 가장 낮아져 사람처럼 복도 가운데로 다닙니다.',
      },
      {
        id: 'P5D42-4',
        question: '로버가 좁은 막다른 구석에서 모든 후보 DWA 궤적이 장애물에 막혀 더 이상 앞으로 못 나갈 때 Nav2가 취하는 복구(Recovery) 행동은?',
        options: [
          '로컬 코스트맵 초기화(Clear) · 제자리 회전(Spin) · 짧은 후진(Backup)을 시도해 탈출 공간을 만든다',
          'MCU 플래시 메모리를 포맷한다',
          'PID 게인을 0으로 만든다',
          '전원을 영구 차단한다',
        ],
        correctIndex: 0,
        explanation: 'Behavior Tree가 정체를 감지하면 Costmap 정리나 후진/회전 복구 동작을 트리거해 탈출합니다.',
      },
      {
        id: 'P5D42-5',
        question: '실제 실내 복도 주행 테스트에서 Costmap의 "Raytrace Clearing" 기능이 꺼져 있으면 어떤 일이 벌어지나요?',
        options: [
          '앞을 잠깐 스쳐 지나간 사람이나 문 열린 흔적이 지도에서 지워지지 않고 유령 벽으로 남아 길을 막는다',
          '바퀴 속도가 2배 빨라진다',
          '색상이 더 선명해진다',
          'CRC 체크섬이 꺼진다',
        ],
        correctIndex: 0,
        explanation: '라이다 빛이 다시 그 지점을 통과해 뒷벽을 찍었으면 중간의 장애물 마킹을 지워주어야 동적 잔상이 사라집니다.',
      },
    ],
  },
];
