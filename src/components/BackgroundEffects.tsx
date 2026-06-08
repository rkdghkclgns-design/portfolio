import React, { useMemo } from 'react';
import { motion } from 'motion/react';

const DUST_COUNT = 70; // 먼지 개수 증가
const PAPER_COUNT = 12;

const PAPER_STYLES = [
  // 모눈종이 (Grid Paper)
  'bg-white border border-black/10 bg-[size:4px_4px] bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)]',
  // 줄무늬 노트 (Ruled Paper)
  'bg-white border border-black/10 bg-[size:100%_8px] bg-[linear-gradient(transparent_7px,rgba(0,71,187,0.1)_1px)]',
  // 빈 종이 조각 (Plain Paper)
  'bg-[#FDFCF8] border border-black/10 shadow-sm',
];

export const BackgroundEffects = React.memo(() => {
  // 먼지 및 섬유 파티클 생성
  const dustParticles = useMemo(() => {
    return Array.from({ length: DUST_COUNT }).map((_, i) => {
      const isFiber = Math.random() > 0.7; // 30% 확률로 섬유(길쭉한 모양)
      return {
        id: `dust-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: isFiber ? Math.random() * 6 + 4 : Math.random() * 2 + 1.5, // 섬유는 길고, 먼지는 둥긂
        height: isFiber ? Math.random() * 1.5 + 0.5 : Math.random() * 2 + 1.5,
        rotate: Math.random() * 360,
        opacity: Math.random() * 0.4 + 0.2, // 0.2 ~ 0.6 (명확하게 보이도록)
        duration: Math.random() * 25 + 15,
        delay: Math.random() * -40,
        xOffset: (Math.random() - 0.5) * 150,
        yOffset: (Math.random() - 0.5) * 150,
        color: Math.random() > 0.5 ? 'bg-zinc-600' : 'bg-zinc-500', // 진한 아연색으로 가시성 확보
        borderRadius: isFiber ? '2px' : '50%',
      };
    });
  }, []);

  // 흩날리는 기획서 조각 파티클 생성
  const paperFragments = useMemo(() => {
    return Array.from({ length: PAPER_COUNT }).map((_, i) => ({
      id: `paper-${i}`,
      styleClass: PAPER_STYLES[Math.floor(Math.random() * PAPER_STYLES.length)],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: Math.random() * 40 + 30, // 30px ~ 70px
      height: Math.random() * 60 + 40, // 40px ~ 100px
      rotate: Math.random() * 360,
      opacity: Math.random() * 0.25 + 0.15, // 0.15 ~ 0.4 (은은하면서도 형태가 보이게)
      duration: Math.random() * 40 + 30, // 30s ~ 70s
      delay: Math.random() * -60,
      xOffset: (Math.random() - 0.5) * 200,
      yOffset: (Math.random() - 0.5) * 300,
      rotationDir: Math.random() > 0.5 ? 1 : -1,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden print:hidden">
      {/* 1. Dust & Fiber Layer (mix-blend 없이 직접 가시성 확보) */}
      <div className="absolute inset-0">
        {dustParticles.map((dust) => (
          <motion.div
            key={dust.id}
            className={`absolute ${dust.color}`}
            style={{
              left: dust.left,
              top: dust.top,
              width: dust.width,
              height: dust.height,
              opacity: dust.opacity,
              borderRadius: dust.borderRadius,
            }}
            animate={{
              x: [0, dust.xOffset, 0],
              y: [0, dust.yOffset, 0],
              rotate: [dust.rotate, dust.rotate + 90], // 먼지도 살짝 회전
              opacity: [dust.opacity, dust.opacity * 1.5, dust.opacity],
            }}
            transition={{
              duration: dust.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: dust.delay,
            }}
          />
        ))}
      </div>

      {/* 2. Paper Fragments Layer */}
      <div className="absolute inset-0">
        {paperFragments.map((paper) => (
          <motion.div
            key={paper.id}
            className={`absolute rounded-sm ${paper.styleClass}`}
            style={{
              left: paper.left,
              top: paper.top,
              width: paper.width,
              height: paper.height,
              opacity: paper.opacity,
            }}
            animate={{
              x: [0, paper.xOffset, 0],
              y: [0, paper.yOffset, 0],
              rotate: [paper.rotate, paper.rotate + (90 * paper.rotationDir)],
            }}
            transition={{
              duration: paper.duration,
              repeat: Infinity,
              ease: "linear",
              delay: paper.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
});
