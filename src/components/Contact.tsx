import React from 'react';
import { Mail } from 'lucide-react';

export const Contact = () => (
  <section id="contact" className="min-h-screen px-0 flex flex-col justify-center bg-transparent overflow-hidden group/contact relative">
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/contact:scale-[1.15] group-hover/contact:opacity-0 z-0">
       <span className="text-[14vw] font-display font-black text-black/3 tracking-tighter leading-[0.8] m-0 p-0 text-center uppercase">
         LET'S<br/>WORK.
       </span>
    </div>

    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 scale-95 group-hover/contact:opacity-100 group-hover/contact:scale-100 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] bg-transparent z-10">
      <div className="absolute inset-0 pointer-events-none opacity-[0.10] object-cover bg-repeat bg-size-[100px_100px]" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')"}}></div>
      
      <div className="text-center relative z-10 w-full px-6 max-w-4xl mx-auto flex flex-col items-center">
        <span className="text-[#0047BB] font-mono text-xs uppercase tracking-[0.4em] font-bold mb-8 block">05. 문의하기</span>
        <h2 className="flex flex-col items-center justify-center mb-16">
          <span className="text-xl md:text-2xl text-zinc-400 font-display font-medium tracking-[0.3em] mb-4">저는</span>
          <span className="text-[12vw] sm:text-7xl md:text-8xl lg:text-[9rem] font-display font-black tracking-tighter text-[#2C2C2C] leading-none drop-shadow-sm">준비되었습니다</span>
        </h2>
        <p className="text-zinc-500 text-xl md:text-2xl mb-16 max-w-2xl mx-auto font-medium leading-relaxed hidden sm:block">
          새로운 프로젝트나 협업 제안은 언제나 환영입니다.
        </p>
        
        <a href="mailto:example@email.com"
          className="group/btn inline-flex items-center justify-center gap-4 px-12 py-6 bg-white border border-black/10 text-[#2C2C2C] font-bold hover:bg-[#0047BB] hover:text-white hover:border-[#0047BB] transition-all duration-500 rounded-full tracking-widest text-lg md:text-xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(128,0,32,0.2)] hover:-translate-y-1">
          <Mail className="w-6 h-6 md:w-7 md:h-7 group-hover/btn:scale-110 transition-transform" /> example@email.com
        </a>
      </div>
    </div>
  </section>
);
