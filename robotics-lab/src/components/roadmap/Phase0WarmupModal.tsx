import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { GLOSSARY_ENTRIES } from '../../data/glossary';
import { PHASE0_WARMUP_TERMS } from '../../data/phase0Warmup';
import { GlossaryCategory, WarmupVisualType } from '../../types/lab';
import { MascotSpeechBubble } from '../PixelMascot';

interface Phase0WarmupModalProps {
  isOpen: boolean;
  initialTab: 'warmup' | 'glossary';
  initialTargetId?: string;
  completedWarmupIds: string[];
  onCompleteWarmupTerm: (termId: string) => void;
  onStartDay01: () => void;
  onClose: () => void;
}

const CATEGORIES: ('전체' | GlossaryCategory)[] = [
  '전체',
  '전기 기초',
  '보드·핀',
  '신호·통신',
  '모터·기구',
  '제어·자율',
  '기판·디버그',
];

function WarmupDiagram({ type }: { type: WarmupVisualType }) {
  switch (type) {
    case 'water_pressure':
      return (
        <svg viewBox="0 0 360 110" className="h-28 w-full select-none">
          <rect width="360" height="110" rx="10" fill="#F7F8FA" />
          {/* 3.3V Tank */}
          <rect x="28" y="42" width="64" height="48" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="30" y="58" width="60" height="30" rx="4" fill="#DBEAFE" />
          <text x="60" y="77" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0A2540">3.3V</text>
          <text x="60" y="34" textAnchor="middle" fontSize="10" fontWeight="600" fill="#635BFF">ESP32 기준</text>
          {/* 5.0V Tank */}
          <rect x="148" y="20" width="64" height="70" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="150" y="36" width="60" height="52" rx="4" fill="#C7D2FE" />
          <text x="180" y="65" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0A2540">5.0V</text>
          <text x="180" y="14" textAnchor="middle" fontSize="10" fontWeight="600" fill="#425466">USB / 아두이노</text>
          {/* Arrow */}
          <path d="M226 56 L264 56" stroke="#635BFF" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="264,51 273,56 264,61" fill="#635BFF" />
          <text x="282" y="51" fontSize="11" fontWeight="700" fill="#0A2540">수압 = 전압</text>
          <text x="282" y="68" fontSize="10" fill="#697386">높을수록 힘↑</text>
        </svg>
      );
    case 'hose_flow':
      return (
        <svg viewBox="0 0 360 110" className="h-28 w-full select-none">
          <rect width="360" height="110" rx="10" fill="#F7F8FA" />
          {/* Safe hose */}
          <rect x="24" y="22" width="140" height="22" rx="11" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
          <circle cx="52" cy="33" r="4" fill="#10B981" />
          <circle cx="82" cy="33" r="4" fill="#10B981" />
          <circle cx="112" cy="33" r="4" fill="#10B981" />
          <text x="180" y="37" fontSize="11" fontWeight="700" fill="#047857">10~20 mA (안전 · LED 적정)</text>
          {/* Overcurrent hose */}
          <rect x="24" y="62" width="140" height="28" rx="14" fill="#FFF1F2" stroke="#E11D48" strokeWidth="1.5" />
          <circle cx="44" cy="76" r="5" fill="#E11D48" />
          <circle cx="64" cy="76" r="5" fill="#E11D48" />
          <circle cx="84" cy="76" r="5" fill="#E11D48" />
          <circle cx="104" cy="76" r="5" fill="#E11D48" />
          <circle cx="124" cy="76" r="5" fill="#E11D48" />
          <circle cx="144" cy="76" r="5" fill="#E11D48" />
          <text x="180" y="80" fontSize="11" fontWeight="700" fill="#BE123C">100 mA+ (과전류 · 부품 소손!)</text>
        </svg>
      );
    case 'valve_resistor':
      return (
        <svg viewBox="0 0 360 110" className="h-28 w-full select-none">
          <rect width="360" height="110" rx="10" fill="#F7F8FA" />
          <line x1="24" y1="56" x2="112" y2="56" stroke="#0A2540" strokeWidth="3" />
          {/* Resistor body */}
          <rect x="112" y="42" width="84" height="28" rx="7" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
          <rect x="128" y="42" width="6" height="28" fill="#DC2626" />
          <rect x="144" y="42" width="6" height="28" fill="#DC2626" />
          <rect x="160" y="42" width="6" height="28" fill="#92400E" />
          <rect x="176" y="42" width="5" height="28" fill="#D97706" />
          <line x1="196" y1="56" x2="262" y2="56" stroke="#0A2540" strokeWidth="3" />
          {/* LED */}
          <circle cx="284" cy="56" r="16" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
          <circle cx="284" cy="56" r="7" fill="#EF4444" />
          <text x="154" y="26" textAnchor="middle" fontSize="11" fontWeight="700" fill="#B45309">220Ω 안전 밸브</text>
          <text x="154" y="92" textAnchor="middle" fontSize="10" fill="#697386">물살을 15mA로 조절해 LED 보호</text>
          <text x="284" y="92" textAnchor="middle" fontSize="10" fontWeight="600" fill="#0A2540">LED 안전 ON</text>
        </svg>
      );
    case 'closed_loop':
      return (
        <svg viewBox="0 0 360 110" className="h-28 w-full select-none">
          <rect width="360" height="110" rx="10" fill="#F7F8FA" />
          <rect x="46" y="28" width="268" height="54" rx="14" fill="none" stroke="#10B981" strokeWidth="2.5" strokeDasharray="6 4" />
          <rect x="26" y="38" width="68" height="34" rx="8" fill="#EEF2FF" stroke="#635BFF" strokeWidth="1.5" />
          <text x="60" y="59" textAnchor="middle" fontSize="11" fontWeight="700" fill="#4F46E5">VCC (+)</text>
          <rect x="148" y="14" width="64" height="28" rx="7" fill="#FFFFFF" stroke="#0A2540" strokeWidth="1.5" />
          <text x="180" y="32" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0A2540">부품/LED</text>
          <rect x="266" y="38" width="68" height="34" rx="8" fill="#0A2540" />
          <text x="300" y="59" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF">GND (-)</text>
          <text x="180" y="96" textAnchor="middle" fontSize="10" fontWeight="600" fill="#047857">출발(VCC) → 부품 → 복귀(GND) 한 바퀴 고리 완성!</text>
        </svg>
      );
    case 'breadboard_rails':
      return (
        <svg viewBox="0 0 360 110" className="h-28 w-full select-none">
          <rect width="360" height="110" rx="10" fill="#F7F8FA" />
          <rect x="30" y="14" width="300" height="82" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Top power rail */}
          <line x1="46" y1="26" x2="314" y2="26" stroke="#EF4444" strokeWidth="2" />
          <text x="180" y="22" textAnchor="middle" fontSize="9" fontWeight="700" fill="#DC2626">전원 레일 (+): 가로 전체 연결</text>
          {/* Center trench */}
          <rect x="46" y="51" width="268" height="8" rx="2" fill="#E2E8F0" />
          <text x="180" y="58" textAnchor="middle" fontSize="8" fontWeight="700" fill="#475569">가운데 홈 (위·아래 분리됨)</text>
          {/* Vertical 5-pin strip highlight */}
          {[70, 105, 140, 175, 210].map((x) => (
            <g key={x}>
              <rect x={x - 5} y="32" width="10" height="16" rx="2" fill="#EEF2FF" stroke="#635BFF" strokeWidth="1" />
              <rect x={x - 5} y="62" width="10" height="16" rx="2" fill="#ECFDF5" stroke="#10B981" strokeWidth="1" />
            </g>
          ))}
          <text x="274" y="43" textAnchor="middle" fontSize="9" fontWeight="600" fill="#4F46E5">세로 5칸씩</text>
          <text x="274" y="74" textAnchor="middle" fontSize="9" fontWeight="600" fill="#047857">서로 연결됨</text>
          <line x1="46" y1="86" x2="314" y2="86" stroke="#3B82F6" strokeWidth="2" />
        </svg>
      );
    case 'mcu_brain':
      return (
        <svg viewBox="0 0 360 110" className="h-28 w-full select-none">
          <rect width="360" height="110" rx="10" fill="#F7F8FA" />
          <rect x="20" y="34" width="84" height="42" rx="8" fill="#FFFFFF" stroke="#0EA5E9" strokeWidth="1.5" />
          <text x="62" y="53" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0A2540">센서 (눈)</text>
          <text x="62" y="68" textAnchor="middle" fontSize="9" fill="#697386">거리·빛·버튼</text>
          <path d="M108 55 L132 55" stroke="#635BFF" strokeWidth="2" />
          <polygon points="131,50 139,55 131,60" fill="#635BFF" />
          <rect x="142" y="28" width="80" height="54" rx="10" fill="#0A2540" />
          <text x="182" y="51" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF">MCU (두뇌)</text>
          <text x="182" y="67" textAnchor="middle" fontSize="9" fill="#A5B4FC">ESP32 · 코드 판단</text>
          <path d="M226 55 L250 55" stroke="#10B981" strokeWidth="2" />
          <polygon points="249,50 257,55 249,60" fill="#10B981" />
          <rect x="260" y="34" width="82" height="42" rx="8" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" />
          <text x="301" y="53" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0A2540">액추에이터</text>
          <text x="301" y="68" textAnchor="middle" fontSize="9" fill="#697386">모터·LED·서보</text>
        </svg>
      );
    case 'gpio_legs':
      return (
        <svg viewBox="0 0 360 110" className="h-28 w-full select-none">
          <rect width="360" height="110" rx="10" fill="#F7F8FA" />
          <rect x="135" y="18" width="90" height="74" rx="8" fill="#0A2540" />
          <text x="180" y="52" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF">ESP32</text>
          <text x="180" y="68" textAnchor="middle" fontSize="9" fill="#94A3B8">두뇌 칩</text>
          {/* Left pin INPUT */}
          <rect x="115" y="34" width="20" height="8" fill="#F59E0B" />
          <path d="M54 38 L108 38" stroke="#0EA5E9" strokeWidth="2" />
          <polygon points="107,34 114,38 107,42" fill="#0EA5E9" />
          <text x="64" y="28" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0369A1">INPUT (읽기)</text>
          <text x="64" y="56" textAnchor="middle" fontSize="9" fill="#697386">버튼 · 센서</text>
          {/* Right pin OUTPUT */}
          <rect x="225" y="64" width="20" height="8" fill="#F59E0B" />
          <path d="M248 68 L302 68" stroke="#10B981" strokeWidth="2" />
          <polygon points="301,64 308,68 301,72" fill="#10B981" />
          <text x="296" y="56" textAnchor="middle" fontSize="10" fontWeight="700" fill="#047857">OUTPUT (내보내기)</text>
          <text x="296" y="86" textAnchor="middle" fontSize="9" fill="#697386">LED · 모터 명령</text>
        </svg>
      );
    case 'digital_vs_analog':
      return (
        <svg viewBox="0 0 360 110" className="h-28 w-full select-none">
          <rect width="360" height="110" rx="10" fill="#F7F8FA" />
          {/* Digital step */}
          <text x="90" y="22" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0A2540">디지털 (0 또는 1만 있음)</text>
          <polyline points="24,80 56,80 56,38 104,38 104,80 156,80" fill="none" stroke="#635BFF" strokeWidth="2.5" />
          <text x="156" y="42" fontSize="9" fill="#635BFF">HIGH(3.3V)</text>
          <text x="156" y="84" fontSize="9" fill="#697386">LOW(0V)</text>
          {/* Divider */}
          <line x1="192" y1="16" x2="192" y2="94" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* Analog smooth wave */}
          <text x="276" y="22" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0A2540">아날로그 / ADC (0~4095)</text>
          <path d="M210,74 C232,32 254,32 276,60 C298,88 320,38 342,46" fill="none" stroke="#10B981" strokeWidth="2.5" />
          <text x="276" y="92" textAnchor="middle" fontSize="9" fill="#047857">부드럽게 연속으로 변함</text>
        </svg>
      );
    case 'pwm_pulse':
      return (
        <svg viewBox="0 0 360 110" className="h-28 w-full select-none">
          <rect width="360" height="110" rx="10" fill="#F7F8FA" />
          <text x="24" y="34" fontSize="10" fontWeight="700" fill="#697386">듀티 20% (어둡게)</text>
          <polyline points="124,42 136,42 136,22 150,22 150,42 194,42 194,22 208,22 208,42 252,42" fill="none" stroke="#635BFF" strokeWidth="2" />
          <circle cx="305" cy="32" r="10" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" opacity="0.45" />
          <text x="324" y="36" fontSize="9" fill="#697386">약함</text>

          <text x="24" y="78" fontSize="10" fontWeight="700" fill="#0A2540">듀티 80% (밝게)</text>
          <polyline points="124,86 132,86 132,66 180,66 180,86 192,86 192,66 240,66 240,86 252,86" fill="none" stroke="#10B981" strokeWidth="2.5" />
          <circle cx="305" cy="76" r="10" fill="#FACC15" stroke="#D97706" strokeWidth="1.5" />
          <text x="324" y="80" fontSize="9" fontWeight="700" fill="#047857">강함!</text>
        </svg>
      );
    case 'serial_chat':
      return (
        <svg viewBox="0 0 360 110" className="h-28 w-full select-none">
          <rect width="360" height="110" rx="10" fill="#F7F8FA" />
          <rect x="20" y="30" width="76" height="48" rx="8" fill="#0A2540" />
          <text x="58" y="52" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF">ESP32</text>
          <text x="58" y="67" textAnchor="middle" fontSize="9" fill="#A5B4FC">USB 연결</text>
          <path d="M100 54 L142 54" stroke="#635BFF" strokeWidth="2" strokeDasharray="4 3" />
          <polygon points="141,50 149,54 141,58" fill="#635BFF" />
          <rect x="152" y="18" width="188" height="74" rx="8" fill="#0F172A" />
          <text x="164" y="36" fontSize="9" fontFamily="monospace" fill="#94A3B8">시리얼 모니터 (115200 bps)</text>
          <text x="164" y="54" fontSize="10" fontFamily="monospace" fill="#34D399">&gt; 거리: 24.5 cm (정상)</text>
          <text x="164" y="70" fontSize="10" fontFamily="monospace" fill="#FBBF24">&gt; 버튼 눌림 감지!</text>
        </svg>
      );
  }
}

