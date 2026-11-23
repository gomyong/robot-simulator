export type ModuleId =
  | 'day01_basics'
  | 'day02_breadboard'
  | 'day03_digital'
  | 'day04_adc_pwm'
  | 'day05_divider'
  | 'day06_power'
  | 'day07_project'
  | 'day08_board'
  | 'esp32'
  | 'day10_nonblocking'
  | 'day11_fsm'
  | 'day12_comms'
  | 'day13_actuators'
  | 'day14_hbridge'
  | 'day15_rtos_wireless'
  | 'day16_rover_project'
  | 'day17_math'
  | 'day18_rotation3d'
  | 'day19_cad_tolerance'
  | 'day20_mobile_kinematics'
  | 'kinematics'
  | 'day23_jacobian'
  | 'day24_dynamics'
  | 'day25_arm_project'
  | 'ultrasonic'
  | 'day27_encoder_odom'
  | 'day28_imu'
  | 'day29_sensor_fusion'
  | 'pid'
  | 'day31_pid_advanced'
  | 'day32_trajectory'
  | 'day33_kalman'
  | 'day34_fusion_project'
  | 'day35_python_bridge'
  | 'day36_path_planning'
  | 'day37_ros2_arch'
  | 'day38_tf2_urdf'
  | 'day39_vision'
  | 'day40_mcl_particle'
  | 'day41_slam_grid'
  | 'day42_maze_project'
  | 'day43_pcb_design'
  | 'day44_debugging'
  | 'day45_capstone';

export type TabId = 'overview' | 'controls' | 'pinout' | 'code' | 'quiz';

export type AppView = 'roadmap' | 'lab';

export type PhaseId =
  | 'phase1'
  | 'phase2'
  | 'phase3'
  | 'phase4'
  | 'phase5'
  | 'phase6';

export type SkillDomainId =
  | 'mechanical'
  | 'electronics'
  | 'embedded'
  | 'programming'
  | 'control'
  | 'ai_perception';

export type CameraPreset = 'iso' | 'front' | 'top' | 'reset';

export type PinSafetyCategory =
  | 'safe'
  | 'input_only'
  | 'strapping'
  | 'prohibited'
  | 'power';

export interface Esp32PinSpec {
  id: string;
  label: string;
  gpio: number | null;
  side: 'left' | 'right' | 'internal';
  headerIndex: number; // 0..14 on DevKit V1 30-pin
  category: PinSafetyCategory;
  categoryLabel: string;
  roles: string[];
  adcChannel?: 'ADC1' | 'ADC2';
  pwmCapable: boolean;
  internalPullResistor: boolean;
  bootGlitchWarning?: boolean;
  summary: string;
  caution?: string;
}

export interface FormulaItem {
  title: string;
  latex: string;
  description: string;
}

