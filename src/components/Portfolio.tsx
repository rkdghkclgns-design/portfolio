import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, MousePointer2, Download } from 'lucide-react';
import { EditableText } from './EditableText';
import { ProjectDetail } from './ProjectDetail';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../types';

/* ───────── HTML 내보내기 ─────────
 * 포트폴리오 전체(카드 그리드 + 클릭 시 상세 기획 내용)를 단독 실행 가능한
 * 인터랙티브 HTML 파일로 저장한다. 이미지/갤러리는 절대경로로 변환하고,
 * 데이터는 JSON으로 임베드하여 인터넷만 되면 어디서든 열 수 있다.
 */
function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function buildPortfolioHtml(projects: Project[], title: string): string {
  const toAbs = (src?: string) => {
    if (!src) return '';
    try { return new URL(src, document.baseURI).href; } catch { return src || ''; }
  };
  const BASE = (import.meta as any).env?.BASE_URL || '/';
  const logoAbs = toAbs(BASE + 'images/logo.png');
  const data = projects.map((p) => ({
    id: p.id,
    title: p.title || '',
    roles: p.roles || [],
    description: p.description || '',
    tags: p.tags || [],
    status: p.status || '',
    content: p.content || '',
    image: toAbs(p.image) || logoAbs,
    imgFit: p.image ? 'cover' : 'contain',
    gallery: (p.gallery || []).map(toAbs).filter(Boolean),
    videoUrl: p.videoUrl || '',
    externalUrl: p.externalUrl || '',
    prototypeUrl: p.prototypeUrl || '',
    simulatorUrl: p.simulatorUrl || p.simulatorVideoUrl || '',
  }));
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  const safeTitle = (title || '포트폴리오').replace(/[&<>]/g, (c) => (({ '&': '&amp;', '<': '&lt;', '>': '&gt;' } as Record<string, string>)[c] || c));

  // String.raw: 내장 스크립트의 정규식 백슬래시(\s,\n 등)를 그대로 보존
  return String.raw`<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230047BB'/%3E%3Cpath d='M32 23 L20 43 M32 23 L44 43' stroke='%23fff' stroke-width='3' stroke-linecap='round'/%3E%3Ccircle cx='32' cy='22' r='6.5' fill='%23fff'/%3E%3Ccircle cx='20' cy='44' r='5.5' fill='%23fff'/%3E%3Ccircle cx='44' cy='44' r='5.5' fill='%23fff'/%3E%3C/svg%3E" />
<title>${safeTitle}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
<style>
  :root{--blue:#0047BB;}
  *{box-sizing:border-box;}
  html,body{margin:0;}
  body{font-family:"Pretendard","Malgun Gothic","Apple SD Gothic Neo",system-ui,sans-serif;background:#F4F5F7;color:#1A1A1A;-webkit-font-smoothing:antialiased;}
  header.top{max-width:1200px;margin:0 auto;padding:56px 24px 8px;}
  header.top .kicker{font:700 11px ui-monospace,monospace;letter-spacing:.3em;color:var(--blue);text-transform:uppercase;}
  header.top h1{font-size:clamp(28px,5vw,44px);font-weight:800;letter-spacing:-.02em;margin:10px 0 0;}
  header.top p{color:#71717A;margin:8px 0 0;font-weight:500;}
  .wrap{max-width:1200px;margin:0 auto;padding:24px;}
  .filters{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:8px 0 28px;}
  .chip{border:1px solid rgba(0,0,0,.08);background:#fff;border-radius:999px;padding:9px 16px;font-size:13px;font-weight:700;color:#52525B;cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:.2s;}
  .chip span{font:800 9px ui-monospace,monospace;background:#f1f1f3;color:#a1a1aa;padding:2px 6px;border-radius:6px;}
  .chip.on{background:var(--blue);color:#fff;border-color:var(--blue);}
  .chip.on span{background:rgba(255,255,255,.2);color:#fff;}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:28px;}
  .card{background:#fff;border:1px solid #ececef;border-radius:24px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column;transition:.35s;}
  .card:hover{box-shadow:0 30px 60px -24px rgba(0,71,187,.18);transform:translateY(-3px);border-color:rgba(0,71,187,.2);}
  .thumb{aspect-ratio:16/10;background:#fafafa;border-bottom:1px solid #f1f1f3;overflow:hidden;}
  .thumb img{width:100%;height:100%;object-fit:cover;display:block;}
  .thumb img.contain{object-fit:contain;padding:14%;}
  .card .body{padding:24px;display:flex;flex-direction:column;gap:10px;flex:1;}
  .roles{display:flex;flex-wrap:wrap;gap:6px;}
  .roles span{font:800 9px sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--blue);background:rgba(0,71,187,.06);padding:3px 8px;border-radius:7px;}
  .roles span.st{color:#fff;background:var(--blue);}
  .card h3{font-size:21px;font-weight:800;margin:2px 0 0;letter-spacing:-.01em;}
  .card p{color:#71717A;font-size:14px;line-height:1.6;margin:0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
  .tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto;}
  .tags i{font-style:normal;font-size:10px;font-weight:700;color:#a1a1aa;background:#fafafa;border:1px solid #f1f1f3;border-radius:7px;padding:3px 8px;text-transform:uppercase;letter-spacing:.08em;}
  .overlay{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;}
  .overlay.show{display:flex;}
  .sheet{position:relative;background:#fff;width:100%;max-width:1100px;height:100%;overflow:auto;}
  @media(min-width:768px){.overlay{padding:24px;}.sheet{height:auto;max-height:92vh;border-radius:24px;}}
  .sheet .x{position:fixed;top:14px;right:16px;z-index:5;width:40px;height:40px;border:none;border-radius:50%;background:rgba(0,0,0,.55);color:#fff;font-size:24px;line-height:1;cursor:pointer;}
  @media(min-width:768px){.sheet .x{position:absolute;}}
  .hero{height:300px;background:#0B0C10;overflow:hidden;}
  .hero img{width:100%;height:100%;object-fit:cover;display:block;}
  .hero img.contain{object-fit:contain;padding:40px;background:#fff;}
  .dwrap{padding:32px clamp(20px,4vw,48px) 56px;}
  .droles{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;}
  .droles span{font:800 10px sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--blue);background:rgba(0,71,187,.06);padding:4px 9px;border-radius:8px;}
  .droles span.st{color:#fff;background:var(--blue);}
  .dwrap h2{font-size:clamp(26px,4vw,38px);font-weight:800;letter-spacing:-.02em;margin:0 0 18px;}
  .links{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:26px;}
  .links a{display:inline-flex;align-items:center;gap:6px;padding:11px 18px;border-radius:12px;background:#111827;color:#fff;font-weight:700;font-size:13px;text-decoration:none;transition:.2s;}
  .links a:hover{background:var(--blue);}
  .content{font-size:15.5px;line-height:1.85;color:#2C2C2C;max-width:760px;word-break:keep-all;}
  .content h1{font-size:24px;font-weight:800;margin:28px 0 10px;}
  .content h2{font-size:20px;font-weight:800;margin:24px 0 8px;}
  .content h3{font-size:16px;font-weight:800;margin:18px 0 6px;color:#3f3f46;}
  .content p{margin:0 0 12px;}
  .content ul{margin:0 0 14px;padding-left:20px;}
  .content li{margin:4px 0;}
  .content strong{color:var(--blue);font-weight:800;}
  .gallery{margin-top:34px;display:flex;flex-direction:column;gap:14px;}
  .gallery img{width:100%;border-radius:14px;border:1px solid #ececef;display:block;}
  footer.ft{text-align:center;color:#a1a1aa;font-size:12px;padding:40px 0 60px;}
</style>
</head>
<body>
<header class="top"><div class="kicker">PORTFOLIO</div><h1>${safeTitle}</h1><p>프로젝트 카드를 클릭하면 상세 기획 내용을 볼 수 있습니다.</p></header>
<div class="wrap"><div class="filters" id="filters"></div><div class="grid" id="grid"></div></div>
<footer class="ft">© ${safeTitle}</footer>
<div class="overlay" id="overlay"><div class="sheet"></div></div>
<script>
(function(){
  var DATA = ${json};
  var grid=document.getElementById('grid'),filters=document.getElementById('filters'),overlay=document.getElementById('overlay'),sheet=overlay.firstElementChild,active='전체';
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];});}
  function pad2(n){n=String(n);return n.length<2?('0'+n):n;}
  function inl(s){return esc(s).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');}
  function md(src){
    var lines=String(src||'').split(/\r?\n/),out=[],inL=false;
    function cl(){if(inL){out.push('</ul>');inL=false;}}
    for(var i=0;i<lines.length;i++){var t=lines[i].replace(/\s+$/,'');
      if(/^###\s+/.test(t)){cl();out.push('<h3>'+inl(t.replace(/^###\s+/,''))+'</h3>');}
      else if(/^##\s+/.test(t)){cl();out.push('<h2>'+inl(t.replace(/^##\s+/,''))+'</h2>');}
      else if(/^#\s+/.test(t)){cl();out.push('<h1>'+inl(t.replace(/^#\s+/,''))+'</h1>');}
      else if(/^[-*]\s+/.test(t)){if(!inL){out.push('<ul>');inL=true;}out.push('<li>'+inl(t.replace(/^[-*]\s+/,''))+'</li>');}
      else if(t.replace(/\s/g,'')===''){cl();}
      else{cl();out.push('<p>'+inl(t)+'</p>');}
    }
    cl();return out.join('');
  }
  function badges(p){var h=(p.roles||[]).map(function(r){return '<span>'+esc(r)+'</span>';}).join('');if(p.status)h+='<span class="st">'+esc(p.status)+'</span>';return h;}
  function renderFilters(){
    var roles=['전체'];
    DATA.forEach(function(p){(p.roles||[]).forEach(function(r){if(r&&roles.indexOf(r)<0)roles.push(r);});});
    filters.innerHTML=roles.map(function(r){
      var c=r==='전체'?DATA.length:DATA.filter(function(p){return (p.roles||[]).indexOf(r)>=0;}).length;
      return '<button class="chip'+(r===active?' on':'')+'" data-r="'+esc(r)+'">'+esc(r)+'<span>'+pad2(c)+'</span></button>';
    }).join('');
  }
  function renderGrid(){
    var list=active==='전체'?DATA:DATA.filter(function(p){return (p.roles||[]).indexOf(active)>=0;});
    if(!list.length){grid.innerHTML='<p style="grid-column:1/-1;text-align:center;color:#a1a1aa;padding:60px 0;">표시할 프로젝트가 없습니다.</p>';return;}
    grid.innerHTML=list.map(function(p){
      return '<article class="card" data-id="'+esc(p.id)+'">'
        +'<div class="thumb"><img class="'+(p.imgFit==='contain'?'contain':'')+'" src="'+esc(p.image)+'" alt="" loading="lazy"/></div>'
        +'<div class="body"><div class="roles">'+badges(p)+'</div>'
        +'<h3>'+esc(p.title)+'</h3><p>'+esc(p.description)+'</p>'
        +'<div class="tags">'+(p.tags||[]).map(function(t){return '<i>#'+esc(t)+'</i>';}).join('')+'</div>'
        +'</div></article>';
    }).join('');
  }
  function open(id){
    var p=null;for(var i=0;i<DATA.length;i++){if(String(DATA[i].id)===String(id)){p=DATA[i];break;}}
    if(!p)return;
    function lk(u,l){return u?'<a href="'+esc(u)+'" target="_blank" rel="noopener">'+l+'</a>':'';}
    var links=lk(p.videoUrl,'▶ 플레이 영상')+lk(p.prototypeUrl,'✦ 프로토타입')+lk(p.externalUrl,'↗ 링크')+lk(p.simulatorUrl,'⚙ 시뮬레이터');
    var gal=(p.gallery&&p.gallery.length)?'<div class="gallery">'+p.gallery.map(function(g){return '<img src="'+esc(g)+'" alt="" loading="lazy"/>';}).join('')+'</div>':'';
    sheet.innerHTML='<button class="x" type="button" aria-label="닫기">&times;</button>'
      +'<div class="hero"><img class="'+(p.imgFit==='contain'?'contain':'')+'" src="'+esc(p.image)+'" alt=""/></div>'
      +'<div class="dwrap"><div class="droles">'+badges(p)+'</div><h2>'+esc(p.title)+'</h2>'
      +(links?'<div class="links">'+links+'</div>':'')
      +'<div class="content">'+md(p.content)+'</div>'+gal+'</div>';
    sheet.scrollTop=0;
    overlay.classList.add('show');document.body.style.overflow='hidden';
    sheet.querySelector('.x').onclick=close;
  }
  function close(){overlay.classList.remove('show');document.body.style.overflow='';}
  grid.addEventListener('click',function(e){var c=e.target.closest('.card');if(c)open(c.getAttribute('data-id'));});
  filters.addEventListener('click',function(e){var b=e.target.closest('.chip');if(!b)return;active=b.getAttribute('data-r');renderFilters();renderGrid();});
  overlay.addEventListener('click',function(e){if(e.target===overlay)close();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  renderFilters();renderGrid();
})();
</script>
</body>
</html>`;
}

