# Robotics Quest Lab — 개발 작업 일지 (Worklog)

기준 마일스톤 문서: [milestones.md](./milestones.md)

---

## 2026-11-20 · Step 1 ~ Step 6 전 45일 과정 완성

### 1. UI / 시각화 방향 전환 및 디자인 개편 (Step 1)
- **기존 문제**: 초기 다크 카드 나열형 UI와 과도한 드롭섀도우, 단순 도형 기반 3D 뷰포트로 인해 학습 몰입도와 시각적 정갈함이 떨어짐.
- **개선 내역**:
  - **Stripe / Linear 톤 라이트 워크스페이스** 적용: `#FFFFFF` 메인 캔버스, `#F7F8FA` 보조 패널, `1px` `#E6E8EC` 헤어라인 구분선, `#0A2540` 기본 잉크, `#635BFF` 단일 포인트 컬러로 정리.
  - **하이브리드 뷰포트 전략**: 회로·보드·오실로스코프·그리드 알고리즘 랩은 **Wokwi/Fritzing 스타일 정밀 인터랙티브 SVG 벤치**(`HardwareWorkbench.tsx`)로, 공간 기하·회전·자세 검증 랩은 **아이소메트릭 Three.js 3D 뷰포트**(`LabViewport.tsx`)로 이원화.

### 2. Phase 1 · 기초 전기/보드 랩 (Step 2, Days 01–07)
- `HardwarePartsSvg.tsx` 공용 실물 부품 SVG 라이브러리 구축 (`RealBreadboardSvg`, `RealEsp32BoardSvg`, `RealResistorSvg`, `RealLedSvg`, `RealHcsr04Svg`, `RealMultimeterSvg`, `RealBatterySvg`, `JumperWire`).
- `Phase1HardwareScenes.tsx` / `phase1ExtraModules.ts`: 옴의 법칙 LED 과전류, 빵판 내부 구리 레일 X-Ray 투시, 10kΩ 풀업/플로팅 노이즈, 12-bit ADC & PWM 파형, 5V→3.3V 전압 분배기, 9V 브라운아웃 vs 벅 컨버터, Day 07 스마트 위험 감지기 통합.

### 3. Phase 2 · ESP32·임베디드 C++·액추에이터 랩 (Step 3, Days 08–16)
- `Phase2HardwareScenes.tsx` / `phase2Modules.ts`:
  - Day 08 ESP32 DevKit V1 5개 핵심 영역 해부 & `EN`/`BOOT` DTR/RTS 부트 시퀀스 오실로스코프.
  - Day 10 `delay()` 블로킹 vs `millis()` 논블로킹 타임라인, Day 11 4-상태 FSM 전이도, Day 12 UART/I2C/SPI 로직 애널라이저.
  - Day 13 DC·서보·스테퍼 기어비 토크 스톨 계산기, Day 14 H-브리지 4-MOSFET 스위칭 & 관통 단락(Shoot-through), Day 15 FreeRTOS 듀얼코어 & `IRAM_ATTR` ISR 안전성, Day 16 무선 RC 로버 500ms Failsafe 캡스톤.

### 4. Phase 3 · 로보틱스 수학·3D 회전·기구학·동역학 랩 (Step 4, Days 17–25)
- `Phase3MathMechScenes.tsx` / `phase3Modules.ts`:
  - Day 17 `atan(y/x)` 사분면 오류 vs `atan2` & 내적/외적 벡터.
  - Day 18 **`RotationGimbal3D.tsx`** 신규 3D R3F 씬: 3축 오일러 짐벌 링(`Pitch=±90°` 짐벌락) vs 단위 쿼터니언 회전축 시각화.
  - Day 19 CAD 3D 프린팅 공차(`+0.05mm` 압입 ~ `+0.35mm` 여유) 단면 벤치, Day 20 차동 구동 `(v, ω) ↔ (vL, vR)` & `ICR` 궤적.
  - Day 21~22 기존 `PlanarArm3D.tsx`에 **IK 목표 `(X, Y)` 역기구학 모드 & Elbow-Up/Down** 업그레이드.
  - Day 23 실시간 2R 야코비안 조작성 타원(Manipulability Ellipsoid) & `det(J)=0` 특이점, Day 24 FBD 중력 토크 & 서보 안전율 선정, Day 25 **`ArmProject3D.tsx`** 3단계 게이트(도달·특이점·토크) 3D 검증기.

### 5. Phase 4 · 센서·필터·PID·상태 추정 랩 (Step 5, Days 26–34)
- `Phase4ControlFusionScenes.tsx` / `phase4Modules.ts`:
  - Day 27 직교 엔코더 A/B상 4체배 오실로스코프 & 바퀴 슬립 10m 오도메트리 드리프트.
  - Day 28 MPU-6050 가속도계 진동 vs 자이로 바이어스 드리프트 & 영점 캘리브레이션, Day 29 1차 LPF(Phase Lag) vs 98% 상보 필터.
  - Day 31 실시간 120스텝 이산 PID 스텝 응답 오실로스코프(외란 구속 적분 와인드업 vs Anti-Windup 클램핑 & D-Term LPF).
  - Day 32 사다리꼴 속도 프로파일 & Pure Pursuit `Lookahead L_d` 튜닝, Day 33 칼만 필터(`Q` vs `R`) 가우시안 융합 & 칼만 이득 `K`, Day 34 엔코더 PID + IMU Yaw 직진 보정 로버.

### 6. Phase 5–6 · 자율주행·ROS 2·SLAM·PCB·졸업 캡스톤 (Step 6, Days 35–45)
- `Phase5AutonomyScenes.tsx` / `Phase6CapstoneScenes.tsx` / `phase5Modules.ts` / `phase6Modules.ts`:
  - Day 35 Python↔ESP32 `struct.pack` 바이너리 브릿지 & CRC8 변조 방어.
  - Day 36 `10×7` 실시간 A\* 엔진 + C-Space 반지름 팽창 + DWA 회피, Day 37 ROS 2 Topic/Service/Action & QoS 비교, Day 38 REP-105 TF2 트리 & Static TF 정합.
  - Day 39 저조도 HSV vs RGB 마스킹 & ArUco 핀홀 3D 거리 역산, Day 40 MCL 파티클 필터 4단계(전역 살포/다봉 가설/수렴/납치 복구), Day 41 Log-Odds SLAM & 루프 클로저, Day 42 미로 자율주행 통합.
  - Day 43 KiCad PCB 3A 트레이스 폭·0.1µF 디커플링·GND 플레인, Day 44 5분 격리 디버깅 & DC 모터 EMI 억제, Day 45 자율 픽앤플레이스 모바일 매니퓰레이터 최종 캡스톤.

### 최종 검증 지표
- `cd robotics-lab && npm run build` (`tsc -b && vite build`): 0 에러 통과 (`2198 modules transformed`, `dist/sw.js` PWA 생성)
- 전 커리큘럼 연결: **45 / 45일 100% 라이브 실습실 매핑** (`44`개 고유 모듈 · `220`개 고유 퀴즈 · `44`개 코드 챌린지)
