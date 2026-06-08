import React from 'react';
import { Briefcase } from 'lucide-react';
import { EditableText } from './EditableText';
import type { ResumeData } from '../types';

interface ResumeExperienceProps {
  data: ResumeData;
  setData: (d: ResumeData) => void;
  isEditing: boolean;
}

export const ResumeExperience = ({ data, setData, isEditing }: ResumeExperienceProps) => {
  return (
    <section>
      <h3 className="text-[19px] font-bold mb-8 flex items-center gap-3 text-[#1A1A1A]">
        <Briefcase className="text-[#0047BB] w-6 h-6" /> 프로젝트 경험
      </h3>
      <div className="space-y-12">
        {data.experience.map((exp, idx) => (
          <div key={idx} className="relative pl-10 border-l-[3px] border-[#0047BB]/10">
            <div className="absolute -left-[10px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-[#0047BB] shadow-sm"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <h4 className="font-bold text-[22px] text-[#1A1A1A] tracking-tight">
                <EditableText value={exp.title} onSave={(v) => { const e = [...data.experience]; e[idx].title = v; setData({...data, experience: e}); }} isEditing={isEditing} />
              </h4>
              <span className="text-[10px] font-mono font-black text-zinc-400 bg-zinc-50 px-3 py-1 rounded-sm border border-zinc-100">
                <EditableText value={exp.period} onSave={(v) => { const e = [...data.experience]; e[idx].period = v; setData({...data, experience: e}); }} isEditing={isEditing} />
              </span>
            </div>

            <div className="text-[14px] text-[#0047BB] font-bold mb-3 bg-[#0047BB]/5 inline-block px-4 py-2 rounded-sm border-l-4 border-[#0047BB]">
              <EditableText value={exp.description} onSave={(v) => { const e = [...data.experience]; e[idx].description = v; setData({...data, experience: e}); }} isEditing={isEditing} markdown={true} />
            </div>
            {exp.teamSize && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold text-white bg-zinc-500 uppercase tracking-widest px-2 py-0.5 rounded-sm">팀 구성</span>
                <span className="text-[12px] font-bold text-[#1A1A1A] bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-sm">{exp.teamSize}</span>
              </div>
            )}

            <ul className="text-[14px] text-[#4A4A4A] space-y-3 list-none leading-relaxed font-medium">
              {exp.details.map((detail, dIdx) => (
                <li key={dIdx} className="relative pl-6">
                  <span className="absolute left-0 top-2 w-1.5 h-1.5 border border-[#0047BB] rounded-full"></span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
