import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { EditableText } from './EditableText';
import { HandwrittenTOC } from './HandwrittenTOC';

interface HeroProps {
  onPortfolioClick: () => void;
  onResumeClick: () => void;
  isEditing: boolean;
  content: any;
  setContent: (c: any) => void;
  aboutContent: any;
  setAboutContent: (c: any) => void;
}

export const Hero = ({ onPortfolioClick, onResumeClick, isEditing, content, setContent }: HeroProps) => (
  <section id="hero" className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 py-[120px] overflow-hidden bg-transparent border-b border-black/10">
    
    {/* Subtle dot grid background */}
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,71,187,0.04)_1px,transparent_1px)] bg-size-[40px_40px]" />
    
    {/* Top accent line */}
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-[#0047BB]/30 to-transparent" />

    <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 mt-12">
      
      {/* LEFT: Text content */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' as const }}
        className="w-full lg:w-[50%] flex flex-col items-start text-left"
      >
        {/* Eyebrow label */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-[#0047BB] text-[11px] font-black tracking-[0.25em] uppercase mb-6 block"
        >
          Game Designer Portfolio
        </motion.span>

        <h1 className="mb-8 flex flex-col items-start gap-3">
          <div className="text-2xl md:text-3xl lg:text-4xl font-display font-medium text-zinc-500 tracking-tight">
            <EditableText value={content.titleLine1 || "기획의도를 알고"} onSave={(v) => setContent({...content, titleLine1: v})} isEditing={isEditing} />
          </div>
          <div className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-bold text-[#1A2332] tracking-[-0.04em] leading-[1.05] break-keep">
            <EditableText value={content.titleLine2 || "목차를 쓸줄 아는 기획자"} onSave={(v) => setContent({...content, titleLine2: v})} isEditing={isEditing} />
          </div>
        </h1>

        <p className="text-zinc-500 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-xl">
          <EditableText value={content.description} onSave={(v) => setContent({...content, description: v})} isEditing={isEditing} multiline />
        </p>
        
        <div className="flex flex-col sm:flex-row justify-start items-center gap-4 w-full sm:w-auto">
          <motion.button
            whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
            onClick={onResumeClick}
            className="px-10 py-5 bg-[#0047BB] text-white font-bold flex items-center justify-center gap-3 hover:bg-[#003399] transition-all duration-500 text-sm tracking-widest w-full sm:w-auto rounded-full uppercase shadow-lg shadow-[#0047BB]/20 hover:shadow-xl"
          >
            이력서 보기 <ChevronRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
            onClick={onPortfolioClick}
            className="px-10 py-5 bg-white border border-zinc-200 text-zinc-600 font-bold hover:border-[#0047BB]/30 hover:text-[#1A2332] hover:bg-[#0047BB]/5 transition-all duration-500 flex items-center justify-center gap-3 text-sm tracking-widest w-full sm:w-auto rounded-full uppercase shadow-sm hover:shadow-md"
          >
            포트폴리오 보기 <ArrowUpRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* RIGHT: Handwritten TOC animation */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' as const }}
        className="hidden lg:flex w-full lg:w-[50%] h-[480px] items-center justify-center"
      >
        <HandwrittenTOC />
      </motion.div>
    </div>

    {/* Scroll indicator */}
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Scroll to explore</span>
      <div className="w-px h-16 bg-zinc-200 relative overflow-hidden">
        <motion.div animate={{ y: [-64, 64] }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' as const }} className="absolute top-0 left-0 w-full h-1/2 bg-[#0047BB]" />
      </div>
    </motion.div>
  </section>
);
