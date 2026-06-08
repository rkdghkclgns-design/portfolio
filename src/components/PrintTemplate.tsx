/**
 * PrintTemplate.tsx
 * window.print() 전용 A4 레이아웃 컴포넌트
 * - @media print CSS와 완전히 분리된 화면-숨김 / 인쇄-표시 구조
 * - Tailwind 클래스 사용 가능 (브라우저 네이티브 렌더러는 oklch 지원)
 * - 화면에서는 display:none, 인쇄 시에만 표시
 */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ResumeData } from '../types';

interface PrintTemplateProps {
  data: ResumeData;
}

// 인라인 마크다운 볼드 렌더러 (안전하게 ** ** 처리)
function InlineMd({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} style={{ color: '#0047BB' }}>{p.slice(2, -2)}</strong>
          : p
      )}
    </>
  );
}

// 단락 단위 렌더러
function Paragraphs({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <>
      {text.split('\n\n').map((p, i) => (
        <p key={i} style={{ margin: '0 0 8px', lineHeight: 1.75, fontSize: '11px', color: '#333F48', wordBreak: 'keep-all' }}>
          <InlineMd text={p} />
        </p>
      ))}
    </>
  );
}

// 자소서(Cover Letter) 전용 대형 텍스트 단락 렌더러
function CoverParagraphs({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <>
      {text.split('\n\n').map((p, i) => (
        <p key={i} style={{ margin: '0 0 16px', lineHeight: 2, fontSize: '14px', color: '#1A1A1A', wordBreak: 'keep-all' }}>
          <InlineMd text={p} />
        </p>
      ))}
    </>
  );
}

