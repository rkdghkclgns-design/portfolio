import React from 'react';
import { motion } from 'motion/react';

// 손으로 목차를 써내려가는 SVG 애니메이션 컴포넌트
// "목차를 쓸 줄 아는 기획자" 메시지를 시각적으로 표현
export const HandwrittenTOC = () => {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.4, type: 'spring' as const, duration: 1.5, bounce: 0 },
        opacity: { delay: i * 0.4, duration: 0.01 },
      },
    }),
  };

  const fadeIn = (delay: number) => ({
    hidden: { opacity: 0, x: -8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { delay, duration: 0.5, ease: 'easeOut' as const },
    },
  });

  const checkDraw = (delay: number) => ({
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: 'spring' as const, duration: 0.6, bounce: 0.2 },
        opacity: { delay, duration: 0.01 },
      },
    },
  });

  const items = [
    { num: '01', label: '지원 동기', sub: '게임이 인생을 바꾼 순간', delay: 0.3 },
    { num: '02', label: '핵심 역량', sub: '목차 설계 → 논리 구조화', delay: 1.3 },
    { num: '03', label: 'AI 활용능력', sub: '시스템을 설계하는 감각', delay: 2.3 },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="relative w-full h-full flex items-center justify-center select-none pointer-events-none"
    >
      {/* 노트 용지 느낌 배경 */}
      <div className="relative w-[340px] md:w-[400px]">
        {/* 노트 줄 */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div
            key={i}
            className="w-full border-b border-[#0047BB]/6"
            style={{ height: '44px' }}
          />
        ))}

        {/* 왼쪽 세로줄 */}
        <div className="absolute left-10 top-0 bottom-0 w-px bg-[#C0392B]/15" />

        {/* 제목 — 손글씨 느낌의 SVG 언더라인 */}
        <div className="absolute top-[14px] left-14 right-4">
          <motion.p
            variants={fadeIn(0.1)}
            className="text-[11px] font-bold tracking-[0.25em] text-[#0047BB] uppercase mb-1"
          >
            Table of Contents
          </motion.p>
          <motion.svg
            width="160" height="8" viewBox="0 0 160 8"
            className="overflow-visible"
          >
            <motion.path
              d="M 0 6 C 40 2, 80 10, 160 4"
              stroke="#0047BB"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              variants={draw}
              custom={0}
            />
          </motion.svg>
        </div>

        {/* 목차 항목들 */}
        {items.map((item, idx) => (
          <div
            key={idx}
            className="absolute left-14 right-4"
            style={{ top: `${76 + idx * 88}px` }}
          >
            {/* 번호 */}
            <motion.span
              variants={fadeIn(item.delay)}
              className="text-[10px] font-black text-[#0047BB]/50 tracking-widest block mb-0.5"
            >
              {item.num}
            </motion.span>

            {/* 항목 이름 — 손글씨 언더라인 */}
            <motion.p
              variants={fadeIn(item.delay + 0.1)}
              className="text-[18px] md:text-[20px] font-bold text-[#1A2332] tracking-tight leading-none"
              style={{ fontFamily: "'Noto Serif KR', serif" }}
            >
              {item.label}
            </motion.p>

            {/* 부제 */}
            <motion.p
              variants={fadeIn(item.delay + 0.2)}
              className="text-[11px] text-zinc-400 font-medium mt-1 tracking-tight"
            >
              {item.sub}
            </motion.p>

            {/* 손글씨 밑줄 */}
            <motion.svg
              width="200" height="8" viewBox="0 0 200 8"
              className="overflow-visible mt-1"
            >
              <motion.path
                d={`M 0 4 C 50 ${idx % 2 === 0 ? '1' : '7'}, 120 ${idx % 2 === 0 ? '7' : '1'}, 200 4`}
                stroke="#0047BB"
                strokeWidth="1"
                strokeOpacity="0.2"
                fill="none"
                strokeLinecap="round"
                variants={draw}
                custom={item.delay / 0.4}
              />
            </motion.svg>

            {/* 체크 마크 (마지막만 제외하고 체크됨) */}
            {idx < 2 && (
              <motion.svg
                width="18" height="14" viewBox="0 0 18 14"
                className="absolute -left-8 top-[22px]"
              >
                <motion.path
                  d="M 2 7 L 6 11 L 16 2"
                  stroke="#0047BB"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={checkDraw(item.delay + 0.5)}
                />
              </motion.svg>
            )}

            {/* 현재 작성 중 — 깜빡이는 커서 (마지막 항목) */}
            {idx === 2 && (
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' as const }}
                className="absolute -left-8 top-[22px] w-3 h-[2px] bg-[#0047BB] rounded-full"
              />
            )}
          </div>
        ))}

        {/* 연필 아이콘 */}
        <motion.div
          variants={fadeIn(3.2)}
          className="absolute bottom-[-20px] right-4 text-zinc-300 text-xs font-medium tracking-wider flex items-center gap-1.5"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
          </svg>
          작성 중...
        </motion.div>
      </div>
    </motion.div>
  );
};
