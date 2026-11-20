# Robotics Quest Lab — 45일 풀스택 로보틱스 개발 마일스톤 로드맵

기준 공학 명세서: [esp32-robotics-control-guide.md](../../esp32-robotics-control-guide.md)

## 커리큘럼 비전 (대학 정규 과정 + 메이커 실전 + 8-bit 퀘스트)

- **대상**: 로보틱스/전자 기초가 전혀 없는 입문자도 실제 보드(ESP32, 브레드보드, 센서, 모터 드라이버) 앞에서 당황하지 않고, 대학 학부 로보틱스(기구학·동역학·제어·상태추정·경로계획·ROS 2·SLAM)까지 45일간 완주할 수 있는 인터랙티브 학습 랩
- **학습 루프 (Swift Playgrounds + Duolingo 스타일)**:
  1. 실패 사례로 직관 잡기 (Fail First Hook)
  2. 10초 일상 비유 + 8-bit 가이드(비티) 안내
  3. 3D/회로/파형 인터랙티브 실험실 (Guided Missions)
  4. 코드 챌린지 (버그 수정 + 코드 스니펫)
  5. 디버깅 퀴즈 & 오답 복습 큐 (EXP & 진도 저장)

## 6개 Phase · 45일 커리큘럼 구조

- **Phase 1 (Days 01–07)**: 보드와 친해지기 — 직류 전기, 브레드보드·멀티미터, 디지털/플로팅, ADC/PWM, 전압 분배기, 배터리·전원 예산, 스마트 위험 감지기 미니 프로젝트
- **Phase 2 (Days 08–16)**: 로봇의 두뇌와 근육 — ESP32 보드 해부, GPIO 안전 규율, 논블로킹 C/C++, 유한 상태 머신(FSM), UART/I2C/SPI, 액추에이터, H-브리지·브라운아웃, RTOS·무선 조종, 무선 RC 로버 미니 프로젝트
- **Phase 3 (Days 17–25)**: 로보틱스 수학, 3D 기구학 & 기계 설계 — 수학 워밍업, 3D 회전/쿼터니언(SO(3)/SE(3)), CAD·3D 프린팅 공차, 바퀴 로봇 기구학, 로봇 팔 FK/IK, 야코비안, 동역학·토크 선정, 로봇 팔 검증기 미니 프로젝트
- **Phase 4 (Days 26–34)**: 센서, 피드백 제어 & 상태 추정 — 거리 센서(HC-SR04/ToF/LiDAR), 엔코더·오도메트리, IMU(MPU-6000/6050), 상보 필터, 디지털 PID, 안티 와인드업·캐스케이드 PID, 궤적 추종, 칼만 필터/EKF, 직진 보정 로봇 미니 프로젝트
- **Phase 5 (Days 35–42)**: 경로 계획, 인지, ROS 2 & SLAM — Python 시리얼 브릿지, C-Space/A*/RRT/DWA, ROS 2 아키텍처, TF2·URDF, 컴퓨터 비전(ArUco/HSV), 파티클 필터(MCL), SLAM, 미로 탐색 자율주행 미니 프로젝트
- **Phase 6 (Days 43–45)**: 나만의 기판 & 통합 캡스톤 — PCB 설계 입문(KiCad/트레이스/디커플링), 실전 격리 디버깅 마스터, 자율 픽앤플레이스 모바일 매니퓰레이터 최종 캡스톤

---

## 구현 마일스톤

### Step 1. Linear/Stripe 톤 스튜디오 UI + 아이소메트릭 3D + 45일 월드맵 + Day 01 랩 (완료)
- **목표**: 카드/그림자를 최소화한 Linear/Stripe 스타일의 깔끔한 2단 워크스페이스 + 정사영 아이소메트릭 3D 뷰포트로 개편하고, Day 01(로봇 3요소 조립 & 옴의 법칙 LED 회로) 및 기존 4개 3D 랩을 통합