/* ── Page 1: 이력서 ────────────────────────────────────────────── */
const ResumePrintPage: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="pdf-page print-page-resume">
    {/* 전체 컨테이너: 외부 패딩에 의존 */}
    <div style={{ flex: 1, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* ── Profile Card ── */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)', padding: '18px 22px', display: 'flex', gap: '18px', alignItems: 'flex-start', flexShrink: 0 }}>
        {/* 사진 */}
        <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.07)', flexShrink: 0 }}>
          <img src={data.image || "https://picsum.photos/seed/profile/400/400"} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) opacity(0.8)' }} />
        </div>
        {/* 이름/연락처 */}
        <div style={{ width: '150px', flexShrink: 0 }}>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#1A1A1A', margin: '0 0 2px', letterSpacing: '-0.5px' }}>{data.name}</h1>
          <p style={{ fontSize: '9px', fontWeight: 700, color: '#0047BB', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>{data.role}</p>
          <div style={{ fontSize: '10px', color: '#71717A', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>✉ {data.email}</span>
            {data.birthDate && <span>🗓 {data.birthDate}</span>}
            <span>☎ {data.phone}</span>
          </div>
        </div>
        {/* 구분선 */}
        <div style={{ width: '1px', background: 'rgba(0,0,0,0.06)', alignSelf: 'stretch', margin: '0 4px', flexShrink: 0 }} />
        {/* 한줄소개 + 툴 */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '8px', fontWeight: 700, color: '#A1A1AA', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>한줄 소개</div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A1A', lineHeight: 1.5, wordBreak: 'keep-all', marginBottom: '12px' }}>
            <InlineMd text={data.summary.replace(/\n/g, ' ')} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {(data.tools || []).map((t, i) => (
              <span key={i} style={{ fontSize: '9.5px', fontWeight: 700, padding: '3px 9px', background: '#FAFAFA', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '5px', color: '#52525B' }}>
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '10px', flex: 1, minHeight: 0 }}>
        {/* 좌: 학력 + 자격증 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* 학력 */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)', padding: '14px 16px', flex: 1 }}>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#0047BB' }}>◎</span> 학력 및 교육
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.education.map((edu, i) => (
                <div key={i} style={{ paddingLeft: '10px', borderLeft: '2px solid rgba(0,0,0,0.08)', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-4px', top: '4px', width: '7px', height: '7px', background: '#D4D4D8', borderRadius: '1px' }} />
                  <div style={{ fontWeight: 700, fontSize: '10.5px', color: '#1A1A1A', lineHeight: 1.3 }}>{edu.title}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '8.5px', color: '#A1A1AA', margin: '1px 0' }}>{edu.period}</div>
                  <div style={{ fontSize: '9px', color: '#71717A', marginBottom: '3px', lineHeight: 1.4 }}>{edu.description}</div>
                  {edu.details.length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: '10px', fontSize: '8.5px', color: '#71717A', lineHeight: 1.5 }}>
                      {edu.details.map((d, j) => <li key={j} style={{ marginBottom: '1px' }}>{d}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 자격증 */}
          {data.certificates && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)', padding: '14px 16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#0047BB' }}>◎</span> 자격증
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {data.certificates.map((cert, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: '#FAFAFA', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <span style={{ fontWeight: 700, fontSize: '10.5px', color: '#1A1A1A' }}>{cert.name}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '8px', color: '#A1A1AA' }}>취득 연도</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '9.5px', fontWeight: 700, color: '#0047BB' }}>{cert.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 우: 프로젝트 경험 */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)', padding: '14px 16px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#0047BB' }}>◎</span> 프로젝트 경험
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {data.experience.map((exp, i) => (
              <div key={i} style={{ paddingLeft: '16px', borderLeft: '2px solid rgba(0,71,187,0.2)', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-6px', top: '4px', width: '11px', height: '11px', borderRadius: '50%', background: '#0047BB', border: '2px solid white' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
                  <h4 style={{ fontWeight: 800, fontSize: '12px', color: '#1A1A1A', margin: 0, lineHeight: 1.3 }}>{exp.title}</h4>
                  <span style={{ fontFamily: 'monospace', fontSize: '8.5px', color: '#A1A1AA', background: '#F4F4F5', padding: '2px 6px', borderRadius: '20px', flexShrink: 0, marginLeft: '8px' }}>{exp.period}</span>
                </div>
                <div style={{ fontSize: '9.5px', fontWeight: 600, color: '#0047BB', padding: '3px 8px', background: 'rgba(0,71,187,0.06)', border: '1px solid rgba(0,71,187,0.15)', borderRadius: '5px', display: 'inline-block', marginBottom: '6px' }}>
                  {exp.description}
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {exp.details.map((d, j) => (
                    <li key={j} style={{ paddingLeft: '9px', position: 'relative', fontSize: '9.5px', color: '#52525B', marginBottom: '3px', lineHeight: 1.5 }}>
                      <span style={{ position: 'absolute', left: 0, top: '5px', width: '3px', height: '3px', background: '#D4D4D8', borderRadius: '50%' }} />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ── Pages 2-4: 자기소개서 ────────────────────────────────────── */
type IntroItem = NonNullable<ResumeData['selfIntroductions']>[0];

const CoverPrintPage: React.FC<{ intro: IntroItem; idx: number; data: ResumeData }> = ({ intro, idx, data }) => {
  const number = String(idx + 1).padStart(2, '0');

  return (
    <div className="pdf-page print-page-cover">
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '15px' }}>

        {/* ── 헤더: 페이지 번호 + 로그라인 ── */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)', padding: '24px 30px', display: 'flex', gap: '20px', alignItems: 'flex-start', flexShrink: 0 }}>
          <div style={{ padding: '8px 4px', width: '40px', borderRadius: '10px', border: '2px solid rgba(0,71,187,0.2)', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontWeight: 900, fontSize: '18px', color: '#0047BB', flexShrink: 0 }}>
            <span style={{ lineHeight: 1 }}>0</span>
            <span style={{ lineHeight: 1 }}>{idx + 1}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#0047BB', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
              {intro.navTitle || 'SELF INTRODUCTION'}
            </div>
            <div>
              {intro.logline.trim().split(/\s*\n\s*/).map((line, i) => {
                const isBold = line.startsWith('**') && line.endsWith('**');
                return (
                  <div key={i} style={{ fontSize: '32px', fontWeight: 900, lineHeight: 1.25, color: isBold ? '#0047BB' : '#1A1A1A', letterSpacing: '-0.6px', wordBreak: 'keep-all' }}>
                    {isBold ? line.slice(2, -2) : line}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── 2컬럼 그리드 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '15px', flex: 1, minHeight: 0 }}>

          {/* 좌: Highlights + Pull Quote */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {intro.highlights && intro.highlights.length > 0 && (
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#A1A1AA', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>KEY HIGHLIGHTS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {intro.highlights.map((hl, j) => (
                    <div key={j} style={{ background: '#F8F9FF', border: '1px solid rgba(0,71,187,0.15)', borderRadius: '10px', padding: '12px 16px' }}>
                      <div style={{ fontWeight: 800, fontSize: '12px', color: '#0047BB', marginBottom: '4px' }}>{hl.bold}</div>
                      <div style={{ fontSize: '11px', color: '#71717A', lineHeight: 1.5, wordBreak: 'keep-all' }}>{hl.em}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {intro.pullQuote && (
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#A1A1AA', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px' }}>CORE PHILOSOPHY</div>
                <div style={{ borderLeft: '4px solid #0047BB', paddingLeft: '24px' }}>
                  <span style={{ fontWeight: 700, fontSize: '17px', color: '#0047BB', lineHeight: 1.6 }}>{intro.pullQuote}</span>
                </div>
              </div>
            )}

            {/* 하단: 페이지 서명 */}
            <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid rgba(0,0,0,0.05)', fontSize: '10px', color: '#A1A1AA' }}>
              {data.name} / {data.role}
            </div>
          </div>

          {/* 우: Narrative */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)', padding: '24px 30px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#A1A1AA', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>NARRATIVE &amp; INSIGHT</div>

            <div style={{ flex: 1 }}>
              <CoverParagraphs text={intro.hook} />

              {intro.body && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <CoverParagraphs text={intro.body} />
                </div>
              )}

              {intro.closing && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <CoverParagraphs text={intro.closing} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── MAIN EXPORT ─────────────────────────────────────────────── */
export const PrintTemplate: React.FC<PrintTemplateProps> = ({ data }) => (
  <div id="print-root" aria-hidden="true">
    <ResumePrintPage data={data} />
    {(data.selfIntroductions || []).map((intro, i) => (
      <CoverPrintPage key={i} intro={intro} idx={i} data={data} />
    ))}
  </div>
);
