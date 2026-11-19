# Robotics Design Lab (`robot-simulator`)

ESP32 하드웨어 · 2축 평면 로봇 팔 기구학(FK/IK) · HC-SR04 초음파 ToF · 이산 시간 PID 제어를 3D로 학습하는 인터랙티브 웹 시뮬레이터(iPad PWA 대응) 프로젝트입니다.

## 폴더 구조

- `robotics-lab/` — Vite + React + TypeScript + Three.js(R3F) + Tailwind CSS + PWA 학습 웹 앱 (현재 **마일스톤 1** 완료)
  - `docs/milestones.md` — 마일스톤 0~4 개발 로드맵
- `esp32-robotics-control-guide.md` — NotebookLM 기반 공학 명세 및 20문항 퀴즈 기준 문서
- `*.pdf` — 참고 데이터시트 (`esp32_datasheet_en.pdf`, `HCSR04.pdf`, `RM-MPU-6000A.pdf`, `ultrasonic-sonar-distance-sensors.pdf`)

## 로컬 실행 방법 (다른 PC에서 이어하기)

```bash
cd robotics-lab
npm install
npm run dev
```

프로덕션 빌드 검증:

```bash
cd robotics-lab
npm run build
```
