import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import { ALL_GAMES } from '../data/games';

interface CinematicIntroProps {
  onComplete: () => void;
}

// Same chart constants as GameHistoryView
const CHART_DATA = [
  { label: 'RPG', score: 99, angle: 0 },
  { label: '어드벤처', score: 92, angle: 45 },
  { label: '퍼즐', score: 88, angle: 90 },
  { label: '액션', score: 85, angle: 135 },
  { label: '전략', score: 82, angle: 180 },
  { label: '시뮬레이션', score: 87, angle: 225 },
  { label: '슈팅', score: 45, angle: 270 },
  { label: '리듬', score: 98, angle: 315 },
];
const SVG = 420;
const C = SVG / 2;
const pt = (v: number, a: number) => {
  const r = (v / 100) * (C - 40);
  const rad = (a - 90) * (Math.PI / 180);
  return { x: C + r * Math.cos(rad), y: C + r * Math.sin(rad) };
};
const polyPts = CHART_DATA.map(d => { const p = pt(d.score, d.angle); return `${p.x},${p.y}`; }).join(' ');
const bgLvls = [20, 40, 60, 80, 100].map(lv =>
  CHART_DATA.map(d => { const p = pt(lv, d.angle); return `${p.x},${p.y}`; }).join(' ')
);

const fallbackBg = (genre: string) => {
  const g = genre.toLowerCase();
  if (g.includes('rpg')) return '#1e3a8a';
  if (g.includes('액션') || g.includes('난투')) return '#7f1d1d';
  if (g.includes('전략') || g.includes('aos') || g.includes('rts')) return '#064e3b';
  if (g.includes('슈팅') || g.includes('fps')) return '#1c1917';
  if (g.includes('리듬')) return '#4a044e';
  if (g.includes('퍼즐') || g.includes('캐주얼')) return '#78350f';
  return '#27272a';
};

