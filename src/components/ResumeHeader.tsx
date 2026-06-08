import React from 'react';
import { Mail, Phone, Calendar, MapPin, Shield } from 'lucide-react';
import { EditableText } from './EditableText';
import type { ResumeData } from '../types';

interface ResumeHeaderProps {
  data: ResumeData;
  setData: (d: ResumeData) => void;
  isEditing: boolean;
  isGeneratingPdf: boolean;
}

export const ResumeHeader = ({ data, setData, isEditing, isGeneratingPdf }: ResumeHeaderProps) => {
  return (
    <header className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 lg:p-12 bg-[#FAFAFA] border-b border-zinc-100">
      {/* Portrait Frame */}
      <div className="relative shrink-0">
        <div className="w-48 lg:w-52 rounded-sm overflow-hidden border border-black/10 shadow-xl bg-white">
          <img 
            src={data.image || "https://picsum.photos/seed/profile/600/800"} 
            alt="Profile" 
            className="w-full h-auto object-contain block" 
          />
        </div>
      </div>

      {/* Identity & Summary */}
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left pt-2">
        <h1 className="text-4xl lg:text-[56px] font-display font-bold text-[#1A1A1A] tracking-tighter leading-tight mb-2">
          <EditableText value={data.name} onSave={(v) => setData({...data, name: v})} isEditing={isEditing} />
        </h1>
        <p className="text-[#0047BB] font-black font-mono tracking-[0.4em] text-[11px] lg:text-xs uppercase mb-6 pb-1 border-b-2 border-[#0047BB]">
          <EditableText value={data.role} onSave={(v) => setData({...data, role: v})} isEditing={isEditing} />
        </p>
        
        <div className="max-w-2xl text-[16px] lg:text-[17px] text-[#2C2C2C] leading-[1.75] font-medium [&_strong]:text-[#0047BB] [&_strong]:font-black [&_strong]:text-[17px] lg:[&_strong]:text-[18px] [&_strong]:bg-[#0047BB]/5 [&_strong]:px-1.5 [&_strong]:py-0.5 [&_strong]:rounded-md break-keep">
          <EditableText value={data.summary} onSave={(v) => setData({...data, summary: v})} isEditing={isEditing} markdown={true} />
        </div>

        {/* Contact Info Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
          <div className="flex items-center gap-2.5 group">
            <Mail className="w-4 h-4 text-[#0047BB] shrink-0" strokeWidth={2} />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">EMAIL</span>
              <span className="text-[13px] text-[#1A1A1A] font-semibold lowercase">
                <EditableText value={data.email} onSave={(v) => setData({...data, email: v})} isEditing={isEditing} />
              </span>
            </div>
          </div>
          {data.birthDate && (
            <div className="flex items-center gap-2.5 group">
              <Calendar className="w-4 h-4 text-[#0047BB] shrink-0" strokeWidth={2} />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">생년월일</span>
                <span className="text-[13px] text-[#1A1A1A] font-semibold">{data.birthDate}</span>
              </div>
            </div>
          )}
          {(isEditing || isGeneratingPdf) && data.phone && (
            <div className="flex items-center gap-2.5 group">
              <Phone className="w-4 h-4 text-[#0047BB] shrink-0" strokeWidth={2} />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">연락처</span>
                <span className="text-[13px] text-[#1A1A1A] font-semibold">
                  <EditableText value={data.phone} onSave={(v) => setData({...data, phone: v})} isEditing={isEditing} />
                </span>
              </div>
            </div>
          )}
          {data.address && (
            <div className="flex items-center gap-2.5 group">
              <MapPin className="w-4 h-4 text-[#0047BB] shrink-0" strokeWidth={2} />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">주소</span>
                <span className="text-[13px] text-[#1A1A1A] font-semibold">
                  <EditableText value={data.address} onSave={(v) => setData({...data, address: v})} isEditing={isEditing} />
                </span>
              </div>
            </div>
          )}
          {data.military && (
            <div className="flex items-center gap-2.5 group">
              <Shield className="w-4 h-4 text-[#0047BB] shrink-0" strokeWidth={2} />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">병역</span>
                <span className="text-[13px] text-[#1A1A1A] font-semibold">{data.military.branch} {data.military.rank} {data.military.status}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
