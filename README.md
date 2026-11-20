# Robotics Quest Lab (`robot-simulator`)

직류 전기와 브레드보드 기초부터 ESP32 펌웨어·기구학·동역학·PID·칼만 필터·ROS 2·SLAM·PCB 설계까지, **총 45일 풀스택 로보틱스 커리큘럼**을 인터랙티브 하드웨어 SVG 벤치와 3D 시뮬레이터로 학습하는 웹 앱(PWA)입니다.

---

## 핵심 특징

- **45일 전 과정 100% 라이브 실습실 연결**: Day 01 ~ Day 45 전 일차(`44`개 고유 실습 모듈 · Day 21/22 `kinematics` 공용)
- **Wokwi / Fritzing급 실물 하드웨어 SVG 벤치**: MB-102 브레드보드 내부 구리 레일 투시(X-Ray), ESP32 DevKit V1 30-Pin 인스펙터, 저항·LED·멀티미터·오실로스코프·H-브리지·로직 애널라이저
- **아이소메트릭 3D 뷰포트 (`Three.js / R3F`)**: 3축 오일러 짐벌락 vs 쿼터니언 회전(`Day 18`), 2R 로봇 팔 FK/IK(`Day 21~22`), 3단계 토크/특이점 검증기(`Day 25`), HC-SR04 초음파 레이더(`Day 26`), 이산 PID 서보 벤치(`Day 30`)
- **Playgrounds 스타일 학습 루프**:
  - 실패 사례 직관(`Fail First Hook`) + 10초 일상 비유
  - 파라미터 조작으로 자동 완료되는 **가이드 미션** (`localStorage` 영속화 + EXP)
  - KaTeX 공학 수식, 실전 C++/Python 코드 챌린지(버그 수정), **220개 고유 퀴즈** 및 오답 복습 큐
- **Stripe / Linear 스타일 미니멀 워크스페이스**: 명도 계층(`#FFFFFF` / `#F7F8FA`), 1px 헤어라인(`#E6E8EC`), `#635BFF` 단일 포인트 컬러

---

## 6개 Phase · 45일 커리큘럼 구성

| Phase | 기간 | 핵심 주제 | 실습실 수 |
| :--- | :--- | :--- | :---: |
| **Phase 1** | Days 01–07 | 직류 전기 · 브레드보드/멀티미터 · 디지털 풀업 · 12-bit ADC/PWM · 전압 분배기 · 배터리/벅 컨버터 · 위험 감지기 프로젝트 | 7 |
| **Phase 2** | Days 08–16 | ESP32 해부/부트 · 30-Pin 안전 규율 · `millis()` 논블로킹 · FSM · UART/I2C/SPI · 액추에이터 · H-브리지 · FreeRTOS/무선 · RC 로버 | 9 |
| **Phase 3** | Days 17–25 | `atan2`/벡터 · 3D 회전/짐벌락/쿼터니언 · CAD/3D프린팅 공차 · 차동구동 ICR · 2R FK/IK · 야코비안/특이점 · 동역학 토크 · 3D 팔 검증기 | 8 |
| **Phase 4** | Days 26–34 | HC-SR04 ToF · 직교 엔코더/오도메트리 · IMU 진동/드리프트 · LPF/상보 필터 · 디지털 PID/와인드업 · 궤적/Pure Pursuit · 칼만 필터 · 직진 로버 | 9 |
| **Phase 5** | Days 35–42 | Python↔ESP32 바이너리/CRC8 · C-Space/A\*/DWA · ROS 2 QoS · TF2/URDF · OpenCV HSV/ArUco · MCL 파티클 필터 · Log-Odds SLAM · 미로 자율주행 | 8 |
| **Phase 6** | Days 43–45 | KiCad PCB 트레이스/디커플링/GND 플레인 · 5분 격리 디버깅 & DC 모터 EMI 억제 · 자율 픽앤플레이스 모바일 매니퓰레이터 졸업 캡스톤 | 3 |

---

## 폴더 구조

- `robotics-lab/` — Vite + React + TypeScript + Three.js(R3F) + Tailwind CSS + PWA 학습 웹 앱
  - `src/components/hardware/` — Phase 1~6 실물 SVG 하드웨어·오실로스코프·그리드 벤치 (`HardwarePartsSvg.tsx`, `Phase1~4...`, `Phase5AutonomyScenes.tsx`, `Phase6CapstoneScenes.tsx`)
  - `src/components/viewport/` — R3F 3D 공간 시뮬레이터 (`PlanarArm3D.tsx`, `RotationGimbal3D.tsx`, `ArmProject3D.tsx`, `UltrasonicRig3D.tsx`, `PidServoRig3D.tsx`)
  - `src/data/` — 45일 로드맵(`roadmap45.ts`), ESP32 30-Pin 데이터(`esp32Pins.ts`), Phase별 모듈(`curriculum.ts`, `phase1ExtraModules.ts` ~ `phase6Modules.ts`)
  - `docs/milestones.md` — Step 1~6 마일스톤 로드맵
  - `docs/worklog.md` — 단계별 개발 작업 일지
- `esp32-robotics-control-guide.md` — 공학 명세 기준 문서
- `*.pdf` — 참고 하드웨어 데이터시트 (`esp32_datasheet_en.pdf`, `HCSR04.pdf`, `RM-MPU-6000A.pdf`, `ultrasonic-sonar-distance-sensors.pdf`)

---

## 로컬 실행 및 빌드 검증

```bash
cd robotics-lab
npm install
npm run dev
```

프로덕션 빌드 검증 (`tsc -b && vite build`):

```bash
cd robotics-lab
npm run build
```
