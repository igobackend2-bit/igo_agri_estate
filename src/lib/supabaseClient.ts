import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder-url.supabase.co';
export const isSupabaseConfigured = Boolean(isConfigured);

if (!isConfigured) {
  console.warn('Supabase credentials missing or using placeholders. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

// Create a dummy client if not configured to prevent crashes, but it will fail on actual calls
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

/**
 * Direct PostgREST call using Fetch API.
 * Bypasses the Supabase library to avoid hangups and allow strict timeouts.
 */
export const directPostgREST = async (table: string, method: 'POST' | 'PATCH' | 'GET', body?: any, query?: string) => {
  if (!isConfigured) return { error: { message: 'Supabase not configured' } };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second strict timeout

  try {
    const url = `${supabaseUrl}/rest/v1/${table}${query ? `?${query}` : ''}`;
    const response = await fetch(url, {
      method,
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    clearTimeout(timeoutId);
    return { error: { message: err.name === 'AbortError' ? 'Request Timeout' : err.message } };
  }
};
