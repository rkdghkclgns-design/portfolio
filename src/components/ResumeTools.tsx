import React from 'react';
import { Wrench } from 'lucide-react';
import { BRAND_ICONS } from './icons/BrandIcons';
import { EditableText } from './EditableText';
import { AddRowButton, DelButton } from './editKit';
import type { ResumeData } from '../types';

interface ResumeToolsProps {
  data: ResumeData;
  setData?: (d: ResumeData) => void;
  isEditing?: boolean;
}

export const ResumeTools = ({ data, setData, isEditing = false }: ResumeToolsProps) => {
  const tools = data.tools || [];
  if (tools.length === 0 && !isEditing) return null;

  const update = (i: number, patch: Partial<{ name: string; description: string }>) => {
    if (!setData) return;
    const t = tools.map((x, idx) => (idx === i ? { ...x, ...patch } : x));
    setData({ ...data, tools: t });
  };
  const del = (i: number) => setData && setData({ ...data, tools: tools.filter((_, idx) => idx !== i) });
  const add = () => setData && setData({ ...data, tools: [...tools, { name: '새 도구', description: '활용 설명을 입력하세요' }] });

  return (
    <section className="mt-10 pt-10 border-t border-zinc-100">
      <h3 className="text-[19px] font-bold mb-8 flex items-center gap-3 text-[#1A1A1A]">
        <Wrench className="text-[#0047BB] w-6 h-6" /> 기술 역량 및 도구
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        {tools.map((tool, idx) => (
          <div key={idx} className="flex items-start gap-4 group">
            <div className="text-[#1A1A1A] shrink-0 pt-1">
              {BRAND_ICONS[tool.name] || <Wrench className="w-8 h-8 text-zinc-400" />}
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold text-[#1A1A1A] flex-1 min-w-0">
                  <EditableText value={tool.name} onSave={(v) => update(idx, { name: v })} isEditing={isEditing} />
                </span>
                {isEditing && <DelButton onClick={() => del(idx)} title="이 도구 삭제" />}
              </div>
              <p className="text-[12px] text-zinc-500 font-medium leading-relaxed">
                <EditableText value={tool.description} onSave={(v) => update(idx, { description: v })} isEditing={isEditing} multiline />
              </p>
            </div>
          </div>
        ))}
      </div>
      {isEditing && (
        <div className="mt-6 max-w-xs">
          <AddRowButton onClick={add} label="도구/역량 추가" />
        </div>
      )}
    </section>
  );
};