export function Phase0WarmupModal({
  isOpen,
  initialTab,
  initialTargetId,
  completedWarmupIds,
  onCompleteWarmupTerm,
  onStartDay01,
  onClose,
}: Phase0WarmupModalProps) {
  const [tab, setTab] = useState<'warmup' | 'glossary'>(initialTab);
  const [stepIdx, setStepIdx] = useState(0);
  const [pickedOption, setPickedOption] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    '전체' | GlossaryCategory
  >('전체');

  useEffect(() => {
    if (!isOpen) return;
    setTab(initialTab);
    if (initialTab === 'warmup' && initialTargetId) {
      const idx = PHASE0_WARMUP_TERMS.findIndex((t) => t.id === initialTargetId);
      if (idx >= 0) setStepIdx(idx);
    } else if (initialTab === 'warmup' && !initialTargetId) {
      const firstUnfinished = PHASE0_WARMUP_TERMS.findIndex(
        (t) => !completedWarmupIds.includes(t.id),
      );
      setStepIdx(firstUnfinished >= 0 ? firstUnfinished : 0);
    }
    if (initialTab === 'glossary' && initialTargetId) {
      const entry = GLOSSARY_ENTRIES.find((e) => e.id === initialTargetId);
      if (entry) {
        setSelectedCategory('전체');
        setSearchQuery(entry.term.split(' ')[0]);
      }
    } else if (initialTab === 'glossary') {
      setSearchQuery('');
    }
  }, [isOpen, initialTab, initialTargetId, completedWarmupIds]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (tab === 'warmup') {
        if (e.key === 'ArrowRight') {
          setStepIdx((i) => Math.min(PHASE0_WARMUP_TERMS.length - 1, i + 1));
        } else if (e.key === 'ArrowLeft') {
          setStepIdx((i) => Math.max(0, i - 1));
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, tab]);

  const filteredGlossary = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return GLOSSARY_ENTRIES.filter((entry) => {
      if (selectedCategory !== '전체' && entry.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      return (
        entry.term.toLowerCase().includes(q) ||
        (entry.english && entry.english.toLowerCase().includes(q)) ||
        entry.plainSummary.toLowerCase().includes(q) ||
        entry.aliases.some((a) => a.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const currentTerm = PHASE0_WARMUP_TERMS[stepIdx] ?? PHASE0_WARMUP_TERMS[0];
  const currentPicked = pickedOption[currentTerm.id];
  const isCurrentCheckCorrect =
    currentPicked === currentTerm.quickCheck.correctIndex;
  const isCurrentDone = completedWarmupIds.includes(currentTerm.id);
  const doneCount = PHASE0_WARMUP_TERMS.filter((t) =>
    completedWarmupIds.includes(t.id),
  ).length;

  const handlePickQuickCheck = (optIdx: number) => {
    setPickedOption((prev) => ({ ...prev, [currentTerm.id]: optIdx }));
    if (optIdx === currentTerm.quickCheck.correctIndex) {
      onCompleteWarmupTerm(currentTerm.id);
    }
  };

  const handleNext = () => {
    onCompleteWarmupTerm(currentTerm.id);
    if (stepIdx < PHASE0_WARMUP_TERMS.length - 1) {
      setStepIdx(stepIdx + 1);
    } else {
      onStartDay01();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2540]/30 p-3 backdrop-blur-[2px] sm:p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Phase 0 필수 용어 워밍업 및 용어 사전"
    >
      <div
        className="flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#E6E8EC] bg-white shadow-[0_24px_48px_rgba(10,37,64,0.16)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar with Tab Switcher */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#E6E8EC] bg-[#F7F8FA] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-1 rounded-lg bg-[#ECEEF2] p-0.5">
            <button
              type="button"
              onClick={() => setTab('warmup')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                tab === 'warmup'
                  ? 'bg-white text-[#0A2540] shadow-[0_1px_2px_rgba(10,37,64,0.06)]'
                  : 'text-[#697386] hover:text-[#0A2540]'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#635BFF]" />
              <span>Phase 0 · 3분 워밍업 ({doneCount}/10)</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('glossary')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                tab === 'glossary'
                  ? 'bg-white text-[#0A2540] shadow-[0_1px_2px_rgba(10,37,64,0.06)]'
                  : 'text-[#697386] hover:text-[#0A2540]'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 text-[#697386]" />
              <span>전체 용어 사전 ({GLOSSARY_ENTRIES.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="창 닫기"
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#697386] transition hover:bg-[#ECEEF2] hover:text-[#0A2540]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {tab === 'warmup' ? (
          <>
            {/* 10-Step Pill Bar */}
            <div className="shrink-0 border-b border-[#ECEEF2] bg-white px-4 py-2.5 sm:px-6">
              <div className="flex items-center justify-between gap-2 text-[11px] text-[#697386]">
                <span className="inline-flex items-center gap-1 font-mono font-medium">
                  <Clock className="h-3 w-3 text-[#635BFF]" />
                  카드 {String(stepIdx + 1).padStart(2, '0')} / 10 · 약 3분 코스
                </span>
                <span className="font-mono text-[10px]">
                  체크 완료 시 +5 EXP
                </span>
              </div>
              <div className="mt-2 grid grid-cols-10 gap-1.5">
                {PHASE0_WARMUP_TERMS.map((item, idx) => {
                  const active = idx === stepIdx;
                  const done = completedWarmupIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStepIdx(idx)}
                      title={`${String(item.order).padStart(2, '0')}. ${item.term}`}
                      className={`flex h-6 items-center justify-center rounded font-mono text-[10px] font-semibold transition ${
                        active
                          ? 'bg-[#635BFF] text-white'
                          : done
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200'
                            : 'bg-[#F1F3F6] text-[#697386] hover:bg-[#E6E8EC]'
                      }`}
                    >
                      {String(item.order).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Card Body */}
            <div className="lab-scroll min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs font-semibold text-[#635BFF]">
                      #{String(currentTerm.order).padStart(2, '0')}
                    </span>
                    <h2 className="text-lg font-bold tracking-tight text-[#0A2540] sm:text-xl">
                      {currentTerm.term}
                    </h2>
                    <span className="font-mono text-xs text-[#697386]">
                      {currentTerm.english}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-[#0A2540]">
                    {currentTerm.oneLiner}
                  </p>
                </div>
                {isCurrentDone && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    확인됨
                  </span>
                )}
              </div>

              <div className="mt-4">
                <WarmupDiagram type={currentTerm.visualType} />
              </div>

              <div className="mt-5 space-y-4">
                <MascotSpeechBubble mood="happy" label="10초 일상 비유">
                  {currentTerm.analogy}
                </MascotSpeechBubble>

                <div className="border-l-2 border-rose-500 py-0.5 pl-3.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">
                    이걸 모르면 생기는 문제
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#425466]">
                    {currentTerm.whyItMatters}
                  </p>
                </div>

                <div className="rounded-lg border border-[#E6E8EC] bg-[#F7F8FA] px-3.5 py-2.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#697386]">
                    실제 보드 · 코드에서 만나는 모습
                  </div>
                  <div className="mt-1 font-mono text-xs font-medium text-[#0A2540]">
                    {currentTerm.boardSighting}
                  </div>
                </div>
              </div>

              {/* 1-Second Quick Check */}
              <div className="mt-5 border-t border-[#E6E8EC] pt-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#635BFF]">
                  1초 감 잡기 체크
                </div>
                <p className="mt-1 text-xs font-semibold text-[#0A2540]">
                  {currentTerm.quickCheck.question}
                </p>
                <div className="mt-2.5 space-y-1.5">
                  {currentTerm.quickCheck.options.map((opt, idx) => {
                    const chosen = currentPicked === idx;
                    const right = idx === currentTerm.quickCheck.correctIndex;
                    let cls =
                      'border-[#E6E8EC] bg-white text-[#425466] hover:bg-[#F7F8FA] hover:text-[#0A2540]';
                    if (currentPicked !== undefined) {
                      if (right) {
                        cls =
                          'border-emerald-300 bg-emerald-50/70 text-emerald-900';
                      } else if (chosen) {
                        cls = 'border-rose-300 bg-rose-50/70 text-rose-900';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handlePickQuickCheck(idx)}
                        className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs font-medium transition ${cls}`}
                      >
                        <span>{opt}</span>
                        {currentPicked !== undefined && right && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {currentPicked !== undefined && (
                  <p
                    className={`mt-2.5 border-l-2 pl-3 text-xs leading-relaxed ${
                      isCurrentCheckCorrect
                        ? 'border-emerald-500 text-[#425466]'
                        : 'border-amber-500 text-[#425466]'
                    }`}
                  >
                    <strong className="mr-1 text-[#0A2540]">
                      {isCurrentCheckCorrect ? '정답!' : '참고:'}
                    </strong>
                    {currentTerm.quickCheck.explanation}
                  </p>
                )}
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#E6E8EC] bg-[#F7F8FA] px-4 py-3 sm:px-6">
              <button
                type="button"
                disabled={stepIdx === 0}
                onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E6E8EC] bg-white px-3 text-xs font-medium text-[#425466] transition hover:text-[#0A2540] disabled:opacity-40"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>이전</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#635BFF] px-4 text-xs font-semibold text-white transition hover:bg-[#5249F5]"
              >
                <span>
                  {stepIdx < PHASE0_WARMUP_TERMS.length - 1
                    ? '이해했어요 · 다음 용어'
                    : '워밍업 완료! Day 01 시작하기'}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        ) : (
          /* Full Searchable Glossary Tab */
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="shrink-0 space-y-2.5 border-b border-[#E6E8EC] bg-white px-4 py-3 sm:px-6">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#98A2B3]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="모르는 용어 검색 (예: GPIO, GND, 브라운아웃, PWM, PID...)"
                  className="h-9 w-full rounded-lg border border-[#E6E8EC] bg-[#F7F8FA] pl-8 pr-8 text-xs text-[#0A2540] placeholder:text-[#98A2B3] focus:border-[#635BFF] focus:bg-white focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="검색어 지우기"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#0A2540]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="lab-scroll flex items-center gap-1.5 overflow-x-auto pb-0.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                      selectedCategory === cat
                        ? 'bg-[#0A2540] text-white'
                        : 'bg-[#F7F8FA] text-[#425466] hover:bg-[#ECEEF2]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="lab-scroll min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-6">
              {filteredGlossary.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#697386]">
                  &ldquo;{searchQuery}&rdquo;에 해당하는 용어가 없습니다.
                </div>
              ) : (
                <div className="divide-y divide-[#ECEEF2]">
                  {filteredGlossary.map((entry) => (
                    <div key={entry.id} className="py-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-xs font-bold text-[#0A2540]">
                            {entry.term}
                          </span>
                          {entry.english && (
                            <span className="font-mono text-[11px] text-[#697386]">
                              {entry.english}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {entry.warmupId && (
                            <button
                              type="button"
                              onClick={() => {
                                const idx = PHASE0_WARMUP_TERMS.findIndex(
                                  (t) => t.id === entry.warmupId,
                                );
                                if (idx >= 0) {
                                  setStepIdx(idx);
                                  setTab('warmup');
                                }
                              }}
                              className="rounded bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-semibold text-[#4F46E5] hover:bg-[#E0E7FF]"
                            >
                              3분 워밍업 카드 →
                            </button>
                          )}
                          <span className="rounded bg-[#F1F3F6] px-2 py-0.5 text-[10px] font-medium text-[#697386]">
                            {entry.category}
                          </span>
                        </div>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#0A2540]">
                        {entry.plainSummary}
                      </p>
                      {entry.analogy && (
                        <p className="mt-1.5 border-l-2 border-[#635BFF]/60 pl-2.5 text-[11px] leading-relaxed text-[#425466]">
                          <strong className="mr-1 text-[#635BFF]">비유</strong>
                          {entry.analogy}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
