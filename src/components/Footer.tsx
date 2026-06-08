import React from 'react';
import { FileText } from 'lucide-react';

export const Footer = () => (
  <footer className="py-12 px-6 md:px-12 text-center bg-transparent">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 border-t border-black/5 pt-8">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-[#2C2C2C] flex items-center justify-center rounded-md">
          <FileText className="text-white w-3 h-3" />
        </div>
        <span className="font-bold text-zinc-600 font-sans">지망생 홍길동</span>
      </div>
      <p className="text-zinc-400 text-xs font-mono uppercase tracking-widest">© 2026 GAME DESIGNER PORTFOLIO. All rights reserved.</p>
    </div>
  </footer>
);
