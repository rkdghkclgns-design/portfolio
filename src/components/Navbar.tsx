import React, { useState, useEffect } from 'react';
import { FileText, FolderOpen, Gamepad2, Home, Lock, Menu, X, ArrowLeft, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PasswordModal } from './PasswordModal';

const SUB_VIEW_LABELS: Record<string, string> = {
  'resume': '이력서',
  'cover-letter': '이력서',
  'portfolio': '포트폴리오 갤러리',
  'project-detail': '프로젝트 상세',
  'game-history': '게이밍DNA',
  'all-projects': '프로젝트 전체',
};

interface NavbarProps {
  setView: (v: 'home' | 'resume' | 'project-detail' | 'portfolio' | 'all-projects' | 'game-history') => void;
  currentView: string;
  onNavClick: (id: string) => void;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  activeSection: string;
  onBack?: () => void;
  /** Resume 탭 전환용 중앙 슬롯 (이력서/자기소개서 탭) */
  centerSlot?: React.ReactNode;
  /** PDF 생성 진행중 여부 */
  isGeneratingPdf?: boolean;
}

export const Navbar = ({ setView, currentView, onNavClick, isEditing, setIsEditing, activeSection, onBack, centerSlot, isGeneratingPdf }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  // 로고 이미지: public/images/logo.png 가 있으면 사용, 없으면 이름 표시
  const [logoOk, setLogoOk] = useState(false);
  const LOGO_SRC = ((import.meta as any).env?.BASE_URL || '/') + 'images/logo.png';

  const isSubView = currentView !== 'home';

  useEffect(() => {
    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    onNavClick(id);
    setIsMenuOpen(false);
  };

  const handleAdminClick = () => {
    if (isEditing) {
      setIsEditing(false);
      alert("관리자 모드가 비활성화되었습니다.");
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  const handlePasswordConfirm = (pw: string) => {
    if (pw === '0000') {
      setIsEditing(true);
      setIsPasswordModalOpen(false);
      alert("관리자 모드가 활성화되었습니다. 내용을 클릭하여 수정하세요.");
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  // Sub-view: navbar always has solid pill background
  const navBgClass = isSubView || scrolledPastHero
    ? 'bg-white/90 backdrop-blur-2xl border border-black/10 shadow-[0_12px_40px_rgba(0,0,0,0.08)]'
    : 'bg-transparent border border-transparent';
  const navContainerClass = scrolledPastHero || isSubView ? 'py-3' : 'py-8';

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 transition-all duration-500 pointer-events-none print:hidden ${navContainerClass}`}>
        <nav className={`relative pointer-events-auto w-[98%] max-w-[1440px] rounded-full transition-all duration-500 flex items-center justify-between px-6 lg:px-8 py-3 ${navBgClass}`}>
          
          {/* Floating PDF (Admin Only, Resume Only) */}
          {currentView === 'resume' && isEditing && (
            <div className="absolute top-1/2 -right-2 lg:-right-4 transform translate-x-full -translate-y-1/2 pointer-events-auto">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('triggerPdfDownload'))}
                disabled={isGeneratingPdf}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white shadow-sm border border-black/5 hover:border-[#0047BB]/30 hover:shadow text-zinc-600 hover:text-[#0047BB] text-[13px] font-bold transition-all disabled:opacity-50 group"
              >
                <svg className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"/>
                </svg>
                <span className="whitespace-nowrap">{isGeneratingPdf ? '생성 중...' : 'PDF 저장'}</span>
              </button>
            </div>
          )}

          {/* ── LEFT ── */}
          <div className="flex shrink-0 items-center gap-3 min-w-[200px]">
            {isSubView && onBack ? (
              <button
                onClick={onBack}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-black/6 text-zinc-600 hover:text-[#0047BB] font-bold text-sm transition-all duration-200 group"
              >
                <motion.span
                  className="flex items-center"
                  whileHover={{ x: -2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                </motion.span>
                <span>이전 화면으로 돌아가기</span>
              </button>
            ) : (
              /* Home: 로고 (logo.png 있으면 이미지, 없으면 이름) */
              <div className="flex items-center gap-3 cursor-pointer group" onClick={(e) => handleLinkClick(e, 'hero-top')}>
                <img src={LOGO_SRC} alt="로고" onLoad={() => setLogoOk(true)} onError={() => setLogoOk(false)}
                  style={{ display: logoOk ? 'block' : 'none' }}
                  className="h-10 md:h-12 w-auto max-w-[220px] object-contain transition-transform group-hover:scale-[1.03]" />
                {!logoOk && (
                  <>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-linear-to-br from-[#0047BB] to-[#003080] text-white flex items-center justify-center shadow-lg shadow-[#0047BB]/25 transition-all group-hover:scale-105 group-hover:shadow-[#0047BB]/40 group-hover:shadow-xl">
                      <Home className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-y-0.5" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="font-display font-bold tracking-tight text-[16px] md:text-[18px] text-[#2C2C2C] group-hover:text-[#0047BB] transition-colors leading-none">홍길동</span>
                      <span className="text-[10px] md:text-[11px] font-mono tracking-widest uppercase text-zinc-400 mt-1.5 leading-none hidden sm:block group-hover:text-[#0047BB]/60 transition-colors">게임 기획자 지망생</span>
                    </div>
                  </>
                )}
                {isEditing && (
                  <span className="ml-2 px-2 py-1 bg-[#0047BB]/10 border border-[#0047BB]/30 rounded text-[10px] text-[#0047BB] font-bold uppercase tracking-wider">
                    Edit
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ── CENTER ── */}
          <div className="hidden lg:flex flex-1 items-center justify-center">
            {isSubView && centerSlot ? (
              /* Sub-view with tabs (e.g. Resume ↔ 자기소개서) */
              centerSlot
            ) : isSubView ? (
              /* Sub-view without tabs: page label breadcrumb */
              <></>
            ) : (
              /* Home: section nav links */
              <div className="flex items-center justify-center gap-2">
                {([] as { id: string; label: string; num: string }[]).map(({ id, label, num }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(e) => handleLinkClick(e, id)}
                    className={`relative px-5 py-3 rounded-full text-[15px] font-bold transition-all flex items-center gap-2.5 ${activeSection === id ? 'text-[#0047BB] bg-[#0047BB]/5' : 'text-zinc-500 hover:text-[#2C2C2C] hover:bg-zinc-100'}`}
                  >
                    <span className={`text-[12px] font-mono uppercase tracking-widest transition-colors duration-300 ${activeSection === id ? 'text-[#0047BB]/70' : 'text-zinc-400'}`}>{num}</span>
                    <span className="tracking-wide">{label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT ── */}
          <div className="flex items-center justify-end gap-3 shrink-0 min-w-[200px]">
            {/* Document shortcut pill (Always show for both Home and Sub-views) */}
            <div className="hidden xl:flex bg-zinc-100/80 p-1.5 rounded-full border border-black/5 shadow-inner">
              {[
                { key: 'home', label: '마인드맵', icon: React.createElement(Home, { className: "w-4 h-4" }) },
                { key: 'resume', label: '이력서', icon: React.createElement(FileText, { className: "w-4 h-4" }) },
                { key: 'cover-letter', label: '자기소개서', icon: React.createElement(User, { className: "w-4 h-4" }) },
                { key: 'portfolio', label: '포트폴리오', icon: React.createElement(FolderOpen, { className: "w-4 h-4" }) },
                { key: 'game-history', label: '게이밍DNA', icon: React.createElement(Gamepad2, { className: "w-4 h-4" }) },
              ].map(item => (
                <button key={item.key} onClick={() => { setView(item.key as any); window.scrollTo(0, 0); }}
                  className={`px-4 py-2.5 rounded-full text-[13px] font-bold tracking-tight transition-all duration-300 flex items-center justify-center gap-1.5 whitespace-nowrap ${currentView === item.key ? 'bg-white text-[#0047BB] shadow-md pointer-events-none' : 'text-zinc-500 hover:text-[#2C2C2C] hover:bg-white hover:shadow-sm'}`}>
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            <div className="hidden xl:block w-px h-8 bg-black/10 mx-1.5" />
            
            <div className="flex items-center">
              <button
                onClick={handleAdminClick}
                className="w-11 h-11 rounded-full transition-all flex items-center justify-center hover:bg-zinc-100 text-zinc-500 hover:text-[#2C2C2C]"
                title="Admin Mode"
              >
                <Lock className={`w-[18px] h-[18px] ${isEditing ? 'text-[#0047BB]' : 'opacity-80'}`} />
              </button>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden w-11 h-11 ml-1 flex items-center justify-center rounded-full bg-zinc-100 text-[#2C2C2C]">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-40 bg-white/90 flex items-center justify-center pt-20 pb-10"
          >
            <div className="w-[90%] max-w-md bg-white border border-black/5 p-8 rounded-3xl shadow-2xl flex flex-col gap-8 max-h-[90vh] overflow-y-auto">
              <div className="bg-zinc-50 rounded-2xl p-4 flex flex-col gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 mb-2">Documents</span>
                {[
                  { key: 'home', label: '마인드맵', icon: React.createElement(Home, { className: "w-4 h-4" }) },
                  { key: 'resume', label: '이력서', icon: React.createElement(FileText, { className: "w-4 h-4" }) },
                  { key: 'cover-letter', label: '자기소개서', icon: React.createElement(User, { className: "w-4 h-4" }) },
                  { key: 'portfolio', label: '포트폴리오', icon: React.createElement(FolderOpen, { className: "w-4 h-4" }) },
                  { key: 'game-history', label: '게이밍DNA', icon: React.createElement(Gamepad2, { className: "w-4 h-4" }) },
                ].map(item => (
                  <button key={item.key} onClick={() => { setView(item.key as any); setIsMenuOpen(false); window.scrollTo(0, 0); }}
                    className={`text-left font-bold text-[14px] flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${currentView === item.key ? 'bg-white text-[#0047BB] shadow-sm' : 'text-zinc-600 hover:bg-[#0047BB] hover:text-white'}`}>
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
              {false && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 px-4 mb-1">Navigation</span>
                  {[
                    { id: 'about', label: '소개', num: '01' },
                    { id: 'projects', label: '프로젝트 이력', num: '02' },
                    { id: 'skills', label: '핵심역량', num: '03' },
                    { id: 'play-history', label: '플레이 이력', num: '04' }
                  ].map(({ id, label, num }) => (
                    <a key={id} href={`#${id}`} onClick={(e) => handleLinkClick(e, id)}
                      className="group relative font-bold flex items-center gap-4 py-3 px-4 rounded-xl text-[#2C2C2C] hover:bg-zinc-50 transition-colors">
                      <span className="text-xs font-mono opacity-40 text-zinc-500 group-hover:text-[#0047BB] transition-colors">{num}</span>
                      <span className="text-base tracking-wide">{label}</span>
                    </a>
                  ))}
                </div>
              )}
              <button onClick={() => setIsMenuOpen(false)} className="mt-auto w-full py-4 rounded-xl bg-zinc-100 text-zinc-600 font-bold tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors">
                닫기 <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isPasswordModalOpen && (
        <PasswordModal isOpen={isPasswordModalOpen} onConfirm={handlePasswordConfirm} onClose={() => setIsPasswordModalOpen(false)} />
      )}
    </>
  );
};
