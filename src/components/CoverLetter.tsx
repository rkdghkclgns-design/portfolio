import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { EditableText } from './EditableText';
import type { ResumeData } from '../types';

interface CoverLetterProps {
  setView: (v: any) => void;
  isEditing: boolean;
  data: ResumeData;
  setData: (d: ResumeData) => void;
}

export const CoverLetter = ({ setView, isEditing, data, setData }: CoverLetterProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!data.selfIntroductions) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.id.replace('intro-', ''));
            setActiveIndex(index);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 }
    );

    data.selfIntroductions.forEach((_, idx) => {
      const el = document.getElementById(`intro-${idx}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [data.selfIntroductions]);

  return (
    <div className="w-full relative">

      {data.selfIntroductions ? (
        <div className="ml-[4%] xl:ml-[6%] w-full max-w-[1200px]">
        <div className="flex items-start gap-8 xl:gap-12">

          {/* 메인 타임라인 */}
          <div className="relative border-l-[3px] border-[#0047BB]/15 flex-1 min-w-0">
          {data.selfIntroductions.map((intro, idx) => (
            <React.Fragment key={idx}>
              <article className="relative w-full pl-8 md:pl-16 pb-[80px] md:pb-[120px] scroll-mt-24 md:scroll-mt-[140px]" id={`intro-${idx}`}>
                {isEditing && (
                  <button onClick={() => { if (confirm("삭제하시겠습니까?")) { const n = [...(data.selfIntroductions || [])]; n.splice(idx, 1); setData({...data, selfIntroductions: n}); }}}
                    className="absolute -top-4 right-0 z-20 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg" title="삭제">
                    <X className="w-4 h-4" />
                  </button>
                )}

                <div className="absolute -left-[19px] md:-left-[24px] top-[50px] md:top-[68px] lg:top-[72px] w-9 h-9 md:w-11 md:h-11 bg-white border-[3px] border-[#0047BB]/30 rounded-full flex items-center justify-center text-[#0047BB] font-mono font-bold text-xs md:text-sm shadow-md ring-4 ring-white">
                  {String(idx + 1).padStart(2, '0')}
                </div>

                {/* 배경 카드 */}
                <motion.div 
                  initial={{ opacity: 0, y: 60 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true, margin: "-50px" }} 
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white rounded-3xl border border-zinc-100 shadow-[0_8px_40px_-12px_rgba(0,71,187,0.08)] px-8 md:px-10 lg:px-12 pt-10 md:pt-14 pb-12 md:pb-16 mt-2"
                >

                  <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-6 md:mb-8"
                  >
                    <h3 className="text-[30px] md:text-[40px] lg:text-[44px] xl:text-[46px] font-display font-black text-[#1A1A1A] leading-[1.3] tracking-tighter break-keep [&_p]:m-0 [&_p]:leading-[1.3] [&_strong]:text-[#0047BB] [&_strong]:font-black text-opacity-90">
                      <EditableText value={intro.logline} onSave={(v) => { const n = [...(data.selfIntroductions || [])]; n[idx].logline = v; setData({...data, selfIntroductions: n}); }} isEditing={isEditing} markdown={true} />
                    </h3>
                    {/* Ruled line — 에디토리얼 잡지 스타일 */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: 'left' }}
                      className="mt-5 h-px bg-linear-to-r from-[#0047BB]/30 via-[#0047BB]/10 to-transparent"
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-[780px] text-[#1C1C1C] leading-[1.9] text-[16.5px] md:text-[18px] font-medium tracking-[-0.01em] [&_p]:mb-5 md:[&_p]:mb-7 [&_p]:break-keep [&_strong]:text-[#0047BB] [&_strong]:font-extrabold [&_strong]:bg-[linear-gradient(to_top,rgba(0,71,187,0.22)_50%,transparent_50%)] [&_strong]:px-[3px] [&_strong]:rounded-sm"
                  >
                    {/* Hook */}
                    {isEditing && <div className="text-xs text-blue-500 font-bold mb-1">도입부 (Hook)</div>}
                    <EditableText value={intro.hook} onSave={(v) => { const n = [...(data.selfIntroductions || [])]; n[idx].hook = v; setData({...data, selfIntroductions: n}); }} isEditing={isEditing} markdown={true} />

                    {/* PullQuote */}
                    {(intro.pullQuote || isEditing) && (
                      <div className="my-10 md:my-12">
                        {isEditing && <div className="text-xs text-blue-500 font-bold mb-1">인용구 (PullQuote)</div>}
                        <blockquote className="border-l-[3px] border-[#0047BB]/30 bg-[#F8F9FF]/50 py-5 md:py-6 px-6 md:px-8 font-bold text-[24px] md:text-[27px] leading-[1.6] text-[#333F48] rounded-r-xl tracking-tight">
                          <EditableText value={intro.pullQuote || ""} onSave={(v) => { const n = [...(data.selfIntroductions || [])]; n[idx].pullQuote = v; setData({...data, selfIntroductions: n}); }} isEditing={isEditing} markdown={false} />
                        </blockquote>
                      </div>
                    )}

                    {/* Highlights */}
                    {(intro.highlights || isEditing) && (
                      <div className="my-10 md:my-12">
                        {isEditing && <div className="text-xs text-blue-500 font-bold mb-2">핵심 강조 수치 (Highlights) - 삭제는 빈칸으로 저장하세요</div>}
                        <ul className="grid md:grid-cols-4 gap-3 md:gap-4 pl-0">
                          {(intro.highlights || Array(4).fill({ bold: "", em: "" })).map((hl, hlIdx) => (
                            <li key={hlIdx} className="list-none relative px-4 md:px-5 py-5 md:py-6 bg-[#F8F9FF] border border-[#0047BB]/15 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,71,187,0.08)] break-normal md:[&:not(:last-child)]::after:content-[''] md:[&:not(:last-child)]::after:absolute md:[&:not(:last-child)]::after:-right-[14px] md:[&:not(:last-child)]::after:top-1/2 md:[&:not(:last-child)]::after:-translate-y-1/2 md:[&:not(:last-child)]::after:border-t-[2.5px] md:[&:not(:last-child)]::after:border-r-[2.5px] md:[&:not(:last-child)]::after:border-[#0047BB]/40 md:[&:not(:last-child)]::after:w-[10px] md:[&:not(:last-child)]::after:h-[10px] md:[&:not(:last-child)]::after:rotate-45">
                              <strong className="text-[#0047BB] font-black text-[15px] md:text-[18px] block mb-2 px-0 bg-none!">
                                <EditableText value={hl.bold} onSave={(v) => { const n = [...(data.selfIntroductions || [])]; if(!n[idx].highlights) n[idx].highlights = Array(4).fill({bold:"", em:""}); n[idx].highlights![hlIdx] = { ...n[idx].highlights![hlIdx], bold: v }; setData({...data, selfIntroductions: n}); }} isEditing={isEditing} markdown={false} />
                              </strong>
                              <em className="not-italic text-[13px] md:text-[14px] text-[#555F6B] leading-normal block mt-2 break-keep">
                                <EditableText value={hl.em} onSave={(v) => { const n = [...(data.selfIntroductions || [])]; if(!n[idx].highlights) n[idx].highlights = Array(4).fill({bold:"", em:""}); n[idx].highlights![hlIdx] = { ...n[idx].highlights![hlIdx], em: v }; setData({...data, selfIntroductions: n}); }} isEditing={isEditing} markdown={false} />
                              </em>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Body */}
                    {isEditing && <div className="text-xs text-blue-500 font-bold mb-1">본문 (Body)</div>}
                    <EditableText value={intro.body} onSave={(v) => { const n = [...(data.selfIntroductions || [])]; n[idx].body = v; setData({...data, selfIntroductions: n}); }} isEditing={isEditing} markdown={true} />

                    {/* Closing */}
                    {isEditing ? (
                      <>
                        <div className="text-xs text-blue-500 font-bold mb-1 mt-6">마무리 (Closing)</div>
                        <EditableText value={intro.closing || ""} onSave={(v) => { const n = [...(data.selfIntroductions || [])]; n[idx].closing = v; setData({...data, selfIntroductions: n}); }} isEditing={isEditing} markdown={true} />
                      </>
                    ) : (
                      intro.closing && (
                        <div className="mt-8">
                          <EditableText value={intro.closing || ""} onSave={(v) => {}} isEditing={isEditing} markdown={true} />
                        </div>
                      )
                    )}
                  </motion.div>

                </motion.div>

                {/* 섹션 사이 희미한 구분선 (마지막 항목 제외) */}
                {idx < (data.selfIntroductions || []).length - 1 && (
                  <div className="absolute bottom-10 left-8 md:left-16 right-0 h-px bg-linear-to-r from-[#0047BB]/10 via-[#0047BB]/5 to-transparent" />
                )}
              </article>



            </React.Fragment>
          ))}

          {isEditing && (
            <button onClick={() => { const n = [...(data.selfIntroductions || [])]; n.push({ navTitle: "새 항목", logline: "새로운 항목의 로그라인을 입력하세요.", hook: "도입부를 입력하세요.", body: "본문을 입력하세요." }); setData({...data, selfIntroductions: n}); }}
              className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-colors min-h-[200px] cursor-pointer rounded-3xl w-full">
              <Plus className="w-8 h-8 text-zinc-400 mb-2" />
              <span className="text-zinc-500 font-bold">새 자기소개 항목 추가</span>
            </button>
          )}
          </div>

          {/* INDEX 사이드바 */}
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hidden xl:block sticky top-40 w-44 shrink-0"
          >
            <div className="flex flex-col gap-6 border-l-2 border-[#0047BB]/10 pl-6 py-2">
              <div className="text-xs font-black tracking-[0.2em] text-[#0047BB]/60 mb-2">INDEX</div>
              {data.selfIntroductions.map((intro, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <a 
                    key={idx} 
                    href={`#intro-${idx}`} 
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(`intro-${idx}`)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`text-[14px] font-medium transition-colors relative group block ${isActive ? 'text-[#0047BB]' : 'text-zinc-400 hover:text-[#0047BB]'}`}
                  >
                    <span className={`absolute -left-[29px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#0047BB] transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}/>
                    {String(idx + 1).padStart(2, '0')}. {intro.navTitle || '섹션 ' + (idx + 1)}
                  </a>
                );
              })}
            </div>
          </motion.aside>

        </div>
        </div>
      ) : (
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-black/5 markdown-body">
          {isEditing ? (
            <textarea className="w-full h-[400px] bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-6 text-[#e8e4dc] font-sans text-sm focus:outline-none focus:border-[#0047BB]"
              value={data.selfIntroduction || ''} onChange={(e) => setData({...data, selfIntroduction: e.target.value})} />
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.selfIntroduction || ''}</ReactMarkdown>
          )}
        </div>
      )}
    </div>
  );
};
