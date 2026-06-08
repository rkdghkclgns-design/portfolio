import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Portfolio } from './components/Portfolio';
import { Skills } from './components/Skills';
import { PlayHistory } from './components/PlayHistory';
import { Resume } from './components/Resume';
import { PrintTemplate } from './components/PrintTemplate';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { RightRail } from './components/RightRail';
import { ProjectDetail } from './components/ProjectDetail';
import { GameHistoryView } from './components/GameHistoryView';
import { BackgroundEffects } from './components/BackgroundEffects';
import { motion } from 'motion/react';
import { FileText, FolderOpen, Gamepad2 } from 'lucide-react';

import { useEditableContent } from './hooks/useEditableContent';
import { RESUME_DATA, PROJECTS, GAME_HISTORY, SKILLS } from './data';
import type { Project, ResumeData, GameHistory, Skill } from './types';

type ViewType = 'home' | 'resume' | 'project-detail' | 'portfolio' | 'all-projects' | 'game-history' | 'cover-letter';

function App() {
  const [view, setView] = useState<ViewType>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view') as ViewType;
      const validViews: ViewType[] = ['home', 'resume', 'project-detail', 'portfolio', 'all-projects', 'game-history', 'cover-letter'];
      if (validViews.includes(viewParam)) {
        return viewParam;
      }
    }
    return 'home';
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [targetProjectId, setTargetProjectId] = useState<number | null>(null);
  const [resumeTab, setResumeTab] = useState<'resume' | 'cover-letter'>('resume');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleSetResumeTab = (tab: 'resume' | 'cover-letter') => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setResumeTab(tab);
  };

  // Supabase Data
  const [resumeData, setResumeData, resumeLoaded] = useEditableContent(RESUME_DATA, 'resume_data');
  const [projectsData, setProjectsData, projectsLoaded] = useEditableContent(PROJECTS, 'projects_data_v2');
  const [portfolioProjects, setPortfolioProjects, portfolioLoaded] = useEditableContent(PROJECTS, 'portfolio_projects_v2');
  const [gameHistory, setGameHistory, gameHistoryLoaded] = useEditableContent(GAME_HISTORY, 'game_history');
  const [skillsData, setSkillsData] = useState(SKILLS);
  const [heroContent, setHeroContent, heroLoaded] = useEditableContent({
    titleLine1: "플레이어의 마음을 움직이는",
    titleLine2: "경험을 설계하는 기획자",
    description: "탄탄한 시스템 논리 위에 재미라는 감성을 채웁니다.\n기획 의도가 흔들리지 않는 뼈대를 설계하여,\n다양한 변수 속에서도 본연의 재미가 유지되는 환경을 만듭니다."
  }, 'hero_content');
  const [aboutContent, setAboutContent, aboutLoaded] = useEditableContent({
    p1: "탄탄한 시스템의 논리적 뼈대 위에서,<br/>유저의 마음에 즐거움이라는 <strong>감성을 채워넣는 것</strong> —<br/>그것이 제가 생각하는 게임 기획의 본질입니다.",
    p2: "저는 누군가의 하루를 움직이는,<br/><strong>경험을 설계하는 기획자</strong>가 되겠습니다."
  }, 'about_content');

  const isDataLoaded = resumeLoaded && projectsLoaded && portfolioLoaded && gameHistoryLoaded && heroLoaded && aboutLoaded;

  // Section Observer
  useEffect(() => {
    if (view !== 'home') return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { threshold: 0.3 });
    ['hero', 'about', 'projects', 'skills', 'play-history', 'contact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [view, isDataLoaded]);

  // Force scroll to top on initial load (prevent browser from remembering scroll position on refresh)
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const [returnScrollY, setReturnScrollY] = useState<number>(0);

  const changeView = (newView: ViewType) => {
    const isResumeTransition = 
      (view === 'resume' || view === 'cover-letter') && 
      (newView === 'resume' || newView === 'cover-letter');

    if (view === 'home' && newView !== 'home') {
      setReturnScrollY(window.scrollY);
    }
    
    // Update URL without reloading the page
    if (newView === 'home') {
      window.history.pushState({ view: newView }, '', window.location.pathname);
    } else {
      window.history.pushState({ view: newView }, '', `?view=${newView}`);
    }

    setView(newView);

    // 사용자 요청: 이력서 <-> 자기소개서 전환 시에만 위로 스크롤
    if (isResumeTransition) {
      window.scrollTo(0, 0);
    } else if (newView !== 'home' && newView !== 'resume' && newView !== 'cover-letter') {
      // 그 외 포트폴리오, 게임 이력 등으로 갈 때는 기본적으로 최상단으로 이동 (필요 시 유지)
      window.scrollTo(0, 0);
    }
  };

  // 브라우저 뒤로가기(popstate) 이벤트 대응
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view') as ViewType;
      const validViews: ViewType[] = ['home', 'resume', 'project-detail', 'portfolio', 'all-projects', 'game-history', 'cover-letter'];
      setView(validViews.includes(viewParam) ? viewParam : 'home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavClick = (id: string) => {
    changeView('home');
    setTimeout(() => {
      if (id === 'hero-top') { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveSection(''); return; }
      const element = document.getElementById(id);
      if (element) { element.scrollIntoView({ behavior: 'smooth' }); setActiveSection(id); }
    }, 100);
  };

  const handleBack = () => {
    if (view === 'resume' || view === 'cover-letter') setResumeTab('resume');
    if (view === 'portfolio') setTargetProjectId(null);
    if (view === 'project-detail') {
      changeView('portfolio');
      return;
    }
    
    setView('home');
    setTimeout(() => {
      window.scrollTo({ top: returnScrollY, behavior: 'instant' });
    }, 10);
  };

  // ── Navbar Slots ──────────────────────────────────────────────

  // 컨텍스트 이동 버튼
  const makeNavBtn = (label: string, icon: React.ReactNode, target: typeof view) => (
    <button
      key={label}
      onClick={() => changeView(target)}
      className="w-[125px] py-2.5 rounded-full text-[14px] font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 text-zinc-500 hover:text-[#2C2C2C] hover:bg-white hover:shadow-sm"
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const resumeIcon = <FileText className="w-3.5 h-3.5" />;
  const portfolioIcon = <FolderOpen className="w-3.5 h-3.5" />;
  const dnaIcon = <Gamepad2 className="w-3.5 h-3.5" />;

  // pdfButton 삭제됨
  // centerSlot
  const centerSlot = (() => {
    if (view === 'resume' || view === 'cover-letter') {
      return (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex bg-zinc-100/80 backdrop-blur-md p-1 rounded-full border border-black/5 shadow-inner">
          {(['resume', 'cover-letter'] as const).map((tab) => (
            <button key={tab} onClick={() => handleSetResumeTab(tab)}
              className={`relative px-6 py-1.5 rounded-full text-[13px] font-bold transition-all tracking-tight flex items-center justify-center w-[100px] ${resumeTab === tab ? 'text-[#0047BB]' : 'text-zinc-500 hover:text-[#1A1A1A]'}`}>
              {resumeTab === tab && (
                <motion.div layoutId="resumeTabBadge" className="absolute inset-0 bg-white rounded-full shadow-sm border border-black/5" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
              )}
              <span className="relative z-10">{tab === 'resume' ? '이력서' : '자기소개서'}</span>
            </button>
          ))}
        </div>
      );
    }
    return undefined;
  })();

  // rightActionSlot은 Navbar 내부에서 모든 화면에 동일하게 보이도록 직접 렌더링되므로 속성을 넘기지 않음

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFB]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0047BB]/20 border-t-[#0047BB] rounded-full animate-spin"></div>
          <p className="text-zinc-500 font-medium font-mono text-sm tracking-widest uppercase">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen font-sans selection:bg-[#0047BB]/20 text-[#2C2C2C] bg-transparent">
      <BackgroundEffects />
      <Navbar
        setView={changeView}
        currentView={view}
        onNavClick={handleNavClick}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        activeSection={activeSection}
        onBack={view !== 'home' ? handleBack : undefined}
        centerSlot={centerSlot}
        isGeneratingPdf={isGeneratingPdf}
      />
      <RightRail view={view} onNavClick={handleNavClick} activeSection={activeSection} />

      {view === 'home' && (
        <main className="relative">
          <Hero onPortfolioClick={() => changeView('portfolio')} onResumeClick={() => changeView('resume')} isEditing={isEditing} content={heroContent} setContent={setHeroContent} aboutContent={aboutContent} setAboutContent={setAboutContent} />
          <About isEditing={isEditing} content={aboutContent} setContent={setAboutContent} />
          <Projects onProjectClick={(p) => { setTargetProjectId(p.id); changeView('portfolio'); }} isEditing={isEditing} projects={projectsData} setProjects={setProjectsData} limit={3} setView={changeView} />
          <Skills isEditing={isEditing} skills={skillsData} setSkills={setSkillsData} />
          <PlayHistory isEditing={isEditing} history={gameHistory} setHistory={setGameHistory} onViewAll={() => changeView('game-history')} />
          <Contact />
        </main>
      )}

      {(view === 'resume' || view === 'cover-letter') && (
        <Resume
          setView={changeView}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          data={resumeData}
          setData={setResumeData}
          onBack={handleBack}
          activeTab={resumeTab}
          setActiveTab={handleSetResumeTab}
          isGeneratingPdf={isGeneratingPdf}
          setIsGeneratingPdf={setIsGeneratingPdf}
        />
      )}
      {view === 'project-detail' && selectedProject && (
        <ProjectDetail
          project={selectedProject}
          isEditing={isEditing}
          onBack={handleBack}
          onSaveContent={(c) => { const p = [...projectsData]; const index = p.findIndex(pp => pp.id === selectedProject.id); if (index !== -1) { p[index].content = c; setProjectsData(p); setSelectedProject(p[index]); } }}
        />
      )}
      {view === 'portfolio' && (
        <Portfolio
          onProjectClick={(p) => { setSelectedProject(p); changeView('project-detail'); }}
          isEditing={isEditing}
          projects={portfolioProjects}
          setProjects={setPortfolioProjects}
          setView={changeView}
          onBack={handleBack}
          initialProjectId={targetProjectId}
        />
      )}
      {view === 'game-history' && (
        <GameHistoryView
          onBack={handleBack}
          history={gameHistory}
          setHistory={setGameHistory}
          isEditing={isEditing}
        />
      )}

      <Footer />
    </div>

    </>
  );
}

export default App;
