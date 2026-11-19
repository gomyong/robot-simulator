import { useEffect, useMemo, useState } from 'react';
import { InspectorPanel } from './components/panels/InspectorPanel';
import { LabHeader } from './components/panels/LabHeader';
import { LabViewport } from './components/viewport/LabViewport';
import { LAB_MODULES } from './data/curriculum';
import { LabPreviewState, ModuleId, TabId } from './types/lab';

const QUIZ_STORAGE_KEY = 'robotics-lab-quiz-v1';

export function App() {
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>('esp32');
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [selectedPinId, setSelectedPinId] = useState<string | null>('GPIO32');
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
  });

  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Record<string, number>) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizAnswers));
    } catch {
      // Ignore storage quota errors
    }
  }, [quizAnswers]);

  const activeModule = useMemo(
    () => LAB_MODULES.find((m) => m.id === activeModuleId) ?? LAB_MODULES[0],
    [activeModuleId],
  );

  const { totalCorrect, totalQuestions } = useMemo(() => {
    let correct = 0;
    let total = 0;
    for (const mod of LAB_MODULES) {
      for (const q of mod.quizzes) {
        total += 1;
        if (quizAnswers[q.id] === q.correctIndex) correct += 1;
      }
    }
    return { totalCorrect: correct, totalQuestions: total };
  }, [quizAnswers]);

  const handleSelectPinFrom3D = (pinId: string) => {
    setSelectedPinId(pinId);
    if (activeModuleId === 'esp32') {
      setActiveTab('pinout');
    }
  };

  const handleSelectModule = (id: ModuleId) => {
    setActiveModuleId(id);
    if (id !== 'esp32' && activeTab === 'pinout') {
      setActiveTab('overview');
    }
  };

  const handleChangePreview = (patch: Partial<LabPreviewState>) => {
    setPreview((prev) => ({ ...prev, ...patch }));
  };

  const handleAnswerQuiz = (questionId: string, optionIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleResetModuleQuiz = (questionIds: string[]) => {
    setQuizAnswers((prev) => {
      const next = { ...prev };
      for (const id of questionIds) {
        delete next[id];
      }
      return next;
    });
  };

  return (
    <div
      className="flex h-[100dvh] w-screen flex-col overflow-hidden bg-[#0B0F17] text-slate-100"
      style={{
        paddingTop: 'var(--safe-top)',
        paddingLeft: 'var(--safe-left)',
        paddingRight: 'var(--safe-right)',
      }}
    >
      <LabHeader
        activeModuleId={activeModuleId}
        onSelectModule={handleSelectModule}
        totalCorrect={totalCorrect}
        totalQuestions={totalQuestions}
      />

      {/* Responsive Split Workspace: Portrait (Top 44dvh 3D / Bottom Panel) vs Landscape/Desktop (Left 58% 3D / Right 42% Panel) */}
      <main className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[44dvh_1fr] lg:grid-cols-[1.35fr_1fr] lg:grid-rows-1">
        <section className="relative min-h-0 w-full">
          <LabViewport
            activeModuleId={activeModuleId}
            preview={preview}
            selectedPinId={selectedPinId}
            onSelectPin={handleSelectPinFrom3D}
            onToggleExploded={() =>
              handleChangePreview({ exploded: preview.exploded > 0.1 ? 0 : 1 })
            }
          />
        </section>

        <section className="min-h-0 w-full">
          <InspectorPanel
            module={activeModule}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            selectedPinId={selectedPinId}
            onSelectPin={setSelectedPinId}
            preview={preview}
            onChangePreview={handleChangePreview}
            quizAnswers={quizAnswers}
            onAnswerQuiz={handleAnswerQuiz}
            onResetModuleQuiz={handleResetModuleQuiz}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
