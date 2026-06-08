import React from 'react';
import { motion } from 'motion/react';
import { EditableText } from './EditableText';

interface AboutProps {
  isEditing: boolean;
  content: any;
  setContent: (c: any) => void;
}

export const About = ({ isEditing, content, setContent }: AboutProps) => (
  <section
    id="about"
    className="pt-[100px] lg:pt-[130px] pb-24 lg:pb-32 px-6 md:px-12 relative flex flex-col justify-start bg-transparent overflow-hidden"
  >
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.025)_1px,transparent_1px)] bg-size-[28px_28px]" />
    <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#0047BB]/20 to-transparent" />

    <div className="max-w-7xl mx-auto w-full relative z-10">

      {/* ── SECTION HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-black/5 pb-8">
        <div>
          <span className="text-[#0047BB] font-sans text-[11px] font-bold tracking-widest uppercase mb-3 block">01. 소개</span>
          <h2 className="flex flex-col gap-1 items-start mt-2">
            <span className="text-2xl md:text-3xl text-zinc-500 font-display font-medium tracking-tight">논리와 감성으로,</span>
            <span className="flex items-baseline gap-2 leading-none mt-1">
              <span className="text-[72px] md:text-[90px] lg:text-[110px] font-display font-black tracking-tighter text-zinc-400 leading-none">0</span>
              <span className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-zinc-500">에서</span>
              <span className="text-[82px] md:text-[100px] lg:text-[124px] font-display font-black tracking-tighter text-[#0047BB] leading-none drop-shadow-[0_0_32px_rgba(0,71,187,0.22)]">+</span>
              <span className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-zinc-500">로</span>
            </span>
          </h2>
        </div>
        <p className="text-zinc-400 text-sm leading-[1.8] md:text-right font-medium max-w-[240px]">
          프로젝트의 뼈대를 세우고<br />재미의 본질을 설계하는 핵심 철학입니다.
        </p>
      </div>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
        
        {/* Left: Story & Promise */}
        <div className="flex flex-col gap-10 lg:gap-14 justify-center">
          
          {/* P1: Core Philosophy (Polished Typography) */}
          <div className="flex flex-col gap-5">
            {/* Sentence 1 & 2: Contrast (Law vs Game) */}
            <div className="text-[20px] md:text-[24px] lg:text-[28px] font-semibold leading-[1.6] tracking-tight flex flex-col gap-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-zinc-400 break-keep"
              >
                문제를 해결하는 일이 <span className="font-black text-zinc-500">'-'</span>에서 <span className="font-black text-zinc-500">'0'</span>으로 되돌리는 일이었다면,
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[#1A1A1A] break-keep"
              >
                게임은 누군가의 하루를 <br className="hidden lg:block"/>
                <span className="relative inline-block mt-1 md:mt-0">
                  <span className="font-black text-[#0047BB]">'0'</span>에서 <span className="font-black text-[#0047BB] drop-shadow-[0_0_8px_rgba(0,71,187,0.3)]">'+'</span>가 되는 경험
                  <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }} className="absolute -bottom-1 left-0 right-0 h-1.5 md:h-2 bg-[#0047BB]/20 origin-left" />
                </span>으로 만드는 일입니다.
              </motion.div>
            </div>

            {/* Sentence 3: Explanation */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-[15px] md:text-[17px] text-zinc-500 leading-[1.8] font-medium break-keep border-l-2 border-black/10 pl-4 md:pl-5 mt-2"
            >
              탄탄한 시스템의 논리적 뼈대 위에서,<br />
              유저의 마음에 즐거움이라는 <strong className="text-[#0047BB] font-black">감성을 채워넣는 것</strong> —<br />
              그것이 제가 생각하는 게임 기획의 본질입니다.
            </motion.div>
          </div>

          {/* P2: The Closing Promise */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3"
          >
            <div className="text-[18px] md:text-[22px] lg:text-[24px] leading-[1.6] font-bold text-[#1A1A1A] break-keep border-l-4 border-[#0047BB] pl-4 md:pl-6 py-1
              [&_p]:m-0 [&_strong]:text-[#0047BB]
            ">
              <EditableText
                value={content.p2} 
                onSave={(v) => setContent({ ...content, p2: v })}
                isEditing={isEditing}
                markdown
              />
            </div>
          </motion.div>
        </div>

        {/* Right: Bento Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="sm:col-span-2 bg-white rounded-[32px] p-8 md:p-10 border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#0047BB]/5 rounded-full blur-2xl group-hover:bg-[#0047BB]/10 transition-colors"></div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-full bg-[#0047BB]/10 flex items-center justify-center shrink-0 group-hover:bg-[#0047BB] group-hover:scale-110 transition-all duration-500">
                <span className="text-[#0047BB] font-black text-3xl group-hover:text-white transition-colors duration-500">+</span>
              </div>
              <div>
                <p className="text-[12px] font-black tracking-widest text-[#0047BB]/60 uppercase mb-2">재미 설계</p>
                <p className="text-[18px] md:text-[20px] font-bold text-[#1A1A1A] leading-snug tracking-tight">0에서 플러스가 되는<br/>경험을 설계합니다</p>
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#0047BB] rounded-[32px] p-8 md:p-10 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-end min-h-[220px] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8">
              <span className="text-[64px] font-black leading-none opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 block origin-top-right">3</span>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <span className="text-[32px] font-black leading-none block">3<span className="text-xl opacity-70">건+</span></span>
              <div className="mt-8">
                <p className="text-[10px] font-black tracking-widest text-white/60 uppercase mb-2">프로젝트 이력</p>
                <p className="text-[15px] font-bold leading-snug h-[44px] flex items-end">출시 경험 2회</p>
              </div>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-zinc-900 rounded-[32px] p-8 md:p-10 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-end min-h-[220px] group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8">
              <span className="text-[64px] font-black leading-none opacity-5 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 block origin-top-right text-[#0047BB]">A</span>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <span className="text-[32px] font-black leading-none block group-hover:text-[#0047BB] transition-colors duration-500">A - Z</span>
              <div className="mt-8">
                <p className="text-[10px] font-black tracking-widest text-white/50 uppercase mb-2">전체 기획</p>
                <p className="text-[15px] font-bold leading-snug text-zinc-300 h-[44px] flex items-end">아이디어 발굴부터<br/>출시 전략까지</p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

    </div>
  </section>
);
