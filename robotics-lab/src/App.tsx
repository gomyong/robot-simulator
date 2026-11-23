import { useCallback, useEffect, useMemo, useState } from 'react';
import { GlossaryProvider } from './components/GlossaryText';
import { BoardsStudioView } from './components/boards/BoardsStudioView';
import { InspectorPanel } from './components/panels/InspectorPanel';
import { LabHeader } from './components/panels/LabHeader';
import { Phase0WarmupModal } from './components/roadmap/Phase0WarmupModal';
import { RoadmapHomeView } from './components/roadmap/RoadmapHomeView';
import { LabViewport } from './components/viewport/LabViewport';
import { LAB_MODULES } from './data/curriculum';
import {
  AppView,
  BoardId,
  LabPreviewState,
  LearningProgress,
  ModuleId,
  TabId,
} from './types/lab';

const PROGRESS_STORAGE_KEY = 'robotics-quest-progress-v1';
const LEGACY_QUIZ_KEY = 'robotics-lab-quiz-v1';

function loadInitialProgress(): LearningProgress {
  try {
    const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<LearningProgress>;
      return {
        completedDays: Array.isArray(parsed.completedDays)
          ? parsed.completedDays
          : [],
        completedMissions: Array.isArray(parsed.completedMissions)
          ? parsed.completedMissions
          : [],
        solvedCodeChallenges: Array.isArray(parsed.solvedCodeChallenges)
          ? parsed.solvedCodeChallenges
          : [],
        quizAnswers:
          parsed.quizAnswers && typeof parsed.quizAnswers === 'object'
            ? parsed.quizAnswers
            : {},
        warmupCompletedIds: Array.isArray(parsed.warmupCompletedIds)
          ? parsed.warmupCompletedIds
          : [],
        masteredBoardIds: Array.isArray(parsed.masteredBoardIds)
          ? parsed.masteredBoardIds
          : [],
      };
    }

    const legacyQuiz = localStorage.getItem(LEGACY_QUIZ_KEY);
    return {
      completedDays: [],
      completedMissions: [],
      solvedCodeChallenges: [],
      quizAnswers: legacyQuiz
        ? (JSON.parse(legacyQuiz) as Record<string, number>)
        : {},
      warmupCompletedIds: [],
      masteredBoardIds: [],
    };
  } catch {
    return {
      completedDays: [],
      completedMissions: [],
      solvedCodeChallenges: [],
      quizAnswers: {},
      warmupCompletedIds: [],
      masteredBoardIds: [],
    };
  }
}

