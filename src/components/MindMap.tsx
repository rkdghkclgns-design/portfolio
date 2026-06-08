import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Plus, Download, RotateCcw, Sparkles, ChevronRight, ArrowUpRight } from 'lucide-react';

/**
 * MindMap — 자기 성찰용 마인드맵 캔버스 (홈 첫 화면)
 * - 카테고리별 노드 + 하위 토픽(다단계). 예) 나 > 즐겨하는 게임 > PC > MMORPG > 로스트아크 > 1000시간
 * - 마우스: 휠=확대/축소(커서 기준), 빈 곳 드래그=이동(pan), 노드 드래그=이동, 더블클릭=편집, ✕=삭제, ＋=하위
 * - 예시 불러오기 / 초기화('나'만), localStorage 자동 저장
 * - HTML 내보내기: 확대/축소/이동 가능한 인터랙티브 HTML 파일로 저장
 */

interface MindMapProps {
  onResumeClick: () => void;
  onPortfolioClick: () => void;
}

interface MNode { id: string; text: string; cat: string; x: number; y: number; parent: string; }
interface MData { center: { text: string; x: number; y: number }; nodes: MNode[]; }

const KEY = 'self_mindmap_v1';
const FONT = `"Pretendard","Malgun Gothic","Apple SD Gothic Neo",system-ui,sans-serif`;

const CATEGORIES = [
  { key: '스킬', color: '#0047BB', tint: '#E6EDFB' },
  { key: '장점', color: '#15803D', tint: '#E7F4EC' },
  { key: '단점', color: '#D97706', tint: '#FDF1E1' },
  { key: '성격', color: '#7C3AED', tint: '#F1E9FC' },
  { key: '가치관', color: '#0D9488', tint: '#E2F4F1' },
  { key: '목표', color: '#DB2777', tint: '#FCE8F1' },
  { key: '관심사', color: '#4F46E5', tint: '#EAE9FC' },
  { key: '경험', color: '#475569', tint: '#EBEEF2' },
  { key: '기타', color: '#71717A', tint: '#EFEFF1' },
];
const CAT_MAP: Record<string, { key: string; color: string; tint: string }> =
  Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/* ---- 텍스트 측정/줄바꿈 ---- */
let _mctx: CanvasRenderingContext2D | null = null;
function mctx() { if (!_mctx) _mctx = document.createElement('canvas').getContext('2d'); return _mctx as CanvasRenderingContext2D; }
function wrapByWidth(text: string, font: string, maxW: number): string[] {
  const ctx = mctx(); ctx.font = font;
  const chars = Array.from(text || ''); const lines: string[] = []; let line = '';
  for (const ch of chars) {
    if (ch === '\n') { lines.push(line); line = ''; continue; }
    const test = line + ch;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = ch; } else line = test;
  }
  lines.push(line);
  return lines.length ? lines : [''];
}
function lineW(line: string, font: string) { const ctx = mctx(); ctx.font = font; return ctx.measureText(line).width; }
function geomOf(text: string, o: { fs: number; weight: number; lh: number; padX: number; padY: number; maxW: number; minW: number }) {
  const font = `${o.weight} ${o.fs}px ${FONT}`;
  const lines = wrapByWidth(text && text.trim() ? text : '내용', font, o.maxW);
  const textW = Math.max(...lines.map((l) => lineW(l, font)), 0);
  const w = Math.max(o.minW, Math.ceil(textW) + o.padX * 2);
  const h = lines.length * o.lh + o.padY * 2;
  return { w, h, lines, lh: o.lh, fs: o.fs, weight: o.weight };
}
const nodeGeom = (t: string) => geomOf(t, { fs: 14, weight: 600, lh: 19, padX: 14, padY: 9, maxW: 200, minW: 64 });
const centerGeom = (t: string) => geomOf(t, { fs: 20, weight: 800, lh: 26, padX: 20, padY: 13, maxW: 180, minW: 90 });

function buildEmpty(w: number, h: number): MData { return { center: { text: '나', x: w / 2, y: h / 2 }, nodes: [] }; }

