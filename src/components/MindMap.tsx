import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Plus, Download, RotateCcw, ChevronRight, ArrowUpRight } from 'lucide-react';

/**
 * MindMap — 자기 성찰용 마인드맵 캔버스 (홈 첫 화면)
 * - 스킬/장점/단점/가치관/목표 등 카테고리별 노드 추가
 * - 노드마다 + 버튼으로 하위 토픽(자식) 추가 (가지 색 상속, 다단계 가능)
 * - 드래그 이동, 더블클릭 편집, ✕ 삭제(하위 토픽 포함)
 * - localStorage 자동 저장
 * - PNG 내보내기 (순수 SVG → Canvas, 외부 의존성 없음)
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

/* ---- 텍스트 측정/줄바꿈 (정확한 박스 크기 산출) ---- */
let _mctx: CanvasRenderingContext2D | null = null;
function mctx() {
  if (!_mctx) _mctx = document.createElement('canvas').getContext('2d');
  return _mctx as CanvasRenderingContext2D;
}
function wrapByWidth(text: string, font: string, maxW: number): string[] {
  const ctx = mctx();
  ctx.font = font;
  const chars = Array.from(text || '');
  const lines: string[] = [];
  let line = '';
  for (const ch of chars) {
    if (ch === '\n') { lines.push(line); line = ''; continue; }
    const test = line + ch;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = ch; }
    else line = test;
  }
  lines.push(line);
  return lines.length ? lines : [''];
}
function lineW(line: string, font: string) { const ctx = mctx(); ctx.font = font; return ctx.measureText(line).width; }

function geomOf(text: string, opts: { fs: number; weight: number; lh: number; padX: number; padY: number; maxW: number; minW: number }) {
  const font = `${opts.weight} ${opts.fs}px ${FONT}`;
  const lines = wrapByWidth(text && text.trim() ? text : '내용', font, opts.maxW);
  const textW = Math.max(...lines.map((l) => lineW(l, font)), 0);
  const w = Math.max(opts.minW, Math.ceil(textW) + opts.padX * 2);
  const h = lines.length * opts.lh + opts.padY * 2;
  return { w, h, lines, lh: opts.lh, fs: opts.fs, weight: opts.weight };
}
const nodeGeom = (t: string) => geomOf(t, { fs: 14, weight: 600, lh: 19, padX: 14, padY: 9, maxW: 200, minW: 64 });
const centerGeom = (t: string) => geomOf(t, { fs: 20, weight: 800, lh: 26, padX: 20, padY: 13, maxW: 180, minW: 90 });

function seed(w: number, h: number): MData {
  const cx = w / 2, cy = h / 2;
  const ex: [string, string][] = [
    ['기획 역량', '스킬'], ['끈기', '장점'], ['완벽주의', '단점'], ['성장', '가치관'], ['게임 출시', '목표'],
  ];
  const nodes: MNode[] = ex.map(([text, cat], i) => {
    const a = i * 2.39996; const R = 175;
    return { id: 'seed' + i, text, cat, parent: 'center', x: clamp(cx + R * Math.cos(a), 70, w - 70), y: clamp(cy + R * Math.sin(a), 56, h - 56) };
  });
  return { center: { text: '나', x: cx, y: cy }, nodes };
}

