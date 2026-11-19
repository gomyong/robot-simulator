export type ModuleId = 'esp32' | 'kinematics' | 'ultrasonic' | 'pid';

export type TabId = 'overview' | 'pinout' | 'controls' | 'code' | 'quiz';

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

export interface LabModule {
  id: ModuleId;
  order: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  badge: string;
  milestoneTag: string;
  overviewSummary: string;
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
  quizzes: QuizQuestion[];
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
}
