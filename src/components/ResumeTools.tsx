import React from 'react';
import { Wrench } from 'lucide-react';
import { BRAND_ICONS } from './icons/BrandIcons';
import type { ResumeData } from '../types';

interface ResumeToolsProps {
  data: ResumeData;
}

export const ResumeTools = ({ data }: ResumeToolsProps) => {
  if (!data.tools || data.tools.length === 0) return null;

  return (
    <section className="mt-10 pt-10 border-t border-zinc-100">
      <h3 className="text-[19px] font-bold mb-8 flex items-center gap-3 text-[#1A1A1A]">
        <Wrench className="text-[#0047BB] w-6 h-6" /> 기술 역량 및 도구
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {/* Group 1: Documentation & Office */}
        <div className="space-y-5">
          <h4 className="text-[10px] font-black text-[#0047BB] tracking-[0.4em] uppercase border-b border-[#0047BB]/10 pb-2 mb-3">DOCUMENTATION & OFFICE</h4>
          <div className="space-y-3">
            {data.tools.filter(t => ["Excel", "PowerPoint", "Word", "Notion"].includes(t.name)).map((tool, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="text-[#1A1A1A] shrink-0 pt-1 group">
                    {BRAND_ICONS[tool.name] || <Wrench className="w-8 h-8 text-zinc-400" />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px] font-bold text-[#1A1A1A]">{tool.name}</span>
                    <p className="text-[12px] text-zinc-500 font-medium leading-relaxed">{tool.description}</p>
                  </div>
                </div>
            ))}
          </div>
        </div>

        {/* Group 2: Creative & Engine & AI */}
        <div className="space-y-6">
          <h4 className="text-[10px] font-black text-[#0047BB] tracking-[0.4em] uppercase border-b border-[#0047BB]/10 pb-2 mb-4">CREATIVE & ENGINE</h4>
          <div className="space-y-4">
            {data.tools.filter(t => ["Figma", "Unity"].includes(t.name)).map((tool, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="text-[#1A1A1A] shrink-0 pt-1 group">
                    {BRAND_ICONS[tool.name] || <Wrench className="w-8 h-8 text-zinc-400" />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px] font-bold text-[#1A1A1A]">{tool.name}</span>
                    <p className="text-[12px] text-zinc-500 font-medium leading-relaxed">{tool.description}</p>
                  </div>
                </div>
            ))}

            {/* AI Assistants section */}
            <h4 className="text-[10px] font-black text-[#0047BB] tracking-[0.4em] uppercase border-b border-[#0047BB]/10 pb-2 mb-4 mt-8">AI ASSISTANTS</h4>
            <div className="space-y-4">
              {data.tools.filter(t => ["ChatGPT", "Claude", "Gemini", "Antigravity"].includes(t.name)).map((tool, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="text-[#1A1A1A] shrink-0 pt-1 group">
                    {BRAND_ICONS[tool.name] || <Wrench className="w-8 h-8 text-zinc-400" />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px] font-bold text-[#1A1A1A]">{tool.name}</span>
                    <p className="text-[12px] text-zinc-500 font-medium leading-relaxed">{tool.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
