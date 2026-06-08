import React, { useRef } from 'react';
import { ImagePlus, Plus, X } from 'lucide-react';

/**
 * editKit — 관리자 편집 모드 공용 도구
 * - 이미지 업로드(다운스케일 → dataURL)
 * - 항목 추가/삭제 버튼
 */

export function downscaleImage(file: File, maxW = 900, maxH = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) { reject(new Error('이미지 파일이 아닙니다.')); return; }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('이미지를 불러올 수 없습니다.'));
      img.onload = () => {
        const ratio = Math.min(1, maxW / img.width, maxH / img.height);
        const w = Math.round(img.width * ratio), h = Math.round(img.height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        try { resolve(canvas.toDataURL('image/jpeg', 0.85)); } catch (e) { reject(e as Error); }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/** 이미지 변경 버튼 (숨겨진 파일 입력 포함) */
export const EditImageButton = ({ onPick, label = '이미지 변경', maxW = 900, maxH = 900, className = '' }:
  { onPick: (dataUrl: string) => void; label?: string; maxW?: number; maxH?: number; className?: string }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <button type="button" onClick={() => inputRef.current?.click()}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0047BB] text-white text-[11px] font-bold shadow hover:bg-[#003399] transition ${className}`}>
        <ImagePlus className="w-3.5 h-3.5" /> {label}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => {
          const f = e.target.files && e.target.files[0];
          if (f) downscaleImage(f, maxW, maxH).then(onPick).catch((err) => alert(err.message || '이미지 처리 실패'));
          e.target.value = '';
        }} />
    </>
  );
};

/** 항목 추가 버튼 (점선) */
export const AddRowButton = ({ onClick, label = '항목 추가', className = '' }:
  { onClick: () => void; label?: string; className?: string }) => (
  <button type="button" onClick={onClick}
    className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-[#0047BB]/40 text-[#0047BB] text-[12px] font-bold hover:bg-[#0047BB]/5 transition ${className}`}>
    <Plus className="w-3.5 h-3.5" /> {label}
  </button>
);

/** 항목 삭제 버튼 (작은 원형 X) */
export const DelButton = ({ onClick, title = '삭제', className = '' }:
  { onClick: () => void; title?: string; className?: string }) => (
  <button type="button" onClick={(e) => { e.stopPropagation(); onClick(); }} title={title}
    className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white shadow hover:bg-red-600 transition shrink-0 ${className}`}>
    <X className="w-3.5 h-3.5" />
  </button>
);
