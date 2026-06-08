import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { EditableText } from './EditableText';
import { AddRowButton, DelButton } from './editKit';
import type { ResumeData } from '../types';

interface ResumeExperienceProps {
  data: ResumeData;
  setData: (d: ResumeData) => void;
  isEditing: boolean;
}

export const ResumeExperience = ({ data, setData, isEditing }: ResumeExperienceProps) => {
  const exp = data.experience || [];
  const setExp = (e: any[]) => setData({ ...data, experience: e });
  const upd = (i: number, patch: any) => setExp(exp.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const del = (i: number) => setExp(exp.filter((_, idx) => idx !== i));
  const add = () => setExp([...exp, { title: '프로젝트/회사명', period: '연도 - 연도', description: '역할 / 한 줄 요약', teamSize: '', details: [] }]);
  const updDetail = (i: number, d: number, v: string) => upd(i, { details: exp[i].details.map((x: string, k: number) => (k === d ? v : x)) });
  const addDetail = (i: number) => upd(i, { details: [...(exp[i].details || []), '담당 업무'] });
  const delDetail = (i: number, d: number) => upd(i, { details: exp[i].details.filter((_: any, k: number) => k !== d) });

  return (
    <section>
      <h3 className="text-[19px] font-bold mb-8 flex items-center gap-3 text-[#1A1A1A]">
        <Briefcase className="text-[#0047BB] w-6 h-6" /> 프로젝트 경험
      </h3>
      <div className="space-y-12">
        {exp.map((e, idx) => (
          <div key={idx} className="relative pl-10 border-l-[3px] border-[#0047BB]/10">
            <div className="absolute -left-[10px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-[#0047BB] shadow-sm"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <h4 className="font-bold text-[22px] text-[#1A1A1A] tracking-tight flex items-center gap-2 flex-1 min-w-0">
                <span className="flex-1 min-w-0"><EditableText value={e.title} onSave={(v) => upd(idx, { title: v })} isEditing={isEditing} /></span>
                {isEditing && <DelButton onClick={() => del(idx)} title="이 경험 삭제" />}
              </h4>
              <span className="text-[10px] font-mono font-black text-zinc-400 bg-zinc-50 px-3 py-1 rounded-sm border border-zinc-100 shrink-0">
                <EditableText value={e.period} onSave={(v) => upd(idx, { period: v })} isEditing={isEditing} />
              </span>
            </div>

            <div className="text-[14px] text-[#0047BB] font-bold mb-3 bg-[#0047BB]/5 inline-block px-4 py-2 rounded-sm border-l-4 border-[#0047BB]">
              <EditableText value={e.description} onSave={(v) => upd(idx, { description: v })} isEditing={isEditing} markdown={true} />
            </div>

            {(isEditing || e.teamSize) && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold text-white bg-zinc-500 uppercase tracking-widest px-2 py-0.5 rounded-sm">팀 구성</span>
                {isEditing ? (
                  <input value={e.teamSize || ''} onChange={(ev) => upd(idx, { teamSize: ev.target.value })} placeholder="예) 기획 4명 / 개발 3명"
                    className="text-[12px] font-bold text-[#1A1A1A] bg-white border border-zinc-300 px-3 py-1 rounded-sm focus:border-[#0047BB] focus:outline-none w-64 max-w-full" />
                ) : (
                  <span className="text-[12px] font-bold text-[#1A1A1A] bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-sm">{e.teamSize}</span>
                )}
              </div>
            )}

            {isEditing ? (
              <div className="space-y-2">
                {(e.details || []).map((detail: string, dIdx: number) => (
                  <div key={dIdx} className="flex items-center gap-2">
                    <EditableText value={detail} onSave={(v) => updDetail(idx, dIdx, v)} isEditing={true} className="text-[13px]" />
                    <DelButton onClick={() => delDetail(idx, dIdx)} title="항목 삭제" />
                  </div>
                ))}
                <button type="button" onClick={() => addDetail(idx)} className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0047BB] hover:underline">
                  <Plus className="w-3.5 h-3.5" /> 담당 업무 추가
                </button>
              </div>
            ) : (
              <ul className="text-[14px] text-[#4A4A4A] space-y-3 list-none leading-relaxed font-medium">
                {(e.details || []).map((detail: string, dIdx: number) => (
                  <li key={dIdx} className="relative pl-6">
                    <span className="absolute left-0 top-2 w-1.5 h-1.5 border border-[#0047BB] rounded-full"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {isEditing && <AddRowButton onClick={add} label="프로젝트/경험 추가" />}
      </div>
    </section>
  );
};
