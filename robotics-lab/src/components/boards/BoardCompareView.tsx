import { ArrowRight, CheckCircle2, Cpu, Sparkles, Wifi } from 'lucide-react';
import { useState } from 'react';
import { BOARDS_CATALOG } from '../../data/boardsCatalog';
import { BoardId, BoardSpec } from '../../types/lab';
import { GlossaryText } from '../GlossaryText';

interface BoardCompareViewProps {
  onSelectBoard3D: (boardId: BoardId) => void;
}

type UseCaseFilter =
  | 'all'
  | 'starter'
  | 'wireless'
  | 'compact'
  | 'many_pins'
  | 'vision_ros';

const USE_CASE_FILTERS: {
  id: UseCaseFilter;
  label: string;
  hint: string;
}[] = [
  { id: 'all', label: '전체 8종 보기', hint: '8개 대표 보드 전체를 나란히 비교합니다.' },
  {
    id: 'starter',
    label: '왕초보 첫 입문',
    hint: '5V 호환성 또는 쉬운 파이썬/가성비로 처음 시작하기 좋은 보드입니다.',
  },
  {
    id: 'wireless',
    label: 'Wi-Fi · 무선 조종',
    hint: '스마트폰·PC와 무선으로 통신하는 RC 로버/IoT에 적합합니다.',
  },
  {
    id: 'compact',
    label: '소형 · 빵판 직결',
    hint: '크기가 작아 브레드보드 위나 소형 기체에 바로 꽂기 좋습니다.',
  },
  {
    id: 'many_pins',
    label: '모터·센서 많은 대형 봇',
    hint: '다관절 로봇 팔이나 센서 10개 이상을 동시에 물려야 할 때 추천합니다.',
  },
  {
    id: 'vision_ros',
    label: '카메라 비전 · ROS 2',
    hint: '리눅스 OS 위에서 OpenCV, LiDAR SLAM, ROS 2를 돌리는 컴퓨터 보드입니다.',
  },
];

