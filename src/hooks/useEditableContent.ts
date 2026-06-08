import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const SUPABASE_TIMEOUT_MS = 3000;

export const useEditableContent = (initialData: any, key: string) => {
  const [data, setData] = useState(initialData);
  const [loaded, setLoaded] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Temporarily bypassing Supabase load for demonstration of new local data features
    setLoaded(true);
    /*
    const loadFromSupabase = async () => {
      try {
        const timeoutPromise = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), SUPABASE_TIMEOUT_MS)
        );
        const fetchPromise = supabase
          .from('portfolio_content')
          .select('content')
          .eq('key', key)
          .maybeSingle();

        const result = await Promise.race([fetchPromise, timeoutPromise]);

        if (result && 'data' in result) {
          const { data: row, error } = result;
          if (!error && row?.content) {
            setData(row.content);
          }
        } else {
          console.warn(`Supabase timeout for key "${key}", using defaults.`);
        }
      } catch (e) {
        console.warn(`Supabase load failed for key "${key}", using defaults.`);
      } finally {
        setLoaded(true);
      }
    };
    loadFromSupabase();
    */
  }, [key]);

  const saveToSupabase = useCallback(async (newData: any) => {
    try {
      await supabase
        .from('portfolio_content')
        .upsert({ key, content: newData }, { onConflict: 'key' });
    } catch (e) {
      console.error(`Supabase save failed for key "${key}":`, e);
    }
  }, [key]);

  const updateData = useCallback((newData: any) => {
    setData(newData);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveToSupabase(newData);
    }, 500);
  }, [saveToSupabase]);

  return [data, updateData, loaded];
};
