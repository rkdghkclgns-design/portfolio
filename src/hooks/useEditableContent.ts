import { useState, useCallback } from 'react';

/**
 * useEditableContent — 편집 가능한 콘텐츠 상태 + localStorage 영속화
 * 관리자 편집 모드에서 수정한 내용이 이 브라우저에 저장되어 새로고침 후에도 유지됩니다.
 * (서버 동기화가 필요하면 본인 Supabase 연결 후 별도 구현)
 */
const LS_PREFIX = 'mk_edit:';

export const useEditableContent = (initialData: any, key: string) => {
  const [data, setDataState] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_PREFIX + key);
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return initialData;
  });
  // 동기 초기화이므로 항상 로드 완료 상태
  const [loaded] = useState(true);

  const updateData = useCallback((newData: any) => {
    setDataState(newData);
    try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(newData)); }
    catch (e) { console.warn(`로컬 저장 실패 (${key}). 용량을 초과했을 수 있습니다.`, e); }
  }, [key]);

  return [data, updateData, loaded];
};

/** 저장된 편집 내용 초기화 (필요 시 사용) */
export const clearEditableContent = (key: string) => {
  try { localStorage.removeItem(LS_PREFIX + key); } catch { /* ignore */ }
};
