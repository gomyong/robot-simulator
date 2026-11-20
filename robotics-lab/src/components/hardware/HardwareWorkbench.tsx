import { Layers, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';
import { LabPreviewState, ModuleId } from '../../types/lab';
import {
  Day01HardwareScene,
  Day02HardwareScene,
  Day03HardwareScene,
  Day04HardwareScene,
  Day05HardwareScene,
  Day06HardwareScene,
  Day07HardwareScene,
  Esp32HardwareScene,
} from './Phase1HardwareScenes';
import {
  Day08BoardScene,
  Day10NonBlockingScene,
  Day11FsmScene,
  Day12CommsScene,
  Day13ActuatorsScene,
  Day14HbridgeScene,
  Day15RtosWirelessScene,
  Day16RoverScene,
} from './Phase2HardwareScenes';
import {
  Day17MathScene,
  Day19CadToleranceScene,
  Day20MobileKinematicsScene,
  Day23JacobianScene,
  Day24DynamicsScene,
} from './Phase3MathMechScenes';
import {
  Day27EncoderOdomScene,
  Day28ImuScene,
  Day29SensorFusionScene,
  Day31PidAdvancedScene,
  Day32TrajectoryScene,
  Day33KalmanScene,
  Day34FusionProjectScene,
} from './Phase4ControlFusionScenes';
import {
  Day35PythonBridgeScene,
  Day36PathPlanningScene,
  Day37Ros2ArchScene,
  Day38Tf2UrdfScene,
  Day39VisionScene,
  Day40MclParticleScene,
  Day41SlamGridScene,
  Day42MazeProjectScene,
} from './Phase5AutonomyScenes';
import {
  Day43PcbDesignScene,
  Day44DebuggingScene,
  Day45CapstoneScene,
} from './Phase6CapstoneScenes';

interface HardwareWorkbenchProps {
  activeModuleId: ModuleId;
  preview: LabPreviewState;
  onChangePreview: (patch: Partial<LabPreviewState>) => void;
  selectedPinId: string | null;
  onSelectPin: (pinId: string) => void;
  onToggleExploded: () => void;
}

const LABELS: Partial<Record<ModuleId, string>> = {
  day01_basics: 'Day 01 · 실물 부품 & LED 안전 회로',
  day02_breadboard: 'Day 02 · MB-102 브레드보드 & 디지털 멀티미터',
  day03_digital: 'Day 03 · ESP32 디지털 입력 & 10kΩ 풀업',
  day04_adc_pwm: 'Day 04 · 12-bit ADC 노브 & 오실로스코프 PWM',
  day05_divider: 'Day 05 · HC-SR04 5V → ESP32 3.3V 전압 분배',
  day06_power: 'Day 06 · 배터리 팩 & LDO / LM2596 벅 컨버터',
  day07_project: 'Day 07 · 스마트 위험 감지기 통합 브레드보드',
  day08_board: 'Day 08 · ESP32 DevKit V1 보드 해부 & 부트 시퀀스',
  esp32: 'Day 09 · ESP32 DevKit V1 (30-Pin 인터랙티브 보드)',
  day10_nonblocking: 'Day 10 · delay() 블로킹 vs millis() 멀티태스킹',
  day11_fsm: 'Day 11 · 유한 상태 머신(FSM) 자율 상태 전이',
  day12_comms: 'Day 12 · UART / I2C / SPI 통신 버스 분석기',
  day13_actuators: 'Day 13 · DC · 서보 · 스테퍼 액추에이터 & 기어 토크',
  day14_hbridge: 'Day 14 · H-브리지 4-MOSFET 정·역회전 & 관통 단락',
  day15_rtos_wireless: 'Day 15 · 듀얼코어 FreeRTOS · ISR & ESP-NOW 무선 제어',
  day16_rover_project: 'Day 16 · 무선 RC 로버 전원 분리 & Failsafe 캡스톤',
  day17_math: 'Day 17 · 라디안 · atan2 사분면 보존 · 벡터 내/외적',
  day19_cad_tolerance: 'Day 19 · CAD & 3D 프린팅 끼워맞춤 공차(mm) 단면 벤치',
  day20_mobile_kinematics: 'Day 20 · 차동 구동 (v, ω)↔(vL, vR) & 순간 회전 중심(ICR)',
  day23_jacobian: 'Day 23 · 2R 야코비안(J) 조작성 타원 & 특이점 계측기',
  day24_dynamics: 'Day 24 · 로봇 동역학 자유물체도(FBD) & 서보 토크 선정',
  day27_encoder_odom: 'Day 27 · 직교 엔코더 A/B상 4체배 & 바퀴 오도메트리',
  day28_imu: 'Day 28 · MPU-6050 IMU 가속도계 진동 vs 자이로 드리프트',
  day29_sensor_fusion: 'Day 29 · 1차 LPF(위상 지연) vs 상보 필터 융합',
  day31_pid_advanced: 'Day 31 · 실전 PID 오실로스코프 (Anti-Windup & D-LPF)',
  day32_trajectory: 'Day 32 · 사다리꼴 속도 프로파일 & Pure Pursuit 추종',
  day33_kalman: 'Day 33 · 칼만 필터(Kalman Filter) 가우시안 예측·보정 융합',
  day34_fusion_project: 'Day 34 · 엔코더 PID + IMU Yaw 직진 보정 로버 캡스톤',
  day35_python_bridge: 'Day 35 · Python ↔ ESP32 시리얼 바이너리 패킷 & CRC8',
  day36_path_planning: 'Day 36 · C-Space 장애물 팽창 · A* 탐색 · DWA 회피',
  day37_ros2_arch: 'Day 37 · ROS 2 Node · Topic · Service · Action & QoS',
  day38_tf2_urdf: 'Day 38 · ROS 2 REP-105 TF2 좌표 트리 & URDF 정적 오프셋',
  day39_vision: 'Day 39 · OpenCV HSV 색상 추적 & ArUco 3D 핀홀 거리 역산',
  day40_mcl_particle: 'Day 40 · 몬테카를로 위치 추정(MCL) & 납치 로봇 복구',
  day41_slam_grid: 'Day 41 · Log-Odds 점유 격자 SLAM & 루프 클로저',
  day42_maze_project: 'Day 42 · 미로 탐색 SLAM + C-Space A* + DWA 자율주행',
  day43_pcb_design: 'Day 43 · KiCad PCB 전원 트레이스 · 0.1µF 디커플링 · GND 플레인',
  day44_debugging: 'Day 44 · 5분 격리 디버깅(전원/부팅/I2C) & DC 모터 EMI 억제',
  day45_capstone: 'Day 45 · [졸업 캡스톤] 자율 픽앤플레이스 모바일 매니퓰레이터',
};

export function HardwareWorkbench({
  activeModuleId,
  preview,
  onChangePreview,
  selectedPinId,
  onSelectPin,
  onToggleExploded,
}: HardwareWorkbenchProps) {
  const [zoom, setZoom] = useState(1);

  const supportsXray =
    activeModuleId === 'day01_basics' ||
    activeModuleId === 'day02_breadboard' ||
    activeModuleId === 'day08_board' ||
    activeModuleId === 'esp32';

  const xrayVisible =
    activeModuleId === 'day02_breadboard' ||
    activeModuleId === 'day08_board' ||
    activeModuleId === 'esp32' ||
    (activeModuleId === 'day01_basics' && preview.day01Mode === 'circuit');

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#F4F5F7]">
      {/* Top Minimal Hardware Bench HUD */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#635BFF]" />
            <span className="text-xs font-semibold tracking-tight text-[#0A2540]">
              {LABELS[activeModuleId]}
            </span>
          </div>
          <p className="mt-0.5 pl-3.5 text-[11px] text-[#697386]">
            {activeModuleId === 'esp32'
              ? '보드 위 핀을 직접 클릭해 전기적 등급과 주의사항을 확인하세요'
              : activeModuleId === 'day08_board'
                ? '보드 위 5개 핵심 영역(WROOM/CP2102/LDO/버튼/GPIO)을 클릭해 동작을 확인하세요'
                : activeModuleId === 'day02_breadboard'
                  ? '내부 구리 레일 투시로 빵판 구멍 연결 원리를 확인하세요'
                  : '실물 부품 배선과 신호 흐름을 확인하며 우측/하단 실습 파라미터를 조작하세요'}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {activeModuleId === 'day01_basics' && (
            <div className="inline-flex items-center gap-0.5 rounded-lg border border-[#E6E8EC] bg-white p-0.5">
              <button
                type="button"
                onClick={() => onChangePreview({ day01Mode: 'anatomy' })}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                  preview.day01Mode === 'anatomy'
                    ? 'bg-[#0A2540] text-white'
                    : 'text-[#697386] hover:text-[#0A2540]'
                }`}
              >
                로봇 3요소
              </button>
              <button
                type="button"
                onClick={() => onChangePreview({ day01Mode: 'circuit' })}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                  preview.day01Mode === 'circuit'
                    ? 'bg-[#0A2540] text-white'
                    : 'text-[#697386] hover:text-[#0A2540]'
                }`}
              >
                LED 회로
              </button>
            </div>
          )}

          {supportsXray && xrayVisible && (
            <button
              type="button"
              onClick={onToggleExploded}
              className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition ${
                preview.exploded > 0.1
                  ? 'border-[#635BFF] bg-[#635BFF] text-white'
                  : 'border-[#E6E8EC] bg-white text-[#0A2540] hover:bg-[#F7F8FA]'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>
                {preview.exploded > 0.1
                  ? '일반 보기'
                  : activeModuleId === 'esp32'
                    ? '내부 Flash 보기'
                    : '내부 구리 레일 투시'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Main Scalable Interactive SVG Workbench */}
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-2 sm:p-4">
        <div
          className="h-full w-full max-w-[780px] transition-transform duration-150"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          {activeModuleId === 'day01_basics' && (
            <Day01HardwareScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day02_breadboard' && (
            <Day02HardwareScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day03_digital' && (
            <Day03HardwareScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day04_adc_pwm' && (
            <Day04HardwareScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day05_divider' && (
            <Day05HardwareScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day06_power' && (
            <Day06HardwareScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day07_project' && (
            <Day07HardwareScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day08_board' && (
            <Day08BoardScene
              preview={preview}
              onChangePreview={onChangePreview}
              selectedPinId={selectedPinId}
              onSelectPin={onSelectPin}
            />
          )}
          {activeModuleId === 'esp32' && (
            <Esp32HardwareScene
              preview={preview}
              onChangePreview={onChangePreview}
              selectedPinId={selectedPinId}
              onSelectPin={onSelectPin}
            />
          )}
          {activeModuleId === 'day10_nonblocking' && (
            <Day10NonBlockingScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day11_fsm' && (
            <Day11FsmScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day12_comms' && (
            <Day12CommsScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day13_actuators' && (
            <Day13ActuatorsScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day14_hbridge' && (
            <Day14HbridgeScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day15_rtos_wireless' && (
            <Day15RtosWirelessScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day16_rover_project' && (
            <Day16RoverScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day17_math' && (
            <Day17MathScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day19_cad_tolerance' && (
            <Day19CadToleranceScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day20_mobile_kinematics' && (
            <Day20MobileKinematicsScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day23_jacobian' && (
            <Day23JacobianScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day24_dynamics' && (
            <Day24DynamicsScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day27_encoder_odom' && (
            <Day27EncoderOdomScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day28_imu' && (
            <Day28ImuScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day29_sensor_fusion' && (
            <Day29SensorFusionScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day31_pid_advanced' && (
            <Day31PidAdvancedScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day32_trajectory' && (
            <Day32TrajectoryScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day33_kalman' && (
            <Day33KalmanScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day34_fusion_project' && (
            <Day34FusionProjectScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day35_python_bridge' && (
            <Day35PythonBridgeScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day36_path_planning' && (
            <Day36PathPlanningScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day37_ros2_arch' && (
            <Day37Ros2ArchScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day38_tf2_urdf' && (
            <Day38Tf2UrdfScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day39_vision' && (
            <Day39VisionScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day40_mcl_particle' && (
            <Day40MclParticleScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day41_slam_grid' && (
            <Day41SlamGridScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day42_maze_project' && (
            <Day42MazeProjectScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day43_pcb_design' && (
            <Day43PcbDesignScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day44_debugging' && (
            <Day44DebuggingScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
          {activeModuleId === 'day45_capstone' && (
            <Day45CapstoneScene
              preview={preview}
              onChangePreview={onChangePreview}
            />
          )}
        </div>
      </div>

      {/* Bottom Zoom Controls & Quick Day 01 Circuit Presets */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pb-3">
        <div className="flex items-center gap-0.5 rounded-lg border border-[#E6E8EC] bg-white p-0.5">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.8, Number((z - 0.15).toFixed(2))))}
            title="축소"
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#697386] hover:bg-[#F1F3F6] hover:text-[#0A2540]"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="px-2 font-mono text-[11px] tabular-nums text-[#425466]">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.6, Number((z + 0.15).toFixed(2))))}
            title="확대"
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#697386] hover:bg-[#F1F3F6] hover:text-[#0A2540]"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            title="원래 크기"
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#697386] hover:bg-[#F1F3F6] hover:text-[#0A2540]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {activeModuleId === 'day01_basics' && preview.day01Mode === 'circuit' && (
          <div className="flex items-center gap-0.5 rounded-lg border border-[#E6E8EC] bg-white p-0.5">
            {[
              { label: '0Ω 직결', r: 0 },
              { label: '220Ω 안전', r: 220 },
              { label: '1kΩ', r: 1000 },
            ].map((opt) => (
              <button
                key={opt.r}
                type="button"
                onClick={() => onChangePreview({ circuitResistanceOhm: opt.r })}
                className={`rounded-md px-2 py-1 font-mono text-[11px] font-medium transition ${
                  preview.circuitResistanceOhm === opt.r
                    ? 'bg-[#635BFF] text-white'
                    : 'text-[#425466] hover:text-[#0A2540]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
