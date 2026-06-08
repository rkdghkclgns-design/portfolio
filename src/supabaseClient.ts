import { createClient } from '@supabase/supabase-js';

// 본인 Supabase 프로젝트를 연결하려면 .env.local 에 아래 값을 채우세요.
//   VITE_SUPABASE_URL=...
//   VITE_SUPABASE_ANON_KEY=...
// 비워두면 백엔드 동기화(관리자 편집 저장)는 비활성화되고, 화면은 로컬 데이터(src/data)만 사용합니다.
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
