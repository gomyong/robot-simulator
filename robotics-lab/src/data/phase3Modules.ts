import { LabModule } from '../types/lab';

export const PHASE3_MODULES: LabModule[] = [
  {
    id: 'day17_math',
    order: 17,
    dayLabel: 'Day 17',
    phaseLabel: 'Phase 3 · 수학/기구학',
    title: '로보틱스 수학 워밍업: 라디안 · atan2 · 벡터',
    shortTitle: 'D17 · atan2/벡터',
    subtitle: 'rad vs deg 변환 · atan(y/x) 사분면 함정 · 내적 투영 & 외적 토크',
    badge: '수학 기초',
    milestoneTag: 'Day 17 수학/벡터 실험실',
    failFirstHook:
      'C/Python의 sin(90)에 도(deg)를 넣거나 일반 atan(y/x)으로 목표 좌표를 향한 각도를 구하면, 2·3사분면에서 로봇 팔이 180° 정반대로 꺾이며 기구물을 파손합니다.',
    beginnerAnalogy:
      '라디안은 반지름 길이만큼 원 둘레를 걸어간 각도(π rad = 180°)이고, atan2(y, x)는 y와 x의 부호를 모두 기억해 동서남북 어느 사분면인지 360° 전 범위를 헷갈리지 않고 찾아주는 나침반입니다.',
    overviewSummary:
      '로봇 제어 코드의 90%는 삼각함수와 벡터 연산입니다. (-4, -4) 좌표에서 일반 atan()과 atan2()가 얼마나 다른 방향을 가리키는지 직접 비교하고, 두 벡터의 사이각에 따른 내적(일/유사도)과 외적(회전 방향/토크) 변화를 확인하세요.',
    guidedMissions: [
      {
        id: 'd17-atan2',
        title: '3사분면(-x, -y) 목표점에서 atan2(y, x)와 일반 atan 비교하기',
        hint: '목표점 x, y를 둘 다 음수로 두고 atan → atan2 스위치를 눌러 180° 차이를 확인하세요.',
      },
      {
        id: 'd17-vec',
        title: '벡터 연산 모드에서 사이각을 90°로 맞춰 내적=0, 외적 최대 확인하기',
        hint: '모드를 "벡터 내적/외적"으로 바꾸고 사이각을 90°로 조절해 보세요.',
      },
      {
        id: 'd17-code',
        title: '도(deg)→라디안(rad) 변환 버그 코드 챌린지 해결하기',
        hint: '코드 탭 하단의 "버그 수정 챌린지"를 풀어보세요.',
      },
    ],
    highlights: [
      {
        title: 'C++/Python 삼각함수의 기본 단위는 무조건 라디안(rad)',
        body: 'sin(), cos(), atan2()는 도(°)가 아니라 라디안을 입력받고 반환합니다. 서보에 write() 하기 직전에 반드시 rad * (180.0 / PI)로 변환해야 합니다.',
        tone: 'cyan',
      },
      {
        title: 'atan(y/x) vs atan2(y, x) 4분면 보존',
        body: '일반 atan(y/x)은 (-4)/(-4)와 (+4)/(+4)가 모두 +1이므로 항상 +45°만 돌려주고 x=0일 때 ZeroDivisionError를 냅니다. 로보틱스에서는 예외 없이 atan2(y, x)를 씁니다.',
        tone: 'emerald',
      },
      {
        title: '내적(Dot)은 같은 방향 정렬도, 외적(Cross)은 회전축 방향',
        body: '목표점까지의 벡터와 현재 주행 방향 벡터를 내적(cos θ)하면 전진 정렬 정도를 얻고, 외적(sin θ)의 부호(+/-)를 보면 좌회전/우회전 어느 쪽으로 돌아야 빠른지 즉시 판별합니다.',
        tone: 'amber',
      },
    ],
    formulas: [
      {
        title: '라디안 ↔ 도(Degree) 상호 변환',
        latex: String.raw`\theta_{\text{rad}} = \theta_{\text{deg}} \cdot \frac{\pi}{180}, \qquad \theta_{\text{deg}} = \theta_{\text{rad}} \cdot \frac{180}{\pi}`,
        description: '1 rad ≈ 57.2958°, π rad = 180°, 2π rad = 360°입니다.',
      },
      {
        title: '2D 벡터 내적과 외적(Z성분)',
        latex: String.raw`\mathbf{a}\cdot\mathbf{b} = |a||b|\cos\theta, \qquad (\mathbf{a}\times\mathbf{b})_z = a_x b_y - a_y b_x = |a||b|\sin\theta`,
        description: '외적의 부호(+)는 반시계 방향(CCW) 회전, (-)는 시계 방향(CW) 회전을 뜻합니다.',
      },
    ],
    specs: [
      { label: 'atan 치역', value: '-90° ~ +90°', note: '2·3사분면 구별 불가', tone: 'rose' },
      { label: 'atan2 치역', value: '-180° ~ +180°', note: 'x=0도 안전 처리', tone: 'emerald' },
      { label: '1 라디안', value: '57.2958°', note: '180 / π', tone: 'cyan' },
      { label: '90° 내적/외적', value: 'dot=0, |cross|=max', note: '최대 수직 토크 조건', tone: 'amber' },
    ],
    wiringNotes: [
      {
        signal: '로봇 좌표계 관례 (REP-103)',
        pin: '+X 전방 · +Y 좌측 · +Z 상방 (오른손 법칙)',
        detail: 'ROS와 대부분의 로보틱스 수학은 반시계 방향 회전을 양의 각도(+Yaw)로 정의합니다.',
      },
      {
        signal: '라디안-서보 각도 브리지',
        pin: 'float deg = rad * RAD_TO_DEG;',
        detail: '기구학 계산 전체는 라디안으로 유지하고, 마지막 액추에이터 출력 함수 직전 1회만 도(°)로 변환합니다.',
        warning: 'sin(angle_deg)처럼 도 단위를 직접 넣으면 엉뚱한 주기 값이 나옵니다.',
      },
    ],
    codeTitle: 'day17_heading_atan2.ino',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 17: 목표 좌표 (tx, ty)를 향한 방위각 & 조향 오차 계산
#include <Arduino.h>

float computeTargetAngleDeg(float tx, float ty) {
  // x=0일 때도 안전하며 4사분면을 모두 구별하는 atan2 사용
  float rad = atan2f(ty, tx);
  return rad * (180.0f / PI);
}

void loop() {
  float robotHeadingDeg = 180.0f;
  // cos(180도)를 구하려면 반드시 라디안으로 변환해야 함!
  float hx = cosf(robotHeadingDeg * PI / 180.0f);
  float hy = sinf(robotHeadingDeg * PI / 180.0f);

  float tx = -4.0f, ty = -4.0f; // 3사분면 목표
  float angleDeg = computeTargetAngleDeg(tx, ty); // -135.0도 반환
  // 외적 Z성분 = hx*ty - hy*tx 로 좌/우회전 판별
}`,
    codeChallenge: {
      prompt: '서보 각도(deg)를 이용해 엔드이펙터 x좌표를 계산할 때 숨겨진 치명적 버그를 고치세요.',
      buggyLine: 'float x = L1 * cosf(theta1Deg);',
      options: [
        'float x = L1 * cosf(theta1Deg * PI / 180.0f);',
        'float x = L1 * cosf(theta1Deg * 180.0f / PI);',
        'float x = L1 * atan(theta1Deg);',
      ],
      correctIndex: 0,
      explanation: 'C++ 표준 삼각함수 cosf()는 라디안을 기대하므로 도(deg)에 PI/180을 곱해야 합니다.',
    },
    quizzes: [
      {
        id: 'P3D17-1',
        question: '목표 좌표가 x = -5, y = -5 (3사분면)일 때 atan(y/x)와 atan2(y, x)의 반환 각도 차이는?',
        options: [
          '둘 다 -135°를 반환한다',
          'atan은 +45°, atan2는 -135°를 반환해 180° 정반대 방향이 된다',
          'atan은 0 나누기 오류를 발생시킨다',
          '둘 다 -45°를 반환한다',
        ],
        correctIndex: 1,
        explanation: '(-5)/(-5) = +1이므로 일반 atan(+1)은 1사분면(+45°)과 구분하지 못해 정반대(+45°)를 돌려줍니다.',
      },
      {
        id: 'P3D17-2',
        question: '두 단위 벡터 a, b가 서로 직각(90°)을 이룰 때 내적(a·b)과 외적 크기(|a×b|)의 값은?',
        options: ['a·b = 1, |a×b| = 0', 'a·b = 0, |a×b| = 1', 'a·b = -1, |a×b| = 1', '둘 다 0.5'],
        correctIndex: 1,
        explanation: 'cos(90°)=0이므로 내적은 0, sin(90°)=1이므로 외적 크기는 최대인 1이 됩니다.',
      },
      {
        id: 'P3D17-3',
        question: '로봇 전방 단위 벡터 h와 목표 방향 벡터 t의 외적 Z성분 (h_x t_y - h_y t_x)이 음수(-)일 때 의미는?',
        options: [
          '목표가 로봇 바로 앞에 있다',
          '목표가 로봇 오른쪽에 있어 시계 방향(우회전)해야 가장 빠르다',
          '목표가 정확히 180° 뒤편에 있다',
          '센서 데이터 통신이 끊겼다',
        ],
        correctIndex: 1,
        explanation: '오른손 법칙 기준으로 반시계(+)가 좌회전, 음수(-)가 시계 방향(우회전) 최단 회전 방향입니다.',
      },
      {
        id: 'P3D17-4',
        question: '각도 60°를 라디안(rad)으로 정확히 바꾼 값은?',
        options: ['π/2 rad', 'π/3 rad', 'π/4 rad', 'π/6 rad'],
        correctIndex: 1,
        explanation: '60° × (π / 180°) = π/3 ≈ 1.0472 rad입니다.',
      },
      {
        id: 'P3D17-5',
        question: '일반 atan(y/x)을 로봇 펌웨어에서 금지하고 atan2f(y, x)를 권장하는 또 다른 기술적 이유는?',
        options: [
          'x = 0 (목표가 정확히 ±90° 방향)일 때 발생하는 0 나누기(Division by Zero)를 안전하게 처리하므로',
          'atan2f가 정수만 반환하므로',
          'atan()은 64비트에서만 동작하므로',
          '부동소수점 없이 각도를 계산하므로',
        ],
        correctIndex: 0,
        explanation: 'atan2f(1.0, 0.0)은 x가 0이어도 나눗셈 예외 없이 정확히 +π/2(+90°)를 반환합니다.',
      },
    ],
  },
  {
    id: 'day18_rotation3d',
    order: 18,
    dayLabel: 'Day 18',
    phaseLabel: 'Phase 3 · 수학/기구학',
    title: '3D 공간 회전 SO(3)·SE(3) & 짐벌락 vs 쿼터니언',
    shortTitle: 'D18 · 3D회전/쿼터니언',
    subtitle: '4×4 동차 변환 · 오일러 Pitch=90° 짐벌락 3D 체험 · 단위 쿼터니언',
    badge: '3D 공간 회전',
    milestoneTag: 'Day 18 3D 짐벌락/쿼터니언 랩',
    failFirstHook:
      '드론이나 로봇 팔 손목이 오일러 각 Pitch=90°로 수직을 바라보는 순간, Roll과 Yaw 회전축이 포개지며 한 방향 회전 자유도를 완전히 잃는 짐벌락(Gimbal Lock)에 갇혀 제어기가 튕깁니다.',
    beginnerAnalogy:
      '오일러 각은 세 개의 금속 고리를 겹쳐 돌려 방향을 맞추는 방식이라 고리가 일자로 겹치면 먹통이 됩니다. 반면 쿼터니언은 공간에 꼬치(회전축 u)를 딱 하나 꽂고 그 축 중심으로 한 번에 θ만큼 돌리는 우아한 방식입니다.',
    overviewSummary:
      '3D 뷰포트에서 세 개의 컬러 짐벌 링(Yaw·Pitch·Roll)과 로봇 좌표축이 오일러 각 모드와 쿼터니언 모드에서 어떻게 다른지 직접 돌려보세요. Pitch를 ±90°로 올리면 바깥 고리와 안쪽 고리가 완전히 겹치는 현상을 눈으로 확인할 수 있습니다.',
    guidedMissions: [
      {
        id: 'd18-gimbal',
        title: '오일러(Euler) 모드에서 Pitch를 ±90°로 올려 짐벌락(Roll/Yaw 겹침) 체험하기',
        hint: 'Pitch 슬라이더를 +90° 또는 -90° 끝까지 이동해 빨강/파랑 링이 포개지는지 보세요.',
      },
      {
        id: 'd18-quat',
        title: '쿼터니언(Quaternion) 모드로 전환해 짐벌락 없는 축-각도 4원소 확인하기',
        hint: '모드를 "쿼터니언 (x, y, z, w)"로 바꾸고 단위 노름 ||q|| = 1을 확인하세요.',
      },
      {
        id: 'd18-code',
        title: 'SE(3) 동차 변환 행렬 순서 버그 코드 챌린지 풀기',
        hint: '코드 탭의 동차 변환 순서 챌린지를 맞혀보세요.',
      },
    ],
    highlights: [
      {
        title: 'SE(3) = 4×4 동차 변환 행렬 [R p; 0 1]',
        body: '3×3 회전 행렬 R과 3×1 이동 벡터 p를 하나의 4×4 행렬 T로 묶으면, 여러 관절/센서의 좌표 변환을 단순 행렬 연쇄 곱(T_world_cam = T_world_base · T_base_cam)으로 처리할 수 있습니다.',
        tone: 'cyan',
      },
      {
        title: '오일러 각 Pitch = ±90° 짐벌락(Gimbal Lock)',
        body: 'ZYX 오일러 각에서 두 번째 회전 Pitch가 ±90°가 되면 첫 번째 축(Z: Yaw)과 세 번째 축(X: Roll)이 같은 직선 위에 겹쳐 자유도 3 → 2로 붕괴합니다.',
        tone: 'rose',
      },
      {
        title: '단위 쿼터니언 q = [u·sin(θ/2), cos(θ/2)]',
        body: 'ROS 2 TF2, Gazebo, IMU(BNO085)는 모두 짐벌락이 없고 최단 경로 보간(SLERP)이 가능한 단위 쿼터니언(||q|| = 1)을 표준으로 사용합니다.',
        tone: 'emerald',
      },
    ],
    formulas: [
      {
        title: 'SE(3) 동차 변환 행렬 (Homogeneous Transform)',
        latex: String.raw`T = \begin{bmatrix} R_{3\times3} & p_{3\times1} \\ 0_{1\times3} & 1 \end{bmatrix} \in SE(3), \qquad T_A^C = T_A^B \cdot T_B^C`,
        description: '회전 R(직교행렬, RᵀR = I, det R = +1)과 평행이동 p를 한 번의 행렬 곱으로 계산합니다.',
      },
      {
        title: '단위 쿼터니언 (Axis-Angle → Quaternion)',
        latex: String.raw`q = \left(u_x\sin\tfrac{\theta}{2},\; u_y\sin\tfrac{\theta}{2},\; u_z\sin\tfrac{\theta}{2},\; \cos\tfrac{\theta}{2}\right), \qquad \|q\| = \sqrt{x^2+y^2+z^2+w^2} = 1`,
        description: '반각(θ/2)을 사용하므로 q와 -q는 3D 공간에서 동일한 자세를 나타냅니다.',
      },
    ],
    specs: [
      { label: 'SO(3) 자유도', value: '3 DOF (9원소)', note: '회전행렬 6개 직교 제약', tone: 'cyan' },
      { label: '오일러 짐벌락', value: 'Pitch = ±90°', note: 'Roll↔Yaw 축 중첩 붕괴', tone: 'rose' },
      { label: '단위 쿼터니언', value: '4원소 (x,y,z,w)', note: '항상 x²+y²+z²+w² = 1', tone: 'emerald' },
      { label: '행렬 곱셈 법칙', value: 'A·B ≠ B·A', note: '교환 법칙 성립 안 함', tone: 'amber' },
    ],
    wiringNotes: [
      {
        signal: '좌표 변환 곱셈 방향 (고정 vs 몸체 기준)',
        pin: 'T_world_ee = T_world_base * T_base_ee',
        detail: '대문자 첨자 소거 법칙: 앞 행렬의 아래첨자(base)와 뒤 행렬의 위첨자(base)가 약분되듯 이어져야 맞습니다.',
      },
      {
        signal: '쿼터니언 정규화 의무',
        pin: 'q.normalize()',
        detail: '적분을 반복하면 수치 오차로 노름 ||q||가 1.0001로 틀어져 스케일 왜곡이 생기므로 매 주기 정규화가 필요합니다.',
      },
    ],
    codeTitle: 'day18_quaternion_slerp.cpp',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 18: ZYX 오일러 -> 단위 쿼터니언 변환 및 최단 경로 보간
struct Quat { float x, y, z, w; };

Quat fromEulerZYX(float roll, float pitch, float yaw) {
  float cr = cosf(roll * 0.5f),  sr = sinf(roll * 0.5f);
  float cp = cosf(pitch * 0.5f), sp = sinf(pitch * 0.5f);
  float cy = cosf(yaw * 0.5f),   sy = sinf(yaw * 0.5f);

  return {
    sr * cp * cy - cr * sp * sy,
    cr * sp * cy + sr * cp * sy,
    cr * cp * sy - sr * sp * cy,
    cr * cp * cy + sr * sp * sy
  };
}`,
    codeChallenge: {
      prompt: '베이스 기준 카메라 위치 T_base_cam과 월드 기준 베이스 위치 T_world_base를 곱해 월드 기준 카메라 위치를 구할 때 올바른 순서는?',
      buggyLine: 'T_world_cam = T_base_cam * T_world_base; // 순서 반대!',
      options: [
        'T_world_cam = T_world_base * T_base_cam;',
        'T_world_cam = T_base_cam + T_world_base;',
        'T_world_cam = inv(T_world_base) * T_base_cam;',
      ],
      correctIndex: 0,
      explanation: '연쇄 좌표 변환은 안쪽 프레임(base)이 소거되도록 T_world_base * T_base_cam 순서로 오른쪽에 로컬 변환을 곱합니다.',
    },
    quizzes: [
      {
        id: 'P3D18-1',
        question: 'ZYX 오일러 각 회전에서 Roll 축과 Yaw 축이 같은 직선에 겹쳐 회전 자유도를 1개 잃는 짐벌락 발생 각도는?',
        options: ['Roll = 90°', 'Pitch = ±90°', 'Yaw = 180°', 'Roll = 45°'],
        correctIndex: 1,
        explanation: '두 번째 회전 축인 Pitch가 ±90°가 되면 첫 번째(Z)와 세 번째(X) 축이 평행하게 겹쳐 짐벌락에 빠집니다.',
      },
      {
        id: 'P3D18-2',
        question: '3×3 회전 행렬 R ∈ SO(3)이 반드시 만족해야 하는 수학적 성질 두 가지는?',
        options: [
          '대각합이 0이고 행렬식 det(R) = -1',
          '직교성(RᵀR = I)과 행렬식 det(R) = +1',
          '모든 원소가 양수이고 역행렬이 존재하지 않음',
          '전치행렬 Rᵀ = -R',
        ],
        correctIndex: 1,
        explanation: 'SO(3)는 길이를 보존(직교성)하고 거울 반전 없이 오른손 좌표계를 유지(det=+1)하는 특수 직교군입니다.',
      },
      {
        id: 'P3D18-3',
        question: 'ROS 2와 IMU 센서가 3D 회전을 나타낼 때 단위 쿼터니언(x, y, z, w)을 쓰는 가장 결정적 장점은?',
        options: [
          '정수로만 계산할 수 있어서',
          '짐벌락 특이점이 전혀 없고 두 자세 사이를 최단 구면 보간(SLERP)할 수 있어서',
          '이동 벡터 p까지 4개 원소에 모두 담아서',
          '사람이 숫자만 보고 각도를 암산하기 쉬워서',
        ],
        correctIndex: 1,
        explanation: '쿼터니언은 특이점(짐벌락) 없이 3D 회전 공간 SO(3)을 이중 피복하며 부드러운 보간이 가능합니다.',
      },
      {
        id: 'P3D18-4',
        question: 'z축 중심으로 +90°(π/2 rad) 회전한 단위 쿼터니언 q의 실수부 w(cos(θ/2))와 z 성분(sin(θ/2)) 값은?',
        options: [
          'z = 1.0, w = 0.0',
          'z = 0.707, w = 0.707',
          'z = 0.0, w = 1.0',
          'z = 0.5, w = 0.866',
        ],
        correctIndex: 1,
        explanation: '쿼터니언은 반각(θ/2 = 45°)을 쓰므로 sin(45°) ≈ 0.707, cos(45°) ≈ 0.707이 됩니다.',
      },
      {
        id: 'P3D18-5',
        question: '동차 변환 행렬 T = [R p; 0 1]의 역행렬 T⁻¹를 수치적으로 가장 정확하고 빠르게 구하는 공식은?',
        options: [
          '[Rᵀ  -Rᵀp;  0  1]',
          '[-R  -p;  0  1]',
          '[R  -p;  0  1]',
          '[Rᵀ  p;  0  1]',
        ],
        correctIndex: 0,
        explanation: '회전 행렬의 역행렬은 전치 Rᵀ이고, 역변환 시 이동 벡터도 회전의 역을 적용한 -Rᵀp가 됩니다.',
      },
    ],
  },
  {
    id: 'day19_cad_tolerance',
    order: 19,
    dayLabel: 'Day 19',
    phaseLabel: 'Phase 3 · 수학/기구학',
    title: '기구 설계, CAD & 3D 프린팅 현실 공차 감각',
    shortTitle: 'D19 · CAD/프린팅공차',
    subtitle: '자유도(DOF) · 0.2~0.4mm 끼워맞춤 공차 · M3 볼트 홀 · 노즐 배수 벽 두께',
    badge: '기구 설계',
    milestoneTag: 'Day 19 공차/단면 설계 랩',
    failFirstHook:
      'Fusion 360 / SolidWorks에서 지름 5.0mm 모터 축이 들어갈 구멍을 딱 5.0mm로 그려 3D 출력하면, 플라스틱 열수축과 노즐 퍼짐 때문에 구멍이 4.7mm로 줄어 절대 안 들어갑니다.',
    beginnerAnalogy:
      'CAD 도면은 마찰도 수축도 없는 수학 세계지만, 실제 FDM 3D 프린터는 녹인 치약을 0.4mm 노즐로 쌓아 올리는 공정이라 용도별로 0.1~0.4mm 숨구멍(공차)을 줘야 조립이 됩니다.',
    overviewSummary:
      '지름 5.00mm 금속 샤프트와 3D 프린팅 부품 단면 시뮬레이터에서 구멍 여유 공차(Clearance)를 조절해 헐거운 끼워맞춤(회전/슬라이딩)과 억지 끼움(프레스 핏)을 구별하고, 0.4mm 노즐에 최적화된 벽 두께를 검증해 보세요.',
    guidedMissions: [
      {
        id: 'd19-press',
        title: '공차 0.0~0.1mm(또는 음수)로 설정해 수축 간섭 & 억지 끼움 확인하기',
        hint: '여유 공차를 0.05mm 이하로 내리거나 "억지 끼움" 프리셋을 눌러보세요.',
      },
      {
        id: 'd19-clearance',
        title: '헐거운 끼워맞춤(+0.25~+0.4mm)으로 회전 샤프트 안전 공차 맞추기',
        hint: 'M3 볼트/회전 축이 부드럽게 통과하도록 여유 공차를 +0.3mm로 맞춰보세요.',
      },
      {
        id: 'd19-wall',
        title: '벽 두께를 0.4mm 노즐의 배수(1.6mm 또는 2.4mm)로 설정하기',
        hint: '벽 두께 슬라이더를 1.6mm 이상(0.4mm 배수)으로 맞춰 강도를 확보하세요.',
      },
    ],
    highlights: [
      {
        title: 'FDM 3D 프린팅 구멍 공차 황금비 (5.0mm 축 기준)',
        body: '수축으로 구멍이 약간 작게 출력되므로, 고정용 억지 끼움은 +0.05~0.10mm, 부드러운 슬라이딩/M3 통과 홀은 +0.25~0.40mm(예: M3→3.4mm) 여유를 줍니다.',
        tone: 'cyan',
      },
      {
        title: '0.4mm 노즐 폭의 배수로 벽 두께 설계하기',
        body: '일반 0.4mm 노즐에서는 1.2mm(3겹), 1.6mm(4겹), 2.4mm(6겹)처럼 0.4mm의 배수로 벽을 설계해야 중간에 애매한 빈 틈(Gap Fill) 없이 단단하게 적층됩니다.',
        tone: 'emerald',
      },
      {
        title: '인서트 너트 / 육각 너트 포켓 & 무게중심',
        body: '플라스틱에 직접 나사산을 내면 2~3번 풀고 조이다 뭉개지므로, 육각 너트 포켓이나 황동 열압입 인서트(Heat-set Insert)를 배치하고 무거운 배터리는 차체 중심 낮게 둡니다.',
        tone: 'amber',
      },
    ],
    formulas: [
      {
        title: 'Grübler 자유도 공식 (평면 기구 DOF)',
        latex: String.raw`\text{DOF} = 3(N - 1) - 2J_1 - J_2`,
        description: '강체 링크 수 N(지면 포함), 1-DOF 회전/직동 조인트 수 J₁으로 기구의 총 움직임 자유도를 계산합니다.',
      },
      {
        title: '외팔보 굽힘 처짐 (모터 브래킷 강성)',
        latex: String.raw`\delta = \frac{F L^3}{3 E I}, \qquad I = \frac{b h^3}{12}`,
        description: '브래킷 두께(h)를 2배 키우면 세제곱(2³=8배)으로 단단해지지만, 길이를 2배 늘리면 처짐은 8배 심해집니다.',
      },
    ],
    specs: [
      { label: 'M3 통과 홀(PLA)', value: 'Ø 3.3 ~ 3.4 mm', note: '나사산 없이 통과 시', tone: 'cyan' },
      { label: '회전/슬라이딩 공차', value: '+0.25 ~ +0.40 mm', note: '부품 간 틈새', tone: 'emerald' },
      { label: '베어링/축 압입', value: '+0.05 ~ +0.10 mm', note: '프린터별 캘리브레이션', tone: 'amber' },
      { label: '권장 최소 벽 두께', value: '1.6 mm (0.4×4)', note: '구조 프레임 최소 기준', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '적층 방향 (Print Orientation)과 강도',
        pin: '층간 결합력 < 적층면 인장 강도',
        detail: '모터 하중을 받는 L자 브래킷은 꺾이는 모서리가 Z축 적층선과 평행하게 깨지지 않도록 눕히거나 필렛/리브(Rib)를 추가합니다.',
      },
      {
        signal: 'CAD → URDF 변환 연동',
        pin: 'Base Link → Joint → Child Link',
        detail: '각 부품을 개별 STL/STEP으로 내보내고 관절 중심 좌표(Origin)를 정확히 맞춰야 ROS 2 시뮬레이터에서 팔이 헛돌지 않습니다.',
      },
    ],
    codeTitle: 'day19_urdf_revolute_joint.xml',
    codeLanguage: 'xml',
    codeSnippet: `<!-- Day 19: CAD 조립체를 ROS 시뮬레이터용 URDF 회전 관절로 정의 -->
<joint name="shoulder_pitch_joint" type="revolute">
  <parent link="base_pedestal"/>
  <child link="upper_arm_link"/>
  <!-- 관절 회전 중심 좌표 (CAD 원점과 일치시켜야 함) -->
  <origin xyz="0 0 0.085" rpy="0 0 0"/>
  <axis xyz="0 1 0"/>
  <!-- 실제 서보 회전 한계 & 토크/속도 스펙 -->
  <limit lower="-1.57" upper="1.57" effort="2.0" velocity="3.5"/>
</joint>`,
    codeChallenge: {
      prompt: '지름 5.0mm 회전 샤프트가 PLA 3D 프린팅 구멍 안에서 매끄럽게 미끄러지도록 CAD 구멍 지름을 가장 알맞게 설계한 값은?',
      buggyLine: 'const float HOLE_DIAMETER_MM = 5.00; // 수축으로 꽉 끼임!',
      options: [
        'const float HOLE_DIAMETER_MM = 5.30; // +0.3mm 헐거운 공차',
        'const float HOLE_DIAMETER_MM = 4.60; // 프린팅 불가',
        'const float HOLE_DIAMETER_MM = 8.00; // 덜컹거림 과다',
      ],
      correctIndex: 0,
      explanation: 'FDM 프린팅 구멍은 내측 수축이 발생하므로 매끄러운 회전/통과에는 +0.25~0.4mm 여유(5.30mm)가 알맞습니다.',
    },
    quizzes: [
      {
        id: 'P3D19-1',
        question: 'M3(공칭 외경 3.0mm) 볼트를 플라스틱 구멍에 걸리지 않게 쏙 통과시키려 할 때 적정한 CAD 홀 지름은?',
        options: ['Ø 2.7 mm', 'Ø 3.0 mm', 'Ø 3.4 mm', 'Ø 5.0 mm'],
        correctIndex: 2,
        explanation: 'FDM 프린팅 수축을 고려해 통과 볼트 구멍은 공칭 지름보다 +0.3~0.4mm 큰 Ø 3.3~3.4mm로 그립니다.',
      },
      {
        id: 'P3D19-2',
        question: '두 링크가 하나의 중심축을 기준으로 시계/반시계 회전만 허용하는 조인트 이름과 자유도는?',
        options: [
          'Prismatic 조인트 (2 DOF)',
          'Revolute 조인트 (1 DOF)',
          'Spherical 조인트 (1 DOF)',
          'Fixed 조인트 (3 DOF)',
        ],
        correctIndex: 1,
        explanation: '로봇 팔 관절이나 휠 모터처럼 1개 축 회전만 허용하는 관절이 1-DOF Revolute(회전) 조인트입니다.',
      },
      {
        id: 'P3D19-3',
        question: '로봇 팔 3D 프린팅 브래킷 두께(h)를 2mm에서 4mm로 2배 키우면 굽힘 강성(처짐 저항)은 이론상 몇 배 강해질까요?',
        options: ['2배', '4배', '8배 (h³ 비례)', '16배'],
        correctIndex: 2,
        explanation: '단면 2차 모멘트 I = bh³/12가 두께 h의 세제곱에 비례하므로 2배 두꺼워지면 8배 강해집니다.',
      },
      {
        id: 'P3D19-4',
        question: '모터 부하가 큰 서보 혼 브래킷이 반복 사용 후 구멍이 헐거워지는 것을 막는 실무 설계 팁은?',
        options: [
          '플라스틱에 직접 태핑 나사를 꽂아 10번 뺐다 꼈다 한다',
          '황동 열압입 인서트 너트 또는 육각 너트 포켓(Trap)을 적용한다',
          '벽 두께를 0.4mm 1겹으로 얇게 출력한다',
          '접착제 없이 끼워둔다',
        ],
        correctIndex: 1,
        explanation: 'PLA/PETG 나사산은 쉽게 마모되므로 금속 인서트 너트나 육각 너트 포켓으로 금속 체결력을 얻어야 합니다.',
      },
      {
        id: 'P3D19-5',
        question: 'CAD 설계에서 0.4mm 표준 노즐 3D 프린터로 프레임 벽을 출력할 때 가장 이상적인 벽 두께 조합은?',
        options: ['1.0 mm', '1.6 mm 또는 2.4 mm', '0.5 mm', '1.35 mm'],
        correctIndex: 1,
        explanation: '노즐 선폭 0.4mm의 정확히 정수배(4줄=1.6mm, 6줄=2.4mm)로 설계해야 빈틈 없이 밀착 적층됩니다.',
      },
    ],
  },
  {
    id: 'day20_mobile_kinematics',
    order: 20,
    dayLabel: 'Day 20',
    phaseLabel: 'Phase 3 · 수학/기구학',
    title: '바퀴 달린 로봇 기구학 & 순간 회전 중심(ICR)',
    shortTitle: 'D20 · 차동구동/ICR',
    subtitle: '차동 구동 (v, ω) ↔ (v_L, v_R) · ICR 궤적 · 홀로노믹/메카넘 비교',
    badge: '이동 로봇 기구학',
    milestoneTag: 'Day 20 차동 구동/ICR 랩',
    failFirstHook:
      '두 바퀴 차동 구동 로봇에게 "지금 위치에서 옆으로 10cm 게걸음 쳐라"고 명령해도 바퀴가 미끄러지지 않는 한 물리적으로 절대 불가능합니다(논홀로노믹 제약).',
    beginnerAnalogy:
      '쇼핑카트 바퀴가 1자로 고정되어 있으면 오른쪽으로 가기 위해 먼저 차체를 틀고 전진해야 합니다. 좌/우 바퀴 속도 차이(v_R - v_L)가 곧 회전 중심(ICR) 반경 R을 결정하는 탱크 조종 원리입니다.',
    overviewSummary:
      '선속도 v, 각속도 ω, 차체 바퀴 간격(Wheelbase W)을 조절하면서 좌/우 바퀴가 실제로 몇 m/s로 돌아야 하는지, 그리고 순간 회전 중심(ICR) 반경 R = v/ω가 어디에 찍히는지 2D 기구학 시뮬레이터로 관찰하세요.',
    guidedMissions: [
      {
        id: 'd20-spin',
        title: '선속도 v = 0, 각속도 ω ≠ 0으로 설정해 v_L = -v_R 제자리 회전(ICR=원점) 만들기',
        hint: 'v 슬라이더를 0으로 두고 ω 슬라이더를 ±2.0으로 조절해 보세요.',
      },
      {
        id: 'd20-arc',
        title: 'v ≠ 0, ω ≠ 0 곡선 주행으로 차체 옆 회전 중심 ICR(R = v/ω) 확인하기',
        hint: 'v = 0.6 m/s, ω = 1.5 rad/s처럼 둘 다 0이 아니게 설정해 R 궤적을 보세요.',
      },
      {
        id: 'd20-arch',
        title: '차동 구동 · 애커먼(자동차) · 메카넘 옴니휠 구동 방식 모두 비교하기',
        hint: '상단 구동 방식 탭에서 세 가지 섀시 구조를 번갈아 클릭해 보세요.',
      },
    ],
    highlights: [
      {
        title: '차동 구동 역기구학: (v, ω) → (v_L, v_R)',
        body: '목표 전진 속도 v와 제자리 회전 속도 ω가 주어지면, 좌측 바퀴는 v - (W/2)ω, 우측 바퀴는 v + (W/2)ω로 돌리면 됩니다. (반시계 회전 +ω 기준)',
        tone: 'cyan',
      },
      {
        title: '순간 회전 중심(ICR) 반경 R = v / ω',
        body: '양 바퀴 속도가 같으면 ω=0, R=∞(완전 직진)이고, v=0으로 반대 방향 회전하면 R=0(차체 중심 제자리 턴)이 됩니다.',
        tone: 'emerald',
      },
      {
        title: '논홀로노믹(차동/애커먼) vs 홀로노믹(메카넘/옴니)',
        body: '차동 구동은 옆 방향 속도 v_y=0 구속(논홀로노믹)이 있어 평행 주차가 필요하지만, 45° 롤러가 달린 메카넘 휠 4개는 어떤 방향으로든 즉각 게걸음(vx, vy, ω 3자유도)이 가능합니다.',
        tone: 'amber',
      },
    ],
    formulas: [
      {
        title: '차동 구동 순기구학 & 역기구학',
        latex: String.raw`v = \frac{v_R + v_L}{2}, \quad \omega = \frac{v_R - v_L}{W} \qquad \Longleftrightarrow \qquad v_L = v - \frac{W}{2}\omega, \quad v_R = v + \frac{W}{2}\omega`,
        description: 'W는 좌우 바퀴 접지면 중심 사이의 거리(Track Width / Wheelbase)입니다.',
      },
      {
        title: '순간 회전 중심(ICR) 선회 반경',
        latex: String.raw`R = \frac{v}{\omega} = \frac{W}{2}\cdot\frac{v_R + v_L}{v_R - v_L}`,
        description: '차체 중심으로부터 바퀴 축 연장선 위에 있는 ICR까지의 거리 R입니다.',
      },
    ],
    specs: [
      { label: '차동 2WD DOF', value: '제어 2 (v, ω) / 자세 3', note: '논홀로노믹 제약', tone: 'cyan' },
      { label: '제자리 회전 조건', value: 'v_L = -v_R (R=0)', note: '기동성 우수', tone: 'emerald' },
      { label: '메카넘 4WD DOF', value: '전방향 (vx, vy, ω)', note: '슬립·오도메트리 오차↑', tone: 'amber' },
      { label: '애커먼 조향', value: '최소 회전 반경 존재', note: '자동차형 · 제자리턴 불가', tone: 'rose' },
    ],
    wiringNotes: [
      {
        signal: '좌우 바퀴 부호 규약 (+ 전진)',
        pin: '우측 모터 1개는 차체에서 거울 반전 장착',
        detail: '실물 로버를 조립하면 오른쪽 바퀴 모터가 왼쪽과 반대 방향을 보므로, 코드에서 한쪽 극성을 반전시켜야 두 바퀴 모두 같은 +명령에 전진합니다.',
      },
      {
        signal: '속도 포화 정규화 (Normalization)',
        pin: '|v| + (W/2)|ω| > v_max 시 비율 축소',
        detail: '최고 속도로 직진하면서 회전 명령까지 더하면 한쪽 모터가 PWM 100%를 초과해 잘리므로, 두 속도를 같은 비율로 줄여 선회 각도를 보존합니다.',
      },
    ],
    codeTitle: 'day20_diff_drive_kinematics.cpp',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 20: 차동 구동 Twist (v, w) -> 좌/우 바퀴 목표 선속도(vL, vR)
struct WheelCmd { float vL; float vR; };

WheelCmd inverseDiffDrive(float v, float omega, float wheelBaseW, float maxWheelV) {
  float vL = v - (wheelBaseW * 0.5f) * omega;
  float vR = v + (wheelBaseW * 0.5f) * omega;

  // 포화 시 선회 반경 비율을 유지하도록 동시 스케일링
  float maxReq = fmaxf(fabsf(vL), fabsf(vR));
  if (maxReq > maxWheelV) {
    float scale = maxWheelV / maxReq;
    vL *= scale;
    vR *= scale;
  }
  return { vL, vR };
}`,
    codeChallenge: {
      prompt: '차체를 반시계 방향(+ω > 0)으로 제자리 회전(v = 0)시키기 위한 좌/우 바퀴 속도 부호는?',
      buggyLine: 'float vL = +0.5f * W * omega; float vR = +0.5f * W * omega;',
      options: [
        'float vL = -0.5f * W * omega; float vR = +0.5f * W * omega;',
        'float vL = +0.5f * W * omega; float vR = -0.5f * W * omega;',
        'float vL = 0.0f; float vR = 0.0f;',
      ],
      correctIndex: 0,
      explanation: '반시계(+ω)로 돌려면 오른쪽 바퀴(vR)는 앞으로(+), 왼쪽 바퀴(vL)는 뒤로(-) 돌아야 합니다.',
    },
    quizzes: [
      {
        id: 'P3D20-1',
        question: '바퀴 간격 W = 0.30 m인 차동 구동 로봇이 선속도 v = 0.5 m/s, 각속도 ω = 2.0 rad/s로 반시계 선회할 때 v_L, v_R은?',
        options: [
          'v_L = 0.5 m/s, v_R = 0.5 m/s',
          'v_L = 0.2 m/s, v_R = 0.8 m/s',
          'v_L = 0.8 m/s, v_R = 0.2 m/s',
          'v_L = -0.3 m/s, v_R = 0.3 m/s',
        ],
        correctIndex: 1,
        explanation: 'v_L = 0.5 - (0.3/2)×2 = 0.2 m/s, v_R = 0.5 + (0.3/2)×2 = 0.8 m/s입니다.',
      },
      {
        id: 'P3D20-2',
        question: '한쪽 바퀴만 정확히 정지(v_L = 0)하고 반대쪽 바퀴(v_R > 0)만 움직일 때 순간 회전 중심(ICR)의 위치는?',
        options: [
          '로봇 중심 원점',
          '정지해 있는 왼쪽 바퀴의 접지 중심점 (R = W/2)',
          '오른쪽 바퀴 바깥쪽 무한대 거리',
          '로봇 앞쪽 1m 지점',
        ],
        correctIndex: 1,
        explanation: 'v_L=0이면 R = (W/2)(v_R/v_R) = W/2가 되어 정지한 바퀴 자체를 콤파스 축 삼아 돕니다.',
      },
      {
        id: 'P3D20-3',
        question: '4륜 메카넘 휠 로봇이 차동 구동 로봇과 가장 크게 구별되는 기동 특성과 단점은?',
        options: [
          '제자리 회전이 안 되고 조향 모터가 꼭 필요하다',
          '몸체를 돌리지 않고 옆으로 평행 이동(홀로노믹)할 수 있으나 바닥 마찰/슬립으로 오도메트리 오차가 크다',
          '전진과 후진만 가능하다',
          '모터가 1개만 필요하다',
        ],
        correctIndex: 1,
        explanation: '메카넘 휠은 전방향 이동(vx, vy, ω)이 가능하지만, 롤러 미끄러짐 때문에 바퀴 회전수 기반 위치 추정이 부정확합니다.',
      },
      {
        id: 'P3D20-4',
        question: '자동차 방식(애커먼 조향) 로봇이 좁은 복도 모퉁이에서 차동 구동 로버보다 불리한 이유는?',
        options: [
          '최소 회전 반경(R_min)이 존재해 제자리 360도 회전이 불가능하므로',
          '직진 주행을 못 하므로',
          '바퀴가 2개뿐이므로',
          '각속도 개념이 없으므로',
        ],
        correctIndex: 0,
        explanation: '앞바퀴 조향각 한계 때문에 최소 회전 반경보다 좁은 공간에서는 전진/후진 전환 기동이 필요합니다.',
      },
      {
        id: 'P3D20-5',
        question: '로봇이 전진 중 v_L과 v_R의 평균은 유지하면서 차이 |v_R - v_L|만 크게 줄이면 회전 반경 R은 어떻게 변할까요?',
        options: [
          '0에 가까워져 제자리 회전한다',
          '커져서(ω↓) 훨씬 완만한 큰 원호를 그리며 선회한다',
          '변하지 않는다',
          '후진으로 바뀐다',
        ],
        correctIndex: 1,
        explanation: 'R = v/ω에서 속도 차이가 줄면 각속도 ω가 작아지므로 선회 반경 R이 커집니다.',
      },
    ],
  },
  {
    id: 'day23_jacobian',
    order: 23,
    dayLabel: 'Day 23',
    phaseLabel: 'Phase 3 · 수학/기구학',
    title: '속도 기구학, 야코비안(Jacobian) & 특이점',
    shortTitle: 'D23 · 야코비안/특이점',
    subtitle: 'ẋ = J(θ)θ̇ · 조작성 타원 · det(J)=0 특이점 폭주 · 힘 쌍대성 τ = JᵀF',
    badge: '고급 기구학',
    milestoneTag: 'Day 23 야코비안/특이점 랩',
    failFirstHook:
      '로봇 팔을 일자로 쫙 편 자세(θ₂ = 0°) 근처에서 손끝을 1mm/s로 천천히 반경 방향 이동시키려 하면, 역야코비안 J⁻¹ 값이 무한대로 치솟으며 관절 모터가 폭발할 듯 고속 회전합니다.',
    beginnerAnalogy:
      '야코비안 행렬 J는 관절 속도(입력)를 손끝 속도(출력)로 바꿔주는 가변 기어박스입니다. 팔을 일자로 쫙 편 특이점에서는 기어비가 0으로 무너지면서 한쪽 방향으로는 밀어도 꼼짝 못 하고 타원이 종잇장처럼 납작해집니다.',
    overviewSummary:
      '2R 로봇 팔의 두 관절 각도(θ₁, θ₂)와 손끝 외력(Fx, Fy)을 바꾸면서 손끝에 그려지는 조작성 타원(Manipulability Ellipsoid), 행렬식 det(J), 그리고 각 관절에 걸리는 정적 토크 τ = JᵀF를 실시간으로 실험하세요.',
    guidedMissions: [
      {
        id: 'd23-singular',
        title: '팔꿈치 각도 θ₂를 0° 또는 ±170° 근처로 맞춰 특이점(det J ≈ 0) 경보 확인하기',
        hint: 'θ₂ 슬라이더를 0° 부근으로 옮겨 조작성 타원이 일직선으로 납작해지는 모습을 보세요.',
      },
      {
        id: 'd23-elbow',
        title: 'θ₂를 90°로 맞춰 최대 등방성 조작성(타원 면적 최대) 확인하기',
        hint: 'θ₂ = ±90°일 때 det(J) = L₁·L₂·sin(θ₂)가 최대가 됩니다.',
      },
      {
        id: 'd23-force',
        title: '손끝 외력 Fx, Fy를 가해 τ = JᵀF 정적 관절 토크 변화 확인하기',
        hint: '외력 Fx 또는 Fy 슬라이더를 ±15N 이상 움직여 관절 1·2 토크 변화를 확인하세요.',
      },
    ],
    highlights: [
      {
        title: '속도 야코비안 ẋ = J(θ)θ̇',
        body: '순기구학 식 x(θ), y(θ)를 시간 미분하면 편미분 행렬 J(θ)가 나옵니다. 이 2×2 행렬이 관절 각속도와 직교좌표계 손끝 속도를 직접 연결합니다.',
        tone: 'cyan',
      },
      {
        title: '특이점 조건: det(J) = L₁ L₂ sin(θ₂) = 0',
        body: 'θ₂ = 0°(완전 신전) 또는 θ₂ = ±180°(완전 접힘)에서 행렬식이 0이 되어 역행렬 J⁻¹가 발산합니다. 실무에서는 Damped Least Squares(Jᵀ(JJᵀ + λ²I)⁻¹)로 폭주를 막습니다.',
        tone: 'rose',
      },
      {
        title: '속도와 힘의 쌍대성: τ = Jᵀ F',
        body: '작업량 보존 법칙(τᵀθ̇ = Fᵀẋ)에 의해 손끝에 외력 F가 걸릴 때 관절 모터가 버텨야 하는 정적 토크는 J의 전치행렬 Jᵀ에 F를 곱한 값입니다.',
        tone: 'emerald',
      },
    ],
    formulas: [
      {
        title: '평면 2R 로봇 팔 야코비안 행렬 J(θ)',
        latex: String.raw`J(\theta) = \begin{bmatrix} -L_1 s_1 - L_2 s_{12} & -L_2 s_{12} \\ L_1 c_1 + L_2 c_{12} & L_2 c_{12} \end{bmatrix}, \qquad \det(J) = L_1 L_2 \sin\theta_2`,
        description: 's₁=sinθ₁, c₁₂=cos(θ₁+θ₂) 표기입니다. θ₂=90°일 때 조작성 |det(J)|가 최대입니다.',
      },
      {
        title: '정역학 힘-토크 쌍대성 & DLS 감쇠 의사역행렬',
        latex: String.raw`\boldsymbol{\tau} = J^T \mathbf{F}, \qquad \dot{\boldsymbol{\theta}} = J^T(JJ^T + \lambda^2 I)^{-1}\dot{\mathbf{x}}`,
        description: '특이점(det(J)→0) 근처에서 관절 속도가 무한대로 튀는 것을 감쇠 상수 λ²로 안전하게 제한합니다.',
      },
    ],
    specs: [
      { label: '특이점 각도 θ₂', value: '0° / ±180°', note: '팔 길이 한계 · 1축 소실', tone: 'rose' },
      { label: '최적 조작 각도', value: 'θ₂ = ±90°', note: '|sin θ₂| = 1 최대 면적', tone: 'emerald' },
      { label: '토크 전달 식', value: 'τ = Jᵀ F', note: '야코비안 전치 행렬', tone: 'cyan' },
      { label: '안전 역해법', value: 'DLS (λ > 0)', note: 'Levenberg-Marquardt', tone: 'amber' },
    ],
    wiringNotes: [
      {
        signal: '직선 궤적 추종(Cartesian Control) 주의',
        pin: '특이점 경계 |θ₂| < 8° 진입 금지',
        detail: '특이점 근처를 지날 때는 직교 속도 명령 대신 관절 공간 보간(Joint-space Interpolation)이나 감쇠 DLS를 적용해야 서보 과속 오류가 나지 않습니다.',
      },
      {
        signal: '원격 힘 감지 (Force Sensing)',
        pin: 'F ≈ (Jᵀ)⁻¹ τ',
        detail: '모터 전류에서 추정한 관절 토크 τ를 이용하면 손목 힘 센서 없이도 물체에 부딪힌 외력 F를 역산할 수 있습니다(협동 로봇 충돌 감지 원리).',
      },
    ],
    codeTitle: 'day23_damped_jacobian.cpp',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 23: 특이점 판별(det J) 및 정적 관절 토크 tau = J^T * F 계산
float detJ = L1 * L2 * sinf(theta2Rad);
if (fabsf(detJ) < 0.08f) {
  // 경고: 특이점 근접 -> 일반 J^-1 역산 금지, DLS 감쇠 사용!
}

// 2R 야코비안 J의 전치행렬로 관절 토크 산출
float s1 = sinf(t1), c1 = cosf(t1);
float s12 = sinf(t1 + t2), c12 = cosf(t1 + t2);
float tau1 = (-L1 * s1 - L2 * s12) * Fx + (L1 * c1 + L2 * c12) * Fy;
float tau2 = (-L2 * s12) * Fx + (L2 * c12) * Fy;`,
    codeChallenge: {
      prompt: '손끝에 외력 F = [Fx, Fy]ᵀ가 가해질 때 정적으로 평형을 유지하기 위한 관절 토크 벡터 τ 공식은?',
      buggyLine: 'tau = J * F; // 야코비안을 그대로 곱함!',
      options: [
        'tau = J_transpose * F;',
        'tau = inv(J) * F;',
        'tau = det(J) * F;',
      ],
      correctIndex: 0,
      explanation: '가상 일 원리(τᵀδθ = Fᵀδx = FᵀJδθ)로부터 정적 힘-토크 쌍대성 공식은 τ = JᵀF입니다.',
    },
    quizzes: [
      {
        id: 'P3D23-1',
        question: 'L₁ = 1.5m, L₂ = 1.0m인 평면 2R 로봇 팔이 조작성(Manipulability = |det J|)이 최대가 되는 팔꿈치 각도 θ₂는?',
        options: ['θ₂ = 0°', 'θ₂ = ±90°', 'θ₂ = 180°', 'θ₂ = 45°'],
        correctIndex: 1,
        explanation: 'det(J) = L₁·L₂·sin(θ₂)이므로 |sin(θ₂)| = 1이 되는 ±90°에서 조작성 면적이 최대가 됩니다.',
      },
      {
        id: 'P3D23-2',
        question: '특이점(θ₂ = 0°)에 완전히 놓인 로봇 팔에서 물리적으로 발생하는 현상은?',
        options: [
          '모든 방향으로의 이동 효율이 무한히 좋아진다',
          '팔과 같은 반경(Radial) 방향으로는 속도를 낼 수 없어 한 방향 자유도를 상실하고 J⁻¹가 발산한다',
          '관절 토크가 항상 무한대로 커진다',
          '모터가 자동으로 정지한다',
        ],
        correctIndex: 1,
        explanation: '팔을 일자로 쫙 편 자세에서는 끝단 접선 방향으로만 움직일 수 있고 길이(반경) 방향 속도가 0이 됩니다.',
      },
      {
        id: 'P3D23-3',
        question: '특이점 부근에서 일반 역야코비안 J⁻¹ 대신 Damped Least Squares(DLS: Jᵀ(JJᵀ + λ²I)⁻¹)를 쓰는 이유는?',
        options: [
          'det(J) → 0일 때 분모에 작은 감쇠 항 λ²을 더해 관절 속도 폭주(무한대 발산)를 막으려고',
          '연산량을 0으로 줄이려고',
          '특이점 각도를 0°에서 45°로 옮기려고',
          '회전 관절을 직동 관절로 바꾸려고',
        ],
        correctIndex: 0,
        explanation: 'DLS는 특이점 근처에서 약간의 경로 추적 정확도를 양보하는 대신 관절 각속도를 유한하게 억제합니다.',
      },
      {
        id: 'P3D23-4',
        question: '야코비안 전치 식 τ = Jᵀ F의 물리적 해석으로 옳은 것은?',
        options: [
          '특이점 방향(속도를 낼 수 없는 축)으로는 거꾸로 관절 모터 힘 없이도 링크 구조가 무한한 외력을 지탱할 수 있다',
          '팔이 길어질수록 손끝이 더 세진다',
          '속도가 빠른 축일수록 토크도 항상 가장 크다',
          '전치 행렬이므로 행렬 차원이 사라진다',
        ],
        correctIndex: 0,
        explanation: '기구가 쭉 펴진 축 방향 외력은 모터 회전축과 직교해 링크 뼈대가 직접 버티므로 관절 토크 0으로도 지탱됩니다.',
      },
      {
        id: 'P3D23-5',
        question: '조작성 타원(Manipulability Ellipsoid)에서 타원이 한쪽으로 길고 얇게 찌그러졌을 때 의미하는 바는?',
        options: [
          '짧은 축 방향으로는 손끝을 움직이기 극도로 힘들며 특이점에 가까워졌음을 뜻한다',
          '배터리 전압이 부족함을 뜻한다',
          '모든 방향으로 등방성 속도가 같음을 뜻한다',
          '센서 노이즈를 뜻한다',
        ],
        correctIndex: 0,
        explanation: '타원의 장축은 움직이기 쉬운 방향, 단축은 움직이기 어려운 방향(특이값 σ_min → 0)을 시각적으로 보여줍니다.',
      },
    ],
  },
  {
    id: 'day24_dynamics',
    order: 24,
    dayLabel: 'Day 24',
    phaseLabel: 'Phase 3 · 수학/기구학',
    title: '로봇 동역학 & 모터/서보 토크 선정',
    shortTitle: 'D24 · 동역학/토크선정',
    subtitle: 'τ = r×F 중력 토크 · M(q)q̈ + C(q,q̇)q̇ + g(q) = τ · 안전율(SF ≥ 1.5)',
    badge: '동역학/설계',
    milestoneTag: 'Day 24 토크/모터 선정 랩',
    failFirstHook:
      '기구학 계산상 작업공간 안에 쏙 들어오게 40cm 길이 로봇 팔을 3D 프린팅했는데, 막상 책상 위로 물건을 들자 중력 토크가 SG90 서보(1.8 kg·cm)를 훌쩍 넘겨 팔이 뚝 떨어지며 기어가 부러집니다.',
    beginnerAnalogy:
      '같은 1kg 아령이라도 팔꿈치를 몸 옆에 붙여 90° 세워 들면 가볍지만, 팔을 수평(0°)으로 쫙 펴면 어깨가 부서질 듯 무겁습니다. 거리(r)와 각도(cos θ)가 모든 토크를 결정합니다.',
    overviewSummary:
      '로봇 팔 링크 길이(cm), 들어올릴 자세 각도(0° 수평 ~ 90° 수직), 페이로드 질량(g), 그리고 실제 서보 모델(SG90·MG996R·DS3225·RDS3235)을 바꿔 보면서 중력 토크 + 동적 여유율(안전율 1.5~2배)을 만족하는지 계산하세요.',
    guidedMissions: [
      {
        id: 'd24-horizontal',
        title: '팔 각도를 수평(0°)에 맞추어 최대 중력 모멘트(cos 0° = 1) 확인하기',
        hint: '팔 자세 각도 슬라이더를 0°로 내려 수평 지렛대 길이가 최대가 되게 해보세요.',
      },
      {
        id: 'd24-overload',
        title: '긴 팔 + 무거운 페이로드로 SG90/소형 서보 토크 초과(OVERLOAD) 재현하기',
        hint: '서보를 SG90(1.8 kg·cm) 또는 MG996R로 두고 팔 길이/무게를 올려 경고 빨간불을 켜보세요.',
      },
      {
        id: 'd24-upgrade',
        title: '고토크 서보 선택 및 안전율 1.5배 이상(SAFE PASS) 설계 확보하기',
        hint: '서보 등급을 높이거나 팔 길이를 줄여 안전율 SF ≥ 1.5 초록색 합격 상태로 만드세요.',
      },
    ],
    highlights: [
      {
        title: '모멘트 암 τ = L · m · g · cos(θ)',
        body: '팔 길이 35cm 끝에 300g 물체를 매달고 수평(θ=0°)으로 버티면 물체 무게만으로 35 × 0.3 = 10.5 kg·cm의 토크가 필요합니다. 여기에 팔 자체 무게(보통 L/2 지점 작용)도 더해집니다.',
        tone: 'rose',
      },
      {
        title: '라그랑주/오일러 동역학 방정식 Mq̈ + Cq̇ + g = τ',
        body: '정지 상태로 버티는 중력 항 g(q)뿐 아니라 빠르게 가속할 때 필요한 관성 항 M(q)q̈과 회전 중 상호작용하는 원심/코리올리 항 C(q,q̇)q̇까지 모터를 선택할 때 여유분(안전율 1.5~2.0배)으로 포함해야 합니다.',
        tone: 'cyan',
      },
      {
        title: '데이터시트 스톨 토크 vs 연속 가용 토크',
        body: '저가 서보 스펙표의 "20 kg·cm"는 움직이지 못하고 버티다 타버리기 직전 최대값(Stall)입니다. 실무에서는 스펙의 50~65% 이하로 설계하거나 카운터웨이트(균형추)/스프링을 씁니다.',
        tone: 'emerald',
      },
    ],
    formulas: [
      {
        title: '단일 링크 + 페이로드 정적 중력 토크',
        latex: String.raw`\tau_{\text{gravity}} = \left(\frac{m_{\text{link}}}{2} + m_{\text{payload}}\right) g \cdot L \cos\theta`,
        description: '실무 단위 환산: 1 N·m ≈ 10.2 kg·cm (예: 0.3 kg × 30 cm = 9.0 kg·cm ≈ 0.88 N·m)',
      },
      {
        title: '다관절 매니퓰레이터 동역학 표준 방정식',
        latex: String.raw`M(q)\ddot{q} + C(q, \dot{q})\dot{q} + g(q) = \tau - J^T F_{\text{ext}}`,
        description: 'M(q): 질량/관성 행렬(가속 저항), C: 원심·코리올리 힘, g(q): 중력 보상 토크입니다.',
      },
    ],
    specs: [
      { label: 'SG90 초소형 서보', value: '1.8 kg·cm', note: '소형 센서 팬/틸트 전용', tone: 'rose' },
      { label: 'MG996R 표준 서보', value: '~10 kg·cm', note: '소형 그리퍼/경량 팔', tone: 'amber' },
      { label: 'DS3225 / RDS3235', value: '20~35 kg·cm', note: '교육용 4~6축 팔 기본', tone: 'emerald' },
      { label: '권장 안전율 (SF)', value: '≥ 1.5 ~ 2.0×', note: '가속 관성·마찰 여유 포함', tone: 'cyan' },
    ],
    wiringNotes: [
      {
        signal: '스톨(Stall) 시 돌입 전류 급증',
        pin: 'DS3225 스톨 전류 최대 ~2.5A ~ 3.2A',
        detail: '서보가 한계 토크 가까이 힘쓸 때는 무부하 때보다 전류가 10배 이상 흐르므로 1A USB나 빵판 직결은 전압 강하로 즉시 꺼집니다.',
      },
      {
        signal: '기구적 토크 절감 팁',
        pin: '링크 단축 + 모터 무게 베이스 배치 + 평형 스프링',
        detail: '팔꿈치 모터를 끝이 아닌 어깨 축 근처에 달고 벨트/평행사변형 링크로 연결하면 관성 모멘트(I = mr²)를 획기적으로 줄일 수 있습니다.',
      },
    ],
    codeTitle: 'day24_gravity_feedforward.cpp',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 24: 자세에 따른 중력 토크 계산 및 모터 스펙 안전율 검사
struct TorqueCheck { float reqKgCm; float safetyFactor; bool safe; };

TorqueCheck checkServoTorque(float lengthCm, float angleDeg,
                             float linkMassKg, float payloadKg,
                             float servoStallKgCm) {
  float rad = angleDeg * (PI / 180.0f);
  float req = (linkMassKg * 0.5f + payloadKg) * lengthCm * fabsf(cosf(rad));
  float sf  = servoStallKgCm / fmaxf(req, 0.01f);
  return { req, sf, sf >= 1.5f }; // 안전율 1.5배 이상만 합격!
}`,
    codeChallenge: {
      prompt: '팔 자체 무게를 무시할 때 길이 30cm 로봇 팔이 0.4kg 물체를 들고 가장 버거워하는 자세와 필요 정적 토크는?',
      buggyLine: 'float worstTorque = 0.4f * 30.0f * sinf(0); // 0으로 계산됨!',
      options: [
        '수평 자세(θ = 0°), worstTorque = 0.4 × 30 × cos(0°) = 12.0 kg·cm',
        '수직 자세(θ = 90°), worstTorque = 12.0 kg·cm',
        '수평 자세(θ = 0°), worstTorque = 3.0 kg·cm',
      ],
      correctIndex: 0,
      explanation: '지평선과 나란한 수평 자세(θ=0°)에서 지렛대 수평 거리 r = L·cos(0°) = L로 최대가 됩니다.',
    },
    quizzes: [
      {
        id: 'P3D24-1',
        question: '어깨 서보에서 팔 길이 25cm 끝에 무게 0.5kg(500g) 페이로드가 달렸을 때(링크 자체 질량 무시) 수평 자세 정적 중력 토크는?',
        options: ['5.0 kg·cm', '12.5 kg·cm', '25.0 kg·cm', '2.5 kg·cm'],
        correctIndex: 1,
        explanation: 'τ = m × L = 0.5 kg × 25 cm = 12.5 kg·cm입니다. 안전율 1.5~2배면 최소 20~25 kg·cm 서보가 필요합니다.',
      },
      {
        id: 'P3D24-2',
        question: '동역학 방정식 M(q)q̈ + C(q,q̇)q̇ + g(q) = τ 에서 M(q)q̈ 항이 커지는 상황은?',
        options: [
          '팔이 정지 상태로 물건만 버티고 있을 때',
          '무거운 링크를 급가속(큰 각가속도 q̈)으로 빠르게 출발/정지시킬 때',
          '무중력 우주 공간에서 가만히 있을 때',
          '전원을 껐을 때',
        ],
        correctIndex: 1,
        explanation: 'M(q)는 관성 모멘트 행렬이므로 무거운 팔을 빠르게 가속(q̈↑)시킬수록 관성 토크 요구량이 급증합니다.',
      },
      {
        id: 'P3D24-3',
        question: '서보 데이터시트의 Stall Torque(구속 토크)가 20 kg·cm일 때 실무 설계에서 목표로 삼아야 할 최대 허용 부하 토크는?',
        options: [
          '정확히 20 kg·cm까지 꽉 채워 쓴다',
          '안전율(SF ≥ 1.5~2.0)을 적용해 약 10~13 kg·cm 이하로 제한한다',
          '40 kg·cm까지 전압을 높여 쓴다',
          '0.1 kg·cm 미만만 쓴다',
        ],
        correctIndex: 1,
        explanation: '스톨 토크는 과열·기어 파손 직전 한계이므로 가속 토크·마찰·전압 강하를 감안해 SF 1.5~2배 여유가 필수입니다.',
      },
      {
        id: 'P3D24-4',
        question: '로봇 팔 끝단의 관성 모멘트(I = m r²)를 절반 이상 줄여 더 빠르고 가벼운 팔을 만드는 기구 설계법은?',
        options: [
          '무거운 팔꿈치/손목 모터를 팔 끝이 아닌 베이스 관절 옆으로 옮기고 벨트·로드로 구동한다',
          '팔 끝단에 무거운 납 추를 달아둔다',
          '링크 길이를 2배로 늘린다',
          '베어링 대신 나사를 꽉 조인다',
        ],
        correctIndex: 0,
        explanation: '관성은 회전 반경 r의 제곱에 비례하므로 무거운 액추에이터를 회전축(베이스) 가까이 배치하면 동적 부하가 크게 줄어듭니다.',
      },
      {
        id: 'P3D24-5',
        question: '단위 환산: 1.0 N·m의 토크를 취미용 서보 데이터시트에서 흔히 쓰는 kg·cm 단위로 바꾸면 약 얼마인가요? (g ≈ 9.8 m/s²)',
        options: ['약 1.0 kg·cm', '약 10.2 kg·cm', '약 100 kg·cm', '약 0.1 kg·cm'],
        correctIndex: 1,
        explanation: '1 N·m = (1 / 9.8) kgf × 100 cm ≈ 10.2 kg·cm입니다.',
      },
    ],
  },
  {
    id: 'day25_arm_project',
    order: 25,
    dayLabel: 'Day 25',
    phaseLabel: 'Phase 3 · 수학/기구학',
    title: '[Phase 3 미니 프로젝트] 로봇 팔 좌표 이동 & 토크 검증기',
    shortTitle: 'D25 · 3D 팔 종합검증',
    subtitle: '목표 (x, y) → 2R 역기구학 + 특이점 det(J) + 중력 토크 3단계 게이트',
    badge: 'Phase 3 프로젝트',
    milestoneTag: 'Day 25 3D 로봇 팔 검증기',
    failFirstHook:
      '작업공간 안쪽이고 역기구학 해가 존재하더라도, 특이점 경계나 서보 정격 토크 한계를 동시에 체크하지 않고 움직이면 실제 로봇 팔이 부르르 떨다 주저앉습니다.',
    beginnerAnalogy:
      'Phase 3에서 배운 라디안/atan2, SE(3), 2R 순/역기구학, 야코비안 특이점, 중력 동역학 토크까지 4가지 검증 필터를 통과해야만 실제 서보에 이동 명령을 내리는 엔지니어링 관제실입니다.',
    overviewSummary:
      '3D 뷰포트에서 목표 좌표 (x, y) 구슬, Elbow-Up/Down 자세, 끝단 페이로드 무게, 서보 정격 토크를 조절하며 1) 작업공간 도달 판정(|D|≤1), 2) 특이점 안전(|det J|), 3) 중력 토크 안전율(SF≥1.5) 3단계 검사를 모두 통과시켜 보세요.',
    guidedMissions: [
      {
        id: 'd25-reach',
        title: '목표 좌표를 작업공간 밖(r > L₁+L₂)으로 찍어 도달 불가 방어 확인하기',
        hint: 'Target X 또는 Y를 크게 늘려 r > 3.1이 되게 하면 IK 방어가 작동합니다.',
      },
      {
        id: 'd25-singular',
        title: '작업공간 경계(θ₂ ≈ 0°) 근처에서 특이점 경고 확인 후 안전한 안쪽 좌표로 이동하기',
        hint: 'Elbow-Up/Down 전환 및 원점 거리 r ≈ 2.2 부근의 안전 구역으로 목표점을 잡아보세요.',
      },
      {
        id: 'd25-torque',
        title: '페이로드 증가로 토크 초과를 유발한 뒤 정격 토크를 올려 3단계 ALL PASS 달성하기',
        hint: '페이로드를 올렸다가 모터 정격 토크(N·m)를 높여 3가지 검증을 모두 초록색으로 만드세요.',
      },
    ],
    highlights: [
      {
        title: 'Gate 1: 작업공간 검증 (|D| ≤ 1)',
        body: '목표 거리 r = √(x² + y²)가 |L₁-L₂| ≤ r ≤ L₁+L₂ 범위를 벗어나면 절대 sqrt(음수)를 실행하지 않고 즉시 안전 정지(NaN 방어)합니다.',
        tone: 'cyan',
      },
      {
        title: 'Gate 2: 야코비안 특이점 경계 (|sin θ₂| > 0.15)',
        body: '작업공간 겉테두리에 아슬아슬하게 닿아 θ₂ ≈ 0°가 되면 직선 보간 시 관절 각속도가 폭주하므로 최소 8~10° 안쪽 안전 마진을 둡니다.',
        tone: 'amber',
      },
      {
        title: 'Gate 3: 최대 정적/동적 토크 vs 서보 정격 (SF ≥ 1.5)',
        body: '페이로드 + 링크 무게가 만들어내는 수평 방향 최대 베이스 토크가 모터 정격의 67% 이내(안전율 1.5 이상)일 때만 이동을 승인합니다.',
        tone: 'emerald',
      },
    ],
    formulas: [
      {
        title: '3단계 종합 안전 판정 파이프라인',
        latex: String.raw`|D| \le 1 \;\land\; |\sin\theta_2| > 0.15 \;\land\; \frac{\tau_{\text{rated}}}{\tau_{\text{req}}} \ge 1.5 \;\Longrightarrow\; \text{MOVE APPROVED}`,
        description: '세 조건 중 하나라도 실패하면 서보 지령을 차단하고 원인 경고를 출력합니다.',
      },
      {
        title: '2축 로봇 팔 베이스 최대 정적 토크',
        latex: String.raw`\tau_1 \approx m_1 g \frac{L_1}{2}\cos\theta_1 + m_2 g \left(L_1\cos\theta_1 + \frac{L_2}{2}\cos(\theta_1+\theta_2)\right) + m_p g x_{\text{target}}`,
        description: '엔드이펙터가 원점에서 수평 거리 x만큼 멀어질수록 페이로드 토크(m_p·g·x)가 직선 비례 증가합니다.',
      },
    ],
    specs: [
      { label: '도달 영역(현재)', value: '0.5 ≤ r ≤ 3.1', note: 'L₁=1.8, L₂=1.3 기준', tone: 'cyan' },
      { label: '특이점 마진', value: '|θ₂| ≥ 9°', note: '|sin θ₂| ≥ 0.15 권장', tone: 'amber' },
      { label: '토크 합격선', value: 'SF ≥ 1.5×', note: '동적 가속 여유 포함', tone: 'emerald' },
      { label: 'Elbow 형상', value: 'Up vs Down', note: '장애물 충돌 회피 선택', tone: 'cyan' },
    ],
    wiringNotes: [
      {
        signal: 'Elbow-Up / Down 급변 방지',
        pin: '연속 경로 이동 중 부호 고정 유지',
        detail: '같은 (x, y)를 훑고 지나가는데 중간 프레임에서 갑자기 Elbow-Up → Down으로 부호를 바꾸면 팔이 180° 채찍질하듯 뒤집어져 위험합니다.',
      },
      {
        signal: '궤적 보간 (S-Curve / Trapezoidal)',
        pin: 'θ(t) 목표 각도를 20ms마다 조금씩 분할 이동',
        detail: '한 번에 90° 점프를 명령하면 스톨 전류가 치솟고 진동하므로, 50Hz 루프에서 부드러운 램프 보간으로 이동합니다.',
      },
    ],
    codeTitle: 'day25_arm_motion_validator.cpp',
    codeLanguage: 'cpp',
    codeSnippet: `// Day 25: Phase 3 캡스톤 — 3단계 사전 검증기(작업공간 · 특이점 · 토크)
bool validateAndMove(float tx, float ty, float payloadKg, float ratedNm) {
  float r2 = tx * tx + ty * ty;
  float D = (r2 - L1*L1 - L2*L2) / (2.0f * L1 * L2);
  if (fabsf(D) > 1.0f) return false; // 1) 작업공간 밖 차단

  float s2 = sqrtf(fmaxf(0.0f, 1.0f - D*D));
  if (s2 < 0.15f) return false;      // 2) 특이점 경계 차단

  float reqNm = (0.35f * (L1 * 0.5f) + payloadKg * sqrtf(r2)) * 9.81f;
  if (ratedNm / reqNm < 1.5f) return false; // 3) 토크 안전율 미달 차단

  return true;
}`,
    codeChallenge: {
      prompt: '작업공간 안에 있는 목표점으로 이동하려다 실수로 작업공간 경계(θ₂ = 1°)를 지령하는 것을 막기 위한 2단계 특이점 가드 코드는?',
      buggyLine: 'if (fabsf(D) <= 1.0f) moveArm(); // 특이점 미검사!',
      options: [
        'if (fabsf(D) <= 1.0f && sqrtf(1.0f - D*D) >= 0.15f) moveArm();',
        'if (fabsf(D) > 1.0f) moveArm();',
        'if (D == 1.0f) moveArm();',
      ],
      correctIndex: 0,
      explanation: '√(1 - D²) = |sin θ₂|이므로 이 값이 0.15 이상인 안전한 내부 작업공간에서만 이동을 허가해야 특이점 폭주를 막습니다.',
    },
    quizzes: [
      {
        id: 'P3D25-1',
        question: 'L₁ = 1.8m, L₂ = 1.3m인 2R 로봇 팔이 목표 (3.5, 0.0)을 지령받았을 때 가장 먼저 실행되어야 할 안전 가드는?',
        options: [
          '토크 계산 후 모터를 최대 전류로 구동한다',
          '|D| > 1.0 도달 불가 판정으로 역기구학 NaN을 차단하고 이동을 거부한다',
          'θ₁을 360도로 강제 설정한다',
          'Elbow-down으로 부호만 바꾼다',
        ],
        correctIndex: 1,
        explanation: '최대 반경 L₁+L₂ = 3.1m를 넘기므로 sqrt(1-D²)에서 NaN이 나지 않도록 Gate 1에서 먼저 차단해야 합니다.',
      },
      {
        id: 'P3D25-2',
        question: '연속 작업 중 목표 지점이 팔 뒤쪽을 스쳐 갈 때, Elbow-up(θ₂>0)과 Elbow-down(θ₂<0) 사이를 매 틱 무작위로 바꾸면 어떤 사고가 나나요?',
        options: [
          '배터리가 충전된다',
          '팔꿈치가 180° 반대로 순식간에 뒤집히는 급격한 자세 반전(Flip)으로 충돌한다',
          '정확도가 2배 높아진다',
          'I2C 주소가 바뀐다',
        ],
        correctIndex: 1,
        explanation: '두 역기구학 해 사이에는 거대한 관절 각도 차이가 있으므로 현재 관절 각도와 가장 가까운 형상(최소 Δθ)을 유지해야 합니다.',
      },
      {
        id: 'P3D25-3',
        question: '같은 (x, y) = (2.0, 0.0) 지점까지 팔을 뻗어 1kg 물체를 들 때, 필요 중력 토크를 결정짓는 핵심 거리 값은?',
        options: [
          '로봇 뒤쪽 창고까지의 거리',
          '베이스 회전축으로부터 물체 무게중심까지의 수평 모멘트 팔 거리 x (2.0m)',
          '바닥에서 천장까지의 높이',
          '서보 케이블의 길이',
        ],
        correctIndex: 1,
        explanation: '중력은 수직 아래로 작용하므로 수평 직교 거리 x = r·cosθ에 페이로드 무게가 곱해져 토크가 됩니다.',
      },
      {
        id: 'P3D25-4',
        question: '목표 지점 (x, y)는 도넛 영역 안에 있고 특이점(|sin θ₂|>0.15)도 통과했지만, 3단계 검증에서 이동이 거부될 수 있는 경우는?',
        options: [
          '요구 중력 토크가 서보 정격 토크(안전율 1.5x 반영)를 초과할 때',
          '좌표가 정수일 때',
          'θ₁이 양수일 때',
          '라디안 단위를 사용했을 때',
        ],
        correctIndex: 0,
        explanation: '기구학적으로 닿더라도 동역학적으로 토크가 부족하면 팔이 처지며 모터가 손상되므로 반드시 Gate 3에서 차단합니다.',
      },
      {
        id: 'P3D25-5',
        question: '로봇 팔이 부드럽게 가감속하며 목표 (x, y)에 도달하게 하려면 관절 목표 지령을 어떻게 인가하는 것이 정석인가요?',
        options: [
          '즉시 최종 각도를 한 번에 쏴서 최고 속도로 퉁 부딪치게 한다',
          'S-커브 또는 사다리꼴 속도 프로파일로 작은 각도 단계씩 보간하여 전달한다',
          'delay(5000)을 걸어둔다',
          '전원을 껐다 켠다',
        ],
        correctIndex: 1,
        explanation: '시간에 따른 부드러운 궤적 생성(Trajectory Generation)을 적용해야 관성 충격(Jerk)과 과전류를 막을 수 있습니다.',
      },
    ],
  },
];