### Step 2. Phase 1 (Days 02–07) 인터랙티브 회로/전원 실험실 완주 (완료)
- **목표**: Day 02~07 전체 아이소메트릭 3D 실습실 + 코드 챌린지 + 30문항 추가(누적 55문항) 구현
- **세부 구현**:
  - Day 02: 브레드보드 내부 구리 레일 투시(X-Ray) · 합선/IC 쇼트 시나리오 · 디지털 멀티미터
  - Day 03: 디지털 입력 플로팅 노이즈 시뮬레이터 · 10kΩ 풀업/풀다운 전환 · 클릭 가능 3D 푸시 버튼
  - Day 04: 12-bit ADC 가변저항 노브 · 3D 사각파 PWM 펄스폭 변환 · 1kHz 모터 / 50Hz 서보 구동
  - Day 05: 5V → 3.3V 직렬 저항 전압 분배기 · 과전압 연기 경고 및 안전 범위 검증
  - Day 06: 9V 건전지 브라운아웃 시뮬레이션 · LDO 발열 vs DC-DC 벅 컨버터 효율 비교
  - Day 07: Phase 1 미니 프로젝트 — 공통 GND · ECHO 분압 · LED 220Ω 보호 저항 3대 안전 수칙 통합 스마트 위험 감지기

### Step 3. Phase 2 (Days 08–16) ESP32 보드 해부 · 논블로킹 · FSM · 통신 · 모터 드라이버 랩 (완료)
- **목표**: Day 08 및 Days 10–16 전체 Wokwi/Fritzing급 실물 인터랙티브 SVG 실습실 + 코드 챌린지 + 40문항 추가(총 19개 라이브 실습실 · 누적 95문항) 구현
- **세부 구현**:
  - Day 08: ESP32 DevKit V1 보드 해부(WROOM-32 · CP2102 · AMS1117 · EN/BOOT) & 부트스트랩 DTR/RTS 오실로스코프 시퀀스
  - Day 10: `delay()` 블로킹 CPU 점유 vs `millis()` 논블로킹 실시간 반응성 벤치
  - Day 11: 4-상태 유한 상태 머신(`IDLE`/`PATROL`/`AVOID`/`ESTOP`) 상태 전이도 & 차체 연동
  - Day 12: UART(교차 배선) · I2C(4.7kΩ 풀업 저항) · SPI(CS 핀 분리) 버스 분석기 & 고장 주입기
  - Day 13: DC 기어드 모터 · 서보 · 스테퍼(A4988) 액추에이터 & 감속비-토크 스톨 계산기
  - Day 14: H-브리지 4-MOSFET 토폴로지(정회전/역회전/브레이크/공회전/관통 단락 쇼트) & 공통 GND 검증기
  - Day 15: ESP32 듀얼코어 FreeRTOS(Core 0 Wi-Fi / Core 1 모터 제어) · `IRAM_ATTR` ISR 안전성 & ESP-NOW 조종기
  - Day 16: Phase 2 캡스톤 — LM2596 5V 전원 분리(Brownout 방지) · D-Pad 주행 · 500ms Failsafe 워치독 2WD 무선 RC 로버

### Step 4. Phase 3 (Days 17–25) 로보틱스 수학 · 3D 회전/쿼터니언 · CAD 공차 · 차동 구동 · 야코비안 · 동역학 랩 (완료)
- **목표**: Days 17–25 전체 9일 과정 완주 (7개 신규 라이브 실습실 + Day 21/22 IK 업그레이드 + 35문항 추가 → 누적 26개 실습실 · 130문항)
- **세부 구현**:
  - Day 17: 라디안 ↔ 도 변환, `atan(y/x)` 사분면 착오 vs `atan2(y, x)` 비교기 & 벡터 내적/외적 대시보드
  - Day 18: Three.js 3D 3축 짐벌 링(`Yaw→Pitch→Roll` Pitch=±90° 짐벌락 체험) vs 단위 쿼터니언 회전축 꼬치 시각화
  - Day 19: Ø 5.0mm 축 vs 3D 프린팅 구멍 공차(`+0.05mm` 압입 ~ `+0.35mm` 여유) & 0.4mm 노즐 적층 벽 단면 벤치
  - Day 20: 차동 구동 `(v, ω) ↔ (v_L, v_R)` 바퀴 속도 & 순간 회전 중심(`ICR`) 궤적 + 애커먼/메카넘 섀시 비교
  - Day 21~22: 2R 로봇 팔 3D 뷰포트 FK + 목표 `(X, Y)` IK 역기구학 & Elbow-Up/Down 전환 업그레이드
  - Day 23: 실시간 야코비안 `J(θ)` 조작성 타원(Manipulability Ellipsoid) & 특이점(`det J = 0`) + 정역학 `τ = JᵀF`
  - Day 24: 로봇 팔 자유물체도(FBD) 중력 토크 `r = L·cos(θ)` & SG90~RDS3235 서보 안전율(SF ≥ 1.5) 선정기
  - Day 25: Phase 3 캡스톤 — 3D 로봇 팔 작업공간 도달(`|D|≤1`) · 특이점 · 페이로드 토크 3단계 검증기

