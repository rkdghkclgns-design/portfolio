import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, FileText, Tag, Calendar, X, LayoutGrid, HelpCircle, ExternalLink, Sparkles, Calculator, MousePointer2, ChevronRight, ArrowLeft, ArrowRight, RotateCw, Lock, MoreVertical, Minus, Square } from 'lucide-react';
import type { Project } from '../types';
import { EBookGallery } from './EBookGallery';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  isEditing?: boolean;
  onSaveContent?: (content: string) => void;
}

type TabType = 'overview' | 'document' | 'video' | 'link' | 'simulator' | 'prototype';

export const ProjectDetail = ({ project, onBack, isEditing, onSaveContent }: ProjectDetailProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currentPage, setCurrentPage] = useState(0);
  const [showThumbnailGrid, setShowThumbnailGrid] = useState(false);

  const tabs: { id: TabType; label: string; icon: React.ReactNode; show: boolean; color: string }[] = [
    { id: 'overview', label: '개요', icon: <LayoutGrid className="w-3.5 h-3.5" />, show: true, color: '#0047BB' },
    { id: 'document', label: '기획서', icon: <FileText className="w-3.5 h-3.5" />, show: !!(project.gallery || project.pdfUrl), color: '#059669' },
    { id: 'prototype', label: '프로토타입', icon: <Sparkles className="w-3.5 h-3.5" />, show: !!project.prototypeUrl, color: '#7C3AED' },
    { id: 'video', label: '플레이 영상', icon: <Play className="w-3.5 h-3.5" />, show: !!project.videoUrl, color: '#EA580C' },
    { id: 'link', label: '링크', icon: <ExternalLink className="w-3.5 h-3.5" />, show: !!project.externalUrl, color: '#2563EB' },
    { id: 'simulator', label: '시뮬레이터', icon: <Calculator className="w-3.5 h-3.5" />, show: !!(project.simulatorUrl || project.hasSimulator || project.simulatorVideoUrl), color: '#DC2626' },
  ];

  const visibleTabs = tabs.filter(t => t.show);

  const galleryImages = project.gallery || [project.image];

  const theme = {
    bg: 'bg-white',
    text: 'text-zinc-900',
    border: 'border-zinc-200',
    accent: '#0047BB'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
      className="flex-1 flex flex-col min-h-0 bg-white overflow-hidden rounded-xl shadow-2xl border border-zinc-200"
    >
      {/* Windows 11 Edge/Chrome Style Browser Window Chrome */}
      <div className="shrink-0 flex flex-col bg-[#DFE1E5] border-b border-zinc-300 relative z-50">
        {/* Tab Bar & Window Controls Layer */}
        <div className="h-10 flex items-end px-2 pt-2 relative">
          {/* Tabs */}
          <div className="flex items-end gap-1 z-10 overflow-x-auto no-scrollbar">
            {visibleTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    boxShadow: isActive ? `inset 0 2px 0 0 ${tab.color}` : undefined
                  }}
                  className={`relative h-8 px-4 flex items-center gap-2 rounded-t-[8px] transition-colors min-w-[140px] max-w-[200px] border-x border-t ${
                    isActive
                      ? 'bg-white text-zinc-800 z-20 border-zinc-200'
                      : 'bg-transparent text-zinc-600 border-transparent hover:bg-black/5'
                  }`}
                >
                  <span style={{ color: isActive ? tab.color : 'inherit' }} className="flex shrink-0">
                    {tab.icon}
                  </span>
                  <span className="text-[11px] font-semibold truncate">{tab.label}</span>
                  {/* Right side shadow/border blend for active tab */}
                  {isActive && (
                    <div className="absolute -bottom-px left-0 right-0 h-[2px] bg-white" />
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="flex-1" />
          
          {/* Windows Window Controls */}
          <div className="absolute top-0 right-0 h-8 flex items-start z-20">
            <button className="w-11 h-8 flex items-center justify-center hover:bg-black/5 transition-colors text-zinc-700">
              <Minus className="w-4 h-4" />
            </button>
            <button className="w-11 h-8 flex items-center justify-center hover:bg-black/5 transition-colors text-zinc-700">
              <Square className="w-3.5 h-3.5" />
            </button>
            <button onClick={onBack} className="w-11 h-8 flex items-center justify-center hover:bg-[#E81123] hover:text-white transition-colors text-zinc-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Address Bar Layer */}
        <div className="h-10 bg-white flex items-center px-2 gap-2 border-b border-zinc-200">
          <div className="flex items-center gap-1">
            <button onClick={onBack} className="w-7 h-7 rounded-md hover:bg-black/5 flex items-center justify-center text-zinc-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 rounded-md hover:bg-black/5 flex items-center justify-center text-zinc-400 transition-colors cursor-not-allowed">
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 rounded-md hover:bg-black/5 flex items-center justify-center text-zinc-600 transition-colors">
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* URL Input */}
          <div className="flex-1 h-7 bg-[#F1F3F4] rounded-full flex items-center px-3 gap-2 border border-transparent hover:border-zinc-300 transition-colors group cursor-text">
            <Lock className="w-3 h-3 text-zinc-500 shrink-0" />
            <span className="text-[12px] text-zinc-800 font-medium font-sans flex-1 truncate">
              portfolio.local <span className="text-zinc-400">/</span> {project.roles[0].toLowerCase().replace(/ /g, '-')} <span className="text-zinc-400">/</span> {project.title.toLowerCase().replace(/ /g, '-')}
            </span>
          </div>

          {/* Extensions/Profile */}
          <div className="flex items-center gap-1 px-1">
            <div className="w-7 h-7 rounded-full bg-zinc-200 flex items-center justify-center border border-zinc-300 overflow-hidden shrink-0">
              <div className="w-3 h-3 bg-zinc-400 rounded-full mt-1" />
            </div>
            <button className="w-7 h-7 rounded-md hover:bg-black/5 flex items-center justify-center text-zinc-600 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Maximized Space */}
      <div className="flex-1 flex flex-col min-h-0 bg-white relative">
        <AnimatePresence mode="wait">
          {activeTab === 'document' ? (
            <motion.div key="tab-document" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col min-h-0 overflow-hidden bg-zinc-950 relative"
            >
              {project.gallery ? (
                <EBookGallery images={galleryImages} currentIndex={currentPage} onPageChange={setCurrentPage} />
              ) : project.pdfUrl ? (
                <iframe 
                  src={`${project.pdfUrl}#toolbar=0`} 
                  className="w-full h-full border-0"
                  title="PDF Viewer"
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-zinc-400 font-sans font-black text-xs uppercase tracking-widest">
                  기획서가 준비 중입니다.
                </div>
              )}
              
              {project.gallery && (
                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end pointer-events-none z-50">
                  <div className="pointer-events-auto flex flex-col items-start gap-3">
                    {/* Page Counter Pill (Top) */}
                    <div className="flex items-center gap-4 px-5 py-2.5 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl text-white cursor-default transition-all hover:bg-black/50">
                      <span className="text-sm font-black tracking-widest">{String(currentPage + 1).padStart(2, '0')}</span>
                      <div className="w-px h-3.5 bg-white/20" />
                      <span className="text-[11px] font-bold text-white/50 tracking-widest">{String(galleryImages.length).padStart(2, '0')} Pages</span>
                    </div>

                    {/* View All Pages Button (Bottom) */}
                    <button
                      onClick={() => setShowThumbnailGrid(true)}
                      className="flex items-center gap-3 px-6 py-3.5 bg-[#0047BB] text-white rounded-2xl shadow-2xl shadow-[#0047BB]/30 hover:scale-105 active:scale-95 transition-all font-sans font-black text-[11px] uppercase tracking-[0.3em]"
                    >
                      <LayoutGrid className="w-4 h-4" />
                      전체 페이지 보기
                    </button>
                  </div>

                  <div className="pointer-events-auto flex flex-col items-end gap-4">
                    {/* Help Tooltip */}
                    <div className="group relative">
                      <div className="absolute bottom-full right-0 mb-6 w-72 p-6 bg-black/95 backdrop-blur-2xl rounded-4xl text-white text-[12px] leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] translate-y-2 group-hover:translate-y-0">
                        <div className="flex items-center gap-3 mb-4 text-[#0047BB] font-black tracking-widest uppercase text-[10px]">
                          <div className="w-1.5 h-1.5 rounded-full bg-current" />
                          조작 가이드
                        </div>
                        <ul className="space-y-2.5 text-zinc-300 font-medium">
                          <li className="flex justify-between items-center bg-white/5 p-2 rounded-lg"><span>마우스 휠</span> <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white">이동</span></li>
                          <li className="flex justify-between items-center bg-white/5 p-2 rounded-lg"><span>Ctrl + 휠</span> <span className="text-[10px] bg-[#0047BB] px-1.5 py-0.5 rounded text-white">확대/축소</span></li>
                          <li className="flex justify-between items-center bg-white/5 p-2 rounded-lg"><span>드래그</span> <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white">화면 이동</span></li>
                        </ul>
                      </div>
                      <button className="w-14 h-14 rounded-full bg-white text-[#0047BB] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-black/5">
                        <HelpCircle className="w-7 h-7" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : activeTab === 'link' ? (
            <motion.div key="tab-link" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center p-12 bg-zinc-950"
            >
              <div className="max-w-2xl w-full">
                <div className="relative group p-1 bg-linear-to-br from-[#6D28D9] via-[#C084FC] to-[#6D28D9] rounded-[3rem] shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-3xl" />
                  <div className="relative bg-zinc-900/80 rounded-[2.8rem] p-12 flex flex-col items-center text-center border border-white/5">
                    <div className="w-24 h-24 bg-[#6D28D9]/20 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                      <Sparkles className="w-12 h-12 text-[#6D28D9]" />
                    </div>
                    <h3 className="text-4xl font-black text-white mb-6 tracking-tight">LLM 시나리오 챗봇 체험</h3>
                    <p className="text-zinc-400 text-lg leading-relaxed mb-12 max-w-md font-medium">
                      NPC와의 자연스러운 대화를 통해 사건의 실마리를 풀어가는 지능형 시나리오 시스템을 직접 경험해 보세요.
                    </p>
                    <a 
                      href={project.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-20 bg-[#6D28D9] text-white rounded-4xl flex items-center justify-center gap-4 hover:bg-[#5B21B6] hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-xl shadow-[#6D28D9]/30 group/btn"
                    >
                      <span className="text-xl font-black tracking-tight">시나리오 체험하러 가기</span>
                      <ExternalLink className="w-6 h-6 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'prototype' ? (
            <motion.div key="tab-prototype" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 bg-[#0a0a0a] relative overflow-hidden flex flex-col lg:flex-row"
            >
              {/* Subtle dot grid */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} 
              />

              {/* Left Side: Info */}
              <div className="w-full lg:w-[380px] p-10 lg:p-14 relative z-10 flex flex-col justify-center gap-8 border-r border-white/5">
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" />
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Rapid Dev</span>
                  </div>
                  <h3 className="text-4xl font-black text-white mb-5 leading-[1.1] tracking-tighter">
                    바이브코딩<br />
                    <span className="text-[#EC4899]">프로토타입</span>
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                    기획의 핵심 메카니즘을 플레이어블 버전으로 신속하게 구현하여,{' '}
                    <strong className="text-zinc-300">수치 밸런스와 조작감</strong>을 즉각적으로 검증합니다.
                  </p>
                </div>

                <div className="grid gap-3">
                  {[
                    { title: "바이브코딩", desc: "자연어 기반 신속 구현", color: "bg-blue-500" },
                    { title: "유저 경험", desc: "실제 유저와 동일한 플레이 경험", color: "bg-emerald-500" },
                    { title: "로직 검증", desc: "복잡한 수치 공식 즉시 확인", color: "bg-[#EC4899]" }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className="p-4 rounded-2xl bg-white/5 border border-white/8 hover:border-white/15 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-7 ${item.color} rounded-full`} />
                        <div>
                          <div className="text-xs font-black text-white mb-0.5 uppercase tracking-wider">{item.title}</div>
                          <div className="text-[11px] text-zinc-500 font-medium">{item.desc}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/8 text-center">
                  <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-1">제작 소요 시간</div>
                  <div className="text-xl font-black text-white tracking-tighter">아이디어에서 실행까지</div>
                  <div className="text-sm font-black text-[#EC4899] mt-0.5">24시간 이내</div>
                </div>
              </div>

              {/* Right Side: Phone Frame */}
              <div className="flex-1 flex items-center justify-center p-6 lg:p-10 relative">
                <div className="relative group">
                  {/* Phone glow */}
                  <div className="absolute inset-0 bg-[#EC4899]/10 rounded-[3rem] blur-[60px] group-hover:bg-[#EC4899]/20 transition-all duration-700" />
                  
                  <div className="relative w-[360px] h-[620px] bg-[#0a0a0a] rounded-[3.5rem] shadow-2xl border-8 border-zinc-800 ring-1 ring-white/10 overflow-hidden">
                    {/* Dynamic Island */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-20 flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                      <div className="w-6 h-1 bg-white/5 rounded-full" />
                    </div>

                    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
                      <div className="scale-[0.78] origin-center">
                        <iframe 
                          src={project.prototypeUrl}
                          className="w-[450px] h-[750px] border-0"
                          title="Prototype Viewer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Hint */}
                <div className="absolute bottom-10 right-10 flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 animate-bounce">
                  <MousePointer2 className="w-3.5 h-3.5 text-white" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">화면을 직접 조작해보세요</span>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'simulator' ? (
            <motion.div key="tab-simulator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col min-h-0 bg-[#0B0C10] overflow-hidden"
            >
              <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                {/* Left: Code Explorer */}
                <div className="flex-1 border-r border-white/5 flex flex-col min-h-0 bg-black/20">
                  <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                        <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                      </div>
                      <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-2">simulator.py — Python</span>
                    </div>
                    <div className="text-[10px] text-zinc-600 font-mono">v5.2.0</div>
                  </div>
                  <div className="flex-1 overflow-auto p-12 font-mono text-[13px] leading-loose text-zinc-400">
                    <pre className="whitespace-pre">
{`# ── 밸런스 검증 로직 (Monte Carlo) ────────────────
def calculate_balance(params):
    # DPS 체인 계산
    atk_spd = (agi0 + upg_agi) * (1 + eq_agi_bonus)
    crit_m = 1 + (crit_tot / 100) * (cd0 + cdmg_upg - 1)
    
    # 몬스터 HP 역산 (TTK 목표 1.35s)
    nhp = tdps * 1.35 * dmg_rate(mnd)
    bhp = tdps * 35.0 * dmg_rate(bsd)
    
    # 지수 성장 곡선 시뮬레이션
    for stage in range(1, 2000):
        hp = nhp * (hpg ** (stage - 1))
        dps = dps_at(stage)
        ttk = hp / dps
        
        # 병목 구간(Bottleneck) 감지
        if ttk > 3.0: 
            return FAIL, "Stage " + stage`}
                    </pre>
                  </div>
                </div>

                {/* Right: Dashboard Preview */}
                <div className="flex-1 flex flex-col p-8 lg:p-12 items-center justify-center relative overflow-hidden bg-linear-to-br from-[#0B0C10] to-[#16213E]">
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#059669_0%,transparent_70%)]" />
                  </div>
                  
                  <div className="relative z-10 w-full max-w-lg">
                    <div className="mb-8 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-[#059669]/20 rounded-2xl flex items-center justify-center mb-6 border border-[#059669]/30">
                        <Calculator className="w-8 h-8 text-[#059669]" />
                      </div>
                      <h3 className="text-3xl font-black text-white mb-4">Balancing Tool Preview</h3>
                      <p className="text-zinc-400 font-medium">37개 파라미터 기반 실시간 수치 검증 시스템</p>
                    </div>

                    <div className="group relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/40">
                      {project.simulatorVideoUrl ? (
                        <div className="aspect-video w-full">
                          <iframe
                            src={project.simulatorVideoUrl.replace('watch?v=', 'embed/')}
                            title="Simulator Video"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          <img 
                            src="./images/dorothia_simulator_desktop.png" 
                            alt="Simulator Mockup"
                            className="w-full aspect-video object-cover opacity-90"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-zinc-900/40 to-transparent flex flex-col justify-end p-10">
                            {project.simulatorUrl && (
                              <a 
                                href={project.simulatorUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-16 bg-[#0047BB] text-white rounded-2xl flex items-center justify-center gap-3 hover:bg-[#003799] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#0047BB]/20"
                              >
                                <span className="font-black text-sm uppercase tracking-widest">Launch Simulator</span>
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="p-5 bg-white/5 rounded-2xl border border-white/8">
                        <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Sim Accuracy</div>
                        <div className="text-2xl font-black text-[#059669]">99.8%</div>
                      </div>
                      <div className="p-5 bg-white/5 rounded-2xl border border-white/8">
                        <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Total Iterations</div>
                        <div className="text-2xl font-black text-white">2,000+</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'video' ? (
            <motion.div key="tab-video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col p-8 bg-zinc-900"
            >
              <div className="flex-1 rounded-2xl overflow-hidden bg-black shadow-2xl relative group border border-white/5">
                <iframe src={project.videoUrl?.replace('watch?v=', 'embed/')} className="w-full h-full border-0" allowFullScreen />
              </div>
            </motion.div>
          ) : (
            <motion.div key="tab-overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#FAFAF9] custom-scrollbar"
            >
              {/* Full-bleed Hero */}
              <div className="relative h-[340px] shrink-0 overflow-hidden">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-6 left-8 flex flex-wrap gap-2">
                  {project.roles.map(role => (
                    <span key={role} className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest">{role}</span>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-white text-[10px] font-semibold">#{tag}</span>
                    ))}
                  </div>
                  <h1 className="text-4xl font-black text-white tracking-tight leading-tight drop-shadow-lg">{project.title}</h1>
                </div>
              </div>

              {/* Content Grid */}
              <div className="max-w-5xl mx-auto w-full px-8 py-10">
                <div className="grid grid-cols-3 gap-10">
                  {/* Main Content 2/3 */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100">
                      <div className="w-1 h-5 bg-[#0047BB] rounded-full" />
                      <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">기획 의도 및 핵심 내용</span>
                    </div>
                    <div className="text-zinc-600 leading-[1.9] text-[15px] whitespace-pre-wrap font-medium">{project.content}</div>
                  </div>

                  {/* Sidebar 1/3 */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-zinc-100">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Project Info</span>
                      </div>
                      <div className="p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                            <Tag className="w-4 h-4 text-[#0047BB]" />
                          </div>
                          <div>
                            <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mb-1.5">Roles</p>
                            <div className="flex flex-wrap gap-1.5">
                              {project.roles.map(role => (
                                <span key={role} className="px-2 py-1 bg-zinc-100 text-zinc-700 text-[11px] font-bold rounded-lg border border-zinc-200">{role}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="h-px bg-zinc-100" />
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Status</p>
                            <p className="text-sm font-bold text-zinc-800 mt-0.5">{project.status}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {project.externalUrl && (
                      <a href={project.externalUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-[#0047BB] rounded-2xl text-white hover:bg-[#003799] transition-colors group"
                      >
                        <ExternalLink className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-bold flex-1">Live Demo</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}

                    {visibleTabs.filter(t => t.id !== 'overview').length > 0 && (
                      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-zinc-100">
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">빠른 탐색</span>
                        </div>
                        <div className="p-2">
                          {visibleTabs.filter(t => t.id !== 'overview').map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 transition-colors text-left group"
                            >
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${tab.color}14` }}>
                                <span style={{ color: tab.color }} className="flex">{tab.icon}</span>
                              </div>
                              <span className="text-sm font-semibold text-zinc-700 flex-1">{tab.label}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Thumbnail Grid Overlay */}
      <AnimatePresence>
        {showThumbnailGrid && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-120 bg-[#1A1A1A]/95 backdrop-blur-3xl p-16 flex flex-col"
          >
            <div className="flex items-center justify-between mb-16">
              <div className="flex flex-col">
                <span className="text-[#0047BB] text-[12px] font-black tracking-[0.5em] uppercase mb-3">Navigation</span>
                <h3 className="text-white text-5xl font-black tracking-tighter">전체 페이지 개요</h3>
              </div>
              <button
                onClick={() => setShowThumbnailGrid(false)}
                className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:rotate-90 border border-white/10"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-6 custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-10">
                {galleryImages.map((img, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                    onClick={() => {
                      setCurrentPage(i);
                      setShowThumbnailGrid(false);
                    }}
                    className={`group relative aspect-3/4 rounded-2xl overflow-hidden border-2 transition-all duration-500 hover:scale-110 hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] ${i === currentPage ? 'border-[#0047BB] shadow-[0_0_40px_rgba(0,71,187,0.5)]' : 'border-white/5 hover:border-white/20'}`}
                  >
                    <img src={img} alt={`Page ${i + 1}`} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 transition-opacity duration-500 ${i === currentPage ? 'bg-[#0047BB]/20' : 'bg-black/60 opacity-0 group-hover:opacity-100'}`} />
                    <div className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 rounded-xl bg-black/80 backdrop-blur-md text-white text-[12px] font-black border border-white/10">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="shrink-0 mt-12 text-center text-white/20 text-[11px] font-black tracking-[0.5em] uppercase">
              {galleryImages.length} Pages Overview • Selection: Page {currentPage + 1}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
