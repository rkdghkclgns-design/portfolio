import type { Project } from '../types';

// ⚠️ 플레이스홀더 템플릿입니다. 본인 프로젝트로 교체하세요.
// image / gallery: public/images 폴더에 이미지를 넣고 "./images/파일명" 으로 경로를 지정하세요.
export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "프로젝트 1 (장르)",
    roles: ["담당 역할"],
    description: "프로젝트를 한 문장으로 요약하세요. 어떤 게임이고 무엇을 맡았는지 적습니다.",
    tags: ["태그1", "태그2", "태그3"],
    image: "",
    gallery: [],
    color: "from-zinc-500/20 to-zinc-400/20",
    status: "출시 / 미출시",
    content: `# 프로젝트 1 기획서

## 1. 기획 개요
프로젝트의 목표와 핵심 컨셉을 작성하세요.

## 2. 주요 설계 내용
### 2.1 항목
- 구체적인 기여와 설계 내용을 작성하세요.

### 2.2 항목
- 수치·데이터 기반 성과가 있으면 함께 제시하세요.`
  },
  {
    id: 2,
    title: "프로젝트 2 (장르)",
    roles: ["담당 역할"],
    description: "프로젝트를 한 문장으로 요약하세요.",
    tags: ["태그1", "태그2"],
    image: "",
    gallery: [],
    color: "from-emerald-500/20 to-teal-500/20",
    status: "미출시",
    content: `# 프로젝트 2 기획서

## 1. 코어 루프 설계
핵심 반복 경험을 어떻게 설계했는지 작성하세요.

## 2. 주요 시스템
- 담당한 시스템을 항목별로 정리하세요.`
  },
  {
    id: 3,
    title: "프로젝트 3 (장르)",
    roles: ["담당 역할"],
    description: "프로젝트를 한 문장으로 요약하세요.",
    tags: ["태그1", "태그2"],
    image: "",
    gallery: [],
    color: "from-orange-500/20 to-zinc-500/20",
    status: "프로토타입",
    content: `# 프로젝트 3 기획서

## 1. 기획 의도
무엇을 검증하고자 했는지 작성하세요.

## 2. 핵심 경험 설계
- 핵심 재미 요소와 설계 의도를 정리하세요.`
  }
];
