import React, { useState } from 'react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pw: string) => void;
}

export const PasswordModal = ({ isOpen, onClose, onConfirm }: PasswordModalProps) => {
  const [password, setPassword] = useState('');
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111] border border-[#2a2a2a] p-8 max-w-sm w-full shadow-xl rounded-2xl">
        <h3 className="text-xl font-display font-bold text-[#e8e4dc] mb-4 tracking-tight">관리자 로그인</h3>
        <p className="text-[#888] text-sm mb-6">내용을 수정하려면 비밀번호를 입력하세요.</p>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onConfirm(password); }}
          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] p-3 text-[#e8e4dc] focus:outline-none focus:border-[#0047BB] mb-6 font-mono rounded-lg"
          placeholder="••••"
          autoFocus
        />
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 text-[#888] font-medium hover:text-[#e8e4dc] transition-colors rounded-xl">취소</button>
          <button onClick={() => onConfirm(password)} className="flex-1 py-3 bg-[#0047BB] text-[#e8e4dc] font-bold hover:bg-[#9a0028] transition-colors rounded-xl">확인</button>
        </div>
      </div>
    </div>
  );
};
