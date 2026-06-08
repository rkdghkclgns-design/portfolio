import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { EditableText } from './EditableText';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../types';

interface ProjectsProps {
  onProjectClick: (p: Project) => void;
  isEditing: boolean;
  projects: Project[];
  setProjects: (p: Project[]) => void;
  limit?: number;
  setView?: (v: any) => void;
}

export const Projects = ({ onProjectClick, isEditing, projects, setProjects, limit, setView }: ProjectsProps) => {
  const [featuredId, setFeaturedId] = useState<number | null>(null);
  const actualFeaturedId = featuredId || (projects[0] ? projects[0].id : null);
  const displayedProjects = limit ? projects.slice(0, limit) : projects;

  const topProjects = limit ? [...displayedProjects].sort((a, b) => {
    if (a.id === actualFeaturedId) return -1;
    if (b.id === actualFeaturedId) return 1;
    return 0;
  }) : displayedProjects;

  return (
    <section id="projects" className="py-[120px] lg:py-[160px] px-6 md:px-12 relative min-h-screen flex flex-col justify-center bg-transparent overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-linear-to-r from-transparent via-black/10 to-transparent" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-size-[32px_32px]"></div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 border-b border-black/5 pb-6">
          <div>
            <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="flex items-center gap-2 mb-3">
              <span className="text-[#0047BB] font-sans text-[11px] font-black tracking-[0.3em] uppercase">02. 프로젝트 이력</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="flex flex-col gap-1 items-start mt-2">
              <span className="text-xl md:text-2xl text-zinc-400 font-display font-medium tracking-tight">실전으로 증명한</span>
              <span className="text-5xl md:text-6xl lg:text-[5.5rem] font-display font-black tracking-tighter text-[#1A1A1A] leading-[0.9] drop-shadow-sm">결과물</span>
            </motion.h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 self-end mb-1">
            <motion.p initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="text-zinc-500 text-xs md:text-sm font-medium md:text-right max-w-[280px] leading-relaxed border-l-2 md:border-l-0 md:border-r-2 border-[#0047BB]/10 pl-4 md:pl-0 md:pr-4">
              시스템 기획 및 프로토타입 개발 결과물입니다.
            </motion.p>
            {limit && setView && (
              <button onClick={() => setView('portfolio')}
                className="group flex items-center gap-2 text-[#0047BB] font-bold text-[10px] uppercase tracking-[0.2em] hover:text-[#1A1A1A] transition-colors bg-[#0047BB]/5 hover:bg-[#0047BB]/10 px-4 py-2.5 rounded-full mt-2">
                전체 찾아보기 <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {limit ? (
          <div className="flex flex-col lg:grid lg:grid-cols-3 lg:grid-rows-2 gap-4 h-auto lg:h-[500px]">
            <AnimatePresence mode="popLayout">
              {topProjects.map((project, index) => {
                const isMaster = index === 0;

                return (
                  <motion.div
                    key={project.id}
                    layoutId={`project-card-${project.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => isMaster ? onProjectClick(project) : setFeaturedId(project.id)}
                    className={`relative w-full rounded-3xl overflow-hidden shadow-md group border border-black/5 ${isMaster
                        ? 'lg:col-span-2 lg:row-span-2 h-[400px] lg:h-full cursor-pointer z-50 bg-[#1A1A1A]'
                        : 'lg:col-span-1 lg:row-span-1 h-[150px] lg:h-full cursor-pointer z-10 bg-[#FAFAFA] hover:shadow-xl'
                      }`}
                  >
                    <motion.img
                      layout="position"
                      src={project.image}
                      alt={project.title}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isMaster ? 'opacity-100 group-hover:scale-[1.02]' : 'opacity-60 group-hover:opacity-100 group-hover:scale-110'
                        }`}
                      referrerPolicy="no-referrer"
                    />
                    <motion.div 
                      layout="position" 
                      className={`absolute inset-0 bg-linear-to-t pointer-events-none transition-colors duration-500 ${
                        isMaster ? 'from-black/90 via-black/40 to-transparent' : 'from-black/80 via-black/20 to-transparent'
                      }`} 
                    />
                    
                    <motion.div layout="position" className="absolute top-8 left-8 lg:top-10 lg:left-10 flex flex-wrap gap-2 pointer-events-none z-10">
                      {project.roles && project.roles.map(role => (
                        <span key={role} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl leading-none transition-all duration-500 ${isMaster ? 'bg-white text-[#2C2C2C]' : 'bg-white/10 backdrop-blur-md text-white border border-white/10'}`}>{role}</span>
                      ))}
                      {project.status && (
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-xl leading-none transition-all duration-500 ${
                          isMaster 
                            ? 'bg-[#0047BB] text-white border border-white/10' 
                            : 'bg-white/10 backdrop-blur-md text-white border border-white/10'
                        }`}>
                          {project.status}
                        </span>
                      )}
                    </motion.div>

                    <motion.div layout="position" className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12 right-8 lg:right-12 flex items-end justify-between gap-10 pointer-events-none z-10 min-w-0">
                      <div className={`flex flex-col items-start gap-4 flex-1 w-full relative z-10 min-w-0 ${!isMaster && 'transition-transform duration-500 group-hover:-translate-y-2 max-w-[80%]'}`}>
                        <motion.h3 
                          layout="position" 
                          className={`font-display font-black text-white tracking-tighter drop-shadow-2xl leading-[1.1] w-full ${
                             isMaster ? 'text-4xl md:text-6xl lg:text-7xl' : 'text-xl md:text-2xl'
                          }`}
                        >
                          <EditableText value={project.title} onSave={(v) => { const p = [...projects]; const i = p.findIndex(pp => pp.id === project.id); p[i].title = v; setProjects(p); }} isEditing={isEditing} />
                        </motion.h3>
                        
                        {isMaster ? (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="relative overflow-hidden max-w-2xl"
                          >
                            <div className="text-white/80 text-base md:text-xl font-medium leading-relaxed drop-shadow-xl w-full">
                              <EditableText value={project.description || ""} onSave={(v) => { const p = [...projects]; const i = p.findIndex(pp => pp.id === project.id); p[i].description = v; setProjects(p); }} isEditing={isEditing} multiline />
                            </div>
                          </motion.div>
                        ) : (
                          <p className="text-white/60 text-sm md:text-base font-medium leading-relaxed drop-shadow-md line-clamp-1 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">{project.description}</p>
                        )}
                      </div>
                      
                      {isMaster ? (
                        <motion.button 
                          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                          onClick={(e) => { e.stopPropagation(); onProjectClick(project); }} 
                          className="pointer-events-auto shrink-0 w-16 h-16 md:w-20 md:h-20 bg-white hover:bg-[#0047BB] text-[#2C2C2C] hover:text-white rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] group border border-white/20 hover:scale-110 active:scale-95">
                          <ArrowRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      ) : (
                        <div className="shrink-0 w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-xl group-hover:scale-110">
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="w-full relative group/gallery">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 pt-4 px-6 md:px-12 -mx-6 md:-mx-12 items-stretch hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {projects.map((project, idx) => (
                <div key={project.id} className="snap-start shrink-0 w-[85vw] sm:w-[320px] md:w-[380px] lg:w-[420px] flex transform transition-transform duration-500 hover:-translate-y-2">
                  <ProjectCard project={project} idx={idx} isEditing={isEditing} projects={projects} setProjects={setProjects} onProjectClick={onProjectClick} layout="default" />
                </div>
              ))}
              {/* Spacer for last item to scroll into center comfortably */}
              <div className="shrink-0 w-[10vw] md:w-[20vw]" />
            </div>

            {/* Scroll Hints (Gradients) */}
            <div className="absolute top-0 right-0 h-full w-24 bg-linear-to-l from-[#FDFDFB] to-transparent pointer-events-none hidden md:block z-10" />
            <div className="absolute top-0 left-0 h-full w-24 bg-linear-to-r from-[#FDFDFB] to-transparent pointer-events-none hidden md:block z-10" />

            {/* Scroll Indicator */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 text-zinc-400 font-medium text-xs tracking-widest uppercase">
              <span className="hidden md:block">←</span>
              <span>Swipe to explore</span>
              <span className="hidden md:block">→</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
