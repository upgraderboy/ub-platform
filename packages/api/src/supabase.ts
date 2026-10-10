import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Safe environment variables retrieval across browser, server, and edge environments
export function getSupabaseConfig() {
  const supabaseUrl =
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
      : '';
  const supabaseAnonKey =
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''
      : '';

  const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

  return {
    supabaseUrl,
    supabaseAnonKey,
    isConfigured,
  };
}

let browserClient: SupabaseClient | null = null;

/**
 * Creates or retrieves the singleton Supabase browser client.
 * Returns null if Supabase environment variables are missing.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  const { supabaseUrl, supabaseAnonKey, isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient;
}

/**
 * Create a standalone server Supabase client for Server Actions / Route Handlers
 */
export function createSupabaseServerClient(serviceRoleKey?: string): SupabaseClient | null {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  const key = serviceRoleKey || supabaseAnonKey;

  if (!supabaseUrl || !key) {
    return null;
  }

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
    },
  });
}
