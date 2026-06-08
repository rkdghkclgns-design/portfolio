import React from 'react';
import { GraduationCap, Award } from 'lucide-react';
import { EditableText } from './EditableText';
import type { ResumeData } from '../types';

interface ResumeEducationProps {
  data: ResumeData;
  setData: (d: ResumeData) => void;
  isEditing: boolean;
}

export const ResumeEducation = ({ data, setData, isEditing }: ResumeEducationProps) => {
  return (
    <div className="flex flex-col gap-12">
      {/* Education */}
      <section>
        <h3 className="text-[17px] font-bold mb-6 flex items-center gap-3 text-[#1A1A1A]">
          <GraduationCap className="text-[#0047BB] w-5 h-5" /> 학력 및 교육
        </h3>
        <div className="space-y-8">
          {data.education.map((edu, idx) => (
            <div key={idx} className="relative pl-6 border-l-2 border-[#0047BB]/20">
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-none bg-[#0047BB]/40"></div>
              <div className="flex flex-col gap-1.5 mb-3">
                <h4 className="font-bold text-[16px] text-[#1A1A1A] leading-snug">
                  <EditableText value={edu.title} onSave={(v) => { const e = [...data.education]; e[idx].title = v; setData({...data, education: e}); }} isEditing={isEditing} />
                </h4>
                <span className="text-[11px] font-mono font-bold text-zinc-400">
                  <EditableText value={edu.period} onSave={(v) => { const e = [...data.education]; e[idx].period = v; setData({...data, education: e}); }} isEditing={isEditing} />
                </span>
              </div>
              <div className="text-[12px] text-zinc-600 leading-relaxed mb-3 font-medium">
                <EditableText value={edu.description} onSave={(v) => { const e = [...data.education]; e[idx].description = v; setData({...data, education: e}); }} isEditing={isEditing} markdown={true} />
              </div>
              <ul className="text-[11px] text-zinc-500 space-y-1.5 list-none">
                {edu.details.map((detail, dIdx) => <li key={dIdx} className="relative pl-3"><span className="absolute left-0 top-1.5 w-1 h-1 bg-zinc-300 rounded-full"></span>{detail}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Certificates */}
      <section>
        <h3 className="text-[17px] font-bold mb-5 flex items-center gap-3 text-[#1A1A1A]">
          <Award className="text-[#0047BB] w-5 h-5" /> 자격증
        </h3>
        <div className="flex flex-col">
          {data.certificates && data.certificates.map((cert, idx) => (
            <div key={idx} className="py-3.5 border-b border-zinc-100 last:border-0">
              <span className="font-semibold text-[14px] text-[#1A1A1A] leading-snug block mb-2">
                <EditableText value={cert.name} onSave={(v) => { const c = [...(data.certificates||[])]; c[idx].name = v; setData({...data, certificates: c}); }} isEditing={isEditing} />
              </span>
              <div className="flex items-center gap-4">
                {cert.score && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-medium">점수</span>
                    <span className="text-[12px] text-[#0047BB] tabular-nums">{cert.score}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-medium">취득</span>
                  <span className="text-[12px] text-zinc-500">{cert.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
