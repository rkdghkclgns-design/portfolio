import React, { useRef, useLayoutEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface EditableTextProps {
  value: string;
  onSave: (v: string) => void;
  isEditing: boolean;
  className?: string;
  multiline?: boolean;
  markdown?: boolean;
}

export const EditableText = ({
  value, onSave, isEditing, className = '', multiline = false, markdown = false,
}: EditableTextProps) => {
  const taRef = useRef<HTMLTextAreaElement>(null);

  // 표시 영역과 동일한 높이가 되도록 textarea 자동 확장
  useLayoutEffect(() => {
    const el = taRef.current;
    if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }
  }, [value, isEditing]);

  if (!isEditing) {
    if (markdown) {
      return (
        <div className={`markdown-body text-inherit! leading-[inherit]! p-0! bg-transparent! border-none! ${className}`}
          style={{ fontSize: 'inherit', lineHeight: 'inherit' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{value}</ReactMarkdown>
        </div>
      );
    }
    if (multiline) return <span className={className} style={{ whiteSpace: 'pre-line' }}>{value}</span>;
    return <span className={className}>{value}</span>;
  }

  // 편집 필드: 주변 텍스트의 글꼴/크기를 그대로 상속 → 입력/표시 크기 일치
  const editCls =
    `w-full bg-[#0047BB]/[0.06] border border-[#0047BB]/40 rounded px-1.5 py-0.5 ` +
    `focus:outline-none focus:border-[#0047BB] focus:bg-[#0047BB]/[0.12] transition-colors ${className}`;

  if (multiline || markdown) {
    return (
      <textarea
        ref={taRef}
        className={editCls}
        style={{ font: 'inherit', lineHeight: 'inherit', resize: 'none', overflow: 'hidden', color: 'inherit', display: 'block' }}
        value={value}
        onChange={(e) => onSave(e.target.value)}
        rows={1}
        placeholder={markdown ? '마크다운 지원 (**굵게**, - 리스트 등)' : ''}
      />
    );
  }
  return (
    <input
      className={editCls}
      style={{ font: 'inherit', color: 'inherit' }}
      value={value}
      onChange={(e) => onSave(e.target.value)}
    />
  );
};
