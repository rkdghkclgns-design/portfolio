# 게임 기획자 포트폴리오 (개인 템플릿)

React + Vite + Tailwind 기반의 1인 포트폴리오 웹사이트입니다.
모든 콘텐츠는 **플레이스홀더(예: 홍길동)** 로 비워져 있으니, 본인 정보로 채워 넣으면 됩니다.

> 디자인/구조는 공개 오픈소스 포트폴리오([chokyunghwan98/game-designer-portfolio](https://github.com/chokyunghwan98/game-designer-portfolio))를
> 기반으로 하며, 원저작자의 개인정보·콘텐츠·이미지는 모두 제거했습니다.
> 공개 배포 시 원 디자인에 대한 **출처 표기(크레딧)**를 권장합니다.

---

## 실행 방법

**필요 조건:** Node.js 18+

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 → http://localhost:3000
npm run build    # 배포용 빌드 (dist/)
npm run preview  # 빌드 결과 미리보기
```

---

## 어디를 고치면 되나요? (내 정보로 채우기)

| 내용 | 파일 |
|------|------|
| 이름 / 직무 / 연락처 / 요약 / 학력 / 경력 / 자격증 / 병역 | `src/data/resume.ts` |
| 자기소개서(문항별 소제목·로그라인·도입·본문·마무리) | `src/data/resume.ts` 의 `selfIntroductions` |
| 프로젝트(포트폴리오 카드) | `src/data/projects.ts` |
| 핵심 역량 / 스킬 | `src/data/skills.ts` |
| 게임 플레이 이력(PC/모바일/콘솔) | `src/data/games/pc.ts`, `mobile.ts`, `console.ts` |
| 메인 히어로 문구 / 소개(About) 문구 | `src/App.tsx` 의 `heroContent`, `aboutContent` |
| 플레이 이력 대표 카드 3종 | `src/components/PlayHistory.tsx` 의 `DASHBOARD_HIGHLIGHTS` |
| 상단 로고 이름 | `src/components/Navbar.tsx` |
| 하단 푸터 이름 | `src/components/Footer.tsx` |
| 문의 이메일 | `src/components/Contact.tsx` |
| 브라우저 탭 제목 | `index.html` |

### 이미지 넣기
- 프로필/프로젝트/게임 이미지는 `public/images/` 폴더에 넣고,
  데이터에서 `"./images/파일명.jpg"` 형식으로 경로를 지정하세요.
- 비워두면(`image: ""`) 프로필은 임시 이미지가, 프로젝트/게임은 회색 박스가 표시됩니다.

### 관리자(편집) 모드
- 우상단 자물쇠 아이콘 → 비밀번호 입력 시 화면에서 직접 텍스트 편집이 가능합니다.
- 기본 비밀번호는 `src/components/Navbar.tsx` 의 `0000` 입니다. **반드시 변경하세요.**
- 편집 내용을 영구 저장하려면 본인 Supabase 연결이 필요합니다(아래).

---

## (선택) Supabase 연동 — 편집 내용 저장
연동하지 않아도 사이트는 정상 동작합니다(로컬 데이터만 사용).
편집 모드의 저장 기능을 쓰려면 본인 프로젝트를 연결하세요.

1. `.env.local` 파일을 만들고 아래 값을 채웁니다.
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
2. `src/hooks/useEditableContent.ts` 의 주석 처리된 `loadFromSupabase` 로드 로직을 활성화합니다.

---

## 배포 (GitHub Pages 등)
- `vite.config.ts` 의 `base` 값을 본인 저장소 이름에 맞게 변경하세요.
  - 예: 저장소가 `my-portfolio` 라면 `base: '/my-portfolio/'`
  - 루트 도메인/Vercel/Netlify 배포 시엔 `base: '/'`
- `.github/workflows/` 의 GitHub Actions로 자동 배포할 수 있습니다.