export interface SpecCardItem {
  label: string;
  value: string;
  note?: string;
  tone?: 'cyan' | 'emerald' | 'amber' | 'rose';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface GuidedMission {
  id: string;
  title: string;
  hint: string;
}

export interface CodeChallenge {
  prompt: string;
  buggyLine: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
  explanation: string;
}

export interface LabModule {
  id: ModuleId;
  order: number;
  dayLabel: string;
  phaseLabel: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  badge: string;
  milestoneTag: string;
  failFirstHook: string;
  beginnerAnalogy: string;
  overviewSummary: string;
  guidedMissions: GuidedMission[];
  highlights: {
    title: string;
    body: string;
    tone: 'cyan' | 'emerald' | 'amber' | 'rose';
  }[];
  formulas: FormulaItem[];
  specs: SpecCardItem[];
  wiringNotes: {
    signal: string;
    pin: string;
    detail: string;
    warning?: string;
  }[];
  codeTitle: string;
  codeLanguage: string;
  codeSnippet: string;
  codeChallenge: CodeChallenge;
  quizzes: QuizQuestion[];
}

export interface CurriculumPhase {
  id: PhaseId;
  order: number;
  title: string;
  shortTitle: string;
  dayRange: string;
  goal: string;
  accent: 'sky' | 'emerald' | 'amber' | 'violet' | 'rose' | 'indigo';
  miniProjectTitle: string;
}

export interface CurriculumDay {
  day: number;
  phaseId: PhaseId;
  title: string;
  subtitle: string;
  durationMin: number;
  isMiniProject?: boolean;
  skillDomains: SkillDomainId[];
  skillTags: string[];
  failFirstHook: string;
  beginnerAnalogy: string;
  learningGoals: [string, string, string];
  linkedLabModuleId?: ModuleId;
}

export interface SkillDomainCoverage {
  id: SkillDomainId;
  groupLabel: 'Hardware & Mechanics' | 'Software & Intelligence';
  title: string;
  titleKo: string;
  skills: {
    name: string;
    days: number[];
  }[];
}

export interface LabPreviewState {
  exploded: number; // 0..1
  wifiActive: boolean;
  armTheta1Deg: number;
  armTheta2Deg: number;
  armL1: number;
  armL2: number;
  sonarDistanceCm: number;
  sonarSweepDeg: number;
  pidSetpointDeg: number;
  pidKp: number;
  pidKi: number;
  pidKd: number;
  // Phase 1 (Days 01..07)
  day01Mode: 'anatomy' | 'circuit';
  day01FocusPart: 'sensor' | 'brain' | 'actuator';
  circuitVoltageV: number;
  circuitResistanceOhm: number;
  circuitLedVf: number;
  breadboardScenario: 'correct' | 'short_rail' | 'bridge_trench';
  multimeterMode: 'voltage' | 'resistance' | 'continuity';
  digitalPullMode: 'floating' | 'pullup' | 'pulldown';
  buttonPressed: boolean;
  adcVoltageV: number;
  pwmDutyPct: number;
  pwmFreqHz: 50 | 1000;
  dividerVinV: number;
  dividerR1K: number;
  dividerR2K: number;
  batteryType: '9v_alkaline' | 'aa_4x' | 'lipo_2s';
  regulatorType: 'ldo' | 'buck';
  motorLoadMa: number;
  projectCommonGnd: boolean;
  projectEchoDivider: boolean;
  projectLedResistor: boolean;
  projectObstacleCm: number;
  // Phase 2 (Days 08..16)
  day08FocusPart: 'wroom' | 'cp2102' | 'ams1117' | 'buttons' | 'pins';
  day08BootMode: 'normal' | 'flashing';
  day10Mode: 'delay' | 'millis';
  day10DelayMs: number;
  day11FsmState: 'IDLE' | 'PATROL' | 'AVOID' | 'ESTOP';
  day12Protocol: 'uart' | 'i2c' | 'spi';
  day12WiringError: boolean;
  day13MotorType: 'dc' | 'servo' | 'stepper';
  day13GearRatio: number;
  day13LoadKgCm: number;
  day14HbridgeMode: 'forward' | 'reverse' | 'brake' | 'coast' | 'shoot_through';
  day14CommonGnd: boolean;
  day15RtosEnabled: boolean;
  day15IsrSafe: boolean;
  day15Command: 'stop' | 'forward' | 'turn';
  day16DriveCmd: 'stop' | 'forward' | 'reverse' | 'left' | 'right';
  day16BuckSeparated: boolean;
  day16SignalLostMs: number;
  day16FailsafeEnabled: boolean;
  // Phase 3 (Days 17..25)
  day17Mode: 'angle' | 'vector';
  day17TargetX: number;
  day17TargetY: number;
  day17UseAtan2: boolean;
  day17VecAngleDeg: number;
  day18Mode: 'euler' | 'quaternion';
  day18RollDeg: number;
  day18PitchDeg: number;
  day18YawDeg: number;
  day19FitType: 'clearance' | 'transition' | 'press';
  day19HoleClearanceMm: number;
  day19WallThickMm: number;
  day20DriveArch: 'diff' | 'ackermann' | 'mecanum';
  day20LinearV: number;
  day20AngularW: number;
  day20WheelBaseM: number;
  armIkMode: boolean;
  armTargetX: number;
  armTargetY: number;
  armElbowUp: boolean;
  day23Theta1Deg: number;
  day23Theta2Deg: number;
  day23EndFxN: number;
  day23EndFyN: number;
  day24ArmLengthCm: number;
  day24AngleDeg: number;
  day24PayloadG: number;
  day24ServoRatedKgCm: number;
  day25TargetX: number;
  day25TargetY: number;
  day25ElbowUp: boolean;
  day25PayloadKg: number;
  day25JointRatedNm: number;
  // Phase 4 (Days 26..34)
  day27Direction: 'cw' | 'ccw' | 'stop';
  day27Rpm: number;
  day27WheelSlipPct: number;
  day28TrueAngleDeg: number;
  day28VibrationG: number;
  day28GyroBiasDps: number;
  day28Calibrated: boolean;
  day29FilterMode: 'raw_acc' | 'gyro_only' | 'lpf' | 'complementary';
  day29LpfAlpha: number;
  day29CfGyroWeight: number;
  day31Kp: number;
  day31Ki: number;
  day31Kd: number;
  day31AntiWindup: boolean;
  day31DerivLpf: boolean;
  day31DisturbanceStall: boolean;
  day32Mode: 'profile' | 'pursuit';
  day32MaxAccel: number;
  day32LookaheadM: number;
  day33ProcessQ: number;
  day33MeasureR: number;
  day34MotorMismatchPct: number;
  day34EncoderPid: boolean;
  day34ImuHeadingPid: boolean;
  // Phase 5 & 6 (Days 35..45)
  day35CorruptByte: boolean;
  day35CrcEnabled: boolean;
  day36CspaceInflation: boolean;
  day36DynamicObstacle: boolean;
  day36PlannerAlgo: 'astar' | 'dwa';
  day37Pattern: 'topic' | 'service' | 'action';
  day37QosReliable: boolean;
  day37PacketLossPct: number;
  day38CamOffsetCm: number;
  day38TfConfigured: boolean;
  day39ColorSpace: 'rgb' | 'hsv';
  day39LowLight: boolean;
  day39ArucoDistCm: number;
  day40MclStage: 0 | 1 | 2 | 3; // 0: global, 1: weighted, 2: converged, 3: kidnapped
  day41LoopClosure: boolean;
  day41OdomDriftDeg: number;
  day42NavMode: 'astar_only' | 'full_nav';
  day42ObstacleBlocked: boolean;
  day43TraceWidthMm: number;
  day43DecouplingClose: boolean;
  day43GndPour: boolean;
  day44DebugStage: 'power' | 'boot' | 'i2c' | 'emi';
  day44EmiFilterCaps: boolean;
  day45Stage: 'nav' | 'vision' | 'pick' | 'place';
  day45TfVerified: boolean;
  day45PowerSeparated: boolean;
}

export interface LearningProgress {
  completedDays: number[];
  completedMissions: string[];
  solvedCodeChallenges: string[];
  quizAnswers: Record<string, number>;
  warmupCompletedIds: string[];
}

export type GlossaryCategory =
  | '전기 기초'
  | '보드·핀'
  | '신호·통신'
  | '모터·기구'
  | '제어·자율'
  | '기판·디버그';

export interface GlossaryEntry {
  id: string;
  term: string;
  english?: string;
  category: GlossaryCategory;
  plainSummary: string;
  analogy?: string;
  aliases: string[];
  warmupId?: string;
}

export type WarmupVisualType =
  | 'water_pressure'
  | 'hose_flow'
  | 'valve_resistor'
  | 'closed_loop'
  | 'breadboard_rails'
  | 'mcu_brain'
  | 'gpio_legs'
  | 'digital_vs_analog'
  | 'pwm_pulse'
  | 'serial_chat';

export interface WarmupTerm {
  id: string;
  order: number;
  term: string;
  english: string;
  oneLiner: string;
  analogy: string;
  whyItMatters: string;
  boardSighting: string;
  visualType: WarmupVisualType;
  quickCheck: {
    question: string;
    options: [string, string, string];
    correctIndex: 0 | 1 | 2;
    explanation: string;
  };
}