export function App() {
  const [activeView, setActiveView] = useState<AppView>('roadmap');
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>('day01_basics');
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [selectedPinId, setSelectedPinId] = useState<string | null>('GPIO32');
  const [sketchRunning, setSketchRunning] = useState(false);
  const [glossaryModal, setGlossaryModal] = useState<{
    open: boolean;
    tab: 'warmup' | 'glossary';
    targetId?: string;
  }>({ open: false, tab: 'warmup' });
  const [preview, setPreview] = useState<LabPreviewState>({
    exploded: 0,
    wifiActive: false,
    armTheta1Deg: 35,
    armTheta2Deg: 45,
    armL1: 1.8,
    armL2: 1.3,
    sonarDistanceCm: 140,
    sonarSweepDeg: 0,
    pidSetpointDeg: 60,
    pidKp: 4.5,
    pidKi: 0.8,
    pidKd: 0.65,
    day01Mode: 'anatomy',
    day01FocusPart: 'sensor',
    circuitVoltageV: 5.0,
    circuitResistanceOhm: 220,
    circuitLedVf: 2.0,
    breadboardScenario: 'correct',
    multimeterMode: 'voltage',
    digitalPullMode: 'pullup',
    buttonPressed: false,
    adcVoltageV: 1.65,
    pwmDutyPct: 50,
    pwmFreqHz: 1000,
    dividerVinV: 5.0,
    dividerR1K: 10,
    dividerR2K: 20,
    batteryType: 'lipo_2s',
    regulatorType: 'buck',
    motorLoadMa: 600,
    projectCommonGnd: true,
    projectEchoDivider: true,
    projectLedResistor: true,
    projectObstacleCm: 55,
    day08FocusPart: 'wroom',
    day08BootMode: 'normal',
    day10Mode: 'millis',
    day10DelayMs: 500,
    day11FsmState: 'PATROL',
    day12Protocol: 'i2c',
    day12WiringError: false,
    day13MotorType: 'dc',
    day13GearRatio: 48,
    day13LoadKgCm: 2.0,
    day14HbridgeMode: 'forward',
    day14CommonGnd: true,
    day15RtosEnabled: true,
    day15IsrSafe: true,
    day15Command: 'forward',
    day16DriveCmd: 'stop',
    day16BuckSeparated: true,
    day16SignalLostMs: 120,
    day16FailsafeEnabled: true,
    day17Mode: 'angle',
    day17TargetX: -4.0,
    day17TargetY: -4.0,
    day17UseAtan2: false,
    day17VecAngleDeg: 45,
    day18Mode: 'euler',
    day18RollDeg: 20,
    day18PitchDeg: 35,
    day18YawDeg: 45,
    day19FitType: 'clearance',
    day19HoleClearanceMm: 0.3,
    day19WallThickMm: 1.6,
    day20DriveArch: 'diff',
    day20LinearV: 0.6,
    day20AngularW: 1.5,
    day20WheelBaseM: 0.3,
    armIkMode: false,
    armTargetX: 2.0,
    armTargetY: 1.2,
    armElbowUp: true,
    day23Theta1Deg: 30,
    day23Theta2Deg: 85,
    day23EndFxN: 0,
    day23EndFyN: -10,
    day24ArmLengthCm: 30,
    day24AngleDeg: 30,
    day24PayloadG: 500,
    day24ServoRatedKgCm: 20,
    day25TargetX: 2.0,
    day25TargetY: 1.0,
    day25ElbowUp: true,
    day25PayloadKg: 0.6,
    day25JointRatedNm: 25,
    day27Direction: 'cw',
    day27Rpm: 120,
    day27WheelSlipPct: 6,
    day28TrueAngleDeg: 14,
    day28VibrationG: 0.12,
    day28GyroBiasDps: 0.7,
    day28Calibrated: false,
    day29FilterMode: 'complementary',
    day29LpfAlpha: 0.84,
    day29CfGyroWeight: 0.98,
    day31Kp: 8.5,
    day31Ki: 14.0,
    day31Kd: 1.2,
    day31AntiWindup: true,
    day31DerivLpf: true,
    day31DisturbanceStall: true,
    day32Mode: 'pursuit',
    day32MaxAccel: 1.6,
    day32LookaheadM: 0.65,
    day33ProcessQ: 0.6,
    day33MeasureR: 0.5,
    day34MotorMismatchPct: 12,
    day34EncoderPid: false,
    day34ImuHeadingPid: false,
    day35CorruptByte: false,
    day35CrcEnabled: true,
    day36CspaceInflation: true,
    day36DynamicObstacle: false,
    day36PlannerAlgo: 'astar',
    day37Pattern: 'topic',
    day37QosReliable: false,
    day37PacketLossPct: 5,
    day38CamOffsetCm: 18,
    day38TfConfigured: true,
    day39ColorSpace: 'hsv',
    day39LowLight: false,
    day39ArucoDistCm: 65,
    day40MclStage: 0,
    day41LoopClosure: true,
    day41OdomDriftDeg: 10,
    day42NavMode: 'full_nav',
    day42ObstacleBlocked: true,
    day43TraceWidthMm: 1.6,
    day43DecouplingClose: true,
    day43GndPour: true,
    day44DebugStage: 'power',
    day44EmiFilterCaps: false,
    day45Stage: 'nav',
    day45TfVerified: true,
    day45PowerSeparated: true,
  });

  const [progress, setProgress] = useState<LearningProgress>(loadInitialProgress);

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors
    }
  }, [progress]);

  const activeModule = useMemo(
    () => LAB_MODULES.find((m) => m.id === activeModuleId) ?? LAB_MODULES[0],
    [activeModuleId],
  );

  const completeMission = useCallback((missionId: string) => {
    setProgress((prev) => {
      if (prev.completedMissions.includes(missionId)) return prev;
      return {
        ...prev,
        completedMissions: [...prev.completedMissions, missionId],
      };
    });
  }, []);

  const toggleMission = useCallback((missionId: string) => {
    setProgress((prev) => {
      const exists = prev.completedMissions.includes(missionId);
      return {
        ...prev,
        completedMissions: exists
          ? prev.completedMissions.filter((id) => id !== missionId)
          : [...prev.completedMissions, missionId],
      };
    });
  }, []);

  const { totalCorrect, totalQuestions, wrongQuizModuleIds, wrongQuizCount } =
    useMemo(() => {
      let correct = 0;
      let total = 0;
      let wrongCount = 0;
      const wrongModules: ModuleId[] = [];
      for (const mod of LAB_MODULES) {
        for (const q of mod.quizzes) {
          total += 1;
          const ans = progress.quizAnswers[q.id];
          if (ans === q.correctIndex) {
            correct += 1;
          } else if (ans !== undefined) {
            wrongCount += 1;
            if (!wrongModules.includes(mod.id)) {
              wrongModules.push(mod.id);
            }
          }
        }
      }
      return {
        totalCorrect: correct,
        totalQuestions: total,
        wrongQuizModuleIds: wrongModules,
        wrongQuizCount: wrongCount,
      };
    }, [progress.quizAnswers]);

  const exp = useMemo(() => {
    return (
      progress.completedMissions.length * 10 +
      progress.solvedCodeChallenges.length * 15 +
      totalCorrect * 20 +
      progress.completedDays.length * 50 +
      progress.warmupCompletedIds.length * 5 +
      progress.masteredBoardIds.length * 15
    );
  }, [
    progress.completedMissions.length,
    progress.solvedCodeChallenges.length,
    totalCorrect,
    progress.completedDays.length,
    progress.warmupCompletedIds.length,
    progress.masteredBoardIds.length,
  ]);

  const handleOpenGlossary = useCallback(
    (tab: 'warmup' | 'glossary', targetId?: string) => {
      setGlossaryModal({ open: true, tab, targetId });
    },
    [],
  );

  const handleCompleteWarmupTerm = useCallback((termId: string) => {
    setProgress((prev) => {
      if (prev.warmupCompletedIds.includes(termId)) return prev;
      return {
        ...prev,
        warmupCompletedIds: [...prev.warmupCompletedIds, termId],
      };
    });
  }, []);

  const handleMasterBoard = useCallback((boardId: BoardId) => {
    setProgress((prev) => {
      if (prev.masteredBoardIds.includes(boardId)) return prev;
      return {
        ...prev,
        masteredBoardIds: [...prev.masteredBoardIds, boardId],
      };
    });
  }, []);

  const handleOpenLab = (moduleId: ModuleId) => {
    setSketchRunning(false);
    setActiveModuleId(moduleId);
    setActiveTab('overview');
    setActiveView('lab');
  };

  const handleOpenWrongQuizModule = () => {
    const targetMod = wrongQuizModuleIds[0] ?? 'day01_basics';
    setActiveModuleId(targetMod);
    setActiveTab('quiz');
    setActiveView('lab');
  };

  const handleToggleDayComplete = (dayNum: number) => {
    setProgress((prev) => {
      const exists = prev.completedDays.includes(dayNum);
      return {
        ...prev,
        completedDays: exists
          ? prev.completedDays.filter((d) => d !== dayNum)
          : [...prev.completedDays, dayNum],
      };
    });
  };

  const handleSelectPinFrom3D = (pinId: string) => {
    setSelectedPinId(pinId);
    completeMission('esp32-prohibited');
    if (activeModuleId === 'esp32') {
      setActiveTab('pinout');
    }
  };

  const handleSelectModule = (id: ModuleId) => {
    setSketchRunning(false);
    setActiveModuleId(id);
    if (id !== 'esp32' && activeTab === 'pinout') {
      setActiveTab('overview');
    }
  };

  const handleChangePreview = (patch: Partial<LabPreviewState>) => {
    setPreview((prev) => {
      const next = { ...prev, ...patch };

      // Auto-complete Guided Missions based on real user experiments
      if (activeModuleId === 'day01_basics') {
        if (patch.day01FocusPart) {
          completeMission('d01-anatomy');
        }
        const effectiveR = Math.max(next.circuitResistanceOhm, 5);
        const currentMa =
          next.circuitVoltageV > next.circuitLedVf
            ? ((next.circuitVoltageV - next.circuitLedVf) / effectiveR) * 1000
            : 0;
        if (next.day01Mode === 'circuit' && currentMa > 30) {
          completeMission('d01-overcurrent');
        }
        if (next.day01Mode === 'circuit' && currentMa >= 5 && currentMa <= 20) {
          completeMission('d01-safe-led');
        }
      } else if (activeModuleId === 'day02_breadboard') {
        if (next.exploded > 0.2) completeMission('d02-xray');
        if (next.breadboardScenario !== 'correct') completeMission('d02-short');
        if (patch.multimeterMode !== undefined) completeMission('d02-multimeter');
      } else if (activeModuleId === 'day03_digital') {
        if (next.digitalPullMode === 'floating') completeMission('d03-floating');
        if (next.digitalPullMode === 'pullup') completeMission('d03-pullup');
        if (patch.buttonPressed !== undefined) completeMission('d03-press');
      } else if (activeModuleId === 'day04_adc_pwm') {
        if (patch.adcVoltageV !== undefined) completeMission('d04-adc');
        if (patch.pwmDutyPct !== undefined) completeMission('d04-pwm');
        if (next.pwmFreqHz === 50) completeMission('d04-freq');
      } else if (activeModuleId === 'day05_divider') {
        const vOut =
          next.dividerVinV *
          (next.dividerR2K / Math.max(0.1, next.dividerR1K + next.dividerR2K));
        if (vOut > 3.6) completeMission('d05-over');
        if (vOut >= 2.2 && vOut <= 3.6) completeMission('d05-safe');
      } else if (activeModuleId === 'day06_power') {
        if (next.batteryType === '9v_alkaline' && next.motorLoadMa + 80 > 350) {
          completeMission('d06-brownout');
        }
        if (next.batteryType === 'lipo_2s' && next.regulatorType === 'buck') {
          completeMission('d06-buck');
        }
        if (patch.regulatorType !== undefined || patch.motorLoadMa !== undefined) {
          completeMission('d06-load');
        }
      } else if (activeModuleId === 'day07_project') {
        const allSafe =
          next.projectCommonGnd &&
          next.projectEchoDivider &&
          next.projectLedResistor;
        if (!allSafe) completeMission('d07-fault');
        if (allSafe) completeMission('d07-armed');
        if (allSafe && next.projectObstacleCm < 30) completeMission('d07-alarm');
      } else if (activeModuleId === 'day08_board') {
        if (patch.day08FocusPart !== undefined) completeMission('d08-parts');
        if (next.day08BootMode === 'flashing') completeMission('d08-boot');
      } else if (activeModuleId === 'esp32') {
        if (patch.wifiActive === true) completeMission('esp32-wifi');
        if (patch.exploded !== undefined && patch.exploded > 0.2) {
          completeMission('esp32-explode');
        }
      } else if (activeModuleId === 'day10_nonblocking') {
        if (next.day10Mode === 'delay') completeMission('d10-delay');
        if (next.day10Mode === 'millis') completeMission('d10-millis');
      } else if (activeModuleId === 'day11_fsm') {
        if (next.day11FsmState === 'PATROL') completeMission('d11-patrol');
        if (next.day11FsmState === 'AVOID') completeMission('d11-avoid');
        if (next.day11FsmState === 'ESTOP') completeMission('d11-estop');
      } else if (activeModuleId === 'day12_comms') {
        if (next.day12Protocol === 'uart') completeMission('d12-uart');
        if (next.day12Protocol === 'i2c') completeMission('d12-i2c');
        if (next.day12Protocol === 'spi') completeMission('d12-spi');
      } else if (activeModuleId === 'day13_actuators') {
        if (patch.day13MotorType !== undefined) completeMission('d13-compare');
        if (patch.day13GearRatio !== undefined) completeMission('d13-gear');
        const baseT =
          next.day13MotorType === 'dc'
            ? 0.12 * next.day13GearRatio * 0.85
            : next.day13MotorType === 'servo'
              ? 1.8 * (next.day13GearRatio / 20)
              : 4.2;
        if (next.day13LoadKgCm > baseT) completeMission('d13-stall');
      } else if (activeModuleId === 'day14_hbridge') {
        if (
          next.day14HbridgeMode === 'forward' ||
          next.day14HbridgeMode === 'reverse'
        ) {
          completeMission('d14-dir');
        }
        if (next.day14HbridgeMode === 'shoot_through') {
          completeMission('d14-shoot');
        }
        if (patch.day14CommonGnd !== undefined) completeMission('d14-gnd');
      } else if (activeModuleId === 'day15_rtos_wireless') {
        if (patch.day15RtosEnabled !== undefined) completeMission('d15-rtos');
        if (patch.day15IsrSafe !== undefined) completeMission('d15-isr');
        if (patch.day15Command !== undefined) completeMission('d15-cmd');
      } else if (activeModuleId === 'day16_rover_project') {
        if (next.day16DriveCmd !== 'stop') completeMission('d16-drive');
        if (patch.day16BuckSeparated !== undefined) completeMission('d16-power');
        if (next.day16SignalLostMs >= 500 && next.day16FailsafeEnabled) {
          completeMission('d16-failsafe');
        }
      } else if (activeModuleId === 'day17_math') {
        if (
          next.day17Mode === 'angle' &&
          next.day17TargetX < 0 &&
          next.day17TargetY < 0 &&
          next.day17UseAtan2
        ) {
          completeMission('d17-atan2');
        }
        if (next.day17Mode === 'vector' && next.day17VecAngleDeg === 90) {
          completeMission('d17-vec');
        }
      } else if (activeModuleId === 'day18_rotation3d') {
        if (next.day18Mode === 'euler' && Math.abs(next.day18PitchDeg) >= 85) {
          completeMission('d18-gimbal');
        }
        if (next.day18Mode === 'quaternion') {
          completeMission('d18-quat');
        }
      } else if (activeModuleId === 'day19_cad_tolerance') {
        if (next.day19HoleClearanceMm <= 0.1) completeMission('d19-press');
        if (
          next.day19HoleClearanceMm >= 0.25 &&
          next.day19HoleClearanceMm <= 0.45
        ) {
          completeMission('d19-clearance');
        }
        const multiple =
          Math.abs(next.day19WallThickMm - Math.round(next.day19WallThickMm / 0.4) * 0.4) <
          0.02;
        if (next.day19WallThickMm >= 1.6 && multiple) {
          completeMission('d19-wall');
        }
      } else if (activeModuleId === 'day20_mobile_kinematics') {
        if (Math.abs(next.day20LinearV) < 0.05 && Math.abs(next.day20AngularW) >= 0.5) {
          completeMission('d20-spin');
        }
        if (Math.abs(next.day20LinearV) >= 0.2 && Math.abs(next.day20AngularW) >= 0.3) {
          completeMission('d20-arc');
        }
        if (patch.day20DriveArch !== undefined && patch.day20DriveArch !== 'diff') {
          completeMission('d20-arch');
        }
      } else if (activeModuleId === 'kinematics') {
        if (
          next.armIkMode &&
          (patch.armIkMode !== undefined ||
            patch.armTargetX !== undefined ||
            patch.armTargetY !== undefined ||
            patch.armElbowUp !== undefined ||
            patch.armL1 !== undefined ||
            patch.armL2 !== undefined)
        ) {
          const L1 = next.armL1;
          const L2 = next.armL2;
          const r2 = next.armTargetX * next.armTargetX + next.armTargetY * next.armTargetY;
          const rawD = (r2 - L1 * L1 - L2 * L2) / (2 * L1 * L2);
          const D = Math.max(-1, Math.min(1, rawD));
          const s2 = (next.armElbowUp ? 1 : -1) * Math.sqrt(Math.max(0, 1 - D * D));
          const t2 = Math.atan2(s2, D);
          const t1 =
            Math.atan2(next.armTargetY, next.armTargetX) -
            Math.atan2(L2 * Math.sin(t2), L1 + L2 * Math.cos(t2));
          next.armTheta1Deg = Math.round((t1 * 180) / Math.PI);
          next.armTheta2Deg = Math.round((t2 * 180) / Math.PI);
        }
        if (
          patch.armTheta1Deg !== undefined ||
          patch.armTheta2Deg !== undefined ||
          next.armIkMode
        ) {
          completeMission('kin-theta');
        }
        if (Math.abs(next.armL1 - next.armL2) >= 0.2) {
          completeMission('kin-link');
        }
      } else if (activeModuleId === 'day23_jacobian') {
        const s2Abs = Math.abs(Math.sin((next.day23Theta2Deg * Math.PI) / 180));
        if (s2Abs < 0.16) completeMission('d23-singular');
        if (Math.abs(Math.abs(next.day23Theta2Deg) - 90) <= 5) {
          completeMission('d23-elbow');
        }
        if (Math.abs(next.day23EndFxN) >= 15 || Math.abs(next.day23EndFyN) >= 15) {
          completeMission('d23-force');
        }
      } else if (activeModuleId === 'day24_dynamics') {
        const linkKg = (next.day24ArmLengthCm / 30) * 0.12;
        const req =
          (linkKg * 0.5 + next.day24PayloadG / 1000) *
          next.day24ArmLengthCm *
          Math.cos((next.day24AngleDeg * Math.PI) / 180);
        const sf = next.day24ServoRatedKgCm / Math.max(0.05, req);
        if (next.day24AngleDeg <= 5) completeMission('d24-horizontal');
        if (sf < 1.0) completeMission('d24-overload');
        if (sf >= 1.5) completeMission('d24-upgrade');
      } else if (activeModuleId === 'day25_arm_project') {
        const L1 = 1.8;
        const L2 = 1.3;
        const r2 = next.day25TargetX * next.day25TargetX + next.day25TargetY * next.day25TargetY;
        const D = (r2 - L1 * L1 - L2 * L2) / (2 * L1 * L2);
        const reachable = Math.abs(D) <= 1.0;
        const sin2Abs = reachable ? Math.sqrt(Math.max(0, 1 - D * D)) : 0;
        const nearSing = reachable && sin2Abs < 0.15;
        const reqNm =
          (0.35 * (L1 * 0.5) + next.day25PayloadKg * Math.max(0.2, Math.abs(next.day25TargetX))) *
          9.81;
        const sf = next.day25JointRatedNm / Math.max(0.05, reqNm);
        if (!reachable) completeMission('d25-reach');
        if (nearSing || (reachable && !nearSing && sf >= 1.5)) {
          if (nearSing) completeMission('d25-singular');
        }
        if (reachable && !nearSing && sf >= 1.5) {
          completeMission('d25-singular');
          completeMission('d25-torque');
        }
      } else if (activeModuleId === 'ultrasonic') {
        if (patch.sonarDistanceCm !== undefined) {
          completeMission('us-dist');
          if (patch.sonarDistanceCm >= 395) completeMission('us-timeout');
        }
        if (patch.sonarSweepDeg !== undefined && Math.abs(patch.sonarSweepDeg) >= 10) {
          completeMission('us-sweep');
        }
      } else if (activeModuleId === 'day27_encoder_odom') {
        if (patch.day27Direction !== undefined) completeMission('d27-cwccw');
        if (next.day27WheelSlipPct >= 15) completeMission('d27-slip');
      } else if (activeModuleId === 'day28_imu') {
        if (next.day28VibrationG >= 0.35) completeMission('d28-vib');
        if (!next.day28Calibrated && Math.abs(next.day28GyroBiasDps) >= 0.4) {
          completeMission('d28-drift');
        }
        if (next.day28Calibrated) completeMission('d28-calib');
      } else if (activeModuleId === 'day29_sensor_fusion') {
        if (
          next.day29FilterMode === 'raw_acc' ||
          next.day29FilterMode === 'gyro_only'
        ) {
          completeMission('d29-raw');
        }
        if (next.day29FilterMode === 'lpf') completeMission('d29-lpf');
        if (next.day29FilterMode === 'complementary') completeMission('d29-comp');
      } else if (activeModuleId === 'pid') {
        if (patch.pidSetpointDeg !== undefined) completeMission('pid-setpoint');
        if (patch.pidKp !== undefined && patch.pidKp >= 9) completeMission('pid-kp');
        if (patch.pidKd !== undefined && patch.pidKd >= 0.8) completeMission('pid-kd');
      } else if (activeModuleId === 'day31_pid_advanced') {
        if (next.day31DisturbanceStall && !next.day31AntiWindup) {
          completeMission('d31-windup');
        }
        if (next.day31DisturbanceStall && next.day31AntiWindup) {
          completeMission('d31-antiwindup');
        }
        if (patch.day31DerivLpf !== undefined && next.day31DerivLpf) {
          completeMission('d31-lpf');
        }
      } else if (activeModuleId === 'day32_trajectory') {
        if (next.day32Mode === 'profile' && next.day32MaxAccel <= 1.6) {
          completeMission('d32-profile');
        }
        if (next.day32Mode === 'pursuit' && next.day32LookaheadM <= 0.3) {
          completeMission('d32-pursuit-short');
        }
        if (
          next.day32Mode === 'pursuit' &&
          next.day32LookaheadM >= 0.5 &&
          next.day32LookaheadM <= 0.85
        ) {
          completeMission('d32-pursuit-good');
        }
      } else if (activeModuleId === 'day33_kalman') {
        const Ppred = 0.25 + next.day33ProcessQ;
        const K = Ppred / (Ppred + next.day33MeasureR);
        if (K > 0.7) completeMission('d33-trust-sensor');
        if (K < 0.3) completeMission('d33-trust-model');
      } else if (activeModuleId === 'day34_fusion_project') {
        if (!next.day34EncoderPid && !next.day34ImuHeadingPid && next.day34MotorMismatchPct >= 8) {
          completeMission('d34-openloop');
        }
        if (next.day34EncoderPid) completeMission('d34-enc');
        if (next.day34EncoderPid && next.day34ImuHeadingPid) {
          completeMission('d34-imu');
        }
      } else if (activeModuleId === 'day35_python_bridge') {
        if (next.day35CorruptByte && !next.day35CrcEnabled) {
          completeMission('d35-corrupt');
        }
        if (next.day35CorruptByte && next.day35CrcEnabled) {
          completeMission('d35-crc');
        }
      } else if (activeModuleId === 'day36_path_planning') {
        if (next.day36CspaceInflation) completeMission('d36-cspace');
        if (next.day36DynamicObstacle && next.day36PlannerAlgo === 'dwa') {
          completeMission('d36-dwa');
        }
      } else if (activeModuleId === 'day37_ros2_arch') {
        if (patch.day37Pattern !== undefined) completeMission('d37-patterns');
        if (next.day37PacketLossPct >= 15 && patch.day37QosReliable !== undefined) {
          completeMission('d37-qos');
        }
      } else if (activeModuleId === 'day38_tf2_urdf') {
        if (!next.day38TfConfigured) completeMission('d38-missing');
        if (next.day38TfConfigured) completeMission('d38-static');
        if (patch.day38CamOffsetCm !== undefined) completeMission('d38-offset');
      } else if (activeModuleId === 'day39_vision') {
        if (next.day39LowLight && next.day39ColorSpace === 'rgb') {
          completeMission('d39-rgb-fail');
        }
        if (next.day39LowLight && next.day39ColorSpace === 'hsv') {
          completeMission('d39-hsv-pass');
        }
        if (patch.day39ArucoDistCm !== undefined) completeMission('d39-aruco');
      } else if (activeModuleId === 'day40_mcl_particle') {
        if (next.day40MclStage <= 1) completeMission('d40-spread');
        if (next.day40MclStage === 2) completeMission('d40-converge');
        if (next.day40MclStage === 3) completeMission('d40-kidnap');
      } else if (activeModuleId === 'day41_slam_grid') {
        if (!next.day41LoopClosure && next.day41OdomDriftDeg >= 8) {
          completeMission('d41-drift');
        }
        if (next.day41LoopClosure) completeMission('d41-loop');
      } else if (activeModuleId === 'day42_maze_project') {
        if (next.day42ObstacleBlocked && next.day42NavMode === 'astar_only') {
          completeMission('d42-astar-hit');
        }
        if (next.day42ObstacleBlocked && next.day42NavMode === 'full_nav') {
          completeMission('d42-dwa-avoid');
        }
      } else if (activeModuleId === 'day43_pcb_design') {
        if (next.day43TraceWidthMm >= 1.4) completeMission('d43-trace');
        if (next.day43DecouplingClose) completeMission('d43-decap');
        if (next.day43GndPour) completeMission('d43-pour');
      } else if (activeModuleId === 'day44_debugging') {
        if (patch.day44DebugStage !== undefined) completeMission('d44-steps');
        if (next.day44DebugStage === 'emi' && next.day44EmiFilterCaps) {
          completeMission('d44-emi');
        }
      } else if (activeModuleId === 'day45_capstone') {
        if (next.day45PowerSeparated && next.day45TfVerified) {
          completeMission('d45-checks');
        }
        if (
          next.day45PowerSeparated &&
          next.day45TfVerified &&
          (next.day45Stage === 'vision' || next.day45Stage === 'pick')
        ) {
          completeMission('d45-pick');
        }
        if (
          next.day45PowerSeparated &&
          next.day45TfVerified &&
          next.day45Stage === 'place'
        ) {
          completeMission('d45-place');
        }
      }

      return next;
    });
  };

  const handleSolveCodeChallenge = (moduleId: ModuleId) => {
    if (moduleId === 'kinematics') {
      completeMission('kin-code');
    } else if (moduleId === 'day05_divider') {
      completeMission('d05-code');
    } else if (moduleId === 'day08_board') {
      completeMission('d08-code');
    } else if (moduleId === 'day10_nonblocking') {
      completeMission('d10-code');
    } else if (moduleId === 'day17_math') {
      completeMission('d17-code');
    } else if (moduleId === 'day18_rotation3d') {
      completeMission('d18-code');
    } else if (moduleId === 'day27_encoder_odom') {
      completeMission('d27-code');
    } else if (moduleId === 'day33_kalman') {
      completeMission('d33-code');
    } else if (moduleId === 'day35_python_bridge') {
      completeMission('d35-code');
    } else if (moduleId === 'day36_path_planning') {
      completeMission('d36-code');
    } else if (moduleId === 'day37_ros2_arch') {
      completeMission('d37-code');
    } else if (moduleId === 'day41_slam_grid') {
      completeMission('d41-code');
    } else if (moduleId === 'day42_maze_project') {
      completeMission('d42-code');
    } else if (moduleId === 'day44_debugging') {
      completeMission('d44-code');
    }
    setProgress((prev) => {
      if (prev.solvedCodeChallenges.includes(moduleId)) return prev;
      return {
        ...prev,
        solvedCodeChallenges: [...prev.solvedCodeChallenges, moduleId],
      };
    });
  };

  const handleAnswerQuiz = (questionId: string, optionIndex: number) => {
    setProgress((prev) => ({
      ...prev,
      quizAnswers: { ...prev.quizAnswers, [questionId]: optionIndex },
    }));
  };

  const handleResetModuleQuiz = (questionIds: string[]) => {
    setProgress((prev) => {
      const next = { ...prev.quizAnswers };
      for (const id of questionIds) {
        delete next[id];
      }
      return { ...prev, quizAnswers: next };
    });
  };

  return (
    <GlossaryProvider onOpenGlossaryModal={handleOpenGlossary}>
      <div
        className="flex h-[100dvh] w-screen flex-col overflow-hidden bg-white text-[#0A2540]"
        style={{
          paddingTop: 'var(--safe-top)',
          paddingLeft: 'var(--safe-left)',
          paddingRight: 'var(--safe-right)',
        }}
      >
        <LabHeader
          activeView={activeView}
          onSelectView={setActiveView}
          activeModuleId={activeModuleId}
          onSelectModule={handleSelectModule}
          exp={exp}
          completedDaysCount={progress.completedDays.length}
          totalCorrect={totalCorrect}
          totalQuestions={totalQuestions}
          warmupDoneCount={progress.warmupCompletedIds.length}
          onOpenGlossary={(tab) => handleOpenGlossary(tab)}
        />

        {activeView === 'roadmap' ? (
          <main className="min-h-0 flex-1 overflow-hidden">
            <RoadmapHomeView
              completedDays={progress.completedDays}
              warmupCompletedIds={progress.warmupCompletedIds}
              masteredBoardsCount={progress.masteredBoardIds.length}
              exp={exp}
              wrongQuizCount={wrongQuizCount}
              onOpenLab={handleOpenLab}
              onOpenBoards={() => setActiveView('boards')}
              onOpenWrongQuizModule={handleOpenWrongQuizModule}
              onToggleDayComplete={handleToggleDayComplete}
              onOpenWarmup={handleOpenGlossary}
            />
          </main>
        ) : activeView === 'boards' ? (
          <main className="min-h-0 flex-1 overflow-hidden">
            <BoardsStudioView
              masteredBoardIds={progress.masteredBoardIds}
              onMasterBoard={handleMasterBoard}
              onOpenLab={handleOpenLab}
            />
          </main>
        ) : (
        /* Responsive Split Workspace: Portrait (Top 44dvh Lab / Bottom Panel) vs Landscape/Desktop (Left 58% Lab / Right 42% Panel) */
        <main className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[44dvh_1fr] lg:grid-cols-[1.35fr_1fr] lg:grid-rows-1">
          <section className="relative min-h-0 w-full">
            <LabViewport
              activeModuleId={activeModuleId}
              preview={preview}
              onChangePreview={handleChangePreview}
              selectedPinId={selectedPinId}
              onSelectPin={handleSelectPinFrom3D}
              onToggleExploded={() =>
                handleChangePreview({ exploded: preview.exploded > 0.1 ? 0 : 1 })
              }
              sketchRunning={sketchRunning}
            />
          </section>

          <section className="min-h-0 w-full">
            <InspectorPanel
              module={activeModule}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              selectedPinId={selectedPinId}
              onSelectPin={(pinId) => {
                setSelectedPinId(pinId);
                completeMission('esp32-prohibited');
              }}
              preview={preview}
              onChangePreview={handleChangePreview}
              quizAnswers={progress.quizAnswers}
              onAnswerQuiz={handleAnswerQuiz}
              onResetModuleQuiz={handleResetModuleQuiz}
              completedMissions={progress.completedMissions}
              onToggleMission={toggleMission}
              solvedCodeChallenges={progress.solvedCodeChallenges}
              onSolveCodeChallenge={handleSolveCodeChallenge}
              sketchRunning={sketchRunning}
              onToggleSketch={() => setSketchRunning((v) => !v)}
            />
          </section>
        </main>
      )}
      </div>

      <Phase0WarmupModal
        isOpen={glossaryModal.open}
        initialTab={glossaryModal.tab}
        initialTargetId={glossaryModal.targetId}
        completedWarmupIds={progress.warmupCompletedIds}
        onCompleteWarmupTerm={handleCompleteWarmupTerm}
        onStartDay01={() => handleOpenLab('day01_basics')}
        onClose={() => setGlossaryModal((prev) => ({ ...prev, open: false }))}
      />
    </GlossaryProvider>
  );
}

export default App;
