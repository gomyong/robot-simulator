import { ArrowRight, BookOpen, X } from 'lucide-react';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { tokenizeGlossaryText } from '../data/glossary';
import { GlossaryEntry } from '../types/lab';

interface ActiveGlossaryPopover {
  entry: GlossaryEntry;
  rect: DOMRect;
}

interface GlossaryContextValue {
  activePopover: ActiveGlossaryPopover | null;
  openTerm: (entry: GlossaryEntry, element: HTMLElement) => void;
  closePopover: () => void;
  onOpenGlossaryModal?: (
    tab: 'warmup' | 'glossary',
    targetId?: string,
  ) => void;
}

const GlossaryContext = createContext<GlossaryContextValue>({
  activePopover: null,
  openTerm: () => {},
  closePopover: () => {},
});

interface GlossaryProviderProps {
  children: ReactNode;
  onOpenGlossaryModal?: (
    tab: 'warmup' | 'glossary',
    targetId?: string,
  ) => void;
}

export function GlossaryProvider({
  children,
  onOpenGlossaryModal,
}: GlossaryProviderProps) {
  const [activePopover, setActivePopover] =
    useState<ActiveGlossaryPopover | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const closePopover = useCallback(() => {
    setActivePopover(null);
  }, []);

  const openTerm = useCallback((entry: GlossaryEntry, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setActivePopover((prev) => {
      if (
        prev &&
        prev.entry.id === entry.id &&
        Math.abs(prev.rect.top - rect.top) < 4 &&
        Math.abs(prev.rect.left - rect.left) < 4
      ) {
        return null;
      }
      return { entry, rect };
    });
  }, []);

  useEffect(() => {
    if (!activePopover) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePopover(null);
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (popoverRef.current && popoverRef.current.contains(target)) {
        return;
      }
      if (target.closest('[data-glossary-term="true"]')) {
        return;
      }
      setActivePopover(null);
    };

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target && popoverRef.current && popoverRef.current.contains(target)) {
        return;
      }
      setActivePopover(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, {
      passive: true,
    });
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', closePopover);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', closePopover);
    };
  }, [activePopover, closePopover]);

  const popoverStyle = useMemo(() => {
    if (!activePopover) return null;
    const width = Math.min(310, window.innerWidth - 24);
    const margin = 12;
    const estHeight = 195;
    const { rect } = activePopover;

    const spaceBelow = window.innerHeight - rect.bottom;
    const openAbove = spaceBelow < estHeight && rect.top > estHeight;

    const top = openAbove
      ? Math.max(margin, rect.top - 8)
      : Math.min(window.innerHeight - margin, rect.bottom + 8);

    const idealLeft = rect.left + rect.width / 2 - width / 2;
    const left = Math.max(
      margin,
      Math.min(idealLeft, window.innerWidth - width - margin),
    );

    return {
      width,
      top,
      left,
      transform: openAbove ? 'translateY(-100%)' : 'none',
    };
  }, [activePopover]);

  return (
    <GlossaryContext.Provider
      value={{ activePopover, openTerm, closePopover, onOpenGlossaryModal }}
    >
      {children}
      {activePopover &&
        popoverStyle &&
        createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            aria-label={`${activePopover.entry.term} 용어 설명`}
            style={{
              position: 'fixed',
              top: popoverStyle.top,
              left: popoverStyle.left,
              width: popoverStyle.width,
              transform: popoverStyle.transform,
              zIndex: 80,
            }}
            className="rounded-xl border border-[#E6E8EC] bg-white p-3.5 text-left shadow-[0_18px_40px_rgba(10,37,64,0.16)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="inline-block rounded bg-[#EEF2FF] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#4F46E5]">
                  {activePopover.entry.category}
                </span>
                <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
                  <span className="text-xs font-bold text-[#0A2540]">
                    {activePopover.entry.term}
                  </span>
                  {activePopover.entry.english && (
                    <span className="font-mono text-[10px] text-[#697386]">
                      {activePopover.entry.english}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={closePopover}
                aria-label="용어 설명 닫기"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[#697386] transition hover:bg-[#F1F3F6] hover:text-[#0A2540]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-[#0A2540]">
              {activePopover.entry.plainSummary}
            </p>

            {activePopover.entry.analogy && (
              <p className="mt-2 border-l-2 border-[#635BFF] pl-2.5 text-[11px] leading-relaxed text-[#425466]">
                <strong className="mr-1 font-semibold text-[#635BFF]">
                  비유
                </strong>
                {activePopover.entry.analogy}
              </p>
            )}

            {onOpenGlossaryModal && (
              <div className="mt-2.5 border-t border-[#ECEEF2] pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = activePopover.entry;
                    closePopover();
                    if (target.warmupId) {
                      onOpenGlossaryModal('warmup', target.warmupId);
                    } else {
                      onOpenGlossaryModal('glossary', target.id);
                    }
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#635BFF] transition hover:text-[#4F46E5]"
                >
                  <BookOpen className="h-3 w-3" />
                  <span>
                    {activePopover.entry.warmupId
                      ? 'Phase 0 워밍업 카드로 보기'
                      : '전체 용어 사전에서 보기'}
                  </span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>,
          document.body,
        )}
    </GlossaryContext.Provider>
  );
}

interface GlossaryTextProps {
  text: string;
}

/**
 * Renders prose with subtle dotted underlines on robotics terms.
 * Clicking/tapping any underlined term opens a 1-line beginner translation popover.
 */
export function GlossaryText({ text }: GlossaryTextProps) {
  const { openTerm, activePopover } = useContext(GlossaryContext);

  const tokens = useMemo(() => tokenizeGlossaryText(text), [text]);

  return (
    <>
      {tokens.map((token, idx) => {
        if (!token.entry) {
          return <span key={idx}>{token.text}</span>;
        }
        const entry = token.entry;
        const isActive = activePopover?.entry.id === entry.id;
        return (
          <button
            key={idx}
            type="button"
            data-glossary-term="true"
            onClick={(e) => {
              e.stopPropagation();
              openTerm(entry, e.currentTarget);
            }}
            title={`${entry.term}: ${entry.plainSummary}`}
            className={`inline cursor-pointer border-b border-dotted px-[1px] text-left font-medium transition-colors ${
              isActive
                ? 'border-[#635BFF] bg-[#EEF2FF] text-[#4F46E5]'
                : 'border-[#635BFF]/65 text-inherit hover:border-[#635BFF] hover:bg-[#EEF2FF]/70 hover:text-[#0A2540]'
            }`}
          >
            {token.text}
          </button>
        );
      })}
    </>
  );
}