interface PortfolioProps {
  onProjectClick: (p: Project) => void;
  isEditing: boolean;
  projects: Project[];
  setProjects: (p: Project[]) => void;
  setView: (v: any) => void;
  onBack: () => void;
  initialProjectId?: number | null;
}

export const Portfolio = ({ isEditing, projects, setProjects, onBack, initialProjectId }: PortfolioProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (initialProjectId != null) {
      const target = projects.find(p => p.id === initialProjectId);
      if (target) setSelectedProject(target);
    }
    window.scrollTo(0, 0);
  }, [initialProjectId, projects]);

  const categories = ['전체', ...Array.from(new Set(projects.flatMap(p => p.roles || []).filter(Boolean)))];
  const [activeCategory, setActiveCategory] = useState('전체');

  const filteredProjects = activeCategory === '전체'
    ? projects
    : projects.filter(p => p.roles && p.roles.includes(activeCategory));

  const handleExportHtml = () => {
    const title = (typeof document !== 'undefined' && document.title) ? document.title : '포트폴리오';
    const html = buildPortfolioHtml(projects, title);
    const fname = title.replace(/\s*\|\s*/g, '_').replace(/\s+/g, '_').replace(/[\\/:*?"<>]/g, '') + '.html';
    downloadFile(fname, html, 'text/html;charset=utf-8');
  };

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Subtle background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]" style={{background: 'rgba(0,71,187,0.04)'}}></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] rounded-full blur-[100px]" style={{background: 'rgba(80,0,20,0.03)'}}></div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto"
      >
        <div className="bg-white rounded-4xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-black/5 p-8 md:p-12 lg:p-16 min-h-[80vh]">

        {/* Export Toolbar */}
        <div className="flex justify-end mb-6 -mt-2">
          <button
            onClick={handleExportHtml}
            title="포트폴리오를 인터랙티브 HTML 파일로 저장합니다"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0047BB] text-white text-[13px] font-bold tracking-tight hover:bg-[#003399] active:scale-95 transition-all shadow-md shadow-[#0047BB]/20"
          >
            <Download className="w-4 h-4" /> HTML 내보내기
          </button>
        </div>

        {/* Polished Filter Bar with Sliding Indicator */}
        <div className="flex flex-col items-center mb-16 relative">
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-zinc-100/50 backdrop-blur-xl rounded-4xl border border-black/5">
            {categories.map((category) => {
              const count = category === '전체' 
                ? projects.length 
                : projects.filter(p => p.roles && p.roles.includes(category)).length;
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative px-6 py-3 rounded-3xl transition-all duration-500 group flex items-center gap-2.5 overflow-hidden min-w-fit ${
                    isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-[#0047BB] shadow-lg shadow-[#0047BB]/20"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 text-[14px] font-bold tracking-tight leading-none transition-colors">
                    {category}
                  </span>
                  <span className={`relative z-10 text-[9px] font-black px-1.5 py-0.5 rounded-md transition-colors duration-300 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-zinc-200/50 text-zinc-400 group-hover:bg-zinc-200 group-hover:text-zinc-500'
                  }`}>
                    {String(count).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        {/* Polished Project Grid with Refined Hierarchy */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ 
                  duration: 0.3, 
                  delay: Math.min(index * 0.02, 0.3),
                  ease: [0.16, 1, 0.3, 1] 
                }}
              >
                <ProjectCard 
                  project={project} 
                  idx={projects.findIndex(p => p.id === project.id)}
                  isEditing={isEditing}
                  projects={projects}
                  setProjects={setProjects}
                  onProjectClick={setSelectedProject}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        </div>
      </motion.section>

      {/* Detail Overlay Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Panel */}
            <div className="absolute inset-0 flex items-center justify-center p-0 md:p-6 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.97 }}
                transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                className="w-[98vw] md:w-[95vw] h-[98vh] md:h-[95vh] max-w-[1600px] bg-white md:rounded-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.35)] overflow-hidden relative pointer-events-auto flex flex-col"
              >
                {/* Content - height fills modal, scroll managed per-tab */}
                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                  <ProjectDetail
                    project={selectedProject}
                    onBack={() => setSelectedProject(null)}
                    isEditing={isEditing}
                    onSaveContent={(c) => {
                      const p = [...projects];
                      const i = p.findIndex(pp => pp.id === selectedProject.id);
                      if (i !== -1) { p[i].content = c; setProjects(p); setSelectedProject({ ...selectedProject, content: c }); }
                    }}
                    onUpdateProject={(patch) => {
                      const p = [...projects];
                      const i = p.findIndex(pp => pp.id === selectedProject.id);
                      if (i !== -1) { p[i] = { ...p[i], ...patch }; setProjects(p); setSelectedProject({ ...selectedProject, ...patch }); }
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