export const MindMap = ({ onResumeClick, onPortfolioClick }: MindMapProps) => {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [data, setData] = useState<MData | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [cat, setCat] = useState(CATEGORIES[0].key);
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);

  /* 컨테이너 크기 측정 */
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => { const r = el.getBoundingClientRect(); setSize({ w: Math.round(r.width), h: Math.round(r.height) }); };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* 데이터 초기화 (저장본 우선, 구버전 호환: parent 없으면 center) */
  useEffect(() => {
    if (data || size.w === 0) return;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && d.center && Array.isArray(d.nodes)) {
          d.nodes = d.nodes.map((n: any) => ({ ...n, parent: n.parent || 'center' }));
          setData(d); return;
        }
      }
    } catch { /* ignore */ }
    setData(seed(size.w, size.h));
  }, [size, data]);

  /* 자동 저장 */
  useEffect(() => { if (data) { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ } } }, [data]);

  /* 드래그 (전역 리스너, dragRef로 게이트) */
  useEffect(() => {
    const toSvg = (e: PointerEvent) => {
      const r = svgRef.current?.getBoundingClientRect();
      return { x: e.clientX - (r?.left || 0), y: e.clientY - (r?.top || 0) };
    };
    const move = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const p = toSvg(e);
      const x = clamp(p.x - d.dx, 50, size.w - 50);
      const y = clamp(p.y - d.dy, 40, size.h - 40);
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

  const startDrag = (e: React.PointerEvent, id: string) => {
    if (editing) return;
    e.preventDefault();
    const r = svgRef.current?.getBoundingClientRect();
    const px = e.clientX - (r?.left || 0), py = e.clientY - (r?.top || 0);
    const cur = id === 'center' ? data!.center : data!.nodes.find((n) => n.id === id)!;
    dragRef.current = { id, dx: px - cur.x, dy: py - cur.y };
  };

  const updateText = (id: string, text: string) =>
    setData((prev) => (!prev ? prev : id === 'center'
      ? { ...prev, center: { ...prev.center, text } }
      : { ...prev, nodes: prev.nodes.map((n) => (n.id === id ? { ...n, text } : n)) }));

  const posOf = (d: MData, id: string) => {
    if (id === 'center' || !id) return d.center;
    return d.nodes.find((n) => n.id === id) || d.center;
  };

  /* 노드/하위 토픽 추가. parentId 'center'면 메인 가지(선택 카테고리), 아니면 부모 색 상속 */
  const addChild = (parentId: string) => {
    if (!data) return;
    const isTop = parentId === 'center';
    const parent = isTop ? data.center : data.nodes.find((n) => n.id === parentId);
    if (!parent) return;
    const nodeCat = isTop ? cat : (parent as MNode).cat;
    const sibs = data.nodes.filter((n) => (n.parent || 'center') === parentId);
    const cx = data.center.x, cy = data.center.y;
    let angle: number, R: number;
    if (isTop) {
      angle = sibs.length * 2.39996; R = 165 + (sibs.length % 4) * 24;
    } else {
      const base = Math.atan2(parent.y - cy, parent.x - cx) || 0;
      const k = sibs.length;
      angle = base + (k % 2 === 0 ? 1 : -1) * Math.ceil((k + 1) / 2) * 0.5;
      R = 125;
    }
    const ax = isTop ? cx : parent.x;
    const ay = isTop ? cy : parent.y;
    const x = clamp(ax + R * Math.cos(angle), 70, size.w - 70);
    const y = clamp(ay + R * Math.sin(angle), 56, size.h - 56);
    const id = 'n' + Date.now();
    setData({ ...data, nodes: [...data.nodes, { id, text: '', cat: nodeCat, x, y, parent: parentId }] });
    setEditing(id);
  };

  /* 노드 + 모든 하위 토픽 삭제 */
  const delNode = (id: string) => {
    setData((prev) => {
      if (!prev) return prev;
      const toDel = new Set([id]);
      let changed = true;
      while (changed) {
        changed = false;
        for (const n of prev.nodes) {
          if (!toDel.has(n.id) && toDel.has(n.parent || 'center')) { toDel.add(n.id); changed = true; }
        }
      }
      return { ...prev, nodes: prev.nodes.filter((n) => !toDel.has(n.id)) };
    });
    if (editing === id) setEditing(null);
  };

  const reset = () => {
    if (!confirm('마인드맵을 초기화할까요? 현재 내용이 모두 사라집니다.')) return;
    setData(seed(size.w, size.h));
    setEditing(null);
  };

  /* PNG 내보내기 (SVG → Canvas) */
  const exportPng = () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const clone = svgEl.cloneNode(true) as SVGSVGElement;
    clone.querySelectorAll('.no-export').forEach((n) => n.remove());
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', String(size.w));
    clone.setAttribute('height', String(size.h));
    const xml = new XMLSerializer().serializeToString(clone);
    const url = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(xml)));
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = size.w * scale; canvas.height = size.h * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#F4F2EC';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = link;
        a.download = ((data?.center?.text || '나').replace(/\s+/g, '_')) + '_마인드맵.png';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(link), 1000);
      }, 'image/png');
    };
    img.onerror = () => alert('PNG 내보내기에 실패했습니다. 다시 시도해 주세요.');
    img.src = url;
  };

  /* 작은 원형 버튼 (하위토픽 +, 삭제 ✕) — 화면 전용 */
  const miniBtn = (
    cx: number, cy: number, kind: 'add' | 'del', color: string, onClick: () => void, title: string,
  ) => (
    <g className="no-export" transform={`translate(${cx},${cy})`} style={{ cursor: 'pointer' }}
      onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <title>{title}</title>
      {kind === 'add'
        ? <>
          <circle r={9} fill={color} stroke="#fff" strokeWidth={1.1} />
          <path d="M0,-3.6 L0,3.6 M-3.6,0 L3.6,0" stroke="#fff" strokeWidth={1.7} strokeLinecap="round" />
        </>
        : <>
          <circle r={9} fill="#fff" stroke={color} strokeWidth={1.2} />
          <path d="M-3,-3 L3,3 M3,-3 L-3,3" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        </>}
    </g>
  );

  /* 노드 렌더 */
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

  /* 편집 오버레이 */
  const editOverlay = () => {
    if (!editing || !data) return null;
    const isCenter = editing === 'center';
    const n = isCenter ? data.center : data.nodes.find((x) => x.id === editing);
    if (!n) return null;
    const c = isCenter ? null : (CAT_MAP[(n as MNode).cat] || CAT_MAP['기타']);
    const g = isCenter ? centerGeom(n.text) : nodeGeom(n.text);
    return (
      <textarea
        autoFocus
        value={n.text}
        onChange={(e) => updateText(editing, e.target.value)}
        onBlur={() => setEditing(null)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); setEditing(null); }
          if (e.key === 'Escape') setEditing(null);
        }}
        placeholder="내용 입력"
        style={{
          position: 'absolute', left: n.x - g.w / 2, top: n.y - g.h / 2, width: g.w, height: g.h,
          fontFamily: FONT, fontSize: isCenter ? 20 : 14, fontWeight: isCenter ? 800 : 600,
          lineHeight: (isCenter ? 26 : 19) + 'px', textAlign: 'center',
          color: isCenter ? '#fff' : '#1A2332',
          background: isCenter ? '#1A2332' : (c ? c.tint : '#fff'),
          border: `2px solid ${isCenter ? '#0047BB' : (c ? c.color : '#999')}`,
          borderRadius: 12, padding: '6px 8px', resize: 'none', outline: 'none',
          boxShadow: '0 6px 20px rgba(0,0,0,0.12)', zIndex: 20,
        }}
      />
    );
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col px-4 md:px-8 pt-28 pb-10 overflow-hidden bg-transparent border-b border-black/10">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-[#0047BB]/30 to-transparent" />

      <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 min-h-0">
        {/* 헤더 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <span className="text-[#0047BB] text-[11px] font-black tracking-[0.25em] uppercase block mb-2">Self-Reflection · 자기 탐색</span>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-[#1A2332] tracking-[-0.03em]">나를 그리는 마인드맵</h1>
            <p className="text-zinc-500 text-sm md:text-base mt-2 max-w-2xl break-keep">
              스킬·장점·단점·가치관·목표 등 나를 이해하는 데 필요한 모든 것을 추가하고, 하위 토픽으로 가지를 뻗은 뒤 PNG로 내보내세요.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={onResumeClick}
              className="px-5 py-2.5 rounded-full bg-[#0047BB] text-white text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-[#003399] transition shadow-lg shadow-[#0047BB]/20">
              이력서 <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={onPortfolioClick}
              className="px-5 py-2.5 rounded-full bg-white border border-zinc-200 text-zinc-600 text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:text-[#1A2332] hover:border-[#0047BB]/30 transition">
              포트폴리오 <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 툴바 */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {CATEGORIES.map((c) => (
            <button key={c.key} onClick={() => setCat(c.key)}
              style={{ borderColor: c.color, color: cat === c.key ? '#fff' : c.color, background: cat === c.key ? c.color : '#fff' }}
              className="px-3 py-1.5 rounded-full text-xs font-bold border transition">
              {c.key}
            </button>
          ))}
          <button onClick={() => addChild('center')}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#1A2332] text-white flex items-center gap-1 hover:bg-black transition">
            <Plus className="w-3.5 h-3.5" /> 주제 추가
          </button>
          <div className="flex-1 min-w-[8px]" />
          <button onClick={exportPng}
            className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#0047BB] text-white flex items-center gap-1.5 hover:bg-[#003399] transition shadow-md shadow-[#0047BB]/20">
            <Download className="w-3.5 h-3.5" /> PNG 내보내기
          </button>
          <button onClick={reset}
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-zinc-200 text-zinc-500 flex items-center gap-1 hover:text-zinc-800 transition">
            <RotateCcw className="w-3.5 h-3.5" /> 초기화
          </button>
        </div>

        {/* 캔버스 */}
        <div ref={wrapRef} className="relative flex-1 min-h-[440px] rounded-2xl border border-black/10 overflow-hidden shadow-sm" style={{ background: '#F4F2EC' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,71,187,0.06) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />

          {data && size.w > 0 && cg && (
            <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" width={size.w} height={size.h}
              viewBox={`0 0 ${size.w} ${size.h}`} className="absolute inset-0" style={{ touchAction: 'none' }}>
              {/* 배경 (PNG 포함) */}
              <rect x={0} y={0} width={size.w} height={size.h} fill="#F4F2EC" />
              {/* 연결선 (부모 → 자식) */}
              {data.nodes.map((n) => {
                const c = CAT_MAP[n.cat] || CAT_MAP['기타'];
                const p = posOf(data, n.parent || 'center');
                return <line key={'l' + n.id} x1={p.x} y1={p.y} x2={n.x} y2={n.y} stroke={c.color} strokeOpacity={0.42} strokeWidth={2} />;
              })}
              {/* 노드 */}
              {data.nodes.map(renderNode)}
              {/* 중심 노드 */}
              <g transform={`translate(${data.center.x},${data.center.y})`} style={{ cursor: 'grab' }}
                onPointerDown={(e) => startDrag(e, 'center')} onDoubleClick={() => setEditing('center')}>
                <rect x={-cg.w / 2} y={-cg.h / 2} width={cg.w} height={cg.h} rx={14} fill="#1A2332" stroke="#0047BB" strokeWidth={2.5} />
                <text textAnchor="middle" dominantBaseline="middle" fontFamily={FONT} fontSize={cg.fs} fontWeight={cg.weight}
                  fill="#ffffff" style={{ userSelect: 'none', pointerEvents: 'none' }}>
                  {cg.lines.map((l, i) => (<tspan key={i} x={0} y={(i - (cg.lines.length - 1) / 2) * cg.lh}>{l || ' '}</tspan>))}
                </text>
                {miniBtn(cg.w / 2 - 1, cg.h / 2 - 1, 'add', '#0047BB', () => addChild('center'), '주제(가지) 추가')}
              </g>
            </svg>
          )}

          {editOverlay()}

          {data && data.nodes.length === 0 && (
            <div className="absolute inset-0 flex items-end justify-center pb-10 pointer-events-none">
              <span className="text-zinc-400 text-sm">카테고리를 고르고 <b className="text-zinc-500">‘주제 추가’</b>를 눌러 시작하세요.</span>
            </div>
          )}
        </div>

        <p className="text-[11px] text-zinc-400 mt-2">
          노드 <b className="text-zinc-500">더블클릭</b> 편집 · <b className="text-zinc-500">드래그</b> 이동 · <b className="text-zinc-500">＋</b> 하위 토픽 · <b className="text-zinc-500">✕</b> 삭제 · 내용은 이 브라우저에 자동 저장됩니다.
        </p>
      </div>
    </section>
  );
};