export function BoardCompareView({ onSelectBoard3D }: BoardCompareViewProps) {
  const [filter, setFilter] = useState<UseCaseFilter>('all');

  const activeFilterInfo = USE_CASE_FILTERS.find((f) => f.id === filter)!;
  const isHighlighted = (board: BoardSpec) =>
    filter === 'all' || board.useCaseTags.includes(filter);

  return (
    <div className="lab-scroll h-full overflow-y-auto bg-white">
      <div
        className="mx-auto max-w-6xl px-5 py-7 sm:px-8 sm:py-9"
        style={{ paddingBottom: 'calc(3rem + var(--safe-bottom))' }}
      >
        {/* Header & Interactive Project Selector */}
        <header className="border-b border-[#E6E8EC] pb-6">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#635BFF]">
            8-Board Comparison Matrix
          </div>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-[#0A2540] sm:text-2xl">
            내 로봇에 딱 맞는 보드 한눈에 비교하기
          </h2>
          <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-[#425466]">
            <GlossaryText text="핵심 원리(전기·PWM·I2C·PID)는 보드와 무관하게 같지만, 로직 전압(5V vs 3.3V)과 무선/연산 성능에 따라 어울리는 보드가 다릅니다." />
          </p>

          <div className="mt-5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0A2540]">
              <Sparkles className="h-3.5 w-3.5 text-[#635BFF]" />
              <span>만들고 싶은 로봇 유형을 눌러 추천 보드를 좁혀보세요</span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {USE_CASE_FILTERS.map((item) => {
                const active = filter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? 'bg-[#635BFF] text-white'
                        : 'border border-[#E6E8EC] bg-[#F7F8FA] text-[#425466] hover:bg-[#ECEEF2] hover:text-[#0A2540]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-[#697386]">
              {activeFilterInfo.hint}
            </p>
          </div>
        </header>

        {/* Quick Decision Cards for Recommended Boards */}
        {filter !== 'all' && (
          <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BOARDS_CATALOG.filter((b) => isHighlighted(b)).map((board) => (
              <div
                key={board.id}
                className="flex flex-col justify-between rounded-xl border border-[#635BFF]/30 bg-[#EEF2FF]/45 p-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A2540]">
                      <span
                        className="h-2.5 w-2.5 rounded-sm"
                        style={{ backgroundColor: board.pcbColor }}
                      />
                      {board.name}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                        board.logicVoltage === '5V'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {board.logicVoltage}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#425466]">
                    <GlossaryText text={board.bestFor} />
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectBoard3D(board.id)}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#635BFF] hover:text-[#4F46E5]"
                >
                  <span>3D로 분해·탐색하기</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </section>
        )}

        {/* Responsive Comparison Table */}
        <section className="mt-6 overflow-hidden rounded-xl border border-[#E6E8EC]">
          <div className="lab-scroll overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#E6E8EC] bg-[#F7F8FA] text-[11px] font-semibold text-[#697386]">
                  <th className="px-4 py-3">보드</th>
                  <th className="px-3 py-3">로직 전압</th>
                  <th className="px-3 py-3">두뇌 (CPU)</th>
                  <th className="px-3 py-3">핀 구성</th>
                  <th className="px-3 py-3">무선</th>
                  <th className="px-3 py-3">이럴 때 선택 / 주의점</th>
                  <th className="px-4 py-3 text-right">3D 보기</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEEF2]">
                {BOARDS_CATALOG.map((board) => {
                  const matched = isHighlighted(board);
                  return (
                    <tr
                      key={board.id}
                      className={`transition ${
                        matched
                          ? filter !== 'all'
                            ? 'bg-[#EEF2FF]/30'
                            : 'bg-white hover:bg-[#F7F8FA]'
                          : 'bg-[#F7F8FA]/40 opacity-45'
                      }`}
                    >
                      <td className="px-4 py-3.5 align-top">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 shrink-0 rounded-sm border border-black/10"
                            style={{ backgroundColor: board.pcbColor }}
                          />
                          <div>
                            <div className="flex items-center gap-1.5 font-semibold text-[#0A2540]">
                              <span>{board.name}</span>
                              {filter !== 'all' && matched && (
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#635BFF]" />
                              )}
                            </div>
                            <div className="mt-0.5 font-mono text-[10px] text-[#697386]">
                              {board.difficultyLabel} · {board.priceApprox}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3.5 align-top">
                        <span
                          className={`inline-block rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold ${
                            board.logicVoltage === '5V'
                              ? 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200'
                              : 'bg-sky-50 text-sky-800 ring-1 ring-inset ring-sky-200'
                          }`}
                        >
                          {board.logicVoltage}
                        </span>
                      </td>

                      <td className="px-3 py-3.5 align-top text-[#425466]">
                        <div className="flex items-center gap-1 font-medium text-[#0A2540]">
                          <Cpu className="h-3 w-3 shrink-0 text-[#697386]" />
                          <span>{board.cpu}</span>
                        </div>
                        <div className="mt-0.5 font-mono text-[10px] text-[#697386]">
                          {board.memory}
                        </div>
                      </td>

                      <td className="px-3 py-3.5 align-top text-[#425466]">
                        <GlossaryText text={board.gpioSummary} />
                      </td>

                      <td className="px-3 py-3.5 align-top">
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#425466]">
                          <Wifi
                            className={`h-3 w-3 ${
                              board.wireless.startsWith('없음')
                                ? 'text-[#CBD5E1]'
                                : 'text-[#635BFF]'
                            }`}
                          />
                          <span>{board.wireless}</span>
                        </span>
                      </td>

                      <td className="max-w-[260px] px-3 py-3.5 align-top">
                        <div className="text-[11px] leading-relaxed text-[#0A2540]">
                          <GlossaryText text={board.bestFor} />
                        </div>
                        <div className="mt-1 text-[10px] leading-relaxed text-rose-700">
                          주의: <GlossaryText text={board.watchOut} />
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-right align-top">
                        <button
                          type="button"
                          onClick={() => onSelectBoard3D(board.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#E6E8EC] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#0A2540] transition hover:border-[#635BFF] hover:text-[#635BFF]"
                        >
                          <span>3D 보기</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Key Beginner Rule Callout */}
        <section className="mt-6 rounded-xl border border-[#E6E8EC] bg-[#F7F8FA] p-4 text-xs text-[#425466]">
          <div className="font-semibold text-[#0A2540]">
            핵심 정리: 왜 실제 로봇에서는 Raspberry Pi 4 + ESP32를 같이 쓸까요?
          </div>
          <p className="mt-1 leading-relaxed">
            <GlossaryText text="Arduino·ESP32·Pico·STM32는 OS 없이 0.001초 단위로 모터를 돌리는 MCU(근육 제어기)이고, Raspberry Pi 4는 리눅스가 도는 미니 PC(SBC)라서 카메라 비전과 ROS 2·SLAM 판단을 맡습니다. Phase 5(Day 35)에서 두 보드를 시리얼로 연결해 협업시키는 구조를 배웁니다." />
          </p>
        </section>
      </div>
    </div>
  );
}