export const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

  const pcCount = ALL_GAMES.filter(g => ['Pc', 'PC', 'Console'].includes(g.category)).length;
  const mobileCount = ALL_GAMES.filter(g => g.category === 'Mobile').length;

  useEffect(() => {
    // 스크롤바를 숨기지 않고 휠/터치 이벤트만 막아서 레이아웃 시프트(가운데 정렬 흔들림) 원천 차단
    const preventScroll = (e: Event) => e.preventDefault();
    const preventKey = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) {
        e.preventDefault();
      }
    };
    
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventKey as EventListener, { passive: false });

    if (contentRef.current) {
      // 렌더링된 실제 높이 계산
      setContentHeight(contentRef.current.scrollHeight);
    }

    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventKey as EventListener);
    };
  }, []);

  const dur = Math.max(1.2, (contentHeight - vh) / 5000);

  // 렌더링할 공통 UI 블록
  const renderContent = () => (
    <motion.section className="min-h-screen bg-transparent pt-28 pb-32 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* 통계 + 레이더차트 — 스크롤 끝 화면 */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-24 lg:mb-32">
          <div className="bg-white border border-black/5 rounded-4xl p-10 md:p-12 shadow-sm flex flex-col items-center justify-center min-h-[480px]">
            <h3 className="font-bold text-xl text-zinc-500 tracking-tight self-start mb-8">장르별 숙련도 차트</h3>
            <svg width={SVG} height={SVG} className="overflow-visible block mx-auto">
              {bgLvls.map((p, i) => <polygon key={i} points={p} fill="none" stroke="#E5E7EB" strokeWidth="1" />)}
              {CHART_DATA.map((d, i) => { const p = pt(100, d.angle); return <line key={i} x1={C} y1={C} x2={p.x} y2={p.y} stroke="#E5E7EB" strokeWidth="1" />; })}
              <polygon points={polyPts} fill="rgba(0,71,187,0.15)" stroke="#0047BB" strokeWidth="2.5" />
              {CHART_DATA.map((d, i) => { const p = pt(d.score, d.angle); return <circle key={i} cx={p.x} cy={p.y} r="4" fill="#0047BB" />; })}
              {CHART_DATA.map((d, i) => { const lp = pt(115, d.angle); return <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" className="text-[13px] font-bold tracking-tight fill-zinc-400">{d.label}</text>; })}
            </svg>
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-black/5 rounded-4xl p-10 md:p-12 shadow-sm flex-1 flex flex-col justify-center">
              <h3 className="font-bold text-xl text-zinc-500 tracking-tight mb-10">플레이 요약 통계</h3>
              <ul className="space-y-8">
                {[
                  { label: '총 플레이', val: `${ALL_GAMES.length}종 이상`, blue: true },
                  { label: '주력 플랫폼', val: 'PC / 콘솔' },
                  { label: '최장 플레이', val: '대표 게임 (○년)' },
                  { label: '전문 분야', val: 'RPG / 리듬', chip: true },
                ].map(({ label, val, blue, chip }) => (
                  <li key={label} className={`flex items-center justify-between ${label !== '전문 분야' ? 'border-b border-black/5 pb-5' : ''}`}>
                    <span className="font-bold text-lg text-[#2C2C2C]">{label}</span>
                    {chip
                      ? <span className="font-bold text-[#0047BB] text-xl bg-[#0047BB]/10 px-4 py-1.5 rounded-md">{val}</span>
                      : <span className={`font-bold text-xl ${blue ? 'text-[#0047BB] text-2xl md:text-3xl font-black' : 'text-zinc-600'}`}>{val}</span>
                    }
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#0047BB] text-white border border-[#0047BB] rounded-3xl p-8 md:p-10 shadow-sm">
                <span className="block font-bold text-blue-200 text-lg mb-3">PC/콘솔</span>
                <span className="text-4xl md:text-5xl font-black">{pcCount}종</span>
              </div>
              <div className="bg-white border border-black/5 rounded-3xl p-8 md:p-10 shadow-sm">
                <span className="block font-bold text-zinc-400 text-lg mb-3">모바일</span>
                <span className="text-4xl md:text-5xl font-black text-[#2C2C2C]">{mobileCount}종</span>
              </div>
            </div>
          </div>
        </div>

        {/* 게임 카드 그리드 — 스크롤 시작 화면 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-black/10 gap-4">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">게임 상세 플레이 이력</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-8 opacity-60 pointer-events-none">
          <button className="px-4 py-2 rounded-full text-[13px] font-bold transition-all bg-[#0047BB] text-white shadow-md">전체</button>
          {['RPG', '어드벤처', '퍼즐', '액션', '전략', '시뮬레이션', '슈팅', '리듬'].map(genre => (
            <button key={genre} className="px-4 py-2 rounded-full text-[13px] font-bold transition-all bg-zinc-100 text-zinc-500">{genre}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ALL_GAMES.map((game) => (
            <div key={game.id} className="relative group h-[140px] rounded-2xl overflow-hidden border border-black/5 shadow-sm bg-zinc-900">
              <div className="absolute inset-0 bg-zinc-900">
                {game.image && <img src={game.image} alt="" crossOrigin="anonymous" className="w-full h-full object-cover opacity-60" />}
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
              <div className="relative h-full z-10 p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-black text-white bg-white/20 backdrop-blur-md px-2 py-0.5 rounded tracking-widest uppercase">{game.genre}</span>
                  <span className="text-[9px] font-bold text-white/50 border border-white/20 px-1.5 py-0.5 rounded uppercase">
                    {['Pc', 'PC', 'Console'].includes(game.category) ? 'PC/CONSOLE' : 'MOBILE'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base md:text-lg leading-tight mb-1 drop-shadow-sm line-clamp-2">{game.title}</h4>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-[10px] font-bold text-white/60 truncate max-w-[60%]">{game.company}</span>
                    {game.playTime && <span className="text-[10px] font-black text-yellow-400 drop-shadow-md">{game.playTime}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );

  return (
    <motion.div 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.6, ease: "easeInOut" }} 
      className="absolute top-0 left-0 w-full min-h-screen z-[2000] overflow-hidden bg-bg-main bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] bg-blend-multiply"
    >
      {/* ── 렌더링된 높이를 재기 위한 보이지 않는 래퍼 ── */}
      {contentHeight === 0 && (
        <div ref={contentRef} style={{ position: 'absolute', top: 0, left: 0, visibility: 'hidden', width: '100%' }}>
          {renderContent()}
        </div>
      )}

      {/* ── 스크롤 애니메이션 ── */}
      <AnimatePresence>
        {contentHeight > 0 && (
          <motion.div
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', willChange: 'transform' }}
            initial={{ y: -contentHeight + vh }}
            animate={{ y: 0 }}
            transition={{ duration: dur, ease: [0.4, 0, 0.2, 1] }}
            onAnimationComplete={() => {
              setTimeout(onComplete, 300);
            }}
          >
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
