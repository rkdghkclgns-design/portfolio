import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

interface RightRailProps {
  view: string;
  onNavClick: (id: string) => void;
  activeSection: string;
}

export const RightRail = ({ view, onNavClick, activeSection }: RightRailProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const sections = [
    { id: 'about', label: '01', name: '소개' },
    { id: 'projects', label: '02', name: '프로젝트' },
    { id: 'skills', label: '03', name: '핵심역량' },
    { id: 'play-history', label: '04', name: '플레이 이력' },
    { id: 'contact', label: '05', name: '문의하기' }
  ];

  useEffect(() => {
    const handleScroll = () => { setIsVisible(window.pageYOffset > 500); };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <>
      {view === 'home' && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3 bg-white/70 backdrop-blur-md border border-black/5 shadow-sm p-3 rounded-full print:hidden">
          {sections.map(section => {
            const isActive = activeSection === section.id;
            return (
              <button key={section.id} onClick={() => onNavClick(section.id)} className="group relative flex items-center justify-center w-6 h-6" aria-label={`Scroll to ${section.id}`}>
                {/* Dot / Active Pill Indicator */}
                <div className={`rounded-full transition-all duration-300 ease-out ${isActive ? 'w-2 h-6 bg-[#0047BB] shadow-[0_2px_8px_rgba(0,71,187,0.3)]' : 'w-1.5 h-1.5 bg-zinc-300 group-hover:bg-zinc-400 group-hover:scale-125'}`}></div>
                
                {/* Floating Tooltip */}
                <div className={`absolute right-10 flex items-center transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0'}`}>
                  <div className="bg-white border border-black/5 shadow-sm px-3 py-1.5 rounded-xl text-[12px] font-bold text-[#2C2C2C] whitespace-nowrap flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-widest text-[#0047BB]/70">{section.label}</span>
                    <span>{section.name}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {isVisible && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-white/90 backdrop-blur-md border border-black/10 rounded-xl flex items-center justify-center text-[#2C2C2C] hover:bg-zinc-50 hover:border-[#0047BB] transition-all shadow-md print:hidden">
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
