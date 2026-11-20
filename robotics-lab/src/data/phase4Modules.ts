import { LabModule } from '../types/lab';

export const PHASE4_MODULES: LabModule[] = [
  {
    id: 'day27_encoder_odom',
    order: 27,
    dayLabel: 'Day 27',
    phaseLabel: 'Phase 4 · 센서/PID/필터',
    title: '직교 엔코더(A/B상) & 바퀴 오도메트리(Odometry)',
    shortTitle: 'D27 · 엔코더/오도메트리',
    subtitle: '90° 위상차 A/B상 4체배 디코딩 · RPM 계측 · 휠 슬립 누적 오차',
    badge: '자기 위치 추정',
    milestoneTag: 'Day 27 엔코더/오도메트리 랩',
    failFirstHook:
      '엔코더 1개 채널만 읽으면 바퀴가 정회전 중인지 역회전 중인지 전혀 구별하지 못하고, 10m만 달려도 바퀴 헛돌기(Slip) 때문에 로봇 위치 오차가 눈덩이처럼 불어납니다.',
    beginnerAnalogy:
      '두 눈(A상과 B상 센서)이 반 칸(90°) 어긋나게 톱니바퀴 줄무늬를 바라보면, "A가 먼저 지나갔네 → 전진! / B가 먼저 지나갔네 → 후진!" 하고 방향과 거리를 동시에 잴 수 있습니다.',
    overviewSummary:
      '직교 인코더의 A/B상 구형파 신호에서 4배 정밀도(4× Quadrature)로 펄스를 세는 원리와, 좌/우 바퀴 펄스 차이(Δticks)로부터 (x, y, θ) 좌표를 적분하는 오도메트리, 그리고 바닥 슬립으로 인한 누적 드리프트를 확인하세요.',
    guidedMissions: [
      {
        id: 'd27-cwccw',
        title: '회전 방향을 정회전(CW)에서 역회전(CCW)으로 바꿔 A/B상 선행 파형 확인하기',
        hint: '정회전 ↔ 역회전 버튼을 클릭해 A와 B 파형의 위상 순서(선행 채널)가 뒤바뀌는지 보세요.',
      },
      {
        id: 'd27-slip',
        title: '바퀴 슬립률(Slip)을 15% 이상 높여 오도메트리 누적 오차 확인하기',
        hint: '바퀴 슬립률 슬라이더를 15% 이상으로 올려 추정 궤적과 실제 궤적이 벌어지는 것을 보세요.',
      },
      {
        id: 'd27-code',
        title: '엔코더 틱 → 이동 거리/각도 변환 코드 챌린지 풀기',
        hint: '코드 탭의 오도메트리 버그 수정 문제를 풀어보세요.',
      },
    ],
    highlights: [
      {
        title: 'A/B상 90° 위상차 & 4체배(4×) 디코딩',
        body: '한 주기 동안 A상 상승·하강, B상 상승·하강 총 4번의 엣지가 발생합니다. 360 PPR 디스크도 4체배 인터럽트로 읽으면 1바퀴당 1,440 틱(0.25° 정밀도)을 얻습니다.',
        tone: 'cyan',
      },
      {
        title: '바퀴 오도메트리 적분: Δs, Δθ → (x, y, θ)',
        body: '제어 주기 Δt 동안 좌/우 바퀴 이동 거리 Δd_L, Δd_R을 잰 뒤 평균 Δs = (Δd_R+Δd_L)/2와 회전각 Δθ = (Δd_R-Δd_L)/W를 구해 현재 위치에 더합니다.',
        tone: 'emerald',
      },
      {
        title: '적분 오차의 저주: 작은 각도 오차가 거대 위치 오차로',
        body: '바퀴가 미끄러지거나 타이어 지름이 1mm만 달라도 θ가 틀어지며, 직진할수록 횡방향 위치 오차(Δs · sin θ_err)가 끝없이 누적(Drift)됩니다.',
        tone: 'rose',
      },
    ],
    formulas: [
      {
        title: '4체배 엔코더 틱 → 바퀴 이동 거리 & RPM',
        latex: String.raw`\Delta d = \frac{\Delta\text{ticks}}{\text{PPR} \cdot 4 \cdot G} \cdot \pi D_{\text{wheel}}, \qquad \text{RPM} = \frac{\Delta\text{ticks} / (\text{PPR}\cdot 4\cdot G)}{\Delta t_{\text{min}}}`,
        description: 'PPR은 디스크 슬롯 수, G는 감속 기어비(예: 30:1), D_wheel은 바퀴 지름입니다.',
      },
      {
        title: '차동 구동 2D 오도메트리 업데이트 (Midpoint)',
        latex: String.raw`x_{k+1} = x_k + \Delta s \cos\!\left(\theta_k + \frac{\Delta\theta}{2}\right), \qquad y_{k+1} = y_k + \Delta s \sin\!\left(\theta_k + \frac{\Delta\theta}{2}\right)`,
        description: '중간 각도(θ + Δθ/2)를 쓰는 2차 룬게-쿠타 적분이 오일러 적분보다 곡선 오차가 훨씬 적습니다.',
      },
    ],
    specs: [
      { label: '디코딩 분해능', value: '4× Quadrature', note: 'A/B 양엣지 모두 카운트', tone: 'cyan' },
      { label: 'ESP32 하드웨어 카운터', value: 'PCNT 유닛 내장', note: 'CPU 개입 없이 고속 펄스 계수', tone: 'emerald' },
      { label: '주요 오차 요인', value: '바퀴 슬립 · W 오차', note: '비체계적 + 체계적 오차', tone: 'rose' },
      { label: '보완 센서', value: 'IMU 자이로 융합', note: '회전각 Δθ 오차 억제', tone: 'amber' },
    ],
    wiringNotes: [
      {
        signal: '홀(Hall) / 광학 엔코더 전원 전압 확인',
        pin: '모터 드라이버 7.4V와 분리된 3.3V 또는 5V(분압)',
        detail: '대부분의 3.3V~5V 겸용 홀 센서는 VCC에 3.3V를 연결해도 ESP32 안전 범위로 깔끔히 출력됩니다.',
      },
      {
        signal: '인터럽트 핀 & 노이즈 필터',
        pin: 'IRAM_ATTR ISR 또는 ESP32 PCNT 모듈 + 0.1µF 캡',
        detail: '엔코더 선은 모터 PWM 선과 꼬아서(Twisted Pair) 멀리 띄워 배선해야 스파이크 노이즈 유입을 막습니다.',
      },
    ],
    codeTitle: 'day27_quad_odometry.cpp',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 27: 4체배 직교 엔코더 ISR 및 Midpoint 오도메트리 적분
volatile long ticksL = 0;

void IRAM_ATTR isrEncA() {
  // A상 변화 시 B상 레벨과 비교해 회전 방향(+1/-1) 즉각 판별
  bool a = digitalRead(PIN_ENC_A);
  bool b = digitalRead(PIN_ENC_B);
  ticksL += (a == b) ? 1 : -1;
}

void updateOdometry(float dL, float dR, float wheelBaseW) {
  float ds = 0.5f * (dR + dL);
  float dTheta = (dR - dL) / wheelBaseW;
  float midTheta = odomTheta + 0.5f * dTheta;
  odomX += ds * cosf(midTheta);
  odomY += ds * sinf(midTheta);
  odomTheta += dTheta;
}`,
    codeChallenge: {
      prompt: '바퀴가 곡선을 돌 때 직선 근사 오차를 줄이는 Midpoint 오도메트리 적분에서 cos() 안에 넣어야 할 각도는?',
      buggyLine: 'odomX += ds * cosf(odomTheta); // 곡선 선회 시 외측 바이어스 누적!',
      options: [
        'odomX += ds * cosf(odomTheta + 0.5f * dTheta);',
        'odomX += ds * cosf(dTheta * 2.0f);',
        'odomX += ds * sinf(odomTheta);',
      ],
      correctIndex: 0,
      explanation: '이동 구간의 시작과 끝 각도의 중간값(odomTheta + 0.5 * dTheta)으로 투영해야 원호 오차가 최소화됩니다.',
    },
    quizzes: [
      {
        id: 'P4D27-1',
        question: '1회전당 11 PPR 자기 엔코더가 30:1 감속 기어박스 모터 축에 달려있고 4체배 디코딩을 쓸 때, 바퀴 1회전당 총 틱(Ticks) 수는?',
        options: ['330 ticks', '660 ticks', '1,320 ticks (11 × 4 × 30)', '11 ticks'],
        correctIndex: 2,
        explanation: '총 틱 수 = 11 PPR × 4(4체배) × 30(기어비) = 1,320 ticks/rev입니다.',
      },
      {
        id: 'P4D27-2',
        question: '1채널(A상만) 엔코더 대신 A/B상 90° 위상차 직교 엔코더를 사용하는 결정적 이유는?',
        options: [
          '전기를 생산하기 위해',
          '정회전(CW)과 역회전(CCW) 방향을 판별하고 4배 높은 해상도를 얻기 위해',
          '선 개수를 줄이기 위해',
          '아날로그 전압을 재기 위해',
        ],
        correctIndex: 1,
        explanation: 'A상과 B상의 90° 위상 선후 관계를 비교해야 모터가 앞으로 도는지 뒤로 도는지 판별할 수 있습니다.',
      },
      {
        id: 'P4D27-3',
        question: '바퀴 지름이 좌측만 실물 오차로 0.5mm 더 작을 때, 두 바퀴에 똑같은 틱 수를 주어도 나타나는 체계적 오차는?',
        options: [
          '직진하지 않고 바퀴가 작은 쪽으로 계속 휘어지며(Yaw Drift) 경로를 벗어난다',
          '배터리 용량이 늘어난다',
          '아무 영향이 없다',
          '무조건 제자리 회전한다',
        ],
        correctIndex: 0,
        explanation: '좌우 바퀴 둘레 차이로 같은 틱당 실제 이동 거리가 달라져 지속적인 헤딩(θ) 편향이 생깁니다(UMBmark 캘리브레이션 대상).',
      },
      {
        id: 'P4D27-4',
        question: '제어 주기 Δt 동안 Δd_L = 0.04m, Δd_R = 0.06m 이동했고 바퀴 간격 W = 0.20m일 때 로봇의 방향 변화량 Δθ는?',
        options: ['0.02 rad', '0.10 rad', '0.20 rad', '-0.10 rad'],
        correctIndex: 1,
        explanation: 'Δθ = (Δd_R - Δd_L) / W = (0.06 - 0.04) / 0.20 = 0.10 rad (약 +5.73° 반시계 회전)입니다.',
      },
      {
        id: 'P4D27-5',
        question: '엔코더 펄스를 CPU 디지털 인터럽트 대신 ESP32의 PCNT(Pulse Counter) 하드웨어 모듈로 읽을 때의 장점은?',
        options: [
          '고속 회전 시 CPU 인터럽트 폭주(ISR 부하) 없이 하드웨어 카운터가 틱을 놓치지 않고 세어준다',
          '배선을 안 해도 된다',
          '모터 전력을 증폭한다',
          'I2C 주소를 자동으로 바꾼다',
        ],
        correctIndex: 0,
        explanation: '고RPM 기어 전 모터의 수만 Hz 펄스는 소프트웨어 ISR을 마비시킬 수 있으나 PCNT 하드웨어는 0% CPU 점유로 처리합니다.',
      },
    ],
  },
  {
    id: 'day28_imu',
    order: 28,
    dayLabel: 'Day 28',
    phaseLabel: 'Phase 4 · 센서/PID/필터',
    title: '관성 측정 장치 IMU (MPU-6050) 해부 & 오차 특성',
    shortTitle: 'D28 · IMU 가속도/자이로',
    subtitle: '가속도계(진동 취약) vs 자이로(적분 드리프트) · 부팅 시 바이어스 영점 잡기',
    badge: 'IMU 센서',
    milestoneTag: 'Day 28 IMU 특성 분석 랩',
    failFirstHook:
      '자이로스코프의 각속도만 적분해 로봇 기울기나 방향을 구하면, 로봇을 책상에 가만히 세워두기만 했는데도 1분 뒤 추정 각도가 15도 이상 혼자 돌아가 버립니다.',
    beginnerAnalogy:
      '자이로는 눈을 감고 회전의자를 타는 감각(순간 움직임엔 반응이 칼같지만 시간이 갈수록 영점이 틀어짐)이고, 가속도계는 수평계 안에 매단 추(평균 방향은 정확하지만 바닥이 덜컹거리면 요동침)입니다.',
    overviewSummary:
      '가속도계와 자이로스코프가 실제 기울기(θ_true)를 측정할 때 모터 진동 노이즈(g)와 자이로 영점 바이어스(°/s)가 각각 어떤 파형 오류를 만드는지 관찰하고, 기동 직후 영점 캘리브레이션 효과를 검증하세요.',
    guidedMissions: [
      {
        id: 'd28-vib',
        title: '모터 진동 노이즈(Vibration)를 0.35g 이상으로 올려 가속도계 파형 흔들림 확인하기',
        hint: '모터 진동 슬라이더를 올려 고주파 진동이 가속도 각도 추정을 어떻게 오염시키는지 보세요.',
      },
      {
        id: 'd28-drift',
        title: '영점 캘리브레이션 OFF 상태에서 자이로 바이어스로 인한 각도 드리프트 관찰하기',
        hint: '캘리브레이션 스위치를 OFF로 두고 바이어스 값을 0.5°/s 이상으로 설정해 보세요.',
      },
      {
        id: 'd28-calib',
        title: '영점 캘리브레이션(Calibration ON)으로 자이로 적분 드리프트 제거하기',
        hint: '정지 영점 보정 버튼을 눌러 ON 상태로 돌리면 적분 오차가 잡히는 것을 확인하세요.',
      },
    ],
    highlights: [
      {
        title: '가속도계 (Accelerometer): 단기 진동 취약 · 장기 평균 정확',
        body: '정지 시 중력 가속도 벡터 [ax, ay, az]로부터 atan2(ay, az)로 절대 기울기를 계산합니다. 하지만 모터 진동이나 차체 가속도가 섞이면 선형 가속도가 중력 벡터를 왜곡시킵니다.',
        tone: 'amber',
      },
      {
        title: '자이로스코프 (Gyroscope): 단기 깔끔 · 장기 바이어스 드리프트',
        body: '각속도 ω(°/s)를 시간 적분(θ += ω·dt)하므로 고주파 진동에 매우 둔감하고 빠릅니다. 그러나 0°/s가 아닌 미세한 정지 영점 오차(Bias)까지 함께 적분되어 시간이 지날수록 각도가 계속 흘러갑니다.',
        tone: 'rose',
      },
      {
        title: '필수 루틴: 부팅 후 1~2초 정지 바이어스 캘리브레이션',
        body: '전원을 켤 때 로봇을 1~2초간 완전히 정지시켜 자이로 샘플 500~1,000개의 평균값을 구해 biasOffset으로 저장한 뒤 매 측정마다 빼주어야 드리프트를 대폭 줄입니다.',
        tone: 'emerald',
      },
    ],
    formulas: [
      {
        title: '가속도계 기반 정적 Roll / Pitch 추정',
        latex: String.raw`\text{Roll}_{\text{acc}} = \operatorname{atan2}(a_y,\, a_z), \qquad \text{Pitch}_{\text{acc}} = \operatorname{atan2}\!\left(-a_x,\, \sqrt{a_y^2 + a_z^2}\right)`,
        description: '가속도계는 중력축(Z) 중심 회전인 Yaw(방위각)는 절대 감지할 수 없다는 한계가 있습니다.',
      },
      {
        title: '자이로 바이어스 보정 및 각도 적분',
        latex: String.raw`\theta_{\text{gyro}}[k] = \theta_{\text{gyro}}[k-1] + (\omega_{\text{raw}}[k] - \omega_{\text{bias}}) \cdot \Delta t`,
        description: 'MPU-6050(±250°/s 설정)에서는 Raw 16비트 정수를 131.0 LSB/(°/s)로 나누어 물리 단위로 변환합니다.',
      },
    ],
    specs: [
      { label: 'MPU-6050 통신', value: 'I2C 0x68 (400kHz)', note: 'AD0 HIGH 시 0x69', tone: 'cyan' },
      { label: '가속도 감도 (±2g)', value: '16,384 LSB / g', note: '정지 시 Z축 ≈ +16,384', tone: 'emerald' },
      { label: '자이로 감도 (±250°/s)', value: '131.0 LSB / (°/s)', note: '장시간 적분 시 드리프트', tone: 'amber' },
      { label: '기동 캘리브레이션', value: '정지 1~2초 평균', note: '초기 오프셋 제거 필수', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '진동 절연 마운트 (Vibration Damping)',
        pin: 'IMU 보드를 양면 폼 테이프·고무 댐퍼 위 장착',
        detail: '모터·기어박스의 고주파 기계적 진동이 PCB에 직결되면 가속도계와 자이로 모두 앨리어싱(Aliasing) 왜곡을 일으킵니다.',
      },
      {
        signal: 'I2C Fast Mode & 좌표축 정렬',
        pin: 'Wire.setClock(400000); · 칩 위 X/Y 화살표 확인',
        detail: '제어 루프 200Hz 이상을 돌리려면 I2C 클록을 기본 100kHz에서 400kHz로 올리고, 칩 실크스크린 방향과 로봇 +X 전방을 일치시킵니다.',
      },
    ],
    codeTitle: 'day28_imu_bias_calib.cpp',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 28: 부팅 시 500회 정지 샘플로 자이로 바이어스 오프셋 제거
float gyroBiasZ = 0.0f;

void calibrateGyro() {
  double sum = 0.0;
  for (int i = 0; i < 500; i++) {
    int16_t rawGz = readMPU6050_GZ();
    sum += rawGz / 131.0; // ±250 deg/s 스케일 -> deg/s 변환
    delay(2);
  }
  gyroBiasZ = (float)(sum / 500.0);
}

float readGyroZDegPerSec() {
  return (readMPU6050_GZ() / 131.0f) - gyroBiasZ;
}`,
    codeChallenge: {
      prompt: '가만히 멈춘 상태에서 가속도계만으로 로봇의 절대 각도를 알 수 없는 회전 축은 어느 것일까요?',
      buggyLine: 'float yawAcc = atan2f(ay, ax); // 바닥에서 회전해도 중력은 Z축뿐!',
      options: [
        'Yaw(수직 중력축 Z를 중심으로 도는 평면 회전) — 중력 벡터가 변하지 않으므로 측정 불가',
        'Roll(좌우 갸우뚱 회전)',
        'Pitch(앞뒤 숙이기 회전)',
      ],
      correctIndex: 0,
      explanation: '가속도계는 지구 중심을 향하는 중력 벡터의 방향만 감지하므로, 수직 Z축 회전(Yaw)에는 중력 성분이 전혀 변하지 않아 감지할 수 없습니다.',
    },
    quizzes: [
      {
        id: 'P4D28-1',
        question: '자이로스코프의 각속도 신호만을 시간에 대해 계속 적분할 때 발생하는 고질적인 오차 현상은?',
        options: [
          '고주파 진동(Jitter)에 즉각 반응해 파형이 매 순간 크게 출렁인다',
          '미세한 영점 오프셋(Bias)이 누적되어 시간이 지날수록 각도가 한쪽으로 서서히 흘러가는 드리프트(Drift)',
          '전원을 켜자마자 각도가 0으로 고정된다',
          '자기장에 의해 방향이 바뀐다',
        ],
        correctIndex: 1,
        explanation: '적분 연산은 0이 아닌 미세한 DC 오차(Bias)조차 시간 t에 비례해 계속 더하므로 누적 드리프트가 피할 수 없습니다.',
      },
      {
        id: 'P4D28-2',
        question: '반면 가속도계만으로 로봇의 기울기(Roll/Pitch)를 구할 때 가장 취약한 상황은?',
        options: [
          '로봇이 오랜 시간 정지해 있을 때',
          '로봇이 급가속·급정거하거나 모터 진동이 심할 때 선형 가속도가 중력 벡터에 섞여 각도가 튈 때',
          '어두운 방에 들어갔을 때',
          '배터리 전압이 3.3V일 때',
        ],
        correctIndex: 1,
        explanation: '가속도계는 순수 중력(1g)과 로봇 자신의 이동 가속도 및 진동을 구별하지 못해 단기 움직임 시 오차가 큽니다.',
      },
      {
        id: 'P4D28-3',
        question: 'MPU-6050 자이로를 ±250°/s 감도로 설정했을 때, 원시 레지스터 값이 +655 LSB라면 실제 회전 각속도는?',
        options: ['+1.0 °/s', '+5.0 °/s', '+10.0 °/s', '+65.5 °/s'],
        correctIndex: 1,
        explanation: '±250°/s 범위의 스케일 팩터는 131.0 LSB/(°/s)이므로 655 / 131.0 = +5.0 °/s입니다.',
      },
      {
        id: 'P4D28-4',
        question: '6축 IMU(가속도 3축 + 자이로 3축)가 아니라 9축 IMU(지자기 3축 추가)를 쓰는 주된 목적은?',
        options: [
          '지구 자기장을 기준 삼아 중력축 회전(Yaw)의 장기 드리프트를 보정하려고',
          '온도를 측정하려고',
          '모터를 직접 돌리려고',
          '무게를 늘리려고',
        ],
        correctIndex: 0,
        explanation: '중력은 Yaw 회전에 반응하지 않으므로, 야외/비자성 환경에서는 지자기 나침반이 Yaw의 절대 기준이 됩니다.',
      },
      {
        id: 'P4D28-5',
        question: '부팅 직후 자이로 바이어스 캘리브레이션을 수행하는 동안 절대 지켜야 할 조건은?',
        options: [
          '로봇을 손으로 들고 흔들어야 한다',
          '로봇을 완전히 정지시킨 상태(각속도 ω_true = 0)를 1~2초 유지해야 한다',
          '모터를 최대 속도로 돌려야 한다',
          'I2C 선을 뽑아둔다',
        ],
        correctIndex: 1,
        explanation: '정지한 상태여야 측정값의 평균을 순수 센서 영점 오차(Bias)로 간주해 제거할 수 있습니다.',
      },
    ],
  },
  {
    id: 'day29_sensor_fusion',
    order: 29,
    dayLabel: 'Day 29',
    phaseLabel: 'Phase 4 · 센서/PID/필터',
    title: '신호 필터링 & 상보 필터(Complementary Filter)',
    shortTitle: 'D29 · LPF & 상보필터',
    subtitle: '1차 EMA 저역통과 필터 · Phase Lag 트레이드오프 · 자이로+가속도 상보 융합',
    badge: '센서 퓨전 1',
    milestoneTag: 'Day 29 필터 & 상보 퓨전 랩',
    failFirstHook:
      '진동이 낀 가속도 원시값으로 밸런싱 로봇을 세우려 하면 모터가 비명을 지르며 떨고, 반대로 1차 저역통과 필터(LPF)만 너무 강하게 걸면 0.3초씩 반응이 늦어(Phase Lag) 이미 넘어진 뒤에 모터를 돌립니다.',
    beginnerAnalogy:
      '상보 필터는 "눈앞의 0.01초 빠른 변화는 날렵한 자이로를 98% 믿고, 시간이 지나 생기는 어긋남만 듬직한 가속도계(2%)로 슬쩍 바로잡아 주는" 두 센서의 완벽한 팀워크입니다.',
    overviewSummary:
      '원시 가속도(진동 노이즈), 순수 자이로(드리프트), 1차 LPF(평활화 vs 위상 지연), 그리고 상보 필터(98% 자이로 + 2% 가속도)가 동일한 계단 기울기 변화를 어떻게 추적하는지 오실로스코프 그래프로 비교하세요.',
    guidedMissions: [
      {
        id: 'd29-raw',
        title: '원시 가속도(Raw Acc)와 순수 자이로(Gyro Only) 모드의 치명적 단점 각각 확인하기',
        hint: '상단 필터 모드 버튼에서 "가속도 원시"와 "자이로 단독"을 차례로 클릭해 파형을 보세요.',
      },
      {
        id: 'd29-lpf',
        title: '1차 LPF 모드에서 평활 계수 α를 높여 노이즈 감소 vs 지연(Phase Lag) 트레이드오프 보기',
        hint: '"1차 LPF" 선택 후 α 값을 0.90 이상으로 올리면 곡선이 부드러워지지만 뒤늦게 따라옵니다.',
      },
      {
        id: 'd29-comp',
        title: '상보 필터 모드로 전환해 지연·노이즈·드리프트 3마리 토끼를 모두 잡기',
        hint: '"상보 필터 (98% Gyro + 2% Acc)" 모드를 선택하고 성능을 비교하세요.',
      },
    ],
    highlights: [
      {
        title: '1차 LPF(지수 이동 평균 EMA)와 차단 주파수',
        body: 'y[k] = α·y[k-1] + (1-α)·x[k] 한 줄로 고주파 노이즈를 깎습니다. 단, α가 1에 가까워질수록 노이즈는 사라지지만 실제 움직임에 뒤처지는 위상 지연(Phase Lag)이 커집니다.',
        tone: 'amber',
      },
      {
        title: '상보 필터의 마법: 고주파 통과(자이로) + 저주파 통과(가속도)',
        body: '자이로의 빠른 변화(ω·dt)에는 0.98(고주파 담당)을, 가속도계의 느린 절대 기준(θ_acc)에는 0.02(저주파 담당)를 배분하면 두 필터 가중치 합 0.98+0.02 = 1.0으로 위상 지연 없이 정확한 각도를 얻습니다.',
        tone: 'emerald',
      },
      {
        title: '단순함 대비 압도적인 가성비',
        body: '복잡한 행렬 역산이 필요한 칼만 필터와 달리 곱셈 두 번과 덧셈 한 번만으로 8비트 아두이노나 ESP32에서 1kHz 속도로 가뿐하게 실행됩니다.',
        tone: 'cyan',
      },
    ],
    formulas: [
      {
        title: '1차 저역통과 필터 (EMA IIR Filter)',
        latex: String.raw`y[k] = \alpha\, y[k-1] + (1 - \alpha)\, x[k], \qquad \alpha = \frac{\tau}{\tau + \Delta t} \in [0, 1)`,
        description: '시정수 τ = RC가 클수록(α → 1) 더 낮은 차단 주파수로 강하게 매끄럽게 깎습니다.',
      },
      {
        title: '상보 필터 (Complementary Filter)',
        latex: String.raw`\theta[k] = \gamma \cdot \bigl(\theta[k-1] + \omega_{\text{gyro}}[k]\,\Delta t\bigr) + (1 - \gamma)\cdot \theta_{\text{acc}}[k]`,
        description: '보통 100Hz~200Hz 루프에서 γ = 0.96 ~ 0.99 를 사용합니다.',
      },
    ],
    specs: [
      { label: '권장 γ (자이로 비중)', value: '0.96 ~ 0.99', note: '루프 Δt = 5~10ms 기준', tone: 'emerald' },
      { label: '연산량', value: 'O(1) 스칼라 3연산', note: 'MCU 1µs 이내 처리', tone: 'cyan' },
      { label: 'LPF 단독 한계', value: 'Phase Lag (지연)', note: '급격한 동작 추적 불가', tone: 'rose' },
      { label: '고급 대안', value: '칼만 필터 / Madgwick', note: '동적 가중치 · 9축 자세', tone: 'amber' },
    ],
    wiringNotes: [
      {
        signal: 'γ 값은 Δt(샘플링 주기)에 의존함',
        pin: 'τ = γ·Δt / (1 - γ) 시정수로 계산',
        detail: '100Hz(Δt=0.01s)에서 γ=0.98은 시정수 0.49초지만, 루프 주기가 20Hz(Δt=0.05s)로 느려졌는데 그대로 0.98을 쓰면 보정이 5배 느려집니다.',
      },
      {
        signal: '차량 충돌·원심 가속 시 가속도 신뢰도 저하',
        pin: '||acc|| 가 1.0g ± 0.15g 밖이면 일시적으로 γ=1.0 유지',
        detail: '실전 로버가 급정거할 때 가속도 크기가 1g를 크게 벗어나므로, 이때는 잠깐 가속도 보정을 끄면 각도 튀는 현상을 막습니다.',
      },
    ],
    codeTitle: 'day29_complementary_filter.cpp',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 29: 100Hz 루프에서 동작하는 상보 필터(Complementary Filter)
float fusedPitchDeg = 0.0f;
const float GAMMA = 0.98f; // 98% 자이로 적분 + 2% 가속도 중력 보정

float updateComplementary(float accX, float accY, float accZ,
                          float gyroY_dps, float dt) {
  float accPitchDeg = atan2f(-accX, sqrtf(accY * accY + accZ * accZ)) * RAD_TO_DEG;
  float gyroPredDeg = fusedPitchDeg + gyroY_dps * dt;
  fusedPitchDeg = GAMMA * gyroPredDeg + (1.0f - GAMMA) * accPitchDeg;
  return fusedPitchDeg;
}`,
    codeChallenge: {
      prompt: '상보 필터 계수 γ의 의미로 옳은 것을 고르고, 루프가 드리프트를 조금 더 빨리 잡도록 가속도 비중을 높이려면 어떻게 수정해야 할까요?',
      buggyLine: 'fused = 0.9999f * (fused + gyro * dt) + 0.0001f * acc; // 가속도 보정이 너무 느림',
      options: [
        'fused = 0.95f * (fused + gyro * dt) + 0.05f * acc; // 가속도 비중을 5%로 높임',
        'fused = 1.0f * (fused + gyro * dt) + 0.0f * acc;',
        'fused = 0.95f * acc + 0.05f * acc;',
      ],
      correctIndex: 0,
      explanation: '(1 - γ) 항이 가속도계로 영점 드리프트를 교정하는 비율이므로 γ를 0.98→0.95로 낮추면 드리프트 복원이 빨라집니다.',
    },
    quizzes: [
      {
        id: 'P4D29-1',
        question: '1차 저역통과 필터 y[k] = α·y[k-1] + (1-α)·x[k] 에서 α를 0.5에서 0.95로 크게 높였을 때 나타나는 두 가지 결과는?',
        options: [
          '고주파 노이즈는 더 매끄럽게 제거되지만, 실제 값 변화에 뒤처지는 시간 지연(Phase Lag)이 길어진다',
          '노이즈가 2배 커지고 지연은 0이 된다',
          '출력 값이 무한대로 발산한다',
          '고주파 성분만 통과한다',
        ],
        correctIndex: 0,
        explanation: '이전 값 비율 α가 클수록 급격한 요동(노이즈)은 억제되지만 반응 속도 역시 무뎌집니다.',
      },
      {
        id: 'P4D29-2',
        question: '상보 필터 공식에서 자이로 적분 항에는 고주파 비중 γ=0.98, 가속도 항에는 (1-γ)=0.02를 곱해 합치는 이유는?',
        options: [
          '단기 급변은 지연 없는 자이로로 추적하고, 장기 드리프트만 노이즈 섞인 가속도 평균으로 천천히 바로잡기 위해',
          '자이로와 가속도계 단위가 같아서',
          '두 센서를 평균 50:50으로 섞어야 하므로',
          '가속도계가 너무 비싸서',
        ],
        correctIndex: 0,
        explanation: '고역통과(자이로)와 저역통과(가속도)의 전달함수 합이 1(All-pass)이 되어 각 센서의 약점을 완벽히 상쇄합니다.',
      },
      {
        id: 'P4D29-3',
        question: '상보 필터의 두 가중치 합(γ + (1 - γ))이 정확히 1.0이 아니면 어떤 문제가 발생할까요?',
        options: [
          '최종 추정 각도가 실제 45°일 때도 40°나 50°로 스케일(이득) 왜곡이 생긴다',
          '메모리가 부족해진다',
          '아무 일도 없다',
          'I2C 버스가 끊긴다',
        ],
        correctIndex: 0,
        explanation: '가중치 합이 1이 아니면 직류 이득(DC Gain)이 1에서 벗어나 정상 상태에서 실제 각도와 일치하지 않습니다.',
      },
      {
        id: 'P4D29-4',
        question: '로봇이 벽에 세게 부딪혀 가속도계 크기 √(ax²+ay²+az²)가 순간 2.5g로 튀는 동안 상보 필터를 보호하는 실무 기법은?',
        options: [
          '가속도 벡터 크기가 1g에서 크게 벗어난 순간에는 가속도 보정 비중(1-γ)을 0으로 줄여 자이로만 잠깐 신뢰한다',
          '로봇 전원을 끈다',
          '가속도 비중을 100%로 높인다',
          '모터를 역회전시킨다',
        ],
        correctIndex: 0,
        explanation: '외부 충격 가속도는 중력 방향을 망가뜨리므로 총 가속도가 ~1g 근처일 때만 가속도 보정을 적용합니다.',
      },
      {
        id: 'P4D29-5',
        question: '이동 평균 필터(최근 N=20개 평균)와 비교했을 때 1차 지수 이동 평균(EMA LPF)이 임베디드에서 선호되는 이유는?',
        options: [
          '과거 N개 배열을 전부 저장·합산할 필요 없이 단 1개의 이전 출력 변수 y[k-1]만 유지하면 되므로 메모리와 연산이 O(1)이다',
          '소수점이 필요 없다',
          '지연이 전혀 없다',
          '배열 크기가 클수록 메모리를 덜 쓴다',
        ],
        correctIndex: 0,
        explanation: 'EMA는 직전 필터 값 y[k-1] 하나만 기억하면 되어 RAM과 CPU가 제한된 마이크로컨트롤러에 최적입니다.',
      },
    ],
  },
  {
    id: 'day31_pid_advanced',
    order: 31,
    dayLabel: 'Day 31',
    phaseLabel: 'Phase 4 · 센서/PID/필터',
    title: '실전 PID 트러블슈팅: Anti-Windup & LPF 스텝 응답',
    shortTitle: 'D31 · 실전PID/와인드업',
    subtitle: '스텝 응답 오실로스코프 · 적분 포화(Windup) 폭주 · 미분 노이즈 LPF',
    badge: '제어 실전',
    milestoneTag: 'Day 31 PID 오실로스코프 랩',
    failFirstHook:
      '로봇 팔이나 바퀴를 손으로 1초 동안 강제로 붙잡고 놓으면, 그 사이 적분항(I)이 거대하게 쌓여(Integrator Windup) 손을 놓자마자 목표점을 훨씬 지나쳐 반대쪽 끝까지 폭주합니다.',
    beginnerAnalogy:
      '액셀 페달이 이미 바닥(100%)까지 밟혀 차가 더 나갈 수 없는데도, "아직 안 갔네?" 하고 연료만 계속 탱크 밖으로 붓는 게 적분 와인드업이고, 페달이 꽉 차면 누적 타이머를 멈추는 장치가 안티 와인드업입니다.',
    overviewSummary:
      '실시간 스텝 응답 오실로스코프에서 Kp, Ki, Kd 게인을 튜닝하고, 외란(손으로 붙잡기/구속) 상황에서 Anti-Windup ON/OFF가 오버슈트를 어떻게 극적으로 줄이는지, 그리고 미분항 LPF가 노이즈 스파이크를 어떻게 잡는지 실험하세요.',
    guidedMissions: [
      {
        id: 'd31-windup',
        title: '외란 구속(Disturbance Stall)을 켜고 Anti-Windup OFF 상태에서 거대 오버슈트 확인하기',
        hint: '"외란 구속 ON"과 "Anti-Windup OFF"를 설정해 적분항 I가 폭주하며 그래프가 치솟는 모습을 보세요.',
      },
      {
        id: 'd31-antiwindup',
        title: 'Anti-Windup ON으로 적분 클램핑을 켜서 구속 해제 후 오버슈트 억제하기',
        hint: 'Anti-Windup 스위치를 ON으로 전환해 스텝 응답이 안정화되는 것을 확인하세요.',
      },
      {
        id: 'd31-lpf',
        title: '미분항 LPF를 켜서 엔코더 양자화 노이즈에 의한 출력 채터링(떨림) 제거하기',
        hint: '미분항 LPF(저역통과 필터) 스위치를 ON/OFF 하며 제어 출력 그래프를 비교하세요.',
      },
    ],
    highlights: [
      {
        title: '적분 와인드업(Integrator Windup)과 클램핑(Clamping)',
        body: '모터 출력(±255 PWM 등)이 물리 한계에 부딪혀 포화(Saturated)되었는데도 오차가 남아있으면 적분항이 무한정 커집니다. 출력이 포화되고 오차와 같은 부호일 때 적분을 중단(Conditional Integration)하거나 상한을 클램핑해야 합니다.',
        tone: 'rose',
      },
      {
        title: '미분 킥(Derivative Kick) & 미분항 노이즈 증폭',
        body: '목표값(Setpoint)이 순간 0→90° 점프하면 e[k]-e[k-1]가 무한대에 가까워 모터가 쾅 튀는 미분 킥이 납니다. 측정값 자체를 미분(-Kd·dy/dt)하고 1차 LPF를 통과시켜 해결합니다.',
        tone: 'amber',
      },
      {
        title: '이중 캐스케이드 루프 (외부 위치 → 내부 속도)',
        body: '위치 PID가 직접 PWM을 쏘지 않고 "목표 RPM"을 계산해 내부의 빠른 속도 PID(100~200Hz)에게 넘기면 마찰이나 전압 강하에도 훨씬 정밀하게 정지합니다.',
        tone: 'emerald',
      },
    ],
    formulas: [
      {
        title: '적분 클램핑(Anti-Windup) & 출력 포화 처리',
        latex: String.raw`I[k] = \operatorname{clamp}\!\left(I[k-1] + K_i\, e[k]\,\Delta t,\; -I_{\max},\; +I_{\max}\right), \qquad u[k] = \operatorname{clamp}(P + I + D,\; u_{\min},\; u_{\max})`,
        description: '또는 출력이 포화 상태(u_raw ≠ u_sat)이고 오차가 포화를 심화시킬 때 적분 업데이트를 동결합니다.',
      },
      {
        title: '노이즈 억제용 필터링된 미분항 (Derivative on Measurement + LPF)',
        latex: String.raw`D_{\text{raw}}[k] = -K_d \frac{y[k] - y[k-1]}{\Delta t}, \qquad D_{\text{filt}}[k] = \beta D_{\text{filt}}[k-1] + (1-\beta) D_{\text{raw}}[k]`,
        description: '오차(e) 대신 측정값(y)을 미분하면 목표값 변경 시의 충격(Derivative Kick)도 함께 제거됩니다.',
      },
    ],
    specs: [
      { label: '적분 폭주 대책', value: 'Conditional Clamping', note: '포화 시 적분 일시 정지', tone: 'rose' },
      { label: '미분 킥 방지', value: '-Kd · Δy / Δt', note: '측정값 기반 미분', tone: 'cyan' },
      { label: '권장 오버슈트', value: '< 5 ~ 10%', note: '정밀 매니퓰레이터는 < 2%', tone: 'emerald' },
      { label: '캐스케이드 루프', value: '위치(50Hz)→속도(200Hz)', note: '내부 루프가 최소 3배 빠르게', tone: 'amber' },
    ],
    wiringNotes: [
      {
        signal: '튜닝 표준 순서 (Ziegler-Nichols / 수동 실무법)',
        pin: '1) Ki=0, Kd=0 상태에서 Kp 증가 → 2) Kd로 진동 감쇄 → 3) 소량 Ki로 잔류오차 제거',
        detail: '처음부터 P, I, D 세 값을 동시에 만지면 어느 항 때문에 발산하는지 파악할 수 없습니다.',
      },
      {
        signal: '고정 샘플링 주기 Δt 엄수',
        pin: 'millis() 또는 vTaskDelayUntil() 로 10ms / 20ms 고정',
        detail: '적분(·Δt)과 미분(/Δt)이 모두 Δt에 의존하므로 루프 주기가 출렁이면 PID 게인 특성이 매 순간 변합니다.',
      },
    ],
    codeTitle: 'day31_antiwindup_pid.cpp',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 31: 실전 PID (측정값 미분 + LPF + 조건부 적분 Anti-Windup)
float computeSafePID(float setpoint, float measured, float dt) {
  float err = setpoint - measured;
  float P = Kp * err;

  // 미분 킥 방지: 오차가 아닌 측정값 변화율(-dy/dt) + LPF 필터
  float rawD = -Kd * (measured - prevMeasured) / dt;
  dFilt = 0.7f * dFilt + 0.3f * rawD;
  prevMeasured = measured;

  // 출력 포화 검사 후 조건부 적분 (Anti-Windup)
  float tempOut = P + integral + dFilt;
  if (fabsf(tempOut) < MAX_OUT || (tempOut * err) < 0.0f) {
    integral = constrain(integral + Ki * err * dt, -MAX_OUT * 0.5f, MAX_OUT * 0.5f);
  }
  return constrain(P + integral + dFilt, -MAX_OUT, MAX_OUT);
}`,
    codeChallenge: {
      prompt: '모터 출력이 이미 +100% 포화(MAX_OUT)된 상태에서 여전히 양의 오차(err > 0)가 남아있을 때, 와인드업을 막는 올바른 적분 조건은?',
      buggyLine: 'integral += Ki * err * dt; // 포화 상태에서도 계속 무한 누적!',
      options: [
        'if (fabsf(tempOut) < MAX_OUT || (tempOut * err) < 0.0f) integral += Ki * err * dt;',
        'if (err > 0) integral += Ki * err * 10.0f;',
        'Ki = Kp * 100.0f;',
      ],
      correctIndex: 0,
      explanation: '출력이 포화(>=MAX_OUT) 상태이고 오차가 같은 방향(tempOut * err >= 0)이면 적분을 일시 동결하고, 반대 방향으로 오차가 바뀌면 즉시 적분 해제를 허용합니다.',
    },
    quizzes: [
      {
        id: 'P4D31-1',
        question: '모터가 물리적 장애물에 걸려 몇 초간 움직이지 못하다가 풀려나는 순간 거대 오버슈트가 발생하는 현상과 원인은?',
        options: [
          '적분 와인드업(Windup) — 구속된 동안 오차 × 시간만큼 적분항 I가 과도하게 누적되어서',
          '비례 이득 상실 — Kp가 0이 되어서',
          '미분 감쇠 — Kd가 너무 커서',
          '엔코더 4체배 효과',
        ],
        correctIndex: 0,
        explanation: '적분항이 누적 한계나 포화 방어 없이 계속 쌓여, 장애물이 사라진 후 거대한 잔여 출력이 쏟아져 폭주합니다.',
      },
      {
        id: 'P4D31-2',
        question: '목표 각도를 0°에서 90°로 계단처럼(Step) 바꾸자마자 순간 출력이 스파이크 치는 "미분 킥(Derivative Kick)" 해결법은?',
        options: [
          '오차(setpoint - y) 대신 측정값(y) 자체를 미분하는 -Kd · (dy/dt) 방식을 사용한다',
          'Ki를 10배 키운다',
          'Δt를 1초로 늘린다',
          'D 게인에 음수를 곱해 양의 피드백으로 만든다',
        ],
        correctIndex: 0,
        explanation: '물리량 y(각도/속도)는 관성이 있어 순간 점프하지 않으므로 -dy/dt로 미분하면 목표 변경 시의 스파이크가 사라집니다.',
      },
      {
        id: 'P4D31-3',
        question: '엔코더 분해능이 낮은 로봇에서 미분항(D) 때문에 모터가 "지지직" 떨며 고주파 소음을 낼 때 표준 해결책은?',
        options: [
          '미분항 D 출력 경로에 1차 저역통과 필터(LPF)를 추가해 고주파 계단 노이즈를 걸러낸다',
          '엔코더 선을 뽑는다',
          'Kp를 무한대로 키운다',
          '배터리 전압을 높인다',
        ],
        correctIndex: 0,
        explanation: '미분 연산은 고주파 계단 노이즈(1틱 점프 / 짧은 Δt)를 크게 증폭하므로 반드시 D-term LPF를 함께 씁니다.',
      },
      {
        id: 'P4D31-4',
        question: '이중 캐스케이드(Cascade) PID 제어 구조에서 내부 루프(속도 제어)와 외부 루프(위치 제어)의 주기 설계 원칙은?',
        options: [
          '내부 속도 루프가 외부 위치 루프보다 최소 3~5배 이상 빠르게(높은 Hz로) 실행되어야 안정적이다',
          '외부 위치 루프가 10배 더 빨라야 한다',
          '두 루프 모두 1초에 1번만 돈다',
          '내부 루프는 피드백이 없다',
        ],
        correctIndex: 0,
        explanation: '외부 루프가 지령한 목표 속도를 내부 루프가 즉시 따라잡아야 전체 2단 시스템이 위상 지연 없이 안정됩니다.',
      },
      {
        id: 'P4D31-5',
        question: '실전 PID 수동 튜닝 시 오버슈트 없이 빠르게 수렴시키기 위한 권장 순서는?',
        options: [
          'I → D → P 순서',
          'P로 반응성 확보(I=0, D=0) → D로 진동/오버슈트 제동 → 마지막에 I로 미세 정상상태 오차 제거',
          '무작위 난수 대입',
          'D만 무한대로 먼저 올리기',
        ],
        correctIndex: 1,
        explanation: 'P로 뼈대를 잡고 D로 감쇄(댐핑)를 맞춘 뒤, 끝까지 남는 작은 마찰/중력 오차만 I로 조심스럽게 깎아냅니다.',
      },
    ],
  },
  {
    id: 'day32_trajectory',
    order: 32,
    dayLabel: 'Day 32',
    phaseLabel: 'Phase 4 · 센서/PID/필터',
    title: '궤적 생성 & Pure Pursuit 경로 추종',
    shortTitle: 'D32 · 궤적/Pure Pursuit',
    subtitle: '사다리꼴(Trapezoidal) 속도 프로파일 · 3차 스플라인 · 전방 주시 거리(L_d)',
    badge: '궤적/경로추종',
    milestoneTag: 'Day 32 궤적 & Pure Pursuit 랩',
    failFirstHook:
      '로봇에게 현재 위치 0°에서 목표 180°로 한 번에 점프 명령(Step Input)을 주면 가속도 무한대 요구로 기어 이빨이 나가며, Pure Pursuit에서 전방 주시 거리 L_d를 너무 짧게 잡으면 로봇이 뱀처럼 요동칩니다.',
    beginnerAnalogy:
      '사다리꼴 속도 프로파일은 엘리베이터처럼 부드럽게 출발(가속)-순항(등속)-정차(감속)하는 시간표이고, Pure Pursuit는 운전자가 10cm 앞 바닥이 아니라 전방 몇 미터 앞 커브길("당근")을 보며 핸들을 꺾는 원리입니다.',
    overviewSummary:
      '사다리꼴 속도 프로파일(최대 가속도 조절)이 순간이동 명령과 어떻게 다른지 궤적 그래프로 확인하고, Pure Pursuit 경로 추종에서 Lookahead 거리 L_d에 따라 차체가 진동(짧은 L_d)하거나 코너를 깎아먹는지(긴 L_d) 비교하세요.',
    guidedMissions: [
      {
        id: 'd32-profile',
        title: '속도 프로파일 모드에서 가속도(a_max)를 낮춰 부드러운 사다리꼴 S-커브 감속 확인하기',
        hint: '프로파일 모드에서 최대 가속도를 1.0~1.5 m/s² 수준으로 내려 부드러운 v(t) 곡선을 확인하세요.',
      },
      {
        id: 'd32-pursuit-short',
        title: 'Pure Pursuit 모드에서 전방 주시 거리 L_d를 너무 짧게(0.2m) 맞춰 뱀처럼 흔들림(진동) 체험하기',
        hint: '모드를 "Pure Pursuit"로 바꾸고 Lookahead 거리를 0.25m 이하로 내려 경로 주변 요동을 확인하세요.',
      },
      {
        id: 'd32-pursuit-good',
        title: 'Lookahead 거리 L_d를 적정 범위(0.55~0.85m)로 맞춰 웨이포인트 경로를 매끄럽게 추종하기',
        hint: 'Lookahead 거리를 0.6~0.8m 정도로 맞추어 안정적인 곡률 추종 경로를 완성하세요.',
      },
    ],
    highlights: [
      {
        title: '시간 매개 궤적(Trajectory) vs 기하 경로(Path)',
        body: '경로(Path)는 공간상 점들의 모임(어디로 가는가)이고, 궤적(Trajectory)은 거기에 시간 t와 속도/가속도 제약이 결합된 것(언제 얼마 속도로 가는가)입니다.',
        tone: 'cyan',
      },
      {
        title: '사다리꼴 속도 프로파일 & 3차 다항식 보간',
        body: '일정 가속(v 증가) → 등속 순항(v_max) → 일정 감속(v 감소)의 3단계로 목표를 쪼개 PID에 실시간 목표점으로 넣어주면 과전류나 스톨 없이 정밀하게 멈춥니다.',
        tone: 'emerald',
      },
      {
        title: 'Pure Pursuit 곡률 공식: κ = 2·sin(α) / L_d',
        body: '로봇 중심에서 반지름 L_d 원과 경로가 만나는 전방 주시점(Lookahead Point)까지의 각도 오차 α를 이용해 필요한 선회 곡률 κ = ω/v를 단 1줄로 계산합니다.',
        tone: 'amber',
      },
    ],
    formulas: [
      {
        title: 'Pure Pursuit 기하 추종 곡률 & 각속도 명령',
        latex: String.raw`\kappa = \frac{2 \sin\alpha}{L_d}, \qquad R = \frac{L_d}{2\sin\alpha}, \qquad \omega = v \cdot \kappa = \frac{2 v \sin\alpha}{L_d}`,
        description: 'α는 로봇 현재 정면 방향과 Lookahead 목표점 사이의 각도 오차입니다.',
      },
      {
        title: '3차 다항식 부드러운 위치 보간 (시작·끝 속도 0)',
        latex: String.raw`q(t) = q_0 + (q_f - q_0)\left(3\frac{t^2}{T^2} - 2\frac{t^3}{T^3}\right), \qquad \dot{q}(0)=\dot{q}(T)=0`,
        description: '부드러운 곡선 형태로 출발/도착 속도가 0이 되는 최소 차수 다항식입니다.',
      },
    ],
    specs: [
      { label: '짧은 L_d (<0.3m)', value: '높은 게인 · 경로 진동', note: '작은 오차에도 급핸들', tone: 'rose' },
      { label: '적정 L_d', value: '차체 길의 1.5~2.5배', note: '속도에 비례해 가변 확장', tone: 'emerald' },
      { label: '긴 L_d (>1.2m)', value: '코너 컷팅 (지름길)', note: '장애물 모서리 충돌 주의', tone: 'amber' },
      { label: '가속도 제한 a_max', value: '바퀴 마찰계수 이내', note: '슬립 없는 최대 가감속', tone: 'cyan' },
    ],
    wiringNotes: [
      {
        signal: '속도 비례 가변 Lookahead',
        pin: 'L_d = L_base + k_v * |v|',
        detail: '고속 주행할수록 더 멀리(L_d↑)를 봐야 전복이나 진동을 막고, 저속 정밀 주차 때는 짧게(L_d↓) 바짝 붙어 따라갑니다.',
      },
      {
        signal: '짧은 이동 거리에서의 삼각형 프로파일',
        pin: '최고 속도 v_max 도달 전 절반 지점에서 바로 감속 전환',
        detail: '목표 거리가 짧을 때는 등속 구간 없이 가속→즉시 감속의 삼각형 프로파일로 자동 전환해야 목표점을 지나치지 않습니다.',
      },
    ],
    codeTitle: 'day32_pure_pursuit.cpp',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 32: Pure Pursuit 곡률 기반 차동 구동 조향 각속도 계산
float computePurePursuitOmega(float rx, float ry, float rTheta,
                              float lookX, float lookY,
                              float linearV, float lookaheadLd) {
  float dx = lookX - rx;
  float dy = lookY - ry;
  float alpha = atan2f(dy, dx) - rTheta; // 로봇 헤딩 기준 목표 편차각
  // 각도 정규화 [-PI, PI]
  while (alpha > PI) alpha -= 2.0f * PI;
  while (alpha < -PI) alpha += 2.0f * PI;

  float curvature = (2.0f * sinf(alpha)) / fmaxf(lookaheadLd, 0.1f);
  return linearV * curvature; // ω = v * κ
}`,
    codeChallenge: {
      prompt: 'Pure Pursuit 곡률 공식에서 전방 주시 거리 L_d를 절반으로 줄이면 로봇의 반응은 어떻게 바뀔까요?',
      buggyLine: 'float omega = (2.0f * v * sinf(alpha)) * Ld; // Ld가 분자에 잘못 곱해짐!',
      options: [
        'float omega = (2.0f * v * sinf(alpha)) / Ld; // L_d가 줄수록 조향 각속도가 커져 경로에 바짝 붙고 진동 위험이 커진다',
        'L_d가 줄수록 코너를 더 크게 안쪽으로 잘라 먹는다',
        '회전 각속도 ω는 L_d와 무관하다',
      ],
      correctIndex: 0,
      explanation: '곡률 κ = 2·sin(α) / L_d 에서 L_d가 분모에 있으므로 거리가 짧을수록 급격하게 핸들을 꺾어 경로에 바짝 붙거나 발진합니다.',
    },
    quizzes: [
      {
        id: 'P4D32-1',
        question: '로봇 제어에서 "경로(Path)"와 "궤적(Trajectory)"의 가장 정확한 차이점은?',
        options: [
          '둘은 완전히 같은 말이다',
          '경로는 순수 공간 좌표의 연속이고, 궤적은 경로에 시간 t·속도·가속도 시간표가 부여된 것이다',
          '경로는 3D이고 궤적은 1D다',
          '궤적은 정지 상태만 뜻한다',
        ],
        correctIndex: 1,
        explanation: 'Trajectory = Path + Time schedule (v(t), a(t) 물리 제약 포함)입니다.',
      },
      {
        id: 'P4D32-2',
        question: 'Pure Pursuit 알고리즘에서 전방 주시 거리(Lookahead Distance L_d)를 너무 길게 설정하면 생기는 현상은?',
        options: [
          '급격한 고주파 지그재그 진동이 발생한다',
          '급커브 코너 안쪽을 크게 가로지르는 코너 컷팅(Corner Cutting)으로 모서리에 부딪힐 수 있다',
          '그 자리에 멈춘다',
          '후진만 한다',
        ],
        correctIndex: 1,
        explanation: '멀리 있는 점만 쳐다보고 회전 반경을 크게 잡으므로 중간 꺾임 지점을 건너뛰어 안쪽으로 질러갑니다.',
      },
      {
        id: 'P4D32-3',
        question: '반대로 Lookahead 거리 L_d를 너무 짧게 잡았을 때 나타나는 부작용은?',
        options: [
          '코너를 못 돈다',
          '작은 위치 오차에도 조향 각속도 ω = 2v·sin(α)/L_d가 너무 민감해져 경로 좌우로 흔들리며 진동한다',
          '속도가 0이 된다',
          '모터 전류가 줄어든다',
        ],
        correctIndex: 1,
        explanation: 'L_d가 분모에 있어 값이 작을수록 비례 게인이 급증하는 효과가 나서 경로 주변에서 오버슈트 진동합니다.',
      },
      {
        id: 'P4D32-4',
        question: '사다리꼴 속도 프로파일에서 가속도 a_max와 감속도 제한을 두고 목표 각도까지 보간할 때의 핵심 장점은?',
        options: [
          'PID 제어기의 갑작스러운 초기 오차 점프를 없애 서보 기어 충격·슬립·전류 스파이크를 막는다',
          '최종 목적지를 바꾼다',
          '센서를 꺼도 된다',
          '평균 속도를 0으로 만든다',
        ],
        correctIndex: 0,
        explanation: '물리적으로 가능한 가속 한계 내의 이동 목표를 매 루프 공급하므로 부드러운 추종이 가능합니다.',
      },
      {
        id: 'P4D32-5',
        question: '로봇이 전방 주시 목표점을 기준으로 왼쪽 30°(sin 30° = 0.5) 방향을 향해 v = 1.0 m/s, L_d = 0.5 m 로 추종할 때 목표 각속도 ω는?',
        options: ['0.5 rad/s', '1.0 rad/s', '2.0 rad/s', '4.0 rad/s'],
        correctIndex: 2,
        explanation: 'ω = 2 · v · sin(α) / L_d = 2 · 1.0 · 0.5 / 0.5 = 2.0 rad/s입니다.',
      },
    ],
  },
  {
    id: 'day33_kalman',
    order: 33,
    dayLabel: 'Day 33',
    phaseLabel: 'Phase 4 · 센서/PID/필터',
    title: '칼만 필터(Kalman Filter) & 비선형 EKF 직관',
    shortTitle: 'D33 · 칼만필터/EKF',
    subtitle: '예측(Predict) + 보정(Update) · 프로세스 Q vs 측정 R · 동적 칼만 이득 K',
    badge: '상태 추정',
    milestoneTag: 'Day 33 칼만/EKF 가우시안 랩',
    failFirstHook:
      '상보 필터는 γ=0.98을 사람이 고정해야 하므로, 바퀴가 미끄러운 빙판에 올라가거나 센서 노이즈가 변할 때 최적의 추정을 못 하고 틀어집니다.',
    beginnerAnalogy:
      '칼만 필터는 "내 발걸음 예측(불확실한 구름)"과 "GPS/초음파 관측(노이즈 섞인 구름)" 두 확률 분포를 수학적으로 곱해, 매 순간 더 믿을 만한 쪽에 자동으로 큰 표(칼만 이득 K)를 던져 훨씬 뾰족하고 확실한 위치를 뽑아내는 중재자입니다.',
    overviewSummary:
      '프로세스(운동 모델) 불확실성 Q와 센서 측정 노이즈 R을 조절하면서 예측(Predict) 가우시안과 관측(Update) 가우시안이 결합될 때 칼만 이득 K = P/(P+R)와 사후 분산이 어떻게 변하는지 시각화 그래프에서 실험하세요.',
    guidedMissions: [
      {
        id: 'd33-trust-sensor',
        title: '측정 노이즈 R을 작게, 모델 노이즈 Q를 크게 두어 칼만 이득 K > 0.7 (센서 신뢰) 만들기',
        hint: 'Q를 1.5 이상으로 올리고 R을 0.4 이하로 낮추어 사후 분포가 관측값 쪽으로 바짝 붙는지 보세요.',
      },
      {
        id: 'd33-trust-model',
        title: '측정 노이즈 R을 크게(센서 불신), Q를 작게 두어 칼만 이득 K < 0.3 (예측 신뢰) 만들기',
        hint: 'R을 2.0 이상으로 높이고 Q를 0.3 이하로 낮추어 시끄러운 센서를 무시하고 모델을 믿는 모습을 보세요.',
      },
      {
        id: 'd33-code',
        title: '1차원 칼만 이득 & 공분산 업데이트 코드 챌린지 풀기',
        hint: '코드 탭의 칼만 필터 업데이트 버그 수정 챌린지를 풀어보세요.',
      },
    ],
    highlights: [
      {
        title: '2단계 순환 루프: 예측(Predict) ↔ 보정(Update)',
        body: '예측 단계에서는 운동 모델로 다음 위치와 커진 불확실성(P + Q)을 계산하고, 보정 단계에서는 센서 z를 반영해 오차 공분산을 (1 - K)P로 줄입니다.',
        tone: 'cyan',
      },
      {
        title: '칼만 이득 K의 자동 중재 (0 ≤ K ≤ 1)',
        body: 'K = P_pred / (P_pred + R). 센서가 아주 정밀해 측정 노이즈 R → 0이면 K → 1이 되어 센서 값을 그대로 따르고, 센서가 극도로 시끄러워 R → ∞이면 K → 0이 되어 물리 예측 모델을 신뢰합니다.',
        tone: 'emerald',
      },
      {
        title: '확장 칼만 필터(EKF)는 비선형 cos/sin 모델을 야코비안으로 선형화',
        body: '선형 칼만 필터는 직선 행렬만 다루므로 x + v·cos(θ)처럼 비선형 삼각함수가 들어간 모바일 로봇(robot_localization)에는 현재 추정값 주변 접선(야코비안 H, F)을 구하는 EKF를 씁니다.',
        tone: 'amber',
      },
    ],
    formulas: [
      {
        title: '1D 칼만 필터 5대 방정식 (Predict & Update)',
        latex: String.raw`\text{Predict: } P^- = P + Q \qquad \text{Gain: } K = \frac{P^-}{P^- + R} \qquad \text{Update: } \hat{x} = \hat{x}^- + K(z - \hat{x}^-),\; P = (1-K)P^-`,
        description: 'Q(Process Noise)가 크면 모델 불신이 커져 K가 올라가고, R(Measurement Noise)이 크면 K가 내려갑니다.',
      },
      {
        title: '확장 칼만 필터(EKF) 공분산 전파',
        latex: String.raw`P_k^- = F_k P_{k-1} F_k^T + Q_k, \qquad F_k = \left.\frac{\partial f}{\partial x}\right|_{\hat{x}_{k-1}}`,
        description: '야코비안 행렬 F_k가 비선형 함수를 국소 선형 근사하여 가우시안 타원을 다음 스텝으로 전달합니다.',
      },
    ],
    specs: [
      { label: '예측 시 분산', value: 'P⁻ = P + Q (커짐)', note: '움직일수록 불확실성 증가', tone: 'amber' },
      { label: '보정 시 분산', value: 'P = (1-K)P⁻ (작아짐)', note: '관측 후 더 정확해짐', tone: 'emerald' },
      { label: '칼만 이득 (K→1)', value: 'R ≪ P⁻ (정밀 센서)', note: '관측 z 위주로 업데이트', tone: 'cyan' },
      { label: 'ROS 2 EKF 표준', value: 'robot_localization', note: 'Wheel Odom + IMU 융합', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: 'Q / R 튜닝의 물리적 감각',
        pin: '정지 상태에서 센서 분산 측정 = R, 1스텝 오도메트리 오차² ≈ Q',
        detail: '센서를 책상에 가만히 두고 측정한 표준편차 σ의 제곱(σ²)을 R에 넣으면 이론적으로 정확한 측정 잡음 행렬을 얻습니다.',
      },
      {
        signal: '이상치(Outlier) 거부 게이팅',
        pin: '마할라노비스 거리 검사 (Innovation Gating)',
        detail: '초음파나 LiDAR가 순간적으로 엉뚱한 값을 뱉을 때 잔차(z - x̂⁻)가 3σ를 넘기면 업데이트를 건너뛰어 필터 붕괴를 막습니다.',
      },
    ],
    codeTitle: 'day33_1d_kalman.cpp',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 33: 실시간 1D 칼만 필터 (Predict + Update)
struct Kalman1D {
  float x = 0.0f; // 추정 상태
  float P = 1.0f; // 추정 오차 공분산(불확실성)

  float step(float u_delta, float z_meas, float Q, float R) {
    // 1. Predict (모델 예측)
    x += u_delta;
    P += Q;

    // 2. Update (칼만 이득 & 관측 보정)
    float K = P / (P + R);
    x = x + K * (z_meas - x);
    P = (1.0f - K) * P;
    return x;
  }
};`,
    codeChallenge: {
      prompt: '관측 보정을 마친 뒤 추정 상태 x를 더 확신하게 되었으므로 불확실성 공분산 P를 줄여주어야 합니다. 올바른 업데이트 식은?',
      buggyLine: 'P = (1.0f + K) * P; // 보정 후 불확실성이 오히려 더 커짐!',
      options: [
        'P = (1.0f - K) * P;',
        'P = P / (1.0f - K);',
        'P = R + Q;',
      ],
      correctIndex: 0,
      explanation: '관측 정보를 융합하면 불확실성이 줄어들므로 0 ≤ K ≤ 1에 대해 (1 - K)P만큼 공분산이 축소됩니다.',
    },
    quizzes: [
      {
        id: 'P4D33-1',
        question: '칼만 필터의 두 단계 중 오차 공분산(불확실성 P)이 커지는 단계와 다시 작아지는 단계를 올바르게 짝지은 것은?',
        options: [
          '예측(Predict)에서 커지고(+Q), 관측 보정(Update)에서 작아진다((1-K)P)',
          '예측에서 작아지고 보정에서 커진다',
          '두 단계 모두 계속 작아지기만 한다',
          '공분산은 변하지 않는 상수다',
        ],
        correctIndex: 0,
        explanation: '이동을 예측하면 누적 오차(Q) 때문에 구름이 퍼지고, 센서 관측을 얻으면 구름이 다시 좁아집니다.',
      },
      {
        id: 'P4D33-2',
        question: '초음파 센서의 측정 노이즈 공분산 R이 갑자기 100배 폭증(R ≫ P⁻)했을 때 칼만 이득 K와 업데이트 거동은?',
        options: [
          'K → 1이 되어 노이즈 투성이 센서 값을 100% 믿는다',
          'K → 0에 가까워져 시끄러운 센서 값을 거의 무시하고 예측 모델(x̂⁻)을 유지한다',
          'K = 0.5로 고정된다',
          '필터가 꺼진다',
        ],
        correctIndex: 1,
        explanation: 'K = P⁻ / (P⁻ + R) 에서 분모 R이 매우 크면 K ≈ 0이 되어 자동으로 센서 의존도를 줄입니다.',
      },
      {
        id: 'P4D33-3',
        question: '두 독립적인 가우시안 확률 분포(예측과 관측)를 곱해 사후 분포를 구했을 때의 수학적 특징은?',
        options: [
          '항상 원래의 두 분포 각각보다 분산이 더 작고 뾰족한 새 가우시안 분포가 된다',
          '분산이 두 분포의 합으로 커진다',
          '무조건 균등 분포가 된다',
          '평균이 항상 0이 된다',
        ],
        correctIndex: 0,
        explanation: '두 독립 정보를 결합할수록 정보량이 늘어나므로 사후 분산 σ_fused² = (σ₁²σ₂²)/(σ₁²+σ₂²) < min(σ₁², σ₂²)이 됩니다.',
      },
      {
        id: 'P4D33-4',
        question: '실제 차동 구동 로버(ẋ = v·cosθ, ẏ = v·sinθ)에 기본 칼만 필터 대신 확장 칼만 필터(EKF)를 쓰는 이유는?',
        options: [
          'cosθ, sinθ 같은 비선형 함수를 매 스텝 야코비안 편미분 행렬로 선형 근사해야 하므로',
          '정수만 계산하려고',
          '예측 단계를 없애려고',
          'IMU가 필요 없으므로',
        ],
        correctIndex: 0,
        explanation: '가우시안 분포는 선형 변환을 거쳐야만 가우시안으로 유지되므로, 비선형 운동/관측 식에는 1차 테일러 선형화(EKF)가 필요합니다.',
      },
      {
        id: 'P4D33-5',
        question: '칼만 필터 업데이트 식 x̂ = x̂⁻ + K·(z - x̂⁻) 에서 괄호 안 (z - x̂⁻)을 일컫는 용어와 의미는?',
        options: [
          '이노베이션(Innovation / 측정 잔차) — 예측이 얼마나 빗나갔는지를 나타내는 새로운 정보량',
          '적분 와인드업',
          '특이점 행렬식',
          '바퀴 슬립 계수',
        ],
        correctIndex: 0,
        explanation: '실제 측정 z와 내 예측 x̂⁻의 차이를 Innovation(또는 Residual)이라 하며 여기에 이득 K를 곱해 오차를 고칩니다.',
      },
    ],
  },
  {
    id: 'day34_fusion_project',
    order: 34,
    dayLabel: 'Day 34',
    phaseLabel: 'Phase 4 · 센서/PID/필터',
    title: '[Phase 4 미니 프로젝트] 오도메트리+IMU 직진 보정 로버',
    shortTitle: 'D34 · 직진 보정 로버',
    subtitle: '좌/우 모터 편차 극복 · 엔코더 속도 PID + IMU 요(Yaw) 헤딩 보정 루프',
    badge: 'Phase 4 프로젝트',
    milestoneTag: 'Day 34 직진 주행 퓨전 랩',
    failFirstHook:
      '스펙이 같은 TT 기어드 모터 두 개를 사서 좌·우에 똑같은 PWM 70%를 넣어도, 내부 기어 마찰 차이 때문에 실제로는 로버가 3m만 가도 오른쪽 벽에 처박힙니다.',
    beginnerAnalogy:
      '두 눈을 감고 두 발에 똑같은 힘만 주고 걸으면 한쪽으로 휘어지지만, 엔코더로 양다리 보폭(속도 PID)을 맞추고 귓속 전정기관(IMU Yaw 보정)으로 정면 중심을 잡으면 자를 댄 듯 일직선으로 달릴 수 있습니다.',
    overviewSummary:
      '좌우 모터 하드웨어 편차(%)가 존재하는 로버에서 1) 개루프 동일 PWM 주행의 휨 사고, 2) 좌/우 엔코더 속도 PID 루프, 3) IMU Yaw 헤딩 보정 루프까지 단계별로 켜며 3.0m 직진 궤적 정밀도를 검증하세요.',
    guidedMissions: [
      {
        id: 'd34-openloop',
        title: '엔코더 PID OFF · IMU 보정 OFF 상태에서 좌우 모터 편차로 인한 경로 휨 확인하기',
        hint: '모터 편차를 10% 이상으로 두고 두 제어 루프를 모두 OFF 해 붉은 궤적 편향을 보세요.',
      },
      {
        id: 'd34-enc',
        title: '좌/우 엔코더 속도 PID만 ON 상태로 켜서 기어 마찰 차이를 줄이는 모습 비교하기',
        hint: '엔코더 속도 PID 버튼을 ON으로 전환해 주황색 궤적 개선을 확인하세요.',
      },
      {
        id: 'd34-imu',
        title: '엔코더 PID + IMU Yaw 보정까지 모두 ON 해 목표선 3m 일직선 완주(±2cm 이내) 달성하기',
        hint: '엔코더 PID와 IMU 헤딩 보정을 모두 ON 상태로 켜서 자처럼 반듯한 초록 직선을 만드세요.',
      },
    ],
    highlights: [
      {
        title: '개루프(Open-loop) PWM 주행이 항상 휘는 물리적 이유',
        body: '저가 DC 모터들은 권선 저항, 자석 세기, 플라스틱 기어 마찰이 5~15%씩 차이 나고 바닥 마찰도 위치마다 달라, 피드백 없이는 절대 직진하지 못합니다.',
        tone: 'rose',
      },
      {
        title: '이중 퓨전 아키텍처: 내부 속도 PID + 외부 IMU 헤딩 보정',
        body: '각 바퀴 엔코더 PID가 좌우 바퀴 RPM을 1차로 일치시키고, 바깥 루프에서는 IMU 자이로+상보 필터로 잰 Yaw 각도 오차(θ_err)로 좌우 목표 속도를 Δv만큼 비틀어(±K_yaw·θ_err) 방향을 완벽히 0°로 유지합니다.',
        tone: 'emerald',
      },
      {
        title: '목표 거리 앞 사다리꼴 감속 + 오도메트리 완주',
        body: '3.0m 지점에 가까워지면 엔코더 평균 거리 기준으로 목표 속도를 서서히 0까지 줄여 미끄러짐(Overrun) 없이 멈춥니다.',
        tone: 'cyan',
      },
    ],
    formulas: [
      {
        title: 'IMU 헤딩 보정 기반 차동 목표 속도 분배',
        latex: String.raw`\Delta v_{\text{steer}} = K_{p,\text{yaw}} (0 - \theta_{\text{IMU}}) - K_{d,\text{yaw}}\,\omega_z, \qquad v_{L,\text{ref}} = v_{\text{base}} - \Delta v_{\text{steer}}, \quad v_{R,\text{ref}} = v_{\text{base}} + \Delta v_{\text{steer}}`,
        description: '로봇이 오른쪽(θ < 0)으로 휘면 Δv_steer > 0이 되어 왼쪽을 줄이고 오른쪽을 높여 다시 0°로 복귀합니다.',
      },
      {
        title: '종료 직전 사다리꼴 거리 감속 법칙',
        latex: String.raw`v_{\text{base}}(d_{\text{rem}}) = \min\!\left(v_{\max},\; \sqrt{2 a_{\max}\, d_{\text{rem}}}\right)`,
        description: '남은 거리 d_rem에 비례한 제동 곡선으로 목표 거리 3.00m에 미끄러지지 않고 정차합니다.',
      },
    ],
    specs: [
      { label: '개루프 오차 (10% 편차)', value: '> 45 cm 횡편차', note: '3m 직진 시 벽 충돌', tone: 'rose' },
      { label: '엔코더 PID 단독', value: '~ 6 ~ 10 cm 오차', note: '슬립·지름 편차 남음', tone: 'amber' },
      { label: '엔코더 + IMU 퓨전', value: '< ±1.5 cm 편차', note: '자처럼 반듯한 직진', tone: 'emerald' },
      { label: '제어 루프 주기', value: '50 ~ 100 Hz 고정', note: 'FreeRTOS Core 1 실행', tone: 'cyan' },
    ],
    wiringNotes: [
      {
        signal: 'IMU Z축 부호와 바퀴 조향 부호 맞추기 (제일 중요!)',
        pin: '손으로 로버를 반시계(+) 돌렸을 때 θ_IMU가 + 증가하는지 먼저 확인',
        detail: '보정 부호가 반대로 들어가면 직진하던 로봇이 제자리 팽이처럼 무한 회전(Positive Feedback 폭주)합니다.',
      },
      {
        signal: '시작 1초 정지 후 주행 원칙',
        pin: 'setup()에서 IMU 영점 평균 계산 후 출발',
        detail: '달리는 도중이 아니라 반드시 정지 바닥에서 바이어스를 0으로 맞추고 나서 출발 신호를 줍니다.',
      },
    ],
    codeTitle: 'day34_straight_fusion_rover.cpp',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 34: Phase 4 캡스톤 — 엔코더 속도 PID + IMU Yaw 직진 보정
void controlStraightLoop(float targetDistM, float dt) {
  float dRem = targetDistM - odomDistM;
  if (dRem <= 0.01f) { setMotorPWM(0, 0); return; }

  float vBase = fminf(0.6f, sqrtf(2.0f * 0.8f * dRem)); // 사다리꼴 감속
  float yawErr = 0.0f - imuYawRad; // 목표 헤딩 0 rad 유지
  float steerDv = Kp_yaw * yawErr - Kd_yaw * imuGyroZ;

  float vL_ref = vBase - steerDv;
  float vR_ref = vBase + steerDv;
  setMotorPWM(pidWheelL.step(vL_ref, encVelL, dt),
              pidWheelR.step(vR_ref, encVelR, dt));
}`,
    codeChallenge: {
      prompt: '로버가 오른쪽(시계 방향, θ_IMU < 0)으로 휘었을 때 다시 0°로 바로잡기 위한 좌/우 목표 속도 수정은?',
      buggyLine: 'float steerDv = Kp_yaw * (0.0f - imuYawRad); vL_ref = vBase + steerDv; vR_ref = vBase - steerDv;',
      options: [
        'vL_ref = vBase - steerDv; vR_ref = vBase + steerDv; // 오른쪽 바퀴를 더 빨리 돌려 반시계(+)로 복귀!',
        'vL_ref = vBase * 2.0f; vR_ref = 0.0f;',
        'steerDv를 0으로 고정한다',
      ],
      correctIndex: 0,
      explanation: '오른쪽(음각)으로 치우치면 반시계(+) 회전 토크가 필요하므로 오른쪽 바퀴 vR을 높이고 왼쪽 바퀴 vL을 낮춰야 복귀합니다.',
    },
    quizzes: [
      {
        id: 'P4D34-1',
        question: '똑같은 PWM 70% 듀티를 좌우 바퀴에 주었을 때(개루프) 로버가 한쪽으로 휘어지는 주된 이유는?',
        options: [
          '모터 코일, 기어 마찰, 바닥 노면, 좌우 타이어 마모의 미세한 비대칭 때문에 실제 회전 속도가 다르므로',
          '지구의 자전 때문에',
          'Wi-Fi 전파가 한쪽으로 치우쳐서',
          'PWM 주파수가 1kHz라서',
        ],
        correctIndex: 0,
        explanation: '동일한 전압/PWM 입력에도 양쪽 동력 계통의 물리 편차로 인해 실제 출력 RPM 차이가 발생합니다.',
      },
      {
        id: 'P4D34-2',
        question: '좌/우 엔코더 속도 PID만으로 완벽히 동일한 바퀴 틱(Ticks)을 맞추어도 장거리에서 여전히 미세하게 휘는 이유는?',
        options: [
          '엔코더는 바퀴 축 회전만 셀 뿐, 바닥 슬립이나 좌우 타이어 반경 0.5mm 차이는 보지 못하므로',
          '엔코더가 거꾸로 돌아서',
          'PID가 D항이 없어서',
          '전압이 3.3V라서',
        ],
        correctIndex: 0,
        explanation: '바퀴 자체 오차와 바닥 슬립은 바퀴 내부 센서(엔코더)로는 알 수 없고, 차체 관성 변화를 재는 IMU가 있어야 교정됩니다.',
      },
      {
        id: 'P4D34-3',
        question: 'IMU 헤딩 보정 루프를 켰더니 로봇이 직진하지 않고 제자리에서 팽이처럼 엄청난 속도로 빙글빙글 도는 사고의 1순위 원인은?',
        options: [
          'IMU Yaw 부호(또는 자이로 축)와 좌우 바퀴 보정 부호가 반대로 연결되어 양의 피드백(Positive Feedback) 폭주가 일어남',
          '배터리가 만충이라서',
          '타이어 공기압이 낮아서',
          'LED가 켜져 있어서',
        ],
        correctIndex: 0,
        explanation: '오차가 커질수록 오히려 오차를 키우는 방향으로 바퀴를 돌리는 부호 반전 버그가 1순위 원인입니다.',
      },
      {
        id: 'P4D34-4',
        question: '목표 거리 3.0m 직전 10cm 구간에서 v_base = min(v_max, √(2·a·d_rem)) 감속 식을 쓰는 이유는?',
        options: [
          '급제동 시 타이어가 바닥에서 미끄러지지 않고 목표 지점에 정확히 정지하도록 등감속 속도를 계산하므로',
          '배터리를 충전하려고',
          '최고 속도를 2배 높이려고',
          'IMU를 끄려고',
        ],
        correctIndex: 0,
        explanation: '운동학 공식 v² = 2ad를 역으로 적용하면 현재 남은 거리 d_rem에 맞춰 일정 감속도로 부드럽게 0에 멈춥니다.',
      },
      {
        id: 'P4D34-5',
        question: '직진 보정 로버의 외부 IMU 헤딩 PID와 내부 좌우 엔코더 속도 PID 중 더 높은 주기(예: 100~200Hz)로 실행하는 것이 좋은 쪽은?',
        options: [
          '내부 바퀴 속도 PID가 외부 헤딩 루프보다 빠르거나 동등하게 돌아야 외란을 즉각 억제한다',
          '외부 루프만 1kHz, 내부 루프는 1Hz',
          '둘 다 10초에 1번',
          '상관없다',
        ],
        correctIndex: 0,
        explanation: '내부 액추에이터 속도 루프가 빠르게 목표 RPM을 따라주어야 바깥 헤딩 제어기가 안정적으로 작동합니다.',
      },
    ],
  },
];
