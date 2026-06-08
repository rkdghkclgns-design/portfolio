import React from 'react';
import { motion } from 'motion/react';
import type { Skill, SkillCapability } from '../types';

interface SkillsProps {
  isEditing: boolean;
  skills: Skill[];
  setSkills: (s: Skill[]) => void;
}

/* ── Animated connector line ── */
const TreeLine = ({ height = 28, delay = 0, glow = false }: { height?: number; delay?: number; glow?: boolean }) => (
  <motion.div
    initial={{ scaleY: 0 }}
    whileInView={{ scaleY: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    className="origin-top flex flex-col items-center"
    style={{ height }}
  >
    <div className={`w-px h-full ${glow ? 'bg-linear-to-b from-[#0047BB]/40 via-[#0047BB]/20 to-[#0047BB]/5' : 'bg-linear-to-b from-zinc-300/60 to-zinc-200/40'}`} />
  </motion.div>
);

/* ── Single tree node ── */
const TreeNode = ({ cap, delay = 0 }: { cap: SkillCapability; delay?: number }) => {
  const t = cap.tier;
  const isTier1 = t === 1;
  const isTier2 = t === 2;
  const isTier3 = t === 3;

  // Different visual for each tier
  const nodeClasses = isTier1
    ? 'bg-[#0047BB] text-white shadow-[0_4px_24px_-4px_rgba(0,71,187,0.4)] px-6 py-3.5 w-[90%]'
    : isTier2
    ? 'bg-[#0047BB]/10 text-[#0047BB] border border-[#0047BB]/15 px-5 py-3 w-[82%]'
    : isTier3
    ? 'bg-[#0047BB]/5 text-[#2C2C2C] border border-[#0047BB]/10 px-5 py-2.5 w-[74%]'
    : 'bg-zinc-50 text-zinc-600 border border-zinc-200/80 px-4 py-2 w-[78%]';

  const dotClasses = isTier1
    ? 'w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]'
    : isTier2
    ? 'w-2 h-2 bg-[#0047BB]/60 rounded-full'
    : isTier3
    ? 'w-1.5 h-1.5 bg-[#0047BB]/30 rounded-full'
    : 'w-1.5 h-1.5 bg-zinc-400 rounded-full';

  const textClasses = isTier1
    ? 'text-[15px] font-black tracking-tight'
    : isTier2
    ? 'text-[14px] font-bold'
    : isTier3
    ? 'text-[13px] font-semibold'
    : 'text-[12px] font-medium';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-xl flex items-center gap-3 mx-auto hover:scale-[1.03] transition-transform duration-300 cursor-default ${nodeClasses}`}
    >
      {/* Dot indicator */}
      <span className={`shrink-0 ${dotClasses}`} />
      <span className={textClasses}>{cap.name}</span>

      {/* Glow ring on tier 1 */}
      {isTier1 && (
        <div className="absolute -inset-[2px] rounded-xl bg-[#0047BB]/20 blur-md -z-10 animate-pulse" />
      )}
    </motion.div>
  );
};

export const Skills = ({ skills }: SkillsProps) => {
  return (
    <section
      id="skills"
      className="py-24 lg:py-32 px-6 md:px-12 relative bg-transparent overflow-hidden"
    >
      {/* Subtle dot grid */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.025)_1px,transparent_1px)] bg-size-[28px_28px]" />

      <div className="max-w-7xl mx-auto w-full relative z-10">

        {/* ── HEADER ── */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[#0047BB] text-[11px] font-black tracking-[0.22em] uppercase block mb-3"
            >
              03. 핵심 역량
            </motion.span>
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-xl md:text-2xl text-zinc-400 font-medium block mb-1">논리와 구조를 AI로 확장하는</span>
              <h2 className="text-5xl md:text-6xl lg:text-[5rem] font-black text-[#2C2C2C] tracking-tighter leading-none">기획 역량</h2>
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-zinc-600 text-sm font-medium max-w-xs md:text-right leading-relaxed"
          >
            추상적인 수치가 아닌,<br className="hidden md:block" />실제 결과물로 증명하는 기획 역량입니다.
          </motion.p>
        </div>

        {/* ── SKILL TREE — 3 branches ── */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {skills.map((skill, branchIdx) => {
            // Separate tiered (hierarchical tree) vs non-tiered (leaf tags)
            const tieredCaps = skill.capabilities.filter(c => c.tier);
            const leafCaps = skill.capabilities.filter(c => !c.tier);
            const baseDelay = branchIdx * 0.15;

            return (
              <motion.div
                key={branchIdx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: baseDelay, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                {/* ── Branch Root Card ── */}
                <div className="w-full bg-white rounded-2xl border border-black/5 shadow-sm p-7 text-center group hover:shadow-lg hover:border-[#0047BB]/15 transition-all duration-400 mb-0">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0047BB]/8 flex items-center justify-center text-[#0047BB] group-hover:bg-[#0047BB] group-hover:text-white transition-all duration-300 mb-4">
                    {skill.icon}
                  </div>
                  <h3 className="text-2xl font-black text-[#2C2C2C] tracking-tight mb-1.5">{skill.name}</h3>
                  <p className="text-[13px] text-zinc-600 font-medium leading-snug break-keep">{skill.caption}</p>
                </div>

                {/* ── Connector into tree ── */}
                <TreeLine height={32} delay={baseDelay + 0.3} glow />

                {/* ── Tiered Nodes (hierarchical chain) ── */}
                {tieredCaps.map((cap, nodeIdx) => (
                  <React.Fragment key={nodeIdx}>
                    <TreeNode cap={cap} delay={baseDelay + 0.4 + nodeIdx * 0.12} />
                    {nodeIdx < tieredCaps.length - 1 && (
                      <TreeLine height={20} delay={baseDelay + 0.5 + nodeIdx * 0.12} glow />
                    )}
                  </React.Fragment>
                ))}

                {/* ── Unified Result Card ── */}
                <TreeLine height={24} delay={baseDelay + 0.7} />
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: baseDelay + 0.8 }}
                  className="w-full bg-white rounded-2xl border border-[#0047BB]/15 shadow-[0_8px_32px_-8px_rgba(0,71,187,0.1)] overflow-hidden flex flex-col group/result hover:border-[#0047BB]/30 hover:shadow-[0_12px_40px_-8px_rgba(0,71,187,0.15)] transition-all duration-400"
                >
                  {/* Top: Leaf Capabilities */}
                  {leafCaps.length > 0 && (
                    <div className="bg-linear-to-b from-[#0047BB]/[0.02] to-transparent px-4 pt-3 pb-4 border-b border-black/5">
                      <p className="text-[9px] font-black tracking-[0.18em] text-[#0047BB]/50 uppercase text-center mb-2">실무 적용 경험</p>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {leafCaps.map((cap, lIdx) => (
                          <span
                            key={lIdx}
                            className="px-2.5 py-1 bg-white text-zinc-600 text-[11px] font-bold rounded-md border border-zinc-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]"
                          >
                            {cap.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom: Evidence Metrics Dashboard */}
                  <div className="grid grid-cols-3 divide-x divide-black/5 bg-white relative">
                    {skill.evidences.map((ev, eIdx) => (
                      <div key={eIdx} className="px-1.5 py-4 text-center group/ev hover:bg-[#0047BB]/[0.02] transition-colors flex flex-col justify-center min-h-[76px]">
                        <span className="text-[#0047BB] font-black text-[16px] xl:text-[18px] font-mono leading-none block mb-1.5 group-hover/ev:scale-105 transition-transform duration-300">
                          {ev.value}
                        </span>
                        <span className="text-zinc-500 text-[10px] xl:text-[11px] font-bold leading-tight block break-keep">
                          {ev.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
