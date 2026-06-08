import React from 'react';
import { GraduationCap, Award, Plus } from 'lucide-react';
import { EditableText } from './EditableText';
import { AddRowButton, DelButton } from './editKit';
import type { ResumeData } from '../types';

interface ResumeEducationProps {
  data: ResumeData;
  setData: (d: ResumeData) => void;
  isEditing: boolean;
}

export const ResumeEducation = ({ data, setData, isEditing }: ResumeEducationProps) => {
  const edu = data.education || [];
  const certs = data.certificates || [];

  /* 학력 */
  const setEdu = (e: any[]) => setData({ ...data, education: e });
  const updEdu = (i: number, patch: any) => setEdu(edu.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const delEdu = (i: number) => setEdu(edu.filter((_, idx) => idx !== i));
  const addEdu = () => setEdu([...edu, { title: '학교/과정명', period: '연도 - 연도', description: '설명', details: [] }]);
  const updDetail = (i: number, d: number, v: string) => updEdu(i, { details: edu[i].details.map((x: string, k: number) => (k === d ? v : x)) });
  const addDetail = (i: number) => updEdu(i, { details: [...(edu[i].details || []), '세부 내용'] });
  const delDetail = (i: number, d: number) => updEdu(i, { details: edu[i].details.filter((_: any, k: number) => k !== d) });

  /* 자격증 */
  const setCerts = (c: any[]) => setData({ ...data, certificates: c });
  const updCert = (i: number, patch: any) => setCerts(certs.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const delCert = (i: number) => setCerts(certs.filter((_, idx) => idx !== i));
  const addCert = () => setCerts([...certs, { name: '자격증/어학명', score: '', date: '연도' }]);

  return (
    <div className="flex flex-col gap-12">
      {/* Education */}
      <section>
        <h3 className="text-[17px] font-bold mb-6 flex items-center gap-3 text-[#1A1A1A]">
          <GraduationCap className="text-[#0047BB] w-5 h-5" /> 학력 및 교육
        </h3>
        <div className="space-y-8">
          {edu.map((e, idx) => (
            <div key={idx} className="relative pl-6 border-l-2 border-[#0047BB]/20">
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-none bg-[#0047BB]/40"></div>
              <div className="flex flex-col gap-1.5 mb-3">
                <div className="flex items-start gap-2">
                  <h4 className="font-bold text-[16px] text-[#1A1A1A] leading-snug flex-1 min-w-0">
                    <EditableText value={e.title} onSave={(v) => updEdu(idx, { title: v })} isEditing={isEditing} />
                  </h4>
                  {isEditing && <DelButton onClick={() => delEdu(idx)} title="이 학력 삭제" />}
                </div>
                <span className="text-[11px] font-mono font-bold text-zinc-400">
                  <EditableText value={e.period} onSave={(v) => updEdu(idx, { period: v })} isEditing={isEditing} />
                </span>
              </div>
              <div className="text-[12px] text-zinc-600 leading-relaxed mb-3 font-medium">
                <EditableText value={e.description} onSave={(v) => updEdu(idx, { description: v })} isEditing={isEditing} markdown={true} />
              </div>
              {isEditing ? (
                <div className="space-y-2">
                  {(e.details || []).map((detail: string, dIdx: number) => (
                    <div key={dIdx} className="flex items-center gap-2">
                      <EditableText value={detail} onSave={(v) => updDetail(idx, dIdx, v)} isEditing={true} className="text-[12px]" />
                      <DelButton onClick={() => delDetail(idx, dIdx)} title="항목 삭제" />
                    </div>
                  ))}
                  <button type="button" onClick={() => addDetail(idx)} className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0047BB] hover:underline">
                    <Plus className="w-3 h-3" /> 세부 항목 추가
                  </button>
                </div>
              ) : (
                <ul className="text-[11px] text-zinc-500 space-y-1.5 list-none">
                  {(e.details || []).map((detail: string, dIdx: number) => (
                    <li key={dIdx} className="relative pl-3"><span className="absolute left-0 top-1.5 w-1 h-1 bg-zinc-300 rounded-full"></span>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {isEditing && <AddRowButton onClick={addEdu} label="학력/교육 추가" />}
        </div>
      </section>

      {/* Certificates */}
      <section>
        <h3 className="text-[17px] font-bold mb-5 flex items-center gap-3 text-[#1A1A1A]">
          <Award className="text-[#0047BB] w-5 h-5" /> 자격증
        </h3>
        <div className="flex flex-col gap-1">
          {certs.map((cert, idx) => (
            <div key={idx} className="py-3.5 border-b border-zinc-100 last:border-0">
              <div className="flex items-start gap-2 mb-2">
                <span className="font-semibold text-[14px] text-[#1A1A1A] leading-snug flex-1 min-w-0">
                  <EditableText value={cert.name} onSave={(v) => updCert(idx, { name: v })} isEditing={isEditing} />
                </span>
                {isEditing && <DelButton onClick={() => delCert(idx)} title="이 자격증 삭제" />}
              </div>
              {isEditing ? (
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-zinc-400 uppercase tracking-widest">점수</span>
                    <input value={cert.score || ''} onChange={(e) => updCert(idx, { score: e.target.value })} placeholder="(선택)"
                      className="w-20 border border-zinc-300 rounded px-2 py-0.5 text-[12px] bg-white text-[#1A1A1A] focus:border-[#0047BB] focus:outline-none" />
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-zinc-400 uppercase tracking-widest">취득</span>
                    <input value={cert.date || ''} onChange={(e) => updCert(idx, { date: e.target.value })} placeholder="연도"
                      className="w-20 border border-zinc-300 rounded px-2 py-0.5 text-[12px] bg-white text-[#1A1A1A] focus:border-[#0047BB] focus:outline-none" />
                  </label>
                </div>
              ) : (
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
              )}
            </div>
          ))}
          {isEditing && <div className="mt-3"><AddRowButton onClick={addCert} label="자격증/어학 추가" /></div>}
        </div>
      </section>
    </div>
  );
};