### Step 5. Phase 4 (Days 26–34) 엔코더 · IMU · 상보/칼만 필터 · 실시간 PID 오실로스코프 · 직진 로버 (완료)
- **목표**: Days 26–34 전체 9일 과정 완주 (7개 신규 인터랙티브 오실로스코프/시뮬레이터 추가 → 누적 33개 실습실 · 165문항)
- **세부 구현**:
  - Day 26: HC-SR04 40kHz 3D 레이더 & 38ms 타임아웃(기존)
  - Day 27: 직교 엔코더 A/B상 90° 4체배 오실로스코프 & 바퀴 슬립 10m 오도메트리 누적 오차
  - Day 28: MPU-6050 IMU 가속도계 진동 vs 자이로 바이어스 드리프트 & 영점 캘리브레이션
  - Day 29: 1차 LPF(위상 지연 Phase Lag) vs 98% 상보 필터 파형 비교
  - Day 30: 디지털 PID 서보 3D 벤치(기존)
  - Day 31: 실시간 PID 스텝 응답 오실로스코프 — 외란 구속 시 적분 와인드업 폭주 vs Anti-Windup 클램핑 & D-term LPF
  - Day 32: 사다리꼴 속도 프로파일(a_max) & Pure Pursuit 전방 주시 거리(`L_d`) 추종 진동/코너컷팅 벤치
  - Day 33: 칼만 필터(`Q` vs `R`) 가우시안 확률 밀도 융합 & 동적 칼만 이득(`K`) 실시간 게이지
  - Day 34: Phase 4 캡스톤 — 좌/우 모터 편차(12%) 극복 엔코더 속도 PID + IMU Yaw 보정 직진 로버 트랙 시뮬레이터

### Step 6. Phase 5–6 (Days 35–45) A*/RRT/SLAM 격자 · ROS 2 TF2 · PCB · 졸업 캡스톤 (완료)
- **목표**: Days 35–45 전 과정(11개 신규 라이브 실습실 추가 → **Day 01~Day 45 전 45일 커리큘럼 100% 라이브 랩 연결 · 44개 모듈 · 220문항 완주**)
- **세부 구현**:
  - Day 35: Python ↔ ESP32 시리얼 `struct.pack` 바이너리 브릿지 & CRC8 무결성 방어기
  - Day 36: 실시간 10×7 C-Space 반지름 팽창 + A* 최단 경로 + DWA 돌발 장애물 회피 그리드
  - Day 37: ROS 2 Topic / Service / Action 그래프 & Best-Effort vs Reliable QoS 병목 실험
  - Day 38: ROS 2 REP-105 TF2 좌표 트리(`map→odom→base_link→laser_link`) Static TF 오프셋 정합
  - Day 39: OpenCV 저조도 RGB 실패 vs HSV Hue 분리 성공 & ArUco 핀홀 3D 거리 역산
  - Day 40: 몬테카를로 파티클 필터(MCL) 전역 살포 → 다봉 가설 → 리샘플링 → 납치 복구 4단계
  - Day 41: Log-Odds 점유 격자 SLAM & 루프 클로저(Loop Closure) 이중 벽 정합
  - Day 42: Phase 5 캡스톤 — 미로 탐색 SLAM + C-Space A* + DWA 돌발 상자 우회 시뮬레이터
  - Day 43: KiCad PCB 3A 트레이스 폭(1.5mm+), IC 2mm 이내 0.1µF 디커플링 캡 & GND 플레인
  - Day 44: 5분 격리 진단(전원→부팅→I2C→EMI) & DC 모터 0.1µF 세라믹 캡+연선 I2C 복구
  - Day 45: **최종 졸업 캡스톤** — 전원 분리 · TF2 정합 · 자율 주행 · ArUco 비전 · 2R IK · 픽앤플레이스 모바일 매니퓰레이터 통합 관제 랩
