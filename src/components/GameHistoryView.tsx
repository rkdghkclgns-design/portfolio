import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter } from 'lucide-react';
import { ALL_GAMES } from '../data/games';
import { CinematicIntro } from './CinematicIntro';

interface GameHistoryViewProps {
  onBack: () => void;
  history?: any;
  setHistory?: any;
  isEditing?: boolean;
}

const GENRE_MAP: Record<string, string[]> = {
  'RPG': ['RPG'],
  '어드벤처': ['어드벤처', '노벨', '공포', '로그라이크', '메트로배니아', '비주얼 노벨'],
  '퍼즐': ['퍼즐', '퀴즈', '캐주얼'],
  '액션': ['액션', '난투', '대전', '배틀로얄', '격투', '런앤건', '플랫폼', '런게임', '생존'],
  '전략': ['전략', 'AOS', 'RTS', 'CCG', 'TCG', '디펜스'],
  '시뮬레이션': ['시뮬레이션', '스포츠', '레이싱', '경영', 'AR', '수면', '보드게임', '소셜'],
  '슈팅': ['슈팅', 'FPS', 'TPS', '히어로슈터'],
  '리듬': ['리듬']
};

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

export const GameHistoryView = ({ onBack }: GameHistoryViewProps) => {
  const [isIntroActive, setIsIntroActive] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('gamingDnaIntroPlayed') !== 'true';
    }
    return true;
  });
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [displayLimit, setDisplayLimit] = useState(32);

  const handleIntroComplete = () => {
    setIsIntroActive(false);
    sessionStorage.setItem('gamingDnaIntroPlayed', 'true');
  };

  // Fix: Match local data categories (Pc, Console, Mobile)
  const pcConsoleGames = ALL_GAMES.filter(g => g.category === 'Pc' || g.category === 'PC' || g.category === 'Console');
  const mobileGames = ALL_GAMES.filter(g => g.category === 'Mobile');

  const filteredGames = ALL_GAMES.filter(g => {
    let matchesSearch = true;
    if (searchQuery) {
      matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (g.company && g.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (g.genre && g.genre.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    let matchesGenre = true;
    if (activeGenre) {
      const keywords = GENRE_MAP[activeGenre] || [activeGenre];
      matchesGenre = keywords.some(kw => g.genre?.toLowerCase().includes(kw.toLowerCase()));
    }

    return matchesSearch && matchesGenre;
  });

  React.useEffect(() => {
    setDisplayLimit(32);
  }, [activeGenre, searchQuery]);

  // Body scroll lock is now handled inside CinematicIntro
  React.useEffect(() => {
    if (isIntroActive) {
      window.scrollTo(0, 0);
    }
  }, [isIntroActive]);

  const displayedGames = filteredGames.slice(0, displayLimit);

  const getPt = (value: number, angleDeg: number, size: number) => {
    const cx = size / 2;
    const cy = size / 2;
    const r = (value / 100) * (size / 2 - 40); // 40px padding
    const param = (angleDeg - 90) * (Math.PI / 180);
    return `${cx + r * Math.cos(param)},${cy + r * Math.sin(param)}`;
  };

  const svgSize = 420;
  const cx = svgSize / 2;
  const cy = svgSize / 2;

  const polygonPoints = CHART_DATA.map(d => getPt(d.score, d.angle, svgSize)).join(' ');
  const bgPolygons = [20, 40, 60, 80, 100].map(level => {
    return CHART_DATA.map(d => getPt(level, d.angle, svgSize)).join(' ');
  });

  const getFallbackGradient = (genre: string) => {
    const g = genre.toLowerCase();
    if (g.includes('rpg')) return 'from-blue-600/40 to-indigo-900/80';
    if (g.includes('액션') || g.includes('난투')) return 'from-red-600/40 to-rose-900/80';
    if (g.includes('전략') || g.includes('aos') || g.includes('rts')) return 'from-emerald-600/40 to-teal-900/80';
    if (g.includes('슈팅') || g.includes('fps')) return 'from-zinc-600/40 to-slate-900/80';
    if (g.includes('리듬')) return 'from-purple-600/40 to-fuchsia-900/80';
    if (g.includes('퍼즐') || g.includes('캐주얼')) return 'from-amber-500/40 to-orange-800/80';
    if (g.includes('레이싱') || g.includes('스포츠')) return 'from-cyan-600/40 to-blue-800/80';
    return 'from-zinc-400/40 to-zinc-800/80';
  };

  return (
    <>
      <AnimatePresence>
        {isIntroActive && (
          <CinematicIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      <motion.section 
        className="min-h-screen bg-transparent pt-28 pb-32 overflow-x-hidden"
      >

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Minimalist Header to match GitHub design (removed search bar and big titles) */}
        
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-24 lg:mb-32">
          {/* Radar Chart Section */}
          <div className="bg-white border border-black/5 rounded-4xl p-10 md:p-12 shadow-sm flex flex-col items-center justify-center min-h-[480px]">
            <h3 className="font-bold text-xl text-zinc-500 tracking-tight self-start mb-8">장르별 숙련도 차트</h3>
            <div className="relative" style={{ width: svgSize, height: svgSize }}>
              <svg width={svgSize} height={svgSize} className="overflow-visible">
                {bgPolygons.map((pts, i) => (
                  <polygon key={i} points={pts} fill="none" stroke="#E5E7EB" strokeWidth="1" />
                ))}
                {CHART_DATA.map((d, i) => (
                  <line key={i} x1={cx} y1={cy} x2={getPt(100, d.angle, svgSize).split(',')[0]} y2={getPt(100, d.angle, svgSize).split(',')[1]} stroke="#E5E7EB" strokeWidth="1" />
                ))}
                
                {/* Data Polygon with Stroke Dash Animation */}
                <motion.polygon 
                  initial={{ strokeDasharray: "0, 2000" }}
                  animate={{ strokeDasharray: "2000, 0" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  points={polygonPoints} fill="rgba(0, 71, 187, 0.15)" stroke="#0047BB" strokeWidth="2.5" 
                />
                
                {/* Data Points */}
                {CHART_DATA.map((d, i) => {
                  const [px, py] = getPt(d.score, d.angle, svgSize).split(',');
                  const isHovered = hoveredPoint === i;
                  return (
                    <g key={`pt-${i}`}>
                      <circle 
                        cx={px} cy={py} 
                        r={isHovered ? "6" : "4"} 
                        fill={isHovered ? "white" : "#0047BB"} 
                        stroke="#0047BB" 
                        strokeWidth={isHovered ? "2" : "0"} 
                        className="transition-all cursor-pointer" 
                        onMouseEnter={() => setHoveredPoint(i)} 
                        onMouseLeave={() => setHoveredPoint(null)} 
                      />
                    </g>
                  );
                })}
                
                {/* Labels */}
                {CHART_DATA.map((d, i) => {
                  const [lx, ly] = getPt(115, d.angle, svgSize).split(',');
                  const isActive = activeGenre === d.label;
                  return (
                    <g key={i} onClick={() => setActiveGenre(isActive ? null : d.label)} className="cursor-pointer group" transform={`translate(${lx}, ${ly})`}>
                      <text x="0" y="0" textAnchor="middle" alignmentBaseline="middle" className={`font-bold transition-all text-[13px] tracking-tight ${isActive ? 'fill-[#0047BB] text-[15px]' : 'fill-zinc-400 group-hover:fill-zinc-700'}`}>{d.label}</text>
                    </g>
                  );
                })}

                {/* Tooltip */}
                {hoveredPoint !== null && (
                  <g className="pointer-events-none">
                    {(() => {
                      const d = CHART_DATA[hoveredPoint];
                      const [px, py] = getPt(d.score, d.angle, svgSize).split(',');
                      return (
                        <>
                          <rect x={Number(px) - 24} y={Number(py) - 34} width="48" height="24" rx="4" fill="#1A2332" />
                          <text x={px} y={Number(py) - 21} textAnchor="middle" alignmentBaseline="middle" fill="white" className="text-[12px] font-bold tracking-widest">{d.score}점</text>
                        </>
                      );
                    })()}
                  </g>
                )}
              </svg>
            </div>

          </div>

          {/* Stats Section */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-black/5 rounded-4xl p-10 md:p-12 shadow-sm flex-1 flex flex-col justify-center">
              <h3 className="font-bold text-xl text-zinc-500 tracking-tight mb-10">플레이 요약 통계</h3>
              <ul className="space-y-8">
                <li className="flex items-center justify-between border-b border-black/5 pb-5"><span className="font-bold text-lg text-[#2C2C2C]">총 플레이</span><span className="font-black text-[#0047BB] text-2xl md:text-3xl">{ALL_GAMES.length}종 이상</span></li>
                <li className="flex items-center justify-between border-b border-black/5 pb-5"><span className="font-bold text-lg text-[#2C2C2C]">주력 플랫폼</span><span className="font-bold text-zinc-600 text-xl">PC / 콘솔</span></li>
                <li className="flex items-center justify-between border-b border-black/5 pb-5"><span className="font-bold text-lg text-[#2C2C2C]">최장 플레이</span><span className="font-bold text-zinc-600 text-xl">대표 게임 (○년)</span></li>
                <li className="flex items-center justify-between"><span className="font-bold text-lg text-[#2C2C2C]">전문 분야</span><span className="font-bold text-[#0047BB] text-xl bg-[#0047BB]/10 px-4 py-1.5 rounded-md">RPG / 리듬</span></li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#0047BB] text-white border border-[#0047BB] rounded-3xl p-8 md:p-10 shadow-sm"><span className="block font-bold text-blue-200 text-lg mb-3">PC/콘솔</span><span className="text-4xl md:text-5xl font-black">{pcConsoleGames.length}종</span></div>
              <div className="bg-white border border-black/5 rounded-3xl p-8 md:p-10 shadow-sm"><span className="block font-bold text-zinc-400 text-lg mb-3">모바일</span><span className="text-4xl md:text-5xl font-black text-[#2C2C2C]">{mobileGames.length}종</span></div>
            </div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-black/10 gap-4">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
            게임 상세 플레이 이력 {activeGenre && <span className="text-[#0047BB] before:content-['|'] before:text-zinc-300 before:mr-3 before:font-light">{activeGenre} 검색 결과</span>}
          </h2>
          {activeGenre && (
            <button onClick={() => setActiveGenre(null)} className="text-sm font-bold text-zinc-400 hover:text-red-500 flex items-center gap-1 transition-colors"><Filter className="w-4 h-4" /> 필터 해제</button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button onClick={() => setActiveGenre(null)} className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all ${!activeGenre ? 'bg-[#0047BB] text-white shadow-md' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}>전체</button>
          {Object.keys(GENRE_MAP).map(genre => (
            <button key={genre} onClick={() => setActiveGenre(genre)} className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all ${activeGenre === genre ? 'bg-[#0047BB] text-white shadow-md' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}>{genre}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
        <motion.div
          key={`grid-${activeGenre ?? 'all'}-${searchQuery}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
            {displayedGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.35) }}
                className="relative group h-[140px] rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all"
              >
                {/* Background Layer (Image or Fallback) */}
                <div className={`absolute inset-0 transition-transform duration-500 group-hover:scale-110 ${game.image ? 'bg-zinc-900' : `bg-linear-to-br ${getFallbackGradient(game.genre)}`}`}>
                  {game.image && (
                    <img src={game.image} alt={game.title} className="w-full h-full object-cover opacity-60" loading="lazy" style={{ objectPosition: game.position || 'center', objectFit: (game.size as any) || 'cover' }} />
                  )}
                </div>

                {/* Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

                {/* Content Layer */}
                <div className="relative h-full z-10 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-black text-white bg-white/20 backdrop-blur-md px-2 py-0.5 rounded tracking-widest uppercase">{game.genre}</span>
                      <span className="text-[9px] font-bold text-white/50 border border-white/20 px-1.5 py-0.5 rounded uppercase">
                        {game.category === 'Pc' || game.category === 'PC' || game.category === 'Console' ? 'PC/CONSOLE' : 'MOBILE'}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-base md:text-lg leading-tight mb-1 group-hover:text-blue-400 transition-colors drop-shadow-sm line-clamp-2">{game.title}</h4>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-[10px] font-bold text-white/60 truncate max-w-[60%]">{game.company}</span>
                    {game.playTime && <span className="text-[10px] font-black text-yellow-400 drop-shadow-md">{game.playTime}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
        </motion.div>
        </AnimatePresence>

        {/* Load More Button */}
        {displayLimit < filteredGames.length && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => setDisplayLimit(prev => prev + 32)}
              className="px-10 py-4 bg-[#0047BB] text-white font-black text-sm tracking-[0.2em] rounded-full hover:bg-[#003799] transition-all shadow-xl shadow-[#0047BB]/20 active:scale-95"
            >
              LOAD MORE RECORDS ({filteredGames.length - displayLimit} REMAINING)
            </button>
          </div>
        )}

        {filteredGames.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-zinc-400 bg-white rounded-3xl border border-black/5">
            <Search className="w-10 h-10 mb-4 opacity-20" />
            <p className="font-bold text-lg">해당 조건의 게임이 없습니다.</p>
          </div>
        )}
      </div>
    </motion.section>
    </>
  );
};