/* 입력 예시: 나 > 즐겨하는 게임 > PC > MMORPG > 로스트아크 > 1000시간 (+ 다른 가지) */
function buildExample(w: number, h: number): MData {
  const cx = w / 2, cy = h / 2;
  const sx = Math.min(1, (w / 2 - 50) / 580), sy = Math.min(1, (h / 2 - 40) / 240);
  const P = (dx: number, dy: number) => ({ x: clamp(cx + dx * sx, 60, w - 60), y: clamp(cy + dy * sy, 50, h - 50) });
  const defs: [string, string, string, string, number, number][] = [
    ['g', '즐겨하는 게임', '관심사', 'center', -160, 50],
    ['pc', 'PC', '관심사', 'g', -330, 0],
    ['mo', '모바일', '관심사', 'g', -250, 165],
    ['mmo', 'MMORPG', '관심사', 'pc', -500, -55],
    ['la', '로스트아크', '관심사', 'mmo', -560, 70],
    ['hr', '1000시간', '관심사', 'la', -460, 175],
    ['sk', '스킬', '스킬', 'center', 210, -95],
    ['sk1', '시스템 기획', '스킬', 'sk', 400, -120],
    ['me', '장점', '장점', 'center', 210, 100],
    ['me1', '끈기', '장점', 'me', 400, 130],
  ];
  const idmap: Record<string, string> = { center: 'center' };
  const nodes: MNode[] = [];
  for (const [key, text, cat, pkey, dx, dy] of defs) {
    const id = 'ex_' + key; idmap[key] = id;
    const p = P(dx, dy);
    nodes.push({ id, text, cat, parent: idmap[pkey] || 'center', x: p.x, y: p.y });
  }
  return { center: { text: '나', x: cx, y: cy }, nodes };
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* 내보낼 인터랙티브 HTML(확대/축소/이동 뷰어) 생성 */
function buildExportHtml(title: string, worldInner: string) {
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
<style>
  html,body{margin:0;height:100%;overflow:hidden;font-family:"Pretendard","Malgun Gothic","Apple SD Gothic Neo",system-ui,sans-serif;}
  #svg{width:100vw;height:100vh;display:block;cursor:grab;touch-action:none;background:radial-gradient(circle, rgba(0,71,187,0.06) 1px, transparent 1px) 0 0/26px 26px,#F4F2EC;}
  #svg.grabbing{cursor:grabbing;}
  .hud{position:fixed;left:18px;top:16px;pointer-events:none;}
  .hud .t{font-size:14px;font-weight:800;color:#1A2332;}
  .hud .s{font-size:10px;letter-spacing:.18em;color:#9aa0aa;font-weight:700;}
  .ctrl{position:fixed;right:18px;bottom:18px;display:flex;align-items:center;gap:4px;background:#fff;border:1px solid rgba(0,0,0,.12);border-radius:999px;padding:5px 7px;box-shadow:0 6px 18px rgba(0,0,0,.12);}
  .ctrl button{border:none;background:#f4f4f5;width:30px;height:30px;border-radius:50%;font-size:17px;line-height:1;cursor:pointer;color:#27272a;}
  .ctrl button:hover{background:#e4e4e7;}
  .ctrl .z{font:12px ui-monospace,monospace;min-width:46px;text-align:center;color:#3f3f46;}
  .ctrl .fit{width:auto;border-radius:999px;padding:0 13px;font-size:12px;font-weight:700;}
  .help{position:fixed;left:18px;bottom:16px;font-size:11px;color:#a1a1aa;}
</style>
</head>
<body>
<div class="hud"><div class="t">${title}</div><div class="s">SELF-REFLECTION MINDMAP</div></div>
<svg id="svg" xmlns="http://www.w3.org/2000/svg"><g id="vp">${worldInner}</g></svg>
<div class="ctrl"><button id="zo" title="축소">&#8722;</button><span class="z" id="zl">100%</span><button id="zi" title="확대">&#43;</button><button class="fit" id="fit">맞춤</button></div>
<div class="help">휠: 확대/축소 &middot; 드래그: 이동 &middot; 맞춤: 전체 보기</div>
<script>
(function(){
  var svg=document.getElementById('svg'),vp=document.getElementById('vp'),zl=document.getElementById('zl');
  var t={x:0,y:0,k:1};
  function apply(){vp.setAttribute('transform','translate('+t.x+','+t.y+') scale('+t.k+')');zl.textContent=Math.round(t.k*100)+'%';}
  function fit(){var b;try{b=vp.getBBox();}catch(e){return;}if(!b||!b.width){apply();return;}var W=svg.clientWidth,H=svg.clientHeight,pad=90;var k=Math.min((W-pad)/b.width,(H-pad)/b.height,1.6);k=Math.max(k,0.1);t.k=k;t.x=(W-b.width*k)/2-b.x*k;t.y=(H-b.height*k)/2-b.y*k;apply();}
  function zoomAt(sx,sy,f){var k2=Math.min(4,Math.max(0.2,t.k*f));t.x=sx-(sx-t.x)/t.k*k2;t.y=sy-(sy-t.y)/t.k*k2;t.k=k2;apply();}
  svg.addEventListener('wheel',function(e){e.preventDefault();var r=svg.getBoundingClientRect();zoomAt(e.clientX-r.left,e.clientY-r.top,e.deltaY<0?1.12:1/1.12);},{passive:false});
  var pan=null;
  svg.addEventListener('pointerdown',function(e){pan={x:e.clientX,y:e.clientY,tx:t.x,ty:t.y};svg.classList.add('grabbing');if(svg.setPointerCapture)try{svg.setPointerCapture(e.pointerId);}catch(_){}});
  svg.addEventListener('pointermove',function(e){if(!pan)return;t.x=pan.tx+(e.clientX-pan.x);t.y=pan.ty+(e.clientY-pan.y);apply();});
  function end(){pan=null;svg.classList.remove('grabbing');}
  svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
  document.getElementById('zi').onclick=function(){zoomAt(svg.clientWidth/2,svg.clientHeight/2,1.2);};
  document.getElementById('zo').onclick=function(){zoomAt(svg.clientWidth/2,svg.clientHeight/2,1/1.2);};
  document.getElementById('fit').onclick=fit;
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(fit);}
  setTimeout(fit,250);fit();
})();
</script>
</body>
</html>`;
}

export const MindMap = ({ onResumeClick, onPortfolioClick }: MindMapProps) => {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [data, setData] = useState<MData | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [cat, setCat] = useState(CATEGORIES[0].key);
  const [vp, setVp] = useState({ tx: 0, ty: 0, k: 1 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<any>(null);
  const vpRef = useRef(vp);
  useEffect(() => { vpRef.current = vp; }, [vp]);

  /* 컨테이너 크기 측정 */
  useLayoutEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const measure = () => { const r = el.getBoundingClientRect(); setSize({ w: Math.round(r.width), h: Math.round(r.height) }); };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* 데이터 초기화 (저장본 우선, 없으면 예시. 구버전 호환) */
  useEffect(() => {
    if (data || size.w === 0) return;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && d.center && Array.isArray(d.nodes)) { d.nodes = d.nodes.map((n: any) => ({ ...n, parent: n.parent || 'center' })); setData(d); return; }
      }
    } catch { /* ignore */ }
    setData(buildExample(size.w, size.h));
  }, [size, data]);

  /* 자동 저장 */
  useEffect(() => { if (data) { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ } } }, [data]);

  /* 드래그(노드 이동 / 빈 곳 이동=pan) — 전역 리스너 */
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = dragRef.current; if (!d) return;
      const r = svgRef.current?.getBoundingClientRect(); if (!r) return;
      const sx = e.clientX - r.left, sy = e.clientY - r.top;
      if (d.mode === 'pan') { setVp((v) => ({ ...v, tx: d.tx0 + (sx - d.sx), ty: d.ty0 + (sy - d.sy) })); return; }
      const { k, tx, ty } = vpRef.current;
      const wx = (sx - tx) / k, wy = (sy - ty) / k;
      const x = clamp(wx - d.dx, -3000, (size.w || 1200) + 3000);
      const y = clamp(wy - d.dy, -3000, (size.h || 700) + 3000);
      setData((prev) => {
        if (!prev) return prev;
        if (d.id === 'center') return { ...prev, center: { ...prev.center, x, y } };
        return { ...prev, nodes: prev.nodes.map((n) => (n.id === d.id ? { ...n, x, y } : n)) };
      });
    };
    const up = () => { dragRef.current = null; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [size.w, size.h]);

  /* 휠 확대/축소 (커서 기준) — 네이티브 비패시브 리스너 */
  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = svgRef.current?.getBoundingClientRect(); if (!r) return;
      const sx = e.clientX - r.left, sy = e.clientY - r.top;
      setVp((v) => { const f = e.deltaY < 0 ? 1.12 : 1 / 1.12; const k2 = clamp(v.k * f, 0.25, 3.5); return { k: k2, tx: sx - (sx - v.tx) / v.k * k2, ty: sy - (sy - v.ty) / v.k * k2 }; });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const startPan = (e: React.PointerEvent) => {
    if (editing) return;
    const r = svgRef.current?.getBoundingClientRect();
    dragRef.current = { mode: 'pan', sx: e.clientX - (r?.left || 0), sy: e.clientY - (r?.top || 0), tx0: vpRef.current.tx, ty0: vpRef.current.ty };
  };

  const startDrag = (e: React.PointerEvent, id: string) => {
    if (editing) return;
    e.stopPropagation(); e.preventDefault();
    const r = svgRef.current?.getBoundingClientRect();
    const sx = e.clientX - (r?.left || 0), sy = e.clientY - (r?.top || 0);
    const { k, tx, ty } = vpRef.current;
    const wx = (sx - tx) / k, wy = (sy - ty) / k;
    const cur = id === 'center' ? data!.center : data!.nodes.find((n) => n.id === id)!;
    dragRef.current = { mode: 'node', id, dx: wx - cur.x, dy: wy - cur.y };
  };

  const updateText = (id: string, text: string) =>
    setData((prev) => (!prev ? prev : id === 'center'
      ? { ...prev, center: { ...prev.center, text } }
      : { ...prev, nodes: prev.nodes.map((n) => (n.id === id ? { ...n, text } : n)) }));

  const posOf = (d: MData, id: string) => (id === 'center' || !id) ? d.center : (d.nodes.find((n) => n.id === id) || d.center);

  const addChild = (parentId: string) => {
    if (!data) return;
    const isTop = parentId === 'center';
    const parent = isTop ? data.center : data.nodes.find((n) => n.id === parentId);
    if (!parent) return;
    const nodeCat = isTop ? cat : (parent as MNode).cat;
    const sibs = data.nodes.filter((n) => (n.parent || 'center') === parentId);
    const cx = data.center.x, cy = data.center.y;
    let angle: number, R: number;
    if (isTop) { angle = sibs.length * 2.39996; R = 165 + (sibs.length % 4) * 24; }
    else { const base = Math.atan2(parent.y - cy, parent.x - cx) || 0; const k = sibs.length; angle = base + (k % 2 === 0 ? 1 : -1) * Math.ceil((k + 1) / 2) * 0.5; R = 125; }
    const ax = isTop ? cx : parent.x, ay = isTop ? cy : parent.y;
    const x = clamp(ax + R * Math.cos(angle), -2000, (size.w || 1200) + 2000);
    const y = clamp(ay + R * Math.sin(angle), -2000, (size.h || 700) + 2000);
    const id = 'n' + Date.now();
    setData({ ...data, nodes: [...data.nodes, { id, text: '', cat: nodeCat, x, y, parent: parentId }] });
    setEditing(id);
  };

  const delNode = (id: string) => {
    setData((prev) => {
      if (!prev) return prev;
      const toDel = new Set([id]); let changed = true;
      while (changed) { changed = false; for (const n of prev.nodes) { if (!toDel.has(n.id) && toDel.has(n.parent || 'center')) { toDel.add(n.id); changed = true; } } }
      return { ...prev, nodes: prev.nodes.filter((n) => !toDel.has(n.id)) };
    });
    if (editing === id) setEditing(null);
  };

  const reset = () => { if (!confirm("‘나’만 남기고 모두 비울까요? 현재 내용이 사라집니다.")) return; setData(buildEmpty(size.w, size.h)); setVp({ tx: 0, ty: 0, k: 1 }); setEditing(null); };
  const loadExample = () => { if (data && data.nodes.length > 0 && !confirm('예시 마인드맵을 불러올까요? 현재 내용이 대체됩니다.')) return; setData(buildExample(size.w, size.h)); setVp({ tx: 0, ty: 0, k: 1 }); setEditing(null); };

  /* 줌 컨트롤 */
  const zoomBy = (f: number) => setVp((v) => { const k2 = clamp(v.k * f, 0.25, 3.5); const cx = size.w / 2, cy = size.h / 2; return { k: k2, tx: cx - (cx - v.tx) / v.k * k2, ty: cy - (cy - v.ty) / v.k * k2 }; });
  const fitView = () => {
    const root = svgRef.current?.querySelector('#worldRoot') as SVGGraphicsElement | null;
    if (!root) { setVp({ tx: 0, ty: 0, k: 1 }); return; }
    let b: DOMRect; try { b = root.getBBox() as any; } catch { return; }
    if (!b || !b.width) { setVp({ tx: 0, ty: 0, k: 1 }); return; }
    const pad = 80, k = clamp(Math.min((size.w - pad) / b.width, (size.h - pad) / b.height), 0.25, 1.6);
    setVp({ k, tx: (size.w - b.width * k) / 2 - b.x * k, ty: (size.h - b.height * k) / 2 - b.y * k });
  };

  /* HTML 내보내기 */
  const exportHtml = () => {
    const svgEl = svgRef.current; if (!svgEl) return;
    const clone = svgEl.cloneNode(true) as SVGSVGElement;
    clone.querySelectorAll('.no-export').forEach((n) => n.remove());
    const root = clone.querySelector('#worldRoot');
    if (!root) return;
    root.removeAttribute('transform');
    const worldInner = root.innerHTML;
    const title = (data?.center?.text || '나') + ' 마인드맵';
    download(title.replace(/\s+/g, '_') + '.html', buildExportHtml(title, worldInner), 'text/html;charset=utf-8');
  };

  /* 작은 원형 버튼(하위토픽 +, 삭제 ✕) — 화면 전용 */
  const miniBtn = (bx: number, by: number, kind: 'add' | 'del', color: string, onClick: () => void, title: string) => (
    <g className="no-export" transform={`translate(${bx},${by})`} style={{ cursor: 'pointer' }}
      onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <title>{title}</title>
      {kind === 'add'
        ? <><circle r={9} fill={color} stroke="#fff" strokeWidth={1.1} /><path d="M0,-3.6 L0,3.6 M-3.6,0 L3.6,0" stroke="#fff" strokeWidth={1.7} strokeLinecap="round" /></>
        : <><circle r={9} fill="#fff" stroke={color} strokeWidth={1.2} /><path d="M-3,-3 L3,3 M3,-3 L-3,3" stroke={color} strokeWidth={1.5} strokeLinecap="round" /></>}
    </g>
  );

  const renderNode = (n: MNode) => {
    const c = CAT_MAP[n.cat] || CAT_MAP['기타'];
    const g = nodeGeom(n.text);
    return (
      <g key={n.id} transform={`translate(${n.x},${n.y})`} style={{ cursor: 'grab' }}
        onPointerDown={(e) => startDrag(e, n.id)} onDoubleClick={() => setEditing(n.id)}>
        <rect x={-g.w / 2} y={-g.h / 2} width={g.w} height={g.h} rx={12} fill={c.tint} stroke={c.color} strokeWidth={1.8} />
        <circle cx={-g.w / 2 + 11} cy={-g.h / 2 + 11} r={3.5} fill={c.color} />
        <text textAnchor="middle" dominantBaseline="middle" fontFamily={FONT} fontSize={g.fs} fontWeight={g.weight}
          fill="#1A2332" style={{ userSelect: 'none', pointerEvents: 'none' }}>
          {g.lines.map((l, i) => (<tspan key={i} x={0} y={(i - (g.lines.length - 1) / 2) * g.lh}>{l || ' '}</tspan>))}
        </text>
        {miniBtn(g.w / 2 - 1, -g.h / 2 + 1, 'del', c.color, () => delNode(n.id), '삭제 (하위 토픽 포함)')}
        {miniBtn(g.w / 2 - 1, g.h / 2 - 1, 'add', c.color, () => addChild(n.id), '하위 토픽 추가')}
      </g>
    );
  };

  const cg = data ? centerGeom(data.center.text) : null;

  const editOverlay = () => {
    if (!editing || !data) return null;
    const isCenter = editing === 'center';
    const n = isCenter ? data.center : data.nodes.find((x) => x.id === editing);
    if (!n) return null;
    const c = isCenter ? null : (CAT_MAP[(n as MNode).cat] || CAT_MAP['기타']);
    const g = isCenter ? centerGeom(n.text) : nodeGeom(n.text);
    const k = vp.k;
    const scrX = n.x * k + vp.tx, scrY = n.y * k + vp.ty;
    const w = g.w * k, h = g.h * k;
    return (
      <textarea
        autoFocus value={n.text}
        onChange={(e) => updateText(editing, e.target.value)}
        onBlur={() => setEditing(null)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); setEditing(null); } if (e.key === 'Escape') setEditing(null); }}
        placeholder="내용 입력"
        style={{
          position: 'absolute', left: scrX - w / 2, top: scrY - h / 2, width: w, height: h,
          fontFamily: FONT, fontSize: (isCenter ? 20 : 14) * k, fontWeight: isCenter ? 800 : 600,
          lineHeight: ((isCenter ? 26 : 19) * k) + 'px', textAlign: 'center',
          color: isCenter ? '#fff' : '#1A2332',
          background: isCenter ? '#1A2332' : (c ? c.tint : '#fff'),
          border: `2px solid ${isCenter ? '#0047BB' : (c ? c.color : '#999')}`,
          borderRadius: 12 * k, padding: `${6 * k}px ${8 * k}px`, resize: 'none', outline: 'none',
          boxShadow: '0 6px 20px rgba(0,0,0,0.12)', zIndex: 20,
        }}
      />
    );
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col px-4 md:px-8 pt-28 pb-10 overflow-hidden bg-transparent">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-[#0047BB]/30 to-transparent" />

      <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 min-h-0">
        {/* 헤더 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <span className="text-[#0047BB] text-[11px] font-black tracking-[0.25em] uppercase block mb-2">Self-Reflection · 자기 탐색</span>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-[#1A2332] tracking-[-0.03em]">나를 그리는 마인드맵</h1>
            <p className="text-zinc-500 text-sm md:text-base mt-2 max-w-2xl break-keep">
              나를 이해하는 데 필요한 모든 것을 추가하고, 하위 토픽으로 가지를 뻗으세요. 휠로 확대/축소, 빈 곳을 끌어 이동할 수 있고, HTML로 내보내면 어디서든 확대·축소하며 볼 수 있습니다.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={onResumeClick} className="px-5 py-2.5 rounded-full bg-[#0047BB] text-white text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-[#003399] transition shadow-lg shadow-[#0047BB]/20">이력서 <ChevronRight className="w-4 h-4" /></button>
            <button onClick={onPortfolioClick} className="px-5 py-2.5 rounded-full bg-white border border-zinc-200 text-zinc-600 text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:text-[#1A2332] hover:border-[#0047BB]/30 transition">포트폴리오 <ArrowUpRight className="w-4 h-4" /></button>
          </div>
        </div>

        {/* 툴바 */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {CATEGORIES.map((c) => (
            <button key={c.key} onClick={() => setCat(c.key)}
              style={{ borderColor: c.color, color: cat === c.key ? '#fff' : c.color, background: cat === c.key ? c.color : '#fff' }}
              className="px-3 py-1.5 rounded-full text-xs font-bold border transition">{c.key}</button>
          ))}
          <button onClick={() => addChild('center')} className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#1A2332] text-white flex items-center gap-1 hover:bg-black transition"><Plus className="w-3.5 h-3.5" /> 주제 추가</button>
          <div className="flex-1 min-w-[8px]" />
          <button onClick={exportHtml} className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#0047BB] text-white flex items-center gap-1.5 hover:bg-[#003399] transition shadow-md shadow-[#0047BB]/20"><Download className="w-3.5 h-3.5" /> HTML 내보내기</button>
          <button onClick={loadExample} className="px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-zinc-200 text-zinc-600 flex items-center gap-1 hover:text-[#0047BB] hover:border-[#0047BB]/30 transition"><Sparkles className="w-3.5 h-3.5" /> 예시</button>
          <button onClick={reset} className="px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-zinc-200 text-zinc-500 flex items-center gap-1 hover:text-zinc-800 transition"><RotateCcw className="w-3.5 h-3.5" /> 초기화</button>
        </div>

        {/* 캔버스 */}
        <div ref={wrapRef} className="relative flex-1 min-h-[440px] rounded-2xl border border-black/10 overflow-hidden shadow-sm" style={{ background: '#F4F2EC' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,71,187,0.06) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />

          {data && size.w > 0 && cg && (
            <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`}
              className="absolute inset-0" style={{ touchAction: 'none', cursor: 'grab' }} onPointerDown={startPan}>
              <rect x={0} y={0} width={size.w} height={size.h} fill="#F4F2EC" />
              <g id="worldRoot" transform={`translate(${vp.tx},${vp.ty}) scale(${vp.k})`}>
                {data.nodes.map((n) => {
                  const c = CAT_MAP[n.cat] || CAT_MAP['기타'];
                  const p = posOf(data, n.parent || 'center');
                  return <line key={'l' + n.id} x1={p.x} y1={p.y} x2={n.x} y2={n.y} stroke={c.color} strokeOpacity={0.42} strokeWidth={2} />;
                })}
                {data.nodes.map(renderNode)}
                <g transform={`translate(${data.center.x},${data.center.y})`} style={{ cursor: 'grab' }}
                  onPointerDown={(e) => startDrag(e, 'center')} onDoubleClick={() => setEditing('center')}>
                  <rect x={-cg.w / 2} y={-cg.h / 2} width={cg.w} height={cg.h} rx={14} fill="#1A2332" stroke="#0047BB" strokeWidth={2.5} />
                  <text textAnchor="middle" dominantBaseline="middle" fontFamily={FONT} fontSize={cg.fs} fontWeight={cg.weight}
                    fill="#ffffff" style={{ userSelect: 'none', pointerEvents: 'none' }}>
                    {cg.lines.map((l, i) => (<tspan key={i} x={0} y={(i - (cg.lines.length - 1) / 2) * cg.lh}>{l || ' '}</tspan>))}
                  </text>
                  {miniBtn(cg.w / 2 - 1, cg.h / 2 - 1, 'add', '#0047BB', () => addChild('center'), '주제(가지) 추가')}
                </g>
              </g>
            </svg>
          )}

          {editOverlay()}

          {/* 줌 컨트롤 */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/95 border border-black/10 rounded-full px-1.5 py-1 shadow-sm" style={{ zIndex: 15 }}>
            <button onClick={() => zoomBy(1 / 1.2)} className="w-7 h-7 rounded-full hover:bg-zinc-100 text-zinc-600 text-base leading-none" title="축소">－</button>
            <span className="font-mono text-[11px] text-zinc-500 min-w-[42px] text-center">{Math.round(vp.k * 100)}%</span>
            <button onClick={() => zoomBy(1.2)} className="w-7 h-7 rounded-full hover:bg-zinc-100 text-zinc-600 text-base leading-none" title="확대">＋</button>
            <button onClick={fitView} className="px-2.5 h-7 rounded-full hover:bg-zinc-100 text-zinc-600 text-[11px] font-bold" title="전체 보기">맞춤</button>
          </div>

          {data && data.nodes.length === 0 && (
            <div className="absolute inset-0 flex items-end justify-center pb-10 pointer-events-none">
              <span className="text-zinc-400 text-sm"><b className="text-zinc-500">‘주제 추가’</b> 또는 <b className="text-zinc-500">‘예시’</b>로 시작하세요.</span>
            </div>
          )}
        </div>

        <p className="text-[11px] text-zinc-400 mt-2">
          휠 <b className="text-zinc-500">확대/축소</b> · 빈 곳 <b className="text-zinc-500">드래그 이동</b> · 노드 <b className="text-zinc-500">더블클릭</b> 편집 · <b className="text-zinc-500">＋</b> 하위 토픽 · <b className="text-zinc-500">✕</b> 삭제 · 자동 저장
        </p>
      </div>
    </section>
  );
};
